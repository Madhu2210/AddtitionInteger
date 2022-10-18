
// ==========================================================================
// App Settings

// Environments
export const AppEnvironments = {
    DEV: "dev",
    QA: "qa",
    PROD: "prod"
}

const getBool = function (v) {
    return v && v === "true";
}

let appProcess = process.env
// AppSettings
export const AppSettings = {
    appVersion: appProcess.REACT_APP_APP_VERSION,
    appEnvironment: AppEnvironments.DEV,

    serviceURL_VT: appProcess.REACT_APP_SERVICE_URL_VIRTUAL_TRADE,
    serviceURL_TRADING: appProcess.REACT_APP_SERVICE_URL_TRADING,
    serviceURL_MD: appProcess.REACT_APP_SERVICE_URL_MARKET_DATA,
    serviceURL_MD_GUEST: appProcess.REACT_APP_SERVICE_URL_GUEST_MARKET_DATA,
    serviceURL_NEWS: appProcess.REACT_APP_SERVICE_URL_NEWS,
    serviceURL_CMOTS: appProcess.REACT_APP_SERVICE_URL_CMOTS,
    serviceURL_MTF: appProcess.REACT_APP_SERVICE_URL_MTF,
    serviceURL_BO: appProcess.REACT_APP_SERVICE_URL_BO,
    serviceURL_GUEST: appProcess.REACT_APP_SERVICE_URL_GUEST_USER,
    serviceURL_IDEAS: appProcess.REACT_APP_SERVICE_URL_IDEAS,
    serviceURL_SPLASH: appProcess.REACT_APP_SERVICE_URL_SPLASH,
    streamingURL: appProcess.REACT_APP_STREAM_URL,
    streamingURL_GUEST: appProcess.REACT_APP_GUEST_USER_STREAM_URL,
    webServiceURL: appProcess.REACT_APP_WEB_SERVICE_URL,
    publicUrl: appProcess.PUBLIC_URL,
    nodeEnv: appProcess.NODE_ENV,
    baseUrl: appProcess.REACT_APP_BASE_URL,
    alertUrl: appProcess.REACT_APP_SERVICE_URL_ALERT,
    apiEncryptionEnabled: getBool(appProcess.REACT_APP_API_ENCRYPTION_ENABLED),
    shieldApiEncryption: getBool(appProcess.REACT_APP_SHIELD_ENCRYPTION_ENABLED),
    // encryptionKey: appProcess.REACT_APP_ENCRYPTION_KEY,

    //Shield Config
    firebaseSenderId: appProcess.REACT_APP_FIREBASE_SENDER_ID,
    firebaseProjectId: appProcess.REACT_APP_FIREBASE_PROJECT_ID,
    firebaseApiKey: appProcess.REACT_APP_FIREBASE_API_KEY,
    firebaseAppId: appProcess.REACT_APP_FIREBASE_APP_ID,
    shieldURL: appProcess.REACT_APP_SHIELD_URL,
    serviceWorkerPath: appProcess.REACT_APP_SERVICEWORKER_PATH,
    serviceWorkerScope: appProcess.REACT_APP_SERVICEWORKER_SCOPE,

    localStorageEncryptionEnabled: getBool(appProcess.REACT_APP_LOCALSTORAGE_ENCRYPTION_ENABLED),
    binaryStreaming: getBool(appProcess.REACT_APP_BINARY_STREAMING),
    // Should be a higher value.
    websocketRetryCount: 1000,  
    // In Ms         
    websocketRetryInternal: 5000,

    minBrowserWidth: 1200,
    minBrowserHeight: 600
}
if ( appProcess.NODE_ENV === 'production') {
    console.log = function () { 
        return null
    }
    console.error = function () {
        return null
    }
    console.warn = function () {
        return null
    }
}
document.addEventListener("contextmenu", eve => eve.preventDefault())

// ==========================================================================