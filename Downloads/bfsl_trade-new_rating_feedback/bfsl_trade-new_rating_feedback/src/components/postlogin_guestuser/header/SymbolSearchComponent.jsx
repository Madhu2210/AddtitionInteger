import React, { useState, useEffect, useRef } from 'react'
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import { useFetch, MsfRequest, withStreaming } from '../../../index'

import InputComponent from '../../common/InputComponent';
// import SelectInputComponent from '../../common/SelectInputComponent';
import { LoaderComponent } from '../../common/LoaderComponent'
import LangText, { getLangText } from '../../../common/lang/LangText'
import SymbolView from './SymbolResultViewComponent'
import useCloseModal from '../../../customHooksComponents/useCloseModal';

import { HEADER_GUEST, WATCHLIST_GUEST } from '../../../config/ServiceURLs'

import {
    storeWatchGroups, storeSearchSymWatchlistFlag,
    storeRegetWatchGroupSymbolData, storeNewWatchListName,
    storeRegetWatchGroups,
    storeSelectedWatchGroup, storeRecentSearchSymbols, storeSelectedWatchGroupResp,
    storeToastMsgProps,
} from '../../../state/actions/Actions'

import {
    isValidSearchInput, getGuestMarketDataBaseURL,
    getDispSymbolName, getFormatedDate, cacheSearch, convertToLowerCase, applyPaint, getGuestUserBaseURL
} from '../../../common/CommonMethods';

import {
    ASSET_MENU_ARRAY, SEGMENT_ARRAY, SCREENS_GUEST, ENABLE_CACHE_SEARCH, TEXT_ORIENTATION, STREAMING_MODULES,
    STREAMING_KEYS, LOCAL_STORAGE, WATCHGROUP_MAX_LIMIT, 
} from '../../../common/Constants';
import { CloseIcon, SearchIcon } from '../../common/FontIcons'
import { getItemFromSessionStorage } from '../../../common/LocalStorage';
import { getEditableWatchgroups, gotoQuote, gotoTrade } from '../../../common/Bridge';

