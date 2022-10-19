import React from 'react'
import { connect } from 'react-redux'
import { TRADESUMMARY_DIALOGS } from '../../../../common/Constants'
import TradeSummaryEditConfirmDialog from './TradeSummaryEditConfirmDialog'

function TradeSummaryDialogBase(props) {
    
    switch (props.tradeSummaryDialogComp.tradeSummaryDialogScreen) {
        case TRADESUMMARY_DIALOGS.EDIT_CONFIRMATION:
            return <TradeSummaryEditConfirmDialog/>
     
        default:
            return null

    }

}
const mapStateToProps = ({ bo }) => {
    return {
        tradeSummaryDialogComp: bo.tradeSummaryDialogComp
    }
}

export default connect(mapStateToProps, null)(TradeSummaryDialogBase);

