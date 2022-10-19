import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";

import { WidgetLoader } from '../../common/WidgetLoaderComponent';

import { PROFILE } from '../../../config/ServiceURLs'
import { showProfileDialog, storeProfileDetails, storeProfileImageUrl } from '../../../state/actions/Actions';
import LangText from '../../../common/lang/LangText';

import {
    getVirtualTradeBaseURL,
    placeGetRequest
} from '../../../common/CommonMethods'
// import { CameraIcon } from '../../common/FontIcons';
// import { HEADER_PROFILE } from '../../../common/Constants';

function MenuProfileDetailsComponent(props) {

    const [profileImgURL, setProfileImgURL] = useState(null)
    const [pendingReq] = useState(false)
    const [defaultImage, setDefautltImg] = useState()

    useEffect(() => {
        if (props.profile_image_url)
            setProfileImgURL(props.profile_image_url)
        else
            getProfileImage()

        // if (props.profileData)
        //     setPorfileDataToState(props.profileData)
        // else
        //     getProfileDetails()
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

    // function getProfileDetails() {
    //     setPendingReq(true)
    //     props.showWidgetLoader();
    //     let request = new MsfRequest();
    //     MsfFetch.placeRequest(
    //         getBackOfficeBaseURL() + PROFILE.PROFILE_DETAILS,
    //         request,
    //         successRespCBGetProfDetails,
    //         errorRespCBGetProfDetails
    //     )
    // }

    // function successRespCBGetProfDetails(response) {
    //     props.storeProfileDetails(response.data)
    //     setPorfileDataToState(response.data)
    //     props.hideWidgetLoader();
    //     setPendingReq(false)
    // }

    // function errorRespCBGetProfDetails() {
    //     setPendingReq(false)
    //     props.hideWidgetLoader();
    // }

    // function onClickProfile() {
    //     props.showProfileDialog({
    //         dialogName: HEADER_PROFILE.IMAGE_UPLAOD
    //     })
    //     props.onClickProfileCB()
    // }

    if (pendingReq)
        return null

    return (
        <div className="profile-details">
            <div className="img-container">
                <img src={profileImgURL ? profileImgURL : defaultImage} alt="" />
                {/* <span className="camera-bg">
                    <CameraIcon />
                </span> */}
            </div>
            <div className="details-container">
                <div className="profile-name text-nowrap"
                ><LangText  name="GUEST_USER" /></div>
                <div className="profile-id text-nowrap"
                ></div>
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
        showProfileDialog: (s) => { dispatch(showProfileDialog(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WidgetLoader(MenuProfileDetailsComponent));