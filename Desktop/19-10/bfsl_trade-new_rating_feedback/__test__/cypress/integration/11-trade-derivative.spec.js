import {
    URL, USER_NAME, PASSWORD, PAN_NUMBER, ORDER_SYMBOL, PRODUCT_TYPES,
    ORDER_TYPES, WATCH_MIN_SELL, WATCH_MIN_BUY, VALIDITY, ORDER_PATH, ORDER_KEYS, SEARCH_PATH
} from '../support/config'

before(function () {
    cy.visit(URL)
    Cypress.Cookies.defaults({
        preserve: ['JSESSIONID', 'Auth-Token'],
    })
})

describe("Trade Derivative window", () => {

    // for single file execution 
    it('username  - valid', () => {
        cy.wait(1000)
        cy.login(USER_NAME, PASSWORD, PAN_NUMBER)
        cy.wait(3000)
        cy.isLoginSuccess()
    })

    it("TC_BFSL_Trade_Equity_003: To validate that the click on buy button redirect the user to the Trade buy order screen", () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({ force: true })
        cy.wait(1000)
        cy.searchSymbol("tcs nfo",{ delay: 1})
        cy.wait(2000)
        cy.get('.searchResutDiv').get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        cy.get('.orderAction .BUY')
            .should('have.class', 'active')
            .and('not.have.class', 'inactive')
    })

    it("TC_BFSL_Trade_Equity_004: To validate that the click on buy button redirect the user to the Trade buy order screen", () => {
        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })

        cy.get('.orderAction .SELL')
            .should('have.class', 'active')
            .and('not.have.class', 'inactive')

    })
    it("TC_BFSL_Trade_Derivative_009: To validate the availability of Product type in the screen Trade", () => {
        cy.get('.orderPadBase .actionDiv .BUY').click({ force: true })

        cy.wait(1000)
        cy.get('.prdTypeDiv  .productType ').should(($lis) => {
            expect($lis).to.have.length(2)
            expect($lis.eq(0)).to.contain(PRODUCT_TYPES.PRD_NRML)
            expect($lis.eq(1)).to.contain(PRODUCT_TYPES.PRD_INTRA)
            // expect($lis.eq(2)).to.contain(PRODUCT_TYPES.PRD_CO)
            // expect($lis.eq(3)).to.contain(PRODUCT_TYPES.PRD_BO)
        })
    })
    it('TC_BFSL_Trade_Derivative_010: To validate the availability of fields in the Trade screen, On selection of Product Type as NRML and Order type as Limit', () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_NRML, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)
        cy.checkTradeProperties("Equity")
        cy.get('.orderPadBase .moreOptBtn').click({ force: true })

        cy.derivativeNRMLMISProp(PRODUCT_TYPES.PRD_NRML, ORDER_TYPES.ORD_LIMIT)
    })

    it("TC_BFSL_Trade_Derivative_011:To validate the availability of fields in the Trade screen, On selection of Product Type as NRML and Order type as Market", () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_NRML, ORDER_TYPES.ORD_MRK);
        // cy.wait(10)
        cy.checkTradeProperties("Derivative")
        cy.derivativeNRMLMISProp(PRODUCT_TYPES.PRD_NRML, ORDER_TYPES.ORD_MRK)

    })
    it('TC_BFSL_Trade_Derivative_012: To validate the availability of fields in the Trade screen, On selection of Product Type as NRML and Order type as Stop Limit', () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_NRML, ORDER_TYPES.ORD_SL);
        // cy.wait(10)
        cy.checkTradeProperties("Derivative")
        cy.derivativeNRMLMISProp(PRODUCT_TYPES.PRD_NRML, ORDER_TYPES.ORD_SL)
    })
    it('TC_BFSL_Trade_Derivative_013: To validate the availability of fields in the Trade screen, On selection of Product Type as NRML and Order type as Stop Loss market', () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_NRML, ORDER_TYPES.ORD_SLM);
        // cy.wait(10)
        cy.checkTradeProperties("Derivative")
        cy.derivativeNRMLMISProp(PRODUCT_TYPES.PRD_NRML, ORDER_TYPES.ORD_SLM)
    })

    it('TC_BFSL_Trade_Derivative_018: To validate the availability of fields in the Trade screen, On selection of button type as BUY, Product Type as BO and Order type as Limit', () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_LIMIT)
        // cy.wait(10)
        cy.checkTradeProperties("Derivative")
        cy.get('.orderPadBase .moreOptBtn').click({ force: true })
        cy.checkTradeCOBOProperties(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_LIMIT)
    })

    it('TC_BFSL_Trade_Derivative_019: To validate the availability of fields in the Trade screen, On selection of button type as Sell Product Type as BO and Order type as Limit', () => {
        // TODO: Navigate nfo watchlist and click sell
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_LIMIT)
        // cy.wait(10)
        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
        cy.checkTradeProperties("Derivative")
        cy.get('.orderPadBase .moreOptBtn').click({ force: true })
        cy.checkTradeCOBOProperties(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_LIMIT)
    })

    it('TC_BFSL_Trade_Derivative_020: To validate the availability of fields in the Trade screen, On selection of button type as BUY, Product Type as BO and Order type as SL', () => {
        // TODO: Navigate nfo watchlist and click sell
        // cy.openSearch("HDFCBANK FUT", "NFO", "BUY")
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_SL)
        // cy.wait(10)
        cy.get('.orderPadBase .actionDiv .BUY').click({ force: true })
        cy.get('.orderPadBase .moreOptBtn').click({ force: true })
        cy.checkTradeProperties("Derivative")
        cy.checkTradeCOBOProperties(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_SL)

    })

    it('TC_BFSL_Trade_Derivative_021: To validate the availability of fields in the Trade screen, On selection of button type as Sell Product Type as BO and Order type as SL', () => {
        //  // TODO: Navigate nfo watchlist and click sell
        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_SL)
        // cy.wait(10)
        cy.get('.orderPadBase .moreOptBtn').click({ force: true })
        cy.checkTradeProperties("Derivative")
        cy.checkTradeCOBOProperties(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_SL)
    })

    it("TC_BFSL_Trade_Derivative_022: To validate the availability of fields in the Trade screen, On selection of button type as BUY, Product Type as CO and Order type as Limit", () => {
        //  buy order
        cy.get('.orderPadBase .actionDiv .BUY').click({ force: true })

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_LIMIT)
        // cy.wait(10)
        cy.get('.orderPadBase .moreOptBtn').click({ force: true })
        cy.checkTradeProperties("Derivative")
        cy.checkTradeCOBOProperties(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_LIMIT)
    })
    it("TC_BFSL_Trade_Derivative_023: To validate the availability of fields in the Trade screen, On selection of button type as Sell Product Type as CO and Order type as Limit", () => {
        //  sell order
        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_LIMIT)
        // cy.wait(10)
        cy.get('.orderPadBase .moreOptBtn').click({ force: true })
        cy.checkTradeProperties("Derivative")
        cy.checkTradeCOBOProperties(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_LIMIT)
    })
    it("TC_BFSL_Trade_Derivative_024: To validate the availability of fields in the Trade screen, On selection of button type as BUY, Product Type as CO and Order type as Market", () => {

        //  buy order
        cy.get('.orderPadBase .actionDiv .BUY').click({ force: true })

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_MRK)
        // cy.wait(10)
        cy.get('.orderPadBase .moreOptBtn').click({ force: true })
        cy.checkTradeProperties("Derivative")
        cy.checkTradeCOBOProperties(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_MRK)
    })

    it("TC_BFSL_Trade_Derivative_025: To validate the availability of fields in the Trade screen, On selection of button type as Sell Product Type as CO and Order type as Market", () => {

        //  sell order
        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_MRK)
        // cy.wait(10)
        cy.get('.orderPadBase .moreOptBtn').click({ force: true })
        cy.checkTradeProperties("Derivative")
        cy.checkTradeCOBOProperties(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_MRK)
    })

    it("TC_BFSL_Trade_Derivative_026: To validate that the Default fields to be prefilled in the trade screen", () => {
        // NOTE: open NFO symbol - BUY
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({ force: true })
        cy.searchSymbol("rel nfo" ,{ delay: 1, force: true })
        cy.wait(2000)
        // cy.wait(100)
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        cy.get('.orderAction .BUY')
            .should('have.class', 'active')
            .and('not.have.class', 'inactive')

        cy.get('.symName').should('not.be.empty')
        // check quantity
        cy.get(ORDER_PATH.ORDER_QTY).invoke('val').should('not.be.empty')
        cy.get('.prdTypeDiv .productType').contains('NORMAL').should('have.class', 'selected')
        // cy.get('.oTypeDiv  .productType').contains('NORMAL').should('have.class', 'selected')

        // cy.get('.tradeFields .validity_div .first img').invoke('attr', 'src').should('include', 'assets/images/radio_checked_green.svg')
        // cy.get('.tradeFields .amo_div .AMOcheckboxDiv .hiddenCheckbox').should('not.to.be.checked')
    })
    it('TC_BFSL_Trade_Derivative_027:To validate that the click on Buy button in the Watchlist highlights the Buy button in green color in the Trade screen', () => {
        cy.get('.orderPadBase .actionDiv .BUY').click({ force: true })
        cy.get('.orderAction .BUY')
            .should('have.class', 'active')

    })

    it('TC_BFSL_Trade_Derivative_028:To validate that the click on sell button in the Watchlist highlights the Buy button in red color in the Trade screen', () => {
        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
        cy.get('.orderAction .SELL')
            .should('have.class', 'active')

    })
    it("TC_BFSL_Trade_Derivative_029: To validate that the user able to Select either Buy/Sell button from the Quotes minimized view in the Trade screen", () => {
        cy.isVisible('.orderPadBase .actionDiv .SELL')
        cy.isVisible('.orderPadBase .actionDiv .BUY')
    })

    it("TC_BFSL_Trade_Equity_030: To validate that the selection of NSE symbols from the Watchlist/Quotes displays the NSE exchange in the Trade screen", () => {

        cy.get('.orderPadBase .header .exc').contains('NFO')
    })

    it('TC_BFSL_Trade_Derivative_033: To validate that the user able to select the Limit/Market/SL/SL-M order type for the Product type NRML/MIS', () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_NRML, ORDER_TYPES.ORD_LIMIT)
        // cy.wait(10)
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_NRML, ORDER_TYPES.ORD_MRK)
        // cy.wait(10)
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_NRML, ORDER_TYPES.ORD_SL)
        // cy.wait(10)
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_NRML, ORDER_TYPES.ORD_SLM)
        // cy.wait(10)

    })
    it("TC_BFSL_Trade_Equity_034: To validate that the user able to select the Limit/Market order type for the Product type CO", () => {

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_MRK);
        // cy.wait(10)
    })
    it("TC_BFSL_Trade_Equity_035: To validate that the user able to select the Limit/SL order type for the Product type BO ", () => {

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_SL);
        // cy.wait(10)
    })

    it('TC_BFSL_Trade_Equity_037: To validate that the user able to select either the Product type as CNC/MIS/BO/CO', () => {

        cy.get('.prdTypeDiv .productType').contains('NORMAL').click({ force: true })
        cy.get('.prdTypeDiv .productType').contains('INTRADAY').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_MRK);
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_LIMIT);
        // cy.get('.orderPadBase .orderField').contains("CO").click({ force: true })
        // cy.get('.orderPadBase .orderField').contains("BO").click({ force: true })


    })

    //38

    it('TC_BFSL_Trade_Derivative_039: To validate that the IOC/COL option is not shown for the Product type BO/CO', () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_MRK);
        cy.wait(1000)
        cy.get('.fieldRow.moreOptDiv .showMore ').click({force:true})
        cy.get('.validityDiv .radioField').should(($lis) => {
            expect($lis).to.have.length(1)
            expect($lis.eq(0)).to.contain(VALIDITY.DAY)
        })
    })



    it('TC_BFSL_Trade_Equity_045:"To validate that the After market order button is not available for the Market order"', () => {

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_MRK);
        // cy.wait(10)
        cy.isHidden(ORDER_PATH.ORDER_AMO_PATH);

    })

    it('TC_BFSL_Trade_Equity_046:To validate that the AMO option is not available for the CO and BO orders', () => {

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_LIMIT)
        // cy.wait(10)
        cy.isHidden(ORDER_PATH.ORDER_AMO_PATH)
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_LIMIT)
        // cy.wait(10)
        cy.isHidden(ORDER_PATH.ORDER_AMO_PATH)

    })


    it('TC_BFSL_Trade_Derivative_051: To validate that the Quantity field is prefilled in Lots', () => {
        // cy.get('.tradeFields .inputData .lotDiv span')
        cy.get(ORDER_PATH.ORDER_QTY).invoke('val').should('not.to.be.empty')
    })

    it('TC_BFSL_Trade_Derivative_051: To validate that the click on + icon in the QTY field increases the QTY in Lots', () => {
        cy.get('.orderPadBase .lotChange .plusIcon').click({ force: true })
    })
    it('TC_BFSL_Trade_Derivative_051: To validate that the click on - icon in the QTY field decreases the QTY in lots', () => {
        cy.get('.orderPadBase .lotChange .minusIcon').click({ force: true })
    })

    it('TC_BFSL_Trade_Derivative_052: To validate that the user able to enter numeric values in the  Quantity field', () => {

        cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_QTY).type(250, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_QTY).invoke('val').should('eq', '250')
    })
    it('TC_BFSL_Trade_Derivative_053: To validate that the user not able to enter more than 5 digit numeric values in the  Quantity field', () => {
    
        cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_QTY).type(12345678, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_QTY).invoke('val').should('eq', '12345678')
    })
    it('TC_BFSL_Trade_Derivative_054: To validate that the user not able to enter alphabet character in the Quantity field', () => {
        cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_QTY).type('abcd', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_QTY).invoke('val').should('eq', '')
    })

    it('TC_BFSL_Trade_Derivative_055: To validate that the user not able to enter alphanumeric character in the Quantity field', () => {
        cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_QTY).type('abcd123', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_QTY).invoke('val').should('eq', '123')
    })
    it('TC_BFSL_Trade_Derivative_056: To validate that the user not able to enter special character in the Quantity field', () => {

        cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_QTY).type('@#$%%', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_QTY).invoke('val').should('eq', '')
    })
    it('TC_BFSL_Trade_Derivative_057: To validate that the user not able to enter negative values in the Quantity field', () => {
        cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_QTY).type(-250, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_QTY).invoke('val').should('eq', '250')
    })
    it('TC_BFSL_Trade_Derivative_058: To validate that the user not able to enter decimal values in the Quantity field', () => {

        cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_QTY).type(98.95, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_QTY).invoke('val').should('eq', '9895')
    })
    it('TC_BFSL_Trade_Equity_059:To validate that the error message is displayed for entering zero in the Quantity field', () => {

        cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_QTY).type(0, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.fieldRow .errorInputDiv .errorMsg-div').contains("Please enter a valid Quantity")

    })
    it('TC_BFSL_Trade_Equity_060: To validate that the error message is displayed for keeping the Quantity field as empty', () => {
        cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.fieldRow .errorInputDiv .errorMsg-div').contains("Please enter the Quantity")

    })

    //61& 62 = lot size needed to validated



    //price

    it("TC_BFSL_Trade_Equity_063: To validate that the Price field is prefilled by default", () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_NRML, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('not.to.be.empty')
    })
    it('TC_BFSL_Trade_Equity_064: To validate that the user able to enter numeric values in the  Price field', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(150, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '150')

    })

    it('TC_BFSL_Trade_Equity_065: To validate that the user not able to enter more than 9 digit numeric values in the  Price field', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(12345678111, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '123456781')

    })

    it('TC_BFSL_Trade_Equity_066: To validate that the user not able to enter alphabet character in the Price field', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type('abcd', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '')

    })

    it('TC_BFSL_Trade_Equity_067: To validate that the user not able to enter alphanumeric character in the Price field', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type('abcd123', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '123')

    })

    it('TC_BFSL_Trade_Equity_068:To validate that the user not able to enter special character in the Price field', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type('@#$%%', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '')
    })

    it('TC_BFSL_Trade_Equity_069: To validate that the user not able to enter negative values in the Price field', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(-10, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '-10')
    })

    it('TC_BFSL_Trade_Equity_070: To validate that the user able to enter decimal values in the Price field', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(98.95, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '98.95')
    })

    it('TC_BFSL_Trade_Equity_071: To validate that the user not able to enter more than two decimal values in the Price field', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(98.9594, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '98.95')
    })

    it('TC_BFSL_Trade_Equity_072:  To validate that the error message is displayed for entering zero in the Price field', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(0, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.fieldRow .priceField  .errorMsg-div').contains('Please enter a valid price')
    })

    it('TC_BFSL_Trade_Equity_073: To validate that the error message is displayed for keeping the Price field as empty', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.fieldRow .priceField  .errorMsg-div').contains('Please enter the Price')
        cy.tradeWindowClose()

    })

    //74,75,76,77 needvtick size and range


    it("TC_BFSL_Trade_Equity_078: To validate that the user able to enter numeric values in the Trigger Price field", () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({ force: true })
        cy.searchSymbol("rel nfo" ,{ delay: 1, force: true })
        cy.wait(2000)
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_NRML, ORDER_TYPES.ORD_SL)
        // cy.wait(500)
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(150, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).invoke('val').should('eq', '150')

    })

    it("TC_BFSL_Trade_Equity_079: To validate that the user not able to enter more than 8 digit numeric values in the  Trigger Price field", () => {
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(123456789, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).invoke('val').should('eq', '123456789')
    })

    it("TC_BFSL_Trade_Equity_080: To validate that the user not able to enter alphabet character in the Trigger Price field", () => {
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type('abcd', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).invoke('val').should('eq', '')
    })

    it("TC_BFSL_Trade_Equity_081: To validate that the user not able to enter alphanumeric character in the Trigger Price field", () => {
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type('abcd123', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).invoke('val').should('eq', '123')
    })

    it("TC_BFSL_Trade_Equity_082: To validate that the user not able to enter special character in the Trigger Price field", () => {
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type('@#$%%', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).invoke('val').should('eq', '')
    })

    it("TC_BFSL_Trade_Equity_083: To validate that the user not able to enter negative values in the Trigger Price field", () => {
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(-10, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).invoke('val').should('eq', '-10')
    })

    it("TC_BFSL_Trade_Equity_084: To validate that the user able to enter decimal values in the Trigger Price field", () => {
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(98.95, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).invoke('val').should('eq', '98.95')
    })

    it("TC_BFSL_Trade_Equity_085: To validate that the user not able to enter more than two decimal values in the Trigger Price field", () => {
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(98.9594, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).invoke('val').should('eq', '98.95')
    })


        it("TC_BFSL_Trade_Equity_086: To validate that the error message is displayed for entering zero in the Trigger Price field", () => {
            cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
            cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(0, { delay: 0 })
            cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
            cy.get('.orderPadBase .fieldRow .errorMsg-div').contains('Please enter a valid Trigger price')
    
        })
        it("TC_BFSL_Trade_Equity_087: To validate that the error message is displayed for keeping the Trigger Price field as empty", () => {
            cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
            cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
            cy.get('.orderPadBase .fieldRow .errorMsg-div').contains('Please enter the Trigger Price')
    
        })
        //88,89,60,91 need tick size and price range
    
        it("TC_BFSL_Trade_Equity_092: To validate that the error message is displayed for entering the Trigger Price greater than the Limit price for the Buy orders", () => {
            cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
            cy.get(ORDER_PATH.ORDER_PRICE).type(10, { delay: 0 })
            cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
            cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(20, { delay: 0 })
    
            cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
            cy.get('.orderPadBase .fieldRow .errorMsg-div').contains('Trigger Price cannot be greater than the limit price')
    
        })



    it('TC_BFSL_Trade_Equity_94: To validate that the user able to enter numeric values in the Stop loss Price field', () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_LIMIT)
        // cy.wait(500)
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(150, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '150')
    })

    it('TC_BFSL_Trade_Equity_95: To validate that the user not able to enter more than 8 digit numeric values in the Stop loss Price field', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(123456789, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '123456789')

    })

    it('TC_BFSL_Trade_Equity_96: To validate that the user not able to enter alphabet character in the Stop loss Price field', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type('abcd', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '')

    })

    it('TC_BFSL_Trade_Equity_97: To validate that the user not able to enter alphanumeric character in the Stop loss Price field', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type('abcd123', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '123')
    })

    it('TC_BFSL_Trade_Equity_98: To validate that the user not able to enter special character in the Stop loss Price field', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type('@#$%%', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '')
    })

    it('TC_BFSL_Trade_Equity_99: To validate that the user not able to enter negative values in the Stop loss Price field', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(-10, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '-10')
    })
    it('TC_BFSL_Trade_Equity_100: To validate that the user able to enter decimal values in the Stop loss Price field', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(98.9, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '98.9')
    })
    it('TC_BFSL_Trade_Equity_101: To validate that the user not able to enter more than two decimal values in the Stop loss Price field', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(98.9594, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '98.95')
    })

    it('TC_BFSL_Trade_Equity_102: To validate that the error message is displayed for entering zero in the Stop loss Price field', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(0, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .fieldRow  .errorInputDiv  .errorMsg-div').contains('Please enter a valid Stop loss value')
    })
    it('TC_BFSL_Trade_Equity_103: To validate that the error message is displayed for keeping the Stop loss Price field as empty', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .fieldRow  .errorInputDiv  .errorMsg-div').contains('Please enter the Stop loss')
    })
    //104,105 need tick size


    it('TC_BFSL_Trade_Equity_106: To validate that the user able to enter the stop loss price within the given range', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })

        cy.get('div.range  span.lowerCircuitVal').then(($btn) => {
            const txt = $btn.text()
            cy.log(txt)
            cy.input(ORDER_PATH.ORDER_STOP_LOSS, txt)
        })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    })

    

    it('TC_BFSL_Trade_Equity_107: To validate that the error message is displayed for entering the Stop loss Price without the given range', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })

        cy.get('div.range span.lowerCircuitVal').then(($btn) => {
            const txt = $btn.text()
            cy.log(txt)
            let n = txt - 1
            cy.log('n', n)

            cy.input(ORDER_PATH.ORDER_STOP_LOSS, -1)
        })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .fieldRow .errorMsg-div').contains('Please enter the Stoploss within the given range')

    })

    it('TC_BFSL_Trade_Equity_108: To validate that the error message is displayed for entering Stop loss price greater than the Limit price for the Buy orders', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get('div.range  span.lowerCircuitVal').then(($btn) => {
            const txt = $btn.text()
            cy.log(txt)
            cy.get(ORDER_PATH.ORDER_PRICE).type(txt, { delay: 0, force: true })
            cy.get('.orderPadBase .priceField  input[name="price"]').then(($btn) => {
                const n = $btn.val()
                cy.log(txt)
                // cy.log(txt)
                cy.input('.fieldRow .field [name="stopLoss"]', n)
            })
            // cy.input(ORDER_PATH.ORDER_STOP_LOSS, txt)
        })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .fieldRow .errorMsg-div').contains('Please enter the Stoploss within the given range')

    })


    //squreoff
    it("TC_BFSL_Trade_Equity_110: To validate that the user able to enter numeric values in the Square off Sell/Buy field", () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_LIMIT)
        // cy.wait(500)
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).type(150, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).invoke('val').should('eq', '150')
    })

    it("TC_BFSL_Trade_Equity_111: To validate that the user not able to enter more than 8 digit numeric values in the Square off Sell/Buy field", () => {
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).type(1234567891, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).invoke('val').should('eq', '123456789')
    })

    it("TC_BFSL_Trade_Equity_112: To validate that the user not able to enter alphabet character in the Square off Sell/Buy field", () => {
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).type('abcd', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).invoke('val').should('eq', '')
    })

    it("TC_BFSL_Trade_Equity_113: To validate that the user not able to enter alphanumeric character in the Square off Sell/Buy field", () => {
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).type('abcd123', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).invoke('val').should('eq', '123')
    })
    it("TC_BFSL_Trade_Equity_114: To validate that the user not able to enter special character in the Square off Sell/Buy field", () => {
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).type('@#$%%', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).invoke('val').should('eq', '')
    })
    it("TC_BFSL_Trade_Equity_115: To validate that the user not able to enter negative values in the Square off Sell/Buy field", () => {
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).type(-10, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).invoke('val').should('eq', '-10')
    })
    it("TC_BFSL_Trade_Equity_116: To validate that the user able to enter decimal values in the Square off Sell/Buy field", () => {
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).type(98.95, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).invoke('val').should('eq', '98.95')

    })
    it("TC_BFSL_Trade_Equity_117: To validate that the user not able to enter more than two decimal values in the Square off Sell/Buy field", () => {
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).type(98.95256)
        cy.get(ORDER_PATH.ORDER_SQ_OFF).invoke('val').should('eq', '98.95')
    })
    it("TC_BFSL_Trade_Equity_118: To validate that the error message is displayed for entering zero in the Square off Sell/Buy field", () => {
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).type(0)
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .fieldRow .errorInputDiv .errorMsg-div').contains('Please enter a valid Square off value')

    })
    it("TC_BFSL_Trade_Equity_119: To validate that the error message is displayed for keeping the Square off Sell/Buy field as empty", () => {
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .fieldRow .errorInputDiv .errorMsg-div').contains('Please enter the Square Off')

    })

    // 120 to 121 - = need tick size to validate


    // stop loss validation
    it("TC_BFSL_Trade_Equity_122: To validate that the user able to enter numeric values in the Stop loss Sell/Buy field", () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_LIMIT)
        // cy.wait(500)
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(150, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '150')

    })
    it("TC_BFSL_Trade_Equity_123: To validate that the user not able to enter more than 9 digit numeric values in the Stop loss Sell/Buy field", () => {

        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(1234567891, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '123456789')
    })
    it("TC_BFSL_Trade_Equity_124: To validate that the user not able to enter alphabet character in the Stop loss Sell/Buy field", () => {

        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type('abcd', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '')
    })
    it("TC_BFSL_Trade_Equity_125: To validate that the user not able to enter alphanumeric character in the Stop loss Sell/Buy field", () => {

        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type('abcd123', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '123')
    })
    it("TC_BFSL_Trade_Equity_126: To validate that the user not able to enter special character in the Stop loss Sell/Buy field", () => {

        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type('@#$%%', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '')
    })
    it("TC_BFSL_Trade_Equity_127: To validate that the user not able to enter negative values in the Stop loss Sell/Buy field", () => {

        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(-10, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '-10')
    })
    it("TC_BFSL_Trade_Equity_128: To validate that the user able to enter decimal values in the Stop loss Sell/Buy field", () => {

        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(95.78, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '95.78')
    })
    it("TC_BFSL_Trade_Equity_128: To validate that the user not able to enter more than two decimal values in the Stop loss Sell/Buy field", () => {

        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(95.7825, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '95.78')
    })
    it("TC_BFSL_Trade_Equity_129: To validate that the error message is displayed for entering zero in the Stop loss Sell/Buy field", () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(0, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .fieldRow .errorInputDiv .errorMsg-div').contains('Please enter a valid Stop loss value')

    })
    it("TC_BFSL_Trade_Equity_130: To validate that the error message is displayed for keeping the Stop loss Sell/Buy field as empty", () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .fieldRow .errorInputDiv .errorMsg-div').contains('Please enter the Stop loss')

    })
    //131,132 need tick size


    it("TC_BFSL_Trade_Equity_133: To validate that the user able to enter numeric values in the Trailing stop loss field", () => {
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).type(150, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).invoke('val').should('eq', '150')
    })

    it("TC_BFSL_Trade_Equity_134: To validate that the user not able to enter more than 8 digit numeric values in the Trailing stop loss field", () => {
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).type(1234567891, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).invoke('val').should('eq', '123456789')

    })
    it("TC_BFSL_Trade_Equity_135: To validate that the user not able to enter alphabet character in the Trailing stop loss field", () => {
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).type('abcd', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).invoke('val').should('eq', '')

    })
    it("TC_BFSL_Trade_Equity_136: To validate that the user not able to enter alphanumeric character in the Trailing stop loss field", () => {
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).type('abcd123', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).invoke('val').should('eq', '123')

    })
    it("TC_BFSL_Trade_Equity_137: To validate that the user not able to enter special character in the Trailing stop loss field", () => {
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).type("@#$%%", { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).invoke('val').should('eq', '')
    })
    it("TC_BFSL_Trade_Equity_138: To validate that the user not able to enter negative values in the Trailing stop loss field", () => {
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).type(-10, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).invoke('val').should('eq', '-10')

    })
    it("TC_BFSL_Trade_Equity_139: To validate that the user able to enter decimal values in the Trailing stop loss field", () => {
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).type(1.22, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).invoke('val').should('eq', '1.22')

    })
    it("TC_BFSL_Trade_Equity_140: To validate that the user not able to enter more than two decimal values in the Trailing stop loss field", () => {
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).type(95.70114, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).invoke('val').should('eq', '95.70')

    })
    it("TC_BFSL_Trade_Equity_141: To validate that the error message is displayed for entering zero in the Trailing stop loss field", () => {
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).type(0, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .fieldRow .errorInputDiv .errorMsg-div').contains('Please enter a valid Trailing stop loss')

    })

})
