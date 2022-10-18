import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import LangText from '../../../../common/lang/LangText';
import { SORT_DATATYPE, DATE_FORMATS, BO_REPORT_TYPES, SORT_TYPES, 
    AF_EVENT_NAMES, AF_EVENT_TYPES } from '../../../../common/Constants';
import {
    checkEmpty, getBackOfficeBaseURL,
    getFormatedDate, sortFlagFunc, 
    sortByDateBO, AF_EventTriggered} from '../../../../common/CommonMethods';

import { SortIcon } from '../../../common/FontIcons';
import { BO_REPORT_SERVICE } from '../../../../config/ServiceURLs'

import { WidgetLoader } from '../../../common/WidgetLoaderComponent';

function CostReportComponent(props) {

    const MsfFetch = useFetch()

    const [resultArray, setResultArray] = useState([])
    const [sortFlag, setSortFlag] = useState(
        [
            { column: "date", sortAsc: null },
        ]
    )
    const [sortAsc, setSortAsc] = useState(true)
    const [errorMsg, setErrorMsg] = useState(null)
    const [resultTotalArray, setResultTotalArray] = useState({})

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.COST_REPORT)
    },[])

    useEffect(() => {
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
    }, [props.frmDte, props.toDte, props.selectedOrderType])

    useEffect(() => {
        getBOReports(props.frmDte, props.toDte)
        setResultTotalArray({})
    }, [props.selectedOrderType, props.boSelectedFilter, props.frmDte, props.toDte])

    function getBOReports(from, to) {
        props.showWidgetLoader();
        setResultArray([])
        setErrorMsg(null)
        setResultTotalArray({})
        let request = new MsfRequest();
        request.addToData({
            "frmDte": getFormatedDate(from, 0, DATE_FORMATS.DDMMYYYY, true).stringDate,
            "toDte": getFormatedDate(to, 0, DATE_FORMATS.DDMMYYYY, true).stringDate
        })
        if (props.selectedOrderType === BO_REPORT_TYPES[0]) {
            MsfFetch.placeRequest(
                getBackOfficeBaseURL() + BO_REPORT_SERVICE.COST_REPORT_EQUITY,
                request,
                successRespCBGetBOReport,
                errorRespCBGetBOReport
            )
        }
        else {
            MsfFetch.placeRequest(
                getBackOfficeBaseURL() + BO_REPORT_SERVICE.COST_REPORT_DERIVATIVE,
                request,
                successRespCBGetBOReport,
                errorRespCBGetBOReport
            )
        }
    }

    function successRespCBGetBOReport(response) {
        props.hideWidgetLoader();
        setResultArray(response.data.report)
        setResultTotalArray(response.data.total)
        props.pdfDownloadUrl(response.data.pdfDownloadUrl.url)
        props.xlsxDownloadUrl(response.data.excelDownloadUrl.url)
        props.downloadUrl(true)
        setErrorMsg(null)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD_SUCCESS)
    }

    function errorRespCBGetBOReport(error) {
        props.hideWidgetLoader();
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
        props.downloadUrl(false)
        setErrorMsg(error.message)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , error)
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
            <table className="bo-table cost-report">
                {
                    (resultArray && resultArray.length) ?
                        <thead className="thead-scroller">
                            <tr>
                                <th className="firstChild width13">
                                    <span className="cursor"
                                        onClick={() => onSort(SORT_DATATYPE.DATE, 'date')}
                                    >
                                        <LangText module="TABLE_HEADERS" name="TXN_DATE" />
                                    </span>
                                    <SortIcon colName="date"
                                        getSortIcon={getSortIconCB}
                                        type={SORT_DATATYPE.DATE}
                                        onIconSort={onIconSort} />
                                </th>
                                <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="BROKERAGE" />
                                    </span>
                                </th>
                                <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="GST" />
                                    </span>
                                </th>
                                <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="SEC_TXN_DATE" />
                                    </span>
                                </th>
                                <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="STAMP_DUTY" />
                                    </span>
                                </th>
                                <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="SEBI_FEES" />
                                    </span>
                                </th>
                                <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="TXN_CHARGES" />
                                    </span>
                                </th>
                                <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="OTHER_CHARGES" />
                                    </span>
                                </th>
                                <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="TOTAL_CHARGES" />
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
                                            <td className="firstChild width13">
                                                <span>{checkEmpty(item.date)}</span>
                                            </td>
                                            <td>
                                                <span>{checkEmpty(item.bkrge)}</span>
                                            </td>
                                            <td>
                                                <span>{checkEmpty(item.gst)}</span>
                                            </td>
                                            <td>
                                                <span>{checkEmpty(item.stt)}</span>
                                            </td>
                                            <td>
                                                <span>{checkEmpty(item.stmpDte)}</span>
                                            </td>
                                            <td>
                                                <span>{checkEmpty(item.sebiTax)}</span>
                                            </td>
                                            <td>
                                                <span>{checkEmpty(item.trnTax)}</span>
                                            </td>
                                            <td>
                                                <span>{checkEmpty(item.otrChrg)}</span>
                                            </td>
                                            <td>
                                                <span>{checkEmpty(item.totlChg)}</span>
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
                        <tfoot className="total-cost">
                            <>
                                <tr>
                                    <td className="cost-total width13">
                                        <span><LangText module="BO" name="TOTAL" /></span>
                                    </td>
                                    <td>
                                        <span>{checkEmpty(resultTotalArray.ttlBrkg)}</span>
                                    </td>
                                    <td>
                                        <span>{checkEmpty(resultTotalArray.ttlGST)}</span>
                                    </td>
                                    <td>
                                        <span>{checkEmpty(resultTotalArray.ttlSTT)}</span>
                                    </td>
                                    <td>
                                        <span >{checkEmpty(resultTotalArray.ttlStmpDuty)}</span>
                                    </td>
                                    <td>
                                        <span>{checkEmpty(resultTotalArray.ttlSebiTax)}</span>
                                    </td>
                                    <td>
                                        <span>{checkEmpty(resultTotalArray.ttlTxnChrge)}</span>
                                    </td>
                                    <td>
                                        <span>{checkEmpty(resultTotalArray.ttlothrChrge)}</span>
                                    </td>
                                    <td>
                                        <span>{checkEmpty(resultTotalArray.ttlChrge)}</span>
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

// const mapDispatchToProps = (dispatch) => {
//     return {
//         storeBOFundTransactionsortData: (s) => { dispatch(storeBOFundTransactionsortData(s)) }
//         // showAppDialog: (s) => { dispatch(showAppDialog(s)) }

//     };
// };
export default (WidgetLoader(CostReportComponent));
