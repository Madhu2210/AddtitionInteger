import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { gotoTrade } from "../../../common/Bridge";
import { DASHBOARD_WIDGET_MODE, ORDER_TYPES } from "../../../common/Constants";
import LangText from "../../../common/lang/LangText";
import { storeSelectedDashboardWidget } from "../../../state/actions/Actions";
import LazyLoading from "../../common/LazyLoadingHOC";

function NewsTableComponent(props) {

    const [list, setList] = useState([])

    useEffect(() => {
        props.setScrollLimit(50)
        props.setScrollRef(document.getElementById('newsTable'))
    }, [])

    useEffect(()=>{
        props.setOriginalList(props.newsList, 100)
    }, [props.newsList])

    useEffect(() => {
        setList(props.lazyList)
    }, [props.lazyList])

    function gotoOrderpad(item,type) {
        props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT)
        gotoTrade(item,type)
    }

    function convertToWordDateFormat(val) {       
        if((parseInt(val.split(" ")[0]) === new Date().getDate())  &&
        (val.split(" ")[1].replaceAll(",", "") === new Date().toString().split(" ")[1])) {
            return "TODAY" + " " + val
        }
        
        return val
        
    }
    
    return(
        <div className="newsTable"id = "newsTable"
            onScroll={(e) => props.onScrollDiv(e)}
        >
            {
                list && list.length ?
                    list.map((item, index) => {
                        return(
                            <div key={index} className = "newsRow">
                                <div  className = "newsblock">
                                    <span className= "newsdate">
                                        {convertToWordDateFormat(item.date)}
                                        {props.categoryname === "all"?
                                            <span className = "categoryname">
                                                {item.category}
                                            </span>
                                            :
                                            null
                                        }
                                    </span>                                   
                                    <span className= "newssymbol">{item.sym ? item.companyName : ""}
                                    </span>                             
                                    <span className= "newstext">{item.txt}</span>
                                </div>
                                {
                                    item.sym ?
                                        <div className ="buttonsdiv">
                                            <button className= "news-buybtn" 
                                                onClick ={()=>{gotoOrderpad(item, ORDER_TYPES.BUY)}} >
                                                <LangText name="BUY_BTN" /></button>
                                            <button className= "news-sellbtn" 
                                                onClick ={()=>{gotoOrderpad(item, ORDER_TYPES.SELL)}}>
                                                <LangText name="SELL_BTN" /></button></div> :
                                        null
                                }

                            </div>
                        )
                    })
                    :
                    <div className = "news-errordiv">{props.errorMsg}</div>
            }

        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) }
    };
};
export default connect(null,mapDispatchToProps) (LazyLoading(NewsTableComponent));