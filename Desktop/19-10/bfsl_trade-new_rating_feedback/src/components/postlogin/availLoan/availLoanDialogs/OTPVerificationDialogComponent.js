// import useFetch from '@msf/msf-reactjs-weblib-base';
import { MsfRequest, useFetch } from '../../../../index'
import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
// import { MsfRequest, useFetch } from '../../../index'
import { AVAIL_LOAN_DIALOGS, LOCAL_STORAGE, SET_TIMEOUT_INTERVAL } from '../../../../common/Constants';
import LangText, { getLangText } from '../../../../common/lang/LangText'
//import { getItemFromSessionStorage } from '../../../../common/LocalStorage';
import {
    showAppDialog,
    storeAvailLoanDisburseDataError,
    storeAvailLoanUnpledgeDataError,
    storeAvailLoanUnqueData, storeAvailLoanUserDetails,
    storeLoanDialogDetails
} from '../../../../state/actions/Actions'
import OtpInptComponent from '../../../common/OTPInputComponent';
import { getItemFromSessionStorage } from '../../../../common/LocalStorage';
import { getBackOfficeBaseURL } from '../../../../common/CommonMethods';
import { LAS_SERVICE_JOURNEY } from '../../../../config/ServiceURLs';
import { Loader } from '../../../common/LoaderComponent';

