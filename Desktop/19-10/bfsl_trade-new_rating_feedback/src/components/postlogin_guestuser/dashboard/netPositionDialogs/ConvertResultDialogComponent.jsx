import React, { useEffect, useRef } from 'react'
import { connect } from "react-redux";

import { storeRegetNetPositions } from '../../../../state/actions/Actions';

import { SET_TIMEOUT_INTERVAL, TEXT_ORIENTATION } from '../../../../common/Constants'
import LangText from '../../../../common/lang/LangText';

function ConvertResultDialogComponent(props) {

    const { details } = props
    const { resultData } = details

    const timeOut = useRef(null)

    useEffect(() => {
        timeOut.current = setTimeout(() => {
            if (resultData.success)
                props.storeRegetNetPositions(true)

            props.onCloseCB && props.onCloseCB()
        }, SET_TIMEOUT_INTERVAL.SUCCESS_POPUP_CLOSE_TIME);

        return () => {
            clearTimeout(timeOut.current)
        }
    }, [])

    return (
        <div className={`orderSymDetails-modal convert-result-dialog ${resultData.success ? 'success' : ''}`}>
            <div className={`iconDiv`}>
                {
                    resultData.success ?
                        <img src="assets/images/dashboard/success_btn.svg" alt="" />
                        :
                        <img src="assets/images/dashboard/failed_btn.svg" alt="" />
                }
            </div>
            <div className={`statusDiv`}>
                {
                    resultData.success ? "Success" : "Error"
                }
            </div>
            <div className="compName">
                {resultData.symName}
            </div>
            <div className="qtyDiv">
                {resultData.qty}  <LangText module="CONVERTRESULT" name="QTY"
                    orientation={TEXT_ORIENTATION.PASCALCASE} /> - {resultData.pType}
            </div>
            <div className="messageDiv">
                {
                    resultData.message
                }
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeRegetNetPositions: (s) => { dispatch(storeRegetNetPositions(s)) },
    };
};

export default connect(null, mapDispatchToProps)(ConvertResultDialogComponent);