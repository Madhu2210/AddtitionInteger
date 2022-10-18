import React, { useRef } from 'react'
import { connect } from 'react-redux';

import useCloseModal from '../../../../customHooksComponents/useCloseModal';

import { NCD_DIALOGS, THEMES } from '../../../../common/Constants';
import LangText from '../../../../common/lang/LangText';
import { storeNCDDialogDetails } from '../../../../state/actions/Actions';


function NCDOrderResultComponent(props) {

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose, false)

    function onClose() {
        // props.gotoOrderbookCB && props.gotoOrderbookCB()
        props.onCloseCB && props.onCloseCB()
        
    }

    function onClickRetry() {
        props.storeNCDDialogDetails({
            name: NCD_DIALOGS.GOTO_PLACE_ORDER_SCREEN,
            symData: props.symData,
            seriesData: props.seriesData
        })
    }

    return (
        <div className={`ncdDialog-base order-result-base
         ${props.orderResult.isSuccess ? 'successWindow' : 'errorWindow'}`}>
            <div className="window" ref={modalRef}>
                <div className="successImgDiv">
                    {
                        props.orderResult.isSuccess ?
                            props.selectedTheme.theme === THEMES.LIGHT ?
                                < img src="assets/images/dashboard/success_btn.svg" alt="" />
                                :
                                < img src="assets/images/dark/dashboard/success_btn.svg" alt="" />
                            :
                            props.selectedTheme.theme === THEMES.LIGHT ?
                                <img src="assets/images/dashboard/failed_btn.svg" alt="" />
                                :
                                <img src="assets/images/dark/dashboard/Failed_btn.svg" alt="" />
                              
                    }
                    <div className={`status ${props.orderResult.isSuccess ? 'success' : 'fail'}`}>
                        {props.orderResult.isSuccess ? "Success" : "Failed"}
                    </div>     
                </div>
                {/* <div className={`status ${props.orderResult.isSuccess ? 'success' : 'fail'}`}>
                    {props.orderResult.isSuccess ? "Success" : "Failed"}
                </div> */}
                <div className="detailsdiv">
                    <div className="symName">
                        {props.orderResult.symName} ({props.orderResult.qty} Qty)
                    </div>
                    <div className="messageDiv">
                        {props.orderResult.msg}
                    </div>
                    {/* <div>test</div> */}
                    {
                        props.orderResult.isSuccess ?
                            <div className="appIdDiv">
                                <LangText 
                                    name="APP_NO" module="NCD" /> : {props.orderResult.applicationNo}
                            </div>
                            : null
                    }
                </div>
                {
                    // props.orderResult.isSuccess ?
                    //     <div className="infoMsg">
                    //         <LangText name="UPI_ACCEPT" module="NCD" />
                    //     </div>
                    //     : null
                }
                {
                    props.orderResult.isSuccess ?
                        <div className="btnDiv" onClick={props.gotoOrderbookCB}>
                            <button>
                                <LangText name="DONE" module="BUTTONS" />
                            </button>
                        </div> :
                        <div className="btnDiv" onClick={onClickRetry}>
                            <button>
                                <LangText name="RETRY" module="NCD" />
                            </button>
                        </div>
                }
            </div>
        </div>
    )
}

const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeNCDDialogDetails: (s) => { dispatch(storeNCDDialogDetails(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NCDOrderResultComponent);