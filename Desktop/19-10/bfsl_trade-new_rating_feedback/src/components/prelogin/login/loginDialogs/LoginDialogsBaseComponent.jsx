import React from 'react'
import { connect } from "react-redux";

import ForgetPasswordDialogComponent from './ForgetPasswordDialogComponent';
import MembershipDetailsDialogComponent from './MembershipDetailsDialogComponent';
import UnblockUserDialogComponent from './UnblockUserDialogComponent';
import ResetPasswordDialogComponent from './ResetPasswordDialogComponent';
import MobileVerificationDialogComponent from './MobileVerificationDialogComponent';
import AccountBlockedDialogComponent from './AccountBlockedDialogComponent';
import PasswordExpiredDialog from './PasswordExpiredDialogComponent';
import SetPasswordDialog from './SetPasswordDialogComponent';
import HelpAndSupportComponent from '../../../postlogin/menu/HelpAndSupportComponent'
import LoginOTPVerificationDialogComponent from './LoginOTPVerificationDialogComponent'
import LoginMPINVerificationDialogComponent from './LoginMPINVerificationDialogComponent'
import { storeLoginDialogDetails } from '../../../../state/actions/Actions';
import { LOGIN_DIALOGS } from '../../../../common/Constants';
import UserInfoDialogComponent from './UserInfoDialogComponent';
import GuestUserInfoDialogComponent from './GuestUserInfoDialogComponent';
import ForgotUserIdDialogComponent from './ForgotUserIdDialogComponent';
import LanguageOptionsList from './LanguageOptionsListComponent';

const LoginDialogsBaseComponent = (props) => {

    const { dialog } = props;

    function onClose() {
        props.storeLoginDialogDetails({
            dialogName: null,
            message: '',
            parentCB: null,
            userId: null
        })
    }

    function openUnblockAccDialog() {
        props.storeLoginDialogDetails({
            dialogName: LOGIN_DIALOGS.UNBLOCK_USER,
            parentCB: null
        })
    }

    function parentCB(data) {
        dialog.parentCB && dialog.parentCB(data)
        onClose()
    }

    function onClickChangePass() {
        props.storeLoginDialogDetails({
            dialogName: LOGIN_DIALOGS.RESET_PASSWORD,
            parentCB: null
        })
    }

    function showSetPassword(userId) {
        props.storeLoginDialogDetails({
            dialogName: LOGIN_DIALOGS.SET_PASSWORD,
            userId: userId,
            parentCB: null
        })
    }

    // function onClickLoginOTP(userId) {
    //     props.storeLoginDialogDetails({
    //         dialogName: LOGIN_DIALOGS.LOGIN_OTP_VERIFICATION,
    //         userId: userId,
    //         parentCB: null
    //     })
    // }

    if (dialog.dialogName === LOGIN_DIALOGS.FORGET_PASSWORD)
        return <ForgetPasswordDialogComponent onCloseCB={onClose} showSetPasswordCB={showSetPassword} />
    else if (dialog.dialogName === LOGIN_DIALOGS.FORGET_USERID)
        return <ForgotUserIdDialogComponent onCloseCB={onClose} />
    else if (dialog.dialogName === LOGIN_DIALOGS.MEMBERSHIP_DETAILS)
        return <MembershipDetailsDialogComponent onCloseCB={onClose} />
    else if (dialog.dialogName === LOGIN_DIALOGS.UNBLOCK_USER)
        return <UnblockUserDialogComponent onCloseCB={onClose} />
    else if (dialog.dialogName === LOGIN_DIALOGS.RESET_PASSWORD)
        return <ResetPasswordDialogComponent onCloseCB={onClose} parentCB={parentCB} userId={dialog.userId} />
    else if (dialog.dialogName === LOGIN_DIALOGS.MOBILE_VERIFICATION)
        return <MobileVerificationDialogComponent onCloseCB={onClose} parentCB={parentCB} />
    else if (dialog.dialogName === LOGIN_DIALOGS.ACCOUNT_BLOCKED)
        return <AccountBlockedDialogComponent onCloseCB={onClose}
            openUnblockAccDialogCB={openUnblockAccDialog} message={dialog.message}
        />
    else if (dialog.dialogName === LOGIN_DIALOGS.PASSWORD_EXPIRED)
        return <PasswordExpiredDialog onCloseCB={onClose} onClickChangePassCB={onClickChangePass} />
    else if (dialog.dialogName === LOGIN_DIALOGS.SET_PASSWORD)
        return <SetPasswordDialog onCloseCB={onClose} userId={dialog.userId} />
    else if (dialog.dialogName === LOGIN_DIALOGS.HELP_AND_SUPPORT) 
        return <HelpAndSupportComponent onCloseCB={onClose} beforeLogin={true}/>
    else if (dialog.dialogName === LOGIN_DIALOGS.GUEST_USER_INFO) 
        return <UserInfoDialogComponent onCloseCB={onClose} parentCB={parentCB}/>
    else if (dialog.dialogName === LOGIN_DIALOGS.GUEST_USER_MENU_INFO) {
        return <GuestUserInfoDialogComponent onCloseCB={onClose} parentCB={parentCB}/>
    }
    else if (dialog.dialogName === LOGIN_DIALOGS.LANGUAGE_OPTIONS) {
        return <LanguageOptionsList onCloseCB={onClose} parentCB={parentCB}/>
    }
    else if (dialog.dialogName === LOGIN_DIALOGS.LOGIN_OTP_VERIFICATION) {
        return <LoginOTPVerificationDialogComponent onCloseCB={onClose} parentCB={parentCB} userId={dialog.userId}/>
    }
    else if (dialog.dialogName === LOGIN_DIALOGS.LOGIN_MPIN_VERIFICATION) {
        return <LoginMPINVerificationDialogComponent onCloseCB={onClose} 
            parentCB={parentCB} userId={dialog.userId} password={dialog.password} pan_dob={dialog.pan_dob}/>
    }
    return null
}

const mapStateToProps = ({ login }) => {
    return {
        dialog: login.dialog
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeLoginDialogDetails: (s) => { dispatch(storeLoginDialogDetails(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginDialogsBaseComponent);