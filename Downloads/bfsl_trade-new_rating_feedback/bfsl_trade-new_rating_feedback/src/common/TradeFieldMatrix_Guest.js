
export const TRADE_FIELD_MATRIX_OBJ_GUEST  =
{
    "NSE": {
        "intrument": ["STK"],
        "productTypes": ["DELIVERY", "INTRADAY"],
        "productTypesView": ["DELIVERY", "INTRADAY"],
        "DELIVERY": {
            "orderTypes": ["MARKET", "LIMIT"],
            "LIMIT": {
                "qty": true,
                "disQty": true,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": false
            },
            "MARKET": {
                "qty": true,
                "disQty": true,
                "price": false,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            },
        },
        "INTRADAY": {
            "orderTypes": ["MARKET", "LIMIT"],
            "LIMIT": {
                "qty": true,
                "disQty": true,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": false
            },
            "MARKET": {
                "qty": true,
                "disQty": true,
                "price": false,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            },
        },
    },
    "BSE": {
        "intrument": ["STK"],
        "productTypes": ["DELIVERY", "INTRADAY"],
        "productTypesView": ["DELIVERY", "INTRADAY"],
        "DELIVERY": {
            "orderTypes": ["MARKET", "LIMIT"],
            "LIMIT": {
                "qty": true,
                "disQty": true,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": false
            },
            "MARKET": {
                "qty": true,
                "disQty": true,
                "price": false,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        },
        "INTRADAY": {
            "orderTypes": ["MARKET", "LIMIT"],
            "LIMIT": {
                "qty": true,
                "disQty": true,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": false
            },
            "MARKET": {
                "qty": true,
                "disQty": true,
                "price": false,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            },
           
        }
    },
    "NFO": {
        "intrument": ["FUTSTK", "OPTSTK", "FUTIDX", "OPTIDX"],
        "productTypes": ["NORMAL", "INTRADAY"],
        "productTypesView": ["NORMAL", "INTRADAY"],
        "NORMAL": {
            "orderTypes": ["MARKET", "LIMIT"],
            "LIMIT": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": false
            },
            "MARKET": {
                "qty": true,
                "disQty": false,
                "price": false,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            },
        },
        "INTRADAY": {
            "orderTypes": ["MARKET", "LIMIT"],
            "LIMIT": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": false
            },
            "MARKET": {
                "qty": true,
                "disQty": false,
                "price": false,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        }
    }
}

export const TRADE_FIELD_MATRIX_OBJ_ORDER_MODIFY_INTRADAY_GUEST  =
{
    "NSE": {
        "intrument": ["STK"],
        "productTypes": ["DELIVERY", "INTRADAY"],
        "productTypesView": ["DELIVERY", "INTRADAY"],
    },
    "BSE": {
        "intrument": ["STK"],
        "productTypes": ["DELIVERY", "INTRADAY"],
        "productTypesView": ["DELIVERY", "INTRADAY"],
    },
    "NFO": {
        "intrument": ["STK"],
        "productTypes": ["DELIVERY", "INTRADAY"],
        "productTypesView": ["DELIVERY", "INTRADAY"],
    },
}

export const HIDDEN_FIELD_MATRIX_OBJ_GUEST  = {
    "NORMAL": {
        "LIMIT": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "show",
            "qty": "show",
            "disQty": "show",
            "price": "show",
            "AMO": "hide",
            "validity": "show",
            "triggerPrice": "hide",
            "stopLoss": "hide",
            "squareOff": "hide",
            "trailStopLoss": "hide",
            "mktPro": "hide"
        },
        "MARKET": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "show",
            "qty": "show",
            "price": "disabled",
            "mktPro": "hide"
        },
    },
    "INTRADAY": {
        "LIMIT": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "show",
            "qty": "show",
            "disQty": "show",
            "price": "show",
            "AMO": "hide",
            "validity": "show",
            "triggerPrice": "hide",
            "stopLoss": "hide",
            "squareOff": "hide",
            "trailStopLoss": "hide",
            "mktPro": "hide"
        },
        "MARKET": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "show",
            "qty": "show",
            "price": "disabled",
            "mktPro": "hide"
        },
    },
    "DELIVERY": {
        "LIMIT": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "show",
            "qty": "show",
            "disQty": "show",
            "price": "show",
            "AMO": "hide",
            "validity": "show",
            "triggerPrice": "hide",
            "stopLoss": "hide",
            "squareOff": "hide",
            "trailStopLoss": "hide",
            "mktPro": "hide"
        },
        "MARKET": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "show",
            "qty": "show",
            "price": "disabled",
            "mktPro": "hide"
        },
    },
}