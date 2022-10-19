import React from 'react';
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../../../index'

import { TRADE_GUEST } from '../../../../../config/ServiceURLs';

import { getBaseURL } from '../../../../../common/CommonMethods';
import { ORDER_DIALOGS } from '../../../../../common/Constants';
import LangText from '../../../../../common/lang/LangText';
import { storeOrderDialogDetails, storeRegetOrderBookData, 
    storeRegetOrderStatus } from '../../../../../state/actions/Actions';

function PendingDialogCancelComponent(props) {

    const MsfFetch = useFetch()

    const { symDetails } = props
    const { symData } = symDetails

    function onClickYes() {
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.addToData({
            ordId: symData.ordId,
            sym: symData.sym
        })
        MsfFetch.placeRequest(
            getBaseURL() + TRADE_GUEST.CANCEL_ORDER,
            request,
            successRespCBCancelOrder,
            errorRespCBCancelOrder
        )
    }

    function successRespCBCancelOrder(response) {
        props.hideWidgetLoader();
        props.storeRegetOrderBookData(true)
        props.storeRegetOrderStatus(true)
        props.storeOrderDialogDetails({
            dialogName: ORDER_DIALOGS.CANCEL_ORDER_CONFIRM,
            resultData: {
                success: true,
                symName: symData.dispSym,
                qty: symData.qty,
                message: response.infoMsg
            },
            parentCB: props.parentCB
        })
    }

    function errorRespCBCancelOrder(error) {
        props.hideWidgetLoader();
        props.storeOrderDialogDetails({
            dialogName: ORDER_DIALOGS.CANCEL_ORDER_CONFIRM,
            resultData: {
                success: false,
                symName: symData.dispSym,
                qty: symData.qty,
                message: error.message
            },
            parentCB: null
        })
    }

    return (
        <div className="pending-cancel-order">
            <div className="order-symname-details">
                <span className="order-symName">
                    {props.symDetails.symData.baseSym}
                </span>
                <span className="order-symExc">
                    {props.symDetails.symData.sym.exc}
                </span>
            </div>
            <div className="cancel-confirmation">
                <LangText module="ORDERBOOK_MSGS" name="CANCEL_ORDER" />

            </div>
            <div className="cancel-action-pending">
                <button className="not-cancel-order" onClick={props.onCloseCB}>
                    <LangText module="ORDERBOOK_MSGS" name="NO" />
                </button>
                <button className="theme-btn"
                    onClick={onClickYes}>
                    <LangText module="ORDERBOOK_MSGS" name="YES"

                    />
                </button>
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeOrderDialogDetails: (s) => { dispatch(storeOrderDialogDetails(s)) },
        storeRegetOrderBookData: (s) => { dispatch(storeRegetOrderBookData(s)) },
        storeRegetOrderStatus: (s) => { dispatch(storeRegetOrderStatus(s)) },
    };
};

export default connect(null, mapDispatchToProps)(PendingDialogCancelComponent);