/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest, AppManager } from '../../../index'

import InitConfig from '../InitConfigComponent'
import { Loader } from '../../common/LoaderComponent'
import Input from '../../common/InputComponent'
import AddOns from '../../common/InputAddOnComponents'
import Slide1 from './Slide1Component'
import Slide2 from './Slide2Component'
import Slide3 from './Slide3Component'
import LangText, { getLangText } from '../../../common/lang/LangText'
import DatePickerComponent from '../../common/datePicker/DatePickerComponent';

import { LOGIN, LOGIN_GUEST,MTF_SERVICES } from '../../../config/ServiceURLs'
import { storeLoginClientDetails, storeLoginType,storeLoginMpinUserData } from '../../../common/Bridge'
import { AppSettings } from '../../../common/AppSettings'

import {
    showAppDialog, storeDemoFirstLogin, storeLoginDialogDetails,
    storeWatchGroups, storeRatingAndFeedback
} from '../../../state/actions/Actions'

import {
    SCREENS, LOGIN_DIALOGS, SET_TIMEOUT_INTERVAL,
    LOCAL_STORAGE, LOGIN_TYPE, INFO_IDS, THEMES, PASSWORD_MAX_LENGTH, PAN_DOB_INPUT,
    DEFAULT_VALUES, DATE_FORMATS, SCREENS_GUEST, AF_EVENT_TYPES, AF_EVENT_NAMES
} from '../../../common/Constants'
import { LOGIN_MESSAGES, CommonErrorMessages } from '../../../common/Messages'
import {
    checkValidPassword, checkValidUserName, checkValidPan_DOB, specialCharFinder,
    convertToUpperCase, getTradingBaseURL, isValidPassword, isValidNumber, getFormatedDate, findAndReplace,
    getGuestUserBaseURL,
    aF_Logged_User,
    AF_EventTriggered,
    getMTFBaseURL
} from '../../../common/CommonMethods'

import { PhoneIcon, EmailIcon, InfoIcon, EyeOpenIcon, EyeCloseIcon, GuestUserIcon } from '../../common/FontIcons'
import {
    storeToSessionStorage, getItemFromSessionStorage, storeItemByKey,
    getItemByKey,clearMpinDetails
} from '../../../common/LocalStorage'
import HelpAndSupportDetailsComponent from '../../common/HelpAndSupportDetailsComponent';
import useCloseModal from '../../../customHooksComponents/useCloseModal';
import LoginWithMpinComponent from './LoginWithMpinComponent';
import LoginOTPVerificationComponent from './LoginOTPVerificationComponent';
import LoginMPINVerificationComponent from './LoginMPINVerificationComponent';

const slides = [1, 2, 3]

