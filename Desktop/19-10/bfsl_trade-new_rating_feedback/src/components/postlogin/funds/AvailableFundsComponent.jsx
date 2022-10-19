import React from 'react';

import LangText from '../../../common/lang/LangText';
import { WidgetLoader } from '../../common/WidgetLoaderComponent'

import { FUNDS_SCREENS, TEXT_ORIENTATION } from '../../../common/Constants';
import { checkEmpty } from '../../../common/CommonMethods';

function AvailableFundsComponent(props) {

    function withdrawFunds() {
        props.selectedScreen(FUNDS_SCREENS.FUNDS_WITHDRAWAL)
    }

    function addFunds() {
        props.selectedScreen(FUNDS_SCREENS.ADD_FUNDS)
    }

    return (
        <div className="available-details">
            {
                props.resultData ?
                    <>
                        <div className="available-funds">
                            <div className="funds">
                                <span className="label">
                                    <LangText module="FUNDS" name="AVAILABLE_FUNDS" />
                                </span>
                                <span className="value">{props.resultData.netCashAvail ? '₹ ' : ''}
                                    {checkEmpty(props.resultData.netCashAvail)} </span>
                            </div>
                            {/* <div className="statements cursor">
                                <LangText module="FUNDS" name="VIEW_STMT" />
                            </div> */}
                        </div>
                        <div className="opening-bal">
                            <div className="bal">
                                <span className="label">
                                    <LangText module="FUNDS" name="OPENING_BALANCE" />
                                </span>
                                <span className="val">  {props.resultData.cashBal ? '₹ ' : ''}
                                    {checkEmpty(props.resultData.cashBal)}</span>
                            </div>
                            <span className="line-seperate"></span>
                            <div className="margin-used">
                                <span className="label">
                                    <LangText module="FUNDS" name="MARGIN_USED" />
                                </span>
                                <span className="val"> {props.resultData.margnUsed ? '₹ ' : ''}
                                    {checkEmpty(props.resultData.margnUsed)}</span>
                            </div>
                        </div>
                        <div className="action-btns">
                            <button className="add-funds" onClick={() => addFunds()}>
                                <LangText module="BUTTONS" name="ADD_FUNDS" />
                            </button>
                            <button className="withdraw-funds" onClick={() => withdrawFunds()}>
                                <LangText module="BUTTONS" name="WITHDRAW_FUNDS" 
                                    orientation={TEXT_ORIENTATION.UPPERCASE} />
                            </button>
                        </div>
                    </>

                    : <div className="errorMsg"> {props.errorMsg} </div>
            }

        </div>

    )
}

export default WidgetLoader(AvailableFundsComponent);