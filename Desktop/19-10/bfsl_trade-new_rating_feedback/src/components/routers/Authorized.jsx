import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom';
import { useFetch, MsfRequest } from '../../index'

import { Loader } from '../common/LoaderComponent';

import { LOGIN, LOGIN_GUEST } from '../../config/ServiceURLs'
import { storeLoginClientDetails, handleInvalidSession, storeLoginType } from '../../common/Bridge';

import { storeInvalidSession } from '../../state/actions/Actions';

import { SCREENS, LOCAL_STORAGE, LOGIN_TYPE } from '../../common/Constants'
import { CommonErrorMessages } from '../../common/Messages'
import { getItemFromSessionStorage } from '../../common/LocalStorage';
import { getGuestUserBaseURL, getTradingBaseURL } from '../../common/CommonMethods';

const getBool = function (v) {
    return v && v === "true";
}

const Authorized = (props) => {

    const MsfFetch = useFetch();

    const [loginStatus, setLoginStatus] = useState(props.loginStatus);
    const [isConfigReceived, setIsConfigReceived] = useState(false);

    let logStatus = getItemFromSessionStorage(LOCAL_STORAGE.LOGIN_TYPE)

    useEffect(() => {
        let getstatus = getBool(getItemFromSessionStorage(LOCAL_STORAGE.LOGIN_STATUS))
        if (getstatus) {
            if (!loginStatus)
                checkSession()
            else
                setIsConfigReceived(true)
        } else {
            setIsConfigReceived(true)
        }
    }, [])

    useEffect(() => {
        if (props.loginStatus !== loginStatus) {
            setLoginStatus(props.loginStatus)
        }

        if (props.inValidSession) {
            setIsConfigReceived(true)
            props.hideLoader()
            props.storeInvalidSession(false)
        }

    }, [props.loginStatus, props.inValidSession])

    const checkSession = () => {
        let sessionUrl = logStatus === LOGIN_TYPE.GUEST ?
            getGuestUserBaseURL() + LOGIN_GUEST.VALIDATE_SESSION : getTradingBaseURL() + LOGIN.VALIDATE_SESSION
        props.showLoader()
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            sessionUrl,
            request,
            successRespCBValidateSession,
            errorRespCBValidateSession
        )
    }

    const successRespCBValidateSession = (response) => {
        storeLoginClientDetails(response)
        storeLoginType(getItemFromSessionStorage(LOCAL_STORAGE.LOGIN_TYPE))
        setIsConfigReceived(true)
        props.hideLoader()
    }

    const errorRespCBValidateSession = () => {
        setIsConfigReceived(true)
        handleInvalidSession(CommonErrorMessages.INVALID_SESSION)
        props.hideLoader()
    }

    if (!isConfigReceived)
        return null

    const { component: Component, ...rest } = props;

    return (
        <>
            <Route {...rest} render={compProps => {
                return loginStatus
                    ? <Component {...compProps} />
                    : <Redirect to={SCREENS.PRELOGIN} />
            }} />
        </>
    )
}

const mapStateToProps = ({ login, session }) => {
    return {
        loginStatus: login.loginStatus,
        inValidSession: session.inValidSession
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeInvalidSession: (s) => { dispatch(storeInvalidSession(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(Authorized));
