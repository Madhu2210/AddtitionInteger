// Service Extensions for Common features
export const COMMON = {
    INIT: "/Init/Base/1.0.0",
    CONFIG: "/splash/GetSplashScreen/1.0.0",
};

// --------------------------------------------------------------------------
// Service Extensions for Login
export const LOGIN = {
    USER_LOGIN: "/Trade/Login2FA",
    GUEST_LOGIN: "/User/Login/1.0.0",
    VALIDATE_SESSION: "/Trade/ValidateSession",
    USER_LOGOUT: "/Trade/Logout",
    GENERATE_OTP_GUEST: "/VT/GenerateOTP/1.0.0",
    FORGET_PASSWORD: "/Trade/ForgotPasswordTempPass",
    CHANGE_PASSWORD: "/Trade/ChangePass",
    UNBLOCK_USER: "/Trade/Unblock",
    GENERATE_OTP: "/Trade/GenerateOTP",
    VALIDATE_OTP: "/Trade/ValidateOTP",
    SET_PASSWORD: "/Trade/SetPassword",
    GUEST_USER_LOGOUT: "/User/Logout/1.0.0",
    FORGOT_LOGIN_ID: "/Trade/ForgotLoginId",
    GENERATE_OTP_USER: "/Login/GenerateOTP",
    LOGIN_WITH_OTP: "/Login/ValidateOTP",
    REGISTER_MPIN:"/Trade/RegisterMpin",
    LOGIN_MPIN:"/Trade/LoginMpin"
};

export const WATCHLIST = {
    GET_WATCHGROUPS: "/Watchlist/GetGroups",
    GET_SYMBOL_WATCHGROUP: "/Watchlist/GetSymbols",
    ADD_WATCHGROUP: "/Watchlist/AddGroup",
    DELETE_WATCHGROUP: "/Watchlist/DeleteGroup",
    DELETE_SYMBOLS: "/Watchlist/DeleteSymbols",
    ADD_SYMBOLS: "/Watchlist/AddSymbols",
    ADD_SYMBOL: "/Watchlist/AddSymbol",
    CONTRACT_INFO: "/MarketData/ContractInfo",
    REARRAGE_SYMBOL: "/Watchlist/Rearrange",
};

export const ORDER_PAD = {
    PLACE_ORDER: "/Trade/PlaceOrder_v1",
    MODIFY_ORDER: "/Trade/ModifyOrder",
    GET_SYM_DETAILS: "/Order/GetSymbolDetailsService/1.0.0",
    FUTURE_CHAIN: "/Quote/FutureChainService/1.0.0",
    CO_PRICE_RANGE: "/Trade/COTriggerPriceRange",
    CHECK_MARGIN: "/Trade/CheckMargin",
    PLACE_ORDER_GTD: "/Trade/GTDOrder",
    GUEST_PLACE_ORDER: "/Order/NewOrder/1.0.0",
    GUEST_MODIFY_ORDER: "/Order/ModifyOder/1.0.0",
    GUEST_CHECK_MARGIN: "/Trade/AvailableFunds/1.0.0",
    CHECK_AUTHORISATION_STATUS: "/EDIS/ClientWiseEDIS/1.0.0"
}

