import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";

import SelectWatchGroupDialog from './SelectWatchGroupDialogComponent'

import { storeQuoteDialogDetails } from '../../../../../state/actions/Actions';
import { QUOTE_DIALOGS } from '../../../../../common/Constants';
import EmptyWatchGroupDialog from './EmptyWatchlistGroupComponent';

const QuoteDialogBaseComponent = (props) => {

    const { dialog } = props

    const [watchGroupList, setWatchGroupList] = useState([])

    useEffect(() => {
        let watchGroups = Object.assign([], props.watchGroups)
        if (watchGroups.length) {
            let editableGroups = watchGroups.filter(item => item.editable)
            if (editableGroups && editableGroups.length)
                setWatchGroupList(editableGroups)
        }
    }, [props.watchGroups])

    function onClose() {
        props.storeQuoteDialogDetails({
            dialogName: null,
            message: '',
            parentCB: null,
            success: null,
            newsId: null
        })
    }

    function parentCB(data) {
        dialog.parentCB && dialog.parentCB(data)
        onClose()
    }

    if (dialog.dialogName === QUOTE_DIALOGS.SELECT_WATCHGROUP)
        return <SelectWatchGroupDialog parentCB={parentCB} onCloseCB={onClose}
            watchGroups={watchGroupList} selectedTheme={props.selectedTheme}
        />
    else if (dialog.dialogName === QUOTE_DIALOGS.EMPTY_WATCHLIST)
        return <EmptyWatchGroupDialog onCloseCB={onClose}
            selectedTheme={props.selectedTheme}/>
    // else if (dialog.dialogName === QUOTE_DIALOGS.CHART)
    //     return <ChartDialog onCloseCB={onClose} />
    // else if (dialog.dialogName === QUOTE_DIALOGS.NEWS_DETAILS)
    //     return <NewsDetailsDialog onCloseCB={onClose} newsId={dialog.newsId} />
    return null
}

const mapStateToProps = ({ quote, watchlist, settings }) => {
    return {
        dialog: quote.dialog,
        watchGroups: watchlist.watchGroups,
        selectedTheme: settings.selectedTheme
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeQuoteDialogDetails: (s) => { dispatch(storeQuoteDialogDetails(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuoteDialogBaseComponent);