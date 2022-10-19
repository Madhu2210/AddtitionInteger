/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { THEMES, LOCAL_STORAGE } from '../../../common/Constants'
import LangText from '../../../common/lang/LangText';
import { getItemFromSessionStorage } from '../../../common/LocalStorage';

const Slide2Component = (props) => {

    const [redirct, setRedirct] = useState('');
    useEffect(() => {
        let redirectLink = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.APPLY_REDIRECT_LINK));
        setRedirct(redirectLink);
    }, []);

    return (
        <div className="sliderComponent">
            <div className="image-div second-banner">
                {
                    props.selectedTheme.theme === THEMES.LIGHT ?
                        <img src="assets/images/login/login_banner2Slide.svg" alt="" />
                        :
                        <img src="assets/images/dark/login/login_banner2Slide.svg" alt="" />
                }
            </div>
            <div className="content-div">
                <span className="welcome-2"><LangText  name="TRADE_IN_SHARE" /></span>
                <span className="highlight-2"><LangText name="BAJAJ_PRIVILEGE" /></span>
                <span className="info-2"><LangText  name="OPEN_DEMAT" /></span>
                <div className="row">
                    <a href={redirct} target="_blank" rel="noopener noreferrer">
                        <button test_id="applyBtn"
                            className="theme-btn applyBtn"
                        >
                            <LangText  name="APPLY_NOW" /> 
                        </button>
                    </a>
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme,
    }
}

export default connect(mapStateToProps, null)(Slide2Component);
