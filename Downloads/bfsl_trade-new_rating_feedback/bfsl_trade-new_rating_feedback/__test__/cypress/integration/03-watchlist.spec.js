// import {
//     URL, PASSWORD, PAN_NUMBER, USER_NAME, LOGIN_PASS_ERROR, SEARCH_PATH
// } from '../support/config'

// before(function () {
//     cy.visit(URL)
// Cypress.Cookies.defaults({
//     preserve: ['JSESSIONID', 'Auth-Token'],
// })
// })
// describe("Watchlist", () => {

//     it('valid login', () => {
//         cy.login(USER_NAME, PASSWORD, PAN_NUMBER)

//         cy.wait(2000)
//         cy.isLoginSuccess()
//     })
//     it('TC_BFSL_WEB_Watchlist_01,04-To verify,Add Symbol - During Watchlist Creation ', () => {
//         // cy.get('.addGroup').click({ force: true })
//         // cy.input('.watchList-name-input', 'test')
//         // cy.get('.positiveBtn').click({ force: true })
//         cy.get('.symSearch-base .input-addOn .input-ele').focus()
//         cy.get('.symSearch-base .input-addOn .input-ele').clear()
//         cy.get('.symSearch-base .input-addOn .input-ele').type("abc")
//         cy.get('.symSearch-base .input-addOn .input-ele').should('have.value', 'abc')
//         cy.get('.symSearch-base .input-addOn .input-ele').clear()
//         cy.get('.symSearch-base .input-addOn .input-ele').type("123")
//         cy.get('.symSearch-base .input-addOn .input-ele').should('have.value', '123')
//         cy.get('.symSearch-base .input-addOn .input-ele').clear()
//         cy.get('.symSearch-base .input-addOn .input-ele').type("abc123")
//         cy.get('.symSearch-base .input-addOn .input-ele').should('have.value', 'abc123')
//         cy.get('.symSearch-base .input-addOn .input-ele').clear()
//         cy.get('.symSearch-base .input-addOn .input-ele').type("a")
//         cy.isHidden('.dropdown-div')
//         cy.get('.symSearch-base .input-addOn .input-ele').clear()
//         cy.get('.symSearch-base .input-addOn .input-ele').type("ab")
//         cy.isHidden('.dropdown-div')
//         cy.get('.symSearch-base .input-addOn .input-ele').clear()
//         cy.get('.symSearch-base .input-addOn .input-ele').type("tcs")
//         cy.get('.searchResutDiv')
//         // cy.isVisible('.dropdown-div')

//     })
//     it('TC_BFSL_WEB_Watchlist_02-To verify, Symbol name, Exchnge view, Ltp,Chg,Chg%', () => {
//         cy.isVisible('.baseSym')
//         cy.isVisible('.exc')
//         cy.checkText('thead', 'LTP')
//         cy.checkText('thead', 'CHG')

//     })
//     it('TC_BFSL_WEB_Watchlist_03-To verify, BUY,SELL, +,Tick,  from search bar', () => {
//         cy.clickSearch()
//         cy.get('.symSearch-base .input-addOn .input-ele').clear()
//         cy.searchSymbol('tcs')
//         cy.checkLength('.searchResutDiv .symbolRow-div:first .btn-div button.sell-btn', 1)
//         cy.checkLength('.searchResutDiv .symbolRow-div:first .btn-div button.buy-btn', 1)
//         cy.checkLength('.searchResutDiv .symbolRow-div:first .btn-div .addToWatchlist-btn', 1)
//         cy.get('.searchResutDiv .symbolRow-div:first .btn-div .addToWatchlist-btn').click({ force: true })
//         cy.checkLength('.searchResutDiv .symbolRow-div:first .btn-div .tick-icon', 1)


//     })
//     //002
//     it('TC_BFSL_WEB_Watchlist_05-To verify , Delete symbols from Watchlist    ', () => {
//         // cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .addToWatchlist-btn').click({ force: true })
//         cy.get('div.searchResutDiv.scrollArea > div:nth-child(2) .addToWatchlist-btn').click({ force: true })
//         cy.get('.add-btn').click({ force: true })
//         cy.wait(1000)
//         cy.get('.deleteIcon').click({ force: true })
//         cy.get('.watchlist-table tr:nth-child(1) > td .checkboxIcon').click({ force: true })
//         cy.get('.deleteIcon').click({ force: true })
//         cy.get('.negativeBtn').click({ force: true })

//     })
//     it('TC_BFSL_WEB_Watchlist_09-To verify ,Delete Watchlist Screen    ', () => {
//         cy.get('.addWatchlist-btn').click({ force: true })
//         cy.input('.watchList-name-input', 'test1')
//         cy.get('.positiveBtn').click({ force: true })
//         cy.get('.symSearch-base .input-addOn .input-ele').focus()
//         cy.get('.symSearch-base .input-addOn .input-ele').clear()
//         cy.get('.symSearch-base .input-addOn .input-ele').type("tcs")
//         cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .addToWatchlist-btn').click({ force: true })
//         cy.get('.add-btn').click({ force: true })
//         cy.wait(500)
//         cy.get('.edit-icon').click({ force: true })
//         cy.get('.deleteWatchlistDropdown .row:first .deleteIcon').click({ force: true })
//     })
//     it('TC_BFSL_WEB_Watchlist_10-To verify , Delete Watchlist Confirmation Screen    ', () => {
//         cy.checkText('.deleteInfoDiv', 'Are you sure want to delete')
//         cy.isVisible('.btnDiv .cancelBtn')
//         cy.get('div.deleteInfoDiv > div.btnDiv > button.deleteBtn').click({ multiple: true, force: true })
//     })
//     it('TC_BFSL_WEB_Watchlist_11-To verify , Delete Watchlist Sucesss Screen    ', () => {
//         cy.isVisible('.toastMsgDiv')

//     })
//     it('TC_BFSL_WEB_Watchlist_12-To verify , Add New Watchlist    ', () => {
//         cy.get('.addWatchlist-btn').click({ force: true })
//         cy.input('.watchList-name-input', 'abc')
//         cy.get('.watchList-name-input').should('have.value', 'abc')
//         cy.input('.watchList-name-input', '123')
//         cy.get('.watchList-name-input').should('have.value', '123')
//         cy.input('.watchList-name-input', 'abc123')
//         cy.get('.watchList-name-input').should('have.value', 'abc123')
//         cy.input('.watchList-name-input', 'abc@123')
//         cy.get('.watchList-name-input').should('have.value', 'abc123')
//         cy.input('.watchList-name-input', 'group1group2group3')
//         cy.get('.watchList-name-input').should('have.value', 'group1group2gro')
//         cy.isVisible('.footer .negativeBtn')
//         cy.isVisible('.footer .positiveBtn')


//     })
//     it('TC_BFSL_WEB_Watchlist_14-"To verify,  the click on Add watchlist shows the Add new Watchlist overlay"', () => {
//         cy.isVisible('.addWatchlistDialog')
//     })
//     it('TC_BFSL_WEB_Watchlist_18-To verify,  "Enter watchlist name" by providing the input as special characters', () => {
//         cy.input('.watchList-name-input', 'abc@#$123')
//         cy.get('.watchList-name-input').should('have.value', 'abc123')
//     })
//     it('TC_BFSL_WEB_Watchlist_20-To verify,  "Enter watchlist name" by providing the input as space in between the characters', () => {
//         cy.input('.watchList-name-input', 'abc 123')
//         cy.get('.watchList-name-input').should('have.value', 'abc 123')
//     })

//     it('TC_BFSL_WEB_Watchlist_21-To verify,  "Enter watchlist name" by providing the input as Alphabets', () => {
//         cy.input('.watchList-name-input', 'abc')
//         cy.get('.watchList-name-input').should('have.value', 'abc')
//     })
//     it('TC_BFSL_WEB_Watchlist_22-To verify,  "Enter watchlist name" by providing the input as numeric', () => {
//         cy.input('.watchList-name-input', '123')
//         cy.get('.watchList-name-input').should('have.value', '123')
//     })
//     it('TC_BFSL_WEB_Watchlist_23-To verify,  "Enter watchlist name" by providing the input as Alphanumeric', () => {
//         cy.input('.watchList-name-input', 'abc123')
//         cy.get('.watchList-name-input').should('have.value', 'abc123')
//     })
//     it('TC_BFSL_WEB_Watchlist_24-To verify, "Enter watchlist name" by providing the input as Alphanumeric with special character', () => {
//         cy.input('.watchList-name-input', 'abc@@123')
//         cy.get('.watchList-name-input').should('have.value', 'abc123')
//     })
//     it('TC_BFSL_WEB_Watchlist_25-To verify,  the user able to create the watchlist  with the existing watchlist name', () => {
//         cy.input('.watchList-name-input', 'test')
//         cy.get('.watchList-name-input').should('have.value', 'test')
//     })
//     it('TC_BFSL_WEB_Watchlist_26-To verify, the user not able to enter more that 15 characters in the enter watchlist name', () => {
//         cy.input('.watchList-name-input', 'group1group2group3')
//         cy.get('.watchList-name-input').should('have.value', 'group1group2gro')
//     })
//     it('TC_BFSL_WEB_Watchlist_27-To verify,  click on cancel action closes the Enter watchlist name overlay', () => {
//         cy.get('.footer .negativeBtn').click({ force: true })
//         cy.isHidden('.addWatchlistDialog')

//     })
//     it('TC_BFSL_WEB_Watchlist_28-To verify, click on Done action in Enter watchlist name overlay redirect the user to Search screen', () => {
//         cy.get('.addWatchlist-btn').click({ force: true })
//         cy.input('.watchList-name-input', 'abc')
//         cy.get('.positiveBtn').click({ force: true })
//         cy.get('.symSearch-base .input-addOn .input-ele').should('have.focus')

//     })
//     it('TC_BFSL_WEB_Watchlist_29-To verify, the searched symbol displayed under the search result ', () => {
//         cy.searchSymbol('TCS')
//         cy.wait(2000)
//         cy.get(' div.searchResutDiv.scrollArea').contains('TCS')
//     })
//     it('TC_BFSL_WEB_Watchlist_30-To verify, t the user able to add the searched symbol to the group ', () => {
//         cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .addToWatchlist-btn').click({ force: true })
//         cy.wait(100)
//         cy.get('div.dropdown-div > div.footer .add-btn').should('not.have.class', 'disable')
//     })
//     it('TC_BFSL_WEB_Watchlist_32-To verify,  the added group is displayed on the Watchlist screen', () => {
//         cy.get('div.dropdown-div > div.footer .add-btn').click({ force: true })
//         cy.wait(100)
//         cy.get('.watchlistDiv').contains('abc')
//     })
//     it('TC_BFSL_WEB_Watchlist_36-To verify,  user not able to create a new group with empty symbols    ', () => {
//         cy.get('.addWatchlist-btn').click({ force: true })
//         cy.input('.watchList-name-input', 'sample')
//         cy.get('.positiveBtn').click({ force: true })
//         cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });
//         cy.get('.watchlistDiv').should('not.to.contain', 'sample')

//     })

//     it('TC_BFSL_WEB_Watchlist_37-To verify,  the click on search bar in the Watchlist screen navigate the user to the search screen and check that the user able to search for the symbols    ', () => {
//         cy.get('.symSearch-base .input-addOn .input-ele').focus()
//         cy.get('.symSearch-base .input-addOn .input-ele').clear()
//         cy.get('.symSearch-base .input-addOn .input-ele').type("tcs")
//         cy.get('.searchResutDiv')

//     })
//     it('TC_BFSL_WEB_Watchlist_38-To verify,  the selection of symbol from the Search result shows the Add to Watchlist option with the symbol count    ', () => {

//         cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .addToWatchlist-btn').click({ force: true })
//         cy.checkText('.footer', 'Add Symbol')
//         cy.checkText('.footer span.selctedCount', 1)
//     })
//     it('TC_BFSL_WEB_Watchlist_39-To verify,  the De-selection of Symbol from the Search result removes the Add to watchlist option    ', () => {
//         cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .removeToWatchlist-btn').click({ force: true })
//         cy.checkText('.footer span.selctedCount', 0)
//     })
//     it('TC_BFSL_WEB_Watchlist_41-To verify,the click on Add to Watchlist option displays the Add to Watchlist overlay with the availaible watchlist groups    ', () => {
//         cy.watchlistDropdown()

//     })
//     it('TC_BFSL_WEB_Watchlist_42-To verify,  the user able to select the watchlist group Checkbox in the Add to watchlist overlay', () => {
//         cy.get('div.footer .options-div .option').should('have.class', 'selected')

//     })
//     it('TC_BFSL_WEB_Watchlist_43-To verify,  the user not able to select multiple watchlist group checkbox in the Add to watchlist overlay', () => {
//         cy.get('div.dropdown-div > div.footer div.options-div .option:last').click({ force: true })
//         cy.get('div.footer .options-div').should('have.class', 'hidden')
//     })

//     it('TC_BFSL_WEB_Watchlist_44-To verify,the click on Cancel option in the Add to Watchlist overlay closes the Overlay', () => {
//         cy.get('.addWatchlist-btn').click({ force: true })
//         cy.get('.footer .negativeBtn').click({ force: true })
//         cy.isHidden('.addWatchlistDialog')

//     })
//     it('TC_BFSL_WEB_Watchlist_45-To verify,the click on Done option in the Add to Watchlist overlay not redirect the user to Watchlist screen ', () => {
//         cy.get('.addWatchlist-btn').click({ force: true })
//         cy.input('.watchList-name-input', 'abc')

//         cy.get('.positiveBtn').click({ force: true })
//         cy.checkLength('.symSearch-base',1)



//     })
//     it('TC_BFSL_WEB_Watchlist_46-To verify,the added symbol is displayed under the Watchlist group', () => {
//         // cy.get('.addWatchlist-btn').click({ force: true })
//         // cy.input('.watchList-name-input', 'abc')

//         // cy.get('.positiveBtn').click({ force: true })
//         cy.get('.symSearch-base .input-addOn .input-ele').focus()
//         cy.get('.symSearch-base .input-addOn .input-ele').clear()
//         cy.get('.symSearch-base .input-addOn .input-ele').type("tcs")
//         cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .addToWatchlist-btn').click({ force: true })
//         cy.get('div.dropdown-div > div.footer .add-btn').click({ force: true })

//         cy.get('.watchlist-table').contains('TCS')


//     })
//     it('TC_BFSL_WEB_Watchlist_47:To validate that the user able to add only 50 symbols to the Watchlist ', () => {
//         cy.addWatchlist()
//         cy.inputWatchlistname("P1")
//         cy.get('.positiveBtn').click({ force: true })

//         cy.searchSymbol('tcs')
//         // cy.get('div.header > div.assetMenu.flex-center.cursor:nth-child(2)').click({ force: true })

//         cy.wait(5000)
//         for (var i = 1; i <= 50; i++)
//             cy.get('div.searchResutDiv.scrollArea > div:nth-child(' + i + ') .addToWatchlist-btn').click({ force: true })

//         // cy.get('div.searchResutDiv.scrollArea > div:nth-child(' + i + ') > div.btn-div > button.addToWatchlist-btn').click({ force: true })
//         cy.get('div.dropdown-div > div.footer .add-btn').click({ force: true })
//         cy.wait(1000)

//     })
//     it('TC_BFSL_WEB_Watchlist_48:To verify,the user not able to add more than 50 symbols to the watchlist group', () => {
//         cy.addWatchlist()
//         cy.inputWatchlistname("P1")
//         cy.get('.positiveBtn').click({ force: true })

//         cy.searchSymbol('wip')
//         cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .addToWatchlist-btn').click({ force: true })
//         cy.get('div.searchResutDiv.scrollArea > div:nth-child(2) .addToWatchlist-btn').click({ force: true })
//         cy.get('div.dropdown-div > div.footer .add-btn').click({ force: true })
//         cy.isVisible('.toastMsgDiv')
//     })

//     it('TC_BFSL_WEB_Watchlist_49:TTo verify,the error message is displayed for the addition of same symbol to the group', () => {
//         cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });

//         cy.get('.watchlistDiv').contains('abc').click({ force: true })
//         cy.get('.symSearch-base .input-addOn .input-ele').focus()
//         cy.get('.symSearch-base .input-addOn .input-ele').clear()
//         cy.get('.symSearch-base .input-addOn .input-ele').type("tcs")

