import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { withStreaming } from '../../../index'

import SelectInputComponent from '../../common/SelectInputComponent';

import { getColorCode, checkEmpty, applyPaint, AF_EventTriggered } from '../../../common/CommonMethods';
import { STREAMING_MODULES, STREAMING_KEYS, DASHBOARD_WIDGET_MODE, SCREENS,
    AF_EVENT_NAMES, AF_EVENT_TYPES } from '../../../common/Constants';
import { storeIndicesDetails, storeSelectedDashboardWidget } from '../../../state/actions/Actions';
import { gotoIndicesView } from '../../../common/Bridge';

const IndicesComponent = (props) => {

    const [optionList, setOptionList] = useState([])
    const [selectedIndices, setSelectedIndices] = useState(null)
    const [streamingResp, setStreamingResp] = useState(null)

    useEffect(() => {
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.HEADER_INDICES + props.index);
    }, [])

    useEffect(() => {
        setOptionList(props.indicesList)
    }, [props.indicesList])

    useEffect(() => {
        if (props.selectedIndices) {
            setSelectedIndices(props.selectedIndices)
            streamingSubscription(props.selectedIndices.sym)
        }
    }, [props.selectedIndices])

    useEffect(() => {
        if (streamingResp && streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function streamingSubscription(sym) {
        let symbols = []
        symbols.push(sym)
        props.subscribeLevel1(symbols, [STREAMING_KEYS.LTP, STREAMING_KEYS.CHANGE, STREAMING_KEYS.CHANGE_PER])
    }

    function setStreamingResptoSymbols(resp) {
        let { data } = resp;
        if (selectedIndices.sym.streamSym === data.symbol) {
            let newData = Object.assign({}, selectedIndices, applyPaint(selectedIndices, data));
            setSelectedIndices(newData)
        }
    }

    function onClickIndices() {
        AF_EventTriggered(AF_EVENT_NAMES.INDICES , AF_EVENT_TYPES.INDICES_CLICK)
        if (props.history.location.pathname !== SCREENS.DASHBOARD)
            props.history.push(SCREENS.DASHBOARD)
        gotoIndicesView(selectedIndices, DASHBOARD_WIDGET_MODE.INDICES_VIEW)
    }

    function onSelectIndices(item) {
        if (item.sym.id !== selectedIndices.sym.id) {
            setSelectedIndices(item)
            props.onSelectIndicesCB(item, props.index)
        }
    }

    if (!selectedIndices)
        return null
    return (
        <div className="indicesDiv">
            <SelectInputComponent
                optionList={optionList}
                selectedOption={selectedIndices ? selectedIndices.dispSym : ''}
                value="dispSym"
                onSelectValueCB={onSelectIndices}
                hasInnerAction={false}
                preSelect={true}
                hasSearch={true}
                hiddenScroll={true}
                // hasLangageDependent = {true}
            />
            <span className={`indicesLtp ${selectedIndices.ltp ? 'withBorder' : ''}`}>
                <span className={`cursor ${selectedIndices.ltpClass}`}
                    onClick={onClickIndices}
                >
                    {checkEmpty(selectedIndices.ltp)}
                </span>
            </span>
            <span className="changeVal">
                <span className={getColorCode(selectedIndices.chngPer)}>
                    {checkEmpty(selectedIndices.chng)} ({checkEmpty(selectedIndices.chngPer)}%)
                </span>
            </span>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) },
        storeIndicesDetails: (s) => { dispatch(storeIndicesDetails(s)) }
    };
};

export default connect(null, mapDispatchToProps)(withStreaming(withRouter(IndicesComponent)));