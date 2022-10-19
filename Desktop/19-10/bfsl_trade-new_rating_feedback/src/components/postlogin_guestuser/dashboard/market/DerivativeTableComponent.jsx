import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux';
import { withStreaming, useFetch, MsfRequest } from '../../../../index'

import LangText from '../../../../common/lang/LangText';

import { gotoChartPopup, gotoQuote, gotoTrade, regetWatchGroupSymbolsCB } from '../../../../common/Bridge';
import { WATCHLIST_GUEST } from '../../../../config/ServiceURLs';
import { showAppDialog, storeQuoteDialogDetails } from '../../../../state/actions/Actions';

import { ORDER_TYPES, QUOTE_DIALOGS, STREAMING_KEYS, STREAMING_MODULES, THEMES } from '../../../../common/Constants';
import { applyPaint, checkEmpty, getBaseURL, getColorCode } from '../../../../common/CommonMethods';
import { DownArrowIcon, UpArrowIcon } from '../../../common/FontIcons';

function DerivativeTableComponent(props) {

    const MsfFetch = useFetch()

    const selectedAddSym = useRef(null)
    let isPendingRequest = useRef(false)

    const [streamingResp, setStreamingResp] = useState(null)
    const [resultArray, setResultArray] = useState([])
    const [selectedShowMoreIndex, setSelectedShowMoreIndex] = useState(null)

    useEffect(() => {
        setSelectedShowMoreIndex(null)
    }, [props.selectedEquityMenu])

    useEffect(() => {
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.MARKET_DERIVATIVES);
    }, [])

    useEffect(() => {
        if (props.marketList) {
            setResultArray(props.marketList)
            streamingSubscription(props.marketList)
        }
    }, [props.marketList])

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    useEffect(() => {
        if (streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

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
        let symbols = symArrayList.map(l => l.sym)
        props.forceSubscribeLevel1(
            symbols,
            [STREAMING_KEYS.LTP, STREAMING_KEYS.CHANGE, STREAMING_KEYS.CHANGE_PER, STREAMING_KEYS.VOLUME,
                STREAMING_KEYS.OI, STREAMING_KEYS.OI_PER, STREAMING_KEYS.TTV
            ]
        )
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
            setSelectedShowMoreIndex(null)
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

    function gotoChartPopupCB(symData) {
        setSelectedShowMoreIndex(null)
        gotoChartPopup(symData)
    }

    return (
        <div className="marketMovers-baseTable">
            <table className="derivatives-table">
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
                            <span className="">
                                <LangText module="TABLE_HEADERS" name="STRIKE_PRICE" />
                            </span>
                        </th>
                        <th>
                            <span className="ltp">
                                <LangText module="TABLE_HEADERS" name="LTP" />
                            </span>
                        </th>
                        <th>
                            <span className="value">
                                <LangText module="TABLE_HEADERS" name="VALUE" />
                            </span>
                        </th>
                        <th>
                            <span className="oichange">
                                <LangText module="TABLE_HEADERS" name="OI_CHNG" />
                            </span>
                        </th>
                        <th>
                            <span className="oichngper">
                                <LangText module="TABLE_HEADERS" name="OI_CHNG_PER" />
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

                                                        {item.dispSym}
                                                    </span>
                                                    <span className="lotSize">
                                                        Lots: {item.sym.lotSize}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className={`changePer ${getColorCode(item.chng)}`}>
                                                <span className={`${item.chngClass}`}>
                                                    {checkEmpty(item.chng)}({checkEmpty(item.chngPer)}%)</span>
                                            </td>
                                            <td>
                                                <span className={item.sym.strike}>{checkEmpty(item.sym.strike)}</span>
                                            </td>
                                            <td>
                                                <span className={item.ltpClass}>{checkEmpty(item.ltp)}</span>
                                            </td>
                                            <td>
                                                <span>{checkEmpty(item.ttv)}</span>
                                            </td>
                                            <td>
                                                <span className={item.OI}>{checkEmpty(item.OI)}</span>
                                            </td>
                                            <td className={`changePer ${getColorCode(item.OIChngPer)}`}>
                                                <span className={item.OIChngPer}>{checkEmpty(item.OIChngPer)}</span>
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
                                                                <img src="assets/images/dark/dashboard/line_chart.svg"
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
                                                                <img src="assets/images/dashboard/buy_more.svg"
                                                                    alt="" 
                                                                />
                                                                :
                                                                <img 
                                                                    src="assets/images/dark/dashboard/buy_more.svg" 
                                                                    alt="" 
                                                                />
                                                        }
                                                        <LangText  name="BUY_BTN" />
                                                    </button>
                                                    <button onClick={() => gotoTrade(item, ORDER_TYPES.SELL)}>
                                                        {
                                                            props.selectedTheme.theme === THEMES.LIGHT ?
                                                                <img src="assets/images/dashboard/sell_more.svg"
                                                                    alt="" 
                                                                />
                                                                :
                                                                <img src="assets/images/dark/dashboard/sell_more.svg" 
                                                                    alt="" 
                                                                />
                                                        }
                                                        <LangText  name="SELL_BTN" />
                                                    </button>
                                                    <button className="addWatchlist"
                                                        onClick={() => gotoAddWatchList(item)}>
                                                        {
                                                            props.selectedTheme.theme === THEMES.LIGHT ?
                                                                <img src="assets/images/dashboard/add_watchlist.svg" 
                                                                    alt="" />
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

        </div>
    )
}

const mapStateToProps = ({ settings,watchlist }) => {
    return {
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
export default connect(mapStateToProps, mapDispatchToProps)(withStreaming(DerivativeTableComponent));
