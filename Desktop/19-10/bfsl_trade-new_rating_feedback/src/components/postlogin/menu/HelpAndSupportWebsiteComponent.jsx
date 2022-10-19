import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useFetch, MsfRequest } from "../../../index";

import { showAppDialog, storeHelpAndSupportSamadhanFlag } from "../../../state/actions/Actions";
import IframeDialog from "./MenuIframeDialogComponent";
import { Loader } from "../../common/LoaderComponent";
import { getBackOfficeBaseURL } from "../../../common/CommonMethods";
import { ACCOUNT_MENU_SERVICES } from "../../../config/ServiceURLs";

function HelpAndSupportWebsiteComponent(props) {

    const MsfFetch = useFetch();

    const [SSOUrlData, setSSOUrlData] = useState(null)

    useEffect(() => {
        if (props.showSamadhanScreen)
            getSSOUrlData();
    }, [props.showSamadhanScreen]);

    function getSSOUrlData() {
        props.showLoader()
        setSSOUrlData(null)
        let request = new MsfRequest();
        request.addToData({})
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + ACCOUNT_MENU_SERVICES.HELP_AND_SUPPORT,
            request,
            successRespCBGetHelpAndSupportData,
            errorRespCBGetHelpAndSupportData
        )
    }

    function successRespCBGetHelpAndSupportData(response) {
        setSSOUrlData(response.data)
        props.hideLoader()      
    }

    function errorRespCBGetHelpAndSupportData(error) {
        props.hideLoader()
        props.showAppDialog({
            message: error.message,
            show: true
        })
        props.storeHelpAndSupportSamadhanFlag(false)
    }

    function onCloseIframe() {
        setSSOUrlData(null)
        props.storeHelpAndSupportSamadhanFlag(false)
    }
    
    if (!SSOUrlData)
        return null;

    return <IframeDialog
        iFrameData={SSOUrlData}
        onCloseIframeCB={onCloseIframe}
    />
}

const mapStateToProps = ({ helpAndSupport }) => {
    return {
        showSamadhanScreen: helpAndSupport.showSamadhanScreen,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeHelpAndSupportSamadhanFlag: (s) => { dispatch(storeHelpAndSupportSamadhanFlag(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(HelpAndSupportWebsiteComponent));
