import React ,{useEffect,useState} from 'react'
import { LOCAL_STORAGE } from '../../../common/Constants'
import { getItemFromSessionStorage } from '../../../common/LocalStorage'

function HelpAndFaqBaseComponent() {

    const [faqData,setFaqData]=useState([])

    useEffect(() => {
        let contenturl = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.LAS_HELP))
        if(contenturl){
            setFaqData(contenturl)
        }
    }, []) 
   
    return (
        <div className="las-help-faq-iframe-base">
            {/* <button
                onClick={(e) => {
                    e.preventDefault();
                    window.open(`${faqData.faq}`,"_blank");
                }}>Click Me
            </button> */}
            {/* {console.log("Link",faqData.faq)} */}
            <iframe
                id="LASHelpAndFaq"
                className="iframe"
                src={faqData.faq}
                height="100%"
                width="100%"
                name="iframeWebView"
                allowFullScreen="true"
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
            >
            </iframe>
        </div>
    )
}

export default HelpAndFaqBaseComponent;