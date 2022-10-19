import React from 'react'
import { InfoIcon } from '../components/common/FontIcons'
import InputComponent from '../components/common/InputComponent'
import { checkInt, countHoleNumbers, findTickSize, 
    getDecimal_Precision, getOrderPadErrorMessage, isBuyTradeAction, isSellTradeAction } from "./CommonMethods"
import { INVALID, ORDER_FIELD_MAX_LENGTH_IA, 
    ORDER_FIELD_MAX_LENGTH_PRICE, ORDER_MODIFY_TYPE, ORDER_TYPES } from "./Constants"
import { getLangText } from './lang/LangText'
// import { ORDERPAD_MESSAGES } from "./Messages"

export  function onFocusInvestAmtMethod(val) {
    let insAmount = val
    insAmount = insAmount.toString()
    if (insAmount.length > ORDER_FIELD_MAX_LENGTH_IA) {
        insAmount = parseInt(insAmount.substring(0, ORDER_FIELD_MAX_LENGTH_IA))
        return insAmount
    }
    return null
}

export function onChangeInvestAmtMethod(e) {
    let value = e.target.value
    let valLength = countHoleNumbers(value)
    let result;
    if (value) {
        if (checkInt(value)) {
            if (valLength <= ORDER_FIELD_MAX_LENGTH_PRICE) {
                result =  value
            }
        }
    }
    else {
        result =  ""
    }
    return result
}

export function onBlurInputMethod(fields, fieldValue) {
    let fieldKeyArray = Object.keys(fields)
    let reqInputFields = fieldKeyArray.filter((item) => {
        if (!Array.isArray(fields[item]) && fields[item] && item !== "AMO")
            return item
        return ""
    })

    let error = {}
    let errorMsgs = {}

    reqInputFields.map((item) => {
        if (parseFloat(fieldValue[item]) === 0) {
            error[item] = true
            errorMsgs[item] = getOrderPadErrorMessage(INVALID, item)
        }
    })

    return {error: error, errorMsgs: errorMsgs}
}

export const findSquareOffCompareErr = (tradeType, val1, val2) => {
    // When prefilled, stoplossbuy value should not be greater than 99% of squareoff 
    let error, errorMsgs, hasError,decrementedVal, roundedVal;
    console.log("compare", parseFloat(val1), parseFloat(val2))
    if (isBuyTradeAction(tradeType)) {
        decrementedVal = parseFloat(val2) - parseFloat(val1)
        roundedVal = (parseFloat(parseFloat(val2) * (99/100))).toFixed(2)
        console.log('decrementedVal: ', decrementedVal, roundedVal);      
        if(parseFloat(val1) > roundedVal) {
            error = true
            errorMsgs = getLangText("STOPLOSS_DIFF_ERR", "ORDERPAD")
            hasError = true
        }
        
    } else if (isSellTradeAction(tradeType)) {
        console.log("val1",val1, typeof(parseFloat(val1)) )
        decrementedVal = parseFloat(val1) - parseFloat(val2)
        roundedVal = (parseFloat(parseFloat(val2) * (101/100))).toFixed(2)
        console.log("round", typeof(roundedVal))
        if(parseFloat(val1) < roundedVal) {
            error = true
            errorMsgs = getLangText("STOPLOSS_DIFF_ERR", "ORDERPAD")
            hasError = true
        }
        
    }
    return {error: error, errorMsgs: errorMsgs, hasError:hasError }
}

export function calculatePrefilledStopLossSell(value,exc, ticksize ) {
    // console.log("common1", parseFloat(value), parseFloat(value) - (0.01 * parseFloat(value)),exc)
    let decrementedVal = parseFloat(parseFloat(parseFloat(value) - 
    (0.01 * parseFloat(value))).toFixed(getDecimal_Precision(exc)))
    // console.log('decrementedVal: ', decrementedVal);
    let moduloRes = findTickSize(getDecimal_Precision(exc), decrementedVal,ticksize )
    // console.log('moduloRes: ', moduloRes);
    if(moduloRes !== 0) {
        // if((decrementedVal % 0.1) < ticksize)
        return Math.floor(decrementedVal * 20) / 20
        // else if((decrementedVal % 0.1)  > ticksize)
        //     return Math.ceil(decrementedVal * 20) / 20
    }
    return decrementedVal
}

