/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import { Loader } from '../../../common/LoaderComponent'
import Input from '../../../common/InputComponent'
import AddOns from '../../../common/InputAddOnComponents'
import LangText, { getLangText } from '../../../../common/lang/LangText'
import useCloseModal from '../../../../customHooksComponents/useCloseModal';

import { LOGIN } from '../../../../config/ServiceURLs'
import { checkValidPassword, getTradingBaseURL, isValidPassword } from '../../../../common/CommonMethods'

import { PASSWORD_MAX_LENGTH } from '../../../../common/Constants'
import { EyeCloseIcon, EyeOpenIcon } from '../../../common/FontIcons'

const ResetPasswordDialogComponent = (props) => {

    const MsfFetch = useFetch()

    const [currentPassword, setCurrPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [inputError, setInputError] = useState({})
    const [errorMsg, setErrorMsg] = useState('')
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const currPwdRef = useRef('')
    const newPwdRef = useRef('')
    const confirmPwdRef = useRef('')
    const submitBtnRef = useRef('')
    const isPendingRequest = useRef(false)

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef)

    useEffect(() => {
        currPwdRef.current.focus()
    }, [])

    function onchangeVal(e) {
        if (!isValidPassword(e.target.value)) {
            if (e.target.name === "currentPassword")
                setCurrPassword(e.target.value)
            if (e.target.name === "newPassword")
                setNewPassword(e.target.value)
            if (e.target.name === "confirmPassword")
                setConfirmPassword(e.target.value)
        }
    }

    function onKeyPress(e) {
        // let { target: { name } } = e;
        if (e.key === 'Enter') {
            if (e.target.name === 'currentPassword')
                newPwdRef.current.focus()
            else if (e.target.name === 'newPassword')
                confirmPwdRef.current.focus()
            else if (e.target.name === "confirmPassword") {
                onClickSubmit()
                submitBtnRef.current.focus()
            }
        }
    }

    // function onBlurInput(e) {
    //     let error = {}
    //     if (e.target.name === "currentPassword") {
    //         let passwordValidation = checkValidPassword(currentPassword)
    //         if (!passwordValidation.isValid)
    //             error.currentPassword = passwordValidation.errorMsg
    //     }
    //     if (e.target.name === "newPassword") {
    //         let passwordValidation = checkValidPassword(newPassword)
    //         if (!passwordValidation.isValid)
    //             error.newPassword = passwordValidation.errorMsg
    //     }
    //     if (e.target.name === "confirmPassword") {
    //         let passwordValidation = checkValidPassword(confirmPassword)
    //         if (!passwordValidation.isValid)
    //             error.confirmPassword = passwordValidation.errorMsg
    //     }

    //     setInputError(error)
    // }

    function onClickSubmit() {
        let error = {}
        let placeReq = true
        setErrorMsg('')

        let newPwdValidation = checkValidPassword(newPassword)
        let confirmPwdValidation = checkValidPassword(confirmPassword)

        if (currentPassword === "") {
            placeReq = false
            error.currentPassword = getLangText('PASSWORD_EMPTY', 'VALIDATION')
        }
        if (!newPwdValidation.isValid) {
            placeReq = false
            error.newPassword = newPwdValidation.errorMsg
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
    }

    function placeReqResetPassword() {
        if (!isPendingRequest.current) {
            isPendingRequest.current = true
            props.showLoader();
            let request = new MsfRequest();
            request.addToData({
                'uid': props.userId,
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
        isPendingRequest.current = false
        props.hideLoader();
        props.parentCB && props.parentCB(response)
    }

    function errorCBResetPassword(error) {
        isPendingRequest.current = false
        setErrorMsg(error.message)
        props.hideLoader();
    }

    return (
        <div className="app-modalDialog reset-password-dialog" test_id="resetPwd_dialog">
            <div className="window" ref={modalRef}>
                <div className="title flex-center">
                    <span className="title-name"><LangText  name="RESET_PASSWORD" /></span>
                    {/* <CloseIcon onClick={props.onCloseCB} /> */}
                </div>
                <div className="content">
                    <div className="row infoMsg-div">
                        <div className="infoMsg"><LangText  name="RESET_PASSWORD_INFO_MSG" /></div>
                    </div>
                    <div className="row">
                        <div className="label"><LangText  name="CURRENT_PASSWORD" /></div>
                        <div className={`input-div hasAddOn hasInnerAddOn ${inputError.currentPassword ?
                            'errorInput' : ''}`}>
                            <AddOns.PasswordInputAddOn />
                            <Input
                                type={showCurrentPassword ? 'text' : 'password'}
                                className="inputVal"
                                ref={currPwdRef}
                                name="currentPassword"
                                value={currentPassword}
                                onChange={onchangeVal}
                                test_id="resetPwd_currPwd"
                                onKeyPress={(e) => onKeyPress(e)}
                                // onBlur={(e) => onBlurInput(e)}
                                maxLength={PASSWORD_MAX_LENGTH}
                                preventPaste={true}
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
                            <div className="error text-nowrap" title={inputError.currentPassword}>
                                {inputError.currentPassword}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="label"><LangText  name="NEW_PASSWORD" /></div>
                        <div className={`input-div hasAddOn hasInnerAddOn ${inputError.newPassword ?
                            'errorInput' : ''}`}>
                            <AddOns.PasswordInputAddOn />
                            <Input
                                type={showNewPassword ? 'text' : 'password'}
                                className="inputVal"
                                ref={newPwdRef}
                                name="newPassword"
                                value={newPassword}
                                onChange={onchangeVal}
                                test_id="resetPwd_newPwd"
                                onKeyPress={(e) => onKeyPress(e)}
                                // onBlur={(e) => onBlurInput(e)}
                                maxLength={PASSWORD_MAX_LENGTH}
                                preventPaste={true}
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
                            <div className="error text-nowrap" title={inputError.newPassword}>
                                {inputError.newPassword}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="label"><LangText module="LOGIN" name="CONFIRM_PASSWORD" /></div>
                        <div className={`input-div hasAddOn hasInnerAddOn ${inputError.confirmPassword ?
                            'errorInput' : ''}`}>
                            <AddOns.PasswordInputAddOn />
                            <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="inputVal"
                                ref={confirmPwdRef}
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={onchangeVal}
                                test_id="resetPwd_confirmPwd"
                                onKeyPress={(e) => onKeyPress(e)}
                                // onBlur={(e) => onBlurInput(e)}
                                maxLength={PASSWORD_MAX_LENGTH}
                                preventPaste={true}
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
                            <div className="error text-nowrap" title={inputError.confirmPassword}>
                                {inputError.confirmPassword}
                            </div>
                        </div>
                    </div>
                    <div className="commonErrorDiv flex-center">
                        <span className="error">{errorMsg}</span>
                    </div>
                </div>
                <div className="footer">
                    {/* <button className="negativeBtn" onClick={props.onCloseCB}><LangText module="BUTTONS" name="CANCEL" /></button> */}
                    <button className="left-btn positiveBtn"
                        ref={submitBtnRef}
                        onClick={onClickSubmit}
                        test_id="resetPwd_submitBtn"
                    >
                        <LangText  name="SAVE" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Loader(ResetPasswordDialogComponent);