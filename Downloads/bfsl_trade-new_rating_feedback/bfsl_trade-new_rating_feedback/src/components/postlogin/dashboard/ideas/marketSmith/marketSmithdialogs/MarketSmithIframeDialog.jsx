/* eslint-disable */
import useFetch from '@msf/msf-reactjs-weblib-base'
import React, {   useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { MsfRequest } from '../../../../../..'
import { gotoTrade } from '../../../../../../common/Bridge'
import { getIdeasBaseURL } from '../../../../../../common/CommonMethods'
import { IDEAS_CARD, MARKETSMITH_DIALOG_SCREENS } from '../../../../../../common/Constants'
import {  OTHER_PRODUCTS_SERVICE } from '../../../../../../config/ServiceURLs'
import { storeMarketSmithDialogDetails } from '../../../../../../state/actions/Actions'
import { CloseIcon } from '../../../../../common/FontIcons'
import { Loader } from '../../../../../common/LoaderComponent'
// import { gotoTrade } from '../../../../common/Bridge'
// import {  ORDER_TYPES, TRIALDEMO_SYM_DATA } from '../../../../common/Constants'

// import { CloseIcon } from '../../../common/FontIcons'

function MarketSmithIframeDialog(props) {
    const [urlTrial,seturlTrial] = useState(null)
    const MsfFetch = useFetch()

    useEffect(() => {
        props.showLoader()
        
    },[])

    function closeCB() {
        seturlTrial(props.logoutUrl)
        setTimeout(() => {
            props.setShowIframe(false)

        }, 500)

    }

    // function iframeIdeasLoadFn(){
    //     props.hideLoader()
    //     // let myIframe = document.getElementById("my_iframe").contentWindow;
    //     let msg={symDtls:TRIALDEMO_SYM_DATA,symAction:ORDER_TYPES.BUY};
    //     window.parent.postMessage(msg,'*')  
    //     console.log('myIframe :', props.flagVal);
          
    //     makeRequest();
    // }
    window.addEventListener("message", (values)=>{
        if(values.data.symbol && values.data.orderType){
            let request = new MsfRequest();
            request.setEncrypt(false)
            request.addToData({
                sym: {
                    exc: values.data.exchange,
                    baseSym: values.data.symbol
                }
            })
            MsfFetch.placeRequest(
                getIdeasBaseURL() + OTHER_PRODUCTS_SERVICE.MARKET_SMITH_GET_SYMBOLS,
                request,
                successRespGetSymbolInfo,
                errorRespCBGetSymbolInfo
            )
        }        
        function successRespGetSymbolInfo(response){
            seturlTrial(props.logoutUrl)
            setTimeout(() => {
                gotoTrade(response.data.results,values.data.orderType,null,"ideas")
            }, 500)
        
        } 
    
        function errorRespCBGetSymbolInfo(error){
            props.storeMarketSmithDialogDetails({
                marketSmithSubscrptnData:error.message,
                marketSmithDialogScreen:MARKETSMITH_DIALOG_SCREENS.IFRAME_P0PUP,
            })  
           
        }            
        // event.data contains the message sent
        // if(values.data.symDtls && values.data.symAction){
        // }
        // trialFn(values)
    });
    
    // function trialFn(values){
    //     setTimeout(() => {
    //         gotoTrade(values.data.symDtls, values.data.symAction);
    //     }, 10000);
    // }
    function makeRequest() {
        props.hideLoader()
        if( props.termKey == IDEAS_CARD.MARKET_SMITH_LONG_TERM){

            fetch(props.tokenUrlValue, {
                method: 'POST'})
                .then(response => {
                    if(response.status == 200){
                        seturlTrial(props.iframeSrc)
                    }
                })
                .catch(err => {
                    console.log(err,"err404");
                });
        }

    }

    return (
        <div className="app-modalDialog2 marketsmith-iframe">
            <div className="window"  >
                <span className="closeIcon-div" onClick={closeCB}>
                    <CloseIcon />
                </span>
                <div className="content">
                    <iframe name="my_iframe"
                        id="my_iframe"
                        className="iframe"
                        height="100%"
                        width="100%"
                        onLoad={makeRequest}
                        src={urlTrial}
                    >
                    </iframe>
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = ({ las }) => {
    return {
        showIdeaIframe: las.showIdeaIframe,
    }
}

const mapDispatchToProps = (dispatch) => {
   
    return {
      
        storeMarketSmithDialogDetails: (s) => { dispatch(storeMarketSmithDialogDetails(s)) },
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Loader(MarketSmithIframeDialog))