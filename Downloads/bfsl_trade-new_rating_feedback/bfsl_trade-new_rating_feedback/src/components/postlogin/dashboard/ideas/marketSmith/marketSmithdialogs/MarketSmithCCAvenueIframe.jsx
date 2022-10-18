/* eslint-disable */
import React, {   useEffect } from 'react'
import { connect } from 'react-redux'
import { DASHBOARD_WIDGET_MODE } from '../../../../../../common/Constants'
import { storeSelectedDashboardWidget } from '../../../../../../state/actions/Actions'
import { CloseIcon } from '../../../../../common/FontIcons'
import { Loader } from '../../../../../common/LoaderComponent'
// import { gotoTrade } from '../../../../common/Bridge'
// import {  ORDER_TYPES, TRIALDEMO_SYM_DATA } from '../../../../common/Constants'

// import { CloseIcon } from '../../../common/FontIcons'

function MarketSmithCCAvenueIframe(props) {

    // let triaMapping;
    useEffect(() => {
        // props.showLoader()
        console.log("ccCheck",props.ccAvenueURL)
        
    },[])

    function closeCB() {
        props.setCcAvenueIframe(false)
        props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.IDEAS_VIEW)
    }

    return (
        <div className="app-modalDialog2 marketsmith-iframe">
            <div className="window"  >
                <span className="closeIcon-div" onClick={closeCB}>
                    <CloseIcon />
                </span>
                <div className="content">
                    <iframe name="my_cc_iframe"
                        id="my_cc_iframe"
                        className="iframe"
                        height="100%"
                        width="100%"
                        src={props.ccAvenueURL}
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
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) },

    };
};
export default connect(mapStateToProps,mapDispatchToProps)(Loader(MarketSmithCCAvenueIframe))