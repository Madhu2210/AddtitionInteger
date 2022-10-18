import React, { useEffect, useRef } from 'react'
import { connect } from "react-redux";

import ChartComponent from './chartWidget/ChartWidgetComponent'
import useCloseModal from '../../customHooksComponents/useCloseModal';

import { storeChartDialogDetails } from '../../state/actions/Actions';
import { reSetChartSettings } from '../../common/Bridge';

import { SCREENS } from '../../common/Constants';
import { CloseIcon } from './FontIcons';

const ChartDialogComponent = (props) => {

    const { selectedSym } = props

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, closeCB)

    useEffect(() => {
        if (selectedSym)
            selectedSym.isModal = true
    }, [selectedSym])

    function closeCB() {
        reSetChartSettings()
        props.storeChartDialogDetails({ show: false })
    }

    if (!props.chartDialogDetails.show)
        return null

    return (
        <div className="app-modalDialog2 quoteChart-dialog">
            <div className="window" ref={modalRef}>
                <span className="closeIcon-div" onClick={closeCB}>
                    <CloseIcon />
                </span>
                <div className="content">
                    <ChartComponent
                        key="chartDialog"
                        chartEleId="chart_iframe_modal"
                        parent={SCREENS.QUOTE}
                        isModal={true}
                        showClose={true}
                        selectedSym={selectedSym}
                        closeDialogCB={closeCB}
                    />
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ chart }) => {
    return {
        chartDialogDetails: chart.chartDialogDetails,
        selectedSym: chart.selectedSym
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeChartDialogDetails: (s) => { dispatch(storeChartDialogDetails(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartDialogComponent);