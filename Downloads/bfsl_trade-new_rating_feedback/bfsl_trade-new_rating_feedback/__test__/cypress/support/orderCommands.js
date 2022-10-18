import { URL, ORDER_SYMBOL, ORDER_KEYS, MARKET_ORDER, PRODUCT_TYPES, ORDER_TYPES, VALIDITY, ORDER_PATH } from '../support/config'
import { easeCircle } from 'd3'

// ---------------------------
//Order placement
Cypress.Commands.add('placeorder', (symbol, orderData) => {

    // cy.server()
    // cy.route('POST', '/MasterSymbol/Search/1.0.0').as('Search')
    // cy.route('POST', '/Trade/PlaceOrder').as('PlaceOrder')

    /*cy.input('.symSearch-base .input-addOn input', symbol)
    cy.wait(3000)

    cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click()
    // cy.get('.searchResutDiv .symbolRow-div .btn-div .buy-btn:first').click()

    cy.wait(3000) */
    // cy.isVisible('.home-header-container')

    Object.keys(orderData).map((key, index) => {
        console.log('orderData', index)
        console.log('orderData', key)

        // cy.wait(300)
        if (key === ORDER_KEYS.PRODUCT_TYPE) {
            if (orderData[key] === "CO" || orderData[key] === "BO") {
                cy.get('.prdTypeDiv .productType').contains('INTRADAY').click({ force: true })
                cy.wait(1000)
                cy.get('.orderPadBase .orderField').contains(orderData[key]).click({ force: true })
            }
            cy.get('.prdTypeDiv .productType').contains(orderData[key]).click({ force: true })

            // cy.get('.product_type_div .menu').contains(orderData[key]).click({ force: true })
            cy.wait(100)
        }
        else if (key === ORDER_KEYS.ORDER_TYPE) {
            cy.get('.orderPadBase .orderField').contains(orderData[key]).click({ force: true })

            // cy.get('.orderField').contains(orderData[key]).click({ force: true })
            cy.wait(10)

        }
        else if (key === ORDER_KEYS.QTY) {
            // cy.input('.login-base [name="userName"]', username)

            cy.input('.orderPadBase .fieldRow [name="qty"]', orderData[key])
        }
        else if (key === ORDER_KEYS.DISCLOSED_QTY) {
            cy.input('.dis_qty_div input', orderData[key])
        }
        else if (key === ORDER_KEYS.PRICE) {
            // cy.input('.price_div input', orderData[key])
            cy.get('.orderPadBase .priceField  input[name="price"]')
                .invoke('val')
                .then(sometext => {
                    cy.input('.orderPadBase .priceField  input[name="price"]', sometext - 1)
                });
        }
        else if (key === ORDER_KEYS.TRIGGER_PRICE) {
            // cy.input('.trigger_price_div input', orderData[key])

            cy.get('.orderPadBase .priceField  input[name="price"]').then(($btn) => {
                const txt = $btn.text()
                cy.log(txt)
                // cy.log(txt)
                cy.input('.fieldRow .field [name="triggerPrice"]', txt)
            });
           
        }
        else if (key === ORDER_KEYS.SLM_TRIGGER_PRICE) {
            cy.log('slm')
            cy.get('.tickSize.hidden').then(($b1) => {
                const ticksize = $b1.text()
                cy.log(ticksize)
                cy.input('.trigger_price_div input', ticksize * 1000)

            })
        }
        else if (key === ORDER_KEYS.SQUARE_OFF) {
            cy.input('.fieldRow .field [name="squareOff"]', orderData[key])
        }
        else if (key === ORDER_KEYS.BO_SQUARE_OFF) {
            // cy.input('.trigger_price_div input', orderData[key])

            cy.get('.orderPadBase .priceField  input[name="price"]').then(($btn) => {
                const txt = $btn.text()
                cy.log(txt)
                // cy.log(txt)
                cy.input('.fieldRow .field [name="squareOff"]', txt)
            });


        }
        else if (key === ORDER_KEYS.STOP_LOSS) {
            cy.input('.fieldRow .field [name="stopLoss"]', orderData[key])
        }
        else if (key === ORDER_KEYS.BO_STOP_LOSS) {
            // cy.input('.trigger_price_div input', orderData[key])

            cy.get('.orderPadBase .priceField  input[name="price"]').then(($btn) => {
                const txt = $btn.text()
                cy.log(txt)
                // cy.log(txt)
                cy.input('.fieldRow .field [name="stopLoss"]', txt)
            });

        }

        else if (key === ORDER_KEYS.TRAILING_STOPLOSS) {

            cy.input('.fieldRow .field [name="trailStopLoss"]', orderData[key])
        }
        else if (key === ORDER_KEYS.VALIDITY) {
            cy.input('.validity_div input', orderData[key])
        }
        else if (key === ORDER_KEYS.AMO) {
            cy.get('.AMO .AMOcheckboxDiv input[name="AMO"]').click({ force: true })
        }
        else if (key === ORDER_KEYS.VALID_PRICE) {
            cy.get('div.range > span > span.lowerCircuitVal').then(($btn) => {
                const txt = $btn.text()
                cy.log(txt)
                cy.input('[name="price"]', txt)
            })

        }
        else if (key === ORDER_KEYS.VALID_CUPRICE) {
            cy.get('div.range > span > span.lowerCircuitVal').then(($btn) => {
                const txt = $btn.text()
                cy.get('.orderPadBase .footer .actionDiv .tickSize').then(($span) => {
                    const ticksize = $span.text()
                    const t1 = Math.round(txt)
                    const rem = txt % ticksize
                    cy.log(txt)
                    cy.log('ticksize', ticksize)
                    cy.log('rem', rem)
                    cy.input('[name="price"]', txt + rem)


                })
            })
        }

    })

    cy.wait(10)
    cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    cy.wait(1000)
    cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
    cy.wait(1000)
    cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })

})


// open search bar and type symbol
Cypress.Commands.add("openSearch", (symbol, Exchange, buyorsell) => {
    cy.get('.symSearch-base .input-addOn .input-ele').focus()

    // cy.get('.symSearch-base .input-addOn input').focus()
    // if (Exchange == "MCX" || Exchange == "BCO" || Exchange == "ICEX") {
    // cy.get('.dropdown-div .assetMenu').contains("COMMODITY").click()
    // }
    // if (Exchange == "BCD") {
    //     cy.get('.dropdown-div .assetMenu').contains("CURRENCY").click()
    // }
    // if (Exchange == "NFO" || Exchange == "BFO" || Exchange == "MCX" || Exchange == "BCO" || Exchange == "ICEX" || Exchange == "BCD") {
    //     cy.get('.segment-div .flex-center').contains('FUTURE').click()
    // }
    // if (Exchange == 'NFO-O' || Exchange == "MCX-O") {
    //     cy.get('.segment-div .flex-center').contains('OPTION').click()
    // }
    // cy.get('.symSearch-base .input-addOn .input-ele').type("abc")

    cy.get('.symSearch-base .input-addOn .input-ele').clear()
    cy.get('.symSearch-base .input-addOn .input-ele').type(symbol)
    cy.wait(2000)

    if (buyorsell == "BUY")
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
    if (buyorsell == "SELL") {
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .sell-btn:first').click({ force: true })
    }
    cy.wait(100);

})

Cypress.Commands.add('navigateWatchlist', (value) => {

    cy.get('[test_id="menu_WATCHLIST"]').click()
    cy.url().should('contain', '/home/watchlist')
    if (value) {
        cy.wait(1000)
        cy.modifyWatchlistGroup(value)
    }
})

Cypress.Commands.add("tradeWindowClose", () => {

    cy.window().then((win) => {

        // cy.get('div.tradeBase > div > div.header > div.actionDiv > div.cursor.flex-center > img').click({ force: true })
        // cy.get('div.tradeBase .div.footer .div.content .div.actionDiv .button.negativeBtn').click({ force: true })

        // cy.get('.orderPadBase .actionDiv .cursor').click({force:true})
        cy.get('.tradeBase .footer .content .actionDiv .negativeBtn').click({force:true})
    })
})

Cypress.Commands.add('updatePrdandOrdType', (productType, orderType) => {
    cy.window().then((win) => {
        if (productType !== '' && orderType !== '') {
            if (productType === PRODUCT_TYPES.PRD_BO || productType === PRODUCT_TYPES.PRD_CO) {
                cy.get('.prdTypeDiv .productType').contains('INTRADAY').click({ force: true })
                cy.wait(500)
                cy.get('.orderPadBase .orderField').contains(productType).click({ force: true })
                cy.wait(500)
                cy.get('.oTypeDiv .cursor').contains(orderType).click({ force: true })

            }
            else {
                // cy.get('.window .content .product_type_div .data span')
                cy.get('.prdTypeDiv .productType').contains(productType).click({ force: true })
                cy.wait(10)
                cy.get('.oTypeDiv .cursor').contains(orderType).click({ force: true })
            }
        }

    })
})

