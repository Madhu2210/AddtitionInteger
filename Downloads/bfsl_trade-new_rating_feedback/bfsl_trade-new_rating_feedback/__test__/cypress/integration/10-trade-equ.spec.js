import { URL, USER_NAME, PASSWORD, PAN_NUMBER, ORDERPAD, ORDER_PATH, PRODUCT_TYPES, ORDER_TYPES, SEARCH_PATH, VALIDITY, ORDER_SYMBOL, ORDER_KEYS } from '../support/config'

before(function () {
    cy.visit(URL)
    Cypress.Cookies.defaults({
        preserve: ['JSESSIONID', 'Auth-Token'],
    })
})


describe("Trade-Equity", () => {

    // for single file execution 
    it('username  - valid', () => {
        cy.wait(3000)
        cy.login(USER_NAME, PASSWORD, PAN_NUMBER)
        cy.wait(3000)
        cy.isLoginSuccess()
    })
    it("TC_BFSL_Trade_Equity_001 & 003 & 005 & 007: To validate that the click on Buy button in the quotes view redirect the user to the Trade buy order screen", () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        // cy.isVisible('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.buy-btn2')

        // cy.isVisible(ORDER_PATH.WATCH_MIN_BUY);
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.buy-btn2').click({ force: true })
        // cy.wait(1000)
        // cy.get('.orderAction .BUY')
        //     .should('have.class', 'active')
        //     .and('not.have.class', 'inactive')
    
    cy.tradeWindowClose()
    })
    // it("TC_BFSL_Trade_Equity_001: To validate that the click on Buy button in the quotes view redirect the user to the Trade buy order screen", () => {
    //     cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
    //     cy.wait(3000)
    //     cy.isVisible('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.buy-btn')

    //     // cy.isVisible(ORDER_PATH.WATCH_MIN_BUY);
    //     cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.buy-btn').click({ force: true })
    //     cy.wait(1000)
    //     cy.get('.orderAction .BUY')
    //         .should('have.class', 'active')
    //         .and('not.have.class', 'inactive')
    //     cy.tradeWindowClose()
    // })

    it("TC_BFSL_Trade_Equity_002 & 004 & 008: To validate that the click on sell button in the quotes view redirect the user to the Trade sell order screen", () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        // cy.isVisible('.watchlist-table tbody > tr:nth-child(1) td:nth-child(6) button.sell-btn')
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.sell-btn2').click({ force: true });
        // cy.wait(2000)
        // cy.get('.orderAction .SELL')
        //     .should('have.class', 'active')
        //     .and('not.have.class', 'inactive')
        cy.tradeWindowClose();

    })
    // it("TC_BFSL_Trade_Equity_004: To validate that the click on sell button  the user to the Trade sell order screen", () => {
    //     cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
    //     // cy.wait(3000)
    //     //  cy.isVisible('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.iconBtn(1)')

    //     cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button:nth-child(3)').click({ force: true });
    //     cy.get('.orderBase .quote-view .actionDiv .btn-div button.buy-btn2').click({ force: true });
    //     // cy.wait(3000)
    //     // cy.get('.orderAction .SELL')
    //     //     .should('have.class', 'active')
    //     //     .and('not.have.class', 'inactive')
    //     cy.tradeWindowClose();

    // })

    it("TC_BFSL_Trade_Equity_009:To validate the availability of Product type in the screen Trade", () => {
        // cy.wait(10)
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.buy-btn2').click({ force: true })
        // cy.wait(1000)
        cy.get('.prdTypeDiv  .productType ').should(($lis) => {
            expect($lis).to.have.length(4)
            expect($lis.eq(0)).to.contain(PRODUCT_TYPES.PRD_DEL)
            expect($lis.eq(1)).to.contain(PRODUCT_TYPES.PRD_INTRA)
            expect($lis.eq(2)).to.contain(PRODUCT_TYPES.PRD_TNC)
            expect($lis.eq(3)).to.contain(PRODUCT_TYPES.PRD_MTF)
        })

    })
    it('TC_BFSL_Trade_Equity_010: To validate the availability of fields in the Trade screen, On selection of Product Type as Delivery  and Order type as Limit', () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_DEL, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)
        cy.checkTradeProperties("Equity")
        cy.checkTradeTNCProperties(ORDER_TYPES.ORD_LIMIT)
    })
    it('TC_BFSL_Trade_Equity_011: To validate the availability of fields in the Trade screen, On selection of Product Type as Delivery  and Order type as Market', () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_DEL, ORDER_TYPES.ORD_MRK);
        // cy.wait(10)
        cy.checkTradeProperties("Equity")
        cy.checkTradeTNCProperties(ORDER_TYPES.ORD_MRK)
    })
    // it('TC_BFSL_Trade_Equity_010: To validate the availability of fields in the Trade screen, On selection of Product Type as INTRADAY and Order type as Limit', () => {
    //     cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_INTRA, ORDER_TYPES.ORD_LIMIT);
    //     // cy.wait(10)
    //     cy.checkTradeProperties("Equity")
    //     cy.checkTradeTNCProperties(ORDER_TYPES.ORD_LIMIT)
    // })

    it('TC_BFSL_Trade_Equity_011: To validate the availability of fields in the Trade screen, On selection of Product Type as TNC and Order type as Limit', () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_TNC, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)
        cy.checkTradeProperties("Equity")
        cy.checkTradeTNCProperties(ORDER_TYPES.ORD_LIMIT)
    })

    it('TC_BFSL_Trade_Equity_012: To validate the availability of fields in the Trade screen, On selection of Product Type as TNC and Order type as MARKET', () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_TNC, ORDER_TYPES.ORD_MRK);
        // cy.wait(10)
        cy.checkTradeProperties("Equity")
        cy.checkTradeTNCProperties(ORDER_TYPES.ORD_MRK)
    })
    it('TC_BFSL_Trade_Equity_013: To validate the availability of fields in the Trade screen, On selection of Product Type as TNC and Order type as SL', () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_TNC, ORDER_TYPES.ORD_SL);
        // cy.wait(10)
        cy.checkTradeProperties("Equity")
        cy.checkTradeTNCProperties(ORDER_TYPES.ORD_SL)
    })
    it('TC_BFSL_Trade_Equity_013: To validate the availability of fields in the Trade screen, On selection of Product Type as TNC and Order type as SLM', () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_TNC, ORDER_TYPES.ORD_SLM);
        // cy.wait(10)
        cy.checkTradeProperties("Equity")
        cy.checkTradeTNCProperties(ORDER_TYPES.ORD_SLM)
    })

    it('TC_BFSL_Trade_Equity_014: To validate the availability of fields in the Trade screen, On selection of Product Type as MTF and Order type as Limit', () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_MTF, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)
        cy.checkTradeProperties("Equity")
        cy.checkTradeMFTProperties(ORDER_TYPES.ORD_LIMIT)
    })
    it('TC_BFSL_Trade_Equity_015: To validate the availability of fields in the Trade screen, On selection of Product Type as MTF and Order type as Market', () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_MTF, ORDER_TYPES.ORD_MRK);
        // cy.wait(10)
        cy.checkTradeProperties("Equity")
        cy.checkTradeMFTProperties(ORDER_TYPES.ORD_MRK)
    })
    it('TC_BFSL_Trade_Equity_016: To validate the availability of fields in the Trade screen, On selection of Product Type as MTF and Order type as SL', () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_MTF, ORDER_TYPES.ORD_SL);
        // cy.wait(10)
        cy.checkTradeProperties("Equity")
        cy.checkTradeMFTProperties(ORDER_TYPES.ORD_SL)
    })
    it('TC_BFSL_Trade_Equity_017: To validate the availability of fields in the Trade screen, On selection of Product Type as MTF and Order type as SLM', () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_MTF, ORDER_TYPES.ORD_SLM);
        // cy.wait(10)
        cy.checkTradeProperties("Equity")
        cy.checkTradeMFTProperties(ORDER_TYPES.ORD_SLM)
    })
    it('TC_BFSL_Trade_Equity_018: To validate the availability of fields in the Trade screen,Click on the Buy button from the Quotes minimized view On selection of Product Type as BO and Order type as Limit', () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)
        cy.checkTradeProperties("Equity")
        cy.checkTradeCOBOProperties(ORDER_TYPES.ORD_LIMIT)
    })

    it('TC_BFSL_Trade_Equity_019: To validate the availability of fields in the Trade screen,Click on the sell button from the Quotes minimized view On selection of Product Type as BO and Order type as Limit', () => {
        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
        // cy.wait(1000)

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)
        cy.checkTradeProperties("Equity")
        cy.checkTradeCOBOProperties(ORDER_TYPES.ORD_LIMIT)
    })

    it('TC_BFSL_Trade_Equity_020: To validate the availability of fields in the Trade screen,Click on the Buy button from the Quotes minimized view On selection of Product Type as BO and Order type as SL', () => {
        cy.get('.orderPadBase .actionDiv .BUY').click({ force: true })
        // cy.wait(1000)

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_SL);
        // cy.wait(10)
        cy.checkTradeProperties("Equity")
        cy.checkTradeCOBOProperties(ORDER_TYPES.ORD_SL)
    })

    it('TC_BFSL_Trade_Equity_021: To validate the availability of fields in the Trade screen,Click on the sell button from the Quotes minimized view On selection of Product Type as BO and Order type as SL', () => {
        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
        // cy.wait(1000)


        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_SL);
        // cy.wait(10)
        cy.checkTradeProperties("Equity")
        cy.checkTradeCOBOProperties(ORDER_TYPES.ORD_SL)
    })

    it('TC_BFSL_Trade_Equity_022: To validate the availability of fields in the Trade screen,Click on the Buy button from the Quotes minimized view On selection of Product Type as CO and Order type as Limit', () => {
        cy.get('.orderPadBase .actionDiv .BUY').click({ force: true })
        // cy.wait(1000)

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)
        cy.checkTradeProperties("Equity")
        cy.checkTradeCOBOProperties(ORDER_TYPES.ORD_LIMIT)
    })

    it('TC_BFSL_Trade_Equity_023: To validate the availability of fields in the Trade screen,Click on the Sell button from the Quotes minimized view On selection of Product Type as Co and Order type as Limit', () => {
        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
        // cy.wait(1000)
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)
        cy.checkTradeProperties("Equity")
        cy.checkTradeCOBOProperties(ORDER_TYPES.ORD_LIMIT)
    })

    it('TC_BFSL_Trade_Equity_024:To validate the availability of fields in the Trade screen, Click on the Buy button from the Quotes minimized view, Product Type as CO and Order type as Market', () => {
        cy.get('.orderPadBase .actionDiv .BUY').click({ force: true })
        // cy.wait(1000)

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_MRK);
        // cy.wait(10)
        cy.checkTradeProperties("Equity")
        cy.checkTradeCOBOProperties(ORDER_TYPES.ORD_MRK)
    })
    it('TC_BFSL_Trade_Equity_025: To validate the availability of fields in the Trade screen, Click on the Sell button from the Quotes minimized view, Product Type as CO and Order type as Market', () => {
        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_MRK);
        // cy.wait(10)
        cy.checkTradeProperties("Equity")
        cy.checkTradeCOBOProperties(ORDER_TYPES.ORD_MRK)
    })
    //26

    it('TC_BFSL_Trade_Equity_027:To validate that the click on Buy button in the Watchlist highlights the Buy button in green color in the Trade screen', () => {
        cy.get('.orderPadBase .actionDiv .BUY').click({ force: true })
        cy.get('.orderAction .BUY')
            .should('have.class', 'active')

    })

    it('TC_BFSL_Trade_Equity_028:To validate that the click on sell button in the Watchlist highlights the Buy button in red color in the Trade screen', () => {
        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
        cy.get('.orderAction .SELL')
            .should('have.class', 'active')

    })

    it("TC_BFSL_Trade_Equity_029: To validate that the user able to Select either Buy/Sell button from the Quotes minimized view in the Trade screen", () => {
        cy.isVisible('.orderPadBase .actionDiv .SELL')
        cy.isVisible('.orderPadBase .actionDiv .BUY')
    })
    it("TC_BFSL_Trade_Equity_030: To validate that the selection of NSE symbols from the Watchlist/Quotes displays the NSE exchange in the Trade screen", () => {
        // open NSE symbol 
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear()
        cy.wait(1000)
        cy.searchSymbol("tcs nse")
        cy.wait(1000)
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        // cy.wait(1000)
        cy.get('.orderPadBase .header .valueDiv .name .doggleBase-div span.active').contains('NSE')
    })
    it("TC_BFSL_Trade_Equity_031: To validate that the selection of BSE symbols from the Watchlist/Quotes displays the BSE exchange in the Trade screen", () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear()
        cy.wait(1000)
        cy.searchSymbol("tcs bse")
        cy.wait(1000)
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        // cy.wait(1000)
        cy.get('.orderPadBase .header .valueDiv .name .doggleBase-div span.active').contains('BSE')
    })
    it("TC_BFSL_Trade_Equity_033: To validate that the user able to select the Limit/Market order type for the Product type CNC/MIS/CO", () => {

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_TNC, ORDER_TYPES.ORD_MRK);
        // cy.wait(10)
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_TNC, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_TNC, ORDER_TYPES.ORD_SL);
        // cy.wait(10)
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_TNC, ORDER_TYPES.ORD_SLM);
        // cy.wait(10)
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_MTF, ORDER_TYPES.ORD_MRK);
        // cy.wait(10)
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_MTF, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_MTF, ORDER_TYPES.ORD_SL);
        // cy.wait(10)
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_MTF, ORDER_TYPES.ORD_SLM);
        // cy.wait(10)

    })

    it("TC_BFSL_Trade_Equity_034: To validate that the user able to select the Limit/SL order type for the Product type BO ", () => {

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_SL);
        // cy.wait(10)
    })
    it("TC_BFSL_Trade_Equity_035: To validate that the user able to select the Limit/Market order type for the Product type CO", () => {

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_MRK);
        // cy.wait(10)
    })
    it('TC_BFSL_Trade_Equity_037: To validate that the user able to select either the Product type as TNC/MIS/BO/CO', () => {

        cy.get('.prdTypeDiv .productType').contains('DELIVERY').click({ force: true })
        cy.get('.prdTypeDiv .productType').contains('INTRADAY').click({ force: true })
        cy.get('.prdTypeDiv .productType').contains('MTF').click({ force: true })
        cy.get('.prdTypeDiv .productType').contains('TNC').click({ force: true })
    })

    it('TC_BFSL_Trade_Equity_040: To validate that the only day validity option is show for the Product type BO/CO', () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_LIMIT)
        // cy.wait(10)
        cy.get('.orderPadBase .moreOptBtn').click({ force: true })

        cy.checkLength(ORDER_PATH.ORDER_VALIDITY_PATH, 1)
        cy.get(ORDER_PATH.ORDER_VALIDITY_PATH).contains(VALIDITY.DAY)

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_LIMIT)
        // cy.wait(10)
        cy.checkLength(ORDER_PATH.ORDER_VALIDITY_PATH, 1)
        cy.get(ORDER_PATH.ORDER_VALIDITY_PATH).contains(VALIDITY.DAY)
    })

    it('TC_BFSL_Trade_Equity_038 & 041: To validate that the user able to select the Day and IOC Validity for the Product type TNC/MTF', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
      
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.buy-btn2').click({ force: true })
        // cy.wait(1000)
      
        cy.get('.prdTypeDiv .productType').contains('TNC').click({ force: true })
        cy.get('.orderPadBase .moreOptBtn').click({force:true})
        
    })

    it('TC_BFSL_Trade_Equity_043: To validate that the only day validity option is show for the Product type BO/CO', () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear()
        cy.searchSymbol("tcs nse")
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        // cy.wait(1000)
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_LIMIT)
        // cy.wait(10)
        cy.get('.orderPadBase .moreOptBtn').click({ force: true })

        cy.checkLength(ORDER_PATH.ORDER_VALIDITY_PATH, 1)
        cy.get(ORDER_PATH.ORDER_VALIDITY_PATH).contains(VALIDITY.DAY)

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_LIMIT)
        // cy.wait(10)
        cy.checkLength(ORDER_PATH.ORDER_VALIDITY_PATH, 1)
        cy.get(ORDER_PATH.ORDER_VALIDITY_PATH).contains(VALIDITY.DAY)
    })

    it('TC_BFSL_Trade_Equity_045:"To validate that the After market order button is not available for the Market order"', () => {

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_MRK);
        // cy.wait(10)
        cy.isHidden(ORDER_PATH.ORDER_AMO_PATH);

    })

    it('TC_BFSL_Trade_Equity_046:To validate that the AMO option is not available for the CO and BO orders', () => {

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_MRK)
        // cy.wait(10)
        cy.isHidden(ORDER_PATH.ORDER_AMO_PATH)
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_SL)
        // cy.wait(10)
        cy.isHidden(ORDER_PATH.ORDER_AMO_PATH)

    })

    it('TC_BFSL_Trade_Equity_047:To validate that the user able to check and Uncheck the AMO checkbox', () => {

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_DEL, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)
        cy.isVisible(ORDER_PATH.ORDER_AMO_PATH);
        cy.get(ORDER_PATH.ORDER_AMO_CHKBOX).click({ force: true })
        // cy.get('.tradeFields .amo_div .AMOcheckboxDiv img').invoke('attr', 'src').should('include', 'assets/images/checkbox_selected.svg')
    })

    it('TC_BFSL_Trade_Equity_048: To validate that the Quantity field is prefilled lot value by default', () => {

        cy.get(ORDER_PATH.ORDER_QTY).invoke('val').should('eq', '1')
    })

    it('TC_BFSL_Trade_Equity_049: To validate that the user able to enter numeric values in the  Quantity field', () => {
        // cy.wait(100)
        cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
        // cy.wait(100)
        cy.get(ORDER_PATH.ORDER_QTY).type(150, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_QTY).invoke('val').should('eq', '150')
    })

    it('TC_BFSL_Trade_Equity_050: To validate that the user not able to enter more than 5 digit numeric values in the  Quantity field', () => {

        cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
        // cy.wait(10)
        cy.get(ORDER_PATH.ORDER_QTY).type(12345, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_QTY).invoke('val').should('eq', '12345')
    })



    
    it('TC_BFSL_Trade_Equity_051: To validate that the user not able to enter alphabet character in the Quantity field', () => {

        cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
        // cy.wait(10)
        cy.get(ORDER_PATH.ORDER_QTY).type('abcd', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_QTY).invoke('val').should('eq', '')
    })
    it('TC_BFSL_Trade_Equity_052: To validate that the user not able to enter alphanumeric character in the Quantity field', () => {

        cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
        // cy.wait(10)
        cy.get(ORDER_PATH.ORDER_QTY).type('abcd123', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_QTY).invoke('val').should('eq', '123')
    })

    it('TC_BFSL_Trade_Equity_053: To validate that the user not able to enter special character in the Quantity field', () => {


        cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
        // cy.wait(10)
        cy.get(ORDER_PATH.ORDER_QTY).type('@#$%%', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_QTY).invoke('val').should('eq', '')
    })

    it('TC_BFSL_Trade_Equity_054: To validate that the user not able to enter negative values in the Quantity field', () => {

        cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })

        // cy.wait(10)
        cy.get(ORDER_PATH.ORDER_QTY).type(-10, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_QTY).invoke('val').should('eq', '10')
    })

    it('TC_BFSL_Trade_Equity_055: To validate that the user not able to enter decimal values in the Quantity field', () => {

        cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_QTY).type(98.95, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_QTY).invoke('val').should('eq', '9895')
    })

    it('TC_BFSL_Trade_Equity_056:To validate that the error message is displayed for entering zero in the Quantity field', () => {

        cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_QTY).type(0, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.fieldRow .errorInputDiv .errorMsg-div').contains("Please enter a valid Quantity")

    })
    it('TC_BFSL_Trade_Equity_057: To validate that the error message is displayed for keeping the Quantity field as empty', () => {
        cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.fieldRow .errorInputDiv .errorMsg-div').contains("Please enter the Quantity")

    })

    //price

    it("TC_BFSL_Trade_Equity_058: To validate that the Price field is prefilled by default", () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_DEL, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('not.to.be.empty')
    })
    it('TC_BFSL_Trade_Equity_059: To validate that the user able to enter numeric values in the  Price field', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(150, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '150')

    })

    it('TC_BFSL_Trade_Equity_060: To validate that the user not able to enter more than 9 digit numeric values in the  Price field', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(12345678111, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '123456781')

    })

    it('TC_BFSL_Trade_Equity_061: To validate that the user not able to enter alphabet character in the Price field', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type('abcd', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '')

    })

    it('TC_BFSL_Trade_Equity_062: To validate that the user not able to enter alphanumeric character in the Price field', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type('abcd123', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '123')

    })

    it('TC_BFSL_Trade_Equity_063:To validate that the user not able to enter special character in the Price field', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type('@#$%%', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '')
    })

    it('TC_BFSL_Trade_Equity_064: To validate that the user not able to enter negative values in the Price field', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(-10, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '-10')
    })

    it('TC_BFSL_Trade_Equity_065: To validate that the user able to enter decimal values in the Price field', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(98.95, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '98.95')
    })

    it('TC_BFSL_Trade_Equity_066: To validate that the user not able to enter more than two decimal values in the Price field', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(98.9594, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '98.95')
    })

    it('TC_BFSL_Trade_Equity_067:  To validate that the error message is displayed for entering zero in the Price field', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(0, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.fieldRow .priceField  .errorMsg-div').contains('Please enter a valid price')
    })

    it('TC_BFSL_Trade_Equity_068: To validate that the error message is displayed for keeping the Price field as empty', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.fieldRow .priceField  .errorMsg-div').contains('Please enter the Price')
    })


    // 69 to 70 = need tick size to validate
    // unable to find tick size to validate price should be multiples of tick size 
    //71 to 72 - need range



    //dis qty

    it("TC_BFSL_Trade_Equity_073: To validate that the Disclosed Qty field is not prefilled by default", () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({force:true})
        cy.searchSymbol("tcs bse")
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        cy.get('.prdTypeDiv .productType').contains('INTRADAY').click({ force: true })

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)
        cy.get('.orderPadBase .moreOptBtn').click({force:true})
        cy.get(ORDER_PATH.ORDER_DIS_QTY).invoke('val').should('to.be.empty')
    })
    it("TC_BFSL_Trade_Equity_074:To validate that the user able to enter numeric values in the  Disclosed Qty field", () => {
        cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({force:true})
        cy.get(ORDER_PATH.ORDER_DIS_QTY).type(150, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_DIS_QTY).invoke('val').should('eq', '150')
    })

    it("TC_BFSL_Trade_Equity_075: To validate that the user not able to enter more than 8 digit numeric values in the  Disclosed Qty field", () => {
        cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({force:true})
        cy.get(ORDER_PATH.ORDER_DIS_QTY).type(123456, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_DIS_QTY).invoke('val').should('eq', '123456')
    })


    it("TC_BFSL_Trade_Equity_076: To validate that the user not able to enter alphabet character in the Disclosed Qty field", () => {
        cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({force:true})
        cy.get(ORDER_PATH.ORDER_DIS_QTY).type('abcd', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_DIS_QTY).invoke('val').should('eq', '')
    })
    it("TC_BFSL_Trade_Equity_077: To validate that the user not able to enter alphanumeric character in the Disclosed Qty field", () => {
        cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({force:true})
        cy.get(ORDER_PATH.ORDER_DIS_QTY).type('abcd123', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_DIS_QTY).invoke('val').should('eq', '123')
    })
    it("TC_BFSL_Trade_Equity_078: To validate that the user not able to enter special character in the Disclosed Qty field", () => {
        cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({force:true})
        cy.get(ORDER_PATH.ORDER_DIS_QTY).type('@#$%%', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_DIS_QTY).invoke('val').should('eq', '')
    })
    it("TC_BFSL_Trade_Equity_079:To validate that the user not able to enter negative values in the Disclosed Qty field", () => {
        cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({force:true})
        cy.get(ORDER_PATH.ORDER_DIS_QTY).type(-10, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_DIS_QTY).invoke('val').should('eq', '10')
    })
    it("TC_BFSL_Trade_Equity_080:To validate that the user not able to enter decimal values in the Disclosed Qty field", () => {
        cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({force:true})
        cy.get(ORDER_PATH.ORDER_DIS_QTY).type(98.95, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_DIS_QTY).invoke('val').should('eq', '9895')
    })
    it("TC_BFSL_Trade_Equity_081:To validate that the error message is displayed for entering zero in the Disclosed Qty field", () => {
        cy.get(ORDER_PATH.ORDER_DIS_QTY).clear()
        cy.get(ORDER_PATH.ORDER_DIS_QTY).type(0, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({force:true})
        cy.get('.fieldRow .errorInputDiv .errorMsg-div').contains('Please enter a valid disclosed qty')

    })
    it("TC_BFSL_Trade_Equity_082: To validate that the error message is displayed for keeping the Disclosed Qty field as empty", () => {
        cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({force:true})
        // cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click()

        // NOTE : CLOSE ORDER CONFIRM DIALOG
    })
    it("TC_BFSL_Trade_Equity_083: To validate that the error message is displayed for entering the disclosed qty greater than the Qty", () => {
        cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({force:true})
        cy.get(ORDER_PATH.ORDER_DIS_QTY).type(7, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_QTY).clear({force:true})
        cy.get(ORDER_PATH.ORDER_QTY).type(1, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({force:true})
        cy.get('.fieldRow .errorInputDiv .errorMsg-div').contains('Disclosed qty should not be greater than the Qty')
    })

    it("TC_BFSL_Trade_Equity_084: To validate that the error message is displayed for entering the disclosed qty 10% lesser than the Qty", () => {
        cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({force:true})
        cy.get(ORDER_PATH.ORDER_DIS_QTY).type(1, { delay: 0 })

        cy.get(ORDER_PATH.ORDER_QTY).clear({force:true})
        cy.get(ORDER_PATH.ORDER_QTY).type(100, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({force:true})
        cy.get('.fieldRow .errorInputDiv .errorMsg-div').contains('Disclosed Qty should be Min 10% of Qty')
    })


    // trigger price validation 
    it("TC_BFSL_Trade_Equity_085: To validate that the user able to enter numeric values in the Trigger Price field", () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_DEL, ORDER_TYPES.ORD_SL)
        // cy.wait(500)
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(150, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).invoke('val').should('eq', '150')

    })

    it("TC_BFSL_Trade_Equity_086: To validate that the user not able to enter more than 8 digit numeric values in the  Trigger Price field", () => {
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(1234567891, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).invoke('val').should('eq', '123456789')
    })

    it("TC_BFSL_Trade_Equity_087: To validate that the user not able to enter alphabet character in the Trigger Price field", () => {
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type('abcd', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).invoke('val').should('eq', '')
    })

    it("TC_BFSL_Trade_Equity_088: To validate that the user not able to enter alphanumeric character in the Trigger Price field", () => {
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type('abcd123', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).invoke('val').should('eq', '123')
    })

    it("TC_BFSL_Trade_Equity_089: To validate that the user not able to enter special character in the Trigger Price field", () => {
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type('@#$%%', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).invoke('val').should('eq', '')
    })

    it("TC_BFSL_Trade_Equity_090: To validate that the user not able to enter negative values in the Trigger Price field", () => {
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(-10, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).invoke('val').should('eq', '-10')
    })

    it("TC_BFSL_Trade_Equity_091: To validate that the user able to enter decimal values in the Trigger Price field", () => {
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(98.95, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).invoke('val').should('eq', '98.95')
    })

    it("TC_BFSL_Trade_Equity_092: To validate that the user not able to enter more than two decimal values in the Trigger Price field", () => {
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(98.9594, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).invoke('val').should('eq', '98.95')
    })

  
    it('TC_BFSL_Trade_Equity_71 & 097: To validate that the user able to enter the price within the given range', () => {
        // cy.wait(300)
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({force:true})
        cy.searchSymbol("tcs bse")
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
        // cy.wait(100)
        cy.get('.prdTypeDiv .productType').contains('MTF').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_MTF, ORDER_TYPES.ORD_SL);
        // cy.wait(10)
    cy.get('.orderPadBase .moreOptBtn').click({ force: true })
    
    // cy.checkLength(ORDER_PATH.ORDER_VALIDITY_PATH, 1)
    // cy.get(ORDER_PATH.ORDER_VALIDITY_PATH).contains(VALIDITY.DAY)
    cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(1331.05, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '1331.05')
    cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(1352.05, { delay: 0 })
       
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    })
  
    it("TC_BFSL_Trade_Equity_093: To validate that the error message is displayed for entering zero in the Trigger Price field", () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({force:true})
        cy.searchSymbol("tcs bse")
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        cy.get('.prdTypeDiv .productType').contains('TNC').click({ force: true })

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_TNC, ORDER_TYPES.ORD_SL);
        // cy.wait(10)
        cy.get('.orderPadBase .moreOptBtn').click({force:true})
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(0, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .errorMsg-div').contains('Please enter a valid Trigger price')

    })

    it("TC_BFSL_Trade_Equity_094: To validate that the error message is displayed for keeping the Trigger Price field as empty", () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({force:true})
        cy.searchSymbol("tcs bse")
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        cy.get('.prdTypeDiv .productType').contains('TNC').click({ force: true })

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_TNC, ORDER_TYPES.ORD_SL);
        // cy.wait(10)
        cy.get('.orderPadBase .moreOptBtn').click({force:true})
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })

        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).invoke('val').should('to.be.empty')
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .errorMsg-div').contains('Please enter the Trigger Price')

    })

    // TC_BFSL_Trade_Equity_095 to 100 = need tick size and price range to validate

    it("TC_BFSL_Trade_Equity_099: To validate that the error message is displayed for entering the Trigger Price greater than the Limit price for the Buy orders", () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({force:true})
        cy.searchSymbol("tcs bse")
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        cy.get('.prdTypeDiv .productType').contains('TNC').click({ force: true })

        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_TNC, ORDER_TYPES.ORD_SL);
        // cy.wait(10)
        cy.get('.orderPadBase .moreOptBtn').click({force:true})

        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(10, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(20, { delay: 0 })

        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .errorMsg-div').contains('Trigger Price cannot be greater than the limit price')

    })
    // stop loss price validation
    it('TC_BFSL_Trade_Equity_101: To validate that the user able to enter numeric values in the Stop loss Price field', () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_LIMIT)
        // cy.wait(500)
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(150, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '150')
    })

    it('TC_BFSL_Trade_Equity_102: To validate that the user not able to enter more than 8 digit numeric values in the Stop loss Price field', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(1234567891, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '123456789')

    })

    it('TC_BFSL_Trade_Equity_103: To validate that the user not able to enter alphabet character in the Stop loss Price field', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type('abcd', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '')

    })

    it('TC_BFSL_Trade_Equity_104: To validate that the user not able to enter alphanumeric character in the Stop loss Price field', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type('abcd123', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '123')
    })

    it('TC_BFSL_Trade_Equity_105: To validate that the user not able to enter special character in the Stop loss Price field', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type('@#$%%', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '')
    })

    it('TC_BFSL_Trade_Equity_106: To validate that the user not able to enter negative values in the Stop loss Price field', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(-10, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '-10')
    })
    it('TC_BFSL_Trade_Equity_107: To validate that the user able to enter decimal values in the Stop loss Price field', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(98.95, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '98.95')
    })
    it('TC_BFSL_Trade_Equity_108: To validate that the user not able to enter more than two decimal values in the Stop loss Price field', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(98.9594, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '98.95')
    })

    it('TC_BFSL_Trade_Equity_109: To validate that the error message is displayed for entering zero in the Stop loss Price field', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(0, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .fieldRow  .errorInputDiv  .errorMsg-div').contains('Please enter a valid Stop loss value')
    })
    it('TC_BFSL_Trade_Equity_110: To validate that the error message is displayed for keeping the Stop loss Price field as empty', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .fieldRow  .errorInputDiv  .errorMsg-div').contains('Please enter the Stop loss')
    })

    // TC_BFSL_Trade_Equity_111 to 112 = need tick size


    it('TC_BFSL_Trade_Equity_113: To validate that the user able to enter the stop loss price within the given range', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })

        cy.get('div.range  span.lowerCircuitVal').then(($btn) => {
            const txt = $btn.text()
            cy.log(txt)
            cy.input(ORDER_PATH.ORDER_STOP_LOSS, txt)
        })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    })

    it('TC_BFSL_Trade_Equity_114: To validate that the error message is displayed for entering the Stop loss Price without the given range', () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })

        cy.get('div.range span.lowerCircuitVal').then(($btn) => {
            const txt = $btn.text()
            cy.log(txt)
            let n = txt - 1
            cy.log('n', n)

            cy.input(ORDER_PATH.ORDER_STOP_LOSS, -1)
        })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .fieldRow .errorInputDiv .errorMsg-div').contains('Please enter the Stoploss within the given range')

    })

    it('TC_BFSL_Trade_Equity_115: To validate that the error message is displayed for entering Stop loss price greater than the Limit price for the Buy orders', () => {
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(10, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get('div.range  span.lowerCircuitVal').then(($btn) => {
            const txt = $btn.text()
            cy.log(txt)
            cy.input(ORDER_PATH.ORDER_STOP_LOSS, 50)
        })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .fieldRow .errorInputDiv .errorMsg-div').contains('Please enter the Stoploss within the given range')

    })
    it('TC_BFSL_Trade_Equity_116: To validate that the error is message is displayed for entering Stop loss price lesser than the Limit price for the Sell orders', () => {
        // cy.wait(300)
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({force:true})
        cy.searchSymbol("tcs bse")
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
        // cy.wait(100)
        cy.get('.prdTypeDiv .productType').contains('INTRADAY').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)
    cy.get('.orderPadBase .moreOptBtn').click({ force: true })
    
    // cy.checkLength(ORDER_PATH.ORDER_VALIDITY_PATH, 1)
    // cy.get(ORDER_PATH.ORDER_VALIDITY_PATH).contains(VALIDITY.DAY)
    cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(1331.05, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '1331.05')
    cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(1312.05, { delay: 0 })
       
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    })
    it("TC_BFSL_Trade_Equity_117: To validate that the user able to enter numeric values in the Square off Sell/Buy field", () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_LIMIT)
        // cy.wait(500)
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).type(150, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).invoke('val').should('eq', '150')
    })

    it("TC_BFSL_Trade_Equity_118: To validate that the user not able to enter more than 8 digit numeric values in the Square off Sell/Buy field", () => {
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).type(1234567891, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).invoke('val').should('eq', '123456789')
    })

    it("TC_BFSL_Trade_Equity_119: To validate that the user not able to enter alphabet character in the Square off Sell/Buy field", () => {
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).type('abcd', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).invoke('val').should('eq', '')
    })

    it("TC_BFSL_Trade_Equity_120: To validate that the user not able to enter alphanumeric character in the Square off Sell/Buy field", () => {
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).type('abcd123', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).invoke('val').should('eq', '123')
    })
    it("TC_BFSL_Trade_Equity_121: To validate that the user not able to enter special character in the Square off Sell/Buy field", () => {
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).type('@#$%%', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).invoke('val').should('eq', '')
    })
    it("TC_BFSL_Trade_Equity_122: To validate that the user not able to enter negative values in the Square off Sell/Buy field", () => {
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).type(-10, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).invoke('val').should('eq', '-10')
    })
    it("TC_BFSL_Trade_Equity_123: To validate that the user able to enter decimal values in the Square off Sell/Buy field", () => {
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).type(98.95, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).invoke('val').should('eq', '98.95')

    })
    it("TC_BFSL_Trade_Equity_124: To validate that the user not able to enter more than two decimal values in the Square off Sell/Buy field", () => {
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).type(98.95256)
        cy.get(ORDER_PATH.ORDER_SQ_OFF).invoke('val').should('eq', '98.95')
    })
    it("TC_BFSL_Trade_Equity_125: To validate that the error message is displayed for entering zero in the Square off Sell/Buy field", () => {
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).type(0)
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .fieldRow .errorInputDiv .errorMsg-div').contains('Please enter a valid Square off value')

    })
    it("TC_BFSL_Trade_Equity_126: To validate that the error message is displayed for keeping the Square off Sell/Buy field as empty", () => {
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .fieldRow .errorInputDiv .errorMsg-div').contains('Please enter the Square Off')

    })

    // 127 to 128 - = need tick size to validate
    // stop loss validation
    it("TC_BFSL_Trade_Equity_129: To validate that the user able to enter numeric values in the Stop loss Sell/Buy field", () => {
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_LIMIT)
        // cy.wait(500)
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(150, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '150')

    })
    it("TC_BFSL_Trade_Equity_130: To validate that the user not able to enter more than 8 digit numeric values in the Stop loss Sell/Buy field", () => {

        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(123456789, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '123456789')
    })
    it("TC_BFSL_Trade_Equity_131: To validate that the user not able to enter alphabet character in the Stop loss Sell/Buy field", () => {

        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type('abcd', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '')
    })
    it("TC_BFSL_Trade_Equity_132: To validate that the user not able to enter alphanumeric character in the Stop loss Sell/Buy field", () => {

        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type('abcd123', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '123')
    })
    it("TC_BFSL_Trade_Equity_133: To validate that the user not able to enter special character in the Stop loss Sell/Buy field", () => {

        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type('@#$%%', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '')
    })
    it("TC_BFSL_Trade_Equity_134: To validate that the user not able to enter negative values in the Stop loss Sell/Buy field", () => {

        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(-10, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '-10')
    })
    it("TC_BFSL_Trade_Equity_135: To validate that the user able to enter decimal values in the Stop loss Sell/Buy field", () => {

        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(95.78, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '95.78')
    })
    it("TC_BFSL_Trade_Equity_136: To validate that the user not able to enter more than two decimal values in the Stop loss Sell/Buy field", () => {

        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(95.7825, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).invoke('val').should('eq', '95.78')
    })
    it("TC_BFSL_Trade_Equity_137: To validate that the error message is displayed for entering zero in the Stop loss Sell/Buy field", () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(0, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .fieldRow .errorInputDiv .errorMsg-div').contains('Please enter a valid Stop loss value')

    })
    it("TC_BFSL_Trade_Equity_138: To validate that the error message is displayed for keeping the Stop loss Sell/Buy field as empty", () => {
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .fieldRow .errorInputDiv .errorMsg-div').contains('Please enter the Stop loss')

    })
    // 

    it("TC_BFSL_Trade_Equity_141: To validate that the user able to enter numeric values in the Trailing stop loss field", () => {
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).type(150, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).invoke('val').should('eq', '150')
    })

    it("TC_BFSL_Trade_Equity_142: To validate that the user not able to enter more than 8 digit numeric values in the Trailing stop loss field", () => {
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).type(1234567891, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).invoke('val').should('eq', '123456789')

    })
    it("TC_BFSL_Trade_Equity_143: To validate that the user not able to enter alphabet character in the Trailing stop loss field", () => {
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).type('abcd', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).invoke('val').should('eq', '')

    })
    it("TC_BFSL_Trade_Equity_144: To validate that the user not able to enter alphanumeric character in the Trailing stop loss field", () => {
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).type('abcd123', { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).invoke('val').should('eq', '123')

    })
    it("TC_BFSL_Trade_Equity_145: To validate that the user not able to enter special character in the Trailing stop loss field", () => {
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).type("@#$%%", { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).invoke('val').should('eq', '')
    })
    it("TC_BFSL_Trade_Equity_146: To validate that the user not able to enter negative values in the Trailing stop loss field", () => {
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).type(-10, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).invoke('val').should('eq', '-10')

    })
    it("TC_BFSL_Trade_Equity_147: To validate that the user able to enter decimal values in the Trailing stop loss field", () => {
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).type(1.22, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).invoke('val').should('eq', '1.22')

    })
    it("TC_BFSL_Trade_Equity_148: To validate that the user not able to enter more than two decimal values in the Trailing stop loss field", () => {
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).type(95.70114, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).invoke('val').should('eq', '95.70')

    })
    it("TC_BFSL_Trade_Equity_149: To validate that the error message is displayed for entering zero in the Trailing stop loss field", () => {
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRAIL_SL).type(0, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get('.orderPadBase .fieldRow .errorInputDiv .errorMsg-div').contains('Please enter a valid Trailing stop loss')

    })

    it('TC_BFSL_Trade_Equity_159: To validate that the click on Submit order button in the bottom of the trade screen shows the confirm order popup', () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({force:true})
        cy.wait(1000)
        cy.searchSymbol("tcs bse",{delay: 0})
        cy.wait(1000)
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
        // cy.wait(100)
        cy.get('.prdTypeDiv .productType').contains('INTRADAY').click({ force: true })
        // cy.wait(10)
        cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_QTY).type(50, { delay: 0 })
        // cy.get('.orderPadBase .moreOptBtn').click({ force: true })
        // cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({ force: true })
        // cy.get(ORDER_PATH.ORDER_DIS_QTY).type(10, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
       
    })

 it('TC_BFSL_Trade_Equity_158: To validate that the click on Modify button in the confirm buy/sell order popup', () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({force:true})
        cy.wait(1000)
        cy.searchSymbol("tcs bse",{delay: 0})
        cy.wait(1000)
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
        // cy.wait(100)
        cy.get('.prdTypeDiv .productType').contains('INTRADAY').click({ force: true })
        // cy.wait(10)
        cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_QTY).type(50, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })

    // cy.get('.orderDialogConfirm .dialogConfirmFooter .action-button .modify').click({ force: true })
    // cy.isHidden('.orderDialogConfirm')
})
it("TC_BFSL_Trade_Equity_154: To validate that the click on cancel button in the trade buy/sell order screen", () => {
    cy.get(SEARCH_PATH.INPUT).focus()
    cy.get(SEARCH_PATH.INPUT).clear({force:true})
    cy.wait(1000)
    cy.searchSymbol("tcs bse",{delay: 1})
    cy.wait(1000)
    cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
    cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
    // cy.wait(100)
    cy.get('.prdTypeDiv .productType').contains('INTRADAY').click({ force: true })
    // cy.wait(10)
    cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_QTY).type(50, { delay: 0 })
    // cy.get('.orderPadBase .moreOptBtn').click({ force: true })
    // cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({ force: true })
    // cy.get(ORDER_PATH.ORDER_DIS_QTY).type(10, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    // cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })
    // cy.isVisible('.orderDialogConfirm')
    // cy.get('.orderDialogConfirm .dialogConfirmHeader .arrow-icon .leftArrowIcon').click({ force: true })

})

