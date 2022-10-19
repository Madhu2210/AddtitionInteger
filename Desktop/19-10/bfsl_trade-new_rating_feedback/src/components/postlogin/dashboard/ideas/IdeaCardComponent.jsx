/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withStreaming } from '../../../..';
import { callTaxDeclaration, gotoTrade } from '../../../../common/Bridge';
import { AF_EventTriggered, applyPaint, getColorCode } from '../../../../common/CommonMethods';
// import { toPascalCase } from '../../../../common/CommonMethods';
import { AF_EVENT_NAMES, AF_EVENT_TYPES, DASHBOARD_WIDGET_MODE, IDEAS_CARD,  
    MARKETSMITH_SCREENS,  
    STREAMING_KEYS,  
    STREAMING_MODULES,  
    SUBSCRIPTION_STATUS,  TAX_DECLARE_BLOCK_SCREENS } from '../../../../common/Constants';
// import { IDEAS_CARD, TAX_DECLARE_BLOCK_SCREENS } from '../../../../common/Constants';
// import { AF_EventTriggered } from '../../../../common/CommonMethods';
import LangText, { getLangText } from '../../../../common/lang/LangText';
import { showAppDialog, storeIsRenewalFlag, storeMarketSmithData, 
    storeMarketSmithDialogDetails, storeMarketSmithSubscrptnAllDetails, storeMarketSmithSubscrptnId,
    storeSelectedDashboardWidget } from '../../../../state/actions/Actions';
import { RightArrowIcon2, Timer_icon } from '../../../common/FontIcons';
import MarketSmithIframeDialog from './marketSmith/marketSmithdialogs/MarketSmithIframeDialog';
import MarketSmithShortIframeDialog from './marketSmith/marketSmithdialogs/MarketSmithShortIframeDialog';
import UsBannerDialog from './UsBannerDialog';

function IdeaCardComponent(props) {

    const [isNew, setIsNew] = useState(false)
    const [showIframe, setShowIframe] = useState(false)
    const [showShrtIframe, setShowShrtIframe] = useState(false)
    const [tokenUrlValue, setTokenUrlValue] = useState(null)
    const [formId, setFormId] = useState(null)
    const [streamingResp, setStreamingResp] = useState(null)
    const [symbolListLong, setSymbolListLong] = useState([])
    const [symbolListShort, setSymbolListShort] = useState([])
    // const [rdata, setrdata] = useState([])

    const connectFormRef = useRef(null)
    const selectedInvestNowCard = useRef(null)
    const requestIdeas = "request={data:{}}"

    useEffect(() => {
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.MARKET_SMITH+props.cardIndex);

    })

    useEffect(() => {
        if(((props.ideasInfo.key==IDEAS_CARD.MARKET_SMITH_LONG_TERM) && 
        (props.ideasInfo.subScpStus == SUBSCRIPTION_STATUS.SUBSCRIBED_USER))){
            if(props.ideasInfo.topPack && props.ideasInfo.topPack.length){
                setSymbolListLong(props.ideasInfo.topPack)
                streamingSubscription(props.ideasInfo.topPack)
            }
        }
        else if(((props.ideasInfo.key==IDEAS_CARD.MARKET_SMITH_SHORT_TERM) && 
        (props.ideasInfo.subScpStus == SUBSCRIPTION_STATUS.SUBSCRIBED_USER))){
            if(props.ideasInfo.topPack && props.ideasInfo.topPack.length){
                setSymbolListShort(props.ideasInfo.topPack)
                streamingSubscription(props.ideasInfo.topPack)
            }
        }

    },[props.ideasInfo.topPack])

    useEffect(() => {
        if (streamingResp && streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    function streamingSubscription(symArrayList) {
        let symbols = symArrayList.map(l => l.sym)
        props.forceSubscribeLevel1(symbols, [STREAMING_KEYS.LTP, STREAMING_KEYS.CHANGE, STREAMING_KEYS.CHANGE_PER])
    }

    function setStreamingResptoSymbols(resp) {
        let { data } = resp;
        if(((props.ideasInfo.key==IDEAS_CARD.MARKET_SMITH_LONG_TERM) && 
        (props.ideasInfo.subScpStus == SUBSCRIPTION_STATUS.SUBSCRIBED_USER))){
            let newList = symbolListLong.map(row => {
                if (row.sym.streamSym === data.symbol) {
                    row = Object.assign({}, row, applyPaint(row, data));
                }
                return row;
            })
            setSymbolListLong(newList)

        }
        if(((props.ideasInfo.key==IDEAS_CARD.MARKET_SMITH_SHORT_TERM) && 
        (props.ideasInfo.subScpStus == SUBSCRIPTION_STATUS.SUBSCRIBED_USER))){
            let newList = symbolListShort.map(row => {
                if (row.sym.streamSym === data.symbol) {
                    row = Object.assign({}, row, applyPaint(row, data));
                }
                return row;
            })
            setSymbolListShort(newList)

        }
    }

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    useEffect(() => {
        if(showIframe && (props.ideasInfo.key==IDEAS_CARD.MARKET_SMITH_LONG_TERM)){
            document.forms[formId].submit()
        }
    },[showIframe,tokenUrlValue])
    
    function onIdeasCard() {
        callTaxDeclaration(null, TAX_DECLARE_BLOCK_SCREENS.IDEAS, viewMoreFormSubmit)
    }

    function viewMoreFormSubmit() {
        if(props.ideasInfo.key==IDEAS_CARD.MARKET_SMITH_SHORT_TERM)
        {
            setTokenUrlValue(props.ideasInfo.iFrameUrl)
            // generateTokenShortTerm(props.ideasInfo.tokenUrl, props.ideasInfo.lgReqBody)
            setShowShrtIframe(true)
        }
        else if(props.ideasInfo.key==IDEAS_CARD.MARKET_SMITH_LONG_TERM){
            generateToken(props.ideasInfo.tokenUrl, props.ideasInfo.headers,"longTermForm")
            setShowIframe(true)

        }
        else{
            connectFormRef.current.submit()
            AF_EventTriggered(AF_EVENT_NAMES.IDEAS , AF_EVENT_TYPES.IDEAS_VIEW_MORE)        }

    }

    function onPickRightCard(item) {
        selectedInvestNowCard.current = item
        callTaxDeclaration(null, TAX_DECLARE_BLOCK_SCREENS.IDEAS, continueInvestNow)
    }

    function continueInvestNow() {
        if (selectedInvestNowCard.current) {
            let requestVas= {}
            if(props.ideasInfo.key==IDEAS_CARD.PICKRIGHT){
                requestVas = { token: selectedInvestNowCard.current.token }
                
            }else{
                requestVas = { bondId: selectedInvestNowCard.current.token }      
            } 
            openWindowWithPost(props.ideasInfo.link, requestVas)
        }
    }

    function openWindowWithPost(url, params) {
        let form = document.createElement("form");
        form.target = "_blank";
        form.method = "POST";
        form.action = url;
        form.style.display = "none";

        for (let i in params) {
            let input = document.createElement('input');
            input.type = 'hidden';
            input.name = i;
            input.value = params[i];
            form.appendChild(input);
        }
        document.body.appendChild(form);
        form.submit();
        AF_EventTriggered(AF_EVENT_NAMES.IDEAS , AF_EVENT_TYPES.BS)
    }

    function generateToken(url, params,formIDVal) {
        let form = document.createElement("form");
        let uniqueId = new Date()
        form.target = "my_iframe";
        formIDVal = formIDVal +uniqueId.getTime().toString()
        form.id = formIDVal;
        form.method = "POST";
        form.style.display = "none";
        setFormId(formIDVal)

        let tokenUrl = new URL(url);
        let urlParams = {}
        let new_url
        for (let i in params) {
            let input = document.createElement('input');
            // if(formIDVal == "longTermForm"){
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
            // }
            // else if(formIDVal == "shortTermForm"){
            //     let new_params = new URLSearchParams([
            //         ...Object.entries(params),
            //     ]).toString();
            //     new_url = new URL(`${tokenUrl.origin}${tokenUrl.pathname}?${new_params}`);
            //     input.type = 'hidden';
            //     input.name = i;
            //     input.value = params[i];
            // }
            form.appendChild(input);
            setTokenUrlValue(new_url.href)
            form.action = new_url.href;
        }
        document.body.appendChild(form);
    }

    // function generateTokenShortTerm(url, params){
    //     // console.log('url :', url);
    //     let contentType = Object.keys(params)
    //         .filter((key) => key.includes("Content-Type"))
    //         .reduce((obj, key) => {
    //             return Object.assign(obj, {
    //                 [key]: params[key]
    //             });
    //         }, {});
    //     let bodyParams = Object.keys(params)
    //         .filter((key) => (key != "Content-Type") && (key != "grant_type"))
    //         .reduce((obj, key) => {
    //             return Object.assign(obj, {
    //                 [key]: params[key]
    //             });
    //         }, {});
        
    //     console.log('bodyParams :', bodyParams);
    //     // console.log('contentType :', contentType);
    //     fetch(url, {
    //         method: 'POST',
    //         dataType: "json",
    //         headers: contentType,
    //         body: JSON.stringify({
    //             "userName": "bajaj_user@bajaj.com",
    //             "password": "Bajaj@SwT2022!",
    //             "userId": "574578F08F32665D2BEACEB4DEEE",
    //             "userAgent": "Bajaj",
    //             "userState": "Premium",
    //             "endDate": "2023-12-15",
    //             "authToken": "2BB49E54560FCFB158D8358B141794F937AC9ADE"
    //         })
    
    //     })
    //         .then(function(res){ 
    //             // console.log("fetchres",res)
    //             res.json().then((data) => {
    //                 console.log("rdataaa",data);
                    
    //                 if(data){
    //                     setrdata(data)
    //                 //     // let swiframe=document.getElementById("global-auth-frame");
    //                 //     // console.log("id",swiframe)
    //                 //     // let win = swiframe.contentWindow;
    //                 //     // win.postMessage(JSON.stringify({
    //                 //     //     key: 'IsBajajUser',
    //                 //     //     data: data }), "*");
    //                 //     // window.location.href("https://brokers.swingtraderindia.com/#/currentTrades")
    //                 // }
    //                 }
    //             });
                
    //         })
    //         .catch(function(res){ console.log("errorfetch",res) })
    
    // }

    function showDialog(flag, regetList = false) {
        setIsNew(flag)
        if (regetList)
            props.getIdeaInfoCB && props.getIdeaInfoCB()
    }
    function renew(){
        props.storeMarketSmithSubscrptnAllDetails(props.ideasInfo)
        props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.MARKETSMITH_VIEW)
        props.storeMarketSmithData({
            marketSmtScreen:MARKETSMITH_SCREENS.SUBSCRIPTION,
            marketSmithButtonVal: "renew"
        })
        props.storeIsRenewalFlag(true)
      
    }

    function cancelSubscriptionPlan(){
        props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.MARKETSMITH_VIEW)
        props.storeMarketSmithSubscrptnAllDetails(props.ideasInfo)
        props.storeMarketSmithSubscrptnId(props.ideasInfo.id)
        props.storeMarketSmithData({
            marketSmtScreen:MARKETSMITH_SCREENS.RENEW_SUBSCRIPTION,
            marketSmithButtonVal: "cancel"
        })
        props.storeIsRenewalFlag(true)

    }

    function handleSymAction(val){
        gotoTrade(val,val.action,null,"ideas") 
        
    }

    function handleNewSubscription(){
        props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.MARKETSMITH_VIEW)
        props.storeMarketSmithSubscrptnAllDetails(props.ideasInfo)

        props.storeMarketSmithData({
            marketSmtScreen:MARKETSMITH_SCREENS.SUBSCRIPTION
        })
        props.storeIsRenewalFlag(false)

    }
    function handleViewMoreLong(){
        let element = document.querySelectorAll(".hideLongCard");
        for(let i in element){
            if(element[i].classList){
                element[i].classList.remove("hideLongCard")
                
            }
        }
        let viewBtn = document.querySelector(".viewmoreBtn.long")
        viewBtn.style.display = "none"
        
    }
    function handleViewMoreShort(){
        let element = document.querySelectorAll(".hideShortCard");
        for(let i in element){
            if(element[i].classList){
                element[i].classList.remove("hideShortCard")
            }
        }
        let viewBtn = document.querySelector(".viewmoreBtn.shrt")
        viewBtn.style.display = "none"
    }
    return (
        <div className="row">
            <>

                {props.ideasInfo.key == IDEAS_CARD.PICKRIGHT ?
             
                    <div className="pickright">
                        <div className="head-div">
                            <div className="title-row">
                                <img className="pick-img" src="assets/images/pickright_logo.svg" alt="" />

                                <span className="head">
                                    {props.ideasInfo.idea}
                                </span>
                            </div>
                            <div className="view cursor" onClick={() => onIdeasCard()}>
                                <LangText module="IDEAS" name="MARKETSMITH_VIEW_MORE" />
                            </div>
                        </div>
                        <div className="column colu-pick">
                            {
                                props.ideasInfo.topPack.map((item, index) => {
                                    return (
                                        <div key={index} className="card pickright-card" >
                                            <div className="bank-img-div">
                                                <img src={item.imgLnk} alt="" />
                                            </div>
                                            <div className="topPack">
                                                <div className="name-head">
                                                    <span className="title">{item.name}</span>
                                                    <span className="cmp">{item.cmp ? '₹ ' : ''}{item.cmp}</span>
                                                </div>
                                                <div className="data cagr">
                                                    <div className="cgrDiv">
                                                        
                                                        <span className="cagrLabel">
                                                            <LangText name="RETURN_CAGR" />
                                                        </span>
                                                        {/* <div className="valueGraph-base">
                                                            <div className={`valueGraph 
                                                            ${item.oneDyr < 0 ? "negGraph" : ""}`}
                                                            style={{ width: Math.abs(item.oneDyr) + "%" }}
                                                            ></div>
                                                        </div>
                                                        <span className="value">
                                                            {item.oneDyr}{item.oneDyr ? '%' : ''}
                                                        </span> */}

                                                    </div>
                                                    <div className="cgrDiv">
                                                        {/* <span className="label">
                                                            <LangText module="IDEAS" name="TENDAYS_RETURN" />
                                                        </span>
                                                        <div className="valueGraph-base">
                                                            <div className={`valueGraph 
                                                            ${item.sevnDyr < 0 ? "negGraph" : ""}`}
                                                            style={{ width: Math.abs(item.sevnDyr) + "%" }}
                                                            ></div>
                                                        </div>
                                                        <span className="value">
                                                            {item.sevnDyr}{item.sevnDyr ? '%' : ''}
                                                        </span> */}
                                                        <span className={`cagrValue ${getColorCode(item.cagr)}`}>
                                                            {item.cagr}{item.cagr ? '%' : ''}
                                                        </span> 
                                                    </div>

                                                </div>
                                                <button className="ideas-btn" onClick={() => onPickRightCard(item)}>
                                                    <LangText module="IDEAS" name="PICKRIGHT_BTN" />
                                                </button>

                                            </div>
                                        </div>
                                    )
                                }
                                )

                            }
                            <div className="error-div">{props.ideasInfo.msg}</div>
                        </div>

                    </div>
                    // : props.ideasInfo.key == IDEAS_CARD.US_STOCKS  ?

                //     <div className="pickright">
                //         <div className="head-div">
                //             <div className="title-row">
                //                 <img className="pick-img" src="assets/images/vested_logo.svg" alt="" />
                //                 <span className="head">
                //                     {props.ideasInfo.idea}
                //                 </span>
                //             </div>
                //             <div className="view cursor" onClick={!props.ideasInfo.isNew ?
                //                 () => onIdeasCard() : () => showDialog(true)}>
                //                 <LangText module="IDEAS" name="MARKETSMITH_VIEW_MORE" />
                //             </div>
                //         </div>
                //         <div className="column colu-us">
                //             {
                //                 props.ideasInfo.topPack.map((item, index) => {
                //                     return (
                //                         <div key={index} className="card usinvest-card" >
                //                             <div className="bank-img-div">
                //                                 <img src={item.imgLnk} alt=""/>
                //                             </div>
                //                             <div className="topPack">
                //                                 <div className="name-head">
                //                                     <span className="title">{item.name}</span> 
                //                                 </div>
                //                                 <div className="data">
                //                                     <div className="val">
                //                                         <span className="label">
                //                                             <LangText module="IDEAS" name="SECTOR" />
                //                                         </span>
                //                                         <span className="value">{item.sector}</span>
                //                                     </div>
                //                                     <div className="val">
                //                                         <span className="label">
                //                                             <LangText module="IDEAS" name="STOCK" />
                //                                         </span>
                //                                         <span className="value">{item.catgry}</span>
                //                                     </div>
                //                                 </div>
                //                                 <button className="ideas-btn"
                //                                     onClick={!props.ideasInfo.isNew ?
                //                                         () => onIdeasCard() : () => showDialog(true)}>
                //                                     <LangText module="IDEAS" name="PICKRIGHT_BTN" />
                //                                 </button>

                //                             </div>
                //                         </div>
                //                     )
                //                 }
                //                 )

                    //             }
                    //             <div className="error-div">{props.ideasInfo.msg}</div>
                    //         </div>
                    //     </div>
                    :  props.ideasInfo.key == IDEAS_CARD.GOLDEN_PI  ?
            
                        <div className="pickright">
                            <div className="head-div">
                                <div className="title-row">
                                    <img className="pick-img" src="assets/images/goldenpi_logo.svg" alt="" />
                                    <span className="head">
                                        {props.ideasInfo.idea}
                                    </span>
                                </div>
                                <div className="view cursor" onClick={() => onIdeasCard()}>
                                    <LangText module="IDEAS" name="MARKETSMITH_VIEW_MORE" />
                                </div>
                            </div>
                            <div className="column colu-goldenpi">
                                {
                                    props.ideasInfo.topPack.map((item, index) => {
                                        return (
                                            <div key={index} className="card goldenpi-card" >
                                                <div className="bank-img-div">
                                                    <img src={item.imgLnk} alt=""/>
                                                </div>
                                                <div className="topPack">
                                                    <div className="goldenpi-head">
                                                        <span className="title">{item.name}</span>
                                                        <div className="golden-val">
                                                            <span className="label">
                                                                <LangText module="IDEAS" name="MIN_INV" />
                                                            </span>
                                                            <span className="cmp">{item.cmp ? '₹ ' : ''}
                                                                {item.cmp}
                                                            </span>
                                                        </div>
                                                    </div>
                                                   
                                                    <div className="data">
                                                        <div className="val">
                                                            <span className="label">
                                                                <LangText module="IDEAS" name="YIELD" />
                                                            </span>
                                                            <span className="value">
                                                                {item.yld}{item.yld ? '%' : ''}
                                                            </span>
                                                        </div>
                                                        <div className="val">
                                                            <span className="label">
                                                                <LangText module="IDEAS" name="PAYMENT" />
                                                            </span>
                                                            <span className="value">{item.prd}</span>
                                                        </div>
                                                    </div>
                                                    <button className="ideas-btn" onClick={() => onPickRightCard(item)}>
                                                        <LangText module="IDEAS" name="PICKRIGHT_BTN" />
                                                    </button>
                                                   
                                                </div>
                                            </div>
                                        )
                                    }
                                    )
                                
                                }
                                <div className="error-div">{props.ideasInfo.msg}</div>
                            </div>
                        </div>
                      
                        : props.ideasInfo.key == IDEAS_CARD.MARKET_SMITH_LONG_TERM  ?
                            <div className="marketsmith longTerm">
                                <div className="heading-div">
                                    <div className="title-rows">
                                        <img className="pick-img" src="assets/images/market_smith.png" alt="" />
                                        <span className="heading">
                                            {props.ideasInfo.idea}
                                        </span>
                                    </div>
                                    
                                    {/* {props.ideasInfo.subScpStus == SUBSCRIPTION_STATUS.SUBSCRIBED_USER ? */}
                                    <div className="view cursor" onClick={() => onIdeasCard()}>
                                        <LangText module="IDEAS" name="MARKETSMITH_VIEW_MORE" />
                                    </div> 
                                    {/* : null} */}
                                </div>
                                <div className="label-div">
                                    <div className="description">
                                        <LangText module="MARKET_SMITH" name="MRKT_SMT_LONG_CONTENT" />
                                    </div>
                                </div>
                                {
                                    props.ideasInfo.subScpStus == SUBSCRIPTION_STATUS.SUBSCRIBED_USER ?
                                        ((props.ideasInfo.expAlert || props.ideasInfo.isCancellable) ?
                                            <div  className="expiryCount">
                                               
                                                <div className="expiryDetailParent">
                                                    {
                                                        props.ideasInfo.expAlert ?
                                                            <>
                                                                <span className="expiryClockIcon"><Timer_icon/></span>
                                                                <span className="expiryDetailDiv cursor" 
                                                                    onClick={renew}>
                                                                    {props.ideasInfo.expMsg}
                                                                    {/* <LangText module="MARKET_SMITH" name="PACKAGE_EXPIRY" /> */}
                                                                    {/* <span className="expiryCountDetail">7 Days</span> */}
                                                                </span>
                                                            </>: null}
                                                </div> 
                                                {
                                                    props.ideasInfo.isCancellable ?
                                                        <div className="cancelSubscription cursor" 
                                                            onClick={cancelSubscriptionPlan}>
                                                            <LangText module="MARKET_SMITH" name="CANCEL_BTN" />
                                                        </div> :
                                                        null
                                                }
                                            </div> : null):
                                        null
                                }
                                <div className={`column colu-marketsmith 
                                    ${props.ideasInfo.subScpStus != SUBSCRIPTION_STATUS.SUBSCRIBED_USER ?
            "blurLock" : ""}`}>
                                    {
                                        props.ideasInfo.subScpStus == SUBSCRIPTION_STATUS.SUBSCRIBED_USER ?
                                            symbolListLong.map((item, index) => {
                                            // trialData.map((item, index) => {
                                                
                                                return (
                                                    <div key={index} 
                                                        className={`card 
                                                        marketsmith-card ${index > 2 ? "hideLongCard" : null}`}
                                                        id={(index > 2) ? "moreLng" : null}>
                                                        {/* <div className="bank-img-div">
                                                            <img src={item.imgLnk} alt=""/>
                                                        </div> */}
                                                        <div className="topPack">
                                                            <div className="name-head">
                                                                <span className="title">{item.baseSym}</span>
                                                                <span className={`actionZone 
                                                                ${item.action == "BUY" ? "" : "sellZoneDiv"}`}>
                                                                    {item.action == "BUY" ?
                                                                        <LangText 
                                                                            module="MARKET_SMITH" name="BUY_ZONE" /> : 
                                                                        (item.action == "SELL" ? <LangText 
                                                                            module="MARKET_SMITH" 
                                                                            name="SELL_ZONE" /> : "")}</span>
                                                            </div>
                                                   
                                                            <div className="data">
                                                                <div className="val">
                                                                    <span className="label">
                                                                        <LangText 
                                                                            module="MARKET_SMITH" name="CMP" />
                                                                    </span>
                                                                    <span className="value">
                                                                        {item.ltp}
                                                                    </span>
                                                                </div>
                                                                <div className="val">
                                                                    <span className="label">
                                                                        <LangText 
                                                                            module="MARKET_SMITH" 
                                                                            name="CHNG_ADDED" />
                                                                    </span>
                                                                    <span 
                                                                        className={`value ${getColorCode(item.chng)}`}>
                                                                        {item.chng}({item.chngPer}%)
                                                                    </span>
                                                                </div>
                                                            </div>
                                                      
                                                            <button className="ideas-btn" 
                                                                onClick={() =>handleSymAction(item)}
                                                            >
                                                                {item.action ? getLangText(item.action) : null}
                                                                {/* <LangText module="MARKET_SMITH" name="BUY_BTN" /> */}
                                                            </button>
                                                   
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            ) :
                                            (props.ideasInfo.subScpStus == SUBSCRIPTION_STATUS.NEW_USER) || 
                                            (props.ideasInfo.subScpStus == SUBSCRIPTION_STATUS.SUBSCRIPTION_EXPIRED) ?
                                                <div 
                                                    className="newSubscription">
                                                    <button onClick={handleNewSubscription} 
                                                        className="unlockbutton">
                                                        {(props.ideasInfo.subScpStus == 
                                                            SUBSCRIPTION_STATUS.SUBSCRIPTION_EXPIRED) ?
                                                            <LangText module="MARKET_SMITH" 
                                                                name="RENEW_NOW" /> : 
                                                            <LangText module="MARKET_SMITH" 
                                                                name="UNLOCK_NOW" />}<RightArrowIcon2/></button>
                                                    <p className="unlockContent"><LangText module="MARKET_SMITH" 
                                                        name="UNLOCK_CONTENT_LONG" /></p></div>
                                                : (((props.ideasInfo.subScpStus == 
                                                    SUBSCRIPTION_STATUS.PENDING)
                                                     && props.ideasInfo.pendFlag) ?
                                                    <p className="pendingContent">{props.ideasInfo.pendMsg}</p> : null)
                                
                                    }
                                    {
                                        ((props.ideasInfo.subScpStus == SUBSCRIPTION_STATUS.SUBSCRIBED_USER) && 
                                        (props.ideasInfo.topPack.length > 3)) ?
                                            <button onClick={handleViewMoreLong}
                                                className="viewmoreBtn long">
                                                <LangText module="MARKET_SMITH" 
                                                    name="UNLOCK_NOW" /><RightArrowIcon2/></button> : null}
                                    {props.ideasInfo.subScpStus == SUBSCRIPTION_STATUS.SUBSCRIBED_USER ?
                                        <div className="error-div">{props.ideasInfo.msg}</div> : null }
                                </div>
                            </div>
                            : props.ideasInfo.key == IDEAS_CARD.MARKET_SMITH_SHORT_TERM  ?
            
                                <div className="marketsmith shrtTerm">
                                    <div className="heading-div">
                                        <div className="title-rows">
                                            <img className="pick-img" src="assets/images/market_smith.png" alt="" />
                                            <span className="heading">
                                                {props.ideasInfo.idea}
                                            </span>
                                        </div>
                                        
                                        {/* {props.ideasInfo.subScpStus == SUBSCRIPTION_STATUS.SUBSCRIBED_USER ? */}
                                        <div className="view cursor" onClick={() => onIdeasCard()}>
                                            <LangText module="IDEAS" name="MARKETSMITH_VIEW_MORE" />
                                        </div> 
                                        {/* : null} */}
                                    </div>
                                    <div className="label-div">
                                        <div className="description">
                                            <LangText module="MARKET_SMITH" name="MRKT_SMT_SHORT_CONTENT" />
                                        </div>
                                    </div>
                                    {
                                        props.ideasInfo.subScpStus == SUBSCRIPTION_STATUS.SUBSCRIBED_USER ?
                                            ((props.ideasInfo.expAlert || props.ideasInfo.isCancellable) ?

                                                <div  className="expiryCount">
                                                   
                                                    <div className="expiryDetailParent">
                                                        {
                                                            props.ideasInfo.expAlert ?
                                                                <>
                                                                    <span className="expiryClockIcon">
                                                                        <Timer_icon/></span>
                                                                    <span className="expiryDetailDiv cursor" 
                                                                        onClick={renew}>
                                                                        {props.ideasInfo.expMsg}
                                                                        {/* <LangText module="MARKET_SMITH" name="PACKAGE_EXPIRY" /> */}
                                                                        {/* <span className="expiryCountDetail">7 Days</span> */}
                                                                    </span>
                                                                </>: null}
                                                    </div> 
                                                    {
                                                        props.ideasInfo.isCancellable ?
                                                            <div className="cancelSubscription cursor" 
                                                                onClick={cancelSubscriptionPlan}>
                                                                <LangText module="MARKET_SMITH" name="CANCEL_BTN" />
                                                            </div> :
                                                            null
                                                    }
                                                </div> : null):
                                            null
                                    }
                                    <div className={`column colu-marketsmith 
                                    ${props.ideasInfo.subScpStus != SUBSCRIPTION_STATUS.SUBSCRIBED_USER ?
            "blurLock" : ""}`}>
                                        {
                                            props.ideasInfo.subScpStus == SUBSCRIPTION_STATUS.SUBSCRIBED_USER ?
                                                symbolListShort.map((item, index) => {
                                                // trialData.map((item, index) => {
                                                    return (
                                                        <div key={index} className={`card 
                                                        marketsmith-card ${index > 2 ? "hideShortCard" : null}`}
                                                        id={(index > 2) ? "moreShrt" : null}>
                                                            {/* <div className="bank-img-div">
                                                                <img src={item.imgLnk} alt=""/>
                                                            </div> */}
                                                            <div className="topPack">
                                                                <div className="name-head">
                                                                    <span className="title">{item.baseSym}</span>
                                                                    {/* <span className="actionZone masterScore">
                                                                        <LangText 
                                                                            module="MARKET_SMITH" 
                                                                            name="MASTER_SCORE" /></span> */}
                                                                </div>
                                               
                                                                <div className="data">
                                                                    <div className="val">
                                                                        <span className="label">
                                                                            <LangText 
                                                                                module="MARKET_SMITH" name="CMP" />
                                                                        </span>
                                                                        <span className="value">
                                                                            {item.ltp}
                                                                        </span>
                                                                    </div>
                                                                    <div className="val">
                                                                        <span className="label">
                                                                            <LangText 
                                                                                module="MARKET_SMITH" 
                                                                                name="CHNG_ADDED" />
                                                                        </span>
                                                                        <span 
                                                                            className={`value 
                                                                            ${getColorCode(item.chng)}`}>
                                                                            {item.chng}({item.chngPer}%)
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                  
                                                                <button className="ideas-btn" 
                                                                    onClick={() =>handleSymAction(item)}
                                                                >
                                                                    {item.action ?  getLangText(item.action) : null}

                                                                    {/* <LangText module="MARKET_SMITH" name="BUY_BTN" /> */}
                                                                </button>
                                               
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                ) :
                                            
                                                (props.ideasInfo.subScpStus == SUBSCRIPTION_STATUS.NEW_USER) || 
                                            (props.ideasInfo.subScpStus == SUBSCRIPTION_STATUS.SUBSCRIPTION_EXPIRED) ?
                                                    <div 
                                                        className="newSubscription">
                                                        <button onClick={handleNewSubscription}
                                                            className="unlockbutton">
                                                            {(props.ideasInfo.subScpStus == 
                                                            SUBSCRIPTION_STATUS.SUBSCRIPTION_EXPIRED) ?
                                                                <LangText module="MARKET_SMITH" 
                                                                    name="RENEW_NOW" /> : 
                                                                <LangText module="MARKET_SMITH" 
                                                                    name="UNLOCK_NOW" />}
                                                            <RightArrowIcon2/></button>
                                                                
                                                        <p className="unlockContent">
                                                            <LangText module="MARKET_SMITH" 
                                                                name="UNLOCK_CONTENT_SHORT" /></p></div>
                                                    : (((props.ideasInfo.subScpStus == 
                                                        SUBSCRIPTION_STATUS.PENDING)
                                                         && props.ideasInfo.pendFlag) ?
                                                        <p className="pendingContent">{props.ideasInfo.pendMsg}</p>
                                                        : null)
                            
                                        }
                                        {
                                            ((props.ideasInfo.subScpStus == SUBSCRIPTION_STATUS.SUBSCRIBED_USER) && 
                                            (props.ideasInfo.topPack.length > 3)) ?
                                                <button onClick={handleViewMoreShort}
                                                    className="viewmoreBtn shrt">
                                                    <LangText module="MARKET_SMITH" 
                                                        name="UNLOCK_NOW" /><RightArrowIcon2/></button> : null}
                                        {props.ideasInfo.subScpStus == SUBSCRIPTION_STATUS.SUBSCRIBED_USER ?
                                            <div className="error-div">{props.ideasInfo.msg}</div> : null }
                                    </div>
                                </div>

                                : null}

                <form action={props.ideasInfo.link}
                    method="POST"
                    target="_blank"
                    id="test"
                    ref={connectFormRef}>
                    <input type="hidden" name="vestedssoUS"
                        value={requestIdeas} />
                </form>
                {/* <form action={tokenUrlValue}
                    method="GET"
                    target="my_iframe"
                    id="my_iframe"
                    ref={connectMSIframeRef}>
                    <input type="hidden" name="userAgent"
                        value="Bajaj" />
                    <input type="hidden" name="uid"
                        value="YW5pa2NzaGFoQGdtYWlsLmNvbQ%3D%3D" />
                    <input type="hidden" name="userState"
                        value="Premium" />
                    <input type="hidden" name="endDate"
                        value="2022-06-29" />
                    <input type="hidden" name="startDate"
                        value="2022-06-10" />
                    <input type="hidden" name="userType"
                        value="Diamond" />
                    <input type="hidden" name="authToken"
                        value="94B5D2CC02D0A54952F1F29FDB0A676A4699A436" />
                </form> */}
            </>
            {isNew ?
                <div>
                    <UsBannerDialog
                        Link={props.ideasInfo.link}
                        showDialog={showDialog} />
                </div>
                : ""
            }
            {showIframe?
                <MarketSmithIframeDialog setShowIframe={setShowIframe} tokenUrlValue={tokenUrlValue} 
                    iframeSrc={props.ideasInfo.link}  termKey = {props.ideasInfo.key} logoutUrl = {props.ideasInfo.logout}/> : null
            }
            {showShrtIframe?
                <MarketSmithShortIframeDialog setShowShrtIframe={setShowShrtIframe} tokenUrlValue={tokenUrlValue} 
                    iframeSrc={props.ideasInfo.link}  
                    termKey = {props.ideasInfo.key} lgReqBody={props.ideasInfo.lgReqBody} 
                    urlTokenGeneration = {props.ideasInfo.tokenUrl}  logoutUrl = {props.ideasInfo.logout}/> : null
            }
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeMarketSmithData: (s) => { dispatch(storeMarketSmithData(s)) },
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) },
        storeMarketSmithDialogDetails: (s) => { dispatch(storeMarketSmithDialogDetails(s)) },
        storeMarketSmithSubscrptnId: (s) => { dispatch(storeMarketSmithSubscrptnId(s)) },
        storeMarketSmithSubscrptnAllDetails: (s) => { dispatch(storeMarketSmithSubscrptnAllDetails(s)) },
        storeIsRenewalFlag: (s) => { dispatch(storeIsRenewalFlag(s)) },

    };
};

export default connect(null, mapDispatchToProps)(withStreaming(IdeaCardComponent));