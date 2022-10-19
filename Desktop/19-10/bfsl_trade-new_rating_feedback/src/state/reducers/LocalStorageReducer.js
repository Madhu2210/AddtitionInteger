import { STORE_SELECTED_INDICES_LIST, STORE_RECENT_SEARCH_SYMBOLS, 
    STORE_LANGUAGE_CONTENT_TOSTORE } from '../actions/Actions';

import { saveState } from '../Store'
import { LOCAL_STORAGE } from '../../common/Constants';
import { storeToSessionStorage } from '../../common/LocalStorage';

const initialState = {
    selectedIndicesList: [],
    recendSyms: [],
    langDictionary:{}
}

const localStorageRed = (state = initialState, action = {}) => {
    switch (action.type) {
        case STORE_SELECTED_INDICES_LIST:
        {
            saveState(LOCAL_STORAGE.SELECTED_INDICES, action.payload)
            return Object.assign({}, state, { selectedIndicesList: action.payload });
        }
        case STORE_RECENT_SEARCH_SYMBOLS:
        {
            saveState(LOCAL_STORAGE.RECENT_SEARCH_SYMBOLS, action.payload)
            return Object.assign({}, state, { recendSyms: action.payload });
        }
        case STORE_LANGUAGE_CONTENT_TOSTORE:
        {
            // saveState(LOCAL_STORAGE.LANGUAGE_SETTING_OPTIONS, action.payload)
            storeToSessionStorage(LOCAL_STORAGE.LANGUAGE_SETTING_OPTIONS, JSON.stringify(action.payload))
            return Object.assign({}, state, { langDictionary: action.payload });
        }
        default:
            return state;
    }
};

export default localStorageRed;