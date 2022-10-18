import React, { useState, useEffect } from 'react'
import { getLangText } from '../../common/lang/LangText'

const ToggleComponent = (props) => {

    const [selectedMenu, setSelectedMenu] = useState('')

    useEffect(() => {
        if (props.selectedMenu)
            setSelectedMenu(props.selectedMenu)
    }, [props.selectedMenu])

    function onSelectMenu(item) {
        if (props.selectedMenu !== item)
            props.onSelectMenuCB(item)
    }

    if (props.menus && props.menus.length)
        return (
            <div className={`doggleBase-div ${props.orderAction ? 'orderAction' : ''}
             ${props.hasToggle ? '' : 'disableToggle'}`}>
                {
                    props.menus.map((item, index) => {
                        return (
                            <span key={index}
                                className={`flex-center ${props.orderAction ? item : ''}
                            ${props.hasToggle ? 'cursor' : ''} 
                            ${item.toLowerCase() === selectedMenu.toLowerCase() ? 'active' : 'inactive'}`}
                                onClick={props.hasToggle ? () => onSelectMenu(item) : ''}
                                
                            >
                                { props.hasLangageDependent ?
                                    getLangText(item) : item }
                                
                            </span>
                        )
                    })
                }
            </div>
        )
    return null
}

export default ToggleComponent;