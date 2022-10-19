import React from "react";

const HoldingsMTFSuccessModal = ({ show, hideHoldingsMTFSuccessModal ,holdingsModalSuccess }) => {
    const showHoldingsMTFSuccessModal = show
        ? "modal display-block"
        : "modal display-none";

    return (
        <div className={showHoldingsMTFSuccessModal}>
            <section className="modal-main">
                <div
                    className="bfsl-font closeIcon cursor undefined holdingsModalCloseBtn"
                    onClick={hideHoldingsMTFSuccessModal}
                >
                    f
                </div>
                <p style={{ color: "green" }}>{holdingsModalSuccess}</p>
                <button className="ok-btn m-auto display-block" onClick={hideHoldingsMTFSuccessModal}>OK</button>
                
            </section>
        </div>
    );
};
export default React.memo(HoldingsMTFSuccessModal);
