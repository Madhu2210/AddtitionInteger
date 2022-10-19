import React, { useEffect, useRef, useState } from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest, streamingManager, DEFAULT_PKT_INFO } from '../../index'

import { Route, Switch, Redirect } from 'react-router-dom';
// import {  } from '../../index'

import AddFundsDialogComponent from '../../components/common/AddFundsDialogComponent'
import Dashboard from '../../components/postlogin/dashboard/DashboardBaseComponent'
import Funds from '../../components/postlogin/funds/FundsBaseComponent';
import IPOBase from '../../components/postlogin/ipo/IPOBaseComponent';
import Header from '../../components/postlogin/header/HeaderBaseComponent'
import ChartDialog from '../../components/common/ChartDialogComponent'
import WDialogBase from '../../components/postlogin/dashboard/watchlist/watchlistDialogs/WatchlistDialogBaseComponent'
import IPODialogBaseComponent from '../../components/postlogin/ipo/ipoDialogs/IPODialogBaseComponent';
import MenuDialogBase from '../../components/postlogin/menu/MenuDialogBaseComponent';
import PledgeComponent from '../../components/postlogin/menu/pledge/PledgeComponent';
import EdisComponent from '../../components/postlogin/menu/edis/EdisComponent';
import BOReportsComponent from '../../components/postlogin/menu/reports/BOReportsComponent';
import BOReportsBaseComponent from '../../components/postlogin/menu/bo/BOReportsBaseComponent';
import ProfileBaseComponent from '../../components/common/profileHeader/ProfileBaseComponent';
import SettingsBaseComponent from '../../components/postlogin/settings/SettingsDialogBaseComponents';
import TaxInfoModalBaseComponent from '../../components/postlogin/taxDeclaration/TaxInfoModalBaseComponent';
import AlertComponent from '../../components/postlogin/dashboard/alerts/AlertComponent';
import HelpAndSupportComponent from '../../components/postlogin/menu/HelpAndSupportComponent';
import RatingAndFeedback from '../../components/postlogin/menu/RatingAndFeedback';
import FundRatingAndFeedback from '../../../src/components/postlogin/menu/FundRatingAndFeedback'
import LASBaseComponent from '../../components/postlogin/las/LASBaseComponent';
import LASBaseDialogComponent from '../../components/postlogin/las/lasDialogs/LASBaseDialogComponent';
import LoanAuthorized from '../../components/routers/LoanAuthorized';
import ServiceJourneyAuthorized from '../../components/routers/ServiceJourneyAuthorized';
import AvailLoanBaseComponent from '../../components/postlogin/availLoan/AvailLoanBaseComponent';
import OFSBaseComponent from '../../components/postlogin/ofs/OFSBaseComponent';

import { AppSettings } from '../../common/AppSettings';
import { getSession, callTaxDeclaration, getLoginType, gotoTrade, initDemoTour, 
    setPostLoginLocalDataToRedux } from '../../common/Bridge';

import { PROFILE } from '../../config/ServiceURLs'
import {
    storeProfileDetails, refreshDemoTour, storeIsBrokerageValue, setDemoSymName,
    storeOrderPadDialogDetails,
    storeDemoWatchListMtf,
    setDemoTourPopupBlock,
    storeRegetProfileDataFlag,
    storeMtfDialogDetails,
    storeLandingFromEdisPageFlag,
} from '../../state/actions/Actions';

import {
    SCREENS, LOGIN_TYPE, TAX_DECLARE_BLOCK_SCREENS,
    ORDER_TYPES, TRIALDEMO_SYM_DATA
} from '../../common/Constants';
import { streamingDateFormat, getBackOfficeBaseURL } from '../../common/CommonMethods';
import AvailLoanBaseDialog from '../../components/postlogin/availLoan/availLoanDialogs/AvailLoanBaseDialog';

