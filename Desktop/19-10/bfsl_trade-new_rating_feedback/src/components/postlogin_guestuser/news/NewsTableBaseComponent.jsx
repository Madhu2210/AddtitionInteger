import React, { useEffect, useRef, useState }  from "react";
import {  getFormatedDate, getNewsBaseURL, getTimeInterval } from "../../../common/CommonMethods";
import {  DATE_FORMATS, NEWS_FILTER, NEWS_FILTER_MENU,
    SCREENS } from "../../../common/Constants";
import {  useFetch, MsfRequest } from '../../../index'

import { NEWS_SERVICE } from "../../../config/ServiceURLs";
import DateRangePickerComponent from "../../common/datePicker/DateRangePickerComponent";
import SelectInputComponent from "../../common/SelectInputComponent";
import NewsTableComponent from "./NewsTableComponent";
import { WidgetLoader } from "../../common/WidgetLoaderComponent";

function NewsTableBaseComponent(props) {
    
    const MsfFetch = useFetch()

    const [resultArray,setResultArray] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    const [category, setCategory] = useState('')
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [minDate, setMinDate] = useState()
    const [showCalenderCustom] = useState(false)
    const [selectedInterval, setSelectedInterval] = useState(NEWS_FILTER[0])

    const selectedTab = useRef(null)

    useEffect(() =>{ 
        if(selectedInterval.name === NEWS_FILTER_MENU.CUSTOM_DATE)
            getInitialDates()

    }, [ selectedInterval])

    useEffect(()=>{
        props.hideWidgetLoader()
        setSelectedInterval(NEWS_FILTER[0])
        setStartDate('')
        setEndDate('')
        if(props.selectedNews !== "")
            setCategory(props.selectedNews)

    }, [props.selectedNews])

    useEffect(()=>{
        if((startDate && endDate) || selectedInterval.name === NEWS_FILTER_MENU.RECENT ){
            getNews(startDate, endDate)
        }
    }, [category, startDate, endDate])

    useEffect(() => {
        if(selectedInterval.name !== NEWS_FILTER_MENU.CUSTOM_DATE){
            setStartDate(getTimeInterval(selectedInterval.name).firstDay)
            setEndDate(getTimeInterval(selectedInterval.name).lastDay)
        }    
    }, [selectedInterval])

    function getNews(from, to) {
        props.showWidgetLoader();
        setResultArray([])
        setErrorMsg(null)
        let request = new MsfRequest();
        request.setEcho(category)
        selectedTab.current = category
        request.addToData({
            "filters": [
                {
                    "key": "category",
                    "value": category
                },
                {
                    "key": "frmDte",
                    "value": (selectedInterval.name === NEWS_FILTER_MENU.RECENT) ? "" :
                        getFormatedDate(from, 0, DATE_FORMATS.YYYYMMDD, true).stringDate
                },
                {
                    "key": "toDte",
                    "value": (selectedInterval.name === NEWS_FILTER_MENU.RECENT) ? "" :
                        getFormatedDate(to, 0, DATE_FORMATS.YYYYMMDD, true).stringDate
                }
            ]
        })
        // }
        if(category) {
            if(category === "Portfolio"){
                MsfFetch.placeRequest(         
                    getNewsBaseURL() + NEWS_SERVICE.PORTFOLIO_NEWS,
                    request,
                    successRespCBGetNews,
                    errorRespCBGetNews
                )
            }
            else{
                MsfFetch.placeRequest(         
                    getNewsBaseURL() + NEWS_SERVICE.CATEGORY_NEWS,
                    request,
                    successRespCBGetNews,
                    errorRespCBGetNews
                )
            }
        }
    }

    function successRespCBGetNews(response) {
        if(response.echo === selectedTab.current) {
            setErrorMsg(null)
            props.hideWidgetLoader();
            if (response && response.data && response.data.news.length > 0) {
                setResultArray(response.data.news)
            }
        }
        // else{
        //     setResultArray([])
        //     setErrorMsg(null)
        // }
    }

    function errorRespCBGetNews(error) {
        setResultArray([])
        props.hideWidgetLoader();
        setErrorMsg(error.message)

    }

    function onSelectTimeRange(val) {
        setSelectedInterval(val)
    }

    function getInitialDates() {
        let datefor_min = new Date()
        let date = new Date();
        let firstDate = new Date();
        let first = new Date().setHours(0, 0, 0, 0);
        firstDate.setTime(first)
        setStartDate(firstDate)
        setEndDate(date)
        let mindate = datefor_min.setDate(datefor_min.getDate() - 30);
        setMinDate(new Date(mindate))
    }

    function onSelectDate(date) {
        let firstDate = new Date();
        let first = date.startDate.setHours(0, 0, 0, 0);
        firstDate.setTime(first)
        setStartDate(firstDate)
        setEndDate(new Date(date.endDate.setHours(new Date().getHours(),
            new Date().getMinutes(), new Date().getSeconds())))

    }

    return(
        <div className= "newsTable-base">
            <div className="news-filter">
                
                {
                    (selectedInterval.name === NEWS_FILTER_MENU.CUSTOM_DATE)?
                        <DateRangePickerComponent
                            parentCB={onSelectDate}
                            startDate={startDate}
                            parent={SCREENS.ALERTS}
                            toDate={endDate}
                            showCalenderCustom={showCalenderCustom}
                            minDate={minDate}
                            maxDate={new Date()} />
                        :
                        null
                }
                <SelectInputComponent
                    optionList={NEWS_FILTER}
                    selectedOption={selectedInterval.name}
                    onSelectValueCB={onSelectTimeRange}
                    value="name"
                    preSelect={true}
                    hiddenScroll={true}
                    customDate={true}
                    iconEnableKey="iconEnable"
                    hasLangageDependent = {true}
                />
            </div>
            <NewsTableComponent newsList = {resultArray} errorMsg = {errorMsg} categoryname = {category} />
        </div>
        
    )
}
export default (WidgetLoader(NewsTableBaseComponent)) ;