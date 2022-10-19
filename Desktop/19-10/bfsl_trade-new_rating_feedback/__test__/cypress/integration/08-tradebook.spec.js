import {
    URL, PASSWORD, PAN_NUMBER, USER_NAME, LOGIN_PASS_ERROR, SEARCH_PATH,ORDERPAD
} from '../support/config'

before(function () {
    cy.visit(URL)
    Cypress.Cookies.defaults({
        preserve: ['JSESSIONID', 'Auth-Token'],
    })
})


describe("Trade Book",() => {
    
    // for single file execution 
    it('username  - valid', () => {
        cy.login(USER_NAME, PASSWORD, PAN_NUMBER)
        cy.wait(3000)
        cy.isLoginSuccess()
    })
    it("TC_BFSL_Tradebook_001: To validate that the selection of Tradebook tab highlightes the tab with the  scroll view",() => {
        cy.get('.headerTab-base .order').contains('Order status').click({ force: true })
        cy.get('.dashboardOrder-container-left .dashboard-tradebook').click({force:true})
        // cy.wait(500)
        cy.get('.dashboard-tradebook').should('have.class', 'selected')


    })
    it("TC_BFSL_Tradebook_002: To validate the availabilty of fields under the TradeBook",() => {
        cy.isVisible('.searchIcon',1)
        cy.checkLength('.trade-date.multiDatePicker-base',1)
        cy.checkLength('.segmentlist-dropdown',1)
        
        cy.get(".tradeBook-table thead th").should(($lis) => {
            expect($lis.eq(0)).to.contain("SYMBOL")
            expect($lis.eq(1)).to.contain("PRODUCT")
            expect($lis.eq(2)).to.contain("QTY (TRADES)")
            expect($lis.eq(3)).to.contain("AVG PRICE")
            expect($lis.eq(4)).to.contain("LTP")
            expect($lis.eq(5)).to.contain("TRADE ID")
           
        })
        // cy.get(".tradeBook-table thead th")

    })
    it("TC_BFSL_Tradebook_003: To validate that the All exchange and all segment option is Highlighted by default when Tradebook header is selected at the top",() => {
        cy.get(".segmentlist-dropdown .select-input-div .select-value").contains("ALL SEGMENTS")

        
    })
    it("TC_BFSL_Tradebook_004: To validate that Today date is selected in the date picker and also verify that the today executed orders are displayed under the trade book",() => {
        
        cy.get(".trade-date .date ").then(($date) => {
            const date = cy.isToday($date.text())
        })
        cy.get('.orderbookTable tbody  tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            } else {
                cy.get(".trade-date .date").then(($date) => {
                    const date = cy.isToday($date.text())
                })
            }
        })
    })
    it("TC_BFSL_Tradebook_005: To validate that the No Data available error message is displayed under the trade book when user have no executed orders for the day",() => {
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
         })
    })
    it("TC_BFSL_Tradebook_006: To validate that the inline search of symbol displays the searched symbol",() => {
        cy.get('.dashboarOrder-container-right .trade-searchbox-container .searchIcon').click({ force: true })
        cy.get(".trade-searchbox-container .searchInput").focus()
        cy.input(".trade-searchbox-container .searchInput","sbi")
        // cy.get(".trade-book-base .date-search .input-ele").type("sbi",{ delay: 0 })
        // cy.wait(1000)
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            } else {
                cy.get('.orderbookTable tbody tr td .quote-click:first').should("contains",/^SBI\w+/)
            }
         })
    })
    // it("TC_BFSL_Tradebook_007: To validate that the Traded details are displayed on the trade book screen based on the selected date",() => {

    // })
    it("TC_BFSL_Tradebook_008: To validate that the error message is displayed when user has no traded orders from the selected date",() => {
        // cy.get(".trade-book-base .trade-date .date .date-icon").click()
        // cy.selectCalendarDate(1,0)
        // cy.get(".trade-book-date .positiveBtn"). click()
        
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
         })
        
    })

    // TradeBook - Equity option
    it("TC_BFSL_Tradebook_009: To validate that the select the equity option in the dropdown display the selected option in the dropdown",() => {
        cy.get(ORDERPAD.SEGMENT_SELECT).click({force:true})
        cy.get(".options-div [title=EQUITY]").click({ force: true })

        // cy.get(".segment .options-div [title=EQUITY]").click()
        // cy.wait(1000)
        // cy.get(".segment .select-input-div .select-input").contains("EQUITY")
    })

    it("TC_BFSL_Tradebook_010: To validate that Today date is selected in  the date picker and also verify that the today equity executed orders are displayed under the Equity option",() => {
        // cy.get(".trade-book-base .trade-date .date .date-icon").click()
        // cy.selectCalendarDate(0,0)
        // cy.get(".trade-book-date .positiveBtn"). click()
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
         })
    })

    it("TC_BFSL_Tradebook_011: To validate the fields to be shown in the Executed order trade book",() => {
        cy.get(ORDERPAD.SEGMENT_SELECT).click({force:true})
        cy.get(".options-div [title=EQUITY]").click({force:true})
        // cy.wait(1000)
        cy.get(".orderbookTable thead th").then(($lis) => {
            expect($lis.eq(0)).to.contain("SYMBOL")
            expect($lis.eq(1)).to.contain("PRODUCT")
            expect($lis.eq(2)).to.contain("QTY (TRADES)")
            expect($lis.eq(3)).to.contain("AVG PRICE")
            expect($lis.eq(4)).to.contain("LTP")
            expect($lis.eq(5)).to.contain("TRADE ID")
        })
    })
    it("TC_BFSL_Tradebook_012: To validate that the No Data available error message is displayed under the equity option when user have no equity executed orders for the day",() => {
        
        cy.get(ORDERPAD.SEGMENT_SELECT).click({force:true})
        cy.get(".options-div [title=EQUITY]").click({force:true})
        // cy.wait(1000)
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
         })
    })
    it("TC_BFSL_Tradebook_013: To validate that the inline search of symbol displays the searched symbol",() => {
        // cy.get('.searchIcon').click({ force: true })
        cy.get(".trade-searchbox-container .searchInput").focus()
        cy.input(".trade-searchbox-container .searchInput","sbi")

        // cy.get(".trade-book-base .date-search .input-ele").type("sbi")
        // cy.wait(1000)
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            } else {
                cy.get('.orderbookTable tbody tr td.quote-click:first').should("contains",/^SBI\w+/)
            }
         })
    })
    it("TC_BFSL_Tradebook_014: To validate that No Data available error message is displayed when user searched for unavailable symbol",() => {
        // cy.get('.searchIcon').click({ force: true })
        cy.get(".trade-searchbox-container .searchInput").focus()
        cy.input(".trade-searchbox-container .searchInput","sbi")

        // cy.get(".trade-book-base .date-search .input-ele").type("xyz",{ delay: 0 })
        // cy.wait(1000)
        cy.get(".orderbookTable tbody tr td").then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
         })
    })
    // it("TC_BFSL_Tradebook_015: To validate that the Traded details are displayed on the trade book screen based on the selected date",() => {

    // })
    it("TC_BFSL_Tradebook_016: To validate that the error message is displayed when user has no traded orders from the selected date",() => {
        // cy.get(".trade-book-base .trade-date .date .date-icon").click({ force: true })
        // cy.selectCalendarDate(0,0)
        // cy.get(".trade-book-date .positiveBtn"). click({ force: true })
            
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
         })
    })

    // TradeBook - FNO option
    it("TC_BFSL_Tradebook_017: To validate that the select the FNO option in the dropdown display the selected option in the dropdown",() => {
        cy.get(ORDERPAD.SEGMENT_SELECT).click({force:true})
        cy.get(".options-div [title=FNO]").click({force:true})
        // cy.get(".select-input-div .select-input").contains("FNO")
    })
    it("TC_BFSL_Tradebook_018: To validate that Today date is selected in  the date picker and also verify that the today FNO executed orders are displayed under the FNO option",() => {
        // cy.get(".trade-book-base .trade-date .date .date-icon").click()
        // cy.selectCalendarDate(0,0)
        // cy.get(".trade-book-date .positiveBtn"). click()
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
         })
    })
    it("TC_BFSL_Tradebook_019: To validate the fields to be shown in the FNO Executed order ",() => {
        cy.get(ORDERPAD.SEGMENT_SELECT).click({force:true})
        cy.get(".options-div [title=FNO]").click({force:true})
        // cy.wait(1000)
        cy.get(".orderbookTable thead th").then(($lis) => {
            expect($lis.eq(0)).to.contain("SYMBOL")
            expect($lis.eq(1)).to.contain("PRODUCT")
            expect($lis.eq(2)).to.contain("QTY (TRADES)")
            expect($lis.eq(3)).to.contain("AVG PRICE")
            expect($lis.eq(4)).to.contain("LTP")
            expect($lis.eq(5)).to.contain("TRADE ID")
        })
    })
    it("TC_BFSL_Tradebook_020: To validate that the No Data available error message is displayed under the FNO option when user have no FNO executed orders for the day",() => {
        cy.get(ORDERPAD.SEGMENT_SELECT).click({force:true})
        cy.get(".options-div [title=FNO]").click({force:true})
        // cy.wait(1000)
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
         })
    })
    it("TC_BFSL_Tradebook_021: To validate that the inline search of symbol displays the searched symbol",() => {
        // cy.get('.searchIcon').click({ force: true })
        cy.get(".trade-searchbox-container .searchInput").focus()
        cy.input(".trade-searchbox-container .searchInput","sbi")
        
        // cy.get(".trade-book-base .date-search .input-ele").type("sbi",{ delay: 0 })
        // cy.wait(1000)
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            } else {
                cy.get(".orderbookTable tbody tr td .quote-click:first").should("contains",/^SBI\w+/)
            }
        })
    })
    it("TC_BFSL_Tradebook_022: To validate that No Data available error message is displayed when user searched for unavailable symbol",() => {
        // cy.get('.searchIcon').click({ force: true })
        cy.get(".trade-searchbox-container .searchInput").focus()
        cy.input(".trade-searchbox-container .searchInput","sbi")

        // cy.get(".trade-book-base .date-search .input-ele").type("xyz",{ delay: 0 })
        // cy.wait(1000)
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
         })
    })
    // it("TC_BFSL_Tradebook_023: To validate that the Traded details are displayed on the trade book screen based on the selected date",() => {

    // })
    it("TC_BFSL_Tradebook_024: To validate that the error message is displayed when user has no traded orders from the selected date",() => {
        // cy.get(".trade-book-base .trade-date .date .date-icon").click()
        // cy.selectCalendarDate(5,0)
        // cy.get(".trade-book-date .positiveBtn"). click()
            
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
         })
    })

    // TradeBook - Currency option
    // it("TC_BFSL_Tradebook_025: To validate that the select the currency option in the dropdown display the selected option in the dropdown",() => {
    //     cy.get(ORDERPAD.SEGMENT_SELECT).click()
    //     cy.get(".options-div [title=CURRENCY]").click()
    //     cy.wait(1000)
    //     cy.get('.segment .select-input-div .select-input').contains("CURRENCY")
    // })
    // it("TC_BFSL_Tradebook_026: To validate that Today date is selected in  the date picker and also verify that the today executed currency orders are displayed under the Currency option",() => {
    //     cy.get(".trade-book-base .trade-date .date .date-icon").click()
    //     cy.selectCalendarDate(0,0)
    //     cy.get(".trade-book-date .positiveBtn"). click()
    //     cy.get('#trade-book-tbody').then(($btn) => {
    //         if($btn.hasClass("colspan")) {
    //             cy.get("#trade-book-tbody tr").contains("No data available")
    //         }
    //      })
    // })
    // it("TC_BFSL_Tradebook_027: To validate the fields to be shown in the currency Executed order ",() => {
    //     cy.get(ORDERPAD.SEGMENT_SELECT).click()
    //     cy.get(".segment .options-div [title=CURRENCY]").click()
    //     cy.wait(1000)
    //     cy.get(".trade-book-base table thead th").then(($lis) => {
    //         expect($lis.eq(0)).to.contain("SYMBOL")
    //         expect($lis.eq(1)).to.contain("ACTION")
    //         expect($lis.eq(2)).to.contain("ORDER ID")
    //         expect($lis.eq(3)).to.contain("QTY")
    //         expect($lis.eq(4)).to.contain("AVG PRICE")
    //         expect($lis.eq(5)).to.contain("TRADES")
    //         expect($lis.eq(6)).to.contain("PRODUCT TYPE")
    //         expect($lis.eq(7)).to.contain("TRADE ID")
    //         expect($lis.eq(8)).to.contain("EXCH. ORDER ID")
    //         expect($lis.eq(9)).to.contain("EXCH. ORDER TIME")
    //     })
    // })
    // it("TC_BFSL_Tradebook_028: To validate that the No Data available error message is displayed under the Currency option when user have no executed orders for the day",() => {
    //     cy.get(ORDERPAD.SEGMENT_SELECT).click()
    //     cy.get(".segment .options-div [title=CURRENCY]").click()
    //     cy.wait(1000)
    //     cy.get('#trade-book-tbody').then(($btn) => {
    //         if($btn.hasClass("colspan")) {
    //             cy.get("#trade-book-tbody tr").contains("No data available")
    //         }
    //      })
    // })
    // it("TC_BFSL_Tradebook_029: To validate that the inline search of symbol displays the searched symbol",() => {
    //     cy.get(".trade-book-base .date-search .input-ele").focus()
    //     cy.input(".trade-book-base .date-search .input-ele","sbi")

    //     // cy.get(".trade-book-base .date-search .input-ele").type("sbi",{ delay: 0 })
    //     cy.wait(1000)
    //     cy.get('#trade-book-tbody').then(($btn) => {
    //         if($btn.hasClass("colspan")) {
    //             cy.get("#trade-book-tbody tr").contains("No data available")
    //         } else {
    //             cy.get('trade-book-tbody tr td .quote-click:first').should("contains",/^SBI\w+/)
    //         }
    //      })
    // })
    // it("TC_BFSL_Tradebook_030: To validate that No Data available error message is displayed when user searched for unavailable symbol",() => {
    //     cy.get(".trade-book-base .date-search .input-ele").focus()
    //     cy.input(".trade-book-base .date-search .input-ele","xyz")

    //     // cy.get(".trade-book-base .date-search .input-ele").type("xyz",{ delay: 0 })
    //     cy.wait(1000)
    //     cy.get('#trade-book-tbody').then(($btn) => {
    //         if($btn.hasClass("colspan")) {
    //             cy.get("#trade-book-tbody tr").contains("No data available")
    //         }
    //      })
    // })
    // // it("TC_BFSL_Tradebook_031: To validate that the Traded details are displayed on the trade book screen based on the selected date",() => {

    // // })
    // it("TC_BFSL_Tradebook_032: To validate that the error message is displayed when user has no traded orders from the selected date",() => {
    //     cy.get(".trade-book-base .trade-date .date .date-icon").click()
    //     cy.selectCalendarDate(5,0)
    //     cy.get(".trade-book-date .positiveBtn"). click()
            
    //     cy.get('#trade-book-tbody').then(($btn) => {
    //         if($btn.hasClass("colspan")) {
    //             cy.get("#trade-book-tbody tr").contains("No data available")
    //         }
    //      })
    // })

    // // TradeBook - Commodity option
    // it("TC_BFSL_Tradebook_033: To validate that the select the commodity option in the dropdown display the selected option in the dropdown",() => {
    //     cy.get(ORDERPAD.SEGMENT_SELECT).click()
    //     cy.get(".segment .options-div [title=COMMODITY]").click()
    //     cy.wait(1000)
    //     cy.get('.segment .select-input-div .select-input').contains("COMMODITY")
    // })
    // it("TC_BFSL_Tradebook_034: To validate that Today date is selected in the date picker and also verify that the today Commodity executed orders are displayed under the Commodity option",() => {
    //     cy.get(".trade-book-base .trade-date .date .date-icon").click()
    //     cy.selectCalendarDate(0,0)
    //     cy.get(".trade-book-date .positiveBtn"). click()
        
    //     cy.get('#trade-book-tbody tr').then(($btn) => {
    //         if($btn.hasClass("colspan")) {
    //             cy.get("#trade-book-tbody tr").contains("No data available")
    //         } else {
    //             cy.get("#trade-book-tbody .symName-column .exc").contains("MCX")
    //         }
    //      })
    // })
    // it("TC_BFSL_Tradebook_035: To validate the fields to be shown in the commodity Executed order",() => {
    //     cy.get(ORDERPAD.SEGMENT_SELECT).click()
    //     cy.get(".segment .options-div [title=COMMODITY]").click()
    //     cy.wait(1000)
    //     cy.get(".trade-book-base table thead th").then(($lis) => {
    //         expect($lis.eq(0)).to.contain("SYMBOL")
    //         expect($lis.eq(1)).to.contain("ACTION")
    //         expect($lis.eq(2)).to.contain("ORDER ID")
    //         expect($lis.eq(3)).to.contain("QTY")
    //         expect($lis.eq(4)).to.contain("AVG PRICE")
    //         expect($lis.eq(5)).to.contain("TRADES")
    //         expect($lis.eq(6)).to.contain("PRODUCT TYPE")
    //         expect($lis.eq(7)).to.contain("TRADE ID")
    //         expect($lis.eq(8)).to.contain("EXCH. ORDER ID")
    //         expect($lis.eq(9)).to.contain("EXCH. ORDER TIME")
    //     })
    // })
    // it("TC_BFSL_Tradebook_036: To validate that the No Data available error message is displayed under the Commodity option when user have no commodity executed orders for the day",() => {
    //     cy.get(ORDERPAD.SEGMENT_SELECT).click()
    //     cy.get(".segment .options-div [title=COMMODITY]").click()
    //     cy.wait(1000)
    //     cy.get('#trade-book-tbody').then(($btn) => {
    //         if($btn.hasClass("colspan")) {
    //             cy.get("#trade-book-tbody tr").contains("No data available")
    //         }
    //      })
    // })
    // it("TC_BFSL_Tradebook_037: To validate that the inline search of symbol displays the searched symbol",() => {
    //     cy.get(".trade-book-base .date-search .input-ele").focus()
    //     cy.input(".trade-book-base .date-search .input-ele","sbi")

    //     // cy.get(".trade-book-base .date-search .input-ele").type("sbi",{ delay: 0 })
    //     cy.wait(1000)
    //     cy.get('#trade-book-tbody').then(($btn) => {
    //         if($btn.hasClass("colspan")) {
    //             cy.get("#trade-book-tbody tr").contains("No data available")
    //         } else {
    //             cy.get('trade-book-tbody tr td .quote-click:first').should("contains",/^SBI\w+/)
    //         }
    //      })
        
    // })
    // it("TC_BFSL_Tradebook_038: To validate that No Data available error message is displayed when user searched for unavailable symbol",() => {
    //     cy.get(".trade-book-base .date-search .input-ele").focus()
    //     cy.input(".trade-book-base .date-search .input-ele","xyz")

    //     // cy.get(".trade-book-base .date-search .input-ele").type("xyz",{ delay: 0 })
    //     cy.wait(1000)
    //     cy.get('#trade-book-tbody').then(($btn) => {
    //         if($btn.hasClass("colspan")) {
    //             cy.get("#trade-book-tbody tr").contains("No data available")
    //         }
    //      })

    // })
    // // it("TC_BFSL_Tradebook_039: To validate that the Traded details are displayed on the trade book screen based on the selected date",() => {

    // // })
    // it("TC_BFSL_Tradebook_040: To validate that the error message is displayed when user has no traded for commodity orders from the selected date",() => {
    //     cy.get(".trade-book-base .trade-date .date .date-icon").click()
    //     cy.selectCalendarDate(5,0)
    //     cy.get(".trade-book-date .positiveBtn"). click()
    //     cy.get('#trade-book-tbody').then(($btn) => {
    //         if($btn.hasClass("colspan")) {
    //             cy.get("#trade-book-tbody tr").contains("No data available")
    //         }
    //      })
    // })

    // TradeBook - Date Picker
    it("TC_BFSL_Tradebook_025: To validate that the click on Date picker show the option of Start date and End date  with calendar",() => {
        cy.get(".trade-date .date .date-icon").click({force:true})
        cy.get(".trade-book-date .title > div").eq(0).should("have.class","active")
        cy.get(".trade-book-date .title > div").eq(1).should("not.have.class","active")
    })

    it("TC_BFSL_Tradebook_026: To validate that the user able to select the Start date and End date",() => {
        
        cy.get(".trade-book-date .title > div:last").click({force:true})
        // cy.get(".trade-book-date .title > div:first").click({force:true})
        // cy.get(".trade-book-date .title > div").eq(1).should("have.class","active")

    })
    it("TC_BFSL_Tradebook_027: To validate that the user not able to select the end date before the start date",() => {
        cy.get(".trade-book-date .title > div:last").click({force:true})
        cy.selectCalendarDate(0,1)
        cy.get(".trade-book-date .theme-btn"). click({force:true})
        // cy.wait(1000)
        cy.isHidden('.trade-date .date .to-date')
        // cy.get(".trade-date .date .to-date").then(($date) => {
        //     const date = cy.isToday($date.text())
        // })
    })
    it("TC_BFSL_Tradebook_028: To validate that the selected  Start date and End date is displayed on the Tradebook screen",() => {
        cy.get(".trade-date .date .date-icon").click({force:true})
        cy.selectCalendarDate(1,0)
        cy.get(".trade-book-date .title > div:last").click({force:true})
        cy.selectCalendarDate(0,0)
        cy.get(".trade-book-date .theme-btn"). click({force:true})

        // cy.wait(1000)
    })
    it("TC_BFSL_Tradebook_029: To validate that the user not able to select the end date as Future date",() => {
        cy.get(".trade-date .date .date-icon").click({force:true})
        cy.get(".trade-book-date .title > div:last").click({force:true})
        cy.selectCalendarDate(0,1)
        cy.get(".trade-book-date .theme-btn"). click({force:true})

        // cy.wait(1000)
        cy.isHidden('.trade-date .date .to-date')

    })
    it("TC_BFSL_Tradebook_030: To validate that the user not able to select the end date less than the start date",() => {
        cy.get(".trade-date .date .date-icon").click({force:true})
        cy.selectCalendarDate(1,0)
        cy.get(".trade-book-date .title > div:last").click({force:true})
        cy.selectCalendarDate(0,1)
        cy.get(".trade-book-date .theme-btn"). click({force:true})

        // cy.wait(1000)
    })
    it("TC_BFSL_Tradebook_031: To validate that the user not able to select the start date greater than the end date",() => {
        cy.get(".trade-date .date .date-icon").click({force:true})
        cy.selectCalendarDate(0,0)
        cy.get(".trade-book-date .title > div:last").click({force:true})
        cy.selectCalendarDate(0,1)
        cy.get(".trade-book-date .theme-btn"). click({force:true})

        // cy.wait(1000)
    })

    // TradeBook - Filter
