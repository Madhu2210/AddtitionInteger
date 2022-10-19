/* eslint-disable */
import useFetch from '@msf/msf-reactjs-weblib-base'
import React, { useEffect ,useState, useRef} from 'react'
import { connect } from 'react-redux'
import { MsfRequest } from '../../../../../..'
import { gotoTrade } from '../../../../../../common/Bridge'
import { getIdeasBaseURL } from '../../../../../../common/CommonMethods'
import { MARKETSMITH_DIALOG_SCREENS } from '../../../../../../common/Constants'
import { OTHER_PRODUCTS_SERVICE } from '../../../../../../config/ServiceURLs'
import { storeMarketSmithDialogDetails } from '../../../../../../state/actions/Actions'
import { CloseIcon } from '../../../../../common/FontIcons'
import { Loader } from '../../../../../common/LoaderComponent'

function MarketSmithShortIframeDialog(props) {

    const MsfFetch = useFetch()
    const iframeRef = useRef()
    const [rdata,setRdata] = useState(null)

    useEffect(() => {

        props.showLoader()
        setTimeout(() => {
            makeRequest()
        }, 500)
        
    },[])
    
    useEffect(() => {

        if(rdata){

            let shrtTermiframe=document.getElementById("my_iframe").contentWindow
            shrtTermiframe.postMessage(JSON.stringify({
                key: 'IsBajajUser',
                data: rdata }), "*");
            setTimeout(() => {
                iframeRef.current.src=props.iframeSrc        
            }, 100)
                
        }
        
    },[rdata])
    useEffect(() => {
        window.addEventListener("message", (values)=>{
            // values.data contains the message sent
            if(values.data.stockSymbol && values.data.stockAction){
                let request = new MsfRequest();
                request.setEncrypt(false)
                request.addToData({
                    sym: {
                        exc: "NSE",
                        baseSym: values.data.stockSymbol
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
                document.getElementById("my_iframe").src=props.logoutUrl;
                setTimeout(() => {
                    gotoTrade(response.data.results,values.data.stockAction,null,"ideas")

                }, 1500)
            
            } 
        
            function errorRespCBGetSymbolInfo(error){
                props.storeMarketSmithDialogDetails({
                    marketSmithSubscrptnData:error.message,
                    marketSmithDialogScreen:MARKETSMITH_DIALOG_SCREENS.IFRAME_P0PUP,
                })     
            } 
        });
       
    },[])
    
    function closeCB() {
        document.getElementById("my_iframe").src=props.logoutUrl;
        setTimeout(() => {
            props.setShowShrtIframe(false)

        }, 1500)
    }
   
    function makeRequest() {
        props.hideLoader()
        generateTokenShortTerm(props.urlTokenGeneration,props.lgReqBody)
    }

    function generateTokenShortTerm(url, params){
        let contentType = Object.keys(params)
            .filter((key) => key.includes("Content-Type"))
            .reduce((obj, key) => {
                return Object.assign(obj, {
                    [key]: params[key]
                });
            }, {});
        let bodyParams = Object.keys(params)
            .filter((key) => (key != "Content-Type") && (key != "grant_type"))
            .reduce((obj, key) => {
                return Object.assign(obj, {
                    [key]: params[key]
                });
            }, {});
            
        fetch(url, {
            method: 'POST',
            headers: contentType,
            body: JSON.stringify(bodyParams)
        
        })
            .then(response => response.json())
            .then(data => {
                setRdata(data)
               
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <div className="app-modalDialog2 marketsmith-iframe">
            <div className="window">
                <span className="closeIcon-div" onClick={closeCB}>
                    <CloseIcon />
                </span>
                <div className="content">
                    <iframe name="my_iframe"
                        ref={iframeRef}
                        id="my_iframe"
                        className="iframe"
                        height="100%"
                        width="100%"
                        src={props.tokenUrlValue}
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

export default connect(mapStateToProps,mapDispatchToProps)(Loader(MarketSmithShortIframeDialog))