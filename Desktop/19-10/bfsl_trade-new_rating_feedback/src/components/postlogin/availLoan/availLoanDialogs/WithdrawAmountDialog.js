import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { MsfRequest, useFetch } from '../../../../index';
import { AF_EventTriggered, checkEmpty, getBackOfficeBaseURL, replaceComma, } from '../../../../common/CommonMethods';
import { AF_EVENT_NAMES, AF_EVENT_TYPES, AVAIL_LOAN_DIALOGS } from '../../../../common/Constants';
import LangText from '../../../../common/lang/LangText';
import { LAS_SERVICE_JOURNEY, } from '../../../../config/ServiceURLs';
import { showAppDialog, storeAvailLoanGetloanAmountData, 
    storeAvailLoanIfsc, 
    storeLoanDialogDetails, storeRecieveDialogDetails } from '../../../../state/actions/Actions'
import { Loader } from '../../../common/LoaderComponent';

function WithdrawAmountDialog(props) {
    const MsfFetch = useFetch()

    const [combinedBankDetails, setCombinedBankdetails] = useState([])
    const [sortedBankDetails, setSortedBankdetails] = useState([])
    // const [bankList, setBankList] = useState([])
    const [selectedBank, setSelectedBank] = useState([])
    const [bankError, setBankError] = useState(null)
    const [withdrawValue,setWithdrawValue]=useState('1')
    const [inputError, setInputError] = useState(false)
    const [invalidError, setInvalidError] = useState(false)
    const [zeroError,setZeroError]=useState(false)
   
    // const [userDetails, setUserDetails] = useState(null)
    // const [userData, setUserData] = useState({})
    // const [disburseInfo, setDisburseInfo] = useState({})

    // useEffect(() => {
    //     if(props.responseData) {
    //         setUserData(props.responseData)
    //     }
    // }, [])
    
    // useEffect(() => {

    //     getUserBankDetails()

    // }, [])
    useEffect(() => {
        if(props.getDisbBankDetails){
            setUserBankDetails(props.getDisbBankDetails)
        }

    }, [])
   
    useEffect(() => {
        if (sortedBankDetails.length) {
            let details = Object.assign([], sortedBankDetails)
            details = details.map((item) => {
                if (item.accountNo) {
                    item.ifscDetails = (item.bankName.toUpperCase() + " " + item.accountNo)

                } else {
                    item.ifscDetails = item.bankName.toUpperCase()
                }

                return item
            })
            
            setCombinedBankdetails(details)
            
            setSelectedBank(details[0])
        }
    }, [sortedBankDetails])

    function withdrawAmount() {
        if(selectedBank){
            props.storeAvailLoanIfsc(selectedBank)
           
        }
        if(!withdrawValue ) {
            setInputError(true)
        }
        else if( props.DisburseResponse && 
            (withdrawValue > parseInt(replaceComma(props.DisburseResponse[0].avlDrwAmt))) ){
            setInvalidError(true)
        }
        else if( withdrawValue <= '0' || withdrawValue < 1){
            setZeroError(true)
        }
        else{
            props.showLoader();

            let request = new MsfRequest();
            request.addToData({
                "loanId": props.responseData ? props.responseData.loanId : "",
                "mode": "D",
                // "amnt":props.getLoanAmtData ? props.getLoanAmtData.getLoanAmtData : '',
                "amnt":withdrawValue,
                "lan": props.DisburseResponse ? props.DisburseResponse[0].lan : "",
                "bankName": selectedBank.bankName ,
                "accountNo": selectedBank.accountNo
                // "bankName": props.getLoanDetailsIfsc ? props.getLoanDetailsIfsc.bankName : "",
                // "accountNo": props.getLoanDetailsIfsc ? props.getLoanDetailsIfsc.accountNo : ""            

            })
            request.setEncrypt(false)
            MsfFetch.placeRequest(
                getBackOfficeBaseURL() + LAS_SERVICE_JOURNEY.GENERATE_OTP_DETAILS,
                request,
                successRespGetOtp,
                errorRespGetOtp
            )

            // props.storeLoanDialogDetails({
            //     dialogName:AVAIL_LOAN_DIALOGS.OTP_VERIFICATION
            // })
            // props.storeRecieveDialogDetails({

            //     dialogContent: false
            // })
        }
    }

    function successRespGetOtp() {

        props.hideLoader();
        props.storeAvailLoanGetloanAmountData({getLoanAmtData: withdrawValue})
        props.storeLoanDialogDetails({
            dialogName: AVAIL_LOAN_DIALOGS.OTP_VERIFICATION
        })
        props.storeRecieveDialogDetails({

            dialogContent: false
        })
        AF_EventTriggered(AF_EVENT_NAMES.LAS , AF_EVENT_TYPES.WITHDRAW_AMT_OTP_SUCCESS)
    }

    function errorRespGetOtp(error) {

        props.hideLoader()
        props.showAppDialog({
            message: error.message,
            show: true
        })
        AF_EventTriggered(AF_EVENT_NAMES.LAS , AF_EVENT_TYPES.WITHDRAW_AMT_OTP_FAILURE)
    }

    function setUserBankDetails(data) {
        // let primaryAccNo = data.bankAccountNo
        let bankDetails = data
        if (bankDetails.length) {
            bankDetails.map((item, index) => {
                if (index == 0) {
                    item.isPrimary = true
                }
                if (item.accountNo)
                    item.maskedDetails = (item.bankName.toUpperCase() + ' -* ' + item.accountNo.substr(-4))
                else
                    item.maskedDetails = item.bankName.toUpperCase()
                return bankDetails;

            })
        }
        else {
            setBankError("No Data Available")
        }
        setSortedBankdetails(bankDetails)
    }

    // function getUserBankDetails() {
    //     props.showLoader();
    //     let request = new MsfRequest();

    //     MsfFetch.placeRequest(
    //         getBackOfficeBaseURL() + LAS_SERVICE_JOURNEY.BANK_DETAILS,
    //         request,
    //         successRespGetBankDetails,
    //         errorRespCBGetBankDetails
    //     )
    // }
    // function successRespGetBankDetails(response) {
    //     console.log("REQUEST",response)
    //     // setUserBankDetails(response.data)
    //     // props.storeAvailLoanIfsc(response.data.)
    //     props.hideLoader();
    // }
    // function errorRespCBGetBankDetails(error) {
    //     setBankError(error.message)
    //     props.hideLoader();
    // }

    function onBankChange(item) {
        setSelectedBank(item)
        // props.getLoanDetailsIfsc()

    }

    function withdrawClose() {
        props.storeLoanDialogDetails({
            dialogName: null
        })
    }

    function withdrawEligible(val){
        
        // if(val >= 0 && val.length === 20){
        setWithdrawValue(val);
        setInputError(false);
        setInvalidError(false);
        setZeroError(false);
        
    }

    return (

        <div className="app-modalDialog2 withdrawal-amount-dialog" >

            <div className="window witdrawal-base">
                <div className="withdrawal-amount-header">
                    <div className="withdraw_amount">
                        <span className="withdraw-label" >
                            <LangText name="ENTER_WITHDRAWAL_AMOUNT" module="AVAIL_LOAN_DIALOG_CONTENT" />
                        </span>
                        <span className="value-field"> ₹
                            <input className="withdraw-value"
                                type="number" name="withdraw" 
                                value={withdrawValue}
                                min={1} 
                                // defaultValue={1}  
                                onKeyDown={(evt) => (evt.key === 'e' || evt.key === 'E' 
                                || evt.key === '-' ||  evt.key === '+')
                                && evt.preventDefault()} 
                                onChange={(e) => {
                                    if(e.target.value.length <= 10){
                                        withdrawEligible(e.target.value)}
                                }    
                                  
                                }                   
                            />
                        </span>
                        {inputError ?
                            <div className="errorDiv">
                                <span className="error">
                                    <LangText name="WITHDRAWAL_ERROR" module="AVAIL_LOAN_DIALOG_CONTENT" /> 
                                </span>
                            </div>
                            :''}
                        {invalidError?
                            <div className="errorDiv">
                                <span className="error">
                                    <LangText name="INVALID_ERROR" module="AVAIL_LOAN_DIALOG_CONTENT" /> 
                                </span>
                            </div>
                            :''}
                        {zeroError?
                            <div className="errorDiv">
                                <span className="error">
                                    <LangText name="ZERO_INVALID_AMOUNT" module="AVAIL_LOAN_DIALOG_CONTENT" /> 
                                </span>
                            </div>
                            :''}
                    </div>
                    <div className="avail-disbursement">
                        <span className="avail-disburse-content">
                            <LangText name="AVAIL_DISBURSEMENT" module="AVAIL_LOAN_DIALOG_CONTENT" /> :
                        </span>                   
                        <span className="AvalDrwAmt">
                           
                            {props.DisburseResponse[0].avlDrwAmt  ? "₹" : "" }
                            {checkEmpty(props.DisburseResponse[0].avlDrwAmt)} 
                                    
                        </span>
                        
                    </div>
                    <div className="bank-items">
                        <div className="default-bank">
                            <LangText name="DEFAULT_BANK" module="AVAIL_LOAN_DIALOG_CONTENT" />
                        </div>
                        <div className="bank-div">

                            {
                                combinedBankDetails && combinedBankDetails.length ?
                                    <>
                                        {
                                            combinedBankDetails.map((item, index) => {
                                                return (
                                                    <label className="cursor radioField data"
                                                        key={index}
                                                    >
                                                        <input type="radio"
                                                            name={item}
                                                            onChange={() => { onBankChange(item) }}
                                                            checked={selectedBank ?
                                                                item === selectedBank : false}
                                                        />
                                                        <span className="checkmark"></span>
                                                        <div className={`value ${item.isPrimary ?
                                                            'primary' : ''}`}>{item.maskedDetails}
                                                            {
                                                                item.isPrimary ?
                                                                    <span className="primaryAcc">
                                                                        {/* primary */}
                                                                        <LangText name="PRIMARY_BANK"
                                                                            module="AVAIL_LOAN_DIALOG_CONTENT" /> 
                                                                    </span>
                                                                    : ''
                                                            }
                                                        </div>
                                                           
                                                        < div className="bankAddress">
                                                            <span key={index}>
                                                                <div>{item.ifsc}</div>
                                                                       
                                                            </span>
                                                        </div>
                                                    
                                                    </label>

                                                )
                                            })
                                        }

                                    </>

                                    : <div className="banks-errorDiv-KYC">
                                        {bankError}
                                    </div>
                            }
                        </div>
                    </div>

                    <div className="withdrawal-amount-footer">
                        <button className="negative-btn"
                            onClick={withdrawClose}>
                            <LangText name="CANCEL_BUTTON" module="AVAIL_LOAN_DIALOG_CONTENT" />
                        </button>
                        <button className="positive_btn"
                            onClick={withdrawAmount}>
                            <LangText name="WITHDRAWAL_FUNDS" module="AVAIL_LOAN_DIALOG_CONTENT" />
                        </button>
                    </div>

                </div>

            </div>
        </div>
    )

}

const mapStateToProps = ({availLoanDetails , las }) => {
    return {
        userDetails: availLoanDetails.userDetails,
        responseData: las.responseData,
        DisburseResponse:availLoanDetails.DisburseResponse,
        getDisbBankDetails: availLoanDetails.getDisbBankDetails,
        // availLoanDetails.getLoanDetailsIfsc,
        // getLoanAmtData:availLoanDetails.getLoanAmtData
    }
}

const mapDispatchToProps = (dispatch) => {
    
    return {
        storeLoanDialogDetails: (s) => { dispatch(storeLoanDialogDetails(s)) },
        storeRecieveDialogDetails: (s) => { dispatch(storeRecieveDialogDetails(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeAvailLoanGetloanAmountData: (s) => { dispatch(storeAvailLoanGetloanAmountData(s)) },
        storeAvailLoanIfsc: (s) => { dispatch(storeAvailLoanIfsc(s)) },

    };
};

export default connect( mapStateToProps, mapDispatchToProps)(Loader(WithdrawAmountDialog))
