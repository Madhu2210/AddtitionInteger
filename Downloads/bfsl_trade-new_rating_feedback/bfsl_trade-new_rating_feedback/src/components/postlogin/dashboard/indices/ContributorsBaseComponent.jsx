import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { useFetch, MsfRequest } from '../../../../index'

import LangText from '../../../../common/lang/LangText';
import { WidgetLoader } from '../../../common/WidgetLoaderComponent';
import ContributorsDraggerTableComponent from './ContributorsDraggerTableComponent';
import ContributorsPullerTableComponent from './ContributorsPullerTableComponent';

import { INDICES } from '../../../../config/ServiceURLs';

import { getCMOTSBaseURL } from '../../../../common/CommonMethods';

function ContributorsBaseComponent(props) {

    const MsfFetch = useFetch()

    const [pullers, setPullers] = useState([])
    const [draggers, setDraggers] = useState([])
    const [RespErr, setRespErr] = useState(null)
    const [hasData, setHasData] = useState(false)

    useEffect(() => {
        getIndicesContributtors()
    }, [props.selectedSymbol])

    function getIndicesContributtors() {
        setHasData(false)
        setPullers([])
        setDraggers([])
        setRespErr(null)
        let request = new MsfRequest();
        props.showWidgetLoader();
        request.addToData({
            "group": props.selectedSymbol.baseSym,
            "exc": props.selectedSymbol.exc
        })
        MsfFetch.placeRequest(
            getCMOTSBaseURL() + INDICES.INDEX_CONTRIBUTIONS,
            request,
            successRespCBgetIndexContributtors,
            errorRespCBgetIndexContributtors
        )
    }

    function successRespCBgetIndexContributtors(response) {
        if (response.data && response.data.contributionList.length) {
            setHasData(true)
            let array = response.data.contributionList;
            let postiveArray = array.filter((item) => item.contributn > 0)
            let negativeArray = array.filter((item) => item.contributn < 0)
            setPullers(postiveArray)
            setDraggers(negativeArray)
        }
        props.hideWidgetLoader();
    }

    function errorRespCBgetIndexContributtors(error) {
        setRespErr(error.message)
        props.hideWidgetLoader();
    }

    return (
        <div className="contributors">
            <div className="contri-title">
                <span className="iPullers">
                    <LangText module="TABLE_HEADERS" name="INDEX_PULLERS" />
                    {
                        pullers.length ?
                            <span className="p-total">
                                {pullers.length}
                            </span>
                            : null
                    }
                </span>
                <span className="iDraggers">
                    <LangText module="TABLE_HEADERS" name="INDEX_DRAGGERS" />
                    {
                        draggers.length ?
                            <span className="d-total">
                                {draggers.length}
                            </span>
                            : null
                    }
                </span>
            </div>
            <div className="contri-content">
                {
                    hasData ?
                        <>
                            <ContributorsPullerTableComponent
                                pullers={pullers}
                            />
                            <ContributorsDraggerTableComponent
                                draggers={draggers}
                            />
                        </>
                        : <div className="errorMsg flex-center">
                            {RespErr}
                        </div>
                }

            </div>
        </div>
    )
}

const mapStateToProps = ({ indicesDetails }) => {
    return {
        selectedSymbol: indicesDetails.selectedSymbol
    }
}

export default connect(mapStateToProps, null)(WidgetLoader(ContributorsBaseComponent));