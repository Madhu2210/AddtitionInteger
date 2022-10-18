import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { MsfRequest, useFetch } from '../../../index'
import { Loader } from '../../common/LoaderComponent'
// import { Right_icon } from '../../common/FontIcons';

import { checkEmpty, getBackOfficeBaseURL } from '../../../common/CommonMethods'
import {SCREENS, THEMES } from '../../../common/Constants';
import LangText from '../../../common/lang/LangText'

import { LAS_SERVICES } from '../../../config/ServiceURLs';
import {
    showAppDialog, storeAvailLoanDialogDetails, storeLASUserStageResponse, storeShowKYCTerms,
    storeUserBank,
    storeUserStage
} from '../../../state/actions/Actions';
// import { LAS_KYC_MESSAGE } from '../../../common/Messages';
// import { CheckBoxIcon_Checked, CheckBoxIcon_UnChecked } from '../../common/FontIcons';

function ConfirmKYCComponent(props) {
    const MsfFetch = useFetch()
    const [userDetails, setUserDetails] = useState(null)
    const [accountDetails, setAccountDetails] = useState({})
    const [selectedBank, setSelectedBank] = useState({})
    const [sortedBankDetails, setSortedBankdetails] = useState([])
    const [combinedBankDetails, setCombinedBankdetails] = useState([])
    const [bankError, setBankError] = useState(null)
    // const [kycError, setKycError] = useState(null)
    // const [isAgreed, setIsAgreed] = useState(false)

    useEffect(() => {
        if (props.responseData.loanId) {
            setUserDetails(props.responseData)
        } else if (props.eligibleAmnt) {
            setUserDetails(props.eligibleAmnt)
        }
    }, [])

    useEffect(() => {
        if (userDetails) {
            getUserDetails()
        }
    }, [userDetails])

    useEffect(() => {
        if (sortedBankDetails.length) {

            let details = Object.assign([], sortedBankDetails)
            details = details.map((item) => {
                if (item.accountNo) {
                    item.ifscDetails = (item.bankName + " " + item.accountNo)

                } else {
                    item.ifscDetails = item.bankName
                }

                return item
            })
            setCombinedBankdetails(details)
            if (props.userBank) {
                setSelectedBank(props.userBank)
            } else {
                setSelectedBank(details[0])
            }

        }
    }, [sortedBankDetails, props.userBank])

    // function getEligibleDetails() {
    //     props.showLoader();
    //     let request = new MsfRequest();
    //     MsfFetch.placeRequest(
    //         getBackOfficeBaseURL() + LAS_SERVICES.GET_USER_STAGE,
    //         request,
    //         successRespCBGetEligibility,
    //         errorRespCBGetEligibility
    //     )
    // }

    // function successRespCBGetEligibility(response) {
    //     props.hideLoader();
    //     setUserDetails(response.data)
    //     props.storeLASUserStageResponse(response.data)
    // }

    // function errorRespCBGetEligibility(error) {
    //     console.log("error", error.message)
    //     props.hideLoader();
    //     props.showAppDialog({
    //         message: error.message,
    //         show: true
    //     })

    // }

    function getUserDetails() {
        props.showLoader();
        let request = new MsfRequest();
        request.addToData({ loanId: userDetails.loanId })

        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.GET_KYC,
            request,
            successRespCBGetKYC,
            errorRespCBGetKYC
        )
    }

    function successRespCBGetKYC(response) {
        setUserBankDetails(response.data)
        setAccountDetails(response.data.accntDtls)
        props.hideLoader();

    }

    function errorRespCBGetKYC(error) {
        setBankError(error.message)
        props.hideLoader();

    }

    // function getUserBankDetails() {
    //     props.showLoader();
    //     let request = new MsfRequest();

    //     MsfFetch.placeRequest(
    //         getBaseURL() + PROFILE.GET_USER_BANKDETAILS,
    //         request,
    //         successRespGetBankDetails,
    //         errorRespCBGetBankDetails
    //     )
    // }
    // function successRespGetBankDetails(response) {
    //     setUserBankDetails(response.data)
    //     props.hideLoader();
    // }
    // function errorRespCBGetBankDetails(error) {
    //     setBankError(error.message)
    //     props.hideLoader();
    // }

    function onBankChange(item) {
        setSelectedBank(item)
        props.storeUserBank(item)

    }

    function setUserBankDetails(data) {
        let bankDetails = data.bankDetails
        if (bankDetails.length) {
            bankDetails.map((item, index) => {
                if (index == 0) {
                    item.isPrimary = true
                }
                if (item.accountNo)
                    item.maskedDetails = (item.bankName + ' -* ' + item.accountNo.substr(-4))
                else
                    item.maskedDetails = item.bankName
                return bankDetails;
            })
        }
        else {
            setBankError("No Data Available")
        }
        setSortedBankdetails(bankDetails)
    }

    function onClickClose() {
        props.history.push(SCREENS.DASHBOARD)
    }

    // function onClickTerms() {
    //     // props.history.push(SCREENS.TERMS)
    //     props.storeAvailLoanDialogDetails({
    //         dialogName: LAS_LOAN_DIALOGS.TERMS_IFRAME
    //     })
    // }

    function onClickKYC() {
        updateBank()
    }

    function updateBank() {
        props.showLoader();
        let request = new MsfRequest();
        request.addToData({
            'loanId': userDetails.loanId,
            'bnkNme': selectedBank.bankName,
            'accNo': selectedBank.accountNo,
            'ifscCode': selectedBank.ifsc,
            'bnkAdrs': selectedBank.bnkAdrs ? selectedBank.bnkAdrs : ""
        
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.UPDATE_BANK,
            request,
            successRespCBSetBank,
            errorRespCBSetBank
        )
    }

    function successRespCBSetBank() {
        updateStage()
    }

    function errorRespCBSetBank(error) {
        props.hideLoader();
        props.showAppDialog({
            message: error.message,
            show: true
        })
    }

    function updateStage() {
        let request = new MsfRequest();
        props.showLoader();
        request.addToData({ loanId: userDetails.loanId })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.UPDATE_USER_STAGE,
            request,
            successRespCBSetStage,
            errorRespCBSetStage
        )
    }

    function successRespCBSetStage() {
        getUserstage()
    }

    function errorRespCBSetStage(error) {
        props.hideLoader();
        props.showAppDialog({
            message: error.message,
            show: true
        })
    }

    function getUserstage() {
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.GET_USER_STAGE,
            request,
            successRespCBGetUserStage,
            errorRespCBGetUserStage
        )
    }

    function successRespCBGetUserStage(response) {
        props.hideLoader();
        props.storeLASUserStageResponse(response.data)
        props.storeUserStage({
            userStage: response.data.stage
            // userStage: LAS_USER_STAGE.EKYC_FINISHED

        })

    }

    function errorRespCBGetUserStage(error) {
        props.hideLoader();
        props.showAppDialog({
            message: error.message,
            show: true
        })
    }

    // function getDisableSubmitFlag() {
    //     if (!isAgreed)
    //         return true
    //     return false
    // }
    return (
        <div className="kyc-base">
            <div className="kyccontent-left">
                <div className="content-left">
                    <span className={`profile-Img ${accountDetails.gndr=="Male" || props.profile_img_URL ?
                        "male-img" :""}`}>
                        <img src={props.profile_img_URL
                            ? props.profile_img_URL
                            : props.selectedTheme.theme === THEMES.LIGHT ?
                                accountDetails.gndr && accountDetails.gndr === "Male" ?
                                    "assets/images/dashboard/user_img.svg" :
                                    "assets/images/user_female.svg"
                                :
                                accountDetails.gndr && accountDetails.gndr === "Male" ?
                                    "assets/images/dark/dashboard/user_img.svg" :
                                    "assets/images/dark/user_female.svg"} alt=""
                        />
                    </span>
                    <span className="uname">
                        {checkEmpty(accountDetails.name)}
                    </span>
                </div>
                <div className="row">
                    <div className="data">
                        <LangText module="LAS" name="DP_ID" />
                    </div>
                    <span className="client-no">
                        {checkEmpty(accountDetails.dpId)}
                    </span>
                </div>
            </div>
            <div className="kyccontent-right">
                <div className="content-righthead-first">
                    <span className="title">
                        <LangText name="KYC_HEAD_FIRST" module="LAS" />
                    </span>
                </div>
                <div className="content-right">

                    <div className="row">
                        <div className="data">
                            <LangText module="LAS" name="EMAIL" />
                        </div>
                        <div className="val">
                            {checkEmpty(accountDetails.email)}
                        </div>
                    </div>
                    <div className="row">
                        <div className="data">
                            <LangText module="LAS" name="PHONE" />
                        </div>
                        <div className="val">
                            {checkEmpty(accountDetails.mobNo)}
                        </div>
                    </div>
                    <div className="row">
                        <div className="data">
                            <LangText module="LAS" name="PAN" />
                        </div>
                        <div className="val">
                            {checkEmpty(accountDetails.panNo)}
                        </div>
                    </div>
                    <div className="row">
                        <div className="data">
                            <LangText module="LAS" name="DOB" />
                        </div>
                        <div className="val">
                            {checkEmpty(accountDetails.dob)}
                        </div>
                    </div>
                    <div className="row">
                        <div className="data">
                            <LangText module="LAS" name="ADDRESS" />
                        </div>
                        <div className="val">
                            {checkEmpty(accountDetails.address)}
                        </div>
                    </div>
                    <div className="content-righthead-second">
                        <span className="title">
                            <LangText name="KYC_HEAD_SECOND" module="LAS" />
                        </span>
                    </div>
                    <div className={'bank-div'}>

                        {
                            combinedBankDetails && combinedBankDetails.length ?
                                <>
                                    {
                                        combinedBankDetails.map((item, index) => {
                                            return (
                                                <label className={`cursor radioField data`}
                                                    key={index}
                                                >
                                                    <input type="radio"
                                                        name={item}
                                                        onChange={() => { onBankChange(item) }}
                                                        checked={selectedBank ?
                                                            item.ifscDetails === selectedBank.ifscDetails : false}
                                                    />
                                                    <span className="checkmark"></span>
                                                    <div className={`value 
                                                    ${item.ifscDetails === selectedBank.ifscDetails ? "selected" : ""}
                                                    ${item.isPrimary ? 'primary' : ''}`}>{item.maskedDetails}
                                                        {
                                                            item.isPrimary ?
                                                                <span className="primaryAcc">
                                                                    <LangText name="PRIMARY" module="LAS" />
                                                                </span>
                                                                : ''
                                                        }
                                                    </div>

                                                    {
                                                        selectedBank.ifscDetails === item.ifscDetails ?
                                                            < div className="bankAddress">
                                                                <span key={index}>
                                                                    <div>{item.bnkAdrs}</div>
                                                                    <div className="ifsc">
                                                                        <span> <LangText name="IFSC" module="LAS" />
                                                                        </span>
                                                                        <span>{item.ifsc}</span>
                                                                    </div>
                                                                </span>
                                                            </div>
                                                            : null
                                                    }
                                                </label>

                                            )
                                        })
                                    }

                                </>

                                : <div className="banks-errorDiv-KYC">
                                    {bankError}
                                </div>
                        }

                    </div>
                    {/* <div className="checkbox-div">
                        {!props.isUserAcceptedKYC ?
                            <>
                                <div className="cursor accept-div" onClick={() => setIsAgreed(!isAgreed)}>

                                    {
                                        isAgreed ?
                                            <CheckBoxIcon_Checked />
                                            :
                                            <CheckBoxIcon_UnChecked />
                                    }
                                </div>
                                <div className="termscon">
                               
                                    <span className="condition">{LAS_KYC_MESSAGE.CONFIRM_KYC}
                                        <span className="las-termsncondition cursor" onClick={() => onClickTerms()}>
                                            <LangText module="LAS" name="TERMS_N_CONDN" /></span>
                                    </span>
                                </div>
                            </>
                            : ""}
                    </div> */}
                    <div className="KYC-footer">
                        <button className="las-negativeBtn"
                            onClick={onClickClose}>
                            <LangText module="BUTTONS" name="CANCEL" />
                        </button>
                        <button

                            className="las-positivebtn"
                            // disabled={!props.isUserAcceptedKYC ? 'disabled' : ""}
                            // disabled={getDisableSubmitFlag()}
                            onClick={onClickKYC} >

                            <LangText module="BUTTONS" name="CONTINUE" />
                        </button>
                    </div>
                </div>

            </div>

        </div >
    )
}

const mapStateToProps = ({ las, profileDialog, settings }) => {

    return {
        userBank: las.userBank,
        responseData: las.responseData,
        eligibleAmnt: las.eligibleAmnt,
        isUserAcceptedKYC: las.isUserAcceptedKYC,
        profile_img_URL: profileDialog.profile_image_url,
        selectedTheme: settings.selectedTheme

    }
}
const mapDispatchToProps = (dispatch) => {
    return {

        storeShowKYCTerms: (s) => { dispatch(storeShowKYCTerms(s)) },
        storeUserStage: (s) => { dispatch(storeUserStage(s)) },
        storeLASUserStageResponse: (s) => { dispatch(storeLASUserStageResponse(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeUserBank: (s) => { dispatch(storeUserBank(s)) },
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) }

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Loader(ConfirmKYCComponent)));