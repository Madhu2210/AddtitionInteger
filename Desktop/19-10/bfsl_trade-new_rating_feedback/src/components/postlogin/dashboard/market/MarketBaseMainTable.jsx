import React, { useEffect, useRef, useState } from 'react'
import { withStreaming, useFetch, MsfRequest } from '../../../../index'

import LangText from '../../../../common/lang/LangText';
import {
    EQUITY_MENU, ORDER_TYPES, QUOTE_DIALOGS, STREAMING_KEYS,
    STREAMING_MODULES, THEMES
} from '../../../../common/Constants';
import { applyPaint, checkEmpty, convertToCrore, getBaseURL, getColorCode } from '../../../../common/CommonMethods';

import { DownArrowIcon, UpArrowIcon } from '../../../common/FontIcons';
import { WATCHLIST } from '../../../../config/ServiceURLs';
import { connect } from 'react-redux';
import { gotoChartPopup, gotoTrade, gotoQuote, regetWatchGroupSymbolsCB } from '../../../../common/Bridge';
import { showAppDialog, storeQuoteDialogDetails } from '../../../../state/actions/Actions';

function MarketBaseMainTable(props) {

    const MsfFetch = useFetch()

    const [streamingResp, setStreamingResp] = useState(null)
    const [resultArray, setResultArray] = useState([])
    const [selectedShowMoreIndex, setSelectedShowMoreIndex] = useState(null)

    const selectedAddSym = useRef(null)
    let isPendingRequest = useRef(false)

    useEffect(() => {
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.MARKET_MOVERS_EQUITY);
    }, [])

    useEffect(() => {
        setSelectedShowMoreIndex(null)
    }, [props.selectedEquityMenu])

    useEffect(() => {
        if (props.marketList) {
            setResultArray(props.marketList)
            streamingSubscription(props.marketList)
        }
    }, [props.marketList])

    useEffect(() => {

        if (streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    function onStreamCB(resp) {

        setStreamingResp(resp)
    }

    function setStreamingResptoSymbols(resp) {
        if (resp) {
            let { data } = resp;
            let newList = resultArray.map(row => {

                if (row.sym.streamSym === data.symbol) {
                    row = Object.assign({}, row, applyPaint(row, data));
                }
                return row;
            })

            if (newList.length)
                setResultArray(newList)
        }
    }

    function streamingSubscription(symArrayList) {
        if (props.marketList) {
            let symbols = symArrayList.map(l => l.sym)
            props.forceSubscribeLevel1(
                symbols,
                [STREAMING_KEYS.LTP, STREAMING_KEYS.CHANGE,
                    STREAMING_KEYS.CHANGE_PER, STREAMING_KEYS.VOLUME,
                    STREAMING_KEYS.TTV, STREAMING_KEYS.OPEN,
                    STREAMING_KEYS.HIGH, STREAMING_KEYS.LOW,
                    STREAMING_KEYS.WEEK_HIGH, STREAMING_KEYS.WEEK_LOW,
                    STREAMING_KEYS.OI
                ]
            )
        }
    }

    function showMoreDetails(index) {
        if (index === selectedShowMoreIndex)
            setSelectedShowMoreIndex(null)
        else
            setSelectedShowMoreIndex(index)
    }

    function gotoAddWatchList(symData) {
        setSelectedShowMoreIndex(null)
        selectedAddSym.current = symData.sym
        props.storeQuoteDialogDetails({
            dialogName: QUOTE_DIALOGS.SELECT_WATCHGROUP,
            parentCB: onSaveSymToWatchGroup
        })
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
                getBaseURL() + WATCHLIST.ADD_SYMBOLS,
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
            closeCB: () => regetWatchGroupSymbolsCB(response.echo)
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

    function gotoChartPopupCB(symData) {
        setSelectedShowMoreIndex(null)
        gotoChartPopup(symData)
    }

    return (
        <div className="marketMovers-baseTable">
            <table className="maretMovers-table">
                <thead className="thead-scroller">
                    <tr>
                        <th className="firstChild width24">
                            <span className="symbol">
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
                        {
                            props.selectedEquityMenu.name === EQUITY_MENU.ACTIVE_VALUE ?
                                <th className="">
                                    <span className="turnover">
                                        <LangText module="TABLE_HEADERS" name="TURNOVER" />
                                    </span>
                                </th>
                                :
                                props.selectedEquityMenu.name === EQUITY_MENU.FT_WEEK_HIGH ?
                                    <th>
                                        <span className="yHigh">
                                            <LangText module="TABLE_HEADERS" name="WKH" />
                                        </span>
                                    </th> :
                                    props.selectedEquityMenu.name === EQUITY_MENU.FT_WEEK_LOW ?
                                        <th>
                                            <span className="yLow">
                                                <LangText module="TABLE_HEADERS" name="WKL" />
                                            </span>
                                        </th> :
                                        <th>
                                            <span className="volume">
                                                <LangText module="TABLE_HEADERS" name="VOLUME" />
                                            </span>
                                        </th>
                        }

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
                <tbody className="tbody-scroller">
                    {
                        (resultArray && resultArray.length) ?
                            resultArray.map((item, index) => {
                                return (
                                    <>
                                        <tr key={index} className={selectedShowMoreIndex === index ? 'noBorder' : ''}>
                                            <td className="firstChild width24">
                                                <div className="symName-column">
                                                    <span className="baseSym text-nowrap quote-click"
                                                        title={item.dispSym}
                                                        onClick={() => gotoQuote(item, true)}
                                                    >
                                                        {checkEmpty(item.dispSym)}
                                                    </span>

                                                </div>
                                            </td>
                                            <td className={`${getColorCode(item.chng)}`}>
                                                <span className={`changePer ${item.chng}`}>
                                                    {checkEmpty(item.chng)}({checkEmpty(item.chngPer)}%)</span>
                                            </td>
                                            <td>
                                                <span className={item.ltpClass}>{checkEmpty(item.ltp)}</span>
                                            </td>
                                            {
                                                props.selectedEquityMenu.name === EQUITY_MENU.ACTIVE_VALUE ?
                                                    <td className="">
                                                        <span className={item.ttv}>
                                                            {checkEmpty(convertToCrore(item.ttv))}</span>
                                                    </td>
                                                    :
                                                    props.selectedEquityMenu.name === EQUITY_MENU.FT_WEEK_HIGH ?
                                                        <td>
                                                            <span className={item.yHigh}>{checkEmpty(item.yHigh)}</span>
                                                        </td> :
                                                        props.selectedEquityMenu.name === EQUITY_MENU.FT_WEEK_LOW ?
                                                            <td>
                                                                <span className={item.yLow}>
                                                                    {checkEmpty(item.yLow)}</span>
                                                            </td> :
                                                            <td>
                                                                <span className={item.vol}>{checkEmpty(item.vol)}</span>
                                                            </td>
                                            }

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
                                        {
                                            selectedShowMoreIndex === index ?
                                                <div className="moreDetails">
                                                    <button onClick={() => gotoChartPopupCB(item)}>
                                                        {
                                                            props.selectedTheme.theme === THEMES.LIGHT ?
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
                                                    <button onClick={() => gotoTrade(item, ORDER_TYPES.BUY)}>
                                                        {
                                                            props.selectedTheme.theme === THEMES.LIGHT ?
                                                                <img 
                                                                    src="assets/images/dashboard/buy_more.svg"
                                                                    alt="" 
                                                                />
                                                                :
                                                                <img 
                                                                    src="assets/images/dark/dashboard/buy_more.svg" 
                                                                    alt="" 
                                                                />
                                                        }
                                                        <LangText module="BUTTONS" name="BUY_BTN" />
                                                    </button>
                                                    <button onClick={() => gotoTrade(item, ORDER_TYPES.SELL)}>
                                                        {
                                                            props.selectedTheme.theme === THEMES.LIGHT ?
                                                                <img 
                                                                    src="assets/images/dashboard/sell_more.svg" 
                                                                    alt="" 
                                                                />
                                                                :
                                                                <img 
                                                                    src="assets/images/dark/dashboard/sell_more.svg"
                                                                    alt=""
                                                                />
                                                        }

                                                        <LangText module="BUTTONS" name="SELL_BTN" />
                                                    </button>
                                                    <button className="addWatchlist"
                                                        onClick={() => gotoAddWatchList(item)}>
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
                                    {props.marketListErr}
                                </td>
                            </tr>
                    }
                </tbody>
            </table>
        </div >
    )
}

const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeQuoteDialogDetails: (s) => { dispatch(storeQuoteDialogDetails(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withStreaming(MarketBaseMainTable));