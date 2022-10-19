import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import LangText from '../../../../common/lang/LangText';
import { AF_EVENT_NAMES, AF_EVENT_TYPES, DATE_FORMATS, SORT_DATATYPE, SORT_TYPES } from '../../../../common/Constants';
import {
    checkEmpty, getBackOfficeBaseURL,
    sortFlagFunc, sortByString, getFormatedDate, AF_EventTriggered
} from '../../../../common/CommonMethods';

import { SortIcon } from '../../../common/FontIcons';
import { BO_REPORT_SERVICE } from '../../../../config/ServiceURLs'
import { WidgetLoader } from '../../../common/WidgetLoaderComponent';

function DividendReportComponent(props) {

    const MsfFetch = useFetch()
    const [resultArray, setResultArray] = useState([])
    const [resultTotalArray, setResultTotalArray] = useState({})

    const [sortAsc, setSortAsc] = useState(true)
    const [errorMsg, setErrorMsg] = useState(null)
    const [sortFlag, setSortFlag] = useState(
        [
            { column: "stckName", sortAsc: null }
        ]
    )

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DIVIDEND_REPORT)
    },[])

    useEffect(() => {
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
    }, [props.frmDte, props.toDte])

    useEffect(() => {
        if (props.toDte) {
            getDividendReport(props.frmDte, props.toDte)
            setResultTotalArray({})
        }
    }, [props.frmDte, props.toDte])

    function getDividendReport(from, to) {
        props.showWidgetLoader();
        setResultArray([])
        setErrorMsg(null)
        let request = new MsfRequest();
        request.addToData({
            "frmDte": getFormatedDate(from, 0, DATE_FORMATS.DDMMYYYY, true).stringDate,
            "toDte": getFormatedDate(to, 0, DATE_FORMATS.DDMMYYYY, true).stringDate
        })

        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + BO_REPORT_SERVICE.DIVIDEND_REPORT,
            request,
            successRespCBGetDividendReport,
            errorRespCBGetDividendReport
        )
    }
    function successRespCBGetDividendReport(response) {
        props.hideWidgetLoader();
        setResultArray(response.data.report)
        setResultTotalArray(response.data)
        props.pdfDownloadUrl(response.data.pdfDownloadUrl.url)
        props.xlsxDownloadUrl(response.data.excelDownloadUrl.url)
        props.downloadUrl(true)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD_SUCCESS)

    }

    function errorRespCBGetDividendReport(error) {
        setErrorMsg(error.message)
        props.hideWidgetLoader();
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
        props.downloadUrl(false)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD_FAILURE)

    }

    function getSortIconCB(column) {
        let sortFlagArray = Object.assign([], sortFlag)
        let sortOrder = sortFlagArray.filter((item) => item.column === column)

        if (sortOrder.length)
            return sortOrder[0].sortAsc
        return null
    }

    function onSort(type, key1, sortType) {
        if (type === 'string')
            onSortByStringCB(key1, sortType)
    }

    function onIconSort(type, key, sortType) {
        onSort(type, key, sortType)
    }

    function onSortByStringCB(key1, sortType) {
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

        let sortedSymList = sortByString(ascSort, resultArray, key1)
        setResultArray(sortedSymList)
        if (resultArray && resultArray.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1)
            setSortFlag(updatedSortFlag)
        }
    }

    return (
        <div className="bo-baseTable">
            <table className="bo-table">
                {
                    (resultArray && resultArray.length) ?
                        <thead className="thead-scroller">
                            <tr>
                                <th className="firstChild width20">
                                    <span className="cursor"
                                        onClick={() => onSort(SORT_DATATYPE.STRING, 'stckName')}
                                    >
                                        <LangText module="TABLE_HEADERS" name="SCRIP_NAME" />
                                    </span>
                                    <SortIcon colName="stckName"
                                        getSortIcon={getSortIconCB}
                                        type={SORT_DATATYPE.STRING}
                                        onIconSort={onIconSort} />
                                </th>
                                <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="DATE" />
                                    </span>
                                </th>
                                <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="TYPE" />
                                    </span>
                                </th>
                                <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="DIV_PER_SHARE" />
                                    </span>
                                </th>
                                <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="QTY" />
                                    </span>
                                </th>
                                <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="DIV_AMOUNT" />
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
                                            <td className="firstChild width20">
                                                <span className="stick-name">{checkEmpty(item.stckName)}</span>
                                            </td>
                                            <td>
                                                <span>{checkEmpty(item.dividendDate)}</span>
                                            </td>
                                            <td>
                                                <span>{checkEmpty(item.dividendType)}</span>
                                            </td>
                                            <td>
                                                <span>{checkEmpty(item.dividendPerShr)}</span>
                                            </td>
                                            <td>
                                                <span>{checkEmpty(item.qty)}</span>
                                            </td>
                                            <td>
                                                <span>{checkEmpty(item.amnt)}</span>
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
                        <tfoot className="total-clientholdings">
                            <>
                                <tr className="holdings-foot">
                                    <td>
                                        <span className="total-label-holdings"> 
                                            <LangText module="BO" name="TOTAL" /></span>
                                    </td>
                                    <td >
                                        <span className="holding-totalvalue">{checkEmpty(resultTotalArray.total)}</span>
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
        </div>
    )
}

export default WidgetLoader(DividendReportComponent);
