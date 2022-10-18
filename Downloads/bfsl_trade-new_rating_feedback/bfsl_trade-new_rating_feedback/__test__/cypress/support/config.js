import { getEnvData } from './utilFunctions'

const envData = getEnvData()

// export const URL = 'http://localhost:3000/bfsl-dev/base/login'
export const URL = envData.siteURL
export const USER_NAME = "TEST15"    //"TEST18"
export const PASSWORD = "Abc@123"    //Abc@123
export const PAN_NUMBER = "AAAAA1111A"
export const DOB = "01012020"

export const ORDER_SYMBOL = 'HDFCBANK'
export const ORDER_COMM_SYMBOL = 'silvermic'
export const ORDER_ICEX_SYMBOL = 'rubber'
export const ORDER_CURR_SYMBOL = 'USDINR'

export const ORDER_KEYS = {
    PRODUCT_TYPE: 'PRODUCT TYPE',
    ORDER_TYPE: 'ORDER TYPE',
    QTY: 'QTY',
    DISCLOSED_QTY: 'DISCLOSED QTY',
    PRICE: 'PRICE',
    TRIGGER_PRICE: 'TRIGGER PRICE',
    SQUARE_OFF: 'SQUARE OFF',
    STOP_LOSS: 'STOP LOSS',
    TRAILING_STOPLOSS: 'TRAILING STOPLOSS',
    VALIDITY: 'VALIDITY',
    AMO: 'AMO',
    VALID_PRICE: 'VALID PRICE',
    VALID_CUPRICE: 'VALID CUPRICE',
    SLM_TRIGGER_PRICE: 'SLM_TRIGGER_PRICE',
    BO_STOP_LOSS: 'BO_STOP_LOSS',
    BO_SQUARE_OFF: 'BO_SQUARE_OFF',

}

// export const MARKET_ORDER = {
//     [ORDER_KEYS.QTY]: '8',
//     [ORDER_KEYS.DISCLOSED_QTY]: '2'
// }

export const WATCHLIST = {
    NAME: 'Test'
}

export const PRODUCT_TYPES = {
    PRD_DEL: 'DELIVERY',
    PRD_INTRA: 'INTRADAY',
    PRD_TNC: 'TNC',
    PRD_MTF: 'MTF',
    PRD_BO: 'BO',
    PRD_CO: 'CO',
    PRD_NRML: "NORMAL"

    // PRD_NRML : 'NRML'
}

export const ORDER_TYPES = {
    ORD_MRK: 'MARKET',
    ORD_LIMIT: 'LIMIT',
    ORD_SL: 'SL',
    ORD_SLM: 'SL-M'
}

export const VALIDITY = {
    DAY: 'DAY',
    IOC: 'IOC',
    COL: 'COL',
    EOS: 'EOS',
    GTC: 'GTC',
    GTD: 'GTD'
}

export const SEARCH_OPTIONS = {
    EQUITY: "EQUITY",
    CURRENCY: "CURRENCY",
    COMMODITY: "COMMODITY",
    CASH: "CASH",
    FUTURE: "FUTURE",
    OPTION: "OPTION",
}

export const ORDER_PATH = {
    ORDER_SUBMIT_BTN: '.orderPadBase .footer .actionDiv .positiveBtn ',
    ORDER_QTY: '.orderPadBase .fieldRow [name="qty"]',
    ORDER_DIS_QTY: '.fieldRow  .field [name="disQty"]',
    ORDER_PRICE: '.orderPadBase .priceField  input[name="price"]',
    ORDER_STOP_LOSS: '.fieldRow .field [name="stopLoss"]',
    ORDER_SQ_OFF: '.fieldRow .field [name="squareOff"]',
    WATCH_MIN_BUY: ".watchlist-widgets-holder .right .button-div .buy-btn",
    WATCH_MIN_SELL: ".watchlist-widgets-holder .right .button-div .sell-btn",
    ORDER_TRAIL_SL: ".fieldRow .field [name='trailStopLoss']",
    ORDER_VALIDITY_PATH: '.orderPadBase .validityDiv .radioField',
    ORDER_AMO_PATH: '.orderPadBase .AMO',
    ORDER_AMO_CHKBOX: '.orderPadBase .AMOcheckboxDiv .input-ele',
    ORDER_TRIGGER_PRICE: '.fieldRow .field [name="triggerPrice"]',
    ORDER_CONFIRM_BTN: '.orderDialogConfirm .dialogConfirmFooter .action-button .confirm-order',
    ORDER_RESULT_BTN: '.orderDialogBase .orderConfirmSuccess .okay-btn',
}

export const SEARCH_PATH = {
    INPUT: '.symSearch-base .input-addOn .input-ele',
    INFO: ".searchResutDiv .symbolRow-div .infoMsg"
}
export const LOGIN_USER_ERROR = 'Enter Correct User ID / Password'
// export const LOGIN_USER_ERROR_1 = 'provide proper uid'
export const LOGIN_PASS_ERROR = 'Enter Correct User ID / Password'

export const MARKET = {
    MINIMIZE_ICON_DERI: ".derivative-base-container .market-large-widget .widget-header-right .minimizeIcon",
    MINIMIZE_ICON_EQU: ".market-base-container .widget-loader-div .widget-header-right .minimizeIcon",
    MINIMIZE_ICON_CURR: ".currency-base-container .widget-loader-div .widget-header-right .minimizeIcon",
    TABLE_HEAD: ".market-large-widget .widget-container table thead th"
}

export const ORDERPAD = {
    EXCHANGE_SELECT: ".segmentlist-dropdown .select-input-div .select-input .bfsl-font",
    SEGMENT_SELECT: ".segmentlist-dropdown .select-input-div .select-input .bfsl-font",
    STATUS_SELECT: ".orderstatus-dropdown .select-input-div .select-input .bfsl-font",
    DATE_SELECT: ".multiDatePicker-base .date .bfsl-font",

}
export const CHART = {
    CHART_BASE: "#chart_iframe_modal",
    PERIOD_DROPDOWN: "body cq-menu-dropdown",
    STUDIES_DROPDOWN: "body .ps-container"
}
export const ORDER_BOOK = {
    TABLE_HEAD: ".orderBook-table table thead th"
}
