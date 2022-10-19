import React from 'react'
import { connect } from 'react-redux'
import { ORDERPAD_SERIES, THEMES } from '../../../common/Constants'
import LangText from '../../../common/lang/LangText'

function OrdePadSeriesComponent(props) {
    // console.log('props', props)
    return (
        <div className="series-dialog-modal">
            <div className="header">
                <div className="close-button cursor" onClick={props.onCloseCB}>
                    {
                        props.selectedTheme.theme === THEMES.LIGHT ?
                            <img src="assets/images/dashboard/close_icon.svg" alt="" />
                            :
                            <img src="assets/images/dark/dashboard/close_icon.svg" alt="" />
                    }
                </div>
            </div>
            <div className="content-footer">
                <div className="content">
                    <div className="msg">
                        {props.orderMsg}
                    </div>
                </div>
                <div className="footer">
                    {
                        props.type === ORDERPAD_SERIES.TGROUP_SERIES ? 
                            <button className="convert-btn"
                                onClick={() => props.onCloseCB()}>
                                <LangText module="BUTTONS" name="NO" />
                            </button>
                            : ""
                    }
                    <button className="theme-button"
                        onClick={() => props.onClickSumbitCB()}>
                        {
                            props.type === ORDERPAD_SERIES.TGROUP_SERIES ? 
                                <LangText module="BUTTONS" name="YES" />
                                :
                                <LangText module="BUTTONS" name="OK" />
                        }
                    
                    </button>
                </div>
            </div>
            <div className="footer-div"></div>
        </div>
    )
}
const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme
    }
}

export default connect(mapStateToProps, null)(OrdePadSeriesComponent);