export const QUOTE = {
    COMPANY_NEWS: "/News/CompanyNews/1.0.0",
    NEWS_INFO: "/News/RetrieveNews/1.0.0",
    FUTURE_CHAIN: "/Quote/FutureChainService/1.0.0",
    OPTION_CHAIN: "/Quote/OptionChainService/1.0.0",
    PIVOT_DATA: "/Quote/PivotStrategiesService/1.0.0",
    // GET_COMPANY_INFO: "/Report/GetCompanyInformation/1.0.0",
    GET_FINANCIAL_DETAILS: "/Report/GetKeyFinancials/1.0.0",
    GET_EXPIRY_DATE: "/Quote/QuoteExpiryListService/1.0.0",
    GET_SYMBOL_INFO: "/Quote/GetSymbolInfo/1.0.0",
    GET_COMPANY_INFO: "/CorpInfo/GetBackground/1.0.0",
    GET_COMPANY_ADDRESS: "/CorpInfo/CompanyAddress/1.0.0",
    GET_KEY_RESULTS: "/CorpInfo/YearlyResults/1.0.0",
    GET_MARGIN_RATIO: "/CorpInfo/MarginRatios/1.0.0",
    GET_PERFORMANCE_RATIO: "/CorpInfo//PerformanceRatio/1.0.0",
    GET_EFFICENCY_RATIO: "/CorpInfo/EfficiencyRatio/1.0.0",
    GET_FINANCIALSTABILITY_RATIO: "/CorpInfo/FinancialStabilityRatio/1.0.0",
    GET_GROWTH_RATIO: "/CorpInfo/GrowthRatio/1.0.0",
    GET_LIQUIDITY_RATIO: "/CorpInfo/LiquidityRatio/1.0.0",
    GET_VALUATION_RATIO: "/CorpInfo/ValuationRatios/1.0.0",
    GET_SHAREHOLDING_PATTERN: "/CorpInfo/ShareHolding/1.0.0",
    GET_CASHFLOW_RATIO: "/CorpInfo/CashFlowRatios/1.0.0",
    GET_SYM_ALERT: "/Quote/GetSymbol/1.0.0",
};

export const TRADE = {
    GET_NET_POSITION: "/BO/Positions/1.0.0",
    GET_ORDER_BOOK: "/Trade/OrderBook_v1",
    GET_TRADE_BOOK: "/Trade/TradeBook",
    GET_ORDER_LOG: "/Trade/OrderLog",
    CANCEL_ORDER: "/Trade/CancelOrder",
    EXIT_ORDER: "/Trade/ExitOrder",
    POS_CONVERSION: "/Trade/ConvertPosition",
    MUTLIPLE_SQUAREOFF: "/Trade/PlaceBasketOrder",
};

export const HOLDINGS = {
    GET_HOLDINGS: "/Trade/Holdings",
    GET_ALL_HOLDINGS: "/Trade/GetAllHoldings",
    GET_NEWS: "/News/PortfolioBasedNewsHeadlines/1.0.0",
    GET_HOLDINGS_BO: "/BO/Holdings/1.0.0",
};

export const HEADER = {
    SYMBOL_SEARCH: "/Symbol/Search/1.0.1",
};

export const MARKETS = {
    MARKET_MOVERS_SERVICE: "/MarketMovers/MarketMoversService/1.0.0",
    MARKET_MOVERS_EXPIRY_LIST: "/MarketMovers/ExpiryListService/1.0.0",
};

export const FUND_TRANSFER = {
    GET_AVAILABLE_FUNDS: "/FundTransfer/MaxPayoutAmount",
    GET_LIMITS: "/Trade/Limits",
    INITIATE_PAYMENT: "/InitiatePayment/1.0.0",
    GET_TRANSFER_STATUS: "/FundTransfer/TransferStatus",
    GET_CANCEL_PAYOUT: "/FundTransfer/CancelPayout",
    GET_BANK_DETAILS: "/FundTransfer/BankDetails",
    ADD_PAYOUT: "/FundTransfer/AddPayout",
    GET_VIEW_LIMITS: "/Trade/ViewLimits",
    GET_LIMITS_VIEW: "/Trade/FundsView",
    GET_PAYMENT_DETAILS: "/FundTransfer/GetPaymentDetails/1.0.0",
    GET_BANK_DETAILS_FUNDS: "/BO/PaymentOptions/1.0.0",
    GET_FUNDS_MARGIN: "/Fund/MarginFunds",
};

