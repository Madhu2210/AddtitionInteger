import React,{ useState,useRef} from 'react'
import { connect } from 'react-redux'
import { LanguageOptions } from '../../../common/lang/index'
import LangText from '../../../common/lang/LangText'
import { storeAppLang, storeSettingsDialogDetails } from '../../../state/actions/Actions'

function LanguageSettingsComponent(props) {

    const [langOptions]=useState(LanguageOptions)
    const [selectLang,setSelectLang]=useState(props.selectedLang)
    const submitBtnRef = useRef(null)
    
    function onSelectLanguage(item){
        setSelectLang(item)
    }

    function onSave(e){
        e.preventDefault()
        // console.log("123finalselect", selectLang)
        props.storeAppLang(selectLang)
        // submitBtnRef.current.focus()
        props.storeSettingsDialogDetails({
            dialogName: null,
        })
       
    }

    function onClose(){
        props.storeSettingsDialogDetails({
            dialogName: null,
        })
    }
    return (
        <div className="language-setting-base">
            <div className="language-setting-header">
                {
                    langOptions.map((item,index) => {
                        return(
                            <div className="list-language" key={index} 
                                onClick={() => onSelectLanguage(item)}>
                                <span 
                                    className={`${selectLang.text === item.text ? "languageValue" : "" }`}>
                                    {item.text} 
                                    { item.id  == 'english' ? "" :
                                        <span className="label-text">({item.label})</span>
                                    }
                                </span>
                            
                                <input type="radio" 
                                    value={item.text} 
                                    // name={item.text}
                                    checked={
                                        item.id === selectLang.id }
                                />
                           
                                <span className="checkmark"></span>
                           
                            </div> 
                        ) 
                    } )
              
                }
              
            </div>
            <div className="language-setting-footer">
                <button className="negativeBtn"
                    onClick={onClose}>
                    <LangText module="BUTTONS" name="CANCEL" />
                </button>
                <button className="left-btn positiveBtn"
                    onClick={(e) => onSave(e)} 
                    ref={submitBtnRef}
                >
                    <LangText module="BUTTONS" name="SAVE" />
                </button> 
            </div>
        </div>
    )
}

const mapStateToProps = ({ settings }) => {
    return {
        selectedLang: settings.selectedLang
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAppLang: (s) => { dispatch(storeAppLang(s)) },
        storeSettingsDialogDetails: (s) => { dispatch(storeSettingsDialogDetails(s)) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSettingsComponent);