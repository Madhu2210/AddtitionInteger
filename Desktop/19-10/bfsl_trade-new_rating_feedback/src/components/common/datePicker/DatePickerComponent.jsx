import React from 'react'
import { Calendar } from 'primereact/calendar';

import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css"

const DatePickerComponent = (props) => {

    function onFocus(e) {
        props.onFocus && props.onFocus(e)
        props.onFocusPicker && props.onFocusPicker(e)
    }

    function onBlur(e) {
        props.onBlur && props.onBlur(e)
        props.onBlurPicker && props.onBlurPicker(e)
    }

    function onChangeDate(e) {
        props.onChangeDate && props.onChangeDate(e)
    }

    function getDateFormat(dateFormat) {
        if (dateFormat == 'MM-YYYY')
            return 'mm/yy'
        return 'dd-mm-yy'
    }

    function getPlaceHolder(placeholder) {
        if (placeholder)
            return placeholder
        return 'DD-MM-YYYY'
    }

    return (
        <div className="date-picker-div" name={props.name}>

            <Calendar
                name={props.name}
                className={`date-picker ${props.class ? props.class : ''}`}
                id={props.id}
                // ref={props.reference}
                value={props.selectedDate}
                onChange={onChangeDate}
                minDate={props.minDate}
                maxDate={props.maxDate}
                disabled={props.isDisabled}
                readOnlyInput={true}
                dateFormat={getDateFormat(props.dateFormat)}
                placeholder={getPlaceHolder(props.placeholder)}
                view={props.view}
                disabledDays={props.disabledDays}
                monthNavigator={props.monthNavigator}
                yearNavigator={props.yearNavigator}
                yearRange={props.yearRange}
                onFocus={onFocus}
                onBlur={onBlur}
                inline={props.inline}
            >
            </Calendar>

        </div>
    )
}

export default DatePickerComponent;