import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { MsfRequest, useFetch } from '../../../../index';

import { checkEmpty, getBackOfficeBaseURL } from '../../../../common/CommonMethods'
import LangText from '../../../../common/lang/LangText'
import { Congo_icon } from '../../../common/FontIcons';
import { Loader } from '../../../common/LoaderComponent'

import { LAS_SERVICES } from '../../../../config/ServiceURLs';
import {
    showAppDialog, storeAvailLoanDialogDetails, storeEagreeResponse,
    storeUserStage
} from '../../../../state/actions/Actions'
import { LAS_USER_STAGE, SCREENS } from '../../../../common/Constants';

function LoanApprovedDialog(props) {
    const MsfFetch = useFetch()

    function onClickClose() {
        props.storeAvailLoanDialogDetails({
            dialogName: null
        })
        props.history.push(SCREENS.DASHBOARD)
    }

    function checkStatus() {
        props.showLoader();
        let request = new MsfRequest();
        request.addToData({ lan: props.lan })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.GET_LOAN_STATUS,
            request,
            successRespCBGetStatus,
            errorRespCBGetStatus
        )
    }

    function successRespCBGetStatus(response) {
        props.storeEagreeResponse(response.data)
        if (response.data.status !== LAS_USER_STAGE.LOAN_PENDING) {

            props.storeAvailLoanDialogDetails({
                dialogName: null
            })
            props.storeUserStage({
                userStage: response.data.status
            })
        } else {
            props.showAppDialog({
                message: response.data.msg,
                show: true
            })
        }
        props.hideLoader();

    }

    function errorRespCBGetStatus(error) { 
        props.hideLoader();
        props.showAppDialog({
            message: error.message,
            show: true
        })

    }

    return (
        <div className="app-modalDialog2 congrats-dialog" >
            <div className="window congrats-base" >
                <span className="circle"></span>
                <div className="header">

                    <span className="bfsl-font-2 congoicon congo-icon">
                        <Congo_icon />
                    </span>

                    <span className="title">
                        <LangText name="LOAN_APPROVED_HEAD" module="LAS" />
                    </span>
                </div>
                <div className="congrats-body">
                    {/* <span className="head_content">
                        <LangText name="APPROVED_MSG" module="LAS" />
                    </span> */}
                    <span className="max-amount">
                        <LangText name="SANCTION_AMOUNT" module="LAS" />
                        <span className="value">{props.loanAmnt ? '₹ ' : ''}
                            {checkEmpty(props.loanAmnt)}
                        </span>
                    </span>
                    <span className="info-msg">
                        <LangText name="APPROVED_INFO" module="LAS" />
                    </span>
                    <span className="info-inmsg">
                        <LangText name="APPROVED_INMSG" module="LAS" />
                    </span>
                </div>

                <div className="congrats-footer">
                    <button className="las-negativeBtn"
                        onClick={onClickClose}>
                        <LangText module="BUTTONS" name="CANCEL" />
                    </button>
                    <button className="las-positivebtn"
                        onClick={checkStatus} >
                        <LangText module="BUTTONS" name="PROCEED" />
                    </button>
                </div>

            </div>
        </div>
    )
}

const mapStateToProps = ({ las }) => {

    return {
        responseData: las.responseData,
        lan: las.lan,
        loanAmnt: las.loanAmnt
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) },
        storeUserStage: (s) => { dispatch(storeUserStage(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeEagreeResponse: (s) => { dispatch(storeEagreeResponse(s)) },

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Loader(LoanApprovedDialog)));

