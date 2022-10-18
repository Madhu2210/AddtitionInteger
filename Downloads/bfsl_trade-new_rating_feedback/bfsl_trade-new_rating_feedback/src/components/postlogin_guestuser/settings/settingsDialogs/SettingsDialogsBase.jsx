import React from 'react'
import { connect } from 'react-redux'
import { SAVED_PREFERENCE_DETAILS } from '../../../../common/Constants'
// import SavedPreferenceDialog from './SavedPreferenceDialog'
import SavedFilterDialog from './SavedPreferenceDialog'

function SettingsDialogBase(props) {
    switch(props.savePreference){
        case SAVED_PREFERENCE_DETAILS:
            return <SavedFilterDialog/>
        default:
            return null
    }

}
const mapStateToProps = ({ settings }) => {
    return {
        savePreference: settings.savePreference
    }
}
export default connect(mapStateToProps,null)(SettingsDialogBase);
