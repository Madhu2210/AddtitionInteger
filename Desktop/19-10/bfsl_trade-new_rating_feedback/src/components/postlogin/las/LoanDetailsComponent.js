import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { MsfRequest, useFetch } from '../../../index'
import { withRouter } from 'react-router-dom'

import LangText, { getLangText } from '../../../common/lang/LangText'
import RangeInput from '../../common/RangeInputComponent'
import PieChart from '../../common/PieChartComponent'
import { Loader } from '../../common/LoaderComponent'

import {
    showAppDialog, storeAvailLoanDialogDetails, storeInfomsgAplyLoan, storeLAN, storeUserLoanAmt,
    storeUserStage
} from '../../../state/actions/Actions'
import {
    LAS_LOAN_DIALOGS, CHART_COLORS, LAS_INTREST_CHART_CONST, LOCAL_STORAGE,
    SCREENS, THEMES, LOAN_AMT_FIELD_MAX_LENGTH, LAS_USER_STAGE, AF_EVENT_NAMES, AF_EVENT_TYPES
} from '../../../common/Constants'
import {
    AF_EventTriggered,
    checkEmpty, checkInt, convertCommaSeparated, countHoleNumbers, getBackOfficeBaseURL,
    replaceComma
} from '../../../common/CommonMethods'
import { getItemFromSessionStorage } from '../../../common/LocalStorage'
import { LAS_SERVICES } from '../../../config/ServiceURLs'
import InputComponent from '../../common/InputComponent'
import { getLasEmiCalcValues } from '../../../common/Bridge'
import { InfoIcon } from '../../common/FontIcons'
import useCloseModal from '../../../customHooksComponents/useCloseModal'

