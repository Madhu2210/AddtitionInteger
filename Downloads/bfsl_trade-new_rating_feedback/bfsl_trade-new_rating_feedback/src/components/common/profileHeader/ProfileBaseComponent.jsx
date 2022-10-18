import React, {  useRef } from 'react'
import { connect } from "react-redux";
import { HEADER_PROFILE } from '../../../common/Constants';
import useCloseModal from '../../../customHooksComponents/useCloseModal';
import { showProfileDialog } from '../../../state/actions/Actions';
import ProfileDialogComponent from './ProfileDialogComponent';
import ProfileImageComponent from './ProfileImageComponent';


function ProfileBaseComponent(props) {

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose)

    const { profileDialog } = props

    function onClose() {
        props.showProfileDialog({
            dialogName: null
        })
    }


    function dialogSwitch(dlgname) {
        switch (dlgname) {
            case HEADER_PROFILE.PROFILE_PAGE:
                return <ProfileDialogComponent />
            case HEADER_PROFILE.IMAGE_UPLAOD:
                return <ProfileImageComponent />
            default:
                return null

        }
    }
    if (!profileDialog.dialogName)
        return null
    return (
        <div className="profileDialogbase" ref={modalRef}>
            {
                dialogSwitch(profileDialog.dialogName)
            }
        </div>
    )
}
const mapStateToProps = ({ profileDialog }) => {
    return {
        profileDialog: profileDialog.dialog,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        showProfileDialog: (s) => { dispatch(showProfileDialog(s)) },
        
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfileBaseComponent);