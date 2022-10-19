import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useFetch, MsfRequest, withStreaming } from '../../../index'

import LangText from '../../../common/lang/LangText'
import { WidgetLoader } from '../../common/WidgetLoaderComponent'
import { LazyLoading } from '../LazyLoadingHOC'

import { QUOTE } from '../../../config/ServiceURLs'

import { getMarketDataBaseURL, applyPaint, checkEmpty } from '../../../common/CommonMethods'
import { CommonErrorMessages } from '../../../common/Messages'
import { STREAMING_KEYS, STREAMING_MODULES, TEXT_ORIENTATION } from '../../../common/Constants'

const OptionChainComponent = (props) => {

    const MsfFetch = useFetch()

    const [putSymList, setPutSymList] = useState([])
    const [callSymList, setCallSymList] = useState([])
    const [primaryList, setPrimaryList] = useState([])
    const [expiryDateList, setExpiryDateList] = useState([])
    // const [streamingDataList, setStreamingDataList] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    const [streamingResp, setStreamingResp] = useState(null)
    const [currselectedDate, setSelctedDate] = useState(null);

    const isPendingReq = useRef(null)

    useEffect(() => {
        props.setDisableLazyLoad(true)
        props.setElementRowHeight(65)
        props.setScrollRef(document.getElementById('scrollTable'))
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.OPTION_CHAIN);
    }, [])

    useEffect(() => {
        if (props.selectedSym) {
            getExpiryDateList()
        } else {
            setExpiryDateList([])
            setPutSymList([])
            setCallSymList([])
            setPrimaryList([])
        }
    }, [props.selectedSym])

    useEffect(() => {
        if (streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    useEffect(() => {
        if (currselectedDate)
            getOptionList(currselectedDate)
    }, [currselectedDate])

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function streamingSubscription(symArrayList) {
        let symbols = symArrayList.map(l => l.sym)
        props.subscribeLevel1(
            symbols,
            [STREAMING_KEYS.LTP, STREAMING_KEYS.CHANGE, STREAMING_KEYS.CHANGE_PER, STREAMING_KEYS.VOLUME]
        )
    }

    function setStreamingResptoSymbols(resp) {
        if (resp) {
            let { data } = resp;
            let newPutSymList = putSymList.map(row => {
                if (row.sym.streamSym === data.symbol) {
                    row = Object.assign({}, row, applyPaint(row, data));
                }
                return row;
            })
            setPutSymList(newPutSymList)

            let newCallSymList = callSymList.map(row => {
                if (row.sym.streamSym === data.symbol) {
                    row = Object.assign({}, row, applyPaint(row, data));
                }
                return row;
            })
            setCallSymList(newCallSymList)

        }
    }

    function getExpiryDateList() {
        setExpiryDateList([])
        setPutSymList([])
        setCallSymList([])
        setPrimaryList([])
        setErrorMsg(null)
        props.showWidgetLoader();
        isPendingReq.current = true
        let request = new MsfRequest();
        request.addToData({
            "sym": props.selectedSym,
            "dispSym": props.selectedSym.dispSym,
            "baseSym": props.selectedSym.baseSym,
            "filters": [
                {
                    "key": "segment",
                    "value": "opt"
                },
                {
                    "key": "optionType",
                    "value": "CE"
                }
            ]
        })
        request.setEncrypt(false)
        MsfFetch.placeRequest(
            getMarketDataBaseURL() + QUOTE.GET_EXPIRY_DATE,
            request,
            successRespGetExpiryDateList,
            errorRespCBGetExpiryDateList
        )
    }

    function successRespGetExpiryDateList(response) {
        if (response.data.results && response.data.results.length) {
            let newList = []
            response.data.results.map((item) => {
                let dateObj = {
                    'date': item
                }
                newList.push(dateObj)
            })

            setExpiryDateList(newList)
            // getOptionList(newList[0])
            setSelctedDate(newList[0])
        } else {
            isPendingReq.current = false
            props.hideWidgetLoader();
        }
    }

    function errorRespCBGetExpiryDateList(error) {
        isPendingReq.current = false
        setErrorMsg(error.message)
        setExpiryDateList([])
        props.hideWidgetLoader();
    }

    function getOptionList(selectedDate) {
        props.showWidgetLoader();
        isPendingReq.current = true
        let request = new MsfRequest();
        setPutSymList([])
        setCallSymList([])
        setPrimaryList([])
        setErrorMsg(null)
        request.addToData({
            "sym": props.selectedSym,
            "dispSym": props.selectedSym.dispSym,
            "baseSym": props.selectedSym.baseSym,
            "expiry": selectedDate.date
        })
        request.setEncrypt(false)
        MsfFetch.placeRequest(
            getMarketDataBaseURL() + QUOTE.OPTION_CHAIN,
            request,
            successRespGetOptionList,
            errorRespCBGetOptionList
        )
    }

    function successRespGetOptionList(response) {
        isPendingReq.current = false
        if (response.data.results) {
            let putList = response.data.results.put
            let callList = response.data.results.call
            if (putList && callList) {
                setPutSymList(putList)
                setCallSymList(callList)
                if (putList.length && callList.length) {
                    let combinedList = putList.concat(callList)
                    streamingSubscription(combinedList)
                    // setStreamingDataList(combinedList)
                    if (response.data.results.call.length >= response.data.results.put.length)
                        setPrimaryList(response.data.results.call)
                    else
                        setPrimaryList(response.data.results.putt)
                }
            }
        }
        props.hideWidgetLoader();
    }

    function errorRespCBGetOptionList(error) {
        isPendingReq.current = false
        setPutSymList([])
        setCallSymList([])
        setErrorMsg(error.message)
        props.hideWidgetLoader();
    }

    function onSelectExpiry(selectedDate) {
        if (currselectedDate !== selectedDate) {
            setSelctedDate(selectedDate)
        }
    }

    return (
        useMemo(() => {
            return (
                <div className={`optionChain-base ${(expiryDateList && expiryDateList.length) ?
                    'hasExpiry' : 'noExpiry'}`}>
                    {/* {console.log('renderCheck Options')} */}
                    {
                        (expiryDateList && expiryDateList.length) ?
                            <div className="sub-header expiry datescroller">
                                <span className="dateLabel">
                                    <LangText module="QUOTE" name="EXPIRY" orientation={TEXT_ORIENTATION.LOWERCASE} /> :
                                </span>
                                {
                                    expiryDateList.map((item, index) => {
                                        return (
                                            <span key={index}
                                                onClick={() => onSelectExpiry(item)}
                                                className={`dateItem cursor ${currselectedDate === item ?
                                                    'selected' : ''}`}>
                                                {item.date}
                                            </span>
                                        )
                                    })
                                }
                            </div>
                            : null
                    }
                    <table className={(primaryList && primaryList.length) ? 'hasValue' : ''}>
                        <thead className={`thead-scroller thead1`}>
                            <tr>
                                <th style={{ textAlign: 'center' }} colSpan="3">
                                    <LangText module="TABLE_HEADERS" name="CALL_QUOTE" /></th>
                                <th className={`strikePrice ${(primaryList && primaryList.length) ?
                                    'bgColor' : ''}`} colSpan="1"></th>
                                <th style={{ textAlign: 'center' }} colSpan="3">
                                    <LangText module="TABLE_HEADERS" name="PUT" /></th>
                            </tr>
                        </thead>
                        <thead className={`thead-scroller  thead2`}>
                            <tr>
                                <th className="firstChild">
                                    <span className="cursor">
                                        <LangText module="TABLE_HEADERS" name="LTP" />
                                    </span>
                                </th>
                                <th className="center">
                                    <span className="cursor">
                                        <LangText module="TABLE_HEADERS" name="OI" />
                                    </span>
                                </th>
                                <th className="nearLeft">
                                    <span className="cursor">
                                        <LangText module="TABLE_HEADERS" name="VOLUME" />
                                    </span>
                                </th>
                                <th className={`strikePrice ${(primaryList && primaryList.length) ? 'bgColor' : ''}`}>
                                    <LangText module="TABLE_HEADERS" name="STRIKE_PRICE" />
                                </th>
                                <th className="firstChild nearRight">
                                    <span className="cursor">
                                        <LangText module="TABLE_HEADERS" name="VOLUME" />
                                    </span>
                                </th>
                                <th className="nearRight center">
                                    <span className="cursor">
                                        <LangText module="TABLE_HEADERS" name="OI" />
                                    </span>
                                </th>
                                <th className="lastChild">
                                    <span className="cursor">
                                        <LangText module="TABLE_HEADERS" name="LTP" />
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody id="scrollTable" className="tbody-scroller scroller_firefox">
                            {
                                (primaryList && primaryList.length) ?
                                    primaryList.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                {
                                                    callSymList[index] ?
                                                        <>
                                                            <td className="firstChild">
                                                                <span className={callSymList[index].ltpClass}>
                                                                    {checkEmpty(callSymList[index].ltp)}</span>
                                                            </td>
                                                            <td className="center">
                                                                {checkEmpty(callSymList[index].OI)}</td>
                                                            <td className="nearLeft">
                                                                {checkEmpty(callSymList[index].vol)}</td>
                                                        </>
                                                        :
                                                        <>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                        </>
                                                }

                                                <td className="strikePrice">
                                                    {checkEmpty(primaryList[index].sym.strike)}</td>

                                                {
                                                    putSymList[index] ?
                                                        <>
                                                            <td className="firstChild nearRight">
                                                                {checkEmpty(putSymList[index].vol)}</td>
                                                            <td className="nearRight center">
                                                                {checkEmpty(putSymList[index].OI)}</td>
                                                            <td className="lastChild">
                                                                <span className={callSymList[index].ltpClass}>
                                                                    {checkEmpty(putSymList[index].ltp)}</span>
                                                            </td>
                                                        </>
                                                        :
                                                        <>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                        </>
                                                }
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr>
                                        <td className="colspan">{errorMsg ? errorMsg : 
                                            (!isPendingReq.current ? CommonErrorMessages.NO_DATA_AVAIL : '')}</td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
            )
        }, [isPendingReq.current, errorMsg, callSymList, putSymList, primaryList, currselectedDate, expiryDateList])
    )
}

export default WidgetLoader(withStreaming(LazyLoading(OptionChainComponent)));