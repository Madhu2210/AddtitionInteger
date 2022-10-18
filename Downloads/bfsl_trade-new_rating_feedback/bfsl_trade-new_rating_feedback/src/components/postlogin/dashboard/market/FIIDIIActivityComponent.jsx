import React from 'react'

import { checkEmpty, getColorCode } from '../../../../common/CommonMethods';
import { TEXT_ORIENTATION } from '../../../../common/Constants';
import LangText from '../../../../common/lang/LangText';

function FIIDIIActivityComponent(props) {
    return (
        <div className="marketMovers-baseTable">
            <table className="marketfiidii-table">
                <thead className="thead-scroller">
                    <tr>
                        <th className="firstChild">
                            <span className="">
                                <LangText module="TABLE_HEADERS" name="DATE" orientation={TEXT_ORIENTATION.UPPERCASE} />
                            </span>
                        </th>
                        <th className="">
                            <span className="fiicash">
                                <LangText module="TABLE_HEADERS" name="FII_CASH" />
                            </span>
                        </th>
                        <th className="">
                            <span className="diicash">
                                <LangText module="TABLE_HEADERS" name="DII_CASH" />
                            </span>
                        </th>
                        <th className="">
                            <span className="fiifutures">
                                <LangText module="TABLE_HEADERS" name="FII_FUTURES" />
                            </span>
                        </th>
                        <th className="">
                            <span className="fiioptionse  ">
                                <LangText module="TABLE_HEADERS" name="FII_OPTIONS" />
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
                                            <td className={`firstChild ${getColorCode(item.date)}`}>
                                                <span className="date">{checkEmpty(item.date)}</span>
                                            </td>
                                            <td className={`${getColorCode(item.fiiCash)}`}>
                                                <span className="fiicash">{checkEmpty(item.fiiCash)}</span>
                                            </td>
                                            <td className={`${getColorCode(item.diiCash)}`}>
                                                <span className="diicash">{checkEmpty(item.diiCash)}</span>
                                            </td>
                                            <td className={`${getColorCode(item.fiiFuture)}`}>
                                                <span className="fiifuture">{checkEmpty(item.fiiFuture)}</span>
                                            </td>
                                            <td className={`lastChild ${getColorCode(item.fiiOption)}`}>
                                                <span className="fiioption">{checkEmpty(item.fiiOption)}</span>
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
export default FIIDIIActivityComponent;