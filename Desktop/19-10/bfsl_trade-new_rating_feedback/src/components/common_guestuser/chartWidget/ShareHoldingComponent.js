import React, { useEffect, useMemo, useState } from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../index'

import { WidgetLoader } from '../../common/WidgetLoaderComponent'
import PieChart from '../../common/PieChartComponent'

import { QUOTE } from '../../../config/ServiceURLs'

import { getCMOTSBaseURL } from '../../../common/CommonMethods'
import { SHARE_HOLDINGS, THEMES, CHART_COLORS } from '../../../common/Constants'

function ShareHoldingComponent(props) {

    const MsfFetch = useFetch()

    const [shareHoldings, setShareHoldings] = useState(null)
    const [chartData, setChartData] = useState(null)
    const [chartLabelData, setChartLabelData] = useState([])

    useEffect(() => {
        getShareHoldingPattern()
    }, [props.selectedSym])

    useEffect(() => {
        if (shareHoldings && props.selectedTheme) {
            let colors = {
                [THEMES.DARK]: CHART_COLORS.SHARE_HOLDINGS.DARK,
                [THEMES.LIGHT]: CHART_COLORS.SHARE_HOLDINGS.LIGHT
            }
            formChartData(shareHoldings, colors[props.selectedTheme.theme])
        }
    }, [shareHoldings, props.selectedTheme])

    function getShareHoldingPattern() {
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.addToData({
            sym: props.selectedSym,
            appid: null
        })
        MsfFetch.placeRequest(
            getCMOTSBaseURL() + QUOTE.GET_SHAREHOLDING_PATTERN,
            request,
            successRespGetShareHoldingPattern,
            errorRespCBGetShareHoldingPattern
        )
    }

    function successRespGetShareHoldingPattern(response) {
        setShareHoldings(response.data)
        props.hideWidgetLoader();
    }

    function errorRespCBGetShareHoldingPattern(error) {
        console.log(error)
        props.hideWidgetLoader();
    }

    function formChartData(data, colors) {
        let shareHoldingsData = {}
        let colorArray = []
        let labelDataArray = []
        if (data[SHARE_HOLDINGS.PROMOTERS.key]) {
            shareHoldingsData[SHARE_HOLDINGS.PROMOTERS.name] = data[SHARE_HOLDINGS.PROMOTERS.key]
            colorArray.push(colors[SHARE_HOLDINGS.PROMOTERS.key])
            labelDataArray.push({
                name: SHARE_HOLDINGS.PROMOTERS.name,
                color: colors[SHARE_HOLDINGS.PROMOTERS.key],
                value: data[SHARE_HOLDINGS.PROMOTERS.key]
            })
        }
        if (data[SHARE_HOLDINGS.FII.key]) {
            shareHoldingsData[SHARE_HOLDINGS.FII.name] = data[SHARE_HOLDINGS.FII.key]
            colorArray.push(colors[SHARE_HOLDINGS.FII.key])
            labelDataArray.push({
                name: SHARE_HOLDINGS.FII.name,
                color: colors[SHARE_HOLDINGS.FII.key],
                value: data[SHARE_HOLDINGS.FII.key]
            })
        }
        if (data[SHARE_HOLDINGS.DII_MF.key]) {
            shareHoldingsData[SHARE_HOLDINGS.DII_MF.name] = data[SHARE_HOLDINGS.DII_MF.key]
            colorArray.push(colors[SHARE_HOLDINGS.DII_MF.key])
            labelDataArray.push({
                name: SHARE_HOLDINGS.DII_MF.name,
                color: colors[SHARE_HOLDINGS.DII_MF.key],
                value: data[SHARE_HOLDINGS.DII_MF.key]
            })
        }
        if (data[SHARE_HOLDINGS.OTHERS.key]) {
            shareHoldingsData[SHARE_HOLDINGS.OTHERS.name] = data[SHARE_HOLDINGS.OTHERS.key]
            colorArray.push(colors[SHARE_HOLDINGS.OTHERS.key])
            labelDataArray.push({
                name: SHARE_HOLDINGS.OTHERS.name,
                color: colors[SHARE_HOLDINGS.OTHERS.key],
                value: data[SHARE_HOLDINGS.OTHERS.key]
            })
        }
        setChartData({
            data: shareHoldingsData,
            colorArray: colorArray
        })
        setChartLabelData(labelDataArray)
    }

    return (
        <div className="shareHolding-base">
            {
                useMemo(() => {
                    if (chartData)
                        return (
                            <>
                                <PieChart chartData={chartData} noLabel={true} />
                                <div className="labels">
                                    {
                                        chartLabelData && chartLabelData.length ?
                                            chartLabelData.map((item, index) => {
                                                return (
                                                    <div key={index} className="row">
                                                        <div className="column">
                                                            <div className="box" 
                                                                style={{ backgroundColor: item.color }}></div>
                                                            <div className="label">{item.name}</div>
                                                        </div>
                                                        <div className="value">{item.value} %</div>
                                                    </div>
                                                )
                                            })
                                            : null
                                    }
                                </div>
                            </>
                        )
                    return null
                }, [chartData])
            }
        </div >
    )
}

const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme
    }
}

export default connect(mapStateToProps, null)(WidgetLoader(ShareHoldingComponent));