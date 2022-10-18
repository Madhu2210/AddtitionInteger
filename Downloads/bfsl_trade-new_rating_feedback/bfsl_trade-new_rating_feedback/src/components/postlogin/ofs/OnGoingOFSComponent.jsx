import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { useFetch, MsfRequest } from '../../../index'

import { WidgetLoader } from '../../common/WidgetLoaderComponent'
import LangText from '../../../common/lang/LangText'

import { OFS_SERVICES } from '../../../config/ServiceURLs'
import {  storeOFSDialogDetails } from '../../../state/actions/Actions'

import {
    checkEmpty,
    containsNumbers,
    //  convertToFloat, getFormatedDate, checkToday, convertCommaSeparated,
    // replaceComma,
    getTradingBaseURL
} from '../../../common/CommonMethods'
import { LOCAL_STORAGE, OFS_DIALOGS } from '../../../common/Constants';
import { getItemFromSessionStorage } from '../../../common/LocalStorage';

function OnGoingOFSComponent(props) {

    const MsfFetch = useFetch()

    const [onGoingOFS, setOnGoingOFS] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    // const [showStatusIndex, setShowStatusIndex] = useState(null)
    const [infoMsgOne, setInfoMsgOne] = useState(null)
    const [infoMsgTwo, setInfoMsgTwo] = useState(null)

    useEffect(() => {
        let ofsInfoMsgs = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.OFS_DETAILS))
        if (ofsInfoMsgs){
            setInfoMsgOne(ofsInfoMsgs[0])
            setInfoMsgTwo(ofsInfoMsgs[1])
        }
        getOnGoingOFS()
        
    }, [])

    function getOnGoingOFS() {
        props.showWidgetLoader()
        setOnGoingOFS([])
        setErrorMsg(null)
        let request = new MsfRequest();
        request.addToData({
            "type": "C"
        })
        MsfFetch.placeRequest(
            getTradingBaseURL() + OFS_SERVICES.UPCOMING_ONGOING,
            request,
            successRespCBGetOnGoingOFS,
            errorRespCBGetOnGoingOFS
        )
    }

    function successRespCBGetOnGoingOFS(response) {
        let list = response.data.list 
        setOnGoingOFS(list)
        setErrorMsg(null)
        props.hideWidgetLoader()
    }

    function errorRespCBGetOnGoingOFS(error) {
        setOnGoingOFS([])
        setErrorMsg(error.message)
        props.hideWidgetLoader()
    }

    function onClickApplyOrder(data) {
        props.storeOFSDialogDetails({
            name: OFS_DIALOGS.APPLY_ORDER,
            symData: data,
            isModify: false
        })
    }

    return (
        <div className="ofs-content-base open-ofs-base">
            <div className="infoMsg-div">
                <span>
                    <ul>
                        <li className = "info">{infoMsgOne}</li>
                        <li>{infoMsgTwo}</li>
                    </ul>
                </span>
            </div>
            <div className="ofs-table open-ofs-table">
                {
                    (onGoingOFS && onGoingOFS.length) ?
                        onGoingOFS.map((item, index) => {
                            return (
                                <div key={index} className="dataRow">
                                    <div className="name">
                                        <span className="symbolName">{
                                            checkEmpty(item.dispSym)}</span>
                                        <span className="exchange">{
                                            checkEmpty(item.exchSeg)}</span>
                                    </div>
                                    <div className="data">
                                        <div className="column first">
                                            <span className="label"><LangText name="SYMBOL" module="OFS" /></span>
                                            <span className="value">{checkEmpty(item.companyName)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label">
                                                <LangText name="CATEGORY" module="OFS" />
                                            </span>
                                            <span className="value">{checkEmpty(item.category)}
                                            </span>
                                        </div>

                                        <div className="column">
                                            <span className="label">
                                                <LangText name="START_DATE" module="OFS" />
                                            </span>
                                            <span className="value">
                                                {checkEmpty(item.opnDte)}
                                            </span>
                                        </div>
                                        <div className="column enddate">
                                            <span className="label">
                                                <LangText name="END_DATE" module="OFS" />
                                            </span>
                                            <span className={`value ${!containsNumbers(item.closedDte) ?
                                                "colorRed" : ""}`}>
                                                {checkEmpty(item.closedDte)}
                                            </span>
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="FLOOR_PRICE" module="OFS" /></span>
                                            <span className="value"> ₹ {checkEmpty(item.flrPrce)}</span>
                                        </div>
                                        <div className="column">
                                            <span className="label"><LangText name="CUTOFF_PRICE" module="OFS" /></span>
                                            <span className="value">
                                            ₹ {checkEmpty(item.cuttOffPrce)}</span>
                                        </div>
                                        <div className="column offerprice">
                                            <span className="label"><LangText name="OFFER_SIZE" module="OFS" /></span>
                                            <span className="value"> ₹ {checkEmpty(item.issueSize)} Cr</span>
                                        </div>
                                        <div className="column ">
                                            <span className="label"><LangText name="TICK_SIZE" module="OFS" /></span>
                                            <span className="value">{checkEmpty(item.tickSize)}</span>
                                        </div>
                                        <div className="column lastchild">
                                            <button className="theme-btn apply" onClick={()=>onClickApplyOrder(item)}>
                                                <LangText name="APPLY" module="OFS" /></button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        :
                        <div className="errorDiv flex-center">
                            {errorMsg}
                        </div>
                }
            </div>
        </div>
    )
}

const mapStateToProps = ({ ofsDetails }) => {
    return {
        dialogDetails: ofsDetails.dialogDetails,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeOFSDialogDetails: (s) => { dispatch(storeOFSDialogDetails(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WidgetLoader(OnGoingOFSComponent));