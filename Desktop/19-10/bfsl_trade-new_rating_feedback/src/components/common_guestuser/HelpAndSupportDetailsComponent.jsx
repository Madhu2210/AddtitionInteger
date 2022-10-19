import React, {useState, useEffect} from 'react'
import { LOCAL_STORAGE } from '../../common/Constants'
import LangText from '../../common/lang/LangText'
import { getItemFromSessionStorage } from '../../common/LocalStorage'
import { EmailIcon, HeadPhonesIcon, PhoneIcon } from '../common/FontIcons'
  
const HelpAndSupportDetailsComponent = () =>{

    const [website, setWebsite] = useState('')
    const [email, setEmail] = useState('')
    const [tollFreeNo, setTollFreeNo] = useState('')

    useEffect(()=>{
        let helpSupport = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.HELP_AND_SUPPORT))
        setWebsite(helpSupport.samadhan)
        setEmail(helpSupport.email)
        setTollFreeNo(helpSupport.number)
    },[])

    return(
        <div className="help-data-value-container">
            <div className="data">
                <span className="icon"><HeadPhonesIcon/></span>
                <div className="data-text" >
                    <div className="field-name"> <LangText name="QA" /></div>
                    <a href={website}  target="_blank" 
                        className="website-link" rel="noopener noreferrer"> 
                        <LangText name="SAMADHAN" /></a>
                </div>
            </div>
            <div className="data">
                <span className="icon"><EmailIcon/></span>
                <div className="data-text">
                    <div className="field-name"><LangText module="HELPNSUPPORT" name="EMAIL" /></div>
                    <a href="mailto:connect@bajajfinserv.in"  target="_blank" 
                        className="field-value" rel="noopener noreferrer">{email}</a>
                    {/* <div className="field-value">{email}</div> */}
                </div>
            </div>
            <div className="data-lastchild">
                <span className="icon"><PhoneIcon/></span>
                <div className="data-text">
                    <div className="field-name"><LangText module="HELPNSUPPORT" name="CALL" /></div>
                    <div className="field-value-number">{tollFreeNo}</div>
                </div>
            </div>
            
        </div> 

    )
}
export default HelpAndSupportDetailsComponent;