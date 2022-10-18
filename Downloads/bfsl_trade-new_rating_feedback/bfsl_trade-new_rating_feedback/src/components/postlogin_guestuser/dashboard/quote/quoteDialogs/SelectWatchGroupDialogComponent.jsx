import React, { useRef, useState, useEffect } from 'react'
import { connect } from "react-redux";
import { TEXT_ORIENTATION, THEMES } from '../../../../../common/Constants';
import LangText from '../../../../../common/lang/LangText';
import useCloseModal from '../../../../../customHooksComponents/useCloseModal';

import { storeSelectedWatchGroupResp } from '../../../../../state/actions/Actions';

// import { CloseIcon } from '../../../common/FontIcons';

const SelectWatchGroupDialog = (props) => {

    const { watchGroups } = props

    const [selectedWatchGroup, setSelectedWatchGroup] = useState({})

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef)

    useEffect(() => {
        if (watchGroups && watchGroups.length)
            setSelectedWatchGroup(watchGroups[0])
    }, [watchGroups])

    function onClickSave() {
        props.parentCB && props.parentCB(selectedWatchGroup);

        let wObj = Object.assign({}, props.selectedWatchgroupResp)
        wObj[selectedWatchGroup.wName] = null
        props.storeSelectedWatchGroupResp(wObj)
    }

    return (
        <div className="orderDialogBase selectWatchGroup-dialog">
            <div className="window" ref={modalRef}>
                <div className="title">
                    <span className="title-name">
                        <LangText module="QUOTE" name="SELECT_WATCHGROUP" />
                    </span>
                </div>
                <div className="content scrollArea scroller_firefox">
                    {
                        watchGroups.map((item, index) => {
                            return (
                                <div className={`watchGroup_row cursor 
                                
                                ${(index === watchGroups.length - 1) ? 'last' : ''}`} key={index}
                                onClick={() => setSelectedWatchGroup(item)}
                                >
                                    {
                                        item.wId === selectedWatchGroup.wId ?
                                            <img src={props.selectedTheme.theme === 
                                                THEMES.LIGHT ? "assets/images/radio_unchecked_blue.svg"
                                                : "assets/images/radio_checked_green.svg"} alt="" />
                                            :
                                            <img src={props.selectedTheme.theme ===
                                                 THEMES.LIGHT ? 
                                                "assets/images/radio_checked_blue.svg" : 
                                                "assets/images/radio_unchecked_green.svg"} alt="" />
                                    }
                                    <span className="watchListNames">{item.wName}</span>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="footer flex-center">
                    <button className="negativeBtn" onClick={props.onCloseCB}>
                        <LangText module="BUTTONS" name="CANCEL" orientation={TEXT_ORIENTATION.LOWERCASE} />
                    </button>
                    <button className="left-btn positiveBtn"
                        onClick={onClickSave}
                    >
                        <LangText module="BUTTONS" name="SAVE" orientation={TEXT_ORIENTATION.LOWERCASE} />
                    </button>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ watchlist }) => {
    return {
        selectedWatchgroupResp: watchlist.selectedWatchgroupResp
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeSelectedWatchGroupResp: (s) => { dispatch(storeSelectedWatchGroupResp(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectWatchGroupDialog);