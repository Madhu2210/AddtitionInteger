import React, { useState } from 'react'

import FundsBasicViewComponent from './FundsBasicViewComponent';
import FundsDetailedViewComponent from './FundsDetailedViewComponent';
import LangText from '../../../../common/lang/LangText';

import { AF_EVENT_NAMES, AF_EVENT_TYPES, FUNDS_SCREENS } from '../../../../common/Constants';
import { AF_EventTriggered } from '../../../../common/CommonMethods';

function FundLimitsBaseComponent(props) {

    const [selectedTab, setSelectedTab] = useState(FUNDS_SCREENS.BASIC_VIEW);

    function getSelectedTab(tab) {
        setSelectedTab(tab)
        AF_EventTriggered(AF_EVENT_NAMES.FUNDS , AF_EVENT_TYPES.FUND_VIEW)
    }

    return (
        <div className="funds-limits-base">
            <div className="limits-header">
                <span onClick={() => getSelectedTab(FUNDS_SCREENS.BASIC_VIEW)}
                    className={`cursor left ${selectedTab === FUNDS_SCREENS.BASIC_VIEW ? 'selected' : ''}`}>
                    <LangText name="BASIC_VIEW" />
                </span>
                <span className="line-seperate"></span>
                <span onClick={() => getSelectedTab(FUNDS_SCREENS.DETAILED_VIEW)}
                    className={`cursor right ${selectedTab === FUNDS_SCREENS.DETAILED_VIEW ? 'selected' : ''}`}>
                    <LangText name="DETAILED_VIEW" />
                </span>
            </div>
            <div className="limits-content">
                {
                    (selectedTab === FUNDS_SCREENS.BASIC_VIEW) ?
                        <FundsBasicViewComponent
                            limitsData={props.resultData}
                            errorMsg={props.errorMsg}
                        />
                        :
                        (selectedTab === FUNDS_SCREENS.DETAILED_VIEW) ?
                            <FundsDetailedViewComponent
                                limitsData={props.resultData}
                                errorMsg={props.errorMsg}
                            />
                            : null
                }
            </div>
        </div>
    )

}
export default FundLimitsBaseComponent;