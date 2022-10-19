import React, { useState, useRef, useEffect } from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../../index'

import { Loader } from '../../../common/LoaderComponent'
import Input from '../../../common/InputComponent'
import AddOns from '../../../common/InputAddOnComponents'
import LangText, { getLangText } from '../../../../common/lang/LangText'
// import useCloseModal from '../../../../customHooksComponents/useCloseModal';

import { showAppDialog } from '../../../../state/actions/Actions'

import { LOGIN } from '../../../../config/ServiceURLs'
import { checkValidPassword, getTradingBaseURL, isValidPassword } from '../../../../common/CommonMethods'

import { DEFAULT_VALUES, PASSWORD_MAX_LENGTH, THEMES } from '../../../../common/Constants'
import { EyeCloseIcon, EyeOpenIcon } from '../../../common/FontIcons'

const SetPasswordDialogComponent = (props) => {

    const MsfFetch = useFetch()

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [inputError, setInputError] = useState({})
    const [errorMsg, setErrorMsg] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [viewPasswordTool, setViewPasswordTool] = useState(false)

    const [passwordLength,setPasswordLength] = useState(false)
    const [passwordUpper,setPasswordUpper] = useState(false)
    const [passwordLower,setPasswordLower] = useState(false)
    const [passwordSpecial,setPasswordSpecial] = useState(false)

    const newPwdRef = useRef('')
    const confirmPwdRef = useRef('')
    const submitBtnRef = useRef('')
    const isPendingRequest = useRef(false)

    const modalRef = useRef(null)
    // const closeModal = useCloseModal()
    // closeModal.useOutsideAlerter(modalRef,closeCB)
    const modalPasswordRef = useRef(null)
    // const closeModalPass = useCloseModal()
    // closeModalPass.useOutsideAlerter(modalPasswordRef, closeCB)

    useEffect(() => {
        newPwdRef.current.focus()
    }, [])

    function onchangeVal(e) {
        if (!isValidPassword(e.target.value)) {
            if (e.target.name === "newPassword"){
                setNewPassword(e.target.value)
                onChangePasswordCB(e.target.value)
            }
            if (e.target.name === "confirmPassword")
                setConfirmPassword(e.target.value)
        }
    }

    function onFocusInput(e) {
        if (e.target.name === 'newPassword')
            setViewPasswordTool(true)
        else
            setViewPasswordTool(false) 
    }

    // function onClose() {
    //     setViewPasswordTool(false)
    // }

    // function closeCB() {
    //     setViewPasswordTool(false) 
    // }

    function onChangePasswordCB(value) {
        let lowerRegex = /^(?=.*[a-z])/
        let upperRegex = /^(?=.*[A-Z])/  
        let splChar = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/    
        if (value.length > DEFAULT_VALUES.PASSSWORD_MIN_LEN) 
            setPasswordLength(true)
        else
            setPasswordLength(false)
        
        if(lowerRegex.test(value)) 
            setPasswordLower(true)
        else
            setPasswordLower(false)

        if(upperRegex.test(value)) 
            setPasswordUpper(true)
        else
            setPasswordUpper(false)
        
        if(splChar.test(value)) 
            setPasswordSpecial(true)
        else 
            setPasswordSpecial(false)
    }

    function onKeyPress(e) {
        // let { target: { name } } = e;
        if (e.key === 'Enter') {
            if (e.target.name === 'newPassword')
                confirmPwdRef.current.focus()
            else if (e.target.name === "confirmPassword") {
                onClickSubmit()
                submitBtnRef.current.focus()
            }
        }
    }

    function onClickSubmit() {
        let error = {}
        let placeReq = true
        setErrorMsg('')

        let newPwdValidation = checkValidPassword(newPassword)
        let confirmPwdValidation = checkValidPassword(confirmPassword)

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
            placeReqSetPassword()
    }

    function placeReqSetPassword() {
        if (!isPendingRequest.current) {
            isPendingRequest.current = true
            props.showLoader();
            let request = new MsfRequest();
            request.addToData({
                'uid': props.userId,
                "pwd": newPassword
            })
            MsfFetch.placeRequest(
                getTradingBaseURL() + LOGIN.SET_PASSWORD,
                request,
                successCBSetPassword,
                errorCBSetPassword
            )
        }
    }

    function successCBSetPassword(response) {
        isPendingRequest.current = false
        props.hideLoader();
        props.showAppDialog({
            show: true,
            message: response.message ? response.message : getLangText("PASSWORD_CHANGE_SUCCESS", "MESSAGES")
        })
        props.onCloseCB && props.onCloseCB()
    }

    function errorCBSetPassword(error) {
        isPendingRequest.current = false
        setErrorMsg(error.message)
        props.hideLoader();
    }

    function getImgPassword(value) {
        if(!value) {
            return(
                <img className="tick-img" src={props.selectedTheme.theme === THEMES.LIGHT ?
                    "assets/images/password_policy_nor.svg" : "assets/images/dark/password_policy_nor.svg"} alt="" />
            )
        }
        return(
            <img className="tick-img" src={props.selectedTheme.theme === THEMES.LIGHT ?
                "assets/images/password_policy_sel.svg" : "assets/images/dark/password_policy_sel.svg"} alt="" />
        )
        
    }

    return (
        <div className="app-modalDialog reset-password-dialog" test_id="resetPwd_dialog">
            <div className="window" ref={modalRef}>
                <div className="title flex-center">
                    <span className="title-name"><LangText name="SET_PASSWORD" /></span>
                    {/* <CloseIcon onClick={props.onCloseCB} /> */}
                </div>
                <div className="content">
                    <div className="row">
                        <div className="label"><LangText name="NEW_PASSWORD" /></div>
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
                                onFocus={onFocusInput}
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
                        <div className="label"><LangText  name="CONFIRM_PASSWORD" /></div>
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
                                onFocus={onFocusInput}
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
                    {
                        viewPasswordTool ?
                            <div className="password-policy" ref={modalPasswordRef}>
                                <span className="password-should">
                                    <LangText  name="PASSWORD_SHOULD" />
                                </span>
                                <div className="passdiv">
                                    {passwordLength ? getImgPassword(passwordLength) :  getImgPassword(passwordLength)}
                                    <span className="password-msg">
                                        <LangText name="PASSWORD_LEN" />
                                    </span>
                                </div>
                                <div className="passdiv">
                                    {passwordUpper ? getImgPassword(passwordUpper) :  getImgPassword(passwordUpper)}
                                    <span className="password-msg">
                                        <LangText  name="PASSWORD_UPPER_CHAR" />
                                    </span>
                                </div>
                                <div className="passdiv">
                                    {passwordLower ? getImgPassword(passwordLower) :  getImgPassword(passwordLower)}
                                    <span className="password-msg">
                                        <LangText  name="PASSWORD_LOWER_CHAR" />
                                    </span>
                                </div>
                                <div className="passdiv">
                                    {passwordSpecial ? getImgPassword(passwordSpecial) :
                                        getImgPassword(passwordSpecial)}
                                    <span className="password-msg">
                                        <LangText  name="PASSWORD_SP_CHAR" />
                                    </span>
                                </div>
                            </div>
                            :
                            null
                    }
                    <div className="commonErrorDiv flex-center">
                        <span className="error">{errorMsg}</span>
                    </div>
                </div>
                <div className="footer">
                    <button className="negativeBtn" onClick={props.onCloseCB}>
                        <LangText module="BUTTONS" name="CANCEL" /></button>
                    <button className="left-btn positiveBtn"
                        ref={submitBtnRef}
                        onClick={onClickSubmit}
                        test_id="resetPwd_submitBtn"
                    >
                        <LangText name="SAVE" />
                    </button>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(SetPasswordDialogComponent));