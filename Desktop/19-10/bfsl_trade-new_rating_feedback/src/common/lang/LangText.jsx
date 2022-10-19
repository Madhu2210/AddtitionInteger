import { connect } from "react-redux";
import Store from '../../state/Store'
import { LanguageOptions } from './index'
import {  TEXT_ORIENTATION } from '../Constants';
import { convertToUpperCase, convertToLowerCase, convertToPascalCase } from '../CommonMethods';
//import { getItemFromSessionStorage } from "../LocalStorage";

export function getLangText(msgname, orientation) {
    const { settings, localStorageRed } = Store.getState()
    const { selectedLang } = settings
    // console.log("selectedLan", selectedLang)
    let dictionaryList = {}
    let langData =  localStorageRed.langDictionary
    if (langData)
        dictionaryList = langData
    let dictionary = null

    if (selectedLang) {

        dictionary = dictionaryList[selectedLang.id]
    }
    if (!dictionary) {
        dictionary = dictionaryList[LanguageOptions[0].id]
        // dictionary = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.LANGUAGE_SETTING_OPTIONS).hindii)
    }

    let result = null
    // console.log("test123", msgname, dictionary[msgname])
    // if (msgmodule)
    //     result = dictionary[msgmodule] ? (dictionary[msgmodule][msgname] ? dictionary[msgmodule][msgname] : null) : null
    // else
    result = dictionary? (dictionary[msgname] ? dictionary[msgname] : null): null
    if (result && orientation) {
        if(selectedLang.id === 'english')
        {
            if (orientation === TEXT_ORIENTATION.UPPERCASE)
                result = convertToUpperCase(result)
            else if (orientation === TEXT_ORIENTATION.LOWERCASE)
                result = convertToLowerCase(result)
            else if(orientation === TEXT_ORIENTATION.PASCALCASE) {
                result = convertToPascalCase(result)
            }
        }
    }
    return result
}

const LangText = (props) => {

    const { selectedLang, orientation } = props
    let dictionaryList = {}
    let langData =  props.langDictionary
    if (langData)
        dictionaryList = langData
    let dictionary = null
    if (selectedLang)
        dictionary = dictionaryList[selectedLang.id]
    if (!dictionary)
        dictionary = dictionaryList[LanguageOptions[0].id]

    let result = null
    // if (props.module) {
    //     console.log("first loop")
    //     result = dictionary[props.module] ?
    //         (dictionary[props.module][props.name] ? dictionary[props.module][props.name] : null) : null
    // }
    // else {
    result = dictionary ? (dictionary[props.name] ? dictionary[props.name] : null) : null
    // }
    if (result && orientation) {
        if(selectedLang.id === 'english')
        {
            if (orientation === TEXT_ORIENTATION.UPPERCASE)
                result = convertToUpperCase(result)
            else if (orientation === TEXT_ORIENTATION.LOWERCASE)
                result = convertToLowerCase(result)
            else if(orientation === TEXT_ORIENTATION.PASCALCASE) {
                result = convertToPascalCase(result)
            }
        }
    }
    
    return result
}

const mapStateToProps = ({ settings, localStorageRed }) => {
    return {
        selectedLang: settings.selectedLang,
        langDictionary: localStorageRed.langDictionary
    }
}

export default connect(mapStateToProps, null)(LangText);