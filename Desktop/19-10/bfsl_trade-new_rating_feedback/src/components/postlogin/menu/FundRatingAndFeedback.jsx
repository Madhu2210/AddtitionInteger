import React, {useRef} from 'react'
import useCloseModal from '../../../customHooksComponents/useCloseModal'
import { connect } from "react-redux";
import { fundRatingAndFeedback } from '../../../state/actions/Actions'

import FundFeedback from '../../../../src/components/feedback/FundFeedback';


const FundRatingAndFeedback = (props) => {

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose)

    function onClose() {
        props.fundRatingAndFeedback({showRating:false})
    }

    if(!props.ratingFeedbackFund.showRating)
        return null;
    if(props.ratingFeedbackFund.showRating){
        return (
            <div className= "help-and-support-base blur" >
                <div className= "rating-and-feedback" style={{width: "40%"}} ref={modalRef}>
                    <FundFeedback />
                </div>
            </div>
        )
    }
    return null
}

const mapStateToProps = ({menu}) => {
    return {
        ratingFeedbackFund: menu.ratingFeedbackFund
    }
    
}

const mapDispatchToProps = (dispatch) => {
    return {
        fundRatingAndFeedback: (s) => { dispatch(fundRatingAndFeedback(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps) (FundRatingAndFeedback);
