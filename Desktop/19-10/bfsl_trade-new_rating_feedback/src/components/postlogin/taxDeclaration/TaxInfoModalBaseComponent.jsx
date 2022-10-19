import React from 'react'
import { connect } from "react-redux";

import AttentionDialog from './AttentionDialogComponent';
import DeclarationInprogressAlertComponent from './DeclarationInprogressAlertComponent';

import { TAX_DECLARATION_DIALOGS } from '../../../common/Constants';

function TaxInfoModalBaseComponent(props) {

    if (!props.taxDeclaration.dialogName)
        return null

    switch (props.taxDeclaration.dialogName) {
        case TAX_DECLARATION_DIALOGS.ATTENTION:
            return <AttentionDialog />
        case TAX_DECLARATION_DIALOGS.INPROGRESS_ALERT:
            return <DeclarationInprogressAlertComponent
                infoMsg={props.taxDeclaration.infoMsg}
                apiResponse={props.taxDeclaration.apiResponse}
            />
        default:
            return null
    }
}

const mapStateToProps = ({ profileDialog }) => {
    return {
        taxDeclaration: profileDialog.taxDeclaration
    }
}

export default connect(mapStateToProps, null)(TaxInfoModalBaseComponent);