function OTPVerificationDialogComponent(props) {
    const MsfFetch = useFetch()

    const [otp, setOTP] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [restOtp,setRestOtp]=useState(false)
    const [inputError, setInputError] = useState({})
    const [OTPTime, setOTPTime] = useState('')
    // const [ setMinutes] = useState(null);
    const [initalSeconds, setSeconds] = useState(null);
    // const [enableResendOTP, setEnableResendOTP] = useState(false)
    const [resendOtp, setResendOtp] = useState(false);
    // const [requestId,setRequestId]=useState({})

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
        // setMinutes(initMinutes)
        
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
                    // setEnableResendOTP(true)
                    setResendOtp(true)

                }
                else {
                    min = min - 1
                    sec = 59

                }
            }
            setSeconds(sec)
            // setMinutes(min)
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
        // setMinutes(minutessubmit)
        setSeconds(seconds)
        setErrorMsg('')
        setRestOtp(true)
        setInputError({})
        if (!props.dialogContent.dialogContent) {

            getResendOtp()
        }
        else {
            getResendForUnpledge()
        }
       
    }
    function getResendOtp() {
        // props.showLoader();
        let request = new MsfRequest();
        request.addToData({
            // loanId: props.responseData.loanId,
            "loanId": props.responseData ? props.responseData.loanId : "",
            "mode": "D",
            "amnt":props.getLoanAmtData ? props.getLoanAmtData.getLoanAmtData : '',
            "lan": props.DisburseResponse ? props.DisburseResponse[0].lan : "",
            "bankName": props.getLoanDetailsIfsc ? props.getLoanDetailsIfsc.bankName : "",
            "accountNo": props.getLoanDetailsIfsc ? props.getLoanDetailsIfsc.accountNo : ""
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICE_JOURNEY.GENERATE_OTP_DETAILS,
            request,
            successRespCBGetOtp,
            errorRespCBGetOtp
        )
    }
    function successRespCBGetOtp() {
        // props.hideLoader();
        // setEnableResendOTP(false)
        setResendOtp(false)
        setOTPTimer()
    }

    function errorRespCBGetOtp(error) {
        setErrorMsg(error.message)
        // props.hideLoader();
        
    }

    function getResendForUnpledge(){
        let request = new MsfRequest();
        request.addToData({
            "loanId": props.responseData ? props.responseData.loanId : "",
            "mode": "R",
            "lan": props.DisburseResponse ? props.DisburseResponse[0].lan : "",
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICE_JOURNEY.OTP_GENERATE_RELEASE_SHARE,
            request,
            successRespGetResendOtpRelease,
            errorRespGetResendOtpRelease
        )
    }

    function  successRespGetResendOtpRelease(){
        props.hideLoader();
        
        setResendOtp(false)
        setOTPTimer()
    }

    function errorRespGetResendOtpRelease(error){
        setErrorMsg(error.message)
        props.hideLoader();
    }
    
    function getOTP(otpVal, onEnter) { 
        setOTP(otpVal)
        if (onEnter)
            submitOtp()
    }

    function submitOtp() {
        
        let error = {}
        let placeReq = true
        setErrorMsg('')
        if (otp.length != 4) {
            placeReq = false
            error.otp = getLangText("INVALID_OTP", "MESSAGES")
        }

        setInputError(error)

        if (placeReq) {
            if (!props.dialogContent.dialogContent) {

                placeReqVerifyOTP()
            }
            else {
                releaseReqVerifyOtp()
            }
        }

    }
    function resetOtpFlags(){
        setRestOtp(false)
    }

    function placeReqVerifyOTP() {
        props.showLoader();
        let request = new MsfRequest();
   
        request.addToData({
            "loanId": props.responseData ? props.responseData.loanId : "",
            "otp": otp,
            "amnt": props.getLoanAmtData ? props.getLoanAmtData.getLoanAmtData : '',
            "lan": props.DisburseResponse ? props.DisburseResponse[0].lan : "",
            "bankName": props.getLoanDetailsIfsc ? props.getLoanDetailsIfsc.bankName : "",
            "ifsc": props.getLoanDetailsIfsc ? props.getLoanDetailsIfsc.ifsc: "",
            "accountNo": props.getLoanDetailsIfsc ? props.getLoanDetailsIfsc.accountNo : ""
        })
       
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICE_JOURNEY.VERIFY_OTP,
            request,
            successRespCBGetVerifyOtp,
            errorRespCBGetVerifyOtp
        )
    }
    function successRespCBGetVerifyOtp(response) {

        props.storeAvailLoanUnqueData(response.data)
        props.hideLoader();

        props.storeLoanDialogDetails({
            dialogName: AVAIL_LOAN_DIALOGS.REQUEST_SUCCESS

        })
      
    }
    function errorRespCBGetVerifyOtp(error) {
        props.hideLoader();
        if (error.infoID === "LAS005") {
            props.storeAvailLoanDisburseDataError(error.message)
            props.storeLoanDialogDetails({
                dialogName: AVAIL_LOAN_DIALOGS.REQUEST_FAILURE
            })

        } else if (error.infoID === "LAS008") {
            setErrorMsg(error.message)
        } 
        else if (error.infoID === "LAS009") {
            setErrorMsg(error.message)
        } 
        else {
            props.showAppDialog({
                message: error.message,
                show: true
            })
            props.storeLoanDialogDetails({
                dialogName: null
            })
        }
        
    }
    function releaseReqVerifyOtp() {
        props.showLoader();
        let request = new MsfRequest();
        let rlshareData = [];
        Object.values(props.GetHoldingResponse).map((item) => {
            let data = {
                "pldType": item.pldType,
                "fas": item.fas,
                "isin": item.isin,
                "amfi": item.amfi,
                "qty": item.qty,
                "clntCde": item.clntCde,
                "dpId": item.dpId,
                "ordNo": item.ordNo,
                "pldDp":item.pldDp,
                "pldCtId":item.pldCtId

            }
            rlshareData.push(data)
          
        })

        request.addToData({
            "loanId": props.responseData ? props.responseData.loanId : "",
            "otp": otp,
            "rlShre": rlshareData

        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICE_JOURNEY.VERIFY_OTP_RELEASE_SHARE,
            request,
            successRespCBGetVerifyRelease,
            errorRespCBGetVerifyRelease
        )
    }
    function successRespCBGetVerifyRelease() {
    
        props.hideLoader();

        props.storeLoanDialogDetails({
            dialogName: AVAIL_LOAN_DIALOGS.REQUEST_SUCCESS
        })
      
    }

    function errorRespCBGetVerifyRelease(error) {
        // getOTP()
        props.hideLoader();
        // setErrorMsg(error.message)      
        if (error.infoID === "LAS005") {
            props. storeAvailLoanUnpledgeDataError(error.message)
            props.storeLoanDialogDetails({
                dialogName: AVAIL_LOAN_DIALOGS.REQUEST_FAILURE
            })
            
        } else if (error.infoID === "LAS008") {
            setErrorMsg(error.message)
        } 
        else if (error.infoID === "LAS009") {
            setErrorMsg(error.message)
        } 
        else {
            props.showAppDialog({
                message: error.message,
                show: true
            })
            props.storeLoanDialogDetails({
                dialogName: null
            })
        }

    }

    function checkSingleDigit(val) {
        if (val) {
            let value = val.toString()
            let twoDigits = value.padStart(2, '0')
            return twoDigits
        }
        return '60'
    }

    function CloseOtp() {
        props.storeLoanDialogDetails({
            dialogName: null
        })
    }
    // eslint-disable-next-line consistent-return
    function showMobileNo() {
        if (props.responseData.mob) {
            const mobileLength = props.responseData.mob.length;
            const mobileNo = firstDigit(props.responseData.mob);
            // const removedFirstDigit=deleteFromStart( mobileNo,1)

            const maskedLength = mobileLength - 4;
            let newString = props.responseData.mob;
            for (let i = 0; i < mobileLength; i++) {
                if (i < maskedLength) {
                    newString = newString.replace(props.responseData.mob[i], '*');
                }
            }

            const convertData = mobileNo + (newString.slice(1));
            return convertData

        }

    }

    function firstDigit(n) {
       
        while (n >= 10)
            n /= 10;
     
        return Math.floor(n);
    }
    
    return (
        <div>
            <div className="app-modalDialog2 get-otp-verification" >

                <div className="window get-otp-screen" >
                    <div className="get-otp-header">
                        <div className="otp-head">
                            <LangText name="OTP_VERIFICATION" module="AVAIL_LOAN_DIALOG_CONTENT" />
                        </div>
                        <div className="Otp-info-div">
                            <span className="otp-info" >
                                <LangText name="OTP_INFORMATION" module="AVAIL_LOAN_DIALOG_CONTENT" />
                            </span>
                            <span className="number">
                                +91 <span className="show-number">{showMobileNo()}</span>
                            </span>
                        </div>
                        <div className="otp-box">
                            <div>
                                <OtpInptComponent getOTP= {getOTP}  reset={restOtp} resetOtpFlag={resetOtpFlags}/>
                            </div>
                           
                            {inputError && <div className="errorDiv">
                                <span className="error">{inputError.otp}</span>
                            </div>
                            } 
                            <div className="resend-block">
                                <span className="get-otp">
                                    <span className="not_recieve_otp">
                                        <LangText name="NOT_RECIEVE_OTP" module="AVAIL_LOAN_DIALOG_CONTENT" />
                                    </span>
                                    {!resendOtp?
                                        <div className="resend-with-time">
                                            <span className="resend-otp-div">
                                                <LangText name="RESEND_OTP_LOWER_CASE"

                                                    module="AVAIL_LOAN_DIALOG_CONTENT" />
                                                {/* <span>{checkSingleDigit(minutes)} : {checkSingleDigit(initalSeconds)}</span> */}
                                            </span>
                                            <span className="otp-span-time">
                                                {checkSingleDigit(initalSeconds)}
                                            </span>
                                            <span className="seconds-div">
                                                <LangText name="SECOND" module="AVAIL_LOAN_DIALOG_CONTENT" />
                                            </span>
                                           
                                        </div>
                                        :
                                        <span className={`resend-otp send-otp  ${!resendOtp? 'isDisabled' : ''}`}
                                            onClick={onClickResend}>
                                            <LangText name="RESEND_OTP_UPPER_CASE"
                                                module="AVAIL_LOAN_DIALOG_CONTENT" />
                                        </span>
                                    }
                                </span>
                            </div>
                        </div>
                        {/* {
                            (enableResendOTP) ?
                                ''
                                : <span className="otp-span-time">
                                    {checkSingleDigit(minutes)} : {checkSingleDigit(initalSeconds)}
                                </span>
                        } */}
                        <div className="errorDiv api-error">
                            <span className="error">{errorMsg}</span>
                        </div>
                    </div>
                    
                    <div className="get-otp-footer">

                        <button className="las-negativeBtn"
                            onClick={CloseOtp}>
                            <LangText name="CANCEL_BUTTON" module="AVAIL_LOAN_DIALOG_CONTENT" />
                        </button>
                        <button className="las-positivebtn"
                            disabled= {  (otp.length ==='0' || otp.length != 4) } onClick={submitOtp}>
                            <LangText name="SUBMIT" module="BUTTONS" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ availLoanDetails, las }) => {
  
    return {
        dialogContent: availLoanDetails.dialogDetails,
        dialogDetails: availLoanDetails.dialogDetails,
        userDetails: availLoanDetails.userDetails,
        DisburseResponse: availLoanDetails.DisburseResponse,
        GetHoldingResponse: availLoanDetails.GetHoldingResponse,
        responseData: las.responseData,
        getLoanAmtData: availLoanDetails.getLoanAmtData,
        getLoanDetailsIfsc:availLoanDetails.getLoanDetailsIfsc,
       
        // userDetails: availLoanDetails.userDetails,

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeLoanDialogDetails: (s) => { dispatch(storeLoanDialogDetails(s)) },
        storeAvailLoanUserDetails: (s) => { dispatch(storeAvailLoanUserDetails(s)) },
        storeAvailLoanUnqueData: (s) => { dispatch(storeAvailLoanUnqueData(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeAvailLoanDisburseDataError: (s) => { dispatch(storeAvailLoanDisburseDataError(s)) },
        storeAvailLoanUnpledgeDataError: (s) => { dispatch( storeAvailLoanUnpledgeDataError(s)) },
        // storeRecieveDialogDetails:(s) => {dispatch(storeRecieveDialogDetails(s))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Loader(OTPVerificationDialogComponent))
