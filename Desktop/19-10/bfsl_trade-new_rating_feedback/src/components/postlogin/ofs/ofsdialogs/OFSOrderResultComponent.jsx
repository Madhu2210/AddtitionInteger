import React, { useRef } from 'react'
import { connect } from 'react-redux';

import useCloseModal from '../../../../customHooksComponents/useCloseModal';

import { OFS_DIALOGS, THEMES } from '../../../../common/Constants';
import LangText from '../../../../common/lang/LangText';
import { storeOFSDialogDetails, storeOFSOrderbookUpdate } from '../../../../state/actions/Actions';

function OFSOrderResultComponent(props) {
    // console.log('props orderresult :', props);

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose, false)

    function onClose() {
        props.gotoOrderbookCB && props.gotoOrderbookCB()
        // props.onCloseCB && props.onCloseCB()
    }

    function onClickRetry() {
        props.storeOFSDialogDetails({
            name: OFS_DIALOGS.APPLY_ORDER,
            symData: props.symData,
            isRetryFromPopup:true,
            isModify:props.isModify
        })
    }

    function onClickDone() {
        props.storeOFSOrderbookUpdate(true) ;
        props.gotoOrderbookCB()

    }

    return (
        <div className={`ofsDialog-base order-result-base
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
                    {props.orderResult.isSuccess ? "Success" : "Failed"}
                </div>
                <div className="symName">
                    <span> {props.orderResult.symName} </span>
                    <span className = "exchange">{props.orderResult.exchange}</span>
                </div>
                <div className="messageDiv">
                    {props.orderResult.msg}
                </div>
                {
                    // props.orderResult.isSuccess ?
                    //     <div className="infoMsg">
                    //         {/* Please accept the UPI collect request on the UPI app to apply for successful bidding */}
                    //     </div>
                    //     : null
                }
                {
                    props.orderResult.isSuccess ?
                        <div className="appIdDiv">
                            <LangText name="APP_NO" module="OFS" /> : {props.orderResult.applicationNo}
                        </div>
                        : null
                }
                {
                    props.orderResult.isSuccess?
                        <div className="btnDiv" onClick={onClickDone}>
                            <button>
                                <LangText name="DONE" module="BUTTONS" />
                            </button>
                        </div>:
                        <div className="btnDiv" onClick={()=>onClickRetry()}>
                            <button>
                                <LangText name="RETRY" module="BUTTONS" />
                            </button>
                        </div>
                }
            </div>
        </div>
    )
}

const mapStateToProps = ({ settings, ofsDetails }) => {
    return {
        selectedTheme: settings.selectedTheme,
        dialogDetails: ofsDetails.dialogDetails,

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeOFSDialogDetails: (s) => { dispatch(storeOFSDialogDetails(s)) },
        storeOFSOrderbookUpdate: (s) => { dispatch(storeOFSOrderbookUpdate(s)) }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(OFSOrderResultComponent);