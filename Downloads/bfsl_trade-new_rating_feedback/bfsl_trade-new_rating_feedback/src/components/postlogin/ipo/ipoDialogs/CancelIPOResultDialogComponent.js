import React, { useRef } from 'react'
import { TEXT_ORIENTATION } from '../../../../common/Constants';
import LangText from '../../../../common/lang/LangText';

import useCloseModal from '../../../../customHooksComponents/useCloseModal';

function CancelIPOResultDialogComponent(props) {
    
    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose, false)

    function onClose() {
        props.onCloseCB && props.onCloseCB()
    }

    return (
        <div className="ipoDialog-base cancel-ipo-result-dialog">
            <div className="window" ref={modalRef}>
                <div className="status">
                    {
                        props.orderResult.isSuccess ?
                            <LangText name="CANCELLED" module="IPO" 
                                orientation={TEXT_ORIENTATION.PASCALCASE}/>
                            :
                            <LangText name="NOT_CANCELLED" module="IPO" />
                    }
                </div>
                <div className="messageDiv">
                    {
                        props.orderResult.msg
                    }
                </div>
                <div className="footer-btn">
                    <button className="okay-btn" onClick={props.onCloseCB}> <LangText 
                        name="OK" module="BUTTONS" /></button>
                </div>                
            </div>
        </div>
    )
}

export default CancelIPOResultDialogComponent;