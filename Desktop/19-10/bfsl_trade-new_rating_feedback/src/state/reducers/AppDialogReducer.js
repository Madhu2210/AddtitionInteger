import { SHOW_APP_DIALOG } from '../actions/Actions';

const initialState = {
    show: false,
    header: null,
    title: null,
    message: null,
    buttons: null,
    success: null,
    closeCB: null,
    removeOutsideClose: false,
    logoutGuest: false,
    guestBtns:null,
    baseParent:false,
}

const modalDialog = (state = initialState, action = {}) => {
    switch (action.type) {
        case SHOW_APP_DIALOG:
            return Object.assign({}, state, {
                show: action.payload.show,
                message: action.payload.message,
                closeCB: action.payload.closeCB,
                title: action.payload.title,
                buttons: action.payload.buttons,
                defaultBtnName: action.payload.defaultBtnName,
                success: action.payload.success,
                removeOutsideClose: action.payload.removeOutsideClose,
                logoutGuest: action.payload.logoutGuest,
                guestBtns: action.payload.guestBtns,
                baseParent: action.payload.baseParent

            })
        default:
            return state;
    }
};

export default modalDialog;