import HomePageGuestUser from './HomePageGuestUser';
import OFSDialogBaseComponent from '../../components/postlogin/ofs/ofsdialogs/OFSDialogBaseComponent';
import NewsDialogBaseComponent from '../../components/postlogin/news/newsdialogs/NewsDialogBaseComponent';
// import NCDBase from '../../components/postlogin/ncd/NCDBaseComponent';
import NCDBaseComponent from '../../components/postlogin/ncd/NCDBaseComponent';
import NCDDialogBaseComponent from '../../components/postlogin/ncd/ncddialogs/NCDDialogBaseComponent';
import EdisDashboardComponent from '../../components/postlogin/mtf/EdisDashboardComponent';
import MSDlgBase from '../../components/postlogin/dashboard/ideas/marketSmith/marketSmithdialogs/MSDlgBase';
import { getLangText } from '../../common/lang/LangText';
import HelpAndSupportWebsiteComponent from '../../components/postlogin/menu/HelpAndSupportWebsiteComponent';
import MtfDialogBaseComponent from '../../components/postlogin/mtf/mtfDialogs/MtfDialogBaseComponent';
import MtfEpledgeComponent from '../../components/postlogin/mtf/MtfEpledgeComponent';
// import { getItemFromSessionStorage } from '../../common/LocalStorage';
import EVotingComponent from '../../components/postlogin/news/EVotingComponent';
import TradeSummaryDialogBase from '../../components/postlogin/menu/bo/TradeSummaryDialogBase';
// import { getItemFromSessionStorage } from '../../common/LocalStorage';

const HomePage = (props) => {

    useEffect(() => {
        document.addEventListener("visibilitychange", () => {
            // console.log("123hidden",document.hidden);
            if(document.hidden)
                storeLandingFromEdisPageFlag(true)
        });
    }, [])

    const MsfFetch = useFetch();
    const [profNme, setProfNme] = useState('')
    // const [mtfPledgeDetails, setMtfPledgeDetails] = useState([])
    // const [errorMsg, setErrorMsg] = useState()
    const introJsRef = useRef(null)
    const timer = useRef(null)

    const timeOut = useRef(null)

    // useEffect(() => {
    //     let mtfTimerData = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.MTF_TIMER_DATA))
    //     triggerMtfPledgeAlert(mtfTimerData.startTime,mtfTimerData.endTime,  mtfTimerData.duration)
    //     stopMtfPledgeAlert(mtfTimerData.endTime)
    //     // triggerMtfPledgeAlert("01:58", "07:00","1")
    //     // stopMtfPledgeAlert("07:00")
    //     // getMtfPledgeDetails()
    // }, [])

    useEffect(() => {
        return () => {
            clearInterval(timer.current)
            clearTimeout(timeOut.current)
        }
    }, [])

    useEffect(() => {
        setPostLoginLocalDataToRedux()
        streamingManager.setSession(getSession);
        if (getLoginType() === LOGIN_TYPE.TRADING) {
            streamingManager.setStreamingURL(AppSettings.streamingURL);
        }
        else if (getLoginType() === LOGIN_TYPE.GUEST) {
            streamingManager.setStreamingURL(AppSettings.streamingURL_GUEST);
        }
        // streamingManager.setStreamingURL(AppSettings.streamingURL);
        streamingManager.setBinary(AppSettings.binaryStreaming);
        streamingManager.setRetryCount(1000);
        streamingManager.setRetryInternal(5000);
        // to change the default date format from streaming 
        streamingManager.setPacketInfo({
            PKT_SPEC: getUpdatedPktInfo(DEFAULT_PKT_INFO)
        })
        streamingManager.start();

    }, [])

    useEffect(() => {
        introJsRef.current = window.introJs()
        getProfileDetails(false)
    }, [])

    useEffect(() => {
        if (props.regetProfileDetails) {
            getProfileDetails(true)
            props.storeRegetProfileDataFlag(false)
        }
    }, [props.regetProfileDetails])

    useEffect(() => {
        let userValidName = props.profUserName.custName ? props.profUserName.custName : ''
        setProfNme(userValidName)
        initDemoTour()
    }, [])

    useEffect(() => {
        if (props.refreshTour) {
            props.setDemoTourPopupBlock(true)
            demoTourStart();
            props.refreshDemoTour(false)
        }
    }, [props.refreshTour])

    //Steps for Demo-Tour starts Here 
    let demoTourSteps = [
        {
            title: getLangText('DEMO_WELCOME_TITLE'),
            intro: `<div class="demo-welcome-name">${profNme}!</div>
            <div>
            ${getLangText('DEMO_WELCOME_TEXT1')}
        <div class="demo-welcome-text">${getLangText('DEMO_WELCOME_TEXT2')}</div></div>`,
            tooltipClass: "welcomecard-tooltip",
        },
        {
            element: document.querySelector(".row.btn"),
            title: getLangText('DEMO_FUNDS_BTN'),
            intro: getLangText('DEMO_FUNDS_BTN_INTRO'),
            tooltipClass: "fundsBtn-tooltip",
            elementClass: ".row.btn"

        },
        {
            element: document.querySelector(".row.funds"),
            title: getLangText('DEMO_FUNDS'),
            intro: getLangText('DEMO_FUNDS_INTRO'),
            tooltipClass: "funds-tooltip",
            elementClass: ".row.funds"

        },
        {
            element: document.querySelector(".watchlistDiv"),
            title: getLangText('DEMO_WATCHLIST'),
            intro: `<div>${getLangText('DEMO_WATCHLIST_INTRO_P1')} </div>`,
            position: "right",
            tooltipClass: "watchlist-tooltip",
            elementClass: ".watchlistDiv",
            highlightClass: "highlight-watchlist"

        },
        {
            element: document.querySelector(".watchlistDiv .addWatchlist-btn"),
            title: getLangText('DEMO_ADD_WATCHLIST'),
            intro: getLangText('DEMO_ADD_WATCHLIST_INTRO'),
            tooltipClass: "wtchlistAdd-tooltip",
            elementClass: ".watchlistDiv .addWatchlist-btn",
            highlightClass: "highlight-watchlist-add"

        },
        {
            element: document.querySelector(".dashboard-base .symSearch-base"),
            title: getLangText('DEMO_SEARCH'),
            intro: getLangText('DEMO_SEARCH_INTRO'),
            position: "right",
            tooltipClass: "search-tooltip",
            highlightClass: "highlight-search",
            elementClass: ".dashboard-base .symSearch-base"

        },
        {
            element: document.querySelector(".watchlist-table .high-first-sym"),
            title: getLangText('DEMO_WATCHLIST2'),
            intro: getLangText('DEMO_WATCHLIST2_INTRO'),
            position: "bottom",
            tooltipClass: "watchlistSym-tooltip",
            elementClass: ".watchlist-table .high-first-sym",
            highlightClass: "highlight-watchlist-sym"
        },
        {
            element: document.querySelector(".demo-chart"),
            title: getLangText('DEMO_WATCHLIST3'),
            intro: `<div>${getLangText('DEMO_WATCHLIST3_INTRO')} </div>`,
            // <div class="demo-watchlist-text">${DEMOTOUR_MSG.DEMO_WATCHLIST3_INTRO2}</div>            
            position: "bottom",
            tooltipClass:
                "watchlistHoverIcons-tooltip",
            elementClass: ".demo-chart",
            highlightClass: "highlight-chart",

        },
        {
            element: document.querySelector(".demo-showIcons"),
            title: getLangText('DEMO_WATCHLIST4'),
            intro: `<div>${getLangText('DEMO_WATCHLIST3_INTRO2')} </div>`,
            position: "bottom",
            tooltipClass:
                "watchlistHoverBuySell-tooltip",
            highlightClass: "highlight-buySell",
            elementClass: ".demo-showIcons"

        },
        {
            element: document.querySelector(".productType.delivDemoTour"),
            tooltipClass: "orderpad-demotour",
            title: getLangText('DEMO_ORDER'),
            intro: getLangText('DEMO_ORDER_TEXT'),
            elementClass: ".productType.delivDemoTour",
            highlightClass: "highlight-deliver",

        },
        {
            element: document.querySelector(".productType.mtfDemoTour"),
            tooltipClass: "orderpad-mtf-demotour",
            title: getLangText('DEMO_ORDER'),
            intro: getLangText('DEMO_ORDER_TEXT2'),
            elementClass: ".productType.mtfDemoTour",
            highlightClass: "highlight-mtf",

        },
        {
            element: document.querySelector(".headerBase-div .menuIcon-div .menuIcon"),
            title: getLangText('DEMO_MENU'),
            intro: `<div>${getLangText('DEMO_MENU_INTRO_P1')} 
            <div class='demo-menu-textP2'>${getLangText('DEMO_MENU_INTRO_P2')}</div>
            <div class='demo-menu-text'>${getLangText('DEMO_MENU_INTRO_P3')}</div>
            <div class='demo-menu-text'>${getLangText('DEMO_MENU_INTRO_P4')}</div>
            <div class='demo-menu-text'>${getLangText('DEMO_MENU_INTRO_P5')}</div>
            <div class='demo-menu-text'>${getLangText('DEMO_MENU_INTRO_P6')}</div>
            </div>`,
            elementClass: ".headerBase-div .menuIcon-div .menuIcon",
            tooltipClass: "menu-tooltip",

        },
        {
            element: document.querySelector(".headerTab-base"),
            title: getLangText('DEMO_DASHBOARD'),
            intro: `<div>${getLangText('DEMO_ORDERHEADER1')}</div>
            <div class='demo-ordertooltip-text'>${getLangText('DEMO_ORDERHEADER2')}</div>`,
            tooltipClass: "order-tooltip",
            elementClass: ".headerTab-base",
            highlightClass: "highlight-orderheader"

        },
        {
            title: getLangText('DEMO_THANKYOU_TITLE'),
            intro: `<div class="demo-welcome-name">${profNme}!</div>
            <div>${getLangText('DEMO_GDBYE_TEXT')}</div>`,
            tooltipClass: "demo-final-step"
        }
    ]

    function demoTourStart() {
        let filteredMtfSteps = demoTourSteps
        if (props.demoWatchGetMtf) {
            let mtfRemove = filteredMtfSteps.filter((item) => item.highlightClass !== "highlight-mtf");
            filteredMtfSteps = mtfRemove
            props.storeDemoWatchListMtf(false)
        }
        introJsRef.current._options.doneLabel = getLangText('FINISH')
        introJsRef.current.setOptions({
            steps: filteredMtfSteps,
            exitOnEsc: false,
            exitOnOverlayClick: false,
            scrollToElement: false,
        })
            .onchange(function () {
                let wObject = props.demoWatchGet
                let symBlockPass = ''

                if (Object.keys(wObject).length === 0)
                    symBlockPass = TRIALDEMO_SYM_DATA
                else
                    symBlockPass = wObject

                if (this._introItems[this._currentStep].tooltipClass === "watchlistHoverBuySell-tooltip") {
                    gotoTrade(symBlockPass, ORDER_TYPES.BUY);
                }
                else if (this._introItems[this._currentStep].tooltipClass === 'order-tooltip') {
                    gotoTrade(symBlockPass, ORDER_TYPES.BUY);
                }
                if (document.querySelector(".introjs-focusLayer")) {
                    if (this._introItems[this._currentStep].tooltipClass === "fundsBtn-tooltip") {
                        document.querySelector(".introjs-focusLayer").textContent = `${getLangText('DEMO_LABEL_FUNDS')}`
                    }
                    else if (this._introItems[this._currentStep].tooltipClass === "funds-tooltip") {
                        let availFundsVal =
                            document.querySelector(".row.funds .availFunds").textContent
                        document.querySelector(".introjs-focusLayer").innerHTML = `<div 
                        class="row funds">
                        <span class="label">${getLangText('DEMO_LABEL_AVAILFUNDS')}</span>
                        <span class="availFunds positiveColor">${availFundsVal}</span>
                        </div>`
                    }
                    else if (this._introItems[this._currentStep].tooltipClass === "watchlist-tooltip") {
                        document.querySelector(".introjs-focusLayer").innerHTML =
                            `<div>
                        <span class="moveScroll-btn left ">
                        <span class="bfsl-font leftArrowIcon2 ">o</span></span>
                        <div class="watchlistDisp scroller_firefox">
                        <span class="watchGroup flex-center
                        first 
                        selected">
                        <span class="wName">
                        ${getLangText('DEMO_LABEL_PRED50')}</span></span><span class="watchGroup flex-center">
                        <span class="wName">
                        ${getLangText('DEMO_LABEL_MYLIST')}</span></span><span class="watchGroup flex-center
                        ">
                        <span class="wName">${getLangText('DEMO_LABEL_WTCHLIST')}</span></span>
                        </div>
                        <span class="moveScroll-btn right">
                        <span class="bfsl-font rightArrowIcon2 undefined">p</span></span></div>`
                    }
                    else if (this._introItems[this._currentStep].tooltipClass === "wtchlistAdd-tooltip") {
                        document.querySelector(".introjs-focusLayer").innerHTML = `<span 
                        class="addWatchlist-btn flex-center
                        cursor "><span class="bfsl-font plusIcon">q</span></span>`
                    }
                    else if (this._introItems[this._currentStep].tooltipClass === "search-tooltip") {
                        document.querySelector(".introjs-focusLayer").innerHTML = `<div class="inputCover">
                        <div class="input-addOn">
                        <label class="input-ele ">${getLangText('DEMO_LABEL_SEARCH')}</label>
                        <span class="bfsl-font searchIcon undefined">N</span>
                        </div></div>`
                    }
                    else if (this._introItems[this._currentStep].tooltipClass === "watchlistSym-tooltip") {
                        let symNme =
                            document.querySelector(".watchlist-table .high-first-sym .primary .baseSym").textContent
                        let excNme =
                            document.querySelector(".watchlist-table .high-first-sym .symName .exc").textContent
                        document.querySelector(".introjs-focusLayer").innerHTML =
                            `<td class="firstChild width40 high-first-sym ">
                    <div class="symName-column">
                    <div class="primary">
                    <div class="baseSym quote-click text-nowrap">${symNme}</div></div>
                    <div class="symName text-nowrap"><span class="exc">${excNme}</span></div></div></td>`
                    }
                    else if (this._introItems[this._currentStep].tooltipClass === "watchlistHoverIcons-tooltip") {
                        document.querySelector(".introjs-focusLayer").innerHTML = `<button 
                        class="iconBtn"><img src="assets/images/dark/dashboard/line_chart.svg" alt=""></button>`
                    }
                    else if (this._introItems[this._currentStep].tooltipClass === "watchlistHoverBuySell-tooltip") {
                        document.querySelector(".introjs-focusLayer").innerHTML = `<div 
                        class="demo-showIcons"><button class="buy-btn2">B</button>
                        <button class="sell-btn2">S</button></div>`
                    }
                    else if (this._introItems[this._currentStep].tooltipClass === "orderpad-demotour") {
                        let tabNme =
                            document.querySelector(".delivDemoTour").textContent
                        document.querySelector(".introjs-focusLayer").textContent = tabNme
                    }
                    else if (this._introItems[this._currentStep].tooltipClass === "orderpad-mtf-demotour") {
                        let tabNme =
                            document.querySelector(".mtfDemoTour").textContent
                        document.querySelector(".introjs-focusLayer").innerHTML = tabNme
                    }
                    else if (this._introItems[this._currentStep].tooltipClass === "menu-tooltip") {
                        document.querySelector(".introjs-focusLayer").innerHTML = `<span 
                        class="bfsl-font menuIcon flex-center">W</span>`
                    }
                    else if (this._introItems[this._currentStep].tooltipClass === "order-tooltip") {
                        document.querySelector(".introjs-focusLayer").innerHTML = `<div class="headerTab-base">
                        <div class="tab selected">
                        <div class="label">
                        <span class="head holdings-tab">
                        ${getLangText('DEMO_LABEL_HOLDINGS')}<span class="values-count">(--)</span></span>
                        <span class="valueLabel">${getLangText('DEMO_LABEL_P_AMP')}</span></div>
                        <div class="value"><span class="totalportfolio">--</span>
                        <span class="">--<span class="perVal">(--%)</span></span></div>
                        </div>
                        <div class="tab "><div class="label">
                        <span class="head">${getLangText('DEMO_LABEL_NETPOSN')}
                        </span><span class="valueLabel">${getLangText('DEMO_LABEL_P_AMP')}</span>
                        </div><div class="value netPostions"><span class="">--</span></div></div>
                        <div class="tab last order ">
                        <div class="label"><span class="head">${getLangText('DEMO_LABEL_ORDERSTATUS')}</span>
                        <span class="valueLabel">${getLangText('DEMO_LABEL_PENDING')}
                        </span><span class="valueLabel">${getLangText('DEMO_LABEL_EXECUTED')}</span></div>
                        <div class="value"><span class="head valueLabel"></span>
                        <span class="pending-val">--</span><span class="">--</span></div></div>
                        </div>`
                    }
                    else {
                        document.querySelector(".introjs-focusLayer").textContent = ""
                    }
                }
            })
            .onexit(function () {
                props.refreshDemoTour(false);
                props.setDemoTourPopupBlock(false)
                let element = document.querySelector(".demotour-selected");
                if (element) {
                    element.classList.remove("demotour-selected")
                }
                props.storeOrderPadDialogDetails({
                    dialogName: null
                })
            }).start()
    }

    //Demo-Tour steps ends here 

    function getProfileDetails(reget = false) {
        // console.log('getProfileDetails: ', getProfileDetails);
        let request = new MsfRequest()
        if (reget)
            request.setEcho("reget")
        else
            request.setEcho("noreget")
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + PROFILE.PROFILE_DETAILS,
            request,
            successRespCBGetProfDetails,
            errorRespCBGetProfDetails
        )
    }

    function successRespCBGetProfDetails(response) {
        // console.log('123welcomeresponse: ', response);
        props.storeProfileDetails(response.data)
        props.storeIsBrokerageValue(response.data.isBrokerage)
        if (response.echo === "noreget")
            callTaxDeclaration(null, TAX_DECLARE_BLOCK_SCREENS.DASHBOARD)
    }

    function errorRespCBGetProfDetails(error) {
        console.log("welcomeerror", error)
        return null
    }

    // function triggerMtfPledgeAlert(startTime, endTime, duration) {
    //     // console.log('startTime, endTime, duration: ', startTime, endTime, duration);
    //     let startHour = startTime.split(":")[0]
    //     let startMinute = startTime.split(":")[1]
    //     let endHour = endTime.split(":")[0]
    //     let endMinute = endTime.split(":")[1]
    //     let timeDuration = parseFloat(duration) * 60 * 1000
    //     // console.log('timeDuration: ', timeDuration);
    //     // console.log('hours: ', startHour);
    //     let currrentTime = new Date()
    //     let startTimeVal = new Date(currrentTime.getFullYear(), currrentTime.getMonth(), 
    //         currrentTime.getDate(), startHour, startMinute, 0, 0)
    //     let endTimeVal = new Date(currrentTime.getFullYear(), currrentTime.getMonth(), 
    //         currrentTime.getDate(), endHour, endMinute, 0, 0)

    //     let requiredStartTime = startTimeVal - currrentTime
    //     let requiredEndTime = endTimeVal - currrentTime

    //     if (requiredStartTime >= 0) {
    //         setTimeout(function () {
    //             showMtfAlertPopup(timeDuration)
    //         }, requiredStartTime)
    //     }
    //     else if(requiredStartTime < 0 && requiredEndTime > 0) {
    //         showMtfAlertPopup(timeDuration)
    //     }
    // }

    // function showMtfAlertPopup(duration) {
    //     props.storeMtfDialogDetails({
    //         name: MTF_DIALOGS.E_PLEDGE_ALERT
    //     })
    //     timer.current = setInterval(() => {
    //         props.storeMtfDialogDetails({
    //             name: MTF_DIALOGS.E_PLEDGE_ALERT
    //         })
    //     }, duration);
    // }

    // function stopMtfPledgeAlert(endTime) {
    //     let currrentTime = new Date()
    //     let endHour = endTime.split(":")[0]
    //     let endMinute = endTime.split(":")[1]
    //     let endTimeVal = new Date(currrentTime.getFullYear(), currrentTime.getMonth(), 
    //         currrentTime.getDate(), endHour, endMinute, 0, 0)
    //     let requiredEndTime = endTimeVal - currrentTime
    //     if(requiredEndTime >= 0) {
    //         setTimeout(() => {
    //             clearInterval(timer.current)
    //         }, requiredEndTime)
    //     }
    // }

    if (getLoginType() === LOGIN_TYPE.TRADING)
        return (
            <div className="home-page">
                <Header />
                <Switch>
                    <Route path={SCREENS.DASHBOARD} exact component={Dashboard} />
                    <Route path={SCREENS.FUNDS} exact component={Funds} />
                    <Route path={SCREENS.BO} exact component={BOReportsBaseComponent} />
                    <Route path={SCREENS.IPO} exact component={IPOBase} />
                    <Route path={SCREENS.OFS} exact component={OFSBaseComponent} />
                    <Route path={SCREENS.ALERTS} exact component={AlertComponent} />
                    {/* <Route path={SCREENS.AVAIL_LOAN} exact component={AvailLoanBaseComponent}/> */}
                    <Route path={SCREENS.NCD} exact component={NCDBaseComponent} />
                    <Route path={SCREENS.EDIS_DASHBOARD} exact component={EdisDashboardComponent} />
                    {/* <Route path={SCREENS.MARKET_SMITH_BASE_SCREEN} component={MarketSmithBaseComponent}/> */}
                    <LoanAuthorized path={SCREENS.LAS} component={LASBaseComponent} />
                    <ServiceJourneyAuthorized path={SCREENS.AVAIL_LOAN} component={AvailLoanBaseComponent} />
                    <Redirect to={SCREENS.DASHBOARD} />
                </Switch>

                <WDialogBase />
                <AddFundsDialogComponent />
                <ProfileBaseComponent />
                <SettingsBaseComponent />
                <ChartDialog />
                <IPODialogBaseComponent />
                <MenuDialogBase />
                <PledgeComponent />
                <EdisComponent />
                <BOReportsComponent />
                <TaxInfoModalBaseComponent />
                <HelpAndSupportComponent />
                <RatingAndFeedback />
                <FundRatingAndFeedback />
                <OFSDialogBaseComponent />
                <NewsDialogBaseComponent />
                <NCDDialogBaseComponent />
                <LASBaseDialogComponent />
                <AvailLoanBaseDialog />
                {/* <EdisDashboardComponent /> */}
                {/* <MarketSmithBaseComponent/> */}
                <MSDlgBase/>
                <HelpAndSupportWebsiteComponent/>
                <MtfEpledgeComponent/>
                <MtfDialogBaseComponent/>
                <EVotingComponent/>
                <TradeSummaryDialogBase/>
            </div>
        )
    else if (getLoginType() === LOGIN_TYPE.GUEST)
        return (
            <HomePageGuestUser {...props} />
        )
    return null
}

