import React, { useState } from 'react'

import LangText from '../../../common/lang/LangText';
import { checkEmpty } from '../../../common/CommonMethods';
import { CopyTextIcon } from '../../common/FontIcons';

function ECollectModeComponent(props) {

    const [titleCopyAcc, setTitleCopyAcc] = useState(false)
    const [titleCopyBank, setTitleCopyBank] = useState(false)
    const [titleCopyIfsc, setTitleCopyIfsc] = useState(false)
    
    function copytoClipboardAcc(text) {
        navigator.clipboard.writeText(''+ text)
        setTimeout(() => {
            setTitleCopyAcc(false)
        },500) 
        setTitleCopyAcc(true)
    }
    
    function copytoClipboardBank(text) {
        navigator.clipboard.writeText(''+ text)
        setTimeout(() => {
            setTitleCopyBank(false)
        },500) 
        setTitleCopyBank(true)
    }

    function copytoClipboardIfsc(text) {
        navigator.clipboard.writeText(''+ text)
        setTimeout(() => {
            setTitleCopyIfsc(false)
        },500) 
        setTitleCopyIfsc(true)
    }
    return (
        <div className="ecollect-details">
            <div className="header">
                {checkEmpty(props.eCollectData.txtOne)} 
                <span className="last-digit">
                    {checkEmpty(props.accountLast.substr(props.accountLast.length - 4))}. 
                </span>
                {checkEmpty(props.eCollectData.txtTwo)}
            </div>
            <div className="content">
                <div className="AccountNumber detail">
                    <span className="item">
                        <LangText module="FUNDS" name="ACC_NO" />  
                    </span>
                    <span className="value">
                        {checkEmpty(props.eCollectData.accNo)}
                        <span className="copy-icon">
                            <div className="tooltip-div">
                                <div className={`tooltip-container right
                                    ${titleCopyAcc === true ? "show" : "hide"}`}>
                                    <span className="title-msg"><LangText module="MESSAGES" 
                                        name="COPIED_TO_CLIP" /></span>
                                    
                                    <span className="triangle"></span>
                                </div>
                                <CopyTextIcon 
                                    onClick={() =>  copytoClipboardAcc(props.eCollectData.accNo)} 
                                    title="Copy to clipboard"           
                                />
                            </div>
                        </span>
                    </span>
                </div>
                <div className="BankName detail">
                    <span className="item">
                        <LangText module="FUNDS" name="BANK_NAME" />  
                    </span>
                    <span className="value">
                        {checkEmpty(props.eCollectData.bnkNme)}
                        <span className="copy-icon">
                            <div className="tooltip-div">
                                <div className={`tooltip-container right
                                    ${titleCopyBank === true ? "show" : "hide"}`}>
                                    <LangText module="MESSAGES" 
                                        name="COPIED_TO_CLIP" />
                                    <span className="triangle"></span>
                                </div>
                                <CopyTextIcon 
                                    onClick={() =>  copytoClipboardBank(props.eCollectData.bnkNme)}
                                    title="Copy to clipboard" />
                            </div>
                        </span>
                    </span>
                </div>
                <div className="ifscCode detail">
                    <span className="item">
                        <LangText module="FUNDS" name="IFSC_CODE" />  
                    </span>
                    <span className="value">
                        {props.eCollectData.ifscCde}
                        <span className="copy-icon">
                            <div className="tooltip-div">
                                <div className={`tooltip-container right
                                    ${titleCopyIfsc === true ? "show" : "hide"}`}>
                                    <LangText module="MESSAGES" 
                                        name="COPIED_TO_CLIP" />
                                    <span className="triangle"></span>
                                </div>
                                <CopyTextIcon 
                                    onClick={() =>  copytoClipboardIfsc(props.eCollectData.ifscCde)}
                                    title="Copy to clipboard" />
                            </div>
                        </span>
                    </span>
                </div>
                <div className="accountType detail">
                    <span className="item">
                        <LangText module="FUNDS" name="ACCOUNT_TYPE" />  
                    </span>
                    <span className="value">
                        {checkEmpty(props.eCollectData.accTyp)}
                    </span>
                </div>
                <div className="Name detail">
                    <span className="item">
                        <LangText module="FUNDS" name="NAME" />  
                    </span>
                    <span className="value">
                        {checkEmpty(props.eCollectData.name)}
                    </span>
                </div>
                <div className="header">
                    {checkEmpty(props.eCollectData.note) }
                </div>

            </div>
        </div>
    )
}
export default ECollectModeComponent;