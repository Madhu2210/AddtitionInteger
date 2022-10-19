import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import LangText from '../../../../common/lang/LangText';
import {
    DATE_FORMATS, BO_REPORT_TYPES, SORT_DATATYPE, SORT_TYPES, AF_EVENT_NAMES, AF_EVENT_TYPES
} from '../../../../common/Constants';
import {
    checkEmpty, getBackOfficeBaseURL,
    getFormatedDate, sortByString, sortByDateBO, sortByInt, sortFlagFunc, getColorCode, replaceComma,
    convertCommaSeparated, getCurrentFinancialYear, convertToFloat, checkInt, AF_EventTriggered
} from '../../../../common/CommonMethods';
import { SortIcon } from '../../../common/FontIcons';

import { BO_REPORT_SERVICE } from '../../../../config/ServiceURLs'
import InputComponent from '../../../common/InputComponent';

import { WidgetLoader } from '../../../common/WidgetLoaderComponent';
import { connect } from 'react-redux';
import { storeApproxTaxEquity, storeTotalPnlDer } from '../../../../state/actions/Actions';
function TaxReportComponent(props) {

    const MsfFetch = useFetch()

    const [resultArray, setResultArray] = useState([])
    const [resultTotalArray, setResultTotalArray] = useState({})
    const [totalForDer, setTotalForDer] = useState('')
    const [taxPercentIntraday, setTaxPercentIntraday] = useState('30')
    const [taxPercentShortTerm, setTaxPercentShortTerm] = useState('10')
    const [taxPercentLongTerm, setTaxPercentLongTerm] = useState('15')
    const [intradayTax, setIntradayTax] = useState('')
    const [shorttermTax, setShorttermTax] = useState('')
    const [longtermTax, setLongtermTax] = useState('')

    const [errorMsg, setErrorMsg] = useState(null)

    const [sortAsc, setSortAsc] = useState(true)
    const [sortFlag, setSortFlag] = useState(
        [
            { column: "dispSym", sortAsc: null },
            { column: "expiry", sortAsc: null },
            { column: "instrument", sortAsc: null },
            { column: "optionType", sortAsc: null },
            { column: "strike", sortAsc: null },
            { column: "realisedPnl", sortAsc: null }
        ]
    )

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.TAX_REPORT)
    },[])

    useEffect(() => {
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
    }, [props.boSelectedTaxInterval, props.selectedOrderType])

    useEffect(() => {
        let taxSum;
        if (resultTotalArray && Object.keys(resultTotalArray).length > 0) {
            if (resultTotalArray.intTotal > "0") {
                setIntradayTax(convertCommaSeparated(
                    (convertToFloat(replaceComma(resultTotalArray.intTotal) * taxPercentIntraday) / 100)))
            }
            else {
                setIntradayTax(0)
            }
            if (resultTotalArray.shrtTermTotal > "0") {
                setShorttermTax(convertCommaSeparated(
                    (convertToFloat(replaceComma(resultTotalArray.shrtTermTotal) * taxPercentShortTerm) / 100)))
            }
            else {
                setShorttermTax(0)
            }
            if (resultTotalArray.lngTermTotal > "0") {
                setLongtermTax(convertCommaSeparated(
                    (convertToFloat(replaceComma(resultTotalArray.lngTermTotal) * taxPercentLongTerm) / 100)))
            }
            else {
                setLongtermTax(0)
            }
            // if(intradayTax.length && shorttermTax.length &&longtermTax.length){
            taxSum = convertCommaSeparated(convertToFloat(parseFloat(replaceComma(intradayTax)) + parseFloat(
                replaceComma(shorttermTax)) + parseFloat(replaceComma(longtermTax))))
            props.storeApproxTaxEquity(taxSum)
            // }
        }
        // else{
        //     props.storeApproxTaxEquity(null)
        // }
    }, [resultTotalArray, taxPercentIntraday, taxPercentShortTerm, taxPercentLongTerm,
        intradayTax, shorttermTax, longtermTax])

    useEffect(() => {
        if (props.boSelectedTaxInterval) {
            getFromTo(props.boSelectedTaxInterval, props.boSelectedTaxIndex)
        }
    }, [props.boSelectedTaxInterval, props.selectedOrderType])

    useEffect(() => {
        setTaxPercentIntraday('30')
        setTaxPercentShortTerm('15')
        setTaxPercentLongTerm('10')
    }, [props.selectedOrderType, props.boSelectedTaxInterval])

    function getFromTo(item, index) {
        let date = new Date();
        let firstDay = ''
        let lastDay = ''
        if (index === 0) {
            let currentFyearStart = new Date(getCurrentFinancialYear(date).startDate);
            let currentFyearEnd = new Date(getCurrentFinancialYear(date).endDate);
            firstDay = new Date(currentFyearStart.getFullYear() , currentFyearStart.getMonth(), 1)
            lastDay = new Date(currentFyearEnd.getFullYear() , currentFyearEnd.getMonth(), 31)
        }
        else if (index === 1) {
            let currentFyearStart = new Date(getCurrentFinancialYear(date).startDate);
            let currentFyearEnd = new Date(getCurrentFinancialYear(date).endDate);
            firstDay = new Date(currentFyearStart.getFullYear() - 1, currentFyearStart.getMonth(), 1)
            lastDay = new Date(currentFyearEnd.getFullYear() - 1, currentFyearEnd.getMonth(), 31)
        }
        else if (index === 2) {
            let currentFyearStart = new Date(getCurrentFinancialYear(date).startDate);
            let currentFyearEnd = new Date(getCurrentFinancialYear(date).endDate);
            firstDay = new Date(currentFyearStart.getFullYear() - 2, currentFyearStart.getMonth(), 1)
            lastDay = new Date(currentFyearEnd.getFullYear() - 2, currentFyearEnd.getMonth(), 31)
        }
        else if (index === 3) {
            let currentFyearStart = new Date(getCurrentFinancialYear(date).startDate);
            let currentFyearEnd = new Date(getCurrentFinancialYear(date).endDate);
            firstDay = new Date(currentFyearStart.getFullYear() - 3, currentFyearStart.getMonth(), 1)
            lastDay = new Date(currentFyearEnd.getFullYear() - 3, currentFyearEnd.getMonth(), 31)
        }
        getBOTaxReports(firstDay, lastDay)
    }

    function getBOTaxReports(from, to) {
        props.showWidgetLoader();
        setResultArray([])
        setResultTotalArray({})
        setTotalForDer("")
        setErrorMsg(null)
        let request = new MsfRequest();
        request.addToData({
            "frmDte": getFormatedDate(from, 0, DATE_FORMATS.DDMMYYYY, true).stringDate,
            "toDte": getFormatedDate(to, 0, DATE_FORMATS.DDMMYYYY, true).stringDate,
        })
        if (props.selectedOrderType === BO_REPORT_TYPES[0]) {
            MsfFetch.placeRequest(
                getBackOfficeBaseURL() + BO_REPORT_SERVICE.TAX_REPORT_EQUITY,
                request,
                successRespCBGetBOTaxReports,
                errorRespCBGetBOTaxReports
            )
        }
        if (props.selectedOrderType === BO_REPORT_TYPES[1]) {
            MsfFetch.placeRequest(
                getBackOfficeBaseURL() + BO_REPORT_SERVICE.TAX_REPORT_DERIVATIVE,
                request,
                successRespCBGetBOTaxReports,
                errorRespCBGetBOTaxReports
            )
        }
    }

    function successRespCBGetBOTaxReports(response) {
        props.hideWidgetLoader();
        setResultArray(response.data.report)
        if (props.selectedOrderType === BO_REPORT_TYPES[0]) {
            setResultTotalArray(response.data.total)
            props.pdfDownloadUrl(response.data.pdfDownloadUrl.url)
            props.xlsxDownloadUrl(response.data.excelDownloadUrl.url)
        }
        else {
            setTotalForDer(response.data.total)
            props.storeTotalPnlDer(response.data.total)
            props.pdfDownloadUrl(response.data.pdfDownloadUrl.url)
            props.xlsxDownloadUrl(response.data.excelDownloadUrl.url)
        }
        setErrorMsg(null)
        props.downloadUrl(true)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD_SUCCESS)

    }

    function errorRespCBGetBOTaxReports(error) {
        console.log('error  :', error);
        props.hideWidgetLoader();
        setErrorMsg(error.message)
        if (props.selectedOrderType === BO_REPORT_TYPES[0]) {
            props.storeApproxTaxEquity('')
            props.pdfDownloadUrl('')
        }
        else if (props.selectedOrderType === BO_REPORT_TYPES[1]) {
            props.storeTotalPnlDer('')
            props.xlsxDownloadUrl('')
        }
        props.downloadUrl(false)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD_FAILURE)

    }

    function onChangeValueIntraday(e) {
        if (e.target.value && checkInt(e.target.value) && e.target.value > 0 && e.target.value < 100)
            setTaxPercentIntraday(e.target.value)
        else if (!e.target.value)
            setTaxPercentIntraday(e.target.value)
    }

    function onChangeValueShortTerm(e) {
        if (e.target.value && checkInt(e.target.value) && e.target.value > 0 && e.target.value < 100)
            setTaxPercentShortTerm(e.target.value)
        else if (!e.target.value)
            setTaxPercentShortTerm(e.target.value)
    }

    function onChangeValueLongTerm(e) {
        if (e.target.value && checkInt(e.target.value) && e.target.value > 0 && e.target.value < 100)
            setTaxPercentLongTerm(e.target.value)
        else if (!e.target.value)
            setTaxPercentLongTerm(e.target.value)
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
        else if (type === 'date')
            onSortByDateCB(key1, sortType)
        else if (type === 'int')
            onSortByIntCB(key1, sortType)

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
        }
        else {
            setSortAsc(!sortAsc)
        }

        let sortedSymList = sortByDateBO(ascSort, resultArray, key1)

        setResultArray(sortedSymList)
        if (resultArray && resultArray.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1)
            setSortFlag(updatedSortFlag)
        }

    }

    function onSortByIntCB(key1, sortType) {
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

        let sortedSymList = sortByInt(ascSort, resultArray, key1, false)
        setResultArray(sortedSymList)
        if (resultArray && resultArray.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1)
            setSortFlag(updatedSortFlag)
        }
    }

    return (

        <div className="bo-baseTable">
            {
                (props.selectedOrderType === BO_REPORT_TYPES[0]) ?

                    <table className="bo-table tax-report">
                        {
                            (resultArray && resultArray.length) ?
                                <thead className="thead-scroller">
                                    <tr className="scrip-headings">
                                        <th className="scrip-name-header">
                                            <span>
                                                <LangText module="TABLE_HEADERS" name="SCRIP_NAME" />
                                            </span>
                                        </th>
                                        <th className="pnl-tax-header-empty"></th>
                                        <th className="intradayTax">
                                            <div className="tax-intradaytax">
                                                <span className="header">
                                                    <LangText module="TABLE_HEADERS" name="INTRADAY_TAX" />
                                                </span>
                                                <span className="atPercentInput">
                                                    <span>@</span>
                                                    <InputComponent
                                                        name="taxpercentage"
                                                        className="inputVal taxpercent-input"
                                                        value={taxPercentIntraday}
                                                        onChange={onChangeValueIntraday}
                                                        maxLength={3}
                                                    />
                                                    <span>%</span>
                                                </span>
                                                <span className="tax-val"> (₹) = {intradayTax} </span>
                                            </div>
                                        </th>
                                        <th className="shorttermTax">
                                            <div className="tax-shorttermtax">
                                                <span className="header">
                                                    <LangText module="TABLE_HEADERS" name="SHORT_TERM_TAX" />
                                                </span>
                                                <span className="atPercentInput">
                                                    <span>@</span>
                                                    <InputComponent
                                                        name="taxpercentage"
                                                        className="inputVal taxpercent-input"
                                                        value={taxPercentShortTerm}
                                                        onChange={onChangeValueShortTerm}
                                                        maxLength={3}
                                                    />
                                                    <span>%</span>
                                                </span>
                                                <span className="tax-value"> (₹) = {shorttermTax} </span>
                                            </div>
                                        </th>
                                        <th className="longtermTax">
                                            <div className="tax-longtermtax">
                                                <span className="header">
                                                    <LangText module="TABLE_HEADERS" name="LONG_TERM_TAX" /></span>
                                                <span className="atPercentInput">
                                                    <span>@</span>
                                                    <InputComponent
                                                        name="taxpercentage"
                                                        className="inputVal taxpercent-input"
                                                        value={taxPercentLongTerm}
                                                        onChange={onChangeValueLongTerm}
                                                        maxLength={3}
                                                    />
                                                    <span>%</span>
                                                </span>
                                                <span className="tax-val"> (₹) = {longtermTax} </span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                :
                                <tr className="errorRow">
                                    <td className="colspan">{errorMsg}</td>
                                </tr>
                        }
                        <tbody className="tbody-scroller">
                            {
                                // <tr className="pnl-headings">
                                //     <td className="firstChild width20"></td>
                                //     <td >
                                //         <LangText module="TABLE_HEADERS" name="PL" />
                                //     </td>
                                //     <td>
                                //         <LangText module="TABLE_HEADERS" name="PL" />
                                //     </td>
                                //     <td>
                                //         <LangText module="TABLE_HEADERS" name="PL_ORIGINAL" />
                                //     </td>
                                // </tr>
                            }
                            {
                                (resultArray && resultArray.length) ?
                                    resultArray.map((item, index) => {
                                        return (
                                            <>

                                                <tr key={index} className="equity">
                                                    <td className="scrip-name" >
                                                        <span>{checkEmpty(item.dispSym)}</span>
                                                    </td>
                                                    <td className="pnl-text"> 
                                                        <LangText module="BO" name="PL" />
                                                    </td>
                                                    <td className="intradayPnl" >
                                                        <span className={getColorCode(item.intraPnl)}>
                                                        ₹  {checkEmpty(item.intraPnl)}</span>
                                                    </td>
                                                    <td className="shorttermPnl">
                                                        <span className={getColorCode(item.stPnl)}>
                                                        ₹  {checkEmpty(item.stPnl)}</span>
                                                    </td>
                                                    <td className="longtermPnl">
                                                        <span className={getColorCode(item.ltPnl)}>
                                                        ₹  {checkEmpty(item.ltPnl)}</span>
                                                    </td>
                                                </tr>

                                                <tr className="equity">
                                                    <td className="scrip-name-empty"></td>
                                                    <td className="tax-text"> <LangText module="BO" name="TAX" /></td>
                                                    {
                                                        taxPercentIntraday === "30"
                                                            ?
                                                            <td className="intradayTax-data">
                                                                <span>
                                                                ₹  {checkEmpty(item.intraTax)}
                                                                </span></td>:
                                                            <td className="intradayTax-data">
                                                                <span>
                                                                    ₹  {convertCommaSeparated(
                                                                        (convertToFloat(
                                                                            replaceComma(item.intraPnl) *
                                                                        taxPercentIntraday)/100))}
                                                                </span>
                                                            </td>
                                                    }
                                                    {
                                                        taxPercentShortTerm === "10"
                                                            ?
                                                            <td className="shorttermTax-data">
                                                                <span>
                                                                ₹  {checkEmpty(item.stTax)}</span></td>:
                                                            <td className="shorttermTax-data">
                                                                <span>
                                                                    ₹  {convertCommaSeparated(
                                                                        (convertToFloat(
                                                                            replaceComma(item.stPnl)*
                                                                        taxPercentShortTerm)/100))}
                                                                </span>
                                                            </td>
                                                    }
                                                    {
                                                        taxPercentLongTerm === "15"
                                                            ?
                                                            <td className="longtermTax-data">
                                                                <span> 
                                                                ₹   {checkEmpty(item.ltTax)}</span></td>:
                                                            <td className="longtermTax-data">
                                                                <span>
                                                                    ₹   {convertCommaSeparated(
                                                                        (convertToFloat(
                                                                            replaceComma(item.ltPnl)*
                                                                        taxPercentLongTerm)/100))}
                                                                </span>
                                                            </td>
                                                    }
                                                </tr>
                                            </>

                                        )
                                    })
                                    : null
                            }
                        </tbody>
                        {
                            (resultTotalArray && Object.keys(resultTotalArray).length !== 0) ?
                                <tfoot>
                                    <>
                                        <tr className="tax-report-equity">
                                            <td className="tax-report-equity-total">
                                                <span> <LangText module="BO" name="TOTAL" /></span>
                                            </td>
                                            <td className="intTotal" >
                                                <span>{resultTotalArray.intTotal}</span>
                                            </td>
                                            <td className="shrtTermTotal" >
                                                <span>{resultTotalArray.shrtTermTotal}
                                                </span>
                                            </td>
                                            <td className="lngTermTotal" >
                                                <span>{resultTotalArray.lngTermTotal}
                                                </span>
                                            </td>

                                        </tr>
                                    </>
                                </tfoot>
                                :
                                null
                        }
                    </table>
                    :
                    <table className="bo-table tax-report-derivative">
                        {
                            (resultArray && resultArray.length) ?
                                <thead className="thead-scroller derivative">
                                    <tr>
                                        <th className="firstChild">
                                            <span className="cursor symbol"
                                                onClick={() => onSort(SORT_DATATYPE.STRING, 'dispSym')}>
                                                <LangText module="TABLE_HEADERS" name="SYMBOL" />
                                                <SortIcon colName="dispSym"
                                                    getSortIcon={getSortIconCB}
                                                    type={SORT_DATATYPE.STRING}
                                                    onIconSort={onIconSort} />
                                            </span>
                                        </th>
                                        <th className="expiry">
                                            <span className="cursor"
                                                onClick={() => onSort(SORT_DATATYPE.DATE, 'expiry')}>
                                                <LangText module="TABLE_HEADERS" name="EXPIRY_DATE" />
                                                <SortIcon colName="expiry"
                                                    getSortIcon={getSortIconCB}
                                                    type={SORT_DATATYPE.DATE}
                                                    onIconSort={onIconSort} />
                                            </span>
                                        </th>
                                        <th className="instrument">
                                            <span className="cursor"
                                                onClick={() => onSort(SORT_DATATYPE.STRING, 'instrument')}>
                                                <LangText module="TABLE_HEADERS" name="INSTRUMENT_TYPE" />
                                                <SortIcon colName="instrument"
                                                    getSortIcon={getSortIconCB}
                                                    type={SORT_DATATYPE.STRING}
                                                    onIconSort={onIconSort} />
                                            </span>
                                        </th>
                                        <th className="optiontype">
                                            <span className="cursor"
                                                onClick={() => onSort(SORT_DATATYPE.STRING, 'optionType')}>
                                                <LangText module="TABLE_HEADERS" name="OPTION_TYPE" />
                                                <SortIcon colName="optionType"
                                                    getSortIcon={getSortIconCB}
                                                    type={SORT_DATATYPE.STRING}
                                                    onIconSort={onIconSort} />
                                            </span>
                                        </th>
                                        <th className="strike">
                                            <span className="cursor"
                                                onClick={() => onSort(SORT_DATATYPE.INT, 'strike')}>
                                                <LangText module="TABLE_HEADERS" name="STRIKE_PRICE" />
                                                <SortIcon colName="strike"
                                                    getSortIcon={getSortIconCB}
                                                    type={SORT_DATATYPE.INT}
                                                    onIconSort={onIconSort} />
                                            </span>
                                        </th>
                                        <th className="pnl">
                                            <span className="cursor"
                                                onClick={() => onSort(SORT_DATATYPE.INT, 'realisedPnl')}>
                                                <LangText module="TABLE_HEADERS" name="PROFIT_LOSS" />
                                                <SortIcon colName="realisedPnl"
                                                    getSortIcon={getSortIconCB}
                                                    type={SORT_DATATYPE.INT}
                                                    onIconSort={onIconSort} />
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                :
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
                                                    <td className="firstChild width20">
                                                        <span>{checkEmpty(item.dispSym)}</span>
                                                    </td>
                                                    <td>
                                                        <span>{checkEmpty(item.expiry)}</span>
                                                    </td>
                                                    <td>
                                                        <span>{checkEmpty(item.instrument)}</span>
                                                    </td>
                                                    <td>
                                                        <span>{checkEmpty(item.optionType)}</span>
                                                    </td>
                                                    <td>
                                                        <span>{checkEmpty(item.strike)}</span>
                                                    </td>
                                                    <td>
                                                        <span className={getColorCode(item.realisedPnl)}>
                                                            {checkEmpty(item.realisedPnl)}</span>
                                                    </td>
                                                </tr>
                                            </>

                                        )
                                    })
                                    : null
                            }
                        </tbody>

                        {
                            (totalForDer) ?
                                <tfoot>
                                    <>
                                        <tr className="derivative-total-row">
                                            <td className="firstchild">
                                                <span> <LangText module="BO" name="TOTAL" /></span>
                                            </td>
                                            <td className="derivative-total" >
                                                <span className="derivative-total-pnl-val">{totalForDer}</span>
                                            </td>

                                        </tr>
                                    </>
                                </tfoot>
                                :
                                null

                        }
                    </table>

            }
        </div>

    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeApproxTaxEquity: (s) => { dispatch(storeApproxTaxEquity(s)) },
        storeTotalPnlDer: (s) => { dispatch(storeTotalPnlDer(s)) }
    };
};
export default connect(null, mapDispatchToProps)(WidgetLoader(TaxReportComponent))
