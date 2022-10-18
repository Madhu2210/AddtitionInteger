import React from 'react'

import { LANUAGE_LIST_LANG, LANG_CONST } from './LanguageConstants'

import { AddIcon } from '../components/common/FontIcons'
import {
    TRADE_FIELD_MATRIX_OBJ, HIDDEN_FIELD_MATRIX_OBJ,
    TRADE_FIELD_MATRIX_OBJ_ORDER_MODIFY_INTRADAY,
    HIDDEN_FIELD_MATRIX_OBJ2
} from './TradeFieldMatrix'
import {
    TRADE_FIELD_MATRIX_OBJ_GUEST, HIDDEN_FIELD_MATRIX_OBJ_GUEST,
    TRADE_FIELD_MATRIX_OBJ_ORDER_MODIFY_INTRADAY_GUEST
} from './TradeFieldMatrix_Guest'
import { english } from './lang/English'
import {
    AF_EVENT_CATEOGORY_TYPES_NEW_CONST, AF_EVENT_NAMES_NEW_CONST,
    BO_REPORTS_BROKERAGE_FILTER_MENU_NEW_CONST,
    BO_REPORTS_BROKERAGE_FILTER_NEW_CONST,
    BO_REPORTS_FILTER_MENU_NEW_CONST, BO_REPORTS_FILTER_NEW_CONST, BO_REPORTS_FINANCIAL_FILTER_MENU_NEW_CONST,
    BO_REPORTS_FINANCIAL_FILTER_NEW_CONST, BO_REPORTS_FINANCIAL_OPTIONS_NEW_CONST,
    BO_REPORTS_INTEREST_REPORT_OPTIONS_NEW_CONST, BO_REPORTS_INTEREST_REPORT_TYPES_NEW_CONST,
    BO_REPORTS_MENUS_ARRAY_NEW_CONST, BO_REPORTS_MENUS_NEW_CONST,
    BO_REPORTS_PNL_FILTER_MENU_NEW_CONST, BO_REPORTS_PNL_FILTER_NEW_CONST,
    BO_REPORTS_PNL_HOLDINGS_FILTER_MENU_NEW_CONST,
    BO_REPORTS_PNL_HOLDINGS_FILTER_NEW_CONST, BO_REPORTS_TAB_OPTIONS_NEW_CONST,
    BO_REPORTS_TAX_FILTER_MENU_NEW_CONST, BO_REPORTS_TAX_FILTER_NEW_CONST, BO_REPORT_FINANCIAL_TYPES_NEW_CONST,
    BO_REPORT_TYPES_NEW_CONST, DYNAMIC_LINK_SCREEN_NEW_CONST,
    FEEDBACK_OPTIONS_NEW_CONST, NCD_DIALOGS_NEW_CONST,
    MTF_DIALOGS_NEW_CONST, NCD_MENUS_NEW_CONST, NCD_MENU_ARRAY_NEW_CONST, NCD_MESSAGES_NEW_CONST,
    NCD_ORDER_STATUS_NEW_CONST, NCD_SERIES_LIST_NEW_CONST,
    NEWS_FILTER_CORPORATE_ACTION_NEW_CONST, NEWS_FILTER_MENU_NEW_CONST,
    NEWS_FILTER_NEW_CONST, NEWS_MENUS_ARRAY_NEW_CONST,
    NEWS_WIDGETS_NEW_CONST, SUBSCRIPTION_STATUS_NEW_CONST, SYMBOL_INSTRUMENT_TYPE_NEW_CONST,
    SYMBOL_RESULT_HEADER_ARRAY_NEW_CONST, SYMBOL_RESULT_HEADER_NEW_CONST,
    TRADESUMMARY_DIALOGS_NEW_CONST, OFS_MENUS_FROM_NEW, OFS_DIALOGS_FROM_NEW,
} from './NewConstants'
// import { convertToLowerCase } from './CommonMethods'

export const SCREENS = {

    BASE: "/",

    PRELOGIN: "/base",
    LOGIN: "/base/login",

    HOME: "/home",
    DASHBOARD: "/home/dashboard",
    WATCHLIST: "/home/watchlist",
    ORDERS: "/home/orders",
    ORDERPAD: "/home/orderpad",
    HOLDINGS: "/home/holdings",
    MARKETS: "/home/markets",
    PORTFOLIO: "/home/portfolio",
    FUNDS: "/home/funds",
    FUND_TRANSFER: "/home/funds/fundtransfer",
    FUND_VIEW: "/home/funds/limitview",
    MUTUAL_FUND: "/home/mutualFund",
    IPO: "/home/ipo",
    INSURANCE: "/home/insurance",
    MESSAGES: "/home/messages",
    NEWS: "/home/news",
    QUOTE: "/home/quote",
    BO: "/home/backOffice",
    ALERTS: "/home/alerts",
    NOTIFICATION: "/home/notifications",
    // OTHER_PRODUCTS: "/home/OtherProducts",
    LAS: "/home/las",
    AVAIL_LOAN: "/home/availLoan",
    OFS: "/home/ofs",
    NCD: "/home/ncd",
    EDIS_DASHBOARD: "/home/edisDashboard",

}

export const SCREENS_GUEST = {
    HOME: "/home/guest",
    DASHBOARD: "/home/guest/dashboard",
    ORDERS: "/home/guest/orders",
    HOLDINGS: "/home/guest/holdings",
    MARKETS: "/home/guest/markets",
    QUOTE: "/home/guest/quote",
}

export const LANG_TEXT_KEY = "langKey"

export const LOCAL_STORAGE = {
    CONFIG: "CONFIG",
    APP_ID: "APP_ID",
    LOGIN_STATUS: "LOGIN_STATUS",
    LANGUAGE: "LANGUAGE",
    LOGIN_TYPE: "LOGIN_TYPE",
    INDICES: "INDICES",
    RECENT_SEARCH_SYMBOLS: "RECENT SEARCH SYMBOLS",
    SETTINGS: "SETTINGS",
    SELECTED_INDICES: "SELECTED_INDICES",
    TRADE_DECIMAL_PRECISION: "TRADE_DECIMAL_PRECISION",
    SOCIAL_MEDIA_LINKS: "SOCIAL_MEDIA_LINKS",
    OPEN_ACC_LINK: "OPEN_ACC_LINK",
    ANDROID_STORE_URL: "ANDROID_STORE_URL",
    IOS_STORE_URL: "IOS_STORE_URL",
    USER_ID: "USER_ID",
    WATCHGROUP_LIMIT: "WATCHGROUP_LIMIT",
    WATCHGROUP_SYM_LIMIT: "WATCHGROUP_SYM_LIMIT",
    RESET_PASSWORD: "RESET PASSWORD",
    ORGANIZE_COLUMNS: "ORGANIZE COLUMNS",
    COMPANY_REG_INFO: "COMPANY_REG_INFO",
    FUND_TRANSFER_FOOTER_CONTENT: "FUND_TRANSFER_FOOTER_CONTENT",
    QUOTE_MENUS: "QUOTE MENUS",
    IPO_DETAILS: "IPO_DETAILS",
    OTP_TIMER: "OTP_TIMER",
    TAX_DECLARE_MSG: "TAX_DECLARE_MSG",
    TAX_DECLARE_MSG_FO: "TAX_DECLARE_MSG_FO",
    LAST_TRADE_WARNING: "LAST_TRADE_WARNING",
    TGROUP_SERIES: "TGROUP_SERIES",
    ODD_LOT_SERIES: "ODD_LOT_SERIES",
    LAS_HELP: "LAS_HELP",
    LAS_OTP_TIMER: "LAS_OTP_TIMER",
    LAS_REPAYMENT: "LAS_REPAYMENT",
    WELCOME_GUEST: "WELCOME_GUEST",
    HELP_AND_SUPPORT: "HELP_AND_SUPPORT",
    OFS_DETAILS: "OFS_DETAILS",
    GUEST_BUY_MSG: "GUEST_BUY_MSG",
    GUEST_FNO_BLOCK: "GUEST_BLOCK_FNO",
    GUEST_PROFIT_MSG: "GUEST_PROFIT_MSG",
    GUEST_LOSS_MSG: "GUEST_LOSS_MSG",
    NEWS_CATEGORY: "NEWS_CATEGORY",
    GUEST_NEWS_CATEGORY: "GUEST_NEWS_CATEGORY",
    GUEST_BANNER: "GUEST_BANNER",
    BECOME_A_PARTNER: "BECOME_A_PARTNER",
    MINIMUM_PAYOUT: "MINIMUM_PAYOUT",
    APPLY_REDIRECT_LINK: "APPLY_REDIRECT_LINK",
    ID_CANCEL_POPUP: "INCOME_CANCEL_POPUP",
    ID_CONVERT_BLOCK: "INCOME_CONVERT_BLOCK",
    ID_TRADE_BLOCK_ORDER: "INCOME_TRADE_ORDER_BLOCK",
    ID_SQUARE_OFF_ALL_BLOCK: "INCOME_SQUAREOFF_ALL_BLOCK",
    GTD_VALIDITY_EXPIRY: "GTD_VALIDITY_EXPIRY",
    DEMO_FIRST: "DEMO_FIRST",
    VESTED_DATA: "VESTED_DATA",
    NCD_INFO: "NCD_INFO",
    FUNDS_SEGREGATION: "FUNDS_SEGREGATION",
    OPEN_GUESTACC_LINK: "OPEN_GUESTACC_LINK",
    OPEN_OTHER_GUESTACC_LINK: "OPEN_OTHER_GUESTACC_LINK",
    LOGIN_URL: "LOGIN_URL",
    LANGUAGE_SETTING_OPTIONS: "LANGUAGE_SETTING_OPTIONS",
    SAVED_FILTERS: "SAVED_FILTERS",
    SAVED_FILTERS_SORTBY: "SAVED_FILTERS_SORTBY",
    SELECTED_WATCHGROUP: "SELECTED_WATCHGROUP",
    MTF_TIMER_DATA: "MTF_TIMER_DATA",
    MARKET_PROTECTION_LIMIT: "MARKET_PROTECTION_LIMIT",
    LOGIN_MPIN: "LOGIN_MPIN",
    LOGIN_MPIN_USERNAME: "LOGIN_MPIN_USERNAME",
    LOGIN_MPIN_USERID: "LOGIN_MPIN_USERID",
    HAS_STORAGE_DATA: "HAS STORAGE DATA",
    FEEDBACK_RATING: "FEEDBACK_RATING"
}

export const INFO_IDS = {
    SUCCESS: "0",
    INVALID_SESSION: "EGN006",
    INVALID_APP_ID: "EGN005",
    DUPLICATATE_ORDER: "EGN0010",
    USER_BLOCKED: "EGN018",
    CHANGE_PASSWORD: "EGN019",
    REQUEST_FAILED: "EGN001",
    DYNAMIC_MSG: "EGN002",

    JSON_EXCEPTION: "EGN003",
    INVALID_REQUEST_PARAMETER: "EGN004",

    NO_DATA: "EGN007",
    INVALID_SYMBOL: "EGN008",

    INVALID_BUILD: "EGN0009",

    ORDER_RESTRICTED_FOR_USER_TYPE: "EGN0012",
    INVALID_ACTION: "EGN0013",
    INVALID_MOBILE: "EGN0011",

    INVALID_BIOMETRIC: "EGN0014",
    BIOMETRIC_EXPIRED: "EGN0015",

    INVALID_MPIN: "EGN0020",
    MPIN_EXPIRED: "EGN0021",

    INVALID_CONFIG: "EGN016",

    ENCRYPTION_ERROR: "EGN017",

    CONNECT_FAILED: "EGN0022",
    SERVICE_MONITOR_NOT_FOUND: "EGN0023",
    REJECTED_ORDER: "EGN0024",
    DUPLICATE_ALERT: "EGN0004",
    INVALID_ALERT: "EGN0007"
}
// in seconds
export const API_TIMEOUT = 30

export const BROWSERS = {
    CHROME: 'CHROME',
    FIREFOX: "FIREFOX",
    SAFARI: "SAFARI"
}

export const EXCHANGES = {
    NSE: "NSE",
    BSE: "BSE",
    NFO: "NFO",
    BFO: "BFO",
    CDS: "CDS",
    MSEI: "MSEI",
    MCXSX: "MCXSX",
    MCX: "MCX",
    ICEX: "ICEX",
    BCD: "BCD",
    NCO: "NCO",
    BCO: "BCO"
}

export const ASSET_TYPES = {
    EQUITY: "EQUITY",
    COMMODITY: "COMMODITY",
    CURRENCY: "CURRENCY"
}

export const LOGIN_DIALOGS = {
    FORGET_PASSWORD: "FORGET_PASSWORD",
    FORGET_USERID: "FORGET_USERID",
    MEMBERSHIP_DETAILS: "MEMBERSHIP_DETAILS",
    UNBLOCK_USER: "UNBLOCK_USER",
    RESET_PASSWORD: "RESET_PASSWORD",
    MOBILE_VERIFICATION: "MOBILE_VERIFICATION",
    ACCOUNT_BLOCKED: "ACCOUNT_BLOCKED",
    PASSWORD_EXPIRED: "PASSWORD_EXPIRED",
    SET_PASSWORD: "SET_PASSWORD",
    LOGOUT: "LOGOUT",
    HELP_AND_SUPPORT: "HELP_AND_SUPPORT",
    GUEST_USER_INFO: "GUEST_USER_INFO",
    GUEST_USER_MENU_INFO: "GUEST_USER_MENU_INFO",
    LANGUAGE_OPTIONS: "LANGUAGE_OPTIONS",
    LOGIN_OTP_VERIFICATION: "LOGIN_OTP_VERIFICATION",
    LOGIN_MPIN_VERIFICATION: "LOGIN_MPIN_VERIFICATION"
}

export const SAVED_PREFERENCE_DETAILS = "SAVED_PREFERENCE_DETAILS"

export const WATCHLIST_DIALOGS = {
    DELETE_WATCHLIST: "DELETE_WATCHLIST",
    DELETE_SELECTED_SYM: "DELETE_SELECTED_SYM",
    ORGANISE_COLUMNS: "ORGANISE_COLUMNS",
    CONTEXT_MENU: "CONTEXT MENU",
    MARKET_DEPTH: "MARKET DEPTH",
    FUTURE_OPTIONS: "FUTURE_OPTIONS",
    CONTRACT_INFO: "CONTRACT INFO",
}

export const NET_POSITION_DIALOGS = {
    POSITION_CONVERSION: "POSITION_CONVERSION",
    SUCCESS: "SUCCESS"
}

export const ORDER_BOOK_DIALOGS = {
    ORDER_TRAIL: "ORDER_TRAIL",
    ORDER_CANCEL: "ORDER_CANCEL",
    ORDER_EXIT: "ORDER_EXIT"
}

export const TRADE_BOOK_DIALOGS = {
    TRADE_SUMMARY: "TRADE_SUMMARY",
    TRADE_DATE: "TRADE_DATE"
}

export const TRADE_DIALOGS = {
    ORDER_PAD: "ORDER_PAD"
}

export const ORDERPAD_DIALOGS = {
    ORDER_PAD: "ORDER_PAD",
    ORDER_CONFIRM: "ORDER CONFIRM",
    ORDER_RESULT: "ORDER RESULT",
    MARKET_DEPTH: "MARKET_DEPTH",
    ALERT_DIALOG: "ALERT_DIALOG",
    ORDEPAD_GROUP_SERIES: "ORDEPAD_GROUP_SERIES",
    BTST_STOCKS: "BTST_STOCKS",
    AUTHORISE_MTF: "AUTHORISE_MTF",
    MTF_KNOW_MORE: "MTF_KNOW_MORE"
}

export const FUNDS_SCREENS = {
    AVAILABLE_FUNDS: "AVAILABLE_FUNDS",
    FUNDS_WITHDRAWAL: "FUNDS_WITHDRAWAL",
    ADD_PAYOUT: "ADD_PAYOUT",
    BASIC_VIEW: "BASIC VIEW",
    DETAILED_VIEW: "DETAILED VIEW",
    ADD_FUNDS: "ADD_FUNDS",
    CANCEL_PAYOUT: "CANCEL_PAYOUT",
    RECENT_WITHDRAWAL: "RECENT_WITHDRAWAL",
    PAYMENT_MODE_ECOLLECT: "PAYMENT_MODE_ECOLLECT",
    SWITCH_FUNDS: "SWITCH_FUNDS",
    ADD_SWITCHOUT: "ADD_SWITCHOUT"
}

export const MENU_ALT_NAME = {
    FUNDS_TRANSFER: "FUNDS",
    ALERTS: "ALERTS",
    LAS: "LAS",
    BO: "BO",
    OFS: "OFS",
    IPO: "IPO",
    NCD: "NCD",
    AVAIL_LOAN: "AVAIL_LOAN",
    EDIS_DASHBOARD: "EDIS_DASHBOARD"
}

export const FUNDS_CONFIRMATION_MSG = {
    YES: 'YES',
    NO: 'NO'
}
export const ORDERPAD_SERIES = {
    TGROUP_SERIES: "TGROUP_SERIES",
    ODD_LOT_SERIES: "ODD_LOT_SERIES"
}

