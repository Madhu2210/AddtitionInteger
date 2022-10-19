/* eslint-disable */
import React, { useRef, useEffect } from 'react';
import { connect } from "react-redux";

import useCloseModal from '../../customHooksComponents/useCloseModal';
import LangText from '../../common/lang/LangText'

import { showAppDialog } from '../../state/actions/Actions'

const AppDialogComponent = (props) => {
    const closeRef = useRef(null)
    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose)

    useEffect(() => {
        if (props.appDialog.show){
            window.introJs().exit();
            closeRef.current.focus()
        }
    }, [props.appDialog.show])

    const onButtonClick = (closeCallBack) => {
        closeCallBack && closeCallBack();
        props.showAppDialog({ show: false })
    }

    function onClose() {
        props.appDialog.closeCB && props.appDialog.closeCB()
        props.showAppDialog({ show: false })
    }
    

    const { appDialog } = props
    if (!appDialog.show) return null;
    return (
        <div className="app-modalDialog2 alertModal" id="modal-dialog"
            test_id="alertmodal"
            test_status_id={appDialog.success ? 'success' : 'error'}
        >
            <div className={`window ${appDialog.baseParent? "emandate-reject" :""}`} 
                ref={!props.appDialog.removeOutsideClose ? modalRef : null}>
                <div className="title">
                    <h6 className="modalTitle">{appDialog.title ? appDialog.title : 
                        <LangText module="OTHERS" name="APP_TITLE" />}</h6>
                </div>
                <div className={!appDialog.logoutGuest ? "content" : "guest-logout-content"}>
                    {appDialog.message}
                </div>
                {appDialog.logoutGuest ? 
                    <div className="guest-footer">
                        {
                            appDialog.guestBtns && appDialog.guestBtns.map((data, index) => {
                                return (
                                    <button test_id={data.test_id} key={index} 
                                        className={`button-flat ${data.className}`}
                                        tabIndex={index + 1}
                                        onClick={() => { onButtonClick(data.action) }}
                                    >
                                        {data.name}
                                    </button>
                                )
                            })
                        }
                    </div>
                    :
                    null
                }
                <div className="footer">
                    <button
                        className={(appDialog.buttons && appDialog.buttons.length) ? 'negativeBtn' : 'positiveBtn'}
                        ref={closeRef}
                        onClick={onClose}
                    >
                        {appDialog.defaultBtnName ? appDialog.defaultBtnName : 
                            <LangText module="BUTTONS" name="OK" />}
                    </button>
                    {
                        appDialog.buttons && appDialog.buttons.map((data, index) => {
                            return (
                                <button test_id={data.test_id} key={index} 
                                    className={`button-flat ${data.className}`}
                                    tabIndex={index + 1}
                                    onClick={() => { onButtonClick(data.action) }}
                                >
                                    {data.name}
                                </button>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = ({ appDialog }) => {
    return {
        appDialog
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppDialogComponent);