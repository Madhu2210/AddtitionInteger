import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../index'

import { WidgetLoader } from '../../common/WidgetLoaderComponent'
import LangText from '../../../common/lang/LangText'

import {
    getTradingBaseURL, checkEmpty, containsNumbers,
    // splitByHypen, getUpcomingOpenDate, getUpcomingEndDate,
    // convertCommaSeparated, replaceComma
} from '../../../common/CommonMethods'
import { OFS_SERVICES } from '../../../config/ServiceURLs'

function UpComingOFSComponent(props) {

    const MsfFetch = useFetch()

    const [upcomingOFS, setUpcomingOFS] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)

    useEffect(() => {
        getUpcomingOFS()
    }, [])

    function getUpcomingOFS() {
        props.showWidgetLoader()
        setUpcomingOFS([])
        setErrorMsg(null)
        let request = new MsfRequest();
        request.addToData({
            "type": "F"
        })
        MsfFetch.placeRequest(
            getTradingBaseURL() + OFS_SERVICES.UPCOMING_ONGOING,
            request,
            successRespCBGetUpcomingIPO,
            errorRespCBGetUpcomingIPO
        )
    }

    function successRespCBGetUpcomingIPO(response) {
        let list = response.data.list
        setUpcomingOFS(list)
        setErrorMsg(null)
        props.hideWidgetLoader()
    }

    function errorRespCBGetUpcomingIPO(error) {
        setErrorMsg(error.message)
        props.hideWidgetLoader()
    }

    return (
        <div className="ofs-content-base">
            <div className="ofs-table">
                {
                    (upcomingOFS && upcomingOFS.length) ?
                        upcomingOFS.map((item, index) => {
                            return (
                                <div key={index} className="dataRow">
                                    <div className="name">
                                        <span className="symbolName">{
                                            checkEmpty(item.dispSym)}</span>
                                        <span className="exchange">{
                                            checkEmpty(item.exchSeg)}</span>
                                    </div>
                                    <div className="data">
                                        <div className="column first">
                                            <span className="label"><LangText name="SYMBOL" module="OFS" /></span>
                                            <span className="value">
                                                {checkEmpty(item.companyName)}
                                            </span>
                                        </div>
                                        <div className="column">
                                            <span className="label">
                                                <LangText name="START_DATE" module="OFS" />
                                            </span>
                                            <span className="value">
                                                {checkEmpty(item.opnDte)}
                                            </span>
                                        </div>
                                        <div className="column">
                                            <span className="label">
                                                <LangText name="END_DATE" module="OFS" />
                                            </span>
                                            <span className={`value ${!containsNumbers(item.closedDte) ? 
                                                "colorRed" : ""}`}>
                                                {checkEmpty(item.closedDte)}
                                            </span>
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="PRICE_RANGE" module="OFS" /></span>
                                            <span className="value">₹ {checkEmpty(item.flrPrce)} -
                                                {checkEmpty(item.cuttOffPrce)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="OFFER_SIZE" module="OFS" /></span>
                                            <span className="value">₹ {checkEmpty(item.issueSize)} <LangText 
                                                name="CR" module="OFS" /></span>
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="TICK_SIZE" module="OFS" /></span>
                                            <span className="value">{checkEmpty(item.tickSize)}</span>
                                        </div>
                                    </div>
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

export default WidgetLoader(UpComingOFSComponent);