import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { useFetch, MsfRequest } from '../../../index'

// import MenuProfileDetailsComponent from './MenuProfileDetailsComponent'

import { feedbackOnLogout, handleLogout } from '../../../common/Bridge'
import { ACCOUNT_MENU_LIST, AF_EVENT_NAMES,  APP_MENUS, HEADER_PROFILE, 
    HEADER_SETTINGS, LANG_TEXT_KEY, RATING_FEEDBACK } from '../../../common/Constants'
import LangText, { getLangText } from '../../../common/lang/LangText'

import { showAppDialog, showProfileDialog, storeDemoWatchList, storeDemoWatchListMtf, 
    storeHelpAndSupportPopupFlag, storeOrderPadDialogDetails, 
    storeSelectedDashboardWidget, storeSelectedQuoteSym, 
    storeSettingsDialogDetails, storeRatingAndFeedback } from '../../../state/actions/Actions'
import { LOGIN } from '../../../config/ServiceURLs'
import { AF_EventTriggered, getBaseURL } from '../../../common/CommonMethods'

import { Loader } from '../../common/LoaderComponent'

function AccountMenuDialogComponent(props) {

    const MsfFetch = useFetch()

    const [menuList] = useState(ACCOUNT_MENU_LIST)

    function onSelectMenu(menu) {
        if (menu.name === APP_MENUS.MY_PROFILE) {
            props.showProfileDialog({
                dialogName: HEADER_PROFILE.PROFILE_PAGE
            })
        }
        else if (menu.name === APP_MENUS.SETTINGS) {
            props.storeSettingsDialogDetails({
                dialogName: HEADER_SETTINGS.SETTINGS_BASE
            })
        }
        else if (menu.name === APP_MENUS.RATING_AND_FEEDBACK) {
            localStorage.setItem("feedbackPopupPage","general")
            props.storeRatingAndFeedback({
                showRating:true,
                isAfterLogin:true
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
            // props.storeRatingAndFeedback({
            //     showRating:true,
            //     isAfterLogin:true
            // })
            props.showAppDialog({
                // title: getLangText('LOGOUT', 'LOGIN'),
                message: getLangText('LOGOUT_CONFIRM', 'MESSAGES'),
                buttons: [{ name: getLangText('YES', 'BUTTONS'), action: onSubmitLogoutOk, className: "positiveBtn" }],
                defaultBtnName:  getLangText('NO', 'BUTTONS'),
                show: true
            })
        }
        props.onClose()
        AF_EventTriggered(AF_EVENT_NAMES.MENUS , menu.name, {"onClick":menu.name})
    }

    // function watchlistSetDemo() {
    //     let wObj = Object.assign([], props.selectedWatchgroupResp)
    //     let updatedList = wObj[props.selectedWatchgroup.wName]
    //     props.storeDemoWatchList(updatedList[0])
    //     if(updatedList[0].sym.instrument === "FUTSTK") {
    //         props.storeDemoWatchListMtf(true)
    //     }
    // }

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
        <div className="account-info-dialog" >
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
        storeSelectedQuoteSym: (s) => { dispatch(storeSelectedQuoteSym(s)) },
        storeOrderPadDialogDetails: (s) => { dispatch(storeOrderPadDialogDetails(s)) },
        storeHelpAndSupportPopupFlag: (s) => { dispatch(storeHelpAndSupportPopupFlag(s)) },
        storeDemoWatchList: (s) => { dispatch(storeDemoWatchList(s))},
        storeDemoWatchListMtf: (s) => { dispatch(storeDemoWatchListMtf(s))},
        showProfileDialog: (s) => { dispatch(showProfileDialog(s)) },
        storeRatingAndFeedback: (s) => { dispatch(storeRatingAndFeedback(s))}
    };
};

export default connect(null, mapDispatchToProps)(withRouter(Loader(AccountMenuDialogComponent)));