export const DASHBOARD_SERVICES = {
    GET_GLOBAL_NEWS_HEADLINES: "/News/GlobalNewsHeadlines/1.0.0",
    GET_CHART_DATA: "/Chart/GetChartData/1.0.0",
    ORDER_COUNT: "/Dashboard/OrderCount_v1",
    CONSTITUENTS_SYMBOLS: "/MarketMovers/IndexConstituentsSymbolService/1.0.0",
    BANNER_DETAILS: "/BO/GetDashboardBanners/1.0.0",
    BANNER_DETAILS_2: "/BO/GetBannerDetails/1.0.0",
    GET_USER_ACTIONS_BANNER: "/BO/UserAction/1.0.0",
};

export const SYMBOLS = {
    SEARCH: "/Trade/SymbolSearch",
    MVP_SEARCH: "/Symbol/Search/1.0.0",
};

export const CHART_SERVICES = {
    CHART_DATA: "/Chart/GetChartData/1.0.1",
    HISTORY_DATA: "/Chart/GetHistoryData/1.0.1",
};

export const PROFILE = {
    PROFILE_DETAILS: "/BO/WelcomeLetter/1.0.0",
    GET_USER_PROFILE: "/Userprofile/GetProfilePic/1.0.0",
    REMOVE_USER_PROFILE: "/Userprofile/RemoveProfilePic/1.0.0",
    UPLOAD_USER_PROFILE: "/Userprofile/UploadProfilePic/1.0.0",
    GET_USER_BANKDETAILS: "/Trade/AccountInfo",
    UPLOAD_INCOME: "/BO/UploadIncome/1.0.0",
};

export const INDICES = {
    INDEX_CONTRIBUTIONS: "/Equity/IndexContributions/1.0.0 ",
    INDEX_CONSTITUENTS: "/MarketMovers/IndexConstituentsSymbolService/1.0.0",
};

export const IPO_SERVICES = {
    OPEN_IPO: "/IPO/ListedIPO/1.0.0",
    UPCOMING_IPO: "/IPO/UpComingIPO/1.0.0",
    CLOSED_IPO: "/IPO/ClosedIPO/1.0.0",
    IPO_ORDERBOOK: "/IPO/OrderBook/1.0.0",
    IPO_ORDER_HISTORY: "/IPO/History/1.0.0",
    GET_UPI_LIST: "/IPO/UPIHandler/1.0.0",
    APPLY_IPO: "/IPO/ApplyIPO/1.0.0",
    MODIFY_IPO: "/IPO/ModifyIPO/1.0.0",
    CANCEL_IPO: "/IPO/CancelIPO/1.0.0",
    MODIFY_PREFILL: "/IPO/GetIpoDetails/1.0.0",
};

export const MARKET = {
    MARKET_MOVERS: "/MarketMovers/MarketMoversService/1.0.0",
    TOP_GAINERS: "/Equity/GetTopGainers/1.0.0",
    TOP_LOSERS: "/Equity/GetTopLosers/1.0.0",
    BULKBLOCKDEALS: "/Equity/BulkBlockDeal/1.0.0",
    IPO_PERFORMANCE: "/IPO/Performance/1.0.0",
    FII_DII_ACTIVITY: "/CorpInfo/FIIDII/1.0.0",
    PUT_CALL_RATIO: "/Derivative/PutCallRatio/1.0.0",
    GET_EXPIRY_DATELIST: "/MarketMovers/ExpiryListService/1.0.0",
    GET_GLOBAL_INDICES: "//Equity/WorldMarkets/1.0.0",
};

export const MENU_SERVICE = {
    GET_PLEDGE_URL: "/Epledge/InitiateEpledge/1.0.0",
    GET_EDIS_URL: "/Edis/InitiateEDIS/1.0.0",
    GET_BO_REPORTS_URL: "/BO/InitiateBO/1.0.0",
    GET_MTFPLEDGE_URL: "/MTF/ValiadtePledgeOTP/1.0.0",
    MTF_CONVERT_TO_CASH : "/MTF/ConvertToCash"
};

