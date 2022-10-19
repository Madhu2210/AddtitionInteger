import React, { useEffect, useRef, useState } from 'react'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'

import { Loader } from '../../common/LoaderComponent'
import useCloseModal from '../../../customHooksComponents/useCloseModal';
import LangText from '../../../common/lang/LangText';
// import ProfileDetails from './MenuProfileDetailsComponent';
import {
    storeBOReportsScreenFlag,
    storeEdisScreenFlag,
    storeOrderPadDialogDetails, storeProfileImageUrl, storeSelectedAppMenu, storeSelectedDashboardWidget,
    storeSelectedQuoteSym, storeSettingsDialogDetails, storeShowMenuFlag, storeShowPledgeFlag,
    storeAlertFlag,
    storeAlertSelectedSym, storeHelpAndSupportPopupFlag,
    storeAvailLoanDialogDetails,
    storeUserStage,
    showAppDialog,
    storeLASUserStageResponse,
    storeLoanInit,
    storeLAN,
    storeEagreeResponse,
    storeUserLoanAmt,
    storeIsUserAcceptedKYC, refreshDemoTour, setDemoTourFlag, storeSelectedScannerMenu,
    storeDemoWatchList,
    storeDemoWatchListMtf,
    showProfileDialog,
    storeRatingAndFeedback,
    
    
} from '../../../state/actions/Actions';

import { CloseIcon, IncomeDeclarationIcon } from '../../common/FontIcons';
import {
    APP_MENUS, APP_MENU_LIST, DASHBOARD_WIDGET_MODE, LANG_TEXT_KEY,
    HEADER_SETTINGS, SCREENS, PROFILE_POA_STATUS, MENU_ALT_NAME, LAS_LOAN_DIALOGS, LAS_USER_STAGE, LOCAL_STORAGE,
    AF_EVENT_NAMES, AF_EVENT_TYPES,
} from '../../../common/Constants';
import { AF_EventTriggered, convertToUpperCase, getBackOfficeBaseURL, getIdeasBaseURL 
} from '../../../common/CommonMethods';
import { LAS_SERVICES, LAS_SERVICE_JOURNEY, OTHER_PRODUCTS_SERVICE } from '../../../config/ServiceURLs';
import { MsfRequest, useFetch,encrypt } from '../../../index'
import { getTaxDecalreDetails, openTaxDeclarationDialog, } from '../../../common/Bridge';

