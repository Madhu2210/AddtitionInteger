import React, { useState } from 'react'
import { connect } from 'react-redux'

import { Loader } from '../../common/LoaderComponent'
import {
    ChargesIcon, DigitalIcon, IntamountIcon, InterestIcon, StocksIcon,
    ValueIcon
} from '../../common/FontIcons'

import LangText from '../../../common/lang/LangText'
import {
    showAppDialog,
    storeAvailLoanDialogDetails,
} from '../../../state/actions/Actions'
import { LAS_LOAN_DIALOGS,  SCREENS, THEMES } from '../../../common/Constants'
import { withRouter } from 'react-router-dom'

let TermsConditionDetails = {
    "infoMsg": <LangText name="LAS_SENTENCE_DESCRIPTION"/>,

    "feature": <LangText name="LAS_FEATURES_SENTENCE"/>,
    // "note": "Bajaj Finance Limited provide LAS upto 350 Crs. If you wish to avail LAS above ₹50 Lakhs,"
    //     + "pls feel free to write to us at: ",
    // "link": "las.support@bajajfinserv.in",

    "conditions": [
        {
            "first": <LangText name="LAS_FULLY_DIGITAL_SENTENCE"/>,
            "second": <LangText name="LAS_MINIMUM_VALUE_SENTENCE"/>,
            "third": <LangText name="LAS_LOWER_INTEREST_SENTENCE"/>,
            "fourth": <LangText name="LAS_NIL_PART_PAYMENT_SENTENCE"/>,
            "fifth": <LangText name="LAS_WIDE_LIST_SENTENCE"/>,
            "sixth": <LangText name="LAS_FULLY_DIGITAL_INTEREST_APPLICABLE_SENTENCE"/>
        }
    ],

}
function LoanAgainstSecurityCompo(props) {

    // const MsfFetch = useFetch()
    const [termsDetails] = useState(TermsConditionDetails)
    // const [lasHelp, setLasHelp] = useState({})

    // useEffect(() => {

    //     let lasData = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.LAS_HELP))
    //     if (lasData)
    //         setLasHelp(lasData)

    // }, [])

    function onClickClose() {
        props.history.push(SCREENS.DASHBOARD)

    }

    function onClickCheck() {
        props.storeAvailLoanDialogDetails({
            dialogName: LAS_LOAN_DIALOGS.TERMS_CONDITIONS
        })
        //     props.showLoader();
        //     let request = new MsfRequest();
        //     MsfFetch.placeRequest(
        //         getBackOfficeBaseURL() + LAS_SERVICES.CHECK_ELIGIBILITY,
        //         request,
        //         successRespCBGetEligibility,
        //         errorRespCBGetEligibility
        //     )
        // }

        // function successRespCBGetEligibility(response) {
        //     props.storeEligibleAmnt(response.data)
        //     if (response.data.elgAmnt) {
        //         let eligibleAmnt = replaceComma(response.data.elgAmnt)
        //         eligibleAmnt = parseInt(eligibleAmnt)
        //         let maxAmnt = parseInt(replaceComma(lasHelp.maxAmt))
        //         let minAmnt = parseInt(replaceComma(lasHelp.minAmt))

        //         if (eligibleAmnt > maxAmnt) {
        //             props.storeAvailLoanDialogDetails({
        //                 dialogName: LAS_LOAN_DIALOGS.ABV_50L_POPUP
        //             })
        //         } else if (eligibleAmnt > minAmnt) {
        //             props.storeAvailLoanDialogDetails({
        //                 dialogName: LAS_LOAN_DIALOGS.ELIGIBLE_POPUP

        //             })
        //         } else {
        //             props.storeAvailLoanDialogDetails({
        //                 dialogName: LAS_LOAN_DIALOGS.NOT_ELIGIBLE_POPUP
        //             })
        //         }
        //     }
        //     props.hideLoader();
        // props.history.push(SCREENS.DASHBOARD)

    }

    // function errorRespCBGetEligibility(error) {
    //     props.hideLoader();
    //     props.showAppDialog({
    //         message: error.message,
    //         show: true
    //     })

    // }

    return (
        <div className="loanagain-base" >

            <div className="img-div">
                {
                    props.selectedTheme.theme === THEMES.LIGHT ?
                        < img src="assets/images/loan_banner_light.svg" alt="" />
                        : <img src="assets/images/loan_banner_dark.svg" alt="" />
                }

            </div>

            <div className="loanagain-body">
                {/* <div className="header">
                    <span className="title">
                        <LangText name="LOAN_AGAINST_SECURITI" module="LAS" />
                    </span>
                </div> */}

                <div className="terms-content">

                    <div className="infoMsg">
                        {termsDetails.infoMsg}
                    </div>
                    <div className="feature">
                        {termsDetails.feature}
                    </div>

                    {termsDetails.conditions.map((item, index) => {
                        return (
                            <div key={index} className="condition-div">
                                <div className="row">
                                    <span className="bfsl-font-2 digitalicon">
                                        <DigitalIcon />
                                    </span>
                                    <span className="data">{item.first}</span>
                                </div>
                                <div className="row">
                                    <span className="bfsl-font-2 valueIcon">
                                        <ValueIcon />
                                    </span>
                                    <span className="data">{item.second}</span>
                                </div>
                                <div className="row">
                                    <span className="bfsl-font-2 interesticon">
                                        <InterestIcon />
                                    </span>
                                    <span className="data">{item.third}</span>
                                </div>
                                <div className="row">
                                    <span className="bfsl-font-2 chargesicon">
                                        <ChargesIcon />
                                    </span>
                                    <span className="data">{item.fourth}</span>
                                </div>
                                <div className="row">
                                    <span className="bfsl-font-2 stocksicon">
                                        <StocksIcon />
                                    </span>
                                    <span className="data">{item.fifth}</span>
                                </div>
                                <div className="row">
                                    <span className="bfsl-font-2 intamounticon">
                                        <IntamountIcon />
                                    </span>
                                    <span className="data">{item.sixth}</span>
                                </div>
                            </div>
                        )
                    })
                    }

                    {/* <div className="note-div">
                    <span className="data">{termsDetails.note}
                        <a href="mailto:las.support@bajajfinserv.in" target="_blank" rel="noopener noreferrer">
                            <span className="link">{termsDetails.link}</span></a>
                    </span>
                </div> */}
                </div>
                <div className="terms-footer">
                    <button className="las-negativeBtn cancel"
                        onClick={onClickClose}>
                        <LangText module="BUTTONS" name="CANCEL" />
                    </button>
                    <button className="las-positivebtn check"
                        onClick={onClickCheck} >
                        <LangText module="BUTTONS" name="PROCEED" />
                    </button>
                </div>
            </div>

        </div>
    )
}

const mapStateToProps = ({ settings }) => {

    return {
        selectedTheme: settings.selectedTheme

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) },
        // storeEligibleAmnt: (s) => { dispatch(storeEligibleAmnt(s)) },

        showAppDialog: (s) => { dispatch(showAppDialog(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Loader(LoanAgainstSecurityCompo)));