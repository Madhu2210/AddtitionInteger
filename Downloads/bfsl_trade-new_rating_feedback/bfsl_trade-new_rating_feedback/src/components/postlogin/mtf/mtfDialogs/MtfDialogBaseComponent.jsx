import React from 'react'
import { connect } from 'react-redux'
import { MTF_DIALOGS } from '../../../../common/Constants'
import { storeMtfDialogDetails } from '../../../../state/actions/Actions'
import MtfEpledgeAlertDialog from './MtfEPledgeAlertDialogComponent'
import MtfPledgeConfirmDialog from './MtfPledgeConfirmDialogComponent'

function MTFDialogBaseComponent(props) {

    function onCloseDialog() {
        props.storeMTFDialogDetails({
            name: null,
        })
    }
    
    if (!props.dialogDetails.name)
        return null

    if (props.dialogDetails.name === MTF_DIALOGS.E_PLEDGE_ALERT && !props.popupBlock
    // && props.pledgeDetails && props.pledgeDetails.length
    )
        return <MtfEpledgeAlertDialog
        // {[
        //     {
        //         "dispSym": "ACC",
        //         "sym": {
        //             "exc": "NSE",
        //             "otherExch": [
        //                 "BSE"
        //             ],
        //             "lotSize": "1",
        //             "multiplier": "1",
        //             "series": "EQ",
        //             "streamSym": "22_NSE",
        //             "instrument": "STK",
        //             "id": "STK_ACC_EQ_NSE",
        //             "asset": "equity",
        //             "excToken": "22",
        //             "tickSize": "0.05"
        //         },
        //         "qty": "100.0",
        //         "scrip": "ACC LIMITED EQUITY",
        //         "baseSym": "ACC",
        //         "trSym": "ACC-EQ",
        //         "amnt": "10000.0"
        //     }
        // ]}
            onCloseCB= {onCloseDialog} />
        
    else if(props.dialogDetails.name === MTF_DIALOGS.PLEDGE_CONFIRM) {
        return <MtfPledgeConfirmDialog onCloseCB = {onCloseDialog}/>
    }
    return null
}

const mapStateToProps = ({ mtfDetails, demoTour }) => {
    return {
        dialogDetails: mtfDetails.dialogDetails,
        popupBlock: demoTour.demoPopupBlock,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeMTFDialogDetails: (s) => { dispatch(storeMtfDialogDetails(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MTFDialogBaseComponent);