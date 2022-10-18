

// import React from 'react'
import { LOGIN_TYPE, DATE_FORMATS, ORDER_TYPE_API_KEY_MAP } from '../../src/common/Constants';
import {
    checkEmpty, convertToUpperCase, checkInt, checkFloat, checkValidPassword, checkValidUserName, checkValidPan_DOB, isBuyTradeAction, isSellTradeAction,
    getColorCode, specialCharFinder, replaceComma, getPositive_Negative_ColorCode, countDecimals, getValidDate, getTime, getFormatedDate, getHighlightFlash,
    getUpDownFlash, getDecimal_Exc, sortByInt, sortByString, getApiReqValue, findTickSize, checkValidWatchlistName, getBaseURL, getIndicesList
} from '../common/CommonMethods'


const org_array = [
    {
        "chngPer": "-2.41",
        "dispSym": "WIPRO",
        "askPrice": "256.75",
        "sym": {
            "exc": "BSE",
            "series": "EQ",
            "lotSize": "1",
            "multiplier": "1",
            "streamSym": "507685_BSE",
            "instrument": "STK",
            "baseSym": "WIPRO",
            "id": "STK_WIPRO_EQ_BSE",
            "asset": "equity",
            "excToken": "507685",
            "tickSize": "0.05"
        },
        "companyName": "WIPRO LTD.",
        "bidQty": "448",
        "ltq": "3",
        "ltp": "256.60",
        "totBuyQty": "241814",
        "ltt": "16/07/2020 12:36:57",
        "bidPrice": "256.60",
        "tickSize": "5",
        "chng": "-6.35",
        "askQty": "180",
        "high": "268.30",
        "vol": "19,34,533",
        "totSellQty": "1283526",
        "low": "255.60",
        "baseSym": "WIPRO",
        "OI": "0",
        "atp": "0.00",
        "open": "263.00"
    },
    {
        "chngPer": "-3.74",
        "dispSym": "SADBHAV",
        "askPrice": "54.05",
        "sym": {
            "exc": "BSE",
            "series": "EQ",
            "lotSize": "1",
            "multiplier": "1",
            "streamSym": "532710_BSE",
            "instrument": "STK",
            "baseSym": "SADBHAV",
            "id": "STK_SADBHAV_EQ_BSE",
            "asset": "equity",
            "excToken": "532710",
            "tickSize": "0.05"
        },
        "companyName": "SADBHAV ENGINEERING LTD.",
        "bidQty": "876",
        "ltq": "5",
        "ltp": "54.00",
        "totBuyQty": "6091",
        "ltt": "16/07/2020 12:35:14",
        "bidPrice": "54.00",
        "tickSize": "5",
        "chng": "-2.10",
        "askQty": "1460",
        "high": "57.40",
        "vol": "89,712",
        "totSellQty": "15840",
        "low": "53.55",
        "baseSym": "SADBHAV",
        "OI": "0",
        "atp": "0.00",
        "open": "57.40"
    },
    {
        "chngPer": "-4.88",
        "dispSym": "ASAHISONG",
        "askPrice": "165.30",
        "sym": {
            "exc": "BSE",
            "series": "EQ",
            "lotSize": "1",
            "multiplier": "1",
            "streamSym": "532853_BSE",
            "instrument": "STK",
            "baseSym": "ASAHISONG",
            "id": "STK_ASAHISONG_EQ_BSE",
            "asset": "equity",
            "excToken": "532853",
            "tickSize": "0.05"
        },
        "companyName": "ASAHI SONGWON COLORS LTD.",
        "bidQty": "2",
        "ltq": "10",
        "ltp": "163.90",
        "totBuyQty": "9590",
        "ltt": "16/07/2020 12:30:33",
        "bidPrice": "163.90",
        "tickSize": "5",
        "chng": "-8.40",
        "askQty": "2",
        "high": "173.15",
        "vol": "7,904",
        "totSellQty": "10127",
        "low": "161.35",
        "baseSym": "ASAHISONG",
        "OI": "0",
        "atp": "0.00",
        "open": "173.15"
    }]
const exp_array_Int =
    [
        {
            chngPer: '-4.88',
            dispSym: 'ASAHISONG',
            askPrice: '165.30',
            sym: {
                exc: 'BSE',
                series: 'EQ',
                lotSize: '1',
                multiplier: '1',
                streamSym: '532853_BSE',
                instrument: 'STK',
                baseSym: 'ASAHISONG',
                id: 'STK_ASAHISONG_EQ_BSE',
                asset: 'equity',
                excToken: '532853',
                tickSize: '0.05'
            },
            companyName: 'ASAHI SONGWON COLORS LTD.',
            bidQty: '2',
            ltq: '10',
            ltp: '163.90',
            totBuyQty: '9590',
            ltt: '16/07/2020 12:30:33',
            bidPrice: '163.90',
            tickSize: '5',
            chng: '-8.40',
            askQty: '2',
            high: '173.15',
            vol: '7,904',
            totSellQty: '10127',
            low: '161.35',
            baseSym: 'ASAHISONG',
            OI: '0',
            atp: '0.00',
            open: '173.15',
            ltpClass: '',
            chngClass: '',
            chngPerClass: ''
        },
        {
            chngPer: '-3.74',
            dispSym: 'SADBHAV',
            askPrice: '54.05',
            sym: {
                exc: 'BSE',
                series: 'EQ',
                lotSize: '1',
                multiplier: '1',
                streamSym: '532710_BSE',
                instrument: 'STK',
                baseSym: 'SADBHAV',
                id: 'STK_SADBHAV_EQ_BSE',
                asset: 'equity',
                excToken: '532710',
                tickSize: '0.05'
            },
            companyName: 'SADBHAV ENGINEERING LTD.',
            bidQty: '876',
            ltq: '5',
            ltp: '54.00',
            totBuyQty: '6091',
            ltt: '16/07/2020 12:35:14',
            bidPrice: '54.00',
            tickSize: '5',
            chng: '-2.10',
            askQty: '1460',
            high: '57.40',
            vol: '89,712',
            totSellQty: '15840',
            low: '53.55',
            baseSym: 'SADBHAV',
            OI: '0',
            atp: '0.00',
            open: '57.40',
            ltpClass: '',
            chngClass: '',
            chngPerClass: ''
        },
        {
            chngPer: '-2.41',
            dispSym: 'WIPRO',
            askPrice: '256.75',
            sym: {
                exc: 'BSE',
                series: 'EQ',
                lotSize: '1',
                multiplier: '1',
                streamSym: '507685_BSE',
                instrument: 'STK',
                baseSym: 'WIPRO',
                id: 'STK_WIPRO_EQ_BSE',
                asset: 'equity',
                excToken: '507685',
                tickSize: '0.05'
            },
            companyName: 'WIPRO LTD.',
            bidQty: '448',
            ltq: '3',
            ltp: '256.60',
            totBuyQty: '241814',
            ltt: '16/07/2020 12:36:57',
            bidPrice: '256.60',
            tickSize: '5',
            chng: '-6.35',
            askQty: '180',
            high: '268.30',
            vol: '19,34,533',
            totSellQty: '1283526',
            low: '255.60',
            baseSym: 'WIPRO',
            OI: '0',
            atp: '0.00',
            open: '263.00',
            ltpClass: '',
            chngClass: '',
            chngPerClass: ''
        }
    ]


