import React, { useEffect, useRef, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import InputComponent from '../../../common/InputComponent';
import LangText, { getLangText } from '../../../../common/lang/LangText';
// import SelectInputComponent from '../../../common/SelectInputComponent';
import useCloseModal from '../../../../customHooksComponents/useCloseModal';
import Loader from '../../../common/ModalDialogLoaderComponent'

import {
    CheckBoxIcon_Checked,
    CheckBoxIcon_UnChecked
} from '../../../common/FontIcons';
import {
    checkEmpty, checkFloat, checkInt, convertCommaSeparated, 
    countDecimals, countHoleNumbers, findTickSize, getBaseURL, replaceComma, 
} from '../../../../common/CommonMethods';
import {
    LOCAL_STORAGE, OFS_DIALOGS, OFS_INVESTMENT_LIMIT, ORDER_FIELD_MAX_LENGTH_QTY,
} from '../../../../common/Constants';
import { FUND_TRANSFER } from '../../../../config/ServiceURLs';
// import { ORDERPAD_MESSAGES } from '../../../../common/Messages';
import { getItemFromSessionStorage } from '../../../../common/LocalStorage';
import { storeOFSDialogDetails } from '../../../../state/actions/Actions';
import { connect } from 'react-redux';

function ApplyOFSOrderDialogComponent(props) {

    const MsfFetch = useFetch()

    const [quantity, setQty] = useState('')
    const [price, setPrice] = useState('')
    const [showLoader] = useState(false)
    // const [isAgreed, setIsAgreed] = useState(false)
    const [infoMsg, setInfoMsg] = useState(false)
    const [selectCutoff, setSelectCutoff] = useState(true)
    const [priceErrorMessage, setPriceErrorMessage] = useState('')
    const [quantityErrorMessage, setQuantityErrorMessage] = useState('')
    const [investmentAmntErrorMessage, setInvestmentAmntErrorMessage] = useState('')
    const [availMargin, setAvailMargin] = useState('')
    const [isInvalidPrice, setIsInvalidPrice] = useState(false)
    const [isInvalidInvestAmnt, setIsInvalidInvestAmnt] = useState(false)
    const [maxPrice, setMaxPrice] = useState('')

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose, false)

    useEffect(() => {
        let ofsInfoMsgs = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.OFS_DETAILS))
        if (ofsInfoMsgs)
            setInfoMsg(ofsInfoMsgs.ModifyOFS)
        setPriceErrorMessage('')
        setInvestmentAmntErrorMessage('')
    }, [])

    useEffect(()=>{
        getAvailableMargin()
    }, [])

    useEffect(() => {
        if(props.symData.category === "Retail") {
            setSelectCutoff(true)
            setPrice(props.symData.cuttOffPrce)
        }
        else{
            setSelectCutoff(false)
        }

    }, [])

    useEffect(() => {
        if(props.isEdit) {
            if(props.dialogDetails.symData.selectCutoff) {
                setSelectCutoff(true)
                setPrice(parseFloat(replaceComma(props.symData.cuttOffPrce)))
                setQty(parseInt(replaceComma(props.symData.quantity)))
            }
            else{
                setSelectCutoff(false)
                setPrice(parseFloat(replaceComma(props.symData.price)))
                setQty(parseInt(replaceComma(props.symData.quantity)))
            }
        }
    }, [props.isEdit])

    useEffect(() => {
        if(props.isRetryFromPopup) {
            if(props.selectCutoff) {
                setSelectCutoff(true)
                setPrice(parseFloat(props.symData.cuttOffPrce))
                setQty(parseInt(props.symData.quantity))
            }
            else{
                setSelectCutoff(false)
                setPrice(parseFloat(props.symData.price))
                setQty(parseInt(props.symData.quantity))
            }
        }

    }, [props.selectCutoff, props.isRetryFromPopup])

    useEffect(() => {
        if(props.isModify) {
            if(props.symData.category === "Retail") {
                if(parseFloat(replaceComma(props.symData.price)) ===
                 parseFloat(replaceComma(props.symData.cuttOffPrce)))
                    setSelectCutoff(true)
                else
                    setSelectCutoff(false)
            }
            setQty(parseFloat(replaceComma(props.symData.qty)))
            setPrice(parseFloat(replaceComma(props.symData.price)))
        }

    }, [props.isModify])

    useEffect(()=>{ 
        let num = (parseFloat(props.symData.flrPrce) + (99.99 * (parseFloat(props.symData.flrPrce)/100)))
        let roundedSum = Math.floor(num*100)/100
        let roundedFloorPrice = parseFloat(parseFloat(roundedSum) -  parseFloat(findTickSize(2,roundedSum, 0.05)))
        setMaxPrice(roundedFloorPrice.toFixed(2))
    }, [props.symData.flrPrce])

    useEffect(()=>{
        if(props.symData.category === "HNI") {
            setSelectCutoff(false)
        }

    }, [props.symData.category])

    useEffect(() => {
        if(props.isRetry){
            if(props.symData.category === "Retail") {
                if(parseFloat(replaceComma(props.symData.price)) ===
                 parseFloat(replaceComma(props.symData.cuttOffPrce)))
                    setSelectCutoff(true)
                else
                    setSelectCutoff(false)
            }
            setPrice(parseFloat(replaceComma(props.symData.price)))
            setQty(parseInt(replaceComma(props.symData.qty)))
        }
    }, [props.isRetry])

    useEffect(() =>{
        let investAmnt = parseFloat (price * quantity)
        if( price && quantity) {
            if( props.symData.category === "HNI") {
                if( investAmnt < OFS_INVESTMENT_LIMIT ) {
                    setInvestmentAmntErrorMessage(getLangText('HNI_INVESTAMOUNT_ERROR', 'OFS'))
                    setIsInvalidInvestAmnt(true)
                }
                else {
                    setInvestmentAmntErrorMessage('')
                    setIsInvalidInvestAmnt(false)
                }
            }
            if( props.symData.category === "Retail") {
                if(investAmnt >  OFS_INVESTMENT_LIMIT) {
                    setInvestmentAmntErrorMessage(getLangText('RETAIL_INVESTAMOUNT_ERROR', 'OFS'))               
                    setIsInvalidInvestAmnt(true)
                }
                else {
                    setInvestmentAmntErrorMessage('')
                    setIsInvalidInvestAmnt(false)
                }
            }
        }

    }, [price, quantity])

    function getAvailableMargin() {
        let request = new MsfRequest();
        request.addToData({
            segment: "",
        });
        MsfFetch.placeRequest(
            getBaseURL() + FUND_TRANSFER.GET_LIMITS,
            request,
            successRespCBGetAvailFunds
        );
    }

    function successRespCBGetAvailFunds(response) {
        setAvailMargin(response.data.available);
    }

    function onChangeQty(e) {
        let val = e.target.value
        let valLength = countHoleNumbers(val)
        if(val) { 
            if( checkInt(val) && val >=1){
                if(valLength <= ORDER_FIELD_MAX_LENGTH_QTY){
                    setQuantityErrorMessage('')
                    setQty(val)
                }
            }
        }
        else 
            setQty('')
    }

    function onChangePrice(e) {
        let val = e.target.value
        let valDecimals = countDecimals(val)
        if(!selectCutoff ){
            if(val) {
                if(checkFloat(val)) {
                    if(valDecimals <= 2){
                        if (parseFloat(val) < parseFloat(props.symData.flrPrce)){
                            setPriceErrorMessage(getLangText('PRICE_ERROR', 'OFS'))
                            setIsInvalidPrice(true)
                        }
                        else if( findTickSize(2, parseFloat(val), parseFloat(props.symData.tickSize))!= 0){
                            setPriceErrorMessage(getLangText('TICK_SIZE_ERROR', 'OFS'))
                            setIsInvalidPrice(true)
                        }
                        else if( parseFloat(val) > parseFloat(maxPrice)) {
                            setPriceErrorMessage(getLangText('CROSSED_MAXLIMIT_ERROR', 'OFS'))
                            setIsInvalidPrice(true)
                        }               
                        else{
                            setPriceErrorMessage('')
                            setIsInvalidPrice(false)
                        }
                        setPrice(val)
                    }
                }
                // }
            }
            if(!val){
                setPrice(e.target.value)
                setPriceErrorMessage('')
                setIsInvalidPrice(true)
            }
        }
    }

    function onClickSubmit(data) {
        let list = Object.assign( data,{price:price, quantity: quantity, selectCutoff: selectCutoff})
        if(priceErrorMessage)
            setPriceErrorMessage(priceErrorMessage)
        else if(!price){
            setPriceErrorMessage(getLangText('PRICE_NOT_ENTERED_ERROR', 'OFS'))
            // setIsInvalidPrice(true)
        }
        else{
            setPriceErrorMessage('') 
        }
        if(!quantity){
            setQuantityErrorMessage(getLangText('QUANTITY_NOT_ENTERED_ERROR', 'OFS'))
            // setIsInvalidQuantity(true)
        }
        else{
            setQuantityErrorMessage('')
        }
        if(!isInvalidPrice && !isInvalidInvestAmnt && price && quantity) {
            props.storeOFSDialogDetails({
                name: OFS_DIALOGS.ORDER_CONFIRMATION,
                symData: list,
                availMargin:availMargin,
                isModify: props.isModify,
            })
        }
    }

    function onClose() {
        props.onCloseCB && props.onCloseCB()
    }

    return (
        <div className="ofsDialog-base apply-ofs-dialog">
            <div className="window" ref={modalRef}>
                <Loader show={showLoader} />
                <div className="header">
                    <span className="symName">
                        {props.symData.dispSym} {props.symData.exchSeg}</span>
                    <span className="dispSym">{props.symData.companyName}</span>
                </div>
                {
                    <div className="content">
                        <div className={`firstRow-floorcutoff ${props.symData.category==='HNI'? 'HNI':''}`}  >
                            <div className="column">
                                <span className="label"><LangText name="FLOOR_PRICE" module="OFS" /></span>
                                <span className="value">₹ {checkEmpty(props.symData.flrPrce)}</span>
                            </div>
                            {props.symData.category === "Retail" ?
                                <div className= "column" >
                                    <span className="label">
                                        <LangText name="CUT_OFF_PRICE" module="OFS" /></span>
                                    <span className="value">
                                    ₹ { checkEmpty(props.symData.cuttOffPrce)}</span>
                                </div> :
                                null
                            }
                        </div>
                        <div className="data1">
                            <div className="row">
                                <div className= "inputDiv qty">
                                    <div className={`labelInput ${quantityErrorMessage ? "error-label" : "" }`}>
                                        <LabledInput label="Qty"
                                            value={quantity}
                                            className="qty-input"
                                            onChangeCB={onChangeQty}
                                            maxLength={9}
                                        />
                                    </div>
                                    <div className="errorMsg-div">
                                        {quantityErrorMessage} 
                                    </div>
                                </div>
                                <div className="inputDiv price">
                                    <div className={`labelInput ${priceErrorMessage ? "error-label" : ''}
                                    ${selectCutoff ? "cutoff-selected" : ''}`}>
                                        <LabledInput label="Price"
                                            value={price}
                                            disabled={false}
                                            onChangeCB={onChangePrice}
                                            maxLength={9}
                                        />
                                    </div>
                                    <div className="errorMsg-div">
                                        {priceErrorMessage} 
                                    </div>
                                </div>
                                    
                            </div>
                        </div>
                        <div className= "cutoff-checkbox">
                            <span className="checkBox">
                                {
                                    props.symData.category==="Retail" ?
                                        selectCutoff ?
                                            <CheckBoxIcon_Checked onClick={() => {setSelectCutoff(false)
                                                setPrice('') }} />
                                            :
                                            <CheckBoxIcon_UnChecked onClick={() => {setSelectCutoff(true)
                                                setPrice(props.symData.cuttOffPrce)}}/>:
                                        null
                                }
                            </span>
                            {
                                props.symData.category==="Retail" ?
                                    <span className="text"><LangText name="CUTOFF_PRICE" module="OFS" />
                                    </span> :
                                    null
                            }
                        </div>
                        <div className="data2">
                            <div className="row prefRow">
                                {infoMsg}
                            </div>
                            {/* <div className="row agreementRow">
                                <span className="checkBox">
                                    {
                                        isAgreed ?
                                            <CheckBoxIcon_Checked onClick={() => setIsAgreed(false)} />
                                            :
                                            <CheckBoxIcon_UnChecked onClick={() => setIsAgreed(true)} />
                                    }
                                </span>
                                <span className="cursor" onClick={() => setIsAgreed(!isAgreed)}>
                                I hereby undertake that, I have read the Red Herring Prospectus and
                                I am an eligible UPI bidder as per the applicable
                                provisions of the SEBI (Issue of capital and Disclosure Requirement)
                                Regulation, 2009.
                                </span>
                            </div> */}
                            <div className="row overViewData">
                                <div>
                                    <span className="label"><LangText name="AVAILABLE_MARGIN" module="OFS" /></span>
                                    <span className="value">₹ {checkEmpty(availMargin)}</span>
                                </div>
                                <div>
                                    <span className="label"><LangText name="INVESTED_AMOUNT" module="OFS" /></span>
                                    <span className="value text-nowrap"> 
                                    ₹ {convertCommaSeparated(checkEmpty(replaceComma(quantity)*replaceComma(price)))}
                                    </span>
                                </div>
                            </div>
                            <div className="errorMessage-ofs">
                                <span className="payable-error">{investmentAmntErrorMessage}</span>
                                {/* <span className="qty-error">{errorQty}</span> */}
                            </div>
                            <div className="row buttonRow">
                                <button className="submitBtn" 
                                // disabled={!isAgreed}
                                    onClick={()=>onClickSubmit(props.symData)}
                                >
                                    <LangText name="SUBMIT" module="BUTTONS" />
                                </button>
                            </div>
                        </div>
                    </div>
                }
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
                className={props.className}
                onChange={props.onChangeCB}
                disabled={props.disabled}
                onBlur={props.onBlur}
                onFocus={props.onFocus}
                maxLength={props.maxLength}
            />
        </>
    )
}

const mapStateToProps = ({ ofsDetails }) => {
    return {
        dialogDetails: ofsDetails.dialogDetails,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeOFSDialogDetails: (s) => { dispatch(storeOFSDialogDetails(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplyOFSOrderDialogComponent);

// export default ApplyOFSOrderDialogComponent;