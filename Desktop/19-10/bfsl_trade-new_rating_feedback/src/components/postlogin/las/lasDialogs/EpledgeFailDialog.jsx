import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { SCREENS, THEMES } from '../../../../common/Constants';

import LangText from '../../../../common/lang/LangText'
import { storeAvailLoanDialogDetails } from '../../../../state/actions/Actions';

function EpledgeFailDialog(props) {

    function onClickDone() {
        props.storeAvailLoanDialogDetails({
            dialogName: null
        })
        props.history.push(SCREENS.DASHBOARD)
    }
         
    return (
        <div className="app-modalDialog2 fail-dialog" >
            <div className="window fail-base" >
                <div className="fail-content">
                    <div className="header">
                        {props.selectedTheme.theme === THEMES.LIGHT ?
                            < img src="assets/images/dashboard/failed_btn.svg" alt="" />
                            :
                            < img src="assets/images/dark/dashboard/Failed_btn.svg" alt="" />
                        }
                        <span className="title">
                            <LangText name="FAIL" module="LAS" />
                        </span>
                    </div>
                    <div className="info-msg">
                        <span className="msg">
                            <LangText name="EPLEDGE_FAIL_INFO" module="LAS" /> 
                        </span>
                    </div>
                    <div className="fail-footer">
                        <button className="negativeBtn"
                            onClick={onClickDone}>
                            <LangText module="BUTTONS" name="OK" />
                        </button>

                    </div>
                </div>
            </div>
        </div>
            
    )
}

const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) },

    };
};

export default connect(mapStateToProps, mapDispatchToProps) (withRouter(EpledgeFailDialog))
