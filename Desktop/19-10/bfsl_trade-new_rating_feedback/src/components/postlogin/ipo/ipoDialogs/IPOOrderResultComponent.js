import React, { useRef } from 'react'
import { connect } from 'react-redux';

import useCloseModal from '../../../../customHooksComponents/useCloseModal';

import { THEMES } from '../../../../common/Constants';
import LangText from '../../../../common/lang/LangText';

function IPOOrderResultComponent(props) {

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose, false)

    function onClose() {
        props.gotoOrderbookCB && props.gotoOrderbookCB()
        // props.onCloseCB && props.onCloseCB()
    }

    return (
        <div className={`ipoDialog-base order-result-base
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
                </div>
                <div className={`status ${props.orderResult.isSuccess ? 'success' : 'fail'}`}>
                    {props.orderResult.isSuccess ? "SUCCESS" : "FAIL"}
                </div>
                <div className="symName">
                    {props.orderResult.symName}
                </div>
                <div className="messageDiv">
                    {props.orderResult.msg}
                </div>
                {
                    props.orderResult.isSuccess ?
                        <div className="appIdDiv">
                            <LangText 
                                name="APP_NO" module="IPO" /> : {props.orderResult.applicationNo}
                        </div>
                        : null
                }
                {
                    props.orderResult.isSuccess ?
                        <div className="infoMsg">
                            <LangText name="UPI_ACCEPT" module="IPO" />
                        </div>
                        : null
                }i
                <div className="btnDiv" onClick={props.gotoOrderbookCB}>
                    <button>
                        <LangText name="DONE" module="BUTTONS" />
                    </button>
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
export default connect(mapStateToProps, null)(IPOOrderResultComponent);