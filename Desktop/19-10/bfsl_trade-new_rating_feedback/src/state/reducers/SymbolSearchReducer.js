// import { STORE_RECENT_SEARCH_SYMBOLS } from '../actions/Actions';

import { LOCAL_STORAGE } from '../../common/Constants';
import { getItemByKey } from '../../common/LocalStorage'

const initialState = {
    recendSyms: JSON.parse(getItemByKey(LOCAL_STORAGE.RECENT_SEARCH_SYMBOLS))
}

const symbolSearch = (state = initialState, action = {}) => {
    switch (action.type) {
        default:
            return state
    }
};

export default symbolSearch;