export const BO_REPORT_SERVICE = {
    FINANCIAL_LEDGER_QUICK: "/BO/QuickSnapShot/1.0.0",
    FINANCIAL_LEDGER_DETAILED: "/BO/LedgerReport/1.0.0",
    FUND_TRANSACTION: "/BO/FundTranscation/1.0.0",
    TRADE_SUMMARY_EQUITY: "/BO/TradeSummaryCash/1.0.0",
    TRADE_SUMMARY_DERIVATIVE: "/BO/TradeSummaryFNO/1.0.0",
    PL_REPORT_EQUITY: "/BO/PNLForCash/1.0.0",
    PL_REPORT_DERIVATIVE: "/BO/PNLFNO/1.0.0",
    COST_REPORT_EQUITY: "/BO/LeviesCM/1.0.0",
    COST_REPORT_DERIVATIVE: "/BO/LeviesFNO/1.0.0",
    CONTRACT_NOTE_DOWNLOAD: "/BO/ContractReportFiles/1.0.0",
    VIEW_LAST_TRANSACTION: "/BO/LastTransaction/1.0.0",
    CLIENT_HOLDINGS:  "/BO/ClientHolding/1.0.0",
    DIVIDEND_REPORT: "/BO/Dividend/1.0.0",
    DP_TRANSACTION:  "/BO/DPTransactionBillReport/1.0.0",
    INTEREST_REPORT_DPC:  "/BO/DPC/1.0.0",
    INTEREST_REPORT_MTF:  "/BO/MTFService/1.0.0",
    TAX_REPORT_EQUITY: "/BO/CashTaxService/1.0.0",
    TAX_REPORT_DERIVATIVE: "/BO/FOTax/1.0.0",
    EDIT_TRADESUMMARY_PRICE: "/BO/TransferBuyRate/1.0.0",
    LTCG_REPORT: "/BO/LTCGReport/1.0.0",
    PNL_REPORT_EQUITY: "/BO/PNLForCash/1.0.0",
    PNL_REPORT_DERIVATIVE: "/BO/PNLFNO/1.0.0",
    BROKERAGE_REPORT: "/BO/Brokerage/1.0.0",
    DP_BILL_CHARGES: "/BO/DPBillReport/1.0.0",
};

export const ALERT_SERVICES = {
    ADD_ALERT: "/AddAlert/1.0.0",
    LIST_TRIGGERED_ALERT: "/ListTriggeredAlerts/1.0.0",
    LIST_PENDING_ALERT: "/ListPendingAlerts/1.0.0",
    DELETE_ALERT: "/DeleteAlert/1.0.0",
    MODIFY_ALERT: "/ModifyAlert/1.0.0",
    GET_ALL_INBOX: "/Inbox/GetInboxPriceAlerts/1.0.0",
    GET_UNREAD_MESSAGE: "/Inbox/GetAllUnreadMessage/1.0.0",
    GET_GLOBAL_MESSAGE: "/Inbox/GetAllGlobalAndUserSpecificMessages/1.0.0",
    UPDATE_INBOX_MESSAGE: "/Inbox/UpdateInboxMessageStatus/1.0.0",
    CLEAR_ALL_MESSAGE: "/Inbox/Clear/1.0.0",
};

