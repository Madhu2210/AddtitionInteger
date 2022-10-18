import React,{ useEffect,useState } from 'react'
import { connect } from 'react-redux'
import LangText from '../../../../../common/lang/LangText'
import { CloseIcon, TickMark_icon } from '../../../../common/FontIcons'

function ComparisonComponent(props) {
    const [featureList, setFeatureList] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    
    useEffect(() => {
        if(props.featureList && props.featureList.length){
            setFeatureList(props.featureList)
        }
        else{
            setErrorMsg("No Data Available")
        }
    },[])

    return (
        <div className="campare-basetable">
            <table className="campare-table">
                <thead className="thead-scroller head-div">
                    <tr>
                        <th className="firstChild width24">
                            <div className="symbol-head">
                                    
                                <LangText module="MARKET_SMITH" name="PREM_FEATURE" />
                                
                            </div>
                        </th>
                        <th>
                            <span className="change-per">
                                <LangText module="MARKET_SMITH" name="TWO_IN_ONE" />
                            </span>
                        </th>
                        <th>
                            <span className="">
                                <LangText module="MARKET_SMITH" name="MID" />
                            </span>
                        </th>
                        <th>
                            <span className="ltp">
                                <LangText module="MARKET_SMITH" name="SHORT" />
                            </span>
                        </th>
                    </tr>
                </thead>
                
                <tbody className="tbody-scroller">
                    {
                        (featureList && featureList.length) ?
                            featureList.map((item, index) => {
                                return (
                                    <tr key={index} >
                                        <td className="firstChild width24">

                                            <span className="features">

                                                {item.featureName}
        
                                            </span>
                                                  
                                        </td>
                                        <td >
                                            {(item.bothCom=="true")?
                                                <span className="tick"><TickMark_icon/></span>:
                                                <span className="cross"><CloseIcon/></span>
                                                    
                                            }
                                
                                        </td>
                                        <td>
                                            {(item.longCom=="true")?
                                                <span className="tick"><TickMark_icon/></span>:
                                                <span className="cross"><CloseIcon/></span>
                                                    
                                            }
                                                   
                                        </td>
                                        <td>
                                            {(item.shortCom=="true")?
                                                <span className="tick"><TickMark_icon/></span>:
                                                <span className="cross"><CloseIcon/></span>
                                                    
                                            }

                                        </td>

                                    </tr>

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
        </div>
    )
}
const mapStateToProps = ({ marketsmithdetails }) => {
   
    return {
        featureList:marketsmithdetails.featureList

    }
}
export default connect(mapStateToProps,null)(ComparisonComponent)