import React, { useState  } from 'react'

import { connect } from 'react-redux'
import { storeLoanDialogDetails } from '../../../../state/actions/Actions'

import LangText from '../../../../common/lang/LangText'
import { AVAIL_LOAN_DIALOGS } from '../../../../common/Constants';

import { Checkbox_nor, Checkbox_sel } from '../../../common/FontIcons';

function AgreeDialog(props) {

    const [termsandCondition, setTermsandCondition] = useState(true)

    function closeDialog() {
    
        props.storeLoanDialogDetails({
            dialogName: null
            // props.history.push(SCREENS.DASHBOARD)
        })
    }
    
    function continueDialog() {
    
        // props.history.push(AVAIL_LOAN_DIALOGS.WITHDRAW_FUND) 
        props.storeLoanDialogDetails({
            dialogName: AVAIL_LOAN_DIALOGS.WITHDRAW_FUND
        })
    }
    return (
        <div className="app-modalDialog2 terms-agree-dialog" >
            <div className="window agree-base" >
                <div className="agree-content">
                    <div className="withdraw-info">
                        <LangText name="WITHDRAW_INFO" module="AVAIL_LOAN" />
                    </div>
                    <div className="condition-agree">
                        <span className={`bfsl-font-2 ${!termsandCondition ? "checkboxnor" :
                            "active-checkboxnor"}`}>
                            {!termsandCondition ?

                                <Checkbox_nor onClick={() => setTermsandCondition(true)} />
                                :
                                <Checkbox_sel onClick={() => setTermsandCondition(false)} />

                            }
                        </span>
                        <span className="condition-data">
                            <LangText name="TERMS_AND_CONDITION" module="AVAIL_LOAN_DIALOG_CONTENT"/>
                        </span>
                    </div>
                </div>
                <div className="agree-footer">
                    <div className="agree-button">
                        <button className="las-negativeBtn"
                            onClick={closeDialog}>
                            <LangText name="CANCEL" module="BUTTONS" />
                        </button>
                        <button className="las-positivebtn"
                            disabled={(!termsandCondition) ?
                                'disabled': ""}
                            onClick={(!termsandCondition) ? "" :
                                continueDialog}>
                            <LangText name="CONTINUE" module="BUTTONS" />
                        </button>
                    </div>
                </div>

            </div>

        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeLoanDialogDetails: (s) => { dispatch(storeLoanDialogDetails(s)) }
    };
};

export default connect(null, mapDispatchToProps)(AgreeDialog)
