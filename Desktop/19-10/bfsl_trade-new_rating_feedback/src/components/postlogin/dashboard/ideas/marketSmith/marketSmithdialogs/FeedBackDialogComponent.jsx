/* eslint-disable */
import useFetch from '@msf/msf-reactjs-weblib-base'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { MsfRequest } from '../../../../../..'
import { getIdeasBaseURL, specialCharFinder } from '../../../../../../common/CommonMethods'
import {  FEEDBACK_MAX_LENGTH, FEEDBACK_OPTIONS, 
    MARKETSMITH_DIALOG_SCREENS, TEXT_ORIENTATION } from '../../../../../../common/Constants'
import LangText, { getLangText } from '../../../../../../common/lang/LangText'
import { MARKET_SMITH_SERVICE } from '../../../../../../config/ServiceURLs'
import { storeMarketSmithDialogDetails, storeSelectedDashboardWidget } from '../../../../../../state/actions/Actions'
import InputComponent from '../../../../../common/InputComponent'
import { Loader } from '../../../../../common/LoaderComponent'

function FeedBackDialogComponent(props) {
    const MsfFetch = useFetch()

    const [feedbackOptions]=useState(FEEDBACK_OPTIONS)
    const [selectOpt,setSelectOpt]=useState(FEEDBACK_OPTIONS[0].name)
    const [selectedReason,setselectedReason]=useState(FEEDBACK_OPTIONS[0].name)
    const [remarks,setRemarks]=useState("")
    // const [errorMsg, setErrorMsg] = useState(null)
    const [otherTextField, setotherTextField] = useState(true)
    const [focusedField, setFocusedField] = useState('')

    function onSelectOption(item){
        setSelectOpt(item.name)
        if(item.name == "Other"){
            setotherTextField(false)
        }
        else{
            setotherTextField(true)
            setselectedReason(item.name)
        }
    }

    function handleCancelSubscription(){
        props.showLoader();
        let request = new MsfRequest();
        request.addToData({
            id:props.marketSmtSubId,
            remark: selectedReason,
            optPckNme: props.marketSmithSubscrptnData.packName,
            vldty:props.marketSmithSubscrptnData.vldty

        })
        // request.setEncrypt(false)
        MsfFetch.placeRequest(
            getIdeasBaseURL() + MARKET_SMITH_SERVICE.CANCEL_OR_REFUND,
            request,
            successRespCBCancelSubscription,
            errorRespCBCancelSubscription
        )

    }

    function cancelSubscriptionAction(resp) {
        let result = {}
        if (resp.infoID === "0") {
            result.msg = resp.infoMsg
            result.isSuccess = true
        } else {
            result.msg = resp.message
            result.isSuccess = false
        }
        props.storeMarketSmithDialogDetails({
            marketSmithDialogScreen:MARKETSMITH_DIALOG_SCREENS.CANCEL_SUBSCRIPTION_RESULT_POPUP,
            marketSmithSubscrptnData:result
        }) 
      
    }

    function successRespCBCancelSubscription(response) {
        props.hideLoader();
        cancelSubscriptionAction(response)

    }

    function errorRespCBCancelSubscription(error) {
        props.hideLoader()
        cancelSubscriptionAction(error)

    }

    function onchangeVal(e){
        if(!specialCharFinder(e.target.value)){
            setRemarks(e.target.value)
            setselectedReason(e.target.value)
        }

    }
    function handleSkipAction(){
        props.storeMarketSmithDialogDetails({
            marketSmithDialogScreen:null
        })   
        // props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.IDEAS_VIEW)
    }

    function checkIsBest(val){
        let finalBestPackVal;
        let bestPackVal = val.filter(function (item)
        {
            return item.isBest == true 
        })
        finalBestPackVal = bestPackVal[0]

        if(bestPackVal.length == 0){
            finalBestPackVal = val[0]
        }
        return finalBestPackVal

    }

    function onFocusInput(e) {
        setFocusedField(e.target.name)
    }

    function onBlurInput() {
        setFocusedField('')
    }

    return (
        <div className="msFeedback-base ms-feedback-dialog">
            <div className={`window ${(!props.marketSmtOtherPacks.length) ? 'enableminHeight' : '' }`}>
                <div className="msFeedback-body">
                    <div className="header">
                        <div className="mainHeadDiv">
                            <span className="mainHead"><LangText name="FEEDBACK_MSG1" module="MARKET_SMITH"/></span>
                        </div>
                        <div className="headerContent">
                            <LangText name="FEEDBACK_MSG2" module="MARKET_SMITH"/></div>
                    </div>
               
                    <div className="content">
                        <div className="feedback-setting-header">
                            {feedbackOptions.map((item,index) =>{
                                return(
                                    <div className="list-feed" key={index} 
                                        onClick={() => onSelectOption(item)}
                                    >
                                        <input type="radio" 
                                            value={item.name} 
                                            checked={
                                                item.name === selectOpt }
                                        />
                                        <span className="checkmark"></span>
                                        <span className={`listItem 
                                        ${selectOpt === item.name ? "feedVal" : "" }`}
                                        >
                                    {getLangText(item.langKey)}</span>
                           
                                    </div> 
                                ) 
                            } )
              
                            }
              
                        </div> 
                        <div className={` ${focusedField === "remarks" ? 'focusInputDiv' : 'blurInputDiv'}`}>
                            <InputComponent
                                id="otherComments"
                                type="text"
                                className="inputVal otherFeed"
                                name="remarks"
                                placeholder={getLangText("OTHER_PLACEHOLDER", "MARKET_SMITH")}
                                onChange={onchangeVal}
                                value={remarks}
                                disabled={otherTextField}
                                onFocus={onFocusInput}
                                onBlur={onBlurInput}
                                maxLength={FEEDBACK_MAX_LENGTH}
                            /> 
                        </div>
                    </div>
                   
                    {
                        props.marketSmtOtherPacks && props.marketSmtOtherPacks.length ?
                            <div>
                                <div className="secndHeader">
                                    <LangText name="OTHER_PACKS" module="MARKET_SMITH" />
                                </div>
                                <div className="secndHeaderBody">
                                    {props.marketSmtOtherPacks.map((item,indexVal) => {
                                        return (
                                            <div className={`pckgeList ${indexVal == 0 ? "borderLast" : ""}`} 
                                                key={indexVal}>
                                                <span className="packIdentDiv">{checkIsBest(item.packs).packName}</span>
                                                <span className="packAmtPayDiv">₹{checkIsBest(item.packs).amntPay}<span 
                                                    className="packAmtPayLblDiv">
                                                    {" /"}{(checkIsBest(item.packs).vldty <= 1) ? <LangText 
                                                        name="MONTH" module="MARKET_SMITH" 
                                                        orientation={TEXT_ORIENTATION.LOWERCASE}/> : 
                                                        <span>{checkIsBest(item.packs).vldty}
                                                            <LangText name="MONTHS" module="MARKET_SMITH" 
                                                                orientation={TEXT_ORIENTATION.LOWERCASE}/>
                                                        </span>}</span><span 
                                                    className="packOffDiv">
                                                    {checkIsBest(item.packs).offPrctge}<LangText 
                                                        name="OFF_VAL" module="MARKET_SMITH" /></span></span>
                                                <span className="packAmntDiv">
                                                    <span className="packAmntDivVal">₹{checkIsBest(item.packs).amnt}
                                                    </span><span>
                                                        {" /"}{(checkIsBest(item.packs).vldty <= 1) ? <LangText 
                                                            name="MONTH" module="MARKET_SMITH" 
                                                            orientation={TEXT_ORIENTATION.LOWERCASE}/> : 
                                                            <span>{checkIsBest(item.packs).vldty}
                                                                <LangText name="MONTHS" module="MARKET_SMITH" 
                                                                    orientation={TEXT_ORIENTATION.LOWERCASE}/>
                                                            </span>}</span></span>
                                            </div>)})}
                                </div> 
                            </div>
                            : null
                    }
                    <div className="row buttonRow">
                        <button className="skipBtn" onClick={handleSkipAction}>
                            <LangText name="SKIP" module="BUTTONS" />
                        </button>
                        <button className="proceedBtn" onClick={handleCancelSubscription}
                        >
                            <LangText module="BUTTONS" name="PROCEED" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = ({ marketsmithdetails }) => {
   
    return {
        marketSmtOtherPacks: marketsmithdetails.marketSmtOtherPacks,
        marketSmtSubAllDetails: marketsmithdetails.marketSmtSubAllDetails,
        marketSmtSubId: marketsmithdetails.marketSmtSubId,
        marketSmithSubscrptnData: marketsmithdetails.marketSmtDialogComp.marketSmithSubscrptnData,

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeMarketSmithDialogDetails: (s) => { dispatch(storeMarketSmithDialogDetails(s)) },
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(FeedBackDialogComponent))