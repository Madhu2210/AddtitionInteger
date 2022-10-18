import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";

import LangText from '../../../../common/lang/LangText';

// import {  gotoTrade } from '../../../../common/Bridge';
import { storePositionsDialogSymStreamingData, storeSelectedQuoteSym } from '../../../../state/actions/Actions';

import { checkEmpty, convertToUpperCase, getColorBuySellAction } from '../../../../common/CommonMethods';
import {   THEMES } from '../../../../common/Constants';

function NetPositionDialogComponent(props) {

    const [symDetails, setSymDetails] = useState(props.details.symData ? props.details.symData : {})
    const [isAllQtyTraded, setIsAllQtyTraded] = useState(false)

    useEffect(() => {
        if (parseInt(symDetails.netQty) <= 0)
            setIsAllQtyTraded(true)
        props.storeSelectedQuoteSym(null)
            
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
                    {
                        JSON.parse(symDetails.transferable) ?
                            <button className="convert-btn"
                                onClick={() => gotoOrderDialog(symDetails, ORDER_DIALOGS.CONVERT)}>
                                <LangText module="BUTTONS" name="CONVERT" />
                            </button>
                            : null
                    }
                    {
                        JSON.parse(symDetails.isSquareoff) ?
                            <button className="theme-btn" onClick={onClickTradeRev}>
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
                </div>
            </div> */}
        </div>
    )
}

const mapStateToProps = ({ order, settings }) => {
    return {
        dialogSymStreamingData: order.dialogSymStreamingData,
        selectedTheme: settings.selectedTheme
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storePositionsDialogSymStreamingData: (s) => { dispatch(storePositionsDialogSymStreamingData(s)) },
        storeSelectedQuoteSym: (s) => { dispatch(storeSelectedQuoteSym(s)) }
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NetPositionDialogComponent);