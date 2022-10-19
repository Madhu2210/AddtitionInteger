import { STORE_HOLDINGS_NEWS_DIALOG_DETAILS, STORE_HOLDINGS_RESP, STORE_HOLDINGS_SORT_LIST,
    STORE_HOLDINGS_GUEST_ALERT ,STORE_SQUARE_OFF_HOLDINGS, 
    STORE_ALL_HOLDINGS_RESP, STORE_GO_TO_HOLDINGS_FLAG, STORE_NAVIGATE_FROM_HOLDINGS_FLAG, 
    STORE_LANDING_FROM_EDIS_FLAG } from "../actions/Actions"

const initialState = {
    holdingsResp: {},
    dialog: {
        dialogName: "",
        newsId: null
    },
    holdingsSortData:null,
    holdingGuestMsg: false,    
    isSquareOffHolding: false,
    allHoldingsResp: {},
    navigateFromHoldings: false,
    landingFromEdisFlag: false
}

const holdings = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_HOLDINGS_NEWS_DIALOG_DETAILS:
            return Object.assign({}, state, { dialog: action.payload });
        case STORE_HOLDINGS_RESP:
            return Object.assign({}, state, { holdingsResp: action.payload });
        case STORE_HOLDINGS_SORT_LIST:
            return Object.assign({}, state, { holdingsSortData: action.payload })
        case STORE_HOLDINGS_GUEST_ALERT:
            return Object.assign({}, state, { holdingGuestMsg: action.payload })
        case STORE_SQUARE_OFF_HOLDINGS:
            return Object.assign({}, state, { isSquareOffHolding: action.payload })
        case STORE_ALL_HOLDINGS_RESP:
            return Object.assign({}, state, { allHoldingsResp: action.payload });
        case STORE_GO_TO_HOLDINGS_FLAG:
            return Object.assign({}, state, { goToHoldings: action.payload });
        case STORE_NAVIGATE_FROM_HOLDINGS_FLAG:
            return Object.assign({}, state,{ navigateFromHoldings: action.payload} );
        case STORE_LANDING_FROM_EDIS_FLAG:
            return Object.assign({}, state,{ landingFromEdisFlag: action.payload,} )
        default:
            return state
    }
}

export default holdings;