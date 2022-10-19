import React, { useEffect, useState, useRef } from 'react'
import { connect } from "react-redux";
import { withStreaming } from '../../../../../index'

import LangText from '../../../../../common/lang/LangText';

import {
    storeModifyOrderDetails, storeOrderFieldValues,
    storeOrderPadDialogDetails, storeOrderpadSelectedSym
} from '../../../../../state/actions/Actions';

import {
    applyPaint, checkEmpty, convertToUpperCase, getDispSymbolName, getOrderStatusClass,
    isBuyTradeAction, isCO_BO_Order, isSellTradeAction, replaceComma, sortByInt, sortByString, sortFlagFunc
} from '../../../../../common/CommonMethods';
import { CommonErrorMessages } from '../../../../../common/Messages';
import { DownArrowIcon, InfoIcon, SortIcon, UpArrowIcon } from '../../../../common/FontIcons';
import { gotoChartPopup, gotoOrderDialog, gotoQuote, gotoTrade } from '../../../../../common/Bridge';
import {
    ORDER_DIALOGS, STREAMING_MODULES, STREAMING_KEYS, ORDER_STATUS,
    TEXT_ORIENTATION, ORDERPAD_FIIELD_KEYS, ORDER_MODIFY_TYPE,
    ORDER_TYPES, ORDERPAD_DIALOGS, SORT_TYPES, SORT_DATATYPE,
    TRADE_ORDER_TYPES, THEMES
} from '../../../../../common/Constants';

function OrderBookTableComponent(props) {

    const [selectedShowMoreIndex, setSelectedShowMoreIndex] = useState(null)
    const [orderBookList, setOrderBookList] = useState([])
    const [showRejectReasonIndex, setShowRejectReasonIndex] = useState(null)
    const [streamingResp, setStreamingResp] = useState(null)
    const [sortFlag, setSortFlag] = useState(
        [
            { column: "status", sortAsc: null },
            { column: "prdType", sortAsc: null },
            { column: "limitPrice", sortAsc: null },
            { column: "ltp", sortAsc: null },
            { column: "qty", sortAsc: null }

        ]
    )
    const [sortAsc, setSortAsc] = useState(true)
    // const [selectedSym, setSelectedSym] = useState({})
    const isSorting = useRef(false)

    useEffect(() => {
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.ORDERBOOK);
    }, [])

    useEffect(() => {
        if (streamingResp && streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    useEffect(() => {
        setOrderBookList(props.list)
        setSelectedShowMoreIndex(null)
        streamingSubscription(props.list)
        setShowRejectReasonIndex(null)
        resetSortIcons()
    }, [props.list])

    useEffect(() => {
        setOrderBookList(props.list);
    }, [props.list])

    function streamingSubscription(symArrayList) {
        let symbols = symArrayList.map(l => l.sym)
        props.forceSubscribeLevel1(symbols, [STREAMING_KEYS.LTP, STREAMING_KEYS.CHANGE, STREAMING_KEYS.CHANGE_PER])
    }

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function setStreamingResptoSymbols(resp) {
        let { data } = resp;
        let newList = orderBookList.map(row => {
            if (row.sym.streamSym === data.symbol) {
                row = Object.assign({}, row, applyPaint(row, data));
            }
            return row;
        })
        setOrderBookList(newList)
    }

    function showMoreDetails(index) {
        if (index === selectedShowMoreIndex)
            setSelectedShowMoreIndex(null)
        else
            setSelectedShowMoreIndex(index)
        setShowRejectReasonIndex(null)
    }

    function gotoQuoteView(item, fullView = false) {
        gotoQuote(item, fullView)
        setSelectedShowMoreIndex(null)
        setShowRejectReasonIndex(null)
    }

    function gotoOrderDialogCB(data, dialog, parentCB = null) {
        gotoOrderDialog(data, dialog, parentCB)
        setSelectedShowMoreIndex(null)
        setShowRejectReasonIndex(null)
    }

    function reGetOrderBook() {
        props.regetOrderBookCB()
    }

    function onClickModifyOrder(dataItem, type) {
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
            symDetails: dataItem
        })
        if (values[ORDERPAD_FIIELD_KEYS.ORDER_TYPE]) {
            values[ORDERPAD_FIIELD_KEYS.ORDER_TYPE] = convertToUpperCase(values[ORDERPAD_FIIELD_KEYS.ORDER_TYPE])
        }
        props.storeOrderFieldValues(values)
        props.storeOrderpadSelectedSym(symObj)
        let ordActionType = dataItem.ordAction;
        if (type === ORDER_MODIFY_TYPE.SQUARE_OFF) {
            if (ordActionType) {
                if (isBuyTradeAction(ordActionType))
                    ordActionType = ORDER_TYPES.SELL
                else if (isSellTradeAction(ordActionType))
                    ordActionType = ORDER_TYPES.BUY
            }
        }
        props.storeOrderPadDialogDetails({
            dialogName: ORDERPAD_DIALOGS.ORDER_PAD,
            trade_type: convertToUpperCase(ordActionType)
        })

        setSelectedShowMoreIndex(null)
    }
    function onSortCB(type, key1, sortType, symArray) {
        setShowRejectReasonIndex(null)
        if (type === "string")
            onSortByStringCB(key1, sortType, symArray)
        else
            onSortByIntCB(key1, sortType, symArray)
    }
    function onSortByIntCB(key1, sortType, symArray) {
        let ascSort = sortAsc
        if (sortType) {
            if (sortType === SORT_TYPES.ASC) {
                setSortAsc(true)
                ascSort = true
            }
            else {
                setSortAsc(false)
                ascSort = false
            }
        } else
            setSortAsc(!sortAsc)

        let sortedSymList = sortByInt(ascSort, symArray, key1)
        setOrderBookList(sortedSymList)
        // if (sortedSymList.length)
        //     setSelectedSym(sortedSymList[0])

        if (symArray && symArray.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1)
            setSortFlag(updatedSortFlag)
        }
    }
    function onSortByStringCB(key1, sortType, symArray) {
        let ascSort = sortAsc
        if (sortType) {
            if (sortType === SORT_TYPES.ASC) {
                setSortAsc(true)
                ascSort = true
            }
            else {
                setSortAsc(false)
                ascSort = false
            }
        } else
            setSortAsc(!sortAsc)

        let sortedSymList = sortByString(ascSort, symArray, key1)
        setOrderBookList(sortedSymList)
        // if (sortedSymList.length)
        //     setSelectedSym(sortedSymList[0])

        if (symArray && symArray.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1)
            setSortFlag(updatedSortFlag)
        }

    }
    function onSort(type, key1) {
        isSorting.current = true
        onSortCB(type, key1, null, orderBookList)
    }
    function getSortIconCB(column) {
        let sortOrder = sortFlag.filter((item) => item.column === column)
        if (sortOrder.length)
            return sortOrder[0].sortAsc
        return null
    }
    function onIconSort(type, key, sortType) {
        onSortCB(type, key, sortType, orderBookList)
    }

    function onClickReason(index) {
        if (index === showRejectReasonIndex)
            setShowRejectReasonIndex(null)
        else
            setShowRejectReasonIndex(index)
    }

    function resetSortIcons() {
        let flags = Object.assign([], sortFlag)
        let updatedFlags = flags.map((item) => {
            item.sortAsc = null
            return item
        })
        setSortFlag(updatedFlags)
    }

    return (
        <div className="orderTable-base orderBook-table">
            <table className="order-table orderbookTable">
                <thead className="thead-scroller">
                    <tr><th className={`firstChild width27`}>
                        <span className=""
                            onClick={() => onSort(SORT_DATATYPE.STRING, 'dispSym')}
                        >
                            <LangText module="TABLE_HEADERS" name="SYMBOL" />
                        </span>
                        {/* <SortIcon colName="dispSym" getSortIcon={getSortIconCB} type={SORT_DATATYPE.STRING} /> */}
                    </th>
                    <th className="width18">
                        <span className="cursor"
                            onClick={() => onSort(SORT_DATATYPE.STRING, 'status')}
                        >
                            <LangText module="TABLE_HEADERS" name="STATUS" />
                        </span>
                        <SortIcon colName="status" getSortIcon={getSortIconCB}
                            type={SORT_DATATYPE.STRING} onIconSort={onIconSort} />
                    </th>
                    <th className="">
                        <span className="cursor"
                            onClick={() => onSort(SORT_DATATYPE.STRING, 'prdType')}
                        >
                            <LangText module="TABLE_HEADERS" name="PRODUCT" />
                        </span>
                        <SortIcon colName="prdType"
                            getSortIcon={getSortIconCB}
                            type={SORT_DATATYPE.STRING}
                            onIconSort={onIconSort} />
                    </th>
                    <th className="">
                        <span className="cursor"
                            onClick={() => onSort(SORT_DATATYPE.INT, 'limitPrice')}
                        >
                            <LangText module="TABLE_HEADERS" name="PRICE" />
                        </span>
                        <SortIcon colName="limitPrice"
                            getSortIcon={getSortIconCB}
                            type={SORT_DATATYPE.INT}
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
                            onClick={() => onSort(SORT_DATATYPE.INT, 'qty')}
                        >
                            <LangText module="TABLE_HEADERS" name="QTY" orientation={TEXT_ORIENTATION.UPPERCASE}/>
                        </span>
                        <SortIcon colName="qty"
                            getSortIcon={getSortIconCB}
                            type={SORT_DATATYPE.INT}
                            onIconSort={onIconSort} />
                    </th>
                    <th className="width4">

                    </th>
                    </tr>
                </thead>
                <tbody className="tbody-scroller scroller_firefox">
                    {orderBookList.length ?
                        orderBookList.map((item, index) => {
                            return (
                                <>
                                    <tr className={`${selectedShowMoreIndex === index ? 'noBorder' : ''} `}>
                                        <td className="firstChild width27">
                                            <div className="symName-column">
                                                <div className="primary">
                                                    <div className="baseSym primary-symName text-nowrap"
                                                        title={getDispSymbolName(item).primaryName}
                                                        onClick={() => gotoOrderDialogCB(item,
                                                            ORDER_DIALOGS.ORDERBOOK_DETAILS, onClickModifyOrder)}
                                                    >
                                                        <span className={`ordAction 
                                                            ${isBuyTradeAction(item.ordAction)
                                    ? "buy-clr" : isSellTradeAction(item.ordAction)
                                        ? "sell-clr" : "text-color"}`}>
                                                            {checkEmpty(convertToUpperCase(item.ordAction))}
                                                        </span>
                                                        <span className="quote-click">
                                                            {getDispSymbolName(item).primaryName}
                                                        </span>
                                                    </div>
                                                    <span className="exc">
                                                        {item.sym.exc}
                                                        {
                                                            isCO_BO_Order(item.prdType) ?
                                                                <span className="pTypeVal">{item.prdType}</span>
                                                                : null
                                                        }
                                                        {
                                                            item.isAmo ?
                                                                <span className="pTypeVal buy-clr">
                                                                    <LangText module="ORDERBOOK_MSGS" name="AMO" />
                                                                </span>
                                                                : null
                                                        }
                                                    </span>
                                                </div>
                                                <div className="symName text-nowrap">
                                                    <span title={getDispSymbolName(item).secondaryName}>
                                                        {getDispSymbolName(item).secondaryName}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`width18 ${getOrderStatusClass(item.status)}`}>
                                            <div className="rejectReasonDiv">
                                                <span>{checkEmpty(convertToUpperCase(item.status))}</span>
                                                {item.status === ORDER_STATUS.REJECTED ?
                                                    <div className="tooltip-div">
                                                        <div className={`tooltip-container bottom
                                                                 ${showRejectReasonIndex === index ? "show" : "hide"}`}>
                                                            {item.rejReason}
                                                            <span className="triangle"></span>
                                                        </div>
                                                        <InfoIcon className="cursor flex-center"
                                                            onClick={() => onClickReason(index)} />
                                                    </div>
                                                    : null
                                                }
                                            </div>
                                        </td>
                                        <td>
                                            {checkEmpty(convertToUpperCase(item.prdType))}
                                        </td>
                                        <td>
                                            <span>{convertToUpperCase(item.ordType) ===
                                                    TRADE_ORDER_TYPES.MARKET ? checkEmpty(item.avgPrice) :
                                                checkEmpty(item.limitPrice)}</span>
                                        </td>
                                        <td>
                                            <span className={`${item.ltpClass}`}>{checkEmpty(item.ltp)}</span>
                                        </td>
                                        <td>
                                            {checkEmpty(item.tradedQty)}/{checkEmpty(item.qty)}
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
                                    {selectedShowMoreIndex === index ?
                                        <div className="moreDetails">
                                            <button onClick={() => gotoChartPopup(item)}>
                                                {props.selectedTheme.theme === THEMES.LIGHT ?
                                                    <img
                                                        src="assets/images/dashboard/line_chart.svg"
                                                        alt=""
                                                    />
                                                    :
                                                    <img 
                                                        src="assets/images/dark/dashboard/line_chart.svg" 
                                                        alt="" 
                                                    />
                                                }
                                                <LangText module="BUTTONS" name="CHART" />
                                            </button>
                                            {/* <button>
                                                        <img src="assets/images/dashboard/set_alert.svg" alt="" />
                                                        <LangText module="BUTTONS" name="SET_ALERT" />
                                                    </button>
                                                    <button>
                                                        <img src="assets/images/dashboard/small_case.svg" alt="" />
                                                        <LangText module="BUTTONS" name="SMALL_CASE" />
                                                    </button>
                                                    <button>
                                                        <img src="assets/images/dashboard/streak.svg" alt="" />
                                                        <LangText module="BUTTONS" name="STREAK" />
                                                    </button> */}
                                            {(item.status === ORDER_STATUS.PENDING ||
                                                            item.status === ORDER_STATUS.TRIGGER_PENDING) ?
                                                <>{ JSON.parse(item.cancellable) ?
                                                    <button className="lg"
                                                        onClick={() => gotoOrderDialogCB(item,
                                                            ORDER_DIALOGS.PENDING_D_CANCEL_ORDER,
                                                            reGetOrderBook)}>
                                                        {props.selectedTheme.theme ===
                                                                                    THEMES.LIGHT ?
                                                            <img src=
                                                                "assets/images/dashboard/cancelorder_ico.svg"
                                                            alt="" 
                                                            />
                                                            :
                                                            <img src=
                                                                "assets/images/dark/dashboard/cancelorder_ico.svg"
                                                            alt="" />
                                                        }
                                                        <LangText module="BUTTONS"
                                                            name="CANCEL_ORDERS" />
                                                    </button>
                                                    :
                                                    (JSON.parse(item.exitable) ?
                                                        <button onClick={() =>
                                                            gotoOrderDialogCB(item,
                                                                ORDER_DIALOGS.EXIT_ORDER,
                                                                reGetOrderBook)}>
                                                            {props.selectedTheme.theme ===THEMES.LIGHT ?
                                                                <img src=
                                                                    "assets/images/dashboard/cancelorder_ico.svg"
                                                                alt="" />
                                                                :
                                                                <img src=
                                                                    "assets/images/dark/dashboard/cancelorder_ico.svg"
                                                                alt="" />
                                                            }
                                                            <LangText module="BUTTONS"
                                                                name="EXIT_ORDER" />
                                                        </button>
                                                        : null
                                                    )
                                                }
                                                </>
                                                :
                                                <button onClick={() => gotoQuoteView(item, true)}>
                                                    {
                                                        props.selectedTheme.theme === THEMES.LIGHT ?
                                                            <img src="assets/images/dashboard/quote.svg" alt="" />
                                                            :
                                                            <img src="assets/images/dark/dashboard/quote.svg"
                                                                alt="" />
                                                    }
                                                    <LangText module="BUTTONS" name="QUOTE" />
                                                </button>
                                            }
                                            {item.status === ORDER_STATUS.REJECTED ?
                                                <button onClick={() =>
                                                    onClickModifyOrder(item, ORDER_MODIFY_TYPE.RE_ORDER)}>
                                                    {
                                                        props.selectedTheme.theme === THEMES.LIGHT ?
                                                            <img src="assets/images/dashboard/retry_ico.svg" 
                                                                alt="" /> :
                                                            <img 
                                                                src="assets/images/dark/dashboard/retry_ico.svg" 
                                                                alt="" />
                                                    }
                                                    <LangText module="BUTTONS" name="RETRY" />
                                                </button>
                                                :
                                                ((item.status === ORDER_STATUS.PENDING 
                                                                    || item.status === ORDER_STATUS.TRIGGER_PENDING) ?
                                                    <button
                                                        onClick={() =>
                                                            onClickModifyOrder(item, 
                                                                ORDER_MODIFY_TYPE.MODIFY)}
                                                        disabled={!(JSON.parse(item.modifiable))}>
                                                        { props.selectedTheme.theme === THEMES.LIGHT ?
                                                            <img 
                                                                src="assets/images/dashboard/modify_ico.svg"
                                                                alt="" /> :
                                                            <img
                                                                src="assets/images/dark/dashboard/modify_ico.svg"
                                                                alt="" />
                                                        }

                                                        <LangText module="BUTTONS"
                                                            name="MODIFY"
                                                            orientation={TEXT_ORIENTATION.LOWERCASE} />
                                                    </button>
                                                    :
                                                    <button onClick={() => 
                                                        gotoTrade(item, ORDER_TYPES.BUY)}>
                                                        {props.selectedTheme.theme === THEMES.LIGHT ?
                                                            <img src="assets/images/dashboard/trade_ico.svg"
                                                                alt="" />
                                                            :
                                                            <img 
                                                                src="assets/images/dark/dashboard/trade_ico.svg"
                                                                alt="" />
                                                        }
                                                        <LangText module="BUTTONS" name="TRADE" />
                                                    </button>
                                                )
                                            }
                                            <button onClick={() =>
                                                gotoOrderDialogCB(item, ORDER_DIALOGS.ORDERBOOK_DETAILS, 
                                                    onClickModifyOrder)}>
                                                {
                                                    props.selectedTheme.theme === THEMES.LIGHT ?
                                                        <img src="assets/images/dashboard/details_ico.svg" alt="" />
                                                        :
                                                        <img
                                                            src="assets/images/dark/dashboard/details_ico.svg" 
                                                            alt="" />
                                                }
                                                <LangText module="BUTTONS" name="DETAILS" />
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
                                {props.errorMsg ? props.errorMsg :
                                    (!props.pendingReq ? CommonErrorMessages.NO_DATA_AVAIL : '')}
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div >
    )
}

const mapStateToProps = ({ dashboard, settings }) => {
    return {
        selectedWidgetMode: dashboard.selectedWidgetMode,
        selectedTheme: settings.selectedTheme
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeModifyOrderDetails: (s) => { dispatch(storeModifyOrderDetails(s)) },
        storeOrderFieldValues: (s) => { dispatch(storeOrderFieldValues(s)) },
        storeOrderpadSelectedSym: (s) => { dispatch(storeOrderpadSelectedSym(s)) },
        storeOrderPadDialogDetails: (s) => { dispatch(storeOrderPadDialogDetails(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStreaming(OrderBookTableComponent));