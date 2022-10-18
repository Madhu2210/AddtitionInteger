import React, { useRef } from 'react'

import useCloseModal from '../../../../customHooksComponents/useCloseModal';
import LangText from '../../../../common/lang/LangText'

import { AccBlockedIcon } from '../../../common/FontIcons'

const AccountBlockedDialogComponent = (props) => {

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef)

    function onClickSubmit() {
        props.openUnblockAccDialogCB && props.openUnblockAccDialogCB()
    }

    return (
        <div className="app-modalDialog account-blocked-dialog">
            <div className="window" ref={modalRef}>
                <div className="content">
                    <AccBlockedIcon />
                    <div className="errorMsg"><LangText  name="ACCOUNT_BLOCKED" /> </div>
                    <div className="message"> {props.message ? props.message : ''} </div>
                </div>

                <div className="footer">
                    <button className="negativeBtn" onClick={props.onCloseCB}>
                        <LangText module="BUTTONS" name="CANCEL" /></button>
                    <button className="left-btn positiveBtn" onClick={onClickSubmit}>
                        <LangText  name="UNBLOCK" /></button>
                </div>
            </div>
        </div>
    )
}

export default AccountBlockedDialogComponent;