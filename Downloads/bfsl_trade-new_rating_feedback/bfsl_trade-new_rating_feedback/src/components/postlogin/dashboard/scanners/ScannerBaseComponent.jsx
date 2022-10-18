import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import LangText from '../../../../common/lang/LangText';
import { SCANNERS } from '../../../../common/Scanners';
import { storeSelectedDashboardWidget, storeSelectedScannerMenu } from '../../../../state/actions/Actions';
// import ScannerTableComponent from './ScannerTableComponent';
import ExponentialMovingAverageComponent from './ExponentialMovingAverage';
import SimpleMovingAverageComponent from './SimpleMovingAverageComponent';
import { DASHBOARD_WIDGET_MODE, THEMES } from '../../../../common/Constants';

function ScannerBaseComponent(props) {
    const [scannerMenu, setScannerMenu] = useState([])
    const [selectedScanMenu, setSelectedScanMenu] = useState('')

    useEffect(() => {
        const values=Object.values(SCANNERS);
        // console.log('values: ', values);
        let scannerMenus = [];
        values.map((item) =>
        {
            scannerMenus.push(item.langKey)
        })
        // console.log("menu",scannerMenus)
        // scannerMenus= [{
        //     "key":"CUSTOM_SCANNERS",
        //     "head":"Custom Scanners",
        // }]
        // const keys = Object.keys(SCANNERS);
        setScannerMenu(scannerMenus)
        setSelectedScanMenu(scannerMenus[0].head)
        props.storeSelectedScannerMenu(scannerMenus[0].head)
    }, [])

    function onSelectScanMenu(scannerName) {
        setSelectedScanMenu(scannerName.head)
        props.storeSelectedScannerMenu(scannerName.head)

    }

    function selectScanComponent(selectedMenu) {
        // console.log('selectedMenu: ', selectedMenu);
        // console.log("Keys",scannerMenu)
        if(scannerMenu.length){
            if (selectedMenu === scannerMenu[1].head)
                return <ExponentialMovingAverageComponent />
                
            return <SimpleMovingAverageComponent />
  
        }
        return null
    }
    function onClickCloseScanner() {
        props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT)
    }

    return (
        <div className="scannersBase">
            <div className="scannersBase-header">
                <div className="headerBase">
                    <div className="head-name">
                        <LangText name="SCANNERS_HEAD" module="SCANNERS" />
                    </div>
                    <div className="close-button" onClick={onClickCloseScanner} >
                        {
                            props.selectedTheme.theme === THEMES.LIGHT ?
                                <img src="assets/images/dashboard/close_icon.svg" alt="" />
                                :
                                <img src="assets/images/dark/dashboard/close_icon.svg" alt="" />
                        }
                    </div>
                </div>
                <div className="menuArray">
                    <div className="scannersMenu-div">
                        {
                            scannerMenu ?
                                scannerMenu.map((item, index) => {
                                    // console.log('item: ', item);
                                    return (
                                        <span key={index}

                                            className={`menusTab cursor ${selectedScanMenu === item.head ?
                                                'selectedMenu' : ''}`}
                                            onClick={() => onSelectScanMenu(item)}
                                        >
                                            <span className="menuName"><LangText name={item.key}/></span>
                                        </span>
                                    )
                                })
                                : ''
                        }
                    </div>
                </div>
            </div>
            {selectScanComponent(selectedScanMenu)}
        </div>
    )
}

const mapStateToProps = ({ scanner, dashboard, settings }) => {
    return {
        selectedMenu: scanner.selectedMenu,
        selectedWidgetMode: dashboard.selectedWidgetMode,
        selectedTheme: settings.selectedTheme
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeSelectedScannerMenu: (s) => { dispatch(storeSelectedScannerMenu(s)) },
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScannerBaseComponent)