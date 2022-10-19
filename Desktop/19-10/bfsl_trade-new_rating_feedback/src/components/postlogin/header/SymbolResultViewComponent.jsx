import React, { useEffect, useState } from 'react'

import { LazyLoading } from '../../common/LazyLoadingHOC'

import {
    checkEmpty, getColorCode, applyPaint, getDispSymbolNameInSearch,
    convertToUpperCase, getInstrumentTypeList
} from '../../../common/CommonMethods'
import {
    ORDER_TYPES, SEGMENTS, STREAMING_KEYS, STREAMING_MODULES, SYMBOL_RESULT_HEADER_ARRAY,
    TEXT_ORIENTATION
} from '../../../common/Constants'
import { AddSymIcon, Checkbox_sel } from '../../common/FontIcons'
import LangText, { getLangText } from '../../../common/lang/LangText'
// import { getInstrumentTypeList } from '../../../common/Bridge'
import { withStreaming } from '../../../index'
// import { getInstrumentTypeName } from '../../../common/Bridge'

function SymbolResultViewComponent(props) {

    let { symbolList, errorMsg, newWatchListName, watchGroupLength, showRecentSearch, showDropdown,searchValue} = props

    const [listArray, setListArray] = useState([])
    const [initlistArray, setinitListArray] = useState([])

    const [showStockError, setStockError] = useState(null)
    const [stockFilter, setStockFilter] = useState(false)
    const [showStockHeader] = useState(SYMBOL_RESULT_HEADER_ARRAY)
    const [selectedMenu, setSelectedMenu] = useState(SYMBOL_RESULT_HEADER_ARRAY[0].name)
    const [streamingResp, setStreamingResp] = useState(null)

    useEffect(() => {
        props.setScrollLimit(30)
        props.setElementRowHeight(65)

        props.setScrollRef(document.getElementById('searchScrollDiv'))
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.SYMBOL_SEARCH);

    }, [])

    useEffect(() => {
        if (streamingResp && streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    useEffect(() => {
        if (props.visibleList) {
            streamingSubscription(props.visibleList)
        }
    }, [props.visibleList])

    useEffect(() => {
        if (showRecentSearch) {
            setListArray(symbolList)

            props.setDisableScrollFlag(true)
        }
        else {
            props.setOriginalList(symbolList)
            props.setDisableScrollFlag(false)
        }

    }, [showRecentSearch, symbolList, showDropdown])

    useEffect(() => {
        setinitListArray(symbolList)
    }, [symbolList])

    useEffect(() => {
        if (props.lazyList && !showRecentSearch) {
            setListArray(props.lazyList)
        }
    }, [props.lazyList, showRecentSearch])

    useEffect(()=>{
        if(searchValue && stockFilter){
            setSelectedMenu(SYMBOL_RESULT_HEADER_ARRAY[0].name)

        }

    },[searchValue])

    function onClickStock(stock) {
        let NewListArray = getInstrumentTypeList(initlistArray, stock.name)
        console.log("NewListArray", NewListArray)
        setSelectedMenu(stock.name)
        setStockFilter(true)
        if (!NewListArray.length)
            setStockError(getLangText("STOCK_SEARCH_MSG"))

        props.setOriginalList(NewListArray)

    }

    function streamingSubscription(symArrayList) {
        // let symbols = symArrayList.map(l => l.sym)
        let filteredSym = []
        // const filteredSym = symbols.filter((item) => item.instrument !== "OPTSTK" && item.instrument !== "OPTIDX");
        // symArrayList.filter((item) => {
        //     if(item.sym.instrument !== "OPTSTK" && item.sym.instrument !== "OPTIDX") {
        //         filteredSym.push(item.sym)
        //     }
        //     return null
        // });
        symArrayList.map((item) => {
            if(item.sym.instrument !== "OPTSTK" && item.sym.instrument !== "OPTIDX") {
                filteredSym.push(item.sym)
            }
            return null
        })

        props.forceSubscribeLevel1(filteredSym, [STREAMING_KEYS.LTP, STREAMING_KEYS.CHANGE, STREAMING_KEYS.CHANGE_PER])
    }

    function onStreamCB(resp) {
        setStreamingResp(resp)
    }

    function setStreamingResptoSymbols(resp) {
        let { data } = resp;
        let newList = listArray.map(row => {
            if (row.sym.streamSym === data.symbol) {
                row = Object.assign({}, row, applyPaint(row, data));
            }
            return row;
        })
        setListArray(newList)

    }

    return (
        <div className="searchDiv">
            {(listArray.length && !showRecentSearch) || (showStockError && !showRecentSearch) ?
                <div className="Result-head">
                    {
                        showStockHeader.map((item, index) => {
                            return (

                                <span key={index}
                                    className={`menusTab cursor ${item.name}  ${index === 0 ?
                                        'first' : ''} ${selectedMenu === item.name ?
                                        'selectedMenu' : ''}`}
                                    onClick={() => onClickStock(item)}
                                >
                                    <span className="menuName">
                                        <LangText name={item.langKey} orientation={TEXT_ORIENTATION.PASCALCASE} />
                                    </span>
                                </span>

                            )
                        })
                    }

                </div>
                : null}
            <div className={`searchResutDiv scrollArea scroller_firefox 
        ${(listArray.length && showRecentSearch) ? 'recentSearch' : ''}`}
            onScroll={(e) => props.onScrollDiv(e)}
            id="searchScrollDiv"
            >
                {
                    listArray.length ?
                        listArray.map((item, index) => {
                            return (
                                <div className="symbolRow-div" key={index}>
                                    <div className="symbol">
                                        <div className="symId">
                                            <div className="dispSym text-nowrap">
                                                <span className="quote-click"
                                                    title={getDispSymbolNameInSearch(item).primaryName}
                                                    onClick={() => props.onClickSymbol(item)}
                                                >
                                                    {getDispSymbolNameInSearch(item).primaryName}
                                                </span>

                                                {
                                                    item.sym.isWeekly ?
                                                        item.sym.isWeekly === true ?
                                                            <span className="weekly-option">
                                                                <button className="weekly">W</button>
                                                            </span>

                                                            : ''
                                                        : ''
                                                }

                                            </div>
                                            {/* {props.showInstrument ? <span className="symInstrumentValue">
                                            {getInstrumentTypeName(item)}</span> : null} */}
                                        </div>
                                        <div className="symName text-nowrap">
                                            {(convertToUpperCase(item.sym.asset) === SEGMENTS.OPTION ||
                                            convertToUpperCase(item.sym.asset) === SEGMENTS.FUTURE) ?
                                                <span className="exc">
                                                    {getDispSymbolNameInSearch(item).excName}</span>
                                                : <span className="exc">
                                                    {item.sym.exc}</span>}
                                        
                                            <span className={convertToUpperCase(item.sym.asset) === SEGMENTS.OPTION ?
                                                "optionType" : ""}
                                            title={getDispSymbolNameInSearch(item).secondaryName}>
                                                {getDispSymbolNameInSearch(item).secondaryName}
                                            </span>
                                            {convertToUpperCase(item.sym.asset) === SEGMENTS.OPTION ?
                                                <span className="strike">
                                                    {getDispSymbolNameInSearch(item).secondaryNameStrike}</span>
                                                : null}
                                        </div>
                                        {/* {convertToUpperCase(item.sym.asset) === SEGMENTS.FUTURE ?
                                            <span className="future-sym"
                                                title={getDispSymbolNameInSearch(item).expiryDate}>
                                                {getDispSymbolNameInSearch(item).expiryDate}
                                            </span> : null

                                        } */}
                                    </div>
                                    {
                                        props.alertbtn === true ?
                                            <>
                                                <button className="set-alert-btn"
                                                    onClick={() => props.alertSearch(item)}
                                                >
                                                    <LangText module="BUTTONS" name="SET_ALERT"
                                                        orientation={TEXT_ORIENTATION.UPPERCASE} /></button>
                                            </>
                                            :
                                            <div className={`btn-div ${item.ltp 
                                                ? 'show-sym'
                                                : 'hide-sym'}`}>
                                                {item.ltp ?
                                                    <div className="streamValues">
                                                        <span className="ltpValue">
                                                            <span className={`${newWatchListName 
                                                                ? ''
                                                                : 'hideOnHover'}
                                                        ${item.ltpClass ? item.ltpClass : ''}`}>
                                                                {item.ltp ? '₹ ' : ''}{checkEmpty(item.ltp)}</span>
                                                        </span>
                                                        <span className={`${newWatchListName 
                                                            ? ''
                                                            : 'hideOnHover'} ${getColorCode(item.chng)}`}>
                                                            <span>{checkEmpty(item.chng)}</span>
                                                            <span>({checkEmpty(item.chngPer)}%)</span>
                                                        </span>
                                                    </div>
                                                    :
                                                    null}
                                                {!newWatchListName ?
                                                    <div className="btn-only">
                                                        <span className="showOnHover">
                                                            <button className="buye-btn"
                                                                onClick={() =>
                                                                    props.onClickBuy_Sell(item, ORDER_TYPES.BUY)
                                                                }
                                                            >
                                                                B
                                                            </button>
                                                        </span>
                                                        <span className="showOnHover">
                                                            <button className="selle-btn"
                                                                onClick={() =>
                                                                    props.onClickBuy_Sell(item, ORDER_TYPES.SELL
                                                                    )}
                                                            >
                                                                S
                                                            </button>
                                                        </span>
                                                    </div>
                                                    : null

                                                }
                                                {
                                                    (watchGroupLength || 
                                                        (newWatchListName && newWatchListName!=="PredNifty50")) ?
                                                        (
                                                            props.getSelectedAddFlag(item.sym) ?
                                                                <span>
                                                                    <Checkbox_sel className="removeToWatchlist-btn"
                                                                        onClick={() => 
                                                                            props.onClickAddSymBtn(item.sym,'delete')}
                                                                    />
                                                                </span>
                                                                :
                                                                <span>
                                                                    <button className="addToWatchlist-btn flex-center"
                                                                        onClick={() => 
                                                                            props.onClickAddSymBtn(item.sym,'add')}
                                                                    >
                                                                        <AddSymIcon />
                                                                    </button>
                                                                </span>
                                                        )
                                                        : null
                                                }

                                            </div>
                                    }
                                </div>
                            )
                        })
                        : errorMsg.length && props.showErrorMsg ?
                            <div className="symbolRow-div error">
                                <span className="infoMsg">{errorMsg}</span>
                            </div>
                            : !listArray.length && !showRecentSearch ?
                                <div className="symbolRow-div error">
                                    <span className="infoMsg">{showStockError}</span>
                                </div> : null
                }
            </div>
        </div>
    )
}

export default LazyLoading(withStreaming(SymbolResultViewComponent));