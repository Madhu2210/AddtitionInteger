import useFetch from '@msf/msf-reactjs-weblib-base';
import React ,{useEffect, useState}from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { MsfRequest } from '../../../../..';
import { checkEmpty, convertCommaSeparated, getBaseURL, 
    getIdeasBaseURL, replaceComma } from '../../../../../common/CommonMethods';
import { MARKETSMITH_DIALOG_SCREENS, SCREENS, TEXT_ORIENTATION } from '../../../../../common/Constants';
// import { MARKETSMITH_DIALOG_SCREENS } from '../../../../../common/Constants'
import LangText from '../../../../../common/lang/LangText';
import { FUND_TRANSFER, MARKET_SMITH_SERVICE } from '../../../../../config/ServiceURLs';
import {storeMarketSmithDialogDetails } from '../../../../../state/actions/Actions'
import { Confirm_icon, Ledger_icon, NetBanking_icon, RadioButton_icon, Star_icon } from '../../../../common/FontIcons';
import { Loader } from '../../../../common/LoaderComponent';
import { WidgetLoader } from '../../../../common/WidgetLoaderComponent';
import MarketSmithCCAvenueIframe from './marketSmithdialogs/MarketSmithCCAvenueIframe';

function ChooseTenureComponent(props) {
    const [tenureDtls,setTenureDtls] = useState(props.marketSmtPackageDetails[0])
    const [availFunds, setAvailFunds] = useState(null);
    const [ccFormId, setccFormId] = useState(null);
    const [handleLedgDisable, sethandleLedgDisable] = useState(true);
    const [handleCCDisable, setHandleCCDisable] = useState(false);
    const [payBtnDisable, setPayBtnDisable] = useState(false);
    const [insufficientMsg, setInsufficientMsg] = useState("");
    const [payMode, setpayMode] = useState(props.marketSmtPayMthds[0]);
    const [errorMsg, setErrorMsg] = useState(null)

    const [changeIndex, setChangeIndex] = useState(0);
    const [ccAvenueIframe, setCcAvenueIframe] = useState(false);
    const [ccAvenueURL, setCcAvenueURL] = useState(null);
    const MsfFetch = useFetch();

    useEffect(() => {
        getAvailFunds();

    }, []);

    useEffect(()=> {
        // if(props.marketSmtIsRenewFlag){
        initialIndex(props.marketSmtPackageDetails)
        // }
    },[])
    useEffect(()=> {
        if(ccAvenueIframe){
            document.forms[ccFormId].submit()
        }
    },[ccAvenueIframe])

    useEffect(() => {
        if(handleLedgDisable){
            setpayMode(props.marketSmtPayMthds[0])

        }
        else if(handleCCDisable){
            setpayMode(props.marketSmtPayMthds[1])

        }
        if((handleLedgDisable && handleCCDisable) || (!handleLedgDisable && !handleCCDisable)){
            setpayMode(props.marketSmtPayMthds[1])

        }

    }, [handleLedgDisable,handleCCDisable]);

    function getAvailFunds() {
        props.showWidgetLoader()
        let request = new MsfRequest();
        // request.setEncrypt(false)
        request.addToData({
            segment: "",
        });
        MsfFetch.placeRequest(
            getBaseURL() + FUND_TRANSFER.GET_LIMITS_VIEW,
            request,
            successRespCBGetAvailFunds,
            errorRespCBGetAvailFunds
        );
    }

    function successRespCBGetAvailFunds(response) {
        props.hideWidgetLoader()
        setAvailFunds(response.data.netCashAvail);
    }
    function errorRespCBGetAvailFunds(error) {
        props.hideWidgetLoader()
        setErrorMsg(error.message)
    }

    // function clickToPayNow(payVal){
    //     getAvailFunds()
    //     clickToPayNowCheck(payVal)
    // }

    function clickToPayNow(payVal,fundVal){
        if(payMode == props.marketSmtPayMthds[0]){
            checkInsufficientAmnt(payVal,fundVal)

        }
        else if(payMode == props.marketSmtPayMthds[1]){
            setCcAvenueIframe(true)

        }
    }

    function handleSelectedTenure(value,ind){
        setTenureDtls(value);
        setChangeIndex(ind)
        setInsufficientMsg("")
        setPayBtnDisable(false)
        sethandleLedgDisable(true)
        setHandleCCDisable(false)

    }

    function handleLedgerPayment(){
        setpayMode(props.marketSmtPayMthds[0])
        sethandleLedgDisable(true)
        setHandleCCDisable(false)
    }

    function initialIndex(list){
        let finalBestPackVal;
        let recommendedPackVal;
        let bestPackVal = list.filter(function (item)
        {
            return item.isBest == true 
        })
        if(props.marketSmtIsRenewFlag){
            recommendedPackVal = list.filter(function (item)
            {
                return item.recommentedFlag == true 
            })
            if((bestPackVal && bestPackVal.length) && (recommendedPackVal && recommendedPackVal.length)){
                finalBestPackVal = recommendedPackVal[0]
            }
            else{
                finalBestPackVal = bestPackVal[0]
            }
        }
        else{
            finalBestPackVal = bestPackVal[0]
        }

        if(bestPackVal.length == 0){
            finalBestPackVal = list[0]
        }

        list.map((itemVal,index) => {
            if(JSON.stringify(itemVal) === JSON.stringify(finalBestPackVal)){
                setChangeIndex(index)
                setTenureDtls(itemVal)
            }
        })
         
    }

    function getSubscribed(val){
        let request = new MsfRequest();
        props.showLoader()
        // request.setEncrypt(false)
        request.addToData({
            ordId:val.ordId,
            amntPay:val.tAmnt,
            subScpStus:props.marketSmtSubAllDetails.subScpStus,
            vldty:val.vldty,
            packName:val.packName,
            mobNo:props.marketSmtSubAllDetails.mobNo,
            email:props.marketSmtSubAllDetails.email,
            packState:val.packState,
            packType:val.packType,
            pkId:val.pkId,
            type:val.type,
            optPckNme:val.packName
    
        });
        MsfFetch.placeRequest(
            getIdeasBaseURL() + MARKET_SMITH_SERVICE.INIT_LEDGER_PAYMENT,
            request,
            successRespCBInitPayment,
            errorRespCBInitPayment
        );
    }
    function successRespCBInitPayment(response){
        props.hideLoader()
        paymentSubscriptionAction(response)

    }

    function paymentSubscriptionAction(resp){
        let result = {}
        if (resp.infoID === "0") {
            result.msg = resp.infoMsg
            result.isSuccess = true
            result.amnt = resp.data.amnt
            result.validTill = resp.data.validTill
        } else {
            result.msg = resp.message
            result.isSuccess = false
        }
        props.storeMarketSmithDialogDetails({
            marketSmithSubscrptnData:result,
            marketSmithDialogScreen:MARKETSMITH_DIALOG_SCREENS.PAYMENT_SUCCESS_POPUP,
        })     }
    
    function errorRespCBInitPayment(error){
        props.hideLoader()
        paymentSubscriptionAction(error)

    }

    function handlePayment(url,params,formId){
        let formIdVal = formId.packName + formId.pkId
        setPayBtnDisable(false)
        setInsufficientMsg("")

        sethandleLedgDisable(false)
        setHandleCCDisable(true)
        setpayMode(props.marketSmtPayMthds[1])
        let form = document.createElement("form");
        form.target = "my_cc_iframe";
        form.id = formIdVal;
        form.method = "GET";
        form.style.display = "none";
        setccFormId(formIdVal)

        let tokenUrl = new URL(url);
        let urlParams = {}
        let new_url
        for (let i in params) {
            let input = document.createElement('input');
            let key = params[i].key
            let val = params[i].value
            urlParams[key] = val
            let new_params = new URLSearchParams([
                ...Object.entries(urlParams),
            ]).toString();
            new_url = new URL(`${tokenUrl.origin}${tokenUrl.pathname}?${new_params}`);
            input.type = 'hidden';
            input.name = key;
            input.value = val;
            form.appendChild(input);
            setCcAvenueURL(new_url.href)
            form.action = new_url.href;
        }
        document.body.appendChild(form);
    }

    function checkInsufficientAmnt(toBePaid,availAmt){

        let stringtoBePaidVal = parseFloat(replaceComma(toBePaid));
        let stringAmtVal = parseFloat(replaceComma(availAmt));
        
        if(stringtoBePaidVal <= stringAmtVal){
            getSubscribed(tenureDtls)
            setInsufficientMsg("")
            setPayBtnDisable(false)
            
        }
        else{
            let requiredAmt =  convertCommaSeparated(stringtoBePaidVal - stringAmtVal)
            setInsufficientMsg(`Insufficient Funds (Req. Amount - ₹${requiredAmt})`)
            setPayBtnDisable(true)
            sethandleLedgDisable(true)

        }

    }

    function handleAddBtn(){
        props.history.push(SCREENS.FUNDS); 
    }

    return (
        
        availFunds ?
            (<>
                <div>
                    <div className="tenureHeader"><LangText name="CHOOSE_TENURE" module="MARKET_SMITH"/></div>
                    <div className="tenureBody">
                        {(props.marketSmtPackageDetails && props.marketSmtPackageDetails) ? 
                            (props.marketSmtPackageDetails.map((item,index) => {
                                return (
                                    <div key={index} className={`tenureList 
                            ${changeIndex === index ? "selected" : ""}`} 
                                    onClick={() => handleSelectedTenure(item,index)}>
                                        <div className="tenureVldtyParent">
                                            <span className="tenureVldty">
                                                {item.vldty}{(item.vldty > 1) ? <LangText 
                                                    name="MONTHS" module="MARKET_SMITH"/> : 
                                                    <LangText name="MONTH" module="MARKET_SMITH"/>}</span>
                                            {!(item.isBest) ?
                                                <span className="tenureOffPrctge">
                                                    {item.offPrctge}<LangText 
                                                        name="OFF_VAL" module="MARKET_SMITH"/></span> :  
                                                <span className="tenureOffPrctge bestVal"><Star_icon/>
                                                    <LangText name="MS_BEST_VALUE" module="MARKET_SMITH"/></span> }
                                        </div>
                                        <div className="tenureAmtDetls">
                                            <span className="tenureAmount">₹{item.amntPay}</span>
                                            <span className="tenureSavings">
                                                <LangText name="SAVE" module="MARKET_SMITH" 
                                                    orientation={TEXT_ORIENTATION.PASCALCASE}/>{" "}₹{item.svngs}
                                            </span></div>
                                    </div>
                                )
                            })) : null}
                    </div>
                    <div className="selectedTenureDetails">
                        <div className="selectedAmtDiv">
                            <div className="rightHeader"><LangText name="SUBSCRIPTION_AMT" module="MARKET_SMITH"/></div>
                            <div className="amountBody">
                                <div className="amountBodyHeader">
                                    {tenureDtls.packName}
                                    {/* <LangText name="SUBSCRIPTION_AMT_CONTENT" module="MARKET_SMITH"/> */}
                                </div>
                                <div className="planAmtDiv"><span className="planAmtLabel">
                                    <LangText name="PLAN_AMT" module="MARKET_SMITH"/></span>
                                <span className="planAmtVal">₹{tenureDtls.amntPay}</span></div>
                                {tenureDtls.isBest ?
                                    <div className="planAmtDiv savngDiv"><span className="savngDivLabel">
                                        <LangText name="SAVED" module="MARKET_SMITH"/>{tenureDtls.svngs}</span>
                                    <span className="savngDivVal">₹{tenureDtls.amnt}</span></div> : null }
                                <div className="planAmtDiv"><span className="planAmtLabel">
                                    <LangText name="MS_GST" module="MARKET_SMITH"/></span>
                                <span className="planAmtVal">₹{tenureDtls.gst}</span></div>
                                <div className="amtDiv"><span className="amtPaidLabel">
                                    <LangText name="TO_BE_PAID" module="MARKET_SMITH"/></span>
                                <span className="amtPaidVal">₹{tenureDtls.tAmnt}</span></div>
                            </div></div>
                        <div className="selectedtenurePaymntDiv">
                            <div className="leftHeader"><LangText name="PAYMENT_MODE" module="MARKET_SMITH"/></div>
                            <div className="paymentBody">
                                <div className="paymentMethod ledger" 
                                >
                                    <span className="ledgerParentDiv">
                                        <div className="ledgerIcnLabelParentDiv">
                                            <span className="ledgerIcn"><Ledger_icon/></span>
                                            <div className="ledgerLabel">
                                                <span className="ledge"> <LangText name="LEDGER" 
                                                    module="MARKET_SMITH" 
                                                /></span><span 
                                                    className="avlBalAmntLabelWithVal"><LangText name="AVAIL_BALANCE" 
                                                        module="MARKET_SMITH"/>{checkEmpty(availFunds)})</span></div>
                                        </div>
                                        {handleLedgDisable ? 
                                            (insufficientMsg.length && insufficientMsg ? <button
                                                onClick={handleAddBtn} className="addfund-button">
                                                <LangText name="ADD_FUNDS" module="MARKET_SMITH"/></button> :
                                                <span className="confirmMode" 
                                                    onClick={() => handleLedgerPayment(tenureDtls)}>
                                                    <Confirm_icon/></span>
                                            ) 
                                            : 
                                    
                                            <span className="disableMode" 
                                                onClick={() => handleLedgerPayment(tenureDtls)}>
                                                <RadioButton_icon/></span>}
                                    </span>
                                    {insufficientMsg.length && insufficientMsg ?
                                        <div className="insufficientContent">
                                            {insufficientMsg}</div> : null }
                                </div>
                                <div className="paymentMethod upi" 
                                >
                                    <span className="ccParentDiv">
                                        <span className="ccIcn"><NetBanking_icon/></span>
                                        <span className="ccLabel">
                                            <LangText name="CCAVENUE" 
                                                module="MARKET_SMITH" /></span></span>
                                    {handleCCDisable ? 
                                        <span className="confirmMode" 
                                            onClick={() => 
                                                handlePayment(props.marketSmtCCUrl,
                                                    tenureDtls.params,tenureDtls)
                                            }>
                                            <Confirm_icon/></span> : 
                                        <span className="disableMode" 
                                            onClick={() => 
                                                handlePayment(props.marketSmtCCUrl,
                                                    tenureDtls.params,tenureDtls)}>
                                            <RadioButton_icon/></span>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="payBtnDiv">
                        <button onClick={() => clickToPayNow(tenureDtls.tAmnt,availFunds)} 
                            className="payBtn" id="payBtn" disabled={payBtnDisable}>
                            <LangText name="PAY_NOW" module="MARKET_SMITH"/>
                        </button>
                    </div>
         
                </div>
                {ccAvenueIframe ?
                    <MarketSmithCCAvenueIframe ccAvenueURL={ccAvenueURL} 
                        setCcAvenueIframe={setCcAvenueIframe}/> : null }

            </>) : <div className="errorMsg"> {errorMsg} </div> 
    
    )
}
const mapStateToProps = ({ marketsmithdetails}) => {
    return {
        marketSmtPackageDetails: marketsmithdetails.marketSmtPackageDetails,
        marketSmtSubAllDetails: marketsmithdetails.marketSmtSubAllDetails,
        marketSmtCCUrl: marketsmithdetails.marketSmtCCUrl,
        marketSmtPayMthds: marketsmithdetails.marketSmtPayMthds,
        marketSmtRenewalTenures: marketsmithdetails.marketSmthData.marketSmtRenewalTenures,
        marketSmtIsRenewFlag: marketsmithdetails.marketSmtIsRenewFlag,
       
    }
}
const mapDispatchToProps = (dispatch) => {
   
    return {
      
        storeMarketSmithDialogDetails: (s) => { dispatch(storeMarketSmithDialogDetails(s)) },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Loader(WidgetLoader(ChooseTenureComponent))));