it("TC_BFSL_Trade_Equity_157: To validate that the click on confirm order button in the bottom of the confirma buy/sell order popup displays the user to the Order Success/Failure popup", () => {
    cy.get(SEARCH_PATH.INPUT).focus()
    cy.get(SEARCH_PATH.INPUT).clear({force:true})
    cy.searchSymbol("tcs bse")
    cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
    cy.get('.prdTypeDiv .productType').contains('DELIVERY').click({ force: true })
    cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_QTY).type(50, { delay: 0 })
    // cy.get('.orderPadBase .moreOptBtn').click({ force: true })
    // cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({ force: true })
    // cy.get(ORDER_PATH.ORDER_DIS_QTY).type(10, { delay: 0 })
     cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    // cy.wait(10)
    // cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
    // cy.wait(10)
    // cy.isVisible('.orderConfirmSuccess')
    // cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })
})

it("TC_BFSL_Trade_Equity_156: To validate that the selected fields are displayed under the confirm buy/sell order popup", () => {
    cy.get(SEARCH_PATH.INPUT).focus()
    cy.get(SEARCH_PATH.INPUT).clear({force:true})
    cy.searchSymbol("tcs nse")
    cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
    cy.get('.prdTypeDiv .productType').contains('DELIVERY').click({ force: true })
  cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_DEL, ORDER_TYPES.ORD_LIMIT)
  cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
  cy.get(ORDER_PATH.ORDER_QTY).type(50, { delay: 0 })
  cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
  cy.get(ORDER_PATH.ORDER_PRICE).type(3217.05, { delay: 0 })
  cy.get('.orderPadBase .moreOptBtn').click({ force: true })
  cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({ force: true })
  cy.get(ORDER_PATH.ORDER_DIS_QTY).type(10, { delay: 0 })
    cy.wait(500)
 
     cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    // cy.TradeSelectionFieldValidation()

})


