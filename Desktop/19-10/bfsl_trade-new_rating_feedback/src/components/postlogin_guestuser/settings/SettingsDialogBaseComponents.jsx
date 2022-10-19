import React, { useEffect, useRef, useState } from 'react'
import { connect } from "react-redux";
import { HEADER_SETTINGS,  LOGIN_DIALOGS,  
    THEMES, THEME_ARRAY } from '../../../common/Constants';
import LangText from '../../../common/lang/LangText';
import useCloseModal from '../../../customHooksComponents/useCloseModal';

import { storeAppTheme, storeLoginDialogDetails, 
    storeSavedPreferenceDetails, storeSettingsDialogDetails } from '../../../state/actions/Actions'
import { DarkThemeIcon, Language_icon, LightThemeIcon } from '../../common/FontIcons';
//import SavedFiltersComponent from '../../postlogin/settings/SavedFiltersComponent';
//import LanguageOptionsList from './LanguageOptionsListComponent';

function SettingsBaseComponent(props) {

    const modalRef = useRef(null)
    const modalPasswordRef = useRef(null)
    const closeModal = useCloseModal()
    const closeModalPass = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose)
    closeModalPass.useOutsideAlerter(modalPasswordRef, onClose)

    //const [selectedTab] = useState(HEADER_SETTINGS.LANGUAGE_SETTINGS)
    const [selectedTheme, setSelectedTheme] = useState(THEMES.LIGHT)
    const [selectedTab, setSelectedTab] = useState(HEADER_SETTINGS.LANGUAGE_SETTINGS)

    const { successDialog } = props

    useEffect(() => {
        if (props.selectedTheme)
            setSelectedTheme(props.selectedTheme.theme)
    }, [])

    function onClose() {
        props.storeSettingsDialogDetails({
            dialogName: null,
            data: null,
            message: '',
            parentCB: null
        })
    }
    function onClickItem(item){
        setSelectedTab(item)
    }
    function onClickLanguageChange(){
        props.storeLoginDialogDetails({
            dialogName: LOGIN_DIALOGS.LANGUAGE_OPTIONS,
            parentCB: null,
        })
    }
    
    // function onClickSavedFilters(){       
    //     props.storeSavedPreferenceDetails(
    //         SAVED_PREFERENCE_DETAILS
    //     )
    // }

    function onSwitchTheme(e) {
        let selectedThemeIndex = null
        if (e.target.checked) {
            setSelectedTheme(THEMES.DARK)
            selectedThemeIndex = THEME_ARRAY.findIndex(item => item.theme === THEMES.DARK)
        }
        else {
            setSelectedTheme(THEMES.LIGHT)
            selectedThemeIndex = THEME_ARRAY.findIndex(item => item.theme === THEMES.LIGHT)
        }
        props.storeAppTheme(THEME_ARRAY[selectedThemeIndex])
    }

    if (!successDialog.dialogName)
        return null

    if (successDialog.dialogName === HEADER_SETTINGS.SETTINGS_BASE) {
        return (
            <div className="settingsDialogbase-guest">
                <div className="settingsBase guest-user" 
                    ref={props.dialog.dialogName === LOGIN_DIALOGS.LANGUAGE_OPTIONS ? null :modalRef}>
                    <div className="settings-header">
                        <span className="title">
                            <LangText name="SETTINGS" />
                        </span>
                        {/* <span className="message">
                            <LangText module="SETTINGS" name="CHANGE_STG_MSG" />
                        </span> */}
                    </div>
                    <div className="settings-content">
                        <div className="content-left">
                            {/* <div className={`item2 cursor ${selectedTab === HEADER_SETTINGS.NOTIFICATION_SETTINGS ? 'selected' : ''}`}
                                onClick={() => { onClickitem(HEADER_SETTINGS.NOTIFICATION_SETTINGS) }}>
                                <div className="icon">
                                    <AlertIcon />
                                </div>
                                <div className="cont-desc">
                                    <span className={`heading ${selectedTab === HEADER_SETTINGS.NOTIFICATION_SETTINGS ? 'selected' : ''}`}>
                                        <LangText module="SETTINGS" name="NTFTNG_STNG" />
                                    </span>
                                    <span className="desc">
                                        <LangText module="SETTINGS" name="NTFTNG_MSG" />
                                    </span>
                                </div>
                            </div> */}
                            <div className={`item3 ${selectedTab === HEADER_SETTINGS.THEME_SETTINGS ?
                                'selected'
                                : ''}`}
                            >
                                <div className={`icon ${selectedTab === HEADER_SETTINGS.THEME_SETTINGS
                                    ? 'selected'
                                    : ''}`}>
                                    {
                                        selectedTheme === THEMES.DARK ?
                                            <DarkThemeIcon />
                                            :
                                            <LightThemeIcon />
                                    }
                                </div>
                                <div className="cont-desc">
                                    <span className=
                                        {`heading ${selectedTab === HEADER_SETTINGS.THEME_SETTINGS ?
                                            'selected'
                                            : ''}`}>
                                        <LangText name="DARK_THEME" />
                                    </span>
                                    <span className="desc">
                                        <LangText name="THEME_MSG" />
                                    </span>
                                </div>
                                <div className="switch-btn">
                                    <label className="switch">
                                        <input type="checkbox"
                                            checked={selectedTheme === THEMES.DARK}
                                            onChange={onSwitchTheme}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                    <span className="toggleOrderTypeName"></span>
                                </div>
                            </div>
                            {/* <div className={`item4 cursor ${selectedTab === HEADER_SETTINGS.STREAMING_ON_OFF ? 'selected' : ''}`}
                                onClick={() => { onClickitem(HEADER_SETTINGS.STREAMING_ON_OFF) }}>
                                <div className="icon">
                                    <DownArrowIcon />
                                </div>
                                <div className="cont-desc">
                                    <span className={`heading ${selectedTab === HEADER_SETTINGS.STREAMING_ON_OFF ? 'selected' : ''}`}>
                                        <LangText module="SETTINGS" name="STREAMING_ON_OFF" />
                                    </span>
                                    <span className="desc">
                                        <LangText module="SETTINGS" name="STREAMING_MSG" />
                                    </span>
                                </div>
                                <div className="toggle">
                                    <div className="toggle-status">
                                        <ToggleMenu
                                            menus={menuArray}
                                            selectedMenu={selectedType}
                                            orderAction={true}
                                            hasToggle={true}
                                            onSelectMenuCB={(item) => getSelectedType(item)}
                                        />
                                    </div>
                                </div>
                            </div> */}

                        </div>
                        {/* <div className="content-right settings-base">
                            {
                            
                                selectedTab === HEADER_SETTINGS.THEME_SETTINGS ?
                                    <ThemeSettingsComponent onCloseCB={onClose} />
                                    :
                                    <div className="flex-center" style={{ height: "100%" }}>
                                            Coming soon ...
                                    </div>
                            }
                        </div> */}

                    </div>
                  
                    {/* <div className={`item1 ${selectedTab === HEADER_SETTINGS.LANGUAGE_SETTINGS
                            ? 'selected'
                            : ''}`}
                        onClick={ () => {onClickitem(HEADER_SETTINGS.LANGUAGE_SETTINGS)} }>
                            <div className={`icon ${selectedTab === HEADER_SETTINGS.LANGUAGE_SETTINGS ?
                                'selected'
                                : ''}`}> */}
                 
                    <div className="settings-content">
                        <div className="content-left">
                            <div className={`item3 ${selectedTab === HEADER_SETTINGS.LANGUAGE_SETTINGS ?
                                'selected'
                                : ''}`} 
                            onClick={ () => {onClickItem(HEADER_SETTINGS.LANGUAGE_SETTINGS)} }>
                                <div className={`icon ${selectedTab === HEADER_SETTINGS.LANGUAGE_SETTINGS
                                    ? 'selected'
                                    : ''}`}
                                >
                                    <Language_icon/>
                                </div>
                                <div className="cont-desc">
                                    <span className=
                                        {`heading ${selectedTab === HEADER_SETTINGS.LANGUAGE_SETTINGS ?
                                            'selected'
                                            : ''}`}
                                    onClick={onClickLanguageChange}>
                                        <LangText name="LANGUAGE" />
                                    </span>
                                    <span className="desc">
                                        <LangText  name="CHANGE_LANGUAGE" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="settings-content">
                        <div className="content-left">
                            <div className={`item3 ${selectedTab === HEADER_SETTINGS.PREFERENCE_SETTINGS
                                ? 'selected'
                                : ''}`}
                            onClick={ () => {onClickItem(HEADER_SETTINGS.PREFERENCE_SETTINGS)} }>
                                <div className={`icon ${selectedTab === HEADER_SETTINGS.PREFERENCE_SETTINGS ?
                                    'selected'
                                    : ''}`}>
                                    <span className={`sort-icon ${selectedTab === HEADER_SETTINGS.PREFERENCE_SETTINGS ?
                                        'selected'
                                        : ''}`}><SortingShowIcon /></span> 
                                </div>
                                <div className="cont-desc">
                                    <span className=
                                        {`heading ${selectedTab === HEADER_SETTINGS.PREFERENCE_SETTINGS ?
                                            'selected'
                                            : ''}`}
                                    onClick={onClickSavedFilters}>
                                        <LangText name="SETTINGS_SAVED_FILTERS" />
                                    </span>
                                  
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ successDialog, settings, login }) => {
    return {
        successDialog: successDialog.dialog,
        selectedTheme: settings.selectedTheme,
        selectedLang: settings.selectedLang,
        dialog: login.dialog,
        savePreference:settings.savePreference
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeSettingsDialogDetails: (s) => { dispatch(storeSettingsDialogDetails(s)) },
        storeLoginDialogDetails: (s) => { dispatch(storeLoginDialogDetails(s)) },
        storeAppTheme: (s) => { dispatch(storeAppTheme(s)) },
        storeSavedPreferenceDetails: (s) => {dispatch(storeSavedPreferenceDetails(s))}
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsBaseComponent);