import {
    LOGIN_TYPE,
    DATE_FORMATS,
    EXCHANGES,
    LOCAL_STORAGE,
    ORDER_TYPES,
    ASSET_TYPES,
    PRECISIONS,
    DEFAULT_VALUES,
    BROWSERS,
    ORDER_STATUS,
    PAN_DOB_INPUT,
    TRADE_PRODUCT_TYPES,
    ORDER_MODIFY_TYPE,
    ALERTS_DATES_FILTER_MENU,
    ALERT_SIGN_FILTER,
    ALERT_VALUE_ERROR_MSG,
    OFS_ORDER_STATUS,
    NEWS_FILTER_MENU,
    NCD_SERIES_LIST,
    NCD_ORDER_STATUS,
    ORDERPAD_FIIELD_KEYS,
    RANGE,
    HIGH,
    HIGH_MAIN_PRICE,
    LOW,
    LOW_25,
    LOW_MAIN_PRICE,
    INVALID,
    TICK_SIZE,
    LOT_ERROR,
    EMPTY,
    SEGMENTS,
    SYMBOL_INSTRUMENT_TYPE,
    // MAX_SELL_AMT
} from './Constants'
import { AppSettings } from './AppSettings'
import { getItemFromSessionStorage } from './LocalStorage'
import { getLoginType, getUserID, } from './Bridge'
import { getLangText } from './lang/LangText'
import { LANG_TEXT_KEY } from './NewConstants'

// import moment from 'moment'

// For Encrypt
// 1. Get ASCII character using 'charCodeAt()' 
// 2. Add by '_'
// 3. Using btoa for encrypt base64

// For Decrypt
// 1. Using atob for decrypt base64
// 2. Split by '_'
// 3. Get equivalent value of ASCII character using 'String.fromCharCode()' 

export const getBaseURL = () => {
    let loginType = getLoginType()
    let baseURL = ''
    if (loginType === LOGIN_TYPE.VIRTUAL)
        baseURL = getVirtualTradeBaseURL()
    else if (loginType === LOGIN_TYPE.TRADING)
        baseURL = getTradingBaseURL()
    else if (loginType === LOGIN_TYPE.GUEST)
        baseURL = getGuestUserBaseURL()

    return baseURL
}

export const getVirtualTradeBaseURL = () => {
    return AppSettings.serviceURL_VT
}

export const getTradingBaseURL = () => {
    return AppSettings.serviceURL_TRADING
}

export const getMarketDataBaseURL = () => {
    let loginType = getLoginType()
    let baseURL = ''
    if (loginType === LOGIN_TYPE.VIRTUAL)
        baseURL = getVirtualTradeBaseURL()
    else if (loginType === LOGIN_TYPE.TRADING)
        baseURL = AppSettings.serviceURL_MD
    else if (loginType === LOGIN_TYPE.GUEST)
        baseURL = getGuestMarketDataBaseURL()
    return baseURL
}

export const getGuestMarketDataBaseURL = () => {
    return AppSettings.serviceURL_MD_GUEST
}

export const getCMOTSBaseURL = () => {
    return AppSettings.serviceURL_CMOTS
}

export const getMTFBaseURL = () => {
    return AppSettings.serviceURL_MTF
}

export const getBackOfficeBaseURL = () => {
    return AppSettings.serviceURL_BO
}

export const getNewsBaseURL = () => {
    return AppSettings.serviceURL_NEWS
}

export const getWebServiceBaseURL = () => {
    return AppSettings.webServiceURL
}

export const getAlertBaseUrl = () => {
    return AppSettings.alertUrl
}

export const getWatchlistBaseUrl = () => {
    let loginType = getLoginType()
    let baseURL = ''
    if (loginType === LOGIN_TYPE.TRADING)
        baseURL = getTradingBaseURL()

    return baseURL
}

export const getShieldServiceseUrl = () => {
    return AppSettings.shieldURL
}

export const getGuestUserBaseURL = () => {
    return AppSettings.serviceURL_GUEST
}

export const getIdeasBaseURL = () => {
    return AppSettings.serviceURL_IDEAS
}

export const getSplashBaseURL = () => {
    return AppSettings.serviceURL_SPLASH
}

export const getKey = () => {
    //encrypted form of encryption key
    let data = "OThfOTdfMTA2Xzk3XzEwNl8xMTVfMTAxXzk5XzEwOV8xMTVfMTA1XzEwOF81MF80OF81MF80OA=="

    data = atob(data)

    let arr = data.split('_')

    let decryptData = ''

    for (let i = 0; i < arr.length; i++) {
        decryptData += String.fromCharCode(arr[i]);
    }

    return decryptData
}

export function formSymBlock(symDetails) {
    let symObj = null
    if (symDetails) {
        symObj = symDetails.sym ? symDetails.sym : symDetails
        symObj.companyName = symDetails.companyName
        symObj.dispSym = symDetails.dispSym
        symObj.baseSym = symDetails.baseSym ? symDetails.baseSym : symDetails.baseSym
        if ('hasFutOpt' in symDetails) {
            symObj.hasFutOpt = symDetails.hasFutOpt
        }
    }

    return symObj
}

export const checkEmpty = (value) => {
    if (value) return value
    else if (parseInt(value) === 0) return value
    return '--'
}

export const checkEmptyString = (value) => {
    if (value) return value
    return 'N/A'
}

export const getIndicesList = () => {
    let indicesObj = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.INDICES))
    let ExcList_NSE = []
    let ExcList_BSE = []
    let list = []

    if (indicesObj) {
        if (indicesObj.NSE) {
            ExcList_NSE = indicesObj.NSE
            ExcList_NSE = sortByString(true, ExcList_NSE, "dispSym")
        }
        if (indicesObj.BSE) {
            ExcList_BSE = indicesObj.BSE
            ExcList_BSE = sortByString(true, ExcList_BSE, "dispSym")
        }

        if (ExcList_NSE && ExcList_NSE.length)
            list = ExcList_NSE
        if (ExcList_NSE && ExcList_NSE.length && ExcList_BSE && ExcList_BSE.length) {
            list = []
            list = ExcList_NSE.concat(ExcList_BSE)
            list = sortByString(true, list, "dispSym")
        }
    }
    return { combinedList: list, ExcList_NSE, ExcList_BSE }
}

export const convertToUpperCase = (value) => {
    if (value) {
        value = value.trim().toUpperCase()
        return value
    }
    return ''
}

export const convertToLowerCase = (value) => {
    if (value) {
        value = value.trim().toLowerCase()
        return value
    }
    return ''
}

export const convertToPascalCase = (sentence) => {
    return sentence
        .split(' ')
        .map(word => word[0]
            .toUpperCase()
            .concat(convertToLowerCase(word.slice(1))))
        .join(' ');
}

export const isBuyTradeAction = (value) => {
    if (value)
        if (convertToUpperCase(value) === ORDER_TYPES.BUY)
            return true

    return false
}

export const isSellTradeAction = (value) => {
    if (value)
        if (convertToUpperCase(value) === ORDER_TYPES.SELL)
            return true

    return false
}

export const isCommoditySymbol = (value) => {
    if (value) {
        value = convertToUpperCase(value)
        if (value === EXCHANGES.MCX || value === EXCHANGES.NCO || value === EXCHANGES.BCO || value === EXCHANGES.ICEX)
            return true
    }

    return false
}

export const isCurrencySymbol = (value) => {
    if (value) {
        value = convertToUpperCase(value)
        if (value === EXCHANGES.BCD || value === EXCHANGES.CDS || value === EXCHANGES.MSEI || value === EXCHANGES.MCXSX)
            return true
    }

    return false
}

export const isEquityFutureSymbol = (value) => {
    if (value) {
        value = convertToUpperCase(value)
        if (value === EXCHANGES.NFO || value === EXCHANGES.BFO)
            return true
    }

    return false
}

export const isEquityCashSymbol = (value) => {
    if (value) {
        value = convertToUpperCase(value)
        if (value === EXCHANGES.NSE || value === EXCHANGES.BSE)
            return true
    }

    return false
}

export function isCO_BO_Order(value) {
    if (value) {
        value = convertToUpperCase(value)
        if (value === TRADE_PRODUCT_TYPES.CO || value === TRADE_PRODUCT_TYPES.BO)
            return true
    }

    return false
}

export function isModifyOrder(type) {
    if (type) {
        if (convertToUpperCase(type) === ORDER_MODIFY_TYPE.MODIFY || type === ORDER_MODIFY_TYPE.SQUARE_OFF)
            return true
    }

    return false
}

export function isExecutedOrder(type) {
    if (type) {
        if (convertToUpperCase(type) === convertToUpperCase(ORDER_STATUS.EXECUTED))
            return true
    }

    return false
}

// Return red color(classname) for negative green for possitive
export const getColorCode = (value) => {
    if (value)
        return value.charAt(0) === "-" ? 'negativeColor' : parseFloat(value) === 0 ? 'whiteColor' : 'positiveColor'
    return ""
}

export const getPositive_Negative_ColorCode = (value) => {
    if (value)
        return value.charAt(0) === "-" ? '#D13A43' : parseFloat(value) === 0 ? 'whiteColor' : 'negativeColor'
    return "#AAAAAA"
}

export const getOrderStatusClass = (statusClass) => {
    if (statusClass === ORDER_STATUS.EXECUTED)
        return "buy-clr"
    else if (statusClass === ORDER_STATUS.REJECTED)
        return "sell-clr"
    else if (statusClass === ORDER_STATUS.PENDING || statusClass === ORDER_STATUS.TRIGGER_PENDING)
        return "pend-clr"
    else if (statusClass === ORDER_STATUS.CANCELLED)
        return "can-clr"

    return ""
}

export const getOFSOrderStatusClass = (statusClass) => {
    if (statusClass === OFS_ORDER_STATUS.ORDERED)
        return "buy-clr"
    else if (statusClass === OFS_ORDER_STATUS.REJECTED)
        return "sell-clr"
    else if (statusClass === OFS_ORDER_STATUS.OPEN)
        return "pend-clr"
    else if (statusClass === OFS_ORDER_STATUS.CANCELLED)
        return "can-clr"

    return ""
}

export const getColorBuySellAction = (value) => {
    if (value)
        if (convertToUpperCase(value) === ORDER_TYPES.BUY)
            return "buy-clr"
        else
            return "sell-clr"
    return ""
}

export const checkValidPassword = (value = '') => {
    let validation = {
        isValid: true,
        errorMsg: ''
    }
    let passRegex = /^(?=.*[a-z])(?=.*[A-Z])/
    if (!value.length) {
        validation.isValid = false
        validation.errorMsg = getLangText('PASSWORD_EMPTY', 'VALIDATION')
    } else if (value.length < DEFAULT_VALUES.PASSSWORD_MIN_LEN || value.length > DEFAULT_VALUES.PASSSWORD_MAX_LEN) {
        validation.isValid = false
        validation.errorMsg = getLangText('PASSWORD_LENGTH', 'VALIDATION')
    } else if (!passRegex.test(value) || !specialCharFinder(value)) {
        validation.isValid = false
        validation.errorMsg = getLangText('PASSWORD_SPECIAL_CHAR', 'VALIDATION')
    }

    return validation
}

export const checkValidUserName = (value = '') => {
    let validation = {
        isValid: true,
        errorMsg: ''
    }

    if (!value.length) {
        validation.isValid = false
        validation.errorMsg = getLangText('USERNAME_EMPTY', 'VALIDATION')
    }
    else if (value.length < DEFAULT_VALUES.USERID_MIN_LEN || value.length > DEFAULT_VALUES.USERID_MAX_lEN) {
        validation.isValid = false
        validation.errorMsg = getLangText('USERNAME_LEN_VLDTN', 'VALIDATION')
    }

    return validation
}

export const checkValidPan_DOB = (value = '', type = '') => {
    let validation = {
        isValid: true,
        errorMsg: ''
    }

    if (!value.length) {
        validation.isValid = false
        if (type === PAN_DOB_INPUT.DOB) {
            validation.errorMsg = getLangText('DOB_EMPTY', 'VALIDATION')
        }
        else if (type === PAN_DOB_INPUT.PAN) {
            validation.errorMsg = getLangText('PAN_NO_EMPTY', 'VALIDATION')
        }
        else {
            validation.errorMsg = getLangText('PAN_EMPTY', 'VALIDATION')
        }

    } else {
        if (type) {
            if (type === PAN_DOB_INPUT.DOB) {
                if (!checkInt(value)) {
                    validation.isValid = false
                    validation.errorMsg = getLangText('INVALID_DOB', 'VALIDATION')
                } else if (value.length !== DEFAULT_VALUES.DOB_LEN) {
                    validation.isValid = false
                    validation.errorMsg = getLangText('INVALID_DOB', 'VALIDATION')
                }
            } else {
                if (!(/([A-Z]){5}([0-9]){4}([A-Z]){1}$/.test(value))) {
                    validation.isValid = false
                    validation.errorMsg = getLangText('INVALID_PAN', 'VALIDATION')
                }
            }
        }
        else {
            let firstChar = value.charAt(0)
            if (checkInt(firstChar)) {
                if (!checkInt(value)) {
                    validation.isValid = false
                    validation.errorMsg = getLangText('INVALID_PAN_DOB', 'VALIDATION')
                } else if (value.length !== DEFAULT_VALUES.DOB_LEN) {
                    validation.isValid = false
                    validation.errorMsg = getLangText('INVALID_DOB', 'VALIDATION')
                }
            } else {
                if (!(/([A-Z]){5}([0-9]){4}([A-Z]){1}$/.test(value))) {
                    validation.isValid = false
                    validation.errorMsg = getLangText('INVALID_PAN_DOB', 'VALIDATION')
                }
            }
        }
    }

    return validation
}

export const checkInt = val => {
    let isValid = false
    if (val)
        isValid = /^[0-9\b]+$/.test(val)

    return isValid
}

export const checkFloat = val => {
    let isValid = false
    if (val) {
        isValid = /^[0-9.\b]+$/.test(val)
        if (isValid)
            if (val.split(".").length > 2)
                isValid = false
    }

    return isValid
}

export const checkFloat_withNegative = val => {
    let isValid = false
    if (val) {
        isValid = /^[0-9.-]+$/.test(val)
        if (isValid && val.indexOf('-') !== -1) {
            let minusLen = (val.match(/-/g)).length
            if (minusLen > 1 || val.indexOf('-') !== 0)
                isValid = false
        }
        if (isValid)
            if (val.split(".").length > 2)
                isValid = false
    }

    return isValid
}

export function isValidNumber(val) {
    let isNumber = false
    // if (/^[A-Za-z0-9 ]+$/.test(val))
    if (val)
        isNumber = /^[0-9]*$/.test(val)
    return isNumber
}

export function isValidSearchInput(val) {
    let hasSplChar = false
    // if (/^[A-Za-z0-9 ]+$/.test(val))
    if (val)
        hasSplChar = /[`!@#$%^*()_+\-=[\]{};':"\\|,<>/?~]/.test(val)
    return hasSplChar
}

export function isValidWatchGroupName(val) {
    let valid = true
    // if (/^[A-Za-z0-9 ]+$/.test(val))
    if (val)
        valid = /^[A-Za-z0-9]+$/.test(val)
    return valid
}

export function isValidPassword(val) {
    let hasSplChar = false
    // if (/^[A-Za-z0-9 ]+$/.test(val))
    if (val)
        hasSplChar = /[ ]/.test(val)
    return hasSplChar
}

export function specialCharFinder(val) {
    let hasSplChar = false
    // if (/^[A-Za-z0-9 ]+$/.test(val))
    if (val)
        hasSplChar = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(val)
    return hasSplChar
}

export function negativeValueFinder(val) {
    let hasSplChar = false
    // if (/^[A-Za-z0-9 ]+$/.test(val))
    if (val)
        hasSplChar = /^-?[0-9]*$/.test(val)
    return hasSplChar
}

export function validateEmail(email) {
    const regex = /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/;
    return regex.test(email);
}

// Find decimal places
export const countDecimals = function (value) {
    if (value) {
        if (Math.floor(value) === value)
            return 0;

        return (value.toString().split(".")[1] && value.toString().split(".")[1].length) || 0;
    }
    return 0;
}

export const countHoleNumbers = function (value) {
    if (value && !isNaN(value))
        return (value.toString().split(".")[0] && value.toString().split(".")[0].length) || 0;
    return 0;
}

export const getDecimal_Precision = function (exc) {
    let precisionData = getItemFromSessionStorage(LOCAL_STORAGE.TRADE_DECIMAL_PRECISION)
    if (precisionData)
        precisionData = JSON.parse(precisionData)

    exc = convertToUpperCase(exc)
    let precision = PRECISIONS.DEFAULT_PRECISION
    if (precisionData && precisionData[exc])
        precision = precisionData[exc]

    return precision;
}

// sorting table value by integer
export const sortByInt = (sortAsc, arrayList, key, hasSym = true) => {

    arrayList = arrayList.map((item) => {
        return removePaint(item)
    })
    if (key === 'strike' && hasSym) {
        let sortedList = arrayList.sort((a, b) => {
            if (a.sym[key] && b.sym[key]) {
                //sort string ascending
                if (sortAsc) {
                    return parseFloat(a.sym[key].length ?
                        replaceComma(a.sym[key]) : 0) - parseFloat(b.sym[key].length ? replaceComma(b.sym[key]) : 0)
                }
                return parseFloat(b.sym[key].length ?
                    replaceComma(b.sym[key]) : 0) - parseFloat(a.sym[key].length ? replaceComma(a.sym[key]) : 0)
            }
            return 0
        })

        return sortedList;

    }
    let sortedList = arrayList.sort((a, b) => {
        if (a[key] && b[key]) {
            //sort string ascending
            if (sortAsc) {
                return parseFloat(a[key].length ?
                    replaceComma(a[key]) : 0) - parseFloat(b[key].length ? replaceComma(b[key]) : 0)
            }
            //sort string descending
            return parseFloat(b[key].length ?
                replaceComma(b[key]) : 0) - parseFloat(a[key].length ? replaceComma(a[key]) : 0)

        } else if (!a[key]) {

            return 1
        }
        else if (!b[key]) {

            return -1
        }
        return null
    })
    return sortedList;

}

// export const SortByBigInt = (sortAsc, arrayList, key) => {

//     arrayList = arrayList.map((item) => {
//         return removePaint(item)
//     })
//     let sortedList = arrayList.sort((a, b) => {
//         if (a[key] && b[key]) {
//             /* global BigInt */
//             let data1 = BigInt(a[key])
//             const data2 = BigInt(b[key])
//             //sort string ascending
//             if (sortAsc) {
//                 return (data1 < data2) ? -1 : ((data1 > data2) ? 1 : 0)
//                 // return a[key] - b[key]
//             }
//             //sort string descending
//             return (data1 > data2) ? -1 : ((data1 < data2) ? 1 : 0)
//             // return b[key] - a[key]            
//         }
//         return null
//     })

//     return sortedList;
// }

// sorting table value by string
export const sortByString = (sortAsc, arrayList, key1, key2) => {

    if (arrayList && arrayList.length > 1) {
        arrayList = arrayList.map((item) => {
            return removePaint(item)
        })

        let nameA = '',
            nameB = '';
        let sortedList = arrayList.sort((a, b) => {
            if (key2) {
                if (a[key1][key2] && b[key1][key2]) {
                    nameA = a[key1][key2].toLowerCase()
                    nameB = b[key1][key2].toLowerCase();
                }
            } else {
                if (a[key1] && b[key1]) {
                    nameA = a[key1].toLowerCase()
                    nameB = b[key1].toLowerCase();
                }
            }
            //sort string ascending
            if (sortAsc) {
                if (nameA < nameB)
                    return -1
                if (nameA > nameB)
                    return 1
                return 0
            }
            //sort string descending
            if (nameA > nameB)
                return -1
            if (nameA < nameB)
                return 1
            return 0

        })

        return sortedList;
    } return arrayList
}

// export const convertDate = (date, fromFormat, toFormat = 'MM/DD/YYY h:mm:ss') => moment(date, fromFormat).format(toFormat);

export const sortByDate = (sortAsc, arrayList, key) => {

    if (arrayList && arrayList.length > 1) {
        arrayList = arrayList.map((item) => {
            return removePaint(item)
        })
        let sortedList = arrayList.sort((a, b) => {
            if (a[key] && b[key]) {
                let firstdate = getFormatedDate(a[key], 0, DATE_FORMATS.DDMMYYYY, true).stringDate
                let seconddate = getFormatedDate(b[key], 0, DATE_FORMATS.DDMMYYYY, true).stringDate
                let date1 = new Date("01/01/1970" + firstdate)
                let date2 = new Date("01/01/1970" + seconddate)
                if (sortAsc) {
                    return (date1) - (date2)
                }
                return (date2) - (date1)

            }
            return null
        })
        return sortedList;
    } return arrayList
}

export const sortByDateBO = (sortAsc, arrayList, key) => {
    if (arrayList && arrayList.length > 1) {
        arrayList = arrayList.map((item) => {
            return removePaint(item)
        })

        let sortedList = arrayList.sort((a, b) => {

            if (a[key] && b[key]) {
                let firstdate = getFormatedDate(a[key], 0, DATE_FORMATS.DDMMYYYY, true).stringDate
                let seconddate = getFormatedDate(b[key], 0, DATE_FORMATS.DDMMYYYY, true).stringDate
                let keyA = new Date(getValidDate(firstdate))
                let keyB = new Date(getValidDate(seconddate))
                if (sortAsc) {
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) return 1;
                }
                else {
                    if (keyA < keyB) return 1;
                    if (keyA > keyB) return -1;
                }

            }
            return null
        })
        return sortedList;
    } return arrayList
}

// sorting icon - UP/DOWN
export const sortFlagFunc = (arrayFlagList, orderFlag, key1, key2) => {
    let key = key2 ? key2 : key1

    let updatedSortFlag = arrayFlagList.map((item) => {
        if (item.column === key)
            if (orderFlag)
                item.sortAsc = true
            else
                item.sortAsc = false
        else
            item.sortAsc = null;
        return item;
    })

    return updatedSortFlag;
}

// Replace comma in value
export const replaceComma = (value) => {
    if (value) {
        value = value.toString()
        return value.replace(/,/g, '')
    }
    return value
}

// Finds the given key and replace with the given key
export const findAndReplace = (value, findKey, replaceKey = "") => {
    if (value && findKey) {
        value = value.toString()
        let regex = new RegExp(findKey, "g")
        return value.replace(regex, replaceKey)
    }
    return value
}

// Used to check whether the string contains Special characters
export const checkValidString = (string) => {
    if (/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(string))
        return false

    return true
}

export const checkValidWatchlistName = (wName) => {
    let valid = isValidWatchGroupName(wName)

    return valid;
}

export const convertCommaSeparated = (value, floatDigits = PRECISIONS.DEFAULT_COMMA_SEPARATION) => {
    let updatedValue = 0
    if (value)
        updatedValue = Number(parseFloat(value).toFixed(floatDigits)).toLocaleString('en-IN', {
            minimumFractionDigits: floatDigits
        });

    return updatedValue
}

export const convertToFloat = (value, floatDigits = PRECISIONS.DEFAULT_PRECISION) => {
    if (value)
        value = parseFloat(value).toFixed(floatDigits)

    return value
}

// Return classname for streamnig data
export const getUpDownFlash = (prevValue, newValue, currClass) => {
    if (!prevValue || !newValue)
        return '';

    let diff = parseFloat(replaceComma(newValue)) - parseFloat(replaceComma(prevValue))
    if (diff === 0)
        return '';
    else if (diff > 0.0)
        return currClass ? (currClass === 'flash-positive' ? 'flash-positive2' : 'flash-positive') : 'flash-positive';

    return currClass ? (currClass === 'flash-negative' ? 'flash-negative2' : 'flash-negative') : 'flash-negative';
}

export const getHighlightFlash = (prevValue, newValue, currClass) => {
    if (!prevValue || !newValue)
        return '';

    if (prevValue !== newValue)
        return currClass ?
            (currClass === 'flash-highlight' ? 'flash-highlight2' : 'flash-highlight') : 'flash-highlight';
    return '';
}

export const applyPaint = (prevQuote, newQuote) => {

    // newQuote.ltpClass = getUpDownFlash(prevQuote.ltp, newQuote.ltp, prevQuote.ltpClass);

    // newQuote.chngClass = getHighlightFlash(prevQuote.chng, newQuote.chng, prevQuote.chngClass);
    // newQuote.chngPerClass = getHighlightFlash(prevQuote.chngPer, newQuote.chngPer, prevQuote.chngPerClass);

    return newQuote;
}

export const removePaint = (prevQuote) => {

    prevQuote.ltpClass = ''

    prevQuote.chngClass = ''
    prevQuote.chngPerClass = ''

    return prevQuote;
}

export function getValidStringDate(date) {
    let validDate = ''
    if (date) {
        let dateArr = date.split("-")
        validDate = dateArr[1] + "/" + dateArr[0] + "/" + dateArr[2]
    }
    return validDate
}

export function getUpcomingOpenDate(date) {
    let openDate = ''
    if (date) {
        let dateArr = date.split("-")
        openDate = dateArr[0]
    }
    return openDate
}

export function getUpcomingEndDate(date) {
    let endDate = ''
    if (date) {
        let dateArr = date.split("-")
        if (dateArr[1])
            endDate = dateArr[1]
        else
            endDate = date
    }
    return endDate
}

export function splitByHypen(value) {
    // getting second value after spliting the string
    let valueSplit = value.split("-")[1];
    return valueSplit
}
// if date param is empty, fn take current date
// addDay param is used to add number of days to the given date
export const getFormatedDate = (date = '', addDay = 0, format = DATE_FORMATS.DEFAULT, validGivenDate = false) => {
    let givenDate = '';
    if (date === "")
        givenDate = new Date();
    else {
        let validDate = ''
        if (!validGivenDate)
            validDate = getValidStringDate(date)
        else
            validDate = date
        givenDate = new Date(validDate)
    }

    if (addDay !== 0) {
        let holeDate = givenDate.setDate(givenDate.getDate() + (addDay))
        givenDate = new Date(holeDate)
    }

    let dd = givenDate.getDate();
    let mm = givenDate.getMonth();
    let yyyy = givenDate.getFullYear();
    let yy = yyyy.toString().substr(3)
    let time = givenDate.toLocaleTimeString()
    let time24 = givenDate.toLocaleTimeString('en-GB', { hour12: false })
    let mmm = givenDate.toLocaleString('default', { month: 'short' });

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    let formatedDate = givenDate;

    mm = parseInt(mm) + 1;
    if (mm < 10) mm = '0' + mm;

    let stringDate = "";
    if (format === DATE_FORMATS.DEFAULT)
        stringDate = yyyy + "-" + mm + "-" + dd;
    else if (format === DATE_FORMATS.DDMMYYYY) {
        stringDate = dd + "/" + mm + "/" + yyyy
    } else if (format === DATE_FORMATS.DDMMMYYYY) {
        stringDate = dd + " " + mmm + " " + yyyy
    } else if (format === DATE_FORMATS.MMDDYY) {
        stringDate = dd + "-" + mm + "-" + yy + " " + time
    } else if (format === DATE_FORMATS.HHMMSS) {
        stringDate = time
    } else if (format === DATE_FORMATS.DDMMYYYY_HYPEN) {
        stringDate = dd + "-" + mm + "-" + yyyy
    }
    else if (format === DATE_FORMATS.YYYYMMDD) {
        stringDate = yyyy + "-" + mm + "-" + dd + " " + time24
    }
    return { formatedDate, stringDate }
}

export const getValidDate = (date) => {
    if (date) {
        let dateArr = date.split("/")
        let validDate = dateArr[1] + "/" + dateArr[0] + "/" + dateArr[2]
        let convertDate = new Date(validDate).toLocaleString()
        return convertDate
    }
    return ''
}

export function checkToday(date) {
    let formatedDate = getFormatedDate(date).formatedDate
    let today = getFormatedDate().formatedDate
    today.setHours(0, 0, 0, 0);
    if (formatedDate.getTime() === today.getTime())
        return true

    return false
}

export function findTickSize(decimalValue, getPrice, tickSize) {

    let findTSize = Math.pow(10, decimalValue);

    let price = parseFloat(getPrice).toFixed(decimalValue);

    let tick = parseFloat(tickSize).toFixed(decimalValue);

    let newPrice = Math.round(price * findTSize);

    let newTick = Math.round(tick * findTSize);

    let result = (Math.round(newPrice % newTick)) / findTSize;

    return result;

}

export function getTime(date) {
    if (date) {
        let dateArr = date.split("/")
        let validDate = dateArr[1] + "/" + dateArr[0] + "/" + dateArr[2]
        let convertDate = new Date(validDate).toLocaleTimeString()
        return convertDate
    }
    return date
}

export function scrollToTop(x = 0, y = 0) {
    window.scrollTo(x, y);
}

export function getDispSymbolName(symDetails) {
    let primaryName, secondaryName,excName = ""
    if (symDetails) {
        let symObj = symDetails.sym ? symDetails.sym : symDetails
        if (symObj) {
            primaryName = symObj.dispSym ? symObj.dispSym : symDetails.dispSym

            if (convertToUpperCase(symObj.asset) === ASSET_TYPES.EQUITY) {
                secondaryName = symObj.companyName ? symObj.companyName : symDetails.companyName
            } else {
                secondaryName = symObj.baseSym ? symObj.baseSym : symDetails.baseSym
            }
            if(convertToUpperCase(symObj.asset) === SEGMENTS.OPTION){
                excName=getLangText('OPT')

            }else if(convertToUpperCase(symObj.asset) === SEGMENTS.FUTURE){
                
                excName=getLangText('FUT')
            }
        }

        primaryName = checkEmpty(primaryName)
        secondaryName = checkEmpty(secondaryName)
        excName=checkEmpty(excName)
    }
    return { primaryName, secondaryName,excName }
}

export function getDispSymbolNameInSearch(symDetails) {
    let primaryName, secondaryName,secondaryNameStrike,excName = ""
    console.log("symDetails",symDetails)
    if (symDetails) {
        let symObj = symDetails.sym ? symDetails.sym : symDetails
        if (symObj) {
            if (convertToUpperCase(symObj.asset) === ASSET_TYPES.EQUITY)  
                primaryName = symObj.dispSym ? symObj.dispSym : symDetails.dispSym
            else if(convertToUpperCase(symObj.asset) === SEGMENTS.OPTION){
                primaryName = symDetails.baseSym+" "+getFormatedDate(symObj.expiry,0,DATE_FORMATS.DDMMMYYYY).stringDate
                excName=getLangText('OPT')

            }else if(convertToUpperCase(symObj.asset) === SEGMENTS.FUTURE){
                primaryName = symObj.baseSym ? symObj.baseSym : symDetails.baseSym
                excName=getLangText('FUT')
            }

            if (convertToUpperCase(symObj.asset) === ASSET_TYPES.EQUITY) {
                secondaryName = symObj.companyName ? symObj.companyName : symDetails.companyName
            } else if(convertToUpperCase(symObj.asset) === SEGMENTS.OPTION){
                secondaryName = symObj.optionType  
                secondaryNameStrike = parseInt(symObj.strike)
            }else {
                secondaryName =getFormatedDate(symObj.expiry,0,DATE_FORMATS.DDMMMYYYY).stringDate
                
            }
        }

        primaryName = checkEmpty(primaryName)
        secondaryName = checkEmpty(secondaryName)
        secondaryNameStrike= checkEmpty(secondaryNameStrike)
        excName=checkEmpty(excName)
    }
    return { primaryName, secondaryName,secondaryNameStrike,excName}
}

export function getDispTradeSymbolName(symDetails) {
    let primaryName, secondaryName = ""
    if (symDetails) {
        let symObj = symDetails.sym ? symDetails.sym : symDetails
        if (symObj) {
            primaryName = symObj
            secondaryName = symObj

        }
        primaryName = checkEmpty(primaryName)
        secondaryName = checkEmpty(secondaryName)
    }
    return { primaryName, secondaryName }
}

export function checkIsOnline() {
    if (navigator.onLine)
        return true

    return false
}

export const getOfflineMsg = () => {

    if (checkIsOnline())
        return ""
    return "No network connectivity, please try again later (Failed to fetch)"
}

export function streamingDateFormat(value) {
    if (!value)
        return value;

    value = value * 1000;
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let dd = new Date(value).getDate()
    let mm = new Date(value).getMonth()
    let yyyy = new Date(value).getFullYear()
    let hh = new Date(value).getHours()
    let min = new Date(value).getMinutes()
    let ss = new Date(value).getSeconds()
    if (hh < 10)
        hh = '0' + hh
    if (min < 10)
        min = '0' + min
    if (ss < 10)
        ss = '0' + ss
    let time = hh + ':' + min + ':' + ss

    if (dd < 10) dd = '0' + dd;
    let fullDate = dd + ' ' + month[mm] + ' ' + yyyy + ', ' + time

    return fullDate;
}

export function getCurrentFinancialYear(strDocDate) {
    let startYear = "";
    let endYear = "";
    let docDate = new Date(strDocDate);
    if ((docDate.getMonth() + 1) <= 3) {
        startYear = docDate.getFullYear() - 1;
        endYear = docDate.getFullYear();
    } else {
        startYear = docDate.getFullYear();
        endYear = docDate.getFullYear() + 1;
    }
    return { startDate: '01/Apr/' + startYear, endDate: '31/Mar/' + endYear, startYear: startYear, endYear: endYear };
}

export function cacheSearch(searchString, list, identifierKey, identifierKey2) {
    let symbolArray = Object.assign([], list)
    let filteredArray = symbolArray.filter((item) => {
        if (checkSymString(searchString, item[identifierKey]))
            return item
        else if (checkSymString(searchString, item[identifierKey2]))
            return item
        return null
    })
    return filteredArray
}

function checkSymString(query, str) {
    let queryArr = query.split(' ')
    return queryArr.every((qur) => {
        qur = convertToUpperCase(qur)
        str = convertToUpperCase(str)

        let regex = new RegExp(`${qur}`, 'gi')
        return regex.test(str)
    })
}

export function getBrowser() {
    let ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') !== -1) {
        if (ua.indexOf('chrome') > -1)
            return BROWSERS.CHROME
        return BROWSERS.SAFARI
    }

    if (ua.indexOf("firefox") > -1)
        return BROWSERS.FIREFOX

    return ''
}

export function chartWidgetMenusFilter(sym) {
    if (sym) {
        let instrument = convertToLowerCase(sym.instrument)
        if (instrument.includes('idx') || sym.exc === EXCHANGES.NFO) {
            return true
        }
        return false
    }
    return false

}
//for lcl and ucl remove in indices
export function indicesInstrumentFilter(sym) {
    if (sym) {
        let instrument = convertToLowerCase(sym.instrument)
        if (instrument.includes('idx')) {
            return true
        }
        return false
    }
    return false
}
export function placeGetRequest(url, successCB, errorCB) {
    fetch(
        url, { method: 'GET', credentials: 'include' }).then(response => {
        if (response.status === 200) {
            successCB(response)
        } else if (response.status === 204) {
            errorCB({ message: "No content" })
        } else if (response.status === 440) {
            errorCB({ message: 'Error' })
        }
    })
}

export function convertToCrore(value) {
    if (value) {
        value = replaceComma(value)
        // dividing by 1 crore
        if (isNaN(value))
            return value
        value = value / 10000000
        value = parseFloat(value).toFixed(4);
        return value
    }

    return value
}

// export function getTotalCost(value) {
//     if (value) {
//         let totalGst, totalStt, totalStmpDte, totalSebiTax, totalTrnTax, totalOtrchrg, totalTotlChg = 0;

//         for (let i = 0; i < value.length; i++) {
//             totalGst += value[i].gst;
//             totalStt += value[i].stt
//             totalStmpDte += value[i].stmpDte
//             totalSebiTax += value[i].sebiTax
//             totalTrnTax += value[i].trnTax
//             totalOtrchrg += value[i].otrChrg
//             totalTotlChg += value[i].totlChg
//         }
//         return value
//     }
//     return value
// }

export function calculatePNL(avgPrice, ltp, qty, exc) {
    let pnl = "0.00"
    if (parseFloat(replaceComma(avgPrice))) {
        pnl = convertCommaSeparated(((parseFloat(replaceComma(ltp)) -
            parseFloat(replaceComma(avgPrice))) * parseFloat(qty)).toString(),
        getDecimal_Precision(exc))
    }

    return pnl
}

export function calculatePNLPer(buyValue, avgPrice, pnl, exc) {
    let pnlper = "0.00"
    if ((parseFloat(replaceComma(buyValue))) && parseFloat(replaceComma(avgPrice))) {
        pnlper = convertCommaSeparated(((parseFloat(replaceComma(pnl)) * 100) /
            parseFloat(replaceComma(buyValue))).toString(),
        getDecimal_Precision(exc))
    }
    return pnlper
}

export function calculatePortfolioValue(ltp, qty) {
    let pfVal = "0.00"
    pfVal = convertCommaSeparated(convertToFloat(parseFloat(replaceComma(ltp)) *
        parseInt(replaceComma(qty))));
    return pfVal;
}

export function calculateDayspnl(avgPrice, ltp, closeval, qty, exc) {
    let dayspnl = "0.00"
    if (parseFloat(replaceComma(avgPrice))) {
        dayspnl = convertCommaSeparated(((parseFloat(replaceComma(ltp)) -
            parseFloat(replaceComma(closeval))) * parseFloat(qty)).toString(),
        getDecimal_Precision(exc))
    }
    return dayspnl;
}

// Invested amount calculation in Holdings shifted to FE from MW on 18-04-2022
export function calculateInvested(avgPrice, qty, exc) {
    let invested = "0.00"
    if (parseFloat(replaceComma(avgPrice))) {
        invested = convertCommaSeparated((parseFloat(replaceComma(avgPrice)) *
            parseInt(replaceComma(qty))).toString(), getDecimal_Precision(exc))
    }
    return invested;
}

export const isSafari = () => {
    if (getBrowser().toLowerCase() === "safari") {
        return true;
    }
    return false;
}

export const getCriteriaType = (streamOptions, signOptions) => {

    let c = {
        ltp: {
            greater: "gp",
            less: "lp",
            equal: "ep"
        },
        atp: {
            greater: "ga_p",
            less: "la_p",
            equal: "ea_p"
        },
        high: {
            greater: "gh_p",
            less: "lh_p",
            equal: "eh_p"
        },
        low: {
            greater: "gl_p",
            less: "ll_p",
            equal: "el_p"
        },
        open: {
            greater: "go_p",
            less: "lo_p",
            equal: "eo_p"
        },
        close: {
            greater: "gc_p",
            less: "lc_p",
            equal: "ec_p"
        },
        chngPer: {
            greater: "gp_p",
            less: "lp_p",
            equal: "ep_p"
        },
        ltq: {
            greater: "glt_v",
            less: "llt_v",
            equal: "elt_v"
        },
        vol: {
            greater: "gv",
            less: "lv",
            equal: "ev"
        },
        bq: {
            greater: "gtb_v",
            less: "ltb_v",
            equal: "etb_v"
        },
        sq: {
            greater: "gts_v",
            less: "lts_v",
            equal: "ets_v"
        },
        OI: {
            greater: "goi_v",
            less: "loi_v",
            equal: "eoi_v"
        },
    }
    return c[streamOptions][signOptions]
}

export function getDays(item) {
    let date = new Date();
    let firstDay = ''
    let lastDay = ''
    if (item.name === ALERTS_DATES_FILTER_MENU.TODAY) {
        firstDay = new Date();
        firstDay.setHours(0, 0, 0, 0);
        lastDay = new Date();
    }
    else if (item.name === ALERTS_DATES_FILTER_MENU.YESTERDAY) {
        let yesterday = new Date(date);
        yesterday.setDate(yesterday.getDate() - 1);
        firstDay = yesterday
        firstDay.setHours(0, 0, 0, 0);
        lastDay = yesterday
    }
    else if (item.name === ALERTS_DATES_FILTER_MENU.LAST_WEEK) {
        // console.log("reached")
        // if(date.getDay()!==0){
        //     firstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()-7-(date.getDay()-1));
        //     lastDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()-(date.getDay()-1));
        // }
        // else{
        //     firstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() -13);
        //     lastDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 6);
        // }
        // // let lastWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
        // // let lastStart = new Date(lastWeek.getFullYear(), lastWeek.getMonth(), lastWeek.getDate() - 7);
        // // firstDay = lastStart
        // // lastDay = lastWeek
        firstDay = new Date(date.setDate(date.getDate() - 7));
        lastDay = new Date();
    }
    else if (item.name === ALERTS_DATES_FILTER_MENU.THIS_MONTH) {
        firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        lastDay = new Date();
    }
    else if (item.name === ALERTS_DATES_FILTER_MENU.LAST_MONTH) {
        firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
    }
    else if (item.name === ALERTS_DATES_FILTER_MENU.CUSTOM_DATE) {
        firstDay = new Date();
        firstDay.setHours(0, 0, 0, 0);
        lastDay = new Date();
    }
    // console.log("first", firstDay)
    return { firstDay, lastDay }
}

export function getValidAlertValue(streamKey, signKey, alertVal, streamVal) {
    // console.log(streamKey,signKey,alertVal,parseFloat(replaceComma(streamVal)))
    // console.log(isNaN(parseInt(alertVal)))
    // console.log((parseFloat(alertVal)))
    // console.log((Math.abs(alertVal)))
    // console.log(parseFloat(streamVal))
    // console.log((parseFloat(replaceComma(streamVal))))
    let msgAlert = " "
    let valid = " "
    if (!isNaN(parseInt(alertVal))) {
        if (signKey === ALERT_SIGN_FILTER[0].key) {
            if (parseFloat(alertVal) <= parseFloat(replaceComma(streamVal))) {
                msgAlert = getLangText(ALERT_VALUE_ERROR_MSG[0].langKey) + streamKey
                valid = false
            }
            else {
                valid = true
            }
        }
        else if (signKey === ALERT_SIGN_FILTER[1].key) {
            if (parseFloat(alertVal) >= parseFloat(replaceComma(streamVal))) {
                msgAlert = getLangText(ALERT_VALUE_ERROR_MSG[1].langKey) + streamKey
                valid = false
            }
            else {
                valid = true
            }
        }
        else if (signKey === ALERT_SIGN_FILTER[2].key) {
            if ((parseFloat(alertVal)) === parseFloat(replaceComma(streamVal))) {
                msgAlert = getLangText(ALERT_VALUE_ERROR_MSG[2].langKey) + streamKey
                valid = false
            }
            else {
                valid = true
            }
        }
        else {
            msgAlert = getLangText(ALERT_VALUE_ERROR_MSG[3].langKey)
            valid = false
        }
    }
    else {
        msgAlert = getLangText(ALERT_VALUE_ERROR_MSG[3].langKey)
        valid = false
    }
    return { msgAlert, valid }
}

export function containsNumbers(data) {
    let passRegex = /[0-9]/
    if (passRegex.test(data)) {
        return true
    }
    return false

}

export function getTimeInterval(item) {
    let date = new Date()
    let firstDay = ''
    let lastDay = ''
    let newsPeriod = ''
    if (item === NEWS_FILTER_MENU.LAST_HOUR) {
        date.setHours(date.getHours() - 1);
        firstDay = date
        lastDay = new Date()
    }
    else if (item === NEWS_FILTER_MENU.LAST_24_HOURS) {
        date.setDate(date.getDate() - 1);
        firstDay = date
        lastDay = new Date()
    }
    else if (item === NEWS_FILTER_MENU.LAST_WEEK) {
        date.setDate(date.getDate() - 7);
        firstDay = date
        lastDay = new Date()
    }
    else if (item === NEWS_FILTER_MENU.LAST_MONTH) {
        date.setDate(date.getDate() - 30);
        firstDay = date
        lastDay = new Date()
        // firstDay.setHours(12, 0, 0, 0)
    }
    else if (item === NEWS_FILTER_MENU.TODAY) {
        newsPeriod = "Today"
    }
    else if (item === NEWS_FILTER_MENU.NEXT_WEEK) {
        newsPeriod = "Week"
    }
    else if (item === NEWS_FILTER_MENU.NEXT_2_WEEKS) {
        newsPeriod = "15Day"
    }
    else if (item === NEWS_FILTER_MENU.NEXT_1_MONTH) {
        newsPeriod = "30Day"
    }
    return { firstDay, lastDay, newsPeriod }
}

export const sortByDateBrokBO = (sortAsc, arrayList, key) => {
    if (arrayList && arrayList.length > 1) {
        let sortedList = arrayList.sort((a, b) => {
            if (a[key] && b[key]) {
                let firstdate = getFormatedDate(a[key], 0, DATE_FORMATS.DDMMYYYY, true).stringDate
                let seconddate = getFormatedDate(b[key], 0, DATE_FORMATS.DDMMYYYY, true).stringDate
                let keyA = new Date(getValidDate(firstdate))
                let keyB = new Date(getValidDate(seconddate))
                if (sortAsc) {
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) return 1;
                }
                else {
                    if (keyA < keyB) return 1;
                    if (keyA > keyB) return -1;
                }

            }
            return null
        })
        return sortedList;
    } return arrayList
}

export const checkValidMobNo = (value = '') => {
    let validation = {
        isValid: true,
        errorMsg: ''
    }
    if (!value.length) {
        validation.isValid = false
        validation.errorMsg = getLangText('MOBNO_EMPTY')
    }

    else if (value.length < 10) {
        validation.isValid = false
        validation.errorMsg = getLangText('INVALID_MOBNO')
    }
    return validation;
}

export const convertNCDSeriesCode = (val) => {
    // let newVal;
    switch (val) {
        case NCD_SERIES_LIST.SERIES_1:
            return "S1"
        case NCD_SERIES_LIST.SERIES_2:
            return "S2"
        case NCD_SERIES_LIST.SERIES_3:
            return "S3"
        case NCD_SERIES_LIST.SERIES_4:
            return "S4"
        case NCD_SERIES_LIST.SERIES_5:
            return "S5"
        case NCD_SERIES_LIST.SERIES_6:
            return "S6"
        case NCD_SERIES_LIST.SERIES_7:
            return "S7"
        case NCD_SERIES_LIST.SERIES_8:
            return "S8"
        case NCD_SERIES_LIST.SERIES_9:
            return "S9"
        case NCD_SERIES_LIST.SERIES_10:
            return "S10"
        default:
            return null
    }

}

export const getNCDOrderStatusClass = (statusClass) => {
    if (statusClass === NCD_ORDER_STATUS.SUCCESS)
        return "buy-clr"
    else if (statusClass === NCD_ORDER_STATUS.REJECTED)
        return "sell-clr"
    else if (statusClass === NCD_ORDER_STATUS.PENDING)
        return "pend-clr"
    else if (statusClass === NCD_ORDER_STATUS.CANCELLED)
        return "can-clr"

    return ""
}

export const getTaxReportFinancialYearRanges = () => {
    let date = new Date()
    let taxrange = []
    let startYear = getCurrentFinancialYear(date).startYear
    let endYear = getCurrentFinancialYear(date).endYear
    for (let i = 0; i <= 3; i++) {
        taxrange.push({
            [LANG_TEXT_KEY]: "FY" + "_" + (startYear - i) + "_" + ((endYear - i).toString().substring(2)),
            name: "FY" + (startYear - i) + "-" + ((endYear - i).toString().substring(2))
        })
    }
    return taxrange
}

export function toPascalCase(val) {
    return val
        .toLowerCase()
        .replace(new RegExp(/[-_]+/, 'g'), ' ')
        .replace(new RegExp(/[^\w\s]/, 'g'), '')
        .replace(
            new RegExp(/\s+(.)(\w*)/, 'g'),
            ($1, $2, $3) => `${$2.toUpperCase() + $3}`
        )
        .replace(new RegExp(/\w/), s => s.toUpperCase());
}

export function hasNumber(val) {
    return /\d/.test(val);
}
export const getOrderPadErrorMessage = (errorCategory, item) => {
    switch (errorCategory) {
        case EMPTY:
        {
            switch (item) {
                case ORDERPAD_FIIELD_KEYS.QUANTITY:
                    return getLangText("ORDERPAD_QUANTITY_EMPTY")
                case ORDERPAD_FIIELD_KEYS.PRICE:
                    return getLangText("ORDERPAD_PRICE_EMPTY")
                case ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE:
                    return getLangText("ORDERPAD_TRIGGER_PRICE_EMPTY")
                case ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS:
                    return getLangText("ORDERPAD_TRAILING_STOP_LOSS_EMPTY")
                case ORDERPAD_FIIELD_KEYS.STOP_LOSS:
                    return getLangText("ORDERPAD_STOP_LOSS_SELL_EMPTY")
                case ORDERPAD_FIIELD_KEYS.SQUARE_OFF:
                    return getLangText("ORDERPAD_SQUARE_OFF_SELL_EMPTY")
                case ORDERPAD_FIIELD_KEYS.DIS_QTY:
                    return getLangText("ORDERPAD_DIS_QUANTITY_EMPTY")
                case ORDERPAD_FIIELD_KEYS.GTD_DATE:
                    return getLangText("ORDERPAD_DATE_EMPTY")
                case ORDERPAD_FIIELD_KEYS.UPI_ID:
                    return getLangText("ORDERPAD_UPI_EMPTY")
                default:
                    return null
            }
        }
        case RANGE:
        {
            switch (item) {
                case ORDERPAD_FIIELD_KEYS.PRICE:
                    return getLangText("ORDERPAD_PRICE_RANGE")
                case ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE:
                    return getLangText("ORDERPAD_TRIGGER_PRICE_RANGE")
                case ORDERPAD_FIIELD_KEYS.STOP_LOSS:
                    return getLangText("ORDERPAD_STOP_LOSS_RANGE")
                case ORDERPAD_FIIELD_KEYS.SQUARE_OFF:
                    return getLangText("ORDERPAD_SQUARE_OFF_RANGE")
                case ORDERPAD_FIIELD_KEYS.GTC_PRICE:
                    return getLangText("ORDERPAD_GTC_PRICE_RANGE")
                case ORDERPAD_FIIELD_KEYS.DIS_QTY:
                    return getLangText("ORDERPAD_DIS_QTY_RANGE")
                case ORDERPAD_FIIELD_KEYS.QUANTITY:
                    return getLangText("ORDERPAD_QUANTITY_RANGE")
                default:
                    return null
            }
        }
        case HIGH:
        {
            switch (item) {
                case ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE:
                    return getLangText("ORDERPAD_GREATER_TRIGGER_PRICE")
                case ORDERPAD_FIIELD_KEYS.STOP_LOSS:
                    return getLangText("ORDERPAD_GREATER_STOP_LOSS")
                case ORDERPAD_FIIELD_KEYS.QUANTITY:
                    return getLangText("ORDERPAD_GREATER_QUANTITY")
                case ORDERPAD_FIIELD_KEYS.SQUARE_OFF:
                    return getLangText("ORDERPAD_HIGH_SQUARE_OFF")
                default:
                    return null
            }
        }
        case HIGH_MAIN_PRICE:
        {
            switch (item) {
                case ORDERPAD_FIIELD_KEYS.PRICE:
                    return getLangText("ORDERPAD_GREATER_PRICE_ML")
                case ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE:
                    return getLangText("ORDERPAD_GREATER_TRIGGER_PRICE_ML")
                default:
                    return null
            }
        }
        case LOW:
        {
            switch (item) {
                case ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE:
                    return getLangText("ORDERPAD_LESS_TRIGGER_PRICE")
                case ORDERPAD_FIIELD_KEYS.DIS_QTY:
                    return getLangText("ORDERPAD_LOW_DIS_QTY")
                case ORDERPAD_FIIELD_KEYS.SQUARE_OFF:
                    return getLangText("ORDERPAD_LOW_SQUARE_OFF")
                case ORDERPAD_FIIELD_KEYS.QUANTITY:
                    return getLangText("ORDERPAD_LOW_QUANTITY")
                case ORDERPAD_FIIELD_KEYS.STOP_LOSS:
                    return getLangText("ORDERPAD_LESSER_STOP_LOSS")
                default:
                    return null
            }
        }
        case LOW_25:
        {
            switch (item) {
                case ORDERPAD_FIIELD_KEYS.DIS_QTY:
                    return getLangText("ORDERPAD_LOW_DIS_QTY_25")
                default:
                    return null
            }
        }
        case LOW_MAIN_PRICE:
        {
            switch (item) {
                case ORDERPAD_FIIELD_KEYS.PRICE:
                    return getLangText("ORDERPAD_LESS_PRICE_ML")
                case ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE:
                    return getLangText("ORDERPAD_LESS_TRIGGER_PRICE_ML")
                default:
                    return null
            }
        }
        case INVALID:
        {
            switch (item) {
                case ORDERPAD_FIIELD_KEYS.QUANTITY:
                    return getLangText("ORDERPAD_QUANTITY_INVALID")
                case ORDERPAD_FIIELD_KEYS.PRICE:
                    return getLangText("ORDERPAD_PRICE_INVALID")
                case ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE:
                    return getLangText("ORDERPAD_TRIGGER_PRICE_INVALID")
                case ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS:
                    return getLangText("ORDERPAD_TRAILING_STOP_LOSS_INVALID")
                case ORDERPAD_FIIELD_KEYS.STOP_LOSS:
                    return getLangText("ORDERPAD_STOP_LOSS_SELL_INVALID")
                case ORDERPAD_FIIELD_KEYS.SQUARE_OFF:
                    return getLangText("ORDERPAD_SQUARE_OFF_SELL_INVALID")
                case ORDERPAD_FIIELD_KEYS.DIS_QTY:
                    return getLangText("ORDERPAD_DIS_QUANTITY_INVALID")
                case ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION:
                    return getLangText("ORDERPAD_")
                default:
                    return null
            }
        }
        case TICK_SIZE:
            return getLangText("ORDERPAD_TICK_SIZE_ERROR")
        case LOT_ERROR:
        {
            switch (item) {
                case ORDERPAD_FIIELD_KEYS.DIS_QTY:
                    return getLangText("ORDERPAD_LOT_SIZE_DIS_QTY")
                case ORDERPAD_FIIELD_KEYS.QUANTITY:
                    return getLangText("ORDERPAD_QUANTITY_RANGE")
                default:
                    return null
            }
        }
        // case MAX_SELL_AMT:
        // {
        //     switch(item) {
        //         case ORDERPAD_FIIELD_KEYS.QUANTITY:
        //             return getLangText("ORDERPAD_GREATER_QUANTITY")
        //         default :
        //             return null
        //     }
        // }
        default:
            return null
            
    }
}

// export const getOrderPadMsgVariableName = (val) => {
//     switch(val) {
//         case "triggerPrice" :
//             return getLangText("TRIGGER_PRICES")
//         case 'trailStopLoss' :
//             return getLangText("TRAILING_STOP_LOSS")
//         case 'stopLoss' :
//             return getLangText("STOP_LOSS_VAL")
//         case 'squareOff' :
//             return getLangText("SQUARE_OFF_VAL")
//         case 'price' :
//             return getLangText("PRICEE")
//         default:
//             return null
//     }
// }

// 'triggerPrice': 'Trigger price',
//         'trailStopLoss': 'Trailing stop loss',
//         'stopLoss': 'Stop loss value',
//         'squareOff': 'Square off value',
//         'price': 'Price'
export const isValidHttpUrl = (string) => {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

export const AF_EventTriggered = (eventCategory, eventName, eventValue = {}) => {
    let defaultValue = {
        userId: getUserID(),
        timeStamp: new Date().toLocaleTimeString(),
        dateStamp: getFormatedDate().stringDate
    }
    let updatedEventValue = Object.assign({}, eventValue, defaultValue)
    if (eventCategory && eventName) {
        window.AF('pba', 'event', {
            eventType: 'EVENT',
            eventName: eventName,
            eventCategory: eventCategory,
            eventValue: updatedEventValue
        });
    }
    window.AF('pba', 'setCustomerUserId', getUserID())
    // window.AF.setCustomerUserId(getUserID());

}

export const aF_Logged_User = (userid) => {
    if (userid)
        window.AF('pba', 'setCustomerUserId', userid)
}

export function getInstrumentTypeList(arr,type){
    let filteredINstrumentList=[]
    if(arr && arr.length){
        // let symArrayList = Object.assign([],arr )
        arr.map((item) => {

            if(type === "Cash") {

                if((item.sym.instrument ===SYMBOL_INSTRUMENT_TYPE.EQUITYSTK )|| 
                   (item.sym.instrument === SYMBOL_INSTRUMENT_TYPE.EQUITYIDX))
                {

                    filteredINstrumentList=[...filteredINstrumentList,item]

                }
            } else if(type === "Future") {
                if((item.sym.instrument ===SYMBOL_INSTRUMENT_TYPE.FUTURESTK )|| 
                   (item.sym.instrument === SYMBOL_INSTRUMENT_TYPE.FUTUREIDX))
                {
                    filteredINstrumentList=[...filteredINstrumentList,item]
                }
            } else if(type === "Options") {
                if ((item.sym.instrument === SYMBOL_INSTRUMENT_TYPE.OPTIONSTK) ||
                    (item.sym.instrument === SYMBOL_INSTRUMENT_TYPE.OPTIONIDX)) {
                    filteredINstrumentList=[...filteredINstrumentList,item]
        
                }
            }
            else if(type==="All") {
                filteredINstrumentList=[...filteredINstrumentList,item]      
            }
            
        })
        return filteredINstrumentList

    }
    return filteredINstrumentList
}
export const checkValidUserMpin = (value = '') => {
    let validation = {
        isValid: true,
        errorMsg: ''
    }

    if (!value.length) {
        validation.isValid = false
        validation.errorMsg = getLangText('MPIN_EMPTY', 'VALIDATION')
    }
    else if (value.length != DEFAULT_VALUES.USER_MPIN_LEN) {
        validation.isValid = false
        validation.errorMsg = getLangText('MPIN_LEN_VLDTN', 'VALIDATION')
    }

    return validation
}