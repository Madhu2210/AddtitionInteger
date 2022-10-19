import React from 'react'
import { connect } from "react-redux";

import { NEWS_DIALOGS } from '../../../../common/Constants';
import { storeCorpNewsDialogDetails } from '../../../../state/actions/Actions';
import NewsBuySellPopup from '../NewsBuySellPopup';

function NewsDialogBaseComponent(props) {
    // console.log('props :', props);

    function onCloseDialog() {
        props.storeCorpNewsDialogDetails({
            name: null
        })
    }

    switch (props.dialogDetails.name) {
        case NEWS_DIALOGS.DETAILS_POPUP:
            return <NewsBuySellPopup selectedRow={props.dialogDetails.selectedRow}
                corporateaction={props.dialogDetails.selectedCorpAction}
                onClose={onCloseDialog}
            />

        default:
            return null
    }
}

const mapStateToProps = ({ news }) => {
    return {
        dialogDetails: news.dialogDetails,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeCorpNewsDialogDetails: (s) => { dispatch(storeCorpNewsDialogDetails(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsDialogBaseComponent);