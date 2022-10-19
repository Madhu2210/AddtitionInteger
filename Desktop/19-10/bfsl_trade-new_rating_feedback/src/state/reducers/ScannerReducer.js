import { STORE_SELECTED_SCANNER_MENU } from '../actions/Actions';

const initialState = {
    selectedMenu: null
}

const scanner = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_SELECTED_SCANNER_MENU:
            return Object.assign({}, state, { selectedMenu: action.payload });
        default:
            return state;
    }
};

export default scanner;