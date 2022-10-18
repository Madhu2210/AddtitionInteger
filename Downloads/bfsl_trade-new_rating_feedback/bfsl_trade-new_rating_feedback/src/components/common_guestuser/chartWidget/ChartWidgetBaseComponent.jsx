import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import { withRouter } from 'react-router';

import ChartComponent from './ChartWidgetComponent'
import FutureChainComponent from './FutureChainComponent'
import OptionChainComponent from './OptionsChainComponent'
import TrendingNewsComponent from './TrendingNewsComponent';
// import CompanyInfoComponent from './CompanyInfoComponent'
// import FinancialsBaseComponent from './financialsComponents/FinancialsBaseComponent'

import { storeSelectedChartSym, storeSelectedChartWidgetMenu,
    storeSelectedWatchlistWidget } from '../../../state/actions/Actions'

import {
    CHART_WIDGET_MENUS_GUEST,
    DASHBOARD_WIDGET_MODE, INDICES_WIDGET_MENU_CONST_GUEST,
    INDICES_WIDGET_MENUS_GUEST,
    CHART_WIDGET_MENUS,
    TEXT_ORIENTATION
} from '../../../common/Constants'

import { MaximizeIcon } from '../../common/FontIcons'
import { getQuoteMenuGuestArray, gotoChartPopup } from '../../../common/Bridge';
import { chartWidgetMenusFilter } from '../../../common/CommonMethods';
import ConstituentsComponents from '../../postlogin_guestuser/dashboard/indices/ConstituentsComponents';
import LangText from '../../../common/lang/LangText';
// import ContributorsBaseComponent from '../../postlogin_guestuser/dashboard/indices/ContributorsBaseComponent';

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
                let indicesMenu = Object.assign([], INDICES_WIDGET_MENU_CONST_GUEST)
                if (selectedSym.hasFutOpt) {
                    setMenuArray(indicesMenu)
                    setSelectedMenu(indicesMenu[0].name)
                } else {
                    let filteredMenus = indicesMenu.filter((item) => {
                        return (item.name !== INDICES_WIDGET_MENUS_GUEST.FUTURES && 
                            item.name !== INDICES_WIDGET_MENUS_GUEST.OPTIONS)
                    })
                    setMenuArray(filteredMenus)
                    setSelectedMenu(filteredMenus[0].name)
                }
            }
            else {
                let menuData = getQuoteMenuGuestArray(selectedSym.exc)
                menuData = menuData.filter(item => item.name !== CHART_WIDGET_MENUS.FINANCIALS)
                menuData = menuData.filter(item => item.name !== CHART_WIDGET_MENUS.COMPANY)
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
            if (menu.name !== CHART_WIDGET_MENUS_GUEST.COMPANY)
                return menu
            return null
        });
        setMenuArray(filterMenuArray)
        if (filterMenuArray.length)
            setSelectedMenu(filterMenuArray[0].name)
    }

    function onClickMenu(menu) {
        setSelectedMenu(menu.name)
        props.onSelectMenuCB && props.onSelectMenuCB(menu.name)
    }

    return (
        <div className={`chartWidget-base withBorder ${(selectedMenu === CHART_WIDGET_MENUS_GUEST.CHART ||
         selectedMenu === INDICES_WIDGET_MENUS_GUEST.CHART) ? 'chartMenu' : 'nonChartMenu with_md_gg'}`}>
            <div className="header">
                <div className="menu-div">
                    {
                        menuArray.length ?
                            menuArray.map(function (item, index) {
                                return (
                                    <span
                                        key={index}
                                        className={`chart-menu ${selectedMenu === item.name ? 'active' : ''} 
                                        ${index === 0 ?
                                        'first' : ''}`}
                                        onClick={() => onClickMenu(item)}
                                    >
                                        <span className="flex-center cursor">
                                            {/* {item} */}
                                            <LangText name={item.langKey}
                                                orientation={TEXT_ORIENTATION.UPPERCASE}/>
                                        </span>
                                        <div className="hrDIv"></div>
                                    </span>
                                )
                            })
                            : null
                    }
                </div>
                {
                    (selectedMenu === CHART_WIDGET_MENUS_GUEST.CHART || 
                        selectedMenu === CHART_WIDGET_MENUS_GUEST.CHART_OVERVIEW) ?
                        <MaximizeIcon onClick={() => gotoChartPopup(selectedSym)} />
                        : null
                }
            </div>
            {getSelectedWidget(selectedMenu, selectedSym, props.parent, props.hideMsg)}
        </div>
    )
}

const getSelectedWidget = (menu, selectedSym, parentComp, hideMsg) => {
    if (menu === CHART_WIDGET_MENUS_GUEST.CHART || menu === INDICES_WIDGET_MENUS_GUEST.CHART)
        return <ChartComponent key="chart" parent={parentComp} chartEleId="chart_iframe"
            hideMsg={hideMsg} selectedSym={selectedSym} />
    // else if (menu === INDICES_WIDGET_MENUS_GUEST.CONTRIBUTORS)
    //     return <ContributorsBaseComponent selectedSym={selectedSym} />
    else if (menu === INDICES_WIDGET_MENUS_GUEST.CONSTITUENTS)
        return <ConstituentsComponents selectedSym={selectedSym} />
    else if (menu === CHART_WIDGET_MENUS_GUEST.FUTURES || menu === INDICES_WIDGET_MENUS_GUEST.FUTURES)
        return <FutureChainComponent selectedSym={selectedSym} />
    else if (menu === CHART_WIDGET_MENUS_GUEST.OPTIONS || menu === INDICES_WIDGET_MENUS_GUEST.OPTIONS)
        return <OptionChainComponent selectedSym={selectedSym} />
    else if (menu === CHART_WIDGET_MENUS_GUEST.NEWS || menu === INDICES_WIDGET_MENUS_GUEST.NEWS)
        return <TrendingNewsComponent selectedSym={selectedSym} hideHeader={true} />
    // else if (menu === CHART_WIDGET_MENUS_GUEST.COMPANY)
    //     return <CompanyInfoComponent selectedSym={selectedSym} />
    // else if (menu === CHART_WIDGET_MENUS_GUEST.FINANCIALS)
    //     return <FinancialsBaseComponent selectedSym={selectedSym} />
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