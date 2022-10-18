import React,{useState,useEffect} from 'react'
import { connect } from 'react-redux';
import { checkEmpty, convertCommaSeparated } from '../../../../common/CommonMethods';
import {   LOCAL_STORAGE } from '../../../../common/Constants';
import LangText from '../../../../common/lang/LangText'
import { getItemFromSessionStorage } from '../../../../common/LocalStorage';
import { storeAvailLoanDialogDetails, storeLoanDialogDetails } from '../../../../state/actions/Actions';
import { getLasEmiCalcValues } from '../../../../common/Bridge';
// import { LAS_SERVICES } from '../../../../config/ServiceURLs';
// import { MsfRequest, useFetch } from '../../../../index'
import { Loader } from '../../../common/LoaderComponent';

function LoanDetailsDialog(props) {
    // const [configLasData, setConfigLasData] = useState({})
    // const [loanAmt, setLoanAmt] = useState(null)
    const [monthlyEmi, setMonthlyEMI] = useState(null)
    // const [stampDuty, setStampDuty] = useState(null)
    const [lasData,setLasData]=useState({})
    // const MsfFetch = useFetch();
   
    useEffect(() => {
     
        // if (props.loanAmnt) {
        //     setLoanAmt(props.loanAmnt)
        // }
        let lasValues = getLasEmiCalcValues(props.loanAmnt)
        // setConfigLasData(lasValues.lasData)
        setMonthlyEMI(lasValues.EMI)
     
        let lasDatas = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.LAS_HELP))
        if(lasDatas){
            setLasData(lasDatas)
            
        }
       
    }, [])

    function proceedwithOtp(){
        props.storeLoanDialogDetails({
            dialogName: null
        })
    }

    //     props.showLoader()
    //     let request = new MsfRequest();
    //     request.addToData({
    //         loanId:props.responseData ? props.responseData.loanId : "",
    //         mode: ""
    //     })

    //     MsfFetch.placeRequest(
    //         getBackOfficeBaseURL() + LAS_SERVICES.GENERATE_OTP,
    //         request,
    //         successRespCBGetOtp,
    //         errorRespCBGetOtp
    //     )
       
    // }
    // function successRespCBGetOtp(){
    //     props.hideLoader()
    //     props.storeLoanDialogDetails({
    //         dialogName: AVAIL_LOAN_DIALOGS.EPLEDGE_OTP_VERIFICATION
    //     })
    // }
    // function errorRespCBGetOtp(error){
    //     props.hideLoader()
    //     props.showAppDialog({
    //         message: error.message,
    //         show: true
    //     })
    // }
    function closeButton(){
        props.storeLoanDialogDetails({
            dialogName: null
        })
    }

    return (
        <div className="app-modalDialog2 terms-loanDetails-dialog" >
            <div className="window loanDetails-base" >
                <div className="loan-Details-content">
                    <div className="loan-amount-head">
                        <span>
                            <LangText module="LAS" name="LOAN_DETAILS_HEAD" />
                        </span>                       
                    </div> 
                    <div className="loan-amount-content">
                        <div className="loan-details">
                            <div className="label">
                                <div >
                                    <LangText module="LAS" name="LOAN_AMOUNT" />
                                </div>
                                <div >
                                    <LangText module="LAS" name="RATE_INTEREST" />
                                </div>
                                <div >
                                    <LangText module="LAS" name="MONTHLY_EMI" />
                                </div>
                            </div>
                            <div className="value">
                             
                                {/* <span>
                                    {loanAmt ? '₹ ' : ''}
                                    {checkEmpty(loanAmt)}
                                </span> */}
                                <div>
                                    
                                    {props.responseData.elgAmnt  ? " ₹ " : ""}
                                    {checkEmpty(props.getEligibleAmount)} 
                                    
                                </div>
                                <div className="roi">
                                    {checkEmpty(lasData.roi)}
                                    {lasData.roi ? ' %' : ''}
                                </div>
                                <div> 
                                    {monthlyEmi ? '₹ ' : ''}
                                    {checkEmpty(convertCommaSeparated(monthlyEmi, 0))}
                                </div>
                            </div>
                            <div className="label-two">
                                <div >
                                    <LangText module="LAS" name="TENURE" />
                                </div>
                            
                                <div>
                                    <LangText module="LAS" name="PROCESS_FEE" />
                                </div>
                            </div>
                           
                            <div className="value-two">
                                <div>
                                    {checkEmpty(lasData.tenor) }
                                    {lasData.tenor ? ' Months' : ''}
                                </div> 
                                <div className="process-charge">
                                    
                                    {lasData.processCharge ? '₹ ' : ''} 
                                    {checkEmpty(lasData.processCharge)}
                                   
                                </div>
                                
                            </div>
                        </div>
                        <div className="row">
                            <span className="e-agreement-text" >
                                <LangText module="LAS" name="E_AGREEMENT_INTEREST" />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="loandetails-footer">
                   
                    <button className="las-negativeBtn"
                        onClick={closeButton}>
                        <LangText module="BUTTONS" name="CANCEL" />
                    </button>
                    <button className="las-positivebtn"
                        onClick={proceedwithOtp}>
                        <LangText module="BUTTONS" name="ACCEPT" />
                    </button>
                </div>
              
            </div>
        </div>
    )
}

const mapStateToProps = ({ las,availLoanDetails }) => {
    return {
        responseData: las.responseData,
        loanAmnt: las.loanAmnt,
        getEligibleAmount:availLoanDetails.getEligibleAmount
        
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeLoanDialogDetails: (s) => { dispatch(storeLoanDialogDetails(s)) },
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) },
    };
};
export default connect(mapStateToProps,mapDispatchToProps) (Loader(LoanDetailsDialog))
