import {
    STORE_MARKET_EQUITY_WIDGET, STORE_MARKET_EQUITY_SELECTED_INDICES,
    STORE_MARKET_EQUITY_SELECTED_EXCHANGE, STORE_MARKET_EQUITY_SELECTED_SUBMENU,
    STORE_SELECTED_DERIVATIVE_WIDGET, STORE_SELECTED_DERIVATIVE_SUBMENU,
    STORE_SELECTED_CURRENCY_WIDGET, STORE_SELECTED_CURRENCY_SEGMENT,
    STORE_SELECTED_CURRENCY_EXCHANGE, STORE_SELECTED_CURRENCY_EXPIRY,
    STORE_SELECTED_MARKET_MENU, STORE_SELECTED_DERIVATIVE_EXPIRY,
    STORE_SELECTED_DERIVATIVE_SEGMENT, STORE_SELECTED_DERIVATIVE_EXCHANGE,
    STORE_EXPIRY_LIST
} from '../actions/Actions'

import {
    MARKET_TOPGAINLOSERS_MENU_CONST, MARKET_ACTIVE_VOLUME_MENU_CONST,
    MARKET_WEEK_HIGHLOW_MENU_CONST, MARKET_UPPER_LOWER_MENU_CONST,
    MARKET_HIGH_LOW_ROLLOVER_CONST, MARKET_FNO_PUT_CALL_RATIO_CONST,
    MARKET_ACTIVE_FUTURE_OPTIONS_CONST, MARKET_OI_GAIN_LOSERS_CONST,
    MARKET_IV_GAIN_LOSERS_CONST, MARKET_WIDGET_MENUS_CONST, MARKET_DEALS_MENU_CONST

} from '../../common/Constants'

const initialState = {

    selectedMarketMenu: MARKET_WIDGET_MENUS_CONST[0].name,

    selectedEquityWidget: null,
    selectedEquityIndicies: null,
    selectedEquityExchange: null,
    selectedEquityActivityRange: null,
    selectedSubMenu: {
        topGainMenu: MARKET_TOPGAINLOSERS_MENU_CONST[0].value,
        yrWeekHighLow: MARKET_WEEK_HIGHLOW_MENU_CONST[0].value,
        activeVolumeValue: MARKET_ACTIVE_VOLUME_MENU_CONST[0].value,
        upperLowerCircuit: MARKET_UPPER_LOWER_MENU_CONST[0].value,
        bulkBlockDeals: MARKET_DEALS_MENU_CONST[0].value
    },

    selectedDerivativeWidget: null,
    selectedDerivativeSegment: null,
    selectedDerivativeExchange: null,
    selectedDerivativeExpiry: null,
    selectedDerivativeSubMenu: {
        topGainMenu: MARKET_TOPGAINLOSERS_MENU_CONST[0].value,
        highLowRollOver: MARKET_HIGH_LOW_ROLLOVER_CONST[0].value,
        fnoPutCallRatio: MARKET_FNO_PUT_CALL_RATIO_CONST[0].value,
        activeFutureOptions: MARKET_ACTIVE_FUTURE_OPTIONS_CONST[0].value,
        OIGainLosers: MARKET_OI_GAIN_LOSERS_CONST[0].value,
        IVGainLosers: MARKET_IV_GAIN_LOSERS_CONST[0].value
    },

    selectedCurrencyWidget: null,
    selectedCurrencySegment: null,
    selectedCurrencyExchange: null,
    selectedCurrencyExpiry: null,

    expiryDateList: [],
}

const marketMovers = (state = initialState, action = {}) => {

    switch (action.type) {
        case STORE_MARKET_EQUITY_WIDGET:
            return Object.assign({}, state, { selectedEquityWidget: action.payload });
        case STORE_MARKET_EQUITY_SELECTED_INDICES:
            return Object.assign({}, state, { selectedEquityIndicies: action.payload });
        case STORE_MARKET_EQUITY_SELECTED_EXCHANGE:
            return Object.assign({}, state, { selectedEquityExchange: action.payload });
        case STORE_MARKET_EQUITY_SELECTED_SUBMENU:
            return Object.assign({}, state, { selectedSubMenu: action.payload });
        case STORE_SELECTED_DERIVATIVE_WIDGET:
            return Object.assign({}, state, { selectedDerivativeWidget: action.payload })
        case STORE_SELECTED_DERIVATIVE_SUBMENU:
            return Object.assign({}, state, { selectedDerivativeSubMenu: action.payload })
        case STORE_SELECTED_DERIVATIVE_EXCHANGE:
            return Object.assign({}, state, { selectedDerivativeExchange: action.payload })
        case STORE_SELECTED_DERIVATIVE_SEGMENT:
            return Object.assign({}, state, { selectedDerivativeSegment: action.payload })
        case STORE_SELECTED_DERIVATIVE_EXPIRY:
            return Object.assign({}, state, { selectedDerivativeExpiry: action.payload })
        case STORE_SELECTED_CURRENCY_WIDGET:
            return Object.assign({}, state, { selectedCurrencyWidget: action.payload })
        case STORE_SELECTED_CURRENCY_SEGMENT:
            return Object.assign({}, state, { selectedCurrencySegment: action.payload })
        case STORE_SELECTED_CURRENCY_EXCHANGE:
            return Object.assign({}, state, { selectedCurrencyExchange: action.payload })
        case STORE_SELECTED_CURRENCY_EXPIRY:
            return Object.assign({}, state, { selectedCurrencyExpiry: action.payload })
        case STORE_SELECTED_MARKET_MENU:
            return Object.assign({}, state, { selectedMarketMenu: action.payload })
        case STORE_EXPIRY_LIST:
            return Object.assign({}, state, { expiryDateList: action.payload })
        default:
            return state
    }
}

export default marketMovers;