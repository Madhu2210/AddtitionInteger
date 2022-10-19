import { STORE_OFS_DIALOG_DETAILS, STORE_OFS_ORDERBOOK_NAVIGATION,
    STORE_OFS_ORDERBOOK_UPDATE } from "../actions/Actions";

const initialState = {
    dialogDetails: {
        name: null,
        orderResult: {}
    },
    gotoOrderBook: false,
    orderBookUpdate: false
}

const ofsDetails = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_OFS_DIALOG_DETAILS:
            return Object.assign({}, state, { dialogDetails: action.payload });
        case STORE_OFS_ORDERBOOK_NAVIGATION:
            return Object.assign({}, state, { gotoOrderBook: action.payload });
        case  STORE_OFS_ORDERBOOK_UPDATE:
            return Object.assign({}, state, { orderBookUpdate: action.payload });
        default:
            return state;
    }
};

export default ofsDetails;