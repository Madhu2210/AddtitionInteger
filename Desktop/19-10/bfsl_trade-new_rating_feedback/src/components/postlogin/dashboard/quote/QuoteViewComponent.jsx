import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { useFetch, withStreaming, MsfRequest } from '../../../../index'

import LangText from '../../../../common/lang/LangText';
import ToggleMenu from '../../../common/ToggleComponent'

import { storeSelectedDashboardWidget, showAppDialog, storeSelectedQuoteSym } from '../../../../state/actions/Actions';

import {
    DASHBOARD_WIDGET_MODE,
    EXCHANGE_TOGGLE_DATA, ORDER_TYPES, STREAMING_KEYS, STREAMING_MODULES, THEMES
} from '../../../../common/Constants';
import {
    applyPaint, getDispSymbolName, checkEmpty, getColorCode,
    getMarketDataBaseURL, isEquityCashSymbol, isEquityFutureSymbol
} from '../../../../common/CommonMethods';
import { gotoAlert, gotoQuote, gotoTrade } from '../../../../common/Bridge';
import { QUOTE } from '../../../../config/ServiceURLs';
import {  NotifyIcon } from '../../../common/FontIcons';

function QuoteViewComponent(props) {

    const [streamingResp, setStreamingResp] = useState({})
    const [quoteDetails, setQuoteDetails] = useState({})
    const [excArray, setExcArray] = useState([])
    const [exc, setExc] = useState(null)
    const MsfFetch = useFetch()

    useEffect(() => {
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.QUOTE_VIEW);
    }, [])
    useEffect(() => {
        if (props.selectedSym && props.selectedSym !== {}) {
            setQuoteDetails({ sym: props.selectedSym })
            let symbols = []
            symbols.push(props.selectedSym)
            props.forceSubscribeLevel1(symbols,
                [STREAMING_KEYS.LTP, STREAMING_KEYS.CHANGE, 
                    STREAMING_KEYS.CHANGE_PER, STREAMING_KEYS.LTT])
            setExc(props.selectedSym.exc)
        } else {
            props.forceSubscribeLevel1([])
            setQuoteDetails({})
        }

        if (isEquityCashSymbol(props.selectedSym.exc)) {
            setExcArray(EXCHANGE_TOGGLE_DATA.EQUITY)
        }
        else if (isEquityFutureSymbol(props.selectedSym.exc)) {
            setExcArray(EXCHANGE_TOGGLE_DATA.FUTURE)
        }
    }, [props.selectedSym])
    useEffect(() => {
        if (streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    function setStreamingResptoSymbols(resp) {
        let { data } = resp;
        if (data) {
            let quotes = Object.assign({}, quoteDetails)
            quotes = Object.assign({}, quotes, applyPaint(quotes, data));
            setQuoteDetails(quotes)
        }
    }

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function gotoChartView() {
        if (props.selectedWidgetMode !== DASHBOARD_WIDGET_MODE.QUOTE_VIEW && props.selectedWidgetMode
            !== DASHBOARD_WIDGET_MODE.INDICES_VIEW)
            props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.ORDER_WITH_QUOTE)
    }

    function onClickTrade(e, type) {
        e.preventDefault()
        e.stopPropagation()
        gotoTrade(props.selectedSym, type)
    }
    function setSelectedExcType(type) {
        let request = new MsfRequest();
        request.addToData({
            sym: props.selectedSym,
            otherExch: type
        })
        request.setEncrypt(false)
        MsfFetch.placeRequest(
            getMarketDataBaseURL() + QUOTE.GET_SYMBOL_INFO,
            request,
            successRespCBgetOtherExc,
            errorRespCBggetOtherExc
        )
    }

    function successRespCBgetOtherExc(response) {
        if (props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.ORDER_WITH_QUOTE)
            gotoQuote(response.data, false)
        else
            gotoQuote(response.data)
    }

    function errorRespCBggetOtherExc(error) {
        props.showAppDialog({
            show: true,
            message: error.message
        })
    }

    function onClickCloseQuote() {
        props.storeSelectedQuoteSym(null)
        props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT)
    }

    function onClickOpenAlert(e) {
        e.preventDefault()
        e.stopPropagation()
        props.storeSelectedQuoteSym(null)
        gotoAlert(props.selectedSym)
    }

    return (
        <div className={`quote-view ${(props.selectedWidgetMode
             !== DASHBOARD_WIDGET_MODE.ORDER_WITH_QUOTE && props.selectedWidgetMode
              !== DASHBOARD_WIDGET_MODE.QUOTE_VIEW && props.selectedWidgetMode
              !== DASHBOARD_WIDGET_MODE.INDICES_VIEW) ? 'cursor' : ''}`}
        onClick={gotoChartView}
        >
            <div className="detailsDiv">
                <div className="details">
                    <span className="symName">{getDispSymbolName(quoteDetails).primaryName}</span>
                    {
                        props.selectedWidgetMode !== DASHBOARD_WIDGET_MODE.INDICES_VIEW ?
                            quoteDetails.sym ?
                                (quoteDetails.sym.otherExch && quoteDetails.sym.otherExch.length) ?
                                    <ToggleMenu menus={excArray}
                                        selectedMenu={exc}
                                        orderAction={true}
                                        hasToggle={true}
                                        onSelectMenuCB={setSelectedExcType}
                                    /> :
                                    <span className="exc">{quoteDetails.sym.exc}</span>
                                : null
                            : null
                    }
                    {
                        isEquityFutureSymbol(props.selectedSym.exc) ?
                            <span className="lotSize"> 
                                <LangText module="QUOTE" name="LOTS" />
                                 : {checkEmpty(props.selectedSym.lotSize)} 
                                <LangText module="QUOTE" name="QTY" /></span>
                            :
                            null
                    }
                </div>{
                    props.selectedWidgetMode !== DASHBOARD_WIDGET_MODE.INDICES_VIEW ?
                        <span className="compName">
                            {getDispSymbolName(quoteDetails).secondaryName}
                        </span>
                        : ''
                }

                <span className="lttVal">{checkEmpty(quoteDetails.ltt)}</span>
            </div>
            <div className={`actionDiv ${(props.selectedWidgetMode ===
                 DASHBOARD_WIDGET_MODE.INDICES_VIEW) ? 'indicesViw' : ''}`}>
                <div className="ltpValDiv">
                    <span className="ltp">
                        <span className={quoteDetails.ltpClass}>
                            {checkEmpty(quoteDetails.ltp)}
                        </span>
                    </span>
                    <span className={`chngVal ${getColorCode(quoteDetails.chng)}`}>
                        {checkEmpty(quoteDetails.chng)}({checkEmpty(quoteDetails.chngPer)}%)
                    </span>
                    <span></span>
                </div>
                {
                    props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.INDICES_VIEW ?
                        <div className="close-button" onClick={onClickCloseQuote} >
                            {
                                props.selectedTheme.theme === THEMES.LIGHT ?
                                    <img src="assets/images/dashboard/close_icon.svg" alt="" />
                                    :
                                    <img src="assets/images/dark/dashboard/close_icon.svg" alt="" />
                            }
                        </div>
                        :
                        <>
                            <div className="btn-div">
                                <button className="buy-btn2" onClick={(e) => onClickTrade(e, ORDER_TYPES.BUY)}>
                                    <LangText  name="BUY_BTN" />
                                </button>
                                <button className="sell-btn2" onClick={(e) => onClickTrade(e, ORDER_TYPES.SELL)}>
                                    <LangText  name="SELL_BTN" />
                                </button>
                            </div>
                            <div className="alert-div" onClick={(e) => onClickOpenAlert(e)}>
                                <NotifyIcon className="alert"/>
                            </div>
                            <div className="close-button" onClick={onClickCloseQuote} >
                                {
                                    props.selectedTheme.theme === THEMES.LIGHT ?
                                        <img src="assets/images/dashboard/close_icon.svg" alt="" />
                                        :
                                        <img src="assets/images/dark/dashboard/close_icon.svg" alt="" />
                                }
                            </div>
                        </>
                }

            </div>

        </div>
    )
}

const mapStateToProps = ({ dashboard, settings }) => {
    return {
        selectedWidgetMode: dashboard.selectedWidgetMode,
        selectedTheme: settings.selectedTheme
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeSelectedQuoteSym: (s) => { dispatch(storeSelectedQuoteSym(s)) }

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStreaming(QuoteViewComponent));