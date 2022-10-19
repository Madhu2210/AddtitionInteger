import React from 'react'
import { gotoQuote } from '../../../../common/Bridge';
import { checkEmpty, isBuyTradeAction, isSellTradeAction } from '../../../../common/CommonMethods';
import { TEXT_ORIENTATION } from '../../../../common/Constants';
import LangText from '../../../../common/lang/LangText';

function MarketDealsComponent(props) {

    function gotoQuoteCB(symData) {
        if (symData.sym) {
            gotoQuote(symData, true)
        }
    }

    return (
        <div className="marketMovers-baseTable">
            <table className="marketDeals-table">
                <thead className="thead-scroller">
                    <tr>
                        <th className="firstChild width24">
                            <span className="symbol">
                                <LangText module="TABLE_HEADERS" name="SYMBOL"
                                    orientation={TEXT_ORIENTATION.UPPERCASE} />
                            </span>
                        </th>
                        <th className="clientName width30">
                            <span className="client-name">
                                <LangText module="TABLE_HEADERS" name="CLIENT_NAME" 
                                    orientation={TEXT_ORIENTATION.UPPERCASE}/>
                            </span>
                        </th>
                        <th className="action-date">
                            <span >
                                <LangText module="TABLE_HEADERS" name="DATE" orientation={TEXT_ORIENTATION.UPPERCASE} />
                            </span>
                        </th>
                        <th>
                            <span className="action">
                                <LangText module="TABLE_HEADERS" name="ACTION_TYPE" 
                                    orientation={TEXT_ORIENTATION.UPPERCASE}/>
                            </span>
                        </th>
                        <th>
                            <span className="avg-price">
                                <LangText module="TABLE_HEADERS" name="AVG_PRICE" 
                                    orientation={TEXT_ORIENTATION.UPPERCASE}/>
                            </span>
                        </th>
                        <th>
                            <span className="qty lastChild">
                                <LangText module="TABLE_HEADERS" name="QTY" orientation={TEXT_ORIENTATION.UPPERCASE}/>
                            </span>
                        </th>

                    </tr>
                </thead>
                <tbody className="tbody-scroller">
                    {
                        (props.marketList && props.marketList.length) ?
                            props.marketList.map((item, index) => {
                                return (
                                    <>
                                        <tr key={index}>
                                            <td className="firstChild width24">
                                                <div className="symName-column">
                                                    <span className={`baseSym text-nowrap 
                                                    ${item.sym ? 'quote-click' : ''}`}
                                                    title={item.dispSym}
                                                    onClick={item.sym ? () => gotoQuoteCB(item) : null}
                                                    >
                                                        {checkEmpty(item.scripNme)}
                                                    </span>

                                                </div>
                                            </td >
                                            <td className="clientName text-nowrap width30" title={item.clientNme}>
                                                <span className="client-name">{checkEmpty(item.clientNme)}</span>
                                            </td>
                                            <td className="action-date">
                                                <span className="date">{checkEmpty(item.date)}</span>
                                            </td>
                                            <td>
                                                <span className={`action ${isBuyTradeAction(item.buySell) ?
                                                    "buy-clr" : isSellTradeAction(item.buySell)
                                                        ? "sell-clr" : "text-color"}`}>

                                                    {checkEmpty(item.buySell)}</span>
                                            </td>
                                            <td>
                                                <span className="avgPrice">{checkEmpty(item.avgPrce)}</span>
                                            </td>
                                            <td className="lastChild">
                                                <span className="qty ">{checkEmpty(item.qtyShares)}</span>
                                            </td>
                                        </tr>
                                    </>
                                )

                            })
                            :
                            <tr className="errorRow">
                                <td className="colspan">
                                    {props.marketListErr}
                                </td>
                            </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export default MarketDealsComponent;