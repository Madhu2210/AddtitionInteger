import React, { useEffect, useRef, useState }  from "react";
import { getCMOTSBaseURL, getFormatedDate, getNewsBaseURL, 
    getTimeInterval } from "../../../common/CommonMethods";
import { DATE_FORMATS, NEWS_FILTER, NEWS_FILTER_CORPORATE_ACTION, NEWS_FILTER_MENU,
    SCREENS} from "../../../common/Constants";
import { useFetch, MsfRequest } from '../../../index'

import {  NEWS_SERVICE } from "../../../config/ServiceURLs";
import DateRangePickerComponent from "../../common/datePicker/DateRangePickerComponent";
import SelectInputComponent from "../../common/SelectInputComponent";
import NewsTableComponent from "./NewsTableComponent";
import { WidgetLoader } from "../../common/WidgetLoaderComponent";
import NewsTableCorporateAction from "./NewsTableCorporateAction";
import { connect } from "react-redux";
import { storeEVotingScreenFlag } from "../../../state/actions/Actions";

function NewsTableBaseComponent(props) {

    const MsfFetch = useFetch()

    const [resultArray,setResultArray] = useState([])
    const [corpNewsArray, setCorpNewsArray] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    const [category, setCategory] = useState('')
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [minDate, setMinDate] = useState()
    const [showCalenderCustom] = useState(false)
    const [selectedInterval, setSelectedInterval] = useState(NEWS_FILTER[0])
    const [selectedCorporateInterval, setSelectedCorporateInterval] = useState(NEWS_FILTER_CORPORATE_ACTION[0])
    const [corporateActionPeriod, setCorporateActionPeriod] = useState('')

    const selectedTab = useRef(null)

    useEffect(() =>{ 
        if(selectedInterval.name === NEWS_FILTER_MENU.CUSTOM_DATE)
            getInitialDates()

    }, [ selectedInterval])

    useEffect(()=> {
        setSelectedInterval(NEWS_FILTER[0])
        setSelectedCorporateInterval(NEWS_FILTER_CORPORATE_ACTION[0])
        setStartDate('')
        setEndDate('')
        setCorporateActionPeriod("Today")
        if(props.selectedNews !== "")
            setCategory(props.selectedNews)

    }, [props.selectedNews])

    useEffect(() => {
        if(category !== "corporate") {
            if((startDate && endDate) || selectedInterval.name === NEWS_FILTER_MENU.RECENT ) 
                getNews(startDate, endDate) 
        }          
    }, [category, startDate, endDate])

    useEffect(() => {
        if(category === "corporate")
            getCorpActionNews(corporateActionPeriod)  
    }, [category, corporateActionPeriod])

    useEffect(() => {
        if(selectedInterval.name !== NEWS_FILTER_MENU.CUSTOM_DATE) {
            setStartDate(getTimeInterval(selectedInterval.name).firstDay)
            setEndDate(getTimeInterval(selectedInterval.name).lastDay)
        }    
    }, [selectedInterval])

    useEffect(() => {
        if(selectedCorporateInterval.name === NEWS_FILTER_MENU.TODAY || 
                selectedCorporateInterval.name === NEWS_FILTER_MENU.NEXT_WEEK ||
                selectedCorporateInterval.name === NEWS_FILTER_MENU.NEXT_2_WEEKS ||
                selectedCorporateInterval.name === NEWS_FILTER_MENU.NEXT_1_MONTH) {
            setCorporateActionPeriod(getTimeInterval(selectedCorporateInterval.name).newsPeriod)
        }
    }, [selectedCorporateInterval])

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
        if(category) {
            if(category === "Portfolio") {
                MsfFetch.placeRequest(         
                    getNewsBaseURL() + NEWS_SERVICE.PORTFOLIO_NEWS,
                    request,
                    successRespCBGetNews,
                    errorRespCBGetNews
                )
            }
            else {
                MsfFetch.placeRequest(         
                    getNewsBaseURL() + NEWS_SERVICE.CATEGORY_NEWS,
                    request,
                    successRespCBGetNews,
                    errorRespCBGetNews
                )
            }
        }
    }

    function getCorpActionNews(corpPeriod) {
        props.showWidgetLoader();
        setCorpNewsArray([])
        setResultArray([])
        setErrorMsg(null)
        let request = new MsfRequest();
        request.setEcho(category)
        selectedTab.current = category

        if(category === "corporate") {
            request.addToData({
                period: corpPeriod
            })
        }
        MsfFetch.placeRequest(         
            getCMOTSBaseURL() + NEWS_SERVICE.CORPORATE_ACTION_NEWS,
            request,
            successRespCBGetCorpNews,
            errorRespCBGetCorpNews
        )
    }

    function successRespCBGetNews(response) {
        // console.log("category", category, response.echo, selectedTab.current)
        // console.log("response news",response.data.news)
        if(response.echo === selectedTab.current) {
            setErrorMsg(null)
            if (response && response.data && response.data.news.length > 0) {
                setResultArray(response.data.news)
            }
            // else{
            //     setResultArray([])
            //     setErrorMsg(null)
            // }
            props.hideWidgetLoader();
        }
    }

    function errorRespCBGetNews(error) {
        // console.log('error news :', error);
        setResultArray([])
        setErrorMsg(error.message)
        props.hideWidgetLoader();
    }

    function successRespCBGetCorpNews(response) {
        // console.log("category", category, response.echo, selectedTab.current)
        // console.log("response news",response.data.news)
        if(response.echo === selectedTab.current) {
            setErrorMsg(null)
            if (response && response.data && response.data.news.length > 0) {
                setCorpNewsArray(response.data.news)
            }
            // else{
            //     setResultArray([])
            //     setErrorMsg(null)
            // }
            props.hideWidgetLoader();
        }
    }

    function errorRespCBGetCorpNews(error) {
        // console.log('error news :', error);
        setCorpNewsArray([])
        setErrorMsg(error.message)
        props.hideWidgetLoader();
    }

    function onSelectTimeRange(val) {
        setSelectedInterval(val)
    }
    function onSelectCorporateTimeRange(val) {
        setSelectedCorporateInterval(val)
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

    // function onClickEVoting() {
    //     props.storeEVotingScreenFlag(true)
    // }

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
                {
                    category === "corporate" ?
                        <SelectInputComponent
                            optionList={NEWS_FILTER_CORPORATE_ACTION}
                            selectedOption={selectedCorporateInterval.name}
                            onSelectValueCB={onSelectCorporateTimeRange}
                            value="name"
                            preSelect={true}
                            hiddenScroll={true}
                            customDate={true}
                            iconEnableKey="iconEnable"
                            hasLangageDependent = {true}
                        />
                        :
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
                }
            </div>
            {/* <div className="e-voting-row">
                <span className="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod tempor</span>
                <div className="e-vote-button cursor" onClick={onClickEVoting}>E-Vote Now</div>
            </div> */}
            {
                category === "corporate" ?
                    <NewsTableCorporateAction  corpNewsList = {corpNewsArray} 
                        errorMsg = {errorMsg} categoryname = {category} />
                    :
                    <NewsTableComponent newsList = {resultArray} 
                        errorMsg = {errorMsg} categoryname = {category} />
            } 
        </div>
        
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeEVotingScreenFlag: (s) => { dispatch(storeEVotingScreenFlag(s)) }
    };
};
export default connect(null, mapDispatchToProps)((WidgetLoader(NewsTableBaseComponent))) ;