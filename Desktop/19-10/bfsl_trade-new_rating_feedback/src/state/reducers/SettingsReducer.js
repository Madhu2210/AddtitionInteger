import { STORE_APP_LANG, STORE_APP_THEME, STORE_SAVED_PREFERENCE_DETAILS } from '../actions/Actions';

import { THEME_ARRAY, LOCAL_STORAGE } from '../../common/Constants';
import { LanguageOptions } from '../../common/lang/index'
import { saveState } from '../Store'

const initialState = {
    selectedTheme: THEME_ARRAY[1],
    selectedLang: LanguageOptions[0],
    savePreference: null
     
}

const settings = (state = initialState, action = {}) => {
    switch (action.type) {

        case STORE_APP_THEME:
        {
            let upadtedState = Object.assign({}, state, { selectedTheme: action.payload })
            saveState(LOCAL_STORAGE.SETTINGS, upadtedState)
            return upadtedState;
        }
        case STORE_APP_LANG:
        {
            let upadtedState = Object.assign({}, state, { selectedLang: action.payload })
            saveState(LOCAL_STORAGE.SETTINGS, upadtedState)
            return upadtedState;
        }
        case STORE_SAVED_PREFERENCE_DETAILS:
        {
            return Object.assign({}, state, { savePreference: action.payload });
        }
        // case STORE_LANG_CONTENT:
        // {
        //     let upadtedState = Object.assign({}, state, { langContent: action.payload })
        //     saveState(LOCAL_STORAGE.SETTINGS, upadtedState)
        //     return upadtedState;
        // }
        default:
            return state
    }
};

export default settings;