import {
    URL, PASSWORD, PAN_NUMBER, DOB, USER_NAME
} from '../support/config'

before(function () {
    cy.visit(URL)
})
describe('valid case', () => {
    it("TC_BFSL_Alerts_000 : To validate the Login button in the login screen", () => {
        cy.wait(2000)
        cy.login(USER_NAME, PASSWORD, PAN_NUMBER)
        cy.wait(2000)
        // cy.get('.app-modalDialog2').then(($btn) => {
        //     if($btn.hasClass("tax-attention-base")) {
        //         cy.get(".tax-attention-base .heading .closeIcon").click({ force: true })
        //     }
        // })     
        // cy.visit(URL)

    })

    it("TC_BFSL_Alerts_001 : To validate whether tapping on Alert icon navigates the user to Set Alert screen", () => {
        cy.get('.watchlist-table tbody > tr:nth-child(1) > td.firstChild.width40 div.primary div.baseSym').click({ force: true })
        cy.isVisible('.quote-view ')
        cy.get('.quote-view .actionDiv .alert-div').click({ force: true })   
    })

    it("TC_BFSL_Alerts_002 : To validate Set Alert screen header title", () => {
        cy.isVisible('.alertBase .scrip-head .alert-head')
        cy.get('.alertBase .scrip-head .alert-head').contains("Set Alert") 
    })

    it("TC_BFSL_Alerts_003 : To validate whether tapping on back button navigates back to Quote screen", () => {
        cy.get('.alertBase .alert-footer .actionDiv .negativeBtn').click({ force: true })  
        cy.isVisible('.quote-view')
        cy.get('.quote-view .actionDiv .alert-div').click({ force: true })     
    })

    it("TC_BFSL_Alerts_004 : To validate whether all the fields are displayed in the Alert screen for Equity scrip as per VD", () => {
        cy.isVisible('.alertBase .alert-header .valueDiv .symName')
        cy.isVisible('.alertBase .alert-header .valueDiv .ltpVal')
        cy.isVisible('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .select-input')
        cy.isVisible('.alertBase .alert-body .fieldBody .fieldRow .field .entervalue-field span.enter-val')
        cy.isVisible('.alertBase .alert-body .fieldBody .fieldRow .field .entervalue-field span.enter-title')
        cy.isVisible('.alertBase .alert-body .fieldBody .fieldRow .field .checkboxIcon')
        cy.isVisible('.alertBase .alert-footer .actionDiv .positiveBtn')
        cy.isVisible('.alertBase .alert-footer .marginDiv .alert-info')
    })

    // it("TC_BFSL_Alerts_005 : To validate the search functionality in Set Alert Screen", () => {
    //     // cy.get('.dashboard-base .symSearch-base .input-ele').contains("Search symbols to add new alert").click({ force: true })  
    //     cy.get('.dashboard-base .symSearch-base .input-ele').invoke('attr', 'placeholder').should('contain', 'Search INFY, Bank CE, Bank NFO').click({ force: true })  
    // })

    it("TC_BFSL_Alerts_006 : To validate whether the user able to select the LTP from the 'Alert me when' dropdown and verify that the selected LTP is shown to the user with the current value in the drop down", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .select-input .select-value').contains("LAST TRADED PRICE") 
        cy.isVisible('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value')
    })

    it("TC_BFSL_Alerts_007 : To validate whether entering the value in the Less than field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-header .valueDiv .ltpVal span').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('LESS THAN EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) - 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.wait(1000)
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_008 : To validate whether entering the value in the Greater than field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-header .valueDiv .ltpVal span').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('GREATER THAN EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_009 : To validate whether entering the value in the Equal to field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-header .valueDiv .ltpVal span').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_013 : To validate whether the created Alert for LTP is reflected in Pending Alert", () => {
        cy.get('.alertBase .alert-header .valueDiv .ltpVal span').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.isVisible('.alert-base .alert-window .alert-base-body .alert-table tbody')
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_015 : To validate whether the user able to select the High price from the 'Alert me when' dropdown and verify that the selected High Price is shown to the user with the current High Price value in the drop down", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('HIGH PRICE').click({ force: true }) 
        cy.isVisible('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value')
    })

    it("TC_BFSL_Alerts_016 : To validate whether entering the value in the Less than field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('HIGH PRICE').click({ force: true }) 
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('LESS THAN EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) - 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.wait(1000)
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_017 : To validate whether entering the value in the Greater than field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('HIGH PRICE').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('GREATER THAN EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_018 : To validate whether entering the value in the Equal to field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('HIGH PRICE').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_022 : To validate whether the created Alert for High price is reflected in Pending Alert", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('HIGH PRICE').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.wait(1000)
        cy.get('.alert-base .alert-window .alert-base-body .alert-table tbody tr:nth-child(1) td:nth-child(2) span').click({ force: true }) 
        cy.isVisible('.alert-base .alert-window .alert-base-body .alert-table tbody')
        cy.get('.alert-base .alert-window .alert-base-body .alert-table .moreDetails .itemList-content .alert-type span.content-value').contains('HIGH PRICE')
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_024 : To validate whether the user able to select the Low price from the 'Alert me when' dropdown and verify that the selected Low Price is shown to the user with the current High Price value in the drop down", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('LOW PRICE').click({ force: true }) 
        cy.isVisible('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value')
    })

    it("TC_BFSL_Alerts_025 : To validate whether entering the value in the Less than field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('LOW PRICE').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('LESS THAN EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) - 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.wait(1000)
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_026 : To validate whether entering the value in the Greater than field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('LOW PRICE').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('GREATER THAN EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_027 : To validate whether entering the value in the Equal to field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('LOW PRICE').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_030 : To validate whether the created Alert for Low price is reflected in Pending Alert", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('LOW PRICE').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.get('.alert-base .alert-window .alert-base-body .alert-table tbody tr:nth-child(1) td:nth-child(2) span').click({ force: true }) 
        cy.isVisible('.alert-base .alert-window .alert-base-body .alert-table tbody')
        cy.get('.alert-base .alert-window .alert-base-body .alert-table .moreDetails .itemList-content .alert-type span.content-value').contains('LOW PRICE')
        cy.dashboardView()
        cy.setAlertWindow()
    })


    it("TC_BFSL_Alerts_032 : To validate whether the user able to select the Open price from the 'Alert me when' dropdown and verify that the selected Open Price is shown to the user with the current High Price value in the drop down", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('OPEN PRICE').click({ force: true }) 
        cy.isVisible('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value')
    })

    it("TC_BFSL_Alerts_033 : To validate whether entering the value in the Less than field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('OPEN PRICE').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('LESS THAN EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) - 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.wait(1000)
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_034 : To validate whether entering the value in the Greater than field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('OPEN PRICE').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('GREATER THAN EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_035 : To validate whether entering the value in the Equal to field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('OPEN PRICE').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_038 : To validate whether the created Alert for Open price is reflected in Pending Alert", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('OPEN PRICE').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.get('.alert-base .alert-window .alert-base-body .alert-table tbody tr:nth-child(1) td:nth-child(2) span').click({ force: true }) 
        cy.isVisible('.alert-base .alert-window .alert-base-body .alert-table tbody')
        cy.get('.alert-base .alert-window .alert-base-body .alert-table .moreDetails .itemList-content .alert-type span.content-value').contains('OPEN PRICE')
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_040 : To validate whether the user able to select the Close price from the 'Alert me when' dropdown and verify that the selected Close Price is shown to the user with the current High Price value in the drop down", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('CLOSE PRICE').click({ force: true }) 
        cy.isVisible('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value')
    })

    it("TC_BFSL_Alerts_041 : To validate whether entering the value in the Less than field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('CLOSE PRICE').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('LESS THAN EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) - 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.wait(1000)
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_042 : To validate whether entering the value in the Greater than field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('CLOSE PRICE').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('GREATER THAN EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_043 : To validate whether entering the value in the Equal to field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('CLOSE PRICE').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_046 : To validate whether the created Alert for Close price is reflected in Pending Alert", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('CLOSE PRICE').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.get('.alert-base .alert-window .alert-base-body .alert-table tbody tr:nth-child(1) td:nth-child(2) span').click({ force: true }) 
        cy.isVisible('.alert-base .alert-window .alert-base-body .alert-table tbody')
        cy.get('.alert-base .alert-window .alert-base-body .alert-table .moreDetails .itemList-content .alert-type span.content-value').contains('CLOSE PRICE')
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_048 : To validate whether the user able to select the Last Traded Qty from the 'Alert me when' dropdown and verify that the selected Last Traded Qty is shown to the user with the current High Price value in the drop down", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('LAST TRADED QUANTITY').click({ force: true }) 
        cy.isVisible('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value')
    })

    it("TC_BFSL_Alerts_049 : To validate whether entering the value in the Less than field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('LAST TRADED QUANTITY').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('LESS THAN EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) - 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.wait(1000)
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_050 : To validate whether entering the value in the Greater than field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('LAST TRADED QUANTITY').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('GREATER THAN EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_051 : To validate whether entering the value in the Equal to field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('LAST TRADED QUANTITY').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_054 : To validate whether the created Alert for Last Traded qty is reflected in Pending Alert", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('LAST TRADED QUANTITY').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.get('.alert-base .alert-window .alert-base-body .alert-table tbody tr:nth-child(1) td:nth-child(2) span').click({ force: true }) 
        cy.isVisible('.alert-base .alert-window .alert-base-body .alert-table tbody')
        cy.get('.alert-base .alert-window .alert-base-body .alert-table .moreDetails .itemList-content .alert-type span.content-value').contains('LAST TRADED QUANTITY')
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_056 : To validate whether the user able to select the Day Change Percentage from the 'Alert me when' dropdown and verify that the selected  Day Change Percentage is shown to the user with the current High Price value in the drop down", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('DAY CHANGE %').click({ force: true }) 
        cy.isVisible('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value')
    })

    it("TC_BFSL_Alerts_057 : To validate whether entering the value in the Less than field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('DAY CHANGE %').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('GREATER THAN EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 10)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.wait(1000)
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_058 : To validate whether entering the value in the Greater than field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('DAY CHANGE %').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('GREATER THAN EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_059 : To validate whether entering the value in the Equal to field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('DAY CHANGE %').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_062 : To validate whether the created Alert for  Day Change Percentage is reflected in Pending Alert", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('DAY CHANGE %').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.get('.alert-base .alert-window .alert-base-body .alert-table tbody tr:nth-child(1) td:nth-child(2) span').click({ force: true }) 
        cy.isVisible('.alert-base .alert-window .alert-base-body .alert-table tbody')
        cy.get('.alert-base .alert-window .alert-base-body .alert-table .moreDetails .itemList-content .alert-type span.content-value').contains('DAY CHANGE %')
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_064 : To validate whether the user able to select the Average Traded price from the 'Alert me when' dropdown and verify that the selected Average Traded price is shown to the user with the current High Price value in the drop down", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('AVERAGE PRICE').click({ force: true }) 
        cy.isVisible('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value')
    })

    it("TC_BFSL_Alerts_065 : To validate whether entering the value in the Less than field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('AVERAGE PRICE').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('LESS THAN EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) - 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.wait(1000)
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_066 : To validate whether entering the value in the Greater than field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('AVERAGE PRICE').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('GREATER THAN EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_067 : To validate whether entering the value in the Equal to field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('AVERAGE PRICE').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_070 : To validate whether the created Alert for Average Traded price is reflected in Pending Alert", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('AVERAGE PRICE').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.get('.alert-base .alert-window .alert-base-body .alert-table tbody tr:nth-child(1) td:nth-child(2) span').click({ force: true }) 
        cy.isVisible('.alert-base .alert-window .alert-base-body .alert-table tbody')
        cy.get('.alert-base .alert-window .alert-base-body .alert-table .moreDetails .itemList-content .alert-type span.content-value').contains('AVERAGE PRICE')
        cy.dashboardView()
        cy.setAlertWindow()
    })

     it("TC_BFSL_Alerts_072 : To validate whether the user able to select the Volume Traded from the 'Alert me when' dropdown and verify that the selected Volume Traded is shown to the user with the current High Price value in the drop down", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('VOLUME').click({ force: true }) 
        cy.isVisible('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value')
    })

    // it("TC_BFSL_Alerts_073 : To validate whether entering the value in the Less than field and tapping on set Alert Button creates the Alert successfully", () => {
    //     cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('VOLUME').click({ force: true }) 
    //     cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
    //         const txt = $btn.text().replaceAll(",","")
    //         cy.log(txt)
    //         cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('LESS THAN EQUAL TO').click({ force: true }) 
    //         cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) - 1)
    //         cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
    //         cy.wait(100)
    //         cy.get('.okay-btn').click({ force: true }) 
    //     });
    //     cy.wait(1000)
    //     cy.dashboardView()
    //     cy.setAlertWindow()
    // })

    it("TC_BFSL_Alerts_074 : To validate whether entering the value in the Greater than field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('VOLUME').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('GREATER THAN EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_075 : To validate whether entering the value in the Equal to field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('VOLUME').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_078 : To validate whether the created Alert for Volume Traded is reflected in Pending Alert", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('VOLUME').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 5)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.get('.alert-base .alert-window .alert-base-body .alert-table tbody tr:nth-child(1) td:nth-child(2) span').click({ force: true }) 
        cy.isVisible('.alert-base .alert-window .alert-base-body .alert-table tbody')
        cy.get('.alert-base .alert-window .alert-base-body .alert-table .moreDetails .itemList-content .alert-type span.content-value').contains('VOLUME')
        cy.dashboardView()
        // cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_096 :  To validate whether the user able to select Open Interest from the 'Alert me when' dropdown and verify that the selected Open Interest is shown to the user with the current High Price value in the drop down", () => {
       cy.openinterestAlert()
    })

    it("TC_BFSL_Alerts_097 : To validate whether entering the value in the Less than field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('OPEN INTEREST').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('LESS THAN EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) - 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.wait(1000)
        cy.dashboardView()
    })

    it("TC_BFSL_Alerts_098 : To validate whether entering the value in the Greater than field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.openinterestAlert()
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('OPEN INTEREST').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('GREATER THAN EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.dashboardView()
    })

    it("TC_BFSL_Alerts_099 : To validate whether entering the value in the Equal to field and tapping on set Alert Button creates the Alert successfully", () => {
        cy.openinterestAlert()
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('OPEN INTEREST').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 1)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.dashboardView()
    })

    
    it("TC_BFSL_Alerts_102 : To validate whether the created Alert for  Open Interest is reflected in Pending Alert", () => {
        cy.openinterestAlert()
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('OPEN INTEREST').click({ force: true }) 
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 5)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true }) 
            cy.wait(100)
            cy.get('.okay-btn').click({ force: true }) 
        });
        cy.isVisible('.alert-base .alert-window .alert-base-body .alert-table tbody')
        cy.get('.alert-base .alert-window .alert-base-body .alert-table tbody tr:nth-child(1) td:nth-child(2) span').click({ force: true }) 
        cy.get('.alert-base .alert-window .alert-base-body .alert-table .moreDetails .itemList-content .alert-type span.content-value').contains('OPEN INTEREST')
        cy.dashboardView()
        cy.setAlertWindow()
    })

    it("TC_BFSL_Alerts_104 : To validate whether tapping on Alerts navigates to Alerts screen", () => {
        cy.wait(2000)
        cy.get('.headerBase-div .menuIcon-div .menuIcon').click({ force: true })
        cy.get('.menu-dialog .menu-details .menu-row .menu-name').contains('Alerts').click({ force: true })
    })

    it("TC_BFSL_Alerts_105 : To validate 'Alerts' screen header title", () => {
       cy.get('.trigger-label').contains('MY TRIGGERS')
       cy.get('.alert-base .top-alert .positiveBtn').contains('CREATE ALERTS')
    })

    it("TC_BFSL_Alerts_107 : To validate whether the user is allowed to modify the created Alert in pending Alert", () => {
       cy.wait(2000) 
       cy.get('.alert-base .alert-window .alert-base-body .alert-table tbody tr:nth-child(1) td:nth-child(2) span').click({ force: true }) 
       cy.get('.alert-base .alert-window .alert-base-body .alert-table .moreDetails .itemList-content .alert-list-buttons button.modify-alert').click({ force: true })
      
       //  cy.get('.alert-base .alert-window .alert-base-body .alert-table > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) button.modify-alert').click({ force: true })
       //  cy.isVisible('.alertBase')
        cy.get('.alertBase .alert-footer .actionDiv .negativeBtn').click({ force: true })
    })

    it("TC_BFSL_Alerts_108 : To validate whether the user is allowed to Delete the created Alert in pending Alert", () => {
        cy.get('.alert-base .alert-window .alert-base-body .alert-table tbody tr:nth-child(1) td:nth-child(2) span').click({ force: true }) 
        cy.get('.alert-base .alert-window .alert-base-body .alert-table .moreDetails .itemList-content .alert-list-buttons button.delete-alert').click({ force: true })
        cy.isVisible('.alert-delete')
        cy.get('.alert-delete-div .delete-btn-div button.cancelbox-alert').click({ force: true })
    })

    it("TC_BFSL_Alerts_109 : To validate modify functionality for multiple Alert for a single scrip", () => {
        cy.get('.alert-base .alert-window .alert-base-body .alert-table tbody tr:nth-child(1) td:nth-child(2) span').click({ force: true }) 
        cy.get('.alert-base .alert-window .alert-base-body .alert-table .moreDetails .itemList-content .alert-list-buttons button.modify-alert').click({ force: true })
        cy.isVisible('.alertBase')
        cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .current-value').then(($btn) => {
            const txt = $btn.text().replaceAll(",","")
            cy.log(txt)
            cy.get('.alertBase .alert-body .fieldBody .fieldRow.dropdown .field .select-input-div .options-div .option').contains('EQUAL TO').click({ force: true }) 
            cy.input('.fieldRow .field [name="alertvalue"]', parseFloat(txt) + 10)
            cy.wait(100)
            cy.get('.alertBase .alert-footer .actionDiv .positiveBtn').click({ force: true })
        });
    })

    it("TC_BFSL_Alerts_110 : To validate Delete functionality for multiple Alert for a single scrip", () => {
       cy.get('.alert-base .alert-window .alert-base-body .alert-table tbody tr:nth-child(1) td:nth-child(2) span').click({ force: true }) 
       cy.get('.alert-base .alert-window .alert-base-body .alert-table .moreDetails .itemList-content .alert-list-buttons button.delete-alert').click({ force: true })
        cy.isVisible('.alert-delete')
        cy.get('.delete-btn-div button.deletebox-alert').click({ force: true })
        cy.isVisible('.alert-delete-divPop')
        cy.get('.okay-btn').click({ force: true })
    })

})
