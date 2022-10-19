/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../../index'

import { Loader } from '../../../common/LoaderComponent'
import Input from '../../../common/InputComponent'
import LangText, { getLangText } from '../../../../common/lang/LangText'

import useCloseModal from '../../../../customHooksComponents/useCloseModal';

import { LOGIN } from '../../../../config/ServiceURLs'

import { getTradingBaseURL } from '../../../../common/CommonMethods'
// import { LOCAL_STORAGE } from '../../../../common/Constants'
// import { getItemFromSessionStorage } from '../../../../common/LocalStorage'
import { CheckBoxIcon_Checked, CheckBoxIcon_UnChecked, CloseIcon } from '../../../common/FontIcons';
import MPINInputComponent from '../../../common/MPINInputComponent';
import { AppSettings } from '../../../../common/AppSettings';
import { LOCAL_STORAGE, SET_TIMEOUT_INTERVAL } from '../../../../common/Constants';
import { getItemFromSessionStorage } from '../../../../common/LocalStorage';
import { storeLoginMpin } from '../../../../common/Bridge';

import { InputText } from 'primereact/inputtext';
 


const LoginMPINVerificationDialogComponent = (props) => {

    console.log("props",props)

const MsfFetch = useFetch()

    const [mobileNo, setMobileNo] = useState('')
    // const [otp, setOtp] = useState('')
    const [mpinInputBox, setMpinInputBox] = useState('')
    const [isMpinSent, setIsMpinSent] = useState(false)
    const [sendMPINEnabled, setSendMPINEnabled] = useState(false)
    const [verifyEnabled] = useState(false)
    const [mobileExt] = useState('+91')
    const [errorMsg, setErrorMsg] = useState('')
    const [fielderrorMsg, setFieldErrorMsg] = useState('')
    const [guestAgreeTick, setGuestAgreeTick] = useState(true)
    const [minutes, setMinutes] = useState(0);
    const [initalSeconds, setSeconds] = useState(0);
    const [enableResendMPIN, setEnableResendMPIN] = useState(false)
    const [MPINTime, setMPINTime] = useState('')
    const[isResetMpin,setIsResetMpin]=useState(false);
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
        setMPINTime(time)
        let minutessubmit = Math.floor(time / 60)
           let seconds = time - (minutessubmit * 60);
           setMinutes(minutessubmit)
           setSeconds(seconds)
            setIsMpinSent(true)
            setSendMPINEnabled(true)
            setOTPTimer()

    }, [])

    function successRespCBGenerateOTP() {
        isPendingRequest.current = false
        // props.hideLoader()
        setSendMPINEnabled(true)
        // setGuestAgreeTick(false)
        setIsMpinSent(true)
        setFieldErrorMsg('')
        setEnableResendMPIN(false)
        setOTPTimer()
    }

    function errorRespCBGenerateOTP(error) {
        isPendingRequest.current = false
        // props.hideLoader()
        setErrorMsg(error.message)
        setIsMpinSent(false)
    }

    function onClickVerify() {
        if (!isPendingRequest.current) {
            isPendingRequest.current = true
            // props.showLoader();
            setErrorMsg('')

            let request = new MsfRequest();
            request.addToData({ 'uid': props.userId, 'pwd': props.password, '2fa': props.pan_dob,'mpin':"1234" })
            // request.setEcho(userName)
            MsfFetch.placeRequest(
                getTradingBaseURL() + LOGIN.REGISTER_MPIN,
                request,
                successRespCBVerify,
                errorRespCBVerify
            )
        }else{
            console.log("request is pending!!!!")
        }
    }

    function successRespCBVerify(response) {
        console.log(mpinInputBox,"successRespCBVerify",response)
        storeLoginMpin(mpinInputBox)
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

        resetTimer.current = setInterval(() => {
            if (sec > 0) {
                sec = sec - 1
            }
            else if (sec === 0) {
                if (min === 0) {
                    setClearInterval()
                    setEnableResendMPIN(true)

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
        setIsResetMpin(true)
        setSendMPINEnabled(false)
        setErrorMsg('')
        let minutessubmit = Math.floor(MPINTime / 60)
        let seconds = MPINTime - (minutessubmit * 60);
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

    function verifyOTP() {
        let error = {}
        let placeReq = true
        setErrorMsg('')
        if (mpinInputBox.length != 4) {
            placeReq = false
            error.mpinInputBox = getLangText("INVALID_OTP", "MESSAGES")
        }
        setInputError(error)
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
            <>
                <div className="content">
                    <div className='otpScreen'>
                    <div className="row padding-row">
                        <div className="infoMsg otpMsg">
                            <LangText name="TRADE_USER_MPIN_LABEL" />
                        </div>
                    </div>
                    <div className="row">

                            <>
                                <div className="row OTP">
                                    {/* <div className="label">
                                        <LangText  name="TRADE_USER_MPIN_LABEL" />
                                    </div> */}
                                    <div className="otp_time otp_wrapper_full">
                                        <span className="p-float-label">
                                            <InputText id="in" onChange={(e) => setValue(e.target.value)} />
                                            <label htmlFor="in">Username</label>
                                        </span>
                                        <span className="p-float-label">
                                            <InputText id="in1" onChange={(e) => setValue(e.target.value)} />
                                            <label htmlFor="in1">Username</label>
                                        </span>
                                        {
                                            (enableResendMPIN && initalSeconds) ?
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
                        sendMPINEnabled ?
                            <div className={`row resendOtp-div ${!enableResendMPIN ? 'isDisabled' : ''}`}>
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
                                    <LangText module="BUTTONS" name="PROCEDD_BTN" />
                                </span>
                            </div>
                    
                </div>
                    </div>
                    {/* <div className="row openAcc-row">
                        <a href={openAccLink} target="_blank" rel="noopener noreferrer">
                            <u>
                                <span className="openAcc-link cursor">
                                    <LangText module="BUTTONS" name="OPEN_ACCOUNT" />
                                </span>
                            </u>
                        </a>
                    </div> */}
            </>
           
    );
};

export default LoginMPINVerificationDialogComponent