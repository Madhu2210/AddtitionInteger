/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import LangText from '../../../../common/lang/LangText';
import { AF_EVENT_NAMES, AF_EVENT_TYPES, DATE_FORMATS } from '../../../../common/Constants';
import { AF_EventTriggered, checkEmpty, getBackOfficeBaseURL, getFormatedDate } from '../../../../common/CommonMethods';

import { BO_REPORT_SERVICE } from '../../../../config/ServiceURLs'

import { WidgetLoader } from '../../../common/WidgetLoaderComponent';

function ContractNoteDownloadComponent(props) {

    const MsfFetch = useFetch()

    const [resultArray, setResultArray] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.CONTRACT_NOTE_DOWNLOAD)
    }, [])

    useEffect(() => {
        if (props.toDte)
            getBOReports(props.frmDte, props.toDte)
    }, [props.frmDte, props.toDte])

    function getBOReports(from, to) {
        props.showWidgetLoader();
        setResultArray([])
        setErrorMsg(null)
        let request = new MsfRequest();
        request.addToData({
            "frmDte": getFormatedDate(from, 0, DATE_FORMATS.DDMMYYYY, true).stringDate,
            "toDte": getFormatedDate(to, 0, DATE_FORMATS.DDMMYYYY, true).stringDate
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + BO_REPORT_SERVICE.CONTRACT_NOTE_DOWNLOAD,
            request,
            successRespCBGetBOReport,
            errorRespCBGetBOReport
        )
    }

    function successRespCBGetBOReport(response) {
        props.hideWidgetLoader();
        setResultArray(response.data.fileList)
        setErrorMsg(null)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD_SUCCESS)

    }

    function errorRespCBGetBOReport(error) {
        props.hideWidgetLoader();
        setErrorMsg(error.message)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , error)

    }

    return (

        <div className="bo-baseTable">
            <table className="bo-table">
                {
                    (resultArray && resultArray.length) ? 
                        <thead className="thead-scroller">
                            <tr>
                                <th className={`firstChild width40`}>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="CONTRACT_NOTE" />
                                    </span>
                                </th>
                                <th className="action width10">
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="ACTIONS" />
                                    </span>
                                </th>
                            </tr>
                        </thead>:
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
                                            <td className="firstChild width30">
                                                <span>{checkEmpty(item.DisplayDte)}</span>
                                            </td>
                                            <td className="width10">
                                                <a className="download"
                                                    href={item.downloadUrl}
                                                    download={item.fileName}><LangText 
                                                        module="BO" name="DWNLOADLINK" /></a>
                                            </td>
                                            <td className="width40">
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
export default (WidgetLoader(ContractNoteDownloadComponent));

