import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";

import LangText from '../../../../common/lang/LangText';

import { getTaxDecalreDetails } from '../../../../common/Bridge';
import { showAppDialog, storePositionsDialogSymStreamingData, storeSelectedQuoteSym, 
} from '../../../../state/actions/Actions';

import { checkEmpty, convertToUpperCase, 
    getColorBuySellAction } from '../../../../common/CommonMethods';
import {
    TAX_DECLARATION_MSG_KEY, THEMES
} from '../../../../common/Constants';

function NetPositionDialogComponent(props) {

    const [symDetails, setSymDetails] = useState(props.details.symData ? props.details.symData : {})
    const [isAllQtyTraded, setIsAllQtyTraded] = useState(false)
    // const [convertMsg, setConvertMsg] = useState('')

    useEffect(() => {
        let taxDetails = getTaxDecalreDetails()
        let convertChkMsg = taxDetails.declarationMsgs[TAX_DECLARATION_MSG_KEY.ID_POSITION_CONVERSION]
        console.log("taxDetails", taxDetails, convertChkMsg)
        // setConvertMsg(convertChkMsg)
        props.storeSelectedQuoteSym(null)
    }, [])

    useEffect(() => {
        if (parseInt(symDetails.netQty) <= 0)
            setIsAllQtyTraded(true)
    }, [])

    useEffect(() => {
        if (props.dialogSymStreamingData) {
            let data = Object.assign({}, symDetails, props.dialogSymStreamingData)
            setSymDetails(data)
        }
    }, [props.dialogSymStreamingData])

    // function onClickTradeRev() {
    //     if (parseInt(symDetails.netQty) > 0)
    //         gotoTrade(symDetails, ORDER_TYPES.SELL)
    //     else
    //         gotoTrade(symDetails, ORDER_TYPES.BUY)

    //     onCloseDialog()
    // }

    // function onClickTrade(type) {
    //     gotoTrade(symDetails, type)
    //     onCloseDialog()
    // }

    function onCloseDialog() {
        props.storePositionsDialogSymStreamingData(null)
        props.onCloseCB && props.onCloseCB()
    }

    // function onClickConvert(data, dialog) {
    //     let checkTradeBlock = props.profileData.isTradeBlock ? props.profileData.isTradeBlock : false
    //     if (checkTradeBlock === true && dialog === ORDER_DIALOGS.CONVERT) {
    //         // return <ClosePopupInfo message={idCancelMsg} show={idCancelShow} closeCB={setIdCancelShow(false)}/>;
    //         props.showAppDialog({
    //             title: getLangText('ALERT_APP', 'LOGIN'),
    //             message: convertMsg,
    //             defaultBtnName: getLangText('OK', 'BUTTONS'),
    //             show: true
    //         })
    //     }
    //     else {
    //         gotoOrderDialog(data, ORDER_DIALOGS.CONVERT)
    //     }
    // }

    // function onClickBuySellMoreAction(item){
    //     let orderActionVal;
    //     if(isBuyTradeAction(item.ordAction)){

    //         orderActionVal = ORDER_TYPES.BUY
    //     }
    //     else if(isSellTradeAction(item.ordAction)){
    //         orderActionVal = ORDER_TYPES.SELL
    //     }

    //     gotoTrade(item, orderActionVal,false)
    // }

    // function onClickStopLossAction(item){
    //     let orderActionVal;
    //     if(isBuyTradeAction(item.ordAction)){

    //         orderActionVal = ORDER_TYPES.BUY
    //     }
    //     else if(isSellTradeAction(item.ordAction)){
    //         orderActionVal = ORDER_TYPES.SELL
    //     }

    //     gotoTrade(item, orderActionVal,true)
    // }

    return (
        <div className="orderSymDetails-modal orderDialog-displayDetails netPositions-details">
            <div className="orderDialog-headerDetails">
                <div className="dialogHeader-symDetails">
                    <span className={`dialogHeader-orderAction 
                     ${getColorBuySellAction(symDetails.ordAction)}`}>
                        {convertToUpperCase(symDetails.ordAction)}</span>
                    <span className="dialogHeader-symbolname"> {symDetails.baseSym}</span>
                    <span className="dialogHeader-exchange">
                        {symDetails.sym.exc}</span>
                </div>

                <div className="dialogHeader-statusDetails">
                    <div className="close-button flex-center" onClick={onCloseDialog}>
                        {
                            props.selectedTheme.theme === THEMES.LIGHT ?
                                <img src="assets/images/dashboard/close_icon.svg" alt="" />
                                :
                                <img src="assets/images/dark/dashboard/close_icon.svg" alt="" />
                        }
                    </div>
                </div>
            </div>
            <div className="orderDialog-bodyDetails">
                <div className="orderDialog-bodyDetails-col">
                    <span className="details first">
                        <span>
                            <LangText module="TABLE_HEADERS" name="NET_QTY" />
                        </span>
                        <span className="value">{checkEmpty(symDetails.netQty)}</span>
                    </span>
                    <span className="details first">
                        <span>
                            <LangText module="TABLE_HEADERS" name="BUY_QTY" />
                        </span>
                        <span className="value">{checkEmpty(symDetails.buyQty)}</span>
                    </span>
                </div>
                <div className="orderDialog-bodyDetails-col">
                    <span className="details">
                        <span>
                            <LangText module="TABLE_HEADERS" name="AVG_PRICE" />
                        </span>
                        <span className="value">{checkEmpty(symDetails.avgPrice)}</span>
                    </span>
                    <span className="details">
                        <span>
                            <LangText module="TABLE_HEADERS" name="BUY_AVG_PRICE" />
                        </span>
                        <span className="value">{checkEmpty(symDetails.buyAvgPrice)}</span>
                    </span>
                </div>
                <div className="orderDialog-bodyDetails-col">
                    <span className="details">
                        <span>
                            <LangText module="TABLE_HEADERS" name="LTP" />
                        </span>
                        <span className="value">
                            <span className={symDetails.ltpClass}>{checkEmpty(symDetails.ltp)}</span>
                        </span>
                    </span>
                    <span className="details">
                        <span>
                            <LangText module="TABLE_HEADERS" name="BUY_VAL" />
                        </span>
                        <span className="value">{checkEmpty(symDetails.buyVal)}</span>
                    </span>
                </div>
                <div className="orderDialog-bodyDetails-col">
                    <span className="details">
                        <span>
                            <LangText module="TABLE_HEADERS" name="PRODUCT" />
                        </span>
                        <span className="value">{checkEmpty(symDetails.prdType)}</span>
                    </span>
                    <span className="details">
                        {
                            isAllQtyTraded ?
                                <>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="SELL_QTY" />
                                    </span>
                                    <span className="value">{checkEmpty(symDetails.sellQty)}</span>
                                </>
                                : null
                        }
                    </span>
                </div>
                <div className="orderDialog-bodyDetails-col">
                    <span className="details">
                        <span>
                            <LangText module="TABLE_HEADERS" name="DAYS_PL" />
                        </span>
                        <span className="value">{checkEmpty(symDetails.daypnl)}</span>
                    </span>
                    <span className="details">
                        {
                            isAllQtyTraded ?
                                <>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="SELL_AVG_PRICE" />
                                    </span>
                                    <span className="value">{checkEmpty(symDetails.sellAvgPrice)}</span>
                                </>
                                : null
                        }
                    </span>
                </div>
                <div className="orderDialog-bodyDetails-col">
                    <span className="details last">
                        <span>
                            <LangText module="TABLE_HEADERS" name="P_L" />
                        </span>
                        <span className="value">{checkEmpty(symDetails.pnl)}</span>
                    </span>
                    <span className="details last">
                        {
                            isAllQtyTraded ?
                                <>
                                    <span>
                                        <LangText module="TABLE_HEADERS" name="SELL_VAL" />
                                    </span>
                                    <span className="value">{checkEmpty(symDetails.sellVal)}</span>
                                </>
                                : null
                        }
                    </span>
                </div>
            </div>
            {/* <div className="footer">
                <div className="msgDiv">

                </div>
                <div className="actionDiv">
                    {console.log('symDetails99 :', symDetails)}
                    {
                        JSON.parse(symDetails.transferable) ?
                            <button className="convert-btn"
                                onClick={() =>
                                    onClickConvert(symDetails, ORDER_DIALOGS.CONVERT)}>
                                <LangText module="BUTTONS" name="CONVERT" />
                            </button>
                            : null
                    }
                    {
                        JSON.parse(symDetails.isSquareoff) ?
                            <button className="trade-btn" onClick={onClickTradeRev}>
                                <LangText module="BUTTONS" name="EXIT" />
                            </button>
                            :
                            <>
                                <button className="buy-btn2" onClick={() => onClickTrade(ORDER_TYPES.BUY)}>
                                    <LangText module="BUTTONS" name="BUY" />
                                </button>
                                <button className="sell-btn2" onClick={() => onClickTrade(ORDER_TYPES.SELL)}>
                                    <LangText module="BUTTONS" name="SELL" />
                                </button>
                            </>
                    }
                    <button className="stopLoss-btn" onClick={() => onClickStopLossAction(symDetails)}>
                        <LangText name="STOP LOSS" />
                    </button>
                    {
                        JSON.parse(symDetails.isSquareoff) ?
                            <button className={`${isBuyTradeAction(symDetails.ordAction) ? 'buy-btn2' : 'sell-btn2'}`} 
                                onClick={() => onClickBuySellMoreAction(symDetails)}>
                                {isBuyTradeAction(symDetails.ordAction) ? <LangText name="BUY_MORE" /> : 
                                    <LangText name="SELL_MORE" />} 
                        
                            </button>: null }
                </div>
            </div> */}
        </div>
    )
}

const mapStateToProps = ({ order, settings, profileDialog }) => {
    return {
        dialogSymStreamingData: order.dialogSymStreamingData,
        selectedTheme: settings.selectedTheme,
        profileData: profileDialog.profileDetails
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storePositionsDialogSymStreamingData: (s) => { dispatch(storePositionsDialogSymStreamingData(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeSelectedQuoteSym: (s) => { dispatch(storeSelectedQuoteSym(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NetPositionDialogComponent);