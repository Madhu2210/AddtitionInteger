import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import { useFetch, MsfRequest, withStreaming } from '../../../../index';
import {
    AF_EventTriggered,
    checkEmpty,
    countDecimals, getAlertBaseUrl,
    getColorCode, getCriteriaType, getDispSymbolName, getValidAlertValue, isValidNumber,
    isValidPassword, negativeValueFinder, specialCharFinder
} from '../../../../common/CommonMethods';
import {
    AF_EVENT_NAMES,
    AF_EVENT_TYPES,
    ALERT_SIGN_FILTER, ALERT_SIGN_VOLUME_FILTER, ALERT_STREAM_FILTER,
    ALERT_TYPE_LIST,
    INFO_IDS,
    SCREENS,
    STREAMING_MODULES
} from '../../../../common/Constants';
import LangText, { getLangText } from '../../../../common/lang/LangText';

import { ALERT_SERVICES } from '../../../../config/ServiceURLs';
import { showAppDialog, storeAlertSearchModify, storeAlertSelectedSym,
    storeSelectedAppMenu, storeSelectedDashboardWidget } from '../../../../state/actions/Actions';
import { CheckBoxIcon_Checked, CheckBoxIcon_UnChecked } from '../../../common/FontIcons';

import InputComponent from '../../../common/InputComponent';
import SelectInputComponent from '../../../common/SelectInputComponent';
import { WidgetLoader } from '../../../common/WidgetLoaderComponent';
import { gotoQuote } from '../../../../common/Bridge';

import SymbolSearchComponent from '../../header/SymbolSearchComponent';

