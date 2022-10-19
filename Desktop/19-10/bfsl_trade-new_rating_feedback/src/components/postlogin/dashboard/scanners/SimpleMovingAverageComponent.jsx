import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";

import Select from '../../../common/SelectInputComponent'
import { WidgetLoader } from '../../../common/WidgetLoaderComponent';

import { getMarketDataBaseURL, getOfflineMsg, applyPaint } from '../../../../common/CommonMethods'
import { SCANNERS } from '../../../../common/Scanners'

import { withStreaming, useFetch, MsfRequest } from '../../../../index'
import ScannerTableComponent from './ScannerTableComponent';
import { STREAMING_KEYS, STREAMING_MODULES } from '../../../../common/Constants';
import { getLangText } from '../../../../common/lang/LangText';
// import { getLangText } from '../../../../common/lang/LangText';

const SimpleMovingAverageComponent = (props) => {
    const { selectedMenu } = props
    const msfFetch = useFetch()

    const [scans, setScans] = useState([])
    const [selectedScan, setSelectedScan] = useState('')
    const [indicators, setIndicators] = useState([])
    const [selectedIndicator, setSelectedIndicator] = useState('')
    const [dynamicColumns, setDynamicColumns] = useState([])

    const [streamingResp, setStreamingResp] = useState({})
    const [scansList, setScansList] = useState([])
    const [errorMessage, setErrorMessage] = useState(getOfflineMsg());
    const [noscannerdata, setNoscannerdata] = useState(false)
    const [descriptionLength, setDescriptionLength] = useState('')

    useEffect(() => {
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.SCANNERS);
    }, [])

    useEffect(() => {
        setScans([])
        setIndicators([])
        if (SCANNERS[selectedMenu]) {
            setScans(SCANNERS[selectedMenu]['screenerList'])
            if (scans && scans === SCANNERS[selectedMenu]['screenerList'] && scans.length) {
                setSelectedScan(scans[0])
                if (scans[0].indicators) {
                    setIndicators(scans[0].indicators)
                    setSelectedIndicator(scans[0].indicators[0])
                    setDynamicColumns(scans[0].indicators[0].columns)
                }
                else {
                    setIndicators([])
                    setSelectedIndicator('')
                    setDynamicColumns(scans[0].columns)
                }
            }
        }
    }, [selectedMenu, scans])

    useEffect(() => {
        if (selectedScan.indicators) {
            setIndicators(selectedScan.indicators)
            setSelectedIndicator(selectedScan.indicators[0])
            setDynamicColumns(selectedScan.indicators[0].columns)
        }
        else {
            setIndicators([])
            setSelectedIndicator('')
            setDynamicColumns(selectedScan.columns)
            getScansData(selectedScan.value)
        }
    }, [selectedScan])

    useEffect(() => {
        if (selectedIndicator) {
            setDynamicColumns(selectedIndicator.columns)
            getScansData(selectedScan.value, selectedIndicator.indicatorName)
        }
    }, [selectedIndicator])

    useEffect(() => {
        if (streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    useEffect(() => {
        descriptionLengthCalc()
    }, [selectedScan])

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function streamingSubscription(symArrayList) {
        let symbols = symArrayList.map(l => l.sym)
        props.forceSubscribeLevel1(
            symbols,
            [STREAMING_KEYS.LTP, STREAMING_KEYS.CHANGE, STREAMING_KEYS.CHANGE_PER]
        )
    }

    function setStreamingResptoSymbols(resp) {
        let { data } = resp;
        let newList = scansList.map(row => {
            if (row.sym.streamSym === data.symbol) {
                row = Object.assign({}, row, applyPaint(row, data));
            }
            return row;
        })
        if (newList.length)
            setScansList(newList)
    }

    const getScansData = (key, period) => {
        setScansList([])
        setErrorMessage('')
        setNoscannerdata(false)
        props.showWidgetLoader();
        let request = new MsfRequest();
        if (period)
            request.addToData({
                "type": key,
                "period": period
            })
        else
            request.addToData({
                "type": key,
            })
        // request.setEncrypt(false)
        if (SCANNERS[selectedMenu] && key) {
            msfFetch.placeRequest(
                getMarketDataBaseURL() + SCANNERS[selectedMenu]['apiUrl'],
                request,
                successRespCBGetScansData,
                errorRespCBGetScansData
            )
        }
    }

    const successRespCBGetScansData = (response) => {
        // console.log('response sma :', response);
        props.hideWidgetLoader();
        if (response && response.data && response.data.screener.length > 0) {
            setErrorMessage('')
            setScansList(response.data.screener)
            // props.forceSubscribeLevel1(response.data.screener)
            streamingSubscription(response.data.screener)
        }
        else {
            props.forceSubscribeLevel1([])
            setScansList([])
            setNoscannerdata(true)
            setErrorMessage('')
        }
    }

    const errorRespCBGetScansData = (error) => {
        props.hideWidgetLoader();
        setErrorMessage(error.message)
        setScansList([])
    }

    function onSelectScan(scan) {
        setSelectedScan(scan)
    }

    function onSelectIndicator(indicator) {
        setSelectedIndicator(indicator)
    }

    function descriptionLengthCalc() {
        let node, desLength;
        node = document.getElementsByClassName("scanner-description-base");
        desLength = node[0].getElementsByTagName("P").length + node[0].getElementsByTagName("LI").length
        setDescriptionLength(desLength)
    }

    const getScannerDescription = (val) => {
        switch (val) {
            case "BULLISH BREAKOUT":
                return (
                    <div> 
                        { props.selectedLang.id === 'english' ?
                            <>
                                <p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li>{getLangText("BULLISH_BREAKOUT_POINT1")} <a href="https://www.investopedia.com/terms/s/sma.asp" target="_blank" rel="noopener noreferrer" >SMA </a> {getLangText('BREARISH_BREAKDOWN1-2')} <a href="https://www.investopedia.com/terms/e/ema.asp" target="_blank" rel="noopener noreferrer"> EMA</a></li> <li>{getLangText("BULLISH_BREAKOUT_POINT2")} <a href="https://www.investopedia.com/articles/trading/07/adx-trend-indicator.asp" target="_blank" rel="noopener noreferrer" >ADX</a>{getLangText("BULLISH_BREAKOUT_POINT3")}</li> </ol> 
                            </>
                            :
                            <>
                                <p>{getLangText("SCANNERS_DESCRIPTION1")}</p><ol> <li>{getLangText("BULLISH_BREAKOUT_POINT1")} <a href="https://www.investopedia.com/terms/s/sma.asp" target="_blank" rel="noopener noreferrer" >SMA </a> {getLangText('BREARISH_BREAKDOWN1-2')} <a href="https://www.investopedia.com/terms/e/ema.asp" target="_blank" rel="noopener noreferrer"> EMA</a> {getLangText('BULLISH_BREAKOUT_POINT1-1')}</li> <li>{getLangText("BULLISH_BREAKOUT_POINT2")} <a href="https://www.investopedia.com/articles/trading/07/adx-trend-indicator.asp" target="_blank" rel="noopener noreferrer" >ADX</a>{getLangText("BULLISH_BREAKOUT_POINT3")}</li> </ol>    
                            </>
                        }                    
                    </div>
                )  
            case "BEARISH BREAKDOWN":
                return(
                    <div>
                        { props.selectedLang.id === 'english' ?
                            <>
                                <p>{getLangText("SCANNERS_DESCRIPTION1")}</p>  <ol> <li>{getLangText('BEARISH_BREAKOUT_POINT1')} <a href="https://www.investopedia.com/terms/s/sma.asp" target="_blank" rel="noopener noreferrer"> SMA </a> {getLangText('BREARISH_BREAKDOWN1-2')} <a href="https://www.investopedia.com/terms/e/ema.asp" target="_blank" rel="noopener noreferrer"> EMA</a></li> <li>{getLangText('BEARISH_BREAKDOWN_POINT2')} <a href="https://www.investopedia.com/articles/trading/07/adx-trend-indicator.asp" target="_blank" rel="noopener noreferrer">ADX </a>{getLangText('BEARISH_BREAKDOWN_POINT3')}</li> </ol> 
                            </>
                            :
                            <>
                                <p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li>{getLangText('BEARISH_BREAKOUT_POINT1')} <a href="https://www.investopedia.com/terms/s/sma.asp" target="_blank" rel="noopener noreferrer"> SMA </a> {getLangText('BREARISH_BREAKDOWN1-2')} <a href="https://www.investopedia.com/terms/e/ema.asp" target="_blank" rel="noopener noreferrer"> EMA </a>{getLangText('BREARISH_BREAKDOWN1-3')}</li> <li>{getLangText('BEARISH_BREAKDOWN_POINT2')} <a href="https://www.investopedia.com/articles/trading/07/adx-trend-indicator.asp" target="_blank" rel="noopener noreferrer">ADX </a>{getLangText('BEARISH_BREAKDOWN_POINT3')}</li> </ol> 
                            </>
                        } 
                    </div>
                )
            case "GOLDEN CROSSOVER - BULLISH":
                return <div><p>{getLangText("SCANNERS_DESCRIPTION1")}</p><ol><li>{getLangText('GOLDEN_CROSS_BULL_BEAR_POINT1')}<a href="https://www.investopedia.com/terms/s/sma.asp" target="_blank" rel="noopener noreferrer"> SMA </a> {getLangText('GOLDEN_CROSS_BULL_BEAR_POINT1-1')} <a href="https://www.investopedia.com/terms/s/sma.asp" target="_blank" rel="noopener noreferrer"> SMA </a> {getLangText('GOLDEN_CROSS_BULL_BEAR_POINT1-2')} <a href="https://www.investopedia.com/terms/s/sma.asp" target="_blank" rel="noopener noreferrer"> SMA</a></li>
                    <li>{getLangText('BULLISH_BREAKOUT_POINT2')}<a href="https://www.investopedia.com/articles/trading/07/adx-trend-indicator.asp" target="_blank" rel="noopener noreferrer"> ADX </a>{getLangText('BULLISH_BREAKOUT_POINT3')}</li></ol></div>
            case "GOLDEN CROSSOVER - BEARISH":
                return <div><p>{getLangText("SCANNERS_DESCRIPTION1")}</p><ol><li>{getLangText('GOLDEN_CROSS_BULL_BEAR_POINT1')} <a href="https://www.investopedia.com/terms/s/sma.asp" target="_blank" rel="noopener noreferrer">SMA</a> {getLangText('GOLDEN_CROSS_BEAR_POINT1-1')}<a href="https://www.investopedia.com/terms/s/sma.asp" target="_blank" rel="noopener noreferrer"> SMA </a>{getLangText('GOLDEN_CROSS_BULL_BEAR_POINT1-2')}<a href="https://www.investopedia.com/terms/s/sma.asp" target="_blank" rel="noopener noreferrer"> SMA</a></li><li>{getLangText("BEARISH_BREAKDOWN_POINT2")}<a href="https://www.investopedia.com/articles/trading/07/adx-trend-indicator.asp" target="_blank" rel="noopener noreferrer">ADX</a> {getLangText('BEARISH_BREAKDOWN_POINT3')}</li></ol></div>
            case "LONG TIME HIGH":
                return <div><p>{getLangText("SCANNERS_DESCRIPTION1")}</p> 
                    <ol><li>{getLangText("LONG_TIME_HIGH_DESCRIPTION1")}</li></ol>
                </div>
            case "LONG TIME LOW":
                return <div> <p>{getLangText("SCANNERS_DESCRIPTION1")}</p>
                    <ol> <li>{getLangText('LONG_TIME_LOW_DESCRIPTION1')}</li> </ol> </div>
            case "PREVIOUS DAY BREAKOUT- BULLISH":
                return <div> <p>{getLangText("SCANNERS_DESCRIPTION1")}</p>
                    <ol> <li>{getLangText("PREV_DAY_BREAKOUT_BULLISH_DESCRIPTION1")}</li>
                    </ol> </div>
            case "PREVIOUS DAY BREAKOUT- BEARISH":
                return <div> <p>{getLangText("SCANNERS_DESCRIPTION1")}</p>
                    <ol> <li>{getLangText("PREV_DAY_BREAKOUT_BEARISH_DESCRIPTION1")}</li>
                    </ol> </div >
            case "BULLISH MOMENTUM":
                return <div> <p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li>{getLangText('BULLISH_MOMENTUM_DESCRIPTION1')} <a href="https://www.investopedia.com/terms/r/rsi.asp" target="_blank" rel="noopener noreferrer">RSI</a>&nbsp; {getLangText('BULLISH_MOMENTUM_DESCRIPTION1-1')}</li> <li>{getLangText('BULLISH_MOMENTUM_DESCRIPTION2')}&nbsp; <a href="https://www.investopedia.com/terms/b/bollingerbands.asp" target="_blank" rel="noopener noreferrer">{getLangText('BULLISH_MOMENTUM_DESCRIPTION2-1')}</a>&nbsp;</li> </ol> </div>
            case "BEARISH MOMENTUM":
                return <div> <p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li>{getLangText('BEARISH_MOMENTUM_DESCRIPTION1')}<a href="https://www.investopedia.com/terms/r/rsi.asp" target="_blank" rel="noopener noreferrer">RSI </a> {getLangText('BEARISH_MOMENTUM_DESCRIPTION1-1')}&nbsp; </li> <li>{getLangText('BEARISH_MOMENTUM_DESCRIPTION2')}&nbsp; <a href="https://www.investopedia.com/terms/b/bollingerbands.asp" target="_blank" rel="noopener noreferrer">Bollinger Band</a>&nbsp;</li> </ol> </div>
            case "BULLISH PRICE VOLUME BREAKERS":
                return <div><p>{getLangText("SCANNERS_DESCRIPTION1")}</p>
                    <ol><li>{getLangText("BULLISH_PRICE_VOLUME_BREAKERS_DESCRIPTION1")}</li>
                        <li>{getLangText("BULLISH_FRONT_LINERS_DESCRIPTION2")}</li>
                    </ol></div>
            case "BEARISH PRICE VOLUME BREAKERS":
                return <div><p>{getLangText("SCANNERS_DESCRIPTION1")}</p>
                    <ol> <li>{getLangText("BEARISH_PRICE_VOLUME_BREAKERS_DESCRIPTION1")}</li>
                        <li> {getLangText("BULLISH_FRONT_LINERS_DESCRIPTION2")}</li>
                    </ol> </div>
            case "BULLISH MID FIELDERS":
                return <div> <p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li>{getLangText("BULLISH_MID_FIELDERS_DESCRIPTION1")}</li> <li>{getLangText("BULLISH_MID_FIELDERS_DESCRIPTION2")}</li> <li>The 20 day <a href="https://www.investopedia.com/terms/r/rsi.asp" target="_blank" rel="noopener noreferrer">RSI</a> is in the range of 20 to 40.</li> </ol> </div>
            case "BEARISH MID FIELDERS":
                return <div> <p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li>{getLangText("BEARISH_MID_FIELDERS_DESCRIPTION1")}</li> <li>{getLangText("BULLISH_MID_FIELDERS_DESCRIPTION2")}</li> <li>The 20 day <a href="https://www.investopedia.com/terms/r/rsi.asp" target="_blank" rel="noopener noreferrer">RSI</a> is in the range of 60 to 80.</li> </ol> </div>
            case "BULLISH SMALLCAP SHOCKERS":
                return <div> <p>{getLangText("SCANNERS_DESCRIPTION1")}</p>
                    <ol> <li>{getLangText("BULLISH_SMALLCAP_SHOCKERS_DESCRIPTION1")}</li>
                        <li> {getLangText("BULLISH_SMALLCAP_SHOCKERS_DESCRIPTION2")}</li>
                        <li> {getLangText("BULLISH_FRONT_LINERS_DESCRIPTION2")}</li>
                    </ol> </div>
            case "BEARISH SMALLCAP SHOCKERS":
                return <div> <p>{getLangText("SCANNERS_DESCRIPTION1")}</p>
                    <ol> <li>{getLangText("BULLISH_SMALLCAP_SHOCKERS_DESCRIPTION1")}</li>
                        <li> {getLangText("BEARISH_SMALLCAP_SHOCKERS_DESCRIPTION2")}.</li>
                        <li> {getLangText("BULLISH_FRONT_LINERS_DESCRIPTION2")}</li>
                    </ol> </div>
            case "BULLISH GAP UP":
                return <div> <p>{getLangText("SCANNERS_DESCRIPTION1")}</p>
                    <ol><li>{getLangText("BULLISH_GAP_UP_DESCRIPTION1")}</li>
                    </ol> </div>
            case "BEARISH GAP UP":
                return <div><p>{getLangText("SCANNERS_DESCRIPTION1")}</p>
                    <ol> <li>{getLangText("BEARISH_GAP_UP_DESCRIPTION1")}.</li> </ol> </div>
            case "BULLISH FRONT LINERS":
                return <div> <p>{getLangText("SCANNERS_DESCRIPTION1")}</p>
                    <ol><li>{getLangText('BULLISH_FRONT_LINERS_DESCRIPTION1')}</li>
                        <li> {getLangText("BULLISH_FRONT_LINERS_DESCRIPTION2")}</li>
                        <li> {getLangText("BULLISH_FRONT_LINERS_DESCRIPTION3")}</li> </ol> </div>
            case "BEARISH FRONT LINERS":
                return <div> <p>{getLangText("SCANNERS_DESCRIPTION1")}</p>
                    <ol> <li>{getLangText("BEARISH_FRONT_LINERS_DESCRIPTION1")}</li>
                        <li> {getLangText("BULLISH_FRONT_LINERS_DESCRIPTION2")}</li>
                        <li> {getLangText("BULLISH_FRONT_LINERS_DESCRIPTION3")}</li> </ol> </div>
            case "BULLISH FO MOVERS":
                return <div>
                    <p> {getLangText("SCANNERS_DESCRIPTION1")}</p>
                    <ol> <li>{getLangText("BULLISH_FOMOVERS_DESCRIPTION1")}</li>
                        <li> {getLangText("BULLISH_FRONT_LINERS_DESCRIPTION2")}</li>
                        <li> {getLangText("BULLISH_FRONT_LINERS_DESCRIPTION3")}</li> </ol > </div >
            case "BEARISH FO MOVERS":
                return <div>
                    <p> {getLangText("SCANNERS_DESCRIPTION1")}</p>
                    <ol> <li>{getLangText("BEARISH_FOMOVERS_DESCRIPTION1")}.</li>
                        <li>{getLangText("BULLISH_FRONT_LINERS_DESCRIPTION2")}</li>
                        <li> {getLangText("BULLISH_FRONT_LINERS_DESCRIPTION3")}</li> </ol> </div>
            case "RSI BULLISH":
                return <div> <p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li>{getLangText('RSI_BULLISH_DESCRIPTION')} <a href="https://www.investopedia.com/terms/r/rsi.asp" target="_blank" rel="noopener noreferrer">RSI</a> {getLangText('RSI_BULLISH_DESCRIPTION-1')}</li> </ol> </div>
            case "RSI TRENDING UP":
                return <div> <p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li>{getLangText('RSITRENDINGUP_DESCRIPTION1')} <a href="https://www.investopedia.com/terms/r/rsi.asp" target="_blank" rel="noopener noreferrer"> RSI </a>{getLangText('RSITRENDINGUP_DESCRIPTION1-1')}</li> </ol> </div>
            case "RSI BEARISH":
                return <div> <p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li>{getLangText('RSI_BEARISH_DESCRIPTION1')}<a href="https://www.investopedia.com/terms/r/rsi.asp" target="_blank" rel="noopener noreferrer">RSI </a>{getLangText('RSI_BEARISH_DESCRIPTION1-1')}</li> </ol> </div>
            case "RSI TRENDING DOWN":
                return <div> <p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li>{getLangText('RSI_TRENDINGDOWN_DESCRIPTION1')} <a href="https://www.investopedia.com/terms/r/rsi.asp" target="_blank" rel="noopener noreferrer">RSI</a> {getLangText('RSI_TRENDINGDOWN_DESCRIPTION1-1')}</li> </ol> </div>
            case "RSI OVERBOUGHT":
                return (
                    <div> 
                        {props.selectedLang.id === 'english' ?
                            <p>{getLangText("RSI_OVERBROUGHT_DESCRIPTION")} <a href="https://www.investopedia.com/terms/r/rsi.asp" target="_blank" rel="noopener noreferrer">RSI</a> </p>
                            :
                            <p>{getLangText("RSI_OVERBROUGHT_DESCRIPTION")}<a href="https://www.investopedia.com/terms/r/rsi.asp" target="_blank" rel="noopener noreferrer"> RSI </a> {getLangText('RSI_OVERBROUGHT_DESCRIPTION1')}</p>
                        }
                    </div>
                )
            case "RSI OVERSOLD":
                return <div> <p>{getLangText("RSI_OVERSOLD_DESCRIPTION1")} <a href="https://www.investopedia.com/terms/r/rsi.asp" target="_blank" rel="noopener noreferrer">RSI</a> </p> </div>
            case "RSI ABOVE 70":
                return <div> <p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li>{getLangText('RSI_ABOVE_70_DESCRIPTION1')} <a href="https://www.investopedia.com/terms/r/rsi.asp" target="_blank" rel="noopener noreferrer">RSI</a> {getLangText('RSI_ABOVE_70_DESCRIPTION1-1')}</li> </ol> </div>
            case "RSI BELOW 30":

                return <div> <p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li>{getLangText('RSI_BELOW30_DESCRIPTION1')}<a href="https://www.investopedia.com/terms/r/rsi.asp" target="_blank" rel="noopener noreferrer">RSI</a> {getLangText('RSI_BELOW30_DESCRIPTION1-1')}</li> </ol> </div>
            case "PARABOLICSAR BULLISH":
                return <div><p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li>{getLangText('PARABOLICSAR_BULLISH_DESCRIPTION1')} <a href="https://www.investopedia.com/terms/p/parabolicindicator.asp" target="_blank" rel="noopener noreferrer">PSAR</a> {getLangText('PARABOLICSAR_BULLISH_DESCRIPTION1-1')}</li> </ol> </div>
            case "PARABOLICSAR BEARISH":
                return <div><p>{getLangText("SCANNERS_DESCRIPTION1")}</p><ol> <li>{getLangText('PARABOLICSAR_BEARISH_DESCRIPTION1')}<a href="https://www.investopedia.com/terms/p/parabolicindicator.asp"target="_blank" rel="noopener noreferrer">PSAR</a> {getLangText('PARABOLICSAR_BEARISH_DESCRIPTION1-1')}</li> </ol> </div>
            case "PARABOLICSAR BULLISH REVERSAL":
                return <div><p>{getLangText("SCANNERS_DESCRIPTION1")}</p><ol> <li>{getLangText('PARABOLICSAR_BULLISH_REVERSAL_DESCRIPTION1')}  <a href="https://www.investopedia.com/terms/p/parabolicindicator.asp" target="_blank" rel="noopener noreferrer">PSAR</a> {getLangText('PARABOLICSAR_BULLISH_REVERSAL_DESCRIPTION1-1')}</li> </ol> </div>
            case "PARABOLICSAR BEARISH REVERSAL":
                return <div><p>{getLangText("SCANNERS_DESCRIPTION1")}</p><ol> <li>{getLangText('PARABOLICSAR_BEARISH_REVERSAL_DESCRIPTION1')} <a href="https://www.investopedia.com/terms/p/parabolicindicator.asp"target="_blank" rel="noopener noreferrer">PSAR</a> {getLangText('PARABOLICSAR_BEARISH_REVERSAL_DESCRIPTION1-1')}</li> </ol> </div>
            case "PRICE BELOW LOWER BAND":
                return(
                    <div>
                        {props.selectedLang.id === "english" ?
                            <>
                                <p>{getLangText("SCANNERS_DESCRIPTION1")}</p><ol> <li>{getLangText('PRICE_BELOW_BBAND_DESCRIPTION1')}<a href="https://www.investopedia.com/terms/b/bollingerbands.asp" target="_blank" rel="noopener noreferrer"> Bollinger Bands</a></li> </ol>
                            </>
                            : 
                            <>
                                <p>{getLangText("SCANNERS_DESCRIPTION1")}</p><ol> <li>{getLangText('PRICE_BELOW_BBAND_DESCRIPTION1')}<a href="https://www.investopedia.com/terms/b/bollingerbands.asp" target="_blank" rel="noopener noreferrer"> Bollinger Bands</a>{getLangText('PRICE_BELOW_BBAND_DESCRIPTION1-1')}</li> </ol>
                            </>
                        }
                    </div>
                )
            case "PRICE ABOVE UPPER BAND":
                return(
                    <div>
                        {props.selectedLang.id === "english" ?
                            <>
                                <p>{getLangText("SCANNERS_DESCRIPTION1")}</p><ol> <li>{getLangText('PRICE_ABOVE_BBAND_DESCRIPTION1')} <a href="https://www.investopedia.com/terms/b/bollingerbands.asp" target="_blank" rel="noopener noreferrer"> Bollinger Bands </a></li> </ol>
                            </>
                        
                            :
                            <p>  <p>{getLangText("SCANNERS_DESCRIPTION1")}</p><ol> <li>{getLangText('PRICE_ABOVE_BBAND_DESCRIPTION1')} <a href="https://www.investopedia.com/terms/b/bollingerbands.asp" target="_blank" rel="noopener noreferrer"> Bollinger Bands </a> {getLangText('PRICE_ABOVE_BBAND_DESCRIPTION1-1')}</li> </ol></p>
                        }
                    </div>
                )
            case "BOLLINGER BAND BULLISH":
                return (
                    <div>
                        { props.selectedLang.id === 'english' ?
                            <>
                                <p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li> {getLangText('BOLLINGER_BAND_BEARISH_DESCRIPTION')}  <a href="https://www.investopedia.com/terms/b/bollingerbands.asp" target="_blank" rel="noopener noreferrer"> Bollinger Bands</a> {getLangText("BOLLINGER_BAND_BULLISH_DESCRIPTION1-1")}</li> </ol>
                            </> 
                            :
                            <>
                                <p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li>  <a href="https://www.investopedia.com/terms/b/bollingerbands.asp" target="_blank" rel="noopener noreferrer">Bollinger Bands</a> {getLangText('BOLLINGER_BAND_BEARISH_DESCRIPTION-1')}</li> </ol>
                            </>
                        }
                    </div>
                ) 
            case "BOLLINGER BAND BEARISH":
              
                return(
                    <div>
                        {props.selectedLang.id === "english" ? 
                            <>
                                <p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li> {getLangText('BOLLINGER_BAND_BULLISH_DESCRIPTION1')}  <a href="https://www.investopedia.com/terms/b/bollingerbands.asp" target="_blank" rel="noopener noreferrer">Bollinger Bands</a> {getLangText('BOLLINGER_BAND_BEARISH_DESCRIPTION1-1')}</li> </ol> 
                            </>
                            :
                            props.selectedLang.id ==='gujarati' ?
                                <>
                                    <p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li> {getLangText('BOLLINGER_BAND_BULLISH_DESCRIPTION1')}  <a href="https://www.investopedia.com/terms/b/bollingerbands.asp" target="_blank" rel="noopener noreferrer">Bollinger Bands</a> {getLangText('BOLLINGER_BAND_BEARISH_DESCRIPTION1-1')}</li> </ol>
                                </>
                                :
                                props.selectedLang.id === 'marathi' || props.selectedLang.id === 'hindi' ?
                                    <>
                                        <p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li> <a href="https://www.investopedia.com/terms/b/bollingerbands.asp" target="_blank" rel="noopener noreferrer">Bollinger Bands</a> {getLangText('BOLLINGER_BAND_BEARISH_DESCRIPTION1-1')}</li> </ol>
                                    </>
                                    : ''
                        }
                    </div>
                )     
            case "BOLLINGER BAND SQUEEZE":
                return(

                    <div>
                        { props.selectedLang.id ==='english' ?
                            <>
                                <p>{getLangText('SCANNERS_DESCRIPTION1')}</p> <ol> <li>{getLangText('BOLLINGER_BAND_SQUEEZE_DESCRIPTION1')}<a href="https://www.investopedia.com/terms/b/bollingerbands.asp" target="_blank" rel="noopener noreferrer">Bollinger Bands</a> {getLangText('BOLLINGER_BAND_SQUEEZE_DESCRIPTION1-1')} <a href="https://www.investopedia.com/terms/a/atr.asp" target="_blank" rel="noopener noreferrer">Average True Range</a></li></ol> 
                            </>
                            :
                            <>
                                <p>{getLangText('SCANNERS_DESCRIPTION1')}</p> <ol> <li><a href="https://www.investopedia.com/terms/b/bollingerbands.asp" target="_blank" rel="noopener noreferrer">Bollinger Bands</a> {getLangText('BOLLINGER_BAND_SQUEEZE_DESCRIPTION1-1')}<a href="https://www.investopedia.com/terms/a/atr.asp" target="_blank" rel="noopener noreferrer">Average True Range</a>{getLangText('BOLLINGER_BAND_SQUEEZE_DESCRIPTION1-2')} </li> </ol> 
                            </>
                        }
                    </div>
                )
            case "MACD BULLISH":
                return <div><p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li>{getLangText('MACD_BULLISH_DESCRIPTION')} <a href="https://www.investopedia.com/terms/m/macd.asp" target="_blank" rel="noopener noreferrer">MACD</a> {getLangText('MACD_BULLISH_DESCRIPTION-1')}</li> </ol> </div>
            case "MACD BEARISH":
                return <div><p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li>{getLangText('MACD_BEARISH_DESCRIPTION1')} <a href="https://www.investopedia.com/terms/m/macd.asp" target="_blank" rel="noopener noreferrer"> MACD </a> {getLangText('MACD_BEARISH_DESCRIPTION1-1')}</li> </ol>  </div>
            case "WILLR BULLISH":
                return <div><p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li>{getLangText('WILLR_BULLISH_DESCRIPTION1')}<a href="https://www.investopedia.com/terms/w/williamsr.asp" target="_blank" rel="noopener noreferrer">Williams %R</a> {getLangText('WILLR_BULLISH_DESCRIPTION1-1')}</li> </ol> </div>
            case "WILLR BEARISH":
                return <div><p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li>{getLangText('WILLR_BEARISH_DESCRIPTION1')}<a href="https://www.investopedia.com/terms/w/williamsr.asp" target="_blank" rel="noopener noreferrer">Williams %R</a>{getLangText('WILLR_BEARISH_DESCRIPTION1-1')}</li> </ol> </div>
            case "WILLR OVERSOLD":
                return <div><p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li>{getLangText('WILLR_OVERSOLD_DESCRIPTION1')}<a href="https://www.investopedia.com/terms/w/williamsr.asp" target="_blank" rel="noopener noreferrer">Williams %R</a> {getLangText('WILLR_OVERSOLD_DESCRIPTION1-1')}</li> </ol> </div>
            case "WILLR OVERBOUGHT":
                return <div><p>{getLangText("SCANNERS_DESCRIPTION1")}</p> <ol> <li>{getLangText('WILLR_OVERBOUGHT_DESCRIPTION1')}<a href="https://www.investopedia.com/terms/w/williamsr.asp" target="_blank" rel="noopener noreferrer">Williams %R</a>{getLangText('WILLR_OVERBOUGHT_DESCRIPTION1-1')}</li> </ol> </div>
            default:
                return null
        }
    }

    return (
        <div className={`scannerBase-content ${descriptionLength === 1 ? 'large-table' : descriptionLength === 2 ?
            'medium-table' : ''}`}>
            <div className="scannerType-dropdown visible-type">
                {scans && scans.length && <Select optionList={scans}
                    value="name"
                    onSelectValueCB={onSelectScan}
                    preSelect={true}
                    selectedOption={selectedScan.name}
                    hiddenScroll={true}
                    hasLangageDependent={true}

                />}
                {selectedScan.indicators && <Select optionList={indicators}
                    value="dispName"
                    onSelectValueCB={onSelectIndicator}
                    preSelect={true}
                    selectedOption={selectedIndicator.dispName}
                    hiddenScroll={true}
                    hasLangageDependent={true}
                />}
            </div>
            <div className="scanner-description-base">

                <div className=
                    {`scanner-description ${descriptionLength === 1 ? 'minimum-length' : descriptionLength === 2 ?
                        'two-lines' : ''}`}
                >
                    {getScannerDescription(selectedScan.name)}
                </div>
                {/* {getScannerDescription(selectedScan.name)} */}
                {/* {console.log('getScannerDescription(selectedScan.name): ', typeof(String(getScannerDescription(selectedScan.name))),
                    String(getScannerDescription(selectedScan.name)))} */}
                {/* <p>
                        <LangText name = {selectedScan["description"] ? selectedScan["description"].langKey: ""}/>
                    </p>       
                    <ol>
                        { selectedScan["description"] && selectedScan["description"].langKey1 ?
                            <li>
                                <LangText name = {selectedScan["description"] ?
                                    selectedScan["description"].langKey1: ""}/>
                            </li>
                            : null }
                        { selectedScan["description"] && selectedScan["description"].langKey2 ?
                            <li>
                                <LangText name = {selectedScan["description"] ?
                                    selectedScan["description"].langKey2: ""}/>
                            </li>
                            : null }
                    </ol> */}
                {/* </div>  */}
            </div>
            <ScannerTableComponent
                scansList={scansList}
                dynamicColumns={dynamicColumns}
                selectedIndicator={selectedIndicator}
                errorMessage={errorMessage}
                setScansList={setScansList}
                noScannerData={noscannerdata}
            />
        </div >
    )
}

const mapStateToProps = ({ scanner, settings }) => {
    // console.log("lang", settings.selectedLang)
    return {
        selectedMenu: scanner.selectedMenu,
        selectedLang: settings.selectedLang

    }
}

export default connect(mapStateToProps)(WidgetLoader(withStreaming(SimpleMovingAverageComponent)))