import React ,{useState,useEffect} from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { checkEmpty } from '../../../../common/CommonMethods';
import {  THEMES } from '../../../../common/Constants';
// import { AVAIL_LOAN_DIALOGS } from '../../../../common/Constants';
// import { THEMES } from '../../../../common/Constants'
import LangText from '../../../../common/lang/LangText'
import { storeAvailLoanPledgeRefreshFlag, storeLoanDialogDetails } from '../../../../state/actions/Actions';

function EpledgeCongratsDialog(props) {
    const [plegdeSuccess, setPledgeSucess] = useState({})
    const [eligibleAmt, setEligibleAmt] = useState({})
   
    useEffect(() => {
        if(props.addPledgeSuccessResp){
            setPledgeSucess(props.addPledgeSuccessResp)
            setEligibleAmt(props.addPledgeSuccessResp.data)
        }

    }, [])

    function onClickDone(){
        props.storeLoanDialogDetails({
            dialogName:null
        })
        props.storeAvailLoanPledgeRefreshFlag(true) 
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
                            <LangText name="CONGRATS" module="LAS"/>
                        </span>
                    </div>
                    <div className="congo-body">
                        <span className="label">
                            <LangText name="APPLICATION_PROGRESS" module="LAS" />
                        </span>
                        {/* <span className="label">
                            <LangText name="SANCTION_NO" module="LAS" />
                            <span className="number">
                                {checkEmpty(plegdeSuccess.data.snctnNo)}
                            </span>
                        </span> */}
                        <span className="label">
                            <LangText name="REQ_LOAN_AMOUNT" module="LAS" />
                            <span className="value">{plegdeSuccess? '₹ ' : ''}
                                {checkEmpty(eligibleAmt.eligibleAmt)}
                            </span>
                        </span>
                    </div>
                    <div className="info-msg">
                        <span className="msg">
                            {checkEmpty(plegdeSuccess.infoMsg)}
                        </span>
                        {/* <LangText name="E_PLEDGE_SUCCESS_CONTENT" module="AVAIL_LOAN_DIALOG_CONTENT"/> */}
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

const mapStateToProps = ({availLoanDetails,settings}) => {

    return {
        addPledgeSuccessResp:availLoanDetails.addPledgeSuccessResp,
        selectedTheme: settings.selectedTheme

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeLoanDialogDetails: (s) => { dispatch(storeLoanDialogDetails(s)) },
        storeAvailLoanPledgeRefreshFlag: (s) => { dispatch(storeAvailLoanPledgeRefreshFlag(s)) }
    };
};

export default connect(mapStateToProps,mapDispatchToProps) (withRouter(EpledgeCongratsDialog))
