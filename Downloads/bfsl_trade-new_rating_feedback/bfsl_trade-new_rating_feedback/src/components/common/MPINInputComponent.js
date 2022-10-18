import React, { useEffect, useState } from 'react';

function MpinInptComponent(props) {

    const [mpinInputs, setMpinInputs] = useState([ 
        { id: 0, value: "" },
        { id: 1, value: "" },
        { id: 2, value: "" },
        { id: 3, value: "" },
    ])
    const [nameInput] = useState([])
    const [mpin, setMpin] = useState("")
    const [enterKey, setEnterKey] = useState(false)

    useEffect(() => {
        focusOn(nameInput[0]);
    }, [])

    useEffect(() => {
        props.getMPIN && props.getMPIN(mpin, enterKey)
    }, [mpin, enterKey])

    useEffect(() => {
        setMpinFunc()
    }, [enterKey, mpinInputs])

    useEffect(() => {
        if (props.reset) {
            setMpinInputs([ 
                { id: 0, value: "" },
                { id: 1, value: "" },
                { id: 2, value: "" },
                { id: 3, value: "" },
            ])
            setMpin('')
            props.resetMpinFlag && props.resetMpinFlag()
        }
    }, [props.reset])

    function focusOn(ref) {
        if (ref) {
            ref.focus()
        }
    }

    function onKeyDown(e) {
        let inputs = Object.assign([{}], mpinInputs);
        if (((e.key >= 0) && (e.key <= 9) && (e.key != ' '))) {
            e.persist()
            e.preventDefault()
            let valueInput = inputs.map((item) => {
                if ((item.id == e.target.id)) {
                    item.value = e.key;
                }
                return item;
            })
            setMpinInputs(valueInput)
            let val = parseInt(e.target.id) + 1;

            if (val < 6) {
                focusOn(nameInput[val]);
            }
        }
        if (e.key === 'Backspace') {
            let inputs1 = Object.assign([{}], mpinInputs);
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
                setMpinInputs(valueInput)
                setEnterKey(false)
            }
            else {
                let valueInput = inputs1.map((item) => {
                    if (item.id == e.target.id) {
                        item.value = "";
                    }
                    return item;
                })
                setMpinInputs(valueInput)
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

    function setMpinFunc() {
        let mpinList = mpinInputs.filter((item) => {
            if (item.value.length) {
                return (
                    item.value
                )
            }
            return null
        })
        let mpinset = "";
        mpinList.map((item) => {
            mpinset = mpinset.concat(item.value)
        })
        setMpin(mpinset)
    }

    return (
        <div className="otpInput-base">
            {mpinInputs.map((item, index) => {
                return (
                    <input className="otp-input input-ele"
                        key={index}
                        type="text"
                        tabIndex="1"
                        ref={(id) => { nameInput[item.id] = id; }}
                        autoComplete="off"
                        id={item.id}
                        name={item.id}
                        value={mpinInputs[item.id].value}
                        onKeyDown={(e) => onKeyDown(e)}
                        maxLength="1" />
                )
            })}
        </div>
    )
}

export default MpinInptComponent;