/* eslint-disable no-inner-declarations */
import React, { useState } from "react";
import HoldingsMTFSuccessModal from "./HoldingsMTFSuccessModal";
import { MTF_SERVICES } from "../config/ServiceURLs";

import { getMTFBaseURL} from "../common/CommonMethods";

const HoldingsConfirmModal = ({
    showHoldingsConfirm,
    closeHoldingsConfirmModal,
    holdingsModalAmount,
    holdingsUserId,
    resetAmountValue,
    resetDisableSubmit
}) => {
    const showHideClassName = showHoldingsConfirm
        ? "modal display-block"
        : "modal display-none";
    const [check, setHoldingsModalCheckbox] = useState(true)
    const [holdingsModalSuccess, setHoldingsModalSuccess] = useState("");

    const [showHoldingsMTFSuccessModal, setShowHoldingsMTFSuccessModal] =
        useState(false);

    const hideHoldingsMTFSuccessModal = () => {
        setShowHoldingsMTFSuccessModal(false);
        setHoldingsModalSuccess("")
        resetAmountValue(null)
        resetDisableSubmit()
    };

    const resetData = () => {
        console.log("jbjhjh")
        closeHoldingsConfirmModal()
        resetAmountValue(null)
        setHoldingsModalSuccess("")
        resetDisableSubmit()
    }

    const holdingsConfirmModalSubmit = (e) => {
        e.preventDefault();
        let requestData = {
            method: "POST",
            body: JSON.stringify({
                userId: holdingsUserId,
                otpConsent: check ? "Y" : "N",
                amount: holdingsModalAmount,
            }),
            headers: {
                "Content-type": "application/json",
            },
        };
        SubmitModalData();
        async function SubmitModalData() {

            try {
                const response = await fetch(
                    getMTFBaseURL() + MTF_SERVICES.MTF_CONVERT_TO_CASH,
                    requestData
                );
                const data = await response.json();
                if (data.statusCode === 0) {
                    closeHoldingsConfirmModal();
                    setHoldingsModalSuccess(data.data);
                    setShowHoldingsMTFSuccessModal(true);
                    setHoldingsModalCheckbox(true);
                }
                // else if (data.statusCode === 1) {
                // //     setHoldingsModalSuccess(data.message);
                // // }x
                if (data.statusCode === 1) {
                    setHoldingsModalSuccess(data.message);
                    setTimeout(() => {
                        setHoldingsModalSuccess("");
                    }, 5000);

                }
            } catch (err) {
                alert("something went wrong");
            }
        }
    }

    return (
        <>
            <div className={showHideClassName}>
                <section className="modal-main">
                    <div
                        className="bfsl-font closeIcon cursor undefined holdingsModalCloseBtn"
                        onClick={resetData}
                    >
                        f
                    </div>
                    <p>Confirmation: Amount of Rs. {holdingsModalAmount} will be debited from your ledger towards your
                        request for converting MTF Position to Cash (Delivery).
                        Your MTF positions will be converted as per the Highest Var Value or FIFO.</p>
                    <div className="input-check">
                        <input
                            checked={check}
                            type="checkbox"
                            className="otp-check"
                            onChange={(e) =>
                                setHoldingsModalCheckbox(e.target.checked)
                            }
                        />
                        <label>I wish to authorize to generate OTP to pledge
                            shares to avail margin’s facility against these
                            shares.</label>
                    </div>
                    <p className="modalError">
                        {holdingsModalSuccess ? holdingsModalSuccess : null}
                    </p>
                    <div className="button-wrapper">
                        <button className="ok-btn" onClick={holdingsConfirmModalSubmit}>Ok</button>
                        <button className="cancel-btn" onClick={resetData}>Cancel</button>
                    </div>

                </section>

            </div>
            <HoldingsMTFSuccessModal
                show={showHoldingsMTFSuccessModal}
                hideHoldingsMTFSuccessModal={hideHoldingsMTFSuccessModal}
                holdingsModalSuccess={holdingsModalSuccess}
                resetAmountValue={resetAmountValue}
            />
        </>
    );
};
export default HoldingsConfirmModal;
