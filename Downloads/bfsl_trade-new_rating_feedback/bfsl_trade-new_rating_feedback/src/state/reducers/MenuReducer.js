import { APP_MENUS } from '../../common/Constants';
import {
    STORE_SHOW_MENU_FLAG, STORE_SELECTED_APP_MENU,
    STORE_SHOW_PLEDGE_FLAG, STORE_SHOW_EDIS_FLAG, STORE_SHOW_BO_REPORTS_SCREEN,
    STORE_ALERT_FLAG, STORE_HELP_AND_SUPPORT, STORE_RATING_AND_FEEDBACK
} from '../actions/Actions';

const initialState = {
    showMenuDialog: false,
    showPledgeScreen: false,
    selectedAppMenu: APP_MENUS.DASHBOARD,
    showEdisScreen: false,
    showBOReportsScreen: false,
    showAlertScreen: false,
    helpAndSupport: {
        showHelpAndSupport:false,
        isAfterLogin: false
    },
    ratingFeedback: {
        showRating:false,
    }


}

const menu = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_SHOW_MENU_FLAG:
            return Object.assign({}, state, { showMenuDialog: action.payload })
        case STORE_SELECTED_APP_MENU:
            return Object.assign({}, state, { selectedAppMenu: action.payload })
        case STORE_SHOW_PLEDGE_FLAG:
            return Object.assign({}, state, { showPledgeScreen: action.payload })
        case STORE_SHOW_EDIS_FLAG:
            return Object.assign({}, state, { showEdisScreen: action.payload })
        case STORE_SHOW_BO_REPORTS_SCREEN:
            return Object.assign({}, state, { showBOReportsScreen: action.payload })
        case STORE_ALERT_FLAG:
            return Object.assign({}, state, { showAlertScreen: action.payload })
        case STORE_HELP_AND_SUPPORT:
            return Object.assign({}, state, { helpAndSupport: action.payload })
        case STORE_RATING_AND_FEEDBACK:
                return Object.assign({}, state, { ratingFeedback: action.payload })
        default:
            return state;
    }
};

export default menu;