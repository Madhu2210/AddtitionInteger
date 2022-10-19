import React, {useEffect} from 'react'
import { connect } from "react-redux";
import { Route, Switch, Redirect } from 'react-router-dom';

import Dashboard from "../../components/postlogin_guestuser/dashboard/DashboardBaseComponent"
import WD from "../../components/postlogin_guestuser/dashboard/watchlist/watchlistDialogs/WatchlistDialogBaseComponent"
import ChartDialogComponent from '../../components/common_guestuser/ChartDialogComponent';
import ProfileBaseComponent from '../../components/common_guestuser/profileHeader/ProfileBaseComponent';
import HeaderBaseComponent from "../../components/postlogin_guestuser/header/HeaderBaseComponent";
import MenuDialogBaseComponent from '../../components/postlogin_guestuser/menu/MenuDialogBaseComponent';
import HelpAndSupportComponent from '../../components/postlogin_guestuser/menu/HelpAndSupportComponent';

import { LOGIN_DIALOGS, SCREENS_GUEST } from "../../common/Constants";
import { storeLoginDialogDetails } from '../../state/actions/Actions';
import SettingsBaseComponent from '../../components/postlogin_guestuser/settings/SettingsDialogBaseComponents';
import SettingsDialogBase from '../../components/postlogin_guestuser/settings/settingsDialogs/SettingsDialogsBase';


const HomePageGuestUser = (props) => {

    useEffect(() => {
        props.storeLoginDialogDetails({
            dialogName: LOGIN_DIALOGS.GUEST_USER_INFO,
            parentCB: onSuccessLogin_Guest_User,
        })
    }, [])

    function onSuccessLogin_Guest_User() {
        props.storeLoginDialogDetails({
            dialogName: null,
            parentCB: null,
        })
    }

    return (
        <div className="home-page">
            <HeaderBaseComponent />
            <Switch>
                <Route path={SCREENS_GUEST.DASHBOARD} exact component={Dashboard} />
                <Redirect to={SCREENS_GUEST.DASHBOARD} />
            </Switch>

            {/* WatchlistDialogBaseComponent has been named as WD bcause of eslint*/}
            <WD />
            <ChartDialogComponent />
            <ProfileBaseComponent />
            <SettingsBaseComponent />
            <MenuDialogBaseComponent />
            <HelpAndSupportComponent/>
            <SettingsDialogBase/>
            
            
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeLoginDialogDetails: (s) => { dispatch(storeLoginDialogDetails(s)) },
    };
};

export default connect(null, mapDispatchToProps)(HomePageGuestUser);