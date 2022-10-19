/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react'

import LangText, { getLangText } from '../../common/lang/LangText'
import Input from './InputComponent'

import { CalenderEditIcon, DownArrowIcon, SearchIcon } from './FontIcons'
import { LANG_TEXT_KEY } from '../../common/Constants'
import { convertToUpperCase, getColorCode, isValidSearchInput } from '../../common/CommonMethods'

const SelectInputComponent = (props) => {

    const [optionList, setOptionList] = useState([])
    const [filteredOptionList, setFilteredOptionList] = useState([])
    const [selectedOption, setSelectedOption] = useState('')
    const [selectedOptionVal2, setSelectedOptionVal2] = useState('')
    const [selectedLangOption, setSelectedLangOption] = useState('')
    const [showOptions, setShowOptions] = useState('')
    // const [cursor, setCursor] = useState(0)
    const [searchString, setSearchString] = useState('')

    const allowEnterOnFocus = useRef(true)
    const optionRef = useRef()
    const dropDownRef = useRef(null)
    const selectRef = useRef(null)
    const searchInputRef = useRef(null)

    useEffect(() => {
        if (props.hasSearch) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showOptions])

    function handleClickOutside(eve) {
        if (showOptions) {
            if (selectRef.current && !selectRef.current.contains(eve.target)) {
                setShowOptions(false)
            }
        }
    }

    useEffect(() => {
        if (props.optionList && props.optionList.length) {
            setOptionList(props.optionList)
            setFilteredOptionList(props.optionList)
        }
    }, [props.optionList])

    useEffect(() => {
        if (props.preSelect) {
            if (!props.selectedOption && props.selectedOption !== '') {
                if (props.optionList && props.optionList.length) {
                    if (props.excludeFirstOption) {
                        setSelectedOption(props.optionList[1][props.value])
                        // setCursor(1)
                    }
                    else
                        setSelectedOption(props.optionList[0][props.value])
                }
            }
            else {
                setSelectedOption(props.selectedOption)
                // props.optionList.map((item, index) => {
                //     if (item[props.value] === props.selectedOption)
                //         setCursor(index)
                // })
            }
        }
        else if (props.selectedOption) {
            setSelectedOption(props.selectedOption)
        } else
            setSelectedOption(props.preSelectText ? props.preSelectText : 'please select')

    }, [props.optionList, props.selectedOption])

    useEffect(() => {
        if (selectedOption) {
            if (props.hasLangageDependent ) {
                let selectedLangText = null
                props.optionList.map((item) => {
                    if (item[props.value] === selectedOption)
                        selectedLangText = item[LANG_TEXT_KEY]
                    if (props.value2)
                        setSelectedOptionVal2(item[props.value2])
                })
                if (selectedLangText)
                    setSelectedLangOption(selectedLangText)
            }
            if (props.value2) {
                props.optionList.map((item) => {
                    if (item[props.value] === selectedOption)
                        setSelectedOptionVal2(item[props.value2])
                })
            }
        }
    }, [selectedOption])

    useEffect(() => {
        if (!showOptions) {
            clearData()
        } else {
            let elem = document.getElementById("options-div" + props.parent);
            if (elem)
                elem.scrollTo(0, 0);
            if (searchInputRef.current)
                searchInputRef.current.focus()
        }
        props.sendShowOptionFlag && props.sendShowOptionFlag(showOptions)
    }, [showOptions])

    function onClickSelect() {
        allowEnterOnFocus.current = false
        setShowOptions(!showOptions)
    }

    function onSelectOption(e, item, index, suboption = false) {
        if (index === 0 && props.excludeFirstOption) {
            //empty
        } else {
            if (suboption)
                setSelectedOption(props.subOptionValue ? item[props.subOptionValue] : item)
            else
                setSelectedOption(props.value ? item[props.value] : item)
            // setCursor(index)
        }
        props.onSelectValueCB && props.onSelectValueCB(item, index)
        clearData()
    }

    // function onHandleKeyDown(e) {
    //     if (e.key === "Enter" && allowEnterOnFocus.current) {
    //         allowEnterOnFocus.current = false
    //         setShowOptions(true)
    //     } else if (showOptions) {
    //         if (filteredOptionList.length) {

    //             if (e.keyCode === 38 && cursor > 0) {
    //                 setCursor(cursor - 1)
    //             } else if (e.keyCode === 40 && cursor < filteredOptionList.length - 1) {
    //                 setCursor(cursor + 1)
    //             }

    //             if (e.key === "Enter") {
    //                 onSelectOption(filteredOptionList[cursor], cursor)
    //                 allowEnterOnFocus.current = true;
    //             }
    //         }

    //         if (e.keyCode === 27) {
    //             clearData();
    //         }
    //     }
    // }

    function onFocusOut() {
        if (!props.hasSearch)
            clearData()
    }

    function clearData() {
        setSearchString('')
        setShowOptions(false)
        if (props.hasSearch)
            setFilteredOptionList(optionList)
        allowEnterOnFocus.current = true
    }

    function onClickInnerAction(e, item, index) {
        e.stopPropagation()
        props.onClickInnerActionCB && props.onClickInnerActionCB(item, index)
    }

    function onSearchOptions(e) {
        if (!isValidSearchInput(e.target.value)) {
            setSearchString(e.target.value)
            if (e.target.value.length) {
                let list = Object.assign([], optionList)
                let updatedList = list.filter(item =>
                    convertToUpperCase(item[props.value]).includes(convertToUpperCase(e.target.value)))
                setFilteredOptionList(updatedList)
            } else
                setFilteredOptionList(optionList)
        }
    }

    function onClickSearchSpan(e) {
        e.stopPropagation()
    }

    return (
        <div className={`select-input-div 
        ${props.hiddenScroll ? 'hiddenScroll' : " "}
        ${props.symSearch ? 'symbolSearch' : 'non-symbolSearch'} ${props.className}`}>
            <div className="select-input"
                tabIndex={props.tabIndex ? props.tabIndex : '1'}
                onClick={onClickSelect}
                // onKeyDown={(e) => onHandleKeyDown(e)}
                onBlur={onFocusOut}
                test_id={props.test_id ? props.test_id : ''}
                ref={selectRef}
            >
                {
                    props.hasLangageDependent ?
                        // (props.langModule ?
                        <div className="select-value text-nowrap"
                            title={getLangText(selectedLangOption)}>
                            {
                                <LangText  name={selectedLangOption}/>
                            }
                        </div>
                        //     :
                        //     <div className="select-value text-nowrap" title={selectedOption}>
                        //         {selectedOption}
                        //     </div>
                        // )
                        :
                        <div className="select-value text-nowrap"
                            title={selectedOption + (props.value2 ? (',  ' + selectedOptionVal2) : '')}>
                            {selectedOption} <span>{props.value2 ? ", " : null}</span>
                            <span className="select-value2">{props.value2 ? selectedOptionVal2 : null}</span>
                        </div>
                }
                {
                    props.direction_up ?
                        <DownArrowIcon key="up" className={showOptions ? 'faceDown' : 'faceUp'} />
                        :
                        <DownArrowIcon key="down" className={showOptions ? 'faceUp' : 'faceDown'} />
                }

                <div className={`options-div-base ${showOptions ? '' : 'hidden'}`}>
                    {
                        props.hasSearch ?
                            <span className="search-option input-addOn" onClick={(e) => onClickSearchSpan(e)}>
                                <SearchIcon className="addOn-icon" />
                                <Input
                                    className="searchInput"
                                    value={searchString}
                                    onChange={onSearchOptions}
                                    placeholder={getLangText('SEARCH', 'MESSAGES')}
                                    ref={searchInputRef}
                                />
                            </span>
                            : null
                    }
                    <div ref={dropDownRef} id={'options-div' + props.parent ? props.parent : ''}
                        className={`options-div ${showOptions ? 'showOption scroller_firefox' : 'hidden'}`}
                    >
                        <>
                            {
                                (filteredOptionList && filteredOptionList.length) ?
                                    filteredOptionList.map(function (item, index) {
                                        return (
                                            <span key={index}
                                                id={item[props.value] === selectedOption ?
                                                    ('selectedOption' + props.parent ? props.parent : '') : ''}
                                                className={`${(props.hasSubOption && item[props.subOptionKey]) ?
                                                    'hasSubOption' : 'option'} ${props.value ? (selectedOption.sym ?
                                                    (selectedOption.sym.id === item.sym.id ?
                                                        'active-option' : '') : '') :
                                                    (selectedOption === item ? 'active-option' : '')} ${(props.value ?
                                                    item[props.value] : item) === selectedOption ? 'selected' : ''} 
                                                        ${(index === 0 && props.excludeFirstOption) ?
                                                'action-option' : ''} 
                                                        ${(index == (filteredOptionList.length - 1)) ? 'last' : ''}`
                                                }
                                                onClick={(props.hasSubOption && item[props.subOptionKey]) ?
                                                    null : (e) => onSelectOption(e, item, index)
                                                }
                                                ref={optionRef}
                                                test_id={item.test_id ? item.test_id : ''}
                                            >
                                                {
                                                    (item[LANG_TEXT_KEY]) ?
                                                        <span className={`text-nowrap 
                                                        ${(props.hasSubOption && item[props.subOptionKey]) ?
                                                "parentOption" : ""}`}
                                                        title={getLangText(item[LANG_TEXT_KEY])}
                                                        >
                                                            {item.fontIcon ? item.fontIcon : ''}
                                                            <LangText 
                                                                name={item[LANG_TEXT_KEY]}
                                                            />
                                                        </span>
                                                        :
                                                        <span className={`text-nowrap 
                                                        ${(props.hasSubOption && item[props.subOptionKey]) ?
                                                "parentOption" : ""}`
                                                        }
                                                        title={item[props.value] +
                                                                (props.value2 ? ',  ' + item[props.value2] : '')}>
                                                            {item.fontIcon ? item.fontIcon : ''}
                                                            {(props.value ?
                                                                item[props.value] : item) + (props.value2 ? ',  ' : '')}
                                                            {props.value2 ?
                                                                <span className="select-value2">
                                                                    {item[props.value2]}
                                                                </span>
                                                                : ''
                                                            }
                                                        </span>
                                                }
                                                {
                                                    props.hasInnerAction ?
                                                        (index === 0 && props.excludeFirstOption) ?
                                                            null
                                                            :
                                                            item.editable ?
                                                                < span className="innerAction-btn"
                                                                    onClick={(e) => onClickInnerAction(e, item, index)}>
                                                                    {props.actionIcon ? <props.actionIcon /> : 'D'}
                                                                </span>
                                                                : null
                                                        :
                                                        null
                                                }
                                                {
                                                    props.hasChngPer ?
                                                        <span className={getColorCode(item[props.optValKey])}>
                                                            {
                                                                item[props.optValKey] ? item[props.optValKey]
                                                                    : ""
                                                            }</span>
                                                        : null
                                                }
                                                {
                                                    props.hasOptVal ?
                                                        <span>
                                                            {
                                                                item[props.optValKey] ? item[props.optValKey]
                                                                    : ""
                                                            }</span>
                                                        : null
                                                }
                                                {
                                                    props.sign ?
                                                        <span className="sign-symbols">
                                                            {
                                                                item[props.signKey] ? item[props.signKey]
                                                                    : ""
                                                            }
                                                        </span>
                                                        :
                                                        null
                                                }
                                                {
                                                    props.customDate ?
                                                        <span className="custom-date">
                                                            {
                                                                item[props.iconEnableKey] ?
                                                                    <CalenderEditIcon className="date-icon-bo" />
                                                                    : ""

                                                            }
                                                        </span>
                                                        :
                                                        null
                                                }
                                                {
                                                    props.hasSubOption ?
                                                        (
                                                            item[props.subOptionKey] ?
                                                                item[props.subOptionKey].map((subItem, subIndex) => {
                                                                    return (
                                                                        <span key={subIndex}
                                                                            className={`option subOption
                                                                        ${(props.subOptionValue ?
                                                                            subItem[props.subOptionValue] :
                                                                            subItem) === selectedOption
                                                                            ? 'selected' : ''}`
                                                                            }
                                                                            onClick={(e) =>
                                                                                onSelectOption(e,
                                                                                    subItem, subIndex,
                                                                                    true
                                                                                )
                                                                            }
                                                                        >
                                                                            {props.subOptionValue ?
                                                                                subItem[props.subOptionValue] :
                                                                                subItem
                                                                            }
                                                                        </span>
                                                                    )
                                                                })
                                                                : null
                                                        )
                                                        : null
                                                }
                                            </span>
                                        )
                                    })
                                    :
                                    <span className="noData" style={{ fontSize: '12px', padding: '12px' }}>
                                        {
                                            props.errorMsg ?
                                                <span>{props.errorMsg}</span>
                                                :
                                                <LangText name="COMMON_NO_DATA" />
                                        }
                                    </span>
                            }
                        </>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default SelectInputComponent;