function MenuDialogBaseComponent(props) {
    const MsfFetch = useFetch()

    const [menuList, setMenuList] = useState([])
    const [selectedMenu, setSelectedMenu] = useState(null)
    const [showTaxDeclare, setShowTaxDeclare] = useState(false)
    const [actionURLUS] = useState(getIdeasBaseURL() + OTHER_PRODUCTS_SERVICE.US_BASE)
    const [actionURLBonds] = useState(getIdeasBaseURL() + OTHER_PRODUCTS_SERVICE.BONDS)
    const [actionURLThematics] = useState(getIdeasBaseURL() + OTHER_PRODUCTS_SERVICE.THEMATICS)
    // const [showOptions, setShowOptions] = useState(false)

    const connectFormRefUS = useRef(null)
    const connectFormRefBonds = useRef(null)
    const connectFormRefThematics = useRef(null)
    const scrollAreaRef = useRef(null)

    const requestVas = "request={data:{}}}"
    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onCloseMenuDialog, false)

    useEffect(() => {
        if (props.selectedAppMenu)
            setSelectedMenu(props.selectedAppMenu)
        else
            setSelectedMenu()
    }, [props.selectedAppMenu])

    useEffect(() => {
        if (props.showMenuDialog) {
            if (props.history && props.history.location) {
                if (props.history.location.pathname === SCREENS.DASHBOARD) {
                    if (props.selectedWidgetMode !== DASHBOARD_WIDGET_MODE.MARKET_VIEW) {
                        setSelectedMenu(APP_MENUS.DASHBOARD)
                        props.storeSelectedAppMenu(APP_MENUS.DASHBOARD)
                    }
                    if (props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.SCANNERS_VIEW) {
                        setSelectedMenu(APP_MENUS.SCANNERS)
                        props.storeSelectedAppMenu(APP_MENUS.SCANNERS)
                    }
                    if (props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.NEWS_VIEW) {
                        setSelectedMenu(APP_MENUS.NEWS)
                        props.storeSelectedAppMenu(APP_MENUS.NEWS)
                    }
                    if (props.selectedWidgetMode === DASHBOARD_WIDGET_MODE.IDEAS_VIEW) {
                        setSelectedMenu(APP_MENUS.IDEAS)
                        props.storeSelectedAppMenu(APP_MENUS.IDEAS)
                    }
                } else {
                    let routePath = getKeyByValue(SCREENS, props.history.location.pathname)
                    // console.log('routePath', routePath, props.history.location.pathname)
                    if (routePath === MENU_ALT_NAME.FUNDS_TRANSFER)
                        routePath = APP_MENUS.FUND_TRANSFER
                    else if (routePath === MENU_ALT_NAME.BO)
                        routePath = APP_MENUS.BO
                    else if (routePath === MENU_ALT_NAME.ALERTS)
                        routePath = APP_MENUS.ALERT
                    else if (routePath === MENU_ALT_NAME.LAS || routePath === MENU_ALT_NAME.AVAIL_LOAN)
                        routePath = APP_MENUS.LAS
                    else if (routePath === MENU_ALT_NAME.OFS)
                        routePath = APP_MENUS.OFS
                    else if (routePath === MENU_ALT_NAME.IPO || routePath === MENU_ALT_NAME.NCD)
                        routePath = APP_MENUS.IPO_NCD
                    setSelectedMenu(routePath)
                    props.storeSelectedAppMenu(routePath)
                }
            }
        }
    }, [props.showMenuDialog])

    useEffect(() => {
        let menus = Object.assign([], APP_MENU_LIST)
        let updatedMenu = menus.filter(item => item.name !== APP_MENUS.EDIS)
        if (props.profileData) {
            if ((convertToUpperCase(props.profileData.poaStatus) === PROFILE_POA_STATUS.INACTIVE
            // !props.profileData.ddpiFlg
            ))
                updatedMenu = menus
            if (!props.profileData.isLasAvailable)
                updatedMenu = menuFilter(updatedMenu, [APP_MENUS.LAS])
        } else
            updatedMenu = menuFilter(menus, [APP_MENUS.EDIS])

        setMenuList(updatedMenu)
    }, [props.profileData])

    useEffect(() => {
        let profileData = props.profileData ? props.profileData : null
        let declarationData = getTaxDecalreDetails(profileData)
        setShowTaxDeclare(declarationData.showUpdateIncome)
    }, [props.profileData, props.showMenuDialog])

    // useEffect(() => {
    //     if (showOptions)
    //         scrollAreaRef.current.scrollTo(0, scrollAreaRef.current.scrollHeight)
    // }, [showOptions])

    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    function menuFilter(menus, filterMenus) {
        if (filterMenus && filterMenus.length) {
            filterMenus.map((mItem) => {
                menus = menus.filter(item => item.name !== mItem)
            })
        }

        return menus
    }

    function onClickTaxDeclare() {
        // props.showProfileDialog({
        //     dialogName: HEADER_PROFILE.PROFILE_PAGE
        // })
        openTaxDeclarationDialog()
        onCloseMenuDialog()
    }

    function onSelectMenu(menu) {
        window.sessionStorage.removeItem(encrypt(LOCAL_STORAGE.LOGIN_URL));
        if (menu.name !== APP_MENUS.DASHBOARD && menu.path) {
            props.storeSelectedDashboardWidget(null)
        }
        if (!menu.innerAction) {
            setSelectedMenu(menu.name)
            props.storeSelectedAppMenu(menu.name)
        }
        if (menu.path) {
            props.history.push(menu.path)
        }

        if (menu.name === APP_MENUS.DASHBOARD) {
            props.storeSelectedQuoteSym(null)
            props.storeOrderPadDialogDetails({
                dialogName: null
            })
            props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT)
            props.storeAlertSelectedSym(null)
            AF_EventTriggered(AF_EVENT_NAMES.DASHBOARD , AF_EVENT_TYPES.DASHBOARD,{"onClick":"dashboard"})

        } else if (menu.name === APP_MENUS.MARKETS) {
            props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.MARKET_VIEW)
            AF_EventTriggered(AF_EVENT_NAMES.MARKET , AF_EVENT_TYPES.MARKET_MENU_CLICK,{"onClick":"market"})

        }
        else if (menu.name === APP_MENUS.SCANNERS) {
            // console.log(props.selectedWidgetMode)
            // props.storeSelectedScannerMenu(null)
            if (props.selectedWidgetMode !== DASHBOARD_WIDGET_MODE.SCANNERS_VIEW) {
                props.storeSelectedScannerMenu(null)
            }
            props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.SCANNERS_VIEW)
            AF_EventTriggered(AF_EVENT_NAMES.SCANNERS , AF_EVENT_TYPES.SCANNERS_CLICK,{"onClick":"scanners"})

        }
        else if (menu.name === APP_MENUS.NEWS) {
            props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.NEWS_VIEW)
        }
        else if (menu.name === APP_MENUS.IDEAS) {
            props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.IDEAS_VIEW)
        }
        else if (menu.name === APP_MENUS.SETTINGS) {
            props.storeSettingsDialogDetails({
                dialogName: HEADER_SETTINGS.SETTINGS_BASE
            })
        } else if (menu.name === APP_MENUS.PLEDGE) {
            props.storeShowPledgeFlag(true)
            AF_EventTriggered(AF_EVENT_NAMES.PLEDGE, AF_EVENT_TYPES.E_PLEDGE ,{"onRedirect":"pledging"})

        }
        else if (menu.name === APP_MENUS.EDIS) {
            props.storeEdisScreenFlag(true)
            // getHoldings()
        }
        else if (menu.name === APP_MENUS.REPORTS) {
            props.storeBOReportsScreenFlag(true)
            AF_EventTriggered(AF_EVENT_NAMES.REPORT ,{"onClick":"report"})

        } else if (menu.name === APP_MENUS.ALERT) {
            props.storeAlertFlag(true)
            AF_EventTriggered(AF_EVENT_NAMES.ALERT ,AF_EVENT_TYPES.ALERT_MENU_CLICK, {"onClick":"alert"})
        }
        else if (menu.name === APP_MENUS.HELP_SUPPORT) {
            props.storeHelpAndSupportPopupFlag({
                showHelpAndSupport: true,
                isAfterLogin: true
            })
        }
        // else if (menu.name === APP_MENUS.OTHER_PRODUCTS) {
        //     setShowOptions(!showOptions)
        // }
        // else if (menu.name === APP_MENUS.AVAIL_LOAN) {

        //     props.history.push(SCREENS.AVAIL_LOAN)
        // }
        else if (menu.name === APP_MENUS.LAS) {
            props.storeUserStage({
                userStage: null
            })
            getUserstage()

        }
        // else if (menu.name === APP_MENUS.US_STOCKS) {
        //     connectFormRef.current.submit()
        // }
        // else if (menu.name === APP_MENUS.DEMO) {
        //     watchlistSetDemo()
        //     props.storeSelectedQuoteSym(null)
        //     props.storeSelectedDashboardWidget(DASHBOARD_WIDGET_MODE.DEFAULT)
        //     props.storeOrderPadDialogDetails({
        //         dialogName: null
        //     })
        //     if(props.history && props.history.location && props.history.location.pathname !== SCREENS.DASHBOARD){
        //         props.history.push(SCREENS.DASHBOARD)
        //         initDirectDemoTour()

        //     }
        //     else {
        //         reInitDemoTour()
        //     }
        // }
        onCloseMenuDialog(menu.name)
    }

    // function onSelectSubMenu(menu) {
    //     if (menu.name === APP_MENUS.LAS) {
    //         props.storeUserStage({
    //             userStage: null
    //         })
    //         getUserstage()
    //     }
    //     else if (menu.name === APP_MENUS.BONDS) {
    //         connectFormRefBonds.current.submit()
    //     }
    //     else if (menu.name === APP_MENUS.THEMATICS) {
    //         connectFormRefThematics.current.submit()
    //     }
    //     else if (menu.name === APP_MENUS.US_STOCKS) {
    //         connectFormRefUS.current.submit()
    //     }

    //     onCloseMenuDialog(menu.name)
    // }

    // function watchlistSetDemo() {
    //     let wObj = Object.assign([], props.selectedWatchgroupResp)
    //     let updatedList = wObj[props.selectedWatchgroup.wName]
    //     props.storeDemoWatchList(updatedList[0])
    //     if(updatedList[0].sym.instrument === "FUTSTK") {
    //         props.storeDemoWatchListMtf(true)
    //     }
    // }

    // function getHoldings() {
    //     let request = new MsfRequest();
    //     request.addToData({})
    //     MsfFetch.placeRequest(
    //         getBackOfficeBaseURL() + HOLDINGS.GET_HOLDINGS_BO,
    //         request,
    //         successRespCBGetHoldings,
    //         errorRespCBGetHoldings
    //     )

    // }

    // function successRespCBGetHoldings(response) {
    //     console.log('123holdingsresponse: ', response, props.profileData);
    //     if (!response.data.isAuthorized) {
    //         props.showAppDialog({
    //             message:  "Dear" + " "  + props.profileData.name + " " + "you have already authorised for the day",
    //             show: true
    //         })
    //     }
    //     else {
    //         props.storeEdisScreenFlag(true)
    //         AF_EventTriggered(AF_EVENT_NAMES.EDIS , AF_EVENT_TYPES.EDIS,{"onRedirect":"edis"})
    //     }
    // }

    // function errorRespCBGetHoldings(error) {
    //     console.log('error: ', error);
    // }

    function onCloseMenuDialog() {
        props.storeShowMenuFlag(false)
    
    }

    function getUserstage() {
        let request = new MsfRequest();
        props.showLoader()
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICES.GET_USER_STAGE,
            request,
            successRespCBGetEligibility,
            errorRespCBGetEligibility
        )
    }

    function successRespCBGetEligibility(response) {
        props.hideLoader()
        props.storeLASUserStageResponse(response.data)
        if (response.data.lan)
            props.storeLAN(response.data.lan)
        if (response.data.optAmt)
            props.storeUserLoanAmt(response.data.optAmt)

        if (!response.data.isNew) {
            if (response.data.stage == LAS_USER_STAGE.E_PLEDGE_COMPLETED) {
                getServiceJourney(response.data)
                // props.storeAvailLoanDialogDetails({
                //     dialogName: LAS_LOAN_DIALOGS.LAS_COMPLETED
                // })

            } else if (response.data.stage == LAS_USER_STAGE.LAS_TICKET_PENDING ||
                response.data.stage == LAS_USER_STAGE.LAS_TICKET_CREATED) {
                if (response.data.stage == LAS_USER_STAGE.LAS_TICKET_PENDING) {
                    props.storeAvailLoanDialogDetails({
                        dialogName: LAS_LOAN_DIALOGS.ABV_50L_POPUP
                    })
                } else {
                    props.storeAvailLoanDialogDetails({
                        dialogName: LAS_LOAN_DIALOGS.TICKET_CREATED
                    })
                }
            }

            else if (response.data.stage == LAS_USER_STAGE.SERVICE_JOURNEY) {

                props.storeLoanInit(true)
                props.history.push(SCREENS.AVAIL_LOAN)
                AF_EventTriggered(AF_EVENT_NAMES.LAS , AF_EVENT_TYPES.LAS_SERVICE_JOURNEY) 

            } else {

                props.storeUserStage({
                    userStage: response.data.stage
                    // userStage: "EKYC_FINISHED"
                    // userStage: "E-MANDATE FINISHED"

                })
                props.storeLoanInit(true)
                if (response.data.link) {
                    props.storeEagreeResponse(response.data)
                }

                props.history.push(SCREENS.LAS)

                if (response.data.stage == LAS_USER_STAGE.LOAN_PENDING) {
                    props.storeAvailLoanDialogDetails({
                        dialogName: LAS_LOAN_DIALOGS.LOAN_APPROVED_POPUP
                    })
                }
            }

        } else {
            props.storeLoanInit(true)
            props.storeUserStage({
                userStage: LAS_USER_STAGE.IS_NEW
            })
            props.history.push(SCREENS.LAS)
            props.storeIsUserAcceptedKYC(false)
            AF_EventTriggered(AF_EVENT_NAMES.LAS , AF_EVENT_TYPES.LAS_ONBOARDING) 
        }

    }

    function errorRespCBGetEligibility(error) {
        props.hideLoader()
        props.showAppDialog({
            message: error.message,
            show: true
        })

        // setErrorMsg(error.message)

    }

    function getServiceJourney(details) {
        props.showLoader()
        let loanId = details.loanId
        let lan = details.lan
        let request = new MsfRequest();
        request.addToData({
            "loanId": loanId,
            "lan": lan
        })
        MsfFetch.placeRequest(
            getBackOfficeBaseURL() + LAS_SERVICE_JOURNEY.GET_LOAN_DETAILS,
            request,
            successRespGetService,
            errorRespCBGetService
        )
    }
    function successRespGetService() {
        props.storeLoanInit(true)
        props.history.push(SCREENS.AVAIL_LOAN)
        props.hideLoader()
    }
    function errorRespCBGetService(error) {
        props.hideLoader()
        if (error.infoID == "LAS010") {
            props.storeAvailLoanDialogDetails({
                dialogName: LAS_LOAN_DIALOGS.LAS_COMPLETED
            })
        } else {
            props.showAppDialog({
                message: error.message,
                show: true
            })
        }
    }

    if (!props.showMenuDialog)
        return null

    return (
        <div className="menu-dialog">
            <div className="window" ref={modalRef}>
                <div className="header">
                    <img className="logoImg" src="assets/images/dashboard/logo_menu.svg" alt="" />
                    <span onClick={onCloseMenuDialog}>
                        <CloseIcon />
                    </span>
                </div>
                <div className="content">
                    {/* <ProfileDetails onClickProfileCB={onCloseMenuDialog} /> */}
                    <div
                        className={`menu-details scrollArea scroller_firefox ${showTaxDeclare ? "withTaxDeclare" : ""}`}
                        ref={scrollAreaRef}
                    >
                        {
                            menuList.map((item, index) => {
                                return (
                                    // <>
                                    <div key={index}
                                        className={`menu-row 
                                        ${selectedMenu === item.name ? 'selected' : ''} 
                                        `}
                                        onClick={() => onSelectMenu(item)}
                                    >
                                        {item.iconText ?
                                            <span className="menu-icon bfsl-font">{item.iconText}</span>
                                            :
                                            null}
                                        {item.iconText2 ?
                                            <span className="menu-icon bfsl-font-2">{item.iconText2}</span>
                                            :
                                            null}
                                        <span className="menu-name">
                                            <LangText name={item[LANG_TEXT_KEY]}  /></span>

                                        {/* {item.downArrow ?
                                                (item.subList && item.subList.length) ?
                                                    <DownArrowIcon key="down"
                                                        className={showOptions ? 'faceUp' : 'faceDown'} />
                                                    :
                                                    <DownArrowIcon key="up"
                                                        className={showOptions ? 'faceDown' : 'faceUp'} />
                                                :
                                                null
                                            }

                                        </div>
                                        {
                                            showOptions ?
                                                (item.subList && item.subList.length) ?
                                                    <div className="submenu-list">
                                                        <div className="subList">
                                                            {
                                                                item.subList.map((itemSub, indexSub) => {
                                                                    return (
                                                                        <div key={indexSub}
                                                                            className={`menu-row ${selectedMenu ===
                                                                                itemSub.name ? 'selected' : ''}`}
                                                                            onClick={() => onSelectSubMenu(itemSub)}
                                                                        >
                                                                            {itemSub.iconText2 ?
                                                                                <span className="menu-icon bfsl-font-2">
                                                                                    {itemSub.iconText2}</span>
                                                                                :
                                                                                null}
                                                                            <span className="menu-name">
                                                                                <LangText name={itemSub[LANG_TEXT_KEY]}
                                                                                    module="MENU" /></span>

                                                                        </div>
                                                                    )
                                                                })
                                                            } */}

                                        {/* </div> */}
                                    </div>
                                //             :
                                //             null
                                //         :
                                //         null
                                // }
                                    // </>
                                )
                            })
                        }
                    </div>
                    {
                        showTaxDeclare ?
                            <div className="tax-declare-btnDiv"
                                onClick={onClickTaxDeclare}
                            >
                                <IncomeDeclarationIcon />
                                <span className="tax-declare-btn">
                                    <LangText name="UPDATE_INCOME_DECLARE" module="TAX" />
                                </span>
                            </div>
                            : null
                    }
                    <form action={actionURLUS}
                        method="POST"
                        target="_blank"
                        id="test"
                        ref={connectFormRefUS}>
                        <input type="hidden" name="vestedssoUS" value={requestVas} />
                    </form>
                    <form action={actionURLBonds}
                        method="POST"
                        target="_blank"
                        ref={connectFormRefBonds}>
                        <input type="hidden" name="vestedssoBonds" value={requestVas} />
                    </form>
                    <form action={actionURLThematics}
                        method="POST"
                        target="_blank"
                        ref={connectFormRefThematics}>
                        <input type="hidden" name="vestedssoThematics" value={requestVas} />
                    </form>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ menu, dashboard, profileDialog, las, holdings }) => {
    return {
        showMenuDialog: menu.showMenuDialog,
        selectedAppMenu: menu.selectedAppMenu,
        selectedWidgetMode: dashboard.selectedWidgetMode,
        profileData: profileDialog.profileDetails,
        dialogName: las.dialogName,
        allHoldingsResp: holdings.allHoldingsResp

        // selectedWatchgroup: watchlist.selectedWatchgroup,
        // selectedWatchgroupResp: watchlist.selectedWatchgroupResp
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAlertFlag: (s) => { dispatch(storeAlertFlag(s)) },
        storeAlertSelectedSym: (s) => { dispatch(storeAlertSelectedSym(s)) },
        storeShowPledgeFlag: (s) => { dispatch(storeShowPledgeFlag(s)) },
        storeShowMenuFlag: (s) => { dispatch(storeShowMenuFlag(s)) },
        storeSelectedAppMenu: (s) => { dispatch(storeSelectedAppMenu(s)) },
        storeSelectedQuoteSym: (s) => { dispatch(storeSelectedQuoteSym(s)) },
        storeSelectedDashboardWidget: (s) => { dispatch(storeSelectedDashboardWidget(s)) },
        storeSettingsDialogDetails: (s) => { dispatch(storeSettingsDialogDetails(s)) },
        storeOrderPadDialogDetails: (s) => { dispatch(storeOrderPadDialogDetails(s)) },
        storeProfileImageUrl: (s) => { dispatch(storeProfileImageUrl(s)) },
        storeEdisScreenFlag: (s) => { dispatch(storeEdisScreenFlag(s)) },
        storeBOReportsScreenFlag: (s) => { dispatch(storeBOReportsScreenFlag(s)) },
        storeHelpAndSupportPopupFlag: (s) => { dispatch(storeHelpAndSupportPopupFlag(s)) },
        storeAvailLoanDialogDetails: (s) => { dispatch(storeAvailLoanDialogDetails(s)) },
        storeUserStage: (s) => { dispatch(storeUserStage(s)) },
        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
        storeLASUserStageResponse: (s) => { dispatch(storeLASUserStageResponse(s)) },
        storeLoanInit: (s) => { dispatch(storeLoanInit(s)) },
        storeLAN: (s) => { dispatch(storeLAN(s)) },
        storeEagreeResponse: (s) => { dispatch(storeEagreeResponse(s)) },
        storeUserLoanAmt: (s) => { dispatch(storeUserLoanAmt(s)) },
        storeIsUserAcceptedKYC: (s) => { dispatch(storeIsUserAcceptedKYC(s)) },
        refreshDemoTour: (s) => { dispatch(refreshDemoTour(s)) },
        setDemoTourFlag: (s) => { dispatch(setDemoTourFlag(s)) },
        storeSelectedScannerMenu: (s) => { dispatch(storeSelectedScannerMenu(s)) },
        storeDemoWatchList: (s) => { dispatch(storeDemoWatchList(s)) },
        storeDemoWatchListMtf: (s) => { dispatch(storeDemoWatchListMtf(s)) },
        showProfileDialog: (s) => { dispatch(showProfileDialog(s)) },
        storeRatingAndFeedback: (s) => { dispatch(storeRatingAndFeedback(s))}
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader(withRouter(MenuDialogBaseComponent)));