export const LAS_SERVICES = {
    CHECK_ELIGIBILITY: "/LAS/Loan/EligibilityCheck",
    GET_KYC: "/LAS/Loan/GetKYC",
    GET_USER_STAGE: "/LAS/Loan/GetUserStage",
    UPDATE_USER_STAGE: "/LAS/Loan/UpdateEkycStage",
    GET_SHARES: "/LAS/Loan/GetShares",
    APPLY_LOAN: "/LAS/Loan/Apply",
    RECHECK_ELIGIBITY: "/LAS/Loan/RecheckEligiblity",
    GET_LOAN_STATUS: "/LAS/Loan/GetLoanStatus",
    LASTICKET: "/LAS/GenerateTicket",
    UPDATE_BANK: "/LAS/Loan/UpdateBank",
    UPDATE_LOAN_AMNT: "/LAS/Loan/UpdateLoanAmount",
    GENERATE_OTP: "/LAS/GenerateOTP",
    VERIFY_OTP: "/LAS/Loan/PledgeShares",
    CONFIRM_STAGE: "/LAS/Loan/ConfirmStage",
    CONFIRM_SHARES: "/LAS/Loan/ConfirmShares",
};
export const LAS_SERVICE_JOURNEY = {
    GET_LOAN_DETAILS: "/LAS/GetLoanDetails",
    GENERATE_OTP_DETAILS: "/LAS/GenerateOTP",
    VERIFY_OTP: "/LAS/SaveDisbursement",
    GET_HOLDING: "/LAS/GetHoldings",
    OTP_GENERATE_RELEASE_SHARE: "/LAS/GenerateOTP",
    VERIFY_OTP_RELEASE_SHARE: "/LAS/ReleaseRequest",
    BANK_DETAILS: "/LAS/Loan/ListBankDetails",
    LIST_STATEMENTS: "/LAS/ListStatements",
    ADDITIONAL_PLEDGING: "/LAS/getAdditionalShare",
    OTP_GENERATE_ADDITIONAL_PLEDGE: "/LAS/GenerateOTP",
    ADDITIONAL_PLEDG_OTP: "/LAS/AdditionalPledge",
    CONFIRM_SHARES: "/LAS/Loan/ConfirmShares",
    GET_LOAN_AMOUNT: "/LAS/CalculateDrawingPower",
    CONFIRM_ADDITIONAL_SHARE: "/LAS/ConfirmAdditionalShares",
    REPAYMENT_DETAILS: "/LAS/Repayment/1.0.0",
};
export const LOGIN_GUEST = {
    VALIDATE_SESSION: "/Trade/validateSession/1.0.0",
};

export const WATCHLIST_GUEST = {
    GET_WATCHGROUPS: "/Watchlist/ViewGroup/1.0.0",
    GET_SYMBOL_WATCHGROUP: "/Watchlist/ViewSymbol/1.0.0",
    ADD_WATCHGROUP: "/Watchlist/AddGroup",
    DELETE_WATCHGROUP: "/Watchlist/DelGroup/1.0.0",
    DELETE_SYMBOLS: "/Watchlist/DelSymbol/1.0.0",
    ADD_SYMBOLS: "/Watchlist/AddSymbol/1.0.0",
    CONTRACT_INFO: "/MarketData/ContractInfo",
    REARRAGE_SYMBOL: "/Watchlist/Rearrange/1.0.0",
};

export const HEADER_GUEST = {
    SYMBOL_SEARCH: "/Symbol/Search/1.0.1",
};

export const HOLDINGS_GUEST = {
    GET_HOLDINGS_BO: "/Trade/Holdings/1.0.0",
};

export const TRADE_GUEST = {
    GET_NET_POSITION: "/trade/positions/1.0.0",
    GET_ORDER_BOOK: "/Trade/OrderBook/1.0.0",
    GET_TRADE_BOOK: "/Trade/TradeBook/1.0.0",
    GET_ORDER_LOG: "/Trade/OrderLog/1.0.0",
    CANCEL_ORDER: "/Order/CancelOder/1.0.0",
    EXIT_ORDER: "/Trade/ExitOrder",
    POS_CONVERSION: "/Trade/ConvertPosition/1.0.0",
    MUTLIPLE_SQUAREOFF: "/Trade/PlaceBasketOrder",
};

