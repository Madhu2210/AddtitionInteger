import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";

import LangText from '../../../common/lang/LangText'
import OpenIPOComponent from './OpenIPOComponent';
import ClosedIPOComponent from './ClosedIPOComponent';
import UpComingIPOComponent from './UpComingIPOComponent';
import IPOOrderbookComponent from './IPOOrderBookComponent';
import IPOOrderHistoryComponent from './IPOOrderHistoryComponent';

import { storeIPOOrderbookNavigation } from '../../../state/actions/Actions';

import { AF_EVENT_NAMES, AF_EVENT_TYPES, IPO_MENUS, IPO_MENU_ARRAY } from '../../../common/Constants';
import { withRouter } from 'react-router-dom';
import IPOandNCDHeaderComponent from '../header/IPOandNCDHeaderComponent';
import { AF_EventTriggered } from '../../../common/CommonMethods';

function IPOBaseComponent(props) {

    const [selectedMenu, setSelectedMenu] = useState(IPO_MENU_ARRAY[0].name)

    useEffect(()=>{
        AF_EventTriggered(AF_EVENT_NAMES.IPO , AF_EVENT_TYPES.IPO_CLICK)
    },[])

    useEffect(() => {
        if (props.gotoOrderBook) {
            setSelectedMenu(IPO_MENUS.ORDERBOOK)
            props.storeIPOOrderbookNavigation(false)
            AF_EventTriggered(AF_EVENT_NAMES.IPO , "ORDERBOOK_TAB")
        }
    }, [props.gotoOrderBook])

    return (
        <div className="ipo-base">
            <div className="ipo-data-base">
                <IPOandNCDHeaderComponent/>
                <div className="ipo-data">
                    <div className="ipo-header">
                        {
                            IPO_MENU_ARRAY.map((item, index) => {
                                return (
                                    <div key={index} className={`menu ${selectedMenu === item.name ? 'active' : ''}`}
                                        onClick={() => setSelectedMenu(item.name)}
                                    >
                                        <LangText name={item.langKey} module="IPO" />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="ipo-table-base">
                        {getSelectedTable(selectedMenu)}
                    </div>
                </div>
            </div>
        </div>
    )
}

function getSelectedTable(menu) {
    switch (menu) {
        case IPO_MENUS.OPEN_IPO:
            return <OpenIPOComponent />
        case IPO_MENUS.CLOSED_IPO:
            return <ClosedIPOComponent />
        case IPO_MENUS.UPCOMING_IPO:
            return <UpComingIPOComponent />
        case IPO_MENUS.ORDERBOOK:
            return <IPOOrderbookComponent />
        case IPO_MENUS.ORDER_HISTORY:
            return <IPOOrderHistoryComponent />
        default:
            return null
    }
}

const mapStateToProps = ({ ipoDetails }) => {
    return {
        gotoOrderBook: ipoDetails.gotoOrderBook,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeIPOOrderbookNavigation: (s) => { dispatch(storeIPOOrderbookNavigation(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(IPOBaseComponent));