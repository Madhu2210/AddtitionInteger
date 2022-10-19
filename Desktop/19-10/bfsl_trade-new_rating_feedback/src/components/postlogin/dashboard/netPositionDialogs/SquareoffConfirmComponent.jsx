import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { checkEmpty, isBuyTradeAction } from '../../../../common/CommonMethods'
import { ORDER_TYPES } from '../../../../common/Constants'
import LangText from '../../../../common/lang/LangText'

import { storeOrderDialogDetails } from '../../../../state/actions/Actions'

function SquareoffConfirmComponent(props) {
    const [sqrofLeng, setSqrofLen] = useState()

    useEffect(() => {
        setSqrofLen(Object.keys(props.details.symData).length)

    }, [props.details.symData])

    let symDetails = Object.assign([], props.details.symData)

    function closeCB() {
        props.storeOrderDialogDetails({
            dialogName: null,
            symData: null,
            parentCB: null
        })
    }
    return (
        <div className="squareofConfirm">
            <div className="confirm-header">
                <LangText module="ORDERPAD" name="SQUARE_OFF_HEADER" />
            </div>
            <div className="confirm-body">
                <table className="squareoff-table">
                    <thead className="thead-scroller">
                        <tr>
                            <th className={`firstChild width25`}>
                            </th>
                            <th className="">
                                <LangText module="TABLE_HEADERS" name="TOTAL_QUANTITY" />
                            </th>
                            <th className="">
                                <LangText module="TABLE_HEADERS" name="TYPE" />
                            </th>
                            <th className="">
                                <LangText module="TABLE_HEADERS" name="PRODUCT" />
                            </th>
                            <th className="">
                                <LangText module="TABLE_HEADERS" name="VALIDTY" />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="tbody-scroller scroller_firefox">
                        {
                            symDetails.length ?
                                symDetails.map((item, index) => {
                                    return (
                                        <>
                                            <tr key={index}>
                                                <td className={`firstChild width25`}>
                                                    <div className="odr-details">
                                                        <div className={`orderaction 
                                                            ${isBuyTradeAction(item.ordAction)
                                            ? "sell-clr" :
                                            "buy-clr"}`}>
                                                            {
                                                                isBuyTradeAction(item.ordAction) ?
                                                                    ORDER_TYPES.SELL :
                                                                    ORDER_TYPES.BUY
                                                            }
                                                        </div>
                                                        <div className="symbolname">
                                                            {checkEmpty(item.dispSym)}
                                                            <span className="exc">
                                                                {checkEmpty(item.sym.exc)}
                                                            </span>
                                                        </div>

                                                    </div>

                                                </td>
                                                <td>
                                                    {Math.abs(item.netQty)}
                                                </td>
                                                <td>
                                                    <LangText module="ORDERPAD" name="MARKET" />
                                                </td>
                                                <td>
                                                    {item.prdType}
                                                </td>
                                                <td>
                                                    <LangText module="ORDERPAD" name="DAY" />
                                                </td>

                                            </tr>
                                        </>
                                    )
                                })

                                : ""
                        }

                    </tbody>

                </table>

            </div>
            <div className="confirm-footer">
                <div className="msgDiv">

                </div>
                <div className="actionDiv">
                    <button className="convert-btn"
                        onClick={() => closeCB()}>
                        <LangText module="BUTTONS" name="CANCEL" />
                    </button>
                    <button className="theme-btn"
                        onClick={() => props.details.parentCB()}>
                        <LangText module="BUTTONS" name="SQUAREOFF" /> ({sqrofLeng})
                    </button>
                </div>

            </div>

        </div>
    )
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeOrderDialogDetails: (s) => { dispatch(storeOrderDialogDetails(s)) },
    };
};
export default connect(null, mapDispatchToProps)(SquareoffConfirmComponent);