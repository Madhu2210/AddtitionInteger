import React, { useState, useRef, useEffect } from 'react'

import DatePickerComponent from './DatePickerComponent'
import useCloseModal from '../../../customHooksComponents/useCloseModal';

import LangText from '../../../common/lang/LangText'
import { DATE_FORMATS, SCREENS } from '../../../common/Constants'
import { getFormatedDate, convertToUpperCase } from '../../../common/CommonMethods'
import { DatePickerIcon } from '../../common/FontIcons'

const DateRangePickerComponent = (props) => {

    const [activeSubMenu, setActiveSubMenu] = useState("Start")
    const [startDate, setStartDate] = useState("")
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [showDate, setShowDate] = useState(false)

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose)

    useEffect(()=> {
        if(props.showCustom) {
            setShowDate(true)
            setFromDate(getStringDate(props.startDate))
            setToDate(getStringDate(props.toDate))
            setStartDate(props.startDate)
            setEndDate(props.toDate)
        }
    },[props.showCustom])

    function onClose() {
        // props.onCloseCB && props.onCloseCB()
        setShowDate(false)
    }

    function onClickOk() {
        props.parentCB && props.parentCB({ startDate, endDate })
        setShowDate(false)
    }

    function onChangeDate(date) {
        // console.log('date', date, date.target)
        let value = date.target.value
        if (date.target.name === "start") {
            // if (new Date(value) > new Date(endDate)) {
            //     setEndDate("")
            //     setToDate("")

            // }
            setStartDate(value)
            setFromDate(getStringDate(value))
        }
        else if (date.target.name === 'end') {
            setEndDate(value)
            setToDate(getStringDate(value))
        }
    }

    function getStringDate(date) {
        let strDate = getFormatedDate(date, 0, DATE_FORMATS.DDMMMYYYY, true)
        let dateArr = strDate.stringDate.split(" ")
        strDate = { dd: dateArr[0], mm: dateArr[1], yy: dateArr[2] }
        return strDate
    }

    function onClickDate() {
        props.closePopupCB && props.closePopupCB()
        if (props.showCalenderCustom) {
            if (!props.showCalenderCustom) {
                setShowDate(true)
            }
            else {
                setShowDate(false)
            }
        }
        else if (!showDate) {
            setShowDate(true)
            setActiveSubMenu("Start")
            let sDate = props.startDate
            let eDate = props.toDate
            if (sDate) {
                setStartDate(sDate)
                setFromDate(getStringDate(sDate))
            }
            else {
                setStartDate("")
                setFromDate("")
            }
            if (eDate) {
                setEndDate(eDate)
                setToDate(getStringDate(eDate))
            }
            else {
                setEndDate("")
                setToDate("")
            }
        } else
            setShowDate(false)
    }

    let from = props.startDate ? getFormatedDate(props.startDate, 0, DATE_FORMATS.DDMMMYYYY, true).stringDate : ""
    let to = getFormatedDate(props.toDate, 0, DATE_FORMATS.DDMMMYYYY, true).stringDate

    // console.log(props.startDate,props.toDate)
    return (
        <div className="trade-date multiDatePicker-base">
            <div className="date" onClick={() => onClickDate()} >
                <DatePickerIcon className="date-icon" />
                {
                    (props.startDate && from === to) ?
                        (props.parent && props.parent === SCREENS.REPORTS) ?
                            <>
                                <span style={{ paddingRight: "3px" }}> {from}
                                </span> - <span className="to-date" style={{ paddingLeft: "4px" }}>{to}</span>
                            </>
                            :
                            (props.parent && props.parent === SCREENS.ALERTS) ?
                                <><span style={{ paddingRight: "3px" }}> {from}
                                </span> - <span className="to-date" style={{ paddingLeft: "4px" }}>{to}</span></>
                                :
                                <span>{from}</span>
                        :
                        <>
                            <span style={{ paddingRight: "3px" }}> {from}
                            </span> - <span className="to-date" style={{ paddingLeft: "4px" }}>{to}</span>
                        </>
                }
            </div>
            {showDate ?
                <div className="trade-book-date" ref={modalRef}>
                    <div className="window">
                        <div className="title flex-center">
                            <div className={activeSubMenu === "Start" ? "date-tab active" : "date-tab"} >
                                {(props.parent && props.parent === SCREENS.REPORTS) ?
                                    <>
                                        {fromDate ?
                                            <div className="tab-container-bo">
                                                <div className="tab-bo">
                                                    <div onClick={() => { setActiveSubMenu("Start") }}>
                                                        <div className="title-bo"><LangText 
                                                            module="DATERANGEPICK" name="START_DATE" /></div>
                                                        <div className="date-align">

                                                            <div className="day"> {fromDate.dd}</div>
                                                            <div className="month">
                                                                <div>{convertToUpperCase(fromDate.mm)}</div>
                                                                <div>{fromDate.yy}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <span className="tab-container">
                                                <span className="title-name"
                                                    onClick={() => { setActiveSubMenu("Start") }}>
                                                    <LangText module="DATERANGEPICK" name="START_DATE" />
                                                </span>
                                            </span>
                                        }
                                    </>
                                    :
                                    <>
                                        {fromDate ?
                                            <div className="tab-container">
                                                <div className="tab">
                                                    <div onClick={() => { setActiveSubMenu("Start") }}>
                                                        <div className="date">
                                                            {fromDate.dd} {fromDate.mm} {fromDate.yy}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <span className="tab-container">
                                                <span className="title-name"
                                                    onClick={() => { setActiveSubMenu("Start") }}>
                                                    <LangText module="DATERANGEPICK" name="FROM" />
                                                </span>
                                                <hr />
                                            </span>
                                        }
                                    </>
                                }
                            </div>
                            {
                                (props.parent && props.parent === SCREENS.REPORTS) ?
                                    <></>
                                    :
                                    <span className="btwLine"></span>
                            }
                            <div className={activeSubMenu === "End" ? "date-tab active" : "date-tab"} >
                                {(props.parent && props.parent === SCREENS.REPORTS) ?
                                    <>
                                        {toDate ?
                                            <div className={`tab-container-bo`}>
                                                <div className="tab-bo">
                                                    <div onClick={() => { setActiveSubMenu("End") }}>
                                                        <div className="title-bo"><LangText 
                                                            module="DATERANGEPICK" name="END_DATE" /></div>
                                                        <div className="date-align">

                                                            <div className="day"> {toDate.dd}</div>
                                                            <div className="month">
                                                                <div>{convertToUpperCase(toDate.mm)}</div>
                                                                <div>{toDate.yy}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <span className={`tab-container`}>
                                                <span className="title-name"
                                                    onClick={() => { setActiveSubMenu("End") }}>
                                                    <LangText 
                                                        module="DATERANGEPICK" name="END_DATE" />
                                                </span>
                                            </span>
                                        }
                                    </>
                                    :
                                    <>
                                        {toDate ?
                                            <div className={`tab-container`}>
                                                <div className="tab">
                                                    <div onClick={() => { setActiveSubMenu("End") }}>
                                                        <div className="date">
                                                            {toDate.dd} {toDate.mm} {toDate.yy}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <span className={`tab-container`}>
                                                <span className="title-name"
                                                    onClick={() => { setActiveSubMenu("End") }}>
                                                    <LangText 
                                                        module="DATERANGEPICK" name="TO" />
                                                </span>
                                                <hr />
                                            </span>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                        <div className="content">
                            {{
                                "Start": <DatePickerComponent
                                    id="start"
                                    key="start"
                                    name="start"
                                    inline={true}
                                    dateFormat="dd-mm-yy"
                                    onChangeDate={onChangeDate}
                                    selectedDate={startDate}
                                    minDate={props.minDate ? props.minDate : null}
                                    maxDate={endDate}
                                    // disabledDays={[0, 6]}
                                    monthNavigator
                                    yearNavigator
                                    yearRange="2001:2099"
                                />,
                                "End": <DatePickerComponent
                                    id="end"
                                    key="end"
                                    name="end"
                                    inline={true}
                                    dateFormat="dd-mm-yy"
                                    onChangeDate={onChangeDate}
                                    selectedDate={endDate}
                                    minDate={props.minDate ? props.minDate : startDate}
                                    maxDate={new Date()}
                                    // disabledDays={[0, 6]} 
                                    monthNavigator
                                    yearNavigator
                                    yearRange="2001:2099"
                                />,
                            }[activeSubMenu]}
                        </div>
                        {
                            (props.parent && props.parent === SCREENS.REPORTS) ?
                                <>
                                    <div className="footer">
                                        <button className="calender-bo-cancel" onClick={onClose}>
                                            <LangText module="BUTTONS" name="CANCEL" />
                                        </button>
                                        <button className="calender-bo-ok" onClick={onClickOk}>
                                            <LangText module="BUTTONS" name="OK" />
                                        </button>
                                    </div>
                                </>
                                :
                                <div className="footer">
                                    <button className="left-btn theme-btn"
                                        onClick={onClickOk}>
                                        <LangText module="BUTTONS" name="DONE" />
                                    </button>
                                </div>
                        }
                    </div>
                </div>
                : ""}
        </div >
    )
}

export default DateRangePickerComponent;