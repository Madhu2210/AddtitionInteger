import React, { useRef, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import useCloseModal from '../../../../customHooksComponents/useCloseModal';
import LangText from '../../../../common/lang/LangText'
import Loader from '../../../common/ModalDialogLoaderComponent'

import { OFS_SERVICES } from '../../../../config/ServiceURLs';

import { getTradingBaseURL } from '../../../../common/CommonMethods';
import { TEXT_ORIENTATION } from '../../../../common/Constants';

function CancelOFSOrderDialogComponent(props) {
    
    const [showLoader, setShowLoader] = useState(false)

    const MsfFetch = useFetch()

    const pendingReq = useRef(false)
    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose, false)

    function onCancelOrder() {
        pendingReq.current = true
        setShowLoader(true)
        let request = new MsfRequest();
        request.addToData({
            "ordId": props.symData.ordId
        })
        request.setEncrypt(false)
        MsfFetch.placeRequest(
            getTradingBaseURL() + OFS_SERVICES.CANCEL_OFS,
            request,
            successRespCBCancelOFS,
            errorRespCBCancelOFS
        )
    }

    function successRespCBCancelOFS(response) {
        pendingReq.current = false
        props.onResultCancelOFSCB(response, props.symData.issueId)
        setShowLoader(false)
    }

    function errorRespCBCancelOFS(error) {
        pendingReq.current = false
        props.onResultCancelOFSCB(error, props.symData.issueId)
        setShowLoader(false)
    }

    function onClose() {
        props.onCloseCB && props.onCloseCB()
    }

    return (

        <div className="ofsDialog-base cancel-ofs-dialog">
            <div className="window" ref={!pendingReq.current ? modalRef : null}>
                <Loader show={showLoader} />
                <div className="header">
                    <LangText name="CANCEL_ORDER_QRY_HEAD" module="OFS" />
                </div>
                <div className="body">
                    <div className= "cancel-query">
                        <LangText name="CANCEL_ORDER_QRY" module="OFS" />                       
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

export default CancelOFSOrderDialogComponent;