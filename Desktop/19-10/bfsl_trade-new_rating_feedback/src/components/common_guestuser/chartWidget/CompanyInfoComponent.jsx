import React, { useState, useEffect, useRef } from 'react'
import { useFetch, MsfRequest } from '../../../index'

import LangText from '../../../common/lang/LangText'
import { WidgetLoader } from '../../common/WidgetLoaderComponent'
import ShareHoldings from './ShareHoldingComponent'

import { getCMOTSBaseURL } from '../../../common/CommonMethods'
import { QUOTE } from '../../../config/ServiceURLs'

const CompanyInfoComponent = (props) => {

    const MsfFetch = useFetch()

    const [companyInfo, setCompanyInfo] = useState(null)
    // const [infoKeys, setInfoKeys] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    const [companyAddress, setCompanyAddress] = useState()
    const [compErr, setCompErr] = useState()

    let isPendingRequest = useRef(false)

    useEffect(() => {
        if (props.selectedSym) {
            let symbols = [{
                // dispSym: props.selectedSym.dispSym,
                sym: props.selectedSym
            }]
            getCompanyInfo(symbols)
            getCompanyAddress()
        } else {
            //  setCompanyInfo(null)
            // setInfoKeys([])
        }
    }, [props.selectedSym])

    function getCompanyInfo() {
        if (!isPendingRequest.current) {
            isPendingRequest.current = true
            props.showWidgetLoader();
            let request = new MsfRequest();
            // setInfoKeys([])
            setErrorMsg(null)
            request.addToData({
                sym: props.selectedSym,
                appid: null
            })
            // request.setEncrypt(false)
            MsfFetch.placeRequest(
                getCMOTSBaseURL() + QUOTE.GET_COMPANY_INFO,
                request,
                successRespGetCompanyInfo,
                errorRespCBGetCompanyInfo
            )
        }
    }

    function successRespGetCompanyInfo(response) {
        isPendingRequest.current = false
        setCompanyInfo(response.data)
        setErrorMsg(null)
        props.hideWidgetLoader();
    }

    function errorRespCBGetCompanyInfo(error) {
        isPendingRequest.current = false
        setCompanyInfo(null)
        // setInfoKeys([])
        setErrorMsg(error.message)
        props.hideWidgetLoader();
    }

    function getCompanyAddress() {
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.addToData({
            sym: props.selectedSym,
            appid: null
        })
        // request.setEncrypt(false)
        MsfFetch.placeRequest(
            getCMOTSBaseURL() + QUOTE.GET_COMPANY_ADDRESS,
            request,
            successRespGetCompanyAddress,
            errorRespCBGetCompanyAddress
        )
    }

    function successRespGetCompanyAddress(response) {
        setCompanyAddress(response.data)
        props.hideWidgetLoader();
    }

    function errorRespCBGetCompanyAddress(error) {
        setCompErr(error.message)
        props.hideWidgetLoader();
    }

    return (
        <>
            <div className="companyInfo-base">
                {
                    companyInfo ?
                        <div className="comp-profile">

                            <div className="prof-title">
                                {companyInfo.compName}
                            </div>
                            <div className="prof-content">
                                {companyInfo.desc}
                            </div>
                            <div className="info-footer">
                                <div className="shareHolding-pattern">
                                    <div className="title">
                                        <LangText module="QUOTE" name="SHARE_HOLDING_PATTERN" />
                                    </div>
                                    <ShareHoldings selectedSym={props.selectedSym} />
                                </div>
                                {
                                    companyAddress ?

                                        <div className="comp-addr">
                                            <div className="title">
                                                <LangText module="QUOTE" name="CONTACT_INFO" />
                                            </div>
                                            <div className="details">
                                                <div className="det">
                                                    <span className="data">
                                                        <LangText module="QUOTE" name="ADDR" />
                                                    </span>
                                                    <span className="seperator">:</span>
                                                    <span className="val"> {companyAddress.regDist},
                                                        {companyAddress.regPin} </span>
                                                </div>
                                                <div className="det">
                                                    <span className="data">
                                                        <LangText module="QUOTE" name="PHONE" />
                                                    </span>
                                                    <span className="seperator">:</span>
                                                    <span className="val"> {companyAddress.tel1}</span>
                                                </div>
                                                <div className="det">
                                                    <span className="data">
                                                        <LangText module="QUOTE" name="FAX" />
                                                    </span>
                                                    <span className="seperator">:</span>
                                                    <span className="val"> {companyAddress.fax1}</span>
                                                </div>
                                                <div className="det">
                                                    <span className="data">
                                                        <LangText module="QUOTE" name="WEBSITE" />
                                                    </span>
                                                    <span className="seperator">:</span>
                                                    <span className="val link">
                                                        <a href={companyAddress.internet} 
                                                            target="_blank"  rel="noopener noreferrer"
                                                        >
                                                            {companyAddress.internet}
                                                        </a></span>
                                                </div>
                                            </div>
                                        </div>
                                        : <div className="error-msg">
                                            {compErr}
                                        </div>
                                }

                            </div>
                        </div>
                        :
                        <div className="error-msg">
                            {errorMsg}
                        </div>
                }
            </div>
        </>
    )

}

export default WidgetLoader(CompanyInfoComponent);