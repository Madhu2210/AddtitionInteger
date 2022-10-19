import { STORE_SELECTED_QUOTE_SYM, STORE_QUOTE_DIALOG_DETAILS, } from '../actions/Actions';
// import { SCREENS } from '../../common/Constants';

const initialState = {
    selectedSym: null,
    dialog: {
        dialogName: null,
        parentCB: null

    }
}

const quote = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_SELECTED_QUOTE_SYM:
            return Object.assign({}, state, { selectedSym: action.payload });
        case STORE_QUOTE_DIALOG_DETAILS:
            return Object.assign({}, state, { dialog: action.payload });
        default:
            return state;
    }
};

export default quote;