import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import InputComponent from '../../../common/InputComponent';
import LangText, { getLangText } from '../../../../common/lang/LangText';
import SelectInputComponent from '../../../common/SelectInputComponent';
import Loader from '../../../common/ModalDialogLoaderComponent'

import {
    CheckBoxIcon_Checked,
    CheckBoxIcon_UnChecked, CircleMinusIcon, CirclePlusIcon, CloseIcon
} from '../../../common/FontIcons';
import {
    checkInt, countHoleNumbers,
    getBackOfficeBaseURL, checkEmpty, convertCommaSeparated, replaceComma, findAndReplace, getOrderPadErrorMessage
} from '../../../../common/CommonMethods';
import {
    ORDERPAD_FIIELD_KEYS, ORDER_FIELD_MAX_VALUE_QTY,
    TEXT_ORIENTATION, ORDER_FIELD_MAX_VALUE_PAYABLE_AMOUNT, NCD_DIALOGS, NCD_MESSAGES, LOCAL_STORAGE, EMPTY, INVALID
} from '../../../../common/Constants';
import { NCD_SERVICE } from '../../../../config/ServiceURLs';
// import { ORDERPAD_MESSAGES } from '../../../../common/Messages';
import { connect } from 'react-redux';
import { storeNCDDialogDetails } from '../../../../state/actions/Actions';
import { getItemFromSessionStorage } from '../../../../common/LocalStorage';

