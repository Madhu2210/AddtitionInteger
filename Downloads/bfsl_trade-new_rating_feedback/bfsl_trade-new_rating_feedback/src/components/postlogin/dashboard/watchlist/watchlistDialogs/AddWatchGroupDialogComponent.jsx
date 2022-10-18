import React, { useRef, useEffect, useState } from 'react'
import { connect } from 'react-redux';

import Input from '../../../../common/InputComponent'
import LangText, { getLangText } from '../../../../../common/lang/LangText';

import useCloseModal from '../../../../../customHooksComponents/useCloseModal';

// import { checkValidWatchlistName, convertToLowerCase, isValidWatchGroupName } from '../../../../../common/CommonMethods'
// import { TEXT_ORIENTATION } from '../../../../../common/Constants';
import { AF_EventTriggered, checkValidWatchlistName, convertToLowerCase, 
    isValidWatchGroupName } from '../../../../../common/CommonMethods'
// import { WATCHLIST_MSG } from '../../../../../common/Messages'
import { AF_EVENT_NAMES, AF_EVENT_TYPES, TEXT_ORIENTATION } from '../../../../../common/Constants';

const AddWatchGroupDialogComponent = (props) => {

    const watchlistRef = useRef(null)
    const [watchListName, setWatchListName] = useState('')
    const [enableSave, setEnableSave] = useState(false)
    const [errorMsg, setErrorMsg] = useState(false)

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose)

    useEffect(() => {
        watchlistRef.current.focus()
    }, [])

    function onClickSave() {
        let isValidString = checkValidWatchlistName(watchListName)
        if (isValidString) {
            let availableWatchlist = Object.assign([], props.watchGroups)
            let wExist = availableWatchlist.findIndex((item)=> {
                return convertToLowerCase(item.wName) === convertToLowerCase(watchListName)
            })
            if (wExist === -1)
                props.createCB && props.createCB(watchListName.trim())
            else
                setErrorMsg(getLangText('WATCHLIST_EXIST'))
        }
        else
            setErrorMsg(getLangText("WATCHLIST_MSG_INVALID_WATCHLIST_NAME"))
        AF_EventTriggered(AF_EVENT_NAMES.WATCHLIST , AF_EVENT_TYPES.WATCHLIST_ATTEMPTS,{"onClick":"saveEvent"})
    }

    function onChangeName(e) {
        setErrorMsg('')
        if (isValidWatchGroupName(e.target.value)) {
            setWatchListName(e.target.value)
            if (e.target.value.trim().length) {
                setEnableSave(true)
            } else {
                setEnableSave(false)
            }
        }
    }

    function onKeyDownInput(e) {
        if (e.key === 'Enter') {
            if (e.target.value.trim().length)
                onClickSave()
        }
    }

    function onClose() {
        props.onCloseCB && props.onCloseCB()
    }

    return (
        <div className="addWatchlistDialog" ref={modalRef}>
            <div className="content">
                <div className="watchList-name-div">
                    <div className="input-div">
                        <Input
                            className="inputVal watchList-name-input"
                            ref={watchlistRef}
                            value={watchListName}
                            onChange={onChangeName}
                            onKeyPress={onKeyDownInput}
                            maxLength={15}
                        />
                    </div>
                    <div className="infoMsg">
                        <LangText module="WATCHLIST" name="WATCHGROUP_MAX_LENGTH" />
                    </div>
                </div>
                <div className="addGroupInfoMsg">
                    <LangText module="MESSAGES" name="ADD_GROUP_INFO_MSG" />
                </div>
                <div className="errorDiv add-watchlist">
                    {errorMsg}
                </div>
            </div>
            <div className="footer">
                <button className="negativeBtn" onClick={props.onCloseCB}>
                    <LangText module="BUTTONS" name="CANCEL" orientation={TEXT_ORIENTATION.LOWERCASE} />
                </button>
                <button className="positiveBtn"
                    onClick={onClickSave}
                    disabled={!enableSave}
                >
                    <LangText module="BUTTONS" name="CREATE" />
                </button>
            </div>
        </div>
    )
}

const mapStateToProps = ({ watchlist }) => {
    return {
        watchGroups: watchlist.watchGroups,
    }
}
export default connect(mapStateToProps, null)(AddWatchGroupDialogComponent);