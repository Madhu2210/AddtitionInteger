import React ,{useEffect}from 'react'
import { connect } from 'react-redux';

import { gotoOrderDialog, gotoQuote, gotoTrade } from '../../../../../common/Bridge';
import {
    convertToUpperCase, getOrderStatusClass,
    checkEmpty, isExecutedOrder, getColorBuySellAction
} from '../../../../../common/CommonMethods';
import { ORDER_DIALOGS, ORDER_MODIFY_TYPE, ORDER_STATUS, ORDER_TYPES, TEXT_ORIENTATION, THEMES, 
    TRADE_VALIDITY_TYPES } from '../../../../../common/Constants';
import LangText from '../../../../../common/lang/LangText'
import { storeSelectedQuoteSym } from '../../../../../state/actions/Actions';

function OrderSymDialogComponent(props) {
    const { orderBookDetails } = props
    const { symData } = orderBookDetails
    // const childlist = symData.childs;

    useEffect(()=>{
        props.storeSelectedQuoteSym(null)

    },[])

    function onClickModifyOrder(type) {
        props.parentCB && props.parentCB(symData, type)
        props.onCloseCB && props.onCloseCB()
    }

    function gotoQuoteCB() {
        gotoQuote(symData, true)
        props.onCloseCB && props.onCloseCB()
    }

    function gotoTradeCB(type) {
        gotoTrade(symData, type)
        props.onCloseCB && props.onCloseCB()
    }

    return (
        <div className="orderSymDetails-modal orderDialog-displayDetails">
            <div className="orderDialog-headerDetails">
                <div className="dialogHeader-symDetails">
                    <span className={`dialogHeader-orderAction 
                     ${getColorBuySellAction(props.orderBookDetails.symData.ordAction)}`}>
                        {convertToUpperCase(props.orderBookDetails.symData.ordAction)}</span>
                    <span className="dialogHeader-symbolname"> {props.orderBookDetails.symData.baseSym}</span>
                    <span className="dialogHeader-exchange">
                        {props.orderBookDetails.symData.sym.exc}</span>
                </div>

                <div className="dialogHeader-statusDetails">
                    <span className={`dialogHeader-orderStatus
                     ${getOrderStatusClass(props.orderBookDetails.symData.status)}`}>
                        {convertToUpperCase(props.orderBookDetails.symData.status)}
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
            <div className="orderDialog-bodyDetails">
                <div className="orderDialog-bodyDetails-Row1">
                    <span className="details first">
                        <span>
                            <LangText module="TABLE_HEADERS" name="QTY"
                                orientation={TEXT_ORIENTATION.UPPERCASE} />
                        </span>
                        <span className="value">{checkEmpty(symData.tradedQty)}</span>
                    </span>
                    <span className="details">
                        <span>
                            <LangText module="DASHBOARD" name="ORD_QTY" />
                        </span>
                        <span className="value">{checkEmpty(symData.qty)}</span>
                    </span>
                    <span className="details">
                        <span>
                            <LangText module="TABLE_HEADERS" name="TRIGGER_PRICE" />
                        </span>
                        <span className="value">{checkEmpty(symData.triggerPrice)}</span>
                    </span>
                    <span className="details">
                        <span>
                            <LangText module="TABLE_HEADERS" name="LTP" />
                        </span>
                        <span className="value">{checkEmpty(symData.ltp)}</span>
                    </span>
                    <span className="details">
                        <span>
                            <LangText module="TABLE_HEADERS" name="PRODUCT" />
                        </span>
                        <span className="value">{checkEmpty(symData.prdType)}</span>
                    </span>
                    <span className="details last">
                        <span>
                            <LangText module="DASHBOARD" name="ORDER" />
                        </span>
                        <span className="value">{convertToUpperCase(checkEmpty(symData.ordType))}</span>
                    </span>
                </div>
                <div className="orderDialog-bodyDetails-Row2">
                    <span className={`details 
                    ${symData.ordDuration ===TRADE_VALIDITY_TYPES.GTD ? "gtd" : ''} first`}>
                        <span>
                            <LangText module="DASHBOARD" name="VALIDTY" />
                        </span>
                        <span className="value">{checkEmpty(symData.ordDuration)}</span>
                    </span>
                    {
                        isExecutedOrder(props.orderBookDetails.symData.status) ?
                            <span className={`details 
                            ${symData.ordDuration ===TRADE_VALIDITY_TYPES.GTD ? "gtd" : ''} `}>
                                <span>
                                    <LangText module="DASHBOARD" name="AVG_PRICE" />
                                </span>
                                <span className="value">{checkEmpty(symData.avgPrice)}</span>
                            </span>
                            : null
                    }
                    {symData.ordDuration ===TRADE_VALIDITY_TYPES.GTD ?
                        <span className={`details 
                        ${symData.ordDuration ===TRADE_VALIDITY_TYPES.GTD ? "gtd" : ''} `}>
                            <span>
                                <LangText module="DASHBOARD" name="VALIDITY_DATE" />
                            </span>
                            <span className="value">{checkEmpty(symData.ordValDate)}</span>
                        </span> :
                        null
                    }
                    <span className={`details 
                    ${symData.ordDuration ===TRADE_VALIDITY_TYPES.GTD ? "gtd" : ''} `}>
                        <span>
                            <LangText module="DASHBOARD" name="DISCLOSED_QTY" />
                        </span>
                        <span className="value">{checkEmpty(symData.disQty)}</span>
                    </span>
                    {
                        (symData.ordDuration === TRADE_VALIDITY_TYPES.GTD || 
                            symData.ordDuration === TRADE_VALIDITY_TYPES.GTC) ?
                            <span className={`details 
                            ${symData.ordDuration ===TRADE_VALIDITY_TYPES.GTD ? "gtd" : ''} `}>
                                <span>
                                    <LangText module="DASHBOARD" name="TRIGGER_ID" />
                                </span>
                                <span className="value">{checkEmpty(symData.triggerid)}</span>
                            </span> :
                            null   
                    }
                    <span className={`details 
                    ${symData.ordDuration ===TRADE_VALIDITY_TYPES.GTD ? "gtd" : ''} `}>
                        <span><LangText module="TABLE_HEADERS" name="ORDER_ID" /></span>
                        <span className="value">{checkEmpty(symData.ordId)}</span>
                    </span>
                    <span className={`details 
                    ${symData.ordDuration ===TRADE_VALIDITY_TYPES.GTD ? "gtd" : 
            (symData.ordDuration ===TRADE_VALIDITY_TYPES.GTC &&
                    isExecutedOrder(props.orderBookDetails.symData.status)) ? "gtc-exec" : '' }  date`} >
                        <span><LangText module="DASHBOARD" name="ORDER_DATE_TIME" /></span>
                        <span className="value">{checkEmpty(symData.ordDate)}</span>
                    </span>
                    {
                        !isExecutedOrder(props.orderBookDetails.symData.status) ?
                            <span></span>
                            : null
                    }
                    {symData.ordDuration !== TRADE_VALIDITY_TYPES.GTC ?
                        <span></span> :
                        null
                    }
                </div>
            </div>
            <div className="footer">
                <div className="msgDiv">
                    {
                        (orderBookDetails.symData.status === ORDER_STATUS.REJECTED) ?
                            <div className="rejected-reason">
                                <div className="reason-lbl">
                                    <LangText module="ORDERBOOK_MSGS" name="REASON" />
                                </div>
                                <div className="rej-reason text-nowrap"
                                    title={props.orderBookDetails.symData.rejReason}>
                                    {props.orderBookDetails.symData.rejReason}
                                </div>
                            </div>
                            : null
                    }
                </div>
                <div className="actionDiv">
                    <button className="theme-btn3 "
                        onClick={() => gotoOrderDialog(symData, ORDER_DIALOGS.ORDERTRIAL_DETAILS, props.parentCB)}>
                        <span className="order-trial">
                            <LangText module="BUTTONS" name="ORDER_TRAILS" /> </span>
                    </button>
                    {
                        ((props.orderBookDetails.symData.modifiable === 'true')
                            &&
                            ((props.orderBookDetails.symData.cancellable === 'true') 
                            || JSON.parse(props.orderBookDetails.symData.exitable))
                             && orderBookDetails.symData.status !== ORDER_STATUS.REJECTED) ?
                            <>
                                {
                                    JSON.parse(props.orderBookDetails.symData.cancellable) ?
                                        <button className="theme-btn2 cancel-order"
                                            onClick={() => gotoOrderDialog(symData,
                                                ORDER_DIALOGS.PENDING_D_CANCEL_ORDER)}
                                            disabled={!(JSON.parse(props.orderBookDetails.symData.cancellable))}
                                        >
                                            <LangText module="BUTTONS" name="CANCEL_ORDERS" />
                                        </button>
                                        :
                                        (
                                            JSON.parse(props.orderBookDetails.symData.exitable) ?
                                                <button className="theme-btn2 cancel-order"
                                                    onClick={() => gotoOrderDialog(symData, ORDER_DIALOGS.EXIT_ORDER)}
                                                    disabled={!(JSON.parse(props.orderBookDetails.symData.exitable))}
                                                >
                                                    <LangText module="BUTTONS" name="EXIT_ORDER_BTN" />
                                                </button>
                                                : null
                                        )
                                }
                                <button className="theme-btn modify-pending-order"
                                    onClick={() => onClickModifyOrder(ORDER_MODIFY_TYPE.MODIFY)}
                                    disabled={!(JSON.parse(props.orderBookDetails.symData.modifiable))}
                                >
                                    <LangText module="BUTTONS" name="MODIFY" />
                                </button>
                            </>
                            :
                            <>
                                <button className="theme-btn2" onClick={gotoQuoteCB}>
                                    <LangText module="BUTTONS" name="QUOTE" />
                                </button>
                            </>
                    }
                    {
                        orderBookDetails.symData.status === ORDER_STATUS.EXECUTED ?
                            <button className="theme-btn" onClick={() => gotoTradeCB(ORDER_TYPES.BUY)}>
                                <LangText module="BUTTONS" name="TRADE" />
                            </button> :
                            orderBookDetails.symData.status === ORDER_STATUS.REJECTED ?
                                <button className="theme-btn"
                                    onClick={() => onClickModifyOrder(ORDER_MODIFY_TYPE.RE_ORDER)}>
                                    <LangText module="BUTTONS" name="RETRY" />
                                </button> :
                                null
                    }
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeSelectedQuoteSym: (s) => { dispatch(storeSelectedQuoteSym(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderSymDialogComponent);
