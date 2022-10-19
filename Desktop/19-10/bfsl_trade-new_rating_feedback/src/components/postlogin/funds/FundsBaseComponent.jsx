import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../index';

import FundLimitsBaseComponent from './fundLimits/FundLimitsBaseComponent';
import FundsFooterComponent from './FundsFooterComponent';
import FundTransferBaseComponent from './FundTransferBaseComponent'
import { Loader } from '../../common/LoaderComponent';
import LangText from '../../../common/lang/LangText';

import { FUND_TRANSFER } from '../../../config/ServiceURLs';

import { AF_EventTriggered, getBaseURL } from '../../../common/CommonMethods';
import { AF_EVENT_NAMES, AF_EVENT_TYPES } from '../../../common/Constants';

function FundsBaseComponent(props) {

    const MsfFetch = useFetch()

    const [errorMsg, setErrorMsg] = useState(null)
    const [responseData, setResponseData] = useState(null)

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.FUNDS , AF_EVENT_TYPES.FUNDS_MENU,{"onLoad":"funds"});
    }, [])

    useEffect(() => {
        getFundTransferDetails();
    }, [])

    function getFundTransferDetails() {
        props.showLoader();
        setResponseData('')
        setErrorMsg('')
        let request = new MsfRequest();
        request.addToData({
        })
        MsfFetch.placeRequest(
            getBaseURL() + FUND_TRANSFER.GET_LIMITS_VIEW,
            request,
            successRespCBFundTransferDetails,
            errorRespCBFundTransferDetails
        )
    }

    function successRespCBFundTransferDetails(response) {
        setResponseData(response.data)
        props.hideLoader()
    }

    function errorRespCBFundTransferDetails(error) {
        props.hideLoader()
        setErrorMsg(error.message)
    }

    return (
        <div className="funds-base-comp">
            <div className="funds-data">
                <div className="funds-header">
                    <span className="left">
                        <LangText module="FUNDS" name="FUNDS_TRANSFER" />
                    </span>
                    <span className="right">
                        <LangText module="FUNDS" name="LIMITS" />
                    </span>
                </div>
                <div className="funds-content">
                    <div className="content-left">
                        <FundTransferBaseComponent
                            resultData={responseData}
                            errorMsg={errorMsg}
                        />
                    </div>
                    <div className="content-right">
                        <FundLimitsBaseComponent
                            resultData={responseData}
                            errorMsg={errorMsg}
                        />
                    </div>
                </div>
            </div>
            <div className="funds-footer">
                <FundsFooterComponent />
            </div>

        </div>
    )
}

export default Loader(FundsBaseComponent);
