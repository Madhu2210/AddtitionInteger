// import useFetch from '@msf/msf-reactjs-weblib-base'
import React from 'react'
import { connect } from 'react-redux'
// import { MsfRequest } from '../../../../../..'
// import { getIdeasBaseURL } from '../../../../../../common/CommonMethods'
import { DASHBOARD_WIDGET_MODE, MARKETSMITH_DIALOG_SCREENS } from '../../../../../../common/Constants'
import LangText from '../../../../../../common/lang/LangText'
// import { MARKET_SMITH_SERVICE } from '../../../../../../config/ServiceURLs'
import { storeMarketSmithDialogDetails, storeSelectedDashboardWidget } from '../../../../../../state/actions/Actions'
import { Loader } from '../../../../../common/LoaderComponent'

function SubscriptionCancelDialog(props) {
    // const MsfFetch = useFetch()

    function onClose() {
        props.storeMarketSmithDialogDetails({
            marketSmithDialogScreen:null
        })   
        props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.MARKETSMITH_VIEW)
    }
    // function cancelSubscriptionAction(resp) {
    //     let result = {}
    //     if (resp.infoID === "0") {
    //         result.msg = resp.infoMsg ? resp.infoMsg : "No Data Available"
    //         result.isSuccess = true
    //     } else {
    //         console.log(resp,"resp22")
    //         result.msg = resp.infoMsg ? resp.infoMsg : "No Data Available"
    //         result.isSuccess = false
    //     }
      
    // }
    function onCancel() {
        props.storeMarketSmithDialogDetails({
            marketSmithDialogScreen:MARKETSMITH_DIALOG_SCREENS.FEEDBACK_FORM,
            marketSmithSubscrptnData:props.marketSmithSubscrptnData

        }) 
        // props.showLoader();
        // let request = new MsfRequest();
        // request.addToData({
        //     id:props.marketSmtSubId
        // })
        // request.setEncrypt(false)
        // // request.setEcho(props.symData.applicationNo)
        // MsfFetch.placeRequest(
        //     getIdeasBaseURL() + MARKET_SMITH_SERVICE.CANCEL_OR_REFUND,
        //     request,
        //     successRespCBCancelSubscription,
        //     errorRespCBCancelSubscription
        // )
    }

    // function successRespCBCancelSubscription(response) {
    //     props.hideLoader();
    //     cancelSubscriptionAction(response)
    //     console.log("resp101type",response)

    // }

    // function errorRespCBCancelSubscription(error) {
    //     props.hideLoader()
    //     console.log("error101type",error)
    //     cancelSubscriptionAction(error)

    // }
    return (
        <div className="marketSmithDialogBase cancel-ms-dialog">
            <div className="window">
                <div className="header">
                    <span><LangText module="MARKET_SMITH" name="CANCEL_SUBSCRIPTION" /></span>
                </div>
                <div className="body">
                    <div className= "cancel-confirm">
                        <LangText module="MARKET_SMITH" name="CONFIRM_CANCEL_SUBSCRIPTION" />                       
                    </div>
                    <div className="btnDiv">
                        <button className= "noBtn" onClick={onClose}>
                            <LangText module="MARKET_SMITH" name="NO" />
                        </button>
                        <button className= "yesBtn" onClick={onCancel}>
                            <LangText module="MARKET_SMITH" name="YES" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = ({ marketsmithdetails}) => {
    return {
        marketSmtSubId: marketsmithdetails.marketSmtSubId,
        marketSmithSubscrptnData: marketsmithdetails.marketSmtDialogComp.marketSmithSubscrptnData,
       
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeMarketSmithDialogDetails: (s) => { dispatch(storeMarketSmithDialogDetails(s)) },
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) },
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Loader(SubscriptionCancelDialog))