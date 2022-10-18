import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'

import LangText from '../../../../common/lang/LangText'
import useCloseModal from '../../../../customHooksComponents/useCloseModal'

import { storeAvailLoanDialogDetails } from '../../../../state/actions/Actions'

import { LAS_MENU_ARRAY, LOAN_STATUS_LAS_MENU } from '../../../../common/Constants'
import { CloseIcon, Tracker_icon } from '../../../common/FontIcons'

function StageInfoDialogComponent(props) {

    const [selectedMenu, setSelectedMenu] = useState({})
    const [menuList, setMenuList] = useState([])

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose, false)

    useEffect(() => {
        let lasList = Object.assign([], LAS_MENU_ARRAY)
        lasList.unshift(LOAN_STATUS_LAS_MENU)
        lasList = lasList.filter(item => !item.isPreStage)
        setMenuList(lasList)

    }, [])

    useEffect(() => {
        if (props.stage) {
            let reqIndex = LAS_MENU_ARRAY.findIndex(item => item.stageName.includes(props.stage.userStage))
            if (reqIndex !== -1)
                setSelectedMenu(LAS_MENU_ARRAY[reqIndex])
            else
                setSelectedMenu(LAS_MENU_ARRAY[0])

        } else
            setSelectedMenu(LAS_MENU_ARRAY[0])
    }, [props.stage])

    function onClose() {
        props.storeAvailLoanDialogDetails({
            dialogName: null
        })
    }

    return (
        <div className="app-modalDialog2 stageInfo-dialog">
            <div className="window" ref={modalRef}>
                <div className="header">
                    <div className="closeBtn-div">
                        <CloseIcon onClick={onClose} />
                    </div>
                    <div className="heading head-row">
                        <span className="trackerIcon-div tracker">
                            <Tracker_icon />
                        </span>
                        <span className="stage"><LangText name="LOAN_TRACKER" module="LAS" /></span>
                    </div>
                </div>
                <div className="content">
                    <div className="trackerIcon-div">
                        {
                            menuList && menuList.map((item, index) => {
                                return (
                                    <div key={index}
                                        className={`
                                        ${selectedMenu.stageIndex === item.stageIndex ?
                                        "selected" : ""}
                                        ${selectedMenu.stageIndex > item.stageIndex ?
                                        "fill" : "unfill"} icon-div`}
                                    >

                                    </div>
                                )
                            })
                        }

                    </div>
                    <div className="stage">
                        {
                            menuList && menuList.map((item, index) => {
                                return (
                                    <div className={`row ${selectedMenu.stageIndex === item.stageIndex ?
                                        "selected" : ""}
                                    ${selectedMenu.stageIndex >= item.stageIndex ? "fill" : "unfill"}
                                    `}
                                    key={index}
                                    >
                                        <LangText module="LAS" name={item.langKey} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ las }) => {
    return {
        stage: las.stage
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StageInfoDialogComponent);