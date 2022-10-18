// import React, { useState, useEffect } from 'react'
// import { connect } from "react-redux";

// import SelectInputComponent from '../../common/SelectInputComponent';

// import { storeAppTheme, storeAppLang } from '../../../state/actions/Actions';

// import { THEME_ARRAY } from '../../../common/Constants'
// import { CloseIcon } from '../../common/FontIcons'
// import { LanguageOptions } from '../../../common/lang/index'

// const SettingsComponent = (props) => {

//     const [selectedTheme, setSelectedTheme] = useState(props.selectedTheme ? props.selectedTheme : {})
//     const [selectedLang, setSelectedLang] = useState(props.selectedLang ? props.selectedLang : {})

//     useEffect(() => {
//         let hasTheme = false
//         if (props.selectedTheme && props.selectedTheme.theme)
//             THEME_ARRAY.map((item) => {
//                 if (item.theme === props.selectedTheme.theme)
//                     hasTheme = true
//             })
//         if (!hasTheme)
//             setSelectedTheme(THEME_ARRAY[0])
//     }, [props.selectedTheme])

//     useEffect(() => {
//         let hasLang = false
//         if (props.selectedLang && props.selectedLang.id)
//             LanguageOptions.map((item) => {
//                 if (item.id === props.selectedLang.id)
//                     hasLang = true
//             })
//         if (!hasLang)
//             setSelectedLang(LanguageOptions[0])
//     }, [props.selectedLang])

//     function onSelectTheme(themeObj) {
//         setSelectedTheme(themeObj)
//     }

//     function onSaveTheme() {
//         props.storeAppTheme(selectedTheme)
//         props.onCloseCB()
//     }

//     function onSaveLang() {
//         props.storeAppLang(selectedLang)
//         props.onCloseCB()
//     }

//     return (
//         <div className="settings-base-div">
//             <div className="closeIcon-div flex-center">
//                 <CloseIcon onClick={props.onCloseCB} />
//             </div>
//             <div className="row">
//                 <div className="label">Theme : </div>
//                 <SelectInputComponent
//                     optionList={THEME_ARRAY}
//                     selectedOption={selectedTheme.theme}
//                     value="theme"
//                     preSelect={true}
//                     onSelectValueCB={onSelectTheme}
//                 />
//                 <div className="btnDiv">
//                     <button className="theme-btn"
//                         onClick={onSaveTheme}
//                     >
//                         SAVE
//                     </button>
//                 </div>
//             </div>
//             <div className="row">
//                 <div className="label">Language : </div>
//                 <SelectInputComponent
//                     optionList={LanguageOptions}
//                     selectedOption={selectedLang.text}
//                     value="text"
//                     preSelect={true}
//                     onSelectValueCB={(langObj) => setSelectedLang(langObj)}
//                 />
//                 <div className="btnDiv">
//                     <button className="theme-btn"
//                         onClick={onSaveLang}
//                     >
//                         SAVE
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// const mapStateToProps = ({ settings }) => {
//     return {
//         selectedTheme: settings.selectedTheme,
//         selectedLang: settings.selectedLang
//     }
// }

// const mapDispatchToProps = (dispatch) => {
//     return {
//         storeAppTheme: (s) => { dispatch(storeAppTheme(s)) },
//         storeAppLang: (s) => { dispatch(storeAppLang(s)) }
//     };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(SettingsComponent);