import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux';
import { useFetch, MsfRequest } from '../../../../index'

import { getBackOfficeBaseURL } from '../../../../common/CommonMethods';
import { LAS_LOAN_DIALOGS, LOCAL_STORAGE, SET_TIMEOUT_INTERVAL } from '../../../../common/Constants';
import LangText, { getLangText } from '../../../../common/lang/LangText'
import { getItemFromSessionStorage } from '../../../../common/LocalStorage';

import { LAS_SERVICES } from '../../../../config/ServiceURLs';
import { showAppDialog, storeAvailLoanDialogDetails, storePledgeResponse } from '../../../../state/actions/Actions';

import { Loader } from '../../../common/LoaderComponent';
import OtpInptComponent from '../../../common/OTPInputComponent';

function OTPVerificationDialog(props) {
    const MsfFetch = useFetch()

    const [otp, setOTP] = useState('')
    const [resetOtp, setResetOtp] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [inputError, setInputError] = useState({})
    const [OTPTime, setOTPTime] = useState('')
    const [minutes, setMinutes] = useState(null);
    const [initalSeconds, setSeconds] = useState(null);
    const [enableResendOTP, setEnableResendOTP] = useState(false)

    const resetTimer = useRef(null)

    useEffect(() => {

        let lasHelp = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.LAS_HELP))
        if (lasHelp)
            setOTPTime(parseInt(lasHelp.lasOtpTimer))

        return () => {
            clearInterval(resetTimer.current)
        }
    }, [])

    useEffect(() => {
        if (OTPTime)
            setOTPTimer()
    }, [OTPTime])

    function setOTPTimer() {
        let initMinutes = Math.floor(OTPTime / 60)
        let seconds = OTPTime - (initMinutes * 60);
        setMinutes(initMinutes)
        setSeconds(seconds)
        let min = Math.floor(OTPTime / 60)
        let sec = OTPTime - (initMinutes * 60);
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

    function onClickResend() {
        let minutessubmit = Math.floor(OTPTime / 60)
        let seconds = OTPTime - (minutessubmit * 60);
        setMinutes(minutessubmit)
        setSeconds(seconds)
        setErrorMsg('')
        getResendOtp()
        setResetOtp(true)
        setInputError({})
        
    }

    function resetOtpFlag(){
        setResetOtp(false)
    }

    function getResendOtp() {
        props.showLoader();
        let request = new MsfRequest();
        request.addToData({
            loanId: props.responseData ? props.responseData.loanId : "",
            mode: "L"
        })

        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.GENERATE_OTP,
            request,
            successRespCBGetOtp,
            errorRespCBGetOtp
        )
    }

    function successRespCBGetOtp(response) {
        console.log("respnived", response)
        props.hideLoader();
        setEnableResendOTP(false)
        setOTPTimer()
    }

    function errorRespCBGetOtp(error) {
        setErrorMsg(error.message)
        props.hideLoader();

    }

    function onClickClose() {
        props.storeAvailLoanDialogDetails({
            dialogName: null
        })
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
        props.showLoader();
        let request = new MsfRequest();
        request.addToData({
            "loanId": props.responseData ? props.responseData.loanId : "",
            "otp": otp
        })
        request.setApiTimeOut(120)
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.VERIFY_OTP,
            request,
            successRespCBGetVerifyOtp,
            errorRespCBGetVerifyOtp
        )
    }

    function successRespCBGetVerifyOtp(response) {
        props.hideLoader();
        // storeItemByKey(LOCAL_STORAGE.SANCTION_NO, response.data.snctnNo);
        props.storePledgeResponse(response)
        props.storeAvailLoanDialogDetails({
            dialogName: LAS_LOAN_DIALOGS.CONGO_POPUP
        })

    }

    function errorRespCBGetVerifyOtp(error) {
        props.hideLoader();
        if (error.infoID === "LAS007") {
            props.storeAvailLoanDialogDetails({
                dialogName: LAS_LOAN_DIALOGS.FAIL_POPUP
            })

        } else if (error.infoID === "LAS008") {
            setErrorMsg(error.message)
        } else if (error.infoID === "LAS009") {
            setErrorMsg(error.message)
        } else {
            props.showAppDialog({
                message: error.message,
                show: true
            })
        }

    }

    function checkSingleDigit(val) {
        if (val) {
            let value = val.toString()
            let twoDigits = value.padStart(2, '0')
            return twoDigits
        }
        return '00'
    }
    return (
        <div className="app-modalDialog2 otp-dialog" >
            <div className="window otp-base" >
                <div className="content">
                    <div className="head">
                        <span className="title">
                            <LangText name="OTP_TITLE" module="LAS" />
                        </span>
                        <span className="info">
                            <LangText name="OTP_INFO" module="LAS" />
                        </span>
                    </div>
                    <div className="otp_input">
                        <OtpInptComponent getOTP={getOTP} reset={resetOtp} resetOtpFlag={resetOtpFlag} />
                        
                    </div>
                    <div className="errorDiv">
                        <span className="error">{inputError.otp}</span>
                    </div>
                    <div className="row">
                        <span>
                            <span className="receive-otp">
                                <LangText name="RECEIVE_OTP" module="LAS" />
                            </span>

                            <span className={`resend-otp ${!enableResendOTP ? 'isDisabled' : ''}`}
                                onClick={onClickResend}>
                                <LangText name="OTP_RESEND" module="LAS" />
                            </span>
                        </span>
                        {
                            (enableResendOTP) ?
                                ''
                                : <span className="otp-span-time">
                                    {checkSingleDigit(minutes)} : {checkSingleDigit(initalSeconds)}
                                </span>
                        }
                    </div>
                    <div className="errorDiv api-error">
                        <span className="error">{errorMsg}</span>
                    </div>
                    <div className="footer-div">
                        <button className="las-negativeBtn"
                            onClick={onClickClose}>
                            <LangText module="BUTTONS" name="CANCEL" />
                        </button>
                        <button className="las-positivebtn"
                            onClick={verifyOTP} >
                            <LangText module="BUTTONS" name="CONTINUE" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ las }) => {

    return {
        responseData: las.responseData,

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) },
        storePledgeResponse: (s) => { dispatch(storePledgeResponse(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(OTPVerificationDialog))
