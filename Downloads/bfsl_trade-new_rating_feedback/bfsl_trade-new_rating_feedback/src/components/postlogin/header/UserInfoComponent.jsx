import React from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../index'

import { Loader } from '../../common/LoaderComponent'
import LangText, { getLangText } from '../../../common/lang/LangText'

import { LOGIN } from '../../../config/ServiceURLs'
import { handleLogout } from '../../../common/Bridge'

import { showAppDialog } from '../../../state/actions/Actions'

import { LogoutIcon} from '../../common/FontIcons'
import { getBaseURL } from '../../../common/CommonMethods'

const UserInfoComponent = (props) => {

    const MsfFetch = useFetch()

    function onClickUserIcon() {
        props.showAppDialog({
            title: getLangText('LOGOUT', 'LOGIN'),
            message: getLangText('LOGOUT_CONFIRM', 'MESSAGES'),
            buttons: [{ name: getLangText('OK', 'BUTTONS'), action: onSubmitLogoutOk, className: "positiveBtn" }],
            defaultBtnName: getLangText('CANCEL', 'BUTTONS'),
            show: true
        })
    }

    function onSubmitLogoutOk() {
        props.showLoader();
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            getBaseURL() + LOGIN.USER_LOGOUT,
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
                <LangText module="HEADER" name="LOGOUT_TXT" />
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