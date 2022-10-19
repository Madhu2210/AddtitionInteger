import { STORE_NCD_DIALOG_DETAILS,
    STORE_NCD_ORDERBOOK_NAVIGATION, STORE_NCD_ORDERBOOK_UPDATE } from "../actions/Actions";

const initialState = {
    dialogDetails: {
        name: null,
        orderResult: {}
    },
    gotoOrderBook: false,
    orderBookUpdate: false

}

const ncdDetails = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_NCD_DIALOG_DETAILS:
            return Object.assign({}, state, { dialogDetails: action.payload });
        case STORE_NCD_ORDERBOOK_NAVIGATION:
            return Object.assign({}, state, { gotoOrderBook: action.payload });
        case  STORE_NCD_ORDERBOOK_UPDATE:
            return Object.assign({}, state, { orderBookUpdate: action.payload });
        default:
            return state;
    }
};

export default ncdDetails;