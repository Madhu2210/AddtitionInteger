import React, { useEffect, useRef, useState } from 'react'

import useCloseModal from '../../../../../customHooksComponents/useCloseModal';

import LangText from '../../../../../common/lang/LangText';
import { getEditableWatchgroups } from '../../../../../common/Bridge';
import { DeleteIcon } from '../../../../common/FontIcons';
import { AF_EVENT_NAMES, AF_EVENT_TYPES, TEXT_ORIENTATION } from '../../../../../common/Constants';
import { AF_EventTriggered } from '../../../../../common/CommonMethods';

const DeleteWatchGroupDialogComponent = (props) => {

    const [editableGroups] = useState(getEditableWatchgroups())
    const [selectedDeleteIndex, setSelectedDeleteIndex] = useState(null)

    const deleteBtnRef = useRef(null)
    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose)

    useEffect(() => {
        if (selectedDeleteIndex) {
            deleteBtnRef.current.focus()
            modalRef.current.scrollIntoView()
        }
    }, [selectedDeleteIndex])

    function onClose() {
        props.onCloseCB && props.onCloseCB()
    }

    function onClickDeleteBtn(index) {
        if (index === selectedDeleteIndex)
            setSelectedDeleteIndex(null)
        else
            setSelectedDeleteIndex(index)
    }

    function onDeleteGroup(item) {
        props.onDeleteGroupCB && props.onDeleteGroupCB(item)
        AF_EventTriggered(AF_EVENT_NAMES.WATCHLIST , AF_EVENT_TYPES.DELETE,{"onClick":"deleteEvent"})
    }

    if (editableGroups && editableGroups.length)
        return (
            <div className="deleteWatchlistDropdown scrollArea" ref={modalRef}>
                {
                    editableGroups.map((item, index) => {
                        return (
                            <div key={index}
                                className={`row ${(index == (editableGroups.length - 1)) ? 
                                    'last' : ''} ${selectedDeleteIndex === index ? 'selected' : ''}`}
                            >
                                <div className="dataRow">
                                    <span className="groupName text-nowrap" title={item.wName}>{item.wName}</span>
                                    <DeleteIcon onClick={() => onClickDeleteBtn(index)} />
                                </div>
                                <div className="deleteInfoDiv">
                                    <div className="infoMsg">
                                        <span><LangText module="WATCHLIST"
                                            name="WANT_TO_DELETE" /> 
                                        <span className="deletewNamwe">{item.wName} ?</span></span>
                                        <span><LangText module="WATCHLIST" name="NOT_RECOVER" /></span>
                                    </div>
                                    <div className="btnDiv">
                                        <button className="cancelBtn" onClick={() => setSelectedDeleteIndex(null)}>
                                            <LangText module="BUTTONS"
                                                name="CANCEL" orientation={TEXT_ORIENTATION.LOWERCASE} />
                                        </button>
                                        <button className="deleteBtn"
                                            ref={deleteBtnRef}
                                            onClick={() => onDeleteGroup(item)}
                                        >
                                            <LangText module="BUTTONS" name="DELETE"
                                                orientation={TEXT_ORIENTATION.LOWERCASE} />
                                        </button>
                                    </div>
                                </div>
                                {
                                    selectedDeleteIndex !== null ?
                                        <div className="coverDiv"></div>
                                        : null
                                }
                            </div>
                        )
                    })
                }
            </div >
        )

    return null
}

export default DeleteWatchGroupDialogComponent;