
import React, { useRef, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import LangText from '../../../../common/lang/LangText';
// import SelectInputComponent from '../../../common/SelectInputComponent';
import useCloseModal from '../../../../customHooksComponents/useCloseModal';
import Loader from '../../../common/ModalDialogLoaderComponent'

import {
    // checkInt, countHoleNumbers,
    checkEmpty, getTradingBaseURL, 
    // checkInt, getBaseURL, 
    // convertCommaSeparated,
    // replaceComma
} from '../../../../common/CommonMethods';
import {
    OFS_DIALOGS,
    //  ORDER_FIELD_MAX_LENGTH_QTY, ORDER_FIELD_MAX_VALUE_QTY,
    // ORDER_FIELD_MAX_VALUE_PAYABLE_AMOUNT,
    //  TEXT_ORIENTATION,
} from '../../../../common/Constants';
import { OFS_SERVICES } from '../../../../config/ServiceURLs';
// import { ORDERPAD_MESSAGES } from '../../../../common/Messages';
import { connect } from 'react-redux';
import { storeOFSDialogDetails } from '../../../../state/actions/Actions';

function ApplyOFSOrderConfirmDialogComponent(props) {

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose, false)

    const [showLoader, setShowLoader] = useState(false)

    const MsfFetch = useFetch()

    function onClickEdit(data) {
        props.storeOFSDialogDetails({
            name: OFS_DIALOGS.APPLY_ORDER,
            symData: data,
            isModify: data.isModify,
            isEdit:true
        })
    }

    function onApplyOrder() {
        // console.log("props.sym", props.dialogDetails.selectCutoff)
        setShowLoader(true)
        let request = new MsfRequest();
        if(props.isModify){
            request.addToData({
                "exc": props.symData.exchSeg,
                "issueId": props.symData.issueId,
                "qty": props.symData.quantity.toString(),               
                "price": props.symData.price.toString(),
                "cutOff" : props.symData.category==="HNI" || !props.symData.selectCutoff?"N":"Y",
                "ordId":props.symData.ordId,
                // "category": props.symData.category === "HNI"?"Non-institutional":props.symData.category,
            })
        }
        else{
            request.addToData({
                "exc": props.symData.exchSeg,
                "issueId": props.symData.issueId,
                "qty": props.symData.quantity.toString(),               
                "price": props.symData.price.toString(),
                "cutOff" : (props.symData.category==="HNI" || !props.symData.selectCutoff) ?"N":"Y",
                "category": props.symData.category === "HNI"?"Non-institutional":props.symData.category,
                "payMode": "IA"
            })
        }
        // console.log("request apply", request)
        request.setEncrypt(false)
        let apiURL = props.isModify ? getTradingBaseURL() +
                OFS_SERVICES.OFS_MODIFY_ORDER : getTradingBaseURL() + OFS_SERVICES.OFS_PLACE_ORDER
        MsfFetch.placeRequest(
            apiURL,
            request,
            successRespCBApplyOFS,
            errorRespCBApplyOFS
        )
    }

    function successRespCBApplyOFS(response) {
        // console.log('response  after order:', response);
        setShowLoader(false)
        props.onResultApplyOFSCB(response, props.symData.dispSym, props.symData, props.isModify)
    }

    function errorRespCBApplyOFS(error) {
        // console.log('error after order :', props.symData);
        setShowLoader(false)
        props.onResultApplyOFSCB(error, props.symData.dispSym, props.symData, props.isModify)
    }

    function onClose() {
        props.onCloseCB && props.onCloseCB()
    }

    return (
        <div className="ofsDialog-base apply-ofs-dialog">
            <div className="window" ref={modalRef}>
                <Loader show={showLoader} />
                <div className="header">
                    <span className="symName">
                        {props.symData.dispSym} {props.symData.exchSeg}</span>
                    <span className="dispSym">{props.symData.companyName}</span>
                </div>
                <div className="content-confirm">
                    <div className="firstRow-floorcutoff">
                        <div className="column">
                            <span className="label"><LangText name="QUANTITY" module="OFS" /></span>
                            <span className="value">{checkEmpty(props.symData.quantity)}</span>
                        </div>
                        <div className="column">
                            <span className="label"><LangText name="PRICE" module="OFS" /></span>
                            <span className="value">
                                    ₹ {checkEmpty(props.symData.price)}</span>
                        </div>
                        <div className="column">
                            <span className="label"><LangText name="CATEGORY" module="OFS" /></span>
                            <span className="value">
                                {checkEmpty(props.symData.category)}</span>
                        </div>
                    </div>
                    <div className = "secondRow">
                        <div className="column first">
                            <span className="label"><LangText name="OFFER_SIZE" module="OFS" /></span>
                            <span className="value">{checkEmpty(props.symData.issueSize)}</span>
                        </div>
                        <div className="column">
                            <span className="label"><LangText name="TICK_SIZE" module="OFS" /></span>
                            <span className="value">
                                {checkEmpty(props.symData.tickSize)}</span>
                        </div>
                        <div className="column">
                            <span className="label"></span>
                            <span className="value">
                            </span>
                        </div>
                    </div>
                    <div className="row overViewData">
                        <div>
                            <span className="label"><LangText name="AVAILABLE_MARGIN" module="OFS" /></span>
                            <span className="value">₹ {checkEmpty(props.availMargin)}</span>
                        </div>
                    </div>
                    <div className="row buttonRow">
                        <button className="editBtn" onClick=
                            {()=>onClickEdit(props.symData)} >
                            <LangText name="EDIT" module="BUTTONS" />
                        </button>
                        <button className="confirmBtn" onClick={onApplyOrder} >
                            <LangText name="CONFIRM" module="BUTTONS" />
                        </button>
                    </div>

                </div>
            </div>

        </div>
    )
}

const mapStateToProps = ({ ofsDetails }) => {
    return {
        dialogDetails: ofsDetails.dialogDetails,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeOFSDialogDetails: (s) => { dispatch(storeOFSDialogDetails(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplyOFSOrderConfirmDialogComponent);
// export default ApplyOFSOrderConfirmDialogComponent;

