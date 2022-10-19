/* eslint-disable */
import React, { useEffect, useRef} from 'react'
import { connect } from 'react-redux';

import { MsfRequest, useFetch } from '../../../../index';
import {
    showAppDialog, storeAvailLoanDialogDetails, storeEagreeResponse,
    storeUserStage
} from '../../../../state/actions/Actions';
import { CloseIcon } from '../../../common/FontIcons'
import { LAS_SERVICES } from '../../../../config/ServiceURLs';
import { getBackOfficeBaseURL } from '../../../../common/CommonMethods';
import { Loader } from '../../../common/LoaderComponent';
import { withRouter } from 'react-router-dom';
import useCloseModal from '../../../../customHooksComponents/useCloseModal';
import { LAS_USER_STAGE, LOCAL_STORAGE, SET_TIMEOUT_INTERVAL} from '../../../../common/Constants';
import { getItemFromSessionStorage } from '../../../../common/LocalStorage';

function LasIframeDialog(props) {

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, closeCB)
    const MsfFetch = useFetch()
    const apiInterval = useRef(null);

    useEffect(() => {
        checkUserStatus(true)
        props.showLoader()
        apiInterval.current = setInterval(() => {
            checkUserStatus(true);
        }, SET_TIMEOUT_INTERVAL.GET_USER_STAGE);

        return () => {
            clearRefreshInterval();
        };
    }, []);

    function closeCB() {
        checkUserStatus()
    }

    function checkUserStatus(timerApi = false) {
        if (!timerApi)
            props.showLoader(); 
        let request = new MsfRequest();
        request.addToData({ lan: props.lan })
        request.setEcho(timerApi ? "timerApi" : "manualApi")

        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.GET_LOAN_STATUS,
            request,
            successRespCBGetUserStatus,
            errorRespCBGetUserStatus
        )
    }

    function successRespCBGetUserStatus(response) {
        props.storeEagreeResponse(response.data)

        if (response.echo == "manualApi"){
            
            if (response.data.status == LAS_USER_STAGE.EARGREEMENT_PENDING || 
            response.data.status == LAS_USER_STAGE.LOAN_APPROVED){

                let lasData= JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.LAS_HELP))
                let msg= lasData.agreementMsg ? lasData.agreementMsg :""
                props.showAppDialog({
                    message: msg,
                    show: true
                })
            }
            props.storeAvailLoanDialogDetails({
                dialogName: null
            })
        }

        if (response.data.status == LAS_USER_STAGE.E_ARGREEMENT_ACCEPTED ||
            response.data.status == LAS_USER_STAGE.E_MANDATE_PENDING){
            props.storeAvailLoanDialogDetails({
                dialogName: null
            })
        }

        props.storeUserStage({
            userStage: response.data.status
        })
     
        props.hideLoader();

    }

    function errorRespCBGetUserStatus(error) {
        props.hideLoader();
        props.showAppDialog({
            message: error.message,
            show: true
        })
    }

    function clearRefreshInterval() {
        clearInterval(apiInterval.current);
    }

    return (
        <div className="app-modalDialog2 las-iframe">
            <div className="window" ref={modalRef} >
                <span className="closeIcon-div" onClick={closeCB}>
                    <CloseIcon />
                </span>
                <div className="content">
                    <iframe
                        className="iframe"
                        src={props.eAgreeResponse.link}
                        height="100%"
                        width="100%"
                        name="iframeWebView"
                        allowFullScreen="true"
                        webkitallowfullscreen="true"
                        mozallowfullscreen="true"
                        onLoad={props.hideLoader}
                    >
                    </iframe>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ las }) => {
    return {
        eAgreeResponse: las.eAgreeResponse,
        lan: las.lan

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeUserStage: (s) => { dispatch(storeUserStage(s)) },
        storeEagreeResponse: (s) => { dispatch(storeEagreeResponse(s)) },

    };
};

export default connect(mapStateToProps,mapDispatchToProps)(withRouter (Loader(LasIframeDialog)))