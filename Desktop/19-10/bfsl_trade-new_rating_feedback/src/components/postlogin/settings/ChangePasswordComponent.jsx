import React, { useEffect, useRef, useState } from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../index'

import AddOns from '../../common/InputAddOnComponents';
import Input from '../../common/InputComponent';
import LangText, { getLangText } from '../../../common/lang/LangText';
import { Loader } from '../../common/LoaderComponent'

import { handleLogout } from '../../../common/Bridge';
import { LOGIN } from '../../../config/ServiceURLs';

import { showAppDialog } from '../../../state/actions/Actions';
import {
    AF_EventTriggered,
    checkValidPassword, convertToUpperCase, getBaseURL,
    getTradingBaseURL, isValidPassword
} from '../../../common/CommonMethods';
import { AF_EVENT_NAMES, AF_EVENT_TYPES, LOCAL_STORAGE, PASSWORD_MAX_LENGTH } from '../../../common/Constants';
import { getItemByKey } from '../../../common/LocalStorage';
import { EyeCloseIcon, EyeOpenIcon } from '../../common/FontIcons';

function ChangePasswordComponent(props) {

    const MsfFetch = useFetch()

    const [inputError, setInputError] = useState({})
    const [errorMsg, setErrorMsg] = useState('')

    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [focusedField, setFocusedField] = useState('')

    const currPwdRef = useRef(null)
    const newPwdRef = useRef(null)
    const confirmPwdRef = useRef(null)
    const submitBtnRef = useRef(null)
    const isPendingRequest = useRef(false)

    useEffect(() => {
        // currPwdRef.current.focus()
    }, [])

    function onchangeVal(e) {
        if (!isValidPassword(e.target.value)) {
            if (e.target.name === "currentPassword")
                setCurrentPassword(e.target.value)
            if (e.target.name === "newPassword") {
                setNewPassword(e.target.value)
                props.onChangePasswordCB(e.target.value)
            }
            if (e.target.name === "confirmPassword")
                setConfirmPassword(e.target.value)
        }
    }

    function onKeyPress(e) {
        if (e.key === 'Enter') {
            if (e.target.name === 'currentPassword')
                newPwdRef.current.focus()
            else if (e.target.name === 'newPassword')
                confirmPwdRef.current.focus()
            else if (e.target.name === "confirmPassword") {
                onClickSave()
                submitBtnRef.current.focus()
            }
        }
    }

    function onResetData() {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setInputError('')
    }

    function onClickSave() {
        let userId = convertToUpperCase(getItemByKey(LOCAL_STORAGE.USER_ID))

        let newPass_Upper = convertToUpperCase(newPassword)
        let error = {}
        let placeReq = true
        setErrorMsg('')

        let newPwdValidation = checkValidPassword(newPassword)
        let confirmPwdValidation = checkValidPassword(confirmPassword)

        if (currentPassword === "") {
            placeReq = false
            error.currentPassword = getLangText('PASSWORD_EMPTY', 'VALIDATION')
        }
        if ((!newPwdValidation.isValid)) {
            placeReq = false
            error.newPassword = newPwdValidation.errorMsg
        }
        if (newPass_Upper && userId && newPass_Upper.includes(userId)) {
            placeReq = false
            error.newPassword = getLangText('NEW_PASSWORD_ERROR', 'VALIDATION')
        }
        if (!confirmPwdValidation.isValid) {
            placeReq = false
            error.confirmPassword = confirmPwdValidation.errorMsg
        }
        if (newPwdValidation.isValid && confirmPwdValidation.isValid && newPassword !== confirmPassword) {
            placeReq = false
            error.confirmPassword = getLangText('CONFIRM_PASSWORD_ERROR', 'VALIDATION')
        }
        setInputError(error)

        if (placeReq)
            placeReqResetPassword()
        AF_EventTriggered(AF_EVENT_NAMES.SETTINGS , AF_EVENT_TYPES.PWD_CHANGED)    
    }

    function placeReqResetPassword() {
        if (!isPendingRequest.current) {
            isPendingRequest.current = true
            props.showLoader();
            let request = new MsfRequest();
            request.addToData({
                'pwd': currentPassword,
                "newPwd": newPassword
            })
            MsfFetch.placeRequest(
                getTradingBaseURL() + LOGIN.CHANGE_PASSWORD,
                request,
                successCBResetPassword,
                errorCBResetPassword
            )
        }
    }

    function successCBResetPassword(response) {
        props.showAppDialog({
            message: response.infoMsg,
            show: true,
            closeCB: onLogOut
        })
        props.hideLoader();
    }

    function errorCBResetPassword(error) {
        props.showAppDialog({
            message: error.message,
            show: true
        })
        props.hideLoader();
    }

    function onLogOut() {
        props.showAppDialog({         
            show: false
        })
        props.showLoader();
        let request = new Request();
        fetch.placeRequest(
            getBaseURL() + LOGIN.USER_LOGOUT,
            request,
            null,
            null,
            false
        )
        handleLogout()
    }

    function onFocusInput(e) {
        setFocusedField(e.target.name)
        props.onFocusCB(e.target.name)
    }

    function onBlurInput() {
        setFocusedField('')
    }

    return (
        <div className="pwd-sett">
            <div className="pwd-sett-base">
                <span className="label password-label">
                    <LangText module="LOGIN" name="CURRENT_PASSWORD" />
                </span>
                <div className={`input-div hasAddOn hasInnerAddOn 
                ${focusedField === "currentPassword" ? 'focusInputDiv' : 'blurInputDiv'}
                    ${inputError.currentPassword ? 'errorInput' : ''}`}>
                    <AddOns.PasswordInputAddOn />
                    <Input
                        ref={currPwdRef}
                        test_id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="inputVal"
                        name="currentPassword"
                        placeholder={getLangText("PASSWORD_PHOLDER", "LOGIN")}
                        value={currentPassword}
                        onChange={onchangeVal}
                        onKeyPress={(e) => onKeyPress(e)}
                        onFocus={onFocusInput}
                        onBlur={onBlurInput}
                        maxLength={PASSWORD_MAX_LENGTH}
                    />
                    {
                        showCurrentPassword ?
                            <EyeOpenIcon className="addOnInnerIcon floatRight"
                                onClick={() => setShowCurrentPassword(false)}
                            />
                            :
                            <EyeCloseIcon className="addOnInnerIcon floatRight"
                                onClick={() => setShowCurrentPassword(true)}
                            />
                    }
                </div>
                <div className="errorDiv">
                    <div className="error passwordError text-nowrap" title={inputError.currentPassword}>
                        {inputError.currentPassword}
                    </div>
                </div>
                <span className="label password-label">
                    <LangText module="LOGIN" name="NEW_PASSWORD" />
                </span>
                <div className={`input-div hasAddOn hasInnerAddOn 
                ${focusedField === "newPassword" ? 'focusInputDiv' : 'blurInputDiv'}
                     ${inputError.newPassword ? 'errorInput' : ''}`}>
                    <AddOns.PasswordInputAddOn />
                    <Input
                        ref={newPwdRef}
                        test_id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        className="inputVal"
                        name="newPassword"
                        placeholder={getLangText("PASSWORD_PHOLDER", "LOGIN")}
                        value={newPassword}
                        onChange={onchangeVal}
                        onKeyPress={(e) => onKeyPress(e)}
                        onFocus={onFocusInput}
                        onBlur={onBlurInput}
                        maxLength={PASSWORD_MAX_LENGTH}
                    />
                    {
                        showNewPassword ?
                            <EyeOpenIcon className="addOnInnerIcon floatRight"
                                onClick={() => setShowNewPassword(false)}
                            />
                            :
                            <EyeCloseIcon className="addOnInnerIcon floatRight"
                                onClick={() => setShowNewPassword(true)}
                            />
                    }
                </div>
                <div className="errorDiv">
                    <div className="error passwordError text-nowrap" title={inputError.newPassword}>
                        {inputError.newPassword}
                    </div>
                </div>
                <span className="label password-label">
                    <LangText module="LOGIN" name="CONFIRM_PASSWORD" />
                </span>
                <div className={`input-div hasAddOn hasInnerAddOn
                    ${focusedField === "confirmPassword" ? 'focusInputDiv' : 'blurInputDiv'}
                    ${inputError.confirmPassword ? 'errorInput' : ''}`}>
                    <AddOns.PasswordInputAddOn />
                    <Input
                        ref={confirmPwdRef}
                        test_id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="inputVal"
                        name="confirmPassword"
                        placeholder={getLangText("PASSWORD_PHOLDER", "LOGIN")}
                        value={confirmPassword}
                        onChange={onchangeVal}
                        onKeyPress={(e) => onKeyPress(e)}
                        onFocus={onFocusInput}
                        onBlur={onBlurInput}
                        maxLength={PASSWORD_MAX_LENGTH}
                    />
                    {
                        showConfirmPassword ?
                            <EyeOpenIcon className="addOnInnerIcon floatRight"
                                onClick={() => setShowConfirmPassword(false)}
                            />
                            :
                            <EyeCloseIcon className="addOnInnerIcon floatRight"
                                onClick={() => setShowConfirmPassword(true)}
                            />
                    }
                </div>
                <div className="errorDiv">
                    <div className="error passwordError text-nowrap" title={inputError.confirmPassword}>
                        {inputError.confirmPassword}
                    </div>
                </div>
                <div className="commonErrorDiv flex-center">
                    <span className="error">{errorMsg}</span>
                </div>
            </div>
            <div className="footer">
                <button className="negativeBtn"
                    onClick={onResetData}>
                    <LangText module="BUTTONS" name="RESET" />
                </button>
                <button className="left-btn positiveBtn"
                    ref={submitBtnRef}
                    onClick={onClickSave}>
                    <LangText module="BUTTONS" name="SAVE" />
                </button>
            </div>
        </div >
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAppDialog: (s) => { dispatch(showAppDialog(s)) }
    };
};
export default connect(null, mapDispatchToProps)(Loader(ChangePasswordComponent));