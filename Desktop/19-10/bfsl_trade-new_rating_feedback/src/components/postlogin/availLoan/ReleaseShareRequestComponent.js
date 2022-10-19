import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { MsfRequest, useFetch } from '../../../index'
import { checkEmpty,  checkInt,  convertCommaSeparated,  getBackOfficeBaseURL, replaceComma 
} from '../../../common/CommonMethods';
import {
    AVAIL_LOAN_DIALOGS, AVAIL_LOAN_GET_HOLDINGS,
    AVAIL_LOAN_UNPLEDGE_SHARE,
    SCREENS,

} from '../../../common/Constants';
import LangText, { getLangText } from '../../../common/lang/LangText'
import { LAS_SERVICE_JOURNEY } from '../../../config/ServiceURLs';
import {
    showAppDialog, storeAvailLoanGetHoldingResponse,
    storeLoanDialogDetails, storeRecieveDialogDetails
} from '../../../state/actions/Actions';
import { Loader } from '../../common/LoaderComponent';
import { Checkbox_nor, Checkbox_sel, CloseIcon, SearchIcon } from '../../common/FontIcons';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';

function ReleaseShareRequestComponent(props) {
    const [getHoldings, setGetHoldings] = useState([])
    const [tableData, setTableData] = useState([])
    // const [check, setCheck] = useState(false)
    const [searchData, setSearchData] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [tableDataDuplicate, setTableDataDuplicate] = useState([])
    const [finalVal, setFinalVal] = useState('')
    // const [isEditables, setIsEditables] = useState(false)
    const[unpledgeError,setUnpledgeError]=useState(false)
    const [responseError,setResponseError]=useState('')
    const[noData,setNoData]=useState(false)

    const MsfFetch = useFetch();

    useEffect(() => {
        getUserAmountDetails()

    }, [])

    useEffect(() => {

        if (tableData) {

            let checkList = Object.assign([], tableData)
            let checkedSyms = checkList.filter(item => item.isOpen)
            let totalval = 0;
            checkedSyms.map((item) => {
                let qty = item.qty ? parseInt(replaceComma(item.qty)) : 0
                let val = parseFloat(replaceComma(item.prc))
                totalval = parseFloat(totalval + (qty * val))
            })

            setFinalVal(totalval.toFixed(2))
            
        }
    }, [tableData])

    function getUserAmountDetails() {
        // setIsEditables(false)
        props.showLoader();
        let request = new MsfRequest();
        request.addToData({
            "loanId": props.responseData ? props.responseData.loanId : "",
            // "lan":props.responseData ? props.responseData.lan : "",
            "lan": props.DisburseResponse ? props.DisburseResponse[0].lan : "",
            "fas": props.DisburseResponse ? props.DisburseResponse[0].fas : ""
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICE_JOURNEY.GET_HOLDING,
            request,
            successRespGetUserAmountDetails,
            errorRespCBGetUserAmountDetails
        )
    }

    function successRespGetUserAmountDetails(response) {
       
        setGetHoldings(response.data.disburseInfo)
        
        setTableData(response.data.NonPOAPledgeHoldings)
        
        setTableDataDuplicate(response.data.NonPOAPledgeHoldings)

        // props.storeAvailLoanGetHoldingResponse(response.data.NonPOAPledgeHoldings)
        props.hideLoader()
        setResponseError('')
    }
    
    function errorRespCBGetUserAmountDetails(error) {
        props.hideLoader()
        setResponseError(error.message)
        // props.showAppDialog({
        //     message: error.message,
        //     show: true
        // })

    }

    function unpledgeCancel() {
        props.history.push(SCREENS.DASHBOARD)
    }

    function unpledgeSubmit() {
        if(unpledgeError){
            props.showAppDialog({
                message: getLangText('INVALID_QTY', 'LAS'),
                show: true
            })
        }
        else{
            
            let selected = [];
            tableData.map((item) => {
                if (item.isOpen) {
                    selected.push(item)
                }

            })
            props.storeAvailLoanGetHoldingResponse(selected)
           
            let request = new MsfRequest();
            request.addToData({
                "loanId": props.responseData ? props.responseData.loanId : "",
                "mode": "R",
                "lan": props.DisburseResponse ? props.DisburseResponse[0].lan : "",
            })
            MsfFetch.placeRequest(
                getBackOfficeBaseURL() + LAS_SERVICE_JOURNEY.OTP_GENERATE_RELEASE_SHARE,
                request,
                successRespGetOtpRelease,
                errorRespGetOtpRelease
            )

            // props.storeLoanDialogDetails({
            //     dialogName: AVAIL_LOAN_DIALOGS.OTP_VERIFICATION,

        // props.storeRecieveDialogDetails({
        //     dialogContent: true
        // })
        }    
    }

    function successRespGetOtpRelease() {

        props.storeLoanDialogDetails({
            dialogName: AVAIL_LOAN_DIALOGS.OTP_VERIFICATION,
        })

        props.storeRecieveDialogDetails({
            dialogContent: true
        })

    }

    function errorRespGetOtpRelease(error){
        props.showAppDialog({
            message: error.message,
            show: true
        })
    }

    // function onclickCheck() {
    //     setCheck(true)
    // }
    // function onclickUnCheck() {
    //     setCheck(false)
    // }
    function search(value) {
        // if(!value)
        let checksymbol= value.replace(/[^a-zA-Z0-9& ]/g,'')
        setSearchValue(checksymbol)  
        const data = tableDataDuplicate.filter(item => item.scrpNme.toUpperCase().includes(checksymbol.toUpperCase())) 
        if (data) {
            setTableData(data)
        }
        
        if (data.length === 0){
           
            setNoData(true)
        } 
        // else {
        //     
        //     setTableData(tableData)
        //     
        // }
       
    }

    function searchCloseData(){
        setSearchValue('')
        setSearchData(false)
        setTableData(tableDataDuplicate)
        
    }

    function userInputArray(respItem, respIndex, labelName, labelIndex, contents) {
     
        let total = Object.assign([], (JSON.parse(JSON.stringify(tableData))))
      
        if(checkInt(contents)){
            total[respIndex][labelName] = contents
        }
        else{
           
            total[respIndex][labelName] = ''
        }
       
        setTableData(total)
        
    }

    function onBlurUnPledgeShares(e, respIndex) {
        // e.stopPropagation()
        e.persist() 
        let total = Object.assign([], (JSON.parse(JSON.stringify(tableData))))
        if(e.target.value === ''){
            total[respIndex].qty=e.target.defaultValue
        }
       
        if (parseInt(replaceComma(e.target.value)) > parseInt(replaceComma(total[respIndex].totalQuant) 
        || (e.target.value) < 0 ) )
        {
            
            setUnpledgeError(true)
            total[respIndex].qty=e.target.defaultValue
            setTableData(total)
          
            props.showAppDialog({
                message: getLangText('INVALID_QTY', 'LAS'),
                show: true
            })
           
        }    
        else{
            // total[respIndex]["isError"] = false
            setUnpledgeError(false)
            setTableData(total)
        }    
      
    }

    const toggleItem = inx => {

        let sharesData = Object.assign([], (JSON.parse(JSON.stringify(tableData))))
        let selected = [];
        sharesData[inx]['isOpen'] = !sharesData[inx]['isOpen']
        
        setTableData(sharesData)
        setTableDataDuplicate(sharesData)
        
        sharesData.map((item) => {
            if (item.isOpen) {

                selected.push(item)

            }

        })

    }
    
    function inputData(labelIndex, labelName, respIndex, respItem, itemValue) {
     
        if (labelName.langKey === 'SYMBOL') {
            return (
                <div className="symbol-div">
                    <span className={`bfsl-font-2 ${!respItem.isOpen ? "checkboxnor" :
                        "active-checkboxnor"}`}>
                        {!respItem.isOpen ?
                            <Checkbox_nor onClick={() => toggleItem(respIndex)} />
                            :
                            <Checkbox_sel onClick={() => toggleItem(respIndex)} />
                        }

                    </span>
                    <span className="share-details-symbol">
                        {checkEmpty(itemValue.toUpperCase())}

                    </span>
                </div>

            )
        }
        else if (labelName.langKey === 'LOAN_VALUE' ||
            labelName.langKey === 'VALUE' ||
            labelName.langKey === 'PLEDGED_VALUES') {
            if (labelName.langKey === 'VALUE') {
                itemValue = respItem.qty ?
                    parseFloat(replaceComma(respItem.prc)) * parseInt(replaceComma(respItem.qty)) : 0 
            }
            return (
                <span className="share-details">
                    ₹ {checkEmpty(convertCommaSeparated(replaceComma(itemValue)))}

                </span>
            )
        }
        else if (labelName.langKey === 'UNPLEDGED_SHARES') {
            
            return (
                <div className="input-div">
                    <input className="input-unpledge"
                        type="number"
                        defaultValue={0}
                       
                        onKeyDown={(evt) => (evt.key === 'e' || evt.key === 'E')
                            && evt.preventDefault()}
                        name="withdraw"

                        value={respItem[labelName.key]}
                        onBlur={(e) => onBlurUnPledgeShares(e, respIndex)}
                        onChange={(content) => {
                          
                            content.persist()
                            
                            userInputArray(respItem, respIndex, labelName.key,
                                labelIndex, content.target.value)
                            
                        }}

                    />
                    
                </div>
            )

        }
        return (
           
            <span className="share-details">
                {checkEmpty(parseInt(replaceComma(itemValue)))}
            </span>
        )
    }

    function getSubmitDisableFlag() {
        let flag = ''
        let resultData = Object.assign([], (JSON.parse(JSON.stringify(tableData))))
        resultData = resultData.filter(item => item.isOpen)
       
        if (!resultData)
            resultData = []
        if (!resultData.length)
            flag = "disabled"
        else {
            resultData.map((item) => {
               
                if (!item.qty || item.qty <= 0){
                   
                    flag = "disabled"
                }
            })
        }
        return flag
    }
    
    return (

        <div className="release-share-base">
            { !responseError ? 
                <div>
                    <div className="release-share-head">
                        <LangText name="SHARES_TO_UNPLEDGE" module="AVAIL_LOAN" />

                    </div>
                    <div className="release-share-table">
                        {getHoldings && getHoldings.map((labelItem, labelIndex) => {
                            return (
                                <div className="share-table" key={labelIndex} >
                                    {AVAIL_LOAN_GET_HOLDINGS.map((labelName) => {
                                        return (
                                            <span key={labelIndex}>
                                                <span className="row-one">

                                                    <LangText name={labelName.langKey} module="AVAIL_LOAN" />

                                                </span>
                                                <div className="row-two">
                                            
                                                    { labelName.langKey ==='SHORT_FALL' ||
                                            labelName.langKey ==='AVAILABLE_LIMIT' ?
                                                        <span 
                                                            className={ 
                                                                +parseInt(replaceComma(labelItem[labelName.key])) < 0 
                                                                    ?
                                                                    "value-red" :
                                                                    +parseInt(replaceComma(labelItem[labelName.key])) 
                                                                    > 0 ?
                                                                        "value-green" : "value-black"
                                                            }>
                                                    ₹ {checkEmpty(
                                                                convertCommaSeparated(
                                                                    replaceComma(labelItem[labelName.key])))}
                                                        </span>
                                                        :
                                                        <span className="value-no-color">
                                                    ₹ {checkEmpty(
                                                                convertCommaSeparated(
                                                                    replaceComma(labelItem[labelName.key])))}
                                                        </span>
                                                    }
                                                </div>

                                            </span>
                                        )
                                    }

                                    )}
                                </div>
                            )
                        })}

                    </div>
                    <div>

                    </div>
                    <div className="unpledge-share">
                        <span>
                            <LangText name="EDIT_SHARE" module="AVAIL_LOAN" />
                        </span>
                        <div className="searching">
                            <span className="search-icon">
                                <SearchIcon onClick={() => setSearchData(true)} />
                            </span>
                            {searchData ?
                                <div >
                                    <input
                                        className="search-data"
                                        type="text"
                                        value={searchValue}
                                        onChange={(e) => search(e.target.value)}
                                    />
                                    <span className="close-data">
                                        <CloseIcon
                                            onClick={searchCloseData}
                                        />
                                    </span>
                                </div>
                                : ''}

                        </div>
                    </div>

                    <div className="release-share">
                        <table className="unpledge-table" >
                            <tr className="unpledge-table-head">
                                <th className="unpledge-head firstChild">
                                    <LangText name="SYMBOL" module="AVAIL_LOAN" />
                                </th>
                                <th className="unpledge-head">
                                    <LangText name="LOAN_VALUE" module="AVAIL_LOAN" />
                                </th>
                                <th className="unpledge-head unpledge-no">
                                    <LangText name="SHARES_PLEDGE" module="AVAIL_LOAN" />
                                </th>
                                <th className="unpledge-head">
                                    <LangText name="UNPLEDGED_SHARES" module="AVAIL_LOAN" />
                                </th>
                                <th className="unpledge-head">
                                    <LangText name="VALUE" module="AVAIL_LOAN" />
                                </th>
                                <th className="unpledge-head">
                                    <LangText name="PLEDGED_VALUES" module="AVAIL_LOAN" />
                                </th>

                            </tr>
                            <tbody className="addtn-pld-tbody">

                                { (!noData || tableData.length !==0) ?
                                    tableData && tableData.map((respItem, respIndex) => {
                                        return (

                                            <tr className="content-row" key={respIndex}>
                                                {AVAIL_LOAN_UNPLEDGE_SHARE.map((labelName, labelIndex) => {
                                                    let itemValue = respItem[labelName.key]

                                                    return (

                                                        <td key={labelIndex} className={`content-column 
                                                ${labelName.langKey === 'SYMBOL' ? "firstChild" : ""}
                                                 ${labelName.langKey === 'SHARES_PLEDGE' ? "unpledge-no" : ""}
                                                 ${labelName.langKey === 'UNPLEDGED_SHARES' ? "unpledge-input" : ""}
                                                 ${labelName.langKey === 'LOAN_VALUE' ? "unpledge-LnValue " : ""}
                                                 ${labelName.langKey === 'VALUE' ? "unpledge-value " : ""}
                                                 ${labelName.langKey === 'PLEDGED_VALUES' ? 
                                                            "unpledge-pldValue"  : ""}`}>

                                                            {/* {labelName.langKey === 'SYMBOL' ?
                                                    <span className={`bfsl-font-2 ${!respItem.isOpen ? "checkboxnor" :
                                                        "active-checkboxnor"}`}>
                                                        {!respItem.isOpen ?
                                                            <Checkbox_nor onClick={() => toggleItem(respIndex)}  />
                                                            :
                                                            <Checkbox_sel onClick={() => toggleItem(respIndex)}  />
                                                        }

                                                    </span> : ''
                                                }
                                               
                                                {
                                                    labelName.langKey === 'LOAN_VALUE' ||
                                                        labelName.langKey === 'VALUE' ||
                                                        labelName.langKey === 'PLEDGED_VALUES' ?
                                                        <span className="share-details">
                                                            ₹{checkEmpty(itemValue)}

                                                        </span>

                                                        :
                                                        <span className="share-details">
                                                            {checkEmpty(itemValue)}
                                                        </span>

                                                } 
                                                {  labelName.langKey==='UNPLEDGED_SHARES'?
                                                
                                                    <input className="input-unpledge"
                                                        type="number"
                                                        onKeyDown={ (evt) => (evt.key === 'e' || evt.key === 'E') 
                                                         && evt.preventDefault() }
                                                        name="withdraw"
                                                        
                                                        value={respItem[labelName.key]  } 
                                                       
                                                        onChange={(content) => { 
                                
                                                            userInputArray(respItem, respIndex, labelName.key,
                                                                labelIndex,  content)}}

                                                    />
                                                    :''
                                                    
                                                }     
                                                {inputData(labelIndex,labelName,respIndex,respItem)}           */}
                                                            {inputData(labelIndex, labelName, 
                                                                respIndex, respItem, itemValue)}

                                                        </td>

                                                    )
                                                })}
                                            </tr>

                                        )
                                    })
                       
                                    : 
                                    <div className="no-data">
                                        <LangText name="NO_DATA_AVAILABLE" module="AVAIL_LOAN" />
                                    </div>
                                }
                            </tbody>
                        </table>
                    </div>

                    <div className="unpledge-footer">
                        <button className="las-negativeBtn"
                            onClick={unpledgeCancel}>
                            <LangText name="CANCEL" module="BUTTONS" />
                        </button>
                        <button className="las-positivebtn"
                            // disabled={(!isEditables || !unPledgeInput) ? 'disabled' : "" }
                            disabled={getSubmitDisableFlag()}
                            onClick={  unpledgeSubmit } >
                  
                            <LangText name="SUBMIT" module="BUTTONS" />
                        </button>
                        <div className="share-release-div">
                            <span className="value-share-release">
                                <LangText name="VALUE_SHARE_RELEASE" module="AVAIL_LOAN" />
                            </span>
                            <span className="total-share">
                    ₹ {checkEmpty(convertCommaSeparated(finalVal))}
                            </span>
                        </div>
                    </div>
                    <div className="share-points">
                        <ul>
                            <li>
                                <LangText name="POINT_ONE" module="AVAIL_LOAN" />
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <LangText name="POINT_TWO" module="AVAIL_LOAN" />
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <LangText name="POINT_THREE" module="AVAIL_LOAN" />
                            </li>
                        </ul>
                    </div>
                </div>
                : 
                <div className="response-error">
                    {responseError}
                </div>
            }
                    
        </div>
    )
}
const mapStateToProps = ({ availLoanDetails, las }) => {
    return {
        userDetails: availLoanDetails.userDetails,
        DisburseResponse: availLoanDetails.DisburseResponse,
        responseData: las.responseData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeLoanDialogDetails: (s) => { dispatch(storeLoanDialogDetails(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeRecieveDialogDetails: (s) => { dispatch(storeRecieveDialogDetails(s)) },
        storeAvailLoanGetHoldingResponse: (s) => { dispatch(storeAvailLoanGetHoldingResponse(s)) },

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Loader(ReleaseShareRequestComponent)));

