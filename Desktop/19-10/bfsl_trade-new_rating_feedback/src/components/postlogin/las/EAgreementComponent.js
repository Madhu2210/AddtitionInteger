
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { MsfRequest, useFetch } from '../../../index';

import { getBackOfficeBaseURL } from '../../../common/CommonMethods'
import { LAS_LOAN_DIALOGS, SCREENS } from '../../../common/Constants'
import LangText from '../../../common/lang/LangText'
import { LAS_SERVICES } from '../../../config/ServiceURLs';
import {
    showAppDialog, storeAvailLoanDialogDetails, storeEagreeResponse,
    storeUserStage
} from '../../../state/actions/Actions'

import { Loader } from '../../common/LoaderComponent'

function EAgreementComponent(props) {

    const MsfFetch = useFetch()

    // const [eAgreeCheck, setEAgreeCheck] = useState(false)
    // const [configLasData, setConfigLasData] = useState({})
    // const [monthlyEMI, setMonthlyEMI] = useState(null)
    // const [stampDuty, setStampDuty] = useState(null)
    // const [loanAmt, setLoanAmt] = useState(null)

    // const apiInterval = useRef(null);

    // useEffect(() => {
    //     checkStatus(true);
    //     apiInterval.current = setInterval(() => {
    //         checkStatus(true);
    //     }, SET_TIMEOUT_INTERVAL.GET_USER_STAGE);

    //     return () => {
    //         clearRefreshInterval();
    //     };
    // }, []);

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
    function onClickGetOtp() {
        if (props.eAgreeResponse.link) {
            // window.open(props.eAgreeResponse.link)
            props.storeAvailLoanDialogDetails({
                dialogName: LAS_LOAN_DIALOGS.LAS_IFRAME
            })

        } else {
            checkStatus()
        }
    }

    function checkStatus() {

        props.showLoader();
        let request = new MsfRequest();
        request.addToData({ lan: props.lan })

        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.GET_LOAN_STATUS,
            request,
            successRespCBGetStatus,
            errorRespCBGetStatus
        )
    }

    function successRespCBGetStatus(response) {

        props.storeEagreeResponse(response.data)
        props.storeAvailLoanDialogDetails({
            dialogName: null
        })
        props.storeUserStage({
            userStage: response.data.status
        })
        if (response.data.link) {
            props.storeAvailLoanDialogDetails({
                dialogName: LAS_LOAN_DIALOGS.LAS_IFRAME
            })
        }else{
            props.showAppDialog({
                message: response.data.msg,
                show: true
            })
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
    // function clearRefreshInterval() {
    //     clearInterval(apiInterval.current);
    // }
    return (
        <>
            <div className="eagree-details">
                <div className="eagree-content">
                    <div className="eagree-msg">
                        <LangText module="LAS" name="E_AGREEMENT_INFO" />
                    </div>
                    {/* <div className="check-div">
                        <div className="row">
                            <span className={`bfsl-font-2 ${!eAgreeCheck ? "checkboxnor" :
                                "active-checkboxnor"}`}>
                                {!eAgreeCheck ?

                                    <Checkbox_nor onClick={() => setEAgreeCheck(true)} />
                                    :
                                    <Checkbox_sel onClick={() => setEAgreeCheck(false)} />

                                }
                            </span>
                            <span className="data">
                                <LangText module="LAS" name="E_AGREEMENT_TERM" />
                            </span>
                        </div>
                    </div> */}
                    <div className="eagree-footer">
                        <button className="las-negativeBtn"
                            onClick={onClickClose}>
                            <LangText module="BUTTONS" name="CANCEL" />
                        </button>
                        {/* {
                            isLinkOpened ?
                                <button
                                    className="las-positivebtn"
                                    onClick={checkStatus}
                                >
                                    <LangText module="BUTTONS" name="CONTINUE" />
                                </button>
                                : */}
                        <button
                            className="las-positivebtn"
                            onClick={onClickGetOtp}
                        >
                            <LangText module="BUTTONS" name="PROCEED" />
                        </button>
                    </div>
                </div>
            </div>
            {/* <div className="eagree-info">
                <div className="details">
                    <div className="datas">
                        <span className="label" >
                            <LangText module="LAS" name="LOAN_AMOUNT" />
                        </span>
                        <span className="value"> {loanAmt ? '₹ ' : ''}
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
                        <span className="value">{stampDuty ? '₹ ' : ''}
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
        eAgreeResponse: las.eAgreeResponse,
        lan: las.lan

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) },
        storeUserStage: (s) => { dispatch(storeUserStage(s)) },
        storeEagreeResponse: (s) => { dispatch(storeEagreeResponse(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Loader(EAgreementComponent)));
