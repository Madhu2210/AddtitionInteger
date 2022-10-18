import {
    STORE_LAS_DIALOG_DETAILS, STORE_LAS_USER_STAGE_RESPONSE, STORE_USER_LAS_STAGE,
    STORE_SHOWKYC_TERMS, STORE_ISUSER_ACCEPTED_KYC, STORE_LAN, STORE_PLEDGE_RESPONSE, STORE_EAGREEMENT_RESPONSE,
    STORE_LOAN_INIT, STORE_ELIGIBLE_AMNT, STORE_LOAN_AMNT, STORE_RECHECK_MSG, STORE_MSG_APPLYLOAN, STORE_USER_BANK,
    STORE_TERMS_IFRAME,STORE_SELECTED_PLEDGE_LIST,STORE_PLEDGE_ELIGBL_AMT
} from '../actions/Actions';

const initialState = {
    userBank: null,
    ApplyLoanFailmsg: null,
    recheckMsg: null,
    loanAmnt: null,
    eligibleAmnt: null,
    loanInit: false,
    responseData: {},
    eAgreeResponse: {},
    showKYCTerms: false,
    isUserAcceptedKYC: false,
    lan: null,
    pledgeResponse: null,
    dialog: {
        dialogName: null,
    },
    stage: {
        userStage: null,
    },
    showTermsIframe:false,
    selectedPledgeList:[],
    pledgeAmnt:null
}

const las = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_USER_BANK:
            return Object.assign({}, state, { userBank: action.payload });
        case STORE_MSG_APPLYLOAN:
            return Object.assign({}, state, { ApplyLoanFailmsg: action.payload });
        case STORE_RECHECK_MSG:
            return Object.assign({}, state, { recheckMsg: action.payload });
        case STORE_LOAN_AMNT:
            return Object.assign({}, state, { loanAmnt: action.payload });
        case STORE_ELIGIBLE_AMNT:
            return Object.assign({}, state, { eligibleAmnt: action.payload });
        case STORE_LOAN_INIT:
            return Object.assign({}, state, { loanInit: action.payload });
        case STORE_LAS_DIALOG_DETAILS:
            return Object.assign({}, state, { dialog: action.payload });
        case STORE_LAS_USER_STAGE_RESPONSE:
            return Object.assign({}, state, { responseData: action.payload });
        case STORE_USER_LAS_STAGE:
            return Object.assign({}, state, { stage: action.payload });
        case STORE_SHOWKYC_TERMS:
            return Object.assign({}, state, { showKYCTerms: action.payload });
        case STORE_ISUSER_ACCEPTED_KYC:
            return Object.assign({}, state, { isUserAcceptedKYC: action.payload });
        case STORE_LAN:
            return Object.assign({}, state, { lan: action.payload });
        case STORE_PLEDGE_RESPONSE:
            return Object.assign({}, state, { pledgeResponse: action.payload });
        case STORE_EAGREEMENT_RESPONSE:
            return Object.assign({}, state, { eAgreeResponse: action.payload });
        case STORE_TERMS_IFRAME:
            return Object.assign({}, state, { showTermsIframe: action.payload });
        case STORE_SELECTED_PLEDGE_LIST:
            return Object.assign({}, state, { selectedPledgeList: action.payload });
        case STORE_PLEDGE_ELIGBL_AMT:
            return Object.assign({}, state, { pledgeAmnt: action.payload });

        default:
            return state;
    }
};

export default las;