export function calculatePrefilledStopLossBuy(value,exc, ticksize ) {
    // console.log("common", parseFloat(value), parseFloat(value) + (0.01 * parseFloat(value)))
    let incrementedVal = parseFloat(parseFloat(parseFloat(value) + 
    (0.01 * parseFloat(value))).toFixed(getDecimal_Precision(exc)))
    // console.log('incrementedVal: ', incrementedVal);
    let moduloRes = findTickSize(getDecimal_Precision(exc), incrementedVal,ticksize)
    if(moduloRes !== 0) {
        // if((incrementedVal % 0.1) < ticksize)
        //     return Math.floor(incrementedVal * 20)/20
        // if(parseFloat(incrementedVal % 0.1)  > ticksize)
        return Math.ceil(incrementedVal * 20)/20
    }
    return incrementedVal
}

export function compareStoplLossWithPrice(tradetype, value,priceVal) {
    if(value) {
        if(tradetype === ORDER_TYPES.BUY) {
            if((parseFloat(value) - (0.01 * parseFloat(value))) < priceVal)
                return true
        }
        else if(tradetype === ORDER_TYPES.SELL) {
            if((parseFloat(value) + (0.01 * parseFloat(value))) > priceVal)
                return true
        }
    }
    return null
}

export function LabledInput(props) {
    return (
        <>
            <span className="label">{props.label}
                {(props.isShowHelpInfoText)?
                    <div className="custom-header">
                        <div className="custom-title">
                            <span className="tooltip-icon"><InfoIcon/></span>
                            <span className="hovercard">
                                <div className="custom-tooltip">
                                    <p>{props.helpInfoTextLabel}</p>
                                    <p>{props.helpInfoTextMsg}</p>
                                </div>
                            </span>
                        </div>
                    </div>:
                    null}
            </span>
            <InputComponent
                name={props.name}
                value={props.value}
                onChange={props.onChangeCB}
                disabled={props.disabled}
                onBlur={props.onBlur}
                onFocus={props.onFocus}
                maxLength={props.maxLength}
            />
        </>
    )
}

export function isInPositions(symData,netPositionsData, selectedPType) {
    let netPosIndex = netPositionsData.findIndex(item => item.sym.id === symData.sym.id 
        && item.prdType === selectedPType)
    if(netPosIndex !== -1)
        return true
    return  false

}

export function findBtstStock(args) {
    console.log('findBtstStock: ', args);
    let netPosQty = 0;
    if(isInPositions(args.symData, args.netPositionsData, args.selectedPType)) {
        console.log("123poslopp")
        args.netPositionsData.map(item => {
            console.log('loopitem: ', item);
            if(args.symData.sym.id === item.sym.id && item.prdType === args.selectedPType)
                netPosQty = item.netQty
        })
    }
    let isBtstStock;
    if(args.modifyOrderDetails.modifyType === ORDER_MODIFY_TYPE.SQUARE_OFF) {
        if(parseInt(args.modifyOrderDetails.symDetails.btst) > 0)
            isBtstStock = true
    }
    // if(tradeType === ORDER_TYPES.SELL) {
    if (args.holdingsResp && args.holdingsResp.length) {   
        args.holdingsResp.map((hItem) => {
            if(args.isinVal === hItem.isin && args.selectedPType === hItem.prdType)  {
                console.log("123test", args.qty, netPosQty)
                if(parseInt(args.qty) > parseInt(netPosQty) && parseInt(hItem.btst) > 0) {
                    isBtstStock = true
                }
            }
        })  
    }
    // }
    return isBtstStock
}

