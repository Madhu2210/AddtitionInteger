import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { MsfRequest, useFetch } from '../../../index'
import { checkEmpty, getBackOfficeBaseURL } from '../../../common/CommonMethods'
// import { LOCAL_STORAGE } from '../../../common/Constants'
import LangText from '../../../common/lang/LangText'
// import { getItemFromSessionStorage } from '../../../common/LocalStorage'
import { CopyTextIcon } from '../../common/FontIcons'
import { LAS_SERVICE_JOURNEY } from '../../../config/ServiceURLs'
import { Loader } from '../../common/LoaderComponent'

function RepaymentComponent(props) {
    
    const [titleCopyIfsc, setTitleCopyIfsc] = useState(false)
    const [copyAccNo, setCopyAccNo] = useState(false)
    const [emicopyIfsc,setEmicopyIfsc]=useState(false)
    const [emiCopyAccNo,setEmiCopyAccNo]=useState(false)
    const [repaymentDetails,setRepaymentDetails]=useState({})
    const [errMsg,setErrMsg]=useState('')
    const MsfFetch = useFetch();
    useEffect(() => {

        // let repaymentdata = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.LAS_REPAYMENT))
        // if (repaymentdata)
        //     setRepayData(repaymentdata)
        dispRepaymentDetail()
    }, [])
     
    function  dispRepaymentDetail(){
        props.showLoader();
        let request = new MsfRequest();
        request.addToData({           
            "lan": props.DisburseResponse ? props.DisburseResponse[0].lan : "",  
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICE_JOURNEY.REPAYMENT_DETAILS,
            request,
            successRespGetRepayDetails,
            errorRespCBpGetRepayDetails
        )
    }

    function  successRespGetRepayDetails(response){   
        setRepaymentDetails(response.data)
        props.hideLoader()
     
    }  

    function errorRespCBpGetRepayDetails(error){
        props.hideLoader()
        setErrMsg(error.message)
    }

    function copytoClipBoard(txt,section) {
        navigator.clipboard.writeText('' + txt)
        setTimeout(() => {
            if(section==='principal'){
                setTitleCopyIfsc(false)
            }
            else{
                setEmicopyIfsc(false)
            }    
        }, 1000)
        if(section==='principal'){
            setTitleCopyIfsc(true)
        }
        else{
            setEmicopyIfsc(true)
        } 
      
    }
    
    function copyClipBoardAcctNo(text,section) {
        navigator.clipboard.writeText('' + text)
        setTimeout(() => {
            if(section==='principal'){
                setCopyAccNo(false)
            }
            else{
                setEmiCopyAccNo(false)
            }
        }, 1000)
        if(section==='principal'){
            setCopyAccNo(true)

        }
        else{
            setEmiCopyAccNo(true)
        }
      
    }
    
    return (
        <div className="repayment-base">
            { errMsg ? 
                <div className="failure-error">
                    {errMsg}
                </div>
                :
                <div>
                    { repaymentDetails.isBoth ?
                        <div className="repayment-head">
                            <LangText name="INTEREST_PRINCIPAL_PAYMENT" module="AVAIL_LOAN" />
                        </div>
                        : (!repaymentDetails.isBoth && repaymentDetails.opt ==='emi') ?
                            <div className="repayment-head">
                                <LangText name="INTEREST_PAYMENT" module="AVAIL_LOAN" />
                            </div>
                            :
                            <div className="repayment-head">
                                <LangText name="PRINCIPLE_PAYMENT" module="AVAIL_LOAN" />
                            </div>
                    }
                    <div className="repayment-head-description">
                        <span className="e-collect-start">
                            <LangText name="E_COLLECT_START" module="AVAIL_LOAN" />
                        </span>
                        <span className="e-collect-middle">
                            <LangText name="E_COLLECT_DETAIL_MIDDLE" module="AVAIL_LOAN" />
                        </span>
                        <span className="e-collect-start">
                            <LangText name="E_COLLECT_DETAIL_END" module="AVAIL_LOAN" />
                        </span>
                    </div>

                    <div className="payment-details">
                        {repaymentDetails.isBoth || (!repaymentDetails.isBoth && repaymentDetails.opt != 'emi') ?   
                            <div className="princple-div">
                                { repaymentDetails.isBoth  ?
                                    <div className="principle-amt">
                                        <LangText name="PRNICIPLE_AMOUNT" module="AVAIL_LOAN" />
                                    </div>
                                    : null
                                }
                                <table className="payment-table">
                                    <tr>
                                        <td className="col-one">
                                            <LangText name="BENEFICIARY_NAME" module="AVAIL_LOAN" />
                         
                                        </td>
                                        <td className="collon"> :</td>
                                        <td className="col-two">
                                            <span>
                                                {checkEmpty(repaymentDetails.bfyName)}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="col-one">
                                            <LangText name="ACCOUNT_NO" module="AVAIL_LOAN" />
                           
                                        </td>
                                        <td className="collon"> :</td>
                                        <td className="col-two">

                                            { props.DisburseResponse && repaymentDetails ? 
                                            // checkEmpty(repayData.principleAcctNo + props.DisburseResponse[0].lan): ""}
                                                checkEmpty( repaymentDetails.pAcct): ""} 
                                            { repaymentDetails.pAcct ?

                                                <span className="copy-icon" onClick={() => 
                                                    copyClipBoardAcctNo(repaymentDetails.pAcct,'principal') }>
                                                    <div className="tooltip-div">
                                                        <div className={`tooltip-container right
                                    ${copyAccNo === true ? "show" : "hide"}`}>
                                                            <span className="title-msg"><LangText module="MESSAGES" 
                                                                name="COPIED_TO_CLIP" /></span>
                                    
                                                            <span className="triangle"></span>
                                                        </div>
                                                        <CopyTextIcon />
                                                    </div>
                                   
                                                </span>
                                                : ''
                                            } 
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="col-one">
                                            <LangText name="BANK_NAME" module="AVAIL_LOAN" />
                           
                                        </td>
                                        <td className="collon">:</td>
                                        <td className="col-two">

                                            {checkEmpty(repaymentDetails.bankName)}
                          
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="col-one">
                                            <LangText name="IFSC_CODE" module="AVAIL_LOAN" />
                           
                                        </td>
                                        <td className="collon"> :</td>
                                        <td className="col-two">

                                            {checkEmpty(repaymentDetails.ifsc)}
                                            { repaymentDetails.ifsc &&

                                <span className="copy-icon" onClick={() => 
                                    copytoClipBoard(repaymentDetails.ifsc,'principal')
                                }>
                                    <div className="tooltip-div">
                                        <div className={`tooltip-container right
                                    ${titleCopyIfsc === true ? "show" : "hide"}`}>
                                            <span className="title-msg"><LangText module="MESSAGES" 
                                                name="COPIED_TO_CLIP" /></span>
                                    
                                            <span className="triangle"></span>
                                        </div>
                                        <CopyTextIcon />
                                    </div>
                                   
                                </span>
                                            }
                           
                                        </td>
                                    </tr>
                                    <tr >
                                        <td className="col-one">
                                            <LangText name="BRANCH_NAME" module="AVAIL_LOAN" />
                          
                                        </td>
                                        <td className="collon"> :</td>
                                        <td className="col-two">
                                            {checkEmpty(repaymentDetails.bnkAdrs)}
                                        </td>
                                    </tr>
          
                                </table>
                            </div>
                            : null } 
                        {repaymentDetails.isBoth || (!repaymentDetails.isBoth && repaymentDetails.opt === 'emi') ?      
                            <div className="emi-div">
                                { repaymentDetails.isBoth ?
                                    <div className="emi-amount">
                                        <LangText name="EMI_AMOUNT" module="AVAIL_LOAN" />
                                    </div>
                                    : null
                                } 
                                <table className="payment-table">
                                    <tr>
                                        <td className="col-one">
                                            <LangText name="BENEFICIARY_NAME" module="AVAIL_LOAN" />
                         
                                        </td>
                                        <td className="collon"> :</td>
                                        <td className="col-two">
                                            <span>
                                                {checkEmpty(repaymentDetails.bfyName)}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="col-one">
                                            <LangText name="ACCOUNT_NO" module="AVAIL_LOAN" />
                           
                                        </td>
                                        <td className="collon"> :</td>
                                        <td className="col-two">

                                            { props.DisburseResponse && repaymentDetails ? 
                                                checkEmpty(repaymentDetails.eAcct ): ""}
                                            { repaymentDetails.eAcct ?

                                                <span className="copy-icon" onClick={() => 
                                                    copyClipBoardAcctNo(repaymentDetails.eAcct ,'emi') }>
                                                    <div className="tooltip-div">
                                                        <div className={`tooltip-container right
                                    ${emiCopyAccNo === true ? "show" : "hide"}`}>
                                                            <span className="title-msg"><LangText module="MESSAGES" 
                                                                name="COPIED_TO_CLIP" /></span>
                                    
                                                            <span className="triangle"></span>
                                                        </div>
                                                        <CopyTextIcon />
                                                    </div>
                                   
                                                </span>
                                                : ''
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="col-one">
                                            <LangText name="BANK_NAME" module="AVAIL_LOAN" />
                           
                                        </td>
                                        <td className="collon">:</td>
                                        <td className="col-two">

                                            {checkEmpty(repaymentDetails.bankName)}
                          
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="col-one">
                                            <LangText name="IFSC_CODE" module="AVAIL_LOAN" />
                           
                                        </td>
                                        <td className="collon"> :</td>
                                        <td className="col-two">

                                            {checkEmpty(repaymentDetails.ifsc)}
                                            { repaymentDetails.ifsc &&

                                <span className="copy-icon" onClick={() => 
                                    copytoClipBoard(repaymentDetails.ifsc,'emi')
                                }>
                                    <div className="tooltip-div">
                                        <div className={`tooltip-container right
                                    ${emicopyIfsc === true ? "show" : "hide"}`}>
                                            <span className="title-msg"><LangText module="MESSAGES" 
                                                name="COPIED_TO_CLIP" /></span>
                                    
                                            <span className="triangle"></span>
                                        </div>
                                        <CopyTextIcon />
                                    </div>
                                   
                                </span>
                                            }
                           
                                        </td>
                                    </tr>
                                    <tr >
                                        <td className="col-one">
                                            <LangText name="BRANCH_NAME" module="AVAIL_LOAN" />
                          
                                        </td>
                                        <td className="collon"> :</td>
                                        <td className="col-two">
                                            {checkEmpty(repaymentDetails.bnkAdrs)}
                                        </td>
                                    </tr>

                                </table>
                            </div>
                            : null 
                        }
                    </div>
                    <div className="payment-content">
                        <ul className="payment-list">
                            <li>
                                <div>
                                    <LangText name="PAYMENT_DETAILS_ONE" module="AVAIL_LOAN" />
                                </div>
                            </li>
                        </ul>
                        <ul className="payment-list">
                            <li>
                                <div>
                                    <LangText name="PAYMENT_DETAILS_TWO" module="AVAIL_LOAN" />
                                </div>
                            </li>
                        </ul>
                        <ul className="payment-list">
                            <li>
                                <div>
                                    <LangText name="PAYMENT_DETAILS_THREE" module="AVAIL_LOAN" />
                                    <span className="las-crm">
                                        <a href="mailto:las.crm@bajajfinserv.in" 
                                            target="_blank" rel="noopener noreferrer"> 
                                            <LangText name="LAS_CRM" module="AVAIL_LOAN" />               
                                        </a>
                                    
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            }
        </div>
    )
}
const mapStateToProps = ({ availLoanDetails }) => {
 
    return {
       
        DisburseResponse: availLoanDetails.DisburseResponse,
       
    }
}
export default connect(mapStateToProps)(Loader(RepaymentComponent))
