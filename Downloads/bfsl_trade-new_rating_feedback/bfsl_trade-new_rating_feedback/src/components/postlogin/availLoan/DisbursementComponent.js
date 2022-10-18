import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { MsfRequest, useFetch } from '../../../index'
import { AVAIL_LOAN_DIALOGS, AVAIL_LOAN_GET_LOAN_DETAILS, CHART_COLORS,
    LAS_INTREST_CHART_CONST,    THEMES } from '../../../common/Constants'
import LangText from '../../../common/lang/LangText'
import { showAppDialog, storeAvailLoanDisburseBankDetail, storeAvailLoanFasResponse, 
    storeAvailLoanUserDetails, storeLoanDialogDetails } from '../../../state/actions/Actions'
import { Withdraw_icon } from '../../common/FontIcons'
import { LAS_SERVICE_JOURNEY } from '../../../config/ServiceURLs'
import { checkEmpty,  getBackOfficeBaseURL, replaceComma } from '../../../common/CommonMethods'
import { Loader } from '../../common/LoaderComponent'
import PieChart from '../../common/PieChartComponent'
// import { getItemFromSessionStorage } from '../../../common/LocalStorage'
// import { getItemFromSessionStorage } from '../../../common/LocalStorage'

function DisbursementComponent(props) {
    const [chartData, setChartData] = useState(null);
    const [disburseData,setDisburseData]=useState([]);
    const [userLoanDetails, setUserLoanDetails] = useState(null);
    // const [lasDetails,setLasDetails]=useState("");
    // // const [fasData,setFasData]=useState([])
    // const [cibilScoreData,setCibilscoreData]=useState([])
    
    const MsfFetch = useFetch();

    useEffect(() => {
        if (props.responseData)
            setUserLoanDetails(props.responseData)     
        // let cibilData = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.LAS_HELP))
        // if(cibilData){
        //     setCibilscoreData(cibilData)
        // }
             
    }, [])

    useEffect(() => {
        if (userLoanDetails)
            getLoanDetails()
    }, [userLoanDetails])

    useEffect(() => {
        let colors = {
            [THEMES.DARK]: CHART_COLORS.LAS_INTREST.DARK,
            [THEMES.LIGHT]: CHART_COLORS.LAS_INTREST.LIGHT
        }
        if(disburseData && disburseData.length > 0){
            formChartData(disburseData[0].avlDrwAmt,
                disburseData[0].lnAmnt, colors[props.selectedTheme.theme])
        // // }
        // formChartData("34000",
        //     "10,000", colors[props.selectedTheme.theme])
        }
        
    }, [props.selectedTheme,disburseData])

    function formChartData(avldrw, utilized, colors) {
     
        let finalData = {}
        let colorArray = []
          
        let lasIntrestChartData = {
            [LAS_INTREST_CHART_CONST.TOTAL_AMOUNT]: parseInt(replaceComma(avldrw)),
            [LAS_INTREST_CHART_CONST.AMOUNT_PAYABLE]: parseInt(replaceComma(utilized))
     
        }
        if (colors)
            colorArray = Object.values(colors)
        finalData.data = lasIntrestChartData
        finalData.colorArray = colorArray 
        setChartData(finalData)
    }

    function getLoanDetails() {
        props.showLoader();
        let request = new MsfRequest();
        request.addToData({
            "loanId":userLoanDetails.loanId,
            "lan": userLoanDetails.lan
        })       
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICE_JOURNEY.GET_LOAN_DETAILS,
            request,
            successRespGetLoanDetails,
            errorRespCBGetLoanDetails
        )
    }

    function successRespGetLoanDetails(response) {
       
        setDisburseData(response.data.disburseInfo)  
        props.storeAvailLoanFasResponse(response.data.disburseInfo)
        props.storeAvailLoanDisburseBankDetail(response.data.disburseInfo[0].bnkDtls)
        props.hideLoader()

    }

    function errorRespCBGetLoanDetails(error) {
     
        props.showAppDialog({
            message: error.message,
            show: true
        })
        props.hideLoader()
    }

    function withdraw() {
        props.storeLoanDialogDetails({
            dialogName: AVAIL_LOAN_DIALOGS.WITHDRAW_FUND
        })

    }

    function setData(labelName,labelItem){
        if(labelName.langKey ==='LOAN_ACCOUNT_NUMBER' || labelName.langKey ==='INTEREST_DUE_DATE'){
            return(
                checkEmpty(labelItem[labelName.key])
            )
        }
        else if(labelName.langKey ==='ANNUAL_RATE_OF_INTEREST' || labelName.langKey ==='LOAN_TO_VALUE' ||
        labelName.langKey ==='DP_TO_LOAN' )
        { 
            return(
                <span>
                    {checkEmpty(labelItem[labelName.key])}%
                </span>
            )
           
        }
        
        return(
            <span>
                   ₹ {checkEmpty(labelItem[labelName.key])}
            </span>
        )
       
    }
    // function knowCibilScore(){
    //     cibilScoreData.cibilScore
    // }
    function getWithdrawBtnDisable(){
        let flag=''
        if(disburseData && disburseData.length > 0){
            if(!disburseData[0].withDrwAvl){
                flag='disabled'
            }
            
        }
        return flag
    }
    
    return (
        
        <div className="disbursment-base">
            
            <div className="content-partition">
                <div className="right-side-main">
                    <div className="heading">
                        <div className="loan-against-shares">
                            <span className="las-heading">
                                <LangText name="LOAN_AGAINST_SHARES" module="AVAIL_LOAN" />
                            </span>
                            <span className="fas-number">
                                <span className="fas-number-head">
                                    <LangText name="CUSTOMER_ID" module="AVAIL_LOAN" />: 
                                </span>
                                <span className="fas-data">
                                    {checkEmpty(disburseData
                                  && disburseData.length ?   disburseData[0].cstmerId: '')}
                                </span>       
                            </span>
                            
                        </div>
                        <div className="sanctioned-amount">
                            <span className="loan-snctn-amt">
                                <LangText name="LOAN_SANCTIONED_AMOUNT" module="AVAIL_LOAN" />
                            </span>
                            <div className="sanctioned-div">
                                <span className="sanctioned-data">
                            ₹ {checkEmpty(disburseData
                                 && disburseData.length ? disburseData[0].sacntnAmt: '')}
                               
                                    {/* ₹ {disburseData[0]["sacntnAmt"]} */}
                                
                                    {/* {disburseInfo.data.sacntnAmt} */}
                                </span>
                                {/* <span className="percentage-snctn">(20%)</span> */}
                            </div>
                        </div>
                    </div>
                    <div className="details">
                        <table className="table-details">
                            <tr className="row-one">
                                <td className="column-one">
                                    <LangText name="PLEDGED_VALUE" module="AVAIL_LOAN" />
                                </td>
                                <td className="column-two">
                                    <LangText name="DRAWING_POWER" module="AVAIL_LOAN" />
                                </td>
                                <td className="column-three">
                                    <LangText name="CURRENT_UTILIZATION" module="AVAIL_LOAN" />
                                </td>
                            </tr>
                            <tr className="row-two">
                                <td className="column-one">
                                    {/* <span className="rupee-symbol">₹</span> */}
                                    <span>  
                                                    
                                    ₹ {checkEmpty(disburseData && disburseData.length?
                                            disburseData[0].pldVal: '')}
                                    </span>
                                </td>                
                                <td className="column-two">
                                ₹ {checkEmpty(disburseData && disburseData.length?
                                        disburseData[0].dpPwr: '')}
                                    {/* <span className="percentage">(20%)</span> */}
                                </td>         
                                <td className="column-three">

                                ₹ {checkEmpty(disburseData && disburseData.length?
                                        disburseData[0].lnAmnt: '')}
                                    {/* <span className="percentage">(20%)</span> */}
                                </td>
                                
                            </tr>
                        </table>
                    </div>
                    <div className="check-now">
                        {/*                      
                        <img src="assets/images/cibil_img.svg" alt="" />
            
                        <span className="cbil-score">
                           
                            <LangText name="CBIL_SCORE" module="AVAIL_LOAN" />
                        </span>
                        <button className="checknow-btn" 
                            onClick={(e) => {
                                e.preventDefault();
                                window.open(`${cibilScoreData.cbilScore}`,"_blank");
                            }}>
                            <LangText name="CHECK_NOW" module="AVAIL_LOAN" />
                        </button> */}
                    </div>
                    <div className="table-two">

                        {disburseData && disburseData.map((labelItem,loanIndex) => {
                            return (
                                <div  className="array-table" key={loanIndex}>
                                
                                    {AVAIL_LOAN_GET_LOAN_DETAILS.map((labelName) =>{
                             
                                        return(
                                            <div  key={loanIndex}>
                                        
                                                <table className="table-loan">
                                                    <tr className="table-row">
                                                        <td className="table-column-left">
                                                            <LangText name={labelName.langKey} module="AVAIL_LOAN" />
                                                        </td>
                                                        <td className="table-column-right">
                                                            
                                                            {setData(labelName,labelItem)} 
                                                        </td>
                                                     
                                                    </tr>
                                                </table>
                                      
                                            </div>
                                        )
                                    })
                                    }
                                </div>
                            )
                        })}
                        
                    </div>
                </div>
                <div className="left-side">
                    
                    <div className="piechart">
                        <PieChart chartData={chartData} noLabel={true}
                            width={400}
                            height={400}
                            isLAS={true}
                        />
                        <div className="payable-div">
                            <div className="label">
                                <LangText name="AVAILABLE_DISBURSAL_AMOUNT" module="AVAIL_LOAN" /> 
                            </div>
                            <div className="payable-amt">₹{checkEmpty(disburseData && disburseData.length?
                                disburseData[0].avlDrwAmt: '')}
                            </div>
                           
                        </div>
                    </div> 
                    <div className="color-indication">
                        <div className="indicate-left ">
                            <span className="color-one"></span>
                            <span className="indicate-name-one">
                                <LangText name="UTILIZED_AMOUNT" module="AVAIL_LOAN" />  
                            </span>
                        </div>  
                        <div className="indicate-right ">
                            <div className="color-two"></div>
                            <div className="indicate-name-two">
                                <LangText name="AVAILABLE_DISBURSAL_AMOUNT" module="AVAIL_LOAN" /> 
                            </div>
                        </div>
                    </div>
                    <div className="withdraw-funds">
                        <button className="withdraw-btn" 
                            disabled={getWithdrawBtnDisable()}
                            onClick={withdraw}>
                            <LangText name="DISBURSEMENT_REQUEST" module="AVAIL_LOAN" />
                            <span className="withdraw-icon"><Withdraw_icon /></span>
                        </button>

                    </div>

                </div>
            </div>

        </div>
    )
}
const mapStateToProps = ({ settings, las }) => {
   
    return {
        selectedTheme: settings.selectedTheme,
        responseData: las.responseData,

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeLoanDialogDetails: (s) => { dispatch(storeLoanDialogDetails(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeAvailLoanUserDetails: (s) => { dispatch(storeAvailLoanUserDetails(s)) },
        storeAvailLoanFasResponse:(s) => {dispatch(storeAvailLoanFasResponse(s))},
        storeAvailLoanDisburseBankDetail:(s) => {dispatch(storeAvailLoanDisburseBankDetail(s))}
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(DisbursementComponent))