const SetAlertDialogComponent = (props) => {

    const MsfFetch = useFetch()

    const [signList, setSignList] = useState(ALERT_SIGN_FILTER)
    const [modifySignList] = useState(ALERT_SIGN_FILTER)
    // const [signListAll] = useState(ALERT_SIGN_FILTER[0])
    const [streamList, setStreamList] = useState(ALERT_STREAM_FILTER)
    const [signListFilter, setSignListFilter] = useState(ALERT_SIGN_FILTER[0])
    const [streamListFilter, setStreamListFilter] = useState(ALERT_STREAM_FILTER[0])
    const [volSignList] = useState(ALERT_SIGN_VOLUME_FILTER)
    const [alertValue, setAlertValue] = useState('')
    const [alertName, setAlertName] = useState('')
    const [currentValue, setCurrentValue] = useState('')
    const [smsAlert, setSmsAlert] = useState(true)
    const [emailAlert, setEmailAlert] = useState(true)
    const [excShow, setExcShow] = useState('')
    const [resultArray, setResultArray] = useState([])
    const [streamingResp, setStreamingResp] = useState({})
    const [alertSearchCB, setAlertCB] = useState(false)
    const [errorMsg,setErrorMsg] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [showValue, setShowValue] = useState(false)
    // const [ setSearchIndex] = useState('')
    // const [currentStream, setCurrentStream] = useState([])

    useEffect(() => {
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.ALERT_USER);
    }, [])

    useEffect(() => {
        // if(!props.modify) {
        if (props.selectedSym && props.selectedSym !== {}) {
            setResultArray({ sym: props.selectedSym })
            let symbols = []
            symbols.push(props.selectedSym)
            props.forceSubscribeLevel1(symbols)
                
        } else {
            props.forceSubscribeLevel1([])
            setResultArray({})
        }
        // }
    }, [props.selectedSym])

    useEffect(() => {
        if (streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    useEffect(() => {
        let selectedList = Object.assign([], volSignList)
        let modifyList = Object.assign([], modifySignList)
        if(streamListFilter.key === 'vol'){
            if(props.modify && !props.searchCreate) {
                let modifySign = getAlertSignVolKey()
                setSignList(selectedList)
                setSignListFilter(ALERT_SIGN_VOLUME_FILTER[modifySign])
            }
            else {
                setSignList(selectedList)
                setSignListFilter(ALERT_SIGN_VOLUME_FILTER[0])   
                setAlertValue('')             
            }
        }
        else {
            if(props.modify && !props.searchCreate) {
                let modifySign = getAlertSignKey()
                setSignList(modifyList)
                setSignListFilter(ALERT_SIGN_FILTER[modifySign])
            }
            else {
                setSignList(modifyList)
                setSignListFilter(signListFilter)
                setAlertValue('')
            }
            
        }
        setErrorMsg('')
        setShowValue(false)
        // setCurrentValue(streamListFilter.value)
    },[streamListFilter])

    useEffect(() => {
        if(alertSearchCB){
            setAlertValue('')
            setAlertName('')
            setCurrentValue('')
            setSmsAlert(true)
            setEmailAlert(true)
        }
    },[alertSearchCB])

    useEffect(() => {
        if(props.modify) {
            notifySet(props.selectedSym.notification_type)
            let getSymbol = props.selectedSym.symbol
            setAlertValue(props.selectedSym.criteriaValue)
            setAlertName(props.selectedSym.alertName)
            let getSym = getSymbol.sym
            setExcShow(getSym.exc)
            let finalModify = {...getSymbol,...getSym}
            let modifySymbol = getAlertStreamKey()
            setStreamListFilter(ALERT_STREAM_FILTER[modifySymbol])  
            // setSearchIndex(modifySymbol) 
            setResultArray({ sym: finalModify })
            let symbols = []
            symbols.push(finalModify)
            props.forceSubscribeLevel1(symbols)
        }
    },[props.modify])

    function getAlertStreamKey() {
        let findType =  ALERT_TYPE_LIST[
            props.selectedSym.criteriaType.substr(
                1, props.selectedSym.criteriaType.length)
        ]
        return ALERT_STREAM_FILTER.findIndex(x => x.name === findType);
    }

    function getAlertSignKey() {
        if (props.selectedSym.criteriaType.charAt(0) === 'g')
            return 0
        else if (props.selectedSym.criteriaType.charAt(0) === 'l')
            return 1
        else if (props.selectedSym.criteriaType.charAt(0) === 'e')
            return 2
        return null
    }

    function getAlertSignVolKey() {
        if (props.selectedSym.criteriaType.charAt(0) === 'g')
            return 0
        else if (props.selectedSym.criteriaType.charAt(0) === 'e')
            return 1
        return null
    }

    function notifySet(check) {
        if(check.includes('S'))
            setSmsAlert(true)
        else
            setSmsAlert(false)

        if(check.includes('E'))
            setEmailAlert(true)
        else
            setEmailAlert(false)
    }

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function setStreamingResptoSymbols(resp) {
        let { data } = resp;
        if (data) {
            let streamGet = Object.assign({}, resultArray)
            streamGet = Object.assign({}, streamGet, data);
            let streamKeyList = Object.assign([], streamList)
            let updatedList = streamKeyList.map((item) => {
                item.value = streamGet[item.apiKey] ? streamGet[item.apiKey] : "0.00"
                return item
            })
            if (streamGet.sym.instrument === "STK"){
                let updatedList1 = updatedList.filter((item) => item.key !== ALERT_STREAM_FILTER[9].key);
                setStreamList(updatedList1)
            }
            else {
                setStreamList(updatedList)
            }
            setResultArray(streamGet)
            getCurrentStream(updatedList)
            // console.log(updatedList)
            // setCurrentValue(updatedList[0].value)
            // if(props.modify && !props.searchCreate) {
            //     console.log(props.selectedSym)
            //     // let modifySymbol = getModifyDropdown(props.selectedSym.criteriaType).symbolIndex
            //     // setStreamListFilter(ALERT_STREAM_FILTER[modifySymbol])   
            //     setCurrentValue(ALERT_STREAM_FILTER[searchIndex].value)
            // }
            // else {
            //     // setStreamListFilter(updatedList)
            //     setCurrentValue(updatedList[0].value)
            // }
        }
    }

    function getCurrentStream() {
        setCurrentValue(streamListFilter.value)

    }

    function onChangeName(e) {
        let value = e.target.value
        if (!specialCharFinder(e.target.value) && !isValidNumber(e.target.value)) {
            setAlertName(value)
        }
    }

    function onChangeValue(e) {
        let value = e.target.value
        let decCount = countDecimals(value)
        // console.log(streamListFilter.key)
        if (streamListFilter.key === "ltq" || streamListFilter.key === "vol" || streamListFilter.key === "OI") {
            if ((value >= 0) && !specialCharFinder(e.target.value)) {
                setAlertValue(value)
            }
        }
        else if(streamListFilter.key === "chngPer") {
            if ((value >= 0) || (value <= 0) || negativeValueFinder(e.target.value)) {
                if(decCount <= 2){
                    setAlertValue(value)
                }
            }
        }
        else {
            if ((value >= 0) && !isValidPassword(e.target.value) && decCount <= 2) {
                setAlertValue(value)
            }
        }
        
    }

    function onSelectItem(item) {
        setAlertValue('')
        setErrorMsg('')
        setShowValue(false)
        setSignListFilter(item)
    }

    function onSelectStream(item) {
        setAlertValue('') 
        setCurrentValue(item.value)
        setStreamListFilter(item)

    }

    function alertCancel() {
        if(props.modify || props.searchCreate) {
            setCurrentValue('')
            setStreamList([])
            props.storeAlertSearchModify(null)
            props.closeCB()
        }
        else {
            console.log(props.selectedSym)
            gotoQuote(props.selectedSym)
            // props.storeAlertSelectedSym(null)
            // props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.ORDER_WITH_QUOTE)
        }        
    }

    function setSmsCheck(val) {
        setSmsAlert(val)
        
    }
    function setEmailCheck(val){
        setEmailAlert(val)
    }

    function alertCB(){
        setAlertCB(true)
    }

    function onClickSubmit() {
        let checkValid = getValidAlertValue(streamListFilter.check,signListFilter.key,alertValue,currentValue)
        console.log(checkValid.valid)
        if(parseInt(alertValue) === 0){
            if (streamListFilter.key === "chngPer") {
                if (alertValue > 0 || alertValue < 0) {
                    if (checkValid.valid)
                        submitCB(true)
                    else
                        submitCB(false)
                }
                else
                    setErrorMsg(getLangText('ALERT_CRITERIA_VALUE', 'ALERT'))
            }
            else {
                submitCB(false)
            }
        }
        else {
            if(isNaN(parseInt(alertValue)) || !checkValid.valid) {
                submitCB(false)
            } 
            else {
                submitCB(true)
            }  
          
        }   
    }

    function submitCB(value) {
        let checkValid = getValidAlertValue(streamListFilter.check,signListFilter.key,alertValue,currentValue)
        if (value === true) {
            setErrorMsg('')
            setShowValue(false)
            if(props.modify && !props.searchCreate){
                props.showWidgetLoader();
                let criteriaType = getCriteriaType(streamListFilter.key, signListFilter.key)
                let request = new MsfRequest();
                let notifyTypeGet = ["P",smsAlert ? "S" : "",emailAlert ? "E" : ""].filter(e => e.trim());
                request.addToData({
                    "alertID": props.selectedSym.alertID,
                    "alertCriteria": {
                        "criteriaType": criteriaType,
                        "criteriaVal": alertValue
                    },
                    "notifyType": notifyTypeGet,
                    "alertName": alertName,
                    sym: resultArray.sym
                })
       
                request.setEncrypt(false)
                MsfFetch.placeRequest(
                    getAlertBaseUrl() + ALERT_SERVICES.MODIFY_ALERT,
                    request,
                    successRespCBgetAlertMsg,
                    errorRespCBgetAlertMsg
                )
            }
            else {
                props.showWidgetLoader();
                let criteriaType = getCriteriaType(streamListFilter.key, signListFilter.key)
                let request = new MsfRequest();
                let notifyTypeGet = ["P",smsAlert ? "S" : "",emailAlert ? "E" : ""].filter(e => e.trim());
                request.addToData({
                    "alertCriteria": {
                        "criteriaType": criteriaType,
                        "criteriaVal": alertValue
                    },
                    "notifyType": notifyTypeGet,
                    "alertName": alertName,
                    sym: props.selectedSym
                })
                request.setEncrypt(false)
                MsfFetch.placeRequest(
                    getAlertBaseUrl() + ALERT_SERVICES.ADD_ALERT,
                    request,
                    successRespCBgetAlertMsg,
                    errorRespCBgetAlertMsg
                )
            }
         
        }
        else {
            setErrorMsg(checkValid.msgAlert)
            setShowValue(true)
        }
    }

    function successRespCBgetAlertMsg(response) {
        AF_EventTriggered(AF_EVENT_NAMES.ALERT , AF_EVENT_TYPES.SET_ALERT ,{"onclick" :"setalert success"})
        console.log(response)
        setShowSuccess(true)
        setShowValue(false)
        props.hideWidgetLoader();
    }

    function errorRespCBgetAlertMsg(error) {
        AF_EventTriggered(AF_EVENT_NAMES.ALERT , AF_EVENT_TYPES.SET_ALERT ,{"onclick" :"setalert failure"})
        if (error.infoID === INFO_IDS.DUPLICATE_ALERT){
            setErrorMsg(getLangText('ALERT_INVALID'))
        }
        else if (error.infoID === INFO_IDS.INVALID_ALERT) {
            setErrorMsg(getLangText('ALERT_INVALID_DATA'))
        }
        else {
            props.showAppDialog({
                message: error.message,
                show: true
            })
        }
        setShowValue(true)
        props.hideWidgetLoader();
    }

    function closeSuccess() {
        if(props.modify || props.searchCreate){
            setShowSuccess(false)
            props.storeAlertSearchModify(null)
            props.closeCB()

        }
        else {
            props.storeAlertSelectedSym(null)
            props.history.push(SCREENS.ALERTS)
            // props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT)
            setShowSuccess(false)
        }
    }

    return (
        <>
            <div className="alertBase">
                <div className="scrip-head">
                    <div className="alert-head">
                        <LangText module="ALERT" name="SET_ALERT" />
                    </div>
                    <div className="alert-search">
                        {
                            (props.hideSearch) ?
                                <>
                                </>
                                :
                                <SymbolSearchComponent alertSearch={true} alertCB={alertCB} />
                        }
                    </div>
                </div>
                <div className="alert-header">
                    <div className="content">
                        <div className="valueDiv">
                            <div className="top">
                                <div className="name">
                                    <span className="symName text-nowrap"
                                        title={getDispSymbolName(resultArray).primaryName}
                                    >
                                        {getDispSymbolName(resultArray).primaryName}
                                    </span>
                                    <span className="exc">{props.selectedSym.exc ? props.selectedSym.exc 
                                        : excShow}</span>
                                </div>

                                <div className="ltpVal">
                                    <span className={resultArray.ltpClass}>
                                        {checkEmpty(resultArray.ltp)}
                                    </span>
                                </div>
                            </div>
                            <div className="bottom">
                                <div className="lttVal">
                                    {checkEmpty(resultArray.ltt)}
                                </div>
                                <div className={`changeVal ${getColorCode(resultArray.chng)}`}>
                                    <span className="chng">
                                        {checkEmpty(resultArray.chng)}
                                        ({checkEmpty(resultArray.chngPer)}%)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="alert-body">
                    <div className="fieldBody">
                        <div className="fieldRow dropdown">
                            <div className="row">
                                <div className="field">
                                    <span className="sign-label">
                                        <LangText module="ALERT" name="ALERT_ME_WHEN" />
                                    </span>
                               
                                    <SelectInputComponent
                                        optionList={streamList}
                                        selectedOption={streamListFilter.name}
                                        onSelectValueCB={onSelectStream}
                                        value="name"
                                        preSelect={true}
                                        hasOptVal={true}
                                        hiddenScroll={true}
                                        optValKey="value"
                                        hasLangageDependent = {true}
                                    />
                                    <span className="current-value-label">
                                        <LangText module="ALERT" name="CURRENT_VALUE" />
                                    </span>
                                    <span className="current-value">
                                        {currentValue ? currentValue : streamList[0].value}
                                    </span>
                                </div>
                                <div className="field">
                                    <span className="sign-label">
                                        <LangText module="ALERT" name="ALERT_ME_IF" />
                                    </span>
                                    <SelectInputComponent
                                        optionList={signList}
                                        selectedOption={signListFilter.name}
                                        onSelectValueCB={onSelectItem}
                                        value="name"
                                        preSelect={true}
                                        sign={true}
                                        hiddenScroll={true}
                                        signKey="value"
                                        hasLangageDependent = {true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="fieldRow">
                            <div className="row">
                                <div className="field">
                                    <div className="entervalue-field">
                                        <span className="enter-label">
                                            <LangText module="ALERT" name="ENTER_VALUE" />
                                        </span>
                                        <span className={`enter-val ${showValue ?
                                            'errorInputDiv' : ''}`}>
                                            <InputComponent
                                                name="alertvalue"
                                                className="inputVal alert-input"
                                                value={alertValue}
                                                onChange={onChangeValue}
                                                maxLength={15}
                                            />

                                        </span>
                                        <div className="errorDiv">
                                            {errorMsg}
                                        </div>
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="entervalue-field">
                                        <span className="enter-label">
                                            <LangText module="ALERT" name="ENTER_ALERT_NAME" />
                                        </span>
                                        <span className="enter-title">
                                            <InputComponent
                                                name="alertname"
                                                className="inputVal alert-input"
                                                value={alertName}
                                                onChange={onChangeName}
                                                placeholder={getLangText('PLACE_HOLDER_NAME_ALERT', 'ALERT')}
                                                maxLength={15}
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="fieldRow notify">
                            <span className="notify-label">
                                <LangText module="ALERT" name="NOTIFY_ON" />
                            </span>
                            <div className="row">
                                
                                <div className="field">
                                    
                                    {
                                        smsAlert ?
                                            <>
                                                <CheckBoxIcon_Checked
                                                    onClick={() => setSmsCheck(false)} />
                                            </>
                                            :
                                            <CheckBoxIcon_UnChecked
                                                onClick={() => setSmsCheck(true)} />
                                    }
                                   
                                </div>
                                <span className={`sms-label ${props.selectedLang.id ==="gujarati" ?
                                    "gujarati-sms-label": ""}`}>
                                    <LangText module="ALERT" name="SMS" />
                                </span>
                                <div className="field">
                                    {
                                        emailAlert ?
                                            <>
                                                <CheckBoxIcon_Checked
                                                    onClick={() => setEmailCheck(false)} />
                                            </>
                                            :
                                            <CheckBoxIcon_UnChecked
                                                onClick={() => setEmailCheck(true)} />
                                    }
                                    
                                </div>
                                <span className={`email-label ${props.selectedLang.id ==='gujarati' ?
                                    "gujarati-email-label" : ""}`}>
                                    <LangText module="ALERT" name="EMAIL_ALERT"
                                    />
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="alert-footer">
                    <div className="marginDiv">
                        <div className="alert-info">
                            <LangText module="ALERT" name="ALERT_INFO" />
                        </div>
                    </div>
                    <div className="actionDiv">
                        <button className="negativeBtn text-nowrap"
                            onClick={alertCancel}
                        >
                            <LangText module="BUTTONS" name="CANCEL" /></button>
                        <button className="positiveBtn text-nowrap"
                            onClick={() => onClickSubmit()}
                        >
                            {
                                props.modify ?
                                    <LangText module="BUTTONS" name="MODIFY_ALERT" />
                                    :
                                    <LangText module="BUTTONS" name="CREATE_ALERT" />
                            }
                        </button>
                    </div>
                </div>
                {
                    showSuccess ?
                        <div className={ (props.modify || props.searchCreate) ?
                            "alert-ModifyDialogbase" : "alert-DialogBase"}>
                            <div className="alert-Success">
                                <div className="alert-success-div">
                                    <span className="alert-success-msg">
                                        {
                                            (props.modify && !props.searchCreate) ?
                                                <LangText module="ALERT" name="ALERT_MODIFY" />
                                                :
                                                <LangText module="ALERT" name="ALERT_SUCCESS" />
                                        }
                                    </span>
                                </div>
                                <button className="okay-btn" onClick={closeSuccess}> <LangText 
                                    module="BUTTONS" name="DONE" /></button>
                            </div>
                        </div>
                        : 
                        null
                }

            </div>
        </>

    )

}

const mapStateToProps = ({ alerts, dashboard, settings,menu }) => {
    return {
        alerts,
        selectedWidgetMode: dashboard.selectedWidgetMode,
        selectedTheme: settings.selectedTheme,
        selectedAppMenu: menu.selectedAppMenu,
        selectedLang: settings.selectedLang
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAlertSelectedSym: (s) => { dispatch(storeAlertSelectedSym(s)) },
        storeSelectedAppMenu: (s) => { dispatch(storeSelectedAppMenu(s)) },
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) },
        storeAlertSearchModify: (s) => { dispatch(storeAlertSearchModify(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStreaming(
    withRouter(WidgetLoader(SetAlertDialogComponent))));
