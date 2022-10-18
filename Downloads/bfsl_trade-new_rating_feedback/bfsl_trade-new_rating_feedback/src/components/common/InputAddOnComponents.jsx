import React from 'react'
import { UserIcon, PasswordIcon, PanNumberIcon, DatePickerIcon, EmailIcon, PhoneIcon, KeyboardIcon } from './FontIcons';

const UseridInputAddOn = () => {
    return (
        <div className="addOnIcon">
            <UserIcon />
        </div>
    )
}

const PasswordInputAddOn = () => {
    return (
        <div className="addOnIcon">
            <PasswordIcon />
        </div>
    )
}

const PanInputAddOn = () => {
    return (
        <div className="addOnIcon">
            <PanNumberIcon />
        </div>
    )
}

const DOBInputAddOn = (props) => {
    return (
        <div className={`addOnIcon ${props.className ? props.className : ''}`}
            onClick={props.onClick ? props.onClick : null}>
            <DatePickerIcon />
        </div>
    )
}

const MobileNumberInputAddOn = () => {
    return (
        <div className="addOnIcon">
            <PhoneIcon />
        </div>
    )
}

const EmailIdInputAddOn = () => {
    return (
        <div className="addOnIcon">
            <EmailIcon />
        </div>
    )
}

const KeyboardAddon = () => {
    return (
        <div className="addOnIcon">
            <KeyboardIcon />
        </div>
    )
}

export default { UseridInputAddOn, PasswordInputAddOn, PanInputAddOn, DOBInputAddOn, EmailIdInputAddOn, 
    MobileNumberInputAddOn, KeyboardAddon };