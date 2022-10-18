import React from 'react'
import { connect } from 'react-redux'
import LangText from '../../../../common/lang/LangText'

import { moveToOrderMenu } from '../../../../state/actions/Actions'

function SquareOffConfirmSuccessComponent(props) {

    const { details } = props
    const { resultData } = details

    function onClickDone() {
        props.onCloseCB && props.onCloseCB()
        props.moveToOrderMenu({
            showOrderMenu: true
        })
    }

    return (
        <div className={`squareoffConfirm confirm-result-dialog ${resultData.success ? 'success' : ''}`}>
            <div className={`iconDiv`}>
                {
                    resultData.success ?
                        <img src="assets/images/dashboard/success_btn.svg" alt="" />
                        :
                        <img src="assets/images/dashboard/failed_btn.svg" alt="" />
                }
            </div>
            <div className={`statusDiv`}>
                {
                    resultData.success ? "Success" : "Error"
                }
            </div>
            <div className="messageDiv text-nowrap">
                {
                    resultData.message
                }
            </div>
            <button className="okay-btn" onClick={onClickDone}> <LangText module="BUTTONS" name="DONE" /></button>
        </div>
    )
}
const mapDispatchToProps = (dispatch) => {
    return {
        moveToOrderMenu: (s) => { dispatch(moveToOrderMenu(s)) }
    }
}

export default connect(null, mapDispatchToProps)(SquareOffConfirmSuccessComponent);