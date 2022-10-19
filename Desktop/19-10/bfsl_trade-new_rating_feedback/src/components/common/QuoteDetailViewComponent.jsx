import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import { withStreaming } from '../../index'

import LangText from '../../common/lang/LangText'
import { MinimizeIcon } from './FontIcons';
import { SCREENS, STREAMING_MODULES } from '../../common/Constants';
import { checkEmpty, indicesInstrumentFilter } from '../../common/CommonMethods';
import QuoteDetailsGradient from './QuoteDetailsGradient';

const QuoteDetailViewComponent = (props) => {

    const [streamingResp, setStreamingResp] = useState({})
    const [quoteDetails, setQuoteDetails] = useState({})
    const [showIndexDetail, setShowIndexDetail] = useState(false)

    useEffect(() => {
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.QUOTE_DETAILS);
    }, [])

    useEffect(() => {
        if (props.selectedSym && props.selectedSym !== {}) {
            setQuoteDetails({ sym: props.selectedSym })
            let symbols = []
            symbols.push(props.selectedSym)
            props.forceSubscribeLevel1(symbols)
        } else {
            props.forceSubscribeLevel1([])
            setQuoteDetails({})
        }
    }, [props.selectedSym])

    useEffect(() => {
        if (streamingResp !== {}) 
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function setStreamingResptoSymbols(resp) {
        let { data } = resp;
        if (data) {
            let quotes = Object.assign({}, quoteDetails)
            quotes = Object.assign({}, quotes, data);
            if(indicesInstrumentFilter(quotes.sym)) 
                setShowIndexDetail(false)
            else
                setShowIndexDetail(true)
            setQuoteDetails(quotes)
        }
    }

    function onClickMinimize() {
        let backScreen = props.goBackScreen ? 
            ((props.goBackScreen) === SCREENS.QUOTE ? SCREENS.DASHBOARD : props.goBackScreen) : SCREENS.DASHBOARD
        props.history.push(backScreen)
    }

    return (
        <div className="quoteDetails-div withBorder">
            <div className="quoteDetails-header">
                <span className="weeksHeader">  <LangText module="QUOTE" name="WEEKS_HEADER" /></span>
            </div>
            <div className="mid-gradient">
                <QuoteDetailsGradient low={quoteDetails.yLow} high={quoteDetails.yHigh} />
            </div>
            <div className="data-row">
                <div className="coloum1">
                    <div className="row">
                        <span className="label"><LangText module="SYM_DETAILS" name="OPEN" /></span>
                        <span className="data">{checkEmpty(quoteDetails.open)}</span>
                    </div>
                    <div className="row">
                        <span className="label"><LangText module="SYM_DETAILS" name="HIGH" /></span>
                        <span className="data">{checkEmpty(quoteDetails.high)}</span>
                    </div>
                    <div className="row">
                        <span className="label"><LangText module="SYM_DETAILS" name="LOW" /></span>
                        <span className="data">{checkEmpty(quoteDetails.low)}</span>
                    </div>
                    <div className="row">
                        <span className="label"><LangText module="SYM_DETAILS" name="CLOSE_SYM" /></span>
                        <span className="data">{checkEmpty(quoteDetails.close)}</span>
                    </div>
                    { showIndexDetail  ?
                        <div className="row">
                            <span className="label"><LangText module="SYM_DETAILS" name="LCL" /></span>
                            <span className="data">{checkEmpty(quoteDetails.lcl)}</span>
                        </div>
                        :
                        null
                    }
                </div>
                <div className="coloum2">
                    <div className="row">
                        <span className="label"><LangText module="SYM_DETAILS" name="VOLUME" /></span>
                        <span className="data">{checkEmpty(quoteDetails.vol)}</span>
                    </div>
                    <div className="row">
                        <span className="label"><LangText module="SYM_DETAILS" name="OI" /></span>
                        <span className="data">{checkEmpty(quoteDetails.OI)}</span>
                    </div>
                    <div className="row">
                        <span className="label"><LangText module="SYM_DETAILS" name="OI_CHG_PER" /></span>
                        <span className="data">{checkEmpty(quoteDetails.OIChngPer)}</span>
                    </div>
                    <div className="row">
                        <span className="label"><LangText module="SYM_DETAILS" name="ATP" /></span>
                        <span className="data">{checkEmpty(quoteDetails.atp)}</span>
                    </div>
                    { showIndexDetail  ?
                        <div className="row">
                            <span className="label"><LangText module="SYM_DETAILS" name="UCL" /></span>
                            <span className="data">{checkEmpty(quoteDetails.ucl)}</span>
                        </div>
                        :
                        null
                    }
                </div>
            </div>
            {
                props.selectedSym ?
                    (props.parent === SCREENS.QUOTE && !props.selectedSym.disableExpand) ?
                        <MinimizeIcon onClick={onClickMinimize} />
                        : null
                    : null
            }
        </div>
    )
}

const mapStateToProps = ({ quote }) => {
    return {
        goBackScreen: quote.goBackScreen
    }
}

export default connect(mapStateToProps, null)(withStreaming(withRouter(QuoteDetailViewComponent)));