
export const TRADE_FIELD_MATRIX_OBJ =
{
    "NSE": {
        "intrument": ["STK"],
        "productTypes": ["DELIVERY", "INTRADAY", "TNC", "MTF", "CO", "BO"],
        "productTypesView": ["DELIVERY", "MTF", "INTRADAY", "TNC"],
        "DELIVERY": {
            "orderTypes": ["MARKET", "LIMIT", "SL", "SL-M"],
            "LIMIT": {
                "qty": true,
                "disQty": true,
                "price": true,
                "AMO": true,
                "validity": ["DAY", "IOC"],
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
                "AMO": true,
                "validity": ["DAY", "IOC"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            },
            "SL": {
                "qty": true,
                "disQty": true,
                "price": true,
                "AMO": true,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": false
            },
            "SL-M": {
                "qty": true,
                "disQty": true,
                "price": false,
                "AMO": true,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        },
        "INTRADAY": {
            "orderTypes": ["MARKET", "LIMIT", "SL", "SL-M"],
            "LIMIT": {
                "qty": true,
                "disQty": true,
                "price": true,
                "AMO": true,
                "validity": ["DAY","IOC"],
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
                "AMO": true,
                "validity": ["DAY", "IOC"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            },
            "SL": {
                "qty": true,
                "disQty": true,
                "price": true,
                "AMO": true,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": false
            },
            "SL-M": {
                "qty": true,
                "disQty": true,
                "price": false,
                "AMO": true,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        },
        "TNC": {
            "orderTypes": ["MARKET", "LIMIT", "SL", "SL-M"],
            "LIMIT": {
                "qty": true,
                "disQty": true,
                "price": true,
                "AMO": true,
                "validity": ["DAY","IOC"],
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
                "AMO": true,
                "validity": ["DAY", "IOC"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            },
            "SL": {
                "qty": true,
                "disQty": true,
                "price": true,
                "AMO": true,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": false
            },
            "SL-M": {
                "qty": true,
                "disQty": true,
                "price": false,
                "AMO": true,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        },
        "MTF": {
            "orderTypes": ["MARKET", "LIMIT", "SL", "SL-M"],
            "LIMIT": {
                "qty": true,
                "disQty": true,
                "price": true,
                "AMO": true,
                "validity": ["DAY","IOC"],
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
                "AMO": true,
                "validity": ["DAY", "IOC"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            },
            "SL": {
                "qty": true,
                "disQty": true,
                "price": true,
                "AMO": true,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": false
            },
            "SL-M": {
                "qty": true,
                "disQty": true,
                "price": false,
                "AMO": true,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        },
        "BO": {
            "orderTypes": ["LIMIT", "SL"],
            "LIMIT": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": false,
                "stopLoss": true,
                "squareOff": true,
                "trailStopLoss": true,
                "mktPro": false
            },
            "SL": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": true,
                "squareOff": true,
                "trailStopLoss": true,
                "mktPro": false
            }
        },
        "CO": {
            "orderTypes": ["MARKET", "LIMIT"],
            "LIMIT": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": false,
                "stopLoss": true,
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
                "stopLoss": true,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        }
    },
    "BSE": {
        "intrument": ["STK"],
        "productTypes": ["DELIVERY", "INTRADAY", "TNC", "MTF", "BO", "CO"],
        "productTypesView": ["DELIVERY","MTF","INTRADAY","TNC"],
        "DELIVERY": {
            "orderTypes": ["MARKET", "LIMIT", "SL", "SL-M"],
            "LIMIT": {
                "qty": true,
                "disQty": true,
                "price": true,
                "AMO": true,
                "validity": ["DAY","IOC"],
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
                "AMO": true,
                "validity": ["DAY", "IOC"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            },
            "SL": {
                "qty": true,
                "disQty": true,
                "price": true,
                "AMO": true,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": false
            },
            "SL-M": {
                "qty": true,
                "disQty": true,
                "price": false,
                "AMO": true,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        },
        "INTRADAY": {
            "orderTypes": ["MARKET", "LIMIT", "SL", "SL-M"],
            "LIMIT": {
                "qty": true,
                "disQty": true,
                "price": true,
                "AMO": true,
                "validity": ["DAY","IOC"],
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
                "AMO": true,
                "validity": ["DAY", "IOC"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            },
            "SL": {
                "qty": true,
                "disQty": true,
                "price": true,
                "AMO": true,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": false
            },
            "SL-M": {
                "qty": true,
                "disQty": true,
                "price": false,
                "AMO": true,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        },
        "TNC": {
            "orderTypes": ["MARKET", "LIMIT", "SL", "SL-M"],
            "LIMIT": {
                "qty": true,
                "disQty": true,
                "price": true,
                "AMO": true,
                "validity": ["DAY","IOC"],
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
                "AMO": true,
                "validity": ["DAY", "IOC"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            },
            "SL": {
                "qty": true,
                "disQty": true,
                "price": true,
                "AMO": true,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": false
            },
            "SL-M": {
                "qty": true,
                "disQty": true,
                "price": false,
                "AMO": true,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        },
        "MTF": {
            "orderTypes": ["MARKET", "LIMIT", "SL", "SL-M"],
            "LIMIT": {
                "qty": true,
                "disQty": true,
                "price": true,
                "AMO": true,
                "validity": ["DAY","IOC"],
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
                "AMO": true,
                "validity": ["DAY", "IOC"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            },
            "SL": {
                "qty": true,
                "disQty": true,
                "price": true,
                "AMO": true,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": false
            },
            "SL-M": {
                "qty": true,
                "disQty": true,
                "price": false,
                "AMO": true,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        },
        "BO": {
            "orderTypes": ["LIMIT", "SL"],
            "LIMIT": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": false,
                "stopLoss": true,
                "squareOff": true,
                "trailStopLoss": true,
                "mktPro": false
            },
            "SL": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": true,
                "squareOff": true,
                "trailStopLoss": true,
                "mktPro": false
            }
        },
        "CO": {
            "orderTypes": ["MARKET", "LIMIT"],
            "LIMIT": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": false,
                "stopLoss": true,
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
                "stopLoss": true,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        }
    },
    "NFO": {
        "intrument": ["FUTSTK", "OPTSTK", "FUTIDX", "OPTIDX"],
        "productTypes": ["NORMAL", "INTRADAY", "BO", "CO"],
        "productTypesView": ["NORMAL", "INTRADAY"],
        "NORMAL": {
            "orderTypes": ["MARKET", "LIMIT", "SL", "SL-M"],
            "LIMIT": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": true,
                "validity": ["DAY","IOC"],
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
                "AMO": true,
                "validity": ["DAY", "IOC"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            },
            "SL": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": true,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": false
            },
            "SL-M": {
                "qty": true,
                "disQty": false,
                "price": false,
                "AMO": true,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        },
        "INTRADAY": {
            "orderTypes": ["MARKET", "LIMIT", "SL", "SL-M"],
            "LIMIT": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": true,
                "validity": ["DAY","IOC"],
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
                "AMO": true,
                "validity": ["DAY", "IOC"],
                "triggerPrice": false,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            },
            "SL": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": true,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": false
            },
            "SL-M": {
                "qty": true,
                "disQty": false,
                "price": false,
                "AMO": true,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        },
        "BO": {
            "orderTypes": ["LIMIT", "SL"],
            "LIMIT": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": false,
                "stopLoss": true,
                "squareOff": true,
                "trailStopLoss": true,
                "mktPro": false
            },
            "SL": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": true,
                "squareOff": true,
                "trailStopLoss": true,
                "mktPro": false
            }
        },
        "CO": {
            "orderTypes": ["MARKET", "LIMIT"],
            "LIMIT": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": false,
                "stopLoss": true,
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
                "stopLoss": true,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        }
    }
}

export const TRADE_FIELD_MATRIX_OBJ_ORDER_MODIFY_INTRADAY =
{
    "NSE": {
        "intrument": ["STK"],
        "productTypes": ["DELIVERY", "INTRADAY", "TNC", "MTF", "CO", "BO","BO_MAIN",
            "BO_SECOND", "BO_THIRD","BO_SECOND_SL","CO_MAIN","CO_SECOND"],
        "productTypesView": ["DELIVERY", "INTRADAY", "MTF","TNC"],
        "BO_MAIN": {
            "orderTypes": ["LIMIT", "SL"],
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
            "SL": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            },
            // "SL-M": {
            //     "qty": true,
            //     "disQty": false,
            //     "price": false,
            //     "AMO": false,
            //     "validity": ["DAY"],
            //     "triggerPrice": true,
            //     "stopLoss": false,
            //     "squareOff": false,
            //     "trailStopLoss": false,
            //     "mktPro": true
            // }
        },
        "BO_SECOND": {
            "orderTypes": ["SL-M"],
            "SL-M": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        },
        "BO_THIRD": {
            "orderTypes": ["LIMIT"],
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

        },
        "BO_SECOND_SL": {
            "orderTypes": [ "SL"],
            "SL": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        },
        "CO_MAIN": {
            "orderTypes": ["MARKET","LIMIT"],
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
        },
        "CO_SECOND": {
            "orderTypes": [ "SL-M"],
            "SL-M": {
                "qty": true,
                "disQty": false,
                "price": false,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        }
    },
    "BSE": {
        "intrument": ["STK"],
        "productTypes": ["DELIVERY", "INTRADAY", "TNC", "MTF", "CO", "BO","BO_MAIN",
            "BO_SECOND", "BO_THIRD","BO_SECOND_SL","CO_MAIN","CO_SECOND"],
        "productTypesView": ["DELIVERY", "INTRADAY", "MTF","TNC"],
        "BO_MAIN": {
            "orderTypes": ["LIMIT", "SL"],
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
            "SL": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            },
            // "SL-M": {
            //     "qty": true,
            //     "disQty": false,
            //     "price": false,
            //     "AMO": false,
            //     "validity": ["DAY"],
            //     "triggerPrice": true,
            //     "stopLoss": false,
            //     "squareOff": false,
            //     "trailStopLoss": false,
            //     "mktPro": true
            // }
        },
        "BO_SECOND": {
            "orderTypes": ["SL-M"],
            "SL-M": {
                "qty": true,
                "disQty": false,
                "price": false,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        },
        "BO_THIRD": {
            "orderTypes": ["LIMIT"],
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

        },
        "BO_SECOND_SL": {
            "orderTypes": [ "SL"],
            "SL": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        },
        "CO_MAIN": {
            "orderTypes": ["MARKET","LIMIT"],
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
        },
        "CO_SECOND": {
            "orderTypes": [ "SL-M"],
            "SL-M": {
                "qty": true,
                "disQty": false,
                "price": false,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        }
    },
    "NFO": {
        "intrument": ["STK"],
        "productTypes": ["DELIVERY", "INTRADAY", "TNC", "MTF", "CO", "BO", "BO_MAIN",
            "BO_SECOND", "BO_THIRD","BO_SECOND_SL","CO_MAIN","CO_SECOND"],
        "productTypesView": ["DELIVERY", "INTRADAY","MTF","TNC"],
        "BO_MAIN": {
            "orderTypes": ["LIMIT", "SL"],
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
            "SL": {
                "qty": true,
                "disQty": false,
                "price": false,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            },
            // "SL-M": {
            //     "qty": true,
            //     "disQty": false,
            //     "price": false,
            //     "AMO": false,
            //     "validity": ["DAY"],
            //     "triggerPrice": true,
            //     "stopLoss": false,
            //     "squareOff": false,
            //     "trailStopLoss": false,
            //     "mktPro": true
            // }
        },
        "BO_SECOND": {
            "orderTypes": ["SL-M"],
            "SL-M": {
                "qty": true,
                "disQty": false,
                "price": false,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            },
            // "SL": {
            //     "qty": true,
            //     "disQty": false,
            //     "price": true,
            //     "AMO": false,
            //     "validity": ["DAY"],
            //     "triggerPrice": true,
            //     "stopLoss": false,
            //     "squareOff": false,
            //     "trailStopLoss": false,
            //     "mktPro": true
            // }
        },
        "BO_THIRD": {
            "orderTypes": ["LIMIT"],
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
            }
        },
        "BO_SECOND_SL": {
            "orderTypes": [ "SL"],
            "SL": {
                "qty": true,
                "disQty": false,
                "price": true,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        },
        "CO_MAIN": {
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
        },
        "CO_SECOND": {
            "orderTypes": [ "SL-M"],
            "SL-M": {
                "qty": true,
                "disQty": false,
                "price": false,
                "AMO": false,
                "validity": ["DAY"],
                "triggerPrice": true,
                "stopLoss": false,
                "squareOff": false,
                "trailStopLoss": false,
                "mktPro": true
            }
        }
    },
}

export const HIDDEN_FIELD_MATRIX_OBJ = {
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
        "SL": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "show",
            "qty": "show",
            "disQty": "show",
            "price": "show",
            "AMO": "hide",
            "validity": "show",
            "triggerPrice": "show",
            "stopLoss": "hide",
            "squareOff": "hide",
            "trailStopLoss": "hide",
            "mktPro": "hide"
        },
        "SL-M": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "show",
            "qty": "show",
            "disQty": "show",
            "price": "disabled",
            "AMO": "hide",
            "validity": "show",
            "triggerPrice": "show",
            "stopLoss": "hide",
            "squareOff": "hide",
            "trailStopLoss": "hide",
            "mktPro": "hide"
        }
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
        "SL": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "show",
            "qty": "show",
            "disQty": "show",
            "price": "show",
            "AMO": "hide",
            "validity": "show",
            "triggerPrice": "show",
            "stopLoss": "hide",
            "squareOff": "hide",
            "trailStopLoss": "hide",
            "mktPro": "hide"
        },
        "SL-M": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "show",
            "qty": "show",
            "disQty": "show",
            "price": "disabled",
            "AMO": "hide",
            "validity": "show",
            "triggerPrice": "show",
            "stopLoss": "hide",
            "squareOff": "hide",
            "trailStopLoss": "hide",
            "mktPro": "hide"
        }
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
        "SL": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "show",
            "qty": "show",
            "disQty": "show",
            "price": "show",
            "AMO": "hide",
            "validity": "show",
            "triggerPrice": "show",
            "stopLoss": "hide",
            "squareOff": "hide",
            "trailStopLoss": "hide",
            "mktPro": "hide"
        },
        "SL-M": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "show",
            "qty": "show",
            "disQty": "show",
            "price": "disabled",
            "AMO": "hide",
            "validity": "show",
            "triggerPrice": "show",
            "stopLoss": "hide",
            "squareOff": "hide",
            "trailStopLoss": "hide",
            "mktPro": "hide"
        }
    },
    "BO": {
        "LIMIT": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "disabled",
            "qty": "disabled",
            "disQty": "hide",
            "price": "show",
            "AMO": "hide",
            "validity": "disabled",
            "triggerPrice": "hide",
            "stopLoss": "hide",
            "squareOff": "hide",
            "trailStopLoss": "hide",
            "mktPro": "hide"
        },
        "SL": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "disabled",
            "qty": "disabled",
            "disQty": "hide",
            "price": "show",
            "AMO": "hide",
            "validity": "disabled",
            "triggerPrice": "show",
            "stopLoss": "hide",
            "squareOff": "hide",
            "trailStopLoss": "hide",
            "mktPro": "show"
        },
        "SL-M": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "disabled",
            "qty": "disabled",
            "disQty": "hide",
            "price": "show",
            "AMO": "hide",
            "validity": "disabled",
            "triggerPrice": "show",
            "stopLoss": "hide",
            "squareOff": "hide",
            "trailStopLoss": "hide",
            "mktPro": "show"
        }
    },
    "CO": {
        "LIMIT": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "disabled",
            "qty": "disabled",
            "disQty": "hide",
            "price": "show",
            "AMO": "hide",
            "validity": "disabled",
            "triggerPrice": "hide",
            "stopLoss": "hide",
            "squareOff": "hide",
            "trailStopLoss": "hide",
            "mktPro": "hide"
        },
        "SL-M": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "disabled",
            "qty": "disabled",
            "disQty": "hide",
            "price": "disabled",
            "AMO": "hide",
            "validity": "disabled",
            "triggerPrice": "show",
            "stopLoss": "hide",
            "squareOff": "hide",
            "trailStopLoss": "hide",
            "mktPro": "show"
        },
        "MARKET": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "show",
            "qty": "disabled",
            "price": "disabled",
            "mktPro": "hide"
        },
    },
    "TNC": {
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
        "SL": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "show",
            "qty": "show",
            "disQty": "show",
            "price": "show",
            "AMO": "hide",
            "validity": "show",
            "triggerPrice": "show",
            "stopLoss": "hide",
            "squareOff": "hide",
            "trailStopLoss": "hide",
            "mktPro": "show"
        },
        "SL-M": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "show",
            "qty": "show",
            "disQty": "show",
            "price": "disabled",
            "AMO": "hide",
            "validity": "show",
            "triggerPrice": "show",
            "stopLoss": "hide",
            "squareOff": "hide",
            "trailStopLoss": "hide",
            "mktPro": "show"
        }
    },
    "MTF": {
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
        "SL": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "show",
            "qty": "show",
            "disQty": "show",
            "price": "show",
            "AMO": "hide",
            "validity": "show",
            "triggerPrice": "show",
            "stopLoss": "hide",
            "squareOff": "hide",
            "trailStopLoss": "hide",
            "mktPro": "hide"
        },
        "SL-M": {
            "action": "disabled",
            "producType": "disabled",
            "orderType": "show",
            "qty": "show",
            "disQty": "show",
            "price": "disabled",
            "AMO": "hide",
            "validity": "show",
            "triggerPrice": "show",
            "stopLoss": "hide",
            "squareOff": "hide",
            "trailStopLoss": "hide",
            "mktPro": "hide"
        }
    }
}

