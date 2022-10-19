import React, { useState } from "react";
import { CsvIcon, PdfIcon } from "../../../common/FontIcons";
import LangText from '../../../../common/lang/LangText';
import { AF_EventTriggered } from "../../../../common/CommonMethods";
import { AF_EVENT_CATEOGORY_TYPES_NEW_CONST, AF_EVENT_NAMES_NEW_CONST } from "../../../../common/NewConstants";

function DownloadAsComponent(props) {
    const [selected, setSelected] = useState('')

    function onSelectPDF() {
        setSelected("pdf")
        AF_EventTriggered(AF_EVENT_NAMES_NEW_CONST.DOWNLOAD , AF_EVENT_CATEOGORY_TYPES_NEW_CONST.DOWNLOAD_PDF,
            {"onDownload":"success"})     

    }

    function onSelectExcel() {
        setSelected("excel")
        AF_EventTriggered(AF_EVENT_NAMES_NEW_CONST.DOWNLOAD , AF_EVENT_CATEOGORY_TYPES_NEW_CONST.DOWNLOAD_EXCEL,
            {"onDownload":"success"}) 
    }

    return (
        <div className="downloadAs" >
            <div className="option-content">
                <span className={`format-option-val ${selected === "pdf" ? 'selected' : ''}`}>
                    <PdfIcon className="cursor" />
                    <a href={props.pdfDownloadUrl} className="cursor" onClick={onSelectPDF} >
                        <LangText module="BO" name="PDF_DWNLD" /></a>
                </span>
                <span className={`format-option-val ${selected === "excel" ?
                    'selected' : ''}`}>
                    <CsvIcon className="cursor" />
                    <a href={props.xlsxDownloadUrl} className="cursor" onClick={onSelectExcel} >
                        <LangText module="BO" name="EXCEL_DWNLD" /></a>
                </span>
            </div>
        </div>
    )
}
export default DownloadAsComponent;
