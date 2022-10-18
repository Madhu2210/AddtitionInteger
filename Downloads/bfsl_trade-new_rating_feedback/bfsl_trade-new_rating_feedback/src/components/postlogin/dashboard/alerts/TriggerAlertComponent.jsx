import React,{useEffect, useState} from 'react'
import { withRouter } from 'react-router-dom';
import { useFetch, MsfRequest } from '../../../../index';

import {  checkEmptyString, getAlertBaseUrl,
    getFormatedDate } from '../../../../common/CommonMethods';
import {  ALERT_SIGN_FILTER, ALERT_TYPE_LIST, DATE_FORMATS, ORDER_TYPES, SCREENS, 
    TEXT_ORIENTATION } from '../../../../common/Constants';
import LangText from '../../../../common/lang/LangText';

import { ALERT_SERVICES } from '../../../../config/ServiceURLs';
import { DownArrowIcon, UpArrowIcon } from '../../../common/FontIcons';
import { gotoQuote, gotoTrade } from '../../../../common/Bridge';
import { WidgetLoader } from '../../../common/WidgetLoaderComponent';

const TriggerAlertComponent = (props) => {

    const MsfFetch = useFetch()

    const [selectedShowMoreIndex, setSelectedShowMoreIndex] = useState(null)
    const [triggerAlert,setTriggerAlert] = useState([])
    const [errorMsg, setErrorMsg] = useState('')
    const [triggerAlertType, setTriggerAlertType] = useState(false)

    useEffect(() => {
        if(props.startDateTrigger)
            getTriggerAlert()
    }, [props.startDateTrigger,props.endDateTrigger])

    function getTriggerAlert(){
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.addToData({
            "fromDate": getFormatedDate(props.startDateTrigger, 
                0,DATE_FORMATS.DDMMYYYY, true).stringDate,
            "toDate": getFormatedDate(props.endDateTrigger,
                0, DATE_FORMATS.DDMMYYYY, true).stringDate      
        })
        request.setEncrypt(false)
        MsfFetch.placeRequest(
            getAlertBaseUrl() + ALERT_SERVICES.LIST_TRIGGERED_ALERT,
            request,
            successRespCBgetAlertMsg,
            errorRespCBgetAlertMsg
        )
    }

    function successRespCBgetAlertMsg(response) {
        props.hideWidgetLoader();
        let groupedAlerts1 = groupAlerts(response.data.alertList)
        setTriggerAlert(groupedAlerts1)
        setTriggerAlertType(true)
        if (groupedAlerts1.length === 1) {
            setSelectedShowMoreIndex(0)
        }
        else {
            setSelectedShowMoreIndex(null)
        }
    }

    function errorRespCBgetAlertMsg(error) {
        props.hideWidgetLoader();
        setTriggerAlertType(false)
        setErrorMsg(error.message)  
    }

    function groupAlerts(alertArray) {
        let groupedAlerts = []
        alertArray.map((item) => {
            let alertIndex = groupedAlerts.findIndex((iItem) => {
                return iItem.name === item.symbol.dispSym
            })
            if (alertIndex !== -1) {
                groupedAlerts[alertIndex].alertGroup.push(item)
            } else {
                let alertObj = {
                    name: item.symbol.dispSym,
                    exc: item.symbol?.sym?.exc,
                    alertGroup: []
                }
                alertObj.alertGroup.push(item)
                groupedAlerts.push(alertObj)
            }
            // return item
        })

        return groupedAlerts
    }
    
    function showMoreDetails(index) {
        if (index === selectedShowMoreIndex)
            setSelectedShowMoreIndex(null)
        else
            setSelectedShowMoreIndex(index)
    }

    function onClickTrade(e,getTriggerSym, type) {
        e.preventDefault()
        e.stopPropagation()
        let getAlertGroup = getTriggerSym.alertGroup
        let getSymbol = getAlertGroup.map((a)=>a.symbol);
        let sendOrder = getSymbol.reduce((a, b) => Object.assign(a, b), {})
        // if (props.history.location.pathname !== SCREENS.DASHBOARD)
        props.history.push(SCREENS.DASHBOARD)
        gotoTrade(sendOrder, type)        
    }

    function getType(type) {
        if (type.charAt(0) === 'g')
            return ALERT_SIGN_FILTER[0].name
        if (type.charAt(0) === 'l')
            return ALERT_SIGN_FILTER[1].name
        if (type.charAt(0) === 'e')
            return ALERT_SIGN_FILTER[2].name
        return null
    }

    function gotoQuoteScreen(val) {
        let symData = val.alertGroup
        let getSymbol = symData.map((a)=>a.symbol);
        let sendOrder = getSymbol.reduce((a, b) => Object.assign(a, b), {})
        // if (props.history.location.pathname !== SCREENS.DASHBOARD)
        props.history.push(SCREENS.DASHBOARD)
        gotoQuote(sendOrder, true)   
        setTimeout(function(){ window.scrollTo(0, 0); }, 100);   
    }

    return (
        <>
            <table className="alert-table">
                <tbody className="tbody-scroller scroller_firefox">
                    {triggerAlert.length ?
                        triggerAlert.map((item, index) => {
                            return (
                                <>
                                    <tr className={`${selectedShowMoreIndex === index ?
                                        'noBorder' : ''} `}>
                                        <td className="firstChild width50">
                                            <div className="symName-column">
                                                <div className="primary">
                                                    <div className="baseName cursor"
                                                        title={(item).name}
                                                        onClick={() => gotoQuoteScreen(item)}
                                                    >
                                                        {(item).name}
                                                    </div>
                                                    <span className="exc">
                                                        {item.exc}                     
                                                    </span>
                                                </div>
                                                <div className="symName text-nowrap">
                                                    <span className ="symCount-label"> 
                                                        <LangText name="NO_OF_ALERTS" module="ALERT" />
                                                    </span>
                                                    <span className ="symCount">         
                                                        {(item).alertGroup.length}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="trigger-orderbtn">
                                            <div className="btn-div">
                                                <div className="trigger-buy">
                                                    <button className="buy-btn2" 
                                                        onClick={(e) => onClickTrade(e,item, ORDER_TYPES.BUY)}>
                                                        <LangText module="BUTTONS" name="BUY" />
                                                    </button>
                                                </div>
                                                <div className="trigger-sel">
                                                    <button className="sell-btn2" 
                                                        onClick={(e) => onClickTrade(e,item, ORDER_TYPES.SELL)}>
                                                        <LangText module="BUTTONS" name="SELL" />
                                                    </button>
                                                </div>
                                                    
                                            </div>
                                        </td>
                                                        
                                        <td className="width4">
                                            {
                                                selectedShowMoreIndex === index ?
                                                    <UpArrowIcon className="showMoreIcon cursor"
                                                        onClick={() => showMoreDetails('')}
                                                    />
                                                    :
                                                    <DownArrowIcon className="showMoreIcon cursor"
                                                        onClick={() => showMoreDetails(index)}
                                                    /> 
                                            }
                                        </td>
                                    </tr>
                                    {selectedShowMoreIndex === index ?
                                        <>
                                            {item.alertGroup.length ?
                                                item.alertGroup.map((itemlist) => {
                                                    return (
                                                        <div className="moreDetails" key={itemlist}>
                                                            <div className="itemList-header">
                                                                <div className="itemList-name">
                                                                    <LangText name="NAME" 
                                                                        module="ALERT" />
                                                                    <span className="name">
                                                                        {checkEmptyString(itemlist.alertName)}
                                                                    </span>            
                                                                </div>
                                                                <div className="itemList-date">
                                                                    {itemlist.triggeredAt}
                                                                </div>
                                                            </div>  
                                                            <div className="itemList-content">
                                                                <div className="alert-type">
                                                                    <span className="content-head">
                                                                        <LangText name="ALERT_TYPE"
                                                                            module="ALERT" 
                                                                            orientation=
                                                                                {TEXT_ORIENTATION.UPPERCASE} />
                                                                    </span>
                                                                    <span className="content-value">
                                                                        {triggerAlertType ? 
                                                                            ALERT_TYPE_LIST[
                                                                                itemlist.criteriaType.substr(
                                                                                    1, itemlist.criteriaType.length)
                                                                            ]
                                                                            : null}
                                                                    </span>
                                                                </div>
                                                                <div className="alert-type">
                                                                    <span className="content-head">
                                                                        <LangText name="ALERT_CONDITION"
                                                                            module="ALERT" 
                                                                            orientation=
                                                                                {TEXT_ORIENTATION.UPPERCASE} />
                                                                    </span>
                                                                    <span className="content-value">
                                                                        {triggerAlertType ? 
                                                                            getType(itemlist.
                                                                                criteriaType)            
                                                                            : null}
                                                                    </span>
                                                                </div>
                                                                <div className="alert-type">
                                                                    <span className="content-head">
                                                                        <LangText name="ALERT_VALUE"
                                                                            module="ALERT" 
                                                                            orientation=
                                                                                {TEXT_ORIENTATION.UPPERCASE} />
                                                                    </span>
                                                                    <span className="content-value">
                                                                        {itemlist.criteriaValue}
                                                                    </span>
                                                                </div>
                                                               
                                                            </div>                      
                                                        </div>
                                                    )
                                                })
                                                :null}
                                        </>
                                        : null
                                    }
                                </>
                        
                            )
                        })
                        :
                        <tr className="errorRow">
                            <td className="colspan">
                                {
                                    errorMsg ? errorMsg :
                                        <LangText
                                            name="ALERT_NO_MSG"
                                            module="ALERT"
                                        />
                                }
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </>
    )
}

export default (withRouter(WidgetLoader(TriggerAlertComponent)));