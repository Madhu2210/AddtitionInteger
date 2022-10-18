import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { MsfRequest, useFetch } from '../../../../index';

import IdeaCardComponent from './IdeaCardComponent';

import { AF_EVENT_NAMES, AF_EVENT_TYPES, DASHBOARD_WIDGET_MODE, THEMES } from '../../../../common/Constants';
import LangText from '../../../../common/lang/LangText';

import { OTHER_PRODUCTS_SERVICE } from '../../../../config/ServiceURLs';

import { AF_EventTriggered, getIdeasBaseURL } from '../../../../common/CommonMethods';
import { WidgetLoader } from '../../../common/WidgetLoaderComponent';
import { storeSelectedDashboardWidget } from '../../../../state/actions/Actions';
import TaxDeclarationAlertDialogComponent from '../../orderPad/TaxDeclarationAlertDialogComponent';

function IdeaBaseComponent(props) {

    const MsfFetch = useFetch()

    const [ideasInfo, setIdeasInfo] = useState([])
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        AF_EventTriggered(AF_EVENT_NAMES.IDEAS , AF_EVENT_TYPES.IDEAS_MENU_CLICK,{"onClick":"Ideas"})
    }, [])

    useEffect(() => {
        getIdeaInfo()
    }, [])

    function getIdeaInfo() {
        let request = new MsfRequest();
        request.addToData({})
        props.showWidgetLoader();
        // request.setEncrypt(false)
        MsfFetch.placeRequest(
            getIdeasBaseURL() + OTHER_PRODUCTS_SERVICE.IDEAS_INFO,
            request,
            successRespCBIdeasInfo,
            errorRespCBIdeasInfo
        )
    }

    function successRespCBIdeasInfo(response) {
        props.hideWidgetLoader();
        let validTabs = response.data.tabs.filter(function (e) { return e.isActive == true; });
        setIdeasInfo(validTabs)
    }

    function errorRespCBIdeasInfo(error) {
        props.hideWidgetLoader();
        setErrorMsg(error.message)
    }

    function onClickCloseIdeas() {
        props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT)
    }

    return (
        <div className="ideaBase">
            <div className="ideaBase-header">
                <div className="headerBase">
                    <div className="head-name">
                        <LangText name="IDEAS_HEADER" module="IDEAS" />
                    </div>
                    <div className="close-button" onClick={onClickCloseIdeas} >
                        {
                            props.selectedTheme.theme === THEMES.LIGHT ?
                                <img src="assets/images/dashboard/close_icon.svg" alt="" />
                                :
                                <img src="assets/images/dark/dashboard/close_icon.svg" alt="" />
                        }
                    </div>
                </div>
            </div>
            <div className="ideaBase-content">
                {
                    (ideasInfo && ideasInfo.length) ?
                        <>
                            <div className="ideaBase-cardBase">

                                {
                                    ideasInfo.map((item, index) => {
                                        return (
                                            <>
                                                <IdeaCardComponent
                                                    ideasInfo={item}
                                                    key={index}
                                                    getIdeaInfoCB={getIdeaInfo}
                                                    cardIndex={index} />
                                            </>
                                        )
                                    })

                                }

                            </div>
                        </>

                        :
                        <div className="errorRow">
                            <div className="colspan">
                                {errorMsg}
                            </div>
                        </div>
                }
            </div>
            <TaxDeclarationAlertDialogComponent />
        </div>

    )
}

const mapStateToProps = ({ settings, profileDialog }) => {
    return {
        selectedTheme: settings.selectedTheme,
        taxDeclaration: profileDialog.taxDeclaration,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WidgetLoader(IdeaBaseComponent));