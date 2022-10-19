import {
    STORE_ORDERPAD_DIALOG_DETAILS, STORE_ORDER_FIELD_VALUES,
    STORE_MODIFY_ORDER_INTERNAL_FLAG, STORE_ORDERPAD_SELECTED_SYM, STORE_MODIFY_ORDER_FLAG,
    STORE_SQUARE_OFF_NET_POSITION
} from '../actions/Actions';

const initialState = {
    selectedSym: null,
    orderFieldValues: null,
    modifyOrder: {
        modifyType: null,
        symDetails: {},
    },
    isModifyOrder_internal: false,
    dialog: {
        dialogName: null,
        message: '',
        parentCB: null,
        trade_type: null,
        type:null,
        enableStopLoss: null,
        prod_type: null,
        redirectionMsg: ""
    },
    isSquareOff: false,
}

const orderPad = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_ORDERPAD_DIALOG_DETAILS:
            return Object.assign({}, state, { dialog: action.payload });
        case STORE_ORDERPAD_SELECTED_SYM:
            return Object.assign({}, state, { selectedSym: action.payload });
        case STORE_ORDER_FIELD_VALUES:
            return Object.assign({}, state, { orderFieldValues: action.payload });
        case STORE_MODIFY_ORDER_INTERNAL_FLAG:
            return Object.assign({}, state, { isModifyOrder_internal: action.payload });
        case STORE_MODIFY_ORDER_FLAG:
            return Object.assign({}, state, { modifyOrder: action.payload });
        case STORE_SQUARE_OFF_NET_POSITION:
            return Object.assign({}, state, { isSquareOff: action.payload });
        default:
            return state;
    }
};

export default orderPad;