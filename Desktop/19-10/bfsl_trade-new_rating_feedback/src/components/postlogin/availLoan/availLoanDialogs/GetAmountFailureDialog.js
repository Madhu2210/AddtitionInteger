import React,{useState,useEffect}  from 'react'
import { connect } from 'react-redux'
import LangText from '../../../../common/lang/LangText'
import {  storeLoanDialogDetails } from '../../../../state/actions/Actions'
import { Sorry_icon } from '../../../common/FontIcons'

function GetAmountFailureDialog(props) {
    const [infoMsg, setInfomsg] = useState(null)
    
    useEffect(() => {
        if (props.getLoanFailureResp) {
            setInfomsg(props.getLoanFailureResp)
        }

    }, [])

    function onClickClose() {
        props.storeLoanDialogDetails({
            dialogName:null
        })

    }
    
    return (
        <div className="app-modalDialog2 sorry-dialog " >
            <div className="window sorry-base" >
                <div className="content">
                    <div className="header">
                        <span className="bfsl-font-2 sorryicon">
                            <Sorry_icon />
                        </span>
                        <span className="title">
                            <LangText name="NOT_ELIGIBLE" module="LAS" />
                        </span>
                    </div>
                    <div className="head-content">
                        <span >
                            {infoMsg}
                        </span>
                      
                    </div>
                    <div className="sorry-footer">
                        <button className="negativeBtn"
                            onClick={onClickClose}>
                            <LangText module="BUTTONS" name="DONE" />
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({  availLoanDetails }) => {

    return {
        getLoanFailureResp:  availLoanDetails.getLoanFailureResp,
       
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeLoanDialogDetails: (s) => { dispatch(storeLoanDialogDetails(s)) }

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GetAmountFailureDialog)