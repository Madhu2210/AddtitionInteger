// import { WATCHLIST, ORDER_SYMBOL } from '../../support/config'
import { URL, USER_NAME, PASSWORD, PAN_NUMBER } from '../support/config'


before(function () {
    cy.visit(URL)

})

describe("Login Help", () => {
  
    it('TC_BFSL_Login_Help_001:To validate the availability of "Forgot Password?" link in the Login screen', () => {
       cy.wait(1000)
        cy.isVisible('span.forgetPassword-link')

    })

    it('TC_BFSL_Login_Help_002:To validate that the click on "Forgot Password" link redirect to the Forgot password popup', () => {
        cy.get('span.forgetPassword-link').click({ force: true })
        cy.isVisible('.forget-password-dialog')

    })
    
    it('TC_BFSL_Login_Help_003:To validate the availability of fields in Forgot password popup', () => {
        cy.window().then((win) => {
            // cy.checkLength('.window .title', 1)
            // cy.checkText('.forget-password-dialog .infoMsg', 'Please enter following details to reset the password')
            cy.checkText('.window .content', 'USER ID')
            cy.checkText('.window .content', 'PAN')
            cy.checkLength('.window .content .hasAddOn ', 2)
            cy.checkLength('.window .footer .negativeBtn', 1)
            cy.checkLength('.window .footer .left-btn.positiveBtn', 1)

        })

    })

    
    it('TC_BFSL_Login_Help_004:To validate that the click on cancel button displays to the Login Screen', () => {
        cy.get('.window .footer .negativeBtn').click({ force: true })
        cy.isVisible('.login-base')
        cy.get('.forget-password-dialog').should('not.exist')

    })
    it('TC_BFSL_Login_Help_005:To validate that the user not able to redirect to the New password sent popup by providing the User ID details empty', () => {
        cy.get('span.forgetPassword-link').click({ force: true })
        cy.forgotpassworduser(' ', 'AAAAA1111A')
        cy.get('div.content > div:nth-child(2) > div.errorDiv').contains('Please enter the user id')
    })

    it('TC_BFSL_Login_Help_006:To validate that the user not able to redirect to the New password sent popup by providing the PAN details empty', () => {
        cy.forgotpasswordempty(' ', ' ')
        // cy.wait(500)
        // cy.get('div.content > div:nth-child(2) > div.errorDiv').contains('Please enter the user id')

        cy.get('.forget-password-dialog div.content div div.errorDiv > span').contains('Please enter the PAN')


    })

    it('TC_BFSL_Login_Help_007:To validate that the user not able to redirect to New password sent popup by Providing a invalid User ID details', () => {
        cy.forgotpassword('abcd', 'AAAAA1111A')
        cy.get('.commonErrorDiv').contains('Enter correct User ID / PAN No.')

    })

      // it('008:To validate that the user able to redirect to New password sent popup by Providing a valid User ID details', () => {
    //     cy.forgotpassword('demo16', 'AAAAA1111A')
    //     cy.isVisible('.window')
    //     cy.cancelPopup()
    //     // cy.get('.commonErrorDiv').contains('User Does Not Exist')

    // })
    it('TC_BFSL_Login_Help_009:To validate that the user not able to redirect to the New password sent popup by Providing a invalid PAN  number', () => {
        // cy.get('[test_id="forgetPwdLink"]').click()
        cy.forgotpassword(USER_NAME, 'abcd')
        cy.get('.forget-password-dialog div.content div div.errorDiv > span').contains('Please enter valid PAN')


    })
    // it('010:To validate that the user able to redirect to the New password sent popup by Providing a valid PAN number', () => {

    //     cy.forgotpassword('demo16', 'AAAAA1111A')
    //     cy.wait(500)
    //     cy.isVisible('.app-modalDialog2.alertModal')
    //     cy.cancelPopup()
    // })
    // it('TC_BFSL_Login_Help_011:To validate that the user not able to redirect to the New password sent popup by Providing a invalid DOB details ', () => {
    //     cy.forgotpassword(USER_NAME, '7/7/2019')
    //     cy.get('div.content > div:nth-child(3) > div.errorDiv').contains('DOB must be in DDMMYYYY format')
    //     cy.get('.app-modalDialog2.alertModal').should('not.be.visible')
    //     cy.get('.window .footer .negativeBtn').click({ force: true })
    // })

    // it('012:To validate that the user able to redirect to the New password sent popup by Providing a valid DOB details', () => {
    //     cy.forgotpassword('demo16', 'AAAAA1111A')
    //     cy.isVisible('.app-modalDialog2.alertModal')
    //     // cy.cancelPopup()

    // })

    

    // 
    it('TC_BFSL_Login_Help_14:To validate that the user not able to Login to the app using the invalid Password', () => {
        cy.wait(1000)
        cy.login(USER_NAME, 'aaA@123', 'AAAAA1111A')
        // cy.isVisible('.alertModal')
        // cy.cancelPopup()
    })

    it('TC_BFSL_Login_Help_15:To validate that the user not able to Login to the app using the old Password', () => {
        cy.wait(1000)
        cy.login(USER_NAME, 'Bbb@123', 'AAAAA1111A')
        // cy.isVisible('.alertModal')
        // cy.cancelPopup()
    })


    it('TC_BFSL_Login_Help_43:To validate that the user account is blocked after the 4th incorrect attempts of  password', () => {
        for (var i = 1; i <= 4; i++) {
            cy.wait(500)
            cy.login(USER_NAME, 'abC@123', PAN_NUMBER)
            // cy.wait(1000)
            if (Cypress.$('.app-modalDialog2.alertModal').length == 1) {
                cy.get('.positiveBtn').click({ force: true })
            }

        }
        // cy.isVisible('.app-modalDialog.account-blocked-dialog')
    })

    
    it('TC_BFSL_Login_Help_46:To validate the availability of fields in the Unblock user popup', () => {
        cy.wait(500)
        cy.login(USER_NAME, PASSWORD, PAN_NUMBER)
        cy.get('.window .footer .positiveBtn').contains('UNBLOCK').click({ force: true })
    
        cy.window().then((win) => {
            cy.checkLength('.window .title', 1)
            cy.checkText('.window .title', 'UNBLOCK ACCOUNT')
            cy.checkText('.window .content', 'USER ID')
            cy.checkText('.window .content', 'PAN')
            cy.checkLength('.window .footer .negativeBtn', 1)
            cy.checkLength('.window .footer .left-btn.positiveBtn', 1)
    
        })
    })
    
    it('TC_BFSL_Login_Help_47:To validate that the click on cancel button display to the Login Screen', () => {
        cy.get('.window .footer .negativeBtn').click({ force: true })
        cy.isVisible('.login-base')
    
    })
    
it('TC_BFSL_Login_Help_44:To validate that the click on unblock button in the account blocked popup redirect the user to the Unblock user screen', () => {
    cy.wait(500)
    cy.login(USER_NAME, 'abC@123', PAN_NUMBER)
    // cy.wait(1000)
    if (Cypress.$('.window .accBlockedIcon').length == 1) {
        cy.isVisible('.account-blocked-dialog')

        cy.get('.window .footer .positiveBtn').contains('UNBLOCK').click({ force: true })
        // cy.wait(500)
        // cy.unblockUser()
    }

})



    it('TC_BFSL_Login_Help_45:To validate that click on cancel button closes the Unblock popup', () => {
        cy.wait(500)
        cy.login(USER_NAME, 'abC@123', PAN_NUMBER)
        if (Cypress.$('.window .accBlockedIcon').length == 1) {
            cy.get('.window .footer .negativeBtn').contains('CANCEL').click({ force: true })
            cy.isHidden('.account-blocked-dialog')
        }
    })


  

    it('TC_BFSL_Login_Help_48:To validate that the user not able to redirect to the Unblock account success popup by providing the User ID details empty', () => {
        cy.wait(500)
        cy.login(USER_NAME, 'zCc@123', 'AAAAA1111A')
        cy.get('.window .footer .positiveBtn').contains('UNBLOCK').click({ force: true })
        cy.unblock(' ', PAN_NUMBER)
        cy.get('div.app-modalDialog.unblock-user-dialog div div.content div.errorDiv span').contains('Please enter the user id')
   })

    it('TC_BFSL_Login_Help_49:To validate that the user not able to redirect to the Unblock account success popup by providing the DOB/PAN details empty', () => {
        cy.unblock(USER_NAME, ' ')
        cy.get('.unblock-user-dialog div.content div div.errorDiv > span').contains('Please enter the PAN')

    })

    it('TC_BFSL_Login_Help_50:To validate that the user not able to redirect to Unblock account success popup by Providing a invalid User ID details', () => {
        cy.unblock('abcd', PAN_NUMBER)
        cy.checkLength('.content > div.commonErrorDiv > span.error', 1)
    })
    it('TC_BFSL_Login_Help_51:To validate that the user not able to redirect to the Unblock account success popup by Providing a invalid PAN  number', () => {
        cy.unblock(USER_NAME, 'AAAAA ')
        cy.get('.unblock-user-dialog div.content div div.errorDiv > span').contains('Please enter valid PAN')

    })

    // it('TC_BFSL_Login_Help_57:To validate that the user not able to redirect to the Unblock account success popup by Providing a invalid DOB details ', () => {
    //     cy.unblock(USER_NAME, '202020')
    //     cy.get('.content > div:nth-child(3) > div.errorDiv > span.error').contains('DOB must be in DDMMYYYY format')

    // })

    it('TC_BFSL_Login_Help_54,58:To validate that the user able to redirect to the Unblock account success popup by Providing a valid DOB details', () => {
        cy.unblock(USER_NAME, PAN_NUMBER)
        cy.isVisible('.app-modalDialog2.alertModal')

    })

    
  
    it('TC_BFSL_Login_Help_56:"To validate the availability of fields in the Unblock success popup', () => {
        cy.window().then((win) => {
            cy.checkLength('.window .title', 1)
            cy.checkText('.window .title', 'BFSL')
            cy.checkText('.window .content', 'User unblocked successfully')
            cy.checkLength('.window .footer .positiveBtn', 1)
        })
    })
    
    it('TC_BFSL_Login_Help_57:To validate that click on close button redirect the user to the Login screen', () => {
        cy.cancelPopup()
        cy.isVisible('.login-base')

    })
 
    it('TC_BFSL_Login_Help_58:To validate after the  successful Unblock of user account Check that user able to Login to the app', () => {
        cy.login(USER_NAME, PASSWORD, PAN_NUMBER)
        cy.isLoginSuccess()

    })
})