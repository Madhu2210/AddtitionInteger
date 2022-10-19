import React from 'react'
import { connect } from "react-redux";

import OrderPadDialogComponent from './OrderPadDialogComponent'
import OrderConfirmDialogComponent from './OrderConfirmDialogComponent';
import OrderResultDialogComponent from './OrderResultDialogComponent';
import MarketDepthBaseComponent from '../marketDepth/MarketDepthBaseComponent';
import QuoteDetailViewComponent from '../../common/QuoteDetailViewComponent';
import LangText from '../../../common/lang/LangText';

import {
    storeOrderPadDialogDetails, storeModifyOrder_InternalFlag, storeOrderpadSelectedSym,
    storeModifyOrderDetails, storeOrderFieldValues
} from '../../../state/actions/Actions'

import { ORDERPAD_DIALOGS } from '../../../common/Constants'
// import TaxDeclarationAlertDialogComponent from './TaxDeclarationAlertDialogComponent';
import OrdePadSeriesComponent from './OrderPadSeriesComponent';
import GuestDerivativeBlockComponent from './GuestDerivativeBlockComponent';

const OrderPadDialogBaseComponent = (props) => {

    const { orderPad } = props
    function onClose() {
        props.storeModifyOrderDetails({
            modifyType: null,
            symDetails: {}
        })
        props.storeOrderFieldValues({})
        props.storeOrderPadDialogDetails({
            dialogName: null,
            trade_type: null,
            message: '',
            parentCB: null,
        })
        props.storeOrderpadSelectedSym(null)
    }

    function onModalClose() {
        props.storeOrderPadDialogDetails({
            dialogName: ORDERPAD_DIALOGS.ORDER_PAD,
            trade_type: orderPad.dialog.trade_type
        })
    }

    function onClickModify(trade_type) {
        props.storeModifyOrder_InternalFlag(true)
        props.storeOrderPadDialogDetails({
            dialogName: ORDERPAD_DIALOGS.ORDER_PAD,
            trade_type: trade_type
        })
    }

    if (!orderPad.dialog.dialogName)
        return null
    return (
        <div className="tradeBase">
            <div className="trade-content">
                <OrderPadDialogComponent
                    key={orderPad.modifyOrder.modifyType ? 'modify' : orderPad.selectedSym.id}
                    trade_type={orderPad.dialog.trade_type}
                    sym={orderPad.selectedSym}
                    isModifyOrder_internal={orderPad.isModifyOrder_internal}
                    modifyOrder={orderPad.modifyOrder}
                    orderFieldValues={orderPad.orderFieldValues}
                    onCloseCB={onClose}
                />
                {orderPad.dialog.dialogName === ORDERPAD_DIALOGS.ORDEPAD_GROUP_SERIES?
                    <div className="orderDialogBase">
                        <OrdePadSeriesComponent 
                            trade_type={orderPad.dialog.trade_type}
                            orderMsg={orderPad.dialog.message}
                            onClickSumbitCB={orderPad.dialog.parentCB}
                            onCloseCB={onModalClose}
                            type = {orderPad.dialog.type}
                        />
                    </div>:
                    orderPad.dialog.dialogName === ORDERPAD_DIALOGS.ORDER_CONFIRM ?
                        <div className="orderDialogBase">
                            <OrderConfirmDialogComponent
                                trade_type={orderPad.dialog.trade_type}
                                fieldValues={orderPad.orderFieldValues}
                                onClickModifyCB={onClickModify}
                                modifyType={orderPad.modifyOrder.modifyType}
                                modifySymDetails={orderPad.modifyOrder.symDetails}
                                onCloseCB={onModalClose}
                            />
                        </div>
                        :
                        orderPad.dialog.dialogName === ORDERPAD_DIALOGS.ORDER_RESULT ?
                            <div className="orderDialogBase">
                                <OrderResultDialogComponent
                                    trade_type={orderPad.dialog.trade_type}
                                    resultData={orderPad.dialog.result}
                                    onCloseCB={onClose}
                                />
                            </div>
                            : null
                }
                <GuestDerivativeBlockComponent
                    sym={orderPad.selectedSym}
                    closeOrder={onClose}
                />
                {/* <TaxDeclarationAlertDialogComponent closeOrder={onClose} /> */}
            </div>
            <div className="market-depth-base">
                <div className="mdHeader flex-center">
                    <LangText name="MARKET_DEPTH_TXT" module="MARKET_DEPTH" />
                </div>
                <div className="mdContent">
                    <MarketDepthBaseComponent selectedSym={orderPad.selectedSym} parent="OrderPad" />
                    <QuoteDetailViewComponent selectedSym={orderPad.selectedSym} />
                </div>
                <div className="mdFooter"></div>
            </div>

        </div>
    )
}

const mapStateToProps = ({ orderPad }) => {
    return {
        orderPad
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeOrderPadDialogDetails: (s) => { dispatch(storeOrderPadDialogDetails(s)) },
        storeModifyOrder_InternalFlag: (s) => { dispatch(storeModifyOrder_InternalFlag(s)) },
        storeOrderpadSelectedSym: (s) => { dispatch(storeOrderpadSelectedSym(s)) },
        storeModifyOrderDetails: (s) => { dispatch(storeModifyOrderDetails(s)) },
        storeOrderFieldValues: (s) => { dispatch(storeOrderFieldValues(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderPadDialogBaseComponent);