import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../index'

import { WidgetLoader } from '../../common/WidgetLoaderComponent'
import LangText from '../../../common/lang/LangText'
import NewsListComponent from '../../common/NewsListComponent';

import { QUOTE } from '../../../config/ServiceURLs'

import { getNewsBaseURL } from '../../../common/CommonMethods'

const TrendingNewsComponent = (props) => {

    const MsfFetch = useFetch()

    const [newsData, setNewsData] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)

    useEffect(() => {
        if (props.selectedSym)
            getNewsData(props.selectedSym)
    }, [props.selectedSym])

    function getNewsData(symbol) {
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.addToData({
            "sym": symbol
        })
        request.setEncrypt(false)
        MsfFetch.placeRequest(
            getNewsBaseURL() + QUOTE.COMPANY_NEWS,
            request,
            successRespCBGetNews,
            errorRespCBGetNews
        )
    }

    function successRespCBGetNews(response) {
        setNewsData(response.data.news)
        setErrorMsg(null)
        props.hideWidgetLoader();
    }

    function errorRespCBGetNews(error) {
        setErrorMsg(error.message)
        setNewsData([])
        props.hideWidgetLoader();
    }

    return (
        <div className="trendingNews withBorder last">
            {!props.hideHeader ?
                <div className="header">
                    <LangText module="QUOTE" name="NEWS_HEADER" />
                </div>
                : null
            }
            <NewsListComponent newsData={newsData} errorMsg={errorMsg} />
        </div>
    )
}

export default WidgetLoader(TrendingNewsComponent);