import React, { useRef } from 'react'
import { connect } from 'react-redux';
import { THEMES } from '../../../../common/Constants';
import LangText from '../../../../common/lang/LangText';
import useCloseModal from '../../../../customHooksComponents/useCloseModal';

// import useCloseModal from '../../../../customHooksComponents/useCloseModal';
import { storeNCDOrderbookUpdate } from '../../../../state/actions/Actions';

function CancelNCDResultDialogComponent(props) {

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose, false)

    function onClose() {
        props.onCloseCB && props.onCloseCB()
    }

    function onClickDone() {
        let cancelAppNo = props.orderResult.applicationNo
        props.storeNCDOrderbookUpdate(true) ;
        props.gotoOrderbookCB()
        props.storeNCDDialogDetails(
            {
                cancelAppNo: cancelAppNo
            }
        )
    }

    function onClickRetry() {
        props.storeNCDOrderbookUpdate(true) ;
        props.gotoOrderbookCB()
    }

    return (
        <div className={`ncdDialog-base order-result-base
         ${props.orderResult.isSuccess ? 'successWindow' : 'errorWindow'}`}>
            <div className="window" ref= {modalRef}>
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
                </div>
                {
                    props.orderResult.isSuccess ?
                        <div className="btnDiv" onClick={onClickDone}>
                            <button>
                                <LangText name="DONE" module="BUTTONS" />
                            </button>
                        </div> :
                        <div className="btnDiv" onClick={onClickRetry}>
                            <button>
                                <LangText name="RETRY" module="BUTTONS" />
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
        storeNCDOrderbookUpdate: (s) => { dispatch(storeNCDOrderbookUpdate(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps) (CancelNCDResultDialogComponent);