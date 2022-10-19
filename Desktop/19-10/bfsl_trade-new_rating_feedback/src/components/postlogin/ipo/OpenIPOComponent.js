import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../index'

import { WidgetLoader } from '../../common/WidgetLoaderComponent'
import LangText from '../../../common/lang/LangText'

import { IPO_SERVICES } from '../../../config/ServiceURLs'
import { storeIPODialogDetails } from '../../../state/actions/Actions'


import {
    getBackOfficeBaseURL,
    checkEmpty, convertToFloat, getFormatedDate, checkToday, convertCommaSeparated,
    replaceComma,
    AF_EventTriggered
} from '../../../common/CommonMethods'
import { DownArrowIcon, UpArrowIcon } from '../../common/FontIcons'
// import { IPO_DIALOGS, LOCAL_STORAGE, DATE_FORMATS, TEXT_ORIENTATION } from '../../../common/Constants';
import { IPO_DIALOGS, LOCAL_STORAGE, DATE_FORMATS, AF_EVENT_NAMES, AF_EVENT_TYPES, TEXT_ORIENTATION } 
from '../../../common/Constants';
import { getItemFromSessionStorage } from '../../../common/LocalStorage';

function OpenIPOComponent(props) {

    const MsfFetch = useFetch()

    const [openIPO, setOpenIPO] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    const [showStatusIndex, setShowStatusIndex] = useState(null)
    const [infoMsg, setInfoMsg] = useState(null)

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.IPO , AF_EVENT_TYPES.OPEN_IPO)
    }, [])

    useEffect(() => {
        let ipoInfoMsgs = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.IPO_DETAILS))
        if (ipoInfoMsgs)
            setInfoMsg(ipoInfoMsgs.ListedIPO)
        getOpenIPO()
    }, [])

    function getOpenIPO() {
        props.showWidgetLoader()
        setOpenIPO([])
        setErrorMsg(null)
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + IPO_SERVICES.OPEN_IPO,
            request,
            successRespCBGetOpenIPO,
            errorRespCBGetOpenIPO
        )
    }

    function successRespCBGetOpenIPO(response) {
        
        let list = response.data.currentList
        list.map((item) => {
            item.invesAmt = convertToFloat(convertToFloat(replaceComma(item.noShare))
                * convertToFloat(replaceComma(item.maxPrice)))
            return item
        })
        setOpenIPO(list)
        setErrorMsg(null)
        props.hideWidgetLoader()
    }

    function errorRespCBGetOpenIPO(error) {
        setOpenIPO([])
        setErrorMsg(error.message)
        props.hideWidgetLoader()
    }

    function onClickCancelOrder(data) {
        props.storeIPODialogDetails({
            name: IPO_DIALOGS.CANCEL_ORDER,
            symData: data
        })
    }

    function onClickApplyOrder(data) {
        props.storeIPODialogDetails({
            name: IPO_DIALOGS.APPLY_ORDER,
            symData: data,
            isModify: false
        })
    }

    function onClickModifyOrder(data) {
        props.storeIPODialogDetails({
            name: IPO_DIALOGS.MODIFY_ORDER,
            symData: data,
            isModify: true
        })
    }

    function onClickShowStatus(index) {
        if (index !== showStatusIndex)
            setShowStatusIndex(index)
        else
            setShowStatusIndex(null)
    }

    return (
        <div className="ipo-content-base open-ipo-base">
            <div className="infoMsg-div">
                <span>
                    {infoMsg}
                </span>
            </div>
            <div className="IPO-table open-ipo-table">
                {
                    (openIPO && openIPO.length) ?
                        openIPO.map((item, index) => {
                            return (
                                <div key={index} className="dataRow">
                                    <div className="name">
                                        {checkEmpty(item.ipoNme)}
                                    </div>
                                    <div className="data">
                                        <div className="column first">
                                            <span className="label"><LangText name="SYMBOL" module="IPO" /></span>
                                            <span className="value">{checkEmpty(item.ipoBidNme)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label">
                                                <LangText name="ISSUE_OPEN_DATE" module="IPO" />
                                            </span>
                                            <span className="value">
                                                {checkEmpty(getFormatedDate(item.offrStartDte, 0,
                                                    DATE_FORMATS.DDMMMYYYY, false).stringDate)}</span>
                                        </div>
                                        <div className="column column-lg2">
                                            <span className="label">
                                                <LangText name="ISSUE_CLOSE_DATE" module="IPO" /></span>
                                            {
                                                checkToday(item.issueCloseDte) ?
                                                    <span className="value endDate">
                                                        <LangText name="ISSUE_ENDS_TODAY" module="IPO" />
                                                    </span>
                                                    :
                                                    <span className="value">
                                                        {checkEmpty(getFormatedDate(item.offrEndDte, 0,
                                                            DATE_FORMATS.DDMMMYYYY, false).stringDate)}</span>
                                            }
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="PRICE_RANGE" module="IPO" /></span>
                                            <span className="value">{checkEmpty(item.priceBnd)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="LOT_SIZE" module="IPO"
                                                orientation={TEXT_ORIENTATION.UPPERCASE}/></span>
                                            <span className="value">
                                                {checkEmpty(item.noShare)}{item.noShare ? ' QTY' : ''}
                                            </span>
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="MIN_INVS_AMT" module="IPO" /></span>
                                            <span className="value">
                                                {item.invesAmt ? '₹' : ''}
                                                {checkEmpty(convertCommaSeparated(item.invesAmt))}</span>
                                        </div>
                                        <div className="column column-xl">
                                            {
                                                JSON.parse(item.isApply) ?
                                                    <button className="theme-btn"
                                                        onClick={() => onClickApplyOrder(item)}>
                                                        <LangText name="APPLY" module="BUTTONS" />
                                                    </button>
                                                    :
                                                    <>
                                                        {
                                                            JSON.parse(item.inProcess) ?
                                                                <button className="cancel-btn">
                                                                    <LangText name="IN_PROCESS" module="BUTTONS" 
                                                                        orientation={TEXT_ORIENTATION.UPPERCASE}/>
                                                                </button>
                                                                :
                                                                <>
                                                                    <button className="cancel-btn"
                                                                        onClick={() => onClickCancelOrder(item)}>
                                                                        <LangText name="CANCEL" module="BUTTONS"
                                                                            orientation={TEXT_ORIENTATION.UPPERCASE}/>
                                                                    </button>
                                                                    <button className="theme-btn2"
                                                                        onClick={() => onClickModifyOrder(item)}>
                                                                        <LangText name="MODIFY" module="BUTTONS"
                                                                            orientation={TEXT_ORIENTATION.UPPERCASE}/>
                                                                    </button>
                                                                </>
                                                        }

                                                    </>
                                            }
                                            <span className="statusBtn cursor" onClick={() => onClickShowStatus(index)}>
                                                <span><LangText name="STATUS" module="TABLE_HEADERS" /></span>
                                                {
                                                    showStatusIndex === index ?
                                                        <UpArrowIcon />
                                                        :
                                                        <DownArrowIcon />
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    {
                                        showStatusIndex === index ?
                                            <div className="order-status-tracker">
                                                <div className="lineDiv"></div>
                                                <div className="row">
                                                    <span className="circle"></span>
                                                    <span className="label">
                                                        <LangText name="OFFER_START" module="IPO" />
                                                    </span>
                                                    <span className="date">{checkEmpty(item.offrStartDte)}</span>
                                                </div>
                                                <div className="row">
                                                    <span className="circle"></span>
                                                    <span className="label">
                                                        <LangText name="OFFER_END" module="IPO" />
                                                    </span>
                                                    <span className="date">{checkEmpty(item.offrEndDte)}</span>
                                                </div>
                                                <div className="row">
                                                    <span className="circle"></span>
                                                    <span className="label">
                                                        <LangText name="ALLOTMENT_FINALISATION" module="IPO" />
                                                    </span>
                                                    <span className="date">{checkEmpty(item.finalizedDate)}</span>
                                                </div>
                                                <div className="row">
                                                    <span className="circle"></span>
                                                    <span className="label">
                                                        <LangText name="REFUND_INITIATION" module="IPO" />
                                                    </span>
                                                    <span className="date">{checkEmpty(item.fundsDate)}</span>
                                                </div>
                                                <div className="row">
                                                    <span className="circle"></span>
                                                    <span className="label">
                                                        <LangText name="DEMAT_TRANSFER" module="IPO" />
                                                    </span>
                                                    <span className="date">{checkEmpty(item.allotmntDate)}</span>
                                                </div>
                                                <div className="row">
                                                    <span className="circle"></span>
                                                    <span className="label">
                                                        <LangText name="LISTING" module="IPO" />
                                                    </span>
                                                    <span className="date">{checkEmpty(item.listedDate)}</span>
                                                </div>
                                            </div>
                                            : null
                                    }
                                </div>
                            )
                        })
                        :
                        <div className="errorDiv flex-center">
                            {errorMsg}
                        </div>
                }
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeIPODialogDetails: (s) => { dispatch(storeIPODialogDetails(s)) }
    };
};

export default connect(null, mapDispatchToProps)(WidgetLoader(OpenIPOComponent));