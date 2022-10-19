import { engKey, hindiKey } from './LanguageConstants'

export const LANG_MSSAGES = {
    [engKey]: {
        NetworkErrorMessages: {
            API_SERVICE_UNAVAILABLE: "API service is not available.",
            NO_CONNECTIVITY: "No network connectivity, please try again later",
            API_TIMEOUT: "Request timeout, please try again later"
        },
        CommonErrorMessages: {
            NoMobile: "Mobile not supported",
            INVALID_SESSION: "Invalid Session",
            INACTIVE_MSG: "Your session is timeout due to inactive session",
            API_ERROR: "Error occured",
            NO_DATA: "No data found",
            NO_DATA_AVAIL: "No data available",
        },
        LOGIN: {
            FORGET_PASSWORD_INFO_MSG: "Please enter following details to reset the password",
            MOBILE_VERIFY_INFO_MSG: "A 4 digit OTP will be sent in SMS to verify your mobile number.",
            RESET_PASSWORD_INFO_MSG: "Enter your New password to continue",
            LOGOUT_CONFIRM: "Are you sure you want to Logout ?",
            PASSWORD_CHANGE_SUCCESS: "Your password has been changed successfully. Please login to continue."
        },
        WATCHLIST_MSG: {
            ADD_WATCHLIST_SUCCESS: 'Watchgroup added successfully',
            DELETE_WATCHLIST_SUCCESS: 'Watchgroup deleted successfully',
            DELETE_SYMBOLS_SUCCESS: 'Symbol(s) deleted successfully',
            DELETE_QUERY: "Are you sure you want to delete",
            NO_SYMBOL_FOUND: "No symbol found",
            INVALID_WATCHLIST_NAME: "Name should not contains special characters"
        },
        VALIDATION: {
            USERNAME_EMPTY: "Please enter the user id",
            PASSWORD_EMPTY: "Please enter the password",
            PAN_EMPTY: "Please enter the PAN/DOB",
            PASSWORD_LENGTH: "Password should be minimum 6 characters and maximum 12 characters",
            CONFIRM_PASSWORD_ERROR: "New password and Confirm password is not matching",
            INVALID_DOB: "DOB must be in DDMMYYYY format",
            INVALID_PAN_DOB: "Invalid PAN/DOB"
        },
        ORDERPAD: {
            QUANTITY_EMPTY: "Please enter the Quantity",
            PRICE_EMPTY: "Please enter the Price",
            TRIGGER_PRICE_EMPTY: "Please enter the Trigger Price",
            TRAILING_STOP_LOSS_EMPTY: "Please enter the Trailing SL",
            STOP_LOSS_SELL_EMPTY: "Please enter the Stop loss",
            SQUARE_OFF_SELL_EMPTY: "Please enter the Square Off",
            DIS_QUANTITY_EMPTY: "Please enter the Disclosed Qty",
            DATE_EMPTY: "Please enter the Date",
            UPI_EMPTY: "Please enter the UPI id",
            PRICE_RANGE: "Please enter the price with in the given range",
            TRIGGER_PRICE_RANGE: "Please enter the Trigger price within the given price range",
            STOP_LOSS_RANGE: "Please enter the Stoploss within the given range",
            SQUARE_OFF_RANGE: "Please enter the Square Off within the given range",
            GTC_PRICE_RANGE: "Please enter the price with in the given range",
            GREATER_TRIGGER_PRICE: "Trigger Price cannot be greater than the limit price",
            GREATER_STOP_LOSS: "Stop loss value should be less than the Limit price",
            LESSER_STOP_LOSS: "Stoploss value should be greater than the Limit price",
            LESS_TRIGGER_PRICE: "Trigger Price cannot be lesser than limit price",
            DIS_QTY_RANGE: "Disclosed qty should not be greater than the Qty",
            LOW_DIS_QTY: "Disclosed Qty should be Min 10% of Qty",
            LOW_DIS_QTY_25: "Disclosed Qty should be Min 25% of Qty",
            LOW_SQUARE_OFF: "Square Off value cannot be lesser than limit price",
            HIGH_SQUARE_OFF: "Square Off value cannot be greater than limit price",
            LOW_QUANTITY: "Quantity value should be multiple of lot size",
            QUANTITY_RANGE: "Quantity value should be multiple of the Lot size",
            GREATER_QUANTITY: "Square Off Qty must be less than or equal to Ordered Qty",
            GREATER_PRICE_ML: "Price cannot be greater than Ordered price",
            LESS_PRICE_ML: "Price cannot be lesser than Ordered price",
            GREATER_TRIGGER_PRICE_ML: "Trigger Price cannot be greater than Ordered price",
            LESS_TRIGGER_PRICE_ML: "Trigger Price cannot be lesser than Ordered price",

            QUANTITY_INVALID: "Please enter a valid Quantity",
            PRICE_INVALID: "Please enter a valid price",
            TRIGGER_PRICE_INVALID: "Please enter a valid Trigger price",
            TRAILING_STOP_LOSS_INVALID: "Please enter a valid Trailing stop loss",
            STOP_LOSS_SELL_INVALID: "Please enter a valid Stop loss value",
            SQUARE_OFF_SELL_INVALID: "Please enter a valid Square off value",
            DIS_QUANTITY_INVALID: "Please enter a valid disclosed qty",
            MARKET_PROT: "Please enter a valid Market protection",
            TICK_SIZE_ERROR: " should be multiple of tick size",
            LOT_SIZE_DIS_QTY: "Disclosed qty should be multiple of Lot size"
        },
        SYMBOL_SEARCH_MSGS: {
            MIN_SEARCH_CHAR: "Enter minimum 3 characters"
        },
        FUND_TRANSFER_MSG: {
            ZERO_AMT: "Please enter valid amount",
            VALID_AMT: "Please enter the amount",
            AMT_RANGE: "Withdrawal amount should be equal or less than your ledger balance",
            NO_BANK_ACC: "No bank account",
            PAYOUT_CANCEL_MSG: "Payout request cancelled successfully"
        },
        LAS_MESSAGE: {
            CONFIRM_KYC: "I accept "
        }
    },
    [hindiKey]: {

    }
}
