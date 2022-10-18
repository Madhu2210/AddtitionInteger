/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../../index'

import { Loader } from '../../../common/LoaderComponent'
import Input from '../../../common/InputComponent'
import LangText, { getLangText } from '../../../../common/lang/LangText'

import useCloseModal from '../../../../customHooksComponents/useCloseModal';

import { LOGIN } from '../../../../config/ServiceURLs'

import { isValidNumber,getMTFBaseURL } from '../../../../common/CommonMethods'
import { CloseIcon } from '../../../common/FontIcons';
import OTPInputComponent from '../../../common/OTPInputComponent';
import { AppSettings } from '../../../../common/AppSettings';
import { LOCAL_STORAGE, SET_TIMEOUT_INTERVAL } from '../../../../common/Constants';
import { getItemFromSessionStorage } from '../../../../common/LocalStorage';
import { InputText } from 'primereact/inputtext';

const LoginOTPVerificationDialogComponent = (props) => {

    console.log("props",props)

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
    const [minutes, setMinutes] = useState(0);
    const [initalSeconds, setSeconds] = useState(0);
    const [enableResendOTP, setEnableResendOTP] = useState(false)
    const [OTPTime, setOTPTime] = useState('')
    const[isResetOtp,setIsResetOtp]=useState(false);
    // const [openAccLink, setOpenAccLink] = useState("")

    let isPendingRequest = useRef(false)
    const resetTimer = useRef(null)
    const submitBtnRef = useRef('')
    
    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef)

    useEffect(() => {
        let time = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.OTP_TIMER))
        console.log("time",time)
        setOTPTime(time)
        let minutessubmit = Math.floor(time / 60)
        console.log("minutessubmit",minutessubmit)
           let seconds = time - (minutessubmit * 60);
        console.log("seconds",seconds)
           setMinutes(minutessubmit)
           setSeconds(seconds)
            setIsOtpSent(true)
            setSendOTPEnabled(true)
            setOTPTimer()
        // return () => {
        //     clearInterval(resetTimer.current)
        // }
    }, [])

    function successRespCBGenerateOTP() {
        isPendingRequest.current = false
        // props.hideLoader()
        setSendOTPEnabled(true)
        // setGuestAgreeTick(false)
        setIsOtpSent(true)
        setFieldErrorMsg('')
        setEnableResendOTP(false)
        setOTPTimer()
    }

    function errorRespCBGenerateOTP(error) {
        isPendingRequest.current = false
        // props.hideLoader()
        setErrorMsg(error.message)
        setIsOtpSent(false)
    }

    function onClickVerify() {
        if (!isPendingRequest.current) {
            isPendingRequest.current = true
            // props.showLoader();
            setErrorMsg('')
            let requestData = {
                method: "POST",
                body: JSON.stringify({
                   'userId':props.userId,
                   'otp':otpInputBox,
                }),
                headers: {
                    "Content-type": "application/json",
                },
            };
            fetchDataToVerifyOTP();
            async function fetchDataToVerifyOTP() {
                try {
                    const response = await fetch(
                        getMTFBaseURL() + LOGIN.LOGIN_WITH_OTP,
                        requestData
                    );
                    const verifyOTPResp = await response.json();
                    console.log("verifyOTPResp",verifyOTPResp)
                    if(verifyOTPResp.statusCode === 0){

                            successRespCBVerify(verifyOTPResp)
                    }
                    else if(verifyOTPResp.statusCode === 1){
                        errorRespCBVerify(verifyOTPResp)
                    }
                } catch (err) {
                    alert("Something went wrong");
                    // errorRespCBVerify()
                }
            }
        }
    }

    function successRespCBVerify(response) {
        console.log("successRespCBVerify",response)
        isPendingRequest.current = false
        // props.hideLoader()
        props.parentCB && props.parentCB(response)
    }

    function errorRespCBVerify(error) {
        isPendingRequest.current = false
        // props.hideLoader()
        setErrorMsg(error.message)
    }

    function setOTPTimer() {
        let time = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.OTP_TIMER))
        let min = Math.floor(time / 60)
        let sec = time - (min * 60);

        // console.log("min",min)
        // console.log("sec",sec)
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
            console.log("sec",sec)
            console.log("min",min)
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
        setIsResetOtp(true)
        setSendOTPEnabled(false)
        setErrorMsg('')
        let minutessubmit = Math.floor(OTPTime / 60)
        let seconds = OTPTime - (minutessubmit * 60);
        setMinutes(minutessubmit)
        setSeconds(seconds)
        // props.showLoader();
        let request = new MsfRequest();
        if (!isPendingRequest.current) {
            isPendingRequest.current = true
            // props.showLoader();

            let requestData = {
                method: "POST",
                body: JSON.stringify({
                   'userId':props.userId,
                }),
                headers: {
                    "Content-type": "application/json",
                },
            };

            fetchData();

            async function fetchData() {

                try {
                    let response = await fetch(
                        getMTFBaseURL() + LOGIN.GENERATE_OTP_USER,
                        requestData
                    );
                    const generateOTPResp = await response.json();
                    console.log("generateOTPResp",generateOTPResp.statusCode)

                    if(generateOTPResp.statusCode === 0){

                        successRespCBGenerateOTP()
                    }
                    else if(generateOTPResp.statusCode === 1){
                        errorRespCBGenerateOTP(generateOTPResp)
                    }



                } catch (err) {
                    alert("Something went wrong");
                    // errorRespCB()
                }
            }
        }
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
    function checkSingleDigit(val) {
        // console.log("val",val)
        let value = val.toString()
        let twoDigits = value.padStart(2, '0')
        return twoDigits
    }


    return (
        <div className="mobile-verification-dialog">
            <div className="window" ref={modalRef}>
                {/* <div className="title flex-center">
                    <span className="title-name">
                        <LangText  name="TRADE_USER_LOGIN_OTP_LBL" />
                    </span>
                    <CloseIcon onClick={props.onCloseCB} />
                </div> */}
                <div className="content">
                    <div className="row padding-row">
                        <div className="infoMsg otpMsg">
                            <LangText name="TRADE_USER_LOGIN_OTP_INFO_MSG" />
                        </div>
                    </div>
                    <div className="row">

                            <>
                                <div className="row OTP">
                                    {/* <div className="label">
                                        <LangText  name="OTP_LABEL" />
                                    </div> */}
                                    <div className="otp_time otp_wrapper_full">
                                        {/* <OTPInputComponent getOTP={getOTP} reset={isResetOtp}/> */}
                                        <span className="p-float-label">
                                            <InputText id="in" value="" onChange={(e) => setValue(e.target.value)} />
                                            <label htmlFor="in">OTP</label>
                                        </span>
                                        {
                                            (enableResendOTP && initalSeconds) ?
                                                ''
                                                : <span className="otp-span-time">
                                                    {checkSingleDigit(minutes)} : {checkSingleDigit(initalSeconds)}
                                                </span>
                                        }
                                    </div>
                                </div>
                            </>
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
    
                            <div className="guest-verify-btn">
                                {/* <span className="guest-cancel-btn verify-otp-btn"
                                    onClick={props.onCloseCB}
                                >
                                    <LangText module="BUTTONS" name="CANCEL" />
                                </span> */}
                                <span className="guest-send-btn verify-otp-btn"
                                    onClick={onClickVerify}
                                    disabled={verifyEnabled}
                                >
                                    <LangText module="BUTTONS" name="PROCEED_BTN" />
                                </span>
                            </div>
                    
                </div>
            </div>
        </div>
           
    );
};

export default LoginOTPVerificationDialogComponent