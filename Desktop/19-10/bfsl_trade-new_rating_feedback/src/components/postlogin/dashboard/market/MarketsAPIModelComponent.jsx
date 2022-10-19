import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import { WidgetLoader } from '../../../common/WidgetLoaderComponent'
import DerivativeTableComponent from './DerivativeTableComponent'
import FIIDIIActivityComponent from './FIIDIIActivityComponent'
import IpoPerformanceComponent from './IpoPerformanceComponent'
import MarketBaseMainTable from './MarketBaseMainTable'
import MarketDealsComponent from './MarketDealsComponent'
import PutCallRatioComponent from './PutCallRatioComponent'

import { AF_EventTriggered, getCMOTSBaseURL, getMarketDataBaseURL } from '../../../../common/CommonMethods'
import {
    EQUITY_FILTERS, EQUITY_MENU, DERIVATIVE_MENU,
    MARKET_BASE_WIDGET_MENUS,
    AF_EVENT_NAMES
} from '../../../../common/Constants'

import { INDICES, MARKET } from '../../../../config/ServiceURLs'
import GlobalIndicesTableComponent from './GlobalIndicesTableComponent'
import SectorWatchTableComponent from './SectorWatchTableComponent'

function MarketsAPIModelComponent(props) {

    const MsfFetch = useFetch()

    const [marketList, setmarketList] = useState([])
    const [marketListErr, setMarketListErr] = useState(null)

    const selectedMenuName = useRef(null)

    useEffect(() => {
        if (props.selectedEquityMenu)
            selectedMenuName.current = props.selectedEquityMenu.name
    }, [props.selectedEquityMenu])

    useEffect(() => {
        if (props.selectedBaseTab === MARKET_BASE_WIDGET_MENUS.EQUITY) {
            if (props.selectedEquityMenu.name === EQUITY_MENU.TOP_GAINERS
                || props.selectedEquityMenu.name === EQUITY_MENU.TOP_LOSERS) {
                if (props.equitySelectedFilter.name === EQUITY_FILTERS.DAILY) {
                    if (props.selectedExc && props.selectedEquityMenu && props.selectedIndex)
                        getMarketMovers_Equity(props.selectedExc, props.selectedEquityMenu, props.selectedIndex)
                }
                else {
                    if (props.selectedEquityMenu.name === EQUITY_MENU.TOP_GAINERS) {
                        if (props.selectedExc && props.equitySelectedFilter && props.selectedIndex)
                            getTopGainersApi()
                    }
                    else if (props.selectedEquityMenu.name === EQUITY_MENU.TOP_LOSERS) {
                        if (props.selectedExc && props.equitySelectedFilter && props.selectedIndex)
                            getTopLosersAPI()
                    }
                }
            }
            else if (props.selectedEquityMenu.name === EQUITY_MENU.FT_WEEK_LOW
                || props.selectedEquityMenu.name === EQUITY_MENU.FT_WEEK_HIGH
                || props.selectedEquityMenu.name === EQUITY_MENU.ACTIVE_VALUE
                || props.selectedEquityMenu.name === EQUITY_MENU.ACTIVE_VOLUME) {
                if (props.selectedExc && props.selectedEquityMenu && props.selectedIndex)
                    getMarketMovers_Equity(props.selectedExc, props.selectedEquityMenu, props.selectedIndex)
            }
        }
    }, [props.selectedBaseTab, props.selectedExc, props.selectedEquityMenu,
        props.selectedIndex, props.equitySelectedFilter])

    useEffect(() => {
        if (props.selectedBaseTab === MARKET_BASE_WIDGET_MENUS.EQUITY) {
            if (props.selectedEquityMenu.name === EQUITY_MENU.BULK_DEALS ||
                props.selectedEquityMenu.name === EQUITY_MENU.BLOCK_DEALS)
                getBulkBlockDealsAPI()
        }
    }, [props.selectedBaseTab, props.selectedExc, props.selectedEquityMenu])

    useEffect(() => {
        if (props.selectedBaseTab === MARKET_BASE_WIDGET_MENUS.EQUITY) {
            if (props.selectedEquityMenu.name === EQUITY_MENU.FII_DII_ACTIVITY)
                getFiiDiiAPI()
            else if (props.selectedEquityMenu.name === EQUITY_MENU.IPO_PERFORMANCE)
                getIPOperformanceAPI()
        }
    }, [props.selectedBaseTab, props.selectedEquityMenu, props.equitySelectedFilter, props.selectedCategory])

    useEffect(() => {
        if (props.selectedBaseTab === MARKET_BASE_WIDGET_MENUS.DERIVATIVE) {
            if (props.selectedEquityMenu.name === DERIVATIVE_MENU.MOST_ACTIVE
                || props.selectedEquityMenu.name === DERIVATIVE_MENU.OI_GAINERS ||
                props.selectedEquityMenu.name === DERIVATIVE_MENU.OI_LOSERS) {
                if (props.selectedEquityMenu && props.selectedExpiryDate && props.selectedStkIndCat)
                    getMarketMovers_Derivative()
            }
            else if (props.selectedEquityMenu.name === DERIVATIVE_MENU.PUT_CALL_RATIO) {
                getPutCallRatioPI()
            }
        }
    }, [props.selectedBaseTab, props.selectedEquityMenu,
        props.selectedStkIndCat, props.selectedExpiryDate])

    useEffect(() => {
        if (props.selectedBaseTab === MARKET_BASE_WIDGET_MENUS.GLOBAL_INDICES) {
            getGlobalIndicesResp()
        }
        else if (props.selectedBaseTab === MARKET_BASE_WIDGET_MENUS.SECTOR_WATCH) {
            getSectorWatchResp()
        }
    }, [props.selectedBaseTab])

    useEffect(() => {
        if (props.selectedBaseTab === MARKET_BASE_WIDGET_MENUS.SECTOR_WATCH) {
            getSectorWatchResp()
        }
    }, [props.sectorSelectedExc,props.selectedIndexSector])

    function getMarketMovers_Equity() {
        setmarketList([])
        setMarketListErr(null)
        let request = new MsfRequest();
        props.showWidgetLoader();
        request.addToData({
            "sortBy": props.selectedEquityMenu.apiKey,
            "exc": props.selectedExc,
            filters: [
                {
                    key: "indexName",
                    value: props.selectedIndex ? props.selectedIndex : ''
                },
            ]
        })
        request.setEcho(props.selectedEquityMenu.name)
        MsfFetch.placeRequest(
            getMarketDataBaseURL() + MARKET.MARKET_MOVERS,
            request,
            successRespCBgetMarketMovers,
            errorRespCBgetMarketMovers
        )
    }

    function getMarketMovers_Derivative() {
        setmarketList([])
        setMarketListErr(null)
        let request = new MsfRequest();
        props.showWidgetLoader();
        request.addToData({
            "exc": "NFO",
            "sortBy": props.selectedEquityMenu.apiKey,
            "filters": [
                {
                    "value": props.selectedExpiryDate,
                    "key": "expiry"
                },
                {
                    "value": "equity",
                    "key": "asset"
                },
                {
                    "value": props.selectedStkIndCat.apiKey,
                    "key": "segment"
                }
            ]
        })
        request.setEcho(props.selectedEquityMenu.name)
        MsfFetch.placeRequest(
            getMarketDataBaseURL() + MARKET.MARKET_MOVERS,
            request,
            successRespCBgetMarketMovers,
            errorRespCBgetMarketMovers
        )
    }

    function getTopGainersApi() {
        setmarketList([])
        setMarketListErr(null)
        let request = new MsfRequest();
        props.showWidgetLoader();
        request.addToData({
            "exc": props.selectedExc,
            "group": props.selectedIndex ? props.selectedIndex : '',
            "period": props.equitySelectedFilter.key
        })
        request.setEcho(props.selectedEquityMenu.name)
        MsfFetch.placeRequest(
            getCMOTSBaseURL() + MARKET.TOP_GAINERS,
            request,
            successRespCBgetMarketMovers,
            errorRespCBgetMarketMovers
        )
    }

    function getTopLosersAPI() {
        setmarketList([])
        setMarketListErr(null)
        let request = new MsfRequest();
        props.showWidgetLoader();
        request.addToData({
            "exc": props.selectedExc,
            "group": props.selectedIndex ? props.selectedIndex : '',
            "period": props.equitySelectedFilter.key
        })
        request.setEcho(props.selectedEquityMenu.name)
        MsfFetch.placeRequest(
            getCMOTSBaseURL() + MARKET.TOP_LOSERS,
            request,
            successRespCBgetMarketMovers,
            errorRespCBgetMarketMovers
        )
    }

    function getBulkBlockDealsAPI() {
        setmarketList([])
        setMarketListErr(null)
        let request = new MsfRequest();
        props.showWidgetLoader();
        request.addToData({
            "exc": props.selectedExc,
            "option": props.selectedEquityMenu.apiKey
        })
        request.setEcho(props.selectedEquityMenu.name)
        MsfFetch.placeRequest(
            getCMOTSBaseURL() + MARKET.BULKBLOCKDEALS,
            request,
            successRespCBgetMarketMovers,
            errorRespCBgetMarketMovers
        )
    }

    function getFiiDiiAPI() {
        setmarketList([])
        setMarketListErr(null)
        let request = new MsfRequest();
        props.showWidgetLoader();
        request.addToData({
            "type": props.equitySelectedFilter.apiKey,
            "category": props.selectedCategory.apiKey
        })
        request.setEcho(props.selectedEquityMenu.name)
        MsfFetch.placeRequest(
            getCMOTSBaseURL() + MARKET.FII_DII_ACTIVITY,
            request,
            successRespCBgetMarketMovers,
            errorRespCBgetMarketMovers
        )
    }

    function getIPOperformanceAPI() {
        setmarketList([])
        setMarketListErr(null)
        let request = new MsfRequest();
        props.showWidgetLoader();
        request.addToData({
            "exc": props.selectedExc,
        })
        request.setEcho(props.selectedEquityMenu.name)
        MsfFetch.placeRequest(
            getCMOTSBaseURL() + MARKET.IPO_PERFORMANCE,
            request,
            successRespCBgetMarketMovers,
            errorRespCBgetMarketMovers
        )
    }

    function getPutCallRatioPI() {
        setmarketList([])
        setMarketListErr(null)
        let request = new MsfRequest();
        props.showWidgetLoader();
        request.addToData({
            "type": "vol",
            "filters": [
                {
                    "value": props.selectedExpiryDate,
                    "key": "expiry"
                },
                {
                    "value": "equity",
                    "key": "asset"
                },
                {
                    "value": props.selectedStkIndCat.apiKey,
                    "key": "segment"
                }
            ]

        })
        request.setEcho(props.selectedEquityMenu.name)
        MsfFetch.placeRequest(
            getCMOTSBaseURL() + MARKET.PUT_CALL_RATIO,
            request,
            successRespCBgetMarketMovers,
            errorRespCBgetMarketMovers
        )
    }

    function getGlobalIndicesResp(){
        setmarketList([])
        setMarketListErr(null)
        let request = new MsfRequest();
        props.showWidgetLoader();
        request.addToData({
            "exc": props.selectedExc,
        })
        request.setEcho(props.selectedEquityMenu.name)
        MsfFetch.placeRequest(
            getCMOTSBaseURL() + MARKET.GET_GLOBAL_INDICES,
            request,
            successRespCBgetMarketMovers,
            errorRespCBgetMarketMovers
        )
    }

    function getSectorWatchResp() {
        setmarketList([])
        setMarketListErr(null)
        let request = new MsfRequest();
        props.showWidgetLoader();
        request.addToData({
            "indexName": props.selectedIndexSector,
            "exc": props.sectorSelectedExc
        })
        MsfFetch.placeRequest(
            getMarketDataBaseURL() + INDICES.INDEX_CONSTITUENTS,
            request,
            successRespCBgetMarketMovers,
            errorRespCBgetMarketMovers
        )
    }

    function successRespCBgetMarketMovers(response) {
        if (props.selectedBaseTab === MARKET_BASE_WIDGET_MENUS.EQUITY) {
            if (props.selectedEquityMenu.name === EQUITY_MENU.FT_WEEK_LOW
                || props.selectedEquityMenu.name === EQUITY_MENU.FT_WEEK_HIGH
                || props.selectedEquityMenu.name === EQUITY_MENU.ACTIVE_VALUE
                || props.selectedEquityMenu.name === EQUITY_MENU.ACTIVE_VOLUME
                || (props.selectedEquityMenu.name === EQUITY_MENU.TOP_GAINERS &&
                    props.equitySelectedFilter.name === EQUITY_FILTERS.DAILY)
                || (props.selectedEquityMenu.name === EQUITY_MENU.TOP_LOSERS &&
                    props.equitySelectedFilter.name === EQUITY_FILTERS.DAILY)) {
                if (response.echo === selectedMenuName.current)
                    setmarketList(response.data.marketMovers)
            }
            else if (props.selectedEquityMenu.name === EQUITY_MENU.TOP_GAINERS
                && props.equitySelectedFilter.name !== EQUITY_FILTERS.DAILY) {
                if (response.echo === selectedMenuName.current)
                    setmarketList(response.data.gainersList)
            }
            else if (props.selectedEquityMenu.name === EQUITY_MENU.TOP_LOSERS
                && props.equitySelectedFilter.name !== EQUITY_FILTERS.DAILY) {
                if (response.echo === selectedMenuName.current)
                    setmarketList(response.data.losersList)
            }
            else if (props.selectedEquityMenu.name === EQUITY_MENU.BLOCK_DEALS ||
                props.selectedEquityMenu.name === EQUITY_MENU.BULK_DEALS) {
                if (response.echo === selectedMenuName.current)
                    setmarketList(response.data.bulkDealsList)
            }
            else if (props.selectedEquityMenu.name === EQUITY_MENU.IPO_PERFORMANCE) {
                if (response.echo === selectedMenuName.current)
                    setmarketList(response.data.QuatResult)
            }
            else if (props.selectedEquityMenu.name === EQUITY_MENU.FII_DII_ACTIVITY) {
                if (response.echo === selectedMenuName.current)
                    setmarketList(response.data.fiiDii)
            }
        }
        else if (props.selectedBaseTab === MARKET_BASE_WIDGET_MENUS.DERIVATIVE) {
            if (props.selectedEquityMenu.name === DERIVATIVE_MENU.PUT_CALL_RATIO) {
                if (response.echo === selectedMenuName.current)
                    setmarketList(response.data.putCallRatioLst)
            }
            else if (props.selectedEquityMenu.name === DERIVATIVE_MENU.MOST_ACTIVE
                || props.selectedEquityMenu.name === DERIVATIVE_MENU.OI_GAINERS ||
                props.selectedEquityMenu.name === DERIVATIVE_MENU.OI_LOSERS) {
                if (response.echo === selectedMenuName.current)
                    setmarketList(response.data.marketMovers)
            }
        }
        else if (props.selectedBaseTab === MARKET_BASE_WIDGET_MENUS.SECTOR_WATCH) {
            setmarketList(response.data.RESULT)
        }
        else {
            setmarketList(response.data.wrldMktList)
        }
        props.hideWidgetLoader();
        AF_EventTriggered(AF_EVENT_NAMES.MARKET , props.equitySelectedFilter.name)
    }

    function errorRespCBgetMarketMovers(error) {
        setMarketListErr(error.message)
        props.hideWidgetLoader();
    }

    return (
        useMemo(() => {
            return (
                <>  {
                    (props.selectedBaseTab === MARKET_BASE_WIDGET_MENUS.EQUITY) ?
                        (props.selectedEquityMenu.name === EQUITY_MENU.BLOCK_DEALS ||
                            props.selectedEquityMenu.name === EQUITY_MENU.BULK_DEALS) ?
                            <MarketDealsComponent
                                marketList={marketList}
                                marketListErr={marketListErr}
                            />
                            : (props.selectedEquityMenu.name === EQUITY_MENU.IPO_PERFORMANCE) ?
                                <IpoPerformanceComponent
                                    marketList={marketList}
                                    marketListErr={marketListErr}
                                />
                                : (props.selectedEquityMenu.name === EQUITY_MENU.FII_DII_ACTIVITY) ?
                                    <FIIDIIActivityComponent
                                        marketList={marketList}
                                        marketListErr={marketListErr}
                                    />
                                    :
                                    <MarketBaseMainTable
                                        marketList={marketList}
                                        marketListErr={marketListErr}
                                        selectedEquityMenu={props.selectedEquityMenu}
                                        {...props}
                                    />
                        : null
                } 
                {
                    (props.selectedBaseTab === MARKET_BASE_WIDGET_MENUS.DERIVATIVE) ?
                        <>
                            {
                                (props.selectedEquityMenu.name === DERIVATIVE_MENU.PUT_CALL_RATIO) ?

                                    <PutCallRatioComponent
                                        marketList={marketList}
                                        marketListErr={marketListErr}
                                    />
                                    :
                                    <DerivativeTableComponent
                                        marketList={marketList}
                                        marketListErr={marketListErr}
                                        selectedEquityMenu={props.selectedEquityMenu}
                                        {...props}
                                    />
                            }
                        </>
                        : null
                }
                {
                    (props.selectedBaseTab === MARKET_BASE_WIDGET_MENUS.SECTOR_WATCH) ?
                        <>
                            <SectorWatchTableComponent
                                marketList={marketList}
                                marketListErr={marketListErr}
                                {...props}
                            />
                        </>
                        : null
                }
                {
                    (props.selectedBaseTab === MARKET_BASE_WIDGET_MENUS.GLOBAL_INDICES) ?
                        <>
                            <GlobalIndicesTableComponent
                                marketList={marketList}
                                marketListErr={marketListErr}
                                selectedEquityMenu={props.selectedEquityMenu}
                                {...props}
                            />
                        </>
                        : null
                }
                </>
            )
        }, [marketList, marketListErr])
    )
}

export default WidgetLoader(MarketsAPIModelComponent);