import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useFetch, MsfRequest } from "../../../index";
import { getBackOfficeBaseURL } from "../../../common/CommonMethods";
import { MENU_SERVICE } from "../../../config/ServiceURLs";
import { storeMtfEpledgeScreenFlag } from "../../../state/actions/Actions";
import { Loader } from "../../common/LoaderComponent";
import IFrameDialog from "../menu/MenuIframeDialogComponent";

function MtfPledgeComponent(props) {

    const MsfFetch = useFetch();

    const [mtfPledgeUrlData, setMtfPledgeUrlData] = useState()

    useEffect(() => {
        if (props.showMtfPledgeScreen)
            getMtfPledgeUrlData();
    }, [props.showMtfPledgeScreen]);

    function getMtfPledgeUrlData() {
        props.showLoader()
        setMtfPledgeUrlData(null)
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + MENU_SERVICE.GET_MTFPLEDGE_URL,
            request,
            successRespCBGetMtfPLedgeUrl,
            errorRespCBGetMtfPLedgeUrl
        )
    }

    function successRespCBGetMtfPLedgeUrl(response) {
        console.log('123Epledgeresponse: ', response);
        setMtfPledgeUrlData(response.data)
        props.hideLoader()
    }

    function errorRespCBGetMtfPLedgeUrl(error) {
        console.log('123Mtfpledgeerror: ', error);
        props.hideLoader()
        props.showAppDialog({
            message: error.message,
            show: true
        })
        props.storeMtfEpledgeScreenFlag(false)
    }

    function onCloseIframe() {
        setMtfPledgeUrlData(null)
        props.storeMtfEpledgeScreenFlag(false)
    }
    
    if (!mtfPledgeUrlData)
        return null;

    return <IFrameDialog
        iFrameData={mtfPledgeUrlData}
        onCloseIframeCB={onCloseIframe}
    />
}

const mapStateToProps = ({ mtfDetails }) => {
    return {
        showMtfPledgeScreen: mtfDetails.showMtfPledgeScreen,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        storeMtfEpledgeScreenFlag: (s) => { dispatch(storeMtfEpledgeScreenFlag(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(MtfPledgeComponent));
