import React, { useEffect, useState } from 'react';
import { useFetch, MsfRequest } from '../../../../../index'
import { connect } from 'react-redux';

import LangText from '../../../../../common/lang/LangText';

import { convertToUpperCase, getBaseURL, getColorBuySellAction, 
    getOrderStatusClass } from '../../../../../common/CommonMethods';
import { TRADE } from '../../../../../config/ServiceURLs';
import { LeftArrowIcon } from '../../../../common/FontIcons';
import { gotoOrderDialog } from '../../../../../common/Bridge';
import { ORDER_DIALOGS, THEMES } from '../../../../../common/Constants';

function OrderTrailComponent(props) {

    const MsfFetch = useFetch()

    const { symDetails } = props
    const { symData } = symDetails

    const [orderTrailData, setOrderTrailData] = useState({})
    const [errorMsg, setErrorMsg] = useState("")

    useEffect(() => {
        getOrderTrail()
    }, [])

    function getOrderTrail() {
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.addToData({
            ordId: symData.ordId
        })
        MsfFetch.placeRequest(
            getBaseURL() + TRADE.GET_ORDER_LOG,
            request,
            successRespCBGetOrderLog,
            errorRespCBGetOrderLog
        )
    }

    function successRespCBGetOrderLog(response) {
        props.hideWidgetLoader();
        setOrderTrailData(response.data)
    }

    function errorRespCBGetOrderLog(error) {
        props.hideWidgetLoader();
        setErrorMsg(error.message)
    }

    return (
        <div className="orderSymDetails-modal ordertrail-details">
            <div className="orderDialog-headerDetails">
                <div className="dialogHeader-symDetails">
                    <span className={`dialogHeader-orderAction 
                     ${getColorBuySellAction(props.symDetails.symData.ordAction)}`}>
                        {convertToUpperCase(props.symDetails.symData.ordAction)}</span>
                    <span className="dialogHeader-symbolname"> {props.symDetails.symData.baseSym}</span>
                    <span className="dialogHeader-exchange">
                        {props.symDetails.symData.sym.exc}</span>
                </div>

                <div className="dialogHeader-statusDetails">
                    <span className={`dialogHeader-orderStatus
                     ${getOrderStatusClass(props.symDetails.symData.status)}`}>
                        {convertToUpperCase(props.symDetails.symData.status)}
                    </span>
                    <div className="close-button flex-center" onClick={props.onCloseCB}>
                        {
                            props.selectedTheme.theme === THEMES.LIGHT ?
                                <img src="assets/images/dashboard/close_icon.svg" alt="" />
                                :
                                <img src="assets/images/dark/dashboard/close_icon.svg" alt="" />
                        }
                    </div>
                </div>
            </div>
            <div className="ordertrail-body content">
                <div className="orderTrail-details-left">
                    <div className="left-title">
                        <LeftArrowIcon onClick={() =>
                            gotoOrderDialog(symData, ORDER_DIALOGS.ORDERBOOK_DETAILS,
                                props.orderDialog.parentCB)} />
                        <span> <LangText module="BUTTONS" name="ORDER_TRAILS" /> </span>
                    </div>
                    <div className="left-body">
                        <div className="trail-details">
                            <span className="label"> <LangText module="ORDERTRAIL" name="TRADE_QTY" /></span>
                            <span className="separator">:</span>
                            <span className="value"> {props.symDetails.symData.tradedQty} </span>
                        </div>
                        <div className="trail-details">
                            <span className="label"><LangText module="ORDERTRAIL" name="ORDER_QTYS" /></span>
                            <span className="separator">:</span>
                            <span className="value">
                                {
                                    symData.qty
                                }
                            </span>
                        </div>
                        <div className="trail-details">
                            <span className="label"><LangText module="ORDERTRAIL" name="PRODUCT_TYPE" /></span>
                            <span className="separator">:</span>
                            <span className="value"> {props.symDetails.symData.prdType}  </span>
                        </div>
                        <div className="trail-details">
                            <span className="label"><LangText module="ORDERTRAIL" name="AVG_PRICE" /></span>
                            <span className="separator">:</span>
                            <span className="value">  {props.symDetails.symData.avgPrice}  </span>
                        </div>
                        <div className="trail-details">
                            <span className="label"><LangText module="ORDERTRAIL" name="ORDER_REF_NO" /></span>
                            <span className="separator">:</span>
                            <span className="value">  {props.symDetails.symData.ordId}  </span>
                        </div>
                    </div>
                </div>
                {/* <div class="separator"></div> */}
                <div className={`orderTrail-details-right ${errorMsg ? 'flex-center' : ''}`}>
                    {orderTrailData.history && orderTrailData.history.length ?
                        <>
                            {
                                orderTrailData.history.map((item, index) => {
                                    return (
                                        <div className="main-content" key={index}>
                                            <span className="date">{item.lupdateTime}</span>
                                            <div className={`details 
                                            ${(orderTrailData.history.length === (index + 1)) ?
                                            "dot" : (index === 0) ? "circle-line" : "dot-line"}`}>
                                                <span className="detail">
                                                    <p className="text">
                                                        {/* {item.ordStatus} {item.qty} <LangText module="ORDERS" name="QTY_RS" /> {item.limitPrice} {item.modifiedBy !== "--" ? <span><LangText module="ORDERS" name="MODIFIED_BY" /> {item.modifiedBy}</span> : ""} */}
                                                        {item.ordStatus}
                                                    </p>
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className="main-content">
                                <span className="date"></span>
                                <div className="details orderIdDiv">
                                    <LangText module="ORDERTRAIL" name="ORDER_ID" /> : {orderTrailData.ordId}
                                </div>
                            </div>
                        </>
                        : <div className="colspan errorMsg">{errorMsg}</div>
                    }
                </div>
            </div>
        </div >
    )
}
const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme
    }
}

export default connect(mapStateToProps, null)(OrderTrailComponent);