//         cy.get('div.searchResutDiv.scrollArea > div:nth-child(2) .addToWatchlist-btn').click({ force: true })
//         cy.get('div.dropdown-div > div.footer .add-btn').click({ force: true })
//         cy.isVisible('.toastMsgDiv')
//     })

//     it('TC_BFSL_WEB_Watchlist_50:To verify,the user not able to redirect to the Watchlist screen addition of same symbol to the group', () => {

//         cy.checkLength('.symSearch-base',1)
//     })

//     it('TC_BFSL_WEB_Watchlist_52:To verify,the duplicate addition of symbol gets replaced and new addition of symbol is added to the watchlist group', () => {
//         cy.clickSearch()
//         cy.get('.symSearch-base .input-addOn .input-ele').clear()
//         cy.searchSymbol('tcs')
//         cy.wait(1000)
//         cy.get('div.searchResutDiv.scrollArea > div:nth-child(3) .addToWatchlist-btn').click({ force: true })
//         cy.get('div.searchResutDiv.scrollArea > div:nth-child(4) .addToWatchlist-btn').click({ force: true })

//         cy.get('div.dropdown-div > div.footer .add-btn').click({ force: true })
//         // cy.closeIcon()
//         cy.wait(100)
//         // cy.changeGroup('Test1')
//         // cy.wait(1000)
//         cy.get('.watchlist-table').contains('TCS')

//     })
//     it('TC_BFSL_WEB_Watchlist_53,54:To verify,the Add to watchlist symbol count gets increased when we try to select the multiple symbols     ', () => {
//         cy.clickSearch()
//         cy.get('.symSearch-base .input-addOn .input-ele').clear()

//         cy.searchSymbol('TCS')
//         cy.wait(2000)
//         cy.get('div.footer span.selctedCount').then(($val) => {
//             // store  text
//             const txt = $val.text()
//             cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .addToWatchlist-btn').click({ force: true })
//             cy.get('div.searchResutDiv.scrollArea > div:nth-child(2) .addToWatchlist-btn').click({ force: true })
//             cy.get('div.footer span.selctedCount').then(($val2) => {
//                 expect($val2.text()).not.to.eq(txt)
//             })
//         })
//     })
//     it('TC_BFSL_WEB_Watchlist_70:To validate that the user select the checkbox in the watchlist minimized view ', () => {
//         cy.get('span.bfsl-font.deleteIcon').click({ force: true })

//         cy.get('.watchlist-table tr:nth-child(1) td .checkboxIcon ').click({ force: true })
//         cy.get('span.bfsl-font.checkboxIcon').should('have.class', 'checked')

//     })

//     it('TC_BFSL_WEB_Watchlist_071:To validate that the user able to De-select the checkbox in the watchlist minimized view', () => {
//         cy.get('.watchlist-table tr:nth-child(1) td .checkboxIcon ').click({ force: true })
//         cy.get('span.bfsl-font.checkboxIcon').should('have.class', 'unChecked')

//     })

//     it('TC_BFSL_WEB_Watchlist_072:To verify,the selection of checkbox shows the Delete option with symbol count under the Edit watchlist screen  ', () => {

//         // cy.get('span.bfsl-font.deleteIcon').click({ force: true })
//         cy.get('.watchlist-table tr:nth-child(1) td .checkboxIcon ').click({ force: true })
//         cy.get('span.bfsl-font.deleteIcon').click({ force: true })
//         cy.isVisible('.deleteSym-dialog')
//         cy.checkText('.deleteSym-dialog .valueText','1')
//         cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });


//     })

//     it('TC_BFSL_WEB_Watchlist_074:To verify,the click on Delete allows the user to delete the symbol', () => {
//         cy.get('span.bfsl-font.deleteIcon').click({ force: true })

//         cy.get('.watchlist-table tr:nth-child(1) td .checkboxIcon ').click({ force: true })
//         cy.get('span.bfsl-font.deleteIcon').click({ force: true })
//         cy.checkLength('.deleteSym-dialog .footer .deleteBtn',1)
//     })
//     it('TC_BFSL_WEB_Watchlist_076:To verify,the deleted symbol changes not saved without clicking on the done option', () => {

//         cy.get('.deleteSym-dialog .footer .negativeBtn').click({ force: true })
//     })
//     it('TC_BFSL_WEB_Watchlist_077,78:To verify,the deleted symbol changes are saved by clicking on the done option', () => {
//         cy.get('span.bfsl-font.deleteIcon').click({ force: true })
//         cy.get('.watchlist-table tr:nth-child(1) td .checkboxIcon ').click({ force: true })
//         cy.get('span.bfsl-font.deleteIcon').click({ force: true })
//         cy.get('.deleteSym-dialog .footer .deleteBtn').click({ force: true })
//     })
//     it('TC_BFSL_WEB_Watchlist_079:To verify,the user able to delete the multiple symbols    ', () => {
//         cy.wait(100)
//         cy.get('span.bfsl-font.deleteIcon').click({ force: true })
//         cy.wait(1000)
//         cy.get('.watchlist-table tr:nth-child(1) td .checkboxIcon ').click({ force: true })
//         cy.get('.watchlist-table tr:nth-child(2) td .checkboxIcon ').click({ force: true })
//         cy.get('span.bfsl-font.deleteIcon').click({ force: true })

//         cy.isVisible('.deleteSym-dialog')
//     })

//     it('TC_BFSL_WEB_Watchlist_080:To verify,the Delete option count gets increased  selection of multiple symbols', () => {

//         // cy.get('span.bfsl-font.deleteIcon').click({ force: true })
//         // cy.get('.watchlist-table tr:nth-child(1) td .checkboxIcon ').click({ force: true })
//         // cy.get('span.bfsl-font.deleteIcon').click({ force: true })
//         // cy.isVisible('.deleteSym-dialog')
//         cy.checkText('.deleteSym-dialog .valueText','2')
//         cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });


//     })
//     it('TC_BFSL_WEB_Watchlist_081:To verify,the Delete option count gets increased  selection of multiple symbols ', () => {

//         cy.get('span.bfsl-font.deleteIcon').click({ force: true })
//         cy.get('.watchlist-table tr:nth-child(1) td .checkboxIcon ').click({ force: true })
//         cy.get('span.bfsl-font.deleteIcon').click({ force: true })
//         cy.isVisible('.deleteSym-dialog')
//         cy.checkText('.deleteSym-dialog .valueText','1')
//         cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });


//     })


//     it('TC_BFSL_WEB_Watchlist_082:To verify,the click on Predefined tab not redirect the user to Edit watchlist screen', () => {
//         cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
//         cy.get('.delete-icon').should('have.class', 'not-editable')

//     })
//     it('TC_BFSL_WEB_Watchlist_083:To verify,the click on Edit option near the Watchlist header displays the Delete watchlist overlay with the available watchlist groups', () => {
//         cy.get('.watchlist-header .edit-icon').click({ force: true })
//         cy.isVisible('.deleteWatchlistDropdown')

//     })
//     it('TC_BFSL_WEB_Watchlist_085:To verify,the click on Edit option near the Watchlist header not displays the Predefined watchlist in the Delete watchlist overlay', () => {
//         cy.get('.watchlist-header .edit-icon').click({ force: true })
//         cy.get('.deleteWatchlistDropdown').should('not.contain', 'PredNifty50')


//     })
//     it('TC_BFSL_WEB_Watchlist_086:Check that the availability of fields in the Delete watchlist overlay    ', () => {

//         cy.isVisible('.deleteWatchlistDropdown')
//         cy.isVisible('.deleteWatchlistDropdown .dataRow .groupName')
//         cy.isVisible('.deleteWatchlistDropdown .dataRow .deleteIcon ')


//     })
//     it('TC_BFSL_WEB_Watchlist_087,88,89:To verify,click on delete icon shows the Delete watchlist confirmation overlay    ', () => {
//         // cy.get('.watchlistDiv').contains('abc').click({ force: true })

//         cy.get('.deleteWatchlistDropdown .dataRow:first .groupName ').then(($val) => {
//             // store  text
//             const txt = $val.text()
//             cy.log("text", txt)
//             cy.get('.deleteWatchlistDropdown .dataRow .deleteIcon:first').click({ force: true })
//             cy.isVisible('.deleteInfoDiv')
//             cy.get('.deleteWatchlistDropdown .btnDiv .deleteBtn').click({ force: true, multiple: true })
//             cy.wait(100)
//             cy.get('.watchlistDiv').should('not.contain', txt)

//         })
//     })
//     it('TC_BFSL_WEB_Watchlist_90,91:To verify,click on Cancel option closes the confirmation overlay     ', () => {
//         cy.get('.watchlist-header .edit-icon').click({ force: true })
//         cy.get('.deleteWatchlistDropdown .dataRow:first .groupName ').then(($val) => {
//             const txt = $val.text()
//             cy.log("text", txt)
//             cy.get('.deleteWatchlistDropdown .dataRow .deleteIcon:first').click({ force: true })
//             cy.get('.deleteWatchlistDropdown .btnDiv .cancelBtn').click({ force: true, multiple: true })
//             cy.get('.watchlistDiv').contains(txt)


//         })
//     })
//     it('TC_BFSL_WEB_Watchlist_92,93:To verify,the user able to delete only one group at a time    ', () => {
//         cy.get('.watchlist-header .edit-icon').click({ force: true })
//         cy.get('.deleteWatchlistDropdown .dataRow .deleteIcon:first').click({ force: true })
//         cy.get('.deleteWatchlistDropdown .row').should('have.class', 'selected')

//     })
//     it('TC_BFSL_WEB_Watchlist_95:To verify,the click on Buy action redirect the user to the Trade screen    ', () => {
//         cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });

//         cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.buy-btn').click({ force: true })
//         cy.isVisible('.orderPadBase')


//     })
//     it('TC_BFSL_WEB_Watchlist_99:To verify,the click on Sell action redirect the user to the Trade screen    ', () => {
//         cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(6) button.sell-btn').click({ force: true })
//         cy.isVisible('.orderPadBase')


//     })

//     it('TC_BFSL_WEB_Watchlist_101:To verify,the click on the symbol redirect the user to the Quotes screen    ', () => {
//         cy.get('.watchlist-table tbody > tr:nth-child(1) > td.firstChild.width30 div.primary div.baseSym').click({ force: true })
//         cy.isVisible('.quote-view ')


//     })
//     it('TC_BFSL_WEB_Watchlist_103-To verify,the user able to sort the symbols in ascending order by clicking  the arrow down icon    ', () => {
//         cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
//         cy.get('table > thead > tr > th.firstChild.width30 > span.sort-icon-container > span.bfsl-font.arrow-down.cursor.non-sort').click({ force: true })
//         cy.get('table > thead > tr > th.firstChild.width30 > span.sort-icon-container > span.bfsl-font.arrow-down.cursor').not('.non-sort')

//     })
//     it('TC_BFSL_WEB_Watchlist_104-To verify,the user able to sort the symbols in descending order by clicking  the arrow up icon    ', () => {
//         cy.get('table > thead > tr > th.firstChild.width30 > span.sort-icon-container > span.bfsl-font.arrow-up.cursor.non-sort').click({ force: true })
//         cy.get('table > thead > tr > th.firstChild.width30 > span.sort-icon-container > span.bfsl-font.arrow-up.cursor').not('.non-sort')

//     })
//     it('TC_BFSL_WEB_Watchlist_105-To verify,the user able to sort the LTP in ascending order by clicking  the arrow down icon    ', () => {
//         cy.get('table > thead > tr > th:nth-child(3) > span.sort-icon-container > span.bfsl-font.arrow-down.cursor.non-sort').click({ force: true })
//         cy.get('table > thead > tr > th:nth-child(3) > span.sort-icon-container > span.bfsl-font.arrow-down.cursor').not('.non-sort')
//     })
//     it('TC_BFSL_WEB_Watchlist_106-To verify,the user able to sort the LTP in descending order by clicking  the arrow up icon    ', () => {
//         cy.get('table > thead > tr > th:nth-child(3) > span.sort-icon-container > span.bfsl-font.arrow-up.cursor.non-sort').click({ force: true })
//         cy.get('table > thead > tr > th:nth-child(3) > span.sort-icon-container > span.bfsl-font.arrow-up.cursor').not('.non-sort')
//     })
//     it('TC_BFSL_WEB_Watchlist_107-To verify,the user able to sort the Chg.(%) in ascending order by clicking  the arrow down icon    ', () => {
//         cy.get('table > thead > tr > th:nth-child(4) > span.sort-icon-container > span.bfsl-font.arrow-down.cursor.non-sort').click({ force: true })
//         cy.get('table > thead > tr > th:nth-child(4) > span.sort-icon-container > span.bfsl-font.arrow-down.cursor').not('.non-sort')
//     })
//     it('TC_BFSL_WEB_Watchlist_108-To verify,the user able to sort the Chg.(%) in descending order by clicking  the arrow up icon    ', () => {
//         cy.get('table > thead > tr > th:nth-child(4) > span.sort-icon-container > span.bfsl-font.arrow-up.cursor.non-sort').click({ force: true })
//         cy.get('table > thead > tr > th:nth-child(4) > span.sort-icon-container > span.bfsl-font.arrow-up.cursor').not('.non-sort')
//     })
// })











import { URL, USER_NAME, PASSWORD, PAN_NUMBER, } from '../support/config'
import { WATCHLIST } from '../support/config'

before(function () {
    cy.wait(2000)
    cy.visit(URL)
    Cypress.Cookies.defaults({
        preserve: ['JSESSIONID', 'Auth-Token'],
    })
})