function SymbolSearchComponent(props) {

    const MsfFetch = useFetch()

    let watchlist_MaxLimit = getItemFromSessionStorage(LOCAL_STORAGE.WATCHGROUP_SYM_LIMIT)

    const [assetMenu] = useState(ASSET_MENU_ARRAY)
    const [segmentOptions] = useState(SEGMENT_ARRAY)
    const [selectedAssetMenu, setSelectedAssetMenu] = useState(assetMenu[0].name)
    const [selectedSegmentOption, setSelectedSegmentOption] = useState(segmentOptions[0].name)
    const [searchValue, setSearchValue] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const [symbolList, setSymbolList] = useState([])
    const [recendSearchSymbolList, setRecendSearchSymbolList] = useState([])
    const [watchGroupList, setWatchGroupList] = useState([])
    const [selectedWatchGroup, setSelectedWatchGroup] = useState({})
    const [errorMsg, setErrorMsg] = useState('')
    const [showErrorMsg, setShowErrorMsg] = useState('')
    const [showLoader, setShowLoader] = useState(false)
    const [showRecentSearch, setShowRecentSearch] = useState(false)
    const [selectedSym, setSelectedSym] = useState([])
    const [initSymData, setInitData] = useState([])
    const [isSelectOptionVisible] = useState(false)
    const [streamingResp, setStreamingResp] = useState(null)
    const [watchGroupLimit] = useState(watchlist_MaxLimit ? parseInt(watchlist_MaxLimit) : WATCHGROUP_MAX_LIMIT)
    const [watchListSymbolLength, setWatchListSymbolLength] = useState(null)
    const [showSymbolLength, setShowSymbolLength] = useState(false)

    const [watchListSymbols, setWatchListSymbols] = useState([])

    const searchInputRef = useRef(null)
    const searchInputVal = useRef(null)
    const initReqSent = useRef(false)
    const prevSearchVal = useRef('')
    const cacheSearchFromResp = useRef(false)

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, clearDataOnClickOutside)

    useEffect(() => {
        props.registerStreamCB(onStreamCB, STREAMING_MODULES.RESENT_SEARCH);
    }, [])

    useEffect(() => {
        let recentSearchSyms = props.recentSearchSyms
        if (recentSearchSyms && recentSearchSyms.length) {
            let updatedList = recentSearchSyms.filter((item) => {
                if (!item.sym.expiry)
                    return item

                let givenDate = getFormatedDate(item.sym.expiry).formatedDate
                let date = new Date()
                date.setHours(0, 0, 0, 0)
                if (!(givenDate < date))
                    return item
                return " "

            })
            setRecendSearchSymbolList(updatedList)
        } else {
            setRecendSearchSymbolList([])
        }
    }, [props.recentSearchSyms])

    useEffect(() => {
        if (showRecentSearch) {
            setSymbolList(recendSearchSymbolList)
        }
        // else {
        //     let updatedRecentSearchList = recendSearchSymbolList.map((item) => {
        //         item.selected = false
        //         return item
        //     })
        //     // setRecendSearchSymbolList(updatedRecentSearchList)
        // }
    }, [showRecentSearch, recendSearchSymbolList])

    useEffect(() => {
        if (!searchValue.length)
            setShowRecentSearch(true)
        else {
            setSymbolList([])
            setShowRecentSearch(false)
        }

        if (searchValue.length > 2) {
            if (initReqSent.current && ENABLE_CACHE_SEARCH) {
                let char1 = searchValue.charAt(0)
                let char2 = searchValue.charAt(1)
                let char3 = searchValue.charAt(2)
                let prevChar1 = prevSearchVal.current.charAt(0)
                let prevChar2 = prevSearchVal.current.charAt(1)
                let prevChar3 = prevSearchVal.current.charAt(2)
                if ((char1 == prevChar1) && (char2 == prevChar2) && (char3 == prevChar3)) {
                    let filteredArray = cacheSearch(searchValue, initSymData, 'queryString', "queryString2")
                    if (filteredArray && filteredArray.length) {
                        setSymbolList(filteredArray)
                        setErrorMsg('')
                    } else {
                        setSymbolList([])
                        if (!errorMsg)
                            setErrorMsg(getLangText('NO_SYMBOL', 'MESSAGES'))
                    }
                } else {
                    initReqSent.current = false
                    let srString = char1 + '' + char2 + '' + char3
                    if (searchValue.length > 3)
                        cacheSearchFromResp.current = true
                    symbolSearch(srString)
                }
            }
            else {
                if (searchValue.length > 3 && ENABLE_CACHE_SEARCH) {
                    let char1 = searchValue.charAt(0)
                    let char2 = searchValue.charAt(1)
                    let char3 = searchValue.charAt(2)
                    let srString = char1 + '' + char2 + '' + char3
                    cacheSearchFromResp.current = true
                    symbolSearch(srString)
                } else
                    symbolSearch(searchValue)
            }
        } else if (searchValue.length > 0 && searchValue.length < 3) {
            setShowDropdown(false)
            setShowLoader(false)
            setSymbolList([])
            initReqSent.current = false
        }
    }, [searchValue, initSymData, selectedAssetMenu, selectedSegmentOption])

    useEffect(() => {
        if (props.symbolSearch)
            searchInputRef.current.focus()
        else
            clearData()
    }, [props.symbolSearch])

    useEffect(() => {
        let watchGroups = Object.assign([], props.watchGroups)
        if (watchGroups.length) {
            let editableGroups = watchGroups.filter(item => item.editable)
            if (editableGroups && editableGroups.length) {
                setWatchGroupList(editableGroups)
                if (props.selectedWatchgroup && props.selectedWatchgroup.editable)
                    setSelectedWatchGroup(props.selectedWatchgroup)
                else
                    setSelectedWatchGroup(editableGroups[0])
            }
        } else {
            setWatchGroupList([])
            setSelectedWatchGroup({})
        }
    }, [props.watchGroups, props.selectedWatchgroup])

    useEffect(() => {
        if (props.selectedWatchgroup && props.selectedWatchgroupResp) {
            if (props.selectedWatchgroup.editable !== false) {
                if (props.selectedWatchgroupResp[props.selectedWatchgroup.wId]) {
                    setWatchListSymbols(props.selectedWatchgroupResp[props.selectedWatchgroup.wId])
                    setWatchListSymbolLength(props.selectedWatchgroupResp[props.selectedWatchgroup.wId].length)
                    setShowSymbolLength(true)
                }
                else {
                    hideSymbolLength()
                }
            }
            else {
                hideSymbolLength()
            }
        }
        else {
            hideSymbolLength()
        }

    }, [props.selectedWatchgroupResp, props.selectedWatchgroup])

    useEffect(() => {
        if (showDropdown && showRecentSearch && recendSearchSymbolList && recendSearchSymbolList.length) {
            streamingSubscription(recendSearchSymbolList)
        }
        else {
            streamingSubscription([])
        }
    }, [showRecentSearch, showDropdown, recendSearchSymbolList])

    useEffect(() => {
        if (streamingResp && streamingResp !== {})
            setStreamingResptoSymbols(streamingResp)
    }, [streamingResp])

    function onStreamCB(resp) {
        console.log('resp78 :', resp);
        setStreamingResp(resp)
    }

    function streamingSubscription(symArrayList) {
        let symbols = symArrayList.map(l => l.sym)
        props.forceSubscribeLevel1(symbols, [STREAMING_KEYS.LTP, STREAMING_KEYS.CHANGE, STREAMING_KEYS.CHANGE_PER])
    }

    function setStreamingResptoSymbols(resp) {
        let { data } = resp;
        let newList = symbolList.map(row => {
            if (row.sym.streamSym === data.symbol) {
                row = Object.assign({}, row, applyPaint(row, data));
            }
            return row;
        })
        setSymbolList(newList)
    }

    // function getWatchGroup() {
    //     let request = new MsfRequest();
    //     MsfFetch.placeRequest(
    //         getGuestUserBaseURL() + WATCHLIST_GUEST.GET_WATCHGROUPS,
    //         request,
    //         successRespCBGetWatchGroup,
    //         errorRespCBGetWatchGroup
    //     )
    // }

    // function successRespCBGetWatchGroup(response) {
    //     if (response.data.groups.length)
    //         props.storeWatchGroups(response.data.groups)
    // }

    // function errorRespCBGetWatchGroup() {
    //     setWatchGroupList([])
    //     setSelectedWatchGroup({})
    // }

    function onClickSearchInput() {
        if (!searchValue.length) {
            setShowRecentSearch(true)
        }

        if (searchValue.length > 0 && searchValue.length < 3) {
            setShowDropdown(false)
        } else
            setShowDropdown(true)
    }

    function clearDataOnClickOutside() {
        clearData()
    }

    function onChangeSearchVal(e) {
        let val = e.target.value
        if (!isValidSearchInput(val)) {
            setSearchValue(val)
            setShowDropdown(true)
            setErrorMsg('')
        }
    }

    function symbolSearch(searchString) {
        prevSearchVal.current = searchString
        setShowLoader(true)
        setSymbolList([])
        setErrorMsg('')
        setShowErrorMsg(false)
        initReqSent.current = true
        let request = new MsfRequest();
        request.addToData({ 'input': searchString })
        request.setEcho(searchString)
        request.setEncrypt(false)
        searchInputVal.current = searchString
        MsfFetch.placeRequest(
            getGuestMarketDataBaseURL() + HEADER_GUEST.SYMBOL_SEARCH,
            request,
            successCBSearchSymbols,
            errorCBSearchSymbols
        )
    }

    function successCBSearchSymbols(response) {
        setShowErrorMsg(true)
        if (searchInputVal.current === response.echo && searchInputVal.current.length > 2) {
            setErrorMsg('')
            if (response.data.symbols && response.data.symbols.length)
                response.data.symbols.map((item) => {
                    item.queryString = getDispSymbolName(item).primaryName + ' ' + item.sym.exc
                    item.queryString2 = getDispSymbolName(item).secondaryName + ' ' + item.sym.exc
                })
            setInitData(response.data.symbols)
            if (cacheSearchFromResp.current && ENABLE_CACHE_SEARCH) {
                let filteredArray = cacheSearch(searchValue,
                    response.data.symbols, 'queryString', "queryString2")
                if (filteredArray && filteredArray.length) {
                    setSymbolList(filteredArray)
                    setErrorMsg('')
                } else {
                    setSymbolList([])
                    setErrorMsg(getLangText('NO_SYMBOL', 'MESSAGES'))
                }
            } else
                setSymbolList(response.data.symbols)

            setShowLoader(false)
            cacheSearchFromResp.current = false
            // initReqSent.current = true
        }
    }

    function errorCBSearchSymbols(error) {
        setShowErrorMsg(true)
        if (searchInputVal.current === error.echo) {
            setSymbolList([])
            setErrorMsg(error.message)
            setShowLoader(false)
            // initReqSent.current = true
            setInitData([])
        }
    }

    function clearData() {
        setShowLoader(false)
        setSearchValue('')
        setSymbolList([])
        setSelectedSym([])
        setShowRecentSearch(false)
        setErrorMsg('')
        setShowDropdown(false)
        setSelectedAssetMenu(assetMenu[0].name)
        setSelectedSegmentOption(segmentOptions[0].name)
        props.storeSearchSymWatchlistFlag(false)
        props.storeNewWatchListName(null)
        searchInputRef.current.blur()
        initReqSent.current = false
        searchInputVal.current = ''
    }

    function clearDataAfterAddOrDelete() {
        setShowLoader(false)
        //setSearchValue('')
        // setSymbolList([])
        // setSelectedSym([])
        setShowRecentSearch(false)
        setErrorMsg('')
        //    setShowDropdown(false)
        setSelectedAssetMenu(assetMenu[0].name)
        setSelectedSegmentOption(segmentOptions[0].name)
        props.storeSearchSymWatchlistFlag(false)
        props.storeNewWatchListName(null)
        searchInputRef.current.blur()
        initReqSent.current = false
        searchInputVal.current = ''
    }

    function onKeyDown(e) {
        if (e.keyCode === 27)
            clearData()
    }

    // function onClickAddSymBtn(symObj) {
    //     let selectedAddSym = Object.assign([], selectedSym)
    //     let existIndex = null
    //     let symExist = false
    //     selectedAddSym.map((item, index) => {
    //         if (item.id === symObj.id) {
    //             symExist = true
    //             existIndex = index
    //         }
    //     })
    //     if (symExist)
    //         selectedAddSym.splice(existIndex, 1)
    //     else
    //         selectedAddSym.push(symObj)

    //     setSelectedSym(selectedAddSym)

    //     onClickSaveBtn()

    // }

    function onClickAddSymBtn(symObj, symbolAction) {
        console.log(symObj, "symbolAction", symbolAction)
        console.log("symbolAction", [symObj])
        setShowLoader(true)
        let selectedAddSym = Object.assign([], selectedSym)
        let existIndex = null
        let symExist = false
        selectedAddSym.map((item, index) => {
            if (item.id === symObj.id) {
                symExist = true
                existIndex = index
            }
        })
        if (symExist)
            selectedAddSym.splice(existIndex, 1)
        else
            selectedAddSym.push(symObj)

        // setSelectedSym(selectedAddSym)

        /*==Added on 2nd Sept 2022==*/

        if (symbolAction == "add") {

            if (props.newWatchListName && props.isNewWatchList) {
                let request = new MsfRequest();
                request.addToData({
                    'wName': props.newWatchListName,
                    'syms': [symObj]
                })
                MsfFetch.placeRequest(
                    getGuestUserBaseURL() + WATCHLIST_GUEST.ADD_SYMBOLS,
                    request,
                    successCBAddSymbolsOnCheck,
                    errorCBAddSymbolsOnCheck
                )
            } else {
                let request = new MsfRequest();
                request.addToData({
                    'wName': props.newWatchListName ? props.newWatchListName : selectedWatchGroup.wName,
                    'syms': [symObj]
                })
                MsfFetch.placeRequest(
                    getGuestUserBaseURL() + WATCHLIST_GUEST.ADD_SYMBOLS,
                    request,
                    successCBAddSymbolsOnCheck,
                    errorCBAddSymbolsOnCheck
                )
            }

        } else if (symbolAction == "delete") {

            console.log("delete action called")
            deleteSelectedSymsOnUnCheck(symObj)

        }

        /*==END==*/
    }

    function deleteSelectedSymsOnUnCheck(symObj) {

        let request = new MsfRequest();
        request.addToData({
            'wName': selectedWatchGroup.wName,
            "symbols": [symObj]
        })
        request.setEcho(selectedWatchGroup.wId)
        MsfFetch.placeRequest(
            getGuestUserBaseURL() + WATCHLIST_GUEST.DELETE_SYMBOLS,
            request,
            successCBAddSymbolsOnCheck,
            errorCBAddSymbolsOnCheck
            // successRespCBDeleteSymbols,
            // errorRespCBDeleteSymbols
        )

    }

    // function onClickSaveBtn() {
    //     setShowLoader(true)
    //     if (props.newWatchListName && props.isNewWatchList) {
    //         let request = new MsfRequest();
    //         request.addToData({
    //             'wName': props.newWatchListName,
    //             'syms': selectedSym
    //         })
    //         MsfFetch.placeRequest(
    //             getGuestUserBaseURL() + WATCHLIST_GUEST.ADD_SYMBOLS,
    //             request,
    //             successCBAddSymbols,
    //             errorCBAddSymbols
    //         )
    //     } else {
    //         let request = new MsfRequest();
    //         request.addToData({
    //             'wName': props.newWatchListName ? props.newWatchListName : selectedWatchGroup.wName,
    //             'syms': selectedSym
    //         })
    //         MsfFetch.placeRequest(
    //             getGuestUserBaseURL() + WATCHLIST_GUEST.ADD_SYMBOLS,
    //             request,
    //             successCBAddSymbols,
    //             errorCBAddSymbols
    //         )
    //     }
    // }

    // function successCBAddSymbols(response) {
    //     setShowLoader(false)
    //     setSelectedSym([])

    //     let wObj = Object.assign({}, props.selectedWatchgroupResp)
    //     if (props.newWatchListName && props.isNewWatchList) {
    //         let wList = getEditableWatchgroups()
    //         let findIndex = wList.findIndex((item) => {
    //             return convertToLowerCase(item.wName) === convertToLowerCase(props.newWatchListName)
    //         })
    //         if (findIndex != -1)
    //             wObj[wList[findIndex].wId] = null
    //     } else
    //         wObj[selectedWatchGroup.wId] = null
    //     props.storeSelectedWatchGroupResp(wObj)

    //     if (props.isWatchlistScreenActive) {
    //         props.storeRegetWatchGroupSymbolData({
    //             reget: true,
    //             watchGroup: props.newWatchListName ? props.newWatchListName : selectedWatchGroup.wName
    //         })
    //         if (props.newWatchListName && props.isNewWatchList) {
    //             props.storeRegetWatchGroups(true)
    //         }
    //         else if (!props.newWatchListName)
    //             props.storeSelectedWatchGroup(selectedWatchGroup)
    //     }
    //     if (props.newWatchListName && props.isNewWatchList) {
    //         clearData()
    //         props.storeToastMsgProps({
    //             show: true,
    //             message: response.infoMsg
    //         })
    //     }
    //     else {
    //         props.storeToastMsgProps({
    //             show: true,
    //             message: response.infoMsg
    //         })
    //         clearData()
    //     }
    // }

    function successCBAddSymbolsOnCheck(response) {
        setShowLoader(false)
        setSelectedSym([])

        let wObj = Object.assign({}, props.selectedWatchgroupResp)
        if (props.newWatchListName && props.isNewWatchList) {
            let wList = getEditableWatchgroups()
            let findIndex = wList.findIndex((item) => {
                return convertToLowerCase(item.wName) === convertToLowerCase(props.newWatchListName)
            })
            if (findIndex != -1)
                wObj[wList[findIndex].wId] = null
        } else
            wObj[selectedWatchGroup.wId] = null
        props.storeSelectedWatchGroupResp(wObj)

        if (props.isWatchlistScreenActive) {
            props.storeRegetWatchGroupSymbolData({
                reget: true,
                watchGroup: props.newWatchListName ? props.newWatchListName : selectedWatchGroup.wName
            })
            if (props.newWatchListName && props.isNewWatchList) {
                props.storeRegetWatchGroups(true)
            }
            else if (!props.newWatchListName)
                props.storeSelectedWatchGroup(selectedWatchGroup)
        }
        if (props.newWatchListName && props.isNewWatchList) {
            clearDataAfterAddOrDelete()
            props.storeToastMsgProps({
                show: true,
                message: response.infoMsg
            })
        }
        else {
            props.storeToastMsgProps({
                show: true,
                message: response.infoMsg
            })
            clearDataAfterAddOrDelete()
        }
    }

    // function errorCBAddSymbols(error) {
    //     setShowLoader(false)
    //     setShowDropdown(false)
    //     props.storeToastMsgProps({
    //         show: true,
    //         message: error.message,
    //         error: true
    //     })
    // }
    function errorCBAddSymbolsOnCheck(error) {
        setShowLoader(false)
        setShowDropdown(false)
        props.storeToastMsgProps({
            show: true,
            message: error.message,
            error: true
        })
    }

    function onClickBuy_Sell(symData, tradeType) {
        addToRecentSearchSymbol(symData)
        if (props.history && props.history.location.pathname !== SCREENS_GUEST.DASHBOARD) {
            props.history.push(SCREENS_GUEST.DASHBOARD)
        }
        gotoTrade(symData, tradeType)
        clearData()
    }

    // function getSegmentDisableFlag(option) {
    //     if (selectedAssetMenu !== ASSET_MENU.EQUITY && option === SEGMENTS.CASH)
    //         return 'disable'
    //     else
    //         return ''
    // }

    function addToRecentSearchSymbol(symData) {
        let symList = Object.assign([], recendSearchSymbolList)
        let recentSearchSyms = symList.filter(item => item.sym.id !== symData.sym.id)
        recentSearchSyms.unshift(symData)
        recentSearchSyms = recentSearchSyms.slice(0, 10)
        setRecendSearchSymbolList(recentSearchSyms)
        props.storeRecentSearchSymbols(recentSearchSyms)
    }

    function onClickSymbol(symData) {
        addToRecentSearchSymbol(symData)
        if (props.history && props.history.location.pathname !== SCREENS_GUEST.DASHBOARD) {
            props.history.push(SCREENS_GUEST.DASHBOARD)
        }
        gotoQuote(symData)
        clearData()
    }

    function getSelectedAddFlag(symObj) {
        let selected = false
        watchListSymbols.map((item) => {
            if (item.sym.id === symObj.id)
                selected = true
        })
        return selected
    }

    function hideSymbolLength() {
        setWatchListSymbolLength(null)
        setShowSymbolLength(false)
    }

    // function alertSearch(sym) {
    //     if(props.createSearch) {
    //         gotoAlert(sym,props.createSearch)
    //         addToRecentSearchSymbol(sym)
    //     }
    //     else {
    //         gotoAlert(sym,props.createSearch)
    //         props.alertCB()
    //         addToRecentSearchSymbol(sym)
    //     }
    // }

    function onClickClose() {
        setSearchValue('')
        setSymbolList([])

    }

    return (
        <div className="symSearch-base" ref={showDropdown ? modalRef : null}>
            {/* {
                (showDropdown || props.symbolSearch) ?
                    <LoaderComponent hideLoader={true} onClickOut={clearData} />
                    : null
            } */}
            <div className="inputCover">
                <div className="input-addOn">
                    <InputComponent
                        id="input-ele"
                        ref={searchInputRef}
                        onChange={onChangeSearchVal}
                        value={searchValue}
                        onKeyDown={onKeyDown}
                        onClick={onClickSearchInput}
                        onFocus={onClickSearchInput}
                        placeholder={getLangText(props.alertSearch === true ?
                            "PLACE_HOLDER_ALERT_SEARCH" : "PLACE_HOLDER_SEARCH", "SYMBOL_SEARCH")}
                        autoComplete="off"
                    />

                    <SearchIcon />
                    <input className="hiddenInput_serach" type="text" />
                    {searchValue.length ?
                        <CloseIcon onClick={onClickClose} /> : null}
                    {/* to prevent auto populate in the search input */}
                </div>
                {/* <span className="enterMinTxt">
                    <LangText module="SYMBOL_SEARCH" name="PLACE_HOLDER_CONDITION" />
                </span> */}
            </div>
            {
                // props.alertSearch === true ?
                //     null
                //     :
                (showSymbolLength && !searchValue.length && !showDropdown) ?
                    <div className="symbol-length">
                        <span>{watchListSymbolLength}/{watchGroupLimit}</span>
                    </div>
                    :
                    null
            }
            {
                showDropdown ?
                    <div className="dropdown-div">
                        {
                            showLoader ?
                                <LoaderComponent />
                                : null
                        }

                        <div className={`body ${!symbolList.length ? 'nosymbol' : ''} 
                        ${isSelectOptionVisible ? 'reduceOp' : ''}`}>
                            {
                                (symbolList.length && showRecentSearch) ?
                                    <div className="recent-search-title">
                                        <span>
                                            <LangText name="RESENT_SEARCH" />
                                        </span>
                                        <span className="clearAllBtn"
                                            onClick={() => props.storeRecentSearchSymbols([])}>
                                            <LangText module="BUTTONS" name="CLEAR_ALL"
                                                orientation={TEXT_ORIENTATION.LOWERCASE} />
                                        </span>
                                    </div>
                                    : null
                            }
                            <SymbolView symbolList={symbolList}
                                errorMsg={errorMsg}
                                showErrorMsg={showErrorMsg}
                                newWatchListName={props.newWatchListName}
                                onClickBuy_Sell={onClickBuy_Sell}
                                watchGroupLength={watchGroupList.length}
                                onClickAddSymBtn={onClickAddSymBtn}
                                getSelectedAddFlag={getSelectedAddFlag}
                                onClickSymbol={onClickSymbol}
                                showRecentSearch={showRecentSearch}
                                showDropdown={showDropdown}
                                showInstrument={props.showInstrument}
                                searchValue={searchValue}
                            // alertSearch={alertSearch}
                            // alertbtn={props.alertSearch}
                            />
                            {
                                (!symbolList.length && !searchValue.length) ?
                                    <div className="flex-center infoMsg">
                                        <LangText name="NO_RESENT_SEARCH" />
                                    </div>
                                    : null
                            }
                        </div>

                        {/*
                            ((symbolList.length && watchGroupList.length) || props.newWatchListName) ?
                                <div className="footer">
                                    <div className="action-div">
                                        <div className="flex-center">
                                            <span className="addToText">
                                                <LangText  name="ADD_TO" />
                                            </span>
                                            {
                                                (props.symbolSearch && props.newWatchListName) ?
                                                    <span className="newWatchlistName">
                                                        {props.newWatchListName}
                                                    </span>
                                                    :
                                                    <SelectInputComponent
                                                        optionList={watchGroupList}
                                                        value="wName"
                                                        selectedOption={selectedWatchGroup.wName}
                                                        onSelectValueCB={onSelectWatchlistCB}
                                                        hasInnerAction={false}
                                                        preSelect={true}
                                                        symSearch={true}
                                                        direction_up={true}
                                                        sendShowOptionFlag={getShowOptionFlag}
                                                        // hasLangageDependent = {true}
                                                    />
                                            }
                                            <span className="selctedCount">({selectedSym.length})</span>
                                        </div>

                                    <button className="add-btn"
                                        onClick={onClickSaveBtn}
                                        disabled={!selectedSym.length}
                                    >
                                        <LangText  name="ADD_SYMBOL" />
                                    </button>
                                    </div>
                                </div>
                                : null
                        */}

                    </div>
                    : null
            }
        </div >
    )
}

const mapStateToProps = ({ watchlist, login, settings, localStorageRed }) => {
    let newWatchList = watchlist.newWatchListName
    if (!newWatchList)
        newWatchList = {}
    return {
        symbolSearch: watchlist.symbolSearch,
        watchGroups: watchlist.watchGroups,
        selectedWatchgroup: watchlist.selectedWatchgroup,
        selectedWatchgroupResp: watchlist.selectedWatchgroupResp,
        newWatchListName: newWatchList.name,
        isNewWatchList: newWatchList.new,
        isWatchlistScreenActive: watchlist.isWatchlistScreenActive,
        loginStatus: login.loginStatus,
        recentSearchSyms: localStorageRed.recendSyms,
        selectedTheme: settings.selectedTheme
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeWatchGroups: (s) => { dispatch(storeWatchGroups(s)) },
        storeSearchSymWatchlistFlag: (s) => { dispatch(storeSearchSymWatchlistFlag(s)) },
        storeRegetWatchGroupSymbolData: (s) => { dispatch(storeRegetWatchGroupSymbolData(s)) },
        storeNewWatchListName: (s) => { dispatch(storeNewWatchListName(s)) },
        storeRegetWatchGroups: (s) => { dispatch(storeRegetWatchGroups(s)) },
        storeSelectedWatchGroup: (s) => { dispatch(storeSelectedWatchGroup(s)) },
        storeRecentSearchSymbols: (s) => { dispatch(storeRecentSearchSymbols(s)) },
        storeSelectedWatchGroupResp: (s) => { dispatch(storeSelectedWatchGroupResp(s)) },
        storeToastMsgProps: (s) => { dispatch(storeToastMsgProps(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStreaming(withRouter(SymbolSearchComponent)));