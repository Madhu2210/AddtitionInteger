/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../index'
import { Loader } from '../../common/LoaderComponent'
import LangText, { getLangText } from '../../../common/lang/LangText'
import { LOGIN } from '../../../config/ServiceURLs'
import {
    showAppDialog, storeDemoFirstLogin, storeLoginDialogDetails,
    storeWatchGroups
} from '../../../state/actions/Actions'

import {LOCAL_STORAGE} from '../../../common/Constants'
import {
    checkValidUserMpin, specialCharFinder,
    getTradingBaseURL, 
} from '../../../common/CommonMethods'
import {
    getItemByKey, 
} from '../../../common/LocalStorage'
import Input from '../../common/InputComponent'
import { PasswordLockIcon, EyeOpenIcon, EyeCloseIcon } from '../../common/FontIcons'

const LoginWithMpinComponent = (props) => {
    const MsfFetch = useFetch()
    const userMpinRef = useRef(null)
    const loginBtnRef = useRef(null)
    const [userMpin,setUserMpin]=useState('')
    const [mpinUserDetails,setMpinUserDetails]=useState(null)
    const [inputError, setInputError] = useState({})
    const [showMPIN, setShowMPIN] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    let isPendingRequest = useRef(false)

    useEffect(() => {

        if(props.isMpinSet){
            let loginUserName=getItemByKey(LOCAL_STORAGE.LOGIN_MPIN_USERNAME)
            let loginUserID=getItemByKey(LOCAL_STORAGE.LOGIN_MPIN_USERID)
            setMpinUserDetails({"userName":loginUserName,"userID":loginUserID})

        }
    }, [props.isMpinSet])

    function onchangeVal(e, inputName = "") {
        let error = {}
        const re = /^[0-9\b]+$/;
                if(e.target.value == "")
                {
                    setUserMpin('');                    
                }
        if (e.target.name === "userMpin") {
            if (!specialCharFinder(e.target.value) && (re.test(e.target.value)))
                setUserMpin(e.target.value)
        }
        if (e.target.value.length > 4) {

            error.userMpin = getLangText("MPIN_LEN_VLDTN", "MESSAGES")
        }
        setInputError(error)
    }

    function onKeyPress(e) {
        // let { target: { name } } = e;
        if (e.key === 'Enter') {
            if (e.target.name === 'userMpin')
            onClickLogin()
        }
    }

    function clearFieldData() {
        setUserMpin('')
    }

    function onClickLogin() {
        let error = {}
        let placeReq = true
        let mpinValidation = checkValidUserMpin(userMpin)
        if (!mpinValidation.isValid) {
            placeReq = false
            error.userMpin = mpinValidation.errorMsg
        }
        setInputError(error)
        if (placeReq)
        mpinProceed()
    }


    function mpinProceed(){
        if (!isPendingRequest.current) {
            isPendingRequest.current = true
            // props.showLoader();
            setErrorMsg('')

            let request = new MsfRequest();
            request.addToData({'mpin':userMpin })
            // request.setEcho(userName)
            MsfFetch.placeRequest(
                getTradingBaseURL() + LOGIN.LOGIN_MPIN,
                request,
                successRespCBVerify,
                errorRespCBVerify
            )
        }else{
            console.log("request is pending!!!!")
        }
    }

    function successRespCBVerify(response){
        isPendingRequest.current = false
        props.successRespCBMpinLogin && props.successRespCBMpinLogin(response)
    }

    function errorRespCBVerify(error){
        isPendingRequest.current = false
        setUserMpin('');
        props.errorRespCBMpinLogin && props.errorRespCBMpinLogin(error)
    }

    function forgotMpin(){
       props.forgotMpin && props.forgotMpin()
    }
    function gotoLoginScreen(){
        props.gotoLoginScreen && props.gotoLoginScreen()
    }

    return (
        
            <div className="resume-screen">
                <div className="userDetail_screen">
                <p className="userName">{mpinUserDetails && mpinUserDetails.userName}</p>
                <p className="userId">{mpinUserDetails && mpinUserDetails.userID}</p>
                </div>
            <div className="row OTPinput">
                                        
                                        <div className={`input-div otpIcon hasAddOn ${inputError.userMpin ?
                                            'errorInput' : ''}`}>
                                            <PasswordLockIcon className="passIcon" />
                                            <Input
                                                ref={userMpinRef}
                                                id="loginUserName"
                                                test_id="loginUserName"
                                                className="inputVal otpInputBox"
                                                type={showMPIN ? 'text' : 'password'}
                                                name="userMpin"
                                                // placeholder={getLangText("USERID_PHOLDER", "LOGIN")}
                                                placeholder={getLangText("UNBLOCK_MPIN_PHOLDER")}
                                             
                                                value={userMpin}
                                                onChange={onchangeVal}
                                                onKeyPress={(e) => onKeyPress(e)}
                                            // onBlur={(e) => onBlurInput(e)}
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
                                            <span className="error">{inputError.userMpin}</span>
                                            <span className="forgetUId-link">
                                                <span className="cursor forgetUserId-link"
                                                    onClick={()=>forgotMpin()}
                                                    test_id="forgetUIdLink"
                                                >
                                                    <LangText  name="FORGET_MPIN" /> ?
                                                </span>
                                            </span>
                                        </div>
                                    </div>
            <div className="row">
                <button test_id="loginBtn"
                    ref={loginBtnRef}
                    className="theme-btn loginBtn proceedBtn"
                    onClick={()=>onClickLogin()}
                >
                    <LangText module="BUTTONS" name="PROCEED_BTN" />
                </button>
            </div>
            <div className='row'>
                <div  className="login-another">
                    <p>Login to another account? <a href='javascript:void(0);' onClick={()=>gotoLoginScreen()}>Switch Here</a></p>
                </div>
            </div>
            </div>
                                   
    )
}

const mapStateToProps = ({ config, settings, login }) => {
    return {
        configStatus: config.configStatus,
        selectedTheme: settings.selectedTheme,
        dialog: login.dialog,
        selectedLang: settings.selectedLang
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeLoginDialogDetails: (s) => { dispatch(storeLoginDialogDetails(s)) },
        storeWatchGroups: (s) => { dispatch(storeWatchGroups(s)) },
        storeDemoFirstLogin: (s) => { dispatch(storeDemoFirstLogin(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(LoginWithMpinComponent));