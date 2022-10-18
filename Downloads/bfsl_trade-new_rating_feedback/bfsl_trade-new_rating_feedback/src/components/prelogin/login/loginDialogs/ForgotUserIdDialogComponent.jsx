/* eslint-disable */
import React, { useState, useRef } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import { Loader } from '../../../common/LoaderComponent'
import Input from '../../../common/InputComponent'
import AddOns from '../../../common/InputAddOnComponents'
import LangText, { getLangText } from '../../../../common/lang/LangText'
import useCloseModal from '../../../../customHooksComponents/useCloseModal';

import { LOGIN } from '../../../../config/ServiceURLs'
import {
    specialCharFinder,
    convertToUpperCase, getTradingBaseURL, checkValidPan_DOB, checkInt, checkValidMobNo, validateEmail
} from '../../../../common/CommonMethods'
import { PAN_DOB_INPUT } from '../../../../common/Constants';
import { connect } from 'react-redux'
import { showAppDialog } from '../../../../state/actions/Actions'
// import { getItemFromSessionStorage } from '../../../../common/LocalStorage'

const ForgotUserIdDialogComponent = (props) => {

    const MsfFetch = useFetch()

    // const [userName, setUserName] = useState('')
    const [pan_dob, setPan_Dob] = useState('')
    const [mob_no, setMob_no] = useState('')
    const [email_id, setEmail_id] = useState('')
    const [inputError, setInputError] = useState({})
    const [errorMsg, setErrorMsg] = useState('')
    // const [mobileExt] = useState('+91')

    // const userNameRef = useRef('')
    const panNoRef = useRef('')
    const mobNoRef = useRef('')
    const emailIdRef = useRef('')
    const submitBtnRef = useRef('')
    const isPendingRequest = useRef(false)

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef)

    function onchangeVal(e) {
        if (e.target.name === "pan_dob")
            if (!specialCharFinder(e.target.value))
                setPan_Dob(convertToUpperCase(e.target.value))
        if (e.target.name === "mob_no")
            if (!specialCharFinder(e.target.value)) {
                if(e.target.value === "" || checkInt(e.target.value))
                    setMob_no(convertToUpperCase(e.target.value))
            }
        if (e.target.name === "email_id")
            setEmail_id(e.target.value)
    }

    function onKeyPress(e) {

        // let { target } = e;
        if (e.key === 'Enter') {
            if (e.target.name  === 'pan_dob')
                mobNoRef.current.focus()
            else if (e.target.name  === 'mob_no') {
                onClickSubmit()
                submitBtnRef.current.focus()
            }
        }
    }

    // function onBlurInput(e) {
    //     let error = {}
    //     if (e.target.name === "userName") {
    //         let nameValidation = checkValidUserName(userName)
    //         if (!nameValidation.isValid)
    //             error.userName = nameValidation.errorMsg
    //     }
    //     if (e.target.name === "pan_dob") {
    //         let pan_dob_Validation = checkValidPan_DOB(pan_dob)
    //         if (!pan_dob_Validation.isValid)
    //             error.pan_dob = pan_dob_Validation.errorMsg
    //     }

    //     setInputError(error)
    // }

    function onClickSubmit() {
        let error = {}
        let placeReq = true
        setErrorMsg('')

        let pan_dob_Validation = checkValidPan_DOB(pan_dob, PAN_DOB_INPUT.PAN)
        let mob_Num_Validation = checkValidMobNo(mob_no)
        let email_Validation = validateEmail(email_id)

        if (!pan_dob_Validation.isValid) {
            placeReq = false
            error.pan_dob = pan_dob_Validation.errorMsg
        }
        if (!mob_Num_Validation.isValid) {
            placeReq = false
            error.mob_no = mob_Num_Validation.errorMsg
        }
        if (!email_Validation) {
            placeReq = false
            error.email_id = getLangText('EMAIL_EMPTY')
        }

        setInputError(error)
        if (placeReq)
            placeReqForgetUserId()
    }

    function placeReqForgetUserId() {
        if (!isPendingRequest.current) {
            isPendingRequest.current = true
            props.showLoader();
            let request = new MsfRequest();
            request.addToData({  "panNumber": pan_dob,'mobNo': mob_no, "email" : email_id })
            MsfFetch.placeRequest(
                getTradingBaseURL() + LOGIN.FORGOT_LOGIN_ID,
                request,
                successCBForgetUserId,
                errorCBForgetUserId
            )
        }
    }

    function successCBForgetUserId(response) {
        props.onCloseCB()
        isPendingRequest.current = false
        props.hideLoader();
        props.showAppDialog({
            message:response.infoMsg,
            show:true
        })
        setErrorMsg()
    }

    function errorCBForgetUserId(error) {
        isPendingRequest.current = false
        setErrorMsg(error.message)
        props.hideLoader();
    }

    return (
        <div className="app-modalDialog forget-userid-dialog">
            <div className="window" ref={modalRef}>
                <div className="title">
                    <span className="title-name">
                        <LangText  name="FORGET_USERID" />
                    </span>
                    {/* <CloseIcon onClick={props.onCloseCB} /> */}
                </div>
                <div className="content">
                    <div className="row infoMsg-div">
                        <div className="infoMsg">
                            <LangText  name="FORGET_USERID_INFO_MSG" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="label">
                            <LangText  name="PAN_TXT" />
                        </div>
                        <div className={`input-div hasAddOn ${inputError.pan_dob ? 'errorInput' : ''}`}>
                            <AddOns.PanInputAddOn />
                            <Input
                                className="inputVal"
                                ref={panNoRef}
                                name="pan_dob"
                                value={pan_dob}
                                placeholder={getLangText('PAN_NO_PHOLDER', 'LOGIN')}
                                onChange={onchangeVal}
                                test_id="forgetUIdPanNumber"
                                maxLength={10}
                                onKeyPress={(e) => onKeyPress(e)}
                                // disabled={showOTPField}
                            // onBlur={(e) => onBlurInput(e)}
                            />
                        </div>
                        <div className="errorDiv">
                            <span className="error">{inputError.pan_dob}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="label">
                            <LangText  name="MOBNUM_TXT" />
                        </div>
                        <div className={`input-div hasAddOn ${inputError.mob_no ? 'errorInput' : ''}`}>
                            <AddOns.MobileNumberInputAddOn />
                            {/* <div className="addOnIcon" style={{ color: "gray" }}>
                                {mobileExt}
                            </div> */}
                            <Input
                                className="inputVal"
                                ref={mobNoRef}
                                name="mob_no"
                                value={mob_no}
                                placeholder={getLangText('MOB_NO_PHOLDER')}
                                onChange={onchangeVal}
                                test_id="forgetUIdMobNumber"
                                maxLength={10}
                                onKeyPress={(e) => onKeyPress(e)}

                                // disabled={showOTPField}
                            // onBlur={(e) => onBlurInput(e)}
                            />
                        </div>
                        <div className="errorDiv">
                            <span className="error">{inputError.mob_no}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="label">
                            <LangText  name="EMAILID_TXT" />
                        </div>
                        <div className={`input-div hasAddOn ${inputError.email_id ? 'errorInput' : ''}`}>
                            <AddOns.EmailIdInputAddOn />
                            <Input
                                className="inputVal"
                                ref={emailIdRef}
                                name="email_id"
                                value={email_id}
                                placeholder={getLangText('EMAIL_ID_PHOLDER', 'LOGIN')}
                                onChange={onchangeVal}
                                test_id="forgetUIdEmailId"
                                onKeyPress={(e) => onKeyPress(e)}
                                // disabled={showOTPField}
                            // onBlur={(e) => onBlurInput(e)}
                            />
                        </div>
                        <div className="errorDiv">
                            <span className="error">{inputError.email_id}</span>
                        </div>
                    </div>             

                    <div className="commonErrorDiv flex-center">
                        <span className="error">{errorMsg}</span>
                    </div>
                </div>
                <div className="footer">
                    <button className="negativeBtn" onClick={props.onCloseCB}>
                        <LangText module="BUTTONS" name="CANCEL" />
                    </button>                  
                    <button className="left-btn positiveBtn"
                        ref={submitBtnRef}
                        onClick={onClickSubmit}
                        test_id="forgetUIdSubmit_btn"
                    >
                        <LangText  name="SUBMIT" />
                    </button>
                </div>
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
    };
};

export default connect(null, mapDispatchToProps)(Loader(ForgotUserIdDialogComponent));