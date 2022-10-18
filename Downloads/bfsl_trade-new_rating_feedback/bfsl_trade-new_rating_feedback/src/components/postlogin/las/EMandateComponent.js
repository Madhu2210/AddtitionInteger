import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { MsfRequest, useFetch } from '../../../index';

import { Loader } from '../../common/LoaderComponent'

import { getBackOfficeBaseURL } from '../../../common/CommonMethods'
import { LAS_USER_STAGE, SCREENS, SET_TIMEOUT_INTERVAL } from '../../../common/Constants'
import LangText from '../../../common/lang/LangText'
import {
    showAppDialog, storeEagreeResponse,
    storeUserStage
} from '../../../state/actions/Actions'
import { LAS_SERVICES } from '../../../config/ServiceURLs';
// import { getLasEmiCalcValues } from '../../../common/Bridge';

function EMandateComponent(props) {

    const MsfFetch = useFetch()

    // const [configLasData, setConfigLasData] = useState({})
    // const [loanAmt, setLoanAmt] = useState(null)
    // const [monthlyEMI, setMonthlyEMI] = useState(null)
    // const [stampDuty, setStampDuty] = useState(null)

    const apiInterval = useRef(null);

    useEffect(() => {
        checkStatus(true)
        apiInterval.current = setInterval(() => {
            checkStatus(true);
        }, SET_TIMEOUT_INTERVAL.GET_USER_STAGE);

        return () => {
            clearRefreshInterval();
        };
    }, []);

    // useEffect(() => {
    //     if (props.responseData.stmpDuty) {
    //         setStampDuty(props.responseData.stmpDuty)
    //     } else {
    //         setStampDuty(props.eligibleAmnt.stmpDuty)
    //     }

    //     if (props.loanAmnt) {
    //         setLoanAmt(props.loanAmnt)
    //     }
    //     let lasValues = getLasEmiCalcValues(props.loanAmnt)
    //     setConfigLasData(lasValues.lasData)
    //     setMonthlyEMI(lasValues.EMI)
    // }, [])

    function onClickClose() {
        props.history.push(SCREENS.DASHBOARD)
    }

    function checkStatus(timerApi = false) {
        if (!timerApi)
            props.showLoader();
        let request = new MsfRequest();
        request.addToData({ lan: props.lan })
        request.setEcho(timerApi ? "timerApi" : "manualApi")

        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.GET_LOAN_STATUS,
            request,
            successRespCBGetStatus,
            errorRespCBGetStatus
        )
    }

    function successRespCBGetStatus(response) {
        // console.log("checkStatus", response)
        props.storeEagreeResponse(response.data)
        if (response.data.status == LAS_USER_STAGE.MANDATE_REJECTED) {
            props.showAppDialog({
                title:"E-mandate Rejected",
                message: response.data.rejReason,
                show: true,
                closeCB: onClose,
                baseParent:true
            })
        
        } else {
            props.storeUserStage({
                userStage: response.data.status
            })

            if (response.echo == "manualApi") {
                if (response.data.link) {
                    window.open(response.data.link)
                } else {
                    props.showAppDialog({
                        message: response.data.msg,
                        show: true
                    })
                }
            }
        }

        props.hideLoader();

    }

    function errorRespCBGetStatus(error) {
        props.hideLoader();
        props.showAppDialog({
            message: error.message,
            show: true
        })
    }
    function clearRefreshInterval() {
        clearInterval(apiInterval.current);
    }

    function onclickMandate() {
        if (props.eAgreeResponse.link) {
            window.open(props.eAgreeResponse.link)

        } else {
            checkStatus()
        }
    }

    function onClose(){
        props.history.push(SCREENS.DASHBOARD)
    }
    
    return (
        <>
            <div className="emandate-details">
                <div className="emandate-content">
                    <div className="emandate-msg">
                        <LangText module="LAS" name="E_MANDATE_INFO" />
                    </div>
                    <div className="note-div">
                        <div className="row">
                            <span className="note">
                                <LangText module="LAS" name="NOTE" />
                            </span>
                            <span className="data">
                                <LangText module="LAS" name="E_MANDATE_NOTE" />
                            </span>
                        </div>
                    </div>
                    <div className="emandate-footer">
                        <button className="las-negativeBtn"
                            onClick={onClickClose}>
                            <LangText module="BUTTONS" name="CANCEL" />
                        </button>
                        <button

                            className="las-positivebtn"
                            onClick={onclickMandate}
                        >
                            <LangText module="BUTTONS" name="CONTINUE" />
                        </button>
                    </div>
                </div>
            </div>
            {/* <div className="emandate-info">
                <div className="details">
                    <div className="datas">
                        <span className="label" >
                            <LangText module="LAS" name="LOAN_AMOUNT" />
                        </span>
                        <span className="value">
                            {loanAmt ? '₹ ' : ''}
                            {checkEmpty(loanAmt)}
                        </span>
                    </div>
                    <div className="datas">
                        <span className="label" >
                            <LangText module="LAS" name="RATE_INTEREST" />
                        </span>
                        <span className="value">
                            {checkEmpty(configLasData.roi)}
                            {configLasData ? ' %' : ''}
                        </span>
                    </div>
                    <div className="datas">
                        <span className="label" >
                            <LangText module="LAS" name="MONTHLY_EMI" />
                        </span>
                        <span className="value">{monthlyEMI ? '₹ ' : ''}
                            {checkEmpty(convertCommaSeparated(monthlyEMI, 0))}
                        </span>
                    </div>

                    <div className="datas">
                        <span className="label" >
                            <LangText module="LAS" name="TENURE" />
                        </span>
                        <span className="value">
                            {checkEmpty(configLasData.tenor)}
                            {configLasData ? ' Months' : ''}
                        </span>
                    </div>
                    <div className="datas">
                        <span className="label" >
                            <LangText module="LAS" name="PROCESS_FEE" />
                        </span>
                        <span className="value">
                            {configLasData ? '₹ ' : ''}
                            {checkEmpty(configLasData.processCharge)}
                        </span>
                    </div>
                </div>
                <div className="details">
                    <div className="datas">
                        <span className="label" >
                            <LangText module="LAS" name="STAMP_DUTY" />
                        </span>
                        <span className="value">
                            {stampDuty ? '₹ ' : ''}
                            {checkEmpty(stampDuty)}
                        </span>
                    </div>
                    <div className="datas">
                    </div>
                </div>

                <div className="interest-info">
                    <span className="label" >
                        <LangText module="LAS" name="E_AGREEMENT_INTEREST" />
                    </span>
                </div>
            </div> */}
        </>

    )
}

const mapStateToProps = ({ las }) => {
    return {
        lan: las.lan,
        eAgreeResponse: las.eAgreeResponse

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeUserStage: (s) => { dispatch(storeUserStage(s)) },
        storeEagreeResponse: (s) => { dispatch(storeEagreeResponse(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Loader(EMandateComponent)));