export const HIDDEN_FIELD_MATRIX_OBJ2 = {
    "DELIVERY": {
        "LIMIT": {
            "GTD": {
                "action": "disabled",
                "producType": "disabled",
                "orderType": "show",
                "qty": "show",
                "disQty": "show",
                "price": "show",
                "AMO": "hide",
                "validity": "disabled",
                "triggerPrice": "hide",
                "stopLoss": "hide",
                "squareOff": "hide",
                "trailStopLoss": "hide",
                "mktPro": "hide"
            },
            "GTC": {
                "action": "disabled",
                "producType": "disabled",
                "orderType": "show",
                "qty": "show",
                "disQty": "show",
                "price": "show",
                "AMO": "hide",
                "validity": "disabled",
                "triggerPrice": "hide",
                "stopLoss": "hide",
                "squareOff": "hide",
                "trailStopLoss": "hide",
                "mktPro": "hide"
            }
        },
        "SL": {
            "GTD" : {
                "action": "disabled",
                "producType": "disabled",
                "orderType": "show",
                "qty": "show",
                "disQty": "show",
                "price": "show",
                "AMO": "hide",
                "validity": "disabled",
                "triggerPrice": "show",
                "stopLoss": "hide",
                "squareOff": "hide",
                "trailStopLoss": "hide",
                "mktPro": "hide"
            },
            "GTC" : {
                "action": "disabled",
                "producType": "disabled",
                "orderType": "show",
                "qty": "show",
                "disQty": "show",
                "price": "show",
                "AMO": "hide",
                "validity": "disabled",
                "triggerPrice": "show",
                "stopLoss": "hide",
                "squareOff": "hide",
                "trailStopLoss": "hide",
                "mktPro": "hide"
            },
        }
    },
    "TNC": {
        "LIMIT": {
            "GTD" : {
                "action": "disabled",
                "producType": "disabled",
                "orderType": "show",
                "qty": "show",
                "disQty": "show",
                "price": "show",
                "AMO": "hide",
                "validity": "disabled",
                "triggerPrice": "hide",
                "stopLoss": "hide",
                "squareOff": "hide",
                "trailStopLoss": "hide",
                "mktPro": "hide"
            },
            "GTC" : {
                "action": "disabled",
                "producType": "disabled",
                "orderType": "show",
                "qty": "show",
                "disQty": "show",
                "price": "show",
                "AMO": "hide",
                "validity": "disabled",
                "triggerPrice": "hide",
                "stopLoss": "hide",
                "squareOff": "hide",
                "trailStopLoss": "hide",
                "mktPro": "hide"
            }
        },
        "SL": {
            "GTD" : {
                "action": "disabled",
                "producType": "disabled",
                "orderType": "show",
                "qty": "show",
                "disQty": "show",
                "price": "show",
                "AMO": "hide",
                "validity": "disabled",
                "triggerPrice": "show",
                "stopLoss": "hide",
                "squareOff": "hide",
                "trailStopLoss": "hide",
                "mktPro": "hide"
            },
            "GTC" : {
                "action": "disabled",
                "producType": "disabled",
                "orderType": "show",
                "qty": "show",
                "disQty": "show",
                "price": "show",
                "AMO": "hide",
                "validity": "disabled",
                "triggerPrice": "show",
                "stopLoss": "hide",
                "squareOff": "hide",
                "trailStopLoss": "hide",
                "mktPro": "hide"
            },
        }
    },
    "MTF": {
        "LIMIT": {
            "GTD": {
                "action": "disabled",
                "producType": "disabled",
                "orderType": "show",
                "qty": "show",
                "disQty": "show",
                "price": "show",
                "AMO": "hide",
                "validity": "disabled",
                "triggerPrice": "hide",
                "stopLoss": "hide",
                "squareOff": "hide",
                "trailStopLoss": "hide",
                "mktPro": "hide"
            },
            "GTC": {
                "action": "disabled",
                "producType": "disabled",
                "orderType": "show",
                "qty": "show",
                "disQty": "show",
                "price": "show",
                "AMO": "hide",
                "validity": "disabled",
                "triggerPrice": "hide",
                "stopLoss": "hide",
                "squareOff": "hide",
                "trailStopLoss": "hide",
                "mktPro": "hide"
            },
        },
        "SL": {
            "GTD": {
                "action": "disabled",
                "producType": "disabled",
                "orderType": "show",
                "qty": "show",
                "disQty": "show",
                "price": "show",
                "AMO": "hide",
                "validity": "disabled",
                "triggerPrice": "show",
                "stopLoss": "hide",
                "squareOff": "hide",
                "trailStopLoss": "hide",
                "mktPro": "hide"
            },
            "GTC": {
                "action": "disabled",
                "producType": "disabled",
                "orderType": "show",
                "qty": "show",
                "disQty": "show",
                "price": "show",
                "AMO": "hide",
                "validity": "disabled",
                "triggerPrice": "show",
                "stopLoss": "hide",
                "squareOff": "hide",
                "trailStopLoss": "hide",
                "mktPro": "hide"
            },
        }
    }
}