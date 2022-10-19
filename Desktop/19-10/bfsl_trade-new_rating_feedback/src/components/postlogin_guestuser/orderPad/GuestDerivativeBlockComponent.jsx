import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";

import { useFetch, MsfRequest } from '../../../index'

import { getBaseURL } from '../../../common/CommonMethods';
import { LOCAL_STORAGE, THEMES } from '../../../common/Constants';
import LangText from '../../../common/lang/LangText';
import { LOGIN } from '../../../config/ServiceURLs';
import { handleLogout } from '../../../common/Bridge';
import { AccBlockedIcon } from '../../common/FontIcons';
import { getItemFromSessionStorage } from '../../../common/LocalStorage';

function GuestDerivativeBlockComponent(props) {

    const MsfFetch = useFetch()

    const [guestTradeBlock, setGuestTradeBlock] = useState('')
    const [openAccLink, setOpenAccLink] = useState("")

    useEffect(()=> {
        let guestTradeArray = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.GUEST_FNO_BLOCK))
        let openAccountLink = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.OPEN_OTHER_GUESTACC_LINK))
        let guestFno = guestTradeArray.includes(props.sym.exc)
        setGuestTradeBlock(guestFno)
        setOpenAccLink(openAccountLink)
    },[props.sym.exc])

    function onClickLogin() {
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            getBaseURL() + LOGIN.GUEST_USER_LOGOUT,
            request,
            null,
            null,
            false
        )
        handleLogout()
    }

    function onClickOk() {
        props.closeOrder && props.closeOrder()
    }

    if(!guestTradeBlock)
        return (
            <div className="orderDialogBase guest-fno-dialog">
                <div
                    className={`guest-fno-window 
            ${props.selectedTheme.theme === THEMES.LIGHT ? "lightTheme" : "darkTheme"}`}
                >
                    <AccBlockedIcon />
                    <div className="msg-content">
                        <LangText name="GUEST_GERIVATIVE_BLOCK" module="MESSAGES" />
                    </div>
                    <div className="footer">
                        <div className="user-info-btnDiv">
                            <div className="fno-btn">
                                <button className="open-account-btn" onClick={onClickLogin}>
                                    <span className="cursor">
                                        <LangText name="LOGIN" module="BUTTONS" />
                                    </span>
                                </button>
                            </div>
                            <div className="fno-btn">
                                <a href={openAccLink} target="_blank" rel="noopener noreferrer">
                                    <button className="continue-btn" onClick={onClickOk}>
                                        <span className="cursor">
                                            <LangText module="BUTTONS" name="OPEN_DEMAT_ACCOUNT" />
                                        </span>
                                    </button>
                                </a>
                            </div> 
                        </div>  
                       
                    </div>
                </div>
            </div>
        )
    return null
}

const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme
    }
}

export default connect(mapStateToProps, null)(GuestDerivativeBlockComponent);