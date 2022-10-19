import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';

import LoginComponent from '../../components/prelogin/login/LoginComponent'

import { SCREENS } from '../../common/Constants';

const PreLoginPage = () => {

    return (
        <div className="preLogin-page">
            <Switch>
                <Route path={SCREENS.LOGIN} exact component={LoginComponent} />
                <Redirect to={SCREENS.LOGIN} />
            </Switch>
        </div>
    )
}

export default PreLoginPage;