import React from 'react'
import { connect } from "react-redux";

import { storeNCDDialogDetails, storeNCDOrderbookNavigation 
} from '../../../../state/actions/Actions'
import {  AF_EVENT_NAMES, AF_EVENT_TYPES, NCD_DIALOGS } from '../../../../common/Constants';
import ApplyNCDOrderDialog from './ApplyNCDOrderDialogComponent';
import SelectNCDSeriesDialog from './SelectNCDSeriesDialogComponent';
import PlaceNCDOrderDialog from './PlaceNCDOrderDialogComponent';
import NCDOrderConfirmDialog from './NCDOrderConfirmDialogComponent';
import OrderResultDialog from './NCDOrderResultComponent';
import CancelNCDOrderDialog from './CancelNCDOrderDialogComponent';
import CancelNCDOrderResultDialog from './CancelNCDOrderResultDialogComponent';
import { AF_EventTriggered } from '../../../../common/CommonMethods';
import { feedbackOnLogout } from '../../../../common/Bridge';

function NCDDialogBaseComponent(props) {

    function onCloseDialog() {
        props.storeNCDDialogDetails({
            name: null,
            symData: {},
            seriesData: {}
        })
    }
    function gotoOrderbook() {
        props.storeNCDOrderbookNavigation(true)
        onCloseDialog()
        feedbackOnLogout()
    }

    function onResultApplyNCD(resp, symDetails, selectedSeriesDetails) {
        // console.log('resp :', resp,symDetails, selectedSeriesDetails );
        let result = {}
        if (resp.infoID === "0") {
            result.msg = resp.data.msg
            result.applicationNo = resp.data.applicationNo
            result.isSuccess = true
            result.symName = symDetails.debtipoBidNme
            result.qty = symDetails.qty
        } else {
            result.msg = resp.message
            result.isSuccess = false
            result.symName = symDetails.debtipoBidNme
            result.qty = symDetails.qty
        }
        props.storeNCDDialogDetails({
            name: NCD_DIALOGS.ORDER_RESULT,
            symData : symDetails,
            seriesData : selectedSeriesDetails,
            orderResult: result
        })

    }

    function onResultCancelNCD(resp, symName) {
        let result = {}
        if (resp.infoID === "0") {
            result.msg = resp.data.msg
            result.applicationNo = resp.data.applicationNo
            result.isSuccess = true
            result.symName = symName
            AF_EventTriggered(AF_EVENT_NAMES.NCD , AF_EVENT_TYPES.CANCEL_NCD_SUCCESS)
        } else {
            result.msg = resp.message
            result.isSuccess = false
            result.symName = symName
            AF_EventTriggered(AF_EVENT_NAMES.NCD , AF_EVENT_TYPES.CANCEL_NCD_FAILURE)
        }
        props.storeNCDDialogDetails({
            name: NCD_DIALOGS.CANCEL_ORDER_RESULT,
            orderResult: result
        })
    }

    if (!props.dialogDetails.name)
        return null

    if (props.dialogDetails.name === NCD_DIALOGS.APPLY_ORDER )
        return <ApplyNCDOrderDialog symData= {props.dialogDetails.symData}
            onCloseCB= {onCloseDialog} />
        
    else if (props.dialogDetails.name === NCD_DIALOGS.SHOW_SERIES_LIST)
        return <SelectNCDSeriesDialog
            symData= {props.dialogDetails.symData}
            seriesData= {props.dialogDetails.seriesData}
            onCloseCB= {onCloseDialog}/>
    else if (props.dialogDetails.name === NCD_DIALOGS.GOTO_PLACE_ORDER_SCREEN)
        return <PlaceNCDOrderDialog
            symData= {props.dialogDetails.symData}
            seriesData= {props.dialogDetails.seriesData}
            selectedUPIHandler = {props.dialogDetails.selectedUPIHandler}
            // onResultCancelNCDCB={onResultCancelNCD}
            onCloseCB={onCloseDialog}
        />
    else if (props.dialogDetails.name === NCD_DIALOGS.GOTO_CONFIRM_ORDER)
        return <NCDOrderConfirmDialog
            symData ={props.dialogDetails.symData}
            seriesData = {props.dialogDetails.seriesData}
            onCloseCB = {onCloseDialog}
            onResultPlaceNCDCB = {onResultApplyNCD}
        />
    else if (props.dialogDetails.name === NCD_DIALOGS.ORDER_RESULT)
        return <OrderResultDialog
            orderResult={props.dialogDetails.orderResult}
            symData = {props.dialogDetails.symData}
            seriesData = {props.dialogDetails.seriesData}
            gotoOrderbookCB={gotoOrderbook}
            onCloseCB={onCloseDialog}
        />
    else if (props.dialogDetails.name === NCD_DIALOGS.CANCEL_ORDER)
        return <CancelNCDOrderDialog
            symData ={props.dialogDetails.symData}
            onResultCancelNCDCB={onResultCancelNCD}
            // gotoOrderbookCB={gotoOrderbook}
            onCloseCB={onCloseDialog}
        />
    else if (props.dialogDetails.name === NCD_DIALOGS.CANCEL_ORDER_RESULT)
        return <CancelNCDOrderResultDialog
            symData ={props.dialogDetails.symData}
            orderResult={props.dialogDetails.orderResult}
            gotoOrderbookCB={gotoOrderbook}
            onCloseCB={onCloseDialog}
        />
    // return null
}

const mapStateToProps = ({ ncdDetails }) => {
    return {
        dialogDetails: ncdDetails.dialogDetails,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeNCDDialogDetails: (s) => { dispatch(storeNCDDialogDetails(s)) },
        storeNCDOrderbookNavigation: (s) => { dispatch(storeNCDOrderbookNavigation(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NCDDialogBaseComponent);