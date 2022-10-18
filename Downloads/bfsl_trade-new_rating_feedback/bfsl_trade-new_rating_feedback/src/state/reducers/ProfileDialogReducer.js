import {
    SHOW_PROFILE_DIALOG, STORE_BANK_DETAILS, STORE_PROFILE_DETAILS,
    STORE_PROFILE_IMAGE_URL, STORE_TAX_DECLARATION_DETAILS, STORE_ISBROKERAGE_VALUE,
    STORE_REGET_PROFILE_FLAG
} from '../actions/Actions';

const initialState = {
    dialog: {
        dialogName: null,
    },
    profileDetails: {},
    bankDetails: null,
    profile_image_url: null,
    taxDeclaration: {
        dialogName: null
    },
    isBrokerage: null,
    regetProfileDetails: false
}

const profileDialog = (state = initialState, action = {}) => {
    switch (action.type) {
        case SHOW_PROFILE_DIALOG:
            return Object.assign({}, state, {
                dialog: action.payload,
            })
        case STORE_PROFILE_DETAILS:
            return Object.assign({}, state, {
                profileDetails: action.payload
            })
        case STORE_BANK_DETAILS:
            return Object.assign({}, state, {
                bankDetails: action.payload
            })
        case STORE_PROFILE_IMAGE_URL:
            return Object.assign({}, state, {
                profile_image_url: action.payload
            })
        case STORE_TAX_DECLARATION_DETAILS:
            return Object.assign({}, state, {
                taxDeclaration: action.payload
            })
        case STORE_ISBROKERAGE_VALUE:
            return Object.assign({}, state, {
                isBrokerage: action.payload
            })
        case STORE_REGET_PROFILE_FLAG:
            return Object.assign({}, state, {
                regetProfileDetails: action.payload
            })
        default:
            return state;
    }
};

export default profileDialog;