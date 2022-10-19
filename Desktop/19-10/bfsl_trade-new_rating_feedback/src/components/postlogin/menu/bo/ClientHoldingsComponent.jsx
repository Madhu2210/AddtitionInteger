import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import LangText from '../../../../common/lang/LangText';
import { AF_EVENT_NAMES, AF_EVENT_TYPES, SORT_DATATYPE, SORT_TYPES } from '../../../../common/Constants';
import {
    checkEmpty, getBackOfficeBaseURL,
    sortFlagFunc, sortByString, AF_EventTriggered
} from '../../../../common/CommonMethods';

import { SortIcon } from '../../../common/FontIcons';
import { BO_REPORT_SERVICE } from '../../../../config/ServiceURLs'

function ClientHoldingsComponent(props) {
    const MsfFetch = useFetch()
    const [resultArray, setResultArray] = useState([])
    const [resultTotalArray, setResultTotalArray] = useState("")

    const [sortAsc, setSortAsc] = useState(true)
    const [errorMsg, setErrorMsg] = useState(null)
    const [sortFlag, setSortFlag] = useState(
        [
            { column: "dispSym", sortAsc: null }
        ]
    )

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.CLIENT_HOLDINGS)
    }, [])

    useEffect(() => {
        getClientHoldings()
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
    }, [])
    function getClientHoldings() {
        let request = new MsfRequest();
        request.addToData({})
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + BO_REPORT_SERVICE.CLIENT_HOLDINGS,
            request,
            successRespCBGetClientHoldings,
            errorRespCBGetClientHoldings
        )
    }
    function successRespCBGetClientHoldings(response) {
        setResultArray(response.data.report)
        setResultTotalArray(response.data.totHldgVal)
        props.pdfDownloadUrl(response.data.pdfDownloadUrl.url)
        props.xlsxDownloadUrl(response.data.excelDownloadUrl.url)
        props.downloadUrl(true)
        AF_EventTriggered(AF_EVENT_NAMES.CLIENT_HOLDINGS ,AF_EVENT_TYPES.DOWNLOAD_SUCCESS )
    }

    function errorRespCBGetClientHoldings(error) {
        setErrorMsg(error.message)
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
        props.downloadUrl(false)
        AF_EventTriggered(AF_EVENT_NAMES.CLIENT_HOLDINGS , error)
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
                                <th className="firstChild width23">
                                    <span className="cursor"
                                        onClick={() => onSort(SORT_DATATYPE.STRING, 'dispSym')}
                                    >
                                        <LangText module="TABLE_HEADERS" name="SCRIP_NAME" />
                                    </span>
                                    <SortIcon colName="dispSym"
                                        getSortIcon={getSortIconCB}
                                        type={SORT_DATATYPE.STRING}
                                        onIconSort={onIconSort} />
                                </th>
                                <th className="width20">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="DP_HOLDING" />
                                    </span>
                                </th>
                                <th className="width18">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="BFL_PLEGED_QTY" />
                                    </span>
                                </th>
                                <th className="width23">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="MARGIN_PLEDGE" />
                                    </span>
                                </th>
                                <th className="width15">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="MTF_QTY" />
                                    </span>
                                </th>
                                <th className="width20">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="MTF_PLEDGE" />
                                    </span>
                                </th>
                                <th className="width15">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="UNPAID_QTY" />
                                    </span>
                                </th>
                                <th className="width18">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="UNSETTLED_QTY" />
                                    </span>
                                </th>
                                <th className="width18">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="TOT_HOLDING" />
                                    </span>
                                </th>
                                <th className="width15">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="CLOSE_RATE" />
                                    </span>
                                </th>
                                <th className="width18">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="HOLDING_VALUE" />
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
                                            <td className="firstChild width23">
                                                <span>{checkEmpty(item.dispSym)}</span>
                                            </td>
                                            <td className="width20">
                                                <span>{checkEmpty(item.dpHldng)}</span>
                                            </td>
                                            <td className="width18">
                                                <span>{checkEmpty(item.bflPld)}</span>
                                            </td>
                                            <td className="width23">
                                                <span>{checkEmpty(item.clMrgPldg)}</span>
                                            </td>
                                            <td className="width15">
                                                <span>{checkEmpty(item.mtfFundStock)}</span>
                                            </td>
                                            <td className="width20">
                                                <span>{checkEmpty(item.mfCltrl)}</span>
                                            </td>
                                            <td className="width15">
                                                <span>{checkEmpty(item.unpaid)}</span>
                                            </td>
                                            <td className="width18">
                                                <span>{checkEmpty(item.unsettld)}</span>
                                            </td>
                                            <td className="width18">
                                                <span>{checkEmpty(item.totHldng)}</span>
                                            </td>
                                            <td className="width15">
                                                <span>{checkEmpty(item.clRte)}</span>
                                            </td>
                                            <td className="width18">
                                                <span>{checkEmpty(item.hldnVal)}</span>
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
                                            <LangText module="BO" name="TOTL_HOLDINGS" /></span>
                                    </td>
                                    <td >
                                        <span className="holding-totalvalue">{resultTotalArray}</span>
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
export default ClientHoldingsComponent