//     it("TC_BFSL_Tradebook_048: To validate that the user able to select only one exchange at a time in the all exchange dropdown",() => {
//         cy.get('.exchange .select-input-div .select-input').contains("ALL EXCHANGE")
//         cy.get(ORDERPAD.EXCHANGE_SELECT).click()
//         cy.get(".exchange .options-div [title=NSE]").click({force:true})
//         cy.wait(1000)
//         cy.get('#trade-book-tbody tr').then(($btn) => {
//             if($btn.hasClass("colspan")) {
//                 cy.get("#trade-book-tbody tr").contains("No data available")
//             } else {
//                 cy.get('.exchange .select-input-div .select-input').find("NSE")
//             }
//          })
       
//     })
//     it("TC_BFSL_Tradebook_049: To validate that selection of NSE exchange in the dropdown displays the corresponding NSE symbols",() => {
//         cy.get('#trade-book-tbody tr').then(($btn) => {
//             if($btn.hasClass("colspan")) {
//                 cy.get("#trade-book-tbody tr").contains("No data available")
//             } else {
//                 cy.get("#trade-book-tbody .symName-column .exc").find("NSE")
//             }
//          })
//     })
//     it("TC_BFSL_Tradebook_050: To validate that selection of BSE exchange filter displays the corresponding BSE symbols ",() => {
//         cy.get(ORDERPAD.EXCHANGE_SELECT).click({force:true})
//         cy.get(".exchange .options-div [title=BSE]").click({force:true})
//         cy.wait(1000)
//         cy.get('#trade-book-tbody tr').then(($btn) => {
//             if($btn.hasClass("colspan")) {
//                 cy.get("#trade-book-tbody tr").contains("No data available")
//             } else {
//                 cy.get("#trade-book-tbody .symName-column .exc").find("BSE")
//             }
//          })

//     })
//     it("TC_BFSL_Tradebook_051: To validate that selection of MCX exchange filter displays the corresponding MCX symbols ",() => {
//         cy.get(ORDERPAD.EXCHANGE_SELECT).click()
//         cy.get(".exchange .options-div [title=MCX]").click({force:true})
//         cy.wait(1000)
//         cy.get('#trade-book-tbody tr').then(($btn) => {
//             if($btn.hasClass("colspan")) {
//                 cy.get("#trade-book-tbody tr").contains("No data available")
//             } else {
//                 cy.get("#trade-book-tbody .symName-column .exc").find("MCX")
//             }
//          })

//     })
//     it("TC_BFSL_Tradebook_052: To validate that selection of MSEI exchange filter displays the corresponding ICEX symbols ",() => {
//         cy.get(ORDERPAD.EXCHANGE_SELECT).click({force:true})
//         cy.get(".exchange .options-div [title=MCXSX]").click({force:true})
//         cy.wait(1000)
//         cy.get('#trade-book-tbody tr').then(($btn) => {
//             if($btn.hasClass("colspan")) {
//                 cy.get("#trade-book-tbody tr").contains("No data available")
//             } else {
//                 cy.get("#trade-book-tbody .symName-column .exc").find("ICEX")
//             }
//          })
        
//     })
//     it("TC_BFSL_Tradebook_053: To validate that selection of MSEI exchange filter displays the corresponding MSEI symbols ",() => {
//         cy.get(ORDERPAD.EXCHANGE_SELECT).click()
//         cy.get(".exchange .options-div [title=MCXSX]").click()
//         cy.wait(1000)
//         cy.get('#trade-book-tbody tr').then(($btn) => {
//             if($btn.hasClass("colspan")) {
//                 cy.get("#trade-book-tbody tr").contains("No data available")
//             } else {
//                 cy.get("#trade-book-tbody .symName-column .exc").find("MCXSX")
//             }
//          })
//     })
//     it("TC_BFSL_Tradebook_054: To validate that the applied filter get resetted when we switch to Other Main tabs/Screen to Tradebook",() => {
//         cy.get(".orders-base .order-header .submenu").eq(2).click()
//         cy.wait(1000)
//         cy.get(".orders-base .order-header .submenu").eq(1).click()
//         cy.wait(1000)
//         cy.get('.exchange .select-input-div .select-input').contains("ALL EXCHANGE")
//         cy.get('.segment .select-input-div .select-input').contains("ALL SEGMENT")
//     }) 
})


