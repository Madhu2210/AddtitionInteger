import React, { useEffect, useRef, useState } from 'react'
import { connect } from "react-redux";
import { useFetch, withStreaming, MsfRequest } from '../../../index'

import LangText, { getLangText } from '../../../common/lang/LangText';
import ToggleMenu from '../../common/ToggleComponent'
import InputComponent from '../../common/InputComponent';
import DialogLoader from '../../common/ModalDialogLoaderComponent'
import DatePickerComponent from '../../common/datePicker/DatePickerComponent';

import { ORDER_PAD, QUOTE } from '../../../config/ServiceURLs';

import {
    DEFAULT_VALUES, ORDERPAD_DIALOGS, ORDERPAD_FIIELD_KEYS, ORDER_FIELD_MAX_LENGTH_QTY,
    ORDER_FIELD_MAX_VALUE_QTY, ORDER_MODIFY_TYPE, STREAMING_KEYS, TRADE_INTRADAY_PRODUCT_TYPES,
    STREAMING_MODULES, TRADE_FIELD_MATRIX_GUEST, TRADE_ORDER_TYPES, TRADE_PRODUCT_TYPES, EXCHANGES,
    HIDDEN_FIELD_MATRIX_GUEST, ORDER_FIELD_MAX_LENGTH_PRICE, TRADE_VALIDITY_TYPES,
    TEXT_ORIENTATION, ORDER_FIELD_MAX_VALUE_MP,
    ORDER_FIELD_MAX_LENGTH_IA, TRADE_TYPE_NAME_CONVERSION, TRADE_FIELD_MATRIX_MODIFY_INTRADAY_GUEST,
    ORDER_MODIFY_CHILD_TYPES,
    EXCHANGE_TOGGLE_DATA,
    DATE_FORMATS,
    LOCAL_STORAGE,
    ORDERPAD_SERIES,
    TRADE_INTRADAY_GUEST_PRODUCT_TYPE_ARRAY,
    LOGIN_DIALOGS,
    EMPTY,
    RANGE,
    HIGH,
    HIGH_MAIN_PRICE,
    LOW,
    LOW_25,
    LOW_MAIN_PRICE,
    INVALID,
    LOT_ERROR,
    TICK_SIZE
} from '../../../common/Constants';
import {
    applyPaint, checkEmpty, convertToUpperCase, getColorCode, getDecimal_Precision,
    getDispSymbolName, getFormatedDate,
    isBuyTradeAction, replaceComma, isSellTradeAction, isCommoditySymbol, findTickSize,
    checkInt, checkFloat_withNegative,
    isEquityCashSymbol, countHoleNumbers, countDecimals, convertToFloat, convertCommaSeparated,
    isModifyOrder,
    isEquityFutureSymbol,
    getMarketDataBaseURL,
    formSymBlock,
    getBaseURL,
    getOrderPadErrorMessage
} from '../../../common/CommonMethods';
import {
    showAppDialog, storeHoldingsGuestAlertMsg, storeLoginDialogDetails, storeModifyOrder_InternalFlag, 
    storeOrderFieldValues, storeOrderPadDialogDetails,
    storeOrderpadSelectedSym
} from '../../../state/actions/Actions';
// import { ORDERPAD_MESSAGES } from '../../../common/Messages';
import {
    CheckBoxIcon_Checked, CheckBoxIcon_UnChecked, DatePickerIcon, CirclePlusIcon, CircleMinusIcon,
    ShowLessIcon, ShowMoreIcon
} from '../../common/FontIcons'
import { getItemByKey, getItemFromSessionStorage, storeItemByKey } from '../../../common/LocalStorage';

function OrderPadDialogComponent(props) {

    const MsfFetch = useFetch()

    const [symData, setSymData] = useState({})
    const [basefieldMatrix, setBasefieldMatrix] = useState({})
    const [fields, setFields] = useState({})
    const [productTypes, setProductTypes] = useState([])
    const [orderTypes, setOrderTypes] = useState([])
    const [selectedProductType, setSelectedProductType] = useState('')
    const [selectedProductTypePrimary, setSelectedProductTypePrimary] = useState('')
    const [selectedProductTypeSecondary, setSelectedProductTypeSecondary] = useState('')
    const [qtyChanged, setQtyChanged] = useState(true)
    const [selectedOrderType, setSelectedOrderType] = useState('')
    const [selectedValidity, setSelectedValidity] = useState('')
    const [fieldValue, setFieldValue] = useState({
        [ORDERPAD_FIIELD_KEYS.AMO]: false
    })
    const [excArray, setExcArray] = useState([])
    const [orderValue, setOrderValue] = useState("")
    const [streamingResp, setStreamingResp] = useState(null)
    const [errorFields, setErrorFields] = useState([])
    const [orderTypeArray] = useState([
        'BUY','SELL'
    ])
    const [GTDDate, setGTDDate] = useState('')
    const [errorMsg, setErrorMsg] = useState({})
    const [disableAddQty, setDisableAddQty] = useState(false)
    const [disableSubQty, setDisableSubQty] = useState(true)
    // const [disableAddDis_Qty, setDisableAddDis_Qty] = useState(false)
    // const [disableSubDis_Qty, setDisableSubDis_Qty] = useState(true)
    const [lotSize, setLotSize] = useState(null)
    const [tickSize, setTickSize] = useState(null)
    const [selectedSym, setSelectedSym] = useState({})
    const [tradeType, setTradeType] = useState(null)
    const [hiddenRows, setHiddenRows] = useState({})
    const [pendingGetLotReq] = useState(false)
    const [pendingGetMarReq, setPendingGetMarReq] = useState(false)
    const [givenExc, setGivenExc] = useState('')
    const [orgQty, setOrgQty] = useState(null)
    const [SL_lcl] = useState(null)
    const [SL_ucl] = useState(null)
    // const [disableSLOrders, setDisableSLOrders] = useState(false)
    const [disableNonAMOOrders, setDisableNonAMOOrders] = useState(false)
    // const [maxDate, setMaxDate] = useState('')
    const [showMoreOptions, setShowMoreOptions] = useState(false)
    const [investAmount, setInvestAmount] = useState('')
    const [showInvestAmtField, setShowInvestAmtField] = useState(false)
    const [mainLegPrice, setMainLegPrice] = useState(null)
    const [modifyChildType, setModifyChildType] = useState(null)
    const [seriesState, setSeriesState] = useState(false)
    const [hideFooterActions, setHideFooterActions] = useState(false)

    const currentOrderType = useRef(null)
    const isStreamPrice_Updated = useRef(false)
    const fieldsObjOriginal = useRef(null)

    useEffect(() => {
        props.storeHoldingsGuestAlertMsg(true)
    }, [])

    useEffect(() => {
        let guestTradeArray = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.GUEST_FNO_BLOCK))
        let guestFno = guestTradeArray.includes(props.sym.exc)
        setHideFooterActions(guestFno)
    }, [props.sym.exc])

    useEffect(() => {
       
        if (getTgroupDetails(props.sym)) {
            setSeriesState(true)
        }
        else
            setSeriesState(false)
    }, [props.sym])

    useEffect(() => {

        props.registerStreamCB(onStreamCB, STREAMING_MODULES.ORDERPAD);
        if (props.sym) {
            setTradeType(props.trade_type)
            // getLotSize(props.sym)
            setLotSize(props.sym.lotSize ? props.sym.lotSize : DEFAULT_VALUES.LOT_SIZE)
            setTickSize(props.sym.tickSize)
            setSelectedSym(props.sym)
            setGivenExc(convertToUpperCase(props.sym.exc))
            let details = {
                sym: props.sym
            }
            setSymData(details)
            if (isEquityCashSymbol(props.sym.exc)) {
                setExcArray(EXCHANGE_TOGGLE_DATA.EQUITY)
            }
            else if (isEquityFutureSymbol(props.sym.exc)) {
                setExcArray(EXCHANGE_TOGGLE_DATA.FUTURE)
            }
            streamingSubscription(props.sym)
            // let trade_fields = TRADE_FIELD_MATRIX_GUEST['ICEX']
            let trade_fields = null
            if (props.sym.childType && props.modifyOrder.modifyType === ORDER_MODIFY_TYPE.MODIFY) {
                setModifyChildType(props.sym.childType)
                trade_fields = TRADE_FIELD_MATRIX_MODIFY_INTRADAY_GUEST[props.sym.exc]
            } else
                trade_fields = TRADE_FIELD_MATRIX_GUEST[props.sym.exc]
            if (trade_fields) {
                setBasefieldMatrix(trade_fields)
                setProductTypes(trade_fields.productTypesView)
                if (!props.isModifyOrder_internal && !props.modifyOrder.modifyType)
                    if(props.enableStopLoss == false){
                        setSelectedProductType(props.prod_type)
                    }
                    else{
                        setSelectedProductType(trade_fields.productTypes[0]) 
                    }

                // PreFill for modify order
                if (props.isModifyOrder_internal || props.modifyOrder.modifyType) {
                    let fieldsObj = Object.assign({}, props.orderFieldValues)
                    fieldsObjOriginal.current = Object.assign({}, props.orderFieldValues)
                    if (fieldsObj.mainLegPrice)
                        setMainLegPrice(convertToFloat(replaceComma(fieldsObj.mainLegPrice),
                            countDecimals(fieldsObj.mainLegPrice)))
                    let receivedPType = null
                    let receivedOType = null
                    if (fieldsObj[ORDERPAD_FIIELD_KEYS.QUANTITY] &&
                        props.modifyOrder.modifyType === ORDER_MODIFY_TYPE.MODIFY) {
                        if (fieldsObj[ORDERPAD_FIIELD_KEYS.REMAIN_QTY] && !props.isModifyOrder_internal) {
                            fieldsObj[ORDERPAD_FIIELD_KEYS.QUANTITY] =
                                Math.abs(fieldsObj[ORDERPAD_FIIELD_KEYS.REMAIN_QTY])
                            setOrgQty(Math.abs(fieldsObj[ORDERPAD_FIIELD_KEYS.REMAIN_QTY]))
                        } else {
                            fieldsObj[ORDERPAD_FIIELD_KEYS.QUANTITY] =
                                Math.abs(fieldsObj[ORDERPAD_FIIELD_KEYS.QUANTITY])
                            setOrgQty(Math.abs(fieldsObj[ORDERPAD_FIIELD_KEYS.QUANTITY]))
                        }
                    } else if (fieldsObj[ORDERPAD_FIIELD_KEYS.QUANTITY]) {
                        fieldsObj[ORDERPAD_FIIELD_KEYS.QUANTITY] = Math.abs(fieldsObj[ORDERPAD_FIIELD_KEYS.QUANTITY])
                        setOrgQty(Math.abs(fieldsObj[ORDERPAD_FIIELD_KEYS.QUANTITY]))
                    } else {
                        fieldsObj[ORDERPAD_FIIELD_KEYS.QUANTITY] = null
                    }
                    if (fieldsObj[ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE]) {
                        let typeExist = trade_fields.productTypes.findIndex((item) => {
                            return item === fieldsObj[ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE]
                        })
                        if (typeExist != -1) {
                            setSelectedProductType(convertToUpperCase(fieldsObj[ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE]))
                            receivedPType = convertToUpperCase(fieldsObj[ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE])
                        }
                        else {
                            setSelectedProductType(trade_fields.productTypes[0])
                            receivedPType = trade_fields.productTypes[0]
                        }
                    }
                    else {
                        setSelectedProductType(trade_fields.productTypes[0])
                        receivedPType = trade_fields.productTypes[0]
                    }
                    let availOrderTypes = trade_fields[receivedPType].orderTypes
                    if (fieldsObj[ORDERPAD_FIIELD_KEYS.ORDER_TYPE]) {
                        let typeExist = availOrderTypes.findIndex((item) => {
                            return item === fieldsObj[ORDERPAD_FIIELD_KEYS.ORDER_TYPE]
                        })

                        if (typeExist != -1) {
                            setSelectedOrderType(convertToUpperCase(fieldsObj[ORDERPAD_FIIELD_KEYS.ORDER_TYPE]))
                            receivedOType = convertToUpperCase(fieldsObj[ORDERPAD_FIIELD_KEYS.ORDER_TYPE])
                        }
                        else {
                            setSelectedProductType(availOrderTypes[0])
                            receivedOType = availOrderTypes[0]
                        }
                    }
                    else {
                        setSelectedOrderType(availOrderTypes[0])
                        receivedOType = availOrderTypes[0]
                    }
                    if (fieldsObj[ORDERPAD_FIIELD_KEYS.VALIDITY]) {
                        let availValidities = trade_fields[receivedPType][receivedOType].validity
                        let validityExist = availValidities.findIndex((item) => {
                            return item === fieldsObj[ORDERPAD_FIIELD_KEYS.VALIDITY]
                        })
                        if (validityExist != -1)
                            setSelectedValidity(convertToUpperCase(fieldsObj[ORDERPAD_FIIELD_KEYS.VALIDITY]))
                        else {
                            let pType = trade_fields.productTypes[0]
                            let orderTypeList = trade_fields[pType].orderTypes
                            let oType = orderTypeList[0]
                            let inputFields = trade_fields[pType][oType]
                            setSelectedValidity(inputFields.validity[0])
                        }
                    }
                    else {
                        let pType = trade_fields.productTypes[0]
                        let orderTypeList = trade_fields[pType].orderTypes
                        let oType = orderTypeList[0]
                        let tFields = trade_fields[pType][oType]
                        setSelectedValidity(tFields.validity[0])
                    }
                    if (!fieldsObj[ORDERPAD_FIIELD_KEYS.AMO])
                        fieldsObj[ORDERPAD_FIIELD_KEYS.AMO] = false
                    if (fieldsObj[ORDERPAD_FIIELD_KEYS.GTD_DATE]) {
                        if (props.isModifyOrder_internal)
                            setGTDDate(getFormatedDate(fieldsObj[ORDERPAD_FIIELD_KEYS.GTD_DATE],
                                0, DATE_FORMATS.DEFAULT,
                                true).formatedDate)
                        else
                            setGTDDate(getFormatedDate(fieldsObj[ORDERPAD_FIIELD_KEYS.GTD_DATE]).formatedDate)
                    }
                    calculateInvestAmount(fieldsObj[ORDERPAD_FIIELD_KEYS.QUANTITY],
                        fieldsObj[ORDERPAD_FIIELD_KEYS.PRICE])
                    setFieldValue(fieldsObj)

                    if (props.modifyOrder.modifyType === ORDER_MODIFY_TYPE.MODIFY) {
                        // if (receivedOType === TRADE_ORDER_TYPES.LIMIT || receivedOType === TRADE_ORDER_TYPES.MARKET)
                        //     setDisableSLOrders(true)
                        // else
                        //     setDisableSLOrders(false)

                        if (fieldsObj.AMO || fieldsObj.AMO === "true")
                            setDisableNonAMOOrders(true)
                        else
                            setDisableNonAMOOrders(false)
                    }
                }
            }
        }

        return () => {
            props.storeModifyOrder_InternalFlag(false)
        }
    }, [props.sym, props.trade_type])

    useEffect(() => {
        if (selectedProductType === TRADE_PRODUCT_TYPES.BO || selectedProductType === TRADE_PRODUCT_TYPES.CO) {
            setSelectedProductTypePrimary(TRADE_PRODUCT_TYPES.INTRADAY)
            setSelectedProductTypeSecondary(selectedProductType)
        }
        else {
            setSelectedProductTypePrimary(selectedProductType)
            setSelectedProductTypeSecondary(TRADE_INTRADAY_PRODUCT_TYPES.REGULAR)
        }

        if (basefieldMatrix) {
            if (basefieldMatrix[selectedProductType]) {
                let orderTypeList = basefieldMatrix[selectedProductType].orderTypes
                // let ordertypeExist = false
                // orderTypeList.map((item) => {
                //     if (item === currentOrderType.current)
                //         ordertypeExist = true
                // })
                setOrderTypes(orderTypeList)
                if (!props.isModifyOrder_internal && !props.modifyOrder.modifyType)
                // if (!ordertypeExist)
            
                    setSelectedOrderType(orderTypeList[0])
                 
                // else
                //     setSelectedOrderType(currentOrderType.current)
            }
        }
        // if (selectedProductType === TRADE_PRODUCT_TYPES.CO)
        //     setGetCO_priceRange(true)

    }, [selectedProductType])

    useEffect(() => {
        if (basefieldMatrix[selectedProductType]) {
            let fieldColumns = basefieldMatrix[selectedProductType][selectedOrderType]
            if (fieldColumns) {
                setFields(fieldColumns)
                if (fieldColumns.validity &&
                    fieldColumns.validity.length && !props.isModifyOrder_internal && !props.modifyOrder.modifyType)
                    setSelectedValidity(fieldColumns.validity[0])
            }

            if (props.modifyOrder.modifyType === ORDER_MODIFY_TYPE.MODIFY) {
                if (HIDDEN_FIELD_MATRIX_GUEST[selectedProductType]) {
                    let rows = HIDDEN_FIELD_MATRIX_GUEST[selectedProductType][selectedOrderType]
                    setHiddenRows(rows ? rows : {})
                }
            }
        }
    }, [selectedOrderType])

    useEffect(() => {
        setErrorFields({})
        setErrorMsg({})

        if (selectedOrderType && selectedProductType && tradeType) {
            getCheckMargin()
        }
    }, [selectedProductType, selectedOrderType, tradeType, selectedSym])

    useEffect(() => {
        if (streamingResp && streamingResp !== {}) {
            setStreamingResptoSymbols(streamingResp)
        }
    }, [streamingResp])

    useEffect(() => {
        let values = Object.assign({}, fieldValue)
        if (givenExc !== EXCHANGES.BSE && givenExc !== EXCHANGES.NSE) {
            if (lotSize && !props.isModifyOrder_internal) {
                values[ORDERPAD_FIIELD_KEYS.QUANTITY] =
                    values[ORDERPAD_FIIELD_KEYS.QUANTITY] ?
                        values[ORDERPAD_FIIELD_KEYS.QUANTITY] : lotSize
                setFieldValue(values)
            }
        } else {
            values[ORDERPAD_FIIELD_KEYS.QUANTITY] =
                values[ORDERPAD_FIIELD_KEYS.QUANTITY] ? values[ORDERPAD_FIIELD_KEYS.QUANTITY] : (lotSize ? lotSize : 1)
            setFieldValue(values)
            
        }

        if (values[ORDERPAD_FIIELD_KEYS.QUANTITY] && lotSize) {
            if (values[ORDERPAD_FIIELD_KEYS.QUANTITY] <= lotSize)
                setDisableSubQty(true)
            else
                setDisableSubQty(false)
        }

        if (values[ORDERPAD_FIIELD_KEYS.DIS_QTY] && lotSize) {
            // if (values[ORDERPAD_FIIELD_KEYS.DIS_QTY] <= lotSize)
            //     setDisableSubDis_Qty(true)
            // else
            //     setDisableSubDis_Qty(false)
        }

    }, [lotSize])

    // useEffect(() => {
    //     if (getCO_priceRange)
    //         getCORange()
    // }, [getCO_priceRange])

    // useEffect(() => {
    //     if (selectedProductType === TRADE_PRODUCT_TYPES.CO)
    //         getCORange()
    // }, [tradeType])

    // useEffect(() => {
    //     if (symData)
    //         setMaxDate(getFormatedDate(symData.sym ? symData.sym.expiry : symData.expiry).formatedDate)
    // }, [symData])

    useEffect(() => {
        if (selectedProductType && selectedOrderType) {
            if (selectedProductType === TRADE_PRODUCT_TYPES.DELIVERY
                && (selectedOrderType === TRADE_ORDER_TYPES.MARKET || selectedOrderType === TRADE_ORDER_TYPES.LIMIT))
                setShowInvestAmtField(true)
            else
                setShowInvestAmtField(false)
        } else
            setShowInvestAmtField(false)
    }, [selectedProductType, selectedOrderType])

    useEffect(() => {
        if (fieldValue[ORDERPAD_FIIELD_KEYS.AMO] || selectedValidity === TRADE_VALIDITY_TYPES.IOC) {
            let values = Object.assign({}, fieldValue)
            values[ORDERPAD_FIIELD_KEYS.DIS_QTY] = ''
            setFieldValue(values)

            let errorMsgs = Object.assign({}, errorMsg)
            errorMsgs[ORDERPAD_FIIELD_KEYS.DIS_QTY] = ''
            setErrorMsg(errorMsgs)

            let errorField = Object.assign({}, errorFields)
            errorField[ORDERPAD_FIIELD_KEYS.DIS_QTY] = false
            setErrorFields(errorField)
        }
    }, [selectedValidity, fieldValue[ORDERPAD_FIIELD_KEYS.AMO]])

    function calculateInvestAmount(quantity = fieldValue[ORDERPAD_FIIELD_KEYS.QUANTITY],
        price = fieldValue[ORDERPAD_FIIELD_KEYS.PRICE]) {
        if (price && quantity)
            setInvestAmount(parseInt(price * quantity))
        else
            setInvestAmount(0)
    }

    function calculateQuantity(price = fieldValue[ORDERPAD_FIIELD_KEYS.PRICE], investAmt = investAmount) {
        if (price && investAmt) {
            let values = Object.assign({}, fieldValue)
            if (!((parseInt(investAmt) / parseInt(price)) < 1))
                values[ORDERPAD_FIIELD_KEYS.QUANTITY] = parseInt(parseInt(investAmt) / parseInt(price))
            else
                values[ORDERPAD_FIIELD_KEYS.QUANTITY] = 0
            getCheckMargin(true, values[ORDERPAD_FIIELD_KEYS.QUANTITY])
            setFieldValue(values)
        }
    }

    // function getCORange() {
    //     setPendingGetLotReq(true)
    //     let request = new MsfRequest();
    //     request.addToData({
    //         sym: selectedSym,
    //         "prdType": selectedProductType,
    //         "ordAction": tradeType
    //     })
    //     MsfFetch.placeRequest(
    //         getBaseURL() + ORDER_PAD.CO_PRICE_RANGE,
    //         request,
    //         successRespCBgetCORange,
    //         errorRespCBgetCORange
    //     )
    // }

    // function successRespCBgetCORange(response) {
    //     setPendingGetLotReq(false)
    //     setGetCO_priceRange(false)
    //     let range = response.data.trigPriceRange
    //     if (range) {
    //         let rangeArr = range.split("-")
    //         if (rangeArr.length)
    //             rangeArr.map((item, index) => {
    //                 if (index === 0 && item)
    //                     setSL_lcl(item.trim())
    //                 else if (index === 1 && item)
    //                     setSL_ucl(item.trim())
    //             })
    //     }
    // }

    // function errorRespCBgetCORange(error) {
    //     setGetCO_priceRange(false)
    //     setPendingGetLotReq(false)
    //     props.showAppDialog({
    //         show: true,
    //         message: error.message
    //     })
    // }

    function streamingSubscription(symbol) {
        let symbols = []
        symbols.push(symbol)
        props.forceSubscribeLevel1(symbols,
            [STREAMING_KEYS.LTP, STREAMING_KEYS.CHANGE, STREAMING_KEYS.CHANGE_PER, STREAMING_KEYS.LTT])
    }

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function setStreamingResptoSymbols(resp) {
        let { data } = resp;
        if (data) {
            let symDetails = Object.assign({}, symData)
            symDetails = Object.assign({}, symDetails, applyPaint(symDetails, data));
            setSymData(symDetails)
            let values = Object.assign({}, fieldValue)
            values.ucl = symDetails.ucl
            values.lcl = symDetails.lcl

            if (!values[ORDERPAD_FIIELD_KEYS.PRICE] && symDetails.ltp && !isStreamPrice_Updated.current) {
                values[ORDERPAD_FIIELD_KEYS.PRICE] = replaceComma(symDetails.ltp)
                calculateInvestAmount(values[ORDERPAD_FIIELD_KEYS.QUANTITY], values[ORDERPAD_FIIELD_KEYS.PRICE])
                isStreamPrice_Updated.current = true
            }

            setFieldValue(values)

        }
    }

    function setSelectedTradeType(type) {
        setTradeType(type)
        setQtyChanged(true)
    }

    function onSetProductTypePrimary(type) {
        onSetProductType(type)
    }

    function onSetProductTypeSecondary(type) {
        if (type === TRADE_INTRADAY_PRODUCT_TYPES.REGULAR)
            onSetProductType(TRADE_PRODUCT_TYPES.INTRADAY)
        else
            onSetProductType(type)
    }

    function onSetProductType(item) {
        setSelectedProductType('')
        setQtyChanged(true)
        let orderTypeList = basefieldMatrix[item].orderTypes
        let ordertypeExist = false
        orderTypeList.map((items) => {
            if (items === selectedOrderType)
                ordertypeExist = true
        })

        currentOrderType.current = selectedOrderType
        // if, same value came, useEffect won't call. So, reset here
        setSelectedOrderType('')
        setTimeout(function () {
            setSelectedProductType(item)
            if (props.isModifyOrder_internal || props.modifyOrder.modifyType) {
                if (basefieldMatrix[item]) {
                    setOrderTypes(orderTypeList)
                    if (!ordertypeExist) {
                        setSelectedOrderType(orderTypeList[0])
                        let fieldColumns = basefieldMatrix[item][orderTypeList[0]]
                        if (fieldColumns)
                            setSelectedValidity(fieldColumns.validity[0])
                    }
                    else {
                        setSelectedOrderType(currentOrderType.current)
                        let fieldColumns = basefieldMatrix[item][currentOrderType.current]
                        if (fieldColumns)
                            setSelectedValidity(fieldColumns.validity[0])
                    }
                }
            }
        }, 10);
    }

    function onChangeOrderTypeSwitch(e) {
        if (e.target.checked)
            onSelectOrderType(TRADE_ORDER_TYPES.LIMIT)
        else
            onSelectOrderType(TRADE_ORDER_TYPES.MARKET)
    }

    function onSelectOrderType(item) {
        setSelectedOrderType(item)
        let values = Object.assign({}, fieldValue)
        if (item !== TRADE_ORDER_TYPES.SL && item !== TRADE_ORDER_TYPES.LIMIT) {
            if (!fieldValue[ORDERPAD_FIIELD_KEYS.PRICE]) {
                values[ORDERPAD_FIIELD_KEYS.PRICE] = replaceComma(symData.ltp)
            }
        }
        setQtyChanged(true)
        if (props.isModifyOrder_internal || props.modifyOrder.modifyType) {
            if (basefieldMatrix[selectedProductType]) {
                let fieldColumns = basefieldMatrix[selectedProductType][item]
                if (fieldColumns) {
                    setFields(fieldColumns)
                    setSelectedValidity(fieldColumns.validity[0])
                }
            }
        } else {
            values[ORDERPAD_FIIELD_KEYS.AMO] = false
        }
        setFieldValue(values)

    }

    function onFocusInvestAmt() {
        let insAmount = investAmount
        insAmount = insAmount.toString()
        if (insAmount.length > ORDER_FIELD_MAX_LENGTH_IA) {
            insAmount = parseInt(insAmount.substring(0, ORDER_FIELD_MAX_LENGTH_IA))
            setInvestAmount(insAmount)
            calculateQuantity(null, insAmount)
        }
    }

    function onChangeInvestAmt(e) {
        let value = e.target.value
        let valLength = countHoleNumbers(value)
        if (value) {
            if (checkInt(value)) {
                if (valLength <= ORDER_FIELD_MAX_LENGTH_PRICE) {
                    setInvestAmount(value)
                    calculateQuantity(fieldValue[ORDERPAD_FIIELD_KEYS.PRICE], value)
                }
            }
        }
        else
            setInvestAmount("")
    }

    function onChangeValue(e) {
        let values = Object.assign({}, fieldValue)
        let value = e.target.value
        let inputName = e.target.name
        let min = lotSize ? lotSize : 1
        let valLength = countHoleNumbers(value)

        if (e.target.type === "checkbox")
            values[inputName] = !values[inputName]
        else if (inputName === ORDERPAD_FIIELD_KEYS.QUANTITY) {
            if (value) {
                if (checkInt(value)) {
                    if (valLength <= ORDER_FIELD_MAX_LENGTH_QTY) {
                        values[inputName] = value
                        calculateInvestAmount(value, values[ORDERPAD_FIIELD_KEYS.PRICE])
                        setQtyChanged(true)
                        getCheckMargin(true, value)
                    }
                }
            } else {
                values[inputName] = value
                setOrderValue("")
            }

            if (parseInt(values[inputName]) >= ORDER_FIELD_MAX_VALUE_QTY)
                setDisableAddQty(true)
            else
                setDisableAddQty(false)
            if (parseInt(values[inputName]) <= min || !parseInt(values[inputName]))
                setDisableSubQty(true)
            else
                setDisableSubQty(false)

        } else if (inputName === ORDERPAD_FIIELD_KEYS.DIS_QTY) {
            if (value) {
                if (checkInt(value)) {
                    if (valLength <= ORDER_FIELD_MAX_LENGTH_QTY)
                        values[inputName] = value
                }
            } else {
                values[inputName] = value
            }

            // if (parseInt(values[name]) >= ORDER_FIELD_MAX_VALUE_QTY)
            //     setDisableAddDis_Qty(true)
            // else
            //     setDisableAddDis_Qty(false)
            // if (parseInt(values[name]) <= min || !parseInt(values[name]))
            //     setDisableSubDis_Qty(true)
            // else
            //     setDisableSubDis_Qty(false)
        } else if (inputName === ORDERPAD_FIIELD_KEYS.PRICE || inputName === ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE ||
            inputName === ORDERPAD_FIIELD_KEYS.SQUARE_OFF || inputName === ORDERPAD_FIIELD_KEYS.STOP_LOSS ||
            inputName === ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS
        ) {
            if (value) {
                if (checkFloat_withNegative(value)) {
                    if (countDecimals(value) <= getDecimal_Precision(givenExc))
                        if (valLength <= ORDER_FIELD_MAX_LENGTH_PRICE) {
                            values[inputName] = value
                            if (inputName === ORDERPAD_FIIELD_KEYS.PRICE) {
                                calculateInvestAmount(values[ORDERPAD_FIIELD_KEYS.QUANTITY], value)
                                getCheckMargin(false, null, value)
                            }
                        }
                }
            } else {
                values[inputName] = value
            }
        } else if (inputName === ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION) {
            if (value) {
                if (checkInt(value)) {
                    if (value <= ORDER_FIELD_MAX_VALUE_MP) {
                        values[inputName] = value
                    }
                }
            } else {
                values[inputName] = value
            }
        } else {
            if (value) {
                if (checkFloat_withNegative(value)) {
                    if (valLength <= ORDER_FIELD_MAX_LENGTH_PRICE)
                        values[inputName] = value
                }
            } else {
                values[inputName] = value
            }
        }
        if (inputName === ORDERPAD_FIIELD_KEYS.PRICE) {
            setQtyChanged(true)
        }

        setFieldValue(values)

    }

    function onChangeQtyInc(type, fieldKey) {
        let values = Object.assign({}, fieldValue)
        let lot = lotSize ? lotSize : 1
        let min = lotSize ? lotSize : 1
        let isAddDisableSet = false
        if (type === "add") {
            let qty = parseInt(values[fieldKey] ? values[fieldKey] : 0)
            if (qty < ORDER_FIELD_MAX_VALUE_QTY) {
                if (qty) {
                    let rem = qty % lot
                    qty = qty - rem
                    qty = qty + parseInt(lot)
                    if (qty > ORDER_FIELD_MAX_VALUE_QTY) {
                        isAddDisableSet = true
                        // if (fieldKey === ORDERPAD_FIIELD_KEYS.QUANTITY)
                        //     setDisableAddQty(true)
                        // else
                        //     setDisableAddDis_Qty(true)
                    }
                    else
                        values[fieldKey] = qty
                } else {
                    values[fieldKey] = lot
                }
            }
        } else if (type === "sub") {
            let qty = parseInt(values[fieldKey])
            if (qty > parseInt(min)) {
                let rem = qty % lot
                if (rem)
                    qty = qty - rem
                else
                    qty = qty - parseInt(lot)
                if (qty <= parseInt(min))
                    qty = min
                values[fieldKey] = qty
            }
        }
        setFieldValue(values)

        if (!isAddDisableSet) {
            //     if (values[fieldKey] === ORDER_FIELD_MAX_VALUE_QTY) {
            //         if (fieldKey === ORDERPAD_FIIELD_KEYS.QUANTITY)
            //             setDisableAddQty(true)
            //         else
            //             setDisableAddDis_Qty(true)
            //     } else {
            //         if (fieldKey === ORDERPAD_FIIELD_KEYS.QUANTITY)
            //             setDisableAddQty(false)
            //         else
            //             setDisableAddDis_Qty(false)
            //     }
            // }
            // if (values[fieldKey] == min) {
            //     if (fieldKey === ORDERPAD_FIIELD_KEYS.QUANTITY)
            //         setDisableSubQty(true)
            //     else
            //         setDisableSubDis_Qty(true)
            // } else {
            //     if (fieldKey === ORDERPAD_FIIELD_KEYS.QUANTITY)
            //         setDisableSubQty(false)
            //     else
            //         setDisableSubDis_Qty(false)
        }

        if (fieldKey === ORDERPAD_FIIELD_KEYS.QUANTITY) {
            setQtyChanged(true)
            getCheckMargin(true, values[fieldKey], ORDERPAD_FIIELD_KEYS.QUANTITY)
        }
    }

    function onBlurInput() {
        let fieldKeyArray = Object.keys(fields)
        let reqInputFields = fieldKeyArray.filter((item) => {
            if (!Array.isArray(fields[item]) && fields[item] && item !== "AMO")
                return item
            return ""
        })

        let error = {}
        let errorMsgs = {}

        reqInputFields.map((item) => {
            if (parseFloat(fieldValue[item]) === 0) {
                error[item] = true
                errorMsgs[item] = getOrderPadErrorMessage(INVALID, item)
            }
        })

        setErrorFields(error)
        setErrorMsg(errorMsgs)
    }

    function onBlurInputQuantity() {
        onBlurInput()
        // if (qtyChanged) {
        //     setQtyChanged(false)
        getCheckMargin()
        // }
    }

    function getCheckMargin(qtyFlag, quantity, priceVal) {
        let qtyChangedFlag = qtyFlag ? qtyFlag : qtyChanged
        let qty = quantity ? quantity : parseInt(fieldValue[ORDERPAD_FIIELD_KEYS.QUANTITY])
        let price = priceVal ? priceVal : (fieldValue[ORDERPAD_FIIELD_KEYS.PRICE] ?
            fieldValue[ORDERPAD_FIIELD_KEYS.PRICE] : "")
        let lotSizeVal = parseInt(selectedSym.lotSize)
        if (qty % lotSizeVal === 0 && qtyChangedFlag) {
            setOrderValue("")
            setPendingGetMarReq(true)
            setQtyChanged(false)
            let request = new MsfRequest();
            request.addToData({
                sym: selectedSym,
                "prdType": selectedProductType,
                "ordType": selectedOrderType ? selectedOrderType : "",
                "ordAction": tradeType,
                "qty": (qty).toString(),
                "ordDuration": selectedValidity,
                "currentDateTime": new Date(),
                "limitPrice": selectedOrderType === TRADE_ORDER_TYPES.SL ||
                    selectedOrderType === TRADE_ORDER_TYPES.LIMIT ? price.toString() : symData.ltp,
                "isAmo": fieldValue[ORDERPAD_FIIELD_KEYS.AMO]
            })
            MsfFetch.placeRequest(
                getBaseURL() + ORDER_PAD.GUEST_CHECK_MARGIN,
                request,
                successRespCBgetCheckMargin,
                errorRespCBgetCheckMargin
            )
        }
    }

    function successRespCBgetCheckMargin(response) {
        setPendingGetMarReq(false)
        setOrderValue(response.data)
    }

    function errorRespCBgetCheckMargin() {
        setPendingGetMarReq(false)
    }

    function getTgroupDetails(symbDet) {
        let tGroupSeries = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.TGROUP_SERIES))
        let tGroupSeriesItem = tGroupSeries.list.includes(symbDet.series)
        return tGroupSeriesItem
    }

    function onClickSubmit() {
        let guestWarning = getItemByKey(LOCAL_STORAGE.GUEST_BUY_MSG); 
        let currentDate = new Date().toLocaleDateString()
        if (guestWarning && guestWarning === currentDate) {
            submitGuest()
        }
        else {
            storeItemByKey(LOCAL_STORAGE.GUEST_BUY_MSG, currentDate);
            props.storeLoginDialogDetails({
                dialogName: LOGIN_DIALOGS.GUEST_USER_MENU_INFO,
                parentCB: onSuccessLogin_Guest_User,
            })
            submitGuest() 
        }
    }

    function onSuccessLogin_Guest_User() {
        props.storeLoginDialogDetails({
            dialogName: null,
            parentCB: null,
        })
    }

    function submitGuest() {
        let symDetails = Object.assign({}, symData.sym)
        let tGroupSeries = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.TGROUP_SERIES))
        let oddLotSeries = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.ODD_LOT_SERIES))
        let oddLotSeriesItems = oddLotSeries.list.includes(symDetails.series)
        if (getTgroupDetails(symDetails)) {

            props.storeOrderPadDialogDetails({
                dialogName: ORDERPAD_DIALOGS.ORDEPAD_GROUP_SERIES,
                message: tGroupSeries.msg,
                parentCB: placeOrderSubmit,
                trade_type: tradeType,
                type: ORDERPAD_SERIES.TGROUP_SERIES
            })
        }
        else if (oddLotSeriesItems)
            props.storeOrderPadDialogDetails({
                dialogName: ORDERPAD_DIALOGS.ORDEPAD_GROUP_SERIES,
                message: oddLotSeries.msg,
                parentCB: placeOrderSubmit,
                trade_type: tradeType,
                type: ORDERPAD_SERIES.ODD_LOT_SERIES
            })
        else
            placeOrderSubmit()
    }

    function placeOrderSubmit() {
        let fieldKeyArray = Object.keys(fields)
        let reqInputFields = fieldKeyArray.filter((item) => {
            if (!Array.isArray(fields[item]) && fields[item] && item !== "AMO") {
                if (props.modifyOrder &&
                    (props.modifyOrder.modifyType === ORDER_MODIFY_TYPE.MODIFY ||
                        props.modifyOrder.modifyType === ORDER_MODIFY_TYPE.SQUARE_OFF)) {
                    if (hiddenRows[item] === 'show')
                        return item
                    else if (!hiddenRows[item])
                        return item
                } else if (selectedValidity === TRADE_VALIDITY_TYPES.IOC || fieldValue[ORDERPAD_FIIELD_KEYS.AMO]) {
                    if (item !== ORDERPAD_FIIELD_KEYS.DIS_QTY)
                        return item
                } else
                    return item
            }
            return ""
        })

        let error = {}
        let errorMsgs = {}
        let hasError = false
        let modifyValueChanged = false
        reqInputFields.map((item) => {

            if (item === ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS && fieldValue[item]) {
                if (tickSize)
                    if (findTickSize(getDecimal_Precision(givenExc), parseFloat(fieldValue[item]), tickSize) !== 0) {
                        error[item] = true
                        errorMsgs[item] = (ORDERPAD_FIIELD_KEYS.MSG_NAME[item] ?
                            getLangText(ORDERPAD_FIIELD_KEYS.MSG_NAME[item].langKey) : '') +
                            getOrderPadErrorMessage(TICK_SIZE) + ' ' + tickSize
                        hasError = true
                    }
            }

            if (parseFloat(fieldValue[item]) === 0) {
                error[item] = true
                errorMsgs[item] = getOrderPadErrorMessage(INVALID, item)
                hasError = true
            } else if (item === ORDERPAD_FIIELD_KEYS.QUANTITY) {
                if (!fieldValue[item]) {
                    error[item] = true
                    errorMsgs[item] = getOrderPadErrorMessage(EMPTY, item)
                    hasError = true
                } else if (!parseInt(fieldValue[item])) {
                    error[item] = true
                    errorMsgs[item] = getOrderPadErrorMessage(INVALID, item)
                    hasError = true
                }
                else if (parseInt(fieldValue[item]) < parseInt(lotSize)) {
                    error[item] = true
                    errorMsgs[item] = getOrderPadErrorMessage(LOW, item)
                    hasError = true
                } else if ((fieldValue[item] % lotSize) !== 0) {
                    error[item] = true
                    errorMsgs[item] = getOrderPadErrorMessage(RANGE, item)
                    hasError = true
                }
            } else if (item === ORDERPAD_FIIELD_KEYS.DIS_QTY) {
                if (parseInt(fieldValue[item]) !== 0) {
                    if (parseInt(fieldValue[item]) > parseInt(fieldValue[ORDERPAD_FIIELD_KEYS.QUANTITY])) {
                        error[item] = true
                        errorMsgs[item] = getOrderPadErrorMessage(RANGE, item)
                        hasError = true
                    } else if (isCommoditySymbol(selectedSym.exc) &&
                        parseFloat(fieldValue[item]) <
                        parseFloat((fieldValue[ORDERPAD_FIIELD_KEYS.QUANTITY] * (25 / 100)))) {
                        error[item] = true
                        errorMsgs[item] = getOrderPadErrorMessage(LOW_25, item)
                        hasError = true
                    } else if (!isCommoditySymbol(selectedSym.exc) &&
                        parseFloat(fieldValue[item]) <
                        parseFloat((fieldValue[ORDERPAD_FIIELD_KEYS.QUANTITY] * (10 / 100)))) {
                        error[item] = true
                        errorMsgs[item] = getOrderPadErrorMessage(LOW, item)
                        hasError = true
                    }
                }
                // if (givenExc !== EXCHANGES.NSE && givenExc !== EXCHANGES.BSE) {
                if ((fieldValue[item] % lotSize) !== 0 && fieldValue[item]) {
                    error[item] = true
                    errorMsgs[item] = getOrderPadErrorMessage(LOT_ERROR, item)
                    hasError = true
                }
                // }
            } else if (!fieldValue[item] && item !==
                ORDERPAD_FIIELD_KEYS.DIS_QTY && item !==
                ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS && item !== ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION) {
                error[item] = true
                errorMsgs[item] = getOrderPadErrorMessage(EMPTY, item)
                hasError = true
            } else if (item === ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE && selectedOrderType !== TRADE_ORDER_TYPES.SL_M) {
                if (isBuyTradeAction(tradeType) &&
                    (parseFloat(fieldValue[item]) > parseFloat(fieldValue[ORDERPAD_FIIELD_KEYS.PRICE]))) {
                    error[item] = true
                    errorMsgs[item] = getOrderPadErrorMessage(HIGH, item)
                    hasError = true
                } else if (isSellTradeAction(tradeType) &&
                    (fieldValue[item] < fieldValue[ORDERPAD_FIIELD_KEYS.PRICE])) {
                    error[item] = true
                    errorMsgs[item] = getOrderPadErrorMessage(LOW, item)
                    hasError = true
                }
            } else if (item === ORDERPAD_FIIELD_KEYS.SQUARE_OFF) {
                if ((parseFloat(fieldValue[item]) < parseFloat(fieldValue[ORDERPAD_FIIELD_KEYS.PRICE]))) {
                    error[item] = true
                    errorMsgs[item] = getOrderPadErrorMessage(LOW, item)
                    hasError = true
                }
            } else if (item === ORDERPAD_FIIELD_KEYS.STOP_LOSS) {
                if ((selectedProductType === TRADE_PRODUCT_TYPES.CO &&
                    selectedOrderType === TRADE_ORDER_TYPES.LIMIT) || selectedProductType === TRADE_PRODUCT_TYPES.BO) {
                    if (isBuyTradeAction(tradeType) &&
                        (parseFloat(fieldValue[item]) > parseFloat(fieldValue[ORDERPAD_FIIELD_KEYS.PRICE]))) {
                        error[item] = true
                        errorMsgs[item] = getOrderPadErrorMessage(HIGH, item)
                        hasError = true
                    } else if (isSellTradeAction(tradeType) &&
                        (parseFloat(fieldValue[item]) < parseFloat(fieldValue[ORDERPAD_FIIELD_KEYS.PRICE]))) {
                        error[item] = true
                        errorMsgs[item] = getOrderPadErrorMessage(LOW, item)
                        hasError = true
                    }
                } else if ((parseFloat(fieldValue[item]) > parseFloat(fieldValue[ORDERPAD_FIIELD_KEYS.PRICE]))) {
                    if (selectedOrderType === TRADE_ORDER_TYPES.MARKET) {
                        if (selectedProductType !== TRADE_PRODUCT_TYPES.CO) {
                            error[item] = true
                            errorMsgs[item] = getOrderPadErrorMessage(HIGH, item)
                            hasError = true
                        }
                    } else {
                        error[item] = true
                        errorMsg[item] = getOrderPadErrorMessage(HIGH, item)
                        hasError = true
                    }
                }
                if (tickSize && findTickSize(getDecimal_Precision(givenExc),
                    parseFloat(fieldValue[item]), tickSize) !== 0) {
                    error[item] = true
                    errorMsgs[item] = (ORDERPAD_FIIELD_KEYS.MSG_NAME[item] ?
                        getLangText(ORDERPAD_FIIELD_KEYS.MSG_NAME[item].langKey) : 'Value') + 
                        getOrderPadErrorMessage(TICK_SIZE) + ' ' + tickSize
                    hasError = true
                } else if (selectedProductType === TRADE_PRODUCT_TYPES.CO && SL_lcl && SL_ucl) {
                    if (!((parseFloat(replaceComma(fieldValue[item]))
                        >= parseFloat(replaceComma(SL_lcl)))
                        && (parseFloat(replaceComma(fieldValue[item]))
                            <= parseFloat(replaceComma(SL_ucl))))) {
                        error[item] = true
                        errorMsgs[item] = getOrderPadErrorMessage(RANGE, item)
                        hasError = true
                    }
                }
            }

            if (props.modifyOrder.modifyType === ORDER_MODIFY_TYPE.SQUARE_OFF &&
                item === ORDERPAD_FIIELD_KEYS.QUANTITY) {
                if (orgQty) {
                    if (parseInt(fieldValue[item]) > parseInt(orgQty)) {
                        error[item] = true
                        errorMsgs[item] = getOrderPadErrorMessage(HIGH, item)
                        hasError = true
                    }
                }
            }

            if ((item === ORDERPAD_FIIELD_KEYS.PRICE || item === ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE ||
                item === ORDERPAD_FIIELD_KEYS.SQUARE_OFF ||
                (item === ORDERPAD_FIIELD_KEYS.STOP_LOSS && selectedProductType !== TRADE_PRODUCT_TYPES.CO))
                && fieldValue[item] && fieldValue.lcl && fieldValue.ucl
            ) {
                if (tickSize && findTickSize(getDecimal_Precision(givenExc),
                    parseFloat(fieldValue[item]), tickSize) !== 0) {
                    error[item] = true
                    errorMsgs[item] = (ORDERPAD_FIIELD_KEYS.MSG_NAME[item] ?
                        getLangText(ORDERPAD_FIIELD_KEYS.MSG_NAME[item].langKey) : 'Value') + 
                        getOrderPadErrorMessage(TICK_SIZE) + ' ' + tickSize
                    hasError = true
                } else if (!((parseFloat(replaceComma(fieldValue[item])) >=
                    parseFloat(replaceComma(fieldValue.lcl))) &&
                    (parseFloat(replaceComma(fieldValue[item])) <= parseFloat(replaceComma(fieldValue.ucl))))) {
                    error[item] = true
                    if (!errorMsgs[item])
                        errorMsgs[item] = getOrderPadErrorMessage(RANGE, item)
                    hasError = true
                }
            }

            if (convertToUpperCase(modifyChildType) === ORDER_MODIFY_CHILD_TYPES.SECOND) {
                if (item === ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE && !error[item]) {
                    if (isBuyTradeAction(tradeType) && fieldValue[item] < mainLegPrice) {
                        error[item] = true
                        errorMsgs[item] = getOrderPadErrorMessage(LOW_MAIN_PRICE, item) +
                            " (" + convertCommaSeparated(mainLegPrice) + ")"
                        hasError = true
                    } else if (isSellTradeAction(tradeType) && fieldValue[item] > mainLegPrice) {
                        error[item] = true
                        errorMsgs[item] = getOrderPadErrorMessage(HIGH_MAIN_PRICE,item) +
                            " (" + convertCommaSeparated(mainLegPrice) + ")"
                        hasError = true
                    }
                }
            } else if (modifyChildType === ORDER_MODIFY_CHILD_TYPES.THIRD) {
                if (item === ORDERPAD_FIIELD_KEYS.PRICE && !error[item]) {
                    if (isBuyTradeAction(tradeType) && fieldValue[item] < mainLegPrice) {
                        error[item] = true
                        errorMsgs[item] = getOrderPadErrorMessage(LOW_MAIN_PRICE, item) +
                            " (" + convertCommaSeparated(mainLegPrice) + ")"
                        hasError = true
                    } else if (isSellTradeAction(tradeType) && fieldValue[item] > mainLegPrice) {
                        error[item] = true
                        errorMsgs[item] = getOrderPadErrorMessage(HIGH_MAIN_PRICE,item) +
                            " (" + convertCommaSeparated(mainLegPrice) + ")"
                        hasError = true
                    }
                }
            }

            if (isModifyOrder(props.modifyOrder.modifyType)) {
                if (item === ORDERPAD_FIIELD_KEYS.QUANTITY) {
                    if (ORDERPAD_FIIELD_KEYS.REMAIN_QTY in fieldsObjOriginal.current
                        && fieldValue[item] !=
                        fieldsObjOriginal.current[ORDERPAD_FIIELD_KEYS.REMAIN_QTY])
                        modifyValueChanged = true
                }
                else if (item in fieldsObjOriginal.current && fieldValue[item] != fieldsObjOriginal.current[item])
                    modifyValueChanged = true
            }

            return item
        })

        if (isModifyOrder(props.modifyOrder.modifyType)) {
            if (selectedProductType != fieldsObjOriginal.current[ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE] ||
                selectedOrderType != fieldsObjOriginal.current[ORDERPAD_FIIELD_KEYS.ORDER_TYPE] ||
                selectedValidity != fieldsObjOriginal.current[ORDERPAD_FIIELD_KEYS.VALIDITY]
            )
                modifyValueChanged = true
        }

        if (fields[ORDERPAD_FIIELD_KEYS.VALIDITY] && fields[ORDERPAD_FIIELD_KEYS.VALIDITY].length) {
            if (selectedValidity === TRADE_VALIDITY_TYPES.GTD) {
                if (!GTDDate) {
                    errorMsgs[ORDERPAD_FIIELD_KEYS.GTD_DATE] = getOrderPadErrorMessage(EMPTY, 
                        ORDERPAD_FIIELD_KEYS.GTD_DATE)
                    error[ORDERPAD_FIIELD_KEYS.GTD_DATE] = true
                    hasError = true
                }
            }
        }

        setErrorFields(error)
        setErrorMsg(errorMsgs)

        if (errorMsg[ORDERPAD_FIIELD_KEYS.DIS_QTY])
            setShowMoreOptions(true)

        if (!hasError) {
            if (isModifyOrder(props.modifyOrder.modifyType)) {
                if (modifyValueChanged)
                    moveToConfirmOrder()
                else {
                    props.showAppDialog({
                        show: true,
                        message: getLangText("NO_FIELD_MODIFIED", "ORDERPAD")
                    })
                }
            }
            else
                moveToConfirmOrder()
        }
    }

    function moveToConfirmOrder() {
        let fieldKeyArray = Object.keys(fields)
        let unReqInputFields = fieldKeyArray.filter((item) => {
            if (!Array.isArray(fields[item]) && !fields[item] && item !== "AMO")
                return item
            return ""
        })

        let hidePrice = false
        unReqInputFields.map((item) => {
            if (item === ORDERPAD_FIIELD_KEYS.PRICE) {
                hidePrice = true
            } else
                // clearing the unrequired values
                fieldValue[item] = null

        })

        let reqSym = selectedSym
        let values = Object.assign({}, fieldValue)

        values.symObj = reqSym

        if (values[ORDERPAD_FIIELD_KEYS.PRICE])
            values[ORDERPAD_FIIELD_KEYS.PRICE] =
                parseFloat(values[ORDERPAD_FIIELD_KEYS.PRICE]).toFixed(getDecimal_Precision(selectedSym.exc))
        // if (hidePrice)
        //     values[ORDERPAD_FIIELD_KEYS.PRICE] = undefined
        if (values[ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE])
            values[ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE] =
                parseFloat(values[ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE]).
                    toFixed(getDecimal_Precision(selectedSym.exc))
        if (values[ORDERPAD_FIIELD_KEYS.SQUARE_OFF])
            values[ORDERPAD_FIIELD_KEYS.SQUARE_OFF] =
                parseFloat(values[ORDERPAD_FIIELD_KEYS.SQUARE_OFF]).
                    toFixed(getDecimal_Precision(selectedSym.exc))
        if (values[ORDERPAD_FIIELD_KEYS.STOP_LOSS])
            values[ORDERPAD_FIIELD_KEYS.STOP_LOSS] =
                parseFloat(values[ORDERPAD_FIIELD_KEYS.STOP_LOSS]).toFixed(getDecimal_Precision(selectedSym.exc))
        if (values[ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS])
            values[ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS] =
                parseFloat(values[ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS]).toFixed(getDecimal_Precision(selectedSym.exc))
        values[ORDERPAD_FIIELD_KEYS.SYMBOL] = reqSym.baseSym
        values[ORDERPAD_FIIELD_KEYS.DIS_SYMBOL] = isEquityCashSymbol(reqSym.exc) ? reqSym.companyName : reqSym.dispSym
        values[ORDERPAD_FIIELD_KEYS.EXC] = reqSym.exc
        values[ORDERPAD_FIIELD_KEYS.ACTION] = tradeType
        values[ORDERPAD_FIIELD_KEYS.ORDER_TYPE] = selectedOrderType
        values[ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE] = selectedProductType
        values[ORDERPAD_FIIELD_KEYS.VALIDITY] = selectedValidity
        // values[ORDERPAD_FIIELD_KEYS.ORDER_VALIDITY] = selectedOrderValidity
        // if (!hideOrderValue())
        values[ORDERPAD_FIIELD_KEYS.ORDER_VALUE] = orderValue.orderMargin
        values[ORDERPAD_FIIELD_KEYS.GTD_DATE] = GTDDate
        values[ORDERPAD_FIIELD_KEYS.CURR_DATE_TIME] = new Date()
        values.hidePrice = hidePrice
        props.storeOrderFieldValues(values)
        props.storeOrderPadDialogDetails({
            dialogName: ORDERPAD_DIALOGS.ORDER_CONFIRM,
            trade_type: tradeType
        })
    }

    function onClickSubmitMD() {
        props.storeOrderPadDialogDetails({
            dialogName: ORDERPAD_DIALOGS.MARKET_DEPTH,
            trade_type: tradeType
        })
    }

    function onChangeDate(e) {
        setGTDDate(e.target.value)
    }

    // function onSelectFutureSym(sym) {
    //     let details = {
    //         sym: sym
    //     }
    //     setSymData(details)
    //     props.storeOrderpadSelectedSym(sym)
    //     setSelectedSym(sym)
    //     streamingSubscription(sym)
    //     setGTDDate('')
    //     setQtyChanged(true)
    // }

    // function gotoQuoteScreen(symDetail) {
    //     saveQuoteScreenDetails(symDetail.sym, props.history.location.pathname)
    //     props.onCloseCB && props.onCloseCB()
    //     props.history.push(SCREENS.QUOTE)
    // }
    function onSelectExchange(type) {
        let request = new MsfRequest();
        request.addToData({
            sym: props.sym,
            otherExch: type
        })
        request.setEncrypt(false)
        MsfFetch.placeRequest(
            getMarketDataBaseURL() + QUOTE.GET_SYMBOL_INFO,
            request,
            successRespCBgetOtherExc,
            errorRespCBggetOtherExc
        )
    }

    function successRespCBgetOtherExc(response) {
        refreshOrderpadbyExc(response.data)
    }

    function errorRespCBggetOtherExc(error) {
        props.showAppDialog({
            show: true,
            message: error.message
        })
    }

    function refreshOrderpadbyExc(symDetails) {
        let symObj = formSymBlock(symDetails)
        props.storeOrderpadSelectedSym(symObj)
    }

    // function getDisablesStatue(orderType) {
    //     if (fieldValue[ORDERPAD_FIIELD_KEYS.AMO]) {
    //         return false
    //     }

    //     if ((orderType === TRADE_ORDER_TYPES.SL || orderType === TRADE_ORDER_TYPES.SL_M) && disableSLOrders)
    //         return true
    //     else if (orderType === TRADE_ORDER_TYPES.MARKET && disableNonAMOOrders)
    //         return true

    //     return false
    // }

    function getMarketLimitToggleFlag(oTypeArray, oType) {
        let hasMarketOType = oTypeArray.findIndex((item) => {
            return item === TRADE_ORDER_TYPES.MARKET
        })
        let hasLimitOType = oTypeArray.findIndex((item) => {
            return item === TRADE_ORDER_TYPES.LIMIT
        })
        if (disableNonAMOOrders)
            return false
        else if (oType !== TRADE_ORDER_TYPES.SL && oType !==
            TRADE_ORDER_TYPES.SL_M && hasMarketOType !== -1 && hasLimitOType !== -1) {
            if (hiddenRows[ORDERPAD_FIIELD_KEYS.ORDER_TYPE]) {
                if (hiddenRows[ORDERPAD_FIIELD_KEYS.ORDER_TYPE] === 'show')
                    return true
                return false
            } return true
        } return false
    }

    function typeNameConversion(type) {
        if (TRADE_TYPE_NAME_CONVERSION[type])
            return TRADE_TYPE_NAME_CONVERSION[type]
        return type
    }

    return (
        <div className="orderPadBase">
            <DialogLoader show={!!pendingGetLotReq} />
            <div className="header">
                <div className="content">
                    <div className="valueDiv">
                        <div className="top">
                            <div className="name">
                                <span className="symName text-nowrap"
                                    title={getDispSymbolName(symData).primaryName}
                                >
                                    {getDispSymbolName(symData).primaryName}
                                </span>
                                {
                                    symData.sym ?
                                        (
                                            symData.sym.otherExch && symData.sym.otherExch.length &&
                                            props.modifyOrder.modifyType !== ORDER_MODIFY_TYPE.MODIFY &&
                                            props.modifyOrder.modifyType !== ORDER_MODIFY_TYPE.SQUARE_OFF
                                        ) ?
                                            <ToggleMenu menus={excArray}
                                                selectedMenu={givenExc}
                                                orderAction={true}
                                                hasToggle={true}
                                                onSelectMenuCB={onSelectExchange}
                                            /> :
                                            <span className="exc">{symData.sym ? symData.sym.exc : ''}</span>

                                        : null
                                }

                            </div>
                            <div className="ltpVal">
                                <span className={symData.ltpClass}>{checkEmpty(symData.ltp)}</span>
                            </div>
                        </div>
                        <div className="bottom">
                            <div className="lttVal">
                                {checkEmpty(symData.ltt)}
                            </div>
                            <div className={`changeVal ${getColorCode(symData.chng)}`}>
                                <span className="chng">
                                    {checkEmpty(symData.chng)} ({checkEmpty(symData.chngPer)}%)
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="actionDiv">
                        <ToggleMenu menus={orderTypeArray} selectedMenu={tradeType} orderAction={true}
                            hasToggle={!
                            ((hiddenRows[ORDERPAD_FIIELD_KEYS.ORDER_TYPE] ||
                                    (props.modifyOrder.modifyType == ORDER_MODIFY_TYPE.SQUARE_OFF) ||
                                    (props.modifyOrder.modifyType == ORDER_MODIFY_TYPE.ADD_MORE)))}
                            onSelectMenuCB={(item) => setSelectedTradeType(item)}
                            hasLangageDependent = {true}
                        />
                    </div>
                </div>
            </div>
            <div className={`body 
            ${props.modifyOrder.modifyType === ORDER_MODIFY_TYPE.MODIFY ?
            'modifyOrder' : (props.modifyOrder.modifyType === ORDER_MODIFY_TYPE.SQUARE_OFF) ?
                'squareOff-order' : 'newOrder'}`}>
                <div className="productHeader">
                    <div className={`prdTypeDiv ${hiddenRows[ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE]}`}>
                        <>
                            {
                                productTypes.map((pItem, index) => {
                                    return (
                                        <span key={index}
                                            className={`productType flex-center 
                                            ${(pItem !== TRADE_PRODUCT_TYPES.DELIVERY
                                                    && seriesState) ?
                                            "disabled" : ""
                                        }
                                        ${(props.modifyOrder.modifyType === ORDER_MODIFY_TYPE.SQUARE_OFF) ?
                                            (pItem !== props.orderFieldValues.producType) ?
                                                "disabled" : "" : ""
                                        }
                                         ${selectedProductTypePrimary === pItem ? 'selected' : ''}`}
                                            onClick={(pItem !== TRADE_PRODUCT_TYPES.DELIVERY
                                                && seriesState) ? null :() => onSetProductTypePrimary(pItem)}
                                        >
                                            <LangText name={pItem}/>
                                        </span>
                                    )
                                })
                            }
                            <div className="hidingDiv"></div>
                        </>
                    </div>
                    <div className=" cursor marketDepthDiv" onClick={onClickSubmitMD} >
                        {/* MARKET DEPTH */}
                    </div>
                </div>
                <div className="fieldBody">
                    <div className="fieldRow qty_price">
                        <div className="row">
                            {
                                fields[ORDERPAD_FIIELD_KEYS.QUANTITY] ?
                                    <div className={`field ${errorFields[ORDERPAD_FIIELD_KEYS.QUANTITY] ?
                                        'errorInputDiv' : ''} ${hiddenRows[ORDERPAD_FIIELD_KEYS.QUANTITY]} 
                                     ${isEquityCashSymbol(givenExc) ? 'disableLot' : ''}`}>
                                        <>
                                            <div className="labelInput">
                                                <LabledInput 
                                                    label={getLangText('QUANTITTY')}
                                                    name={ORDERPAD_FIIELD_KEYS.QUANTITY}
                                                    value={fieldValue[ORDERPAD_FIIELD_KEYS.QUANTITY]}
                                                    onChangeCB={onChangeValue}
                                                />
                                                <span className="lotChange">
                                                    <button className={`sub ${disableSubQty ? 'disabled' : ''}`}
                                                        onClick={!disableSubQty ?
                                                            () => onChangeQtyInc('sub', ORDERPAD_FIIELD_KEYS.QUANTITY)
                                                            : ''}
                                                    >
                                                        <CircleMinusIcon />
                                                    </button>
                                                    <button className={`add ${disableAddQty ? 'disabled' : ''}`}
                                                        onClick={!disableAddQty ?
                                                            () => onChangeQtyInc('add', ORDERPAD_FIIELD_KEYS.QUANTITY) :
                                                            ''}
                                                    >
                                                        <CirclePlusIcon />
                                                    </button>
                                                </span>
                                                <div className="hidingDiv"></div>
                                            </div>
                                            <div className={`range lotDiv ${lotSize > 1 ? '' : 'disableLot'}`}>
                                                {
                                                    lotSize ?
                                                        <span className="minLotVal">
                                                            <LangText module="ORDERPAD" name="EXP_QTY" /> :
                                                            {lotSize}</span>
                                                        :
                                                        null
                                                }
                                            </div>
                                            <div className="errorMsg-div text-nowrap"
                                                title={errorMsg[ORDERPAD_FIIELD_KEYS.QUANTITY]}
                                            >
                                                {errorMsg[ORDERPAD_FIIELD_KEYS.QUANTITY]}
                                            </div>
                                        </>
                                    </div>
                                    : null
                            }

                            <div className={`field priceField
                             ${getMarketLimitToggleFlag(orderTypes, selectedOrderType) ? '' : 'noToggle'} 
                             ${errorFields[ORDERPAD_FIIELD_KEYS.PRICE] ? 'errorInputDiv' : ''} 
                             ${hiddenRows[ORDERPAD_FIIELD_KEYS.PRICE]}`}>
                                <div className="labelInput">
                                    <LabledInput
                                        label={getLangText('PRICEE')}
                                        name={ORDERPAD_FIIELD_KEYS.PRICE}
                                        value={fieldValue[ORDERPAD_FIIELD_KEYS.PRICE]}
                                        onChangeCB={onChangeValue}
                                        disabled={!fields[ORDERPAD_FIIELD_KEYS.PRICE]}
                                        onBlur={onBlurInputQuantity}
                                    />
                                    {
                                        getMarketLimitToggleFlag(orderTypes, selectedOrderType) ?
                                            <>
                                                <label className="switch">
                                                    <input type="checkbox"
                                                        checked={selectedOrderType === TRADE_ORDER_TYPES.LIMIT}
                                                        onChange={onChangeOrderTypeSwitch}
                                                    />
                                                    <span className="slider round"></span>
                                                </label>
                                                <span className="toggleOrderTypeName">
                                                    <LangText name={selectedOrderType}/></span>
                                            </>
                                            : null
                                    }
                                    <div className="hidingDiv"></div>
                                </div>
                                <div className="range">
                                    {
                                        (fieldValue.lcl && fieldValue.ucl) ?
                                            <span>
                                                <span id="lowerCircuitVal"
                                                    className="lowerCircuitVal">{fieldValue.lcl}</span> -
                                                <span id="upperCircuitVal" className="upperCircuitVal">
                                                    {fieldValue.ucl}</span>
                                            </span>
                                            : null
                                    }
                                </div>
                                <div className="errorMsg-div text-nowrap"
                                    title={errorMsg[ORDERPAD_FIIELD_KEYS.PRICE]}
                                >
                                    {errorMsg[ORDERPAD_FIIELD_KEYS.PRICE]}
                                </div>
                            </div>
                            {
                                showInvestAmtField ?
                                    <div className="field">
                                        <div className="labelInput">
                                            <LabledInput 
                                                label={getLangText('INVESTED_AMOUNTT')}
                                                name="investedAmt"
                                                value={investAmount}
                                                onChangeCB={onChangeInvestAmt}
                                                onFocus={onFocusInvestAmt}
                                                maxLength={ORDER_FIELD_MAX_LENGTH_IA}
                                            />
                                        </div>
                                    </div>
                                    : null
                            }
                        </div>
                    </div>
                    <div className="fieldRow">
                        <span className="label">
                            <LangText module="ORDERPAD" name="ORDER" /> <span className="selectedLabel">
                            [<LangText name={typeNameConversion(selectedOrderType)}/> ]</span></span>
                        <div className="field orderField">
                            <div className={`oTypeDiv ${hiddenRows[ORDERPAD_FIIELD_KEYS.ORDER_TYPE]}`}>
                                {
                                    orderTypes.map((oItem, oIndex) => {
                                        return (
                                            <label key={oIndex} className={`cursor radioField`}>
                                                <input type="radio"
                                                    name="ordType"
                                                    onClick={() => onSelectOrderType(oItem)}
                                                    checked={selectedOrderType ? oItem === selectedOrderType : false}
                                                />
                                                <span className="checkmark"></span>
                                                <div className="value">
                                                    <LangText name={oItem}/></div>
                                            </label>
                                        )
                                    })
                                }
                                <div className="hidingDiv"></div>
                            </div>
                        </div>
                    </div>
                    <div className={`fieldRow `}>
                        <div className="row">
                            {
                                fields[ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE] ?
                                    <div className={`field ${errorFields[ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE]
                                        ? 'errorInputDiv' : ''} ${hiddenRows[ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE]}`}>
                                        <div className="labelInput">
                                            <LabledInput label="Trigger Price"
                                                name={ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE}
                                                value={fieldValue[ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE]}
                                                onChangeCB={onChangeValue}
                                            />
                                            <div className="hidingDiv"></div>
                                        </div>
                                        <div className="range">
                                            {
                                                (fieldValue.lcl && fieldValue.ucl) ?
                                                    <span>
                                                        <span className="lowerCircuitVal">
                                                            {fieldValue.lcl}</span> -
                                                        <span className="upperCircuitVal">{fieldValue.ucl}</span>
                                                    </span>
                                                    : null
                                            }
                                        </div>
                                        <div className="errorMsg-div text-nowrap"
                                            title={errorMsg[ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE]}
                                        >
                                            {errorMsg[ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE]}
                                        </div>
                                    </div>
                                    : null
                            }
                            {
                                fields[ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION] ?
                                    <div className={`field 
                                    ${errorFields[ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION] ? 'errorInputDiv' : ''}`}>
                                        <div className="labelInput">
                                            <LabledInput
                                                label={getLangText('MARKET_PROTECTION')}
                                                name={ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION}
                                                value={fieldValue[ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION]}
                                                onChangeCB={onChangeValue}
                                            />
                                            <span className="addOn">%</span>
                                            <div className="hidingDiv"></div>
                                        </div>
                                        <div className="errorMsg-div text-nowrap"
                                            title={errorMsg[ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION]}
                                        >
                                            {errorMsg[ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION]}
                                        </div>
                                    </div>
                                    : null
                            }
                        </div>
                    </div>
                    {
                        selectedProductTypePrimary === TRADE_PRODUCT_TYPES.INTRADAY ?
                            <div className={`fieldRow`}>
                                <span className="label">
                                    <LangText module="ORDERPAD" name="TYPE" /> <span className="selectedLabel">
                                    [ <LangText name={typeNameConversion(selectedProductTypeSecondary)}/> ]
                                    </span> </span>
                                <div className={`field orderField ${hiddenRows[ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE]}`}>
                                    {
                                        TRADE_INTRADAY_GUEST_PRODUCT_TYPE_ARRAY.map((iItem, iIndex) => {
                                            return (
                                                <label className={`cursor radioField`}
                                                    key={iIndex}
                                                >
                                                    <input type="radio"
                                                        name="prdTypePrim"
                                                        onClick={() => onSetProductTypeSecondary(iItem)}
                                                        checked={selectedProductTypeSecondary ?
                                                            iItem === selectedProductTypeSecondary : false}
                                                    />
                                                    <span className="checkmark"></span>
                                                    <div className="value">
                                                        <LangText name={iItem}/></div>
                                                </label>
                                            )
                                        })
                                    }
                                    <div className="hidingDiv"></div>
                                </div>
                            </div>
                            : null
                    }
                    {
                        fields[ORDERPAD_FIIELD_KEYS.AMO] ?
                            <div className={`fieldRow 
                            ${(isModifyOrder(props.modifyOrder.modifyType) &&
                                    fieldValue[ORDERPAD_FIIELD_KEYS.AMO]) ? 'disabled' :
            hiddenRows[ORDERPAD_FIIELD_KEYS.AMO]}`}>
                                <span className="label"><LangText module="ORDERPAD" name="TYPE" /></span>
                                <div className="field optionData orderField AMO">
                                    <span className="AMOcheckboxDiv radioField">
                                        <InputComponent
                                            className="hiddenCheckbox"
                                            name={ORDERPAD_FIIELD_KEYS.AMO}
                                            type="checkbox"
                                            onChange={onChangeValue}
                                        />
                                        {
                                            fieldValue[ORDERPAD_FIIELD_KEYS.AMO] ?
                                                <CheckBoxIcon_Checked />
                                                :
                                                <CheckBoxIcon_UnChecked />
                                        }
                                        <span className="value amoText">
                                            <LangText module="ORDERPAD"
                                                name="AFTER_MARKET_ORDER" />
                                        </span>
                                    </span>
                                    <div className="hidingDiv"></div>
                                </div>
                            </div>
                            : null
                    }
                    <div className={`fieldRow ${(!fields[ORDERPAD_FIIELD_KEYS.SQUARE_OFF]
                        && !fields[ORDERPAD_FIIELD_KEYS.STOP_LOSS] &&
                        !fields[ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS]) ?
                        'hide' : ''}`}>
                        <div className="row">
                            {
                                fields[ORDERPAD_FIIELD_KEYS.SQUARE_OFF] ?
                                    <div className={`field ${errorFields[ORDERPAD_FIIELD_KEYS.SQUARE_OFF]
                                        ? 'errorInputDiv' : ''} ${hiddenRows[ORDERPAD_FIIELD_KEYS.SQUARE_OFF]}`}>
                                        <div className="labelInput">
                                            <LabledInput
                                                label={getLangText(isBuyTradeAction(tradeType) ?
                                                    'SQUARE_OFF_SELL' : 'SQUARE_OFF_BUY', 'ORDERPAD',
                                                TEXT_ORIENTATION.LOWERCASE)}
                                                name={ORDERPAD_FIIELD_KEYS.SQUARE_OFF}
                                                value={fieldValue[ORDERPAD_FIIELD_KEYS.SQUARE_OFF]}
                                                onChangeCB={onChangeValue}
                                            />
                                            <div className="hidingDiv"></div>
                                        </div>
                                        <div className="range">
                                            {
                                                (fieldValue.lcl && fieldValue.ucl) ?
                                                    <span>
                                                        <span className="lowerCircuitVal">
                                                            {fieldValue.lcl}</span> -
                                                        <span className="upperCircuitVal">{fieldValue.ucl}</span>
                                                    </span>
                                                    : null
                                            }
                                        </div>
                                        <div className="errorMsg-div text-nowrap"
                                            title={errorMsg[ORDERPAD_FIIELD_KEYS.SQUARE_OFF]}
                                        >
                                            {errorMsg[ORDERPAD_FIIELD_KEYS.SQUARE_OFF]}
                                        </div>
                                    </div>
                                    : null
                            }
                            {
                                fields[ORDERPAD_FIIELD_KEYS.STOP_LOSS] ?
                                    <div className={`field ${errorFields[ORDERPAD_FIIELD_KEYS.STOP_LOSS]
                                        ? 'errorInputDiv' : ''}
                                      ${hiddenRows[ORDERPAD_FIIELD_KEYS.STOP_LOSS]}`}>
                                        <div className="labelInput">
                                            <LabledInput
                                                label={getLangText(isBuyTradeAction(tradeType) ?
                                                    'STOP_LOSS_SELL'
                                                    : 'STOP_LOSS_BUY',
                                                'ORDERPAD',
                                                TEXT_ORIENTATION.LOWERCASE)}
                                                name={ORDERPAD_FIIELD_KEYS.STOP_LOSS}
                                                value={fieldValue[ORDERPAD_FIIELD_KEYS.STOP_LOSS]}
                                                onChangeCB={onChangeValue}
                                            />
                                            <div className="hidingDiv"></div>
                                        </div>
                                        <div className="range">
                                            {
                                                selectedProductType === TRADE_PRODUCT_TYPES.CO ?
                                                    (
                                                        (SL_lcl && SL_ucl) ?
                                                            <span>
                                                                <span className="lowerCircuitVal">
                                                                    {SL_lcl}</span> -
                                                                <span className="upperCircuitVal">{SL_ucl}</span>
                                                            </span>
                                                            : null
                                                    )
                                                    :
                                                    (fieldValue.lcl && fieldValue.ucl) ?
                                                        <span>
                                                            <span className="lowerCircuitVal">
                                                                {fieldValue.lcl}</span> -
                                                            <span className="upperCircuitVal">
                                                                {fieldValue.ucl}</span>
                                                        </span>
                                                        : null
                                            }
                                        </div>
                                        <div className="errorMsg-div text-nowrap"
                                            title={errorMsg[ORDERPAD_FIIELD_KEYS.STOP_LOSS]}
                                        >
                                            {errorMsg[ORDERPAD_FIIELD_KEYS.STOP_LOSS]}
                                        </div>
                                    </div>
                                    : null
                            }
                            {
                                fields[ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS] ?
                                    <div className=
                                        {`field ${errorFields[ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS] ?
                                            'errorInputDiv' : ''} 
                                    ${hiddenRows[ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS]}`}>
                                        <div className="labelInput">
                                            <LabledInput
                                                label="Trailing Stop Loss (Opt)"
                                                name={ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS}
                                                value={fieldValue[ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS]}
                                                onChangeCB={onChangeValue}
                                            />
                                            <div className="hidingDiv"></div>
                                        </div>
                                        <div className="errorMsg-div text-nowrap"
                                            title={errorMsg[ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS]}
                                        >
                                            {errorMsg[ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS]}
                                        </div>
                                    </div>
                                    : null
                            }
                        </div>
                    </div>
                    <div className="fieldRow moreOptDiv">
                        <span className="cursor moreOptions" onClick={() => setShowMoreOptions(!showMoreOptions)}>
                            <span className="moreOptBtn">
                                <LangText module="ORDERPAD" name="MORE_OPTIONS" />
                            </span>
                            {
                                showMoreOptions ?
                                    <ShowLessIcon />
                                    :
                                    <ShowMoreIcon />
                            }
                        </span>
                    </div>
                    {
                        showMoreOptions ?
                            <>
                                <div className="fieldRow validityField">
                                    <span className="label"><LangText 
                                        module="ORDERPAD" name="VALIDITY" /> <span className="selectedLabel">
                                        [ <LangText name={selectedValidity}/> ]</span> </span>
                                    <div className={`field orderField`}>
                                        <div className={`validityDiv ${hiddenRows[ORDERPAD_FIIELD_KEYS.VALIDITY]}`}>
                                            {
                                                (fields[ORDERPAD_FIIELD_KEYS.VALIDITY]
                                                    && fields[ORDERPAD_FIIELD_KEYS.VALIDITY].length) ?
                                                    fields.validity.map((vItem, vIndex) => {
                                                        return (
                                                            <label key={vIndex}
                                                                className={`cursor radioField validityField`}>
                                                                <input type="radio"
                                                                    name="validity"
                                                                    onClick={() => setSelectedValidity(vItem)}
                                                                    checked={selectedValidity
                                                                        ? vItem === selectedValidity
                                                                        : false}
                                                                />
                                                                <span className="checkmark"></span>
                                                                <div className="value">
                                                                    <LangText name={vItem}/></div>
                                                            </label>
                                                        )
                                                    })
                                                    : null
                                            }
                                            <div className="hidingDiv"></div>
                                        </div>
                                        {/* {
                                            (fields[ORDERPAD_FIIELD_KEYS.DIS_QTY]
                                                && selectedValidity
                                                !== TRADE_VALIDITY_TYPES.IOC
                                                && !fieldValue[ORDERPAD_FIIELD_KEYS.AMO]
                                            ) ?
                                                <div className=
                                                    {`field ${errorFields[ORDERPAD_FIIELD_KEYS.DIS_QTY]
                                                        ? 'errorInputDiv' : ''} 
                                                 ${hiddenRows[ORDERPAD_FIIELD_KEYS.DIS_QTY]}`}>
                                                    <div className="labelInput">
                                                        <LabledInput label="Disclosed Qty (Opt)"
                                                            name={ORDERPAD_FIIELD_KEYS.DIS_QTY}
                                                            value={fieldValue[ORDERPAD_FIIELD_KEYS.DIS_QTY]}
                                                            onChangeCB={onChangeValue}
                                                        />
                                                        <div className="hidingDiv"></div>
                                                    </div>
                                                    <div className={`range lotDiv ${lotSize > 1 ? '' : 'disableLot'}`}>
                                                        {
                                                            lotSize ?
                                                                <span className="minLotVal">
                                                                    <LangText module="ORDERPAD"
                                                                        name="EXP_QTY" />
                                                                    : {lotSize}
                                                                </span>
                                                                :
                                                                null
                                                        }
                                                    </div>
                                                    <div className="errorMsg-div text-nowrap"
                                                        title={errorMsg[ORDERPAD_FIIELD_KEYS.DIS_QTY]}
                                                    >
                                                        {errorMsg[ORDERPAD_FIIELD_KEYS.DIS_QTY]}
                                                    </div>
                                                </div>
                                                : null
                                        } */}
                                    </div>
                                </div>
                                {
                                    selectedValidity === TRADE_VALIDITY_TYPES.GTD ?
                                        <div className="fieldRow">
                                            <div className={`field gtd_field 
                                            ${errorFields[ORDERPAD_FIIELD_KEYS.ORDER_VALIDITY]
            ? 'errorInputDiv' : ''} 
                                             ${hiddenRows[ORDERPAD_FIIELD_KEYS.ORDER_VALIDITY]}`
                                            }>
                                                <div className="labelInput">
                                                    <span className="label"><LangText 
                                                        module="ORDERPAD" name="VALID_TILL" /></span>
                                                    <DatePickerComponent
                                                        onChangeDate={onChangeDate}
                                                        selectedDate={GTDDate}
                                                    />
                                                    <DatePickerIcon className="addOn" />
                                                    <div className="hidingDiv"></div>
                                                </div>
                                                <div className="errorMsg-div text-nowrap"
                                                    title={errorMsg[ORDERPAD_FIIELD_KEYS.GTD_DATE]}
                                                >
                                                    {errorMsg[ORDERPAD_FIIELD_KEYS.GTD_DATE]}
                                                </div>
                                            </div>
                                        </div>
                                        : null
                                }
                            </>
                            : null
                    }
                </div>
            </div>
            <div className="footer">
                {
                    hideFooterActions ?
                        <div className="content">
                            <div className="marginDiv">
                                {/* <div className="reqMargin">
                            <div className="label">REQD. MARGIN:</div>
                            <div
                                className={`value reqMargin 
                                        ${orderValue.orderMargin ? (replaceComma(orderValue.orderMargin).length > 15
                ? 'lg' : "md") : ''}`}
                            >
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
                            <button className="refreshBtn" 
                                // onClick={getCheckMargin}
                            >
                                <RefreshIcon />
                            </button>
                        </div> */}
                                <div className="availMargin">
                                    <div className="label"><LangText 
                                        module="ORDERPAD" name="AVAIL_MARGIN" />:</div>
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
                            <div className="actionDiv">
                                <span className="tickSize">{tickSize}</span>
                                <button className="negativeBtn" onClick={props.onCloseCB}>
                                    <LangText module="BUTTONS" name="CANCEL" />
                                </button>
                                <button
                                    className={`positiveBtn ${isBuyTradeAction(tradeType) ? 'buy-btn2' : 'sell-btn2'}`}
                                    onClick={onClickSubmit}
                                >
                                    <LangText module="BUTTONS" name={tradeType} />
                                </button>
                            </div>
                        </div>
                        :
                        null
                }
            </div>
        </div >
    )
}

function LabledInput(props) {
    return (
        <>
            <span className="label">{props.label}</span>
            <InputComponent
                name={props.name}
                value={props.value}
                onChange={props.onChangeCB}
                disabled={props.disabled}
                onBlur={props.onBlur}
                onFocus={props.onFocus}
                maxLength={props.maxLength}
            />
        </>
    )
}

const mapStateToProps = ({ settings ,orderPad}) => {
    return {
        selectedTheme: settings.selectedTheme,
        enableStopLoss: orderPad.dialog.enableStopLoss,
        prod_type: orderPad.dialog.prod_type,

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeOrderPadDialogDetails: (s) => { dispatch(storeOrderPadDialogDetails(s)) },
        storeOrderFieldValues: (s) => { dispatch(storeOrderFieldValues(s)) },
        storeModifyOrder_InternalFlag: (s) => { dispatch(storeModifyOrder_InternalFlag(s)) },
        storeOrderpadSelectedSym: (s) => { dispatch(storeOrderpadSelectedSym(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeLoginDialogDetails: (s) => { dispatch(storeLoginDialogDetails(s)) },
        storeHoldingsGuestAlertMsg: (s) => {dispatch(storeHoldingsGuestAlertMsg(s))}
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStreaming(OrderPadDialogComponent));