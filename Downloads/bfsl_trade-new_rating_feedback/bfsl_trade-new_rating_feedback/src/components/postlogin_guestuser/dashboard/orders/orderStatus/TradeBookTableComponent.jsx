import React, { useEffect, useState, useRef } from 'react'
import { withStreaming } from '../../../../../index'
import { connect } from 'react-redux';

import LangText from '../../../../../common/lang/LangText';

import {
    applyPaint, cacheSearch, checkEmpty, convertToUpperCase, getDispSymbolName,
    isBuyTradeAction, isSellTradeAction, sortByInt, sortByString, sortFlagFunc
} from '../../../../../common/CommonMethods';
import { CommonErrorMessages } from '../../../../../common/Messages';
import { DownArrowIcon, SortIcon, UpArrowIcon } from '../../../../common/FontIcons';
import { gotoChartPopup, gotoQuote, gotoTrade } from '../../../../../common/Bridge';
import {
    STREAMING_MODULES, STREAMING_KEYS, SORT_TYPES,
    SORT_DATATYPE, ORDER_TYPES, THEMES
} from '../../../../../common/Constants';

function TradeBookTableComponent(props) {

    const [selectedShowMoreIndex, setSelectedShowMoreIndex] = useState(null)
    const [tradeBookList, setTradeBookList] = useState([])
    const [filterTradeList, setFilterTradeList] = useState([])
    const [streamingResp, setStreamingResp] = useState(null)
    const [sortFlag, setSortFlag] = useState(
        [
            { column: "exchTrdId", sortAsc: null },
            { column: "prdType", sortAsc: null },
            { column: "tradedPrice", sortAsc: null },
            { column: "ltp", sortAsc: null },
            { column: "qty", sortAsc: null }

        ]
    )
    const [sortAsc, setSortAsc] = useState(true)
    // const [selectedSym, setSelectedSym] = useState({})
    const isSorting = useRef(false)

    useEffect(() => {
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.TRADEBOOK);
    }, [])

    useEffect(() => {
        resetSortIcons()
        let list = Object.assign([], tradeBookList)
        if (props.searchValue) {
            list = list.map(item => {
                item.queryString = getDispSymbolName(item).primaryName + ' ' + item.sym.exc
                item.queryString2 = getDispSymbolName(item).secondaryName + ' ' + item.sym.exc
                return item
            })
            let filteredList = cacheSearch(props.searchValue.trim(), list, "queryString", "queryString2")
            setFilterTradeList(filteredList)
        }
        else {
            setFilterTradeList(list)
        }
    }, [tradeBookList, props.searchValue])

    useEffect(() => {
        if (streamingResp && streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    useEffect(() => {
        setTradeBookList(props.list)
        setSelectedShowMoreIndex(null)
        streamingSubscription(props.list)
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
        let newList = filterTradeList.map(row => {
            if (row.sym.streamSym === data.symbol) {
                row = Object.assign({}, row, applyPaint(row, data));
            }
            return row;
        })
        setFilterTradeList(newList)
    }

    function showMoreDetails(index) {
        if (index === selectedShowMoreIndex)
            setSelectedShowMoreIndex(null)
        else
            setSelectedShowMoreIndex(index)
    }

    function gotoQuoteView(item, fullView = false) {
        gotoQuote(item, fullView)
    }
    function onSortCB(type, key1, sortType, symArray) {
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
        setFilterTradeList(sortedSymList)
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
        setFilterTradeList(sortedSymList)
        // if (sortedSymList.length)
        //     setSelectedSym(sortedSymList[0])

        if (symArray && symArray.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1)
            setSortFlag(updatedSortFlag)
        }

    }
    function onSort(type, key1) {
        isSorting.current = true
        onSortCB && onSortCB(type, key1, null, filterTradeList)
    }
    function getSortIconCB(column) {
        let sortOrder = sortFlag.filter((item) => item.column === column)
        if (sortOrder.length)
            return sortOrder[0].sortAsc
        return null
    }
    function onIconSort(type, key, sortType) {
        onSort && onSort(type, key, sortType, filterTradeList)
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
        <div className="orderTable-base tradeBook-table">
            <table className="order-table orderbookTable">
                <thead className="thead-scroller">
                    <tr>
                        <th className={`firstChild width28`}>
                            <span className=""
                            // onClick={() => onSort(SORT_DATATYPE.STRING, 'dispSym')}
                            >
                                <LangText module="TABLE_HEADERS" name="SYMBOL" />
                            </span>
                            {/* <SortIcon colName="dispSym"  /> */}
                        </th>
                        <th className="">
                            <span className="cursor"
                                onClick={() => onSort(SORT_DATATYPE.STRING, 'prdType')}
                            >
                                <LangText module="TABLE_HEADERS" name="PRODUCT" />
                            </span>
                            <SortIcon colName="prdType" getSortIcon={getSortIconCB}
                                type={SORT_DATATYPE.STRING} onIconSort={onIconSort} />
                        </th>
                        <th className="">
                            <span className="cursor"
                                onClick={() => onSort(SORT_DATATYPE.INT, 'qty')}
                            >
                                <LangText module="TABLE_HEADERS" name="QTY_TRADES" />
                            </span>
                            <SortIcon colName="qty" getSortIcon={getSortIconCB}
                                type={SORT_DATATYPE.INT} onIconSort={onIconSort} />
                        </th>
                        <th className="">
                            <span className="cursor"
                                onClick={() => onSort(SORT_DATATYPE.INT, 'tradedPrice')}
                            >
                                <LangText module="TABLE_HEADERS" name="AVG_PRICE" />
                            </span>
                            <SortIcon colName="tradedPrice" getSortIcon={getSortIconCB}
                                type={SORT_DATATYPE.INT} onIconSort={onIconSort} />
                        </th>
                        <th className="">
                            <span className="cursor"
                                onClick={() => onSort(SORT_DATATYPE.INT, 'ltp')}
                            >
                                <LangText module="TABLE_HEADERS" name="LTP" />
                            </span>
                            <SortIcon colName="ltp" getSortIcon={getSortIconCB}
                                type={SORT_DATATYPE.INT} onIconSort={onIconSort} />
                        </th>
                        <th className="width20">
                            <span className="cursor"
                                onClick={() => onSort(SORT_DATATYPE.INT, 'exchTrdId')}
                            >
                                <LangText module="TABLE_HEADERS" name="TRADE_ID" />
                            </span>
                            <SortIcon colName="exchTrdId" getSortIcon={getSortIconCB}
                                type={SORT_DATATYPE.INT} onIconSort={onIconSort} />
                        </th>
                        <th className="width4">

                        </th>
                    </tr>
                </thead>
                <tbody className="tbody-scroller scroller_firefox">
                    {
                        filterTradeList.length ?
                            filterTradeList.map((item, index) => {
                                return (
                                    <>
                                        <tr className={selectedShowMoreIndex === index ? 'noBorder' : ''}>
                                            <td className="firstChild width28">
                                                <div className="symName-column">
                                                    <div className="primary">
                                                        <div className="baseSym primary-symName text-nowrap"
                                                            title={getDispSymbolName(item).primaryName}
                                                        >
                                                            <span className={`ordAction
                                                             ${isBuyTradeAction(item.ordAction)
                                        ? "buy-clr" : isSellTradeAction(item.ordAction) ? "sell-clr" : "text-color"}`}>
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
                                                {checkEmpty(item.prdType)}
                                            </td>
                                            <td>
                                                {checkEmpty(item.qty)} ({checkEmpty(item.tradedQty)})
                                            </td>
                                            <td>
                                                <span>{checkEmpty(item.tradedPrice)}</span>
                                            </td>
                                            <td>
                                                <span className={`${item.ltpClass}`}>{checkEmpty(item.ltp)}</span>
                                            </td>
                                            <td className="width20">
                                                <div className="orderId_time">
                                                    <span>{checkEmpty(item.exchTrdId)}</span>
                                                    <span className="time">{checkEmpty(item.tradeTime)}</span>
                                                </div>
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
                                                <div className="moreDetails">
                                                    <button onClick={() => gotoChartPopup(item)}>
                                                        {
                                                            props.selectedTheme.theme === THEMES.LIGHT ?
                                                                <img src="assets/images/dashboard/line_chart.svg" 
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
                                                    <button onClick={() => gotoQuoteView(item, true)}>
                                                        {
                                                            props.selectedTheme.theme === THEMES.LIGHT ?
                                                                <img src="assets/images/dashboard/quote.svg" alt="" />
                                                                :
                                                                <img
                                                                    src="assets/images/dark/dashboard/quote.svg"
                                                                    alt="" />
                                                        }
                                                        <LangText module="BUTTONS" name="QUOTE" />
                                                    </button>
                                                    <button onClick={() => gotoTrade(item, ORDER_TYPES.BUY)}>
                                                        {
                                                            props.selectedTheme.theme === THEMES.LIGHT ?
                                                                <img src="assets/images/dashboard/trade_ico.svg" 
                                                                    alt="" />
                                                                :
                                                                <img src="assets/images/dark/dashboard/trade_ico.svg" 
                                                                    alt="" />
                                                        }
                                                        <LangText module="BUTTONS" name="TRADE" />
                                                    </button>
                                                    {/* <button>
                                                        <img src="assets/images/dashboard/details_ico.svg" alt="" />
                                                        <LangText module="BUTTONS" name="DETAILS" />
                                                    </button> */}
                                                </div>
                                                : null
                                        }
                                    </>
                                )
                            })
                            :
                            <tr className="errorRow">
                                <td className="colspan">
                                    {props.errorMsg ? props.errorMsg : (!props.pendingReq ? 
                                        CommonErrorMessages.NO_DATA_AVAIL : '')}
                                </td>
                            </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme
    }
}
export default connect(mapStateToProps, null)(withStreaming(TradeBookTableComponent));