import React,{useState,useEffect} from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { checkEmpty } from '../../../../common/CommonMethods'
import { SCREENS } from '../../../../common/Constants'
import LangText from '../../../../common/lang/LangText'
import { storeAvailLoanDialogDetails } from '../../../../state/actions/Actions'
import { Request_icon } from '../../../common/FontIcons'

function AboveFiftyLackRequestDialog(props) {
    const [eligibleAmtData, setEligibleAmtData] = useState({}) 
    
    useEffect(() => {
        if (props.eligibleAmnt) {
            setEligibleAmtData(props.eligibleAmnt)
        } else {
            setEligibleAmtData(props.responseData)
        }
        
    }, [])

    function onClickOkay() {
        props.storeAvailLoanDialogDetails({
            dialogName: null
        })
        props.history.push(SCREENS.DASHBOARD)
    }
    return (
        <div className="app-modalDialog2 request-dialog" >
            <div className="window request-base" >
                <div className="request-content">
                    <div className="header">
                        <span className="bfsl-font-2 requesticon">
                            <Request_icon/>
                        </span>
                        <span className="title">
                            <LangText name="REQUEST" module="LAS" />
                        </span>
                    </div>
                    <div className="request-body">
                        <span className="req-msg">
                            <LangText name="REQUEST_MSG" module="LAS" />
                        </span>
                        <div className="loan-amnt">
                            <LangText name="REQ_LOAN_AMOUNT" module="LAS" />
                            <span className="value">{eligibleAmtData ? '₹ ' : ''}
                                {checkEmpty(eligibleAmtData.elgAmnt)} </span>
                        </div>
                    </div>
                    <div className="req-footer">
                
                        <button className="las-negativeBtn req-btn"
                            onClick={onClickOkay}>
                            <LangText module="BUTTONS" name="OKAY" />
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ las }) => {

    return {
        eligibleAmnt: las.eligibleAmnt,
        responseData:las.responseData
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) },
       
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(withRouter (AboveFiftyLackRequestDialog))
