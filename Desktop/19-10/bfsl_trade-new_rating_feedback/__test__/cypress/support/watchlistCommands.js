import { SEARCH_PATH } from "./config"

Cypress.Commands.add('clickDownarrow', () => {
    cy.get('.widget-header > .select-input-div span.bfsl-font.downArrowIcon.faceDown').click({ force: true })
})

Cypress.Commands.add('clickSearch', () => {
    cy.get('.symSearch-base .input-addOn .input-ele').focus()

})

Cypress.Commands.add('searchSymbol', (name) => {
    // cy.get('div.headerBase-div > div.symbol-search-div.flex-center input.input-ele').clear()
    cy.get('.symSearch-base .input-addOn .input-ele').type(name, { force: true })

})

Cypress.Commands.add('closeIcon', () => {
    cy.get('div.headerBase-div div.symbol-search-div.flex-center div.input-addOn span.bfsl-font.closeIcon').click()
})

Cypress.Commands.add('addWatchlist', () => {
    // cy.clickDownarrow()
    cy.get('.addWatchlist-btn').click({ force: true })

})

Cypress.Commands.add('inputWatchlistname', (name) => {

    cy.wait(100)
    // cy.input('.watchList-name-input', 'abc@#$123')
    cy.input('.watchList-name-input', name)

})
Cypress.Commands.add('fliterWindow', () => {

    cy.window().then((win) => {
        cy.get('div.app-modalDialog2.organise-columns-dialog').contains('OPEN PRICE')
        cy.get('div.app-modalDialog2.organise-columns-dialog').contains('CLOSE PRICE')
        cy.get('div.app-modalDialog2.organise-columns-dialog').contains('HIGH')
        cy.get('div.app-modalDialog2.organise-columns-dialog').contains('LOW')
        cy.get('div.app-modalDialog2.organise-columns-dialog').contains('LTQ')
        cy.get('div.app-modalDialog2.organise-columns-dialog').contains('OI')
        cy.get('div.app-modalDialog2.organise-columns-dialog').contains('VOL')
        cy.checkLength('.window .footer > button.negativeBtn', 1)

    })
})
Cypress.Commands.add('quickWindowsmall', () => {
    cy.window().then((win) => {
        cy.checkText('.context-menu-base', 'Buy')

        cy.checkText('.context-menu-base', 'Sell')
        // cy.checkText('.context-menu-base', 'Set Alert')
        // cy.checkText('.context-menu-base', 'Add Scrip/Contract')
        // cy.checkText('.context-menu-base', 'Remove Scrip/Contract')
        cy.checkText('.context-menu-base', 'Scrip/Contract Info')

    })
})

Cypress.Commands.add('quickWindowlarge', () => {
    cy.window().then((win) => {
        cy.checkText('.context-menu-base', 'Buy')
        cy.checkText('.context-menu-base', 'F1')
        cy.checkText('.context-menu-base', 'Sell')
        cy.checkText('.context-menu-base', 'F2')
        // cy.checkText('.context-menu-base', 'Set Alert')
        cy.checkText('.context-menu-base', 'Market Depth')
        cy.checkText('.context-menu-base', 'Chart')
        // cy.checkText('.context-menu-base', 'Add Scrip/Contract')
        // cy.checkText('.context-menu-base', 'Remove Scrip/Contract')
        cy.checkText('.context-menu-base', 'Scrip/Contract Info')

    })
})
Cypress.Commands.add('changeGroup', (name) => {

    cy.clickDownarrow()
    cy.get('.select-input-div.non-symbolSearch > div > div.options-div-base > div.options-div').contains(name).click()
    cy.wait(2000)


})


Cypress.Commands.add('changeDefault', () => {
    cy.addWatchlist()
    cy.inputWatchlistname('Test1')
    cy.get('.addWatchlistDialog .footer .positiveBtn').click({ force: true })
    cy.searchSymbol('Tcs')
    cy.wait(1000)
    cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .addToWatchlist-btn').click({ force: true })

           cy.get('div.dropdown-div > div.footer .add-btn').click({ force: true })
// 
    // cy.closeIcon()
})

Cypress.Commands.add('watchlistDropdown', () => {
    cy.get('div.symSearch-base div.dropdown-div div.footer span.faceUp').click({ force: true })

})
Cypress.Commands.add('cancelPopup', () => {
    cy.get('.window .footer > button.positiveBtn').click({ force: true })
})
Cypress.Commands.add('addSymbol', (asset, segment) => {
    if (asset === 'equity' && segment === 'cash') {
        cy.get('.widget-header > div.icon-div > span.bfsl-font.searchIcon.cursor').click()
        // cy.get('div.headerBase-div > div.symbol-search-div.flex-center input.input-ele').clear()

        // cy.get(' div.dropdown-div > div.body > div.segment-div > div:nth-child(1)').click()
        cy.searchSymbol('TCS')

        cy.wait(2000)

        cy.get(' div.searchResutDiv.scrollArea > div:nth-child(2) .addToWatchlist-btn').click()
        cy.watchlistDropdown()

        cy.get('div.dropdown-div > div.footer div.options-div.showOption').contains('Test1').click({ force: true })

        cy.get('div.dropdown-div > div.footer button.save-btn').click()
        cy.closeIcon()
    }
    else if (asset === 'equity' && segment === 'future') {
        cy.get('.widget-header > div.icon-div > span.bfsl-font.searchIcon.cursor').click()
        // cy.get(' div.dropdown-div > div.body > div.segment-div > div:nth-child(2)').click()
        cy.searchSymbol('DLF')
        cy.wait(2000)
        cy.get(' div.searchResutDiv.scrollArea > div:nth-child(1) .addToWatchlist-btn').click()
        cy.watchlistDropdown()

        cy.get('div.dropdown-div > div.footer div.options-div.showOption').contains('Test1').click({ force: true })

        cy.get('div.dropdown-div > div.footer button.save-btn').click()

        cy.closeIcon()
    }

    else if (asset === 'equity' && segment === 'option') {
        cy.get('div.symbol-search-div.flex-center > div > div > input.input-ele').click()

        // cy.get('.dropdown-div .assetMenu').contains("EQUITY").click()
        cy.wait(10)
        // cy.get('.dropdown-div .segment-div .segment-option').contains("OPTION").click()
        cy.searchSymbol('DLF')
        cy.wait(2000)
        cy.get(' div.searchResutDiv.scrollArea > div:nth-child(1) > div.btn-div > button.addToWatchlist-btn').click()
        cy.watchlistDropdown()

        cy.get('div.dropdown-div > div.footer div.options-div.showOption').contains('Test1').click({ force: true })

        cy.get('div.dropdown-div > div.footer button.save-btn').click()
        cy.wait(100)

        cy.closeIcon()
    }
    else if (asset === 'currency' && segment === 'future') {
        cy.get('div.symbol-search-div.flex-center > div > div > input.input-ele ').click()

        // cy.get('.dropdown-div .assetMenu').contains("CURRENCY").click()
        // cy.wait(10)
        // cy.get('.dropdown-div .segment-div .segment-option').contains("FUTURE").click()
        cy.searchSymbol('USDINR')

        cy.wait(2000)

        cy.get(' div.searchResutDiv.scrollArea > div:nth-child(1) > div.btn-div > button.addToWatchlist-btn').click()
        cy.watchlistDropdown()

        cy.get('div.dropdown-div > div.footer div.options-div.showOption').contains('Test1').click({ force: true })

        cy.get('div.dropdown-div > div.footer button.save-btn').click()
        // cy.get('div.header > div.assetMenu.flex-center.cursor:nth-child(3)').should('have.class', 'selected')
        cy.wait(100)

        cy.closeIcon()
    }
    else if (asset === 'currency' && segment === 'option') {

        cy.get('div.symbol-search-div.flex-center > div > div > input.input-ele ').click()

        // cy.get('div.header > div.assetMenu.flex-center.cursor:nth-child(3)').click()
        // cy.get('.dropdown-div .assetMenu').contains("CURRENCY").click()
        // cy.wait(10)
        // cy.get('.dropdown-div .segment-div .segment-option').contains("OPTION").click()
        cy.searchSymbol('USDINR')

        // cy.get('div.dropdown-div > div.body > div.segment-div > div:nth-child(3)').click()
        cy.wait(2000)
        cy.get(' div.searchResutDiv.scrollArea > div:nth-child(2) > div.btn-div > button.addToWatchlist-btn').click()
        cy.watchlistDropdown()

        cy.get('div.dropdown-div > div.footer div.options-div.showOption').contains('Test1').click({ force: true })

        cy.get('div.dropdown-div > div.footer button.save-btn').click()
        // cy.get('div.header > div.assetMenu.flex-center.cursor:nth-child(3)').should('have.class', 'selected')
        cy.wait(100)

        cy.closeIcon()
    }
    else if (asset === 'commodity' && segment === 'future') {
        cy.get('div.symbol-search-div.flex-center > div > div > input.input-ele ').click()
        // cy.get('div.header > div.assetMenu.flex-center.cursor:nth-child(2)').click()
        // cy.get('div.dropdown-div > div.body > div.segment-div > div:nth-child(2)').click()
        // cy.get('.dropdown-div .assetMenu').contains("COMMODITY").click()
        // cy.wait(10)
        // cy.get('.dropdown-div .segment-div .segment-option').contains("FUTURE").click()
        cy.searchSymbol('Gold')

        cy.wait(2000)
        cy.get(' div.searchResutDiv.scrollArea > div:nth-child(1) > div.btn-div > button.addToWatchlist-btn').click()
        cy.watchlistDropdown()

        cy.get('div.dropdown-div > div.footer div.options-div.showOption').contains('Test1').click({ force: true })

        cy.get('div.dropdown-div > div.footer button.save-btn').click()
        // cy.get('div.header > div.assetMenu.flex-center.cursor:nth-child(2)').should('have.class', 'selected')
        cy.wait(100)

        cy.closeIcon()
    }
    else if (asset === 'commodity' && segment === 'option') {

        cy.get('div.symbol-search-div.flex-center > div > div > input.input-ele ').click()
        // cy.get('div.header > div.assetMenu.flex-center.cursor:nth-child(2)').click()
        // cy.get('div.dropdown-div > div.body > div.segment-div > div:nth-child(3)').click()
        // cy.get('.dropdown-div .assetMenu').contains("COMMODITY").click()
        // cy.wait(10)
        // cy.get('.dropdown-div .segment-div .segment-option').contains("OPTION").click()
        cy.searchSymbol('Gold')
        cy.wait(2000)
        cy.get(' div.searchResutDiv.scrollArea div:nth-child(2) div.btn-div button.addToWatchlist-btn').click()
        cy.watchlistDropdown()

        cy.get('div.dropdown-div > div.footer div.options-div.showOption').contains('Test1').click({ force: true })

        cy.get('div.dropdown-div > div.footer  button.save-btn').click()
        cy.wait(100)
        // cy.get('div.header > div.assetMenu.flex-center.cursor:nth-child(2)').should('have.class', 'selected')
        cy.closeIcon()
    }
})

