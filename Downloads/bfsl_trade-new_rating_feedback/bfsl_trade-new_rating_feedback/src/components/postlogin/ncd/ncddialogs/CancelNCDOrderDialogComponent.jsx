import React, { useRef, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import LangText from '../../../../common/lang/LangText'
import Loader from '../../../common/ModalDialogLoaderComponent'

import { NCD_SERVICE } from '../../../../config/ServiceURLs';

import { checkEmpty, getBackOfficeBaseURL } from '../../../../common/CommonMethods';
import { TEXT_ORIENTATION } from '../../../../common/Constants';

function CancelNCDOrderDialogComponent(props) {
    
    const [showLoader, setShowLoader] = useState(false)

    const MsfFetch = useFetch()

    const pendingReq = useRef(false)

    function onCancelOrder() {
        pendingReq.current = true
        setShowLoader(true)
        let request = new MsfRequest();
        request.addToData({
            "debtipoNme": props.symData.debtipoBidNme
        })
        // request.setEcho(props.symData.applicationNo)
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + NCD_SERVICE.CANCEL_NCD,
            request,
            successRespCBCancelNCD,
            errorRespCBCancelNCD
        )
    }

    function successRespCBCancelNCD(response) {
        pendingReq.current = false
        props.onResultCancelNCDCB(response, props.symData.debtipoBidNme)
        setShowLoader(false)
    }

    function errorRespCBCancelNCD(error) {
        pendingReq.current = false
        props.onResultCancelNCDCB(error, props.symData.debtipoBidNme)
        setShowLoader(false)
    }

    function onClose() {
        props.onCloseCB && props.onCloseCB()
    }

    return (

        <div className="ncdDialog-base cancel-ncd-dialog">
            <div className="window">
                <Loader show={showLoader} />
                <div className="header">
                    <span>{checkEmpty(props.symData.debtipoBidNme)}</span>
                </div>
                <div className="body">
                    <div className= "cancel-query">
                        <LangText name="CANCEL_ORDER_QRY" module="NCD" />                       
                    </div>
                    <div className="btnDiv">
                        <button className= "noBtn" onClick={onClose}>
                            <LangText name="NO" module="BUTTONS"  />
                        </button>
                        <button className= "yesBtn" onClick={onCancelOrder}>
                            <LangText name="YES" module="BUTTONS" orientation={TEXT_ORIENTATION.LOWERCASE} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CancelNCDOrderDialogComponent;