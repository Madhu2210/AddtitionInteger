import order from '../../src/state/reducers/OrderReducer'

const initialState = {
    dialog: {
        dialogName: "",
        data: {},
        message: '',
        parentCB: null
    },
    orderMenu: {
        showOrderMenu: false
    }
}
describe('testing action type=STORE_ORDER_BOOK_DIALOG_DETAILS', () => {

    test('Initial state', () => {
        expect(order(undefined, "")).toEqual(initialState);
    })

    test('null payload', () => {
        const action = {
            type: 'STORE_ORDER_BOOK_DIALOG_DETAILS',
            payload: ''
        };
        const result = order(undefined, action)
        console.log(result)
        expect(result.dialog).toBeFalsy();
    })
    
    test('invalid action type', () => {
        const action = {
            type: 'aa',
            payload: 'aa'
        };
        const result = order(undefined, action)
        console.log(result)
        expect(result).toEqual(initialState);
    })
    test('null action type', () => {
        const action = {
            type: ''
        };
        const result = order(undefined, action)
        expect(result).toEqual(initialState);
    })
    test('null action payload', () => {
        const action = {
            type: 'STORE_ORDER_BOOK_DIALOG_DETAILS',
            payload: null
        };
        const result = order(undefined, action)
        expect(result.dialog).toBeNull();
    })
    test('valid payload', () => {
        const payload = {
            dialogName: 'ORDER_TRAIL',
            data: ['aaa', 'bbb', 'ccc'],
            parentCB: null
        }
        const action = {
            type: 'STORE_ORDER_BOOK_DIALOG_DETAILS',
            payload: payload
        }
        const result = order(undefined, action)
        expect(result.dialog).toBeDefined();
        expect(result.dialog).toEqual(payload);
    })
    test('testing payload properties', () => {
        const payload = {
            dialogName: 'ORDER_TRAIL',
            data: ['aaa', 'bbb', 'ccc'],
            parentCB: null
        }
        const action = {
            type: 'STORE_ORDER_BOOK_DIALOG_DETAILS',
            payload: payload
        }
        const result = order(undefined, action)

        expect(result.dialog).toHaveProperty("dialogName")
        expect(result.dialog).toHaveProperty("data")
        expect(result.dialog).toHaveProperty("parentCB")
        expect(result.dialog).not.toHaveProperty("message")

    })


})
describe('testind action type=STORE_TRADE_BOOK_DIALOG_DETAILS', () => {

    test('null payload', () => {
        const action = {
            type: 'STORE_TRADE_BOOK_DIALOG_DETAILS',
            payload: ''
        };
        const result = order(undefined, action)
        console.log(result)
        expect(result.dialog).toBe('');
    })
    test('action with null type and payload', () => {
        const action = {
            type: '',
            payload: ''
        };
        const result = order(undefined, action)
        console.log(result)
        expect(result).toEqual(initialState);
    })
    test('invalid action type', () => {
        const action = {
            type: 'trade',
            payload: ''
        };
        const result = order(undefined, action)
        console.log(result)
        expect(result).toEqual(initialState);
    })
    test('no action type,payload', () => {
        const action = {
        };
        const result = order(undefined, action)
        expect(result).toEqual(initialState);
    })
    test('null action payload', () => {
        const action = {
            type: 'STORE_TRADE_BOOK_DIALOG_DETAILS',
            payload: null
        };
        const result = order(undefined, action)
        expect(result.dialog).toBeNull();
    })
    test('valid payload', () => {
        const payload = {
            dialogName: 'TRADE_DATE',
            message: '',
            data: {},
            parentCB: ''
        }
        const action = {
            type: 'STORE_TRADE_BOOK_DIALOG_DETAILS',
            payload: payload
        }
        const result = order(undefined, action)
        expect(result.dialog).toBeDefined();
        expect(result.dialog).toEqual(payload);
    })
    test('testing payload properties', () => {
        const payload = {
            dialogName: 'TRADE_DATE',
            message: '',
            data: {},
            parentCB: ''
        }
        const action = {
            type: 'STORE_TRADE_BOOK_DIALOG_DETAILS',
            payload: payload
        }
        const result = order(undefined, action)

        expect(result.dialog).toHaveProperty("dialogName")
        expect(result.dialog).toHaveProperty("data")
        expect(result.dialog).toHaveProperty("message")

        expect(result.dialog).toHaveProperty("parentCB")

    })

})
describe('testing action type=STORE_NET_POSITION_DIALOG_DETAILS', () => {


    test('null payload', () => {
        const action = {
            type: 'STORE_NET_POSITION_DIALOG_DETAILS',
            payload: ''
        };
        const result = order(undefined, action)
        console.log(result)
        expect(result.dialog).toBe('');
    })
    test('action with null type and payload', () => {
        const action = {
            type: '',
            payload: ''
        };
        const result = order(undefined, action)
        console.log(result)
        expect(result).toEqual(initialState);
    })
    test('action with invalid type', () => {
        const action = {
            type: 'trade',
            payload: ''
        };
        const result = order(undefined, action)
        console.log(result)
        expect(result).toEqual(initialState);
    })
    test(' action with no payload and type', () => {
        const action = {
        };
        const result = order(undefined, action)
        expect(result).toEqual(initialState);
    })
    test('null action payload', () => {
        const action = {
            type: 'STORE_NET_POSITION_DIALOG_DETAILS',
            payload: null
        };
        const result = order(undefined, action)
        expect(result.dialog).toBeNull();
    })
    test('valid payload', () => {
        const payload = {
            dialogName: 'TRADE_DATE',
            data: {},
            parentCB: ''
        }
        const action = {
            type: 'STORE_NET_POSITION_DIALOG_DETAILS',
            payload: payload
        }
        const result = order(undefined, action)
        expect(result.dialog).toBeDefined();
        expect(result.dialog).toEqual(payload);
    })
    test('testing payload properties', () => {
        const payload = {
            dialogName: 'TRADE_DATE',
            data: { ltp: '', avgprice: '', qty: '' },
            parentCB: ''
        }
        const action = {
            type: 'STORE_NET_POSITION_DIALOG_DETAILS',
            payload: payload
        }
        const result = order(undefined, action)

        expect(result.dialog).toHaveProperty("dialogName")
        expect(result.dialog).toHaveProperty("data")
        expect(result.dialog).not.toHaveProperty("message")
        expect(result.dialog).toHaveProperty("parentCB")
        expect(result.dialog.data).toEqual({ ltp: '', avgprice: '', qty: '' })

    })
})

describe('testing action type=STORE_ORDER_MENU', () => {
    test('payload true', () => {

        const action = {
            type: 'STORE_ORDER_MENU',
            payload: true
        }
        const result = order(undefined, action)
        expect(result.orderMenu).toBeTruthy()

    })
    test('action with no payload', () => {

        const action = {
            type: 'STORE_ORDER_MENU',
        }
        const result = order(undefined, action)
        expect(result.orderMenu).toBeUndefined()
    })

    test('null payload', () => {
        const action = {
            type: 'STORE_ORDER_MENU',
            payload: null
        }
        const result = order(undefined, action)
        expect(result.orderMenu).toBeNull()
    })

    test('payload false', () => {
        const action = {
            type: 'STORE_ORDER_MENU',
            payload: false
        }
        const result = order(undefined, action)
        expect(result.orderMenu).toBeFalsy()
        expect(result.orderMenu).toBe(false)


    })
})