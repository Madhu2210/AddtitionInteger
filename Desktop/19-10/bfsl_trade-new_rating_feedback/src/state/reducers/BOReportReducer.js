import { STORE_DPC_ROI, STORE_MTF_ROI, STORE_APPROX_TAX_EQUITY, STORE_TOTAL_PNL_DER,
    STORE_FUNDS_DATE_SORT_LIST ,STORE_CLIENTHOLDINGS_EVOTE_FLAG,STORE_TRADESUMMARY_DIALOG ,
    STORE_TRADESUMMARY_FLAG,STORE_TRADESUMMARY_KEY} from "../actions/Actions"

const initialState = {
    boFundsSortData:null,
    dpcRoi:null,
    mtfRoi:null,
    approxTaxEquity:null,
    totalPnlDer:null,
    deepLinkEvote: false,
    tradeSummaryDialogComp:{
        tradeSummaryDialogScreen:null,
        tradeSummaryData:null,
    },
    tradeSummarykey: "",
    tradeSummaryFlag:false

}

const bo = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_FUNDS_DATE_SORT_LIST:
            return Object.assign({}, state, { boFundsSortData: action.payload })
        case STORE_DPC_ROI:
            return Object.assign({}, state, { dpcRoi: action.payload })   
        case STORE_MTF_ROI:
            return Object.assign({}, state, { mtfRoi: action.payload })
        case STORE_APPROX_TAX_EQUITY:
            return Object.assign({}, state, { approxTaxEquity: action.payload })
        case STORE_TOTAL_PNL_DER:
            return Object.assign({}, state, { totalPnlDer: action.payload })   
        case STORE_CLIENTHOLDINGS_EVOTE_FLAG:
            return Object.assign({}, state, { deepLinkEvote: action.payload });
        case STORE_TRADESUMMARY_DIALOG:
            return Object.assign({}, state, { tradeSummaryDialogComp: action.payload })   
        case STORE_TRADESUMMARY_FLAG:
            return Object.assign({}, state, { tradeSummaryFlag: action.payload })   
        case STORE_TRADESUMMARY_KEY:
            return Object.assign({}, state, { tradeSummarykey: action.payload })   
        default:
            return state
    }
}
export default bo;