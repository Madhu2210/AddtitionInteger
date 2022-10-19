import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'

// import { connect } from "react-redux";

import Select from '../../../common/SelectInputComponent'

import LangText, { getLangText } from '../../../../common/lang/LangText';
import FinancialLedgerComponent from './FinancialLedgerComponent'
import FundTransactionComponent from './FundTransactionComponent'
import TradeSummaryComponent from './TradeSummaryComponent'
import CostReportComponent from './CostReportComponent'
import ContractNoteDownloadComponent from './ContractNoteDownloadComponent'
import ViewLastTransactionComponent from './ViewLastTransactionComponent'
import ClientHoldingsComponent from './ClientHoldingsComponent'
import DpTransactionComponent from './DpTransactionComponent'
import InterestReportComponent from './InterestReportComponent'
import TaxReportComponent from './TaxReportComponent';
import DateRangePicker from '../../../common/datePicker/DateRangePickerComponent';
import InputComponent from '../../../common/InputComponent';
import BrokerageReportComponent from './BrokerageReportComponent';

import {
    AF_EventTriggered,
    checkInt, convertCommaSeparated, convertToFloat,
    getCurrentFinancialYear, getFormatedDate, getTaxReportFinancialYearRanges, replaceComma
} from '../../../../common/CommonMethods';
import {
    BO_REPORTS_MENUS, BO_REPORTS_MENUS_ARRAY,
    BO_REPORTS_FILTER, BO_REPORT_TYPES, BO_REPORTS_FILTER_MENU,
    SCREENS, BO_REPORT_FINANCIAL_TYPES, BO_REPORTS_FINANCIAL_FILTER,
    BO_REPORTS_FINANCIAL_OPTIONS,
    BO_REPORTS_INTEREST_REPORT_TYPES, BO_REPORTS_TAB_OPTIONS,
    DATE_FORMATS, BO_REPORTS_PNL_FILTER,
    BO_REPORTS_PNL_FILTER_MENU, BO_REPORTS_PNL_HOLDINGS_FILTER,
    BO_REPORTS_BROKERAGE_FILTER,BO_REPORTS_BROKERAGE_FILTER_MENU, TEXT_ORIENTATION,
    AF_EVENT_NAMES, AF_EVENT_TYPES
} from '../../../../common/Constants';
import { DownloadIcon, LeftArrowIcon2, RightArrowIcon2, SearchIcon } from '../../../common/FontIcons';
import DividendReportComponent from './DividendReportComponent';
import LTCGReportComponent from './LTCGReportComponent';
import DownloadAsComponent from './DownloadAsComponent';
import useCloseModal from '../../../../customHooksComponents/useCloseModal';
import PNLReportComponent from './PNLReportComponent';
import DPBillChargesComponent from './DPBillChargesComponent';
import { storeClientHoldingsEVoteFlag, storeEVotingScreenFlag, 
    storeNavigateFromHoldings } from '../../../../state/actions/Actions';
import { feedbackOnLogout } from '../../../../../src/common/Bridge';

function BOReportsBaseComponent(props) {

    const [boInterval] = useState(BO_REPORTS_FILTER)
    const [boFinancialInterval] = useState(BO_REPORTS_FINANCIAL_FILTER)
    const [boTaxInterval, setBoTaxInterval] = useState([])
    const [boPNLInterval] = useState(BO_REPORTS_PNL_FILTER)
    const [boBrokerageInterval] = useState(BO_REPORTS_BROKERAGE_FILTER)
    const [boPNLHoldingsTypes] = useState(BO_REPORTS_PNL_HOLDINGS_FILTER)

    const [selectedOrderType, setSelectedOrderType] = useState(BO_REPORT_TYPES[0])
    const [selectedFinancialType, setSelectedFinancialType] = useState(BO_REPORT_FINANCIAL_TYPES[0])
    const [selectedInterestReportType, setSelectedInterestReportType] = useState(BO_REPORTS_INTEREST_REPORT_TYPES[0])
    const [boTypes] = useState(BO_REPORT_TYPES)
    const [boFinancialTab] = useState(BO_REPORT_FINANCIAL_TYPES)
    const [boInterestReportTab] = useState(BO_REPORTS_INTEREST_REPORT_TYPES)
    const [boSelectedFilter, setBOSelectedFilter] = useState(BO_REPORTS_FILTER[0])
    const [boSelectedTaxInterval, setBOSelectedTaxInterval] = useState(getTaxReportFinancialYearRanges()[0])
    const [boSelectedTaxIndex, setBOSelectedTaxIndex] = useState(0)

    const [boSelectedFinancialFilter, setBOSelectedFinancialFilter] = useState(BO_REPORTS_FINANCIAL_FILTER[0])
    const [boSelectedPNLInterval, setBOSelectedPNLInterval] = useState(BO_REPORTS_PNL_FILTER[0])
    const [boSelectedBrokerageInterval, setBOSelectedBrokerageInterval] = useState(BO_REPORTS_BROKERAGE_FILTER[0])
    const [boSelectedPNLHoldingsType, setBOSelectedPNLHoldingsType] = useState(BO_REPORTS_PNL_HOLDINGS_FILTER[0])
    const [chosenHoldingType, setChosenHoldingType] = useState(BO_REPORTS_PNL_HOLDINGS_FILTER[0].key)
    // const [holdingsType, setHoldingsType] = useState('')
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [startDateQuick, setStartDateQuick] = useState(null)
    const [endDateQuick, setEndDateQuick] = useState(null)
    const [selectedMenu, setSelectedMenu] = useState(BO_REPORTS_MENUS_ARRAY[0].name)
    const [showCalenderCustom, setShowCalenderCustom] = useState(false)
    const searchInputRef = useRef(null)
    const [searchValue, setSearchValue] = useState('')
    const [showInputsearch, setshowInputSearch] = useState(false)
    const [params, setParams] = useState({})
    const [disableGroupLeftScroll, setDisableGroupLeftScroll] = useState(true)
    const [disableGroupRightScroll, setDisableGroupRightScroll] = useState(false)
    const [startQuick, setStartQuick] = useState(null)
    const [approximateTaxDerivative, setApproximateTaxDerivative] = useState('')
    const [approximateTaxEquity, setApproximateTaxEquity] = useState('')
    const [taxPercentDer, setTaxPercentDer] = useState('30')
    const [downloadUrl, setDownloadUrl] = useState(true)
    const [showDownloadOptions, setShowDownloadOptions] = useState(false)
    const [pdfDownloadUrl, setPdfDownloadUrl] = useState('')
    const [xlsxDownloadUrl, setXlsxDownloadUrl] = useState('')
    const [boReportsMenuArray, setboReportsMenuArray] = useState([])
    const [showCustom, setShowCustom] = useState(false)

    const watchGroupScroll = useRef(null)
    const groupScrollPercentage = useRef(20)
    const [currentDate, setCurrentDate] = useState("")
    const selectedMenuBtnRef = useRef(null)

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose, false)

    useEffect(() => {
        const timeOutReport = setTimeout(feedbackOnLogout, 5000);
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.BO_REPORT)
    }, [])

    useEffect(() => {
        setBoTaxInterval(getTaxReportFinancialYearRanges())
        getCurrentDate()
        getInitialValues()
        getQuickStartDate()
        getBOReportsMenuArray()
    }, [])

    useEffect(() => {
        if(props.navigateFromHoldings) {
            setSelectedMenu(BO_REPORTS_MENUS_ARRAY[2].name)
            props.storeNavigateFromHoldings(false)
        }
    }, [props.navigateFromHoldings])

    useEffect(() => {
        setTaxPercentDer('30')
    }, [selectedOrderType, boSelectedTaxInterval])
    useEffect(() => {
        if(props.deepLinkEvote){
            setSelectedMenu(BO_REPORTS_MENUS_ARRAY[1].name)
            props.storeClientHoldingsEVoteFlag(true)
        }
    }, [props.deepLinkEvote])

    useEffect(() => {
        if (showInputsearch)
            if (searchInputRef.current)
                searchInputRef.current.focus()
    }, [showInputsearch])

    useEffect(() => {
        dateEnableCustom()
    }, [boSelectedFilter, boSelectedPNLInterval,boSelectedBrokerageInterval])

    // useEffect(() => {
    //     setBOSelectedFilter(BO_REPORTS_FILTER[0])
    //     setBOSelectedFinancialFilter(BO_REPORTS_FINANCIAL_FILTER[0])
    //     setBOSelectedPNLInterval(BO_REPORTS_PNL_FILTER[0])
    // }, [selectedOrderType])

    useEffect(() => {
        if (selectedMenu) {
            if (selectedMenu === BO_REPORTS_MENUS.FINANCIAL_LEDGER) {
                if (selectedFinancialType.name === BO_REPORTS_FINANCIAL_OPTIONS.DETAILED_REPORT) {
                    // onSelectItem(boSelectedFilter)
                    dateEnableCustom()
                }
                else {
                    // getInitialDates()
                    setShowCalenderCustom(false)
                }
            }
            else if (selectedMenu === BO_REPORTS_MENUS.TAX_REPORT) {
                taxOnSelect(boSelectedTaxInterval)
                dateEnableCustom()
            }
            else if (selectedMenu === BO_REPORTS_MENUS.PNL_REPORT) {
                // PNLOnSelect(boSelectedPNLInterval)
                dateEnableCustom()
            }
            else if (selectedMenu === BO_REPORTS_MENUS.BROKERAGE_REPORT) {
                BrokerageOnSelect(boSelectedBrokerageInterval)
                dateEnableCustom()
            }
            else {
                dateEnableCustom()
                // getInitialDates()
                // setShowCalenderCustom(false)
                // setBOSelectedFilter(BO_REPORTS_FILTER[0])
            }
        }
    }, [selectedMenu])

    // useEffect(() => {
    //     if (selectedFinancialType) {

    //         if (selectedFinancialType.name === BO_REPORTS_FINANCIAL_OPTIONS.QUICK_SNAPSHOT) {
    //             // getInitialDates()
    //             setShowCalenderCustom(false)
    //             setBOSelectedFilter(BO_REPORTS_FILTER[0])
    //         }
    //         else {
    //             // onSelectItem(boSelectedFilter)
    //             dateEnableCustom()
    //         }
    //     }
    // }, [selectedFinancialType])

    useEffect(() => {
        if (selectedMenuBtnRef.current)
            selectedMenuBtnRef.current.scrollIntoView()
    }, [selectedMenu])

    useEffect(() => {
        let getParams = {
            selectedMenu: selectedMenu,
            boSelectedFilter: boSelectedFilter,
            startDate: startDate,
            endDate: endDate,
            boSelectedFinancialFilter: boSelectedFinancialFilter,
            selectedOrderType: selectedOrderType,
            searchValue: searchValue,
            selectedFinancialType: selectedFinancialType,
            selectedInterestReportType: selectedInterestReportType,
            boSelectedTaxInterval: boSelectedTaxInterval,
            boSelectedTaxIndex: boSelectedTaxIndex,
            startDateQuick: startDateQuick,
            endDateQuick: endDateQuick,
            boSelectedPNLInterval: boSelectedPNLInterval,
            boSelectedBrokerageInterval: boSelectedBrokerageInterval,
            chosenHoldingType: chosenHoldingType
        }
        setParams(getParams)
    }, [selectedMenu, boSelectedFilter, startDate, endDate,
        boSelectedFinancialFilter, selectedOrderType, searchValue, selectedFinancialType,
        selectedInterestReportType, boSelectedTaxInterval, boSelectedTaxIndex, startDateQuick, endDateQuick,
        boSelectedPNLInterval, boSelectedBrokerageInterval, chosenHoldingType])

    useEffect(() => {
        setApproximateTaxEquity(props.approxTaxEquity)
    }, [props.approxTaxEquity])

    useEffect(() => {
        let apprTaxDer;
        if (props.totalPnlDer !== '') {
            if (convertToFloat(props.totalPnlDer) > 0) {
                apprTaxDer = convertCommaSeparated((convertToFloat(replaceComma(props.totalPnlDer) * taxPercentDer)
                    / 100))
            }
            else {
                apprTaxDer = 0
            }
        }
        else {
            apprTaxDer = ""
        }
        setApproximateTaxDerivative(apprTaxDer)
    }, [props.totalPnlDer, taxPercentDer])

    useEffect(() => {
        if(props.navigateFromHoldings) {
            setSelectedMenu(BO_REPORTS_MENUS_ARRAY[2].name)
            props.storeNavigateFromHoldings(false)
        }
    }, [props.navigateFromHoldings])

    function getCurrentDate() {
        let date = new Date();
        let current = getFormatedDate(date, 0, DATE_FORMATS.DDMMYYYY_HYPEN, true).stringDate
        setCurrentDate(current)
    }

    function getInitialValues() {
        getInitialDates()
    }

    function getInitialDates() {
        let date = new Date();
        let first = new Date(date.getFullYear(), date.getMonth(), 1);
        setStartDate(first)
        setEndDate(date)

    }

    function onSelectItem(item) {
        let date = new Date();
        let firstDay = ''
        let lastDay = ''
        if (item.name === BO_REPORTS_FILTER_MENU.THIS_MONTH) {
            firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            lastDay = new Date();
        }
        else if (item.name === BO_REPORTS_FILTER_MENU.LAST_MONTH) {
            firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
        }
        else if (item.name === BO_REPORTS_FILTER_MENU.CURRENT_FY) {
            let currentFyearStart = new Date(getCurrentFinancialYear(date).startDate);
            let currentFyearEnd = new Date(getCurrentFinancialYear(date).endDate);
            firstDay = new Date(currentFyearStart.getFullYear(), currentFyearStart.getMonth(), 1)
            lastDay = new Date(currentFyearEnd.getFullYear(), currentFyearEnd.getMonth(), 31)
        }
        else if (item.name === BO_REPORTS_FILTER_MENU.LAST_FY) {
            let currentFyearStart = new Date(getCurrentFinancialYear(date).startDate);
            let currentFyearEnd = new Date(getCurrentFinancialYear(date).endDate);
            firstDay = new Date(currentFyearStart.getFullYear() - 1, currentFyearStart.getMonth(), 1)
            lastDay = new Date(currentFyearEnd.getFullYear() - 1, currentFyearEnd.getMonth(), 31)
        }
        else if (item.name === BO_REPORTS_FILTER_MENU.CUSTOM_DATE) {
            firstDay = new Date();
            firstDay.setHours(0, 0, 0, 0);
            lastDay = new Date();
        }
        setStartDate(firstDay)
        setEndDate(lastDay)
        setBOSelectedFilter(item)
    }

    function taxOnSelect(item, index) {
        setBOSelectedTaxInterval(item)
        setBOSelectedTaxIndex(index)
    }

    function PNLOnSelect(item) {
        let date = new Date();
        let firstDay = ''
        let lastDay = ''
        if (item.name === BO_REPORTS_PNL_FILTER_MENU.THIS_MONTH) {
            firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            lastDay = new Date();
        }
        else if (item.name === BO_REPORTS_PNL_FILTER_MENU.LAST_MONTH) {
            firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
        }
        else if (item.name === BO_REPORTS_PNL_FILTER_MENU.CURRENT_FY) {
            let currentFyearStart = new Date(getCurrentFinancialYear(date).startDate);
            let currentFyearEnd = new Date(getCurrentFinancialYear(date).endDate);
            firstDay = new Date(currentFyearStart.getFullYear(), currentFyearStart.getMonth(), 1)
            lastDay = new Date(currentFyearEnd.getFullYear(), currentFyearEnd.getMonth(), 31)
        }
        else if (item.name === BO_REPORTS_PNL_FILTER_MENU.LAST_FY) {
            let currentFyearStart = new Date(getCurrentFinancialYear(date).startDate);
            let currentFyearEnd = new Date(getCurrentFinancialYear(date).endDate);
            firstDay = new Date(currentFyearStart.getFullYear() - 1, currentFyearStart.getMonth(), 1)
            lastDay = new Date(currentFyearEnd.getFullYear() - 1, currentFyearEnd.getMonth(), 31)
        }
        else if (item.name === BO_REPORTS_PNL_FILTER_MENU.CUSTOM_DATE) {
            firstDay = new Date();
            firstDay.setHours(0, 0, 0, 0);
            lastDay = new Date();
        }
        setStartDate(firstDay)
        setEndDate(lastDay)
        setBOSelectedPNLInterval(item)
    }

    function BrokerageOnSelect(item) {
        let date = new Date();
        let firstDay = ''
        let lastDay = ''
        if (item.name === BO_REPORTS_BROKERAGE_FILTER_MENU.THIS_MONTH) {
            firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            lastDay = new Date();
        }
        else if (item.name === BO_REPORTS_BROKERAGE_FILTER_MENU.LAST_MONTH) {
            firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
        }
        else if (item.name === BO_REPORTS_BROKERAGE_FILTER_MENU.CURRENT_FY) {
            let currentFyearStart = new Date(getCurrentFinancialYear(date).startDate);
            let currentFyearEnd = new Date(getCurrentFinancialYear(date).endDate);
            firstDay = new Date(currentFyearStart.getFullYear() , currentFyearStart.getMonth(), 1)
            lastDay = new Date(currentFyearEnd.getFullYear() , currentFyearEnd.getMonth(), 31)
        }
        else if (item.name === BO_REPORTS_BROKERAGE_FILTER_MENU.LAST_FY) {
            let currentFyearStart = new Date(getCurrentFinancialYear(date).startDate);
            let currentFyearEnd = new Date(getCurrentFinancialYear(date).endDate);
            firstDay = new Date(currentFyearStart.getFullYear() - 1, currentFyearStart.getMonth(), 1)
            lastDay = new Date(currentFyearEnd.getFullYear() - 1, currentFyearEnd.getMonth(), 31)
        }
        else if (item.name === BO_REPORTS_BROKERAGE_FILTER_MENU.CUSTOM_DATE) {
            firstDay = new Date();
            firstDay.setHours(0, 0, 0, 0);
            lastDay = new Date();
        }
        setStartDate(firstDay)
        setEndDate(lastDay)
        setBOSelectedBrokerageInterval(item)
    }

    function onSelectHoldingType(item) {
        // if (item.name === BO_REPORTS_PNL_HOLDINGS_FILTER_MENU.ALL_HOLDINGS) {
        //     setHoldingsType(item.name)
        // }
        // else if (item.name === BO_REPORTS_PNL_HOLDINGS_FILTER_MENU.POSITIVE_HOLDINGS) {
        //     setHoldingsType(item.name)

        // }
        // else if(item.name === BO_REPORTS_PNL_HOLDINGS_FILTER_MENU.ZERO_HOLDINGS){
        //     setHoldingsType(item.name)

        // }
        // console.log("item", item.key)
        setChosenHoldingType(item.key)
        setBOSelectedPNLHoldingsType(item)
    }

    function dateEnableCustom() {
        if (selectedMenu === BO_REPORTS_MENUS.FINANCIAL_LEDGER) {
            if (selectedFinancialType.name === BO_REPORTS_FINANCIAL_OPTIONS.QUICK_SNAPSHOT) {
                setShowCalenderCustom(false)
            }
            else {
                dateSelectShow()
            }
        }
        else {
            dateSelectShow()
        }
    }

    function dateSelectShow() {
        if (boSelectedFilter.name === BO_REPORTS_FILTER_MENU.CUSTOM_DATE ||
            boSelectedPNLInterval.name === BO_REPORTS_PNL_FILTER_MENU.CUSTOM_DATE || 
            boSelectedBrokerageInterval.name === BO_REPORTS_BROKERAGE_FILTER_MENU.CUSTOM_DATE) {
            setShowCalenderCustom(false)
            setShowCustom(true)
        }
        else {
            setShowCalenderCustom(true)
            setShowCustom(false)
        }
    }

    function getQuickStartDate() {
        let date = new Date();
        let first = new Date(date.getFullYear(), date.getMonth(), 1);
        setStartQuick(first)
        setStartDateQuick(first)
        setEndDateQuick(date)
    }

    function onSelectFinancialItem(item) {
        setBOSelectedFinancialFilter(item)
    }

    function onSelectDate(date) {
        setStartDate(date.startDate)
        setEndDate(date.endDate)

    }

    function onSelectDateQuick(date) {
        setStartDateQuick(date.startDate)
        setEndDateQuick(date.endDate)

    }

    function onSelectOrderType(item) {
        setSelectedOrderType(item)
    }

    function onSelectFinancialType(item) {
        setSelectedFinancialType(item)
        if (item.name === BO_REPORTS_FINANCIAL_OPTIONS.QUICK_SNAPSHOT) {
            getInitialDates()
            setShowCalenderCustom(false)
            setBOSelectedFilter(BO_REPORTS_FILTER[0])
        }
        else {
            onSelectItem(boSelectedFilter)
            // dateEnableCustom()
            dateSelectShow()
        }
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , item.name)

    }

    function onSelectInterestReportType(item) {
        setSelectedInterestReportType(item)
    }

    function onChangeValueTax(e) {
        if (e.target.value && checkInt(e.target.value) && e.target.value > 0 && e.target.value < 100)
            setTaxPercentDer(e.target.value)
        else if (!e.target.value)
            setTaxPercentDer(e.target.value)

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

    function onBlurSearchInput() {
        if (!searchValue.length)
            setshowInputSearch(false)
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

    function onClickScollRight() {
        let scrollPerClick = Math.ceil(watchGroupScroll.current.scrollWidth * (groupScrollPercentage.current / 100))
        if (watchGroupScroll.current.scrollLeft <= scrollPerClick)
            watchGroupScroll.current.scrollTo(watchGroupScroll.current.scrollLeft + scrollPerClick, 0)
        else
            watchGroupScroll.current.scrollTo(watchGroupScroll.current.scrollWidth, 0)
    }

    function downloadUrlCB(val) {
        setDownloadUrl(val)
    }

    function pdfDownloadUrlCB(val) {
        setPdfDownloadUrl(val)
    }

    function xlsxDownloadUrlCB(val) {
        setXlsxDownloadUrl(val)
    }

    function boSelectMenu(item) {
        setShowCustom(false)
        setSelectedMenu(item.name)
        getInitialDates()
        setBOSelectedFilter(BO_REPORTS_FILTER[0])
        setBOSelectedFinancialFilter(BO_REPORTS_FINANCIAL_FILTER[0])
        setBOSelectedPNLInterval(BO_REPORTS_PNL_FILTER[0])
        setBOSelectedPNLHoldingsType(BO_REPORTS_PNL_HOLDINGS_FILTER[0])
        setChosenHoldingType(BO_REPORTS_PNL_HOLDINGS_FILTER[0].key)
        setShowDownloadOptions(false)
        setBOSelectedBrokerageInterval(BO_REPORTS_BROKERAGE_FILTER[0])
        // setBOSelectedPNLInterval(BO_REPORTS_PNL_HOLDINGS_FILTER[0])
    }

    function onClickDownload() {
        setShowDownloadOptions(!showDownloadOptions)
        AF_EventTriggered(AF_EVENT_NAMES.REPORT , AF_EVENT_TYPES.DOWNLOAD)
    }

    function onClose() {
        setShowDownloadOptions(false)
    }

    function getBOReportsMenuArray() {
        if(props.isBrokerage === true){
            setboReportsMenuArray(BO_REPORTS_MENUS_ARRAY)
        }
        else {

            setboReportsMenuArray( BO_REPORTS_MENUS_ARRAY.filter(function (item)
            {
                return item.name !== BO_REPORTS_MENUS.BROKERAGE_REPORT
            }))
        }
    }
    function onClickEVoting() {
        props.storeEVotingScreenFlag(true)
    }
    return (
        <div className="bo-base ">
            <div className="bo-data-base">
                <div className="head-name">
                    <LangText name="BO_S" module="BO" />
                </div>
                <div className="bo-data">
                    <div className="bo-header">

                        {

                            <span className={`moveScroll-btn left ${disableGroupLeftScroll ?
                                '' : 'active'}`}
                            onClick={!disableGroupLeftScroll ? onClickScollLeft : null}
                            >
                                <LeftArrowIcon2 />
                            </span>
                        }
                        <div className="bo-header-values scroller_firefox" ref={watchGroupScroll}
                            onScroll={() => onManualScrollGroup()}>
                            {
                                boReportsMenuArray.map((item, index) => {
                                    return (
                                        <span key={index}
                                            ref={selectedMenu === item.name ? selectedMenuBtnRef : null}
                                            className={`menusTab cursor ${item.name}  ${index === 0 ?
                                                'first' : ''} ${selectedMenu === item.name ?
                                                'selectedMenu' : ''}`}
                                            onClick={() => boSelectMenu(item)}
                                        >
                                            <span className="menuName">
                                                <LangText name={item.langKey} module="BO" />
                                            </span>
                                        </span>
                                    )
                                })
                            }
                        </div>
                        {

                            <span className={`moveScroll-btn right ${disableGroupRightScroll ?
                                '' : 'active'}`}
                            onClick={!disableGroupRightScroll ? onClickScollRight : null}
                            >
                                <RightArrowIcon2 />
                            </span>
                        }

                    </div>
                    <div className="bo-filters">
                        {
                            (selectedMenu === BO_REPORTS_MENUS.COST_REPORT
                                || selectedMenu === BO_REPORTS_MENUS.TRADE_SUMMARY
                                || selectedMenu === BO_REPORTS_MENUS.TAX_REPORT
                                || selectedMenu === BO_REPORTS_MENUS.PNL_REPORT)
                                ?
                                <div className="bo-top-left">
                                    <div className="bo-select-case">

                                        {
                                            boTypes.map((oItem, oIndex) => {
                                                return (
                                                    <label key={oIndex} className={`cursor radioField`}>
                                                        <input type="radio"
                                                            name="boType"
                                                            onClick={() => onSelectOrderType(oItem)}
                                                            checked={selectedOrderType ?
                                                                oItem === selectedOrderType : false}
                                                        />
                                                        <span className="checkmark"></span>
                                                        {/* <div className="value">{oItem.name}</div> */}
                                                        <div className="value">
                                                            <LangText name={oItem.langKey} 
                                                                orientation={TEXT_ORIENTATION.UPPERCASE} />
                                                        </div>
                                                    </label>

                                                )

                                            })

                                        }

                                        {
                                            (selectedMenu === BO_REPORTS_MENUS.TRADE_SUMMARY ||
                                                selectedMenu === BO_REPORTS_MENUS.PNL_REPORT)
                                                ?
                                                <div className="bo-search">
                                                    <SearchIcon onClick={showSearchField}
                                                        className="bo-trade-search cursor" />
                                                    {
                                                        showInputsearch === true ?
                                                            <InputComponent
                                                                className="searchInput"
                                                                ref={searchInputRef}
                                                                onChange={onChangeSearchVal}
                                                                value={searchValue}
                                                                placeholder=
                                                                    {getLangText("PLACE_HOLDER_PNL_REPORT_SEARCH",
                                                                        "SYMBOL_SEARCH")}
                                                                autoComplete="off"
                                                                onBlur={onBlurSearchInput}
                                                            />
                                                            : null
                                                    }
                                                </div>

                                                : null
                                        }
                                    </div>
                                </div>
                                : null

                        }
                        {
                            (selectedMenu === BO_REPORTS_MENUS.FINANCIAL_LEDGER)
                                ?
                                <div className="bo-top-left">
                                    <div className="bo-select-case">

                                        {
                                            boFinancialTab.map((oItem, oIndex) => {
                                                return (
                                                    <label key={oIndex} className={`cursor radioField`}>
                                                        <input type="radio"
                                                            name="boFinancial"
                                                            onClick={() => onSelectFinancialType(oItem)}
                                                            checked={selectedFinancialType ?
                                                                oItem === selectedFinancialType : false}
                                                        />
                                                        <span className="checkmark"></span>
                                                        {/* <div className="value">{oItem.name}</div> */}
                                                        <div className="value">
                                                            <LangText name={oItem.langKey}/>
                                                        </div>
                                                    </label>

                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                :
                                null

                        }
                        {
                            (selectedMenu === BO_REPORTS_MENUS.FINANCIAL_LEDGER)
                                ?
                                <div className="bo-top-right">
                                    {
                                        (selectedFinancialType.name === BO_REPORTS_FINANCIAL_OPTIONS.DETAILED_REPORT)
                                            ?
                                            <>
                                                <div className="bo-segment">
                                                    <Select
                                                        optionList={boFinancialInterval}
                                                        selectedOption={boSelectedFinancialFilter.langKey}
                                                        onSelectValueCB={onSelectFinancialItem}
                                                        value="name"
                                                        preSelect={true}
                                                        hiddenScroll={true}
                                                        customDate={true}
                                                        iconEnableKey="iconEnable"
                                                        hasLangageDependent = {true}
                                                    />
                                                </div>
                                            </>
                                            :
                                            null
                                    }
                                    {
                                        (selectedFinancialType.name === BO_REPORTS_FINANCIAL_OPTIONS.DETAILED_REPORT)
                                            ?
                                            <div className="bo-date-picker">
                                                <DateRangePicker
                                                    parentCB={onSelectDate}
                                                    startDate={startDate}
                                                    // minDate={startDate}
                                                    parent={SCREENS.ALERTS}
                                                    toDate={endDate}
                                                    showCustom={showCustom}
                                                    showCalenderCustom={showCalenderCustom}
                                                    maxDate={endDate} />
                                            </div>
                                            :
                                            <div className="bo-date-quick">
                                                <div className="bo-date-picker">
                                                    <DateRangePicker
                                                        parentCB={onSelectDateQuick}
                                                        startDate={startDateQuick}
                                                        minDate={selectedFinancialType.name ===
                                                        BO_REPORTS_FINANCIAL_OPTIONS.QUICK_SNAPSHOT ?
                                                            startQuick : null}
                                                        parent={SCREENS.ALERTS}
                                                        toDate={endDateQuick}
                                                        // showCalenderCustom={showCalenderCustom}
                                                        maxDate={endDateQuick} />
                                                </div>
                                            </div>
                                    }

                                    {
                                        (selectedFinancialType.name === BO_REPORTS_FINANCIAL_OPTIONS.DETAILED_REPORT)
                                            ?
                                            <div className="bo-dropdown">
                                                <Select
                                                    optionList={boInterval}
                                                    selectedOption={boSelectedFilter.name}
                                                    onSelectValueCB={onSelectItem}
                                                    value="name"
                                                    preSelect={true}
                                                    hiddenScroll={true}
                                                    customDate={true}
                                                    iconEnableKey="iconEnable"
                                                    hasLangageDependent={true}
                                                />
                                            </div>
                                            :
                                            null
                                    }
                                </div>

                                : null

                        }
                        {
                            (selectedMenu === BO_REPORTS_MENUS.INTEREST_REPORT)
                                ?
                                <>
                                    <div className="bo-top-left">
                                        <div className="bo-select-case">

                                            {
                                                boInterestReportTab.map((oItem, oIndex) => {
                                                    return (
                                                        <label key={oIndex} className={`cursor radioField`}>
                                                            <input type="radio"
                                                                name="boInterestReport"
                                                                onClick={() => onSelectInterestReportType(oItem)}
                                                                checked={selectedInterestReportType ?
                                                                    oItem === selectedInterestReportType : false}
                                                            />
                                                            <span className="checkmark"></span>
                                                            {/* <div className="value">{oItem.name}</div> */}
                                                            <div className="value">
                                                                <LangText name={oItem.langKey} />
                                                            </div>
                                                        </label>

                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    {/* {
                                        selectedInterestReportType.name === BO_REPORTS_INTEREST_REPORT_OPTIONS.DPC?
                                            <div className="roi">
                                                <span className="debit-or-mtm-roi">DEBIT RATE OF INTEREST : </span>
                                                <span className="debit-or-mtm-roi-val"> 
                                                    {  checkEmpty(props.dpcRoi)}</span></div>
                                            :
                                            <div className="roi">
                                                <span className="debit-or-mtm-roi">MTF RATE OF INTEREST : </span>
                                                <span className="debit-or-mtm-roi-val">   
                                                    {  checkEmpty(props.mtfRoi)}</span>
                                            </div>
                                    }   */}
                                    {/* <span className="bottom-border"></span>   */}
                                </>
                                : null

                        }

                        {
                            (selectedMenu === BO_REPORTS_MENUS.CONTRACT_NOTE_DOWNLOAD ||
                                selectedMenu === BO_REPORTS_MENUS.COST_REPORT ||
                                selectedMenu === BO_REPORTS_MENUS.FUND_TRANSACTION ||
                                selectedMenu === BO_REPORTS_MENUS.TRADE_SUMMARY ||
                                selectedMenu === BO_REPORTS_MENUS.DP_TRANSACTION ||
                                selectedMenu === BO_REPORTS_MENUS.DIVIDEND_REPORT ||
                                selectedMenu === BO_REPORTS_MENUS.INTEREST_REPORT ||
                                selectedMenu === BO_REPORTS_MENUS.DP_BILL_CHARGES)
                                ?
                                <div className="bo-top-right">
                                    <div className={`bo-date-picker ${(pdfDownloadUrl !== '' ||
                                    (selectedMenu === BO_REPORTS_MENUS.INTEREST_REPORT))
                                        ? ''
                                        : 'bo-date-picker-custom'}  
                                        ${(selectedMenu === BO_REPORTS_MENUS.CONTRACT_NOTE_DOWNLOAD) ?
            'bo-date-picker-custom' : ''}
                                        `}>
                                        <DateRangePicker
                                            parentCB={onSelectDate}
                                            startDate={startDate}
                                            parent={SCREENS.ALERTS}
                                            toDate={endDate}
                                            showCustom={showCustom}
                                            showCalenderCustom={showCalenderCustom}
                                            maxDate={endDate} />
                                    </div>
                                    <div className="bo-dropdown">
                                        <Select
                                            optionList={boInterval}
                                            selectedOption={boSelectedFilter.name}
                                            onSelectValueCB={onSelectItem}
                                            value="name"
                                            preSelect={true}
                                            hiddenScroll={true}
                                            customDate={true}
                                            iconEnableKey="iconEnable"
                                            hasLangageDependent = {true}
                                        />
                                    </div>
                                </div>

                                : null

                        }
                        {
                            selectedMenu === BO_REPORTS_MENUS.CLIENT_HOLDINGS ?
                                <div className="bo-top-right">
                                    <div className="e-voting-row">
                                        <span className="text"><LangText name="EVOTING_TEXT"/></span>
                                        <button className={`e-vote-button 
                                        ${props.selectedLang.id === "marathi" ? "long" : ""} cursor}`} 
                                        onClick={onClickEVoting}>
                                            {/* <LangText name="E-VOTE-NOW"/> */}
                                            <LangText name="EVOTE_NOW" orientation={TEXT_ORIENTATION.UPPERCASE}/>
                                        </button>
                                    </div>
                                    <div className="date-row">
                                        <span className="datetext"><LangText module="BO" name="HOLDINGS_REPORT" /> 
                                        :</span>
                                        <span className="currentDate">{currentDate}</span>
                                    </div>
                                   
                                </div> :
                                null
                        }
                        {
                            selectedMenu === BO_REPORTS_MENUS.TAX_REPORT ?
                                <div className="bo-top-right">
                                    {
                                        selectedOrderType.name === BO_REPORTS_TAB_OPTIONS.EQUITY ?
                                            (props.approxTaxEquity !== '') ?
                                                <div className="approximate-tax">
                                                    <span className="approximate-tax-text">
                                                        <LangText module="BO" name="APPROX_TAX" /></span>
                                                    <span className="approximate-tax-text">
                                                        {' '} {boSelectedTaxInterval.name} : {' '}
                                                    </span>
                                                    <span className="approximate-tax-val">
                                                        ₹ {approximateTaxEquity}</span>

                                                </div> :
                                                null :
                                            null
                                    }
                                    {

                                        selectedOrderType.name === BO_REPORTS_TAB_OPTIONS.DERIVATIVE ?
                                            (props.totalPnlDer !== "") ?
                                                <div className="approximate-tax">
                                                    <span className="approximate-tax-text">
                                                        <LangText module="BO" name="APPROX_TAX" />   </span>
                                                    <span className="atPercentInput">
                                                        <span>@</span>
                                                        <InputComponent
                                                            name="taxpercentage"
                                                            className="inputVal taxpercent-input"
                                                            value={taxPercentDer}
                                                            onChange={onChangeValueTax}
                                                            maxLength={4}
                                                        />
                                                        <span>%</span>
                                                    </span>
                                                    <span className="approximate-tax-text">
                                                        {' '}{boSelectedTaxInterval.name} : </span>
                                                    <span className="approximate-tax-val">
                                                        ₹ {approximateTaxDerivative}</span>
                                                </div> :
                                                null :
                                            null
                                    }

                                    <div className="bo-dropdown">
                                        <Select
                                            optionList={boTaxInterval}
                                            selectedOption={boSelectedTaxInterval.name}
                                            onSelectValueCB={taxOnSelect}
                                            value="name"
                                            preSelect={true}
                                            hiddenScroll={true}
                                            customDate={true}
                                            iconEnableKey="iconEnable"
                                        />
                                    </div>
                
                                </div>
                                :
                                null
                        }
                        {
                            selectedMenu === BO_REPORTS_MENUS.PNL_REPORT ?
                                <div className="bo-top-right">
                                    <div className="bo-dropdown pnl-report">
                                        <Select
                                            optionList={boPNLHoldingsTypes}
                                            selectedOption={boSelectedPNLHoldingsType.name}
                                            onSelectValueCB={onSelectHoldingType}
                                            value="name"
                                            preSelect={true}
                                            hiddenScroll={true}
                                            hasLangageDependent={true}
                                        />
                                    </div>
                                    <div className={`bo-date-picker ${(pdfDownloadUrl !== '')
                                        ? ''
                                        : 'bo-date-picker-custom'}`}>
                                        <DateRangePicker
                                            parentCB={onSelectDate}
                                            startDate={startDate}
                                            parent={SCREENS.ALERTS}
                                            toDate={endDate}
                                            showCustom={showCustom}
                                            showCalenderCustom={showCalenderCustom}
                                            maxDate={endDate} />
                                    </div>
                                    <div className="bo-dropdown pnl-report-timerange">
                                        <Select
                                            optionList={boPNLInterval}
                                            selectedOption={boSelectedPNLInterval.name}
                                            onSelectValueCB={PNLOnSelect}
                                            value="name"
                                            preSelect={true}
                                            hiddenScroll={true}
                                            customDate={true}
                                            hasLangageDependent={true}
                                            iconEnableKey="iconEnable"
                                        />
                                    </div>
                                </div>

                                : null
                        }
                        {
                            selectedMenu === BO_REPORTS_MENUS.BROKERAGE_REPORT ?
                                <div className="bo-top-right">
                                    <div className={`bo-date-picker ${(pdfDownloadUrl !== '')
                                        ? ''
                                        : 'bo-date-picker-custom'}`}>
                                        <DateRangePicker
                                            parentCB={onSelectDate}
                                            startDate={startDate}
                                            parent={SCREENS.ALERTS}
                                            toDate={endDate}
                                            showCustom={showCustom}
                                            showCalenderCustom={showCalenderCustom}
                                            maxDate={endDate} />
                                    </div>
                                    <div className="bo-dropdown brokerage-report-timerange">
                                        <Select
                                            optionList={boBrokerageInterval}
                                            selectedOption={boSelectedBrokerageInterval.name}
                                            onSelectValueCB={BrokerageOnSelect}
                                            value="name"
                                            preSelect={true}
                                            hiddenScroll={true}
                                            customDate={true}
                                            hasLangageDependent={true}
                                            iconEnableKey="iconEnable"
                                        />
                                    </div>
                                </div>

                                : null
                        }
                        {
                            (
                                selectedMenu === BO_REPORTS_MENUS.FINANCIAL_LEDGER ||
                                selectedMenu === BO_REPORTS_MENUS.COST_REPORT ||
                                selectedMenu === BO_REPORTS_MENUS.FUND_TRANSACTION ||
                                selectedMenu === BO_REPORTS_MENUS.TRADE_SUMMARY ||
                                selectedMenu === BO_REPORTS_MENUS.VIEW_LAST_TRANSACTION ||
                                selectedMenu === BO_REPORTS_MENUS.CLIENT_HOLDINGS ||
                                selectedMenu === BO_REPORTS_MENUS.DP_TRANSACTION ||
                                selectedMenu === BO_REPORTS_MENUS.DIVIDEND_REPORT ||
                                selectedMenu === BO_REPORTS_MENUS.INTEREST_REPORT ||
                                selectedMenu === BO_REPORTS_MENUS.TAX_REPORT ||
                                selectedMenu === BO_REPORTS_MENUS.LTCG_REPORT ||
                                selectedMenu === BO_REPORTS_MENUS.PNL_REPORT ||
                                selectedMenu === BO_REPORTS_MENUS.BROKERAGE_REPORT ||
                                selectedMenu === BO_REPORTS_MENUS.DP_BILL_CHARGES 

                            )

                                ?
                                
                                downloadUrl ?
                                    <div className={`download-option 
                                    ${(selectedMenu === BO_REPORTS_MENUS.VIEW_LAST_TRANSACTION) ?
            'last-transactions' : selectedMenu === BO_REPORTS_MENUS.LTCG_REPORT ?
                'ltcg-report' : ''}`}>
                                        <DownloadIcon className="download-bo" />
                                 
                                        <div className="download-format">
                                            <button className="download-btn" onClick={onClickDownload} >
                                                <LangText module="BO" name="DOWNLOAD" /> 
                                            </button>
                                       
                                            {
                                                (pdfDownloadUrl !== '' || xlsxDownloadUrl !== '') ?
                                                    showDownloadOptions ?
                                                        <div className="download-format-options" ref={modalRef} >
                                                            <DownloadAsComponent pdfDownloadUrl={pdfDownloadUrl}
                                                                xlsxDownloadUrl={xlsxDownloadUrl} />
                                                        </div>
                                                        :
                                                        null
                                                    :
                                                    null
                                            }
                                        </div>
                                            
                                    </div>
                                    :
                                    null
                                :
                                null
                        }
                    </div>
                    <div className="bo-table-base">
                        {getSelectedTable(params, pdfDownloadUrlCB, xlsxDownloadUrlCB, downloadUrlCB)}
                    </div>
                </div>
            </div>
        </div>
    )
}

const getSelectedTable = (params, pdfDownloadUrlCB, xlsxDownloadUrlCB,downloadUrlCB) => {
    // console.log('params :', params);
    switch (params.selectedMenu) {
        case BO_REPORTS_MENUS.FINANCIAL_LEDGER:
            return <FinancialLedgerComponent
                frmDte={params.startDate}
                toDte={params.endDate}
                selectedFinancialType={params.selectedFinancialType}
                boSelectedFinancialFilter={params.boSelectedFinancialFilter}
                boSelectedFilter={params.boSelectedFilter}
                frmDteQuick={params.startDateQuick}
                toDteQuick={params.endDateQuick}
                downloadUrl={downloadUrlCB}
                pdfDownloadUrl={pdfDownloadUrlCB}
                xlsxDownloadUrl={xlsxDownloadUrlCB}
            />
        case BO_REPORTS_MENUS.FUND_TRANSACTION:
            return <FundTransactionComponent
                frmDte={params.startDate}
                toDte={params.endDate}
                boSelectedFilter={params.boSelectedFilter}
                downloadUrl={downloadUrlCB}
                pdfDownloadUrl={pdfDownloadUrlCB}
                xlsxDownloadUrl={xlsxDownloadUrlCB}
            />
        case BO_REPORTS_MENUS.TRADE_SUMMARY:
            return <TradeSummaryComponent
                frmDte={params.startDate}
                toDte={params.endDate}
                boSelectedFilter={params.boSelectedFilter}
                searchValue={params.searchValue}
                selectedOrderType={params.selectedOrderType}
                downloadUrl={downloadUrlCB}
                pdfDownloadUrl={pdfDownloadUrlCB}
                xlsxDownloadUrl={xlsxDownloadUrlCB}
            />
        case BO_REPORTS_MENUS.COST_REPORT:
            return <CostReportComponent
                frmDte={params.startDate}
                toDte={params.endDate}
                boSelectedFilter={params.boSelectedFilter}
                selectedOrderType={params.selectedOrderType}
                downloadUrl={downloadUrlCB}
                pdfDownloadUrl={pdfDownloadUrlCB}
                xlsxDownloadUrl={xlsxDownloadUrlCB}
            />
        case BO_REPORTS_MENUS.CONTRACT_NOTE_DOWNLOAD:
            return <ContractNoteDownloadComponent
                frmDte={params.startDate}
                toDte={params.endDate}
                boSelectedFilter={params.boSelectedFilter} />
        case BO_REPORTS_MENUS.VIEW_LAST_TRANSACTION:
            return <ViewLastTransactionComponent
                downloadUrl={downloadUrlCB}
                pdfDownloadUrl={pdfDownloadUrlCB}
                xlsxDownloadUrl={xlsxDownloadUrlCB}
            />
        case BO_REPORTS_MENUS.CLIENT_HOLDINGS:
            return <ClientHoldingsComponent
                downloadUrl={downloadUrlCB}
                pdfDownloadUrl={pdfDownloadUrlCB}
                xlsxDownloadUrl={xlsxDownloadUrlCB}
            />
        case BO_REPORTS_MENUS.DIVIDEND_REPORT:
            return <DividendReportComponent
                frmDte={params.startDate}
                toDte={params.endDate}
                boSelectedFilter={params.boSelectedFilter}
                downloadUrl={downloadUrlCB}
                pdfDownloadUrl={pdfDownloadUrlCB}
                xlsxDownloadUrl={xlsxDownloadUrlCB}
            />
        case BO_REPORTS_MENUS.DP_TRANSACTION:
            return <DpTransactionComponent
                frmDte={params.startDate}
                toDte={params.endDate}
                boSelectedFilter={params.boSelectedFilter}
                downloadUrl={downloadUrlCB}
                pdfDownloadUrl={pdfDownloadUrlCB}
                xlsxDownloadUrl={xlsxDownloadUrlCB}
            />
        case BO_REPORTS_MENUS.INTEREST_REPORT:
            return <InterestReportComponent
                frmDte={params.startDate}
                toDte={params.endDate}
                boSelectedFilter={params.boSelectedFilter}
                selectedInterestReportType={params.selectedInterestReportType}
                downloadUrl={downloadUrlCB}
                pdfDownloadUrl={pdfDownloadUrlCB}
                xlsxDownloadUrl={xlsxDownloadUrlCB}
            />
        case BO_REPORTS_MENUS.TAX_REPORT:
            return <TaxReportComponent
                selectedOrderType={params.selectedOrderType}
                boSelectedTaxInterval={params.boSelectedTaxInterval}
                boSelectedTaxIndex={params.boSelectedTaxIndex}
                downloadUrl={downloadUrlCB}
                pdfDownloadUrl={pdfDownloadUrlCB}
                xlsxDownloadUrl={xlsxDownloadUrlCB}
            />
        case BO_REPORTS_MENUS.LTCG_REPORT:
            return <LTCGReportComponent
                downloadUrl={downloadUrlCB}
                pdfDownloadUrl={pdfDownloadUrlCB}
                xlsxDownloadUrl={xlsxDownloadUrlCB}
            />
        case BO_REPORTS_MENUS.PNL_REPORT:
            return <PNLReportComponent
                frmDte={params.startDate}
                toDte={params.endDate}
                selectedOrderType={params.selectedOrderType}
                searchValue={params.searchValue}
                boSelectedPNLInterval={params.boSelectedPNLInterval}
                chosenHoldingType={params.chosenHoldingType}
                downloadUrl={downloadUrlCB}
                pdfDownloadUrl={pdfDownloadUrlCB}
                xlsxDownloadUrl={xlsxDownloadUrlCB}
            />
        case BO_REPORTS_MENUS.BROKERAGE_REPORT:
            return <BrokerageReportComponent
                frmDte={params.startDate}
                toDte={params.endDate}
                boSelectedBrokerageInterval={params.boSelectedBrokerageInterval}
                downloadUrl={downloadUrlCB}
                pdfDownloadUrl={pdfDownloadUrlCB}
                xlsxDownloadUrl={xlsxDownloadUrlCB}
            />
        case BO_REPORTS_MENUS.DP_BILL_CHARGES:
            return <DPBillChargesComponent
                frmDte={params.startDate}
                toDte={params.endDate}
                boSelectedBrokerageInterval={params.boSelectedFilter}
                downloadUrl={downloadUrlCB}
                pdfDownloadUrl={pdfDownloadUrlCB}
                xlsxDownloadUrl={xlsxDownloadUrlCB}
            />
        default:
            return null
    }
}
const mapStateToProps = ({ bo ,profileDialog,holdings, settings}) => {
    return {
        // selectedSymbol: indicesDetails.selectedSymbol,
        // selectedTheme: settings.selectedTheme,
        dpcRoi: bo.dpcRoi,
        mtfRoi: bo.mtfRoi,
        approxTaxEquity: bo.approxTaxEquity,
        totalPnlDer: bo.totalPnlDer,
        isBrokerage: profileDialog.isBrokerage,
        deepLinkEvote: bo.deepLinkEvote,
        navigateFromHoldings: holdings.navigateFromHoldings,
        selectedLang: settings.selectedLang

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        
        storeClientHoldingsEVoteFlag: (s) => { dispatch(storeClientHoldingsEVoteFlag(s)) },
        storeEVotingScreenFlag: (s) => { dispatch(storeEVotingScreenFlag(s)) },
        storeNavigateFromHoldings:(s) => {dispatch(storeNavigateFromHoldings(s))}
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(BOReportsBaseComponent);
