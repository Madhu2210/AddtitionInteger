import { STORE_IPO_DIALOG_DETAILS, STORE_IPO_ORDERBOOK_NAVIGATION } from "../actions/Actions";

const initialState = {
    dialogDetails: {
        name: null,
        orderResult: {}
    },
    gotoOrderBook: false
}

const ipoDetails = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_IPO_DIALOG_DETAILS:
            return Object.assign({}, state, { dialogDetails: action.payload });
        case STORE_IPO_ORDERBOOK_NAVIGATION:
            return Object.assign({}, state, { gotoOrderBook: action.payload });
        default:
            return state;
    }
};

export default ipoDetails;