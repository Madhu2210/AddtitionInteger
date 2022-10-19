import { STORE_MARKET_SMITH_DATA, STORE_MARKET_SMITH_DIALOG_DETAILS,
    STORE_MARKET_SMITH_SUBSCRIPTION_ID,STORE_MARKET_SMITH_SUBSCRIPTION_DETAILS,
    STORE_MARKET_SMITH_PACKAGE_DETAILS,STORE_MARKET_SMITH_CCURL,
    STORE_MARKET_SMITH_OTHERPACK,STORE_FEATURE_LIST,
    STORE_MARKET_SMITH_PAYMETHODS,STORE_MARKET_SMITH_ISRENEWFLAG} from "../actions/Actions";

const initialState={

    marketSmthData: {
        marketSmtScreen:null,
        marketSmithButtonVal:"",
        marketSmtRenewalTenures:null
    },
    marketSmtDialogComp:{
        marketSmithDialogScreen:null,
        marketSmithSubscrptnData:null
    },
    marketSmtSubId: null,
    marketSmtSubAllDetails: null,
    marketSmtPackageDetails: null,
    marketSmtCCUrl: null,
    marketSmtOtherPacks: null,
    featureList:null,
    marketSmtPayMthds:[],
    marketSmtIsRenewFlag:false
}
const marketsmithdetails = (state = initialState, action ={}) =>{
    switch(action.type){
        case  STORE_MARKET_SMITH_DATA:
            return Object.assign({}, state, { marketSmthData: action.payload });
        case STORE_MARKET_SMITH_DIALOG_DETAILS:
            return Object.assign({}, state, { marketSmtDialogComp: action.payload });   
        case STORE_MARKET_SMITH_SUBSCRIPTION_ID:
            return Object.assign({}, state, { marketSmtSubId: action.payload });                                  
        case STORE_MARKET_SMITH_SUBSCRIPTION_DETAILS:
            return Object.assign({}, 
                state, { marketSmtSubAllDetails: action.payload });    
        case STORE_MARKET_SMITH_PACKAGE_DETAILS:
            return Object.assign({}, state, { marketSmtPackageDetails: action.payload });    
        case STORE_FEATURE_LIST:
            return Object.assign({}, state, { featureList: action.payload });                               
        case STORE_MARKET_SMITH_CCURL:
            return Object.assign({}, state, { marketSmtCCUrl: action.payload });                               
        case STORE_MARKET_SMITH_OTHERPACK:
            return Object.assign({}, state, { marketSmtOtherPacks: action.payload });                               
        case STORE_MARKET_SMITH_PAYMETHODS:
            return Object.assign({}, state, { marketSmtPayMthds: action.payload });                   
        case STORE_MARKET_SMITH_ISRENEWFLAG:
            return Object.assign({}, state, { marketSmtIsRenewFlag: action.payload });                   
        default:
            return state;    
    }
};
export default marketsmithdetails ;