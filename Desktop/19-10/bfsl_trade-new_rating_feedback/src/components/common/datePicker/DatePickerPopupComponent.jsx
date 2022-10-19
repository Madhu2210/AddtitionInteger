import React, { useState } from 'react'
// import { Calendar } from 'primereact/calendar';

import LoaderComponent from '../LoaderComponent';

import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css"
import DatePickerComponent from './DatePickerComponent';

const DatePickerPopupComponent = (props) => {

    const [focusOn, setFocusOn] = useState(false)

    function onFocusPicker() {
        setFocusOn(true)
    }

    function onBlurPicker() {
        setFocusOn(false)
    }

    return (
        <div className="datePicker-popup-div">
            {
                focusOn ?
                    <LoaderComponent hideLoader={true} />
                    : null
            }

            <DatePickerComponent {...props} onFocusPicker={onFocusPicker} onBlurPicker={onBlurPicker} />

        </div>
    )
}

export default DatePickerPopupComponent;