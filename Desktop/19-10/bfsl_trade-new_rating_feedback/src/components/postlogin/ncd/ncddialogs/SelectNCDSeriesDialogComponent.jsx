import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { checkEmpty } from "../../../../common/CommonMethods";
import { NCD_DIALOGS } from "../../../../common/Constants";
// import { NCD_DIALOGS } from "../../../../common/Constants";
import LangText from "../../../../common/lang/LangText";
import { storeNCDDialogDetails } from "../../../../state/actions/Actions";
import { CloseIcon } from "../../../common/FontIcons";
import { Loader } from "../../../common/LoaderComponent";

function SelectNCDSeriesDialogComponent(props) {

    const [showLoader] = useState(false)
    const [seriesList, setSeriesList] = useState([])
    const [selectedNCDSeries, setSelectedNCDSeries] = useState()

    // const modalRef = useRef(null)
    // const closeModal = useCloseModal()
    // closeModal.useOutsideAlerter(modalRef, onClose, false)

    useEffect(() => {
        // console.log("series", props.symData.series)
        setSeriesList(props.symData.series)
    }, [])

    useEffect(() => {
        if(props.seriesData)
            setSelectedNCDSeries(props.seriesData)
    }, [props.seriesData])

    function onClickClose() {
        props.onCloseCB && props.onCloseCB()
    }

    function onSelectNCDSeries(item) {
        setSelectedNCDSeries(item)
    }

    function onClickContinue(sdata) {
        // To prefill minLotSize in qty field and avoid prefilling of upiID and UpiHandler
        let list = Object.assign( props.symData,{ qty: props.symData.minLotSize, selectedUPIHandler: '', 
            upiId: ''} )
        props.storeNCDDialogDetails({
            name: NCD_DIALOGS.GOTO_PLACE_ORDER_SCREEN,
            symData: list,
            seriesData:sdata
        })
    }
    
    return(
        <div className="ncdDialog-base series-ncd-dialog">
            <div className="window">
                <Loader show={showLoader} />
                <div className="header">
                    <div className="company-info">
                        <span className="symName">
                            {checkEmpty(props.symData.debtipoBidNme)}</span>
                        <span className="dispSym">{checkEmpty(props.symData.debtipoNme)}</span>
                    </div>
                    <span className="close" onClick= {onClickClose}><CloseIcon/></span>
                </div>
                <div className="row-series-title">
                    <span className="select-series-title"><LangText module="NCD" name="SELECT_SERIES"/></span>
                </div>
                <div className="content">                  
                    {
                        seriesList.map((sItem, sIndex) => {
                            return (
                                <div key={sIndex} className="series-details">
                                    <label key={sIndex} className={`cursor radioField`}>
                                        <input type="radio"
                                            name="ncdSeries"
                                            onClick={() => onSelectNCDSeries(sItem)}
                                            checked={selectedNCDSeries ?
                                                sItem === selectedNCDSeries : false}
                                        />
                                        <span className="checkmark"></span>
                                        <div className="series-name">
                                            <span className="scode">{sItem.seriesCode}: </span>
                                            <span className="tenor">
                                                <LangText module="NCD" name="TENOR"/>: {checkEmpty(sItem.seriesTenor)}
                                            </span>
                                        </div>
                                    </label>
                                    <div className="details-row">
                                        <div className="column">
                                            <span className="label"><LangText module="NCD" name="AMT_MATURITY"/></span>
                                            <span className="value">
                                                {checkEmpty(sItem.seriesAmntAtMaturity)}</span>
                                        </div>
                                        <div className="column right-align cop-rate">
                                            <span className="label"><LangText module="NCD" name="COPN_RATE"/></span>
                                            <span className="value">{checkEmpty(sItem.seriesCpnRate)}</span>
                                        </div>
                                        <div className="column right-align">
                                            <span className="label">
                                                <LangText module="NCD" name="EFFECTIVE_YIELD"/></span>
                                            <span className="value">{checkEmpty(sItem.seriesEffctYld)}</span>
                                        </div>
                                        <div className="column right-align">
                                            <span className="label"><LangText module="NCD" name="INT_FREQ"/></span>
                                            <span className="value">{checkEmpty(sItem.seriesFrqcyOfPymt)}</span>
                                        </div>
                                    </div>
                                    {/* <div className="horizontal-line"></div> */}
                                </div>

                            )
                        })
                    }
                </div>
                <div className="row buttonRow">
                    <button className="continueBtn" 
                        disabled={!selectedNCDSeries}
                        onClick={()=>onClickContinue(selectedNCDSeries)}
                    >
                        <LangText name="CONTINUE" module="BUTTONS" />
                    </button>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ ncdDetails }) => {
    return {
        dialogDetails: ncdDetails.dialogDetails,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeNCDDialogDetails: (s) => { dispatch(storeNCDDialogDetails(s)) }
    };
};

export default connect(mapStateToProps,mapDispatchToProps) (SelectNCDSeriesDialogComponent);