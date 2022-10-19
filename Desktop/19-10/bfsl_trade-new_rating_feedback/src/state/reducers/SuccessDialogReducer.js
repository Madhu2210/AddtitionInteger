import { STORE_SETTINGS_DIALOG_DETAILS } from '../actions/Actions';

const initialState = {
    dialog: {
        dialogName: null,
        data: {},
        message: '',
        parentCB: null
    },
}

const successDialog = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_SETTINGS_DIALOG_DETAILS:
            return Object.assign({}, state, { dialog: action.payload });
        default:
            return state
    }
}

export default successDialog;