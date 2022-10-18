import { STORE_ADD_FUNDS_DIALOG_DETAILS, STORE_REGET_RECENTWITHDRAWAL_DATA,
    STORE_FUND_TRANS__REQ_DETAILS, STORE_MAX_PAY_REQ_DETAILS } from '../actions/Actions'

const initialState = {
    addFundsDialog: {
        show: false,
        URL_data: null
    },
    fundTransStatus: {
        getFundTransStatusReq: false
    },
    maxPayOut: {
        getMaxPayOutReq: false
    },
    regetRecentWithdrawals: false,
}

const fundTransfer = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_REGET_RECENTWITHDRAWAL_DATA:
            return Object.assign({}, state, { regetRecentWithdrawals: action.payload });
        case STORE_ADD_FUNDS_DIALOG_DETAILS:
            return Object.assign({}, state, { addFundsDialog: action.payload });
        case STORE_FUND_TRANS__REQ_DETAILS:
            return Object.assign({}, state, { fundTransStatus: action.payload });
        case STORE_MAX_PAY_REQ_DETAILS:
            return Object.assign({}, state, { maxPayOut: action.payload });
        default:
            return state;
    }
};
export default fundTransfer;