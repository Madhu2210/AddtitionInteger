import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import LangText from '../../../../common/lang/LangText';
import {
    SORT_DATATYPE, DATE_FORMATS, SORT_TYPES,
    BO_REPORTS_FINANCIAL_OPTIONS,
    TEXT_ORIENTATION,
    AF_EVENT_NAMES,
    AF_EVENT_TYPES
} from '../../../../common/Constants';
import {
    checkEmpty, getBackOfficeBaseURL,
    getFormatedDate, sortFlagFunc, sortByDateBO, getColorCode, getPositive_Negative_ColorCode, AF_EventTriggered
} from '../../../../common/CommonMethods';

import { SortIcon } from '../../../common/FontIcons';
import { BO_REPORT_SERVICE } from '../../../../config/ServiceURLs'

import { WidgetLoader } from '../../../common/WidgetLoaderComponent';

function FinancialLedgerComponent(props) {

    const MsfFetch = useFetch()

    const [resultArray, setResultArray] = useState({})
    const [resultDetailArray, setResultDetailArray] = useState([])
    const [sortFlag, setSortFlag] = useState(
        [
            { column: "vocDate", sortAsc: null },
            { column: "effDate", sortAsc: null }
        ]
    )
    const [sortAsc, setSortAsc] = useState(true)
    const [errorMsg, setErrorMsg] = useState(null)
    const [openBalance, setOpenBalance] = useState('')
    const [closeBalance, setClosingBalance] = useState('')

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.FINANCIAL_LEDGER)
    },[])

    useEffect(() => {
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
    }, [props.frmDte, props.toDte, props.boSelectedFinancialFilter, props.selectedFinancialType])

    useEffect(() => {
        if (props.frmDte || props.toDte) {
            if (props.selectedFinancialType.name === BO_REPORTS_FINANCIAL_OPTIONS.QUICK_SNAPSHOT) {
                // if(props.boSelectedFilter === BO_REPORTS_FILTER[0]) {
                getBOFinancialQuickReports(props.frmDteQuick, props.toDteQuick)
                // }
                // else {
                //     getInitialDates()
                // }
            }
            else {
                getBOFinancialDetailReports(props.frmDte, props.toDte)
            }
        }
    }, [props.frmDte, props.toDte, props.boSelectedFinancialFilter, props.boSelectedFilter
        , props.frmDteQuick, props.toDteQuick])

    // function getInitialDates() {
    //     let date = new Date();
    //     let first = new Date(date.getFullYear(), date.getMonth(), 1);
    //     getBOFinancialDetailReports(first,date)
    // }
    function getBOFinancialQuickReports(from, to) {
        props.showWidgetLoader();
        setResultArray({})
        setErrorMsg(null)
        let request = new MsfRequest();
        request.addToData({
            "frmDte": getFormatedDate(from, 0, DATE_FORMATS.DDMMYYYY, true).stringDate,
            "toDte": getFormatedDate(to, 0, DATE_FORMATS.DDMMYYYY, true).stringDate
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + BO_REPORT_SERVICE.FINANCIAL_LEDGER_QUICK,
            request,
            successRespCBGetBOFinancialQuickReport,
            errorRespCBGetBOFinancialQuickReport
        )
    }

    function successRespCBGetBOFinancialQuickReport(response) {
        props.hideWidgetLoader();
        setResultArray(response.data)
        props.pdfDownloadUrl(response.data.pdfDownloadUrl.url)
        props.xlsxDownloadUrl(response.data.excelDownloadUrl.url)
        setErrorMsg(null)
        props.downloadUrl(true)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD_SUCCESS)

    }

    function errorRespCBGetBOFinancialQuickReport(error) {
        props.hideWidgetLoader();
        setErrorMsg(error.message)
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
        props.downloadUrl(false)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD_FAILURE)

    }

    function getBOFinancialDetailReports(from, to) {
        props.showWidgetLoader();
        setResultDetailArray([])
        setClosingBalance('')
        setOpenBalance('')
        setErrorMsg(null)
        let request = new MsfRequest();
        request.addToData({
            filters: [
                {
                    key: "segment",
                    value: props.boSelectedFinancialFilter.apiKey
                },
            ],
            "toDte": getFormatedDate(to, 0, DATE_FORMATS.DDMMYYYY, true).stringDate,
            "frmDte": getFormatedDate(from, 0, DATE_FORMATS.DDMMYYYY, true).stringDate
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + BO_REPORT_SERVICE.FINANCIAL_LEDGER_DETAILED,
            request,
            successRespCBGetBOFinancialDetailReport,
            errorRespCBGetBOFinancialDetailReport
        )
    }

    function successRespCBGetBOFinancialDetailReport(response) {
        // console.log('response fl :', response);
        props.hideWidgetLoader();
        setResultDetailArray(response.data.report)
        // if(response.data.report)
        //     onSortByDateCB("vocDate", "ASC", response.data.report)
        setClosingBalance(response.data.closingBalance)
        setOpenBalance(response.data.openBalance)
        props.pdfDownloadUrl(response.data.pdfDownloadUrl.url)
        props.xlsxDownloadUrl(response.data.excelDownloadUrl.url)
        setErrorMsg(null)
        props.downloadUrl(true)
    }

    function errorRespCBGetBOFinancialDetailReport(error) {
        props.hideWidgetLoader();
        setErrorMsg(error.message)
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
        props.downloadUrl(false)
    }

    function onSort(type, key1, sortType) {
        onSortByDateCB(key1, sortType)
    }

    function onIconSort(type, key, sortType) {
        onSort(type, key, sortType)
    }
    // function onSortByDateCB(key1, sortType, displayArray) {

    function onSortByDateCB(key1, sortType) {
        // let sortedSymList;
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
        // if(displayArray) {
        //     // console.log("withdisplayArray", displayArray)
        //     sortedSymList = sortByDateBO(ascSort, displayArray, key1)
        // }
        // else {
        //     // console.log("withoutdisplayArray", displayArray)
        //     sortedSymList = sortByDateBO(ascSort, resultDetailArray, key1)
        // }
        let sortedSymList = sortByDateBO(ascSort, resultDetailArray, key1)
        setResultDetailArray(sortedSymList)
        if (resultDetailArray && resultDetailArray.length > 1) {
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
        <>
            {
                (props.selectedFinancialType.name === BO_REPORTS_FINANCIAL_OPTIONS.QUICK_SNAPSHOT)
                    ?
                    <>
                        {
                            (resultArray && Object.keys(resultArray).length > 0) ?
                                <div className="financial-ledger-quicksnapshot">
                                    <div className="financial-ledger1-quicksnapshot"> 
                                        <div className="quick-balance-detail">
                                            <div className="open-title">
                                                <div>
                                                    <LangText module="TABLE_HEADERS" name="OPENING_BALANCE"
                                                        orientation={TEXT_ORIENTATION.UPPERCASE} />
                                                </div>

                                                <div>
                                                    <span className={`open-balance 
                                                ${getColorCode(resultArray.openBalance)}`}>
                                                        {checkEmpty(resultArray.openBalance)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bo-quick">

                                            <div className="bo-list">

                                                <div className="title2">
                                                    <div className="funds-title">
                                                        <div className="funds-sub">
                                                            <LangText module="TABLE_HEADERS" name="FUNDS_IN_OUT" />
                                                        </div>
                                                        <div>
                                                            <span className="funds-head-value">
                                                                {checkEmpty(resultArray.fundInOut)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="sub-head">
                                                        <div>
                                                            <div className="sub-values">
                                                                <span className="sub-head-title">
                                                                    <LangText module="TABLE_HEADERS" 
                                                                        name="FUNDS_RECEIVED" />
                                                                </span>
                                                                <span className="funds-received">
                                                                    {checkEmpty(resultArray.fundReceived)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="sub-values">
                                                                <span className="sub-head-title">
                                                                    <LangText module="TABLE_HEADERS" 
                                                                        name="FUNDS_WITHDRAWN" />
                                                                </span>
                                                                <span className="funds-withdrawn">
                                                                    {checkEmpty(resultArray.fundWithdrawn)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="line"></div>
                                                <div className="title3">
                                                    <div className="funds-title">
                                                        <div className="funds-sub">
                                                            <LangText module="TABLE_HEADERS" name="FUNDS_UTILIZATION" />
                                                        </div>
                                                        <div>
                                                            <span className="funds-head-value">
                                                                {checkEmpty(resultArray.fundUtil)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="sub-head">
                                                        <div>
                                                            <div className="sub-values">
                                                                <span className="sub-head-title">
                                                                    <LangText module="TABLE_HEADERS" 
                                                                        name="CASH_SEGMENT" />
                                                                </span>
                                                                <span className="funds-received">
                                                                    {checkEmpty(resultArray.cashSeg)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="sub-values">
                                                                <span className="sub-head-title">
                                                                    <LangText module="TABLE_HEADERS" 
                                                                        name="DERIVATIVES_SEGMENT" />
                                                                </span>
                                                                <span className="funds-withdrawn">
                                                                    {checkEmpty(resultArray.derivSeg)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="sub-values">
                                                                <span className="sub-head-title">
                                                                    <LangText module="TABLE_HEADERS" 
                                                                        name="MFSS_SEGMENT" />
                                                                </span>
                                                                <span className="funds-received">
                                                                    {checkEmpty(resultArray.mfssSeg)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="sub-values">
                                                                <span className="sub-head-title">
                                                                    <LangText module="TABLE_HEADERS" 
                                                                        name="MTF_SEGMENT" />
                                                                </span>
                                                                <span className="funds-withdrawn">
                                                                    {checkEmpty(resultArray.mtfSeg)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="line"></div>
                                                <div className="title4">
                                                    <div className="funds-title">
                                                        <div className="funds-sub">
                                                            <LangText module="TABLE_HEADERS" name="MISCELLANEOUS" />
                                                        </div>
                                                        <div>
                                                            <span className="funds-head-value">
                                                                {checkEmpty(resultArray.misc)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="sub-head">
                                                        <div>
                                                            <div className="sub-values">
                                                                <span className="sub-head-title">
                                                                    <LangText module="TABLE_HEADERS" 
                                                                        name="REVERSALS_CAHRGE" />
                                                                </span>
                                                                <span className="funds-received">
                                                                    {checkEmpty(resultArray.rco)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="quick-balance-detail">
                                            <div className="close-title">
                                                <div>
                                                    <LangText module="TABLE_HEADERS" name="CLOSING_BALANCE" />
                                                </div>
                                                <div>
                                                    <span className={`close-balance 
                                                ${getColorCode(resultArray.closingBalance)}`}>
                                                        {checkEmpty(resultArray.closingBalance)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> :
                                <div className="error-div-quicksnapshotfl">{errorMsg}</div>
                        }
                    </> 
                    :
                    < div className="financial-detail">
                        {
                            openBalance ?
                                <div className="balance-detail">
                                    <div className="detail-open-title">
                                        <LangText module="TABLE_HEADERS" name="OPENING_BALANCE"
                                            orientation={TEXT_ORIENTATION.UPPERCASE} /> :
                                        <span className={`open-balance ${getColorCode(openBalance)}`}>
                                            {checkEmpty(openBalance)}</span>
                                    </div>
                                </div> :
                                null
                        }
                        <div className="bo-baseTable detail-view">
                            <table className="bo-table">
                                {
                                    (resultDetailArray && resultDetailArray.length) ?
                                        <thead className="thead-scroller">
                                            <tr>
                                                <th className="firstChild width12">
                                                    <span className="cursor"
                                                        onClick={() => onSort(SORT_DATATYPE.DATE, 'vocDate')}
                                                    >
                                                        <LangText module="TABLE_HEADERS" name="VOC_DATE" />
                                                    </span>
                                                    <SortIcon colName="vocDate" getSortIcon={getSortIconCB}
                                                        type={SORT_DATATYPE.DATE} onIconSort={onIconSort} />
                                                </th>
                                                <th className="effec-date width12">
                                                    <span className="cursor"
                                                        onClick={() => onSort(SORT_DATATYPE.DATE, 'effDate')}
                                                    >
                                                        <LangText module="TABLE_HEADERS" name="EFFEC_DATE" />
                                                    </span>
                                                    <SortIcon colName="effDate" getSortIcon={getSortIconCB}
                                                        type={SORT_DATATYPE.DATE} onIconSort={onIconSort} />
                                                </th>
                                                <th className="exch-head">
                                                    <span>
                                                        <LangText module="TABLE_HEADERS" name="EXCH_SEG" />
                                                    </span>
                                                </th>
                                                <th className="voc-head">
                                                    <span>
                                                        <LangText module="TABLE_HEADERS" name="VOC_TYPE" />
                                                    </span>
                                                </th>
                                                <th className="narration-head width15">
                                                    <span>
                                                        <LangText module="TABLE_HEADERS" name="NARRATION" />
                                                    </span>
                                                </th>
                                                <th>
                                                    <span>
                                                        <LangText module="TABLE_HEADERS" name="CHQ_NO" />
                                                    </span>
                                                </th>
                                                <th>
                                                    <span>
                                                        <LangText module="TABLE_HEADERS" name="DEBIT" />
                                                    </span>
                                                </th>
                                                <th>
                                                    <span>
                                                        <LangText module="TABLE_HEADERS" name="CREDIT" />
                                                    </span>
                                                </th>
                                                <th className="width15">
                                                    <span>
                                                        <LangText module="TABLE_HEADERS" name="BALANCE" />
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
                                        (resultDetailArray && resultDetailArray.length) ?
                                            resultDetailArray.map((item, index) => {
                                                return (
                                                    <>
                                                        <tr key={index}>
                                                            <td className="firstChild width12">
                                                                <span>{checkEmpty(item.vocDate)}</span>
                                                            </td>
                                                            <td className="effec-values width12">
                                                                <span>{checkEmpty(item.effDate)}</span>
                                                            </td>
                                                            <td className="exc-values">
                                                                <span>{checkEmpty(item.exc)}</span>
                                                            </td>
                                                            <td className="voctype">
                                                                <span>{checkEmpty(item.vtyp)}</span>
                                                            </td>
                                                            <td className="narration-value text-nowrap width15">
                                                                <span title={item.nartn}>{checkEmpty(item.nartn)}</span>
                                                            </td>
                                                            <td>
                                                                <span>{checkEmpty(item.chqueNo)}</span>
                                                            </td>
                                                            <td>
                                                                <span className={`debit 
                                                                ${getPositive_Negative_ColorCode(item.dramt)}`}>
                                                                    {checkEmpty(item.dramt)}</span>
                                                            </td>
                                                            <td>
                                                                <span className={`credit ${getColorCode(item.cramt)}`}>
                                                                    {checkEmpty(item.cramt)}</span>
                                                            </td>
                                                            <td className="width15">
                                                                <span>{checkEmpty(item.blnc)}</span>
                                                            </td>
                                                        </tr>
                                                    </>

                                                )
                                            })
                                            :
                                            null
                                    }

                                </tbody>

                            </table>

                        </div>
                        {
                            closeBalance ?   
                                <div className="balance-detail">
                                    <div className="detail-close-title">
                                        <LangText module="TABLE_HEADERS" name="CLOSING_BALANCE" /> :
                                        <span className={`open-balance ${getColorCode(closeBalance)}`}>
                                            {checkEmpty(closeBalance)}</span>
                                    </div>
                                </div> :
                                null
                        }

                    </div>
            }
        </>

    // </ >

    )
}

export default (WidgetLoader(FinancialLedgerComponent));
