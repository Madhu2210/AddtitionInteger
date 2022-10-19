import React, { useEffect, useRef, useState } from 'react';
import { connect } from "react-redux";
import { DASHBOARD_WIDGET_MODE, LOCAL_STORAGE, SET_TIMEOUT_INTERVAL } from '../../../../common/Constants';
import { getItemFromSessionStorage } from '../../../../common/LocalStorage';

import {  storeSelectedDashboardWidget } from '../../../../state/actions/Actions';
import { CloseIcon } from '../../../common/FontIcons';
import BannerSlidesComponent from './bannerslides/BannerSlidesComponent';

function BannerInfoComponent(props) {

    // const [setSlideView] = useState(false)
    const [list, setList] = useState([])
    const [activeSlide, setActiveSlide] = useState(1)
    const [slides, setSlides] = useState([])
    const [showBanner, setShowBanner] = useState(true)

    const sliderInterval = useRef(null)
    
    useEffect(()=>{
        getGuestUserBanners()
        
    }, [])
    useEffect(()=>{
        startSlideShow()
        return () => {
            clearInterval(sliderInterval.current)
        }
    }, [slides])

    function getGuestUserBanners() {
        let guestUserBannerList = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.GUEST_BANNER))
        setList(guestUserBannerList)
        setSlides(guestUserBannerList)

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
       
        <div className={`${list.length && showBanner  ? 'dashboard-BannerBase' : 'dashboard-BannerBase-small cursor'}`}
            onClick={list.length ? () => props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT) : null}
        >           
            {/* <div className="dashboard-BannerBase"> */}
            {
                (list && list.length && showBanner ) ?
                    <div className="slideShow-div">
                        <div className="slider-div">
                            {
                                list.map((listItem, index)=>{
                                    if(activeSlide===index+1) 
                                        return <BannerSlidesComponent key={index}
                                            index={index} imageUrl={listItem.baseUrl} 
                                            redirectionType={listItem.redirectionType} 
                                            target={listItem.target}
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

const mapStateToProps = ({ dashboard, login }) => {
    return {
        selectedWidgetMode: dashboard.selectedWidgetMode,
        lastLoginTime: login.clientDetails.lastLoginTime
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BannerInfoComponent);