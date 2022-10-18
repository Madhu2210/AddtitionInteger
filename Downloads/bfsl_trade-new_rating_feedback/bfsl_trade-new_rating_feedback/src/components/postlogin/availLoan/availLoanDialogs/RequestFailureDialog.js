import React ,{useState,useEffect} from 'react'
import { connect } from 'react-redux'
import { THEMES } from '../../../../common/Constants'
import LangText from '../../../../common/lang/LangText'
import {  storeLoanDialogDetails, storeRecieveDialogDetails } from '../../../../state/actions/Actions'
// import { Sorry_icon } from '../../../common/FontIcons'

function RequestFailureDialog( props) {
    const [failureContent,setFailureContent]=useState('')
    const [unpledgeFailurecontent,setUnpledgeFailureContent]=useState('')

    useEffect(() => {
        if(props.getSaveDisburseError){
            setFailureContent(props.getSaveDisburseError)
        }

    }, [props.getSaveDisburseError])

    useEffect(() => {
        if(props.getUnpledgeErrorData){
            setUnpledgeFailureContent(props.getUnpledgeErrorData)
        }

    }, [props.getUnpledgeErrorData])

    function onClose(){
        props.storeLoanDialogDetails({
            dialogName: null
        })

        props.storeRecieveDialogDetails({
            dialogContent: null
        })
    }
   
    function DisburseError(){
        return(
            <div className="failure-content">
                {failureContent}
            </div> 
        )
    }

    function UnpledgeError(){
        return(
            <div>
                {/* <span className="Unable-proceed">
                    <LangText name="UNABLE_TO_PROCEED" module="AVAIL_LOAN_DIALOG_CONTENT" /> 
                </span> */}

                <div className="failure-content">
                    {unpledgeFailurecontent}
                </div> 
            </div>
        )
    }
    
    return (
        <div className="app-modalDialog2 request-failure-dialog">
            <div className="window request-failure-screen" >
                <div className="request-failure-header">
                    <div className="failure-caption">                   
                        {/* <span className="bfsl-font-2 sorryicon failure">
                            <Sorry_icon />
                        </span>  */}
                        {props.selectedTheme.theme === THEMES.LIGHT ?
                            < img src="assets/images/dashboard/failed_btn.svg" alt="" />
                            :
                            < img src="assets/images/dark/dashboard/Failed_btn.svg" alt="" />
                        }
                        
                    </div>
                    {/* <div className="failure-content">
                        <LangText name="UNABLE_TO_PROCEED_CONTENT" module="AVAIL_LOAN_DIALOG_CONTENT" />    
                </div> */}
                    <div>
                        { props.dialogDetails.dialogContent ?  UnpledgeError() : DisburseError() 
                        
                        }
                           
                    </div>  
                    {/* <div className="failure-content">
                        {failureContent}
                    </div> */}
            
                    <div className="failure-footer">
                        <button className="proceed-btn"
                            onClick={onClose}>
                                            
                            <LangText module="AVAIL_LOAN_DIALOG_CONTENT" name="DONE" />
                     
                        </button>
                        {/* <button className="proceed-btn">
                       
                        <LangText name="PROCEED_TO_PAY" module="BUTTONS"
                            onClick={proceedToPay}/>
                    </button>  */}
                    </div>
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = ({availLoanDetails,settings}) => {
 
    return {
        getSaveDisburseError:availLoanDetails.getSaveDisburseError,
        getUnpledgeErrorData:availLoanDetails.getUnpledgeErrorData,
        dialogDetails: availLoanDetails.dialogDetails,
        selectedTheme: settings.selectedTheme

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeLoanDialogDetails: (s) => { dispatch(storeLoanDialogDetails(s)) },
        storeRecieveDialogDetails: (s) =>{dispatch(storeRecieveDialogDetails(s)) },

        // storeFailureContDialogDetails:(s) => { dispatch(storeFailureContDialogDetails(s)) },
    };
};
export default  connect(mapStateToProps,mapDispatchToProps) (RequestFailureDialog)
