import React, { useEffect, useRef } from 'react'
import { connect } from "react-redux";

import { storeToastMsgProps } from '../../state/actions/Actions';
import { SET_TIMEOUT_INTERVAL } from '../../common/Constants';

function ToastMsgComponent(props) {

    const { toastMsg } = props

    const toastTimeout = useRef(null)

    useEffect(() => {
        if (toastMsg.show) {
            clearTimeout(toastTimeout.current)
            toastTimeout.current = setTimeout(() => {
                props.storeToastMsgProps({
                    show: false,
                    message: null,
                    error: false
                })
            }, SET_TIMEOUT_INTERVAL.HIDE_TOAST_INTERVAL)
        }
    }, [toastMsg])

    return (
        <div className={`toastMsgDiv flex-center ${toastMsg.error ? 'error' : ''} ${toastMsg.show ? 'show' : ''}`}>
            <span className={`message show`}>{toastMsg.message}</span>
        </div>
    )
}

const mapStateToProps = ({ toastMsg }) => {
    return {
        toastMsg: toastMsg
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeToastMsgProps: (s) => { dispatch(storeToastMsgProps(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ToastMsgComponent);