import React, { useEffect, useState } from 'react'
// import { WidgetLoader } from '../../../common/WidgetLoaderComponent';
import {useFetch, MsfRequest} from '../../../../index'
import { DATE_FORMATS, MTF_DIALOGS, TEXT_ORIENTATION } from '../../../../common/Constants';
import { connect } from 'react-redux';
import { storeMtfDialogDetails, storeMtfEpledgeScreenFlag } from '../../../../state/actions/Actions';
import { convertToUpperCase, getBackOfficeBaseURL, getFormatedDate } from '../../../../common/CommonMethods';
import {MTF_SERVICES} from '../../../../config/ServiceURLs'
import LangText from '../../../../common/lang/LangText';
// import { CheckBoxIcon_Checked } from '../../../common/FontIcons';

function MtfEpledgeAlertDialogComponent(props) {

    const MsfFetch = useFetch();

    // const [errorMsg, setErrorMsg] = useState()
    const [dateVal, setDateVal] = useState()
    const [mtfPledgeDetails, setMtfPledgeDetails] = useState([])
    const [clientCode, setClientCode] = useState("")
    // const [checkBoxSelected, setCheckBoxSelected] = useState(false)

    useEffect(() => {
        getDate()
        getMtfPledgeDetails()
    }, [])

    function getMtfPledgeDetails() {
        let request = new MsfRequest();
        request.addToData({
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + MTF_SERVICES.GET_PLEDGE_DETAILS,
            request,
            successRespCBGetMTFPledgeDetails,
            errorRespCBMTFPledgeDetails
        )
    }
    
    function successRespCBGetMTFPledgeDetails(response) {
        setClientCode(response.data.usrID)
        setMtfPledgeDetails(response.data.pledgeDtls)
        // setErrorMsg('')
    }
    
    function errorRespCBMTFPledgeDetails(error) {
        console.log('error: ', error);
        setMtfPledgeDetails([])
        // setErrorMsg(error.message)
    }

    function getDate() {
        const result = getFormatedDate("", 0, DATE_FORMATS.DDMMMYYYY).stringDate
        setDateVal(result)
    }

    function onClickCancel() {
        props.onCloseCB && props.onCloseCB()
    }
 
    function onClickProceed() {
        // props.storeMtfEpledgeScreenFlag(true)
        // if(checkBoxSelected) {
        props.storeMtfDialogDetails({
            name: MTF_DIALOGS.PLEDGE_CONFIRM
        })
        // }
    }

    // function onTickCheckBox() {
    //     setCheckBoxSelected(true)
    // }

    // function onUntickCheckBox() {
    //     setCheckBoxSelected(false)
    // }
    return( 
        mtfPledgeDetails && mtfPledgeDetails.length ? 
        
            <div className="app-modalDialog2 e-pledge-dialog">
                <div className="window e-pledge-base">
                    <div className="header">
                        <div className="header-text">
                            <span><LangText name="MTF_EPLEDGE_PRODUCT"/></span>
                        </div>
                        <div className="client-code-with-date">
                            <span className="client-code"><LangText name="MTF_CLIENT_CODE"/>
                                <span className="client-code-value">{clientCode}</span>
                            </span>
                            <span className="date">{convertToUpperCase(dateVal)}</span>
                        </div>
                    </div>
                
                    <div className="mtf-table-div">
                        <table className="mtf-table">
                            <thead className="thead-scroller">
                                <tr className="mtf-table-row">
                                    <th className="mtf-table-column1"><LangText name="SYMBOL"/></th>
                                    <th className="mtf-table-column2"><LangText name="QTY" 
                                        orientation = {TEXT_ORIENTATION.UPPERCASE} /></th>
                                    <th className="mtf-table-column3"><LangText name="PRODUCT"/></th>
                                </tr>
                            </thead>
                            <tbody className="tbody-scroller">
                                {
                                    mtfPledgeDetails.map(item => {
                                        return (
                                            <>
                                                <tr className="mtf-table-row">
                                                    <td  className="mtf-table-column1">{item.dispSym}</td>
                                                    <td  className="mtf-table-column2">{item.qty}</td>
                                                    <td  className="mtf-table-column3 dataval">
                                                        <LangText name="MTF"/></td>
                                                </tr>
                                            </>
                                        )
                                    })
                                }
                            </tbody>
                            <tfoot className="footer-div">
                                <div className="footer-text">
                                    {
                                        // checkBoxSelected ?
                                        <span className="agree-terms" >
                                            {/* <CheckBoxIcon_Checked/> */}
                                            *
                                        </span>
                                        // :
                                        // <span className="agree-terms cursor" onClick= {onTickCheckBox}>
                                        //     <CheckBoxIcon_UnChecked/>
                                        // </span>
                                    }
                                    <span><LangText name="MTF_DISLAIMER_TXT"/></span>
                                </div>
                                <div className="btn-div">
                                    <button className="cancel-btn" onClick= {onClickCancel}>
                                        <LangText name="CANCEL"/></button>
                     
                                    <button className= "proceed-btn" 
                                        onClick = {onClickProceed}>
                                        <LangText name="BTN_PLEDGE"/></button>
                                </div>
                            </tfoot>
                        </table>
                    </div>
                    {/* <div className="footer-div">
                    <span className="footer-text">Note:Disclaimer should be displayed on the Popup screen of MTF Pledge 
                    BFSL will Provide the content for the same</span>
                    <div className="btn-div">
                        <button className="cancel-btn" onClick= {onClickCancel}>CANCEL</button>
                     
                        <button className="proceed-btn" onClick = {onClickProceed}>PROCEED</button>
                    </div>
                </div> */}
                </div>
            </div>
            :
            null
               
    )
            
}

// }
const mapStateToProps = ({ mtfDetails }) => {
    return {
        showMtfPledgeScreen: mtfDetails.showMtfPledgeScreen,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        storeMtfEpledgeScreenFlag: (s) => { dispatch(storeMtfEpledgeScreenFlag(s)) },
        storeMtfDialogDetails: (s) => {dispatch(storeMtfDialogDetails(s))}
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MtfEpledgeAlertDialogComponent)
