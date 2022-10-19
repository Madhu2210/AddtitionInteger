import React, { useState, useEffect } from 'react'
import { useFetch, MsfRequest } from '../../../../index'
import {
    getBackOfficeBaseURL, getFormatedDate, checkEmpty, sortByDateBO, sortFlagFunc, sortByDateBrokBO, AF_EventTriggered
} from '../../../../common/CommonMethods';
import { BO_REPORT_SERVICE } from '../../../../config/ServiceURLs'
import { WidgetLoader } from '../../../common/WidgetLoaderComponent';
import LangText from '../../../../common/lang/LangText';
import {
    DATE_FORMATS, SORT_DATATYPE, SORT_TYPES, BO_REPORTS_BROKERAGE_FILTER_MENU,
    BO_REPORTS_PNL_FILTER_MENU,
    TEXT_ORIENTATION,
    AF_EVENT_NAMES,
    AF_EVENT_TYPES
} from '../../../../common/Constants';
import { SortIcon, UpArrowIcon, DownArrowIcon } from '../../../common/FontIcons';

function BrokerageReportComponent(props) {
    const MsfFetch = useFetch()

    const [resultArray, setResultArray] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    const [cashBrok, setCashBrok] = useState("");
    const [fnoBrok, setFnoBrok] = useState("");
    const [totalBrok, setTotalBrok] = useState("");
    const [selectedShowMoreIndex, setSelectedShowMoreIndex] = useState(null)
    const [sortAsc, setSortAsc] = useState(true);
    const [sortFlag, setSortFlag] = useState(
        [
            { column: "date", sortAsc: null },
        ]
    )
    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.BROKERAGE_REPORT)
    }, [])

    useEffect(() => {
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
        getBrokerageReports(props.frmDte, props.toDte)
        setSelectedShowMoreIndex(null)
    }, [props.frmDte, props.toDte])

    function getBrokerageReports(from, to) {
        props.showWidgetLoader();
        setResultArray([])
        setErrorMsg(null)
        resetSortIcons()
        let request = new MsfRequest();
        request.addToData({
            "frmDte": getFormatedDate(from, 0, DATE_FORMATS.DDMMYYYY, true).stringDate,
            "toDte": getFormatedDate(to, 0, DATE_FORMATS.DDMMYYYY, true).stringDate
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + BO_REPORT_SERVICE.BROKERAGE_REPORT,
            request,
            successRespCBGetBrokReport,
            errorRespCBGetBrokReport
        )
    }

    function successRespCBGetBrokReport(response) {
        props.hideWidgetLoader();
        if ((props.boSelectedBrokerageInterval.name === BO_REPORTS_BROKERAGE_FILTER_MENU.CURRENT_FY)
            ||
            (props.boSelectedBrokerageInterval.name === BO_REPORTS_BROKERAGE_FILTER_MENU.LAST_FY)) {
            let result = getFormatedResultArray(response.data.report)
            setResultArray(result);

        } else {
            setResultArray(response.data.report)
        }
        setCashBrok(response.data.gndttlcshBrok);
        setFnoBrok(response.data.gndttlfnoBrok);
        setTotalBrok(response.data.gndttltotalBrok)
        props.pdfDownloadUrl(response.data.pdfDownloadUrl.url)
        props.xlsxDownloadUrl(response.data.excelDownloadUrl.url)
        if ((props.boSelectedBrokerageInterval.name !== BO_REPORTS_PNL_FILTER_MENU.THIS_MONTH) &&
            (props.boSelectedBrokerageInterval.name !== BO_REPORTS_PNL_FILTER_MENU.LAST_MONTH) &&
            (props.boSelectedBrokerageInterval.name !== BO_REPORTS_PNL_FILTER_MENU.CURRENT_FY) &&
            (props.boSelectedBrokerageInterval.name !== BO_REPORTS_PNL_FILTER_MENU.LAST_FY)) {
            if(!convertDate(props.frmDte, props.toDte)){
                let result = getFormatedResultArray(response.data.report)
                setResultArray(result);
            }
        }
        setErrorMsg(null)
        props.downloadUrl(true)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD_SUCCESS)
    }

    function errorRespCBGetBrokReport(error) {
        props.hideWidgetLoader();
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
        setCashBrok('');
        setFnoBrok('');
        setTotalBrok('')
        props.downloadUrl(false)
        setErrorMsg(error.message)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , error.message)

    }

    function getFormatedResultArray(reportData) {
        if (reportData) {
            let keyArray = Object.keys(reportData)
            let valueArray = Object.values(reportData)
            let formatedArray = valueArray.map((item, index) => {
                item.date = keyArray[index]
                return item
            })

            return formatedArray
        }

        return []
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
    function onSortFY(type, key1) {
        setSelectedShowMoreIndex(null)
        onSortByDateFYCB(null, key1)
    }
    function onSortByDateFYCB(sortType, key1) {
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

        let sortedSymList = sortByDateBrokBO(ascSort, resultArray, key1);
        
        setResultArray(sortedSymList)
        if (resultArray && resultArray.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1)
            setSortFlag(updatedSortFlag)
        }

    }
    function onIconSortFY(type, key, sortType) {
        setSelectedShowMoreIndex(null)
        onSortByDateFYCB(sortType, key, sortType)
    }

    function showMoreDetails(index) {
        if (index === selectedShowMoreIndex)
            setSelectedShowMoreIndex(null)
        else
            setSelectedShowMoreIndex(index)
    }

    function resetSortIcons() {
        let flags = Object.assign([], sortFlag)
        let updatedFlags = flags.map((item) => {
            item.sortAsc = null
            return item
        })
        setSortFlag(updatedFlags)
    }

    function convertDate(str1, str2) {
        let date1 = new Date(str1);
        let date2 = new Date(str2);
        let month1 = ("0" + (date1.getMonth() + 1)).slice(-2);
        let month2 = ("0" + (date2.getMonth() + 1)).slice(-2);
        let year1  = date1.getFullYear()
        let year2  = date2.getFullYear()
        if ((month1 === month2) && (year1 === year2)) {
            return true
        }
        return false
    }

    return (
        <div className="bo-baseTable">
            {(resultArray && resultArray.length)  ?
                <div className="brokerage-header">
                    <div className="brokerage-header-label">
                        <span> <LangText module="TABLE_HEADERS" name="CASH_BROKERAGE" />
                            <span className="brokerage-header-val">{checkEmpty(cashBrok)}</span></span>
                        <span> <LangText module="TABLE_HEADERS" name="FNO_BROKERAGE" />
                            <span className="brokerage-header-val">{checkEmpty(fnoBrok)}</span></span>
                        <span> <LangText module="TABLE_HEADERS" name="TOTAL_BROKERAGE" />
                            <span className="brokerage-header-val">{checkEmpty(totalBrok)}</span></span>
                    </div>
                </div> : null
            }
            {
                ((props.boSelectedBrokerageInterval.name === BO_REPORTS_BROKERAGE_FILTER_MENU.THIS_MONTH) ||
                    (props.boSelectedBrokerageInterval.name === BO_REPORTS_BROKERAGE_FILTER_MENU.LAST_MONTH)) ?

                    <table className="bo-table brokerage-report">

                        {
                            (resultArray && resultArray.length) ? (
                                <thead className="thead-scroller">
                                    <tr className="tr-brokerage">
                                        <th className="firstChild">
                                            <span className="cursor"
                                                onClick={() => onSort(SORT_DATATYPE.DATE, 'date')}
                                            >
                                                <LangText module="TABLE_HEADERS" name="DATE" 
                                                    orientation={TEXT_ORIENTATION.UPPERCASE}/>
                                            </span>
                                            <SortIcon colName="date"
                                                getSortIcon={getSortIconCB}
                                                type={SORT_DATATYPE.DATE}
                                                onIconSort={onIconSort} />
                                        </th>
                                        <th >
                                            <span>
                                                <LangText module="TABLE_HEADERS" name="CASH" />
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                <LangText module="TABLE_HEADERS" name="F_AND_O" />
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                <LangText module="TABLE_HEADERS" name="TOTAL" />
                                            </span>
                                        </th>
                                    </tr>
                                </thead>

                            ) :
                                <tr className="errorRow">
                                    <td className="colspan">{errorMsg}</td>
                                </tr>
                        }

                        <tbody className="tbody-scroller">
                            {(resultArray && resultArray.length) ?
                                resultArray.map((item, index) => {
                                    return (
                                        <>
                                            <tr key={index}>
                                                <td className="firstChild ">
                                                    <span className>{checkEmpty(item.date)}</span>
                                                </td>
                                                <td >
                                                    <span>{checkEmpty(item.cshBrok)}</span>
                                                </td>
                                                <td >
                                                    <span>{checkEmpty(item.fnoBrok)}</span>
                                                </td>
                                                <td >
                                                    <span>{checkEmpty(item.totalBrok)}</span>
                                                </td>

                                            </tr>
                                        </>

                                    )
                                })
                                : null}

                        </tbody>
                    </table>
                    :

                    ((props.boSelectedBrokerageInterval.name === BO_REPORTS_BROKERAGE_FILTER_MENU.CURRENT_FY)
                        ||
                        (props.boSelectedBrokerageInterval.name === BO_REPORTS_BROKERAGE_FILTER_MENU.LAST_FY))
                        ?
                        <table className="bo-table brokerage-report">

                            {
                                (resultArray && resultArray.length) ? (
                                    <thead className=" thead-scroller">
                                        <tr className="tr-brokerage">
                                            <th className="firstChild">
                                                <span className="cursor"
                                                    onClick={() => onSortFY(SORT_DATATYPE.DATE, "date")}
                                                >
                                                    <LangText module="TABLE_HEADERS" name="DATE"
                                                        orientation={TEXT_ORIENTATION.UPPERCASE} />
                                                </span>
                                                <SortIcon colName="date"
                                                    getSortIcon={getSortIconCB}
                                                    type={SORT_DATATYPE.DATE}
                                                    onIconSort={onIconSortFY} />
                                            </th>
                                            <th >
                                                <span>
                                                    <LangText module="TABLE_HEADERS" name="CASH" />
                                                </span>
                                            </th>
                                            <th>
                                                <span>
                                                    <LangText module="TABLE_HEADERS" name="F_AND_O" />
                                                </span>
                                            </th>
                                            <th>
                                                <span>
                                                    <LangText module="TABLE_HEADERS" name="TOTAL" />
                                                </span>
                                            </th>
                                            <th className="width4">
                                            </th>
                                        </tr>
                                    </thead>

                                ) :
                                    <tr className="errorRow">
                                        <td className="colspan">{errorMsg}</td>
                                    </tr>
                            }

                            <tbody className="tbody-scroller">
                                {
                                    (resultArray && resultArray.length) ? (

                                        resultArray.map((item, index) => {
                                            return (
                                                <>
                                                    <tr key={index}>
                                                        <td className="firstChild ">
                                                            <span >{checkEmpty(item.date)}</span>
                                                        </td>
                                                        <td >
                                                            <span>{checkEmpty(item.ttlcshBrok)}</span>
                                                        </td>
                                                        <td >
                                                            <span>{checkEmpty(item.ttlfnoBrok)}</span>
                                                        </td>
                                                        <td >
                                                            <span>{checkEmpty(item.ttltotalBrok)}</span>
                                                        </td>
                                                        <td className="width4">
                                                            {
                                                                selectedShowMoreIndex === index ?
                                                                    <UpArrowIcon className="showMoreIcon cursor"
                                                                        onClick={() => showMoreDetails('')}
                                                                    />
                                                                    :
                                                                    <DownArrowIcon className="showMoreIcon cursor"
                                                                        onClick={() => showMoreDetails(index)}
                                                                    />
                                                            }
                                                        </td>
                                                    </tr>
                                                    {
                                                        selectedShowMoreIndex === index ? (
                                                            <div className="moreDetails">
                                                                {item.records.map((subItem, date) => {
                                                                    return (
                                                                        <tr key={date} className="moreDetlRow">
                                                                            <td className="firstChild ">
                                                                                <span className="moreDetLabel">
                                                                                    {checkEmpty(subItem.date)}</span>
                                                                            </td>
                                                                            <td className="moreDetTd ">
                                                                                <span className="moreDetLabel">
                                                                                    {checkEmpty(subItem.cshBrok)}</span>
                                                                            </td>
                                                                            <td className="moreDetTd ">
                                                                                <span className="moreDetLabel">
                                                                                    {checkEmpty(subItem.fnoBrok)}</span>
                                                                            </td>
                                                                            <td className="moreDetTd ">
                                                                                <span className="moreDetLabel">
                                                                                    {checkEmpty(subItem.totalBrok)}
                                                                                </span>
                                                                            </td>
                                                                            <td className="width4">
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })}
                                                            </div>)
                                                            : null
                                                    }
                                                </>

                                            )
                                        }))
                                        : null}
                            </tbody>
                        </table> :
                        (convertDate(props.frmDte, props.toDte)) ?
                            <table className="bo-table">
                                {
                                    (resultArray && resultArray.length) ? (
                                        <thead className="thead-scroller">
                                            <tr className="tr-brokerage">
                                                <th className="firstChild">
                                                    <span className="cursor"
                                                        onClick={() => onSort(SORT_DATATYPE.DATE, 'date')}
                                                    >
                                                        <LangText module="TABLE_HEADERS" name="DATE"
                                                            orientation={TEXT_ORIENTATION.UPPERCASE}/>
                                                    </span>
                                                    <SortIcon colName="date"
                                                        getSortIcon={getSortIconCB}
                                                        type={SORT_DATATYPE.DATE}
                                                        onIconSort={onIconSort} />
                                                </th>
                                                <th >
                                                    <span>
                                                        <LangText module="TABLE_HEADERS" name="CASH" />
                                                    </span>
                                                </th>
                                                <th>
                                                    <span>
                                                        <LangText module="TABLE_HEADERS" name="F_AND_O" />
                                                    </span>
                                                </th>
                                                <th>
                                                    <span>
                                                        <LangText module="TABLE_HEADERS" name="TOTAL" />
                                                    </span>
                                                </th>
                                            </tr>
                                        </thead>

                                    ) :
                                        <tr className="errorRow">
                                            <td className="colspan">{errorMsg}</td>
                                        </tr>
                                }
                                <tbody className="tbody-scroller">
                                    {

                                        (resultArray && resultArray.length) ? (

                                            resultArray.map((item, index) => {

                                                return (
                                                    <>

                                                        <tr key={index}>
                                                            <td className="firstChild ">
                                                                <span >{checkEmpty(item.date)}</span>
                                                            </td>
                                                            <td >
                                                                <span>{checkEmpty(item.cshBrok)}</span>
                                                            </td>
                                                            <td >
                                                                <span>{checkEmpty(item.fnoBrok)}</span>
                                                            </td>
                                                            <td >
                                                                <span>{checkEmpty(item.totalBrok)}</span>
                                                            </td>
                                                        </tr>

                                                    </>

                                                )
                                            }))
                                            : null}
                                </tbody>

                            </table> :
                            <table className="bo-table brokerage-report">
                                {
                                    (resultArray && resultArray.length) ? (
                                        <thead className=" thead-scroller">
                                            <tr className="tr-brokerage">
                                                <th className="firstChild">
                                                    <span className="cursor"
                                                        onClick={() => onSortFY(SORT_DATATYPE.DATE, "date")}
                                                    >
                                                        <LangText module="TABLE_HEADERS" name="DATE" 
                                                            orientation={TEXT_ORIENTATION.UPPERCASE}/>
                                                    </span>
                                                    <SortIcon colName="date"
                                                        getSortIcon={getSortIconCB}
                                                        type={SORT_DATATYPE.DATE}
                                                        onIconSort={onIconSortFY} />
                                                </th>
                                                <th >
                                                    <span>
                                                        <LangText module="TABLE_HEADERS" name="CASH" />
                                                    </span>
                                                </th>
                                                <th>
                                                    <span>
                                                        <LangText module="TABLE_HEADERS" name="F_AND_O" />
                                                    </span>
                                                </th>
                                                <th>
                                                    <span>
                                                        <LangText module="TABLE_HEADERS" name="TOTAL" />
                                                    </span>
                                                </th>

                                                <th className="width4">
                                                </th>
                                            </tr>
                                        </thead>

                                    ) :
                                        <tr className="errorRow">
                                            <td className="colspan">{errorMsg}</td>
                                        </tr>
                                }
                                <tbody className="tbody-scroller">
                                    {
                                        (resultArray && resultArray.length) ? (

                                            resultArray.map((item, index) => {
                                                return (
                                                    <>
                                                        <tr key={index}>
                                                            <td className="firstChild ">
                                                                <span >{checkEmpty(item.date)}</span>
                                                            </td>
                                                            <td >
                                                                <span>{checkEmpty(item.ttlcshBrok)}</span>
                                                            </td>
                                                            <td >
                                                                <span>{checkEmpty(item.ttlfnoBrok)}</span>
                                                            </td>
                                                            <td >
                                                                <span>{checkEmpty(item.ttltotalBrok)}</span>
                                                            </td>
                                                            <td className="width4">
                                                                {
                                                                    selectedShowMoreIndex === index ?
                                                                        <UpArrowIcon className="showMoreIcon cursor"
                                                                            onClick={() => showMoreDetails('')}
                                                                        />
                                                                        :
                                                                        <DownArrowIcon
                                                                            className="showMoreIcon cursor"
                                                                            onClick={() => showMoreDetails(index)}
                                                                        />
                                                                }
                                                            </td>
                                                        </tr>
                                                        {
                                                            selectedShowMoreIndex === index ? (
                                                                <div className="moreDetails">
                                                                    {item.records.map((subItem, date) => {
                                                                        return (
                                                                            <tr key={date} className="moreDetlRow">
                                                                                <td className="firstChild">
                                                                                    <span className="moreDetLabel">
                                                                                        {checkEmpty(subItem.date)}
                                                                                    </span>
                                                                                </td>
                                                                                <td className="moreDetTd ">
                                                                                    <span className="moreDetLabel">
                                                                                        {checkEmpty(subItem.cshBrok)}
                                                                                    </span>
                                                                                </td>
                                                                                <td className="moreDetTd ">
                                                                                    <span className="moreDetLabel">
                                                                                        {checkEmpty(subItem.fnoBrok)}
                                                                                    </span>
                                                                                </td>
                                                                                <td className="moreDetTd ">
                                                                                    <span className="moreDetLabel">
                                                                                        {checkEmpty(subItem.totalBrok)}
                                                                                    </span>
                                                                                </td>
                                                                                <td className="width4">

                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    })}
                                                                </div>)
                                                                : null
                                                        }
                                                    </>

                                                )
                                            }))
                                            : null}
                                </tbody>
                            </table>

            }

        </div>
    )
}

export default (WidgetLoader(BrokerageReportComponent));
