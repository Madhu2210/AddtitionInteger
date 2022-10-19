import React from 'react'

import UpdateIncomeDecalrationAlertComponent from '../../common/UpdateIncomeDecalrationAlertComponent'

import { closeTaxDeclarationDialog } from '../../../common/Bridge';

function DeclarationInprogressAlertComponent(props) {

    function onClickOk() {
        closeTaxDeclarationDialog()
    }

    return (
        <div className="app-modalDialog2 declaration-inprogress-dialog">
            <UpdateIncomeDecalrationAlertComponent
                noActions={true}
                onClickOkCB={onClickOk}
                infoMsg={props.infoMsg}
                apiResponse={props.apiResponse}
            />
        </div>
    )
}

export default DeclarationInprogressAlertComponent;