Cypress.Commands.add('checkTradeProperties', (value) => {
    cy.isVisible('.fieldRow [name="qty"]')
    cy.isVisible('.orderAction .BUY')
    cy.isVisible('.orderAction .SELL')
    cy.isVisible('.orderPadBase .header .symName')
    cy.isVisible('.orderPadBase .bottom .changeVal')
    cy.isVisible('.footer .actionDiv .negativeBtn')
    cy.isVisible('.footer .actionDiv .positiveBtn ')
    cy.isVisible('.tradeBase .market-depth-base .mdContent')
    // if (value == "Equity") {
    cy.isVisible('.orderPadBase .moreOptBtn')
    // } else if (value == "Derivative" || value == 'Commodity' || value == "Currency")


})


Cypress.Commands.add('checkTradeTNCProperties', (isMarketOrder) => {
    // cy.isVisible('.fieldRow [name="disQty"]');
    if (isMarketOrder === ORDER_TYPES.ORD_LIMIT) {
        cy.isVisible('.fieldRow .priceField ');
        // cy.isVisible('.fieldRow .AMO');
    } else if (isMarketOrder === ORDER_TYPES.ORD_SL) {
        cy.isVisible('.fieldRow .priceField ');

        // cy.isVisible('.tradeFields .amo_div');
        cy.isVisible('.fieldRow .field [name="triggerPrice"]')
    } else if (isMarketOrder === ORDER_TYPES.ORD_SLM) {
        // cy.isDisable('.tradeFields .inputRow .price_div');
        // cy.isVisible('.tradeFields .amo_div');
        cy.isVisible('.fieldRow .field [name="triggerPrice"]')

    }
    else {
        // cy.isDisable('.tradeFields .inputRow .price_div');
    }
})


Cypress.Commands.add('checkTradeMFTProperties', (isMarketOrder) => {
    // cy.isVisible('.fieldRow [name="disQty"]');
    if (isMarketOrder === ORDER_TYPES.ORD_LIMIT) {
        cy.isVisible('.fieldRow .priceField ');
        cy.isVisible('.fieldRow .AMO');
    } else if (isMarketOrder === ORDER_TYPES.ORD_SL) {
        cy.isVisible('.fieldRow .priceField ');

        // cy.isVisible('.tradeFields .amo_div');
        cy.isVisible('.fieldRow .field [name="triggerPrice"]')
    } else if (isMarketOrder === ORDER_TYPES.ORD_SLM) {
        // cy.isDisable('.tradeFields .inputRow .price_div');
        // cy.isVisible('.tradeFields .amo_div');
        cy.isVisible('.fieldRow .field [name="triggerPrice"]')

    }
    else {
        // cy.isDisable('.tradeFields .inputRow .price_div');
    }
})


Cypress.Commands.add('checkTradeCOBOProperties', (prdType, orderType) => {
    orderType
    // check available fields.
    if (prdType == PRODUCT_TYPES.PRD_BO) {

        cy.isVisible('.fieldRow .priceField ');
        cy.isVisible('.fieldRow .field [name="trailStopLoss"]')
        cy.isVisible('.fieldRow .field [name="stopLoss"]')
        cy.isVisible('.fieldRow .field [name="squareOff"]')
        cy.get('.orderPadBase .moreOptBtn').click({ force: true })
        // cy.isVisible('.orderPadBase .fieldRow.validityField .field.orderField')

        // cy.get('.orderPadBase .fieldRow.validityField .field.orderField .radioField .value').contains('DAY')

        if (orderType === ORDER_TYPES.ORD_SL) {
            cy.isVisible('.fieldRow .field [name="triggerPrice"]')

        }
    } else if (prdType == PRODUCT_TYPES.PRD_CO) {

        // cy.isVisible('.tradeFields .stoploss_div .inputData');
        //cy.isDisabled('.tradeFields .dis_qty_div .inputData');
        // cy.get('.tradeFields .dis_qty_div .inputData').should('have', "disabled");
        cy.get('.orderPadBase .moreOptBtn').click({ force: true })
        // cy.isVisible('.orderPadBase .fieldRow.validityField .field.orderField')
        if (orderType === ORDER_TYPES.ORD_LIMIT) {
            cy.isVisible('.fieldRow .priceField');

        } else {
            // cy.get('.fieldRow .field [name="price"]')
            //     .should('have.class', 'disabled')
            // cy.isDisable('.fieldRow .field [name="price"]');
        }

    }
})