export const DASHBOARD_SERVICES_GUEST = {
    GET_GLOBAL_NEWS_HEADLINES: "/News/GlobalNewsHeadlines/1.0.0",
    GET_CHART_DATA: "/Chart/GetChartData/1.0.0",
    ORDER_COUNT: "/Dashboard/orderCount/1.0.0",
    CONSTITUENTS_SYMBOLS: "/MarketMovers/IndexConstituentsSymbolService/1.0.0",
};
export const OFS_SERVICES = {
    UPCOMING_ONGOING: "/Trade/ListedOFSService",
    OFS_ORDERBOOK: "/Trade/OFSOrderBook",
    OFS_PLACE_ORDER: "/Trade/PlaceOFSOrder",
    OFS_MODIFY_ORDER: "/Trade/ModifyOFS",
    CANCEL_OFS: "/Trade/CancelOFS",
};

export const PROFILE_GUEST = {
    GET_USER_PROFILE: "/Userprofile/GetProfilePic/1.0.0",
    REMOVE_USER_PROFILE: "/Userprofile/RemoveProfilePic/1.0.0",
    UPLOAD_USER_PROFILE: "/Userprofile/UploadProfilePic/1.0.0",
    GET_USER_BANKDETAILS: "/Trade/AccountInfo",
};

export const MARKET_GUEST = {
    MARKET_MOVERS: "/MarketMovers/MarketMoversService/1.0.0",
    TOP_GAINERS: "/MarketMovers/MarketMoversService/1.0.0",
    TOP_LOSERS: "/MarketMovers/MarketMoversService/1.0.0",
    GET_EXPIRY_DATELIST: "/MarketMovers/ExpiryListService/1.0.0",
    GET_GLOBAL_INDICES: "//Equity/WorldMarkets/1.0.0",
};
export const NEWS_SERVICE = {
    PORTFOLIO_NEWS: "/News/PortfolioNews/1.0.0",
    CATEGORY_NEWS: "/News/CategoryNews/1.0.0",
    CORPORATE_ACTION_NEWS: "/CorpInfo/ConsolidatedCorporate/1.0.0",
};

export const NCD_SERVICE = {
    LIST: "/NCD/DebtIPOList/1.0.0",
    GET_UPI_LIST: "/NCD/UPIHandler/1.0.0",
    PLACE_NCD_ORDER: "/NCD/DebtIPOBid/1.0.0",
    ORDER_BOOK: "/NCD/DebtOrderBook/1.0.0 ",
    CANCEL_NCD: "/NCD/DebtCancel/1.0.0",
};

export const OTHER_PRODUCTS_SERVICE = {
    US_BASE: "/vested/GetVestedPage",
    BONDS:  "/GoldenPi/InitiateGoldenpiLogin",
    THEMATICS: "/Pickright/GetPickrightPage",
    IDEAS_INFO: "/Ideas/GetIdeasInfo",
    UPDATE_USER: "/vas/UpdateUser",
    MARKET_SMITH_GET_SYMBOLS: "/marketsmith/GetSymbols",
};

export const MTF_SERVICES = {
    GET_EDIS_DASHBOARD_DETAILS: "/EDIS/DashBoardDetails/1.0.0 ",
    GENERATE_TPIN: "/EDIS/GenerateTPIN/1.0.0 ",
    GET_PLEDGE_DETAILS: "/MTF/ClientPledgedetails/1.0.0",
    GET_MTF_DETAILS: "/MTF/GetMTFDetails?userId=",
    MTF_CONVERT_TO_CASH: "/MTF/ConvertToCash",
};

export const MARKET_SMITH_SERVICE = {
    CANCEL_OR_REFUND: "/marketsmith/PaymentRefund",
    GET_PACKAGEDETAILS: "/marketsmith/ViewPackDetailsByID",
    VIEW_ALL_PACKAGEDETAILS: "/marketsmith/ViewPackageDetails",
    INIT_LEDGER_PAYMENT: "/marketsmith/initLedgerPayment",
};

export const ACCOUNT_MENU_SERVICES = {
    HELP_AND_SUPPORT: "/BO/HelpandSupport/1.0.0",
};

export const E_VOTING_SERVICE = {
    GET_EVOTING_URL: "/BO/EVoting/1.0.0",
};
