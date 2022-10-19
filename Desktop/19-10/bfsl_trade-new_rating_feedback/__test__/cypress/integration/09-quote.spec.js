import { URL, USER_NAME, PASSWORD, PAN_NUMBER } from '../support/config'


before(function () {
    cy.visit(URL)
    Cypress.Cookies.defaults({
        preserve: ['JSESSIONID', 'Auth-Token'],
    })
})

describe('Quote', () => {
    it('valid login', () => {
        cy.login(USER_NAME, PASSWORD, PAN_NUMBER)
        cy.wait(3000)
        cy.isLoginSuccess()
    })


    it('TC_BFSL_Quotes_002: To validate that the click on the expanded view icon in the quotes view displays the quotes full view ', () => {
        cy.get('.watchlist-table tbody > tr:nth-child(1) > td.firstChild div.primary div.baseSym').click({ force: true })

        // cy.wait(3000)
        cy.isVisible('.quote-view .symName')
        // cy.isVisible('.alertIcon')
        cy.isVisible('.compName')
        cy.isVisible('.lttVal')
        // cy.isVisible('.addIcon')
        // cy.isVisible('.stock_report_btn')
        cy.isVisible('.buy-btn2')
        cy.isVisible('.sell-btn2')
        cy.isVisible('.chngVal  ')
        cy.isVisible('.chartWidget-base')
        // cy.isVisible('.chartWidget .maximizeIcon ')
        // cy.isVisible('.trendingNews')
        cy.checkText('div.menu-div', 'CHART')
        cy.checkText('div.menu-div', 'FUTURE')
        cy.checkText('div.menu-div', 'OPTIONS')
        cy.checkText('div.menu-div', 'FINANCIALS')
        cy.checkText('div.menu-div', 'COMPANY INFO')
        cy.get('.technicals').click({ force: true })
        cy.isVisible('.gaugeMeter')
        // cy.isVisible('.gaugeGraph')
        cy.checkText('.gaugeMeter', 'SUPPORT')
        cy.checkText('.gaugeMeter', 'PIVOT')

    })
    it('TC_BFSL_Quotes_006:"To validate that the click on Buy button in the quotes full view screen redirect the user to the Trade Buy screen', () => {
        cy.get('.quote-view .actionDiv .buy-btn2').click({ force: true })
        cy.isVisible('.tradeBase')
        cy.tradeWindowClose()
    })

    it('TC_BFSL_Quotes_007:"To validate that the click on Sell button in the quotes full view screen redirect the user to the Trade Sell screen', () => {
        cy.get('.quote-view .actionDiv .sell-btn2').click({ force: true })
        cy.isVisible('.tradeBase')
        cy.tradeWindowClose()

    })

    it('TC_BFSL_Quotes_24:To validate that the Open value is displayed as per the Market opened value', () => {
        cy.wait(1000)
        cy.get('.watchlistDataRow .firstChild .symName-column .baseSym.primary-symName').first().click({ force: true })
        cy.wait(2000)
        cy.get('.quote-details-base .quote-details-body .data-row .coloum1 .row:first .data').then(($val) => {
            expect($val).not.to.be.empty
        })
    })
    it('TC_BFSL_Quotes_25:To validate that the Close value is displayed as per the Previous day Market close value', () => {
        cy.wait(1000)
        cy.get('.quote-details-base .quote-details-body .data-row .coloum1 .row:nth-child(4) .data').then(($val) => {
            expect($val).not.to.be.empty
        })
    })
    it('TC_BFSL_Quotes_26:To validate that the high value is streaming in the quotes full view screen as per the current market value', () => {
        cy.get('.quote-details-base .quote-details-body .data-row .coloum1 .row:nth-child(2) .data').then(($val) => {
            expect($val).not.to.be.empty
        })
    })
    it('TC_BFSL_Quotes_27:To validate that the  low value is streaming in the quotes full view screen as per the current market value', () => {
        cy.get('.quote-details-base .quote-details-body .data-row .coloum1 .row:nth-child(3) .data').then(($val) => {
            expect($val).not.to.be.empty
        })
    })

    it('TC_BFSL_Quotes_30:To validate that the volume value is streaming in the quotes full view screen as per the current market value', () => {
        cy.get('.quote-details-base .quote-details-body .data-row .coloum2 .row:nth-child(1) .data').then(($val) => {
            expect($val).not.to.be.empty
        })
    })

    it('TC_BFSL_Quotes_31:To validate that the ATP value is streaming in the quotes full view screen as per the current market value', () => {
        cy.get('.quote-details-base .quote-details-body .data-row .coloum2 .row:nth-child(4) .data').then(($val) => {
            expect($val).not.to.be.empty
        })
    })

    it('TC_BFSL_Quotes_34:To validate that the OI value is streaming in the quotes full view screen as per the current market value', () => {
        cy.get('.quote-details-base .quote-details-body .data-row .coloum2 .row:nth-child(2) .data').then(($val) => {
            expect($val).not.to.be.empty
        })
    })

    it('TC_BFSL_Quotes_35:To validate that the OI CHG% value is streaming in the quotes full view screen as per the current market value', () => {
        cy.get('.quote-details-base .quote-details-body .data-row .coloum2 .row:nth-child(3) .data').then(($val) => {
            expect($val).not.to.be.empty
        })
    })

    it('TC_BFSL_Quotes_47:To validate that the Technical pie chart shows the Pivot value at the center of the chart', () => {
        cy.get('.technicals').click({ force: true })
        // cy.wait(100)
        cy.get('.gaugeMeter .values .heading .alignCenter').contains('PIVOT')
    })

    it('TC_BFSL_Quotes_48:To validate that the technical pie chart shows the Current 3 resistance value in green color at the Right side of the chart', () => {
        cy.get('.gaugeMeter .values > div:nth-child(2) > span:nth-child(3)').should('have.class', 'positiveColor')
        cy.get('.gaugeMeter .values > div:nth-child(3) > span:nth-child(3)').should('have.class', 'positiveColor')
        cy.get('.gaugeMeter .values > div:nth-child(4) > span:nth-child(3)').should('have.class', 'positiveColor')
    })

    it('TC_BFSL_Quotes_49:To validate that the technical pie chart shows the Current 3 support value in green color at the left side of the chart', () => {
        cy.get('.gaugeMeter .values > div:nth-child(2) > span:nth-child(1)').should('have.class', 'negativeColor')
        cy.get('.gaugeMeter .values > div:nth-child(3) > span:nth-child(1)').should('have.class', 'negativeColor')
        cy.get('.gaugeMeter .values > div:nth-child(4) > span:nth-child(1)').should('have.class', 'negativeColor')

    })

    it('TC_BFSL_Quotes_50:To validate that the Technical pie chart support value is streaming as per the current market value', () => {
        cy.get('.gaugeMeter .values > div:nth-child(1) > span:nth-child(1)').then(($val) => {
            expect($val).not.to.be.empty
        })
    })
    it('TC_BFSL_Quotes_51:To validate that the Technical pie chart resistance value is streaming as per the current market value', () => {
        cy.get('.gaugeMeter .values > div:nth-child(1) > span:nth-child(3)').then(($val) => {
            expect($val).not.to.be.empty
        })
    })
    it('TC_BFSL_Quotes_52:To validate that the Technical pie chart pivot value is streaming as per the current market value', () => {
        cy.get('.gaugeMeter .values > div:nth-child(1) > span:nth-child(2)').then(($val) => {
            expect($val).not.to.be.empty
        })
    })
    
    it('TC_BFSL_Quotes_063:To validate that the List of news should be displyed as per the symbol ', () => {
        cy.get('div.menu-div').contains('NEWS').click({ force: true })
        cy.isVisible('.trendingNews ') 
    })

    it('TC_BFSL_Quotes_064:To validate that the Click on the Futures tab in the Quotes full view screen displays future tab informations ', () => {    
        cy.get('div.menu-div').contains('FUTURE').click({ force: true })
        cy.isVisible('.futureChain-base ')
    })

    it('TC_BFSL_Quotes_65:To validate the availability of field in the Futures tab    ', () => {
        cy.get('.futureChain-base').contains('LTP')
        cy.get('.futureChain-base').contains('OPEN PRICE')
        cy.get('.futureChain-base').contains('HIGH PRICE')
        cy.get('.futureChain-base').contains('LOW PRICE')
        cy.get('.futureChain-base').contains('PREV.CLOSE')
        cy.isVisible('.arrow-down')
        cy.isVisible('.arrow-up')
        cy.isVisible('.symName-column')

    })
    it('TC_BFSL_Quotes_067:To validate that the Scroll on symbols in the Future tab shows the available pending symbols    ', () => {
        cy.get('.futureChain-base table > tbody').should('have.class', 'tbody-scroller')
    })
    it('TC_BFSL_Quotes_068:To validate that the click on the future tab displays the symbols name with exchange and expiry date in the quotes full view  ', () => {
        // cy.get(' div.chartWidget-base table > tbody > tr > td.firstChild.width30').contains('.exc')
        cy.isVisible('.futureChain-base table > tbody > tr > td > div.symName-column > span.exc')
        cy.isVisible('.futureChain-base table > tbody > tr:nth-child(1) > td.firstChild.width24 > div.date-div > span.date')

    })


    it('TC_BFSL_Quotes_76:To validate the availability of field in the options tab', () => {
        cy.get('div.menu-div').contains('OPTIONS').click({ force: true })
        cy.isVisible('.optionChain-base')
        cy.get('.optionChain-base').contains('CALL')
        cy.get('.optionChain-base').contains('PUT')
        cy.get('.optionChain-base').contains('LTP')
        cy.get('.optionChain-base').contains('OI')
        cy.get('.optionChain-base').contains('VOLUME')
        cy.get('.optionChain-base').contains('STRIKE PRICE')
        cy.get('.optionChain-base').contains('OI')
        cy.get('.optionChain-base').contains('VOLUME')
        cy.get('.optionChain-base').contains('LTP')

    })


})