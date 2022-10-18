import React, { useState } from 'react'

import ChartWidgetBaseComponent from '../../../common/chartWidget/ChartWidgetBaseComponent';
import MarketDepthBaseComponent from '../../marketDepth/MarketDepthBaseComponent';
import QuoteTechnicalChartComponent from '../orders/QuoteTechnicalChartComponent';
import QuoteViewComponent from './QuoteViewComponent';

import { CHART_WIDGET_MENUS, DASHBOARD_WIDGET_MODE, INDICES_WIDGET_MENUS } from '../../../../common/Constants';

import PullersDraggersBaseComponent from '../indices/PullersDraggersBaseComponent';
import DashboardBannerComponent from '../orders/DashboardBannerComponent';

function QuoteBaseComponent(props) {

    const [selectedMenu, setSelectedMenu] = useState(null)

    function onSelectChartMenu(menu) {
        setSelectedMenu(menu)
    }

    return (
        <>
            {
                ((props.widgetMode === DASHBOARD_WIDGET_MODE.DEFAULT ||
                    props.widgetMode === DASHBOARD_WIDGET_MODE.ORDER_WITH_QUOTE ||
                    props.widgetMode === DASHBOARD_WIDGET_MODE.QUOTE_VIEW ||
                    props.widgetMode === DASHBOARD_WIDGET_MODE.ORDER_VIEW ||
                    props.widgetMode === DASHBOARD_WIDGET_MODE.INDICES_VIEW)
                    && props.selectedSym
                ) ?
                    <QuoteViewComponent
                        selectedSym={props.selectedSym}
                    />
                    :
                    // (props.widgetMode !== DASHBOARD_WIDGET_MODE.DEFAULT ?
                    //     <DashboardBannerComponent />
                    //     : null
                    // )
                    null
            }
            {
                ((props.widgetMode === DASHBOARD_WIDGET_MODE.ORDER_WITH_QUOTE
                    || props.widgetMode === DASHBOARD_WIDGET_MODE.QUOTE_VIEW ||
                    props.widgetMode === DASHBOARD_WIDGET_MODE.INDICES_VIEW)
                    && props.selectedSym
                ) ?
                    <ChartWidgetBaseComponent selectedSym={props.selectedSym} onSelectChartMenuCB={onSelectChartMenu}
                        widgetMode={props.widgetMode} />
                    : null
            }
            {
                ((props.widgetMode === DASHBOARD_WIDGET_MODE.QUOTE_VIEW 
                    || props.widgetMode === DASHBOARD_WIDGET_MODE.INDICES_VIEW)
                    && props.selectedSym && (selectedMenu === CHART_WIDGET_MENUS.CHART
                         || selectedMenu === INDICES_WIDGET_MENUS.CHART)) ?
                    <div className="depth_gaugeChart">
                        {
                            props.widgetMode === DASHBOARD_WIDGET_MODE.INDICES_VIEW ?
                                <PullersDraggersBaseComponent
                                    selectedSym={props.selectedSym} />
                                :
                                <MarketDepthBaseComponent selectedSym={props.selectedSym} />
                        }

                        <QuoteTechnicalChartComponent selectedSym={props.selectedSym} />
                    </div>
                    : null
            }
            {
                (props.widgetMode === DASHBOARD_WIDGET_MODE.DEFAULT && !props.selectedSym) ?
                    <DashboardBannerComponent />
                    :
                    null
            }
        </>
    )
}

export default QuoteBaseComponent;