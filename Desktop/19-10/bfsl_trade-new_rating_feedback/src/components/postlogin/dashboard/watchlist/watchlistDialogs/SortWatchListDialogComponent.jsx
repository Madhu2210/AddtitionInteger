import React, { useEffect, useRef, useState } from 'react'
import { connect } from "react-redux";

import useCloseModal from '../../../../../customHooksComponents/useCloseModal';

import LangText from '../../../../../common/lang/LangText';
import {
    AscSortingIcon,
    CloseIcon, DscSortingIcon
} from '../../../../common/FontIcons';
import { SORT_DATATYPE, SORT_TYPES, TEXT_ORIENTATION } from '../../../../../common/Constants';
import {
    storeWatchlistFilterParams,
    storeWatchlistSortParams
} from '../../../../../state/actions/Actions';
import { setExcFilterbyWGroup, storeWatchlistFilterParamsToStore,
    storeWatchlistSortParamsToStore } from '../../../../../common/Bridge';

const SortWatchListDialogComponent = (props) => {

    // const [editableGroups] = useState(getEditableWatchgroups())
    const [sortLable, setSortLable] = useState(null)
    const [sortKey, setSortKey] = useState(null)
    // const [holdKey, setHoldKey] = useState(false)

    const [excList, setExcList] = useState([])

    // const isSorting = useRef(false)
    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose)

    useEffect(() => {
        if (props.sortParams) {
            setSortLable(props.sortParams.sortType)
            setSortKey(props.sortParams.key)
        }
        console.log("props.excList", props.excList)

        if (props.excList)
            setExcList(props.excList)
        // if (props.initSymbolList) {
        // let excArray = []
        // Object.keys(props.initSymbolList).map(function (key1) {
        //     if (props.initSymbolList[key1].sym.exc === "NSE") {
        //         let nseIndex = excArray.findIndex((item) => item === "NSE")
        //         console.log("index", nseIndex)
        //         if (excArray && excArray.length >= 0 && nseIndex === -1) {
        //             excArray = [...excArray, "NSE"]
        //             console.log("excArray", excArray)
        //         }
        //     }

        //     else if (props.initSymbolList[key1].sym.exc === "BSE") {
        //         let bseIndex = excArray.findIndex((item) => item === "BSE")
        //         if (excArray && excArray.length >= 0 && bseIndex === -1) {
        //             excArray = [...excArray, props.initSymbolList[key1].sym.exc]
        //         }
        //     } else if (props.initSymbolList[key1].sym.exc === "NFO") {
        //         let nfoIndex = excArray.findIndex((item) => item === "NFO")
        //         if (excArray && excArray.length >= 0 && nfoIndex === -1) {
        //             excArray = [...excArray, props.initSymbolList[key1].sym.exc]
        //         }
        //     }
        //     return excArray

        // })
        //     let excArray = []
        //     props.initSymbolList.map((item) => {
        //         if (item.netQty) {
        //             console.log("yes")
        //         }
        //         let isExeExist = excArray.findIndex((fItem) => {
        //             return fItem.name === item.sym.exc
        //         })
        //         if (isExeExist === -1)
        //             excArray.push({ name: item.sym.exc })
        //     })
        //     let HoldFiltrList = props.initSymbolList.filter(item => item.netQty)
        //     if (HoldFiltrList.length) {
        //         setHoldKey(true)
        //         excArray.push({ name: "Holdings" })
        //     }
        //     let newFiltrList = props.filterParams.filter(item => item.selected)
        //     console.log("newFiltrList", newFiltrList, excArray)
        //     excArray.map((item) => {
        //         newFiltrList.map((item2) => {
        //             console.log("names", item.name, item2.name)
        //             if (item.name === item2.name) {
        //                 item.selected = true

        //             }
        //             return item
        //         }
        //         )
        //     })
        //     console.log("newarray", excArray)
        //     setExcList(excArray)
        // }
    }, [])

    function onClose() {
        props.onCloseCB && props.onCloseCB()
    }

    // function getSortIconCB(column) {
    //     console.log("props.sortFlag", props.sortFlag)
    //     let sortOrder = props.sortFlag.filter((item) => item.column === column)
    //     console.log("sortOrder", sortOrder)
    //     if (sortOrder.length)
    //         return sortOrder[0].sortAsc
    //     return null
    // }

    function onIconSort(type, key, sortType) {
        let sortNone = false
        if (sortKey === key && sortLable === sortType) {
            sortNone = true
            setSortLable(null)
            setSortKey(null)
        } else {
            setSortLable(sortType)
            setSortKey(key)
        }
        if (sortNone) {
            props.onSort && props.onSort(type, key, SORT_TYPES.NONE)
            storeWatchlistSortParamsToStore({
                varType: type,
                key: key,
                sortType: SORT_TYPES.NONE
            })
        }
        else {
            storeWatchlistSortParamsToStore({
                varType: type,
                key: key,
                sortType: sortType
            })

            // props.storeWatchlistSortParams({
            //     varType: type,
            //     key: key,
            //     sortType: sortType
            // })
        }
    }

    function onClickFilter(excType) {

        let excArray = Object.assign([], excList)
        excArray = excList.map((item) => {
            if (item.name === excType)
                item.selected = !item.selected
            return item
        })
        let filteredExcArray = excArray.filter(item => item.selected)
        setExcList(excArray)
        // props.showFilter && props.showFilter(filteredExcArray)
        storeWatchlistFilterParamsToStore(filteredExcArray)
    }

    // function getSortIconCB(column) {
    //     console.log("i", props.sortFlag)
    //     let sortOrder = props.sortFlag.filter((item) => item.column === column)
    //     if (sortOrder.length)
    //         return sortOrder[0].sortAsc
    //     return null
    // }

    // function onSort(type, key1,order) {
    //     isSorting.current = true
    //     props.onSort && props.onSort(type, key1, null)
    //     if(order==="atoz"){
    //         setAscSymSort(!ascSymSort)
    //     }else
    //         setDscSymSort(!dscSymSort)
    // }
    // console.log("holdKey", holdKey)
    // if (props.showSorting)
    //     return null
    function resetSort() {
        setExcFilterbyWGroup(null, true)
        // props.storeWatchlistSortParams({})
        let showExcArray = Object.assign([], excList)
        showExcArray = excList.map((item) => {

            item.selected = false
            return item
        })
        setExcList(showExcArray)
        setSortLable(null)
        setSortKey(null)
    }
    return (
        <div className="sortWatchlistDropdown scrollArea" ref={modalRef}>
            <div className="sorting-div">
                <div className="head-div">
                    <span><LangText name="FILTER_SORT" /></span>
                    <span ><CloseIcon onClick={onClose} /></span>
                </div>

                <div className="sort-body">
                    {
                        excList && excList.length ?
                            <div className="filter-div">
                                {/* <div className="for-rest">
                                    <span className="filter-head">
                                        <LangText name="WACTH_FILTER" />
                                    </span>
                                    <button className="reset-btn" onClick={resetSort}>
                                        <LangText name="RESET"
                                            orientation={TEXT_ORIENTATION.PASCALCASE} />
                                    </button>
                                </div> */}
                                <div className="filter-Body">
                                    <div className="filterBtn">
                                        {
                                            excList.map((item, index) => {
                                                return (
                                                    <div key={index} className="cursor filtr-body"
                                                        onClick={() => onClickFilter(item.name)}>
                                                        {/* <span className="filtr-checkbox">
                                                        {item.selected ?

                                                            <CheckBoxIcon_Checked />
                                                            :
                                                            <CheckBoxIcon_UnChecked />
                                                        }
                                                    </span> */}
                                                        <span className={`${item.selected ? 'hilighted' : ''}`}>
                                                            {item.name}
                                                        </span>

                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="for-rest">
                                        <button className="reset-btn" onClick={resetSort}>
                                            <LangText name="RESET"
                                                orientation={TEXT_ORIENTATION.PASCALCASE} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            : null
                    }
                    <div className="sort-div">
                        <div className="filter-head">
                            <LangText name="WATCH_SORT" /></div>
                        <div className="sortlist">
                            <div className="row-div">
                                <span className="label">
                                    <LangText name="WATCH_ALPHABETIC" /></span>
                                <span className={`sorticon cursor 
                                ${sortLable === SORT_TYPES.ASC && sortKey === "dispSym" ? 'active' : ''}`}
                                onClick={() => onIconSort(SORT_DATATYPE.STRING, "dispSym", SORT_TYPES.ASC)}
                                >
                                    A
                                    <AscSortingIcon />
                                    Z
                                </span>
                                <span className={`sorticon cursor 
                                ${sortLable === SORT_TYPES.DESC && sortKey === "dispSym" ? 'active' : ''}`}
                                onClick={() => onIconSort(SORT_DATATYPE.STRING, "dispSym", SORT_TYPES.DESC)}

                                >
                                    Z
                                    <DscSortingIcon />
                                    A
                                </span>
                            </div>
                            <div className="row-div">
                                <span className="label">
                                    <LangText name="WATCH_LTP" /></span>
                                <span className={`sorticon cursor ${sortLable === SORT_TYPES.ASC && sortKey === "ltp" ?
                                    'active' : ''}`}
                                onClick={() => onIconSort(SORT_DATATYPE.INT, "ltp", SORT_TYPES.ASC)}
                                >
                                    ₹
                                    <AscSortingIcon />
                                </span>
                                <span className={`sorticon  cursor 
                                ${sortLable === SORT_TYPES.DESC && sortKey === "ltp" ? 'active' : ''}`}
                                onClick={() => onIconSort(SORT_DATATYPE.INT, "ltp", SORT_TYPES.DESC)}

                                >
                                    ₹
                                    <DscSortingIcon />
                                </span>
                            </div>
                            <div className="row-div">
                                <span className="label">
                                    <LangText name="WATCH_CHNG" /></span>
                                <span className={`sorticon cursor 
                                ${sortLable === SORT_TYPES.ASC && sortKey === "chngPer" ? 'active' : ''}`}
                                onClick={() => onIconSort(SORT_DATATYPE.INT, "chngPer", SORT_TYPES.ASC)}

                                >
                                    %
                                    <AscSortingIcon />

                                </span>
                                <span className={`sorticon cursor 
                                ${sortLable === SORT_TYPES.DESC && sortKey === "chngPer" ? 'active' : ''}`}
                                onClick={() => onIconSort(SORT_DATATYPE.INT, "chngPer", SORT_TYPES.DESC)}

                                >
                                    %
                                    <DscSortingIcon />

                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ watchlist }) => {
    return {
        filterParams: watchlist.filterParams,
        sortParams: watchlist.sortParams
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeWatchlistSortParams: (s) => { dispatch(storeWatchlistSortParams(s)) },
        storeWatchlistFilterParams: (s) => { dispatch(storeWatchlistFilterParams(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SortWatchListDialogComponent);
