import React, { useRef, useEffect } from 'react'

import useCloseModal from '../../../../../customHooksComponents/useCloseModal';
import LangText from '../../../../../common/lang/LangText';

const DeleteScripDialogComponent = (props) => {

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose)

    useEffect(() => {
        return () => {
            onClose()
        }
    }, [])

    function onClose() {
        props.parentCB && props.parentCB(false)
        props.onCloseCB && props.onCloseCB()
    }

    function onClickDelete() {
        props.parentCB && props.parentCB(true)
    }

    return (
        <div className="app-modalDialog2 deleteSym-dialog">
            <div className="window" ref={modalRef}>
                <div className="title flex-center">
                    <span className="title-name"><LangText  name="DELETE_SCRIP" /></span>
                    {/* <CloseIcon onClick={onClose} /> */}
                </div>
                <div className="content">
                    <img src="assets/images/delete_icon.svg" alt="" />
                    {
                        props.message ? props.message : ''
                    }
                </div>
                <div className="footer">
                    <button className="negativeBtn" 
                        onClick={onClose}><LangText module="BUTTONS" 
                            name="CANCEL" /></button>
                    <button className="left-btn deleteBtn"
                        onClick={onClickDelete}
                    >
                        <LangText name="DELETE" />
                    </button>
                </div>
            </div>
        </div >
    )
}

export default DeleteScripDialogComponent;