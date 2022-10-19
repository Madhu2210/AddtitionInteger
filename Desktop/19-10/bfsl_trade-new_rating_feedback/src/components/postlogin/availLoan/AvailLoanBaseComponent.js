// import { dispatch, index } from 'd3'
import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import LangText from '../../../common/lang/LangText'

import { AVAIL_LOAN_MENUS, AVAIL_LOAN_MENU_ARRAY, LOCAL_STORAGE } from '../../../common/Constants'
import DisbursementComponent from './DisbursementComponent';
import ReleaseShareRequestComponent from './ReleaseShareRequestComponent';
import RepaymentComponent from './RepaymentComponent';

import StatementComponent from './StatementComponent';

import { storeAvailLoanNavigation } from '../../../state/actions/Actions'
//import FaqComponent from './FaqComponent';

// import { CloseIcon } from '../../common/FontIcons';
import AdditionalPledgeComponent from './AdditionalPledgeComponent';
// import HelpAndFaqBaseComponent from './HelpAndFaqBaseComponent';
import { getItemFromSessionStorage } from '../../../common/LocalStorage';
// import FaqComponent from './FaqComponent';

function AvailLoanBaseComponent(props) {

    const [selectedMenu, setSelectedMenu] = useState(AVAIL_LOAN_MENU_ARRAY[0].name)
    const [buttonCick, setButtonClick] = useState(false);
    const [faqData,setFaqData]=useState([])

    useEffect(() => {
        if (props.gotoDisbursement) {
            setSelectedMenu(AVAIL_LOAN_MENUS.DISBURSEMENT)
            props.storeAvailLoanNavigation(false)
        }
    }, [props.gotoDisbursement])

    useEffect(() => {
        let contenturl = JSON.parse(getItemFromSessionStorage(LOCAL_STORAGE.LAS_HELP))
        if(contenturl){
            setFaqData(contenturl)
        }
    }, []) 

    // function closeFaq(){
    //     setButtonClick(false);
    //     // props.history.push(<DisbursementComponent/>);
    //     getSelectedTable(AVAIL_LOAN_MENUS.DISBURSEMENT);

    // }

    function onClickFaq(e) {
        setButtonClick(false) 
        e.preventDefault();
        window.open(`${faqData.faq}`,"_blank");
    }

    return (
        <div className="availLoan-base">
            <div className="availLoan-data-base">
               
                {
                    !buttonCick ?
                        <div className="heading-name">
                            <>
                                <LangText name="LOAN_AGAINST_SECURITY" module="AVAIL_LOAN" />

                                <span className="faq"
                                    onClick={(e) => onClickFaq(e)
                                    }>
                                    <LangText name="FAQ_HEAD" module="AVAIL_LOAN" />
                                    
                                </span>
                               
                            </>
                        </div>
                        : 
                        <div>
                            <div className="availLoan-header">
                                {AVAIL_LOAN_MENU_ARRAY.map((item, index) => {
                                    return (
                                        <div key={index} 
                                            className={`menu ${selectedMenu === item.name ? 'active' : ''}`}
                                            onClick={() => setSelectedMenu(item.name)}
                                        >
                                            <LangText name={item.langKey} module="AVAIL_LOAN" />
                                        </div>

                                    )
                                })
                                }
                           
                            </div>
                            <div className="availLoan-table-base">
                      
                                { 
                                    getSelectedTable(selectedMenu) }

                            </div>
                        </div>
                        // <div className="faq-head-content">
                        //     <div className="faq-data">
                        //         <LangText name="FAQ_HEAD" module="AVAIL_LOAN" /> 
                        //     </div>
                        //     <div className="close-notify" onClick={closeFaq}>
                        //         <CloseIcon />
                        //     </div>
                        // </div>

                }

                {/* <div className="availLoan-data"> */}
                {!buttonCick ?
                    <div className="availLoan-header">
                        {
                            AVAIL_LOAN_MENU_ARRAY.map((item, index) => {
                                return (
                                    <div key={index} className={`menu ${selectedMenu === item.name ? 'active' : ''}`}
                                        onClick={() => setSelectedMenu(item.name)}
                                    >
                                        <LangText name={item.langKey} module="AVAIL_LOAN" />
                                    </div>

                                )
                            })
                        }

                    </div>
                    : ''}
                {/* {buttonCick ? <FaqComponent /> :
                    <div className="availLoan-table-base">
                       
                        { 
                            getSelectedTable(selectedMenu) }

                    </div>
                } */}

                {buttonCick ? '' :
                    <div className="availLoan-table-base">
                      
                        { 
                            getSelectedTable(selectedMenu) }

                    </div>
                }

            </div>

            {/* { buttonCick&&<FaqComponent/>} */}

        </div>
        // </div>

    )
}

function getSelectedTable(menu) {
    switch (menu) {
        case AVAIL_LOAN_MENUS.DISBURSEMENT:
            return <DisbursementComponent />
        case AVAIL_LOAN_MENUS.REPAYMENT:
            return <RepaymentComponent />
        case AVAIL_LOAN_MENUS.RELEASE_SHARE_REQUEST:
            return <ReleaseShareRequestComponent />
        case AVAIL_LOAN_MENUS.ADDITIONAL_SHARE_PLEDGE:
            return <AdditionalPledgeComponent />
        case AVAIL_LOAN_MENUS.STATEMENT:
            return <StatementComponent />
        
        default:
            return null
    }
}

const mapStateToProps = ({ availLoanDetails }) => {
    return {
        gotoDisbursement: availLoanDetails.gotoDisbursement,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeAvailLoanNavigation: (s) => { dispatch(storeAvailLoanNavigation(s)) }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(AvailLoanBaseComponent);
