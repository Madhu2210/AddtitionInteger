import * as action from '../../src/state/actions/Actions'

describe('testing action-showAppDialog', () => {
    it('should create an action to showAppDialog', () => {
        const payload = 'Finish docs'
        const expectedAction = {
            type: 'SHOW_APP_DIALOG',
            payload: payload
        }
        expect(action.showAppDialog(payload)).toEqual(expectedAction)
    })
})

describe('testing action-storeLogInStatus', () => {

    const expectedAction = {
        type: 'LOGIN_STATUS',
        payload: true
    }

    test('should create an action to storeLogInStatus(true)', () => {
        const result = action.storeLogInStatus(true)
        expect(result).toMatchObject(expectedAction)
        expect(result.payload).toBe(true)
    })

    test('should create an action to storeLogInStatus(false)', () => {
        const result = action.storeLogInStatus(false)
        expect(result.payload).toBe(false)
    })
   

    test('should create an action to storeLogInStatus(true)', () => {
        const result = action.storeLogInStatus(true)
        expect(result).toHaveProperty("type")
        expect(result).toHaveProperty("payload")
        expect(result).not.toHaveProperty("pay")

    })
})

describe('storeLoggedUserType', () => {

    const expectedAction = {
        type: 'LOGGED_USER_TYPE',
        payload: "trading"
    }

    test('should create an action to storeLoggedUserType("..")',()=>{
        const result=action.storeLoggedUserType('trading')
        expect(result).toEqual(expectedAction)
        expect(result.payload).toBe('trading')
    })
    test('should create an action to storeLoggedUserType(null)',()=>{
        const result=action.storeLoggedUserType(null)
        expect(result.payload).toBeNull()
    })
    
    test('should create an action to storeLoggedUserType()',()=>{
        const result=action.storeLoggedUserType()
        expect(result.payload).toBeUndefined()
    })
    test('', () => {
        const result = action.storeLoggedUserType('trading')
        expect(result).toHaveProperty("type")
        expect(result).toHaveProperty("payload")
        expect(result).not.toHaveProperty("pay")

    })
})

describe('storeLoginDialogDetails', () => {

    const expectedAction = {
        type: 'STORE_LOGIN_DIALOG_DETAILS',
        payload: {}
    }
    test('should create an action to storeLoginDialogDetails()',()=>{
        const result=action.storeLoginDialogDetails()
        expect(result.payload).toBeUndefined()
        expect(result.payload).toBeFalsy()
    })
    
    test('',()=>{
        const result=action.storeLoginDialogDetails(null)
        expect(result.payload).toBeNull()
    })
    test('',()=>{
        const result=action.storeLoginDialogDetails({})
        expect(result).toEqual(expectedAction)
    })
})