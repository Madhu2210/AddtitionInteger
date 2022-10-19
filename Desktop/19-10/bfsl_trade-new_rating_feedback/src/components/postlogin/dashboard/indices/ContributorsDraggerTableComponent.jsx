import React, { useEffect, useState } from 'react'
import { withStreaming } from '../../../../index'

import { connect } from 'react-redux';

import { applyPaint, checkEmpty, getColorCode } from '../../../../common/CommonMethods';

import LangText from '../../../../common/lang/LangText';
import { STREAMING_KEYS, STREAMING_MODULES } from '../../../../common/Constants';
import { gotoQuote } from '../../../../common/Bridge';

function ContributorsDraggerTableComponent(props) {

    const [streamingResp, setStreamingResp] = useState({})
    const [draggersArray, setDraggersArray] = useState([])
    useEffect(() => {
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.DRAGGERS_TABLE);
    }, [])

    useEffect(() => {
        if (props.draggers) {
            setDraggersArray(props.draggers)
            streamingSubscription(props.draggers)
        }
    }, [props.draggers])

    useEffect(() => {
        if (streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function setStreamingResptoSymbols(resp) {

        let { data } = resp;
        if (props.draggers) {
            let newList = draggersArray.map(row => {
                if (row.sym.streamSym === data.symbol) {
                    row = Object.assign({}, row, applyPaint(row, data));
                }
                return row;
            })
            if (newList.length)
                setDraggersArray(newList)
        }
    }

    function streamingSubscription(symArrayList) {
        if (props.draggers) {
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
                        (draggersArray && draggersArray.length) ?
                            draggersArray.map((item, index) => {
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
                                            <td>
                                                <span className="ltp">
                                                    {checkEmpty(item.ltp)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="contributions-d">
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

export default connect(mapStateToProps, null)(withStreaming(ContributorsDraggerTableComponent));