import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useFetch, MsfRequest } from "../../../../index";

import { Loader } from '../../../common/LoaderComponent'
import IFrameDialog from '../MenuIframeDialogComponent'

import { MENU_SERVICE } from "../../../../config/ServiceURLs";
import { showAppDialog, storeBOReportsScreenFlag } from "../../../../state/actions/Actions";

import { getBackOfficeBaseURL } from "../../../../common/CommonMethods";

function BOReportsComponent(props) {

    const MsfFetch = useFetch();

    const [boReportsUrlData, setBOReportsUrlData] = useState(null)

    useEffect(() => {
        if (props.showBOReportsScreen)
            getBOReportsUrlData();
    }, [props.showBOReportsScreen]);

    function getBOReportsUrlData() {
        props.showLoader()
        setBOReportsUrlData(null)
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + MENU_SERVICE.GET_BO_REPORTS_URL,
            request,
            successRespCBGetEdisUrl,
            errorRespCBGetEdisUrl
        )
    }

    function successRespCBGetEdisUrl(response) {
        props.hideLoader()
        setBOReportsUrlData(response.data)
    }

    function errorRespCBGetEdisUrl(error) {
        props.hideLoader()
        props.showAppDialog({
            message: error.message,
            show: true
        })
        props.storeBOReportsScreenFlag(false)
    }

    function onCloseIframe() {
        setBOReportsUrlData(null)
        props.storeBOReportsScreenFlag(false)
    }

    if (!boReportsUrlData)
        return null;

    return <IFrameDialog
        iFrameData={boReportsUrlData}
        onCloseIframeCB={onCloseIframe}
        isModalIframe={false}
    />
}

const mapStateToProps = ({ menu }) => {
    return {
        showBOReportsScreen: menu.showBOReportsScreen,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeBOReportsScreenFlag: (s) => { dispatch(storeBOReportsScreenFlag(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(BOReportsComponent));
