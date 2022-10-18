import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { connect } from "react-redux";
import { apiConfig } from './index'

import PreLoginPage from './screens/prelogin/PreLoginPage'
import HomePage from './screens/postlogin/HomePage'
import Authorized from './components/routers/Authorized'
import LoginBaseDialogComponent from './components/prelogin/login/loginDialogs/LoginDialogsBaseComponent';
import AppDialogComponent from './components/common/AppDialogComponent';
import ToastMsgComponent from './components/common/ToastMsgComponent';
// import PreLoadImageComponent from './components/common/PreLoadImageComponent'

import { AppSettings } from './common/AppSettings'

import { LOCAL_STORAGE, SCREENS, INFO_IDS, THEMES, API_TIMEOUT, BROWSERS } from './common/Constants';
import { NetworkErrorMessages } from './common/Messages';
import { getKey, getBrowser } from './common/CommonMethods';
import { getItemFromSessionStorage } from './common/LocalStorage'

import { getAppID, handleInvalidMsg, closeAllPopup} from './common/Bridge';

import './assets/css/global.css'

import Shield from '@msf/shieldmessaging'

let logStatus = getItemFromSessionStorage(LOCAL_STORAGE.LOGIN_STATUS)

function App(props) {

    const [loginStatus] = useState(!!logStatus)

    // Added listener to reload the app, if network connection is from offline to online
    useEffect(() => {
        window.addEventListener('online', reloadPage);
        Shield.listenMessage()
    }, [])

    function reloadPage() {
        if (navigator.onLine)
            window.location.reload()
    }

    window.onkeydown = function (e) {
        if (e.keyCode === 27) {
            closeAllPopup()
        }
    }

    return (
        <div className={`App ${getBrowser() === BROWSERS.FIREFOX ? 'inFirefox' : ''}`}
            id={props.selectedTheme ? props.selectedTheme.theme === THEMES.LIGHT ? 'lightTheme' : 'darkTheme' : null}
            style={{ minWidth: AppSettings.minBrowserWidth, minHeight: AppSettings.minBrowserHeight }}
        >
            <style>
                {
                    (props.selectedTheme && props.selectedTheme.theme === THEMES.LIGHT) ?
                        <link rel="stylesheet" 
                            href={AppSettings.publicUrl + "/assets/css/lightThemeColorsjuly12.css"} />
                        :
                        <link rel="stylesheet" 
                            href={AppSettings.publicUrl + "/assets/css/darkThemeColorsjuly12.css"} />
                }
            </style>
            <ApiCommunicator />

            <Router basename={AppSettings.baseUrl}>
                <Switch>

                    <Route exact path={SCREENS.BASE}
                        render={(compProps) =>
                            <BaseRouter {...compProps} loginStatus={loginStatus} />
                        }
                    />

                    <Route path={SCREENS.PRELOGIN} component={PreLoginPage} />
                    {/* <Route path="/" component={HomePage} /> */}
                    <Authorized path={SCREENS.HOME} component={HomePage} />

                    {
                        loginStatus ?
                            <Redirect to={SCREENS.HOME} />
                            :
                            <Redirect to={SCREENS.PRELOGIN} />
                    }

                </Switch>
            </Router>

            {/* <PreLoadImageComponent /> */}
            <LoginBaseDialogComponent />
            <AppDialogComponent />
            <ToastMsgComponent />
        </div>
    );
}

function BaseRouter(props) {
    return (
        props.loginStatus ?
            <Redirect to={SCREENS.HOME} />
            : <Redirect to={SCREENS.PRELOGIN} />
    );
}

const ApiCommunicator = () => {
    apiConfig.setEncryptionKey(getKey())
    apiConfig.setApiEncryptionEnabled(AppSettings.apiEncryptionEnabled)
    apiConfig.setAppIDCallback(getAppID)
    apiConfig.setHandleCallback(handleInvalidMsg)
    apiConfig.setInfoIDS(INFO_IDS)
    apiConfig.setErrorMessages(NetworkErrorMessages)
    apiConfig.setApiTimeout(API_TIMEOUT)

    return (
        <div />
    )
}

const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme
    }
}

export default connect(mapStateToProps, null)(App);