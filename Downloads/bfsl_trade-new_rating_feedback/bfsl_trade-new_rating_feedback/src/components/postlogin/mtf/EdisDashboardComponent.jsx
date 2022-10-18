import React, {useState, useEffect} from 'react'
import { useFetch, MsfRequest } from '../../../index'
import { getBackOfficeBaseURL } from '../../../common/CommonMethods'
import { MTF_SERVICES } from '../../../config/ServiceURLs'
import { SCREENS } from '../../../common/Constants'
import { connect } from 'react-redux'
import { showAppDialog, storeEdisScreenFlag, storeSelectedDashboardWidget } from '../../../state/actions/Actions'
import { WidgetLoader } from '../../common/WidgetLoaderComponent'
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min'
import LangText, { getLangText } from '../../../common/lang/LangText'
// import { WidgetLoader } from '../../common/WidgetLoaderComponent'

function EdisDashboardComponent(props) {

    const MsfFetch = useFetch()

    const [errorMsg, setErrorMsg] = useState("")
    const [edisDetails, setEdisDetails] = useState([])

    useEffect(() => {
        getEdisDashboardDetails()
    }, [])

    function getEdisDashboardDetails() {
        props.showWidgetLoader();
        let request = new MsfRequest();
        request.addToData({
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + MTF_SERVICES.GET_EDIS_DASHBOARD_DETAILS,
            request,
            successRespCBGetEdisDashboardDetails,
            errorRespCBGetGetEdisDashboardDetails
        )
    }

    function successRespCBGetEdisDashboardDetails(response) {
        props.hideWidgetLoader();
        console.log('123edisresponse: ', response);
        setEdisDetails(response.data.dashboardDtls)
        setErrorMsg('')
    }

    function errorRespCBGetGetEdisDashboardDetails(error) {
        props.hideWidgetLoader();
        console.log('123error: ', error.data);
        setEdisDetails([])
        setErrorMsg(getLangText("NO_DATA_AVAILABLE"))
    }

    // function onClickGeneratePin() {
    //     let request = new MsfRequest();
    //     request.addToData({
    //     })
    //     MsfFetch.placeRequest(
    //         getBackOfficeBaseURL() + MTF_SERVICES.GENERATE_TPIN,
    //         request,
    //         successRespCBGeneratePin,
    //         errorRespCBGeneratePin
    //     )
    // }

    // function successRespCBGeneratePin(response) {
    //     console.log('123pinresponse: ', response, response.infoMsg);
    //     props.showAppDialog({
    //         message:response.infoMsg,
    //         show:true
    //     })
    // }

    // function errorRespCBGeneratePin(error) {
    //     console.log('123epinerror: ', error);
    //     let errorText;
    //     if(error.message)
    //         errorText = error.message
    //     // else 
    //     //     errorText = "Error"
    //     props.showAppDialog({
    //         message:errorText,
    //         show:true
    //     })
    // }

    function onClickProceed() {
        props.storeEdisScreenFlag(true)
        document.addEventListener("visibilitychange", () => {
            // console.log("123hidden",document.hidden);
            if(!document.hidden)
                props.history.push(SCREENS.DASHBOARD)
        });
        // props.history.push(SCREENS.DASHBOARD)
    }

    return( 
        <div className="edis-dashboard-base">
            <div className="edis-dashboard-header"><LangText name="MTF_EDIS_DASHBOARD"/></div>
            <div className="widget-loader-div">
                <table className="edis-dashboard-table">
                    {
                        edisDetails && edisDetails.length ?
                            <thead className="thead-scroller">
                                <tr>
                                    <th className="firstChild width24 head-label">
                                        <div className="symbol-head">

                                            {/* <span className= "checkboxunit" >
                                                <CheckBoxIcon_Checked/>

                                            </span> */}
                                            <div className="label">
                                                <span className="first"><LangText name="SCRIP_NAME"/></span>
                                                <span className="second"><LangText name="ISIN_HEAD"/></span>
                                            </div>
                                        </div>
                                    </th>
                                    <th className="holding-qty">
                                        <span><LangText name= "HOLDING_QTY"/></span>
                                    </th>
                                    <th className="auth-qty">
                                        <span><LangText name= "AUTHORISED_QTY"/></span>
                                    </th>
                                    <th className="input-qty lastChild">
                                        <span><LangText name="INPUT QTY_AVAILABLE QTY"/></span>
                                    </th>
                                </tr>
                            </thead>
                            :
                            <tr className="errorRow">
                                <td className="colspan">{errorMsg}</td>
                            </tr>
                    }
                    <tbody className="tbody-scroller">
                        {
                            edisDetails && edisDetails.length ?
                                edisDetails.map((item) => {
                                    return (
                                        <>
                                            <tr>
                                                <td className="firstChild">
                                                    {/* <span className= "checkboxunit" >
                                                        <CheckBoxIcon_Checked/>
                                                    </span> */}
                                                    <div className="data-block">
                                                        <span className="val1">{item.dispSym}</span>
                                                        <span className="val2">{item.isin}</span>
                                                    </div>
                                                </td>
                                                <td className="holding-qty-tdata">
                                                    <span className="val">{item.freeQty}</span>
                                                </td>
                                                <td className="auth-qty-tdata">
                                                    <span className="val">{item.authQtyTdy}</span>
                                                </td>
                                                <td className="input-qty-tdata lastChild">
                                                    <span className="val">{item.availQty}</span>
                                                </td>
                                            </tr>
                                        </>
                                    )
                                })
                                :
                                null
                        }
                    </tbody>
                    {
                        edisDetails && edisDetails.length ?
                            <tfoot className="footer-div">
                                {/* <button className="generate-epin-btn cursor" 
                                    onClick={onClickGeneratePin}>GENERATE TPIN</button> */}
                                <button className="proceed-btn cursor" onClick={onClickProceed}>
                                    <LangText name="PROCEED"/></button>
                            </tfoot>
                            :
                            null
                    }
                </table>
        
            </div>
        </div>

    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeEdisScreenFlag: (s) => { dispatch(storeEdisScreenFlag(s)) },
        storeSelectedDashboardWidget: (s) => {dispatch(storeSelectedDashboardWidget(s))}
    };
};

export default  connect(null,mapDispatchToProps)(WidgetLoader(withRouter(EdisDashboardComponent)))