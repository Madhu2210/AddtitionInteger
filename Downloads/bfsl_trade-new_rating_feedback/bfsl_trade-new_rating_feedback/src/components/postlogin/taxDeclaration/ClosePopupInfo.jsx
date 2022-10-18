import React, { useRef } from 'react';

import useCloseModal from '../../../customHooksComponents/useCloseModal';
import LangText from '../../../common/lang/LangText'

const ClosePopupInfo = (props) => {
    // console.log(props)
    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose)

    function onClose() {
        props.appDialog.closeCB && props.appDialog.closeCB()
    }

    const { appDialog } = props
    if (!appDialog.show) return null;
    return (
        <div className="app-modalDialog2 income-close-popup"
        >
            <div className="window" ref={modalRef}>
                <div className="title">
                    <h6 className="modalTitle"> 
                        <LangText module="OTHERS" name="APP_TITLE" />
                    </h6>
                </div>
                <div className="content">
                    {appDialog.message}
                </div>
                <div className="footer">
                    <button
                        className="positiveBtn"
                        onClick={onClose}
                    >
                        <LangText module="BUTTONS" name="OK" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ClosePopupInfo;