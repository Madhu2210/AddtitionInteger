import React, { useState, useEffect } from 'react'

import LangText from '../../../common/lang/LangText'

const MarketDepthComponent = (props) => {

    const [mdData, setMDdata] = useState({})

    useEffect(() => {
        if (props.data)
            setMDdata(props.data)
        else
            setMDdata({})
    }, [props.data])

    return (
        <div className={`marketDepth-div withBorder ${props.hasHeader ? 'hasHeader' : 'noHeader'}`}>
            {
                (mdData.bid && mdData.bid.length
                    && mdData.ask && mdData.ask.length && mdData.bid.length === mdData.ask.length) ?
                    <div className="base">
                        <div className="header">
                            <span><LangText module="MARKET_DEPTH" name="BEST_BUY" /></span>
                            <span><LangText module="MARKET_DEPTH" name="BEST_SELL" /></span>
                        </div>
                        <div className="marketDepth-table-div">
                            <div className="table-head">
                                <div className="valRow">
                                    <span className="alignCenter">
                                        <span className="valueSpan">
                                            <LangText module="MARKET_DEPTH" name="BID_QTY" /></span>
                                    </span>
                                    {
                                        (props.hasOrdVal === true) ?
                                            <span className="alignCenter">
                                                <LangText module="TABLE_HEADERS" name="ORD" /></span>
                                            : ''}
                                    <span className="middle alignCenter">
                                        <span className="valueSpan">
                                            <LangText module="MARKET_DEPTH" name="BID_PRICES" /></span>
                                    </span>
                                    <span className="alignCenter">
                                        <span className="valueSpan">
                                            <LangText module="MARKET_DEPTH" name="ASK_PRICE" /></span>
                                    </span>
                                    {
                                        (props.hasOrdVal === true) ?
                                            <span className="alignCenter">
                                                <LangText module="TABLE_HEADERS" name="ORD" /></span>
                                            : null}
                                    <span className="last alignCenter">
                                        <span className="valueSpan">
                                            <LangText module="MARKET_DEPTH" name="ASK_QTY" /></span>
                                    </span>
                                </div>
                            </div>
                            <div className="table-body scrollArea scroller_firefox">
                                {
                                    mdData.bid.map((item, index) => {
                                        return (
                                            <div className="valRow" key={index}>
                                                <span className="positiveColor text-nowrap alignCenter">
                                                    <span className="valueSpan">{item.qty}</span>
                                                </span>
                                                {
                                                    (props.hasOrdVal === true) ?
                                                        <span className="positiveColor text-nowrap alignCenter">
                                                            {item.no}
                                                        </span> : null
                                                }
                                                <span className="positiveColor text-nowrap middle alignCenter">
                                                    <span className="valueSpan">{item.price}</span>
                                                </span>
                                                <span className="negativeColor text-nowrap alignCenter">
                                                    <span className="valueSpan">{mdData.ask[index].price}</span>
                                                </span>
                                                {
                                                    (props.hasOrdVal === true) ?
                                                        <span className="negativeColor text-nowrap alignCenter">
                                                            {mdData.ask[index].no}</span>
                                                        : null
                                                }
                                                <span className="negativeColor text-nowrap last alignCenter">
                                                    <span className="valueSpan">{mdData.ask[index].qty}</span>
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="footer">
                            <div className="totalData left">
                                <span className="value alignCenter">
                                    <span className="valueSpan value positiveColor">{mdData.totBuyQty}</span>
                                </span>
                                {
                                    props.hasOrdVal ?
                                        <span className="value"></span>
                                        : null
                                }
                                <span className="label alignCenter">
                                    <span className="valueSpan">
                                        {
                                            (props.hasOrdVal === true) ?
                                                <LangText module="MARKET_DEPTH" name="TOTAL_B_QTY" />
                                                : <LangText module="MARKET_DEPTH" name="TOTAL_QTY" />
                                        }
                                    </span>
                                </span>
                            </div>
                            <div className="totalData right">
                                <span className="label alignCenter">
                                    <span className="valueSpan">
                                        {
                                            (props.hasOrdVal === true) ?
                                                <LangText module="MARKET_DEPTH" name="TOTAL_A_QTY" />
                                                :
                                                <LangText module="MARKET_DEPTH" name="TOTAL_QTY" />
                                        }
                                    </span>
                                </span>
                                {
                                    props.hasOrdVal ?
                                        <span className="value"></span>
                                        : null
                                }
                                <span className="value alignCenter">
                                    <span className="valueSpan sVal negativeColor">{mdData.totSellQty}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="noData-MD flex-center">
                        {
                            !props.hideMsg ?
                                <LangText module="MARKET_DEPTH" name="NO_MARKET_DEPTH" />
                                : null
                        }
                    </div>
            }
        </div>
    )
}

export default MarketDepthComponent;