Cypress.Commands.add('modifyWatchlistGroup', (groupName) => {
    cy.get('.widget-header > .select-input-div > .select-input > .downArrowIcon').click()
    cy.get('.options-div span [title= Sample' + groupName + ']').click({ force: true })
    cy.wait(2000)
})

Cypress.Commands.add('derivativeNRMLMISProp', (productType, orderType) => {
    // cy.isDisable('.tradeFields .inputRow .dis_qty_div')
    if (productType == PRODUCT_TYPES.PRD_NRML || productType == PRODUCT_TYPES.PRD_MIS) {

        if (orderType == ORDER_TYPES.ORD_SL) {
            cy.isVisible('.fieldRow .field [name="triggerPrice"]')
            cy.isVisible('.fieldRow .priceField ')
            // cy.get('.validityDiv').contains('DAY')
            cy.get('.validityDiv .radioField').should(($lis) => {
                expect($lis).to.have.length(1)
                expect($lis.eq(0)).to.contain(VALIDITY.DAY)
                // expect($lis.eq(1)).to.contain(VALIDITY.IOC)
            })
            // cy.isVisible('.tradeFields .amo_div');
        }
        if (orderType == ORDER_TYPES.ORD_SLM) {
            cy.isVisible('.fieldRow .field [name="triggerPrice"]')
            cy.get('.validityDiv .radioField').should(($lis) => {
                expect($lis).to.have.length(2)
                expect($lis.eq(0)).to.contain(VALIDITY.DAY)
                expect($lis.eq(1)).to.contain(VALIDITY.IOC)
            })
            // cy.isVisible('.tradeFields .amo_div');
        }
        else if (orderType == ORDER_TYPES.ORD_LIMIT) {
            cy.isVisible('.fieldRow .priceField ')
            cy.get('.validityDiv .radioField').should(($lis) => {
                expect($lis).to.have.length(1)
                expect($lis.eq(0)).to.contain(VALIDITY.DAY)
                // expect($lis.eq(1)).to.contain(VALIDITY.IOC)
                // expect($lis.eq(2)).to.contain(VALIDITY.COL)
            })
            // cy.isVisible('.tradeFields .amo_div')

        } else if (orderType == ORDER_TYPES.ORD_MRK) {
            // cy.isDisable('.tradeFields .inputRow .price_div')
            cy.get('.validityDiv .radioField').should(($lis) => {
                expect($lis).to.have.length(2)
                expect($lis.eq(0)).to.contain(VALIDITY.DAY)
                expect($lis.eq(1)).to.contain(VALIDITY.IOC)
                // expect($lis.eq(2)).to.contain(VALIDITY.COL)
            })
            // cy.isVisible('.tradeFields .amo_div')
        }

    }
})

