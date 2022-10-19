import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import LangText from '../../../../common/lang/LangText';
import { AF_EVENT_NAMES, AF_EVENT_TYPES, 
    SORT_DATATYPE, SORT_TYPES, TEXT_ORIENTATION } from '../../../../common/Constants';
import {
    checkEmpty, getBackOfficeBaseURL,
    isSellTradeAction, isBuyTradeAction, 
    sortFlagFunc, sortByDateBO, AF_EventTriggered} from '../../../../common/CommonMethods';

import { SortIcon } from '../../../common/FontIcons';
import { BO_REPORT_SERVICE } from '../../../../config/ServiceURLs'

import { WidgetLoader } from '../../../common/WidgetLoaderComponent';

function ViewLastTransactionComponent(props) {

    const MsfFetch = useFetch()

    const [resultArray, setResultArray] = useState([])
    const [sortFlag, setSortFlag] = useState(
        [
            { column: "trdDte", sortAsc: null },
        ]
    )
    const [sortAsc, setSortAsc] = useState(true)
    const [errorMsg, setErrorMsg] = useState(null)

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.VIEW_LAST_TRANSACTION)
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
            getBackOfficeBaseURL() + BO_REPORT_SERVICE.VIEW_LAST_TRANSACTION,
            request,
            successRespCBGetBOReport,
            errorRespCBGetBOReport
        )
    }

    function successRespCBGetBOReport(response) {
        props.hideWidgetLoader();
        let viewTransaction = response.data.report
        setResultArray(viewTransaction)
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
            <table className="bo-table">
                {
                    (resultArray && resultArray.length) ?
                        <thead className="thead-scroller">
                            <tr>
                                <th className="firstChild width24">
                                    <span className="cursor"
                                        onClick={() => onSort(SORT_DATATYPE.DATE, 'trdDte')}
                                    >
                                        <LangText module="TABLE_HEADERS" name="DATE"
                                            orientation={TEXT_ORIENTATION.UPPERCASE}  />
                                    </span>
                                    <SortIcon colName="trdDte"
                                        getSortIcon={getSortIconCB}
                                        type={SORT_DATATYPE.DATE}
                                        onIconSort={onIconSort} />
                                </th>
                                <th className="trade-sym-head">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="SYMBOL" />
                                    </span>
                                </th>
                                <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="EXCHANGE" />
                                    </span>
                                </th>
                                <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="QTY" 
                                            orientation={TEXT_ORIENTATION.UPPERCASE}/>
                                    </span>
                                </th>
                                <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="PRICE"
                                            orientation={TEXT_ORIENTATION.UPPERCASE} />
                                    </span>
                                </th>
                                <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="VALUE_L" />
                                    </span>
                                </th>
                                <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="MODE" />
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
                                            <td className="firstChild width24">
                                                <span>{checkEmpty(item.trdDte)}</span>
                                            </td>
                                            <td className="trade-sym text-wrap">
                                                <span className="trade-symbol">{checkEmpty(item.dispSym)}</span>
                                                <span className={`action ${isBuyTradeAction(item.action) ?
                                                    "buy-clr" : isSellTradeAction(item.action)
                                                        ? "sell-clr" : "text-color"}`}>

                                                    {checkEmpty(item.action)}</span>
                                            </td>
                                            <td>
                                                <span className="trade-exc-values">{item.sym ?  
                                                    checkEmpty(item.sym.exc) : checkEmpty("") }</span>
                                            </td>
                                            <td>
                                                <span>{checkEmpty(item.netQty)}</span>
                                            </td>
                                            <td>
                                                <span>{checkEmpty(item.netAvgRte)}</span>
                                            </td>
                                            <td>
                                                <span>{checkEmpty(item.netAmt)}</span>
                                            </td>
                                            <td>
                                                <span>{checkEmpty(item.trdType)}</span>
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
            </table>
        </div >
    )
}
export default (WidgetLoader(ViewLastTransactionComponent));

