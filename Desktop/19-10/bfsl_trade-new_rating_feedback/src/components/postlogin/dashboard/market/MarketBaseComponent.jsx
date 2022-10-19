import React, { useEffect, useRef, useState } from 'react'
import { useFetch, MsfRequest, withStreaming } from '../../../../index'

import Select from '../../../common/SelectInputComponent'
import ToggleMenu from '../../../common/ToggleComponent'
import MarketsAPIModelComponent from './MarketsAPIModelComponent'

import {
    MARKET_BASE_WIDGET_MENUS, MARKET_BASE_WIDGET_MENUS_CONST,
    MARKET_BASE_EQUITY_FILTER, EXCHANGE_TOGGLE_DATA,
    MARKET_EQUITY_MENU_ARRAY_CONST,
    LOCAL_STORAGE,
    MARKET_DERIVATIVE_MENU_ARRAY_CONST,
    EQUITY_MENU,
    EQUITY_FILTERS,
    MARKET_FII_DII_CATEGORYS,
    DERIVATIVE_STOCK_INDEX_CATEGORIES,
    DERIVATIVE_MENU,
    DERIVATIVE_STOCK_INDEX_FILTER,
    MARKET_GLOBAL_INDICES_MENU_ARRAY_CONST,
    STREAMING_MODULES,
    STREAMING_KEYS,
    AF_EVENT_NAMES,
} from '../../../../common/Constants'
import { LeftArrowIcon2, RightArrowIcon2 } from '../../../common/FontIcons'

import { AF_EventTriggered, applyPaint, checkEmpty, getColorCode, getMarketDataBaseURL 
} from '../../../../common/CommonMethods'

import { getItemFromSessionStorage } from '../../../../common/LocalStorage'
import { MARKET } from '../../../../config/ServiceURLs'
import LangText from '../../../../common/lang/LangText'
//import { getLangText } from '../../../../common/lang/LangText'

