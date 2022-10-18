import React, { useState, useEffect, useRef } from 'react'
import { useFetch, MsfRequest } from '../../../index'
import { connect } from "react-redux";

import LangText from '../../../common/lang/LangText';

import useCloseModal from '../../../customHooksComponents/useCloseModal';
import {
    checkEmpty, convertToLowerCase, convertToUpperCase, getBackOfficeBaseURL,
    getBaseURL, getVirtualTradeBaseURL, placeGetRequest
} from '../../../common/CommonMethods';
import { EditWatchlistIcon, PhoneIcon, EmailIcon, CameraIcon, 
    GoldPackIcon } from '../../common/FontIcons';

import { PROFILE } from '../../../config/ServiceURLs';

import {
    showProfileDialog, showAppDialog, storeProfileDetails,
    storeBankDetails, storeProfileImageUrl
} from '../../../state/actions/Actions'
import { HEADER_PROFILE, THEMES } from '../../../common/Constants';
import { WidgetLoader } from '../../common/WidgetLoaderComponent';

function ProfileDialogComponent(props) {
    const MsfFetch = useFetch()

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose)

    const [bankError, setBankError] = useState()
    const [sortedBankDetails, setSortedBankdetails] = useState([])
    const [profileDetails, setProfileDetails] = useState()
    const [profErr, setProfErr] = useState()
    const [porfileImage, setporfileImage] = useState()
    const [isSubscribed, setIsSubscribed] = useState(false)
    // const [imgErr, setImgErr] = useState()
    // const [clientCode, setClientCode] = useState(false)
    const [currentPOAstatus, setCurrentPOAstatus] = useState(true)
    // const [activateFNO, setActivateFNO] = useState(true)
    const [hideBranchDetails, setHideBranchDetails] = useState(false)

    useEffect(() => {

        if (props.profileData === null) {
            getProfileDetails()
        }
        else {
            setPorfileDataToState(props.profileData)

            if (props.bankData === null) {
                getBankDetails(true)
            }
            else
                setBankDetailsToState(props.bankData)
        }
        if (props.profile_img_URL === null) {
            getProfileImage()
        }
        else {
            setporfileImage(props.profile_img_URL)
        }
    }, [])

    function onClose() {
        props.showProfileDialog({
            dialogName: null
        })
    }

    function setPorfileDataToState(data) {
        setProfileDetails(data)
        if (data) {
            let segments = data.segment.split(/[ ,]+/);
            let index = segments.findIndex(i => (i === "NFO" && i === "BFO"));
            if (index === -1) {
                // setActivateFNO(false)
            }
            let userSubscribed = data.isSubscribed
            if (userSubscribed) {
                setIsSubscribed(true)
            }
            else
                setIsSubscribed(false)
            let poa_status = convertToLowerCase(data.poaStatus)
            if (poa_status === 'inactive') {
                setCurrentPOAstatus(false)
            }
            let branchCode = data.brnchCde
            if (branchCode) {
                branchCode = convertToUpperCase(branchCode.trim())
                if (branchCode === "ONL1")
                    setHideBranchDetails(true)
            }
        }
    }

    function setBankDetailsToState(data) {
        let primaryAccNo = data.bankAccountNo
        let bankDetails = data.bankdtls
        if (bankDetails.length) {
            bankDetails.map((item, index) => {
                if (item.bankAccountNo === primaryAccNo) {
                    bankDetails.splice(index, 1);
                    bankDetails.unshift(item);
                    item.isPrimary = true
                }
                if (item.bankAccountNo)
                    item.maskedDetails = (item.bankName + ' -* ' + item.bankAccountNo.substr(-4))
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

    function getProfileImage() {
        let url = getVirtualTradeBaseURL() + PROFILE.GET_USER_PROFILE
        placeGetRequest(url, successRespGetProfileImage, errorRespGetProfileImage)
    }

    function successRespGetProfileImage(response) {
        props.storeProfileImageUrl(response.url)
        if (response) {
            setporfileImage(response.url)
        }
    }

    function errorRespGetProfileImage() {
        // setImgErr(error)
    }

    function getProfileDetails() {
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.addToData({
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + PROFILE.PROFILE_DETAILS,
            request,
            successRespCBGetProfDetails,
            errorRespCBGetProfDetails
        )
    }

    function successRespCBGetProfDetails(response) {
        props.storeProfileDetails(response.data)
        getBankDetails()
        setPorfileDataToState(response.data)
    }

    function errorRespCBGetProfDetails(error) {
        setProfErr(error.message)
        props.hideWidgetLoader();
    }

    function getBankDetails(isLoader) {
        if (isLoader === true) {
            props.showWidgetLoader()
        }
        let request = new MsfRequest();
       
        request.addToData({})
        MsfFetch.placeRequest(
            getBaseURL() + PROFILE.GET_USER_BANKDETAILS,
            request,
            successRespGetBankDetails,
            errorRespCBGetBankDetails
        )
    }

    function successRespGetBankDetails(response) {
        props.storeBankDetails(response.data)
        setBankDetailsToState(response.data)
        props.hideWidgetLoader();
    }
    function errorRespCBGetBankDetails(error) {
        setBankError(error.message)
        props.hideWidgetLoader();
    }

    function upload_pic() {
        props.showProfileDialog({
            dialogName: HEADER_PROFILE.IMAGE_UPLAOD
        })
    }

    return (
        <div className={`headerPorfilePage profile-details`} ref={modalRef}>
            {
                profileDetails ?
                    <>
                        <div className="profile-header">
                            <span className="profile-Icon">
                                <img src={porfileImage
                                    ? porfileImage
                                    :
                                    props.selectedTheme.theme === THEMES.LIGHT ?
                                        "assets/images/dashboard/user_img.svg"
                                        :
                                        "assets/images/dark/dashboard/user_img.svg"}
                                alt=""
                                />
                                <span className="camera-bg cursor">
                                    <CameraIcon onClick={upload_pic} />
                                </span>
                            </span>
                            <span className="uname">
                                {checkEmpty(profileDetails.name)}
                            </span>
                            <span className="client-no">
                                {checkEmpty(profileDetails.clientCode)}
                            </span>
                            {
                                isSubscribed ?
                                    <>
                                        <span className="plan-type">
                                            <GoldPackIcon />
                                            {checkEmpty(profileDetails.product)}
                                            {
                                                profileDetails.product ?
                                                    <span className="pack">
                                                        <LangText module="PROFILE" name="PACK" /></span>
                                                    : ''
                                            }
                                        </span>
                                    </>
                                    : null
                            }
                        </div>
                        <div className="profile-body">
                            <div className="content-title">
                                <span className="title">
                                    <LangText module="PROFILE" name="ACC_DETAILS" />
                                </span>
                            </div>
                            <div className="contents">
                                <div className="row">
                                    <div className="data">
                                        <LangText module="PROFILE" name="EMAIL_ID" />
                                        <span className="edit-icon cursor">
                                            <EditWatchlistIcon />
                                        </span>
                                    </div>
                                    <div className="val">
                                        {checkEmpty(profileDetails.email)}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="data">
                                        <LangText module="PROFILE" name="PAN" />
                                    </div>
                                    <div className="val">
                                        {checkEmpty(profileDetails.panNo)}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="data">
                                        <LangText module="PROFILE" name="PHONE" />
                                        <span className="edit-icon cursor">
                                            <EditWatchlistIcon />
                                        </span>
                                    </div>
                                    <div className="val">
                                        {checkEmpty(profileDetails.mobNo)}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="data">
                                        <LangText module="PROFILE" name="SEGMENTS" />
                                    </div>
                                    <div className="val segments">
                                        <span className="value">
                                            {checkEmpty(profileDetails.segment)}
                                        </span>
                                        {/* {
                                            activateFNO ?
                                                <span className="activate-msg cursor">
                                                    <LangText module="PROFILE" name="ACTIVATE_FNO" />
                                                </span> : ''
                                        } */}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="data">
                                        <LangText module="PROFILE" name="TYPENID" />
                                    </div>
                                    <div className="val clr">
                                        {checkEmpty(profileDetails.dpNme) + ',  ' + checkEmpty(profileDetails.dpId)}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="data">
                                        <LangText module="PROFILE" name="NOMINEE" />
                                    </div>
                                    <div className="val">
                                        {checkEmpty(profileDetails.nomineeName)}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="data">
                                        <LangText module="PROFILE" name="POA" />
                                    </div>
                                    <div className={`val ${!currentPOAstatus ? 'inactive' : ''} `}>
                                        {
                                            checkEmpty(profileDetails.poaStatus)
                                        }
                                        {/* {
                                            !currentPOAstatus ?
                                                <span className="activate-poa cursor">
                                                    <LangText module="PROFILE" name="ACTIVATE_POA" />
                                                </span>
                                                : ''
                                        } */}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="data">
                                        <LangText module="PROFILE" name="ADDRESS" />
                                    </div>
                                    <div className="val address">
                                        {checkEmpty(profileDetails.address)}
                                    </div>
                                </div>
                                {
                                    !hideBranchDetails ?
                                        <>
                                            <div className="row">
                                                <div className="data">
                                                    <LangText module="PROFILE" name="RELATIONSHIP_MANAGER" />
                                                </div>
                                                <div className="val rmDetails">
                                                    <div className="rmName">
                                                        {checkEmpty(profileDetails.rmName)}
                                                    </div>
                                                    <div className="rmContacts">
                                                        <span className="rmMob">
                                                            <span className="icon">
                                                                <PhoneIcon />
                                                            </span>
                                                            <span className="mobileNo">
                                                                {checkEmpty(profileDetails.rmMob)}
                                                            </span>

                                                        </span>
                                                        <span className="rmEmail">
                                                            <span className="icon">
                                                                <EmailIcon />
                                                            </span>
                                                            <span className="email">
                                                                {checkEmpty(profileDetails.rmEmail)}
                                                            </span>

                                                        </span>
                                                    </div>

                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="data">
                                                    <LangText module="PROFILE" name="BRANCH" />
                                                </div>
                                                <div className="val">
                                                    {checkEmpty(profileDetails.brnchCde)}
                                                </div>
                                            </div>
                                        </>
                                        : null
                                }
                            </div>
                        </div>
                    </>
                    : <span className="errorMsg profile">
                        {profErr}
                    </span>
            }
            <div className="profile-footer">
                {
                    (sortedBankDetails && sortedBankDetails.length) ?
                        <>
                            <div className="footer-title">
                                <LangText module="PROFILE" name="BANK_DETAILS" />
                                {/* <span className="changePrimary">
                                    {sortedBankDetails.length === 1 ?
                                        <LangText module="PROFILE" name="ADD_BANKS" />
                                        :
                                        <LangText module="PROFILE" name="BANK_MANAGEMENT" />
                                    }
                                </span> */}
                            </div>
                            <div className="footer-content">
                                {
                                    sortedBankDetails.map((item, index) => {
                                        return (
                                            <span key={index} className={`card-details ${item.isPrimary ?
                                                'primary' : ''}`}>
                                                {item.maskedDetails}
                                                {
                                                    item.isPrimary ?
                                                        <span className="primaryAcc">
                                                            <LangText module="PROFILE" name="PRIMARY_ACC" />
                                                        </span>
                                                        : ''
                                                }
                                            </span>
                                        )
                                    })
                                }
                            </div>
                        </>
                        : <span className="errorMsg profile">
                            {bankError}
                        </span>
                }
            </div>
        </div>
    );
}

const mapStateToProps = ({ profileDialog, settings }) => {
    return {
        profileDialog: profileDialog.dialog,
        profileData: profileDialog.profileDetails,
        bankData: profileDialog.bankDetails,
        profile_img_URL: profileDialog.profile_image_url,
        selectedTheme: settings.selectedTheme
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        showProfileDialog: (s) => { dispatch(showProfileDialog(s)) },
        storeProfileDetails: (s) => { dispatch(storeProfileDetails(s)) },
        storeBankDetails: (s) => { dispatch(storeBankDetails(s)) },
        storeProfileImageUrl: (s) => { dispatch(storeProfileImageUrl(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WidgetLoader(ProfileDialogComponent));
