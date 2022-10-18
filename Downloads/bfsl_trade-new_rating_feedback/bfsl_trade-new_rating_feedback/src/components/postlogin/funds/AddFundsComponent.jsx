import React, { useEffect, useRef, useState ,forwardRef} from 'react'
import { MsfRequest, useFetch } from '../../../index';
import { connect } from 'react-redux';

import { AF_EventTriggered, countDecimals, getBackOfficeBaseURL, isValidPassword } from '../../../common/CommonMethods';
import { ADD_FUNDS_MODE_OPTIONS, AF_EVENT_NAMES, AF_EVENT_TYPES, FUNDS_SCREENS } from '../../../common/Constants';
import LangText, { getLangText } from '../../../common/lang/LangText';
import Input from '../../common/InputComponent';
import SelectInputComponent from '../../common/SelectInputComponent';
import { FUND_TRANSFER } from '../../../config/ServiceURLs';
import ECollectModeComponent from './ECollectModeComponent';
import {storeRatingAndFeedback} from "../../../state/actions/Actions";

function AddFundsComponent(props) {
    // console.log(props)
    const MsfFetch = useFetch()
    
    const [selectedAddFundsMode, setSelectedAddFundsMode] = useState([])   
    const [withdrawAmt, setWithdrawAmt] = useState('')
    const [withDrawBlankErr, setWithdrawBlnkErr] = useState('')
    const [addFundsData, setAddFundsData] = useState(null)
    const [eCollectMode,setEcollectMode] = useState(false)

    const postForm = useRef(null)

    useEffect(() => {
        if (addFundsData) {
            postForm.current.submit()
            setAddFundsData(null)
        }
    }, [addFundsData])

    useEffect(() => {
        if(eCollectMode) {
            setEcollectMode(false)
        }
        if(props.selectedBankDetails) {
            setSelectedAddFundsMode(props.selectedBankDetails.supportedPayments[0])
        }
    }, [props.selectedBankDetails])
    
    function onAddFundsModeChange(item) {
        setSelectedAddFundsMode(item)
        if (item === ADD_FUNDS_MODE_OPTIONS.ECOLLECT) {
            setEcollectMode(true)
        }
        else
            setEcollectMode(false)
    }

    function addFundSuccess() {
        setWithdrawBlnkErr('')
        if (!withdrawAmt) {
            setWithdrawBlnkErr(getLangText('FUNDS_VALIDA_MSG', 'FUNDS')
            )
        }
        else {
            if (selectedAddFundsMode === ADD_FUNDS_MODE_OPTIONS.UPI && withdrawAmt > 200000)
                setWithdrawBlnkErr(getLangText('UPI_AMT_RESTRICTION'))
            else if (withdrawAmt < 100) {
                setWithdrawBlnkErr(getLangText('MIN_TRANSACTION_AMT'))
            }

            else
                getPaymentData()
        }
        AF_EventTriggered(AF_EVENT_NAMES.FUNDS , AF_EVENT_TYPES.ADD_FUND,{"onClick":"addFundSuccess"})
    }

    function cancelAction() {
        props.selectedScreen(FUNDS_SCREENS.AVAILABLE_FUNDS)
    }
    function onChangeValue(e) {
        // setWithdrawBlnkErr('')
        let value = e.target.value
        let decCount = countDecimals(value)
        if ((value >= 0) && !isValidPassword(e.target.value) && decCount <= 2) {
            setWithdrawAmt(value)
        }
    } 

    function getPaymentData() {
        props.showWidgetLoader()
        let request = new MsfRequest();
        if (selectedAddFundsMode === ADD_FUNDS_MODE_OPTIONS.NET_BANKING) {
            request.addToData({
                accNo: props.selectedBankDetails.accountNo,
                amnt: withdrawAmt,
                bnkID: props.selectedBankDetails.bankName
            })
        }
        else if (selectedAddFundsMode === ADD_FUNDS_MODE_OPTIONS.UPI) {
            request.addToData({
                accNo: props.selectedBankDetails.accountNo,
                amnt: withdrawAmt,
                bnkID: ADD_FUNDS_MODE_OPTIONS.UPI
            })
        }
        else if (selectedAddFundsMode === ADD_FUNDS_MODE_OPTIONS.PG) {
            request.addToData({
                accNo: props.selectedBankDetails.accountNo,
                amnt: withdrawAmt,
                bnkID: ADD_FUNDS_MODE_OPTIONS.PG
            })
        }
        else {
            request.addToData({
                accNo: props.selectedBankDetails.accountNo,
                amnt: withdrawAmt,
                bnkID: props.selectedBankDetails.bankName
            })
        }

        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + FUND_TRANSFER.GET_PAYMENT_DETAILS,
            request,
            successRespGetPaymentDetails,
            errorRespCBGetPaymentDetails
        )
    }

    function successRespGetPaymentDetails(response) {
        localStorage.setItem("feedbackPopupPage","fundPage")
        props.storeRatingAndFeedback({
            showRating:true,
            isAfterLogin:true
        })
        setAddFundsData(response.data)
        console.log("payment", response.data)
        props.selectedScreen(FUNDS_SCREENS.AVAILABLE_FUNDS)
        props.hideWidgetLoader()
    }

    function errorRespCBGetPaymentDetails(error) {
        props.hideWidgetLoader()
        props.addWithDrawResultCB(null, error.message, false, FUNDS_SCREENS.ADD_FUNDS)
        props.selectedScreen(FUNDS_SCREENS.ADD_PAYOUT)
    }

    return(
        <div className="add-fundsDetails">
            <div className={`funds-binding-header `}>
                {
                    props.bankDetails.length ?
                        <>
                            <div className={`selectBankOptions `}>
                   
                                <SelectInputComponent
                                    optionList={props.bankDetails ? props.bankDetails : ""}
                                    selectedOption={props.selectedBankDetails.maskedDetails}
                                    value="maskedDetails"
                                    // value2="accountNo"
                                    onSelectValueCB={props.onChangeBankAcc}
                                    preSelect={true}
                                    // hasLangageDependent = {true}
                                />
                    
                            </div>
                            <div className={`addFundsMode`}>
                                {
                                    props.paymentMode.map((item, index) => {
                                        return (
                                            <label className={`cursor radioField`}
                                                key={index}
                                            >
                                                <input type="radio"
                                                    name={item}
                                                    onChange={() => { onAddFundsModeChange(item) }}
                                                    checked={selectedAddFundsMode ?
                                                        item === selectedAddFundsMode : false}
                                                />
                                                <span className="checkmark"></span>
                                                <div className="value">{item}</div>
                                            </label>
                                        )
                                    })
                                }
                            </div> 
                        </>
                        :
                        <div className="banks-errorDiv-addfunds">
                            <span> {props.bankErrMsg ? props.bankErrMsg : ""}</span>
                        </div>

                }
              
            </div>
            <div className="funds-biniding-footer">
                {
                    eCollectMode ? 
                        <ECollectModeComponent 
                            eCollectData = {props.eCollectMsg}
                            accountLast = {props.selectedBankDetails.accountNo}
                        />
                        :
                        <>
                            <div className="enterAmount">
                                <span className="amount-label">
                                    <LangText module="FUNDS" name="ENTER_AMOUNT" />
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
                                <div className="errorDiv">
                                    {withDrawBlankErr}
                                </div>
                            </div>
                            {
                                addFundsData ?
                                    <PostAddFundsForm
                                        data={addFundsData}
                                        ref={postForm}
                                    />
                                    : null
                            }
                   
                            <div className="action-btns">
                       
                                <button className="theme-btn2" 
                                    onClick={() => cancelAction()}>
                                    <LangText module="BUTTONS" name="CANCEL" />
                                </button>
    
                                <button className="add-funds"
                                    onClick={(!props.isPendingReq && props.bankDetails.length) ? 
                                        () => addFundSuccess()
                                         : null}
                                    disabled={!!((props.isPendingReq || !props.bankDetails.length))}>
                                    <LangText module="BUTTONS" name="ADD_FUNDS" />
                                </button>
                                

                                {/* <button className="add-fundss" style={{backgroundColor: "orange "}}
                                    onClick={(!props.isPendingReq && props.bankDetails.length) ? 
                                        () => addFundSuccess()
                                         : null}
                                    disabled={!!((props.isPendingReq || !props.bankDetails.length))}>
                                    <LangText module="BUTTONS" name="ADD_FUNDS" />
                                </button>    */}
            
                            </div>
                        </>
                }
            </div>
        </div>
    )
}

const PostAddFundsForm = forwardRef((props, parentRef) => {
    
    const { data } = props
    return (
        <form action={data.url} method={data.type} target="_blank" ref={parentRef}>
            {
                (data && data.params) ?
                    data.params.map((item,index) => {
                        return <input key={index} type="hidden" name={item.key} value={item.value} />
                    })
                    : null
            }
        </form>
    )
})

const mapStateToProps = ({ successDialog, settings }) => {
    return {
        successDialog: successDialog.dialog,
        selectedTheme: settings.selectedTheme,
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
        storeSettingsDialogDetails: (s) => { dispatch((s)) },
        // storeAppTheme: (s) => { dispatch(storeAppTheme(s)) },
        storeRatingAndFeedback: (s) => { dispatch(storeRatingAndFeedback(s))}
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(AddFundsComponent);


// PostAddFundsForm.displayName = "PostAddFundsForm"

// export default AddFundsComponent;