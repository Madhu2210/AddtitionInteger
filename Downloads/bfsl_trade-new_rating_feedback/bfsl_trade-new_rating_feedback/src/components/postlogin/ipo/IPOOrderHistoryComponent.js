import React, { useEffect, useRef, useState } from 'react'
import { useFetch, MsfRequest, withStreaming } from '../../../index'

import { WidgetLoader } from '../../common/WidgetLoaderComponent'
import LangText from '../../../common/lang/LangText'

import { IPO_SERVICES } from '../../../config/ServiceURLs'

import {
    getBackOfficeBaseURL, checkEmpty, convertToUpperCase, applyPaint,
    replaceComma, convertCommaSeparated, getDecimal_Precision, AF_EventTriggered
} from '../../../common/CommonMethods'
import { AF_EVENT_NAMES, AF_EVENT_TYPES, IPO_ORDER_HISTORY_STATUS, STREAMING_KEYS, STREAMING_MODULES } 
from '../../../common/Constants'

function IPOOrderHistoryComponent(props) {

    const MsfFetch = useFetch()

    const [orderHistoryIPO, setOrderHistoryIPO] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    const [streamingResp, setStreamingResp] = useState({})

    const isPendingRequest = useRef(false)

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.IPO , AF_EVENT_TYPES.IPO_ORDER_HISTORY)
    }, [])

    useEffect(() => {
        getOrderHistoryIPO()
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.IPO_ORDER_HISTORY);
    }, [])

    useEffect(() => {
        if (streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function streamingSubscription(symArrayList) {
        let symbols = symArrayList.map(l => l.sym)
        props.subscribeLevel1(
            symbols,
            [STREAMING_KEYS.LTP]
        )
    }

    function setStreamingResptoSymbols(resp) {
        let { data } = resp;
        let newList = orderHistoryIPO.map(row => {
            if (row.sym && row.sym.streamSym === data.symbol) {
                if (data.ltp)
                    row.pnl = parseFloat(replaceComma(row.avgPrice)) ?
                        convertCommaSeparated(((parseFloat(replaceComma(data.ltp)) -
                            parseFloat(replaceComma(row.avgPrice))) * parseFloat(row.qty)).toString(),
                        getDecimal_Precision(row.sym.exc))
                        : "0.00"
                row = Object.assign({}, row, applyPaint(row, data));
            }
            return row;
        })
        if (newList.length)
            setOrderHistoryIPO(newList)
    }

    function getOrderHistoryIPO() {
        isPendingRequest.current = true
        props.showWidgetLoader()
        setOrderHistoryIPO([])
        setErrorMsg(null)
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + IPO_SERVICES.IPO_ORDER_HISTORY,
            request,
            successRespCBGetOrderHistoryIPO,
            errorRespCBGetOrderHistoryIPO
        )
    }

    function successRespCBGetOrderHistoryIPO(response) {
        isPendingRequest.current = false
        let dataList = response.data.records
        setOrderHistoryIPO(dataList)
        let symList = dataList.filter(item => { return item.sym })
        streamingSubscription(symList)
        setErrorMsg(null)
        props.hideWidgetLoader()
    }

    function errorRespCBGetOrderHistoryIPO(error) {
        isPendingRequest.current = false
        setOrderHistoryIPO([])
        setErrorMsg(error.message)
        props.hideWidgetLoader()
    }

    function getStatusColorClass(statusColor) {
        statusColor = convertToUpperCase(statusColor)
        if (statusColor === IPO_ORDER_HISTORY_STATUS.ALLOTTED)
            return 'positiveColor'
        else if (statusColor === IPO_ORDER_HISTORY_STATUS.NOT_ALLOTTED)
            return 'negativeColor'
        return ''
    }

    return (
        <div className="ipo-content-base">
            <div className="IPO-table">
                {
                    (orderHistoryIPO && orderHistoryIPO.length) ?
                        orderHistoryIPO.map((item, index) => {
                            return (
                                <div key={index} className="dataRow">
                                    <div className="name">
                                        {checkEmpty(item.ipoNme)}
                                        <span className="appliNo">
                                            (<LangText name="APPLICATION_NO" module="IPO" /> :
                                            {checkEmpty(item.applicationNo)})</span>
                                    </div>
                                    <div className="data">
                                        <div className="column first">
                                            <span className="label"><LangText name="SYMBOL" module="IPO" /></span>
                                            <span className="value">{checkEmpty(item.ipoBidNme)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label">
                                                <LangText name="PRICE" module="TABLE_HEADERS" /></span>
                                            <span className="value">{checkEmpty(item.price)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="LTP" module="IPO" /></span>
                                            <span className="value">{checkEmpty(item.ltp)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label">
                                                <LangText name="QUANTITY" module="TABLE_HEADERS" /></span>
                                            <span className="value">{checkEmpty(item.qty)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="BID_ID" module="IPO" /></span>
                                            <span className="value">{checkEmpty(item.bidNum)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="STATUS" module="IPO" /></span>
                                            <span className=
                                                {`value ${getStatusColorClass(item.alotStatus)}`}>
                                                {convertToUpperCase(checkEmpty(item.alotStatus))}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        :
                        <div className="errorDiv flex-center">
                            {errorMsg ? errorMsg : !isPendingRequest.current ?
                                <LangText name="COMMON_NO_DATA" module="MESSAGES" /> : ''}
                        </div>
                }
            </div>
        </div>
    )
}

export default WidgetLoader(withStreaming(IPOOrderHistoryComponent));