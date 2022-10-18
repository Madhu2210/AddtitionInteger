import { STORE_NETPOSITION_SORT_DETAILS, STORE_REGET_NET_POSITIONS } from "../actions/Actions"

const initialState = {
    netPositionsSortData: null,
    regetNetPositions: false
}

const netPosition = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_NETPOSITION_SORT_DETAILS:
            return Object.assign({}, state, { netPositionsSortData: action.payload });
        case STORE_REGET_NET_POSITIONS:
            return Object.assign({}, state, { regetNetPositions: action.payload });
        default:
            return state
    }
}

export default netPosition;