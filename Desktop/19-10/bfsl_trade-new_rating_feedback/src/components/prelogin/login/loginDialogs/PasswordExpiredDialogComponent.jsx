import React, { useRef } from 'react'

import useCloseModal from '../../../../customHooksComponents/useCloseModal';
import LangText from '../../../../common/lang/LangText'

import { PasswordExpiredIcon } from '../../../common/FontIcons'

function PasswordExpiredDialogComponent(props) {

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef)

    function onClickChangePassword() {
        props.onClickChangePassCB && props.onClickChangePassCB()
    }

    return (
        <div className="app-modalDialog password-expired-dialog">
            <div className="window" ref={modalRef}>
                <div className="content">
                    <PasswordExpiredIcon />
                    <div className="message"> {props.message ? props.message : 
                        <LangText  name="PASSWORD_EXPIRED" />} </div>
                </div>

                <div className="footer">
                    <button className="negativeBtn" onClick={props.onCloseCB}>
                        <LangText module="BUTTONS" name="CANCEL" /></button>
                    <button className="left-btn positiveBtn" onClick={onClickChangePassword}>
                        <LangText  name="CHANGE_PASSWORD" /></button>
                </div>
            </div>
        </div>
    )
}

export default PasswordExpiredDialogComponent;