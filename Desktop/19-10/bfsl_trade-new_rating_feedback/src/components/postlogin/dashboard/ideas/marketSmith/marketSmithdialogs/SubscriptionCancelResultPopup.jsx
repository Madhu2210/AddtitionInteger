import React from 'react'
import { connect } from 'react-redux'
import { DASHBOARD_WIDGET_MODE, THEMES } from '../../../../../../common/Constants'
import LangText from '../../../../../../common/lang/LangText'
import { storeMarketSmithDialogDetails, storeSelectedDashboardWidget } from '../../../../../../state/actions/Actions'

function SubscriptionCancelResultPopup(props) {
    function handleResponse(){
        props.storeMarketSmithDialogDetails({
            marketSmithDialogScreen:null
        }) 
    }
    function handleDoneResponse(){
        props.storeMarketSmithDialogDetails({
            marketSmithDialogScreen:null
        }) 
        props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.IDEAS_VIEW)

    }
    
    return (
        <div className={`marketSmithDialogBase cancel-result-base paymentWindow
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
                        // "Subscription Cancelled" : "Subscription Request Failed"}
                        "SUCCESS" : "FAILED"}
                </div>
                <div className="statusDetail">
                    {props.marketSmithSubscrptnData.isSuccess ? 
                        "Subscription Cancelled" : "Cancellation Request Failed"}
                </div>
                <div className="detailsdiv">
                    
                    <div className="messageDiv">
                        {props.marketSmithSubscrptnData.msg}
                    </div>
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

                    <div className="btnDiv" onClick={handleDoneResponse}>
                        <button>
                            <LangText name="DONE" module="BUTTONS" /></button>
                    </div> :  <div className="btnDiv" onClick={handleResponse}>
                        <button>
                            <LangText name="RETRY" module="NCD" /></button></div>
                   
                }
            </div>
        </div>
    )
}
const mapStateToProps = ({ settings,marketsmithdetails }) => {
    return {
        selectedTheme: settings.selectedTheme,
        marketSmithSubscrptnData: marketsmithdetails.marketSmtDialogComp.marketSmithSubscrptnData

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeMarketSmithDialogDetails: (s) => { dispatch(storeMarketSmithDialogDetails(s)) },
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionCancelResultPopup)