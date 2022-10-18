import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { useFetch, MsfRequest } from "../../../index";

import LangText from "../../../common/lang/LangText";
import { Loader } from "../../common/LoaderComponent";

import { FUND_TRANSFER } from "../../../config/ServiceURLs";
import {storeAddFundDialogDetails,showAppDialog,storeSelectedDashboardWidget,} from "../../../state/actions/Actions";

import {getBaseURL,checkEmpty,getColorCode} from "../../../common/CommonMethods";
import {SCREENS,SET_TIMEOUT_INTERVAL} from "../../../common/Constants";

const FundDetailsComponent = (props) => {
    const MsfFetch = useFetch();

    const [availFunds, setAvailFunds] = useState(null);

    const apiInterval = useRef(null);

    useEffect(() => {
        getAvailFunds();
        apiInterval.current = setInterval(() => {
            getAvailFunds();
        }, SET_TIMEOUT_INTERVAL.GET_AVAIL_FUNDS);

        return () => {
            clearRefreshInterval();
        };
    }, []);

    function getAvailFunds() {
        let request = new MsfRequest();
        request.addToData({
            segment: "",
        });
        MsfFetch.placeRequest(
            getBaseURL() + FUND_TRANSFER.GET_LIMITS,
            request,
            successRespCBGetAvailFunds
        );
    }

    function successRespCBGetAvailFunds(response) {
        setAvailFunds(response.data.cashAvailable);
    }

    function clearRefreshInterval() {
        clearInterval(apiInterval.current);
    }

    function onClickAddFunds() {
        props.history.push(SCREENS.FUNDS);
    }

    return (
        <div className="availFund-div">
            <div className="row funds highFunds">
                <span className="label">
                    <LangText module="HEADER" name="AVAILABLE_FUNDSS" />
                </span>
                <span className={`availFunds ${getColorCode(availFunds)}`}>
                    {checkEmpty(availFunds)}
                </span>
            </div>
            <div className="row btn highFundsBtn">
                <button className="theme-btn addFundBtn" onClick={onClickAddFunds}>
                    <LangText module="BUTTONS" name="FUNDS" />
                </button>
            </div>
        </div>
    );
};

const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        storeAddFundDialogDetails: (s) => {dispatch(storeAddFundDialogDetails(s));},
        showAppDialog: (s) => {dispatch(showAppDialog(s));},
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)); },
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Loader(FundDetailsComponent)));
