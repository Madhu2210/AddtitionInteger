import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { checkEmpty } from '../../../../common/CommonMethods'
import { SCREENS, THEMES } from '../../../../common/Constants'
import LangText from '../../../../common/lang/LangText'
import { storeAvailLoanDialogDetails } from '../../../../state/actions/Actions'

function EpledgeCongratulationDialog(props) {
    const [plegdeSuccessData, setPledgeSucessData] = useState({})
    const [plegdeSuccess, setPledgeSucess] = useState({})

    useEffect(() => {
        if(props.pledgeResponse){
            setPledgeSucessData(props.pledgeResponse.data)
            setPledgeSucess(props.pledgeResponse)
        }

    }, [])

    function onClickDone() {
        props.storeAvailLoanDialogDetails({
            dialogName: null
        })
        props.history.push(SCREENS.DASHBOARD)
    }

    return (
        <div className="app-modalDialog2 congo-dialog" >
            <div className="window congo-base" >
                <div className="congo-content">
                    <div className="header">
                        {props.selectedTheme.theme === THEMES.LIGHT ?
                            <img src="assets/images/dashboard/success_btn.svg" alt="" />
                            :
                            <img src="assets/images/dark/dashboard/success_btn.svg" alt="" />
                        }
                        <span className="title">
                            <LangText name="CONGRATS" module="LAS" />
                        </span>
                    </div>
                    <div className="congo-body">
                        <span className="label">
                            <LangText name="APPLICATION_PROGRESS" module="LAS" />
                        </span>
                        <span className="label">
                            <LangText name="SANCTION_NO" module="LAS" />
                            <span className="number">
                                {checkEmpty(plegdeSuccessData.snctnNo)}
                            </span>
                        </span>
                        <span className="label">
                            <LangText name="REQ_LOAN_AMOUNT" module="LAS" />
                            <span className="value">{plegdeSuccessData ? '₹ ' : ''}
                                {checkEmpty(plegdeSuccessData.optAmt)}
                            </span>
                        </span>
                    </div>
                    <div className="info-msg">
                        <span className="msg">
                            {checkEmpty(plegdeSuccess.infoMsg)}
                        </span>
                    </div>
                    <div className="congo-footer">
                        <button className="negativeBtn"
                            onClick={onClickDone}>
                            <LangText module="BUTTONS" name="DONE" />
                        </button>

                    </div>
                </div>
            </div>
            
        </div>
    )
}

const mapStateToProps = ({ las ,settings}) => {

    return {
        pledgeResponse: las.pledgeResponse,
        selectedTheme: settings.selectedTheme

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) }

    };
};

export default connect(mapStateToProps,mapDispatchToProps) (withRouter(EpledgeCongratulationDialog))
