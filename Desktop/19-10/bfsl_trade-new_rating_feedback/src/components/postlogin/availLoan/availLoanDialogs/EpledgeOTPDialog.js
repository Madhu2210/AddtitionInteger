import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { AVAIL_LOAN_DIALOGS, LOCAL_STORAGE, SET_TIMEOUT_INTERVAL } from '../../../../common/Constants'
import LangText, { getLangText } from '../../../../common/lang/LangText'
import { getItemFromSessionStorage } from '../../../../common/LocalStorage'
import { showAppDialog, storeAvailLoanAddPledgeSuccessResponse,
    storeAvailLoanDialogDetails, storeAvailLoanPledgeRefreshFlag, storeFailureContAdditionalPld, 
    storeLoanDialogDetails } from '../../../../state/actions/Actions'
import OtpInptComponent from '../../../common/OTPInputComponent'
import { useFetch, MsfRequest } from '../../../../index'
import { LAS_SERVICE_JOURNEY } from '../../../../config/ServiceURLs'
import { getBackOfficeBaseURL } from '../../../../common/CommonMethods'
import { Loader } from '../../../common/LoaderComponent'

function EpledgeOTPDialog(props) {

    const MsfFetch = useFetch()
    const resetTimer = useRef(null)
    const [otp, setOTP] = useState('')
    const [OTPTime, setOTPTime] = useState('');
    // const [minutes, setMinutes] = useState(null);
    const [initalSeconds, setSeconds] = useState(null);
    // const [enableResendOTP, setEnableResendOTP] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [inputError, setInputError] = useState({})
    const [resendOtp, setResendOtp] = useState(false);
    const [restOtpContent,setRestOtpContent]=useState(false)

    useEffect(() => {
        
        let time = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.LAS_HELP))
        if(time){
            setOTPTime(parseInt(time.lasOtpTimer))
        }

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

                } else {
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
        setRestOtpContent(true)
        setErrorMsg('')
        setInputError({})
        getResendOtp()
    }

    function getResendOtp() {
        // props.showLoader();
        let request = new MsfRequest();
        request.addToData({
            loanId: props.responseData ? props.responseData.loanId : '',
            "mode": "P"
        })

        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICE_JOURNEY.OTP_GENERATE_ADDITIONAL_PLEDGE,
            request,
            successRespCBGetOtp,
            errorRespCBGetOtp
        )
    }

    function successRespCBGetOtp() {
        props.hideLoader();
        // setEnableResendOTP(false)
        setResendOtp(false)
        setOTPTimer()
    }

    function errorRespCBGetOtp(error) {
        setErrorMsg(error.message)
        props.hideLoader();
    }

    function getOTP(otpVal, onEnter) {
        setOTP(otpVal)
        if (onEnter)
            verifyOTP()
    }

    function verifyOTP() {
        let errors = {}
        let placeReq = true
        setErrorMsg('')
        if (otp.length != 4) {
            placeReq = false
            errors.otp = getLangText("INVALID_OTP", "MESSAGES")
        }

        setInputError(errors)

        if (placeReq)
            continueForStatus()
    }

    function continueForStatus() {
        props.showLoader();
        props.storeAvailLoanPledgeRefreshFlag(false) 
        let request = new MsfRequest();
        request.addToData({
            "loanId": props.responseData? props.responseData.loanId : '',
            "otp": otp
        })
        request.setApiTimeOut(120)
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICE_JOURNEY.ADDITIONAL_PLEDG_OTP,
            request,
            successRespCBGetConfirmOtp,
            errorRespCBGetConfirmOtp
        )

    }

    function successRespCBGetConfirmOtp(response) {
        props.hideLoader();
        props.storeAvailLoanAddPledgeSuccessResponse(response) 
        props.storeLoanDialogDetails({
            dialogName: AVAIL_LOAN_DIALOGS.EPLEDGE_CONGRATS
        })
        
    }

    function errorRespCBGetConfirmOtp(error) {
        props.hideLoader();
        props.storeFailureContAdditionalPld(error.message) 
        if ( error.infoID === "LAS007" ) {  
                   
            props.storeLoanDialogDetails({
                dialogName: AVAIL_LOAN_DIALOGS.EPLEDGE_FAILURE
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

        // props.storeLoanDialogDetails({
        //     dialogName: AVAIL_LOAN_DIALOGS.EPLEDGE_FAILURE
        // })
    }

    function checkSingleDigit(val) {
        if (val) {
            let value = val.toString()
            let twoDigits = value.padStart(2, '0')
            return twoDigits
        }
        return '60'
    }

    function onClose() {
        props.storeLoanDialogDetails({
            dialogName: null
        })

    }

    function resetOTPFlag(){
        setRestOtpContent(false)
    }
    
    return (
        <div className="app-modalDialog2 otp-dialog service-journey" >
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
                    <div className="otp-whole-div">
                        <div className="otp_input">
                            <OtpInptComponent getOTP={getOTP} reset={restOtpContent} resetOtpFlag={resetOTPFlag}/>
                        </div>

                        {inputError && 
                        <div className="errorDiv">
                            <span className="error">{inputError.otp}</span>
                        </div>
                        } 

                        {/* <div className="errorDiv">
                        <span className="error">{inputError.otp}</span>
                    </div> */}
                      
                        <div className="row">
                            <span>
                                <span className="receive-otp">
                                    <LangText name="RECEIVE_OTP" module="LAS" />
                                    &nbsp;
                                </span>
                                {!resendOtp?
                                    <span className="resend-with-time">
                                        <span className="resend-otp-div">
                                            <LangText name="RESEND_OTP_LOWER_CASE"
                                                module="AVAIL_LOAN_DIALOG_CONTENT" />
                                               &nbsp;
                                            {/* <span>{checkSingleDigit(minutes)} : {checkSingleDigit(initalSeconds)}</span> */}
                                        </span>
                                        <span className="otp-span-times">
                                            {checkSingleDigit(initalSeconds)}
                                            &nbsp;
                                        </span>
                                        <span>
                                            <LangText name="SECOND" module="AVAIL_LOAN_DIALOG_CONTENT"   />
                                            
                                        </span>
                                           
                                    </span>
                                    :
                                    <span className={`resend-otp send-otp  ${!resendOtp? 'isDisabled' : ''}`}
                                        onClick={onClickResend}>
                                        <LangText name="RESEND_OTP_UPPER_CASE"
                                            module="AVAIL_LOAN_DIALOG_CONTENT" />
                                    </span>
                                }

                                {/* <span>
                                <LangText name="OTP_RESEND" module="LAS" />
                            </span> */}
                                {/* <span className={`resend-otp ${!enableResendOTP ? 'isDisabled' : ''}`}
                                    onClick={onClickResend}>
                                    <LangText name="OTP_RESEND" module="LAS" />
                                </span>
                            </span>
                            {
                                (enableResendOTP) ?
                                    ''
                                    : <span className="otp-span-time">
                                        {checkSingleDigit(minutes)} : {checkSingleDigit(initalSeconds)}
                                    </span> */}
                            </span>
                        </div>
                       
                    </div>
                    <div className="errorDiv api-error">
                        <span className="error">{errorMsg}</span>
                    </div>
                    <div className="footer-div">
                        <button className="las-negativeBtn"
                            onClick={onClose}>
                            <LangText module="BUTTONS" name="CANCEL" />
                        </button>
                        <button className="las-positivebtn"
                            disabled= {  (otp.length ==='0' || otp.length != 4) } onClick={continueForStatus}>
                            <LangText module="BUTTONS" name="CONTINUE" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

}
const mapStateToProps = ({ availLoanDetails, las }) => {

    return {
        userDetails: availLoanDetails.userDetails,
        responseData: las.responseData

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeLoanDialogDetails: (s) => { dispatch(storeLoanDialogDetails(s)) },
        storeAvailLoanAddPledgeSuccessResponse: (s) => { dispatch(storeAvailLoanAddPledgeSuccessResponse(s)) },
        storeAvailLoanDialogDetails: (s) => { dispatch( storeAvailLoanDialogDetails(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeFailureContAdditionalPld:(s) => { dispatch(storeFailureContAdditionalPld(s)) },
        storeAvailLoanPledgeRefreshFlag: (s) => { dispatch(storeAvailLoanPledgeRefreshFlag(s)) }
       
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(EpledgeOTPDialog))