import React, { useState } from "react";
import {  useFetch, MsfRequest } from '../../../../index'
import { connect } from "react-redux";
import { AF_EventTriggered, checkEmpty, convertCommaSeparated, 
    convertNCDSeriesCode, getBackOfficeBaseURL } from "../../../../common/CommonMethods";
import { AF_EVENT_NAMES, AF_EVENT_TYPES, NCD_DIALOGS } from "../../../../common/Constants";
import LangText from "../../../../common/lang/LangText";
import { storeNCDDialogDetails } from "../../../../state/actions/Actions";
import { CloseIcon } from "../../../common/FontIcons";
import { Loader } from "../../../common/LoaderComponent";
import { NCD_SERVICE } from "../../../../config/ServiceURLs";
import { WidgetLoader } from "../../../common/WidgetLoaderComponent";

function NCDOrderConfirmDialogComponent(props) {

    const MsfFetch = useFetch()

    const [showLoader, setShowLoader] = useState(false)
    const [confirmBtnDisable, setConfirmBtnDisable] = useState(false)

    function onClickClose() {
        props.onCloseCB && props.onCloseCB()
    }

    function onClickEdit() {
        props.storeNCDDialogDetails({
            name: NCD_DIALOGS.GOTO_PLACE_ORDER_SCREEN,
            symData: props.symData,
            seriesData: props.seriesData,
            selectedUPIHandler: props.symData.selectedUPIHandler
        })
    }

    function onClickConfirmOrder() {
        setShowLoader(true)
        setConfirmBtnDisable(true)
        // props.showWidgetLoader()
        let request = new MsfRequest();
        request.addToData({
            "debtipoNme":props.symData.debtipoBidNme,
            "qty": props.symData.qty.toString(),
            "seriesCode": convertNCDSeriesCode(props.seriesData.seriesCode),
            "upiID":props.symData.upiId,
            "upiHndlr":props.symData.selectedUPIHandler
        })
        // request.setEncrypt(false)
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + NCD_SERVICE.PLACE_NCD_ORDER,
            request,
            successRespCBPlaceNCDOrder,
            errorRespCBPlaceNCDOrder
        )

    }

    function successRespCBPlaceNCDOrder(response) {
        setShowLoader(false)
        // props.hideWidgetLoader()
        props.onResultPlaceNCDCB(response, props.symData)
        AF_EventTriggered(AF_EVENT_NAMES.NCD , AF_EVENT_TYPES.NCD_ORDER_PLACEMENT_SUCCESS)

    }

    function errorRespCBPlaceNCDOrder(error) {
        setShowLoader(false)
        // props.hideWidgetLoader()
        props.onResultPlaceNCDCB(error, props.symData,props.seriesData)
        AF_EventTriggered(AF_EVENT_NAMES.NCD , AF_EVENT_TYPES.NCD_ORDER_PLACEMENT_FAILURE)

    }
    
    return(
        <div className="ncdDialog-base confirm-ncd-dialog">
            <div className="window">
                <Loader show={showLoader} />
                <div className="header">
                    <div className="company-info">
                        <span className="symName">
                            {checkEmpty(props.symData.debtipoBidNme)}: <span style={{color: "var(--greenColor)",
                                fontFamily: "openSans-Bold"}}>
                                <LangText module="NCD" name= "BUY"/></span></span>
                        <span className="dispSym">{checkEmpty(props.symData.debtipoNme)}</span>
                    </div>
                    <span className="close" onClick= {onClickClose}><CloseIcon/></span>
                </div>
                <div className="content">                 
                    <div className="row first">
                        <div className="column">
                            <span className="label">
                                <LangText module="NCD" name="QUANTITY"/>
                            </span>
                            <span className="value">
                                {checkEmpty(props.symData.qty)} Qty
                            </span>
                        </div>
                        <div className="column center-align">
                            <span className="label">
                                <LangText module="NCD" name="PRICE" />
                            </span>
                            <span className="value">
                                {checkEmpty(props.symData.issuePrce)}
                            </span>
                        </div>
                        <div className="column right-align">
                            <span className="label">
                                <LangText module="NCD" name="SERIES" />
                            </span>
                            <span className="value">
                                {checkEmpty(props.seriesData.seriesCode)}
                            </span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="column">
                            <span className="label">
                                <LangText module="NCD" name="TENOR" />
                            </span>
                            <span className="value">
                                {checkEmpty(props.seriesData.seriesTenor)}
                            </span>
                        </div>
                        <div className="column center-align">
                            <span className="label">
                                <LangText module="NCD" name="EFFECTIVE_YIELD" />
                            </span>
                            <span className="value">
                                {checkEmpty(props.seriesData.seriesEffctYld)}
                            </span>
                        </div>
                        <div className="column right-align">
                            <span className="label">
                                <LangText module="NCD" name="INT_FREQ" />
                            </span>
                            <span className="value">
                                {checkEmpty(props.seriesData.seriesFrqcyOfPymt)}
                            </span>
                        </div>
                    </div>
                    <div className="row overViewData">
                        <div>
                            <span className="label"><LangText module="NCD" name="TOTAL_QTY" /></span>
                            <span className="value">{checkEmpty(props.symData.qty)}</span>
                        </div>
                        <div>
                            <span className="label"><LangText module="NCD" name="PAYABLE_AMT" /></span>
                            <span className="value">{checkEmpty(convertCommaSeparated(props.symData.payAmount))}</span>
                        </div>
                    </div>
                    <div className="row buttonRow">
                        <button className="editBtn" onClick={onClickEdit}>
                            <LangText name="EDIT" module="BUTTONS" />
                        </button>
                        <button className="confirmBtn" disabled = {confirmBtnDisable}
                            onClick={ onClickConfirmOrder}
                        >
                            {
                                <LangText module="BUTTONS" name="CONFIRM" />
                            }
                        </button>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps) (WidgetLoader(NCDOrderConfirmDialogComponent));