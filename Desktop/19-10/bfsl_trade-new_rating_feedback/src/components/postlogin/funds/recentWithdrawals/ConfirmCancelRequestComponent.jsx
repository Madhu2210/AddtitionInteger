import React from 'react'

import LangText from '../../../../common/lang/LangText';

import { FUNDS_CONFIRMATION_MSG } from '../../../../common/Constants';

function ConfirmCancelRequestComponent(props) {
    
    function cancelRequest(value) {
        props.cancelRequestConfirmationCB(value)
    }

    return (
        <div className="confirmCancelRequest">
            <div className="confirMsg">
                <LangText module="FUNDS" name="CANCEL_REQ_CONFIRMATION" />
            </div>
            <div className="button">
                <div className="action-button confirmCancel cursor"
                    onClick={() => cancelRequest(FUNDS_CONFIRMATION_MSG.YES)}>
                    <LangText module="FUNDS" name="YES" />
                </div>
                <div className="action-button cancel cursor"
                    onClick={() => cancelRequest(FUNDS_CONFIRMATION_MSG.NO)}>
                    <LangText module="FUNDS" name="NO" />
                </div>
            </div>

        </div>
    )
}
export default ConfirmCancelRequestComponent;