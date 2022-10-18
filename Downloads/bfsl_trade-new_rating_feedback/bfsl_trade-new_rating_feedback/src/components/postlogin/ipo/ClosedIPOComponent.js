import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useFetch, MsfRequest, withStreaming } from '../../../index'

import { WidgetLoader } from '../../common/WidgetLoaderComponent'
import LangText, { getLangText } from '../../../common/lang/LangText'

import { IPO_SERVICES } from '../../../config/ServiceURLs'

import {
    getBackOfficeBaseURL, checkEmpty, applyPaint, replaceComma,
    getDecimal_Precision, convertCommaSeparated, getFormatedDate, AF_EventTriggered
} from '../../../common/CommonMethods'
import { DownArrowIcon, UpArrowIcon } from '../../common/FontIcons'
// import { STREAMING_MODULES, STREAMING_KEYS, SCREENS, DATE_FORMATS, TEXT_ORIENTATION } from '../../../common/Constants'
import { STREAMING_MODULES, STREAMING_KEYS, SCREENS, DATE_FORMATS, AF_EVENT_NAMES, AF_EVENT_TYPES, TEXT_ORIENTATION } 
from '../../../common/Constants'
import { gotoQuote } from '../../../common/Bridge'
import { connect } from 'react-redux'

function ClosedIPOComponent(props) {

    const MsfFetch = useFetch()

    const [closedIPO, setClosedIPO] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    const [streamingResp, setStreamingResp] = useState({})
    const [showStatusIndex, setShowStatusIndex] = useState(null)

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.IPO , AF_EVENT_TYPES.CLOSED_IPO)
    },[])

    useEffect(() => {
        getClosedIPO()
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.CLOSED_IPO);
    }, [])

    useEffect(() => {
        if (streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function streamingSubscription(symArrayList) {
        let symbols = symArrayList.map(l => l.sym)
        props.subscribeLevel1(
            symbols,
            [STREAMING_KEYS.LTP]
        )
    }

    function setStreamingResptoSymbols(resp) {
        let { data } = resp;
        let newList = closedIPO.map(row => {
            if (row.sym && row.sym.streamSym === data.symbol) {
                row = Object.assign({}, row, applyPaint(row, data));
                if (row.listedPrce && row.ltp)
                    row.ipoPer = convertCommaSeparated(((parseFloat(replaceComma(row.ltp)) -
                        parseFloat(replaceComma(row.listedPrce))) / parseFloat(replaceComma(row.listedPrce)))
                        * 100, getDecimal_Precision(row.sym.exc))
            }
            return row;
        })
        if (newList.length)
            setClosedIPO(newList)
    }

    function getClosedIPO() {
        props.showWidgetLoader()
        setClosedIPO([])
        setErrorMsg(null)
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + IPO_SERVICES.CLOSED_IPO,
            request,
            successRespCBGetClosedIPO,
            errorRespCBGetClosedIPO
        )
    }

    function successRespCBGetClosedIPO(response) {
        let dataList = response.data.closedIPOList
        setClosedIPO(dataList)
        let symList = dataList.filter(item => { return item.sym })
        streamingSubscription(symList)
        setErrorMsg(null)
        props.hideWidgetLoader()
    }

    function errorRespCBGetClosedIPO(error) {
        setClosedIPO([])
        setErrorMsg(error.message)
        props.hideWidgetLoader()
    }

    function gotoQuoteCB(symData) {
        if (symData.sym) {
            props.history.push(SCREENS.DASHBOARD)
            gotoQuote(symData)
        }
    }

    function onClickShowStatus(index) {
        if (index !== showStatusIndex)
            setShowStatusIndex(index)
        else
            setShowStatusIndex(null)
    }

    return (
        <div className="ipo-content-base closed-ipo-base">
            <div className="IPO-table">
                {
                    (closedIPO && closedIPO.length) ?
                        closedIPO.map((item, index) => {
                            return (
                                <div key={index} className="dataRow">
                                    <div className="name">
                                        <span className={item.sym ? 'quote-click' : ''}
                                            title={item.sym ? '' : getLangText("NO_SYM_TO_QUOTE", "MESSAGES")}
                                            onClick={item.sym ? () => gotoQuoteCB(item) : null}
                                        >
                                            {checkEmpty(item.ipoNme)}
                                        </span>
                                    </div>
                                    <div className="data">
                                        <div className="column column-md first">
                                            <span className="label"><LangText name="SYMBOL" module="IPO" /></span>
                                            <span className="value">{checkEmpty(item.ipoBidNme)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label">
                                                <LangText name="ISSUE_OPEN_DATE" module="IPO" /></span>
                                            <span className="value">
                                                {checkEmpty(getFormatedDate(item.offrStartDte, 0,
                                                    DATE_FORMATS.DDMMMYYYY, false).stringDate)}</span>
                                        </div>
                                        <div className={`column ${props.selectedLang.id === "hindi" ?
                                            "column-gujarati" : ""} `}>
                                            <span className="label">
                                                <LangText name="ISSUE_CLOSE_DATE" module="IPO" /></span>
                                            <span className="value">
                                                {checkEmpty(getFormatedDate(item.offrEndDte, 0,
                                                    DATE_FORMATS.DDMMMYYYY, false).stringDate)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="ISSUE_PRICE" module="IPO" 
                                                orientation={TEXT_ORIENTATION.UPPERCASE}/></span>
                                            <span className="value">{checkEmpty(item.issuePrce)}</span>
                                        </div>
                                        <div className="column column-sm">
                                            <span className="label"><LangText name="MIN_LOT" module="IPO"
                                                orientation={TEXT_ORIENTATION.UPPERCASE}/></span>
                                            <span className="value">{checkEmpty(item.minQty)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="ISSUE_SIZE" module="IPO"
                                                orientation={TEXT_ORIENTATION.UPPERCASE} /></span>
                                            <span className="value">{checkEmpty(item.issueSize)}</span>
                                        </div>
                                        <div className="column column-sm">
                                            <span className="label"><LangText name="LTP" module="IPO" /></span>
                                            <span className="value">{checkEmpty(item.ltp)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label">
                                                <LangText name="IPO_PERFORM_PER" module="IPO" /></span>
                                            <span className="value">{checkEmpty(item.ipoPer)}</span>
                                        </div>
                                        <div className="column column-sm">
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
        </div >
    )
}
const mapStateToProps = ({settings }) => {
    return {
      
        selectedLang: settings.selectedLang
    }
}
export default connect(mapStateToProps, null)(WidgetLoader(withStreaming(withRouter(ClosedIPOComponent))));
// export default WidgetLoader(withStreaming(withRouter(ClosedIPOComponent)));