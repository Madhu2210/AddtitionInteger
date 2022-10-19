import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";

import Select from '../../../common/SelectInputComponent'
import { WidgetLoader } from '../../../common/WidgetLoaderComponent';

import { getMarketDataBaseURL, getOfflineMsg, applyPaint } from '../../../../common/CommonMethods'
import { SCANNERS } from '../../../../common/Scanners'

import { withStreaming, useFetch, MsfRequest } from '../../../../index'
import ScannerTableComponent from './ScannerTableComponent';
import { STREAMING_KEYS, STREAMING_MODULES } from '../../../../common/Constants';
import LangText from '../../../../common/lang/LangText';

const ExponentialMovingAverageComponent = (props) => {
    const { selectedMenu } = props
    const msfFetch = useFetch()

    const selectedScan = SCANNERS[selectedMenu]['screenerList'][0]
    const [types, setTypes] = useState([])
    const [selectedType, setSelectedType] = useState('')
    const [indicators, setIndicators] = useState([])
    const [selectedIndicator, setSelectedIndicator] = useState('')
    const [selectedSecondIndicator, setSelectedSecondIndicator] = useState('')

    const [streamingResp, setStreamingResp] = useState({})
    const [scansList, setScansList] = useState([])
    const [errorMessage, setErrorMessage] = useState(getOfflineMsg());
    const [noscannerdata, setNoscannerdata] = useState(false)

    useEffect(() => {
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.SCANNERS);
    }, [])

    useEffect(() => {
        if (selectedScan) {
            setTypes(selectedScan.type)
            setSelectedType(selectedScan.type[0])
            setIndicators(selectedScan.indicators)
            setSelectedIndicator(selectedScan.indicators[0])
            setSelectedSecondIndicator(selectedScan.indicators[1])
        }
    }, [selectedMenu])

    useEffect(() => {
        getScansData(selectedType.key, selectedIndicator.indicatorName, selectedSecondIndicator.indicatorName)
    }, [selectedType, selectedIndicator, selectedSecondIndicator])

    useEffect(() => {
        if (streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

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

    const getScansData = (key, period, secondPeriod) => {
        let request = new MsfRequest();
        setScansList([])
        setErrorMessage('')
        setNoscannerdata(false)
        props.showWidgetLoader();
        request.addToData({
            "type": key,
            "indicator1": period,
            "indicator2": secondPeriod
        })
        if (SCANNERS[selectedMenu] && key) {
            msfFetch.placeRequest(
                getMarketDataBaseURL() + SCANNERS[selectedMenu]['apiUrl'],
                request,
                successRespCBGetScansData,
                errorRespCBGetScansData,

            )
        }
    }

    const successRespCBGetScansData = (response) => {
        // console.log("response ema", response)
        props.hideWidgetLoader();
        if (response && response.data && response.data.screener.length > 0) {
            setScansList(response.data.screener)
            streamingSubscription(response.data.screener)
            setErrorMessage('')

        }
        else {
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

    function onSelectIndicator(indicator) {
        setSelectedIndicator(indicator)
    }

    function onSelectType(type) {
        setSelectedType(type)
    }

    function onSelectSecondIndicator(indicator) {
        setSelectedSecondIndicator(indicator)
    }

    // console.log('ee')
    return (
        <div className="scannerBase-content large-table">
            <div className={`scannerType-dropdown visible-type`}>
                {selectedScan.indicators && <Select optionList={indicators}
                    value="dispName"
                    onSelectValueCB={onSelectIndicator}
                    preSelect={true}
                    selectedOption={selectedIndicator.dispName}
                    hiddenScroll={true}
                    hasLangageDependent={true}
                />}
                {selectedScan.type && <Select optionList={types}
                    value="dispName"
                    onSelectValueCB={onSelectType}
                    preSelect={true}
                    selectedOption={selectedType.dispName}
                    hiddenScroll={true}
                    hasLangageDependent={true}
                />}
                {selectedScan.indicators && <Select optionList={indicators}
                    value="dispName"
                    onSelectValueCB={onSelectSecondIndicator}
                    preSelect={true}
                    selectedOption={selectedSecondIndicator.dispName}
                    hiddenScroll={true}
                    hasLangageDependent={true}
                />}
            </div>
            <div className= "scanner-description-base">
                <div className= "scanner-description minimum-length"
                    // dangerouslySetInnerHTML={{ __html: selectedScan.description }} />   
                
                >
                    <p>
                        <LangText name ="SCANNER_DESCRIPTION_2"/>
                    </p>       
                    {/* <ol>
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
                </div> 
            </div>
            <ScannerTableComponent
                scansList={scansList}
                multiIndicatorStatus={true}
                selectedIndicator={selectedIndicator}
                selectedSecondIndicator={selectedSecondIndicator}
                errorMessage={errorMessage}
                setScansList={setScansList}
                noScannerData={noscannerdata}
            />
        </div >
    )
}

const mapStateToProps = ({ scanner }) => {
    return {
        selectedMenu: scanner.selectedMenu

    }
}

export default connect(mapStateToProps)(WidgetLoader(withStreaming(ExponentialMovingAverageComponent)))