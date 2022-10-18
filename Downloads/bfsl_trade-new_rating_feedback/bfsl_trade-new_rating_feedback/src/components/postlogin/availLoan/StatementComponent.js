import React,{  useState ,useEffect} from 'react'
import { AF_EventTriggered, getBackOfficeBaseURL } from '../../../common/CommonMethods'
import { MsfRequest, useFetch } from '../../../index'
import LangText from '../../../common/lang/LangText'
import { LAS_SERVICE_JOURNEY } from '../../../config/ServiceURLs'
import { DownloadIcon, Share_icon, Statement_icon } from '../../common/FontIcons'
import { Loader } from '../../common/LoaderComponent'
import { connect } from 'react-redux'
import { AF_EVENT_NAMES, AF_EVENT_TYPES } from '../../../common/Constants'
// import { storeWidgetLoaderErrorMsg } from '../../../state/actions/Actions'

function StatementComponent(props) {
    const MsfFetch = useFetch();
    const [errorMsg,setErrorMsg]=useState('')

    const [downloadData,setDownloadData]=useState([])

    useEffect(() => {
        clicktoDownload()
       
    }, [])
    
    function clicktoDownload(){
        props.showLoader();
        let request = new MsfRequest();
        request.addToData({
            // "lan":"402FAS23804947",
            // "fas":"50052"
            "lan": props.DisburseResponse ? props.DisburseResponse[0].lan : "",
            "fas": props.DisburseResponse ? props.DisburseResponse[0].fas : ""
        })
        
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICE_JOURNEY.LIST_STATEMENTS,
            request,
            successRespGetStatementList,
            errorRespCBpGetStatementList
        )
    }
   
    function  successRespGetStatementList(response){
        props.hideLoader()      
        setDownloadData(response.data.statements) 
        AF_EventTriggered(AF_EVENT_NAMES.LAS , AF_EVENT_TYPES.STATEMENT_SUCCESS,{"onDownload":"lasdownloadsuccess"}) 
    }

    function errorRespCBpGetStatementList(error){
        props.hideLoader()
        setErrorMsg(error.message)   
        AF_EventTriggered(AF_EVENT_NAMES.LAS , AF_EVENT_TYPES.STATEMENT_FAILURE,{"onDownload":"lasdownloadfailure"}) 

    }
    
    return (
        
        <div className="statement-base">
            <div className="statement-head">
                <LangText name="STATEMENT" module="AVAIL_LOAN"/>
            </div>
            <div className="find-document">
                <LangText name="FIND_DOCUMENTS" module="AVAIL_LOAN"/>
            </div>
            
            <div className="boxes" >
                { (downloadData && downloadData.length) ?
                    downloadData.map((item, index) => {
                        return (
                            <div  key={index} className="interim-valuation-main">
                                <div className="icon-div">
                                    <div className="statement-icon">
                                        <Statement_icon/>
                                    </div>
                                </div>
                                <div className="interim-valuation">
                                    {item.fileNme}
                                   
                                </div>   
                                {/* <div className="loan-account">
                                    <span className="loan-amt">
                                        <LangText name="LOAN_ACCOUNT" module="AVAIL_LOAN"/>:
                               
                                    </span>
                                    <span className="loan-account-value">
                                        {props.DisburseResponse ? checkEmpty(props.DisburseResponse[0].lan) : ""}
                                    </span>
                                </div> */}
                                <div className="icon-class">
                                    <div className="share-icon"> 
                                        {/* <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=las.support@bajajfinserv.in&attachments=["file:///C:/Users/sruthiraj.k/Downloads/Holding%20Statements%20(13).pdf"]`}  */}
                                        <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=las.support@bajajfinserv.in`} 
                                            target="_blank" rel="noopener noreferrer">
                                            <Share_icon/>
                                        </a>
                                    </div>
                                    <div className="download-icon">                 
                                        <a className="download-icon"
                                            href={item.dwnldUrl }
                
                                            download={ item.fileNme}>
                        
                                            <DownloadIcon />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    : 
                    <div className="show-error">
                        {errorMsg}
                    </div>}
                {/* <div className="statement-main">
                    <div className="icon-div">
                        <div className="statement-icon">
                            <Statement_icon/>
                        </div>
                    </div>
                    <div className="statement-account">
                        <LangText name="STATEMENT_ACCOUNT" module="AVAIL_LOAN"/>
                        <div className="loan-account">
                            <span className="loan-amt">
                                <LangText name="LOAN_ACCOUNT" module="AVAIL_LOAN"/>:
                               
                            </span>
                            <span className="loan-account-value">
                                {props.DisburseResponse ? checkEmpty(props.DisburseResponse[0].lan) : ""}
                            </span>
                        </div>
                    </div>
                    <div className="icon-class">
                        <div className="share-icon">
                            <a href="mailto:las.support@bajajfinserv.in" target="_blank" rel="noopener noreferrer">
                                <Share_icon/>
                            </a>
                        </div>
                        <div className="download-icon">  
                            <a className="download-icon"
                          
                                href={downloadData && downloadData.length > 0 ? downloadData[1].dwnldUrl : ''}
                                download={ downloadData && downloadData.length > 0 ? downloadData[1].fileNme : ''}>
                        
                                <DownloadIcon />
                            </a>
                          
                        </div>
                      
                    </div>
                </div>
                <div className="foreclosure-main">
                    <div className="icon-div">
                        <div className="statement-icon">
                            <Statement_icon/>
                        </div>
                    </div>
                    <div className="foreclosure-letter">
                        <LangText name="FORECLOSURE_LETTER" module="AVAIL_LOAN"/>
                        <div className="loan-amt">
                            <span className="loan-account">
                                <LangText name="LOAN_ACCOUNT" module="AVAIL_LOAN"/> :
                            </span>
                           
                            <span className="loan-account-value">
                                {props.DisburseResponse ? checkEmpty(props.DisburseResponse[0].lan) : ""} 
                            </span> 
                        </div>
                    </div>
                    <div className="icon-class">
                        <div className="share-icon"> 
                            <a href="mailto:las.support@bajajfinserv.in" target="_blank" rel="noopener noreferrer">
                                <Share_icon/>
                            </a>
                        </div>
                        <a className="download-icon"
                          
                            href={downloadData && downloadData.length > 2 ? downloadData[2].dwnldUrl : ''}
                            download={ downloadData && downloadData.length > 2 ? downloadData[2].fileNme : ''}>
                        
                            <DownloadIcon />
                        </a>
                      
                    </div>
                </div> */}

            </div>
        </div>
    )
}
const mapStateToProps = ({ availLoanDetails }) => {
    
    return {
       
        DisburseResponse:availLoanDetails.DisburseResponse,
    }
}
export default connect(mapStateToProps, null)(Loader(StatementComponent))
