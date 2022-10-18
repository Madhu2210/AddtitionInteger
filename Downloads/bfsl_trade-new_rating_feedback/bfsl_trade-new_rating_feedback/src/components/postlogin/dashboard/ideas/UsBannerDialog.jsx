import React, { useState,useRef,useEffect } from 'react'
import { MsfRequest, useFetch } from '../../../../index';
import { getIdeasBaseURL } from '../../../../common/CommonMethods'
import LangText from '../../../../common/lang/LangText'
import { OTHER_PRODUCTS_SERVICE } from '../../../../config/ServiceURLs'
import { Checkbox_nor, Checkbox_sel } from '../../../common/FontIcons'
import { WidgetLoader } from '../../../common/WidgetLoaderComponent';
import { showAppDialog } from '../../../../state/actions/Actions';
import { connect } from 'react-redux';
import useCloseModal from '../../../../customHooksComponents/useCloseModal';
import { getItemFromSessionStorage } from '../../../../common/LocalStorage';
import { LOCAL_STORAGE } from '../../../../common/Constants';

function UsBannerDialog(props) {

    const modalRef = useRef(null)
    const closeModal = useCloseModal()
    closeModal.useOutsideAlerter(modalRef, onClose,false)
    const MsfFetch = useFetch()

    const [eAgreeCheck, setEAgreeCheck] = useState(false)
    const [vasDatas, setVasDatas] = useState({})

    useEffect(() => {

        let vasData = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.VESTED_DATA))
        if(vasData)
            setVasDatas(vasData)

    }, [])

    function updateUser() {
        let request = new MsfRequest();
        props.showWidgetLoader();
        MsfFetch.placeRequest(
            getIdeasBaseURL() + OTHER_PRODUCTS_SERVICE.UPDATE_USER,
            request,
            successRespUpdateUser,
            errorRespUpdateUser
        )
    }

    function successRespUpdateUser() {
        props.hideWidgetLoader();
        window.open(props.Link)
        props.showDialog && props.showDialog(false,true)
    }

    function errorRespUpdateUser(error) {
        props.hideWidgetLoader();
        props.showAppDialog({
            message: error.message,
            show: true
        })
    }

    function onClose() {
        props.showDialog && props.showDialog(false) 
    }

    return (
        <div className="app-modalDialog2 us-banner" >
            <div className="content" ref={modalRef}>
                <img src="assets/images/vestedbanner.png" alt="" />
                <div className="banner-check">
                    <span className={`bfsl-font-2 ${!eAgreeCheck ? "checkbox" :
                        "active-checkbox"}`}>
                        {!eAgreeCheck ?

                            <Checkbox_nor onClick={() => setEAgreeCheck(true)} />
                            :
                            <Checkbox_sel onClick={() => setEAgreeCheck(false)} />

                        }
                    </span>
                    <span className="data">

                        <LangText module="IDEAS" name="US_TRADE" />
                        <a href={vasDatas.Disclaimer} target="_blank" rel="noopener noreferrer" className="link">
                            <LangText module="IDEAS" name="DISCLAIMER" />
                        </a>,
                        <a href={vasDatas.Disclosure} target="_blank" rel="noopener noreferrer" className="link">
                            <LangText module="IDEAS" name="DISCLOSURE" />
                        </a><LangText module="IDEAS" name="AND" />
                        <a href={vasDatas.ClientAgreement} target="_blank" rel="noopener noreferrer"
                            className="link">
                            <LangText module="IDEAS" name="CLIENT_AGREE" />
                        </a>
                        <LangText module="IDEAS" name="US_TRADE_TWO" />
                        <a href={vasDatas.Termsofuse} target="_blank" rel="noopener noreferrer" className="link">
                            <LangText module="IDEAS" name="TERM_OF_USE" />
                        </a><LangText module="IDEAS" name="AND" />
                        <a href={vasDatas.PrivacyPolicy} target="_blank" rel="noopener noreferrer" className="link">
                            <LangText module="IDEAS" name="PRIVACY" />
                        </a><LangText module="IDEAS" name="US_TRADE_THREE" />
                        <a href={vasDatas.disclosure} target="_blank" rel="noopener noreferrer" className="link">
                            <LangText module="IDEAS" name="DISCLAIMER" />
                        </a><LangText module="IDEAS" name="AND" />
                        <a href={vasDatas.Brochure} target="_blank" rel="noopener noreferrer" className="link">
                            <LangText module="IDEAS" name="BROCHURE" />
                        </a>
                        
                    </span>
                </div>
                <button className="start-btn"
                    disabled={(!eAgreeCheck) ?
                        'disabled' : ""}
                    onClick={(!eAgreeCheck) ? "" :() => updateUser()}>
                    <LangText module="IDEAS" name="START_BTN" />
                </button>
                <div className="us-info-data">{'*'}
                    <span className="info-msg">
                        <LangText module="IDEAS" name="US_CONTENT" />
                    </span>
                </div>
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {

        showAppDialog: (s) => { dispatch(showAppDialog(s)) },
    };
};

export default connect(null,mapDispatchToProps) (WidgetLoader(UsBannerDialog))