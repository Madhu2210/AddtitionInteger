// import React, { useState, useRef } from 'react'
// import { connect } from 'react-redux';
// import { convertToUpperCase } from '../../../../common/CommonMethods';

// import { LanguageOptions } from '../../../../common/lang';
// import { getLangText } from '../../../../common/lang/LangText';
// import useCloseModal from '../../../../customHooksComponents/useCloseModal';
// import { storeAppLang } from '../../../../state/actions/Actions';

// const LanguageOptionsListGuestComponent = (props) => {
//     console.log('props language: ', props);

//     const langOptionsGuestRef = useRef(null)
//     const closeModal = useCloseModal()
//     closeModal.useOutsideAlerter(langOptionsGuestRef,onClose, false)

//     const [langOptions]=useState(LanguageOptions)
//     const [selectLang,setSelectLang]= useState(props.selectedLang)

//     function onClose() {
//         props.onCloseCB && props.onCloseCB()
//     }

//     function onSelectLanguage(item){
//         console.log('item: ', item);
//         setSelectLang(item)
//         props.storeAppLang(item)
//         // props.parentCB && props.parentCB()
//     }
    
//     return (
//         <div className= "app-modalDialog language-options-dialog-guest">
//             <div className= "window" ref= {langOptionsGuestRef} >
//                 <div className="header">
//                     <span className= "text">{convertToUpperCase(getLangText("LANGUAGE"))}</span>
//                 </div>
//                 {
//                     langOptions.map((item,index) => {
//                         console.log('item2: ', item);
//                         return(
//                             <div className="list-language" key={index} 
//                                 onClick={() => onSelectLanguage(item)}
//                             >
//                                 <span className={`text-field ${item.id === selectLang.id ? "selected" : ""}`}
//                                 >
//                                     {convertToUpperCase(item.text)} 
//                                     {item.id  == 'english' ? "" :
//                                         <span className="label-text">({item.label})</span>
//                                     }
//                                 </span>
//                                 <input type="radio" 
//                                     value={item.text} 
//                                     // name={item.text}
//                                     checked= {item.id === selectLang.id}                                     
//                                 />                         
//                                 <span className="checkmark"></span>                         
//                             </div> 
//                         ) 
//                     })
//                 }
//             </div>
//         </div>
//     )
// }

// const mapStateToProps = ({ settings }) => {
//     return {
//         selectedLang: settings.selectedLang
//     }
// }

// const mapDispatchToProps = (dispatch) => {
//     return {
//         storeAppLang: (s) => { dispatch(storeAppLang(s)) },
//     };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(LanguageOptionsListGuestComponent);