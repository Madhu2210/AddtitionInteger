import React,{useEffect, useState,useRef} from 'react'
import { connect } from "react-redux";

import WatchlistBase from './watchlist/WatchlistBaseComponent'
import OrderBase from './orders/OrderBaseComponent'
import SymbolSearchComponent from '../header/SymbolSearchComponent';
import QuoteDialogBaseComponent from './quote/quoteDialogs/QuoteDialogBaseComponent';

import {CHART_WIDGET_MENUS, DASHBOARD_WIDGET_MODE, DYNAMIC_LINK_SCREEN, 
    INDICES_WIDGET_MENUS,LOCAL_STORAGE,SCREENS, AF_EVENT_NAMES, AF_EVENT_TYPES } from '../../../common/Constants';
import MarketBaseComponent from './market/MarketBaseComponent';
import ScannerBaseComponent from './scanners/ScannerBaseComponent';
import NewsBaseComponent from '../news/NewsBaseComponent';
import {AF_EventTriggered, convertToUpperCase, getMarketDataBaseURL } from '../../../common/CommonMethods';
import { getUrlParamAsObjects, gotoQuote, gotoTrade } from '../../../common/Bridge';
import { showAppDialog, storeBOReportsScreenFlag, 
    storeMarketSmithData,storeLoanInit, storeSelectedDashboardWidget,
    storeShowPledgeFlag, 
    storeDeeplinkMarketsmithFlag,
    storeClientHoldingsEVoteFlag} from '../../../state/actions/Actions';
import { MsfRequest,useFetch } from '../../../index';
import { ORDER_PAD } from '../../../config/ServiceURLs';
import { getItemFromSessionStorage } from '../../../common/LocalStorage';
import MarketSmithBase from './ideas/marketSmith/MarketSmithBase';
import IdeaBaseComponent from './ideas/IdeaBaseComponent';

function DashboardBaseComponent(props) {
    const MsfFetch = useFetch()
    const orderAction=useRef(null)
    const [instrumentLabel] = useState(true)

    useEffect(() => {
        let dynamicUrl=getItemFromSessionStorage(LOCAL_STORAGE.LOGIN_URL)
        if(dynamicUrl && dynamicUrl.includes('?')){
            handleDynamicLinks(dynamicUrl)

        }
    }, [])

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.DASHBOARD , AF_EVENT_TYPES.DASHBOARD_MENU,{"onLoad":"Dashboard"})
    }, [])

    function getBaseClass() {
        if (props.orderPadDialog.dialogName)
            return ''
        else if (props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.ORDER_WITH_QUOTE) {
            if (props.selectedChartWidgetMenu)
                return 'setMinHeight'
            return ''
        }
        else if (props.selectedChartWidgetMenu === CHART_WIDGET_MENUS.CHART ||
            props.selectedChartWidgetMenu === INDICES_WIDGET_MENUS.CHART)
            return 'setMinHeight'
        return ''
    }

    function handleDynamicLinks(url){
        let params = url.split('?');
        if (params.length > 1) {
            params = params[1];
            let urlParams = params.split('&');
            const paramsObj = getUrlParamAsObjects(urlParams);
            let paramScreen=convertToUpperCase(paramsObj.screen)
            if('screen' in paramsObj && paramScreen in SCREENS){
                if(paramScreen!==DYNAMIC_LINK_SCREEN.ORDERPAD&&paramScreen!==DYNAMIC_LINK_SCREEN.QUOTE
                    &&paramScreen!==DYNAMIC_LINK_SCREEN.NEWS&&paramScreen!==DYNAMIC_LINK_SCREEN.MARKETS){
                    props.history.push(paramsObj.screen)
                }
            }
            if('screen' in paramsObj) { 
                if(paramScreen==DYNAMIC_LINK_SCREEN.FUND){
                    props.history.push(SCREENS.FUNDS)

                }else if(paramScreen==DYNAMIC_LINK_SCREEN.IDEAS){
                    props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.IDEAS_VIEW)
                }else if(paramScreen==DYNAMIC_LINK_SCREEN.REPORTS){
                    // props.storeBOReportsScreenFlag(true)
                    props.history.push(SCREENS.BO)
                }else if(paramScreen==DYNAMIC_LINK_SCREEN.EDIS){
                    props.storeEdisScreenFlag(true)
                }else if(paramScreen==DYNAMIC_LINK_SCREEN.PLEDGE){
                    props.storeShowPledgeFlag(true)
                }else if(paramScreen==DYNAMIC_LINK_SCREEN.NEWS){
                    props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.NEWS_VIEW)
                }else if(paramScreen==DYNAMIC_LINK_SCREEN.MARKETS){
                    props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.MARKET_VIEW)
                }else if(paramScreen==DYNAMIC_LINK_SCREEN.LAS){
                    props.storeLoanInit(true)
                }else if(paramScreen==DYNAMIC_LINK_SCREEN.MARKETSMITH){
                    props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.IDEAS_VIEW)
                    props.storeDeeplinkMarketsmithFlag(true)
                    // props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.MARKETSMITH_VIEW)
            
                    // props.storeMarketSmithData({
                    //     marketSmtScreen:MARKETSMITH_SCREENS.COMPARISON
                    // })
                }
                else if(paramScreen==DYNAMIC_LINK_SCREEN.EVOTE){
                    props.history.push(SCREENS.BO)
                    props.storeClientHoldingsEVoteFlag(true)
                }

            }
            if ('id' in paramsObj) {
                if('action' in paramsObj)
                    orderAction.current=paramsObj.action
                validateRefferalId({id:paramsObj.id})
                    
            }
                
        }
      
    }

    function validateRefferalId(refferalCode){
        
        let request = new MsfRequest();
        request.addToData({
            sym:refferalCode
        })
        MsfFetch.placeRequest(
            getMarketDataBaseURL() + ORDER_PAD.GET_SYM_DETAILS,
            request,
            successRespGetSymbolInfo,
            errorRespCBGetSymbolInfo
        )
    }

    function successRespGetSymbolInfo(response){
        if(orderAction.current)
            gotoTrade(response.data.results,orderAction.current)
        else
            gotoQuote(response.data.results)
    
    } 

    function errorRespCBGetSymbolInfo(error){
        props.showAppDialog({
            message: error.message,
            show: true,
        })
    } 

    return (
        <div className={`dashboard-base ${getBaseClass()}`}>
            <div className="watchlist-with-search">
                <div className="watchlist-search">
                    <SymbolSearchComponent showInstrument={instrumentLabel}/>
                </div>
                <WatchlistBase />
            </div>
            <div className={`orderContents 
            ${props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.SCANNERS_VIEW ? "scanner" : ""}`} >
                {
                    props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.MARKET_VIEW ?
                        <MarketBaseComponent /> : props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.SCANNERS_VIEW ?
                            <ScannerBaseComponent /> :props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.NEWS_VIEW ?
                                <NewsBaseComponent/> :props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.IDEAS_VIEW ?
                                    <IdeaBaseComponent/>
                                    :props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.MARKETSMITH_VIEW ?
                                        <MarketSmithBase/> :
                                        <OrderBase />
                }
                <QuoteDialogBaseComponent />
            </div>
        </div>
    )
}

const mapStateToProps = ({ dashboard, orderPad, chart}) => {
    return {
        selectedWidgetMode: dashboard.selectedWidgetMode,
        orderPadDialog: orderPad.dialog,
        selectedChartWidgetMenu: chart.selectedChartWidgetMenu,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {

        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) },
        // storeEdisScreenFlag: (s) => { dispatch(storeEdisScreenFlag(s)) },
        storeBOReportsScreenFlag: (s) => { dispatch(storeBOReportsScreenFlag(s)) },
        storeShowPledgeFlag: (s) => { dispatch(storeShowPledgeFlag(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeLoanInit: (s) => { dispatch(storeLoanInit(s)) },
        storeMarketSmithData: (s) => { dispatch(storeMarketSmithData(s)) },
        storeDeeplinkMarketsmithFlag: (s) => { dispatch(storeDeeplinkMarketsmithFlag(s)) },
        storeClientHoldingsEVoteFlag: (s) => { dispatch(storeClientHoldingsEVoteFlag(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardBaseComponent);