import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../index'

import { WidgetLoader } from '../../common/WidgetLoaderComponent';

import { PROFILE } from '../../../config/ServiceURLs'
import { showProfileDialog, storeProfileDetails, storeProfileImageUrl, storeRatingAndFeedback } from '../../../state/actions/Actions';

import {
    checkEmpty, getBackOfficeBaseURL, getVirtualTradeBaseURL,
    placeGetRequest
} from '../../../common/CommonMethods'
import { CameraIcon, GoldPackIcon } from '../../common/FontIcons';
import { HEADER_PROFILE, RATING_FEEDBACK } from '../../../common/Constants';
import LangText from '../../../common/lang/LangText';

function MenuProfileDetailsComponent(props) {

    const MsfFetch = useFetch()

    const [profileDetails, setProfileDetails] = useState({})
    const [profileImgURL, setProfileImgURL] = useState(null)
    const [pendingReq, setPendingReq] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [defaultImage, setDefautltImg] = useState()

    useEffect(() => {
        if (props.profile_image_url)
            setProfileImgURL(props.profile_image_url)
        else
            getProfileImage()

        if (props.profileData)
            setPorfileDataToState(props.profileData)
        else
            getProfileDetails()
    }, [])

    function getProfileImage() {
        setDefautltImg("")
        setProfileImgURL("")
        let url = getVirtualTradeBaseURL() + PROFILE.GET_USER_PROFILE
        placeGetRequest(url, successRespGetProfileImage, errorRespGetProfileImage)
    }

    function successRespGetProfileImage(response) {
        if (response && response.url) {
            props.storeProfileImageUrl(response.url)
            setProfileImgURL(response.url)
        }
    }

    function errorRespGetProfileImage() {
        setDefautltImg("assets/images/dashboard/user_img.svg")
    }

    function getProfileDetails() {
        setPendingReq(true)
        props.showWidgetLoader();
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + PROFILE.PROFILE_DETAILS,
            request,
            successRespCBGetProfDetails,
            errorRespCBGetProfDetails
        )
    }

    function successRespCBGetProfDetails(response) {
        props.storeProfileDetails(response.data)
        setPorfileDataToState(response.data)
        props.hideWidgetLoader();
        setPendingReq(false)
    }

    function errorRespCBGetProfDetails() {
        setPendingReq(false)
        props.hideWidgetLoader();
    }

    function setPorfileDataToState(data) {
        setProfileDetails(data)
        if (data) {
           
            let userSubscribed = data.isSubscribed
            if (userSubscribed) {
                setIsSubscribed(true)
            }
            else 
                setIsSubscribed(false)
        }
    }

    function onClickProfile() {
        props.showProfileDialog({
            dialogName: HEADER_PROFILE.PROFILE_PAGE
        })
        props.onClickProfileCB()
    }

    function onClickRatingFeed() {
        props.storeRatingAndFeedback({
            dialogName: RATING_FEEDBACK.RATING_BASE
        })
        props.onClickRatingFeedback()
    }

    if (pendingReq)
        return null

    return (
        <div className="profile-details" onClick={onClickProfile}>
            <div className="img-container">
                <img src={profileImgURL ? profileImgURL : defaultImage} alt="" />
                <span className="camera-bg">
                    <CameraIcon />
                </span>
            </div>
            <div className="details-container">
                <div className="profile-name text-nowrap"
                    title={profileDetails.name}>{checkEmpty(profileDetails.name)}</div>
                <div className="profile-id text-nowrap"
                    title={profileDetails.clientCode}>{checkEmpty(profileDetails.clientCode)}</div>
                {
                    isSubscribed ?
                        <>
                            <span className="plan-type">
                                <GoldPackIcon />
                                {checkEmpty(profileDetails.product)}
                                {
                                    profileDetails.product ?
                                        <span className="pack"> <LangText module="PROFILE" name="PACK" /></span>
                                        : ''
                                }
                            </span>
                        </>
                        : null
                }
            </div>
        </div>
    )
}

const mapStateToProps = ({ profileDialog }) => {
    return {
        profileData: profileDialog.profileDetails,
        profile_image_url: profileDialog.profile_image_url
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeProfileImageUrl: (s) => { dispatch(storeProfileImageUrl(s)) },
        storeProfileDetails: (s) => { dispatch(storeProfileDetails(s)) },
        showProfileDialog: (s) => { dispatch(showProfileDialog(s)) },
        storeRatingAndFeedback: (s) => { dispatch(storeRatingAndFeedback(s))},
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WidgetLoader(MenuProfileDetailsComponent));