import React, { useRef, useState, useEffect } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import useCloseModal from '../../../../customHooksComponents/useCloseModal';
import LangText from '../../../../common/lang/LangText'
import Loader from '../../../common/ModalDialogLoaderComponent'

import { IPO_SERVICES } from '../../../../config/ServiceURLs';

import { checkEmpty, convertToFloat, getBackOfficeBaseURL, replaceComma } from '../../../../common/CommonMethods';
import { TEXT_ORIENTATION } from '../../../../common/Constants';

function CancelIPOOrderDialogComponent(props) {

    const MsfFetch = useFetch()

    const [showLoader, setShowLoader] = useState(false)
    const [cancelValues, setCancelValues] = useState({})

    const pendingReq = useRef(false)
    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose, false)

    useEffect(() => {
        getCancelledValues()
    }, [])

    function getCancelledValues() {
        setCancelValues({})
        let request = new MsfRequest();
        request.addToData({
            "ipoBidName": props.symData.ipoBidNme,
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + IPO_SERVICES.MODIFY_PREFILL,
            request,
            successRespCBGetCancelValues,
            errorRespCBGetCancelValues
        )
    }
    function successRespCBGetCancelValues(response) {
        let getCancel = response.data.records
        getCancel["invesAmt"] =
            convertToFloat(parseInt(replaceComma(getCancel.qty))) *
            convertToFloat(parseFloat(replaceComma(getCancel.price)))
        setCancelValues(getCancel)
    }

    function errorRespCBGetCancelValues() {
        setCancelValues({})
    }

    function onCancelOrder() {
        pendingReq.current = true
        setShowLoader(true)
        let request = new MsfRequest();
        request.addToData({
            "ipoNme": props.symData.ipoBidNme
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + IPO_SERVICES.CANCEL_IPO,
            request,
            successRespCBCancelIPO,
            errorRespCBCancelIPO
        )
    }

    function successRespCBCancelIPO(response) {
        pendingReq.current = false
        props.onResultCancelIPOCB(response, props.symData.ipoBidNme)
        setShowLoader(false)
    }

    function errorRespCBCancelIPO(error) {
        pendingReq.current = false
        props.onResultCancelIPOCB(error, props.symData.ipoBidNme)
        setShowLoader(false)
    }

    function onClose() {
        props.onCloseCB && props.onCloseCB()
    }

    return (

        <div className="ipoDialog-base cancel-ipo-dialog">
            <div className="window" ref={!pendingReq.current ? modalRef : null}>
                <Loader show={showLoader} />
                <div className="header">
                    <LangText name="CANCEL_ORDER_QRY_HEAD" module="IPO" />
                </div>
                <div className="body">
                    <div className="symData">
                        <div className="name">
                            {props.symData.ipoNme}
                        </div>
                        <div className="bidName">
                            {props.symData.ipoBidNme}
                        </div>
                    </div>

                    <div className="orderData">
                        <div className="dataRow left">
                            <div className="label"><LangText name="APPLICATION_NO_L" module="IPO" /></div>
                            <div className="value">{checkEmpty(cancelValues.applicationNo)}</div>
                        </div>
                        <div className="dataRow center">
                            <div className="label"><LangText name="INVES_AMT" module="IPO" /></div>
                            <div className="value">{checkEmpty(cancelValues.invesAmt)}</div>
                        </div>
                        <div className="dataRow right">
                            <div className="label"><LangText name="BID_PRICE" module="IPO" /></div>
                            <div className="value">{checkEmpty(cancelValues.price)}</div>
                        </div>
                    </div>

                    <div className="btnDiv">
                        <button onClick={onCancelOrder}>
                            <LangText name="CANCEL_ORDERS" module="BUTTONS" orientation={TEXT_ORIENTATION.LOWERCASE} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CancelIPOOrderDialogComponent;