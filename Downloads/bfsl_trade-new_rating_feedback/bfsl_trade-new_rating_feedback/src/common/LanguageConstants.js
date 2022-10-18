export const LANGUAGE_KEY = { ENGLISH: "ENGLISH", HINDI: "HINDI" }

export const LANUAGE_LIST_LANG = [
    { key: LANGUAGE_KEY.ENGLISH, value: "ENGLISH" },
    // { key: LANGUAGE_KEY.HINDI, value: "हिंदी" }
    { key: LANGUAGE_KEY.HINDI, value: "HINDI" }

]

export const engKey = LANGUAGE_KEY.ENGLISH
export const hindiKey = LANGUAGE_KEY.HINDI

export const LANG_CONST = {
    [engKey]: {
        BUTTONS: {
            LOGIN: "LOGIN",
            CANCEL: "CANCEL",
            SUBMIT: "SUBMIT",
            VERIFY: "VERIFY",
            VIRTUAL_TRADING: "VIRTUAL TRADING",
            GUEST_USER: "GUEST USER",
            UNBLOCK: "UNBLOCK",
            OPEN_ACCOUNT: "OPEN AN ACCOUNT",
            SEND_OTP: "SEND OTP",
            OK: "OK",
            STOCK_REPORT: "STOCK REPORT",
            BUY: "BUY",
            SELL: "SELL",
            SAVE: "SAVE",
            DELETE: "DELETE",
            CLEAR_ALL: "CLEAR ALL",
            CONVERT: "CONVERT",
            ADD_MORE: "ADD MORE",
            SELL_MORE: "SELL MORE",
            SQUARE_OFF: "SQUARE OFF",
            YES: "YES",
            NO: "NO",
            SUBMIT_ORDER: "SUBMIT ORDER",
            REORDER: "REORDER",
            BUY_MORE: "BUY MORE",
            REASON: "REASON",
            ORDER_TRAIL: "ORDER TRAIL",
            MODIFY: "MODIFY",
            CONFIRM_ORDER: "CONFIRM ORDER",
            DONE: "DONE",
            EXIT: "EXIT"
        },
        ORDERS: {
            ORDERS_MENUS: ["ORDER BOOK", "TRADE BOOK", "NET POSITION"],
            SUCCESS: "SUCCESS",
            EXCHANGE: [{ name: "ALL EXCHANGE", key: "all" }, { name: "NSE", key: "nse" }, { name: "BSE", key: "bse" },
                { name: "ICEX", key: "icex" }, { name: "MSEI", key: "msei" }, { name: "MCX", key: "mcx" }
            ],
            SEGMENT: [{ name: "ALL SEGMENT", key: "all" }, { name: "EQUITY", key: "equity" },
                { name: "FNO", key: "fno" },
                { name: "CURRENCY", key: "currency" }, { name: "COMMODITY", key: "commodity" }
            ],
            ORDER_BOOK: {
                ORDER_TRAIL: "ORDER TRAIL",
                ORD_REF_NO: "ORD. REF NO",
                TRIGGER_PRICE_SL: "TRIGGER PRICE SL",
                TARGET_PRICE: "TARGET PRICE",
                ORDER_TRAIL_COLUMNS: {
                    action: "ACTION",
                    tradeQty: "TRADE QTY",
                    ordQty: "ORD QTY",
                    prodType: "PRODUCT TYPE",
                    price: "PRICE"
                },
                CANCEL_BUY_ORDER: "CANCEL BUY ORDER",
                CANCEL_SELL_ORDER: "CANCEL SELL ORDER",
                QTY: "QTY",
                PRICE: "Price",
                ORDER_ID: "ORDER ID",
                QTY_RS: "qty at RS.",
                MODIFIED_BY: "modified by",
                STATUS: [{ name: "ALL STATUS", key: "all" }, { name: "EXECUTED", key: "executed" },
                    { name: "PENDING", key: "pending" }, { name: "REJECTED", key: "rejected" },
                    { name: "CANCELLED", key: "cancelled" }
                ],
                ORDER_BOOK_COLUMNS: {
                    symbol: "SYMBOL",
                    action: "ACTION",
                    ordType: "ORDER TYPE",
                    price: "PRICE",
                    penQty: "PENDING QTY",
                    totQty: "TOTAL QTY",
                    intOrdNo: "INT. ORD. NO",
                    intOrdTime: "INT. ORD. TIME",
                    trigPri: "TRIGGER PRICE",
                    status: "STATUS"
                },
                ORDER_DETAIL_COLUMN: {
                    prodType: "PRODUCT TYPE",
                    series: "SERIES",
                    exeQty: "EXECUTED QTY",
                    disClsQty: "DISCLOSED QTY",
                    modBy: "MODIFIEDBY",
                    validity: "VALIDITY",
                    amoOrdId: "AMO.ORD.ID",
                    ordValue: "ORDER VALUE",
                    exchOrdId: "EXCH.ORD.ID",
                    exchTime: "EXCHANGE TIME"
                },
                BO_ORD_TRIG_COLUMN: {
                    action: "ACTION",
                    prodType: "PRODUCT TYPE",
                    stopLossPrice: "STOPLOSS PRICE",
                    qty: "QTY",
                    trailingSl: "TRAILING SL",
                    rmngQty: "RMNG.QTY",
                    status: "STATUS"
                },
                BO_ORD_TARG_COLUMN: {
                    action: "ACTION",
                    prodType: "PRODUCT TYPE",
                    targetPrice: "TARGET PRICE",
                    qty: "QTY",
                    rmngQty: "RMNG.QTY",
                    status: "STATUS"
                },
                BO_CO_ORD_COLUMN: {
                    ordRefNo: "ORDER REF NO.",
                    exchOrdNo: "EXCH ORDER NO.",
                    qty: "QTY",
                    price: "PRICE",
                    status: "STATUS",
                    ordTime: "ORDER TIME"
                },
                CO_ORD_TRIG_COLUMN: {
                    action: "ACTION",
                    prodType: "PRODUCT TYPE",
                    targetPrice: "TARGET PRICE",
                    qty: "QTY",
                    pendQty: "PEND.QTY",
                    status: "STATUS"
                },
            },
            TRADE_BOOK: {
                TRADE_SUMMARY: "TRADE SUMMARY",
                START_DATE: "Start Date",
                END_DATE: "End Date",
                TRADE_BOOK_COLUMNS: {
                    symbol: "SYMBOL",
                    action: "ACTION",
                    ordId: "ORDER ID",
                    qty: "QTY",
                    avgPrice: "AVG PRICE",
                    trades: "TRADES",
                    prodType: "PRODUCT TYPE",
                    tradeId: "TRADE ID",
                    exchOrdId: "EXCH. ORDER ID",
                    exchOrdTime: "EXCH. ORDER TIME"
                },
                // TRADE_SUMMARY_COLUMNS: {
                //     ordId: "ORDER ID",
                //     action: "ACTION",
                //     qty: "QTY",
                //     price: "PRICE",
                //     prodType: "PRODUCT TYPE",
                //     prodType: "ORDER TIME "
                // }
            },
            NET_POSITION: {
                TODAY_PL: "Today P&L",
                INTRADAY: "INTRADAY",
                TYPE: "TYPE",
                PRODUCT: "PRODUCT",
                QUANTITY: "QUANTITY",
                NET_POSITION_COLUMNS: {
                    symbol: "SYMBOL",
                    action: "ACTION",
                    pal: "P&L",
                    mtm: "MTM",
                    netQty: "NET QTY",
                    avgPrice: "AVG. PRICE",
                    ltp: 'LTP',
                    chg: 'CHG',
                    chgPer: 'CHG %',
                    productType: 'PRODUCT TYPE'
                },
                POSITION_DETAIL_COLUMNS: {
                    openVal: "OPEN VALUE",
                    marketVal: "MARKET VALUE",
                    buyQty: "BUY QTY",
                    buyAvg: "BUY AVG",
                    buyVal: "BUY VALUE",
                    sellQty: "SELL QTY",
                    sellAvg: "SELL AVG",
                    sellVal: "SELL VALUE"
                },
                PRODTYPE: [{ name: "ALL", key: "all" }, { name: "NET PROFIT", key: "profit" },
                    { name: "NET LOSS", key: "loss" }],
                EXCHANGE: [{ name: "ALL EXCHANGE", key: "all" }, { name: "NSE", key: "nse" },
                    { name: "BSE", key: "bse" },
                    { name: "ICEX", key: "icex" }, { name: "MSEI", key: "msei" }, { name: "MCX", key: "mcx" }
                ],
                SEGMENT: [{ name: "ALL SEGMENT", key: "all" }, { name: "EQUITY", key: "equity" },
                    { name: "FNO", key: "fno" },
                    { name: "CURRENCY", key: "currency" }, { name: "COMMODITY", key: "commodity" }
                ],
                POSITION_CONVERSION: "POSITION CONVERSION",
                MIN_LOT: "Min Lot",
                STK: "STK",
                CNC: "CNC",
                MIS: "MIS",
                NRML: "NRML",
            }
        },
        HOLDINGS: {
            HOLDINGS: "HOLDINGS",
            MY_PORTFOLIO: "MY PORTFOLIO",
            LEAD_LAGG: "LEADERS & LAGGARDS",
            LEADERS: "LEADERS",
            LAGGARDS: "LAGGARDS",
            NEWS: "NEWS",
            SYMBOL: "SYMBOL",
            QTY: "QTY",
            PAL: "P/L (%)",
            PAL_PER: "P&L %",
            BUYAVG: "BUY AVG",
            TODAY_PAL: "Today P&L",
            TOTAL_PAL: "TOTAL P&L",
            TOTAL_INVESTED: "TOTAL INVESTED",
            CURRENT_VALUE: "CURRENT VALUE",
            HOLDINGS_COLUMNS: {
                symbol: "SYMBOL",
                qty: "QTY",
                buyAvg: "BUY AVG",
                buyVal: "BUY VALUE",
                prevClose: "PREV.CLOSE",
                ltp: "LTP",
                presVal: "PRESENT VALUE",
                totPal: "P/L",
                totPalPer: "P/L (%)",
                daysPal: "DAY'S P/L"
            }
        }
    },
    [hindiKey]: {
       
    }
}