export const ORDER_DIALOGS = {
    ORDERBOOK_DETAILS: "ORDERBOOK_DETAILS",
    PENDING_D_CANCEL_ORDER: "PENDING_DIALOG_CANCEL_ORDER",
    CANCEL_ORDER_CONFIRM: "CANCEL_ORDER_CONFIRM",
    NETPOSITION_DETAILS: "NETPOSITION_DETAILS",
    ORDERTRIAL_DETAILS: "ORDERTRIAL_DETAILS",
    CONVERT: "CONVERT",
    CONVERT_RESULT: "CONVERT_RESULT",
    EXIT_ORDER: "EXIT ORDER",
    NETPOSITION_SQOFF_CONFIRM: "NETPOSITION_SQUAREOFF_CONFIRM",
    NETPOSITION_SQOFF_CONFIRM_SUCC: "NETPOSITION_SQOFF_CONFIRM_SUCC"
}

export const QUOTE_DIALOGS = {
    SELECT_WATCHGROUP: "SELECT_WATCHGROUP",
    ADD_SYM_RESULT: "ADD_SYM_RESULT",
    CHART: 'CHART',
    NEWS_DETAILS: "NEWS_DETAILS",
    EMPTY_WATCHLIST: "EMPTY_WATCHLIST"
}

export const IPO_DIALOGS = {
    APPLY_ORDER: "APPLY_ORDER",
    ORDER_RESULT: "ORDER_RESULT",
    MODIFY_ORDER: "MODIFY_ORDER",
    CANCEL_ORDER: "CANCEL_ORDER",
    CANCEL_ORDER_RESULT: "CANCEL_ORDER_RESULT",
}

export const IPO_ORDER_HISTORY_STATUS = {
    ALLOTTED: "ALLOTTED",
    NOT_ALLOTTED: "NOT ALLOTTED"
}

export const WATCHGROUP_MAX_LIMIT = 5

export const ORDER_TYPES =
{
    BUY: "BUY",
    SELL: "SELL"
}

export const PAN_DOB_INPUT = {
    PAN: "PAN",
    DOB: "DOB"
}

export const ORDER_MODIFY_TYPE = {
    NEW_ORDER: "NEW ORDER",
    MODIFY: "MODIFY",
    RE_ORDER: "RE ORDER",
    ADD_MORE: "ADD MORE",
    BUY_MORE: "BUY MORE",
    SELL_MORE: "SELL MORE",
    SQUARE_OFF: "SQUARE OFF",
    STOP_LOSS: "STOP LOSS"
}

export const ORDER_MODIFY_CHILD_TYPES = {
    MAIN: "MAIN",
    SECOND: "SECOND",
    THIRD: "THIRD"
}

export const ORDER_MODIFY_BO_CO = {
    BO_MAIN: "BO_MAIN",
    BO_SECOND: "BO_SECOND",
    BO_THIRD: "BO_THIRD",
    BO_SECOND_SL: "BO_SECOND_SL",
    CO_MAIN: "CO_MAIN",
    CO_SECOND: "CO_SECOND"

}

export const ORDER_STATUS_MSG = {
    ORDER_CANCEL: "Order Cancelled",
    ORDER_REJECT: "Order Rejected",
    ORDER_REJECT_INSUFFICIENT_FUNDS: "Order Rejected due to insufficient funds"
}

export const ORDER_RESULT_HEADER = {
    SUCCESS: "Success",
    FAIL: "Failed",
    CANCELLED: "Cancelled",
    REJECTED: "Rejected",
    REJECTED_INSUFFICIENT_FUNDS: "Order Rejected due to insufficient funds",
    FAILURE: "Rejected"
}

export const CONTEXT_MENU_REFS = {
    WATCHLIST_MIN: "WATCHLIST_MIN",
    WATCHLIST_MAX: "WATCHLIST_MAX",
    MARKET_MOVERS: "MARKET MOVERS",
    INDICES: "INDICES"
}

export const DASHBOARD_CHART_MENUS = {
    MY_PORTFOLIO: "MY PORTFOLIO",
    ORDER_OVERVIEW: "ORDER OVERVIEW"
}

export const DASHBOARD_CHART_MENUARRAY = [
    { [LANG_TEXT_KEY]: "MY_PORTFOLIO", name: DASHBOARD_CHART_MENUS.MY_PORTFOLIO },
]

export const DASHBOARD_NEWS_MENUS = {
    TOP_VISITED_SYMBOLS: "TOP VISITED SYMBOLS",
    TRENDING_NEWS: "TRENDING NEWS",
    FII_DII: "FII & DII"
}

export const DASHBOARD_NEWS_MENUARRAY = [
    // { [LANG_TEXT_KEY]: "TOP_VISITED_SYMBOLS", name: DASHBOARD_NEWS_MENUS.TOP_VISITED_SYMBOLS },
    { [LANG_TEXT_KEY]: "TRENDING_NEWS", name: DASHBOARD_NEWS_MENUS.TRENDING_NEWS },
    // { [LANG_TEXT_KEY]: "FII_DII", name: DASHBOARD_NEWS_MENUS.FII_DII }
]

export const HOLDINGS_WIDGETS = {
    HOLDINGS_TABLE: "HOLDINGS_TABLE"
}

export const HOLDINGS_DIALOGS = {
    HOLDINGS_NEWS_DETAILS: "HOLDINGS_NEWS_DETAILS"
}

export const LOGIN_TYPE = {
    GUEST: "GUEST",
    VIRTUAL: "VIRTUAL",
    TRADING: "TRADING"
}

export const BASE_URL_TYPE = {
    VIRTUAL: "VIRTUAL",
    TRADING: "TRADING",
    MARKET_DATA: "MARKET_DATA",
    NEWS: "NEWS"
}

export const SET_TIMEOUT_INTERVAL = {
    // 5 secs
    LOGIN_SLIDER_INTERVAL: 5000,
    DASHBOARD_SLIDER_INTERVAL: 5000,
    //30 secs
    ORDER_INERVAL: 30000,
    //4 secs 
    HIDE_TOAST_INTERVAL: 5000,
    // 3 secs
    SUCCESS_POPUP_CLOSE_TIME: 3000,
    //60 secs  
    GET_AVAIL_FUNDS: 60000,
    // 5 sec
    GET_USER_STAGE: 5000,
    // 1 sec
    RESEND_OTP_TIMER: 1000,

    LIMITS_UPDATE: 1000
}

export const ENABLE_CACHE_SEARCH = true

export const WATCHLIST_WIDGETS = {
    WATCHLIST_TABLE: "WATCHLIST_TABLE",
    CHART: "CHART"
}

export const DASHBOARD_WIDGETS = {
    INDICES_CONSTITUENTS: "INDICES CONSTITUENTS"
}

export const ADD_WATCHLIST_OPTION = {
    fontIcon: < AddIcon />,
    wName: 'Add Watchlist',
    wId: "0",
    test_id: 'addWatchlist_option'
}

export const STREAMING_MODULES = {
    WATCHLIST: "WATCHLIST",
    HEADER_INDICES: "HEADER INDICES",
    DASHBOARD_INDICES: "DASHBOARD INDICES",
    CHART: "CHART",
    CHART_MODAL: "CHART_MODAL",
    ORDERPAD: "ORDERPAD",
    ORDERBOOK: "ORDERBOOK",
    TRADEBOOK: "TRADEBOOK",
    QUOTE_VIEW: "QUOTE VIEW",
    QUOTE_DETAILS: "QUOTE DETAILS",
    QUOTE: "QUOTE",
    GAUGE_GRAPH: "GAUGE GRAPH",
    MARKET_DEPTH: "MARKET DEPTH",
    NET_POSITION: "NET POSITION",
    HOLDINGS: "HOLDINGS",
    HOLDINGS_TABLE: "HOLDINGS_TABLE",
    HOLDINGS_PORTFOLIO: "HOLDINGS PORTFOLIO",
    HOLDINGS_LEAD_LAGG: "HOLDINGS LEAD LAGG",
    MARKET_MOVERS_TOP_GAIN: "MARKET TOP GAIN LOSERS",
    MARKET_MOVERS_WKH_WKL: "MARKET WKH WKL",
    MARKET_MOVERS_VOL_VAL: "MARKET ACTIVE VOLUME VALUE",
    MARKET_MOVERS_UPPER_LOWER_CIRCUIT: "MARKET UPPER LOWER CIRCUIT",
    MARKET_MOVERS_DERIVATIVES_TOP_GAIN: "MARKET DERIVATIVES TOP GAIN",
    MARKET_MOVERS_DERIVATIVES_OI_GAIN: "MARKET DERIVATIVES OI GAIN",
    MARKET_MOVERS_DERIVATIVES_IV_GAIN: "MARKET DERIVATIVES IV GAIN",
    MARKET_MOVERS_DERIVATIVES_ACTIVE_OPTION: "MARKET DERIVATIVES ACTIVE OPTION",
    MARKET_MOVERS_DERIVATIVES_ROLL_OVER: "MARKET DERIVATIVES ROLL OVER",
    MARKET_MOVERS_DERIVATIVES_FNO_PUTCALL: "MARKET DERIVATIVES FNO PUT cALL",
    DASHBOARD_GAINERS: "DASHBOARD GAINERS",
    DASHBOARD_LOSERS: "DASHBOARD LOSERS",
    MARKET_TOPGAINERS: "MARKET TOPGAINERS",
    MARKET_TOPLOSERS: "MARKET TOPLOSERS",
    OI_GAINERS: "MARKET OIGAINERS",
    OI_LOSERS: "OI LOSERS",
    ACTIVE_VOLUME: "ACTIVE VOLUME",
    FUTURE_CHAIN: "FUTURE CHAIN",
    OPTION_CHAIN: "OPTION CHAIN",
    MARKET_MOVERS_EQUITY: "MARKET_MOVERS",
    OPTION_CHAIN_PUT: "OPTION CHAIN PUT",
    OPTION_CHAIN_CALL: "OPTION CHAIN CALL",
    INDICES_CONSTITUENTS: "INDICES_CONSTITUENTS",
    RESENT_SEARCH: "RECENT SEARCH",
    DRAGGERS_TABLE: "DRAGGERS_TABLE",
    PULLERS_TABLE: "PULLERS_TABLE",
    IPO_ORDER_HISTORY: "IPO_ORDER_HISTORY",
    CLOSED_IPO: "CLOSED_IPO",
    MARKET_MOVERS_IPO_PERF: "MARKET_MOVERS_IPO_PERF",
    MARKET_DERIVATIVES: "MARKET_DERIVATIVES",
    ALERT_USER: "ALERT USER",
    SCANNERS: "SCANNERS",
    PNL_REPORT_BO: "PNL_REPORT_BO",
    SYMBOL_SEARCH: "SYMBOL_SEARCH",
    MARKET_SMITH: "MARKET SMITH",
    TOTAL_INVESTMENT: "TOTAL INVESTMENT",
    CURRENT_VALUES: "CURRENT VALUE",
    OVERALL_PNL: "OVERALL P&L",
    TODAYS_PROFIT: "TODAYS P&L"

}

export const INSTRUMENT_TYPES = {
    STK: "STK"
}

export const TRADE_PRODUCT_TYPES = {
    DELIVERY: "DELIVERY",
    INTRADAY: "INTRADAY",
    CO: "CO",
    BO: "BO",
    TNC: "TNC",
    MTF: "MTF",
    NORMAL: "NORMAL"
}
export const EXCHANGE_DATA_LIST = [
    { name: "NSE", selected: false },
    { name: "BSE", selected: false },
    { name: "NFO", selected: false },
    { name: "HOLDINGS", selected: false }
]
export const TRADE_INTRADAY_PRODUCT_TYPE_ARRAY = [
    "REGULAR",
    // *** was asked to remove BO for mar17 release
    "BO",
    "CO",
]

export const TRADE_INTRADAY_OPTIONS_PRODUCT_TYPE_ARRAY = [
    "REGULAR",
    // *** was asked to remove BO & CO for 21 sep release
]

export const TRADE_INTRADAY_GUEST_PRODUCT_TYPE_ARRAY = [
    "REGULAR",
]

export const TRADE_INTRADAY_PRODUCT_TYPES = {
    REGULAR: "REGULAR",
    CO: "CO",
    BO: "BO",
}

export const STK_PRODUCT_TYPES = [
    "DELIVERY",
    "INTRADAY",
    "MTF",
    "TNC"
]

export const STK_GUEST_PRODUCT_TYPES = [
    "DELIVERY",
    "INTRADAY",
]

export const TRADE_ORDER_TYPES = {
    MARKET: "MARKET",
    LIMIT: "LIMIT",
    SL: "SL",
    SL_M: "SL-M"
}

export const ORDER_STATUS = {
    REJECTED: "rejected",
    PENDING: "pending",
    EXECUTED: "executed",
    CANCELLED: "cancelled",
    TRIGGER_PENDING: "trigger pending",
}

export const SHARE_HOLDINGS = {
    PROMOTERS: { name: "Promoters", key: "promoters" },
    FII: { name: "FII", key: "FII" },
    DII_MF: { name: "DII & MF", key: "DII & MF" },
    OTHERS: { name: "Others", key: "others" }
}

export const TRADE_VALIDITY_TYPES = {
    DAY: "DAY",
    IOC: "IOC",
    GTD: "GTD",
    GTC: "GTC"
}

export const SORT_TYPES = {
    ASC: "ASC",
    DESC: "DESC",
    NONE: "NONE"
}

export const SORT_DATATYPE = {
    STRING: "string",
    INT: "int",
    DATE: "date",
    BIG_INT: "bigInt"
}

export const THEMES = {
    DARK: "DARK",
    LIGHT: "LIGHT"
}

export const THEME_ARRAY = [
    { theme: THEMES.DARK },
    { theme: THEMES.LIGHT }
]

export const ORDERPAD_FIIELD_KEYS = {
    SYMBOL: "symbol",
    DIS_SYMBOL: "dispSym",
    EXC: "exc",
    ACTION: 'action',
    ORDER_TYPE: "orderType",
    PRODUCT_TYPE: "producType",
    VALIDITY: 'validity',
    ORDER_VALIDITY: "orderValidity",
    ORDER_VALUE: "orderValue",
    QUANTITY: "qty",
    PRICE: "price",
    TRIGGER_PRICE: "triggerPrice",
    SQUARE_OFF: "squareOff",
    STOP_LOSS: "stopLoss",
    TRAIL_STOP_LOSS: "trailStopLoss",
    DIS_QTY: "disQty",
    MARKET_PROTECTION: "mktPro",
    AMO: "AMO",
    GTD_DATE: 'GTD_date',
    GTC_PRICE: "GTC_price",
    CURR_DATE_TIME: "currDate",
    REMAIN_QTY: "remainQty",
    MAIN_LEG_PRICE: "mainLegPrice",
    UPI_ID: "upiID",
    API_KEY: {
        'ordAction': "ACTION",
        "ordType": "ORDER_TYPE",
        "prdType": "PRODUCT_TYPE",
        'ordDuration': "VALIDITY",
        "orderValidity": "ORDER_VALIDITY",
        "orderValue": "ORDER_VALUE",
        "qty": "QUANTITY",
        "limitPrice": "PRICE",
        "triggerPrice": "TRIGGER_PRICE",
        "squareOff": "SQUARE_OFF",
        "stopLoss": "STOP_LOSS",
        "trailingSL": "TRAIL_STOP_LOSS",
        "disQty": "DIS_QTY",
        "isAmo": "AMO",
        'ordValDate': "GTD_DATE",
        "GTC_price": "GTC_PRICE",
        "remainQty": "REMAIN_QTY",
        "mainLegPrice": "MAIN_LEG_PRICE",
        "mktPro": "MARKET_PROTECTION"
    },
    MSG_NAME: {
        'triggerPrice': { name: 'Trigger price', langKey: "TRIGGER_PRICES" },
        'trailStopLoss': { name: 'Trailing stop loss', langKey: "TRAILING_STOP_LOSS" },
        'stopLoss': { name: 'Stop loss value', langKey: "STOP_LOSS_VAL" },
        'squareOff': { name: 'Square off value', langKey: "SQUARE_OFF_VAL" },
        'price': { name: 'Price', langKey: "PRICEE" },
    }
}

export const TRADE_TYPE_NAME_CONVERSION = {
    [TRADE_ORDER_TYPES.MARKET]: "MARKET",
    [TRADE_ORDER_TYPES.LIMIT]: "LIMIT",
    [TRADE_ORDER_TYPES.SL]: "STOP LOSS",
    [TRADE_ORDER_TYPES.SL_M]: "STOP LOSS MARKET",
    [TRADE_PRODUCT_TYPES.CO]: "COVER ORDER",
    [TRADE_PRODUCT_TYPES.BO]: "BRACKET ORDER",
    "REGULAR": "REGULAR"
}

export const STREAMING_KEYS = {
    LTP: "ltp",
    CHANGE: "chng",
    CHANGE_PER: "chngPer",
    OPEN: "open",
    HIGH: "high",
    LOW: "low",
    CLOSE: "close",
    VOLUME: "vol",
    WEEK_HIGH: "yHigh",
    WEEK_LOW: "yLow",
    LTQ: "ltq",
    LTT: "ltt",
    OI: "OI",
    OI_PER: "OIChngPer",
    YEAR_HIGH: "yHigh",
    YEAR_LOW: "yLow",
    UCL: "ucl",
    LCL: "lcl",
    ATP: "atp",
    TTV: "ttv",
    CHANGE_CLASS: "chngClass",
    CHANGE_PER_CLASS: "chngPerClass",
    LTP_CLASS: "ltpClass"
}

