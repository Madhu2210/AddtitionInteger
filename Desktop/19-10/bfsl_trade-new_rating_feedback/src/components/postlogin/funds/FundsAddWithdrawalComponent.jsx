import React, { useEffect, useState, useRef } from 'react';
import { connect } from "react-redux";
import { MsfRequest, useFetch } from '../../../index';

import Input from '../../common/InputComponent';
import LangText, { getLangText } from '../../../common/lang/LangText';
import { WidgetLoader } from '../../common/WidgetLoaderComponent'

import {
    AF_EventTriggered,
    checkEmpty, countDecimals,
    getBackOfficeBaseURL, getBaseURL, isValidPassword
} from '../../../common/CommonMethods';

import { AF_EVENT_NAMES, AF_EVENT_TYPES, FUNDS_SCREENS, LOCAL_STORAGE } from '../../../common/Constants';
import { FUND_TRANSFER } from '../../../config/ServiceURLs';

import { showAppDialog, storeAddFundDialogDetails, storeRegetRecentWithdrawals } from '../../../state/actions/Actions';
import SelectInputComponent from '../../common/SelectInputComponent';
import AddFundsComponent from './AddFundsComponent';
import { getItemFromSessionStorage } from '../../../common/LocalStorage';

function FundsAddWithdrawalComponent(props) {

    const MsfFetch = useFetch()

    const [bankDetails, setBankDetails] = useState([])
    const [selectedBankDetails, setSelectedBankDetails] = useState('')
    const [withdrawAmt, setWithdrawAmt] = useState('')
    const [withDrawBlankErr, setWithdrawBlnkErr] = useState('')

    const [bankErrMsg, setBankErrMsg] = useState()
    const [isPendingReq, setIsPendingReq] = useState(false)
    const [withdrawAmount, setWithdrawAmount] = useState(null)
    const [eCollectMsg,setECollectMsg] = useState()
    const [paymentMode,setPaymentMode] = useState([])
    const [payUrls, setPayUrls] = useState([])
    const [payBankName, setPayBankName] = useState({})

    const withdrawLimit = useRef('')

    useEffect(() => {
        getBankDetails()
        getWithdrawAmount()
        let getWithdraw = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.MINIMUM_PAYOUT))
        withdrawLimit.current = getWithdraw
        setWithdrawAmt(getWithdraw)
    }, [])
   
    function cancelAction() {
        props.selectedScreen(FUNDS_SCREENS.AVAILABLE_FUNDS)
        AF_EventTriggered(AF_EVENT_NAMES.FUNDS , AF_EVENT_TYPES.CANCEL_FUND,{"onClick":"cancelAction"})
    }

    function getWithdrawAmount() {
        let request = new MsfRequest();
        setWithdrawAmount(null)
        MsfFetch.placeRequest(
            getBaseURL() + FUND_TRANSFER.GET_AVAILABLE_FUNDS,
            request,
            successRespCBGetWithAmt,
            errorRespCBGetWithAmt
        )
    }

    function successRespCBGetWithAmt(response) {
        setWithdrawAmount(response.data.availableFunds)
    }
    
    function errorRespCBGetWithAmt() {
        return null
    }

    function addPayOut() {
        let request = new MsfRequest();
        request.addToData({
            accountId: selectedBankDetails ? selectedBankDetails.accountNo : "",
            bankName: selectedBankDetails ? selectedBankDetails.bankName : "",
            amount: withdrawAmt
        })
        MsfFetch.placeRequest(
            
            getBaseURL() + FUND_TRANSFER.ADD_PAYOUT,
            request,
            successRespCBAddPayOut,
            errorRespCBAddPayOut
        )
    }

    function successRespCBAddPayOut(response) {
        console.log("fund transfer success", response)
        props.storeRegetRecentWithdrawals(true)
        props.addWithDrawResultCB(withdrawAmt, response.infoMsg, true, FUNDS_SCREENS.FUNDS_WITHDRAWAL)
        props.selectedScreen(FUNDS_SCREENS.ADD_PAYOUT)
    }

    function errorRespCBAddPayOut(error) {
        props.addWithDrawResultCB(withdrawAmt, error.message, false, FUNDS_SCREENS.FUNDS_WITHDRAWAL)
        props.selectedScreen(FUNDS_SCREENS.ADD_PAYOUT)
        setWithdrawAmt("")
    }

    function onChangeValue(e) {
        setWithdrawBlnkErr('')
        let value = e.target.value
        let decCount = countDecimals(value)
        if ((value >= 0) &&!isValidPassword(e.target.value) && decCount <= 2) {
            if(value == 0) {
                setWithdrawAmt('') 
            }
            else {
                setWithdrawAmt(value)
            }
        }
    }
    function getBankDetails() {
        setIsPendingReq(true)
        setECollectMsg([])
        props.showWidgetLoader()
        let request = new MsfRequest();
        request.addToData({})
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + FUND_TRANSFER.GET_BANK_DETAILS_FUNDS,
            request,
            successRespGetBankDetails,
            errorRespCBGetBankDetails
        )
    }

    function successRespGetBankDetails(response) {
        props.hideWidgetLoader()
        setIsPendingReq(false)
        if (response.data.banks.length) {
            response.data.banks.map((item) => {
                if (item.accountNo) {
                    item.maskedDetails = (item.bankName + " "+ MaskCharacter(item.accountNo, '*', 4))
                    item.withDrawDetails = (item.bankName + " "+ item.accountNo)
                }
                else {
                    item.maskedDetails = item.bankName
                    item.withDrawDetails = item.bankName
                }
                return response.data.banks;
            })
            setSelectedBankDetails(response.data.banks[0])
            setPaymentMode(response.data.banks[0].supportedPayments)
            setPayBankName(response.data.banks[0].payBankName)
            setBankDetails(response.data.banks)      
            setPayUrls(response.data.payUrl)
            setECollectMsg(response.data.ecollectMsg)
        }
        else {
            setBankErrMsg("No Data Available")
        }
    }
    function errorRespCBGetBankDetails(error) {
        setIsPendingReq(false)
        props.hideWidgetLoader()
        setBankDetails('')
        setSelectedBankDetails("")
        setBankErrMsg(error.message)
        setECollectMsg([])
    }

    function onChangeBankAcc(item) {

        setSelectedBankDetails(item)
        setPaymentMode(item.supportedPayments)
    }

    function withdrawalSuccess() {
        if (!withdrawAmt) {
            setWithdrawBlnkErr(getLangText('FUNDS_VALIDA_MSG', 'FUNDS')
            )
        }
        else if(withdrawAmt <= 0) {
            setWithdrawBlnkErr(getLangText('VALID_VALUE', 'FUNDS'))
        }
        else if(withdrawAmt < 100) {
            setWithdrawBlnkErr('Minimum Payout amount should be greater than or equal to  ' + withdrawLimit.current)
        }
        else {
            addPayOut()
        }
        AF_EventTriggered(AF_EVENT_NAMES.FUNDS , AF_EVENT_TYPES.WITHDRAW_SUCCESS,{"onClick":"withdrawSuccess"})

    }

    // function addFundSuccess() {
    //     console.log('sdsf',withdrawAmt)
    //     setWithdrawBlnkErr('')
    //     if (!withdrawAmt) {
    //         setWithdrawBlnkErr(getLangText('FUNDS_VALIDA_MSG', 'FUNDS')
    //         )
    //     }
    //     else {
    //         if (selectedAddFundsMode === ADD_FUNDS_MODE_OPTIONS.UPI && withdrawAmt > 200000)
    //             setWithdrawBlnkErr(getLangText('UPI_AMT_RESTRICTION', 'FUNDS'))
    //         else if (withdrawAmt < 100) {
    //             setWithdrawBlnkErr(getLangText('MIN_TRANSACTION_AMT', 'FUNDS'))
    //         }

    //         else
    //             getPaymentData()
    //     }
    // }

    function MaskCharacter(str, mask, n = 1) {
  
        // Slice the string and replace with
        // mask then add remaining string
        return ('' + str).slice(0, -n)
            .replace(/./g, mask)
            + ('' + str).slice(-n);
    }

    return (
        <div className="available-details withdrawal">{
            (props.fundAction === FUNDS_SCREENS.ADD_FUNDS) ?
                <AddFundsComponent 
                    {...props}
                    bankDetails={bankDetails}
                    bankErrMsg = {bankErrMsg}
                    eCollectMsg = {eCollectMsg}
                    paymentMode = {paymentMode}
                    onChangeBankAcc = {onChangeBankAcc}
                    selectedBankDetails = {selectedBankDetails}
                    selectedScreen = {props.selectedScreen}
                    // addFundSuccess = {addFundSuccess}
                    isPendingReq = {isPendingReq}
                    payUrls={payUrls}
                    payBankName={payBankName}
                /> : 
                <>
                    <div className="addwithdraw-fields">
                        <div className="amount-details">
                            <span className="amount-label">
                                <LangText module="FUNDS" name="ENTER_WITHDRAW_AMT" />
                            </span>

                            <span className="amount-val">
                                <Input
                                    name="withdrawAmt"
                                    className="inputVal withdraw-amt-input"
                                    value={withdrawAmt}
                                    onChange={onChangeValue}
                                    // placeholder={getLangText("ENTER_AMOUNT", "FUND_TRANSFER")}
                                    maxLength={9}
                                />
                                <span className="symbol-rupee"> {'₹ '} </span>
                            </span>
                            <span className="errorDiv">
                                {withDrawBlankErr}
                            </span>
 
                            <span className="withdrawing-amt">
                                <LangText module="FUNDS" name="WITHDRAWABLE_AMT" />
                                <span className="avl-amt">
                                    {withdrawAmount ? '₹ ' : ''}
                                    {checkEmpty(withdrawAmount)}
                                </span>
                            </span>
                    
                        </div>
                        <div className="bankdetails">
                   
                            <div className="selectBankOptions">
                                {
                                    bankDetails.length ?
                                        <SelectInputComponent
                                            optionList={bankDetails ? bankDetails : ""}
                                            // selectedOption={selectedBankDetails.WithdrawBankDetails}
                                            // value="WithdrawBankDetails"
                                            selectedOption={selectedBankDetails.withDrawDetails}
                                            value="withDrawDetails"
                                            // value2="accountNo"
                                            onSelectValueCB={onChangeBankAcc}
                                            preSelect={true}
                                            // hasLangageDependent = {true}
                                        />
                                        : <div className="banks-errorDiv">
                                            <span> {bankErrMsg ? bankErrMsg : ""}</span>
                                        </div>
                                }
                            </div>
                        </div>
                      
                    </div>
                    <div className="action-btns">
                        <button className="theme-btn2" onClick={() => cancelAction()}>
                            <LangText module="BUTTONS" name="CANCEL" />
                        </button>
                        {
                            // (props.fundAction === FUNDS_SCREENS.ADD_FUNDS) ?
                            //     <button className="add-funds"
                            //         onClick={(!isPendingReq && bankDetails.length) ? () => addFundSuccess() : null}
                            //         disabled={!!((isPendingReq || !bankDetails.length))}>
                            //         <LangText module="BUTTONS" name="ADD_FUNDS" />
                            //     </button>
                            //     :
                            <button className="withdraw-funds"
                                onClick={(!isPendingReq && bankDetails.length) ? () => withdrawalSuccess() : null}
                                disabled={!!((isPendingReq || !bankDetails.length))}>
                                <LangText module="BUTTONS" name="WITHDRAW_FUNDS" />
                            </button>
                        }
                    </div>
                </>
                
        }
       
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeAddFundDialogDetails: (s) => { dispatch(storeAddFundDialogDetails(s)) },
        storeRegetRecentWithdrawals: (s) => { dispatch(storeRegetRecentWithdrawals(s)) },
    };
};

export default connect(null, mapDispatchToProps)(WidgetLoader(FundsAddWithdrawalComponent));