import React, { useState, useRef, useEffect } from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../../index'

import Input from '../../../common/InputComponent'
import AddOns from '../../../common/InputAddOnComponents'
import { Loader } from '../../../common/LoaderComponent'
import LangText, { getLangText } from '../../../../common/lang/LangText'
import useCloseModal from '../../../../customHooksComponents/useCloseModal';

import { LOGIN } from '../../../../config/ServiceURLs'
import { showAppDialog } from '../../../../state/actions/Actions'

import {
    checkValidUserName, specialCharFinder,
    convertToUpperCase, getTradingBaseURL, checkValidPan_DOB
} from '../../../../common/CommonMethods'
import { PAN_DOB_INPUT } from '../../../../common/Constants';

const UnblockUserDialogComponent = (props) => {

    const MsfFetch = useFetch()

    const [userName, setUserName] = useState('')
    const [pan_dob, setPan_Dob] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [inputError, setInputError] = useState({})

    const userNameRef = useRef(null)
    const panNoRef = useRef(null)
    const submitBtnRef = useRef(null)
    const isPendingRequest = useRef(false)

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef)

    useEffect(() => {
        userNameRef.current.focus()
    }, [])

    const onchangeVal = (e) => {
        if (e.target.name === "userName")
            if (!specialCharFinder(e.target.value))
                setUserName(convertToUpperCase(e.target.value))
        if (e.target.name === "pan_dob")
            if (!specialCharFinder(e.target.value))
                setPan_Dob(convertToUpperCase(e.target.value))
    }

    function onKeyPress(e) {
        // let { target: { name } } = e;
        if (e.key === 'Enter') {
            if (e.target.name === 'userName')
                panNoRef.current.focus()
            else if (e.target.name === 'pan_dob') {
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
    //             error.pan = pan_dob_Validation.errorMsg
    //     }
    //     setInputError(error)
    // }

    function onClickSubmit() {
        let error = {}
        let placeReq = true
        setErrorMsg('')

        let userNameValidation = checkValidUserName(userName)
        let panValidation = checkValidPan_DOB(pan_dob, PAN_DOB_INPUT.PAN)

        if (!userNameValidation.isValid) {
            placeReq = false
            error.userName = userNameValidation.errorMsg
        }
        if (!panValidation.isValid) {
            placeReq = false
            error.pan = panValidation.errorMsg
        }
        setInputError(error)

        if (placeReq)
            placeReqUnblockUser()
    }

    // function checkValidPan(value = '') {
    //     let validation = {
    //         isValid: true,
    //         errorMsg: ''
    //     }

    //     if (!value.length) {
    //         validation.isValid = false
    //         validation.errorMsg = getLangText('PAN_NO_EMPTY', 'VALIDATION')
    //     } else {
    //         if (!(/([A-Z]){5}([0-9]){4}([A-Z]){1}$/.test(value))) {
    //             validation.isValid = false
    //             validation.errorMsg = getLangText('INVALID_PAN', 'VALIDATION')
    //         }
    //     }

    //     return validation
    // }

    function placeReqUnblockUser() {
        if (!isPendingRequest.current) {
            isPendingRequest.current = true
            props.showLoader();
            let request = new MsfRequest();
            request.addToData({
                'uid': userName,
                'panNumber': pan_dob
            })
            MsfFetch.placeRequest(
                getTradingBaseURL() + LOGIN.UNBLOCK_USER,
                request,
                successCBUnblockUser,
                errorCBUnblockUser
            )
        }
    }

    function successCBUnblockUser(response) {
        props.hideLoader();
        setErrorMsg('')
        isPendingRequest.current = false
        props.showAppDialog({
            message: response.infoMsg,
            show: true
        })
        props.onCloseCB()
    }

    function errorCBUnblockUser(error) {
        props.hideLoader();
        setErrorMsg(error.message)
        isPendingRequest.current = false
    }

    return (
        <div className="app-modalDialog unblock-user-dialog">
            <div className="window" ref={modalRef}>
                <div className="title flex-center">
                    <span className="title-name"><LangText  name="UNBLOCK_ACCOUNT" /></span>
                    {/* <CloseIcon onClick={props.onCloseCB} /> */}
                </div>
                <div className="content">
                    <div className="row infoMsg-div">
                        <div className="infoMsg"><LangText  name="UNBLOCK_USER_INFO_MSG" /></div>
                    </div>
                    <div className="row">
                        <div className="label"><LangText name="USERID_TXT" /></div>
                        <div className={`input-div hasAddOn ${inputError.userName ? 'errorInput' : ''}`}>
                            <AddOns.UseridInputAddOn />
                            <Input
                                className="inputVal"
                                name="userName"
                                ref={userNameRef}
                                value={userName}
                                onChange={onchangeVal}
                                onKeyPress={(e) => onKeyPress(e)}
                                // onBlur={(e) => onBlurInput(e)}
                                placeholder={getLangText('USERID_PHOLDER', 'LOGIN')}
                            />
                        </div>
                        <div className="errorDiv">
                            <span className="error">{inputError.userName}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="label"><LangText  name="PAN_TXT" /></div>
                        <div className={`input-div hasAddOn ${inputError.pan ? 'errorInput' : ''}`}>
                            <AddOns.PanInputAddOn />
                            <Input
                                className="inputVal"
                                name="pan_dob"
                                ref={panNoRef}
                                placeholder={getLangText('PAN_NO_PHOLDER', 'LOGIN')}
                                value={pan_dob}
                                maxLength={10}
                                onChange={onchangeVal}
                                onKeyPress={(e) => onKeyPress(e)}
                            // onBlur={(e) => onBlurInput(e)}
                            />
                        </div>
                        <div className="errorDiv">
                            <span className="error">{inputError.pan}</span>
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
                    >
                        <LangText module="BUTTONS" name="SUBMIT" />
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

export default connect(null, mapDispatchToProps)(Loader(UnblockUserDialogComponent));