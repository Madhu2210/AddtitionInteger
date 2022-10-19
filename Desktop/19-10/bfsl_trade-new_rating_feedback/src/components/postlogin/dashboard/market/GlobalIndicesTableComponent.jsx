import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { withStreaming } from '../../../../index'

import LangText from '../../../../common/lang/LangText';

import { showAppDialog, storeQuoteDialogDetails } from '../../../../state/actions/Actions';

import {  checkEmpty, getColorCode } from '../../../../common/CommonMethods';
// import {  ClockIcon } from '../../../common/FontIcons';

function GlobalIndicesTableComponent(props) {

    const [resultArray, setResultArray] = useState([])

    useEffect(() => {
        if (props.marketList) {
            setResultArray(props.marketList)
        }
    }, [props.marketList])

    return (
        <div className="marketMovers-baseTable">
            <table className="globalindices-table">
                <thead className="thead-scroller">
                    <tr>
                        <th className="firstChild width24">
                            <span className="symbol">
                                <LangText module="TABLE_HEADERS" name="INDEX" />
                            </span>
                        </th>
                        <th>
                            <span className="change-per">
                                <LangText module="TABLE_HEADERS" name="CHG_AND_PER" />
                            </span>
                        </th>
                        <th>
                            <span className="ltp">
                                <LangText module="TABLE_HEADERS" name="LTP" />
                            </span>
                        </th>
                        {/* <th>
                            <span className="value">
                                <LangText module="TABLE_HEADERS" name="DATE" />
                            </span>
                        </th> */}
                    </tr>
                </thead>
                <tbody className="tbody-scroller">
                    {
                        (resultArray && resultArray.length) ?
                            resultArray.map((item, index) => {
                                return (
                                    <>
                                        <tr key={index}>
                                            <td className="firstChild width24">
                                                <div>
                                                    <span  className="indexname">
                                                        {item.indiceNme}
                                                        ({item.country})
                                                    </span>
                                                </div>
                                                <div className="date-global">
                                                    <span className="last-update"> 
                                                        <LangText 
                                                            module="GLOBAL_INDICES_TABLE" 
                                                            name="LAST_UPDATE" /> : </span>
                                                    <span className="index-date">
                                                        {checkEmpty(item.date)}</span>
                                                </div>
                                            </td>
                                            <td className={`changePer ${getColorCode(item.chg)}`}>
                                                <span>{checkEmpty(item.chg)}({checkEmpty(item.pchg)}%)</span>
                                            </td>
                                            <td>
                                                <span>{checkEmpty(item.close)}</span>
                                            </td>
                                        
                                            {/* <td  className="clock-date">
                                                <div>
                                                    <ClockIcon className="clock"/> 
                                                </div>  
                                                
                                            </td> */}
                                           
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

const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeQuoteDialogDetails: (s) => { dispatch(storeQuoteDialogDetails(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withStreaming(GlobalIndicesTableComponent));
