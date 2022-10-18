import React, { useState } from 'react'

import LangText, { getLangText } from '../../../../common/lang/LangText'
import { QUOTE_FINACIALS } from '../../../../common/Constants'

import ToggleMenu from '../../ToggleComponent'
import KeyResultsComponent from './KeyResultsComponent'
import KeyRatiosComponent from './KeyRatiosComponent'
import { WidgetLoader } from '../../WidgetLoaderComponent'

const FinancialsBaseComponent = (props) => {

    const [selectedTab, setSelectedHTab] = useState(QUOTE_FINACIALS.KEY_RESULTS)
    const [menuArray] = useState([
        getLangText('STANDALONE', 'QUOTE'), getLangText('CONSOLIDATED', 'QUOTE')
    ])
    const [selectedType, setSelectedType] = useState(getLangText('STANDALONE', 'QUOTE'))

    function getSelectedTab(selectedTabValue) {
        setSelectedHTab(selectedTabValue)
    }

    function getSelectedType(item) {
        setSelectedType(item)
    }

    return (
        <div className="financial-base">
            <div className="finacial-header">
                <div className="menuLeft">
                    <div className={`cursor key-results ${selectedTab === QUOTE_FINACIALS.KEY_RESULTS ?
                        'selected' 
                        : ''}`}
                    onClick={() => getSelectedTab(QUOTE_FINACIALS.KEY_RESULTS)}
                    >
                        <LangText module="QUOTE" name="KEY_RESULTS" />
                    </div>
                    <div className={`cursor key-ratios 
                    ${selectedTab === QUOTE_FINACIALS.KEY_RATIOS ? 'selected' : ''}`}
                    onClick={() => getSelectedTab(QUOTE_FINACIALS.KEY_RATIOS)}>
                        <LangText module="QUOTE" name="KEY_RATIOS" />
                    </div>
                </div>
                <div className="toggle-status">
                    <ToggleMenu
                        menus={menuArray}
                        selectedMenu={selectedType}
                        orderAction={true}
                        hasToggle={true}
                        onSelectMenuCB={(item) => getSelectedType(item)}
                    />
                </div>

            </div>
            <div className="financial-content">
                {
                    (selectedTab === QUOTE_FINACIALS.KEY_RESULTS) ?
                        <KeyResultsComponent
                            selectedType={selectedType}
                            symbolList={props.selectedSym}
                        /> :
                        (selectedTab === QUOTE_FINACIALS.KEY_RATIOS) ?
                            <KeyRatiosComponent
                                selectedType={selectedType}
                                symbolList={props.selectedSym}
                            />
                            : null
                }
            </div>
        </div>
    )
}

export default WidgetLoader(FinancialsBaseComponent);