export const ORDER_FIELD_MAX_LENGTH_QTY = 10
export const ORDER_FIELD_MAX_LENGTH_PRICE = 9
export const ORDER_FIELD_MAX_VALUE_QTY = 99999
export const ORDER_FIELD_MAX_VALUE_PAYABLE_AMOUNT = 200000
export const ORDER_FIELD_MAX_VALUE = 9999999999
export const ORDER_FIELD_MAX_VALUE_MP = 100
export const ORDER_FIELD_MAX_VALUE_STK_MP = 10
export const ORDER_FIELD_MAX_VALUE_IDX_MP = 5
export const ORDER_FIELD_MAX_LENGTH_IA = 9
export const PASSWORD_MAX_LENGTH = 12
export const LOAN_AMT_FIELD_MAX_LENGTH = 10
export const FEEDBACK_MAX_LENGTH = 100

export const TRADE_FIELD_MATRIX = TRADE_FIELD_MATRIX_OBJ
export const TRADE_FIELD_MATRIX_MODIFY_INTRADAY = TRADE_FIELD_MATRIX_OBJ_ORDER_MODIFY_INTRADAY
export const HIDDEN_FIELD_MATRIX = HIDDEN_FIELD_MATRIX_OBJ
export const HIDDEN_FIELD_MATRIX_2 = HIDDEN_FIELD_MATRIX_OBJ2

export const TRADE_FIELD_MATRIX_GUEST = TRADE_FIELD_MATRIX_OBJ_GUEST
export const TRADE_FIELD_MATRIX_MODIFY_INTRADAY_GUEST = TRADE_FIELD_MATRIX_OBJ_ORDER_MODIFY_INTRADAY_GUEST
export const HIDDEN_FIELD_MATRIX_GUEST = HIDDEN_FIELD_MATRIX_OBJ_GUEST

export const DATE_FORMATS = {
    DEFAULT: "YYYY-MM-DD",
    DDMMYYYY: "DD/MM/YYYY",
    DDMMMYYYY: "DDMMMYYYY",
    MMDDYY: "MMDDYY",
    HHMMSS: "HHMMSS",
    DDMMYYYY_HYPEN: "DD-MM-YYYY",
    YYYYMMDD: "YYYY/MM/DD",
}

export const MARKET_WIDGETS = {
    TOP_GAIN_LOSER: "TOP GAINERS / LOSERS",
    WEEK_HIGH_LOW: "52 WEEK HIGH / LOW",
    ACTIVE_VOLUME_VALUE: "ACTIVE VOLUME / VALUE",
    UPPER_LOWER_CIRCUIT: "UPPER CIRCUIT / LOWER CIRCUIT",
    BULK_BLOCK_DEALS: "BULK DEALS / BLOCK DEALS",
    FD_ACTIVITY: "FII DII ACTIVITY",
    ROLL_OVER_HIGH_LOW: "HIGHEST ROLLOVER / LOWEST",
    FNO_PULSE_PUT_CALL_RATIO: "FNO PULSE / PUT CALL RATIO",
    ACTIVE_FUTURE_OPTIONS: "ACTIVE FUTURE / OPTIONS",
    OI_GAINERS_LOSERS: "OI GAINERS / LOSERS",
    IV_GAINERS_LOSERS: "IV GAINERS / LOSERS",
    TOP_GAINERS: "TOP GAINERS",
    TOP_LOSERS: "TOP LOSERS",
    OI_GAINERS: "OI GAINERS",
    OI_LOSERS: "OI LOSERS",
    ACTIVE_VOLUME: "ACTIVE VOLUME"
}

export const MARKET_MOVERS_KEYS = {
    TOP_GAINERS: "topGainers",
    TOP_LOSERS: "topLosers"
}

export const PRECISIONS = {
    PORTFOLIO_PNL_CALC: 2,
    DEFAULT_COMMA_SEPARATION: 2,
    ROLLUP_VAL_CALC: 2,
    DEFAULT_PRECISION: 0
}

export const DEFAULT_VALUES = {
    PASSSWORD_MIN_LEN: 6,
    PASSSWORD_MAX_LEN: 12,
    DOB_LEN: 8,
    LOT_SIZE: 1,
    PAN_LEN: 10,
    USERID_MIN_LEN: 2,
    USERID_MAX_lEN: 20,
    USER_MPIN_LEN: 4
}

export const TEXT_ORIENTATION = {
    UPPERCASE: "UPPERCASE",
    LOWERCASE: "LOWERCASE",
    PASCALCASE: "PASCALCASE"
}

export const DASHBOARD_ORDER_TABS = {
    HOLDINGS: "Holdings",
    NET_POSITIONS: "Net position",
    ORDER_STATUS: "Order status"
}

export const DASHBOARD_ORDER_CARDS = {
    TOTAL_INVESTMENT: "Total Investment",
    CURRENT_VALUES: "Current Value",
    OVERALL_PNL: "Overall P&L",
    TODAYS_PROFIT: "Today's P&L"
}


export const DASHBOARD_WIDGET_MODE = {
    DEFAULT: "default",
    QUOTE_VIEW: "quote_view",
    ORDER_VIEW: "order_view",
    ORDER_WITH_QUOTE: "orderDetails_with_quote",
    INDICES_VIEW: "indices_view",
    MARKET_VIEW: "market_view",
    ALERT_VIEW: "alert_view",
    NOTIFY_VIEW: "notify-view",
    SCANNERS_VIEW: "scanners-view",
    NEWS_VIEW: "news-view",
    IDEAS_VIEW: "ideas-view",
    MARKETSMITH_VIEW: "marketsmith-view"
}

export const LAS_INTREST_CHART_CONST = {
    TOTAL_AMOUNT: "TOTAL_AMOUNT",
    AMOUNT_PAYABLE: "AMOUNT_PAYABLE"
}

export const CHART_COLORS = {
    HOLDINGS: {
        DARK: {
            arcGreenColor: "#34D178", arcRedColor: "#D13A43", arcBgColor: "#dddddd",
            textColor: "#FFFFFF", labelColor: "#6F767E", lineColor: "#1C1E30"
        },
        LIGHT: {
            arcGreenColor: "#34D178", arcRedColor: "#FF343A", arcBgColor: "#dddddd",
            textColor: "#353F4A", labelColor: "#ABADB6", lineColor: "#FFFFFF"
        }
    },
    SHARE_HOLDINGS: {
        DARK: {
            fontColor: '#747474', [SHARE_HOLDINGS.PROMOTERS.key]: '#FF8800', [SHARE_HOLDINGS.FII.key]: '#00B500',
            [SHARE_HOLDINGS.DII_MF.key]: '#0072BC', [SHARE_HOLDINGS.OTHERS.key]: '#FF6700'
        },
        LIGHT: {
            fontColor: '#747474', [SHARE_HOLDINGS.PROMOTERS.key]: '#FF8830', [SHARE_HOLDINGS.FII.key]: '#00B144',
            [SHARE_HOLDINGS.DII_MF.key]: '#0072BC', [SHARE_HOLDINGS.OTHERS.key]: '#FF6700'
        }
    },
    LAS_INTREST: {
        DARK: {
            [LAS_INTREST_CHART_CONST.TOTAL_AMOUNT]: "#FF6700", [LAS_INTREST_CHART_CONST.AMOUNT_PAYABLE]: "#D9D9D9"
        },
        LIGHT: {
            [LAS_INTREST_CHART_CONST.TOTAL_AMOUNT]: "#FF6700", [LAS_INTREST_CHART_CONST.AMOUNT_PAYABLE]: "#002856"
        }
    }
}

export const QUOTE_VIEW_CHART = {
    QUOTE_DETAILS: "QUOTE_DETAILS",
    TECHNICALS: "TECHNICALS",

}

export const ORDER_CHILD_TYPES = {
    MAIN: "MAIN",
    SECOND: "SECOND",
}

export const QUOTE_FINACIALS = {
    KEY_RESULTS: "KEY_RESULTS",
    KEY_RATIOS: "KEY_RATIOS",
    SHARE_HOLDING_PATTERN: "SHARE_HOLDING_PATTERN",
    STANDALONE: "STANDALONE",
    CONSOLIDATED: "CONSOLIDATED"
}

export const TAX_DECLARATION_STAGES = {
    STAGE_0: "0",
    STAGE_1: "1",
    STAGE_2: "2"
}

export const TAX_DECLARATION_DIALOGS = {
    ATTENTION: "ATTENTION",
    ORDERPAD_ALERT: "ORDERPAD ALERT",
    ORDERPAD_RESULT_ALERT: "ORDERPAD RESULT ALERT",
    INPROGRESS_ALERT: "INPROGRESS ALERT",
    IDEAS_ALERT: "IDEAS ALERT"
}

export const TAX_DECLARE_BLOCK_SCREENS = {
    ORDERPAD: "ORDERPAD",
    ORDER_RESULT: "ORDER RESULT",
    DASHBOARD: "DASHBOARD",
    IDEAS: "IDEAS"
}

export const TAX_DECLARATION_MSG_KEY = {
    INITIAL_POPUP: "IDInitialPopup",
    DECLARATION_MSG: "IDDeclarationMsg",
    IN_PROGRESS_MSG: "IDInProgressMsg",
    TRADE_BLOCK: "IDTradeBlockMsg",
    TRADE_BLOCK_INPROGRESS: "IDTradeBlockInProgressMsg",
    TRADE_WARNING: "IDTradeWarningMsg",
    ID_CANCEL_POPUP: "IDCancelPopup",
    ID_POSITION_CONVERSION: "IDPositionConversionMsg",
    ID_SQUARE_OFF_ALL: "IDSquareOffAllMsg",
    ID_SUBMIT_POPUP: "IDSubmitPopupCash",
    ID_TRADE_BLOCK_ORDER_TYPE: "IDTradeBlockOrderTypeMsg"
}

export const TAX_DECLARATION_FO_MSG_KEY = {
    INITIAL_POPUP: "IDInitialPopupFO",
    DECLARATION_MSG: "IDDeclarationMsg",
    IN_PROGRESS_MSG: "IDInProgressMsg",
    TRADE_BLOCK: "IDTradeBlockMsgFO",
    TRADE_BLOCK_INPROGRESS: "IDTradeBlockInProgressMsg",
    TRADE_WARNING: "IDTradeWarningMsgFO",
    ID_CANCEL_POPUP: "IDCancelPopupFO",
    ID_POSITION_CONVERSION: "IDPositionConversionMsgFO",
    ID_SQUARE_OFF_ALL: "IDSquareOffAllMsgFO",
    ID_SUBMIT_POPUP: "IDSubmitPopupFO",
    ID_TRADE_BLOCK_ORDER_TYPE: "IDTradeBlockOrderTypeMsgFO"
}

export const USE_BFSL_HOLDINGS = "USE MY BFSL HOLDINGS"

export const LAS_LOAN_DIALOGS = {
    TERMS_CONDITIONS: "LOAN AGAINST SECURITIES",
    ELIGIBLE_POPUP: "ELIGIBLE",
    ABV_50L_POPUP: "ABOVE 50L",
    NOT_ELIGIBLE_POPUP: "NOT ELIGIBLE",
    LOAN_APPROVED_POPUP: "LOAN APPROVED",
    OTP_VERIFICATION: " OTP VERIFICATION",
    REQUEST_POPUP: "REQUEST POPUP",
    CONGO_POPUP: "CONGRATULATION POPUP",
    STAGE_INFO: "STAGE INFO",
    RECHECK_SUCCESS: "RECHECK SUCCESS",
    FAIL_POPUP: "FAIL POPUP",
    LAS_COMPLETED: "LAS COMPLETED",
    RECHECK_SORRY: "RECHECK SORRY",
    TICKET_CREATED: "TICKET CREATED",
    LAS_IFRAME: "LAS IFRAME",
    EPLEDGE_CONFIRM: "EPLEDGE COMFIRM"
}
export const AVAIL_LOAN_DIALOGS = {
    WITHDRAW_FUND_INFO: "WITHDRAW_FUND_INFO",
    WITHDRAW_FUND: "WITHDRAW_FUND",
    OTP_VERIFICATION: " OTP_VERIFICATION",
    REQUEST_SUCCESS: "REQUEST_RECIEVED_SUCCESS",
    REQUEST_CANCELLED: "REQUEST_CANCELLED",
    LOAN_DETAILS: "LOAN_DETAILS",
    FAILURE_LOAN_DETAILS: "FAILURE_LOAN_DETAILS",
    EPLEDGE_OTP_VERIFICATION: "EPLEDGE_OTP_VERIFICATION",
    EPLEDGE_CONGRATS: "EPLEDGE_CONGRATS",
    EPLEDGE_FAILURE: "EPLEDGE_FAILURE",
    ADDITIONAL_PLEDGE_CONFIRM: "ADDITIONAL_PLEDGE_CONFIRM"

}
export const MARKETSMITH_SCREENS = {
    RENEW_SUBSCRIPTION: "RENEW_SUBSCRIPTION",
    SUBSCRIPTION: "SUBSCRIPTION",
    CHOOSE_TENURE: "CHOOSE_TENURE",
    COMPARISON: "COMPARISON",
}

export const MARKETSMITH_DIALOG_SCREENS = {
    PAYMENT_SUCCESS_POPUP: "PAYMENT_SUCCESS_POPUP",
    CANCEL_SUBSCRIPTION_POPUP: "CANCEL SUBSCRIPTION",
    CANCEL_SUBSCRIPTION_RESULT_POPUP: "CANCEL SUBSCRIPTION RESULT",
    FEEDBACK_FORM: "FEEDBACK FORM",
    IFRAME_P0PUP: "IFRAME_P0PUP"
}

/* ========= Language Based Constants start ========= */

// let islangInList = false;
// const storedPreferedLanguage = getItemByKey(LOCAL_STORAGE.LANGUAGE)

// LANUAGE_LIST_LANG.map((item) => {
//     if (item.key === storedPreferedLanguage)
//         islangInList = true;
// })

// export const PREFERED_LANGUAGE = islangInList ? (storedPreferedLanguage ? storedPreferedLanguage : LANGUAGE_KEY.ENGLISH) : LANGUAGE_KEY.ENGLISH;

export const PREFERED_LANGUAGE = "ENGLISH"

export const LANGUAGE_LIST = LANUAGE_LIST_LANG;

export const CONSTANTS = LANG_CONST[PREFERED_LANGUAGE]

export const CONTEXT_MENU_OBJ = english.CONTEXT_MENU
export const CONTEXT_MENUS = [
    { value: CONTEXT_MENU_OBJ.BUY, key: "BUY", shortCut: "F1" },
    { value: CONTEXT_MENU_OBJ.SELL, key: "SELL", shortCut: "F2" },
    // { value: CONTEXT_MENU_OBJ.SET_ALERT, key: "SET_ALERT", shortCut: "Alt + S" },
    { value: CONTEXT_MENU_OBJ.MARKET_DEPTH, key: "MARKET_DEPTH", shortCut: "F6" },
    { value: CONTEXT_MENU_OBJ.CHART, key: "CHART", shortCut: "Alt + C" },
    { value: CONTEXT_MENU_OBJ.ADD_SCRIP, key: "ADD_SCRIP", shortCut: "Insert" },
    { value: CONTEXT_MENU_OBJ.REMOVE_SCRIP, key: "REMOVE_SCRIP", shortCut: "Delete" },
    { value: CONTEXT_MENU_OBJ.SCRIP_INFO, key: "SCRIP_INFO", shortCut: "Alt + F1" },
    { value: CONTEXT_MENU_OBJ.FUTURES_CHAIN, key: "FUTURES_CHAIN", shortCut: "Alt + F" }
]

const Columns = english.TABLE_HEADERS

export const APP_MENUS = {
    DASHBOARD: "Dashboard",
    MARKETS: "Markets",
    ALERT: "Alerts",
    FUND_TRANSFER: "Limit/Fund Transfer",
    REPORTS: "Reports",
    SETTINGS: "Settings",
    MUTUAL_FUNDS: "Mutual Funds",
    IPO_NCD: "IPO / NCDs",
    SCANNERS: "Scanners",
    EDIS: "EDIS",
    PLEDGE: "Pledge",
    HELP_SUPPORT: "Help & Support",
    RATING_AND_FEEDBACK: "Rating & Feedback",
    FAQ: "FAQ",
    BO: "BO",
    LAS: "Loan Against Securities",
    DEMO: "DEMO",
    OFS: "Offer For Sale",
    NEWS: "News",
    US_STOCKS: "US Investments",
    OTHER_PRODUCTS: "Other Products",
    BONDS: "Bonds",
    THEMATICS: "Thematics",
    RESEARCH: "Research",
    IDEAS: "Ideas",
    LOG_OUT: "Log Out",
    MY_PROFILE: "My Profile"

}

// export const OTHER_PRODUCTS_LIST = [
//     {
//         name: APP_MENUS.LAS, [LANG_TEXT_KEY]: "LAS", iconText2: "J", path: null,
//         innerAction: true, guest_enable: false
//     },
//     {
//         name: APP_MENUS.BONDS, [LANG_TEXT_KEY]: "BONDS", iconText2: "b", path: null,
//         innerAction: true, guest_enable: false
//     },
//     {
//         name: APP_MENUS.THEMATICS, [LANG_TEXT_KEY]: "THEMATICS", iconText2: "c", path: null,
//         innerAction: true, guest_enable: false
//     },
//     {
//         name: APP_MENUS.RESEARCH, [LANG_TEXT_KEY]: "RESEARCH", iconText2: "d", path: null,
//         innerAction: true, guest_enable: false
//     },
//     {
//         name: APP_MENUS.US_STOCKS, [LANG_TEXT_KEY]: "US_STOCKS", iconText2: "Z", path: null,
//         innerAction: true, guest_enable: false
//     },
// ]

