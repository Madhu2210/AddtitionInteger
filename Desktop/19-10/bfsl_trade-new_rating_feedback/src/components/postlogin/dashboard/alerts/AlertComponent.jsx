import React, { useEffect, useState, useRef} from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../../index';

import {
    getAlertBaseUrl, getDays
} from '../../../../common/CommonMethods';
import { ALERTS_DATES_FILTER_MENU, ALERTS_DATE_FILTER, SCREENS, TEXT_ORIENTATION } from '../../../../common/Constants';
import LangText from '../../../../common/lang/LangText';

import DateRangePickerComponent from '../../../common/datePicker/DateRangePickerComponent';
import SelectInputComponent from '../../../common/SelectInputComponent';

import { ALERT_SERVICES } from '../../../../config/ServiceURLs';
import { DeleteIcon } from '../../../common/FontIcons';
import { showAppDialog, storeAlertBtnOpenSearch, storeAlertFlag, storeAlertSearchModify, storeAlertSelectedSym, 
    storeSelectedAppMenu } from '../../../../state/actions/Actions';

import SetAlertDialogComponent from './SetAlertDialogComponent';
import PendingAlertComponent from './PendingAlertComponent';
import TriggerAlertComponent from './TriggerAlertComponent';
import SymbolSearchComponent from '../../header/SymbolSearchComponent';

import useCloseModal from '../../../../customHooksComponents/useCloseModal';

