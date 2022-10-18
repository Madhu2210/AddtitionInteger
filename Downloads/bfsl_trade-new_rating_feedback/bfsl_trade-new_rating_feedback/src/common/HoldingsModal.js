/* eslint-disable no-inner-declarations */
import React, { useEffect, useState } from "react";
import HoldingsConfirmModal from "./HoldingsConfirmModal"
// import LoaderComponent from '../components/common/LoaderComponent';

const HoldingsModal = ({
    handleClose,
    show,
    holdingsUserId,
    mtfLedger,
    liveLedger,
}) => {
    const showHideClassName = show
        ? "modal display-block"
        : "modal display-none";
    const [holdingsModalValue, setHoldingsModalValue] = useState(null);
    const [holdingsModalError, setHoldingsModalError] = useState("");

    const [showHoldingsConfirm, setShowHoldingsConfirm] =
        useState(false);
    const [disableSubmit, setDisableSubmit] = useState(true)
    useEffect(() => {
        if (holdingsModalValue === null || holdingsModalValue == "") return
        handleValidation()
    }, [holdingsModalValue])

    const handleValidation = () => {

        let errors;
        let ledgerLevel = "Current Cash Ledger Balance";
        let mtfLabel = "Total MTF Value";
        let positiveMTFLedger = Math.abs(mtfLedger)
        let lowestValue = (liveLedger < positiveMTFLedger) ? liveLedger : positiveMTFLedger;
        if (liveLedger <= 0) {

            errors = "Current Cash Ledger Balance should not be 0";
            setHoldingsModalError(errors);
            setDisableSubmit(true)
        } else if (!holdingsModalValue) {
            errors = "Amount field should not be empty";
            setHoldingsModalError(errors);
            setDisableSubmit(true)
        } else if (typeof holdingsModalValue !== "undefined") {
            if (Number(holdingsModalValue) < 5000) {

                errors = "Amount should be greater than 5000";
                setHoldingsModalError(errors);
                setDisableSubmit(true)
            } else if (holdingsModalValue > lowestValue) {
                // errors = "Entered Amount can not be greater than " + lowestValue;
                if(lowestValue == liveLedger)
                    errors = "Entered Amount can not be greater than " +ledgerLevel+ " " + lowestValue;
                else
                    errors = "Entered Amount can not be greater than " +mtfLabel+ " " + lowestValue;
                setHoldingsModalError(errors);
                setDisableSubmit(true)
            } else {
                setDisableSubmit(false)
            }
        }
        setHoldingsModalError(errors);

    };
    const modalHandleSubmit = () => {
        setHoldingsModalError("");
        handleClose()
        setShowHoldingsConfirm(true)
    }

    const closeHoldingsModal = () => {
        setHoldingsModalError("");
        setHoldingsModalValue("")
        setDisableSubmit(true)
        handleClose()
    }

    const closeHoldingsConfirmModal = () => {
        setShowHoldingsConfirm(false)
        setHoldingsModalValue(null)
        setHoldingsModalError("");
    }

    const resetAmountValue = () => {
        setHoldingsModalValue("")
    }

    const resetDisableSubmit = () => {
        setDisableSubmit(true)
        setHoldingsModalError("");
    }

    return (
        <>
            <div className={showHideClassName}>
                <section className="modal-main">
                    {/* {liveLedger == 0 ? <> */}
                    <div
                        className="bfsl-font closeIcon cursor undefined holdingsModalCloseBtn"
                        onClick={closeHoldingsModal}
                    >
                        f
                    </div>
                    {/* {/* <form
                        noValidate
                        onSubmit={modalHandleSubmit}
                        className="holdingsModalForm"
                    > */}
                    <ul>
                        <li>Current Cash Ledger Balance:</li>
                        <li className="modal-figure">{liveLedger}</li>
                        <li>Total MTF Value</li>
                        <li className="modal-figure">{mtfLedger}</li>
                        <li>Enter Amount</li>
                        <li className="modal-figure">
                            <input
                                type="number"
                                name="holdingsModalValue"
                                value={holdingsModalValue}
                                onChange={e =>
                                    setHoldingsModalValue(e.target.value)
                                }
                            />
                        </li>
                        {/* <li className={`${disableSubmit ? "display-none" : ""}otp-declaration`}>
                                <input
                                    checked={holdingsModalValue.check}
                                    type="checkbox"
                                    className="otp-check"
                                    onChange={(e) =>
                                        setHoldingsModalValue({
                                            ...holdingsModalValue,
                                            check: e.target.checked,
                                        })
                                    }
                                />
                                I wish to authorize to generate OTP to pledge
                                shares to avail margin’s facility against these
                                shares.
                            </li> */}
                    </ul>
                    <p className="modalError">
                        {holdingsModalError ? holdingsModalError : null}
                    </p>
                    <button className="ok-btn m-auto display-block" 
                        disabled={disableSubmit ? true : ""} onClick={modalHandleSubmit}>Submit</button>
                    {/* </form> */}
                    {/* </>: <LoaderComponent />}  */}
                </section>

            </div>
            <HoldingsConfirmModal showHoldingsConfirm={showHoldingsConfirm}
                closeHoldingsConfirmModal={closeHoldingsConfirmModal}
                holdingsModalAmount={holdingsModalValue} holdingsUserId={holdingsUserId}
                resetAmountValue={resetAmountValue} resetDisableSubmit={resetDisableSubmit} />

        </>
    );
};
export default HoldingsModal;
