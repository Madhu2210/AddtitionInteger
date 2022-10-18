import React from 'react'
import { connect } from "react-redux";
import { THEMES } from '../../common/Constants';

const GaugeGraphComponent = (props) => {

    const { selectedTheme } = props

    return (
        <div className="gaugeGraph flex-center">
            {
                selectedTheme.theme === THEMES.LIGHT ?
                    <>
                        <img className="indicator" src="assets/images/gauge_indicator_light.svg" alt="" />
                        <img className="pointer"
                            style={props.pointerDeg ? { transform: props.pointerDeg } : { transform: 'rotate(0deg)' }}
                            src="assets/images/gauge_indicator_point_light.svg"
                            alt="" />
                    </>
                    :
                    <>
                        <img className="indicator" src="assets/images/gauge_indicator_dark.svg" alt="" />
                        <img className="pointer"
                            style={props.pointerDeg ? { transform: props.pointerDeg } : { transform: 'rotate(0deg)' }}
                            src="assets/images/gauge_indicator_point_dark.svg"
                            alt=""
                        />
                    </>
            }
        </div>
    )
}

const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme
    }
}

export default connect(mapStateToProps, null)(GaugeGraphComponent);