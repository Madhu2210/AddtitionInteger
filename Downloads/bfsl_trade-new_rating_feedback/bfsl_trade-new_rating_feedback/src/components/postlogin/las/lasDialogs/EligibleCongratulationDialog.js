import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';

import { Congo_icon } from '../../../common/FontIcons';
import { Loader } from '../../../common/LoaderComponent'

import { AF_EventTriggered, checkEmpty } from '../../../../common/CommonMethods'
import { AF_EVENT_NAMES, AF_EVENT_TYPES, LAS_USER_STAGE, SCREENS } from '../../../../common/Constants'
import LangText from '../../../../common/lang/LangText'
import { storeAvailLoanDialogDetails, storeLoanInit, storeUserStage } from '../../../../state/actions/Actions'

function EligibleCongratulationDialog(props) {
    function onClickClose() {
        props.storeAvailLoanDialogDetails({
            dialogName: null
        })
        props.history.push(SCREENS.DASHBOARD)
    }
    function onClickProceed() {
        props.storeUserStage({
            userStage: LAS_USER_STAGE.CHECK_ELIGIBITY

        })
        props.storeAvailLoanDialogDetails({
            dialogName: null
        })
        AF_EventTriggered(AF_EVENT_NAMES.LAS , AF_EVENT_TYPES.ELIGIBLE_USER)
    }

    return (
        <div className="app-modalDialog2 congrats-dialog" >
            <div className="window congrats-base">
                <span className="circle"></span>
                <div className="header">
                    <span className="bfsl-font-2 congoicon congo-icon">
                        <Congo_icon />
                    </span>

                    <span className="title">
                        <LangText name="ELIGIBLE" module="LAS" />
                    </span>
                </div>
                <div className="congrats-body">
                    <span className="head_content">
                        <LangText name="ELIGIBLE_MSG" module="LAS" />
                    </span>
                    <span className="max-amount">
                        <LangText name="MAX_AMOUNT" module="LAS" />
                        <span className="value">{props.eligibleAmnt.elgAmnt ? '₹ ' : ''}
                            {checkEmpty(props.eligibleAmnt.elgAmnt)} </span>
                    </span>

                </div>

                <div className="congrats-footer">
                    <button className="las-negativeBtn"
                        onClick={onClickClose}>
                        <LangText module="BUTTONS" name="CANCEL" />
                    </button>
                    <button className="las-positivebtn"
                        onClick={onClickProceed} >
                        <LangText module="BUTTONS" name="PROCEED" />
                    </button>
                </div>

            </div>
        </div>
    )
}
const mapStateToProps = ({ las }) => {

    return {
        eligibleAmnt: las.eligibleAmnt
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) },
        storeLoanInit: (s) => { dispatch(storeLoanInit(s)) },
        storeUserStage: (s) => { dispatch(storeUserStage(s)) },

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Loader(EligibleCongratulationDialog)));

