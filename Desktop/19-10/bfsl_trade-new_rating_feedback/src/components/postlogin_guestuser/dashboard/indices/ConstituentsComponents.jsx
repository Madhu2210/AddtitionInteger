import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useFetch, MsfRequest, withStreaming } from '../../../../index'
import { connect } from 'react-redux';

import { WidgetLoader } from '../../../common/WidgetLoaderComponent';
import LangText from '../../../../common/lang/LangText';
import { LazyLoading } from '../../../common/LazyLoadingHOC'

import { INDICES, WATCHLIST_GUEST } from '../../../../config/ServiceURLs';
import { showAppDialog, storeQuoteDialogDetails } from '../../../../state/actions/Actions';
import { gotoChartPopup, gotoQuote, gotoTrade, regetWatchGroupSymbolsCB } from '../../../../common/Bridge';

import {
    applyPaint, checkEmpty, getBaseURL, getColorCode,
    getMarketDataBaseURL
} from '../../../../common/CommonMethods';
import { ORDER_TYPES, QUOTE_DIALOGS, STREAMING_KEYS, STREAMING_MODULES, THEMES } from '../../../../common/Constants';
import { DownArrowIcon, UpArrowIcon } from '../../../common/FontIcons';

function ConstituentsComponents(props) {

    const MsfFetch = useFetch()

    const selectedAddSym = useRef(null)
    let isPendingRequest = useRef(false)

    const [selectedShowMoreIndex, setSelectedShowMoreIndex] = useState(null)
    const [streamingResp, setStreamingResp] = useState({})
    const [resultArray, setResultArray] = useState([])
    const [errMsg, setErrorMsg] = useState(null)
    const [streamingDataList, setStreamingDataList] = useState([])

    useEffect(() => {
        getConstituentsData()
    }, [props.selectedSymbol])

    useEffect(() => {
        props.setDisableLazyLoad(true)
        props.setElementRowHeight(65)
        props.setScrollRef(document.getElementById('constituentsTable'))
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.INDICES_CONSTITUENTS);
    }, [])

    useEffect(() => {
        if (streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    useEffect(() => {
        if (props.visibleList && props.visibleList.length && streamingDataList.length) {
            streamingDataList.map((item) => {
                let isSymVisible = props.visibleList.findIndex((i) => {
                    return i.sym.streamSym === item.sym.streamSym
                })
                if (isSymVisible !== -1) {
                    let newList = resultArray.map(row => {
                        if (row.sym.streamSym === item.sym.streamSym) {
                            // row = Object.assign({}, row, item);
                            row.ltp = item.ltp
                            row.chng = item.chng
                            row.chngPer = item.chngPer
                            row.vol = item.vol
                            row.open = item.open
                            row.high = item.high
                            row.low = item.low
                        }
                        return row;
                    })
                    setResultArray(newList)
                }
            })
        }
    }, [props.visibleList])

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function streamingSubscription(arrayList) {
        let symbols = arrayList.map(l => l.sym)
        props.forceSubscribeLevel1(
            symbols,
            [
                STREAMING_KEYS.LTP, STREAMING_KEYS.CHANGE, STREAMING_KEYS.CHANGE_PER,
                STREAMING_KEYS.VOLUME, STREAMING_KEYS.OPEN, STREAMING_KEYS.HIGH, STREAMING_KEYS.LOW
            ]
        )
    }

    function setStreamingResptoSymbols(resp) {
        let { data } = resp;
        let newList = streamingDataList.map(row => {
            if (row.sym.streamSym === data.symbol) {
                row = Object.assign({}, row, applyPaint(row, data));
            }
            return row;
        })
        setStreamingDataList(newList)

        let isSymVisible = props.visibleList.findIndex((i) => {
            return i.sym.streamSym === data.symbol
        })
        if (isSymVisible !== -1) {
            let newSymList = resultArray.map(row => {
                if (row.sym.streamSym === data.symbol) {
                    row = Object.assign({}, row, applyPaint(row, data));
                }
                return row;
            })
            setResultArray(newSymList)
        }
    }

    function getConstituentsData() {
        setResultArray([])
        setErrorMsg(null)
        let request = new MsfRequest();
        props.showWidgetLoader();
        request.addToData({
            "indexName": props.selectedSymbol.baseSym,
            "exc": props.selectedSymbol.exc
        })
        MsfFetch.placeRequest(
            getMarketDataBaseURL() + INDICES.INDEX_CONSTITUENTS,
            request,
            successRespCBgetIndexConstituents,
            errorRespCBgetIndexConstituents
        )
    }

    function successRespCBgetIndexConstituents(response) {
        if (response.data.RESULT && response.data.RESULT.length) {
            setResultArray(response.data.RESULT)
            setStreamingDataList(response.data.RESULT)
            props.setOriginalList(response.data.RESULT)
            streamingSubscription(response.data.RESULT)
        }
        props.hideWidgetLoader();
    }

    function errorRespCBgetIndexConstituents(error) {
        setErrorMsg(error.message)
        props.hideWidgetLoader();
    }

    function gotoQuoteView(item, fullView = false) {
        gotoQuote(item, fullView)
    }
    function showMoreDetails(index) {
        if (index === selectedShowMoreIndex)
            setSelectedShowMoreIndex(null)
        else
            setSelectedShowMoreIndex(index)
    }

    function gotoAddWatchList(symData) {
        if(Object.keys(props.selectedWatchgroupResp).length === 0) {
            props.storeQuoteDialogDetails({
                dialogName: QUOTE_DIALOGS.EMPTY_WATCHLIST,
            })
        }
        else {
            selectedAddSym.current = symData.sym
            props.storeQuoteDialogDetails({
                dialogName: QUOTE_DIALOGS.SELECT_WATCHGROUP,
                parentCB: onSaveSymToWatchGroup
            })
        }
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
        props.showAppDialog({
            message: error.message,
            show: true
        })
    }

    function gotoAddWatchListCB(symData) {
        setSelectedShowMoreIndex(null)
        gotoAddWatchList(symData)
    }

    return (
        useMemo(() => {
            return (
                <div className="constituents">
                    <table>
                        <thead className="thead-scroller title">
                            <tr>
                                <th className="firstChild width24">
                                    <span className="symbolname-header">
                                        <LangText module="TABLE_HEADERS" name="SYMBOL" />
                                    </span>
                                </th>
                                <th>
                                    <span className="change-per">
                                        <LangText module="TABLE_HEADERS" name="CHG_PER" />
                                    </span>
                                </th>
                                <th>
                                    <span className="ltp">
                                        <LangText module="TABLE_HEADERS" name="LTP" />
                                    </span>
                                </th>
                                <th>
                                    <span className="volume">
                                        <LangText module="TABLE_HEADERS" name="VOLUME" />
                                    </span>
                                </th>
                                <th>
                                    <span className="open">
                                        <LangText module="TABLE_HEADERS" name="OPEN" />
                                    </span>
                                </th>
                                <th>
                                    <span className="high">
                                        <LangText module="TABLE_HEADERS" name="HIGH" />
                                    </span>
                                </th>
                                <th>
                                    <span className="low">
                                        <LangText module="TABLE_HEADERS" name="LOW" />
                                    </span>
                                </th>
                                <th className="width4 iconCol">
                                </th>
                            </tr>
                        </thead>
                        <tbody id="constituentsTable" className="tbody-scroller consti-content"
                            onScroll={(e) => props.onScrollDiv(e)}
                        >
                            {
                                (resultArray && resultArray.length) ?
                                    resultArray.map((item, index) => {
                                        return (
                                            <>
                                                <tr key={index}
                                                    className={selectedShowMoreIndex === index ? 'noBorder' : ''}>
                                                    <td className="firstChild width24">
                                                        <div className="symName-column primary-symName">
                                                            <span className="baseSym text-nowrap quote-click"
                                                                title={item.dispSym}
                                                                onClick={() => gotoQuoteView(item, true)}
                                                            >
                                                                {item.dispSym}
                                                            </span>

                                                        </div>
                                                    </td>
                                                    <td className={`${getColorCode(item.chng)}`}>
                                                        <span className={`${item.chngClass}`}>
                                                            {checkEmpty(item.chng)}({checkEmpty(item.chngPer)}%)</span>
                                                    </td>
                                                    <td>
                                                        <span className={item.ltpClass}>{checkEmpty(item.ltp)}</span>
                                                    </td>
                                                    <td>{checkEmpty(item.vol)}</td>
                                                    <td>
                                                        <span className={item.open}>{checkEmpty(item.open)}</span>
                                                    </td>
                                                    <td>
                                                        <span className={item.high}>{checkEmpty(item.high)}</span>
                                                    </td>
                                                    <td>
                                                        <span className={item.low}>{checkEmpty(item.low)}</span>
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
                                                { selectedShowMoreIndex === index ?
                                                    <div className="moreDetails">
                                                        <button onClick={() => gotoChartPopup(item)}>
                                                            {props.selectedTheme.theme === THEMES.LIGHT ?
                                                                <img src=
                                                                    "assets/images/dashboard/line_chart.svg" 
                                                                alt="" />
                                                                :
                                                                <img 
                                                                    src="assets/images/dark/dashboard/line_chart.svg"
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
                                                        <button className="tradeBtn"
                                                            onClick={() => gotoTrade(item, ORDER_TYPES.BUY)}>
                                                            {
                                                                props.selectedTheme.theme === THEMES.LIGHT ?
                                                                    <img src=
                                                                        "assets/images/dashboard/buy_more.svg" 
                                                                    alt="" 
                                                                    />
                                                                    :
                                                                    <img src=
                                                                        "assets/images/dark/dashboard/buy_more.svg" 
                                                                    alt="" />
                                                            }

                                                            <LangText module="BUTTONS" name="BUY" />
                                                        </button>
                                                        <button className="tradeBtn"
                                                            onClick={() => gotoTrade(item, ORDER_TYPES.SELL)}>
                                                            {
                                                                props.selectedTheme.theme === THEMES.LIGHT ?
                                                                    <img src="assets/images/dashboard/sell_more.svg" 
                                                                        alt="" 
                                                                    />
                                                                    :
                                                                    <img 
                                                                        src="assets/images/dark/dashboard/sell_more.svg"
                                                                        alt=""
                                                                    />
                                                            }
                                                            <LangText module="BUTTONS" name="SELL" />
                                                        </button>
                                                        <button className="addWatchlist"
                                                            onClick={() => gotoAddWatchListCB(item)}>
                                                            {props.selectedTheme.theme === THEMES.LIGHT ?
                                                                <img 
                                                                    src="assets/images/dashboard/add_watchlist.svg" 
                                                                    alt="" 
                                                                />
                                                                :
                                                                <img 
                                                                    src="assets/images/dark/dashboard/add_watchlist.svg"
                                                                    alt="" 
                                                                />
                                                            }

                                                            <LangText module="BUTTONS" name="ADD_WATCHLIST" />
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
                                            {errMsg}
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
            )
        }, [resultArray, errMsg, selectedShowMoreIndex])
    )
}
const mapStateToProps = ({ indicesDetails, settings,watchlist }) => {
    return {
        selectedSymbol: indicesDetails.selectedSymbol,
        selectedTheme: settings.selectedTheme,
        selectedWatchgroupResp: watchlist.selectedWatchgroupResp
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeQuoteDialogDetails: (s) => { dispatch(storeQuoteDialogDetails(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) }
    };
};

export default
connect(mapStateToProps, mapDispatchToProps)(WidgetLoader(LazyLoading(withStreaming(ConstituentsComponents))));