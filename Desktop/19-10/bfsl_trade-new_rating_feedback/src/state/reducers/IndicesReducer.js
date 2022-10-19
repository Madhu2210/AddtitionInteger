import { STORE_INDICES_DETAILS } from "../actions/Actions";

const initialState = {
    selectedSymbol: ''
}

const indicesDetails = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_INDICES_DETAILS:
            return Object.assign({}, state, { selectedSymbol: action.payload });
        default:
            return state;
    }
};

export default indicesDetails;