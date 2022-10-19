import useFetch from '@msf/msf-reactjs-weblib-base';
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux';
import { MsfRequest } from '../../..';
import {
    AF_EventTriggered,
    checkEmpty, checkInt, convertCommaSeparated,
    getBackOfficeBaseURL, getFormatedDate, replaceComma
} from '../../../common/CommonMethods';
import { AF_EVENT_NAMES, AF_EVENT_TYPES, DATE_FORMATS, LAS_LOAN_DIALOGS, LOCAL_STORAGE } 
from '../../../common/Constants';
import LangText, { getLangText } from '../../../common/lang/LangText'
import { getItemFromSessionStorage } from '../../../common/LocalStorage';
import { LAS_SERVICES } from '../../../config/ServiceURLs';
import { showAppDialog, storeAvailLoanDialogDetails, storePledgeEligblAmt, storerRecheckmsg, 
    storeSelectedPledgeList, 
    storeUserLoanAmt 
} from '../../../state/actions/Actions';
import { Add_icon, Checkbox_nor, Checkbox_sel, Less_icon, Pledge_icon, Refrsh_icon } from '../../common/FontIcons';
import InputComponent from '../../common/InputComponent';
import { Loader } from '../../common/LoaderComponent';

function EPledgeComponent(props) {
    const MsfFetch = useFetch()
    const [reset, setReset] = useState(false)
    const [check, setCheck] = useState(true)
    const [sharesDetails, setsharesDetails] = useState([])
    const [selectedsymList, setSelectedSymsList] = useState([])
    const [isEpledge, setEpledge] = useState(false)
    const [lasData, setLasData] = useState({})
    const [pShares, setPshares] = useState([])
    const [accountDetails, setAccountDetails] = useState({})
    const [errorMsg, setErrorMsg] = useState(null)
    const [lastDay, setLastDay] = useState('')
    const [responseData, setResponseData] = useState({})
    const [finalVal, setFinalVal] = useState('');
    const [eligibleAmnt, setEligblAmnt] = useState(props.responseData.optAmt)

    const sucessShares = useRef([])

    useEffect(() => {
        if (props.responseData) {
            setResponseData(props.responseData)
        }
        let lasDatas = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.LAS_HELP))
        if (lasDatas)
            setLasData(lasDatas)
    }, [])

    useEffect(() => {
        let yesterday = getFormatedDate("", -1, DATE_FORMATS.DDMMMYYYY)
        setLastDay(yesterday.stringDate)

    }, [])

    useEffect(() => {

        if (props.responseData) {
            getAvailableShares()
            getUserDetails()
            setEligblAmnt(props.responseData.optAmt)
        }
    }, [reset])

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
                setSelectedSymsList(sharesDetails)
                if (props.responseData)
                    setEligblAmnt(props.responseData.optAmt)
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

    function getAvailableShares() {
        props.showLoader();
        let request = new MsfRequest();
        setErrorMsg(null)
        request.addToData({ loanId: props.responseData ? props.responseData.loanId : "" })

        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.GET_SHARES,
            request,
            successRespCBGetShares,
            errorRespCBGetShares
        )
    }

    function successRespCBGetShares(response) {
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
        setSelectedSymsList(JSON.parse(JSON.stringify(shares)))
        setsharesDetails(JSON.parse(JSON.stringify(shares)))
        setErrorMsg(null)
        props.hideLoader();
    }

    function errorRespCBGetShares(error) {
        setErrorMsg(error.message)
        // props.showAppDialog({
        //     message: error.message,
        //     show: true
        // })
        props.hideLoader();

    }

    function getUserDetails() {
        let request = new MsfRequest();
        request.addToData({ loanId: props.responseData ? props.responseData.loanId : "" })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.GET_KYC,
            request,
            successRespCBGetKYC,
            errorRespCBGetKYC
        )
    }

    function successRespCBGetKYC(response) {
        setAccountDetails(response.data.accntDtls)

    }

    function errorRespCBGetKYC(error) {
        console.log(error.message)
    }

    function recheckEligibility() {
        setEpledge(true)
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
        setSelectedSymsList(selectedSyms)
        request.addToData({

            "loanId": responseData.loanId,
            "optAmt": pShares.optAmt,
            "pShares": selectedSyms
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.RECHECK_ELIGIBITY,
            request,
            successRespCBARecheck,
            errorRespCBRecheck
        )
    }

    function successRespCBARecheck(response) {
        sucessShares.current = JSON.parse(JSON.stringify(sharesDetails))
        if (response.data.isContinue) {
            setEligblAmnt(response.data.elgAmnt)
            props.storeUserLoanAmt(response.data.elgAmnt)
            props.storeAvailLoanDialogDetails({
                dialogName: LAS_LOAN_DIALOGS.RECHECK_SUCCESS
            })
        }

        props.hideLoader()
        AF_EventTriggered(AF_EVENT_NAMES.LAS , AF_EVENT_TYPES.RECHECK_SUCCESS)
    }

    function errorRespCBRecheck(error) {
        if (error.infoID == "LAS001") {
            props.storerRecheckmsg(error.message)
            props.storeAvailLoanDialogDetails({
                dialogName: LAS_LOAN_DIALOGS.RECHECK_SORRY
            })
        } else {
            props.showAppDialog({
                message: error.message,
                show: true
            })
        }
        setsharesDetails(JSON.parse(JSON.stringify(sucessShares.current)))
        let pledgeList = JSON.parse(JSON.stringify(sucessShares.current))
        let sucesspledge = pledgeList.filter(item => item.isOpen)
        setSelectedSymsList(sucesspledge)
        props.hideLoader()
        AF_EventTriggered(AF_EVENT_NAMES.LAS , AF_EVENT_TYPES.RECHECK_FAILURE)

    }

    const toggleItem = inx => {
        setEpledge(false)
        let sharesData = Object.assign([], sharesDetails)
        sharesData[inx]['isOpen'] = !sharesData[inx]['isOpen']
        setsharesDetails(sharesData)
        // let sucessData = Object.assign([], sucessShares.current)
        // sucessData[inx]['isOpen'] = !sucessData[inx]['isOpen']
        // sucessShares.current = sucessData
    }

    function subQty(index) {

        let details = Object.assign([], sharesDetails)
        let qty = parseInt(replaceComma(details[index]['qty']))
        if (details[index].isOpen) {
            if (qty > 1) {

                qty = convertCommaSeparated((qty - 1), 0)

                details[index]['qty'] = qty
                setsharesDetails(details)
            }
            setEpledge(false)
        }

    }
    function addQty(index) {

        let details = Object.assign([], sharesDetails)
        let qty = parseInt(replaceComma(details[index].qty))
        let maxQty = parseInt(replaceComma(details[index].initQty))
        if (details[index].isOpen) {
            if (qty < maxQty) {
                qty = convertCommaSeparated((qty + 1), 0)

                details[index].qty = qty
                setsharesDetails(details)
            }
            setEpledge(false)
        }

    }
    function onClickPledge() {
        props.storeAvailLoanDialogDetails({
            dialogName: LAS_LOAN_DIALOGS.EPLEDGE_CONFIRM
        })
        props.storeSelectedPledgeList(selectedsymList)
        props.storePledgeEligblAmt(eligibleAmnt)
    }
    // props.showLoader();
    //     let request = new MsfRequest();
    //     request.addToData({
    //         loanId: responseData.loanId,
    //         amnt:eligibleAmnt,
    //         pShares: selectedsymList  
    //     })
    //     MsfFetch.placeRequest(
    //         getBackOfficeBaseURL() + LAS_SERVICES.CONFIRM_SHARES,
    //         request,
    //         successRespConfirmShare,
    //         errorRespConfirmShare
    //     )
    // }

    // function successRespConfirmShare() {
    //     generateOtp()

    // }

    // function errorRespConfirmShare(error) {
    //     props.hideLoader()
    //     props.showAppDialog({
    //         message: error.message,
    //         show: true
    //     })

    // }

    // function generateOtp() {
    //     let request = new MsfRequest();
    //     request.addToData({
    //         loanId: responseData.loanId,
    //         mode: "L"
    //     })

    //     MsfFetch.placeRequest(
    //         getBackOfficeBaseURL() + LAS_SERVICES.GENERATE_OTP,
    //         request,
    //         successRespCBGetOtp,
    //         errorRespCBGetOtp
    //     )
    // }

    // function successRespCBGetOtp() {
    //     props.hideLoader();
    //     props.storeAvailLoanDialogDetails({
    //         dialogName: LAS_LOAN_DIALOGS.OTP_VERIFICATION
    //     })

    // }

    // function errorRespCBGetOtp(error) {
    //     props.hideLoader()
    //     props.showAppDialog({
    //         message: error.message,
    //         show: true
    //     })

    // }
    function resetAll() {
        setReset(!reset)
        setCheck(true)

    }
    function totAmtShares(quantity, clRate) {

        let qty = replaceComma(quantity)
        let clRte = replaceComma(clRate)
        let totAmtshare = qty * clRte
        return convertCommaSeparated(totAmtshare)

    }
    function onclickCheck() {
        setEpledge(false)
        let symbols = Object.assign([], sharesDetails)
        symbols = symbols.map((item) => {
            item.isOpen = true
            return item
        })
        setsharesDetails(symbols)
        setCheck(true)
    }

    function onclickUnCheck() {
        let symbols = Object.assign([], sharesDetails)
        symbols = symbols.map((item) => {
            item.isOpen = false
            return item
        })
        setsharesDetails(symbols)
        setCheck(false)
        setEpledge(false)
    }

    function onChangeQty(e, index) {
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
        setEpledge(false)
    }
    function onBlurQty(index) {
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
        setEpledge(false)
    }

    function getReCheckEligFlag() {
        let flag = false
        let details = Object.assign([], sharesDetails)
        let changedQty = false
        details.map((item) => {
            if (item.qty != item.initQty) {
                changedQty = true
            }

            if (!item.isOpen)
                flag = true
        })
        if (changedQty)
            flag = true
        if (isEpledge)
            flag = false
        return flag
    }

    return (
        <div className="epledge-base">
            <div className="epldege-info">
                <span className="msg">
                    <LangText module="LAS" name="E_PLEDGE_INFO" />{lastDay}
                    <LangText module="LAS" name="E_PLDGE_INFO" />
                </span>
                <div className="epledge-msgbase">
                    <div className="epledge-data">
                        <div className="val">
                            <span className="label">
                                <LangText module="LAS" name="YOUR_DEMAT" />
                            </span>
                            <div className="value">

                                <div className="row">
                                    <span>
                                        <LangText module="LAS" name="CDSL" />
                                    </span>
                                    <span className="client-no">
                                        {checkEmpty(accountDetails.dpId)}
                                    </span>
                                </div>

                                <span className="line-seperate"></span>
                                <div className="row">
                                    <span>
                                        <LangText module="LAS" name="CLIENT_ID" />
                                    </span>
                                    <span className="client-no">
                                        {checkEmpty(accountDetails.dmatId)}
                                    </span>
                                </div>

                            </div>
                        </div>
                        <div className="val pledge-icon">
                            <span className={`bfsl-font-2 righticon`}>
                                <Pledge_icon />
                            </span>

                            <span className="labelpledg">
                                <LangText module="LAS" name="PLEDGE_LAS" />
                            </span>
                        </div>
                        <div className="val">
                            <span className="label">
                                <LangText module="LAS" name="BFL_DEMAT" />
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
                                    <span>
                                        <LangText module="LAS" name="CLIENT_ID" />
                                    </span >
                                    <span className="client-no">
                                        {checkEmpty(accountDetails.dmatId)}
                                    </span>
                                </div >

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="epledge-head">
                <span className="head">
                    <LangText module="LAS" name="E_PLEDGE_SHARE" />
                </span>
                {getReCheckEligFlag() ?
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
                <thead className="thead-scroller">
                    <tr>
                        <th className="firstChild width24">
                            <div className="symbol-head">

                                <span className={`bfsl-font-2 ${!check ? "checkboxnor" :
                                    "active-checkboxnor"}`}>
                                    {!check ?
                                        <Checkbox_nor onClick={onclickCheck} />
                                        :
                                        <Checkbox_sel onClick={onclickUnCheck} />}

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
                        <th>
                            <span className="change-per">
                                <LangText module="TABLE_HEADERS" name="TOTAL_AMOUNT" />
                            </span>
                        </th>
                        <th>
                            <span className="">
                                <LangText module="TABLE_HEADERS" name="PLEDGE_QTY" />
                            </span>
                        </th>
                        <th>
                            <span className="ltp">
                                <LangText module="TABLE_HEADERS" name="AMOUNT_SHARES" />
                            </span>
                        </th>

                        {/* <th className="width4 iconCol">
                        </th> */}
                    </tr>
                </thead>
                <tbody className="tbody-scroller">
                    {
                        (sharesDetails && sharesDetails.length) ?
                            sharesDetails.map((item, index) => {
                                return (
                                    <>
                                        <tr key={index}>
                                            <td className="firstChild width24">

                                                <div className="symName-column">
                                                    <span className={`bfsl-font-2 ${!item.isOpen ? "checkboxnor" :
                                                        "active-checkboxnor"}`}>
                                                        {!item.isOpen ?
                                                            <Checkbox_nor onClick={() => toggleItem(index)} />
                                                            :
                                                            <Checkbox_sel onClick={() => toggleItem(index)} />}

                                                    </span>
                                                    <div className="row-data">
                                                        <span className="baseSym text-nowrap">

                                                            {item.scrpNme}
                                                        </span>
                                                        <div>
                                                            <span className="baseSym text-nowrap isin">

                                                                {item.isin}
                                                            </span>
                                                        </div>
                                                    </div>

                                                </div>
                                            </td>
                                            <td >
                                                <span className={`${item.chngClass}`}>
                                                    {checkEmpty(item.maxVal)}</span>
                                            </td>
                                            <td>
                                                <div className="pledgeQty">
                                                    <div className={`border ${item.qty}`}>
                                                        <span>
                                                            <Less_icon onClick={() => subQty(index)} />
                                                        </span>
                                                        <InputComponent
                                                            type="text"
                                                            className="input-qty"
                                                            value={item.qty}
                                                            onChange={(e) => onChangeQty(e, index)}
                                                            onBlur={() => onBlurQty(index)}
                                                            disabled={!item.isOpen}

                                                        />
                                                        <span>

                                                            <Add_icon onClick={() => addQty(index)} />
                                                        </span>
                                                    </div>
                                                    <span className="qty">{item ? '/ ' : ''}
                                                        {checkEmpty(item.initQty)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`border-qty ${item.qty}`}>
                                                    {totAmtShares(item.qty, item.clRte)}</span>

                                            </td>

                                        </tr>

                                    </>
                                )
                            })
                            :
                            <tr className="errorRow">
                                <td className="colspan">
                                    {errorMsg}
                                </td>
                            </tr>
                    }
                </tbody>
            </table>
            <div className="footer">
                <div>
                    <button className={`las-negativeBtn recheck-btn ${getReCheckEligFlag() ? "active" : ""}`}
                        disabled={!getReCheckEligFlag()}
                        onClick={getReCheckEligFlag() ? recheckEligibility : null} >
                        <LangText module="BUTTONS" name="RECHECK_ELIGIBLE" />
                    </button>
                    <button className="las-positivebtn pledge-btn"
                        disabled={getReCheckEligFlag() ? 'disabled' : ""}
                        onClick={getReCheckEligFlag() ? null : onClickPledge}>

                        <LangText module="BUTTONS" name="E_PLEDGE" />
                    </button>
                </div>
                <div>
                    <span className="label">
                        <LangText module="LAS" name="TOTAL_LOAN" />
                        <span className="value">{eligibleAmnt ? '₹ ' : ''}
                            {checkEmpty(eligibleAmnt)}</span>
                    </span>
                    <span className="label">
                        <LangText module="LAS" name="TOTAL_VALUE" />
                        <span className="value">{finalVal ? '₹ ' : ''}
                            {checkEmpty(convertCommaSeparated(finalVal))}</span>
                    </span>
                </div>
            </div>

        </div>

    )
}
const mapStateToProps = ({ las }) => {

    return {
        responseData: las.responseData,

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storerRecheckmsg: (s) => { dispatch(storerRecheckmsg(s)) },
        storeUserLoanAmt: (s) => { dispatch(storeUserLoanAmt(s)) },
        storeSelectedPledgeList:(s) =>{dispatch(storeSelectedPledgeList(s))},
        storePledgeEligblAmt:(s) =>{dispatch(storePledgeEligblAmt(s))}
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(EPledgeComponent))
