import React from 'react'
import { connect } from 'react-redux'
import {  DASHBOARD_WIDGET_MODE, THEMES } from '../../../../../../common/Constants'
import LangText from '../../../../../../common/lang/LangText'
import {  storeMarketSmithDialogDetails,
    storeSelectedDashboardWidget} from '../../../../../../state/actions/Actions'

function SuccessDialogComponent(props) {

    function onClose(){ 
        props.storeMarketSmithDialogDetails({
            marketSmithDialogScreen:null
        })   
        props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.IDEAS_VIEW)

    }
    function onRetry(){ 
        props.storeMarketSmithDialogDetails({
            marketSmithDialogScreen:null
        })   
    }

    return (
        <div className={`marketSmithDialogBase cancel-result-base
             ${props.marketSmithSubscrptnData.isSuccess ? 'successWindow' : 'errorWindow'}`}>
            <div className="window">
                <div className="successImgDiv">
                    {
                        props.marketSmithSubscrptnData.isSuccess ?
                            props.selectedTheme.theme === THEMES.LIGHT ?
                                < img src="assets/images/dashboard/success_btn.svg" alt="" />
                                :
                                < img src="assets/images/dark/dashboard/success_btn.svg" alt="" />
                            :
                            props.selectedTheme.theme === THEMES.LIGHT ?
                                <img src="assets/images/dashboard/failed_btn.svg" alt="" />
                                :
                                <img src="assets/images/dark/dashboard/Failed_btn.svg" alt="" />
                             
                    }
                    {/* <div className={`status `}>
                        Subscription Cancelled
                    </div>      */}
                </div>
                <div className={`status ${props.marketSmithSubscrptnData.isSuccess ? 'success' : 'fail'}`}>
                    {props.marketSmithSubscrptnData.isSuccess ? 
                        "SUCCESS" : "FAILED"}
                </div>
                <div className="detailsdiv">
                    {props.marketSmithSubscrptnData.isSuccess ? 
                        <div className="amountDiv">
                            ₹{props.marketSmithSubscrptnData.amnt}
                        </div> : null}
                    <div className="messageDiv">
                        {props.marketSmithSubscrptnData.msg}
                    </div>
                    {props.marketSmithSubscrptnData.isSuccess ? 
                        <div className="validTillDiv">
                            <LangText name="MS_VALID_TILL" 
                                module="MARKET_SMITH" />{props.marketSmithSubscrptnData.validTill}
                        </div> : null}
                    {/* <div>test</div> */}
                    {/* {
                        props.orderResult.isSuccess ? */}
                    
                    {/* : null
                    } */}
                </div>
                {
                    // props.orderResult.isSuccess ?
                    //     <div className="infoMsg">
                    //         <LangText name="UPI_ACCEPT" module="NCD" />
                    //     </div>
                    //     : null
                }
                
                {props.marketSmithSubscrptnData.isSuccess ?
                    <div className="btnDiv" onClick={onClose}>
                        <button>
                            <LangText name="DONE" module="BUTTONS" /></button>
                    </div> :
                    <div className="btnDiv" onClick={onRetry}>
                        <button>
                            <LangText name="RETRY" module="NCD" /></button>
                    </div>
                }
                
            </div>
        </div>
    )
}
const mapStateToProps = ({settings,marketsmithdetails}) => {
    return {
        selectedTheme: settings.selectedTheme,
        marketSmithSubscrptnData: marketsmithdetails.marketSmtDialogComp.marketSmithSubscrptnData,

    }
}
const mapDispatchToProps = (dispatch) => {
   
    return {
        storeMarketSmithDialogDetails: (s) => { dispatch(storeMarketSmithDialogDetails(s)) },
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) },

    };
};
export default connect(mapStateToProps,mapDispatchToProps)(SuccessDialogComponent)

