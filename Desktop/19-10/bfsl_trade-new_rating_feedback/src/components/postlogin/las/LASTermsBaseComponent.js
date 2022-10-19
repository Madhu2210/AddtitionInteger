import React,  { useRef } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import { LAS_LOAN_DIALOGS } from '../../../common/Constants';
import useCloseModal from '../../../customHooksComponents/useCloseModal';
import { showTermsIframeFlag, storeAvailLoanDialogDetails } from '../../../state/actions/Actions';
import { CloseIcon } from '../../common/FontIcons';

function LASTermsBaseComponent(props) {
    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, closeCB)

    function closeCB() {
        // props.storeAvailLoanDialogDetails({
        //     dialogName: LAS_LOAN_DIALOGS.TERMS_CONDITIONS
        // })
        props.showTermsIframeFlag(false)
    }

    return (
        <div className="app-modalDialog2 las-iframe">
            <div className="window" ref={modalRef} >
                <span className="closeIcon-div" onClick={closeCB}>
                    <CloseIcon />
                </span>
                <div className="content">
                    <iframe
                        className="iframe"
                        id="LASTerms"
                        src="LASTermsAndConditions.html"
                        height="100%"
                        width="100%"
                        name="iframeWebView"
                        allowFullScreen="true"
                        webkitallowfullscreen="true"
                        mozallowfullscreen="true"
                    >
                    </iframe>
                </div>
            </div>
        </div>
    )
    
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) },
        showTermsIframeFlag: (s) => { dispatch(showTermsIframeFlag(s)) },

    };
};

export default connect(null,mapDispatchToProps) (withRouter(LASTermsBaseComponent));