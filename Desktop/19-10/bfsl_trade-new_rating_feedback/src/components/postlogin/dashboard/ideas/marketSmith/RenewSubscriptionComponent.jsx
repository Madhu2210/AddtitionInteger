import useFetch from '@msf/msf-reactjs-weblib-base'
import React, { useState,useEffect } from 'react'
import { connect } from 'react-redux'
import { MsfRequest } from '../../../../..'
import { getIdeasBaseURL } from '../../../../../common/CommonMethods'
import {  MARKETSMITH_DIALOG_SCREENS, MARKETSMITH_SCREENS, TEXT_ORIENTATION } from '../../../../../common/Constants'
import LangText from '../../../../../common/lang/LangText'
import { MARKET_SMITH_SERVICE } from '../../../../../config/ServiceURLs'
import { storeMarketSmithData, storeMarketSmithDialogDetails, 
    storeOtherpacks } from '../../../../../state/actions/Actions'
import { Star_icon } from '../../../../common/FontIcons'
import { WidgetLoader } from '../../../../common/WidgetLoaderComponent'

function RenewSubscriptionComponent(props) {
    const MsfFetch = useFetch()
    const [packData,setPackData] = useState("")
    const [packMsg,setPackMsg] = useState("")
    const [responseVal,storeResponseVal] = useState("")
    const [errorMsg, setErrorMsg] = useState(null)
    const [packDesc, setpackDesc] = useState(null)

    useEffect(() => {
        getCurrentPackageDetails()
    },[])
    
    function getCurrentPackageDetails(){
        props.showWidgetLoader();
        let request = new MsfRequest();
        // request.setEncrypt(false)
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
            successRespCBCurrentPackageDetails,
            errorRespCBCurrentPackageDetails
        )
    }
    
    function successRespCBCurrentPackageDetails(response) {
        props.hideWidgetLoader();
        setPackMsg(response.data.msg)
        checkIsRecommended(response.data.subPacks[0].packs)
        
        let descArray = response.data.subPacks[0].desc
        descArray = descArray.split(/[.]/)
        let descArrayFinal = descArray.filter(function(item){
            return item.length !== 0 
            
        })
        
        setpackDesc(descArrayFinal)
        props.storeOtherpacks(response.data.otherPacks)

    }

    function errorRespCBCurrentPackageDetails(error) {
        props.hideWidgetLoader();
        setErrorMsg(error.message)

    }
    function formatDescription(item) {
        let newItemArr; 
        if(item.includes(':') && item.includes('&')){
            newItemArr = item.split(/[&]/)
        }
        else if(item.includes(':') && !item.includes('&')){
            newItemArr = item.split(/[:]/)
            let str = item;
            let substr = newItemArr[0]
            str.replace(substr, <b> + {substr} + </b>);
            newItemArr = str

        }
        else {
            newItemArr = item
        }
        return newItemArr

    }

    function checkIsRecommended(val){
        let finalBestPackVal;
        let bestPackVal = val.filter(function (item)
        {
            return item.recommentedFlag == true 
        })
        finalBestPackVal = bestPackVal[0]

        if(bestPackVal.length == 0){
            finalBestPackVal = val[0]
        }
        setPackData(finalBestPackVal)
        storeResponseVal(finalBestPackVal)
    }

    function clickToRenew(){
        props.storeMarketSmithData({
            marketSmtScreen:MARKETSMITH_SCREENS.SUBSCRIPTION
        })
    }

    function clickToCancel(){
        props.storeMarketSmithDialogDetails({
            marketSmithDialogScreen:MARKETSMITH_DIALOG_SCREENS.CANCEL_SUBSCRIPTION_POPUP,
            marketSmithSubscrptnData:responseVal

        })
    }

    return (
        <>
            {packData ?
                ( <div className="renewsubscription-base">
                
                    <div className="renew-subscription-header">
                        <div className="renew-head">
                            <LangText name="SUBSCRIPTION_PLAN" module="MARKET_SMITH"/>
                        </div>
                        <div className="recommendedTag">
                            <LangText name="RECOMMENDED_TAG" module="MARKET_SMITH"/><span className="recommendCut">
                            </span></div>
                        {/* <div className="recommendedTag">Recommended<span className="recommendCut">
                        </span></div> */}
                        <div className="renewpack">
                            <div className="left-side">
                                {/* <span className="current-package">
                            <LangText name="CURRENT_PACKAGE" module="MARKET_SMITH"/>
                        </span> */}
                                <span className="prodNumber">
                                    {/* <LangText name="PRODUCT_NUMBER" module="MARKET_SMITH"/>  */}
                                    {packData.packName}
                                </span>
                                <span className="prodPrice">
                        ₹{packData.amntPay}{" / "}
                                    {(packData.vldty > 1) ? <>{packData.vldty}{" "}<LangText 
                                        name="MONTHS" module="MARKET_SMITH" 
                                        orientation={TEXT_ORIENTATION.LOWERCASE}/></> : 
                                        <LangText name="MONTH" module="MARKET_SMITH" 
                                            orientation={TEXT_ORIENTATION.LOWERCASE}/>} 
                                </span>
                            </div>
                            <div className="right-side">
                                {packData.expiryWarningmsg ?
                                    <span className="packageExpiry">
                                        {/* <LangText name="PACKAGE_EXPIRY" module="MARKET_SMITH"/>  */}
                                        {packData.expiryWarningmsg}
                                    </span> : null }
                       
                            </div>
                
                        </div>
                    </div>
                    <div className="renew-subscription-body">
                        <div className="benefitsHeader"> <LangText name="BENEFITS_HEADER" module="MARKET_SMITH"/> </div>
                        {(packDesc && packDesc.length) ?
                            packDesc.map((item,index) => {
                                return (
                                    <ul key={index}>
                                        <li className={`${item.includes(':')
                                         && item.includes('&') ? "descFinder" : ""}`}>
                                            {formatDescription(item)}</li>
                                    </ul>
                                )
                            }) : null
                        }
                    </div>
                    {props.marketSmithButtonVal == "cancel" ? <span className="moneyBackDescParent"><Star_icon/>
                        <span className="moneyBackDesc">{packMsg}</span></span> : ""}
                    <div>
                        {props.marketSmithButtonVal == "renew" ? 
                            <button className="renewBtn renew" onClick={clickToRenew}>
                                <LangText name="RENEW_NOW" module="MARKET_SMITH"/> 
                            </button> :
                            <button className="renewBtn" onClick={clickToCancel}>
                                <LangText name="CANCEL_SUBSCRIPTION" module="MARKET_SMITH"
                                    orientation={TEXT_ORIENTATION.UPPERCASE}/> 
                            </button>}
                    </div>
                
                </div>) :     (<div className="errorRow">
                    <div className="colspan">
                        {errorMsg}
                    </div>
                </div>)}
        </>

    )
}
const mapStateToProps = ({ marketsmithdetails }) => {
   
    return {
        marketSmtSubAllDetails: marketsmithdetails.marketSmtSubAllDetails,
        marketSmithButtonVal: marketsmithdetails.marketSmthData.marketSmithButtonVal

    }
}
const mapDispatchToProps = (dispatch) => {
   
    return {
      
        storeMarketSmithData: (s) => { dispatch(storeMarketSmithData(s)) },
        storeMarketSmithDialogDetails: (s) => { dispatch(storeMarketSmithDialogDetails(s)) },
        storeOtherpacks: (s) => { dispatch(storeOtherpacks(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WidgetLoader(RenewSubscriptionComponent));
