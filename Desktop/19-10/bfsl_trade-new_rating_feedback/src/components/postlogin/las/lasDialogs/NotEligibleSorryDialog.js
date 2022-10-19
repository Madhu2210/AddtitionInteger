import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { SCREENS } from '../../../../common/Constants'
import LangText from '../../../../common/lang/LangText'
import { storeAvailLoanDialogDetails } from '../../../../state/actions/Actions'
import { Sorry_icon } from '../../../common/FontIcons'

function NotEligibleSorryDialog(props) {
    const [infoMsg, setInfomsg] = useState(null)

    useEffect(() => {
        if (props.ApplyLoanFailmsg) {
            setInfomsg(props.ApplyLoanFailmsg)
        }

    }, [])

    function onClickClose() {
        props.storeAvailLoanDialogDetails({
            dialogName: null
        })
        props.history.push(SCREENS.DASHBOARD)

    }
    return (
        <div className="app-modalDialog2 sorry-dialog" >
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

                        {infoMsg === null ?
                            <>
                                <span >
                                    <LangText name="NOT_ELIGIBLE_MSG" module="LAS" />
                                    <span className="value">₹ 25,000</span>
                                </span>
                                <div>
                                    <LangText name="PLZ_TRY" module="LAS" />
                                </div>
                            </>
                            : <span className="infomsg">{infoMsg}</span>
                        }
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

const mapStateToProps = ({ las }) => {

    return {
        ApplyLoanFailmsg: las.ApplyLoanFailmsg,

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) }

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NotEligibleSorryDialog))
