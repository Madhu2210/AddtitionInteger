/* eslint-disable */
import React from 'react'
import { connect } from 'react-redux'
import { MARKETSMITH_DIALOG_SCREENS } from '../../../../../../common/Constants'
import SubscriptionCancelDialog from './SubscriptionCancelDialog'
import SubscriptionCancelResultPopup from './SubscriptionCancelResultPopup'
import PaymentSuccessDialogComponent from './PaymentSuccessDialogComponent'
import FeedBackDialogComponent from './FeedBackDialogComponent'
import ErrorIFramePopup from './ErrorIFramePopup'

function MSDlgBase(props) {
    
    switch (props.marketSmtDialogComp.marketSmithDialogScreen) {
        case MARKETSMITH_DIALOG_SCREENS.PAYMENT_SUCCESS_POPUP:
            return <PaymentSuccessDialogComponent/>
        case MARKETSMITH_DIALOG_SCREENS.CANCEL_SUBSCRIPTION_POPUP:
            return <SubscriptionCancelDialog/>
        case MARKETSMITH_DIALOG_SCREENS.CANCEL_SUBSCRIPTION_RESULT_POPUP:
            return <SubscriptionCancelResultPopup/>
        case MARKETSMITH_DIALOG_SCREENS.FEEDBACK_FORM:
            return <FeedBackDialogComponent/>
        case MARKETSMITH_DIALOG_SCREENS.IFRAME_P0PUP:
            return <ErrorIFramePopup/>
     
        default:
            return null

    }

}
const mapStateToProps = ({ marketsmithdetails }) => {
    return {
        marketSmtDialogComp: marketsmithdetails.marketSmtDialogComp
    }
}

export default connect(mapStateToProps, null)(MSDlgBase);

