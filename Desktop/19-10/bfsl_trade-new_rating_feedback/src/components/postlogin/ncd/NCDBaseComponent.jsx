import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AF_EventTriggered } from "../../../common/CommonMethods";
import { AF_EVENT_NAMES, AF_EVENT_TYPES, NCD_MENUS, NCD_MENU_ARRAY } from "../../../common/Constants";
import LangText from "../../../common/lang/LangText";
import { storeNCDOrderbookNavigation } from "../../../state/actions/Actions";
import IPOandNCDHeaderComponent from "../header/IPOandNCDHeaderComponent";
import NCDListComponent from "./NCDListComponent";
import NCDOrderBookComponent from "./NCDOrderBookComponent";

function NCDBaseComponent(props)  {

    const [selectedMenu, setSelectedMenu] = useState(NCD_MENU_ARRAY[0].name)

    useEffect(()=>{
        AF_EventTriggered(AF_EVENT_NAMES.NCD , AF_EVENT_TYPES.NCD_CLICK, {"onClick":"ncd"})
    },[])

    useEffect(() => {
        if (props.gotoOrderBook) {
            setSelectedMenu(NCD_MENUS.ORDERBOOK)
            props.storeNCDOrderbookNavigation(false)
        }
        else
            AF_EventTriggered(AF_EVENT_NAMES.NCD , AF_EVENT_TYPES.LIST_NCD, {"onClick":"ncd"})
    }, [props.gotoOrderBook])

    return(
        <div className="ncd-base">
            <div className="ncd-data-base">
                <IPOandNCDHeaderComponent/>
                <div className="ncd-data">
                    <div className="ncd-header">
                        {
                            NCD_MENU_ARRAY.map((item, index) => {
                                return (
                                    <div key={index} className={`menu ${selectedMenu === item.name ? 'active' : ''}`}
                                        onClick={() => setSelectedMenu(item.name)}
                                    >
                                        <LangText name={item.langKey} module="NCD" />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="ncd-table-base">
                        {getSelectedTable(selectedMenu)}
                    </div>
                </div>
            </div>
        </div>
    )
}

function getSelectedTable(menu) {
    switch (menu) {
        case NCD_MENUS.LIST_NCD:
            return <NCDListComponent/>
        case NCD_MENUS.ORDERBOOK:
            return <NCDOrderBookComponent/>
        default:
            return null
    }
}

const mapStateToProps = ({ ncdDetails }) => {
    return {
        gotoOrderBook: ncdDetails.gotoOrderBook,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeNCDOrderbookNavigation: (s) => { dispatch(storeNCDOrderbookNavigation(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps) (NCDBaseComponent);