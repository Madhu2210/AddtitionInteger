import { URL, USER_NAME, PASSWORD, PAN_NUMBER, SEARCH_PATH } from '../support/config'

before(function () {
    cy.visit(URL)
    Cypress.Cookies.defaults({
        preserve: ['JSESSIONID', 'Auth-Token'],
    })
})


describe("Holdings", () => {

    // for single file execution 
    it('username  - valid', () => {
        cy.login(USER_NAME, PASSWORD, PAN_NUMBER)
        cy.wait(3000)
        cy.isLoginSuccess()
    })

    it("TC_BFSL_Holdings_001: To validate the availability of fields in the Holdings tab", () => {
        cy.get('.headerTab-base').contains('Holdings').click({ force: true })
        // cy.get(".headerTab-base .tab").eq(1).should("have.class", "selected")
        // cy.checkLength(".maximizeIcon",1)
        cy.get(".order-table  thead th").should(($lis) => {
            expect($lis.eq(0)).to.contain("SYMBOL")
            expect($lis.eq(1)).to.contain("QTY")
            expect($lis.eq(2)).to.contain("AVG PRICE")
            expect($lis.eq(3)).to.contain("LTP")
            // expect($lis.eq(4)).to.contain("CHG (%)")
            expect($lis.eq(4)).to.contain("INVESTED")
        })
        cy.get('.order-table  thead th').contains('P&L')

    })
    it("TC_BFSL_Holdings_002: To validate that click on the Search icon redirect the user to the search screen", () => {
        cy.get(SEARCH_PATH.INPUT).focus()
        cy.isVisible('.symSearch-base')
    })

     // it("TC_BFSL_Holdings_003: To validate that click on the Notification icon redirect the user to the Alert screen",() => {
    //     // NOTE: ALERT NOT YET IMPLEMENTED
    // })
    it("TC_BFSL_Holdings_004: To validate that click on the Dashboard/Watchlist/Markets tab redirect the user to the respective related screen and navigation happens smoothly", () => {
        cy.get('.headerTab-base').contains('Net positions').click({ force: true })
        // cy.wait(100)
        cy.get('.headerTab-base').contains('Holdings').click({ force: true })
        // cy.wait(100)
    })

     // it("TC_BFSL_Holdings_005: To validate that the Unread notification count are displayed in the Red colour",() => {
    //      // NOTE: ALERT NOT YET IMPLEMENTED
    // })
    
})