/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react'
import { connect } from "react-redux";
import { useFetch, withStreaming, MsfRequest } from '../../../index'

import LangText, { getLangText } from '../../../common/lang/LangText';
import ToggleMenu from '../../common/ToggleComponent'
import InputComponent from '../../common/InputComponent';
import DialogLoader from '../../common/ModalDialogLoaderComponent'
import DatePickerComponent from '../../common/datePicker/DatePickerComponent';

import OrderPageHelpInfoComponent from "./OrderPageHelpInfoComponent";

import { ORDER_PAD, QUOTE } from '../../../config/ServiceURLs';

import {
    DEFAULT_VALUES, ORDERPAD_DIALOGS, ORDERPAD_FIIELD_KEYS, ORDER_FIELD_MAX_LENGTH_QTY,
    ORDER_FIELD_MAX_VALUE_QTY, ORDER_MODIFY_TYPE, STREAMING_KEYS, TRADE_INTRADAY_PRODUCT_TYPES,
    STREAMING_MODULES, TRADE_FIELD_MATRIX, TRADE_ORDER_TYPES, TRADE_PRODUCT_TYPES, EXCHANGES,
    HIDDEN_FIELD_MATRIX, ORDER_FIELD_MAX_LENGTH_PRICE, TRADE_VALIDITY_TYPES,
    TRADE_INTRADAY_PRODUCT_TYPE_ARRAY, TEXT_ORIENTATION, ORDER_FIELD_MAX_VALUE_MP,
    ORDER_FIELD_MAX_LENGTH_IA, TRADE_TYPE_NAME_CONVERSION, TRADE_FIELD_MATRIX_MODIFY_INTRADAY,
    ORDER_MODIFY_CHILD_TYPES,
    EXCHANGE_TOGGLE_DATA,
    DATE_FORMATS,
    TAX_DECLARE_BLOCK_SCREENS,
    LOCAL_STORAGE,
    ORDERPAD_SERIES,
    // HIDDEN_FIELD_MATRIX_2,
    TAX_DECLARATION_MSG_KEY,
    ORDER_MODIFY_BO_CO,
    TICK_SIZE,
    INVALID,
    EMPTY,
    LOW,
    RANGE,
    LOW_25,
    LOT_ERROR,
    HIGH,
    LOW_MAIN_PRICE,
    HIGH_MAIN_PRICE,
    ORDER_TYPES,
    // MAX_SELL_AMT,
    AF_EVENT_NAMES,
    SYMBOL_INSTRUMENT_TYPE,
    TRADE_INTRADAY_OPTIONS_PRODUCT_TYPE_ARRAY,
} from '../../../common/Constants';
import {
    applyPaint, checkEmpty, convertToUpperCase, getColorCode, getDecimal_Precision,
    getDispSymbolName, getFormatedDate,
    isBuyTradeAction, replaceComma, isSellTradeAction, isCommoditySymbol, findTickSize,
    checkInt, checkFloat_withNegative,
    isEquityCashSymbol, getBaseURL, countHoleNumbers, countDecimals, convertToFloat, convertCommaSeparated,
    isModifyOrder,
    isEquityFutureSymbol,
    getMarketDataBaseURL,
    formSymBlock,
    getOrderPadErrorMessage,
    // getBackOfficeBaseURL,
    AF_EventTriggered,
    // checkFloat
} from '../../../common/CommonMethods';
import {
    showAppDialog, storeEdisScreenFlag, storeModifyOrder_InternalFlag, storeOrderFieldValues, 
    storeOrderPadDialogDetails,
    storeOrderpadSelectedSym
} from '../../../state/actions/Actions';
// import { ORDERPAD_MESSAGES } from '../../../common/Messages';
import {
    CheckBoxIcon_Checked, CheckBoxIcon_UnChecked, DatePickerIcon, CirclePlusIcon, CircleMinusIcon,
    ShowLessIcon, ShowMoreIcon, RefreshIcon, InfoIcon
} from '../../common/FontIcons'
import { callTaxDeclaration, getTaxDecalreDetails, getTaxProfileFromAPIData } from '../../../common/Bridge';
import { getItemFromSessionStorage } from '../../../common/LocalStorage';
import { LabledInput, onBlurInputMethod, onFocusInvestAmtMethod, 
    findSquareOffCompareErr, calculatePrefilledStopLossSell, 
    calculatePrefilledStopLossBuy, compareStoplLossWithPrice 
    // findIsHoldingsStockFlag, 
    // findBtstStock, findToBeAuthorisedFlag, isSellingPositionQty
} from '../../../common/OrderPadMethods';
import { withRouter } from 'react-router-dom';
import find from 'lodash/find';

function OrderPadDialogComponent(props) {

    const MsfFetch = useFetch()

    const [symData, setSymData] = useState({})
    // const [symMinMKPData, setMinSymMKPData] = useState("")
    // const [mrktProtMinLimit, setMrktProtMinLimit] = useState("")
    // const [symInstrmntMKPData, setInstrmntSymMKPData] = useState("")
    const [basefieldMatrix, setBasefieldMatrix] = useState({})
    const [fields, setFields] = useState({})
    const [productTypes, setProductTypes] = useState([])
    const [orderTypes, setOrderTypes] = useState([])
    const [selectedProductType, setSelectedProductType] = useState('')
    const [selectedProductTypePrimary, setSelectedProductTypePrimary] = useState('')
    const [selectedProductTypeSecondary, setSelectedProductTypeSecondary] = useState('')
    const [selectedOrderType, setSelectedOrderType] = useState('')
    const [qtyChanged, setQtyChanged] = useState(true)
    const [selectedValidity, setSelectedValidity] = useState('')
    const [fieldValue, setFieldValue] = useState({[ORDERPAD_FIIELD_KEYS.AMO]: false})
    const [excArray, setExcArray] = useState([])
    const [orderValue, setOrderValue] = useState("")
    const [streamingResp, setStreamingResp] = useState(null)
    const [errorFields, setErrorFields] = useState([])
    const [orderTypeArray] = useState(['BUY','SELL'])
    const [GTDDate, setGTDDate] = useState(new Date())
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
    const [pendingGetLotReq, setPendingGetLotReq] = useState(false)
    const [pendingGetMarReq, setPendingGetMarReq] = useState(false)
    const [givenExc, setGivenExc] = useState('')
    const [orgQty, setOrgQty] = useState(null)
    const [getCO_priceRange, setGetCO_priceRange] = useState(false)
    const [SL_lcl, setSL_lcl] = useState(null)
    const [SL_ucl, setSL_ucl] = useState(null)
    // const [disableSLOrders, setDisableSLOrders] = useState(false)
    const [disableNonAMOOrders, setDisableNonAMOOrders] = useState(false)
    // const [maxDate, setMaxDate] = useState('')
    const [showMoreOptions, setShowMoreOptions] = useState(false)
    const [investAmount, setInvestAmount] = useState('')
    const [showInvestAmtField, setShowInvestAmtField] = useState(false)
    const [mainLegPrice, setMainLegPrice] = useState(null)
    const [modifyChildType, setModifyChildType] = useState(null)
    const [hideFooterActions, setHideFooterActions] = useState(false)
    const [seriesState, setSeriesState] = useState(false)
    const [orderTypeBlockMsg, setOrderTypeBlockMsg] = useState('')
    const [maxDate, setMaxDate] = useState("")
    const [oddLotState, setOddLotState] = useState(false)
    const [intradayProductTypes, setIntradayProductTypes] = useState(TRADE_INTRADAY_PRODUCT_TYPE_ARRAY)
    const [stoplossPopulated, setStoplossPopulated] = useState()
    // const [netPositionsData, setNetPositionsData] = useState([])
    const [mtfPTypeChecked, setMtfPTypeChecked] = useState(false)
    // const [isAuthorised, setIsAuthorised] = useState(true)
    // const [isinValue, setIsinValue] = useState("")
    // const [knowMoreMtfClicked, setKnowMoreMtfClicked] = useState(false)

    const currentOrderType = useRef(null)
    const isStreamPrice_Updated = useRef(false)
    const fieldsObjOriginal = useRef(null)
    // const sellOutOfPositions = useRef(null)

    useEffect(() => {
        let taxDetails = getTaxDecalreDetails()
        let orderTypeMsg = taxDetails.declarationMsgs[TAX_DECLARATION_MSG_KEY.ID_TRADE_BLOCK_ORDER_TYPE]
        let gtdValidity = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.GTD_VALIDITY_EXPIRY))
        let datefor_max = new Date()
        let maxdate = datefor_max.setDate(datefor_max.getDate() + parseInt(gtdValidity));
        setMaxDate(new Date(maxdate))
        setOrderTypeBlockMsg(orderTypeMsg)
        if (!props.popupBlock)
            callTaxDeclaration(null, TAX_DECLARE_BLOCK_SCREENS.ORDERPAD)
        // getNetPositionsDetails()
        // getIsinValue()
    }, [])

    useEffect(() => {
        if (props.taxDeclaration) {
            if (props.taxDeclaration.hideOrderpadFooter)
                setHideFooterActions(true)
            else
                setHideFooterActions(false)
        }
    }, [props.taxDeclaration])

    useEffect(() => {
        if (getTgroupDetails(props.sym)) 
            setSeriesState(true)
        else
            setSeriesState(false)
        if (getOddLotDetails(props.sym))
            setOddLotState(true)
        else
            setOddLotState(false)
    }, [props.sym])

    useEffect(() => {
        // let mrktProtLimit = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.MARKET_PROTECTION_LIMIT))
        // // let mrktProStkMin = mrktProtLimit.OPTSTK.split("-")[0];
        // let mrktProStkMax = mrktProtLimit.OPTSTK.split("-")[1];
        // let mrktProIdxMax = mrktProtLimit.OPTIDX.split("-")[1];
        // console.log('mrktProStkMin: ', mrktProStkMin, props.trade_type, tradeType );
        
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.ORDERPAD);
        if (props.sym) {
            // if(typeof(props.trade_type) === "undefined")
            //     setTradeType(tradeType)
            // else
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
            // setInstrmntSymMKPData(details.sym.instrument)
            // if(
            //     (details.sym.instrument == SYMBOL_INSTRUMENT_TYPE.OPTIONSTK)){
            //     setMinSymMKPData(mrktProStkMax)
            //     setMrktProtMinLimit(mrktProtLimit.OPTSTK.split("-")[0])
            //     setFieldValue({
            //         [ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION]: mrktProStkMax
            //     })
            // }
            // else if((details.sym.instrument == SYMBOL_INSTRUMENT_TYPE.OPTIONIDX)){
            //     setMinSymMKPData(mrktProIdxMax)
            //     setMrktProtMinLimit(mrktProtLimit.OPTSTK.split("-")[0]) 
            //     setFieldValue({
            //         [ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION]: mrktProIdxMax
            //     })
            // }
            if (isEquityCashSymbol(props.sym.exc)) 
                setExcArray(EXCHANGE_TOGGLE_DATA.EQUITY)
            else if (isEquityFutureSymbol(props.sym.exc)) 
                setExcArray(EXCHANGE_TOGGLE_DATA.FUTURE)
            streamingSubscription(props.sym)
            // let trade_fields = TRADE_FIELD_MATRIX['ICEX']
            let trade_fields = null
            if (props.sym.childType && props.modifyOrder.modifyType === ORDER_MODIFY_TYPE.MODIFY) {
                setModifyChildType(props.sym.childType)
                //  ** to avoid crash when orderType for CO second leg comes as LIMIT from API(erroeneous, expected is SL-M)
                if(!(props.orderFieldValues.producType === TRADE_INTRADAY_PRODUCT_TYPES.CO && 
                   convertToUpperCase(props.sym.childType) === ORDER_MODIFY_CHILD_TYPES.THIRD))
                    trade_fields = TRADE_FIELD_MATRIX_MODIFY_INTRADAY[props.sym.exc]
                else 
                    trade_fields = TRADE_FIELD_MATRIX[props.sym.exc]

            } else
                trade_fields = TRADE_FIELD_MATRIX[props.sym.exc]

            if (trade_fields) {
                setBasefieldMatrix(trade_fields)
                setProductTypes(trade_fields.productTypesView)
                if (!props.isModifyOrder_internal && !props.modifyOrder.modifyType) {
                    if(props.enableStopLoss || props.enableStopLoss == false)
                        setSelectedProductType(props.prod_type)
                    else
                        setSelectedProductType(trade_fields.productTypes[0])
                }

                // PreFill for modify order
                if (props.isModifyOrder_internal || props.modifyOrder.modifyType) {
                    let fieldsObj = Object.assign({}, props.orderFieldValues)
                    // console.log('props.orderFieldValues :', props.orderFieldValues);
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
                            setSelectedOrderType(availOrderTypes[0])
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
                    // if (fieldsObj[ORDERPAD_FIIELD_KEYS.GTD_DATE]) {
                    //     if (props.isModifyOrder_internal)
                    //         setGTDDate(getFormatedDate(fieldsObj[ORDERPAD_FIIELD_KEYS.GTD_DATE],
                    //             0, DATE_FORMATS.DEFAULT,
                    //             true).formatedDate)
                    //     else
                    //         setGTDDate(getFormatedDate(fieldsObj[ORDERPAD_FIIELD_KEYS.GTD_DATE]).formatedDate)
                    // }
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
        let bo_coParent = findParentPtypeBO_CO(selectedProductType)
        if (bo_coParent === TRADE_PRODUCT_TYPES.BO ||
        bo_coParent === TRADE_PRODUCT_TYPES.CO) {
            setSelectedProductTypePrimary(TRADE_PRODUCT_TYPES.INTRADAY)
            // ** For BO and CO second leg, the orderType will be SL-M and hence set REGULAR as secondary product type
            if(convertToUpperCase(modifyChildType) === ORDER_MODIFY_CHILD_TYPES.SECOND ) 
                // if(selectedOrderType === TRADE_ORDER_TYPES.SL_M )
                //     setSelectedProductTypeSecondary(intradayProductTypes[0])
                // else
                setSelectedProductTypeSecondary(bo_coParent)
            else
                setSelectedProductTypeSecondary(bo_coParent)
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
                    if(props.enableStopLoss) {
                        setSelectedOrderType(TRADE_ORDER_TYPES.SL)
                    }
                    else{
                        setSelectedOrderType(orderTypeList[0])
                    }
                // else
                //     setSelectedOrderType(currentOrderType.current)
            }
        }
        if (selectedProductType === TRADE_PRODUCT_TYPES.CO)
            setGetCO_priceRange(true)
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
                let selectedPType;
                if(findParentPtypeBO_CO(selectedProductType) === TRADE_INTRADAY_PRODUCT_TYPES.BO )
                    selectedPType = TRADE_INTRADAY_PRODUCT_TYPES.BO
                else if(findParentPtypeBO_CO(selectedProductType) === TRADE_INTRADAY_PRODUCT_TYPES.CO)
                    selectedPType = TRADE_INTRADAY_PRODUCT_TYPES.CO
                else
                    selectedPType = selectedProductType
                // if(selectedProductType === TRADE_PRODUCT_TYPES.SL || selectedProductType ==== TRADE_PRODUCT_TYPES.LIMIT) {
                // if (selectedValidity === TRADE_VALIDITY_TYPES.GTD || selectedValidity === TRADE_VALIDITY_TYPES.GTC) {
                //     // setHiddenOrderTypes()
                //     if (HIDDEN_FIELD_MATRIX_2[selectedProductType]) {
                //         let rows_gtd_gtc =
                //             HIDDEN_FIELD_MATRIX_2[selectedProductType][selectedOrderType][selectedValidity]
                //         setHiddenRows(rows_gtd_gtc ? rows_gtd_gtc : {})
                //     }
                // }
                if (HIDDEN_FIELD_MATRIX[selectedPType]) {
                    let rows = HIDDEN_FIELD_MATRIX[selectedPType][selectedOrderType]
                    setHiddenRows(rows ? rows : {})}
            }}
        if(selectedOrderType)
            findAvailablePTypes(selectedOrderType)
    }, [selectedOrderType])

    useEffect(() => {
        setErrorFields({})
        setErrorMsg({})
        if (selectedOrderType && selectedProductType && tradeType) {
            if(selectedProductType !== TRADE_INTRADAY_PRODUCT_TYPES.BO &&
                selectedProductType !== TRADE_INTRADAY_PRODUCT_TYPES.CO )
                getCheckMargin()
        }
    }, [selectedProductType, selectedOrderType, tradeType, selectedSym])

    useEffect(() => {
        if (streamingResp && streamingResp !== {}) 
            setStreamingResptoSymbols(streamingResp)
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
        // if (values[ORDERPAD_FIIELD_KEYS.DIS_QTY] && lotSize) {
        //     // if (values[ORDERPAD_FIIELD_KEYS.DIS_QTY] <= lotSize)
        //     //     setDisableSubDis_Qty(true)
        //     // else
        //     //     setDisableSubDis_Qty(false)
        // }
    }, [lotSize])

    // useEffect(() => {
    //     let values = Object.assign({}, fieldValue)
    //     let errorMsgs = Object.assign({}, errorMsg)
    //     if(symMinMKPData){
    //         if (values[ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION]) {
    //             errorMsgs[ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION] = ''
    //             setErrorMsg(errorMsgs)
               
    //         }
    //     }
    //     else{
    //         errorMsgs[ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION] = ''
    //         setErrorMsg(errorMsgs)
    //     }

    // }, [fieldValue])

    useEffect(() => {
        if (getCO_priceRange)
            getCORange()
    }, [getCO_priceRange])

    useEffect(() => {
        if (selectedProductType === TRADE_PRODUCT_TYPES.CO)
            getCORange()
    }, [tradeType])

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

    useEffect(() => {
        if(mtfPTypeChecked) {
            setSelectedProductType(TRADE_PRODUCT_TYPES.MTF)
            setQtyChanged(true)
        }
    }, [mtfPTypeChecked])

    useEffect(() => {
        if(selectedProductType === TRADE_PRODUCT_TYPES.MTF)
            setMtfPTypeChecked(true)
    }, [selectedProductType])

    // function getNetPositionsDetails() {
    //     let request = new MsfRequest();
    //     request.addToData({
    //         type: "net",
    //         filters: []
    //     })
    //     MsfFetch.placeRequest(
    //         // getBaseURL() + TRADE.GET_NET_POSITION,
    //         getBackOfficeBaseURL() + TRADE.GET_NET_POSITION,
    //         request,
    //         successRespCBGetNetPositions,
    //         errorRespCBGetNetPositions
    //     )
    // }

    // function successRespCBGetNetPositions(response) {
    //     // console.log('123netposresponse: ', response);
    //     setNetPositionsData(response.data.positions)              
    // }

    // function errorRespCBGetNetPositions(error) {
    //     setNetPositionsData([])
    //     console.log('error: ', error);
    // }

    // function getIsinValue() {
    //     let request = new MsfRequest();
    //     request.addToData({
    //         sym: props.sym,
    //         otherExch: props.sym.exc
    //     })
    //     request.setEncrypt(false)
    //     MsfFetch.placeRequest(
    //         getMarketDataBaseURL() + QUOTE.GET_SYMBOL_INFO,
    //         request,
    //         successRespCBgetIsinValue,
    //         errorRespCBgetIsinValue
    //     )
    // }

    // function successRespCBgetIsinValue(response) {
    //     // console.log('123Isinresponse: ', response);
    //     setIsinValue(response.data.isin)
    //     getAuthorisationStatus(response.data.isin)

    // }

    // function errorRespCBgetIsinValue(error) {
    //     console.log('123Isinerror: ', error);

    // }

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

    function getCORange() {
        setPendingGetLotReq(true)
        let request = new MsfRequest();
        request.addToData({
            sym: selectedSym,
            "prdType": selectedProductType,
            "ordAction": tradeType
        })
        MsfFetch.placeRequest(
            getBaseURL() + ORDER_PAD.CO_PRICE_RANGE,
            request,
            successRespCBgetCORange,
            errorRespCBgetCORange
        )
    }

    function successRespCBgetCORange(response) {
        setPendingGetLotReq(false)
        setGetCO_priceRange(false)
        let range = response.data.trigPriceRange
        if (range) {
            let rangeArr = range.split("-")
            if (rangeArr.length)
                rangeArr.map((item, index) => {
                    if (index === 0 && item)
                        setSL_lcl(item.trim())
                    else if (index === 1 && item)
                        setSL_ucl(item.trim())
                })
        }
    }

    function errorRespCBgetCORange(error) {
        setGetCO_priceRange(false)
        setPendingGetLotReq(false)
        props.showAppDialog({
            show: true,
            message: error.message
        })
    }

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
        if(type !== TRADE_PRODUCT_TYPES.MTF)
            setMtfPTypeChecked(false)
        onSetProductType(type)
    }

    function findParentPtypeBO_CO(item) {
        if(item === TRADE_PRODUCT_TYPES.BO || item === ORDER_MODIFY_BO_CO.BO_MAIN ||
            item === ORDER_MODIFY_BO_CO.BO_SECOND || item === ORDER_MODIFY_BO_CO.BO_THIRD || 
            item === ORDER_MODIFY_BO_CO.BO_SECOND_SL) 
            return TRADE_PRODUCT_TYPES.BO
        else if(item === TRADE_PRODUCT_TYPES.CO || item === ORDER_MODIFY_BO_CO.CO_MAIN ||
                item === ORDER_MODIFY_BO_CO.CO_SECOND)
            return  TRADE_PRODUCT_TYPES.CO
        return item
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
        AF_EventTriggered(AF_EVENT_NAMES.ORDERPAD ,item ,{"onchange":"ordertype"})

        let isOrderTypeBlock = false
        let profileDetails = getTaxProfileFromAPIData()
        if ((isEquityCashSymbol(selectedSym.exc)&&profileDetails.isTradeBlock)
            ||
            (isEquityFutureSymbol(selectedSym.exc)&&profileDetails.isTradeBlockFO)
            ||
            (isEquityFutureSymbol(selectedSym.exc)&&profileDetails.isTradeBlockProgress)
        ) 
            isOrderTypeBlock = true
        if (isOrderTypeBlock === true && props.modifyOrder.modifyType === ORDER_MODIFY_TYPE.SQUARE_OFF
            && item !== TRADE_ORDER_TYPES.MARKET) 
            props.showAppDialog({
                title: getLangText('ALERT_APP', 'LOGIN'),
                message: orderTypeBlockMsg,
                defaultBtnName: getLangText('OK', 'BUTTONS'),
                show: true
            })
        else {
            setSelectedOrderType(item)
            let values = Object.assign({}, fieldValue)
            if (item !== TRADE_ORDER_TYPES.SL && item !== TRADE_ORDER_TYPES.LIMIT) {
                if (!fieldValue[ORDERPAD_FIIELD_KEYS.PRICE]) {
                    values[ORDERPAD_FIIELD_KEYS.PRICE] = replaceComma(symData.ltp)
                }
            }
            setQtyChanged(true)
            // GTD and GTC validities are allowed for LIMIT and SL ordertypes alone
            if (props.modifyOrder.modifyType === ORDER_MODIFY_TYPE.MODIFY) {
                if ((item === TRADE_ORDER_TYPES.LIMIT || item === TRADE_ORDER_TYPES.SL) &&
                    (props.orderFieldValues.validity === TRADE_VALIDITY_TYPES.GTD ||
                        props.orderFieldValues.validity === TRADE_VALIDITY_TYPES.GTC)) {
                    setSelectedValidity(props.orderFieldValues.validity)
                }
            }
            if (props.isModifyOrder_internal || props.modifyOrder.modifyType) {
                if (basefieldMatrix[selectedProductType]) {
                    let fieldColumns = basefieldMatrix[selectedProductType][item]
                    if (fieldColumns) {
                        setFields(fieldColumns)
                        if (props.orderFieldValues.validity !== TRADE_VALIDITY_TYPES.GTD &&
                            props.orderFieldValues.validity !== TRADE_VALIDITY_TYPES.GTC)
                            setSelectedValidity(fieldColumns.validity[0])
                    }
                }
            }
            else 
                values[ORDERPAD_FIIELD_KEYS.AMO] = false
            setFieldValue(values)
        }
    }

    function onFocusInvestAmt() {
        setInvestAmount(onFocusInvestAmtMethod(investAmount))
        calculateQuantity(null, onFocusInvestAmtMethod(investAmount))
    }

    function onChangeInvestAmt(e) {
        // let value = e.target.value
        // let valLength = countHoleNumbers(value)
        // if (value) {
        //     if (checkInt(value)) {
        //         if (valLength <= ORDER_FIELD_MAX_LENGTH_PRICE) {
        //             setInvestAmount(value)
        //             calculateQuantity(fieldValue[ORDERPAD_FIIELD_KEYS.PRICE], value)
        //         }
        //     }
        // }
        // else
        //     setInvestAmount("")
        setInvestAmount(onChangeInvestAmt(e))
    }

    function onChangeValue(e) {
        let values = Object.assign({}, fieldValue)
        let value = e.target.value
        let inputName = e.target.name
        let min = lotSize ? lotSize : 1
        let valLength = countHoleNumbers(value)

        if (e.target.type === "checkbox") {
            // if(selectedValidity === TRADE_VALIDITY_TYPES.GTD || TRADE_VALIDITY_TYPES.GTC) {
            //     if(fieldValue[ORDERPAD_FIIELD_KEYS.AMO])
            setSelectedValidity(TRADE_VALIDITY_TYPES.DAY)
            // }
            values[inputName] = !values[inputName]
        }
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
                                if(findParentPtypeBO_CO(selectedProductType) !== TRADE_INTRADAY_PRODUCT_TYPES.BO &&
                        findParentPtypeBO_CO(selectedProductType) !== TRADE_INTRADAY_PRODUCT_TYPES.CO)
                                    getCheckMargin(false, null, value)
                            }
                            if (inputName === ORDERPAD_FIIELD_KEYS.SQUARE_OFF && selectedProductType) {
                                if(isBuyTradeAction(tradeType) && 
                                (convertToUpperCase(props.sym.instrument) !== SYMBOL_INSTRUMENT_TYPE.FUTURESTK && 
                                    convertToUpperCase(props.sym.instrument) !== SYMBOL_INSTRUMENT_TYPE.FUTUREIDX )) {
                                    if(compareStoplLossWithPrice(tradeType, value, 
                                        values[ORDERPAD_FIIELD_KEYS.PRICE])) {
                                        values[ORDERPAD_FIIELD_KEYS.STOP_LOSS] = 
                                        calculatePrefilledStopLossSell(value,givenExc,tickSize).
                                            toFixed(getDecimal_Precision(selectedSym.exc))
                                        setStoplossPopulated(true)
                                    }
                                    else
                                        values[ORDERPAD_FIIELD_KEYS.STOP_LOSS] = ""
                                }
                                else if(isSellTradeAction(tradeType) && 
                                (props.sym.instrument !== SYMBOL_INSTRUMENT_TYPE.FUTURESTK && 
                                    props.sym.instrument !== SYMBOL_INSTRUMENT_TYPE.FUTUREIDX )) {
                                    if(compareStoplLossWithPrice(tradeType, value, 
                                        values[ORDERPAD_FIIELD_KEYS.PRICE])) {
                                        values[ORDERPAD_FIIELD_KEYS.STOP_LOSS] = 
                                        calculatePrefilledStopLossBuy(value,givenExc,tickSize).
                                            toFixed(getDecimal_Precision(selectedSym.exc))
                                        setStoplossPopulated(true)
                                    }
                                    else
                                        values[ORDERPAD_FIIELD_KEYS.STOP_LOSS] = ""
                                }                              
                            }                          
                        }
                }
            } else {
                if(inputName === ORDERPAD_FIIELD_KEYS.SQUARE_OFF && stoplossPopulated)
                    values[ORDERPAD_FIIELD_KEYS.STOP_LOSS] = ""
                values[inputName] = value
            }
        } else if (inputName === ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION) {
            if (value) {
                // if (checkFloat(replaceComma(value))) {
                //     if (countDecimals(value) <= getDecimal_Precision(givenExc)){
                //         if((symInstrmntMKPData == SYMBOL_INSTRUMENT_TYPE.OPTIONSTK) ||
                //     (symInstrmntMKPData == SYMBOL_INSTRUMENT_TYPE.OPTIONIDX)){
                //             if (value >= parseFloat(mrktProtMinLimit) && value <= parseFloat(symMinMKPData)) {
                //                 values[inputName] = value                    
                //             }
                //         }
                //         else{
                //             if (value <= ORDER_FIELD_MAX_VALUE_MP) {
                //                 values[inputName] = value
                //             }
                //         }
                //     }
                // }
                if (checkInt(value)) {
                    if (value <= ORDER_FIELD_MAX_VALUE_MP) {
                        values[inputName] = value
                    }
                }
            } else 
                values[inputName] = value
        } else {
            if (value) {
                if (checkFloat_withNegative(value)) {
                    if (valLength <= ORDER_FIELD_MAX_LENGTH_PRICE)
                        values[inputName] = value
                }
            } else 
                values[inputName] = value
        }
        if (inputName === ORDERPAD_FIIELD_KEYS.PRICE) 
            setQtyChanged(true)

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
                    if (qty > ORDER_FIELD_MAX_VALUE_QTY) 
                        isAddDisableSet = true
                        // if (fieldKey === ORDERPAD_FIIELD_KEYS.QUANTITY)
                        //     setDisableAddQty(true)
                        // else
                        //     setDisableAddDis_Qty(true)
                    else
                        values[fieldKey] = qty
                } else 
                    values[fieldKey] = lot
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
            if (values[fieldKey] === ORDER_FIELD_MAX_VALUE_QTY) {
                if (fieldKey === ORDERPAD_FIIELD_KEYS.QUANTITY)
                    setDisableAddQty(true)
                // else
                //     setDisableAddDis_Qty(true)
            } else {
                if (fieldKey === ORDERPAD_FIIELD_KEYS.QUANTITY)
                    setDisableAddQty(false)
                // else
                //     setDisableAddDis_Qty(false)
            }
        }
        if (values[fieldKey] == min) {
            if (fieldKey === ORDERPAD_FIIELD_KEYS.QUANTITY)
                setDisableSubQty(true)
            // else
            //     setDisableSubDis_Qty(true)
        } else {
            if (fieldKey === ORDERPAD_FIIELD_KEYS.QUANTITY)
                setDisableSubQty(false)
            // else
            //     setDisableSubDis_Qty(false)
        }

        if (fieldKey === ORDERPAD_FIIELD_KEYS.QUANTITY) {
            setQtyChanged(true)
            getCheckMargin(true, values[fieldKey], ORDERPAD_FIIELD_KEYS.QUANTITY)
        }
    }

    function onBlurInput() {
        // let fieldKeyArray = Object.keys(fields)
        // console.log("onblur", fieldKeyArray)
        // let reqInputFields = fieldKeyArray.filter((item) => {
        //     if (!Array.isArray(fields[item]) && fields[item] && item !== "AMO")
        //         return item
        //     return ""
        // })

        // let error = {}
        // let errorMsgs = {}

        // reqInputFields.map((item) => {
        //     if (parseFloat(fieldValue[item]) === 0) {
        //         console.log("item", item)
        //         error[item] = true
        //         errorMsgs[item] = getOrderPadErrorMessage(INVALID, item)
        //     }
        // })
        setErrorFields(onBlurInputMethod(fields, fieldValue).error)
        // setErrorFields(error)
        setErrorMsg(onBlurInputMethod(fields, fieldValue).errorMsgs)
    }

    function onBlurInputQuantity() {
        onBlurInput()
        // if (qtyChanged) {
        // setQtyChanged(false)
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
            // if(selectedProductType === TRADE_PRODUCT_TYPES.CO) {
            //     request.addToData({
            //         sym: selectedSym,
            //         "prdType": selectedProductTypePrimary,
            //         "ordType": selectedOrderType ? selectedOrderType : "",
            //         "ordAction": tradeType,
            //         "qty": (qty).toString(),
            //         "ordDuration": selectedValidity,
            //         "currentDateTime": new Date(),
            //         "limitPrice": selectedOrderType === TRADE_ORDER_TYPES.SL ||
            //         selectedOrderType === TRADE_ORDER_TYPES.LIMIT ? price.toString() : symData.ltp,
            //         "isAmo": fieldValue[ORDERPAD_FIIELD_KEYS.AMO],
            //         // "triggerPrice": fieldValue[ORDERPAD_FIIELD_KEYS.STOP_LOSS] ?
            //         //     fieldValue[ORDERPAD_FIIELD_KEYS.STOP_LOSS] : "",
            //         "triggerPrice": "",
            //         'targetPrice': "",
            //         'boTgtPrice': "",
            //         'boStpLoss': "",    
            //         'trailingSL': "",
            //     })
            // }
            // else if (selectedProductType === TRADE_PRODUCT_TYPES.BO) {
            //     request.addToData({
            //         sym: selectedSym,
            //         "prdType": selectedProductTypePrimary,
            //         "ordType": selectedOrderType ? selectedOrderType : "",
            //         "ordAction": tradeType,
            //         "qty": (qty).toString(),
            //         "ordDuration": selectedValidity,
            //         "currentDateTime": new Date(),
            //         "limitPrice": selectedOrderType === TRADE_ORDER_TYPES.SL ||
            //         selectedOrderType === TRADE_ORDER_TYPES.LIMIT ? price.toString() : symData.ltp,
            //         "isAmo": fieldValue[ORDERPAD_FIIELD_KEYS.AMO],
            //         // 'targetPrice': fieldValue[ORDERPAD_FIIELD_KEYS.SQUARE_OFF] ?
            //         //     fieldValue[ORDERPAD_FIIELD_KEYS.SQUARE_OFF] : "",
            //         // 'boTgtPrice': fieldValue[ORDERPAD_FIIELD_KEYS.SQUARE_OFF] ?
            //         //     fieldValue[ORDERPAD_FIIELD_KEYS.SQUARE_OFF] : "",
            //         // 'boStpLoss': fieldValue[ORDERPAD_FIIELD_KEYS.STOP_LOSS] ?
            //         //     fieldValue[ORDERPAD_FIIELD_KEYS.STOP_LOSS] : "", 
            //         "triggerPrice": "",
            //         'trailingSL': "",
            //         "targetPrice" : "",
            //         "boTgtPrice": "",
            //         "boStpLoss": ""
            //     })  
            // }
            // else {
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
                getBaseURL() + ORDER_PAD.CHECK_MARGIN,
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

    function getOddLotDetails(symbDet) {
        let oddLotSeries = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.ODD_LOT_SERIES))
        let oddLotSeriesItem = oddLotSeries.list.includes(symbDet.series)
        return oddLotSeriesItem
    }

    // function onValidateStock() {
    //     let isHoldingsStock;
    //     let isBtstStock;
    //     // console.log("isAuthtest", isAuthorised, isinValue)
    //     let args = {symData: symData,qty: fieldValue.qty, selectedPType:selectedProductType,
    //         holdingsResp:props.holdingsResp,modifyOrderDetails:props.modifyOrder, netPositionsData:netPositionsData, isinVal: isinValue}   
    //     isHoldingsStock = findIsHoldingsStockFlag(isinValue, props.holdingsResp,selectedProductType)
    //     // console.log('isHoldingsStock: ', isHoldingsStock);
    //     if(isHoldingsStock && tradeType === ORDER_TYPES.SELL) {
    //         isBtstStock = findBtstStock(args)
    //         // console.log('isBtstStock: ', isBtstStock);
    //         if(isBtstStock) {
    //             props.storeOrderPadDialogDetails({
    //                 dialogName: ORDERPAD_DIALOGS.BTST_STOCKS,
    //                 message:getLangText('MTF_BTST_MSG'),
    //                 parentCB: onCheckAuthorisation,
    //                 closeCB: props.onCloseCB,
    //                 trade_type: tradeType,
    //                 symDetails: symData.sym
    //             })
    //         }
    //         else 
    //             onCheckAuthorisation()
    //     }
    //     else 
    //         moveToConfirmOrder()
    // }

    // function onCheckAuthorisation() { 
    //     // let symInfo = Object.assign([], symData.sym)
    //     // let symDet =  Object.entries(symData.sym).map(item => {
    //     //      console.log("item", item) 
    //     // })
    //     // console.log('symInfo: ', symDet);

    //     // console.log(' props.profileData.poaStatus: ',  props.profileData.poaStatus, symData, isinValue, isAuthorised);
    //     let args = {symDetails: symData.sym, holdingsData: props.allHoldingsResp, qty: fieldValue.qty, 
    //         selectedPType: selectedProductType, netPositionsData: netPositionsData, 
    //         modifyOrderDetails: props.modifyOrder, isAuthorised: isAuthorised, isin: isinValue }
        
    //     if( props.profileData.poaStatus === "Inactive" && tradeType === ORDER_TYPES.SELL && isinValue ) {
    //         if(findToBeAuthorisedFlag(args)) {
    //             props.storeOrderPadDialogDetails({
    //                 dialogName: ORDERPAD_DIALOGS.AUTHORISE_MTF,
    //                 message: getLangText('MTF_AUTHORISE_MSG'),
    //                 parentCB:  goToEdisDashboard,
    //                 closeCB: props.onCloseCB,
    //                 trade_type: tradeType ,
    //                 symDetails: symData.sym
    //             })
    //         }
    //         else 
    //             moveToConfirmOrder()
    //     }
    //     else
    //         moveToConfirmOrder()
    // }

    // function getAuthorisationStatus(isinVal) {
    //     // console.log('getAuthorisationStatus: ', getAuthorisationStatus, isinValue);
    // let request = new MsfRequest();
    //     request.addToData({
    //         isin: isinVal
    //     })
    //     request.setEncrypt(false)
    //     MsfFetch.placeRequest(
    //         getBackOfficeBaseURL() + ORDER_PAD.CHECK_AUTHORISATION_STATUS,
    //         request,
    //         successRespCBgetAuthStatus,
    //         errorRespCBgetAuthStatus
    //     )
    // }

    // function successRespCBgetAuthStatus(response) {
    //     // console.log('123newapiresponse: ', response);
    //     if(response.data.isEdisAuthorised.status === "UNSUCESSFULL")
    //     setIsAuthorised(false)
    //     else if(response.data.isEdisAuthorised.status === "SUCESSFULL")
    //     setIsAuthorised(true)
    // }

    // function errorRespCBgetAuthStatus(error) {
    //     // console.log("newapiError", error)
    //     setIsAuthorised(true)
    // }

    // function goToEdisDashboard() {
    //     // props.history.push(SCREENS.EDIS_DASHBOARD)
    //     props.storeEdisScreenFlag(true)
    //     props.onCloseCB && props.onCloseCB()
    // }

    function checkTGroupOddLotSymbol() {
        // console.log('symData: ', symData, tradeType);
        let symDetails = Object.assign({}, symData.sym)
        let tGroupSeries = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.TGROUP_SERIES))
        // console.log('tGroupSeries: ', tGroupSeries);
        let oddLotSeries = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.ODD_LOT_SERIES))
        let oddLotSeriesItems = oddLotSeries.list.includes(symDetails.series) 
        if (getTgroupDetails(symDetails)) {
            props.storeOrderPadDialogDetails({
                dialogName: ORDERPAD_DIALOGS.ORDEPAD_GROUP_SERIES,
                message: tGroupSeries.msg,
                parentCB: moveToConfirmOrder,
                trade_type: tradeType,
                type: ORDERPAD_SERIES.TGROUP_SERIES
            })
        }
        else if (oddLotSeriesItems)
            props.storeOrderPadDialogDetails({
                dialogName: ORDERPAD_DIALOGS.ORDEPAD_GROUP_SERIES,
                message: oddLotSeries.msg,
                parentCB: moveToConfirmOrder,
                trade_type: tradeType,
                type: ORDERPAD_SERIES.ODD_LOT_SERIES
            })
        else
            moveToConfirmOrder()
    }

    function handlePlaceOrderSubmit() {
        // let errorMsgs = Object.assign({}, errorMsg)

        // if((symInstrmntMKPData == SYMBOL_INSTRUMENT_TYPE.OPTIONSTK) ||
        //             (symInstrmntMKPData == SYMBOL_INSTRUMENT_TYPE.OPTIONIDX)){
        //     if(fieldValue[ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION]){
        //         placeOrderSubmit()
        //     }
        //     else{
        //         errorMsgs[ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION] = 'Please Enter the Market protection'
        //         setErrorMsg(errorMsgs)
        //     }
        // }
        // else{
        placeOrderSubmit()
        // }
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
                // else if(props.holdingsResp.length && isSellingPositionQty(symData, fieldValue[item], 
                //     netPositionsData, selectedProductType, props.holdingsResp)
                //     && props.modifyOrder.modifyType !== ORDER_MODIFY_TYPE.SQUARE_OFF && tradeType === ORDER_TYPES.SELL)  {
                //     error[item] = true
                //     errorMsgs[item] = getOrderPadErrorMessage(MAX_SELL_AMT, item)
                //     hasError = true
                //     // console.log("123selltest",isSellingOutOfPositions(symData, fieldValue[item], selectedProductType, netPositionsData) )
                //     // sellOutOfPositions.current = isSellingOutOfPositions(symData, fieldValue[item], selectedProductType, netPositionsData
                //     // )
                // }
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
                if (selectedProductType === TRADE_PRODUCT_TYPES.BO ) {
                    if (isBuyTradeAction(tradeType) &&
                        (parseFloat(fieldValue[item]) < parseFloat(fieldValue[ORDERPAD_FIIELD_KEYS.PRICE]))) {
                        error[item] = true
                        errorMsgs[item] = getOrderPadErrorMessage(LOW, item)
                        hasError = true
                    } else if (isSellTradeAction(tradeType) &&
                        (parseFloat(fieldValue[item]) > parseFloat(fieldValue[ORDERPAD_FIIELD_KEYS.PRICE]))) {
                        error[item] = true
                        errorMsgs[item] = getOrderPadErrorMessage(HIGH, item)
                        hasError = true
                    }
                }
            } else if (item === ORDERPAD_FIIELD_KEYS.STOP_LOSS) {
                if (selectedProductType === TRADE_PRODUCT_TYPES.CO || selectedProductType === TRADE_PRODUCT_TYPES.BO) {
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
                    else if (selectedProductType === TRADE_PRODUCT_TYPES.BO
                    && (convertToUpperCase(props.sym.instrument) !== SYMBOL_INSTRUMENT_TYPE.FUTURESTK && 
                    convertToUpperCase(props.sym.instrument) !== SYMBOL_INSTRUMENT_TYPE.FUTUREIDX ) 
                    ) {
                        error[item] = findSquareOffCompareErr(tradeType,fieldValue[item],
                            fieldValue[ORDERPAD_FIIELD_KEYS.SQUARE_OFF],tickSize ).error
                        errorMsgs[item] = findSquareOffCompareErr(tradeType,fieldValue[item], 
                            fieldValue[ORDERPAD_FIIELD_KEYS.SQUARE_OFF],tickSize).errorMsgs
                        hasError = findSquareOffCompareErr(tradeType,fieldValue[item], 
                            fieldValue[ORDERPAD_FIIELD_KEYS.SQUARE_OFF],tickSize).hasError
                    }
                }
                // else if(firstValidationDone) {
                // else  if (firstValidationDone && selectedProductType === TRADE_PRODUCT_TYPES.BO) {
                //     error[item] = findSquareOffCompareErr(tradeType,fieldValue[item],
                //         fieldValue[ORDERPAD_FIIELD_KEYS.SQUARE_OFF],tickSize ).error
                //     errorMsgs[item] = findSquareOffCompareErr(tradeType,fieldValue[item], 
                //         fieldValue[ORDERPAD_FIIELD_KEYS.SQUARE_OFF],tickSize).errorMsgs
                //     hasError = findSquareOffCompareErr(tradeType,fieldValue[item], 
                //         fieldValue[ORDERPAD_FIIELD_KEYS.SQUARE_OFF],tickSize).hasError
                // }
                // }               
                else if ((parseFloat(fieldValue[item]) > parseFloat(fieldValue[ORDERPAD_FIIELD_KEYS.PRICE]))) {
                    if (selectedOrderType === TRADE_ORDER_TYPES.MARKET) {
                        // ** stop loss buy and sell values have to be less than prefilled market price
                        // if (selectedProductType !== TRADE_PRODUCT_TYPES.CO) {
                        error[item] = true
                        errorMsgs[item] = getOrderPadErrorMessage(HIGH, item)
                        hasError = true
                        // }
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
                    if (isBuyTradeAction(tradeType) && (parseFloat(fieldValue[item]) < parseFloat(mainLegPrice))) {
                        error[item] = true
                        errorMsgs[item] = getOrderPadErrorMessage(LOW_MAIN_PRICE, item) +
                        " (" + convertCommaSeparated(mainLegPrice) + ")"
                        hasError = true
                    } else if (isSellTradeAction(tradeType) && 
                    (parseFloat(fieldValue[item]) > parseFloat(mainLegPrice))) {
                        error[item] = true
                        errorMsgs[item] = getOrderPadErrorMessage(HIGH_MAIN_PRICE, item) +
                        " (" + convertCommaSeparated(mainLegPrice) + ")"
                        hasError = true
                    }
                }
            } else if (convertToUpperCase(modifyChildType) === ORDER_MODIFY_CHILD_TYPES.THIRD) {
                if (item === ORDERPAD_FIIELD_KEYS.PRICE && !error[item]) {
                    if (isBuyTradeAction(tradeType) && (parseFloat(fieldValue[item]) > parseFloat(mainLegPrice))) {
                        error[item] = true
                        errorMsgs[item] =  getOrderPadErrorMessage(HIGH_MAIN_PRICE, item) +
                        " (" + convertCommaSeparated(mainLegPrice) + ")"
                        hasError = true
                    } else if (isSellTradeAction(tradeType) && (parseFloat(fieldValue[item]) 
                    < parseFloat(mainLegPrice))) {
                        error[item] = true
                        errorMsgs[item] = getOrderPadErrorMessage(LOW_MAIN_PRICE, item) +
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
                else if (item in fieldsObjOriginal.current && fieldValue[item] != fieldsObjOriginal.current[item]) {
                    modifyValueChanged = true
                }
            }
            return item
        })

        if (isModifyOrder(props.modifyOrder.modifyType)) {
            // console.log("GTD", GTDDate,
            //     fieldsObjOriginal.current[ORDERPAD_FIIELD_KEYS.GTD_DATE])
            // console.log("current", fieldsObjOriginal)
            if (selectedProductType != fieldsObjOriginal.current[ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE] ||
                selectedOrderType != fieldsObjOriginal.current[ORDERPAD_FIIELD_KEYS.ORDER_TYPE] ||
                selectedValidity != fieldsObjOriginal.current[ORDERPAD_FIIELD_KEYS.VALIDITY] ||
                (selectedValidity === TRADE_VALIDITY_TYPES.GTD &&
                    getFormatedDate(GTDDate, 0, DATE_FORMATS.DDMMYYYY_HYPEN, true).stringDate !=
                    fieldsObjOriginal.current[ORDERPAD_FIIELD_KEYS.GTD_DATE])
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
                    checkTGroupOddLotSymbol(fieldValue["qty"])
                else {
                    props.showAppDialog({
                        show: true,
                        message: getLangText("NO_FIELD_MODIFIED", "ORDERPAD")
                    })
                }
            }
            else
                checkTGroupOddLotSymbol(fieldValue["qty"])
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
            if (item === ORDERPAD_FIIELD_KEYS.PRICE) 
                hidePrice = true
            else 
                // clearing the unrequired values
                fieldValue[item] = null
        })
        let reqSym = selectedSym
        let values = Object.assign({}, fieldValue)

        values.symObj = reqSym
        // to revert modified CO and BO ordertypes(based on legs) 
        let finalPType;
        if(findParentPtypeBO_CO(selectedProductType) === TRADE_INTRADAY_PRODUCT_TYPES.BO ||
        findParentPtypeBO_CO(selectedProductType) === TRADE_INTRADAY_PRODUCT_TYPES.CO) 
            finalPType = findParentPtypeBO_CO(selectedProductType)       
        else 
            finalPType = selectedProductType
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
        values[ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE] = finalPType
        values[ORDERPAD_FIIELD_KEYS.VALIDITY] = selectedValidity
        // values[ORDERPAD_FIIELD_KEYS.ORDER_VALIDITY] = selectedOrderValidity
        // if (!hideOrderValue())
        values[ORDERPAD_FIIELD_KEYS.ORDER_VALUE] = orderValue.orderMargin
        values[ORDERPAD_FIIELD_KEYS.GTD_DATE] = GTDDate
        values[ORDERPAD_FIIELD_KEYS.CURR_DATE_TIME] = new Date()
        values.hidePrice = hidePrice
        props.storeOrderFieldValues(values)
        // console.log('values: ', values);
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
        // getAuthorisationStatus(response.data.isin)
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

    // To find available secondary Product types for intraday orders
    function findAvailablePTypes() {
        let intradayPTypes = TRADE_INTRADAY_PRODUCT_TYPE_ARRAY
        let  availPTypes = TRADE_INTRADAY_PRODUCT_TYPE_ARRAY;
        if (selectedOrderType === TRADE_ORDER_TYPES.MARKET) {
            availPTypes = intradayPTypes.filter((item) => 
                item !== TRADE_INTRADAY_PRODUCT_TYPES.BO
            )
        }
        else if (selectedOrderType === TRADE_ORDER_TYPES.SL) {
            availPTypes = intradayPTypes.filter((item) => 
                item !== TRADE_INTRADAY_PRODUCT_TYPES.CO
            )
        }
        else if (selectedOrderType === TRADE_ORDER_TYPES.SL_M) {
            // console.log("modifyChild", modifyChildType)
            if(convertToUpperCase(modifyChildType) === ORDER_MODIFY_CHILD_TYPES.SECOND) {
                availPTypes = intradayPTypes
            }
            else
                availPTypes = intradayPTypes.filter((item) => 
                    item !== TRADE_INTRADAY_PRODUCT_TYPES.BO && item !== TRADE_INTRADAY_PRODUCT_TYPES.CO
                )
        }
        let intradayOptions = TRADE_INTRADAY_OPTIONS_PRODUCT_TYPE_ARRAY

        if (props.sym.instrument !== "OPTSTK" && props.sym.instrument !== "OPTIDX")
            setIntradayProductTypes(availPTypes)
        else
            setIntradayProductTypes(intradayOptions)
    }

    function onClickKnowMoreMtf() {
        // setKnowMoreMtfClicked(true)
        props.storeOrderPadDialogDetails({
            dialogName: ORDERPAD_DIALOGS.MTF_KNOW_MORE,
            trade_type: tradeType,
            // symDetails: symData.sym
        })
    }
    let orderTypeHelpTextArray = [
        {
            orderHelpInfoLbl: 'DELIVERY_HELP_INFO_LBL', orderHelptext: 'DELIVERY_HELP_INFO',
            orderType: 'DELIVERY', index: 0
        },
        {
            orderHelpInfoLbl: 'INTRADAY_HELP_INFO_LBL', orderHelptext: 'INTRADAY_HELP_INFO',
            orderType: 'INTRADAY', index: 1
        },
        { orderHelpInfoLbl: 'TNC_HELP_INFO_LBL', orderHelptext: 'MTF_HELP_INFO', orderType: 'TNC', index: 2 },
        { orderHelpInfoLbl: 'MTF_HELP_INFO_LBL', orderHelptext: 'TNC_HELP_INFO', orderType: 'MTF', index: 3 },
        { orderHelpInfoLbl: 'NORMAL_HELP_INFO_LBL', orderHelptext: 'NORMAL_HELP_INFO', orderType: 'NORMAL', index: 4 },
        { orderHelpInfoLbl: 'CO_HELP_INFO_LBL', orderHelptext: 'CO_HELP_TEXT', orderType: 'CO', index: 5 },
        { orderHelpInfoLbl: 'BO_HELP_INFO_LBL', orderHelptext: 'BO_HELP_TEXT', orderType: 'BO', index: 6 },

    ]

    function displayHelpInfoTextForOrderType(orderTypeText) {
        let helpTextData = find(orderTypeHelpTextArray,
            function (o) { return o.orderType == orderTypeText.toUpperCase(); });
        return(
            <div className="custom-header">
                <div className="custom-title">
                    <span className="tooltip-icon"><InfoIcon/></span>
                    <span className="hovercard">
                        <div className="custom-tooltip">
                            {/* <p>{(helpTextData && helpTextData.orderHelpInfoLbl)? getLangText(helpTextData.orderHelpInfoLbl):null}</p> */}
                            <p>{(helpTextData && helpTextData.orderHelptext)? 
                                getLangText(helpTextData.orderHelptext):null}</p>
                        </div>
                    </span>
                </div>
            </div>
        )

    }

    function displayHelpInfoText(infoText){
        return(
            <div className="custom-header">
                <div className="custom-title">
                    <span className="tooltip-icon"><InfoIcon/></span>
                    <span className="hovercard">
                        <div className="custom-tooltip">
                            {/* <p>{infoLabel}</p> */}
                            <p>{infoText}</p>
                        </div>
                    </span>
                </div>
            </div>
        )
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
                                    props.modifyOrder.modifyType == ORDER_MODIFY_TYPE.SQUARE_OFF) ||
                                    (props.modifyOrder.modifyType == ORDER_MODIFY_TYPE.STOP_LOSS) ||
                                    (props.modifyOrder.modifyType == ORDER_MODIFY_TYPE.ADD_MORE))}
                            onSelectMenuCB={(item) => setSelectedTradeType(item)} hasLangageDependent = {true}
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
                                            className={`productType ${index === 0 ? "delivDemoTour" : ""}
                                             ${index === 1 ? "mtfDemoTour" : ""} flex-center 
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
                                                && seriesState) ? null : () => onSetProductTypePrimary(pItem)}
                                        >
                                            <LangText name={pItem}/>{ props.popupBlock ? "" : 
                                                displayHelpInfoTextForOrderType(pItem)}
                                        </span>
                                    )
                                })
                            }
                            <div className="hidingDiv"></div>
                            <div className=" cursor marketDepthDiv" onClick={onClickSubmitMD}></div>
                        </>
                    </div>
                </div>
                {
                    
                    symData.sym && symData.sym.exc !== EXCHANGES.NFO
                    // (convertToUpperCase(props.modifyOrder.modifyType) !== ORDER_MODIFY_TYPE.SQUARE_OFF)
                        // && convertToUpperCase(props.modifyOrder.modifyType) === ORDER_MODIFY_TYPE.MODIFY
                        && tradeType === ORDER_TYPES.BUY
                        ? 
                        <div className="mtf-trade-enable">
                            {
                                mtfPTypeChecked ?
                                    <span className = {`checkspan 
                            ${selectedProductType === TRADE_PRODUCT_TYPES.MTF ? "inactive" : ""}`} 
                                    onClick = {() => setMtfPTypeChecked(false)}>
                                        <CheckBoxIcon_Checked/></span>
                                    :
                                    <span className = {`checkspan  
                                    ${convertToUpperCase(props.modifyOrder.modifyType) === ORDER_MODIFY_TYPE.MODIFY ||
                                        convertToUpperCase(props.modifyOrder.modifyType) === 
                                                ORDER_MODIFY_TYPE.SQUARE_OFF || getTgroupDetails(symData.sym)  ? 
            "inactive2": ""}`} onClick = {() => setMtfPTypeChecked(true)}>
                                        <CheckBoxIcon_UnChecked/></span>
                            }
                            <span className="info-text"><LangText name="MTF_INFO"/></span>
                            <span className = "mtfknowmore cursor" 
                                onClick={onClickKnowMoreMtf}><LangText name="KNOW_MORE"/></span>
                        </div>
                        :
                        null
                }
                <div className="fieldBody">
                    <div className="fieldRow qty_price">
                        <div className="row">
                            {
                                fields[ORDERPAD_FIIELD_KEYS.QUANTITY] ?
                                    <div className={`field ${errorFields[ORDERPAD_FIIELD_KEYS.QUANTITY] ?
                                        'errorInputDiv' : ''} ${hiddenRows[ORDERPAD_FIIELD_KEYS.QUANTITY]} 
                                     ${isEquityCashSymbol(givenExc) ? 'disableLot' : ''}`}>
                                        <>
                                            <div className="labelInput"><LabledInput label={getLangText('QUANTITTY')} 
                                                name={ORDERPAD_FIIELD_KEYS.QUANTITY}
                                                value={fieldValue[ORDERPAD_FIIELD_KEYS.QUANTITY]}
                                                onChangeCB={onChangeValue}
                                            />
                                            <span className="lotChange">
                                                <button className={`sub ${disableSubQty ? 'disabled' : ''}`}
                                                    onClick={!disableSubQty ?
                                                        () => onChangeQtyInc('sub', ORDERPAD_FIIELD_KEYS.QUANTITY)
                                                        : ''}
                                                ><CircleMinusIcon />                                         
                                                </button>
                                                <button className={`add ${disableAddQty ? 'disabled' : ''}`}
                                                    onClick={!disableAddQty ?
                                                        () => onChangeQtyInc('add', ORDERPAD_FIIELD_KEYS.QUANTITY) :
                                                        ''}
                                                ><CirclePlusIcon />                                                  
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
                                    <LabledInput label={getLangText('PRICEE')}
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
                                            <LabledInput label={getLangText('INVESTED_AMOUNTT')}
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
                        <span className="label"><LangText module="ORDERPAD" name="ORDER" />
                            <span className="selectedLabel">
                            [ <LangText name={typeNameConversion(selectedOrderType)} />]</span>
                            <OrderPageHelpInfoComponent
                                selectedOrderType={selectedOrderType} orderTypes={orderTypes}
                                onSelectOrderType={onSelectOrderType} />
                        </span>
                        <div className="field orderField">
                            <div className={`oTypeDiv`}>
                                {
                                    orderTypes.map((oItem, oIndex) => {
                                        // if (props.modifyOrder.modifyType === ORDER_MODIFY_TYPE.MODIFY &&
                                        //     (selectedValidity === TRADE_VALIDITY_TYPES.GTD ||
                                        //         selectedValidity === TRADE_VALIDITY_TYPES.GTC)) {
                                        //     if (oItem !== TRADE_ORDER_TYPES.MARKET &&
                                        //         oItem !== TRADE_ORDER_TYPES.SL_M) {
                                        //         return (
                                        //             <label key={oIndex} className={`cursor radioField`}>
                                        //                 <input type="radio"
                                        //                     name="ordType"
                                        //                     onClick={() => onSelectOrderType(oItem)}
                                        //                     checked={selectedOrderType ?
                                        //                         oItem === selectedOrderType : false}
                                        //                 />
                                        //                 <span className="checkmark"></span>
                                        //                 <div className="value">{oItem}</div>
                                        //             </label>
                                        //         )
                                        //     }
                                        //     return null
                                        // }
                                        return (
                                            <label key={oIndex} className={`cursor radioField`}>
                                                <input type="radio"
                                                    name="ordType"
                                                    onClick={() => onSelectOrderType(oItem)}
                                                    checked={selectedOrderType ? oItem === selectedOrderType : false}
                                                />
                                                <span className="checkmark"></span>
                                                <div className="value"><LangText name={oItem}/></div>
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
                                            <LabledInput 
                                                label={getLangText('TRIGGER_PRICES',TEXT_ORIENTATION.PASCALCASE)}
                                                name={ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE}
                                                value={fieldValue[ORDERPAD_FIIELD_KEYS.TRIGGER_PRICE]}
                                                onChangeCB={onChangeValue}
                                                isShowHelpInfoText={true}
                                                //helpInfoTextLabel={getLangText("TRIGGER_PRICES_LBL")}
                                                helpInfoTextMsg={getLangText("TRIGGER_PRICES_TEXT")}
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
                                                // label={symMinMKPData ? 
                                                //     getLangText('MARKET_PROTECTION_MANDATORY') : 
                                                //     getLangText('MARKET_PROTECTION')}
                                                label={getLangText('MARKET_PROTECTION')}
                                                name={ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION}
                                                value={!Number.isNaN(parseInt(
                                                    fieldValue[ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION]))
                                                    ? fieldValue[ORDERPAD_FIIELD_KEYS.MARKET_PROTECTION] : ""}
                                                onChangeCB={onChangeValue}
                                                isShowHelpInfoText={true}
                                                //helpInfoTextLabel={getLangText("MARKET_PROTECTION_LBL")}
                                                helpInfoTextMsg={getLangText("MARKET_PROTECTION_TEXT")}
                                            />
                                            <span className="addOn">%</span>
                                            <div className="hidingDiv"></div>
                                        </div>
                                        {/* <div className="range">
                                            {
                                                (symMinMKPData) ?
                                                    <span>
                                                        <span
                                                            className="lowerCircuitVal">{1}%</span> -
                                                        <span className="upperCircuitVal">
                                                            {symMinMKPData}%</span>
                                                    </span>
                                                    : null
                                            }
                                        </div> */}
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
                                    <LangText module="ORDERPAD" name="TYPE" />  <span className="selectedLabel">
                                    [<LangText name={typeNameConversion(selectedProductTypeSecondary)}/>]</span> </span>
                                <div className={`field orderField ${hiddenRows[ORDERPAD_FIIELD_KEYS.PRODUCT_TYPE]}`}>
                                    {
                                        intradayProductTypes.map((iItem, iIndex) => {
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
                                                        <LangText name={iItem}/>
                                                        { props.popupBlock ? "" :
                                                            (iItem == TRADE_PRODUCT_TYPES.CO||
                                                        iItem == TRADE_PRODUCT_TYPES.BO)?
                                                                displayHelpInfoTextForOrderType(iItem):""}
                                        
                                                    </div>
                                                        
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
                                                    'SQUARE_OFF_SELL' : 'SQUARE_OFF_BUY',TEXT_ORIENTATION.PASCALCASE)}
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
                                                    'STOP_LOSS_SELL': 
                                                    'STOP_LOSS_BUY',TEXT_ORIENTATION.PASCALCASE                 
                                                )}
                                                // orientation={TEXT_ORIENTATION.PASCALCASE}
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
                                    </div> : null                                   
                            }
                            {
                                fields[ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS] ?
                                    <div className=
                                        {`field ${errorFields[ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS] ?
                                            'errorInputDiv' : ''} 
                                    ${hiddenRows[ORDERPAD_FIIELD_KEYS.TRAIL_STOP_LOSS]}`}>
                                        <div className="labelInput">
                                            <LabledInput
                                                label={getLangText('TRAILING_STOP_LOSS_OPT')}
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
                                <LangText module="ORDERPAD"
                                    name="MORE_OPTIONS" />
                            </span>
                            {
                                showMoreOptions ? <ShowLessIcon /> : <ShowMoreIcon />                                 
                            }
                        </span>
                    </div>
                    {
                        showMoreOptions ?
                            <>
                                <div className="fieldRow validityField">
                                    <span className="label">
                                        <LangText module="ORDERPAD" name="VALIDITY" /> <span className="selectedLabel">
                                            [<LangText name={selectedValidity} />]</span> 
                                        {displayHelpInfoText(getLangText("VALIDITY_TEXT"))}</span>
                                    <div className={`field orderField ${hiddenRows[ORDERPAD_FIIELD_KEYS.VALIDITY]}`}>
                                        <div className={`validityDiv `}>
                                            {
                                                // Do not show GTD/GTC options when modifying a normal order(DAY validity), when choosing AMO and when the symbols belong to oddLot and Tgroup series
                                                (fields[ORDERPAD_FIIELD_KEYS.VALIDITY]
                                                    && fields[ORDERPAD_FIIELD_KEYS.VALIDITY].length) ?
                                                    fields.validity.map((vItem, vIndex) => {
                                                        if (fieldValue[ORDERPAD_FIIELD_KEYS.AMO] || seriesState ||
                                                            oddLotState ||
                                                            (props.modifyOrder.modifyType === ORDER_MODIFY_TYPE.MODIFY
                                                                &&
                                                                ((selectedOrderType === TRADE_ORDER_TYPES.LIMIT &&
                                                                    selectedValidity === TRADE_VALIDITY_TYPES.DAY) ||
                                                                    (selectedOrderType === TRADE_ORDER_TYPES.SL &&
                                                                        selectedValidity === TRADE_VALIDITY_TYPES.DAY)
                                                                ))) {
                                                            if (vItem !== TRADE_VALIDITY_TYPES.GTC &&
                                                                vItem !== TRADE_VALIDITY_TYPES.GTD) {
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
                                                                            <LangText name={vItem}/>
                                                                        </div>
                                                                    </label>
                                                                )
                                                            }
                                                            return null
                                                        }
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
                                                                <div className="value"><LangText name={vItem}/></div>
                                                            </label>
                                                        )
                                                    })
                                                    : null
                                            }
                                            <div className="hidingDiv"></div>
                                        </div>
                                        {
                                            (fields[ORDERPAD_FIIELD_KEYS.DIS_QTY] &&
                                                selectedValidity !==
                                                TRADE_VALIDITY_TYPES.IOC
                                                && !fieldValue[ORDERPAD_FIIELD_KEYS.AMO]
                                            ) ?
                                                <div className=
                                                    {`field ${errorFields[ORDERPAD_FIIELD_KEYS.DIS_QTY]
                                                        ? 'errorInputDiv' : ''} 
                                                 ${hiddenRows[ORDERPAD_FIIELD_KEYS.DIS_QTY]}`}>
                                                    <div className="labelInput">
                                                        <LabledInput label={getLangText('DISCLODED_QTY')}
                                                            name={ORDERPAD_FIIELD_KEYS.DIS_QTY}
                                                            value={fieldValue[ORDERPAD_FIIELD_KEYS.DIS_QTY]}
                                                            onChangeCB={onChangeValue}
                                                            isShowHelpInfoText={true}
                                                            // helpInfoTextLabel={getLangText("DISCLOSED_QTY_LBL")}
                                                            helpInfoTextMsg={getLangText("DISCLOSED_QTY_TEXT")}
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
                                        }
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
                                                    <span className="label">Valid Till</span>
                                                    <DatePickerComponent
                                                        onChangeDate={onChangeDate}
                                                        selectedDate={GTDDate}
                                                        minDate={new Date()}
                                                        maxDate={maxDate}
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
                    !hideFooterActions ?
                        <div className="content">
                            <div className="marginDiv">
                                <div className="reqMargin">
                                    <div className="label"> <LangText module="ORDERPAD"
                                        name="REQD_MARGIN" />:</div>
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
                                                findParentPtypeBO_CO(selectedProductType) 
                                                !== TRADE_INTRADAY_PRODUCT_TYPES.BO && 
                                                findParentPtypeBO_CO(selectedProductType) 
                                                !== TRADE_INTRADAY_PRODUCT_TYPES.CO ?  
                                                    checkEmpty(orderValue.orderMargin) : checkEmpty(null)
                                                    // checkEmpty(orderValue.orderMargin)
                                        }
                                    </div>
                                    <button className="refreshBtn" onClick={findParentPtypeBO_CO(selectedProductType) 
                                    !== TRADE_INTRADAY_PRODUCT_TYPES.BO && findParentPtypeBO_CO(selectedProductType) 
                                    !== TRADE_INTRADAY_PRODUCT_TYPES.CO ?  getCheckMargin : null}>
                                        <RefreshIcon />
                                    </button>
                                </div>
                                <div className="availMargin">
                                    <div className="label"><LangText module="ORDERPAD"
                                        name="AVAIL_MARGIN" />:</div>
                                    <div className="value">
                                        {
                                            pendingGetMarReq ?
                                                <span className="dotLoading">
                                                    <span className="loader__dot">.</span>
                                                    <span className="loader__dot">.</span>
                                                    <span className="loader__dot">.</span>
                                                </span>
                                                :
                                                findParentPtypeBO_CO(selectedProductType) !==
                                                 TRADE_INTRADAY_PRODUCT_TYPES.BO && 
                                                 findParentPtypeBO_CO(selectedProductType) 
                                                 !== TRADE_INTRADAY_PRODUCT_TYPES.CO ?                         
                                                    checkEmpty(orderValue.AvailMargin) : 
                                                    checkEmpty(null)                
                                            // checkEmpty(orderValue.AvailMargin)
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
                                    onClick={handlePlaceOrderSubmit}
                                >
                                    <LangText module="BUTTONS" name={tradeType} />
                                </button>
                            </div>
                        </div>
                        : null
                }
            </div>
        </div >
    )
}
// function LabledInput(props) {
//     return (
//         <>
//             <span className="label">{props.label}</span>
//             <InputComponent
//                 name={props.name}
//                 value={props.value}
//                 onChange={props.onChangeCB}
//                 disabled={props.disabled}
//                 onBlur={props.onBlur}
//                 onFocus={props.onFocus}
//                 maxLength={props.maxLength}
//             />
//         </>
//     )
// }
const mapStateToProps = ({ settings, profileDialog, demoTour, holdings, orderPad }) => {
    return {
        selectedTheme: settings.selectedTheme,
        profileData: profileDialog.profileDetails,
        taxDeclaration: profileDialog.taxDeclaration,
        popupBlock: demoTour.demoPopupBlock,
        enableStopLoss: orderPad.dialog.enableStopLoss,
        prod_type: orderPad.dialog.prod_type,
        holdingsResp: holdings.holdingsResp,
        allHoldingsResp: holdings.allHoldingsResp
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeOrderPadDialogDetails: (s) => { dispatch(storeOrderPadDialogDetails(s)) },
        storeOrderFieldValues: (s) => { dispatch(storeOrderFieldValues(s)) },
        storeModifyOrder_InternalFlag: (s) => { dispatch(storeModifyOrder_InternalFlag(s)) },
        storeOrderpadSelectedSym: (s) => { dispatch(storeOrderpadSelectedSym(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeEdisScreenFlag: (s) => { dispatch(storeEdisScreenFlag(s)) }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withStreaming(withRouter(OrderPadDialogComponent)));