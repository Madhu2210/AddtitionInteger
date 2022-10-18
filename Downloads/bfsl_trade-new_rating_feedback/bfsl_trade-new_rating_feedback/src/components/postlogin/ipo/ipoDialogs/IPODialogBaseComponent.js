import React from 'react'
import { connect } from "react-redux";

import CancelOrderDialog from './CancelIPOOrderDialogComponent'
import ApplyOrderDialog from './ApplyIPOOrderDialogComponent'
import OrderResultDialog from './IPOOrderResultComponent'
import CancelOrderResultDialog from './CancelIPOResultDialogComponent'

import { storeIPODialogDetails, storeIPOOrderbookNavigation } from '../../../../state/actions/Actions'
import { AF_EVENT_NAMES, AF_EVENT_TYPES, IPO_DIALOGS } from '../../../../common/Constants';
import { AF_EventTriggered } from '../../../../common/CommonMethods';
import { feedbackOnLogout } from '../../../../common/Bridge'

function IPODialogBaseComponent(props) {

    function onCloseDialog() {
        props.storeIPODialogDetails({
            name: null
        })
       
    }

    function onResultApplyIPO(resp, symName) {
        let result = {}
        if (resp.infoID === "0") {
            result.msg = resp.data.msg
            result.applicationNo = resp.data.applicationNo
            result.isSuccess = true
            result.symName = symName
        } else {
            result.msg = resp.message
            result.isSuccess = false
            result.symName = symName
        }
        props.storeIPODialogDetails({
            name: IPO_DIALOGS.ORDER_RESULT,
            orderResult: result
        })
        AF_EventTriggered(AF_EVENT_NAMES.IPO , AF_EVENT_TYPES.APPLY_IPO)
        
    }

    function onResultCancelIPO(resp, symName) {
        let result = {}
        if (resp.infoID === "0") {
            result.msg = resp.data.msg
            result.applicationNo = resp.data.applicationNo
            result.isSuccess = true
            result.symName = symName
            AF_EventTriggered(AF_EVENT_NAMES.IPO , AF_EVENT_TYPES.CANCEL_IPO_SUCCESS)

        } else {
            result.msg = resp.message
            result.isSuccess = false
            result.symName = symName
            AF_EventTriggered(AF_EVENT_NAMES.IPO , AF_EVENT_TYPES.CANCEL_IPO_FAILURE)

        }
        props.storeIPODialogDetails({
            name: IPO_DIALOGS.CANCEL_ORDER_RESULT,
            orderResult: result
        })
        // AF_EventTriggered(AF_EVENT_NAMES.IPO , AF_EVENT_TYPES.CANCEL_IPO)
    }

    function gotoOrderbook() {
        props.storeIPOOrderbookNavigation(true)
        onCloseDialog()
        AF_EventTriggered(AF_EVENT_NAMES.IPO , AF_EVENT_TYPES.ORDERBOOK_TAB)
        feedbackOnLogout()
    }
    

    if (!props.dialogDetails.name)
        return null

    if (props.dialogDetails.name === IPO_DIALOGS.APPLY_ORDER || props.dialogDetails.name === IPO_DIALOGS.MODIFY_ORDER)
        return <ApplyOrderDialog symData={props.dialogDetails.symData}
            isModify={props.dialogDetails.name === IPO_DIALOGS.MODIFY_ORDER}
            onCloseCB={onCloseDialog}
            onResultApplyIPOCB={onResultApplyIPO}
        />
    else if (props.dialogDetails.name === IPO_DIALOGS.CANCEL_ORDER)
        return <CancelOrderDialog
            symData={props.dialogDetails.symData}
            onResultCancelIPOCB={onResultCancelIPO}
            onCloseCB={onCloseDialog}
        />
    else if (props.dialogDetails.name === IPO_DIALOGS.ORDER_RESULT)
        return <OrderResultDialog
            orderResult={props.dialogDetails.orderResult}
            gotoOrderbookCB={gotoOrderbook}
            onCloseCB={onCloseDialog}
        />
    else if (props.dialogDetails.name === IPO_DIALOGS.CANCEL_ORDER_RESULT)
        return <CancelOrderResultDialog
            orderResult={props.dialogDetails.orderResult}
            gotoOrderbookCB={gotoOrderbook}
            onCloseCB={onCloseDialog}
        />
    return null
}

const mapStateToProps = ({ ipoDetails }) => {
    return {
        dialogDetails: ipoDetails.dialogDetails,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeIPODialogDetails: (s) => { dispatch(storeIPODialogDetails(s)) },
        storeIPOOrderbookNavigation: (s) => { dispatch(storeIPOOrderbookNavigation(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(IPODialogBaseComponent);