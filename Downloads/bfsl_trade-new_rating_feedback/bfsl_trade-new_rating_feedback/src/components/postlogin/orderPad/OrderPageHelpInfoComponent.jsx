/* eslint-disable no-eq-null */
import React ,{ useEffect,  useState } from 'react'
import { connect } from "react-redux";
// eslint-disable-next-line no-shadow
import find from 'lodash/find';
import LangText from '../../../common/lang/LangText'
import { InfoIcon } from '../../common/FontIcons';

// var at = require('lodash/at');

function OrderPageHelpInfoComponent(props) {

    let orderMarketHelpTextArrayD=[
        {orderTypeTextKey: 'MARKET_INFO',orderType:'market',index:0},
        {orderTypeTextKey: 'LIMIT_INFO',orderType:'limit',index:1},
        {orderTypeTextKey: 'SL_INFO',orderType:'sl',index:2},
        {orderTypeTextKey: 'SL-M_INFO',orderType:'sl-m',index:3},
    ]

    const [infoOrderTypeText,setInfoOrderTypeText]=useState(null)
    useEffect(()=>{
        console.log("orderMarketHelpTextArrayD[0]",orderMarketHelpTextArrayD[0])
        setInfoOrderTypeText(orderMarketHelpTextArrayD[0])
    },[])
    useEffect(() => {

        let helpTextData=find(orderMarketHelpTextArrayD, 
            function(o) { return o.orderType == props.selectedOrderType.toLowerCase(); });

        console.log("helpTextData",helpTextData)
     
        setInfoOrderTypeText(helpTextData)
        // setInfoOrderTypeTextIndex(orderMarketHelpTextArrayIndex[`${props.selectedOrderType.toLowerCase()}`])
        
    }, [props.selectedOrderType])

    function goToNextInfoText(infoTextIndex){
        // alert("NEXT")
        let nextInfoTextIndex=infoTextIndex+1;
        console.log("nextInfoTextIndex",nextInfoTextIndex)
        let helpTextData=find(orderMarketHelpTextArrayD, function(o) { return o.index == nextInfoTextIndex; });     
        setInfoOrderTypeText(helpTextData)
        props.onSelectOrderType(helpTextData.orderType.toUpperCase())
    }

    function goToPrevInfoText(infoTextIndex){
        // alert("PREV")

        let prevInfoTextIndex=infoTextIndex-1;
        console.log("prevInfoTextIndex",prevInfoTextIndex)
        let helpTextData=find(orderMarketHelpTextArrayD, function(o) { return o.index == prevInfoTextIndex; });

        console.log("helpTextData Prev",helpTextData)
     
        setInfoOrderTypeText(helpTextData)
        props.onSelectOrderType(helpTextData.orderType.toUpperCase())
    }

    return(

        <div className="custom-header">
            <div className="custom-title">
                <span className="tooltip-icon"><InfoIcon/></span>
                <span className="hovercard">
                    <div className="custom-tooltip">
                        <h4>{props.selectedOrderType}</h4>
                        <p>{(infoOrderTypeText!=null)?
                            <LangText module="ORDER_PAD_HELP_INFO" 
                                name={infoOrderTypeText.orderTypeTextKey.toUpperCase()} />:null}</p>
                        <div className="tooltip-bottom">
                            {
                                (infoOrderTypeText!=null && infoOrderTypeText.index && infoOrderTypeText.index!==0)?
                                    <a href="javascript:void(0)" 
                                        onClick={()=>goToPrevInfoText(infoOrderTypeText.index)} 
                                        className="backBtn"> <span className="arrow-left"></span> Back</a>:null
                            
                            }
                            {
                                (infoOrderTypeText!=null && 
                                    infoOrderTypeText.index!=null && infoOrderTypeText.index!==3)?
                                    <a href="javascript:void(0)" 
                                        onClick={()=>goToNextInfoText(infoOrderTypeText.index)} 
                                        className="nextBtn">Next</a>:null
                            }
                        </div>
                    </div>
                </span>
            </div>
        </div>
    )
 
}

const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme
    }
}

export default connect(mapStateToProps, null)(OrderPageHelpInfoComponent);
