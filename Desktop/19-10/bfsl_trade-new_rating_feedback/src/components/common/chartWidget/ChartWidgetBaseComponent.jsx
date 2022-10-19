import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import { withRouter } from 'react-router';

import ChartComponent from './ChartWidgetComponent'
import FutureChainComponent from './FutureChainComponent'
import OptionChainComponent from './OptionsChainComponent'
import TrendingNewsComponent from './TrendingNewsComponent';
import CompanyInfoComponent from './CompanyInfoComponent'
import FinancialsBaseComponent from './financialsComponents/FinancialsBaseComponent'

import { storeSelectedChartSym, storeSelectedChartWidgetMenu,
    storeSelectedWatchlistWidget } from '../../../state/actions/Actions'

import {
    CHART_WIDGET_MENUS,
    DASHBOARD_WIDGET_MODE, INDICES_WIDGET_MENU_CONST,
    INDICES_WIDGET_MENUS,
    TEXT_ORIENTATION,
} from '../../../common/Constants'

import { MaximizeIcon } from '../FontIcons'
import { getQuoteMenuArray, gotoChartPopup } from '../../../common/Bridge';
import { AF_EventTriggered, chartWidgetMenusFilter } from '../../../common/CommonMethods';
import ConstituentsComponents from '../../postlogin/dashboard/indices/ConstituentsComponents';
import ContributorsBaseComponent from '../../postlogin/dashboard/indices/ContributorsBaseComponent';
import LangText from '../../../common/lang/LangText';
import { AF_EVENT_CATEOGORY_TYPES_NEW_CONST } from '../../../common/NewConstants';

const ChartWidgetBaseComponent = (props) => {
    const { selectedSym } = props
    const [menuArray, setMenuArray] = useState([])
    const [selectedMenu, setSelectedMenu] = useState({})

    useEffect(() => {
        return () => {
            props.storeSelectedChartWidgetMenu({})
        }
    }, [])

    useEffect(() => {
        if (selectedSym)
            // props.storeSelectedChartSym(selectedSym)
            if (props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.INDICES_VIEW) {
                let indicesMenu = Object.assign([], INDICES_WIDGET_MENU_CONST)
                if (selectedSym.hasFutOpt) {
                    setMenuArray(indicesMenu)
                    setSelectedMenu(indicesMenu[0].name)
                } else {
                    let filteredMenus = indicesMenu.filter((item) => {
                        return (item.name !== INDICES_WIDGET_MENUS.FUTURES && 
                            item.name !== INDICES_WIDGET_MENUS.OPTIONS)
                    })
                    setMenuArray(filteredMenus)
                    setSelectedMenu(filteredMenus[0].name)
                }
            }
            else {
                let menuData = getQuoteMenuArray(selectedSym.exc)
                if (chartWidgetMenusFilter(selectedSym))
                    filterWidgetMenu(menuData)
                else {
                    setMenuArray(menuData)
                    setSelectedMenu(menuData[0].name)
                }
            }
    }, [selectedSym])

    useEffect(() => {
        props.onSelectChartMenuCB(selectedMenu);
        props.storeSelectedChartWidgetMenu(selectedMenu)
    }, [selectedMenu])

    function filterWidgetMenu(menus) {
        let filterMenuArray = menus.filter(function (menu) {
            if (menu.name !== CHART_WIDGET_MENUS.FINANCIALS && menu.name !== CHART_WIDGET_MENUS.COMPANY)
                return menu
            return null
        });
        setMenuArray(filterMenuArray)
        if (filterMenuArray.length)
            setSelectedMenu(filterMenuArray[0].name)
    }

    function onClickMenu(menu) {
        console.log("quote-header",menu.name);
        setSelectedMenu(menu.name)
        props.onSelectMenuCB && props.onSelectMenuCB(menu.name)
        AF_EventTriggered(AF_EVENT_CATEOGORY_TYPES_NEW_CONST.QUOTE ,menu.name, {"onClick":"quote-screen header"})
    }
    return (
        <div className={`chartWidget-base withBorder ${(selectedMenu === CHART_WIDGET_MENUS.CHART ||
         selectedMenu === INDICES_WIDGET_MENUS.CHART) ? 'chartMenu' : 'nonChartMenu with_md_gg'}`}>
            <div className="header">
                <div className="menu-div">
                    {
                        menuArray.length ?
                            menuArray.map(function (item, index) {
                                return (
                                    <span
                                        key={index}
                                        className={`chart-menu 
                                        ${selectedMenu === item.name ? 'active' : ''} ${index === 0 ?
                                        'first' : ''}`}
                                        onClick={() => onClickMenu(item)}
                                    >
                                        <span className="flex-center cursor">
                                            {/* {item} */}
                                            <LangText name={item.langKey}
                                                orientation={TEXT_ORIENTATION.UPPERCASE} />
                                        </span>
                                        <div className="hrDIv"></div>
                                    </span>
                                )
                            })
                            : null
                    }
                </div>
                {
                    (selectedMenu === CHART_WIDGET_MENUS.CHART || selectedMenu === CHART_WIDGET_MENUS.CHART_OVERVIEW) ?
                        <MaximizeIcon onClick={() => gotoChartPopup(selectedSym)} />
                        : null
                }
            </div>
            {getSelectedWidget(selectedMenu, selectedSym, props.parent, props.hideMsg)}
        </div>
    )
}

const getSelectedWidget = (menu, selectedSym, parentComp, hideMsg) => {
    if (menu === CHART_WIDGET_MENUS.CHART || menu === INDICES_WIDGET_MENUS.CHART)
        return <ChartComponent key="chart" parent={parentComp} chartEleId="chart_iframe"
            hideMsg={hideMsg} selectedSym={selectedSym} />
    else if (menu === INDICES_WIDGET_MENUS.CONTRIBUTORS)
        return <ContributorsBaseComponent selectedSym={selectedSym} />
    else if (menu === INDICES_WIDGET_MENUS.CONSTITUENTS)
        return <ConstituentsComponents selectedSym={selectedSym} />
    else if (menu === CHART_WIDGET_MENUS.FUTURES || menu === INDICES_WIDGET_MENUS.FUTURES)
        return <FutureChainComponent selectedSym={selectedSym} />
    else if (menu === CHART_WIDGET_MENUS.OPTIONS || menu === INDICES_WIDGET_MENUS.OPTIONS)
        return <OptionChainComponent selectedSym={selectedSym} />
    else if (menu === CHART_WIDGET_MENUS.NEWS || menu === INDICES_WIDGET_MENUS.NEWS)
        return <TrendingNewsComponent selectedSym={selectedSym} hideHeader={true} />
    else if (menu === CHART_WIDGET_MENUS.COMPANY)
        return <CompanyInfoComponent selectedSym={selectedSym} />
    else if (menu === CHART_WIDGET_MENUS.FINANCIALS)
        return <FinancialsBaseComponent selectedSym={selectedSym} />
    return null
}

const mapStateToProps = ({ settings, dashboard }) => {
    return {
        // selectedSym: chart.selectedSym,
        selectedTheme: settings.selectedTheme,
        selectedWidgetMode: dashboard.selectedWidgetMode,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeSelectedWatchlistWidget: (s) => { dispatch(storeSelectedWatchlistWidget(s)) },
        storeSelectedChartSym: (s) => { dispatch(storeSelectedChartSym(s)) },
        storeSelectedChartWidgetMenu: (s) => { dispatch(storeSelectedChartWidgetMenu(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChartWidgetBaseComponent));