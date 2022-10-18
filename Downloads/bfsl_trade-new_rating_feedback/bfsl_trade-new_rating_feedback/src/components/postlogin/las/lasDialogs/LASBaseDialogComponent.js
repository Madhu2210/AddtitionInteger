import React from 'react'
import { connect } from "react-redux";

import { LAS_LOAN_DIALOGS } from '../../../../common/Constants';
import AboveFiftyLackDialog from './AboveFiftyLackDialog';
import AboveFiftyLackRequestDialog from './AboveFiftyLackRequestDialog';
import EligibleCongratulationDialog from './EligibleCongratulationDialog';
import EpledgeCongratulationDialog from './EpledgeCongratulationDialog';
import LoanApprovedDialog from './LoanApprovedDialog';
import NotEligibleSorryDialog from './NotEligibleSorryDialog';
import OTPVerificationDialog from './OTPVerificationDialog';
import StageInfoDialogComponent from './StageInfoDialogComponent';

import TermsConditionDialog from './TermsConditionDialog';
import RecheckSuccessDialog from './RecheckSuccessDialog';
import EpledgeFailDialog from './EpledgeFailDialog';
import LasCompletedDialog from './LasCompletedDialog';
import RecheckSorryDialog from './RecheckSorryDialog';
import TicketCreatedDialog from './TicketCreatedDialog';
import LasIframeDialog from './LasIframeDialog';
import LASTermsBaseComponent from '../LASTermsBaseComponent';
import EpledgeConfirmDialog from './EpledgeConfirmDialog';

function LASBaseDialogComponent(props) {
    function getSelectedDialog(){
        switch (props.dialog.dialogName) {
            case LAS_LOAN_DIALOGS.TERMS_CONDITIONS:
                return <TermsConditionDialog />
            case LAS_LOAN_DIALOGS.ELIGIBLE_POPUP:
                return <EligibleCongratulationDialog />
            case LAS_LOAN_DIALOGS.ABV_50L_POPUP:
                return <AboveFiftyLackDialog />
            case LAS_LOAN_DIALOGS.NOT_ELIGIBLE_POPUP:
                return <NotEligibleSorryDialog />
            case LAS_LOAN_DIALOGS.LOAN_APPROVED_POPUP:
                return <LoanApprovedDialog />
            case LAS_LOAN_DIALOGS.OTP_VERIFICATION:
                return < OTPVerificationDialog />
            case LAS_LOAN_DIALOGS.REQUEST_POPUP:
                return < AboveFiftyLackRequestDialog />
            case LAS_LOAN_DIALOGS.CONGO_POPUP:
                return < EpledgeCongratulationDialog />
            case LAS_LOAN_DIALOGS.STAGE_INFO:
                return <StageInfoDialogComponent />
            case LAS_LOAN_DIALOGS.RECHECK_SUCCESS:
                return <RecheckSuccessDialog />
            case LAS_LOAN_DIALOGS.FAIL_POPUP:
                return < EpledgeFailDialog />
            case LAS_LOAN_DIALOGS.LAS_COMPLETED:
                return < LasCompletedDialog />
            case LAS_LOAN_DIALOGS.RECHECK_SORRY:
                return < RecheckSorryDialog />
            case LAS_LOAN_DIALOGS.TICKET_CREATED:
                return < TicketCreatedDialog />
            case LAS_LOAN_DIALOGS.LAS_IFRAME:
                return <LasIframeDialog />
            case LAS_LOAN_DIALOGS.EPLEDGE_CONFIRM:
                return <EpledgeConfirmDialog />
            default:
                return null
        }
    }

    return(
        <>
            {getSelectedDialog()}
            {
                props.showTermsIframe?
                    <LASTermsBaseComponent/>
                    :null
            }
        </>
    )
}

const mapStateToProps = ({ las }) => {

    return {
        dialog: las.dialog,
        showTermsIframe:las.showTermsIframe
        
    }
}

export default connect(mapStateToProps, null)(LASBaseDialogComponent);
