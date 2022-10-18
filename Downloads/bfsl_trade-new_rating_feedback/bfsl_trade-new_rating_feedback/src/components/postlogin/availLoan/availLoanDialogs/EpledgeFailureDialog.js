import React,{useState,useEffect} from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { THEMES } from '../../../../common/Constants';
import LangText from '../../../../common/lang/LangText'
import { storeAvailLoanPledgeRefreshFlag, storeLoanDialogDetails } from '../../../../state/actions/Actions';

function EpledgeFailureDialog(props) {
    const [additError,setAdditError]=useState('')

    useEffect(() => {
        if(props.failureContAdditionalPld){
            setAdditError(props.failureContAdditionalPld)
        }

    }, [])
    function onClickDone(){
        props.storeLoanDialogDetails({
            dialogName:null
        })
        props.storeAvailLoanPledgeRefreshFlag(true) 
    }

    return (
        <div className="app-modalDialog2 fail-dialog" >
            <div className="window fail-base" >
                <div className="fail-content">
                    <div className="header">
                        {props.selectedTheme.theme === THEMES.LIGHT ?
                            < img src="assets/images/dashboard/failed_btn.svg" alt="" />
                            :
                            < img src="assets/images/dark/dashboard/Failed_btn.svg" alt="" />
                        }
                        <span className="title">
                            <LangText name="FAIL" module="LAS" />
                        </span>
                    </div>
                    <div className="info-msg">
                        <span className="msg">
                            {additError}
                        </span>
                    </div>
                    <div className="fail-footer">
                        <button className="negativeBtn"
                            onClick={onClickDone}>
                            <LangText module="BUTTONS" name="OK" />
                        </button>

                    </div>
                </div>
            </div>
        </div>
        
    )
}

const mapStateToProps = ({ settings,availLoanDetails}) => {
    return {
        selectedTheme: settings.selectedTheme,
        failureContAdditionalPld:availLoanDetails.failureContAdditionalPld
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeLoanDialogDetails: (s) => { dispatch(storeLoanDialogDetails(s)) },
        storeAvailLoanPledgeRefreshFlag: (s) => { dispatch(storeAvailLoanPledgeRefreshFlag(s)) }
    };
};

export default connect(mapStateToProps,mapDispatchToProps) (withRouter(EpledgeFailureDialog))
