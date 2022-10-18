import React, { useEffect, useRef, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import LangText from '../../../../common/lang/LangText';
import { SORT_DATATYPE, DATE_FORMATS, BO_REPORT_TYPES, SORT_TYPES, 
    AF_EVENT_NAMES, AF_EVENT_TYPES, TRADESUMMARY_DIALOGS } from '../../../../common/Constants';
import {
    isSellTradeAction, checkEmpty, isBuyTradeAction,
    getBackOfficeBaseURL, getFormatedDate, sortFlagFunc, sortByDateBO,
    cacheSearch, getDispTradeSymbolName, sortByString, sortByInt, 
    convertCommaSeparated, replaceComma, AF_EventTriggered, checkFloat} from '../../../../common/CommonMethods';

import { DownArrowTradeIcon, EditWatchlistIcon, SortIcon, UpArrowTradeIcon } from '../../../common/FontIcons';
import { BO_REPORT_SERVICE } from '../../../../config/ServiceURLs'

import { WidgetLoader } from '../../../common/WidgetLoaderComponent';
import InputComponent from '../../../common/InputComponent';
import InputAddOnComponents from '../../../common/InputAddOnComponents';
import DatePickerComponent from '../../../common/datePicker/DatePickerComponent';
import { connect } from 'react-redux';
import { storeTradeSummaryDialog, storeTradeSummaryFlag,
    storeTradeSummarykey } from '../../../../state/actions/Actions';
import useCloseModal from '../../../../customHooksComponents/useCloseModal';

function TradeSummaryComponent(props) {

    const MsfFetch = useFetch()
    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef,onClose)

    const [resultArray, setResultArray] = useState([])
    const [tradeSummaryList, setTradeSummaryList] = useState([])
    const [editValue, setEditValue] = useState('')
    const [showInputEdit, setshowInputEdit] = useState(null)
    const [editIndex, setEditindex] = useState(null)
    const [editDateIndex, setEditDateindex] = useState(null)
    const [calenderShow, setCalenderShow] = useState(false)
    const [changeDateFlag, setchangeDateFlag] = useState(false)
    const [changeDateFlagData, setchangeDateFlagData] = useState(null)

    const [sortFlag, setSortFlag] = useState(
        [
            { column: "trdDte", sortAsc: null },
            { column: "sym", sortAsc: null },
            { column: "exc", sortAsc: null },
            { column: "netQty", sortAsc: null },
            { column: "avgPrce", sortAsc: null },
            { column: "netAmt", sortAsc: null },
        ]
    )
    const [sortAsc, setSortAsc] = useState(true)
    const [errorMsg, setErrorMsg] = useState(null)
    const [modifiedDateItem, setmodifiedDateItem] = useState({})

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.TRADE_SUMMARY)
    },[])

    useEffect(() => {
        if (showInputEdit) {
            let inputEle = document.getElementById("editInput_" + showInputEdit)
            if (inputEle)
                inputEle.focus()
        }

    }, [showInputEdit])

    useEffect(() => {
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
    }, [props.frmDte, props.toDte, props.selectedOrderType])

    useEffect(() => {
        getBOReports(props.frmDte, props.toDte)
    }, [props.selectedOrderType, props.boSelectedFilter, props.frmDte, props.toDte])

    useEffect(() => {
        if(props.tradeSummaryFlag){
            let editedPriceArray = Object.assign([], resultArray)
            let params = editedPriceArray.map((item, index) => {
                if (index == editIndex) {
                    item.avgPrce = convertCommaSeparated(replaceComma(editValue))
                    item.netAmt = (item.netQty) * (parseFloat(replaceComma(item.avgPrce)))
                }
            })
            setResultArray(editedPriceArray)
            props.storeTradeSummaryFlag(false)

            console.log("onblur", params)
        }
    },[props.tradeSummaryFlag])
    useEffect(() => {
        if(changeDateFlag){
            if (changeDateFlagData) {

                let val = getFormatedDateCaps(changeDateFlagData.value, 0, DATE_FORMATS.DDMMMYYYY, true).stringDate
                if (val)
                    resultArray[editDateIndex]["modifiedDate"] = val
            }
            setchangeDateFlag(false)
        }
    },[changeDateFlag])
    useEffect(() => {
        resetSortIcons()
        let list = Object.assign([], tradeSummaryList)
        if (props.searchValue) {
            list = list.map(item => {
                item.queryString = getDispTradeSymbolName(item).primaryName + ' ' + item.sym
                item.queryString2 = getDispTradeSymbolName(item).secondaryName + ' ' + item.sym
                return item
            })
            let filteredList = cacheSearch(props.searchValue.trim(), list, "queryString", "queryString2")
            if (filteredList.length === 0)
                setErrorMsg('No Data Available')
            setResultArray(filteredList)
        }
        else {
            setResultArray(list)
        }
    }, [tradeSummaryList, props.searchValue])

    function onClose(){
        setCalenderShow(false)
    }
    function getBOReports(from, to) {
        props.showWidgetLoader();
        setResultArray([])
        setErrorMsg(null)
        let request = new MsfRequest();
        request.addToData({
            "frmDte": getFormatedDate(from, 0, DATE_FORMATS.DDMMYYYY, true).stringDate,
            "toDte": getFormatedDate(to, 0, DATE_FORMATS.DDMMYYYY, true).stringDate
        })
        if (props.selectedOrderType === BO_REPORT_TYPES[0]) {
            MsfFetch.placeRequest(
                getBackOfficeBaseURL() + BO_REPORT_SERVICE.TRADE_SUMMARY_EQUITY,
                request,
                successRespCBGetBOReport,
                errorRespCBGetBOReport
            )
        }
        else {
            MsfFetch.placeRequest(
                getBackOfficeBaseURL() + BO_REPORT_SERVICE.TRADE_SUMMARY_DERIVATIVE,
                request,
                successRespCBGetBOReport,
                errorRespCBGetBOReport
            )
        }
    }

    function successRespCBGetBOReport(response) {
        props.hideWidgetLoader();
        // setResultArray(response.data.report)
        // setTradeSummaryList(response.data.report)
        let responseArray = response.data.report
        responseArray.map((item)=> {
            item['modifiedDate'] = ''
        })
        setResultArray(responseArray)
        setTradeSummaryList(responseArray)
        props.pdfDownloadUrl(response.data.pdfDownloadUrl.url)
        props.xlsxDownloadUrl(response.data.excelDownloadUrl.url)
        setErrorMsg(null)
        props.downloadUrl(true)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD_SUCCESS)

    }

    function errorRespCBGetBOReport(error) {
        props.hideWidgetLoader();
        setErrorMsg(error.message)
        props.pdfDownloadUrl('')
        props.xlsxDownloadUrl('')
        props.downloadUrl(false)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD_FAILURE)

    }

    function onSort(type, key1, sortType) {
        if (type === 'date')
            onSortByDateCB(key1, sortType)
        else if (type === 'string')
            onSortByStringCB(key1, sortType)
        else
            onSortByIntCB(key1, sortType)
    }

    function onIconSort(type, key, sortType) {
        onSort(type, key, sortType)
    }
    function onSortByDateCB(key1, sortType) {

        let ascSort = sortAsc
        if (sortType) {
            if (sortType === SORT_TYPES.ASC) {
                setSortAsc(true)
                ascSort = true
            }
            else {
                setSortAsc(false)
                ascSort = false
            }
        } else
            setSortAsc(!sortAsc)

        let sortedSymList = sortByDateBO(ascSort, resultArray, key1)
        setResultArray(sortedSymList)
        if (resultArray && resultArray.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1)
            setSortFlag(updatedSortFlag)
        }

    }
    function onSortByStringCB(key1, sortType) {
        let ascSort = sortAsc
        if (sortType) {
            if (sortType === SORT_TYPES.ASC) {

                setSortAsc(true)
                ascSort = true
            }
            else {
                setSortAsc(false)
                ascSort = false
            }
        } else
            setSortAsc(!sortAsc)

        let sortedSymList = sortByString(ascSort, resultArray, key1)
        setResultArray(sortedSymList)
        if (resultArray && resultArray.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1)
            setSortFlag(updatedSortFlag)
        }
    }

    function onSortByIntCB(key1, sortType) {
        let ascSort = sortAsc
        if (sortType) {
            if (sortType === SORT_TYPES.ASC) {
                setSortAsc(true)
                ascSort = true
            }
            else {
                setSortAsc(false)
                ascSort = false
            }
        } else
            setSortAsc(!sortAsc)

        let sortedSymList = sortByInt(ascSort, resultArray, key1)
        setResultArray(sortedSymList)
        if (resultArray && resultArray.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1)
            setSortFlag(updatedSortFlag)
        }
    }
    function getSortIconCB(column) {
        let sortFlagArray = Object.assign([], sortFlag)
        let sortOrder = sortFlagArray.filter((item) => item.column === column)
        if (sortOrder.length)
            return sortOrder[0].sortAsc
        return null

    }

    function resetSortIcons() {
        let flags = Object.assign([], sortFlag)
        let updatedFlags = flags.map((item) => {
            item.sortAsc = null
            return item
        })
        setSortFlag(updatedFlags)
    }

    function showEditField(avgPrice, index) {
        setEditValue(avgPrice)
        setshowInputEdit(index)
        setEditindex(index)

    }
    function onChangeEditVal(e) {
        let currVal = e.target.value;
        setEditValue(currVal);
        props.storeTradeSummarykey("Price")
        
    }

    function onBlurEdit(editRowData) {
        setshowInputEdit(null)
        if(editRowData.avgPrce != editValue && editValue && checkFloat(replaceComma(editValue))){
            editTradeSummaryPrice(editRowData,null)
        }
        
        // let editedPriceArray = Object.assign([], resultArray)
        // let params = editedPriceArray.map((item, index) => {
        //     if (index == editIndex) {
        //         item.avgPrce = editValue
        //         item.netAmt = (item.netQty) * (parseFloat(replaceComma(item.avgPrce)))
        //     }
        // })
        // setResultArray(editedPriceArray)
        // console.log("onblur", params)
        // let newOrderValue = editRowData.netQty * editValue
        
    }

    function editTradeSummaryPrice(editRowData,newDateVal) {

        let avgPriceEditval;
        if(newDateVal === null){
            newDateVal = "";
            avgPriceEditval = convertCommaSeparated(replaceComma(editValue))

        }
        else{
            avgPriceEditval = editRowData.avgPrce

        }
        setCalenderShow(false)
        let request = new MsfRequest();
        request.addToData({
            "settNo": editRowData.settNo,
            "isin": editRowData.isin,
            "qty": editRowData.netQty,
            "avgPrce": avgPriceEditval,
            "trdDte": modifiedDateItem.modifiedDate ? modifiedDateItem.modifiedDate : editRowData.trdDte,
            "modified_Date": newDateVal
        })
        //removing modifiedDate for priceEdit
        if(newDateVal === ""){
            let valReq = request.data
            let valReqList = Object.keys(valReq)
                .filter((key) => (key !== "modified_Date"))
                .reduce((obj, key) => {
                    return Object.assign(obj, {
                        [key]: valReq[key]
                    });
                }, {});
            request.data = valReqList
        }
        console.log('requestresNew :', request);
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + BO_REPORT_SERVICE.EDIT_TRADESUMMARY_PRICE,
            request,
            successRespCBGetEdit,
            errorRespCBGetEdit
        )
    
        function successRespCBGetEdit(response) {
            console.log("resNew", response)
            setErrorMsg(null)
            let result = {}
            if (response.infoID == "0") {
                result.msg = response.data.status
                result.isSuccess = true
                props.storeTradeSummaryDialog({
                    tradeSummaryDialogScreen: TRADESUMMARY_DIALOGS.EDIT_CONFIRMATION,
                    tradeSummaryData:result
                })
                setchangeDateFlag(true)
            } else {
                result.msg = response.data.status
                result.isSuccess = false
                props.storeTradeSummaryDialog({
                    tradeSummaryDialogScreen: TRADESUMMARY_DIALOGS.EDIT_CONFIRMATION,
                    tradeSummaryData:result
                })
                setchangeDateFlag(false)
            }
        }

        function errorRespCBGetEdit(error) {
            props.hideWidgetLoader();
            setErrorMsg(error.message)
            console.log('error.message :', error);
            let result = {}
            result.msg = error.message
            result.isSuccess = false
            props.storeTradeSummaryDialog({
                tradeSummaryDialogScreen: TRADESUMMARY_DIALOGS.EDIT_CONFIRMATION,
                tradeSummaryData:result
            })
            setchangeDateFlag(false)
        }
    }

    function calenderCB(ind,itemVal) {
        setCalenderShow(true)
        setEditDateindex(ind)
        setmodifiedDateItem(itemVal)
    }

    function onChangeDate(date) {
        let newDate = getFormatedDateCaps(date.value, 0, DATE_FORMATS.DDMMMYYYY, true).stringDate;
        // let modifiedDateItemNewVal = modifiedDateItem
        // modifiedDateItemNewVal.modifiedDate = newDate
        // if(modifiedDateItem.trdDte != newDate && modifiedDateItem.modifiedDate != newDate){
        if(!modifiedDateItem.modifiedDate){
            if(modifiedDateItem.trdDte != newDate){

                setchangeDateFlagData(date)
                props.storeTradeSummarykey("Date")

                editTradeSummaryPrice(modifiedDateItem,newDate)
            }
        }
        else if(modifiedDateItem.modifiedDate){
            if(modifiedDateItem.trdDte != newDate && modifiedDateItem.modifiedDate != newDate){
                setchangeDateFlagData(date)
                props.storeTradeSummarykey("Date")

                editTradeSummaryPrice(modifiedDateItem,newDate)
            }

        }
        // }

    }

    function getYearRange_DOB() {
        let currentYear = new Date().getFullYear()
        let startYear = currentYear - 200
        let endYear = currentYear + 1

        return startYear + ":" + endYear
    }
    function getValidStringDate(date) {
        let validDate = ''
        if (date) {
            let dateArr = date.split("-")
            validDate = dateArr[1] + "/" + dateArr[0] + "/" + dateArr[2]
        }
        return validDate
    }
    function getFormatedDateCaps(date, addDay, format, validGivenDate) {
        let givenDate = '';
        if (date === "")
            givenDate = new Date();
        else {
            let validDate = ''
            if (!validGivenDate)
                validDate = getValidStringDate(date)
            else
                validDate = date
            givenDate = new Date(validDate)
        }
    
        if (addDay !== 0) {
            let holeDate = givenDate.setDate(givenDate.getDate() + (addDay))
            givenDate = new Date(holeDate)
        }
    
        let dd = givenDate.getDate();
        let mm = givenDate.getMonth();
        let yyyy = givenDate.getFullYear();
        let mmm = givenDate.toLocaleString('default', { month: 'short' });
    
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
    
        let formatedDate = givenDate;
    
        mm = parseInt(mm) + 1;
        if (mm < 10) mm = '0' + mm;
    
        let stringDate = "";
       
        stringDate = dd + " " + mmm.toUpperCase() + " " + yyyy
    
        return { formatedDate, stringDate }
    }

    return (
        <div className="bo-baseTable">
            <table className="bo-table">
                {
                    (resultArray && resultArray.length) ?
                        <thead className="thead-scroller">
                            <tr>
                                <th className="firstChild width20">
                                    <span className="cursor"
                                        onClick={() => onSort(SORT_DATATYPE.DATE, 'trdDte')}
                                    >
                                        <LangText module="TABLE_HEADERS" name="DATE" />
                                    </span>
                                    <SortIcon colName="trdDte"
                                        getSortIcon={getSortIconCB}
                                        type={SORT_DATATYPE.DATE}
                                        onIconSort={onIconSort} />
                                </th>
                                <th className="trade-sym-head width18">
                                    <span className="cursor"
                                        onClick={() => onSort(SORT_DATATYPE.STRING, 'sym')}
                                    >
                                        <LangText module="TABLE_HEADERS" name="SYMBOL" />
                                    </span>
                                    <SortIcon colName="sym"
                                        getSortIcon={getSortIconCB}
                                        type={SORT_DATATYPE.STRING}
                                        onIconSort={onIconSort} />
                                </th>
                                <th>
                                    <span className="cursor"
                                        onClick={() => onSort(SORT_DATATYPE.STRING, 'exc')}
                                    >
                                        <LangText module="TABLE_HEADERS" name="EXCHANGE" />
                                    </span>
                                    <SortIcon colName="exc"
                                        getSortIcon={getSortIconCB}
                                        type={SORT_DATATYPE.STRING}
                                        onIconSort={onIconSort} />
                                </th>
                                <th>
                                    <span className="cursor"
                                        onClick={() => onSort(SORT_DATATYPE.INT, 'netQty')}
                                    >
                                        <LangText module="TABLE_HEADERS" name="QTY" />
                                    </span>
                                    <SortIcon colName="netQty"
                                        getSortIcon={getSortIconCB}
                                        type={SORT_DATATYPE.INT}
                                        onIconSort={onIconSort} />
                                </th>
                                <th>
                                    <span className="cursor"
                                        onClick={() => onSort(SORT_DATATYPE.INT, 'avgPrce')}
                                    >
                                        <LangText module="TABLE_HEADERS" name="PRICE" />
                                    </span>
                                    <SortIcon colName="avgPrce"
                                        getSortIcon={getSortIconCB}
                                        type={SORT_DATATYPE.INT}
                                        onIconSort={onIconSort} />
                                </th>
                                <th>
                                    <span className="cursor"
                                        onClick={() => onSort(SORT_DATATYPE.INT, 'netAmt')}
                                    >
                                        <LangText module="TABLE_HEADERS" name="ORDER_VALUE" />
                                    </span>
                                    <SortIcon colName="netAmt"
                                        getSortIcon={getSortIconCB}
                                        type={SORT_DATATYPE.INT}
                                        onIconSort={onIconSort} />
                                </th>
                            </tr>
                        </thead> :
                        <tr className="errorRow">
                            <td className="colspan"> {errorMsg}</td>
                        </tr>
                }
                <tbody className="tbody-scroller">
                    {
                        (resultArray && resultArray.length) ?
                            resultArray.map((item, index) => {
                                return (
                                    <>
                                        <tr key={index}>
                                            <td className="firstChild width20">
                                                {/* <span>{checkEmpty(item.trdDte)}</span> */} 
                                                <span>{item.modifiedDate ? item.modifiedDate : 
                                                    checkEmpty(item.trdDte)}</span> 
                                                
                                                <span className="icon-unset">
                                                    {props.selectedOrderType === BO_REPORT_TYPES[0] &&
                                                        item.isEditable == true ?
                                                        
                                                        <>
                                                            <InputAddOnComponents.DOBInputAddOn 
                                                                className="right cursor modifyDateNew"
                                                                onClick={() => calenderCB(index,item)} /> 
                                                            {editDateIndex === index ?
                                                                <div className="tooltip-div datePickerTooltip">
                                                                    <div className={`tooltip-container top topRight 
                                                                ${calenderShow ? "show" : "hide"}`} ref={modalRef}>
                                                                        <DatePickerComponent
                                                                            onChangeDate={onChangeDate}
                                                                            selectedDate={item.modifiedDate?
                                                                                new Date(item.modifiedDate):
                                                                                new Date(item.trdDte)}
                                                                            inline={true}
                                                                            monthNavigator={true}
                                                                            // minDate={props.frmDte}
                                                                            // maxDate={props.toDte}
                                                                            yearNavigator={true}
                                                                            yearRange={getYearRange_DOB()}
                                                                        />
                                                                    
                                                                    </div></div> : null}</> : null}
                                                    
                                                </span> 
                                            </td>
                                            <td className="trade-sym width18">
                                                <span className="trade-symbol">{checkEmpty(item.sym)}</span>
                                                <span className={`action ${isBuyTradeAction(item.action) ?
                                                    "buy-clr" : isSellTradeAction(item.action) ?
                                                        "sell-clr" : "text-color"}`}>

                                                    {checkEmpty(item.action)}</span>
                                                {props.selectedOrderType === BO_REPORT_TYPES[0] &&
                                                    item.isEditable === true ? item.function === "in" ?
                                                        <span className="arrow-tradeicon">
                                                            <UpArrowTradeIcon />
                                                        </span>
                                                        : <span className="arrow-tradeicon" >
                                                            <DownArrowTradeIcon />
                                                        </span> : ""}
                                            </td>
                                            <td>
                                                <span className="trade-exc-values">{checkEmpty(item.exc)}</span>
                                            </td>
                                            <td>
                                                <span className="trade-td-values">{checkEmpty(item.netQty)}</span>
                                            </td>
                                            <td>
                                                <span className="trade-td-edit">{showInputEdit === index ? null :
                                                    convertCommaSeparated(replaceComma(checkEmpty(item.avgPrce)))}
                                                {props.selectedOrderType === BO_REPORT_TYPES[0] &&
                                                        item.isEditable == true ?
                                                    <span className="edit-trade">
                                                        {showInputEdit !== index ? <EditWatchlistIcon
                                                            onClick={() => showEditField(item.avgPrce, index)}
                                                            className="edit-price" /> : ""}
                                                        {showInputEdit === index ?
                                                            <InputComponent
                                                                className="editInput"
                                                                id={"editInput_" + index}
                                                                onChange={onChangeEditVal}
                                                                value={editValue}
                                                                autoComplete="off"
                                                                autoFocus = "true"
                                                                onBlur={() => onBlurEdit(item)}
                                                                maxLength={10}
                                                            />
                                                            : null
                                                        }</span>

                                                    : ""}

                                                </span>
                                            </td>
                                            <td>
                                                <span className="trade-td-values">
                                                    {showInputEdit === index ?
                                                        checkEmpty((item.netQty)
                                                            * (parseFloat(replaceComma(item.avgPrce)))) :
                                                        checkEmpty(convertCommaSeparated(replaceComma(item.netAmt)))}
                                                </span>
                                            </td>
                                        </tr>
                                    </>

                                )
                            })
                            :
                            // <tr className="errorRow">
                            //     <td className="colspan"> {errorMsg}</td>
                            // </tr>
                            null
                    }
                </tbody>
            </table>
        </div >
    )
}

const mapStateToProps = ({bo}) => {
    return {
        tradeSummaryDialogComp: bo.tradeSummaryDialogComp,
        tradeSummaryFlag: bo.tradeSummaryFlag,
        tradeSummarykey: bo.tradeSummarykey
    }
    
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeTradeSummaryDialog: (s) => { dispatch(storeTradeSummaryDialog(s)) },
        storeTradeSummaryFlag: (s) => { dispatch(storeTradeSummaryFlag(s)) },
        storeTradeSummarykey: (s) => { dispatch(storeTradeSummarykey(s)) }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(WidgetLoader(TradeSummaryComponent));