function MarketBaseComponent(props) {

    const MsfFetch = useFetch()

    let indicesDetails = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.INDICES))

    const [marketBaseTab] = useState(MARKET_BASE_WIDGET_MENUS_CONST)
    const [selectedBaseTab, setSelectedBaseTab] = useState(MARKET_BASE_WIDGET_MENUS_CONST[0].name)
    const [equityInterval, setEquityInterval] = useState(MARKET_BASE_EQUITY_FILTER)
    const [equitySelectedFilter, setEquitySelectedFilter] = useState(MARKET_BASE_EQUITY_FILTER[0])
    const [excArray] = useState(EXCHANGE_TOGGLE_DATA.EQUITY)
    const [sectorExcArray] = useState(EXCHANGE_TOGGLE_DATA.EQUITY)
    const [selectedExc, setSelectedExc] = useState(EXCHANGE_TOGGLE_DATA.EQUITY[0])
    const [sectorSelectedExc, setSectorSelectedExc] = useState(EXCHANGE_TOGGLE_DATA.EQUITY[0])
    const [MenuArray, setMenuArray] = useState(MARKET_EQUITY_MENU_ARRAY_CONST)
    const [selectedEquityMenu, setSelectedEquityMenu] = useState(MARKET_EQUITY_MENU_ARRAY_CONST[0])
    const [indicesList, setIndicesList] = useState(indicesDetails.NSE)
    const [sectorIndicesList, setSectorIndicesList] = useState(indicesDetails.NSE)
    const [selectedIndex, setSelectedIndex] = useState({})
    const [selectedIndexSector, setSelectedIndexSector] = useState(indicesDetails.NSE[0])
    const [fiidiiCategory] = useState(MARKET_FII_DII_CATEGORYS)
    const [selectedCategory, setSelectedCategory] = useState(MARKET_FII_DII_CATEGORYS[0])
    const [derivativeStockCat, setDerivativeStockCat] = useState(DERIVATIVE_STOCK_INDEX_CATEGORIES)
    const [selectedStkIndCat, setSelectedStkInxCat] = useState(DERIVATIVE_STOCK_INDEX_CATEGORIES[0])
    const [expiryDateList, setExpiryDateList] = useState([])
    // const [expiryDateErr, setExpiryDateErr] = useState()
    const [selectedExpiryDate, setSelectedExpiryDate] = useState()
    const [streamingResp, setStreamingResp] = useState(null)
    // const [streamingDataList, setStreamingDataList] = useState([])

    const [disableGroupLeftScroll, setDisableGroupLeftScroll] = useState(true)
    const [disableGroupRightScroll, setDisableGroupRightScroll] = useState(false)

    const watchGroupScroll = useRef(null)
    const groupScrollPercentage = useRef(20)
    const selectedMenuBtnRef = useRef(null)

    // useEffect(() => {
    //     AF_EventTriggered(AF_EVENT_NAMES.MARKET , AF_EVENT_TYPES.MARKET_MENU_CLICK,{"onLoad":"market"})
    // }, [])

    useEffect(() => {
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.HEADER_INDICES);
    }, [])

    useEffect(() => {
        if (indicesDetails)
            setIndicesList(indicesDetails[selectedExc])
    }, [selectedExc])

    useEffect(() => {
        if (indicesDetails) {
            setSectorIndicesList(indicesDetails[sectorSelectedExc])
            setSelectedIndexSector(indicesDetails[sectorSelectedExc][0])
            // setStreamingDataList(indicesDetails[sectorSelectedExc])
            streamingSubscription(indicesDetails[sectorSelectedExc])
        }
    }, [sectorSelectedExc])

    useEffect(() => {
        if (streamingResp && streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    useEffect(() => {
        if (selectedBaseTab === MARKET_BASE_WIDGET_MENUS.DERIVATIVE)
            getExpiryDateList()
    }, [selectedBaseTab, selectedStkIndCat])

    useEffect(() => {
        if (selectedBaseTab === MARKET_BASE_WIDGET_MENUS.EQUITY) {
            setMenuArray(MARKET_EQUITY_MENU_ARRAY_CONST)
            setSelectedEquityMenu(MARKET_EQUITY_MENU_ARRAY_CONST[0])
        }
        else if (selectedBaseTab === MARKET_BASE_WIDGET_MENUS.DERIVATIVE) {
            setMenuArray(MARKET_DERIVATIVE_MENU_ARRAY_CONST)
            setSelectedEquityMenu(MARKET_DERIVATIVE_MENU_ARRAY_CONST[0])
        }
        else {
            setMenuArray([])
            setSelectedEquityMenu(MARKET_GLOBAL_INDICES_MENU_ARRAY_CONST[0])
        }
    }, [selectedBaseTab])

    useEffect(() => {
        if (selectedEquityMenu.name === EQUITY_MENU.FII_DII_ACTIVITY) {
            let menus = Object.assign([], MARKET_BASE_EQUITY_FILTER)

            let menuArray = menus.filter((item) => {
                return (
                    item.name !== EQUITY_FILTERS.WEEKLY
                )
            })
            setEquityInterval(menuArray)
            setEquitySelectedFilter(MARKET_BASE_EQUITY_FILTER[0])

        } else
            setEquityInterval(MARKET_BASE_EQUITY_FILTER)

        if (selectedEquityMenu.name === DERIVATIVE_MENU.PUT_CALL_RATIO) {
            let val = Object.assign([], DERIVATIVE_STOCK_INDEX_CATEGORIES)
            let sortedList = val.filter((item) => {
                return (
                    item.name !== DERIVATIVE_STOCK_INDEX_FILTER.INDEX_FUTURE &&
                    item.name !== DERIVATIVE_STOCK_INDEX_FILTER.STOCK_FUTURE
                )
            })
            setDerivativeStockCat(sortedList)
            setSelectedStkInxCat(sortedList[0])
        } else {
            setDerivativeStockCat(DERIVATIVE_STOCK_INDEX_CATEGORIES)
        }
    }, [selectedEquityMenu])

    useEffect(() => {
        setSelectedIndex(indicesList[0])
    }, [indicesList])

    // useEffect(() => {
    //     setSelectedIndexSector(sectorIndicesList[0])
    // }, [sectorIndicesList])

    useEffect(() => {
        if (selectedMenuBtnRef.current)
            selectedMenuBtnRef.current.scrollIntoView()
    }, [selectedEquityMenu])

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function streamingSubscription(symArrayList) {
        let symbols = symArrayList.map(l => l.sym)
        props.forceSubscribeLevel1(symbols, [STREAMING_KEYS.LTP, STREAMING_KEYS.CHANGE, STREAMING_KEYS.CHANGE_PER])
    }

    function setStreamingResptoSymbols(resp) {
        let { data } = resp;
        let newList = sectorIndicesList.map(row => {
            if (row.sym.streamSym === data.symbol) {
                row = Object.assign({}, row, applyPaint(row, data));
            }
            return row;
        })
        //for first selected indices to display chng ..used this...
        if (data.symbol === selectedIndexSector.sym.streamSym) {
            let selectedSector = Object.assign({},selectedIndexSector)
            selectedSector = Object.assign({}, selectedSector,data);
            setSelectedIndexSector(selectedSector)
        }
        // setStreamingDataList(newList)
        setSectorIndicesList(newList)
    }

    function getExpiryDateList() {
        setExpiryDateList([])
        let request = new MsfRequest();
        request.addToData({
            "exc": "NFO",
            "segment": selectedStkIndCat.apiKey
        })
        request.setEncrypt(false)
        MsfFetch.placeRequest(
            getMarketDataBaseURL() + MARKET.GET_EXPIRY_DATELIST,
            request,
            successRespGetExpiryDateList,
            errorRespCBGetExpiryDateList
        )
    }
    function successRespGetExpiryDateList(response) {
        setExpiryDateList(response.data.expList)
        setSelectedExpiryDate(response.data.expList[0])
    }

    function errorRespCBGetExpiryDateList() {
        return null
    }

    function headerMenuSelected(item) {
        setSelectedBaseTab(item.name)
        AF_EventTriggered(AF_EVENT_NAMES.MARKET, item.name,{"onClick":"market-headerMenu"})
    }

    function onSelectCategory(item) {
        setSelectedCategory(item)
        AF_EventTriggered(AF_EVENT_NAMES.MARKET, item.name)

    }

    function onSelectItem(item) {
        setEquitySelectedFilter(item)
        AF_EventTriggered(AF_EVENT_NAMES.MARKET, item.name)

    }

    function setSelectedExcType(item) {
        setSelectedIndex({})
        setSelectedExc(item)
    }

    function setSelectedExcTypeSector(item) {
        setSelectedIndexSector({})
        setSectorSelectedExc(item)
    }

    function onClickEquityMenus(item) {
        setSelectedEquityMenu(item)
        AF_EventTriggered(AF_EVENT_NAMES.MARKET , item.name,{"onclick":"equityMenu"})

    }

    function onSelectIndex(item) {
        setSelectedIndex(item)
    }

    function onSelectIndexSector(item) {
        setSelectedIndexSector(item)
    }

    function onClickDerivativeFilter(item) {
        // setSelectedExpiryDate(null)
        setSelectedStkInxCat(item)
    }

    function onClickScollLeft() {
        let scrollPerClick = Math.ceil(watchGroupScroll.current.scrollWidth * (groupScrollPercentage.current / 100))
        if (watchGroupScroll.current.scrollLeft >= scrollPerClick)
            watchGroupScroll.current.scrollTo(watchGroupScroll.current.scrollLeft - scrollPerClick, 0)
        else
            watchGroupScroll.current.scrollTo(0, 0)
    }

    function onClickExpiryDate(item) {
        setSelectedExpiryDate(item)
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
        <div className="marketBase">
            <div className="marketBase-header">
                <div className="headerBase">
                    <div className="menuLeft">
                        {
                            marketBaseTab ?
                                marketBaseTab.map((item, index) => {
                                    return (
                                        <span key={index} className={`menuBaseTab cursor 
                                        ${item} ${selectedBaseTab === item.name ? 'selected' : ''}
                                          ${index === 0 ? 'first' : ''}`}
                                        onClick={() => headerMenuSelected(item)}>
                                            <LangText name={item.langKey} />
                                        </span>
                                    )
                                })
                                : ''
                        }
                    </div>
                    <div className="filtersOnRight">
                        {
                            selectedBaseTab === MARKET_BASE_WIDGET_MENUS.EQUITY ?
                                <>
                                    <div className="equity-filters">
                                        {
                                            (selectedEquityMenu.name === EQUITY_MENU.TOP_GAINERS
                                                || selectedEquityMenu.name === EQUITY_MENU.TOP_LOSERS
                                                || selectedEquityMenu.name === EQUITY_MENU.FII_DII_ACTIVITY) ?
                                                <div className="equityFilter-dropdown">
                                                    <Select
                                                        optionList={equityInterval}
                                                        selectedOption={equitySelectedFilter.name}
                                                        onSelectValueCB={onSelectItem}
                                                        value="name"
                                                        preSelect={true}
                                                        hiddenScroll={true}
                                                        hasLangageDependent ={true}

                                                    />
                                                </div> : ''
                                        }
                                        {
                                            (selectedEquityMenu.name !== EQUITY_MENU.FII_DII_ACTIVITY &&
                                                selectedEquityMenu.name !== EQUITY_MENU.IPO_PERFORMANCE) ?

                                                <ToggleMenu
                                                    menus={excArray}
                                                    selectedMenu={selectedExc}
                                                    orderAction={true}
                                                    hasToggle={true}
                                                    onSelectMenuCB={setSelectedExcType}
                                                /> : ''
                                        }

                                        {
                                            (selectedEquityMenu.name === EQUITY_MENU.FII_DII_ACTIVITY) ?
                                                <div className="equityFilter-dropdown">
                                                    <Select
                                                        optionList={fiidiiCategory}
                                                        selectedOption={selectedCategory.name}
                                                        onSelectValueCB={onSelectCategory}
                                                        value="name"
                                                        preSelect={true}
                                                        hiddenScroll={true}
                                                        hasLangageDependent = {true}
                                                    />
                                                </div>
                                                : ''
                                        }

                                        {

                                            (selectedEquityMenu.name !==
                                                EQUITY_MENU.BULK_DEALS && selectedEquityMenu.name
                                                !== EQUITY_MENU.BLOCK_DEALS
                                                && selectedEquityMenu.name !==
                                                EQUITY_MENU.FII_DII_ACTIVITY && selectedEquityMenu.name
                                                !== EQUITY_MENU.IPO_PERFORMANCE
                                                && selectedEquityMenu.name !==
                                                EQUITY_MENU.FT_WEEK_HIGH && selectedEquityMenu.name
                                                !== EQUITY_MENU.FT_WEEK_LOW)
                                                ?
                                                <div className="equityFilter-dropdown exc">
                                                    <Select
                                                        optionList={indicesList}
                                                        selectedOption={selectedIndex.dispSym}
                                                        onSelectValueCB={onSelectIndex}
                                                        value="dispSym"
                                                        preSelect={true}
                                                        hasSearch={true}
                                                        hiddenScroll={true}
                                                    />
                                                </div> : ''
                                        }
                                    </div>
                                </>
                                : null
                        }  
                        { 
                            selectedBaseTab === MARKET_BASE_WIDGET_MENUS.DERIVATIVE ?
                                <>
                                    <div className="equityFilter-dropdown derivative">
                                        <Select
                                            optionList={derivativeStockCat}
                                            selectedOption={selectedStkIndCat.name}
                                            onSelectValueCB={onClickDerivativeFilter}
                                            value="name"
                                            preSelect={true}
                                            hiddenScroll={true}
                                            hasLangageDependent = {true}
                                        />
                                    </div>
                                    <div className="equityFilter-dropdown derivative">
                                        <Select
                                            optionList={expiryDateList}
                                            selectedOption={selectedExpiryDate}
                                            onSelectValueCB={onClickExpiryDate}
                                            value=""
                                            preSelect={true}
                                            hiddenScroll={true}
                                        />
                                    </div>

                                </>
                                : null
                        }
                        {
                            selectedBaseTab === MARKET_BASE_WIDGET_MENUS.SECTOR_WATCH ?
                                <>
                                    <div className="equity-filters">
                                        <ToggleMenu
                                            menus={sectorExcArray}
                                            selectedMenu={sectorSelectedExc}
                                            orderAction={true}
                                            hasToggle={true}
                                            onSelectMenuCB={setSelectedExcTypeSector}
                                        />
                                    </div>
                                    <div className="equityFilter-dropdown sector">
                                        <Select
                                            optionList={sectorIndicesList}
                                            selectedOption={selectedIndexSector.dispSym}
                                            onSelectValueCB={onSelectIndexSector}
                                            value="dispSym"
                                            preSelect={true}
                                            hiddenScroll={true}
                                            hasChngPer={true}
                                            optValKey="chngPer"
                                        />
                                    </div>
                                </>
                                :
                                null
                        }
                    </div>
                </div>
                {
                    selectedBaseTab === MARKET_BASE_WIDGET_MENUS.GLOBAL_INDICES ?
                        null
                        :
                        <div className="menuArray">
                            <div className="marketMenu-div">
                                {
                                    selectedBaseTab === MARKET_BASE_WIDGET_MENUS.EQUITY ?
                                        <span className={`moveScroll-btn left ${disableGroupLeftScroll ?
                                            '' : 'active'}`}
                                        onClick={!disableGroupLeftScroll ? onClickScollLeft : null}
                                        >
                                            <LeftArrowIcon2 />
                                        </span> : ''
                                }
                                <div className="marketMoverstDisp scroller_firefox" ref={watchGroupScroll}
                                    onScroll={() => onManualScrollGroup()}
                                >
                                    {
                                        MenuArray ?
                                            MenuArray.map((item, index) => {
                                                return (
                                                    <span key={index}
                                                        ref={selectedEquityMenu === item ? selectedMenuBtnRef : null}
                                                        className={`menusTab cursor ${item.name}  ${index === 0 ?
                                                            'first' : ''} ${selectedEquityMenu === item ?
                                                            'selectedMenu' : ''}`}
                                                        onClick={() => onClickEquityMenus(item)}
                                                    >
                                                        {/* <span className="menuName">{item.name}</span> */}
                                                        <span className="menuName">
                                                            <LangText name={item.langKey} /></span>
                                                    </span>
                                                )
                                            })
                                            : ''
                                    }
                                    {
                                        selectedBaseTab === MARKET_BASE_WIDGET_MENUS.SECTOR_WATCH ?
                                            <>
                                                <div className="sector-selected-indices">
                                                    <span className="sector-indices">
                                                        {selectedIndexSector.dispSym} : </span>
                                                    <span className="sector-ltp">
                                                        {selectedIndexSector.ltp} 
                                                    </span>
                                                    <span className="sector-changeVal">
                                                        <span className={getColorCode(selectedIndexSector.chngPer)}>
                                                            {checkEmpty(selectedIndexSector.chng)} 
                                                            ({checkEmpty(selectedIndexSector.chngPer)}%)
                                                        </span>
                                                    </span>
                                                </div>
                                            </>
                                            :
                                            null
                                    }
                                </div>
                                {
                                    selectedBaseTab === MARKET_BASE_WIDGET_MENUS.EQUITY ?
                                        <span className={`moveScroll-btn right ${disableGroupRightScroll ?
                                            '' : 'active'}`}
                                        onClick={!disableGroupRightScroll ? onClickScollRight : null}
                                        >
                                            <RightArrowIcon2 />
                                        </span> : ''
                                }
                            </div>
                        </div>
                        
                }
            </div>

            <div className="marketBase-content">
                <MarketsAPIModelComponent
                    selectedExc={selectedExc}
                    sectorSelectedExc={sectorSelectedExc}
                    selectedIndex={selectedIndex.baseSym}
                    selectedIndexSector={selectedIndexSector.baseSym}
                    equitySelectedFilter={equitySelectedFilter}
                    MenuArray={MenuArray}
                    selectedEquityMenu={selectedEquityMenu}
                    selectedCategory={selectedCategory}
                    selectedBaseTab={selectedBaseTab}
                    selectedStkIndCat={selectedStkIndCat}
                    selectedExpiryDate={selectedExpiryDate}
                />
            </div>
        </div>
    )
}

export default withStreaming(MarketBaseComponent);