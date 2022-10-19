import React, { useRef } from 'react'
import LangText from '../../../../../common/lang/LangText';
import useCloseModal from '../../../../../customHooksComponents/useCloseModal';

// import { CloseIcon } from '../../../common/FontIcons';

const EmptyWatchGroupDialog = (props) => {

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef)

    return (
        <div className="orderDialogBase selectWatchGroup-dialog">
            <div className="window-empty" ref={modalRef}>
                <div className="title">
                    <span className="title-name">
                        <LangText module="QUOTE" name="EMPTY_WATCHLIST_GROUP" />
                    </span>
                </div>
                <div className="content scrollArea scroller_firefox">
                    <span className="empty-info">
                        <LangText module="MESSAGES" name="EMPTY_WATCHLIST_INFO" />
                    </span>
                </div>
                <div className="footer flex-center">
                    <button className="positiveBtn" onClick={props.onCloseCB}>
                        <LangText module="BUTTONS" name="OK" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EmptyWatchGroupDialog;