export const APP_MENU_LIST = [
    {
        name: APP_MENUS.DASHBOARD, [LANG_TEXT_KEY]: "DASHBOARD", iconText: "u", path: SCREENS.DASHBOARD,
        innerAction: false, guest_enable: true
    },
    {
        name: APP_MENUS.ALERT, [LANG_TEXT_KEY]: "ALERT", iconText: "w", path: SCREENS.ALERTS, innerAction: false,
        guest_enable: false
    },
    {
        name: APP_MENUS.FUND_TRANSFER, [LANG_TEXT_KEY]: "FUND_TRANSFER", iconText: "x", path: SCREENS.FUNDS,
        innerAction: false, guest_enable: false
    },
    {
        name: APP_MENUS.EDIS, [LANG_TEXT_KEY]: "EDIS", iconText: "3", path: null, innerAction: true,
        guest_enable: false
    },
    {
        name: APP_MENUS.PLEDGE, [LANG_TEXT_KEY]: "PLEDGE", iconText: "4", path: null, innerAction: true,
        guest_enable: false
    },
    {
        name: APP_MENUS.IDEAS, [LANG_TEXT_KEY]: "IDEAS", iconText2: "e", path: SCREENS.DASHBOARD, innerAction: false,
        guest_enable: false
    },
    {
        name: APP_MENUS.IPO_NCD, [LANG_TEXT_KEY]: "IPO_NCD", iconText: "2", path: SCREENS.IPO, innerAction: false,
        guest_enable: false
    },

    // { name: APP_MENUS.IPO, [LANG_TEXT_KEY]: "IPO", iconText: "2", path: SCREENS.IPO, innerAction: false ,
    //     guest_enable: false},
    {
        name: APP_MENUS.MARKETS, [LANG_TEXT_KEY]: "MARKETS", iconText: "v", path: SCREENS.DASHBOARD, innerAction: false,
        guest_enable: true
    },
    {
        name: APP_MENUS.BO, [LANG_TEXT_KEY]: "REPORT_BO", iconText: "y", path: SCREENS.BO, innerAction: false,
        guest_enable: false
    },

    // { name: APP_MENUS.REPORTS, [LANG_TEXT_KEY]: "REPORTS", iconText: "y", path: null, innerAction: true,
    //     guest_enable: false },
    // { name: APP_MENUS.MUTUAL_FUNDS, [LANG_TEXT_KEY]: "MUTUAL_FUNDS", iconText: "1", path: null, innerAction: true },
    // {
    //     name: APP_MENUS.OTHER_PRODUCTS, [LANG_TEXT_KEY]: "OTHER_PRODUCTS", iconText2: "a", path: null,
    //     innerAction: true, downArrow: true, subList: OTHER_PRODUCTS_LIST, guest_enable: false
    // },
    // {
    //     name: APP_MENUS.AVAIL_LOAN, [LANG_TEXT_KEY]: "AVAIL_LOAN", iconText2: "A", path:null,
    //     innerAction: false
    // },
    {
        name: APP_MENUS.LAS, [LANG_TEXT_KEY]: "LAS", iconText2: "J", path: null,
        innerAction: true, guest_enable: false
    },

    {
        name: APP_MENUS.NEWS, [LANG_TEXT_KEY]: "NEWS", iconText: "-", path: SCREENS.DASHBOARD, innerAction: false,
        guest_enable: true
    },
    {
        name: APP_MENUS.SCANNERS, [LANG_TEXT_KEY]: "SCANNERS", iconText: "+", path: SCREENS.DASHBOARD,
        innerAction: false, guest_enable: false
    },
    // { name: APP_MENUS.OFS, [LANG_TEXT_KEY]: "OFS", iconText: "~", path: SCREENS.OFS, innerAction: false, 
    //     guest_enable: false }
    // { name: APP_MENUS.HELP_SUPPORT, [LANG_TEXT_KEY]: "HELP_SUPPORT", iconText: "5", path: null, innerAction: true, 
    //     guest_enable: true },
    // { name: APP_MENUS.FAQ, [LANG_TEXT_KEY]: "FAQ", iconText: "6", path: null, innerAction: true },
    // { name: APP_MENUS.DEMO, [LANG_TEXT_KEY]: "DEMO", iconText: "|",path: null, innerAction: false,
    //     guest_enable: false },
    // { name: APP_MENUS.SETTINGS, [LANG_TEXT_KEY]: "SETTINGS", iconText: "z", path: null, innerAction: true,
    //     guest_enable: true },
]

export const ACCOUNT_MENU_LIST = [
    {
        name: APP_MENUS.MY_PROFILE, [LANG_TEXT_KEY]: "MY_PROFILE", iconText: "A", path: null, innerAction: true,
        guest_enable: true
    },
    {
        name: APP_MENUS.HELP_SUPPORT, [LANG_TEXT_KEY]: "HELP_SUPPORT", iconText: "5", path: null, innerAction: true,
        guest_enable: true
    },
    {
        name: APP_MENUS.SETTINGS, [LANG_TEXT_KEY]: "SETTINGS", iconText: "z", path: null, innerAction: true,
        guest_enable: true
    },
    {
        name: APP_MENUS.RATING_AND_FEEDBACK, [LANG_TEXT_KEY]: "RATING_AND_FEEDBACK", iconText: "r", path: null, innerAction: true,
        guest_enable: true
    },
    // { name: APP_MENUS.DEMO, [LANG_TEXT_KEY]: "DEMO", iconText: "|",path: null, innerAction: false,
    //     guest_enable: false },
    {
        name: APP_MENUS.LOG_OUT, [LANG_TEXT_KEY]: "LOG_OUT", iconText: "n", path: null, innerAction: true,
        guest_enable: true
    },
]

export const ACCOUNT_MENU_LIST_GUEST = [
    // { name: APP_MENUS.MY_PROFILE, [LANG_TEXT_KEY]: "MY_PROFILE", iconText: "A", path: null, innerAction: true, 
    //     guest_enable: true },
    {
        name: APP_MENUS.HELP_SUPPORT, [LANG_TEXT_KEY]: "HELP_SUPPORT", iconText: "5", path: null, innerAction: true,
        guest_enable: true
    },
    {
        name: APP_MENUS.SETTINGS, [LANG_TEXT_KEY]: "SETTINGS", iconText: "z", path: null, innerAction: true,
        guest_enable: true
    },
    {
        name: APP_MENUS.RATING_AND_FEEDBACK, [LANG_TEXT_KEY]: "RATING_AND_FEEDBACK", iconText: "r", path: null, innerAction: true,
        guest_enable: true
    },

    // { name: APP_MENUS.DEMO, [LANG_TEXT_KEY]: "DEMO", iconText: "|",path: null, innerAction: false,
    //     guest_enable: false },
    {
        name: APP_MENUS.LOG_OUT, [LANG_TEXT_KEY]: "LOG_OUT", iconText: "n", path: null, innerAction: true,
        guest_enable: true
    },
]

export const WATCHLIST_COLUMNLIST = [
    { name: Columns.LTP, key: "ltp", langKey: "LTP", selected: true },
    { name: Columns.CHANGE, key: "chng", langKey: "CHG", selected: true },
    { name: Columns.CHANGE_PER, key: "chngPer", langKey: "CHG_PER", selected: true },
    { name: Columns.OPEN, key: "open", langKey: "OPEN_PRICE", selected: true },
    { name: Columns.CLOSE, key: "close", langKey: "CLOSE_PRICE", selected: true },
    { name: Columns.HIGH, key: "high", langKey: "HIGH", selected: true },
    { name: Columns.LOW, key: "low", langKey: "LOW", selected: true },
    { name: Columns.LTQ, key: "ltq", langKey: "LTQ", selected: true },
    { name: Columns.OI, key: "OI", langKey: "OI", selected: false },
    { name: Columns.OI_CHNG_PER, key: "OIChngPer", langKey: "OI_CHNG_PER", selected: false },
    { name: Columns.VOL, key: "vol", langKey: "VOL", selected: false },
    { name: Columns.WKH, key: "yHigh", langKey: "WKH", selected: false },
    { name: Columns.WKL, key: "yLow", langKey: "WKL", selected: false },
    { name: Columns.LTT, key: "ltt", langKey: "LTT", selected: false, className: "width12" }
]

export const ASSET_MENU = {
    EQUITY: "EQUITY",
    CURRENCY: "CURRENCY",
    COMMODITY: "COMMODITY"
}

export const ASSET_MENU_ARRAY = [
    { 'name': ASSET_MENU.EQUITY, 'langKey': ASSET_MENU.EQUITY },
    { 'name': ASSET_MENU.COMMODITY, 'langKey': ASSET_MENU.COMMODITY },
    { 'name': ASSET_MENU.CURRENCY, 'langKey': ASSET_MENU.CURRENCY }
]

export const PROFILE_POA_STATUS = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE"
}

export const SEGMENTS = {
    CASH: "CASH",
    FUTURE: "FUTURE",
    OPTION: "OPTION"
}

export const SEGMENT_ARRAY = [
    { 'name': SEGMENTS.CASH, 'langKey': SEGMENTS.CASH },
    { 'name': SEGMENTS.FUTURE, 'langKey': SEGMENTS.FUTURE },
    { 'name': SEGMENTS.OPTION, 'langKey': SEGMENTS.OPTION }
]

export const HEADER_PROFILE = {
    PROFILE_PAGE: 'PROFILE_PAGE',
    IMAGE_UPLAOD: 'IMAGE_UPLOAD'
}

export const HEADER_SETTINGS = {
    SETTINGS_BASE: 'SETTINGS_BASE',
    PASSWORD_SETTINGS: 'PASSWORD_SETTINGS',
    NOTIFICATION_SETTINGS: 'NOTIFICATION_SETTINGS',
    THEME_SETTINGS: 'THEME_SETTINGS',
    STREAMING_ON_OFF: 'STREAMING_ON_OFF',
    LANGUAGE_SETTINGS: 'LANGUAGE_SETTINGS',
    PREFERENCE_SETTINGS: 'PREFERENCE_SETTINGS',
}

export const RATING_FEEDBACK = {
    RATING_BASE: 'RATING_BASE',
    RATING_FEEDBACK_HEADING: "RATING_&_FEEDBACK",
    IMPROVED: "WHAT_CAN_BE_IMPROVED",
    COMMENT_SUGGESTION: "COMMENT_SUGGESTION",
    TEXT_CONTENT: "TEXT_CONTENT",
    UPLOAD_IN_COMMENT: "UPLOAD",
    PIC_EXTENSION: "PIC_EXTENSION",
    CHAR: "150_CHARACTER",
    FEEDBACK_CONFIRM: "FEEDBACK_CONFIRM",
    VALUABLE: "VALUABLE",
    IMPROVE_SERVICE: "IMPROVE_SERVICE",
    SUCCESS_MSG: "SUCCESS",

    BAD_MSGS: {
        BAD_MSG1: "APP_WORK",
        BAD_MSG2: "ISSUE_NOT_SOLVED",
        BAD_MSG3: "HOLDING_ISSUE",
        BAD_MSG4: "WITHDRAWAL_ISSUE",
        BAD_MSG5: "INVESTMENT_ADVICE",
    },

    AVERAGE_MSGS: {
        AVERAGE_MSG: "AVERAGE_MSG",
        AVERAGE_MSG1: "APP_SLOWS/LAGS",
        AVERAGE_MSG2: "BETTER_FEATURES",
        AVERAGE_MSG3: "QUERIES",
        AVERAGE_MSG4: "BETTER_OPTION_TRADING",
    },
    GOOD_MSGS: {
        GOOD_MSG: "AWESOME_MSG",
        GOOD_MSG1: "HAPPY_OVERALL_SERVICE",
        GOOD_MSG2: "FAST_SMOOTH_APP",
        GOOD_MSG3: "GREAT_STOCKS",
        GOOD_MSG4: "PORTFOLIO_BLOOMING",
    },

}

export const FUND_RATING_FEEDBACK = {
    ADD_FUND: "ADD_FUND",
    NO_DISAPPOINTED: "NO_DISAPPOINTED",
    IT_WAS_OK: "IT_WAS_OK",
    SUPER_FAST: "SUPER_FAST",
    FUND_BAD_MSG1: "FUND_BAD_MSG1",
    FUND_BAD_MSG2: "FUND_BAD_MSG2:",
    FUND_BAD_MSG3: "FUND_BAD_MSG3:",
    FUND_BAD_MSG4: "FUND_BAD_MSG4",
    FUND_CMNT_TEXT: "FUND_CMNT_TEXT",
    FOLLOW_UP: "FOLLOW_UP",
    IMPROVE_EXPERIENCE: "IMPROVE_EXPERIENCE",
    HOME: "HOME",
    FUND_AVERAGE_MSG1: "FUND_AVERAGE_MSG1",
    FUND_AVERAGE_MSG2: "FUND_AVERAGE_MSG2",
    FUND_AVERAGE_MSG3: "FUND_AVERAGE_MSG3",
    FUND_AVERAGE_MSG4: "FUND_AVERAGE_MSG4",
    FUND_INVALUABLE_FEEDBACK: "FUND_INVALUABLE_FEEDBACK",
    FUND_IMPROVE_EXPERIENCE: "FUND_IMPROVE_EXPERIENCE",
    FUND_HOME: "FUND_HOME",
    FUND_GOOD_MSG1: "FUND_GOOD_MSG1",
    FUND_GOOD_MSG2: "FUND_GOOD_MSG2",
    FUND_GOOD_MSG3: "FUND_GOOD_MSG3",
    CMNT_TXT_GOOD: "CMNT_TXT_GOOD",
    THANKS_FOR_GOOD: "THANKS_FOR_GOOD",
    LET_THE_WORLD: "LET_THE_WORLD",
    RATE_US_PLAYSTORE: "RATE_US_PLAYSTORE",
    ILL_DO_LATER: "ILL_DO_LATER"




}

export const IPO_MENUS = {
    OPEN_IPO: "OPEN IPO",
    UPCOMING_IPO: "UPCOMING IPO",
    CLOSED_IPO: "CLOSED IPO",
    ORDERBOOK: "ORDERBOOK",
    ORDER_HISTORY: "ORDER HISTORY"
}

export const IPO_MENU_ARRAY = [
    { name: IPO_MENUS.OPEN_IPO, langKey: "OPEN_IPO" },
    { name: IPO_MENUS.UPCOMING_IPO, langKey: "UPCOMING_IPO" },
    { name: IPO_MENUS.CLOSED_IPO, langKey: "CLOSED_IPO" },
    { name: IPO_MENUS.ORDERBOOK, langKey: "ORDERBOOK" },
    { name: IPO_MENUS.ORDER_HISTORY, langKey: "ORDER_HISTORY" }
]

export const IPO_ORDER_STATUS = {
    SUCCESS: "SUCCESS",
    PENDING: "PENDING",
    CANCELLED: "CANCELLED"
}

export const AVAIL_LOAN_MENUS = {
    DISBURSEMENT: "DISBURSEMENT",
    REPAYMENT: "REPAYMENT",
    RELEASE_SHARE_REQUEST: "RELEASE SHARE REQUEST",
    ADDITIONAL_SHARE_PLEDGE: "ADDITIONAL SHARE PLEDGE",
    STATEMENT: "STATEMENT"
}
export const AVAIL_LOAN_MENU_ARRAY = [
    { name: AVAIL_LOAN_MENUS.DISBURSEMENT, langKey: "DISBURSEMENT" },
    { name: AVAIL_LOAN_MENUS.REPAYMENT, langKey: "REPAYMENT" },
    { name: AVAIL_LOAN_MENUS.RELEASE_SHARE_REQUEST, langKey: "RELEASE_SHARE_REQUEST" },
    { name: AVAIL_LOAN_MENUS.ADDITIONAL_SHARE_PLEDGE, langKey: "ADDITIONAL_SHARE_PLEDGE" },
    { name: AVAIL_LOAN_MENUS.STATEMENT, langKey: "STATEMENT" }
]
export const AVAIL_LOAN_GET_LOAN_DETAILS = [
    { key: "lan", langKey: "LOAN_ACCOUNT_NUMBER" },
    { key: "lnAmnt", langKey: "LOAN_AMOUNT" },
    { key: "sacntnAmt", langKey: "SANCTIONED_LIMIT" },
    { key: "ltv", langKey: "LOAN_TO_VALUE" },
    { key: "dtv", langKey: "DP_TO_LOAN" },
    { key: "roi", langKey: "ANNUAL_RATE_OF_INTEREST" },
    { key: "penalInt", langKey: "OUTSTANDING_INTEREST" },
    { key: "excessMargn", langKey: "OUTSTANDING_CHARGES" },
    { key: "dueDate", langKey: "INTEREST_DUE_DATE" },
]
export const AVAIL_LOAN_GET_HOLDINGS = [
    { key: "sacntnAmt", langKey: "SANCTION_LIMIT" },
    { key: "lnAmnt", langKey: "UTILIZED_LIMIT" },
    { key: "pldVal", langKey: "SHARES_PLEDGED" },
    { key: "shrtFll", langKey: "SHORT_FALL" },
    { key: "dpPwr", langKey: "DRAWING_POWER" },
    { key: "avlDrwAmt", langKey: "AVAILABLE_LIMIT" },

]
export const AVAIL_LOAN_UNPLEDGE_SHARE = [
    { key: "scrpNme", langKey: "SYMBOL" },
    { key: "lnVlue", langKey: "LOAN_VALUE" },
    { key: "totalQuant", langKey: "SHARES_PLEDGE" },
    { key: "qty", langKey: "UNPLEDGED_SHARES" },
    { key: "prc", langKey: "VALUE" },
    { key: "pldVal", langKey: "PLEDGED_VALUES" },

]
// export const AVAIL_LOAN_STATEMENT_LIST = [
//     { key: "", langKey: "SYMBOL" },
//     { key: "", langKey: "LOAN_VALUE" },
//     { key: "", langKey: "" },
//     { key: "", langKey: "" },
//     { key: "", langKey: "" },
//     { key: "", langKey: "" },