/*Cypress.Commands.add('derivativeBoCoprop',(productType,orderType) => {
    cy.isDisable('.tradeFields .inputRow .dis_qty_div')

    if(productType == PRODUCT_TYPES.PRD_BO) {
        cy.get('.tradeFields .first .data .menu').should(($lis) => {
            expect($lis).to.have.length(2)
            expect($lis.eq(0)).to.contain(ORDER_TYPES.ORD_LIMIT)
            expect($lis.eq(1)).to.contain(ORDER_TYPES.ORD_SL)
        })
        cy.isVisible('.tradeFields .inputRow .price_div')
        cy.isVisible('.tradeFields .square_off_div .inputData');
        cy.isVisible('.tradeFields .stoploss_div .inputData');
        cy.isVisible('.tradeFields .trail_stoploss_div .inputData');
        cy.get('.tradeFields .validity_div .data .options').should(($lis) => {
            expect($lis).to.have.length(1)
            expect($lis.eq(0)).to.contain(VALIDITY.DAY)
        })
        if(orderType == ORDER_TYPES.ORD_SL) {
            cy.isVisible('.tradeFields .trigger_price_div .inputData')
        }
    }
    if(productType == PRODUCT_TYPES.PRD_CO) {
        
        cy.isVisible('.tradeFields .stoploss_div .inputData');
        cy.get('.tradeFields .validity_div .data .options').should(($lis) => {
            expect($lis).to.have.length(1)
            expect($lis.eq(0)).to.contain(VALIDITY.DAY)
        })
        if(orderType == ORDER_TYPES.ORD_MRK) {
            cy.isDisable('.tradeFields .inputRow .price_div')
        } else {
            cy.isVisible('.tradeFields .inputRow .price_div')
        }
    }
})*/
Cypress.Commands.add('commodityNRMLMISProp', (productType, orderType) => {

    if (productType == PRODUCT_TYPES.PRD_NRML || productType == PRODUCT_TYPES.PRD_MIS) {
        // if (orderType == ORDER_TYPES.ORD_LIMIT || ORDER_TYPES.ORD_MRK) {
        // cy.isVisible('.tradeFields .inputRow .dis_qty_div')
        // cy.get('.tradeFields .validity_div .data .options').should(($lis) => {
        //     expect($lis).to.have.length(5)
        //     expect($lis.eq(0)).to.contain(VALIDITY.DAY)
        //     expect($lis.eq(1)).to.contain(VALIDITY.IOC)
        //     expect($lis.eq(2)).to.contain(VALIDITY.EOS)
        //     expect($lis.eq(3)).to.contain(VALIDITY.GTC)
        //     expect($lis.eq(4)).to.contain(VALIDITY.GTD)

        // })
        // }
        // else if(orderType==ORDER_TYPES.ORD_SL || ORDER_TYPES.ORD_SLM)
        // {
        //     cy.isVisible('.tradeFields .inputRow .dis_qty_div')
        //     cy.get('.tradeFields .validity_div .data .options').should(($lis) => {
        //         expect($lis).to.have.length(4)
        //         expect($lis.eq(0)).to.contain(VALIDITY.DAY)
        //         expect($lis.eq(1)).to.contain(VALIDITY.EOS)
        //         expect($lis.eq(2)).to.contain(VALIDITY.GTC)
        //         expect($lis.eq(3)).to.contain(VALIDITY.GTD)

        //     })
        // }
        if (orderType == ORDER_TYPES.ORD_LIMIT) {
            cy.isVisible('.tradeFields .inputRow .dis_qty_div')
            cy.get('.tradeFields .validity_div .data .menu').should(($lis) => {
                expect($lis).to.have.length(4)
                expect($lis.eq(0)).to.contain(VALIDITY.DAY)
                expect($lis.eq(1)).to.contain(VALIDITY.IOC)
                expect($lis.eq(2)).to.contain(VALIDITY.EOS)
                expect($lis.eq(3)).to.contain(VALIDITY.GTC)
                // expect($lis.eq(4)).to.contain(VALIDITY.GTD)


            })
            cy.isVisible('.tradeFields .inputRow .price_div')
            cy.isVisible('.tradeFields .amo_div')
        } else if (orderType == ORDER_TYPES.ORD_MRK) {
            cy.isVisible('.tradeFields .inputRow .dis_qty_div')
            cy.get('.tradeFields .validity_div .data .menu').should(($lis) => {
                expect($lis).to.have.length(4)
                expect($lis.eq(0)).to.contain(VALIDITY.DAY)
                expect($lis.eq(1)).to.contain(VALIDITY.IOC)
                expect($lis.eq(2)).to.contain(VALIDITY.EOS)
                expect($lis.eq(3)).to.contain(VALIDITY.GTC)
                // expect($lis.eq(4)).to.contain(VALIDITY.GTD)

            })
            // cy.isDisable('.tradeFields .inputRow .price_div')
            cy.isHidden('.tradeFields .amo_div')
        } else if (orderType == ORDER_TYPES.ORD_SL) {
            cy.isVisible('.tradeFields .inputRow .dis_qty_div')
            cy.get('.tradeFields .validity_div .data .menu').should(($lis) => {
                expect($lis).to.have.length(3)
                expect($lis.eq(0)).to.contain(VALIDITY.DAY)
                expect($lis.eq(1)).to.contain(VALIDITY.EOS)
                expect($lis.eq(2)).to.contain(VALIDITY.GTC)
                // expect($lis.eq(3)).to.contain(VALIDITY.GTD)

            })
            cy.isVisible('.tradeFields .inputRow .price_div')
            cy.isVisible('.tradeFields .amo_div')
            // cy.isVisible('.tradeFields .trigger_price_div .inputData')
        } else if (orderType == ORDER_TYPES.ORD_SLM) {
            cy.isVisible('.tradeFields .inputRow .dis_qty_div')
            cy.get('.tradeFields .validity_div .data .menu').should(($lis) => {
                expect($lis).to.have.length(3)
                expect($lis.eq(0)).to.contain(VALIDITY.DAY)
                expect($lis.eq(1)).to.contain(VALIDITY.EOS)
                expect($lis.eq(2)).to.contain(VALIDITY.GTC)
                // expect($lis.eq(3)).to.contain(VALIDITY.GTD)

            })
            cy.isVisible('.tradeFields .amo_div')
            // cy.isVisible('.tradeFields .trigger_price_div .inputData')
            // cy.isDisable('.tradeFields .inputRow .price_div')
        }

    }
})

