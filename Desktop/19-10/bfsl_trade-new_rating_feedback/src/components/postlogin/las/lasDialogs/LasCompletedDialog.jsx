import React,{useState,useEffect} from 'react'
import { connect } from 'react-redux'

import { checkEmpty } from '../../../../common/CommonMethods'
import LangText from '../../../../common/lang/LangText'
import { Process_icon } from '../../../common/FontIcons'

import { storeAvailLoanDialogDetails } from '../../../../state/actions/Actions'
import { LOCAL_STORAGE, SCREENS } from '../../../../common/Constants'
import { withRouter } from 'react-router-dom'
import { getItemFromSessionStorage } from '../../../../common/LocalStorage'

function LasCompletedDialog(props) {
    const [sanctionNo, setSanctionNo] = useState('')
    const [lasData, setLasData] = useState({})

    useEffect(() => {
        if (props.lan) {
            setSanctionNo(props.lan)
        }
        let lasDatas = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.LAS_HELP))
        if (lasDatas)
            setLasData(lasDatas)
    }, [])

    function onClickDone() {
        props.storeAvailLoanDialogDetails({
            dialogName: null
        })
        props.history.push(SCREENS.DASHBOARD)
      
    }
    return (
        <div className="app-modalDialog2 compltd-dialog" >
            <div className="window compltd-base" >
                <div className="compltd-content">
                    <div className="header">
                        <span className="bfsl-font-2 processico">
                            <Process_icon /> 
                        </span>
                        <span className="title">
                            <LangText name="APPLICATION_PROGRESS" module="LAS" />
                        </span>
                    </div>
                    <div className="compltd-body">
                        <span className="label">
                            <LangText name="SANCTION_NO" module="LAS" />
                            <span className="value">
                                {checkEmpty(sanctionNo)} </span>
                        </span>
                    </div>
                    <div className="info-msg">
                        <span className="msg">
                            <LangText name="GMAIL_INFO" module="LAS" />
                        </span>
                        <a href={`mailto:${lasData.lasSup}`} target="_blank" rel="noopener noreferrer">
                            <span className="link">{lasData.lasSup}</span></a>
                    
                    </div>
                    <div className="compltd-footer">
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
const mapStateToProps = ({ las }) => {

    return {
        lan: las.lan,

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) },

    };
};

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(LasCompletedDialog))
