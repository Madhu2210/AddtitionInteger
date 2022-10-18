import orderpad from '../../src/state/reducers/OrderPadReducer'
const initialState = {
    selectedSym: null,
    orderFieldValues: null,
    modifyOrder: {
        modifyType: null,
        symDetails: {}
    },
    isModifyOrder_internal: false,
    dialog: {
        dialogName: null,
        message: '',
        parentCB: null,
        trade_type: null
    }
}
test('Initial state', () => {
    expect(orderpad(undefined, "")).toEqual(initialState);
})

describe('testing action type=STORE_ORDERPAD_DIALOG_DETAILS', () => {
    test('null payload', () => {
        const action = {
            type: 'STORE_ORDERPAD_DIALOG_DETAILS',
            payload: ''
        };
        const result = orderpad(undefined, action)
        console.log(result)
        expect(result.dialog).toBe('');
    })
    test('action with null type and payload', () => {
        const action = {
            type: '',
            payload: ''
        };
        const result = orderpad(undefined, action)
        console.log(result)
        expect(result).toEqual(initialState);
    })
    test('invalid action type', () => {
        const action = {
            type: 'trade',
            payload: ''
        };
        const result = orderpad(undefined, action)
        console.log(result)
        expect(result).toEqual(initialState);
    })
    test('no action type,payload', () => {
        const action = {
        };
        const result = orderpad(undefined, action)
        expect(result).toEqual(initialState);
    })
    test('null action payload', () => {
        const action = {
            type: 'STORE_ORDERPAD_DIALOG_DETAILS',
            payload: null
        };
        const result = orderpad(undefined, action)
        expect(result.dialog).toBeNull();
    })
    test('valid payload', () => {
        const payload = {
            dialogName: 'ORDER_PAD',
            trade_type: 'SELL'
        }
        const action = {
            type: 'STORE_ORDERPAD_DIALOG_DETAILS',
            payload: payload
        }
        const result = orderpad(undefined, action)
        expect(result.dialog).toBeDefined();
        expect(result.dialog).toEqual(payload);
    })
    test('testing payload properties', () => {
        const payload = {
            dialogName: 'ORDER_PAD',
            trade_type: 'SELL'
        }
        const action = {
            type: 'STORE_ORDERPAD_DIALOG_DETAILS',
            payload: payload
        }
        const result = orderpad(undefined, action)

        expect(result.dialog).toHaveProperty("dialogName")
        expect(result.dialog).toHaveProperty("trade_type")
        expect(result.dialog).not.toHaveProperty("parentCB")
        expect(result.dialog.trade_type).toBe('SELL')

    })

})

describe('testing action type=STORE_ORDERPAD_SELECTED_SYM', () => {
    test('null payload', () => {
        const action = {
            type: 'STORE_ORDERPAD_SELECTED_SYM',

        };
        const result = orderpad(undefined, action)
        console.log(result)
        expect(result.selectedSym).toBeNull;
    })



    test('null action payload', () => {
        const action = {
            type: 'STORE_ORDERPAD_SELECTED_SYM',
            payload: null
        };
        const result = orderpad(undefined, action)
        expect(result.selectedSym).toBeNull();
    })
    test('valid payload', () => {
        const payload = {
            symbol: {
                basesym: '',
                dispsym: ''
            }
        }
        const action = {
            type: 'STORE_ORDERPAD_SELECTED_SYM',
            payload: payload
        }
        const result = orderpad(undefined, action)
        expect(result.selectedSym).toBeDefined();
        expect(result.selectedSym).toEqual(payload);
    })
    test('testing payload properties', () => {
        const payload = {
            symbol: {
                basesym: '',
                dispsym: ''
            }
        }
        const action = {
            type: 'STORE_ORDERPAD_SELECTED_SYM',
            payload: payload
        }
        const result = orderpad(undefined, action)
        expect(result.selectedSym).toHaveProperty("symbol")
        expect(result.selectedSym).not.toHaveProperty("parentCB")

    })

})

describe('testing action type=STORE_ORDER_FIELD_VALUES', () => {
    test('null payload', () => {
        const action = {
            type: 'STORE_ORDER_FIELD_VALUES',
            payload: ''
        };
        const result = orderpad(undefined, action)
        console.log(result)
        expect(result.orderFieldValues).toBe('');
    })



    test('null action payload', () => {
        const action = {
            type: 'STORE_ORDER_FIELD_VALUES',
            payload: null
        };
        const result = orderpad(undefined, action)
        expect(result.orderFieldValues).toBeNull();
    })
    test('valid payload', () => {
        const payload = {}

        const action = {
            type: 'STORE_ORDER_FIELD_VALUES',
            payload: payload
        }
        const result = orderpad(undefined, action)
        expect(result.orderFieldValues).toBeDefined();
        expect(result.orderFieldValues).toEqual(payload);
    })
    test('testing payload properties', () => {
        const payload = {}
        const action = {
            type: 'STORE_ORDER_FIELD_VALUES',
            payload: payload
        }
        const result = orderpad(undefined, action)
        expect(result.orderFieldValues).toEqual({})
        expect(result.orderFieldValues).not.toHaveProperty("parentCB")
    })
})

describe('', () => {
    test('null action payload', () => {
        const action = {
            type: 'STORE_MODIFY_ORDER_INTERNAL_FLAG',
            payload: true
        };
        const result = orderpad(undefined, action)
        expect(result).toBeTruthy();
        expect(result.isModifyOrder_internal).toBeTruthy();

    })
    test('null action payload', () => {
        const action = {
            type: 'STORE_MODIFY_ORDER_INTERNAL_FLAG',
            payload: null
        };
        const result = orderpad(undefined, action)
        expect(result.isModifyOrder_internal).toBeNull();
    })
    test('null action payload', () => {
        const action = {
            type: 'STORE_MODIFY_ORDER_INTERNAL_FLAG',

        };
        const result = orderpad(undefined, action)
        expect(result.isModifyOrder_internal).toBeUndefined();
    })
})

test('null action payload', () => {
    const action = {
        type: 'STORE_MODIFY_ORDER_INTERNAL_FLAG',

    };
    const result = orderpad(undefined, action)
    expect(result.isModifyOrder_internal).toBeUndefined();
})
test('null action payload', () => {
    const action = {
        type: 'STORE_MODIFY_ORDER_INTERNAL_FLAG',
        payload: {
            modifyType: null,
            symDetails: {}
        }

    };
    const result = orderpad(undefined, action)
    expect(result.modifyOrder).toEqual({
        modifyType: null,
        symDetails: {}
    })
});


