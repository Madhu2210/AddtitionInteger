import { URL, USER_NAME, PASSWORD, PAN_NUMBER, SEARCH_PATH } from '../support/config'

before(function () {
    cy.visit(URL)
})
describe('valid case', () => {
    it("TC_BFSL_Help_001 : To validate the availability if Need Help? button in Login screen", () => {
        cy.wait(2000)
        cy.get('.login-base .haveAccQes')
        // cy.wait(2000)
        // cy.visit(URL)

    })

    it("TC_BFSL_Help_002: To validate whether clicking on Need Help? icon displays the help options.", () => {
        cy.get('.login-base .haveAccQes').click({force:true})
        cy.get('.tooltip-content .data .field-name').contains('For Quick Assistance')
        cy.get('.tooltip-content .data .field-name').contains('Email Us')
        cy.get('.tooltip-content .data .field-name').contains('Call on Toll Free Number')
        cy.wait(1000)
    })

    // test cases 3,4,5,6,7,10,11,12,13,14 -not possible

    // it("TC_BFSL_Help_003 & 010: To validate clicking on the Visit SAMADHAN Website redirects the user to the appropriate page.", () => {
        
    // })

    // it("TC_BFSL_Help_004 & 011: To validate the access to SAMADHAN website", () => {
        
    // })

    // it("TC_BFSL_Help_005 & 012: To validate the email id provided.", () => {
        
    // })

    // it("TC_BFSL_Help_006 & 013: To validate redirection back to BFSL website once email is sent.", () => {
        
    // })

    // it("TC_BFSL_Help_007 & 014: To validate the phone number provided.", () => {
        
    // })

    it("TC_BFSL_Help_008: To validate the availability if Help & Support button in Menu.", () => {
        cy.login(USER_NAME, PASSWORD, PAN_NUMBER) 
        cy.wait(1000)
        cy.get('.headerBase-div .account-icon span.bfsl-font.userIcon').click({force:true})
        cy.wait(2000)
    })

    it("TC_BFSL_Help_009: To validate the Help & Support button in the menu.", () => {
        cy.get('.account-info-dialog .account-content .menu-details .menu-row').contains('Help & Support').click({force:true})
        cy.wait(1000)
        cy.get('.help-and-support .data .field-name').contains('For Quick Assistance')
        cy.get('.help-and-support .data .field-name').contains('Email Us')
        cy.get('.help-and-support .data .field-name').contains('Call on Toll Free Number')
        cy.get('.help-and-support .help-data-value-container .data-lastchild.demoTour .data-text').contains('DEMO')
    })
    
})