import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import LangText from '../../../../common/lang/LangText';
import {
    AF_EventTriggered,
    checkEmpty, getBackOfficeBaseURL, getColorCode,
} from '../../../../common/CommonMethods';

import { BO_REPORT_SERVICE } from '../../../../config/ServiceURLs'

import { WidgetLoader } from '../../../common/WidgetLoaderComponent';
import { AF_EVENT_NAMES, AF_EVENT_TYPES, TEXT_ORIENTATION } from '../../../../common/Constants';

function LTCGReportComponent(props) {

    const MsfFetch = useFetch()

    const [resultArray, setResultArray] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    const [total, setTotal] = useState('')
    const [totalShort, setTotalShort] = useState('')
    const [totalLong, setTotalLong] = useState('')

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DAYS_TO_LONG_TERM)
    },[])

    useEffect(() => {
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
        getBOReports()
    }, [])

    function getBOReports() {
        props.showWidgetLoader();
        setResultArray([])
        setErrorMsg(null)
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + BO_REPORT_SERVICE.LTCG_REPORT,
            request,
            successRespCBGetBOReport,
            errorRespCBGetBOReport
        )
    }

    function successRespCBGetBOReport(response) {
        props.hideWidgetLoader();
        setResultArray(response.data.report)
        setTotal(response.data.total)
        setTotalLong(response.data.ttlLongTermTax)
        setTotalShort(response.data.ttlShrtTermTax)
        props.pdfDownloadUrl(response.data.pdfDownloadUrl.url)
        props.xlsxDownloadUrl(response.data.excelDownloadUrl.url)
        setErrorMsg(null)
        props.downloadUrl(true)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD_SUCCESS)

    }

    function errorRespCBGetBOReport(error) {
        props.hideWidgetLoader();
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
        setErrorMsg(error.message)
        props.downloadUrl(false)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD_FAILURE)

    }

    return (
        <div className="bo-baseTable">
            <table className="bo-table ltcg-report">
                {
                    (resultArray && resultArray.length) ?
                        <thead className="thead-scroller">
                            <tr>
                                <th className="firstChild width10d5">
                                    <span className="cursor">
                                        <LangText module="TABLE_HEADERS" name="TRADE_DATE" />
                                    </span>
                                </th>
                                <th className="ltcg-sym-head">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="SYMBOL" />
                                    </span>
                                </th>
                                <th className="width10d5">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="TOTAL_QTY"
                                            orientation={TEXT_ORIENTATION.UPPERCASE} />
                                    </span>
                                </th>
                                <th className="width10d5">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="CLOSING_PRICE" />
                                    </span>
                                </th>
                                <th className="width10d5">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="CURRENT_AMT" />
                                    </span>
                                </th>
                                <th className="width10d5">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="DAYS_LEFT" />
                                    </span>
                                </th>
                                <th className="short-term-tax">
                                    {/* <span> */}
                                    <span>
                                        <p className="first-text">
                                            <LangText module="TABLE_HEADERS" name="SHORT_TERM_TAX" /></p>
                                        <p><LangText module="LTCG_REPORT_HEADER_PERCENTAGE" name="FIFTEEN_PER_APPROX" />
                                        </p>
                                    </span>
                                </th>
                                <th className="long-term-tax">
                                    <span>
                                        <p className="first-text">
                                            <LangText module="TABLE_HEADERS" name="LONG_TERM_TAX" /></p>
                                        <p><LangText module="LTCG_REPORT_HEADER_PERCENTAGE" name="TEN_PER_APPROX" />
                                        </p>
                                    </span>
                                </th>
                                <th className="width10d5">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="UNREALIZED_PNL" />
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
                        (resultArray && resultArray.length) ?
                            resultArray.map((item, index) => {
                                return (
                                    <>
                                        <tr key={index}>
                                            <td className="firstChild width10d5">
                                                <span className>{checkEmpty(item.trdDte)}</span>
                                            </td>
                                            <td className="ltcg-sym">
                                                <span>{checkEmpty(item.stckName)}</span>
                                            </td>
                                            <td className="width10d5">
                                                <span>{checkEmpty(item.totlQty)}</span>
                                            </td>
                                            <td className="width10d5">
                                                <span>{checkEmpty(item.clRte)}</span>
                                            </td>
                                            <td className="width10d5">
                                                <span>{checkEmpty(item.currVal)}</span>
                                            </td>
                                            <td className="width10d5">
                                                <span>{checkEmpty(item.daysLeft)}</span>
                                            </td>
                                            <td className="width10d5">
                                                <span>{checkEmpty(item.shrtTermTax)}</span>
                                            </td>
                                            <td className="width10d5">
                                                <span>{checkEmpty(item.longTermTax)}</span>
                                            </td>
                                            <td className="width10d5">
                                                <span className={getColorCode(item.unRlzdPrft)}>
                                                    {checkEmpty(item.unRlzdPrft)}</span>
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
                    (total) ?
                        <tfoot className="ltcg-total-footer">
                            <>
                                <tr className="ltcg-totalRow">
                                    <td className="firstchild">
                                        <span className="ltcg-total-text">
                                            <LangText module="BO" name="TOTAL" /></span>
                                    </td>
                                    <td className="ltcg-total-short" >
                                        <span>{totalShort}</span>
                                    </td>
                                    <td className="ltcg-total-long" >
                                        <span>{totalLong}</span>
                                    </td>
                                    <td className="ltcg-total" >
                                        <span className={getColorCode(total)}>{total}</span>
                                    </td>

                                </tr>
                            </>
                        </tfoot>
                        :
                        null

                }
            </table>
        </div >
    )
}
export default (WidgetLoader(LTCGReportComponent));

