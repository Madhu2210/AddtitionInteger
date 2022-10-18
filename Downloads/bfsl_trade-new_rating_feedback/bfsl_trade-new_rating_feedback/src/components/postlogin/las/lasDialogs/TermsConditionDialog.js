import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { Loader } from '../../../common/LoaderComponent'

import LangText from '../../../../common/lang/LangText'
import {
    showAppDialog,
    showTermsIframeFlag,
    storeAvailLoanDialogDetails,
    storeEligibleAmnt
} from '../../../../state/actions/Actions'
import {AF_EVENT_NAMES,  LAS_LOAN_DIALOGS, LOCAL_STORAGE} from '../../../../common/Constants'
import { withRouter } from 'react-router-dom'
import { CheckBoxIcon_Checked, CheckBoxIcon_UnChecked } from '../../../common/FontIcons'
//import { LAS_KYC_MESSAGE } from '../../../../common/Messages'
import { LAS_SERVICES } from '../../../../config/ServiceURLs'
import { AF_EventTriggered, getBackOfficeBaseURL, replaceComma } from '../../../../common/CommonMethods'
import { MsfRequest } from '../../../..'
import useFetch from '@msf/msf-reactjs-weblib-base'
import { getItemFromSessionStorage } from '../../../../common/LocalStorage'

function TermsConditionDialog(props) {
    const [eAgreeCheck, setEAgreeCheck] = useState(false)
    // const [isAgreed, setIsAgreed] = useState(false)
    const MsfFetch = useFetch()
    const [lasHelp, setLasHelp] = useState({})

    useEffect(() => {

        let lasData = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.LAS_HELP))
        if (lasData)
            setLasHelp(lasData)

    }, [])

    function onClickClose() {
        props.storeAvailLoanDialogDetails({
            dialogName: null
        })

    }

    function onClickOkay() {

        props.showLoader();
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.CHECK_ELIGIBILITY,
            request,
            successRespCBGetEligibility,
            errorRespCBGetEligibility
        )
    }

    function successRespCBGetEligibility(response) {
        props.storeEligibleAmnt(response.data)
        props.storeAvailLoanDialogDetails({
            dialogName: null
        })
        if (response.data.elgAmnt) {
            let eligibleAmnt = replaceComma(response.data.elgAmnt)
            eligibleAmnt = parseInt(eligibleAmnt)
            let maxAmnt = parseInt(replaceComma(lasHelp.maxAmt))
            let minAmnt = parseInt(replaceComma(lasHelp.minAmt))

            if (eligibleAmnt > maxAmnt) {
                props.storeAvailLoanDialogDetails({
                    dialogName: LAS_LOAN_DIALOGS.ABV_50L_POPUP
                })
            } else if (eligibleAmnt > minAmnt) {
                props.storeAvailLoanDialogDetails({
                    dialogName: LAS_LOAN_DIALOGS.ELIGIBLE_POPUP

                })
            } else {
                props.storeAvailLoanDialogDetails({
                    dialogName: LAS_LOAN_DIALOGS.NOT_ELIGIBLE_POPUP
                })
            }
        }
        props.hideLoader();
        // props.history.push(SCREENS.DASHBOARD)
        AF_EventTriggered(AF_EVENT_NAMES.LAS , LAS_LOAN_DIALOGS.ELIGIBLE_POPUP)

    }

    function errorRespCBGetEligibility(error) {
        props.hideLoader();
        props.showAppDialog({
            message: error.message,
            show: true
        })
        AF_EventTriggered(AF_EVENT_NAMES.LAS , error.message)
    }
  
    function onClickTerms() {
        // props.history.push(SCREENS.TERMS)
        // props.storeAvailLoanDialogDetails({
        //     dialogName: LAS_LOAN_DIALOGS.TERMS_IFRAME
        // })
        props.showTermsIframeFlag(true)
    }

    function getDisableSubmitFlag() {
        if (!eAgreeCheck)
            return true
        return false
    }

    return (
        <div className="app-modalDialog2 terms-condition-dialog" >
            <div className="window terms-base" >
                <div className="termscon-content">
                    <div className="header">
                        <span className="title">
                            <LangText name="LOAN_AGAINST_SECURITI" module="LAS" />
                        </span>
                    </div>

                    <div className="content">
                        <span>
                            <LangText name="LOAN_AGAINST_MSG" module="LAS" />
                        </span>
                    </div>

                    <div className="row first-cond">
                        <div className="cursor accept-div" onClick={() => setEAgreeCheck(!eAgreeCheck)}>
                            {eAgreeCheck ?

                                <CheckBoxIcon_Checked />
                                :
                                <CheckBoxIcon_UnChecked />

                            }
                        </div>
                        {/* <div className="data">{LAS_KYC_MESSAGE.CONFIRM_KYC} */}
                        <div className="data">
                            <LangText name="I_ACCEPT"/>
                            <span className="las-termsncondition cursor" onClick={() => onClickTerms()}>
                                <LangText module="LAS" name="TERMS_N_CONDN" /></span>
                            <LangText module="LAS" name="LOAN_AGAINST_CHECK" />
                        </div>
                    </div>
                    {/* <div className="row">
                        <div className="cursor accept-div" onClick={() => setIsAgreed(!isAgreed)}>

                            {
                                isAgreed ?
                                    <CheckBoxIcon_Checked />
                                    :
                                    <CheckBoxIcon_UnChecked />
                            }
                        </div>
                        <div className="data">{LAS_KYC_MESSAGE.CONFIRM_KYC}
                            <span className="las-termsncondition cursor" onClick={() => onClickTerms()}>
                                <LangText module="LAS" name="TERMS_N_CONDN" /></span>
                        </div>
                    </div> */}

                </div>
                <div className="terms-footer">
                    <button className="las-negativeBtn cancel"
                        onClick={onClickClose}>
                        <LangText module="BUTTONS" name="CANCEL" />
                    </button>
                    <button className="las-positivebtn check"
                        disabled={getDisableSubmitFlag()}
                        onClick={onClickOkay} >
                        <LangText module="BUTTONS" name="CHECK_ELIGIBILITY" />
                    </button>
                </div>

            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) },
        storeEligibleAmnt: (s) => { dispatch(storeEligibleAmnt(s)) },
        showTermsIframeFlag: (s) => { dispatch(showTermsIframeFlag(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) }
    };
};

export default connect(null, mapDispatchToProps)(withRouter(Loader(TermsConditionDialog)));
