import React, { useEffect, useRef, useState } from 'react'
import { connect } from "react-redux";
// import { getVirtualTradeBaseURL } from '../../../common/CommonMethods';
// import ScannerTableComponent from './ScannerTableComponent';
import { AF_EVENT_NAMES, AF_EVENT_TYPES, 
    DASHBOARD_WIDGET_MODE, LOCAL_STORAGE,  THEMES } from '../../../common/Constants';
import LangText from '../../../common/lang/LangText';
// import { COMMON } from '../../../config/ServiceURLs';
import { storeSelectedDashboardWidget } from '../../../state/actions/Actions';
import { LeftArrowIcon2, RightArrowIcon2 } from '../../common/FontIcons';
// import {useFetch, MsfRequest} from '../../../index'
import NewsTableBaseComponent from './NewsTableBaseComponent';
import { getItemFromSessionStorage } from '../../../common/LocalStorage';
import { AF_EventTriggered } from '../../../common/CommonMethods';

function NewsBaseComponent(props) {
    const [newsMenu, setNewsMenu] = useState([])
    const [selectedNewsMenu, setSelectedNewsMenu] = useState()
    const [disableGroupLeftScroll, setDisableGroupLeftScroll] = useState(true)
    const [disableGroupRightScroll, setDisableGroupRightScroll] = useState(false)

    const watchGroupScroll = useRef(null)
    const groupScrollPercentage = useRef(20)

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.NEWS , AF_EVENT_TYPES.NEWS_TAB,{"onClick":"news"})     
    }, [])

    useEffect(() => {
        getNewsCategory()     
    }, [])

    function getNewsCategory() {
        let news = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.NEWS_CATEGORY))
        setSelectedNewsMenu(news[0].value)
        setNewsMenu(news)

    }
    function onSelectNewsMenu(newsName) {
        setSelectedNewsMenu(newsName)
        AF_EventTriggered(AF_EVENT_NAMES.NEWS , newsName)
        // props.storeSelectedScannerMenu(newsName)

    }

    function selectNewsComponent() {
        return <NewsTableBaseComponent selectedNews = {selectedNewsMenu} />
    }

    function onClickCloseNews() {
        props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT)
    }

    function onClickScollLeft() {
        let scrollPerClick = Math.ceil(watchGroupScroll.current.scrollWidth * (groupScrollPercentage.current / 100))
        if (watchGroupScroll.current.scrollLeft >= scrollPerClick)
            watchGroupScroll.current.scrollTo(watchGroupScroll.current.scrollLeft - scrollPerClick, 0)
        else
            watchGroupScroll.current.scrollTo(0, 0)
    }

    function onManualScrollGroup() {
        if (watchGroupScroll.current.scrollLeft === 0)
            setDisableGroupLeftScroll(true)
        else
            setDisableGroupLeftScroll(false)

        if ((Math.ceil(watchGroupScroll.current.scrollLeft) +
            watchGroupScroll.current.clientWidth) >= watchGroupScroll.current.scrollWidth)
            setDisableGroupRightScroll(true)
        else
            setDisableGroupRightScroll(false)
    }

    function onClickScollRight() {
        let scrollPerClick = Math.ceil(watchGroupScroll.current.scrollWidth * (groupScrollPercentage.current / 100))
        if (watchGroupScroll.current.scrollLeft <= scrollPerClick)
            watchGroupScroll.current.scrollTo(watchGroupScroll.current.scrollLeft + scrollPerClick, 0)
        else
            watchGroupScroll.current.scrollTo(watchGroupScroll.current.scrollWidth, 0)
    }

    return (
        // <div className= "newsBase-main">
        <div className="newsBase">
            <div className="newsBase-header">
                <div className="headerBase">
                    <div className="head-name">
                        <LangText name="NEWS_HEAD" module="NEWS" />
                    </div>
                    <div className="close-button" onClick={onClickCloseNews} >
                        {
                            props.selectedTheme.theme === THEMES.LIGHT ?
                                <img src="assets/images/dashboard/close_icon.svg" alt="" />
                                :
                                <img src="assets/images/dark/dashboard/close_icon.svg" alt="" />
                        }
                    </div>
                </div>
                <div className="menuArray">
                    <div className="newsMenu-div">
                        {
                      
                            <span className={`moveScroll-btn left ${disableGroupLeftScroll ?
                                '' : 'active'}`}
                            onClick={!disableGroupLeftScroll ? onClickScollLeft : null}
                            >
                                <LeftArrowIcon2 />
                            </span> 
                        }
                        <div className="news-header-values scroller_firefox" ref={watchGroupScroll}
                            onScroll={() => onManualScrollGroup()}>
                            {
                                newsMenu ?
                                    newsMenu.map((item, index) => {
                                        return (
                                            <span key={index}

                                                className={`menusTab cursor ${selectedNewsMenu === item.value ?
                                                    'selectedMenu' : ''}`}
                                                onClick={() => onSelectNewsMenu(item.value)}
                                            >
                                                <span className="menuName">
                                                    {item.key}
                                                </span>
                                            </span>
                                        )
                                    })
                                    : ''
                            }
                        </div>
                        {
                                 
                            <span className={`moveScroll-btn right ${disableGroupRightScroll ?
                                '' : 'active'}`}
                            onClick={!disableGroupRightScroll ? onClickScollRight : null}
                            >
                                <RightArrowIcon2 />
                            </span> 
                        }
                    </div>
                </div>

            </div>
            {selectNewsComponent(selectedNewsMenu)}
        </div>
        // </div>
    )
}

const mapStateToProps = ({ dashboard, settings }) => {
    return {
        // selectedMenu: scanner.selectedMenu,
        selectedWidgetMode: dashboard.selectedWidgetMode,
        selectedTheme: settings.selectedTheme
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // storeSelectedScannerMenu: (s) => { dispatch(storeSelectedScannerMenu(s)) },
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsBaseComponent)
