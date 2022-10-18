import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { useFetch, MsfRequest } from '../../../../index'

import LangText, { getLangText } from '../../../../common/lang/LangText';
import { WidgetLoader } from '../../../common/WidgetLoaderComponent'
import ConfirmCancelRequestComponent from './ConfirmCancelRequestComponent';

import { storeRegetRecentWithdrawals } from '../../../../state/actions/Actions';
import { FUND_TRANSFER } from '../../../../config/ServiceURLs';

import { checkEmpty, getBaseURL, getOrderStatusClass } from '../../../../common/CommonMethods';
import { FUNDS_CONFIRMATION_MSG, FUNDS_SCREENS, ORDER_STATUS } from '../../../../common/Constants';

function FundsRecentWithdrawalComponent(props) {
    const MsfFetch = useFetch()

    const [errorMsg, setErrorMsg] = useState(null)
    const [transferStatus, setTransferStatus] = useState([])
    const [selectedItem, setselectedItem] = useState()
    const [referenceID, setReferenceID] = useState('')

    useEffect(() => {
        getRecentWithdrawals()
    }, [])

    useEffect(() => {
        if (props.regetRecentWithdrawals === true)
            getRecentWithdrawals()
        props.storeRegetRecentWithdrawals()
    }, [props.regetRecentWithdrawals])

    function getRecentWithdrawals() {
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.addToData({
        })
        MsfFetch.placeRequest(
            getBaseURL() + FUND_TRANSFER.GET_TRANSFER_STATUS,
            request,
            successRespCBGetTransferStatus,
            errorRespCBGetTransferStatus
        )
    }

    function successRespCBGetTransferStatus(response) {
        props.hideWidgetLoader();
        setTransferStatus(response.data.status)
        setErrorMsg(null)
    }

    function errorRespCBGetTransferStatus(error) {
        props.hideWidgetLoader();
        setTransferStatus([])
        setErrorMsg(error.message)
    }

    function cancelPayout() {
        props.showWidgetLoader(true);
        let request = new MsfRequest();
        request.addToData({
            refNo: referenceID
        })
        MsfFetch.placeRequest(
            getBaseURL() + FUND_TRANSFER.GET_CANCEL_PAYOUT,
            request,
            successRespCBGetCancelPayout,
            errorRespCBGetCancelPayout
        )
    }

    function successRespCBGetCancelPayout() {
        props.hideWidgetLoader();
        props.cancelPayoutCB({
            message: getLangText('CANCEL_REQUEST_MSG', 'FUNDS'),
            isSuccess: true
        })
        props.selectedScreen(FUNDS_SCREENS.CANCEL_PAYOUT, true)
        setselectedItem('')
    }

    function errorRespCBGetCancelPayout(error) {
        props.hideWidgetLoader();
        props.cancelPayoutCB({
            message: error.message,
            isSuccess: false
        })
        props.selectedScreen(FUNDS_SCREENS.CANCEL_PAYOUT, true)
    }

    function cancelConfirm(index, val) {
        setselectedItem(index)
        setReferenceID(val)
    }
    function cancelRequestConfirmationCB(val) {
        if (val === FUNDS_CONFIRMATION_MSG.YES) {
            cancelPayout()
        }
        else
            setselectedItem('')
    }
    return (
        <div className="recent-trans-base">
            <div className="trans-heading">
                <div className="left">
                    <LangText module="FUNDS" name="DATE_TIME" />
                </div>
                <div className="center">
                    <LangText module="FUNDS" name="STATUS" />
                </div>
                <div className="right">
                    <LangText module="FUNDS" name="AMOUNT" />
                </div>
            </div>
            <div className="trans-body">
                {
                    transferStatus.length ? transferStatus.map((item, index) => {
                        return (

                            <>
                                {
                                    (selectedItem === index)
                                        ? <div className={`trans-content 
                                        ${selectedItem === index ? 'cancel-selected' : ''}`}>
                                            <ConfirmCancelRequestComponent
                                                cancelRequestConfirmationCB={cancelRequestConfirmationCB}
                                            />
                                        </div>
                                        :
                                        <div className="trans-content">
                                            <div className="left">
                                                <div className="trans-date">{checkEmpty(item.updatedTime)}</div>
                                            </div>
                                            <div className="center">
                                                {/* <span className="trans-time">12.45PM</span> */}
                                                <span className={`${getOrderStatusClass('pending')} 
                                                trans-status`}>{checkEmpty(item.status)}</span>
                                            </div>
                                            <div className="right">
                                                <span className="trans-right">
                                                    {item.amount ? '₹ ' : ''}{checkEmpty(item.amount)}</span>
                                                {
                                                    item.status.toLowerCase() === ORDER_STATUS.PENDING ?
                                                        <span className="cancel cursor"
                                                            onClick={() => cancelConfirm(index, item.instructionId)}
                                                        >
                                                            <LangText module="FUNDS" name="CANCEL_REQUEST" />
                                                        </span> : ''
                                                }
                                            </div>
                                        </div>
                                }
                            </>
                        )
                    })
                        :
                        <div className="err-msg">{errorMsg}</div>
                }
            </div>
        </div >
    )
}

const mapStateToProps = ({ fundTransfer }) => {
    return {
        regetRecentWithdrawals: fundTransfer.regetRecentWithdrawals
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeRegetRecentWithdrawals: (s) => { dispatch(storeRegetRecentWithdrawals(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WidgetLoader(FundsRecentWithdrawalComponent));