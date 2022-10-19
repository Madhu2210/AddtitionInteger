import React, { useEffect, useRef } from 'react'

import { SET_TIMEOUT_INTERVAL } from '../../../../../common/Constants'
import LangText from '../../../../../common/lang/LangText';

function ConvertResultDialogComponent(props) {

    const timeOut = useRef(null)

    useEffect(() => {
        timeOut.current = setTimeout(() => {
            props.parentCB && props.parentCB()
            props.onCloseCB && props.onCloseCB()
        }, SET_TIMEOUT_INTERVAL.SUCCESS_POPUP_CLOSE_TIME);

        return () => {
            clearTimeout(timeOut.current)
        }
    }, [])

    const { details } = props
    const { resultData } = details

    return (
        <div className={`orderSymDetails-modal convert-result-dialog cancel-result-dialog
         ${resultData.success ? 'success' : ''}`}>
            <div className={`iconDiv`}>
                {
                    resultData.success ?
                        <img src="assets/images/dashboard/success_btn.svg" alt="" />
                        :
                        <img src="assets/images/dashboard/failed_btn.svg" alt="" />
                }
            </div>
            <div className="compName">
                <span>{resultData.symName}</span> - <span>{resultData.qty} <LangText 
                    module="ORDERBOOK_MSGS" name="QUANTITYY" /></span>
            </div>
            <div className="messageDiv">
                {
                    resultData.message
                }
            </div>
        </div>
    )
}

export default ConvertResultDialogComponent;