import React, { useRef } from 'react'
import { connect } from "react-redux";

import OrderSymDialogComponent from './OrderSymDialogComponent';
import useCloseModal from '../../../../../customHooksComponents/useCloseModal';
import PendingDialogCancelComponent from './PendingDialogCancelComponent';
import PendingOrderCancel from './PendingOrderCancel';
import OrderTrailComponent from './OrderTrailComponent';
import NetPositionDialogComponent from '../../netPositionDialogs/NetPositionDetailsDialogComponent';
import ConvertDialogComponent from '../../netPositionDialogs/ConvertDialogComponent';
import ConvertResultDialogComponent from '../../netPositionDialogs/ConvertResultDialogComponent';
import ExitOrderDialogComponent from './ExitOrderDialogComponent';

import { storeOrderDialogDetails } from '../../../../../state/actions/Actions';
import { ORDER_DIALOGS } from '../../../../../common/Constants';
import SquareoffConfirmComponent from '../../netPositionDialogs/SquareoffConfirmComponent';
import SquareOffConfirmSuccessComponent from '../../netPositionDialogs/SquareOffConfirmSuccessComponent';

function OrderDialogBaseComponent(props) {

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef)

    const { orderDialog } = props
    
    function onCloseCB() {
        props.storeOrderDialogDetails({
            dialogName: null,
            symData: null,
            parentCB: null
        })
    }

    function dialogSwitch(dlgName) {
        switch (dlgName) {
            case ORDER_DIALOGS.ORDERBOOK_DETAILS:
                return <OrderSymDialogComponent
                    orderBookDetails={orderDialog}
                    onCloseCB={onCloseCB}
                    parentCB={orderDialog.parentCB} />
            case ORDER_DIALOGS.PENDING_D_CANCEL_ORDER:
                return <PendingDialogCancelComponent
                    {...props}
                    symDetails={orderDialog}
                    parentCB={orderDialog.parentCB}
                    onCloseCB={onCloseCB} />
            case ORDER_DIALOGS.CANCEL_ORDER_CONFIRM:
                return <PendingOrderCancel
                    details={orderDialog}
                    onCloseCB={onCloseCB}
                    parentCB={orderDialog.parentCB} />
            case ORDER_DIALOGS.NETPOSITION_DETAILS:
                return <NetPositionDialogComponent
                    details={orderDialog}
                    onCloseCB={onCloseCB} />
            case ORDER_DIALOGS.ORDERTRIAL_DETAILS:
                return <OrderTrailComponent
                    {...props}
                    symDetails={orderDialog}
                    onCloseCB={onCloseCB} />
            case ORDER_DIALOGS.CONVERT:
                return <ConvertDialogComponent
                    {...props}
                    details={orderDialog}
                    onCloseCB={onCloseCB} />
            case ORDER_DIALOGS.CONVERT_RESULT:
                return <ConvertResultDialogComponent
                    details={orderDialog}
                    onCloseCB={onCloseCB} />
            case ORDER_DIALOGS.NETPOSITION_SQOFF_CONFIRM:
                return <SquareoffConfirmComponent
                    details={orderDialog}
                    onCloseCB={onCloseCB} />
            case ORDER_DIALOGS.NETPOSITION_SQOFF_CONFIRM_SUCC:
                return <SquareOffConfirmSuccessComponent
                    {...props}
                    details={orderDialog}
                    onCloseCB={onCloseCB} />
            case ORDER_DIALOGS.EXIT_ORDER:
                return <ExitOrderDialogComponent
                    {...props}
                    symDetails={orderDialog}
                    onCloseCB={onCloseCB}
                    parentCB={orderDialog.parentCB} />
            default:
                return null
        }
    }

    if (!orderDialog.dialogName)
        return null
    return (
        <div className="orderDialogBase" ref={modalRef}>
            {
                dialogSwitch(orderDialog.dialogName)
            }
        </div>
    )
}

const mapStateToProps = ({ order }) => {
    return {
        orderDialog: order.dialog
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeOrderDialogDetails: (s) => { dispatch(storeOrderDialogDetails(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDialogBaseComponent);