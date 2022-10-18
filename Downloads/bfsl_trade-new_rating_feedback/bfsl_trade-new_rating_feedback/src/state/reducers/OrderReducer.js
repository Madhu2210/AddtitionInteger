
import {
    STORE_ORDER_MENU, STORE_ORDERSTATUS_FILTERVALUE, STORE_ORDER_DIALOG_DETAILS,
    STORE_REGET_ORDERBOOK_DATA, STORE_REGET_ORDER_STATUS, STORE_POSITIONS_DIALOG_SYM_STREAMING_DETAILS
} from "../actions/Actions"

import { ORDERS_SEGMENT_LIST, ORDERS_STATUS_LIST } from '../../common/Constants';

const initialState = {
    dialog: {
        dialogName: null,
        symData: null,
        parentCB: null,
        resultData: null
    },
    dialogSymStreamingData: null,
    orderMenu: {
        showOrderMenu: false,
        filterOption: null
    },
    orderStatusfilterVal: {
        status: ORDERS_STATUS_LIST[0],
        segment: ORDERS_SEGMENT_LIST[0]
    },
    regetOrderBook: false,
    regetOrderStatus: false,
}

const order = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_ORDER_DIALOG_DETAILS:
            return Object.assign({}, state, { dialog: action.payload });
        case STORE_ORDER_MENU:
            return Object.assign({}, state, { orderMenu: action.payload });
        case STORE_ORDERSTATUS_FILTERVALUE:
            return Object.assign({}, state, { orderStatusfilterVal: action.payload });
        case STORE_REGET_ORDERBOOK_DATA:
            return Object.assign({}, state, { regetOrderBook: action.payload });
        case STORE_REGET_ORDER_STATUS:
            return Object.assign({}, state, { regetOrderStatus: action.payload });
        case STORE_POSITIONS_DIALOG_SYM_STREAMING_DETAILS:
            return Object.assign({}, state, { dialogSymStreamingData: action.payload });
        default:
            return state
    }
}

export default order;