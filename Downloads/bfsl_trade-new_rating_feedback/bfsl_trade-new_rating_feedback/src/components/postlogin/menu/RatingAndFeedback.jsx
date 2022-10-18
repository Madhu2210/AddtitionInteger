import React, {useRef} from 'react'
import useCloseModal from '../../../customHooksComponents/useCloseModal'
import { connect } from "react-redux";
import { storeRatingAndFeedback } from '../../../state/actions/Actions'
import Feedback from '../../feedback/feedback';


const RatingAndFeedback = (props) => {

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose)

    function onClose() {
        props.storeRatingAndFeedback({showRating:false})
    }

    if(!props.ratingFeedback.showRating)
        return null;
    if(props.ratingFeedback.showRating){
        return (
            <div className= "help-and-support-base blur" >
                <div className= "rating-and-feedback" style={{width: "40%"}} ref={modalRef}>
                    <Feedback />
                </div>
            </div>
        )
    }
    return null
}

const mapStateToProps = ({menu}) => {
    return {
        ratingFeedback: menu.ratingFeedback
    }
    
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeRatingAndFeedback: (s) => { dispatch(storeRatingAndFeedback(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps) (RatingAndFeedback);
