import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { useFetch, MsfRequest } from '../../../index'

// import MenuProfileDetailsComponent from './MenuProfileDetailsComponent'

import { handleLogout } from '../../../common/Bridge'
import { ACCOUNT_MENU_LIST_GUEST, APP_MENUS, HEADER_SETTINGS, 
    LANG_TEXT_KEY, 
    LOCAL_STORAGE} from '../../../common/Constants'
import LangText, { getLangText } from '../../../common/lang/LangText'

import { showAppDialog,storeHelpAndSupportPopupFlag, 
    storeSelectedDashboardWidget, 
    storeSettingsDialogDetails } from '../../../state/actions/Actions'
import { LOGIN } from '../../../config/ServiceURLs'
import { getBaseURL } from '../../../common/CommonMethods'

import { Loader } from '../../common/LoaderComponent'
import { getItemFromSessionStorage } from '../../../common/LocalStorage'

function AccountMenuDialogComponent(props) {

    const MsfFetch = useFetch()

    const [menuList] = useState(ACCOUNT_MENU_LIST_GUEST)
    const [openAccLink, setOpenAccLink] = useState("")
    const [becomePartnerLink, setBecomePartnerLink] = useState("")

    useEffect(()=> {
        let openAccountLink = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.OPEN_OTHER_GUESTACC_LINK))
        setOpenAccLink(openAccountLink)
        let becomeAPartnerLink = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.BECOME_A_PARTNER))
        setBecomePartnerLink(becomeAPartnerLink)
    },[])

    function onSelectMenu(menu) {
        // if (menu.name === APP_MENUS.MY_PROFILE) {
        //     props.showProfileDialog({
        //         dialogName: HEADER_PROFILE.PROFILE_PAGE
        //     })
        // }
        if (menu.name === APP_MENUS.SETTINGS) {
            props.storeSettingsDialogDetails({
                dialogName: HEADER_SETTINGS.SETTINGS_BASE
            })
        }
        else if (menu.name === APP_MENUS.HELP_SUPPORT) {
            props.storeHelpAndSupportPopupFlag({
                showHelpAndSupport:true,
                isAfterLogin:true
            })
        }
        // else if (menu.name === APP_MENUS.DEMO) {
        //     watchlistSetDemo()
        //     props.storeSelectedQuoteSym(null)
        //     props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT)
        //     props.storeOrderPadDialogDetails({
        //         dialogName: null
        //     })
        //     if(props.history && props.history.location && props.history.location.pathname !== SCREENS.DASHBOARD){
        //         props.history.push(SCREENS.DASHBOARD)
        //         initDirectDemoTour()

        //     }
        //     else {
        //         reInitDemoTour()
        //     }
        // }
        else if (menu.name === APP_MENUS.LOG_OUT) {
            props.showAppDialog({
                // title: getLangText('LOGOUT', 'LOGIN'),
                // message: "Leaving Soon? Stay a little longer and explore our amazing offers just for you."
                // + "  Open a Demat & Trading a/c with us and be connected with us forever.",
                message:getLangText("GUEST_LOGOUT_MSG_1"),
                buttons: [{ name: getLangText('YES', 'BUTTONS'), action: onSubmitLogoutOk, 
                    className: "positiveBtn" }],
                guestBtns: [{ name: getLangText('OPEN_DEMAT_ACCOUNT', 'BUTTONS'), action: onclickOpenAccount, 
                    className: "become-a-partner-btn-guestuser text-nowrap" },
                { name: getLangText('BECOME_A_PARTNER_GUEST', 'BUTTONS'), action: onclickBecomePartner, 
                    className: "open-account-btn-guestuser" }],
                defaultBtnName: getLangText('NO', 'BUTTONS'),
                show: true,
                logoutGuest:true
            })
        }

        props.onClose()
    }

    // function watchlistSetDemo() {
    //     let wObj = Object.assign([], props.selectedWatchgroupResp)
    //     let updatedList = wObj[props.selectedWatchgroup.wName]
    //     props.storeDemoWatchList(updatedList[0])
    //     if(updatedList[0].sym.instrument === "FUTSTK") {
    //         props.storeDemoWatchListMtf(true)
    //     }
    // }

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
        <div className="account-info-dialog">
            <div className="account-content">
                {/* <MenuProfileDetailsComponent onClickProfileCB={onClose} /> */}
                <div
                    className={`menu-details scrollArea scroller_firefox `}
                >
                    {
                        menuList.map((item, index) => {
                            return (
                                <div key={index}
                                    className={`menu-row`}
                                    onClick={() => onSelectMenu(item)}
                                >
                                    {
                                        item.iconText?
                                            <span className="menu-icon bfsl-font">{item.iconText}</span>
                                            :null
                                    }
                                    <span className="menu-name">
                                        <LangText name={item[LANG_TEXT_KEY]} module="MENU" /></span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

// const mapStateToProps = ({ watchlist}) => {
//     return {
//         selectedWatchgroup: watchlist.selectedWatchgroup,
//         selectedWatchgroupResp: watchlist.selectedWatchgroupResp,
//     }
// }

const mapDispatchToProps = (dispatch) => {
    return {
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) },
        storeSettingsDialogDetails: (s) => { dispatch(storeSettingsDialogDetails(s)) },
        storeHelpAndSupportPopupFlag: (s) => { dispatch(storeHelpAndSupportPopupFlag(s)) }
    };
};

export default connect(null, mapDispatchToProps)(withRouter(Loader(AccountMenuDialogComponent)));
