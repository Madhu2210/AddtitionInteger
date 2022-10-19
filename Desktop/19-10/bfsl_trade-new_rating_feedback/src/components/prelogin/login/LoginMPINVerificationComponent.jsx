/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react'
import { useFetch, MsfRequest } from '../../../index'
// import { Loader } from '../../common/LoaderComponent'
import Input from '../../common/InputComponent'
import LangText, { getLangText } from '../../../common/lang/LangText'
import { LOGIN } from '../../../config/ServiceURLs'
import { getTradingBaseURL,specialCharFinder } from '../../../common/CommonMethods'
import { storeLoginMpin } from '../../../common/Bridge';
import { KeyboardIcon, EyeOpenIcon, EyeCloseIcon } from '../../common/FontIcons'

const LoginMPINVerificationComponent = (props) => {
    const MsfFetch = useFetch()
    const userMpinRef = useRef(null)
    const confirmMpinRef=useRef(null)
    const [mpinInputBox, setMpinInputBox] = useState('')
    const [confirmMpinInputBox, setConfirmMpinInputBox] = useState('')
    const [verifyEnabled] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [inputError, setInputError] = useState({})
    const [showMPIN, setShowMPIN] = useState(false)
    const [showConfirmMPIN, setShowConfirmMPIN] = useState(false)

    let isPendingRequest = useRef(false)
    

    function onchangeVal(e, inputName = "") {
        let error = {}
        const re = /^[0-9\b]+$/;
        if (e.target.name === "mpinInputBox") {
            if(e.target.value == "")
                {
                    setMpinInputBox('');                    
                }
            if (!specialCharFinder(e.target.value) && (re.test(e.target.value)))
            setMpinInputBox(e.target.value)
            if (e.target.value.length > 4) {

                error.mpinInputBox = getLangText("MPIN_LEN_VLDTN", "MESSAGES")
            }
        }
        if (e.target.name === "confirmMpinInputBox") {
            if(e.target.value == "")
                {
                    setConfirmMpinInputBox('');                    
                }
            if (!specialCharFinder(e.target.value) && (re.test(e.target.value)))
            setConfirmMpinInputBox(e.target.value)
            if (e.target.value.length > 4) {

                error.confirmMpinInputBox = getLangText("MPIN_LEN_VLDTN", "MESSAGES")
            }
        }
        setInputError(error)
    }

    function onKeyPress(e) {
        // let { target: { name } } = e;
        if (e.key === 'Enter') {
            if (e.target.name === 'mpinInputBox')
                confirmMpinRef.current.focus()
            else if (e.target.name === 'confirmMpinInputBox')
                verifyMPIN()
        }
    }

    function onClickVerify() {

        if (!isPendingRequest.current) {
            isPendingRequest.current = true
            // props.showLoader();
            setErrorMsg('')

            let request = new MsfRequest();
            request.addToData({ 'uid': props.userId, 'pwd': props.password, '2fa': props.pan_dob,'mpin': mpinInputBox})
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
        storeLoginMpin(mpinInputBox)
        isPendingRequest.current = false
        // props.hideLoader()
        props.successRespCBLoginMpin && props.successRespCBLoginMpin()
    }

    function errorRespCBVerify(error) {
        isPendingRequest.current = false
        // props.hideLoader()
        setErrorMsg(error.message)
    }

    function verifyMPIN() {
        let error = {}
        let placeReq = true
        setErrorMsg('')
        if (mpinInputBox.length != 4) {
            placeReq = false
            error.mpinInputBox = getLangText("INVALID_MPIN", "MESSAGES")
        }
        if (confirmMpinInputBox.length != 4) {
            placeReq = false
            error.confirmMpinInputBox = getLangText("INVALID_CONFIRM_MPIN", "MESSAGES")
        }
        if(mpinInputBox!==confirmMpinInputBox){
            placeReq = false
            error.confirmMpinInputBox = getLangText("MPIN_NOT_MATCHED_ERR", "MESSAGES")
        }
        setInputError(error)
        if (placeReq)
            onClickVerify()
    }

    return (
    
            <div className="otpScreen">
                    <div className="row padding-row">
                        <div className="infoMsg otpMsg">
                            <LangText name="TRADE_USER_MPIN_LABEL" />
                        </div>
                    </div>
                    <div className="row">

                            <>
                                <div className="row OTPinput">
                                    <div className="otp_time otp_wrapper_full">
                                        <div className={`input-div otpIcon hasAddOn ${inputError.mpinInputBox ?
                                            'errorInput' : ''}`}>
                                            <KeyboardIcon className="keyIcon" />
                                            <Input
                                                ref={userMpinRef}
                                                id="loginUserMpin"
                                                test_id="loginUserMpin"
                                                className="inputVal otpInputBox"
                                                type={showMPIN ? 'text' : 'password'}
                                                name="mpinInputBox"
                                                placeholder={getLangText("MPIN_PHOLDER")}
                                                value={mpinInputBox}
                                                onChange={onchangeVal}
                                                onKeyPress={(e) => onKeyPress(e)}
                                            />
                                            {
                                                showMPIN ?
                                                    <EyeOpenIcon className="addOnInnerIcon floatRight otpeye"
                                                        onClick={() => setShowMPIN(false)}
                                                    />
                                                    :
                                                    <EyeCloseIcon className="addOnInnerIcon floatRight otpeye"
                                                        onClick={() => setShowMPIN(true)}
                                                    />
                                            }
                                        </div>
                                        <div className="errorDiv">
                                            <span className="error">{inputError.mpinInputBox}</span>
                                        </div>

                                        <div className={`input-div otpIcon hasAddOn ${inputError.confirmMpinInputBox ?
                                            'errorInput' : ''}`}>
                                            <KeyboardIcon className="keyIcon" />
                                            <Input
                                                ref={confirmMpinRef}
                                                id="loginUserMpin"
                                                test_id="loginUserMpin"
                                                className="inputVal otpInputBox"
                                                type={showConfirmMPIN ? 'text' : 'password'}
                                                name="confirmMpinInputBox"
                                                // placeholder={getLangText("USERID_PHOLDER", "LOGIN")}
                                                placeholder={getLangText("CONFIRM_MPIN_PHOLDER")}
                                             
                                                value={confirmMpinInputBox}
                                                onChange={onchangeVal}
                                                onKeyPress={(e) => onKeyPress(e)}
                                            // onBlur={(e) => onBlurInput(e)}
                                            />
                                            {
                                                showConfirmMPIN ?
                                                    <EyeOpenIcon className="addOnInnerIcon floatRight otpeye"
                                                        onClick={() => setShowConfirmMPIN(false)}
                                                    />
                                                    :
                                                    <EyeCloseIcon className="addOnInnerIcon floatRight otpeye"
                                                        onClick={() => setShowConfirmMPIN(true)}
                                                    />
                                            }
                                        </div>
                                        <div className="errorDiv">
                                            <span className="error">{inputError.confirmMpinInputBox}</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                    </div>
                
                    <div className="commonErrorDiv flex-center">
                        <span className="error">{errorMsg}</span>
                    </div>
                    <div className="guest-footer-btn">
    
                            <div className="guest-verify-btn">
                                <span className="theme-btn loginBtn proceedBtn"
                                    onClick={verifyMPIN}
                                    disabled={verifyEnabled}
                                >
                                    <LangText module="BUTTONS" name="PROCEED_BTN" />
                                </span>
                            </div>
                    
                </div>
            </div>
                
            
    
           
    );
};

export default LoginMPINVerificationComponent