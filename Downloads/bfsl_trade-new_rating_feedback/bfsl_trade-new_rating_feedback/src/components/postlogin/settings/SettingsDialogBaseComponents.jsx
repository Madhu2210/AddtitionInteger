import React, { useEffect, useRef, useState } from 'react'
import { connect } from "react-redux";
import { AF_EventTriggered } from '../../../common/CommonMethods';
import { AF_EVENT_NAMES,  DEFAULT_VALUES, HEADER_SETTINGS, THEMES, THEME_ARRAY } from '../../../common/Constants';
import LangText from '../../../common/lang/LangText';
import useCloseModal from '../../../customHooksComponents/useCloseModal';

import { storeAppTheme, storeSettingsDialogDetails } from '../../../state/actions/Actions'
import { DarkThemeIcon, Language_icon, LightThemeIcon } from '../../common/FontIcons';
import AddOns from '../../common/InputAddOnComponents';
//import SortWatchListDialogComponent from '../dashboard/watchlist/watchlistDialogs/SortWatchListDialogComponent';
import ChangePasswordComponent from './ChangePasswordComponent';
import LanguageSettingsComponent from './LanguageSettingsComponent';
// import SavedFiltersComponent from './SavedFiltersComponent';
import ThemeSettingsComponent from './ThemeSettingsComponent';

function SettingsBaseComponent(props) {

    const modalRef = useRef(null)
    const modalPasswordRef = useRef(null)
    const closeModal = useCloseModal()
    const closeModalPass = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose)
    closeModalPass.useOutsideAlerter(modalPasswordRef, closeCB, onClose)

    const [selectedTab, setSelectedTab] = useState(HEADER_SETTINGS.LANGUAGE_SETTINGS)
    const [selectedTheme, setSelectedTheme] = useState(THEMES.LIGHT)
    const [viewPasswordTool, setViewPasswordTool] = useState(false)
    const [passwordLength, setPasswordLength] = useState(false)
    const [passwordUpper, setPasswordUpper] = useState(false)
    const [passwordLower, setPasswordLower] = useState(false)
    const [passwordSpecial, setPasswordSpecial] = useState(false)

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
        setViewPasswordTool(false)
        setPasswordLength(false)
        setPasswordLower(false)
        setPasswordUpper(false)
        setPasswordSpecial(false)
    }

    function onFocusCB(value) {
        if (value === 'newPassword')
            setViewPasswordTool(true)
        else
            setViewPasswordTool(false)
    }
    function closeCB() {
        setViewPasswordTool(false)
    }

    function onChangePasswordCB(value) {
        let lowerRegex = /^(?=.*[a-z])/
        let upperRegex = /^(?=.*[A-Z])/
        let splChar = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/
        if (value.length > DEFAULT_VALUES.PASSSWORD_MIN_LEN)
            setPasswordLength(true)
        else
            setPasswordLength(false)

        if (lowerRegex.test(value))
            setPasswordLower(true)
        else
            setPasswordLower(false)

        if (upperRegex.test(value))
            setPasswordUpper(true)
        else
            setPasswordUpper(false)

        if (splChar.test(value))
            setPasswordSpecial(true)
        else
            setPasswordSpecial(false)
    }

    function onClickitem(item) {
        setSelectedTab(item)
    }

    function getImgPassword(value) {
        if (!value) {
            return (
                <img className="tick-img"
                    src={props.selectedTheme.theme === THEMES.LIGHT ?
                        "assets/images/password_policy_nor.svg"
                        : "assets/images/dark/password_policy_nor.svg"} alt=""
                />
            )
        }
        return (
            <img className="tick-img"
                src={props.selectedTheme.theme === THEMES.LIGHT ?
                    "assets/images/password_policy_sel.svg"
                    : "assets/images/dark/password_policy_sel.svg"}
                alt=""
            />
        )

    }

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
        AF_EventTriggered(AF_EVENT_NAMES.SETTINGS , selectedTheme ,{"onclick":"themeChanged"})
    }

    if (!successDialog.dialogName)
        return null

    if (successDialog.dialogName === HEADER_SETTINGS.SETTINGS_BASE) {
        return (
            <div className="settingsDialogbase" >
                <div className="settingsBase" ref={modalRef}>
                    <div className="settings-header">
                        <span className="title">
                            <LangText module="SETTINGS" name="SETTINGS" />
                        </span>
                        <span className="message">
                            <LangText module="SETTINGS" name="CHANGE_STG_MSG" />
                        </span>
                    </div>
                    <div className="settings-content">
                        <div className="content-left">
                            <div className={`item1 ${selectedTab === HEADER_SETTINGS.PASSWORD_SETTINGS
                                ? 'selected'
                                : ''}`}
                            onClick={() => { onClickitem(HEADER_SETTINGS.PASSWORD_SETTINGS) }}>
                                <div className={`icon ${selectedTab === HEADER_SETTINGS.PASSWORD_SETTINGS ?
                                    'selected'
                                    : ''}`}>
                                    <AddOns.PasswordInputAddOn />
                                </div>
                                <div className="cont-desc">
                                    <span className=
                                        {`heading ${selectedTab === HEADER_SETTINGS.PASSWORD_SETTINGS ?
                                            'selected'
                                            : ''}`}>
                                        <LangText module="SETTINGS" name="CHANGE_PWD" />
                                    </span>
                                    <span className="desc">
                                        <LangText module="SETTINGS" name="SET_PWD" />
                                    </span>
                                </div>

                            </div>
                            {
                                viewPasswordTool ?
                                    <div className="password-policy" ref={modalPasswordRef}>
                                        <span className="password-should">
                                            <LangText module="VALIDATION" name="PASSWORD_SHOULD" />
                                        </span>
                                        <div className="passdiv">
                                            {passwordLength ?
                                                getImgPassword(passwordLength)
                                                : getImgPassword(passwordLength)}
                                            <span className="password-msg">
                                                <LangText module="VALIDATION" name="PASSWORD_LEN" />
                                            </span>
                                        </div>
                                        <div className="passdiv">
                                            {passwordUpper ? getImgPassword(passwordUpper)
                                                : getImgPassword(passwordUpper)}
                                            <span className="password-msg">
                                                <LangText module="VALIDATION" name="PASSWORD_UPPER_CHAR" />
                                            </span>
                                        </div>
                                        <div className="passdiv">
                                            {passwordLower ?
                                                getImgPassword(passwordLower)
                                                : getImgPassword(passwordLower)}
                                            <span className="password-msg">
                                                <LangText module="VALIDATION" name="PASSWORD_LOWER_CHAR" />
                                            </span>
                                        </div>
                                        <div className="passdiv">
                                            {passwordSpecial
                                                ? getImgPassword(passwordSpecial)
                                                : getImgPassword(passwordSpecial)}
                                            <span className="password-msg">
                                                <LangText module="VALIDATION" name="PASSWORD_SP_CHAR" />
                                            </span>
                                        </div>
                                    </div>
                                    :
                                    null
                            }
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
                                        <LangText module="SETTINGS" name="DARK_THEME" />
                                    </span>
                                    <span className="desc">
                                        <LangText module="SETTINGS" name="THEME_MSG" />
                                    </span>
                                </div>
                                <>
                                    <label className="switch">
                                        <input type="checkbox"
                                            checked={selectedTheme === THEMES.DARK}
                                            onChange={onSwitchTheme}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                    <span className="toggleOrderTypeName"></span>
                                </>
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
                            <div className={`item1 ${selectedTab === HEADER_SETTINGS.LANGUAGE_SETTINGS
                                ? 'selected'
                                : ''}`}
                            onClick={ () => {onClickitem(HEADER_SETTINGS.LANGUAGE_SETTINGS)} }>
                                <div className={`icon ${selectedTab === HEADER_SETTINGS.LANGUAGE_SETTINGS ?
                                    'selected'
                                    : ''}`}>
                                    <Language_icon />
                                </div>
                                <div className="cont-desc">
                                    <span className=
                                        {`heading ${selectedTab === HEADER_SETTINGS.LANGUAGE_SETTINGS ?
                                            'selected'
                                            : ''}`}>
                                        <LangText module="SETTINGS" name="LANGUAGE" />
                                    </span>
                                    <span className="desc">
                                        <LangText module="SETTINGS" name="CHANGE_LANGUAGE" />
                                    </span>
                                </div>

                            </div>
                            {/* <div className={`item1 ${selectedTab === HEADER_SETTINGS.PREFERENCE_SETTINGS
                                ? 'selected'
                                : ''}`}
                            onClick={ () => {onClickitem(HEADER_SETTINGS.PREFERENCE_SETTINGS)} }>
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
                                            : ''}`}>
                                        <LangText module="SETTINGS" name="SETTINGS_SAVED_FILTERS" />
                                    </span>
                                </div>

                            </div> */}

                        </div>
                        
                        <div className="content-right settings-base">
                            {
                                selectedTab === HEADER_SETTINGS.PASSWORD_SETTINGS ?
                                    <ChangePasswordComponent
                                        onCloseCB={onClose}
                                        onFocusCB={onFocusCB}
                                        onChangePasswordCB={onChangePasswordCB}
                                    />
                                    :
                                    selectedTab === HEADER_SETTINGS.THEME_SETTINGS ?
                                        <ThemeSettingsComponent onCloseCB={onClose} />
                                        :
                                        selectedTab === HEADER_SETTINGS. LANGUAGE_SETTINGS ?
                                            <LanguageSettingsComponent onCloseCB={onClose}/>
                                            :
                                            // selectedTab === HEADER_SETTINGS. PREFERENCE_SETTINGS ?
                                            //     <SavedFiltersComponent/>
                                            //     :
                                           
                                            <div className="flex-center" style={{ height: "100%" }}>
                                                <LangText module="SETTINGS" name="COMING_SOON" />
                                            </div>
                            }
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ successDialog, settings }) => {
    return {
        successDialog: successDialog.dialog,
        selectedTheme: settings.selectedTheme,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeSettingsDialogDetails: (s) => { dispatch(storeSettingsDialogDetails(s)) },
        storeAppTheme: (s) => { dispatch(storeAppTheme(s)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsBaseComponent);