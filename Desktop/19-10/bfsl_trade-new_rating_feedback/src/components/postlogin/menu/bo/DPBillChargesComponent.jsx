import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import LangText from '../../../../common/lang/LangText';
// import { SORT_DATATYPE, DATE_FORMATS, SORT_TYPES, TEXT_ORIENTATION } from '../../../../common/Constants';
import { SORT_DATATYPE, DATE_FORMATS, SORT_TYPES, AF_EVENT_NAMES, 
    AF_EVENT_TYPES, TEXT_ORIENTATION } from '../../../../common/Constants';
import {
    checkEmpty, getBackOfficeBaseURL,
    getFormatedDate, sortFlagFunc, 
    sortByString, AF_EventTriggered} from '../../../../common/CommonMethods';

import { SortIcon } from '../../../common/FontIcons';
import { BO_REPORT_SERVICE } from '../../../../config/ServiceURLs'

import { WidgetLoader } from '../../../common/WidgetLoaderComponent';

function DPBillChargesComponent(props) {

    const MsfFetch = useFetch()

    const [resultArray, setResultArray] = useState([])
    const [sortFlag, setSortFlag] = useState(
        [
            { column: "instrument", sortAsc: null },
        ]
    )
    const [sortAsc, setSortAsc] = useState(true)
    const [errorMsg, setErrorMsg] = useState(null)
    const [resultTotalArray, setResultTotalArray] = useState({})

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DP_BILL_CHARGES)
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
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + BO_REPORT_SERVICE.DP_BILL_CHARGES,
            request,
            successRespCBGetBOReport,
            errorRespCBGetBOReport
        )
    }

    function successRespCBGetBOReport(response) {
        props.hideWidgetLoader();
        setResultArray(response.data.report)
        setResultTotalArray(response.data.grandttltotalcharges)
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
        <>
            <div className="bo-baseTable dpbill">
                <table className="bo-table dpbill-charges">
                    {
                        (resultArray && resultArray.length) ?
                            <thead className="thead-scroller">
                                <tr className="qty-charges-header"> 
                                    <th colSpan="1" scope="colgroup" className="scrip-namecol width18"></th>
                                    <th colSpan="1" scope="colgroup" className="datecol width10"></th>
                                    <th colSpan="1" scope="colgroup" className="qty-col width8">
                                    </th>
                                    <th colSpan="1" scope="colgroup" className="qty-col width8">
                                        <LangText module="TABLE_HEADERS" name="QUANTITY" 
                                            orientation={TEXT_ORIENTATION.UPPERCASE}/>
                                    </th>
                                    <th colSpan="1" scope="colgroup" className="qty-col last width8"></th>
                                    <th colSpan="1" scope="colgroup" className=" chrg-col width9">
                                    </th>
                                    <th colSpan="1" scope="colgroup" className="chrg-col">
                                        <span><LangText module="TABLE_HEADERS" name="CHARGES" /> </span> 
                                    </th>
                                    <th colSpan="1" scope="colgroup" className="chrg-col last width10"></th>

                                    <th colSpan="1" scope="colgroup" className="lastcol width22"></th>

                                </tr>  
                                <tr>
                                    <th className="firstChild script-name width18">
                                        <span className="cursor"
                                            onClick={() => onSort(SORT_DATATYPE.STRING, 'instrument')}
                                        >
                                            <LangText module="TABLE_HEADERS" name="SCRIP_NAME" />
                                        </span>
                                        <SortIcon colName="instrument"
                                            getSortIcon={getSortIconCB}
                                            type={SORT_DATATYPE.STRING}
                                            onIconSort={onIconSort} />
                                        <br/>
                                        <span>
                                            <LangText module="TABLE_HEADERS" 
                                                name="ISIN" />                                       
                                        </span>
                                    </th>
                                    <th className="date-header width10">
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="DATE" 
                                                orientation={TEXT_ORIENTATION.UPPERCASE}/>
                                        </span>
                                    </th>
                                    <th className="opening-qty-header width8">
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="OPENING_QTY" />
                                        </span>
                                    </th>
                                    <th className=" cred-debit-header width8" >
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="DEBIT_QTY" />/
                                            <LangText module="TABLE_HEADERS" name="CREDIT_QTY" />
                                        </span>
                                    </th>
                                    {/* <th>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="CREDIT_QTY" />
                                    </span>
                                </th> */}
                                    <th className="balance-qty-header width8" >
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="BALANCE_QTY" />
                                        </span>
                                    </th>
                                    <th className=" dep-charges-header width9" >
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="DEPOSITORY_CHARGES" />
                                        </span>
                                    </th>
                                    <th className="taxes-header" >
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="TAXES" />
                                        </span>
                                    </th>
                                    <th className="total-chrgs-header width10">
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="TOTAL_CHARGES" />
                                        </span>
                                    </th>
                                    <th className="lastChild width22 ">
                                        <span>
                                            <LangText module="TABLE_HEADERS" name="CHARGE_DETAILS" />
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
                                                <td className="firstChild script-name width18 ">
                                                    <span>{checkEmpty(item.instrument)}</span>
                                                    <br/>
                                                    <span className="isin">{checkEmpty(item.isin)}</span>
                                                </td>
                                                <td className="date-data width10" >
                                                    <span>{checkEmpty(item.trdDte)}</span>
                                                </td>
                                                <td className="opening-qty-data width8" >
                                                    <span>{checkEmpty(item.opngtQty)}</span>
                                                </td>
                                                <td className="cred-debit-data width8" >
                                                    <span className={!parseInt(item.dbtQty) ? "credit" : "debit"
                                                    }>
                                                        {!parseInt(item.dbtQty) ? item.crdtQty : item.dbtQty
                                                        }
                                                    </span>
                                                    {/* <span>{checkEmpty(item.dbtQty)}</span> */}
                                                </td>
                                                {/* <td>
                                                <span>{checkEmpty(item.crdtQty)}</span>
                                            </td> */}
                                                <td className="balance-qty-data width8" >
                                                    <span>{checkEmpty(item.blncQty)}</span>
                                                </td>
                                                <td className=" dep-charges-data width9" >
                                                    <span>{checkEmpty(item.chrgs)}</span>
                                                </td>
                                                <td className="taxes-data" >
                                                    <span>{checkEmpty(item.taxes)}</span>
                                                </td>
                                                <td className="total-charges-data width10">
                                                    <span>{checkEmpty(item.ttlChrgs)}</span>
                                                </td>
                                                <td className="lastChild text-nowrap width22 " title={item.chrgeDtls}>
                                                    <span>{checkEmpty(item.chrgeDtls)}</span>
                                                </td>
                                            </tr>
                                        </>

                                    )
                                })
                                :
                                null
                        }

                    </tbody>
                    {
                        (resultTotalArray && Object.keys(resultTotalArray).length !== 0) ?
                            <tfoot className="DPbill-total-footer">
                                <>
                                    <tr className="DPbill-totalRow">
                                        <td className="firstChild">
                                            <span className="DPbill-total-text">
                                                <LangText module="BO" name="TOTAL" /></span></td>
                                        <td className="DPbill-total-long">
                                            <span>{checkEmpty(resultTotalArray)}</span>
                                        </td>
                                        <td className="width22" >
                                            <span></span>
                                        </td>
                                    </tr>
                                    <div className="infodiv">
                                        <div className="disclaimer-text">
                                            <LangText module="BO" name="DP_BILL_DISCLAIMER"/></div>
                                        <div className="colorcode-row">
                                            <div className="credit-row">
                                                <span className="circle"></span>
                                                <span className="credittext">
                                                    <LangText module="BO" name="CREDIT"/></span> 
                                            </div>
                                            <div className="debit-row">
                                                <span className="circle red"></span> 
                                                <span className="debittext"><LangText module="BO" name="DEBIT"/></span> 
                                            </div> 
                                        </div>
                                    </div>  
                                </>
                            </tfoot>
                            :
                            null
                    }
                </table>
            </div >
        </>
    )
}
export default (WidgetLoader(DPBillChargesComponent));
