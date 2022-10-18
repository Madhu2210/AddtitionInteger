import React, { useEffect, useState, useRef } from 'react'
import { useFetch, MsfRequest } from '../../../../index'
import { connect } from "react-redux";

import LangText, { getLangText } from '../../../../common/lang/LangText';

import {
    storeSelectedDashboardWidget, storeNetpositionsortData, storeModifyOrderDetails,
    storeOrderFieldValues, storeOrderpadSelectedSym, storeOrderPadDialogDetails,
    storeOrderDialogDetails, storeSquareoffNetPosition, showAppDialog
} from '../../../../state/actions/Actions';

import {
    AF_EventTriggered,
    checkEmpty, convertToLowerCase, convertToUpperCase, getColorCode,
    getDispSymbolName, getTradingBaseURL, isBuyTradeAction,
    isEquityCashSymbol,
    isEquityFutureSymbol,
    isSellTradeAction, replaceComma
} from '../../../../common/CommonMethods';
import {
    CheckBoxIcon_Checked, CheckBoxIcon_UnChecked,
    DownArrowIcon, MaximizeIcon, MinimizeIcon, SortIcon, UpArrowIcon
} from '../../../common/FontIcons';
import {
    DASHBOARD_WIDGET_MODE, ORDERPAD_DIALOGS, ORDERPAD_FIIELD_KEYS, ORDER_DIALOGS, ORDER_MODIFY_TYPE,
    ORDER_TYPES, SORT_DATATYPE, THEMES, TEXT_ORIENTATION,
    // NET_POSITION_HEADER_FILTER_CONST, NET_POSITION_FILTERS,NETPOSITION_PRODUCTTYPE_LIST,
    TRADE_PRODUCT_TYPES,
    TAX_DECLARATION_MSG_KEY,
    AF_EVENT_NAMES,
    AF_EVENT_TYPES,
    TRADE_ORDER_TYPES,
    TRADE_INTRADAY_PRODUCT_TYPES
} from '../../../../common/Constants';
import {
    closeTaxDeclarationDialog, getTaxDecalreDetails, getTaxProfileFromAPIData,
    gotoOrderDialog, gotoTrade
} from '../../../../common/Bridge';
import { TRADE } from '../../../../config/ServiceURLs';
// import Select from '../../../common/SelectInputComponent';

