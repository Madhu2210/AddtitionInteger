import React,{useState,useEffect,useRef} from 'react'
import { connect } from 'react-redux'
import { MsfRequest, useFetch } from '../../../index'
import { checkEmpty, checkInt, convertCommaSeparated, getBackOfficeBaseURL,
    getFormatedDate, replaceComma } from '../../../common/CommonMethods'
import { AVAIL_LOAN_DIALOGS, DATE_FORMATS, LOCAL_STORAGE } from '../../../common/Constants'
import LangText, { getLangText } from '../../../common/lang/LangText'
import { showAppDialog, storeAvailLoanDialogDetails, 
    storeAvailLoanEligibleAmount, 
    storeAvailLoanGetLoanFailure, 
    storeAvailLoanPledgeRefreshFlag, 
    storeLoanDialogDetails, storerRecheckmsg, storeSelectedAddPldgeData } from '../../../state/actions/Actions'
import { Add_icon, Checkbox_nor, Checkbox_sel, Less_icon, Pledge_icon,
    Refrsh_icon } from '../../common/FontIcons'
// import { LAS_SERVICE_JOURNEY } from '../../../config/ServiceURLs'
import { Loader } from '../../common/LoaderComponent'
import { LAS_SERVICES, LAS_SERVICE_JOURNEY } from '../../../config/ServiceURLs'
import { getItemFromSessionStorage } from '../../../common/LocalStorage'
import InputComponent from '../../common/InputComponent'

