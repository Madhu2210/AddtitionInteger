import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'
import { connect } from 'react-redux'

import LangText from '../../../../common/lang/LangText';
import { DATE_FORMATS, BO_REPORTS_INTEREST_REPORT_OPTIONS, 
    AF_EVENT_NAMES, AF_EVENT_TYPES, TEXT_ORIENTATION } from '../../../../common/Constants';
import {
    AF_EventTriggered,
    checkEmpty, getBackOfficeBaseURL,
    getFormatedDate} from '../../../../common/CommonMethods';

import { BO_REPORT_SERVICE } from '../../../../config/ServiceURLs'

import { storeDpcRoi, storeMtfRoi } from '../../../../state/actions/Actions';

import { WidgetLoader } from '../../../common/WidgetLoaderComponent';
function InterestReportComponent(props) {

    const MsfFetch = useFetch()

    const [resultDpcArray, setResultDpcArray] = useState([])
    const [resultMTFArray, setResultMTFArray] = useState([])
    const [resultTotalArray, setResultTotalArray] = useState({})
    const [resultTotalArrayMtf, setResultTotalArrayMtf] = useState({})

    const [errorMsg, setErrorMsg] = useState(null)

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.INTEREST_REPORT)
    },[])

    useEffect(() => {
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
    }, [props.frmDte, props.toDte, props.selectedInterestReportType])

    useEffect(() => {
        if (props.frmDte || props.toDte) {
            if (props.selectedInterestReportType.name === BO_REPORTS_INTEREST_REPORT_OPTIONS.DPC) {
                setResultTotalArray({})
                getBOInterestDpcreports(props.frmDte, props.toDte)

            }
            else {
                setResultTotalArrayMtf({})
                getBOInterestMTFReports(props.frmDte, props.toDte)
            }
        }
    }, [props.frmDte, props.toDte, props.boSelectedFilter, props.selectedInterestReportType])

    function getBOInterestDpcreports(from, to) {
        props.showWidgetLoader();
        setResultDpcArray([])
        setErrorMsg(null)
        let request = new MsfRequest();
        request.addToData({
            "frmDte": getFormatedDate(from, 0, DATE_FORMATS.DDMMYYYY, true).stringDate,
            "toDte": getFormatedDate(to, 0, DATE_FORMATS.DDMMYYYY, true).stringDate
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + BO_REPORT_SERVICE.INTEREST_REPORT_DPC,
            request,
            successRespCBGetBOInterestDpcreports,
            errorRespCBGetBOInterestDpcreports
        )
    }

    function successRespCBGetBOInterestDpcreports(response) {
        props.hideWidgetLoader();
        setResultDpcArray(response.data.report)
        setResultTotalArray(response.data)
        props.storeDpcRoi(response.data.dbtRoi)
        props.pdfDownloadUrl(response.data.pdfDownloadUrl.url)
        props.xlsxDownloadUrl(response.data.excelDownloadUrl.url)
        setErrorMsg(null)
        props.downloadUrl(true)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD_SUCCESS)

    }

    function errorRespCBGetBOInterestDpcreports(error) {
        props.hideWidgetLoader();
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
        setErrorMsg(error.message)
        props.downloadUrl(false)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD_FAILURE)

    }

    function getBOInterestMTFReports(from, to) {
        props.showWidgetLoader();
        setResultMTFArray([])
        setErrorMsg(null)
        let request = new MsfRequest();
        request.setEncrypt(false)
        request.addToData({
            "frmDte": getFormatedDate(from, 0, DATE_FORMATS.DDMMYYYY, true).stringDate,
            "toDte": getFormatedDate(to, 0, DATE_FORMATS.DDMMYYYY, true).stringDate
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + BO_REPORT_SERVICE.INTEREST_REPORT_MTF,
            request,
            successRespCBGetBOInterestMTFReports,
            errorRespCBGetBOInterestMTFReports
        )
    }

    function successRespCBGetBOInterestMTFReports(response) {
        props.hideWidgetLoader();
        setResultMTFArray(response.data.report)
        props.storeMtfRoi(response.data.mtfRoi)
        setResultTotalArrayMtf(response.data)
        props.pdfDownloadUrl(response.data.pdfDownloadUrl.url)
        props.xlsxDownloadUrl(response.data.excelDownloadUrl.url)
        setErrorMsg(null)
        props.downloadUrl(true)
    }

    function errorRespCBGetBOInterestMTFReports(error) {
        props.hideWidgetLoader();
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
        setErrorMsg(error.message)
        props.downloadUrl(false)
    }
    return (

        <div className="bo-baseTable">
            {
                (props.selectedInterestReportType.name === "Delay Payment Charges (DPC)")
                    ?
                    <div className="interest-dpc">
                        <table className="bo-table interest-dpc">
                            {
                                (resultDpcArray && resultDpcArray.length) ?
                                    <thead className="thead-scroller">
                                        <tr>
                                            <th className="firstChild width10">
                                                <span>
                                                    <LangText module="TABLE_HEADERS" name="DATE" 
                                                        orientation={TEXT_ORIENTATION.UPPERCASE}/>
                                                </span>
                                            </th>
                                            <th>
                                                <span>
                                                    <LangText module="TABLE_HEADERS" name="INTEREST_CHARGES" 
                                                        orientation={TEXT_ORIENTATION.UPPERCASE}/>
                                                </span>
                                            </th>
                                            <th>
                                                <span>
                                                    <LangText module="TABLE_HEADERS" name="LEDGER_BALANCE"
                                                        orientation={TEXT_ORIENTATION.UPPERCASE} />
                                                </span>
                                            </th>
                                            <th>
                                                <span>
                                                    <LangText module="TABLE_HEADERS" name="DPC_RATE"
                                                        orientation={TEXT_ORIENTATION.UPPERCASE} />
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
                                    (resultDpcArray && resultDpcArray.length) ?
                                        resultDpcArray.map((item, index) => {
                                            return (
                                                <>
                                                    <tr key={index}>
                                                        <td className="firstChild width10">
                                                            <span>{checkEmpty(item.dpcDte)}</span>
                                                        </td>
                                                        <td>
                                                            <span>{checkEmpty(item.ntDpcChg)}</span>
                                                        </td>
                                                        <td>
                                                            <span>
                                                                {checkEmpty(item.dpcBalChg)}</span>
                                                        </td>
                                                        <td>
                                                            <span>
                                                                {checkEmpty(item.dpcRate)}</span>
                                                        </td>
                                                    </tr>
                                                </>

                                            )
                                        })
                                        : null
                                }
                            </tbody>
                            <tfoot className="total-interest">
                                {
                                    (resultTotalArray && Object.keys(resultTotalArray).length !== 0) ?
                                        <>
                                            <tr>
                                                <td className="interest-total width15">
                                                    <span><LangText module="BO" name="TOTAL" /></span>
                                                </td>
                                                <td className="total-charge">
                                                    <span>{checkEmpty(resultTotalArray.totDpcCharge)}</span>
                                                </td>
                                            </tr>
                                        </>
                                        :
                                        null
                                }
                            </tfoot>
                        </table>
                    </div>
                    :
                    <div className="interest-mtf">
                        <table className="bo-table interest-mtf">
                            {
                                (resultMTFArray && resultMTFArray.length) ?
                                    <thead className="thead-scroller">
                                        <tr>
                                            <th className="mtf-date width10">
                                                <span>
                                                    <LangText module="TABLE_HEADERS" name="TXN_DATE"
                                                        orientation={TEXT_ORIENTATION.UPPERCASE} />
                                                </span>
                                            </th>
                                            <th >
                                                <span>
                                                    <LangText module="TABLE_HEADERS" 
                                                        name="NET_LEDGER_BALANCE" 
                                                        orientation={TEXT_ORIENTATION.UPPERCASE}/>
                                                </span>
                                                {/* <p>
                                                    <LangText module="INTEREST_REPORT_HEADER" name="A" />
                                                </p> */}
                                            </th>
                                            <th>
                                                <span>
                                                    <LangText module="TABLE_HEADERS" name="MTF_INTEREST_AMOUNT" 
                                                        orientation={TEXT_ORIENTATION.UPPERCASE}/>
                                                </span>
                                                {/* <p>
                                                    <LangText module="INTEREST_REPORT_HEADER" name="B" />
                                                </p> */}
                                            </th>
                                            <th >
                                                <span>
                                                    <LangText module="TABLE_HEADERS" name="DPC_RATE" 
                                                        orientation={TEXT_ORIENTATION.UPPERCASE}/>
                                                </span>
                                                {/* <p>
                                                    <LangText module="INTEREST_REPORT_HEADER" name="C" />
                                                </p> */}
                                            </th>
                                            {/* <th className="mtf-fomargin">
                                                <span>
                                                    <LangText module="TABLE_HEADERS" name="FO_MARGIN" />
                                                </span>
                                                <p>
                                                    <LangText module="INTEREST_REPORT_HEADER" name="D" />
                                                </p>
                                            </th> */}
                                            {/* <th className="mtf-cashreqformargin">
                                                <span>
                                                    <LangText module="TABLE_HEADERS" name="CASH_REQUIRED_FOR_MARGIN" />
                                                </span>
                                                <p>
                                                    <LangText module="INTEREST_REPORT_HEADER" name="E" />
                                                </p>
                                            </th> */}
                                            {/* <th className="mtf-surpluscashformtf">
                                                <span>
                                                    <LangText module="TABLE_HEADERS" name="SURPLUS_CASH_FOR_MTF" />
                                                </span>
                                                <p>
                                                    <LangText module="INTEREST_REPORT_HEADER" name="F" />
                                                </p>
                                            </th> */}
                                            {/* <th className="mtf-netmtfdebit">
                                                <span>
                                                    <LangText module="TABLE_HEADERS" name="NET_MTF_DEBIT" />
                                                </span>
                                                <p>
                                                    <LangText module="INTEREST_REPORT_HEADER" name="G" />
                                                </p>
                                            </th> */}
                                            {/* <th className="mtf-interestamount">
                                                <span>
                                                    <LangText module="TABLE_HEADERS" name="MTF_INTEREST_AMOUNT" />
                                                </span>
                                                <p>
                                                    <LangText module="INTEREST_REPORT_HEADER" name="H" />
                                                </p>
                                            </th> */}
                                            {/* <th className="mtf-rate">
                                                <span className="mtf-rate">
                                                    <LangText module="TABLE_HEADERS" name="MTF_RATE" />
                                                </span>
                                                <p>
                                                    <LangText module="INTEREST_REPORT_HEADER" name="I" />
                                                </p>
                                            </th> */}
                                        </tr>
                                    </thead>
                                    :
                                    <tr className="errorRow">
                                        <td className="colspan">{errorMsg}</td>
                                    </tr>
                            }
                            <tbody className="tbody-scroller">
                                {
                                    (resultMTFArray && resultMTFArray.length) ?
                                        resultMTFArray.map((item, index) => {
                                            return (
                                                <>
                                                    <tr key={index}>
                                                        <td className="firstChild width10">
                                                            <span>{checkEmpty(item.mtfDte)}</span>
                                                        </td>
                                                        <td >
                                                            <span>{checkEmpty(item.runningBalance)}</span>
                                                        </td>
                                                        <td >
                                                            <span>{checkEmpty(item.mtfIntrstAmt)}</span>
                                                        </td>
                                                        <td >
                                                            <span>{checkEmpty(item.mtfIntrstPercent)}</span>
                                                        </td>
                                                        {/* <td className="mtf-fomargin-data">
                                                            <span>{checkEmpty(item.foMargin)}</span>
                                                        </td> */}
                                                        {/* pause */}
                                                        {/* <td className="mtf-cashreqformargin-data">
                                                            <span>{checkEmpty(item.cashForFifty)}</span>
                                                        </td> */}
                                                        {/* <td className="mtf-surpluscashformtf-data">
                                                            <span>{checkEmpty(item.surplusCashForMtf)}</span>
                                                        </td> */}
                                                        {/* <td className="mtf-netmtfdebit-data">
                                                            <span>{checkEmpty(item.netMTFDebit)}</span>
                                                        </td>
                                                        <td className="mtf-interestamount-data">
                                                            <span>{checkEmpty(item.mtfIntrstAmt)}</span>
                                                        </td>
                                                        <td>
                                                            <span>{checkEmpty(item.mtfRate)}</span>
                                                        </td> */}
                                                    </tr>
                                                </>

                                            )
                                        })
                                        : null
                                }
                            </tbody>
                            <tfoot className="total-interest">
                                {
                                    (resultMTFArray && resultMTFArray.length) ?
                                        <>
                                            <tr>
                                                <td className="interest-total mtfWidth-total">
                                                    <span><LangText module="BO" name="TOTAL" /></span>
                                                </td>
                                                <td className="total-charge mtfWidth-totalcharge">
                                                    <span>{checkEmpty(resultTotalArrayMtf.mtfintrstTotal)}</span>
                                                </td>
                                            </tr>
                                        </>
                                        :
                                        null
                                }
                            </tfoot>

                        </table>
                    </div>

            }
        </div>

    )
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeDpcRoi: (s) => { dispatch(storeDpcRoi(s)) },
        storeMtfRoi: (s) => { dispatch(storeMtfRoi(s)) }
    };
};
export default connect(null, mapDispatchToProps)(WidgetLoader(InterestReportComponent))