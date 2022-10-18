import login from '../../src/state/reducers/LoginReducer'

describe('INITIAL_STATE', () => {

    const initialState = {
        loginStatus: false,
        loggedUserType: null,
        clientDetails: {
            custName: null,
            lastLoginTime: null,
            session: null
        },
        dialog: {
            dialogName: null,
            message: '',
            parentCB: null,
            userId: null
        }
    }
    test('Initial state', () => {
        expect(login(undefined, "")).toEqual(initialState);
    })
    test('LOGIN_STATUS', () => {
        const action = {
            type: 'LOGIN_STATUS',
            payload: true
        };
        const result = login(undefined, action)
        console.log(result)
        expect(result.loginStatus).toEqual(true);
    })
    test('LOGIN_STATUS', () => {
        const action = {
            type: 'LOGIN_STATUS',
            payload: false
        };
        const result = login(undefined, action)
        console.log(result)
        expect(result.loginStatus).toEqual(false);
    })

    test('LOGIN_STATUS', () => {
        const action = {
            type: 'LOGIN_STATUS',
            payload: null
        };
        const result = login(undefined, action)
        console.log(result)
        expect(result.loginStatus).toBeNull();
    })
    test('LOGIN_STATUS', () => {
        const action = {
            type: 'LOGIN_STATUS',
            payload: ''
        };
        const result = login(undefined, action)
        console.log(result)
        expect(result.loginStatus).toBeFalsy();
    })


    test('null action', () => {

        const result = login(undefined, "")
        console.log(result)
        expect(result).toEqual(initialState);
        expect(result.loggedUserType).toBeNull();
    })
    test(' LOGGED_USER_TYPE is correct', () => {
        const action = {
            type: 'LOGGED_USER_TYPE',
            payload: "TRADING"
        };
        const result = login(undefined, action)
        console.log(result)
        expect(result.loggedUserType).toEqual("TRADING");
    })
    test('empty LOGGED_USER_TYPE ', () => {
        const action = {
            type: 'LOGGED_USER_TYPE',
            payload: " "
        };
        const result = login(undefined, action)
        expect(result.loggedUserType).toEqual(" ");
    })
    test('empty LOGGED_USER_TYPE ', () => {
        const action = {
            type: 'LOGGED_USER_TYPE',
            payload: null
        };
        const result = login(undefined, action)
        expect(result.loggedUserType).toBeNull();
    })
    test('empty LOGGED_USER_TYPE ', () => {
        const action = {
            type: 'LOGGED_USER_TYPE'
        };
        const result = login(undefined, action)
        expect(result.loggedUserType).toBeUndefined();
    })

    test('null action type', () => {
        const action = {
            type: ''
        };
        const result = login(undefined, action)
        expect(result.loggedUserType).toBeNull();
    })
    test('null action type', () => {
        const action = {
            type: ''
        };
        const result = login(undefined, action)
        expect(result).toEqual(initialState);
    })

    test('null action type', () => {
        const action = {
            type: 'STORE_LOGIN_DIALOG_DETAILS'
        };
        const result = login(undefined, action)
        expect(result.dialog).toBeUndefined();
    })
    test('', () => {
        const payload = {
            dialogName: null,
            message: '',
            parentCB: null,
            userId: null
        }
        const action = {
            type: 'STORE_LOGIN_DIALOG_DETAILS',
            payload: payload
        }
        const result = login(undefined, action)
        expect(result.dialog).toEqual(payload)

    })
    test('', () => {

        const action = {
            type: 'STORE_LOGIN_DIALOG_DETAILS',
            payload: null
        }
        const result = login(undefined, action)
        expect(result.dialog).toBeNull()

    })
    test('', () => {

        const action = {
            type: 'STORE_LOGIN_DIALOG_DETAILS',
        }
        const result = login(undefined, action)
        expect(result.dialog).toBeUndefined()

    })




    test('null action type', () => {
        const action = {
            type: 'CLIENT_DETAILS',

        };

        const result = login(undefined, action)
        expect(result.clientDetails).toBeUndefined();
    })

    test('null action type', () => {
        const payload = {
            custName: "abc",
            lastLoginTime: "12/12/2020",
            session: "1"
        }
        const action = {
            type: 'CLIENT_DETAILS',
            payload: payload
        };

        const result = login(undefined, action)
        expect(result.clientDetails).toEqual(payload);
    })
    test('null payload type', () => {
        const action = {
            type: 'CLIENT_DETAILS',
            payload: {}
        };

        const result = login(undefined, action)
        expect(result.clientDetails).toEqual({});
    })
    test('null payload type', () => {
        const action = {
            type: 'CLIENT_DETAILS',
            payload: null
        };
        const result = login(undefined, action)
        expect(result.clientDetails).toBeNull();
    })
})