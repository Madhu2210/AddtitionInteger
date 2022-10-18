import React, { useState, useEffect, useRef } from 'react'
import { connect } from "react-redux";

import DialogLoader from '../common/ModalDialogLoaderComponent';

import { storeAddFundDialogDetails } from '../../state/actions/Actions';
import { CloseIcon } from './FontIcons';

const AddFundsDialogComponent = props => {

    const [showLoader, setShowLoader] = useState(false)

    const postForm = useRef(null)

    useEffect(() => {
        if (props.addFundsDialog.show) {
            setShowLoader(true)
            if (postForm.current) {
                postForm.current.submit()
            }
        }
    }, [props.addFundsDialog.show])

    function onClickCloseIframe() {
        props.storeAddFundDialogDetails({
            show: false,
            URL_data: null
        })
    }

    // function onLoadIframe(e) {
    //     console.log('eee', e.target.src)
    //     setShowLoader(false)
    // }

    if (!props.addFundsDialog.show)
        return null

    return (
        <div className="app-modalDialog2 addFund_dialog">
            <div className="window">
                <DialogLoader show={showLoader} />
                <div className="closeIcon-div flex-center" onClick={onClickCloseIframe} id="closeBtn">
                    <CloseIcon />
                </div>
                <form action={props.addFundsDialog.URL_data.url} 
                    method={props.addFundsDialog.URL_data.type} target="__blank" id="myform" ref={postForm}>
                    {
                        (props.addFundsDialog.URL_data && props.addFundsDialog.URL_data.params) ?
                            props.addFundsDialog.URL_data.params.map((item,index) => {
                                return <input key={index} type="hidden" name={item.key} value={item.value} />
                            })
                            : null
                    }
                </form>
                {/* <iframe src={props.addFundsDialog.URL_data.url} name="paymentIframe" id="paymentIframe" frameborder="0" onLoad={(e) => onLoadIframe(e)}></iframe> */}
            </div>
        </div>
    )
}

const mapStateToProps = ({ fundTransfer }) => {
    return {
        addFundsDialog: fundTransfer.addFundsDialog
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAddFundDialogDetails: (s) => { dispatch(storeAddFundDialogDetails(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFundsDialogComponent);