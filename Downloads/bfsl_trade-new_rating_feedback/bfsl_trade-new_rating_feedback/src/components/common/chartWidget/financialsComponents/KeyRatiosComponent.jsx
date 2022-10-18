import React, { useEffect, useRef, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import { QUOTE_FINACIALS, QUOTE_FINANCIAL_TITLES } from '../../../../common/Constants'
import { QUOTE } from '../../../../config/ServiceURLs'
import { checkEmpty, getCMOTSBaseURL } from '../../../../common/CommonMethods'
import LangText from '../../../../common/lang/LangText'
import { WidgetLoader } from '../../WidgetLoaderComponent'

function KeyRatiosComponent(props) {

    const MsfFetch = useFetch()
    const [marginRatio, setMarginRatio] = useState()
    const [performanceRatio, setPerformanceRatio] = useState()
    const [efficencyRatio, setEfficencyRatio] = useState()
    const [financialRatio, setFinancialRatio] = useState()
    const [growthRatio, setGrowthRatio] = useState()
    const [liquidityRatio, setLiquidityRatio] = useState()
    const [valuationRatios, setValuationRatios] = useState()
    const [CashFlowRatios, setCashFlowRatios] = useState()

    const [marginErr, setMarginErr] = useState()
    const [perfomErr, setPerformErr] = useState()
    const [efficErr, setEfficErr] = useState()
    const [finErr, setFinErr] = useState()
    const [growthErr, setGrowthErr] = useState()
    const [liquidityErr, setLiquidityErr] = useState()
    const [valErr, setValErr] = useState()
    const [cashFlowErr, setCashFlowErr] = useState()

    const [responseYears, setResponseYears] = useState([])
    let respState = true
    const apiLoader = useRef(0)

    useEffect(() => {
        getKeyRatioApis()
    }, [props.selectedType])

    function getKeyRatioApis() {
        getMarginRatio()
        getPerformanceRatio()
        getEfficencyRatio()
        getFinancialStabilityRatio()
        getGrowthRatio()
        getLiquidityRatio()
        getValuationRatios()
        getCashFlowRatios()
    }

    function getMarginRatio() {
        apiLoader.current = apiLoader.current + 1;
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.setEcho(QUOTE_FINANCIAL_TITLES[0].name)
        request.addToData({
            type: (props.selectedType === QUOTE_FINACIALS.CONSOLIDATED) ? "C" : "S",
            sym: props.symbolList,
        })
        MsfFetch.placeRequest(
            getCMOTSBaseURL() + QUOTE.GET_MARGIN_RATIO,
            request,
            successRespGetKeyRatios,
            errorRespCBGetKeyRatios
        )
    }
    function getPerformanceRatio() {
        apiLoader.current = apiLoader.current + 1;
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.setEcho(QUOTE_FINANCIAL_TITLES[1].name)
        request.addToData({
            type: (props.selectedType === QUOTE_FINACIALS.CONSOLIDATED) ? "C" : "S",
            sym: props.symbolList,
        })
        MsfFetch.placeRequest(
            getCMOTSBaseURL() + QUOTE.GET_PERFORMANCE_RATIO,
            request,
            successRespGetKeyRatios,
            errorRespCBGetKeyRatios
        )
    }
    function getEfficencyRatio() {
        apiLoader.current = apiLoader.current + 1;
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.setEcho(QUOTE_FINANCIAL_TITLES[2].name)
        request.addToData({
            type: (props.selectedType === QUOTE_FINACIALS.CONSOLIDATED) ? "C" : "S",
            sym: props.symbolList,
        })
        MsfFetch.placeRequest(
            getCMOTSBaseURL() + QUOTE.GET_EFFICENCY_RATIO,
            request,
            successRespGetKeyRatios,
            errorRespCBGetKeyRatios
        )
    }
    function getFinancialStabilityRatio() {
        apiLoader.current = apiLoader.current + 1;
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.setEcho(QUOTE_FINANCIAL_TITLES[3].name)
        request.addToData({
            type: (props.selectedType === QUOTE_FINACIALS.CONSOLIDATED) ? "C" : "S",
            sym: props.symbolList,
        })
        MsfFetch.placeRequest(
            getCMOTSBaseURL() + QUOTE.GET_FINANCIALSTABILITY_RATIO,
            request,
            successRespGetKeyRatios,
            errorRespCBGetKeyRatios
        )
    }
    function getGrowthRatio() {
        apiLoader.current = apiLoader.current + 1;
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.setEcho(QUOTE_FINANCIAL_TITLES[4].name)
        request.addToData({
            type: (props.selectedType === QUOTE_FINACIALS.CONSOLIDATED) ? "C" : "S",
            sym: props.symbolList,
        })
        MsfFetch.placeRequest(
            getCMOTSBaseURL() + QUOTE.GET_GROWTH_RATIO,
            request,
            successRespGetKeyRatios,
            errorRespCBGetKeyRatios
        )
    }
    function getLiquidityRatio() {
        apiLoader.current = apiLoader.current + 1;
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.setEcho(QUOTE_FINANCIAL_TITLES[5].name)
        request.addToData({
            type: (props.selectedType === QUOTE_FINACIALS.CONSOLIDATED) ? "C" : "S",
            sym: props.symbolList,
        })
        MsfFetch.placeRequest(
            getCMOTSBaseURL() + QUOTE.GET_LIQUIDITY_RATIO,
            request,
            successRespGetKeyRatios,
            errorRespCBGetKeyRatios
        )
    }
    function getValuationRatios() {
        apiLoader.current = apiLoader.current + 1;
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.setEcho(QUOTE_FINANCIAL_TITLES[6].name)
        request.addToData({
            type: (props.selectedType === QUOTE_FINACIALS.CONSOLIDATED) ? "C" : "S",
            sym: props.symbolList,
        })
        MsfFetch.placeRequest(
            getCMOTSBaseURL() + QUOTE.GET_VALUATION_RATIO,
            request,
            successRespGetKeyRatios,
            errorRespCBGetKeyRatios
        )
    }
    function getCashFlowRatios() {
        apiLoader.current = apiLoader.current + 1;
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.setEcho(QUOTE_FINANCIAL_TITLES[7].name)
        request.addToData({
            type: (props.selectedType === QUOTE_FINACIALS.CONSOLIDATED) ? "C" : "S",
            sym: props.symbolList,
        })
        MsfFetch.placeRequest(
            getCMOTSBaseURL() + QUOTE.GET_CASHFLOW_RATIO,
            request,
            successRespGetKeyRatios,
            errorRespCBGetKeyRatios
        )
    }
    
    function successRespGetKeyRatios(response) {
        apiLoader.current = apiLoader.current-1;
        if(apiLoader.current === 0) {
            props.hideWidgetLoader();
        }
        if (respState) {
            setResponseYears(response.data.years)
            respState = false
        }

        if (response.echo === QUOTE_FINANCIAL_TITLES[0].name) {
            setMarginRatio(response.data)
        }
        else if (response.echo === QUOTE_FINANCIAL_TITLES[1].name) {
            setPerformanceRatio(response.data)
        }
        else if (response.echo === QUOTE_FINANCIAL_TITLES[2].name) {
            setEfficencyRatio(response.data)
        }
        else if (response.echo === QUOTE_FINANCIAL_TITLES[3].name) {
            setFinancialRatio(response.data)
        }
        else if (response.echo === QUOTE_FINANCIAL_TITLES[4].name) {
            setGrowthRatio(response.data)
        }
        else if (response.echo === QUOTE_FINANCIAL_TITLES[5].name) {
            setLiquidityRatio(response.data)
        }
        else if (response.echo === QUOTE_FINANCIAL_TITLES[6].name) {
            setValuationRatios(response.data)
        }
        else {
            setCashFlowRatios(response.data)
        }

    }

    function errorRespCBGetKeyRatios(error) {
        apiLoader.current = apiLoader.current-1;
        if(apiLoader.current === 0) {
            props.hideWidgetLoader();
        }
        if (error.echo === QUOTE_FINANCIAL_TITLES[0].name) {
            setMarginErr(error.message)
        }
        else if (error.echo === QUOTE_FINANCIAL_TITLES[1].name) {
            setPerformErr(error.message)
        }
        else if (error.echo === QUOTE_FINANCIAL_TITLES[2].name) {
            setEfficErr(error.message)
        }
        else if (error.echo === QUOTE_FINANCIAL_TITLES[3].name) {
            setFinErr(error.message)
        }
        else if (error.echo === QUOTE_FINANCIAL_TITLES[4].name) {
            setGrowthErr(error.message)
        }
        else if (error.echo === QUOTE_FINANCIAL_TITLES[5].name) {
            setLiquidityErr(error.message)
        }
        else if (error.echo === QUOTE_FINANCIAL_TITLES[6].name) {
            setValErr(error.message)
        }
        else {
            setCashFlowErr(error.message)
        }
    }
    return (
        <div className="keyRatios-base">
            <table className="keyRatios">
                <thead className="thead-scroller">

                    <th className="firstChild width24">
                        <LangText module="TABLE_HEADERS" name="PARTICULAR" /></th>
                    {
                        responseYears.length ? responseYears.map((item) => {
                            return (
                                <>
                                    <th className="width24">
                                        {item}
                                    </th>

                                </>
                            )
                        })
                            : ''
                    }
                </thead>
                <tbody className="tbody-scroller">
                    <tr className="title width24 border-bottom">
                        <LangText module="QUOTE" name="MARGIN_RATIO" />
                    </tr>
                    {
                        marginRatio ? marginRatio.values.map((item,index) => {
                            return (
                                <tr key={index}>
                                    {
                                        item.map((itemArray, ind) => {
                                            return (
                                                <td className="width24 itemArray" key={ind}>
                                                    <span className={`${ind === 0 ? 'first' : ''}`}>
                                                        {checkEmpty(itemArray)} 
                                                    </span>
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        }) : <tr className="errorDiv"> {marginErr}</tr>
                    }
                    <tr className="title width24 top-border">

                        <LangText module="QUOTE" name="PERFORMANCE_RATIO" />
                    </tr>
                    {
                        performanceRatio ? performanceRatio.values.map((item, index) => {
                            return (
                                <tr key={index}>
                                    {
                                        item.map((itemArray, ind) => {
                                            return (
                                                <td key={ind} className="width24 itemArray">
                                                    <span className={`${ind === 0 ? 'first' : ''}`}>
                                                        {checkEmpty(itemArray)} 
                                                    </span>
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        }) : <tr className="errorDiv"> {perfomErr}</tr>
                    }
                    <tr className="title width24 top-border">
                        <LangText module="QUOTE" name="EFFICENCY_RATIO" />
                    </tr>
                    {
                        efficencyRatio ? efficencyRatio.values.map((item, index) => {
                            return (
                                <tr key={index}>
                                    {
                                        item.map((itemArray, ind) => {
                                            return (
                                                <td key={ind} className="width24 itemArray">
                                                    <span className={`${ind === 0 ? 'first' : ''}`}>
                                                        {checkEmpty(itemArray)}
                                                    </span>
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        }) : <tr className="errorDiv"> {efficErr}</tr>
                    }
                    <tr className="title width24 top-border">
                        <LangText module="QUOTE" name="FINANCIAL_STABILITY_RATIO" />
                    </tr>
                    {
                        financialRatio ? financialRatio.values.map((item, index) => {
                            return (
                                <tr key={index}>
                                    {
                                        item.map((itemArray, ind) => {
                                            return (
                                                <td key={ind} className="width24 itemArray">
                                                    <span className={`${ind === 0 ? 'first' : ''}`}>
                                                        {checkEmpty(itemArray)} 
                                                    </span>
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        }) : <tr className="errorDiv"> {finErr}</tr>
                    }
                    <tr className="title width24 top-border">
                        <LangText module="QUOTE" name="GROWTH_RATIO" />
                    </tr>
                    {
                        growthRatio ? growthRatio.values.map((item, index) => {
                            return (
                                <tr key={index}>
                                    {
                                        item.map((itemArray, ind) => {
                                            return (
                                                <td key={ind} className="width24 itemArray">
                                                    <span className={`${ind === 0 ? 'first' : ''}`}>
                                                        {checkEmpty(itemArray)} 
                                                    </span>
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        }) : <tr className="errorDiv"> {growthErr}</tr>
                    }
                    <tr className="title width24 top-border">
                        <LangText module="QUOTE" name="LIQUIDITY_RATIO" />
                    </tr>
                    {
                        liquidityRatio ? liquidityRatio.values.map((item, index) => {
                            return (
                                <tr key={index}>
                                    {
                                        item.map((itemArray, ind) => {
                                            return (
                                                <td key={ind} className="width24 itemArray">
                                                    <span className={`${ind === 0 ? 'first' : ''}`}>
                                                        {checkEmpty(itemArray)} 
                                                    </span>
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        }) : <tr className="errorDiv"> {liquidityErr}</tr>
                    }
                    <tr className="title width24 top-border">
                        <LangText module="QUOTE" name="VALUATION_RATIO" />
                    </tr>
                    {
                        valuationRatios ? valuationRatios.values.map((item, index) => {
                            return (
                                <tr key={index}>
                                    {
                                        item.map((itemArray, ind) => {
                                            return (
                                                <td key={ind} className="width24 itemArray">
                                                    <span className={`${ind === 0 ? 'first' : ''}`}>
                                                        {checkEmpty(itemArray)} 
                                                    </span>
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        }) : <tr className="errorDiv"> {valErr}</tr>
                    }
                    <tr className="title width24 top-border">
                        <LangText module="QUOTE" name="CASHFLOW_RATIO" />
                    </tr>
                    {
                        CashFlowRatios ? CashFlowRatios.values.map((item, index) => {
                            return (
                                <tr key={index}>
                                    {
                                        item.map((itemArray, ind) => {
                                            return (
                                                <td key={ind} className="width24 itemArray">
                                                    <span className={`${ind === 0 ? 'first' : ''}`}>
                                                        {checkEmpty(itemArray)} 
                                                    </span>
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        }) : <tr className="errorDiv"> {cashFlowErr}</tr>
                    }
                </tbody>

            </table>
        </div>
    )
}

export default WidgetLoader(KeyRatiosComponent);