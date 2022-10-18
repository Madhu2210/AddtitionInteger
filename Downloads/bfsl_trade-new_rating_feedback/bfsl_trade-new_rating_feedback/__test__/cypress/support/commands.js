import { URL, ORDER_KEYS, ORDER_TYPES, PRODUCT_TYPES, PAN_NUMBER, USER_NAME } from './config'
// import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command'

// addMatchImageSnapshotCommand()


Cypress.Commands.add('isVisible', selector => {
    cy.get(selector).should('be.visible')
})

Cypress.Commands.add('isHidden', selector => {
    cy.get(selector).should('not.exist')
})

Cypress.Commands.add('isDisable', selector => {
    cy.get(selector).should('have.class', 'disable')
})

Cypress.Commands.add('isDisabled', selector => {
    cy.get(selector).should('have.class', 'disabled')
})

Cypress.Commands.add('input', (selector, value) => {
    // cy.isVisible(selector)
    cy.get(selector).clear({force: true})
    // cy.wait(10)
    // if (value !== '')
        cy.get(selector).type(value, { delay: 0 })
})

Cypress.Commands.add('setResolution', size => {
    if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1])
    } else {
        cy.viewport(size)
    }
})

Cypress.Commands.add('selectCampaign', campaign => {
    cy.get('.input.campaign .p-dropdown-label.p-inputtext.p-placeholder').click();
    cy.get('.p-dropdown-item').contains(campaign).click();
})

Cypress.Commands.add('selectSegmentation', segment => {
    cy.get('.input.segment-section .inputRadio[type="radio"]')
        .check(segment).should('be.checked')
})

Cypress.Commands.add('selectPlatform', platform => {
    cy.get('.input.platform-section input[type="checkbox"]')
        .check(platform).should('be.checked');
})

Cypress.Commands.add('clickNextIcon', () => {
    cy.get('.shield-font.nextIcon').click({ multiple: true })
})

Cypress.Commands.add('checkLength', (selector, length) => {
    cy.get(selector).should('have.length', length)
})

Cypress.Commands.add('checkText', (selector, text) => {
    cy.get(selector).should('contain', text)
})


Cypress.Commands.add('checkPopupText', (text, isUnblock) => {
    cy.wait(500)
    // cy.window().its(selector).should('equal', text);
    cy.window().then((win) => {
        cy.log(Cypress.$('.window .accBlockedIcon').length)
        if (isUnblock) {
            if (Cypress.$('.window .accBlockedIcon').length == 1) {
                cy.get('.window .footer .positiveBtn').contains('UNBLOCK').click({force: true})
                // cy.wait(500)
                cy.unblockUser()
            } else {
                cy.get('.window .content').contains(text)
                cy.get('.window .footer button').click({force: true})
            }
        } else {
            //  cancell the unblock error popup
            cy.get('.window .footer .positiveBtn').click({force: true})
        }
    })
})

Cypress.Commands.add('selectSearchOption', (Header, Options) => {
    if (Header && Options) {
        cy.get('.dropdown-div .assetMenu').contains(Header).click()
        cy.get('.segment-div .flex-center').contains(Options).click()
    }
})