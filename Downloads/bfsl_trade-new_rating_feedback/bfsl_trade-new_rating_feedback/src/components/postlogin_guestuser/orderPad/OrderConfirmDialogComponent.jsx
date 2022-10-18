import React, { useEffect, useRef, useState } from 'react';
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../index'

import { WidgetLoader } from '../../common/WidgetLoaderComponent'
import LangText, { getLangText } from '../../../common/lang/LangText';

import { ORDER_PAD } from '../../../config/ServiceURLs';
import { showAppDialog, storeModifyOrderDetails, storeOrderPadDialogDetails } from '../../../state/actions/Actions';

import {
    checkEmpty, getBaseURL, getDispSymbolName, isBuyTradeAction,
    isEquityCashSymbol
} from '../../../common/CommonMethods';
import {
    CONFIRM_ORDER_COLUMNS, INFO_IDS, ORDERPAD_CONSTANTS, ORDERPAD_DIALOGS, ORDERPAD_FIIELD_KEYS,
    ORDER_MODIFY_TYPE, TEXT_ORIENTATION, TRADE_PRODUCT_TYPES
} from '../../../common/Constants';
import { LeftArrowIcon } from '../../common/FontIcons';

function OrderConfirmDialog2Component(props) {

    const MsfFetch = useFetch()

    // const [errorMsg,setErrorMsg] = useState(null)
    const [pendingGetMarReq, setPendingGetMarReq] = useState(false)
    const [orderValue, setOrderValue] = useState("")

    const [columnValues, setColumnValues] = useState([])
    const [cutArray1] = useState([0, 1, 2, 3, 4])
    const [cutArray2] = useState([5, 6, 7, 8, 9])
    const [cutArray3] = useState([10, 11, 12, 13, 14])

    let isPendingRequest = useRef(false)

    useEffect(() => {
        let allColumns = Object.assign([], CONFIRM_ORDER_COLUMNS)
        let reqColumns = []
        allColumns.map((item) => {
            if (props.fieldValues[item.key] && props.fieldValues[item.key] != 0) {
                let itemName = item.name
                if (item.name === ORDERPAD_CONSTANTS.PRICE && props.fieldValues.hidePrice) {
                    let columnObj = {
                        name: itemName,
                        value: "0.00",
                        langKey: item.langKey
                    }
                    reqColumns.push(columnObj)
                } else {
                    if (item.key === ORDERPAD_FIIELD_KEYS.STOP_LOSS) {
                        if (isBuyTradeAction(props.trade_type)) {
                            itemName = getLangText('STOP_LOSS_SELL', 'ORDERPAD')
                            item.langKey = "STOP_LOSS_SELL"
                        }
                        else {
                            itemName = getLangText('STOP_LOSS_BUY', 'ORDERPAD')
                            item.langKey = "STOP_LOSS_BUY"
                        }
                    } else if (item.key === ORDERPAD_FIIELD_KEYS.SQUARE_OFF) {
                        if (isBuyTradeAction(props.trade_type)) {
                            itemName = getLangText('SQUARE_OFF_SELL', 'ORDERPAD')
                            item.langKey = "SQUARE_OFF_SELL"
                        }
                        else {
                            itemName = getLangText('SQUARE_OFF_BUY', 'ORDERPAD')
                            item.langKey = "SQUARE_OFF_BUY"
                        }
                    }
                    let columnObj = {
                        name: itemName,
                        value: props.fieldValues[item.key],
                        langKey: item.langKey
                    }
                    reqColumns.push(columnObj)
                }
            }
        })
        setColumnValues(reqColumns)

        getCheckMargin()
    }, [])

    function onClickModify() {
        props.onClickModifyCB && props.onClickModifyCB(props.fieldValues[ORDERPAD_FIIELD_KEYS.ACTION])
    }

    function onConfirmOrder() {
        if (!isPendingRequest.current) {
            isPendingRequest.current = true
            // setErrorMsg('')
            props.showWidgetLoader();
            let triggerPrice = props.fieldValues[ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE]
            let request = new MsfRequest();
            if (props.modifyType === ORDER_MODIFY_TYPE.MODIFY) {
                let reqObj = props.modifySymDetails
                // reqObj['sym'] = props.fieldValues.symObj
                reqObj['prdType'] = props.fieldValues[ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE]
                reqObj['ordType'] = props.fieldValues[ORDERPAD_FIIELD_KEYS.ORDER_TYPE]
                reqObj['limitPrice'] = props.fieldValues[ORDERPAD_FIIELD_KEYS.PRICE]
                reqObj['triggerPrice'] = triggerPrice
                reqObj['targetPrice'] = props.fieldValues[ORDERPAD_FIIELD_KEYS.SQUARE_OFF]
                reqObj['boTgtPrice'] = props.fieldValues[ORDERPAD_FIIELD_KEYS.SQUARE_OFF]
                reqObj['boStpLoss'] = props.fieldValues[ORDERPAD_FIIELD_KEYS.STOP_LOSS]
                reqObj['isAmo'] = props.fieldValues[ORDERPAD_FIIELD_KEYS.AMO]
                reqObj['qty'] = props.fieldValues[ORDERPAD_FIIELD_KEYS.QUANTITY].toString()
                reqObj['disQty'] = props.fieldValues[ORDERPAD_FIIELD_KEYS.DIS_QTY]
                reqObj['ordAction'] = props.fieldValues[ORDERPAD_FIIELD_KEYS.ACTION]
                reqObj['ordDuration'] = props.fieldValues[ORDERPAD_FIIELD_KEYS.VALIDITY]
                reqObj['trailingSL'] = props.fieldValues[ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS]
                reqObj['currentDateTime'] = props.fieldValues[ORDERPAD_FIIELD_KEYS.CURR_DATE_TIME]
                request.addToData(reqObj)
                MsfFetch.placeRequest(
                    getBaseURL() + ORDER_PAD.GUEST_MODIFY_ORDER,
                    request,
                    successRespCBPlaceOrder,
                    errorRespCBPlaceOrder
                )
            } else {
                if (props.fieldValues[ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE] == TRADE_PRODUCT_TYPES.CO)
                    triggerPrice = props.fieldValues[ORDERPAD_FIIELD_KEYS.STOP_LOSS]
                request.addToData({
                    'sym': props.fieldValues.symObj,
                    'prdType': props.fieldValues[ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE],
                    'ordType': props.fieldValues[ORDERPAD_FIIELD_KEYS.ORDER_TYPE],
                    'limitPrice': props.fieldValues[ORDERPAD_FIIELD_KEYS.PRICE],
                    'triggerPrice': triggerPrice,
                    'targetPrice': props.fieldValues[ORDERPAD_FIIELD_KEYS.SQUARE_OFF],
                    'boTgtPrice': props.fieldValues[ORDERPAD_FIIELD_KEYS.SQUARE_OFF],
                    'boStpLoss': props.fieldValues[ORDERPAD_FIIELD_KEYS.STOP_LOSS],
                    'isAmo': props.fieldValues[ORDERPAD_FIIELD_KEYS.AMO],
                    'qty': props.fieldValues[ORDERPAD_FIIELD_KEYS.QUANTITY].toString(),
                    'disQty': props.fieldValues[ORDERPAD_FIIELD_KEYS.DIS_QTY],
                    'ordAction': props.fieldValues[ORDERPAD_FIIELD_KEYS.ACTION],
                    'ordDuration': props.fieldValues[ORDERPAD_FIIELD_KEYS.VALIDITY],
                    'trailingSL': props.fieldValues[ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS],
                    'currentDateTime': props.fieldValues[ORDERPAD_FIIELD_KEYS.CURR_DATE_TIME]
                })
                MsfFetch.placeRequest(
                    getBaseURL() + ORDER_PAD.GUEST_PLACE_ORDER,
                    request,
                    successRespCBPlaceOrder,
                    errorRespCBPlaceOrder
                )
            }
        }
    }

    function successRespCBPlaceOrder(response) {
        isPendingRequest.current = false
        props.hideWidgetLoader();
        moveToOrderResult(response.data)
    }

    function errorRespCBPlaceOrder(error) {
        isPendingRequest.current = false
        props.hideWidgetLoader();
        if (error.infoID === INFO_IDS.REJECTED_ORDER)
            moveToOrderResult(error.data)
        else if (error.infoID !== INFO_IDS.DUPLICATATE_ORDER) {
            props.showAppDialog({
                message: error.message,
                show: true
            })
            onClickModify()
        }
    }

    function moveToOrderResult(responseData) {
        let result = {
            symDetails: {
                name: isEquityCashSymbol(props.fieldValues.exc) ?
                    props.fieldValues[ORDERPAD_FIIELD_KEYS.SYMBOL] :
                    props.fieldValues[ORDERPAD_FIIELD_KEYS.DIS_SYMBOL],
                qty: props.fieldValues[ORDERPAD_FIIELD_KEYS.QUANTITY]
            },
            orderId: responseData.ordId,
            orderStatus: responseData.ordStatus,
            rejReason: responseData.rejReason,
            actDisp: responseData.actDisp,
            actCode: responseData.actCode
        }
        props.storeModifyOrderDetails({
            modifyType: null,
            symDetails: {}
        })
        props.storeOrderPadDialogDetails({
            dialogName: ORDERPAD_DIALOGS.ORDER_RESULT,
            trade_type: props.fieldValues[ORDERPAD_FIIELD_KEYS.ACTION],
            result: result
        })
    }

    function getCheckMargin() {
        setPendingGetMarReq(true)
        let request = new MsfRequest();
        request.addToData({
            sym: props.fieldValues.symObj,
            "prdType": props.fieldValues[ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE],
            "ordType": props.fieldValues[ORDERPAD_FIIELD_KEYS.ORDER_TYPE],
            "ordAction": props.fieldValues[ORDERPAD_FIIELD_KEYS.ACTION],
            "qty": props.fieldValues[ORDERPAD_FIIELD_KEYS.QUANTITY].toString(),
            "ordDuration": props.fieldValues[ORDERPAD_FIIELD_KEYS.VALIDITY],
            "currentDateTime": new Date(),
            "limitPrice": props.fieldValues[ORDERPAD_FIIELD_KEYS.PRICE],
            "isAmo": props.fieldValues[ORDERPAD_FIIELD_KEYS.AMO]
        })
        MsfFetch.placeRequest(
            getBaseURL() + ORDER_PAD.GUEST_CHECK_MARGIN,
            request,
            successRespCBgetCheckMargin,
            errorRespCBgetCheckMargin
        )
    }

    function successRespCBgetCheckMargin(response) {
        setPendingGetMarReq(false)
        setOrderValue(response.data)
    }

    function errorRespCBgetCheckMargin() {
        setPendingGetMarReq(false)
    }

    const { fieldValues } = props

    return (
        <div className="orderDialogConfirm ">
            <div className={`dialogConfirmHeader ${isBuyTradeAction(props.trade_type) ? 'buyOrder' : 'sellOrder'}`}>
                <button className="arrow-icon cursor" onClick={onClickModify}>
                    <LeftArrowIcon />
                </button>
                <div className="action-confirm"> <LangText
                    module="ORDERPAD" name="CONFIRM" /> {props.trade_type} <LangText
                    module="ORDERPAD" name="ORDER" /> </div>
            </div>
            <div className="dialogConfirmBody">
                <div className="symbol-details">
                    <span className="symbol-name"> {getDispSymbolName(fieldValues.symObj).primaryName} </span>
                    <span className="exc"> {fieldValues.symObj.exc} </span>
                </div>
                <div className="company-name">
                    {getDispSymbolName(fieldValues.symObj).secondaryName}
                </div>
                <div className="dialogConfirmDetails">
                    {
                        columnValues.length ?
                            <div className={`dataRow ${columnValues.length <= 6 ? 'all' : ''}`}>
                                {
                                    cutArray1.map((item,index) => {
                                        if (columnValues[item])
                                            return (
                                                <span key={index} className="details">
                                                    <span className="label">
                                                        <LangText module="ORDERPAD"
                                                            name={columnValues[item].langKey}
                                                            orientation={TEXT_ORIENTATION.LOWERCASE}
                                                        />
                                                    </span>
                                                    <span className="value">
                                                        {checkEmpty(columnValues[item].value)}
                                                    </span>
                                                </span>
                                            )
                                        return (
                                            <span key={index} className="details">
                                                <span className="label"></span>
                                                <span className="value"></span>
                                            </span>
                                        )
                                    })
                                }
                            </div>
                            : null
                    }
                    {
                        columnValues.length > 5 ?
                            <div className={`dataRow padTop ${columnValues.length <= 6 ? 'all' : ''}`}>
                                {
                                    cutArray2.map((item,index) => {
                                        if (columnValues[item])
                                            return (
                                                <span className="details">
                                                    <span className="label">
                                                        <LangText module="ORDERPAD"
                                                            name={columnValues[item].langKey}
                                                            orientation={TEXT_ORIENTATION.LOWERCASE}
                                                        /></span>
                                                    <span className="value">
                                                        {checkEmpty(columnValues[item].value)}
                                                    </span>
                                                </span>
                                            )
                                        return (
                                            <span key={index} className="details">
                                                <span className="label"></span>
                                                <span className="value"></span>
                                            </span>
                                        )
                                    })
                                }
                            </div>
                            : null
                    }
                    {
                        columnValues.length > 10 ?
                            <div className={`dataRow padTop ${columnValues.length <= 6 ? 'all' : ''}`}>
                                {
                                    cutArray3.map((item,index) => {
                                        if (columnValues[item])
                                            return (
                                                <span className="details">
                                                    <span className="label">
                                                        <LangText module="ORDERPAD"
                                                            name={columnValues[item].langKey}
                                                            orientation={TEXT_ORIENTATION.LOWERCASE}
                                                        /></span>
                                                    <span className="value">
                                                        {checkEmpty(columnValues[item].value)}
                                                    </span>
                                                </span>
                                            )
                                        return (
                                            <span key={index} className="details">
                                                <span className="label"></span>
                                                <span className="value"></span>
                                            </span>
                                        )
                                    })
                                }
                            </div>
                            : null
                    }
                </div>
            </div>
            <div className="dialogConfirmFooter">
                <div className="marginDiv">
                    {/* <div className="reqMargin">
                        <div className="label">REQD. MARGIN:</div>
                        <div className="value reqMargin">
                            {
                                pendingGetMarReq ?
                                    <span className="dotLoading">
                                        <span className="loader__dot">.</span>
                                        <span className="loader__dot">.</span>
                                        <span className="loader__dot">.</span>
                                    </span>
                                    :
                                    checkEmpty(orderValue.orderMargin)
                            }
                        </div>
                        <button className="refreshBtn" onClick={getCheckMargin}>
                            <RefreshIcon />
                        </button>
                    </div> */}
                    <div className="availMargin">
                        <div className="label"><LangText module="ORDERPAD" name="AVAIL_MARGIN" />:</div>
                        <div className="value">
                            {
                                pendingGetMarReq ?
                                    <span className="dotLoading">
                                        <span className="loader__dot">.</span>
                                        <span className="loader__dot">.</span>
                                        <span className="loader__dot">.</span>
                                    </span>
                                    :
                                    checkEmpty(orderValue.available_funds)
                            }
                        </div>
                    </div>
                </div>
                {/* <div className="errorDiv">
                    {errorMsg}
                </div> */}

                <div className="action-button">
                    <button className="modify" onClick={onClickModify}> 
                        <LangText module="BUTTONS" name="MODIFY" /> </button>
                    <button className={`confirm-order ${isBuyTradeAction(props.trade_type) ? 'buyOrder' : 'sellOrder'}`}
                        onClick={onConfirmOrder}> <LangText module="BUTTONS" name="CONFIRM_ORDER" /> </button>
                </div>
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeOrderPadDialogDetails: (s) => { dispatch(storeOrderPadDialogDetails(s)) },
        storeModifyOrderDetails: (s) => { dispatch(storeModifyOrderDetails(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
    };
};

export default connect(null, mapDispatchToProps)(WidgetLoader(OrderConfirmDialog2Component));