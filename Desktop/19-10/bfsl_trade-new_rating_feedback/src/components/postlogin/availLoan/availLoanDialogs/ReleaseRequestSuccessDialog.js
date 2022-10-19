import React from 'react'
import LangText from '../../../../common/lang/LangText'

function ReleaseRequestSuccessDialog() {
    return (
        <div className="app-modalDialog2 request-recieved-dialog">
            <div className="window request-recieve-screen" >
                <div className="request-recieve-header">
                    <div className="recieve-caption">                   
                        <span>
                            <img src="assets/images/dashboard/success_btn.svg" alt="" />
                        </span>                       
                        <span className="request-head">
                            <LangText name="REQUEST_RECIEVED" module="AVAIL_LOAN_DIALOG_CONTENT" />

                        </span>
                        <span className="request-id">
                            <LangText name="REQUEST_ID" module="AVAIL_LOAN_DIALOG_CONTENT" />
                        </span>
                    </div>
                    <div>
                        <span>
                            <LangText name="RELEASE_REQUEST_SUCCESS" module="AVAIL_LOAN_DIALOG_CONTENT"/>
                        </span>
                    </div>
                    <div>
                        <button className="done-button">                        
                            <LangText module="AVAIL_LOAN_DIALOG_CONTENT" name="DONE" />
                        </button>
                    </div>
                </div>  
            </div>
        </div>
       
    )
}

export default ReleaseRequestSuccessDialog

