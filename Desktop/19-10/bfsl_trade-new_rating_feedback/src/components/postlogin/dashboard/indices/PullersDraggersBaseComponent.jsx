import React, { useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import PullerDraggerTableComponent from './PullerDraggerTableComponent';
import { WidgetLoader } from '../../../common/WidgetLoaderComponent';

import { INDICES } from '../../../../config/ServiceURLs';

import { getCMOTSBaseURL } from '../../../../common/CommonMethods';

function PullersDraggersBaseComponent(props) {

    const MsfFetch = useFetch()

    const [contributionErr, setContributionErr] = useState(null)
    const [positiveContributions, setPositivieContributions] = useState([])
    const [negativeContributions, setNegativeContributions] = useState([])

    useEffect(() => {
        getIndexContributions()
    }, [props.selectedSym])

    function getIndexContributions() {
        props.showWidgetLoader();
        setPositivieContributions([])
        setNegativeContributions([])
        setContributionErr(null)
        let request = new MsfRequest();
        request.addToData({
            "group": props.selectedSym.dispSym,
            "exc": props.selectedSym.exc
        })
        MsfFetch.placeRequest(
            getCMOTSBaseURL() + INDICES.INDEX_CONTRIBUTIONS,
            request,
            successRespCBgetIndexContributions,
            errorRespCBgetIndexContributions
        )
    }

    function successRespCBgetIndexContributions(response) {
        let array = response.data.contributionList;
        let postiveArray = array.filter((item) => item.contributn > 0)
        let negativeArray = array.filter((item) => item.contributn < 0)
        if (postiveArray.length)
            setPositivieContributions(postiveArray.slice(0, 5))
        if (negativeArray.length)
            setNegativeContributions(negativeArray.slice(0, 5))
        props.hideWidgetLoader();
    }

    function errorRespCBgetIndexContributions(error) {
        setContributionErr(error.message)
        props.hideWidgetLoader();
    }

    return (
        <PullerDraggerTableComponent
            contributionErr={contributionErr}
            positiveContributions={positiveContributions}
            negativeContributions={negativeContributions}
        />
    )
}
export default WidgetLoader(PullersDraggersBaseComponent);