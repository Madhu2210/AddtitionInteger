import React, { useRef, useEffect, useState } from 'react'
import { useFetch, MsfRequest } from '../../../../index'

import useCloseModal from '../../../../customHooksComponents/useCloseModal';
import DialogLoader from '../../../common/ModalDialogLoaderComponent';
import LangText from '../../../../common/lang/LangText';

import { QUOTE } from '../../../../config/ServiceURLs'
import { getNewsBaseURL } from '../../../../common/CommonMethods'
import { CloseIcon } from '../../../common/FontIcons';

const NewsDialogComponent = (props) => {

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef)

    const MsfFetch = useFetch()

    const [newsDetails, setNewsDetails] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    const [showLoader, setShowLoader] = useState(false)

    useEffect(() => {
        if (props.newsId) {
            getNewsDetails(props.newsId)
        } else {
            setNewsDetails([])
        }
    }, [props.newsId])

    function getNewsDetails(id) {
        setShowLoader(true)
        let request = new MsfRequest();
        setNewsDetails([])
        setErrorMsg(null)
        request.addToData({
            storyID: id
        })
        MsfFetch.placeRequest(
            getNewsBaseURL() + QUOTE.NEWS_INFO,
            request,
            successRespGetNewsDetails,
            errorRespCBGetNewsDetails
        )
    }

    function successRespGetNewsDetails(response) {
        setNewsDetails(response.data.story)
        setErrorMsg(null)
        setShowLoader(false)
    }

    function errorRespCBGetNewsDetails(error) {
        setNewsDetails([])
        setErrorMsg(error.message)
        setShowLoader(false)
    }

    return (
        <div className="app-modalDialog2 newsDialog-dialog">
            <div className="window" ref={modalRef}>
                <div className="title flex-center">
                    <span className="title-name"><LangText module="QUOTE" name="NEWS_DETAILS" /></span>
                    <CloseIcon onClick={props.onCloseCB} />
                </div>
                <div className="content scrollArea scroller_firefox">
                    <DialogLoader show={showLoader} />
                    {
                        (newsDetails && newsDetails.length) ?
                            newsDetails.map((item, index) => {
                                return (
                                    <div key = {index} id={`renderDiv${index}`}></div>
                                )
                            })
                            :
                            null
                    }
                    {
                        (newsDetails && newsDetails.length) ?
                            newsDetails.map((item, index) => {
                                if (document.getElementById('renderDiv' + index))
                                    document.getElementById('renderDiv' + index).innerHTML = item
                            })
                            :
                            <div className="errorDiv">
                                {errorMsg}
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default NewsDialogComponent;