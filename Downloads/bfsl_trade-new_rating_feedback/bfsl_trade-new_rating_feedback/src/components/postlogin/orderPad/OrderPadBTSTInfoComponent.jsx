import React from 'react'
import { connect } from 'react-redux'

function OrderPadBTSTInfoComponent(props) {

    function onClickCancel() {
        props.onCloseCB && props.onCloseCB()
    }

    function onClickProceed() {
        props.onClickSumbitCB && props.onClickSumbitCB()
    }

    return ( 
        <div className="btst-charge-block-base">
            {/* <div className="header">
                <div className="close-button cursor" onClick={props.onCloseCB}>
                    {
                        props.selectedTheme.theme === THEMES.LIGHT ?
                            <img src="assets/images/dashboard/close_icon.svg" alt="" />
                            :
                            <img src="assets/images/dark/dashboard/close_icon.svg" alt="" />
                    }
                </div>
            </div> */}
            <div className="btst-charge-block">
                <div className="details-div">
                    <span className="sym-name">{props.symDetails.dispSym}</span>
                    <span className="exc">{props.symDetails.exc}</span>
                </div>
                <div className="text">{props.orderMsg}</div>
                <div className="action-div">
                    <button className="cancel-btn" onClick={onClickCancel}>CANCEL</button>
                    <button className="proceed-btn" 
                        onClick={
                            onClickProceed}>PROCEED</button>
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme
    }
}

export default connect(mapStateToProps, null)(OrderPadBTSTInfoComponent);
