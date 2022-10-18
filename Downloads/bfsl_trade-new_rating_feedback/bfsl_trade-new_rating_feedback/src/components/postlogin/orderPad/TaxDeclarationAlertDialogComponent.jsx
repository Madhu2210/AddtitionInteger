import React from 'react'
import { connect } from "react-redux";
import { TAX_DECLARATION_DIALOGS, TAX_DECLARE_BLOCK_SCREENS } from '../../../common/Constants';

import UpdateIncomeDecalrationAlertComponent from '../../common/UpdateIncomeDecalrationAlertComponent';

function TaxDeclarationAlertDialogComponent(props) {
    // console.log('tax',props)
    function onClickLater() {
        let screenName = ""
        if (props.taxDeclaration.dialogName === TAX_DECLARATION_DIALOGS.ORDERPAD_ALERT)
            screenName = TAX_DECLARE_BLOCK_SCREENS.ORDERPAD
        else if (props.taxDeclaration.dialogName === TAX_DECLARATION_DIALOGS.ORDERPAD_RESULT_ALERT)
            screenName = TAX_DECLARE_BLOCK_SCREENS.ORDER_RESULT

        props.taxDeclaration.closeCB && props.taxDeclaration.closeCB(screenName)
    }

    if (
        props.taxDeclaration.dialogName === TAX_DECLARATION_DIALOGS.ORDERPAD_ALERT
        ||
        props.taxDeclaration.dialogName === TAX_DECLARATION_DIALOGS.ORDERPAD_RESULT_ALERT
        ||
        props.taxDeclaration.dialogName === TAX_DECLARATION_DIALOGS.IDEAS_ALERT
    )
        return (
            <div className="orderDialogBase taxDelare-dialog">
                <UpdateIncomeDecalrationAlertComponent closeCB={onClickLater}
                    onClickUpdateCB={props.closeOrder}
                    onClickOkCB={props.closeOrder}
                    noActions={props.taxDeclaration.noActions}
                    infoMsg={props.taxDeclaration.infoMsg}
                />
            </div>
        )
        
    return null
}

const mapStateToProps = ({ profileDialog }) => {
    return {
        taxDeclaration: profileDialog.taxDeclaration,
    }
}

export default connect(mapStateToProps, null)(TaxDeclarationAlertDialogComponent);