import { STORE_INVALID_SESSION } from '../actions/Actions'

const initialState = {
    inValidSession: false
}

const session = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_INVALID_SESSION:
            return Object.assign({}, state, { inValidSession: action.payload });
        default:
            return state;
    }
};

export default session;