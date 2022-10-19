import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useFetch, MsfRequest } from "../../../index";
import { getBackOfficeBaseURL } from "../../../common/CommonMethods";
import { E_VOTING_SERVICE } from "../../../config/ServiceURLs";
import { showAppDialog, storeEVotingScreenFlag } from "../../../state/actions/Actions";
import { Loader } from "../../common/LoaderComponent";
import MenuIframeDialogComponent from "../menu/MenuIframeDialogComponent";

function EVotingComponent(props) {

    const MsfFetch = useFetch();

    const [eVotingUrlData, setEVotingUrlData] = useState(null)

    useEffect(() => {
        if (props.showEVotingScreen)
            getEVotingUrlData();
    }, [props.showEVotingScreen]);

    function getEVotingUrlData() {
        props.showLoader()
        let request = new MsfRequest();
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + E_VOTING_SERVICE.GET_EVOTING_URL,
            request,
            successRespCBGetEVotingUrl,
            errorRespCBGetEVotingUrl
        )
    }

    function successRespCBGetEVotingUrl(response) {
        // console.log('response evoting: ', response);
        setEVotingUrlData(response.data)
        props.hideLoader()
    }

    function errorRespCBGetEVotingUrl(error) {
        props.hideLoader()
        props.showAppDialog({
            message: error.message,
            show: true
        })
        props.storeEVotingScreenFlag(false)
    }
    function onCloseIframe() {
        setEVotingUrlData(null)
        props.storeEVotingScreenFlag(false)
    }
    
    if (!eVotingUrlData)
        return null;

    return <MenuIframeDialogComponent
        iFrameData={eVotingUrlData}
        onCloseIframeCB={onCloseIframe}
    />
}

const mapStateToProps = ({ news }) => {
    return {
        showEVotingScreen: news.showEVotingScreen,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeEVotingScreenFlag: (s) => { dispatch(storeEVotingScreenFlag(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(EVotingComponent));
