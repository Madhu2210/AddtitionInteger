export const SCANNERS = {

    "Custom Scanners": {
        "apiUrl": "/Screener/ScreenerService/1.0.0",
        "langKey":{
            "key":"CUSTOM_SCANNERS",
            "head":"Custom Scanners",
        },
        "screenerList": [
            {
                "name": "BULLISH BREAKOUT",
                "langKey": "BULLISH_BREAKOUT",
                "value": "bullishBreakout",
                "description": {
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"BULLISH_BREAKOUT_POINT1",
                    "langKey2":"BULLISH_BREAKOUT_POINT2",
                },
                "indicators": [
                    {
                        "dispName": "20 SMA",
                        "langKey": "20_SMA",
                        "indicatorName": "SMA20",
                        "columns": [
                            {
                                "dispName": "20 SMA",
                                "langKey": "20_SMA_SCANNERS_THEAD",
                                "key": "SMA20"
                            },
                            {
                                "dispName": "ADX",
                                "langKey": "ADX_SCANNERS_THEAD",
                                "key": "ADX25"
                            }
                        ]
                    },
                    {
                        "dispName": "50 SMA",
                        "langKey": "50_SMA",
                        "indicatorName": "SMA50",
                        "columns": [
                            {
                                "dispName": "50 SMA",
                                "langKey": "50_SMA_SCANNERS_THEAD",
                                "key": "SMA50"
                            },
                            {
                                "dispName": "ADX",
                                "langKey": "ADX_SCANNERS_THEAD",
                                "key": "ADX25"
                            }
                        ]
                    },
                    {
                        "dispName": "100 SMA",
                        "langKey": "100_SMA",
                        "indicatorName": "SMA100",
                        "columns": [
                            {
                                "dispName": "100 SMA",
                                "langKey": "100_SMA_SCANNERS_THEAD",
                                "key": "SMA100"
                            },
                            {
                                "dispName": "ADX",
                                "langKey": "ADX_SCANNERS_THEAD",
                                "key": "ADX25"
                            }
                        ]
                    },
                    {
                        "dispName": "200 SMA",
                        "langKey": "200_SMA",
                        "indicatorName": "SMA200",
                        "columns": [
                            {
                                "dispName": "200 SMA",
                                "langKey": "200_SMA_SCANNERS_THEAD",
                                "key": "SMA200"
                            },
                            {
                                "dispName": "ADX",
                                "langKey": "ADX_SCANNERS_THEAD",
                                "key": "ADX25"
                            }
                        ]
                    },
                    {
                        "dispName": "20 EMA",
                        "langKey": "20_EMA",
                        "indicatorName": "EMA20",
                        "columns": [
                            {
                                "dispName": "20 EMA",
                                "langKey": "20_EMA_SCANNERS_THEAD",
                                "key": "EMA20"
                            },
                            {
                                "dispName": "ADX",
                                "langKey": "ADX_SCANNERS_THEAD",
                                "key": "ADX25"
                            }
                        ]
                    },
                    {
                        "dispName": "50 EMA",
                        "langKey": "50_EMA",
                        "indicatorName": "EMA50",
                        "columns": [
                            {
                                "dispName": "50 EMA",
                                "langKey": "50_EMA_SCANNERS_THEAD",
                                "key": "EMA50"
                            },
                            {
                                "dispName": "ADX",
                                "langKey": "ADX_SCANNERS_THEAD",
                                "key": "ADX25"
                            }
                        ]
                    },
                    {
                        "dispName": "100 EMA",
                        "langKey": "100_EMA",
                        "indicatorName": "EMA100",
                        "columns": [
                            {
                                "dispName": "100 EMA",
                                "langKey": "100_EMA_SCANNERS_THEAD",
                                "key": "EMA100"
                            },
                            {
                                "dispName": "ADX",
                                "langKey": "ADX_SCANNERS_THEAD",
                                "key": "ADX25"
                            }
                        ]
                    },
                    {
                        "dispName": "200 EMA",
                        "langKey": "200_EMA",
                        "indicatorName": "EMA200",
                        "columns": [
                            {
                                "dispName": "200 EMA",
                                "langKey": "200_EMA_SCANNERS_THEAD",
                                "key": "EMA200"
                            },
                            {
                                "dispName": "ADX",
                                "langKey": "ADX_SCANNERS_THEAD",
                                "key": "ADX25"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "BEARISH BREAKDOWN",
                "langKey": "BEARISH_BREAKDOWN",
                "value": "bearishBreakout",
                "description": 
                {
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"BULLISH_BREAKOUT_POINT1",
                    "langKey2":"BEARISH_BREAKDOWN_POINT2",
                },
                // "<div> <p>This scanner lists down all the stocks which satisfy the below criteria</p> <ol> <li>The LTP crosses below the selected <a href='https://www.investopedia.com/terms/s/sma.asp' target='_blank'>SMA</a> or <a href='https://www.investopedia.com/terms/e/ema.asp' target='_blank'>EMA</a></li> <li>The 25 day <a href='https://www.investopedia.com/articles/trading/07/adx-trend-indicator.asp' target='_blank'>ADX</a> has a value lesser than 25</li> </ol> </div>",
                "indicators": [
                    {
                        "dispName": "20 SMA",
                        "langKey": "20_SMA",
                        "indicatorName": "SMA20",
                        "columns": [
                            {
                                "dispName": "20 SMA",
                                "langKey": "20_SMA_SCANNERS_THEAD",
                                "key": "SMA20"
                            },
                            {
                                "dispName": "ADX",
                                "langKey": "ADX_SCANNERS_THEAD",
                                "key": "ADX25"
                            }
                        ]
                    },
                    {
                        "dispName": "50 SMA",
                        "langKey": "50_SMA",
                        "indicatorName": "SMA50",
                        "columns": [
                            {
                                "dispName": "50 SMA",
                                "langKey": "50_SMA_SCANNERS_THEAD",
                                "key": "SMA50"
                            },
                            {
                                "dispName": "ADX",
                                "langKey": "ADX_SCANNERS_THEAD",
                                "key": "ADX25"
                            }
                        ]
                    },
                    {
                        "dispName": "100 SMA",
                        "langKey": "100_SMA",                  
                        "indicatorName": "SMA100",
                        "columns": [
                            {
                                "dispName": "100 SMA",
                                "langKey": "100_SMA_SCANNERS_THEAD",                  
                                "key": "SMA100"
                            },
                            {
                                "dispName": "ADX",
                                "langKey": "ADX_SCANNERS_THEAD",                  
                                "key": "ADX25"
                            }
                        ]
                    },
                    {
                        "dispName": "200 SMA",
                        "langKey": "200_SMA",                  
                        "indicatorName": "SMA200",
                        "columns": [
                            {
                                "dispName": "200 SMA",
                                "langKey": "200_SMA_SCANNERS_THEAD",                  
                                "key": "SMA200"
                            },
                            {
                                "dispName": "ADX",
                                "langKey": "ADX_SCANNERS_THEAD",                  
                                "key": "ADX25"
                            }
                        ]
                    },
                    {
                        "dispName": "20 EMA",
                        "langKey": "20_EMA",                  
                        "indicatorName": "EMA20",
                        "columns": [
                            {
                                "dispName": "20 EMA",
                                "langKey": "20_EMA_SCANNERS_THEAD",                  
                                "key": "EMA20"
                            },
                            {
                                "dispName": "ADX",
                                "langKey": "ADX_SCANNERS_THEAD",                  
                                "key": "ADX25"
                            }
                        ]
                    },
                    {
                        "dispName": "50 EMA",
                        "langKey": "50_EMA",                  
                        "indicatorName": "EMA50",
                        "columns": [
                            {
                                "dispName": "50 EMA",
                                "langKey": "50_EMA_SCANNERS_THEAD",                  
                                "key": "EMA50"
                            },
                            {
                                "dispName": "ADX",
                                "langKey": "ADX_SCANNERS_THEAD",                  
                                "key": "ADX25"
                            }
                        ]
                    },
                    {
                        "dispName": "100 EMA",
                        "langKey": "100_EMA",                  
                        "indicatorName": "EMA100",
                        "columns": [
                            {
                                "dispName": "100 EMA",
                                "langKey": "100_EMA_SCANNERS_THEAD",                  
                                "key": "EMA100"
                            },
                            {
                                "dispName": "ADX",
                                "langKey": "ADX_SCANNERS_THEAD",                  
                                "key": "ADX25"
                            }
                        ]
                    },
                    {
                        "dispName": "200 EMA",
                        "langKey": "200_EMA",                  
                        "indicatorName": "EMA200",
                        "columns": [
                            {
                                "dispName": "200 EMA",
                                "langKey": "200_EMA_SCANNERS_THEAD",                  
                                "key": "EMA200"
                            },
                            {
                                "dispName": "ADX",
                                "langKey": "ADX_SCANNERS_THEAD",                  
                                "key": "ADX25"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "GOLDEN CROSSOVER - BULLISH",
                "langKey": "GOLDEN_CROSSOVER_BULLISH",
                "value": "goldenCrossoverBullish",
                "description":{
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"GOLDEN_CROSS_BULL_BEAR_POINT1",
                    "langKey2":"BULLISH_BREAKOUT_POINT2",
                           
                }, 
                "columns": [
                    {
                        "dispName": "50 SMA",
                        "langKey": "50_SMA_SCANNERS_THEAD",                  
                        "key": "SMA50"
                    },
                    {
                        "dispName": "100 SMA",
                        "langKey": "100_SMA_SCANNERS_THEAD",                  
                        "key": "SMA100"
                    },
                    {
                        "dispName": "200 SMA",
                        "langKey": "200_SMA_SCANNERS_THEAD",                  
                        "key": "SMA200"
                    },
                    {
                        "dispName": "ADX",
                        "langKey": "ADX_SCANNERS_THEAD",                  
                        "key": "ADX25"
                    }
                ]
            },
            {
                "name": "GOLDEN CROSSOVER - BEARISH",
                "langKey": "GOLDEN_CROSSOVER_BEARISH",
                "value": "goldenCrossoverBearish",
                "description": {
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"GOLDEN_CROSS_BULL_BEAR_POINT1",
                    "langKey2":"BEARISH_BREAKDOWN_POINT2",
                },
                "columns": [
                    {
                        "dispName": "50 SMA",
                        "langKey": "50_SMA_SCANNERS_THEAD",                  
                        "key": "SMA50"
                    },
                    {
                        "dispName": "100 SMA",
                        "langKey": "100_SMA_SCANNERS_THEAD",                  
                        "key": "SMA100"
                    },
                    {
                        "dispName": "200 SMA",
                        "langKey": "200_SMA_SCANNERS_THEAD",                  
                        "key": "SMA200"
                    },
                    {
                        "dispName": "ADX",
                        "langKey": "ADX_SCANNERS_THEAD",                  
                        "key": "ADX25"
                    }
                ]
            },
            {
                "name": "LONG TIME HIGH",
                "langKey": "LONG_TIME_HIGH",               
                "value": "longTimeHigh",
                "description": {
                    "langKey": "SCANNERS_DESCRIPTION1",
                    "langKey1": "LONG_TIME_HIGH_DESCRIPTION1",
                   
                },
                "columns": [
                    {
                        "dispName": "52 Week High",
                        "langKey": "52_WEEK_HIGH_SCANNERS_THEAD",                  
                        "key": "52_WK_HIGH"
                    }
                ]
            },
            {
                "name": "LONG TIME LOW",
                "langKey": "LONG_TIME_LOW",               
                "value": "longTimeLow",
                "description": {
                    "langKey": "SCANNERS_DESCRIPTION1",
                    "langKey1": "LONG_TIME_LOW_DESCRIPTION1",
                  
                },
                "columns": [
                    {
                        "dispName": "52 Week Low",
                        "langKey": "52_WEEK_LOW_SCANNERS_THEAD",                  
                        "key": "52_WK_LOW"
                    }
                ]
            },
            {
                "name": "PREVIOUS DAY BREAKOUT- BULLISH",
                "langKey": "PREV_DAY_BREAKOUT_BULLISH",               
                "value": "PREV_DAY_BREAKOUT_BULLISH",
                "description": {
                    "langKey": "SCANNERS_DESCRIPTION1",
                    "langKey1": "PREV_DAY_BREAKOUT_BULLISH_DESCRIPTION1",
                },
                "columns": [
                    {
                        "dispName": "Open",
                        "langKey": "OPEN_SCANNERS_THEAD",                  
                        "key": "open"
                    },
                    {
                        "dispName": "Prev.High",
                        "langKey": "PREV_HIGH_SCANNERS_THEAD",
                        "key": "PREV_HIGH"
                    }
                ]
            },
            {
                "name": "PREVIOUS DAY BREAKOUT- BEARISH",
                "langKey": "PREV_DAY_BREAKOUT_BEARISH",
                "value": "PREV_DAY_BREAKOUT_BEARISH",
                "description": {
                    "langKey": "SCANNERS_DESCRIPTION1",
                    "langKey1":"PREV_DAY_BREAKOUT_BEARISH_DESCRIPTION1"
                },
                "columns": [
                    {
                        "dispName": "Open",
                        "langKey": "OPEN_SCANNERS_THEAD",
                        "key": "open"
                    },
                    {
                        "dispName": "Prev.Low",
                        "langKey": "PREV_LOW_SCANNERS_THEAD",
                        "key": "PREV_LOW"
                    }
                ]
            },
            {
                "name": "BULLISH MOMENTUM",
                "langKey": "BULLISH_MOMENTUM",
                "value": "bullishMomentum",
                "description": {
                    "langKey": "SCANNERS_DESCRIPTION1",
                    "langKey1": "BULLISH_MOMENTUM_DESCRIPTION1",
                    "langKey2": "BULLISH_MOMENTUM_DESCRIPTION2",
                },
                "columns": [
                    {
                        "dispName": "RSI 20",
                        "langKey": "RSI_20_SCANNERS_THEAD",
                        "key": "RSI20"
                    },
                    {
                        "dispName": "Bollinger Band",
                        "langKey": "BOLLINGER_BAND_SCANNERS_THEAD",
                        "key": "BBAND"
                    }
                ]
            },
            {
                "name": "BEARISH MOMENTUM",
                "langKey": "BEARISH_MOMENTUM",
                "value": "bearishMomentum",
                "description": {
                    "langKey": "SCANNERS_DESCRIPTION1",
                    "langKey1": "BEARISH_MOMENTUM_DESCRIPTION1",
                    "langKey2": "BEARISH_MOMENTUM_DESCRIPTION2",
                },
                "columns": [
                    {
                        "dispName": "RSI 20",
                        "langKey": "RSI_20_SCANNERS_THEAD",
                        "key": "RSI20"
                    },
                    {
                        "dispName": "Bollinger Band",
                        "langKey": "BOLLINGER_BAND_SCANNERS_THEAD",
                        "key": "BBAND"
                    }
                ]
            },
            // {
            //     "name": "Intraday Trader's Delight - Bullish",
            //     "value": "intradayTradersDelightBullish",
            //     "description": "<div><p>This scanner lists down all the stocks which satisfy the below criteria</p>"
            //         + "<ol><li>Today's Open Price = Low Price</li>"
            //         + "<li> Positive close for the last three days.& nbsp;</li></ol ></div> ",
            //     "columns": [
            //         "3 DAY POSITIVE CLOSE",
            //         "TODAY'S OPEN = LOW"
            //     ]
            // },
            // {
            //     "name": "Intraday Trader's Delight - Bearish",
            //     "value": "intradayTradersDelightBearish",
            //     "description": "<div><p>This scanner lists down all the stocks which satisfy the below criteria</p>"
            //         + "<ol><li>Today's Open Price = High Price</li>"
            //         + "<li> Negative close for the last three days.& nbsp;</li></ol></div> ",
            //     "columns": [
            //         "3 DAY NEGATIVE CLOSE",
            //         "TODAY'S OPEN = HIGH"
            //     ]
            // },
            {
                "name": "BULLISH PRICE VOLUME BREAKERS",
                "langKey": "BULLISH_PRICE_VOLUME_BREAKERS",
                "value": "bullishPriceVolumeBreaker",
                "description": {
                    "langKey": "SCANNERS_DESCRIPTION1",
                    "langKey1": "BULLISH_PRICE_VOLUME_BREAKERS_DESCRIPTION1",
                    "langKey2": "BULLISH_PRICE_VOLUME_BREAKERS_DESCRIPTION2",
                },
                "columns": [
                    {
                        "dispName": "Total Volume",
                        "langKey": "TOTAL_VOLUME_SCANNERS_THEAD",
                        "key": "TOTAL_VOLUME"
                    },
                    {
                        "dispName": " 10 day Avg. Vol.",
                        "langKey": "AVG_VOLUME_SCANNERS_THEAD",
                        "key": "AVG_VOLUME"
                    }
                ]
            },
            {
                "name": "BEARISH PRICE VOLUME BREAKERS",
                "langKey": "BEARISH_PRICE_VOLUME_BREAKERS",
                "value": "bearishPriceVolumeBreaker",
                "description": {
                    "langKey": "SCANNERS_DESCRIPTION1",
                    "langKey1": "BEARISH_PRICE_VOLUME_BREAKERS_DESCRIPTION1",
                    "langKey2": "BULLISH_PRICE_VOLUME_BREAKERS_DESCRIPTION2",
                },
                "columns": [
                    {
                        "dispName": "Total Volume",
                        "langKey": "TOTAL_VOLUME_SCANNERS_THEAD",
                        "key": "TOTAL_VOLUME"
                    },
                    {
                        "dispName": "10 day Avg. Vol.",
                        "langKey": "AVG_VOLUME_SCANNERS_THEAD",
                        "key": "AVG_VOLUME"
                    }
                ]
            },
            {
                "name": "BULLISH MID FIELDERS",
                "langKey": "BULLISH_MID_FIELDERS",
                "value": "bullishMidFielders",
                "description": {
                    "langKey": "SCANNERS_DESCRIPTION1",
                    "langKey1": "BULLISH_MID_FIELDERS_DESCRIPTION1",
                    "langKey2": "BULLISH_MID_FIELDERS_DESCRIPTION2",
                    "langKey3": "BULLISH_MID_FIELDERS_DESCRIPTION3",
                },
                "columns": [
                    {
                        "dispName": "Total Volume",
                        "langKey": "TOTAL_VOLUME_SCANNERS_THEAD",
                        "key": "TOTAL_VOLUME"
                    },
                    {
                        "dispName": " 10 day Avg. Vol.",
                        "langKey": "10_DAY_AVG_VOLUME_SCANNERS_THEAD",
                        "key": "AVG_VOLUME"
                    },
                    {
                        "dispName": "RSI 20",
                        "langKey": "RSI_20_SCANNERS_THEAD",
                        "key": "RSI20"
                    }
                ]
            },
            {
                "name": "BEARISH MID FIELDERS",
                "langKey": "BEARISH_MID_FIELDERS",
                "value": "bearishMidFielders",
                "description": {
                    "langKey": "SCANNERS_DESCRIPTION1",
                    "langKey1": "BEARISH_MID_FIELDERS_DESCRIPTION1",
                    "langKey2": "BULLISH_MID_FIELDERS_DESCRIPTION2",
                    "langKey3": "BEARISH_MID_FIELDERS_DESCRIPTION3",
                },
                "columns": [
                    {
                        "dispName": "Total Volume",
                        "langKey": "TOTAL_VOLUME_SCANNERS_THEAD",
                        "key": "TOTAL_VOLUME"
                    },
                    {
                        "dispName": " 10 day Avg. Vol.",
                        "langKey": "10_DAY_AVG_VOLUME_SCANNERS_THEAD",
                        "key": "AVG_VOLUME"
                    },
                    {
                        "dispName": "RSI 20",
                        "langKey": "RSI_20_SCANNERS_THEAD",
                        "key": "RSI20"
                    }
                ]
            },
            {
                "name": "BULLISH SMALLCAP SHOCKERS",
                "langKey": "BULLISH_SMALLCAP_SHOCKERS",
                "value": "bullishSmallCapShockers",
                "description": {
                    "langKey": "SCANNERS_DESCRIPTION1",
                    "langKey1": "BULLISH_SMALLCAP_SHOCKERS_DESCRIPTION1",
                    "langKey2": "BULLISH_SMALLCAP_SHOCKERS_DESCRIPTION2",
                    "langKey3": "BULLISH_SMALLCAP_SHOCKERS_DESCRIPTION3",
                },
                "columns": [
                    {
                        "dispName": "Total Volume",
                        "langKey": "TOTAL_VOLUME_SCANNERS_THEAD",
                        "key": "TOTAL_VOLUME"
                    },
                    {
                        "dispName": " 10 day Avg. Vol.",
                        "langKey": "10_DAY_AVG_VOLUME_SCANNERS_THEAD",
                        "key": "AVG_VOLUME"
                    }
                ]
            },
            {
                "name": "BEARISH SMALLCAP SHOCKERS",
                "langKey": "BEARISH_SMALLCAP_SHOCKERS",
                "value": "bearishSmallCapShockers",
                "description": {
                    "langKey": "SCANNERS_DESCRIPTION1",
                    "langKey1": "BULLISH_SMALLCAP_SHOCKERS_DESCRIPTION1",
                    "langKey2": "BEARISH_SMALLCAP_SHOCKERS_DESCRIPTION2",
                    "langKey3": "BULLISH_SMALLCAP_SHOCKERS_DESCRIPTION3",
                },
                "columns": [
                    {
                        "dispName": "Total Volume",
                        "langKey": "TOTAL_VOLUME_SCANNERS_THEAD",
                        "key": "TOTAL_VOLUME"
                    },
                    {
                        "dispName": " 10 day Avg. Vol.",
                        "langKey": "10_DAY_AVG_VOLUME_SCANNERS_THEAD",
                        "key": "AVG_VOLUME"
                    }
                ]
            },
            {
                "name": "BULLISH GAP UP",
                "langKey": "BULLISH_GAP_UP",
                "value": "bullishGapUp",
                "description": {
                    "langKey": "SCANNERS_DESCRIPTION1",
                    "langKey1": "BULLISH_GAP_UP_DESCRIPTION1",
                },
                "columns": [
                    {
                        "dispName": "Previous Close",
                        "langKey": "PREVIOUS_CLOSE_SCANNERS_THEAD",
                        "key": "PRE_CLOSE_PRICE"
                    },
                    {
                        "dispName": "Open",
                        "langKey": "OPEN_SCANNERS_THEAD",
                        "key": "open"
                    }
                ]
            },
            {
                "name": "BEARISH GAP UP",
                "langKey": "BEARISH_GAP_UP",
                "value": "bearishGapUp",
                "description": {
                    "langKey": "SCANNERS_DESCRIPTION1",
                    "langKey1": "BEARISH_GAP_UP_DESCRIPTION1",
                   
                },
                "columns": [
                    {
                        "dispName": "Previous Close",
                        "langKey": "PREVIOUS_CLOSE_SCANNERS_THEAD",
                        "key": "PRE_CLOSE_PRICE"
                    },
                    {
                        "dispName": "Open",
                        "langKey": "OPEN_SCANNERS_THEAD",
                        "key": "open"
                    }
                ]
            },
            {
                "name": "BULLISH FRONT LINERS",
                "langKey": "BULLISH_FRONT_LINERS",
                "value": "bullishFrontLiners",
                "description": {
                    "langKey": "SCANNERS_DESCRIPTION1",
                    "langKey1": "BULLISH_FRONT_LINERS_DESCRIPTION1",
                    "langKey2": "BULLISH_FRONT_LINERS_DESCRIPTION2",
                    "langKey3" : "BULLISH_FRONT_LINERS_DESCRIPTION3",
                },
                "columns": [
                    {
                        "dispName": "Total Volume",
                        "langKey": "TOTAL_VOLUME_SCANNERS_THEAD",
                        "key": "TOTAL_VOLUME"
                    },
                    {
                        "dispName": " 10 day Avg. Vol.",
                        "langKey": "10_DAY_AVG_VOLUME_SCANNERS_THEAD",
                        "key": "AVG_VOLUME"
                    },
                    {
                        "dispName": "OI%",
                        "langKey": "OI%_SCANNERS_THEAD",
                        "key": "OI_CHANGE_PERC"
                    }
                ]
            },
            {
                "name": "BEARISH FRONT LINERS",
                "langKey": "BEARISH_FRONT_LINERS",
                "value": "bearishFrontLiners",
                "description": {
                    "langKey": "SCANNERS_DESCRIPTION1",
                    "langKey1": "BEARISH_FRONT_LINERS_DESCRIPTION1",
                    "langKey2": "BULLISH_FRONT_LINERS_DESCRIPTION2",
                    "langKey3" : "BULLISH_FRONT_LINERS_DESCRIPTION3",
                },
                "columns": [
                    {
                        "dispName": "Total Volume",
                        "langKey": "TOTAL_VOLUME_SCANNERS_THEAD",
                        "key": "TOTAL_VOLUME"
                    },
                    {
                        "dispName": " 10 day Avg. Vol.",
                        "langKey": "10_DAY_AVG_VOLUME_SCANNERS_THEAD",
                        "key": "AVG_VOLUME"
                    },
                    {
                        "dispName": "OI%",
                        "langKey": "OI%_SCANNERS_THEAD",
                        "key": "OI_CHANGE_PERC"
                    }
                ]
            },
            {
                "name": "BULLISH FO MOVERS",
                "langKey": "BULLISH_FO_MOVERS",
                "value": "bullishFOMovers",
                "description": {
                    "langKey": "SCANNERS_DESCRIPTION1",
                    "langKey1":"BULLISH_FOMOVERS_DESCRIPTION1",
                    "langKey2": "BULLISH_FRONT_LINERS_DESCRIPTION2",
                    "langKey3" : "BULLISH_FRONT_LINERS_DESCRIPTION3",
                },
                "columns": [
                    {
                        "dispName": "Total Volume",
                        "langKey": "TOTAL_VOLUME_SCANNERS_THEAD",
                        "key": "TOTAL_VOLUME"
                    },
                    {
                        "dispName": " 10 day Avg. Vol.",
                        "langKey": "10_DAY_AVG_VOLUME_SCANNERS_THEAD",
                        "key": "AVG_VOLUME"
                    },
                    {
                        "dispName": "OI%",
                        "langKey": "OI%_SCANNERS_THEAD",
                        "key": "OI_CHANGE_PERC"
                    }
                ]
            },
            {
                "name": "BEARISH FO MOVERS",
                "langKey": "BEARISH_FO_MOVERS",
                "value": "bearishFOMovers",
                "description": {
                    "langKey": "SCANNERS_DESCRIPTION1",
                    "langKey1":"BEARISH_FOMOVERS_DESCRIPTION1",
                    "langKey2": "BULLISH_FRONT_LINERS_DESCRIPTION2",
                    "langKey3" : "BULLISH_FRONT_LINERS_DESCRIPTION3",
                },
                "columns": [
                    {
                        "dispName": "Total Volume",
                        "langKey": "TOTAL_VOLUME_SCANNERS_THEAD",
                        "key": "TOTAL_VOLUME"
                    },
                    {
                        "dispName": " 10 day Avg. Vol.",
                        "langKey": "10_DAY_AVG_VOLUME_SCANNERS_THEAD",
                        "key": "AVG_VOLUME"
                    },
                    {
                        "dispName": "OI%",
                        "langKey": "OI%_SCANNERS_THEAD",
                        "key": "OI_CHANGE_PERC"
                    }
                ]
            }
        ]
    },

    "SMA/EMA": {
        "apiUrl": "/Screener/MAScreener/1.0.0",
        "langKey":{
            "key":"SMA/EMA",
            "head":"SMA/EMA",
        },
        "screenerList": [
            {
                "description": {
                    "langKey":"SCANNER_DESCRIPTION_2",
                },
                "type": [
                    {
                        "dispName": "CROSSING ABOVE",
                        "langKey": "CROSSING_ABOVE",
                        "key": "CrossingAbove"
                    },
                    {
                        "dispName": "CROSSING BELOW",
                        "langKey": "CROSSING_BELOW",
                        "key": "CrossingBelow"
                    },
                    {
                        "dispName": "CLOSING NEAR",
                        "langKey": "CLOSING_NEAR",
                        "key": "ClosingNear"
                    }
                ],
                "indicators": [
                    {
                        "dispName": "5 SMA",
                        "langKey": "5_SMA",
                        "indicatorName": "SMA5"
                    },
                    {
                        "dispName": "10 SMA",
                        "langKey": "10_SMA",
                        "indicatorName": "SMA10"
                    },
                    {
                        "dispName": "20 SMA",
                        "langKey": "20_SMA",
                        "indicatorName": "SMA20"
                    },
                    {
                        "dispName": "30 SMA",
                        "langKey": "30_SMA",
                        "indicatorName": "SMA30"
                    },
                    {
                        "dispName": "50 SMA",
                        "langKey": "50_SMA",
                        "indicatorName": "SMA50"
                    },
                    {
                        "dispName": "100 SMA",
                        "langKey": "100_SMA",
                        "indicatorName": "SMA100"
                    },
                    {
                        "dispName": "200 SMA",
                        "langKey": "200_SMA",
                        "indicatorName": "SMA200"
                    },
                    {
                        "dispName": "5 EMA",
                        "langKey": "5_EMA",
                        "indicatorName": "EMA5"
                    },
                    {
                        "dispName": "10 EMA",
                        "langKey": "10_EMA",
                        "indicatorName": "EMA10"
                    },
                    {
                        "dispName": "20 EMA",
                        "langKey": "20_EMA",
                        "indicatorName": "EMA20"
                    },
                    {
                        "dispName": "30 EMA",
                        "langKey": "30_EMA",
                        "indicatorName": "EMA30"
                    },
                    {
                        "dispName": "50 EMA",
                        "langKey": "50_EMA",
                        "indicatorName": "EMA50"
                    },
                    {
                        "dispName": "100 EMA",
                        "langKey": "100_EMA",
                        "indicatorName": "EMA100"
                    },
                    {
                        "dispName": "200 EMA",
                        "langKey": "200_EMA",
                        "indicatorName": "EMA200"
                    },
                    // {
                    //     "dispName": "Last price",
                    //     "indicatorName": "LAST"
                    // }
                ]
            }
        ]
    },
    "RSI": {
        "apiUrl": "/Screener/RSIScreenerService/1.0.0",
        "langKey":{
            "key":"RSI",
            "head":"RSI"
        },
        "screenerList": [
            {
                "name": "RSI BULLISH",
                "langKey":"RSI_BULLISH",
                "value": "RSIBullish",
                "description":{
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"RSI_BULLISH_DESCRIPTION",
                },
                "columns": [
                    {
                        "dispName": "RSI 14",
                        "langKey":"RSI_14",
                        "key": "RSI14"
                    },
                    {
                        "dispName": "Prev. RSI 14",
                        "langKey":"Prev_RSI_14",
                        "key": "PREV_RSI14"
                    }
                ]
            },
            {
                "name": "RSI TRENDING UP",
                "langKey":"RSI_TRENDING_UP",
                "value": "RSITrendingUp",
                "description":{
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"RSITRENDINGUP_DESCRIPTION1",
                },
                "columns": [
                    {
                        "dispName": "RSI 14",
                        "langKey":"RSI_14",
                        "key": "RSI14"
                    }
                ]
            },
            {
                "name": "RSI BEARISH",
                "langKey":"RSI_BEARISH",
                "value": "RSIBearish",
                "description":{
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"RSI_BEARISH_DESCRIPTION1",
                },
                "columns": [
                    {
                        "dispName": "RSI 14",
                        "langKey":"RSI_14",
                        "key": "RSI14"
                    },
                    {
                        "dispName": "Prev. RSI 14",
                        "langKey":"Prev_RSI_14",
                        "key": "PREV_RSI14"
                    }
                ]
            },
            {
                "name": "RSI TRENDING DOWN",
                "langKey":"RSI_TRENDING_DOWN",
                "value": "RSITrendingdown",
                "description": {
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"RSI_TRENDINGDOWN_DESCRIPTION1",
                },
                "columns": [
                    {
                        "dispName": "RSI 14",
                        "langKey":"RSI_14",
                        "key": "RSI14"
                    }
                ]
            },
            {
                "name": "RSI OVERBOUGHT",
                "langKey":"RSI_OVERBOUGHT",
                "value": "RSIOverbought",
                "description":{
                    "langKey":"RSI_OVERBROUGHT_DESCRIPTION",
                },
                "columns": [
                    {
                        "dispName": "RSI 14",
                        "langKey":"RSI_14",
                        "key": "RSI14"
                    }
                ]
            },
            {
                "name": "RSI OVERSOLD",
                "langKey":"RSI_OVERSOLD",
                "value": "RSIOversold",
                "description": {
                    "langKey":"RSI_OVERSOLD_DESCRIPTION1",
                },
                "columns": [
                    {
                        "dispName": "RSI 14",
                        "langKey":"RSI_14",
                        "key": "RSI14"
                    }
                ]
            },
            {
                "name": "RSI ABOVE 70",
                "langKey":"RSI_ABOVE_70",
                "value": "RSICrossing70",
                "description": {
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"RSI_ABOVE_70_DESCRIPTION1",
                },
                "columns": [
                    {
                        "dispName": "RSI 14",
                        "langKey":"RSI_14",
                        "key": "RSI14"
                    }
                ]
            },
            {
                "name": "RSI BELOW 30",
                "langKey":"RSI_BELOW_30",
                "value": "RSIBelow30",
                "description": {
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"RSI_BELOW30_DESCRIPTION1",
                },
                "columns": [
                    {
                        "dispName": "RSI 14",
                        "langKey":"RSI_14",
                        "key": "RSI14"
                    }
                ]
            }
        ]
    },

    "ParabolicSAR": {
        "apiUrl": "/Screener/PSARScreenerService/1.0.0",
        "langKey":{
            "key":"PARABOLIC_SAR",
            "head":"ParabolicSAR"
        },
        "screenerList": [
            {
                "name": "PARABOLICSAR BULLISH",
                "langKey":"PARABOLICSAR_BULLISH",
                "value": "PSARBullish",
                "description": {
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"PARABOLICSAR_BULLISH_DESCRIPTION1",
                },
                "columns": [
                    {
                        "dispName": "PSAR",
                        "langKey": "PSAR_SCANNERS_THEAD",
                        "key": "PSAR"
                    },
                    {
                        "dispName": "Prev. PSAR",
                        "langKey": "PREV_PSAR_SCANNERS_THEAD",
                        "key": "PREV_PSAR"
                    }
                ]
            },
            {
                "name": "PARABOLICSAR BEARISH",
                "langKey":"PARABOLICSAR_BEARISH",
                "value": "PSARBearish",
                "description": {
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"PARABOLICSAR_BEARISH_DESCRIPTION1",
                },  
                "columns": [
                    {
                        "dispName": "PSAR",
                        "langKey": "PSAR_SCANNERS_THEAD",
                        "key": "PSAR"
                    },
                    {
                        "dispName": "Prev. PSAR",
                        "langKey": "PREV_PSAR_SCANNERS_THEAD",
                        "key": "PREV_PSAR"
                    }
                ]
            },
            {
                "name": "PARABOLICSAR BULLISH REVERSAL",
                "langKey":"PARABOLICSAR_BULLISH_REVERSAL",
                "value": "PSARBullishReversal",
                "description": 
                {
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"PARABOLICSAR_BULLISH_REVERSAL_DESCRIPTION1",
                }, 
                "columns": [
                    {
                        "dispName": "PSAR",
                        "langKey": "PSAR_SCANNERS_THEAD",
                        "key": "PSAR"
                    },
                    {
                        "dispName": "Prev. PSAR",
                        "langKey": "PREV_PSAR_SCANNERS_THEAD",
                        "key": "PREV_PSAR"
                    }
                ]
            },
            {
                "name": "PARABOLICSAR BEARISH REVERSAL",
                "langKey":"PARABOLICSAR_BEARISH_REVERSAL",
                "value": "PSARBearishReversal",
                "description":{
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"PARABOLICSAR_BEARISH_REVERSAL_DESCRIPTION1"
                } ,
                "columns": [
                    {
                        "dispName": "PSAR",
                        "langKey": "PSAR_SCANNERS_THEAD",
                        "key": "PSAR"
                    },
                    {
                        "dispName": "Prev. PSAR",
                        "langKey": "PREV_PSAR_SCANNERS_THEAD",
                        "key": "PREV_PSAR"
                    }
                ]
            }
        ]
    },
    "Bollinger Bands": {
        "apiUrl": "/Screener/BBANDScreenerService/1.0.0",
        "langKey":{
            "key":"BOLLINGER_BANDS",
            "head":"Bollinger Bands",
        },
        "screenerList": [
            {
                "name": "PRICE BELOW LOWER BAND",
                "langKey": "PRICE_BELOW_BAND",
                "value": "PRICE_BELOW_BBAND",
                "description": {
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"PRICE_BELOW_BBAND_DESCRIPTION1",
                },
                "columns": [
                    {
                        "dispName": "Lower Band ",
                        "langKey": "LOWER_BAND_VAL_SCANNERS_THEAD",
                        "key": "BBAND_LOWER"
                    }
                ]
            },
            {
                "name": "PRICE ABOVE UPPER BAND",
                "langKey": "PRICE_ABOVE_BAND",
                "value": "PRICE_ABOVE_BBAND",
                "description": {
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"PRICE_ABOVE_BBAND_DESCRIPTION1"
                },
                "columns": [
                    {
                        "dispName": "Upper Band",
                        "langKey": "UPPER_BAND_VAL_SCANNERS_THEAD",
                        "key": "BBAND_UPPER"
                    }
                ]
            },
            {
                "name": "BOLLINGER BAND BULLISH",
                "langKey": "BOLLINGER_BAND_BULLISH",
                "value": "BBANDBullish",
                "description": {
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"BOLLINGER_BAND_BULLISH_DESCRIPTION1",
                },
                "columns": [
                    {
                        "dispName": "Middle Band",
                        "langKey": "MIDDLE_BAND_VAL_SCANNERS_THEAD",
                        "key": "BBAND"
                    },
                    {
                        "dispName": "Prev. Middle Band",
                        "langKey": "PREV_MIDDLE_BAND_VAL_SCANNERS_THEAD",
                        "key": "PREV_BBAND"
                    }
                ]
            },
            {
                "name": "BOLLINGER BAND BEARISH",
                "langKey": "BOLLINGER_BAND_BEARISH",
                "value": "BBANDBearish",
                "description":{
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"BOLLINGER_BAND_BEARISH_DESCRIPTION",
                },
                "columns": [
                    {
                        "dispName": "Middle Band",
                        "langKey": "MIDDLE_BAND_VAL_SCANNERS_THEAD",
                        "key": "BBAND"
                    },
                    {
                        "dispName": "Prev. Middle Band",
                        "langKey": "PREV_MIDDLE_BAND_VAL_SCANNERS_THEAD",
                        "key": "PREV_BBAND"
                    }
                ]
            },
            {
                "name": "BOLLINGER BAND SQUEEZE",
                "langKey": "BOLLINGER_BAND_SQUEEZE",
                "value": "BBANDSqueeze",
                "description": {
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"BOLLINGER_BAND_SQUEEZE_DESCRIPTION1"
                },
                "columns": [
                    {
                        "dispName": "Upper Band",
                        "langKey": "UPPER_BAND_VAL_SCANNERS_THEAD",
                        "key": "BBAND_UPPER"
                    },
                    {
                        "dispName": "Lower Band value",
                        "langKey": "LOWER_BAND_VAL_SCANNERS_THEAD",
                        "key": "BBAND_LOWER"
                    },
                    {
                        "dispName": "Average True Range",
                        "langKey":"AVERAGE_TRUE_RANGE",
                        "key": "AVG_TRUE_RANGE"
                    }
                ]
            }
        ]
    },
    "MACD": {
        "apiUrl": "/Screener/MACDScreenerService/1.0.0",
        "langKey":{
            "key":"MACD",
            "head":"MACD",
        },
        "screenerList": [
            {
                "name": "MACD BULLISH",
                "langKey": "MACD_BULLISH",
                "value": "MACDBullish",
                "description": {
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"MACD_BULLISH_DESCRIPTION",
                },
                "columns": [
                    {
                        "dispName": "MACD",
                        "langKey": "MACD_SCANNERS_THEAD",
                        "key": "MACD"
                    },
                    {
                        "dispName": "MACD Signal",
                        "langKey": "MACD_SIGNAL_SCANNERS_THEAD",
                        "key": "MACD_SIGNAL"
                    }
                ]
            },
            {
                "name": "MACD BEARISH",
                "langKey": "MACD_BEARISH",
                "value": "MACDBearish",
                "description": {
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"MACD_BEARISH_DESCRIPTION1"
                },
                "columns": [
                    {
                        "dispName": "MACD",
                        "langKey": "MACD_SCANNERS_THEAD",
                        "key": "MACD"
                    },
                    {
                        "dispName": "MACD Signal",
                        "langKey": "MACD_SIGNAL_SCANNERS_THEAD",
                        "key": "MACD_SIGNAL"
                    }
                ]
            }
        ]
    },
    "Williams %R": {
        "apiUrl": "/Screener/WILLRScreenerService/1.0.0",
        "langKey":{
            "key":"WILLIAMS_R",
            "head":"Williams %R",
        },
        "screenerList": [
            {
                "name": "WILLR BULLISH",
                "langKey": "WILLR_BULLISH",
                "value": "WILLRBullish",
                "description":{
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"WILLR_BULLISH_DESCRIPTION1",
                },
                "columns": [
                    {
                        "dispName": "Willaims %R",
                        "langKey": "WILLIAMSR_SCANNERS_THEAD",
                        "key": "WILLR"
                    },
                    {
                        "dispName": "Prev. Williams %R",
                        "langKey": "PREV_WILLIAMSR_SCANNERS_THEAD",
                        "key": "PREV_WILLR"
                    }
                ]
            },
            {
                "name": "WILLR BEARISH",
                "langKey": "WILLR_BEARISH",
                "value": "WILLRBearish",
                "description": {
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"WILLR_BEARISH_DESCRIPTION1",
                },
                "columns": [
                    {
                        "dispName": "Willaims %R",
                        "langKey": "WILLIAMSR_SCANNERS_THEAD",
                        "key": "WILLR"
                    },
                    {
                        "dispName": "Prev. Williams %R",
                        "langKey": "PREV_WILLIAMSR_SCANNERS_THEAD",
                        "key": "PREV_WILLR"
                    }
                ]
            },
            {
                "name": "WILLR OVERSOLD",
                "langKey": "WILLR_OVERSOLD",
                "value": "WILLROversold",
                "description": {
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"WILLR_OVERSOLD_DESCRIPTION1",
                },
                "columns": [
                    {
                        "dispName": "Willaims %R",
                        "langKey": "WILLIAMSR_SCANNERS_THEAD",
                        "key": "WILLR"
                    }
                ]
            },
            {
                "name": "WILLR OVERBOUGHT",
                "langKey": "WILLR_OVERBOUGHT",
                "value": "WILLROverbought",
                "description": {
                    "langKey":"SCANNERS_DESCRIPTION1",
                    "langKey1":"WILLR_OVERBOUGHT_DESCRIPTION1",
                },
                "columns": [
                    {
                        "dispName": "Willaims %R",
                        "langKey": "WILLIAMSR_SCANNERS_THEAD",
                        "key": "WILLR"
                    }
                ]
            }
        ]
    }
}
