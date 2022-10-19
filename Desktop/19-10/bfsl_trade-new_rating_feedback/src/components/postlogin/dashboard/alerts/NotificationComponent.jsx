/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react'
import { useFetch, MsfRequest } from '../../../../index';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {
    ACTION_REDIRECT, AF_EVENT_NAMES, AF_EVENT_TYPES, ALERTS_MENU_ARRAY, ALERT_MENUS, ALERT_SIGN_FILTER,
    ALERT_TYPE_LIST, 
    ORDER_TYPES, SCREENS} from '../../../../common/Constants';
import LangText, { getLangText } from '../../../../common/lang/LangText';
import { CloseIcon, CreateAlertIcon, MessageIcon } from '../../../common/FontIcons';
import { AF_EventTriggered, getMarketDataBaseURL, getShieldServiceseUrl, 
    isValidHttpUrl } from '../../../../common/CommonMethods';

import { ALERT_SERVICES, QUOTE } from '../../../../config/ServiceURLs';
import { gotoTrade } from '../../../../common/Bridge';
import { storeAlertBtnOpenSearch } from '../../../../state/actions/Actions';
import { WidgetLoader } from '../../../common/WidgetLoaderComponent';

const NotificationComponent = (props) => {

    const MsfFetch = useFetch()

    const [selectedFilter, setSelectedFilter] = useState(ALERT_MENUS[1].name)
    const [resultAlert, setResultAlert] = useState([])
    const [resultNotify, setResultNotify] = useState([])
    const [alertCritType, setalertCritType] = useState(false)
    const [clearAll, setClearAll] = useState(false)
    const [callNewAlert, setCallNewAlert] = useState(false)
    const [showAlertCount, setShowAlertCount] = useState(false)
    const [showMsgIcon, setShowMsgIcon] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [landOnNotify, setLandOnNotify] = useState("")
    // const [pushNotification, setPushNotification] = useState("")

    const orderType = useRef('')
    const alertReadedCount = useRef([])

    useEffect(() => {
        // getClearAllApi() 
        // props.hideCount(false)
        if(props.alertCount > 0) {
            getReadedCount()
        }
    },[])

    useEffect(() =>{
        onLoadPushnotification()
    },[resultAlert])

    useEffect(() => {
        // onClickPushnotification()
        if (selectedFilter === ALERTS_MENU_ARRAY.ALERTS) {
            getAllInboxMessages()
            
        }
        else if(selectedFilter === ALERTS_MENU_ARRAY.NOTIFICATIONS) {
            getGlobalMessages()
            onLoadPushnotification()
        }
    }, [selectedFilter])

    useEffect(() => {
        if(props.landOnNotification) {
            console.log("props.landOnNotification", props.landOnNotification)
            setLandOnNotify(props.landOnNotification)
            setSelectedFilter(ALERT_MENUS[1].name)
        }
    }, [props.landOnNotification])
    
    function getAllInboxMessages() {
        props.showWidgetLoader();
        setClearAll(false)
        setCallNewAlert(false)
        setResultNotify([])
        setResultAlert([])
        let request = new MsfRequest();
        // request.setEncrypt(false)
        request.addToData({})
        MsfFetch.placeRequest(
            getShieldServiceseUrl() + ALERT_SERVICES.GET_ALL_INBOX,
            request,
            successRespCBAlertMsg,
            errorRespCBgetAlertMsg
        )
    }

    function successRespCBAlertMsg(response) {
        // console.log(response)
        props.hideWidgetLoader();
        let dataLength = Object.keys(response.data).length
        if(dataLength > 0) {
            let responseData = response.data.Messages
            responseData.map((item) => {
                item.alertSym = JSON.parse(item.extra_info)
                let extraLen = Object.keys(item.alertSym).length
                if(extraLen === 3) {
                    item.extraFlag = true
                }
                else {
                    item.extraFlag = false
                }
                Object.keys(ACTION_REDIRECT).forEach(function(key) {
                    if (ACTION_REDIRECT[key] === item.target) {
                        item.targetUrl = true
                    }
                });
                return item
            })
            setResultAlert(responseData)
            setalertCritType(true)
            setClearAll(true)
            // console.log(props.alertCount)
            // if(props.alertCount !== alertShowCount.current) {
            //     // console.log(props.alertCount)
            //     setShowAlertCount(true)
            //     alertShowCount.current = props.alertCount
            // }

            // getUpdateInboxMessage(responseData)
            console.log('responseData :', responseData);
        }
        else {
            setClearAll(false)
            setCallNewAlert(true)
        }
    }

    function errorRespCBgetAlertMsg(error) {
        props.hideWidgetLoader();
        setalertCritType(false)
        setClearAll(false)
        setResultAlert([])
        setResultNotify([])
        // console.log(error)
        setErrorMsg(error.message)
    }

    function getUpdateInboxMessage(unreadArray) {
        props.showWidgetLoader();
        let request = new MsfRequest();
        // request.setEncrypt(false)
        // let unreadNotify = []
        // unreadArray.map((item) => {
        //     if(item.notificationID)
        //         unreadNotify.push(item.notificationID)
        // })
        request.addToData({
            "notificationList": unreadArray
        })
        MsfFetch.placeRequest(
            getShieldServiceseUrl() + ALERT_SERVICES.UPDATE_INBOX_MESSAGE,
            request,
            successRespCBUnreadMsg,
            errorRespCBgetUnreadMsg
        )
    }

    function successRespCBUnreadMsg() {
        props.hideWidgetLoader();
        setShowAlertCount(false)
        setCallNewAlert(true)
        props.hideCount(false)
        // console.log(response)
    }

    function errorRespCBgetUnreadMsg(error) {
        props.hideWidgetLoader();
        console.log(error)
    }

    function getGlobalMessages() {
        props.showWidgetLoader();
        setResultAlert([])
        setResultNotify([])
        let request = new MsfRequest();
        // request.setEncrypt(false)
        request.addToData({})
        MsfFetch.placeRequest(
            getShieldServiceseUrl() + ALERT_SERVICES.GET_GLOBAL_MESSAGE,
            request,
            successRespCBGlobalMsg,
            errorRespCBgetGlobalMsg
        )
    }

    function successRespCBGlobalMsg(response) {
        props.hideWidgetLoader();
        let dataLength = Object.keys(response.data).length
        if(dataLength > 0) {
            let responseData = response.data.Messages
            console.log('responseData :', responseData);
            responseData.map((item) => {
                item.notifySym = JSON.parse(item.extra_info)
                return item
            })
            setResultNotify(responseData)
            // getUpdateInboxMessage(response.data.Messages)
        }
        else {
            setShowMsgIcon(true)
            setErrorMsg(getLangText('NO_NEW_NOTIFICATIONS', 'MESSAGES'))
        }
    }

    function errorRespCBgetGlobalMsg(error) {
        // console.log(error)
        props.hideWidgetLoader();
        setResultAlert([])
        setResultNotify([])
        setErrorMsg(error.message)
    }

    function getClearAllApi() {
        props.showWidgetLoader();
        let request = new MsfRequest();
        // request.setEncrypt(false)
        request.addToData({})
        MsfFetch.placeRequest(
            getShieldServiceseUrl() + ALERT_SERVICES.CLEAR_ALL_MESSAGE,
            request,
            successRespCBClearMsg,
            errorRespCBgetClearMsg
        )
    }

    function successRespCBClearMsg() {
        props.hideWidgetLoader();
        setShowAlertCount(false)
        // console.log(response)
        setClearAll(false)
        setResultAlert([])
    }

    function errorRespCBgetClearMsg(error) {
        props.hideWidgetLoader();
        console.log(error)
    }

    function getType(type) {
        if (type.charAt(0) === 'g')
            return ALERT_SIGN_FILTER[0].name
        if (type.charAt(0) === 'l')
            return ALERT_SIGN_FILTER[1].name
        if (type.charAt(0) === 'e')
            return ALERT_SIGN_FILTER[2].name
        return null
    }

    function onClickTrade(e, getTriggerSym, type) {
        e.preventDefault()
        e.stopPropagation()
        orderType.current = type
        let getAlertGroup = getTriggerSym.alertSym.sym
        getToOrderPad(getAlertGroup)

    }

    function getToOrderPad(sym){
        let request = new MsfRequest();
        // request.setEncrypt(false)
        request.addToData({
            sym
        })
        console.log(request)
        MsfFetch.placeRequest(
            getMarketDataBaseURL() + QUOTE.GET_SYM_ALERT,
            request,
            successRespCBGetOrderPad,
            errorRespCBGetOrderPad
        )
    }

    function successRespCBGetOrderPad(response) {
        if(response.data) {
            props.history.push(SCREENS.DASHBOARD)
            gotoTrade(response.data, orderType.current)
            props.onClose()
        }
    }

    function errorRespCBGetOrderPad(error) {
        console.log(error)
    }

    function getAlertData(val) {
        setSelectedFilter(val)
    }

    function getNotifyData(val) {
        setSelectedFilter(val)
    }

    function closeNotify() {
        props.onClose()
    }

    function onClickAdd() {
        props.history.push(SCREENS.ALERTS)
        props.storeAlertBtnOpenSearch(true)
        props.onClose()
        AF_EventTriggered(AF_EVENT_NAMES.ALERT , AF_EVENT_TYPES.PENDING_TRIGERED_ALERT)
    }

    function onLoadPushnotification() {
        // let arrayIndex =""
        // let res = [{pushMsg:"testing https:www.facebook.com info to find the browsing history"},{pushMsg:"testing the speed of https:www.utube.com info to "}]
    
        if(resultAlert && resultAlert.length){
            resultAlert.map((itemlist) => {
                let arrayList = itemlist.pushMsg.split(" ")
                let urlIndex = arrayList.findIndex(item => {return isValidHttpUrl(item)})
                if(urlIndex !== -1) {
                    itemlist.beforeLink = "";
                    itemlist.afterLink = "";
                    arrayList.map((item, index) => {
                        if(index < urlIndex)
                            itemlist.beforeLink = itemlist.beforeLink + " " + item
                        else if (index === urlIndex)
                            itemlist.link = item
                        else if (index > urlIndex)
                            itemlist.afterLink = itemlist.afterLink + " " + item
                    })
                    return itemlist;

                }
                return null
            })
        } 
        
    }

    function getReadedCount() {
        let request = new MsfRequest();
        // request.setEncrypt(false)
        request.addToData({})
        MsfFetch.placeRequest(
            getShieldServiceseUrl() + ALERT_SERVICES.GET_ALL_INBOX,
            request,
            successRespCBAlertCountMsg,
            errorRespCBgetAlertCountMsg
        )
    }

    function successRespCBAlertCountMsg(response) {
        let responseData = response.data.Messages
        let dataLength = Object.keys(response.data).length
        if(dataLength > 0) {
            let unreadNotify = []
            responseData.map((item) => {
                if(item.notificationID)
                    unreadNotify.push(item.notificationID)
            })
            alertReadedCount.current = unreadNotify
        }
        geReadedGlobal()
    }

    function errorRespCBgetAlertCountMsg(error) {
        setErrorMsg(error.message)
    }

    function geReadedGlobal() {
        let request = new MsfRequest();
        // request.setEncrypt(false)
        request.addToData({})
        MsfFetch.placeRequest(
            getShieldServiceseUrl() + ALERT_SERVICES.GET_GLOBAL_MESSAGE,
            request,
            successRespCBAllMsg,
            errorRespCBgetAllMsg
        )
    }

    function successRespCBAllMsg(response) {
        let responseData = response.data.Messages
        let dataLength = Object.keys(response.data).length
        if(dataLength > 0) {
            responseData.map((item) => {
                if(item.notificationID)
                alertReadedCount.current.push(item.notificationID)
            })
        }
        getUpdateInboxMessage(alertReadedCount.current)
    }

    function errorRespCBgetAllMsg(error) {
        setErrorMsg(error.message)
    }

    return (
        <>

            <div className="notify-content">
                <div className="notify-head">
                    <span className="notify-head-label">
                        <LangText name="ALERTS_NOTIFICATIONS" module="ALERT" />
                    </span>
                    <div>{landOnNotify}</div>
                    <span className="close-notify" onClick={closeNotify}>
                        <CloseIcon />
                    </span>
                </div>
                <div className="notify-toggle">
                    <div className="alert-tab"
                        onClick={() => getAlertData(ALERTS_MENU_ARRAY.ALERTS)}>
                        <div className={`alert-click cursor 
                     ${selectedFilter === ALERTS_MENU_ARRAY.ALERTS ?
            'selected' : ''}`}>
                            <LangText name="ALERTS" module="ALERT" />
                            {
                                showAlertCount ?
                                    <div className="alert-count-div">
                                        <div
                                            className={(selectedFilter === ALERTS_MENU_ARRAY.ALERTS) ?
                                                "red-div" : "red-div-unselect"}>
                                            <span className="alert-count">{props.alertCount}</span>
                                        </div>

                                    </div>
                                    :
                                    null
                            }
                        </div>

                        {/* <div className="positions-count">{alertLength}</div> */}
                    </div>
                    <div className="notify-tab"
                        onClick={() => getNotifyData(ALERTS_MENU_ARRAY.NOTIFICATIONS)}
                    >
                        <div className={`notify-click cursor 
                     ${selectedFilter === ALERTS_MENU_ARRAY.NOTIFICATIONS ?
            'selected' : ''}`}>
                            <LangText name="NOTIFICATIONS" module="ALERT" />
                            {/* <div className="alert-count-div">
                                    <div className="red-div">
                                        <span className="alert-count">{props.alertCount}</span>
                                    </div>
                                </div> */}
                        </div>

                        {/* <div className="equity-count">{notifyLength}</div> */}
                    </div>
                    {/* {
                            ALERT_MENUS.map((item, index) => {
                                return (
                                    <div key={index} className={`menu ${selectedMenu === item.name ? 'active' : ''}`}
                                        onClick={() => setSelectedMenu(item.name)}
                                    >
                                        <LangText name={item.langKey} module="ALERT" />
                                        <div className="positions-count">{count}</div>
                                    </div>
                                )
                            })
                        } */}
                </div>
                {selectedFilter === ALERTS_MENU_ARRAY.ALERTS ?
                    <>
                        {
                            clearAll ?
                                <div className="notify-clear">
                                    <div className="add-alert-btn">
                                        <button className="btn-addAlert"
                                            onClick={onClickAdd}
                                        >
                                            <LangText module="BUTTONS" name="CREATE_ALERT" />
                                        </button>
                                    </div>
                                    <span className="notify-clear-label cursor" onClick={getClearAllApi}>
                                        <LangText name="CLEAR_ALL" module="ALERT" />
                                    </span>
                                </div>
                                :
                                null
                        }
                    </>

                    : null}
                <div className="notifyScreen-data">
                    {selectedFilter === ALERTS_MENU_ARRAY.ALERTS ?
                        <>
                            { (resultAlert && resultAlert.length) ?
                                resultAlert.map((itemlist) => {
                                    return (
                                        (itemlist.extraFlag === true) ?
                                            <div className="alert-details" key={itemlist}>
                                                <div className="itemList-1">
                                                    <div className="head-alert-1">
                                                        <div className="itemList-head">
                                                            <span className="itemList-date">
                                                                {itemlist.created_at}
                                                            </span>
                                                            <span className="name">
                                                                {itemlist.alertSym.sym.dispSym}
                                                            </span>
                                                        </div>
                                                        <div className="notifyModal-buttons">
                                                            <div className="btn-div">
                                                                <div className="trigger-buy">
                                                                    <button className={`buy-btn2 
                                                                    ${props.selectedLang.id ==='marathi' ?
                                            "marathi-buy-btn2" : ""}`}
                                                                    onClick={(e) =>
                                                                        onClickTrade(e,
                                                                            itemlist, ORDER_TYPES.BUY)}
                                                                    >
                                                                        <LangText module="BUTTONS" 
                                                                            name="NOTIFICATION_BUY_BTN" />
                                                                    </button>
                                                                </div>
                                                                <div className="trigger-sel">
                                                                    <button className={`sell-btn2 
                                                                    ${props.selectedLang.id ==='marathi' ?
                                            "marathi-sell-btn2" :""}`}
                                                                    onClick={(e) =>
                                                                        onClickTrade(e,
                                                                            itemlist, ORDER_TYPES.SELL)}
                                                                    >
                                                                        <LangText module="BUTTONS" 
                                                                            name="NOTIFICATION_SELL_BTN" />
                                                                    </button>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="itemList-content">
                                                    <div className="alert-type">
                                                        <span className="content-head">
                                                            <LangText name="ALERT_TYPE"
                                                                module="ALERT" />
                                                        </span>
                                                        <span className="content-value">
                                                            {alertCritType ?
                                                                ALERT_TYPE_LIST[
                                                                    itemlist.alertSym.alertInfo.
                                                                        criteriaType.substr(
                                                                            1, itemlist.alertSym.alertInfo.
                                                                                criteriaType.length)
                                                                ]
                                                                : null}
                                                        </span>
                                                    </div>
                                                    <div className="alert-type condition">
                                                        <span className="content-head">
                                                            <LangText name="ALERT_CONDITION"
                                                                module="ALERT" />
                                                        </span>
                                                        <span className="content-value">
                                                            {alertCritType ?
                                                                getType(itemlist.alertSym.alertInfo.
                                                                    criteriaType)
                                                                : null}
                                                        </span>
                                                    </div>
                                                    <div className="alert-type value">
                                                        <span className="content-head">
                                                            <LangText name="ALERT_VALUE"
                                                                module="ALERT" />
                                                        </span>
                                                        <span className="content-value">
                                                            {itemlist.alertSym.alertInfo.criteriaValue}
                                                        </span>
                                                    </div>

                                                </div>
                                            </div>
                                            :
                                            <>
                                                <div className="alert-shield" key={itemlist}>
                                                    <div className="shield-head">
                                                        <span className="shield-date">
                                                            {itemlist.created_at}
                                                        </span>
                                                    </div>
                                                    <div className="shield-console-title">
                                                        <span className="itemList-msg">
                                                            {itemlist.title}
                                                        </span>
                                                    </div>
                                                    <div className="itemList-content">
                                                        <div className="shield-console-msg">
                                                            <span>{itemlist.beforeLink}</span>
                                                            {/* <span  className="cursor" onClick={(e) => {
                                                                e.preventDefault();
                                                                window.open(`${itemlist.link}`,"_blank");
                                                            }}>{itemlist.link}</span> */}
                                                            <a href ={itemlist.link} rel="noopener noreferrer" 
                                                                target="_blank">{itemlist.link}</a>
                                                            <span>{itemlist.afterLink}</span> 
                                                            {/* {itemlist.pushMsg} */}
                                                        </div>
                                                    </div>
                                                    {
                                                        (itemlist.targetUrl) ?
                                                            null
                                                            :
                                                            <>
                                                                <div className="shield-url">
                                                                    <span className="url-link">
                                                                        <a href={itemlist.target}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer">
                                                                            {itemlist.target}
                                                                        </a>
                                                                    </span>
                                                                </div>
                                                            </>
                                                    }
                                                    {Object.keys(itemlist.alertSym.image).length !== 0 ?
                                                        <div className="image-div">
                                                            <img src={itemlist.alertSym.image}
                                                                alt=" "
                                                                className="img-responsive"/>
                                                        </div>
                                                        : null}
                                                    {Object.keys(itemlist.alertSym.video).length !== 0 ?
                                                        <div className="image-div">
                                                            <video className="img-responsive" alt=" " controls>
                                                                <source src={itemlist.alertSym.video}
                                                                    type="video/mp4" />
                                                            </video>
                                                        </div>
                                                        : null}
                                                </div>

                                            </>
                                    // <div className="errorMsg-div">
                                    //     <span className="colspan">
                                    //         <LangText name="NO_NEW_ALERTS"
                                    //             module="MESSAGES" />
                                    //     </span>
                                    // </div>
                                    )
                                })
                                :

                                <div className="errorMsg-div">
                                    {
                                        callNewAlert ?
                                            <>
                                                <div className="notify-createIcon">
                                                    <CreateAlertIcon className="add-alert-notify"/>
                                                </div>
                                                <span className="colspan-add">
                                                    <LangText name="ADD_ALERT_MESSAGE"
                                                        module="MESSAGES" />
                                                </span>
                                                <div className="add-alert-btn">
                                                    <button className="btn-addAlert"
                                                        onClick={onClickAdd}
                                                    >
                                                        <LangText module="BUTTONS" name="CREATE_ALERT" />
                                                    </button>
                                                </div>
                                            </>
                                            :
                                            <>
                                                {/* <div className="notify-messageIcon">
                                                        <MessageIcon className="msg-alert-notify"/>
                                                    </div> */}
                                                <span className="colspan">
                                                    {errorMsg}
                                                    {/* <LangText name="NO_NEW_ALERTS"
                                                            module="MESSAGES" /> */}
                                                </span>
                                            </>
                                    }
                                </div>
                            }

                        </>
                        :
                        <>
                            { (resultNotify && resultNotify.length) ?
                                resultNotify.map((itemlist) => {
                                    return (
                                        <div className="notify-details" key={itemlist}>
                                            <div className="itemList-2">
                                                <div className="head-alert-2">
                                                    <div className="itemList-head-notify">
                                                        <span className="itemList-date">
                                                            {itemlist.created_at}
                                                        </span>
                                                        <span className="name">
                                                            {itemlist.title}
                                                        </span>
                                                        <span className="push-msg">
                                                            {itemlist.pushMsg}
                                                        </span>
                                                        {isValidHttpUrl(itemlist.target) ?
                                                            <span className="push-msg notification-url">
                                                                <a href={itemlist.target} target="_blank"
                                                                    rel="noopener noreferrer">
                                                                    {itemlist.target}</a>
                                                            </span> : null
                                                        }
                                                        {
                                                            (itemlist.notifySym.image === "") ?
                                                                <>

                                                                </>
                                                                :
                                                                <>
                                                                    <div className="image-div">
                                                                        <img src={itemlist.notifySym.image}
                                                                            alt=" "
                                                                            className="img-responsive"/>
                                                                    </div>
                                                                </>
                                                        }
                                                        {
                                                            (itemlist.notifySym.video === "") ?
                                                                <>

                                                                </>
                                                                :
                                                                <>
                                                                    <div className="image-div">
                                                                        <video className="img-responsive" alt=" "
                                                                            controls>
                                                                            <source src={itemlist.notifySym.video}
                                                                                type="video/mp4" />
                                                                        </video>
                                                                    </div>
                                                                </>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                :
                                <div className="errorMsg-div">
                                    {
                                        showMsgIcon ?
                                            <div className="notify-messageIcon">
                                                <MessageIcon className="msg-alert-notify"/>
                                            </div>
                                            :
                                            null
                                    }
                                    <span className="colspan">
                                        {errorMsg}
                                        {/* <LangText name="NO_NEW_NOTIFICATIONS"
                                                module="MESSAGES" /> */}
                                    </span>
                                </div>}
                        </>
                    }
                </div>
            </div>

        </>
    )
}
const mapStateToProps = ({ settings}) => {
    return {    
        selectedLang: settings.selectedLang
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeAlertBtnOpenSearch: (s) => { dispatch(storeAlertBtnOpenSearch(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WidgetLoader(NotificationComponent)));

