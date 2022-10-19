import React from 'react'
import LangText from '../../../common/lang/LangText';

function StreamingSettingsComponent(props) {
    return (
        <div className="streaming-setting">
            <p> <LangText name="IS_STREAMING" /> :  {props.selectedType} </p>
        </div>
    )
}

export default StreamingSettingsComponent;