import React ,{useEffect,useState} from 'react'
import { connect } from 'react-redux'
import { checkEmpty, getBackOfficeBaseURL } from '../../../../common/CommonMethods'
import { AVAIL_LOAN_DIALOGS, LOCAL_STORAGE } from '../../../../common/Constants'
import LangText from '../../../../common/lang/LangText'
import { getItemFromSessionStorage } from '../../../../common/LocalStorage'
import { LAS_SERVICES, LAS_SERVICE_JOURNEY } from '../../../../config/ServiceURLs'
import { storeLoanDialogDetails } from '../../../../state/actions/Actions'
import { MsfRequest, useFetch } from '../../../../index'
import { Loader } from '../../../common/LoaderComponent'

function AdditionalPledgConfirmDialog(props) {
    const [lasData, setLasData] = useState({})
    const [selectPldList,setSelectPldList]= useState({})
    const MsfFetch = useFetch();

    useEffect(() => {   
        if(props.selectedAddPldgData){
            setSelectPldList(props.selectedAddPldgData)
        }
        let lasDatas = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.LAS_HELP))
        if (lasDatas)
            setLasData(lasDatas)
    }, [])
  
    function onClickClose(){
        props.storeLoanDialogDetails({
            dialogName:null
        })
    }

    function confirmEpledge(){
        let request = new MsfRequest();
        request.addToData({
            loanId: props.responseData ? props.responseData.loanId : "",
            pShares: selectPldList
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICE_JOURNEY.CONFIRM_ADDITIONAL_SHARE,
            request,
            successRespConfirmShares,
            errorRespConfirmShares
        )
    }
    function successRespConfirmShares(){
        props.hideLoader();
        generateOtp()
    }
    
    function errorRespConfirmShares(error){
        props.hideLoader();
        props.showAppDialog({
            message: error.message,
            show: true
        })
    }

    function generateOtp() {
        let request = new MsfRequest();
        request.addToData({
            loanId: props.responseData ? props.responseData.loanId : "",
            mode: "P"
        })

        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.GENERATE_OTP,
            request,
            successRespCBGetOtp,
            errorRespCBGetOtp
        )
    }
    function  successRespCBGetOtp(){
       
        props.hideLoader();
        props.storeLoanDialogDetails({
            dialogName: AVAIL_LOAN_DIALOGS.EPLEDGE_OTP_VERIFICATION
        })

    }

    function  errorRespCBGetOtp(error){
        props.hideLoader();
        props.showAppDialog({
            message: error.message,
            show: true
        })

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
                            onClick={confirmEpledge}>
                            <LangText module="BUTTONS" name="PROCEED" />
                        </button>
                    </div>
                </div>
            </div>
        
        </div>
    )
}

const mapStateToProps = ({ availLoanDetails,las}) => {
    return {
       
        selectedAddPldgData:availLoanDetails.selectedAddPldgData,
        responseData: las.responseData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeLoanDialogDetails: (s) => { dispatch(storeLoanDialogDetails(s)) },
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(Loader(AdditionalPledgConfirmDialog))