const LoginComponent = (props) => {

    const { configStatus } = props;
    const MsfFetch = useFetch()

    const userNameRef = useRef(null)
    const passwordRef = useRef(null)
    const panNoRef = useRef(null)
    const loginBtnRef = useRef(null)
    const sliderInterval = useRef(null)

    const tooltipHelpRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(tooltipHelpRef, onClose, false)

    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [pan_dob, setPan_Dob] = useState('')
    const [showPasswordInfo, setShowPasswordInfo] = useState(false)
    const [inputError, setInputError] = useState({})
    const [activeSlide, setActiveSlide] = useState(1)
    const [showPassword, setShowPassword] = useState(false)
    const [calenderShow, setCalenderShow] = useState(false)
    const [sibiRegNumber, setSibiRegNumber] = useState('')
    const [openAccLink, setOpenAccLink] = useState("")
    const [androidStoreUrl, setAndroidStoreUrl] = useState("")
    const [iosStoreUrl, setIosStoreUrl] = useState("")
    const [selectedPanDOBInput, setSelectedPanDOBInput] = useState(PAN_DOB_INPUT.PAN)
    const [selectedDOB_Date, setSelectedDOB_Date] = useState(new Date())
    const [showNeedHelpContent, setShowNeedHelpContent] = useState(false)
    const [isMpinSet, setIsMpinSet] = useState(false)
    // const [mpinUserDetails,setMpinUserDetails]=useState(null)
    const [showVerifyLoginOTP, setShowVerifyLoginOTP] = useState(false)
    const [showVerifyLoginMPIN, setShowVerifyLoginMPIN] = useState(false)



    // const passwordRef = useRef()
    // const panRef = useRef()

    let isPendingRequest = useRef(false)

    useEffect(() => {
        // props.storeRatingAndFeedback({
        //     showRating:true,
        //     isAfterLogin:true
        // })

        let isFeedbackRating =  JSON.parse(getItemByKey(LOCAL_STORAGE.FEEDBACK_RATING))
        console.log(typeof isFeedbackRating,"showFeedbackRating", isFeedbackRating)
        if(isFeedbackRating && isFeedbackRating == true){
            console.log("feedback", props)
            props.storeRatingAndFeedback({
                showRating:true,
                isAfterLogin:false
            })
            console.log("NEW-Feedback")
            
        }
        else{

        let userMpin =  JSON.parse(getItemByKey(LOCAL_STORAGE.LOGIN_MPIN))

        if(userMpin && userMpin!=""){
            setIsMpinSet(true)
        }
    }

        startSlideShow()
        props.storeWatchGroups([])
        return () => {
            clearInterval(sliderInterval.current)
        }

    
    }, [])

    useEffect(() => {
        let openAccountLink = " "
        let getandroidStoreUrl = " "
        let getiosStoreUrl = " "

        if (configStatus && !props.dialog.dialogName) {
            let companyRegDetails = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.COMPANY_REG_INFO))
            setSibiRegNumber(companyRegDetails.SEBIRegNo)
            // var links = getItemFromSessionStorage(LOCAL_STORAGE.SOCIAL_MEDIA_LINKS)
            openAccountLink = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.OPEN_ACC_LINK))
            getandroidStoreUrl = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.ANDROID_STORE_URL))
            getiosStoreUrl = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.IOS_STORE_URL))
        }
        // if (links) {
        //     links = JSON.parse(links)
        //     setSocialMediaLinks(links)
        // }
        if (openAccountLink) {
            // openAccountLink = JSON.parse(openAccountLink)
            setOpenAccLink(openAccountLink)
        }
        if (getandroidStoreUrl) {
            // androidStoreUrl = JSON.parse(androidStoreUrl);
            setAndroidStoreUrl(getandroidStoreUrl);
        }
        if (getiosStoreUrl) {
            // iosStoreUrl = JSON.parse(iosStoreUrl);
            setIosStoreUrl(getiosStoreUrl);
        }

        if (userNameRef.current)
            userNameRef.current.focus()
    }, [configStatus])

    useEffect(() => {
        if (props.dialog.dialogName)
            clearFieldData()
    }, [props.dialog.dialogName])

    function startSlideShow() {
        let slide = 1
        sliderInterval.current = setInterval(() => {
            if (slide === slides.length)
                slide = 1
            else
                slide = slide + 1

            setActiveSlide(slide)
        }, SET_TIMEOUT_INTERVAL.LOGIN_SLIDER_INTERVAL);
    }

    function onchangeVal(e, inputName = "") {
        if (e.target.name === "userName") {
            if (!specialCharFinder(e.target.value))
                setUserName(convertToUpperCase(e.target.value))
        }
        if (e.target.name === "password") {
            if (!isValidPassword(e.target.value)) {
                setPassword(e.target.value)
            }
        }
        if (e.target.name === "pan_dob") {
            if (!specialCharFinder(e.target.value)) {
                if (inputName === "dob") {
                    if (e.target.value) {
                        if (isValidNumber(e.target.value))
                            setPan_Dob(e.target.value)
                    }
                    else
                        setPan_Dob(e.target.value)
                } else
                    setPan_Dob(convertToUpperCase(e.target.value))
            }
        }
    }

    function onKeyPress(e) {
        // let { target: { name } } = e;
        if (e.key === 'Enter') {
            if (e.target.name === 'userName')
                passwordRef.current.focus()
            else if (e.target.name === 'password')
                panNoRef.current.focus()
            else if (e.target.name === 'pan_dob') {
                onClickLogin()
                loginBtnRef.current.focus()
            }
        }
    }

    function clearFieldData() {
        setUserName('')
        setPassword('')
        setPan_Dob('')
    }

    function onClickLogin() {
        let error = {}
        let placeReq = true

        let nameValidation = checkValidUserName(userName)
        let passwordValidation = checkValidPassword(password)
        let pan_dob_Validation = checkValidPan_DOB(pan_dob, selectedPanDOBInput)

        if (!nameValidation.isValid) {
            placeReq = false
            error.userName = nameValidation.errorMsg
        }
        if (!passwordValidation.isValid) {
            placeReq = false
            error.password = passwordValidation.errorMsg
        }
        if (!pan_dob_Validation.isValid) {
            placeReq = false
            error.panNo = pan_dob_Validation.errorMsg
        }

        setInputError(error)

        if (placeReq){

          let hasStoregeFlag=JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.HAS_STORAGE_DATA))
          if(hasStoregeFlag)
            login()
          else{
            window.location.reload()
            }
        }
    }

    function togglePan_DOB() {
        let error = Object.assign({}, inputError)
        error.panNo = ''
        setInputError(error)
    }

    function login() {
        if (!isPendingRequest.current) {
            isPendingRequest.current = true
            props.showLoader();
            let request = new MsfRequest();
            request.addToData({ 'uid': userName, 'pwd': password, '2fa': pan_dob })
            request.setEcho(userName)
            MsfFetch.placeRequest(
                getTradingBaseURL() + LOGIN.USER_LOGIN,
                request,
                successRespCBUserLogin,
                errorRespCB
            )
        }
    }

    function successRespCBUserLogin(response) {
        isPendingRequest.current = false;
        storeToSessionStorage(LOCAL_STORAGE.LOGIN_URL,window.location.href)
        storeLoginMpinUserData(response.data.accName,response.echo)
        storeLoginClientDetails(response)
        storeLoginType(LOGIN_TYPE.TRADING)
        storeItemByKey(LOCAL_STORAGE.USER_ID, response.echo)
        storeToSessionStorage(LOCAL_STORAGE.RESET_PASSWORD, '')
        aF_Logged_User(response.echo)
        AF_EventTriggered(AF_EVENT_NAMES.LOGIN , AF_EVENT_TYPES.LOGIN_SUCCESS,{"onClick":"loginButton"})
        // props.history.push(SCREENS.HOME)

        if(isMpinSet){

            getFirstDemo()
            props.history.push(SCREENS.HOME)

        }else{

            //onSuccessLoginWithOTP();
    
            // successRespCBGenerateOTPLogin({"data":"user logged In"})

            if (!isPendingRequest.current) {
                isPendingRequest.current = true
                props.showLoader();

                let requestData = {
                    method: "POST",
                    body: JSON.stringify({
                    'userId':userName
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
                            successRespCBGenerateOTPLogin(generateOTPResp.data)
                        }
                        else if(generateOTPResp.statusCode === 1){
                            errorRespCB(generateOTPResp)
                        }
                    } catch (err) {
                        console.log("err",err)
                        alert("Something went wrong");
                        // errorRespCB()
                    }
                }
            }
        }

     }


    function successRespCBGenerateOTPLogin(response){
        window.history.pushState({page: 1}, "", "");

        window.onpopstate = function(event) {

        history.go(0)

        }
        props.hideLoader(); 
        isPendingRequest.current = false  
        setShowVerifyLoginOTP(true)
    }

    function onSuccessLoginWithOTP(){
        setShowVerifyLoginOTP(false)
        setShowVerifyLoginMPIN(true)
        isPendingRequest.current = false
        props.hideLoader();
    }

    function onSuccessLoginWithMPIN(){
        setShowVerifyLoginMPIN(false)
        getFirstDemo()
        props.history.push(SCREENS.HOME)
    }

    function errorRespCB(error) {
        console.log('error: ', error);
        isPendingRequest.current = false
        // clearFieldData()
        props.hideLoader();
        if (error.infoID === INFO_IDS.USER_BLOCKED) {
            props.storeLoginDialogDetails({
                dialogName: LOGIN_DIALOGS.ACCOUNT_BLOCKED,
                message: error.message,
                parentCB: null,
            })
        } else if (error.infoID === INFO_IDS.CHANGE_PASSWORD) {
            storeToSessionStorage(LOCAL_STORAGE.RESET_PASSWORD, 'true')
            props.storeLoginDialogDetails({
                dialogName: LOGIN_DIALOGS.RESET_PASSWORD,
                message: error.message,
                parentCB: onSuccessChangePassword,
                userId: userName
            })
        } else {
            props.showAppDialog({
                message: error.message ? error.message : CommonErrorMessages.API_ERROR,
                show: true
            })
        }
        aF_Logged_User(error.echo)
        AF_EventTriggered(AF_EVENT_NAMES.LOGIN , AF_EVENT_TYPES.LOGIN_FAILURE,{"onClick":"loginButton"})
    }

    function onSuccessChangePassword() {
        props.showAppDialog({
            message: getLangText(LOGIN_MESSAGES.PASSWORD_CHANGE_SUCCESS),
            closeCB: reloadTheApp,
            show: true
        })
        // successRespCBUserLogin(response)
    }

    function onClickMembershipLink() {
        props.storeLoginDialogDetails({
            dialogName: LOGIN_DIALOGS.MEMBERSHIP_DETAILS,
            parentCB: null,
        })
    }

    function onClickNeedHelp() {
        setShowNeedHelpContent(!showNeedHelpContent)
    }

    function getFirstDemo() {
        let checkDemoFirst = getItemByKey(LOCAL_STORAGE.DEMO_FIRST)
        if (checkDemoFirst === null) {
            storeItemByKey(LOCAL_STORAGE.DEMO_FIRST, 'first')
            props.storeDemoFirstLogin(true)
        }
        else {
            storeItemByKey(LOCAL_STORAGE.DEMO_FIRST, '')
            props.storeDemoFirstLogin(false)
        }
    }

    // function onClickVirtualTrade() {
    //     props.storeLoginDialogDetails({
    //         dialogName: LOGIN_DIALOGS.MOBILE_VERIFICATION,
    //         parentCB: onSuccessLogin_Virtual,
    //     })
    // }

    function onClickGuestUser() {
        props.storeLoginDialogDetails({
            dialogName: LOGIN_DIALOGS.MOBILE_VERIFICATION,
            parentCB: onSuccessLogin_Guest,
        })
    }

    // function onSuccessLogin_Virtual(response) {
    //     storeLoginClientDetails(response)
    //     storeToSessionStorage(LOCAL_STORAGE.LOGIN_TYPE, LOGIN_TYPE.VIRTUAL)
    //     props.history.push(SCREENS.HOME)
    // }

    function onSuccessLogin_Guest() {
        storeLoginType(LOGIN_TYPE.GUEST)
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            getGuestUserBaseURL() + LOGIN_GUEST.VALIDATE_SESSION,
            request,
            successRespCBValidateSession,
            errorRespCBValidateSession
        )
        // props.history.push(SCREENS.HOME)
    }

    const successRespCBValidateSession = (response) => {
        storeLoginClientDetails(response)
        props.history.push(SCREENS_GUEST.HOME)
        // props.storeLoginDialogDetails({
        //     dialogName: LOGIN_DIALOGS.GUEST_USER_INFO,
        //     parentCB: onSuccessLogin_Guest_User,
        // })
    }

    const errorRespCBValidateSession = (error) => {
        console.log(error)
    }

    // function onSuccessLogin_Guest_User() {
    //     props.storeLoginDialogDetails({
    //         dialogName: null,
    //         parentCB: null,
    //     })
    // }

    function reloadTheApp() {
        window.location.reload();
    }

    function onClickForgetPassword() {
        props.storeLoginDialogDetails({
            dialogName: LOGIN_DIALOGS.FORGET_PASSWORD,
            parentCB: null,
        })
    }

    function onClickPasswordInfo() {
        setShowPasswordInfo(!showPasswordInfo)
    }

    function onClickForgetUserId() {
        props.storeLoginDialogDetails({
            dialogName: LOGIN_DIALOGS.FORGET_USERID,
            parentCB: null,
        })
    }

    function calenderCB() {
        setCalenderShow(!calenderShow)
    }

    function onChangeDate(date) {
        if (date.value) {
            setSelectedDOB_Date(date.value)
            setCalenderShow(false)
            let reqDate = null
            let stringDate = getFormatedDate(date.value, 0, DATE_FORMATS.DDMMYYYY, true).stringDate
            if (stringDate) {
                reqDate = findAndReplace(stringDate, '/')
            }
            if (reqDate)
                setPan_Dob(reqDate)
        }
    }

    function getYearRange_DOB() {
        let currentYear = new Date().getFullYear()
        let startYear = currentYear - 200
        let endYear = currentYear

        return startYear + ":" + endYear
    }

    function onClose() {
        setShowNeedHelpContent(false)
    }

    function onClickLanguage() {
        props.storeLoginDialogDetails({
            dialogName: LOGIN_DIALOGS.LANGUAGE_OPTIONS,
            parentCB: null,
        })
    }

    function forgotMpin(){
        setIsMpinSet(false)
        setShowVerifyLoginMPIN(false)
        clearMpinDetails()
        props.history.push(SCREENS.LOGIN)
    }

    function gotoLoginScreen(){
        setIsMpinSet(false)
        setShowVerifyLoginMPIN(false)
        props.history.push(SCREENS.LOGIN)
    }


    return (
        <AppManager>
            {({ isLatestVersion, windowReload }) => {
                if (isLatestVersion === 0) return <div className="initial-progress">
                    please wait ..
                </div>
                if (isLatestVersion === 1) {
                    windowReload();
                }
                if (isLatestVersion === 2) {

                    if (!configStatus)
                        return <InitConfig />

                    return (
                        <div className="login-base">
                            <div className="app-version">
                                {/* <a href={AppSettings.publicUrl + "/ReleaseNotes.html"}
                                    target="_blank" rel="noopener noreferrer">
                                    <button className="releaseNotesBtn">Release Notes</button>
                                </a> */}
                                {AppSettings.appVersion}
                            </div>
                            <div className={`left ${props.selectedTheme.theme === THEMES.LIGHT ? 'light' : 'dark'}`}>
                                <div className="slideShow-div">
                                    <div className="slider-div">
                                        {
                                            activeSlide === 1 ?
                                                <Slide1 />
                                                :
                                                activeSlide === 2 ?
                                                    <Slide2 />
                                                    :
                                                    activeSlide === 3 ?
                                                        <Slide3 />
                                                        : null
                                        }
                                    </div>
                                    <div className="sliderCircle-div">
                                        {
                                            slides.map(function (item, index) {
                                                return (
                                                    <div key={index}
                                                        className={`sliderCircle ${activeSlide === item ?
                                                            'active' : ''}`}></div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="footer">
                                    <div className="appStore">
                                        {
                                            props.selectedTheme.theme === THEMES.LIGHT
                                                ?
                                                <a href={androidStoreUrl} target="_blank" rel="noopener noreferrer">
                                                    <img src="assets/images/login/appstore_google.svg" alt="" />
                                                </a>
                                                :
                                                <a href={androidStoreUrl} target="_blank" rel="noopener noreferrer">
                                                    <img src="assets/images/dark/login/appstore_google.svg" alt="" />
                                                </a>
                                        }
                                        {
                                            props.selectedTheme.theme === THEMES.LIGHT
                                                ?
                                                <a href={iosStoreUrl} target="_blank" rel="noopener noreferrer">
                                                    <img src="assets/images/login/appstore_ios.svg" alt="" />
                                                </a>
                                                :
                                                <a href={iosStoreUrl} target="_blank" rel="noopener noreferrer">
                                                    <img src="assets/images/dark/login/appstore_ios.svg" alt="" />
                                                </a>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="right">
                                <div className="header">
                                    <div className="logo-div">
                                        {
                                            props.selectedTheme.theme === THEMES.LIGHT ?
                                                <img className="bfsl-logo"
                                                    src="assets/images/login/Bajaj_logo_login.svg" alt="" />
                                                :
                                                <img className="bfsl-logo"
                                                    src="assets/images/dark/login/Bajaj_logo_login.svg" alt="" />
                                        }
                                    </div>
                                    <div className="openAcc-div">
                                        <div className="tooltip-div" ref={tooltipHelpRef}>
                                            <div className=
                                                {`tooltip-container bottom bottom-right ${showNeedHelpContent ?
                                                    "show" : "hide"}`}
                                            >
                                                <div className="tooltip-content">
                                                    <HelpAndSupportDetailsComponent />
                                                </div>
                                                <span className="triangle"></span>
                                            </div>
                                            <div className="flex-center haveAccQes" onClick={onClickNeedHelp}>
                                                <LangText  name="NEED_HELP_QUERY" />
                                          
                                            </div>
                                        </div>
                                        <div className="flex-center languageMenu" onClick={onClickLanguage}>
                                            | <LangText name="LANGUAGE"/>
                                          
                                        </div>
                                        {/* <span className="haveAccQes-dont">
                                            <LangText module="LOGIN" name="HAVING_ACCOUNT_QUERY" />
                                        </span> */}
                                        <a href={openAccLink} target="_blank" rel="noopener noreferrer">
                                            <button className="open-account-btn"><LangText 
                                                name="OPEN_DEMAT_ACCOUNT" /></button>
                                        </a>
                                    </div>
                                </div>
                                <div className="content">
                                {(isMpinSet) ? 
                                    <LoginWithMpinComponent isMpinSet={isMpinSet} successRespCBMpinLogin={successRespCBUserLogin} errorRespCBMpinLogin={errorRespCB} forgotMpin={forgotMpin} gotoLoginScreen={gotoLoginScreen}/>
                                :

                                (showVerifyLoginOTP) ?
                                <LoginOTPVerificationComponent showVerifyLoginOTP={showVerifyLoginOTP} userId={userName}successRespCBLoginOTP={onSuccessLoginWithOTP} errorRespCBLoginOTP={errorRespCB} />
                                :

                                (showVerifyLoginMPIN) ?
                                <LoginMPINVerificationComponent showVerifyLoginOTP={showVerifyLoginOTP} userId={userName}  password={password} pan_dob={pan_dob} successRespCBLoginMpin={onSuccessLoginWithMPIN} errorRespCBLoginMpin={errorRespCB}/>
                                :
                                    <>
                                    <div className="row">
                                        <span className="label"><LangText  name="USERID_TXT" /></span>
                                        {/* <span className="label"><LangText name="USERID_TXT" /></span> */}
                                        <div className={`input-div hasAddOn ${inputError.userName ?
                                            'errorInput' : ''}`}>
                                            <AddOns.UseridInputAddOn />
                                            <Input
                                                ref={userNameRef}
                                                id="loginUserName"
                                                test_id="loginUserName"
                                                className="inputVal"
                                                name="userName"
                                                // placeholder={getLangText("USERID_PHOLDER", "LOGIN")}
                                                placeholder={getLangText("USERID_PHOLDER")}
                                             
                                                value={userName}
                                                onChange={onchangeVal}
                                                onKeyPress={(e) => onKeyPress(e)}
                                            // onBlur={(e) => onBlurInput(e)}
                                            />
                                        </div>
                                        <div className="errorDiv">
                                            <span className="error">{inputError.userName}</span>
                                            <span className="forgetUId-link">
                                                <span className="cursor forgetUserId-link"
                                                    onClick={onClickForgetUserId}
                                                    test_id="forgetUIdLink"
                                                >
                                                    <LangText  name="FORGET_USERID" /> ?
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <span className="label password-label">
                                            <LangText  name="PASSWORD_TXT" />
                                            <div className="tooltip-div">
                                                <div className={`tooltip-container top ${showPasswordInfo ?
                                                    "show" : "hide"} 
                                                    ${props.selectedLang.id === "marathi" ?
                                                        "pwd-marati-tooltip" : ""}`}>
                                                    <LangText  name="PASSWORD_LENGTH" />
                                                    <span className={`triangle ${props.selectedLang.id === "marathi" ? 
                                                        "marati-triangle" : ""}`}></span>
                                                </div>
                                                <div className="flex-center"><InfoIcon className="cursor"
                                                    onClick={onClickPasswordInfo} /></div>
                                            </div>
                                        </span>
                                        <div className={`input-div hasAddOn hasInnerAddOn ${inputError.password ?
                                            'errorInput' : ''}`}>
                                            <AddOns.PasswordInputAddOn />
                                            <Input
                                                ref={passwordRef}
                                                id="loginPassword"
                                                test_id="loginPassword"
                                                type={showPassword ? 'text' : 'password'}
                                                className="inputVal"
                                                name="password"
                                                placeholder={getLangText("PASSWORD_PHOLDER")}
                                                value={password}
                                                onChange={onchangeVal}
                                                onKeyPress={(e) => onKeyPress(e)}
                                                // onBlur={(e) => onBlurInput(e)}
                                                maxLength={PASSWORD_MAX_LENGTH}
                                                preventPaste={true}
                                            />
                                            {
                                                showPassword ?
                                                    <EyeOpenIcon className="addOnInnerIcon floatRight"
                                                        onClick={() => setShowPassword(false)}
                                                    />
                                                    :
                                                    <EyeCloseIcon className="addOnInnerIcon floatRight"
                                                        onClick={() => setShowPassword(true)}
                                                    />
                                            }
                                        </div>
                                        <div className="errorDiv">
                                            <span className="error passwordError text-nowrap"
                                                title={inputError.password}>
                                                {inputError.password}
                                            </span>
                                            <span className="forgetPass-link">
                                                <span className="cursor forgetPassword-link"
                                                    onClick={onClickForgetPassword}
                                                    test_id="forgetPwdLink"
                                                >
                                                    <LangText  name="FORGET_PASSWORD" /> ?
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <span className="label"><LangText 
                                            name={selectedPanDOBInput === PAN_DOB_INPUT.PAN ?
                                                "PAN_TXT" : "DOB_TXT"} /></span>
                                        <div className={`input-div hasAddOn ${inputError.panNo ? 'errorInput' : ''}`}>
                                            <AddOns.PanInputAddOn />
                                            <Input
                                                ref={panNoRef}
                                                id="loginPanNumber"
                                                test_id="loginPanNumber"
                                                className="inputVal"
                                                name="pan_dob"
                                                placeholder={getLangText(selectedPanDOBInput === PAN_DOB_INPUT.PAN ?
                                                    "PAN_PHOLDER" : "DOB_PHOLDER")}
                                                value={pan_dob}
                                                maxLength={selectedPanDOBInput === PAN_DOB_INPUT.PAN ?
                                                    DEFAULT_VALUES.PAN_LEN : DEFAULT_VALUES.DOB_LEN}
                                                onChange={(e) =>
                                                    onchangeVal(e, selectedPanDOBInput === PAN_DOB_INPUT.PAN ?
                                                        'pan' : 'dob')}
                                                onKeyPress={(e) => onKeyPress(e)}
                                            // onBlur={(e) => onBlurInput(e)}
                                            />
                                            {
                                                selectedPanDOBInput === PAN_DOB_INPUT.DOB ?
                                                    <span>
                                                        <AddOns.DOBInputAddOn className="right cursor"
                                                            onClick={calenderCB} />
                                                        <div className="tooltip-div datePickerTooltip">
                                                            <div className={`tooltip-container top topRight 
                                                                ${calenderShow ? "show" : "hide"}`}>
                                                                <DatePickerComponent
                                                                    onChangeDate={onChangeDate}
                                                                    selectedDate={selectedDOB_Date}
                                                                    maxDate={getFormatedDate().formatedDate}
                                                                    inline={true}
                                                                    monthNavigator={true}
                                                                    yearNavigator={true}
                                                                    yearRange={getYearRange_DOB()}
                                                                />
                                                            </div>
                                                        </div>
                                                    </span>
                                                    :
                                                    null
                                            }
                                        </div>
                                        {/* <DatePickerComponent onChangeDate={onChangeDate} selectedDate={props.startDate} inline={true} /> */}

                                        <div className="errorDiv">
                                            <span className="error">{inputError.panNo}</span>
                                            <span className="dob_pan_link_div">
                                                <span className="dob_pan_link"
                                                    // onClick={onClickForgetPassword}
                                                    test_id="forgetPwdLink"
                                                >
                                                    <span
                                                        className={`cursor ${selectedPanDOBInput === PAN_DOB_INPUT.DOB ?
                                                            'active' : ''}`}
                                                        onClick={() => {
                                                            setPan_Dob('')
                                                            setSelectedPanDOBInput(PAN_DOB_INPUT.DOB)
                                                            togglePan_DOB()
                                                        }}
                                                    >
                                                        <LangText  name="DOB_TXT" />
                                                    </span>
                                                    <span
                                                        className={`cursor ${selectedPanDOBInput === PAN_DOB_INPUT.PAN ?
                                                            'active' : ''}`}
                                                        onClick={() => {
                                                            setPan_Dob('')
                                                            setSelectedPanDOBInput(PAN_DOB_INPUT.PAN)
                                                            togglePan_DOB()
                                                        }}
                                                    >
                                                        <LangText  name="PAN_TXT" />
                                                    </span>
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <button test_id="loginBtn"
                                            ref={loginBtnRef}
                                            className="theme-btn loginBtn"
                                            onClick={onClickLogin}
                                        >
                                            <LangText name="LOGIN" />
                                        </button>
                                    </div>


                                    <div className="row trade-btn-div">
                                        {/* <button className="trans-btn virtualTrade-btn flex-center" 
                                            onClick={onClickVirtualTrade}>
                                            <VirtualTradeIcon />
                                            <span className="text"><LangText module="BUTTONS" 
                                                name="VIRTUAL_TRADING" /></span>
                                        </button> */}
                                        <button className="trans-btn guest-btn flex-center" onClick={onClickGuestUser}>
                                            <GuestUserIcon />
                                            <span className="text"><LangText  
                                                name="GUEST_USER_CAPS" /></span>
                                        </button>
                                    </div>
                                    {/* <div className="row social-media flex-center">
                                        <img src="assets/images/login/fb.svg" alt="fb" />
                                        <img src="assets/images/login/twitter.svg" alt="tw" />
                                        <img src="assets/images/login/youtube.svg" alt="yt" />
                                    </div> */}
                                    </>
                }
                                    <div className="row flex-center membership-div">
                                        <u className="membershipLink">
                                            <span className="membership-link cursor" onClick={onClickMembershipLink}>
                                                <LangText  name="MEMBERSHIP_DETAILS" />
                                            </span>
                                        </u>
                                    </div>
                                </div>
                                <div className="footer">
                                    <div className="contact-details flex-center">
                                        <span className="details phone"> <PhoneIcon /> 18008338888 </span>
                                        <span className="details mail">
                                            <EmailIcon />
                                            <span className="emailTxt"><u> connect@bajajfinserv.in </u></span>
                                        </span>
                                    </div>
                                    <span className="copyrights first">
                                        <LangText name="COPY_RIGHT"/>
                                        {sibiRegNumber}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                }
                return null
            }}
        </AppManager >
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
        storeDemoFirstLogin: (s) => { dispatch(storeDemoFirstLogin(s)) },
        storeRatingAndFeedback: (s) => { dispatch(storeRatingAndFeedback(s))}
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(LoginComponent));