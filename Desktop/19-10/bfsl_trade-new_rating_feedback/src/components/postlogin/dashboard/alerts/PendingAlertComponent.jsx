import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index';

import {
    AF_EventTriggered,
    checkEmptyString,
    getAlertBaseUrl,
    getFormatedDate
} from '../../../../common/CommonMethods';
import {  AF_EVENT_NAMES, AF_EVENT_TYPES, ALERT_SIGN_FILTER, ALERT_TYPE_LIST, DATE_FORMATS, 
    TEXT_ORIENTATION } from '../../../../common/Constants';
import LangText from '../../../../common/lang/LangText';

import { ALERT_SERVICES } from '../../../../config/ServiceURLs';
import { DownArrowIcon, UpArrowIcon } from '../../../common/FontIcons';
import { WidgetLoader } from '../../../common/WidgetLoaderComponent';

const PendingAlertComponent = (props) => {

    const MsfFetch = useFetch()

    const [selectedShowMoreIndex, setSelectedShowMoreIndex] = useState(null)
    const [pendingAlert, setPendingAlert] = useState([])
    const [pendingAlertType, setPendingAlertType] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        if (props.startDate)
            getPendingAlert()
    }, [props.startDate, props.endDate, props.modified])

    function getPendingAlert() {
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.addToData({
            "fromDate": getFormatedDate(props.startDate,
                0, DATE_FORMATS.DDMMYYYY, true).stringDate,
            "toDate": getFormatedDate(props.endDate,
                0, DATE_FORMATS.DDMMYYYY, true).stringDate
        })
        request.setEncrypt(false)
        MsfFetch.placeRequest(
            getAlertBaseUrl() + ALERT_SERVICES.LIST_PENDING_ALERT,
            request,
            successRespCBgetAlertMsg,
            errorRespCBgetAlertMsg
        )
    }

    function successRespCBgetAlertMsg(response) {
        props.hideWidgetLoader();
        let groupedAlerts1 = groupAlerts(response.data.alertList)
        setPendingAlert(groupedAlerts1)
        // console.log(groupedAlerts1)
        // groupedAlerts1.map((item) => {
        //     console.log(item.alertGroup.length)
        //     if(item.alertGroup.length === 1) {
        //         setSelectedShowMoreIndex(0)
        //     }
        // })
        if (groupedAlerts1.length === 1) {
            setSelectedShowMoreIndex(0)
        }
        else {
            setSelectedShowMoreIndex(null)
        }
        setPendingAlertType(true)
    }

    function errorRespCBgetAlertMsg(error) {
        props.hideWidgetLoader();
        setPendingAlertType(false)
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

    function modOpen(modifyValue) {
        props.modifyOpen(modifyValue)
        AF_EventTriggered(AF_EVENT_NAMES.ALERT , AF_EVENT_TYPES.MODIFY,{"onClick":"pending alert modify"})
    }

    function delOpen(deleteAlert) {
        props.deleteOpen(deleteAlert)
        AF_EventTriggered(AF_EVENT_NAMES.ALERT , AF_EVENT_TYPES.DELETE,{"onClick":"pending alert delete"})

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

    return (
        <>
            <table className="alert-table">
                <tbody className="tbody-scroller scroller_firefox">
                    {pendingAlert.length ?
                        pendingAlert.map((item, index) => {
                            return (
                                <>
                                    <tr className={`${selectedShowMoreIndex === index ?
                                        'noBorder' : ''} `}>
                                        <td className="firstChild width27">
                                            <div className="symName-column">
                                                <div className="primary">
                                                    <div className="baseName"
                                                        title={(item).name}
                                                    >
                                                        {(item).name}
                                                    </div>
                                                    <span className="exc">
                                                        {item.exc}
                                                    </span>
                                                </div>
                                                <div className="symName text-nowrap">
                                                    <span className="symCount-label">
                                                        <LangText name="NO_OF_ALERTS" module="ALERT" />
                                                    </span>
                                                    <span className="symCount">
                                                        {(item).alertGroup.length}
                                                    </span>
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
                                                                    {itemlist.createdAt}
                                                                </div>
                                                            </div>
                                                            <div className="itemList-content">
                                                                <div className="alert-type">
                                                                    <span className="content-head">
                                                                        <LangText name="ALERT_TYPE"
                                                                            module="ALERT"
                                                                            orientation=
                                                                                {TEXT_ORIENTATION.UPPERCASE}  />
                                                                    </span>
                                                                    <span className="content-value">
                                                                        {pendingAlertType ? 
                                                                            ALERT_TYPE_LIST[
                                                                                itemlist.criteriaType.substr(
                                                                                    1, itemlist.criteriaType.length)
                                                                            ]
                                                                            : null}
                                                                        {/* {pendingAlertType ? 
                                                                                getAlertType(itemlist.
                                                                                    criteriaType).type 
                                                                                : null} */}
                                                                    </span>
                                                                </div>
                                                                <div className="alert-type">
                                                                    <span className="content-head">
                                                                        <LangText name="ALERT_CONDITION"
                                                                            module="ALERT"
                                                                            orientation=
                                                                                {TEXT_ORIENTATION.UPPERCASE}  />
                                                                    </span>
                                                                    <span className="content-value">
                                                                        {pendingAlertType ? 
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
                                                                                {TEXT_ORIENTATION.UPPERCASE}  />
                                                                    </span>
                                                                    <span className="content-value">
                                                                        {itemlist.criteriaValue}
                                                                    </span>
                                                                </div>
                                                                <div className="alert-list-buttons">
                                                                    <div className="btn-div">
                                                                        <button className="modify-alert"
                                                                            onClick={() =>
                                                                                modOpen(itemlist)}>
                                                                            <LangText
                                                                                name="MODIFY"
                                                                                module="BUTTONS"
                                                                            />
                                                                        </button>
                                                                    </div>
                                                                    <div className="btn-div">

                                                                        <button
                                                                            className="delete-alert"
                                                                            onClick={() =>
                                                                                delOpen(itemlist)}
                                                                        >
                                                                            <LangText name="DELETE"
                                                                                module="BUTTONS" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                                : null}
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

export default WidgetLoader(PendingAlertComponent);