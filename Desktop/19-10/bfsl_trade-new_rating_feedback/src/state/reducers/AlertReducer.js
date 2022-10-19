import {
    STORE_ALERT_SELECTED_SYM,STORE_ALERT_SEARCH_MODIFY,STORE_NOTIFY_FLAG,STORE_ALERT_BTN_OPEN_SEARCH
} from '../actions/Actions';

const initialState = {
    selectedSym: null,
    searchModify: null,
    notifyFlag: false,
    alertBtnOpen: false
}

const alerts = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_ALERT_SELECTED_SYM:
            return Object.assign({}, state, { selectedSym: action.payload });
        case STORE_ALERT_SEARCH_MODIFY:
            return Object.assign({}, state, { searchModify: action.payload });
        case STORE_NOTIFY_FLAG:
            return Object.assign({}, state, { notifyFlag: action.payload });
        case STORE_ALERT_BTN_OPEN_SEARCH:
            return Object.assign({}, state, { alertBtnOpen: action.payload });
        default:
            return state;
    }
};

export default alerts;