import { LOCAL_STORAGE } from './Constants'
import { AppSettings } from './AppSettings'
import { encrypt, decrypt } from '../index'

export const storeItemByKey = function (key, value) {
    console.log("key:1", key, "value", value)
    if (value) {
        if (AppSettings.localStorageEncryptionEnabled) {
            console.log(encrypt(key),"key:", key, "value", value, "encrypt(value)", encrypt(value))
            window.localStorage.setItem(encrypt(key), encrypt(value));
        }
        else {
            console.log("key:5", key, "value", value)
            window.localStorage.setItem(key, value);
        }
    }
}

export const getItemByKey = function (key) {
    if (AppSettings.localStorageEncryptionEnabled) {
        let val = window.localStorage.getItem(encrypt(key));
        if (!val) return val;
        return decrypt(val);
        // return val;
    }
    return window.localStorage.getItem(key);
}

export const getItemFromSessionStorage = function (key) {
    if (AppSettings.localStorageEncryptionEnabled) {
        let val = window.sessionStorage.getItem(encrypt(key));
        if (!val) return val;
        return decrypt(val);
        // return val;
    }
    return window.sessionStorage.getItem(key);

}

export const storeToSessionStorage = function (key, value) {
    if (value) {
        if (AppSettings.localStorageEncryptionEnabled) {
            window.sessionStorage.setItem(encrypt(key), encrypt(value));
        }
        else {
            window.sessionStorage.setItem(key, value);
        }
    }
}

