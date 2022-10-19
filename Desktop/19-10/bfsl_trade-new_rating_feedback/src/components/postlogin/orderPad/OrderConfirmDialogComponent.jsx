
import React, { useEffect, useRef, useState } from 'react';
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../index'

import { WidgetLoader } from '../../common/WidgetLoaderComponent'
import LangText, { getLangText } from '../../../common/lang/LangText';

import { FUND_TRANSFER, ORDER_PAD } from '../../../config/ServiceURLs';
import { showAppDialog, storeModifyOrderDetails, storeOrderPadDialogDetails } from '../../../state/actions/Actions';

import {
    AF_EventTriggered,
    checkEmpty, getBackOfficeBaseURL, getBaseURL, getDispSymbolName, getFormatedDate, isBuyTradeAction,
    isEquityCashSymbol
} from '../../../common/CommonMethods';
import {
    AF_EVENT_NAMES,
    AF_EVENT_TYPES,
    CONFIRM_ORDER_COLUMNS, DATE_FORMATS, INFO_IDS, ORDERPAD_CONSTANTS, ORDERPAD_DIALOGS, ORDERPAD_FIIELD_KEYS,
    ORDER_MODIFY_TYPE, TEXT_ORIENTATION, TRADE_PRODUCT_TYPES, TRADE_VALIDITY_TYPES
} from '../../../common/Constants';
import { LeftArrowIcon, RefreshIcon } from '../../common/FontIcons';

function OrderConfirmDialog2Component(props) {

    const MsfFetch = useFetch()

    // const [errorMsg,setErrorMsg] = useState(null)
    const [pendingGetMarReq, setPendingGetMarReq] = useState(false)
    const [orderValue, setOrderValue] = useState("")

    const [columnValues, setColumnValues] = useState([])
    const [cutArray1] = useState([0, 1, 2, 3, 4])
    const [cutArray2] = useState([5, 6, 7, 8, 9])
    const [cutArray3] = useState([10, 11, 12, 13, 14])
    // const [shortfallAmnt, setShortfallAmnt] = useState(null)
    // const [marginDetails, setMarginDetails] = useState([])
    // const [marginDetailsSet, setMarginDetailsSet] = useState(false)

    let isPendingRequest = useRef(false)
    let orderResultResp = useRef(null)

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
                // console.log("testapi",props.modifySymDetails)
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
                reqObj['ordDuration'] = (props.fieldValues[ORDERPAD_FIIELD_KEYS.VALIDITY] === TRADE_VALIDITY_TYPES.GTD
                    || props.fieldValues[ORDERPAD_FIIELD_KEYS.VALIDITY] === TRADE_VALIDITY_TYPES.GTC) ?
                    TRADE_VALIDITY_TYPES.DAY : props.fieldValues[ORDERPAD_FIIELD_KEYS.VALIDITY]
                reqObj['trailingSL'] = props.fieldValues[ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS]
                reqObj['currentDateTime'] = props.fieldValues[ORDERPAD_FIIELD_KEYS.CURR_DATE_TIME]
                reqObj['ordDate'] = props.fieldValues[ORDERPAD_FIIELD_KEYS.VALIDITY] === TRADE_VALIDITY_TYPES.GTD ?
                    getFormatedDate(props.fieldValues[ORDERPAD_FIIELD_KEYS.GTD_DATE], 0,
                        DATE_FORMATS.DDMMYYYY_HYPEN, true).stringDate : ""
                reqObj['mktPro'] =  props.fieldValues[ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION]

                request.addToData(reqObj)
                // request.setEncrypt(false)
                MsfFetch.placeRequest(
                    getBaseURL() + ORDER_PAD.MODIFY_ORDER,
                    request,
                    successRespCBPlaceOrder,
                    errorRespCBPlaceOrder
                )
            } else {
                if (props.fieldValues[ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE] == TRADE_PRODUCT_TYPES.CO)
                    triggerPrice = props.fieldValues[ORDERPAD_FIIELD_KEYS.STOP_LOSS]
                if ((props.fieldValues[ORDERPAD_FIIELD_KEYS.VALIDITY] == TRADE_VALIDITY_TYPES.GTD) ||
                    (props.fieldValues[ORDERPAD_FIIELD_KEYS.VALIDITY] == TRADE_VALIDITY_TYPES.GTC)) {
                    // console.log("val",props.fieldValues[ORDERPAD_FIIELD_KEYS.VALIDITY] )
                    request.addToData({
                        'sym': props.fieldValues.symObj,
                        'prdType': props.fieldValues[ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE],
                        'ordType': props.fieldValues[ORDERPAD_FIIELD_KEYS.ORDER_TYPE],
                        'limitPrice': props.fieldValues[ORDERPAD_FIIELD_KEYS.PRICE],
                        'triggerPrice': triggerPrice,
                        // 'targetPrice': props.fieldValues[ORDERPAD_FIIELD_KEYS.SQUARE_OFF],
                        // 'boTgtPrice': props.fieldValues[ORDERPAD_FIIELD_KEYS.SQUARE_OFF],
                        // 'boStpLoss': props.fieldValues[ORDERPAD_FIIELD_KEYS.STOP_LOSS],
                        'isAmo': props.fieldValues[ORDERPAD_FIIELD_KEYS.AMO],
                        'qty': props.fieldValues[ORDERPAD_FIIELD_KEYS.QUANTITY].toString(),
                        // 'disQty': props.fieldValues[ORDERPAD_FIIELD_KEYS.DIS_QTY],
                        'ordAction': props.fieldValues[ORDERPAD_FIIELD_KEYS.ACTION],
                        'ordDuration': props.fieldValues[ORDERPAD_FIIELD_KEYS.VALIDITY],
                        // 'trailingSL': props.fieldValues[ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS],
                        // 'currentDateTime': props.fieldValues[ORDERPAD_FIIELD_KEYS.CURR_DATE_TIME],
                        "ordDate": props.fieldValues[ORDERPAD_FIIELD_KEYS.VALIDITY] === TRADE_VALIDITY_TYPES.GTD ?
                            getFormatedDate(props.fieldValues[ORDERPAD_FIIELD_KEYS.GTD_DATE], 0,
                                DATE_FORMATS.DDMMYYYY_HYPEN, true).stringDate : ""
                    })
                    // request.setEncrypt(false)
                    MsfFetch.placeRequest(
                        getBaseURL() + ORDER_PAD.PLACE_ORDER_GTD,
                        request,
                        successRespCBPlaceOrderGTD,
                        errorRespCBPlaceOrderGTD
                    )
                }
                else {
                    // if(parseFloat(orderValue.AvailMargin) < 0){
                    //     getShortfallDetails(orderValue.AvailMargin,"rejOrder")
                    // }
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
                        'currentDateTime': props.fieldValues[ORDERPAD_FIIELD_KEYS.CURR_DATE_TIME],
                        'mktPro': props.fieldValues[ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION]

                    })
                    MsfFetch.placeRequest(
                        getBaseURL() + ORDER_PAD.PLACE_ORDER,
                        request,
                        successRespCBPlaceOrder,
                        errorRespCBPlaceOrder
                    )
                }

            }
        }
        AF_EventTriggered(AF_EVENT_NAMES.ORDERPAD, props.fieldValues.producType)
    }

    function successRespCBPlaceOrderGTD(response) {
        isPendingRequest.current = false
        props.hideWidgetLoader();
        let dataToResult = {
            result: response.data
        }
        moveToOrderResult(dataToResult)
    }

    function errorRespCBPlaceOrderGTD(error) {
        isPendingRequest.current = false
        props.hideWidgetLoader();
        if (error.infoID === INFO_IDS.REJECTED_ORDER) {
            let dataToResult = {
                result: error.data
            }
            moveToOrderResult(dataToResult)
        }
        else if (error.infoID !== INFO_IDS.DUPLICATATE_ORDER) {
            props.showAppDialog({
                message: error.message,
                show: true
            })
            onClickModify()
        }

    }

    function successRespCBPlaceOrder(response) {
        isPendingRequest.current = false
        props.hideWidgetLoader();
        let dataToResult = {
            result: response.data
        }
        moveToOrderResult(dataToResult)
        AF_EventTriggered(AF_EVENT_NAMES.ORDERPAD, AF_EVENT_TYPES.ORDERPAD_SUCCESS,{"onclick":"orderpadSuccess"})

    }

    function errorRespCBPlaceOrder(error) {
        AF_EventTriggered(AF_EVENT_NAMES.ORDERPAD, AF_EVENT_TYPES.ORDERPAD_FAILURE)
        isPendingRequest.current = false
        props.hideWidgetLoader();
        if (error.infoID === INFO_IDS.REJECTED_ORDER) {
            if (error.data.actCode === "ADD_FUNDS") {
                orderResultResp.current = error.data
                getShortfallDetails(error.data)
                AF_EventTriggered(AF_EVENT_NAMES.ORDERPAD, AF_EVENT_TYPES.ORDERPAD_REJECTED,
                    {"onclick":"orderRejected"})
                // moveToOrderResult(error.data)
            }
            else {
                let dataToResult = {
                    result: error.data
                }
                moveToOrderResult(dataToResult)
            }
            AF_EventTriggered(AF_EVENT_NAMES.ORDERPAD, AF_EVENT_TYPES.ORDERPAD_REJECTED,{"onclick":"orderpadFailure"})
        }
        else if (error.infoID !== INFO_IDS.DUPLICATATE_ORDER) {
            props.showAppDialog({
                message: error.message,
                show: true
            })
            onClickModify()
        }
    }

    function moveToOrderResult(responseData) {
        let result;
        result = {
            symDetails: {
                name: isEquityCashSymbol(props.fieldValues.exc) ?
                    props.fieldValues[ORDERPAD_FIIELD_KEYS.SYMBOL] :
                    props.fieldValues[ORDERPAD_FIIELD_KEYS.DIS_SYMBOL],
                qty: props.fieldValues[ORDERPAD_FIIELD_KEYS.QUANTITY],
                validity: props.fieldValues[ORDERPAD_FIIELD_KEYS.VALIDITY]
            },
            orderId: responseData.result.ordId,
            orderStatus: responseData.result.ordStatus,
            rejReason: responseData.result.rejReason,
            actDisp: responseData.result.actDisp,
            actCode: responseData.result.actCode,
            triggerId: responseData.result.triggerid,
            shortfallAmnt: responseData.shortFallData ? responseData.shortFallData.shortFallAmount : "",
            marginDetails: responseData.shortFallData ? responseData.shortFallData.marginDetails : []
        }
        // else {
        //     result = {
        //         symDetails: {
        //             name: isEquityCashSymbol(props.fieldValues.exc) ?
        //                 props.fieldValues[ORDERPAD_FIIELD_KEYS.SYMBOL] :
        //                 props.fieldValues[ORDERPAD_FIIELD_KEYS.DIS_SYMBOL],
        //             qty: props.fieldValues[ORDERPAD_FIIELD_KEYS.QUANTITY],
        //             validity: props.fieldValues[ORDERPAD_FIIELD_KEYS.VALIDITY]
        //         },
        //         orderId: responseData.ordId,
        //         orderStatus: responseData.ordStatus,
        //         rejReason: responseData.rejReason,
        //         actDisp: responseData.actDisp,
        //         actCode: responseData.actCode,
        //         triggerId: responseData.triggerid
        //     }
        // }
        props.storeModifyOrderDetails({
            modifyType: null,
            symDetails: {}
        })
        props.storeOrderPadDialogDetails({
            dialogName: ORDERPAD_DIALOGS.ORDER_RESULT,
            trade_type: props.fieldValues[ORDERPAD_FIIELD_KEYS.ACTION],
            result: result
        })
        // }
    }

    function getShortfallDetails(data) {
        let request = new MsfRequest();
        request.addToData({
            rejReason: data.rejReason
        })
        request.setEncrypt(false)
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + FUND_TRANSFER.GET_FUNDS_MARGIN,
            request,
            successRespCBgetShortfallDetails,
            errorRespCBgetShortfallDetails
        )
    }

    function successRespCBgetShortfallDetails(response) {
        if (response.data) {
            // setShortfallAmnt(response.data.shrtFallAmnt)
            // setMarginDetails(response.data.marginAmount)
            let dataToResult = {
                result: orderResultResp.current,
                shortFallData: {
                    shortFallAmount:response.data.shrtFallAmnt,
                    marginDetails: response.data.marginAmount
                }
            }
            moveToOrderResult(dataToResult)
            //     setMarginDetails([{
            //         "dispSym": "AJANTPHARM",
            //         "haircutPer": "25.00",
            //         "sym": {
            //             "exc": "NSE",
            //             "otherExch": [
            //                 "BSE"
            //             ],
            //             "multiplier": "1",
            //             "series": "EQ",
            //             "lotSize": "1",
            //             "streamSym": "8124_NSE",
            //             "instrument": "STK",
            //             "id": "STK_AJANTPHARM_EQ_NSE",
            //             "asset": "equity",
            //             "excToken": "8124",
            //             "tickSize": "0.05"
            //         },
            //         "avgPrice": "",
            //         "qty": "200",
            //         "baseSym": "AJANTPHARM"
            //     },
            //     {
            //         "dispSym": "ASIANTILES",
            //         "haircutPer": "0",
            //         "sym": {
            //             "exc": "NSE",
            //             "otherExch": [
            //                 "BSE"
            //             ],
            //             "multiplier": "1",
            //             "series": "EQ",
            //             "lotSize": "1",
            //             "streamSym": "14889_NSE",
            //             "instrument": "STK",
            //             "id": "STK_ASIANTILES_EQ_NSE",
            //             "asset": "equity",
            //             "excToken": "14889",
            //             "tickSize": "0.05"
            //         },
            //         "avgPrice": "",
            //         "qty": "200",
            //         "baseSym": "ASIANTILES"
            //     }])
            // }
            // streamingSubscription([{
            //     "dispSym": "AJANTPHARM",
            //     "haircutPer": "25.00",
            //     "sym": {
            //         "exc": "NSE",
            //         "otherExch": [
            //             "BSE"
            //         ],
            //         "multiplier": "1",
            //         "series": "EQ",
            //         "lotSize": "1",
            //         "streamSym": "8124_NSE",
            //         "instrument": "STK",
            //         "id": "STK_AJANTPHARM_EQ_NSE",
            //         "asset": "equity",
            //         "excToken": "8124",
            //         "tickSize": "0.05"
            //     },
            //     "avgPrice": "",
            //     "qty": "200",
            //     "baseSym": "AJANTPHARM"
            // },
            // {
            //     "dispSym": "ASIANTILES",
            //     "haircutPer": "0",
            //     "sym": {
            //         "exc": "NSE",
            //         "otherExch": [
            //             "BSE"
            //         ],
            //         "multiplier": "1",
            //         "series": "EQ",
            //         "lotSize": "1",
            //         "streamSym": "14889_NSE",
            //         "instrument": "STK",
            //         "id": "STK_ASIANTILES_EQ_NSE",
            //         "asset": "equity",
            //         "excToken": "14889",
            //         "tickSize": "0.05"
            //     },
            //     "avgPrice": "",
            //     "qty": "200",
            //     "baseSym": "ASIANTILES"
            // }])
        }
    }

    function errorRespCBgetShortfallDetails(error) {
        console.log('errorshort: ', error);
        let dataToResult = {
            result: orderResultResp.current
        }
        moveToOrderResult(dataToResult)
        // setMarginDetails([{
        //     "dispSym": "AJANTPHARM",
        //     "haircutPer": "25.00",
        //     "sym": {
        //         "exc": "NSE",
        //         "otherExch": [
        //             "BSE"
        //         ],
        //         "multiplier": "1",
        //         "series": "EQ",
        //         "lotSize": "1",
        //         "streamSym": "8124_NSE",
        //         "instrument": "STK",
        //         "id": "STK_AJANTPHARM_EQ_NSE",
        //         "asset": "equity",
        //         "excToken": "8124",
        //         "tickSize": "0.05"
        //     },
        //     "avgPrice": "",
        //     "qty": "200",
        //     "baseSym": "AJANTPHARM"
        // },
        // {
        //     "dispSym": "ASIANTILES",
        //     "haircutPer": "0",
        //     "sym": {
        //         "exc": "NSE",
        //         "otherExch": [
        //             "BSE"
        //         ],
        //         "multiplier": "1",
        //         "series": "EQ",
        //         "lotSize": "1",
        //         "streamSym": "14889_NSE",
        //         "instrument": "STK",
        //         "id": "STK_ASIANTILES_EQ_NSE",
        //         "asset": "equity",
        //         "excToken": "14889",
        //         "tickSize": "0.05"
        //     },
        //     "avgPrice": "",
        //     "qty": "200",
        //     "baseSym": "ASIANTILES"
        // }])
        // setMarginDetails([])
    }

    function getCheckMargin() {
        setPendingGetMarReq(true)
        let request = new MsfRequest();
        let triggerPrice = props.fieldValues[ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE]
        if (props.fieldValues[ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE] == TRADE_PRODUCT_TYPES.CO) {
            triggerPrice = props.fieldValues[ORDERPAD_FIIELD_KEYS.STOP_LOSS]
            request.addToData({
                sym: props.fieldValues.symObj,
                "prdType": props.fieldValues[ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE],
                "ordType": props.fieldValues[ORDERPAD_FIIELD_KEYS.ORDER_TYPE],
                "ordAction": props.fieldValues[ORDERPAD_FIIELD_KEYS.ACTION],
                "qty": props.fieldValues[ORDERPAD_FIIELD_KEYS.QUANTITY].toString(),
                "ordDuration": props.fieldValues[ORDERPAD_FIIELD_KEYS.VALIDITY],
                "currentDateTime": new Date(),
                "limitPrice": props.fieldValues[ORDERPAD_FIIELD_KEYS.PRICE],
                "isAmo": props.fieldValues[ORDERPAD_FIIELD_KEYS.AMO],
                "triggerPrice": triggerPrice,
                'targetPrice': props.fieldValues[ORDERPAD_FIIELD_KEYS.SQUARE_OFF],
                'boTgtPrice': props.fieldValues[ORDERPAD_FIIELD_KEYS.SQUARE_OFF],
                'boStpLoss': props.fieldValues[ORDERPAD_FIIELD_KEYS.STOP_LOSS],
                'trailingSL': props.fieldValues[ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS],
            })
        }
        else {
            request.addToData({
                sym: props.fieldValues.symObj,
                "prdType": props.fieldValues[ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE],
                "ordType": props.fieldValues[ORDERPAD_FIIELD_KEYS.ORDER_TYPE],
                "ordAction": props.fieldValues[ORDERPAD_FIIELD_KEYS.ACTION],
                "qty": props.fieldValues[ORDERPAD_FIIELD_KEYS.QUANTITY].toString(),
                "ordDuration": props.fieldValues[ORDERPAD_FIIELD_KEYS.VALIDITY],
                "currentDateTime": new Date(),
                "limitPrice": props.fieldValues[ORDERPAD_FIIELD_KEYS.PRICE],
                "isAmo": props.fieldValues[ORDERPAD_FIIELD_KEYS.AMO],
                "triggerPrice": triggerPrice,
                'targetPrice': props.fieldValues[ORDERPAD_FIIELD_KEYS.SQUARE_OFF],
                'boTgtPrice': props.fieldValues[ORDERPAD_FIIELD_KEYS.SQUARE_OFF],
                'boStpLoss': props.fieldValues[ORDERPAD_FIIELD_KEYS.STOP_LOSS],
                'trailingSL': props.fieldValues[ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS],
            })
        }
        request.setEncrypt(false)
        MsfFetch.placeRequest(
            getBaseURL() + ORDER_PAD.CHECK_MARGIN,
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
                <div className="action-confirm">
                    <LangText
                        module="ORDERPAD"
                        name="CONFIRM" /> {props.trade_type} <LangText module="ORDERPAD" name="ORDER" />
                </div>
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
                                    cutArray1.map((item, index) => {
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
                                    cutArray2.map((item, index) => {
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
                                    cutArray3.map((item, index) => {
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
                    <div className="reqMargin">
                        <div className="label"><LangText module="ORDERPAD" name="REQD_MARGIN" />:</div>
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
                    </div>
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
                                    checkEmpty(orderValue.AvailMargin)
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
                        onClick={onConfirmOrder}>  <LangText module="BUTTONS" name="CONFIRM_ORDER" /> </button>
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