import React from 'react';
import { connect } from 'react-redux';
import { THEMES } from '../../../common/Constants';
import LangText from '../../../common/lang/LangText';

import MarketDepthBaseComponent from '../marketDepth/MarketDepthBaseComponent';

function MarketDepthOrderComponent(props) {
    return (
        <div className="base marketdepth-dialog">
            <div className="dialog-header">
                <span className="title"> <LangText module="MARKET_DEPTH" name="MARKET_DEPTH_TXT" /></span>
                <div className="close-button flex-center cursor" onClick={props.onCloseCB}>
                    {
                        props.selectedTheme.theme === THEMES.LIGHT ?
                            <img src="assets/images/dashboard/close_icon.svg" alt="" />
                            :
                            <img src="assets/images/dark/dashboard/close_icon.svg" alt="" />
                    }

                </div>
            </div>
            <div className="dialog-title">
                <span className="col1"> <LangText module="MARKET_DEPTH" name="BID" /></span>
                <span className="col2"> <LangText module="MARKET_DEPTH" name="OFFER" /> </span>
            </div>
            <div className="dialog-content">
                <MarketDepthBaseComponent selectedSym={props.sym} hasOrdVal={true} />
            </div>
        </div>
    )
}

const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme
    }
}

export default connect(mapStateToProps, null)(MarketDepthOrderComponent);