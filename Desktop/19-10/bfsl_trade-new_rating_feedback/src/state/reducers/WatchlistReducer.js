import {
    STORE_WATCHLIST_DIALOG_DETAILS, STORE_SELECTED_WATCHLIST_SYM,
    STORE_WATCHGROUPS, STORE_SEARCHSYM_WATCHLIST_FLAG, STORE_SELECTED_WATCHLIST_COLUMNS,
    STORE_CONTEXT_MENU_DETAILS, STORE_SELECTED_WATCHGROUP, STORE_WATCHLIST_SCREEN_ACTIVE_FLAG,
    STORE_SELECTED_WATCHLIST_WIDGET, STORE_REGET_WATCHGROUP_SYMBOL_DATA, STORE_WIDGET_LOADER_ERROR_MSG,
    STORE_NEW_WATCHLIST_NAME, STORE_REGET_WATCHGROUPS, STORE_DELETE_SYMS, STORE_SELECTED_WATCHGROUP_RESP,
    STORE_WATCHLIST_SORT_PARAMS, STORE_WATCHLIST_FILTER_PARAMS
} from "../actions/Actions";

import { WATCHLIST_COLUMNLIST, LOCAL_STORAGE } from "../../common/Constants";
import { storeItemByKey, storeToSessionStorage } from "../../common/LocalStorage";

const initialState = {
    isWatchlistScreenActive: false,
    selectedSym: null,
    selectedWatchgroup: null,
    selectedWatchgroupResp: {},
    watchGroups: [],
    symbolSearch: false,
    tableColumns: WATCHLIST_COLUMNLIST,
    selectedWidget: null,
    regetWatchGroups: null,
    regetWatchGroupSymbols: null,
    loaderErrorMsg: null,
    newWatchListName: null,
    selectedSymToDelete: null,
    contextMenuDetails: {
        show: false,
        top: '',
        left: '',
        symData: null,
        ref: null,
        parentCB: null
    },
    dialog: {
        dialogName: null,
        message: '',
        parentCB: null
    },
    sortParams: {},
    filterParams: []
}

const watchlist = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_WATCHLIST_DIALOG_DETAILS:
            return Object.assign({}, state, { dialog: action.payload });
        case STORE_SELECTED_WATCHLIST_SYM:
            return Object.assign({}, state, { selectedSym: action.payload });
        case STORE_WATCHGROUPS:
            return Object.assign({}, state, { watchGroups: action.payload });
        case STORE_SEARCHSYM_WATCHLIST_FLAG:
            return Object.assign({}, state, { symbolSearch: action.payload });
        case STORE_SELECTED_WATCHLIST_COLUMNS: {
            let upadtedState = Object.assign({}, state, { tableColumns: action.payload })
            storeItemByKey(LOCAL_STORAGE.ORGANIZE_COLUMNS, JSON.stringify(upadtedState.tableColumns))
            return upadtedState;
        }
        case STORE_CONTEXT_MENU_DETAILS:
            return Object.assign({}, state, { contextMenuDetails: action.payload });
        case STORE_SELECTED_WATCHGROUP: {
            storeToSessionStorage(LOCAL_STORAGE.SELECTED_WATCHGROUP, JSON.stringify(action.payload))
            return Object.assign({}, state, { selectedWatchgroup: action.payload })
        }
        case STORE_WATCHLIST_SCREEN_ACTIVE_FLAG:
            return Object.assign({}, state, { isWatchlistScreenActive: action.payload });
        case STORE_SELECTED_WATCHLIST_WIDGET:
            return Object.assign({}, state, { selectedWidget: action.payload });
        case STORE_REGET_WATCHGROUP_SYMBOL_DATA:
            return Object.assign({}, state, { regetWatchGroupSymbols: action.payload });
        case STORE_WIDGET_LOADER_ERROR_MSG:
            return Object.assign({}, state, { loaderErrorMsg: action.payload });
        case STORE_NEW_WATCHLIST_NAME:
            return Object.assign({}, state, { newWatchListName: action.payload });
        case STORE_REGET_WATCHGROUPS:
            return Object.assign({}, state, { regetWatchGroups: action.payload });
        case STORE_DELETE_SYMS:
            return Object.assign({}, state, { selectedSymToDelete: action.payload });
        case STORE_SELECTED_WATCHGROUP_RESP:
            return Object.assign({}, state, { selectedWatchgroupResp: action.payload });
        case STORE_WATCHLIST_SORT_PARAMS:
            return Object.assign({}, state, { sortParams: action.payload });
        case STORE_WATCHLIST_FILTER_PARAMS:
            return Object.assign({}, state, { filterParams: action.payload });
        default:
            return state
    }
}

export default watchlist;