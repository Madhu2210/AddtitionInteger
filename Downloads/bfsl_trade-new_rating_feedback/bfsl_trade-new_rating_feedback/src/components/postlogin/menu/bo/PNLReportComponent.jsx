import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import LangText from '../../../../common/lang/LangText';
import {
    AF_EventTriggered,
    cacheSearch,
    checkEmpty, getBackOfficeBaseURL, getColorCode, 
    getDispTradeSymbolName, getFormatedDate} from '../../../../common/CommonMethods';

import { BO_REPORT_SERVICE } from '../../../../config/ServiceURLs'

import { WidgetLoader } from '../../../common/WidgetLoaderComponent';
import { AF_EVENT_NAMES, AF_EVENT_TYPES, BO_REPORT_TYPES, DATE_FORMATS, 
    TEXT_ORIENTATION } from '../../../../common/Constants';

function PNLReportComponent(props) {
    // console.log('props :', props);

    const MsfFetch = useFetch()

    const [resultArrayEquity, setResultArrayEquity] = useState([])
    const [resultArrayDerivative, setResultArrayDerivative] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    const [selectedOrderType, setSelectedOrderType] = useState('')
    const [totalRealizedPNL, setTotalRealizedPNL] = useState('')
    const [totalUnRealizedPNL, setTotalUnRealizedPNL] = useState('')
    const [grandTotalPNL, setGrandTotalPNL] = useState('')
    const [totalRealizedPNLPer, setTotalRealizedPNLPer] = useState('')
    const [totalUnRealizedPNLPer, setTotalUnRealizedPNLPer] = useState('')
    const [PNLEquityList, setPNLEquityList] = useState([])
    const [PNLDerivativeList, setPNLDerivativeList] = useState([])

    // const [streamingResp, setStreamingResp] = useState({})

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.PNL_REPORT)
    },[])

    useEffect(() => {
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
        // getBOPNLReports()
    }, [])

    useEffect(() => {
        getBOPNLReports(props.frmDte, props.toDte)
    }, [props.frmDte, props.toDte, props.selectedOrderType, props.chosenHoldingType])

    // useEffect(() => {
    //     props.registerStreamCB(onStreamCB, STREAMING_MODULES.PNL_REPORT_BO);
    // }, [])

    // useEffect(() => {
    //     if (streamingResp !== {})
    //         setStreamingResptoSymbols(streamingResp)
    // }, [streamingResp])

    // function onStreamCB(resp) {
    //     setStreamingResp(resp)
    // }

    // function streamingSubscription(symArrayList) {
    //     let symbols = symArrayList.map(l => l.sym)
    //     console.log('symbols :', symbols,symArrayList.symlist);
    //     props.forceSubscribeLevel1(
    //         symbols,
    //         [STREAMING_KEYS.LTP, STREAMING_KEYS.CHANGE, STREAMING_KEYS.CHANGE_PER, STREAMING_KEYS.VOLUME]
    //     )
    // }

    // function setStreamingResptoSymbols(resp) {
    //     let { data } = resp;
    //     let newList = resultArrayDerivative.map(row => {
    //         if (row.sym) {
    //             if (row.sym.streamSym === data.symbol) {
    //                 row = Object.assign({}, row, applyPaint(row, data));
    //             }
    //         }
    //         return row;
    //     })
    //     if (newList.length)
    //         setResultArrayDerivative(newList)
    // }

    useEffect(() => {
        let list;
        if (props.selectedOrderType === BO_REPORT_TYPES[0]) {
            list = Object.assign([], PNLEquityList)
            if (props.searchValue) {
                list = list.map(item => {
                    item.queryString = getDispTradeSymbolName(item).primaryName + ' ' + item.baseSym
                    item.queryString2 = getDispTradeSymbolName(item).secondaryName + ' ' + item.baseSym
                    return item
                })
                let filteredList = cacheSearch(props.searchValue.trim(), list, "queryString", "queryString2")
                if (filteredList.length === 0)
                    setErrorMsg('No Data Available')
                setResultArrayEquity(filteredList)
            }
            else {
                setResultArrayEquity(list)
            }
        }
        if (props.selectedOrderType === BO_REPORT_TYPES[1]) {
            list = Object.assign([], PNLDerivativeList)
            if (props.searchValue) {
                list = list.map(item => {
                    item.queryString = getDispTradeSymbolName(item).primaryName + ' ' + item.dispSym
                    item.queryString2 = getDispTradeSymbolName(item).secondaryName + ' ' + item.dispSym
                    return item
                })
                let filteredList = cacheSearch(props.searchValue.trim(), list, "queryString", "queryString2")
                if (filteredList.length === 0)
                    setErrorMsg('No Data Available')
                setResultArrayDerivative(filteredList)
            }
            else {
                setResultArrayDerivative(list)
            }
        }
    }, [props.searchValue, PNLEquityList, PNLDerivativeList])

    function getBOPNLReports(from, to) {
        props.showWidgetLoader();
        setResultArrayEquity([])
        setResultArrayDerivative([])
        setErrorMsg(null)
        let request = new MsfRequest();
        request.addToData({
            "filters": [
                {
                    "key": "holding",
                    "value": props.chosenHoldingType
                }
            ],
            "frmDte": getFormatedDate(from, 0, DATE_FORMATS.DDMMYYYY, true).stringDate,
            "toDte": getFormatedDate(to, 0, DATE_FORMATS.DDMMYYYY, true).stringDate,
        })
        // console.log("request pnl", request)
        if (props.selectedOrderType === BO_REPORT_TYPES[0]) {
            setSelectedOrderType("equity")
            MsfFetch.placeRequest(
                getBackOfficeBaseURL() + BO_REPORT_SERVICE.PNL_REPORT_EQUITY,
                request,
                successRespCBGetPNLReport,
                errorRespCBGetPNLReport
            )
        }
        else {
            setSelectedOrderType("derivative")
            MsfFetch.placeRequest(
                getBackOfficeBaseURL() + BO_REPORT_SERVICE.PNL_REPORT_DERIVATIVE,
                request,
                successRespCBGetPNLReport,
                errorRespCBGetPNLReport
            )
        }
    }

    function successRespCBGetPNLReport(response) {
        props.hideWidgetLoader();
        // holdingsFilterType(response.data.report)
        if (props.selectedOrderType === BO_REPORT_TYPES[0]) {
            setPNLEquityList(response.data.report)
            setResultArrayEquity(response.data.report)
        }
        else {
            setPNLDerivativeList(response.data.report)
            setResultArrayDerivative(response.data.report)
            // streamingSubscription(response.data.report)
        }

        setTotalRealizedPNL(response.data.totalRealisedPnl)
        setTotalRealizedPNLPer(response.data.totalRlsdPnlPer)
        setTotalUnRealizedPNL(response.data.totalunRealizedPnl)
        setTotalUnRealizedPNLPer(response.data.totalunRlsdPnlPer)
        setGrandTotalPNL(response.data.ttlpnltotal)

        props.pdfDownloadUrl(response.data.pdfDownloadUrl.url)
        props.xlsxDownloadUrl(response.data.excelDownloadUrl.url)
        props.downloadUrl(true)
        setErrorMsg(null)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD_SUCCESS)

    }

    function errorRespCBGetPNLReport(error) {
        props.hideWidgetLoader();
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
        props.downloadUrl(false)
        setErrorMsg(error.message)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD_FAILURE)

    }

    return (
        <div className="bo-baseTable">
            {props.selectedOrderType === BO_REPORT_TYPES[0] ?
                <table className="bo-table pnl-report">
                    {
                        (resultArrayEquity && resultArrayEquity.length) ?
                            <thead className="thead-scroller">
                                <tr>
                                    <th className="firstChild width22">
                                        <span className="cursor">
                                            <LangText module="TABLE_HEADERS" name="SYMBOL" />
                                        </span>
                                    </th>
                                    <th className="width7">
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="NET_QTY" />
                                        </span>
                                    </th>
                                    <th className="width9">
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="AVG_PRICE" />
                                        </span>
                                    </th>
                                    <th className="width11">
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="CURRENT_PRICE" />
                                        </span>
                                    </th>
                                    <th className="width11">
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="INVESTMENT_AMT" />
                                        </span>
                                    </th>
                                    <th className="width11">
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="CURRENT_VALUE" 
                                                orientation={TEXT_ORIENTATION.UPPERCASE}/>
                                        </span>
                                    </th>
                                    <th className="width14">
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="REALIZED_PNL" />
                                        </span>
                                    </th>
                                    <th className="width14">
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="UNREALIZED_PNL" />
                                        </span>
                                    </th>
                                    <th className="width12">
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="TOTAL_PNL" />
                                        </span>
                                    </th>
                                </tr>
                            </thead> :
                            <tr className="errorRow">
                                <td className="colspan">{errorMsg}</td>
                            </tr>
                    }
                    <tbody className="tbody-scroller">
                        {
                            (resultArrayEquity && resultArrayEquity.length) ?
                                resultArrayEquity.map((item, index) => {
                                    return (
                                        <>
                                            <tr key={index}>
                                                <td className="firstChild width22">
                                                    <span className>{selectedOrderType === "equity" ?
                                                        checkEmpty(item.baseSym) : checkEmpty(item.dispSym)}</span>
                                                </td>
                                                <td className="width7" >
                                                    <span>{checkEmpty(item.netQty)}</span>
                                                </td>
                                                <td className="width9">
                                                    <span>{checkEmpty(item.avgPrc)}</span>
                                                </td>
                                                <td className="width11">
                                                    <span>{checkEmpty(item.cntAmt)}</span>
                                                </td>
                                                <td className="width11">
                                                    <span>{checkEmpty(item.invsmtAmt)}</span>
                                                </td>
                                                <td className="width11">
                                                    <span>{checkEmpty(item.crntAmt)}</span>
                                                </td>
                                                <td className="width14">
                                                    <span className={getColorCode(item.realisedPnl)}>
                                                        {checkEmpty(item.realisedPnl)}
                                                        ({checkEmpty(item.realisedPnlPer)}%)</span>
                                                </td>
                                                <td className="width14">
                                                    <span className={getColorCode(item.unRealisedPnl)}>
                                                        {checkEmpty(item.unRealisedPnl)}
                                                        ({checkEmpty(item.unRealisedPnlPer)}%)</span>
                                                </td>
                                                <td className="width12">
                                                    <span className={getColorCode(item.totalPnl)}>
                                                        {checkEmpty(item.totalPnl)}</span>
                                                </td>
                                            </tr>
                                        </>

                                    )
                                })
                                :
                                // <tr className="errorRow">
                                //     <td className="colspan"> {errorMsg}</td>
                                // </tr>
                                null
                        }
                    </tbody>
                    {
                        (resultArrayEquity && resultArrayEquity.length > 0) ?
                            <tfoot className="pnl-total-footer">
                                <>
                                    <tr className="pnl-totalRow">
                                        <td className="firstchild">
                                            <span className="pnl-total-text">
                                                <LangText module="BO" name="TOTAL" /></span>
                                        </td>
                                        <td className="pnl-total-realized" >
                                            <span className={getColorCode(totalRealizedPNL)}>{totalRealizedPNL}
                                                ({totalRealizedPNLPer}%)</span>
                                        </td>
                                        <td className="pnl-total-unrealized" >
                                            <span className={getColorCode(totalUnRealizedPNL)}>{totalUnRealizedPNL}
                                                ({totalUnRealizedPNLPer}%)</span>
                                        </td>
                                        <td className="pnl-total-totalOfTotal" >
                                            <span className={getColorCode(grandTotalPNL)}>{grandTotalPNL}</span>
                                        </td>

                                    </tr>
                                </>
                            </tfoot>
                            :
                            null

                    }
                </table>
                :
                <table className="bo-table pnl-report">
                    {
                        (resultArrayDerivative && resultArrayDerivative.length) ?
                            <thead className="thead-scroller">
                                <tr>
                                    <th className="firstChild">
                                        <span className="cursor">
                                            <LangText module="TABLE_HEADERS" name="SYMBOL" />
                                        </span>
                                    </th>
                                    <th className="width11" >
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="NET_QTY" />
                                        </span>
                                    </th>
                                    <th className="width11">
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="BUY_QTY" />
                                        </span>
                                    </th>
                                    <th className="width11">
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="SELL_QTY" />
                                        </span>
                                    </th>
                                    <th className="width11">
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="BUY_RATE" />
                                        </span>
                                    </th>
                                    <th className="width11">
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="SELL_RATE" />
                                        </span>
                                    </th>
                                    {/* Took down the column on 20-01-2022 UAT release */}
                                    {/* <th className="current-price-head">
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="CURRENT_PRICE" />
                                        </span>
                                    </th> */}
                                    <th className="realized-pnl-head">
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="REALIZED_PNL" />
                                        </span>
                                    </th>
                                    <th className="unrealized-pnl-head">
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="UNREALIZED_PNL" />
                                        </span>
                                    </th>
                                    <th className="total-pnl-head">
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="TOTAL_PNL" />
                                        </span>
                                    </th>
                                </tr>
                            </thead> :
                            <tr className="errorRow">
                                <td className="colspan"> {errorMsg}</td>
                            </tr>
                    }
                    <tbody className="tbody-scroller">
                        {
                            (resultArrayDerivative && resultArrayDerivative.length) ?
                                resultArrayDerivative.map((item, index) => {
                                    return (
                                        <>
                                            <tr key={index}>
                                                <td className="firstChild">
                                                    <span className>{checkEmpty(item.dispSym)}</span>
                                                </td>
                                                <td className="width11">
                                                    <span>{checkEmpty(item.netQty)}</span>
                                                </td>
                                                <td className="width11">
                                                    <span>{checkEmpty(item.buyQty)}</span>
                                                </td>
                                                <td className="width11">
                                                    <span>{checkEmpty(item.sellQty)}</span>
                                                </td>
                                                <td className="width11">
                                                    <span>{checkEmpty(item.buyRte)}</span>
                                                </td>
                                                <td className="width11">
                                                    <span>{checkEmpty(item.sellRte)}</span>
                                                </td>
                                                {/* Use ltp from streaming for current price */}
                                                {/* <td className="width10">
                                                    <span>{checkEmpty(item.ltp)}</span>
                                                </td> */}
                                                <td className="realized-pnl-data">
                                                    <span className={getColorCode(item.realisedPnl)}>
                                                        {checkEmpty(item.realisedPnl)}</span>
                                                </td>
                                                <td className="unrealized-pnl-data">
                                                    <span className={getColorCode(item.unRealisedPnl)}>
                                                        {checkEmpty(item.unRealisedPnl)}</span>
                                                </td>
                                                <td className="total-pnl-data">
                                                    <span className={getColorCode(item.totalPnl)}>
                                                        {checkEmpty(item.totalPnl)}</span>
                                                </td>
                                            </tr>
                                        </>

                                    )
                                })
                                :
                                // <tr className="errorRow">
                                //     <td className="colspan"> {errorMsg}</td>
                                // </tr>
                                null
                        }
                    </tbody>
                    {
                        (resultArrayDerivative && resultArrayDerivative.length > 0) ?
                            <tfoot className="pnl-total-footer">
                                <>
                                    <tr className="pnl-totalRow">
                                        <td className="firstchild derivative">
                                            <span className="pnl-total-text">
                                                <LangText module="BO" name="TOTAL" /></span>
                                        </td>
                                        <td className="pnl-total-realized derivative" >
                                            <span className={getColorCode(totalRealizedPNL)}>{totalRealizedPNL}</span>
                                        </td>
                                        <td className="pnl-total-unrealized derivative" >
                                            <span className={getColorCode(totalUnRealizedPNL)}>
                                                {totalUnRealizedPNL}</span>
                                        </td>
                                        <td className="pnl-total-totalOfTotal derivative" >
                                            <span className={getColorCode(grandTotalPNL)}>{grandTotalPNL}</span>
                                        </td>

                                    </tr>
                                </>
                            </tfoot>
                            :
                            null

                    }
                </table>
            }

        </div >
    )
}
export default (WidgetLoader(PNLReportComponent));

