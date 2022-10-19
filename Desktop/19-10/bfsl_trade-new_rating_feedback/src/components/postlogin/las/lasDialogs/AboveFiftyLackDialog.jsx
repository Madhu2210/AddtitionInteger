import React, { useState ,useEffect} from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { useFetch, MsfRequest } from '../../../../index'

import LangText from '../../../../common/lang/LangText'
import { checkEmpty,  getBackOfficeBaseURL} from '../../../../common/CommonMethods'
import { LAS_LOAN_DIALOGS, LAS_USER_STAGE, SCREENS } from '../../../../common/Constants'
import { Checkbox_nor, Checkbox_sel, Congo_icon } from '../../../common/FontIcons';

import { LAS_SERVICES } from '../../../../config/ServiceURLs';
import {
    showAppDialog, storeAvailLoanDialogDetails, storeLoanInit,
    storeUserStage
} from '../../../../state/actions/Actions'
import { Loader } from '../../../common/LoaderComponent'

function AboveFiftylackDialog(props) {
    const MsfFetch = useFetch()
    const [AgreeCheck, setAgreeCheck] = useState(true)
    const [eligibleAmtData,setEligibleAmtData] = useState({})

    useEffect(() => {
        if (props.eligibleAmnt) {
            setEligibleAmtData(props.eligibleAmnt)
        } else {
            setEligibleAmtData(props.responseData)
        }
        
    }, [])

    function onClickClose() {
        props.storeAvailLoanDialogDetails({
            dialogName: null
        })
        props.history.push(SCREENS.DASHBOARD)
    }

    function onClickApply() {
        props.showLoader();
        let request = new MsfRequest();
        request.addToData({
            'loanId': eligibleAmtData.loanId,
            "stage": "las ticket",

        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL()+ LAS_SERVICES.CONFIRM_STAGE,
            request,
            successRespGetConfirmStage,
            errorRespCBGetConfirmStage
        )
    }
    function successRespGetConfirmStage() {
        props.hideLoader();
        props.storeLoanInit(true)
        props.storeUserStage({
            userStage: LAS_USER_STAGE.CHECK_ELIGIBITY

        })
        props.history.push(SCREENS.LAS)
        props.storeAvailLoanDialogDetails({
            dialogName: null
        })
    }
       
    function errorRespCBGetConfirmStage(error) {
        props.hideLoader();
        props.showAppDialog({
            message: error.message,
            show: true
        })
    }  

    function onClickApplyFiftyL() {
        props.showLoader();
        let request = new MsfRequest();
        request.addToData({
            'loanId': eligibleAmtData.loanId,
            'lnAmnt': eligibleAmtData.elgAmnt,

        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL()+ LAS_SERVICES.LASTICKET,
            request,
            successRespGetLasTicket,
            errorRespCBGetLasTicket
        )
    }
    
    function successRespGetLasTicket() {
        props.storeAvailLoanDialogDetails({
            dialogName: null
        })
        props.storeAvailLoanDialogDetails({
            dialogName: LAS_LOAN_DIALOGS.REQUEST_POPUP
        })
        
        props.hideLoader();
    }

    function errorRespCBGetLasTicket(error) {
        props.hideLoader();
        props.showAppDialog({
            message: error.message,
            show: true
        })
    }

    return (
        <div className="app-modalDialog2 greatstart-dialog" >
            <div className="window greatstart-base" >
                <span className="circle"></span>
                <div className="header">
                    <span className="bfsl-font-2 congoicon congo-icon">
                        <Congo_icon />
                    </span>
                
                    <span className="title">
                        <LangText name="ELIGIBLE" module="LAS" />
                    </span>
                </div>
                <div className="greatstart-body">
                    <span className="content">
                        <LangText name="ELIGIBLE_MSG" module="LAS" />
                    </span>
                    <span className="max-amount">
                        <LangText name="MAX_AMOUNT" module="LAS" />
                        <span className="value">{eligibleAmtData? '₹ ' : ''}
                            {checkEmpty(eligibleAmtData.elgAmnt)} </span>
                    </span>
                    <div className="upto-msg">
                        <LangText name="FIFTYL_ABV_MSG" module="LAS" />
                    </div>
                </div>
                <div className="greatstart-footer">
                    <div className="button-div">
                        <button className="las-negativeBtn abovefifty"
                            onClick={onClickClose}>
                            <LangText module="BUTTONS" name="CANCEL" />
                        </button>
                        <button className="las-positivebtn abovefifty"
                            disabled={!AgreeCheck? 'disabled' : ""}
                            onClick={!AgreeCheck ? null :onClickApply} >
                            <LangText module="BUTTONS" name="APPLY_50L" />
                        </button>
                    </div>
                    <div className="apply-link" onClick={() => onClickApplyFiftyL()}>
                        <LangText name="FIFTYL_APPLY_LINK" module="LAS" /> 
                    </div>
                    <div className="row">
                        <span className={`bfsl-font-2 ${!AgreeCheck ? "checkboxnor" :
                            "active-checkboxnor"}`}>
                            {!AgreeCheck ?

                                <Checkbox_nor onClick={() => setAgreeCheck(true)} />
                                :
                                <Checkbox_sel onClick={() => setAgreeCheck(false)} />

                            }
                        </span>
                        <span className="data">
                            <LangText module="LAS" name="AGREE_MSG" />
                        </span>
                    </div>

                </div>
            </div>
        </div>
    )
}
const mapStateToProps = ({ las }) => {

    return {
        eligibleAmnt: las.eligibleAmnt,
        responseData:las.responseData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeLoanInit: (s) => { dispatch(storeLoanInit(s)) },
        storeUserStage: (s) => { dispatch(storeUserStage(s)) },

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Loader(AboveFiftylackDialog)));

