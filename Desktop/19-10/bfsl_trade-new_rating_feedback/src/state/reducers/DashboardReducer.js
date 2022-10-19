import { STORE_SELECTED_DASHBOARD_WIDGET ,STORE_DEEPLINK_MARKETSMITH_FLAG} from "../actions/Actions";
import { DASHBOARD_WIDGET_MODE } from "../../common/Constants";

const initialState = {
    selectedIndices: { name: "Nifty 50", exc: "NSE" },
    selectedWidgetMode: DASHBOARD_WIDGET_MODE.DEFAULT,
    deepLinkMarketsmith:false,
}

const dashboard = (state = initialState, action = {}) => {
    
    switch (action.type) {
        case STORE_SELECTED_DASHBOARD_WIDGET:
            return Object.assign({}, state, { selectedWidgetMode: action.payload });
        case STORE_DEEPLINK_MARKETSMITH_FLAG:
            return Object.assign({}, state, { deepLinkMarketsmith: action.payload });
        default:
            return state;
    }
};

export default dashboard;