const exp_array_string = [
    {
        chngPer: '-4.88',
        dispSym: 'ASAHISONG',
        askPrice: '165.30',
        sym: {
            exc: 'BSE',
            series: 'EQ',
            lotSize: '1',
            multiplier: '1',
            streamSym: '532853_BSE',
            instrument: 'STK',
            baseSym: 'ASAHISONG',
            id: 'STK_ASAHISONG_EQ_BSE',
            asset: 'equity',
            excToken: '532853',
            tickSize: '0.05'
        },
        companyName: 'ASAHI SONGWON COLORS LTD.',
        bidQty: '2',
        ltq: '10',
        ltp: '163.90',
        totBuyQty: '9590',
        ltt: '16/07/2020 12:30:33',
        bidPrice: '163.90',
        tickSize: '5',
        chng: '-8.40',
        askQty: '2',
        high: '173.15',
        vol: '7,904',
        totSellQty: '10127',
        low: '161.35',
        baseSym: 'ASAHISONG',
        OI: '0',
        atp: '0.00',
        open: '173.15',
        ltpClass: '',
        chngClass: '',
        chngPerClass: ''
    },
    {
        chngPer: '-3.74',
        dispSym: 'SADBHAV',
        askPrice: '54.05',
        sym: {
            exc: 'BSE',
            series: 'EQ',
            lotSize: '1',
            multiplier: '1',
            streamSym: '532710_BSE',
            instrument: 'STK',
            baseSym: 'SADBHAV',
            id: 'STK_SADBHAV_EQ_BSE',
            asset: 'equity',
            excToken: '532710',
            tickSize: '0.05'
        },
        companyName: 'SADBHAV ENGINEERING LTD.',
        bidQty: '876',
        ltq: '5',
        ltp: '54.00',
        totBuyQty: '6091',
        ltt: '16/07/2020 12:35:14',
        bidPrice: '54.00',
        tickSize: '5',
        chng: '-2.10',
        askQty: '1460',
        high: '57.40',
        vol: '89,712',
        totSellQty: '15840',
        low: '53.55',
        baseSym: 'SADBHAV',
        OI: '0',
        atp: '0.00',
        open: '57.40',
        ltpClass: '',
        chngClass: '',
        chngPerClass: ''
    },
    {
        chngPer: '-2.41',
        dispSym: 'WIPRO',
        askPrice: '256.75',
        sym: {
            exc: 'BSE',
            series: 'EQ',
            lotSize: '1',
            multiplier: '1',
            streamSym: '507685_BSE',
            instrument: 'STK',
            baseSym: 'WIPRO',
            id: 'STK_WIPRO_EQ_BSE',
            asset: 'equity',
            excToken: '507685',
            tickSize: '0.05'
        },
        companyName: 'WIPRO LTD.',
        bidQty: '448',
        ltq: '3',
        ltp: '256.60',
        totBuyQty: '241814',
        ltt: '16/07/2020 12:36:57',
        bidPrice: '256.60',
        tickSize: '5',
        chng: '-6.35',
        askQty: '180',
        high: '268.30',
        vol: '19,34,533',
        totSellQty: '1283526',
        low: '255.60',
        baseSym: 'WIPRO',
        OI: '0',
        atp: '0.00',
        open: '263.00',
        ltpClass: '',
        chngClass: '',
        chngPerClass: ''
    }
]

describe('testing checkEmpty()', () => {
    test('testing checkEmpty(hai)', () => {
        const result = checkEmpty('hai');
        expect(result).toBeTruthy();
    });

    test('testing checkEmpty()', () => {
        const result = checkEmpty('');
        expect(result).toBe('--');
    });
    test('testing checkEmpty()', () => {
        const result = checkEmpty();
        expect(result).toBe('--');
    });
    test('testing checkEmpty()', () => {
        const result = checkEmpty(0);
        expect(result).toBe('--');
    });
    
})


describe('convertToUpperCase()', () => {
    test('testing convertToUpperCase(abc)', () => {
        const result = convertToUpperCase('abc');
        expect(result).toBe("ABC")
    })
    test('testing convertToUpperCase(ABC)', () => {
        const result = convertToUpperCase('ABC');
        expect(result).toBe("ABC")
    })
    test('testing convertToUpperCase()', () => {
        const result = convertToUpperCase('123');
        expect(result).toBe("123")
    })
    test('testing convertToUpperCase()', () => {
        const result = convertToUpperCase('');
        expect(result).not.toBeDefined()
    })
    test('testing convertToUpperCase()', () => {
        const result = convertToUpperCase(0);
        expect(result).not.toBeDefined()
    })

    test('testing convertToUpperCase(null)', () => {
        const result = convertToUpperCase(null);
        expect(result).not.toBeDefined()
    })
})

describe('testing checkInt', () => {
    test('testing checkInt()', () => {
        const result = checkInt(123)
        expect(result).toBeTruthy()
    })

    test('testing invalid checkInt(aaa)', () => {
        const result = checkInt("aaa")
        expect(result).toBeFalsy()
    })
    test('testing invalid checkInt(1.23)', () => {
        const result = checkInt("1.23")
        expect(result).toBeFalsy()
    })
    test('testing invalid checkInt()', () => {
        const result = checkInt(" ")
        expect(result).toBeFalsy()
    })
    test('testing invalid checkInt(null)', () => {
        const result = checkInt(null)
        expect(result).toBeFalsy()
    })
    test('testing invalid checkInt(null)', () => {
        const result = checkInt("12#3")
        expect(result).toBeFalsy()
    })
    test('testing invalid checkInt(0)', () => {
        const result = checkInt(0)
        expect(result).toBeFalsy()
    })
})

describe('testing checkFloat', () => {
    test('testing checkFloat()', () => {
        const result = checkFloat("12.3")
        expect(result).toBeTruthy()
    })
    test('testing invalid checkFloat', () => {
        const result = checkFloat("abc12")
        expect(result).toBeFalsy()
    })
    test('testing invalid checkFloat', () => {
        const result = checkFloat("123")
        expect(result).toBeTruthy()
    })
    test('testing invalid checkFloat', () => {
        const result = checkFloat("12.22.22")
        expect(result).toBeFalsy()
    })
    test('testing invalid checkFloat', () => {
        const result = checkFloat(0)
        expect(result).toBeFalsy()
    })
    test('testing invalid checkFloat', () => {
        const result = checkFloat(null)
        expect(result).toBeFalsy()
    })
    test('testing invalid checkFloat', () => {
        const result = checkFloat('')
        expect(result).toBeFalsy()
    })
})

describe('testing but/sell transaction', () => {
    test('testing isBuyTradeAction()', () => {
        const result = isBuyTradeAction("buy")
        expect(result).toBeTruthy()
    })
    test('testing isBuyTradeAction()', () => {
        const result = isBuyTradeAction("Abc")
        expect(result).toBeFalsy()
    })
    test('testing isBuyTradeAction()', () => {
        const result = isBuyTradeAction("")
        expect(result).toBeFalsy()
    })
    test('testing isBuyTradeAction()', () => {
        const result = isBuyTradeAction('123')
        expect(result).toBeFalsy()
    })

    test('testing isSellTradeAction()', () => {
        const result = isSellTradeAction("sell")
        expect(result).toBeTruthy()
    })

    test('testing isSellTradeAction()', () => {
        const result = isSellTradeAction()
        expect(result).toBeFalsy()
    })

})

describe('testing checkValidPassword()', () => {
    let validation = {
        isValid: true,
        errorMsg: ''
    }
    test('test invalid password', () => {
        const validation = checkValidPassword("123")
        const result = validation.isValid;
        expect(result).toBeFalsy()
    })
    test('test invalid password', () => {
        const validation = checkValidPassword("")
        const result = validation.errorMsg;
        expect(result).toBe("Please enter the password")
    })

    test('test invalid password', () => {
        const validation = checkValidPassword("123ab")
        const result = validation.errorMsg;
        expect(result).toBe("Password should be minimum 6 characters and maximum 12 characters")
    })
    test('test valid password', () => {
        const validation = checkValidPassword("123abc*")
        const result = validation.isValid;
        expect(result).toBeTruthy()
    })
    test('test valid password', () => {
        const validation = checkValidPassword("abc12345aaabbb")
        const result = validation.isValid;
        expect(result).toBeFalsy()
    })
    test('test invalid password ', () => {
        const validation = checkValidPassword(123)
        const result = validation.isValid;
        expect(result).toBeFalsy()
    })
    test('test invalid password ', () => {
        const validation = checkValidPassword()
        const result = validation.isValid;
        expect(result).toBeFalsy()
    })
    test('test invalid password ', () => {
        const validation = checkValidPassword(0)
        const result = validation.isValid;
        expect(result).toBeFalsy()
    })
   



})


describe('testing checkValidUserName()', () => {
    let validation = {
        isValid: true,
        errorMsg: ''
    }
    test('testing empty username', () => {
        const validation = checkValidUserName("")
        const result = validation.isValid;
        expect(result).toBeFalsy()
    })

    test('testing empty username', () => {
        const validation = checkValidUserName()
        const result = validation.isValid;
        expect(result).toBeFalsy()
    })
    test('testing empty username', () => {
        const validation = checkValidUserName("abc")
        const result = validation.isValid;
        expect(result).toBeTruthy()
    })
    test('testing empty username', () => {
        const validation = checkValidUserName(123)
        const result = validation.isValid;
        expect(result).toBeFalsy()
    })
    test('testing empty username', () => {
        const validation = checkValidUserName('@#')
        const result = validation.isValid;
        expect(result).toBeTruthy()
    })
    test('testing empty username', () => {
        const validation = checkValidUserName(0)
        const result = validation.isValid;
        expect(result).toBeFalsy()
    })

})

describe('test checkValidPan_DOB()', () => {
    let validation = {
        isValid: true,
        errorMsg: ''
    }
    test('test invalid checkValidPan_DOB()', () => {
        const validation = checkValidPan_DOB("")
        const result = validation.isValid
        expect(result).toBeFalsy()
    })
    test('test ', () => {
        const validation = checkValidPan_DOB("123")
        const result = validation.isValid
        expect(result).toBeFalsy()


    })

    test('test invalid checkValidPan_DOB()', () => {
        const validation = checkValidPan_DOB("abcd")
        const result = validation.isValid
        expect(result).toBeFalsy()


    })

    test('test invalid checkValidPan_DOB()', () => {
        const validation = checkValidPan_DOB("-123")
        const result = validation.isValid
        expect(result).toBeFalsy()


    })
    test('test invalid checkValidPan_DOB()', () => {
        const validation = checkValidPan_DOB()
        const result = validation.isValid
        expect(result).toBeFalsy()


    })
    test('test valid checkValidPan_DOB()', () => {
        const validation = checkValidPan_DOB("12345678")
        const result = validation.isValid
        expect(result).toBeTruthy()


    })
    test('test valid checkValidPan_DOB()', () => {
        const validation = checkValidPan_DOB(0)
        const result = validation.isValid
        expect(result).toBeFalsy()
    })

   
})

describe('testing getColorCode', () => {
    test('testing getColorCode(negative)', () => {
        const result = getColorCode("-10");
        expect(result).toBe("negativeColor")

    })
    test('testing getColorCode(positive)', () => {
        const result = getColorCode("10");
        expect(result).toBe("positiveColor")

    })
    test('testing getColorCode(positive)', () => {
        const result = getColorCode("aa");
        expect(result).toBe("positiveColor")

    })
    test('testing getColorCode(positive)', () => {
        const result = getColorCode(0);
        expect(result).toBe("")

    })

    test('testing getColorCode(positive)', () => {
        const result = getColorCode("0");
        expect(result).toBe("whiteColor")

    })
    test('testing getColorCode(positive)', () => {
        const result = getColorCode(null);
        expect(result).toBeFalsy()

    })
    
})

describe('testing specialCharFinder()', () => {
    test('specialCharFinder("ab@*")', () => {
        const result = specialCharFinder("ab@*")
        expect(result).toBeTruthy()
    })
    test('specialCharFinder("abcd")', () => {
        const result = specialCharFinder("abcd")
        expect(result).toBeFalsy()
    })
    test('specialCharFinder("123")', () => {
        const result = specialCharFinder("123")
        expect(result).toBeFalsy()
    })
    test('specialCharFinder()', () => {
        const result = specialCharFinder()
        expect(result).toBeFalsy()
    })
    test('specialCharFinder()', () => {
        const result = specialCharFinder(null)
        expect(result).toBeFalsy()
    })
    test('specialCharFinder()', () => {
        const result = specialCharFinder(0)
        expect(result).toBeFalsy()
    })
    test('specialCharFinder()', () => {
        const result = specialCharFinder('')
        expect(result).toBeFalsy()
    })

})
describe('testing replaceComma()', () => {
    test('testing replaceComma(a,b,c)', () => {
        const result = replaceComma('a,b,c')
        expect(result).toBe('abc')
    })
    test('testing replaceComma()', () => {
        const result = replaceComma('12*3 abc')
        expect(result).toBe('12*3 abc')
    })
    test('testing replaceComma()', () => {
        const result = replaceComma()
        expect(result).toBeUndefined()
    })
    test('testing replaceComma()', () => {
        const result = replaceComma(0)
        expect(result).toBeFalsy()
    })
    test('testing replaceComma()', () => {
        const result = replaceComma(null)
        expect(result).toBeFalsy()
    })
    test('testing replaceComma()', () => {
        const result = replaceComma('')
        expect(result).toBeFalsy()
    })
   
})


describe('testing getPositive_Negative_ColorCode()', () => {
    test('testing getPositive_Negative_ColorCode for negatives', () => {
        const result = getPositive_Negative_ColorCode("-100")
        expect(result).toBe('#D13A43')
    })
    test('tesing getPositive_Negative_ColorCode for positives', () => {
        const result = getPositive_Negative_ColorCode('100')
        expect(result).toBe('#34D178')
    })
})

describe('testing countDecimals()', () => {
    test('testing countDecimals(1.11)', () => {
        const result = countDecimals(1.11)
        expect(result).toBe(2)
    })
    test('testing countDecimals(10)', () => {
        const result = countDecimals(10)
        expect(result).toBe(0)
    })
    test('testing countDecimals(abc)', () => {
        const result = countDecimals('abc')
        expect(result).toBe(0)
    })
    test('testing countDecimals(abc)', () => {
        const result = countDecimals('abc.d')
        expect(result).toBe(1)
    })
   
    test('testing countDecimals(abc)', () => {
        const result = countDecimals('')
        expect(result).toBeFalsy()
    })
    test('testing countDecimals(abc)', () => {
        const result = countDecimals(0)
        expect(result).toBeFalsy()
    })


})

describe('testing getValidDate()', () => {
    test('testing getValidDate()', () => {
        const result = getValidDate("14/07/2020")
        const date = new Date("07/14/2020")
        const expresult = date.toLocaleString()
        expect(result).toBe(expresult)

    })
    test('getValidDate("")',()=>{
        const result = getValidDate("")
        console.log(result)
        expect(result).toBeUndefined()


    })
})
describe('testing getTime()', () => {
    test('', () => {
        const result = getTime("14/07/2020")
        const date = new Date("7/14/2020")
        const expresult = date.toLocaleTimeString()
        expect(result).toBe(expresult)
    })

    test('', () => {
        const result = getTime("142020")

        expect(result).toBe("Invalid Date")
    })

    test('', () => {
        const result = getTime("")

        expect(result).toBeUndefined()
    })
    test('', () => {
        const result = getTime("abc")

        expect(result).toBe("Invalid Date")
    })
    test('', () => {
        const result = getTime(0)

        expect(result).toBeUndefined()
    })
    test('', () => {
        const result = getTime(null)

        expect(result).toBeUndefined()
    })

    test('', () => {
        const result = getTime()

        expect(result).toBeUndefined()
    })
})
describe('', () => {
    test('testing getFormatedDate() ', () => {
        const result = getFormatedDate("1/7/2020", 0, DATE_FORMATS.DEFAULT).stringDate
        expect(result).toBe("2020-01-07")

    })
    test('testing getFormatedDate() ', () => {
        const result = getFormatedDate("1/7/2020", 0, DATE_FORMATS.DDMMYYYY).stringDate
        expect(result).toBe("07/01/2020")

    })
    test('testing getFormatedDate() ', () => {
        const result = getFormatedDate("1-7-2020", 1, DATE_FORMATS.DDMMYYYY).stringDate
        expect(result).toBe("08/01/2020")

    })
    test('testing getFormatedDate() ', () => {
        const data = new Date()
        const result = getFormatedDate(data, 0, DATE_FORMATS.DDMMYYYY).stringDate
        expect(result).not.toBeNull()

    })
    
    
    test('testing getFormatedDate() ', () => {
        const data = new Date()
        const result = getFormatedDate("2020", 0, DATE_FORMATS.DDMMYYYY).stringDate
        expect(result).toBe("01/01/2020")

    })
    test('testing getFormatedDate() ', () => {
        const data = new Date()
        const result = getFormatedDate(1, 0, DATE_FORMATS.DDMMYYYY).stringDate
        expect(result).toBe("01/01/1970")

    })
    test('testing getFormatedDate() ', () => {
        const data = new Date()
        const result = getFormatedDate(null, 0, DATE_FORMATS.DDMMYYYY).stringDate
        expect(result).toBe("01/01/1970")

    })
    // test('testing getFormatedDate() ', () => {
    //     const data = new Date()
    //     const result = getFormatedDate("16/07/2020", 0).stringDate
    //     expect(result).toBe("07/01/2020")

    // })
    // test('testing getFormatedDate() ', () => {
    //     const data = new Date()
    //     const result = getFormatedDate(null, 0, DATE_FORMATS.DDMMYYYY).stringDate
    //     expect(result).toBeNaN()

    // })


})

describe('testing getUpDownFlash()', () => {
    test('testing getUpDownFlash()', () => {
        const result = getUpDownFlash(100, 200, 'flash-positive')
        expect(result).toBe('flash-positive2')
    })
    test('testing getUpDownFlash()', () => {
        const result = getUpDownFlash(100, 200, '')
        expect(result).toBe('flash-positive')
    })
})

