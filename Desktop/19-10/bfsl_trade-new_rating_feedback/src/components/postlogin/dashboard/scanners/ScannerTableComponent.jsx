import React, {useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux';
import {
    checkEmpty, getColorCode, sortByString, sortByInt, sortFlagFunc,
    getBaseURL,
    convertCommaSeparated
} from '../../../../common/CommonMethods';
import { DASHBOARD_WIDGET_MODE, ORDER_TYPES, QUOTE_DIALOGS, SORT_DATATYPE, 
    SORT_TYPES, THEMES } from '../../../../common/Constants';
import { WidgetLoader } from '../../../common/WidgetLoaderComponent';
import { showAppDialog,storeQuoteDialogDetails, storeSelectedDashboardWidget } from '../../../../state/actions/Actions';
import { MsfRequest,useFetch } from '../../../..';
import LangText from '../../../../common/lang/LangText';
import { DownArrowIcon, SortIcon, UpArrowIcon } from '../../../common/FontIcons';
import { gotoChartPopup, gotoQuote, gotoTrade, regetWatchGroupSymbolsCB } from '../../../../common/Bridge';
import { WATCHLIST } from '../../../../config/ServiceURLs';
import LazyLoading from '../../../common/LazyLoadingHOC';

const ScannerTableComponent = (props) => {
    const MsfFetch = useFetch()

    const selectedAddSym = useRef(null)
    let isPendingRequest = useRef(false)

    const [selectedShowMoreIndex, setSelectedShowMoreIndex] = useState(null)
    const [list, setList] = useState([])

    const [sortAsc, setSortAsc] = useState(true)
    const [sortFlag, setSortFlag] = useState([
        { column: "dispSym", sortAsc: null },
        { column: "ltp", sortAsc: null },
        { column: "chng", sortAsc: null },
        { column: "chngPer", sortAsc: null }
    ])

    //  Lazyloading code starts here

    useEffect(() => {
        props.setScrollLimit(50)
        props.setScrollRef(document.getElementById('scanner-table'))
    }, [])

    useEffect(()=>{
        props.setOriginalList(props.scansList, 50)
    }, [props.scansList])

    useEffect(() => {
        setList(props.lazyList)
    }, [props.lazyList])

    // Lazyloading code ends here

    function onSortCB(type, key1, sortType) {
        if (type === "string")
            onSortByStringCB(key1, sortType)
        else
            onSortByIntCB(key1, sortType)
    }

    function onIconSort(type, key, sortType) {
        onSortCB(type, key, sortType)
    }

    function onSortByStringCB(key1, sortType) {
        let ascSort = sortAsc
        if (sortType) {
            if (sortType === SORT_TYPES.ASC) {
                setSortAsc(true)
                ascSort = true
            }
            else {
                setSortAsc(false)
                ascSort = false
            }
        } else {
            ascSort = !ascSort
            setSortAsc(!sortAsc)
        }

        let sortedSymList = sortByString(ascSort, list, key1)
        if (list.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1)
            setSortFlag(updatedSortFlag)
        }
        props.setScansList(sortedSymList)
    }

    function onSortByIntCB(key1, sortType) {
        let ascSort = sortAsc
        if (sortType) {
            if (sortType === SORT_TYPES.ASC) {
                setSortAsc(true)
                ascSort = true
            }
            else {
                setSortAsc(false)
                ascSort = false
            }
        } else {
            ascSort = !ascSort
            setSortAsc(!sortAsc)
        }

        let sortedSymList = sortByInt(ascSort, list, key1)
        if (list.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1)
            setSortFlag(updatedSortFlag)
        }
        props.setScansList(sortedSymList)
    }

    function getSortIconCB(column) {
        let sortOrder = sortFlag.filter((item) => item.column === column)
        if (sortOrder.length)
            return sortOrder[0].sortAsc

        return null
    }
    function showMoreDetails(index) {
        if (index === selectedShowMoreIndex)
            setSelectedShowMoreIndex(null)
        else
            setSelectedShowMoreIndex(index)
    }

    function gotoAddWatchList(symData) {
        selectedAddSym.current = symData.sym
        props.storeQuoteDialogDetails({
            dialogName: QUOTE_DIALOGS.SELECT_WATCHGROUP,
            parentCB: onSaveSymToWatchGroup
        })
    }

    function onSaveSymToWatchGroup(selectedWatchGroup) {
        if (!isPendingRequest.current) {
            isPendingRequest.current = true
            props.showWidgetLoader();
            let request = new MsfRequest();
            let symList = []
            symList.push(selectedAddSym.current)
            request.addToData({
                "wName": selectedWatchGroup.wName,
                'syms': symList
            })
            request.setEcho(selectedWatchGroup.wName)
            MsfFetch.placeRequest(
                getBaseURL() + WATCHLIST.ADD_SYMBOLS,
                request,
                successRespCBAddSymbol,
                errorRespCBAddSymbol
            )
        }
    }

    function successRespCBAddSymbol(response) {
        isPendingRequest.current = false
        props.hideWidgetLoader();
        props.showAppDialog({
            message: response.infoMsg,
            show: true,
            closeCB: () => regetWatchGroupSymbolsCB(response.echo)
        })
    }

    function errorRespCBAddSymbol(error) {
        isPendingRequest.current = false
        props.hideWidgetLoader();
        props.showAppDialog({
            message: error.message,
            show: true
        })
    }

    function gotoAddWatchListCB(symData) {
        setSelectedShowMoreIndex(null)
        gotoAddWatchList(symData)
    }
    function gotoOrderpad(item,type) {
        props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT)
        gotoTrade(item,type)
    }

    return (
        <div className="scanner-baseTable">
            <table className="scanner-table"  id = "scanner-table"
                onScroll={(e) => props.onScrollDiv(e)}>
                {
                    list.length ?
                        <thead className="thead-scroller">
                            <tr className="scanner-theadrow">
                                <th className="firstChild width15">
                                    <span className="cursor" onClick={() => onSortCB(SORT_DATATYPE.STRING, 'dispSym')}>
                                        <LangText module="TABLE_HEADERS" name="SYMBOL" />
                                    </span>
                                    <SortIcon colName="dispSym" getSortIcon={getSortIconCB} type={SORT_DATATYPE.STRING}
                                        onIconSort={onIconSort} />
                                </th>
                                <th className="width10">
                                    <span className="cursor" onClick={() => onSortCB(SORT_DATATYPE.INT, 'ltp')}>
                                        <LangText module="TABLE_HEADERS" name="LTP" />
                                    </span>
                                    <SortIcon colName="ltp" getSortIcon={getSortIconCB} type={SORT_DATATYPE.INT}
                                        onIconSort={onIconSort} />
                                </th>
                                <th className="width7">
                                    <span className="cursor" onClick={() => onSortCB(SORT_DATATYPE.INT, 'chng')}>
                                        <LangText module="TABLE_HEADERS" name="CHANGE" />
                                    </span>
                                    <SortIcon colName="chng" getSortIcon={getSortIconCB} type={SORT_DATATYPE.INT}
                                        onIconSort={onIconSort} />
                                </th>
                                <th className="width9">
                                    <span className="cursor" onClick={() => onSortCB(SORT_DATATYPE.INT, 'chngPer')}>
                                        <LangText module="TABLE_HEADERS" name="CHANGE_PER" />
                                    </span>
                                    <SortIcon colName="chngPer" getSortIcon={getSortIconCB} type={SORT_DATATYPE.INT}
                                        onIconSort={onIconSort} />
                                </th>
                                {props.multiIndicatorStatus && props.selectedIndicator.indicatorName !== "LAST" ?
                                    <th className="width10">{props.selectedIndicator.dispName}</th>
                                    : null}
                                {props.multiIndicatorStatus && props.selectedSecondIndicator.indicatorName !== "LAST" ?
                                    <th className="width10">{props.selectedSecondIndicator.dispName}
                                    </th>
                                    : null}
                                {props.dynamicColumns && props.dynamicColumns.length &&
                                props.dynamicColumns.map((col, index) => {
                                    return (
                                        <th key={index} className="width12">
                                            {/* {col.dispName} */}
                                            <LangText name = {col.langKey}/>
                                        </th>
                                    )
                                })}
                                <th className="width2 iconCol">
                                </th>
                            </tr>
                        </thead>
                        :
                        null
                }
                <tbody className="tbody-scroller scroller_firefox">
                    {
                        list.length ? list.map((item, index) => {
                            return (
                                <>
                                    <tr key={index}
                                        className={selectedShowMoreIndex === index ? 'noBorder' : ''}>
                                        <td className="firstChild width15">
                                            <div className="symName-column">
                                                <span className="baseSym text-nowrap quote-click"
                                                    title={item.dispSym}
                                                    onClick={() => gotoQuote(item,true)}
                                                >
                                                    {item.dispSym}
                                                </span>
                                                <span className="exc">{item.sym.exc}</span>
                                            </div>
                                        </td>
                                        <td className="width10">
                                            <span>{checkEmpty(item.ltp)}</span>
                                        </td>
                                        <td className="width7">
                                            <span className={getColorCode(item.chng)}>{checkEmpty(item.chng)}</span>
                                        </td>
                                        <td className="width9">
                                            <span className={getColorCode(item.chngPer)}>{checkEmpty(item.chngPer)}
                                            </span>
                                        </td>
                                        {props.multiIndicatorStatus &&
                                                props.selectedIndicator.indicatorName !== "LAST" ?
                                            <td className="width10">
                                                {convertCommaSeparated(item[props.selectedIndicator.indicatorName])}
                                            </td> : null}
                                        {props.multiIndicatorStatus &&
                                                props.selectedSecondIndicator.indicatorName !== "LAST" ?
                                            <td className="width10"> 
                                                {
                                                    convertCommaSeparated(
                                                        item[props.selectedSecondIndicator.indicatorName])
                                                }
                                            </td> : null}
                                        {props.dynamicColumns && props.dynamicColumns.length &&
                                            props.dynamicColumns.map((col, dataindex) => {
                                                return (
                                                    <td key={dataindex} className="width12">
                                                        {convertCommaSeparated(item[col['key']])}
                                                    </td>
                                                )
                                            })}
                                        <td className="width2">
                                            {
                                                selectedShowMoreIndex === index ?
                                                    <UpArrowIcon className="showMoreIcon cursor"
                                                        onClick={() => showMoreDetails('')}
                                                    />
                                                    :
                                                    <DownArrowIcon className="showMoreIcon cursor"
                                                        onClick={() => showMoreDetails(index)}
                                                    /> 
                                            }
                                        </td>  
                                    </tr>
                                    { selectedShowMoreIndex === index ?
                                        <div className="moreDetails">
                                            <button onClick={() => gotoChartPopup(item)}>
                                                {props.selectedTheme.theme === THEMES.LIGHT ?
                                                    <img src=
                                                        "assets/images/dashboard/line_chart.svg" 
                                                    alt="" />
                                                    :
                                                    <img 
                                                        src="assets/images/dark/dashboard/line_chart.svg"
                                                        alt="" />
                                                }
                                                <LangText module="BUTTONS" name="CHART" />
                                            </button>
                                            <button className="tradeBtn"
                                                onClick={() => gotoOrderpad(item, ORDER_TYPES.BUY)}>
                                                {
                                                    props.selectedTheme.theme === THEMES.LIGHT ?
                                                        <img src=
                                                            "assets/images/dashboard/buy_more.svg" 
                                                        alt="" 
                                                        />
                                                        :
                                                        <img src=
                                                            "assets/images/dark/dashboard/buy_more.svg" 
                                                        alt="" />
                                                }

                                                <LangText name="BUY_BTN" />
                                            </button>
                                            <button className="tradeBtn"
                                                onClick={() => gotoOrderpad(item, ORDER_TYPES.SELL)}>
                                                {
                                                    props.selectedTheme.theme === THEMES.LIGHT ?
                                                        <img src="assets/images/dashboard/sell_more.svg" 
                                                            alt="" 
                                                        />
                                                        :
                                                        <img 
                                                            src="assets/images/dark/dashboard/sell_more.svg"
                                                            alt=""
                                                        />
                                                }
                                                <LangText name="SELL_BTN" />
                                            </button>
                                            <button className="addWatchlist"
                                                onClick={() => gotoAddWatchListCB(item)}>
                                                {props.selectedTheme.theme === THEMES.LIGHT ?
                                                    <img 
                                                        src="assets/images/dashboard/add_watchlist.svg" 
                                                        alt="" 
                                                    />
                                                    :
                                                    <img 
                                                        src="assets/images/dark/dashboard/add_watchlist.svg"
                                                        alt="" 
                                                    />
                                                }

                                                <LangText module="BUTTONS" name="ADD_WATCHLIST" />
                                            </button>
                                        </div>
                                        : null
                                    }
                                </>
                            )
                        })
                            :props.errorMessage?
                                <tr className="errorRow">
                                    <td className="colspan"> {props.errorMessage}</td>
                                </tr>:
                                props.noScannerData?
                                    <tr className="errorRow">
                                        <td className="colspan">
                                            <LangText module="MESSAGES" name="NO_DATA"></LangText></td>
                                    </tr>:                                    
                                    null
                    }
                </tbody>
            </table>
        </div>
       
    )
}
const mapStateToProps = ({ scanner,settings,dashboard}) => {
    return {
        selectedMenu: scanner.selectedMenu,
        selectedTheme: settings.selectedTheme,
        selectedWidgetMode: dashboard.selectedWidgetMode,
       
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeQuoteDialogDetails: (s) => { dispatch(storeQuoteDialogDetails(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) }
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(WidgetLoader(LazyLoading(ScannerTableComponent)))