function NetPositionsTableComponent(props) {

    const MsfFetch = useFetch()

    const [selectedShowMoreIndex, setSelectedShowMoreIndex] = useState(null)
    const [showMore, setShowMore] = useState(false)
    const [symbolList, setSymbolList] = useState([])
    const [sortFlag, setSortFlag] = useState([])
    // const [selectedFilter] = useState(NET_POSITION_HEADER_FILTER_CONST[0])
    const [squareOff, setSquareOff] = useState(false)
    // const [listLength, setListLength] = useState(props.list ? props.list.length : 0)
    // const [listEquityLen, setListEquityLen] = useState()
    // const [listDerivativeLen, setListDerivativeLen] = useState()
    const isSorting = useRef(false)
    const [selectedList, setSelectedList] = useState([])
    const [originalSymArray, setOriginalSymArray] = useState([])
    const [select, setSelect] = useState(true)
    const [disableSquareOff, setDisableSquareOff] = useState(false)
    const selectedSquareOffSymbol = useRef([])
    // const [productTypeList] = useState(NETPOSITION_PRODUCTTYPE_LIST)
    // const [productType, setProductType] = useState(NETPOSITION_PRODUCTTYPE_LIST[0])
    const [convertMsg, setConvertMsg] = useState('')
    const [squareOffAllBlockMsg, setSquareOffAllBlockMsg] = useState('')

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.NETPOSITION, AF_EVENT_TYPES.NETPOSITION_TAB, { "onLoad": "netposition" })
    }, [])

    useEffect(() => {
        let taxDetails = getTaxDecalreDetails()
        let convertChkMsg = taxDetails.declarationMsgs[TAX_DECLARATION_MSG_KEY.ID_POSITION_CONVERSION]
        let squareoffMsg = taxDetails.declarationMsgs[TAX_DECLARATION_MSG_KEY.ID_SQUARE_OFF_ALL]
        setConvertMsg(convertChkMsg)
        setSquareOffAllBlockMsg(squareoffMsg)
    }, [])

    //  ***Below code commented out for removing equity and derivative tabs in Net positions on 27-12-2021***
    // useEffect(() => {
    //     equityFilterType()
    // }, [productType])
    // ***

    useEffect(() => {
        let list = Object.assign([], props.list)
        list = list.map((item, index) => {
            item.refKey = index
            return item
        })
        setOriginalSymArray(list)
    }, [props.list])

    useEffect(() => {
        if (props.list.length || props.errorMsg)
            props.hideWidgetLoader()
        else
            props.showWidgetLoader()
    }, [props.list, props.errorMsg])

    useEffect(() => {
        if (props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.ORDER_VIEW)
            setShowMore(true)
        else
            setShowMore(false)
    }, [props.selectedWidgetMode])

    useEffect(() => {
        setSymbolList(originalSymArray);
        // ***Below code commented out for removing equity and derivative tabs in Net positions on 27-12-2021***
        // if (originalSymArray) {
        //     let eqLen = getEquityPositions(originalSymArray)
        //     setListEquityLen(Object.keys(eqLen).length)
        //     let derLen = getDerivativePositions(originalSymArray)
        //     setListDerivativeLen(Object.keys(derLen).length)
        // }
        // ***
    }, [originalSymArray])

    useEffect(() => {
        if (props.sortColumnList && props.sortColumnList.length)
            setSortFlag(props.sortColumnList)
    }, [props.sortColumnList])

    // ***Below code commented out for removing equity and derivative tabs in Net positions on 27-12-2021***

    // useEffect(() => {
    //     if (originalSymArray) {
    //         setListLength(originalSymArray.length)
    //     }
    //     if (selectedFilter !== NET_POSITION_FILTERS.ALL_POSTIONS) {
    //         let filteredPositions = []
    //         if (selectedFilter === NET_POSITION_FILTERS.EQUITY) {
    //             filteredPositions = getEquityPositions(originalSymArray)

    //         }
    //         else
    //             filteredPositions = getDerivativePositions(originalSymArray)
    //         setSymbolList(filteredPositions)
    //     }
    //     else {
    //         setSymbolList(originalSymArray)
    //     }
    // }, [selectedFilter, originalSymArray])

    // function equityFilterType() {
    //     let availableList = originalSymArray
    //     if (productType.key === 'all') {
    //         setListEquityLen(Object.keys(availableList).length)
    //         setSymbolList(availableList)
    //     }
    //     else {
    //         let filteredEquity = availableList.filter((eItem) => {
    //             return eItem.prdType === productType.key
    //         })
    //         setListEquityLen(Object.keys(filteredEquity).length)
    //         setSymbolList(filteredEquity)

    //     }

    // }

    // function onSelectedProduct(item) {
    //     setProductType(item);
    // }

    // function getDerivativePositions(availList) {
    //     if (availList) {
    //         let filteredDerivatives = availList.filter((items) => {
    //             if (items.sym.asset === "future" || items.sym.asset === "option" )
    //                 return items.sym.asset
    //             return null
    //         })
    //         return filteredDerivatives
    //     }
    //     return null
    // }

    // function getEquityPositions(availableList) {
    //     if (availableList) {
    //         let filteredEquity = availableList.filter((item) => {
    //             return item.sym.asset === convertToLowerCase(NET_POSITION_FILTERS.EQUITY)
    //         })
    //         if (productType.key === 'all') {
    //             setListEquityLen(Object.keys(filteredEquity).length)
    //             return filteredEquity
    //         }      
    //         let filteredProduct = filteredEquity.filter((eItem) => {
    //             return eItem.prdType === productType.key
    //         })
    //         setListEquityLen(Object.keys(filteredProduct).length)
    //         return filteredProduct
    //     }
    //     return null
    // }
    // ***

    function showMoreDetails(index) {
        if (index === selectedShowMoreIndex)
            setSelectedShowMoreIndex(null)
        else
            setSelectedShowMoreIndex(index)
    }

    function onClickExpand() {
        if (showMore)
            props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.ORDER_WITH_QUOTE)
        else
            props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.ORDER_VIEW)

        setShowMore(!showMore)
    }

    function onClickTrade(symData, tradeType) {
        if (tradeType === ORDER_MODIFY_TYPE.SQUARE_OFF) {
            if (parseInt(symData.netQty) > 0)
                onClickModifyOrder(symData, ORDER_MODIFY_TYPE.SQUARE_OFF)
            else
                onClickModifyOrder(symData, ORDER_MODIFY_TYPE.SQUARE_OFF)
        } else {
            gotoTrade(symData, ORDER_TYPES.BUY)
        }
    }

    function onClickModifyOrder(dataItem, type) {
        dataItem.qty = replaceComma(dataItem.netQty)
        let symObj = dataItem.sym
        symObj.dispSym = dataItem.dispSym
        symObj.baseSym = dataItem.baseSym
        symObj.companyName = dataItem.companyName
        symObj.childType = dataItem.childType
        let values = {}
        let fieldKeyArray = Object.keys(dataItem)
        fieldKeyArray.map((item) => {
            if (ORDERPAD_FIIELD_KEYS.API_KEY[item])
                values[ORDERPAD_FIIELD_KEYS[ORDERPAD_FIIELD_KEYS.API_KEY[item]]] =
                    (dataItem[item] == 0 ? '' : replaceComma(dataItem[item]))
        })
        props.storeModifyOrderDetails({
            modifyType: type,
            symDetails: dataItem,
        })
        if (values[ORDERPAD_FIIELD_KEYS.ORDER_TYPE]) {
            values[ORDERPAD_FIIELD_KEYS.ORDER_TYPE] = convertToUpperCase(values[ORDERPAD_FIIELD_KEYS.ORDER_TYPE])
        }
        props.storeOrderFieldValues(values)
        props.storeOrderpadSelectedSym(symObj)
        let ordActionType = dataItem.ordAction;
        if (type === ORDER_MODIFY_TYPE.SQUARE_OFF || type === ORDER_MODIFY_TYPE.STOP_LOSS) {
            if (ordActionType) {
                if (isBuyTradeAction(ordActionType))
                    ordActionType = ORDER_TYPES.SELL
                else if (isSellTradeAction(ordActionType))
                    ordActionType = ORDER_TYPES.BUY
            }
        }
        props.storeOrderPadDialogDetails({
            dialogName: ORDERPAD_DIALOGS.ORDER_PAD,
            trade_type: convertToUpperCase(ordActionType),
        })

        if (dataItem.qty < 0) {
            if (dataItem.prdType === TRADE_PRODUCT_TYPES.DELIVERY ||
                dataItem.prdType === TRADE_PRODUCT_TYPES.TNC ||
                dataItem.prdType === TRADE_PRODUCT_TYPES.MTF) {
                props.storeSquareoffNetPosition(false)
            }
            else {
                closeTaxDeclarationDialog()
                props.storeSquareoffNetPosition(true)
            }
        }
        else {
            closeTaxDeclarationDialog()
            props.storeSquareoffNetPosition(true)
        }
    }

    function onClickConvert(data, dialog) {
        gotoOrderDialogCB(data, dialog)
    }

    function gotoOrderDialogCB(data, dialog) {
        let profileDetails = getTaxProfileFromAPIData()
        if (dialog === ORDER_DIALOGS.CONVERT) {
            if (
                (
                    isEquityCashSymbol(data.sym.exc)
                    &&
                    profileDetails.isTradeBlock
                )
                ||
                (
                    isEquityFutureSymbol(data.sym.exc)
                    &&
                    profileDetails.isTradeBlockFO
                )
                ||
                (
                    isEquityFutureSymbol(data.sym.exc)
                    &&
                    profileDetails.isTradeBlockProgress
                )
            ) {
                props.showAppDialog({
                    title: getLangText('ALERT_APP', 'LOGIN'),
                    message: convertMsg,
                    defaultBtnName: getLangText('OK', 'BUTTONS'),
                    show: true
                })
            }
            else
                gotoOrderDialog(data, dialog)
        }
        else {
            gotoOrderDialog(data, dialog)
        }
        setSelectedShowMoreIndex(null)
    }

    function onSort(type, key1) {
        isSorting.current = true
        props.storeNetpositionsortData({
            type: type,
            key: key1,
            sortType: null
        })
    }

    function getSortIconCB(column) {
        let sortOrder = sortFlag.filter((item) => item.column === column)
        if (sortOrder.length)
            return sortOrder[0].sortAsc
        return null
    }

    function onIconSort(type, key, sortType) {
        props.storeNetpositionsortData({
            type: type,
            key: key,
            sortType: sortType
        })
    }

    // function getSelectedFilter(item) {
    //     // setSelect(true)  --commented out from start itself.Keep it that way
    //     setSelectedFilter(item)
    // }

    function getDeselectAll() {
        setSelect(true)
        setSquareOff(true)
        setSelectedList(symbolList)
        setDisableSquareOff(true)
    }

    function getSquareOffAll() {
        let profileDetails = getTaxProfileFromAPIData()
        let hasFutSym = false
        let hasCaseSym = false
        originalSymArray.map((item) => {
            if (isEquityCashSymbol(item.sym.exc))
                hasCaseSym = true
            if (isEquityFutureSymbol(item.sym.exc))
                hasFutSym = true
        })
        if (
            (hasCaseSym && profileDetails.isTradeBlock)
            ||
            (hasFutSym && profileDetails.isTradeBlockFO)
            ||
            (
                hasFutSym
                &&
                profileDetails.isTradeBlockProgress
            )
        ) {
            // return <ClosePopupInfo message={idCancelMsg} show={idCancelShow} closeCB={setIdCancelShow(false)}/>;
            props.showAppDialog({
                title: getLangText('ALERT_APP', 'LOGIN'),
                message: squareOffAllBlockMsg,
                defaultBtnName: getLangText('OK', 'BUTTONS'),
                show: true
            })
        }
        else {
            // if (squareOff) {
            //     setSelect(true)
            //     setSquareOff(false)
            //     setSelectedList(symbolList)
            // }
            // else {
            setSelect(false)
            setSquareOff(true)
            let newArray = []
            originalSymArray.map((item) => {
                if (item.netQty !== "0" && item.prdType !== TRADE_PRODUCT_TYPES.BO &&
                    item.prdType !== TRADE_PRODUCT_TYPES.CO)
                    newArray.push(item.refKey)
            })
            setSelectedList(newArray)
            setDisableSquareOff(false)
            // }
            // if(selectedList.length===0){
            //     setSelect(false)
            // }
            // else{
            //     setSelect(true)

            // }

        }
    }

    function getcheckedSymbol(symDetails) {
        setSelect(false)
        setDisableSquareOff(false)

        // if(selectedList.length===0){
        //     setDisableSquareOff(false) 
        // }
        let updatedArray = Object.assign([], selectedList)

        let selectedSymIndex = updatedArray.findIndex((item) => {
            return item === symDetails
        })
        if (selectedSymIndex === -1) {
            updatedArray.push(symDetails)
        }
        else {
            updatedArray.splice(selectedSymIndex, 1);
        }
        if (updatedArray.length === 0) {
            setDisableSquareOff(true)
            setSelect(true)
            setSquareOff(true)
        }

        setSelectedList(updatedArray)

    }
    function getConfirmSquareOff() {
        let selectedSymbolList = []
        originalSymArray.map((item, index) => {
            let selectedIndex = selectedList.findIndex((sitem) => {
                return sitem === item.refKey
            })
            if (selectedIndex !== -1) {
                selectedSymbolList.push(originalSymArray[index])
            }

        })
        selectedSquareOffSymbol.current = selectedSymbolList
        props.storeOrderDialogDetails({
            dialogName: ORDER_DIALOGS.NETPOSITION_SQOFF_CONFIRM,
            parentCB: getMultipleSquareOff,
            symData: selectedSymbolList,

        })
    }

    function getMultipleSquareOff() {
        props.showWidgetLoader();
        let reqRequestArry = []
        let currDate = new Date()
        if (selectedSquareOffSymbol.current.length !== 0) {
            selectedSquareOffSymbol.current.map((item) => {
                let reqSymobj = {
                    "ordAction": isBuyTradeAction(item.ordAction) ?
                        convertToLowerCase(ORDER_TYPES.SELL)
                        : convertToLowerCase(ORDER_TYPES.BUY),
                    "ordDuration": "DAY",
                    "limitPrice": "",
                    "isAmo": false,
                    "sym": item.sym,
                    "prdType": item.prdType,
                    "qty": Math.abs(item.netQty).toString(),
                    "currentDateTime": currDate.toISOString(),
                    "ordType": "MARKET"
                }
                reqRequestArry.push(reqSymobj)
            })
        }
        let request = new MsfRequest();
        request.addToData({
            orders: reqRequestArry,
            "type": "squareoffall"
        })

        MsfFetch.placeRequest(
            getTradingBaseURL() + TRADE.MUTLIPLE_SQUAREOFF,
            request,
            successRespCBmultipleSquareOff,
            errorRespCBmultipleSquareOff
        )

    }

    function successRespCBmultipleSquareOff(response) {
        console.log("searching Api",response)
        props.hideWidgetLoader();
        props.storeOrderDialogDetails({
            dialogName: ORDER_DIALOGS.NETPOSITION_SQOFF_CONFIRM_SUCC,
            resultData: {
                success: true,
                message: response.infoMsg
            }

        })
    }

    function errorRespCBmultipleSquareOff(error) {
        props.hideWidgetLoader();
        props.storeOrderDialogDetails({
            dialogName: ORDER_DIALOGS.NETPOSITION_SQOFF_CONFIRM_SUCC,
            resultData: {
                success: false,
                message: error.message
            }
        })
    }
    function cancelmutilpleSquareOff() {
        setSelect(true)
        setSquareOff(false)
        setSelectedList([])
    }

    function getFlaggeditems(refKey) {
        let itemIndex = selectedList.findIndex((item) => {
            return item === refKey
        })
        if (itemIndex === -1)
            return false
        return true
    }

    function onClickStopLossAction(item) {
        let itemData = item
        itemData.ordType = TRADE_ORDER_TYPES.SL
        onClickModifyOrder(itemData, ORDER_MODIFY_TYPE.STOP_LOSS)
    }

    function onClickBuySellMoreAction(item) {
        onClickModifyOrder(item, ORDER_MODIFY_TYPE.ADD_MORE)
    }

    return (
        <>
            <div className="orderTable-base net-position">

                <div className="netPositionWraper">

                    <div className="cardDashboardNetPosition" style={{ backgroundColor: "#fbf9f9" }}>

                        <div class="upArrowIcon">
                        <span className="bfsl-font uparrowtradeicon holding-icon">(</span></div>
                        <div class="containerNetPosition" style={{ marginLeft: "67px" }}>
                            <h2 style={{ color: "#7e7e7e" }}>Today's P&L</h2>
                            <p style={{ display: "flex", justifyContent: "space-between", color: "#00b500" }}><b style={{ fontSize: "22px" }}>₹ 15.00</b></p>
                        </div>
                        <div class="equalIconNet" style={{ color: "#a39e9e", marginLeft: "100px", alignItems: "center", display: "flex" }}><span className="bfsl-font minusIcon netPositionIcon">m</span></div>

                        <div class="containerNetPosition" style={{ marginLeft: "100px" }}>
                            <h2 style={{ color: "#7e7e7e" }}>Unrealised P&L</h2>
                            <p style={{ display: "flex", justifyContent: "space-between", color: "#00b500" }}><b style={{ fontSize: "22px" }}>₹ 23.00</b> </p>
                        </div>

                        <div class="plusIconNet" style={{ color: "#a39e9e", marginLeft: "100px", alignItems: "center", display: "flex" }}><span className="bfsl-font plusIcon netPositionIcon">q</span></div>

                        <div class="containerNetPosition" style={{ marginLeft: "100px" }}>
                            <h2 style={{ color: "#7e7e7e" }}>Realised P&L</h2>
                            <p style={{ display: "flex", justifyContent: "space-between", color: "#00b500" }}><b style={{ fontSize: "22px" }}>₹ 15.00</b></p>
                        </div>
                    </div>
                </div>
                {symbolList.length ? <div className="postion-filter">
                    <div className="filter-left">

                        {/* <div className={`all-positions cursor 
                     ${selectedFilter === NET_POSITION_FILTERS.ALL_POSTIONS ?
            'selected' : ''}`}
                    onClick={() => getSelectedFilter(NET_POSITION_FILTERS.ALL_POSTIONS)}>
                        <div className="all-title">
                            All Positions
                            <span className="net-top"></span>
                        </div>

                        <div className="positions-count"><span className="count-val-net">{listLength}
                        </span></div>
                    </div>
                    <div className={`equity cursor 
                     ${selectedFilter === NET_POSITION_FILTERS.EQUITY ?
            'selected' : ''}`}
                    onClick={() => getSelectedFilter(NET_POSITION_FILTERS.EQUITY)}
                    >
                        <div className="equity-title">
                            Equity
                            <span className="net-top"></span>
                        </div>

                        <div className="equity-count"><span className="count-val-net">{listEquityLen}
                        </span></div>
                    </div>
                    <div className={`derivative cursor 
                     ${selectedFilter === NET_POSITION_FILTERS.DERIVATIVE ?
            'selected' : ''}`}
                    onClick={() => getSelectedFilter(NET_POSITION_FILTERS.DERIVATIVE)}>
                        <div className="derivtive-title">
                            Derivative
                            <span className="net-top"></span>
                        </div>
                        <div className="derivative-count">
                            <span className="count-val-net">{listDerivativeLen ? listDerivativeLen : 0}
                            </span></div>
                    </div>
                        <div className="derivative-count">{listDerivativeLen ? listDerivativeLen : 0}</div>
                    </div> */}
                    </div>
                    <div className="filter-right">
                        {/* {
                        squareOff ?
                            <div className="clear-all"
                                onClick={() => clearAllSelection()}>
                                Clear All
                            </div>
                            :
                            ""
                    } */}
                        {select ? <div className="squareoff cursor squareoff"
                            onClick={() => getSquareOffAll()}>
                            <LangText module="BUTTONS" name="SQUAREOFF_ALL" />
                        </div> : <div className="squareoff cursor squareoff"
                            onClick={() => getDeselectAll()}><LangText module="BUTTONS" name="DESELECT" /></div>}
                    </div>
                </div> : null}
                {/* {selectedFilter === NET_POSITION_FILTERS.EQUITY ?
                <div className="productype-dropdown">
                    <Select optionList={productTypeList}
                        selectedOption={productType.name}
                        onSelectValueCB={onSelectedProduct}
                        value="name"
                        preSelect={true}
                    />
                </div> : ""} */}

                <table className="order-table netPostion">
                    <thead className="thead-scroller">
                        <tr>
                            {squareOff ? <th className="reArrangeIconCol"></th> : ''}

                            <th className={`firstChild width25`}>
                                <span className=""
                                // onClick={() => onSort(SORT_DATATYPE.STRING, 'dispSym')}
                                >
                                    <LangText module="TABLE_HEADERS" name="SYMBOL" />
                                </span>
                                {/* <SortIcon colName="dispSym"  /> */}
                            </th>
                            <th className="">
                                <span className="cursor"
                                    onClick={() => onSort(SORT_DATATYPE.INT, 'netQty')}
                                >
                                    <LangText module="TABLE_HEADERS" name="NET_QTY" />
                                </span>
                                <SortIcon colName="netQty"
                                    getSortIcon={getSortIconCB}
                                    type={SORT_DATATYPE.INT}
                                    onIconSort={onIconSort} />

                            </th>
                            <th className="">
                                <span className="cursor"
                                    onClick={() => onSort(SORT_DATATYPE.INT, 'avgPrice')}
                                >
                                    <LangText module="TABLE_HEADERS" name="AVG_PRICE" />
                                </span>
                                <SortIcon colName="avgPrice"
                                    getSortIcon={getSortIconCB}
                                    type={SORT_DATATYPE.INT}
                                    onIconSort={onIconSort} />

                            </th>
                            <th className="">
                                <span className="cursor"
                                    onClick={() => onSort(SORT_DATATYPE.STRING, 'prdType')}
                                >
                                    <LangText module="TABLE_HEADERS" name="PRODUCT_TYPE" />
                                </span>
                                <SortIcon colName="prdType"
                                    getSortIcon={getSortIconCB}
                                    type={SORT_DATATYPE.STRING}
                                    onIconSort={onIconSort} />

                            </th>
                            <th className="">
                                <span className="cursor"
                                    onClick={() => onSort(SORT_DATATYPE.INT, 'ltp')}
                                >
                                    <LangText module="TABLE_HEADERS" name="LTP" />
                                </span>
                                <SortIcon colName="ltp"
                                    getSortIcon={getSortIconCB}
                                    type={SORT_DATATYPE.INT}
                                    onIconSort={onIconSort} />

                            </th>
                            <th className="">
                                <span className="cursor"
                                    onClick={() => onSort(SORT_DATATYPE.INT, 'daypnl')}
                                >
                                    <LangText module="TABLE_HEADERS" name="TODAYS_PL" />
                                </span>
                                <SortIcon colName="daypnl" getSortIcon={getSortIconCB}
                                    type={SORT_DATATYPE.INT} onIconSort={onIconSort}
                                />
                            </th>
                            <th className="">
                                <span className="cursor"
                                    onClick={() => onSort(SORT_DATATYPE.INT, 'pnl')}
                                >
                                    <LangText module="TABLE_HEADERS" name="P_L" />
                                </span>
                                <SortIcon colName="pnl" getSortIcon={getSortIconCB}
                                    type={SORT_DATATYPE.INT} onIconSort={onIconSort} />
                            </th>
                            <th className="width4 iconCol">
                                {
                                    props.selectedWidgetMode !== DASHBOARD_WIDGET_MODE.DEFAULT ?
                                        (
                                            showMore ?
                                                <MinimizeIcon className="showMoreIcon"
                                                    onClick={onClickExpand}
                                                />
                                                :
                                                <MaximizeIcon className="showMoreIcon"
                                                    onClick={onClickExpand}
                                                />
                                        )
                                        : null
                                }
                            </th>
                        </tr>
                    </thead>
                    <tbody className="tbody-scroller scroller_firefox">
                        {
                            symbolList.length ?
                                symbolList.map((item, index) => {
                                    return (
                                        <>
                                            <tr className={`${selectedShowMoreIndex === index ? 'noBorder' : ''} `}>
                                                {(squareOff && symbolList.length) ? <td className="reArrangeIconCol">
                                                    {
                                                        parseInt(item.netQty) !== 0 &&
                                                            item.prdType !== TRADE_INTRADAY_PRODUCT_TYPES.BO &&
                                                            item.prdType !== TRADE_INTRADAY_PRODUCT_TYPES.CO ?
                                                            (
                                                                getFlaggeditems(item.refKey) ?
                                                                    <CheckBoxIcon_Checked
                                                                        onClick={() => getcheckedSymbol(item.refKey)} />
                                                                    :
                                                                    <CheckBoxIcon_UnChecked
                                                                        onClick={() => getcheckedSymbol(item.refKey)} />
                                                            )
                                                            : ''
                                                    }

                                                </td> : ''}

                                                <td className="firstChild width25">
                                                    <div className="symName-column">
                                                        <div className="primary">
                                                            <div className="baseSym primary-symName text-nowrap"
                                                                title={getDispSymbolName(item).primaryName}
                                                                onClick={() => gotoOrderDialogCB(item,
                                                                    ORDER_DIALOGS.NETPOSITION_DETAILS)}
                                                            >
                                                                <span className={`ordAction
                                                             ${isBuyTradeAction(item.ordAction) ? "buy-clr" :
                                                                        isSellTradeAction(item.ordAction) ?
                                                                            "sell-clr" : "text-color"}`}>
                                                                    {checkEmpty(convertToUpperCase(item.ordAction))}
                                                                </span>
                                                                <span className="quote-click">
                                                                    {getDispSymbolName(item).primaryName}</span>
                                                            </div>
                                                            <span className="exc">{item.sym.exc}</span>
                                                        </div>
                                                        <div className="symName text-nowrap">
                                                            <span title={getDispSymbolName(item).secondaryName}>
                                                                {getDispSymbolName(item).secondaryName}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {checkEmpty(item.netQty)}
                                                </td>
                                                <td>
                                                    {checkEmpty(item.avgPrice)}
                                                </td>
                                                <td>
                                                    {checkEmpty(convertToUpperCase(item.prdType))}
                                                </td>
                                                <td>
                                                    <span className={`${item.ltpClass}`}>{checkEmpty(item.ltp)}</span>
                                                </td>
                                                <td className={`${getColorCode(item.daypnl)}`}>
                                                    {checkEmpty(item.daypnl)}
                                                </td>
                                                <td className={`${getColorCode(item.pnl)}`}>
                                                    {checkEmpty(item.pnl)}
                                                </td>
                                                <td className="width4">
                                                    {
                                                        selectedShowMoreIndex === index ?
                                                            <UpArrowIcon className="showMoreIcon cursor"
                                                                onClick={() => showMoreDetails('')}
                                                            />
                                                            :
                                                            <DownArrowIcon className="showMoreIcon cursor"
                                                                onClick={() => showMoreDetails(index)}
                                                            />
                                                    }
                                                </td>
                                            </tr>
                                            {
                                                selectedShowMoreIndex === index ?
                                                    <div className={`moreDetails ${JSON.parse(item.netQty) == 0 ?
                                                        "zeroNetQty" : ""}`}>
                                                        {/* <button onClick={() => gotoChartPopup(item)}>
                                                        {console.log('itemMore :', item)}
                                                        {
                                                            props.selectedTheme.theme === THEMES.LIGHT ?
                                                                <img
                                                                    src="assets/images/dashboard/line_chart.svg"
                                                                    alt="" />
                                                                :
                                                                <img
                                                                    src="assets/images/dark/dashboard/line_chart.svg"
                                                                    alt="" />
                                                        }

                                                        <LangText module="BUTTONS" name="CHART" />
                                                    </button> */}
                                                        {JSON.parse(item.netQty) != 0 ?
                                                            (JSON.parse(item.isSquareoff) ?
                                                                <button onClick={() =>
                                                                    onClickTrade(item, ORDER_MODIFY_TYPE.SQUARE_OFF)}>
                                                                    {props.selectedTheme.theme === THEMES.LIGHT ?
                                                                        <img
                                                                            src="assets/images/dashboard/trade_ico.svg"
                                                                            alt="" />
                                                                        :
                                                                        <img
                                                                            src="assets/images/dark/dashboard/trade_ico.svg"
                                                                            alt=""
                                                                        />
                                                                    }
                                                                    <LangText module="BUTTONS"
                                                                        name="EXIT"
                                                                        orientation={TEXT_ORIENTATION.UPPERCASE} />
                                                                </button>
                                                                :
                                                                <button onClick={() =>
                                                                    onClickTrade(item, ORDER_MODIFY_TYPE.NEW_ORDER)}>
                                                                    {props.selectedTheme.theme === THEMES.LIGHT ?
                                                                        <img
                                                                            src="assets/images/dashboard/trade_ico.svg"
                                                                            alt="" />
                                                                        :
                                                                        <img
                                                                            src="assets/images/dark/dashboard/trade_ico.svg"
                                                                            alt=""
                                                                        />
                                                                    }
                                                                    <LangText module="BUTTONS" name="EXIT"
                                                                        orientation={TEXT_ORIENTATION.UPPERCASE} />
                                                                </button>) : null
                                                        }
                                                        {
                                                            JSON.parse(item.transferable) ?
                                                                <button onClick={() =>
                                                                    onClickConvert(item, ORDER_DIALOGS.CONVERT)}>
                                                                    {props.selectedTheme.theme === THEMES.LIGHT ?
                                                                        <img
                                                                            src="assets/images/dashboard/convert.svg"
                                                                            alt=""
                                                                        />
                                                                        :
                                                                        <img
                                                                            src="assets/images/dark/dashboard/convert.svg"
                                                                            alt=""
                                                                        />
                                                                    }

                                                                    <LangText module="BUTTONS" name="CONVERT" />
                                                                </button>
                                                                : null
                                                        }
                                                        {JSON.parse(item.netQty) != 0 ?
                                                            <button className="stopLoss-btn"
                                                                onClick={() => onClickStopLossAction(item)}>
                                                                {props.selectedTheme.theme === THEMES.LIGHT ?
                                                                    <img
                                                                        src="assets/images/dashboard/stoploss.svg"
                                                                        alt=""
                                                                    />
                                                                    :
                                                                    <img
                                                                        src="assets/images/dark/dashboard/stoploss.svg"
                                                                        alt=""
                                                                    />
                                                                }
                                                                <LangText name="STOP LOSS" />
                                                            </button> : null}

                                                        <button
                                                            onClick={() => onClickBuySellMoreAction(item)}>
                                                            {props.selectedTheme.theme === THEMES.LIGHT ?
                                                                <img
                                                                    src="assets/images/dashboard/add_more.svg"
                                                                    alt=""
                                                                />
                                                                :
                                                                <img
                                                                    src="assets/images/dark/dashboard/add_more.svg"
                                                                    alt=""
                                                                />
                                                            }

                                                            <LangText name="ADD_MORE" />

                                                        </button>
                                                        <button onClick={() =>
                                                            gotoOrderDialogCB(item, ORDER_DIALOGS.NETPOSITION_DETAILS)}>
                                                            {props.selectedTheme.theme === THEMES.LIGHT ?
                                                                <img
                                                                    src="assets/images/dashboard/details_ico.svg"
                                                                    alt=""
                                                                />
                                                                :
                                                                <img
                                                                    src="assets/images/dark/dashboard/details_ico.svg"
                                                                    alt=""
                                                                />
                                                            }
                                                            <LangText module="BUTTONS" name="DETAILS"
                                                                orientation={TEXT_ORIENTATION.UPPERCASE} />
                                                        </button>

                                                    </div>
                                                    : null
                                            }
                                        </>
                                    )
                                })
                                :
                                <tr className="errorRow">
                                    <td className="colspan">
                                        {props.errorMsg ? props.errorMsg : ""}
                                    </td>
                                </tr>
                        }
                    </tbody >
                    {
                        (squareOff && originalSymArray.length) ?
                            <tfoot className="squareoffAll">
                                <tr>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="cancel"
                                                onClick={() => cancelmutilpleSquareOff()}>
                                                <LangText module="BUTTONS" name="CANCEL_IN_NETPOSN" /></button>
                                            <button className="squareof theme-btn"
                                                disabled={disableSquareOff}
                                                onClick={() => getConfirmSquareOff()}>
                                                <LangText module="BUTTONS" name="SQUAREOFF_IN_NETPOSN" /> </button>
                                        </div>
                                    </td>
                                </tr></tfoot>
                            : ""
                    }

                </table >
            </div >
        </>
    )
}

const mapStateToProps = ({ dashboard, settings, profileDialog }) => {
    return {
        selectedWidgetMode: dashboard.selectedWidgetMode,
        selectedTheme: settings.selectedTheme,
        profileData: profileDialog.profileDetails,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) },
        storeNetpositionsortData: (s) => { dispatch(storeNetpositionsortData(s)) },
        storeModifyOrderDetails: (s) => { dispatch(storeModifyOrderDetails(s)) },
        storeOrderFieldValues: (s) => { dispatch(storeOrderFieldValues(s)) },
        storeOrderpadSelectedSym: (s) => { dispatch(storeOrderpadSelectedSym(s)) },
        storeOrderPadDialogDetails: (s) => { dispatch(storeOrderPadDialogDetails(s)) },
        storeOrderDialogDetails: (s) => { dispatch(storeOrderDialogDetails(s)) },
        storeSquareoffNetPosition: (s) => { dispatch(storeSquareoffNetPosition(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NetPositionsTableComponent);