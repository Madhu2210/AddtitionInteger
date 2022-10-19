import React, { useState } from 'react'
import { connect } from "react-redux";

import HoldingsHeaderTab from './HoldingsHeaderTabComponent'
import NetPositionsHeaderTab from './NetPositionHeaderTabComponent'
import OrderStatusHeaderTab from './OrderStatusHeaderTabComponent'

import { storeAlertSelectedSym, storeOrderPadDialogDetails,
    storeSelectedDashboardWidget } from '../../../../state/actions/Actions'

import { DASHBOARD_ORDER_TABS, DASHBOARD_WIDGET_MODE } from '../../../../common/Constants'

function HeaderTabComponent(props) {

    const [selectedTab, setSelectedTab] = useState(DASHBOARD_ORDER_TABS.HOLDINGS)

    function onSelectTab(tab) {
        setSelectedTab(tab)
        props.getSelectedTabCB && props.getSelectedTabCB(tab)
        if (props.selectedWidgetMode !== DASHBOARD_WIDGET_MODE.ORDER_VIEW 
            && props.selectedWidgetMode !== DASHBOARD_WIDGET_MODE.DEFAULT)
            if (props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.INDICES_VIEW)
                props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT)
            else
                props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.ORDER_WITH_QUOTE)

        props.storeOrderPadDialogDetails({
            dialogName: null,
            trade_type: null,
            message: '',
            parentCB: null,
        })
        props.storeAlertSelectedSym(null)
    }

    function getResponseListCB(list, errorMessage, sortList) {
        props.getResponseList && props.getResponseList(list, errorMessage, sortList)
    }

    return (
        <div className="headerTab-base customTab">
            <HoldingsHeaderTab 
                selectedTab={selectedTab}
                onSelectTab={onSelectTab}
                getResponseList={getResponseListCB} />
            <NetPositionsHeaderTab 
                selectedTab={selectedTab}
                onSelectTab={onSelectTab} 
                getResponseList={getResponseListCB} />
            <OrderStatusHeaderTab selectedTab={selectedTab} onSelectTab={onSelectTab} />
        </div>
    )
}

const mapStateToProps = ({ dashboard }) => {
    return {
        selectedWidgetMode: dashboard.selectedWidgetMode,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAlertSelectedSym: (s) => { dispatch(storeAlertSelectedSym(s)) },
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) },
        storeOrderPadDialogDetails: (s) => { dispatch(storeOrderPadDialogDetails(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderTabComponent);
