/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import { Loader } from '../../../common/LoaderComponent'
import Input from '../../../common/InputComponent'
import AddOns from '../../../common/InputAddOnComponents'
import LangText, { getLangText } from '../../../../common/lang/LangText'
import useCloseModal from '../../../../customHooksComponents/useCloseModal';
import OTPInputComponent from '../../../common/OTPInputComponent'

import { LOGIN } from '../../../../config/ServiceURLs'
import {
    checkValidUserName, specialCharFinder,
    convertToUpperCase, getTradingBaseURL, checkValidPan_DOB
} from '../../../../common/CommonMethods'
import { LOCAL_STORAGE, PAN_DOB_INPUT, SET_TIMEOUT_INTERVAL } from '../../../../common/Constants';
import { getItemFromSessionStorage } from '../../../../common/LocalStorage'

const ForgetPasswordDialogComponent = (props) => {

    const MsfFetch = useFetch()

    const [userName, setUserName] = useState('')
    const [pan_dob, setPan_Dob] = useState('')
    const [otp, setOTP] = useState('')
    const [inputError, setInputError] = useState({})
    const [errorMsg, setErrorMsg] = useState('')
    const [showOTPField, setShowOTPField] = useState(false)
    const [minutes, setMinutes] = useState(null);
    const [initalSeconds, setSeconds] = useState(null);
    const [enableResendOTP, setEnableResendOTP] = useState(false)
    const [OTPTime, setOTPTime] = useState('')

    const userNameRef = useRef('')
    const panNoRef = useRef('')
    const submitBtnRef = useRef('')
    const resetTimer = useRef(null)
    const isPendingRequest = useRef(false)

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef)

    useEffect(() => {
        userNameRef.current.focus()
        let time = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.OTP_TIMER))
        setOTPTime(time)
        return () => {
            clearInterval(resetTimer.current)
        }
    }, [])

    function setOTPTimer() {

        let min = Math.floor(OTPTime / 60)
        let sec = OTPTime - (minutes * 60);
        resetTimer.current = setInterval(() => {
            if (sec > 0) {
                sec = sec - 1
            }
            else if (sec === 0) {
                if (min === 0) {
                    setClearInterval()
                    setEnableResendOTP(true)

                } else {
                    min = min - 1
                    sec = 59
                }
            }
            setSeconds(sec)
            setMinutes(min)
        }, SET_TIMEOUT_INTERVAL.RESEND_OTP_TIMER);

    }

    function setClearInterval() {
        if (resetTimer.current) {
            clearInterval(resetTimer.current)
        }
        clearInterval(resetTimer.current)
    }

    function onchangeVal(e) {
        if (e.target.name === "userName")
            if (!specialCharFinder(e.target.value))
                setUserName(convertToUpperCase(e.target.value))
        if (e.target.name === "pan_dob")
            if (!specialCharFinder(e.target.value))
                setPan_Dob(convertToUpperCase(e.target.value))
    }

    function onKeyPress(e) {

        // let { target } = e;
        if (e.key === 'Enter') {
            if (e.target.name  === 'userName')
                panNoRef.current.focus()
            else if (e.target.name  === 'pan_dob') {
                onClickSubmit()
                submitBtnRef.current.focus()
            }
        }
    }

    // function onBlurInput(e) {
    //     let error = {}
    //     if (e.target.name === "userName") {
    //         let nameValidation = checkValidUserName(userName)
    //         if (!nameValidation.isValid)
    //             error.userName = nameValidation.errorMsg
    //     }
    //     if (e.target.name === "pan_dob") {
    //         let pan_dob_Validation = checkValidPan_DOB(pan_dob)
    //         if (!pan_dob_Validation.isValid)
    //             error.pan_dob = pan_dob_Validation.errorMsg
    //     }

    //     setInputError(error)
    // }

    function onClickSubmit() {
        let minutessubmit = Math.floor(OTPTime / 60)
        let seconds = OTPTime - (minutessubmit * 60);
        setMinutes(minutessubmit)
        setSeconds(seconds)
        let error = {}
        let placeReq = true
        setErrorMsg('')

        let nameValidation = checkValidUserName(userName)
        let pan_dob_Validation = checkValidPan_DOB(pan_dob, PAN_DOB_INPUT.PAN)

        if (!nameValidation.isValid) {
            placeReq = false
            error.userName = nameValidation.errorMsg
        }
        if (!pan_dob_Validation.isValid) {
            placeReq = false
            error.pan_dob = pan_dob_Validation.errorMsg
        }
        setInputError(error)
        if (placeReq)
            placeReqForgetPassword()
    }

    function placeReqForgetPassword() {
        if (!isPendingRequest.current) {
            isPendingRequest.current = true
            props.showLoader();
            let request = new MsfRequest();
            request.addToData({ 'uid': userName, "panNumber": pan_dob })
            MsfFetch.placeRequest(
                getTradingBaseURL() + LOGIN.GENERATE_OTP,
                request,
                successCBForgetPassword,
                errorCBForgetPassword
            )
        }
    }

    function successCBForgetPassword() {
        isPendingRequest.current = false
        props.hideLoader();
        setShowOTPField(true)
        setErrorMsg()
        setEnableResendOTP(false)
        setOTPTimer()
    }

    function errorCBForgetPassword(error) {
        isPendingRequest.current = false
        setErrorMsg(error.message)
        setShowOTPField(false)
        props.hideLoader();
    }

    function getOTP(otpVal, onEnter) {
        setOTP(otpVal)
        if (onEnter)
            verifyOTP()
    }

    function verifyOTP() {
        let error = {}
        let placeReq = true
        setErrorMsg('')
        if (otp.length != 4) {
            placeReq = false
            error.otp = getLangText("INVALID_OTP", "MESSAGES")
        }

        setInputError(error)

        if (placeReq)
            placeReqVerifyOTP()
    }

    function placeReqVerifyOTP() {
        if (!isPendingRequest.current) {
            isPendingRequest.current = true
            props.showLoader();
            let request = new MsfRequest();
            request.addToData({ 'uid': userName, "otp": otp })
            MsfFetch.placeRequest(
                getTradingBaseURL() + LOGIN.VALIDATE_OTP,
                request,
                successCBVerifyOTP,
                errorCBVerifyOTP
            )
        }
    }

    function successCBVerifyOTP() {
        props.hideLoader();
        isPendingRequest.current = false
        props.showSetPasswordCB && props.showSetPasswordCB(userName)
    }

    function errorCBVerifyOTP(error) {
        setErrorMsg(error.message)
        props.hideLoader();
        isPendingRequest.current = false
    }

    function checkSingleDigit(val) {
        let value = val.toString()
        let twoDigits = value.padStart(2, '0')
        return twoDigits
    }
    return (
        <div className="app-modalDialog forget-password-dialog">
            <div className="window" ref={modalRef}>
                <div className="title">
                    <span className="title-name">
                        <LangText  name="FORGET_PASSWORD" />
                    </span>
                    {/* <CloseIcon onClick={props.onCloseCB} /> */}
                </div>
                <div className="content">
                    <div className="row infoMsg-div">
                        <div className="infoMsg">
                            <LangText  name="FORGET_PASSWORD_INFO_MSG" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="label">
                            <LangText  name="USERID_TXT" />
                        </div>
                        <div className={`input-div hasAddOn ${inputError.userName ? 'errorInput' : ''}`}>
                            <AddOns.UseridInputAddOn />
                            <Input
                                className="inputVal"
                                ref={userNameRef}
                                name="userName"
                                value={userName}
                                onChange={onchangeVal}
                                placeholder={getLangText('USERID_PHOLDER', 'LOGIN')}
                                test_id="forgetPwdUserName"
                                onKeyPress={(e) => onKeyPress(e)}
                                disabled={showOTPField}
                            // onBlur={(e) => onBlurInput(e)}
                            />
                        </div>
                        <div className="errorDiv">
                            <span className="error">{inputError.userName}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="label">
                            <LangText  name="PAN_TXT" />
                        </div>
                        <div className={`input-div hasAddOn ${inputError.pan_dob ? 'errorInput' : ''}`}>
                            <AddOns.PanInputAddOn />
                            <Input
                                className="inputVal"
                                ref={panNoRef}
                                name="pan_dob"
                                value={pan_dob}
                                placeholder={getLangText('PAN_NO_PHOLDER', 'LOGIN')}
                                onChange={onchangeVal}
                                test_id="forgetPwdPanNumber"
                                maxLength={10}
                                onKeyPress={(e) => onKeyPress(e)}
                                disabled={showOTPField}
                            // onBlur={(e) => onBlurInput(e)}
                            />
                        </div>

                        <div className="errorDiv">
                            <span className="error">{inputError.pan_dob}</span>
                        </div>
                    </div>
                    {
                        showOTPField ?
                            <div className="row OTP">
                                <div className="label">
                                    <LangText module="LOGIN" name="OTP" />
                                </div>
                                <div className="otp_time">
                                    <OTPInputComponent getOTP={getOTP} />
                                    {
                                        (enableResendOTP) ?
                                            ''
                                            : <span className="otp-span-time">
                                                {checkSingleDigit(minutes)} : {checkSingleDigit(initalSeconds)}
                                            </span>
                                    }

                                </div>
                                <div className="errorDiv">
                                    <span className="error">{inputError.otp}</span>
                                </div>
                            </div>
                            : null
                    }

                    <div className="commonErrorDiv flex-center">
                        {
                            showOTPField ?
                                <div className={`receive-otp ${!enableResendOTP ? 'isDisabled' : ''}`}>
                                    <LangText module="LOGIN" name="DINT_REIEVE_OTP" />
                                    <span className="resend cursor"
                                        ref={submitBtnRef}
                                        onClick={onClickSubmit}
                                        test_id="forgetPwdSubmit_btn"
                                    >  <LangText  name="RESEND_OTP" />
                                    </span>

                                </div> : ''
                        }
                        <span className="error">{errorMsg}</span>
                    </div>
                </div>
                <div className="footer">
                    <button className="negativeBtn" onClick={props.onCloseCB}>
                        <LangText  name="CANCEL" />
                    </button>
                    {

                        showOTPField ?
                            <>
                                <button className="left-btn positiveBtn"
                                    onClick={verifyOTP}
                                    test_id="verify_otp"
                                >
                                    <LangText  name="VERIFY_OTP" />
                                </button>
                            </>
                            :
                            <button className="left-btn positiveBtn"
                                ref={submitBtnRef}
                                onClick={onClickSubmit}
                                test_id="forgetPwdSubmit_btn"
                            >
                                <LangText  name="SUBMIT" />
                            </button>

                    }
                </div>
            </div>
        </div>
    )
}

export default Loader(ForgetPasswordDialogComponent);