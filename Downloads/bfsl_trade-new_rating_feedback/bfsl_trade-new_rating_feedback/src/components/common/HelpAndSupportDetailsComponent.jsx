import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { initDirectDemoTour, reInitDemoTour } from '../../common/Bridge';
import { AF_EventTriggered } from '../../common/CommonMethods';
import { AF_EVENT_NAMES, AF_EVENT_TYPES, DASHBOARD_WIDGET_MODE, LOCAL_STORAGE, SCREENS } from '../../common/Constants'
import LangText from '../../common/lang/LangText'
import { getItemFromSessionStorage } from '../../common/LocalStorage'
import {
    storeDemoWatchList, storeDemoWatchListMtf, storeHelpAndSupportPopupFlag,
    storeHelpAndSupportSamadhanFlag,
    storeOrderPadDialogDetails, storeSelectedDashboardWidget,
    storeSelectedQuoteSym,
    storeTaxDeclarationDetails,
} from '../../state/actions/Actions';
import { DemoTourIcon, EmailIcon, HeadPhonesIcon, PhoneIcon } from './FontIcons'

const HelpAndSupportDetailsComponent = (props) => {

    const [website, setWebsite] = useState('')
    const [email, setEmail] = useState('')
    const [tollFreeNo, setTollFreeNo] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        let helpSupport = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.HELP_AND_SUPPORT))
        let isLoggedIn = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.LOGIN_STATUS))
        console.log(helpSupport,isLoggedIn)
        setLoggedIn(isLoggedIn)
        setWebsite(helpSupport.samadhan)
        setEmail(helpSupport.email)
        setTollFreeNo(helpSupport.number)
    }, [])

    function showDemoTourOptions() {
        props.storeHelpAndSupportPopupFlag({ showHelpAndSupport: false })
        watchlistSetDemo()
        props.storeSelectedQuoteSym(null)
        props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT)
        props.storeOrderPadDialogDetails({
            dialogName: null
        })
        props.storeTaxDeclarationDetails({
            dialogName: null,
            hideOrderpadFooter: true
        })
        if (props.history && props.history.location && props.history.location.pathname !== SCREENS.DASHBOARD) {
            props.history.push(SCREENS.DASHBOARD)
            initDirectDemoTour()

        }
        else {
            reInitDemoTour()

        }
        AF_EventTriggered(AF_EVENT_NAMES.HELP_SUPPORT , AF_EVENT_TYPES.DEMO, {"onClick ":"demo"})
    }

    function watchlistSetDemo() {
        let wObj = Object.assign([], props.selectedWatchgroupResp)
        let updatedList = wObj[props.selectedWatchgroup.wName]
        props.storeDemoWatchList(updatedList[0])
        if (updatedList[0].sym.instrument === "FUTSTK") {
            props.storeDemoWatchListMtf(true)
        }
    }

    function onClickWebsite() {
        console.log("onclickwebsite")
        props.storeHelpAndSupportSamadhanFlag(true)
        AF_EventTriggered(AF_EVENT_NAMES.HELP_SUPPORT , AF_EVENT_TYPES.WEBSITE, {"onTap":"samadhanUrl"})
    }

    return (
        <div className="help-data-value-container">
            <div className="data">
                <span className="icon"><HeadPhonesIcon /></span>
                <div className="data-text" >
                    <div className="field-name"> <LangText module="HELPNSUPPORT" name="QA" /></div>
                    {website !== '' && loggedIn !== true?
                        <a href={website} target="_blank"
                            className="website-link" rel="noopener noreferrer">
                            <LangText module="HELPNSUPPORT" name="SAMADHAN" />
                        </a>
                        :
                        <span onClick={onClickWebsite} className="website-link">
                            <LangText module="HELPNSUPPORT" name="SAMADHAN" />
                        </span>
                    }

                </div>
            </div>
            <div className="data">
                <span className="icon"><EmailIcon /></span>
                <div className="data-text">
                    <div className="field-name"><LangText module="HELPNSUPPORT" name="EMAIL" /></div>
                    <a href="mailto:connect@bajajfinserv.in" target="_blank"
                        className="field-value" rel="noopener noreferrer">{email}</a>
                    {/* <div className="field-value">{email}</div> */}
                </div>
            </div>
            <div className={` ${loggedIn ? "data" : "data-lastchild"}`}>
                <span className="icon"><PhoneIcon /></span>
                <div className="data-text">
                    <div className="field-name"><LangText module="HELPNSUPPORT" name="CALL" /></div>
                    <div className="field-value-number">{tollFreeNo}</div>
                </div>
            </div>
            {
                loggedIn ?
                    <div className="data-lastchild demoTour cursor" onClick={showDemoTourOptions}>
                        <span className="icon"><DemoTourIcon /></span>
                        <div className="data-text">
                            <div className="field-name "><LangText name="DEMOTOUR" /></div>
                        </div>
                    </div>
                    : null
            }
        </div>

    )
}
const mapStateToProps = ({ watchlist }) => {
    return {
        selectedWatchgroup: watchlist.selectedWatchgroup,
        selectedWatchgroupResp: watchlist.selectedWatchgroupResp
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeDemoWatchList: (s) => { dispatch(storeDemoWatchList(s)) },
        storeDemoWatchListMtf: (s) => { dispatch(storeDemoWatchListMtf(s)) },
        storeSelectedQuoteSym: (s) => { dispatch(storeSelectedQuoteSym(s)) },
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) },
        storeOrderPadDialogDetails: (s) => { dispatch(storeOrderPadDialogDetails(s)) },
        storeHelpAndSupportPopupFlag: (s) => { dispatch(storeHelpAndSupportPopupFlag(s)) },
        storeTaxDeclarationDetails: (s) => { dispatch(storeTaxDeclarationDetails(s)) },
        storeHelpAndSupportSamadhanFlag: (s) => { dispatch(storeHelpAndSupportSamadhanFlag(s)) }

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HelpAndSupportDetailsComponent));
