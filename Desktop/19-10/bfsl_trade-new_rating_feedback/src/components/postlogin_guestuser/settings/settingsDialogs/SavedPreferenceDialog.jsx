import React,{useEffect,useState} from 'react'
import { connect } from 'react-redux'
import { EXCHANGE_DATA_LIST } from '../../../../common/Constants'
import LangText from '../../../../common/lang/LangText'
import { storeSettingsDialogDetails } from '../../../../state/actions/Actions'
import { AscOrderSortIcon, DescOrderSortIcon } from '../../../common/FontIcons'

function SavedFilterDialog(props) {
    const [dispSymbolAsc, setDispSymbolAsc] = useState(false)
    const [dispSymbolDesc, setDispSymbolDesc] = useState(false)
    const [dispLtpAsc, setDispLtpAsc] = useState(false)
    const [dispLtpDesc, setDispLtpDesc] = useState(false)
    const [dispChngPerAsc, setDispChngPerAsc] = useState(false)
    const [dispChngPerDesc, setDispChngPerDesc] = useState(false)
    const [excArray, setExcArray] = useState(EXCHANGE_DATA_LIST)

    useEffect(() => {
        if (props.filterParams && props.filterParams.length) {
            let filteredExchange = Object.assign([], props.filterParams)
            let excArrayList = JSON.parse(JSON.stringify(EXCHANGE_DATA_LIST))
            excArrayList = excArrayList.map((item) => {
                filteredExchange.map(item2 => {
                    if (item.name === item2.name) {
                        item.selected = true
                    }
                })
                return item
            })
            setExcArray(excArrayList)
        }

        if (props.sortParams) {
            let sortOptions = props.sortParams
            if (sortOptions.key === 'dispSym') {
                if (sortOptions.sortType === 'ASC') {
                    setDispSymbolAsc(true)
                    // setDispLtp(false) 
                }
                if (sortOptions.sortType === 'DESC') {
                    setDispSymbolDesc(true)
                    // setDispLtp(false) 
                }
            }

            else if (sortOptions.key === 'ltp') {
                if (sortOptions.sortType === 'ASC') {
                    setDispLtpAsc(true)
                }

                if (sortOptions.sortType === 'DESC') {
                    setDispLtpDesc(true)
                }
            }

            else if (sortOptions.key === 'chngPer') {
                if (sortOptions.sortType === 'ASC') {

                    setDispChngPerAsc(true)
                }
                if (sortOptions.sortType === 'DESC') {
                    setDispChngPerDesc(true)
                }
            }
        }

    }, [props.filterParams,props.sortParams])

    return (
        <div className="app-modalDialog preference-display-dialog">
            <div className="window">
                <div className="header">
                    <span className= "text">
                        <LangText name="FILTER_SORT"/>
                    </span>                   
                </div>
                <div className="sorting-display">
                    <div className="filter-list">
                        <div  className="filter-heading">
                        </div>
                        <div className="exc-list">
                            {
                             
                                excArray.map((item, index) => {
                                
                                    return (

                                        <span key={index}
                                            className={`exc-list-item   ${item.selected ? "active" : ""}`}>
                                            {item.name}
                                        </span>
                                    )
                                })
                               
                            }
                        </div>
                        <div className="sorting-div">
                            <div className="watchsort-head">
                                <LangText name="WATCH_SORT" />
                            </div>

                            <div className="sortlisting">
                                <div className="row-div">
                                    <span className="label">
                                        <LangText name="WATCH_ALPHABETIC" /></span>
                                    <span className={`sorticon ${dispSymbolAsc ? 'active' : ''}`}>

                                    A
                                        < AscOrderSortIcon />
                                    Z
                                    </span>
                                    <span className={`sorticon ${dispSymbolDesc ? 'active' : ''}`}>
                                    Z
                                        <DescOrderSortIcon />
                                    A
                                    </span>
                                </div>
                                <div className="row-div">
                                    <span className="label">
                                        <LangText name="WATCH_LTP" /></span>
                                    <span className={`sorticon ${dispLtpAsc ? 'active' : ''}`}>
                                    ₹
                                        <AscOrderSortIcon />
                                    </span>
                                    <span className={`sorticon ${dispLtpDesc ? 'active' : ''}`}>
                                    ₹
                                        <DescOrderSortIcon />
                                    </span>
                                </div>
                                <div className="row-div">
                                    <span className="label">
                                        <LangText name="WATCH_CHNG" /></span>
                                    <span className={`sorticon ${dispChngPerAsc ? 'active' : ''}`}>
                                    %
                                        <AscOrderSortIcon />

                                    </span>
                                    <span className={`sorticon ${dispChngPerDesc ? 'active' : ''}`}>
                                    %
                                        <DescOrderSortIcon />

                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ settings,watchlist }) => {
    return {
        savePreference: settings.savePreference,
        sortParams: watchlist.sortParams,
        filterParams: watchlist.filterParams,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeSettingsDialogDetails: (s) => { dispatch(storeSettingsDialogDetails(s)) },
        
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(SavedFilterDialog);

