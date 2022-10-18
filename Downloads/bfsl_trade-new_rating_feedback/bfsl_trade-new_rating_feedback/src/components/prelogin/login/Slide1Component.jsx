import React from 'react'
import { connect } from 'react-redux'

import { THEMES } from '../../../common/Constants'
import LangText from '../../../common/lang/LangText'

const Slide1Component = (props) => {
    return (
        <div className="sliderComponent">
            <div className="image-div">
                {
                    props.selectedTheme.theme === THEMES.LIGHT ?
                        <img src="assets/images/login/login_banner.svg" alt="" />
                        :
                        <img src="assets/images/dark/login/login_banner.svg" alt="" />
                }

            </div>
            <div className="content-div">
                <span className="welcome"><LangText  name="WELCOME" /></span>
                <span className="highlight"><LangText  name="BAJAJ" /></span>
                <span className="info"><LangText  name="OPEN_UP" /></span>
                <span className="info"><LangText  name="INVESTMENT" /></span>
            </div>
        </div>
    )
}

const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme,
    }
}

export default connect(mapStateToProps, null)(Slide1Component);