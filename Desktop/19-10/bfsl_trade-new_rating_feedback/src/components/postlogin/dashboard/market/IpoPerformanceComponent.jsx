import React from 'react'
import { withStreaming } from '../../../../index'

import { checkEmpty, getColorCode } from '../../../../common/CommonMethods';
import LangText from '../../../../common/lang/LangText';

function IpoPerformanceComponent(props) {

    return (
        <div className="marketMovers-baseTable">
            <table className="ipoPerformance-table">
                <thead className="thead-scroller">
                    <tr>
                        <th className="firstChild width24">
                            <span className="symbol">
                                <LangText module="TABLE_HEADERS" name="SYMBOL" />
                            </span>
                        </th>
                        <th>
                            <span className="issuePrice">
                                <LangText module="IPO" name="ISSUE_PRICE" />
                            </span>
                        </th>
                        <th>
                            <span className="issuePrice">
                                <LangText module="TABLE_HEADERS" name="LISTING_DATE" />
                            </span>
                        </th>
                        <th>
                            <span className="ipoPerfper lastChild">
                                <LangText module="IPO" name="IPO_PERFORM_PER" />
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
                                                <div className="company-name text-nowrap">
                                                    {checkEmpty(item.companyName)}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="issuePrice">{checkEmpty(item.issuePrice)}</span>
                                            </td>
                                            <td>
                                                <span className="issueDate">{checkEmpty(item.issueDate)}</span>
                                            </td>
                                            <td className={`lastChild ${getColorCode(item.perChnge)}`}>
                                                <span className="changePer">{checkEmpty(item.perChnge) + '%'}</span>
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

export default withStreaming(IpoPerformanceComponent);