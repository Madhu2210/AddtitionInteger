import React, { useEffect, useRef, useState } from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest, withStreaming } from '../../../../index'

import { DASHBOARD_ORDER_TABS, SORT_TYPES, STREAMING_KEYS, STREAMING_MODULES } from '../../../../common/Constants';
import {
    applyPaint, convertCommaSeparated, getColorCode,
    getDecimal_Precision, replaceComma,
    scrollToTop, checkEmpty, sortFlagFunc, sortByString, sortByInt, convertToFloat, getGuestUserBaseURL
} from '../../../../common/CommonMethods';
import { HOLDINGS_GUEST } from '../../../../config/ServiceURLs';
import { storeHoldingsGuestAlertMsg, storeHoldingsResponse } from '../../../../state/actions/Actions';
import LangText from '../../../../common/lang/LangText';
import { storeHoldingsResponseToStore } from '../../../../common/Bridge';

function HoldingsHeaderTabComponent(props) {

    const MsfFetch = useFetch()

    const [holdingsList, setHoldingsList] = useState([])
    const [streamingResp, setStreamingResp] = useState(null)
    const [totalPLValues, setTotalPLValues] = useState({})
    const [totalPortfolioVal, setTotalPortfolioVal] = useState(null)
    const [sortAsc, setSortAsc] = useState(true)
    const [holdingsLength, setHoldingsLength] = useState(null)
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

    const investedValue = useRef(null)

    useEffect(() => {
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.HOLDINGS);
        scrollToTop();
    }, [])

    useEffect(() => {
        if (props.selectedTab === DASHBOARD_ORDER_TABS.HOLDINGS)
            getHoldingResponse()
    }, [props.selectedTab])

    useEffect(() => {
        if (streamingResp && streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    useEffect(() => {
        if (props.holdingsSortData !== null) {
            onSortCB(
                props.holdingsSortData.type, props.holdingsSortData.key,
                props.holdingsSortData.sortType, holdingsList
            )
        }

    }, [props.holdingsSortData])

    function getHoldingResponse() {
        getHoldings()
    }

    function getHoldings() {
        let request = new MsfRequest();
        props.getResponseList([], "", sortFlag)
        request.addToData({})
        setTotalPLValues({})
        setTotalPortfolioVal(null)
        setHoldingsList([])
        setHoldingsLength(null)
        MsfFetch.placeRequest(
            getGuestUserBaseURL() + HOLDINGS_GUEST.GET_HOLDINGS_BO,
            request,
            successRespCBGetHoldings,
            errorRespCBGetHoldings
        )
    }

    function successRespCBGetHoldings(response) {
        setHoldingsData(response)
        props.getResponseList(response.data.holdings, "", sortFlag)
        storeHoldingsResponseToStore(response.data.holdings)

    }

    function errorRespCBGetHoldings(error) {
        props.getResponseList([], error.message, sortFlag)
    }

    function setHoldingsData(response) {
        investedValue.current = response.data.invested
        let holdings = response.data.holdings
        holdings = holdings.map((item) => {
            item.buyValue = convertCommaSeparated((parseFloat(replaceComma(item.avgPrice)) *
             parseInt(replaceComma(item.qty))).toString(), getDecimal_Precision(item.sym.exc))
            item.pnl = parseFloat(replaceComma(item.avgPrice)) ?
                convertCommaSeparated(((parseFloat(replaceComma(item.ltp)) - 
             parseFloat(replaceComma(item.avgPrice))) * parseFloat(replaceComma(item.qty))).toString(), 
                getDecimal_Precision(item.sym.exc)) : "0.00"
            item.pnlPer = (parseFloat(replaceComma(item.buyValue))
             && parseFloat(replaceComma(item.avgPrice))) ?
                convertCommaSeparated(((parseFloat(replaceComma(item.pnl)) * 100) /
               parseFloat(replaceComma(item.buyValue))).toString(), getDecimal_Precision(item.sym.exc)) : "0.00"
            return item
        })
        setHoldingsList(holdings)
        streamingSubscription(holdings)
        setHoldingsLength(holdings.length)
    }

    function streamingSubscription(symArrayList) {
        let symbols = symArrayList.map(l => l.sym)
        props.forceSubscribeLevel1(symbols, [STREAMING_KEYS.LTP,
            STREAMING_KEYS.CHANGE, STREAMING_KEYS.CHANGE_PER, STREAMING_KEYS.CLOSE])
    }

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function setStreamingResptoSymbols(resp) {

        let { data } = resp;
        let totalPNLData = { pnl: 0, pnlPer: 0 }
        let totalPortfolioValue = 0;
        let newList = holdingsList.map(row => {
            if (row.sym.streamSym === data.symbol) {
                row = Object.assign({}, row, applyPaint(row, data));
                let avgPrice = row.avgPrice
                if (row.ltp) {
                    row.pnl = parseFloat(replaceComma(avgPrice)) ?
                        convertCommaSeparated(((parseFloat(replaceComma(row.ltp)) -
                         parseFloat(replaceComma(avgPrice))) * parseFloat(row.qty)).toString(),
                        getDecimal_Precision(row.sym.exc))
                        : "0.00"
                    row.pnlPer = (parseFloat(replaceComma(row.buyValue)) &&
                     parseFloat(replaceComma(avgPrice))) ?
                        convertCommaSeparated(((parseFloat(replaceComma(row.pnl)) * 100) /
                         parseFloat(replaceComma(row.buyValue))).toString(), getDecimal_Precision(row.sym.exc)) : "0.00"
                    row.portfolioValue = convertCommaSeparated(convertToFloat(parseFloat(replaceComma(row.ltp)) *
                        parseInt(replaceComma(row.qty))));
                    row.dayspnl = parseFloat(replaceComma(avgPrice)) ?
                        convertCommaSeparated(((parseFloat(replaceComma(row.ltp)) -
                         parseFloat(replaceComma(row.close))) * parseFloat(row.qty)).toString(), 
                        getDecimal_Precision(row.sym.exc))
                        : "0.00"
                }
            }
            totalPNLData.pnl = convertCommaSeparated(parseFloat(replaceComma(totalPNLData.pnl)) +
             parseFloat(replaceComma(row.pnl)))
            totalPNLData.pnlPer = parseFloat(replaceComma(investedValue.current)) ? 
                convertCommaSeparated(((parseFloat(replaceComma(totalPNLData.pnl)) / 
            parseFloat(replaceComma(investedValue.current))) * 100)) : investedValue.current
            totalPortfolioValue = convertCommaSeparated(parseFloat(replaceComma(totalPortfolioValue)) 
            + parseFloat(replaceComma(row.portfolioValue)))
            return row;
        })

        if(totalPNLData.pnl !== 0 && totalPNLData !== {}) {
            if (props.holdingGuestMsg === false) {
                if(parseFloat(totalPNLData.pnl) < 0) {
                    props.getGuestAlertMsg(false)
                }
                else {
                    props.getGuestAlertMsg(true)
                }
                props.storeHoldingsGuestAlertMsg(true)
            }
        }
        setHoldingsList(newList)
        setTotalPLValues(Object.assign({}, totalPLValues, totalPNLData))
        setTotalPortfolioVal(totalPortfolioValue)
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
        setHoldingsList(sortedSymList)
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
        setHoldingsList(sortedSymList)
        if (symArray && symArray.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1)
            setSortFlag(updatedSortFlag)
        }
    }

    function onSelectTab() {
        props.onSelectTab && props.onSelectTab(DASHBOARD_ORDER_TABS.HOLDINGS)
    }
    return (
        <div className={`tab ${(props.selectedTab === DASHBOARD_ORDER_TABS.HOLDINGS) ? 'selected' : ''}`}
            onClick={onSelectTab}
        >
            <div className="label">
                <span className="head holdings-tab"><LangText module="HEADER" name="HOLDINGS" />
                    <span className="values-count">({checkEmpty(holdingsLength)})</span></span>
                <span className="valueLabel"><LangText module="HEADER" name="TOTAL_PNL" /></span>
            </div>
            <div className="value">
                <span className="totalportfolio">

                    {checkEmpty(totalPortfolioVal)}
                </span>
                <span className={getColorCode(totalPLValues.pnl)}>
                    {checkEmpty(totalPLValues.pnl)}<span className="perVal">({checkEmpty(totalPLValues.pnlPer)}%)</span>
                </span>
            </div>
        </div>
    )
}

const mapStateToProps = ({ holdings }) => {
    return {
        holdingsResp: holdings.holdingsResp,
        holdingsSortData: holdings.holdingsSortData,
        holdingGuestMsg: holdings.holdingGuestMsg
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeHoldingsResponse: (s) => { dispatch(storeHoldingsResponse(s)) },
        storeHoldingsGuestAlertMsg: (s) => { dispatch(storeHoldingsGuestAlertMsg(s)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStreaming(HoldingsHeaderTabComponent));