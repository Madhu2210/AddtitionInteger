import React, { useEffect, useRef, useState } from 'react'
import { useFetch, MsfRequest } from '../../../index'

import { WidgetLoader } from '../../common/WidgetLoaderComponent'
import LangText from '../../../common/lang/LangText'

import {
    getBackOfficeBaseURL, checkEmpty, convertToFloat, findAndReplace,
    convertCommaSeparated,
    AF_EventTriggered
} from '../../../common/CommonMethods'
import { IPO_SERVICES } from '../../../config/ServiceURLs'
// import { TEXT_ORIENTATION } from '../../../common/Constants'
import { AF_EVENT_NAMES, AF_EVENT_TYPES, TEXT_ORIENTATION } from '../../../common/Constants'

function IPOOrderbookComponent(props) {

    const MsfFetch = useFetch()

    const [orderbookIPO, setOrderbookIPO] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)

    const isPendingRequest = useRef(false)

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.IPO , AF_EVENT_TYPES.IPO_ORDERBOOK)
    }, [])

    useEffect(() => {
        getOrderbookIPO()
    }, [])

    function getOrderbookIPO() {
        isPendingRequest.current = true
        props.showWidgetLoader()
        setOrderbookIPO([])
        setErrorMsg(null)
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + IPO_SERVICES.IPO_ORDERBOOK,
            request,
            successRespCBGetOrderbookIPO,
            errorRespCBGetOrderbookIPO
        )
    }

    function successRespCBGetOrderbookIPO(response) {
        isPendingRequest.current = false
        let list = response.data.records
        list.map((item) => {
            item.invesAmt = convertToFloat(convertToFloat(item.qty) * convertToFloat(findAndReplace(item.price, '₹')))
            return item
        })
        setOrderbookIPO(list)
        setErrorMsg(null)
        props.hideWidgetLoader()
    }

    function errorRespCBGetOrderbookIPO(error) {
        isPendingRequest.current = false
        setOrderbookIPO([])
        setErrorMsg(error.message)
        props.hideWidgetLoader()
    }

    return (
        <div className="ipo-content-base">
            <div className="IPO-table">
                {
                    (orderbookIPO && orderbookIPO.length) ?
                        orderbookIPO.map((item, index) => {
                            return (
                                <div key={index} className="dataRow">
                                    <div className="name">
                                        {checkEmpty(item.ipoNme)}
                                        <span className="appliNo">
                                            (<LangText name="APPLICATION_NO" module="IPO" />
                                            : {checkEmpty(item.applicationNo)})</span>
                                    </div>
                                    <div className="data">
                                        <div className="column first">
                                            <span className="label"><LangText name="SYMBOL" module="IPO" /></span>
                                            <span className="value">{checkEmpty(item.ipoBidNme)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="APPLIED_ON" module="IPO" /></span>
                                            <span className="value">{checkEmpty(item.applyDte)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label">
                                                <LangText name="PRICE" module="TABLE_HEADERS"
                                                    orientation={TEXT_ORIENTATION.UPPERCASE} /></span>
                                            <span className="value">{checkEmpty(item.price)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="ORDER_QTYY" module="IPO" /></span>
                                            <span className="value">{checkEmpty(item.qty)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="INVES_AMT" module="IPO" /></span>
                                            <span className="value">
                                                {item.invesAmt ? '₹' : ''}
                                                {checkEmpty(convertCommaSeparated(item.invesAmt))}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="ACTIONS_IPO" module="IPO" /></span>
                                            <span className="value">{checkEmpty(item.actType)}</span>
                                        </div>
                                        <div className="column statusCloumn">
                                            <span className="value-status">{checkEmpty(item.exchStatus)}</span>
                                            {/* <span className={`statusBtn ${getBtnClass(item.exchStatus)}`}>{item.exchStatus}</span> */}
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

export default WidgetLoader(IPOOrderbookComponent);