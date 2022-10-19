import React from 'react'
import { connect } from 'react-redux';
import { MARKETSMITH_DIALOG_SCREENS } from '../../../../../../common/Constants';
import { storeMarketSmithDialogDetails, storeSuccessDialogOptDetails } from '../../../../../../state/actions/Actions';

function CancelSubscriptionDialogComponent(props) {

    function onClickCancel() {
        props.storeMarketSmithDialogDetails({
            marketSmithDialogScreen:null
        })  
    }

    function onClickProceed() {
        console.log("Yes")
        props.storeMarketSmithDialogDetails({
            marketSmithDialogScreen:MARKETSMITH_DIALOG_SCREENS.SUCCESS_DIALOG_POPUP
        })  
        props.storeSuccessDialogOptDetails({
            successOptScreen:false
        })  
       
    }

    return (
        <div className="app-modalDialog2 congo-dialog" >
            <div className="window congo-base" >
                <div className="congo-content">
                    <div className="header">
                        <div>
                            <h3>Are you sure you want to cancel the subscription ?</h3>
                        </div>
                        <button onClick={onClickCancel}>
                           No
                        </button>
                        <button onClick={onClickProceed}>
                           Yes
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    
    )
}
const mapDispatchToProps = (dispatch) => {
   
    return {
      
        // storeMarketSmithData: (s) => { dispatch( storeMarketSmithData(s)) },
        storeMarketSmithDialogDetails: (s) => { dispatch(storeMarketSmithDialogDetails(s)) },
        storeSuccessDialogOptDetails: (s) => { dispatch(storeSuccessDialogOptDetails(s)) }
      
    };
};

export default connect(null,mapDispatchToProps)(CancelSubscriptionDialogComponent)
