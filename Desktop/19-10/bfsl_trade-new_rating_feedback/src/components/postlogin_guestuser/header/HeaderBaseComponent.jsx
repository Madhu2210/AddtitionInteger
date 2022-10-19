import React, { useEffect, useState, useMemo, useRef } from 'react'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'

// import UserInfoComponent from './UserInfoComponent';
import IndicesComponent from './IndicesComponent';
import AccountMenuDialogComponent from '../menu/AccountMenuDialogComponent';

// import FundDetailsComponent from './FundDetailsComponent';
import { useFetch, MsfRequest } from '../../../index';

import {
    moveToOrderMenu,
    storeAlertSelectedSym,
    storeOrderPadDialogDetails,
    storeSelectedDashboardWidget, storeSelectedIndicesList,
    storeSelectedQuoteSym, 
    storeSettingsDialogDetails, storeShowMenuFlag} from '../../../state/actions/Actions';

import { MenuIcon, UserIcon } from '../../common/FontIcons'
import { getBaseURL, getIndicesList } from '../../../common/CommonMethods';
import { DASHBOARD_WIDGET_MODE, LOCAL_STORAGE, SCREENS_GUEST, THEMES } from '../../../common/Constants';

// import Shield from "@msf/shieldmessaging";

// import * as Bridge from '../../../common/Bridge';
// import { AppSettings } from '../../../common/AppSettings';
// import NotificationComponent from '../dashboard/alerts/NotificationComponent';
// import { ALERT_SERVICES, QUOTE } from '../../../config/ServiceURLs';
import { getItemByKey } from '../../../common/LocalStorage';
import LangText from '../../../common/lang/LangText';
import { handleLogout } from '../../../common/Bridge';
import { LOGIN } from '../../../config/ServiceURLs';
import useCloseModal from '../../../customHooksComponents/useCloseModal';

const HeaderBaseComponent = (props) => {

    const MsfFetch = useFetch()
    // const orderType = useRef('')

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose,false)

    const [indicesList, setIndicesList] = useState([])
    // const [indicesListToDroptown, setIndicesListToDroptown] = useState([])
    const [selectedIndicesList, setSelectedIndicesList] = useState([])
    const [showAccount, setShowAccount] = useState(false)

    // const [showNotification, setShowNotification] = useState(false)
    // const [showCount, setShowCount] = useState(0)
    // const [showRedCircle, setShowRedCircle] = useState(false)
    // const actions = [
    //     {
    //         action: 'MNU_ORDERBOOK',
    //         url: SCREENS.ORDERS
    //     },
    //     {
    //         action: 'MNU_DASH',
    //         url: SCREENS.DASHBOARD
    //     },
    //     {
    //         action: 'MNU_ALERTS',
    //         url: SCREENS.ALERTS
    //     },
    //     {
    //         action: 'MNU_NOTIFICATION',
    //         url: SCREENS.NOTIFICATION
    //     },
    //     {
    //         action: 'MNU_ORDER',
    //         url: SCREENS.ORDERPAD
    //     }
    // ]

    useEffect(() => {
        // window.addEventListener('focus', getUnreadMessageCount);
        let list = getIndicesList().combinedList
        // getNotification()
        // getUnreadMessageCount()
        if (list && list.length) {
            let selectedList = []
            let selectedIndices = JSON.parse(getItemByKey(LOCAL_STORAGE.SELECTED_INDICES))
            if (selectedIndices && selectedIndices.length)
                selectedList = selectedIndices.slice(0, 2)
            else
                selectedList = list.slice(0, 2)
            setSelectedIndicesToState(selectedList)
            storeSelectedIndicesToRedux(selectedList)
            setIndicesList(list)
        }
    }, [])

    // useEffect(() => {
    //     if (selectedIndicesList && selectedIndicesList.length) {
    //         let reqList = []
    //         let actList = Object.assign([], indicesList)
    //         selectedIndicesList.map((item, index) => {
    //             reqList[index] = []
    //             actList.map((item2) => {
    //                 if (item2.sym.id !== item.sym.id) {
    //                     let hasIndices = false
    //                     selectedIndicesList.map((item3) => {
    //                         if (item2.sym.id === item3.sym.id)
    //                             hasIndices = true
    //                     })
    //                     if (!hasIndices)
    //                         reqList[index].push(item2)
    //                 } else reqList[index].push(item2)
    //             })
    //         })
    //         setIndicesListToDroptown(reqList)
    //     }
    // }, [selectedIndicesList])

    // function getNotification() {
    //     if (!isSafari()) {
    //         try {
    //             Shield.checkPermission();
    //             Shield.setSenderID(AppSettings.firebaseSenderId);
    //             Shield.setProjectID(AppSettings.firebaseProjectId)
    //             Shield.setApiKey(AppSettings.firebaseApiKey)
    //             Shield.setFirebaseAppId(AppSettings.firebaseAppId)
    //             Shield.setBaseURL(AppSettings.shieldURL);
    //             Shield.setServiceWorkerPath(AppSettings.serviceWorkerPath);
    //             Shield.setAppID(Bridge.getAppID());
    //             Shield.setUserID(Bridge.getUserID());
    //             Shield.setUserType('TRADE_USER');
    //             Shield.setActions(actions);
    //             Shield.setRoutingCallback(redirect);
    //             Shield.setServiceworkerScope(AppSettings.serviceWorkerScope);
    //             Shield.setEncryptionEnabled(AppSettings.shieldApiEncryption);
    //             Shield.setEncryptionKey(getKey());
    //             Shield.setDeliveryInterval(30000);
    //             Shield.setOnMessageHandler(onMsg)
    //             if (Bridge.getUserID() !== null && Bridge.getUserID() !== "") {
    //                 Shield.init();
    //                 getSelectedTarget(true)
    //             }
    //         }
    //         catch (e) {
    //             console.log("shield", e.message)
    //         }
    //     }
    // }

    // function getSelectedTarget(redirectFlag) {
    //     let selectedPath = Shield.getSelectedTarget();
    //     if (selectedPath) {
    //         selectedPath.then(result => {
    //             console.log('result :', result);

    //             if (redirectFlag)
    //                 redirect(result.actionPath)
    //             else
    //                 getToOrderPad({"sym": JSON.parse(result.sym), "action": result.action})
    //             Shield.clearSelectedTarget();
    //         })
    //             .catch(() => {
    //                 redirect(SCREENS.DASHBOARD)
    //                 Shield.clearSelectedTarget();
    //             })
    //     }
    // }

    // function onMsg(data) {
    //     //it only works for foreground - when the site is open
    //     console.log('msg',data)
    //     getUnreadMessageCount()
    // }

    // function redirect(route) {
    //     console.log('route :', route);
    //     //change this as switch
    //     if (route) {  
    //         if (route === SCREENS.ORDERPAD) {
    //             getSelectedTarget(false)
    //             return
    //         } 
    //         else if (route === SCREENS.NOTIFICATION) {
    //             setShowNotification(true)
    //         }
    //         else if (route === SCREENS.ORDERS) {
    //             if (props.history.location && props.history.location.pathname !== SCREENS.DASHBOARD) {
    //                 props.history.push(SCREENS.DASHBOARD)
    //             }
    //             props.moveToOrderMenu({
    //                 showOrderMenu: true
    //             })
    //         }
    //         else {
    //             props.history.push({
    //                 pathname: route
    //             })
    //         }
    //         Shield.clearSelectedTarget();
    //     }
    // }

    // function getToOrderPad(data) {
    //     let sym = data.sym
    //     orderType.current = data.action
    //     let request = new MsfRequest();
    //     // request.setEncrypt(false)
    //     request.addToData({
    //         sym
    //     })
    //     console.log(request)
    //     MsfFetch.placeRequest(
    //         getMarketDataBaseURL() + QUOTE.GET_SYM_ALERT,
    //         request,
    //         successRespCBGetOrderPad,
    //         errorRespCBGetOrderPad
    //     ) 
    // }

    // function successRespCBGetOrderPad(response) {
    //     if(response.data) {
    //         props.history.push(SCREENS.DASHBOARD)
    //         Bridge.gotoTrade(response.data, orderType.current)
    //     }
    // }

    // function errorRespCBGetOrderPad(error) {
    //     console.log(error)
    // }
    
    // function getUnreadMessageCount() {
    //     let request = new MsfRequest();
    //     // request.setEncrypt(false)
    //     request.addToData({})
    //     MsfFetch.placeRequest(
    //         getShieldServiceseUrl() + ALERT_SERVICES.GET_UNREAD_MESSAGE,
    //         request,
    //         successRespCBCountMsg,
    //         errorRespCBgetCountMsg
    //     )
    // }

    // function successRespCBCountMsg(response) {
    //     console.log(response.data)
    //     if (response.data.unreadCount > 0) {
    //         setShowRedCircle(true)
    //         if (response.data.unreadCount > 9)
    //             setShowCount('9+')
    //         else
    //             setShowCount(response.data.unreadCount)
    //     }
    //     else {
    //         setShowRedCircle(false)
    //     }
    // }

    // function errorRespCBgetCountMsg(error) {
    //     console.log(error)
    // }

    function onSelectIndices(item, replaceIndex) {
        let selectedList = Object.assign([], selectedIndicesList)
        selectedList.splice(replaceIndex, 1, item)
        setSelectedIndicesToState(selectedList)
        storeSelectedIndicesToRedux(selectedList)
    }

    function setSelectedIndicesToState(list) {
        setSelectedIndicesList(list)
    }

    function storeSelectedIndicesToRedux(list) {
        let updatedList = []
        list.map((item) => {
            let symObj = {
                dispSym: item.dispSym,
                sym: item.sym,
                baseSym: item.baseSym,
                hasFutOpt: item.hasFutOpt
            }
            updatedList.push(symObj)
        })
        props.storeSelectedIndicesList(updatedList)
    }

    function getReqIndicesList(selectedList, selectedIndex) {
        let list = Object.assign([], indicesList)
        selectedList.map((item1, index) => {
            if (index !== selectedIndex) {
                list = list.filter((item2) => {
                    if (item2.sym.id !== item1.sym.id)
                        return item2
                    return ""
                })
            }
        })
        return list
    }

    function onClickLogo() {
        props.storeSelectedQuoteSym(null)
        props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT)
        props.storeOrderPadDialogDetails({
            dialogName: null
        })
        props.storeAlertSelectedSym(null)
        props.history.push(SCREENS_GUEST.DASHBOARD)
    }

    function onClickMenuIcon() {
        props.storeShowMenuFlag(true)
    }

    // function onClickNotification() {
    //     setShowNotification(!showNotification)
    // }

    // function closeNotification() {
    //     setShowNotification(false)

    // }

    // function hideCountCB(val) {
    //     setShowRedCircle(val)
    // }

    function loginPageRedirect() {
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

    function onClickAccount() {
        setShowAccount(!showAccount)
    }

    function onClose() {
        setShowAccount(false)
    }

    return (
        <div className="headerBase-div">
            <div className="menuIcon-div flex-center">
                <MenuIcon className="flex-center" onClick={onClickMenuIcon} />
            </div>
            <div className="logo-div-base">
                <div className="logo-div flex-center">
                    {
                        props.selectedTheme.theme === THEMES.LIGHT ?
                            <img className="cursor" src="assets/images/header/Bajaj_logo.svg" alt=""
                                onClick={onClickLogo}
                            />
                            :
                            <img className="cursor" src="assets/images/dark/header/Bajaj_logo.svg" alt=""
                                onClick={onClickLogo}
                            />
                    }

                </div>
            </div>
            <div className="indicesDiv-parent highIndices">
                {
                    useMemo(() => {
                        return (
                            selectedIndicesList.length ?
                                selectedIndicesList.map((item, index) => {
                                    return <IndicesComponent
                                        indicesList={getReqIndicesList(selectedIndicesList, index)}
                                        key={index}
                                        onSelectIndicesCB={onSelectIndices}
                                        selectedIndices={item}
                                        index={index}
                                    />
                                })
                                : null
                        )
                    }, [selectedIndicesList])
                }
            </div>
            <div className="guest-welcome">
                <button className="theme-btn guest-register" onClick={loginPageRedirect}>
                    <LangText  name="LOGIN_REGISTER"/>
                </button>
                <span className="wel-msg">
                    <LangText name="WELCOME_GUEST_USER" />
                </span>
            </div>
            {/* <FundDetailsComponent /> */}
            {/* <div className="alert-div flex-center">
                <AlertIcon className="cursor" onClick={onClickNotification} />
                {
                    showRedCircle ?
                        // <>
                        // </>
                        <div className="red-div">
                            <span className="alert-count">{showCount}</span>
                        </div>
                        :
                        null
                }
                {
                    showNotification ?
                        <NotificationComponent onClose={closeNotification}
                            alertCount={showCount} hideCount={hideCountCB} /> :
                        null
                }
            </div> */}
            {/* <div className="userInfo-div">
                <UserInfoComponent />
            </div> */}
            <div className="account-icon" ref={modalRef}>
                <UserIcon onClick={onClickAccount}/>
                {
                    showAccount ?
                        <AccountMenuDialogComponent onClose={onClose}/>
                        :
                        null
                }
            </div>  
        </div>
    )
}

const mapStateToProps = ({ settings, localStorageRed }) => {
    return {
        selectedTheme: settings.selectedTheme,
        selectedIndicesList: localStorageRed.selectedIndicesList
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAlertSelectedSym: (s) => { dispatch(storeAlertSelectedSym(s)) },
        storeSelectedIndicesList: (s) => { dispatch(storeSelectedIndicesList(s)) },
        storeSelectedQuoteSym: (s) => { dispatch(storeSelectedQuoteSym(s)) },
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) },
        storeSettingsDialogDetails: (s) => { dispatch(storeSettingsDialogDetails(s)) },
        storeShowMenuFlag: (s) => { dispatch(storeShowMenuFlag(s)) },
        storeOrderPadDialogDetails: (s) => { dispatch(storeOrderPadDialogDetails(s)) },
        moveToOrderMenu: (s) => { dispatch(moveToOrderMenu(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderBaseComponent));