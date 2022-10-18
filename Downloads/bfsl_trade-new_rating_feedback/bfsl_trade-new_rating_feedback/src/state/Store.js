import { createStore, combineReducers, compose } from "redux";
import appDialog from './reducers/AppDialogReducer'
import chart from './reducers/ChartReducer'
import config from './reducers/ConfigReducer'
import login from './reducers/LoginReducer'
import orderPad from './reducers/OrderPadReducer'
import order from './reducers/OrderReducer'
import settings from './reducers/SettingsReducer'
import watchlist from './reducers/WatchlistReducer'
import symbolSearch from './reducers/SymbolSearchReducer'
import quote from './reducers/QuoteReducer'
import marketMovers from './reducers/MarketMoverReducer'
import localStorageRed from './reducers/LocalStorageReducer'
import dashboard from './reducers/DashboardReducer'
import holdings from './reducers/HoldingsReducer'
import fundTransfer from './reducers/FundTransferReducer'
import successDialog from './reducers/SuccessDialogReducer'
import session from './reducers/SessionReducer'
import toastMsg from './reducers/ToasMsgReducer'
import netPosition from './reducers/NetPositionReducer'
import profileDialog from './reducers/ProfileDialogReducer'
import indicesDetails from './reducers/IndicesReducer'
import ipoDetails from './reducers/IPOReducer'
import menu from './reducers/MenuReducer'
import bo from './reducers/BOReportReducer'
import alerts from './reducers/AlertReducer'
import scanner from "./reducers/ScannerReducer"
import las from "./reducers/LASDialogReducer"
import availLoanDetails from "./reducers/AvailLoanReducer"
import demoTour from "./reducers/DemoTourReducer"
import ofsDetails from './reducers/OFSReducer'
import news from './reducers/NewsReducer'
import ncdDetails from './reducers/NCDReducer'
import marketsmithdetails from './reducers/MarketSmithReducer'
import helpAndSupport from './reducers/HelpAndSupportReducer'
import mtfDetails from './reducers/mtfReducer'

import { RESET_APP } from './actions/Actions'
import { storeItemByKey, getItemByKey, getItemFromSessionStorage } from "../common/LocalStorage";
import { LOCAL_STORAGE } from "../common/Constants";
import { AppSettings } from "../common/AppSettings";

export const loadState = (key) => {
    try {
        const serializedState = getItemByKey(key)
        if (serializedState === null)
            // eslint-disable-next-line no-undefined
            return undefined

        return JSON.parse(serializedState)
    } catch (err) {
        // eslint-disable-next-line no-undefined
        return undefined
    }
}

export const saveState = (key, value) => {
    try {
        const serializedState = JSON.stringify(value)
        storeItemByKey(key, serializedState)
    } catch (err) {
        return null
    }
    return " "
}

const appReducers = combineReducers(
    {
        appDialog,
        profileDialog,
        chart,
        config,
        login,
        orderPad,
        order,
        settings,
        watchlist,
        symbolSearch,
        quote,
        marketMovers,
        localStorageRed,
        dashboard,
        holdings,
        fundTransfer,
        successDialog,
        session,
        toastMsg,
        netPosition,
        indicesDetails,
        ipoDetails,
        menu,
        bo,
        alerts,
        scanner,
        las,
        availLoanDetails,
        demoTour,
        ofsDetails,
        news,
        ncdDetails,
        marketsmithdetails,
        helpAndSupport,
        mtfDetails
    }
);

const devTools = AppSettings.nodeEnv !== 'production' 
    && typeof window === 'object'
    && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f;

const rootReducer = (state, action) => {
    if (action.type === RESET_APP) {
        // eslint-disable-next-line no-undefined
        state = undefined
        state = {}
        state.session = {}
        state.session.inValidSession = true
    }

    if (loadState(LOCAL_STORAGE.SETTINGS)) {
        if (!state)
            state = {}
        state.settings = loadState(LOCAL_STORAGE.SETTINGS)
    }
    if (loadState(LOCAL_STORAGE.SELECTED_INDICES) || loadState(LOCAL_STORAGE.RECENT_SEARCH_SYMBOLS)) {
        if (!state)
            state = {}
        state.localStorageRed = {
            selectedIndicesList: loadState(LOCAL_STORAGE.SELECTED_INDICES),
            recendSyms: loadState(LOCAL_STORAGE.RECENT_SEARCH_SYMBOLS),
            langDictionary: JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.LANGUAGE_SETTING_OPTIONS))
        }
    }

    return appReducers(state, action);
}

const store = createStore(rootReducer, {}, compose(devTools));

export default store;