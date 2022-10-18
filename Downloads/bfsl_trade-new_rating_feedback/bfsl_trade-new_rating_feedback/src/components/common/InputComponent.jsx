/* eslint-disable */
import React, { forwardRef } from 'react'

const InputComponent = forwardRef((props, inputRef) => {
    console.log("hello api", props)
    function onChangeValue(e) {
        
        props.onChange && props.onChange(e)
    }

    function onPasteFn(e) {
        if (props.preventPaste)
            e.preventDefault();
    }

    return (
        <input
            ref={inputRef ? inputRef : null}
            type={props.type ? props.type : 'text'}
            test_id={props.test_id ? props.test_id : null}
            name={props.name ? props.name : ""}
            id={props.id ? props.id : ''}
            className={`input-ele ${props.className ? props.className : ""}`}
            placeholder={props.placeholder}
            value={(props.value || props.value === 0) ? props.value : ''}
            onChange={onChangeValue}
            onKeyPress={props.onKeyPress}
            onKeyDown={props.onKeyDown}
            onClick={props.onClick}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            maxLength={props.maxLength ? props.maxLength : null}
            disabled={props.disabled}
            autoComplete={props.autoComplete ? props.autoComplete : ''}
            onPaste={(e) => onPasteFn(e)}
            autoFocus={props.autoFocus ? props.autoFocus : null}
        />
    )
})
InputComponent.displayName = "InputComponent"
export default InputComponent;