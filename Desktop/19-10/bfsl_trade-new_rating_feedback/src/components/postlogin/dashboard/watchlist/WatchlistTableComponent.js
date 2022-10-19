import React, { useEffect, useMemo, useState, useRef } from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest, withStreaming } from '../../../../index'

import LangText, { getLangText } from '../../../../common/lang/LangText';
import { LazyLoading } from '../../../common/LazyLoadingHOC'

import { WATCHLIST } from '../../../../config/ServiceURLs'

import {
    CheckBoxIcon_Checked, CheckBoxIcon_UnChecked,
    HoldingsQtyIcon,
    MoreInfoIcon, RearrangeIcon,
} from '../../../common/FontIcons';
import {
    applyPaint, getDispSymbolName, checkEmpty,
    getColorCode, getWatchlistBaseUrl, AF_EventTriggered, sortByString, sortByInt, convertToUpperCase,
} from '../../../../common/CommonMethods';
import {
    STREAMING_MODULES, STREAMING_KEYS,
    ORDER_TYPES, TEXT_ORIENTATION, THEMES, AF_EVENT_NAMES, AF_EVENT_TYPES, SORT_TYPES, SEGMENTS,
} from '../../../../common/Constants';
import { gotoChartPopup, gotoQuote, gotoTrade, hideToaster, storeStreamingDatatoStore } from '../../../../common/Bridge'

import {
    storeSelectedWatchGroupResp, storeSearchSymWatchlistFlag,
    storeToastMsgProps, setDemoSymName
} from '../../../../state/actions/Actions'

function WatchlistTableComponent(props) {

    const MsfFetch = useFetch()

    const [symbolList, setSymbolList] = useState([])
    const [streamingDataList, setStreamingDataList] = useState([])
    const [streamingResp, setStreamingResp] = useState(null)
    const [selectedShowMoreIndex, setSelectedShowMoreIndex] = useState(null)
    const [dragStarted, setDragStarted] = useState(false)
    const [movingFromIndex, setMoveIndex] = useState('')
    const [movingToIndex, setMoveToIndex] = useState(false)
    // const [filterExist, setFilterlistexist] = useState(false)
    // const [direction_up, setDirectionUp] = useState(false)

    const arrangedList = useRef(null)
    const isSorting = useRef(false)

    // useEffect(() => {
    //     fetch('http://localhost:3000/LanguageContent.json')
    //         .then(response => response.json())
    //         .then(data => console.log("language",data));
    // }, [])

    useEffect(() => {
        storeStreamingDatatoStore(streamingDataList,props.previousGrpId)
    }, [props.previousGrpId])

    useEffect(() => {
        props.setDisableLazyLoad(true)
        props.setElementRowHeight(65)
        props.setScrollRef(document.getElementById('scrollTable'))
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.WATCHLIST);
    }, [])

    useEffect(() => {
        if (streamingResp && streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    useEffect(() => {
        addHoldingsDataToList()
    }, [props.symbolList,props.holdingsResp ])

    function addHoldingsDataToList() {
        let symResponseData = Object.assign([], props.symbolList)
        if (props.holdingsResp && props.holdingsResp .length) {
            symResponseData.map(function (item) {
                let totQty = 0
                props.holdingsResp .map(function (hItem) {
                    if(item.sym.excToken === hItem.sym.excToken)
                        totQty= parseInt(totQty) + parseInt(hItem.qty)
    
                })
                item.netQty = totQty
                // let hIndex = holdingResp.findIndex((hItem) => {
                //     return item.sym.excToken === hItem.sym.excToken
                // })
                
                // if (hIndex !== -1) {
                //     let totQty =  holdingResp[hIndex].qty
                //     item.netQty = parseInt(totQty) + parseInt(holdingResp[hIndex].qty)
                // }
                // else
                //     item.netQty = 0
                return item

            })
        }
        if (props.filterParams && props.filterParams.length) {
            symResponseData = showFilter(props.filterParams, symResponseData)
        }
        if (props.sortParams && props.sortParams.sortType && props.sortParams.sortType !== SORT_TYPES.NONE) {
            // if(props.sortParams.key=="dispSym"){
            if (props.sortParams.varType === "string") {
                let sortAsc = true
                if (props.sortParams.sortType === SORT_TYPES.DESC)
                    sortAsc = false
                symResponseData = sortByString(
                    sortAsc, symResponseData,
                    props.sortParams.key
                )
            }else{
                let sortAsc = true
                if (props.sortParams.sortType === SORT_TYPES.DESC)
                    sortAsc = false
                symResponseData = sortByInt(
                    sortAsc, symResponseData,
                    props.sortParams.key
                )

            }
            // }
        }
        setSymbolList(symResponseData)
        setStreamingDataList(props.symbolList)
        props.setOriginalList(symResponseData)
        // console.log('props.symbolList: ', typeof(props.holdingsResp), typeof(props.symbolList));
        setSelectedShowMoreIndex(null)
        streamingSubscription(props.symbolList)
    }

    useEffect(() => {
        if (props.reSetDeleteSyms) {
            clearSelectedDeleteStocks()
            props.reSetFlagCB && props.reSetFlagCB()
        }
    }, [props.reSetDeleteSyms])

    useEffect(() => {
        if (props.visibleList && props.visibleList.length && streamingDataList.length) {
            streamingDataList.map((item) => {
                let isSymVisible = props.visibleList.findIndex((i) => {
                    return i.sym.streamSym === item.sym.streamSym
                })
                if (isSymVisible !== -1) {
                    let newList = symbolList.map(row => {
                        if (row.sym.streamSym === item.sym.streamSym) {
                            // row = Object.assign({}, row, item);
                            row.ltp = item.ltp
                            row.chng = item.chng
                            row.chngPer = item.chngPer
                        }
                        return row;
                    })
                    setSymbolList(newList)
                }
            })
        }
    }, [props.visibleList])

    useEffect(() => {
        let sortParamArray = Object.keys(props.sortParams)
        if (sortParamArray && sortParamArray.length) {
            onSort(props.sortParams.varType, props.sortParams.key, props.sortParams.sortType)
        }
    }, [props.sortParams])

    useEffect(() => {
        if (props.filterParams) {
            showFilter(props.filterParams)
        }
    }, [props.filterParams])

    // useEffect(() => {
    //     props.getStreamdataList&&props.getStreamdataList(streamingDataList)
    // }, [streamingDataList])

    function streamingSubscription(symArrayList) {
        let symbols = symArrayList.map(l => l.sym)
        props.forceSubscribeLevel1(symbols, [STREAMING_KEYS.LTP, STREAMING_KEYS.CHANGE, STREAMING_KEYS.CHANGE_PER])
    }

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function setStreamingResptoSymbols(resp) {
        let { data } = resp;
        let newList = streamingDataList.map(row => {
            if (row.sym.streamSym === data.symbol) {
                row = Object.assign({}, row, applyPaint(row, data));
            }
            return row;
        })
        setStreamingDataList(newList)
        let isSymVisible = props.visibleList.findIndex((i) => {
            return i.sym.streamSym === data.symbol
        })
        if (isSymVisible !== -1) {
            let newSymList = symbolList.map(row => {
                if (row.sym.streamSym === data.symbol) {
                    row = Object.assign({}, row, applyPaint(row, data));
                }
                return row;
            })
            setSymbolList(newSymList)
        }
    }

    function setDeleteStock(selectedIndex) {
        let symList = Object.assign([], symbolList)
        let updatedList = symList.map((item, index) => {
            if (index === selectedIndex)
                item.delete_selected = !item.delete_selected

            return item
        })
        setSymbolList(updatedList)

        let selectedList = []
        symbolList.map((item) => {
            if (item.delete_selected)
                selectedList.push(item.sym)
        })
        props.onSetSelectedDeleteSymsCB && props.onSetSelectedDeleteSymsCB(selectedList)
    }

    function onDragStart() {
        setDragStarted(true)
        setSelectedShowMoreIndex(null)
    }

    function onDragEnd() {
        setMoveToIndex(null)
        setDragStarted(false)
    }

    function onDropRow(e, index) {
        let symList = [...symbolList];
        if (movingFromIndex !== index) {
            symList.splice(index, 0, symList.splice(movingFromIndex, 1)[0])
            arrangedList.current = symList
            let newArray = []
            symList.map((item) => {
                newArray.push(item.sym)
            })
            props.showWidgetLoader();
            let request = new MsfRequest();
            request.addToData({
                'wName': props.selectedWatchGroup.wName,
                "syms": newArray
            })
            MsfFetch.placeRequest(
                getWatchlistBaseUrl() + WATCHLIST.REARRAGE_SYMBOL,
                request,
                successRespCBRearrangeSymbols,
                errorRespCBRearrangeSymbols
            )
        }
    }

    function successRespCBRearrangeSymbols() {
        props.hideWidgetLoader();
        setSymbolList(arrangedList.current)
        let wObj = Object.assign({}, props.selectedWatchgroupResp)
        wObj[props.selectedWatchGroup.wName] = arrangedList.current
        props.storeSelectedWatchGroupResp(wObj)
        arrangedList.current = null
        props.resetSortIconsCB && props.resetSortIconsCB()
        hideToaster()
    }

    function errorRespCBRearrangeSymbols(error) {
        props.hideWidgetLoader();
        arrangedList.current = null
        props.storeToastMsgProps({
            show: true,
            message: error.message,
            error: true
        })
    }

    const onDragOver = (e, index) => {
        e.preventDefault();
        setMoveToIndex(index)
    }

    function onMouseDownDataRow(e) {
        e.stopPropagation();
    }

    function clearSelectedDeleteStocks() {
        let symList = Object.assign([], symbolList)
        let updatedList = symList.map((item) => {
            item.delete_selected = false

            return item
        })

        setSymbolList(updatedList)
    }

    function showMoreDetails(index) {
        if (index === selectedShowMoreIndex)
            setSelectedShowMoreIndex(null)
        else
            setSelectedShowMoreIndex(index)
        AF_EventTriggered(AF_EVENT_NAMES.WATCHLIST, AF_EVENT_TYPES.MORE,{"onClick":"moreButton"})
    }

    function onDeleteIndSym(symDetails) {
        let arr = []
        arr.push(symDetails.sym)
        props.onDeleteIndSymCB && props.onDeleteIndSymCB(arr)
        setSelectedShowMoreIndex(null)
    }

    function onSort(type, key1, sortType = null) {
        isSorting.current = true
        props.onSort && props.onSort(type, key1, sortType, streamingDataList)
    }

    // function onIconSort(type, key, sortType) {
    //     props.onSort && props.onSort(type, key, sortType, streamingDataList)
    // }

    // function getSortIconCB(column) {
    //     let sortOrder = props.sortFlag.filter((item) => item.column === column)
    //     if (sortOrder.length)
    //         return sortOrder[0].sortAsc
    //     return null
    // }

    function onMouseOut(index) {
        if (index !== selectedShowMoreIndex)
            setSelectedShowMoreIndex(null)
    }

    // function showSortDetails(){
    //     setShowSorting(!showSorting)
    //     setDirectionUp(!direction_up)
    // }

    function showFilter(filterList, list = streamingDataList) {
        let symDataList = Object.assign([], list)
        if (filterList.length) {

            let existHoldngFilter = filterList.findIndex((item) => {
                return item.name === "Holdings"
            })

            let existExchange = false
            filterList.map((item) => {
                if (item.name === "NSE" || item.name === "BSE" || item.name === "NFO")
                    existExchange = true
            })

            if (existExchange)
                symDataList = symDataList.filter((item) => {
                    let existExeExist = filterList.findIndex((eItem) => {
                        return eItem.name === item.sym.exc
                    })
                    if (existExeExist !== -1)
                        return item
                    return null
                })
            symDataList = symDataList.filter((item) => {
                if (existHoldngFilter !== -1) {
                    return item.netQty > 0
                }
                return item
            })
            props.getFilterList(symDataList)
            setSymbolList(symDataList)
        } else
            setSymbolList(list)

        return symDataList
    }
    return (
        useMemo(() => {
            return (
                <table className="watchlist-table">
                    <thead className="thead-scroller">
                        <tr >
                            <th className="reArrangeIconCol">

                            </th>
                            <th className={`firstChild width40`}>
                                <span className="cursor"
                                // onClick={() => onSort(SORT_DATATYPE.STRING, 'dispSym')}
                                >
                                    <LangText module="TABLE_HEADERS" name="SYMBOL" />
                                </span>
                                {/* <SortIcon colName="dispSym" 
                                    getSortIcon={getSortIconCB} 
                                    type={SORT_DATATYPE.STRING} 
                                    onIconSort={onIconSort} /> */}
                            </th>
                            <th className="width20">
                                <span className="cursor"
                                // onClick={() => onSort(SORT_DATATYPE.INT, 'chngPer')}
                                >
                                    <LangText module="TABLE_HEADERS" name="CHG_AND_PER" />
                                </span>
                                {/* <SortIcon 
                                    colName="chngPer" 
                                    getSortIcon={getSortIconCB}
                                    type={SORT_DATATYPE.INT}
                                    onIconSort={onIconSort} /> */}
                            </th>
                            <th className="width20">
                                <span className="cursor"
                                // onClick={() => onSort(SORT_DATATYPE.INT, 'ltp')}
                                >
                                    <LangText module="TABLE_HEADERS" name="LTP" />
                                </span>
                                {/* <SortIcon colName="ltp" 
                                    getSortIcon={getSortIconCB} 
                                    type={SORT_DATATYPE.INT} 
                                    onIconSort={onIconSort} /> */}
                            </th>
                            {/* <th className="width9">
                                {direction_up?
                                    <UpArrowIcon className="showMoreIcon cursor"
                                        onClick={showSortDetails}/>
                                    :
                                    <DownArrowIcon className="showMoreIcon cursor"
                                        onClick={showSortDetails}/> 
                                }
                            </th> */}
                            {/* <th className="width9"></th>
                            <th className="width9"></th> */}
                            {/* <th className="width3"></th> */}
                        </tr>
                    </thead>
                    <tbody id="scrollTable"
                        className={`tbody-scroller scroller_firefox 
                    ${dragStarted ? 'dragStarted' : ''}`}
                        onScroll={(e) => props.onScrollDiv(e)}
                    >
                        {/* {showSorting?
                            <div className="sorting-div">
                                <div className="row-div">
                                    <span className="label"><LangText module="TABLE_HEADERS" name="SYMBOL" /></span>
                                    <span className="sorticon"><SortIcon colName="dispSym" 
                                        getSortIcon={getSortIconCB} 
                                        type={SORT_DATATYPE.STRING} 
                                        onIconSort={onIconSort} /></span>
                                </div>
                                <div className="row-div">
                                    <span className="label">
                                        <LangText module="TABLE_HEADERS" name="CHG_AND_PER" /></span>
                                    <span className="sorticon"><SortIcon 
                                        colName="chngPer" 
                                        getSortIcon={getSortIconCB}
                                        type={SORT_DATATYPE.INT}
                                        onIconSort={onIconSort} /></span>
                                </div>
                                <div className="row-div">
                                    <span className="label"><LangText module="TABLE_HEADERS" name="LTP" /></span>
                                    <span className="sorticon"><SortIcon colName="ltp" 
                                        getSortIcon={getSortIconCB} 
                                        type={SORT_DATATYPE.INT} 
                                        onIconSort={onIconSort} /></span>
                                </div>
                            </div> :""
                        } */}
                        {
                            symbolList.length ?
                                symbolList.map((item, index) => {
                                    return (
                                        <tr key={index} id="demotour-watchlist" className={`${!dragStarted ?
                                            'watchlistDataRow' : ''} ${movingToIndex === index ? 'highlightDrop' : ''}`}
                                        onDrop={props.selectedWatchGroup.editable ?
                                            e => onDropRow(e, index) : null}
                                        onDragOver={(e) => onDragOver(e, index)}
                                        onDragEnd={(e) => onDragEnd(e)}
                                        onMouseOut={() => onMouseOut(index)}
                                        >
                                            <td className="reArrangeIconCol">
                                                {
                                                    !props.showDeleteCheckbox ?
                                                        (
                                                            props.selectedWatchGroup.editable ?
                                                                <span draggable="true"
                                                                    onDrag={() => setMoveIndex(index)}
                                                                    onMouseDown={(e) => onMouseDownDataRow(e, item)}
                                                                    onDragStart={(e) => onDragStart(e)}
                                                                >
                                                                    <RearrangeIcon />
                                                                </span>
                                                                : null
                                                        )
                                                        :
                                                        (
                                                            item.delete_selected ?
                                                                <CheckBoxIcon_Checked
                                                                    onClick={() => setDeleteStock(index)} />
                                                                :
                                                                <CheckBoxIcon_UnChecked
                                                                    onClick={() => setDeleteStock(index)} />
                                                        )
                                                }

                                            </td>
                                            <td className={`firstChild width40 ${index === 0 ?
                                                "high-first-sym" : ""} `}>
                                                <div className="symName-column">
                                                    <div className="primary">
                                                        <div className="baseSym primary-symName quote-click text-nowrap"
                                                            onClick={() => gotoQuote(item)}
                                                            title={getDispSymbolName(item).primaryName}
                                                        >
                                                            {getDispSymbolName(item).primaryName}

                                                        </div>
                                                    </div>
                                                    <div className="symName text-nowrap" >
                                                        {(convertToUpperCase(item.sym.asset) === SEGMENTS.OPTION ||
                                                          convertToUpperCase(item.sym.asset) === SEGMENTS.FUTURE) ?
                                                            <span className="exc">
                                                                {getDispSymbolName(item).excName}</span>
                                                            : <span className="exc">
                                                                {item.sym.exc}</span>}
                                                        {item.netQty ?
                                                            <div className="watchlist-holdings">
                                                                <span className="holdings-icon" >
                                                                    <HoldingsQtyIcon />
                                                                </span>
                                                                <span>
                                                                    {item.netQty}</span>
                                                            </div>
                                                            : null}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`width20 hideOnHover change ${getColorCode(item.chng)}`}>
                                                <span className={`${item.chngClass}`}>
                                                    {checkEmpty(item.chng)}
                                                    ({checkEmpty(item.chngPer)}%)</span>
                                            </td>
                                            <td className={`width20 hideOnHover ${item.ltp ? 'ltpVal' : ''}`}>
                                                <span className={`${item.ltpClass}`}>{checkEmpty(item.ltp)}</span>
                                            </td>
                                            <td className="showOnHover">
                                                <div>
                                                    <div className="demo-showIcons">
                                                        <button className="buy-btn2"
                                                            title={getLangText("BUY", TEXT_ORIENTATION.PASCALCASE)}
                                                            onClick={() => gotoTrade(item, ORDER_TYPES.BUY)}>B</button>
                                                        <button className="sell-btn2"
                                                            title={getLangText("SELL", TEXT_ORIENTATION.PASCALCASE)}
                                                            onClick={() =>
                                                                gotoTrade(item, ORDER_TYPES.SELL)}>S</button>
                                                    </div>
                                                    <button className="iconBtn"
                                                        title={getLangText("QUOTE", TEXT_ORIENTATION.PASCALCASE)}
                                                        onClick={() => gotoQuote(item)}>
                                                        {
                                                            props.selectedTheme === THEMES.LIGHT ?
                                                                <img src="assets/images/dashboard/quote.svg" alt="" />
                                                                :
                                                                <img src="assets/images/dark/dashboard/quote.svg"
                                                                    alt="" />
                                                        }

                                                    </button>
                                                    <button className="iconBtn demo-chart"
                                                        title={getLangText("CHARTSS", TEXT_ORIENTATION.PASCALCASE)}
                                                        onClick={() => gotoChartPopup(item)}>
                                                        {
                                                            props.selectedTheme === THEMES.LIGHT ?
                                                                <img src="assets/images/dashboard/line_chart.svg"
                                                                    alt="" />
                                                                :
                                                                <img src="assets/images/dark/dashboard/line_chart.svg"
                                                                    alt="" />
                                                        }

                                                    </button>
                                                    <button className="iconBtn moreBtn"
                                                        title={getLangText("MOREE", TEXT_ORIENTATION.PASCALCASE)}
                                                        onClick={() => showMoreDetails(index)}
                                                    >
                                                        <MoreInfoIcon />
                                                    </button>
                                                    {selectedShowMoreIndex === index ?
                                                        <div className="moreOptDropdown">
                                                            <div className="triangleTip"></div>

                                                            <span
                                                                className={!props.selectedWatchGroup.editable ?
                                                                    'disabled' : ''}
                                                                onClick={props.selectedWatchGroup.editable ?
                                                                    () => onDeleteIndSym(item) : ''}
                                                            >
                                                                {props.selectedTheme === THEMES.LIGHT ?
                                                                    <img
                                                                        src="assets/images/dashboard/delete.svg"
                                                                        alt="" />
                                                                    :

                                                                    <img
                                                                        src=
                                                                            "assets/images/dark/dashboard/delete.svg"
                                                                        alt="" />
                                                                }

                                                                <span className="optText">
                                                                    <LangText module="BUTTONS" name="DELETE"
                                                                        orientation=
                                                                            {TEXT_ORIENTATION.LOWERCASE} />
                                                                </span>
                                                            </span>
                                                        </div>
                                                        : null
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                                :
                                <tr className="errorRow">
                                    {
                                        (!props.pendingReq && props.errorMsg) ?
                                            <td className="colspan">
                                                {props.errorMsg}
                                            </td>
                                            :
                                            (
                                                !props.pendingReq ?
                                                    <td className="colspan">
                                                        <div className="emptyGroupDiv">
                                                            <img
                                                                src="assets/images/dashboard/empty_watchlist.svg"
                                                                alt="" />
                                                            <span className="empWatchlist">
                                                                <LangText module="WATCHLIST"
                                                                    name="EMPTY_WATCHLIST" /></span>
                                                            <span className="addSymTxt">
                                                                <LangText module="WATCHLIST"
                                                                    name="ADD_SYMBOLS_TXT" /></span>
                                                            <span>
                                                                {
                                                                    props.showAddBtn ?
                                                                        <button className="theme-btn2 addSymBtn"

                                                                            onClick={() =>
                                                                                props.storeSearchSymWatchlistFlag(true)}
                                                                        >
                                                                            <LangText module="BUTTONS"
                                                                                name="ADD_SYMBOLS" />
                                                                        </button>
                                                                        : null
                                                                }
                                                            </span>
                                                        </div>
                                                    </td>
                                                    : null
                                            )
                                    }

                                </tr>
                        }
                    </tbody>
                </table >
            )
        }, [props.pendingReq, props.errorMsg, props.selectedWatchGroup, props.showDeleteCheckbox,
            props.showAddBtn, symbolList, movingToIndex, selectedShowMoreIndex, dragStarted])
    )
}

const mapStateToProps = ({ settings, watchlist, holdings }) => {
    return {
        selectedWatchgroupResp: watchlist.selectedWatchgroupResp,
        selectedTheme: settings.selectedTheme,
        holdingsResp: holdings.holdingsResp,
        sortParams: watchlist.sortParams,
        filterParams: watchlist.filterParams
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeSelectedWatchGroupResp: (s) => { dispatch(storeSelectedWatchGroupResp(s)) },
        storeSearchSymWatchlistFlag: (s) => { dispatch(storeSearchSymWatchlistFlag(s)) },
        storeToastMsgProps: (s) => { dispatch(storeToastMsgProps(s)) },
        setDemoSymName: (s) => { dispatch(setDemoSymName(s)) }

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LazyLoading(withStreaming(WatchlistTableComponent)));

