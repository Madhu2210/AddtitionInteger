import React , { useEffect, useState }from "react";
import { LOCAL_STORAGE } from "../../../../common/Constants";

import LangText from '../../../../common/lang/LangText'
import { getItemFromSessionStorage } from "../../../../common/LocalStorage";
// import useCloseModal from '../../../../customHooksComponents/useCloseModal';

const UserInfoDialogComponent = (props) => {

    // const modalRef = useRef(null)
    // const closeModal = useCloseModal()
    // closeModal.useOutsideAlerter(modalRef, closeDialog)

    const [welcomeMsg, setWelcomeMsg] = useState({})
    const [openAccLink, setOpenAccLink] = useState("")

    useEffect(()=> {
        let msgGuest = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.WELCOME_GUEST))
        let openAccountLink = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.OPEN_GUESTACC_LINK))
        setWelcomeMsg(msgGuest)
        setOpenAccLink(openAccountLink)

        let listHead = document.getElementById("myListHead");
        msgGuest.header.forEach((item) => {
            let li = document.createElement("li");
            li.innerText = item;
            listHead.appendChild(li);
        });

        let list = document.getElementById("myList");
        msgGuest.content.forEach((item) => {
            let li = document.createElement("li");
            li.innerText = item;
            list.appendChild(li);
        });
    
        let listfoot = document.getElementById("myListFoot");
        msgGuest.footer.forEach((item) => {
            let li = document.createElement("li");
            li.innerText = item;
            listfoot.appendChild(li);
        });

    },[])

    function closeDialog() {
        props.parentCB && props.parentCB()
    }

    return (
        (welcomeMsg) ?
            <div className="app-modalDialog user-info-dialog">
                <div className="window">
                    <div className="title-user">
                        <span className="title-name">
                            <LangText name="HELLO_GUEST" />
                        </span>
                        <span className="title-name">
                            <LangText  name="WELCOME_GUEST" />
                        </span>
                    </div>
                    <div className="user-info-header">  
                        <ul className="user-list-head" id="myListHead"></ul>
                    </div>

                    <div className="user-info-content">
                        <ul className="user-list" id="myList"></ul>

                    </div>
                    <div className="user-info-footer">
                        <ul className="user-list-foot" id="myListFoot"></ul>
                    </div>
                    <div className="user-info-btnDiv">
                        <div className="welcome-btn">
                            <a href={openAccLink} target="_blank" rel="noopener noreferrer">
                                <button className="open-account-btn text-nowrap" onClick={closeDialog}>
                                    <span className="cursor">
                                        <LangText  name="OPEN_DEMAT_ACCOUNT" />
                                    </span>
                                </button>
                            </a>
                        </div>
                        <div className="welcome-btn">
                            <button className="continue-btn" onClick={closeDialog}>
                                <span className="cursor">
                                    <LangText  name="CONTINUE"/>
                                </span>
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
            :
            null
    );
};

export default UserInfoDialogComponent