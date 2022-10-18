import {
    URL, PASSWORD, PAN_NUMBER, USER_NAME, LOGIN_PASS_ERROR, SEARCH_PATH
} from '../support/config'

before(function () {
    cy.visit(URL)
    Cypress.Cookies.defaults({
        preserve: ['JSESSIONID', 'Auth-Token'],
    })
})

describe("Search", () => {

    // for single file execution 
    it('username  - valid', () => {
        cy.login(USER_NAME, PASSWORD, PAN_NUMBER)
        cy.wait(3000)
        cy.isLoginSuccess()
    })

    it("TC_BFSL_Search_001: To validate that the click on search bar displays the Search popup", () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        // cy.closeIcon()
    })
    it("TC_BFSL_Search_002:To validate the availability of fields in the search screen", () => {

        cy.checkLength('.symbol-search-div .searchIcon', 0)
        // cy.checkText('.symSearch-base .input-addOn','Search INFY, Bankn NFO, Silver MCX')
    })
    it("TC_BFSL_Search_003: To validate that search of Equity symbols displays the search result of Equity cash,Equity derivatives and Equity Options symbols", () => {
        cy.get('.symSearch-base .input-addOn .input-ele').clear()
        cy.get('.symSearch-base .input-addOn .input-ele').type('tcs')
        // cy.wait(1000)
    })

    it("TC_BFSL_Search_004 & 007: To validate that the search of symbols displays the corresponding search result", () => {
        // cy.selectSearchOption(SEARCH_OPTIONS.EQUITY, SEARCH_OPTIONS.CASH)
        // cy.get(SEARCH_PATH.INPUT).clear()
        cy.input(SEARCH_PATH.INPUT, "TCS")
        // cy.wait(2000)
        cy.get('.searchResutDiv').first().get('.symbolRow-div .symbol .dispSym').contains("TCS", { matchCase: false })

    })
    // it("TC_BFSL_Search_005: To validate that the search of symbols displays the corresponding search result", () => {
    //     // cy.selectSearchOption(SEARCH_OPTIONS.EQUITY, SEARCH_OPTIONS.FUTURE)
    //     // cy.get(SEARCH_PATH.INPUT).clear()
    //     cy.input(SEARCH_PATH.INPUT, "TCS")
    //     // cy.wait(2000)
    //     cy.get('.searchResutDiv').first().get('.symbolRow-div .symbol .dispSym').contains("TCS", { matchCase: false })

    // })
    // it("TC_BFSL_Search_006: To validate that the search of Equity option symbols displays the corresponding search result", () => {
    //     // cy.selectSearchOption(SEARCH_OPTIONS.EQUITY, SEARCH_OPTIONS.OPTION)
    //     // cy.get(SEARCH_PATH.INPUT).clear()
    //     cy.input(SEARCH_PATH.INPUT, "TCS")
    //     // cy.wait(2000)
    //     cy.get('.searchResutDiv').first().get('.symbolRow-div .symbol .dispSym').contains("TCS", { matchCase: false })

    // })
    it("TC_BFSL_Search_008: To validate that the search request is not triggered when user searched of MIN 2 characters in the search bar", () => {
        // cy.selectSearchOption(SEARCH_OPTIONS.EQUITY, SEARCH_OPTIONS.CASH)
        // cy.get(SEARCH_PATH.INPUT).clear()
        cy.input(SEARCH_PATH.INPUT, "TC")

        // cy.wait(2000)

    })
    it("TC_BFSL_Search_009: To validate that the search request is not triggered when user searched of MIN 1 characters in the search bar", () => {
        // cy.selectSearchOption(SEARCH_OPTIONS.EQUITY, SEARCH_OPTIONS.CASH)
        // cy.get(SEARCH_PATH.INPUT).clear()
        cy.input(SEARCH_PATH.INPUT, "T")
        // cy.wait(2000)

    })

    it("TC_BFSL_Search_011:To validate that the search of indices symbol in Equity cash shows the available indices equity symbols", () => {
        cy.get(SEARCH_PATH.INPUT).clear()
        cy.searchSymbol("Niftybees")
        cy.get('.searchResutDiv').should('not.to.be.empty')
    })
    it("TC_BFSL_Search_012:To validate that the search of indices symbol in Equity future shows the available indices future symbols", () => {
        cy.get(SEARCH_PATH.INPUT).clear()
        cy.searchSymbol("banknifty")
        cy.get('.searchResutDiv').should('not.to.be.empty')
    })
    it("TC_BFSL_Search_013:To validate that the search of indices symbol in Equity option shows the available indices option symbols", () => {
        cy.get(SEARCH_PATH.INPUT).clear()
        cy.searchSymbol("nifty")
        cy.get('.searchResutDiv').should('not.to.be.empty')
    })
    it("TC_BFSL_Search_014:To validate that the user able to add symbols to the watchlist group", () => {
        cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .addToWatchlist-btn').click({ force: true })
        cy.checkText('.footer span.selctedCount', 1)
        // cy.isVisible('.symSearch-base .footer .action-div .save-btn')
    })
    it("TC_BFSL_Search_015:To validate that the user able to save symbols to the watchlist group", () => {
        cy.checkText('.footer', 'Add Symbol')

        // cy.isVisible('.symSearch-base .footer .action-div .save-btn')
    })
    it("TC_BFSL_Search_016:To validate that search of Incorrect symbols displays the error message ", () => {
        cy.get(SEARCH_PATH.INPUT).clear({ force: true })
        cy.searchSymbol("ttt")
        // cy.wait(1000)
        cy.get(SEARCH_PATH.INFO).contains('Symbol Not Found')

    })

    it("TC_BFSL_Search_017:To validate that the user able to clear the searched result", () => {
        cy.get(SEARCH_PATH.INPUT).clear()
        cy.searchSymbol("banknifty")
        cy.get('.searchResutDiv').should('not.to.be.empty')
        cy.get(SEARCH_PATH.INPUT).clear()
        // cy.wait(1000)

    })
    it("TC_BFSL_Search_018:To validate that the click on Search result redirect the user to the Quotes screen", () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear({ force: true })
        cy.searchSymbol("tcs")
        cy.get('.searchResutDiv div:nth-child(1) div.symbol div.symId div.dispSym').click({ force: true })
        // cy.wait(1000)

    })
    it("TC_BFSL_Search_019:To validate that the click on buy button in the Search result redirect the user to the trade buy screen", () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear()
        cy.searchSymbol("tcs")
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .buy-btn:first').click({ force: true })
        // cy.wait(1000)
        cy.tradeWindowClose()


    })
    it("TC_BFSL_Search_020: To validate that the click on sell button in the Search result redirect the user to the trade sell screen", () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.get(SEARCH_PATH.INPUT).clear()
        cy.searchSymbol("tcs")
        cy.get('.searchResutDiv').first().get('.symbolRow-div .btn-div .sell-btn:first').click({ force: true })
        // cy.wait(1000)
        cy.tradeWindowClose()
    })
    it("TC_BFSL_Search_022: To validate that the recently searched symbol is shown at the top of the search result", () => {
        cy.get(SEARCH_PATH.INPUT).focus()

        cy.checkText('.recent-search-title', 'RECENT SEARCH')

    })

})