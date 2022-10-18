/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react'
import { useFetch, MsfRequest } from '../../../index'
// import { Loader } from '../../common/LoaderComponent'
import Input from '../../common/InputComponent'
import LangText, { getLangText } from '../../../common/lang/LangText'
import { LOGIN } from '../../../config/ServiceURLs'
import { getMTFBaseURL,specialCharFinder } from '../../../common/CommonMethods'
import { LOCAL_STORAGE, SET_TIMEOUT_INTERVAL } from '../../../common/Constants';
import { getItemFromSessionStorage, getItemByKey } from '../../../common/LocalStorage';
import AddOns from '../../common/InputAddOnComponents'
import { PasswordLockIcon, EyeOpenIcon, EyeCloseIcon } from '../../common/FontIcons'

const LoginOTPVerificationComponent = (props) => {
        const userIDD=(props.userId && props.userId!="")?props.userId:getItemByKey(LOCAL_STORAGE.USER_ID)
        const MsfFetch = useFetch()
        const userOtpRef = useRef(null)

        const [otpInputBox, setOtpInputBox] = useState('')
        const [isOtpSent, setIsOtpSent] = useState(false)
        const [sendOTPEnabled, setSendOTPEnabled] = useState(false)
        const [errorMsg, setErrorMsg] = useState('')
        const [fielderrorMsg, setFieldErrorMsg] = useState('')
        const [minutes, setMinutes] = useState(0);
        const [initalSeconds, setSeconds] = useState(0);
        const [enableResendOTP, setEnableResendOTP] = useState(false)
        const [OTPTime, setOTPTime] = useState('')
        const [inputError, setInputError] = useState({})
        const [showOTP, setShowOTP] = useState(false)

        let isPendingRequest = useRef(false)
        const resetTimer = useRef(null)
        const submitBtnRef = useRef('')
        useEffect(() => {
            let time = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.OTP_TIMER))
            setOTPTime(time)
            let minutessubmit = Math.floor(time / 60)
               let seconds = time - (minutessubmit * 60);
               setMinutes(minutessubmit)
               setSeconds(seconds)
                setIsOtpSent(true)
                setSendOTPEnabled(true)
                setOTPTimer()
        }, [])

        function onchangeVal(e, inputName = "") {
            let error = {}
            if (e.target.name === "otpInputBox") {
                const re = /^[0-9\b]+$/;
                if(e.target.value == "")
                {
                    setOtpInputBox('');                    
                }
                if (!specialCharFinder(e.target.value) && (re.test(e.target.value)))
                setOtpInputBox(e.target.value)
                if (e.target.value.length > 4) {

                    error.otpInputBox = getLangText("INVALID_OTP", "MESSAGES")
                }
                if(e.target.value.length == 4 && (re.test(e.target.value))){
                    onClickVerify(e.target.value)
                }
                
                
            }
        }

        function onKeyPress(e) {
            // let { target: { name } } = e;
            let error = {}
            if (e.key === 'Enter') {
                if (e.target.name === 'otpInputBox')
                {
                    const re = /^[0-9\b]+$/;
                    if(e.target.value.length == 4 && (re.test(e.target.value))){
                        onClickVerify(e.target.value)
                    }
                }
            }
        }
    
        function successRespCBGenerateOTP() {
            isPendingRequest.current = false
            // props.hideLoader()
            setSendOTPEnabled(true)
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
    
        function onClickVerify(userInputOTP) {
            if (!isPendingRequest.current && userInputOTP!="") {
                isPendingRequest.current = true
                // props.showLoader();
                setErrorMsg('')
                let requestData = {
                    method: "POST",
                    body: JSON.stringify({
                       'userId':userIDD,
                       'otp':userInputOTP,
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
            isPendingRequest.current = false
            // props.hideLoader()
            props.successRespCBLoginOTP && props.successRespCBLoginOTP(response)
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
            setOtpInputBox('')
            setSendOTPEnabled(false)
            setErrorMsg('')
            let minutessubmit = Math.floor(OTPTime / 60)
            let seconds = OTPTime - (minutessubmit * 60);
            setMinutes(minutessubmit)
            setSeconds(seconds)
            // props.showLoader();
            let request = new MsfRequest();
            console.log(props.userId);
            if (!isPendingRequest.current) {
                isPendingRequest.current = true
                // props.showLoader();
                let requestData = {
                    method: "POST",
                    body: JSON.stringify({
                       'userId':userIDD,
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

        function checkSingleDigit(val) {
            // console.log("val",val)
            let value = val.toString()
            let twoDigits = value.padStart(2, '0')
            return twoDigits
        }
    
    
    return (
            <> 
                <div className="otpScreen">
                <div className="row padding-row">
                    <div className="infoMsg otpMsg">
                        <LangText name="TRADE_USER_LOGIN_OTP_INFO_MSG" />
                    </div>
                </div>
                <div className="row">
                        <>
                            <div className="row OTPinput">
                                <div className={`input-div otpIcon hasAddOn ${inputError.userMpin ?
                                    'errorInput' : ''}`}>
                                   <PasswordLockIcon className="passIcon" />
                                    <Input
                                        ref={userOtpRef}
                                        id="loginUserOTP"
                                        test_id="loginUserOTP"
                                        className="inputVal otpInputBox"
                                        type={showOTP ? 'text' : 'password'}
                                        name="otpInputBox"
                                        placeholder={getLangText("OTP_LABEL")}
                                        value={otpInputBox}
                                        onChange={onchangeVal}
                                        onKeyPress={(e) => { return onKeyPress(e)}}
                                    // onBlur={(e) => onBlurInput(e)}
                                    />
                                    {
                                        showOTP ?
                                            <EyeOpenIcon className="addOnInnerIcon floatRight otpeye"
                                                onClick={() => setShowOTP(false)}
                                            />
                                            :
                                            <EyeCloseIcon className="addOnInnerIcon floatRight otpeye"
                                                onClick={() => setShowOTP(true)}
                                            />
                                    }
                                </div>
                                <div className="errorDiv">
                                    <span className="error">{inputError.otpInputBox}</span>
                                </div>
                                <div className="otp_time otp_wrapper_full">
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
                
                </div>
             </>
        );
};

export default LoginOTPVerificationComponent