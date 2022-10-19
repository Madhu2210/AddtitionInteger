import React  from 'react'
import { connect } from 'react-redux'

import LangText from '../../../../common/lang/LangText'
import {   
    storeLoanDialogDetails, storeRecieveDialogDetails} from '../../../../state/actions/Actions'

function RequestRecievedDialog(props) {

    function submitRequest(){
        
        props.storeLoanDialogDetails({

            dialogName: null
        })
        props.storeRecieveDialogDetails({

            dialogContent: null
        })
      
    }

    function displayvalue(){
        return (
            <div className="request-sucess-content">
                <LangText name="RELEASE_REQUEST_SUCCESS" module="AVAIL_LOAN_DIALOG_CONTENT" /> 
            </div>
        )
    }

    function withdrawAmountDetails(){
        return (
            <div className="list-content">
                    
                <ul>
                    <li className="list-item">
                        <LangText name="REQUEST_CONTENT_ONE_PART_ONE" module="AVAIL_LOAN_DIALOG_CONTENT" />
                        <span className="loan-amt">Rs.{props.getLoanAmtData.getLoanAmtData}</span> 
                        <LangText name="REQUEST_CONTENT_ONE_PART_TWO" module="AVAIL_LOAN_DIALOG_CONTENT" />
                    </li>
                    <li className="list-item">
                        <LangText name="REQUEST_CONTENT_TWO" module="AVAIL_LOAN_DIALOG_CONTENT" />
                    </li>
                    <li className="list-item">
                        <LangText name="REQUEST_CONTENT_THREE" module="AVAIL_LOAN_DIALOG_CONTENT" />
                    </li>
                    <li className="list-item">
                        <LangText name="REQUEST_CONTENT_FOUR" module="AVAIL_LOAN_DIALOG_CONTENT" />
                    </li> 
                </ul>
            </div>
        )
    }
    
    return (

        <div className="app-modalDialog2 request-recieved-dialog" >

            <div className={`window request-recieve-screen ${props.dialogDetails.dialogContent ? "small" : ""}`} >
                <div className="request-recieve-header">
                    <div className="recieve-caption">                   
                        <span>
                            <img src="assets/images/dashboard/success_btn.svg" alt="" />
                        </span>                       
                        <span className="request-head">
                            <LangText name="REQUEST_RECIEVED" module="AVAIL_LOAN_DIALOG_CONTENT" />

                        </span>
                        {/* <span className="request-id">
                            <LangText name="REQUEST_ID" module="AVAIL_LOAN_DIALOG_CONTENT" /> 
                            {props.UniqueIDResponse.unqId}
                        </span> */}
                       
                    </div>
                   
                    <div>
                        {  props.dialogDetails.dialogContent ?  displayvalue() : withdrawAmountDetails()
                        
                        }
                           
                    </div>  

                </div>
                <button className="done-button"
                    onClick={submitRequest}>
                    
                    <LangText module="AVAIL_LOAN_DIALOG_CONTENT" name="DONE" />
                </button>

            </div>
        </div>
    )
}

const mapStateToProps = ({ availLoanDetails }) => {
    
    return {
        dialogDetails: availLoanDetails.dialogDetails,
        dialogFlag:availLoanDetails.dialogFlag,
        UniqueIDResponse: availLoanDetails.UniqueIDResponse,
        getLoanAmtData: availLoanDetails.getLoanAmtData

    }
}
const mapDispatchToProps =(dispatch) =>{
    return{
        storeLoanDialogDetails: (s) => { dispatch(storeLoanDialogDetails(s)) },
        storeRecieveDialogDetails: (s) =>{dispatch(storeRecieveDialogDetails(s)) },
        
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(RequestRecievedDialog)
