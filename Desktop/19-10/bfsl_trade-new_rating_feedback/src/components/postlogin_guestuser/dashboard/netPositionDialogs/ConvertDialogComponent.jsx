import React, { useState } from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../../index'

import LangText, { getLangText } from '../../../../common/lang/LangText';
import InputComponent from '../../../common/InputComponent';

import { checkEmpty, checkInt, convertToUpperCase, getBaseURL, 
    getColorBuySellAction, isValidNumber } from '../../../../common/CommonMethods';
import {
    INSTRUMENT_TYPES, ORDER_DIALOGS,
    TEXT_ORIENTATION, TRADE_PRODUCT_TYPES, THEMES, STK_GUEST_PRODUCT_TYPES
} from '../../../../common/Constants';
import { TRADE_GUEST } from '../../../../config/ServiceURLs';
import { storeOrderDialogDetails } from '../../../../state/actions/Actions';
import { RightArrowIcon } from '../../../common/FontIcons';

function ConvertDialogComponent(props) {

    const MsfFetch = useFetch()

    const { details } = props
    const { symData } = details

    const [convertTypes, setConvertTypes] = useState([])
    const [selectedConvertType, setSelectedConvertType] = useState(null)
    const [convertQty, setConvertQty] = useState('')
    const [conQtyErr, setConQtyErr] = useState('')

    useState(() => {
        let instrument = symData.sym.instrument
        let prdType = symData.prdType
        let list = []
        if (instrument === INSTRUMENT_TYPES.STK) {
            let typeList = Object.assign([], STK_GUEST_PRODUCT_TYPES)
            list = typeList.filter(item => item !== convertToUpperCase(prdType))
        }
        else {
            if (prdType === TRADE_PRODUCT_TYPES.NORMAL) {
                list.push(TRADE_PRODUCT_TYPES.INTRADAY)
            }
            else if (prdType === TRADE_PRODUCT_TYPES.INTRADAY) {
                list.push(TRADE_PRODUCT_TYPES.NORMAL)
            }
        }

        setConvertTypes(list)
        setSelectedConvertType(list[0])
    }, [])

    function onChangeConvertQty(e) {
        let val = e.target.value
        if (isValidNumber(val))
            setConvertQty(val)
        else if (!val.length)
            setConvertQty(val)
    }

    function onClickConvert() {
        let nQty = symData.netQty
        nQty = Math.abs(nQty)
        if (convertQty && convertQty.length) {
            if (convertQty == 0) {
                setConQtyErr(getLangText('INVALID_QTY', 'DASHBOARD'))
            } else if (checkInt(convertQty) && (parseInt(nQty) >= convertQty)) {
                props.showWidgetLoader();
                setConQtyErr('')
                let request = new MsfRequest();
                request.addToData({
                    ordAction: symData.ordAction,
                    toPrdType: selectedConvertType,
                    prdType: symData.prdType,
                    qty: convertQty.toString(),
                    sym: symData.sym,
                    type: symData.type
                })
                MsfFetch.placeRequest(
                    getBaseURL() + TRADE_GUEST.POS_CONVERSION,
                    request,
                    successRespCBGetPosCon,
                    errorRespCBGetPosCon
                )
            }
            else {
                setConQtyErr(getLangText('NETPOSTION_QTY_MSG', 'DASHBOARD'))
            }
        } else {
            setConQtyErr(getLangText('QUANTITY_EMPTY', 'DASHBOARD'))
        }
    }

    function successRespCBGetPosCon(response) {
        props.hideWidgetLoader();
        props.onCloseCB && props.onCloseCB()
        props.parentCB && props.parentCB()
        props.storeOrderDialogDetails({
            dialogName: ORDER_DIALOGS.CONVERT_RESULT,
            resultData: {
                success: true,
                symName: symData.dispSym,
                qty: convertQty.toString(),
                pType: selectedConvertType,
                message: response.infoMsg
            }
        })
    }

    function errorRespCBGetPosCon(error) {
        props.hideWidgetLoader();
        props.onCloseCB && props.onCloseCB()
        props.storeOrderDialogDetails({
            dialogName: ORDER_DIALOGS.CONVERT_RESULT,
            resultData: {
                success: false,
                symName: symData.dispSym,
                qty: convertQty.toString(),
                pType: selectedConvertType,
                message: error.message
            }
        })
    }

    return (
        <div className="orderSymDetails-modal convert-dialog">
            <div className="orderDialog-headerDetails">
                <div className="dialogHeader-symDetails">
                    <span className={`dialogHeader-orderAction 
                     ${getColorBuySellAction(props.details.symData.ordAction)}`}>
                        {convertToUpperCase(props.details.symData.ordAction)}</span>
                    <span className="dialogHeader-symbolname"> {props.details.symData.baseSym}</span>
                    <span className="dialogHeader-exchange">
                        {props.details.symData.sym.exc}</span>
                </div>

                <div className="dialogHeader-statusDetails">
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
                <div className="pTypeDiv">
                    <span className="details">
                        <span>
                            <LangText module="TABLE_HEADERS" name="PRODUCT_TYPE" />
                        </span>
                        <span className="value">{checkEmpty(convertToUpperCase(symData.prdType))}</span>
                    </span>
                    <span className="details flex-center">
                        <RightArrowIcon />
                    </span>
                    <span className="details">
                        <span>
                            <LangText module="DASHBOARD" name="CONVERT_TO" />
                        </span>
                        <span className="value">
                            {
                                convertTypes.map((item, index) => {
                                    return (
                                        <span key={index}
                                            className={`types ${selectedConvertType === item ? 'selected' : ''}`}
                                            onClick={() => setSelectedConvertType(item)}
                                        >
                                            {item}
                                        </span>
                                    )
                                })
                            }
                        </span>
                    </span>
                </div>
                <div className="qtyDiv">
                    <span className="details">
                        <span>
                            <LangText module="DASHBOARD" name="TOTAL_QUANTITYS" />
                        </span>
                        <InputComponent
                            className="value"
                            value={checkEmpty(convertToUpperCase(symData.netQty))}
                            disabled
                        // maxLength={5}
                        />
                    </span>
                    <span className="details">
                        <span>
                            <LangText module="DASHBOARD" name="CONVERT_QUANTITY" />
                        </span>
                        <InputComponent
                            className="value"
                            onChange={onChangeConvertQty}
                            value={convertQty}
                            maxLength={10}
                        />
                    </span>
                </div>
            </div>
            <div className="footer netPostions">
                <div className="msgDiv">
                    <div className="errorDiv">
                        {conQtyErr}
                    </div>
                </div>
                <div className="actionDiv">
                    <button className="convert-btn" onClick={props.onCloseCB}>
                        <LangText module="BUTTONS" name="CANCEL" orientation={TEXT_ORIENTATION.LOWERCASE} />
                    </button>
                    <button className={`theme-btn `} onClick={onClickConvert}>
                        <LangText module="BUTTONS" name="CONVERT" />
                    </button>
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
        storeOrderDialogDetails: (s) => { dispatch(storeOrderDialogDetails(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConvertDialogComponent);