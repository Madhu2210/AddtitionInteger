import React, { useState } from 'react'
import { connect } from "react-redux";

import HeaderTabBase from './HeaderTabComponent'
import TableBaseComponent from './TableBaseComponent'
import OrderPadDialogBase from '../../orderPad/OrderPadDialogBaseComponent'
import QuoteBaseComponent from '../quote/QuoteBaseComponent';

import { storeOrderstatusFilterVal } from '../../../../state/actions/Actions';

import { DASHBOARD_WIDGET_MODE } from '../../../../common/Constants'
import AlertBaseComponent from '../alerts/AlertBaseComponent';

function OrderBaseComponent(props) {

    const [list, setList] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    const [selectedTab, setSelectedTab] = useState(null)
    const [sortColumnList, setSortColumnList] = useState([])

    function getResponseList(lists, errorMessage, sortColumns) {
        setList(lists)
        setErrorMsg(errorMessage)
        setSortColumnList(sortColumns)
    }

    function getSelectedTab(tab) {
        setSelectedTab(tab)
    }

    return (
        <div className={`orderBase ${props.selectedWidgetMode} 
        ${props.orderPadDialog.dialogName ? 'quote_view tradeView' : ''}`}>
            <div className="orderTableBase-div">
                <HeaderTabBase
                    getResponseList={getResponseList}
                    getSelectedTabCB={getSelectedTab} />
                {
                    ((props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.DEFAULT ||
                        props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.ORDER_WITH_QUOTE ||
                        props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.ORDER_VIEW)
                        &&
                        !props.orderPadDialog.dialogName
                    ) ?
                        <TableBaseComponent
                            selectedTab={selectedTab}
                            list={list} errorMsg={errorMsg}
                            sortColumnList={sortColumnList} />
                        : null
                }
            </div>

            {
                !props.orderPadDialog.dialogName
                    ?
                    <>
                        {
                            (props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.INDICES_VIEW)
                                ?
                                <QuoteBaseComponent
                                    key="indicesviewcomponent"
                                    widgetMode={props.selectedWidgetMode}
                                    selectedSym={props.selectedSym_Indices}
                                />
                                :
                                <QuoteBaseComponent
                                    key="quoteviewcomponent"
                                    widgetMode={props.selectedWidgetMode}
                                    selectedSym={props.selectedSym_Quote}
                                />
                        }
                    </>
                    : null
            }
            <OrderPadDialogBase />
            <AlertBaseComponent />
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeOrderstatusFilterVal: (s) => { dispatch(storeOrderstatusFilterVal(s)) }
    };
};

const mapStateToProps = ({ dashboard, order, orderPad, quote, indicesDetails }) => {
    return {
        selectedWidgetMode: dashboard.selectedWidgetMode,
        orderStatusFilterVal: order.orderStatusfilterVal,
        orderPadDialog: orderPad.dialog,
        selectedSym_Quote: quote.selectedSym,
        selectedSym_Indices: indicesDetails.selectedSymbol
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderBaseComponent);