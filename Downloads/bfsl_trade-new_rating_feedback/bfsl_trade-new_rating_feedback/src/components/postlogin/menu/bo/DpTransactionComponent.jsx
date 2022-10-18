import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import LangText from '../../../../common/lang/LangText';
import { SORT_DATATYPE, SORT_TYPES, DATE_FORMATS, AF_EVENT_NAMES, 
    AF_EVENT_TYPES, TEXT_ORIENTATION } from '../../../../common/Constants';
import {
    checkEmpty, getBackOfficeBaseURL,
    sortFlagFunc, sortByDateBO, 
    getFormatedDate, AF_EventTriggered} from '../../../../common/CommonMethods';

import { SortIcon } from '../../../common/FontIcons';
import { BO_REPORT_SERVICE } from '../../../../config/ServiceURLs'

import { WidgetLoader } from '../../../common/WidgetLoaderComponent';

function DpTransactionComponent(props) {
    const MsfFetch = useFetch()
    const [resultArray, setResultArray] = useState([])

    const [sortAsc, setSortAsc] = useState(true)
    const [errorMsg, setErrorMsg] = useState(null)
    const [sortFlag, setSortFlag] = useState(
        [
            { column: "txnDte", sortAsc: null }
        ]
    )

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DP_TRANSACTION)
    },[])

    useEffect(() => {
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
        getDpTransactions(props.frmDte, props.toDte)
    }, [props.frmDte, props.toDte])

    function getDpTransactions(from, to) {
        props.showWidgetLoader();
        setResultArray([])
        setErrorMsg(null)
        let request = new MsfRequest();
        request.addToData({
            "frmDte": getFormatedDate(from, 0, DATE_FORMATS.DDMMYYYY, true).stringDate,
            "toDte": getFormatedDate(to, 0, DATE_FORMATS.DDMMYYYY, true).stringDate
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + BO_REPORT_SERVICE.DP_TRANSACTION,
            request,
            successRespCBGetDpTransactions,
            errorRespCBGetDpTransactions
        )
    }
    function successRespCBGetDpTransactions(response) {
        props.hideWidgetLoader();
        setResultArray(response.data.report)
        props.pdfDownloadUrl(response.data.pdfDownloadUrl.url)
        props.xlsxDownloadUrl(response.data.excelDownloadUrl.url)
        props.downloadUrl(true)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD_SUCCESS)

    }

    function errorRespCBGetDpTransactions(error) {
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
            <table className="bo-table dptransaction">
                {
                    (resultArray && resultArray.length) ?
                        <thead className="thead-scroller">
                            <tr>
                                <th className="firstChild width10">
                                    <span className="cursor"
                                        onClick={() => onSort(SORT_DATATYPE.DATE, 'txnDte')}
                                    >
                                        <LangText module="TABLE_HEADERS" name="TXN_DATE" />
                                    </span>
                                    <SortIcon colName="txnDte"
                                        getSortIcon={getSortIconCB}
                                        type={SORT_DATATYPE.DATE}
                                        onIconSort={onIconSort} />
                                </th>
                                <th className="dp-scrip">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="SCRIP_NAME" />
                                    </span>
                                </th>
                                <th className="dp-qty">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="QTY"
                                            orientation={TEXT_ORIENTATION.UPPERCASE} />
                                    </span>
                                </th>
                                <th className="dp-chrge">
                                    <span className="last-child-header">
                                        <LangText module="TABLE_HEADERS" name="CHARGE_DETAILS" />
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
                        (resultArray && resultArray.length) ?
                            resultArray.map((item, index) => {
                                return (
                                    <>
                                        <tr key={index}>
                                            <td className="firstChild width10">
                                                <span>{checkEmpty(item.txnDte)}</span>
                                            </td>
                                            <td className="dp-scrip">
                                                <span>{checkEmpty(item.dispSym)}</span>
                                            </td>
                                            <td className="dp-qty">
                                                <span>{checkEmpty(item.qty)}</span>
                                            </td>
                                            <td className="dp-chrge text-nowrap">
                                                <span title={item.chrgeDtls} className="last-child-data">
                                                    {checkEmpty(item.chrgeDtls)}</span>
                                            </td>
                                        </tr>
                                    </>

                                )
                            })
                            :
                            // <tr className="errorRow">
                            //     <td className="colspan">{errorMsg}</td>
                            // </tr>
                            null
                    }

                </tbody>
                {/* <tfoot className="total-clientholdings">
                    {
                        (resultTotalArray) ?
                            <>
                                <tr className="holdings-foot">
                                    <td>
                                        <span className="total-label-holdings">TOTAL HOLDINGS VALUE</span>
                                    </td>
                                    <td >
                                        <span>test</span>
                                    </td>

                                </tr>
                            </>
                            :
                            <tr className="errorRow">
                                <td className="colspan"> {errorMsg}</td>
                            </tr>
                    }
                </tfoot> */}
            </table>
        </div>
    )
}
export default (WidgetLoader(DpTransactionComponent))