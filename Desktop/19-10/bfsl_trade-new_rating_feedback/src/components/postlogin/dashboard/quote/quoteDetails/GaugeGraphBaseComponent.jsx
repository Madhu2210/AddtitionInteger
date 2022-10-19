import React, { useState, useEffect } from 'react'
import { useFetch, MsfRequest, withStreaming } from '../../../../../index'

import GaugeGraph from '../../../../common/GaugeGraphComponent'
import { replaceComma, getMarketDataBaseURL } from '../../../../../common/CommonMethods'
import { STREAMING_MODULES, STREAMING_KEYS } from '../../../../../common/Constants'
import LangText from '../../../../../common/lang/LangText'
import { WidgetLoader } from '../../../../common/WidgetLoaderComponent'
import { QUOTE } from '../../../../../config/ServiceURLs'

const GaugeMeterComponent = (props) => {
    const MsfFetch = useFetch()

    const [graphData, setGraphData] = useState(null)
    const [graphKeys, setGraphKeys] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    const [pointerDeg, setPointerDeg] = useState(null)
    const [ltpValue, setLtpValue] = useState(null)

    const [streamingResp, setStreamingResp] = useState({})
    const [quoteDetails, setQuoteDetails] = useState({})

    useEffect(() => {
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.GAUGE_GRAPH);
    }, [])

    useEffect(() => {
        if (props.selectedSym) {
            let symList = [{
                sym: props.selectedSym,
                dispSym: props.selectedSym.dispSym
            }]
            getGraphData(symList)
        }
    }, [props.selectedSym])

    useEffect(() => {
        if (quoteDetails.ltp)
            setLtpValue(parseFloat(replaceComma(quoteDetails.ltp)))
    }, [quoteDetails.ltp])

    useEffect(() => {
        if (props.selectedSym && props.selectedSym !== {}) {
            setQuoteDetails({ sym: props.selectedSym })
            let symbols = []
            symbols.push(props.selectedSym)
            props.forceSubscribeLevel1(symbols, [STREAMING_KEYS.LTP])
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
            setQuoteDetails(quotes)
        }
    }

    useEffect(() => {
        if (graphData && ltpValue) {
            let pointDeg = 0
            let positiveDeg = true

            if (ltpValue > parseFloat(replaceComma(graphData['S1'])))
                positiveDeg = true
            else
                positiveDeg = false

            if (!(ltpValue < parseFloat(replaceComma(graphData['R1']))
             && ltpValue > parseFloat(replaceComma(graphData['S1']))) && ltpValue != 0) {
                let totalVal = 0
                let pointValue = 0
                if (positiveDeg) {
                    totalVal = parseFloat(replaceComma(graphData['R3'])) - parseFloat(replaceComma(graphData['R1']))
                    pointValue = ltpValue - parseFloat(replaceComma(graphData['R1']))
                } else {
                    totalVal = parseFloat(replaceComma(graphData['S1'])) - parseFloat(replaceComma(graphData['S3']))
                    pointValue = parseFloat(replaceComma(graphData['S1'])) - ltpValue
                }

                pointDeg = (pointValue / totalVal) * 100

            } else if ((ltpValue == parseFloat(replaceComma(graphData['R1'])) 
            || ltpValue == parseFloat(replaceComma(graphData['S1'])))) {
                pointDeg = 15
            }

            if (pointDeg > 90)
                pointDeg = 90
            else if (pointDeg < -90)
                pointDeg = -90
            pointDeg = pointDeg.toString()
            let degVal = ''
            if (positiveDeg)
                degVal = 'rotate(' + pointDeg + 'deg)'
            else
                degVal = 'rotate(' + '-' + pointDeg + 'deg)'

            setPointerDeg(degVal)
        }
    }, [graphData, ltpValue])

    function getGraphData(symbols) {
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.addToData({
            "symbols": symbols
        })
        request.setEncrypt(false)
        MsfFetch.placeRequest(
            getMarketDataBaseURL() + QUOTE.PIVOT_DATA,
            request,
            successRespCBGetGraphData,
            errorRespCBGetGraphData
        )
    }

    function successRespCBGetGraphData(response) {
        setGraphData(response.data.values)
        setGraphKeys(response.data.keys)
        setErrorMsg(null)
        props.hideWidgetLoader();
    }

    function errorRespCBGetGraphData(error) {
        setErrorMsg(error.message)
        setGraphData(null)
        setGraphKeys([])
        props.hideWidgetLoader();
    }
    return (
        <div className="gaugeMeter">
            <div className="body">
                {
                    (graphKeys && graphKeys.length && graphData) ?
                        <>
                            <GaugeGraph pointerDeg={pointerDeg} />
                            <div className="values">
                                <div className="heading">
                                    <span className="alignLeft"><LangText module="QUOTE" name="SUPPORT" /></span>
                                    <span className="alignCenter"><LangText module="QUOTE" name="PIVOT" /></span>
                                    <span className="alignRight"><LangText module="QUOTE" name="RESISTANCE" /></span>
                                </div>
                                <div>
                                    <span className="negativeColor alignLeft">S1 {graphData['S1']}</span>
                                    <span className="positiveColor alignCenter">{graphData['PIVOT']}</span>
                                    <span className="positiveColor alignRight">R1 {graphData['R1']}</span>
                                </div>
                                <div>
                                    <span className="negativeColor alignLeft">S2 {graphData['S2']}</span>
                                    <span></span>
                                    <span className="positiveColor alignRight">R2 {graphData['R2']}</span>
                                </div>
                                <div>
                                    <span className="negativeColor alignLeft">S3 {graphData['S3']}</span>
                                    <span></span>
                                    <span className="positiveColor alignRight">R3 {graphData['R3']}</span>
                                </div>
                            </div>
                        </>
                        :
                        <div className="errorDiv flex-center">{errorMsg}</div>
                }
            </div>
        </div>
    )
}

export default WidgetLoader(withStreaming(GaugeMeterComponent));