describe('testing getHighlightFlash()', () => {
    test('testing getHighlightFlash()', () => {
        const result = getHighlightFlash(100, 200, 'flash-highlight')
        expect(result).toBe('flash-highlight2')
    })
    test('testing getHighlightFlash()', () => {
        const result = getHighlightFlash(100, 200, '')
        expect(result).toBe('flash-highlight')
    })
})



describe(" testing sortByInt", () => {

    const sortAsc = true
    test('', () => {
        const result = sortByInt(sortAsc, org_array, "chngPer")
        expect(result).toStrictEqual(exp_array_Int)

    })

    test('', () => {
        const result = sortByInt(false, org_array, "chngPer")
        console.log(result)
        expect(result).not.toStrictEqual(exp_array_Int)

    })

    test('', () => {
        const result = sortByInt(false, [], "chngPer")
        console.log(result)
        expect(result).toStrictEqual([])

    })
    // test('', () => {
    //     const expected=[{"sym": {
    //         "exc": "BSE",
    //         "series": "EQ"}}]
    //     const result = sortByInt(true, org_array, "chngPer")
    //     // console.log(result)
    //     expect(result).toEqual(expect.objectContaining(expected))

    // })


}
)


describe('testing sortByString()', () => {
    const sortAsc = true
    test('testing valid sortByString()', () => {
        const result = sortByString(sortAsc, org_array, "dispSym")
        expect(result).toStrictEqual(exp_array_string)

    })

    test('testing valid sortByString()', () => {
        const result = sortByString(false, org_array, "dispSym")
        expect(result).not.toStrictEqual(exp_array_string)

    })

    test('testing valid sortByString()', () => {
        const result = sortByString(true, org_array)
        expect(result).toStrictEqual(org_array)

    })
})

test('testing getApiReqValue', () => {
    const result = getApiReqValue('market')
    const key = "MARKET"
    expect(result).toBe(ORDER_TYPE_API_KEY_MAP[key])
})

describe('testing findTickSize(2, 10.06, 4)', () => {
    test('testing findTickSize', () => {
        const result = findTickSize(2, 10.06, 4)

        expect(result).toBe(2.06)

    })

    test('testing findTickSize((2, 349.1234, "")', () => {
        const result = findTickSize(2, 349.1234, "")

        expect(result).toBeNaN()

    })
    test('testing findTickSize(2, 349.1234)', () => {
        const result = findTickSize(2, 349.1234)

        expect(result).toBeFalsy()

    })
    test('testing findTickSize("2", 349.1234)', () => {
        const result = findTickSize("2", 349.1234)

        expect(result).toBeFalsy()

    })

    test('testing findTickSize()', () => {
        const result = findTickSize()

        expect(result).toBeFalsy()

    })

    test('testing findTickSize(2, 10, 1)', () => {
        const result = findTickSize(2, 10, 1)

        expect(result).toBe(0.00)

    })

    test('testing findTickSize(0, 10.11, 1)', () => {
        const result = findTickSize(0, 10.11, 1)
        expect(result).toBe(0)

    })


    test('testing findTickSize(0, 349.1234, 1)', () => {
        const result = findTickSize(0, 349.1234, 1)
        expect(result).toBe(0)

    })
})

describe('testing checkValidWatchlistName', () => {
    test('testing checkValidWatchlistName()', () => {
        const result = checkValidWatchlistName("abc")
        expect(result).toBeTruthy()
    })
    test('testing checkValidWatchlistName("123")', () => {
        const result = checkValidWatchlistName("123")
        expect(result).toBeTruthy()
    })
  
    test('testing checkValidWatchlistName("")', () => {
        const result = checkValidWatchlistName("")
        expect(result).toBeTruthy()
    })
    test('testing checkValidWatchlistName(0)',()=>{
        const result=checkValidWatchlistName(0)
        expect(result).toBeTruthy()
    })
    test('testing checkValidWatchlistName(12)',()=>{
        const result=checkValidWatchlistName(12)
        expect(result).toBeTruthy()
    })
    test('testing checkValidWatchlistName(abc@1)', () => {
        const result = checkValidWatchlistName("abc@1")
        expect(result).toBeFalsy()
    })
})

describe('testing getIndicesList()', () => {
    const combinedList = [];
    const ExcList_NSE = [];
    const ExcList_BSE = [];
    const list = []
    const exp_result = { combinedList: list, ExcList_NSE, ExcList_BSE }


    test('', () => {
        const result = getIndicesList()
        console.log(result)
        expect(result).toMatchObject(exp_result)
    })
})



