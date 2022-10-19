import React from 'react'
import { connect } from "react-redux";

import LangText from '../../common/lang/LangText'

import { openTaxDeclarationDialog } from '../../common/Bridge'
import { THEMES } from '../../common/Constants'
import { AccBlockedIcon } from './FontIcons'

function UpdateIncomeDecalrationAlertComponent(props) {

    function onClickUpdate() {
        openTaxDeclarationDialog()
        props.onClickUpdateCB && props.onClickUpdateCB()
    }

    function onClickLater() {
        props.closeCB && props.closeCB()
    }

    function onClickOk() {
        props.onClickOkCB && props.onClickOkCB()
    }

    return (
        <div
            className={`declaration-alert-window ${props.profileData.isFno === "1" ? "fno-window" : "cash-window"}
            ${props.infoMsg.trim().toLowerCase() !== "ticket created successfully" ? "small" : "large"}
            ${props.selectedTheme.theme === THEMES.LIGHT ? "lightTheme" : "darkTheme"}`}
        >
            <div className="header">
                {
                    props.apiResponse ?
                        (
                            props.apiResponse.isSuccess ?
                                (props.selectedTheme.theme === THEMES.LIGHT ?
                                    <img src="assets/images/dashboard/success_btn.svg" alt="" />
                                    :
                                    <img src="assets/images/dark/dashboard/success_btn.svg" alt="" />
                                )
                                :
                                (props.selectedTheme.theme === THEMES.LIGHT ?
                                    < img src="assets/images/dashboard/failed_btn.svg" alt="" />
                                    :
                                    < img src="assets/images/dark/dashboard/Failed_btn.svg" alt="" />
                                )
                        )
                        :
                        <AccBlockedIcon />
                }
                <div className="statusDiv">
                    {
                        props.apiResponse ?
                            (
                                props.apiResponse.isSuccess ?
                                    <span className="status successStatus">
                                        <LangText name="SUCCESS" module="TAX" />
                                    </span>
                                    :
                                    <span className="status errorStatus">
                                        <LangText name="ERROR" module="TAX" />
                                    </span>
                            )
                            :
                            <LangText name="UPDATE_INCOME_DECLARE" module="TAX" />
                    }
                </div>
            </div>
            <div className="msg-content">
                {props.infoMsg}
            </div>
            <div className="footer">
                {
                    props.noActions ?
                        <>
                            <button className="okBtn"
                                onClick={onClickOk}
                            >
                                <LangText name={props.apiResponse ? "DONE" : "OK"} module="BUTTONS" />
                            </button>
                        </>
                        :
                        <>
                            <button className="laterBtn"
                                onClick={onClickLater}
                            >
                                <LangText name="DO_IT_LATER" module="BUTTONS" />
                            </button>
                            <button className="updateBtn"
                                onClick={onClickUpdate}
                            >
                                <LangText name="UPDATE_NOW" module="BUTTONS" />
                            </button>
                        </>
                }
            </div>
        </div>
    )
}

const mapStateToProps = ({ settings, profileDialog}) => {
    console.log("test", profileDialog)
    return {
        selectedTheme: settings.selectedTheme,
        profileData: profileDialog.profileDetails,
    }
}

export default connect(mapStateToProps, null)(UpdateIncomeDecalrationAlertComponent);