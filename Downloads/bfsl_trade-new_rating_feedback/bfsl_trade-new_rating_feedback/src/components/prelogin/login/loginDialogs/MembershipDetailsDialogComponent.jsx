import React, { useState, useRef, useEffect } from 'react'
import { connect } from "react-redux";

import useCloseModal from '../../../../customHooksComponents/useCloseModal';

import { getItemFromSessionStorage } from '../../../../common/LocalStorage';
import { LOCAL_STORAGE } from '../../../../common/Constants';
import LangText from '../../../../common/lang/LangText';

const MembershipDetailsDialogComponent = (props) => {

    const [memberShipDetails, setMemberShipDetails] = useState({})

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef)

    useEffect(() => {
        if (props.configStatus && props.configStatus.length) {
            let companyRegDetails = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.COMPANY_REG_INFO))
            setMemberShipDetails(companyRegDetails)
        }
    }, [props.configStatus])

    return (
        <div className="app-modalDialog membership-dialog">
            <div className="window" ref={modalRef}>
                <div className="title flex-center">
                    <span className="title-name">
                        {memberShipDetails.name}
                    </span>
                    {/* <CloseIcon onClick={props.onCloseCB} /> */}
                </div>
                <div className="content">
                    <div className="data_row">
                        <div className="data-span leftAlign">
                            <div className="label">
                                <LangText name="NSE_CASH_FO"/>
                                {/* {'NSE Cash/F&O'} */}
                            </div>
                            <div className="data">
                                <LangText name="MEM_ID"/> : {memberShipDetails.NSE}
                            </div>
                        </div>
                        <div className="data-span centerAlign">
                            <div className="label">
                                <LangText name="BSE_CASH_FO"/>
                                {/* {'BSE Cash/F&O'} */}
                            </div>
                            <div className="data">
                                <LangText name="MEM_ID"/> : {memberShipDetails.BSE}
                            </div>
                        </div>
                        <div className="data-span rightAlign">
                            <div className="label">
                                {memberShipDetails.DPRegNo}
                            </div>
                            <div className="data">
                                <LangText name="DP_REG_NO"/>
                            </div>
                        </div>
                    </div>
                    <div className="data_row">
                        <div className="data-span leftAlign">
                            <div className="label">
                                {memberShipDetails.CDSLDPNo}
                            </div>
                            <div className="data">
                                <LangText name="CDSL_DP_NO"/>
                            </div>
                        </div>
                        <div className="data-span centerAlign">
                            <div className="label">
                                {memberShipDetails.NDSLDPNo}
                            </div>
                            <div className="data">
                                <LangText name="NDSL_DP_NO"/>
                            </div>
                        </div>
                        <div className="data-span rightAlign">
                            <div className="label">
                                {memberShipDetails.AMFIRegNo}
                            </div>
                            <div className="data">
                                <LangText name="AMFI_REG_NO"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ config }) => {
    return {
        configStatus: config.configStatus
    }
}

export default connect(mapStateToProps, null)(MembershipDetailsDialogComponent);