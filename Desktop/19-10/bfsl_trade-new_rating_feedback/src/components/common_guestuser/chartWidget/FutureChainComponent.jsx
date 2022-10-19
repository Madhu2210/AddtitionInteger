import React, { useState, useEffect, useRef } from 'react'
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import { useFetch, MsfRequest, withStreaming } from '../../../index'

import LangText from '../../../common/lang/LangText'
import { WidgetLoader } from '../../common/WidgetLoaderComponent'

import { QUOTE, WATCHLIST_GUEST } from '../../../config/ServiceURLs'
import { storeSelectedQuoteSym, storeQuoteDialogDetails, showAppDialog } from '../../../state/actions/Actions';

import {
    sortByInt, sortFlagFunc, sortByString, getMarketDataBaseURL,
    applyPaint, getColorCode, checkEmpty, getBaseURL
} from '../../../common/CommonMethods'
import { SORT_DATATYPE, SORT_TYPES, STREAMING_MODULES, STREAMING_KEYS, 
    ORDER_TYPES, QUOTE_DIALOGS, THEMES } from '../../../common/Constants'
import { DownArrowIcon, SortIcon, UpArrowIcon } from '../../common/FontIcons'
import { gotoChartPopup, gotoQuote, gotoTrade, regetWatchGroupSymbolsCB,} from '../../../common/Bridge';

const FutureChainComponent = (props) => {

    const MsfFetch = useFetch()

    const [selectedShowMoreIndex, setSelectedShowMoreIndex] = useState(null)
    const [futureList, setFutureList] = useState([])
    const [streamingResp, setStreamingResp] = useState({})
    const [errorMsg, setErrorMsg] = useState(null)
    const [sortFlag, setSortFlag] = useState([
        { column: "dispSym", sortAsc: null },
        { column: "ltp", sortAsc: null },
        { column: "open", sortAsc: null },
        { column: "high", sortAsc: null },
        { column: "vol", sortAsc: null },
        { column: "low", sortAsc: null },
        { column: "close", sortAsc: null },
    ])
    const [sortAsc, setSortAsc] = useState(true)
    // const [showMore, setShowMore] = useState(false)

    const selectedAddSym = useRef(null)
    let isPendingRequest = useRef(false)

    useEffect(() => {
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.FUTURE_CHAIN);
    }, [])

    useEffect(() => {
        if (props.selectedSym) {
            getFutureList()
        } else {
            setFutureList([])
        }
    }, [props.selectedSym])

    useEffect(() => {
        if (streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function streamingSubscription(symArrayList) {
        let symbols = symArrayList.map(l => l.sym)
        props.forceSubscribeLevel1(
            symbols,
            [STREAMING_KEYS.LTP, STREAMING_KEYS.CHANGE, STREAMING_KEYS.CHANGE_PER, STREAMING_KEYS.VOLUME]
        )
    }

    function setStreamingResptoSymbols(resp) {
        let { data } = resp;
        let newList = futureList.map(row => {
            if (row.sym.streamSym === data.symbol) {
                row = Object.assign({}, row, applyPaint(row, data));
            }
            return row;
        })
        if (newList.length)
            setFutureList(newList)
    }

    function getFutureList() {
        props.showWidgetLoader();
        let request = new MsfRequest();
        setFutureList([])
        setErrorMsg(null)
        request.addToData({
            sym: props.selectedSym,
            baseSym: props.selectedSym.baseSym,
            "filters": [
                {
                    "key": "segment",
                    "value": "FUT"
                }
            ]
        })
        request.setEncrypt(false)
        MsfFetch.placeRequest(
            getMarketDataBaseURL() + QUOTE.FUTURE_CHAIN,
            request,
            successRespGetFutureList,
            errorRespCBGetFutureList
        )
    }

    function successRespGetFutureList(response) {
        if (response.data.results && response.data.results.length) {
            setFutureList(response.data.results)
            streamingSubscription(response.data.results)
        }
        setErrorMsg(null)
        props.hideWidgetLoader();
    }

    function errorRespCBGetFutureList(error) {
        setFutureList([])
        setErrorMsg(error.message)
        props.hideWidgetLoader();
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

        let sortedSymList = sortByInt(ascSort, futureList, key1)
        setFutureList(sortedSymList)
        if (futureList && futureList.length > 1) {
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

        let sortedSymList = sortByString(ascSort, futureList, key1)
        setFutureList(sortedSymList)
        if (futureList && futureList.length > 1) {
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

    // function gotoQuoteScreen(e, symData) {
    //     let activeScreen = (props.parent === SCREENS.QUOTE ? props.goBackScreen : SCREENS.WATCHLIST)
    //     saveQuoteScreenDetails(symData, activeScreen)
    //     props.history.push(SCREENS.QUOTE)
    //     props.onCloseCB && props.onCloseCB()
    // }

    function showMoreDetails(index) {
        if (index === selectedShowMoreIndex)
            setSelectedShowMoreIndex(null)
        else
            setSelectedShowMoreIndex(index)
    }
    function gotoQuoteView(item, fullView = false) {
        gotoQuote(item, fullView)
        // setShowMore(false)
    }

    function onSaveSymToWatchGroup(selectedWatchGroup) {
        if (!isPendingRequest.current) {
            isPendingRequest.current = true
            props.showWidgetLoader();
            let request = new MsfRequest();
            let symList = []
            symList.push(selectedAddSym.current)
            request.addToData({
                "wName": selectedWatchGroup.wName,
                'syms': symList
            })
            request.setEcho(selectedWatchGroup.wName)
            MsfFetch.placeRequest(
                getBaseURL() + WATCHLIST_GUEST.ADD_SYMBOLS,
                request,
                successRespCBAddSymbol,
                errorRespCBAddSymbol
            )
        }
    }

    function successRespCBAddSymbol(response) {
        isPendingRequest.current = false
        props.hideWidgetLoader();
        props.showAppDialog({
            message: response.infoMsg,
            show: true,
            closeCB: () => regetWatchGroupSymbolsCB(null)
        })
    }

    function errorRespCBAddSymbol(error) {
        isPendingRequest.current = false
        props.hideWidgetLoader();
        // props.storeQuoteDialogDetails({
        //     dialogName: QUOTE_DIALOGS.ADD_SYM_RESULT,
        //     message: error.message,
        //     success: false
        // })
        props.showAppDialog({
            message: error.message,
            show: true
        })
    }

    function gotoAddWatchList(symData) {
        setSelectedShowMoreIndex(null)
        selectedAddSym.current = symData.sym
        props.storeQuoteDialogDetails({
            dialogName: QUOTE_DIALOGS.SELECT_WATCHGROUP,
            parentCB: onSaveSymToWatchGroup
        })
    }

    return (
        <div className="futureChain-base">
            <table>
                <thead className="thead-scroller">
                    <tr>
                        <th className="firstChild width24">
                            <span className="cursor"
                                onClick={() => onSort(SORT_DATATYPE.STRING, 'dispSym')}
                            >
                                <LangText module="TABLE_HEADERS" name="SYMBOL" />
                            </span>
                            <SortIcon colName="dispSym" getSortIcon={getSortIconCB} 
                                type={SORT_DATATYPE.STRING} onIconSort={onIconSort} />
                        </th>
                        <th>
                            <span className="cursor"
                                onClick={() => onSort(SORT_DATATYPE.INT, 'ltp')}
                            >
                                <LangText module="TABLE_HEADERS" name="LTP" />
                            </span>
                            <SortIcon colName="ltp" getSortIcon={getSortIconCB} 
                                type={SORT_DATATYPE.INT} onIconSort={onIconSort} />
                        </th>
                        <th>
                            <span className="cursor"
                                onClick={() => onSort(SORT_DATATYPE.INT, 'open')}
                            >
                                <LangText module="TABLE_HEADERS" name="OPEN_PRICE" />
                            </span>
                            <SortIcon colName="open" getSortIcon={getSortIconCB} 
                                type={SORT_DATATYPE.INT} onIconSort={onIconSort} />
                        </th>
                        <th>
                            <span className="cursor"
                                onClick={() => onSort(SORT_DATATYPE.INT, 'high')}
                            >
                                <LangText module="TABLE_HEADERS" name="HIGH_PRICE" />
                            </span>
                            <SortIcon colName="high" getSortIcon={getSortIconCB} 
                                type={SORT_DATATYPE.INT} onIconSort={onIconSort} />
                        </th>
                        <th>
                            <span className="cursor"
                                onClick={() => onSort(SORT_DATATYPE.INT, 'low')}
                            >
                                <LangText module="TABLE_HEADERS" name="LOW_PRICE" />
                            </span>
                            <SortIcon colName="low" getSortIcon={getSortIconCB} 
                                type={SORT_DATATYPE.INT} onIconSort={onIconSort} />
                        </th>
                        <th>
                            <span className="cursor"
                                onClick={() => onSort(SORT_DATATYPE.INT, 'close')}
                            >
                                <LangText module="TABLE_HEADERS" name="PREV_CLOSE" />
                            </span>
                            <SortIcon colName="close" getSortIcon={getSortIconCB} 
                                type={SORT_DATATYPE.INT} onIconSort={onIconSort} />
                        </th>
                        <th>
                            <span className="cursor"
                                onClick={() => onSort(SORT_DATATYPE.INT, 'vol')}
                            >
                                <LangText module="TABLE_HEADERS" name="VOLUME" />
                            </span>
                            <SortIcon colName="vol" getSortIcon={getSortIconCB} 
                                type={SORT_DATATYPE.INT} onIconSort={onIconSort} />
                        </th>
                        <th className="width4 iconCol"></th>
                    </tr>
                </thead>
                <tbody className="tbody-scroller">
                    {
                        futureList.length ? futureList.map((item, index) => {
                            return (
                                <>
                                    <tr key={index} className={selectedShowMoreIndex === index ? 'noBorder' : ''}>
                                        <td className="firstChild width24">
                                            <div className="symName-column">
                                                <span className="baseSym text-nowrap quote-click"
                                                    title={item.dispSym}
                                                    onClick={() => gotoQuoteView(item, true)}
                                                >
                                                    {item.dispSym}
                                                </span>
                                                <span className="exc">{item.sym.exc}</span>
                                            </div>
                                            <div className="date-div">
                                                <span className="date">{item.sym.expiry}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={item.ltpClass}>{checkEmpty(item.ltp)}</span>
                                        </td>
                                        <td>
                                            <span className={getColorCode(item.open)}>{checkEmpty(item.open)}</span>
                                        </td>
                                        <td>
                                            <span className={getColorCode(item.high)}>{checkEmpty(item.high)}</span>
                                        </td>
                                        <td>
                                            <span className={item.low}>{checkEmpty(item.low)}</span>
                                        </td>
                                        <td>{checkEmpty(item.close)}</td>
                                        <td>{checkEmpty(item.vol)}</td>
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
                                                            <img src="assets/images/dashboard/line_chart.svg" alt="" />
                                                            :
                                                            <img src="assets/images/dark/dashboard/line_chart.svg" 
                                                                alt="" />
                                                    }

                                                    <LangText module="BUTTONS" name="CHART" />
                                                </button>
                                                {/* <button>
                                                    {
                                                        props.selectedTheme.theme === THEMES.LIGHT ?
                                                            <img src="assets/images/dashboard/small_case.svg" alt="" />
                                                            :
                                                            <img src="assets/images/dark/dashboard/small_case.svg" alt="" />
                                                    }
                                                   
                                                    <LangText module="BUTTONS" name="SMALL_CASE" />
                                                </button>
                                                <button>
                                                 {
                                                        props.selectedTheme.theme === THEMES.LIGHT ?
                                                          <img src="assets/images/dashboard/streak.svg" alt="" />
                                                            :
                                                            <img src="assets/images/dark/dashboard/streak.svg" alt="" />
                                                    }
                                                    
                                                    <LangText module="BUTTONS" name="STREAK" />
                                                </button> */}
                                                <button className="tradeBtn" 
                                                    onClick={() => gotoTrade(item, ORDER_TYPES.BUY)}>
                                                    {
                                                        props.selectedTheme.theme === THEMES.LIGHT ?
                                                            <img src="assets/images/dashboard/buy_more.svg" alt="" />
                                                            :
                                                            <img src="assets/images/dark/dashboard/buy_more.svg" 
                                                                alt="" />
                                                    }

                                                    <LangText module="BUTTONS" name="BUY" />
                                                </button>
                                                <button className="tradeBtn" 
                                                    onClick={() => gotoTrade(item, ORDER_TYPES.SELL)}>
                                                    {
                                                        props.selectedTheme.theme === THEMES.LIGHT ?
                                                            <img src="assets/images/dashboard/sell_more.svg" alt="" />
                                                            :
                                                            <img src="assets/images/dark/dashboard/sell_more.svg" 
                                                                alt="" />
                                                    }
                                                    <LangText module="BUTTONS" name="SELL" />
                                                </button>
                                                <button className="addWatchlist" onClick={() => gotoAddWatchList(item)}>

                                                    {
                                                        props.selectedTheme.theme === THEMES.LIGHT ?
                                                            <img src="assets/images/dashboard/add_watchlist.svg" 
                                                                alt="" />
                                                            :
                                                            <img src="assets/images/dark/dashboard/add_watchlist.svg" 
                                                                alt="" />
                                                    }
                                                    <LangText module="BUTTONS" name="ADD_WATCHLIST" />
                                                </button>
                                                <button onClick={() => gotoQuoteView(item, true)}>

                                                    {
                                                        props.selectedTheme.theme === THEMES.LIGHT ?
                                                            <img src="assets/images/dashboard/quote.svg" alt="" />
                                                            :
                                                            <img src="assets/images/dark/dashboard/quote.svg" alt="" />
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
                            <tr>
                                <td className="colspan">{errorMsg}</td>
                            </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

const mapStateToProps = ({ quote, settings }) => {
    return {
        goBackScreen: quote.goBackScreen,
        selectedTheme: settings.selectedTheme,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeSelectedQuoteSym: (s) => { dispatch(storeSelectedQuoteSym(s)) },
        storeQuoteDialogDetails: (s) => { dispatch(storeQuoteDialogDetails(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    withRouter(WidgetLoader(withStreaming(FutureChainComponent))));