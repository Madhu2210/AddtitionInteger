import React, { useRef } from 'react'
import { connect } from 'react-redux';
import LangText from '../../../../common/lang/LangText';

import useCloseModal from '../../../../customHooksComponents/useCloseModal';
import { storeOFSOrderbookUpdate } from '../../../../state/actions/Actions';

function CancelOFSResultDialogComponent(props) {
    
    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose, false)

    function onClose() {
        props.gotoOrderbookCB && props.gotoOrderbookCB()
    }

    function onClickOk() {
        props.storeOFSOrderbookUpdate(true) ;
        props.gotoOrderbookCB()
    }

    return (
        <div className="ofsDialog-base cancel-ofs-result-dialog">
            <div className="window" ref={modalRef}>
                <div className="status">
                    {
                        props.orderResult.isSuccess ?
                            <LangText name="CANCELLED" module="OFS" />
                            :
                            <LangText name="NOT_CANCELLED" module="OFS" />
                    }
                </div>
                <div className="messageDiv">
                    {
                        props.orderResult.msg
                    }
                </div>
                <div className="footer-btn">
                    <button className="okay-btn" 
                        onClick={onClickOk}> <LangText name="OK" module="BUTTONS" /></button>
                </div>                
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeOFSOrderbookUpdate: (s) => { dispatch(storeOFSOrderbookUpdate(s)) }
    };
};

export default connect(null, mapDispatchToProps) (CancelOFSResultDialogComponent);