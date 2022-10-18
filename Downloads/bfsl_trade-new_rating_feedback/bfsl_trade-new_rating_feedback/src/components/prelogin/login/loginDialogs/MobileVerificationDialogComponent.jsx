/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../../index'

import { Loader } from '../../../common/LoaderComponent'
import Input from '../../../common/InputComponent'
import LangText, { getLangText } from '../../../../common/lang/LangText'

import useCloseModal from '../../../../customHooksComponents/useCloseModal';

import { LOGIN } from '../../../../config/ServiceURLs'

import { getBackOfficeBaseURL, getGuestUserBaseURL, isValidNumber } from '../../../../common/CommonMethods'
// import { LOCAL_STORAGE } from '../../../../common/Constants'
// import { getItemFromSessionStorage } from '../../../../common/LocalStorage'
import { CheckBoxIcon_Checked, CheckBoxIcon_UnChecked, CloseIcon } from '../../../common/FontIcons';
import OTPInputComponent from '../../../common/OTPInputComponent';
import { AppSettings } from '../../../../common/AppSettings';
import { LOCAL_STORAGE, SET_TIMEOUT_INTERVAL } from '../../../../common/Constants';
import { getItemFromSessionStorage } from '../../../../common/LocalStorage';

const MobileVerificationDialogComponent = (props) => {

    const MsfFetch = useFetch()

    const [mobileNo, setMobileNo] = useState('')
    // const [otp, setOtp] = useState('')
    const [otpInputBox, setOtpInputBox] = useState('')
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [sendOTPEnabled, setSendOTPEnabled] = useState(false)
    const [verifyEnabled] = useState(false)
    const [mobileExt] = useState('+91')
    const [errorMsg, setErrorMsg] = useState('')
    const [fielderrorMsg, setFieldErrorMsg] = useState('')
    const [guestAgreeTick, setGuestAgreeTick] = useState(true)
    const [minutes, setMinutes] = useState(null);
    const [initalSeconds, setSeconds] = useState(null);
    const [enableResendOTP, setEnableResendOTP] = useState(false)
    const [OTPTime, setOTPTime] = useState('')

    // const [openAccLink, setOpenAccLink] = useState("")

    let isPendingRequest = useRef(false)
    const resetTimer = useRef(null)
    const submitBtnRef = useRef('')
    
    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef)

    useEffect(() => {
        let time = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.OTP_TIMER))
        setOTPTime(time)
        return () => {
            clearInterval(resetTimer.current)
        }
    }, [])

    // useEffect(() => {
    //     let openAccountLink = ""
    //     if (props.configStatus) {
    //         openAccountLink = getItemFromSessionStorage(LOCAL_STORAGE.OPEN_ACC_LINK)
    //     }
    //     if (openAccountLink) {
    //         openAccountLink = JSON.parse(openAccountLink)
    //         setOpenAccLink(openAccountLink)
    //     }
    // }, [props.configStatus])

    function onchangeVal(e) {
        let value = e.target.value

        if (e.target.name === "mobileNo") {
            if(isValidNumber(value))
                setMobileNo(value)
            else
                setMobileNo('')
        }
        // if (e.target.name === "otp") {
        //     setOtp(value)
        //     if (value.length > 0)
        //         setVerifyEnabled(true)
        //     else
        //         setVerifyEnabled(false)
        // }
    }

    function onClickSendOtp() {
        let mobileNoLen = mobileNo.length
        if(mobileNoLen == 10 && guestAgreeTick === true) {
            isPendingRequest.current = true
            setErrorMsg('')
            let minutessubmit = Math.floor(OTPTime / 60)
            let seconds = OTPTime - (minutessubmit * 60);
            setMinutes(minutessubmit)
            setSeconds(seconds)
            props.showLoader();
            let request = new MsfRequest();
            request.addToData({ 'mobileNo': mobileExt + mobileNo })
            MsfFetch.placeRequest(
                getBackOfficeBaseURL() + LOGIN.GENERATE_OTP_GUEST,
                request,
                successRespCBGenerateOTP,
                errorRespCBGenerateOTP
            )
        }
        else if (mobileNoLen < 10 && guestAgreeTick === true){
            isPendingRequest.current = true
            setFieldErrorMsg(getLangText('GUEST_USER_ERROR_NO', 'MESSAGES'))
        }
     
    }

    function successRespCBGenerateOTP() {
        isPendingRequest.current = false
        props.hideLoader()
        setSendOTPEnabled(true)
        setGuestAgreeTick(false)
        setIsOtpSent(true)
        setFieldErrorMsg('')
        setEnableResendOTP(false)
        setOTPTimer()
    }

    function errorRespCBGenerateOTP(error) {
        isPendingRequest.current = false
        props.hideLoader()
        setErrorMsg(error.message)
        setIsOtpSent(false)
    }

    function onClickVerify() {
        if (!isPendingRequest.current) {
            isPendingRequest.current = true
            props.showLoader();
            setErrorMsg('')
            let request = new MsfRequest();
            request.addToData({ 'mobNo': mobileExt + mobileNo, 'otp': otpInputBox })
            MsfFetch.placeRequest(
                getGuestUserBaseURL() + LOGIN.GUEST_LOGIN,
                request,
                successRespCBVerify,
                errorRespCBVerify
            )
        }
    }

    function successRespCBVerify(response) {
        isPendingRequest.current = false
        props.hideLoader()
        props.parentCB && props.parentCB(response)
    }

    function errorRespCBVerify(error) {
        isPendingRequest.current = false
        props.hideLoader()
        setErrorMsg(error.message)
    }

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

    function resendOTP() {
        setErrorMsg('')
        let minutessubmit = Math.floor(OTPTime / 60)
        let seconds = OTPTime - (minutessubmit * 60);
        setMinutes(minutessubmit)
        setSeconds(seconds)
        props.showLoader();
        let request = new MsfRequest();
        request.addToData({ 'mobileNo': mobileExt + mobileNo })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LOGIN.GENERATE_OTP_GUEST,
            request,
            successRespCBGenerateOTP,
            errorRespCBGenerateOTP
        )
    }

    function getOTP(otpVal, onEnter) {
        setOtpInputBox(otpVal)
        if (onEnter)
            verifyOTP()
    }

    function verifyOTP() {
        let error = {}
        let placeReq = true
        setErrorMsg('')
        if (otpInputBox.length != 4) {
            placeReq = false
            error.otpInputBox = getLangText("INVALID_OTP", "MESSAGES")
        }

        // setInputError(error)

        if (placeReq)
            onClickVerify()
    }

    // function placeReqVerifyOTP() {
    //     if (!isPendingRequest.current) {
    //         isPendingRequest.current = true
    //         props.showLoader();
    //         let request = new MsfRequest();
    //         request.addToData({ 'mobNo': mobileNo, "otp": otpInputBox })
    //         MsfFetch.placeRequest(
    //             getTradingBaseURL() + LOGIN.VALIDATE_OTP,
    //             request,
    //             successCBVerifyOTP,
    //             errorCBVerifyOTP
    //         )
    //     }
    // }

    // function successCBVerifyOTP() {
    //     props.hideLoader();
    //     isPendingRequest.current = false
    //     // props.showSetPasswordCB && props.showSetPasswordCB(userName)
    // }

    // function errorCBVerifyOTP(error) {
    //     setErrorMsg(error.message)
    //     props.hideLoader();
    //     isPendingRequest.current = false
    // }

    function checkSingleDigit(val) {
        let value = val.toString()
        let twoDigits = value.padStart(2, '0')
        return twoDigits
    }

    return (
        <div className="app-modalDialog mobile-verification-dialog">
            <div className="window" ref={modalRef}>
                <div className="title flex-center">
                    <span className="title-name">
                        <LangText  name="GUEST_LOGIN" />
                    </span>
                    <CloseIcon onClick={props.onCloseCB} />
                </div>
                <div className="content">
                    {/* <div className="row openAcc-row">
                        <a href={openAccLink} target="_blank" rel="noopener noreferrer">
                            <u>
                                <span className="openAcc-link cursor">
                                    <LangText module="BUTTONS" name="OPEN_ACCOUNT" />
                                </span>
                            </u>
                        </a>
                    </div> */}
                    <div className="row padding-row">
                        <div className="infoMsg">
                            <LangText name="GUEST_USER_INFO_MSG" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="label"><LangText  name="ENTER_MOBILE_NUMBER" /></div>
                        <div className={`input-div hasAddOn ${fielderrorMsg ? 'errorInput' : ''}`}>
                            <div className="addOnIcon" style={{ color: "gray" }}>
                                {mobileExt}
                            </div>
                            <Input
                                className="inputVal"
                                name="mobileNo"
                                value={mobileNo}
                                onChange={onchangeVal}
                                disabled={isOtpSent}
                                maxLength="10"
                            />
                        </div>
                        <div className="errorDiv">
                            <span className="error">{fielderrorMsg}</span>
                        </div>
                    </div>
                    {/* {
                        isOtpSent ?
                            <div className="row">
                                <div className="label"><LangText module="LOGIN" name="ENTER_YOUR_OTP" /></div>
                                <div className="input-div">
                                    <Input
                                        className="inputVal"
                                        name="otp"
                                        placeholder={getLangText('ENTER_YOUR_OTP_PHOLDER', "LOGIN")}
                                        value={otp}
                                        onChange={onchangeVal}
                                    />
                                </div>
                                <div className="errorDiv">
                                    <span className="error"></span>
                                </div>
                            </div>
                            : null
                    } */}
                    <div className="row">
                        { !sendOTPEnabled ?
                            <div className="guest-agree-row">
                                {
                                    guestAgreeTick ?
                                        <>
                                            <CheckBoxIcon_Checked
                                                onClick={() => setGuestAgreeTick(false)} />
                                        </>
                                        :
                                        <CheckBoxIcon_UnChecked
                                            onClick={() => setGuestAgreeTick(true)} />
                                }
                                {
                                    <div>
                                        <span className="guest-agree">
                                            <LangText name="GUEST_AGREE" />   
                                        </span>
                                        <span className="guest-terms">
                                            <a href={AppSettings.publicUrl + "/Terms_Conditions_Guest.html"}
                                                target="_blank" rel="noopener noreferrer">
                                                <LangText  name="GUEST_TERMS" /> 
                                            </a>  
                                        </span>
                                        <span className="seperate">
                                            <LangText name="GUEST_AND"/>
                                        </span>
                                        <span className="guest-terms">
                                            <a href={AppSettings.publicUrl + "/Privacy_Policy_Guest.html"}
                                                target="_blank" rel="noopener noreferrer">
                                                <LangText  name="GUEST_POLICY" />  
                                            </a> 
                                        </span>
                                    </div>
                                }
                            </div>
                            : 
                            <>
                                <div className="row OTP">
                                    <div className="label">
                                        <LangText  name="OTP_LABEL" />
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
                                </div>
                            </>
                        }
                    </div>
                
                    <div className="commonErrorDiv flex-center">
                        <span className="error">{errorMsg}</span>
                    </div>
                    {
                        sendOTPEnabled ?
                            <div className={`row resendOtp-div ${!enableResendOTP ? 'isDisabled' : ''}`}>
                                <div><LangText  name="DINT_REIEVE_OTP" /></div>
                                <div className="resendOtp-link">
                                    <span className="cursor"
                                        ref={submitBtnRef}
                                        onClick={resendOTP}
                                        test_id="forgetPwdSubmit_btn" >
                                        <LangText  name="RESEND_OTP" /></span>
                                </div>
                            </div>
                            : null
                    }
                </div>
                <div className="guest-footer-btn">
                    {
                        !sendOTPEnabled ?
                            <span className={`guest-send-btn send-otp-btn ${guestAgreeTick ? '' : 'disabled'}`}
                                onClick={onClickSendOtp}
                                disabled={guestAgreeTick}
                                ref={submitBtnRef}
                                test_id="forgetPwdSubmit_btn"
                            >
                                <LangText  name="SEND_OTP" />
                            </span>
                            :
                            <div className="guest-verify-btn">
                                <span className="guest-cancel-btn verify-otp-btn"
                                    onClick={props.onCloseCB}
                                >
                                    <LangText module="BUTTONS" name="CANCEL" />
                                </span>
                                <span className="guest-send-btn verify-otp-btn"
                                    onClick={onClickVerify}
                                    disabled={verifyEnabled}
                                >
                                    <LangText module="BUTTONS" name="VERIFY_OTP" />
                                </span>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ config }) => {
    return {
        configStatus: config.configStatus
    }
}

export default connect(mapStateToProps, null)(Loader(MobileVerificationDialogComponent));