export function findIsHoldingsStockFlag(isinVal, holdingsResp, selectedPType) {
    console.log('123symDetails: ', isinVal, holdingsResp);
    let isHoldingsStockFlag;
    if (holdingsResp && holdingsResp.length) {   
        holdingsResp.map((hItem) => {
            console.log('hItem: ', hItem);
            if(isinVal === hItem.isin && hItem.prdType === selectedPType)  {            
                isHoldingsStockFlag = true
            }
        }) 
    }
    return isHoldingsStockFlag; 
}

export function findToBeAuthorisedFlag(args) {
    console.log("123auth", args)
    let netPosQty = 0;
    if(args.netPositionsData && args.netPositionsData.length) {
        args.netPositionsData.map(item => {
            if(item.sym.id === args.symDetails.id && args.selectedPType === item.prdType) {
                netPosQty = item.netQty
                console.log('netPosQty: ', netPosQty);
            }
        })
    }
    console.log('2netPosQty: ', netPosQty);
    let toBeAuthorised;
    let holdingsList = args.holdingsData.holdings
    if (holdingsList && holdingsList.length) {   
        holdingsList.map((hItem) => {
            console.log('hItem: ', hItem,args.isin);
            if(args.isin === hItem.isin && args.selectedPType === hItem.prdType)  {
                if(args.modifyOrderDetails.modifyType === ORDER_MODIFY_TYPE.SQUARE_OFF) {
                    if(parseInt(args.qty) > (parseInt(hItem.btst) )) {
                        if(!args.isAuthorised) {
                            toBeAuthorised = true
                        }
                    }
                }
                else {
                    console.log("123argstest", args.qty, hItem.btst, netPosQty)
                    if(parseInt(args.qty) > (parseInt(hItem.btst) + parseInt(netPosQty))) {
                        if(!args.isAuthorised) {
                            toBeAuthorised = true
                        }
                    }
                }
            }
        }) 
    }
    console.log('toBeAuthorised: ', toBeAuthorised);
    return toBeAuthorised; 
}

export function isSellingOutOfPositions(symData, qty, selectedPType, netPositionsData) { 
    console.log('symData, selectedPType, netPositionsData: ', symData, selectedPType, netPositionsData);
    let result = false;
    let isPositionIndex =  netPositionsData.findIndex(item => {return symData.sym.id === item.sym.id 
    &&  selectedPType === item.prdType}) 
    if(isPositionIndex !== -1) {
        console.log("test1234")
        netPositionsData.map((item,index) => { 
            if(index === isPositionIndex) {
                console.log("test12345", qty,item.netQty )
                if(qty > parseInt(item.netQty))
                    result =  true
            }
        })
    }
    return result
}

export function isSellingPositionQty(symData, qty, netPositionsData, selectedPType, holdingsData) {
    let result;
    if(isInPositions(symData,netPositionsData, selectedPType)) {
        netPositionsData.map(item => {
            holdingsData.map(hItem => {
                console.log("123item", item,qty,symData, selectedPType, holdingsData)
                if(symData.sym.id === item.sym.id && 
                symData.sym.id === hItem.sym.id && selectedPType === item.prdType && selectedPType === hItem.prdType) {
                    // if(holdingsData) 
                    if(parseInt(qty) > (parseInt(item.netQty) + parseInt(hItem.qty))) {
                        console.log("123innerloop")
                        result = true
                    }
                }
                return null
            })
            return null
        })
    }
    else {
        holdingsData.map(hItem => {
            console.log("123item", hItem,qty,symData, selectedPType, holdingsData)
            if(symData.sym.id === hItem.sym.id && 
            symData.sym.id === hItem.sym.id && selectedPType === hItem.prdType) {
                // if(holdingsData) 
                if(parseInt(qty) > (parseInt(hItem.qty))) {
                    console.log("123innerloop")
                    result = true
                }
            }
            return null
        })
    }
    console.log('123result: ', result);
    return result
}
