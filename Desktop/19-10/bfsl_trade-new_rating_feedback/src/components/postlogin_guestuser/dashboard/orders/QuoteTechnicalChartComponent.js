import React, { useState } from 'react'
import { QUOTE_VIEW_CHART } from '../../../../common/Constants';
import LangText from '../../../../common/lang/LangText';
import GaugeGraphBaseComponent from '../quote/quoteDetails/GaugeGraphBaseComponent';
import QuoteDetailViewComponent from '../../../common/QuoteDetailViewComponent';

function QuoteTechnicalChartComponent(props) {

    const [selectedTab, setSelectedTab] = useState(QUOTE_VIEW_CHART.QUOTE_DETAILS)

    function selectedTabHeader(tab) {
        setSelectedTab(tab)
    }
    return (
        <div className="quote-details-base">
            <div className="quote-details-header">
                <span className={`cursor quote-detls flex-center
                 ${selectedTab === QUOTE_VIEW_CHART.QUOTE_DETAILS ? 'selected' : ''}`}
                onClick={() => selectedTabHeader(QUOTE_VIEW_CHART.QUOTE_DETAILS)}
                >
                    <LangText module="QUOTE" name="QUOTE_DETAILS" />
                </span>
                <span className={`cursor technicals flex-center 
                ${selectedTab === QUOTE_VIEW_CHART.TECHNICALS ? 'selected' : ''}`}
                onClick={() => selectedTabHeader(QUOTE_VIEW_CHART.TECHNICALS)}
                >
                    <LangText module="QUOTE" name="TECHNICAL" />
                </span>
            </div>
            <div className="quote-details-body">
                {
                    (selectedTab === QUOTE_VIEW_CHART.QUOTE_DETAILS) ?
                        <QuoteDetailViewComponent selectedSym={props.selectedSym} />
                        : <GaugeGraphBaseComponent selectedSym={props.selectedSym} />
                }
            </div>
        </div>

    )
}
export default QuoteTechnicalChartComponent;