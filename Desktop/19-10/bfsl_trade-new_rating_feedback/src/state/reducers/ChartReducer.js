import {
    STORE_SELECTED_CHART_SYM, STORE_SELECTED_CHART_WIDGET_MENU, STORE_CHART_DIALOG_DETAILS,
    STORE_RELOAD_CHART_SETTINGS_FLAG
} from '../actions/Actions';

const initialState = {
    selectedSym: null,
    selectedChartWidgetMenu: null,
    reloadChartSettings: false,
    chartDialogDetails: {
        show: false
    }
}

const chart = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_SELECTED_CHART_SYM:
            return Object.assign({}, state, { selectedSym: action.payload });
        case STORE_SELECTED_CHART_WIDGET_MENU:
            return Object.assign({}, state, { selectedChartWidgetMenu: action.payload });
        case STORE_CHART_DIALOG_DETAILS:
            return Object.assign({}, state, { chartDialogDetails: action.payload });
        case STORE_RELOAD_CHART_SETTINGS_FLAG:
            return Object.assign({}, state, { reloadChartSettings: action.payload });
        default:
            return state;
    }
};

export default chart;