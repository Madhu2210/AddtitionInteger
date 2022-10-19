import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'
import { withStreaming } from '../../../index'

import { WidgetLoader } from '../../common/WidgetLoaderComponent'

import { CHART_SERVICES, HEADER_GUEST, ORDER_PAD } from '../../../config/ServiceURLs';
import { showAppDialog, storeReloadChartSettingsFlag, moveToOrderMenu } from '../../../state/actions/Actions';
import { getLoginType, getSession, gotoTrade, handleInvalidSession } from '../../../common/Bridge';

import { getItemByKey } from '../../../common/LocalStorage'
import { LOCAL_STORAGE, STREAMING_MODULES, SCREENS_GUEST } from '../../../common/Constants'
import { getBaseURL, getDecimal_Precision, getKey, getMarketDataBaseURL } from '../../../common/CommonMethods'
import { CommonErrorMessages } from '../../../common/Messages'
import { AppSettings } from '../../../common/AppSettings';

const ChartWidgetComponent = (props) => {

    const { selectedSym } = props
    const [streamingResp, setStreamingResp] = useState({})
    const [streamSymbol, setStreamSymbol] = useState(null)
    const [chartParams, setChartParams] = useState({})
    const [chartFrameClass, setChartFrameClass] = useState(null)

    useEffect(() => {
        props.registerStreamCB(onStreamCB, props.isModal ? STREAMING_MODULES.CHART_MODAL : STREAMING_MODULES.CHART);
    }, [])

    useEffect(() => {
        if (streamSymbol)
            streamingSubscription(streamSymbol)
        else
            streamingSubscription(null)
    }, [streamSymbol])

    function streamingSubscription(symbol) {
        if (symbol) {
            let symbols = [{ streamSym: symbol }]
            props.forceSubscribeLevel1(symbols)
        }
    }

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    useEffect(() => {
        if (streamingResp.data && selectedSym) {
            if (streamingResp !== {} && streamingResp.data.symbol === selectedSym.streamSym) {
                if (!props.isModal) {
                    let destination = document.getElementById("chart_iframe");
                    if (destination && destination.contentWindow)
                        if (destination.contentWindow.formatStreamingData)
                            destination.contentWindow.formatStreamingData(streamingResp.data)
                }

                if (selectedSym.isModal) {
                    let modalDialog = document.getElementById("chart_iframe_modal");
                    if (modalDialog && modalDialog.contentWindow)
                        if (modalDialog.contentWindow.formatStreamingData)
                            modalDialog.contentWindow.formatStreamingData(streamingResp.data)
                }
            }
        }
    }, [streamingResp])

    useEffect(() => {
        loadChart(false)
    }, [selectedSym, props.selectedTheme.theme])

    useEffect(() => {
        if (props.reloadChartSettings) {
            loadChart(true)
            props.storeReloadChartSettingsFlag(false)
        }
    }, [props.reloadChartSettings])

    function loadChart(forceReload) {
        console.log(selectedSym)
        if (selectedSym) {
            let data = {
                appID: getItemByKey(LOCAL_STORAGE.APP_ID),
                sessionID: getSession(),
                view: "landscape",
                deviceType: "web",
                userMode: getLoginType(),
                selectedTheme: props.selectedTheme.theme,
                encryptionKey: getKey(),
                isEncryptionEnabled: true,
                intradayURL: getMarketDataBaseURL() + CHART_SERVICES.CHART_DATA,
                historicalURL: getMarketDataBaseURL() + CHART_SERVICES.HISTORY_DATA,
                tradingURL: getBaseURL() + ORDER_PAD.GUEST_PLACE_ORDER,
                symbolSearchURL: getMarketDataBaseURL() + HEADER_GUEST.SYMBOL_SEARCH,
                socketURL:AppSettings.streamingURL_GUEST,
                publicURL:AppSettings.publicUrl,
                symbolObject: {
                    companyName: selectedSym.companyName,
                    dispSym: selectedSym.dispSym,
                    exc: selectedSym.exc,
                    streamSym: selectedSym.streamSym,
                    instrument: selectedSym.instrument,
                    id: selectedSym.id,
                    asset: selectedSym.asset,
                    excToken: selectedSym.excToken,
                    baseSym: selectedSym.baseSym,
                    precision: getDecimal_Precision(selectedSym.exc),
                    dispSymbol: selectedSym.dispSym,
                    expiry: selectedSym.expiry ? selectedSym.expiry : '',
                    lotSize: selectedSym.lotSize,
                    tickSize: selectedSym.tickSize,
                    otherExch: selectedSym.otherExch
                },
                chartElement: props.chartEleId
            }
            if (props.chartEleId === 'chart_iframe_modal') data.showTitle = true

            let encodedData = encodeURIComponent(`data=${JSON.stringify(data)}`)
            setChartParams(encodedData)
            if (forceReload)
                document.getElementById(props.chartEleId ? 
                    props.chartEleId : 'chart_iframe').src = `chartiq/index.html`;
            else
                ChangeUrlData(encodedData)
        } else {
            streamingSubscription(null)
            ChangeUrlData('')
            // document.getElementById(props.chartEleId ? props.chartEleId : 'chart_iframe').src = ''
        }
    }

    function ChangeUrlData(encodedData) {

        if (encodedData) {
            if (typeof (window.history.pushState) != "undefined") {

                if (!props.isModal) {
                    let destination = document.getElementById("chart_iframe");
                    if (destination && destination.contentWindow) {
                        if (destination.contentWindow && destination.contentWindow.stxx &&
                             destination.contentWindow.stxx.uiContext) {
                            if (props.parent === SCREENS_GUEST.QUOTE) {
                                document.getElementById('chart_iframe').src = `chartiq/index.html`;
                                // setIsLoad(false)
                            } else {
                                destination.contentWindow.history.replaceState({}, '',
                                    `${AppSettings.publicUrl}/chartiq/index.html`);
                                destination.contentWindow.ChangeSymbolData(encodedData)
                                // setIsLoad(false)
                            }

                        } else {
                            // setIsLoad(false)
                            document.getElementById('chart_iframe').src = `chartiq/index.html`;
                        }

                    } 
                }
                let expandChart = document.getElementById("chart_iframe_modal");
                if (expandChart && expandChart.contentWindow) {
                    if (expandChart.contentWindow && expandChart.contentWindow.stxx &&
                         expandChart.contentWindow.stxx.uiContext) {
                        expandChart.contentWindow.history.replaceState({}, '',
                            `${AppSettings.publicUrl}/chartiq/index.html`);
                        expandChart.contentWindow.ChangeSymbolData(encodedData)
                        // setIsLoad(false)
                    } else {
                        // setIsLoad(false)
                        document.getElementById('chart_iframe_modal').src = `chartiq/index.html`;
                    }

                }
            }
        } else {
            document.getElementById(props.chartEleId ? props.chartEleId : 'chart_iframe').src = ''
        }
    }

    window.addEventListener('message', function (eve) {
        if (eve && eve.data) {

            let messageData = eve.data.toString()
            let isStartStream = messageData.includes("startStream");
            let isInvalidSession = messageData.includes("invalidSession");

            if (isStartStream || isInvalidSession) {
                let dataObj = JSON.parse(eve.data)

                if (isStartStream && dataObj && dataObj.id === 'startStream' &&
                 dataObj.data.symbolObj && dataObj.data.symbolObj.streamSym)
                    setStreamSymbol(dataObj.data.symbolObj.streamSym)

                if (isInvalidSession && dataObj && dataObj.id === 'invalidSession')
                    handleInvalidSession(CommonErrorMessages.INVALID_SESSION)
            }
        }
    });

    window.gotoOrderbook = function gotoOrderbook() {
        props.closeDialogCB && props.closeDialogCB()
        if (props.history.location && props.history.location.pathname !== SCREENS_GUEST.DASHBOARD) {
            props.history.push(SCREENS_GUEST.DASHBOARD)
        }
        props.moveToOrderMenu({
            showOrderMenu: true
        })
    }

    window.gotoOrderPad = function gotoOrderPad(sym,action) {
        console.log("sym",sym)
        props.closeDialogCB && props.closeDialogCB()
        if (props.history.location && props.history.location.pathname !== SCREENS_GUEST.DASHBOARD) {
            props.history.push(SCREENS_GUEST.DASHBOARD)
        }
        gotoTrade(sym,action)
    }

    window.onSelectChartTheme = function (theme) {
        setChartFrameClass(theme)
    }

    window.gotoOrderPad = function gotoOrderPad(sym,action) {
        console.log("sym",sym)
        props.closeDialogCB && props.closeDialogCB()
        if (props.history.location && props.history.location.pathname !== SCREENS_GUEST.DASHBOARD) {
            props.history.push(SCREENS_GUEST.DASHBOARD)
        }
        gotoTrade(sym,action)
    }

    function onLoadIframe() {
        let destination = document.getElementById("chart_iframe");
        let modalDialog = document.getElementById("chart_iframe_modal");
        if (modalDialog && modalDialog.contentWindow && modalDialog.contentWindow.setChartData) {
            modalDialog.contentWindow.setChartData(chartParams)
        }
        else if (destination && destination.contentWindow && destination.contentWindow.setChartData) {
            destination.contentWindow.setChartData(chartParams)
        }
    }

    return (
        <div className={`chartFrame ${chartFrameClass}`} style={{ height: "100%" }}>
            <iframe
                id={props.chartEleId ? props.chartEleId : 'chart_iframe'}
                className="iframe"
                src="chartiq/index.html"
                height="100%"
                width="100%"
                name="iframeWebView"
                allowFullScreen="true"
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
                onLoad={onLoadIframe}
            >
            </iframe>
        </div>
    )
}

const mapStateToProps = ({ chart, settings }) => {
    return {
        selectedTheme: settings.selectedTheme,
        reloadChartSettings: chart.reloadChartSettings
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeReloadChartSettingsFlag: (s) => { dispatch(storeReloadChartSettingsFlag(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        moveToOrderMenu: (s) => { dispatch(moveToOrderMenu(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WidgetLoader(withRouter(
    withStreaming(ChartWidgetComponent))));