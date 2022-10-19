import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../index'

import { WidgetLoader } from '../../common/WidgetLoaderComponent'
import LangText from '../../../common/lang/LangText'

import {
    getBackOfficeBaseURL, checkEmpty,
    splitByHypen, getUpcomingOpenDate, getUpcomingEndDate,
    convertCommaSeparated, replaceComma, AF_EventTriggered
} from '../../../common/CommonMethods'
import { IPO_SERVICES } from '../../../config/ServiceURLs'
// import { TEXT_ORIENTATION } from '../../../common/Constants'
import { AF_EVENT_NAMES, AF_EVENT_TYPES, TEXT_ORIENTATION } from '../../../common/Constants'

function UpComingIPOComponent(props) {

    const MsfFetch = useFetch()

    const [upcomingIPO, setUpcomingIPO] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.IPO , AF_EVENT_TYPES.UPCOMING_IPO)
    }, [])

    useEffect(() => {
        getUpcomingIPO()
    }, [])

    function getUpcomingIPO() {
        props.showWidgetLoader()
        setUpcomingIPO([])
        setErrorMsg(null)
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + IPO_SERVICES.UPCOMING_IPO,
            request,
            successRespCBGetUpcomingIPO,
            errorRespCBGetUpcomingIPO
        )
    }

    function successRespCBGetUpcomingIPO(response) {
        let list = response.data.upcomingIPOList
        list.map((item) => {
            if (item.minQty && item.price) {
                let maxPrice = splitByHypen(item.price)
                item.investAmt =
                    convertCommaSeparated(parseFloat(replaceComma(maxPrice)) * parseInt(replaceComma(item.minQty)))
            }
            return item
        })
        setUpcomingIPO(list)
        setErrorMsg(null)
        props.hideWidgetLoader()
    }

    function errorRespCBGetUpcomingIPO(error) {
        setUpcomingIPO([])
        setErrorMsg(error.message)
        props.hideWidgetLoader()
    }

    return (
        <div className="ipo-content-base">
            <div className="IPO-table">
                {
                    (upcomingIPO && upcomingIPO.length) ?
                        upcomingIPO.map((item, index) => {
                            return (
                                <div key={index} className="dataRow">
                                    <div className="name">
                                        {checkEmpty(item.ipoNme)}
                                    </div>
                                    <div className="data">
                                        <div className="column first">
                                            <span className="label"><LangText name="SYMBOL" module="IPO" /></span>
                                            <span className="value">{checkEmpty(item.ipoBidNme)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label">
                                                <LangText name="ISSUE_OPEN_DATE" module="IPO" />
                                            </span>
                                            <span className="value">
                                                {checkEmpty(getUpcomingOpenDate(item.issueDate))}
                                            </span>
                                        </div>
                                        <div className="column">
                                            <span className="label">
                                                <LangText name="ISSUE_CLOSE_DATE" module="IPO" />
                                            </span>
                                            <span className="value">
                                                {checkEmpty(getUpcomingEndDate(item.issueDate))}
                                            </span>
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="PRICE_RANGE" module="IPO" /></span>
                                            <span className="value">{checkEmpty(item.price)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="MIN_LOT" module="IPO" /></span>
                                            <span className="value">{checkEmpty(item.minQty)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="ISSUE_SIZE" module="IPO" 
                                                orientation={TEXT_ORIENTATION.UPPERCASE} /></span>
                                            <span className="value">{checkEmpty(item.issueSize)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="MIN_INVS_AMT" module="IPO" /></span>
                                            <span className="value">{checkEmpty(item.investAmt)}</span>
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

export default WidgetLoader(UpComingIPOComponent);