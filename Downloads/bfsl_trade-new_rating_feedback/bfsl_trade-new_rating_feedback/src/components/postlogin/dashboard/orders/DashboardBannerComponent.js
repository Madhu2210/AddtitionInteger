import useFetch from '@msf/msf-reactjs-weblib-base';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from "react-redux";
import { MsfRequest } from '../../../..';
import { getBackOfficeBaseURL } from '../../../../common/CommonMethods';
import { DASHBOARD_WIDGET_MODE, SET_TIMEOUT_INTERVAL } from '../../../../common/Constants';

import { DASHBOARD_SERVICES } from '../../../../config/ServiceURLs';

import {  storeSelectedDashboardWidget } from '../../../../state/actions/Actions';
import { CloseIcon } from '../../../common/FontIcons';
import BannerSlidesComponent from './bannerslides/BannerSlidesComponent';

function BannerInfoComponent(props) {

    // const [setSlideView] = useState(false)
    const [list1, setList1] = useState([])
    const [list2, setList2] = useState([])
    const [list, setList] = useState([])
    const [activeSlide, setActiveSlide] = useState(1)
    // const [slides1, setSlides1] = useState([])
    // const [slides2, setSlides2] = useState([])
    const [slides, setSlides] = useState([])
    const [showBanner, setShowBanner] = useState(true)

    const sliderInterval = useRef(null)

    const MsfFetch = useFetch()

    useEffect(() => {
        getBannerDetails() 
    }, [])
    
    useEffect(() => {
        if(props.profileData && Object.keys(props.profileData).length !== 0) {
            // getBannerDetails()  
            getBannerDetails2() 
        }
    }, [props.profileData])

    useEffect(() => {
        if(list1 && list2) {
            let slidesList = list2.concat(list1)
            setList(slidesList)
            setSlides(slidesList)
        }
            
    }, [list1,list2])

    useEffect(() => {
        startSlideShow()
        return () => {
            clearInterval(sliderInterval.current)
        }
    }, [slides])

    function getBannerDetails() {
        let request = new MsfRequest();
        request.addToData({
            // isFrstLogn: props.lastLoginTime,
            // sgmnt: response.data.segment,
            // product: response.data.product,
            // poaStatus: response.data.poaStatus,
            "screen": "dashboardWeb"
        })
        request.setEncrypt(false)

        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + DASHBOARD_SERVICES.BANNER_DETAILS,
            request,
            successRespCBBannerDetails,
            errorRespCBBannerDetails
        )
    }

    function successRespCBBannerDetails(response) {
        let resData = response.data.dashboardList
        let dashboardList = resData.map(item => {
            item.fromSplashConsole = true
            return item
        })
        // setList(response.data.banners)
        setList1(dashboardList)
        // setSlides(response.data.banners)
    }

    function errorRespCBBannerDetails(error) {
        console.log(error)
    }

    function getBannerDetails2() {
        let request = new MsfRequest();
        request.addToData({
            isFrstLogn: props.lastLoginTime,
            sgmnt: props.profileData.segment,
            product: props.profileData.product,
            poaStatus: props.profileData.poaStatus
        })
        request.setEncrypt(false)

        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + DASHBOARD_SERVICES.BANNER_DETAILS_2,
            request,
            successRespCBBannerDetails2,
            errorRespCBBannerDetails2
        )
    }

    function successRespCBBannerDetails2(response) {
        let banners;
        let bannerList = response.data.banners
        banners = bannerList.map(item => {
            item.fromSplashConsole = false
            return item
        })
        setList2(banners)
        // setList([])
    }

    function errorRespCBBannerDetails2(error) {
        console.log(error)
    }

    function startSlideShow() {
        // console.log("slides", slides)
        let slide = 1
        sliderInterval.current = setInterval(() => {
            if (slide === slides.length)
                slide = 1
            else
                slide = slide + 1

            setActiveSlide(slide)
        }, SET_TIMEOUT_INTERVAL.DASHBOARD_SLIDER_INTERVAL);
    }

    function onChangeSlide(index) {
        // console.log('index :', index);
        setActiveSlide(index+1)
    }

    function onCloseBanner() {
        setShowBanner(false)
    }

    return (
       
        <div className={`${list.length && showBanner ? 'dashboard-BannerBase' : 'dashboard-BannerBase-small cursor'}`}
            onClick={list.length ? () => props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT) : null}
        >           
            {/* <div className="dashboard-BannerBase"> */}
            {
                (list && list.length && showBanner) ?
                    <div className="slideShow-div">
                        <div className="slider-div">
                            {
                                list.map((listItem, index) => {
                                    if(activeSlide===index+1) 
                                        return <BannerSlidesComponent key= {index}
                                            index= {index} imageUrl= {listItem.imgUrl} 
                                            imageUrl2= {listItem.baseUrl} 
                                            fromSplashConsole = {listItem.fromSplashConsole}
                                            redirectionType={listItem.redirectionType ? listItem.redirectionType : ""}
                                            target= {listItem.targetUrl}
                                            target2 = {listItem.target}
                                            downloadUrl= {listItem.downloadUrl}
                                        />
                                    return null;
                                })
                                // })
                            }
                        </div>
                        <div className="closebanner" onClick={onCloseBanner}>
                            <CloseIcon />
                        </div>
                        <div className="sliderCircle-div">                           
                            {
                                slides.map(function (item, index) {
                                    return (
                                        <div key={index} onClick={()=>onChangeSlide(index)}
                                            className={`sliderCircle ${activeSlide === index+1 ?
                                                'active' : ''}`}></div>
                                    )
                                })
                            
                            }
                        </div>                
                    </div>
                    : 
                    null
            }

        </div>
    // </div>
   
    )

}

const mapStateToProps = ({ dashboard, login, profileDialog }) => {
    return {
        selectedWidgetMode: dashboard.selectedWidgetMode,
        lastLoginTime: login.clientDetails.lastLoginTime,
        profileData: profileDialog.profileDetails
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BannerInfoComponent);