import React, { useState, useEffect, useRef } from 'react'
import { connect } from "react-redux";

import { getVirtualTradeBaseURL, placeGetRequest } from '../../../common/CommonMethods'
import { PROFILE } from '../../../config/ServiceURLs'
import useCloseModal from '../../../customHooksComponents/useCloseModal';

import { showProfileDialog, showAppDialog, storeProfileImageUrl } from '../../../state/actions/Actions'
import LangText, { getLangText } from '../../../common/lang/LangText';

function ProfileImageComponent(props) {

    const profilePictureRef = useRef(null)

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose)

    const [image, setImage] = useState(null)
    const [errMsg, setErrMsg] = useState("")
    const [disableUpload, setDisableUpload] = useState(true)
    const [remveImg, setRemvImg] = useState(false)
    // const [imgErr, setImgErr] = useState()

    useEffect(() => {
        if (image) {
            let size = Math.round((image.size / 1024))
            if (image.type && !(image.type === 'image/png' || image.type === 'image/jpeg')) {
                setImage("")
                setDisableUpload(true)
                setErrMsg("Invalid image type")
            }
            else if (size > 3072) {
                setImage("")
                setDisableUpload(true)
                setErrMsg("Invalid imag size")
            }
            else if (image.type && (image.type === 'image/png' || image.type === 'image/jpeg')) {
                setDisableUpload(false)
            }
        }
    }, [image])

    function onClose() {
        props.showProfileDialog({
            dialogName: null
        })
    }
    function handleImageUpload(e) {
        setErrMsg("")
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0])
        }
    }
    function onClickRemoveProfile() {
        setRemvImg(true)
    }

    function onSubmitRemoveImg() {
        let url = getVirtualTradeBaseURL() + PROFILE.REMOVE_USER_PROFILE
        placeGetRequest(url, successRespRemoveImg, errorRespRemoveImg)
    }
    function successRespRemoveImg() {
        props.showAppDialog({
            title: getLangText('APP_TITLE', 'OTHERS'),
            message: getLangText('IMAGE_RMV_SUCC_MSG', 'PROFILE'),
            show: true
        })
        props.storeProfileImageUrl(null)

    }
    function errorRespRemoveImg() {
        // setImgErr(error)
    }

    function onUploadProfilePic() {
        const formData = new FormData()
        formData.append("profile", image)
        fetch(getVirtualTradeBaseURL() + PROFILE.UPLOAD_USER_PROFILE, {
            method: 'POST',
            credentials: 'include',
            body: formData
        }).then(response => {
            if (response.status === 200) {
                props.showAppDialog({
                    message: "IMAGE UPLOADED",
                    show: true
                })
            }
            else if (response.status === 204) {
                props.showAppDialog({
                    message: "NO DATA",
                    show: true
                })
            }
            else if (response.status === 440) {
                props.showAppDialog({
                    message: "INVALID",
                    show: true
                })
            }
            else {
                // console.log('failure')
            }
        })
    }
    return (
        <div className="upload-profile-pic" ref={modalRef}>
            <div className="profile-Imgtitle">
                <LangText  name="UPLOAD_PROF_PIC" />
            </div>
            <div className="attach-file">
                <div className="upload-action">
                    <span className="upload-here">
                        <LangText name="CHOOSE_FILE" />
                        <div className="profile-pic-upload">
                            <span className="browse"
                                onClick={() => profilePictureRef.current.click()}>
                                <LangText  name="BROWSE" />
                            </span>
                            <input className="profile-pic" accept="image/x-png,image/jpeg"
                                type="file" ref={profilePictureRef}
                                name="profilePhoto" placeholder="Photo"
                                onChange={handleImageUpload} />
                        </div>
                        <div className="image">{image ? image.name : errMsg ?
                            <span className="error-msg">{errMsg}</span> :
                            ""}
                        </div>
                    </span>

                    <span className="img-size">
                        <LangText  name="MAX_FILESIZE" />
                    </span>
                </div>
            </div> 
            {props.profile_img_URL ?
                <div className="remove-pic"> {
                    !remveImg ?
                        <span className="remove-img">
                            <LangText module="PROFILE" name="REMOVE_PROFILE_PIC" />
                            <span className="remve-pic cursor" onClick={onClickRemoveProfile}>
                                <LangText module="PROFILE" name="CLICK_HERE" />
                            </span>
                        </span>
                        :
                        <div className="confirmRmv">
                            <span className="remove-msg">
                                <LangText  name="REMOVE_IMG" />
                            </span>
                            <div className="action-buttons">
                                <span className="yes cursor" onClick={onSubmitRemoveImg}>
                                    <LangText module="BUTTONS" name="YES" />
                                </span>
                                <span className="no cursor" onClick={onClose}>
                                    <LangText module="BUTTONS" name="NO" />
                                </span>
                            </div>
                        </div>
                }
                </div> : ''}

            <div className="action-btns">
                <button className="cancel"
                    onClick={onClose}>
                    <LangText module="BUTTONS" name="CANCEL" />
                </button>
                <button className="upload"
                    disabled={disableUpload}
                    onClick={onUploadProfilePic}>
                    <LangText name="UPDATE" />
                </button>
            </div>
        </div>
    )
}
const mapStateToProps = ({ profileDialog }) => {
    return {
        profile_img_URL: profileDialog.profile_image_url,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        showProfileDialog: (s) => { dispatch(showProfileDialog(s)) },
        storeProfileImageUrl: (s) => { dispatch(storeProfileImageUrl(s)) }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfileImageComponent);