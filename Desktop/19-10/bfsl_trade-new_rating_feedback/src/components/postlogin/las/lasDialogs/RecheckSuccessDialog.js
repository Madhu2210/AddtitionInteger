import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

// import { useFetch } from '../../../../index';
import LangText from '../../../../common/lang/LangText'

import { checkEmpty, convertCommaSeparated } from '../../../../common/CommonMethods'

import { showAppDialog, storeAvailLoanDialogDetails } from '../../../../state/actions/Actions'
import { Loader } from '../../../common/LoaderComponent';
import { getLasEmiCalcValues } from '../../../../common/Bridge';

function RecheckSuccessDialog(props) {
    // const MsfFetch = useFetch()

    const [configLasData, setConfigLasData] = useState({})
    const [loanAmt, setLoanAmt] = useState(null)
    const [monthlyEmi, setMonthlyEMI] = useState(null)
    // const [stampDuty, setStampDuty] = useState(null)

    useEffect(() => {
        // if (props.responseData.stmpDuty) {
        //     setStampDuty(props.responseData.stmpDuty)
        // } else {
        //     setStampDuty(props.eligibleAmnt.stmpDuty)
        // }

        if (props.loanAmnt) {
            setLoanAmt(props.loanAmnt)
        }
        let lasValues = getLasEmiCalcValues(props.loanAmnt)
        setConfigLasData(lasValues.lasData)
        setMonthlyEMI(lasValues.EMI)

    }, [])

    function onClickClose() {
        props.storeAvailLoanDialogDetails({
            dialogName: null
        })
    }
    function onClickAccept() {
        props.storeAvailLoanDialogDetails({
            dialogName: null
        })
        // getOtp()
    }

    // function getOtp() {
    //     props.showLoader();
    //     let request = new MsfRequest();
    //     request.addToData({
    //         loanId: props.responseData.loanId,
    //         mode: "L"
    //     })

    //     MsfFetch.placeRequest(
    //         getBackOfficeBaseURL() + LAS_SERVICES.GENERATE_OTP,
    //         request,
    //         successRespCBGetOtp,
    //         errorRespCBGetOtp
    //     )
    // }

    // function successRespCBGetOtp(response) {
    //     console.log("respgenotp", response.data)
    //     props.hideLoader();
    //     props.storeAvailLoanDialogDetails({
    //         dialogName: LAS_LOAN_DIALOGS.OTP_VERIFICATION
    //     })

    // }

    // function errorRespCBGetOtp(error) {
    //     props.hideLoader()
    //     props.showAppDialog({
    //         message: error.message,
    //         show: true
    //     })

    // }

    return (
        <div className="app-modalDialog2 rechecksucc-dialog" >
            <div className="window rechecksucc-base" >
                <div className="rechecksucc-content">
                    <div className="details-head">
                        <span className="title" >
                            <LangText module="LAS" name="LOAN_DETAILS_HEAD" />
                        </span>
                    </div>
                    <div className="details-content">
                        <div className="loan-detail">
                            <div className="val">
                                <span className="label" >
                                    <LangText module="LAS" name="LOAN_AMOUNT" />
                                </span>
                                <span className="value">{loanAmt ? '₹ ' : ''}
                                    {checkEmpty(loanAmt)}
                                </span>
                            </div>
                            <div className="val">
                                <span className="label roi-label" >
                                    <LangText module="LAS" name="RATE_INTEREST" />
                                </span>
                                <span className="value">
                                    {checkEmpty(configLasData.roi)}
                                    {configLasData ? ' %' : ''}
                                </span>
                            </div>
                            <div className="val">
                                <span className="label" >
                                    <LangText module="LAS" name="MONTHLY_EMI" />
                                </span>
                                <span className="value">
                                    {monthlyEmi ? '₹ ' : ''}
                                    {checkEmpty(convertCommaSeparated(monthlyEmi, 0))}
                                </span>
                            </div>
                        </div>
                        <div className="loan-detail second">
                            <div className="val">
                                <span className="label" >
                                    <LangText module="LAS" name="TENURE" />
                                </span>
                                <span className="value">
                                    {checkEmpty(configLasData.tenor)}
                                    {configLasData ? ' Months' : ''}
                                </span>
                            </div>

                            <div className="val">
                                <span className="label" >
                                    <LangText module="LAS" name="PROCESS_FEE" />
                                </span>
                                <span className="value">{configLasData ? '₹ ' : ''}
                                    {checkEmpty(configLasData.processCharge)}
                                </span>
                            </div>
                            <div className="val">
                            </div>
                        </div>
                        {/* </div> */}
                        <div className="row">
                            <span className="label" >
                                <LangText module="LAS" name="E_AGREEMENT_INTEREST" />
                            </span>
                        </div>
                    </div>
                    <div className="recheck-footer">
                        <button className="las-negativeBtn"
                            onClick={onClickClose}>
                            <LangText module="BUTTONS" name="CANCEL" />
                        </button>
                        <button className="las-positivebtn"
                            onClick={onClickAccept} >
                            <LangText module="BUTTONS" name="ACCEPT" />
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}

const mapStateToProps = ({ las }) => {

    return {
        responseData: las.responseData,
        lan: las.lan,
        loanAmnt: las.loanAmnt,
        eligibleAmnt: las.eligibleAmnt
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(RecheckSuccessDialog))
