import React, { useEffect, useRef, useState } from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../../index'

import WatchlistTable from './WatchlistTableComponent'
import { WidgetLoader } from '../../../common/WidgetLoaderComponent'
import AddWatchGroupDialogComponent from './watchlistDialogs/AddWatchGroupDialogComponent';
import DeleteWatchGroupDialog from './watchlistDialogs/DeleteWatchGroupDialogComponent';

import {
    storeNewWatchListName, storeRegetWatchGroups, storeRegetWatchGroupSymbolData, storeSearchSymWatchlistFlag,
    storeSelectedWatchGroup,
    storeSelectedWatchGroupResp, storeToastMsgProps, storeWatchGroups, storeWatchlistDialogDetails,
    storeWatchlistScreenActiveFlag, refreshDemoTour, setDemoTourFlag,
    storeWatchlistSortParams, storeWatchlistFilterParams,
} from '../../../../state/actions/Actions';

import LangText, { getLangText } from '../../../../common/lang/LangText'
import { getWatchlistBaseUrl, sortByInt, sortByString, sortFlagFunc } from '../../../../common/CommonMethods'
import { WATCHLIST } from '../../../../config/ServiceURLs'
import { CommonErrorMessages, WATCHLIST_MSG } from '../../../../common/Messages';
import {
    INFO_IDS, LOCAL_STORAGE, SORT_TYPES, WATCHGROUP_MAX_LIMIT,
    WATCHLIST_DIALOGS
} from '../../../../common/Constants';
import {
    DeleteIcon, EditWatchlistIcon, LeftArrowIcon2, RightArrowIcon2,
    PlusIcon, SortingShowIcon
} from '../../../common/FontIcons';
import { getItemFromSessionStorage} from '../../../../common/LocalStorage';
import { getEditableWatchgroups, setExcFilterbyWGroup } from '../../../../common/Bridge';
import SortWatchListDialogComponent from './watchlistDialogs/SortWatchListDialogComponent';

