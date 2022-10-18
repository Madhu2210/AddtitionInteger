import React, { useEffect, useRef, useState } from 'react'
import { connect } from "react-redux";

import { Loader } from '../../common/LoaderComponent'

import {
    showAppDialog, storeProfileDetails, storeRegetProfileDataFlag,
    storeTaxDeclarationDetails
} from '../../../state/actions/Actions';

import { getTaxDecalreDetails, getTaxProfileFromAPIData, getUserName } from '../../../common/Bridge';

import { CheckBoxIcon_Checked, CheckBoxIcon_UnChecked, CloseIcon } from '../../common/FontIcons'
import SelectInputComponent from '../../common/SelectInputComponent';
import {
    LOCAL_STORAGE,
    TAX_DECLARATION_DIALOGS, TAX_DECLARATION_MSG_KEY,
    USE_BFSL_HOLDINGS
} from '../../../common/Constants';
import { getBackOfficeBaseURL } from '../../../common/CommonMethods';
import { PROFILE } from '../../../config/ServiceURLs';
import LangText, { getLangText } from '../../../common/lang/LangText';
import { getItemFromSessionStorage } from '../../../common/LocalStorage';
// import ClosePopupInfo from './ClosePopupInfo';

function AttentionDialogComponent(props) {

    const [incomeRange, setIncomeRange] = useState([])
    const [selectedIncomeRange, setSelectedIncomeRange] = useState(null)
    const [proofOptionList, setProofOptionList] = useState([])
    const [selectedProofOption, setSelectedProofOption] = useState("")
    const [selectedProofFile, setSelectedProofFile] = useState("")
    const [uploadFileError, setUploadFileError] = useState(null)
    const [incomeRangeError, setIncomeRangeError] = useState(null)
    const [declarationMsg, setDeclarationMsg] = useState({})
    const [idCancelMsg, setIdCancelMsg] = useState('')
    const [isFno, setIsFno] = useState(false)
    const [isShow, setIsShow] = useState(false)
    // const [idCancelShow, setIdCancelShow] = useState(true)

    const uploadProofRef = useRef(null)

    useEffect(() => {
        let taxDetails = getTaxDecalreDetails()
        let cancelMsg = taxDetails.declarationMsgs[TAX_DECLARATION_MSG_KEY.ID_CANCEL_POPUP]
        setIsFno(taxDetails.isFno)
        setIdCancelMsg(cancelMsg)
        setIncomeRange(taxDetails.incomeList)
        // setSelectedIncomeRange(taxDetails.incomeList ? taxDetails.incomeList[0] : null)
        setProofOptionList(taxDetails.proofOptions ? taxDetails.proofOptions : [])
        // let selectedProof = taxDetails.proofOptions ? taxDetails.proofOptions[0] : null
        // if (selectedProof) {
        //     if (selectedProof.suboption && selectedProof.suboption.length)
        //         setSelectedProofOption(selectedProof.suboption[0])
        //     else
        //         setSelectedProofOption(selectedProof.option)
        // }
        setDeclarationMsg(taxDetails.declarationMsgs)
    }, [])

    function onClickClose() {
        // console.log(props.profileData)
        props.storeTaxDeclarationDetails({
            dialogName: null
        })
        let profileDetails = getTaxProfileFromAPIData()
        if (profileDetails.isTradeBlock || profileDetails.isTradeBlockFO) {
            // return <ClosePopupInfo message={idCancelMsg} show={idCancelShow} closeCB={setIdCancelShow(false)}/>;
            props.showAppDialog({
                title: getLangText('ALERT_APP', 'LOGIN'),
                message: idCancelMsg,
                defaultBtnName: getLangText('OK', 'BUTTONS'),
                show: true
            })
        }
        // return null
    }

    function onSelectIncomeRange(range) {
        setSelectedIncomeRange(range)
        setIncomeRangeError(null)
    }

    function onSelectProofOption(selectedData = "") {
        let value = selectedData.option ? selectedData.option : selectedData
        setSelectedProofOption(value)
        if (value.toUpperCase() === USE_BFSL_HOLDINGS)
            setUploadFileError(null)
    }

    function handleProofUpload(e) {
        let uploadedFile = null
        if (e.target.files && e.target.files.length > 0)
            uploadedFile = e.target.files[0]

        let size = Math.round((uploadedFile.size / 1024))
        if (
            !(uploadedFile.type === 'image/png' ||
                uploadedFile.type === 'image/jpeg' ||
                uploadedFile.type === 'application/pdf')
        ) {
            onRemoveProofFile()
            setUploadFileError(getLangText("REQUIRED_FILE_FORMAT_ERR", "TAX"))
        } else if (size > 5120) {
            onRemoveProofFile()
            setUploadFileError(getLangText("REQUIRED_FILE_SIZE_ERR", "TAX"))
        } else {
            setSelectedProofFile(uploadedFile)
            setUploadFileError(null)
        }
    }

    function onRemoveProofFile() {
        setSelectedProofFile(null)
        uploadProofRef.current.value = null
    }

    function onClickSubmit() {
        let hasError = false
        if (!uploadFileError) {
            if (getUploadFlag()) {
                if (
                    (selectedProofOption && (selectedProofOption.toUpperCase() !== USE_BFSL_HOLDINGS))
                    &&
                    !selectedProofFile
                ) {
                    setUploadFileError(getLangText("UPLOAD_INCOME_PROOF_ERR", "TAX"))
                    hasError = true
                }
            }
            if (!selectedIncomeRange) {
                setIncomeRangeError(getLangText("SELECT_INCOME_RANGE_ERR", "TAX"))
                hasError = true
            }
        }
        if (!hasError)
            uploadIncome()
    }

    function uploadIncome() {
        props.showLoader();
        const formData = new FormData()
        formData.append("incomeRange", selectedIncomeRange)
        formData.append("docType",
            (selectedProofOption && selectedProofOption.toUpperCase() === USE_BFSL_HOLDINGS) ? selectedProofOption :
                (selectedProofFile ? selectedProofOption : "")
        )
        formData.append("file", selectedProofFile ? selectedProofFile : "")
        fetch(getBackOfficeBaseURL() + PROFILE.UPLOAD_INCOME, {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
            .then(checkStatus)
            .then(getBody)
            .then(parseBody)
            .then(response => {
                let result = response.response;
                let respMsg = result.infoMsg;
                let resultMsg = ""
                if (respMsg && (respMsg.trim().toLowerCase() !== "ticket created successfully")) {
                    resultMsg = result.infoMsg
                } else {
                    resultMsg = "Great " + getUserName() + ", "
                    let cash_tax_msgs = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.TAX_DECLARE_MSG))
                    if (selectedProofOption.toUpperCase() === USE_BFSL_HOLDINGS || selectedProofFile) {
                        resultMsg = resultMsg + declarationMsg[TAX_DECLARATION_MSG_KEY.ID_SUBMIT_POPUP]
                    } else {
                        resultMsg = resultMsg + cash_tax_msgs[TAX_DECLARATION_MSG_KEY.ID_SUBMIT_POPUP]
                    }
                }
                props.storeTaxDeclarationDetails({
                    dialogName: TAX_DECLARATION_DIALOGS.INPROGRESS_ALERT,
                    infoMsg: resultMsg,
                    apiResponse: {
                        isSuccess: result.infoID === "0"
                    }
                })
                // props.storeRegetProfileDataFlag(true)
                let profileData = getTaxProfileFromAPIData()
                profileData.popupFlgCash = "0"
                profileData.isTradeWarning = false
                profileData.isTradeBlock = false
                if (selectedProofOption) {
                    profileData.popupFlgFO = "0"
                    profileData.isTradeWarningFO = false
                    if (profileData.isTradeBlockFO) {
                        profileData.isTradeBlockFO = false
                        profileData.isTradeBlockProgress = true
                    }
                }
                props.storeProfileDetails(profileData)
            })
            .catch((error) => {
                props.hideLoader();
                props.storeTaxDeclarationDetails({
                    dialogName: TAX_DECLARATION_DIALOGS.INPROGRESS_ALERT,
                    infoMsg: error.message,
                    apiResponse: {
                        isSuccess: false
                    }
                })
            })
    }

    function checkStatus(response) {
        props.hideLoader();
        if (response.status == 200) {
            return response
        }
        let error = new Error("service unavailable");
        throw error

    }

    function getBody(response) {
        return response.text();
    }

    function parseBody(response) {
        return JSON.parse(response);
    }

    function getUploadFlag() {
        let flag = false
        if (proofOptionList.length && isFno)
            flag = true

        return flag
    }

    function clickHere() {
        setIsShow(!isShow)
    }
    return (
        <div className="app-modalDialog2 tax-attention-base">
            <div className={`window ${getUploadFlag() ? "hasUpload" : "notHasUpload"}`}>
                <div className="header">
                    <div className="heading">
                        <span>
                            <LangText name="ATTENTION_REQUIRED" module="TAX" />
                        </span>
                        <CloseIcon onClick={onClickClose} />
                    </div>
                    <div className="header-info" >
                        <div className={`header-text ${!isShow ? 'show-full' : null}`}>
                            {declarationMsg ? declarationMsg[TAX_DECLARATION_MSG_KEY.INITIAL_POPUP] : null}</div>
                        {!getUploadFlag() ?
                            isShow ?
                                <span className="cursor clickHere" onClick={clickHere}>
                                    ....read less
                                </span>
                                : <span className="cursor clickHere" onClick={clickHere}>....read more</span>
                            : null}

                    </div>
                </div>
                <div className={`content`}>
                    <div className="incomeRangeDiv">
                        <div className="range-header">
                            <LangText name="SELECT_INCOME_RANGE" module="TAX" />
                        </div>
                        <div className="range-content ">
                            {
                                incomeRange.map((item, index) => {
                                    return (
                                        <div key={index} className="range-div"
                                            onClick={() => onSelectIncomeRange(item)}
                                        >
                                            <span className="range">{item}</span>
                                            <input type="radio"
                                                name="ordType"
                                                checked={selectedIncomeRange === item}
                                            />
                                            <span className="checkmark"></span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="rangeError">
                            {incomeRangeError}
                        </div>
                        {
                            !getUploadFlag() ?
                                <Declaration error={uploadFileError}
                                    onClickSubmit={onClickSubmit}
                                    declarationMsg={declarationMsg}
                                />
                                : null
                        }
                    </div>
                    {
                        getUploadFlag() ?
                            <div className="uploadDiv">
                                <div className="upload-content">
                                    <div className="labelInput">
                                        <span className="label">
                                            <LangText name="UPLOAD_INCOME_PROOF" module="TAX" />
                                        </span>
                                        <SelectInputComponent
                                            optionList={proofOptionList}
                                            onSelectValueCB={onSelectProofOption}
                                            selectedOption={selectedProofOption}
                                            value="option"
                                            preSelect={false}
                                            hasSubOption={true}
                                            subOptionKey="suboption"
                                            hasRadio={true}
                                            // preSelectText="-- Select --"
                                            preSelectText={getLangText('SELECT_ITEM')}
                                            
                                        />
                                    </div>
                                    {
                                        (selectedProofOption &&
                                            selectedProofOption.toUpperCase() !== USE_BFSL_HOLDINGS
                                        ) ?
                                            <>
                                                <div className="uploadBtnBase">
                                                    <input className="hide" accept="image/x-png,image/jpeg,.pdf"
                                                        type="file" ref={uploadProofRef}
                                                        name="proofDoc" placeholder="UPLOAD"
                                                        onChange={handleProofUpload}
                                                    />
                                                    <button className="uploadBtn" disabled=
                                                        {selectedProofOption === getLangText('SELECT', 'TAX')}
                                                    onClick={() => uploadProofRef.current.click()}
                                                    >
                                                        <LangText name="UPLOAD" module="BUTTONS" />
                                                    </button>
                                                    <span className="uploadCondition">
                                                        <LangText name="SUPPORTED_FILE_TXT" module="TAX" />
                                                    </span>
                                                </div>
                                                <div className="fileNameDiv">
                                                    {
                                                        selectedProofFile && selectedProofFile.name ?
                                                            <>
                                                                <div className="fileName text-nowrap">
                                                                    {selectedProofFile.name}
                                                                </div>
                                                                <span className="removeFileBtn">
                                                                    <CloseIcon onClick={onRemoveProofFile} />
                                                                </span>
                                                            </>
                                                            : (
                                                                uploadFileError ?
                                                                    <div className="errorDiv">
                                                                        {uploadFileError}
                                                                    </div>
                                                                    : null
                                                            )
                                                    }
                                                </div>
                                            </>
                                            : null
                                    }
                                </div>
                                <Declaration error={uploadFileError || incomeRangeError}
                                    onClickSubmit={onClickSubmit}
                                    declarationMsg={declarationMsg}
                                />
                            </div>
                            : null
                    }
                </div>
            </div>
        </div>
    )
}

function Declaration(props) {

    const [isAgreed, setIsAgreed] = useState(false)

    function getDisableSubmitFlag() {
        if (props.error || !isAgreed)
            return true
        return false
    }

    function onClickSubmit() {
        props.onClickSubmit && props.onClickSubmit()
    }

    return (
        <div className="main-declaration-div">
            <div className="title">
                <LangText name="DECLARATION" module="TAX" />
            </div>
            <div className="declaration">
                {props.declarationMsg[TAX_DECLARATION_MSG_KEY.DECLARATION_MSG]}
            </div>
            <div className="cursor accept-div" onClick={() => setIsAgreed(!isAgreed)}>
                {
                    isAgreed ?
                        <CheckBoxIcon_Checked />
                        :
                        <CheckBoxIcon_UnChecked />
                }
                <span className="acceptTxt">
                    <LangText name="DECLARATION_ACCEPT" module="TAX" />
                </span>
            </div>
            <button className="submitBtn"
                disabled={getDisableSubmitFlag()}
                onClick={onClickSubmit}
            >
                <LangText name="SUBMIT" module="BUTTONS" />
            </button>
        </div>
    )
}

const mapStateToProps = ({ profileDialog }) => {
    return {
        profileData: profileDialog.profileDetails,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeTaxDeclarationDetails: (s) => { dispatch(storeTaxDeclarationDetails(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeProfileDetails: (s) => { dispatch(storeProfileDetails(s)) },
        storeRegetProfileDataFlag: (s) => { dispatch(storeRegetProfileDataFlag(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(AttentionDialogComponent));