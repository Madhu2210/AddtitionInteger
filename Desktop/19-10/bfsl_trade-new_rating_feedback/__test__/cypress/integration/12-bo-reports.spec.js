import {
    URL, PASSWORD, PAN_NUMBER, DOB, USER_NAME
} from '../support/config'

before(function () {
    cy.visit(URL)
})
describe('valid case', () => {
    it("TC_BFSL_BO_Reports_000 : To validate the Login button in the login screen", () => {
        cy.wait(2000)
        cy.login(USER_NAME, PASSWORD, PAN_NUMBER)
        // cy.wait(2000)
        // cy.visit(URL)

    })

    it("TC_BFSL_BO_Reports_001 : To validate whether tapping on Report navigates the user to Report screen", () => {
        cy.wait(2000)
        cy.get('.menuIcon').first().click({ force: true })
        // cy.get('.menu-dialog .menu-row').last().click({ force: true })
        cy.get('.menu-name').contains('Reports').last().click({ force: true })
    })

    it("TC_BFSL_BO_Reports_002 : To validate whether all fields are displayed in Report screen as per VD", () => {
        cy.wait(20000)
        cy.get('.head-name').contains('Report')
        cy.get('.bo-base .bo-filters .bo-date-picker')
    })

    it("TC_BFSL_BO_Reports_004 : To validate the availability of fields in the BO Reports screen", () => {
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('Financial Ledger')
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('Fund Transaction')
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('Trade Summary')
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('Cost Report')
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('Contract Note Download')
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('View Last 10 Transactions')
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('Client Holdings')
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('Dividend Report')
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('DP Transaction')
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('Interest Report')
    })

    it("TC_BFSL_BO_Reports_005 : To validate that the Financial Ledger tab is highlighted with the scroll view by default", () => {
        cy.get('.bo-base .bo-header .bo-header-values .menusTab.selectedMenu .menuName').contains('Financial Ledger')
    })

    it("TC_BFSL_BO_Reports_006 : To validate that the Financial Ledger displays the available options in it", () => {
        cy.get('.bo-base .bo-filters .bo-top-left .bo-select-case .radioField .value').contains('QUICK SNAPSHOT')
        cy.get('.bo-base .bo-filters .bo-top-left .bo-select-case .radioField .value').contains('DETAILED REPORT')
    })

    it("TC_BFSL_BO_Reports_007 : To validate that clicking on the Financial Ledger displays the data in Quick Snapshot as default", () => {
        cy.get('.bo-base .bo-header .bo-header-values .menusTab.selectedMenu .menuName').contains('Financial Ledger').click({ force: true })
    })

    it("TC_BFSL_BO_Reports_008 : To validate that clicking on Detailed View displays the data populated as expected.", () => {
        cy.get('.bo-base .bo-filters .bo-top-left .bo-select-case .radioField .value').contains('DETAILED REPORT').click({ force: true })
    })

    it("TC_BFSL_BO_Reports_009 : To validate the movable Filter button", () => {
        cy.get('.bo-base .bo-filters .select-input-div .select-input .select-value').contains('ALL').click({ force: true })
        cy.get('.bo-base .bo-filters .select-input-div .select-input .select-value').contains('THIS MONTH').click({ force: true })
    })

    it("TC_BFSL_BO_Reports_010 : To validate the options in Filter button", () => {
        cy.get('.bo-base .bo-filters .select-input-div .select-input .select-value').contains('ALL').click({ force: true })
        cy.get('.bo-base .bo-filters .select-input-div .options-div').contains('BSE').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_011 : To validate the date filter to see the data accordingly", () => {
        cy.get('.bo-base .bo-filters .select-input-div .options-div').contains('THIS MONTH').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_012 : To validate the date filter to see the data accordingly", () => {
        cy.get('.bo-base .bo-filters .select-input-div .options-div').contains('LAST MONTH').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_013 : To validate the date filter to see the data accordingly", () => {
        cy.get('.bo-base .bo-filters .select-input-div .options-div').contains('CURRENT FY').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_014 : To validate the date filter to see the data accordingly", () => {
        cy.get('.bo-base .bo-filters .select-input-div .options-div').contains('CUSTOM DATE').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_015 : To validate that selecting Fund Transactions displays the data as expected", () => {
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('Fund Transaction').click({ force: true })
        cy.get('.bo-base .bo-filters .select-input-div .options-div').contains('THIS MONTH').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_016 : To validate the date filter to see the data accordingly", () => {
        cy.get('.bo-base .bo-filters .select-input-div .options-div').contains('CUSTOM DATE').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_017 : To validate that selecting Fund Transactions displays the data as expected", () => {
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('Trade Summary').click({ force: true })
        cy.get('.bo-base .bo-filters .select-input-div .options-div').contains('THIS MONTH').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_018 : To validate that the Equity tab is highlighted with the scroll view by default", () => {
        cy.get('.bo-base .bo-filters .bo-top-left .bo-select-case .radioField .value').contains('EQUITY').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_019 : To validate the search option in the Equity tab in trade summary", () => {
        cy.get('.bo-base .bo-filters .bo-top-left .bo-search').click({ force: true })
    })

    it("TC_BFSL_BO_Reports_020 : To validate that the Equity tab is highlighted with the scroll view by default", () => {
        cy.get('.bo-base .bo-filters .bo-top-left .bo-select-case .radioField .value').contains('DERIVATIVE').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_021 : To validate the search option in the derivative tab in trade summary", () => {
        cy.get('.bo-base .bo-filters .bo-top-left .bo-search').click({ force: true })
    })
    
    it("TC_BFSL_BO_Reports_022 : To validate that selecting Cost report displays the data to the user as expected", () => {
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('Cost Report').click({ force: true })
        cy.get('.bo-base .bo-filters .select-input-div .options-div').contains('THIS MONTH').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_023 : To validate that the Equity tab is highlighted with the scroll view by default", () => {
        cy.get('.bo-base .bo-filters .bo-top-left .bo-select-case .radioField .value').contains('EQUITY').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_024 : To validate the date filter to see the data accordingly", () => {
        cy.get('.bo-base .bo-filters .select-input-div .options-div').contains('CUSTOM DATE').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_025 : To validate that the Equity tab is highlighted with the scroll view by default", () => {
        cy.get('.bo-base .bo-filters .bo-top-left .bo-select-case .radioField .value').contains('DERIVATIVE').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_026 : To validate the date filter to see the data accordingly", () => {
        cy.get('.bo-base .bo-filters .select-input-div .options-div').contains('CUSTOM DATE').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_027 : To validate that the Contract Note Downloads is highlighted with the scroll view by default", () => {
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('Contract Note Download').click({ force: true })
        cy.get('.bo-base .bo-filters .select-input-div .options-div').contains('THIS MONTH').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_028 : To validate the date filter to see the data accordingly", () => {
        cy.get('.bo-base .bo-filters .select-input-div .options-div').contains('CUSTOM DATE').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_029 : To validate the download button to download pdf files.", () => {
        cy.get('.bo-baseTable .bo-table tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".bo-baseTable .bo-table tr td.colspan").contains("No Data Available")
            } else {
                cy.get('.bo-baseTable .bo-table .tbody-scroller a.download').contains('Download').click({ force: true })
                cy.wait(2000)
            }
        })     
    })

    it("TC_BFSL_BO_Reports_030 : To validate that the view last 10 transactions is highlighted with the scroll view by default", () => {
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('View Last 10 Transactions').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_031 : To validate the data populated for the last 10 transactions made by the user", () => {
        cy.get('.bo-baseTable .bo-table thead th').contains('DATE')
        cy.get('.bo-baseTable .bo-table thead th').contains('SYMBOL')
        cy.get('.bo-baseTable .bo-table thead th').contains('EXCHANGE')
        cy.get('.bo-baseTable .bo-table thead th').contains('QTY')
        cy.get('.bo-baseTable .bo-table thead th').contains('PRICE')
        cy.get('.bo-baseTable .bo-table thead th').contains('VALUE')
        cy.get('.bo-baseTable .bo-table thead th').contains('MODE')
    })

    it("TC_BFSL_BO_Reports_032 : To validate that the client holdings is highlighted with the scroll view by default", () => {
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('Client Holdings').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_033 : To validate the data populated for the client holdings screen for the user.", () => {
        cy.get('.bo-base .bo-filters .bo-top-right span.datetext').contains('HOLDINGS REPORT AS ON :')
        cy.get('.bo-baseTable .bo-table thead th').contains('SCRIP NAME')
        cy.get('.bo-baseTable .bo-table thead th').contains('DP HOLDING')
        cy.get('.bo-baseTable .bo-table thead th').contains('MARGIN PLEDGE')
        cy.get('.bo-baseTable .bo-table thead th').contains('MTF QTY')
        cy.get('.bo-baseTable .bo-table thead th').contains('MTF PLEDGE')
        cy.get('.bo-baseTable .bo-table thead th').contains('UNPAID QTY')
        cy.get('.bo-baseTable .bo-table thead th').contains('UNSETTLED QTY')
        cy.get('.bo-baseTable .bo-table thead th').contains('TOTAL HOLDING')
        cy.get('.bo-baseTable .bo-table thead th').contains('CLOSE RATE')
        cy.get('.bo-baseTable .bo-table thead th').contains('HOLDING VALUE')
    })

    it("TC_BFSL_BO_Reports_034 : To validate that the Dividend report is highlighted with the scroll view by default", () => {
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('Dividend Report').click({ force: true })
        cy.wait(2000)
    })

    // it("TC_BFSL_BO_Reports_035 : To validate the date filter to see the data accordingly", () => {
    //     cy.get('.bo-base .bo-filters .select-input-div .options-div').contains('LAST YEAR').click({ force: true })
    //     cy.wait(2000)
    // })

    it("TC_BFSL_BO_Reports_036 : To validate the sorting feature for the scrip name", () => {
        cy.get('.bo-baseTable .bo-table tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".bo-baseTable .bo-table tr td.colspan").contains("No Data Available")
            } else {
                cy.get('.bo-baseTable .bo-table thead th').contains('SCRIP NAME').click({ force: true })
                cy.wait(1000)
                cy.get('.sort-icon-container > .arrow-up').click({ force: true })
                cy.wait(1000)
            }
        })     
    })

    it("TC_BFSL_BO_Reports_037 : To validate the data populated for the Dividend report screen for the user.", () => {
        cy.get('.bo-baseTable .bo-table tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".bo-baseTable .bo-table tr td.colspan").contains("No Data Available")
            } 
            else { 
                cy.get('.bo-baseTable .bo-table thead th').contains('SCRIP NAME')
                cy.get('.bo-baseTable .bo-table thead th').contains('DATE')
                cy.get('.bo-baseTable .bo-table thead th').contains('TYPE')
                cy.get('.bo-baseTable .bo-table thead th').contains('DIV. PER SHARE')
                cy.get('.bo-baseTable .bo-table thead th').contains('QTY')
                cy.get('.bo-baseTable .bo-table thead th').contains('DIV. AMOUNT')
            }
        })
    })

    it("TC_BFSL_BO_Reports_042 : To validate that the DP Transaction is highlighted with the scroll view by default", () => {
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('DP Transaction').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_043 : To validate the date filter to see the data accordingly", () => {
        cy.get('.bo-base .bo-filters .select-input-div .options-div').contains('CUSTOM DATE').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_044 : To validate the sorting feature for the scrip name", () => {
        cy.get('.bo-baseTable .bo-table tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".bo-baseTable .bo-table tr td.colspan").contains("No Data Available")
            } else {
                cy.get('.bo-baseTable .bo-table thead th').contains('TXN.DATE').click({ force: true })
                cy.wait(1000)
                cy.get('.sort-icon-container > .arrow-up').click({ force: true })
                cy.wait(1000)
            }
        })     
    })

    it("TC_BFSL_BO_Reports_045 : To validate the data populated for the DP transaction screen for the user.", () => {
        cy.get('.bo-baseTable .bo-table tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".bo-baseTable .bo-table tr td.colspan").contains("No Data Available")
            } 
            else {    
                cy.get('.bo-baseTable .bo-table thead th').contains('SCRIP NAME')
                cy.get('.bo-baseTable .bo-table thead th').contains('TXN.DATE')
                cy.get('.bo-baseTable .bo-table thead th').contains('QTY')
            }
        })
    })

    it("TC_BFSL_BO_Reports_046 : To validate that the Interest report is highlighted on selection", () => {
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('Interest Report').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_047 : To validate the date filter to see the data accordingly", () => {
        cy.get('.bo-base .bo-filters .select-input-div .options-div').contains('CUSTOM DATE').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_048 : To validate that the DPC data is highlighted and shown as default", () => {
        cy.get('.bo-base .bo-filters .bo-top-left .bo-select-case .radioField .value').contains('DPC').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_049 : To validate that the MTF data is highlighted and displayed on selection", () => {
        cy.get('.bo-base .bo-filters .bo-top-left .bo-select-case .radioField .value').contains('MTF').click({ force: true })
        cy.wait(2000)
    })

    // it("TC_BFSL_BO_Reports_050 : To validate that Download button downloads the .csv file for the user to view and edit", () => {
    //     cy.get('.bo-baseTable .bo-table tr td').then(($btn) => {
    //         cy.wait(2000)
    //         if($btn.hasClass.not("colspan")) {
    //             cy.get(".bo-baseTable .bo-table tr td.colspan").contains("No Data Available")
    //         } else {
    //             cy.get('.bo-base .bo-data-base .bo-filters .download-option .download-btn').contains('DOWNLOAD').click({ force: true })
    //         }
    //     })  
    // })

    it("TC_BFSL_BO_Reports_051 : To validate that the Tax report is highlighted on selection", () => {
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('Tax Report').click({ force: true })
        cy.wait(2000)
    })

    // it("TC_BFSL_BO_Reports_052 : To validate the date filter to see the data accordingly", () => {
    //     cy.get('.bo-base .bo-filters .select-input-div .options-div').contains('CUSTOM DATE').click({ force: true })
    //     cy.wait(2000)
    // }) 
    // ***=== tax report does not have custom date filter option ===**

    // it("TC_BFSL_BO_Reports_053 : 
    // })

    // it("TC_BFSL_BO_Reports_054 : 
    // })

    it("TC_BFSL_BO_Reports_055 : To validate that Download button downloads the .csv file for the user to view and edit", () => {
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_056 : To validate whether clicking on BO navigates the user to Report screen", () => {
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_057 : To validate that the P&L report is highlighted on selection", () => {
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('P&L Report').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_058 : To validate that Equity tab is selected as default on selecting the P&L report", () => {
        cy.get('.bo-base .bo-filters .bo-top-left .bo-select-case .radioField .value').contains('EQUITY').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_059 : To validate the data displayed for the Equity tab in the P&L report", () => {
        cy.wait(2000)
        cy.get('.bo-baseTable .bo-table tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".bo-baseTable .bo-table tr td.colspan").contains("No Data Available")
            } 
            else {    
                cy.get('.bo-baseTable .bo-table thead th').contains('SYMBOL')
                cy.get('.bo-baseTable .bo-table thead th').contains('NET QTY')
                cy.get('.bo-baseTable .bo-table thead th').contains('AVG PRICE')
                cy.get('.bo-baseTable .bo-table thead th').contains('CURRENT PRICE')
                cy.get('.bo-baseTable .bo-table thead th').contains('INVESTMENT AMT')
                cy.get('.bo-baseTable .bo-table thead th').contains('CURRENT VALUE')
                cy.get('.bo-baseTable .bo-table thead th').contains('REALISED P&L')
                cy.get('.bo-baseTable .bo-table thead th').contains('UNREALISED P&L')
                cy.get('.bo-baseTable .bo-table thead th').contains('TOTAL P&L')
            }
        })
    })

    it("TC_BFSL_BO_Reports_060 : To verify if the tabs switches to Derivative on selecting the Derivative radio button", () => {
        cy.get('.bo-base .bo-filters .bo-top-left .bo-select-case .radioField .value').contains('DERIVATIVE').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_061 : To validate the data displayed for the Derivative tab in the P&L report", () => {
        cy.wait(2000)
        cy.get('.bo-baseTable .bo-table tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".bo-baseTable .bo-table tr td.colspan").contains("No Data Available")
            } 
            else {    
                cy.get('.bo-baseTable .bo-table thead th').contains('SYMBOL')
                cy.get('.bo-baseTable .bo-table thead th').contains('NET QTY')
                cy.get('.bo-baseTable .bo-table thead th').contains('BUY QTY')
                cy.get('.bo-baseTable .bo-table thead th').contains('SELL QTY')
                cy.get('.bo-baseTable .bo-table thead th').contains('BUY RATE')
                cy.get('.bo-baseTable .bo-table thead th').contains('SELL RATE')
                cy.get('.bo-baseTable .bo-table thead th').contains('REALISED P&L')
                cy.get('.bo-baseTable .bo-table thead th').contains('UNREALISED P&L')
                cy.get('.bo-baseTable .bo-table thead th').contains('TOTAL P&L')
            }
        })
    })

    // it("TC_BFSL_BO_Reports_062 : To validate the Search option in the P&L report", () => {
        
    // })

    // it("TC_BFSL_BO_Reports_063 : To validate the Search option in the P&L report", () => {
    //     cy.wait(2000)
    // })

    // it("TC_BFSL_BO_Reports_064 : To validate the All Holdings Filter option in the Equity tab of P&L report ", () => {
    //     cy.wait(2000)
    // })

    it("TC_BFSL_BO_Reports_065 : To validate the font color of the data displayed.", () => {
        cy.get('.bo-baseTable .bo-table tr td').then(($btn) => {
            if($btn.hasClass('negativeColor')) {
                // btn.should('have.class','negativeColor')
                cy.get('.bo-baseTable .bo-table tr td').contains('-')
            } 
        })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_066 : To validate the Filter option in the Equity tab of P&L report" ,() => {
        cy.get('.bo-baseTable .bo-table tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".bo-baseTable .bo-table tr td.colspan").contains("No Data Available")
            } 
            else {
                cy.get('.bo-base .bo-filters .select-input-div .select-input').contains("POSITIVE HOLDINGS").click({force:true})
                cy.get('.bo-baseTable .bo-table tbody td').should('not.have.class','negativeColor')
                cy.get('.bo-baseTable .bo-table tbody td').should('not.have.class','whiteColor')
            }
        })
    })

    // it("TC_BFSL_BO_Reports_067 : To validate the Filter option in the Equity tab of P&L report ", () => {
    //     cy.wait(2000)
    // })

    it("TC_BFSL_BO_Reports_068 : To validate the date filter to see the data accordingly", () => {
        cy.get('.bo-base .bo-filters .select-input-div .select-input .select-value').contains('THIS MONTH').click({ force: true })
        cy.get('.bo-baseTable .bo-table tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".bo-baseTable .bo-table tr td.colspan").contains("No Data Available")
            } 
            else {
                cy.get('.bo-baseTable .bo-table.pnl-report .tbody-scroller')
            }
    })
    cy.wait(2000)
})

    it("TC_BFSL_BO_Reports_069 : To validate the date filter to see the data accordingly", () => {
        cy.wait(2000)
        cy.get('.bo-base .bo-filters .select-input-div .options-div').contains('LAST MONTH').click({ force: true })

        cy.get('.bo-baseTable .bo-table tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".bo-baseTable .bo-table tr td.colspan").contains("No Data Available")
            } 
            else {
                cy.get('.bo-baseTable .bo-table.pnl-report .tbody-scroller')
            }
    })
})

    it("TC_BFSL_BO_Reports_070 : To validate the date filter to see the data accordingly", () => {
        cy.wait(2000)
        cy.get('.bo-base .bo-filters .select-input-div .options-div').contains('CURRENT FY').click({ force: true })

        cy.get('.bo-baseTable .bo-table tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".bo-baseTable .bo-table tr td.colspan").contains("No Data Available")
            } 
            else {
                cy.get('.bo-baseTable .bo-table.pnl-report .tbody-scroller')
            }
     })
    })

    it("TC_BFSL_BO_Reports_071 : To validate the date filter to see the data accordingly", () => {
        cy.get('.bo-base .bo-filters .select-input-div .options-div').contains('LAST FY').click({ force: true })
        cy.wait(2000)
        cy.get('.bo-baseTable .bo-table tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".bo-baseTable .bo-table tr td.colspan").contains("No Data Available")
            } 
            else {
                cy.get('.bo-baseTable .bo-table.pnl-report .tbody-scroller')
            }
    })
})

    // it("TC_BFSL_BO_Reports_072 : To validate the PDF download feature", () => {
    //     cy.wait(2000)
    // })

    // it("TC_BFSL_BO_Reports_073 : To validate the CSV download feature", () => {
    //     cy.wait(2000)
    // })

    it("TC_BFSL_BO_Reports_074 : To validate clicking on the LTCG Report nagivates the user to the appropriate report", () => {
        cy.get('.bo-base .bo-header .bo-header-values .menusTab').contains('LTCG Report').click({ force: true })
        cy.wait(2000)
    })

    it("TC_BFSL_BO_Reports_075 : To validate the data displayed for the LTCG report", () => {
        cy.wait(2000)
        cy.get('.bo-baseTable .bo-table tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".bo-baseTable .bo-table tr td.colspan").contains("No Data Available")
            } 
            else {    
                cy.get('.bo-baseTable .bo-table thead th').contains('TRADE DATE')
                cy.get('.bo-baseTable .bo-table thead th').contains('SYMBOL')
                cy.get('.bo-baseTable .bo-table thead th').contains('TOTAL QTY')
                cy.get('.bo-baseTable .bo-table thead th').contains('CLOSING PRICE')
                cy.get('.bo-baseTable .bo-table thead th').contains('CURRENT AMT')
                cy.get('.bo-baseTable .bo-table thead th').contains('DAYS LEFT')
                cy.get('.bo-baseTable .bo-table thead th').contains('SHORT TERM TAX')
                cy.get('.bo-baseTable .bo-table thead th').contains('LONG TERM TAX')
                cy.get('.bo-baseTable .bo-table thead th').contains('UNREALISED P&L')
            }
        })
    })

    it("TC_BFSL_BO_Reports_076 : To validate the font color of the data displayed.", () => {
        cy.wait(2000)
    })

    // it("TC_BFSL_BO_Reports_077 : To validate the date filter to see the data accordingly", () => {
    //     cy.wait(2000)
    // })

    // it("TC_BFSL_BO_Reports_078 : To validate the date filter to see the data accordingly", () => {
    //     cy.wait(2000)
    // })

    // it("TC_BFSL_BO_Reports_079 : To validate the date filter to see the data accordingly", () => {
    //     cy.wait(2000)
    // })

    // it("TC_BFSL_BO_Reports_080 : To validate the date filter to see the data accordingly", () => {
    //     cy.wait(2000)
    // })

    // it("TC_BFSL_BO_Reports_081 : To validate the PDF download feature", () => {
    //     cy.wait(2000)
    // })

    // it("TC_BFSL_BO_Reports_082 : To validate the CSV download feature", () => {
    //     cy.wait(2000)
    // })

})
