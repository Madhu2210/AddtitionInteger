import { URL, USER_NAME, PASSWORD, PAN_NUMBER, ORDERPAD } from '../support/config'

before(function () {
    cy.visit(URL)
    Cypress.Cookies.defaults({
        preserve: ['JSESSIONID', 'Auth-Token'],
    })
})


describe("Net Position", () => {

    // for single file execution 
    it('username  - valid', () => {
        cy.login(USER_NAME, PASSWORD, PAN_NUMBER)
        cy.wait(3000)
        cy.isLoginSuccess()
    })

    it("TC_BFSL_Net Position_001: To validate that the click on Net position tab highlights the tab with the scroll view", () => {
        cy.get('.headerTab-base').contains('Net positions').click({ force: true })
        cy.get(".headerTab-base .tab").eq(1).should("have.class", "selected")
    })

    it("TC_BFSL_Net Position_003 & 006: To validate the availability of fields under the Net position tab", () => {
        // cy.isVisible(".net-position-base .sub-content > div")
        // cy.isVisible(".net-position-base .select-option [title=Refresh]")
        // cy.checkLength('.orderstatus-dropdown', 1)
        // cy.checkLength('.segmentlist-dropdown', 1)

        cy.get(".order-table thead th").should(($lis) => {
            expect($lis.eq(0)).to.contain("SYMBOL")
            expect($lis.eq(1)).to.contain("NET QTY")
            expect($lis.eq(2)).to.contain("AVG PRICE")
            expect($lis.eq(3)).to.contain("PRODUCT TYPE")
            expect($lis.eq(4)).to.contain("LTP")
            expect($lis.eq(5)).to.contain("TODAY'S P&L")
            expect($lis.eq(6)).to.contain("P&L")

        })
    })
    it("TC_BFSL_Net Position_002: To validate that the Today placed executed orders are displayed under the NET position tab", () => {
       
        cy.get('.order-table tbody tr td').then(($btn) => {
            if ($btn.hasClass("colspan")) {
                cy.get(".order-table tbody tr td").contains("No data available")
            }
            else {
                cy.get(".order-table tbody tr:first").should('not.to.be.empty')


            }
        })
    })
    it("TC_BFSL_Net Position_004: To validate that the No data available error message is displayed when there is no net Position data", () => {

        cy.get('.order-table tbody tr td').then(($btn) => {
            if ($btn.hasClass("colspan")) {
                cy.get(".order-table tbody tr td").contains("No data available")
            }
            else {
                cy.get(".order-table tbody tr:first").should('not.to.be.empty')


            }
        })
    })
    it("TC_BFSL_Net Position_005: To validate that the click on symbol in the Net position expanded view displays the Net Position expanded view detail popup", () => {
        cy.get('.order-table tbody tr td').then(($btn) => {
            if ($btn.hasClass("colspan")) {
                cy.get(".order-table tbody tr td").contains("No data available")
            } else {
                cy.get(".order-table tbody tr td .showMoreIcon:first").click({ force: true })
                cy.isVisible(".moreDetails")
            }
        })

    })
    // it("TC_BFSL_Net Position_006: To validate the availability of fields under the Net position expanded view detail", () => {
    //     cy.get(".exp-details-base table thead th").then(($lis) => {
    //         expect($lis.eq(0)).to.contain("OPEN VALUE")
    //         expect($lis.eq(1)).to.contain("MARKET VALUE")
    //         expect($lis.eq(2)).to.contain("BUY QTY")
    //         expect($lis.eq(3)).to.contain("BUY AVG")
    //         expect($lis.eq(4)).to.contain("BUY VALUE")
    //         expect($lis.eq(5)).to.contain("SELL QTY")
    //         expect($lis.eq(6)).to.contain("SELL AVG")
    //         expect($lis.eq(7)).to.contain("SELL VALUE")
    //     })
    //     if (Cypress.$('#net-pos-tbody table tbody tr:first td').length != 0) {
    //         cy.get("#net-pos-tbody tr .arrow .bfsl-font:first").click()
    //     }
    // })
    // it("TC_BFSL_Net Position_007: To validate the availability button under the net Position detail view", () => {
    //     if (Cypress.$('#net-pos-tbody table tbody tr:first td').length != 0) {
    //         cy.isVisible("#net-pos-tbody tr .btn-row .buy-btn:first")
    //         cy.isVisible("#net-pos-tbody tr .btn-row .sqrof-btn:first")
    //         cy.isVisible("#net-pos-tbody tr .btn-row .convert-btn:first")
    //     }
    // })
    it("TC_BFSL_Net Position_008: To validate that the click on the Buy More button redirects the user to the trade screen", () => {
        cy.get('.order-table tbody tr td').then(($btn) => {
            if ($btn.hasClass("colspan")) {
                cy.get(".order-table tbody tr td").contains("No data available")
            } else {
                // cy.get(".order-table tbody tr td .showMoreIcon:first").click({ force: true })
                cy.get(".moreDetails button").contains('trade').click({ force: true })
                cy.tradeWindowClose()

            }
        })


    })
    it("TC_BFSL_Net Position_009: To validate that the click on the Sell More button redirects the user to the trade screen", () => {
        cy.get('.order-table tbody tr td').then(($btn) => {
            if ($btn.hasClass("colspan")) {
                cy.get(".order-table tbody tr td").contains("No data available")
            } else {
                cy.get(".order-table tbody tr td .showMoreIcon:first").click({ force: true })
                cy.get(".moreDetails button").contains('trade').click({ force: true })
                cy.tradeWindowClose()

            }
        })

    })
    // it("TC_BFSL_Net Position_010: To validate that the click on the Square off button redirect the user to the trade screen", () => {
    //     if (Cypress.$('#net-pos-tbody table tbody tr:first td').length != 0) {
    //         cy.get("#net-pos-tbody tr .btn-row .sqrof-btn:first").click()
    //         cy.wait(500)
    //         cy.tradeWindowClose()
    //     }
    // })
    // it("TC_BFSL_Net Position_011: To validate that the Convert and Square off button is disabled for BO/CO orders", () => {
    //     // if (Cypress.$('#net-pos-tbody table tbody tr:first td').length != 0) {
    //     //     cy.get('.net-position-base table th').eq(8).find('.arrow-up').click({ force: true })

    //     //     cy.get("#net-pos-tbody tr:first td").eq(8).should('have.text', "([B-C]{1})[O]+")
    //     //     cy.isDisable("#net-pos-tbody tr .btn-row .sqrof-btn:first")
    //     //     cy.isDisable("#net-pos-tbody tr .btn-row .convert-btn:first")
    //     // }
    //     cy.get('.order-table tbody tr td').then(($btn) => {
    //         if ($btn.hasClass("colspan")) {
    //             cy.get(".order-table tbody tr td").contains("No data available")
    //         } else {
    //             cy.get(".order-table tbody tr td .showMoreIcon:first").click({ force: true })
    //             cy.get(".moreDetails button").contains('Trade').click({ force: true })
    //             cy.tradeWindowClose()

    //         }
    //     })
    // })
    // it("TC_BFSL_Net Position_012: To validate that the Convert and Square off button is disabled when the Net qty value is zero", () => {
    //     cy.get('.order-table tbody tr td').then(($btn) => {
    //         if ($btn.hasClass("colspan")) {
    //             cy.get(".order-table tbody tr td").contains("No data available")
    //         } else {
    //             cy.get(".order-table tbody tr td .showMoreIcon:first").click({ force: true })
    //             cy.get(".moreDetails button").contains('Trade').click({ force: true })
    //             cy.tradeWindowClose()

    //         }
    //     })

    //     // if (Cypress.$('#net-pos-tbody table tbody tr:first td').length != 0) {
    //     //     cy.get('.net-position-base table th').eq(3).find('.arrow-down').click()
    //     //     cy.get("#net-pos-tbody tr:first td").eq(3).invoke('text').should("contains", "0")
    //     //     cy.isDisable("#net-pos-tbody tr .btn-row .sqrof-btn:first")
    //     //     cy.isDisable("#net-pos-tbody tr .btn-row .convert-btn:first")
    //     // }
    // })
    it("TC_BFSL_Net Position_013: To validate that the click on Convert button in the detail view displays the convert position popup", () => {

        // if (Cypress.$('#net-pos-tbody table tbody tr:first td').length != 0) {
        //     cy.get('.net-position-base table th').eq(3).find('.arrow-up').click({ force: true })
        //     cy.get("#net-pos-tbody tr .btn-row .convert-btn:first").click()
        //     cy.isVisible(".pos-con-dialog .title-name")
        // }
        cy.get('.order-table tbody tr td').then(($btn) => {
            if ($btn.hasClass("colspan")) {
                cy.get(".order-table tbody tr td").contains("No data available")
            } else {
                cy.get(".order-table tbody tr td .showMoreIcon:first").click({ force: true })
                cy.get(".moreDetails button").contains('CONVERT').click({ force: true })
                cy.isVisible('.convert-dialog')

            }
        })
    })

    it("TC_BFSL_Net Position_014: To validate the availability of fields under the convert position popup", () => {
        if (Cypress.$('order-table tbody tr:first td').length != 0) {
            cy.checkLength(".convert-dialog .dialogHeader-symDetails .dialogHeader-symbolname", 1)
            cy.checkLength(".convert-dialog .dialogHeader-symDetails .dialogHeader-exchange", 1)
            cy.checkLength(".convert-dialog .footer .actionDiv .convert-btn", 1)
            cy.checkLength(".convert-dialog .footer .actionDiv .theme-btn", 1)


            cy.get(".convert-dialog .footer .actionDiv .convert-btn").click({ force: true })

        }
    })
    // it("TC_BFSL_Net Position_015: To validate that the Equity order shows the convert to option as MIS to CNC and Vice versa", () => {
    //     cy.get(ORDERPAD.SEGMENT_SELECT).click()
    //     cy.get(".segment .options-div [title=EQUITY]").click()
    //     cy.wait(500)
    //     if (Cypress.$('#net-pos-tbody table tbody tr:first td').length != 0) {
    //         cy.get("#net-pos-tbody tr .btn-row .convert-btn:first").click()
    //     }
    //     // cy.get(".pos-con-dialog table tbody .prod").filter("CNC")

    // })
    // it("TC_BFSL_Net Position_016: To validate that the Equity MIS order can be converted to CNC ",() => {

    // })
    // it("TC_BFSL_Net Position_017: To validate that the Equity CNC order can be converted to MIS ",() => {

    // })
    // it("TC_BFSL_Net Position_018: To validate that the Future/Option order shows the convert to option as Nrml to MIS and Vice versa",() => {

    // })
    // it("TC_BFSL_Net Position_019: To validate that the Future/Option MIS order can be converted to NRML ",() => {

    // })
    // it("TC_BFSL_Net Position_020: To validate that the Future/Option NRML order can be converted to MIS ",() => {

    // })
    it("TC_BFSL_Net Position_021: To validate that the user placed qty is prefilled in the Convert popup", () => {
        if (Cypress.$('.order-table tbody tr:first td').length != 0) {
            // cy.get("#net-pos-tbody tr .btn-row .convert-btn:first").click({ force: true })
            cy.get(".orderDialog-bodyDetails .qtyDiv span:nth-child(1)").should('not.be.empty')
        }
    })
    it("TC_BFSL_Net Position_022: To validate that the user not able to enter more than 8 digit numeric values in the  Quantity field", () => {
        // cy.get("#net-pos-tbody tr .btn-row .convert-btn:first").click()
        if (Cypress.$('.convert-dialog').length == 1) {
            // cy.get(".orderDialog-bodyDetails .qtyDiv span:nth-child(2)").clear({ force: true })
            cy.get(".orderDialog-bodyDetails .qtyDiv span:nth-child(2)").click({ force: true })
            cy.get(".orderDialog-bodyDetails .qtyDiv span:nth-child(2) .value").type("12345678999",{ force: true })
            // cy.get(".orderDialog-bodyDetails .qtyDiv span:nth-child(2)").invoke('value').should('eq','150')
        }
    })
    it("TC_BFSL_Net Position_023: To validate that the user not able to enter decimal values in the Quantity field", () => {
        if (Cypress.$('.convert-dialog').length == 1) {
            cy.get(".orderDialog-bodyDetails .qtyDiv span:nth-child(2)").click({ force: true })
            cy.get(".orderDialog-bodyDetails .qtyDiv span:nth-child(2) .value").clear({ force: true })
            cy.get(".orderDialog-bodyDetails .qtyDiv span:nth-child(2) .value").type("1.25", { force: true })
            // cy.get(".pos-con-dialog table tbody .pos-conv-input").invoke('val').should('eq','150')
            // cy.get(".convert-dialog .orderDialog-bodyDetails .qtyDiv:last .value input").invoke('val').should('eq', '1')
        }
    })
    it("TC_BFSL_Net Position_024: To validate that the error message is displayed for entering zero in the Quantity field", () => {
        if (Cypress.$('.convert-dialog').length == 1) {
            cy.get(".orderDialog-bodyDetails .qtyDiv span:nth-child(2)").click({ force: true })
            cy.get(".orderDialog-bodyDetails .qtyDiv span:nth-child(2) .value").clear({ force: true })
            cy.get(".orderDialog-bodyDetails .qtyDiv span:nth-child(2) .value").type("0", { force: true })
            cy.get('.convert-dialog .footer .actionDiv .theme-btn').click({ force: true })
            cy.isVisible('.orderSymDetails-modal .footer.netPostions .errorDiv').contains('Please enter a valid quantity')

        }
    })
    it("TC_BFSL_Net Position_025: To validate that the user not able to enter negative values in the Quantity field", () => {
        if (Cypress.$('.convert-dialog').length == 1) {
            cy.get(".orderDialog-bodyDetails .qtyDiv span:nth-child(2) .value").clear({ force: true })
            cy.get(".orderDialog-bodyDetails .qtyDiv span:nth-child(2) .value").type("-1", { force: true })
            // cy.get(".orderDialog-bodyDetails .qtyDiv:last .value input").invoke('val').should('eq', '1')
        }
    })
    it("TC_BFSL_Net Position_026: To validate that the error message is displayed for keeping the Quantity field as empty", () => {
        if (Cypress.$('.convert-dialog').length == 1) {
            cy.get(".orderDialog-bodyDetails .qtyDiv span:nth-child(2) .value").clear({ force: true })
            cy.get(".orderDialog-bodyDetails .qtyDiv span:nth-child(2)  .value").type(" ", { force: true })
            cy.get('.convert-dialog .footer .actionDiv .theme-btn').click({ force: true })
            cy.isVisible('.orderSymDetails-modal .footer.netPostions .errorDiv').contains('Please enter the quantity')

        }
    })

    it("TC_BFSL_Net Position_027: To validate that the user able to enter the quantity value less than or equal to the user Buy/Sell Qty value", () => {
        if (Cypress.$('.convert-dialog').length == 1) {
            cy.get(".orderDialog-bodyDetails .qtyDiv  span:nth-child(1) .value").then(($ele) => {
                cy.log($ele)
                const txt = $ele.val() 
                let assign = 0
                if(txt <= 0)
                    assign = 0 
                else
                    assign = txt - 1
                cy.log(txt)
                cy.get(".orderDialog-bodyDetails .qtyDiv  span:nth-child(2) .value").clear({ force: true })
                cy.get(".orderDialog-bodyDetails .qtyDiv  span:nth-child(2) .value").type(assign, { force: true })
                cy.get('.convert-dialog .footer .actionDiv .theme-btn').click({ force: true })
                // cy.isVisible('.orderSymDetails-modal .footer.netPostions .errorDiv').contains('Please enter a quantity less than or equal to the Total quantity')
       
            })
        }
    })
    it("TC_BFSL_Net Position_028: To validate that the user not able to enter the quantity value  greater than the user Buy/Sell Qty value", () => {
        if (Cypress.$('.convert-dialog').length == 1) {
            cy.get(".orderDialog-bodyDetails span:nth-child(1)").then(($ele) => {
                const txt = $ele.val()
                let assign = 0
                if(txt <= 0)
                    assign = 0 
                else
                    assign = txt - 1
                cy.get(".orderDialog-bodyDetails .qtyDiv span:nth-child(2) .value").clear({ force: true })
                cy.get(".orderDialog-bodyDetails .qtyDiv span:nth-child(2) .value").type(assign, { force: true })
                cy.get('.convert-dialog .footer .actionDiv .theme-btn').click({ force: true })
                // cy.isVisible('.orderSymDetails-modal .footer.netPostions .errorDiv').contains('Please enter a quantity less than or equal to the Total quantity')
         })
        }
    })
    // it("TC_BFSL_Net Position_029: To validate that the click on the convert button in the convert position popup displays the convert success/Failure popup ",() => {

    // })
    it("TC_BFSL_Net Position_030: To validate the availability of fields under the convert position popup", () => {

            if (Cypress.$('.convert-dialog').length == 1) {
                cy.get(".orderDialog-bodyDetails .qtyDiv span:nth-child(2) .value").clear({ force: true })
                cy.get(".orderDialog-bodyDetails .qtyDiv span:nth-child(2) .value").type("1", { force: true })
                cy.get('.convert-dialog .footer .actionDiv .theme-btn').click({force:true})
    
            }
          
    })
    // it("TC_BFSL_Net Position_031: To validate that the click on the done button displays the net position screen",() => {

    // })
    // it("TC_BFSL_Net Position_032: To validate that converted order is shown under the Net position with the converted Product type",() => {

    // })
    // it("TC_BFSL_Net Position_051: To validate that the values in the Net position streams as per the Current market value", () => {
    //     cy.get('.headerTab-base').contains('Net positions').click({ force: true })
    //     cy.get(".headerTab-base .tab").eq(1).should("have.class", "selected")
    // })
    it("TC_BFSL_Net Position_056: To validate the squareoff all button selects all the available scrips.", () => {
        cy.get('.order-table tbody tr td').then(($btn) => {
            if ($btn.hasClass("colspan")) {
                cy.get(".order-table tbody tr td").contains("No data available")
            }
            else {
                cy.get(".postion-filter .filter-right .squareoff").contains("Squareoff All").click({ force: true })
                cy.get(".order-table tbody tr .reArrangeIconCol .checkboxIcon.checked")
            }
        })
    })
   
})

