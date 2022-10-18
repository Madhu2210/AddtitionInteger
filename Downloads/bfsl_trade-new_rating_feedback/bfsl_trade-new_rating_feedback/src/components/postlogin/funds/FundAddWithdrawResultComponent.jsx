import React, { useEffect, useRef } from 'react'

import { WidgetLoader } from '../../common/WidgetLoaderComponent'

import { FUNDS_SCREENS, SET_TIMEOUT_INTERVAL } from '../../../common/Constants';
import LangText from '../../../common/lang/LangText';

function FundAddWithdrawResultComponent(props) {
 
    const timeOut = useRef(null)

    useEffect(() => {
        timeOut.current = setTimeout(() => {
            onCloseCB();
        }, SET_TIMEOUT_INTERVAL.SUCCESS_POPUP_CLOSE_TIME);

        return () => {
            clearTimeout(timeOut.current)
        }
    }, [])

    function onCloseCB() {
        if (props.addWithDrawStatus && props.addWithDrawStatus.type === FUNDS_SCREENS.ADD_FUNDS) {
            props.selectedScreen(FUNDS_SCREENS.ADD_FUNDS)
        }
        else {
            props.selectedScreen(FUNDS_SCREENS.FUNDS_WITHDRAWAL)
        }

    }

    return (
        <div className="available-details withdraw-success">
            <div className="success-action">
                <span className="success-btn">
                    {
                        props.addWithDrawStatus.isSucces ?
                            <img src="assets/images/dashboard/success_btn.svg" alt="" />
                            :
                            <img src="assets/images/dashboard/failed_btn.svg" alt="" />
                    }

                </span>
                <span className="status">
                    {
                        props.addWithDrawStatus.isSucces ? "Success" : "Failure"
                    }
                </span>
            </div>
            {
                props.addWithDrawStatus.isSucces ?
                    <div className="amt-withdwrd">
                        <span className="label">
                            <LangText module="FUNDS" name="WITHDRAW_AMT" />
                        </span>
                        <span className="val">
                            {'₹ ' + props.addWithDrawStatus.withdrwAmt}
                        </span>
                    </div>
                    : null
            }

            <div className="success-msg">
                {
                    props.addWithDrawStatus.withdrwInfoMsg
                }

            </div>
        </div>
    )
}

export default WidgetLoader(FundAddWithdrawResultComponent);