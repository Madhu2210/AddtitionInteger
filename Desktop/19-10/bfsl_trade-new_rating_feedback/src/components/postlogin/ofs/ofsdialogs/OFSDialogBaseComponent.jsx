import React, {useState} from 'react'
import { connect } from "react-redux";

import ApplyOFSOrderDialog from './ApplyOFSOrderDialogComponent'
import CancelOFSOrderDialog from './CancelOFSOrderDialogComponent'
import OFSOrderResultDialog from './OFSOrderResultComponent'
import CancelOFSOrderResultDialog from './CancelOFSResultDialogComponent'

import { storeOFSDialogDetails, storeOFSOrderbookNavigation 
} from '../../../../state/actions/Actions'
import {  OFS_DIALOGS } from '../../../../common/Constants';
import ApplyOFSOrderConfirmDialog from './ApplyOFSOrderConfirmDialogComponent';

function OFSDialogBaseComponent(props) {

    const [cutoffSelected, setCutoffSelected] = useState()

    function onCloseDialog() {
        props.storeOFSDialogDetails({
            name: null
        })
    }

    function onResultApplyOFS(resp, symName, data, modify) {
        setCutoffSelected(data.selectCutoff)
        // console.log('data :', data);
        // console.log('resp :', resp);
        // console.log("symName", symName)
        let result = {}
        if (resp.infoID === "0") {
            result.msg = resp.data.ordStatus
            result.applicationNo = resp.data.ordId
            result.isSuccess = true
            result.symName = symName
            result.exchange = data.exchSeg
            // result.
        } 
        else if(resp.infoID === "EGN007") {
            // console.log("info",resp)
            result.msg = resp.infoMsg
            result.isSuccess = false
            result.symName = symName
            result.exchange = data.exchSeg
        }
        else {
            result.msg = resp.data.rejReason
            result.isSuccess = false
            result.symName = symName
            result.exchange = data.exchSeg
        }
        // console.log("result", result)
        props.storeOFSDialogDetails({
            name: OFS_DIALOGS.ORDER_RESULT,
            orderResult: result,
            symData:data,
            isModify: modify
        })
    }

    function onResultCancelOFS(resp, symName) {

        let result = {}
        if (resp.infoID === "0") {
            result.msg = resp.infoMsg
            result.applicationNo = resp.data.applicationNo
            result.isSuccess = true
            result.symName = symName
        } else {
            result.msg = resp.infoMsg
            result.isSuccess = false
            result.symName = symName
        }
        props.storeOFSDialogDetails({
            name: OFS_DIALOGS.CANCEL_ORDER_RESULT,
            orderResult: result
        })
    }

    function gotoOrderbook() {
        props.storeOFSOrderbookNavigation(true)
        onCloseDialog()
    }

    if (!props.dialogDetails.name)
        return null

    if (props.dialogDetails.name === OFS_DIALOGS.APPLY_ORDER || props.dialogDetails.name === OFS_DIALOGS.MODIFY_ORDER)
        return <ApplyOFSOrderDialog symData = {props.dialogDetails.symData}
            isModify = {props.dialogDetails.isModify ? props.dialogDetails.isModify :
                props.dialogDetails.name === OFS_DIALOGS.MODIFY_ORDER}
            isEdit = {props.dialogDetails.isEdit}
            isRetry = {props.dialogDetails.isRetry}
            isRetryFromPopup = {props.dialogDetails.isRetryFromPopup}
            selectCutoff = {cutoffSelected}
            onCloseCB={onCloseDialog}
            onResultApplyOFSCB={onResultApplyOFS}
        />
    else if (props.dialogDetails.name === OFS_DIALOGS.ORDER_CONFIRMATION)
        return <ApplyOFSOrderConfirmDialog
            symData={props.dialogDetails.symData}
            isModify={props.dialogDetails.isModify}
            selectCutoff={props.dialogDetails.selectCutoff}
            availMargin={props.dialogDetails.availMargin}
            onCloseCB={onCloseDialog}
            onResultApplyOFSCB={onResultApplyOFS}
        />
    else if (props.dialogDetails.name === OFS_DIALOGS.CANCEL_ORDER)
        return <CancelOFSOrderDialog
            symData={props.dialogDetails.symData}
            onResultCancelOFSCB={onResultCancelOFS}
            onCloseCB={onCloseDialog}
        />
    else if (props.dialogDetails.name === OFS_DIALOGS.ORDER_RESULT)
        return <OFSOrderResultDialog
            orderResult={props.dialogDetails.orderResult}
            symData ={props.dialogDetails.symData}
            isModify = {props.dialogDetails.isModify}
            gotoOrderbookCB={gotoOrderbook}
            onCloseCB={onCloseDialog}
        />
    else if (props.dialogDetails.name === OFS_DIALOGS.CANCEL_ORDER_RESULT)
        return <CancelOFSOrderResultDialog
            orderResult={props.dialogDetails.orderResult}
            gotoOrderbookCB={gotoOrderbook}
            onCloseCB={onCloseDialog}
        />
    return null
}

const mapStateToProps = ({ ofsDetails }) => {
    return {
        dialogDetails: ofsDetails.dialogDetails,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeOFSDialogDetails: (s) => { dispatch(storeOFSDialogDetails(s)) },
        storeOFSOrderbookNavigation: (s) => { dispatch(storeOFSOrderbookNavigation(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OFSDialogBaseComponent);