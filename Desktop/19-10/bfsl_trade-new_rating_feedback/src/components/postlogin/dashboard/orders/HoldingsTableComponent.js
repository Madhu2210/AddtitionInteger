import React, { useEffect, useState, useMemo, useRef } from "react";

import { connect } from "react-redux";
import { withStreaming, MsfRequest, useFetch } from "../../../../index";
import { withRouter } from "react-router-dom";

import LangText from "../../../../common/lang/LangText";
import { LazyLoading } from "../../../common/LazyLoadingHOC";
// import { Loader } from '../../../common/LoaderComponent';

import { MTF_SERVICES } from "../../../../config/ServiceURLs";
import { marketValue, storeAllHoldingsResponseToStore, storeHoldingsResponseToStore } from '../../../../common/Bridge';
import { HOLDINGS } from '../../../../config/ServiceURLs';
import {
    storeModifyOrderDetails,
    storeOrderFieldValues,
    storeOrderPadDialogDetails,
    storeOrderpadSelectedSym,
    storeSelectedDashboardWidget,
    storeHoldingsortData,
    storeSquareoffNetPosition,
    storeShowPledgeFlag,
    storeEdisScreenFlag,
    storeNavigateFromHoldings,
} from "../../../../state/actions/Actions";
import {
    closeTaxDeclarationDialog,
    gotoChartPopup,
    gotoQuote,
    gotoTrade,
} from "../../../../common/Bridge";
import {
    AF_EventTriggered,
    applyPaint,
    calculateDayspnl,
    calculateInvested,
    calculatePNL,
    calculatePNLPer,
    calculatePortfolioValue,
    checkEmpty,
    convertCommaSeparated,
    convertToUpperCase,
    formSymBlock,
    getColorCode,
    getDecimal_Precision,
    getDispSymbolName,
    replaceComma,
    scrollToTop,
    sortByInt,
    sortByString,
    sortFlagFunc,
    getMTFBaseURL,
    getBackOfficeBaseURL
} from "../../../../common/CommonMethods";
import {
    CloseIcon,
    DownArrowIcon,
    MaximizeIcon,
    MinimizeIcon,
    MoreInfoIcon,
    SortIcon,
    UpArrowIcon,
} from "../../../common/FontIcons";
import {
    DASHBOARD_WIDGET_MODE,
    ORDER_TYPES,
    ORDERPAD_FIIELD_KEYS,
    ORDERPAD_DIALOGS,
    ORDER_MODIFY_TYPE,
    TEXT_ORIENTATION,
    SORT_DATATYPE,
    SORT_TYPES,
    THEMES,
    STREAMING_KEYS,
    STREAMING_MODULES,
    SCREENS,
    AF_EVENT_NAMES,
    AF_EVENT_TYPES,
    PROFILE_POA_STATUS,
    LOCAL_STORAGE,
    DASHBOARD_ORDER_TABS,
} from "../../../../common/Constants";
import HoldingsModal from "../../../../common/HoldingsModal";
import { getItemByKey } from "../../../../common/LocalStorage";
import { style } from "d3";


