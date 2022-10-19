import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../../../index'

import OrderBookTableComponent from "./OrderBookTableComponent";
import TradeBookTableComponent from "./TradeBookTableComponent";
import SelectInputComponent from "../../../../common/SelectInputComponent";
import InputComponent from '../../../../common/InputComponent';
import DateRangePicker from '../../../../common/datePicker/DateRangePickerComponent'

import { TRADE_GUEST } from "../../../../../config/ServiceURLs";
import {
    moveToOrderMenu, storeOrderstatusFilterVal,
    storeRegetOrderBookData, storeSelectedDashboardWidget
} from "../../../../../state/actions/Actions";
import { MaximizeIcon, MinimizeIcon, SearchIcon } from '../../../../common/FontIcons'

import {
    DASHBOARD_WIDGET_MODE, DATE_FORMATS,
    ORDERS_SEGMENT_LIST, ORDERS_STATUS_LIST, ORDER_STATUS_TAB
} from "../../../../../common/Constants";
import {
    convertCommaSeparated, getBaseURL, getDecimal_Precision,
    replaceComma, getFormatedDate
} from "../../../../../common/CommonMethods";
import LangText from "../../../../../common/lang/LangText";

function OrderBookComponent(props) {

    const MsfFetch = useFetch()

    const [orderStatusList] = useState(ORDERS_STATUS_LIST)
    const [orderSegmentList] = useState(ORDERS_SEGMENT_LIST)
    const [orderStatus, setOrderStatus] =
        useState(props.orderStatusFilterVal.status ? props.orderStatusFilterVal.status : "")
    const [orderSegment, setOrderSegment] =
        useState(props.orderStatusFilterVal.segment ? props.orderStatusFilterVal.segment : "")
    const [orderBookList, setOrderBookList] = useState([])
    const [tradeBookList, setTradeBookList] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    const [selectedTab, setSelectedTab] = useState(ORDER_STATUS_TAB.ORDERBOOK)
    const [searchValue, setSearchValue] = useState('')
    const [showInputsearch, setshowInputSearch] = useState(false)
    const isPendingRequest = useRef(false)
    const searchInputRef = useRef(null)
    const [tradeSegment, setTradeSegment] = useState(ORDERS_SEGMENT_LIST[0])
    const [showMore, setShowMore] = useState(false)
    const [startDate, setStartDate] = useState(getFormatedDate().formatedDate)
    const [endDate, setEndDate] = useState(getFormatedDate().formatedDate)

    useEffect(() => {
        props.storeOrderstatusFilterVal({
            status: orderStatus,
            segment: orderSegment
        })
        if (!props.orderMenu.showOrderMenu) {
            getOrderBook()
        }
    }, [orderStatus, orderSegment])

    useEffect(() => {
        if (props.orderMenu.showOrderMenu) {
            props.moveToOrderMenu({
                filterOption: null,
                showOrderMenu: false
            })
            if (selectedTab === ORDER_STATUS_TAB.ORDERBOOK)
                getOrderBook()
            else
                setSelectedTab(ORDER_STATUS_TAB.ORDERBOOK)
        }
    }, [props.orderMenu])

    useEffect(() => {
        if (selectedTab === ORDER_STATUS_TAB.TRADEBOOK)
            getTradeBook()
    }, [tradeSegment])

    useEffect(() => {
        if (props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.ORDER_VIEW)
            setShowMore(true)
        else
            setShowMore(false)
    }, [props.selectedWidgetMode])

    useEffect(() => {
        if (showInputsearch)
            if (searchInputRef.current)
                searchInputRef.current.focus()
    }, [showInputsearch])

    useEffect(() => {
        if (props.regetOrderBook) {
            getOrderBook()
            props.storeRegetOrderBookData()
        }
    }, [props.regetOrderBook])

    function onSelectedSegment(item) {
        setOrderSegment(item)
    }

    function onSelectTradeSegment(item) {
        setTradeSegment(item)
    }

    function onSelectedStatus(item) {
        setOrderStatus(item);
    }

    function getOrderBook() {
        setTradeBookList([])
        setErrorMsg(null)
        let request = new MsfRequest();
        isPendingRequest.current = true
        props.showWidgetLoader()
        request.addToData({
            filters: [
                //,
                { key: "tab", value: orderStatus.key },
                { key: "actualExc", value: "all" },
                { key: "ordAction", value: "all" },
                { key: "segment", value: orderSegment.key }
            ]
        })
        // request.setEcho(status.key)
        // reqStatus.current = status.key
        MsfFetch.placeRequest(
            getBaseURL() + TRADE_GUEST.GET_ORDER_BOOK,
            request,
            successRespCBGetOrderBook,
            errorRespCBGetOrderBook
        )
    }

    function successRespCBGetOrderBook(response) {
        // if (response.echo === reqStatus.current) {
        isPendingRequest.current = false
        let symbolList = response.data.orders
        symbolList = symbolList.map((item) => {
            item.ordValue = convertCommaSeparated(((parseInt(replaceComma(item.qty)) *
                parseInt(item.sym.multiplier)) *
                parseFloat(replaceComma(item.avgPrice))).toString(), getDecimal_Precision(item.sym.exc))
            return item
        })

        setOrderBookList(symbolList)
        // }
        setErrorMsg("")
        props.hideWidgetLoader()
    }

    function errorRespCBGetOrderBook(error) {
        isPendingRequest.current = false
        setOrderBookList([])
        setErrorMsg(error.message)
        props.hideWidgetLoader()
    }

    function getTradeBook(from = startDate, to = endDate) {
        setOrderBookList([])
        setErrorMsg(null)
        let request = new MsfRequest();
        isPendingRequest.current = true
        props.showWidgetLoader()
        request.addToData({
            filters: [
                { key: "segment", value: tradeSegment.key },
                {
                    "value": "all",
                    "key": "actualExc"
                },
                {
                    "value": "all",
                    "key": "ordAction"
                },
                {
                    "value": {
                        "from": getFormatedDate(from, 0, DATE_FORMATS.DDMMYYYY, true).stringDate,
                        "to": getFormatedDate(to, 0, DATE_FORMATS.DDMMYYYY, true).stringDate
                    },
                    "key": "ordDate"
                },
            ]
        })
        MsfFetch.placeRequest(
            getBaseURL() + TRADE_GUEST.GET_TRADE_BOOK,
            request,
            successRespCBGetTradeBook,
            errorRespCBGetTradeBook
        )
    }

    function successRespCBGetTradeBook(response) {
        // if (response.echo === reqStatus.current) {
        isPendingRequest.current = false
        let symbolLists = response.data.trades
        setTradeBookList(symbolLists)
        // }
        setErrorMsg("")
        props.hideWidgetLoader()
    }

    function errorRespCBGetTradeBook(error) {
        isPendingRequest.current = false
        setTradeBookList([])
        setErrorMsg(error.message)
        props.hideWidgetLoader()
    }

    function getSelectedTab(currentselectedtab) {
        setSelectedTab(currentselectedtab);
        if (currentselectedtab === ORDER_STATUS_TAB.ORDERBOOK)
            getOrderBook()
        else
            getTradeBook()
    }

    function showSearchField() {
        if (showInputsearch === true) {
            setSearchValue('')
        }
        setshowInputSearch(!showInputsearch)
    }

    function onChangeSearchVal(e) {
        let currVal = e.target.value;
        setSearchValue(currVal);
    }

    function onClickExpand() {
        if (showMore)
            props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.ORDER_WITH_QUOTE)
        else
            props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.ORDER_VIEW)

        setShowMore(!showMore)
    }

    function onSelectDate(date) {
        setStartDate(date.startDate)
        setEndDate(date.endDate)
        getTradeBook(date.startDate, date.endDate)
    }

    function onBlurSearchInput() {
        if (!searchValue.length)
            setshowInputSearch(false)
    }

    return (
        <>
            <div className="dashboardOrder_container">
                <div className="dashboardOrder-container-left">
                    <span
                        className={`dashboard-orderbook cursor
                         ${selectedTab === ORDER_STATUS_TAB.ORDERBOOK ? 'selected' : ''}`}
                        onClick={() => { getSelectedTab(ORDER_STATUS_TAB.ORDERBOOK) }}
                    >
                        <LangText module="ORDER_STATUS_HEADER" name="ORDER_BOOK" />
                    </span>
                    <span
                        className={`dashboard-tradebook cursor 
                        ${selectedTab === ORDER_STATUS_TAB.TRADEBOOK ? 'selected' : ''}`}
                        onClick={() => { getSelectedTab(ORDER_STATUS_TAB.TRADEBOOK) }}
                    ><LangText module="ORDER_STATUS_HEADER" name="TRADE_BOOK" />
                    </span>
                </div>
                <div className="dashboarOrder-container-right">
                    {

                        selectedTab === ORDER_STATUS_TAB.ORDERBOOK ?
                            <>
                                <div className="orderstatus-dropdown">
                                    <SelectInputComponent optionList={orderStatusList}
                                        selectedOption={orderStatus.name}
                                        onSelectValueCB={onSelectedStatus}
                                        value="name"
                                        preSelect={true}
                                        hasLangageDependent = {true}
                                    />
                                </div>
                                <div className="segmentlist-dropdown">
                                    <SelectInputComponent optionList={orderSegmentList}
                                        selectedOption={orderSegment.name}
                                        value="name"
                                        onSelectValueCB={onSelectedSegment}
                                        preSelect={true}
                                        hasLangageDependent = {true}
                                    />
                                </div>
                            </>
                            :
                            <>
                                <div className="trade-searchbox-container">
                                    <SearchIcon onClick={showSearchField}
                                        className="trade-status-search cursor" />
                                    {
                                        showInputsearch === true ?
                                            <InputComponent
                                                className="searchInput"
                                                ref={searchInputRef}
                                                onChange={onChangeSearchVal}
                                                value={searchValue}
                                                autoComplete="off"
                                                onBlur={onBlurSearchInput}
                                            />
                                            : null
                                    }
                                </div>
                                <DateRangePicker parentCB={onSelectDate} startDate={startDate} toDate={endDate} />
                                <div className="segmentlist-dropdown">
                                    <SelectInputComponent optionList={orderSegmentList}
                                        selectedOption={tradeSegment.name}
                                        value="name"
                                        onSelectValueCB={onSelectTradeSegment}
                                        preSelect={true}
                                        hasLangageDependent = {true}
                                        
                                    />
                                </div>
                            </>
                    }
                    {
                        props.selectedWidgetMode !== DASHBOARD_WIDGET_MODE.DEFAULT ?
                            (
                                showMore ?
                                    <MinimizeIcon className="showMoreIcon"
                                        onClick={onClickExpand}
                                    />
                                    :
                                    <MaximizeIcon className="showMoreIcon"
                                        onClick={onClickExpand}
                                    />
                            )
                            : null
                    }
                </div>
            </div>
            {
                (selectedTab === ORDER_STATUS_TAB.ORDERBOOK) ?
                    <OrderBookTableComponent
                        list={orderBookList}
                        errorMsg={errorMsg}
                        pendingReq={!!isPendingRequest.current}
                        regetOrderBookCB={getOrderBook}
                    />
                    :
                    <TradeBookTableComponent
                        list={tradeBookList}
                        searchValue={searchValue}
                        errorMsg={errorMsg}
                        pendingReq={!!isPendingRequest.current}
                    />
            }

        </>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeOrderstatusFilterVal: (s) => { dispatch(storeOrderstatusFilterVal(s)) },
        moveToOrderMenu: (s) => { dispatch(moveToOrderMenu(s)) },
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) },
        storeRegetOrderBookData: (s) => { dispatch(storeRegetOrderBookData(s)) }
    };
};

const mapStateToProps = ({ order, dashboard }) => {
    return {
        orderStatusFilterVal: order.orderStatusfilterVal,
        orderMenu: order.orderMenu,
        selectedWidgetMode: dashboard.selectedWidgetMode,
        regetOrderBook: order.regetOrderBook
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderBookComponent);