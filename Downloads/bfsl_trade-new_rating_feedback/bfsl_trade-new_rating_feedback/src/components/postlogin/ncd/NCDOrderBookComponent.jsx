import React, { useEffect, useRef, useState } from 'react'
import { useFetch, MsfRequest } from '../../../index'

import { WidgetLoader } from '../../common/WidgetLoaderComponent'
import LangText from '../../../common/lang/LangText'

import {
    AF_EventTriggered,
    checkEmpty, convertCommaSeparated, convertToFloat, convertToUpperCase,
    findAndReplace,
    getBackOfficeBaseURL,
    getNCDOrderStatusClass,
    replaceComma,
} from '../../../common/CommonMethods'

import { NCD_SERVICE } from '../../../config/ServiceURLs'
import { AF_EVENT_NAMES, AF_EVENT_TYPES, NCD_DIALOGS } from '../../../common/Constants'
import { MoreInfoIcon } from '../../common/FontIcons'
import { connect } from 'react-redux'
import { storeNCDDialogDetails } from '../../../state/actions/Actions'

function NCDOrderbookComponent(props) {

    const MsfFetch = useFetch()

    const [orderbookNCD, setOrderbookNCD] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    const [selectedIndex, setSelectedIndex] = useState(null)
    // const [selectedInfoIndex, setSelectedInfoIndex] = useState(null)

    const isPendingRequest = useRef(false)

    useEffect(() => {
        getOrderbookNCD()
        AF_EventTriggered(AF_EVENT_NAMES.NCD, AF_EVENT_TYPES.ORDERBOOK_TAB)

    }, [])

    useEffect(() => {
        if (props.orderBookUpdate)
            getOrderbookNCD()
    }, [props.orderBookUpdate])

    function getOrderbookNCD() {
        // console.log("reached orderbook")
        isPendingRequest.current = true
        props.showWidgetLoader()
        setOrderbookNCD([])
        setErrorMsg(null)
        let request = new MsfRequest();
        request.addToData({})
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + NCD_SERVICE.ORDER_BOOK,
            request,
            successRespCBGetOrderbookNCD,
            errorRespCBGetOrderbookNCD
        )
    }

    function successRespCBGetOrderbookNCD(response) {
        isPendingRequest.current = false
        let list = response.data.records
        list.map((item) => {
            item.invesAmt = convertCommaSeparated(convertToFloat(replaceComma(item.qty) *
                replaceComma(findAndReplace(item.price, '₹'))))
            return item
        })
        setOrderbookNCD(list)
        setErrorMsg(null)
        props.hideWidgetLoader()
        // props.storeNCDOrderbookUpdate(false)
    }

    function errorRespCBGetOrderbookNCD(error) {
        isPendingRequest.current = false
        setOrderbookNCD([])
        setErrorMsg(error.message)
        props.hideWidgetLoader()
    }

    function onClickOptions(index) {
        // setSelectedInfoIndex(null)
        setSelectedIndex(selectedIndex === index ? null : index)
    }
    function onClickCancelOrder(data) {
        setSelectedIndex(null)
        props.storeNCDDialogDetails({
            name: NCD_DIALOGS.CANCEL_ORDER,
            symData: data
        })
    }

    return (
        <div className="ncd-content-base">
            <div className="ncd-table ncd-orderbook-table">
                <div className="body">
                    {
                        (orderbookNCD && orderbookNCD.length) ?
                            orderbookNCD.map((item, index) => {
                                return (
                                    <div key={index} className="dataRow">
                                        <div className="name">
                                            <span>{checkEmpty(item.debtipoBidNme)}</span>
                                        </div>
                                        <div className="data">
                                            <div className="column first">
                                                <span className="label"><LangText name="SYMBOL" module="NCD" /></span>
                                                <span className="value">{
                                                    checkEmpty(item.debtipoNme)}</span>
                                            </div>
                                            <div className="column">
                                                <span className="label"><LangText name="ORD_QTY" module="NCD" /></span>
                                                <span className="value">
                                                    {checkEmpty(item.qty)}</span>
                                            </div>
                                            <div className="column">
                                                <span className="label">
                                                    <LangText name="PRICE_2" module="NCD" /></span>
                                                <span className="value">
                                                    {checkEmpty(item.price)}</span>
                                            </div>
                                            <div className="column">
                                                <span className="label"><LangText name="INVESTED" module="NCD" />
                                                </span>
                                                <span className="value">
                                                    {item.invesAmt ? '₹' : ''}
                                                    {checkEmpty(item.invesAmt)}</span>
                                            </div>
                                            <div className="column">
                                                <span className="label">
                                                    <LangText name="ORDER_ID" module="NCD" /></span>
                                                <span className="value">{checkEmpty(item.applicationNo)}</span>
                                            </div>
                                            {/* <div className="column">
                                                <span className="label">
                                                    <LangText name="ACTION" module="NCD" /></span>
                                                <span className="value">
                                                    {convertToUpperCase(checkEmpty(item.actType))}</span>
                                            </div> */}
                                            <div className="column statusColumn">
                                                <div className="labelwithvalue">
                                                    <span className="label">
                                                        <LangText name="STATUS" module="NCD" /></span>
                                                    <span className="rejection-and-icon">
                                                        <span className={`value-status
                                                         ${getNCDOrderStatusClass(item.exchStatus)}`}>
                                                            {convertToUpperCase(checkEmpty(item.exchStatus))}
                                                            {/* MODIFY VALIDATION PENDING */}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="tooltip-div options">
                                                <div className={`tooltip-container options-tooltip bottom left 
                                                ${(index === selectedIndex) ?
                                        "show" : "hide"}`}>
                                                    <div className="options">
                                                        <span className="option cursor"
                                                            onClick={() => onClickCancelOrder(item)}>
                                                            <LangText name="CANCEL" module="BUTTONS" /></span>
                                                    </div>
                                                    <span className="triangle"></span>
                                                </div>
                                                <div className={`flex-center ${JSON.parse(item.cancellable) ?
                                                    'show' : "hide-into-background"}`}>
                                                    <MoreInfoIcon className=
                                                        {`${JSON.parse(item.cancellable) ? "cursor" : ""}
                                                         ${!JSON.parse(item.cancellable) ?
                                        "hide-into-background" : ""}`}
                                                    onClick={() => { onClickOptions(index) }}
                                                    disabled={JSON.parse(item.cancellable)} /></div>
                                            </div>
                                        </div>
                                        {
                                            // item.exchStatus === "Rejected" ?
                                            //     <div className="rejection-reason">
                                            //         Reason: rejection reason dummy text</div>
                                            //     :
                                            //     null
                                        }
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

const mapStateToProps = ({ ncdDetails }) => {
    return {
        orderBookUpdate: ncdDetails.orderBookUpdate,
        gotoOrderBook: ncdDetails.gotoOrderBook,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeNCDDialogDetails: (s) => { dispatch(storeNCDDialogDetails(s)) },
        // storeNCDOrderbookUpdate: (s) => { dispatch(storeNCDOrderbookUpdate(s)) }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(WidgetLoader(NCDOrderbookComponent));

// export default WidgetLoader(NCDOrderbookComponent);