import React, {useRef} from 'react'
import useCloseModal from '../../../customHooksComponents/useCloseModal'
import { connect } from "react-redux";
import { storeHelpAndSupportPopupFlag } from '../../../state/actions/Actions'
import HelpAndSupportDetailsComponent from '../../common/HelpAndSupportDetailsComponent';

const HelpAndSupportComponent = (props) => {

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose)

    function onClose() {
        props.storeHelpAndSupportPopupFlag({showHelpAndSupport:false})
    }

    if(!props.helpAndSupport.showHelpAndSupport)
        return null;
    if(props.helpAndSupport.showHelpAndSupport){
        return (
            <div className= "help-and-support-base blur" >
                <div className= "help-and-support near-menu" ref={modalRef}>
                    <HelpAndSupportDetailsComponent/>
                </div>
            </div>
        )
    }
    return null
}

const mapStateToProps = ({menu}) => {
    return {
        helpAndSupport: menu.helpAndSupport
    }
    
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeHelpAndSupportPopupFlag: (s) => { dispatch(storeHelpAndSupportPopupFlag(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps) (HelpAndSupportComponent);
