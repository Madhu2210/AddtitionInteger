import { URL, USER_NAME, PASSWORD, PAN_NUMBER, ORDER_TYPES, ORDER_BOOK, ORDER_SYMBOL, ORDER_KEYS, ORDERPAD, ORDER_PATH } from '../support/config'

before(function () {
    cy.wait(1000)
    cy.visit(URL)
    Cypress.Cookies.defaults({
        preserve: ['JSESSIONID', 'Auth-Token'],
    })
})

describe("Order Book", () => {

    // for single file execution 
    it('username  - valid', () => {
        cy.wait(1000)
        cy.login(USER_NAME, PASSWORD, PAN_NUMBER)
        cy.wait(3000)
        cy.isLoginSuccess()
    })
    it('TC_BFSL_OrderBook_001    ', () => {
        cy.checkText('.headerTab-base', 'Net positions')

        cy.checkText('.headerTab-base', 'Order status')
        cy.get('.headerTab-base .order').contains('Order status').click({ force: true })
        cy.checkText('.dashboardOrder_container', 'Order Book')
        cy.checkText('.dashboardOrder_container', 'Trade Book')

    })

    it('TC_BFSL_OrderBook_002: To validate that the Orderbook tab is highlighted with the scroll by default ', () => {
        cy.get('.dashboard-orderbook').should('have.class', 'selected')

    })

    it('TC_BFSL_OrderBook_003 : To validate the availability of fields under the OrderBook tab ', () => {
        // cy.get('.dashboard-orderbook').should('have.class', 'selected')
        cy.checkLength('.orderstatus-dropdown', 1)
        cy.checkLength('.segmentlist-dropdown', 1)
        cy.checkText('.orderBook-table thead', 'SYMBOL')
        cy.checkText('.orderBook-table thead', 'STATUS')
        cy.checkText('.orderBook-table thead', 'PRODUCT')
        cy.checkText('.orderBook-table thead', 'PRICE')
        cy.checkText('.orderBook-table thead', 'LTP')
        cy.checkText('.orderBook-table thead', 'QTY')

    })
    it('TC_BFSL_OrderBook_004: To validate that the selection of Orderbook tab highlights the All status/All Exchange/All segment by default', () => {
        cy.get(".orderstatus-dropdown .select-input-div .select-value").contains("ALL STATUS")
        cy.get(".segmentlist-dropdown .select-input-div .select-value").contains("ALL SEGMENTS")

    })
    it('TC_BFSL_OrderBook_005', () => {
        if (Cypress.$('.orderbookTable tbody tr:first td').length != 0) {
            cy.get('.orderbookTable').should('not.to.be.empty')

        }
    })
    it("TC_BFSL_OrderBook_006: To validate that the No Data available error message is displayed under the All status for the user who does not have any orders", () => {
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if ($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
        })
    })
    it("TC_BFSL_OrderBook_007: To validate that the No Data available error message is displayed under the All status for the user who does not have any orders", () => {
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("SYMBOL")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("STATUS")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("PRICE")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("PRODUCT")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("QTY")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("LTP")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("QTY")

    })

    it("TC_BFSL_OrderBook_008: To validate that click on Done button in the Order success/failure popup redirect the user to the Orderbook screen and Verify that the Placed order is reflected under the All status", () => {
        cy.openSearch(ORDER_SYMBOL, "NSE", "BUY")
        cy.wait(100)
        cy.placeorder(ORDER_SYMBOL, {
            // [ORDER_KEYS.PRODUCT_TYPE]: PRODUCT_TYPES.PRD_MIS,
            [ORDER_KEYS.ORDER_TYPE]: ORDER_TYPES.ORD_MRK,
            // [ORDER_KEYS.QTY]: 1
        })
        // check order book is opened.
        cy.get('.dashboard-orderbook').should('have.class', 'selected')

    })
    it("TC_BFSL_OrderBook_009: To validate that the selection of Executed option in the all status dropdown displays the selected option in the dropdown", () => {
        cy.get(ORDERPAD.STATUS_SELECT).click({ force: true })
        cy.get(".options-div [title=EXECUTED]").click({ force: true })
        // cy.wait(1000)
    })

    it("TC_BFSL_OrderBook_010: To validate that the selection of Executed option displays, all the Executed order details", () => {
        cy.get(ORDERPAD.STATUS_SELECT).click({ force: true })
        cy.get(".options-div [title=EXECUTED]").click({ force: true })
        // cy.wait(500)
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            } else {
                cy.get(".orderbookTable tbody tr").find('.buy-clr').contains("EXECUTED")
            }

        })
    })

    it("TC_BFSL_OrderBook_011: To validate that the No Data available error message is displayed under the Executed option for the user who does not have any Executed orders", () => {
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if ($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
        })
    })
    it("TC_BFSL_OrderBook_012:To validate the fields to be shown in the Executed order", () => {
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("SYMBOL")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("STATUS")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("PRICE")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("PRODUCT")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("QTY")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("LTP")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("QTY")

    })
    it("TC_BFSL_OrderBook_013: To validate that the click on Done button for the Executed orders from the Order success/failure popup redirect the user to the Orderbook screen and Verify that the Placed order should get reflected under the Executed option ", () => {
        cy.openSearch(ORDER_SYMBOL, "NSE", "BUY")
        cy.wait(100)
        cy.placeorder(ORDER_SYMBOL, {
            // [ORDER_KEYS.PRODUCT_TYPE]: PRODUCT_TYPES.PRD_MIS,
            [ORDER_KEYS.ORDER_TYPE]: ORDER_TYPES.ORD_MRK,
            // [ORDER_KEYS.QTY]: 1
        })
        // check order book is opened.if order is executed this will pass
        cy.get('.dashboard-orderbook').should('have.class', 'selected')

        cy.get(ORDERPAD.STATUS_SELECT).click({ force: true })
        cy.get(".options-div [title=EXECUTED]").click({ force: true })
        // cy.wait(500)
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            } else {
                cy.get(".orderbookTable tbody tr").first().find('.buy-clr').contains("EXECUTED")
            }

        })
    })

    it("TC_BFSL_OrderBook_014: To validate that click on Executed Order expanded view icon displays the expanded order Detailed view popup", () => {

        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if ($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            } else {
                cy.get(".orderbookTable tbody tr td .showMoreIcon:first").click({ force: true })
                cy.isVisible(".moreDetails")
            }
        })

    })

    it("TC_BFSL_OrderBook_016: To validate that click expanded view icon ^ closes the expanded view details", () => {
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            cy.wait(1000)
            if($btn.hasClass("colspan")) {
                cy.get("orderTable-base.orderbookTable tbody tr td").contains("No data available")
            }
            else{
                cy.get("orderTable-base.orderbookTable tbody tr td .showMoreIcon:first").click({ force: true })
                cy.isHidden(".moreDetails")
            }
        })
    })

    it("TC_BFSL_OrderBook_022: To validate that the select the pending option display the selected option in the dropdown", () => {
        // cy.get('[test_id="menu_ORDERS"]').click()
        // cy.wait(1000)

        //    remove above line
        cy.get(ORDERPAD.STATUS_SELECT).click({ force: true })
        cy.get(".options-div [title=PENDING]").click({ force: true })
    })
    it("TC_BFSL_OrderBook_023: To validate that the selection of Pending option displays, all the pending order details", () => {
        cy.openSearch(ORDER_SYMBOL, "BSE", "BUY")
        cy.wait(100)
        cy.placeorder(ORDER_SYMBOL, {
            // [ORDER_KEYS.PRODUCT_TYPE]: PRODUCT_TYPES.PRD_MIS,
            [ORDER_KEYS.ORDER_TYPE]: ORDER_TYPES.ORD_MRK,
            // [ORDER_KEYS.QTY]: 1
        })
        // check order book is opened.if order is executed this will pass
        // cy.get('[test_id="menu_ORDERS"]').should("have.class", "active")
        cy.get(ORDERPAD.STATUS_SELECT).click({ force: true })
        cy.get(".options-div [title=PENDING]").click({ force: true })
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if ($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            } 
            else {
                cy.get(".orderbookTable tbody tr .pend-clr:first").contains("PENDING")
            }
        })
    })

    it("TC_BFSL_OrderBook_024: To validate that the No Data available error message is displayed under the Pending option for the user who does not have any Pending orders", () => {

        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if ($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
        })
    })

    it("TC_BFSL_OrderBook_025: To validate the fields to be shown in the pending order", () => {
        // check pending order status
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("SYMBOL")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("STATUS")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("PRICE")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("PRODUCT")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("QTY")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("LTP")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("QTY")

    })

    it("TC_BFSL_OrderBook_026: To validate that the click on Done button for the Pending orders from the Order success/failure popup redirect the user to the Orderbook screen and verify that the pending order is displayed under the Pending option", () => {
        cy.openSearch(ORDER_SYMBOL, "BSE", "BUY")
        cy.wait(100)
        cy.placeorder(ORDER_SYMBOL, {
            // [ORDER_KEYS.PRODUCT_TYPE]: PRODUCT_TYPES.PRD_MIS,
            [ORDER_KEYS.ORDER_TYPE]: ORDER_TYPES.ORD_MRK,
            // [ORDER_KEYS.QTY]: 1
        })
        // check order book is opened.if order is executed this will pass
        // cy.get('[test_id="menu_ORDERS"]').should("have.class", "active")
        cy.get(ORDERPAD.STATUS_SELECT).click({ force: true })
        cy.get(".options-div [title=PENDING]").click({ force: true })
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if ($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            } else {
                cy.get(".orderbookTable tbody tr .pend-clr:first").contains("PENDING")
            }
        })
    })
    it("TC_BFSL_OrderBook_027: To validate that click on the expanded view icon display the expanded view details popup", () => {
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if ($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            } else {
                cy.get(".orderbookTable tbody tr td .showMoreIcon:first").click({ force: true })
                cy.isVisible(".moreDetails")
            }
        })
    })

    it("TC_BFSL_OrderBook_029: To validate that click expanded view icon ^ closes the expanded view details", () => {
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
            else{
                cy.get(".orderbookTable tbody tr td .showMoreIcon:first").click({ force: true })
                cy.isHidden(".moreDetails")
            }
        })
    })
    it("TC_BFSL_OrderBook_030:  To validate that the click on Modify button redirect the user to the Trade screen and verify that the Qty is prefilled with the Pending qty", () => {
        cy.get('.orderbookTable tbody tr td').then(($btn) => {

            if($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
            else{
                cy.get(".orderbookTable tbody tr td .showMoreIcon:first").click({ force: true })
                cy.get(".moreDetails button").contains('modify').click({ force: true })
                cy.isVisible('.orderPadBase')
                cy.tradeWindowClose()
            }
        })
    })
    // it("TC_BFSL_OrderBook_032: To validate that the Partially excuted Qty is prefilled the pending qty on the Trade screen", () => {
    //     cy.wait(1000)
    //     if (Cypress.$('.orderbookTable tbody tr:first td').length != 0) {

    //         cy.get(".orderbookTable tbody tr:first td").eq(4).then(($btn) => {
    //             const txt = $btn.text()
    //             cy.get(".orderbookTable tbody tr td .showMoreIcon:first").click({ force: true })
    //             cy.get(".moreDetails button").contains('modify').click({ force: true })
    //             cy.get(ORDER_PATH.ORDER_PRICE).invoke("val").should("eq", txt)
    //         })
    //         // cy.tradeWindowClose()
    //     }
    // })

    // it("TC_BFSL_OrderBook_034: To validate that the user not able to change the Product type, button type,Expiry details in the Modify order screen", () => {

    //     cy.get('.orderField label:nth-child(3) > input[type=radio]').should("have.class", 'disabled')
    //     cy.tradeWindowClose()

    // })
      
    it("TC_BFSL_OrderBook_036: To validate that the click on cancel button shows the cancel order confirmation popup", () => {
        // cy.tradeWindowClose()
        // cy.wait(1000)
        cy.get('.orderbookTable tbody tr td').then(($btn) => {

            cy.get('.orderbookTable tbody tr td').then(($btn) => {
                if ($btn.hasClass("colspan")) {
                    cy.get(".orderbookTable tbody tr td").contains("No data available")
                } else {
                    cy.get(".orderbookTable tbody tr td .showMoreIcon:first").click({ force: true })
                    cy.get(".moreDetails button").contains('Cancel Order').click({ force: true })

                }
            })
        })
        // cy.get(".ord-cancel-dialog .footer .positiveBtn").click()
    })
    it("TC_BFSL_OrderBook_037: To validate the availabilty of fields in the cancel order confirmation popup", () => {
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
            else{
                cy.get(".orderbookTable tbody tr td .showMoreIcon:first").click({ force: true })
                cy.get(".moreDetails button").contains('Cancel Order').click({ force: true })
                cy.isVisible(".pending-cancel-order .order-symName")
                // cy.get(".pending-cancel-order .order-symExc")
                // cy.isVisible(".pending-cancel-order .order-symName")
                // cy.isVisible(".pending-cancel-order .order-symExc")
                // cy.isVisible(".pending-cancel-order .cancel-confirmation")

            // cy.isVisible(".pending-cancel-order .not-cancel-order")
            // cy.isVisible(".pending-cancel-order .theme-btn")
            }
        })
    })

    it("TC_BFSL_OrderBook_038: To validate that the click on NO button closes the cancel order confirmation popup", () => {
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
            else{
                cy.get(".pending-cancel-order .not-cancel-order").click({ force: true })
            }
        })

    })

    it("TC_BFSL_OrderBook_039: To validate that the click on NO button not cancels the order and verify that the order is displayed under the Pending option", () => {
        cy.get(ORDERPAD.STATUS_SELECT).click({ force: true })
        cy.get(".options-div [title=PENDING]").click({ force: true })
    })

    it("TC_BFSL_OrderBook_040: To validate that the click on YES option displays the confirmation popup stating order cancelled successfully", () => {
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            cy.get('.orderbookTable tbody tr td').then(($btn) => {
                if ($btn.hasClass("colspan")) {
                    cy.get(".orderbookTable tbody tr td").contains("No data available")
                } else {
                    cy.get(".orderbookTable tbody tr td .showMoreIcon:first").click({ force: true })
                    cy.get(".moreDetails button").contains('Cancel Order').click({ force: true })
                    cy.get(".pending-cancel-order .theme-btn").click({ force: true })

                }
            })

        })
    })

    it("TC_BFSL_OrderBook_047: To validate that the select reject option in the all status dropdown display the selected option in the dropdown", () => {
        cy.get(ORDERPAD.STATUS_SELECT).click({ force: true })
        cy.get(".options-div [title=REJECTED]").click({ force: true })
    })
    it("TC_BFSL_OrderBook_048: To validate that the selection of Rejected option displays, all the Rejected order under the reject option", () => {

        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if ($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            } else {
                // cy.get(".orderbookTable tbody tr .sell-clr:first").contains("REJECTED")
            }
        })
    })
    it("TC_BFSL_OrderBook_049: To validate that the No Data available error message is displayed under the Rejected option for the user who does not have any Rejected orders", () => {
        // no data available
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if ($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
        })
    })
    it("TC_BFSL_OrderBook_050: To validate the fields to be shown in the Rejected order", () => {
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("SYMBOL")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("STATUS")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("PRICE")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("PRODUCT")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("QTY")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("LTP")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("QTY")

    })
    it("TC_BFSL_OrderBook_052: To validate that click on Rejected Order expanded icon displays the Rejected order expanded view detail popup", () => {
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if ($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            } else {
                cy.get(".orderbookTable tbody tr td .showMoreIcon:first").click({ force: true })
            }
        })

    })

    // it("TC_BFSL_OrderBook_053: To validate the availabilty of fields in the Rejected order expanded view popup", () => {
    //     cy.get(".exp-details-base table thead tr th").should(($lis) => {
    //         expect($lis.eq(0)).to.contain("PRODUCT TYPE")
    //         expect($lis.eq(1)).to.contain("SERIES")
    //         expect($lis.eq(2)).to.contain("EXECUTED QTY")
    //         expect($lis.eq(3)).to.contain("DISCLOSED QTY")
    //         expect($lis.eq(4)).to.contain("MODIFIEDBY")
    //         expect($lis.eq(5)).to.contain("VALIDITY")
    //         expect($lis.eq(6)).to.contain("ORDER VALUE")
    //         expect($lis.eq(7)).to.contain("EXCH.ORD.ID")
    //         expect($lis.eq(8)).to.contain("EXCHANGE TIME")
    //     })
    // })
    it("TC_BFSL_OrderBook_054: To validate that click on the expanded view icon ^ closes the expanded view details popup", () => {
        cy.get('.orderbookTable tbody tr td').then(($btn) => {

            if ($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
            else {
                cy.get(".orderbookTable tbody tr td .showMoreIcon:first").click({ force: true })

                cy.isHidden(".moreDetails")
            }
        })
    })
    it("TC_BFSL_OrderBook_055: To validate the button functionality of rejected order for all the product type", () => {
        cy.get('.orderbookTable tbody tr td').then(($btn) => {

            if ($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
            else{
                cy.get(".orderbookTable tbody tr").first().find('.sell-clr').contains("REJECTED")

            }
        })
    })
    it("TC_BFSL_OrderBook_056: To validate that the click on Reorder button redirect the user to Trade screen", () => {
        cy.get(ORDERPAD.STATUS_SELECT).click({ force: true })
        cy.get(".options-div [title=REJECTED]").click({ force: true })
        cy.get('.orderbookTable tbody tr td').then(($btn) => {

            if ($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
            else {

                cy.get(".orderbookTable tbody tr").first().get('.sell-clr').contains("REJECTED")
                cy.get(".orderbookTable tbody tr td .showMoreIcon:first").click({ force: true })
                cy.wait(1000)
                cy.get(".moreDetails button").contains('Retry').click({ force: true })
                // cy.wait(1000)
                cy.tradeWindowClose()
            }
        })
    })

    it("TC_BFSL_OrderBook_057: To validate that the click on reason button display the reject reason tooltip information", () => {
        cy.get('.orderbookTable tbody tr td').then(($btn) => {

            if ($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
            else {
                cy.get(".orderbookTable tbody tr .infoIcon:first").click({ force: true })
                cy.get(".orderbookTable tbody tr").first().get('.tooltip-container').should('have.class', "show")
                cy.get(".orderbookTable tbody tr .infoIcon:first").click({ force: true })
            }
        })
    })
    // cancelled
    it("TC_BFSL_OrderBook_058: To validate that the selec the cancelled option in the all status dropdown display the selected option in the dropdown", () => {
        cy.get(ORDERPAD.STATUS_SELECT).click({ force: true })
        cy.get(".options-div [title=CANCELLED]").click({ force: true })
    })
    it("TC_BFSL_OrderBook_059: To validate that the selection of Cancelled option displays, all the Cancelled order under the cancel option", () => {

        // cy.wait(1000)
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if ($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            } else {
                cy.wait(2000)
                cy.get(".orderbookTable tbody tr").first().then(($btn) => {
                    if ($btn.hasClass("can-clr")) { 
                        $btn.contains("CANCELLED")
                    }
                })
            }
        })
    })
    it("TC_BFSL_OrderBook_060: To validate that the No Data available error message is displayed under the Cancelled option for the user who does not have any Cancelled orders", () => {
        // no data available
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if ($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
        })
    })
    it("TC_BFSL_OrderBook_061: To validate the available fields in the Cancelled option screen", () => {
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("SYMBOL")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("STATUS")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("PRICE")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("PRODUCT")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("QTY")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("LTP")
        cy.get(ORDER_BOOK.TABLE_HEAD).contains("QTY")

    })
    it("TC_BFSL_OrderBook_062: To validate that the click on Done button for the Cancelled orders from the Order success/failure popup redirect the user to the Orderbook screen and Verify that the Cancelled order is shown under the Cancelled option", () => {
        //TODO: place cancelled order
    })
    it("TC_BFSL_OrderBook_063: To validate that click on Cancelled Order expanded view icon display the expanded view popup", () => {
        cy.get('.orderbookTable tbody tr td').then(($btn) => {

            if ($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
            else {

                cy.get(".orderbookTable tbody tr td .showMoreIcon:first").click({ force: true })

                cy.isVisible(".moreDetails")
            }
        })

    })
    // it("TC_BFSL_OrderBook_064: To validate the availabilty of fields in the Cancelled order expanded view popup", () => {
    //     if (Cypress.$('.orderbookTable tbody tr:first td').length != 0) {

    //     cy.get('.exp-details-base table thead tr th').contains("PRODUCT TYPE")
    //     cy.get('.exp-details-base table thead tr th').contains("SERIES")
    //     cy.get('.exp-details-base table thead tr th').contains("EXECUTED QTY")
    //     cy.get('.exp-details-base table thead tr th').contains("DISCLOSED QTY")
    //     cy.get('.exp-details-base table thead tr th').contains("MODIFIEDBY")
    //     cy.get('.exp-details-base table thead tr th').contains("VALIDITY")
    //     cy.get('.exp-details-base table thead tr th').contains("ORDER VALUE")
    //     cy.get('.exp-details-base table thead tr th').contains("EXCH.ORD.ID")
    //     cy.get('.exp-details-base table thead tr th').contains("EXCHANGE TIME")
    //     }

    // })
    it("TC_BFSL_OrderBook_065: To validate that click on the expanded view icon ^ closes the expanded view details popup", () => {
        cy.get('.orderbookTable tbody tr td').then(($btn) => {
            if ($btn.hasClass("colspan")) {
                cy.get(".orderbookTable tbody tr td").contains("No data available")
            }
            else {
                cy.get(".orderbookTable tbody tr td .showMoreIcon:first").click({ force: true })

                cy.isHidden(".moreDetails")
            }
        })
    })
    // it("TC_BFSL_OrderBook_066: To validate that the click on the all exchange dropdown display the all exchange/NSE/BSE/ICEX/MCXSX/MCX", () => {

    //     cy.get(ORDERPAD.EXCHANGE_SELECT).click()
    //     cy.isVisible(".exchange .options-div [title=NSE]")
    //     cy.isVisible(".exchange .options-div [title=BSE]")
    //     cy.isVisible(".exchange .options-div [title=ICEX]")
    //     cy.isVisible(".exchange .options-div [title=MCXSX]")
    //     cy.isVisible(".exchange .options-div [title=MCX]")
    // })
    // it("TC_BFSL_OrderBook_067: To validate that the user able to select either All exchange/NSE/BSE/MCXSX/ICEX/MCX", () => {
    //     cy.get(".exchange .options-div [title=NSE]").click()
    // })
    it("TC_BFSL_OrderBook_068: To validate that the click on the all segment dropdown display the All segment/ Equity/FNO/Currency/Commodity option", () => {

        cy.get(ORDERPAD.SEGMENT_SELECT).click({ force: true })
        cy.isVisible(".segmentlist-dropdown  .options-div [title=EQUITY]")
        cy.isVisible(".segmentlist-dropdown  .options-div [title=FNO]")
        // cy.isVisible(".segment .options-div [title=CURRENCY]")
        // cy.isVisible(".segment .options-div [title=COMMODITY]")
    })
    // it("TC_BFSL_OrderBook_069: To validate that the selection of NSE/BSE exchange allows the user to select Equity/FNO/Currency/Commodity segments", () => {
    //     cy.get(ORDERPAD.EXCHANGE_SELECT).click()
    //     cy.get(".exchange .options-div [title=BSE]").click()

    //     cy.get(ORDERPAD.SEGMENT_SELECT).click()
    //     cy.isVisible(".segment .options-div [title=EQUITY]")
    //     cy.isVisible(".segment .options-div [title=FNO]")
    //     cy.isVisible(".segment .options-div [title=CURRENCY]")
    //     cy.isVisible(".segment .options-div [title=COMMODITY]")

    // })
    // it("TC_BFSL_OrderBook_070: To validate that the selection of MCX/ICEX exchange allows the  user to select only the Commodity segment", () => {
    //     cy.get(ORDERPAD.EXCHANGE_SELECT).click()
    //     cy.get(".exchange .options-div [title=MCX]").click()

    //     cy.get(ORDERPAD.SEGMENT_SELECT).click()
    //     cy.isVisible(".segment .options-div [title=COMMODITY]")
    // })
    // it("TC_BFSL_OrderBook_071: To validate that the selection of MCXSX exchange allows the user to select only the Currency segment", () => {
    //     cy.get(ORDERPAD.EXCHANGE_SELECT).click()
    //     cy.get(".exchange .options-div [title=MCXSX]").click()

    //     cy.get(ORDERPAD.SEGMENT_SELECT).click()
    //     cy.isVisible(".segment .options-div [title=CURRENCY]")
    // })
    // it("TC_BFSL_OrderBook_072: To validate that the selection of  NSE/BSE Exchange and Equity option shows the equity segment symbols under the Orderbook tab", () => {
    //     cy.get(ORDERPAD.EXCHANGE_SELECT).click()
    //     cy.get(".exchange .options-div [title=BSE]").click()

    //     cy.get(ORDERPAD.SEGMENT_SELECT).click()
    //     cy.isVisible(".segment .options-div [title=EQUITY]")
    // })
    // it("TC_BFSL_OrderBook_073: To validate that the selection of  NSE/BSE Exchange and FNO option shows the FNO segment symbols under the Orderbook tab", () => {
    //     cy.get(ORDERPAD.EXCHANGE_SELECT).click()
    //     cy.get(".exchange .options-div [title=BSE]").click()

    //     cy.get(ORDERPAD.SEGMENT_SELECT).click()
    //     cy.isVisible(".segment .options-div [title=FNO]")
    // })
    // it("TC_BFSL_OrderBook_074: To validate that the selection of NSE/BSE/MCX/ICEX exchange and commodity option shows the commodity segment symbols under the Orderbook tab", () => {
    //     cy.get(ORDERPAD.EXCHANGE_SELECT).click()
    //     cy.get(".exchange .options-div [title=BSE]").click()

    //     cy.get(ORDERPAD.SEGMENT_SELECT).click()
    //     cy.isVisible(".segment .options-div [title=COMMODITY]")
    // })
    // it("TC_BFSL_OrderBook_075: To validate that the selection of NSE/BSE/MCXSX exchange and Currency option shows the Currency segment symbols under the Orderbook tab", () => {
    //     cy.get(ORDERPAD.EXCHANGE_SELECT).click()
    //     cy.get(".exchange .options-div [title=BSE]").click()

    //     cy.get(ORDERPAD.SEGMENT_SELECT).click()
    //     cy.isVisible(".segment .options-div [title=CURRENCY]")
    // })
    // it("TC_BFSL_OrderBook_076: To validate that selection of NSE exchange in the exchange dropdown displays the corresponding NSE symbols", () => {
    //     cy.get(ORDERPAD.EXCHANGE_SELECT).click()
    //     cy.get(".exchange .options-div [title='NSE']").click()

    //     cy.get(ORDERPAD.SEGMENT_SELECT).click()
    //     cy.isVisible(".segment .options-div [title='ALL SEGMENT']")
    // })
    // it("TC_BFSL_OrderBook_077: To validate that selection of BSE exchange in the exhcnage dropdown displays the corresponding BSE symbols ", () => {
    //     cy.get(ORDERPAD.EXCHANGE_SELECT).click()
    //     cy.get(".exchange .options-div [title=BSE]").click()
    //     if (Cypress.$('#order-book-tbody table tbody tr:first td').length != 0) {

    //     cy.get("#order-book-tbody tr td:first .exc").contains("BSE")
    //     }
    // })
    // it("TC_BFSL_OrderBook_078: To validate that selection of MCX exchange in the exchange dropdown displays the corresponding MCX symbols ", () => {
    //     cy.get(ORDERPAD.EXCHANGE_SELECT).click()
    //     cy.get(".exchange .options-div [title=MCX]").click()
    //     if (Cypress.$('#order-book-tbody table tbody tr:first td').length != 0) {

    //     cy.get("#order-book-tbody tr td:first .exc").contains("MCX")
    //     }
    // })
    // it("TC_BFSL_OrderBook_079: To validate that selection of ICEX exchange in the exchange dropdown displays the corresponding ICEX symbols ", () => {
    //     cy.get(ORDERPAD.EXCHANGE_SELECT).click()
    //     cy.get(".exchange .options-div [title=ICEX]").click()
    //     if (Cypress.$('#order-book-tbody table tbody tr:first td').length != 0) {
    //     cy.get("#order-book-tbody tr td:first .exc").contains("ICEX")
    //     }
    // })

    // it("TC_BFSL_OrderBook_080: To validate that selection of MCXSX exchange in the exchange dropdown displays the corresponding MCXSX symbols ", () => {
    //     cy.get(ORDERPAD.EXCHANGE_SELECT).click()
    //     cy.get(".exchange .options-div [title=MCXSX]").click()
    //     if (Cypress.$('#order-book-tbody table tbody tr:first td').length != 0) {

    //     cy.get("#order-book-tbody tr td:first .exc").contains("MCXSX")
    //     }
    // })
    // it("TC_BFSL_OrderBook_081: To validate that the applied filter get resetted when we switch to Other Main tabs/Screen to Orderbook", () => {
    //     cy.get(".order-header .submenu .flex-center").contains("TRADE BOOK").click()
    //     cy.wait(1000)
    //     cy.get(".order-header .submenu .flex-center").contains("ORDER BOOK").click()
    //     cy.wait(1000)
    //     cy.get(".status .select-input-div .select-value").contains("ALL STATUS")
    //     cy.get(".exchange .select-input-div .select-value").contains("ALL EXCHANGE")
    //     cy.get(".segment .select-input-div .select-value").contains("ALL SEGMENT")

    // })
})