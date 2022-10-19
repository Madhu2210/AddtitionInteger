import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import LangText from '../../../common/lang/LangText'
import ConfirmKYCComponent from './ConfirmKYCComponent'
import EAgreementComponent from './EAgreementComponent'
import EMandateComponent from './EMandateComponent'
import EPledgeComponent from './EPledgeComponent'
import LoanDetailsComponent from './LoanDetailsComponent'
// import TermsandConditionsComponent from './TermsandConditionsComponent'

import {
    storeShowKYCTerms, storeIsUserAcceptedKYC, storeAvailLoanDialogDetails,
    storeLoanInit
} from '../../../state/actions/Actions';

import { AF_EVENT_NAMES, AF_EVENT_TYPES, LAS_LOAN_DIALOGS, LAS_MENUS, LAS_MENU_ARRAY, LOAN_STATUS_LAS_MENU } 
from '../../../common/Constants'
import LoanAgainstSecuritiComponent from './LoanAgainstSecuritiComponent'
import { AF_EventTriggered } from '../../../common/CommonMethods'

function LASBaseComponent(props) {

    const [selectedMenu, setSelectedMenu] = useState({})
    const [menuList, setMenuList] = useState([])

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.LAS , AF_EVENT_TYPES.LAS_MENU)

    }, [])

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

    // window.addEventListener('message', function (eve) {
    //     if (eve && eve.data) {
    //         let messageData = eve.data.toString()
    //         let isLASTerms = messageData.includes("LASTerms");
    //         if (isLASTerms) {
    //             let dataObj = JSON.parse(eve.data)
    //             props.storeShowKYCTerms(false)
    //             if (dataObj && dataObj.data && dataObj.data.click === "positive") {
    //                 props.storeIsUserAcceptedKYC(true)
    //             }
    //         }
    //     }
    // })

    function onClickStageInfo() {
        props.storeAvailLoanDialogDetails({
            dialogName: LAS_LOAN_DIALOGS.STAGE_INFO
        })
    }

    return (
        <div className="las-base">
            <div className="las-data-base">
                <div className="head-name">
                    <div className="heading">
                        {
                            selectedMenu.name == LAS_MENUS.LOAN_AGAINST_SECURITI ?
                                <LangText name="LOAN_AGAINST_SECURITI" module="LAS" /> :
                                selectedMenu.name == LAS_MENUS.CONFIRM_KYC ?
                                    <LangText name="CONFIRM_KYC" module="LAS" /> :

                                    selectedMenu.name == LAS_MENUS.LOAN_DETAILS ?
                                        < LangText name="LOAN_DETAILS" module="LAS" /> :
                                        selectedMenu.name == LAS_MENUS.E_AGREEMENT ?
                                            < LangText name="E_AGREEMENT" module="LAS" /> :
                                            selectedMenu.name == LAS_MENUS.E_MANDATE ?
                                                < LangText name="E_MANDATE" module="LAS" /> :

                                                < LangText name="E_PLEDGE" module="LAS" />

                        }
                    </div>
                    { selectedMenu.name !== LAS_MENUS.LOAN_AGAINST_SECURITI ?
                        <div className="stageInfo-circle-div" onClick={onClickStageInfo}>
                            <div className="stage-indicator">
                                {(selectedMenu.stageIndex)}/{menuList.length}
                            </div>
                            <div id="circle">
                                {
                                    menuList && menuList.map((item, index) => {
                                        return <div key={index}
                                            className={`segment ${selectedMenu.stageIndex >= item.stageIndex ?
                                                "fill" : "unfill"}`}
                                        >
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        : null
                    }
                </div>

                {/* <div className="las-header">
                            {
                                LAS_MENU_ARRAY.map((item, index) => {
                                    return (
                                        <div key={index}
                                            className={`menu ${selectedMenu.name === item.name ? 'active' : ''}`}
                                            onClick={() => setSelectedMenu(item)}
                                        >
                                            <LangText name={item.langKey} module="LAS" />
                                        </div>
                                    )
                                })
                            }

                        </div> */}

                <div className={`${(selectedMenu.name === LAS_MENUS.E_AGREEMENT ||
                            selectedMenu.name === LAS_MENUS.E_MANDATE) ? "" : "las-data"}`}>
                    {
                        getSelectedTable(selectedMenu.name)
                    }
                </div>
        
            </div>
        </div>
    )
}

function getSelectedTable(menu) {
    switch (menu) {
        case LAS_MENUS.LOAN_AGAINST_SECURITI:
            return <LoanAgainstSecuritiComponent />
        case LAS_MENUS.CONFIRM_KYC:
            return <ConfirmKYCComponent />
        case LAS_MENUS.LOAN_DETAILS:
            return <LoanDetailsComponent />
        case LAS_MENUS.E_AGREEMENT:
            return <EAgreementComponent />
        case LAS_MENUS.E_MANDATE:
            return <EMandateComponent />
        case LAS_MENUS.E_PLEDGE:
            return <EPledgeComponent />

        default:
            return null
    }
}

const mapStateToProps = ({ las }) => {
    return {
        stage: las.stage,
        showKYCTerms: las.showKYCTerms
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeShowKYCTerms: (s) => { dispatch(storeShowKYCTerms(s)) },
        storeIsUserAcceptedKYC: (s) => { dispatch(storeIsUserAcceptedKYC(s)) },
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) },
        storeLoanInit: (s) => { dispatch(storeLoanInit(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LASBaseComponent)

