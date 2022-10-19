import {URL, ORDER_KEYS, ORDER_TYPES, PRODUCT_TYPES, PAN_NUMBER, USER_NAME } from './config'

// ---------------------------
//login method
Cypress.Commands.add('login', (username, password, pan_id) => {
    // cy.isVisible('.login-base')
    // cy.get('.login-base [name="userName"]').focus()

    // cy.server().route('POST', '/').as('Login')
    
    // cy.wait(2000)
    cy.input('.login-base [name="userName"]', username)
    cy.input('.login-base [name="password"]', password)
    cy.input('.login-base [name="pan_dob"]', pan_id)

    cy.get('[test_id="loginBtn"]').click({force: true})
    // cy.wait(2000)
    
    // cy.wait('@Login').then(console.log)
    // cy.wait('@Login').its('status').should('be', 200);
    // cy.wait('@Login').its('url').should('include', '/home/dashboard')
})

Cypress.Commands.add('isLoginSuccess', () => {
    cy.url().should('contain', '/home/dashboard')
})

// Cypress.Commands.add("logout",() => {
//     cy.get('.headerBase-div .userInfo-div .userIcon').click()
// })

Cypress.Commands.add('unblockUser',() => {
    cy.get('.unblock-user-dialog div.content [name="userName"]').clear({force: true} )
    cy.get('.unblock-user-dialog div.content [name="userName"]').type(USER_NAME)
    cy.get('.unblock-user-dialog div.content [name="pan_dob"]').clear({force: true} )
    cy.get('.unblock-user-dialog div.content [name="pan_dob"]').type(PAN_NUMBER)
// 
    cy.get('.unblock-user-dialog .window .footer .positiveBtn').click({force: true})
    cy.wait(500)
    cy.get('.window .content').contains('User unblocked successfully')
    // cy.wait(500)
    // #modal-dialog div.footer > button
    cy.get('.alertModal .window .footer .positiveBtn').click({force: true})
})