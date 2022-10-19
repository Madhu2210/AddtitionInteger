
import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";

import { moveToOrderMenu, storeShowPledgeFlag } from '../../../state/actions/Actions';
import { FUNDS_SCREENS, ORDER_RESULT_HEADER, ORDER_STATUS_MSG, SCREENS,
    STREAMING_KEYS,
    STREAMING_MODULES,
    TAX_DECLARE_BLOCK_SCREENS, THEMES } from '../../../common/Constants';
import { applyPaint, convertCommaSeparated, convertToUpperCase, 
    getBackOfficeBaseURL, isValidNumber, replaceComma } from '../../../common/CommonMethods';
import { callTaxDeclaration, storeHoldingsResponseToStore } from '../../../common/Bridge';
import { withRouter } from 'react-router';
import LangText from '../../../common/lang/LangText';
import { MsfRequest,useFetch, withStreaming } from '../../../index';
import { HOLDINGS } from '../../../config/ServiceURLs';

function OrderConfirmSuccessComponent(props) {

    const MsfFetch = useFetch()

    const [orderHeadName, setOrderHeadName] = useState(ORDER_RESULT_HEADER.SUCCESS)
    const [showActionButton, setShowActionButton] = useState(false)
    
    const [shortfallAmnt, setShortfallAmnt] = useState()
    const [totalIncreaseMargin, setTotalIncreaseMargin] = useState()
    const [streamingResp, setStreamingResp] = useState(null)
    const [marginDetails, setMarginDetails] = useState([
    ])
    // const [displayMarginBlock, setDisplayMarginBlock] = useState(false)
    // const [hasAddFundsCTA, setHasAddFundsCTA] = useState(false)
    // const [validationsDone, setValidationsDone] = useState(true)

    useEffect(() => {
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.NET_POSITION);
        getHoldings()
        console.log('props.resultData: ', props.resultData);
        setShortfallAmnt(props.resultData.shortfallAmnt)
        setMarginDetails(props.resultData.marginDetails)
        if(props.resultData.marginDetails.length)
            streamingSubscription(props.resultData.marginDetails)
        // getShortfallDetails(props.resultData)
        // }
    },[])

    useEffect(() => {
        // console.log('123streamingResp: ', streamingResp);
        if (streamingResp && streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    useEffect(() => {
        if (props.resultData.orderStatus) {
            if (convertToUpperCase(props.resultData.orderStatus) === convertToUpperCase(ORDER_STATUS_MSG.ORDER_REJECT))
                setOrderHeadName(ORDER_RESULT_HEADER.REJECTED)
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

    // function getShortfallDetails(data) {
    //     console.log('archanadata: ', data);
    //     let request = new MsfRequest();
    //     request.addToData({
    //         rejReason: data.rejReason
    //     })
    //     request.setEncrypt(false)
    //     MsfFetch.placeRequest(
    //         getBackOfficeBaseURL() + FUND_TRANSFER.GET_FUNDS_MARGIN,
    //         request,
    //         successRespCBgetShortfallDetails,
    //         errorRespCBgetShortfallDetails
    //     )
    // }

    // function successRespCBgetShortfallDetails(response) {
    //     console.log('response shortfall: ', response);
    //     if(response.data) {
    //         setShortfallAmnt(2)
    //         setMarginDetails(response.data.marginAmount)
    //         //     setMarginDetails([{
    //         //         "dispSym": "AJANTPHARM",
    //         //         "haircutPer": "25.00",
    //         //         "sym": {
    //         //             "exc": "NSE",
    //         //             "otherExch": [
    //         //                 "BSE"
    //         //             ],
    //         //             "multiplier": "1",
    //         //             "series": "EQ",
    //         //             "lotSize": "1",
    //         //             "streamSym": "8124_NSE",
    //         //             "instrument": "STK",
    //         //             "id": "STK_AJANTPHARM_EQ_NSE",
    //         //             "asset": "equity",
    //         //             "excToken": "8124",
    //         //             "tickSize": "0.05"
    //         //         },
    //         //         "avgPrice": "",
    //         //         "qty": "200",
    //         //         "baseSym": "AJANTPHARM"
    //         //     },
    //         //     {
    //         //         "dispSym": "ASIANTILES",
    //         //         "haircutPer": "0",
    //         //         "sym": {
    //         //             "exc": "NSE",
    //         //             "otherExch": [
    //         //                 "BSE"
    //         //             ],
    //         //             "multiplier": "1",
    //         //             "series": "EQ",
    //         //             "lotSize": "1",
    //         //             "streamSym": "14889_NSE",
    //         //             "instrument": "STK",
    //         //             "id": "STK_ASIANTILES_EQ_NSE",
    //         //             "asset": "equity",
    //         //             "excToken": "14889",
    //         //             "tickSize": "0.05"
    //         //         },
    //         //         "avgPrice": "",
    //         //         "qty": "200",
    //         //         "baseSym": "ASIANTILES"
    //         //     }])
    //         // }
    //         // streamingSubscription([{
    //         //     "dispSym": "AJANTPHARM",
    //         //     "haircutPer": "25.00",
    //         //     "sym": {
    //         //         "exc": "NSE",
    //         //         "otherExch": [
    //         //             "BSE"
    //         //         ],
    //         //         "multiplier": "1",
    //         //         "series": "EQ",
    //         //         "lotSize": "1",
    //         //         "streamSym": "8124_NSE",
    //         //         "instrument": "STK",
    //         //         "id": "STK_AJANTPHARM_EQ_NSE",
    //         //         "asset": "equity",
    //         //         "excToken": "8124",
    //         //         "tickSize": "0.05"
    //         //     },
    //         //     "avgPrice": "",
    //         //     "qty": "200",
    //         //     "baseSym": "AJANTPHARM"
    //         // },
    //         // {
    //         //     "dispSym": "ASIANTILES",
    //         //     "haircutPer": "0",
    //         //     "sym": {
    //         //         "exc": "NSE",
    //         //         "otherExch": [
    //         //             "BSE"
    //         //         ],
    //         //         "multiplier": "1",
    //         //         "series": "EQ",
    //         //         "lotSize": "1",
    //         //         "streamSym": "14889_NSE",
    //         //         "instrument": "STK",
    //         //         "id": "STK_ASIANTILES_EQ_NSE",
    //         //         "asset": "equity",
    //         //         "excToken": "14889",
    //         //         "tickSize": "0.05"
    //         //     },
    //         //     "avgPrice": "",
    //         //     "qty": "200",
    //         //     "baseSym": "ASIANTILES"
    //         // }])
    //         streamingSubscription(response.data.marginAmount)
    //     }
    // }

    // function errorRespCBgetShortfallDetails(error) {
    //     console.log('errorshort: ', error);
    //     // setMarginDetails([{
    //     //     "dispSym": "AJANTPHARM",
    //     //     "haircutPer": "25.00",
    //     //     "sym": {
    //     //         "exc": "NSE",
    //     //         "otherExch": [
    //     //             "BSE"
    //     //         ],
    //     //         "multiplier": "1",
    //     //         "series": "EQ",
    //     //         "lotSize": "1",
    //     //         "streamSym": "8124_NSE",
    //     //         "instrument": "STK",
    //     //         "id": "STK_AJANTPHARM_EQ_NSE",
    //     //         "asset": "equity",
    //     //         "excToken": "8124",
    //     //         "tickSize": "0.05"
    //     //     },
    //     //     "avgPrice": "",
    //     //     "qty": "200",
    //     //     "baseSym": "AJANTPHARM"
    //     // },
    //     // {
    //     //     "dispSym": "ASIANTILES",
    //     //     "haircutPer": "0",
    //     //     "sym": {
    //     //         "exc": "NSE",
    //     //         "otherExch": [
    //     //             "BSE"
    //     //         ],
    //     //         "multiplier": "1",
    //     //         "series": "EQ",
    //     //         "lotSize": "1",
    //     //         "streamSym": "14889_NSE",
    //     //         "instrument": "STK",
    //     //         "id": "STK_ASIANTILES_EQ_NSE",
    //     //         "asset": "equity",
    //     //         "excToken": "14889",
    //     //         "tickSize": "0.05"
    //     //     },
    //     //     "avgPrice": "",
    //     //     "qty": "200",
    //     //     "baseSym": "ASIANTILES"
    //     // }])
    //     setShortfallAmnt(3)
    //     setMarginDetails([])
    // }

    function getMarginDetails(data) {
        console.log('responsemargin: ', data);
        let marginDtls = data
        let totalIncreasedMargin = 0
        if(marginDtls.length) {
            marginDtls.map(item => {
                if(parseFloat(item.haircutPer) > 0) {
                    if(!isValidNumber(item.avgPrice) && item.close) {
                    // console.log("avgPrice",item.haircutPer,  item, item.qty, item.close,item.haircutPer,
                    //     parseFloat(100 - parseFloat(item.haircutPer))  )
                        item.increaseMargin = parseInt(replaceComma(item.qty)) * parseFloat(replaceComma(item.close))
                    * (parseFloat((100 - parseFloat(replaceComma(item.haircutPer)))) / 100)
                        totalIncreasedMargin = totalIncreasedMargin + item.increaseMargin
                    // console.log('increaseMargin: ', item.increaseMargin);
                    }
                    else if(isValidNumber(item.avgPrice)) {
                        item.increaseMargin = parseInt(item.qty) * parseFloat(item.avgPrice)
                * parseFloat((100 - parseFloat(item.haircutPer)) / 100)
                        totalIncreasedMargin = parseFloat(totalIncreasedMargin) + parseFloat(item.increaseMargin)
                    }
                }
            })
            console.log('totalIncreasedMargin: ', totalIncreasedMargin,marginDtls );
            setTotalIncreaseMargin(totalIncreasedMargin.toFixed(2))
            // if(totalIncreasedMargin > parseFloat(shortfallAmnt) && marginDetails.length)
            //     setDisplayMarginBlock(true)
            setMarginDetails(marginDtls)

        }
    }

    function streamingSubscription(symArrayList) {
        let symbols;
        if(symArrayList.length)
            symbols = symArrayList.map(l => l.sym)
        props.forceSubscribeLevel1(symbols, [STREAMING_KEYS.LTP, STREAMING_KEYS.CHANGE, STREAMING_KEYS.CHANGE_PER,
            STREAMING_KEYS.CLOSE])
    }

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function setStreamingResptoSymbols(resp) {
        // console.log('resp order',resp, marginDetails)
        let {data} = resp
        let newList = marginDetails.map(row => {
            if (row.sym.streamSym === data.symbol) {
                row = Object.assign({}, row, applyPaint(row, data));
                console.log("closefromstream", data.close, row)
            }
            return row
        })
        getMarginDetails(newList)
       
    }

    function onClickDone() {
        callTaxDeclaration(null, TAX_DECLARE_BLOCK_SCREENS.ORDER_RESULT, closeOrder)
    }

    function closeOrder() {
        props.onCloseCB && props.onCloseCB()
        props.moveToOrderMenu({
            showOrderMenu: true
        })
    }

    function onClickActionButton() {
        if(props.resultData.actCode === FUNDS_SCREENS.ADD_FUNDS){
            props.onBackCB && props.onBackCB(props.trade_type)
            props.history.push(SCREENS.FUNDS);
        }
    }

    function getHoldings() {
        let request = new MsfRequest();
        request.addToData({})
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + HOLDINGS.GET_HOLDINGS_BO,
            request,
            successRespCBGetHoldings,
            errorRespCBGetHoldings
        )
    }

    function successRespCBGetHoldings(response) {
        storeHoldingsResponseToStore(response.data.holdings)
        console.log("response-hold",response);
    }

    function errorRespCBGetHoldings(error) {
        console.log('error: ', error);
    }

    function onClickCancel() {
        props.onBackCB && props.onBackCB(props.trade_type)
    }

    function onClickIncreaseMargin() {
        props.storeShowPledgeFlag(true)
        props.onCloseCB && props.onCloseCB()
    }

    return (      
        <div className={`orderConfirmSuccess 
        ${props.resultData.actCode === "ADD_FUNDS" && (marginDetails.length === 0 || 
            parseFloat(totalIncreaseMargin) < parseFloat(shortfallAmnt))  ? "medium" : ""} 
        ${props.resultData.actCode === "ADD_FUNDS" && 
        marginDetails.length > 0 && totalIncreaseMargin >= parseFloat(shortfallAmnt)? "large" : ""}`}>
            {console.log("marginDet123",marginDetails,parseFloat(totalIncreaseMargin),props.resultData.shortfallAmnt  )}
            <div className="success-button">
                {
                    orderHeadName === ORDER_RESULT_HEADER.FAIL || orderHeadName === ORDER_RESULT_HEADER.CANCELLED || 
                    orderHeadName === ORDER_RESULT_HEADER.REJECTED ?

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
                orderHeadName === ORDER_RESULT_HEADER.FAIL || 
                orderHeadName === ORDER_RESULT_HEADER.REJECTED ?
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
            
            {console.log("short", props.resultData)}
            {
                orderHeadName === ORDER_RESULT_HEADER.REJECTED && props.resultData.actCode === "ADD_FUNDS" &&
                 props.resultData.shortfallAmnt  ?
                
                    <div className="shortfall-row">
                        <span className="label">
                            <LangText name="SHORTFALL_AMT"/>
                        </span>
                        <span className="value">
                        ₹{props.resultData.shortfallAmnt}
                        </span>
                    </div>
                    :
                    null
            }
            <div className={(showActionButton) ?
                "result-btns" : "result-donebtn"}>
                {/* {console.log("marginlength",marginDetails, marginDetails.length, totalIncreaseMargin, props.resultData.shortfallAmnt, shortfallAmnt)} */}
                {
                    marginDetails.length === 0 || parseFloat(totalIncreaseMargin) < parseFloat(shortfallAmnt)?
                        <div className="result-done">
                            <button className={`okay-btn ${showActionButton ? "with-addfunds": ""}`} 
                                onClick={onClickDone}>
                                <LangText module="BUTTONS" name="DONE" /></button>
                        </div>
                        :
                        null
                }
                <div className="result-addFunds">
                    {
                        showActionButton ?
                            <button className="add-funds" onClick={onClickActionButton}> 
                                {convertToUpperCase(props.resultData.actDisp)}
                                {/* Add FUNDS */}
                            </button>
                            :
                            null
                    }
                </div>  
            </div>
            {
                
                marginDetails.length > 0 && 
                parseFloat(totalIncreaseMargin) >= parseFloat(shortfallAmnt)? 
                    <div className="margin-block">          
                        <div className= "margin-row">
                            <div className="text1">
                                <span className="textVal"><LangText name= "GET"/></span>
                                <span className="increase-margin-val">  ₹{convertCommaSeparated(totalIncreaseMargin)}
                                </span> 
                                <span className="textVal"> <LangText name= "IN_5_MINUTES"/></span>
                            </div>
                            <span className="text2"><LangText name="INCREASE_YOUR_MARGIN"/></span>
                        </div>
                        <div className="margin-action-row">
                            <button className="cancel-btn" onClick= {onClickCancel}><LangText name= "CANCEL"/></button>
                            <button className="margin-btn theme-btn" onClick= {onClickIncreaseMargin}>
                                <LangText name="INCREASE_MARGIN"/></button>
                        </div> 
                    </div> 
                    :           
                    null
                
            }        
            <div className="footer-div">

            </div>
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
        moveToOrderMenu: (s) => { dispatch(moveToOrderMenu(s)) },
        storeShowPledgeFlag: (s) => { dispatch(storeShowPledgeFlag(s)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStreaming(OrderConfirmSuccessComponent)));
