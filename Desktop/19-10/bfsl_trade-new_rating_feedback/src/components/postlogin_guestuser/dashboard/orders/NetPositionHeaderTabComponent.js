import React, { useEffect, useRef, useState } from 'react'
import { useFetch, MsfRequest, withStreaming } from '../../../../index'
import { connect } from "react-redux";

import { TRADE_GUEST } from '../../../../config/ServiceURLs';
import { storePositionsDialogSymStreamingData, storeRegetNetPositions } from '../../../../state/actions/Actions';

import {
    DASHBOARD_ORDER_TABS, DASHBOARD_WIDGET_MODE, ORDER_DIALOGS, ORDER_TYPES, PRECISIONS, SET_TIMEOUT_INTERVAL,
    SORT_TYPES, STREAMING_KEYS, STREAMING_MODULES
} from '../../../../common/Constants';
import {
    applyPaint, checkEmpty, convertCommaSeparated, getBaseURL,
    getColorCode, replaceComma, sortByInt, sortByString, sortFlagFunc
} from '../../../../common/CommonMethods';
import LangText from '../../../../common/lang/LangText';

function NetPositionHeaderTabComponent(props) {

    const MsfFetch = useFetch()

    const [netPositionsList, setNetPositionsList] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    const [streamingResp, setStreamingResp] = useState(null)
    const [totalPNL, setTotalPNL] = useState(null)
    const [sortAsc, setSortAsc] = useState(true)
    const [sortFlag, setSortFlag] = useState(
        [
            { column: "netQty", sortAsc: null },
            { column: "avgPrice", sortAsc: null },
            { column: "prdType", sortAsc: null },
            { column: "ltp", sortAsc: null },
            { column: "daypnl", sortAsc: null },
            { column: "pnl", sortAsc: null }
        ]
    )

    const apiInterval = useRef(null)

    useEffect(() => {
        getNetPositions()
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.NET_POSITION);

        apiInterval.current = setInterval(() => {
            getNetPositions(false)
        }, SET_TIMEOUT_INTERVAL.ORDER_INERVAL);

        return () => {
            clearRefreshInterval()
        };
    }, [])

    useEffect(() => {
        if (streamingResp && streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    useEffect(() => {
        if (props.selectedTab === DASHBOARD_ORDER_TABS.NET_POSITIONS)
            props.getResponseList(netPositionsList, errorMsg, sortFlag)
    }, [netPositionsList, errorMsg, props.selectedTab])

    useEffect(() => {
        if (netPositionsList && netPositionsList.length) {
            let totPnl = 0
            netPositionsList.map((item) => {
                totPnl = convertCommaSeparated(parseFloat(replaceComma(totPnl)) + parseFloat(replaceComma(item.pnl)))
            })
            setTotalPNL(totPnl.toString())
        }
    }, [netPositionsList])

    useEffect(() => {
        if (props.netPositionsSortData !== null) {
            onSortCB(
                props.netPositionsSortData.type, props.netPositionsSortData.key,
                props.netPositionsSortData.sortType, netPositionsList
            )
        }

    }, [props.netPositionsSortData])

    useEffect(() => {
        if (props.regetNetPositions) {
            getNetPositions()
            props.storeRegetNetPositions(false)
        }
    }, [props.regetNetPositions])

    function clearRefreshInterval() {
        clearInterval(apiInterval.current)
    }

    function getNetPositions(loader = true) {
        setTotalPNL(null)
        resetSortIcons()
        let request = new MsfRequest();
        request.addToData({
            type: "net",
            filters: []
        })
        if (loader) {
            setNetPositionsList([])
            setErrorMsg("")
        }
        MsfFetch.placeRequest(
            getBaseURL() + TRADE_GUEST.GET_NET_POSITION,
            request,
            successRespCBGetNetPositions,
            errorRespCBGetNetPositions
        )
    }

    function successRespCBGetNetPositions(response) {
        setNetPositionsData(response)
        setErrorMsg('')
    }

    function errorRespCBGetNetPositions(error) {
        setErrorMsg(error.message)
    }

    function setNetPositionsData(response) {
        let positions = response.data.positions
        let todaypal = 0
        positions = positions.map((item) => {
            item.openVal = ""
            item.mtm = item.unRealizedPnl
            item.ordAction = parseInt(replaceComma(item.netQty)) >= 0 ?
                (ORDER_TYPES.BUY).toLowerCase() : parseInt(replaceComma(item.netQty)) < 0 ?
                    (ORDER_TYPES.SELL).toLowerCase() : ""
            item.buyVal = ((parseInt(replaceComma(item.buyQty)) *
                parseInt(item.sym.multiplier)) * parseFloat(replaceComma(item.buyAvgPrice))).toString()
            item.sellVal = ((parseInt(replaceComma(item.sellQty)) *
                parseInt(item.sym.multiplier)) * parseFloat(replaceComma(item.sellAvgPrice))).toString()
            // item.pnl = convertCommaSeparated((((parseFloat(replaceComma(item.ltp)) -
            //     parseFloat(replaceComma(item.avgPrice))) * (parseInt(replaceComma(item.netQty)) *
            //         parseInt(item.sym.multiplier))) + parseFloat(replaceComma(item.bookedPnl))),
            // getDecimal_Precision(item.sym.exc)).toString()
            item.pnl = convertCommaSeparated((((parseFloat(replaceComma(item.ltp)) -
                parseFloat(replaceComma(item.avgPrice))) * (parseInt(replaceComma(item.netQty)) *
                    parseInt(item.sym.multiplier))) + parseFloat(replaceComma(item.bookedPnl))))
            if (item.chng)
                // item.daypnl = (parseInt(item.chng) * (parseInt(replaceComma(item.netQty)) *
                //     parseInt(item.sym.multiplier))) + parseFloat(replaceComma(item.bookedPnl)).toString()
                // item.daypnl = convertCommaSeparated((((parseFloat(replaceComma(item.ltp))) -
                // parseFloat(replaceComma(item.close)))) * (parseInt(replaceComma(item.netQty))))
                todaypal = (parseFloat(todaypal) + parseFloat(replaceComma(item.pnl)))
            item.marketVal = (parseFloat(replaceComma(item.ltp)) *
                (parseInt(replaceComma(item.netQty)) * parseInt(item.sym.multiplier))).toString()
            return item
        })

        setNetPositionsList(positions)
        streamingSubscription(positions)
    }

    function streamingSubscription(symArrayList) {
        let symbols = symArrayList.map(l => l.sym)
        props.forceSubscribeLevel1(symbols, [STREAMING_KEYS.LTP, STREAMING_KEYS.CHANGE, STREAMING_KEYS.CHANGE_PER,
            STREAMING_KEYS.CLOSE])
    }

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function setStreamingResptoSymbols(resp) {
        let { data } = resp;
        let todaypal = 0
        let newList = netPositionsList.map(row => {
            if (row.sym.streamSym === data.symbol) {
                row = Object.assign({}, row, applyPaint(row, data));
                row.openVal = data.open ? data.open : row.openVal
                if (data.ltp) {
                    let value = (parseFloat(replaceComma(data.ltp)) -
                    parseFloat(replaceComma(row.avgPrice))) * (parseInt(replaceComma(row.netQty)) *
                     parseInt(row.sym.multiplier))
                    row.pnl = convertCommaSeparated((value +
                        parseFloat(replaceComma(row.bookedPnl))).toFixed(PRECISIONS.PORTFOLIO_PNL_CALC))
                    row.mtm = value.toFixed(PRECISIONS.PORTFOLIO_PNL_CALC)
                    row.marketVal = (parseFloat(replaceComma(data.ltp)) *
                    (parseInt(replaceComma(row.netQty)) * parseInt(row.sym.multiplier))).toString()
                }

                if (data.chng) {
                    // row.daypnl = (convertCommaSeparated(convertToFloat((parseFloat(data.chng) * 
                    // (parseInt(replaceComma(row.netQty)) * parseInt(row.sym.multiplier))) + 
                    // parseFloat(replaceComma(row.bookedPnl))))).toString()
                    row.daypnl = convertCommaSeparated((((parseFloat(replaceComma(row.ltp))) -
                parseFloat(replaceComma(row.close)))) * (parseInt(replaceComma(row.netQty)))).toString()
                }

                if (props.orderDialogDetails && props.orderDialogDetails.dialogName === 
                    ORDER_DIALOGS.NETPOSITION_DETAILS) {
                    if (props.orderDialogDetails.symData.sym && 
                        props.orderDialogDetails.symData.sym.id === row.sym.id) {
                        props.storePositionsDialogSymStreamingData(row)
                    }
                }
            }
            todaypal = (parseFloat(todaypal) + parseFloat(row.pnl))
            return row;
        })
        setNetPositionsList(newList)
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
        setNetPositionsList(sortedSymList)
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
        setNetPositionsList(sortedSymList)
        if (symArray && symArray.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1)
            setSortFlag(updatedSortFlag)
        }
    }

    function resetSortIcons() {
        let flags = Object.assign([], sortFlag)
        let updatedFlags = flags.map((item) => {
            item.sortAsc = null
            return item
        })
        setSortFlag(updatedFlags)
    }

    function onClickTab() {
        if (props.selectedDashBoardWidgetMode !== DASHBOARD_WIDGET_MODE.QUOTE_VIEW) {
            if (props.selectedTab !== DASHBOARD_ORDER_TABS.NET_POSITIONS) {
                getNetPositions()
                props.onSelectTab(DASHBOARD_ORDER_TABS.NET_POSITIONS)
            } else if (props.orderPadDialog && props.orderPadDialog.dialogName) {
                getNetPositions()
                props.onSelectTab(DASHBOARD_ORDER_TABS.NET_POSITIONS)
            }
        } else {
            getNetPositions()
            props.onSelectTab(DASHBOARD_ORDER_TABS.NET_POSITIONS)
        }
    }

    return (
        <div className={`tab ${(props.selectedTab === DASHBOARD_ORDER_TABS.NET_POSITIONS) ? 'selected' : ''}`}
            onClick={onClickTab}
        >
            <div className="label">
                <span className="head"><LangText module="HEADER" name="NET_POSN" /></span>
                <span className="valueLabel"><LangText module="HEADER" name="TOTAL_PNL" /></span>
            </div>
            <div className="value netPostions">
                <span className={getColorCode(totalPNL)}>{checkEmpty(totalPNL)}</span>
            </div>
        </div>
    )
}

const mapStateToProps = ({ netPosition, dashboard, order, orderPad }) => {
    return {
        netPositionsSortData: netPosition.netPositionsSortData,
        regetNetPositions: netPosition.regetNetPositions,
        selectedDashBoardWidgetMode: dashboard.selectedWidgetMode,
        orderDialogDetails: order.dialog,
        orderPadDialog: orderPad.dialog
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storePositionsDialogSymStreamingData: (s) => { dispatch(storePositionsDialogSymStreamingData(s)) },
        storeRegetNetPositions: (s) => { dispatch(storeRegetNetPositions(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStreaming(NetPositionHeaderTabComponent));