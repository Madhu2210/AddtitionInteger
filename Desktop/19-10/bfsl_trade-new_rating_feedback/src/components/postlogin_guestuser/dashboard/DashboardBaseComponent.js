import React, { useState } from 'react'
import { connect } from "react-redux";

import WatchlistBase from './watchlist/WatchlistBaseComponent'
import OrderBase from './orders/OrderBaseComponent'
import SymbolSearchComponent from '../header/SymbolSearchComponent';
import QuoteDialogBaseComponent from './quote/quoteDialogs/QuoteDialogBaseComponent';

import { CHART_WIDGET_MENUS, DASHBOARD_WIDGET_MODE, INDICES_WIDGET_MENUS } from '../../../common/Constants';
import MarketBaseComponent from './market/MarketBaseComponent';
import NewsBaseComponent from './../news/NewsBaseComponent'
// import ScannerBaseComponent from './scanners/ScannerBaseComponent';

function DashboardBaseComponent(props) {
    const [instrumentLabel] = useState(true)

    function getBaseClass() {
        if (props.orderPadDialog.dialogName)
            return ''
        else if (props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.ORDER_WITH_QUOTE) {
            if (props.selectedChartWidgetMenu)
                return 'setMinHeight'
            return ''
        }
        else if (props.selectedChartWidgetMenu === CHART_WIDGET_MENUS.CHART ||
            props.selectedChartWidgetMenu === INDICES_WIDGET_MENUS.CHART)
            return 'setMinHeight'
        return ''
    }

    return (
        <div className={`dashboard-base ${getBaseClass()}`}>
            <div className="watchlist-with-search">
                <div className="watchlist-search">
                    <SymbolSearchComponent showInstrument={instrumentLabel}/>
                </div>
                <WatchlistBase />
            </div>
            <div className={`orderContents 
            ${props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.SCANNERS_VIEW? "scanner":""}`} >
                {
                    props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.MARKET_VIEW ?
                        <MarketBaseComponent /> :
                        props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.NEWS_VIEW ?
                            <NewsBaseComponent/>:
                            <OrderBase />
                }
                <QuoteDialogBaseComponent />
            </div>
        </div>
    )
}

const mapStateToProps = ({ dashboard, orderPad, chart }) => {
    return {
        selectedWidgetMode: dashboard.selectedWidgetMode,
        orderPadDialog: orderPad.dialog,
        selectedChartWidgetMenu: chart.selectedChartWidgetMenu,
    }
}

export default connect(mapStateToProps, null)(DashboardBaseComponent);