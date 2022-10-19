
import React from 'react'
import { connect } from 'react-redux'
import { DASHBOARD_WIDGET_MODE, MARKETSMITH_SCREENS } from '../../../../../common/Constants'
import LangText from '../../../../../common/lang/LangText'
import { storeMarketSmithData, storeSelectedDashboardWidget } from '../../../../../state/actions/Actions'
import { CloseIcon, LeftArrowIcon } from '../../../../common/FontIcons'
import { WidgetLoader } from '../../../../common/WidgetLoaderComponent'
import IdeaBaseComponent from '../IdeaBaseComponent'
import ChooseTenureComponent from './ChooseTenureComponent'
import ComparisonComponent from './ComparisonComponent'
import RenewSubscriptionComponent from './RenewSubscriptionComponent'
import SubscriptionOptionsComponent from './SubscriptionOptionsComponent'

function MarketSmithBase(props) {

    // const [selectMenu]=useState(MARKETSMITH_MENUS[0])

    function closeSubscription(){
        props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.IDEAS_VIEW)
    }

    function compareBack(){
        if(props.marketSmthData.marketSmtScreen==MARKETSMITH_SCREENS.COMPARISON){
            props.storeMarketSmithData({
                marketSmtScreen:MARKETSMITH_SCREENS.SUBSCRIPTION
            })
        }else if(props.marketSmthData.marketSmtScreen==MARKETSMITH_SCREENS.CHOOSE_TENURE){
            props.storeMarketSmithData({
                marketSmtScreen:MARKETSMITH_SCREENS.SUBSCRIPTION
            })
        }else{
            props.storeMarketSmithData({
                marketSmtScreen:null
            })
        }
    }
    if(!props.marketSmthData.marketSmtScreen){
        return <IdeaBaseComponent/>
        
    }
    return (
        <>
            <div className="marketsmithbase">
                <div className="marketsmith-header">
                    <div className="headersBase">
                    
                        <div className="heading-name">
                            <div className="back-button"onClick={compareBack}>
                                <LeftArrowIcon/>
                            </div>
                            {(props.marketSmthData.marketSmtScreen==MARKETSMITH_SCREENS.COMPARISON)?

                                <LangText name="COMPARE_TITLE" module="MARKET_SMITH" />
                           
                                :<LangText name="SUBSCRIPTION_PRICING" module="MARKET_SMITH" />
                            
                            }
                        </div>
                        <div className="close-button" onClick={closeSubscription} >
                            <CloseIcon/>
                        </div>
                    </div>
                </div>

                <div className="marketsmithbase-content">
                    {getSelectedTable(props.marketSmthData.marketSmtScreen) }
                </div>
            </div>
        </>
    )
}
function getSelectedTable(item){
    switch(item){
        case MARKETSMITH_SCREENS.RENEW_SUBSCRIPTION:
            return <RenewSubscriptionComponent/>
        case MARKETSMITH_SCREENS.SUBSCRIPTION:
            return <SubscriptionOptionsComponent/>  
        case MARKETSMITH_SCREENS.CHOOSE_TENURE:
            return <ChooseTenureComponent/> 
        case MARKETSMITH_SCREENS.COMPARISON:
            return <ComparisonComponent/>  
        default:
            return null     
    }
}
const mapStateToProps = ({ settings,marketsmithdetails}) => {
    return {
        selectedTheme: settings.selectedTheme,
        marketSmthData: marketsmithdetails.marketSmthData
       
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) },
        storeMarketSmithData: (s) => { dispatch(storeMarketSmithData(s)) }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(WidgetLoader(MarketSmithBase));

