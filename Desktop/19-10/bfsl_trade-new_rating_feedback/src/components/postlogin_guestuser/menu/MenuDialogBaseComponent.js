import React, { useEffect, useRef, useState } from 'react'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'

import useCloseModal from '../../../customHooksComponents/useCloseModal';
import LangText from '../../../common/lang/LangText';
// import ProfileDetails from './MenuProfileDetailsComponent';

import {
    storeOrderPadDialogDetails, storeProfileImageUrl, storeSelectedAppMenu, storeSelectedDashboardWidget,
    storeSelectedQuoteSym, storeHelpAndSupportPopupFlag, 
    storeLoginDialogDetails, storeShowMenuFlag, storeSettingsDialogDetails
} from '../../../state/actions/Actions';

import { CloseIcon } from '../../common/FontIcons';
import {
    APP_MENUS, APP_MENU_LIST, DASHBOARD_WIDGET_MODE, LANG_TEXT_KEY,
    SCREENS_GUEST, LOGIN_DIALOGS, HEADER_SETTINGS
} from '../../../common/Constants';
// import { convertToUpperCase } from '../../../common/CommonMethods';

function MenuDialogBaseComponent(props) {

    const [menuList, setMenuList] = useState([])
    const [selectedMenu, setSelectedMenu] = useState(null)

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onCloseMenuDialog, false)

    useEffect(() => {
        props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.MARKET_VIEW)
    },[])

    useEffect(() => {
        if (props.selectedAppMenu)
            setSelectedMenu(props.selectedAppMenu)
        else
            setSelectedMenu()
    }, [props.selectedAppMenu])

    useEffect(() => {
        if (props.showMenuDialog) {
            if (props.history && props.history.location) {
                if (props.history.location.pathname === SCREENS_GUEST.DASHBOARD) {
                    if (props.selectedWidgetMode !== DASHBOARD_WIDGET_MODE.MARKET_VIEW) {
                        setSelectedMenu(APP_MENUS.DASHBOARD)
                        props.storeSelectedAppMenu(APP_MENUS.DASHBOARD)
                    }
                    if(props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.MARKET_VIEW) {
                        setSelectedMenu(APP_MENUS.MARKETS)
                        props.storeSelectedAppMenu(APP_MENUS.MARKETS)
                    }
                    if(props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.NEWS_VIEW) {
                        setSelectedMenu(APP_MENUS.NEWS)
                        props.storeSelectedAppMenu(APP_MENUS.NEWS)
                    }
                // } else {
                //     let routePath = getKeyByValue(SCREENS_GUEST, props.history.location.pathname)
                //     console.log('routePath', routePath)
                //     if (routePath === MENU_ALT_NAME.FUNDS_TRANSFER)
                //         routePath = APP_MENUS.FUND_TRANSFER
                //     else if (routePath === MENU_ALT_NAME.ALERTS)
                //         routePath = APP_MENUS.ALERT
                //     setSelectedMenu(routePath)
                //     props.storeSelectedAppMenu(routePath)
                }
            }
        }
    }, [props.showMenuDialog])

    useEffect(() => {
        let menus = Object.assign([], APP_MENU_LIST)
        // if (props.profileData) {
        //     if (convertToUpperCase(props.profileData.poaStatus) !== PROFILE_POA_STATUS.INACTIVE)
        //         menus = menuFilter(menus, [APP_MENUS.EDIS])
        // } else
        //     menus = menuFilter(menus, [APP_MENUS.EDIS])
        menus = menuFilter(menus, [APP_MENUS.LAS])
        setMenuList(menus)
    }, [props.profileData])

    // function getKeyByValue(object, value) {
    //     return Object.keys(object).find(key => object[key] === value);
    // }

    function menuFilter(menus, filterMenus) {
        if (filterMenus && filterMenus.length) {
            filterMenus.map((mItem) => {
                menus = menus.filter(item => item.name !== mItem)
            })
        }

        return menus
    }

    function onSelectMenu(menu) {
        // if (menu.name !== APP_MENUS.DASHBOARD && menu.path) {
        //     props.storeSelectedDashboardWidget(null)
        // }
        // if (!menu.innerAction) {
        //     setSelectedMenu(menu.name)
        //     props.storeSelectedAppMenu(menu.name)
        // }
        // if (menu.path) {
        //     props.history.push(menu.path)
        // }

        if (menu.guest_enable === false) {
            props.storeLoginDialogDetails({
                dialogName: LOGIN_DIALOGS.GUEST_USER_MENU_INFO,
                parentCB: onSuccessLogin_Guest_User,
            })
        }

        if (menu.name === APP_MENUS.DASHBOARD) {
            props.storeSelectedQuoteSym(null)
            props.storeOrderPadDialogDetails({
                dialogName: null
            })
            props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT)
        } else if (menu.name === APP_MENUS.MARKETS) {
            props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.MARKET_VIEW)
        } else if (menu.name === APP_MENUS.HELP_SUPPORT) {
            props.storeHelpAndSupportPopupFlag({
                showHelpAndSupport:true,
                isAfterLogin:true
            })
        } else if (menu.name === APP_MENUS.SETTINGS) {
            props.storeSettingsDialogDetails({
                dialogName: HEADER_SETTINGS.SETTINGS_BASE
            })
        }
        else if (menu.name === APP_MENUS.NEWS) {
            props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.NEWS_VIEW)
        } 

        onCloseMenuDialog()
    }

    function onSuccessLogin_Guest_User() {
        props.storeLoginDialogDetails({
            dialogName: null,
            parentCB: null,
        })
    }

    function onCloseMenuDialog() {
        props.storeShowMenuFlag(false)
    }

    if (!props.showMenuDialog)
        return null

    return (
        <div className="menu-dialog">
            <div className="window" ref={modalRef}>
                <div className="header">
                    <img className="logoImg" src="assets/images/dashboard/logo_menu.svg" alt="" />
                    <span onClick={onCloseMenuDialog}>
                        <CloseIcon />
                    </span>
                </div>
                <div className="content">
                    {/* <ProfileDetails onClickProfileCB={onCloseMenuDialog} /> */}
                    <div
                        className={`menu-details scrollArea scroller_firefox`}
                    >
                        {
                            menuList.map((item, index) => {
                                return (
                                    <div key={index}
                                        className={`menu-row ${selectedMenu === item.name ? 'selected' : ''}
                                        ${item.guest_enable === true ? '' : 'disabled'}`}
                                        onClick={() => onSelectMenu(item)}
                                    >
                                        {item.iconText ?
                                            <span className="menu-icon bfsl-font">{item.iconText}</span>
                                            :
                                            null}
                                        {item.iconText2 ?
                                            <span className="menu-icon bfsl-font-2">{item.iconText2}</span>
                                            :
                                            null}
                                        <span className="menu-name">
                                            <LangText name={item[LANG_TEXT_KEY]} module="MENU" /></span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ menu, dashboard, profileDialog }) => {
    return {
        showMenuDialog: menu.showMenuDialog,
        selectedAppMenu: menu.selectedAppMenu,
        selectedWidgetMode: dashboard.selectedWidgetMode,
        profileData: profileDialog.profileDetails,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // storeAlertFlag: (s) => { dispatch(storeAlertFlag(s)) },
        // storeAlertSelectedSym: (s) => { dispatch(storeAlertSelectedSym(s)) },
        // storeShowPledgeFlag: (s) => { dispatch(storeShowPledgeFlag(s)) },
        storeShowMenuFlag: (s) => { dispatch(storeShowMenuFlag(s)) },
        storeSelectedAppMenu: (s) => { dispatch(storeSelectedAppMenu(s)) },
        storeSelectedQuoteSym: (s) => { dispatch(storeSelectedQuoteSym(s)) },
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) },
        storeSettingsDialogDetails: (s) => { dispatch(storeSettingsDialogDetails(s)) },
        storeOrderPadDialogDetails: (s) => { dispatch(storeOrderPadDialogDetails(s)) },
        storeProfileImageUrl: (s) => { dispatch(storeProfileImageUrl(s)) },
        // storeEdisScreenFlag: (s) => { dispatch(storeEdisScreenFlag(s)) },
        // storeBOReportsScreenFlag: (s) => { dispatch(storeBOReportsScreenFlag(s)) },
        storeHelpAndSupportPopupFlag: (s) => { dispatch(storeHelpAndSupportPopupFlag(s)) },
        storeLoginDialogDetails: (s) => { dispatch(storeLoginDialogDetails(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MenuDialogBaseComponent));