import { STORE_TOAST_MSG_PROPS } from '../actions/Actions';

const initialState = {
    show: false,
    message: null,
    error: false
}

const toastMsg = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_TOAST_MSG_PROPS:
            return Object.assign({}, state, {
                show: action.payload.show,
                message: action.payload.message,
                error: action.payload.error
            })
        default:
            return state;
    }
};

export default toastMsg;