import React, {useEffect, useRef, useState} from 'react';
import { connect } from 'react-redux';
import { gotoTrade } from '../../../common/Bridge';
import { checkEmpty } from '../../../common/CommonMethods';
import { DASHBOARD_WIDGET_MODE, ORDER_TYPES } from '../../../common/Constants';
import LangText from '../../../common/lang/LangText';
import useCloseModal from '../../../customHooksComponents/useCloseModal';
import { storeSelectedDashboardWidget } from '../../../state/actions/Actions';

function NewsBuySellPopup(props) {
    // const [showBuySellPopup,setShowBuySellPopup] = useState(true)
    const [showMore, setShowMore] = useState(false)
    const [expDate, setExpDate] = useState('')
    const [valueText, setValueText] = useState('')
    
    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose,false)

    useEffect(() => {
        if(props.selectedRow.coprateDate) {
            let date = props.selectedRow.coprateDate
            let expdate = date.slice(0,11)
            // console.log(expdate.split(" ")[1][0].toUpperCase())
            // expdate = expdate.split(" ")[0] + expdate.split(" ")[1][0].toUpperCase() + 
            // expdate.split(" ")[1][1].toLowerCase() + expdate.split(" ")[1][2].toLowerCase() + expdate.split(" ")[2]
            console.log('expdate :', expdate);
            setExpDate(expdate)
        }
        if(props.corporateaction === "BM" || 
                    props.corporateaction === "AGM" ||
                    props.corporateaction === "EGM") {
            setValueText(props.selectedRow.value)
        }
    }, [])

    function onClose() {
        props.onClose()
    }

    function gotoOrderpad(symData,type) {
        props.onClose()
        props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT)
        gotoTrade(symData,type)
    }
    
    return (
        <div className="app-modalDialog2 newsDetails-dialog">
            {
                // showBuySellPopup ?
                <div className= {`window news-buysell 
                    ${props.corporateaction === "Bonus" || props.corporateaction === "Rights" ? "rights-bonus" : ""} 
                    ${props.corporateaction === "Dividend" || props.corporateaction === "Split" ? "dividend" : ""}
                    ${valueText === "--" && !props.selectedRow.sym ? "smallest-popup" : 
            valueText === "--" ? "small-popup" : ""}
                    `} 
                ref={modalRef}>
                    <div className= "content-main">
                        {
                            props.corporateaction === "BM" || 
                                props.corporateaction === "AGM" ||
                                props.corporateaction === "EGM" ? 
                                <div className="content">
                                    <div className= "top-row">
                                        <div className= "sym">
                                            <div className= "date">
                                                <LangText module="NEWS" name="DATE" />: {checkEmpty(expDate)}</div>
                                            <div className= "basesym">
                                                {checkEmpty(props.selectedRow.baseSym) !== "--" ? 
                                                    props.selectedRow.baseSym : ""}
                                            </div>
                                            <div className= "companyname">
                                                {checkEmpty(props.selectedRow.companyName)}</div>
                                        </div>
                                        <div className= "corpaction">{checkEmpty(props.corporateaction)}</div>
                                    </div>
                                    {
                                        props.selectedRow.value !== "--" ? 
                                            // <div className="value-main">
                                            <div className= {`value ${showMore ? "enable-scroll" : ""}`}>
                                                <span>{checkEmpty(props.selectedRow.value.slice(0,500))}</span>
                                                <span  className= {`moreless-text ${showMore ? "hide" : ""}`} 
                                                    onClick= {() => setShowMore(true)}>
                                                    {props.selectedRow.value !== "--" ? "..More" : "" }</span>
                                                <span>{showMore ? 
                                                    checkEmpty(valueText) : ''}</span>
                                                <span className= "moreless-text" 
                                                    onClick= {() => setShowMore(false)}>
                                                    {showMore ? "Less" : ""}</span>
                                            </div>
                                            // </div> 
                                            :
                                            <div className="blank-space"></div>
                                    }
                                </div>
                                :
                                null
                        }

                        {
                            props.corporateaction === "Dividend" 
                                ? 
                                <div className="content dividend">
                                    <div className= "top-row">
                                        <div className= "sym">
                                            <div className= "basesym">{checkEmpty(props.selectedRow.baseSym) !== "--" ? 
                                                props.selectedRow.baseSym : ""}</div>
                                            <div className= "companyname">
                                                {checkEmpty(props.selectedRow.companyName)}</div>
                                        </div>
                                        <span className= "corpaction">{checkEmpty(props.corporateaction)}</span>
                                    </div>
                                    <div className= "first-row">
                                        <div className="item1">
                                            <span className="title">
                                                {<LangText module="NEWS" name="EX_DATE" />}</span>
                                            <span className="val">{expDate}</span>
                                        </div>
                                        <div className="item2 middle">
                                            <span className="title">
                                                {<LangText module="NEWS" name="DIVIDEND" />}</span>
                                            <span className="val">{props.selectedRow.value}</span>
                                        </div>
                                        <div className="item3">
                                            <span className="title">
                                                {<LangText module="NEWS" name="DIVIDEND_TYPE" />}</span>
                                            <span className="val">{props.selectedRow.divType}</span>
                                        </div>
                                    </div>
                                    <div className= "second-row">
                                        <div className="item1">
                                            <span className="title">
                                                {<LangText module="NEWS" name="RECORD_DATE" />}</span>
                                            <span className="val">{props.selectedRow.recordDate}</span>
                                        </div>
                                    </div>
                                </div>
                                :
                                null
                        }
                        {
                            props.corporateaction === "Split" 
                                ? 
                                <div className="content split">
                                    <div className= "top-row">
                                        <div className= "sym">
                                            <div className= "basesym">{checkEmpty(props.selectedRow.baseSym) !== "--" ? 
                                                props.selectedRow.baseSym : ""}</div>
                                            <div className= "companyname">
                                                {checkEmpty(props.selectedRow.companyName)}</div>
                                        </div>
                                        <div className= "corpaction">{checkEmpty(props.corporateaction)}</div>
                                    </div>
                                    <div className= "first-row">
                                        <div className="item1">
                                            <span className="title">
                                                {<LangText module="NEWS" name="EX_DATE" />}</span>
                                            <span className="val">{expDate}</span>
                                        </div>
                                        <div className="item2 middle">
                                            <span className="title">
                                                {<LangText module="NEWS" name="SPLIT_RATIO" />}</span>
                                            <span className="val">{props.selectedRow.value}</span>
                                        </div>
                                        <div className="item3">
                                            <span className="title">
                                                {<LangText module="NEWS" name="RECORD_DATE" />}</span>
                                            <span className="val">{props.selectedRow.recordDate}</span>
                                        </div>
                                    </div>
                                    <div className= "second-row">
                                        <div className="item1">
                                            <span className="title">
                                                {<LangText module="NEWS" name="FV_BEFORE" />}</span>
                                            <span className="val">{props.selectedRow.fvBfre}</span>
                                        </div>
                                        <div className="item2 middle">
                                            <span className="title">
                                                {<LangText module="NEWS" name="FV_AFTER" />}</span>
                                            <span className="val">{props.selectedRow.fvAftr}</span>
                                        </div>
                                    </div>
                                </div>
                                :
                                null
                        }
                        {
                            props.corporateaction === "Bonus" 
                                ? 
                                <div className="content bonus">
                                    <div className= "top-row">
                                        <div className= "sym">
                                            <div className= "basesym">{checkEmpty(props.selectedRow.baseSym) !== "--" ? 
                                                props.selectedRow.baseSym : ""}</div>
                                            <div className= "companyname">
                                                {checkEmpty(props.selectedRow.companyName)}</div>
                                        </div>
                                        <div className= "corpaction">{checkEmpty(props.corporateaction)}</div>
                                    </div>
                                    <div className= "first-row">
                                        <div className="item1">
                                            <span className="title">
                                                {<LangText module="NEWS" name="EX_DATE" />}</span>
                                            <span className="val">{expDate}</span>
                                        </div>
                                        <div className="item2 middle">
                                            <span className="title">
                                                {<LangText module="NEWS" name="BONUS_RATIO" />}</span>
                                            <span className="val">{props.selectedRow.value}</span>
                                        </div>
                                        <div className="item3">
                                            <span className="title">
                                                {<LangText module="NEWS" name="RECORD_DATE" />}</span>
                                            <span className="val">{props.selectedRow.recordDate}</span>
                                        </div>
                                    </div>
                                </div>
                                :
                                null
                        }
                        {
                            props.corporateaction === "Rights" 
                                ? 
                                <div className="content rights">
                                    <div className= "top-row">
                                        <div className= "sym">
                                            <div className= "basesym">{checkEmpty(props.selectedRow.baseSym) !== "--" ? 
                                                props.selectedRow.baseSym : ""}</div>
                                            <div className= "companyname">
                                                {checkEmpty(props.selectedRow.companyName)}</div>
                                        </div>
                                        <div className= "corpaction">{checkEmpty(props.corporateaction)}</div>
                                    </div>
                                    <div className= "first-row">
                                        <div className="item1">
                                            <span className="title">
                                                {<LangText module="NEWS" name="RIGHTS_RATIO" />}</span>
                                            <span className="val">{props.selectedRow.value}</span>
                                        </div>
                                        <div className="item2 middle">
                                            <span className="title">
                                                {<LangText module="NEWS" name="RECORD_DATE" />}</span>
                                            <span className="val">{props.selectedRow.recordDate}</span>
                                        </div>
                                        <div className="item3">
                                            <span className="title">
                                                {<LangText module="NEWS" name="PREMIUM" />}</span>
                                            <span className="val">{props.selectedRow.premium}</span>
                                        </div>
                                    </div>
                                    {/* <div className= "second-row">
                                        <div className="item1">
                                            <span className="title">
                                                {<LangText module="NEWS" name="FV_BEFORE" />}</span>
                                            <span className="val">{props.selectedRow.fvBfre}</span>
                                        </div>
                                        <div className="item2 middle">
                                            <span className="title">
                                                {<LangText module="NEWS" name="FV_AFTER" />}</span>
                                            <span className="val">{props.selectedRow.fvAftr}</span>
                                        </div>
                                    </div> */}
                                </div>
                                :
                                null
                        }
                        <div className= {`border ${props.selectedRow.sym ? "" : "hide"}`}></div>
                        {
                            props.selectedRow.sym ?
                                <div className= {`buttonrow ${showMore && props.selectedRow.value.length > "500" ? 
                                    "maxdata-selected" : showMore ? "more-selected" : ""}`}>
                                    <div className= "buybtn" 
                                        onClick= {()=>{gotoOrderpad(props.selectedRow, ORDER_TYPES.BUY)}}>
                                        <LangText module="BUTTONS" name="BUY" /></div>
                                    <div className= "sellbtn" 
                                        onClick ={()=>{gotoOrderpad(props.selectedRow, ORDER_TYPES.SELL)}}>
                                        <LangText module="BUTTONS" name="SELL" /></div>
                                </div>
                                :
                                null}
                    </div>
                </div>
                // :
                // null
            }

        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) }
    };
};
export default connect(null,mapDispatchToProps) (NewsBuySellPopup);
