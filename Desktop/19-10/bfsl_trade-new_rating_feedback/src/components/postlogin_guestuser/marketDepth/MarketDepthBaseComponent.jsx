import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import { withStreaming } from '../../../index'

import MarketDepthComponent from './MarketDepthComponent'
import { WidgetLoader } from '../../common/WidgetLoaderComponent'

import { STREAMING_MODULES } from '../../../common/Constants'

const MarketDepthBaseComponent = (props) => {

    const [streamingResp, setStreamingResp] = useState({})
    const [marketData, setMarketData] = useState(null)

    useEffect(() => {
        if (props.parent)
            props.registerStreamCB(onStreamCB, STREAMING_MODULES.MARKET_DEPTH + props.parent);
        else
            props.registerStreamCB(onStreamCB, STREAMING_MODULES.MARKET_DEPTH);
    }, [])

    useEffect(() => {
        if (props.selectedSym && props.selectedSym !== {}) {
            setMarketData(null)
            let symbols = []
            symbols.push(props.selectedSym)
            props.forceSubscribeLevel2(symbols)
        } else {
            props.forceSubscribeLevel2([])
            setMarketData(null)
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
            setMarketData(data)
            if (data.ask && data.bid && data.ask.length && data.bid.length) {
                props.onReceiveBidAsk && props.onReceiveBidAsk(data.bid[0], data.ask[0])
            }
        }
    }

    return <MarketDepthComponent data={marketData} hasHeader={props.hasHeader}
        hideMsg={props.hideMsg}
        hasOrdVal={props.hasOrdVal}
    />
}

const mapStateToProps = ({ watchlist }) => {
    return {
        isWatchlistScreenActive: watchlist.isWatchlistScreenActive
    }
}

export default connect(mapStateToProps, null)(WidgetLoader(withStreaming(MarketDepthBaseComponent)));