function LoanDetailsComponent(props) {
    const MsfFetch = useFetch()
    const [configLasData, setConfigLasData] = useState({})
    const [chartData, setChartData] = useState(null)
    const [selectedLoanAmt, setSelectedLoanAmt] = useState('')
    const [monthlyEMI, setMonthlyEMI] = useState(null)
    const [totalPayableAmt, setTotalPayAmt] = useState(null)
    // const [interestAmt, setinterest] = useState(null)
    // const [stampDuty, setStampDuty] = useState(null)
    const [responseData, setResponseData] = useState({})
    const [initLoanAmnt, setInitLoanAmnt] = useState('')
    const [maxAmt, setMaxAmt] = useState('')
    const [onClickshow, setOnclickshow] = useState(false)

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, oncloseShow)

    useEffect(() => {
        if (props.responseData) {
            setResponseData(props.responseData)

        }
        // if (props.responseData.stmpDuty) {
        //     setStampDuty(props.responseData.stmpDuty)
        // } else {
        //     setStampDuty(props.eligibleAmnt.stmpDuty)
        // }

        let lasData = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.LAS_HELP))
        if (lasData)
            setConfigLasData(lasData)
        let maxAmnt = parseInt(replaceComma(lasData.maxAmt))
        let elgAmnt = parseInt(replaceComma(props.responseData.elgAmnt))
        if (elgAmnt > maxAmnt) {
            setSelectedLoanAmt(lasData.maxAmt)
            setInitLoanAmnt(lasData.maxAmt)
            setMaxAmt(lasData.maxAmt)
        } else {
            if (props.responseData) {
                setSelectedLoanAmt(props.responseData.elgAmnt)
                setInitLoanAmnt(props.responseData.elgAmnt)
                setMaxAmt(props.responseData.elgAmnt)
            }

        }

    }, [])

    useEffect(() => {
        if (selectedLoanAmt && configLasData) {

            let lasValues = getLasEmiCalcValues(selectedLoanAmt)
            // let interest = lasValues.totalAmount - lasValues.loanAmt

            setMonthlyEMI(lasValues.EMI)
            setTotalPayAmt(lasValues.totalAmount)
            // setinterest(interest)

        }
    }, [selectedLoanAmt])

    useEffect(() => {
        let colors = {
            [THEMES.DARK]: CHART_COLORS.LAS_INTREST.DARK,
            [THEMES.LIGHT]: CHART_COLORS.LAS_INTREST.LIGHT
        }

        formChartData(totalPayableAmt, monthlyEMI, colors[props.selectedTheme.theme])
    }, [props.selectedTheme, totalPayableAmt, monthlyEMI])

    function formChartData(totalAmnt, payableAmt, colors) {
        let finalData = {}
        let colorArray = []
        let lasIntrestChartData = {
            [LAS_INTREST_CHART_CONST.TOTAL_AMOUNT]: totalAmnt,
            [LAS_INTREST_CHART_CONST.AMOUNT_PAYABLE]: payableAmt
        }
        if (colors)
            colorArray = Object.values(colors)
        finalData.data = lasIntrestChartData
        finalData.colorArray = colorArray
        setChartData(finalData)
    }

    function onClickClose() {
        props.storeUserStage({
            userStage: LAS_USER_STAGE.CHECK_ELIGIBITY
        })
        // props.history.push(SCREENS.DASHBOARD)
    }

    function onClickContinue() {
        updateSelectedLoanAmt()
    }

    function updateSelectedLoanAmt() {
        let request = new MsfRequest();
        request.addToData({
            'loanId': responseData.loanId,
            'amnt': selectedLoanAmt
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.UPDATE_LOAN_AMNT,
            request,
            successRespCBUpdateAmnt,
            errorRespCBUpdateAmnt
        )
    }
    function successRespCBUpdateAmnt() {
        props.storeUserLoanAmt(selectedLoanAmt)
        getApplyLoan()

    }
    function errorRespCBUpdateAmnt(error) {
        props.showAppDialog({
            message: error.message,
            show: true
        })
    }

    function getApplyLoan() {
        props.showLoader();
        let request = new MsfRequest();
        request.addToData({ loanId: responseData.loanId })

        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.APPLY_LOAN,
            request,
            successRespCBApplyLoan,
            errorRespCBApplyLoan
        )
    }

    function successRespCBApplyLoan(response) {
        props.hideLoader();
        props.storeLAN(response.data.lan)
        props.storeAvailLoanDialogDetails({
            dialogName: LAS_LOAN_DIALOGS.LOAN_APPROVED_POPUP
        })
        AF_EventTriggered(AF_EVENT_NAMES.LAS , AF_EVENT_TYPES.APPLY_LOAN)
    }

    function errorRespCBApplyLoan(error) {
        props.hideLoader();
        if (error.infoID === "LAS004") {
            props.storeInfomsgAplyLoan(error.message)
            props.storeAvailLoanDialogDetails({
                dialogName: LAS_LOAN_DIALOGS.NOT_ELIGIBLE_POPUP
            })
        } else {
            props.showAppDialog({
                message: error.message,
                show: true
            })
            props.history.push(SCREENS.DASHBOARD)
        }
        AF_EventTriggered(AF_EVENT_NAMES.LAS , AF_EVENT_TYPES.UNABLE_TO_APPLY_LOAN)
    }

    function onChangeRangeInput(value) {
        // console.log(value)
        setSelectedLoanAmt(convertCommaSeparated(value, 0))
        setInitLoanAmnt(convertCommaSeparated(value, 0))
    }

    function onChangeLoanAmt(e) {
        let currLoanAmt = parseInt(replaceComma(e.target.value))

        let valLength = countHoleNumbers(currLoanAmt)
        // console.log(valLength)

        if (currLoanAmt) {
            if (checkInt(currLoanAmt)) {
                if (valLength <= LOAN_AMT_FIELD_MAX_LENGTH) {
                    setInitLoanAmnt(currLoanAmt)
                }
            }
        } else
            setInitLoanAmnt()
    }
    function onBlurLoanAmt(e) {

        let currLoanAmt = e.target.value
        let newval = currLoanAmt ? parseInt(replaceComma(currLoanAmt)) : 0
        let minAmt = parseInt(replaceComma(configLasData.minAmt))
        let maxAmnt = parseInt(replaceComma(maxAmt))

        // console.log("curr", newval, minAmt, maxAmt)

        if ((newval < minAmt || newval > maxAmnt)) {
            // console.log("if", newval)

            props.showAppDialog({
                message: getLangText('INVALID_LOAN_AMT', 'LAS'),
                show: true
            })
            setInitLoanAmnt(selectedLoanAmt)
        } else {
            setSelectedLoanAmt(convertCommaSeparated(newval, 0))
            setInitLoanAmnt(convertCommaSeparated(newval, 0))
        }
    }

    function onClickInfo() {
        setOnclickshow(!onClickshow)
    }

    function oncloseShow(){
        setOnclickshow(false)
    }
    
    return (
        <div className="loan-base">
            <div className="content-div">
                <div className="content-left">
                    <div className="left-data">
                        <div className="data-div">
                            <div className=" row">
                                <span className="label">
                                    <LangText module="LAS" name="LOAN_AMNT_INFO" />
                                </span>
                                <div className="loan-amnt">
                                    <span className="symbol-rupee"> {'₹ '} </span>
                                    <InputComponent
                                        type="text"
                                        className="input-amt"
                                        value={initLoanAmnt}
                                        onChange={onChangeLoanAmt}
                                        onBlur={onBlurLoanAmt}
                                    />

                                </div>
                            </div>
                            <div className="row range-input-row">
                                <RangeInput min={checkEmpty(replaceComma(configLasData.minAmt))}
                                    max={checkEmpty(replaceComma(maxAmt))}
                                    onChange={onChangeRangeInput}
                                    value={replaceComma(selectedLoanAmt)}
                                // onMouseOut={onMouseOutRangeInput}
                                />
                            </div>
                            <div className="row">
                                <span>{configLasData ? '₹ ' : ''}
                                    {checkEmpty(configLasData.minAmt)}
                                </span>
                                <span>{maxAmt ? '₹ ' : ''}
                                    {checkEmpty(maxAmt)}
                                </span>
                            </div>
                        </div>
                        <div className="loan-detail">
                            <div className="val">
                                <span className="label" >
                                    <LangText module="LAS" name="SANC_LOAN_AMOUNT" />
                                </span>
                                <span className="value">{selectedLoanAmt ? '₹ ' : ''}
                                    {checkEmpty(selectedLoanAmt)}
                                </span>
                            </div>
                            <div className="val rateInterest">
                                <span className="label" >
                                    <LangText module="LAS" name="RATE_INTEREST" />
                                </span>
                                <span className="value">
                                    {checkEmpty(configLasData.roi)}
                                    {configLasData ? ' %' : ''}
                                </span>
                            </div>
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
                                <span className="label infoshow" >
                                    <LangText module="LAS" name="PROCESS_FEE" />
                                    <div className="tooltip-div tooltip-icon"ref={modalRef}>
                                        {onClickshow ?
                                            <div className="tooltip-container bottom tooltiplas">
                                                <span>
                                                    {configLasData.prcInfo}
                                                </span>
                                                <span className="triangle"></span>
                                            </div>
                                            : ""}
                                        <InfoIcon className="cursor flex-center" onClick={() => onClickInfo()} />
                                    </div>
                                </span>
                                <span className="value">{configLasData ? '₹ ' : ''}
                                    {checkEmpty(configLasData.processCharge)}
                                </span>
                            </div>

                        </div>
                        {/* <div className="loan-detail second"> */}
                        {/* <div className="val">
                                <span className="label" >
                                    <LangText module="LAS" name="PROCESS_FEE" />
                                </span>
                                <span className="value">{configLasData ? '₹ ' : ''}
                                    {checkEmpty(configLasData.processCharge)}
                                </span>
                            </div> */}
                        {/* <div className="val">
                                <span className="label" >
                                    <LangText module="LAS" name="DOC_CHARGE" />
                                </span>
                                <span className="value">{stampDuty ? '₹ ' : ''}
                                    {checkEmpty(stampDuty)}
                                </span>
                            </div> */}
                        {/* <div className="val"> */}
                        {/* </div> */}
                        {/* </div> */}
                        <div className="info">
                            <div className="row">{'*'}
                                <span className="info-data">
                                    <LangText module="LAS" name="INTEREST_INFO" />
                                </span>
                            </div>
                            <div className="row">{'*'}
                                <span className="info-data">
                                    <LangText module="LAS" name="FEE_INFO" />
                                </span>
                            </div>
                            <div className="row final">{'*'}
                                <span className="info-data ">
                                    <LangText module="LAS" name="EMI_INFO" />
                                </span>
                            </div>
                        </div>

                    </div>

                </div>
                <div className="content-right">
                    <div className="intrest-chart">
                        <div className="chart-container">
                            <PieChart chartData={chartData} noLabel={true}
                                width={455}
                                height={455}
                                isLAS={true}
                            />
                            <div className="payable-amt-div">
                                <span className="label">
                                    <LangText module="LAS" name="AMNT_PAYABLE" /></span>
                                <span className="payable-amt">{totalPayableAmt ? '₹ ' : ''}
                                    {checkEmpty(convertCommaSeparated(totalPayableAmt, 0))}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="emi-value-div">
                        <div className="monthly-emi-value">
                            <span className="emi-label">
                                <LangText module="LAS" name="YOUR_EMI" />
                            </span>
                            <span className="emi-value">{monthlyEMI ? '₹ ' : ''}
                                {checkEmpty(convertCommaSeparated(monthlyEMI, 0))}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-div">
                <div className="footer">
                    <button className="las-negativeBtn"
                        onClick={onClickClose}>
                        <LangText  name="GO_BACK" />
                    </button>
                    <button

                        className="las-positivebtn"

                        onClick={onClickContinue}>
                        <LangText module="BUTTONS" name="CONTINUE" />
                    </button>
                </div>
            </div>

        </div >
    )
}
const mapStateToProps = ({ las, settings }) => {

    return {
        responseData: las.responseData,
        isUserAcceptedKYC: las.isUserAcceptedKYC,
        selectedTheme: settings.selectedTheme,
        eligibleAmnt: las.eligibleAmnt
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) },
        storeUserStage: (s) => { dispatch(storeUserStage(s)) },
        storeLAN: (s) => { dispatch(storeLAN(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeUserLoanAmt: (s) => { dispatch(storeUserLoanAmt(s)) },
        storeInfomsgAplyLoan: (s) => { dispatch(storeInfomsgAplyLoan(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Loader(LoanDetailsComponent)));
