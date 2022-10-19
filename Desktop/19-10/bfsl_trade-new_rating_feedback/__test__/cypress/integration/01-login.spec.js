import {
    URL, PASSWORD, PAN_NUMBER, DOB, USER_NAME, LOGIN_PASS_ERROR, LOGIN_USER_ERROR
} from '../support/config'

before(function () {
    cy.visit(URL)
})
describe("LOGIN", () => {

    // case 002 : validate availability of fields
    describe('check design and username validation', () => {
        it('TC_BFSL_LOGIN_001 : To validate the availability of the fields in the login screen', () => {
            cy.visit(URL)
            // cy.get('.social-media img:first').should('have.attr', 'src').should('include', 'fb')
            // cy.get('.social-media img:nth-child(2)').should('have.attr', 'src').should('include', 'twitter')
            // cy.get('.social-media img:last').should('have.attr', 'src').should('include', 'youtube')
            cy.get('.appStore img:first').should('have.attr', 'src').should('include', 'appstore_google')
            cy.get('.footer img:last').should('have.attr', 'src').should('include', 'appstore_ios')
            cy.isVisible('.logo-div')
            cy.checkText('.openAcc-div .haveAccQes', "Need Help?")
            cy.isVisible('.content [name="userName"]')
            cy.isVisible('.content [name="password"]')
            cy.isVisible('.infoIcon ')
            cy.isVisible('.eyeCloseIcon')
            cy.isVisible('.content [name="pan_dob"]')
            // cy.isVisible('button.virtualTrade-btn')
            // cy.isVisible('button.guest-btn')
            cy.isVisible('span.membership-link')

        })

        // case 003: Field validation - TODO: need to check error message
        it('TC_BFSL_LOGIN_002: To validate the field "UserID" in the login screen by providing the input as Blank', () => {
            cy.login(' ', PASSWORD, PAN_NUMBER)
            cy.get('.content .row:first .errorDiv .error').contains('Please enter the user id')

            // cy.get('.login-base .content .row:first .errorDiv .error').contains('Please enter the user id')

        })
        it('TC_BFSL_LOGIN_003: To validate the field "UserID" in the login screen by providing the input as Alphanumeric', () => {
            cy.login('H57L4', PASSWORD, PAN_NUMBER)
            // cy.get('.content [name="userName"]').should('have.value', 'H57L4')
            cy.wait(1000)
            cy.checkPopupText(LOGIN_USER_ERROR, true)

        })

        it('TC_BFSL_LOGIN_004: To validate the field "UserID" in the login screen by providing space in the UserID field', () => {
            cy.login(' ', PASSWORD, PAN_NUMBER)
            // cy.checkPopupText(LOGIN_USER_ERROR,true)
            cy.get('.content .row:first .errorDiv .error').contains('Please enter the user id')

        })

        it('TC_BFSL_LOGIN_005: To validate the field "UserID" in the login screen by providing space in between the characters in the UserID field', () => {
            cy.login('U S E R N A M E', PASSWORD, PAN_NUMBER)
            cy.get('.content [name="userName"]').should('have.value', 'USERNAME')
            cy.checkPopupText(LOGIN_USER_ERROR, true)

        })

        it('TC_BFSL_LOGIN_006: To validate the field "UserID" in the login screen by providing the input as special characters', () => {
            cy.login('H%$#T', PASSWORD, PAN_NUMBER)
            cy.get('.content [name="userName"]').should('have.value', 'HT')
            cy.checkPopupText(LOGIN_USER_ERROR, true)

        })

        it('TC_BFSL_LOGIN_007: To validate the field "UserID" in the login screen', () => {
            cy.login('HUT', PASSWORD, PAN_NUMBER)
            cy.checkPopupText(LOGIN_USER_ERROR, true)

        })
        it('TC_BFSL_LOGIN_008: To validate the field "UserID" in the login screen', () => {
            cy.login('uSErNAme', PASSWORD, PAN_NUMBER)
            cy.get('.content [name="userName"]').should('have.value', 'USERNAME')

            cy.checkPopupText(LOGIN_USER_ERROR, true)

        })

        it('TC_BFSL_LOGIN_009: To validate the field "UserID" in the login screen by providing the invalid UserID details', () => {
            cy.login('invalid user', PASSWORD, PAN_NUMBER)
            cy.checkPopupText(LOGIN_USER_ERROR, true)
        })
    })

    describe("password field validation", () => {

        it('TC_BFSL_LOGIN_011: To validate the field "Password" in the login screen by providing the input as blank', () => {
            cy.login(USER_NAME, ' ', PAN_NUMBER)
            // cy.checkPopupText(LOGIN_USER_ERROR)
            cy.get('.input-div + .errorDiv .passwordError').contains('Please enter the password')

        })
        it('TC_BFSL_LOGIN_012: To validate the field "Password" in the login screen by providing space in the Password field', () => {
            cy.login(USER_NAME, '          ', PAN_NUMBER)
            cy.get('.input-div + .errorDiv .passwordError').contains('Please enter the password')


        })

        it('TC_BFSL_LOGIN_013: To validate the field "Password" in the login screen by providing space in between the Characters ', () => {
            cy.login(USER_NAME, 'H E L L O', PAN_NUMBER)
            cy.get('.content [name="password"]').should('have.value', 'HELLO')

            // cy.checkPopupText(LOGIN_PASS_ERROR, true)
        })

        it('TC_BFSL_LOGIN_014: To validate the field "Password" in the login screen by providing minimum 6 characters in the Password field ', () => {
            cy.login(USER_NAME, 'e@T', PAN_NUMBER)
            // cy.checkPopupText(LOGIN_PASS_ERROR, true)
            cy.get('.input-div + .errorDiv .passwordError').contains('Password should be minimum 6 characters and maximum 12 characters')

        })

        it('TC_BFSL_LOGIN_015: To validate the field "Password" in the login screen by providing the input less than 6 characters in the Password field', () => {
            cy.login(USER_NAME, 'ADF', PAN_NUMBER)
            cy.get('.input-div + .errorDiv .passwordError').contains('Password should be minimum 6 characters and maximum 12 characters')

        })

        it('TC_BFSL_LOGIN_016: To validate the field "Password" in the login screen by providing maximum 12 characters in the Password field', () => {
            cy.login(USER_NAME, 'ADFGFRTMw!3EW', PAN_NUMBER)
            cy.get('.content [name="password"]').should('have.value', 'ADFGFRTMw!3EW')
            cy.wait(3000)
            if(cy.get('.window .content').contains('Enter Correct User ID / Password')){
            (cy.checkPopupText(LOGIN_PASS_ERROR, true))
        }
        else {
            cy.get('.window .content .errorMsg').contains("ACCOUNT BLOCKED")
            cy.get('.window .footer button .left-btn').click({force: true})
        }
        })

        it('TC_BFSL_LOGIN_017: To validate the field "Password" in the login screen by providing the input greater than 12 characters in the Password field', () => {
            cy.login(USER_NAME, '12As&789456123', PAN_NUMBER)
            // cy.get('.content [name="password"]').should('have.value', '12As&789456123')

            // cy.get('.input-div + .errorDiv .passwordError').contains('Password should be minimum 6 characters and maximum 12 characters')
            cy.checkPopupText(LOGIN_PASS_ERROR, true)

        })
        it('TC_BFSL_LOGIN_019:To validate that the Password field is masked by default', () => {
            // cy.input('.login-base .password-label + div [name="password"]', 'Hello')
            cy.input('.content [name="password"]', "TEST@!#123")

            cy.get('.password-label + div [type ="password"]')
            // cy.get('.login-base .password-label + div [type ="password"]')

        })
        it('TC_BFSL_LOGIN_020: To validate that the entered Password field is visible to the user', () => {
            cy.get('.eyeCloseIcon').click({ force: true })
            cy.get('.password-label + div [type ="text"]')
            cy.get('.eyeOpenIcon ').click({ force: true })

        })
        it('TC_BFSL_LOGIN_021: To validate the field "Password" in the login screen by entering the invalid Password', () => {
            cy.login(USER_NAME, "helL!World", PAN_NUMBER)
            // cy.checkPopupText(LOGIN_PASS_ERROR, true)
            cy.checkPopupText(LOGIN_PASS_ERROR, false)

        })
        it('TC_BFSL_LOGIN_022: To validate that the User account is not blocked for the 1nd time incorrect Password is entered ', () => {
            cy.login(USER_NAME, "helL!World", PAN_NUMBER)
            // cy.checkPopupText(LOGIN_PASS_ERROR, true)
            cy.checkPopupText(LOGIN_PASS_ERROR, false)

        })
        it('TC_BFSL_LOGIN_023: To validate that the User account is not blocked for the 2nd time incorrect Password is entered ', () => {
            cy.login(USER_NAME, "helL!World", PAN_NUMBER)
            // cy.checkPopupText(LOGIN_PASS_ERROR, true)
            cy.checkPopupText(LOGIN_PASS_ERROR, false)

        })
        it('TC_BFSL_LOGIN_024: To validate that the User account is not blocked for the 3rd time incorrect Password is entered ', () => {
            cy.login(USER_NAME, "helL!World", PAN_NUMBER)
            // cy.checkPopupText(LOGIN_PASS_ERROR, true)
            cy.checkPopupText(LOGIN_PASS_ERROR, false)
        })
        it('TC_BFSL_LOGIN_025: To validate that the User account is blocked for the 4th time incorrect Password is entered ', () => {
            cy.login(USER_NAME, "helL!World", PAN_NUMBER)
            // cy.checkPopupText(LOGIN_PASS_ERROR, true)
            cy.checkPopupText(LOGIN_PASS_ERROR, false)
        })

    })
    describe("DOB field validation", () => {

              
        it('TC_BFSL_Login_026: To validate the field "Date of Birth" in the Login screen by providing the input in DDMMYYYY format', () => {
            cy.get('span.cursor').contains("DOB").click({ force: true })
            cy.login(USER_NAME, PASSWORD, '02022020')
            cy.get('.content [name="pan_dob"]').should('have.value', '02022020')
            // cy.visit(URL)
        })
        // it('TC_BFSL_Login_027: To validate the field "Date of Birth" in the Login screen by providing the valid DOB in DDMMYYYY format',() => {

        // })
        it('TC_BFSL_Login_028: To validate the field "Date of Birth" in the Login screen by providing the input in MM/DD/YYYY format', () => {
            cy.visit(URL)
            cy.get('span.cursor').contains("DOB").click({ force: true })
            cy.login(USER_NAME, PASSWORD, '02/02/2020')
            cy.get('.content [name="pan_dob"]').should('have.value', '02/02/2020')
            // cy.visit(URL)


        })
        it('TC_BFSL_Login_029: To validate the field "Date of Birth" in the Login screen by providing the input as Special/Alphabets characters', () => {
            cy.visit(URL)
            cy.get('span.cursor').contains("DOB").click({ force: true })
            cy.login(USER_NAME, PASSWORD, '123!@#12')
            //cy.get('.content [name="pan_dob"]').should('have.value', '12312')

        })
        it('TC_BFSL_Login_030: To validate the field "Date of Birth" in the Login screen by providing the incorrect DOB in the format of DDMM', () => {
            cy.get('span.cursor').contains("DOB").click({ force: true })
            cy.login(USER_NAME, PASSWORD, '1212')
            cy.get('.content [name="pan_dob"]').should('have.value', '1212')
        })
        it('TC_BFSL_Login_032 & 033 & 034 & 035 & 036 & 037 : To validate the field "Date of Birth" in the Login screen by providing the incorrect DOB in the format of MMDDYYYY', () => {
            cy.get('span.cursor').contains("DOB").click({ force: true })
            cy.login(USER_NAME, PASSWORD, '00000000')
            // cy.get('.content [name="pan_dob"]').should('have.value', '00000000')
            // cy.get('.input-div + .errorDiv').contains('Please enter the DOB')
            // cy.visit(URL)

        })

        it('TC_BFSL_Login_038: To validate the field "Date of Birth" in the Login screen by providing the field empty ', () => {
            cy.visit(URL)
            cy.get('span.cursor').contains("DOB").click({ force: true })
            cy.login(USER_NAME, PASSWORD, ' ')
            cy.get('.input-div + .errorDiv').contains('Please enter the DOB')

        })
    })


    describe("PAN field validation", () => {

        it('TC_BFSL_LOGIN_040: To validate the field "PAN" in the Login screen by providing the input as blank', () => {
            cy.get('span.cursor').contains("PAN").click({ force: true })

            cy.login(USER_NAME, PASSWORD, ' ')
            // cy.checkPopupText(LOGIN_PASS_ERROR)
            cy.get('.input-div + .errorDiv').contains('Please enter the PAN')

        })
        it('TC_BFSL_LOGIN_041: To validate the field "PAN" in the Login screen by providing the input as Alphabets', () => {
            cy.login(USER_NAME, PASSWORD, 'asdfghjklj')
            cy.get('.input-div + .errorDiv').contains('Please enter valid PAN')

        })
        it('TC_BFSL_LOGIN_042: To validate the field "PAN" in the Login screen by providing the input as special characters', () => {
            cy.login(USER_NAME, PASSWORD, 'KDH#@@#$%^')
            cy.get('.content [name="pan_dob"]').should('have.value', 'KDH')

        })
        it('TC_BFSL_LOGIN_043: To validate the field "PAN" in the Login screen by providing space in the PAN field', () => {
            cy.login(USER_NAME, PASSWORD, '     ')
            cy.get('.input-div + .errorDiv').contains('Please enter the PAN')
        })
        it('TC_BFSL_LOGIN_044: To validate the field "PAN" in the Login screen by providing space in between the characters', () => {
            cy.login(USER_NAME, PASSWORD, 'ad 5df 5 d')
            cy.get('.content [name="pan_dob"]').should('have.value', 'AD5DF5D')

        })
        it('TC_BFSL_LOGIN_045: To validate the field "PAN" in the Login screen by entering less than 10 characters in the PAN field', () => {
            cy.login(USER_NAME, PASSWORD, 'AbCdEf')
            cy.get('.input-div + .errorDiv').contains('Please enter valid PAN')

        })
        it('TC_BFSL_LOGIN_046: To validate the field "PAN" in the Login screen by entering more than 10 characters in the PAN field', () => {
            cy.login(USER_NAME, PASSWORD, '1234567899AAAAA1111A')
            cy.get('.content [name="pan_dob"]').should('have.value', '1234567899')

        })

    })

    describe('Other login', () => {

        it('TC_BFSL_LOGIN_048: To validate the field "Forgot Password" in the login screen', () => {
            // open forgot password field
            cy.get('.forgetPassword-link').click({ force: true })
            cy.checkText('.window .content', 'USER ID')
            cy.checkText('.window .content', 'PAN')
            cy.checkLength('.window .footer .negativeBtn', 1)
            cy.checkLength('.window .footer .left-btn.positiveBtn', 1)
            cy.get('.window .footer .negativeBtn').click({ force: true });
        })


        it('TC_BFSL_LOGIN_053: To validate the field "Membership details" in the login screen', () => {
            cy.isVisible('span.membership-link').click({ force: true })
            cy.isVisible('.membership-dialog')
            // cy.get('.app-modalDialog .content .regNo + span').should('eq','INZ000177036')
            cy.get('.app-modalDialog.membership-dialog').click(-20, -20, { force: true });

        })
        it('TC_BFSL_LOGIN_056: To validate that the click on cancel button in the Change Password popup display the Login screen', () => {
            cy.isVisible('span.forgetPassword-link').click({ force: true })
            cy.isVisible('.forget-password-dialog')
            cy.get('.window .footer .negativeBtn').contains('CANCEL').click({ force: true })
        })
        it('TC_BFSL_LOGIN_057: To validate that the click on Outside of the Change Password popup display the Login screen', () => {
            cy.isVisible('span.forgetPassword-link').click({ force: true })
            cy.isVisible('.forget-password-dialog')
            // cy.isVisible('.window')
            cy.get('.app-modalDialog.forget-password-dialog').click(-20, -20, { force: true });

        })
        it("TC_BFSL_LOGIN_062: To validate that the click on Password tool tip icon displays the information about the password", () => {
            cy.get('.infoIcon ').click({ force: true })
            cy.isVisible('.tooltip-container')
        })
    })

    describe('valid case', () => {
        it("TC_BFSL_LOGIN_010 & 039 & 049 : To validate the Login button in the login screen", () => {
            cy.login(USER_NAME, PASSWORD, PAN_NUMBER)
            // cy.wait(2000)
            // cy.visit(URL)

        })
        it("TC_BFSL_LOGIN_010 & 039 & 027: To validate the Login button in the login screen", () => {
            cy.get('span.cursor').contains("DOB").click({ force: true })
            cy.login(USER_NAME, PASSWORD, DOB)
            // cy.wait(2000)
            // cy.visit(URL)

        })
    })

    // describe('valid case', () => {
    //     it("TC_BFSL_LOGIN_010 & 039 & 049 : To validate the Login button and Unblock in the login screen", () => {
    //         cy.get('span.cursor').contains("PAN").click({ force: true })
    //         cy.login(USER_NAME, PASSWORD, PAN_NUMBER)
    //         // cy.wait(2000)
    //         if (Cypress.$('.window')) {
    //             cy.get('.window .footer .positiveBtn').contains('UNBLOCK').click({ force: true })
    //             // cy.wait(500)
    //             cy.unblockUser()
    //         }
    //     })
    // })
})

