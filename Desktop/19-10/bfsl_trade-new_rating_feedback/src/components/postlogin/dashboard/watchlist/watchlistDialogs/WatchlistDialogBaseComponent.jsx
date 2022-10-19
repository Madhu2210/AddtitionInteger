import React from 'react'
import { connect } from "react-redux";

import DeleteWatchGroupDialog from './DeleteWatchGroupDialogComponent'
import DeleteScripDialog from './DeleteScripDialogComponent';

import { storeWatchlistDialogDetails, storeSelectedWatchlistColumns } from '../../../../../state/actions/Actions';

import { WATCHLIST_DIALOGS } from '../../../../../common/Constants'

const WatchlistBaseDialogComponent = (props) => {

    const { dialog } = props

    function onClose() {
        props.storeWatchlistDialogDetails({
            dialogName: null,
            message: '',
            parentCB: null
        })
    }

    function parentCB(data) {
        dialog.parentCB && dialog.parentCB(data)
        onClose()
    }

    if (dialog.dialogName === WATCHLIST_DIALOGS.DELETE_WATCHLIST)
        return <DeleteWatchGroupDialog parentCB={parentCB} onCloseCB={onClose}
            message={dialog.message}
        />
    else if (dialog.dialogName === WATCHLIST_DIALOGS.DELETE_SELECTED_SYM)
        return <DeleteScripDialog parentCB={parentCB} onCloseCB={onClose}
            message={dialog.message}
        />
    return null
}

const mapStateToProps = ({ watchlist }) => {
    return {
        tableColumns: watchlist.tableColumns,
        dialog: watchlist.dialog,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeWatchlistDialogDetails: (s) => { dispatch(storeWatchlistDialogDetails(s)) },
        storeSelectedWatchlistColumns: (s) => { dispatch(storeSelectedWatchlistColumns(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WatchlistBaseDialogComponent);
