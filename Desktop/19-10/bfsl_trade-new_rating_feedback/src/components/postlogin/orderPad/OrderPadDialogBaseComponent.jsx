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
    storeModifyOrderDetails, storeOrderFieldValues, storeSquareoffNetPosition, storeSelectedDashboardWidget
} from '../../../state/actions/Actions'

import { DASHBOARD_WIDGET_MODE, ORDERPAD_DIALOGS } from '../../../common/Constants'
import TaxDeclarationAlertDialogComponent from './TaxDeclarationAlertDialogComponent';
import OrdePadSeriesComponent from './OrderPadSeriesComponent';
import OrderPadBTSTInfoComponent from './OrderPadBTSTInfoComponent';
import OrderPadMtfInfoComponent from './OrderPadMtfInfoComponent';

const OrderPadDialogBaseComponent = (props) => {

    const { orderPad } = props

    // useEffect(()=> {
    //     return () => {
    //         props.storeSquareoffNetPosition(false)
    //     }
    // },[])

    function onClose() {
        let redirectionMsg =  orderPad.dialog.redirectionMsg

        let checkTradeBlock = props.profileData.isTradeBlock ? props.profileData.isTradeBlock : false
        if(!checkTradeBlock) {
            props.storeModifyOrderDetails({
                modifyType: null,
                symDetails: {}
            })
        }

        props.storeOrderFieldValues({})
        props.storeOrderPadDialogDetails({
            dialogName: null,
            trade_type: null,
            message: '',
            parentCB: null,
        })
        props.storeOrderpadSelectedSym(null)
        if(redirectionMsg && redirectionMsg.length){
            props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.IDEAS_VIEW)
        }
        else{
            props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT)
        }
        // props.storeSquareoffNetPosition(false)
    }

    function onModalClose() {
        props.storeOrderPadDialogDetails({
            dialogName: ORDERPAD_DIALOGS.ORDER_PAD,
            trade_type: orderPad.dialog.trade_type,
        })
    }

    function onClickModify(trade_type) {
        props.storeModifyOrder_InternalFlag(true)
        props.storeOrderPadDialogDetails({
            dialogName: ORDERPAD_DIALOGS.ORDER_PAD,
            trade_type: trade_type
        })
    }
    // console.log('order',props)
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
                    orderPad.dialog.dialogName === ORDERPAD_DIALOGS.BTST_STOCKS || 
                    orderPad.dialog.dialogName === ORDERPAD_DIALOGS.AUTHORISE_MTF?
                        <div className="orderDialogBase">
                            <OrderPadBTSTInfoComponent 
                                orderMsg={orderPad.dialog.message}
                                onClickSumbitCB={orderPad.dialog.parentCB}
                                onCloseCB={onModalClose}
                                type = {orderPad.dialog.type}
                                symDetails= {orderPad.dialog.symDetails}
                            />
                            {console.log("123trade", orderPad.dialog.trade_type)}
                        </div>:
                        orderPad.dialog.dialogName === ORDERPAD_DIALOGS.MTF_KNOW_MORE?
                            <div className="orderDialogBase">
                                <OrderPadMtfInfoComponent 
                                    onCloseCB = {onModalClose}
                                    // trade_type={orderPad.dialog.trade_type}
                                />
                            </div>:
                        // orderPad.dialog.dialogName === ORDERPAD_DIALOGS.AUTHORISE_MTF?
                        //     <div className="orderDialogBase">
                        //         <OrderPadBTSTInfoComponent 
                        //             orderMsg={orderPad.dialog.message}
                        //             onClickSumbitCB={orderPad.dialog.parentCB}
                        //             onCloseCB={onModalClose}
                        //             type = {orderPad.dialog.type}
                        //             symDetails= {orderPad.dialog.symDetails}

                        //         />
                        //     </div>:
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
                                            onBackCB={onClickModify}
                                        />
                                    </div>
                                    : null
                }
                <TaxDeclarationAlertDialogComponent closeOrder={onClose} />
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

const mapStateToProps = ({ orderPad, profileDialog }) => {
    return {
        orderPad,
        profileData: profileDialog.profileDetails
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeOrderPadDialogDetails: (s) => { dispatch(storeOrderPadDialogDetails(s)) },
        storeModifyOrder_InternalFlag: (s) => { dispatch(storeModifyOrder_InternalFlag(s)) },
        storeOrderpadSelectedSym: (s) => { dispatch(storeOrderpadSelectedSym(s)) },
        storeModifyOrderDetails: (s) => { dispatch(storeModifyOrderDetails(s)) },
        storeOrderFieldValues: (s) => { dispatch(storeOrderFieldValues(s)) },
        storeSquareoffNetPosition: (s) => { dispatch(storeSquareoffNetPosition(s)) },
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderPadDialogBaseComponent);