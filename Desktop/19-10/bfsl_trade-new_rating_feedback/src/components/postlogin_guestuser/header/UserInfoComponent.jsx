import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../index'

import { Loader } from '../../common/LoaderComponent'
import LangText, { getLangText } from '../../../common/lang/LangText'

import { LOGIN } from '../../../config/ServiceURLs'
import { handleLogout } from '../../../common/Bridge'

import { showAppDialog } from '../../../state/actions/Actions'

import { LogoutIcon} from '../../common/FontIcons'
import { getBaseURL } from '../../../common/CommonMethods'
import { getItemFromSessionStorage } from '../../../common/LocalStorage';
import { LOCAL_STORAGE } from '../../../common/Constants';

const UserInfoComponent = (props) => {

    const [openAccLink, setOpenAccLink] = useState("")
    const [becomePartnerLink, setBecomePartnerLink] = useState("")

    const MsfFetch = useFetch()

    useEffect(()=> {
        let openAccountLink = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.OPEN_OTHER_GUESTACC_LINK))
        setOpenAccLink(openAccountLink)
        let becomeAPartnerLink = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.BECOME_A_PARTNER))
        setBecomePartnerLink(becomeAPartnerLink)
    },[])

    function onClickUserIcon() {
        props.showAppDialog({
            title: getLangText('LOGOUT', 'LOGIN'),
            message: "Leaving Soon? Stay a little longer and explore our amazing offers just for you."
            + "  Open a Demat & Trading a/c with us and be connected with us forever.",
            buttons: [{ name: getLangText('OK', 'BUTTONS'), action: onSubmitLogoutOk, 
                className: "positiveBtn" }],
            guestBtns: [{ name: getLangText('OPEN_DEMAT_ACCOUNT', 'BUTTONS'), action: onclickOpenAccount, 
                className: "become-a-partner-btn-guestuser" },
            { name: getLangText('BECOME_A_PARTNER_GUEST', 'BUTTONS'), action: onclickBecomePartner, 
                className: "open-account-btn-guestuser" }],
            defaultBtnName: getLangText('CANCEL', 'BUTTONS'),
            show: true,
            logoutGuest:true
        })
    }

    function onclickOpenAccount() {
        window.open(openAccLink)
    }

    function onclickBecomePartner() {
        window.open(becomePartnerLink)
    }

    function onSubmitLogoutOk() {
        props.showLoader();
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

    return (
        <div className="userInfo-base">
            <div className="logoutIcon-div cursor"
                onClick={onClickUserIcon}
            >
                <LogoutIcon />
            </div>
            <div className="userName cursor" onClick={onClickUserIcon}>
                <LangText  name="LOGOUT_TXT" />
            </div>

        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAppDialog: (s) => { dispatch(showAppDialog(s)) }
    };
};

export default connect(null, mapDispatchToProps)(Loader(UserInfoComponent));