import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import { QUOTE_FINACIALS } from '../../../../common/Constants'
import { QUOTE } from '../../../../config/ServiceURLs'
import { checkEmpty, getCMOTSBaseURL } from '../../../../common/CommonMethods'
import { WidgetLoader } from '../../WidgetLoaderComponent'
import LangText from '../../../../common/lang/LangText'

function KeyResultsComponent(props) {

    const MsfFetch = useFetch()
    const [keyResultsData, setKeyResultsData] = useState()
    const [keyResultsErr, setKeyResultsErr] = useState()

    useEffect(() => {
        getKeyResults()

    }, [props.selectedType])

    function getKeyResults() {
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.addToData({
            type: (props.selectedType === QUOTE_FINACIALS.CONSOLIDATED) ? "C" : "S",
            sym: props.symbolList,
        })
        MsfFetch.placeRequest(
            getCMOTSBaseURL() + QUOTE.GET_KEY_RESULTS,
            request,
            successRespGetKeyResults,
            errorRespCBGetKeyResults
        )
    }
    function successRespGetKeyResults(response) {
        setKeyResultsData(response.data)
        props.hideWidgetLoader();
    }

    function errorRespCBGetKeyResults(error) {
        setKeyResultsErr(error.message)
        props.hideWidgetLoader();
    }
    return (
        <div className="keyResults">
            <table className="keyResults-years">
                <thead className="thead-scroller">

                    <th className="firstChild width24">
                        <LangText module="TABLE_HEADERS" name="PARTICULAR" /></th>
                    {
                        keyResultsData ?
                            keyResultsData.years.map((item) => {
                                return (
                                    <>
                                        <th className="width24">
                                            {item}
                                        </th>

                                    </>
                                )
                            })
                            : ''
                    }
                </thead>
                <tbody className="tbody-scroller">
                    {
                        keyResultsData ? keyResultsData.values.map((item,index) => {
                            return (
                                <tr key={index}>
                                    {
                                        item.map((itemArray, ind) => {
                                            return (
                                                <td key={ind} className="width24 itemArray ">
                                                    <span className={`${ind === 0 ? 'first' : ''}`}>
                                                        {checkEmpty(itemArray)} 
                                                    </span>
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        }) : <tr className="errorDiv"> {keyResultsErr} </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}
export default WidgetLoader(KeyResultsComponent);