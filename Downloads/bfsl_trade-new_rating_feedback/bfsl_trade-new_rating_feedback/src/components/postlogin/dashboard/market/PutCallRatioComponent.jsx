import React from 'react'
import { checkEmpty } from '../../../../common/CommonMethods'
import LangText from '../../../../common/lang/LangText'

function PutCallRatioComponent(props) {

    return (
        <div className="marketMovers-baseTable">
            <table className="putcall-table">
                <thead className="thead-scroller">
                    <tr>
                        <th className="firstChild blankHeader" colSpan="1"></th>
                        <th className="columnsLeft pcr" style={{ textAlign: 'center' }} colSpan="3">
                            <LangText module="TABLE_HEADERS" name="PCR_OI" /></th>

                        <th className="columnsRight pcr" style={{ textAlign: 'center' }} colSpan="3">
                            <LangText module="TABLE_HEADERS" name="PCR_VOL" /></th>
                    </tr>
                    <tr className="table-header">
                        <th className="firstChild width24 symbolHeader">
                            <span className="symbol">
                                <LangText module="TABLE_HEADERS" name="SYMBOL" />
                            </span>
                        </th>
                        <th className="columnsLeft" ><LangText module="TABLE_HEADERS" name="CALL_RATIO" /></th>
                        <th className="columnsLeft"><LangText module="TABLE_HEADERS" name="PUT" /></th>
                        <th className="columnsLeft oiRatio-left"><LangText module="TABLE_HEADERS" name="RATIO" /></th>

                        <th className="columnsRight"><LangText module="TABLE_HEADERS" name="CALL_RATIO" /></th>
                        <th className="columnsRight"><LangText module="TABLE_HEADERS" name="PUT" /></th>
                        <th className="columnsRight volRatio-right">
                            <LangText module="TABLE_HEADERS" name="RATIO" /></th>

                    </tr>
                </thead>
                <tbody className="tbody-scroller">
                    {
                        (props.marketList && props.marketList.length) ?
                            props.marketList.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="firstChild">
                                            <div className="symName-column">
                                                {checkEmpty(item.symbol)}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="item">{checkEmpty(item.oiCall)}</span>
                                        </td>
                                        <td>
                                            <span className="item">{checkEmpty(item.oiPut)}</span>
                                        </td>
                                        <td className="oiRatio-left">
                                            <span className="item">{checkEmpty(item.oiRatio)}</span>
                                        </td>

                                        <td>
                                            <span className="item">{checkEmpty(item.volCall)}</span>
                                        </td>
                                        <td>
                                            <span className="item">{checkEmpty(item.volPut)}</span>
                                        </td>
                                        <td className="volRatio-right">
                                            <span className="item">{checkEmpty(item.volRatio)}</span>
                                        </td>
                                    </tr>
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

export default PutCallRatioComponent