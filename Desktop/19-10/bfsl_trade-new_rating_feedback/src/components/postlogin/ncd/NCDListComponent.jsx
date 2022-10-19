import React, { useEffect, useState } from "react";
import {  useFetch, MsfRequest } from '../../../index'
import { checkEmpty, getBackOfficeBaseURL } from "../../../common/CommonMethods";
import LangText from "../../../common/lang/LangText";
import { NCD_SERVICE } from "../../../config/ServiceURLs";
import { WidgetLoader } from "../../common/WidgetLoaderComponent";
import { LOCAL_STORAGE, NCD_DIALOGS, TEXT_ORIENTATION } from "../../../common/Constants";
import { connect } from "react-redux";
import { storeNCDDialogDetails } from "../../../state/actions/Actions";
import { getItemFromSessionStorage } from "../../../common/LocalStorage";

function NCDListComponent(props) {

    const MsfFetch = useFetch()

    const [errorMsg, setErrorMsg] = useState(null)
    const [ncdList, setNcdList] = useState([])
    const [infoMsg, setInfoMsg] = useState('')

    useEffect(() => {
        let info = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.NCD_INFO))
        setInfoMsg(info.ListedNCD)
        getNCDList()
    }, [])

    function getNCDList() {
        props.showWidgetLoader()
        setNcdList([])
        setErrorMsg(null)
        let request = new MsfRequest();
        request.addToData({

        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + NCD_SERVICE.LIST,
            request,
            successRespCBGetNCDList,
            errorRespCBGetNCDList
        )
    }

    function successRespCBGetNCDList(response) {
        let list = response.data.debtIPOList 
        setNcdList(list)
        setErrorMsg(null)
        props.hideWidgetLoader()
    }

    function errorRespCBGetNCDList(error) {
        setNcdList([])
        setErrorMsg(error.message)
        props.hideWidgetLoader()
    }

    function onClickApply(data) {
        props.storeNCDDialogDetails({
            name: NCD_DIALOGS.APPLY_ORDER,
            symData: data
        })
    }

    return(
        <div className="ncd-content-base list-ncd-base">
            <div className="infoMsg-div">
                <div>
                    {/* <LangText module= "NCD" name= "NCD_INFO"/> */}
                    {infoMsg}
                    {/* <span className="info-timerange">
                        <LangText module= "NCD" name= "NCD_INFO_MSG_TWO"/></span>
                    <span>
                        <LangText module= "NCD" name= "NCD_INFO_MSG_THREE"/> 
                    </span> */}
                </div>
            </div>
            <div className="ncd-table list-ncd-table">
                {
                    (ncdList && ncdList.length) ?
                        ncdList.map((item, index) => {
                            return (
                                <div key={index} className="dataRow">
                                    <div className="name">
                                        <span className="symbolName">{
                                            checkEmpty(item.debtipoBidNme)}</span>
                                    </div>
                                    <div className="data">
                                        <div className="column first">
                                            <span className="label"><LangText name="SYMBOL" module="NCD" /></span>
                                            <span className="value">{checkEmpty(item.debtipoNme)}</span>
                                        </div>
                                        <div className="column lg-2">
                                            <span className="label">
                                                <LangText name="ISSUE_OPEN_DATE" module="NCD" />
                                            </span>
                                            <span className="value">{checkEmpty(item.issueOpnDte)}
                                            </span>
                                        </div>

                                        <div className="column lg-2">
                                            <span className="label">
                                                <LangText name="ISSUE_CLOSE_DATE" module="NCD" />
                                            </span>
                                            <span className="value">
                                                {checkEmpty(item.issueCloseDte)}
                                            </span>
                                        </div>
                                        <div className="column med">
                                            <span className="label">
                                                <LangText name="ISSUE_PRICE_THEAD" module="NCD" />
                                            </span>
                                            <span className="value">
                                                {checkEmpty(item.issuePrce)}
                                            </span>
                                        </div>
                                        <div className="column med">
                                            <span className="label">
                                                <LangText name="MIN_LOT_SIZE_THEAD" module="NCD" /></span>
                                            <span className="value">
                                                {checkEmpty(item.minLotSize)} QTY</span>
                                        </div>
                                        <div className="column med">
                                            <span className="label">
                                                <LangText name="MULT_QTY_THEAD" module="NCD" /></span>
                                            <span className="value">{checkEmpty(item.multplOfQlty)} QTY</span>
                                        </div>
                                        <div className="column med ">
                                            <span className="label"><LangText name="MIN_INVES_AMT_THEAD"
                                                module="NCD" /></span>
                                            <span className="value">{checkEmpty(item.minValue)}</span>
                                        </div>
                                        <div className="column lastchild" onClick={() => onClickApply(item)}>
                                            <button className="theme-btn apply">
                                                <LangText name="APPLY" module="NCD"
                                                    orientation={TEXT_ORIENTATION.UPPERCASE}/></button>
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

const mapStateToProps = ({ ncdDetails }) => {
    return {
        dialogDetails: ncdDetails.dialogDetails,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeNCDDialogDetails: (s) => { dispatch(storeNCDDialogDetails(s)) },
    };
};

export default connect(mapStateToProps,mapDispatchToProps) (WidgetLoader(NCDListComponent));