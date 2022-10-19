import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useFetch, MsfRequest } from "../../../../index";

import { Loader } from '../../../common/LoaderComponent'
import IFrameDialog from '../MenuIframeDialogComponent'

import { MENU_SERVICE } from "../../../../config/ServiceURLs";
import { showAppDialog, storeEdisScreenFlag } from "../../../../state/actions/Actions";

import { getBackOfficeBaseURL } from "../../../../common/CommonMethods";

function EdisComponent(props) {

    const MsfFetch = useFetch();

    const [edisUrlData, setEdisUrlData] = useState(null)

    useEffect(() => {
        if (props.showEdisScreen)
            getEdisUrlData();
    }, [props.showEdisScreen]);

    function getEdisUrlData() {
        props.showLoader()
        setEdisUrlData(null)
        let request = new MsfRequest();
        request.setEncrypt(false)
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + MENU_SERVICE.GET_EDIS_URL,
            request,
            successRespCBGetEdisUrl,
            errorRespCBGetEdisUrl
        )
    }

    function successRespCBGetEdisUrl(response) {
        setEdisUrlData(response.data)
        props.hideLoader()
    }

    function errorRespCBGetEdisUrl(error) {
        props.hideLoader()
        props.showAppDialog({
            message: error.message,
            show: true
        })
        props.storeEdisScreenFlag(false)
    }

    function onCloseIframe() {
        setEdisUrlData(null)
        props.storeEdisScreenFlag(false)
    }
    
    if (!edisUrlData)
        return null;

    return <IFrameDialog
        iFrameData={edisUrlData}
        onCloseIframeCB={onCloseIframe}
    />
}

const mapStateToProps = ({ menu }) => {
    return {
        showEdisScreen: menu.showEdisScreen,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeEdisScreenFlag: (s) => { dispatch(storeEdisScreenFlag(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(EdisComponent));
