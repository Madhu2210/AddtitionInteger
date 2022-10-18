import React, { useEffect, useState } from 'react'
import { withStreaming } from '../../../../index'

import { connect } from 'react-redux';

import { applyPaint, checkEmpty, getColorCode } from '../../../../common/CommonMethods';
import LangText from '../../../../common/lang/LangText';

import { STREAMING_KEYS, STREAMING_MODULES } from '../../../../common/Constants';
import { gotoQuote } from '../../../../common/Bridge';

function ContributorsPullerTableComponent(props) {

    const [streamingResp, setStreamingResp] = useState({})
    const [pullersArray, setPullersArray] = useState([])

    useEffect(() => {
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.PULLERS_TABLE);
    }, [])

    useEffect(() => {
        if (props.pullers) {
            setPullersArray(props.pullers)
            streamingSubscription(props.pullers)
        }
    }, [props.pullers])

    useEffect(() => {
        if (streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function setStreamingResptoSymbols(resp) {
        let { data } = resp;
        let newList = pullersArray.map(row => {

            if (row.sym.streamSym === data.symbol) {
                row = Object.assign({}, row, applyPaint(row, data));
            }
            return row;
        })
        if (newList.length)
            setPullersArray(newList)
    }

    function streamingSubscription(symArrayList) {
        if (props.pullers) {
            let symbols = symArrayList.map(l => l.sym)
            props.forceSubscribeLevel1(
                symbols,
                [STREAMING_KEYS.LTP, STREAMING_KEYS.CHANGE, STREAMING_KEYS.CHANGE_PER]
            )
        }
    }

    function gotoQuoteView(item, fullView = false) {
        gotoQuote(item, fullView)
    }

    return (
        < div className="pullers-left" >
            <table>
                <thead className="thead-scroller">
                    <tr>
                        <th className="firstChild width30">
                            <span className="symbolname-header">
                                <LangText module="TABLE_HEADERS" name="SYMBOL" />
                            </span>
                        </th>
                        <th>
                            <span className="change-per">
                                <LangText module="TABLE_HEADERS" name="CHG_PER" />
                            </span>
                        </th>
                        <th>
                            <span className="ltp">
                                <LangText module="TABLE_HEADERS" name="LTP" />
                            </span>
                        </th>
                        <th>
                            <span className="contribns">
                                <LangText module="TABLE_HEADERS" name="CONT_PNTS" />
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody className="tbody-scroller">
                    {
                        (pullersArray && pullersArray.length) ?
                            pullersArray.map((item, index) => {
                                return (
                                    <>
                                        <tr key={index}>
                                            <td className="firstChild width30">
                                                <div className="symName-column primary-symName cursor quote-click"
                                                    onClick={() => gotoQuoteView(item, true)}>
                                                    {item.dispSym}
                                                </div>
                                            </td>
                                            <td className={`${getColorCode(item.chng)}`}>
                                                <span className={`${item.chngClass}`}>
                                                    {checkEmpty(item.chng)}({checkEmpty(item.chngPer)}%)</span>
                                            </td>
                                            <td className={`${item.ltp ? 'ltpVal' : ''}`}>
                                                <span className={`${item.ltpClass}`}>{checkEmpty(item.ltp)}</span>
                                            </td>
                                            <td>
                                                <span className="contributions">
                                                    {checkEmpty(item.contributn)}
                                                </span>
                                            </td>
                                        </tr>
                                    </>
                                )
                            })
                            :
                            <div className="errorMsg flex-center">
                                <LangText name="COMMON_NO_DATA" module="MESSAGES" />
                            </div>
                    }
                </tbody>
            </table>
        </div >
    )
}

const mapStateToProps = ({ indicesDetails }) => {
    return {
        selectedSymbol: indicesDetails.selectedSymbol
    }
}

export default connect(mapStateToProps, null)(withStreaming(ContributorsPullerTableComponent));