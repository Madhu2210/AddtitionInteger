import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { gotoTrade } from "../../../common/Bridge";
import { DASHBOARD_WIDGET_MODE, NEWS_DIALOGS, ORDER_TYPES } from "../../../common/Constants";
import { storeCorpNewsDialogDetails, storeSelectedDashboardWidget } from "../../../state/actions/Actions";
import { LazyLoading } from "../../common/LazyLoadingHOC";
import LangText from '../../../common/lang/LangText';

// import NewsBuySellPopup from "./NewsBuySellPopup";

function NewsTableCorporateAction(props) {

    const [list, setList] = useState([])
    // const [selectedIndex, setSelectedIndex] = useState(null)
    // const [selectedCorporateAction, setSelectedCorporateAction] = useState('')
    // const [listRow, setListRow] = useState([])

    useEffect(() => {
        props.setScrollLimit(50)
        props.setScrollRef(document.getElementById('newsTable'))
    }, [])

    useEffect(() => {
        if(props.corpNewsList && props.corpNewsList.length)
            props.setOriginalList(props.corpNewsList, 100)   
    },[props.corpNewsList])

    useEffect(() => {
        setList(props.lazyList)
    }, [props.lazyList])

    function gotoOrderpad(e,symData,type) {
        e.stopPropagation();
        props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT)
        // props. props.storeCorpNewsDialogDetails({
        //     name: null
        // })
        gotoTrade(symData,type)
    }

    function convertToWordDateFormat(val) {        
        // console.log('val :', val);
        // console.log("test", parseInt(val.split(" ")[0]),new Date().getDate(),val.split(" ")[1].replaceAll(",", ""),
        //     val.split(" ")[1].replaceAll(",", ""))
        // console.log("type", typeof parseInt(val.split(" ")[0]), typeof new Date().getDate(),typeof val.split(" ")[1].replaceAll(",", ""),
        //     typeof val.split(" ")[1].replaceAll(",", ""))
        // console.log("final", parseInt(val.split(" ")[0]) === new Date().getDate(),val.split(" ")[1].replaceAll(",", "") ===
        //     val.split(" ")[1].replaceAll(",", ""))
        // console.log("test", val.split(" ")[0] + "" + " " + val.split(" ")[1] + " " + val.split(" ")[2].replaceAll(",", ""))
        if(parseInt(val.split(" ")[0]) === new Date().getDate()  &&
        val.split(" ")[1].replaceAll(",", "") ===
        val.split(" ")[1].replaceAll(",", "")) {
            return "TODAY" 
        }        
        return val.split(" ")[0] + "" + " " + val.split(" ")[1] + " " + val.split(" ")[2].replaceAll(",", "")
        
    }
    
    function onClickSymbol(index, type, listItem) {
        // setSelectedIndex(selectedIndex === index ? null : index)
        // setSelectedCorporateAction(type)
        // setListRow(listItem)
        props.storeCorpNewsDialogDetails({
            name: NEWS_DIALOGS.DETAILS_POPUP,
            selectedRow: listItem,
            selectedCorpAction: type
        })
    }
    
    // function goToBuySellPopup() {
    //     console.log("reached")
    //     // return  <NewsBuySellPopup selectedCorpAction = {selectedCorporateAction} selectedRow = {listRow}/>
        
    // }

    return(
        <div className="newsTable" id = "newsTable"
            onScroll={(e) => props.onScrollDiv(e)}
        >
            {
                (list && list.length) ?
                    list.map((item, index) => {
                        return(
                            <div key={index} className = "newsRow cursor"
                                onClick= {props.categoryname === "corporate" ? 
                                    () => onClickSymbol(index, item.corporateAction, item) : null}
                            >
                                <div  className = "newsblock">
                                    <div className= "date-and-action">
                                        <span className= "newsdate">
                                            {
                                                convertToWordDateFormat(item.coprateDate) 
                                                
                                            } 
                                        </span>
                                        <span className="corpactioncategory">{item.corporateAction}</span>
                                    </div>                                   
                                    <span className= "newssymbol corpaction" 
                                        // onClick= {props.categoryname === "corporate" ? 
                                        //     () => onClickSymbol(index, item.corporateAction, item) : null}
                                    >
                                        { 
                                            item.companyName  
                                                
                                        }
                                    </span>                             
                                    <span className= "newstext">
                                        {
                                            item.shrtDesc !== "--" ?
                                                item.shrtDesc :
                                                ""
                                                
                                        }
                                    </span>
                                </div>
                                {
                                    item.sym ?
                                        <div className ="buttonsdiv">
                                            <button className= "news-buybtn" 
                                                onClick ={(e)=>{gotoOrderpad(e,item, ORDER_TYPES.BUY)}} >
                                                <LangText name="BUY_BTN" /></button>
                                            <button className= "news-sellbtn" 
                                                onClick ={(e)=>{gotoOrderpad(e,item, ORDER_TYPES.SELL)}}>
                                                <LangText  name="SELL_BTN" /></button></div> :
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
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s))},       
        storeCorpNewsDialogDetails: (s) => { dispatch(storeCorpNewsDialogDetails(s)) }
    };
};

export default connect(null,mapDispatchToProps) (LazyLoading(NewsTableCorporateAction));