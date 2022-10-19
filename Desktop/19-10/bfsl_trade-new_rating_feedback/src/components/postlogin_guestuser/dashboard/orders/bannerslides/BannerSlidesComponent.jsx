import React, {useEffect, useState} from 'react'
import { connect } from 'react-redux'

const BannerSlidesComponent = (props) => {
    const [updatedUrl, setUpdatedUrl] = useState('')

    useEffect(() => {
        if(props.target) {
            if(props.target.url) {
                appendParams(props.target.params)
            }
            else {
                setUpdatedUrl(props.target)
            }
        }        
    }, [props.target, updatedUrl])

    function appendParams(data) {
        // let UpdatedUrl=""
        let params="";
        data.map((item,index) => {
            if(index !== data.length-1) {
                params =  params+ data[index].key+ "=" +data[index].value + "&" ;
            }
            else if (index === data.length-1) {
                params =  params+ data[index].key+ "=" +data[index].value
            }
        })

        setUpdatedUrl(props.target.url + "?" + params)
        return updatedUrl;

    }

    return (
        <div className="sliderComponent">
            <div className="image-div">
                {
                    // props.selectedTheme.theme === THEMES.LIGHT ?
                    <a href={props.redirectionType === "browser" ? updatedUrl : ''} target="_blank" 
                        rel="noopener noreferrer" 
                        className={`linkto ${props.redirectionType === "browser" ? 'active-link' 
                            : 'inactive-link'}`}
                        title="">
                        <img src={props.imageUrl} alt="" title=""/>
                    </a>
                    // :
                    // <a href={props.redirectionType === "browser" ? updatedUrl : ''} target="_blank"
                    //     rel="noopener noreferrer"
                    //     className={`linkto ${props.redirectionType === "browser" ? 'active-link' 
                    //         : 'inactive-link'}`}
                    //     title="">
                    //     <img src={props.imageUrl} alt="" title=""/>
                    // </a>
                }

            </div>
        </div>
    )
}

const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme,
    }
}

export default connect(mapStateToProps, null)(BannerSlidesComponent);