// ]
export const LAS_MENUS = {
    LOAN_AGAINST_SECURITI: "Loan Against Securities",
    CONFIRM_KYC: "Confirm your KYC",
    TERMS: "Terms & Conditions",
    LOAN_DETAILS: "Loan Amount & Details",
    E_AGREEMENT: "E-Agreement",
    E_MANDATE: "E-Mandate",
    E_PLEDGE: "E-Pledge"
}
export const LAS_USER_STAGE = {
    IS_NEW: "IS_NEW",
    CHECK_ELIGIBITY: "CHECK_ELIGIBITY",
    EKYC_FINISHED: "EKYC_FINISHED",
    LOAN_APPROVED: "LOAN APPROVED",
    E_ARGREEMENT_ACCEPTED: "E-ARGREEMENT ACCEPTED",
    E_MANDATE_FINISHED: "E-MANDATE FINISHED",
    LOAN_REQUEST_CREATED: "LOAN REQUEST CREATED",
    LOAN_PENDING: "LOAN PENDING",
    MANDATE_REJECTED: "E-MANDATE REJECTED",
    E_PLEDGE_COMPLETED: "PLEDGE_COMPLETE",
    LAS_TICKET_PENDING: "LAS TICKET PENDING",
    LAS_TICKET_CREATED: "LAS TICKET CREATED",
    LAS_TICKET_CALL_OFF: "LAS TICKET CALL OFF",
    SERVICE_JOURNEY: "SERVICE JOURNEY",
    EARGREEMENT_PENDING: "E-ARGREEMENT PENDING",
    E_MANDATE_PENDING: "E-MANDATE PENDING"

}

export const LAS_MENU_ARRAY = [
    {
        name: LAS_MENUS.LOAN_AGAINST_SECURITI,
        langKey: "LOAN_AGAINST_SECURITI",
        stageName: ["IS_NEW"],
        isPreStage: true
    },
    {
        name: LAS_MENUS.CONFIRM_KYC,
        langKey: "CONFIRM_STG",
        stageName: ["CHECK_ELIGIBITY", "LAS TICKET CALL OFF"],
        stageIndex: 2
    },
    {
        name: LAS_MENUS.LOAN_DETAILS, langKey: "LOAN_AMOUNT",
        stageName: ["EKYC_FINISHED", "LOAN REQUEST CREATED", "LOAN PENDING"],
        stageIndex: 3
    },
    {
        name: LAS_MENUS.E_AGREEMENT, langKey: "E_AGREE_STG", stageName: ["LOAN APPROVED", "E-ARGREEMENT PENDING"],
        stageIndex: 4
    },
    {
        name: LAS_MENUS.E_MANDATE, langKey: "E_MANDATE_STG", stageName: ["E-ARGREEMENT ACCEPTED", "E-MANDATE PENDING"],
        stageIndex: 5
    },
    {
        name: LAS_MENUS.E_PLEDGE, langKey: "E_PLEDGE_STG",
        stageName: ["E-MANDATE FINISHED", "RECHECK ELIGIBLITY", "PLEDGE_ONPROGRESS", "PLEDGE_COMPLETE"],
        stageIndex: 6
    },
    {
        name: "Loan Disbursement", langKey: "DISBURSEMENT",
        stageName: [],
        stageIndex: 7
    }
]

export const LOAN_STATUS_LAS_MENU = {
    name: "Loan Status", langKey: "LOAN_STATUS", stageIndex: 1
}
// export const MARKETSMITH_MENUS = {
//     SUBSCRIPTION_PLAN:"Subscription Plan",
//     SELECT_SUBSCRIPTION:"Select Subscription Plan",
//     CHOOSE_TENURE:"Choose Tenure",

// }
export const BUTTONS_CONST = CONSTANTS.BUTTONS
export const ORDERPAD_CONSTANTS = english.ORDERPAD

const NetColumns = CONSTANTS.ORDERS.NET_POSITION.NET_POSITION_COLUMNS
// const NetDetailColumns = CONSTANTS.ORDERS.NET_POSITION.POSITION_DETAIL_COLUMNS
const orderColumn = CONSTANTS.ORDERS.ORDER_BOOK.ORDER_BOOK_COLUMNS
// const ordDetailColumns = CONSTANTS.ORDERS.ORDER_BOOK.ORDER_DETAIL_COLUMN
// const orderBoTrigColumns = CONSTANTS.ORDERS.ORDER_BOOK.BO_ORD_TRIG_COLUMN
// const orderBoTargColumns = CONSTANTS.ORDERS.ORDER_BOOK.BO_ORD_TARG_COLUMN
// const orderBoCoColumns = CONSTANTS.ORDERS.ORDER_BOOK.BO_CO_ORD_COLUMN
// const orderCoTrigColumns = CONSTANTS.ORDERS.ORDER_BOOK.CO_ORD_TRIG_COLUMN
// const ordTrailColumn = CONSTANTS.ORDERS.ORDER_BOOK.ORDER_TRAIL_COLUMNS
const trdBookColumns = CONSTANTS.ORDERS.TRADE_BOOK.TRADE_BOOK_COLUMNS
// const trdSumColums = CONSTANTS.ORDERS.TRADE_BOOK.TRADE_SUMMARY_COLUMNS
const holdingsColumns = CONSTANTS.HOLDINGS.HOLDINGS_COLUMNS

export const CONFIRM_ORDER_COLUMNS = [
    // { name: ORDERPAD_CONSTANTS.BASE_SYMBOL, key: ORDERPAD_FIIELD_KEYS.SYMBOL, langKey: "BASE_SYMBOL" },
    // { name: ORDERPAD_CONSTANTS.SYMBOL_NAME, key: ORDERPAD_FIIELD_KEYS.DIS_SYMBOL, langKey: "SYMBOL_NAME" },
    // { name: ORDERPAD_CONSTANTS.EXC, key: ORDERPAD_FIIELD_KEYS.EXC, langKey: "EXC" },
    // { name: ORDERPAD_CONSTANTS.ACTION, key: ORDERPAD_FIIELD_KEYS.ACTION, langKey: "ACTION" },
    { name: ORDERPAD_CONSTANTS.ORDER_TYPE, key: ORDERPAD_FIIELD_KEYS.ORDER_TYPE, langKey: "ORDER_TYPE" },
    { name: ORDERPAD_CONSTANTS.PRODUCT_TYPE, key: ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE, langKey: "PRODUCT_TYPE" },
    { name: ORDERPAD_CONSTANTS.VALIDITY, key: ORDERPAD_FIIELD_KEYS.VALIDITY, langKey: "VALIDITY" },
    { name: ORDERPAD_CONSTANTS.QUANTITY, key: ORDERPAD_FIIELD_KEYS.QUANTITY, langKey: "QUANTITY" },
    { name: ORDERPAD_CONSTANTS.PRICE, key: ORDERPAD_FIIELD_KEYS.PRICE, langKey: "PRICE" },
    { name: ORDERPAD_CONSTANTS.DISCLOSED_QTY, key: ORDERPAD_FIIELD_KEYS.DIS_QTY, langKey: "DISCLOSED_QTY" },
    // { name: ORDERPAD_CONSTANTS.ORDER_VALUE, key: ORDERPAD_FIIELD_KEYS.ORDER_VALUE, langKey: "ORDER_VALUE" },
    { name: ORDERPAD_CONSTANTS.TRIGGER_PRICE, key: ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE, langKey: "TRIGGER_PRICE" },
    { name: ORDERPAD_CONSTANTS.SQUARE_OFF_SELL, key: ORDERPAD_FIIELD_KEYS.SQUARE_OFF, langKey: "SQUARE_OFF_SELL" },
    { name: ORDERPAD_CONSTANTS.STOP_LOSS_SELL, key: ORDERPAD_FIIELD_KEYS.STOP_LOSS, langKey: "STOP_LOSS_SELL" },
    {
        name: ORDERPAD_CONSTANTS.TRAILING_STOPLOSS_VAL, key: ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS,
        langKey: "TRAILING_STOPLOSS_VAL"
    },
    {
        name: ORDERPAD_CONSTANTS.MARKET_PROTECTION, key: ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION,
        langKey: "MARKET_PROTECTION_MANDATORY"
    },
]

CONSTANTS.ORDERS.NET_POSITION.NET_POSITION_COLUMNLIST = [
    { name: NetColumns.symbol, key: "dispSym", type: "string" },
    { name: NetColumns.pal, key: "pnl", type: "int", className: "width5" },
    { name: NetColumns.mtm, key: "mtm", type: "int", className: "width5" },
    { name: NetColumns.netQty, key: "netQty", type: "int", className: "width5" },
    { name: NetColumns.avgPrice, key: "avgPrice", type: "int", className: "width5" },
    { name: NetColumns.ltp, key: "ltp", type: "int", className: "width5" },
    { name: NetColumns.chg, key: "chng", type: "int", className: "width5" },
    { name: NetColumns.chgPer, key: "chngPer", type: "int", className: "width5" },
    { name: NetColumns.productType, key: "prdType", type: "string", className: "width7" }
]

CONSTANTS.ORDERS.ORDER_BOOK.ORDER_BOOK_COLUMNLIST = [
    { name: orderColumn.symbol, key: 'dispSym', type: "string", className: "" },
    { name: orderColumn.action, key: 'ordAction', type: "string", className: "width3" },
    { name: orderColumn.ordType, key: 'ordType', type: "string", className: "width4d3" },
    { name: orderColumn.ordType, key: 'prdType', type: "string", className: "width4d3" },
    { name: orderColumn.price, key: 'limitPrice', type: "int", className: "width4" },
    { name: orderColumn.penQty, key: 'remainQty', type: "int", className: "width4d7" },
    { name: orderColumn.totQty, key: 'qty', type: "int", className: "width4" },
    { name: orderColumn.intOrdNo, key: 'ordId', type: "int", className: "width7" },
    { name: orderColumn.intOrdTime, key: 'ordDate', type: "date", className: "width6" },
    { name: orderColumn.trigPri, key: 'triggerPrice', type: "int", className: "width5" },
    { name: orderColumn.status, key: 'status', type: "string", className: "width5" },
]

CONSTANTS.ORDERS.TRADE_BOOK.TRADE_BOOK_COLUMNLIST = [
    { name: trdBookColumns.symbol, key: "dispSym", type: "string", className: "width7" },
    { name: trdBookColumns.action, key: "ordAction", type: "string", className: "width3" },
    { name: trdBookColumns.ordId, key: "ordId", type: "int", className: "width7" },
    { name: trdBookColumns.qty, key: "qty", type: "int", className: "width4" },
    { name: trdBookColumns.avgPrice, key: "tradedPrice", type: "int", className: "width4" },
    { name: trdBookColumns.trades, key: "tradedQty", type: "int", className: "width4" },
    { name: trdBookColumns.prodType, key: "prdType", type: "string", className: "width5" },
    { name: trdBookColumns.tradeId, key: "exchTrdId", type: "int", className: "width5" },
    { name: trdBookColumns.exchOrdId, key: "exchOrdId", type: "bigInt", className: "width8" },
    { name: trdBookColumns.exchOrdTime, key: "tradeTime", type: "date", className: "width8" }
]

// CONSTANTS.ORDERS.TRADE_BOOK.TRADE_SUMMARY_COLUMNLIST = [
//     { name: trdSumColums.ordId, key: "ordId" }, { name: trdSumColums.action, key: "action" },
//     { name: trdSumColums.qty, key: "qty" }, { name: trdSumColums.price, key: "price" },
//     { name: trdSumColums.prodType, key: "prodType" }, { name: trdSumColums.prodType, key: "prodType" }
// ]

CONSTANTS.HOLDINGS.HOLDINGS_COLUMNLIST = [
    { name: holdingsColumns.symbol, key: "dispSym", type: "string", className: "" },
    { name: holdingsColumns.qty, key: "qty", type: "int", className: "width5" },
    { name: holdingsColumns.buyAvg, key: "avgPrice", type: "int", className: "width5" },
    { name: holdingsColumns.buyVal, key: "buyValue", type: "int", className: "width5" },
    { name: holdingsColumns.prevClose, key: "prevClose", type: "int", className: "width5" },
    { name: holdingsColumns.ltp, key: "ltp", type: "int", className: "width5" },
    { name: holdingsColumns.presVal, key: "presValue", type: "int", className: "width6" },
    { name: holdingsColumns.totPal, key: "pnl", type: "int", className: "width5" },
    { name: holdingsColumns.totPalPer, key: "pnlPer", type: "int", className: "width5" },
    { name: holdingsColumns.daysPal, key: "daysPnl", type: "int", className: "width5" },
]

export const ORDERS_MENU = CONSTANTS.ORDERS.ORDERS_MENUS
export const ORDER_BOOK_CONST = CONSTANTS.ORDERS.ORDER_BOOK
export const TRADE_BOOK_CONST = CONSTANTS.ORDERS.TRADE_BOOK
export const NET_POSITION_CONST = CONSTANTS.ORDERS.NET_POSITION
export const ORDERS_CONSTANT = CONSTANTS.ORDERS
export const HOLDINGS_CONSTANT = CONSTANTS.HOLDINGS

export const ADD_FUNDS_MODE_OPTIONS = {
    NET_BANKING: 'NETBANKING',
    UPI: 'UPI',
    ECOLLECT: "ECollect",
    ECOLLECT_TWO: "E-Collect",
    PG: "PG"
}

export const FUNDS_SEGMENT_API_KEYS = {
    BOTH: "BOTH",
    CASH: "CASH",
    FO: "FO"
}

// export const CHART_WIDGET_MENUS = english.CHART_WIDGET_MENUS
// export const CHART_WIDGET_MENUS_GUEST = english.CHART_WIDGET_MENUS_GUEST
//export const INDICES_WIDGET_MENUS = english.INDICES_WIDGET_MENUS
// export const INDICES_WIDGET_MENUS_GUEST = english.INDICES_WIDGET_MENUS_GUEST
//export const MARKET_BASE_WIDGET_MENUS = english.MARKET_BASE_WIDGET_MENUS
//export const EQUITY_MENU = english.MARKET_EQUITY_MENU_ARRAY

export const DERIVATIVE_MENU = english.MARKET_DERIVATIVE_MENU_ARRAY
export const DERIVATIVE_MENU_GUEST = english.MARKET_DERIVATIVE_MENU_ARRAY_GUEST
export const GLOBAL_INDICES_MENU = english.MARKET_GLOBAL_INDICES_MENU_ARRAY
export const GLOBAL_INDICES_MENU_GUEST = english.MARKET_GLOBAL_INDICES_MENU_ARRAY_GUEST
export const NET_POSITION_FILTERS = english.NET_POSITION_FILTERS

export const INDICES_WIDGET_MENUS_GUEST = {
    CHART: "CHART & OVERVIEW",
    NEWS: "NEWS",
    CONTRIBUTORS: "CONTRIBUTORS",
    CONSTITUENTS: "CONSTITUENTS",
    FUTURES: "FUTURE",
    OPTIONS: "OPTIONS",
}
export const CHART_WIDGET_MENUS_GUEST = {
    CHART: "CHART",
    NEWS: "NEWS",
    FUTURES: "FUTURE",
    OPTIONS: "OPTIONS",
    COMPANY: "COMPANY INFO",
    CHART_OVERVIEW: "CHART & OVERVIEW"
}
export const EQUITY_MENU_GUEST = {
    FT_WEEK_HIGH: '52 week High',
    FT_WEEK_LOW: '52 week Low',
    ACTIVE_VOLUME: 'Active Volume',
    ACTIVE_VALUE: 'Active Value',
}
export const INDICES_WIDGET_MENUS = {
    CHART: "CHART & OVERVIEW",
    NEWS: "NEWS",
    CONTRIBUTORS: "CONTRIBUTORS",
    CONSTITUENTS: "CONSTITUENTS",
    FUTURES: "FUTURE",
    OPTIONS: "OPTIONS",

}
export const MARKET_BASE_WIDGET_MENUS = {
    EQUITY: "Equity",
    DERIVATIVE: "Derivative",
    SECTOR_WATCH: "Sector Watch",
    GLOBAL_INDICES: "Global Indices"
}

export const EQUITY_MENU = {
    TOP_GAINERS: "Top Gainers",
    TOP_LOSERS: "Top Losers",
    FT_WEEK_HIGH: '52 week High',
    FT_WEEK_LOW: '52 week Low',
    ACTIVE_VOLUME: 'Active Volume',
    ACTIVE_VALUE: 'Active Value',
    BULK_DEALS: 'Bulk Deals',
    BLOCK_DEALS: 'Block Deals',
    FII_DII_ACTIVITY: 'FII DII ACTIVITY',
    IPO_PERFORMANCE: 'IPO PERFORMANCE'

}
export const CHART_WIDGET_MENUS = {
    CHART: "CHART",
    NEWS: "NEWS",
    FUTURES: "FUTURE",
    OPTIONS: "OPTIONS",
    FINANCIALS: "FINANCIALS",
    COMPANY: "COMPANY INFO",
    CHART_OVERVIEW: "CHART & OVERVIEW"
}

export const CHART_WIDGET_MENU_CONST = [
    { name: CHART_WIDGET_MENUS.CHART, [LANG_TEXT_KEY]: "CHART_HEAD" },
    { name: CHART_WIDGET_MENUS.NEWS, [LANG_TEXT_KEY]: "NEWS_HEADS" },
    { name: CHART_WIDGET_MENUS.FUTURES, [LANG_TEXT_KEY]: "FUTURES_HEAD" },
    { name: CHART_WIDGET_MENUS.OPTIONS, [LANG_TEXT_KEY]: "OPTIONS_HEAD" },
    { name: CHART_WIDGET_MENUS.FINANCIALS, [LANG_TEXT_KEY]: "FINANCIALS_HEAD" },
    { name: CHART_WIDGET_MENUS.COMPANY, [LANG_TEXT_KEY]: "COMPANY_HEAD" },
    // {  name:CHART_WIDGET_MENUS.CHART_OVERVIEW,[LANG_TEXT_KEY]: "CHART_OVERVIEW_HEAD"},
]

export const CHART_WIDGET_MENU_CONST_GUEST = [
    { name: CHART_WIDGET_MENUS_GUEST.CHART, [LANG_TEXT_KEY]: "CHART_HEAD" },
    { name: CHART_WIDGET_MENUS_GUEST.NEWS, [LANG_TEXT_KEY]: "NEWS_HEADS" },
    { name: CHART_WIDGET_MENUS_GUEST.FUTURES, [LANG_TEXT_KEY]: "FUTURES_HEAD" },
    { name: CHART_WIDGET_MENUS_GUEST.OPTIONS, [LANG_TEXT_KEY]: "OPTIONS_HEAD" },
    { name: CHART_WIDGET_MENUS_GUEST.COMPANY, [LANG_TEXT_KEY]: "COMPANY_HEAD" }
]

export const INDICES_WIDGET_MENU_CONST = [
    { name: INDICES_WIDGET_MENUS.CHART, [LANG_TEXT_KEY]: "CHART_OVERVIEWS" },
    { name: INDICES_WIDGET_MENUS.NEWS, [LANG_TEXT_KEY]: "NEWS" },
    { name: INDICES_WIDGET_MENUS.CONTRIBUTORS, [LANG_TEXT_KEY]: "CONTRIBUTORS" },
    { name: INDICES_WIDGET_MENUS.CONSTITUENTS, [LANG_TEXT_KEY]: "CONSTITUENTS" },
    { name: INDICES_WIDGET_MENUS.FUTURES, [LANG_TEXT_KEY]: "FUTURES" },
    { name: INDICES_WIDGET_MENUS.OPTIONS, [LANG_TEXT_KEY]: "OPTIONS" }
]
export const INDICES_WIDGET_MENU_CONST_GUEST = [
    { name: INDICES_WIDGET_MENUS_GUEST.CHART, [LANG_TEXT_KEY]: "CHART_OVERVIEWS" },
    { name: INDICES_WIDGET_MENUS_GUEST.NEWS, [LANG_TEXT_KEY]: "NEWS" },
    // { name: INDICES_WIDGET_MENUS_GUEST.CONTRIBUTORS, [LANG_TEXT_KEY]: "CONTRIBUTORS" },
    { name: INDICES_WIDGET_MENUS_GUEST.CONSTITUENTS, [LANG_TEXT_KEY]: "CONSTITUENTS" },
    { name: INDICES_WIDGET_MENUS_GUEST.FUTURES, [LANG_TEXT_KEY]: "FUTURES" },
    { name: INDICES_WIDGET_MENUS_GUEST.OPTIONS, [LANG_TEXT_KEY]: "OPTIONS" }
]
// export const INDICES_WIDGET_MENU_CONST_GUEST = [
//     {name:INDICES_WIDGET_MENUS.CHART,[LANG_TEXT_KEY]:"CHART_OVERVIEWS"},
//     {name:INDICES_WIDGET_MENUS.NEWS,[LANG_TEXT_KEY]:"NEWS"},
//     {name:INDICES_WIDGET_MENUS.CONSTITUENTS,[LANG_TEXT_KEY]:"CONSTITUENTS"},
//     {name:INDICES_WIDGET_MENUS.FUTURES,[LANG_TEXT_KEY]:"FUTURES"},
//     {name:INDICES_WIDGET_MENUS.OPTIONS,[LANG_TEXT_KEY]:"OPTIONS"}
// ]

export const MARKET_BASE_WIDGET_MENUS_CONST = [
    { name: MARKET_BASE_WIDGET_MENUS.EQUITY, [LANG_TEXT_KEY]: "EQUITY" },
    { name: MARKET_BASE_WIDGET_MENUS.DERIVATIVE, [LANG_TEXT_KEY]: "DERIVATIVE" },
    { name: MARKET_BASE_WIDGET_MENUS.SECTOR_WATCH, [LANG_TEXT_KEY]: "SECTOR_WATCH" },
    { name: MARKET_BASE_WIDGET_MENUS.GLOBAL_INDICES, [LANG_TEXT_KEY]: "GLOBAL_INDICES" }
]

export const MARKET_BASE_WIDGET_MENUS_CONST_GUEST = [
    { name: MARKET_BASE_WIDGET_MENUS.EQUITY, [LANG_TEXT_KEY]: "EQUITY" },
    { name: MARKET_BASE_WIDGET_MENUS.DERIVATIVE, [LANG_TEXT_KEY]: "DERIVATIVE" },
    { name: MARKET_BASE_WIDGET_MENUS.SECTOR_WATCH, [LANG_TEXT_KEY]: "SECTOR_WATCH" }
]

export const NET_POSITION_HEADER_FILTER_CONST = [
    NET_POSITION_FILTERS.ALL_POSTIONS,
    NET_POSITION_FILTERS.EQUITY,
    NET_POSITION_FILTERS.DERIVATIVE

]

export const MARKET_BASE_EQUITY_FILTER = [
    { [LANG_TEXT_KEY]: "DAILY", name: "DAILY", key: "daily", apiKey: "D" },
    { [LANG_TEXT_KEY]: "WEEKLY", name: "WEEKLY", key: "week", apiKey: "W" },
    { [LANG_TEXT_KEY]: "MONTHLY", name: "MONTHLY", key: "month", apiKey: "M" },
    { [LANG_TEXT_KEY]: "YEARLY", name: "YEARLY", key: "year", apiKey: "Y" },
]

export const MARKET_FII_DII_CATEGORYS = [
    { [LANG_TEXT_KEY]: "ALL_ACTIVITY", name: "All Activity", key: "all activity", apiKey: "ALL" },
    { [LANG_TEXT_KEY]: "FII_CASH", name: "FII Cash", key: "fii cash", apiKey: "FIICASH" },
    { [LANG_TEXT_KEY]: "DII_CASH", name: "DII Cash", key: "dii cash", apiKey: "DIICash" },
    { [LANG_TEXT_KEY]: "FII_FUTURE", name: "FII Future", key: "fii future", apiKey: "FIIFUT" },
    { [LANG_TEXT_KEY]: "FII_OPTION", name: "FII Option", key: "fii option", apiKey: "FIIOPT" }
]

export const DERIVATIVE_STOCK_INDEX_CATEGORIES = [
    { name: "STOCK OPTION", key: "stockOpt", langKey: "STOCK_OPT", apiKey: "stockOpt" },
    { name: "INDEX OPTION", key: "indexOpt", langKey: "INDEX_OPT", apiKey: "indexOpt" },
    { name: "STOCK FUTURE", key: "stockFut", langKey: "INDEX_FUT", apiKey: "stockFut" },
    { name: "INDEX FUTURE", key: "indexFut", langKey: "MOST_ACTIVEE", apiKey: "indexFut" },
]

export const MARKET_EQUITY_MENU_ARRAY_CONST = [
    {
        name: EQUITY_MENU.TOP_GAINERS, apiKey: "topGainers",
        key: "topGainers", [LANG_TEXT_KEY]: "TOP_GAINERS"
    },
    {
        name: EQUITY_MENU.TOP_LOSERS, apiKey: "topLosers",
        key: "topLosers", [LANG_TEXT_KEY]: "TOP_LOSERS"
    },
    {
        name: EQUITY_MENU.FT_WEEK_HIGH, apiKey: "yHigh",
        key: "yHigh", [LANG_TEXT_KEY]: "FT_WEEK_HIGH"
    },
    {
        name: EQUITY_MENU.FT_WEEK_LOW, apiKey: "yLow",
        key: "yLow", [LANG_TEXT_KEY]: "FT_WEEK_LOW"
    },
    {
        name: EQUITY_MENU.ACTIVE_VOLUME, apiKey: "activeVolume",
        key: "activeVolume", [LANG_TEXT_KEY]: "ACTIVE_VOLUME"
    },
    {
        name: EQUITY_MENU.ACTIVE_VALUE, apiKey: "activeValue",
        key: "activeValue", [LANG_TEXT_KEY]: "ACTIVE_VALUE"
    },
    {
        name: EQUITY_MENU.BULK_DEALS, apiKey: "bulk",
        key: "bulkDeals", [LANG_TEXT_KEY]: "BULK_DEALS"
    },
    {
        name: EQUITY_MENU.BLOCK_DEALS, apiKey: "block",
        key: "blockDeals", [LANG_TEXT_KEY]: "BLOCK_DEALS"
    },
    { name: EQUITY_MENU.FII_DII_ACTIVITY, key: "fiidii", [LANG_TEXT_KEY]: "FII_DII_ACTIVITY" },
    { name: EQUITY_MENU.IPO_PERFORMANCE, key: "ipoperf", [LANG_TEXT_KEY]: "IPO_PERFORMANCE" },

]

export const MARKET_EQUITY_MENU_ARRAY_CONST_GUEST = [
    {
        name: EQUITY_MENU_GUEST.FT_WEEK_HIGH, apiKey: "yHigh",
        key: "yHigh", [LANG_TEXT_KEY]: "FT_WEEK_HIGH",
    },
    {
        name: EQUITY_MENU_GUEST.FT_WEEK_LOW, apiKey: "yLow",
        key: "yLow", [LANG_TEXT_KEY]: "FT_WEEK_LOW",
    },
    {
        name: EQUITY_MENU_GUEST.ACTIVE_VOLUME, apiKey: "activeVolume",
        key: "activeVolume", [LANG_TEXT_KEY]: "ACTIVE_VOLUME",
    },
    {
        name: EQUITY_MENU_GUEST.ACTIVE_VALUE, apiKey: "activeValue",
        key: "activeValue", [LANG_TEXT_KEY]: "ACTIVE_VALUE",
    }
]

export const MARKET_DERIVATIVE_MENU_ARRAY_CONST = [
    {
        name: DERIVATIVE_MENU.MOST_ACTIVE, apiKey: "activeValue",
        key: "mostActive", langKey: "MOST_ACTIVE"
    },
    {
        name: DERIVATIVE_MENU.PUT_CALL_RATIO, apiKey: "putCallratio",
        key: "putCallRatio", langKey: "PUT_CALL_RATIO"
    },
    {
        name: DERIVATIVE_MENU.OI_GAINERS, apiKey: "OIGainers",
        key: "oiGainers", langKey: "OI_GAINERS"
    },
    {
        name: DERIVATIVE_MENU.OI_LOSERS, apiKey: "OILosers",
        key: "oiLosers", langKey: "OI_LOSERS"
    },
]

export const MARKET_DERIVATIVE_MENU_ARRAY_CONST_GUEST = [
    {
        name: DERIVATIVE_MENU_GUEST.MOST_ACTIVE, apiKey: "activeValue",
        key: "mostActive", langKey: "MOST_ACTIVE"
    },
    {
        name: DERIVATIVE_MENU_GUEST.OI_GAINERS, apiKey: "OIGainers",
        key: "oiGainers", langKey: "OI_GAINERS"
    },
    {
        name: DERIVATIVE_MENU_GUEST.OI_LOSERS, apiKey: "OILosers",
        key: "oiLosers", langKey: "OI_LOSERS"
    },
]
export const MARKET_GLOBAL_INDICES_MENU_ARRAY_CONST = [
    {
        name: GLOBAL_INDICES_MENU.INDEX, apiKey: "indiceNme",
        key: "indiceNme", langKey: "INDEX"
    },
    {
        name: GLOBAL_INDICES_MENU.CHG, apiKey: "chg",
        key: "chg", langKey: "CHG"
    },
    {
        name: GLOBAL_INDICES_MENU.LTP, apiKey: "close",
        key: "close", langKey: "CLOSE"
    },
    {
        name: GLOBAL_INDICES_MENU.DATE, apiKey: "date",
        key: "date", langKey: "DATE"
    },
]

export const EQUITY_FILTERS = {
    DAILY: "DAILY",
    WEEKLY: "WEEKLY",
    MONTHLY: "MONTHLY",
    YEARLY: "YEARLY"
}
export const DERIVATIVE_STOCK_INDEX_FILTER = {
    STOCK_OPTION: "STOCK OPTION",
    INDEX_OPTION: "INDEX OPTION",
    INDEX_FUTURE: "INDEX FUTURE",
    STOCK_FUTURE: "STOCK FUTURE"
}

export const MARKET_WIDGET_MENUS_CONST = [
    { langKey: "EQUITY", name: "EQUITY" },
    { langKey: "DERIVATIVES", name: "DERIVATIVES" },
    { langKey: "COMMODITY", name: "COMMODITY" },
    { langKey: "CURRENCY", name: "CURRENCY" },
]

export const MARKET_DEALS_MENU_CONST = [
    { langKey: "BULK_DEALS", name: "BULK_DEALS", value: "BULK DEALS" },
    { langKey: "BLOCK_DEALS", name: "BLOCK_DEALS", value: "BLOCK DEALS" }
]

export const MARKET_TOPGAINLOSERS_MENU_CONST = [
    { langKey: "TOP_GAINERS", name: "TOP GAINERS", value: MARKET_MOVERS_KEYS.TOP_GAINERS },
    { langKey: "TOP_LOSSERS", name: "TOP LOSERS", value: MARKET_MOVERS_KEYS.TOP_LOSERS }
]

export const MARKET_ACTIVE_VOLUME_MENU_CONST = [
    { langKey: "ACTIVE_VOLUME", name: "ACTIVE VOLUME", value: 'activeVolume' },
    { langKey: "ACTIVE_VALUE", name: "ACTIVE VALUE", value: 'activeValue', }
]

export const MARKET_WEEK_HIGHLOW_MENU_CONST = [
    { langKey: "WEEK_HIGH", name: "52 WEEK HIGH", value: 'yHigh' },
    { langKey: "WEEK_LOW", name: "52 WEEK LOW", value: 'yLow' }
]

export const MARKET_UPPER_LOWER_MENU_CONST = [
    { langKey: "UPPER_CIRCUIT", name: "UPPER CIRCUIT", value: 'ucl' },
    { langKey: "LOWER_CIRCUIT", name: "LOWER CIRCUIT", value: 'lcl' }
]

export const MARKET_HIGH_LOW_ROLLOVER_CONST = [
    { langKey: "HIGHEST_ROLLOVER", name: "HIGHEST ROLLOVER", value: "HighestRollOver" },
    { langKey: "LOWEST_ROLLOVER", name: "LOWEST ROLLOVER", value: "LowestRollOver" }
]
export const MARKET_FNO_PUT_CALL_RATIO_CONST = [
    { langKey: "FNO_PULSE", name: "FNO PULSE", value: "FNOPulse" },
    { langKey: "PUT_CALL_RATIO", name: "PUT CALL RATIO", value: "PutCallRatio" }
]
export const MARKET_ACTIVE_FUTURE_OPTIONS_CONST = [
    { langKey: "ACTIVE_FUTURE", name: "ACTIVE FUTURE", value: "ActiveFuture" },
    { langKey: "ACTIVE_OPTIONS", name: "ACTIVE OPTIONS", value: "ActiveOptions" }
]
export const MARKET_IV_GAIN_LOSERS_CONST = [
    { langKey: "IV_GAINERS", name: "IV GAINERS", value: "IVGainers" },
    { langKey: "IV_LOSERS", name: "IV LOSERS", value: "IVLosers" }
]
export const MARKET_OI_GAIN_LOSERS_CONST = [
    { langKey: "OI_GAINERS", name: "OI GAINERS", value: "OIGainers" },
    { langKey: "OI_LOSERS", name: "OI LOSERS", value: "OILosers" }
]

export const POSITION_DETAIL_COLUMNLIST = [
    { langKey: "OPEN_VALUE", key: 'openVal', className: "width10", type: "string" },
    { langKey: "MARKET_VALUE", key: 'marketVal', className: "", type: "int" },
    { langKey: "BUY_QTY", key: 'buyQty', className: "", type: "string" },
    { langKey: "BUY_AVG", key: 'buyAvgPrice', className: "", type: "string" },
    { langKey: "BUY_VALUE", key: 'buyVal', className: "", type: "int" },
    { langKey: "SELL_QTY", key: 'sellQty', className: "", type: "string" },
    { langKey: "SELL_AVG", key: 'sellAvgPrice', className: "", type: "string" },
    { langKey: "SELL_VALUE", key: 'sellVal', className: "", type: "int" }
]

export const ORDER_DETAIL_COLUMNLIST = [
    { langKey: "PRODUCT_TYPE", key: "prdType", className: "width4", type: "string" },
    { langKey: "SERIES", key: "series", className: "width4", type: "string" },
    { langKey: "EXECUTED_QTY", key: "tradedQty", className: "width5", type: "string" },
    { langKey: "CANCEL_QTY", key: "cancelledQty", className: "width5", type: "string" },
    { langKey: "DISCLOSED_QTY", key: "disQty", className: "width6", type: "string" },
    { langKey: "MODIFIEDBY", key: "modifiedBy", className: "width5", type: "string" },
    { langKey: "VALIDITY", key: "ordDuration", className: "width5", type: "string" },
    // { langKey: "AMO_ORD_ID", key: "amoOrdId", className: "width7", type: "string" },
    { langKey: "ORDER_VALUE", key: "ordValue", className: "width5", type: "string" },
    { langKey: "EXCH_ORD_ID", key: "exchOrdId", className: "width7", type: "string" },
    { langKey: "EXCHANGE_TIME", key: "excOrdTime", className: "width7", type: "string" },
]

export const ORD_BO_TRIG_COLUMLIST = [
    { langKey: "ACTION", key: "ordAction", className: "width4", type: "string" },
    // { name: orderBoTrigColumns.prodType, key: "prdType", className: "width7", type: "string" },
    // { langKey: "EXCH_ORDER_NO", key: "exchOrdId", className: "width10", type: "string" },
    { langKey: "STOPLOSS_PRICE", key: "triggerPrice", className: "width7", type: "int" },
    { langKey: "QTY", key: "qty", className: "width6", type: "int" },
    // { langKey: "TRAILING_SL", key: "trailingSl", className: "width7", type: "int" },
    { langKey: "TRADED_QTY", key: "tradedQty", className: "width7", type: "int" },
    { langKey: "RMNG_QTY", key: "remainQty", className: "width7", type: "int" },
    { langKey: "CANCEL_QTY", key: "cancelledQty", className: "width7", type: "int" },
    { langKey: "REJEC_QTY", key: "rejectedQty", className: "width7", type: "int" },
    // { langKey: "STATUS", key: "ordStatus", className: "width7", type: "string" },
]

export const ORD_BO_TARG_COLUMLIST = [
    { langKey: "ACTION", key: "ordAction", className: "width4", type: "string" },
    // { langKey: "EXCH_ORDER_NO", key: "exchOrdId", className: "width10", type: "string" },
    // { langKey: "ACTION", key: "prdType", className: "width7", type: "string" },
    { langKey: "TARGET_PRICE", key: "limitPrice", className: "width7", type: "int" },
    { langKey: "QTY", key: "qty", className: "width6", type: "int" },
    { langKey: "TRADED_QTY", key: "tradedQty", className: "width7", type: "int" },
    { langKey: "RMNG_QTY", key: "remainQty", className: "width7", type: "int" },
    { langKey: "CANCEL_QTY", key: "cancelledQty", className: "width7", type: "int" },
    { langKey: "REJEC_QTY", key: "rejectedQty", className: "width7", type: "int" },
    // { langKey: "STATUS", key: "ordStatus", className: "width7", type: "string" },
    // { langKey: "", key: "", className: "width7", type: "string" },
]

export const ORD_BO_CO_COLUMLIST = [
    { langKey: "ORDER_REF_NO", key: "ordId", className: "width7", type: "string" },
    // { langKey: "EXCH_ORDER_NO", key: "exchOrdId", className: "width8", type: "string" },
    { langKey: "QTY", key: "qty", className: "width4", type: "int" },
    // { langKey: "PRICE", key: "limitPrice", className: "width7", type: "int" },
    { langKey: "STATUS", key: "ordStatus", className: "width8", type: "string" },
    { langKey: "ORDER_TIME", key: "excOrdTime", className: "width8", type: "string" },
    { langKey: "", key: "rejReason", className: "width8", type: "string" }
]

export const ORD_CO_TRIG_COLUMLIST = [
    { langKey: "ACTION", key: "ordAction", className: "width3", type: "string" },
    // { langKey: "PRODUCT_TYPE", key: "prdType", className: "width8", type: "string" },
    { langKey: "TRIGGER_PRICE", key: "triggerPrice", className: "width8", type: "int" },
    { langKey: "QTY", key: "qty", className: "width5", type: "int" },
    // { langKey: "PEND_QTY", key: "remainQty", className: "width7", type: "string" },
    { langKey: "TRADED_QTY", key: "tradedQty", className: "width7", type: "int" },
    { langKey: "RMNG_QTY", key: "remainQty", className: "width7", type: "int" },
    { langKey: "CANCEL_QTY", key: "cancelledQty", className: "width7", type: "int" },
    { langKey: "REJEC_QTY", key: "rejectedQty", className: "width7", type: "int" },
    // { langKey: "STATUS", key: "ordStatus", className: "width7", type: "string" }
]

/* =========== Language Based Constants end ========= */

/* Drop Down Constants */

export const EXCHANGE_LIST = [
    { name: "NSE", key: "NSE" },
    { name: "BSE", key: "BSE" }
]

export const EXCHANGE_TOGGLE_DATA = {
    EQUITY: ["NSE", "BSE"],
    FUTURE: ["NFO"]
}

export const DATE_OPTIONLIST = [
    { name: 'SHOW ALL', key: "SHOW_ALL" },
    { name: 'SELECT DATE', key: "SELECT_DATE" }
]

export const FD_ACTIVITY_OPTIONLIST = [
    { name: 'DAILY', key: "DAILY" },
    { name: "MONTHLY", key: "MONTHLY" },
    { name: "YEARLY", key: "YEARLY" }
]

export const MARKEt_EQUITY_TYPE_LIST = [
    { [LANG_TEXT_KEY]: "TOP_GAINERS_LOSERS", key: "TOP GAINERS / LOSERS" },
    { [LANG_TEXT_KEY]: "WEEK_HIGH_LOW", key: "52 WEEK HIGH / LOW" },
    { [LANG_TEXT_KEY]: "ACTIVE_VOLUME_VALUE", key: "ACTIVE VOLUME / VALUE" },
    { [LANG_TEXT_KEY]: "UPPER_LOWER_CIRCUIT", key: "UPPER CIRCUIT / LOWER CIRCUIT" }
    // { [LANG_TEXT_KEY]: "BULK_BLOCK_DEALS", key: "BULK DEALS / BLOCK DEALS" },
    // { [LANG_TEXT_KEY]: "FII_DII_ACTIVITY", key: "FII DII ACTIVITY" }
];

export const MARKET_DERIVATIVE_TYPE_LIST = [
    { [LANG_TEXT_KEY]: "TOP_GAINERS_LOSERS", value: "TOP GAINERS / LOSERS" },
    // { [LANG_TEXT_KEY]: "HIGHEST_ROLLOVER_LOWEST", value: "HIGHEST ROLLOVER / LOWEST" },
    // { [LANG_TEXT_KEY]: "FNO_PULSE_PUT_CALL_RATIO", value: "FNO PULSE / PUT CALL RATIO" },
    // { [LANG_TEXT_KEY]: "ACTIVE_FUTURE_OPTIONS", value: "ACTIVE FUTURE / OPTIONS" },
    { [LANG_TEXT_KEY]: "OI_GAINERS_LOSERS", value: "OI GAINERS / LOSERS" },
    // { [LANG_TEXT_KEY]: "IV_GAINERS_LOSERS", value: "IV GAINERS / LOSERS" }
]

export const MARKET_DERIVATIVE_SEGMENT_LIST = [
    { [LANG_TEXT_KEY]: "STOCK_FUTURE", value: "stockFut" },
    { [LANG_TEXT_KEY]: "STOCK_OPTION", value: "stockOpt" },
    { [LANG_TEXT_KEY]: "INDEX_FUTURE", value: "indexFut" },
    { [LANG_TEXT_KEY]: "INDEX_OPTION", value: "indexOpt" }
]

export const MARKET_DERIVATIVE_EXCHANGE_LIST = [
    { name: "NFO", key: "NFO" },
    { name: "BFO", key: "BFO" }
]

export const MARKET_CURRENCY_TYPE_LIST = [
    { [LANG_TEXT_KEY]: "TOP_GAINERS", name: "TOP GAINERS", key: "TOP GAINERS" },
    { [LANG_TEXT_KEY]: "TOP_LOSSERS", name: "TOP LOSERS", key: "TOP LOSERS" },
    { [LANG_TEXT_KEY]: "OI_GAINERS", name: "OI GAINERS", key: "OI GAINERS" },
    { [LANG_TEXT_KEY]: "OI_LOSERS", name: "OI LOSERS", key: "OI LOSERS" },
    { [LANG_TEXT_KEY]: "ACTIVE_VOLUME", name: "ACTIVE VOLUME", key: "ACTIVE VOLUME" },
]

export const MARKET_CURRENCY_SEGMENT_LIST = [
    { [LANG_TEXT_KEY]: "FUTURE", name: "FUTURE", value: "curFut" },
    { [LANG_TEXT_KEY]: "OPTIONS", name: "OPTIONS", value: "curOpt" }
]

export const MARKET_CURRENCY_EXCHANGE_LIST = [
    { [LANG_TEXT_KEY]: "CDS", name: "CDS", value: "" },
    { [LANG_TEXT_KEY]: "BCD", name: "BCD", value: "" },
    { [LANG_TEXT_KEY]: "MCXSX", name: "MCXSX", value: "" }
]

export const ORDERS_PRODTYPE_LIST = [
    { [LANG_TEXT_KEY]: "ALL", name: "ALL", key: "all" },
    { [LANG_TEXT_KEY]: "NET_PROFIT", name: "NET PROFIT", key: "profit" },
    { [LANG_TEXT_KEY]: "NET_LOSS", name: "NET LOSS", key: "loss" }
]

export const NETPOSITION_PRODUCTTYPE_LIST = [
    { [LANG_TEXT_KEY]: "ALL_PRODUCT", name: "ALL PRODUCT", key: "all" },
    { [LANG_TEXT_KEY]: "DELIVERY", name: "DELIVERY", key: "DELIVERY" },
    { [LANG_TEXT_KEY]: "INTRADAY", name: "INTRADAY", key: "INTRADAY" },
    { [LANG_TEXT_KEY]: "MTF", name: "MTF", key: "MTF" },
    { [LANG_TEXT_KEY]: "TNC", name: "TNC", key: "TNC" }
]

export const ORDERS_STATUS_LIST = [
    { [LANG_TEXT_KEY]: "ALL_STATUS", name: "ALL STATUS", key: "all" },
    { [LANG_TEXT_KEY]: "EXECUTED", name: "EXECUTED", key: "executed" },
    { [LANG_TEXT_KEY]: "PENDING", name: "PENDING", key: "pending" },
    { [LANG_TEXT_KEY]: "REJECTED", name: "REJECTED", key: "rejected" },
    { [LANG_TEXT_KEY]: "CANCELLED", name: "CANCELLED", key: "cancelled" }
]

export const ORDERS_EXCHANGE_LIST = [
    { [LANG_TEXT_KEY]: "ALL_EXCHANGE", name: "ALL EXCHANGE", key: "all" },
    { [LANG_TEXT_KEY]: "NSE", name: "NSE", key: "nse" },
    { [LANG_TEXT_KEY]: "BSE", name: "BSE", key: "bse" },
    { [LANG_TEXT_KEY]: "ICEX", name: "ICEX", key: "icex" },
    // { [LANG_TEXT_KEY]: "MSEI", name: "MSEI", key: "msei" },
    { [LANG_TEXT_KEY]: "MCXSX", name: "MCXSX", key: "mcxsx" },
    { [LANG_TEXT_KEY]: "MCX", name: "MCX", key: "mcx" },
]

export const ORDERS_SEGMENT_LIST = [
    { [LANG_TEXT_KEY]: "ALL_SEGMENT", name: "ALL SEGMENTS", key: "all" },
    { [LANG_TEXT_KEY]: "EQUITYY", name: "EQUITY", key: "equity" },
    { [LANG_TEXT_KEY]: "FNO", name: "FNO", key: "fno" },
    // { [LANG_TEXT_KEY]: "CURRENCY", name: "CURRENCY", key: "currency" },
    // { [LANG_TEXT_KEY]: "COMMODITY", name: "COMMODITY", key: "commodity" }
]

export const MARKET_COMMODITY_EXCHANGE_LIST = [
    { [LANG_TEXT_KEY]: "MCX", name: "MCX", value: "" },
    { [LANG_TEXT_KEY]: "NCO", name: "NCO", value: "" },
    { [LANG_TEXT_KEY]: "BCO", name: "BCO", value: "" },
    { [LANG_TEXT_KEY]: "ICEX", name: "ICEX", value: "" }
]

export const MARKET_COMMODITY_SEGMENT_LIST = [
    { [LANG_TEXT_KEY]: "FUTURE", name: "FUTURE", value: "comFut" },
    { [LANG_TEXT_KEY]: "OPTIONS", name: "OPTIONS", value: "comOpt" }
]

export const ASSET_TYPE = {
    "EQUITY": 'equity',
    "CURRENCY": "currency",
    "COMMODITY": "commodity"
}

export const FUND_TRANSFER_MENU = [
    { langKey: "FUND_TRANSFER_MENU", name: "FUND TRANSFER" },
    { langKey: "FUNDS_VIEW_MENU", name: "FUNDS VIEW" },
]
export const ORDER_STATUS_TAB = {
    "ORDERBOOK": 'orderbook',
    "TRADEBOOK": "tradebook",
}
export const ADD_FUNDS_MODE = [
    { langKey: "NET_BANKING", name: ADD_FUNDS_MODE_OPTIONS.NET_BANKING },
    { langKey: "UPI", name: ADD_FUNDS_MODE_OPTIONS.UPI }
]

export const QUOTE_FINANCIAL_TITLES = [
    { langKey: "MARGIN_RATIO", name: "MARGIN RATIO" },
    { langKey: "PERFORMANCE_RATIO", name: "PERFORMANCE RATIO" },
    { langKey: "EFFICENCY_RATIO", name: "EFFICENCY RATIO" },
    { langKey: "FINANCIAL_STABILITY_RATIO", name: "FINANCIAL STABILITY RATIO" },
    { langKey: "GROWTH_RATIO", name: "GROWTH RATIO" },
    { langKey: "LIQUIDITY_RATIO", name: "LIQUIDITY RATIO" },
    { langKey: "VALUATION_RATIO", name: "VALUATION RATIO" },
    { langKey: "CASHFLOW_RATIO", name: "CASHFLOW RATIO" },

]

export const BO_REPORTS_MENUS = BO_REPORTS_MENUS_NEW_CONST;
export const BO_REPORTS_MENUS_ARRAY = BO_REPORTS_MENUS_ARRAY_NEW_CONST;
export const SYMBOL_RESULT_HEADER = SYMBOL_RESULT_HEADER_NEW_CONST;
export const SYMBOL_RESULT_HEADER_ARRAY = SYMBOL_RESULT_HEADER_ARRAY_NEW_CONST
// export const BO_REPORTS_FILTER = [
//     { [LANG_TEXT_KEY]: "THIS_MONTH", name: "THIS MONTH", key: "thismonth", apiKey: "TM",iconEnable: false },
//     { [LANG_TEXT_KEY]: "LAST_MONTH", name: "LAST MONTH", key: "lastmonth", apiKey: "LM" ,iconEnable: false},
//     { [LANG_TEXT_KEY]: "LAST_YEAR", name: "LAST YEAR", key: "lastyear", apiKey: "LY" ,iconEnable: false},
//     { [LANG_TEXT_KEY]: "CUSTOM_DATE", name: "CUSTOM DATE", key: "customdate", apiKey: "CD",iconEnable: true },

// ]

export const BO_REPORTS_FILTER = BO_REPORTS_FILTER_NEW_CONST;
export const BO_REPORTS_TAX_FILTER = BO_REPORTS_TAX_FILTER_NEW_CONST;
export const BO_REPORTS_PNL_FILTER = BO_REPORTS_PNL_FILTER_NEW_CONST;
export const BO_REPORTS_PNL_HOLDINGS_FILTER = BO_REPORTS_PNL_HOLDINGS_FILTER_NEW_CONST;

// export const BO_REPORTS_FILTER_MENU = {
//     THIS_MONTH: "THIS MONTH",
//     LAST_MONTH: "LAST MONTH",
//     LAST_YEAR: "LAST YEAR",
//     CUSTOM_DATE: "CUSTOM DATE",

// }

export const BO_REPORTS_FILTER_MENU = BO_REPORTS_FILTER_MENU_NEW_CONST;
export const BO_REPORTS_TAX_FILTER_MENU = BO_REPORTS_TAX_FILTER_MENU_NEW_CONST;
export const BO_REPORTS_PNL_FILTER_MENU = BO_REPORTS_PNL_FILTER_MENU_NEW_CONST;
export const BO_REPORTS_PNL_HOLDINGS_FILTER_MENU = BO_REPORTS_PNL_HOLDINGS_FILTER_MENU_NEW_CONST;
export const BO_REPORTS_TAB_OPTIONS = BO_REPORTS_TAB_OPTIONS_NEW_CONST;
export const BO_REPORT_TYPES = BO_REPORT_TYPES_NEW_CONST;
export const BO_REPORTS_FINANCIAL_OPTIONS = BO_REPORTS_FINANCIAL_OPTIONS_NEW_CONST;
export const BO_REPORT_FINANCIAL_TYPES = BO_REPORT_FINANCIAL_TYPES_NEW_CONST;
export const BO_REPORTS_FINANCIAL_FILTER_MENU = BO_REPORTS_FINANCIAL_FILTER_MENU_NEW_CONST;
export const BO_REPORTS_FINANCIAL_FILTER = BO_REPORTS_FINANCIAL_FILTER_NEW_CONST;
export const BO_REPORTS_INTEREST_REPORT_OPTIONS = BO_REPORTS_INTEREST_REPORT_OPTIONS_NEW_CONST;
export const BO_REPORTS_INTEREST_REPORT_TYPES = BO_REPORTS_INTEREST_REPORT_TYPES_NEW_CONST;

export const ALERT_SIGN_FILTER = [
    {
        [LANG_TEXT_KEY]: "GREATER_THAN_EQUAL_TO", name: "GREATER THAN EQUAL TO", key: "greater",
        apiKey: "G", value: "≥"
    },
    {
        [LANG_TEXT_KEY]: "LESS_THAN_EQUAL_TO", name: "LESS THAN EQUAL TO", key: "less", apiKey: "L",
        value: "≤"
    },
    // { [LANG_TEXT_KEY]: "EQUAL_TO", name: "EQUAL TO", key: "equal", apiKey: "E", value: "=" },
]

export const ALERT_SIGN_VOLUME_FILTER = [
    {
        [LANG_TEXT_KEY]: "GREATER_THAN_EQUAL_TO", name: "GREATER THAN EQUAL TO",
        key: "greater", apiKey: "G", value: "≥"
    },
    // { [LANG_TEXT_KEY]: "EQUAL_TO", name: "EQUAL TO", key: "equal", apiKey: "E", value: "=" },
]

export const ALERT_STREAM_FILTER = [
    { [LANG_TEXT_KEY]: "LAST_TRADED_PRICE", name: "LAST TRADED PRICE", key: "ltp", apiKey: "ltp", check: "LTP" },
    { [LANG_TEXT_KEY]: "AVERAGE_PRICE", name: "AVERAGE PRICE", key: "atp", apiKey: "atp", check: "ATP" },
    { [LANG_TEXT_KEY]: "HIGH_PRICE", name: "HIGH PRICE", key: "high", apiKey: "high", check: "High Price" },
    { [LANG_TEXT_KEY]: "LOW_PRICE", name: "LOW PRICE", key: "low", apiKey: "low", check: "Low Price" },
    { [LANG_TEXT_KEY]: "OPEN_PRICE", name: "OPEN PRICE", key: "open", apiKey: "open", check: "Open Price" },
    { [LANG_TEXT_KEY]: "CLOSE_PRICE", name: "CLOSE PRICE", key: "close", apiKey: "close", check: "Close Price" },
    { [LANG_TEXT_KEY]: "DAY_CHANGE", name: "DAY CHANGE %", key: "chngPer", apiKey: "chngPer", check: "Day Change %" },
    { [LANG_TEXT_KEY]: "LAST_TRADED_QUANTITY", name: "LAST TRADED QUANTITY", key: "ltq", apiKey: "ltq", check: "LTQ" },
    { [LANG_TEXT_KEY]: "VOLUME", name: "VOLUME", key: "vol", apiKey: "vol", check: "Volume" },
    // { [LANG_TEXT_KEY]: "BUY_QUANTITY", name: "BUY QUANTITY", key: "bq", apiKey: "bq" },
    // { [LANG_TEXT_KEY]: "SELL_QUANTITY", name: "SELL QUANTITY", key: "sq", apiKey: "sq" },
    { [LANG_TEXT_KEY]: "OPEN_INTEREST", name: "OPEN INTEREST", key: "OI", apiKey: "OI", check: "Open Interest" },
    // { [LANG_TEXT_KEY]: "OI_DAY_LOW", name: "OI DAY LOW", key: "yLow", apiKey: "yLow" },
    // { [LANG_TEXT_KEY]: "OI_DAY_HIGH", name: "OI DAY HIGH", key: "yHigh", apiKey: "yHigh" },
]

export const ALERT_TYPE_LIST = {
    "p": "LAST TRADED PRICE",
    "v": "VOLUME",
    "h_p": "HIGH PRICE",
    "l_p": "LOW PRICE",
    "o_p": "OPEN PRICE",
    "c_p": "CLOSE PRICE",
    "lt_v": "LAST TRADED QUANTITY",
    "a_p": "AVERAGE PRICE",
    "oi_v": "OPEN INTEREST",
    "p_p": "DAY CHANGE %",
}

export const ALERTS_DATE_FILTER = [
    { [LANG_TEXT_KEY]: "TODAY", name: "TODAY", key: "today", apiKey: "t", iconEnable: false },
    { [LANG_TEXT_KEY]: "YESTERDAY", name: "YESTERDAY", key: "yesterday", apiKey: "y", iconEnable: false },
    { [LANG_TEXT_KEY]: "LAST_WEEK", name: "LAST WEEK", key: "lastyear", apiKey: "lw", iconEnable: false },
    { [LANG_TEXT_KEY]: "THIS_MONTH", name: "THIS MONTH", key: "thismonth", apiKey: "TM", iconEnable: false },
    { [LANG_TEXT_KEY]: "LAST_MONTH", name: "LAST MONTH", key: "lastmonth", apiKey: "LM", iconEnable: false },
    { [LANG_TEXT_KEY]: "CUSTOM_DATE", name: "CUSTOM DATE", key: "customdate", apiKey: "CD", iconEnable: true },
]

export const ALERTS_DATES_FILTER_MENU = {
    TODAY: "TODAY",
    YESTERDAY: "YESTERDAY",
    LAST_WEEK: "LAST WEEK",
    THIS_MONTH: "THIS MONTH",
    LAST_MONTH: "LAST MONTH",
    LAST_YEAR: "LAST YEAR",
    CUSTOM_DATE: "CUSTOM DATE"
}

export const ALERTS_MENU_ARRAY = {
    ALERTS: "Alerts",
    NOTIFICATIONS: "Notifications"
}
export const ALERT_MENUS = [
    { name: ALERTS_MENU_ARRAY.ALERTS, langKey: "ALERTS" },
    { name: ALERTS_MENU_ARRAY.NOTIFICATIONS, langKey: "NOTIFICATIONS" },
]

export const ACTION_REDIRECT = {
    MNU_ORDERBOOK: "MNU_ORDERBOOK",
    MNU_DASH: "MNU_DASH",
    MNU_ALERTS: "MNU_ALERTS",
    MNU_NOTIFICATION: "MNU_NOTIFICATION"
}

export const ALERT_VALUE_ERROR_MSG = [
    {
        [LANG_TEXT_KEY]: "ALERTMSG_GREATER_THAN_EQUAL_TO",
        name: "Value should not be lesser than and equal to current "
    },
    { [LANG_TEXT_KEY]: "ALERTMSG_LESS_THAN_EQUAL_TO", name: "Value should not be greater than and equal to current " },
    { [LANG_TEXT_KEY]: "ALERTMSG_EQUAL_TO", name: "Value should not be equal to current " },
    { [LANG_TEXT_KEY]: "ALERTMSG_INVALID_TO", name: "Alert Invalid Data" }
]
// export const ALERT_VALUE_ERROR_MSG = [
//     { langKey: "ALERTMSG_GREATER_THAN_EQUAL_TO"},
//     { [LANG_TEXT_KEY]: "ALERTMSG_LESS_THAN_EQUAL_TO" },
//     { [LANG_TEXT_KEY]: "ALERTMSG_EQUAL_TO"},
//     { [LANG_TEXT_KEY]: "ALERTMSG_INVALID_TO"}
// ]

//Labels used for Demo-Tour(Title and Intro)
export const DEMOTOUR_MSG = {
    DEMO_MENU: "Menu",
    DEMO_MENU_INTRO_P1: "Tap to open Menu. Here you can -",
    DEMO_MENU_INTRO_P2: " Add Fund",
    DEMO_MENU_INTRO_P3: " Apply in IPO",
    DEMO_MENU_INTRO_P4: " Pledge shares",
    DEMO_MENU_INTRO_P5: " View Reports & ",
    DEMO_MENU_INTRO_P6: " Use EDIS",
    DEMO_LOGO: "Logo",
    DEMO_LOGO_INTRO: "By clicking on Bajaj Finserv Logo, you will be redirected to the initial trading home page",
    DEMO_INDICES: "Indices",
    DEMO_INDICES_INTRO: "Tap to view indices like, Nifty & Sensex, etc.",
    DEMO_FUNDS: "Available Funds",
    DEMO_FUNDS_INTRO: "The fund amount you add will appear here.",
    DEMO_FUNDS_BTN: "Funds",
    DEMO_FUNDS_BTN_INTRO: "Begin by adding funds from here.",
    DEMO_SEARCH: "Search",
    DEMO_SEARCH_INTRO: "Search scrip name here to get quotes.",
    DEMO_WATCHLIST: "Watchlist",
    DEMO_WATCHLIST_INTRO_P1: "Here is default watchlist of Nifty 50 stocks.",
    // DEMO_WATCHLIST_INTRO_P2: "My List- Personalized Watchlist",
    DEMO_ADD_WATCHLIST: "Add Watchlist",
    DEMO_ADD_WATCHLIST_INTRO: "Create your own watchlist from here.",
    DEMO_WATCHLIST2: "Watchlist",
    DEMO_WATCHLIST2_INTRO:
        "Move cursor on scrip to display Buy, Sell, Chart, Quotes, etc.",
    DEMO_WATCHLIST3: "Chart",
    DEMO_WATCHLIST3_INTRO: "View Chart from here.",
    DEMO_WATCHLIST4: "Buy or Sell",
    DEMO_WATCHLIST3_INTRO2: "Tap BUY or SELL to open Trade Window.",
    DEMO_DASHBOARD: "Dashboard",
    DEMO_DASHBOARD_INTRO: "Your Holdings, Net positions and Order status will update here.",
    DEMO_WELCOME_TEXT1: "Hang on with us!",
    DEMO_WELCOME_TEXT2: "We'll show you key things around.",
    DEMO_GDBYE_TEXT: "We wish you Happy Trading!",
    DEMO_ORDER_TEXT: "Set your Order Type Here.",
    DEMO_ORDER_TEXT2: "Select MTF to increase your buying power.",
    DEMO_ORDER: "Order Pad",
    DEMO_WELCOME_TITLE: "Welcome",
    DEMO_THANKYOU_TITLE: "Thank you",
    DEMO_ORDERHEADER1: "Your Holdings, Net positions and Order",
    DEMO_ORDERHEADER2: "status will update here",
    DEMO_LABEL_FUNDS: "FUNDS",
    DEMO_LABEL_AVAILFUNDS: "AVAIL FUNDS",
    DEMO_LABEL_PRED50: "PredNifty50",
    DEMO_LABEL_MYLIST: "Watchlist 1",
    DEMO_LABEL_WTCHLIST: "Watchlist 2",
    DEMO_LABEL_SEARCH: "Search INFY, Bank CE, Bank NFO",
    DEMO_LABEL_HOLDINGS: "Holdings",
    DEMO_LABEL_P_AMP: "Total P&amp;L",
    DEMO_LABEL_NETPOSN: "Net positions",
    DEMO_LABEL_ORDERSTATUS: "Order status",
    DEMO_LABEL_PENDING: "PENDING",
    DEMO_LABEL_EXECUTED: "EXECUTED"

}
export const OFS_MENUS = OFS_MENUS_FROM_NEW

export const OFS_MENU_ARRAY = [
    { name: OFS_MENUS.ONGOING_OFS, langKey: "ONGOING_OFS" },
    { name: OFS_MENUS.UPCOMING_OFS, langKey: "UPCOMING_OFS" },
    { name: OFS_MENUS.ORDERBOOK, langKey: "ORDERBOOK" },
]

export const OFS_DIALOGS = OFS_DIALOGS_FROM_NEW

export const OFS_INVESTMENT_LIMIT = 200000

export const OFS_ORDER_STATUS = {
    REJECTED: "rejected",
    // PENDING: "pending",
    OPEN: "open",
    CANCELLED: "cancelled",
    ORDERED: "ordered"
}

export const NEWS_WIDGETS = NEWS_WIDGETS_NEW_CONST;
export const NEWS_MENUS_ARRAY = NEWS_MENUS_ARRAY_NEW_CONST;
export const NEWS_FILTER = NEWS_FILTER_NEW_CONST;
export const NEWS_FILTER_CORPORATE_ACTION = NEWS_FILTER_CORPORATE_ACTION_NEW_CONST;
export const NEWS_FILTER_MENU = NEWS_FILTER_MENU_NEW_CONST;

export const BO_REPORTS_BROKERAGE_FILTER = BO_REPORTS_BROKERAGE_FILTER_NEW_CONST;
export const BO_REPORTS_BROKERAGE_FILTER_MENU = BO_REPORTS_BROKERAGE_FILTER_MENU_NEW_CONST;

export const NEWS_DIALOGS = {
    DETAILS_POPUP: " DETAILS_POPUP",
}

export const TRIALDEMO_SYM_DATA = {
    atp: "1,827.04",
    baseSym: "GRASIM",
    chng: "23.50",
    close: "1,806.50",
    companyName: "GRASIM INDUSTRIES LTD",
    dispSym: "GRASIM-EQ",
    high: "1,836.75",
    lcl: "1,625.85",
    low: "1,814.30",
    ltp: "1,830.00",
    ltq: "12",
    ltt: "20 Jan 2022, 11:02:27",
    open: "1,817.00",
    sym: {
        asset: "equity",
        baseSym: "GRASIM",
        companyName: "GRASIM INDUSTRIES LTD",
        dispSym: "GRASIM-EQ",
        exc: "NSE",
        excToken: "1232",
        id: "STK_GRASIM_EQ_NSE",
        instrument: "STK",
        lotSize: "1",
        multiplier: "1",
        otherExch: ['BSE'],
        series: "EQ",
        streamSym: "1232_NSE",
        tickSize: "0.05",
        trSym: "GRASIM-EQ",
    },
    symbol: "1232_NSE",
    ttv: "45,00,43,800.96",
    ucl: "1,987.15",
    vol: "2,46,324",
    yHigh: "1,929.80",
    yLow: "990.85"
}

export const NCD_MENUS = NCD_MENUS_NEW_CONST;
export const NCD_MENU_ARRAY = NCD_MENU_ARRAY_NEW_CONST;
export const NCD_DIALOGS = NCD_DIALOGS_NEW_CONST;
export const NCD_SERIES_LIST = NCD_SERIES_LIST_NEW_CONST;
export const NCD_MESSAGES = NCD_MESSAGES_NEW_CONST;
export const NCD_ORDER_STATUS = NCD_ORDER_STATUS_NEW_CONST;

export const IDEAS_CARD = {
    PICKRIGHT: "pickright",
    US_STOCKS: "usinvest",
    GOLDEN_PI: "goldenpi",
    MARKET_SMITH_LONG_TERM: "longTerm",
    MARKET_SMITH_SHORT_TERM: "shrtTerm"
}

export const FUNDS_SEGMENT_TYPES = [
    { langKey: "EQUITY_SEG", name: "EQ Segment" },
    { langKey: "FNO_SEG", name: "FNO Segment" }
]

export const FUNDS_SEGMENT_SELECTION_TYPES = [
    { langKey: "DEFAULT_SEG", name: "Default Segment" },
    { langKey: "MULTIPLE_SEG", name: "Multiple Segment" }
]

// export const FUNDS_ECOLLECT_SEGMENT_TYPES = [
//     { langKey: "EQUITY_ECOLLECT_SEG", name: "Equity" },
//     { langKey: "FNO_ECOLLECT_SEG", name: "FNO" }
// ]
export const DYNAMIC_LINK_SCREEN = DYNAMIC_LINK_SCREEN_NEW_CONST

export const SUBSCRIPTION_STATUS = SUBSCRIPTION_STATUS_NEW_CONST
export const FEEDBACK_OPTIONS = FEEDBACK_OPTIONS_NEW_CONST

export const EMPTY = "EMPTY"
export const RANGE = "RANGE"
export const HIGH = "HIGH"
export const HIGH_MAIN_PRICE = "HIGH_MAIN_PRICE"
export const LOW = "LOW"
export const LOW_25 = "LOW_25"
export const LOW_MAIN_PRICE = "LOW_MAIN_PRICE"
export const INVALID = "INVALID"
export const TICK_SIZE = "TICK_SIZE"
export const LOT_ERROR = "LOT_ERROR"
// export const MAX_SELL_AMT = "MAX_SELL_AMT"

// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"
// export const RSI_BULLISH = "RSI BULLISH"

export const AF_EVENT_TYPES = AF_EVENT_CATEOGORY_TYPES_NEW_CONST
export const AF_EVENT_NAMES = AF_EVENT_NAMES_NEW_CONST
export const SYMBOL_INSTRUMENT_TYPE = SYMBOL_INSTRUMENT_TYPE_NEW_CONST
export const MTF_DIALOGS = MTF_DIALOGS_NEW_CONST
export const TRADESUMMARY_DIALOGS = TRADESUMMARY_DIALOGS_NEW_CONST
