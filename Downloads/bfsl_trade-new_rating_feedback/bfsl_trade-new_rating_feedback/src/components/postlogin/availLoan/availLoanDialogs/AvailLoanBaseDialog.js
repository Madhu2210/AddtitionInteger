import React from 'react'
import { connect } from "react-redux";
import { AVAIL_LOAN_DIALOGS } from '../../../../common/Constants';
import AdditionalPledgConfirmDialog from './AdditionalPledgConfirmDialog';
import AgreeDialog from './AgreeDialog'
import EpledgeCongratsDialog from './EpledgeCongratsDialog';
import EpledgeFailureDialog from './EpledgeFailureDialog';
import EpledgeOTPDialog from './EpledgeOTPDialog';
import FailureEligibilityDialog from './FailureEligibilityDialog';
import GetAmountFailureDialog from './GetAmountFailureDialog';
import LoanDetailsDialog from './LoanDetailsDialog';
import OTPVerificationDialogComponent from './OTPVerificationDialogComponent'
import RequestFailureDialog from './RequestFailureDialog';
import RequestRecievedDialog from './RequestRecievedDialog';
import WithdrawAmountDialog from './WithdrawAmountDialog'

function AvailLoanBaseDialog(props) {
    
    switch (props.dialogComponent.dialogName) {
        case AVAIL_LOAN_DIALOGS.WITHDRAW_FUND_INFO:
            return <AgreeDialog />
        case AVAIL_LOAN_DIALOGS.WITHDRAW_FUND:
            return <WithdrawAmountDialog />
        case AVAIL_LOAN_DIALOGS.OTP_VERIFICATION:
            return <OTPVerificationDialogComponent />
        case AVAIL_LOAN_DIALOGS.REQUEST_SUCCESS:
            return <RequestRecievedDialog />
        case AVAIL_LOAN_DIALOGS.REQUEST_FAILURE:
            return <RequestFailureDialog/>
        case AVAIL_LOAN_DIALOGS.LOAN_DETAILS:
            return <LoanDetailsDialog/>
        case AVAIL_LOAN_DIALOGS.FAILURE_LOAN_DETAILS:
            return <FailureEligibilityDialog/>
        case AVAIL_LOAN_DIALOGS.EPLEDGE_OTP_VERIFICATION:
            return <EpledgeOTPDialog/>
        case AVAIL_LOAN_DIALOGS.EPLEDGE_CONGRATS:
            return <EpledgeCongratsDialog/>
        case AVAIL_LOAN_DIALOGS.EPLEDGE_FAILURE:
            return <EpledgeFailureDialog/> 
        case AVAIL_LOAN_DIALOGS.LOAN_AMOUNT_FAILURE:
            return <GetAmountFailureDialog/>    
        case AVAIL_LOAN_DIALOGS.ADDITIONAL_PLEDGE_CONFIRM:
            return <AdditionalPledgConfirmDialog/>             
        default:
            return null

    }

}
const mapStateToProps = ({ availLoanDetails }) => {
    return {
        dialogComponent: availLoanDetails.dialogComponent
    }
}

export default connect(mapStateToProps, null)(AvailLoanBaseDialog);
