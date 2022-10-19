import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import LangText from '../../../../common/lang/LangText';
import { SORT_DATATYPE, DATE_FORMATS, SORT_TYPES, AF_EVENT_NAMES, AF_EVENT_TYPES } from '../../../../common/Constants';
import {
    checkEmpty, sortFlagFunc, sortByDateBO, getBackOfficeBaseURL,
    getFormatedDate,
    AF_EventTriggered
} from '../../../../common/CommonMethods';

import { SortIcon } from '../../../common/FontIcons';
import { BO_REPORT_SERVICE } from '../../../../config/ServiceURLs'

import { WidgetLoader } from '../../../common/WidgetLoaderComponent';

function FundTransactionComponent(props) {

    const MsfFetch = useFetch()

    const [resultArray, setResultArray] = useState([])
    const [sortFlag, setSortFlag] = useState(
        [
            { column: "date", sortAsc: null }
        ]
    )
    const [sortAsc, setSortAsc] = useState(true)
    const [errorMsg, setErrorMsg] = useState(null)
    const [resultTotalArray, setResultTotalArray] = useState({})
    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.FUND_TRANSACTIONS)
    },[])

    useEffect(() => {
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
    }, [props.frmDte, props.toDte])

    useEffect(() => {
        if (props.boSelectedFilter) {
            getBOReports(props.frmDte, props.toDte)
            setResultTotalArray({})
        }
    }, [props.frmDte, props.toDte, props.boSelectedFilter])

    function getBOReports(from, to) {
        props.showWidgetLoader();
        setResultArray([])
        setErrorMsg(null)
        let request = new MsfRequest();
        request.addToData({
            "frmDte": getFormatedDate(from, 0, DATE_FORMATS.DDMMYYYY, true).stringDate,
            "toDte": getFormatedDate(to, 0, DATE_FORMATS.DDMMYYYY, true).stringDate
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + BO_REPORT_SERVICE.FUND_TRANSACTION,
            request,
            successRespCBGetBOReport,
            errorRespCBGetBOReport
        )
    }

    function successRespCBGetBOReport(response) {
        props.hideWidgetLoader();
        setResultArray(response.data.report)
        setResultTotalArray(response.data.total)
        props.pdfDownloadUrl(response.data.pdfDownloadUrl.url)
        props.xlsxDownloadUrl(response.data.excelDownloadUrl.url)
        setErrorMsg(null)
        props.downloadUrl(true)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD_SUCCESS)
    }

    function errorRespCBGetBOReport(error) {
        props.hideWidgetLoader();
        setErrorMsg(error.message)
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
        props.downloadUrl(false)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD_FAILURE)

    }

    function onSort(type, key1, sortType) {
        onSortByDateCB(key1, sortType)
    }

    function onIconSort(type, key, sortType) {
        onSort(type, key, sortType)
    }
    function onSortByDateCB(key1, sortType) {
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

        let sortedSymList = sortByDateBO(ascSort, resultArray, key1)
        setResultArray(sortedSymList)
        if (resultArray && resultArray.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1)
            setSortFlag(updatedSortFlag)
        }

    }
    function getSortIconCB(column) {
        let sortFlagArray = Object.assign([], sortFlag)
        let sortOrder = sortFlagArray.filter((item) => item.column === column)
        if (sortOrder.length)
            return sortOrder[0].sortAsc
        return null

    }

    return (
        <div className="bo-baseTable">
            <table className="bo-table fund-report">
                {
                    (resultArray && resultArray.length) ?
                        <thead className="thead-scroller">
                            <tr>
                                <th className={`firstChild width30`}>
                                    <span className="cursor"
                                        onClick={() => onSort(SORT_DATATYPE.DATE, 'date')}
                                    >
                                        <LangText module="TABLE_HEADERS" name="DATE" />
                                    </span>
                                    <SortIcon colName="date"
                                        getSortIcon={getSortIconCB}
                                        type={SORT_DATATYPE.DATE}
                                        onIconSort={onIconSort} />
                                </th>
                                <th className=" fund-trans width18">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="TRANSACTION_DETAILS" />
                                    </span>
                                </th>
                                <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="PAYMENT" />
                                    </span>
                                </th>

                                <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="RECEIPT" />
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
                                            <td className={`firstChild width30`}>
                                                <span>{checkEmpty(item.date)}</span>
                                            </td>
                                            <td className="fund-trans-type width18">
                                                <span className="vtype">{checkEmpty(item.vtyp)}</span>
                                            </td>
                                            <td>
                                                <span className="payment">{checkEmpty(item.pamt)}</span>
                                            </td>
                                            <td>
                                                <span className="receipt">{checkEmpty(item.ramt)}</span>
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
                    (resultTotalArray && Object.keys(resultTotalArray).length !== 0) ?
                        <tfoot className="total-fund">
                            <>
                                <tr>
                                    <td className="fund-total width24">
                                        <span><LangText module="BO" name="TOTAL" /></span>
                                    </td>
                                    <td className="total-transaction width25">
                                        <span></span>
                                    </td>
                                    <td className="total-payment">
                                        <span>{checkEmpty(resultTotalArray.ttlPayment)}</span>
                                    </td>
                                    <td className="total-receipt">
                                        <span>{checkEmpty(resultTotalArray.ttlRamt)}</span>
                                    </td>

                                </tr>
                            </>
                        </tfoot>
                        :
                        // <tr className="errorRow">
                        //     <td className="colspan"> {errorMsg}</td>
                        // </tr>
                        null
                }
            </table>
        </div >
    )
}

export default (WidgetLoader(FundTransactionComponent));