function WatchlistBaseComponent(props) {

    const MsfFetch = useFetch()

    let watchlist_MaxLimit = getItemFromSessionStorage(LOCAL_STORAGE.WATCHGROUP_LIMIT)

    const [watchGroupList, setWatchGroupList] = useState([])
    const [selectedWatchGroup, setSelectedWatchGroup] = useState('')
    const [symbolList, setSymbolList] = useState([])
    // const [selectedSym, setSelectedSym] = useState({})
    const [errorMsg_groups, setErrorMsg_groups] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    const [showAddGroupWindow, setShowAddGroupWindow] = useState(false)
    const [showDeleteGroupWindow, setShowDeleteGroupWindow] = useState(false)
    const [showDeleteCheckbox, setShowDeleteCheckbox] = useState(false)
    const [showClear, setShowClear] = useState(false)
    const [reSetDeleteSyms, setReSetDeleteSyms] = useState(false)
    const [isEditableWatchGroup, setIsEditableWatchGroup] = useState(true)
    const [isNoDataError, setNoDataError] = useState(false)
    const [showSorting, setShowSorting] = useState(false)
    const [initSymbolList, setInitSymbolList] = useState([])
    const [finalFilteredList, setFinalFilteredList] = useState([])
    const [excList, setExcList] = useState([])
    const [resetData, setResetData] = useState(false)
    const[previousGrpId,setPreviousGrpId]=useState(null)

    const [showFiltericon, setShowFilterIcon] = useState(false)

    // const [showFiltericon, setShowFilterIcon] = useState(false)

    const [sortFlag, setSortFlag] = useState(
        [
            { column: "dispSym", sortAsc: null },
            { column: "ltp", sortAsc: null },
            { column: "chngPer", sortAsc: null }
        ]
    )
    const [sortAsc, setSortAsc] = useState(true)
    const [disableGroupLeftScroll, setDisableGroupLeftScroll] = useState(true)
    const [disableGroupRightScroll, setDisableGroupRightScroll] = useState(false)
    const [watchGroupLimit] =
        useState(watchlist_MaxLimit ? parseInt(watchlist_MaxLimit) : WATCHGROUP_MAX_LIMIT)
    const [disableAddGroup, setDisableAddGroup] = useState(false)

    const isPendingSymRequest = useRef(null)
    const isPendingGroupRequest = useRef(null)
    const isPendingDeleteGroupRequest = useRef(null)
    const selectedDeleteSyms = useRef([])
    const deletingGroup = useRef(null)
    const selectedGroupRef = useRef(null)
    const selectedGroupBtnRef = useRef(null)
    const keepSymArray = useRef(false)
    const cacheSymbolRespData = useRef(null)
    const watchGroupScroll = useRef(null)
    const groupScrollPercentage = useRef(20)

    // useEffect(() => {

    //     let filteredExc = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.SAVED_FILTERS))
    //     let sortOptions =JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.SAVED_FILTERS_SORTBY))
    //     if(filteredExc){
    //         console.log("localfilter",filteredExc)
    //         props.storeWatchlistFilterParams(filteredExc)

    //     }
    //     if(sortOptions){
    //         console.log("localsort",sortOptions)

    //         props.storeWatchlistSortParams(sortOptions)
    //     }

    // }, [])
    useEffect(() => {

        if (!finalFilteredList.length) {
            setErrorMsg(getLangText("SYMBOL_NOTFOUND_MSG"))
        }

    }, [finalFilteredList])

    useEffect(() => {

        if (props.filterParams && props.filterParams.length) {
            props.filterParams.map((item) => {
                if (!item.selected)
                    setShowFilterIcon(false)
                else {
                    setShowFilterIcon(true)
                    // showFilter(props.filterParams)

                }
            })
        } else if (props.sortParams) {
            if (props.sortParams.sortType && props.sortParams.sortType !== SORT_TYPES.NONE)
                setShowFilterIcon(true)
            else {
                setShowFilterIcon(false)

            }
        } else {
            setShowFilterIcon(false)

        }
        if (props.sortParams && props.sortParams.sortType == SORT_TYPES.NONE)
            setSymbolList(initSymbolList)
        else if (!props.sortParams)
            setSymbolList(initSymbolList)
        // if (props.sortParams) {
        //     console.log("props.sortParams", props.sortParams)
        //     props.storeWatchlistSortParams({
        //         varType: props.sortParams.type,
        //         key: props.sortParams.key,
        //         sortType: props.sortParams.sortType
        //     })
        // }
    }, [props.filterParams, props.sortParams])

    useEffect(() => {

        props.storeWatchlistScreenActiveFlag(true)
        props.setTableLoader()
        return () => {
            props.storeWatchlistScreenActiveFlag(false)
            // props.storeWatchlistSortParams({})
        }

    }, [])

    useEffect(() => {
        if (initSymbolList) {
            let excArray = []
            initSymbolList.map((item) => {
                // if (item.netQty) {
                //     console.log("yes")
                // }
                let isExeExist = excArray.findIndex((fItem) => {
                    return fItem.name === item.sym.exc
                })
                if (isExeExist === -1)
                    excArray.push({ name: item.sym.exc })
            })
            let HoldFiltrList = initSymbolList.filter(item => item.netQty)
            if (HoldFiltrList.length) {

                excArray.push({ name: "Holdings" })
            }
            let filterData = Object.assign([], props.filterParams)
            let newFiltrList = filterData.filter(item => item.selected)
            excArray.map((item) => {
                newFiltrList.map((item2) => {
                    if (item.name === item2.name) {
                        item.selected = true

                    }
                    return item
                }
                )
            })
            setExcList(excArray)
        }
    }, [initSymbolList])

    useEffect(() => {
        if (props.loginStatus)
            if (!props.watchGroups.length)
                getWatchGroup()

            else {
                setWatchGroupList(props.watchGroups)
                if (props.watchGroups) {
                    if (props.selectedWatchgroup) {
                        let checkWatchGroup = props.watchGroups.findIndex((item) => {
                            return item.wId == props.selectedWatchgroup.wId;
                        })
                        if (checkWatchGroup !== -1)
                            setSelectedWatchGroup(props.selectedWatchgroup)
                        else
                            setSelectedWatchGroup(props.watchGroups[0])
                    }
                    else
                        setSelectedWatchGroup(props.watchGroups[0])
                }
                else
                    setSelectedWatchGroup(props.watchGroups[0])
            }
    }, [props.watchGroups])

    useEffect(() => {
        if (watchGroupScroll.current) {
            if (watchGroupScroll.current.clientWidth >= watchGroupScroll.current.scrollWidth)
                setDisableGroupRightScroll(true)
            else
                setDisableGroupRightScroll(false)
        }
    }, [watchGroupScroll.current, watchGroupList])

    useEffect(() => {
        if (selectedWatchGroup && selectedWatchGroup != {}) {
            selectedGroupRef.current = selectedWatchGroup
            props.storeSelectedWatchGroup(selectedWatchGroup)
            // setSelectedSym(null)
            setErrorMsg('')
            resetSortIcons()
            getSymbolsWatchGroupResp()
            setIsEditableWatchGroup(selectedWatchGroup.editable)
            clearDeleteSyms(false)
        }
    }, [selectedWatchGroup])

    useEffect(() => {
        if (selectedGroupBtnRef.current)
            selectedGroupBtnRef.current.scrollIntoView()
    }, [selectedGroupBtnRef.current])

    useEffect(() => {
        if (props.regetWatchGroups)
            getWatchGroup()
    }, [props.regetWatchGroups])

    useEffect(() => {
        if (props.regetWatchGroupSymbols) {
            if (props.regetWatchGroupSymbols.reget &&
                props.regetWatchGroupSymbols.watchGroup === selectedWatchGroup.wName) {
                keepSymArray.current = true
                getSymbolsWatchGroupResp(true)
            }
        }
    }, [props.regetWatchGroupSymbols])

    useEffect(() => {
        cacheSymbolRespData.current = props.selectedWatchgroupResp
    }, [props.selectedWatchgroupResp])

    useEffect(() => {
        if (watchGroupList && watchGroupList.length) {
            let editableGroups = getEditableWatchgroups(watchGroupList)
            if (editableGroups.length >= watchGroupLimit)
                setDisableAddGroup(true)
            else
                setDisableAddGroup(false)
        }
    }, [watchGroupList])

    // useEffect(() => {

    //     // storeToSessionStorage(LOCAL_STORAGE.SAVED_FILTERS, JSON.stringify(props.filterParams))

    //     storeToSessionStorage(LOCAL_STORAGE.SAVED_FILTERS_SORTBY, JSON.stringify(props.sortParams))

    // }, [props.filterParams, props.sortParams])

    useEffect(() => {
        let sortParamArray = Object.keys(props.sortParams)
        if ( props.filterParams && !props.filterParams.length && !sortParamArray.length) {
            setResetData(true)
        }
    }, [props.sortParams, props.filterParams])

    useEffect(() => {
        if (resetData) {
            if (initSymbolList && initSymbolList.length)
                setSymbolList(initSymbolList)
            setResetData(false)
        }
    }, [resetData])

    function getWatchGroup() {
        setNoDataError(false)
        isPendingGroupRequest.current = true
        props.showWidgetLoader();
        props.storeRegetWatchGroups(null)
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            getWatchlistBaseUrl() + WATCHLIST.GET_WATCHGROUPS,
            request,
            successRespCBGetWatchGroup,
            errorRespCBGetWatchGroup
        )
    }

    function successRespCBGetWatchGroup(response) {
        isPendingGroupRequest.current = false
        if (response.data.groups.length)
            props.storeWatchGroups(response.data.groups)
        props.hideWidgetLoader();
        setErrorMsg_groups(null)

    }

    function errorRespCBGetWatchGroup(error) {
        isPendingGroupRequest.current = false
        setWatchGroupList([])
        setSelectedWatchGroup({})
        props.hideWidgetLoader();
        setErrorMsg_groups(error.message)
        if (error.infoID === INFO_IDS.NO_DATA)
            setNoDataError(true)
    }

    function onClickGroup(group) {
        if (group.wId !== selectedWatchGroup.wId) {
            setPreviousGrpId(selectedWatchGroup.wId)
            // props.storeWatchlistSortParams({})
            setExcFilterbyWGroup(group.wId)
            setShowFilterIcon(false)
            let showExcArray = Object.assign([], excList)
            showExcArray = excList.map((item) => {

                item.selected = false
                return item
            })
            setExcList(showExcArray)
        }
        selectedGroupRef.current = group
        setSelectedWatchGroup(group)
    }

    function getSymbolsWatchGroupResp(fromCache = true) {
        setShowDeleteCheckbox(false)
        let wObj = props.selectedWatchgroupResp[selectedWatchGroup.wId]
        if (wObj && wObj.length && fromCache) {
            setSymbolList(wObj)
            setInitSymbolList(wObj)
            // setSelectedSym(wObj[0])
            props.hideWidgetLoader()
        }
        else
            getSymbolsWatchGroup()
    }

    function getSymbolsWatchGroup() {

        if (!keepSymArray.current) {
            setSymbolList([])
            setInitSymbolList([])
        }
        else
            keepSymArray.current = false

        isPendingSymRequest.current = true
        props.storeRegetWatchGroupSymbolData(null)
        resetSortIcons()
        clearDeleteSyms(false)
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.addToData(selectedWatchGroup)
        request.setEcho(selectedWatchGroup.wId)
        MsfFetch.placeRequest(
            getWatchlistBaseUrl() + WATCHLIST.GET_SYMBOL_WATCHGROUP,
            request,
            successRespCBGetSymbolWatchGroup,
            errorRespCBGetSymbolWatchGroup
        )
    }

    function successRespCBGetSymbolWatchGroup(response) {
        if (response.echo === selectedGroupRef.current.wId) {
            isPendingSymRequest.current = false
            props.hideWidgetLoader();
            if (response.data.symbols && response.data.symbols.length) {
                setSymbolList(response.data.symbols)
                setInitSymbolList(response.data.symbols)
                // setSelectedSym(response.data.symbols[0])
            }
        }
        let wObj = Object.assign({}, cacheSymbolRespData.current)
        wObj[response.echo] = response.data.symbols
        props.storeSelectedWatchGroupResp(wObj)

    }

    function errorRespCBGetSymbolWatchGroup(error) {
        if (error.echo === selectedGroupRef.current.wId) {
            isPendingSymRequest.current = false
            props.hideWidgetLoader();
            setSymbolList([])
            setInitSymbolList([])
            // setSelectedSym(null)
            setErrorMsg(error.message)
        }
    }

    function onClickAddBtn() {
        if (!disableAddGroup)
            setShowAddGroupWindow(!showAddGroupWindow)
    }

    function onAddWatchGroup(addName) {
        if (!isPendingSymRequest.current) {
            props.storeNewWatchListName({ 'name': addName, 'new': true })
            goToSymbolSearch()
        }
        setShowAddGroupWindow(!showAddGroupWindow)
    }

    function goToSymbolSearch() {
        props.storeSearchSymWatchlistFlag(true)
    }

    function onClickDeleteGroup() {
        setShowDeleteGroupWindow(!showDeleteGroupWindow)
    }

    function onDeleteWatchGroup(deleteGroup) {
        setShowDeleteGroupWindow(false)
        if (!isPendingDeleteGroupRequest.current) {
            isPendingDeleteGroupRequest.current = true
            deletingGroup.current = deleteGroup
            props.showWidgetLoader();
            let request = new MsfRequest();
            request.setEcho(deleteGroup.wId)

            request.addToData({ 'wName': deleteGroup.wName })
            MsfFetch.placeRequest(
                getWatchlistBaseUrl() + WATCHLIST.DELETE_WATCHGROUP,
                request,
                successRespCBDeleteWatchGroupName,
                errorRespCBDeleteWatchGroupName
            )
        }
    }

    function successRespCBDeleteWatchGroupName(response) {

        if (response.echo === selectedWatchGroup.wId) {
            // props.storeWatchlistSortParams({})
            setExcFilterbyWGroup(selectedWatchGroup.wId, true)
        }
        isPendingDeleteGroupRequest.current = false
        props.hideWidgetLoader();
        props.storeToastMsgProps({
            show: true,
            message: WATCHLIST_MSG.DELETE_WATCHLIST_SUCCESS
        })

        let wObj = Object.assign({}, props.selectedWatchgroupResp)
        delete wObj[deletingGroup.current.wId]
        props.storeSelectedWatchGroupResp(wObj)
        deletingGroup.current = null
        getWatchGroup()
    }

    function errorRespCBDeleteWatchGroupName(error) {
        isPendingDeleteGroupRequest.current = false
        props.hideWidgetLoader();
        props.storeToastMsgProps({
            show: true,
            message: error.message,
            error: true
        })
    }

    function onClickDeleteSymbolsIcon() {
        if (!showDeleteCheckbox) {
            setShowDeleteCheckbox(true)
        }
        else {
            if (selectedDeleteSyms.current.length)
                deleteSelectedSymsDialog(selectedDeleteSyms.current.length)
            setShowDeleteCheckbox(false)
        }
    }

    function deleteSelectedSymsDialog(symLength) {
        props.storeWatchlistDialogDetails({
            dialogName: WATCHLIST_DIALOGS.DELETE_SELECTED_SYM,
            parentCB: isDeleteSelectedSyms,
            message: formDeleteSymbolsMsg(symLength)
        })
    }

    function isDeleteSelectedSyms(isDelete) {
        if (isDelete)
            onDeleteSelectedSym()
        else
            clearDeleteSyms()
    }

    function formDeleteSymbolsMsg(symCount) {
        return (
            <div className="deleteMsg-div flex-center" style={{ flexDirection: "column" }}>
                <span className="labelText">
                    {getLangText('WATCHLIST_MSG_DELETE_QUERY')}
                </span>
                <span className="valueText">{symCount}
                    <LangText module="WATCHLIST" name={symCount > 1 ?
                        "SELECTED_SYMBOLS_TXT" : "SELECTED_SYMBOL_TXT"} /> ?</span>
            </div>
        )
    }

    function onSetSelectedDeleteSyms(selectedSymbols) {
        selectedDeleteSyms.current = selectedSymbols
        if (selectedSymbols && selectedSymbols.length)
            setShowClear(true)
        else
            setShowClear(false)
    }

    function clearDeleteSyms(reset = true) {
        selectedDeleteSyms.current = []
        setShowClear(false)
        if (reset)
            setReSetDeleteSyms(true)
    }

    function reSetFlag() {
        setReSetDeleteSyms(false)
        setShowClear(false)
    }

    function onDeleteSelectedSym() {
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.addToData({
            'wName': selectedWatchGroup.wName,
            "symbols": selectedDeleteSyms.current
        })
        request.setEcho(selectedWatchGroup.wId)
        MsfFetch.placeRequest(
            getWatchlistBaseUrl() + WATCHLIST.DELETE_SYMBOLS,
            request,
            successRespCBDeleteSymbols,
            errorRespCBDeleteSymbols
        )
    }

    function successRespCBDeleteSymbols(response) {
        props.hideWidgetLoader()
        props.storeToastMsgProps({
            show: true,
            message: getLangText('WATCHLIST_MSG_DELETE_SYMBOLS_SUCCESS')
        })
        if (response.echo === selectedGroupRef.current.wId) {
            keepSymArray.current = true
            getSymbolsWatchGroupResp(false)
        }
        else {
            let wObj = Object.assign({}, cacheSymbolRespData.current)
            wObj[response.echo] = []
            props.storeSelectedWatchGroupResp(wObj)
        }
        clearDeleteSyms()
    }

    function errorRespCBDeleteSymbols(error) {
        props.hideWidgetLoader()
        props.storeToastMsgProps({
            show: true,
            message: error.message,
            error: true
        })
        clearDeleteSyms()
    }

    function onDeleteIndSym(symList) {
        if (symList && symList.length) {
            selectedDeleteSyms.current = symList
            deleteSelectedSymsDialog(selectedDeleteSyms.current.length)
        }
    }

    function onSortCB(type, key1, sortType, symArray = symbolList) {

        if (sortType === SORT_TYPES.NONE) {
            // if (showFiltericon) {
            //     console.log("finalFilteredList", finalFilteredList)
            //     setSymbolList(finalFilteredList)
            //     // symArray=finalFilteredList
            // }
            // else
            setSymbolList(symArray)

            return
        }
        if (type === "string")
            onSortByStringCB(key1, sortType, symArray)
        else
            onSortByIntCB(key1, sortType, symArray)
    }

    function onSortByIntCB(key1, sortType, symArray) {

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
        } else
            setSortAsc(!sortAsc)
        let sortedSymList = sortByInt(ascSort, symArray, key1)
        setSymbolList(sortedSymList)
        // if (sortedSymList.length)
        //     setSelectedSym(sortedSymList[0])

        if (symArray && symArray.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1)
            setSortFlag(updatedSortFlag)
        }
    }

    function onSortByStringCB(key1, sortType, symArray) {
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
        } else
            setSortAsc(!sortAsc)

        let sortedSymList = sortByString(ascSort, symArray, key1)
        setSymbolList(sortedSymList)
        // if (sortedSymList.length)
        //     setSelectedSym(sortedSymList[0])

        if (symArray && symArray.length > 1) {
            let updatedSortFlag = sortFlagFunc(sortFlag, ascSort, key1)
            setSortFlag(updatedSortFlag)
        }
    }

    function resetSortIcons() {
        let flags = Object.assign([], sortFlag)
        let updatedFlags = flags.map((item) => {
            item.sortAsc = null
            return item
        })
        setSortFlag(updatedFlags)
    }

    function onClickScollRight() {
        let scrollPerClick = Math.ceil(watchGroupScroll.current.scrollWidth * (groupScrollPercentage.current / 100))
        if (watchGroupScroll.current.scrollLeft <= scrollPerClick)
            watchGroupScroll.current.scrollTo(watchGroupScroll.current.scrollLeft + scrollPerClick, 0)
        else
            watchGroupScroll.current.scrollTo(watchGroupScroll.current.scrollWidth, 0)
    }

    function onClickScollLeft() {
        let scrollPerClick = Math.ceil(watchGroupScroll.current.scrollWidth * (groupScrollPercentage.current / 100))
        if (watchGroupScroll.current.scrollLeft >= scrollPerClick)
            watchGroupScroll.current.scrollTo(watchGroupScroll.current.scrollLeft - scrollPerClick, 0)
        else
            watchGroupScroll.current.scrollTo(0, 0)
    }

    function onManualScrollGroup() {
        if (watchGroupScroll.current.scrollLeft === 0)
            setDisableGroupLeftScroll(true)
        else
            setDisableGroupLeftScroll(false)

        if ((Math.ceil(watchGroupScroll.current.scrollLeft) +
            watchGroupScroll.current.clientWidth) >= watchGroupScroll.current.scrollWidth)
            setDisableGroupRightScroll(true)
        else
            setDisableGroupRightScroll(false)
    }

    function showSortDetails() {
        setShowSorting(!showSorting)

    }

    // function showFilter(filterList) {
    //     console.log("filterList", filterList)
    //     if (filterList.length) {
    //         let existHoldng=filterList.findIndex((item) => {
    //             return  item.name==="Holdings"
    //         })
    //         let updatedSybolList=initSymbolList
    //         if(existHoldng === -1){
    //             updatedSybolList=initSymbolList.filter(item=>!item.netQty)
    //         }
    //         console.log("existHoldng",existHoldng)
    //         let filteredList = updatedSybolList.filter((item) => {
    //             let existExc = filterList.findIndex((i) => {
    //                 // console.log("filterList2", i)
    //                 if(existHoldng !== -1){
    //                     console.log("item.netQty",item.netQty)
    //                     return item.netQty
    //                 }
    //                 return i.name === item.sym.exc

    //             })
    //             if (existExc !== -1)
    //                 return item
    //             return null
    //         })
    //         setFinalFilteredList(filteredList)
    //         setSymbolList(filteredList)
    //     } else
    //         setSymbolList(initSymbolList)
    // }
    // console.log("props",props)

    function getFilterList(listItem) {
        setFinalFilteredList(listItem)
    }
    return (
        <div className="watchlistBase">
            {
                (watchGroupList && watchGroupList.length) ?
                    <>
                        <div className="watchlist-header">
                            <div className="header-name">
                                <span className="nameDiv cursor"
                                    onClick={onClickDeleteGroup}
                                >
                                    <span className="name"><LangText module="WATCHLIST" name="WATCHLIST_NAME" /></span>
                                    {/* <span className="name"><LangText name="WATCHLIST_NAME" /></span> */}
                                    <EditWatchlistIcon />
                                </span>
                                <span className="flex-center">
                                    <span className={`clearDeleteSymsBtn ${!showClear ? 'hidden' : ''}`}
                                        onClick={clearDeleteSyms}
                                    >
                                        <u><LangText module="BUTTONS" name="CLEAR_ALL" /></u>

                                    </span>

                                    < span className="sort-icon" onClick={() => showSortDetails()}>
                                        <SortingShowIcon />
                                        {
                                            showFiltericon ?
                                                <span className="orange-dot">•</span>
                                                : ""
                                        }
                                    </span>

                                    <span className={`delete-icon cursor
                                     ${showDeleteCheckbox ? 'selected' : ''}
                                      ${isEditableWatchGroup ? '' : 'not-editable'}`}
                                    onClick={isEditableWatchGroup ? onClickDeleteSymbolsIcon : null}
                                    title={isEditableWatchGroup ?
                                        'Delete Scrip' :
                                        'Not allowed to delete pre-defined watchgroup symbols'}
                                    >
                                        <DeleteIcon />
                                    </span>
                                </span>

                                {
                                    showDeleteGroupWindow ?
                                        <DeleteWatchGroupDialog onCloseCB={() => setShowDeleteGroupWindow(false)}
                                            onDeleteGroupCB={onDeleteWatchGroup}

                                        />
                                        : null
                                }

                                {showSorting ?
                                    <SortWatchListDialogComponent
                                        initSymbolList={initSymbolList}
                                        onCloseCB={() => setShowSorting(false)}
                                        // showFilter={showFilter}
                                        sortFlag={sortFlag}
                                        onSort={onSortCB}
                                        excList={excList}

                                    />
                                    : null
                                }

                            </div>
                            <div className="watchlistDiv highWatchList">
                                <span className={`moveScroll-btn left ${disableGroupLeftScroll ? '' : 'active'}`}
                                    onClick={!disableGroupLeftScroll ? onClickScollLeft : null}
                                >
                                    <LeftArrowIcon2 />
                                </span>
                                <div className="watchlistDisp scroller_firefox" ref={watchGroupScroll}
                                    onScroll={() => onManualScrollGroup()}
                                >
                                    {
                                        watchGroupList.map((item, index) => {
                                            return (
                                                <span key={index}
                                                    ref={selectedWatchGroup.wId === item.wId ?
                                                        selectedGroupBtnRef : null}
                                                    className={`watchGroup flex-center
                                                     ${index === 0 ? 'first' : ''} 
                                                     ${selectedWatchGroup.wId === item.wId ? 'selected' : ''}`}
                                                    onClick={() => onClickGroup(item)}
                                                >
                                                    <span className="wName">{item.wName}</span>
                                                </span>
                                            )
                                        })
                                    }
                                </div>
                                <span className={`moveScroll-btn right ${disableGroupRightScroll ? '' : 'active'}`}
                                    onClick={!disableGroupRightScroll ? onClickScollRight : null}
                                >
                                    <RightArrowIcon2 />
                                </span>
                                <span className={`addWatchlist-btn flex-center
                                 cursor ${disableAddGroup ? 'disabled' : ''}`}
                                onClick={!disableAddGroup ? onClickAddBtn : null}
                                title={disableAddGroup ? getLangText('MAX_GROUP_LIMIT_MSG', 'MESSAGES') : ''}
                                >
                                    <PlusIcon />
                                </span>
                                {
                                    showAddGroupWindow ?
                                        <AddWatchGroupDialogComponent createCB={onAddWatchGroup}
                                            onCloseCB={() => setShowAddGroupWindow(false)}
                                        />
                                        : null
                                }
                            </div>
                        </div>
                        <WatchlistTable
                            symbolList={symbolList}
                            errorMsg={errorMsg}
                            pendingReq={!!((isPendingGroupRequest.current || isPendingSymRequest.current))}
                            showDeleteCheckbox={showDeleteCheckbox}
                            onSetSelectedDeleteSymsCB={onSetSelectedDeleteSyms}
                            reSetDeleteSyms={reSetDeleteSyms}
                            reSetFlagCB={reSetFlag}
                            selectedWatchGroup={selectedWatchGroup}
                            onDeleteIndSymCB={onDeleteIndSym}
                            onSort={onSortCB}
                            sortFlag={sortFlag}
                            resetSortIconsCB={resetSortIcons}
                            showAddBtn={!!isEditableWatchGroup}
                            getFilterList={getFilterList}
                            previousGrpId={previousGrpId}
                            {...props}
                        />
                    </>
                    :
                    (
                        !isPendingGroupRequest.current ?
                            <div className="flex-center emptyWatchlistDiv">
                                <span className="errorMsg">{errorMsg_groups ?
                                    errorMsg_groups : CommonErrorMessages.NO_DATA_AVAIL}</span>
                                <div className="addGroupDiv">
                                    {
                                        isNoDataError ?
                                            <button className="theme-btn addGroup flex-center cursor"
                                                onClick={onClickAddBtn}
                                            >
                                                + <LangText module="BUTTONS" name="ADD_WATCHLIST" />
                                            </button>
                                            :
                                            <button className="theme-btn addGroup flex-center cursor"
                                                onClick={getWatchGroup}
                                            >
                                                <LangText module="BUTTONS" name="RETRY" />
                                            </button>

                                    }
                                    {
                                        showAddGroupWindow ?
                                            <AddWatchGroupDialogComponent createCB={onAddWatchGroup}
                                                onCloseCB={() => setShowAddGroupWindow(false)}
                                            />
                                            : null
                                    }
                                </div>
                            </div>
                            : null
                    )
            }
        </div>
    )
}

const mapStateToProps = ({ watchlist, login, demoTour }) => {
    return {
        watchGroups: watchlist.watchGroups,
        loginStatus: login.loginStatus,
        regetWatchGroups: watchlist.regetWatchGroups,
        regetWatchGroupSymbols: watchlist.regetWatchGroupSymbols,
        selectedWatchgroup: watchlist.selectedWatchgroup,
        selectedWatchgroupResp: watchlist.selectedWatchgroupResp,
        demoTourFlag: demoTour.demoTourFlag,
        sortParams: watchlist.sortParams,
        filterParams: watchlist.filterParams
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeWatchGroups: (s) => { dispatch(storeWatchGroups(s)) },
        storeNewWatchListName: (s) => { dispatch(storeNewWatchListName(s)) },
        storeWatchlistDialogDetails: (s) => { dispatch(storeWatchlistDialogDetails(s)) },
        storeSearchSymWatchlistFlag: (s) => { dispatch(storeSearchSymWatchlistFlag(s)) },
        storeRegetWatchGroups: (s) => { dispatch(storeRegetWatchGroups(s)) },
        storeWatchlistScreenActiveFlag: (s) => { dispatch(storeWatchlistScreenActiveFlag(s)) },
        storeRegetWatchGroupSymbolData: (s) => { dispatch(storeRegetWatchGroupSymbolData(s)) },
        storeSelectedWatchGroupResp: (s) => { dispatch(storeSelectedWatchGroupResp(s)) },
        storeToastMsgProps: (s) => { dispatch(storeToastMsgProps(s)) },
        storeSelectedWatchGroup: (s) => { dispatch(storeSelectedWatchGroup(s)) },
        refreshDemoTour: (s) => { dispatch(refreshDemoTour(s)) },
        setDemoTourFlag: (s) => { dispatch(setDemoTourFlag(s)) },
        storeWatchlistSortParams: (s) => { dispatch(storeWatchlistSortParams(s)) },
        storeWatchlistFilterParams: (s) => { dispatch(storeWatchlistFilterParams(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WidgetLoader(WatchlistBaseComponent));
