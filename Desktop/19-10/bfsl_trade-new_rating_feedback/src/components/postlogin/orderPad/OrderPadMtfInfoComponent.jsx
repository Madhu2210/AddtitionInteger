import React, { useRef } from 'react'
import { connect } from 'react-redux'
import LangText from '../../../common/lang/LangText'
import useCloseModal from '../../../customHooksComponents/useCloseModal'
import { storeOrderPadDialogDetails } from '../../../state/actions/Actions'

function OrderPadMtfInfoComponent(props) {

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose)

    function onClose() {
        // props.storeOrderPadDialogDetails({
        //     trade_type: props.orderPad.dialog.trade_type
        // })
        props.onCloseCB && props.onCloseCB()
    }

    return ( 
        <div className="mtf-knowmore-base" ref={modalRef}>
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
            <div className="info-block">
                <div className="margin-head">MARGIN</div>
                <div className="terms-head">Terms & Conditions </div>
                <div className="details-div">
                    <span className="item"><LangText name="MTF_KNOW_MORE_INFO_1"/></span>
                    <span className="item"><LangText name="MTF_KNOW_MORE_INFO_2"/></span>
                    <span className="item"><LangText name="MTF_KNOW_MORE_INFO_3"/></span>
                    <span className="item"><LangText name="MTF_KNOW_MORE_INFO_4"/></span>
                    <span className="item"><LangText name="MTF_KNOW_MORE_INFO_5"/></span>
                    <span className="item"><LangText name="MTF_KNOW_MORE_INFO_6"/></span>
                    <span className="item"><LangText name="MTF_KNOW_MORE_INFO_7"/></span>
                    <span className=" item lastChild"><LangText name="MTF_KNOW_MORE_INFO_8"/></span>
                </div>
                {/* <span className="sym-name">{props.symDetails.dispSym}</span>
                    <span className="exc">{props.symDetails.exc}</span> */}
            </div>
            {/* <div className="text">{props.orderMsg}</div> */}
            {/* <div className="action-div">
                    <button className="cancel-btn" onClick={onClickCancel}>CANCEL</button>
                    <button className="proceed-btn" 
                        onClick={
                            onClickProceed}>PROCEED</button>
                </div> */}
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeOrderPadDialogDetails: (s) => { dispatch(storeOrderPadDialogDetails(s)) },
    };
};

const mapStateToProps = ({ settings, orderPad }) => {
    return {
        orderPad: orderPad,
        selectedTheme: settings.selectedTheme
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderPadMtfInfoComponent);