function HoldingsTableComponent(props) {
    // let state1 = store.getState();
    console.log("Holding Data", props)
    const MsfFetch = useFetch()

    const [holdingsList, setHoldingsList] = useState([])
    const [holdingsLength, setHoldingsLength] = useState(null)
    const [selectedShowMoreIndex, setSelectedShowMoreIndex] = useState(null)
    const [showMore, setShowMore] = useState(false)
    const [streamingResp, setStreamingResp] = useState(null)
    const [symbolList, setSymbolList] = useState([])
    const [streamSymbolList, setStreamSymbolList] = useState([])
    const [totalPortfolioVal, setTotalPortfolioVal] = useState(null)
    const [totalPLValues, setTotalPLValues] = useState({})
    const [sortFlag, setSortFlag] = useState(
        [
            { column: "qty", sortAsc: null },
            { column: "ltp", sortAsc: null },
            { column: "chng", sortAsc: null },
            { column: "avgPrice", sortAsc: null },
            { column: "invested", sortAsc: null },
            { column: "portfolioValue", sortAsc: null },
            { column: "pnl", sortAsc: null },
            { column: "dayspnl", sortAsc: null },

        ]
    )
    const [sortAsc, setSortAsc] = useState(true)
    const [openOptionsBlock, setOpenOptionsBlock] = useState(false)
    const [holdingsUserId, setHoldingsUserId] = useState(null);
    const [showHoldingsModal, setShowHoldingsModal] = useState(false);
    const [liveLedger, setLiveLedger] = useState(null);
    const [mtfLedger, setMTFLedger] = useState(null);
    const [holdingsMarketValue, setHoldingsMarketValue] = useState(null);

    const showOptionsBlock = useRef(null);

    // const [showBTSTChargePopup, setShowBTSTChargePopup] = useState(false)
    // const BTSTItem = useRef(null)
    // const BTSTItemType = useRef(null)
    // const isSorting = useRef(false)

    // const modalRef = useRef(null)
    // const closeModal = useCloseModal()
    // closeModal.useOutsideAlerter(modalRef, onClose)
    // useEffect(() => {
    //     // debugger
    //     getHoldingResponse()
    // }, [])

    useEffect(() => {

        console.log("props.selectedTab", props.selectedTab)
        if (props.selectedTab === DASHBOARD_ORDER_TABS.HOLDINGS)
            getHoldingResponse()
    }, [props.selectedTab])

    useEffect(() => {
        if (props.landingFromEdisFlag)
            getHoldingResponse()
    }, [props.landingFromEdisFlag])

    useEffect(() => {
        AF_EventTriggered(
            AF_EVENT_NAMES.HOLDINGS,
            AF_EVENT_TYPES.HOLDINGS_TAB,
            {
                onLoad: "holdings",
            }
        );
        showOptionsBlock.current = false;
    }, []);

    useEffect(() => {
        props.setDisableLazyLoad(true);
        props.setElementRowHeight(65);
        props.setScrollRef(document.getElementById("holdingsTable"));
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.HOLDINGS_TABLE);
        scrollToTop();
    }, []);

    useEffect(() => {
        if (streamingResp && streamingResp !== {})
            setStreamingResptoSymbolsList(streamingResp);
    }, [streamingResp]);

    useEffect(() => {
        if (props.list.length || props.errorMsg) props.hideWidgetLoader();
        else props.showWidgetLoader();
    }, [props.list, props.errorMsg]);

    useEffect(() => {
        if (props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.ORDER_VIEW)
            setShowMore(true);
        else setShowMore(false);
    }, [props.selectedWidgetMode]);

    useEffect(() => {
        setHoldingsData(Object.assign([], props.list));
    }, [props.list]);

    useEffect(() => {
        if (props.sortColumnList && props.sortColumnList.length)
            setSortFlag(props.sortColumnList);
    }, [props.sortColumnList]);

    useEffect(() => {
        if (
            props.visibleList &&
            props.visibleList.length &&
            streamSymbolList.length
        ) {
            streamSymbolList.map((item) => {
                let isSymVisible = props.visibleList.findIndex((i) => {
                    return i.sym.streamSym === item.sym.streamSym;
                });
                if (isSymVisible !== -1) {
                    let newList = symbolList.map((row) => {
                        if (row.sym.streamSym === item.sym.streamSym) {
                            // row = Object.assign({}, row, item);
                            row.pnl = item.pnl;
                            row.pnlPer = item.pnlPer;
                            row.portfolioValue = item.portfolioValue;
                            row.dayspnl = item.dayspnl;
                            row.ltp = item.ltp;
                            row.close = item.close;
                            row.avgPrice = item.avgPrice;
                            row.chng = item.chng;
                            row.chngPer = item.chngPer;
                        }
                        return row;
                    });
                    setSymbolList(newList);
                }
            });
        }
    }, [props.visibleList]);

    function setHoldingsData(holdings) {
        holdings = holdings.map((item) => {
            item.buyValue = convertCommaSeparated(
                (
                    parseFloat(replaceComma(item.avgPrice)) *
                    parseInt(replaceComma(item.qty))
                ).toString(),
                getDecimal_Precision(item.sym.exc)
            );
            item.pnl = parseFloat(replaceComma(item.avgPrice))
                ? convertCommaSeparated(
                    (
                        (parseFloat(replaceComma(item.ltp)) -
                            parseFloat(replaceComma(item.avgPrice))) *
                        parseFloat(replaceComma(item.qty))
                    ).toString(),
                    getDecimal_Precision(item.sym.exc)
                )
                : "0.00";
            item.pnlPer =
                parseFloat(replaceComma(item.buyValue)) &&
                    parseFloat(replaceComma(item.avgPrice))
                    ? convertCommaSeparated(
                        (
                            (parseFloat(replaceComma(item.pnl)) * 100) /
                            parseFloat(replaceComma(item.buyValue))
                        ).toString(),
                        getDecimal_Precision(item.sym.exc)
                    )
                    : "0.00";
            return item;
        });
        setStreamSymbolList(holdings);
        props.setOriginalList(holdings);
        setSymbolList(holdings);
        if (holdings.length) {
            streamingSubscription(holdings);
        }
    }

    function streamingSubscription(symArrayList) {
        let symbols = symArrayList.map((l) => l.sym);
        props.forceSubscribeLevel1(symbols, [
            STREAMING_KEYS.LTP,
            STREAMING_KEYS.CHANGE,
            STREAMING_KEYS.CHANGE_PER,
            STREAMING_KEYS.CLOSE,
        ]);
    }

    function onStreamCB(resp) {
        setStreamingResp(resp);
    }

    function setStreamingResptoSymbolsList(resp) {
        let { data } = resp;

        let newSymList = streamSymbolList.map((row) => {
            if (row.sym.streamSym === data.symbol) {
                row = Object.assign({}, row, applyPaint(row, data));
                if (row.isPrevClose === true) row.avgPrice = row.close;

                let avgPrice = row.avgPrice;

                if (row.ltp) {
                    row.pnl = calculatePNL(
                        avgPrice,
                        row.ltp,
                        row.qty,
                        row.sym.exc
                    );
                    row.pnlPer = calculatePNLPer(
                        row.buyValue,
                        avgPrice,
                        row.pnl,
                        row.sym.exc
                    );
                    row.portfolioValue = calculatePortfolioValue(
                        row.ltp,
                        row.qty
                    );
                    row.dayspnl = calculateDayspnl(
                        avgPrice,
                        row.ltp,
                        row.close,
                        row.qty,
                        row.sym.exc
                    );
                    if (row.isPrevClose === true)
                        row.invested = calculateInvested(
                            avgPrice,
                            row.qty,
                            row.sym.exc
                        );
                    // Invested amount calculation in Holdings shifted from MW to FE on 18-04-2022 -launched in uat
                }
            }
            return row;
        });
        setStreamSymbolList(newSymList);

        let isSymVisible = props.visibleList.findIndex((i) => {
            return i.sym.streamSym === data.symbol;
        });
        if (isSymVisible !== -1) {
            let newList = symbolList.map((row) => {
                if (row.sym.streamSym === data.symbol) {
                    row = Object.assign({}, row, applyPaint(row, data));
                    if (row.isPrevClose === true) row.avgPrice = row.close;

                    if (row.ltp) {
                        let avgPrice = row.avgPrice;
                        row.pnl = calculatePNL(
                            avgPrice,
                            row.ltp,
                            row.qty,
                            row.sym.exc
                        );
                        row.pnlPer = calculatePNLPer(
                            row.buyValue,
                            avgPrice,
                            row.pnl,
                            row.sym.exc
                        );
                        row.portfolioValue = calculatePortfolioValue(
                            row.ltp,
                            row.qty
                        );
                        row.dayspnl = calculateDayspnl(
                            avgPrice,
                            row.ltp,
                            row.close,
                            row.qty,
                            row.sym.exc
                        );
                        if (row.isPrevClose === true)
                            row.invested = calculateInvested(
                                avgPrice,
                                row.qty,
                                row.sym.exc
                            );
                    }
                }
                return row;
            });
            // console.log('newList',newList)
            setSymbolList(newList);
        }
    }
    function onSort(type, key1, sortType) {
        console.log("asdasd", type, key1, sortType);
        if (type === "string") onSortByStringCB(key1, sortType);
        else onSortByIntCB(key1, sortType);
    }

    function onIconSort(type, key, sortType) {
        onSort(type, key, sortType);
    }

    function onSortByIntCB(key1, sortType) {
        let ascSort = sortAsc;
        if (sortType) {
            if (sortType === SORT_TYPES.ASC) {
                setSortAsc(true);
                ascSort = true;
            } else {
                setSortAsc(false);
                ascSort = false;
            }
        } else setSortAsc(!sortAsc);

        let sortedSymList = sortByInt(ascSort, symbolList, key1);
        setSymbolList(sortedSymList);
        if (symbolList && symbolList.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1);
            setSortFlag(updatedSortFlag);
        }
    }

    function onSortByStringCB(key1, sortType) {
        let ascSort = sortAsc;
        if (sortType) {
            if (sortType === SORT_TYPES.ASC) {
                setSortAsc(true);
                ascSort = true;
            } else {
                setSortAsc(false);
                ascSort = false;
            }
        } else setSortAsc(!sortAsc);

        let sortedSymList = sortByString(ascSort, symbolList, key1);
        setSymbolList(sortedSymList);
        if (symbolList && symbolList.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1);
            setSortFlag(updatedSortFlag);
        }
    }

    function getSortIconCB(column) {
        let sortFlagArray = Object.assign([], sortFlag);
        let sortOrder = sortFlagArray.filter((item) => item.column === column);
        if (sortOrder.length) return sortOrder[0].sortAsc;
        return null;
    }

    function showMoreDetails(index) {
        if (index === selectedShowMoreIndex) setSelectedShowMoreIndex(null);
        else setSelectedShowMoreIndex(index);
    }

    function gotoQuoteView(item, fullView = false) {
        gotoQuote(item, fullView);
        setShowMore(false);
    }

    function onClickExpand() {
        if (showMore)
            props.storeSelectedDashboardWidget(
                DASHBOARD_WIDGET_MODE.ORDER_WITH_QUOTE
            );
        else
            props.storeSelectedDashboardWidget(
                DASHBOARD_WIDGET_MODE.ORDER_VIEW
            );

        setShowMore(!showMore);
    }

    function onClickSquareOffOrder(dataItem, type) {
        // console.log('dataItem: ', dataItem);
        // if(parseInt(dataItem.btst) ===  0) {
        //     setShowBTSTChargePopup(true)
        //     BTSTItem.current = dataItem
        //     BTSTItemType.current = type
        // }
        // else
        onClickModifyOrder(dataItem, type);
    }

    function onClickModifyOrder(dataItem, type) {
        let symObj = formSymBlock(dataItem);
        let values = {};
        let fieldKeyArray = Object.keys(dataItem);
        fieldKeyArray.map((item) => {
            if (item === "netQty") {
                values[ORDERPAD_FIIELD_KEYS.QUANTITY] = replaceComma(
                    dataItem[item]
                );
            } else if (ORDERPAD_FIIELD_KEYS.API_KEY[item])
                values[
                    ORDERPAD_FIIELD_KEYS[ORDERPAD_FIIELD_KEYS.API_KEY[item]]
                ] = replaceComma(dataItem[item]);
        });
        props.storeModifyOrderDetails({
            modifyType: type,
            symDetails: dataItem,
        });
        props.storeOrderFieldValues(values);
        props.storeOrderpadSelectedSym(symObj);
        props.storeOrderPadDialogDetails({
            dialogName: ORDERPAD_DIALOGS.ORDER_PAD,
            trade_type: ORDER_TYPES.SELL,
        });
        closeTaxDeclarationDialog();
        // props.storeSquareoffHoldings(true)
        props.storeSquareoffNetPosition(true);
    }

    // function onSort(type, key1) {
    //     isSorting.current = true
    //     props.storeHoldingsortData({
    //         type: type,
    //         key: key1,
    //         sortType: null,
    //     })
    // }

    // function getSortIconCB(column) {
    //     let sortOrder = sortFlag.filter((item) => item.column === column)
    //     if (sortOrder.length)
    //         return sortOrder[0].sortAsc
    //     return null
    // }
    // function onIconSort(type, key, sortType) {
    //     props.storeHoldingsortData({
    //         type: type,
    //         key: key,
    //         sortType: sortType,
    //     })
    // }

    function onclickAuthorise() {
        props.storeEdisScreenFlag(true);
        // if(props.allHoldingsResp.isAuthorized)
        //     props.history.push(SCREENS.EDIS_DASHBOARD)
    }

    // function onClickProceed(item, type) {
    //     console.log('item, type: ', item, type);
    //     onClickModifyOrder(item,type)
    // }

    // function onClickCancel() {
    //     setShowBTSTChargePopup(false)
    // }

    function onClose() {
        setOpenOptionsBlock(false);
        showOptionsBlock.current = false;
    }

    function onClickEpledge() {
        props.storeShowPledgeFlag(true);
        setOpenOptionsBlock(false);
        showOptionsBlock.current = false;
    }
    function onClickPnl() {
        props.history.push(SCREENS.BO);
        props.storeNavigateFromHoldings(true);
    }

    // function onClickMoreOptions() {
    //     console.log('onClickMoreOptions: ', onClickMoreOptions, !showOptionsBlock.current);
    //     setOpenOptionsBlock(!openOptionsBlock)
    // }

    function openHoldingsModal() {
        // props.showLoader()
        // setShowHoldingsModal(true);
        onClose()
        let getHoldingsUserId = getItemByKey(LOCAL_STORAGE.USER_ID);
        setHoldingsUserId(getHoldingsUserId);
        fetchData();

        async function fetchData() {
            try {
                const response = await fetch(
                    getMTFBaseURL() + MTF_SERVICES.GET_MTF_DETAILS + getHoldingsUserId
                );
                const data = await response.json();
                // props.hideLoader()
                setLiveLedger(data.data.liveLedger);
                setMTFLedger(data.data.mtfLedger);
                setShowHoldingsModal(true);
            } catch (err) {
                alert("Something went wrong");
            }
        }

        //props.getHoldingsModalDetails(true);
    }

    function hideModal() {
        setShowHoldingsModal(false);
    }

    function getHoldingResponse() {
        getHoldings()
    }

    function getHoldings() {
        let request = new MsfRequest();
        // props.getResponseList([], "", sortFlag)
        request.addToData({})
        setTotalPLValues({})
        setTotalPortfolioVal(null)
        setHoldingsList([])
        setHoldingsLength(null)

        // request.setEncrypt(false)
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + HOLDINGS.GET_HOLDINGS_BO,
            request,
            successRespCBGetHoldings,
            errorRespCBGetHoldings
        )
    }

    function successRespCBGetHoldings(response) {

        console.log('123holdingsresponse:--- ', response);
        setHoldingsMarketValue(response)
        setHoldingsData(response)
        props.getResponseList(response.data.holdings, "", sortFlag)
        storeHoldingsResponseToStore(response.data.holdings)
        storeAllHoldingsResponseToStore(response.data)
    }


    function errorRespCBGetHoldings(error) {
        // props.getResponseList([], error.message, sortFlag)
    }

    // function calculateMarketValue() {
    //     let marketValue;
    //     props.holdings.forEach(element => {
    //         console.log("marketValue New", element)
    //         const holdingsCurrentValue= element.ltp * element.qty
    //         marketValue =marketValue  + holdingsCurrentValue
    //     });
    //     return marketValue
    // }

    return useMemo(() => {
        return (

            <div className="orderTable-base">

                <div className="orderTopWraper">    
                    <div className="cardDashboard" style={{ backgroundColor: "#fbf9f9" }}>
                        <div class="container">
                        <h2 class="investmentClass" style={{color: "#7E7E7E"}}><LangText module="CARDS" name="TOTAL_INVESTMENT" /></h2>
                        <h2 style={{ color: "#7e7e7e" }}></h2>
                            <p style={{ display: "flex", justifyContent: "space-between" }}><b style={{ fontSize: "22px" }}>₹ {Object.keys(props.allHoldingsResp).length > 0 ? props.allHoldingsResp.invested : null}</b> <span class="bfsl-font-2 moneybackicon holding-icon">n</span></p>
                        </div>
                    </div>
                    <div className="cardDashboard" style={{ backgroundColor: "#fbf9f9" }}>
                        <div class="container" >
                        <h2 class="currentValueClass" style={{color: "#7E7E7E"}}><LangText module="CARDS" name="CURRENT_VALUES" /></h2>
                            <p style={{ display: "flex", justifyContent: "space-between" }}><b style={{ fontSize: "22px" }}>₹  {Object.keys(props.allHoldingsResp).length > 0 ? props.allHoldingsResp.invested : null}</b> <span class="bfsl-font-2 holdingsqtyicon holding-icon">t</span></p>
                        </div>
                    </div>

                    <div className="cardDashboard" style={{ backgroundColor: "#fbf9f9" }}>
                        <div class="container" >
                        <h2 class="overallPnlClass" style={{color: "#7E7E7E"}}><LangText module="CARDS" name="OVERALL_PNL" /></h2>
                            <p style={{ display: "flex", justifyContent: "space-between" }}><b style={{ fontSize: "22px", color: "#00b500" }}>  
                            <td class="negativeColor">₹ {Object.keys(props.allHoldingsResp).length > 0 ? (parseFloat(props.allHoldingsResp.marketValue.replace(/\,/g, '')) - parseFloat(props.allHoldingsResp.invested.replace(/\,/g, ''))).toFixed(2) : null}
                            </td></b> 
                            <b style={{ fontSize: "22px", color: "#00b500" }}><td class="positiveColor">{Object.keys(props.allHoldingsResp).length > 0 ? (parseFloat(props.allHoldingsResp.marketValue.replace(/\,/g, '')) > parseFloat(props.allHoldingsResp.invested.replace(/\,/g, ''))) ? <span className="bfsl-font uparrowtradeicon holding-icon" style={{ color: "#00b500" }}>(</span> 
                            : 
                            <span className="bfsl-font downarrowtradeicon holding-icon" style={{ color: "#eb0000" }}>_</span> : null}
                            
                            </td></b></p>
                        </div>
                    </div>

                    <div className="cardDashboard" style={{ backgroundColor: "#fbf9f9" }}>
                        <div class="container" >
                        <h2 class="todaysPnlClass" style={{color: "#7E7E7E"}}><LangText module="CARDS" name="TODAYS_PROFIT" /></h2>
                            <p style={{ display: "flex", justifyContent: "space-between" }}><b style={{ fontSize: "22px", color: "#00b500" }}>  {Object.keys(props.allHoldingsResp).length > 0 ? props.allHoldingsResp.ltp: null}</b> <span className="bfsl-font uparrowtradeicon holding-icon">(</span></p>
                        </div>
                    </div>
                </div>
                {/* // ):null} */}

                {Object.keys(props.profileData).length > 0 &
                    props.holdingsResp.length ? (

                    <div className="hold-auth-text">

                        {/* <span className="auth-icon"><DownArrow/></span> */}
                        {/* {props.profileData}           
                                        {props.allHoldingsResp.holdings.marketValue?props.allHoldingsResp.holdings.marketValue:"no data"}gger */}

                        <div className="optionDiv">
                            {
                                // props.allHoldingsResp.isAuthorized &&
                                convertToUpperCase(
                                    props.profileData.poaStatus
                                ) === PROFILE_POA_STATUS.INACTIVE
                                    //  &&!props.profileData.ddpiFlg 
                                    ? (
                                        <span
                                            className={`authorised cursor  
                                                    ${!props.allHoldingsResp
                                                    .isAuthorized
                                                    ? "inactive"
                                                    : ""
                                                }`}
                                            onClick={onclickAuthorise}
                                        >
                                            <LangText name="MTF_EDIS_LINK" />
                                            {/* {props.allHoldingsResp.holdings.marketValue?props.allHoldingsResp.holdings.marketValue:"no data"}gger */}

                                        </span>
                                    ) : (
                                        <span
                                            className="authorised cursor"
                                            onClick={onClickEpledge}
                                        >
                                            <LangText name="MTF_PLEDGE_LINK" />
                                        </span>
                                    )
                            }
                            <span
                                className="more-options cursor"
                                onClick={() =>
                                    setOpenOptionsBlock(!openOptionsBlock)
                                }
                            >
                                <MoreInfoIcon />
                            </span>
                        </div>
                        {openOptionsBlock ? (
                            <div className="auth-div">
                                <div className="auth-header cursor">
                                    <span className="auth-close">
                                        <CloseIcon onClick={onClose} />
                                    </span>
                                </div>
                                <div className="auth-body">
                                    {
                                        // props.allHoldingsResp.isAuthorized &&
                                        convertToUpperCase(
                                            props.profileData.poaStatus
                                        ) === PROFILE_POA_STATUS.INACTIVE
                                            // && !props.profileData.ddpiFlg 
                                            ? (
                                                <div
                                                    className="auth-content cursor"
                                                    onClick={onClickEpledge}
                                                >
                                                    <LangText name="INCREASE_MARGIN_EPLEDGE" />
                                                </div>
                                            ) : null
                                    }
                                    <div
                                        className="auth-content cursor"
                                        onClick={onClickPnl}
                                    >
                                        <LangText name="PROFIT_LOSS_REPORT" />
                                    </div>
                                    <div
                                        className="auth-content cursor"
                                        onClick={openHoldingsModal}
                                    >
                                        Close MTF Position
                                        {/* <LangText name="MTF_TO_CASH"></LangText> */}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                ) : null}
                <table className="order-table">
                    <thead className="thead-scroller">
                        <tr>
                            <th className={`firstChild width24`}>
                                <span
                                    className=""
                                // onClick={() => onSort(SORT_DATATYPE.STRING, 'dispSym')}
                                >
                                    <LangText
                                        module="TABLE_HEADERS"
                                        name="SYMBOL"
                                    />
                                </span>
                                {/* <SortIcon colName="dispSym"  /> */}
                            </th>
                            <th className="">
                                <span
                                    className="cursor"
                                    onClick={() =>
                                        onSort(SORT_DATATYPE.INT, "qty")
                                    }
                                >
                                    <LangText
                                        module="TABLE_HEADERS"
                                        name="QTY"
                                        orientation={TEXT_ORIENTATION.UPPERCASE}
                                    />
                                </span>
                                <SortIcon
                                    colName="qty"
                                    getSortIcon={getSortIconCB}
                                    type={SORT_DATATYPE.INT}
                                    onIconSort={onIconSort}
                                />
                            </th>
                            <th className="">
                                <span
                                    className="cursor"
                                    onClick={() =>
                                        onSort(SORT_DATATYPE.INT, "avgPrice")
                                    }
                                >
                                    <LangText
                                        module="TABLE_HEADERS"
                                        name="AVG_PRICE"
                                    />
                                </span>
                                <SortIcon
                                    colName="avgPrice"
                                    getSortIcon={getSortIconCB}
                                    type={SORT_DATATYPE.INT}
                                    onIconSort={onIconSort}
                                />
                            </th>
                            <th className="width12">
                                <span
                                    className="cursor"
                                    onClick={() =>
                                        onSort(SORT_DATATYPE.INT, "ltp")
                                    }
                                >
                                    <LangText
                                        module="TABLE_HEADERS"
                                        name="LTP_CHNG_PER"
                                    />
                                </span>
                                <SortIcon
                                    colName="ltp"
                                    getSortIcon={getSortIconCB}
                                    type={SORT_DATATYPE.INT}
                                    onIconSort={onIconSort}
                                />
                            </th>
                            {/* <th className="">
                            <span className="cursor"
                                onClick={() => onSort(SORT_DATATYPE.INT, 'chng')}
                            >
                                <LangText module="TABLE_HEADERS" name="CHG_AND_PER" />
                            </span>
                            <SortIcon colName="chng" getSortIcon={getSortIconCB} type={SORT_DATATYPE.INT} onIconSort={onIconSort} />
                        </th> */}
                            <th className="">
                                <span
                                    className="cursor"
                                    onClick={() =>
                                        onSort(SORT_DATATYPE.INT, "invested")
                                    }
                                >
                                    <LangText
                                        module="TABLE_HEADERS"
                                        name="INVESTED"
                                    />
                                </span>
                                <SortIcon
                                    colName="invested"
                                    getSortIcon={getSortIconCB}
                                    type={SORT_DATATYPE.INT}
                                    onIconSort={onIconSort}
                                />
                            </th>
                            <th className="width10">
                                <span
                                    className="cursor"
                                    onClick={() =>
                                        onSort(
                                            SORT_DATATYPE.INT,
                                            "portfolioValue"
                                        )
                                    }
                                >
                                    <LangText
                                        module="TABLE_HEADERS"
                                        name="VALUE_L"
                                    />
                                </span>
                                <SortIcon
                                    colName="portfolioValue"
                                    getSortIcon={getSortIconCB}
                                    type={SORT_DATATYPE.INT}
                                    onIconSort={onIconSort}
                                />
                            </th>
                            <th className="">
                                <span
                                    className="cursor"
                                    onClick={() =>
                                        onSort(SORT_DATATYPE.INT, "dayspnl")
                                    }
                                >
                                    <LangText
                                        module="TABLE_HEADERS"
                                        name="TODAYS_PL"
                                    />
                                </span>
                                <SortIcon
                                    colName="dayspnl"
                                    getSortIcon={getSortIconCB}
                                    type={SORT_DATATYPE.INT}
                                    onIconSort={onIconSort}
                                />
                            </th>
                            <th className="">
                                <span
                                    className="cursor"
                                    onClick={() =>
                                        onSort(SORT_DATATYPE.INT, "pnl")
                                    }
                                >
                                    <LangText
                                        module="TABLE_HEADERS"
                                        name="P_L"
                                    />
                                </span>
                                <SortIcon
                                    colName="pnl"
                                    getSortIcon={getSortIconCB}
                                    type={SORT_DATATYPE.INT}
                                    onIconSort={onIconSort}
                                />
                            </th>
                            <th className="width4 iconCol">
                                {props.selectedWidgetMode !==
                                    DASHBOARD_WIDGET_MODE.DEFAULT ? (
                                    showMore ? (
                                        <MinimizeIcon
                                            className="showMoreIcon"
                                            onClick={onClickExpand}
                                        />
                                    ) : (
                                        <MaximizeIcon
                                            className="showMoreIcon"
                                            onClick={onClickExpand}
                                        />
                                    )
                                ) : null}
                            </th>
                        </tr>
                    </thead>
                    <tbody
                        id="holdingsTable"
                        className="tbody-scroller scroller_firefox"
                        onScroll={(e) => props.onScrollDiv(e)}
                    >
                        {symbolList.length ? (
                            symbolList.map((item, index) => {
                                return (
                                    <>
                                        <tr
                                            className={`${selectedShowMoreIndex === index
                                                ? "noBorder"
                                                : ""
                                                } `}
                                        >
                                            <td className="firstChild width24">
                                                <div className="symName-column">
                                                    <div className="primary">
                                                        <div
                                                            className="baseSym primary-symName text-nowrap quote-click"
                                                            title={
                                                                getDispSymbolName(
                                                                    item
                                                                ).primaryName
                                                            }
                                                            onClick={() =>
                                                                gotoQuoteView(
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            {
                                                                getDispSymbolName(
                                                                    item
                                                                ).primaryName
                                                            }
                                                        </div>
                                                        <span className="exc">
                                                            {item.sym.exc}
                                                            {item.prdType ? (
                                                                <span className="pTypeVal">
                                                                    {
                                                                        item.prdType
                                                                    }
                                                                </span>
                                                            ) : null}
                                                        </span>
                                                    </div>
                                                    <div className="symName text-nowrap">
                                                        <span
                                                            title={
                                                                getDispSymbolName(
                                                                    item
                                                                ).secondaryName
                                                            }
                                                        >
                                                            {
                                                                getDispSymbolName(
                                                                    item
                                                                ).secondaryName
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{checkEmpty(item.qty)}</td>
                                            <td>{checkEmpty(item.avgPrice)}</td>
                                            <td className="width12">
                                                <span
                                                    className={`${item.ltpClass}`}
                                                >
                                                    {checkEmpty(item.ltp)}
                                                </span>
                                                <span
                                                    className={`changePer_inLTP ${getColorCode(
                                                        item.chngPer
                                                    )}`}
                                                >
                                                    ({checkEmpty(item.chngPer)}
                                                    %)
                                                </span>
                                            </td>
                                            {/* <td className={`change ${getColorCode(item.chng)}`}>
                                                <span className={`${item.chngClass}`}>{checkEmpty(item.chng)}({checkEmpty(item.chngPer)}%)</span>
                                            </td> */}
                                            <td>{checkEmpty(item.invested)}</td>
                                            <td className="width10">
                                                {checkEmpty(
                                                    item.portfolioValue
                                                )}
                                            </td>
                                            <td
                                                className={`${getColorCode(
                                                    item.dayspnl
                                                )}`}
                                            >
                                                {checkEmpty(item.dayspnl)}
                                            </td>
                                            <td
                                                className={`${getColorCode(
                                                    item.pnl
                                                )}`}
                                            >
                                                {checkEmpty(item.pnl)}
                                            </td>
                                            <td className="width4">
                                                {selectedShowMoreIndex ===
                                                    index ? (
                                                    <UpArrowIcon
                                                        className="showMoreIcon cursor"
                                                        onClick={() =>
                                                            showMoreDetails("")
                                                        }
                                                    />
                                                ) : (
                                                    <DownArrowIcon
                                                        className="showMoreIcon cursor"
                                                        onClick={() =>
                                                            showMoreDetails(
                                                                index
                                                            )
                                                        }
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                        {selectedShowMoreIndex === index ? (
                                            <div className="moreDetails">
                                                <button
                                                    onClick={() =>
                                                        gotoChartPopup(item)
                                                    }
                                                >
                                                    {props.selectedTheme ===
                                                        THEMES.LIGHT ? (
                                                        <img
                                                            src="assets/images/dashboard/line_chart.svg"
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <img
                                                            src="assets/images/dark/dashboard/line_chart.svg"
                                                            alt=""
                                                        />
                                                    )}
                                                    <LangText
                                                        module="BUTTONS"
                                                        name="CHART"
                                                    />
                                                </button>
                                                {/* <button>
                                                        <img src="assets/images/dashboard/set_alert.svg" alt="" />
                                                        <LangText module="BUTTONS" name="SET_ALERT" />
                                                    </button>
                                                    <button>
                                                        <img src="assets/images/dashboard/small_case.svg" alt="" />
                                                        <LangText module="BUTTONS" name="SMALL_CASE" />
                                                    </button>
                                                    <button>
                                                        <img src="assets/images/dashboard/streak.svg" alt="" />
                                                        <LangText module="BUTTONS" name="STREAK" />
                                                    </button> */}
                                                <button
                                                    onClick={() =>
                                                        gotoTrade(
                                                            item,
                                                            ORDER_TYPES.BUY
                                                        )
                                                    }
                                                >
                                                    {props.selectedTheme ===
                                                        THEMES.LIGHT ? (
                                                        <img
                                                            src="assets/images/dashboard/buy_more.svg"
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <img
                                                            src="assets/images/dark/dashboard/buy_more.svg"
                                                            alt=""
                                                        />
                                                    )}
                                                    <LangText
                                                        module="BUTTONS"
                                                        name="BUY_MORE"
                                                        orientation={
                                                            TEXT_ORIENTATION.LOWERCASE
                                                        }
                                                    />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        onClickSquareOffOrder(
                                                            item,
                                                            ORDER_MODIFY_TYPE.SQUARE_OFF
                                                        )
                                                    }

                                                // onClickModifyOrder(item, ORDER_MODIFY_TYPE.SQUARE_OFF)}
                                                >
                                                    {props.selectedTheme ===
                                                        THEMES.LIGHT ? (
                                                        <img
                                                            src="assets/images/dashboard/square_off.svg"
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <img
                                                            src="assets/images/dark/dashboard/square_off.svg"
                                                            alt=""
                                                        />
                                                    )}
                                                    <LangText
                                                        module="BUTTONS"
                                                        name="SQUARE_OFF"
                                                        orientation={
                                                            TEXT_ORIENTATION.LOWERCASE
                                                        }
                                                    />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        gotoQuoteView(
                                                            item,
                                                            true
                                                        )
                                                    }
                                                >
                                                    {props.selectedTheme ===
                                                        THEMES.LIGHT ? (
                                                        <img
                                                            src="assets/images/dashboard/quote.svg"
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <img
                                                            src="assets/images/dark/dashboard/quote.svg"
                                                            alt=""
                                                        />
                                                    )}

                                                    <LangText
                                                        module="BUTTONS"
                                                        name="QUOTE"
                                                    />
                                                </button>
                                            </div>
                                        ) : null}
                                        {
                                            // showBTSTChargePopup ?
                                            // <div className="btst-charge">
                                            //     <div className="text">charges</div>
                                            //     <button>CANCEL</button>
                                            //     <button>PROCEED</button>
                                            // </div>
                                            // :
                                            // null
                                        }
                                    </>
                                );
                            })
                        ) : (
                            <tr className="errorRow">
                                <td className="colspan">
                                    {props.errorMsg ? props.errorMsg : ""}
                                </td>
                            </tr>
                        )}
                    </tbody>
                    {/* {
                        
                            showBTSTChargePopup ?
                                <div className="btst-charge-block">
                                    <div className="details-div">
                                        <span className="sym-name">TCS</span>
                                        <span className="exc">NSE</span>
                                    </div>
                                    <div className="text">You will be charged Margin for selling BTST stocks</div>
                                    <div className="action-div">
                                        <button className="cancel-btn" onClick={onClickCancel}>CANCEL</button>
                                        <button className="proceed-btn" 
                                            onClick={() => 
                                                onClickProceed(BTSTItem.current,BTSTItemType.current )}>PROCEED</button>
                                    </div>
                                </div>
                                :
                                null
                        } */}
                </table>
                <HoldingsModal
                    show={showHoldingsModal}
                    holdingsUserId={holdingsUserId}
                    liveLedger={liveLedger}
                    mtfLedger={mtfLedger}
                    handleClose={hideModal}
                />
                {/* <div className="btst-charge">
                        <div className="text">charges</div>
                        <button>CANCEL</button>
                        <button>PROCEED</button>

                    </div> */}
            </div>
        );
    }, [
        symbolList,
        selectedShowMoreIndex,
        showMore,
        props.errorMsg,
        props.selectedTheme,
        props.selectedWidgetMode,
        openOptionsBlock,
        showHoldingsModal,
    ]);
}

const mapStateToProps = ({ dashboard, settings, profileDialog, holdings }) => {
    return {
        selectedTheme: settings.selectedTheme,
        selectedWidgetMode: dashboard.selectedWidgetMode,
        profileData: profileDialog.profileDetails,
        holdingsResp: holdings.holdingsResp,
        allHoldingsResp: holdings.allHoldingsResp,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        storeSelectedDashboardWidget: (s) => {
            dispatch(storeSelectedDashboardWidget(s));
        },
        storeModifyOrderDetails: (s) => {
            dispatch(storeModifyOrderDetails(s));
        },
        storeOrderFieldValues: (s) => {
            dispatch(storeOrderFieldValues(s));
        },
        storeOrderpadSelectedSym: (s) => {
            dispatch(storeOrderpadSelectedSym(s));
        },
        storeOrderPadDialogDetails: (s) => {
            dispatch(storeOrderPadDialogDetails(s));
        },
        storeHoldingsortData: (s) => {
            dispatch(storeHoldingsortData(s));
        },
        storeSquareoffNetPosition: (s) => {
            dispatch(storeSquareoffNetPosition(s));
        },
        storeShowPledgeFlag: (s) => {
            dispatch(storeShowPledgeFlag(s));
        },
        storeEdisScreenFlag: (s) => {
            dispatch(storeEdisScreenFlag(s));
        },
        storeNavigateFromHoldings: (s) => {
            dispatch(storeNavigateFromHoldings(s));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStreaming(withRouter(LazyLoading(HoldingsTableComponent))));
