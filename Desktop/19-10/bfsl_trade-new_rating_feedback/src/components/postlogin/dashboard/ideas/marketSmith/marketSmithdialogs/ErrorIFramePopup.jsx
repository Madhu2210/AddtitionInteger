/* eslint-disable */
import React from 'react'
import { connect } from 'react-redux';
import LangText from '../../../../../../common/lang/LangText';
import { storeMarketSmithDialogDetails } from '../../../../../../state/actions/Actions';
import { Loader } from '../../../../../common/LoaderComponent';

function ErrorIFramePopup(props) {
 
    function handleDoneResponse(){
        props.storeMarketSmithDialogDetails({
            marketSmithDialogScreen:null,
        }) 
    }
 
    return (
    
        <div className="app-modalDialog2 marketsmithWindow">
            <div className="window ">
                <div className="title"><h6 className="modalTitle">BFSL</h6></div>
                <div className="content">
                    <div className="message">{props.marketSmtDialogComp.marketSmithSubscrptnData}</div>
                </div>

                <div className="footer">
                   
                    <div  
                        onClick={handleDoneResponse}
                    >
                        <button className="positiveBtn">
                            <LangText name="OK" module="BUTTONS" /></button>
                    </div>
                    
                </div>
               
            </div>
        </div>
    )
    
}
const mapStateToProps = ({marketsmithdetails}) => {
    return {
        marketSmtDialogComp : marketsmithdetails.marketSmtDialogComp

    }
    
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeMarketSmithDialogDetails: (s) => { dispatch(storeMarketSmithDialogDetails(s)) },

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(ErrorIFramePopup))