Cypress.Commands.add('closeOrderpad', () => {
    cy.get('div.app-modalDialog2.orderPad-dialog div.footer div.btn-div button.negativeBtn').click()

})

Cypress.Commands.add('deleteGroup', () => {
    cy.clickDownarrow()
    cy.get('div.select-input-div div.options-div > span:nth-last-child(2) > span.innerAction-btn').click({ force: true })
    cy.get('.window .footer .left-btn.deleteBtn').click()
    cy.wait(500)
    cy.cancelPopup()

})

Cypress.Commands.add('deletelast9group', () => {

    cy.clickDownarrow()
    for (var i = 1; i <= 5; i++) {
        cy.get('div.select-input-div div.options-div > span:last-child > span.innerAction-btn').click({ force: true })
        cy.wait(1000)
        cy.get('.window .footer .left-btn.deleteBtn').click({ force: true })
        // cy.wait(20000)
        cy.cancelPopup()
        cy.wait(100)
    }
    cy.wait(500)
})

Cypress.Commands.add('sortAsc', (selector, index) => {
    cy.get(selector + 'table > thead > tr > th:nth-child(' + index + ') .bfsl-font.arrow-up.cursor.non-sort').click({ force: true })
    cy.get(selector + 'table > thead > tr > th:nth-child(' + index + ') .bfsl-font.arrow-up.cursor').not('.non-sort')
})

Cypress.Commands.add('sortDes', (selector, index) => {
    cy.get(selector + 'table > thead > tr > th:nth-child(' + index + ') .bfsl-font.arrow-down.cursor.non-sort').click({ force: true })
    cy.get(selector + 'table > thead > tr > th:nth-child(' + index + ') .bfsl-font.arrow-down.cursor').not('.non-sort')
})

Cypress.Commands.add('streaming', (id) => {
    let actual
    function getCellTextAsArray() {
        let cellContents = [];
        return new Cypress.Promise(resolve => {
            // cy.get().click()
            cy.wait(1000)
            cy.get(id)
                .each(($el, $index) => {
                    cellContents += ($el.text());

                })
                .then(() => resolve(cellContents));
        });
    }
    getCellTextAsArray().then(cellContents => {
        actual = cellContents.slice();
        cy.log(actual)

        cy.wait(5000)
        getCellTextAsArray().then(cellContents => {
            let actual1 = cellContents.slice();
            cy.log(actual1)
            expect(actual1).not.equals(actual);

        })
    });

})


Cypress.Commands.add('checksuccess', () => {
    console.log(Cypress.$('.window .content').length)
    if (Cypress.$('.window .content ').length == 1) {
        cy.cancelPopup()
        cy.wait(100)
    }

})

Cypress.Commands.add('iframe', { prevSubject: 'element' }, ($iframe, selector) => {
    Cypress.log({
        name: 'iframe',
        consoleProps() {
            return {
                iframe: $iframe,
            };
        },
    });
    return new Cypress.Promise(resolve => {
        resolve($iframe.contents().find(selector));
    });
});



Cypress.Commands.add('changePasswd', (curr, newpss, confrm) => {
    cy.input('[name="currentPassword"]', curr)
    cy.input('[name="newPassword"]', newpss)
    cy.input('[name="confirmPassword"]', confrm)
    cy.get('.left-btn.positiveBtn').click()
})

Cypress.Commands.add('checkPopupunblock', (isUnblock) => {
    cy.window().then((win) => {
        console.log(Cypress.$('.window .content .accBlockedIcon').length)
        if (isUnblock) {
            if (Cypress.$('.window .content .accBlockedIcon').length == 1) {
                cy.get('.window .footer .positiveBtn').contains('UNBLOCK').click()
                cy.wait(1000)
                cy.unblockUser()
            }
            else {
                cy.get('.window .footer .negativeBtn').click()
            }
        }
    })
})

Cypress.Commands.add('forgotpassworduser', (uname, pan) => {
    // cy.get('.forget-password-dialog div div.content [test_id="forgetPwdUserName"]').type("TEST123")
    cy.log(pan)
    cy.get('.forget-password-dialog div div.content [test_id="forgetPwdUserName"]').clear({ force: true })
    cy.get('.forget-password-dialog div div.content [test_id="forgetPwdPanNumber"]').clear({ force: true })
    // cy.input('.app-modalDialog .row .input-div .input-ele [test_id="forgetPwdPanNumber"]', pan).should('have.value', 'HELLO')
    cy.get('.forget-password-dialog div div.content [test_id="forgetPwdPanNumber"]').type(pan, { force: true })

    cy.get('.window .footer .left-btn.positiveBtn').click({ force: true })
})

Cypress.Commands.add('forgotpasswordempty', (uname, pan) => {
    // cy.get('.forget-password-dialog div div.content [test_id="forgetPwdUserName"]').type("TEST123")

    cy.get('.forget-password-dialog div div.content [test_id="forgetPwdUserName"]').clear({ force: true })
    cy.get('.forget-password-dialog div div.content [test_id="forgetPwdPanNumber"]').clear({ force: true })

    cy.get('.window .footer .left-btn.positiveBtn').click({ force: true })
})

Cypress.Commands.add('forgotpassword', (uname, pan) => {
    // cy.get('.forget-password-dialog div div.content [test_id="forgetPwdUserName"]').type("TEST123")

    cy.get('.forget-password-dialog div div.content [test_id="forgetPwdUserName"]').clear({ force: true })
    cy.get('.forget-password-dialog div div.content [test_id="forgetPwdUserName"]').type(uname, { force: true })
    cy.get('.forget-password-dialog div div.content [test_id="forgetPwdPanNumber"]').clear({ force: true })
    cy.get('.forget-password-dialog div div.content [test_id="forgetPwdPanNumber"]').type(pan, { force: true })

    cy.get('.window .footer .left-btn.positiveBtn').click({ force: true })
})

Cypress.Commands.add('unblock', (uid, pan) => {
    cy.get('.unblock-user-dialog div.content [name="userName"]').clear({ force: true })
    cy.get('.unblock-user-dialog div.content [name="userName"]').type(uid, { force: true })
    cy.get('.unblock-user-dialog div.content [name="pan_dob"]').clear({ force: true })
    cy.get('.unblock-user-dialog div.content [name="pan_dob"]').type(pan, { force: true })
    cy.get('.unblock-user-dialog .window .footer .positiveBtn').click({ force: true })

})

Cypress.Commands.add('setAlertWindow', () => {
    cy.get('.watchlist-table tbody > tr:nth-child(1) > td.firstChild.width40 div.primary div.baseSym').click({ force: true })
    cy.isVisible('.quote-view ')
    cy.get('.quote-view .actionDiv .alert-div').click({ force: true })   
})

Cypress.Commands.add('dashboardView', () => {
    cy.wait(2000)
    cy.get('.headerBase-div .menuIcon-div .menuIcon').click({ force: true })
    cy.get('.menu-dialog .menu-details .menu-row .menu-name').contains('Dashboard').click({ force: true })
})

Cypress.Commands.add('openinterestAlert', () => {
    cy.get(SEARCH_PATH.INPUT).focus()
    cy.get(SEARCH_PATH.INPUT).clear({force:true})
    cy.searchSymbol("tcs nfo")
    cy.get('.searchResutDiv').first().get('.symSearch-base .searchResutDiv > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) span').click({ force: true })
    cy.get('.quote-view .actionDiv .alert-div').click({ force: true })   
})