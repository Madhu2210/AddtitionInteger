import useFetch from '@msf/msf-reactjs-weblib-base'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { MsfRequest } from '../../../..'
import { AF_EventTriggered, checkEmpty, getBackOfficeBaseURL } from '../../../../common/CommonMethods'
import { AF_EVENT_NAMES, AF_EVENT_TYPES, LAS_LOAN_DIALOGS, LOCAL_STORAGE,} from '../../../../common/Constants'
import LangText from '../../../../common/lang/LangText'
import { getItemFromSessionStorage } from '../../../../common/LocalStorage'
import { LAS_SERVICES } from '../../../../config/ServiceURLs'
import { storeAvailLoanDialogDetails } from '../../../../state/actions/Actions'
import { Loader } from '../../../common/LoaderComponent'

function EpledgeConfirmDialog(props) {
    const [responseData, setResponseData] = useState({})
    const [lasData, setLasData] = useState({})
    const [selectedPledgeList, setSelectedPledgeList] = useState([])
    const [pledgeAmt, setPledgeAmt] = useState('')

    const MsfFetch = useFetch()

    useEffect(() => {
        if (props.responseData) {
            setResponseData(props.responseData)
        }
        if(props.selectedPledgeList){
            setSelectedPledgeList(props.selectedPledgeList)
        }
        if(props.pledgeAmnt){
            setPledgeAmt(props.pledgeAmnt)
        }
        
        let lasDatas = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.LAS_HELP))
        if (lasDatas)
            setLasData(lasDatas)
    }, [])

    function onClickClose() {
        props.storeAvailLoanDialogDetails({
            dialogName: null
        })
    }

    function confirmEpledge() {
        props.showLoader();
        let request = new MsfRequest();
        request.addToData({
            loanId: responseData.loanId,
            amnt:pledgeAmt,
            pShares: selectedPledgeList  
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.CONFIRM_SHARES,
            request,
            successRespConfirmShare,
            errorRespConfirmShare
        )
    }

    function successRespConfirmShare() {
        generateOtp()
        AF_EventTriggered(AF_EVENT_NAMES.LAS , AF_EVENT_TYPES.E_PLEDGE_CONFIRM)
    }

    function errorRespConfirmShare(error) {
        props.hideLoader()
        props.showAppDialog({
            message: error.message,
            show: true
        })
        AF_EventTriggered(AF_EVENT_NAMES.LAS , AF_EVENT_TYPES.E_PLEDGE_CONFIRM_FAILURE)

    }

    function generateOtp() {
        let request = new MsfRequest();
        request.addToData({
            loanId: responseData.loanId,
            mode: "L"
        })

        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.GENERATE_OTP,
            request,
            successRespCBGetOtp,
            errorRespCBGetOtp
        )
    }

    function successRespCBGetOtp() {
        props.hideLoader();
        props.storeAvailLoanDialogDetails({
            dialogName: LAS_LOAN_DIALOGS.OTP_VERIFICATION
        })
        AF_EventTriggered(AF_EVENT_NAMES.LAS , AF_EVENT_TYPES.E_PLEDGE_OTP_VERIFICATION_SUCCESS)

    }

    function errorRespCBGetOtp(error) {
        props.hideLoader()
        props.showAppDialog({
            message: error.message,
            show: true
        })
        AF_EventTriggered(AF_EVENT_NAMES.LAS , AF_EVENT_TYPES.E_PLEDGE_OTP_VERIFICATION_FAILURE)

    }
    return (
        <div className="app-modalDialog2 terms-condition-dialog" >
            <div className="window epledge-confirm" >
                <div className="congo-content">
                    <div className="info-msg">
                        <span className="msg">
                            {checkEmpty(lasData.epldMsg)}
                        </span>
                    </div>
                    <div className="congrats-footer">
                        <button className="las-negativeBtn"
                            onClick={onClickClose}>
                            <LangText module="BUTTONS" name="CANCEL" />
                        </button>
                        <button className="las-positivebtn"
                            onClick={confirmEpledge} >
                            <LangText module="BUTTONS" name="PROCEED" />
                        </button>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

const mapStateToProps = ({ las}) => {

    return {
        responseData: las.responseData,
        selectedPledgeList:las.selectedPledgeList,
        pledgeAmnt:las.pledgeAmnt

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) }

    };
}

export default connect(mapStateToProps,mapDispatchToProps) (Loader(withRouter(EpledgeConfirmDialog)))
