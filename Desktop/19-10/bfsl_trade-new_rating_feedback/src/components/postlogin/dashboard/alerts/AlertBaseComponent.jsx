import React,{useEffect} from 'react'
import { connect } from "react-redux";
import {storeAlertSelectedSym} from '../../../../state/actions/Actions'
import LangText from '../../../../common/lang/LangText';
import MarketDepthBaseComponent from '../../marketDepth/MarketDepthBaseComponent';
import QuoteDetailViewComponent from '../../../common/QuoteDetailViewComponent';
import SetAlertDialogComponent from './SetAlertDialogComponent';
import { AF_EventTriggered } from '../../../../common/CommonMethods';
import { AF_EVENT_NAMES, AF_EVENT_TYPES } from '../../../../common/Constants';
// import useCloseModal from '../../../../customHooksComponents/useCloseModal';

const AlertBaseComponent = (props) => {

    // const modalRef = useRef(null)
    // const closeModal = useCloseModal()
    // closeModal.useOutsideAlerter(modalRef,onClose)

    const { setAlerts } = props

    // function onClose() {
    //     console.log(setAlerts)
    //     // props.storeAlertSelectedSym(null)
    // }

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.ALERT , AF_EVENT_TYPES.ALERT_MENU_CLICK)
    }, [])

    if (!setAlerts.selectedSym)
        return null
    return (
        <div className="tradeBase">
            <div className="trade-content">
                <SetAlertDialogComponent selectedSym={setAlerts.selectedSym}/>
            </div>
            <div className="market-depth-base">
                <div className="mdHeader flex-center">
                    <LangText name="MARKET_DEPTH_TXT" module="MARKET_DEPTH" />
                </div>
                <div className="mdContent">
                    <MarketDepthBaseComponent selectedSym={setAlerts.selectedSym} parent="OrderPad" />
                    <QuoteDetailViewComponent selectedSym={setAlerts.selectedSym} />
                </div>
                <div className="mdFooter"></div>
            </div>
        </div>
    )
}
const mapStateToProps = ({ alerts }) => {
    return {
        setAlerts: alerts
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAlertSelectedSym: (s) => { dispatch(storeAlertSelectedSym(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AlertBaseComponent);