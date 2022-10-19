import React, { useEffect, useState } from 'react';

function OtpInptComponent(props) {

    const [otpInputs, setOtpInputs] = useState([ 
        { id: 0, value: "" },
        { id: 1, value: "" },
        { id: 2, value: "" },
        { id: 3, value: "" },
    ])
    const [nameInput] = useState([])
    const [otp, setOtp] = useState("")
    const [enterKey, setEnterKey] = useState(false)

    useEffect(() => {
        focusOn(nameInput[0]);
    }, [])

    useEffect(() => {
        props.getOTP && props.getOTP(otp, enterKey)
    }, [otp, enterKey])

    useEffect(() => {
        setOtpFunc()
    }, [enterKey, otpInputs])

    useEffect(() => {
        if (props.reset) {
            setOtpInputs([ 
                { id: 0, value: "" },
                { id: 1, value: "" },
                { id: 2, value: "" },
                { id: 3, value: "" },
            ])
            setOtp('')
            props.resetOtpFlag && props.resetOtpFlag()
        }
    }, [props.reset])

    function focusOn(ref) {
        if (ref) {
            ref.focus()
        }
    }

    function onKeyDown(e) {
        let inputs = Object.assign([{}], otpInputs);
        if (((e.key >= 0) && (e.key <= 9) && (e.key != ' '))) {
            e.persist()
            e.preventDefault()
            let valueInput = inputs.map((item) => {
                if ((item.id == e.target.id)) {
                    item.value = e.key;
                }
                return item;
            })
            setOtpInputs(valueInput)
            let val = parseInt(e.target.id) + 1;

            if (val < 6) {
                focusOn(nameInput[val]);
            }
        }
        if (e.key === 'Backspace') {
            let inputs1 = Object.assign([{}], otpInputs);
            e.preventDefault();
            if (!e.target.value) {
                let val = parseInt(e.target.id) - 1;
                focusOn(nameInput[val]);
                let valueInput = inputs1.map((item, index) => {
                    if (val == index) {
                        item.value = "";
                    }
                    return item;
                })
                setOtpInputs(valueInput)
                setEnterKey(false)
            }
            else {
                let valueInput = inputs1.map((item) => {
                    if (item.id == e.target.id) {
                        item.value = "";
                    }
                    return item;
                })
                setOtpInputs(valueInput)
                setEnterKey(false)
            }
        }
        if (e.key === 'Enter') {
            setEnterKey(true)
        }
        else {
            setEnterKey(false)
            if (e.key === "Delete") {
                e.preventDefault();
            }
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                let val = parseInt(e.target.id) - 1;
                focusOn(nameInput[val]);
            }
            if (e.key === "ArrowRight") {
                e.preventDefault();
                let val = parseInt(e.target.id) + 1;
                focusOn(nameInput[val]);
            }
        }

    }

    function setOtpFunc() {
        let otpList = otpInputs.filter((item) => {
            if (item.value.length) {
                return (
                    item.value
                )
            }
            return null
        })
        let otpset = "";
        otpList.map((item) => {
            otpset = otpset.concat(item.value)
        })
        setOtp(otpset)
    }

    return (
        <div className="otpInput-base">
            {otpInputs.map((item, index) => {
                return (
                    <input className="otp-input input-ele"
                        key={index}
                        type="text"
                        tabIndex="1"
                        ref={(id) => { nameInput[item.id] = id; }}
                        autoComplete="off"
                        id={item.id}
                        name={item.id}
                        value={otpInputs[item.id].value}
                        onKeyDown={(e) => onKeyDown(e)}
                        maxLength="1" />
                )
            })}
        </div>
    )
}

export default OtpInptComponent;