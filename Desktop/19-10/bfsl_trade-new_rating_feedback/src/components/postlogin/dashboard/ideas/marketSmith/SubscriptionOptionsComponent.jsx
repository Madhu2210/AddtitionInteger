import useFetch from '@msf/msf-reactjs-weblib-base';
import React, { useEffect,useState } from 'react'
import { connect } from 'react-redux';
import { MsfRequest } from '../../../../..';
import { getIdeasBaseURL } from '../../../../../common/CommonMethods';
import { MARKETSMITH_SCREENS, SUBSCRIPTION_STATUS, TEXT_ORIENTATION } from '../../../../../common/Constants';
import LangText from '../../../../../common/lang/LangText';
import { MARKET_SMITH_SERVICE } from '../../../../../config/ServiceURLs';
import { storeMarketSmithData, storeMarketSmithPackageDetails, 
    storemarketSmtCCUrl, 
    storeOtherpacks,storeFeatureList, storePayMthds, storeIsRenewalFlag} from '../../../../../state/actions/Actions';
import { MoneyBack_icon } from '../../../../common/FontIcons';
import { WidgetLoader } from '../../../../common/WidgetLoaderComponent';

function SubscriptionOptionsComponent(props) {
    const MsfFetch = useFetch()
    const [packageDetails, setPackageDetails] = useState({})
    const [errorMsg, setErrorMsg] = useState(null)
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        if(props.marketSmtIsRenewFlag){
            getRenewPackageDetails()
        }
        else{
            getCurrentPackageDetails()

        }
    },[])

    function initialIndex(list,val){
        let initIndexVal = checkIsBestVal(val)
        let sameVal = false;
        list.map((item,index) => {
            item.packs.filter(function(itemVal){
                if(JSON.stringify(itemVal) === JSON.stringify(initIndexVal)){
                    sameVal = true
                }
            })
            if(sameVal){
                setSelectedIndex(index)
            }
        })
            
    }

    function getCurrentPackageDetails(){
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.setEncrypt(false)
        request.addToData({       
            subScpStus:props.marketSmtSubAllDetails.subScpStus,
            mobNo:props.marketSmtSubAllDetails.mobNo,
            email:props.marketSmtSubAllDetails.email
       
        })
        MsfFetch.placeRequest(
            getIdeasBaseURL() + MARKET_SMITH_SERVICE.VIEW_ALL_PACKAGEDETAILS,
            request,
            successRespCBAllPackageDetails,
            errorRespCBAllPackageDetails
        )

    }
    function successRespCBAllPackageDetails(response){
        props.hideWidgetLoader();
        
        for (let i = 0; i < response.data.subPacks.length; i++) {
            let descArray = response.data.subPacks[i].shrtdesc
            descArray = descArray.split(/[.]/)
            let descArrayFinal = descArray.filter(function(item){
                return item.length !== 0 

            })
            response.data.subPacks[i].shrtdesc = descArrayFinal
        } 
        setPackageDetails(response.data.subPacks)
        props.storemarketSmtCCUrl(response.data.ccUrl)
        props.storePayMthds(response.data.payMthds)
        props.storeFeatureList(response.data.ftreList)
        let items = document.querySelectorAll('.marketsmith-accordion button');
        items.forEach((item) => item.addEventListener('click',function toggleAccordion() {
            const itemToggle = this.getAttribute('aria-expanded'); 

            for (let i = 0; i < items.length; i++) {
                items[i].setAttribute('aria-expanded', 'false')

            }          
            if (itemToggle == 'false') {
                this.setAttribute('aria-expanded', 'true');
                
            }
            else if(itemToggle == 'true'){
                this.setAttribute('aria-expanded', 'true');

            }
        }
        ));
    }

    function errorRespCBAllPackageDetails(error){
        props.hideWidgetLoader();
        setErrorMsg(error.message)
        props.storeFeatureList(error.message)

    }

    function getRenewPackageDetails(){
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.setEncrypt(false)
        request.addToData({       
            id:props.marketSmtSubAllDetails.id,
            pkId:props.marketSmtSubAllDetails.pkId,
            mobNo:props.marketSmtSubAllDetails.mobNo,
            email:props.marketSmtSubAllDetails.email,
            subScpStus:props.marketSmtSubAllDetails.subScpStus
       
        })
        MsfFetch.placeRequest(
            getIdeasBaseURL() + MARKET_SMITH_SERVICE.GET_PACKAGEDETAILS,
            request,
            successRespCBRenewPackageDetails,
            errorRespCBAllPackageDetails
        ) 
    }

    function successRespCBRenewPackageDetails(response){
        props.hideWidgetLoader();
        let otherDataPack = response.data.otherPacks
        for (let i = 0; i < otherDataPack.length; i++) {
            let descArray = otherDataPack[i].shrtdesc
            descArray = descArray.split(/[.]/)
            let descArrayFinal = descArray.filter(function(item){
                return item.length !== 0 
                
            })
            otherDataPack[i].shrtdesc = descArrayFinal
        } 
        let currentDataPack = response.data.subPacks
        for (let i = 0; i < currentDataPack.length; i++) {
            let descArray = currentDataPack[i].shrtdesc
            descArray = descArray.split(/[.]/)
            let descArrayFinal = descArray.filter(function(item){
                return item.length !== 0 

            })
            currentDataPack[i].shrtdesc = descArrayFinal
        } 
        otherDataPack.map((itemVal) => {
            currentDataPack.push(itemVal)
            
        })
        setPackageDetails(currentDataPack)
        initialIndex(otherDataPack,response.data.subPacks[0].packs)
        props.storeOtherpacks(response.data.otherPacks)
        props.storemarketSmtCCUrl(response.data.ccUrl)
        props.storePayMthds(response.data.payMthds)
        props.storeFeatureList(response.data.ftreList)
        
        let items = document.querySelectorAll('.marketsmith-accordion button');
        items.forEach((item) => item.addEventListener('click',function toggleAccordion() {
            const itemToggle = this.getAttribute('aria-expanded'); 

            for (let i = 0; i < items.length; i++) {
                items[i].setAttribute('aria-expanded', 'false')

            }          
            if (itemToggle == 'false') {
                this.setAttribute('aria-expanded', 'true');
                
            }
            else if(itemToggle == 'true'){
                this.setAttribute('aria-expanded', 'true');

            }
        }
        ));
    }

    function clickToSubscribe(item){

        props.storeMarketSmithData({
            marketSmtScreen:MARKETSMITH_SCREENS.CHOOSE_TENURE,
            marketSmtRenewalTenures: item
        })
        props.storeMarketSmithPackageDetails(item.packs)

    }
    
    function checkIsBestVal(val){
        let finalBestPackVal;
        let recommendedPackVal;
        let bestPackVal = val.filter(function (item)
        {
            return item.isBest == true 
        })
        if(props.marketSmtIsRenewFlag){

            recommendedPackVal = val.filter(function (item)
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

            finalBestPackVal = val[0]
        }
        
        return finalBestPackVal
    }

    function comparisonClick(){
        props.storeMarketSmithData({
            marketSmtScreen:MARKETSMITH_SCREENS.COMPARISON
        })

    }

    return (
        (packageDetails && packageDetails.length) ? 

            <div className="subscribeOptions-base">
                <div className="subscribeOptions-head">
                    <span className="selectPlanHeader"><LangText name="SELECT_PLAN" module="MARKET_SMITH"/></span>
                    <button className="comparison-btn" onClick={comparisonClick}>
                        <LangText name="COMPARISON" module="MARKET_SMITH"/>
                    </button>
                </div>
                {props.marketSmtSubAllDetails.subScpStus == SUBSCRIPTION_STATUS.NEW_USER ?
                    <div className="moneyBackContent"><span className="moneyBackContent-icon">
                        <MoneyBack_icon/></span><LangText name="MONEYBACK_CONTENT" module="MARKET_SMITH"/></div> : null}
                <div className="marketsmith-accordion">
                    {packageDetails.map((item,index) => {
                        return (
                            <div key={index} id="packdiv" className={`marketsmith-accordion-item
                            ${selectedIndex === index ? "open" : ""}`}>
                                <button 
                                    onClick={() => setSelectedIndex(index)}
                                    id="marketsmith-accordion-button-1" 
                                    aria-expanded={`${index == 0 ? "true" : "false"}`}>
                                    {index == 0 ?
                                        <div className="recommendedTag">
                                            <LangText name="RECOMMENDED_TAG" module="MARKET_SMITH"/>
                                            <span className="recommendCut">
                                            </span></div> : null}
                                    <div className="marketsmith-accordion-titleParent">
                                        <span className={"marketsmith-accordion-title"}>
                                            {checkIsBestVal(item.packs).packName}</span>
                                       
                                        {selectedIndex === index ?
                                            <div onClick={() => clickToSubscribe(item)} className="subscribeBtn">
                                                <LangText name="SUBSCRIBE_NOW" module="MARKET_SMITH"/></div>:""}
                                    </div>
                                    <div><span className="productPrice">
                                    ₹{checkIsBestVal(item.packs).amntPay}
                                    </span>{" /"}{(checkIsBestVal(item.packs).vldty <= 1) ? <LangText 
                                        name="MONTH" module="MARKET_SMITH" orientation={TEXT_ORIENTATION.LOWERCASE}/> : 
                                        <span>{checkIsBestVal(item.packs).vldty}
                                            <LangText name="MONTHS" module="MARKET_SMITH" 
                                                orientation={TEXT_ORIENTATION.LOWERCASE}/></span>}
                                    <span className="offPrice">{checkIsBestVal(item.packs).offPrctge}<LangText 
                                        name="OFF_VAL" module="MARKET_SMITH"/></span>
                                    </div>
                                    <div className="cutPrice">
                                        <span className="cutPriceTextDecoration">
                                            ₹{checkIsBestVal(item.packs).amnt}</span>{" /"}
                                        {(checkIsBestVal(item.packs).vldty <= 1) ? <LangText 
                                            name="MONTH" module="MARKET_SMITH" 
                                            orientation={TEXT_ORIENTATION.LOWERCASE}/> : 
                                            <span>{checkIsBestVal(item.packs).vldty}
                                                <LangText name="MONTHS" module="MARKET_SMITH" 
                                                    orientation={TEXT_ORIENTATION.LOWERCASE}/></span>}</div>
                                    {/* <span className="visibleDesc">
                                        {item.desc[0]}
                                    </span> */}
                                    <span className="icon" aria-hidden="true"></span>
                                </button>
                                <div className="marketsmith-accordion-content">
                                    <div className="benefitsHeader"> 
                                        {item.packType == "both"?
                                            <LangText name="BENEFITS_HEADER_BOTH" module="MARKET_SMITH"/>
                                            :(item.packType == "long" ? 
                                                <LangText name="BENEFITS_HEADER_LONG" module="MARKET_SMITH"/> :
                                                <LangText name="BENEFITS_HEADER_SHRT" module="MARKET_SMITH"/>)}</div>
                                    {item.shrtdesc.map((val,valIndex) => {
                                        return (
                                            <ul key={valIndex} className="benefitsDesc">
                                                <li>{val}</li>
                                            </ul>
                                        )
                                    })}
                                    
                                </div>
                            </div>)})}
                </div>             
            </div> :  <div className="errorRow">
                <div className="colspan">
                    {errorMsg}
                </div>
            </div> 
    
    )
}
const mapStateToProps = ({ marketsmithdetails }) => {
   
    return {
        marketSmtSubAllDetails: marketsmithdetails.marketSmtSubAllDetails,
        marketSmtIsRenewFlag: marketsmithdetails.marketSmtIsRenewFlag,
        marketSmithButtonVal: marketsmithdetails.marketSmthData.marketSmithButtonVal

    }
}
const mapDispatchToProps = (dispatch) => {
   
    return {
      
        storeMarketSmithData: (s) => { dispatch(storeMarketSmithData(s)) },
        storeMarketSmithPackageDetails: (s) => { dispatch(storeMarketSmithPackageDetails(s)) },
        storeFeatureList: (s) => { dispatch(storeFeatureList(s)) },
        storemarketSmtCCUrl: (s) => { dispatch(storemarketSmtCCUrl(s)) },
        storeOtherpacks: (s) => { dispatch(storeOtherpacks(s)) },
        storePayMthds: (s) => { dispatch(storePayMthds(s)) },
        storeIsRenewalFlag: (s) => { dispatch(storeIsRenewalFlag(s)) },

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(WidgetLoader(SubscriptionOptionsComponent));

