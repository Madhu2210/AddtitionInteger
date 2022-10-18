import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import LangText from '../../../common/lang/LangText'
import OnGoingOFSComponent from './OnGoingOFSComponent'
import UpComingOFSComponent from './UpComingOFSComponent'
import OFSOrderBookComponent from './OFSOrderbookComponent'

import { storeOFSOrderbookNavigation } from '../../../state/actions/Actions';

import {  OFS_MENUS, OFS_MENU_ARRAY } from '../../../common/Constants';

function OFSBaseComponent(props) {

    const [selectedMenu, setSelectedMenu] = useState(OFS_MENU_ARRAY[0].name)

    useEffect(() => {
        if (props.gotoOrderBook) {
            setSelectedMenu(OFS_MENUS.ORDERBOOK)
            props.storeOFSOrderbookNavigation(false)
        }
    }, [props.gotoOrderBook])

    return (
        <div className="ofs-base">
            <div className="ofs-data-base">
                <div className="head-name">
                    <LangText name="OFFER" module="OFS" />
                </div>
                <div className="ofs-data">
                    <div className="ofs-header">
                        {
                            OFS_MENU_ARRAY.map((item, index) => {
                                return (
                                    <div key={index} className={`menu ${selectedMenu === item.name ? 'active' : ''}`}
                                        onClick={() => setSelectedMenu(item.name)}
                                    >
                                        <LangText name={item.langKey} module="OFS" />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="ofs-table-base">
                        {getSelectedTable(selectedMenu)}
                    </div>
                </div>
            </div>
        </div>
    )
}

function getSelectedTable(menu) {
    switch (menu) {
        case OFS_MENUS.ONGOING_OFS:
            return <OnGoingOFSComponent />
        case OFS_MENUS.UPCOMING_OFS:
            return <UpComingOFSComponent />
        case OFS_MENUS.ORDERBOOK:
            return <OFSOrderBookComponent />
        default:
            return null
    }
}

const mapStateToProps = ({ ofsDetails }) => {
    return {
        gotoOrderBook: ofsDetails.gotoOrderBook,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeOFSOrderbookNavigation: (s) => { dispatch(storeOFSOrderbookNavigation(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OFSBaseComponent);