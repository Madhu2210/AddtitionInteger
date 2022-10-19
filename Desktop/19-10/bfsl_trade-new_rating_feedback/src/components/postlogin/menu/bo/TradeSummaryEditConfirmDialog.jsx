import React from 'react'
import { connect } from 'react-redux';

import LangText from '../../../../common/lang/LangText'
import { storeTradeSummaryDialog, storeTradeSummaryFlag } from '../../../../state/actions/Actions';

import { Loader } from '../../../common/LoaderComponent';

function TradeSummaryEditConfirmDialog(props) {
    console.log('props :', props);
 
    function handleDoneResponse(){
        props.storeTradeSummaryDialog({
            tradeSummaryDialogScreen: null,
        })
        props.storeTradeSummaryFlag(true)
    }
    function handleResponse(){
        props.storeTradeSummaryDialog({
            tradeSummaryDialogScreen: null,
        })
        props.storeTradeSummaryFlag(false)
    }
    return (
    
        <div className="app-modalDialog2 tradeSummaryWindow">
            <div className="window ">
                <div className="title"><h6 className="modalTitle">BFSL</h6></div>
                <div className="content">
                    <div className="message">{props.tradeSummaryDialogComp.tradeSummaryData.msg}</div>
                </div>

                <div className="footer">
                    {/* <button className="negativeBtn" onClick={props.onCloseCB}>
                        <LangText module="BUTTONS" name="CANCEL" /></button>
                    <button className="left-btn positiveBtn" onClick={onClickSubmit}>
                        <LangText  name="UNBLOCK" /></button> */}
                    {props.tradeSummaryDialogComp.tradeSummaryData.isSuccess ?
    
                        <div  onClick={handleDoneResponse}>
                            <button className="positiveBtn">
                                <LangText name="OK" module="BUTTONS" /></button>
                        </div> :  <div onClick={handleResponse}>
                            <button className="positiveBtn" >
                                <LangText name="RETRY" module="NCD" /></button></div>
       
                    }
                </div>
               
            </div>
        </div>
    )
    
}
const mapStateToProps = ({bo,settings}) => {
    return {
        tradeSummaryDialogComp: bo.tradeSummaryDialogComp,
        tradeSummarykey: bo.tradeSummarykey,
        selectedTheme: settings.selectedTheme,

    }
    
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeTradeSummaryDialog: (s) => { dispatch(storeTradeSummaryDialog(s)) },
        storeTradeSummaryFlag: (s) => { dispatch(storeTradeSummaryFlag(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(TradeSummaryEditConfirmDialog))
