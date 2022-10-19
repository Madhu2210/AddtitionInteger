import { streamingManager } from '../index'

import store from '../state/Store'

import {
    storeLogInStatus, storeClientDetails, resetApp, showAppDialog,
    storeAppID, storeLoggedUserType, storeSelectedChartSym, storeOrderpadSelectedSym,
    storeOrderPadDialogDetails, storeQuoteDialogDetails, storeWatchlistDialogDetails,
    storeDeleteSymbol, storeNewWatchListName, storeSearchSymWatchlistFlag, storeLoginDialogDetails,
    storeHoldingsNewsDialogDetails, storeContextMenuDetails,
    storeModifyOrderDetails, storeOrderFieldValues, storeSelectedQuoteSym,
    storeBackScreenFromQuote, storeSelectedDashboardWidget,
    storeToastMsgProps, storeOrderDialogDetails,
    storeIndicesDetails, storeReloadChartSettingsFlag, storeRegetWatchGroupSymbolData,
    storeTaxDeclarationDetails, moveToOrderMenu, storeAlertSearchModify, storeAlertSelectedSym,
    storeSquareoffNetPosition, refreshDemoTour,
    storeSelectedScannerMenu,
    setDemoTourFlag,
    storeHoldingsResponse,
    storeSelectedWatchGroup,
    storeWatchlistFilterParams,
    storeWatchlistSortParams,
    storeSelectedWatchGroupResp,
    storeAllHoldingsResp,
    storeRatingAndFeedback,
    fundRatingAndFeedback
} from '../state/actions/Actions'

import {
    LOCAL_STORAGE, INFO_IDS, ORDERPAD_DIALOGS,
    WATCHLIST_DIALOGS, SCREENS, DASHBOARD_WIDGET_MODE, CHART_WIDGET_MENU_CONST,
    TAX_DECLARATION_STAGES, TAX_DECLARATION_DIALOGS, TAX_DECLARE_BLOCK_SCREENS,
    TAX_DECLARATION_MSG_KEY,
    CHART_WIDGET_MENU_CONST_GUEST,
    TAX_DECLARATION_FO_MSG_KEY,
    AF_EVENT_TYPES,
    AF_EVENT_NAMES,
    SYMBOL_INSTRUMENT_TYPE
} from '../common/Constants'
import {
    AF_EventTriggered,
    convertToUpperCase, formSymBlock, isEquityCashSymbol,
    isEquityFutureSymbol, replaceComma
} from '../common/CommonMethods'
import {
    storeToSessionStorage, clearClientData,
    clearAppID, getItemByKey, getItemFromSessionStorage, storeItemByKey,clearMpinDetails
} from '../common/LocalStorage';
import { getLangText } from './lang/LangText'
import { set } from 'lodash'

export function storeLoginClientDetails(respobj) {
    store.dispatch(storeClientDetails({
        custName: respobj.data.accName,
        lastLoginTime: respobj.data.lastLoginTime,
        session: respobj.data.JSESSIONID
    }))
    store.dispatch(storeLogInStatus(true))
    storeToSessionStorage(LOCAL_STORAGE.LOGIN_STATUS, "true");
}

export function storeLoginType(type) {
    storeToSessionStorage(LOCAL_STORAGE.LOGIN_TYPE, type)
    store.dispatch(storeLoggedUserType(type))
}

export function storeLoginMpin(mpin) {
    storeItemByKey(LOCAL_STORAGE.LOGIN_MPIN, mpin)
}
export function storeLoginMpinUserData(username,userid) {
    storeItemByKey(LOCAL_STORAGE.LOGIN_MPIN_USERNAME, username)
    storeItemByKey(LOCAL_STORAGE.LOGIN_MPIN_USERID, userid)
}
export function storeConfigDetails(data) {
    // console.log('configDetails', data)
    storeToSessionStorage(LOCAL_STORAGE.INDICES, JSON.stringify(data.indices))
    storeToSessionStorage(LOCAL_STORAGE.TRADE_DECIMAL_PRECISION, JSON.stringify(data.precision))
    // storeToSessionStorage(LOCAL_STORAGE.SOCIAL_MEDIA_LINKS, JSON.stringify(data.gwcSocialMediaUrl))
    storeToSessionStorage(LOCAL_STORAGE.OPEN_ACC_LINK, JSON.stringify(data.OpenAccountUrlWeb))
    storeToSessionStorage(LOCAL_STORAGE.WATCHGROUP_LIMIT, data.watchlistGroupLimit)
    storeToSessionStorage(LOCAL_STORAGE.WATCHGROUP_SYM_LIMIT, data.watchlistSymLimit)
    storeToSessionStorage(LOCAL_STORAGE.COMPANY_REG_INFO, JSON.stringify(data.regInfo))
    storeToSessionStorage(LOCAL_STORAGE.FUND_TRANSFER_FOOTER_CONTENT, JSON.stringify(data.fundTransfer))
    storeToSessionStorage(LOCAL_STORAGE.QUOTE_MENUS, JSON.stringify(data.webQuotes))
    storeToSessionStorage(LOCAL_STORAGE.IPO_DETAILS, JSON.stringify(data.IPO))
    storeToSessionStorage(LOCAL_STORAGE.ANDROID_STORE_URL, JSON.stringify(data.android_storeurl))
    storeToSessionStorage(LOCAL_STORAGE.IOS_STORE_URL, JSON.stringify(data.ios_storeurl))
    storeToSessionStorage(LOCAL_STORAGE.TGROUP_SERIES, JSON.stringify(data.TGroupSeries))
    storeToSessionStorage(LOCAL_STORAGE.ODD_LOT_SERIES, JSON.stringify(data.OddLotSeries))
    storeToSessionStorage(LOCAL_STORAGE.OTP_TIMER, JSON.stringify(data.otpTimerSec))
    storeToSessionStorage(LOCAL_STORAGE.LAS_OTP_TIMER, JSON.stringify(data.lasOtpExipry))
    storeToSessionStorage(LOCAL_STORAGE.LAS_HELP, JSON.stringify(data.lasHelp))
    storeToSessionStorage(LOCAL_STORAGE.LAS_REPAYMENT, JSON.stringify(data.lasRepayment))
    storeToSessionStorage(LOCAL_STORAGE.HELP_AND_SUPPORT, JSON.stringify(data.help))
    storeToSessionStorage(LOCAL_STORAGE.OFS_DETAILS, JSON.stringify(data.ofs))
    storeToSessionStorage(LOCAL_STORAGE.OPEN_GUESTACC_LINK, JSON.stringify(data.guestUserLoginAccountUrlWeb))
    storeToSessionStorage(LOCAL_STORAGE.OPEN_OTHER_GUESTACC_LINK, JSON.stringify(data.guestUserOtherAccountUrlWeb))
    storeToSessionStorage(LOCAL_STORAGE.HAS_STORAGE_DATA, JSON.stringify(true))

    let taxDeclareMsgs = {
        [TAX_DECLARATION_MSG_KEY.INITIAL_POPUP]: data[TAX_DECLARATION_MSG_KEY.INITIAL_POPUP],
        [TAX_DECLARATION_MSG_KEY.DECLARATION_MSG]: data[TAX_DECLARATION_MSG_KEY.DECLARATION_MSG],
        [TAX_DECLARATION_MSG_KEY.IN_PROGRESS_MSG]: data[TAX_DECLARATION_MSG_KEY.IN_PROGRESS_MSG],
        [TAX_DECLARATION_MSG_KEY.TRADE_BLOCK]: data[TAX_DECLARATION_MSG_KEY.TRADE_BLOCK],
        [TAX_DECLARATION_MSG_KEY.TRADE_BLOCK_INPROGRESS]: data[TAX_DECLARATION_MSG_KEY.TRADE_BLOCK_INPROGRESS],
        [TAX_DECLARATION_MSG_KEY.TRADE_WARNING]: data[TAX_DECLARATION_MSG_KEY.TRADE_WARNING],
        [TAX_DECLARATION_MSG_KEY.ID_CANCEL_POPUP]: data[TAX_DECLARATION_MSG_KEY.ID_CANCEL_POPUP],
        [TAX_DECLARATION_MSG_KEY.ID_POSITION_CONVERSION]: data[TAX_DECLARATION_MSG_KEY.ID_POSITION_CONVERSION],
        [TAX_DECLARATION_MSG_KEY.ID_SQUARE_OFF_ALL]: data[TAX_DECLARATION_MSG_KEY.ID_SQUARE_OFF_ALL],
        [TAX_DECLARATION_MSG_KEY.ID_SUBMIT_POPUP]: data[TAX_DECLARATION_MSG_KEY.ID_SUBMIT_POPUP],
        [TAX_DECLARATION_MSG_KEY.ID_TRADE_BLOCK_ORDER_TYPE]: data[TAX_DECLARATION_MSG_KEY.ID_TRADE_BLOCK_ORDER_TYPE],
    }
    storeToSessionStorage(LOCAL_STORAGE.TAX_DECLARE_MSG, JSON.stringify(taxDeclareMsgs))

    let taxDeclareMsgs_FO = {
        [TAX_DECLARATION_MSG_KEY.INITIAL_POPUP]: data[TAX_DECLARATION_FO_MSG_KEY.INITIAL_POPUP],
        [TAX_DECLARATION_MSG_KEY.DECLARATION_MSG]: data[TAX_DECLARATION_FO_MSG_KEY.DECLARATION_MSG],
        [TAX_DECLARATION_MSG_KEY.IN_PROGRESS_MSG]: data[TAX_DECLARATION_FO_MSG_KEY.IN_PROGRESS_MSG],
        [TAX_DECLARATION_MSG_KEY.TRADE_BLOCK]: data[TAX_DECLARATION_FO_MSG_KEY.TRADE_BLOCK],
        [TAX_DECLARATION_MSG_KEY.TRADE_BLOCK_INPROGRESS]: data[TAX_DECLARATION_FO_MSG_KEY.TRADE_BLOCK_INPROGRESS],
        [TAX_DECLARATION_MSG_KEY.TRADE_WARNING]: data[TAX_DECLARATION_FO_MSG_KEY.TRADE_WARNING],
        [TAX_DECLARATION_MSG_KEY.ID_CANCEL_POPUP]: data[TAX_DECLARATION_FO_MSG_KEY.ID_CANCEL_POPUP],
        [TAX_DECLARATION_MSG_KEY.ID_POSITION_CONVERSION]: data[TAX_DECLARATION_FO_MSG_KEY.ID_POSITION_CONVERSION],
        [TAX_DECLARATION_MSG_KEY.ID_SQUARE_OFF_ALL]: data[TAX_DECLARATION_FO_MSG_KEY.ID_SQUARE_OFF_ALL],
        [TAX_DECLARATION_MSG_KEY.ID_SUBMIT_POPUP]: data[TAX_DECLARATION_FO_MSG_KEY.ID_SUBMIT_POPUP],
        [TAX_DECLARATION_MSG_KEY.ID_TRADE_BLOCK_ORDER_TYPE]: data[TAX_DECLARATION_FO_MSG_KEY.ID_TRADE_BLOCK_ORDER_TYPE]
    }
    storeToSessionStorage(LOCAL_STORAGE.TAX_DECLARE_MSG_FO, JSON.stringify(taxDeclareMsgs_FO))

    storeToSessionStorage(LOCAL_STORAGE.WELCOME_GUEST, JSON.stringify(data.welcomeGuest))
    storeToSessionStorage(LOCAL_STORAGE.GUEST_FNO_BLOCK, JSON.stringify(data.guestSupportSgmnt))
    storeToSessionStorage(LOCAL_STORAGE.GUEST_PROFIT_MSG, JSON.stringify(data.guestHoldingProfit))
    storeToSessionStorage(LOCAL_STORAGE.GUEST_LOSS_MSG, JSON.stringify(data.guestHoldingLoss))
    storeToSessionStorage(LOCAL_STORAGE.NEWS_CATEGORY, JSON.stringify(data.newsCategry))
    storeToSessionStorage(LOCAL_STORAGE.GUEST_NEWS_CATEGORY, JSON.stringify(data.newsCategryGuest))
    storeToSessionStorage(LOCAL_STORAGE.GUEST_BANNER, JSON.stringify(data.guestUserBannerWeb))
    storeToSessionStorage(LOCAL_STORAGE.BECOME_A_PARTNER, JSON.stringify(data.becomeaPartner))
    storeToSessionStorage(LOCAL_STORAGE.MINIMUM_PAYOUT, JSON.stringify(data.minWithdrawAmt))
    storeToSessionStorage(LOCAL_STORAGE.APPLY_REDIRECT_LINK, JSON.stringify(data.loginUrlWeb))
    storeToSessionStorage(LOCAL_STORAGE.GTD_VALIDITY_EXPIRY, JSON.stringify(data.GtdValidityExpiry))

    // storeToSessionStorage(LOCAL_STORAGE.VESTED_DATA, JSON.stringify(data.vas))
    storeToSessionStorage(LOCAL_STORAGE.NCD_INFO, JSON.stringify(data.NCD))
    storeToSessionStorage(LOCAL_STORAGE.MTF_TIMER_DATA, JSON.stringify(data.mtf))
    storeToSessionStorage(LOCAL_STORAGE.MARKET_PROTECTION_LIMIT, JSON.stringify(data.MarketProtectionLimit))
}

export function getLoginType() {
    let state = store.getState();
    return state.login.loggedUserType
}

export function stopServices() {
    streamingManager.stop();
    clearClientData()
}

export function handleInvalidMsg(error) {
    if (error.infoID == INFO_IDS.INVALID_SESSION)
        handleInvalidSession(error.message)
    else if (error.infoID == INFO_IDS.INVALID_APP_ID)
        handleInvalidAppID(error.message)
    else
        throw new Error(error);
}

export function handleInvalidSession(message) {
    let loginStatus = getItemFromSessionStorage(LOCAL_STORAGE.LOGIN_STATUS);
    let isResetPassword = getItemFromSessionStorage(LOCAL_STORAGE.RESET_PASSWORD);
    let appID = getItemByKey(LOCAL_STORAGE.APP_ID);
    if (loginStatus || loginStatus == 'true' || isResetPassword === 'true' || !appID)
        Promise.all([
            store.dispatch(resetApp()),
            stopServices()
        ]).then(
            showAppDialogModal(message)
        )
}

function showAppDialogModal(message) {
    store.dispatch(showAppDialog({
        show: true,
        message: message
    }))
}

export function handleInvalidAppID(message) {
    Promise.all([
        store.dispatch(resetApp()),
        stopServices(),
        clearAppID()
    ]).then(
        reloadApp()
    )
    console.log(message)
}

export function reloadApp() {
    window.location.reload()
}

export function feedbackOnLogout() {
    console.log("feedbackOnLogout")
    localStorage.setItem("feedbackPopupPage","Ipo/Ncds")
    store.dispatch(storeRatingAndFeedback({
        showRating:true,
        isAfterLogin:true
    }))
}


export function fundRating() {
    console.log("feedbackOnLogout")
    localStorage.setItem("feedbackPopupPage","Ipo/Ncds")
    store.dispatch(fundRatingAndFeedback({
        showRating:true,
        isAfterLogin:true
    }))
}



export function handleLogout() {
    
    Promise.all([
        store.dispatch(resetApp()),
        stopServices(),
        clearMpinDetails(),
        console.log("Logout function"),
        // feedbackOnLogout()
        
    ])
}

export function setFeedbackRating(showRating) {
    console.log("show rating", showRating, LOCAL_STORAGE.FEEDBACK_RATING)

    storeItemByKey(LOCAL_STORAGE.FEEDBACK_RATING, showRating)

}

export function getAppID() {
    let state = store.getState();

    if (state.config.appID === null) {
        //During refresh - application ID will not be available from store.
        let appID = getItemByKey(LOCAL_STORAGE.APP_ID);

        if (appID) {
            store.dispatch(storeAppID(appID));
        }

        return appID;
    }

    return state.config.appID;
}

export function getUserName() {
    let state = store.getState();
    return state.login.clientDetails.custName;
}

export function getUserID() {
    return convertToUpperCase(getItemByKey(LOCAL_STORAGE.USER_ID));
}

export function getSession() {
    let state = store.getState();
    return state.login.clientDetails.session;
}

export function reSetChartSettings() {
    store.dispatch(storeReloadChartSettingsFlag(true));
}

export function gotoTrade(symDetails, orderAction, stopLossVal, message) {
    let msgVal = ""
    if(message){
        msgVal = message 
    }
    if (symDetails) {
        store.dispatch(storeSquareoffNetPosition(false))
        let state = store.getState();
        if (state.dashboard.selectedWidgetMode === DASHBOARD_WIDGET_MODE.MARKET_VIEW ||
            state.dashboard.selectedWidgetMode === DASHBOARD_WIDGET_MODE.SCANNERS_VIEW ||
            state.dashboard.selectedWidgetMode === DASHBOARD_WIDGET_MODE.NEWS_VIEW ||
            state.dashboard.selectedWidgetMode === DASHBOARD_WIDGET_MODE.IDEAS_VIEW||
            state.dashboard.selectedWidgetMode === DASHBOARD_WIDGET_MODE.MARKETSMITH_VIEW)
            store.dispatch(storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT))
        let symObj = formSymBlock(symDetails)
        store.dispatch(storeModifyOrderDetails({
            modifyType: null,
            symDetails: null
        }))
        store.dispatch(storeOrderpadSelectedSym(symObj))
        store.dispatch(storeOrderPadDialogDetails({
            dialogName: ORDERPAD_DIALOGS.ORDER_PAD,
            trade_type: convertToUpperCase(orderAction),
            enableStopLoss: stopLossVal,
            prod_type:symDetails.prdType ? symDetails.prdType : null,
            redirectionMsg: msgVal
        }))
    }
    store.dispatch(storeAlertSelectedSym(null))
    store.dispatch(storeSelectedScannerMenu(null))
    AF_EventTriggered(AF_EVENT_NAMES.WATCHLIST, orderAction, { "onClick": "Trade" })
}

export function gotoChartPopup(symDetails) {
    let symObj = formSymBlock(symDetails)
    store.dispatch(storeSelectedChartSym(symObj))
    // let state = store.getState()
    // let todayDate = new Date().toISOString();
    // let weekAgoDate = new Date(new Date() - 60 * 60 * 24 * 7 * 1000).toISOString()
    
    // console.log("date",todayDate,weekAgoDate)
    // let IndiantodayDate = new Date().toLocaleString("en-IN", {timeZone: 'Asia/Kolkata'})
    // let newDate = new Date(IndiantodayDate).toISOString();
    // console.log("newdate",newDate)
    // let IndianweekAgoDate = new Date(new Date().toLocaleString("en-IN", {timeZone: 'Asia/Kolkata'})) - 60 * 60 * 24 * 7 * 1000
    // console.log("date",IndiantodayDate,IndianweekAgoDate)
    
    // window.open(`https://uat-tradingview.bajajfinservsecurities.in/?appId=${state.config.appID}&endDate=${todayDate}&interval=1m&startDate=${weekAgoDate}&asset=${symDetails.sym.asset}&exc=${symDetails.sym.exc}&id=${symDetails.sym.id}&instrument=${symDetails.sym.instrument}&streamSym=1232_NSE&sessionID=${state.login.clientDetails.session}&stockName=${symDetails.dispSym}`); 
    
    // store.dispatch(storeChartDialogDetails({
    //     show: true
    // }))
    AF_EventTriggered(AF_EVENT_NAMES.WATCHLIST, AF_EVENT_TYPES.AF_CHART,{ "onClick": "chart" })
}

export function gotoMarketDepthPopup(symData) {
    store.dispatch(storeWatchlistDialogDetails({
        dialogName: WATCHLIST_DIALOGS.MARKET_DEPTH,
        symData: symData
    }))
}

export function gotoFutureOptionsPopup(symData) {
    store.dispatch(storeWatchlistDialogDetails({
        dialogName: WATCHLIST_DIALOGS.FUTURE_OPTIONS,
        symData: symData
    }))
}

export function gotoDeleteSymPopup(symData) {
    let state = store.getState();
    let selectedWatchgroup = Object.assign({}, state.watchlist.selectedWatchgroup)
    if (selectedWatchgroup.editable)
        store.dispatch(storeDeleteSymbol(symData))
}

export function gotoAddSymPopup(watchGroup) {
    if (!watchGroup) {
        let state = store.getState();
        let watchGroups = Object.assign([], state.watchlist.watchGroups)
        let editableGroups = watchGroups.filter(item => item.editable)
        if (editableGroups && editableGroups.length)
            watchGroup = editableGroups[(editableGroups.length - 1)]
    }
    if (watchGroup && watchGroup.wName && watchGroup.editable) {
        store.dispatch(storeNewWatchListName({ 'name': watchGroup.wName, 'new': false }))
        store.dispatch(storeSearchSymWatchlistFlag(true))
    }
}

export function gotoContractInfoPopup(symData) {
    store.dispatch(storeWatchlistDialogDetails({
        dialogName: WATCHLIST_DIALOGS.CONTRACT_INFO,
        symData: symData
    }))
}

export function gotoQuote(symData, fullView = true) {
    store.dispatch(storeOrderPadDialogDetails({
        dialogName: null,
        trade_type: null,
        message: '',
        parentCB: null,
    }))
    store.dispatch(storeSelectedQuoteSym(formSymBlock(symData)))
    store.dispatch(storeSelectedDashboardWidget(fullView ?
        DASHBOARD_WIDGET_MODE.QUOTE_VIEW : DASHBOARD_WIDGET_MODE.ORDER_WITH_QUOTE))
    store.dispatch(storeAlertSelectedSym(null))
    AF_EventTriggered(AF_EVENT_NAMES.WATCHLIST, AF_EVENT_TYPES.QUOTE,{"onLoad": "chart"})

}

export function gotoIndicesView(sym, mode) {
    store.dispatch(storeOrderPadDialogDetails({
        dialogName: null,
        trade_type: null,
    }))
    store.dispatch(storeIndicesDetails(formSymBlock(sym)))
    store.dispatch(storeSelectedDashboardWidget(mode))
    store.dispatch(storeAlertSelectedSym(null))
}

export function hideToaster() {
    store.dispatch(storeToastMsgProps({
        show: false,
        message: null
    }))
}

export function closeAllPopup() {
    store.dispatch(storeOrderDialogDetails({
        dialogName: null,
        symData: null,
        parentCB: null
    }))

    // store.dispatch(showAppDialog({ show: false }))
    store.dispatch(storeLoginDialogDetails({
        dialogName: null,
        message: '',
        parentCB: null,
        userId: null
    }))

    // let state = store.getState();
    // if (state.watchlist.dialog.dialogName !== WATCHLIST_DIALOGS.ADD_WATCHLIST)
    store.dispatch(storeWatchlistDialogDetails({
        dialogName: null,
        message: '',
        parentCB: null
    }))

    store.dispatch(storeQuoteDialogDetails({
        dialogName: null,
        message: '',
        parentCB: null
    }))
    store.dispatch(storeHoldingsNewsDialogDetails({
        dialogName: null,
        userId: null
    }))
    store.dispatch(storeContextMenuDetails({
        show: false,
        left: '',
        top: '',
        parentCB: null,
        ref: null
    }))
    store.dispatch(storeSearchSymWatchlistFlag(false))
}

export function setPostLoginLocalDataToRedux() {
    let selectedGroupId = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.SELECTED_WATCHGROUP))
    store.dispatch(storeSelectedWatchGroup(selectedGroupId))

    let excFilterlist = JSON.parse(getItemByKey(LOCAL_STORAGE.SAVED_FILTERS))
    console.log("excFilterlist", excFilterlist, selectedGroupId)
    let wGroupFilterList = []
    if (excFilterlist && excFilterlist[getUserID()] &&
        excFilterlist[getUserID()][selectedGroupId?.wId]
    )
        wGroupFilterList = excFilterlist[getUserID()][selectedGroupId?.wId]
    store.dispatch(storeWatchlistFilterParams(wGroupFilterList ? wGroupFilterList : []))

    let symSortlist = JSON.parse(getItemByKey(LOCAL_STORAGE.SAVED_FILTERS_SORTBY))
    let wGroupSortList = {}
    if (symSortlist && symSortlist[getUserID()] &&
        symSortlist[getUserID()][selectedGroupId?.wId])
        wGroupSortList = symSortlist[getUserID()][selectedGroupId?.wId]
    store.dispatch(storeWatchlistSortParams(wGroupSortList ? wGroupSortList : {}))
}

export function storeWatchlistFilterParamsToStore(filterArr) {
    console.log("excFilterlist 1", filterArr)

    store.dispatch(storeWatchlistFilterParams(filterArr))
    let excFilterlist = JSON.parse(getItemByKey(LOCAL_STORAGE.SAVED_FILTERS))
    console.log("excFilterlisttese", excFilterlist)
    let state = store.getState();
    const { watchlist } = state
    if (!excFilterlist) {
        excFilterlist = {
            [getUserID()]: {}
        }
    } else if (!excFilterlist[getUserID()]) {
        excFilterlist[getUserID()] = {}
    }
    excFilterlist[getUserID()][watchlist.selectedWatchgroup?.wId] = filterArr
    console.log("excFilterlist 2", excFilterlist, JSON.stringify(excFilterlist))
    storeItemByKey(LOCAL_STORAGE.SAVED_FILTERS, JSON.stringify(excFilterlist))
}

export function storeStreamingDatatoStore(wList, wName = "") {
    console.log("list",wName,wList)
    let state = store.getState();
    const { watchlist } = state
    if (!wName) {
        if (watchlist.selectedWatchgroup && watchlist.selectedWatchgroup.wName)
            wName = watchlist.selectedWatchgroup.wName
    }
    if (wName) {
        let wObj = Object.assign({}, watchlist.selectedWatchgroupResp)
        wObj[wName] = wList
        store.dispatch(storeSelectedWatchGroupResp(wObj))
    }
}

export function storeWatchlistSortParamsToStore(sortArr) {
    console.log("sort1", sortArr)

    store.dispatch(storeWatchlistSortParams(sortArr))
    let sortedlist = JSON.parse(getItemByKey(LOCAL_STORAGE.SAVED_FILTERS_SORTBY))
    let state = store.getState();
    const { watchlist } = state
    if (!sortedlist) {
        sortedlist = {
            [getUserID()]: {}
        }
    } else if (!sortedlist[getUserID()]) {
        sortedlist[getUserID()] = {}
    }
    sortedlist[getUserID()][watchlist.selectedWatchgroup?.wId] = sortArr
    console.log("sort2", sortedlist, JSON.stringify(sortedlist))
    storeItemByKey(LOCAL_STORAGE.SAVED_FILTERS_SORTBY, JSON.stringify(sortedlist))
}

export function setExcFilterbyWGroup(wId, reset = false) {
    let filterArr = []
    let sortArr = {}
    let userId = getUserID()
    if (!wId) {
        let state = store.getState();
        const { watchlist } = state
        wId = watchlist.selectedWatchgroup?.wId
    }
    let excFilterlist = JSON.parse(getItemByKey(LOCAL_STORAGE.SAVED_FILTERS))
    console.log("testt", excFilterlist)
    if (excFilterlist && excFilterlist[userId]) {
        if (excFilterlist[userId][wId])
            filterArr = excFilterlist[userId][wId]
    }

    let sortedList = JSON.parse(getItemByKey(LOCAL_STORAGE.SAVED_FILTERS_SORTBY))
    console.log("testt2", sortedList)
    if (sortedList && sortedList[userId]) {
        if (sortedList[userId][wId])
            sortArr = sortedList[userId][wId]
    }

    if (!reset) {
        store.dispatch(storeWatchlistFilterParams(filterArr ?? {}))
        store.dispatch(storeWatchlistSortParams(sortArr ?? {}))
    } else {
        console.log("rest")
        store.dispatch(storeWatchlistFilterParams([]))
        store.dispatch(storeWatchlistSortParams({}))
        if (excFilterlist) {
            // excFilterlist.splice(wId, 1)
            delete excFilterlist[userId][wId]
            storeItemByKey(LOCAL_STORAGE.SAVED_FILTERS, JSON.stringify(excFilterlist))
            console.log("excFilterlisttest", excFilterlist)
        }
        if (sortedList) {
            // excFilterlist.splice(wId, 1)
            delete sortedList[userId][wId]
            storeItemByKey(LOCAL_STORAGE.SAVED_FILTERS_SORTBY, JSON.stringify(sortedList))
            console.log("sortttest", sortedList)
        }
    }
}

export function closeOrderPad() {
    store.dispatch(storeModifyOrderDetails({
        modifyType: null,
        symDetails: {}
    }))
    store.dispatch(storeOrderFieldValues({}))
    store.dispatch(storeOrderPadDialogDetails({
        dialogName: null,
        trade_type: null,
        message: '',
        parentCB: null,
    }))
    store.dispatch(storeOrderpadSelectedSym(null))
}

export function saveQuoteScreenDetails(symData, backScreen = null) {
    let state = store.getState();
    if (!backScreen || (backScreen === SCREENS.QUOTE))
        backScreen = state.quote.goBackScreen
    let symObj = formSymBlock(symData)
    closeContextMenu()
    store.dispatch(storeSelectedQuoteSym(symObj))
    store.dispatch(storeBackScreenFromQuote(backScreen))
}

export function getEditableWatchgroups(groups = null) {
    if (!groups) {
        let state = store.getState();
        groups = state.watchlist.watchGroups
    }
    if (groups.length)
        return groups.filter(item => item.editable)
    return []
}

export function isEditableWatchGroupExist() {
    let state = store.getState();
    let groups = state.watchlist.watchGroups

    let editableGroupExist = groups.findIndex((item) => {
        return item.editable === true
    })

    if (editableGroupExist != -1)
        return true

    return false
}

export function closeContextMenu() {
    store.dispatch(storeContextMenuDetails({
        show: false,
        left: '',
        top: '',
        parentCB: null,
        ref: null
    }))
}

export function stockReport() {
    store.dispatch(showAppDialog({
        show: true,
        message: "Coming soon..."
    }))
}

export function storeHoldingsResponseToStore(data) {
    store.dispatch(storeHoldingsResponse(data))
}

export function storeAllHoldingsResponseToStore(data) {
    console.log("data of marketvalue", data)
    store.dispatch(storeAllHoldingsResp(data))
}

export function gotoOrderDialog(symData, dialogName, parentCB = null) {
    store.dispatch(storeOrderDialogDetails({
        dialogName: dialogName,
        symData: symData,
        parentCB: parentCB
    }))
}

export function getQuoteMenuArray(exc) {
    let configMenu = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.QUOTE_MENUS))
    let filteredMenuList = [];
    if (configMenu[exc]) {
        configMenu[exc].map(item => {
            CHART_WIDGET_MENU_CONST.map((item2) => {
                if (item2.name === item) {
                    filteredMenuList = [...filteredMenuList, item2]
                }
            })
        })

        return filteredMenuList
    }
    return CHART_WIDGET_MENU_CONST
}

export function getQuoteMenuGuestArray(exc) {
    let filteredMenuList = [];
    let configMenu = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.QUOTE_MENUS))
    if (configMenu[exc]) {
        configMenu[exc].map(item => {
            CHART_WIDGET_MENU_CONST_GUEST.map((item2) => {
                if (item2.name === item) {
                    filteredMenuList = [...filteredMenuList, item2]
                }
            })
        })
        return filteredMenuList
    }
    return CHART_WIDGET_MENU_CONST_GUEST
}

export function regetWatchGroupSymbolsCB(groupName) {
    store.dispatch(storeRegetWatchGroupSymbolData({
        reget: true,
        watchGroup: groupName
    }))
}

export function gotoAlert(symDetails, createSearch, fullView = true) {
    if (symDetails) {
        if (createSearch) {
            let symObj = formSymBlock(symDetails)
            store.dispatch(storeAlertSearchModify(symObj))
        }
        else {
            store.dispatch(storeSelectedDashboardWidget(fullView ?
                DASHBOARD_WIDGET_MODE.QUOTE_VIEW : DASHBOARD_WIDGET_MODE.DEFAULT))
            let symObj = formSymBlock(symDetails)
            store.dispatch(storeAlertSelectedSym(symObj))
        }
    }
}

// export function gotoNotify(flag) {
//     console.log(flag)
//     // store.dispatch(storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.NOTIFY_VIEW))
//     store.dispatch(storeNotifyFlag(flag))
// }

export function getTaxProfileFromAPIData() {
    let state = store.getState();
    let data = state.profileDialog ? state.profileDialog.profileDetails : {}
    // if (data) {
    //     data.popupFlgCash = "0" 
    //     data.popupFlgFO = '0'
    //     data.isTradeBlock = false
    //     data.isTradeBlockFO = false
    //     data.isTradeWarning = false
    //     data.isTradeWarningFO = false
    //     data.isTradeBlockProgress = false
    //     data.isFno = "1"
    // }
    return data
}

export function callTaxDeclaration(profileDetails = null, comp = "", elseCB = null) {
    if (!profileDetails)
        profileDetails = getTaxProfileFromAPIData()
    let tax_msgs = getDeclarationMessages()
    let state = store.getState();
    let orderPadRedux = state.orderPad
    console.log("orderPadRedux", orderPadRedux)
    if (profileDetails) {
        if (comp === TAX_DECLARE_BLOCK_SCREENS.ORDERPAD) {
            if (profileDetails.popupFlgCash === TAX_DECLARATION_STAGES.STAGE_1
                || profileDetails.popupFlgFO === TAX_DECLARATION_STAGES.STAGE_1) {
                if (
                    (
                        getBool(profileDetails.isTradeBlock)
                        &&
                        isEquityCashSymbol(orderPadRedux.selectedSym ? orderPadRedux.selectedSym.exc : "")
                    )
                    ||
                    (
                        getBool(profileDetails.isTradeBlockFO)
                        &&
                        isEquityFutureSymbol(orderPadRedux.selectedSym ? orderPadRedux.selectedSym.exc : "")
                    )
                ) {
                    if (!orderPadRedux.isSquareOff) {
                        store.dispatch(storeTaxDeclarationDetails({
                            dialogName: TAX_DECLARATION_DIALOGS.ORDERPAD_ALERT,
                            closeCB: onClickUpdateLater,
                            infoMsg: tax_msgs[TAX_DECLARATION_MSG_KEY.TRADE_BLOCK],
                            hideOrderpadFooter: true
                        }))
                    }
                }
                else if (
                    getBool(profileDetails.isTradeBlockProgress)
                    &&
                    isEquityFutureSymbol(orderPadRedux.selectedSym ? orderPadRedux.selectedSym.exc : "")
                ) {
                    store.dispatch(storeTaxDeclarationDetails({
                        dialogName: TAX_DECLARATION_DIALOGS.ORDERPAD_ALERT,
                        closeCB: onClickUpdateLater,
                        infoMsg: tax_msgs[TAX_DECLARATION_MSG_KEY.TRADE_BLOCK_INPROGRESS],
                        hideOrderpadFooter: true
                    }))
                } else {
                    closeTaxDeclarationDialog()
                }
            } else if (
                getBool(profileDetails.isTradeBlockProgress)
                &&
                isEquityFutureSymbol(orderPadRedux.selectedSym ? orderPadRedux.selectedSym.exc : "")
            ) {
                store.dispatch(storeTaxDeclarationDetails({
                    dialogName: TAX_DECLARATION_DIALOGS.ORDERPAD_ALERT,
                    closeCB: null,
                    noActions: true,
                    infoMsg: tax_msgs[TAX_DECLARATION_MSG_KEY.TRADE_BLOCK_INPROGRESS],
                    hideOrderpadFooter: true
                }))
            } else {
                closeTaxDeclarationDialog()
            }
        } else if (comp === TAX_DECLARE_BLOCK_SCREENS.ORDER_RESULT) {
            if (profileDetails.popupFlgCash === TAX_DECLARATION_STAGES.STAGE_1
                || profileDetails.popupFlgFO === TAX_DECLARATION_STAGES.STAGE_1) {
                if (
                    (
                        getBool(profileDetails.isTradeWarning)
                        &&
                        isEquityCashSymbol(orderPadRedux.selectedSym ? orderPadRedux.selectedSym.exc : "")
                    )
                    ||
                    (
                        getBool(profileDetails.isTradeWarningFO)
                        &&
                        isEquityFutureSymbol(orderPadRedux.selectedSym ? orderPadRedux.selectedSym.exc : "")
                    )
                ) {
                    let lastTradeWarning = getItemByKey(LOCAL_STORAGE.LAST_TRADE_WARNING);
                    let currentDate = new Date().toLocaleDateString()
                    if (lastTradeWarning && lastTradeWarning === currentDate) {
                        elseCB && elseCB()
                    }
                    else {
                        storeItemByKey(LOCAL_STORAGE.LAST_TRADE_WARNING, currentDate);
                        store.dispatch(storeTaxDeclarationDetails({
                            dialogName: TAX_DECLARATION_DIALOGS.ORDERPAD_RESULT_ALERT,
                            closeCB: onClickUpdateLater,
                            infoMsg: tax_msgs[TAX_DECLARATION_MSG_KEY.TRADE_WARNING]
                        }))
                    }
                } else {
                    elseCB && elseCB()
                }
            } else {
                elseCB && elseCB()
            }
        } else if (comp === TAX_DECLARE_BLOCK_SCREENS.DASHBOARD) {
            if (profileDetails.popupFlgCash === TAX_DECLARATION_STAGES.STAGE_1
                || profileDetails.popupFlgFO === TAX_DECLARATION_STAGES.STAGE_1) {
                store.dispatch(storeTaxDeclarationDetails({
                    dialogName: TAX_DECLARATION_DIALOGS.ATTENTION,
                    closeCB: null
                }))
            } else if (profileDetails.popupFlgCash === TAX_DECLARATION_STAGES.STAGE_2
                || profileDetails.popupFlgFO === TAX_DECLARATION_STAGES.STAGE_2) {
                store.dispatch(storeTaxDeclarationDetails({
                    dialogName: TAX_DECLARATION_DIALOGS.INPROGRESS_ALERT,
                    closeCB: null,
                    infoMsg: tax_msgs[TAX_DECLARATION_MSG_KEY.IN_PROGRESS_MSG]
                }))
            }
        } else if (comp === TAX_DECLARE_BLOCK_SCREENS.IDEAS) {
            if (profileDetails.isTradeBlock) {
                store.dispatch(storeTaxDeclarationDetails({
                    dialogName: TAX_DECLARATION_DIALOGS.IDEAS_ALERT,
                    closeCB: onClickUpdateLater,
                    infoMsg: tax_msgs[TAX_DECLARATION_MSG_KEY.TRADE_BLOCK]
                }))
            } else {
                elseCB && elseCB()
            }
        }
    }
    else {
        elseCB && elseCB()
    }
}

export function getLasEmiCalcValues(loanAmt) {
    let lasData = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.LAS_HELP))
    lasData = lasData ? lasData : {}
    let roi = lasData.roi ? parseFloat(replaceComma(lasData.roi)) : 0
    let tenor = lasData.tenor ? parseFloat(replaceComma(lasData.tenor)) : 0
    let state = store.getState();
    let responseData = state.las.responseData
    let storedLoanAmt = 0
    if (responseData)
        storedLoanAmt = responseData.optAmt

    // if (storedLoanAmt > lasData.maxAmt)
    //     storedLoanAmt = lasData.maxAmt
    if (!loanAmt)
        loanAmt = storedLoanAmt

    loanAmt = loanAmt ? replaceComma(loanAmt) : 0
    // let x = Math.pow((1 + roi), tenor)
    // let y = x - 1
    let z = roi / 100
    // let EMI = Math.round(loanAmt * roi * z)
    let totalAmount = loanAmt * z
    let EMI = totalAmount / tenor
    return { EMI, totalAmount, tenor, roi, loanAmt, lasData }
}

function onClickUpdateLater(comp) {
    let profileDetails = getTaxProfileFromAPIData()
    if (comp === TAX_DECLARE_BLOCK_SCREENS.ORDERPAD) {
        if (profileDetails.popupFlgCash === TAX_DECLARATION_STAGES.STAGE_1
            || profileDetails.popupFlgFO === TAX_DECLARATION_STAGES.STAGE_1) {
            if (profileDetails.isTradeBlock || profileDetails.isTradeBlockFO || profileDetails.isTradeBlockProgress) {
                store.dispatch(storeModifyOrderDetails({
                    modifyType: null,
                    symDetails: {}
                }))
                store.dispatch(storeOrderFieldValues({}))
                store.dispatch(storeOrderPadDialogDetails({
                    dialogName: null,
                    trade_type: null,
                    message: '',
                    parentCB: null,
                }))
                store.dispatch(storeOrderpadSelectedSym(null))
            }
        }
    } else if (comp === TAX_DECLARE_BLOCK_SCREENS.ORDER_RESULT) {
        if (profileDetails.popupFlgCash === TAX_DECLARATION_STAGES.STAGE_1
            || profileDetails.popupFlgFO === TAX_DECLARATION_STAGES.STAGE_1) {
            if (profileDetails.isTradeWarning) {
                store.dispatch(moveToOrderMenu({
                    showOrderMenu: true
                }))
            }
        }
    }
    store.dispatch(storeTaxDeclarationDetails({
        dialogName: null,
        closeCB: null,
        infoMsg: null
    }))
}

export function getTaxDecalreDetails(profileDetails = null) {
    if (!profileDetails)
        profileDetails = getTaxProfileFromAPIData()
    let tax_msgs = getDeclarationMessages()
    return {
        incomeList: profileDetails ? (profileDetails.incomeList ? profileDetails.incomeList : []) : [],
        // incomeList: [
        //     "Below 1 Lakh",
        //     "1 - 5 Lakh",
        //     "5 - 10 Lakh",
        //     "10 - 25 Lakh",
        //     "More than 25 Lakh"
        // ],
        proofOptions: profileDetails ? (profileDetails.fileList ? profileDetails.fileList : []) : [],
        // proofOptions: [
        //     {
        //         "suboption": ["Use my BFSL Holdings", "Upload Holding Statement"],
        //         "option": "Statement of Demat holdings"
        //     },
        //     { "option": "Bank account statement for the last 6 months" },
        //     { "option": "The latest salary slip" },
        //     { "option": "Copy of ITR acknowledgement" },
        //     { "option": "Copy of Form 16 in case of salary income" },
        //     { "option": "Net worth Certificate" }
        // ],
        showUpdateIncome: profileDetails ? ((profileDetails.popupFlgCash === TAX_DECLARATION_STAGES.STAGE_1
            || profileDetails.popupFlgFO === TAX_DECLARATION_STAGES.STAGE_1)) : false,
        popupFlg: profileDetails ? (profileDetails.popupFlgCash === TAX_DECLARATION_STAGES.STAGE_1
            || profileDetails.popupFlgFO === TAX_DECLARATION_STAGES.STAGE_1) : null,
        // hideTradeFooter: getHideTradeFooterFlag(profileDetails),
        declarationMsgs: tax_msgs,
        isFno: profileDetails ? (profileDetails.isFno == "1") : false
    }
}

// function getHideTradeFooterFlag(profileDetails) {
//     let hideTrade = false
//     let state = store.getState();
//     let orderPadRedux = state.orderPad
//     if (profileDetails) {
//         if (profileDetails.popupFlg === TAX_DECLARATION_STAGES.STAGE_1 && getBool(profileDetails.isTradeBlock)) {
//             if (!orderPadRedux.isSquareOff) {
//                 hideTrade = true
//             }
//         }
//         else if (
//             profileDetails.popupFlg === TAX_DECLARATION_STAGES.STAGE_0
//             &&
//             getBool(profileDetails.isTradeBlock)
//         ) {
//             if (!orderPadRedux.isSquareOff) {
//                 hideTrade = true
//             }
//         }
//     }
//     return hideTrade
// }

export function getDeclarationMessages() {
    let profileDetails = getTaxProfileFromAPIData()
    let tax_msgs = {}
    if (profileDetails && profileDetails.isFno == "1")
        tax_msgs = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.TAX_DECLARE_MSG_FO))
    else
        tax_msgs = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.TAX_DECLARE_MSG))
    if (!tax_msgs)
        tax_msgs = {}
    return tax_msgs
}

export function openTaxDeclarationDialog() {
    store.dispatch(storeTaxDeclarationDetails({
        dialogName: TAX_DECLARATION_DIALOGS.ATTENTION
    }))
    AF_EventTriggered(AF_EVENT_NAMES.PROFILE, TAX_DECLARATION_DIALOGS.ATTENTION)
}

export function closeTaxDeclarationDialog() {
    store.dispatch(storeTaxDeclarationDetails({
        dialogName: null,
        closeCB: null,
        apiResponse: null
    }))
}

const getBool = function (v) {
    return v && (v === "true" || v === true);
}

export function initDemoTour() {

    setTimeout(() => {
        let state = store.getState();
        let demoTourData = state.demoTour
        if (!demoTourData.demoTourFlag) {

            let checkDemoFirst = getItemByKey(LOCAL_STORAGE.DEMO_FIRST)
            if (checkDemoFirst) {
                if (demoTourData.demoFirstLogin) {
                    store.dispatch(refreshDemoTour(true))
                    store.dispatch(setDemoTourFlag(true))
                }
            }

        }
    }, 1000)

}

export function initDirectDemoTour() {

    setTimeout(() => {
        // let state = store.getState();
        // let demoTourData = state.demoTour
        store.dispatch(refreshDemoTour(true))
        // store.dispatch(setDemoTourFlag(true))
        // }
    }, 0)

}

export function reInitDemoTour() {
    setTimeout(() => {
        store.dispatch(refreshDemoTour(true))
    }, 0)
}
export const getUrlParamAsObjects = (arr) => {
    let newObj = {};
    arr.forEach((item) => {
        let values = item.split("=");
        if (values.length > 1) {
            newObj[values[0]] = values[1];
        }
    });
    return newObj;
};

export function getInstrumentTypeName(item) {
    let instrumentTypeValue = ""
    if ((item.sym.instrument === SYMBOL_INSTRUMENT_TYPE.EQUITYSTK) ||
        (item.sym.instrument === SYMBOL_INSTRUMENT_TYPE.EQUITYIDX)) {
        instrumentTypeValue = getLangText('CASH')
    }
    else if ((item.sym.instrument === SYMBOL_INSTRUMENT_TYPE.FUTURESTK) ||
        (item.sym.instrument === SYMBOL_INSTRUMENT_TYPE.FUTUREIDX)) {
        instrumentTypeValue = getLangText('FUTURE')
    }
    else if ((item.sym.instrument === SYMBOL_INSTRUMENT_TYPE.OPTIONSTK) ||
        (item.sym.instrument === SYMBOL_INSTRUMENT_TYPE.OPTIONIDX)) {
        instrumentTypeValue = getLangText('OPTION')
    }
    return instrumentTypeValue
}

