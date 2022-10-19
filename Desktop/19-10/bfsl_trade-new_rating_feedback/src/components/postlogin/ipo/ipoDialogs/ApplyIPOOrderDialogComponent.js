import React, { useEffect, useRef, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'
import { connect } from 'react-redux'

import InputComponent from '../../../common/InputComponent';
import LangText, { getLangText } from '../../../../common/lang/LangText';
import SelectInputComponent from '../../../common/SelectInputComponent';
import useCloseModal from '../../../../customHooksComponents/useCloseModal';
import Loader from '../../../common/ModalDialogLoaderComponent'

import { storeRatingAndFeedback } from '../../../../state/actions/Actions'

import {
    CheckBoxIcon_Checked,
    CheckBoxIcon_UnChecked, CircleMinusIcon, CirclePlusIcon
} from '../../../common/FontIcons';
import {
    checkInt, countHoleNumbers,
    getBackOfficeBaseURL, checkEmpty, convertCommaSeparated, replaceComma, getOrderPadErrorMessage
} from '../../../../common/CommonMethods';
import {
    LOCAL_STORAGE, ORDERPAD_FIIELD_KEYS, ORDER_FIELD_MAX_LENGTH_QTY, ORDER_FIELD_MAX_VALUE_QTY,
    TEXT_ORIENTATION, ORDER_FIELD_MAX_VALUE_PAYABLE_AMOUNT, EMPTY, INVALID, LOT_ERROR
} from '../../../../common/Constants';
import { IPO_SERVICES } from '../../../../config/ServiceURLs';
// import { ORDERPAD_MESSAGES } from '../../../../common/Messages';
import { getItemFromSessionStorage } from '../../../../common/LocalStorage';
import { feedbackOnLogout } from '../../../../common/Bridge'

function ApplyIPOOrderDialogComponent(props) {

    const MsfFetch = useFetch()

    const [disableAddQty, setDisableAddQty] = useState(false)
    const [disableSubQty, setDisableSubQty] = useState(true)
    const [quantity, setQty] = useState('')
    const [lotSize, setLotSize] = useState('')
    const [cutOffPrice, setCutOffPrice] = useState('')
    const [upiList, setUPIList] = useState([])
    const [upiId, setUPIId] = useState('')
    const [showLoader, setShowLoader] = useState(false)
    const [selectedUPIHandler, setSelectedUPIHandler] = useState('')
    const [payAmount, setPayAmount] = useState('')
    const [isAgreed, setIsAgreed] = useState(false)
    const [fieldErrorMsg, setFieldErrorMsg] = useState(false)
    const [infoMsg, setInfoMsg] = useState(false)
    const [errorPayable, setErrorPayable] = useState('')
    const [errorQty, setErrorQty] = useState('')
    const [receiveqty, setReceiveQty] = useState('')

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose, false)

    useEffect(() => {
        let ipoInfoMsgs = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.IPO_DETAILS))
        if (ipoInfoMsgs)
            setInfoMsg(ipoInfoMsgs.ModifyIPO)
        getUPIList()
    }, [])

    useEffect(() => {
        if (props.symData) {
            if (props.isModify === true)
                setQty(props.symData.qty)
            else {
                setQty(props.symData.noShare)
            }
            setLotSize(props.symData.noShare)
            setCutOffPrice(props.symData.maxPrice)
        }
    }, [props.symData])

    useEffect(() => {
        if (props.symData) {
            if (props.isModify === true) {
                setDisableSubQty(true)
                getQuantityField()
            }
        }
    }, [props.symData.isModify])

    useEffect(() => {
        if (quantity && cutOffPrice) {
            setPayAmount(parseInt(replaceComma(quantity)) * parseFloat(replaceComma(cutOffPrice)))
        } else
            setPayAmount('')
    }, [quantity])

    function getUPIList() {
        setShowLoader(true)
        setUPIList([])
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + IPO_SERVICES.GET_UPI_LIST,
            request,
            successRespCBGetUPIList,
            errorRespCBGetUPIList
        )
    }

    function successRespCBGetUPIList(response) {
        if (response.data.handlrs && response.data.handlrs.length) {
            setUPIList(response.data.handlrs)
            setSelectedUPIHandler(response.data.handlrs[0])
        }
        setShowLoader(false)
    }

    function errorRespCBGetUPIList() {
        setUPIList([])
        setShowLoader(false)
    }

    function getQuantityField() {
        setShowLoader(true)
        setQty('')
        setReceiveQty('')
        let request = new MsfRequest();
        request.addToData({
            "ipoBidName": props.symData.ipoBidNme,
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + IPO_SERVICES.MODIFY_PREFILL,
            request,
            successRespCBGetQuantity,
            errorRespCBGetQuantity
        )
    }
    function successRespCBGetQuantity(response) {
        let receiveQuantity = response.data.records
        setReceiveQty(receiveQuantity.qty)
        setQty(receiveQuantity.qty)
        setShowLoader(false)
    }

    function errorRespCBGetQuantity() {
        setQty('')
        setShowLoader(false)
    }

    function onChangeQty(e) {
        setErrorQty('')
        let value = e.target.value
        let valLength = countHoleNumbers(value)
        let min = lotSize ? lotSize : 1
        let qtyVal = ''
        let payableFinal = parseInt(value) * parseFloat(cutOffPrice)
        if (value) {
            if (checkInt(value)) {
                if (valLength <= ORDER_FIELD_MAX_LENGTH_QTY) {
                    setQty(value)
                    qtyVal = value
                } else
                    qtyVal = quantity
            }
        } else
            setQty('')

        if (parseInt(qtyVal) >= ORDER_FIELD_MAX_VALUE_QTY)
            setDisableAddQty(true)
        else if (payableFinal > ORDER_FIELD_MAX_VALUE_PAYABLE_AMOUNT) {
            // setQty(quantity)
            setDisableAddQty(true)
            setErrorPayable(getLangText('QTY_ERROR', 'IPO'))
        }
        else {
            setDisableAddQty(false)
            setErrorPayable('')
        }

        if (parseInt(qtyVal) <= min || !parseInt(qtyVal) || parseInt(qtyVal) <= parseInt(receiveqty))
            setDisableSubQty(true)
        else
            setDisableSubQty(false)
    }

    function onChangeQtyInc(type) {
        setErrorQty('')
        let inputValid = ORDER_FIELD_MAX_VALUE_PAYABLE_AMOUNT / cutOffPrice
        let lot = lotSize ? lotSize : 1
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
                    } else if (qty > Math.round(inputValid)) {
                        isAddDisableSet = true
                        let payableFinal = parseInt(quantity) * parseFloat(cutOffPrice)
                        let setQuantityFinal = payableFinal / cutOffPrice
                        finalQty = setQuantityFinal
                        setDisableAddQty(true)
                        setErrorPayable(getLangText('QTY_ERROR', 'IPO'))
                    }
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
        if ((finalQty == min) || parseInt(finalQty) <= parseInt(receiveqty))
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
        let payableFinal = parseInt(quantity) * parseFloat(cutOffPrice)
        if (!quantity) {
            errorMsg[ORDERPAD_FIIELD_KEYS.QUANTITY] = getOrderPadErrorMessage(EMPTY, ORDERPAD_FIIELD_KEYS.QUANTITY)
            hasError = true
        } else if (quantity == 0) {
            errorMsg[ORDERPAD_FIIELD_KEYS.QUANTITY] = getOrderPadErrorMessage(INVALID, ORDERPAD_FIIELD_KEYS.QUANTITY)
            hasError = true
        } else if ((quantity % lotSize) != 0) {
            errorMsg[ORDERPAD_FIIELD_KEYS.QUANTITY] = getOrderPadErrorMessage(LOT_ERROR, ORDERPAD_FIIELD_KEYS.QUANTITY)
            hasError = true
        } else if ((payableFinal > ORDER_FIELD_MAX_VALUE_PAYABLE_AMOUNT)) {
            hasError = true
        }

        if (quantity <= receiveqty) {
            setErrorQty(getLangText('MINIMUM_QTY_ERROR', 'IPO'))
            hasError = true
        } else {
            setErrorQty('')
        }

        if (!upiId) {
            errorMsg[ORDERPAD_FIIELD_KEYS.UPI_ID] = getOrderPadErrorMessage(EMPTY, ORDERPAD_FIIELD_KEYS.UPI_ID)
            hasError = true
        }
        setFieldErrorMsg(errorMsg)

        if (!hasError)
            onApplyOrder()

    }

    function onApplyOrder() {
        if (isAgreed) {
            setShowLoader(true)
            let request = new MsfRequest();
            request.addToData({
                "ipoNme": props.symData.ipoBidNme,
                "qty": quantity.toString(),
                "upiID": upiId,
                "upiHndlr": selectedUPIHandler
            })
            let apiURL = props.isModify ? getBackOfficeBaseURL() +
                IPO_SERVICES.MODIFY_IPO : getBackOfficeBaseURL() + IPO_SERVICES.APPLY_IPO
            MsfFetch.placeRequest(
                apiURL,
                request,
                successRespCBApplyIPO,
                errorRespCBApplyIPO
            )
        }
    }

    function successRespCBApplyIPO(response) {
        setShowLoader(false)
        props.onResultApplyIPOCB(response, props.symData.ipoBidNme)
    }

    function errorRespCBApplyIPO(error) {
        setShowLoader(false)
        props.onResultApplyIPOCB(error, props.symData.ipoBidNme)
    }

    function onClose() {
        props.onCloseCB && props.onCloseCB()
        console.log("cancel button")
    }


    return (
        <div className="ipoDialog-base apply-ipo-dialog">
            <div className="window" ref={modalRef}>
                <Loader show={showLoader} />
                <div className="header">
                    <span className="symName">{props.symData.ipoNme}</span>
                    <span className="dispSym">{props.symData.ipoBidNme}</span>
                </div>
                <div className="content">
                    <div className="data1">
                        <div className="row qtyRow">
                            <div className={`inputDiv ${fieldErrorMsg[ORDERPAD_FIIELD_KEYS.QUANTITY] ?
                                'errorInputDiv' : ''}`}>
                                <div className="labelInput">
                                    <LabledInput
                                        label={getLangText('IPO_QTY')}
                                        value={quantity}
                                        onChangeCB={onChangeQty}
                                    />
                                    <span className="lotChange">
                                        <button className={`sub ${disableSubQty ? 'disabled' : ''}`}
                                            onClick={!disableSubQty ? () => onChangeQtyInc('sub') : ''}
                                        >
                                            <CircleMinusIcon />
                                        </button>
                                        <button className={`add ${disableAddQty ? 'disabled' : ''}`}
                                            onClick={!disableAddQty ? () => onChangeQtyInc('add') : ''}
                                        >
                                            <CirclePlusIcon />
                                        </button>
                                    </span>
                                </div>
                                <div className="lotDiv">
                                    <LangText name="LOT_SIZE" module="IPO"
                                        orientation={TEXT_ORIENTATION.LOWERCASE} /> :
                                    <span className="lotSize">{lotSize}  <LangText name="QUANTITY" module="IPO" /></span>
                                </div>
                                <div className="errorMsg-div">
                                    {fieldErrorMsg[ORDERPAD_FIIELD_KEYS.QUANTITY]}
                                </div>
                            </div>
                            <div className="inputDiv">
                                <div className="labelInput">
                                    <LabledInput
                                        label={getLangText('IPO_CUT_OFF_PRICE')}
                                        value={cutOffPrice}
                                        disabled={true}
                                    />
                                </div>
                                <div className="lotDiv">
                                    <LangText name="PRICE_RANGE"
                                        module="IPO" orientation={TEXT_ORIENTATION.LOWERCASE} /> :
                                    <span className="lotSize">{props.symData.priceBnd}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="data2">
                        <div className={`row UPIRow inputDiv
                         ${fieldErrorMsg[ORDERPAD_FIIELD_KEYS.UPI_ID] ? 'errorInputDiv' : ''}`}>
                            <div className="labelInput">
                                <LabledInput
                                    label={getLangText("IPO_UPI_ID")}
                                    value={upiId}
                                    onChangeCB={onChangeUPIId}
                                    maxLength="30"
                                />
                                <SelectInputComponent
                                    optionList={upiList}
                                    selectedOption={selectedUPIHandler ? selectedUPIHandler : ''}
                                    onSelectValueCB={(upi) => setSelectedUPIHandler(upi)}
                                    preSelect={true}
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
                        <div className="row prefRow">
                            {infoMsg}
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
                                <LangText name="ORDER_AGREED" module="IPO" />
                            </span>
                        </div>
                        <div className="row overViewData">
                            <div>
                                <span className="label"><LangText name="TOTAL_QTY" module="IPO" /></span>
                                <span className="value">{checkEmpty(quantity)}</span>
                            </div>
                            <div>
                                <span className="label"><LangText name="PAYABLE_AMT" module="IPO" /></span>
                                <span className="value">{checkEmpty(convertCommaSeparated(payAmount))}</span>
                            </div>
                        </div>
                        <div className="errorMessage-ipo">
                            <span className="payable-error">{errorPayable}</span>
                            <span className="qty-error">{errorQty}</span>
                        </div>
                        <div className="row buttonRow">
                            <button className="cancelBtn" onClick={props.onCloseCB}>
                                <LangText name="CANCEL" module="BUTTONS" />
                            </button>
                            <button className="submitBtn" disabled={!isAgreed}
                                onClick={onClickSubmit}
                            >
                                {
                                    props.isModify ?
                                        <LangText name="MODIFY" module="BUTTONS" />
                                        :
                                        <LangText name="SUBMIT" module="BUTTONS" />
                                }
                            </button>
                        </div>
                    </div>
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
        // storeRatingAndFeedback: (s) => { dispatch(storeRatingAndFeedback(s)) },
    };
};

export default connect(mapDispatchToProps)(ApplyIPOOrderDialogComponent);

