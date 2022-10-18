import React, { useRef } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min'
import LangText from '../../../../common/lang/LangText'
// import { DASHBOARD_WIDGET_MODE, SCREENS } from '../../../../common/Constants'
import useCloseModal from '../../../../customHooksComponents/useCloseModal'
import { storeGoToHoldingsFlag, 
    storeMtfDialogDetails, storeMtfEpledgeScreenFlag } from '../../../../state/actions/Actions'

function MtfPledgeConfirmDialogComponent(props) {

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClickClose)

    function onClickClose() {
        props.onCloseCB && props.onCloseCB()
    }

    function onclickProceed() {
        props.storeMtfEpledgeScreenFlag(true)
        // props.history.push(SCREENS.DASHBOARD)
        // props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT)
        props.onCloseCB && props.onCloseCB()
    }

    return (
        <div className="app-modalDialog2 mtf-confirm-dlg">
            <div className="window" ref={modalRef}>
                <div className="header">
                    {/* <img src="assets/images/dashboard/success_btn.svg" alt="" />
                    <div className="statusDiv">
                        <span className="status successStatus">
                            <LangText name="SUCCESS" module="TAX" />
                        </span>
                    </div> */}
                    <LangText name="MTF_EPLEDGE"/>
                </div>
                <div className="msg-content">
                    <ul>
                        <li><span>
                            <LangText name="MTF_INFO1_1"/> time <LangText name="MTF_INFO1_2"/>
                        </span>
                        </li>
                        <li><span>
                            <LangText name="MTF_INFO2"/>
                        </span>
                        </li>
                    </ul>
                </div>
                <div className="action-button" >
                    <div
                        onClick={onClickClose} ><button className="okBtn" ><LangText name="CANCEL"/></button>
                    </div>
                    <div>
                        <button className="proceedBtn" onClick={onclickProceed}><LangText name="PROCEED"/></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeMtfDialogDetails: (s) => { dispatch(storeMtfDialogDetails(s)) },
        storeMtfEpledgeScreenFlag: (s) => {dispatch(storeMtfEpledgeScreenFlag(s))},
        storeGoToHoldingsFlag: (s) => {dispatch(storeGoToHoldingsFlag(s))}
    };
};

export default connect(null,mapDispatchToProps) (withRouter(MtfPledgeConfirmDialogComponent))

