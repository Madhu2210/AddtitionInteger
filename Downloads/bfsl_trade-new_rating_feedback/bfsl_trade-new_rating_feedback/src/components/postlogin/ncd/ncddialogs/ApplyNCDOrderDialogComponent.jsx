import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { checkEmpty } from "../../../../common/CommonMethods";
import { LOCAL_STORAGE, NCD_DIALOGS } from "../../../../common/Constants";
import LangText from "../../../../common/lang/LangText";
import { getItemFromSessionStorage } from "../../../../common/LocalStorage";
import useCloseModal from "../../../../customHooksComponents/useCloseModal";
import { storeNCDDialogDetails } from "../../../../state/actions/Actions";
import { CloseIcon } from "../../../common/FontIcons";
import { Loader } from "../../../common/LoaderComponent";

function ApplyNCDOrderDialogComponent(props) {

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose, false)

    const [showLoader] = useState(false)
    const [infoMsg,setInfoMsg] = useState('')

    useEffect(() => {
        let info = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.NCD_INFO))
        setInfoMsg(info.ApplyNCD1)
    }, [])

    function onClose() {
        props.onCloseCB && props.onCloseCB()
    }

    function onClickClose() {
        props.onCloseCB && props.onCloseCB()
    }

    function onClickContinue(data) {
        props.storeNCDDialogDetails({
            name: NCD_DIALOGS.SHOW_SERIES_LIST,
            symData: data
        })
    }
    
    return(
        <div className="ncdDialog-base apply-ncd-dialog">
            <div className="window">
                <Loader show={showLoader} />
                <div className="header">
                    <div className="company-info">
                        <span className="symName">
                            {checkEmpty(props.symData.debtipoBidNme)}</span>
                        <span className="dispSym">{checkEmpty(props.symData.debtipoNme)}</span>
                    </div>
                    <span className="close" onClick= {onClickClose}><CloseIcon/></span>
                </div>
                <div className=" row rating">
                    <div className="ratingdiv">
                        <span className="label">
                            <LangText module="NCD" name="RATING"/> : 
                        </span>
                        <span className="value"> {checkEmpty(props.symData.ratings)}</span>
                    </div>
                    <div className="issue-price-div">
                        <span className="label">
                            <LangText module="NCD" name="ISSUE_PRICES"/> : 
                        </span>
                        <span className="value"> {checkEmpty(props.symData.issuePrce)}</span>
                    </div>
                </div>
                <div className="content">                 
                    <div className="row first">
                        <div className="column">
                            <span className="label">
                                <LangText module="NCD" name="MIN_LOT_SIZE"/>
                            </span>
                            <span className="value">
                                {checkEmpty(props.symData.minLotSize)}
                            </span>
                        </div>
                        <div className="column center-align">
                            <span className="label">
                                <LangText module="NCD" name="MULT_QTY" />
                            </span>
                            <span className="value">
                                {checkEmpty(props.symData.multplOfQlty)}
                            </span>
                        </div>
                        <div className="column right-align">
                            <span className="label">
                                <LangText module="NCD" name="MIN_INVES_AMT" />
                            </span>
                            <span className="value">
                                {checkEmpty(props.symData.minValue)}
                            </span>
                        </div>
                    </div>
                    {/* <div className="row">
                        <div className="column">
                            <span className="label">
                                <LangText module="NCD"
                                    name="MIN_INVES_AMT"/>
                            </span>
                            <span className="value">
                                {checkEmpty(props.symData.minValue)}
                            </span>
                        </div>
                    </div> */}
                    <div className="row">
                        <div className="column">
                            <span className="label">
                                <LangText module="NCD" name="MAX_LOT_SIZE" />
                            </span>
                            <span className="value">
                                {checkEmpty(props.symData.maxLotSize)}
                            </span>
                        </div>
                        <div className="column center-align">
                            <span className="label">
                                <LangText module="NCD" name="MAX_VAL" />
                            </span>
                            <span className="value">
                                {checkEmpty(props.symData.maxValue)}
                            </span>
                        </div>
                        <div className="column right-align">
                            <span className="label">
                                <LangText module="NCD" name="ISSUE_SIZE" />
                            </span>
                            <span className="value">
                                {checkEmpty(props.symData.issueSize)}
                            </span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="column">
                            <span className="label">
                                <LangText module="NCD" name="OPEN_DATE" />
                            </span>
                            <span className="value">
                                {checkEmpty(props.symData.issueOpnDte)}
                            </span>
                        </div>
                        <div className="column center-align">
                            <span className="label">
                                <LangText module="NCD" name="CLOSE_DATE" />

                            </span>
                            <span className="value">
                                {checkEmpty(props.symData.issueCloseDte)}
                            </span>
                        </div>
                        <div className="column right-align">
                            <span className="label">
                                <LangText module="NCD" name="SECURITY_TYPE" />
                            </span>
                            <span className="value">
                                {checkEmpty(props.symData.secrtyType)}
                            </span>
                        </div>
                    </div>
                    <div className="row extra-info">
                        {/* <LangText module="NCD" name="EXTRA_INFO" /> */}
                        {infoMsg}
                    </div>
                    <div className="row buttonRow">
                        <button className="continueBtn" 
                            // disabled={!isAgreed}
                            onClick={()=>onClickContinue(props.symData)}
                        >
                            <LangText name="CONTINUE" module="BUTTONS" />
                        </button>
                    </div>
                </div>
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
        storeNCDDialogDetails: (s) => { dispatch(storeNCDDialogDetails(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps) (ApplyNCDOrderDialogComponent);