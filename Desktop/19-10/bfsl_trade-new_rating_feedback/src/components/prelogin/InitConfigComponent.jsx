import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../index'

import BaseView from '../common/BaseView'
import { Loader } from '../common/LoaderComponent'

import { COMMON } from '../../config/ServiceURLs'

import {
    storeAppID, showAppDialog, updateConfigStatus,
    storeInvalidSession,
    storeLanguageContentToStore
} from '../../state/actions/Actions'

import { AppSettings } from '../../common/AppSettings'
import { getSplashBaseURL, getVirtualTradeBaseURL } from '../../common/CommonMethods'

import {
    getItemByKey,
    storeItemByKey,
} from '../../common/LocalStorage'
import { LOCAL_STORAGE } from '../../common/Constants'
import { storeConfigDetails } from '../../common/Bridge';

const InitConfigComponent = (props) => {

    const MsfFetch = useFetch()

    const [errorMsg, setErrorMsg] = useState('')
    // const [langContent, setLangContent] = useState()

    useEffect(() => {
        let appID = getItemByKey(LOCAL_STORAGE.APP_ID)

        if (appID) {
            props.storeAppID(appID)
            getConfig();

        } else {
            getAppID();
        }
    }, [])

    useEffect(() => {
        if (props.inValidSession) {
            props.storeInvalidSession(false)
            props.hideLoader()
        }
    }, [props.inValidSession])

    const getConfig = () => {
        let request = new MsfRequest();
        request.addToData({ message: "0" })

        props.showLoader();
        MsfFetch.placeRequest(
            getSplashBaseURL() + COMMON.CONFIG,
            request,
            successRespCBConfig,
            errorRespCB
        )
    }

    const successRespCBConfig = ({ data }) => {
        fetch('LanguageContent15.json')
            .then(response => response.json())
            .then(langData => {
                // storeToSessionStorage(LOCAL_STORAGE.LANGUAGE_SETTING_OPTIONS, JSON.stringify(langData))
                props.storeLanguageContentToStore(langData)
                props.hideLoader()
                storeConfigDetails(data)
                props.updateConfigStatus(true)
            });
     
    }

    const getAppID = () => {
        let getBrowserInfo = getBrowserInfos()

        let request = new MsfRequest()

        request.addToData({
            "software": {
                "osType": navigator.platform,
                "osVendor": navigator.vendor,
                "osName": getBrowserInfo.browser,
                "osVersion": getBrowserInfo.version
            },
            "network": {
                "imsi": "",
                "gps": "",
                "wlan": false,
                "cellular": ""
            },
            "hardware": {
                "keyboard": "--",
                "screen": "--",
                "model": "--",
                "imei": "--",
                "display": "--",
                "vendor": "--"
            },
            "app": {
                "version": AppSettings.appVersion,
                "name": "bfsl",
                "channel": "msfstore",
                "build": "web-pc"
            }
        })

        request.setAppID("0")

        props.showLoader();
        MsfFetch.placeRequest(
            getVirtualTradeBaseURL() + COMMON.INIT,
            request,
            successRespCBInit,
            errorRespCB
        )
    }

    const successRespCBInit = (response) => {
        props.hideLoader();

        storeItemByKey(LOCAL_STORAGE.APP_ID, response.data.appID)
        props.storeAppID(response.data.appID)

        getConfig();
    }

    const errorRespCB = (error) => {
        props.hideLoader()

        setErrorMsg(error.message)
        props.showAppDialog({
            message: error.message,
            show: true
        })
    }

    const getBrowserInfos = () => {
        let ua = navigator.userAgent;
        let b;
        let browser;
        if (ua.indexOf("Opera") != -1) {
            b = browser = "Opera";
        }
        if (ua.indexOf("Firefox") != -1 && ua.indexOf("Opera") == -1) {
            b = browser = "Firefox";
            // Opera may also contains Firefox
        }
        if (ua.indexOf("Chrome") != -1) {
            b = browser = "Chrome";
        }
        if (ua.indexOf("Safari") != -1 && ua.indexOf("Chrome") == -1) {
            b = 'Version';
            browser = "Safari";
            ua = navigator.appVersion;
            // Chrome always contains Safari
        }
        if (ua.indexOf("MSIE") != -1 && (ua.indexOf("Opera") == -1 && ua.indexOf("Trident") == -1)) {
            b = "MSIE";
            browser = "Internet Explorer";
            //user agent with MSIE and Opera or MSIE and Trident may exist.
        }
        if (ua.indexOf("Trident") != -1) {
            b = "Trident";
            browser = "Internet Explorer";
        }
        if (ua.indexOf("Edge") != -1) {
            b = "Edge";
            browser = "Internet Explorer";
        }
        if (ua.indexOf("CriOS") != -1) {
            // CriOS is a chrome browser in ios devices
            b = "CriOS";
            browser = "Chrome";
        }
        if (ua.indexOf("iOS") != -1) {
            // CriOS is a chrome browser in ios devices
            b = "iOS";
            browser = "WKWebView";
        }

        // now for version
        let version = ua.match(b + "[ /]+[0-9]+(.[0-9]+)*")[0];

        return { browser, version }
    }

    return (
        <div>
            <BaseView errorMsg={errorMsg} />
        </div>
    )
}

const mapStateToProps = ({ session }) => {
    return {
        inValidSession: session.inValidSession
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAppID: (s) => { dispatch(storeAppID(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        updateConfigStatus: (s) => { dispatch(updateConfigStatus(s)) },
        storeInvalidSession: (s) => { dispatch(storeInvalidSession(s)) },
        storeLanguageContentToStore: (s) => {dispatch(storeLanguageContentToStore(s))}
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(InitConfigComponent));