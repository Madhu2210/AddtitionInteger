import React from 'react';
import { connect } from 'react-redux';

import { FUNDS_SCREENS, THEMES } from '../../../../common/Constants';

import { WidgetLoader } from '../../../common/WidgetLoaderComponent'

function FundsRecentWithdrawalResult(props) {

    function onCloseCB() {
        props.selectedScreen(FUNDS_SCREENS.RECENT_WITHDRAWAL, true)
    }

    return (
        <div className="recent-trans-base">
            <div className="success-action">
                <span className="close-button cursor" onClick={onCloseCB}>
                    {
                        props.selectedTheme.theme === THEMES.LIGHT ?
                            <img src="assets/images/dashboard/close_icon.svg" alt="" />
                            :
                            <img src="assets/images/dark/dashboard/close_icon.svg" alt="" />
                    }
                </span>
                <span className="success-btn">
                    {
                        props.resultData.isSuccess ?
                            props.selectedTheme.theme === THEMES.LIGHT ?
                                <img src="assets/images/dashboard/success_btn.svg" alt="" /> :
                                <img src="assets/images/dark/dashboard/success_btn.svg" alt="" />
                            :
                            props.selectedTheme.theme === THEMES.LIGHT ?
                                <img src="assets/images/dashboard/failed_btn.svg" alt="" /> :
                                <img src="assets/images/dark/dashboard/Failed_btn.svg" alt="" />
                           
                    }
                </span>
                <span className="message">
                    {props.resultData.message}
                </span>
            </div>
        </div>
    )
}

const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme
    }
}

export default connect(mapStateToProps, null)(WidgetLoader(FundsRecentWithdrawalResult));