const AlertComponent = (props) => {

    const {modifyAlert} = props

    const MsfFetch = useFetch()

    const [alertDate] = useState(ALERTS_DATE_FILTER)
    const [alertDateFilter] = useState(ALERTS_DATE_FILTER[0])
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [startDateTrigger, setStartDateTrigger] = useState(null)
    const [endDateTrigger, setEndDateTrigger] = useState(null)
    const [showCalenderCustom, setShowCalenderCustom] = useState(false)
    const [showCalenderCustomTrigger, setShowCalenderCustomTrigger] = useState(false)
    //showing modify alert while clicking modify
    const [showModify, setShowModify] = useState(false)
    //modify data from the pending alert
    const [modifyData, setModifyData] = useState([])  
    //while modified render the pending alert
    const [modified, setModified] = useState(false)
    //showing delete alert
    const [showDelete, setShowDelete] = useState('')
    //search in modify and create alert
    const [searchCreate, setSearchCreate] = useState(false)
    //for modifying sending true for api cals in setalert
    const [modifyShow, setModifyShow] = useState(false)
    // for search display btn click
    const [showSearch, setShowSearch] = useState(false)
    // for success delete
    const [showDeletePopup, SetShowDeletePopup] = useState(false)
    // showing create btn
    const [showCreate, SetShowCreate] = useState(true)
    const [showCustomPending, setShowCustomPending] = useState(false)
    const [showCustomTrigger, setShowCustomTrigger] = useState(false)

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef,onClose)

    useEffect(() => {
        getInitialDates()
    }, [])

    //while clicking search in modify or create
    useEffect(() => {
        if(modifyAlert.searchModify){
            setShowModify(true)
            setSearchCreate(true)
            setModifyData(modifyAlert.searchModify)
        }
        // setModified(false)
        // setModifyShow(false)
    }, [modifyAlert])

    useEffect(() => {
        if(modifyAlert.alertBtnOpen) {
            SetShowCreate(false)
            setShowSearch(true) 
            props.storeAlertBtnOpenSearch(false)
        }
    },[modifyAlert.alertBtnOpen])

    function onSelectItem(item) {
        let start = getDays(item).firstDay
        let end = getDays(item).lastDay
        setStartDate(start)
        setEndDate(end)
        calenderShow(item)
    }

    function onSelectItemTrigger(item) {
        let start = getDays(item).firstDay
        let end = getDays(item).lastDay
        setStartDateTrigger(start)
        setEndDateTrigger(end)
        calenderShowTrigger(item)
    }

    function calenderShow(item) {
        if (item.name === ALERTS_DATES_FILTER_MENU.CUSTOM_DATE) {
            setShowCalenderCustom(false)
            setShowCustomPending(true)
        }
        else {
            setShowCalenderCustom(true)
            setShowCustomPending(false)
        }
    }

    function calenderShowTrigger(item) {
        if (item.name === ALERTS_DATES_FILTER_MENU.CUSTOM_DATE) {
            setShowCalenderCustomTrigger(false)
            setShowCustomTrigger(true)
        }
        else {
            setShowCalenderCustomTrigger(true)
            setShowCustomTrigger(false)
        }
    }

    function getInitialDates() {
        let firstDay = new Date();
        firstDay.setHours(0, 0, 0, 0);
        let lastDay = new Date();
        setStartDate(firstDay)
        setEndDate(lastDay)
        setStartDateTrigger(firstDay)
        setEndDateTrigger(lastDay)
        setShowCalenderCustom(true)
        setShowCalenderCustomTrigger(true)
    }

    function onSelectDate(date) {
        setStartDate(date.startDate)
        setEndDate(date.endDate)
    }

    function onSelectDateTrigger(date) {
        setStartDateTrigger(date.startDate)
        setEndDateTrigger(date.endDate)

    }

    //CB from pending modify
    function modifyOpenCB(modify) {
        setModifyData(modify)
        setShowModify(true)
        setModified(false)
        setModifyShow(true)
    }

    //CB from setalert while cancel
    function setAlertCB() {
        setShowModify(false)
        setModified(true)
        setModifyShow(false)
        setSearchCreate(false)
        setShowSearch(false)
    }

    function deleteOpenCB(deleteCBValue) {
        setModified(false)
        setShowDelete(deleteCBValue)
    }

    function cancelDelete() {
        setShowDelete('')
    }

    function deleteSubmit(deleteGetId) {
        let request = new MsfRequest();
        request.addToData({
            "alertID": deleteGetId.alertID
        })
        request.setEncrypt(false)
        MsfFetch.placeRequest(
            getAlertBaseUrl() + ALERT_SERVICES.DELETE_ALERT,
            request,
            successRespCBDelAlertMsg,
            errorRespCBgetDelAlertMsg
        )
    }

    function successRespCBDelAlertMsg(response) {
        console.log(response)
        setShowDelete('') 
        SetShowDeletePopup(true)
    }

    function errorRespCBgetDelAlertMsg(error) {
        console.log(error)
        props.showAppDialog({
            message: error.message,
            show: true
        })
    }

    function deleteDone() {
        setModified(true)
        SetShowDeletePopup(false) 
    }
    //for create alert in alert window
    function onClickCreate() {
        // let v = props.selectedWatchgroupResp.PredNifty50
        // console.log(v[0])
        // let getSymbol = v[0]
        // let getSym = getSymbol.sym
        // let finalCreate = {...getSymbol,...getSym}
        // console.log(finalCreate)

        // setModifyData(finalCreate)
        // setShowModify(true)
        SetShowCreate(false)
        setModified(false)
        setShowSearch(true)
        // setModifyShow(false)
        // document.getElementById("input-ele").focus();  
    }
    
    function onClose() {
        setShowSearch(false)
        SetShowCreate(true)
        // props.storeAlertSelectedSym(null)
    }

    function searchAlertCB(value) {
        console.log(value)
    }

    return (
        <>
            <div className="alert-base">
                <div className="top-alert">
                    <span className="trigger-label">
                        <LangText name="MY_TRIGGERS" module="ALERT" />
                    </span>
                    {
                        showSearch ?
                            <div className="alert-createSearch"  ref={modalRef}>
                                <SymbolSearchComponent  alertSearch={true} 
                                    createSearch={true} searchAlert={searchAlertCB}/>
                            </div>
                            :
                            null
                    }
                    {
                        showCreate ?
                            <div className="alert-crt-btn">
                                
                                <button className="positiveBtn"
                                    onClick={onClickCreate}
                                >
                                    <LangText module="BUTTONS" name="CREATE_ALERT_BTN" />
                                </button>
                            </div>
                            :
                            null
                    }
                    
                </div>
                <div className="alert-window">
                    <div className="alert-left">
                        <div className="head-left">
                            <div className="head-leftDiv-1">
                                <div className="pending-labelDiv">
                                    <span className="pending-label">
                                        <LangText name="PENDING_ALERTS" module="ALERT" />

                                    </span>
                                </div>
                            </div>
                       
                            <div className="head-leftDiv-2"> 
                                <div className="alert-date-picker">
                                    <DateRangePickerComponent
                                        parentCB={onSelectDate}
                                        startDate={startDate}
                                        parent={SCREENS.ALERTS}
                                        toDate={endDate}
                                        showCustom={showCustomPending}
                                        showCalenderCustom={showCalenderCustom}
                                        maxDate={endDate} />
                                </div>
                                <div className="alert-dropdown">
                                    <SelectInputComponent
                                        optionList={alertDate}
                                        selectedOption={alertDateFilter.name}
                                        onSelectValueCB={onSelectItem}
                                        value="name"
                                        preSelect={true}
                                        hiddenScroll={true}
                                        customDate={true}
                                        iconEnableKey="iconEnable"
                                        hasLangageDependent = {true}
                                    />
                                </div>
                            </div>
                        </div>
                        <>
                            <div className="alert-base-body">
                                <PendingAlertComponent startDate={startDate} endDate={endDate} modifyOpen={modifyOpenCB}
                                    modified={modified} deleteOpen={deleteOpenCB}/>
                            </div>
                        </>
                    </div>
                    <div className="alert-right">
                        <div className="head-right">
                            <div className="head-leftDiv-1">
                                <div className="pending-labelDiv">
                                    <span className="pending-label">
                                        <LangText name="TRIGGERED_ALERTS" module="ALERT"
                                            orientation={TEXT_ORIENTATION.UPPERCASE} />
                                    </span>
                                </div>
                            </div>
                            <div className="head-leftDiv-2">
                                <div className="alert-date-picker">
                                    <DateRangePickerComponent
                                        parentCB={onSelectDateTrigger}
                                        startDate={startDateTrigger}
                                        parent={SCREENS.ALERTS}
                                        toDate={endDateTrigger}
                                        showCustom={showCustomTrigger}
                                        showCalenderCustom={showCalenderCustomTrigger}
                                        maxDate={endDateTrigger} />
                                </div>
                                <div className="alert-dropdown">
                                    <SelectInputComponent
                                        optionList={alertDate}
                                        selectedOption={alertDateFilter.name}
                                        onSelectValueCB={onSelectItemTrigger}
                                        value="name"
                                        preSelect={true}
                                        hiddenScroll={true}
                                        customDate={true}
                                        iconEnableKey="iconEnable"
                                        hasLangageDependent = {true}
                                    />
                                </div>
                            </div>
                        </div>
                        <>
                            <div className="alert-base-body">
                                <TriggerAlertComponent startDateTrigger={startDateTrigger} 
                                    endDateTrigger={endDateTrigger} />
                            </div>
                        </>
                    </div>
                </div>

            </div>
            {
                showModify ?
                    <div className="modify-base">
                        <div className="mod">
                            <SetAlertDialogComponent selectedSym={modifyData} modify={modifyShow} 
                                searchCreate={searchCreate} closeCB={setAlertCB} hideSearch={true}/>
                        </div>
                    </div>
                    :
                    null
            }
            {
                showDelete ?
                    <div className="delete-base">
                        <div className="alert-delete">
                            <div className="alert-delete-div">
                                <div className="alert-delete-head">
                                    <DeleteIcon />
                                    <span className="delete-label">
                                        <LangText name="DELETE_ALERT"
                                            module="ALERT" />
                                    </span>
                                </div>
                                <span className="alert-delete-msg">
                                    <span className="delete-msg"><LangText name="CONFIRM_DELETE"
                                        module="MESSAGES" /> 
                                    <span className="delete-red"> {showDelete.symbol.dispSym} </span> <LangText 
                                        name="ALERT_QUERY"
                                        module="MESSAGES" /> </span>
                                </span>
                                <div className="delete-btn-div">
                                    <button className="cancelbox-alert"
                                        onClick={() =>
                                            cancelDelete()}
                                    >
                                        <LangText
                                            name="CANCEL"
                                            module="BUTTONS"
                                        />
                                    </button>
                                    <button
                                        className="deletebox-alert"
                                        onClick={() =>
                                            deleteSubmit(showDelete)}
                                    >
                                        <LangText name="DELETE"
                                            module="BUTTONS" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    null
            }
            {
                showDeletePopup ?
                    <div className="delete-base">
                        <div className="alert-delete">
                            <div className="alert-delete-divPop">
                                <span className="alert-delete-msg">
                                    <LangText module="ALERT" name="ALERT_DELETE" />
                                </span>
                                <button className="okay-btn" onClick={deleteDone}> <LangText 
                                    module="BUTTONS" name="DONE" /></button>
                            </div>
                        </div>
                    </div>
                    : 
                    null
            }
        </>
    )
}

const mapStateToProps = ({ alerts,watchlist }) => {
    return {
        modifyAlert: alerts,
        selectedWatchgroupResp: watchlist.selectedWatchgroupResp
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAlertFlag: (s) => { dispatch(storeAlertFlag(s)) },
        storeSelectedAppMenu: (s) => { dispatch(storeSelectedAppMenu(s)) },
        storeAlertSelectedSym: (s) => { dispatch(storeAlertSelectedSym(s)) },
        storeAlertSearchModify: (s) => { dispatch(storeAlertSearchModify(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeAlertBtnOpenSearch: (s) => { dispatch(storeAlertBtnOpenSearch(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AlertComponent);