import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { MsfRequest, useFetch } from '../../../../../index'
import { getBackOfficeBaseURL } from '../../../../../common/CommonMethods'
import { DASHBOARD_SERVICES } from '../../../../../config/ServiceURLs'

const BannerSlidesComponent = (props) => {
    const [updatedUrl, setUpdatedUrl] = useState('')

    const MsfFetch = useFetch()

    useEffect(()=> {
        if(props.target2) {
            if(props.target2.url) {
                appendParams(props.target2.params)
            }
            else {
                setUpdatedUrl(props.target2)
            }
        }        
    }, [props.target2, updatedUrl])

    function appendParams(data) {
        // let UpdatedUrl=""
        let params="";
        data.map((item,index)=>{
            if(index !== data.length-1){
                params =  params+ data[index].key+ "=" +data[index].value + "&" ;
            }
            else if (index === data.length-1){
                params =  params+ data[index].key+ "=" +data[index].value
            }
        })

        setUpdatedUrl(props.target2.url + "?" + params)
        return updatedUrl;

    }

    function onClickBanner(dwnldUrl,redirectionUrl,imageUrl) {
        getUserActions(imageUrl)
    }

    function getUserActions(imageUrl) {
        let request = new MsfRequest();
        request.addToData({
            "imgUrl": imageUrl,
            "phnNo": props.profileData.mobNo,
            "email": props.profileData.email,
            "category": "dashboardWeb"
        })

        request.setEncrypt(false)

        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + DASHBOARD_SERVICES.GET_USER_ACTIONS_BANNER,
            request,
            successRespCBBannerUserActions,
            errorRespCBBannerUserActions
        )
    }

    function successRespCBBannerUserActions(response) {
        console.log(response);
    }

    function errorRespCBBannerUserActions(error) {
        console.log(error)
    }

    return (
        <div className="sliderComponent">
            <div className="image-div">
                {
                    props.fromSplashConsole ?
                        <a href={props.downloadUrl ? props.downloadUrl: props.target ? props.target: "" } 
                            target= {props.target ? "_blank" : "" }
                            rel="noopener noreferrer" 
                            className="linkto active-link"
                            title=""
                            onClick= {() => onClickBanner(props.downloadUrl, props.target,props.imageUrl )}>
                            {/* <div onClick= {() => onClickBanner(props.downloadUrl, props.target,props.imageUrl )} */}
                            {/* className="cursor"> */}
                            <img src={props.imageUrl} alt="" title=""/>
                        </a>
                        :
                        <a href={props.redirectionType === "browser" ? updatedUrl : ''} target="_blank" 
                            rel="noopener noreferrer" 
                            className={`linkto ${props.redirectionType === "browser" ? 'active-link' 
                                : 'inactive-link'}`}
                            title="">
                            <img src={props.imageUrl2} alt="" title=""/>
                        </a>
                        
                }

            </div>
        </div>
    )
}

const mapStateToProps = ({ settings, profileDialog }) => {
    return {
        selectedTheme: settings.selectedTheme,
        profileData: profileDialog.profileDetails,
    }
}

export default connect(mapStateToProps, null)(BannerSlidesComponent);