import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";

import { moveToOrderMenu } from '../../../state/actions/Actions';
import { FUNDS_SCREENS, ORDER_RESULT_HEADER, ORDER_STATUS_MSG, SCREENS,
    THEMES } from '../../../common/Constants';
import { convertToUpperCase, getGuestUserBaseURL } from '../../../common/CommonMethods';
import { withRouter } from 'react-router';
import LangText from '../../../common/lang/LangText'
import { MsfRequest,useFetch } from '../../../index';
import { HOLDINGS_GUEST } from '../../../config/ServiceURLs';
import { storeHoldingsResponseToStore } from '../../../common/Bridge';

function OrderConfirmSuccessComponent(props) {

    const MsfFetch = useFetch()

    const [orderHeadName, setOrderHeadName] = useState(ORDER_RESULT_HEADER.SUCCESS)
    const [showActionButton, setShowActionButton] = useState(false)

    useEffect(() => {
        getHoldings()
    },[])

    useEffect(() => {
        if (props.resultData.orderStatus) {
            if (convertToUpperCase(props.resultData.orderStatus) === convertToUpperCase(ORDER_STATUS_MSG.ORDER_REJECT))
                setOrderHeadName(ORDER_RESULT_HEADER.FAIL)
            else if (convertToUpperCase(props.resultData.orderStatus) ===
                convertToUpperCase(ORDER_STATUS_MSG.ORDER_CANCEL))
                setOrderHeadName(ORDER_RESULT_HEADER.CANCELLED)
            else
                setOrderHeadName(ORDER_RESULT_HEADER.SUCCESS)
        }
    }, [props.resultData])

    useEffect(() => {
        if(props.resultData.actDisp) {
            setShowActionButton(true)
        }
    },[props.resultData.actDisp])

    function onClickDone() {
        closeOrder()
    }

    function closeOrder() {
        props.onCloseCB && props.onCloseCB()
        props.moveToOrderMenu({
            showOrderMenu: true
        })
    }

    function onClickActionButton() {
        if(props.resultData.actCode === FUNDS_SCREENS.ADD_FUNDS){
            props.history.push(SCREENS.FUNDS);
        }
    }

    function getHoldings() {
        let request = new MsfRequest();
        request.addToData({})
        MsfFetch.placeRequest(
            getGuestUserBaseURL() + HOLDINGS_GUEST.GET_HOLDINGS_BO,
            request,
            successRespCBGetHoldings,
            errorRespCBGetHoldings
        )
    }

    function successRespCBGetHoldings(response) {
        storeHoldingsResponseToStore(response.data.holdings)
    }

    function errorRespCBGetHoldings(error) {
        console.log('error: ', error);
    }

    return (
        <div className="orderConfirmSuccess">
            <div className="success-button">
                {
                    orderHeadName === ORDER_RESULT_HEADER.FAIL || orderHeadName === ORDER_RESULT_HEADER.CANCELLED ?

                        props.selectedTheme.theme === THEMES.LIGHT ?
                            < img src="assets/images/dashboard/failed_btn.svg" alt="" />
                            :
                            < img src="assets/images/dark/dashboard/Failed_btn.svg" alt="" />
                        :
                        props.selectedTheme.theme === THEMES.LIGHT ?
                            <img src="assets/images/dashboard/success_btn.svg" alt="" />
                            :
                            <img src="assets/images/dark/dashboard/success_btn.svg" alt="" />
                }
            </div>
            <div className={`status ${orderHeadName === ORDER_RESULT_HEADER.SUCCESS ? 'success' : 'fail'}`}>
                {orderHeadName}
            </div>
            <div className="symbl-qty">
                {props.resultData.symDetails.name} ({props.resultData.symDetails.qty} <LangText 
                    name="QUANTITYY" module="ORDERBOOK_MSGS" />)
            </div>
            <div className="success-msg">
                {
                    props.resultData.orderStatus ? props.resultData.orderStatus : ''
                }
            </div>

            {
                orderHeadName === ORDER_RESULT_HEADER.FAIL ?
                    props.resultData.rejReason ?
                        <div className="rejectedReason"
                            title={props.resultData.rejReason}>
                            {props.resultData.rejReason} </div>
                        : ''
                    : ''
            }
            {
                orderHeadName === ORDER_RESULT_HEADER.SUCCESS ?
                    <div className="orderid">
                        <LangText module="HEADER" name="ORDER_ID" />: {props.resultData.orderId}
                    </div>
                    : null
            }
            <div className={(showActionButton) ?
                "result-btns" : "result-donebtn"}>
                <div className="result-done">
                    <button className="okay-btn" onClick={onClickDone}> 
                        <LangText module="BUTTONS" name="DONE" /></button>
                </div>
                <div className="result-addFunds">
                    {
                        showActionButton ?
                            <button className="add-funds" onClick={onClickActionButton}> 
                                {convertToUpperCase(props.resultData.actDisp)}</button>
                            :
                            null
                    }
                </div>       
            </div>
            <div className="footer-div"></div>
        </div>
    )
}
const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        moveToOrderMenu: (s) => { dispatch(moveToOrderMenu(s)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OrderConfirmSuccessComponent));