import { STORE_CORP_NEWS_DETAILS, STORE_SHOW_EVOTING_FLAG } from "../actions/Actions";

const initialState = {
    dialogDetails: {
        name: null,
        selectedRow: null,
        selectedCorporateAction: null
    },
    showEVotingScreen: false
}

const newsDetails = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_CORP_NEWS_DETAILS:
            return Object.assign({}, state, { dialogDetails: action.payload });
        case STORE_SHOW_EVOTING_FLAG:
            return Object.assign({}, state, { showEVotingScreen: action.payload });
        default:
            return state;
    }
};

export default newsDetails;