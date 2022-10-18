import React, { useEffect, useRef, useState } from 'react'
import { useFetch, MsfRequest } from '../../../index'

import { WidgetLoader } from '../../common/WidgetLoaderComponent'
import LangText from '../../../common/lang/LangText'

import {
    checkEmpty, convertCommaSeparated, convertToFloat, convertToUpperCase,
    getFormatedDate, getOFSOrderStatusClass, getTradingBaseURL, replaceComma,
    // convertToFloat, findAndReplace,
    // convertCommaSeparated
} from '../../../common/CommonMethods'
import { OFS_SERVICES } from '../../../config/ServiceURLs'
import DateRangePickerComponent from '../../common/datePicker/DateRangePickerComponent'
import { DATE_FORMATS, OFS_DIALOGS, SCREENS } from '../../../common/Constants'
import { InfoIcon, MoreInfoIcon } from '../../common/FontIcons'
// import useCloseModal from '../../../customHooksComponents/useCloseModal'
import { connect } from 'react-redux'
import { storeOFSDialogDetails, storeOFSOrderbookUpdate } from '../../../state/actions/Actions'
// import { OFS_DIALOGS } from '../../../common/Constants'

function OFSOrderbookComponent(props) {

    const MsfFetch = useFetch()

    const [orderbookOFS, setOrderbookOFS] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [showCalenderCustom] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [selectedInfoIndex, setSelectedInfoIndex] = useState(null)

    const isPendingRequest = useRef(false)

    useEffect(() => {
        getInitialDates()
    }, [props.orderBookUpdate])

    useEffect(() => {
        if(startDate && endDate){
            getOrderbookOFS(startDate, endDate)
        }
    }, [startDate, endDate])

    function getOrderbookOFS(from, to) {
        isPendingRequest.current = true
        props.showWidgetLoader()
        setOrderbookOFS([])
        setErrorMsg(null)
        let request = new MsfRequest();
        request.addToData({
            "exc": "NSE",
            "frmDte": getFormatedDate(from, 0, DATE_FORMATS.DDMMYYYY, true).stringDate,
            "toDte": getFormatedDate(to, 0, DATE_FORMATS.DDMMYYYY, true).stringDate
        })
        MsfFetch.placeRequest(
            getTradingBaseURL() + OFS_SERVICES.OFS_ORDERBOOK,
            request,
            successRespCBGetOrderbookOFS,
            errorRespCBGetOrderbookOFS
        )
    }

    function successRespCBGetOrderbookOFS(response) {
        isPendingRequest.current = false
        let list = response.data.orders
        list.map((item) => {
            item.invesAmt = convertCommaSeparated(convertToFloat(replaceComma(item.qty) * replaceComma(item.price)))
            return item
        })
        setOrderbookOFS(list)
        setErrorMsg(null)
        props.hideWidgetLoader()
        props.storeOFSOrderbookUpdate(false)
    }

    function errorRespCBGetOrderbookOFS(error) {
        // console.log('error orderbook :', error);
        isPendingRequest.current = false
        setOrderbookOFS([])
        setErrorMsg(error.message)
        props.hideWidgetLoader()
    }

    function getInitialDates() {
        let date = new Date();
        let first = new Date();
        setStartDate(first)
        setEndDate(date)

    }
    function onSelectDate(date) {
        setSelectedIndex(null)
        setSelectedInfoIndex(null)
        setStartDate(date.startDate)
        setEndDate(date.endDate)

    }

    function onClickRejectionInfo(index) {
        setSelectedIndex(null)
        setSelectedInfoIndex( selectedInfoIndex === index ? null : index)
    }

    function onClickOptions(index) {
        setSelectedInfoIndex(null)
        setSelectedIndex(selectedIndex === index ? null : index)
    }
    function onClickCancelOrder(data) {
        setSelectedIndex(null)
        props.storeOFSDialogDetails({
            name: OFS_DIALOGS.CANCEL_ORDER,
            symData: data
        })
    }

    function onClickRetryOrder(data) {
        setSelectedIndex(null)
        setSelectedInfoIndex(null)
        props.storeOFSDialogDetails({
            name: OFS_DIALOGS.APPLY_ORDER,
            symData: data,
            isRetry:true,
            isModify: false
        })
    }

    function closePopup() {
        setSelectedIndex(null)
        setSelectedInfoIndex(null)
    }

    function onClickModifyOrder(data) {
        setSelectedIndex(null)
        props.storeOFSDialogDetails({
            name: OFS_DIALOGS.MODIFY_ORDER,
            symData: data,
            isModify: data.isModify
        })
    }
    
    return (
        <div className="ofs-content-base">
            <div className="ofs-table open-ofs-table">
                <div className="date">
                    <DateRangePickerComponent
                        closePopupCB={closePopup}
                        parentCB={onSelectDate}
                        startDate={startDate}
                        parent={SCREENS.ALERTS}
                        toDate={endDate}
                        showCalenderCustom={showCalenderCustom}
                        maxDate={new Date()} />
                </div>
                
                <div className="body">
                    {
                        (orderbookOFS && orderbookOFS.length) ?
                            orderbookOFS.map((item, index) => {
                                return (
                                    <div key={index} className="dataRow">
                                        <div className="name">
                                            <span>{checkEmpty(item.dispSym)}</span>
                                            <span className="exchange">{
                                                checkEmpty(item.exchSeg)}</span>
                                        </div>
                                        <div className="data">
                                            <div className="column first">
                                                <span className="label"><LangText name="SYMBOL" module="OFS" /></span>
                                                <span className="value">{
                                                    checkEmpty(item.companyName)}</span>
                                            </div>
                                            <div className="column">
                                                <span className="label"><LangText name="PRICE" module="OFS" /></span>
                                                <span className="value"> ₹ 
                                                    {checkEmpty(item.price)}</span>
                                            </div>
                                            <div className="column">
                                                <span className="label">
                                                    <LangText name="ORDER_QTY" module="OFS" /></span>
                                                <span className="value">
                                                    {checkEmpty(parseInt(replaceComma(item.qty)))}</span>
                                            </div>
                                            <div className="column">
                                                <span className="label"><LangText name="INVESTED_AMOUNT" module="OFS" />
                                                </span>
                                                <span className="value">
                                                    {item.invesAmt ? '₹' : ''}
                                                    {checkEmpty(item.invesAmt)}</span>
                                            </div>
                                            <div className="column">
                                                <span className="label">
                                                    <LangText name="EXCH_ORDERNO" module="OFS" /></span>
                                                <span className="value">{item.ordId}</span>
                                            </div>
                                            <div className="column statusColumn">
                                                <div className="tooltip-div">
                                                    <div className={`tooltip-container reason-tooltip top topRight
                                                ${( selectedInfoIndex === index &&
                                                        item.status === "rejected") ? "show" : "hide"}`}
                                                    >
                                                        {item.rejReason}
                                                        <span className="triangle"></span>
                                                    </div>
                                                </div>
                                                <div className="labelwithvalue">
                                                    <span className="label">
                                                        <LangText name="STATUS" module="OFS" /></span>
                                                    <span className="rejection-and-icon">
                                                        <span className={`value-status
                                                         ${getOFSOrderStatusClass(item.status)}`}>
                                                            {convertToUpperCase(checkEmpty(item.status))}
                                                            {/* MODIFY VALIDATION PENDING */}
                                                        </span>
                                                        <div className="flex-center">{item.status === "rejected" ?
                                                            <InfoIcon className="cursor"
                                                                onClick={() => { onClickRejectionInfo(index) }} /> : ""}
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="tooltip-div options">
                                                <div className={`tooltip-container options-tooltip bottom left 
                                                ${( item.status !== "cancelled" && 
                                                item.status!=="rejected" && 
                                                    index === selectedIndex) ?
                                        "show" : "hide"}`}>
                                                    <div className="options">
                                                        <span className = {`option ${JSON.parse(item.isCancel) ?
                                                            'show':'hide'}`} onClick={()=>onClickCancelOrder(item)}>
                                                            <LangText name="CANCEL" module="BUTTONS" /></span>
                                                        <span className = {`option ${JSON.parse(item.isModify) ?
                                                            'show':'hide'}`} onClick={()=>onClickModifyOrder(item)}>
                                                            <LangText name="MODIFY" module="BUTTONS" /></span>
                                                    </div>
                                                    <span className="triangle"></span>
                                                </div>
                                                <div className={`flex-center ${item.status !== "rejected" ?
                                                    'show':"hide"}`}>
                                                    <MoreInfoIcon className =
                                                        {`cursor ${item.status === "cancelled" ?
                                                            "hide-into-background":""}`}
                                                    onClick={() => { onClickOptions(index) }} /></div>
                                            </div>
                                            <div className="tooltip-div options" >
                                                <div className={`tooltip-container options-tooltip bottom left 
                                                ${( item.status === "rejected" && JSON.parse(item.isRetry) &&
                                                    index === selectedIndex) ?
                                        "show" : "hide"}`}>
                                                    <div className="options">
                                                        <span className="option" 
                                                            onClick={()=>onClickRetryOrder(item)}><LangText 
                                                                name="RETRY" module="OFS" /> </span>
                                                    </div>
                                                    <span className="triangle"></span>
                                                </div>
                                                <div className= 
                                                    {`flex-center ${item.status === "rejected" ? 'show' : 'hide'}`}>
                                                    <MoreInfoIcon className="cursor"
                                                        onClick={() => { onClickOptions(index) }} /></div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            :
                            <div className="errorDiv flex-center">
                                {errorMsg ? errorMsg : !isPendingRequest.current ? 
                                    <LangText name="COMMON_NO_DATA" module="MESSAGES" /> : ''}
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ ofsDetails }) => {
    // console.log('ofsDetails :', ofsDetails);
    return {
        orderBookUpdate: ofsDetails.orderBookUpdate,
        gotoOrderBook: ofsDetails.gotoOrderBook
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeOFSDialogDetails: (s) => { dispatch(storeOFSDialogDetails(s)) },
        storeOFSOrderbookUpdate: (s) => { dispatch(storeOFSOrderbookUpdate(s)) }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(WidgetLoader(OFSOrderbookComponent));

// export default WidgetLoader(OFSOrderbookComponent);