const mapStateToProps = ({ demoTour, settings, profileDialog, login }) => {

    return {
        refreshTour: demoTour.refreshDemoTour,
        selectedTheme: settings.selectedTheme,
        profileData: profileDialog.profileDetails,
        regetProfileDetails: profileDialog.regetProfileDetails,
        demoTourSymName: demoTour.demoTourSymName,
        profUserName: login.clientDetails,
        demoWatchGet: demoTour.demoWatchList,
        demoWatchGetMtf: demoTour.demoWatchListMtf,

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeProfileDetails: (s) => { dispatch(storeProfileDetails(s)) },
        refreshDemoTour: (s) => { dispatch(refreshDemoTour(s)) },
        storeIsBrokerageValue: (s) => { dispatch(storeIsBrokerageValue(s)) },
        setDemoSymName: (s) => { dispatch(setDemoSymName(s)) },
        storeOrderPadDialogDetails: (s) => { dispatch(storeOrderPadDialogDetails(s)) },
        storeDemoWatchListMtf: (s) => { dispatch(storeDemoWatchListMtf(s)) },
        setDemoTourPopupBlock: (s) => { dispatch(setDemoTourPopupBlock(s)) },
        storeRegetProfileDataFlag: (s) => { dispatch(storeRegetProfileDataFlag(s)) },
        storeMtfDialogDetails: (s) => { dispatch(storeMtfDialogDetails(s)) },
        storeLandingFromEdisPageFlag: (s) => {dispatch(storeLandingFromEdisPageFlag(s))}
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

function getUpdatedPktInfo(data) {
    let value = data.PKT_SPEC
    value[49][84] = { type: "int32", key: "ltt", len: 4, fmt: function (v) { return streamingDateFormat(v) } }

    return value
}

