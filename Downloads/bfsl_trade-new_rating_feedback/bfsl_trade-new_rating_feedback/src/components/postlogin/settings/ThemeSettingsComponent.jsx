import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';

import ToggleMenu from '../../common/ToggleComponent';

import { storeAppTheme } from '../../../state/actions/Actions'

import { THEMES, THEME_ARRAY } from '../../../common/Constants';

function ThemeSettingsComponent(props) {

    const [appThemes, setAppThemes] = useState([])
    const [selectedTheme, setSelectedTheme] = useState('')

    useEffect(() => {
        let themes = []
        THEME_ARRAY.map((item) => {
            themes.push(item.theme)
            return null
        })
        setAppThemes(themes)
    }, [])

    useEffect(() => {
        if (props.selectedTheme)
            setSelectedTheme(props.selectedTheme.theme)
        else
            setSelectedTheme(THEME_ARRAY[0].theme)
    }, [props.selectedTheme])

    function getSelectedType(theme) {
        setSelectedTheme(theme)
        let selectedThemeIndex = THEME_ARRAY.findIndex(item => item.theme === theme)
        if (theme === THEMES.DARK)
            props.storeAppTheme(THEME_ARRAY[selectedThemeIndex])
        else
            props.storeAppTheme(THEME_ARRAY[selectedThemeIndex])
    }

    return (
        <div className="themesetting-base">
            <div className="toggle-status">
                {
                    appThemes && appThemes.length ?
                        <ToggleMenu
                            menus={appThemes}
                            selectedMenu={selectedTheme}
                            orderAction={true}
                            hasToggle={true}
                            onSelectMenuCB={(item) => getSelectedType(item)}
                        />
                        : null
                }
            </div>
        </div>
    )
}

const mapStateToProps = ({ settings }) => {
    return {
        selectedTheme: settings.selectedTheme
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAppTheme: (s) => { dispatch(storeAppTheme(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ThemeSettingsComponent);