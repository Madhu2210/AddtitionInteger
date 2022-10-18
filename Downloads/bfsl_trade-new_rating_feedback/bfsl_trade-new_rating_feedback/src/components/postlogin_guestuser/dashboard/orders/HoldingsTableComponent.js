import React, { useEffect, useState, useMemo } from 'react'
import { connect } from "react-redux";
import { withStreaming } from '../../../../index'

import LangText from '../../../../common/lang/LangText';
import { LazyLoading } from '../../../common/LazyLoadingHOC'

import {
    storeModifyOrderDetails, storeOrderFieldValues, storeOrderPadDialogDetails,
    storeOrderpadSelectedSym, storeSelectedDashboardWidget, storeHoldingsortData, storeHoldingsGuestAlertMsg
} from '../../../../state/actions/Actions';
import { gotoChartPopup, gotoQuote, gotoTrade } from '../../../../common/Bridge';
import {
    applyPaint,
    calculateDayspnl,
    calculatePNL,
    calculatePNLPer,
    calculatePortfolioValue,
    checkEmpty, convertCommaSeparated, formSymBlock,
    getColorCode, getDecimal_Precision, getDispSymbolName, replaceComma,
    scrollToTop,
    sortByInt, sortByString, sortFlagFunc
} from '../../../../common/CommonMethods';
import { DownArrowIcon, MaximizeIcon, MinimizeIcon, SortIcon, UpArrowIcon } from '../../../common/FontIcons';
import {
    DASHBOARD_WIDGET_MODE, ORDER_TYPES, ORDERPAD_FIIELD_KEYS, ORDERPAD_DIALOGS,
    ORDER_MODIFY_TYPE, TEXT_ORIENTATION, SORT_DATATYPE, SORT_TYPES, THEMES,
    STREAMING_KEYS, STREAMING_MODULES
} from '../../../../common/Constants';

function HoldingsTableComponent(props) {

    const [selectedShowMoreIndex, setSelectedShowMoreIndex] = useState(null)
    const [showMore, setShowMore] = useState(false)
    const [streamingResp, setStreamingResp] = useState(null)
    const [symbolList, setSymbolList] = useState([])
    const [streamSymbolList, setStreamSymbolList] = useState([])
    const [sortFlag, setSortFlag] = useState(
        [
            { column: "qty", sortAsc: null },
            { column: "ltp", sortAsc: null },
            { column: "chng", sortAsc: null },
            { column: "avgPrice", sortAsc: null },
            { column: "invested", sortAsc: null },
            { column: "portfolioValue", sortAsc: null },
            { column: "pnl", sortAsc: null },
            { column: "dayspnl", sortAsc: null },

        ]
    )
    const [sortAsc, setSortAsc] = useState(true)
    // const isSorting = useRef(false)

    useEffect(() => {
        props.setDisableLazyLoad(true)
        props.setElementRowHeight(65)
        props.setScrollRef(document.getElementById('holdingsTable'))
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.HOLDINGS_TABLE);
        scrollToTop();
        props.storeHoldingsGuestAlertMsg(false)
    }, [])

    useEffect(() => {
        if (streamingResp && streamingResp !== {})
            setStreamingResptoSymbolsList(streamingResp)
    }, [streamingResp])

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
        setHoldingsData(Object.assign([], props.list));
    }, [props.list])

    useEffect(() => {
        if (props.sortColumnList && props.sortColumnList.length)
            setSortFlag(props.sortColumnList)
    }, [props.sortColumnList])

    useEffect(() => {
        if (props.visibleList && props.visibleList.length && streamSymbolList.length) {
            streamSymbolList.map((item) => {
                let isSymVisible = props.visibleList.findIndex((i) => {
                    return i.sym.streamSym === item.sym.streamSym
                })
                if (isSymVisible !== -1) {
                    let newList = symbolList.map(row => {
                      
                        if (row.sym.streamSym === item.sym.streamSym) {
                            // row = Object.assign({}, row, item);
                            row.pnl = item.pnl
                            row.pnlPer = item.pnlPer
                            row.portfolioValue = item.portfolioValue
                            row.dayspnl = item.dayspnl
                            row.ltp = item.ltp
                            row.close = item.close
                            row.avgPrice = item.avgPrice
                            row.chng = item.chng
                            row.chngPer = item.chngPer
                        }
                        return row;
                    })
                    setSymbolList(newList)
                }
            })
        }
    }, [props.visibleList])

    function setHoldingsData(holdings) {
        holdings = holdings.map((item) => {
            item.buyValue = convertCommaSeparated((parseFloat(replaceComma(item.avgPrice)) *
                parseInt(replaceComma(item.qty))).toString(), getDecimal_Precision(item.sym.exc))
            item.pnl = parseFloat(replaceComma(item.avgPrice)) ?
                convertCommaSeparated(((parseFloat(replaceComma(item.ltp)) -
                    parseFloat(replaceComma(item.avgPrice))) *
                    parseFloat(replaceComma(item.qty))).toString(),
                getDecimal_Precision(item.sym.exc)) : "0.00"
            item.pnlPer = (parseFloat(replaceComma(item.buyValue))
                && parseFloat(replaceComma(item.avgPrice))) ?
                convertCommaSeparated(((parseFloat(replaceComma(item.pnl)) * 100)
                    / parseFloat(replaceComma(item.buyValue))).toString(),
                getDecimal_Precision(item.sym.exc)) : "0.00"
            return item
        })
        setStreamSymbolList(holdings)
        props.setOriginalList(holdings)
        setSymbolList(holdings)
        if (holdings.length) {
            streamingSubscription(holdings)
        }
    }

    function streamingSubscription(symArrayList) {
        let symbols = symArrayList.map(l => l.sym)
        props.forceSubscribeLevel1(symbols, [STREAMING_KEYS.LTP,
            STREAMING_KEYS.CHANGE, STREAMING_KEYS.CHANGE_PER,
            STREAMING_KEYS.CLOSE])
    }

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function setStreamingResptoSymbolsList(resp) {
        let { data } = resp;

        let newSymList = streamSymbolList.map(row => {
            if (row.sym.streamSym === data.symbol) {

                row = Object.assign({}, row, applyPaint(row, data));
                if(row.isPrevClose === true) 
                    row.avgPrice = row.close

                let avgPrice = row.avgPrice

                if (row.ltp) {
                    row.pnl = calculatePNL(avgPrice, row.ltp, row.qty, row.sym.exc)
                    row.pnlPer = calculatePNLPer(row.buyValue, avgPrice, row.pnl, row.sym.exc)
                    row.portfolioValue = calculatePortfolioValue(row.ltp, row.qty)
                    row.dayspnl = calculateDayspnl(avgPrice, row.ltp, row.close, row.qty, row.sym.exc)
                }
            }
            return row;
        })
        setStreamSymbolList(newSymList)

        let isSymVisible = props.visibleList.findIndex((i) => {
            return i.sym.streamSym === data.symbol
        })
        if (isSymVisible !== -1) {
            let newList = symbolList.map(row => {
                if (row.sym.streamSym === data.symbol) {
                    row = Object.assign({}, row, applyPaint(row, data));
                    if(row.isPrevClose === true) 
                        row.avgPrice = row.close

                    if (row.ltp) {
                        let avgPrice = row.avgPrice
                        row.pnl = calculatePNL(avgPrice, row.ltp, row.qty, row.sym.exc)
                        row.pnlPer = calculatePNLPer(row.buyValue, avgPrice, row.pnl, row.sym.exc)
                        row.portfolioValue = calculatePortfolioValue(row.ltp, row.qty)
                        row.dayspnl = calculateDayspnl(avgPrice, row.ltp, row.close, row.qty, row.sym.exc)
                    }
                }
                return row;

            })
            setSymbolList(newList)
        }
    }
    
    function onSort(type, key1, sortType) {
        if (type === "string")
            onSortByStringCB(key1, sortType)
        else
            onSortByIntCB(key1, sortType)
    }

    function onIconSort(type, key, sortType) {
        onSort(type, key, sortType)
    }

    function onSortByIntCB(key1, sortType) {
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

        let sortedSymList = sortByInt(ascSort, symbolList, key1)
        setSymbolList(sortedSymList)
        if (symbolList && symbolList.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1)
            setSortFlag(updatedSortFlag)
        }
    }

    function onSortByStringCB(key1, sortType) {
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

        let sortedSymList = sortByString(ascSort, symbolList, key1)
        setSymbolList(sortedSymList)
        if (symbolList && symbolList.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1)
            setSortFlag(updatedSortFlag)
        }
    }

    function getSortIconCB(column) {
        let sortFlagArray = Object.assign([], sortFlag)
        let sortOrder = sortFlagArray.filter((item) => item.column === column)
        if (sortOrder.length)
            return sortOrder[0].sortAsc
        return null
    }

    function showMoreDetails(index) {
        if (index === selectedShowMoreIndex)
            setSelectedShowMoreIndex(null)
        else
            setSelectedShowMoreIndex(index)
    }

    function gotoQuoteView(item, fullView = false) {
        gotoQuote(item, fullView)
        setShowMore(false)
    }

    function onClickExpand() {
        if (showMore)
            props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.ORDER_WITH_QUOTE)
        else
            props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.ORDER_VIEW)

        setShowMore(!showMore)
    }

    function onClickModifyOrder(dataItem, type) {
        let symObj = formSymBlock(dataItem)
        let values = {}
        let fieldKeyArray = Object.keys(dataItem)
        fieldKeyArray.map((item) => {
            if (item === "netQty") {
                values[ORDERPAD_FIIELD_KEYS.QUANTITY] = replaceComma(dataItem[item])
            } else if (ORDERPAD_FIIELD_KEYS.API_KEY[item])
                values[ORDERPAD_FIIELD_KEYS[ORDERPAD_FIIELD_KEYS.API_KEY[item]]] =
                    replaceComma(dataItem[item])
        })
        props.storeModifyOrderDetails({
            modifyType: type,
            symDetails: dataItem
        })
        props.storeOrderFieldValues(values)
        props.storeOrderpadSelectedSym(symObj)
        props.storeOrderPadDialogDetails({
            dialogName: ORDERPAD_DIALOGS.ORDER_PAD,
            trade_type: ORDER_TYPES.SELL
        })
    }

    // function onSort(type, key1) {
    //     isSorting.current = true
    //     props.storeHoldingsortData({
    //         type: type,
    //         key: key1,
    //         sortType: null,
    //     })
    // }

    // function getSortIconCB(column) {
    //     let sortOrder = sortFlag.filter((item) => item.column === column)
    //     if (sortOrder.length)
    //         return sortOrder[0].sortAsc
    //     return null
    // }
    // function onIconSort(type, key, sortType) {
    //     props.storeHoldingsortData({
    //         type: type,
    //         key: key,
    //         sortType: sortType,
    //     })
    // }

    return (
        useMemo(() => {
            return (
                <div className="orderTable-base">
                    <table className="order-table">
                        <thead className="thead-scroller">
                            <tr>
                                <th className={`firstChild width24`}>
                                    <span className=""
                                    // onClick={() => onSort(SORT_DATATYPE.STRING, 'dispSym')}
                                    >
                                        <LangText module="TABLE_HEADERS" name="SYMBOL" />
                                    </span>
                                    {/* <SortIcon colName="dispSym"  /> */}
                                </th>
                                <th className="">
                                    <span className="cursor"
                                        onClick={() => onSort(SORT_DATATYPE.INT, 'qty')}
                                    >
                                        <LangText module="TABLE_HEADERS" name="QTY" 
                                            orientation={TEXT_ORIENTATION.UPPERCASE}/>
                                    </span>
                                    <SortIcon colName="qty" getSortIcon={getSortIconCB} 
                                        type={SORT_DATATYPE.INT} onIconSort={onIconSort} />
                                </th>
                                <th className="">
                                    <span className="cursor"
                                        onClick={() => onSort(SORT_DATATYPE.INT, 'avgPrice')}
                                    >
                                        <LangText module="TABLE_HEADERS" name="AVG_PRICE" />
                                    </span>
                                    <SortIcon colName="avgPrice" getSortIcon={getSortIconCB} 
                                        type={SORT_DATATYPE.INT} onIconSort={onIconSort} />
                                </th>
                                <th className="width12">
                                    <span className="cursor"
                                        onClick={() => onSort(SORT_DATATYPE.INT, 'ltp')}
                                    >
                                        <LangText module="TABLE_HEADERS" name="LTP_CHNG_PER" />
                                    </span>
                                    <SortIcon colName="ltp" getSortIcon={getSortIconCB} 
                                        type={SORT_DATATYPE.INT} onIconSort={onIconSort} />
                                </th>
                                {/* <th className="">
                            <span className="cursor"
                                onClick={() => onSort(SORT_DATATYPE.INT, 'chng')}
                            >
                                <LangText module="TABLE_HEADERS" name="CHG_AND_PER" />
                            </span>
                            <SortIcon colName="chng" getSortIcon={getSortIconCB} type={SORT_DATATYPE.INT} onIconSort={onIconSort} />
                        </th> */}
                                <th className="">
                                    <span className="cursor"
                                        onClick={() => onSort(SORT_DATATYPE.INT, 'invested')}
                                    >
                                        <LangText module="TABLE_HEADERS" name="INVESTED" />
                                    </span>
                                    <SortIcon colName="invested" getSortIcon={getSortIconCB}
                                        type={SORT_DATATYPE.INT} onIconSort={onIconSort}
                                    />
                                </th>
                                <th className="width10">
                                    <span className="cursor"
                                        onClick={() => onSort(SORT_DATATYPE.INT, 'portfolioValue')}
                                    >
                                        <LangText module="TABLE_HEADERS" name="VALUE_L" />
                                    </span>
                                    <SortIcon colName="portfolioValue" getSortIcon={getSortIconCB}
                                        type={SORT_DATATYPE.INT} onIconSort={onIconSort}
                                    />
                                </th>
                                <th className="">
                                    <span className="cursor"
                                        onClick={() => onSort(SORT_DATATYPE.INT, 'dayspnl')}
                                    >
                                        <LangText module="TABLE_HEADERS" name="TODAYS_PL" />
                                    </span>
                                    <SortIcon colName="dayspnl" getSortIcon={getSortIconCB}
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
                        <tbody id="holdingsTable" className="tbody-scroller scroller_firefox"
                            onScroll={(e) => props.onScrollDiv(e)}
                        >
                            {
                                symbolList.length ?                                
                                    symbolList.map((item, index) => {
                                        return (
                                            <>
                                                <tr className={`${selectedShowMoreIndex === index ? 'noBorder' : ''} `}>
                                                    <td className="firstChild width24">
                                                        <div className="symName-column">
                                                            <div className="primary">
                                                                <div className=                   
                                                                    "baseSym primary-symName text-nowrap quote-click"
                                                                title={getDispSymbolName(item).primaryName}
                                                                onClick={() => gotoQuoteView(item)}
                                                                >
                                                                    {getDispSymbolName(item).primaryName}
                                                                </div>
                                                                <span className="exc">
                                                                    {item.sym.exc}
                                                                    {
                                                                        item.prdType ?
                                                                            <span className="pTypeVal">
                                                                                {item.prdType}
                                                                            </span>
                                                                            : null
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="symName text-nowrap">
                                                                <span title={getDispSymbolName(item).secondaryName}>
                                                                    {getDispSymbolName(item).secondaryName}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {checkEmpty(item.qty)}
                                                    </td>
                                                    <td>
                                                        {checkEmpty(item.avgPrice)}
                                                    </td>
                                                    <td className="width12">
                                                        <span className={`${item.ltpClass}`}>
                                                            {checkEmpty(item.ltp)}
                                                        </span>
                                                        <span 
                                                            className={`changePer_inLTP ${getColorCode(item.chngPer)}`}>
                                                            ({checkEmpty(item.chngPer)}%)
                                                        </span>
                                                    </td>
                                                    {/* <td className={`change ${getColorCode(item.chng)}`}>
                                                <span className={`${item.chngClass}`}>{checkEmpty(item.chng)}({checkEmpty(item.chngPer)}%)</span>
                                            </td> */}
                                                    <td>
                                                        {checkEmpty(item.invested)}
                                                    </td>
                                                    <td className="width10">
                                                        {checkEmpty(item.portfolioValue)}
                                                    </td>
                                                    <td className={`${getColorCode(item.dayspnl)}`}>
                                                        {checkEmpty(item.dayspnl)}
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
                                                {selectedShowMoreIndex === index ?   
                                                    <div className="moreDetails">
                                                        <button onClick={() => gotoChartPopup(item)}>
                                                            {
                                                                props.selectedTheme === THEMES.LIGHT ?
                                                                    <img 
                                                                        src="assets/images/dashboard/line_chart.svg"
                                                                        alt="" />
                                                                    :
                                                                    <img src=
                                                                        "assets/images/dark/dashboard/line_chart.svg"
                                                                    alt="" />
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
                                                        <button onClick={() => gotoTrade(item, ORDER_TYPES.BUY)}>
                                                            {
                                                                props.selectedTheme === THEMES.LIGHT ?
                                                                    <img 
                                                                        src="assets/images/dashboard/buy_more.svg"
                                                                        alt="" />
                                                                    :
                                                                    <img 
                                                                        src="assets/images/dark/dashboard/buy_more.svg"
                                                                        alt="" />
                                                            }
                                                            <LangText module="BUTTONS" name="BUY_MORE" 
                                                                orientation={TEXT_ORIENTATION.LOWERCASE} />
                                                        </button>
                                                        <button 
                                                            onClick={() => 
                                                                onClickModifyOrder(item, ORDER_MODIFY_TYPE.SQUARE_OFF)}>
                                                            {
                                                                props.selectedTheme === THEMES.LIGHT ?
                                                                    <img 
                                                                        src="assets/images/dashboard/square_off.svg"
                                                                        alt="" />
                                                                    :
                                                                    <img src=
                                                                        "assets/images/dark/dashboard/square_off.svg"
                                                                    alt="" />
                                                            }
                                                            <LangText module="BUTTONS" name="SQUARE_OFF" 
                                                                orientation={TEXT_ORIENTATION.LOWERCASE} />
                                                        </button>
                                                        <button onClick={() => gotoQuoteView(item, true)}>
                                                            {
                                                                props.selectedTheme === THEMES.LIGHT ?
                                                                    <img 
                                                                        src="assets/images/dashboard/quote.svg"
                                                                        alt="" />
                                                                    :
                                                                    <img 
                                                                        src="assets/images/dark/dashboard/quote.svg"
                                                                        alt="" />
                                                            }

                                                            <LangText module="BUTTONS" name="QUOTE" />
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
                        </tbody>
                    </table>
                </div>
            )
        }, [symbolList, selectedShowMoreIndex, showMore, props.errorMsg, props.selectedTheme, props.selectedWidgetMode])
    )
}

const mapStateToProps = ({ dashboard, settings }) => {
    return {
        selectedTheme: settings.selectedTheme,
        selectedWidgetMode: dashboard.selectedWidgetMode,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) },
        storeModifyOrderDetails: (s) => { dispatch(storeModifyOrderDetails(s)) },
        storeOrderFieldValues: (s) => { dispatch(storeOrderFieldValues(s)) },
        storeOrderpadSelectedSym: (s) => { dispatch(storeOrderpadSelectedSym(s)) },
        storeOrderPadDialogDetails: (s) => { dispatch(storeOrderPadDialogDetails(s)) },
        storeHoldingsortData: (s) => { dispatch(storeHoldingsortData(s)) },
        storeHoldingsGuestAlertMsg: (s) => { dispatch(storeHoldingsGuestAlertMsg(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStreaming(LazyLoading(HoldingsTableComponent)));