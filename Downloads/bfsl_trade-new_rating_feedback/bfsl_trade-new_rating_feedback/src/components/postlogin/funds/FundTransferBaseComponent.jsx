import React, { useState } from 'react'

import AvailableFundsComponent from './AvailableFundsComponent';
import FundsAddWithdrawalComponent from './FundsAddWithdrawalComponent';
import FundAddWithdrawResultComponent from './FundAddWithdrawResultComponent'
import FundsRecentWithdrawalComponent from './recentWithdrawals/FundsRecentWithdrawalComponent';
import FundsRecentWithdrawalResult from './recentWithdrawals/FundsRecentWithdrawalResult';

import { FUNDS_SCREENS } from '../../../common/Constants';
import LangText from '../../../common/lang/LangText';

function FundTransferBaseComponent(props) {

    const [widgetselected, setWidgetSelcted] = useState(FUNDS_SCREENS.AVAILABLE_FUNDS);
    const [recentWithdrawStatus, setRecentWithdrwStatus] = useState(FUNDS_SCREENS.RECENT_WITHDRAWAL)
    const [withdrwAmt] = useState()
    const [withdrwInfoMsg] = useState('');
    const [addWithDrawStatus, setaddWithDrawStatus] = useState({})
    const [fundAction, setFundAction] = useState()
    const [cancelWithdrawReqData, setCancelWithdrawReqData] = useState(null)
    const [setEcollectData] = useState()

    function selectedScreenCB(selScreen, selStatus) {
        if (selStatus) {
            setRecentWithdrwStatus(selScreen)
        }
        else {
            setWidgetSelcted(selScreen)
            setFundAction(selScreen)
        }
    }

    function addWithDrawResultCB(val1, val2, val3, val4) {
        if (val1 || val2 || val3 || val4) {
            setaddWithDrawStatus({
                withdrwAmt: val1,
                withdrwInfoMsg: val2,
                isSucces: val3,
                type: val4
            })
        }
    }

    function cancelPayoutCB(details) {
        setCancelWithdrawReqData(details)
    }

    function eCollectDetailsCB(item) {
        setEcollectData(item)
    }

    return (
        <div className="fundTransfer-base">
            {
                (widgetselected === FUNDS_SCREENS.AVAILABLE_FUNDS) ?
                    <AvailableFundsComponent
                        resultData={props.resultData}
                        errorMsg={props.errorMsg}
                        selectedScreen={selectedScreenCB}
                    />
                    : widgetselected === FUNDS_SCREENS.FUNDS_WITHDRAWAL ||
                        widgetselected === FUNDS_SCREENS.ADD_FUNDS ?
                        <FundsAddWithdrawalComponent
                            selectedScreen={selectedScreenCB}
                            resultData={props.resultData}
                            addWithDrawResultCB={addWithDrawResultCB}
                            fundAction={fundAction}
                            eCollectDetailsCB={eCollectDetailsCB}
                        />
                        : widgetselected === FUNDS_SCREENS.ADD_PAYOUT ?
                            <FundAddWithdrawResultComponent
                                selectedScreen={selectedScreenCB}
                                withdrwAmt={withdrwAmt}
                                withdrwInfoMsg={withdrwInfoMsg}
                                addWithDrawStatus={addWithDrawStatus} />
                            : null

            }

            <div className="recent-withdrawals">
                <div className="recent-withdrawals-content">
                    <div className="header"> <LangText module="FUNDS" name="RECENT_WITHDRAWLS" />  </div>
                    <div className="content">
                        {
                            (recentWithdrawStatus === FUNDS_SCREENS.RECENT_WITHDRAWAL) ?
                                <FundsRecentWithdrawalComponent
                                    selectedScreen={selectedScreenCB}
                                    cancelPayoutCB={cancelPayoutCB}
                                />
                                :
                                (recentWithdrawStatus === FUNDS_SCREENS.CANCEL_PAYOUT) ?
                                    <FundsRecentWithdrawalResult
                                        selectedScreen={selectedScreenCB}
                                        resultData={cancelWithdrawReqData}
                                    />
                                    : null
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default FundTransferBaseComponent;
