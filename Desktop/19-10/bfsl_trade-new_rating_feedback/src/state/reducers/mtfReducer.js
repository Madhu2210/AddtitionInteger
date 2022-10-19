import { STORE_MTF_DIALOG_DETAILS, STORE_MTF_PLEDGE_FLAG }from "../actions/Actions";

const initialState = {
    dialogDetails: {
        name: null
    },
    showMtfPledgeScreen: false
}

const mtfDetails = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_MTF_DIALOG_DETAILS:
            return Object.assign({}, state, { dialogDetails: action.payload });
        case STORE_MTF_PLEDGE_FLAG:
            return Object.assign({}, state, { showMtfPledgeScreen: action.payload });
        default:
            return state;
    }
};

export default mtfDetails;