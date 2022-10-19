import { APP_ID, CONFIG_STATUS } from '../actions/Actions';

const initialState = {
    configStatus: false,
    appID: null
}

const config = (state = initialState, action = {}) => {
    switch (action.type) {
        case APP_ID:
            return Object.assign({}, state, { appID: action.payload });
        case CONFIG_STATUS:
            return Object.assign({}, state, { configStatus: action.payload });
        default:
            return state;
    }
};

export default config;