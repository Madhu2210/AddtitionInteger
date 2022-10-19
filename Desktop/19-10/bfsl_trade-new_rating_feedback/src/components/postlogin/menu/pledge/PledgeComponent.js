import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useFetch, MsfRequest } from "../../../../index";

import { Loader } from '../../../common/LoaderComponent'
import IFrameDialog from '../MenuIframeDialogComponent'

import { MENU_SERVICE } from "../../../../config/ServiceURLs";
import { storeShowPledgeFlag, showAppDialog } from "../../../../state/actions/Actions";

import { getBackOfficeBaseURL } from "../../../../common/CommonMethods";

function PledgeComponent(props) {

    const MsfFetch = useFetch();

    const [pledgeUrlData, setPledgeUrlData] = useState(null)

    useEffect(() => {
        if (props.showPledgeScreen)
            getPledgeUrlData();
    }, [props.showPledgeScreen]);

    function getPledgeUrlData() {
        props.showLoader()
        setPledgeUrlData(null)
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + MENU_SERVICE.GET_PLEDGE_URL,
            request,
            successRespCBGetPledgeUrl,
            errorRespCBGetPledgeUrl
        )
    }

    function successRespCBGetPledgeUrl(response) {
        props.hideLoader()
        setPledgeUrlData(response.data)
    }

    function errorRespCBGetPledgeUrl(error) {
        props.hideLoader()
        props.showAppDialog({
            message: error.message,
            show: true
        })
        props.storeShowPledgeFlag(false)
    }

    function onCloseIframe() {
        setPledgeUrlData(null)
        props.storeShowPledgeFlag(false)
    }

    if (!pledgeUrlData)
        return null;

    return <IFrameDialog iFrameData={pledgeUrlData} onCloseIframeCB={onCloseIframe} />
}

const mapStateToProps = ({ menu }) => {
    return {
        showPledgeScreen: menu.showPledgeScreen,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        storeShowPledgeFlag: (s) => { dispatch(storeShowPledgeFlag(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(PledgeComponent));
