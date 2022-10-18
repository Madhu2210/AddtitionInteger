import React, { useEffect, useRef, useState } from 'react'

function RangeInputComponent(props) {

    const [value, setValue] = useState(0)

    const inputRef = useRef(null)

    useEffect(() => {
        setValue(props.value)
    }, [props.value])

    useEffect(() => {
        setRangeColor()
    }, [value])

    function onChangeInput(e) {
        setValue(e.target.value)
        props.onChange && props.onChange(e.target.value)
        setRangeColor()
    }

    function setRangeColor() {
        let range = inputRef.current
        const newValue = Number((range.value - range.min) * 100 / (range.max - range.min));
        const newPosition = 16 - (newValue * 0.32);
        document.documentElement.style.setProperty("--range-progress", `calc(${newValue}% + (${newPosition}px))`);
    }

    function onMouseUp() {
        props.onMouseOut && props.onMouseOut()
    }

    return (
        <input id="range" className="range-slider" type="range"
            ref={inputRef}
            value={value}
            min={props.min ? props.min : 0}
            max={props.max ? props.max : 100}
            onChange={onChangeInput}
            onMouseUp={onMouseUp}
        />
    )
}

export default RangeInputComponent;