
import {  STORE_AVAIL_LOAN_ADD_PLEDGE_SUCCESS_RESP, 
    STORE_AVAIL_LOAN_DISBURSE_BANKDETAILS, STORE_AVAIL_LOAN_DISBURSE_DATA_ERROR,
    STORE_AVAIL_LOAN_ELIGIBLE_AMOUNT, STORE_AVAIL_LOAN_FAS_RESPONSE,
    STORE_AVAIL_LOAN_GETHOLDING_RESPONSE, STORE_AVAIL_LOAN_GET_LAON_AMOUNT_DATA,
    STORE_AVAIL_LOAN_GET_LOAN_FAILURE, STORE_AVAIL_LOAN_IFSC, STORE_AVAIL_LOAN_NAVIGATION,
    STORE_AVAIL_LOAN_PLEDGE_REFRESH,
    STORE_AVAIL_LOAN_UNIQUE_ID,
    STORE_AVAIL_LOAN_UNPLEDGE_DATA_ERROR,
    STORE_AVAIL_LOAN_USER_DETAILS, STORE_FAILURE_CONT_ADDITIONAL_PLD,
    STORE_FAILURE_CONT_DIALOG_DETAILS, STORE_LOAN_DIALOG_DETAILS,
    STORE_RECIEVE_DIALOG_DETAILS, 
    STORE_SELECTED_ADD_PLEDGE_DATA} 
from "../actions/Actions";

const initialState={
    
    gotoDisbursement:false,

    dialogComponent:{
        dialogName:null,
    },
    dialogDetails:{
        dialogContent:null,
    },
    failureContentDetail:{
        failureContent:null,
    },
    userDetails:null,
    DisburseResponse:null,
    UniqueIDResponse:{},
    GetHoldingResponse:null,
    addPledgeSuccessResp:null,
    getLoanFailureResp:{},
    getLoanAmtData:{},
    getLoanDetailsIfsc:{},
    getEligibleAmount:null,
    getPledgeRefresh:false,
    getDisbBankDetails:[],
    getSaveDisburseError:null,
    getUnpledgeErrorData:null,
    failureContAdditionalPld:null,
    selectedAddPldgData:[]
    
    // disbursalResponse:null
}

const availLoanDetails = (state = initialState, action ={}) =>{
    switch(action.type){
        case STORE_AVAIL_LOAN_NAVIGATION:
            return Object.assign({}, state,{ gotoDisbursement:action.payload });
        case STORE_LOAN_DIALOG_DETAILS:
            return{...state,dialogComponent:action.payload };
        case STORE_RECIEVE_DIALOG_DETAILS:
            return Object.assign({},state,{dialogDetails:action.payload});  
        case  STORE_AVAIL_LOAN_USER_DETAILS:
            return Object.assign({},state,{userDetails:action.payload});
        case  STORE_AVAIL_LOAN_FAS_RESPONSE:
            return Object.assign({},state,{DisburseResponse:action.payload}); 
        case STORE_AVAIL_LOAN_UNIQUE_ID:
            return Object.assign({},state,{UniqueIDResponse:action.payload});                 
        // case  STORE_AVAIL_LOAN_DISBURSAL_RESPONSE:
        //     return Object.assign({},state,{disbursalResponse:action.payload}); 
        case STORE_AVAIL_LOAN_GETHOLDING_RESPONSE:
            return Object.assign({},state,{GetHoldingResponse:action.payload}); 
        case STORE_AVAIL_LOAN_ADD_PLEDGE_SUCCESS_RESP:
            return Object.assign({},state,{addPledgeSuccessResp:action.payload});  
        case STORE_AVAIL_LOAN_GET_LOAN_FAILURE:
            return Object.assign({},state,{getLoanFailureResp:action.payload}); 
        case  STORE_AVAIL_LOAN_GET_LAON_AMOUNT_DATA:
            return Object.assign({},state,{getLoanAmtData:action.payload}); 
        case STORE_AVAIL_LOAN_IFSC:
            return Object.assign({},state,{getLoanDetailsIfsc:action.payload});
        case STORE_AVAIL_LOAN_ELIGIBLE_AMOUNT:
            return Object.assign({},state,{getEligibleAmount:action.payload});   
        case STORE_AVAIL_LOAN_PLEDGE_REFRESH:
            return Object.assign({},state,{getPledgeRefresh:action.payload});     
        case   STORE_AVAIL_LOAN_DISBURSE_BANKDETAILS:
            return Object.assign({},state,{getDisbBankDetails:action.payload});   
        case  STORE_AVAIL_LOAN_DISBURSE_DATA_ERROR:
            return Object.assign({},state,{getSaveDisburseError:action.payload});  
        case  STORE_AVAIL_LOAN_UNPLEDGE_DATA_ERROR:
            return Object.assign({},state,{getUnpledgeErrorData:action.payload});  
        case  STORE_FAILURE_CONT_DIALOG_DETAILS:
            return Object.assign({},state,{failureContentDetail:action.payload}); 
        case   STORE_FAILURE_CONT_ADDITIONAL_PLD:
            return Object.assign({},state,{failureContAdditionalPld:action.payload}); 
        case  STORE_SELECTED_ADD_PLEDGE_DATA:
            return Object.assign({},state,{selectedAddPldgData:action.payload});                             
        default:
            return state;    
    }
};
export default availLoanDetails;