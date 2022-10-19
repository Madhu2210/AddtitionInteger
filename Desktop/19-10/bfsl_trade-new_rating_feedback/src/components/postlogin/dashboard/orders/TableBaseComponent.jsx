import React, { useEffect } from 'react'

import HoldingsTableComponent from './HoldingsTableComponent'
import NetPositionsTableComponent from './NetPositionsTableComponent'
import OrderBookComponent from './orderStatus/OrderBookComponent'
import OrderDialogBaseComponent from './orderDialogs/OrderDialogBaseComponent';
import { WidgetLoader } from '../../../common/WidgetLoaderComponent'

import { DASHBOARD_ORDER_TABS } from '../../../../common/Constants'

function TableBaseComponent(props) {
console.log("TableBaseComponent",props)
    useEffect(() => {
        props.setTableLoader()
    }, [])

    return (
        <>
            {
                ((props.selectedTab === DASHBOARD_ORDER_TABS.ORDER_STATUS) ?
                    <OrderBookComponent {...props} />
                    :
                    (props.selectedTab === DASHBOARD_ORDER_TABS.NET_POSITIONS) ?
                        <NetPositionsTableComponent list={props.list} errorMsg={props.errorMsg} {...props} />
                        :
                        <HoldingsTableComponent list={props.list} errorMsg={props.errorMsg} {...props} />
                )
            }
            <OrderDialogBaseComponent {...props} />
        </>
    )
}

export default WidgetLoader(TableBaseComponent);