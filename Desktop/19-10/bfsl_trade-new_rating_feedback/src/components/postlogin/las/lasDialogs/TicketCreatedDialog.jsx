import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { checkEmpty } from '../../../../common/CommonMethods'
// import { checkEmpty } from '../../../../common/CommonMethods'
import { SCREENS } from '../../../../common/Constants'
import LangText from '../../../../common/lang/LangText'
import { storeAvailLoanDialogDetails } from '../../../../state/actions/Actions'
import { Request_icon } from '../../../common/FontIcons'

function TicketCreatedDialog(props) {
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
                        <span className="req-msg ticket">
                            <LangText name="APPLICATION_PROGRESS" module="LAS" />
                        </span>
                        <div className="loan-amnt">
                            <LangText name="TICKET_ID" module="LAS" />
                            <span className="value">
                                {checkEmpty(props.responseData.id)} </span>
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
        responseData:las.responseData
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) },
       
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(withRouter (TicketCreatedDialog))
