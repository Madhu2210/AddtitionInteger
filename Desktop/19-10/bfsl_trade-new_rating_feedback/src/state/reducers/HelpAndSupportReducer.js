import { STORE_SAMADHAN_REDIRECTION_FLAG } from "../actions/Actions";

const initialState = {
    showSamadhanScreen: false 
}

const helpAndSupport = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_SAMADHAN_REDIRECTION_FLAG:
            return Object.assign({}, state, { showSamadhanScreen: action.payload })
        default:
            return state;
    }
};

export default helpAndSupport;