describe("Watchlist", () => {

    it('valid login', () => {
        cy.wait(2000)
        cy.login(USER_NAME, PASSWORD, PAN_NUMBER)

        cy.wait(2000)
        cy.isLoginSuccess()
    })

    
    it('TC_BFSL_Watchlist_001:To validate the availability of fields in the Watchlist screen for the New/Existing user Logging the application for the First time', () => {
    
        // cy.get('[test_id="menu_WATCHLIST"]').click()
        // cy.wait(5000)
        // cy.url().should('contain', '/home/watchlist')
        cy.isVisible('.watchlistDiv')
        cy.checkLength('.symSearch-base .searchIcon', 1)
        cy.checkLength('.deleteIcon', 1)
        // cy.checkLength('.filterIcon.cursor', 1)
        // cy.checkLength('div.widget-header > span.bfsl-font.maximizeIcon.undefined', 1)
        // cy.checkLength('th.firstChild.width40 > span.cursor', 1)
        // cy.checkLength('th.width20.show-sm', 1)
        // cy.checkLength(' th.width18.show-sm.last_th', 1)
        // cy.checkLength('.stock_report_btn.flex-center', 1)
        // cy.checkLength('button.buy-btn', 1)
        // cy.checkLength('button.sell-btn', 1)
        // cy.checkText('.quoteDetails-base', 'CHART')
        // cy.checkText('.quoteDetails-base', 'FUTURES')
        // cy.checkText('.quoteDetails-base', 'OPTIONS')
        cy.isVisible('span.bfsl-font.plusIcon')
    })

    it('TC_BFSL_Watchlist_002:To validate that the predefined Watchlist is displayed under the Watchlist tab for the First time logging user', () => {

        cy.get('.watchlistDiv').contains('PredNifty50')
    })

    it('TC_BFSL_Watchlist_003:To validate that the user not able to delete the predefined Watchlist group', () => {
        cy.get('.watchlist-header .edit-icon').click({ force: true })
        //         cy.get('.deleteWatchlistDropdown').should('not.contain', 'PredNifty50')



    })
    it('TC_BFSL_Watchlist_004:To validate that the user not able to delete  the predefined Watchlist symbols', () => {
        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        cy.get('.delete-icon').should('have.class', 'not-editable')
    })

    it('TC_BFSL_Watchlist_005:To validate that the user not able to add new symbols to the  predefined Watchlist  ', () => {

        cy.clickSearch()
        cy.searchSymbol('TCS')
        cy.watchlistDropdown()
        cy.get('div.dropdown-div > div.footer div.options-div').should('not.to.contain', 'PredNifty50')
        // cy.closeIcon()

    })

    // it('TC_BFSL_Watchlist_006:To validate that click on Watchlist dropdown displays the Add watchlist option for the New user logging the application for the first time  ', () => {

    //     cy.clickDownarrow()
    //     cy.wait(10)
    //     cy.isVisible('[test_id="addWatchlist_option"]')

    // })
    it('TC_BFSL_Watchlist_007:To validate that the click on Watchlist dropdown displays the available Watchlist groups and add Watchlist option for the Existing user', () => {

        cy.get('.watchlistDiv').contains('PredNifty50')
    })
    it('TC_BFSL_Watchlist_008:To validate that the click on add Watchlist option displays the Add New Watchlist popup', () => {

        cy.get('.addWatchlist-btn').click({ force: true })
        // cy.wait(100)
        cy.isVisible('.addWatchlistDialog')

    })

    it('TC_BFSL_Watchlist_009:To validate the availability of fields in the Add New Watchlist popup', () => {
        cy.window().then((win) => {
            cy.checkLength('.addWatchlistDialog .content', 1)
            cy.checkLength('.addWatchlistDialog .content .watchList-name-div', 1)
            cy.get('.addWatchlistDialog .content').contains('Maximum 15 Characters')
            cy.checkLength('.addWatchlistDialog .footer > button.negativeBtn', 1)
            cy.checkLength('.addWatchlistDialog .footer .positiveBtn', 1)
        })
    })
    it('TC_BFSL_Watchlist_011:To validate the "cancel" option in the Add New Watchlist popup', () => {

        cy.get('.addWatchlistDialog .footer .negativeBtn').click({ force: true })
        cy.get('.addWatchlistDialog').should('not.exist')

    })
    it('TC_BFSL_Watchlist_012:To validate the click outside of the popup closes the Add new Watchlist popup', () => {

        cy.addWatchlist()
        cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });

        cy.get('.addWatchlistDialog').should('not.exist')

    })
    it('TC_BFSL_Watchlist_013:To validate the field "Enter Watchlist name" by providing the input as empty', () => {
        cy.addWatchlist()
        cy.get('.addWatchlistDialog .footer .positiveBtn').should('be.disabled')
    })
    it('TC_BFSL_Watchlist_014 :To validate the field "Enter Watchlist name" by providing the input as special characters', () => {
        cy.inputWatchlistname('@#$%^')
        cy.get('.watchList-name-input').should('have.value', '')


    })

    it('TC_BFSL_Watchlist_015 :To validate the field "Enter Watchlist name" by providing the input as space', () => {
        cy.inputWatchlistname(' ')
        cy.get('.addWatchlistDialog .footer .positiveBtn').should('be.disabled')
    })

    // it('TC_BFSL_Watchlist_016 :To validate the field "Enter Watchlist name" by providing the input as space in between the characters', () => {
    //     cy.inputWatchlistname('demo account')
    //     cy.get('.window  .content .inputVal.watchList-name-input').should('have.value', 'demo account')
    // })

    it('TC_BFSL_Watchlist_017:To validate the field "Enter Watchlist name" by providing the input as Alphabets', () => {
        cy.inputWatchlistname('watchlist')
        cy.get('.addWatchlistDialog .footer .positiveBtn').click({ force: true })
        cy.get('.symSearch-base .input-addOn .input-ele').should('have.focus')
        cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });

        // cy.closeIcon()

    })
    it('TC_BFSL_Watchlist_018 :To validate the field "Enter Watchlist name" by providing the input as numeric', () => {

        cy.addWatchlist()
        cy.inputWatchlistname('123456')
        cy.get('.addWatchlistDialog .footer .positiveBtn').click({ force: true })
        cy.get('.symSearch-base .input-addOn .input-ele').should('have.focus')
        cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });

    })
    it('TC_BFSL_Watchlist_019 :To validate the field "Enter Watchlist name" by providing the input as Alphanumeric', () => {
        cy.addWatchlist()
        cy.inputWatchlistname('abcd123')
        cy.get('.addWatchlistDialog .footer .positiveBtn').click({ force: true })
        cy.get('.symSearch-base .input-addOn .input-ele').should('have.focus')
        cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });
    })

    it('TC_BFSL_Watchlist_020:To validate the field "Enter Watchlist name" by providing the input as Alphanumeric with special character', () => {
        cy.addWatchlist()
        cy.inputWatchlistname('abcd@123')
        cy.get('.watchList-name-input').should('have.value', 'abcd123')

        cy.get('.addWatchlistDialog .footer .negativeBtn').click({ force: true })

    })

    it('TC_BFSL_Watchlist_021:To validate that the user able to create the Watchlist with the existing Watchlist name', () => {
        cy.changeDefault()
    })

    it('TC_BFSL_Watchlist_022:To validate that the user not able to enter more that more than 15 characters in the enter Watchlist name', () => {
        cy.addWatchlist()
        cy.inputWatchlistname('Group1Group2group3group4group5')
        cy.get('.watchList-name-input').should('have.value', 'Group1Group2gro')
        cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });

    })

    it('TC_BFSL_Watchlist_023:To validate that the click on cancel button in Add New Watchlist popup closes the add New watchlist popup', () => {
        cy.addWatchlist()
        cy.inputWatchlistname(WATCHLIST.NAME)
        cy.get('.addWatchlistDialog .footer .negativeBtn').click({ force: true })

        cy.get('.addWatchlistDialog').should('not.exist')
    })

    it('TC_BFSL_Watchlist_024:To validate that the click on save button in Add New Watchlist popup redirect the user to the search bar', () => {
        cy.addWatchlist()
        cy.inputWatchlistname(WATCHLIST.NAME)
        cy.get('.addWatchlistDialog .footer .positiveBtn').click({ force: true })
        // cy.get('.symSearch-base .input-addOn .input-ele').should('have.focus')
        cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });
    })

    it('TC_BFSL_Watchlist_025:To validate the click outside of the popup closes the search popup', () => {
        cy.addWatchlist()
        cy.inputWatchlistname(WATCHLIST.NAME)
        cy.get('.addWatchlistDialog .footer .positiveBtn').click({ force: true })
        cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });

    })

    
    it('TC_BFSL_Watchlist_026:To validate that the searched symbol is displayed under the search result ', () => {
        cy.addWatchlist()
        cy.inputWatchlistname(WATCHLIST.NAME)
        cy.get('.addWatchlistDialog .footer .positiveBtn').click({ force: true })
        cy.searchSymbol('TCS')
        // cy.wait(2000)
        cy.get(' div.searchResutDiv').contains('TCS')
    })

    it('TC_BFSL_Watchlist_027:To validate that the user able to add the searched symbol to the group by clicking on the Plus icon', () => {
        cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .addToWatchlist-btn').click({ force: true })
        // cy.wait(100)
        cy.get('div.dropdown-div > div.footer .add-btn').click({ force: true })
    })

    it('TC_BFSL_Watchlist_028:To validate that the selection of symbols in the search result displays the created Watchlist group with the save option', () => {
        cy.checkLength(' div.dropdown-div div.footer div.action-div', 1)
        cy.checkText('div.dropdown-div div.footer .select-input-div .select-input', WATCHLIST.NAME)

    })


    it('TC_BFSL_Watchlist_030:To validate that the click on save button in the search displays the Success popup', () => {
        cy.get('div.dropdown-div > div.footer .add-btn').click({ force: true })
        cy.isVisible('.toastMsgDiv')

    })
    //test

    // it('TC_BFSL_Watchlist_031:To validate that the click on Ok button in the Success popup redirect closes the search popup', () => {
    //     if (Cypress.$('.window').length == 1) {
    //         cy.cancelPopup()
    //         cy.get('#modal-dialog > div.window').should('not.exist')
    //     }
    //     else {
    //         cy.closeIcon()
    //     }
    //     // cy.changeDefault()

    // })

    it('TC_BFSL_Watchlist_029:To validate that the created group is not displayed under the watchlist when user closes the search popup before adding the symbol to the group', () => {
        cy.addWatchlist()
        cy.inputWatchlistname('p1')
        cy.get('.addWatchlistDialog .footer .positiveBtn').click({ force: true })
        cy.searchSymbol('TCS')

        cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });

        cy.get('.watchlistDiv').should('not.contain', 'p1 ')


    })


    it('TC_BFSL_Watchlist_032:To validate that the created group is not getting saved without selecting the save option', () => {
        cy.addWatchlist()
        cy.inputWatchlistname('test2')
        cy.get('.addWatchlistDialog .footer .positiveBtn').click({ force: true })
        cy.searchSymbol('TCS')
        // cy.wait(1000)
        cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .addToWatchlist-btn').click({ force: true })
        cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });
        cy.get('.watchlistDiv').should('not.to.contain', 'test2')
    })

    //how many watchlist already present in our account

    // it('TC_BFSL_Watchlist_033:To validate that the user able to create only 10 Watchlists', () => {
    //     cy.clickSearch()
    //     cy.wait(500)
    //     cy.closeIcon()
    //     for (var i = 1; i <= 6; i++) {
    //         cy.addWatchlist()
    //         cy.inputWatchlistname(i)
    //         cy.get('.window .footer .positiveBtn').click({ force: true })
    //         cy.searchSymbol('TCS')
    //         cy.wait(2000)
    //         cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .addToWatchlist-btn').click()
    //         cy.wait(500)
    //         cy.get(' div.dropdown-div > div.footer > div > button.save-btn').click({ force: true })
    //         if (Cypress.$('.window').length == 1) {

    //             cy.cancelPopup()
    //         }
    //         else {
    //             cy.closeIcon()
    //         }
    //         cy.wait(1000)
    //     }
    //     cy.deleteGroup()

    // })

    // it('34',()=>{
    //     cy.addWatchlist()
    //     cy.get('.app-modalDialog2.addWatchGroup-dialog').should('not.be.visible')

    // })




    it('TC_BFSL_Watchlist_035:To validate that the click on search bar in the Watchlist screen displays the search popup and check that the user able to search for the symbols', () => {
        cy.clickSearch()
        cy.searchSymbol('TCS')
        // cy.wait(1000)
        cy.get(' div.searchResutDiv').contains('TCS')
    })

    it('TC_BFSL_Watchlist_036:To validate that the selection of symbol from the Search result shows the watchlist dropdown with the symbol count', () => {
        // cy.wait(500)
        cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .addToWatchlist-btn').click({ force: true })
        cy.checkLength('div.dropdown-div > div.footer .select-input-div', 1)
        cy.checkLength('div.dropdown-div > div.footer span.selctedCount', 1)
    })

    it('TC_BFSL_Watchlist_037:To validate that the deselection of symbol from the Search result shows the watchlist dropdown with the symbol count', () => {
        cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .removeToWatchlist-btn').click({ force: true })

        cy.checkLength(' div.dropdown-div > div.footer div.select-input-div', 1)
        cy.checkText('div.dropdown-div > div.footer span.selctedCount', 0)

    })

    it('TC_BFSL_Watchlist_039:To validate that the click on Watchlist dropdown displays the available Watchlists with symbol counts ', () => {

        cy.watchlistDropdown()
        cy.get(' div.dropdown-div > div.footer div.options-div').contains(WATCHLIST.NAME)
        cy.checkLength(' div.dropdown-div > div.footer .select-input-div', 1)
        cy.checkLength('div.dropdown-div > div.footer span.selctedCount', 1)

    })

    it('TC_BFSL_Watchlist_040:To validate that the user able to select the Watchlist dropdown in the search popup', () => {
        // cy.get(' div.symbol-search-div.flex-center > div > div.dropdown-div > div.footer .select-input-div').click()
        cy.get('div.dropdown-div > div.footer .options-div .option').should('have.class', 'selected')
    })
    // #darkTheme > div:nth-child(3) > div > div.headerBase-div > div.symbol-search-div.flex-center > div > div.dropdown-div > div.footer > div > div > div > div > div.options-div-base.hidden > div

    it('TC_BFSL_Watchlist_041:To validate that the user not able to select multiple Watchlist dropdown in the search popup', () => {
        cy.get('div.dropdown-div > div.footer div.options-div.showOption').contains('Test1').click({ force: true })
        cy.get('div.symbol-search-div.flex-center > div > div.dropdown-div > div.footer .options-div.showOption').should('not.exist')
    })

    it('TC_BFSL_Watchlist_042:To validate that the click on save button in the Add to search popup not redirect the user to Watchlist screen', () => {
        cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .addToWatchlist-btn').click({ force: true })
        cy.get('div.dropdown-div > div.footer .add-btn').click({ force: true })
        // cy.wait(1000)
        // cy.get('div.dropdown-div > div.footer button.save-btn').click()
        cy.get('div.dropdown-div').should('exist')
        cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });

    })

    it('TC_BFSL_Watchlist_043:To validate that the added symbol is displayed under the Watchlist', () => {
        // cy.wait(1000)
        cy.get('.watchlist-table tbody tr').contains('TCS')
    })

    it('TC_BFSL_Watchlist_044:To validate that the user able to add only 50 symbols to the Watchlist ', () => {
        cy.addWatchlist()
        cy.inputWatchlistname("P1")
        cy.get('.addWatchlistDialog .footer .positiveBtn').click({ force: true })
        cy.searchSymbol('tcs')
        // cy.get('div.header > div.assetMenu.flex-center.cursor:nth-child(2)').click({ force: true })

        // cy.wait(5000)
        for (var i = 1; i <= 50; i++)
            cy.get('div.searchResutDiv.scrollArea > div:nth-child(' + i + ') .addToWatchlist-btn').click({ force: true })

        cy.get('div.dropdown-div > div.footer .add-btn').click({ force: true })

        // cy.wait(1000)
        cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });

    })



       
    it('TC_BFSL_Watchlist_045:To validate that the user not able to add more than 50 symbols to the Watchlist ', () => {
        cy.addWatchlist()
        cy.inputWatchlistname("P1")
        cy.get('.addWatchlistDialog .footer .positiveBtn').click({ force: true })

        cy.searchSymbol('wip')
        // cy.wait(5000)
        cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .addToWatchlist-btn').click({ force: true })
        cy.get('div.searchResutDiv.scrollArea > div:nth-child(2) .addToWatchlist-btn').click({ force: true })

        cy.get('div.dropdown-div > div.footer .add-btn').click({ force: true })

        // cy.wait(1000)
        // cy.get(' div.dropdown-div > div.footer > div.msg-div>').should('have.class', 'error')

        cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });

        // cy.changeDefault()
    })


    it('TC_BFSL_Watchlist_046 048:To validate that the error message is displayed for the addition of same symbol to the group', () => {
        cy.addWatchlist()
        cy.inputWatchlistname('Test1')
        cy.get('.addWatchlistDialog .footer .positiveBtn').click({ force: true })

        cy.searchSymbol('TCS')
        // cy.wait(2000)
        cy.get('div.searchResutDiv.scrollArea > div:nth-child(2) .addToWatchlist-btn').click({ force: true })

        cy.get('div.dropdown-div > div.footer .add-btn').click({ force: true })
        cy.isVisible('.toastMsgDiv')


    })

    it('TC_BFSL_Watchlist_047:To validate that the user not able to redirect to the Watchlist screen addition of same symbol to the group', () => {
        cy.get('div.dropdown-div')

    })

    it('TC_BFSL_Watchlist_049:To validate that the duplicate addition of symbol gets replaced and new addition of symbol is added to the Watchlist', () => {
        cy.addWatchlist()
        cy.inputWatchlistname('P1')
        cy.get('.addWatchlistDialog .footer .positiveBtn').click({ force: true })

        cy.clickSearch()
        cy.searchSymbol('WIPRO')
        cy.wait(1000)
        cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .addToWatchlist-btn').click({ force: true })
        cy.get('div.searchResutDiv.scrollArea > div:nth-child(2) .addToWatchlist-btn').click({ force: true })

        cy.watchlistDropdown()
        cy.get('div.dropdown-div > div.footer div.options-div.showOption').contains('Test1').click({ force: true })
        cy.get('div.dropdown-div > div.footer .add-btn').click({ force: true })
        cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });
        // cy.wait(100)
        cy.get('.watchlistDiv').contains('Test1').click({ force: true })
        cy.checkText('.watchlist-table tbody tr', 'WIPRO')
    })

    it('TC_BFSL_Watchlist_050_051:To validate that the watchlist dropdown watchlist with symbol count gets increased when we try to select the multiple symbols ', () => {
        cy.addWatchlist()
        cy.inputWatchlistname('P1')
        cy.get('.addWatchlistDialog .footer .positiveBtn').click({ force: true })

        cy.clickSearch()
        cy.searchSymbol('WIPRO')
        // cy.wait(2000)
        cy.get('div.dropdown-div div.footer span.selctedCount').then(($val) => {
            // store  text
            const txt = $val.text()
            cy.wait(1000)
            cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .addToWatchlist-btn').click({ force: true })
            cy.get('div.searchResutDiv.scrollArea > div:nth-child(2) .addToWatchlist-btn').click({ force: true })
    
            cy.get('div.dropdown-div > div.footer span.selctedCount').then(($val2) => {
                expect($val2.text()).not.to.eq(txt)
            })
        })
        cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });

    })

    // it('TC_BFSL_Watchlist_052:To validate that the user able to add Equity cash symbols to the Watchlist', () => {
    //     cy.addSymbol('equity', 'cash')

    // })

    // it('TC_BFSL_Watchlist_053:To validate that the user able to add Equity future symbols to the Watchlist', () => {
    //     cy.addSymbol('equity', 'future')
    // })

    // it('TC_BFSL_Watchlist_054:To validate that the user able to add Equity option symbols to the Watchlist', () => {
    //     cy.addSymbol('equity', 'option')

    // })

    // it('TC_BFSL_Watchlist_055:To validate that the user able to add currency future symbols to the Watchlist', () => {
    //     cy.addSymbol('currency', 'future')

    // })

    // it('TC_BFSL_Watchlist_056:To validate that the user able to add currency options symbols to the Watchlist', () => {
    //     cy.addSymbol('currency', 'option')
    // })

    // it('TC_BFSL_Watchlist_057:To validate that the user able to add commodity future symbols to the Watchlist', () => {
    //     cy.addSymbol('commodity', 'future')

    // })
    // it('TC_BFSL_Watchlist_058:To validate that the user able to add commodity options symbols to the Watchlist', () => {
    //     cy.addSymbol('commodity', 'option')
    //     // cy.deletelast9group()

    // })


    it('TC_BFSL_Watchlist_060:To validate that the click on Watchlist dropdown displays the available Watchlist with the delete icon', () => {
        cy.get('.watchlist-header .edit-icon').click({ force: true })
        // cy.isVisible('.deleteSym-dialog')

    })


    it('TC_BFSL_Watchlist_061:To validate that the click on delete icon displays the Delete watchlist popup', () => {
        cy.get('.deleteWatchlistDropdown span.bfsl-font.deleteIcon:first').click({ force: true })
        // cy.isVisible('.deleteWatchlistDropdown')
    })

    it('TC_BFSL_Watchlist_062:To validate the availability of fields in the delete popup', () => {
        cy.isVisible('.deleteWatchlistDropdown')
        cy.isVisible('.deleteWatchlistDropdown .dataRow .groupName')
        cy.isVisible('.deleteWatchlistDropdown .dataRow .deleteIcon ')

    })
    it('TC_BFSL_Watchlist_063:To validate the "Close" option in the delete Watchlist popup', () => {
        cy.get('.deleteWatchlistDropdown .btnDiv .cancelBtn').click({ force: true, multiple: true })

        // cy.get('.deleteWatchlistDropdown button.cancelBtn').click({ force: true })
        // cy.isHidden('.deleteInfoDiv')

    })
    it('TC_BFSL_Watchlist_064:To validate that the Watchlist is not deleted when user selects the close option in the delete Watchlist popup', () => {
        cy.get('.watchlistDiv').contains('Test')

    })

    it('TC_BFSL_Watchlist_066:To validate the "click outside of the Delete watchlist popup closes the popup"', () => {
        cy.get('.watchlist-header .edit-icon').click({ force: true })
        cy.get('.deleteWatchlistDropdown span.bfsl-font.deleteIcon:first').click({ force: true })
        cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });
        cy.get('.deleteWatchlistDropdown').should('not.exist')


    })

    it('TC_BFSL_Watchlist_067:To validate that the selection delete option in the delete watchlist popup allows the user to delete the Watchlist', () => {

        cy.get('.watchlist-header .edit-icon').click({ force: true })
        cy.get('.deleteWatchlistDropdown span.bfsl-font.deleteIcon:first').click({ force: true })
        cy.get('div.deleteInfoDiv > div.btnDiv > button.deleteBtn').click({ multiple: true, force: true })

        cy.isVisible('.toastMsgDiv')

    })
    // it('TC_BFSL_Watchlist_068:To validate the Ok button in the delete confirmation popup', () => {
    //     cy.cancelPopup()

    // })


    // // // delete test



    it('TC_BFSL_Watchlist_069_070:To validate the user able to delete only one group at a time', () => {
        cy.get('.watchlist-header .edit-icon').click({ force: true })
        cy.get('.deleteWatchlistDropdown .dataRow .deleteIcon:first').click({ force: true })
        cy.get('.deleteWatchlistDropdown .row').should('have.class', 'selected')
        cy.get('.deleteWatchlistDropdown .btnDiv .cancelBtn').click({ force: true, multiple: true })
        cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });


    })
    //
    
    it('TC_BFSL_Watchlist_071:To validate that the click on watchlist dropdown not display the deleted group ', () => {
        // cy.clickDownarrow()
        // cy.wait(10)
        cy.get('.watchlistDiv').should('not.contain', 'Test ')


    })

    it('TC_BFSL_Watchlist_072:To validate that the click on delete icon in the Watchlist minimized view displays the checkbox near the symbol name', () => {
        cy.isVisible('.watchlistDiv span.watchGroup.flex-center')
        cy.get('.watchlistDiv span.watchGroup.flex-center:nth-child(2)').click({ force: true }) 
         // cy.get('.watchlistDiv').contains('abc')
        cy.get('.watchlist-header .deleteIcon').click({ force: true })
        // cy.get('.watchlist-table tr:nth-child(1) > td .checkboxIcon').click({ force: true })
        // cy.get('.small-widget div.widget-header > div.icon-div > span.bfsl-font.deleteIcon.cursor').click({ force: true })
        cy.isVisible('span.bfsl-font.checkboxIcon')

    })

    it('TC_BFSL_Watchlist_073:To validate that the user select the checkbox in the watchlist minimized view ', () => {
        cy.get('.watchlist-table tr:nth-child(1) > td .checkboxIcon').click({ force: true })
        cy.get('span.bfsl-font.checkboxIcon').should('have.class', 'checked')

    })

    it('TC_BFSL_Watchlist_074:To validate that the user able to De-select the checkbox in the watchlist minimized view', () => {
        cy.get('.watchlist-table tr:nth-child(1) > td .checkboxIcon').click({ force: true })
        cy.get('span.bfsl-font.checkboxIcon').should('have.class', 'unChecked')

    })

    it('TC_BFSL_Watchlist_075:To validate that the selection of checkbox highlights the delete icon in red colour', () => {
        // cy.get('.watchlist-header .deleteIcon').click({ force: true })
        cy.get('.watchlist-header span.bfsl-font.deleteIcon').should('have.css', 'color', 'rgb(255, 103, 0)')

    })

    it('TC_BFSL_Watchlist_077:To validate that the click on delete icon in the watchlist minimized view displays the delete script confirmation popup', () => {
        cy.get('.watchlist-table tr:nth-child(1) > td .checkboxIcon').click({ force: true })
        cy.get('.watchlist-header .deleteIcon').click({ force: true })
        cy.wait(1000)
        cy.isVisible('.app-modalDialog2')



    })

    it('TC_BFSL_Watchlist_078:To validate the availability of fields in the delete script confirmation popup', () => {
        cy.window().then((win) => {
            cy.checkLength('.window .title', 1)
            // cy.checkLength('.window  .content .inputVal.watchList-name-input', 1)
            cy.checkLength('.window .content', 1)
            cy.checkLength('.window .footer > button.negativeBtn', 1)
            cy.get('.window .content').contains('Are you sure you want to delete')

        })

    })

    it('TC_BFSL_Watchlist_080:To validate the cancel option in the delete script confirmation popup', () => {
        cy.get('.window .footer > button.negativeBtn').click({ force: true })
        cy.get('.deleteSym-dialog').should('not.exist')

    })

    it('TC_BFSL_Watchlist_81:To validate the click outside of the delete script confirmation popup ', () => {
        cy.get('.watchlist-header .deleteIcon').click({ force: true })
        cy.get('.watchlist-table tr:nth-child(1) > td .checkboxIcon').click({ force: true })
        cy.get('.watchlist-header .deleteIcon').click({ force: true })


        cy.get('.deleteSym-dialog').click(-20, -20, { force: true });
        cy.get('div.window').should('not.exist')

    })

    it('TC_BFSL_Watchlist_82:To validate that the click on the delete button in the delete script confirmation popup allows the user to delete the selected symbols', () => {
        cy.get('.watchlist-header .deleteIcon').click({ force: true })
        cy.get('.watchlist-table tr:nth-child(1) > td .checkboxIcon').click({ force: true })
        cy.get('.watchlist-header .deleteIcon').click({ force: true })
        cy.window().then((win) => {
            cy.checkLength('.window .title', 1)
            cy.checkLength('.window .content', 1)
            cy.checkLength('.window .footer > button.negativeBtn', 1)
        })
        cy.get('.window .footer > button.left-btn.deleteBtn').click({ force: true })

    })

    it('TC_BFSL_Watchlist_83:To validate that the click on Ok button in the success popup closes the popup', () => {
        // cy.cancelPopup()
        cy.get('div.window').should('not.exist')

    })

    it('TC_BFSL_Watchlist_84:To validate that the checkbox get closed without selection of any symbols', () => {
        cy.isVisible('.watchlistDiv span.watchGroup.flex-center')
        cy.get('.watchlistDiv span.watchGroup.flex-center:nth-child(3)').click({ force: true }) 
        cy.get('.watchlist-header .deleteIcon').click({ force: true })
        cy.isVisible('span.bfsl-font.checkboxIcon')
        cy.get('.watchlist-header .deleteIcon').click({ force: true })
        cy.isHidden('span.bfsl-font.checkboxIcon')


    })

    it('TC_BFSL_Watchlist_85:To Validate that the user able to select multiple checkbox', () => {
        cy.isVisible('.watchlistDiv span.watchGroup.flex-center')
        cy.get('.watchlistDiv span.watchGroup.flex-center:nth-child(3)').click({ force: true }) 
        cy.get('.watchlist-header .deleteIcon').click({ force: true })
        cy.isVisible('span.bfsl-font.checkboxIcon')
        cy.get('.watchlist-header .deleteIcon').click({ force: true })
        cy.isHidden('span.bfsl-font.checkboxIcon')

        // cy.get('#watchlist-small-tbody > tr:nth-child(3) > td.width4.checkbox-td > input.input-ele').click()
        // cy.get('#watchlist-small-tbody > tr:nth-child(4) > td.width4.checkbox-td > input.input-ele').click()



    })

    it('TC_BFSL_Watchlist_86:To validate that the user able to delete multiple symbols', () => {
        // cy.get('.watchlist-header .deleteIcon').click({ force: true })


        // // cy.get('div.widget-header > div.icon-div > span.bfsl-font.deleteIcon.cursor').click()
        // cy.window().then((win) => {
        //     cy.checkLength('.window .title', 1)
        //     cy.checkLength('.window .content', 1)
        //     cy.checkLength('.window .footer > button.negativeBtn', 1)
        //     cy.checkLength('.window .footer > button.left-btn.deleteBtn', 1)
        //     // cy.get('.window .footer > button.left-btn.deleteBtn').click({force:true})
        // })
    })

    it('TC_BFSL_Watchlist_87:To validate that the deleted symbols not display under the watchlist', () => {
        // cy.get('.window .footer > button.left-btn.deleteBtn').click({ force: true })
        // cy.get('div.window').should('not.exist')

    })


    it('TC_BFSL_Watchlist_89:To validate that the user able to sort the symbols in Descending order by clicking the arrow up icon in the watchlist screen', () => {

        cy.get('.watchlistDiv').contains('PredNifty50').click({ force: true })
        // cy.wait(2000)
        cy.get('table > thead > tr > th.firstChild.width40 > span.sort-icon-container > span.bfsl-font.arrow-down.cursor.non-sort').click({ force: true })
        cy.get('table > thead > tr > th.firstChild.width40 > span.sort-icon-container > span.bfsl-font.arrow-down.cursor').not('.non-sort')

    })

    it('TC_BFSL_Watchlist_90:To validate that the user able to sort the symbols in descending order by clicking the arrow down icon in the watchlist screen', () => {

        cy.get('table > thead > tr > th.firstChild.width40 > span.sort-icon-container > span.bfsl-font.arrow-up.cursor.non-sort').click({ force: true })
        cy.get('table > thead > tr > th.firstChild.width40 > span.sort-icon-container > span.bfsl-font.arrow-up.cursor').not('.non-sort')

    })


    it('TC_BFSL_WEB_Watchlist_91-To verify,the user able to sort the LTP in ascending order by clicking  the arrow down icon    ', () => {
        cy.get('table > thead > tr > th:nth-child(3) > span.sort-icon-container > span.bfsl-font.arrow-down.cursor.non-sort').click({ force: true, multiple: true })
        cy.get('table > thead > tr > th:nth-child(3) > span.sort-icon-container > span.bfsl-font.arrow-down.cursor').not('.non-sort')
    })
    it('TC_BFSL_WEB_Watchlist_92-To verify,the user able to sort the LTP in descending order by clicking  the arrow up icon    ', () => {
        cy.get('table > thead > tr > th:nth-child(3) > span.sort-icon-container > span.bfsl-font.arrow-up.cursor.non-sort').click({ force: true, multiple: true })
        cy.get('table > thead > tr > th:nth-child(3) > span.sort-icon-container > span.bfsl-font.arrow-up.cursor').not('.non-sort')
    })
    it('TC_BFSL_WEB_Watchlist_93-To verify,the user able to sort the Chg.(%) in ascending order by clicking  the arrow down icon    ', () => {
        cy.get('table > thead > tr > th:nth-child(4) > span.sort-icon-container > span.bfsl-font.arrow-down.cursor.non-sort').click({ force: true, multiple: true })
        cy.get('table > thead > tr > th:nth-child(4) > span.sort-icon-container > span.bfsl-font.arrow-down.cursor').not('.non-sort')
    })
    it('TC_BFSL_WEB_Watchlist_94-To verify,the user able to sort the Chg.(%) in descending order by clicking  the arrow up icon    ', () => {
        cy.get('table > thead > tr > th:nth-child(4) > span.sort-icon-container > span.bfsl-font.arrow-up.cursor.non-sort').click({ force: true, multiple: true })
        cy.get('table > thead > tr > th:nth-child(4) > span.sort-icon-container > span.bfsl-font.arrow-up.cursor').not('.non-sort')
    })


    // it('TC_BFSL_Watchlist_91:To validate that the user able to sort the ltp in descending order by clicking the arrow up icon in the watchlist screen', () => {
    //     cy.sortAsc('div.watchlist-table  ', 3)

    // })



    // it('TC_BFSL_Watchlist_95:To validate that the user able to sort the change in Ascending order by clicking the arrow down icon in the watchlist screen', () => {

    //     cy.sortAsc('div.watchlist-table  ', 5)

    // })
    // it('TC_BFSL_Watchlist_96:To validate that the user able to sort the change in descending order by clicking the arrow down icon in the watchlist screen', () => {

    //     cy.sortDes('div.watchlist-table  ', 5)

    // })


    ////



    // it('TC_BFSL_Watchlist_97:To validate that the LTP value is streaming in the watchlist screen as per the current market value', () => {
    //     cy.wait(10000)
    //     cy.streaming('#watchlist-small-tbody > tr td:nth-child(3)')

    // })

    // it('TC_BFSL_Watchlist_98:To validate that the change value is streaming in the watchlist screen as per the current market value', () => {
    //     cy.streaming('#watchlist-small-tbody > tr td:nth-child(4)')

    // })
    // it('TC_BFSL_Watchlist_99:To validate that the change% value is streaming in the watchlist screen as per the current market value', () => {
    //     cy.streaming('#watchlist-small-tbody > tr td:nth-child(5)')

    // })

    // it('TC_BFSL_Watchlist_101:To validate that the streaming happens properly when user select other Watchlists group', () => {
    //     cy.get('div.select-input-div div.options-div').contains('Sample_BSE').click({ force: true })
    //     cy.streaming('#watchlist-small-tbody > tr td')
    //     cy.get('div.select-input-div div.options-div').contains('Sample_NSE').click({ force: true })
    //     cy.wait(1000)

    // })

    // it('TC_BFSL_Watchlist_102_103:To validate that the gaining stock streaming value is displayed in the green colour under the Watchlist', () => {
    //     var test
    //     cy.get('#watchlist-small-tbody > tr').eq(1).each(function ($row, index, $rows) {

    //         cy.wrap($row).within(function () {
    //             cy.get('td').eq(3).each(function ($celldata, index, $colum) {
    //                 test = $celldata.text()
    //                 cy.log(test)
    //                 if (test.charAt(0) === "-") {
    //                     cy.get('td').eq(3).should('have.class', 'negativeColor')
    //                 }
    //                 else if (test === 0) {
    //                     cy.get('td').eq(3).should('have.class', 'whiteColor')
    //                 }
    //                 else {
    //                     cy.get('td').eq(3).should('have.class', 'positiveColor')


    //                 }

    //             })
    //         })
    //     })
    // })

    // it('TC_BFSL_Watchlist_111:To validate that the streaming resumes after the screen navigation', () => {

    //     cy.streaming('#watchlist-small-tbody > tr td')
    //     cy.get('button.buy-btn').click({ force: true })
    //     cy.wait(100)
    //     cy.closeOrderpad()
    //     cy.streaming('#watchlist-small-tbody > tr td')

    // })


    // it('TC_BFSL_Watchlist_112:To validate that the streaming resume properly after the symbols click', () => {
    //     cy.get('#watchlist-small-tbody > tr').contains('TCS').click({ force: true })
    //     cy.streaming('div.marketDepth-table-div > div.table-body.scrollArea.scroller_firefox > div')
    //     cy.get('[test_id="menu_WATCHLIST"]').click()
    //     cy.wait(1000)

    // })


    // // // // //

    // it('TC_BFSL_Watchlist_113:To validate that the right click on the symbol displays the quick button   ', () => {
    //     cy.get('#watchlist-small-tbody > tr.selected > td.firstChild.width40').rightclick()
    //     cy.isVisible('div.context-menu-base')
    // })

    // it('TC_BFSL_Watchlist_114:To validate the availability of fields in the quick button popup', () => {

    //     cy.quickWindowsmall()
    // })

    // it('TC_BFSL_Watchlist_115:To validate the scroll view in the Watchlist screen ', () => {

    //     cy.get('div.symbol-search-div.flex-center > div > div > input.input-ele ').click()
    //     // cy.get('div.header > div.assetMenu.flex-center.cursor:nth-child(2)').click()
    //     cy.wait(10)
    //     cy.searchSymbol('USD')
    //     cy.wait(1000)
    //     // cy.wait(1000)
    //     cy.get('div.dropdown-div > div.body > div.searchResutDiv').should('have.class', 'scrollArea')
    //     cy.closeIcon()

    // })



        
    it('TC_BFSL_Watchlist_116:To validate that the click on the symbol in the watchlist view displays the corresponding quote details in the right pane', () => {
        cy.get('.watchlist-table tbody > tr:nth-child(1) > td.firstChild.width40 div.primary div.baseSym').click({ force: true })
        cy.isVisible('.quote-view ')
    })

    it('TC_BFSL_WEB_Watchlist_117:To verify,the click on Buy action redirect the user to the Trade screen    ', () => {
        cy.wait(5000)
        cy.isVisible('.watchlistDiv span.watchGroup.flex-center')
        cy.get('.watchlistDiv span.watchGroup.flex-center:nth-child(2)').click({ force: true }) 
        cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.buy-btn2').click({ force: true })
        cy.isVisible('.orderPadBase')


    })
    it('TC_BFSL_WEB_Watchlist_118:To verify,the click on Sell action redirect the user to the Trade screen    ', () => {
        cy.wait(5000)
        cy.isVisible('.watchlistDiv span.watchGroup.flex-center')
        cy.get('.watchlistDiv span.watchGroup.flex-center:nth-child(2)').click({ force: true }) 
        cy.get('.tbody-scroller').click(-20, -20, { force: true, multiple: true });
        cy.get('.watchlist-table tbody > tr:nth-child(1) td:nth-child(5) button.sell-btn2').click({ force: true })
        cy.isVisible('.orderPadBase')


    })
    // it('TC_BFSL_Watchlist_119:To validate that the click on Stock report button in the quotes view redirect to the stock report screen', () => {
    //     cy.get('.button-div button.stock_report_btn.flex-center').click({ force: true })
    //     cy.get('div.quoteDetails-div.withBorder > span.bfsl-font.minimizeIcon.undefined').click({ force: true })
    // })
    ///ltp

    // it('TC_BFSL_Watchlist_120:To validate that the LTP value is streaming in the quotes minimized view screen as per the current market value', () => {

    //     cy.get('div.reportBase-div.withBorder div.details div.top div.streamingBG.primary-ltp').then(($val) => {
    //         // store the text
    //         const txt = $val.text()
    //         cy.wait(10000)
    //         cy.get('div.reportBase-div.withBorder div.details div.top div.streamingBG.primary-ltp').then(($val2) => {
    //             expect($val2.text()).not.to.eq(txt)
    //         })

    //     })
    // })

    // it('TC_BFSL_Watchlist_121_122:To validate that the Change value is streaming in the quotes minimized view screen as per the current market value', () => {
    //     cy.get('div.reportBase-div.withBorder div.details div.bottom div.change_changePer span.data').then(($val) => {
    //         // store the button's text
    //         const txt = $val.text()
    //         cy.wait(1000)
    //         cy.get('div.reportBase-div.withBorder div.details div.bottom div.change_changePer span.data').then(($val2) => {
    //             expect($val2.text()).not.to.eq(txt)
    //         })

    //     })
    // })

    // it('TC_BFSL_Watchlist_124&125:To validate that the gaining/losing stock streaming value is displayed in the green/red color under the quotes minimized view', () => {

    //     cy.get('div.reportBase-div.withBorder div.details div.bottom div.change_changePer').then(($val) => {
    //         // store the button's text

    //         const txt = $val.text()
    //         const t1 = txt.substring(1, 5);
    //         cy.log(t1)
    //         cy.wait(10000)

    //         if (t1.charAt(0) === "-") {
    //             cy.log('neg')

    //             cy.get('div.reportBase-div.withBorder div.details div.bottom div.change_changePer').should('have.class', 'negativeColor')

    //         }
    //         else if (t1.charAt(0) === 0) {
    //             cy.get('div.reportBase-div.withBorder div.details div.bottom div.change_changePer').should('have.class', 'whiteColor')
    //         }
    //         else {
    //             cy.get('div.reportBase-div.withBorder div.details div.bottom div.change_changePer').should('have.class', 'positiveColor')

    //         }

    //     })




    // })



    // it('TC_BFSL_Quotes_134:To validate that the Open value is displayed as per the Market opened value', () => {
    //     cy.get('div.quoteDetails-div div:nth-child(1) > div:nth-child(1) > span.data').then(($val) => {
    //         expect($val).not.to.be.empty
    //     })
    // })
    // it('TC_BFSL_Quotes_135:To validate that the Close value is displayed as per the Previous day Market close value', () => {
    //     cy.get('div.quoteDetails-div.withBorder > div:nth-child(1) > div:nth-child(2) > span.data').then(($val) => {
    //         expect($val).not.to.be.empty
    //     })
    // })
    // it('TC_BFSL_Quotes_136:To validate that the high value is streaming in the quotes full view screen as per the current market value', () => {
    //     cy.get('div.quoteDetails-div.withBorder > div:nth-child(2) > div:nth-child(1) > span.data').then(($val) => {
    //         expect($val).not.to.be.empty
    //     })
    // })
    // it('TC_BFSL_Quotes_137:To validate that the  low value is streaming in the quotes full view screen as per the current market value', () => {
    //     cy.get('div.quoteDetails-div.withBorder > div:nth-child(2) > div:nth-child(2) > span.data').then(($val) => {
    //         expect($val).not.to.be.empty
    //     })
    // })
    // it('TC_BFSL_Quotes_138: To validate that the Upper CKT value is streaming in the quotes full view screen as per the current market value', () => {
    //     cy.get('div.quoteDetails-div.withBorder > div:nth-child(3) > div:nth-child(1) > span.data').then(($val) => {
    //         expect($val).not.to.be.empty
    //     })
    // })
    // it('TC_BFSL_Quotes_139:To validate that the lower CKT value is streaming in the quotes full view screen as per the current market value', () => {
    //     cy.get('div.quoteDetails-div.withBorder > div:nth-child(3) > div:nth-child(2) > span.data').then(($val) => {
    //         expect($val).not.to.be.empty
    //     })
    // })
    // it('TC_BFSL_Quotes_140:To validate that the Volume value is streaming in the quotes full view screen as per the current market value', () => {
    //     cy.get('div.quoteDetails-div.withBorder > div:nth-child(4) > div:nth-child(1) > span.data').then(($val) => {
    //         expect($val).not.to.be.empty
    //     })
    // })
    // it('TC_BFSL_Quotes_141:To validate that the ATP value is streaming in the quotes full view screen as per the current market value', () => {
    //     cy.get('div.quoteDetails-div.withBorder > div:nth-child(4) > div:nth-child(2) > span.data').then(($val) => {
    //         expect($val).not.to.be.empty
    //     })
    // })
    // it('TC_BFSL_Quotes_142:To validate that the 52WKH value is streaming in the quotes full view screen as per the current market value', () => {
    //     cy.get('div.quoteDetails-div.withBorder > div:nth-child(5) > div:nth-child(1) > span.data').then(($val) => {
    //         expect($val).not.to.be.empty
    //     })
    // })
    // it('TC_BFSL_Quotes_143:To validate that the  52WKL value is streaming in the quotes full view screen as per the current market value', () => {
    //     cy.get('div.quoteDetails-div.withBorder > div:nth-child(5) > div:nth-child(2) > span.data').then(($val) => {
    //         expect($val).not.to.be.empty
    //     })
    // })
    // it('TC_BFSL_Quotes_144:To validate that the OI   value is streaming in the quotes full view screen as per the current market value', () => {
    //     cy.get('div.quoteDetails-div.withBorder > div:nth-child(6) > div:nth-child(1) > span.data').then(($val) => {
    //         expect($val).not.to.be.empty
    //     })
    // })
    // it('TC_BFSL_Quotes_145:To validate that the OICHG % value is streaming in the quotes full view screen as per the current market value', () => {
    //     cy.get('div.quoteDetails-div.withBorder > div:nth-child(6) > div:nth-child(2) > span.data').then(($val) => {
    //         expect($val).not.to.be.empty
    //     })
    // })


    // it('TC_BFSL_Watchlist_146:To validate that the QTy value is streaming in the watchlist screen as per the current market value', () => {
    //     cy.streaming('.marketDepth-table-div > div.table-body.scrollArea.scroller_firefox span.positiveColor.text-nowrap.alignLeft')
    // })

    // it('TC_BFSL_Watchlist_147:To validate that the ORD value is streaming in the watchlist screen as per the current market value', () => {
    //     cy.streaming('div.marketDepth-table-div > div.table-body.scrollArea.scroller_firefox span.positiveColor.text-nowrap.alignCenter')
    // })
    // it('TC_BFSL_Watchlist_148:To validate that the BID value is streaming in the watchlist screen as per the current market value', () => {
    //     cy.streaming('div.marketDepth-table-div > div.table-body.scrollArea.scroller_firefox span.middle')
    // })

    // it('TC_BFSL_Watchlist_149:To validate that the ASK value is streaming in the watchlist screen as per the current market value', () => {
    //     cy.streaming('div.marketDepth-table-div > div.table-body.scrollArea.scroller_firefox span.negativeColor.text-nowrap.alignLeft > span.valueSpan:nth-child(1)')
    // })

    // it('TC_BFSL_Watchlist_150:To validate that the ORD value is streaming in the watchlist screen as per the current market value', () => {
    //     cy.streaming('div.marketDepth-table-div > div.table-body.scrollArea.scroller_firefox span.negativeColor.text-nowrap.alignCenter')
    // })

    // it('TC_BFSL_Watchlist_151:To validate that the QTY value is streaming in the watchlist screen as per the current market value', () => {
    //     cy.streaming('div.marketDepth-table-div > div.table-body.scrollArea.scroller_firefox span.negativeColor.text-nowrap.alignLeft > span.valueSpan:nth-child(1)')

    // })
    // it('TC_BFSL_Watchlist_152:To validate that the total buy qty value is streaming in the watchlist screen as per the current market value', () => {
    //     cy.streaming('div.footer > div:nth-child(1) > span.value.alignLeft > span.valueSpan')

    // })
    // it('TC_BFSL_Watchlist_153:To validate that the total sell qty value is streaming in the watchlist screen as per the current market value', () => {
    //     cy.streaming('div.footer > div:nth-child(2) > span.value.alignRight > span.valueSpan')
    // })


    // it('TC_BFSL_Watchlist_154:To validate that the Chart tab in the quotes view', () => {
    //     cy.get('div.chartWidget-base.withBorder.chartMenu').contains('CHART').click({ force: true })
    //     cy.isVisible('div.chartWidget-base.withBorder.chartMenu > div.widget-loader-div > div.chartWidget')
    // })

    // it('TC_BFSL_Quotes_155:To validate the availability of field in the Chart tab in the quotes full view screen    ', () => {

    //     cy.get('#chart_iframe')
    //         .iframe('body #ranges #1_day')
    //         .should('exist')
    //     cy.get('#chart_iframe')
    //         .iframe('body #ranges #5_day')
    //         .should('exist')
    //     cy.get('#chart_iframe')
    //         .iframe('body #ranges #1_month')
    //         .should('exist')
    //     cy.get('#chart_iframe')
    //         .iframe('body #ranges #1_year')
    //         .should('exist')
    //     cy.get('#chart_iframe')
    //         .iframe('body #ranges #5_year')
    //         .should('exist')
    //     cy.get('#chart_iframe')
    //         .iframe('body .ciq-menu.ciq-period')
    //         .should('exist')

    // })

    // it('TC_BFSL_Watchlist_156:To validate that the Future tab in the quotes view', () => {
    //     cy.get('div.chartWidget-base.withBorder.chartMenu').contains('FUTURE').click({ force: true })
    //     cy.isVisible('.futureChain-base')

    // })
    // it('TC_BFSL_Watchlist_157:To validate that the options tab in the quotes view', () => {
    //     cy.get('div.chartWidget-base.withBorder.nonChartMenu').contains('OPTIONS').click({ force: true })

    // })

    // it('TC_BFSL_Watchlist_158:To validate that the news tab in the quotes view', () => {
    //     cy.get('div.chartWidget-base.withBorder.nonChartMenu').contains('NEWS').click({ force: true })

    // })
    // it('TC_BFSL_Watchlist_159:To validate that the Finacial tab in the quotes view', () => {
    //     cy.get('div.chartWidget-base.withBorder.nonChartMenu').contains('FINANCIALS').click({ force: true })

    // })

    // it('TC_BFSL_Watchlist_160:To validate that the company information tab in the quotes view', () => {
    //     cy.get('div.chartWidget-base.withBorder.nonChartMenu').contains('COMPANY INFORMATION').click({ force: true })

    // })
    // it('TC_BFSL_Watchlist_161:To validate that the Market depth details are displayed under the Quotes Minimized view', () => {
    //     cy.isVisible('.marketDepth-div.withBorder')

    // })

    // it('TC_BFSL_Watchlist_162:To validate that the click on expanded view icon in the quotes Minimized view redirect the user to Quotes Full screen', () => {
    //     cy.get('.right .maximizeIcon').click({ force: true })
    //     cy.url().should('contain', '/home/quote')

    // })




    // it('TC_BFSL_Watchlist_163:To validate that the click on expanded view icon in the watchlist view', () => {
    //     cy.navigateWatchlist()
    //     cy.get('div.left > div > div > div.widget-header > span.bfsl-font.maximizeIcon').click({ force: true })
    //     cy.isVisible('.large-watchlist-table')
    // })

    // it('TC_BFSL_Watchlist_164:To validate the availability of fields in the watchlist expanded view  ', () => {
    //     cy.checkText('div.largeTable ', 'LTP')
    //     cy.checkText('div.largeTable ', 'CHG')
    //     cy.checkText('div.largeTable ', 'CHG %')
    //     cy.isVisible('.buy-btn')
    //     cy.isVisible('.sell-btn')
    //     cy.isVisible('.arrow-down')
    //     cy.isVisible('.arrow-up')
    // })


    // it('TC_BFSL_Watchlist_169:To validate that the click on Buy button in the watchlist expanded view redirect the user to the Trade Buy screen', () => {

    //     cy.get('#watchlist-large-tbody > tr:nth-child(1) button.buy-btn').click()
    //     cy.isVisible(' div.app-modalDialog2.orderPad-dialog')
    //     cy.closeOrderpad()

    // })


    // it('TC_BFSL_Watchlist_170:To validate that the click on sell button in the watchlist expanded view redirect the user to the Trade Buy screen', () => {

    //     cy.get('#watchlist-large-tbody > tr:nth-child(1) button.sell-btn').click()
    //     cy.isVisible(' div.app-modalDialog2.orderPad-dialog')
    //     cy.closeOrderpad()

    // })

    // it('TC_BFSL_Watchlist_171:To validate that the user able to sort the symbols in ascending order by clicking the arrow up icon in the watchlist screen', () => {
    //     cy.navigateWatchlist('_NSE')

    //     cy.get('div.watchlist-table.large-watchlist-table > div.symName-table > table > thead > tr > th.firstChild .arrow-up.cursor.non-sort').click({ force: true })
    //     cy.get('  div.watchlist-table.large-watchlist-table > div.symName-table > table > thead > tr > th.firstChild .arrow-up.cursor').not('.non-sort')

    // })
    // it('TC_BFSL_Watchlist_172:To validate that the user able to sort the symbols in descending order by clicking the arrow down icon in the watchlist screen', () => {

    //     cy.get('div.watchlist-table.large-watchlist-table > div.symName-table > table > thead > tr > th.firstChild .arrow-down.cursor.non-sort').click({ force: true })
    //     cy.get('div.watchlist-table.large-watchlist-table > div.symName-table > table > thead > tr > th.firstChild .arrow-down.cursor').not('.non-sort')

    // })
    // it('TC_BFSL_Watchlist_173:To validate that the user able to sort the ltp in Ascending order by clicking the arrow up icon in the watchlist screen', () => {
    //     cy.sortAsc('div.watchlist-table.large-watchlist-table > div.data-table.scrollArea-x > div > ', 2)
    // })
    // it('TC_BFSL_Watchlist_174:To validate that the user able to sort the ltp in descending order by clicking the arrow down icon in the watchlist screen', () => {
    //     cy.sortDes('div.watchlist-table.large-watchlist-table > div.data-table.scrollArea-x > div > ', 2)

    // })

    // it('TC_BFSL_Watchlist_175:To validate that the user able to sort the change % in Ascending order by clicking the arrow down icon in the watchlist screen', () => {

    //     cy.sortAsc('div.watchlist-table.large-watchlist-table > div.data-table.scrollArea-x > div > ', 3)

    // })
    // it('TC_BFSL_Watchlist_176:To validate that the user able to sort the change % in descending order by clicking the arrow down icon in the watchlist screen', () => {

    //     cy.sortDes('div.watchlist-table.large-watchlist-table > div.data-table.scrollArea-x > div > ', 3)

    // })

    // it('TC_BFSL_Watchlist_177:To validate that the user able to sort the change in Ascending order by clicking the arrow down icon in the watchlist screen', () => {

    //     cy.sortAsc('div.watchlist-table.large-watchlist-table > div.data-table.scrollArea-x > div > ', 4)

    // })
    // it('TC_BFSL_Watchlist_178:To validate that the user able to sort the change in descending order by clicking the arrow down icon in the watchlist screen', () => {

    //     cy.sortDes('div.watchlist-table.large-watchlist-table > div.data-table.scrollArea-x > div > ', 4)

    // })
    // it('TC_BFSL_Watchlist_179:To validate that the user able to sort the open in Ascending order by clicking the arrow down icon in the watchlist screen', () => {

    //     cy.sortAsc('div.watchlist-table.large-watchlist-table > div.data-table.scrollArea-x > div > ', 5)

    // })
    // it('TC_BFSL_Watchlist_180:To validate that the user able to sort the open in descending order by clicking the arrow down icon in the watchlist screen', () => {

    //     cy.sortDes('div.watchlist-table.large-watchlist-table > div.data-table.scrollArea-x > div > ', 5)

    // })
    // it('TC_BFSL_Watchlist_181:To validate that the user able to sort the close in descending order by clicking the arrow down icon in the watchlist screen', () => {

    //     cy.sortAsc('div.watchlist-table.large-watchlist-table > div.data-table.scrollArea-x > div > ', 6)

    // })
    // it('TC_BFSL_Watchlist_182:To validate that the user able to sort the close in descending order by clicking the arrow down icon in the watchlist screen', () => {

    //     cy.sortDes('div.watchlist-table.large-watchlist-table > div.data-table.scrollArea-x > div > ', 6)

    // })


    // it('TC_BFSL_Watchlist_183:To validate that the user able to sort the high in Ascending order by clicking the arrow down icon in the watchlist screen', () => {

    //     cy.sortAsc('div.watchlist-table.large-watchlist-table > div.data-table.scrollArea-x > div > ', 7)

    // })

    // it('TC_BFSL_Watchlist_184:To validate that the user able to sort the low in ascending order by clicking the arrow down icon in the watchlist screen', () => {
    //     cy.sortDes('div.watchlist-table.large-watchlist-table > div.data-table.scrollArea-x > div > ', 7)

    // })

    // it('TC_BFSL_Watchlist_185:To validate that the user able to sort the low in descending order by clicking the arrow down icon in the watchlist screen', () => {

    //     cy.sortAsc('div.watchlist-table.large-watchlist-table > div.data-table.scrollArea-x > div > ', 8)
    // })

    // it('TC_BFSL_Watchlist_186:To validate that the user able to sort the low in descending order by clicking the arrow down icon in the watchlist screen', () => {
    //     cy.sortDes('div.watchlist-table.large-watchlist-table > div.data-table.scrollArea-x > div > ', 8)

    // })
    // it('TC_BFSL_Watchlist_187:To validate that the user able to sort the ltq in Ascending order by clicking the arrow down icon in the watchlist screen', () => {

    //     cy.sortAsc('div.watchlist-table.large-watchlist-table > div.data-table.scrollArea-x > div > ', 9)
    // })
    // it('TC_BFSL_Watchlist_188:To validate that the user able to sort the ltq in descending order by clicking the arrow down icon in the watchlist screen', () => {

    //     cy.sortDes('div.watchlist-table.large-watchlist-table > div.data-table.scrollArea-x > div > ', 9)

    // })
    // // it('TC_BFSL_Watchlist_202:To validate that the user able to sort the OI in Ascending order by clicking the arrow down icon in the watchlist screen', () => {

    // //     cy.sortAsc('div.watchlist-table.large-watchlist-table > div.data-table.scrollArea-x > div > ', 10)
    // // })
    // // it('TC_BFSL_Watchlist_203:To validate that the user able to sort the OT in descending order by clicking the arrow down icon in the watchlist screen', () => {

    // //     cy.sortDes('div.watchlist-table.large-watchlist-table > div.data-table.scrollArea-x > div > ', 10)

    // // })

    // // it('TC_BFSL_Watchlist_204:To validate that the user able to sort the OI chg% in Ascending order by clicking the arrow down icon in the watchlist screen', () => {

    // //     cy.sortAsc('div.watchlist-table.large-watchlist-table > div.data-table.scrollArea-x > div > ', 11)
    // // })
    // // it('TC_BFSL_Watchlist_205:To validate that the user able to sort the OI chg% in descending order by clicking the arrow down icon in the watchlist screen', () => {

    // //     cy.sortDes('div.watchlist-table.large-watchlist-table > div.data-table.scrollArea-x > div > ', 11)

    // // })
    // it('TC_BFSL_Watchlist_193:To validate that the ltp value is streaming in the watchlist screen as per the current market value', () => {
    //     cy.streaming('#watchlist-large-tbody > tr td:nth-child(2)')

    // })

    // it('TC_BFSL_Watchlist_194:To validate that the change value is streaming in the watchlist screen as per the current market value', () => {
    //     cy.streaming('#watchlist-large-tbody > tr td:nth-child(3)')

    // })

    // it('TC_BFSL_Watchlist_195:To validate that the change% value is streaming in the watchlist screen as per the current market value', () => {
    //     cy.streaming('#watchlist-large-tbody > tr td:nth-child(4)')

    // })

    // it('TC_BFSL_Watchlist_196:To validate that the open value is streaming in the watchlist screen as per the current market value', () => {
    //     cy.streaming('#watchlist-large-tbody > tr td:nth-child(5)')

    // })

    // it('TC_BFSL_Watchlist_197:To validate that the close value is streaming in the watchlist screen as per the current market value', () => {
    //     cy.streaming('#watchlist-large-tbody > tr td:nth-child(6)')

    // })
    // it('TC_BFSL_Watchlist_198:To validate that the High value is streaming in the watchlist expanded view as per the current market value', () => {
    //     cy.streaming('#watchlist-large-tbody > tr td:nth-child(7)')

    // })

    // it('TC_BFSL_Watchlist_199:To validate that the Low value is streaming in the watchlist expanded view as per the current market value', () => {
    //     cy.streaming('#watchlist-large-tbody > tr td:nth-child(8)')

    // })
    // it('TC_BFSL_Watchlist_200:To validate that the ltq value is streaming in the watchlist screen as per the current market value', () => {
    //     cy.streaming('#watchlist-large-tbody > tr td:nth-child(9)')

    // })

    // // it('TC_BFSL_Watchlist_214:To validate that the OI value is streaming in the watchlist screen as per the current market value', () => {
    // //     cy.wait(25000)
    // //     cy.streaming('#watchlist-large-tbody > tr td:nth-child(10)')

    // // })

    // // it('TC_BFSL_Watchlist_215:To validate that the OI chg% value is streaming in the watchlist screen as per the current market value', () => {
    // //     cy.wait(25000)
    // //     cy.streaming('#watchlist-large-tbody > tr td:nth-child(11)')

    // // })

    // it('TC_BFSL_Watchlist_206 & 207:To validate that the gaining stock streaming value is displayed in the green colour under the Watchlist', () => {
    //     var test
    //     cy.get('#watchlist-large-tbody > tr').eq(2).each(function ($row, index, $rows) {
    //         cy.wrap($row).within(function () {
    //             cy.get('td').eq(3).each(function ($celldata, index, $colum) {
    //                 test = $celldata.text()
    //                 cy.log(test)
    //                 if (test.charAt(0) === "-") {
    //                     cy.get('td').eq(3).should('have.class', 'negativeColor')

    //                 }
    //                 else if (test.charAt(0) === 0) {
    //                     cy.get('td').eq(3).should('have.class', 'whiteColor')
    //                 }
    //                 else {
    //                     cy.get('td').eq(3).should('have.class', 'positiveColor')

    //                 }

    //             })
    //         })
    //     })
    // })



    // it('TC_BFSL_Watchlist_215:To validate that the click on watchlist tab shows the filter icon', () => {
    //     cy.checkLength('.bfsl-font.filterIcon', '1')

    // })

    // it('TC_BFSL_Watchlist_216:To validate that the click on filter icon displays the organise columns popup', () => {
    //     cy.get('.large-widget .bfsl-font.filterIcon').click()
    //     cy.isVisible('div.app-modalDialog2.organise-columns-dialog')

    // })

    // it('TC_BFSL_Watchlist_217:To validate the availablity of the field in the organise columns popup', () => {
    //     cy.fliterWindow()

    // })

    // it('TC_BFSL_Watchlist_218:To validate the "cancel" option in the organise columns popup', () => {
    //     cy.cancelPopup()
    //     cy.get('div.app-modalDialog2.organise-columns-dialog').should('not.exist')

    // })

    // it('TC_BFSL_Watchlist_219:To validate the "click outside the Popup" in the organise columns popup', () => {
    //     cy.get('.large-widget .bfsl-font.filterIcon').click()
    //     cy.get('div.app-modalDialog2.organise-columns-dialog').click(-20, -20, { force: true });
    //     cy.get('div.app-modalDialog2.organise-columns-dialog').should('not.exist')

    // })

    // it('TC_BFSL_Watchlist_220:To validate that the user able to select the checkbox', () => {
    //     cy.get('.large-widget .bfsl-font.filterIcon.cursor').click()
    //     cy.get('.app-modalDialog2.organise-columns-dialog div.content.scrollArea > div:nth-child(1)').click()
    // })

    // it('TC_BFSL_Watchlist_221&222:To validate that the user able to select all the checkbox in the organise columns popup', () => {
    //     for (var i = 2; i <= 11; i++) {
    //         cy.get('.app-modalDialog2.organise-columns-dialog div.content.scrollArea > div:nth-child(' + i + ')').click()

    //     }


    // })
    // it('TC_BFSL_Watchlist_223:To validate that the user able to de-select the checkbox', () => {
    //     cy.get('.app-modalDialog2.organise-columns-dialog div.content.scrollArea > div:nth-child(1)').click()

    // })

    // it('TC_BFSL_Watchlist_224&225 :To validate that the user able to de-select all the checkbox in the organise columns popup    ', () => {
    //     for (var i = 2; i <= 9; i++) {
    //         cy.get('.app-modalDialog2.organise-columns-dialog div.content.scrollArea > div:nth-child(' + i + ')').click()
    //     }

    // })

    // it('TC_BFSL_Watchlist_226:To validate that the selected column is displayed under the watchlist', () => {
    //     cy.get('div.app-modalDialog2.organise-columns-dialog div.footer > button.left-btn.positiveBtn').click()

    //     cy.get('.watchlist-table.large-watchlist-table div.data-table.scrollArea-x table > thead').contains('LTP')

    // })

    // it('TC_BFSL_Watchlist_227:To validate that the de-selection of all the checkboxs show the default organise columns in the watchlist', () => {
    //     cy.get('.large-widget .bfsl-font.filterIcon.cursor').click()

    //     for (var i = 1; i <= 11; i++) {
    //         cy.get('.app-modalDialog2.organise-columns-dialog div.content.scrollArea > div:nth-child(' + i + ')').click()
    //     }
    //     cy.get('div.app-modalDialog2.organise-columns-dialog div.footer > button.left-btn.positiveBtn').click()
    //     cy.checkText('div.largeTable ', 'LTP')
    //     cy.checkText('div.largeTable ', 'CHG')
    //     cy.checkText('div.largeTable ', 'CHG %')
    // })

    // it('TC_BFSL_Watchlist_229:To validate that the right click on the symbol displays the quick button', () => {
    //     cy.get('#watchlist-small-tbody > tr.selected > td.firstChild.width40').rightclick()
    //     cy.isVisible('div.context-menu-base')

    // })

    // it('TC_BFSL_Watchlist_230:To validate the availability of fields in the quick button popup', () => {
    //     cy.quickWindowlarge()
    // })

    // it('TC_BFSL_Watchlist_231:To validate that the user not able to delete the predefined Watchlist', () => {
    //     cy.clickDownarrow()
    //     cy.isHidden('.large-widget span:nth-child(1) > span.innerAction-btn')
    //     cy.isHidden('.large-widget span:nth-child(2) > span.innerAction-btn')

    // })

    // // it('TC_BFSL_Watchlist_245:To validate that the user not able to delete  the predefined Watchlist symbols', () => {
    // //     cy.get('.select-input-div.non-symbolSearch div.options-div-base > div.options-div').contains('Sample_BSE').click({ force: true })
    // //     cy.get('div.widget-header .bfsl-font.deleteIcon.cursor').should('have.class', 'not-editable')
    // //     cy.changeGroup('Test1')
    // // })

    // it('TC_BFSL_Watchlist_232:To validate that the user not able to add new symbols to the  predefined Watchlist ', () => {
    //     cy.clickSearch()
    //     cy.searchSymbol('TCS')
    //     cy.wait(2000)
    //     cy.watchlistDropdown()
    //     cy.get('div.dropdown-div > div.footer div.options-div').should('not.to.contain', 'Sample_BSE')
    //     cy.get('div.dropdown-div > div.footer div.options-div').should('not.to.contain', 'Sample_NSE')
    //     cy.closeIcon()
    // })
    // it('TC_BFSL_Watchlist_233:To validate that the click on Watchlist dropdown displays the Watchlist groups for the New user logging the application for the first time ', () => {
    //     cy.clickDownarrow()
    //     cy.checkLength('[test_id="addWatchlist_option"]', 1)

    // })
    // it('TC_BFSL_Watchlist_234 To validate that the click on Watchlist dropdown displays the available Watchlist and add Watchlist option', () => {

    //     cy.window().then((win) => {
    //         cy.contains('Sample_BSE')
    //         cy.contains('Sample_NSE')
    //     })

    // })

    // it('TC_BFSL_Watchlist_235:To validate that the click on add Watchlist option displays the Add New Watchlist popup    ', () => {
    //     cy.get('[test_id="addWatchlist_option"]').click()

    //     cy.isVisible('.addWatchGroup-dialog')
    // })

    // it('TC_BFSL_Watchlist_236:To validate the availability of fields in the Add New Watchlist popup', () => {
    //     cy.window().then((win) => {
    //         cy.checkLength('.addWatchGroup-dialog .content', 1)
    //         cy.checkLength('.addWatchGroup-dialog  .content .inputVal.watchList-name-div', 1)
    //         cy.get('.addWatchGroup-dialog .content').contains('Maximum 15 Characters')
    //         cy.checkLength('.addWatchGroup-dialog .footer > button.negativeBtn', 1)
    //         cy.checkLength('.addWatchGroup-dialog .footer .positiveBtn', 1)
    //     })
    // })

    // it('TC_BFSL_Watchlist_237:To validate the "cancel" option in the Add New Watchlist popup', () => {
    //     cy.cancelPopup()
    //     cy.get('.app-modalDialog2.addWatchGroup-dialog').should('not.exist')
    // })

    // it('TC_BFSL_Watchlist_238:To validate the click outside of the popup closes the Add new Watchlist popup', () => {
    //     cy.addWatchlist()
    //     cy.get('.app-modalDialog2.addWatchGroup-dialog').click(-20, -20, { force: true });
    //     cy.get('.app-modalDialog2.addWatchGroup-dialog').should('not.exist')
    // })

    // it('TC_BFSL_Watchlist_239:To validate the save dield by providing the input as empty', () => {
    //     cy.addWatchlist()
    //     cy.get('.window .footer .positiveBtn').should('be.disabled')
    // })

    // it('TC_BFSL_Watchlist_240 :To validate the field "Enter Watchlist name" by providing the input as special characters', () => {
    //     cy.inputWatchlistname('@#$%^')
    //     cy.get('.window  .content .inputVal.watchList-name-input').should('have.value', '')
    // })

    // it('TC_BFSL_Watchlist_241 :To validate the field "Enter Watchlist name" by providing the input as space', () => {
    //     cy.inputWatchlistname(' ')
    //     cy.get('.window .footer .positiveBtn').should('be.disabled')

    // })

    // it('TC_BFSL_Watchlist_242:To validate the field "Enter Watchlist name" by providing the input as Alphabets', () => {
    //     cy.inputWatchlistname('demo account')
    //     cy.get('.window  .content .inputVal.watchList-name-input').should('have.value', ' demo account')
    // })

    // it('TC_BFSL_Watchlist_244:To validate the field "Enter Watchlist name" by providing the input as Alphabets', () => {
    //     cy.addWatchlist()
    //     cy.inputWatchlistname('watchlist')
    //     cy.get('.window .footer .positiveBtn').click({ force: true })
    //     cy.get('input.input-ele').should('have.focus')
    //     cy.closeIcon()
    // })

    // it('TC_BFSL_Watchlist_245 :To validate the field "Enter Watchlist name" by providing the input as numeric', () => {
    //     cy.addWatchlist()
    //     cy.inputWatchlistname('123456')
    //     cy.get('.window .footer .positiveBtn').click()
    //     cy.get('input.input-ele').should('have.focus')
    //     cy.closeIcon()
    // })

    // it('TC_BFSL_Watchlist_246 :To validate the field "Enter Watchlist name" by providing the input as Alphanumeric', () => {
    //     cy.addWatchlist()
    //     cy.inputWatchlistname('abcd123')
    //     cy.get('.window .footer .positiveBtn').click({ force: true })
    //     cy.get('input.input-ele').should('have.focus')
    //     cy.closeIcon()
    // })

    // it('TC_BFSL_Watchlist_247:To validate the field "Enter Watchlist name" by providing the input as Alphanumeric with special character', () => {
    //     cy.addWatchlist()
    //     cy.inputWatchlistname('abcd@123')
    //     cy.get('.window  .content .inputVal.watchList-name-input').should('have.value', 'abcd123')
    //     cy.cancelPopup()

    // })

    // it('TC_BFSL_Watchlist_261:To validate that the user able to create the Watchlist with the existing Watchlist name', () => {
    //     cy.changeDefault()
    // })

    // it('TC_BFSL_Watchlist_262:To validate that the user not able to enter more that more than 15 characters in the enter Watchlist name', () => {
    //     cy.addWatchlist()
    //     cy.inputWatchlistname('Group1Group2group3group4group5')
    //     cy.get('.window  .content .inputVal.watchList-name-input').should('have.value', 'Group1Group2gro')
    //     cy.cancelPopup()


    // })

    // it('TC_BFSL_Watchlist_263:To validate that the click on cancel button in Add New Watchlist popup closes the add New watchlist popup', () => {
    //     cy.addWatchlist()
    //     cy.inputWatchlistname(WATCHLIST.NAME)
    //     cy.cancelPopup()
    //     cy.get('.app-modalDialog2.addWatchGroup-dialog').should('not.exist')
    // })

    // it('TC_BFSL_Watchlist_264:To validate that the click on save button in Add New Watchlist popup redirect the user to the search bar', () => {
    //     cy.addWatchlist()
    //     cy.inputWatchlistname(WATCHLIST.NAME)
    //     cy.get('.window .footer .positiveBtn').click({ force: true })
    //     cy.get('div.headerBase-div > div.symbol-search-div.flex-center > div > div > input.input-ele').should('have.focus')
    //     cy.closeIcon()
    // })

    // it('TC_BFSL_Watchlist_265:To validate the click outside of the popup closes the search popup', () => {
    //     cy.addWatchlist()
    //     cy.inputWatchlistname(WATCHLIST.NAME)
    //     cy.get('.window .footer .positiveBtn').click({ force: true })
    //     cy.get('div.loader').click(-20, -20, { force: true });
    // })

    // it('TC_BFSL_Watchlist_266:To validate that the searched symbol is displayed under the search result ', () => {
    //     cy.addWatchlist()
    //     cy.inputWatchlistname('Test2')
    //     cy.get('.window .footer .positiveBtn').click({ force: true })
    //     cy.searchSymbol('TCS')
    //     cy.wait(2000)
    //     cy.get(' div.searchResutDiv.scrollArea').contains('TCS')
    // })

    // it('TC_BFSL_Watchlist_267:To validate that the user able to add the searched symbol to the group by clicking on the Plus icon', () => {
    //     cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .addToWatchlist-btn').click()
    //     cy.wait(1000)
    //     cy.get(' div.dropdown-div > div.footer > div > button.save-btn').should('not.have.class', 'disable')

    // })

    // it('TC_BFSL_Watchlist_268:To validate that the selection of symbols in the search result displays the created Watchlist group with the save option', () => {
    //     cy.checkLength(' div.dropdown-div > div.footer > div.action-div', 1)
    //     cy.checkText('div.dropdown-div > div.footer span.newWatchlistName', 'Test2')

    // })

    // it('TC_BFSL_Watchlist_269:To validate that the click on save button in the search displays the Success popup', () => {
    //     cy.get(' div.dropdown-div > div.footer  button.save-btn').click({ force: true })

    //     if (Cypress.$('.window').length == 1) {

    //         cy.get('.window .content').contains('Group added successfully')
    //     }
    //     else {
    //         cy.closeIcon()
    //     }
    // })



    // it('TC_BFSL_Watchlist_270:To validate that the click on Ok button in the Success popup redirect closes the search popup', () => {
    //     if (Cypress.$('.window').length == 1) {

    //         cy.cancelPopup()
    //         cy.get('#modal-dialog > div.window').should('not.exist')

    //     }
    //     // cy.changeDefault()
    // })

    // // created group test

    // it('TC_BFSL_Watchlist_271:To validate that the created group is not getting saved without selecting the save option', () => {
    //     cy.addWatchlist()
    //     cy.inputWatchlistname('abcd')
    //     cy.get('.window .footer .positiveBtn').click({ force: true })
    //     cy.searchSymbol('TCS')
    //     cy.get('div:nth-child(1) > div.btn-div > button.addToWatchlist-btn').click({ force: true })
    //     cy.get('div.loader').click(-20, -20, { force: true });
    //     cy.clickDownarrow()
    //     cy.get('div.select-input-div div.options-div').should('not.to.contain', 'abcd')

    // })

    // // it('TC_BFSL_Watchlist_272:To validate that the user able to create only 10 Watchlists', () => {
    // //     cy.clickSearch()
    // //     cy.wait(500)
    // //     cy.closeIcon()
    // //     for (var i = 1; i <= 6; i++) {
    // //         cy.addWatchlist()
    // //         cy.inputWatchlistname(i)
    // //         cy.get('.window .footer .positiveBtn').click({ force: true })
    // //         cy.searchSymbol('TCS')
    // //         cy.wait(2000)
    // //         cy.get('div.searchResutDiv.scrollArea > div:nth-child(1) .addToWatchlist-btn').click()
    // //         cy.wait(1000)
    // //         cy.get(' div.dropdown-div > div.footer button.save-btn').click({ force: true })
    // //         cy.wait(1000)
    // //         if (Cypress.$('.window').length == 1) {

    // //             cy.cancelPopup()
    // //         }
    // //         else {
    // //             cy.closeIcon()
    // //         }
    // //         cy.wait(1000)
    // //     }
    // //     cy.deleteGroup()

    // // })


    // it('TC_BFSL_Watchlist_274:To validate that the click on search bar in the Watchlist screen displays the search popup and check that the user able to search for the symbols', () => {
    //     cy.get('.widget-header > div.icon-div > span.bfsl-font.searchIcon.cursor').click({ force: true })
    //     cy.searchSymbol('TCS')
    //     cy.wait(2000)
    //     cy.get(' div.searchResutDiv.scrollArea').contains('TCS')
    // }
    // )

    // it('TC_BFSL_Watchlist_275:To validate that the selection of symbol from the Search result shows the watchlist dropdown with the symbol count', () => {
    //     cy.wait(500)
    //     cy.get('div:nth-child(1) > div.btn-div > button.addToWatchlist-btn').click({ force: true })

    //     cy.checkLength(' div.symbol-search-div > div > div.dropdown-div > div.footer .select-input-div', 1)
    //     cy.checkLength('div.dropdown-div > div.footer span.selctedCount', 1)
    // })

    // it('TC_BFSL_Watchlist_276:To validate that the deselection of symbol from the Search result shows the watchlist dropdown with the symbol count', () => {
    //     cy.get('div:nth-child(1) > div.btn-div > button.addToWatchlist-btn').click()

    //     cy.checkLength(' div.symbol-search-div.flex-center > div > div.dropdown-div > div.footer div.select-input-div', 1)
    //     cy.checkText('div.dropdown-div > div.footer span.selctedCount', 0)

    // })
    // it('TC_BFSL_Watchlist_278:To validate that the click on Watchlist dropdown displays the available Watchlists with symbol counts 039', () => {

    //     cy.watchlistDropdown()
    //     cy.checkLength(' div.symbol-search-div.flex-center > div > div.dropdown-div > div.footer .select-input-div.undefined', 1)
    //     cy.checkLength('div.dropdown-div > div.footer span.selctedCount', 1)
    //     cy.checkLength('div.footer div.options-div', 1)
    //     cy.checkLength('div.dropdown-div > div.footer button.save-btn', 1)

    // })

    // it('TC_BFSL_Watchlist_279:To validate that the user able to select the Watchlist dropdown in the search popup', () => {
    //     // cy.get(' div.symbol-search-div.flex-center > div > div.dropdown-div > div.footer .select-input-div').click()
    //     cy.get('div.symbol-search-div.flex-center > div > div.dropdown-div > div.footer .options-div .option').should('have.class', 'selected')
    // })


    // it('TC_BFSL_Watchlist_280:To validate that the user not able to select multiple Watchlist dropdown in the search popup', () => {

    //     cy.get('div.dropdown-div > div.footer div.options-div.showOption').contains('Test1').click({ force: true })
    //     cy.get('div.symbol-search-div.flex-center > div > div.dropdown-div > div.footer .options-div.showOption').should('not.exist')
    // })

    // it('TC_BFSL_Watchlist_281:To validate that the click on save button in the Add to search popup not redirect the user to Watchlist screen', () => {
    //     cy.get('div:nth-child(1) > div.btn-div > button.addToWatchlist-btn').click()
    //     cy.wait(1000)
    //     cy.get('div.dropdown-div > div.footer button.save-btn').click()
    //     cy.get('div.dropdown-div').should('exist')
    //     cy.closeIcon()
    // })

    // it('TC_BFSL_Watchlist_282:To validate that the added symbol is displayed under the Watchlist', () => {
    //     cy.wait(1000)
    //     cy.get('#watchlist-small-tbody > tr').contains('TCS')
    // })

    // // it('TC_BFSL_Watchlist_283:To validate that the user able to add only 50 symbols to the Watchlist ', () => {
    // //     cy.addWatchlist()
    // //     cy.inputWatchlistname(WATCHLIST.NAME)
    // //     cy.get('.window .footer .positiveBtn').click({ force: true })
    // //     cy.searchSymbol('usd')
    // //     cy.wait(5000)
    // //     cy.get('div.header > div.assetMenu.flex-center.cursor:nth-child(2)').click({ force: true })
    // //     cy.get('div.dropdown-div > div.body > div.segment-div > div:nth-child(2)').click({ force: true })
    // //     cy.wait(1000)
    // //     for (var i = 1; i <= 29; i++)
    // //         cy.get('div.searchResutDiv.scrollArea > div:nth-child(' + i + ') > div.btn-div > button.addToWatchlist-btn').click({ force: true })
    // //     cy.get('div.dropdown-div > div.footer > div > button.save-btn').click({ force: true })
    // //     if (Cypress.$('.window .content ').length == 1) {
    // //         cy.cancelPopup()
    // //     }
    // // else
    // // cy.closeIcon()
    // //     // cy.cancelPopup()


    // // })



    // // it('TC_BFSL_Watchlist_284:To validate that the user not able to add more than 50 symbols to the Watchlist ', () => {
    // //     // cy.clickSearch()
    // //     cy.addWatchlist()
    // //     cy.inputWatchlistname(WATCHLIST.NAME)
    // //     cy.get('.window .footer .positiveBtn').click({ force: true })

    // //     cy.searchSymbol('wip')
    // //     cy.wait(5000)
    // //     cy.get(' div.searchResutDiv.scrollArea > div:nth-child(1) > div.btn-div > button.addToWatchlist-btn').click()
    // //     cy.watchlistDropdown()
    // //     cy.get('div.dropdown-div > div.footer div.options-div.showOption').contains('Test').click({ force: true })
    // //     cy.get('div.dropdown-div > div.footer > div > button.save-btn').click()
    // //     // cy.get(' div.dropdown-div > div.footer > div.msg-div>').should('have.class', 'error')
    // //     cy.wait(1000)
    // //     if (Cypress.$('.window .content ').length == 1) {
    // //         cy.cancelPopup()
    // //     }
    // // else
    // // cy.closeIcon()
    // //     // cy.closeIcon()
    // //     cy.changeDefault()

    // // })


    // it('TC_BFSL_Watchlist_285,286 :To validate that the error message is displayed for the addition of same symbol to the group', () => {
    //     cy.searchSymbol('TCS')
    //     cy.wait(2000)
    //     cy.get(' div.searchResutDiv.scrollArea div:nth-child(1) div.btn-div button.addToWatchlist-btn').click()
    //     cy.get('div.dropdown-div > div.footer > div > button.save-btn').click()
    //     cy.checkLength('div.dropdown-div > div.footer > div.msg-div > .error', 1)
    // })

    // it('TC_BFSL_Watchlist_287:To validate that the user not able to redirect to the Watchlist screen addition of same symbol to the group', () => {
    //     cy.get('div.dropdown-div').should('exist')
    //     cy.closeIcon()

    // })

    // it('TC_BFSL_Watchlist_288:To validate that the duplicate addition of symbol gets replaced and new addition of symbol is added to the Watchlist', () => {
    //     cy.clickSearch()
    //     cy.searchSymbol('wipro')
    //     cy.wait(2000)
    //     cy.get(' div.searchResutDiv.scrollArea > div:nth-child(1) > div.btn-div > button.addToWatchlist-btn').click()
    //     cy.get(' div.searchResutDiv.scrollArea > div:nth-child(2) > div.btn-div > button.addToWatchlist-btn').click()

    //     cy.watchlistDropdown()
    //     cy.get('div.dropdown-div > div.footer div.options-div.showOption').contains('Test1').click({ force: true })
    //     cy.get('div.dropdown-div > div.footer > div > button.save-btn').click()
    //     cy.closeIcon()
    //     cy.wait(500)
    //     cy.changeGroup('Test1')
    //     cy.wait(1000)
    //     cy.checkText('#watchlist-small-tbody', 'WIPRO')
    // })




    // it('TC_BFSL_Watchlist_289_290:To validate that the watchlist dropdown watchlist with symbol count gets increased when we try to select the multiple symbols ', () => {
    //     cy.clickSearch()
    //     cy.searchSymbol('TCS')
    //     cy.wait(2000)
    //     // cy.get('div.header > div.assetMenu.flex-center.cursor:nth-child(1)').click()
    //     // cy.get(' div.dropdown-div > div.body > div.segment-div > div:nth-child(1)').click()
    //     cy.get('div.dropdown-div > div.footer > div > div > span.selctedCount').then(($val) => {
    //         // store the button's text
    //         cy.get('div:nth-child(1) > div.btn-div > button.addToWatchlist-btn').click()
    //         const txt = $val.text()
    //         cy.get('div:nth-child(2) > div.btn-div > button.addToWatchlist-btn').click()
    //         cy.get('div:nth-child(3) > div.btn-div > button.addToWatchlist-btn').click()

    //         cy.get('div.dropdown-div > div.footer > div > div > span.selctedCount').then(($val2) => {
    //             expect($val2.text()).not.to.eq(txt)
    //         })

    //     })
    //     cy.closeIcon()
    // })

    // // it('TC_BFSL_Watchlist_291:To validate that the user able to add Equity cash symbols to the Watchlist', () => {
    // //     cy.addSymbol('equity', 'cash')

    // // })
    // // it('TC_BFSL_Watchlist_292:To validate that the user able to add Equity future symbols to the Watchlist', () => {
    // //     cy.addSymbol('equity', 'future')
    // // })

    // // it('TC_BFSL_Watchlist_293:To validate that the user able to add Equity option symbols to the Watchlist', () => {
    // //     cy.addSymbol('equity', 'option')
    // // })

    // // it('TC_BFSL_Watchlist_294:To validate that the user able to add currency future symbols to the Watchlist', () => {
    // //     cy.addSymbol('currency', 'future')
    // // })

    // // it('TC_BFSL_Watchlist_295:To validate that the user able to add currency options symbols to the Watchlist', () => {
    // //     cy.addSymbol('currency', 'option')
    // // })

    // // it('TC_BFSL_Watchlist_296:To validate that the user able to add commodity future symbols to the Watchlist', () => {
    // //     cy.addSymbol('commodity', 'future')

    // // })
    // // it('TC_BFSL_Watchlist_297:To validate that the user able to add commodity options symbols to the Watchlist', () => {
    // //     cy.addSymbol('commodity', 'option')
    // //     // cy.deletelast9group()

    // // })

    // it('TC_BFSL_Watchlist_299:To validate that the click on Watchlist dropdown displays the available Watchlist with the delete icon    ', () => {
    //     cy.clickDownarrow()
    //     cy.isVisible('div.select-input-div div.options-div span.innerAction-btn')

    // })


    // it('TC_BFSL_Watchlist_300 To validate that the click on delete icon displays the Delete watchlist popup', () => {
    //     cy.get('div.select-input-div  div.options-div > span:last-child > span.innerAction-btn').click({ force: true })
    //     cy.get(' div.app-modalDialog2.deleteWatchGroup-dialog').should('exist')

    // })

    // it('TC_BFSL_Watchlist_301:To validate the availability of fields in the delete popup', () => {
    //     cy.window().then((win) => {
    //         cy.checkLength('.window .title', 1)
    //         cy.get('.window .content').contains('Are you sure you want to delete')
    //         cy.checkLength('.window .footer > button.negativeBtn', 1)
    //         cy.checkLength('.window .footer .left-btn.deleteBtn', 1)

    //     })
    // })

    // it('TC_BFSL_Watchlist_302:To validate the "Close" option in the delete Watchlist popup', () => {

    //     cy.get('div.app-modalDialog2.deleteWatchGroup-dialog  div.footer > button.negativeBtn').click()
    //     cy.get(' div.app-modalDialog2.deleteWatchGroup-dialog').should('not.exist')

    // })

    // it('TC_BFSL_Watchlist_303:To validate that the Watchlist is not deleted when user selects the close option in the delete Watchlist popup', () => {
    //     cy.get('.widget-header > .select-input-div .bfsl-font.downArrowIcon.faceDown').click({ force: true })
    //     cy.get('div.select-input-div div.options-div').contains('Test')


    // })

    // it('TC_BFSL_Watchlist_305:To validate the "click outside of the Delete watchlist popup closes the popup"', () => {
    //     cy.get('div.select-input-div div.options-div > span:last-child > span.innerAction-btn').click()

    //     cy.get('div.app-modalDialog2.deleteWatchGroup-dialog').click(-20, -20, { force: true });
    //     cy.get(' div.app-modalDialog2.deleteWatchGroup-dialog').should('not.exist')

    // })

    // it('TC_BFSL_Watchlist_306:To validate that the selection delete option in the delete watchlist popup allows the user to delete the Watchlist', () => {
    //     cy.get('div.select-input-div div.options-div > span:last-child > span.innerAction-btn').click({ force: true })

    //     cy.get('.window .footer .left-btn.deleteBtn').click()
    //     cy.window().then((win) => {
    //         cy.checkLength('.window .title', 1)
    //         cy.checkLength('.window .content', 1)
    //         cy.checkLength('.window .footer > button.negativeBtn', 1)

    //     })

    // })

    // it('TC_BFSL_Watchlist_307:To validate the Ok button in the delete confirmation popup', () => {
    //     cy.cancelPopup()

    // })

    // it('TC_BFSL_Watchlist_308_309:To validate the user able to delete only one group at a time', () => {
    //     cy.clickDownarrow()
    //     cy.get('div.select-input-div div.options-div > span:last-child > span.innerAction-btn').click({ force: true })

    //     cy.isVisible('div.app-modalDialog2.deleteWatchGroup-dialog')
    //     cy.get('div.app-modalDialog2.deleteWatchGroup-dialog div.footer button.negativeBtn').click()
    // })
    // //
    // it('TC_BFSL_Watchlist_310:To validate that the click on watchlist dropdown not display the deleted group ', () => {
    //     cy.clickDownarrow()
    //     cy.get('.options-div.showOption').should('not.contain', 'Test ')
    //     // cy.changeGroup('Test2')

    // })

    // it('TC_BFSL_Watchlist_311:To validate that the click on delete icon in the Watchlist expanded view displays the checkbox near the symbol name', () => {
    //     cy.get(' div.widget-header > div.icon-div > span.bfsl-font.deleteIcon.cursor').click({ force: true })
    //     cy.isVisible('span.bfsl-font.checkboxIcon')
    // })

    // it('TC_BFSL_Watchlist_312:To validate that the user select the checkbox in the watchlist expanded view  ', () => {
    //     cy.get(' #watchlist-small-tbody > tr:nth-child(1) > td.width4.checkbox-td > input.input-ele.hiddenCheckbox').click()
    //     cy.get('span.bfsl-font.checkboxIcon').should('have.class', 'checked')
    // })

    // it('TC_BFSL_Watchlist_313:To validate that the user able to De-select the checkbox in the watchlist expanded view', () => {
    //     cy.get('#watchlist-small-tbody > tr:nth-child(1) > td.width4.checkbox-td > input.input-ele.hiddenCheckbox').click({ force: true })
    //     cy.get('span.bfsl-font.checkboxIcon').should('have.class', 'unChecked')
    // })

    // it('TC_BFSL_Watchlist_314:To validate that the selection of checkbox highlights the delete icon in red colour', () => {
    //     cy.get('.widget-header > div.icon-div > span.bfsl-font.deleteIcon.cursor').should('have.css', 'color', 'rgb(209, 58, 67)')

    // })

    // it('TC_BFSL_Watchlist_316:To validate that the click on delete icon in the watchlist expanded view displays the delete script confirmation popup', () => {
    //     cy.get(' #watchlist-small-tbody > tr:nth-child(1) > td.width4.checkbox-td > input.input-ele.hiddenCheckbox').click()
    //     cy.get('div.widget-header > div.icon-div > span.bfsl-font.deleteIcon.cursor').click()
    //     cy.window().then((win) => {
    //         cy.get('.window .title').contains('DELETE SCRIP')
    //     })
    // })

    // it('TC_BFSL_Watchlist_317:To validate the availability of fields in the delete script confirmation popup', () => {
    //     cy.window().then((win) => {
    //         cy.checkLength('.window .title', 1)
    //         cy.checkLength('.window .content', 1)
    //         cy.checkLength('.window .footer > button.negativeBtn', 1)
    //         cy.get('.window .content').contains('Are you sure you want to delete')

    //     })

    // })

    // it('TC_BFSL_Watchlist_319:To validate the Close option in the delete script confirmation popup', () => {
    //     cy.cancelPopup()
    //     cy.get(' div.app-modalDialog2.deleteWatchGroup-dialog').should('not.exist')

    // })

    // it('TC_BFSL_Watchlist_320:To validate the click outside of the delete script confirmation popup ', () => {
    //     cy.get('div.widget-header > div.icon-div > span.bfsl-font.deleteIcon.cursor').click()
    //     cy.get('#watchlist-small-tbody > tr:nth-child(1) > td.width4.checkbox-td > input.input-ele.hiddenCheckbox').click()
    //     cy.get('div.widget-header > div.icon-div > span.bfsl-font.deleteIcon.cursor').click()
    //     cy.get('div.app-modalDialog2.deleteSym-dialog').click(-20, -20, { force: true });
    //     cy.get('div.window').should('not.exist')

    // })
    // it('TC_BFSL_Watchlist_327:To validate that the click on the delete button in the delete script confirmation popup allows the user to delete the selected symbols', () => {
    //     cy.get(' div.widget-header > div.icon-div > span.bfsl-font.deleteIcon.cursor').click()
    //     cy.get(' #watchlist-small-tbody > tr:nth-child(1) > td.width4.checkbox-td > input.input-ele.hiddenCheckbox').click()
    //     cy.get(' div.widget-header > div.icon-div > span.bfsl-font.deleteIcon.cursor').click()
    //     cy.get('.window .footer > button.left-btn.deleteBtn').click()
    //     cy.window().then((win) => {
    //         cy.checkLength('.window .title', 1)
    //         cy.checkLength('.window .content', 1)
    //         cy.checkLength('.window .footer > button.negativeBtn', 1)
    //     })

    // })
    // it('TC_BFSL_Watchlist_322:To validate that the click on Ok button in the success popup closes the popup', () => {
    //     cy.cancelPopup()
    //     cy.get('div.window').should('not.exist')

    // })
    // it('TC_BFSL_Watchlist_323:To validate that the checkbox get closed without selection of any symbols', () => {
    //     cy.get(' div.widget-header > div.icon-div > span.bfsl-font.deleteIcon.cursor').click()
    //     cy.isVisible('span.bfsl-font.checkboxIcon')
    //     cy.get(' div.widget-header > div.icon-div > span.bfsl-font.deleteIcon.cursor').click()
    //     cy.get('td.width4.checkbox-td').should('have.class', 'hidden')

    // })

    // it('TC_BFSL_Watchlist_324:To Validate that the user able to select multiple checkbox', () => {
    //     cy.get(' div.widget-header > div.icon-div > span.bfsl-font.deleteIcon.cursor').click()
    //     // cy.get('div.widget-header > div.icon-div > span.bfsl-font.deleteIcon.cursor').click()
    //     cy.get('#watchlist-small-tbody > tr:first > td.width4.checkbox-td > input.input-ele.hiddenCheckbox').click()
    //     cy.get('#watchlist-small-tbody > tr:last > td.width4.checkbox-td > input.input-ele.hiddenCheckbox').click()
    //     // cy.get('#watchlist-small-tbody > tr:nth-child(3) > td.width4.checkbox-td > input.input-ele.hiddenCheckbox').click()
    //     // cy.get('#watchlist-small-tbody > tr:nth-child(1) > td.width4.checkbox-td>span.bfsl-font.checkboxIcon').should('have.class', 'checked')

    // })

    // it('TC_BFSL_Watchlist_325:To validate that the user able to delete multiple symbols', () => {
    //     cy.get('div.widget-header > div.icon-div > span.bfsl-font.deleteIcon.cursor').click()
    //     cy.window().then((win) => {
    //         cy.checkLength('.window .title', 1)
    //         cy.checkLength('.window .content', 1)
    //         cy.checkLength('.window .footer > button.negativeBtn', 1)
    //         cy.checkLength('.window .footer > button.left-btn.deleteBtn', 1)
    //         cy.get('.window .footer > button.left-btn.deleteBtn').click()
    //     })
    // })

    // it('TC_BFSL_Watchlist_326:To validate that the deleted symbols not display under the watchlist', () => {
    //     cy.cancelPopup()
    //     cy.get('div.window').should('not.exist')

    // })

    // it('TC_BFSL_Watchlist_327:To validate that the clear all link in the watchlist expanded view', () => {
    //     cy.get('div.widget-header > div.icon-div > span.bfsl-font.deleteIcon.cursor').click()
    //     cy.get('#watchlist-small-tbody > tr:first > td.checkbox-td > input.hiddenCheckbox').click()
    //     cy.get('#watchlist-small-tbody > tr:last > td.checkbox-td > input.hiddenCheckbox').click()
    //     cy.get('div.widget-header > div.icon-div > span.clear-btn.cursor').click()
    //     cy.get('#watchlist-small-tbody > tr:first span.bfsl-font.checkboxIcon').should('have.class', 'unChecked')
    //     cy.get('#watchlist-small-tbody > tr:last span.bfsl-font.checkboxIcon').should('have.class', 'unChecked')

    // })

    // it('TC_BFSL_Watchlist_330:"To validate that the click on the watchlist minimized view icon displays the watchlist minimized screen the navigation happens smoothly', () => {
    //     cy.get(' div.widget-header > span.bfsl-font.minimizeIcon').click()
    //     cy.wait(1000)
    // })

    // it('TC_BFSL_Watchlist_329:"To validate that the click on the watchlist expanded icon displays the watchlist expanded screen the navigation happens smoothly', () => {
    //     cy.get('div.left > div > div > div.widget-header > span.bfsl-font.maximizeIcon').click({ force: true })
    //     cy.wait(1000)
    //     cy.get(' div.widget-header > span.bfsl-font.minimizeIcon').click({ force: true })
    //     cy.wait(1000)
    // })

    // it('TC_BFSL_Watchlist_331:"To validate that the click on the Quotes expanded icon displays the Quotes expanded screen the navigation happens smoothly', () => {
    //     cy.get('div.right div.chartWidget-base.withBorder.chartMenu > div.header > span.bfsl-font.maximizeIcon.undefined').click({ force: true })
    //     cy.wait(1000)
    // })

    // it('TC_BFSL_Watchlist_332:"To validate that the click on the Quotes minimized view icon displays the Quotes minimized screen the navigation happens smoothly', () => {
    //     cy.get('div.quoteDetails-div.withBorder > span.bfsl-font.minimizeIcon.undefined').click({ force: true })
    //     cy.wait(1000)
    // })


})