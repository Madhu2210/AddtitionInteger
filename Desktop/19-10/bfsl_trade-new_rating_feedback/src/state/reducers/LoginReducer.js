import { LOGIN_STATUS, CLIENT_DETAILS, STORE_LOGIN_DIALOG_DETAILS, LOGGED_USER_TYPE } from '../actions/Actions';

const initialState = {
    loginStatus: false,
    loggedUserType: null,
    clientDetails: {
        custName: null,
        lastLoginTime: null,
        session: null
    },
    dialog: {
        dialogName: null,
        message: '',
        parentCB: null,
        userId: null
    }
}

const login = (state = initialState, action = {}) => {
    switch (action.type) {
        case LOGIN_STATUS:
            return Object.assign({}, state, { loginStatus: action.payload });
        case CLIENT_DETAILS:
            return Object.assign({}, state, { clientDetails: action.payload });
        case STORE_LOGIN_DIALOG_DETAILS:
            return Object.assign({}, state, { dialog: action.payload });
        case LOGGED_USER_TYPE:
            return Object.assign({}, state, { loggedUserType: action.payload });
        default:
            return state;
    }
};

export default login;