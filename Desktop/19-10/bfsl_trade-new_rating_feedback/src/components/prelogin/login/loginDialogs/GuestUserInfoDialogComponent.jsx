import React , { useEffect, useState }from "react";
import { useFetch, MsfRequest } from '../../../../index'

import { LOCAL_STORAGE } from "../../../../common/Constants";

import LangText from '../../../../common/lang/LangText'
import { getItemFromSessionStorage } from "../../../../common/LocalStorage";
// import useCloseModal from '../../../../customHooksComponents/useCloseModal';
import { CloseIcon } from "../../../common/FontIcons";
import { LOGIN } from "../../../../config/ServiceURLs";
import { getBaseURL } from "../../../../common/CommonMethods";
import { handleLogout } from "../../../../common/Bridge";

const GuestUserInfoDialogComponent = (props) => {

    const MsfFetch = useFetch()

    // const modalRef = useRef(null)
    // const closeModal = useCloseModal()
    // closeModal.useOutsideAlerter(modalRef, closeDialog)

    const [openAccLink, setOpenAccLink] = useState("")

    useEffect(()=> {
        let openAccountLink = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.OPEN_OTHER_GUESTACC_LINK))
        setOpenAccLink(openAccountLink)
    },[])

    function loginOpen() {
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            getBaseURL() + LOGIN.GUEST_USER_LOGOUT,
            request,
            null,
            null,
            false
        )
        handleLogout()
    }

    function closeDialog() {
        props.onCloseCB && props.onCloseCB()
    }

    return (
        <div className="app-modalDialog guest-user-info-dialog">
            <div className="window">
                <div className="title-close">
                    <CloseIcon onClick={props.onCloseCB} />
                </div>
                <div className="guest-user-info-header">
                    <span className="guest-user-info-infoMsg-head">
                        <LangText  name="GUEST_MENU_INFO_HEAD" />
                    </span>
                </div>
                <div className="guest-user-info-content">
                    <span className="guest-user-info-infoMsg">
                        <LangText  name="GUEST_MENU_INFO_CONTENT" />
                    </span>
                </div>
                <div className="guest-user-info-btnDiv">
                    <div className="guest-login-btn">
                        <button className="open-account-btn" onClick={loginOpen}>
                            <span className="cursor">
                                <LangText  name="LOGIN"/>
                            </span>
                        </button>
                    </div>
                    <div className="guest-login-btn">
                        <a href={openAccLink} target="_blank" rel="noopener noreferrer">
                            <button className="continue-btn" onClick={closeDialog}>
                                <span className="cursor">
                                    <LangText name="OPEN_DEMAT_ACCOUNT" />
                                </span>
                            </button>
                        </a>
                    </div>                        
                </div>
            </div>
        </div>
           
    );
};

export default GuestUserInfoDialogComponent