function AdditionalPledgeComponent(props) {
    const [lastDay, setLastDay] = useState('')
    const [check, setCheck] = useState(true)
    const [selectedsymLists, setSelectedSymsLists] = useState([])
    // const [isEditablee, setIsEditablee] = useState(false)
    const [isEditables, setIsEditables] = useState(false)
    const [sharesDetails, setsharesDetails] = useState([])
    const [resets, setResets] = useState(false)
    const [lasData, setLasData] = useState({})
    const [errorMsg, setErrorMsg] = useState(null)
    const [pShares, setPshares] = useState([])
    // const [ setResponseData] = useState({})
    const [finalVal, setFinalVal] = useState('');
    const [accountDetail, setAccountDetail] = useState([])
    const [isloanAmt,setIsLoanAmt]=useState(false)
    const MsfFetch = useFetch();
    const sucessShares = useRef([])

    useEffect(() => {
        props.storeAvailLoanPledgeRefreshFlag(false) 
        // if (props.responseData) {
        //     setResponseData(props.responseData)
        // }
        let lasDatas = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.LAS_HELP))
        if(lasDatas){
            setLasData(lasDatas)
        }

    }, [])
    useEffect(() => {
        let yesterday = getFormatedDate("", -1, DATE_FORMATS.DDMMMYYYY)
        setLastDay(yesterday.stringDate)

    }, [])
    // useEffect(() => {

    //     if (props.responseData) {
    //         getAvailableShare()
    //         // getUserDetails()
    //     }
    // }, [])
    useEffect(() => {
        if(props.responseData){    
            getAvailableShare()
            getUserDetails()
        }
        if(props.getPledgeRefresh){
            getAvailableShare()
           
        }
    }, [resets,props.getPledgeRefresh])

    useEffect(() => {

        if (sharesDetails) {
            let allchecked = true
            let listofshares = Object.assign([], sharesDetails)
            listofshares.map((item) => {
                if (!item.isOpen || item.qty !== item.initQty)
                    allchecked = false
                return allchecked
            })
            if (allchecked) {
                // setIsEditables(false)
                setSelectedSymsLists(sharesDetails)
            }
            let checkList = Object.assign([], sharesDetails)
            let checkedSyms = checkList.filter(item => item.isOpen)
            let totalval = 0;
            checkedSyms.map((item) => {
                let qty = replaceComma(item.qty)
                let val = replaceComma(item.clRte)
                totalval = totalval + (qty * val)

            })

            setFinalVal(totalval)
        }
    }, [sharesDetails])

    function getAvailableShare() {
        props.showLoader();
        let request = new MsfRequest();
        setErrorMsg(null)
        // request.addToData({ loanId: props.responseData.loanId })
        request.addToData({
            "loanId": props.responseData ? props.responseData.loanId : "",
            "lan": props.DisburseResponse ? props.DisburseResponse[0].lan : "",
            "eligibleAmt": props.responseData ? props.responseData.elgAmnt  : ""

        })
        
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() +  LAS_SERVICE_JOURNEY.ADDITIONAL_PLEDGING,
            request,
            successRespCBGetShares,
            errorRespCBGetShares
        )
    }

    function successRespCBGetShares(response){
        setPshares(response.data)
        let shares = response.data.shares
        shares = shares.map((item) => {
            let qty = replaceComma(item.qty)
            let clRte = replaceComma(item.clRte)
            item.maxVal = convertCommaSeparated(qty * clRte)
            item.isOpen = true
            item.initQty = item.qty
            return item
        })
        sucessShares.current = JSON.parse(JSON.stringify(shares))
        setSelectedSymsLists(JSON.parse(JSON.stringify(shares)))
        setsharesDetails(JSON.parse(JSON.stringify(shares)))
        setErrorMsg(null)
        props.hideLoader();
        
    }

    function errorRespCBGetShares(error){
        setErrorMsg(error.message)
        // props.showAppDialog({
        //     message: error.message,
        //     show: true
        // })
        props.hideLoader();
    }

    function getUserDetails(){
        let request = new MsfRequest();
        request.addToData({ loanId: props.responseData ? props.responseData.loanId : ""  })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.GET_KYC,
            request,
            successRespCBGetKYC,
            errorRespCBGetKYC
        )
    }

    function successRespCBGetKYC(response) {
        setAccountDetail(response.data.accntDtls)
        // props.hideLoader()

    }

    function errorRespCBGetKYC(error) {
     
        props.showAppDialog({
            message: error.message,
            show: true
        })
        // props.hideLoader()
    }

    function getLoanAmount(){
       
        setIsLoanAmt(true)
        props.showLoader();
        let request = new MsfRequest();
        let sharesList = Object.assign([], sharesDetails)
        let selectedSyms = sharesList.filter(item => item.isOpen)
        selectedSyms = selectedSyms.map((item => {
            let qty = replaceComma(item.qty)
            let clRte = replaceComma(item.clRte)
            item.totHldVal = convertCommaSeparated(qty * clRte)
            return item

        }))
        setSelectedSymsLists(selectedSyms)
        request.addToData({

            "loanId": props.responseData ? props.responseData.loanId : "",
            "sacntnAmt": props.DisburseResponse ? props.DisburseResponse[0].sacntnAmt : "",
            "optAmt": pShares.optAmt,
            "pShares": selectedSyms
        })
        
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICE_JOURNEY.GET_LOAN_AMOUNT,
            request,
            successRespCBAGetLoanAmout,
            errorRespCBAGetLoanAmout
        )
    }

    function  successRespCBAGetLoanAmout(response){
        
        sucessShares.current = JSON.parse(JSON.stringify(sharesDetails))
       
        if (response.data.isContinue) {
            props.storeAvailLoanEligibleAmount(response.data.eligibleAmt)
            props.storeLoanDialogDetails({
                dialogName: AVAIL_LOAN_DIALOGS.LOAN_DETAILS
            })
        }

        props.hideLoader()
    }

    function  errorRespCBAGetLoanAmout(error){
        props.storeAvailLoanGetLoanFailure(error.message)
        props.hideLoader();
        // setErrorMsg(error.message)
        if (error.infoID === "LAS007") {
            props.storeLoanDialogDetails({
                dialogName:AVAIL_LOAN_DIALOGS.LOAN_AMOUNT_FAILURE
            })

        } else if (error.infoID === "LAS008") {
            setErrorMsg(error.message)
        } 
        else if (error.infoID === "LAS009") {
            setErrorMsg(error.message)
        } 
        else {
            props.showAppDialog({

                message: error.message,
                show: true
            })
        
        }
       
        setsharesDetails(JSON.parse(JSON.stringify(sucessShares.current)))
        let pledgeList = JSON.parse(JSON.stringify(sucessShares.current))
        let sucesspledge = pledgeList.filter(item => item.isOpen)
        setSelectedSymsLists(sucesspledge)
        setCheck(true)
        setIsLoanAmt(false)
        props.hideLoader()
    }
    const toggleItem = inx => {
        setIsLoanAmt(false)
        let selectedData=[]
        let sharesData = Object.assign([], sharesDetails)
       
        sharesData[inx]['isOpen'] = !sharesData[inx]['isOpen']
        sharesData.map((item) => {
            if(item.isOpen === true)
                selectedData.push(item)
        })
        
        if(selectedData.length <= 0){
            
            setCheck(false)
        }
        else{
            setCheck(true)
        }
        // if(selectedData.length === sharesData.length){
        //     setCheck(true)
        // }
        setsharesDetails(sharesData)
        // let sucessData = Object.assign([], sucessShares.current)
        // sucessData[inx]['isOpen'] = !sucessData[inx]['isOpen']
        // sucessShares.current = sucessData
    
        setIsEditables(true)
    }

    function subQty(index) {
        // setIsLoanAmt(false)
        let details = Object.assign([], sharesDetails)
        let qty = parseInt(replaceComma(details[index]['qty']))
        if (qty > 1) {
    
            qty = convertCommaSeparated((qty - 1), 0)
    
            details[index]['qty'] = qty
            if (details[index].isOpen)
            {
                setIsEditables(true)
                setIsLoanAmt(false)

            } 
            // else{
            //     setIsLoanAmt(true)
            // }   
            setsharesDetails(details)
       
        }
    
    }

    function addQty(index) {
        // setIsLoanAmt(false)
        let details = Object.assign([], sharesDetails)
        let qty = parseInt(replaceComma(details[index].qty))
        let maxQty = parseInt(replaceComma(details[index].initQty))

        if (qty < maxQty) {
            qty = convertCommaSeparated((qty + 1), 0)

            details[index].qty = qty
            if (details[index].isOpen){
                setIsEditables(true)
                setIsLoanAmt(false)
            } 
            // else
            // {
            //     setIsLoanAmt(true)
            // }
            setsharesDetails(details)
        }

    }

    function onclickChecking(){
        let symbols = Object.assign([], sharesDetails)
        symbols = symbols.map((item) => {
            item.isOpen = true
            return item
        })
        setsharesDetails(symbols)
        setCheck(true)
        setIsLoanAmt(false)
    } 

    function onclickUnChecking()
    {
        let symbols = Object.assign([], sharesDetails)
        symbols = symbols.map((item) => {
            item.isOpen = false
            return item
        })
        setIsLoanAmt(false)
        setsharesDetails(symbols)
        setCheck(false)
    }

    function  resetAll() {
        setIsLoanAmt(false)
        setResets(!resets)
        setCheck(true)

    }

    function totAmtShares(quantity, clRate) {

        let qty = replaceComma(quantity)
        let clRte = replaceComma(clRate)
        let totAmtshare = qty * clRte
        return convertCommaSeparated(totAmtshare)

    }

    function onClickAdditionalPledge(){  
        props.storeLoanDialogDetails({
            dialogName: AVAIL_LOAN_DIALOGS.ADDITIONAL_PLEDGE_CONFIRM
        })
        props.storeSelectedAddPldgeData(selectedsymLists)
    }   
        
    //     let request = new MsfRequest();
    //     request.addToData({
    //         loanId: props.responseData ? props.responseData.loanId : "",
    //         pShares: 
    //     })
    //     MsfFetch.placeRequest(
    //         getBackOfficeBaseURL() + LAS_SERVICE_JOURNEY.CONFIRM_ADDITIONAL_SHARE,
    //         request,
    //         successRespConfirmShares,
    //         errorRespConfirmShares
    //     )
    // }

    // function  successRespConfirmShares(){
    //     props.hideLoader();
    //     generateOtp()
    // }

    // function errorRespConfirmShares(){
    //     props.hideLoader();
       
    // }

    // function generateOtp() {
    //     let request = new MsfRequest();
    //     request.addToData({
    //         loanId: props.responseData ? props.responseData.loanId : "",
    //         mode: "P"
    //     })

    //     MsfFetch.placeRequest(
    //         getBackOfficeBaseURL() + LAS_SERVICES.GENERATE_OTP,
    //         request,
    //         successRespCBGetOtp,
    //         errorRespCBGetOtp
    //     )
    // }

    // function  successRespCBGetOtp(){
       
    //     props.hideLoader();
    //     props.storeLoanDialogDetails({
    //         dialogName: AVAIL_LOAN_DIALOGS.EPLEDGE_OTP_VERIFICATION
    //     })

    // }

    // function  errorRespCBGetOtp(){
    //     props.hideLoader();
    // }

    function onChangeQtys(e, index){
        let qty = e.target.value
        let details = Object.assign([], sharesDetails)
        if (qty) {
            if (checkInt(qty)) {
                details[index].qty = qty
            }
        } else {
            details[index].qty = ''
        }
        setsharesDetails(details)
        setIsLoanAmt(false)
    }

    function onBlurQtys(index){
        setIsLoanAmt(false)
        let details = Object.assign([], sharesDetails)
        let qty = parseInt(replaceComma(details[index].qty))
        let maxQty = parseInt(replaceComma(details[index].initQty))

        if (qty) {
            if (qty > maxQty) {
                props.showAppDialog({
                    message: getLangText('INVALID_QTY', 'LAS'),
                    show: true
                })
                details[index].qty = maxQty
                setsharesDetails(details)
            }

        } else {
            details[index].qty = maxQty
            setsharesDetails(details)

        }
    }

    function getReCheckEligibleFlag() {
        let flag = false
        let details = Object.assign([], sharesDetails)
        let changedQty = false
        details.map((item) => {
            if (item.qty != item.initQty) {
               
                changedQty = true
                
            }

            if (!item.isOpen){
                flag = true
            }
        })
        if (changedQty){
            flag = true
        }

        if (isloanAmt){
            flag = false
        } 
        return flag
       
    }
    
    return (
        <div className="additional-Pledge-Base">
            <div className="epledge-heading">
                <LangText module="AVAIL_LOAN" name="E_PLEDGE_HEAD" />
            </div>
            <div className="e-pledgeContent">
                <span>
                    <LangText module="LAS" name="E_PLEDGE_INFO" />{lastDay}.
                    <LangText module="LAS" name="E_PLDGE_INFO" />
                </span>
            </div>
            <div className="e-pledge-cdsl-content">
                <div className="epledge-data">
                    <div className="val">
                        <span className="label">
                            <LangText module="LAS" name="YOUR_DEMAT" />
                        </span>
                        <div className="value">

                            <div className="row">
                                <span className="row-label">
                                    <LangText module="LAS" name="CDSL" />
                                </span>
                                <span className="client-no">
                                    {checkEmpty(accountDetail.dpId)}
                                </span>
                            </div>

                            <span className="line-seperate"></span>
                            <div className="row">
                                <span className="row-label">
                                    <LangText module="LAS" name="CLIENT_ID" />
                                </span>
                                <span className="client-no">
                                    {checkEmpty(accountDetail.dmatId)}
                                </span>
                            </div>

                        </div>
                    </div>
                    <div className="val icon-div-pld">
                        <span className="right-icon">
                            <span className={`bfsl-font-2 righticon`}> 
                                <Pledge_icon />
                            </span>
                        </span>

                        <span className="labelpledg">
                            <LangText module="LAS" name="PLEDGE_LAS" />
                        </span>
                    </div>
                    <div className="val">
                        <span className="label">
                            <LangText module="AVAIL_LOAN" name="BF_DEMAT" />
                        </span>
                        <div className="value">

                            <div className="row">
                                <span>
                                    <LangText module="LAS" name="CDSL" />
                                </span>
                                <span>{checkEmpty(lasData.bflDPid)}</span>
                            </div>
                            <span className="line-seperate"></span>
                            <div className="row">
                                <span className="row-label">
                                    <LangText module="LAS" name="CLIENT_ID" />
                                </span >
                                <span className="client-no">
                                    {checkEmpty(accountDetail.dmatId)}
                                </span>
                            </div >

                        </div>
                    </div>
                </div>
            </div>
            <div className="epledge-pleding-top-head">
                { (sharesDetails && sharesDetails.length) ?
                    <div>
                        <div className="epledge-share-reset">
                            <span className="epledge-share">
                                <LangText module="AVAIL_LOAN" name="E_PLEDGE_SHARE" />
                            </span>
                            {isEditables ?
                                <div className="reset-div" >
                                    <span className={`bfsl-font-2 refrshicon`}>
                                        <Refrsh_icon />
                                    </span>
                                    <span className="reset" onClick={resetAll}>
                                        <LangText module="LAS" name="RESET_ALL" />
                                    </span>
                                </div>
                                : ""}

                        </div>
           
                        <table className="epledge-table">
                            <thead className="epledge-thead">
                                <tr>
                                    <th className="firstChild width24 head-label">
                                        <div className="symbol-head">

                                            <span className={`bfsl-font-2 ${!check ? "checkboxnor" :
                                                "active-checkboxnor"}`}>
                                                {!check ?
                                                    <Checkbox_nor onClick={onclickChecking} />
                                                    :
                                                    <Checkbox_sel onClick={onclickUnChecking} />}

                                            </span>
                                            <div className="head-label">
                                                <span className="symbol">
                                                    <LangText module="TABLE_HEADERS" name="SYMBOL" />
                                                </span>
                                                <span className="isin">

                                                    <LangText module="LAS" name="ISIN_HEAD" />
                                                </span>
                                            </div>
                                        </div>
                                    </th>
                                    <th className="head-label">
                                        <span className="change-per">
                                            <LangText module="TABLE_HEADERS" name="TOTAL_AMT" />
                                        </span>
                                    </th>
                                    <th className="head-label">
                                        <span className="">
                                            <LangText module="TABLE_HEADERS" name="PLEDGE_QTY" />
                                        </span>
                                    </th>
                                    <th className="head-label">
                                        <span className="ltp">
                                            <LangText module="TABLE_HEADERS" name="AMOUNT_SHARES" />
                                        </span>
                                    </th>

                                    {/* <th className="width4 iconCol">
                        </th> */}
                                </tr>
                            </thead>
                            <tbody className="tbody-scrollers">
                                {
                            
                                    sharesDetails.map((item, index) => {
                                        return (
                                    
                                            <tr className="content-main-row" key={index}>
                                                <td className="firstChild width24">

                                                    <div className="symName-columns">
                                                        <span className={`bfsl-font-2 ${!item.isOpen ? "checkboxnor" :
                                                            "active-checkboxnor"}`}>
                                                            {!item.isOpen ?
                                                                <Checkbox_nor onClick={() => toggleItem(index)} />
                                                                :
                                                                <Checkbox_sel onClick={() => toggleItem(index)} />}

                                                        </span>
                                                        <div className="row-datas">
                                                            <span className="baseSym text-nowraps">

                                                                {item.scrpNme}
                                                            </span>
                                                            <div>
                                                                <span className="baseSym text-nowraps isinn">

                                                                    {item.isin}
                                                                </span>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </td>
                                                <td className="maxValue">
                                                    <span className={`${item.chngClass}`}>
                                                        {checkEmpty(item.maxVal)}</span>
                                                </td>
                                                <td className="pldQnty">
                                                    <div className="pledgeQtys">
                                                        <div className="border" >
                                                            <span>
                                                                <Less_icon onClick={() => subQty(index)} />
                                                            </span>
                                                   
                                                            <InputComponent
                                                                type="text"
                                                                className="input-qtys"
                                                                value={item.qty}
                                                                onChange={(e) => onChangeQtys(e, index)}
                                                                onBlur={() => onBlurQtys(index)}
                                                                disabled={!item.isOpen}

                                                            />
                                                            <span>
                                                                <Add_icon onClick={() => addQty(index)} />
                                                            </span>
                                                        </div>

                                                        <div className="qty">{item.qty ? '/ ' : ''}
                                                            {checkEmpty(item.initQty)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="qty-border">
                                                    <span className={`border-qtys ${item.qty}`}>
                                                        {totAmtShares(item.qty, item.clRte)}</span>

                                                </td>
                                                {/* <td>aaa</td>
                                        <td>aaa</td>
                                        <td>aaa</td>
                                        <td>aaa</td> */}

                                            </tr>
                                    
                                        )
                                    })
                                
                                    // <tr className="errorRow">
                                    //     <td className="colspan">
                                    //         <span> {errorMsg} </span> 
                                    //     </td>
                                    // </tr>
                            
                                }
                            </tbody>
               
                        </table>
           
                        <div className="pledge-footer">
                            <div>
                 
                                <button 
                                    className={`las-negativeBtn getloan-btn ${getReCheckEligibleFlag() ?
                                        "active" : ""}`}
                                    disabled={!getReCheckEligibleFlag()}
                                    onClick={getReCheckEligibleFlag() ? getLoanAmount : null} >
                                    <LangText module="BUTTONS" name="GET_LOAN_AMOUNT" />
                                </button>
                                <button className="las-positivebtn pledge-btn"
                                    disabled={getReCheckEligibleFlag() ? 'disabled' : ""}
                                    onClick={getReCheckEligibleFlag() ? null : onClickAdditionalPledge}
                                >

                                    <LangText module="BUTTONS" name="E_PLEDGE" />
                                </button>
                            </div>
                            <div>
                                <span className="label">
                                    <LangText module="AVAIL_LOAN" name="SANCTION_LIMIT" />
                                </span>
                                <span className="value">{pShares.sntnLimit? '₹ ' : ''}
                                    {checkEmpty(pShares.sntnLimit)}</span>
                                <span className="label">
                                    <LangText module="AVAIL_LOAN" name="PLEDGED_SHARES" /> 
                                </span>
                                <span className="value">{finalVal ? '₹ ' : ''}
                                    {checkEmpty(convertCommaSeparated(finalVal))}</span>
                            </div>
                        </div>  
                    </div>
                    :
                    <div className="errorRow">
                        <span className="colspan">
                            {errorMsg}
                        </span>
                    </div>
               
                }  
            </div>              
        </div>            
       
    )
}
const mapStateToProps = ({las , availLoanDetails }) => {  
    return {
    
        responseData: las.responseData,
        DisburseResponse: availLoanDetails.DisburseResponse,
        dialogDetails: availLoanDetails.dialogComponent,
        getPledgeRefresh: availLoanDetails.getPledgeRefresh

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeLoanDialogDetails: (s) => { dispatch(storeLoanDialogDetails(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) },
        storerRecheckmsg: (s) => { dispatch(storerRecheckmsg(s)) },
        storeAvailLoanGetLoanFailure: (s) => { dispatch(storeAvailLoanGetLoanFailure(s)) },
        storeAvailLoanEligibleAmount: (s) => { dispatch(storeAvailLoanEligibleAmount(s)) },
        storeAvailLoanPledgeRefreshFlag: (s) => { dispatch(storeAvailLoanPledgeRefreshFlag(s)) },
        storeSelectedAddPldgeData: (s) => { dispatch(storeSelectedAddPldgeData(s)) }

    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Loader(AdditionalPledgeComponent))