Cypress.Commands.add('currencyNRMLMISProp', (productType, orderType) => {
    cy.isVisible('.tradeFields .inputRow .dis_qty_div')
    if (orderType == ORDER_TYPES.ORD_LIMIT || orderType == ORDER_TYPES.ORD_MRK) {
        cy.get('.tradeFields .validity_div .data .menu').should(($lis) => {
            expect($lis).to.have.length(3)
            expect($lis.eq(0)).to.contain(VALIDITY.DAY)
            expect($lis.eq(1)).to.contain(VALIDITY.IOC)
            expect($lis.eq(2)).to.contain(VALIDITY.EOS)
        })
    } else {
        cy.get('.tradeFields .validity_div .data .menu').should(($lis) => {
            expect($lis).to.have.length(2)
            expect($lis.eq(0)).to.contain(VALIDITY.DAY)
            expect($lis.eq(1)).to.contain(VALIDITY.EOS)
        })
    }

    if (orderType == ORDER_TYPES.ORD_LIMIT) {
        cy.isVisible('.tradeFields .inputRow .price_div')
        cy.isVisible('.tradeFields .amo_div')
    } else if (orderType == ORDER_TYPES.ORD_MRK) {
        // cy.isDisable('.tradeFields .inputRow .price_div')
        // cy.isDisable('.tradeFields .amo_div')
    } else if (orderType == ORDER_TYPES.ORD_SL) {
        cy.isVisible('.tradeFields .inputRow .price_div')
        cy.isVisible('.tradeFields .amo_div')
        cy.isVisible('.tradeFields .trigger_price_div .inputData')
    } else if (orderType == ORDER_TYPES.ORD_SLM) {
        cy.isVisible('.tradeFields .amo_div')
        cy.isVisible('.tradeFields .trigger_price_div .inputData')
        // cy.isDisable('.tradeFields .inputRow .price_div')
    }
})

Cypress.Commands.add("isToday", (someDate) => {
    console.log("someDate", someDate)
    const givenDate = new Date(someDate)
    const today = new Date()
    return givenDate.getDate() == today.getDate() &&
        givenDate.getMonth() == today.getMonth() &&
        givenDate.getFullYear() == today.getFullYear()
})

Cypress.Commands.add("selectCalendarDate", (startDayCount, endDayCount) => {
    const today = new Date()
    if (startDayCount !== 0)
        var day = String(today.getDate() - startDayCount)
    else if (endDayCount !== 0)
        var day = String(today.getDate() + endDayCount)
    else
        var day = String(today.getDate())

    const dayRegex = new RegExp(`^\\b${day}\\b$`)
    cy.log("dayRegex", dayRegex)
    cy.get('.p-datepicker')
        .contains('td', day)
        .click({ force: true })

})
Cypress.Commands.add("TradeSelectionFieldValidation", () => {
    cy.isVisible(".orderDialogConfirm .dialogConfirmBody .symbol-details .symbol-name")
    cy.isVisible(".orderDialogConfirm .dialogConfirmBody .symbol-details .exc")
    cy.get(".orderDialogConfirm .dialogConfirmBody .dialogConfirmDetails .dataRow").contains('order type')
    cy.get(".orderDialogConfirm .dialogConfirmBody .dialogConfirmDetails .dataRow").contains('product type')
    cy.get(".orderDialogConfirm .dialogConfirmBody .dialogConfirmDetails .dataRow").contains('validity')
    cy.get(".orderDialogConfirm .dialogConfirmBody .dialogConfirmDetails .dataRow").contains('quantity')

    // cy.isVisible(".orderConfirm-dialog .content .row [title='ORDER VALUE']")
})

Cypress.Commands.add("TradeCloseifFailed", () => {

    if (Cypress.$('.orderPad-dialog').length == 1) {
        cy.get('.orderPad-dialog .footer button.negativeBtn').click()
        cy.wait(100)
    }
    else if (Cypress.$('.orderConfirm-dialog').length == 1) {
        cy.get(".orderConfirm-dialog .closeIcon").click()

    }
})