function PlaceNCDOrderDialogComponent(props) {

    const MsfFetch = useFetch()

    const [disableAddQty, setDisableAddQty] = useState(false)
    const [disableSubQty, setDisableSubQty] = useState(true)
    const [quantity, setQty] = useState('')
    const [lotSize, setLotSize] = useState('')
    const [price, setPrice] = useState('')
    const [multipleOfQty, setMultipleOfQty] = useState('')
    const [upiList, setUPIList] = useState([])
    const [upiId, setUPIId] = useState('')
    const [showLoader, setShowLoader] = useState(false)
    const [selectedUPIHandler, setSelectedUPIHandler] = useState('')
    const [payAmount, setPayAmount] = useState('')
    const [isAgreed, setIsAgreed] = useState(false)
    const [fieldErrorMsg, setFieldErrorMsg] = useState(false)
    const [errorPayable, setErrorPayable] = useState('')
    const [errorQty, setErrorQty] = useState('')
    const [declaration, setDeclaration] = useState('')
    const [upiError, setUpiError] = useState(null)

    useEffect(() => {
        let info = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.NCD_INFO))
        setDeclaration(info.ApplyNCD2)
        getUPIList()
    }, [])

    useEffect(() => {
        if(upiError) {
            // console.log('upiError :', upiError);
            getUPIList()
        }
    }, [upiError])

    useEffect(() => {
        if (props.symData || props.seriesData) {
            if (props.symData.qty)
                setQty(props.symData.qty)
            if (props.symData.upiId)
                setUPIId(props.symData.upiId)
            if (props.symData.qty > props.symData.minLotSize)
                setDisableSubQty(false)
            // removing rupee symbol from issuePrice
            setPrice(findAndReplace(props.symData.issuePrce, '₹'))
            setLotSize(props.symData.minLotSize)
            setMultipleOfQty(props.symData.multplOfQlty)
        }
    }, [props.symData, props.seriesData])

    useEffect(() => {
        if (quantity && price) {
            setPayAmount(parseInt(replaceComma(quantity)) * parseFloat(replaceComma(price)))
        } else
            setPayAmount('')
    }, [quantity])

    function getUPIList() {
        setShowLoader(true)
        setUPIList([])
        setUpiError(null)
        let request = new MsfRequest({});
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + NCD_SERVICE.GET_UPI_LIST,
            request,
            successRespCBGetUPIList,
            errorRespCBGetUPIList
        )
    }

    function successRespCBGetUPIList(response) {
        // console.log('response :', response);
        if (response.data.handlrs && response.data.handlrs.length) {
            setUPIList(response.data.handlrs)
            if (!props.selectedUPIHandler)
                setSelectedUPIHandler(response.data.handlrs[0])
            else
                setSelectedUPIHandler(props.selectedUPIHandler)
        }
        setShowLoader(false)
    }

    function errorRespCBGetUPIList(error) {
        setUpiError(error.message)
        setUPIList([])
        setShowLoader(false)
    }

    function onChangeQty(e) {
        // setErrorQty('')
        let value = e.target.value
        let valLength = countHoleNumbers(value)
        let min = lotSize ? lotSize : 1
        let qtyVal = ''
        // let payableFinal = parseInt(value) * parseFloat(replaceComma(price))
        if (value) {
            if (checkInt(value)) {
                if (valLength <= countHoleNumbers(ORDER_FIELD_MAX_VALUE_QTY)) {
                    setQty(value)
                    qtyVal = value
                } else
                    qtyVal = quantity
            }
        } else
            setQty('')

        if (parseInt(qtyVal) >= ORDER_FIELD_MAX_VALUE_QTY) {
            setDisableAddQty(true)
        }
        // else if (payableFinal > ORDER_FIELD_MAX_VALUE_PAYABLE_AMOUNT) {
        //     // setQty(quantity)
        //     setDisableAddQty(true)
        //     setErrorPayable(getLangText('QTY_ERROR', 'NCD'))
        // }
        else {
            setDisableAddQty(false)
            setErrorPayable('')
        }

        if (parseInt(qtyVal) <= min || !parseInt(qtyVal))
            setDisableSubQty(true)
        else
            setDisableSubQty(false)
    }

    function onChangeQtyInc(type) {
        // setErrorQty('')
        // let inputValid = ORDER_FIELD_MAX_VALUE_PAYABLE_AMOUNT / parseFloat(replaceComma(price))
        let lot = multipleOfQty ? multipleOfQty : 1
        let min = lotSize ? lotSize : 1
        let isAddDisableSet = false
        let qty = parseInt(quantity ? quantity : 0)
        let finalQty = ''
        if (type === "add") {
            if (qty < ORDER_FIELD_MAX_VALUE_QTY) {
                if (qty) {
                    let rem = qty % lot
                    qty = qty - rem
                    qty = qty + parseInt(lot)
                    if (qty > ORDER_FIELD_MAX_VALUE_QTY) {
                        isAddDisableSet = true
                        setDisableAddQty(true)
                        finalQty = quantity
                    }
                    // else if (qty > Math.round(inputValid)) {
                    //     isAddDisableSet = true
                    //     let payableFinal = parseInt(quantity) * parseFloat(replaceComma(price))
                    //     let setQuantityFinal = payableFinal / price
                    //     finalQty = setQuantityFinal
                    //     setDisableAddQty(true)
                    //     setErrorPayable(getLangText('QTY_ERROR', 'NCD'))
                    // }
                    else
                        finalQty = qty
                } else {
                    finalQty = lot
                }
            }
        } else if (type === "sub") {
            let sqty = quantity
            if (sqty > parseInt(min)) {
                let rem = sqty % lot
                if (rem)
                    sqty = sqty - rem
                else
                    sqty = sqty - parseInt(lot)
                if (sqty <= parseInt(min))
                    sqty = min
                finalQty = sqty
            }
            setErrorPayable('')
        }
        setQty(finalQty)

        if (!isAddDisableSet) {
            if (finalQty === ORDER_FIELD_MAX_VALUE_QTY)
                setDisableAddQty(true)
            else
                setDisableAddQty(false)
        }
        if ((finalQty == min))
            setDisableSubQty(true)
        else
            setDisableSubQty(false)
    }

    function onChangeUPIId(e) {
        setUPIId(e.target.value)
    }

    function onClickSubmit() {
        setErrorQty('')
        let hasError = false
        let errorMsg = {}
        let payableFinal = parseInt(quantity) * parseFloat(replaceComma(price))
        if (!quantity) {
            errorMsg[ORDERPAD_FIIELD_KEYS.QUANTITY] = getOrderPadErrorMessage(EMPTY,ORDERPAD_FIIELD_KEYS.QUANTITY)
            hasError = true
        } else if (quantity == 0) {
            errorMsg[ORDERPAD_FIIELD_KEYS.QUANTITY] = getOrderPadErrorMessage(INVALID,ORDERPAD_FIIELD_KEYS.QUANTITY)
            hasError = true
        } else if ((parseInt(quantity) % parseInt(multipleOfQty)) != 0) {
            errorMsg[ORDERPAD_FIIELD_KEYS.QUANTITY] = NCD_MESSAGES.QUANTITY_MULTIPLE_ERROR
            hasError = true
        } else if ((parseInt(quantity) < parseInt(lotSize)) ||
            parseInt(quantity) > parseInt(props.symData.maxLotSize)) {
            errorMsg[ORDERPAD_FIIELD_KEYS.QUANTITY] = NCD_MESSAGES.QUANTITY_RANGE_ERROR
            hasError = true
        }
        if ((payableFinal > ORDER_FIELD_MAX_VALUE_PAYABLE_AMOUNT)) {
            setErrorQty(getLangText('QTY_ERROR', 'NCD'))
            hasError = true
        }

        if (!upiId) {
            errorMsg[ORDERPAD_FIIELD_KEYS.UPI_ID] = getOrderPadErrorMessage(EMPTY,ORDERPAD_FIIELD_KEYS.UPI_ID)
            hasError = true
        }
        setFieldErrorMsg(errorMsg)

        if (!hasError)
            onSubmitOrder()
    }

    function onSubmitOrder() {
        // ** ====  Appending User-entered Details to SymData === ** //
        let list = Object.assign(props.symData, {
            qty: quantity, upiId: upiId, payAmount: payAmount,
            selectedUPIHandler: selectedUPIHandler
        })
        if (isAgreed) {
            setShowLoader(true)
            props.storeNCDDialogDetails({
                name: NCD_DIALOGS.GOTO_CONFIRM_ORDER,
                symData: list,
                seriesData: props.seriesData
            })
        }
    }

    function onClickEdit() {
        props.storeNCDDialogDetails({
            name: NCD_DIALOGS.SHOW_SERIES_LIST,
            symData: props.symData,
            seriesData: props.seriesData
        })
    }

    function onClickClose() {
        props.onCloseCB && props.onCloseCB()
    }

    return (
        <div className="ncdDialog-base place-ncd-dialog">
            <div className="window">
                <Loader show={showLoader} />
                <div className="header">
                    <div className="company-info">
                        <span className="symName">{props.symData.debtipoBidNme}</span>
                        <span className="dispSym">{props.symData.debtipoNme}</span>
                    </div>
                    <span className="close" onClick={onClickClose}><CloseIcon /></span>
                </div>
                <div className="series-title-row">
                    <span className="series-title">{checkEmpty(props.seriesData.seriesCode)}</span>
                </div>
                <div className="content">
                    <div className="data1">
                        <div className="row qtyRow">
                            <div className={`inputDiv ${fieldErrorMsg[ORDERPAD_FIIELD_KEYS.QUANTITY] ?
                                'errorInputDiv' : ''}`}>
                                <div className="labelInput">
                                    <LabledInput
                                        label= {getLangText('OTY_PLACE') }
                                        value={quantity}
                                        onChangeCB={onChangeQty}
                                    />
                                    <span className="lotChange">
                                        <button className={`sub ${disableSubQty ? 'disabled' : ''}`}
                                            onClick={!disableSubQty ? () => onChangeQtyInc('sub') : null}
                                        >
                                            <CircleMinusIcon />
                                        </button>
                                        <button className={`add ${disableAddQty ? 'disabled' : ''}`}
                                            onClick={!disableAddQty ? () => onChangeQtyInc('add') : null}
                                        >
                                            <CirclePlusIcon />
                                        </button>
                                    </span>
                                </div>
                                <div className="lotDiv">
                                    <LangText module="NCD" name="LOT_SIZE"
                                        orientation={TEXT_ORIENTATION.LOWERCASE} />:
                                    <span className="lotSize">
                                        {lotSize} <LangText module="NCD" name="QTY_LCASE" /></span>
                                </div>
                                <div className="errorMsg-div">
                                    {fieldErrorMsg[ORDERPAD_FIIELD_KEYS.QUANTITY]}
                                </div>
                            </div>
                            <div className="inputDiv">
                                <div className="labelInput">
                                    <LabledInput
                                        label={getLangText('PRICE_PLACE')}
                                        value={price}
                                        disabled={true}
                                    />
                                </div>
                                <div className="lotDiv">
                                    <LangText module="NCD" name="MIN_INVEST"
                                        orientation={TEXT_ORIENTATION.LOWERCASE} /> :
                                    <span className="lotSize">
                                        {findAndReplace(checkEmpty(props.symData.minValue), '₹')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="data2">
                        <div className={`row UPIRow inputDiv
                         ${fieldErrorMsg[ORDERPAD_FIIELD_KEYS.UPI_ID] ? 'errorInputDiv' : ''}`}>
                            <div className="labelInput">
                                <LabledInput 
                                    label={getLangText("UPI_ID")}
                                    value={upiId}
                                    onChangeCB={onChangeUPIId}
                                    maxLength="30"
                                />
                                <SelectInputComponent
                                    optionList={upiList}
                                    selectedOption={selectedUPIHandler ? selectedUPIHandler : ''}
                                    onSelectValueCB={(upi) => setSelectedUPIHandler(upi)}
                                    preSelect={true}
                                    errorMsg={upiError}
                                    // hasLangageDependent = {true}
                                />
                            </div>
                            <div className="UPIId">
                                {upiId}{selectedUPIHandler}
                            </div>
                            <div className="errorMsg-div">
                                {fieldErrorMsg[ORDERPAD_FIIELD_KEYS.UPI_ID]}
                            </div>
                        </div>
                        <div className="row detailsRow">
                            <div className="row1">
                                <div className="column">
                                    <span className="label"><LangText module="NCD" name="TENOR" /></span>
                                    <span className="value">{checkEmpty(props.seriesData.seriesTenor)}</span>
                                </div>
                                <div className="column center-align">
                                    <span className="label"><LangText module="NCD" name="COUPON_RATE" /></span>
                                    <span className="value">{checkEmpty(props.seriesData.seriesCpnRate)}</span>
                                </div>
                                <div className="column right-align">
                                    <span className="label"><LangText module="NCD" name="EFFECTIVE_YIELD" /></span>
                                    <span className="value">{checkEmpty(props.seriesData.seriesEffctYld)}</span>
                                </div>
                            </div>
                            <div className="row2">
                                <div className="column">
                                    <span className="label"><LangText module="NCD" name="AMT_MATURITY" /></span>
                                    <span className="value">{checkEmpty(props.seriesData.seriesAmntAtMaturity)}</span>
                                </div>
                                <div className="column center-align left">
                                    <span className="label"><LangText module="NCD" name="INT_PAYOUT_FREQ" /></span>
                                    <span className="value">{checkEmpty(props.seriesData.seriesFrqcyOfPymt)}</span>
                                </div>
                            </div>
                            {/* <div className="horizontal-line"></div> */}
                        </div>
                    </div>
                </div>
                <div className="row agreementRow">
                    <span className="checkBox">
                        {
                            isAgreed ?
                                <CheckBoxIcon_Checked onClick={() => setIsAgreed(false)} />
                                :
                                <CheckBoxIcon_UnChecked onClick={() => setIsAgreed(true)} />
                        }
                    </span>
                    <span className="cursor" onClick={() => setIsAgreed(!isAgreed)}>
                        {/* <LangText module="NCD" name="ORDER_AGREED" /> */}
                        {declaration}
                    </span>
                </div>
                <div className="row overViewData">
                    <div>
                        <span className="label"><LangText module="NCD" name="TOTAL_QTY" /></span>
                        <span className="value">{checkEmpty(quantity)}</span>
                    </div>
                    <div>
                        <span className="label"><LangText module="NCD" name="PAYABLE_AMT" /></span>
                        <span className="value">{checkEmpty(convertCommaSeparated(payAmount))}</span>
                    </div>
                </div>
                <div className="errorMessage-ncd">
                    <span className="payable-error">{errorPayable}</span>
                    <span className="qty-error">{errorQty}</span>
                </div>
                <div className="row buttonRow">
                    <button className="editBtn" onClick={onClickEdit}>
                        <LangText name="EDIT" module="BUTTONS" />
                    </button>
                    <button className="submitBtn" disabled={!isAgreed}
                        onClick={onClickSubmit}
                    >
                        <LangText module="BUTTONS" name="SUBMIT" />
                    </button>
                </div>
            </div>
        </div>
    )
}

function LabledInput(props) {
    return (
        <>
            <span className="label">{props.label}</span>
            <InputComponent
                name={props.name}
                value={props.value}
                onChange={props.onChangeCB}
                disabled={props.disabled}
                onBlur={props.onBlur}
                onFocus={props.onFocus}
                maxLength={props.maxLength}
            />
        </>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeNCDDialogDetails: (s) => { dispatch(storeNCDDialogDetails(s)) }
    };
};

export default connect(null, mapDispatchToProps)(PlaceNCDOrderDialogComponent);