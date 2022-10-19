import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import SectorWatchTableComponent from './SectorWatchTableComponent'
import { WidgetLoader } from '../../../common/WidgetLoaderComponent'
import DerivativeTableComponent from './DerivativeTableComponent'
import MarketBaseMainTable from './MarketBaseMainTable'

import { getCMOTSBaseURL, getMarketDataBaseURL } from '../../../../common/CommonMethods'
import {
    EQUITY_FILTERS, EQUITY_MENU_GUEST, DERIVATIVE_MENU_GUEST,
    MARKET_BASE_WIDGET_MENUS
} from '../../../../common/Constants'

import { INDICES, MARKET_GUEST } from '../../../../config/ServiceURLs'

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
            if (props.selectedEquityMenu.name === EQUITY_MENU_GUEST.TOP_GAINERS
                || props.selectedEquityMenu.name === EQUITY_MENU_GUEST.TOP_LOSERS) {
                if (props.equitySelectedFilter.name === EQUITY_FILTERS.DAILY) {
                    if (props.selectedExc && props.selectedEquityMenu && props.selectedIndex)
                        getMarketMovers_Equity(props.selectedExc, props.selectedEquityMenu, props.selectedIndex)
                }
                else {
                    if (props.selectedEquityMenu.name === EQUITY_MENU_GUEST.TOP_GAINERS) {
                        if (props.selectedExc && props.equitySelectedFilter && props.selectedIndex)
                            getTopGainersApi()
                    }
                    else if (props.selectedEquityMenu.name === EQUITY_MENU_GUEST.TOP_LOSERS) {
                        if (props.selectedExc && props.equitySelectedFilter && props.selectedIndex)
                            getTopLosersAPI()
                    }
                }
            }
            else if (props.selectedEquityMenu.name === EQUITY_MENU_GUEST.FT_WEEK_LOW
                || props.selectedEquityMenu.name === EQUITY_MENU_GUEST.FT_WEEK_HIGH
                || props.selectedEquityMenu.name === EQUITY_MENU_GUEST.ACTIVE_VALUE
                || props.selectedEquityMenu.name === EQUITY_MENU_GUEST.ACTIVE_VOLUME) {
                if (props.selectedExc && props.selectedEquityMenu && props.selectedIndex)
                    getMarketMovers_Equity(props.selectedExc, props.selectedEquityMenu, props.selectedIndex)
            }
        }
    }, [props.selectedBaseTab, props.selectedExc, props.selectedEquityMenu,
        props.selectedIndex, props.equitySelectedFilter])

    useEffect(() => {
        if (props.selectedBaseTab === MARKET_BASE_WIDGET_MENUS.DERIVATIVE) {
            if (props.selectedEquityMenu.name === DERIVATIVE_MENU_GUEST.MOST_ACTIVE
                || props.selectedEquityMenu.name === DERIVATIVE_MENU_GUEST.OI_GAINERS ||
                props.selectedEquityMenu.name === DERIVATIVE_MENU_GUEST.OI_LOSERS) {
                if (props.selectedEquityMenu && props.selectedExpiryDate && props.selectedStkIndCat)
                    getMarketMovers_Derivative()
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
            getMarketDataBaseURL() + MARKET_GUEST.MARKET_MOVERS,
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
            getMarketDataBaseURL() + MARKET_GUEST.MARKET_MOVERS,
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
            getCMOTSBaseURL() + MARKET_GUEST.TOP_GAINERS,
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
            getCMOTSBaseURL() + MARKET_GUEST.TOP_LOSERS,
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
            getCMOTSBaseURL() + MARKET_GUEST.GET_GLOBAL_INDICES,
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
            if (props.selectedEquityMenu.name === EQUITY_MENU_GUEST.FT_WEEK_LOW
                || props.selectedEquityMenu.name === EQUITY_MENU_GUEST.FT_WEEK_HIGH
                || props.selectedEquityMenu.name === EQUITY_MENU_GUEST.ACTIVE_VALUE
                || props.selectedEquityMenu.name === EQUITY_MENU_GUEST.ACTIVE_VOLUME
                || (props.selectedEquityMenu.name === EQUITY_MENU_GUEST.TOP_GAINERS &&
                    props.equitySelectedFilter.name === EQUITY_FILTERS.DAILY)
                || (props.selectedEquityMenu.name === EQUITY_MENU_GUEST.TOP_LOSERS &&
                    props.equitySelectedFilter.name === EQUITY_FILTERS.DAILY)) {
                if (response.echo === selectedMenuName.current)
                    setmarketList(response.data.marketMovers)
            }
            else if (props.selectedEquityMenu.name === EQUITY_MENU_GUEST.TOP_GAINERS
                && props.equitySelectedFilter.name !== EQUITY_FILTERS.DAILY) {
                if (response.echo === selectedMenuName.current)
                    setmarketList(response.data.gainersList)
            }
            else if (props.selectedEquityMenu.name === EQUITY_MENU_GUEST.TOP_LOSERS
                && props.equitySelectedFilter.name !== EQUITY_FILTERS.DAILY) {
                if (response.echo === selectedMenuName.current)
                    setmarketList(response.data.losersList)
            }
        }
        else if (props.selectedBaseTab === MARKET_BASE_WIDGET_MENUS.DERIVATIVE) {
            if (props.selectedEquityMenu.name === DERIVATIVE_MENU_GUEST.MOST_ACTIVE
                || props.selectedEquityMenu.name === DERIVATIVE_MENU_GUEST.OI_GAINERS ||
                props.selectedEquityMenu.name === DERIVATIVE_MENU_GUEST.OI_LOSERS) {
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
                            <DerivativeTableComponent
                                marketList={marketList}
                                marketListErr={marketListErr}
                                selectedEquityMenu={props.selectedEquityMenu}
                                {...props}
                            />
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
                </>
            )
        }, [marketList, marketListErr])
    )
}

export default WidgetLoader(MarketsAPIModelComponent);