it('TC_BFSL_Trade_Equity_150: To validate that the error message is displayed for keeping the Trailing stop loss field as empty', () => {
    // cy.wait(300)
    cy.get(SEARCH_PATH.INPUT).focus()
    cy.get(SEARCH_PATH.INPUT).clear({force:true})
    cy.wait(1000)
    cy.searchSymbol("tcs bse",{delay: 0})
    cy.wait(1000)
    cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
    cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
    // cy.wait(100)
    cy.get('.prdTypeDiv .productType').contains('INTRADAY').click({ force: true })
    cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_LIMIT);
    // cy.wait(10)
cy.get('.orderPadBase .moreOptBtn').click({ force: true })

// cy.checkLength(ORDER_PATH.ORDER_VALIDITY_PATH, 1)
// cy.get(ORDER_PATH.ORDER_VALIDITY_PATH).contains(VALIDITY.DAY)
cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_PRICE).type(1331.05, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '1331.05')
cy.get(ORDER_PATH.ORDER_TRAIL_SL).clear({ force: true })

   
    cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
})

it('TC_BFSL_Trade_Equity_153: To validate that the Order value and submit order button is shown to the user at the bottom of the trade screen when all the mandatory fields are filled by the user', () => {
    cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_DEL, ORDER_TYPES.ORD_LIMIT)
    // cy.wait(500)
    cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_QTY).type(10, { delay: 0 })
    cy.isVisible('.footer .marginDiv')
    cy.isVisible(ORDER_PATH.ORDER_SUBMIT_BTN)
})



it('TC_BFSL_Trade_Equity_155: To validate that the click outside of the trade buy/sell screen', () => {
    cy.get(SEARCH_PATH.INPUT).focus()
    cy.get(SEARCH_PATH.INPUT).clear({force:true})
    cy.searchSymbol("tcs bse")
    cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
    cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
    // cy.wait(100)
cy.get('.orderPadBase').click(-20, -20, { force: true, multiple: true });
   
})


it('TC_BFSL_Trade_Equity_161: To validate that the user not able to place short sell order in the other product types CNC/CO/BO', () => {
    cy.get(SEARCH_PATH.INPUT).focus()
    cy.get(SEARCH_PATH.INPUT).clear({force:true})
    cy.searchSymbol("tcs bse")
    cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
    cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
    // cy.wait(100)
    cy.placeorder(ORDER_SYMBOL, {
        [ORDER_KEYS.PRODUCT_TYPE]: PRODUCT_TYPES.PRD_TNC,
        [ORDER_KEYS.ORDER_TYPE]: ORDER_TYPES.ORD_MRK,
        // [ORDER_KEYS.QTY]: '10',
        // [ORDER_KEYS.VALIDITY] : VALIDITY.DAY

    })
})

  
//place order
it('TC_BFSL_Trade_Equity_160: To validate that the user able to place short sell orders only in the MTF product type', () => {
    cy.get(SEARCH_PATH.INPUT).focus()
    cy.get(SEARCH_PATH.INPUT).clear({force:true})
    cy.searchSymbol("tcs nse")
    cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
    cy.get('.prdTypeDiv .productType').contains('DELIVERY').click({ force: true })
  cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_MTF, ORDER_TYPES.ORD_LIMIT)
  cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
  cy.get(ORDER_PATH.ORDER_PRICE).type(3217.05, { delay: 0 })    
     cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })

})


    //169 & 170 fund
    it('TC_BFSL_Trade_Equity_168: To validate that the user able to place successful Sell order for TNC/Limit order', () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({force:true})
        cy.searchSymbol("tcs nse")
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
        // cy.wait(500)
        cy.placeorder(ORDER_SYMBOL, {
            [ORDER_KEYS.PRODUCT_TYPE]: PRODUCT_TYPES.PRD_TNC,
            [ORDER_KEYS.ORDER_TYPE]: ORDER_TYPES.ORD_LIMIT,
            // [ORDER_KEYS.QTY]: '10',
            [ORDER_KEYS.PRICE]: '0'
            // [ORDER_KEYS.VALIDITY] : VALIDITY.DAY
        })
    })

    it('TC_BFSL_Trade_Equity_164 : To validate that the click on the cancel button closes the order failure popup', () => {
        cy.isHidden('.orderConfirmSuccess')
    })
      // 173 - after 3.30 intraday order get rejected
     
    it('TC_BFSL_Trade_Equity_165:  To validate that the click outside of the order failure popup not closes the order failure popup', () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({force:true})
        cy.searchSymbol("tcs nse")
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .sell-btn:first').click({ force: true })
        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
        // cy.wait(100)
        cy.placeorder(ORDER_SYMBOL, {
            [ORDER_KEYS.PRODUCT_TYPE]: PRODUCT_TYPES.PRD_TNC,
            [ORDER_KEYS.ORDER_TYPE]: ORDER_TYPES.ORD_LIMIT,
            [ORDER_KEYS.PRICE]: '3217.05',
            // [ORDER_KEYS.VALIDITY] : VALIDITY.DAY

        })
        // cy.get('.orderDialogConfirm').click(-20, -20, { force: true, multiple: true });


    })

    it('TC_BFSL_Trade_Equity_167: To validate that the user able to Place successful Buy/Sell order for the NSE exchange', () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({force:true})
        cy.searchSymbol("tcs nse")
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
        // cy.wait(500)
        cy.placeorder(ORDER_SYMBOL, {
            [ORDER_KEYS.PRODUCT_TYPE]: PRODUCT_TYPES.PRD_MTF,
            [ORDER_KEYS.ORDER_TYPE]: ORDER_TYPES.ORD_MRK,
            // [ORDER_KEYS.QTY]: '10',
            // [ORDER_KEYS.VALIDITY] : VALIDITY.DAY

        })
    })
    it('TC_BFSL_Trade_Equity_166: To validate that the Intraday/Delivery orders get rejected after the Market hours (3:30)', () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({force:true})
        cy.searchSymbol("tcs bse")
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
        // cy.wait(100)
        cy.placeorder(ORDER_SYMBOL, {
            [ORDER_KEYS.PRODUCT_TYPE]: PRODUCT_TYPES.PRD_INTRA,
            [ORDER_KEYS.ORDER_TYPE]: ORDER_TYPES.ORD_MRK,
            // [ORDER_KEYS.PRICE]: '1310.05',
            // [ORDER_KEYS.VALIDITY] : VALIDITY.DAY
    
        })
    
    })
 
    it('TC_BFSL_Trade_Equity_169: To validate that the user able to place successful Buy order for TNC/Market order', () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({force:true})
        cy.searchSymbol("tcs nse")
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        // cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
        // cy.wait(500)
        cy.placeorder(ORDER_SYMBOL, {
            [ORDER_KEYS.PRODUCT_TYPE]: PRODUCT_TYPES.PRD_TNC,
            [ORDER_KEYS.ORDER_TYPE]: ORDER_TYPES.ORD_MRK,
            // [ORDER_KEYS.QTY]: '10',
            // [ORDER_KEYS.VALIDITY] : VALIDITY.DAY

        })
    })
    it('TC_BFSL_Trade_Equity_170: To validate that the user able to place successful Sell order for TNC/Market order', () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({force:true})
        cy.searchSymbol("tcs nse")
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
        // cy.wait(500)
        cy.placeorder(ORDER_SYMBOL, {
            [ORDER_KEYS.PRODUCT_TYPE]: PRODUCT_TYPES.PRD_TNC,
            [ORDER_KEYS.ORDER_TYPE]: ORDER_TYPES.ORD_MRK,
            // [ORDER_KEYS.QTY]: '10',
            // [ORDER_KEYS.VALIDITY] : VALIDITY.DAY

        })
    })





    it('TC_BFSL_Trade_Equity_171:  To validate that the user able to place the TNC/Limit Buy order on entering the Disclosed qty', () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({force:true})
        cy.wait(100)
        cy.searchSymbol("tcs nse")
        cy.wait(100)
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_TNC, ORDER_TYPES.ORD_LIMIT)
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(3217.05, { delay: 0 })    
            cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })

    })

    it('TC_BFSL_Trade_Equity_172:  To validate that the user able to place the TNC/Limit Sell order on entering the Disclosed qty', () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({force:true})
        cy.wait(10)
        cy.searchSymbol("tcs nse")
        cy.wait(10)
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .sell-btn:first').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_TNC, ORDER_TYPES.ORD_LIMIT)
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(3217.05, { delay: 0 })    
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    })  

    it('TC_BFSL_Trade_Equity_177: To validate that the user able to place successful Buy order for TNC/SL order', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.buy-btn2').click({ force: true });
        // cy.wait(2000)
        cy.get('.prdTypeDiv .productType').contains('TNC').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_TNC, ORDER_TYPES.ORD_SL);
        // cy.wait(10)
    cy.get('.orderPadBase .moreOptBtn').click({ force: true })
    cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_PRICE).type(1431.05, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '1431.05')
    cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_DIS_QTY).type(50, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_QTY).type(100, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(1430.05, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).invoke('val').should('eq', '1430.05')

    cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
    // cy.wait(300)
    cy.isVisible('.orderDialogBase .orderConfirmSuccess')
    
    cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })


    })
    it('TC_BFSL_Trade_Equity_178:  To validate that the user able to place successful Sell order for TNC/SL-M order', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.sell-btn2').click({ force: true });
        // cy.wait(2000)
        cy.get('.prdTypeDiv .productType').contains('TNC').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_TNC, ORDER_TYPES.ORD_SLM);
        // cy.wait(10)
    // cy.get('.orderPadBase .moreOptBtn').click({ force: true })
  
    // cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({ force: true })
    // cy.get(ORDER_PATH.ORDER_DIS_QTY).type(50, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_QTY).type(100, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(1430.05, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).invoke('val').should('eq', '1430.05')

    cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
    // cy.wait(300)
    cy.isVisible('.orderDialogBase .orderConfirmSuccess')
    
    cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })

    })  
    it('TC_BFSL_Trade_Equity_179: To validate that the user able to place successful Buy order for TNC/SL-M order', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.buy-btn2').click({ force: true });
        // cy.wait(2000)
        cy.get('.prdTypeDiv .productType').contains('TNC').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_TNC, ORDER_TYPES.ORD_SLM);
        // cy.wait(10)
    cy.get('.orderPadBase .moreOptBtn').click({ force: true })
  
    cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_DIS_QTY).type(50, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_QTY).type(100, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(1430.05, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).invoke('val').should('eq', '1430.05')

    cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
    // cy.wait(300)
    cy.isVisible('.orderDialogBase .orderConfirmSuccess')
    
    cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })

    })

    // it('TC_BFSL_Trade_Equity_187: To validate that the user able to place successful Sell order for TNC/SL-M order', () => {
    //     cy.get(SEARCH_PATH.INPUT).focus()
    //     cy.get(SEARCH_PATH.INPUT).clear({force:true})
    //     cy.searchSymbol("tcs nse")
    //     cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })

    //     cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
    //    cy.wait(500)
    //     cy.placeorder(ORDER_SYMBOL, {
    //         [ORDER_KEYS.PRODUCT_TYPE]: PRODUCT_TYPES.PRD_TNC,
    //         [ORDER_KEYS.ORDER_TYPE]: ORDER_TYPES.ORD_SLM,
    //         // [ORDER_KEYS.QTY]: '10',
    //         [ORDER_KEYS.SLM_TRIGGER_PRICE]: '0',
    //         // [ORDER_KEYS.VALIDITY] : VALIDITY.DAY
    //         // })
    //     })
    // })
    it('TC_BFSL_Trade_Equity_173: To validate that the user able to place the TNC/Market Buy order on entering the Disclosed qty', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.buy-btn2').click({ force: true });
        // cy.wait(2000)
        cy.get('.prdTypeDiv .productType').contains('TNC').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_TNC, ORDER_TYPES.ORD_MRK);
        // cy.wait(10)
    cy.get('.orderPadBase .moreOptBtn').click({ force: true })
  
    // cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({ force: true })
    // cy.get(ORDER_PATH.ORDER_DIS_QTY).type(50, { delay: 0 })
   
    cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
    // cy.wait(300)
    cy.isVisible('.orderDialogBase .orderConfirmSuccess')
    
    cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })

    })  
   

    it('TC_BFSL_Trade_Equity_181: To validate that the user able to place successful buy order for MTF/Limit order', () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({force:true})
        cy.searchSymbol("tcs bse")
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        cy.get('.orderPadBase .actionDiv .BUY').click({ force: true })
        // cy.wait(100)
        cy.placeorder(ORDER_SYMBOL, {
            [ORDER_KEYS.PRODUCT_TYPE]: PRODUCT_TYPES.PRD_MTF,
            [ORDER_KEYS.ORDER_TYPE]: ORDER_TYPES.ORD_LIMIT,
            // [ORDER_KEYS.VALID_PRICE]: '3217.05'
            // [ORDER_KEYS.PRICE]: '1341.05',
            // [ORDER_KEYS.QTY]: '10',
            // [ORDER_KEYS.VALIDITY] : VALIDITY.DAY
            // })

        })
    })
    it('TC_BFSL_Trade_Equity_174: To validate that the user able to place the TNC/Market Sell order on entering the Disclosed qty', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.sell-btn2').click({ force: true });
        // cy.wait(2000)
        cy.get('.prdTypeDiv .productType').contains('TNC').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_TNC, ORDER_TYPES.ORD_MRK);
        // cy.wait(10)
    cy.get('.orderPadBase .moreOptBtn').click({ force: true })
  
    // cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({ force: true })
    // cy.get(ORDER_PATH.ORDER_DIS_QTY).type(50, { delay: 0 })
   
    cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
    // cy.wait(300)
    cy.isVisible('.orderDialogBase .orderConfirmSuccess')
    
    cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })

    })  
 
    // it('TC_BFSL_Trade_Equity_189: To validate that the user able to place successful buy order for MTF/Limit order', () => {
    //     cy.get(SEARCH_PATH.INPUT).focus()
    //     cy.get(SEARCH_PATH.INPUT).clear({force:true})
    //     cy.searchSymbol("tcs nse")
    //     cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })

    //     cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
    //     cy.wait(1000)
        
    //     cy.placeorder(ORDER_SYMBOL, {
    //         [ORDER_KEYS.PRODUCT_TYPE]: PRODUCT_TYPES.PRD_MTF,
    //         [ORDER_KEYS.ORDER_TYPE]: ORDER_TYPES.ORD_LIMIT,
    //         // [ORDER_KEYS.QTY]: '10',
    //         // [ORDER_KEYS.VALIDITY] : VALIDITY.DAY
    //         // })
    //     })
    // })

    // it('TC_BFSL_Trade_Equity_184: To validate that the user able to place successful Buy order for MTF/Market order', () => {
    //     cy.get(SEARCH_PATH.INPUT).focus()
    //     cy.get(SEARCH_PATH.INPUT).clear({force:true})
    //     cy.searchSymbol("tcs nse")
    //     cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })

    //     // cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
    //     cy.wait(500)
    //     cy.placeorder(ORDER_SYMBOL, {
    //         [ORDER_KEYS.PRODUCT_TYPE]: PRODUCT_TYPES.PRD_MTF,
    //         [ORDER_KEYS.ORDER_TYPE]: ORDER_TYPES.ORD_MRK,
    //         // [ORDER_KEYS.QTY]: '10',
    //         // [ORDER_KEYS.VALIDITY] : VALIDITY.DAY
    //     })
    // })
    it('TC_BFSL_Trade_Equity_184: To validate that the user able to place successful Sell order for MTF/Market order', () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({force:true})
        cy.searchSymbol("tcs nse")
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })

        cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
        cy.placeorder(ORDER_SYMBOL, {
            [ORDER_KEYS.PRODUCT_TYPE]: PRODUCT_TYPES.PRD_MTF,
            [ORDER_KEYS.ORDER_TYPE]: ORDER_TYPES.ORD_MRK,
            // [ORDER_KEYS.QTY]: '10',
            // [ORDER_KEYS.VALIDITY] : VALIDITY.DAY
        })

    })
    
    
    it('TC_BFSL_Trade_Equity_185: To validate that the user able to place successful Buy order for MTF/Limit order  on entering the Disclosed qty', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.buy-btn2').click({ force: true });
        // cy.wait(2000)
        cy.get('.prdTypeDiv .productType').contains('MTF').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_MTF, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)
    cy.get('.orderPadBase .moreOptBtn').click({ force: true })
    cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_PRICE).type(1431.05, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '1431.05')
    cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_DIS_QTY).type(50, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_QTY).type(100, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
    // cy.wait(300)
    cy.isVisible('.orderDialogBase .orderConfirmSuccess')
    
    cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })

    })    
    it('TC_BFSL_Trade_Equity_186: To validate that the user able to place the MTF/Limit Sell order on entering the Disclosed qty', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.sell-btn2').click({ force: true });
        // cy.wait(2000)
        cy.get('.prdTypeDiv .productType').contains('MTF').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_MTF, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)
    cy.get('.orderPadBase .moreOptBtn').click({ force: true })
    cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_PRICE).type(1431.05, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '1431.05')
    cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_DIS_QTY).type(2, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_QTY).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_QTY).type(5, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
    // cy.wait(300)
    cy.isVisible('.orderDialogBase .orderConfirmSuccess')
    
    cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })

    })
  
    it('TC_BFSL_Trade_Equity_189: To validate that the user able to Place AMO Buy Order for the MTF/Limit order', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.buy-btn2').click({ force: true });
        // cy.wait(2000)
        // cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
        // cy.wait(500)
        cy.placeorder(ORDER_SYMBOL, {
            [ORDER_KEYS.PRODUCT_TYPE]: PRODUCT_TYPES.PRD_MTF,
            [ORDER_KEYS.ORDER_TYPE]: ORDER_TYPES.ORD_LIMIT,
            // [ORDER_KEYS.QTY]: '10',
            [ORDER_KEYS.VALID_PRICE]: '1230.05',

            // [ORDER_KEYS.VALIDITY] : VALIDITY.DAY,
            [ORDER_KEYS.AMO]: true
        })
    })

    
    it('TC_BFSL_Trade_Equity_187: To validate that the user able to place the MTF/Market Buy order on entering the Disclosed qty', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.buy-btn2').click({ force: true });
        // cy.wait(2000)
        cy.get('.prdTypeDiv .productType').contains('MTF').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_MTF, ORDER_TYPES.ORD_MRK);
        // cy.wait(10)
    cy.get('.orderPadBase .moreOptBtn').click({ force: true })
    
    // cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({ force: true })
    // cy.get(ORDER_PATH.ORDER_DIS_QTY).type(2, { delay: 0 })

    cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
    // cy.wait(300)
    cy.isVisible('.orderDialogBase .orderConfirmSuccess')
    
    cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })

    })
    
    it('TC_BFSL_Trade_Equity_188: To validate that the user able to place the MTF/Market Sell order on entering the Disclosed qty', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.sell-btn2').click({ force: true });
        // cy.wait(2000)
        cy.get('.prdTypeDiv .productType').contains('MTF').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_MTF, ORDER_TYPES.ORD_MRK);
        // cy.wait(10)
    cy.get('.orderPadBase .moreOptBtn').click({ force: true })
    
    // cy.get(ORDER_PATH.ORDER_DIS_QTY).clear({ force: true })
    // cy.get(ORDER_PATH.ORDER_DIS_QTY).type(2, { delay: 0 })

    cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
    // cy.wait(300)
    cy.isVisible('.orderDialogBase .orderConfirmSuccess')
    
    cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })

    })

    it('TC_BFSL_Trade_Equity_190: To validate that the user able to Place AMO Sell Order for the MTF/Limit order', () => {
            cy.get(SEARCH_PATH.INPUT).focus()
            cy.get(SEARCH_PATH.INPUT).clear({force:true})
            cy.searchSymbol("tcs nse")
            cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
    
            cy.get('.orderPadBase .actionDiv .SELL').click({ force: true })
            // cy.wait(500)
        cy.placeorder(ORDER_SYMBOL, {
            [ORDER_KEYS.PRODUCT_TYPE]: PRODUCT_TYPES.PRD_MTF,
            [ORDER_KEYS.ORDER_TYPE]: ORDER_TYPES.ORD_LIMIT,
            // [ORDER_KEYS.QTY]: '10',
            [ORDER_KEYS.VALID_PRICE]: '0',

            // [ORDER_KEYS.VALIDITY] : VALIDITY.DAY,
            [ORDER_KEYS.AMO]: true
        })
    })

    it('TC_BFSL_Trade_Equity_191: To validate that the user able to place successful Buy order for MTF/SL order', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.buy-btn2').click({ force: true });
        // cy.wait(2000)
        cy.get('.prdTypeDiv .productType').contains('MTF').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_MTF, ORDER_TYPES.ORD_SL);
        // cy.wait(10)
    cy.get('.orderPadBase .moreOptBtn').click({ force: true })
    
    // cy.checkLength(ORDER_PATH.ORDER_VALIDITY_PATH, 1)
    // cy.get(ORDER_PATH.ORDER_VALIDITY_PATH).contains(VALIDITY.DAY)
    cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(1531.05, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '1531.05')
    cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(1432.05, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
    // cy.wait(300)
    cy.isVisible('.orderDialogBase .orderConfirmSuccess')
    
    cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })
    })
  
    it('TC_BFSL_Trade_Equity_192: To validate that the user able to place successful Sell order for MTF/SL order', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.sell-btn2').click({ force: true });
        // cy.wait(2000)
        cy.get('.prdTypeDiv .productType').contains('MTF').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_MTF, ORDER_TYPES.ORD_SL);
        // cy.wait(10)
    cy.get('.orderPadBase .moreOptBtn').click({ force: true })
    
    // cy.checkLength(ORDER_PATH.ORDER_VALIDITY_PATH, 1)
    // cy.get(ORDER_PATH.ORDER_VALIDITY_PATH).contains(VALIDITY.DAY)
    cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(1431.05, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '1431.05')
    cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(1452.05, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
    // cy.wait(300)
    cy.isVisible('.orderDialogBase .orderConfirmSuccess')
    
    cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })
    })
    
    it('TC_BFSL_Trade_Equity_193: To validate that the user able to place successful Buy order for MTF/SL-M order', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.buy-btn2').click({ force: true });
        // cy.wait(2000)
        cy.get('.prdTypeDiv .productType').contains('MTF').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_MTF, ORDER_TYPES.ORD_SLM);
        // cy.wait(10)
    cy.get('.orderPadBase .moreOptBtn').click({ force: true })
    
    cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(1452.05, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
    // cy.wait(300)
    cy.isVisible('.orderDialogBase .orderConfirmSuccess')
    
    cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })

    })
    
    

    it('TC_BFSL_Trade_Equity_194: To validate that the user able to place successful Sell order for MTF/SL-M order', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.sell-btn2').click({ force: true });
        // cy.wait(2000)
        cy.get('.prdTypeDiv .productType').contains('MTF').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_MTF, ORDER_TYPES.ORD_SLM);
        // cy.wait(10)
    cy.get('.orderPadBase .moreOptBtn').click({ force: true })
    
    cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(1552.05, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
    // cy.wait(300)
    cy.isVisible('.orderDialogBase .orderConfirmSuccess')
    
    cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })

    })

   

    it('TC_BFSL_Trade_Equity_195: To validate that the user able to place successful Buy order for CO/Limit order', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.buy-btn2').click({ force: true });
        // cy.wait(2000)
    cy.get('.prdTypeDiv .productType').contains('INTRADAY').click({ force: true })
    cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_LIMIT)
    cy.get('.orderPadBase .moreOptBtn').click({ force: true })
    
    cy.checkLength(ORDER_PATH.ORDER_VALIDITY_PATH, 1)
    cy.get(ORDER_PATH.ORDER_VALIDITY_PATH).contains(VALIDITY.DAY)
    cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(1631.05, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '1631.05')
    // cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
    // cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(1532.05, { delay: 0 })
    // cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    // cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
    // // cy.wait(300)
    // cy.isVisible('.orderDialogBase .orderConfirmSuccess')
    
    // cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })
    })
    
        
    it('TC_BFSL_Trade_Equity_196: To validate that the user able to place successful Sell order for CO/Limit order', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.sell-btn2').click({ force: true });
        // cy.wait(2000)
        cy.get('.prdTypeDiv .productType').contains('INTRADAY').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_LIMIT);
        // cy.wait(10)
    cy.get('.orderPadBase .moreOptBtn').click({ force: true })
    
    cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_PRICE).type(1572.05, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
    cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(1584.05, { delay: 0 })
    cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    // cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
    // // cy.wait(300)
    // cy.isVisible('.orderDialogBase .orderConfirmSuccess')
    
    // cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })

    })
    
    it('TC_BFSL_Trade_Equity_198: To validate that the user able to place successful Sell order for CO/Market order', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.sell-btn2').click({ force: true });
        // cy.wait(2000)
        cy.get('.prdTypeDiv .productType').contains('INTRADAY').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_MRK);
        // cy.wait(10)
        cy.get('.orderPadBase .moreOptBtn').click({ force: true })
        
        // cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        // cy.get(ORDER_PATH.ORDER_PRICE).type(1662.05, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(1594.05, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        // cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
        // // cy.wait(300)
        // cy.isVisible('.orderDialogBase .orderConfirmSuccess')
        
        // cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })

    })
    
 

    it('TC_BFSL_Trade_Equity_197: To validate that the user able to place successful Buy order for CO/Market order', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.buy-btn2').click({ force: true });
        // cy.wait(2000)
    cy.get('.prdTypeDiv .productType').contains('INTRADAY').click({ force: true })
    cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_CO, ORDER_TYPES.ORD_MRK)
  
    // cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
    // cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(1552.05, { delay: 0 })
    // cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
    // cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
    // // cy.wait(300)
    // cy.isVisible('.orderDialogBase .orderConfirmSuccess')
    
    // cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })
    })

    it('TC_BFSL_Trade_Equity_199: To validate that the user able to place successful Buy order for BO/Limit order', () => {
                cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
                // cy.wait(3000)
            cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.buy-btn2').click({ force: true })
                // cy.wait(2000)
            cy.get('.prdTypeDiv .productType').contains('INTRADAY').click({ force: true })
            cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_LIMIT)
            // cy.get('.orderPadBase .moreOptBtn').click({ force: true })
        
            // cy.checkLength(ORDER_PATH.ORDER_VALIDITY_PATH, 1)
            // cy.get(ORDER_PATH.ORDER_VALIDITY_PATH).contains(VALIDITY.DAY)
            cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
            cy.get(ORDER_PATH.ORDER_PRICE).type(1431.05, { delay: 0 })
            cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '1431.05')
        
            // cy.wait(500)
            cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
            cy.get(ORDER_PATH.ORDER_SQ_OFF).type(1510.05, { delay: 0 })
        
            cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
            cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(1430.05, { delay: 0 })
            cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
            cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
            // cy.wait(300)
            cy.isVisible('.orderDialogBase .orderConfirmSuccess')
        
            cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })
    })
    it('TC_BFSL_Trade_Equity_200 & 201: To validate that the user able to place successful Sell order for BO/Limit order', () => {
            cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
            // cy.wait(3000)
            cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.sell-btn2').click({ force: true });
            // cy.wait(2000)
            cy.get('.prdTypeDiv .productType').contains('INTRADAY').click({ force: true })
            cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_LIMIT)
            // cy.get('.orderPadBase .moreOptBtn').click({ force: true })
        
            // cy.checkLength(ORDER_PATH.ORDER_VALIDITY_PATH, 1)
            // cy.get(ORDER_PATH.ORDER_VALIDITY_PATH).contains(VALIDITY.DAY)
            cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
            cy.get(ORDER_PATH.ORDER_PRICE).type(1431.05, { delay: 0 })
            cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '1431.05')
        
            // cy.wait(500)
            cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
            cy.get(ORDER_PATH.ORDER_SQ_OFF).type(1450.05, { delay: 0 })
        
            cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
            cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(1452.05, { delay: 0 })
            cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
            cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
            // cy.wait(300)
            cy.isVisible('.orderDialogBase .orderConfirmSuccess')
        
            cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })
    })

   
    it('TC_BFSL_Trade_Equity_202: To validate that the user able to place successful Sell order for BO/SL', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(3000)
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.sell-btn2').click({ force: true });
        // cy.wait(2000)
        cy.get('.prdTypeDiv .productType').contains('INTRADAY').click({ force: true })
        cy.updatePrdandOrdType(PRODUCT_TYPES.PRD_BO, ORDER_TYPES.ORD_SL)
        // cy.get('.orderPadBase .moreOptBtn').click({ force: true })

        // cy.checkLength(ORDER_PATH.ORDER_VALIDITY_PATH, 1)
        // cy.get(ORDER_PATH.ORDER_VALIDITY_PATH).contains(VALIDITY.DAY)
        cy.get(ORDER_PATH.ORDER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_PRICE).type(1451.05, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_PRICE).invoke('val').should('eq', '1451.05')
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_TRIGGER_PRICE).type(1520.05, { delay: 0 })
        // cy.wait(500)
        cy.get(ORDER_PATH.ORDER_SQ_OFF).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_SQ_OFF).type(1510.05, { delay: 0 })

        cy.get(ORDER_PATH.ORDER_STOP_LOSS).clear({ force: true })
        cy.get(ORDER_PATH.ORDER_STOP_LOSS).type(1472.05, { delay: 0 })
        cy.get(ORDER_PATH.ORDER_SUBMIT_BTN).click({ force: true })
        cy.get(ORDER_PATH.ORDER_CONFIRM_BTN).click({ force: true })
        // cy.wait(300)
        cy.isVisible('.orderDialogBase .orderConfirmSuccess')

        cy.get(ORDER_PATH.ORDER_RESULT_BTN).click({ force: true })
    })

    it('TC_BFSL_Trade_Equity_163: To validate that the click on Add funds option redirect the user to Fund transfer screen', () => {
        cy.get('.availFund-div .addFundBtn').click({ force: true })
        // cy.wait(100)
        cy.get('.funds-base-comp .funds-content .content-left .fundTransfer-base .widget-loader-div .available-details .action-btns button.add-funds').click({ force: true })
        // cy.wait(200)
        
   
   
    })
})

      