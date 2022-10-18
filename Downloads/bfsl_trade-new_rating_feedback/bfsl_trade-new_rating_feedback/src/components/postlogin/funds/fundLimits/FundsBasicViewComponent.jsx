import React from 'react'
import { checkEmpty } from '../../../../common/CommonMethods';
import LangText from '../../../../common/lang/LangText';

function FundsBasicViewComponent(props) {
    return (
        <div className="fund-basic-detailed-view">
            {
                props ?
                    (props.limitsData ?
                        <>
                            <div className="row">
                                <span className="label first">
                                    <LangText  name="CASH_EQUIVALENT" />
                                </span>
                                <span className="data">
                                </span>
                            </div>
                            <div className="row">
                                <span className="label">
                                    <LangText name="CASH_BALANCE" />
                                </span>
                                <span className="data">
                                    {props.limitsData.ttlCashBal ? '₹ ' : ''}{checkEmpty(props.limitsData.ttlCashBal)}
                                </span>
                            </div>
                            <div className="row">
                                <span className="label">
                                    <LangText module="FUNDS" name="COLLATERAL_VALUE" />
                                </span>
                                <span className="data">
                                    {props.limitsData.collateralVal ? '₹ ' : ''}
                                    {checkEmpty(props.limitsData.collateralVal)}
                                </span>
                            </div>
                            <div className="row">
                                <span className="label">
                                    <LangText name="PAY_IN_AMOUNT" />
                                </span>
                                <span className="data">
                                    {props.limitsData.payin ? '₹ ' : ''}{checkEmpty(props.limitsData.payin)}
                                </span>
                            </div>
                            <div className="row">
                                <span className="label">
                                    <LangText  name="PAY_OUT_AMOUNT" />
                                </span>
                                <span className="data">
                                    {props.limitsData.payout ? '₹ ' : ''} {checkEmpty(props.limitsData.payout)}
                                </span>
                            </div>
                            <div className="row">
                                <span className="label margin">
                                    <LangText  name="MARGIN_UTILIZED" />
                                </span>
                                <span className="data">
                                </span>
                            </div>
                            <div className="row">
                                <span className="label">
                                    <LangText name="MARGIN_USED" />
                                </span>
                                <span className="data">
                                    {props.limitsData.margnUsed ? '₹ ' : ''} {checkEmpty(props.limitsData.margnUsed)}
                                </span>
                            </div>
                            <div className="row">
                                <span className="label">
                                    <LangText  name="SCRIP_BSKT_MARGIN_PRESENT" />
                                </span>
                                <span className="data">
                                    {props.limitsData.scrpBsktMrgn ? '₹ ' : ''}
                                    {checkEmpty(props.limitsData.scrpBsktMrgn)}
                                </span>
                            </div>
                            <div className="row">
                                <span className="label">
                                    <LangText name="SPAN_MARGIN" />
                                </span>
                                <span className="data">
                                    {props.limitsData.spanMargn ? '₹ ' : ''}  {checkEmpty(props.limitsData.spanMargn)}
                                </span>
                            </div>
                            <div className="row">
                                <span className="label">
                                    <LangText  name="EXPOSURE_MARGIN" />
                                </span>
                                <span className="data">
                                    {props.limitsData.expMargn ? '₹ ' : ''}{checkEmpty(props.limitsData.expMargn)}
                                </span>
                            </div>
                            <div className="row">
                                <span className="label">
                                    <LangText name="PREMIUM_PRESENT" />
                                </span>
                                <span className="data">
                                    {props.limitsData.premiumPrsnt ? '₹ ' : ''}
                                    {checkEmpty(props.limitsData.premiumPrsnt)}
                                </span>
                            </div>
                            <div className="row">
                                <span className="label">
                                    <LangText module="FUNDS" name="REALISED_MTOM" />
                                </span>
                                <span className="data">
                                    {props.limitsData.realMTM ? '₹ ' : ''} {checkEmpty(props.limitsData.realMTM)}
                                </span>
                            </div>
                            <div className="row">
                                <span className="label">
                                    <LangText name="UNREALISED_MTOM" />
                                </span>
                                <span className="data">
                                    {props.limitsData.unrealMTM ? '₹ ' : ''}  {checkEmpty(props.limitsData.unrealMTM)}
                                </span>
                            </div>
                            <div className="row last">
                                <span className="label last">
                                    <LangText  name="NET_CASH_AVL" />
                                </span>
                                <span className="data">
                                    {props.limitsData.netCashAvail ? '₹ ' : ''}
                                    {checkEmpty(props.limitsData.netCashAvail)}
                                </span>
                            </div>
                        </>

                        : <div className="error-div"> {props.errorMsg}</div>
                    )
                    : null
            }
        </div>
    )
}
export default FundsBasicViewComponent;