export const clearClientData = function () {
    if (AppSettings.localStorageEncryptionEnabled) {
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.LOGIN_STATUS));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.LOGIN_TYPE));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.INDICES));
        window.localStorage.removeItem(encrypt(LOCAL_STORAGE.USER_ID));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.RESET_PASSWORD));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.COMPANY_REG_INFO));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.WATCHGROUP_LIMIT));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.WATCHGROUP_SYM_LIMIT));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.OPEN_ACC_LINK));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.FUND_TRANSFER_FOOTER_CONTENT));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.QUOTE_MENUS));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.IPO_DETAILS));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.ANDROID_STORE_URL));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.IOS_STORE_URL));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.OTP_TIMER));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.TGROUP_SERIES));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.ODD_LOT_SERIES));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.LAS_HELP));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.LAS_OTP_TIMER));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.LAS_REPAYMENT));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.WELCOME_GUEST));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.HELP_AND_SUPPORT));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.OFS_DETAILS));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.GUEST_FNO_BLOCK));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.GUEST_PROFIT_MSG));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.GUEST_LOSS_MSG));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.NEWS_CATEGORY));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.GUEST_NEWS_CATEGORY));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.GUEST_BANNER));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.BECOME_A_PARTNER));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.MINIMUM_PAYOUT));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.APPLY_REDIRECT_LINK));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.GTD_VALIDITY_EXPIRY));

        // window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.VESTED_DATA));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.NCD_INFO));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.OPEN_GUESTACC_LINK));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.OPEN_OTHER_GUESTACC_LINK));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.SAVED_FILTERS_SORTBY));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.MTF_TIMER_DATA));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.MARKET_PROTECTION_LIMIT));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.HAS_STORAGE_DATA));
    
    } else {
        window.sessionStorage.removeItem(LOCAL_STORAGE.LOGIN_STATUS);
        window.sessionStorage.removeItem(LOCAL_STORAGE.LOGIN_TYPE);
        window.sessionStorage.removeItem(LOCAL_STORAGE.INDICES);
        window.localStorage.removeItem(LOCAL_STORAGE.USER_ID);
        window.sessionStorage.removeItem(LOCAL_STORAGE.RESET_PASSWORD);
        window.sessionStorage.removeItem(LOCAL_STORAGE.COMPANY_REG_INFO);
        window.sessionStorage.removeItem(LOCAL_STORAGE.WATCHGROUP_LIMIT);
        window.sessionStorage.removeItem(LOCAL_STORAGE.WATCHGROUP_SYM_LIMIT);
        window.sessionStorage.removeItem(LOCAL_STORAGE.OPEN_ACC_LINK);
        window.sessionStorage.removeItem(LOCAL_STORAGE.FUND_TRANSFER_FOOTER_CONTENT);
        window.sessionStorage.removeItem(LOCAL_STORAGE.QUOTE_MENUS);
        window.sessionStorage.removeItem(LOCAL_STORAGE.IPO_DETAILS);
        window.sessionStorage.removeItem(LOCAL_STORAGE.ANDROID_STORE_URL);
        window.sessionStorage.removeItem(LOCAL_STORAGE.IOS_STORE_URL);
        window.sessionStorage.removeItem(LOCAL_STORAGE.OTP_TIMER);
        window.sessionStorage.removeItem(LOCAL_STORAGE.TGROUP_SERIES);
        window.sessionStorage.removeItem(LOCAL_STORAGE.ODD_LOT_SERIES);
        window.sessionStorage.removeItem(LOCAL_STORAGE.LAS_HELP);
        window.sessionStorage.removeItem(LOCAL_STORAGE.LAS_OTP_TIMER);
        window.sessionStorage.removeItem(LOCAL_STORAGE.LAS_REPAYMENT);
        window.sessionStorage.removeItem(LOCAL_STORAGE.WELCOME_GUEST);
        window.sessionStorage.removeItem(LOCAL_STORAGE.HELP_AND_SUPPORT);
        window.sessionStorage.removeItem(LOCAL_STORAGE.OFS_DETAILS);
        window.sessionStorage.removeItem(LOCAL_STORAGE.GUEST_FNO_BLOCK);
        window.sessionStorage.removeItem(LOCAL_STORAGE.GUEST_PROFIT_MSG);
        window.sessionStorage.removeItem(LOCAL_STORAGE.GUEST_LOSS_MSG);
        window.sessionStorage.removeItem(LOCAL_STORAGE.NEWS_CATEGORY);
        window.sessionStorage.removeItem(LOCAL_STORAGE.GUEST_NEWS_CATEGORY);
        window.sessionStorage.removeItem(LOCAL_STORAGE.GUEST_BANNER);
        window.sessionStorage.removeItem(LOCAL_STORAGE.BECOME_A_PARTNER);
        window.sessionStorage.removeItem((LOCAL_STORAGE.TGROUP_SERIES));
        window.sessionStorage.removeItem((LOCAL_STORAGE.ODD_LOT_SERIES));
        window.sessionStorage.removeItem((LOCAL_STORAGE.MINIMUM_PAYOUT));
        window.sessionStorage.removeItem((LOCAL_STORAGE.APPLY_REDIRECT_LINK));
        window.sessionStorage.removeItem((LOCAL_STORAGE.GTD_VALIDITY_EXPIRY));

        // window.sessionStorage.removeItem((LOCAL_STORAGE.VESTED_DATA));   
        window.sessionStorage.removeItem((LOCAL_STORAGE.NCD_INFO));    
        window.sessionStorage.removeItem((LOCAL_STORAGE.OPEN_GUESTACC_LINK));    
        window.sessionStorage.removeItem((LOCAL_STORAGE.OPEN_OTHER_GUESTACC_LINK)); 
        // window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.SAVED_FILTERS));
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.SAVED_FILTERS_SORTBY)); 
        window.sessionStorage.removeItem(LOCAL_STORAGE.MTF_TIMER_DATA); 
        window.sessionStorage.removeItem(LOCAL_STORAGE.MARKET_PROTECTION_LIMIT);
        window.sessionStorage.removeItem(LOCAL_STORAGE.HAS_STORAGE_DATA);
       
    }
}

export const clearAppID = function () {
    if (AppSettings.localStorageEncryptionEnabled) {
        window.localStorage.removeItem(encrypt(LOCAL_STORAGE.APP_ID));
    } else {
        window.localStorage.removeItem(LOCAL_STORAGE.APP_ID);
    }
}

export const clearMpinDetails=function(){
    if (AppSettings.localStorageEncryptionEnabled) {
        window.localStorage.removeItem(encrypt(LOCAL_STORAGE.LOGIN_MPIN));
        window.localStorage.removeItem(encrypt(LOCAL_STORAGE.LOGIN_MPIN_USERNAME));
        window.localStorage.removeItem(encrypt(LOCAL_STORAGE.LOGIN_MPIN_USERID));
    } else {
        window.localStorage.removeItem(LOCAL_STORAGE.LOGIN_MPIN);
        window.localStorage.removeItem(LOCAL_STORAGE.LOGIN_MPIN_USERNAME);
        window.localStorage.removeItem(LOCAL_STORAGE.LOGIN_MPIN_USERID);
       
    }
}
