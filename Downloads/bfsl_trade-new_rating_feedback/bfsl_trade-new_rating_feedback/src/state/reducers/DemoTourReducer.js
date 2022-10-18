import {REFRESH_DEMO_TOUR,WATCHLIST_DEMO_TOUR_FLAG,WATCHLIST_SYM_NAME, STORE_DEMO_FIRST, 
    STORE_DEMO_WATCHLIST, STORE_DEMO_WATCHLIST_MTF, DEMO_POPUP_BLOCK} from '../actions/Actions';

const initialState = {
    demoFirstLogin : null,
    refreshDemoTour: false,
    demoTourFlag: false,
    demoTourSymName: null,
    demoWatchList: {},
    demoWatchListMtf: false,
    demoPopupBlock: false
}

const demoTour = (state = initialState, action = {}) => {
    switch (action.type) {
        case REFRESH_DEMO_TOUR:
            return Object.assign({}, state, { refreshDemoTour: action.payload });
        case WATCHLIST_DEMO_TOUR_FLAG:
            return Object.assign({}, state, { demoTourFlag: action.payload });
        case WATCHLIST_SYM_NAME:
            return Object.assign({}, state, { demoTourSymName: action.payload });
        case STORE_DEMO_FIRST:
            return Object.assign({}, state, { demoFirstLogin: action.payload });
        case STORE_DEMO_WATCHLIST:
            return Object.assign({}, state, { demoWatchList: action.payload });
        case STORE_DEMO_WATCHLIST_MTF:
            return Object.assign({}, state, { demoWatchListMtf: action.payload });
        case DEMO_POPUP_BLOCK:
            return Object.assign({}, state, { demoPopupBlock: action.payload });
        default:
            return state;
    }
};

export default demoTour;