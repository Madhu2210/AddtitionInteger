(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.introJs = factory());
})(this, (function () {

    function _typeof(obj) {
        "@babel/helpers - typeof";

        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function (obj) {
                return typeof obj;
            };
        } else {
            _typeof = function (obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ?
                    "symbol" : typeof obj;
            };
        }

        return _typeof(obj);
    }

    /**
     * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
     * via: http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
     *
     * @param obj1
     * @param obj2
     * @returns obj3 a new object based on obj1 and obj2
     */
    function mergeOptions(obj1, obj2) {
        let obj3 = {};
        let attrname;

        for (attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }

        for (attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }

        return obj3;
    }

    /**
     * Mark any object with an incrementing number
     * used for keeping track of objects
     *
     * @param Object obj   Any object or DOM Element
     * @param String key
     * @return Object
     */
    let stamp = function () {
        let keys = {};
        return function stamp(obj) {
            let key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "introjs-stamp";
            // each group increments from 0
            // stamp only once per object
            keys[key] = keys[key] || 0;

            if (obj[key] === undefined) {
                // increment key for each new object
                obj[key] = keys[key]++;
            }

            return obj[key];
        };
    }();

    /**
     * Iterates arrays
     *
     * @param {Array} arr
     * @param {Function} forEachFnc
     * @param {Function} [completeFnc]
     * @return {Null}
     */
    function forEach(arr, forEachFnc, completeFnc) {
        // in case arr is an empty query selector node list
        if (arr) {
            for (let i = 0, len = arr.length; i < len; i++) {
                forEachFnc(arr[i], i);
            }
        }

        if (typeof completeFnc === "function") {
            completeFnc();
        }
    }

    /**
     * DOMEvent Handles all DOM events
     *
     * methods:
     *
     * on - add event handler
     * off - remove event
     */

    let DOMEvent = function () {
        function DOMEvent() {
            let events_key = "introjs_event";
            /**
         * Gets a unique ID for an event listener
         *
         * @param obj Object
         * @param type event type
         * @param listener Function
         * @param context Object
         * @return String
         */

            this._id = function (obj, type, listener, context) {
                return type + stamp(listener) + (context ? "_".concat(stamp(context)) : "");
            };
            /**
         * Adds event listener
         *
         * @param obj Object obj
         * @param type String
         * @param listener Function
         * @param context Object
         * @param useCapture Boolean
         * @return null
         */

            this.on = function (obj, type, listener, context, useCapture) {
                let id = this._id.apply(this, arguments);

                let handler = function handler(e) {
                    return listener.call(context || obj, e || window.event);
                };

                if ("addEventListener" in obj) {
                    obj.addEventListener(type, handler, useCapture);
                } else if ("attachEvent" in obj) {
                    obj.attachEvent("on".concat(type), handler);
                }

                obj[events_key] = obj[events_key] || {};
                obj[events_key][id] = handler;
            };
            /**
         * Removes event listener
         *
         * @param obj Object
         * @param type String
         * @param listener Function
         * @param context Object
         * @param useCapture Boolean
         * @return null
         */

            this.off = function (obj, type, listener, context, useCapture) {
                let id = this._id.apply(this, arguments);

                let handler = obj[events_key] && obj[events_key][id];

                if (!handler) {
                    return;
                }

                if ("removeEventListener" in obj) {
                    obj.removeEventListener(type, handler, useCapture);
                } else if ("detachEvent" in obj) {
                    obj.detachEvent("on".concat(type), handler);
                }

                obj[events_key][id] = null;
            };
        }

        return new DOMEvent();
    }();

    let commonjsGlobal = typeof globalThis !== 'undefined' ?
        globalThis : typeof window !== 'undefined' ?
            window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
        return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    let check = function (it) {
        return it && it.Math == Math && it;
    };

    // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
    let global_1 =
        // eslint-disable-next-line es/no-global-this -- safe
        check(typeof globalThis == 'object' && globalThis) ||
        check(typeof window == 'object' && window) ||
        // eslint-disable-next-line no-restricted-globals -- safe
        check(typeof self == 'object' && self) ||
        check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
        // eslint-disable-next-line no-new-func -- fallback
        (function () { return this; })() || Function('return this')();

    let fails = function (exec) {
        try {
            return !!exec();
        } catch (error) {
            return true;
        }
    };

    // Detect IE8's incomplete defineProperty implementation
    let descriptors = !fails(function () {
        // eslint-disable-next-line es/no-object-defineproperty -- required for testing
        return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
    });

    let call$2 = Function.prototype.call;

    let functionCall = call$2.bind ? call$2.bind(call$2) : function () {
        return call$2.apply(call$2, arguments);
    };

    let $propertyIsEnumerable = {}.propertyIsEnumerable;
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    let getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

    // Nashorn ~ JDK8 bug
    let NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

    // `Object.prototype.propertyIsEnumerable` method implementation
    // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
    let f$4 = NASHORN_BUG ? function propertyIsEnumerable(V) {
        let descriptor = getOwnPropertyDescriptor$1(this, V);
        return !!descriptor && descriptor.enumerable;
    } : $propertyIsEnumerable;

    let objectPropertyIsEnumerable = {
        f: f$4
    };

    let createPropertyDescriptor = function (bitmap, value) {
        return {
            enumerable: !(bitmap & 1),
            configurable: !(bitmap & 2),
            writable: !(bitmap & 4),
            value: value
        };
    };

    let FunctionPrototype$2 = Function.prototype;
    let bind$2 = FunctionPrototype$2.bind;
    let call$1 = FunctionPrototype$2.call;
    let callBind = bind$2 && bind$2.bind(call$1);

    let functionUncurryThis = bind$2 ? function (fn) {
        return fn && callBind(call$1, fn);
    } : function (fn) {
        return fn && function () {
            return call$1.apply(fn, arguments);
        };
    };

    let toString$1 = functionUncurryThis({}.toString);
    let stringSlice$5 = functionUncurryThis(''.slice);

    let classofRaw = function (it) {
        return stringSlice$5(toString$1(it), 8, -1);
    };

    let Object$4 = global_1.Object;
    let split = functionUncurryThis(''.split);

    // fallback for non-array-like ES3 and non-enumerable old V8 strings
    let indexedObject = fails(function () {
        // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
        // eslint-disable-next-line no-prototype-builtins -- safe
        return !Object$4('z').propertyIsEnumerable(0);
    }) ? function (it) {
            return classofRaw(it) == 'String' ? split(it, '') : Object$4(it);
        } : Object$4;

    let TypeError$c = global_1.TypeError;

    // `RequireObjectCoercible` abstract operation
    // https://tc39.es/ecma262/#sec-requireobjectcoercible
    let requireObjectCoercible = function (it) {
        if (it == undefined) throw TypeError$c("Can't call method on " + it);
        return it;
    };

    // toObject with fallback for non-array-like ES3 strings

    let toIndexedObject = function (it) {
        return indexedObject(requireObjectCoercible(it));
    };

    // `IsCallable` abstract operation
    // https://tc39.es/ecma262/#sec-iscallable
    let isCallable = function (argument) {
        return typeof argument == 'function';
    };

    let isObject = function (it) {
        return typeof it == 'object' ? it !== null : isCallable(it);
    };

    let aFunction = function (argument) {
        return isCallable(argument) ? argument : undefined;
    };

    let getBuiltIn = function (namespace, method) {
        return arguments.length < 2 ?
            aFunction(global_1[namespace]) : global_1[namespace] && global_1[namespace][method];
    };

    let objectIsPrototypeOf = functionUncurryThis({}.isPrototypeOf);

    let engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

    let process = global_1.process;
    let Deno = global_1.Deno;
    let versions = process && process.versions || Deno && Deno.version;
    let v8 = versions && versions.v8;
    let match, version$1;

    if (v8) {
        match = v8.split('.');
        // in old Chrome, versions of V8 isn't V8 = Chrome / 10
        // but their correct versions are not interesting for us
        version$1 = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
    }

    // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
    // so check `userAgent` even if `.v8` exists, but 0
    if (!version$1 && engineUserAgent) {
        match = engineUserAgent.match(/Edge\/(\d+)/);
        if (!match || match[1] >= 74) {
            match = engineUserAgent.match(/Chrome\/(\d+)/);
            if (match) version$1 = +match[1];
        }
    }

    let engineV8Version = version$1;

    /* eslint-disable es/no-symbol -- required for testing */

    // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
    let nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
        let symbol = Symbol();
        // Chrome 38 Symbol has incorrect toString conversion
        // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
        return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
            // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
            !Symbol.sham && engineV8Version && engineV8Version < 41;
    });

    /* eslint-disable es/no-symbol -- required for testing */

    let useSymbolAsUid = nativeSymbol
        && !Symbol.sham
        && typeof Symbol.iterator == 'symbol';

    let Object$3 = global_1.Object;

    let isSymbol = useSymbolAsUid ? function (it) {
        return typeof it == 'symbol';
    } : function (it) {
        let $Symbol = getBuiltIn('Symbol');
        return isCallable($Symbol) && objectIsPrototypeOf($Symbol.prototype, Object$3(it));
    };

    let String$3 = global_1.String;

    let tryToString = function (argument) {
        try {
            return String$3(argument);
        } catch (error) {
            return 'Object';
        }
    };

    let TypeError$b = global_1.TypeError;

    // `Assert: IsCallable(argument) is true`
    let aCallable = function (argument) {
        if (isCallable(argument)) return argument;
        throw TypeError$b(tryToString(argument) + ' is not a function');
    };

    // `GetMethod` abstract operation
    // https://tc39.es/ecma262/#sec-getmethod
    let getMethod = function (V, P) {
        let func = V[P];
        return func == null ? undefined : aCallable(func);
    };

    let TypeError$a = global_1.TypeError;

    // `OrdinaryToPrimitive` abstract operation
    // https://tc39.es/ecma262/#sec-ordinarytoprimitive
    let ordinaryToPrimitive = function (input, pref) {
        let fn, val;
        if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input)))
            return val;
        if (isCallable(fn = input.valueOf) && !isObject(val = functionCall(fn, input))) return val;
        if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input)))
            return val;
        throw TypeError$a("Can't convert object to primitive value");
    };

    // eslint-disable-next-line es/no-object-defineproperty -- safe
    let defineProperty$1 = Object.defineProperty;

    let setGlobal = function (key, value) {
        try {
            defineProperty$1(global_1, key, { value: value, configurable: true, writable: true });
        } catch (error) {
            global_1[key] = value;
        } return value;
    };

    let SHARED = '__core-js_shared__';
    let store$1 = global_1[SHARED] || setGlobal(SHARED, {});

    let sharedStore = store$1;

    let shared = createCommonjsModule(function (module) {
        (module.exports = function (key, value) {
            return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
        })('versions', []).push({
            version: '3.19.1',
            mode: 'global',
            copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
        });
    });

    let Object$2 = global_1.Object;

    // `ToObject` abstract operation
    // https://tc39.es/ecma262/#sec-toobject
    let toObject = function (argument) {
        return Object$2(requireObjectCoercible(argument));
    };

    let hasOwnProperty = functionUncurryThis({}.hasOwnProperty);

    // `HasOwnProperty` abstract operation
    // https://tc39.es/ecma262/#sec-hasownproperty
    let hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
        return hasOwnProperty(toObject(it), key);
    };

    let id = 0;
    let postfix = Math.random();
    let toString = functionUncurryThis(1.0.toString);

    let uid = function (key) {
        return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
    };

    let WellKnownSymbolsStore = shared('wks');
    let Symbol$1 = global_1.Symbol;
    let symbolFor = Symbol$1 && Symbol$1['for'];
    let createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

    let wellKnownSymbol = function (name) {
        if (!hasOwnProperty_1(WellKnownSymbolsStore, name) || !(nativeSymbol || typeof WellKnownSymbolsStore[name] == 'string')) {
            let description = 'Symbol.' + name;
            if (nativeSymbol && hasOwnProperty_1(Symbol$1, name)) {
                WellKnownSymbolsStore[name] = Symbol$1[name];
            } else if (useSymbolAsUid && symbolFor) {
                WellKnownSymbolsStore[name] = symbolFor(description);
            } else {
                WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
            }
        } return WellKnownSymbolsStore[name];
    };

    let TypeError$9 = global_1.TypeError;
    let TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

    // `ToPrimitive` abstract operation
    // https://tc39.es/ecma262/#sec-toprimitive
    let toPrimitive = function (input, pref) {
        if (!isObject(input) || isSymbol(input)) return input;
        let exoticToPrim = getMethod(input, TO_PRIMITIVE);
        let result;
        if (exoticToPrim) {
            if (pref === undefined) pref = 'default';
            result = functionCall(exoticToPrim, input, pref);
            if (!isObject(result) || isSymbol(result)) return result;
            throw TypeError$9("Can't convert object to primitive value");
        }
        if (pref === undefined) pref = 'number';
        return ordinaryToPrimitive(input, pref);
    };

    // `ToPropertyKey` abstract operation
    // https://tc39.es/ecma262/#sec-topropertykey
    let toPropertyKey = function (argument) {
        let key = toPrimitive(argument, 'string');
        return isSymbol(key) ? key : key + '';
    };

    let document$1 = global_1.document;
    // typeof document.createElement is 'object' in old IE
    let EXISTS$1 = isObject(document$1) && isObject(document$1.createElement);

    let documentCreateElement = function (it) {
        return EXISTS$1 ? document$1.createElement(it) : {};
    };

    // Thank's IE8 for his funny defineProperty
    let ie8DomDefine = !descriptors && !fails(function () {
        // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
        return Object.defineProperty(documentCreateElement('div'), 'a', {
            get: function () { return 7; }
        }).a != 7;
    });

    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    let $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

    // `Object.getOwnPropertyDescriptor` method
    // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
    let f$3 = descriptors ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
        O = toIndexedObject(O);
        P = toPropertyKey(P);
        if (ie8DomDefine) try {
            return $getOwnPropertyDescriptor(O, P);
        } catch (error) { /* empty */ }
        if (hasOwnProperty_1(O, P)) return createPropertyDescriptor(!functionCall(objectPropertyIsEnumerable.f, O, P), O[P]);
    };

    let objectGetOwnPropertyDescriptor = {
        f: f$3
    };

    let String$2 = global_1.String;
    let TypeError$8 = global_1.TypeError;

    // `Assert: Type(argument) is Object`
    let anObject = function (argument) {
        if (isObject(argument)) return argument;
        throw TypeError$8(String$2(argument) + ' is not an object');
    };

    let TypeError$7 = global_1.TypeError;
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    let $defineProperty = Object.defineProperty;

    // `Object.defineProperty` method
    // https://tc39.es/ecma262/#sec-object.defineproperty
    let f$2 = descriptors ? $defineProperty : function defineProperty(O, P, Attributes) {
        anObject(O);
        P = toPropertyKey(P);
        anObject(Attributes);
        if (ie8DomDefine) try {
            return $defineProperty(O, P, Attributes);
        } catch (error) { /* empty */ }
        if ('get' in Attributes || 'set' in Attributes) throw TypeError$7('Accessors not supported');
        if ('value' in Attributes) O[P] = Attributes.value;
        return O;
    };

    let objectDefineProperty = {
        f: f$2
    };

    let createNonEnumerableProperty = descriptors ? function (object, key, value) {
        return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
    } : function (object, key, value) {
        object[key] = value;
        return object;
    };

    let functionToString = functionUncurryThis(Function.toString);

    // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
    if (!isCallable(sharedStore.inspectSource)) {
        sharedStore.inspectSource = function (it) {
            return functionToString(it);
        };
    }

    let inspectSource = sharedStore.inspectSource;

    let WeakMap$1 = global_1.WeakMap;

    let nativeWeakMap = isCallable(WeakMap$1) && /native code/.test(inspectSource(WeakMap$1));

    let keys = shared('keys');

    let sharedKey = function (key) {
        return keys[key] || (keys[key] = uid(key));
    };

    let hiddenKeys$1 = {};

    let OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
    let TypeError$6 = global_1.TypeError;
    let WeakMap = global_1.WeakMap;
    let set, get, has;

    let enforce = function (it) {
        return has(it) ? get(it) : set(it, {});
    };

    let getterFor = function (TYPE) {
        return function (it) {
            let state;
            if (!isObject(it) || (state = get(it)).type !== TYPE) {
                throw TypeError$6('Incompatible receiver, ' + TYPE + ' required');
            } return state;
        };
    };

    if (nativeWeakMap || sharedStore.state) {
        let store = sharedStore.state || (sharedStore.state = new WeakMap());
        let wmget = functionUncurryThis(store.get);
        let wmhas = functionUncurryThis(store.has);
        let wmset = functionUncurryThis(store.set);
        set = function (it, metadata) {
            if (wmhas(store, it)) throw new TypeError$6(OBJECT_ALREADY_INITIALIZED);
            metadata.facade = it;
            wmset(store, it, metadata);
            return metadata;
        };
        get = function (it) {
            return wmget(store, it) || {};
        };
        has = function (it) {
            return wmhas(store, it);
        };
    } else {
        let STATE = sharedKey('state');
        hiddenKeys$1[STATE] = true;
        set = function (it, metadata) {
            if (hasOwnProperty_1(it, STATE)) throw new TypeError$6(OBJECT_ALREADY_INITIALIZED);
            metadata.facade = it;
            createNonEnumerableProperty(it, STATE, metadata);
            return metadata;
        };
        get = function (it) {
            return hasOwnProperty_1(it, STATE) ? it[STATE] : {};
        };
        has = function (it) {
            return hasOwnProperty_1(it, STATE);
        };
    }

    let internalState = {
        set: set,
        get: get,
        has: has,
        enforce: enforce,
        getterFor: getterFor
    };

    let FunctionPrototype$1 = Function.prototype;
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    let getDescriptor = descriptors && Object.getOwnPropertyDescriptor;

    let EXISTS = hasOwnProperty_1(FunctionPrototype$1, 'name');
    // additional protection from minified / mangled / dropped function names
    let PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
    let CONFIGURABLE =
        EXISTS && (!descriptors || (descriptors && getDescriptor(FunctionPrototype$1, 'name').configurable));

    let functionName = {
        EXISTS: EXISTS,
        PROPER: PROPER,
        CONFIGURABLE: CONFIGURABLE
    };

    let redefine = createCommonjsModule(function (module) {
        let CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;

        let getInternalState = internalState.get;
        let enforceInternalState = internalState.enforce;
        let TEMPLATE = String(String).split('String');

        (module.exports = function (O, key, value, options) {
            let unsafe = options ? !!options.unsafe : false;
            let simple = options ? !!options.enumerable : false;
            let noTargetGet = options ? !!options.noTargetGet : false;
            let name = options && options.name !== undefined ? options.name : key;
            let state;
            if (isCallable(value)) {
                if (String(name).slice(0, 7) === 'Symbol(') {
                    name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
                }
                if (!hasOwnProperty_1(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
                    createNonEnumerableProperty(value, 'name', name);
                }
                state = enforceInternalState(value);
                if (!state.source) {
                    state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
                }
            }
            if (O === global_1) {
                if (simple) O[key] = value;
                else setGlobal(key, value);
                return;
            } else if (!unsafe) {
                delete O[key];
            } else if (!noTargetGet && O[key]) {
                simple = true;
            }
            if (simple) O[key] = value;
            else createNonEnumerableProperty(O, key, value);
            // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
        })(Function.prototype, 'toString', function toString() {
            return isCallable(this) && getInternalState(this).source || inspectSource(this);
        });
    });

    let ceil = Math.ceil;
    let floor$2 = Math.floor;

    // `ToIntegerOrInfinity` abstract operation
    // https://tc39.es/ecma262/#sec-tointegerorinfinity
    let toIntegerOrInfinity = function (argument) {
        let number = +argument;
        // eslint-disable-next-line no-self-compare -- safe
        return number !== number || number === 0 ? 0 : (number > 0 ? floor$2 : ceil)(number);
    };

    let max$3 = Math.max;
    let min$4 = Math.min;

    // Helper for a popular repeating case of the spec:
    // Let integer be ? ToInteger(index).
    // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
    let toAbsoluteIndex = function (index, length) {
        let integer = toIntegerOrInfinity(index);
        return integer < 0 ? max$3(integer + length, 0) : min$4(integer, length);
    };

    let min$3 = Math.min;

    // `ToLength` abstract operation
    // https://tc39.es/ecma262/#sec-tolength
    let toLength = function (argument) {
        // 2 ** 53 - 1 == 9007199254740991
        return argument > 0 ? min$3(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0;
    };

    // `LengthOfArrayLike` abstract operation
    // https://tc39.es/ecma262/#sec-lengthofarraylike
    let lengthOfArrayLike = function (obj) {
        return toLength(obj.length);
    };

    // `Array.prototype.{ indexOf, includes }` methods implementation
    let createMethod$2 = function (IS_INCLUDES) {
        return function ($this, el, fromIndex) {
            let O = toIndexedObject($this);
            let length = lengthOfArrayLike(O);
            let index = toAbsoluteIndex(fromIndex, length);
            let value;
            // Array#includes uses SameValueZero equality algorithm
            // eslint-disable-next-line no-self-compare -- NaN check
            if (IS_INCLUDES && el != el) while (length > index) {
                value = O[index++];
                // eslint-disable-next-line no-self-compare -- NaN check
                if (value != value) return true;
                // Array#indexOf ignores holes, Array#includes - not
            } else for (; length > index; index++) {
                if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
            } return !IS_INCLUDES && -1;
        };
    };

    let arrayIncludes = {
        // `Array.prototype.includes` method
        // https://tc39.es/ecma262/#sec-array.prototype.includes
        includes: createMethod$2(true),
        // `Array.prototype.indexOf` method
        // https://tc39.es/ecma262/#sec-array.prototype.indexof
        indexOf: createMethod$2(false)
    };

    let indexOf$1 = arrayIncludes.indexOf;

    let push$4 = functionUncurryThis([].push);

    let objectKeysInternal = function (object, names) {
        let O = toIndexedObject(object);
        let i = 0;
        let result = [];
        let key;
        for (key in O) !hasOwnProperty_1(hiddenKeys$1, key) && hasOwnProperty_1(O, key) && push$4(result, key);
        // Don't enum bug & hidden keys
        while (names.length > i) if (hasOwnProperty_1(O, key = names[i++])) {
            ~indexOf$1(result, key) || push$4(result, key);
        }
        return result;
    };

    // IE8- don't enum bug keys
    let enumBugKeys = [
        'constructor',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'toLocaleString',
        'toString',
        'valueOf'
    ];

    let hiddenKeys = enumBugKeys.concat('length', 'prototype');

    // `Object.getOwnPropertyNames` method
    // https://tc39.es/ecma262/#sec-object.getownpropertynames
    // eslint-disable-next-line es/no-object-getownpropertynames -- safe
    let f$1 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
        return objectKeysInternal(O, hiddenKeys);
    };

    let objectGetOwnPropertyNames = {
        f: f$1
    };

    // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
    let f = Object.getOwnPropertySymbols;

    let objectGetOwnPropertySymbols = {
        f: f
    };

    let concat$2 = functionUncurryThis([].concat);

    // all object keys, includes non-enumerable and symbols
    let ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
        let keys = objectGetOwnPropertyNames.f(anObject(it));
        let getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
        return getOwnPropertySymbols ? concat$2(keys, getOwnPropertySymbols(it)) : keys;
    };

    let copyConstructorProperties = function (target, source) {
        let keys = ownKeys(source);
        let defineProperty = objectDefineProperty.f;
        let getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (!hasOwnProperty_1(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
        }
    };

    let replacement = /#|\.prototype\./;

    let isForced = function (feature, detection) {
        let value = data[normalize(feature)];
        return value == POLYFILL ? true
            : value == NATIVE ? false
                : isCallable(detection) ? fails(detection)
                    : !!detection;
    };

    var normalize = isForced.normalize = function (string) {
        return String(string).replace(replacement, '.').toLowerCase();
    };

    var data = isForced.data = {};
    var NATIVE = isForced.NATIVE = 'N';
    var POLYFILL = isForced.POLYFILL = 'P';

    let isForced_1 = isForced;

    let getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;

    /*
      options.target      - name of the target object
      options.global      - target is the global object
      options.stat        - export as static methods of target
      options.proto       - export as prototype methods of target
      options.real        - real prototype method for the `pure` version
      options.forced      - export even if the native feature is available
      options.bind        - bind methods to the target, required for the `pure` version
      options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
      options.unsafe      - use the simple assignment of property instead of delete + defineProperty
      options.sham        - add a flag to not completely full polyfills
      options.enumerable  - export as enumerable property
      options.noTargetGet - prevent calling a getter on target
      options.name        - the .name of the function if it does not match the key
    */
    let _export = function (options, source) {
        let TARGET = options.target;
        let GLOBAL = options.global;
        let STATIC = options.stat;
        let FORCED, target, key, targetProperty, sourceProperty, descriptor;
        if (GLOBAL) {
            target = global_1;
        } else if (STATIC) {
            target = global_1[TARGET] || setGlobal(TARGET, {});
        } else {
            target = (global_1[TARGET] || {}).prototype;
        }
        if (target) for (key in source) {
            sourceProperty = source[key];
            if (options.noTargetGet) {
                descriptor = getOwnPropertyDescriptor(target, key);
                targetProperty = descriptor && descriptor.value;
            } else targetProperty = target[key];
            FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
            // contained in target
            if (!FORCED && targetProperty !== undefined) {
                if (typeof sourceProperty == typeof targetProperty) continue;
                copyConstructorProperties(sourceProperty, targetProperty);
            }
            // add a flag to not completely full polyfills
            if (options.sham || (targetProperty && targetProperty.sham)) {
                createNonEnumerableProperty(sourceProperty, 'sham', true);
            }
            // extend global
            redefine(target, key, sourceProperty, options);
        }
    };

    let TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
    let test$1 = {};

    test$1[TO_STRING_TAG$1] = 'z';

    let toStringTagSupport = String(test$1) === '[object z]';

    let TO_STRING_TAG = wellKnownSymbol('toStringTag');
    let Object$1 = global_1.Object;

    // ES3 wrong here
    let CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

    // fallback for IE11 Script Access Denied error
    let tryGet = function (it, key) {
        try {
            return it[key];
        } catch (error) { /* empty */ }
    };

    // getting tag from ES6+ `Object.prototype.toString`
    let classof = toStringTagSupport ? classofRaw : function (it) {
        let O, tag, result;
        return it === undefined ? 'Undefined' : it === null ? 'Null'
            // @@toStringTag case
            : typeof (tag = tryGet(O = Object$1(it), TO_STRING_TAG)) == 'string' ? tag
                // builtinTag case
                : CORRECT_ARGUMENTS ? classofRaw(O)
                    // ES3 arguments fallback
                    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
    };

    let String$1 = global_1.String;

    let toString_1 = function (argument) {
        if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
        return String$1(argument);
    };

    // `RegExp.prototype.flags` getter implementation
    // https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
    let regexpFlags = function () {
        let that = anObject(this);
        let result = '';
        if (that.global) result += 'g';
        if (that.ignoreCase) result += 'i';
        if (that.multiline) result += 'm';
        if (that.dotAll) result += 's';
        if (that.unicode) result += 'u';
        if (that.sticky) result += 'y';
        return result;
    };

    // babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
    let $RegExp$2 = global_1.RegExp;

    let UNSUPPORTED_Y$2 = fails(function () {
        let re = $RegExp$2('a', 'y');
        re.lastIndex = 2;
        return re.exec('abcd') != null;
    });

    let BROKEN_CARET = fails(function () {
        // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
        let re = $RegExp$2('^r', 'gy');
        re.lastIndex = 2;
        return re.exec('str') != null;
    });

    let regexpStickyHelpers = {
        UNSUPPORTED_Y: UNSUPPORTED_Y$2,
        BROKEN_CARET: BROKEN_CARET
    };

    // `Object.keys` method
    // https://tc39.es/ecma262/#sec-object.keys
    // eslint-disable-next-line es/no-object-keys -- safe
    let objectKeys = Object.keys || function keys(O) {
        return objectKeysInternal(O, enumBugKeys);
    };

    // `Object.defineProperties` method
    // https://tc39.es/ecma262/#sec-object.defineproperties
    // eslint-disable-next-line es/no-object-defineproperties -- safe
    let objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
        anObject(O);
        let props = toIndexedObject(Properties);
        let keys = objectKeys(Properties);
        let length = keys.length;
        let index = 0;
        let key;
        while (length > index) objectDefineProperty.f(O, key = keys[index++], props[key]);
        return O;
    };

    let html = getBuiltIn('document', 'documentElement');

    /* global ActiveXObject -- old IE, WSH */

    let GT = '>';
    let LT = '<';
    let PROTOTYPE = 'prototype';
    let SCRIPT = 'script';
    let IE_PROTO = sharedKey('IE_PROTO');

    let EmptyConstructor = function () { /* empty */ };

    let scriptTag = function (content) {
        return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
    };

    // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
    let NullProtoObjectViaActiveX = function (activeXDocument) {
        activeXDocument.write(scriptTag(''));
        activeXDocument.close();
        let temp = activeXDocument.parentWindow.Object;
        activeXDocument = null; // avoid memory leak
        return temp;
    };

    // Create object with fake `null` prototype: use iframe Object with cleared prototype
    let NullProtoObjectViaIFrame = function () {
        // Thrash, waste and sodomy: IE GC bug
        let iframe = documentCreateElement('iframe');
        let JS = 'java' + SCRIPT + ':';
        let iframeDocument;
        iframe.style.display = 'none';
        html.appendChild(iframe);
        // https://github.com/zloirock/core-js/issues/475
        iframe.src = String(JS);
        iframeDocument = iframe.contentWindow.document;
        iframeDocument.open();
        iframeDocument.write(scriptTag('document.F=Object'));
        iframeDocument.close();
        return iframeDocument.F;
    };

    // Check for document.domain and active x support
    // No need to use active x approach when document.domain is not set
    // see https://github.com/es-shims/es5-shim/issues/150
    // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
    // avoid IE GC bug
    let activeXDocument;
    var NullProtoObject = function () {
        try {
            activeXDocument = new ActiveXObject('htmlfile');
        } catch (error) { /* ignore */ }
        NullProtoObject = typeof document != 'undefined'
            ? document.domain && activeXDocument
                ? NullProtoObjectViaActiveX(activeXDocument) // old IE
                : NullProtoObjectViaIFrame()
            : NullProtoObjectViaActiveX(activeXDocument); // WSH
        let length = enumBugKeys.length;
        while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
        return NullProtoObject();
    };

    hiddenKeys$1[IE_PROTO] = true;

    // `Object.create` method
    // https://tc39.es/ecma262/#sec-object.create
    let objectCreate = Object.create || function create(O, Properties) {
        let result;
        if (O !== null) {
            EmptyConstructor[PROTOTYPE] = anObject(O);
            result = new EmptyConstructor();
            EmptyConstructor[PROTOTYPE] = null;
            // add "__proto__" for Object.getPrototypeOf polyfill
            result[IE_PROTO] = O;
        } else result = NullProtoObject();
        return Properties === undefined ? result : objectDefineProperties(result, Properties);
    };

    // babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
    let $RegExp$1 = global_1.RegExp;

    let regexpUnsupportedDotAll = fails(function () {
        let re = $RegExp$1('.', 's');
        return !(re.dotAll && re.exec('\n') && re.flags === 's');
    });

    // babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
    let $RegExp = global_1.RegExp;

    let regexpUnsupportedNcg = fails(function () {
        let re = $RegExp('(?<a>b)', 'g');
        return re.exec('b').groups.a !== 'b' ||
            'b'.replace(re, '$<a>c') !== 'bc';
    });

    /* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
    /* eslint-disable regexp/no-useless-quantifier -- testing */

    let getInternalState = internalState.get;

    let nativeReplace = shared('native-string-replace', String.prototype.replace);
    let nativeExec = RegExp.prototype.exec;
    let patchedExec = nativeExec;
    let charAt$3 = functionUncurryThis(''.charAt);
    let indexOf = functionUncurryThis(''.indexOf);
    let replace$1 = functionUncurryThis(''.replace);
    let stringSlice$4 = functionUncurryThis(''.slice);

    let UPDATES_LAST_INDEX_WRONG = (function () {
        let re1 = /a/;
        let re2 = /b*/g;
        functionCall(nativeExec, re1, 'a');
        functionCall(nativeExec, re2, 'a');
        return re1.lastIndex !== 0 || re2.lastIndex !== 0;
    })();

    let UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

    // nonparticipating capturing group, copied from es5-shim's String#split patch.
    let NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

    let PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1 || regexpUnsupportedDotAll || regexpUnsupportedNcg;

    if (PATCH) {
        // eslint-disable-next-line max-statements -- TODO
        patchedExec = function exec(string) {
            let re = this;
            let state = getInternalState(re);
            let str = toString_1(string);
            let raw = state.raw;
            let result, reCopy, lastIndex, match, i, object, group;

            if (raw) {
                raw.lastIndex = re.lastIndex;
                result = functionCall(patchedExec, raw, str);
                re.lastIndex = raw.lastIndex;
                return result;
            }

            let groups = state.groups;
            let sticky = UNSUPPORTED_Y$1 && re.sticky;
            let flags = functionCall(regexpFlags, re);
            let source = re.source;
            let charsAdded = 0;
            let strCopy = str;

            if (sticky) {
                flags = replace$1(flags, 'y', '');
                if (indexOf(flags, 'g') === -1) {
                    flags += 'g';
                }

                strCopy = stringSlice$4(str, re.lastIndex);
                // Support anchored sticky behavior.
                if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt$3(str, re.lastIndex - 1) !== '\n')) {
                    source = '(?: ' + source + ')';
                    strCopy = ' ' + strCopy;
                    charsAdded++;
                }
                // ^(? + rx + ) is needed, in combination with some str slicing, to
                // simulate the 'y' flag.
                reCopy = new RegExp('^(?:' + source + ')', flags);
            }

            if (NPCG_INCLUDED) {
                reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
            }
            if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

            match = functionCall(nativeExec, sticky ? reCopy : re, strCopy);

            if (sticky) {
                if (match) {
                    match.input = stringSlice$4(match.input, charsAdded);
                    match[0] = stringSlice$4(match[0], charsAdded);
                    match.index = re.lastIndex;
                    re.lastIndex += match[0].length;
                } else re.lastIndex = 0;
            } else if (UPDATES_LAST_INDEX_WRONG && match) {
                re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
            }
            if (NPCG_INCLUDED && match && match.length > 1) {
                // Fix browsers whose `exec` methods don't consistently return `undefined`
                // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
                functionCall(nativeReplace, match[0], reCopy, function () {
                    for (i = 1; i < arguments.length - 2; i++) {
                        if (arguments[i] === undefined) match[i] = undefined;
                    }
                });
            }

            if (match && groups) {
                match.groups = object = objectCreate(null);
                for (i = 0; i < groups.length; i++) {
                    group = groups[i];
                    object[group[0]] = match[group[1]];
                }
            }

            return match;
        };
    }

    let regexpExec = patchedExec;

    // `RegExp.prototype.exec` method
    // https://tc39.es/ecma262/#sec-regexp.prototype.exec
    _export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
        exec: regexpExec
    });

    // TODO: Remove from `core-js@4` since it's moved to entry points

    let SPECIES$4 = wellKnownSymbol('species');
    let RegExpPrototype$1 = RegExp.prototype;

    let fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
        let SYMBOL = wellKnownSymbol(KEY);

        let DELEGATES_TO_SYMBOL = !fails(function () {
            // String methods call symbol-named RegEp methods
            let O = {};
            O[SYMBOL] = function () { return 7; };
            return ''[KEY](O) != 7;
        });

        let DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
            // Symbol-named RegExp methods call .exec
            let execCalled = false;
            let re = /a/;

            if (KEY === 'split') {
                // We can't use real regex here since it causes deoptimization
                // and serious performance degradation in V8
                // https://github.com/zloirock/core-js/issues/306
                re = {};
                // RegExp[@@split] doesn't call the regex's exec method, but first creates
                // a new one. We need to return the patched regex when creating the new one.
                re.constructor = {};
                re.constructor[SPECIES$4] = function () { return re; };
                re.flags = '';
                re[SYMBOL] = /./[SYMBOL];
            }

            re.exec = function () { execCalled = true; return null; };

            re[SYMBOL]('');
            return !execCalled;
        });

        if (
            !DELEGATES_TO_SYMBOL ||
            !DELEGATES_TO_EXEC ||
            FORCED
        ) {
            let uncurriedNativeRegExpMethod = functionUncurryThis(/./[SYMBOL]);
            let methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
                let uncurriedNativeMethod = functionUncurryThis(nativeMethod);
                let $exec = regexp.exec;
                if ($exec === regexpExec || $exec === RegExpPrototype$1.exec) {
                    if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
                        // The native String method already delegates to @@method (this
                        // polyfilled function), leasing to infinite recursion.
                        // We avoid it by directly calling the native @@method method.
                        return { done: true, value: uncurriedNativeRegExpMethod(regexp, str, arg2) };
                    }
                    return { done: true, value: uncurriedNativeMethod(str, regexp, arg2) };
                }
                return { done: false };
            });

            redefine(String.prototype, KEY, methods[0]);
            redefine(RegExpPrototype$1, SYMBOL, methods[1]);
        }

        if (SHAM) createNonEnumerableProperty(RegExpPrototype$1[SYMBOL], 'sham', true);
    };

    let charAt$2 = functionUncurryThis(''.charAt);
    let charCodeAt = functionUncurryThis(''.charCodeAt);
    let stringSlice$3 = functionUncurryThis(''.slice);

    let createMethod$1 = function (CONVERT_TO_STRING) {
        return function ($this, pos) {
            let S = toString_1(requireObjectCoercible($this));
            let position = toIntegerOrInfinity(pos);
            let size = S.length;
            let first, second;
            if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
            first = charCodeAt(S, position);
            return first < 0xD800 || first > 0xDBFF || position + 1 === size
                || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
                ? CONVERT_TO_STRING
                    ? charAt$2(S, position)
                    : first
                : CONVERT_TO_STRING
                    ? stringSlice$3(S, position, position + 2)
                    : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
        };
    };

    let stringMultibyte = {
        // `String.prototype.codePointAt` method
        // https://tc39.es/ecma262/#sec-string.prototype.codepointat
        codeAt: createMethod$1(false),
        // `String.prototype.at` method
        // https://github.com/mathiasbynens/String.prototype.at
        charAt: createMethod$1(true)
    };

    let charAt$1 = stringMultibyte.charAt;

    // `AdvanceStringIndex` abstract operation
    // https://tc39.es/ecma262/#sec-advancestringindex
    let advanceStringIndex = function (S, index, unicode) {
        return index + (unicode ? charAt$1(S, index).length : 1);
    };

    let TypeError$5 = global_1.TypeError;

    // `RegExpExec` abstract operation
    // https://tc39.es/ecma262/#sec-regexpexec
    let regexpExecAbstract = function (R, S) {
        let exec = R.exec;
        if (isCallable(exec)) {
            let result = functionCall(exec, R, S);
            if (result !== null) anObject(result);
            return result;
        }
        if (classofRaw(R) === 'RegExp') return functionCall(regexpExec, R, S);
        throw TypeError$5('RegExp#exec called on incompatible receiver');
    };

    // @@match logic
    fixRegexpWellKnownSymbolLogic('match', function (MATCH, nativeMatch, maybeCallNative) {
        return [
            // `String.prototype.match` method
            // https://tc39.es/ecma262/#sec-string.prototype.match
            function match(regexp) {
                let O = requireObjectCoercible(this);
                let matcher = regexp == undefined ? undefined : getMethod(regexp, MATCH);
                return matcher ? functionCall(matcher, regexp, O) : new RegExp(regexp)[MATCH](toString_1(O));
            },
            // `RegExp.prototype[@@match]` method
            // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
            function (string) {
                let rx = anObject(this);
                let S = toString_1(string);
                let res = maybeCallNative(nativeMatch, rx, S);

                if (res.done) return res.value;

                if (!rx.global) return regexpExecAbstract(rx, S);

                let fullUnicode = rx.unicode;
                rx.lastIndex = 0;
                let A = [];
                let n = 0;
                let result;
                while ((result = regexpExecAbstract(rx, S)) !== null) {
                    let matchStr = toString_1(result[0]);
                    A[n] = matchStr;
                    if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
                    n++;
                }
                return n === 0 ? null : A;
            }
        ];
    });

    // `IsArray` abstract operation
    // https://tc39.es/ecma262/#sec-isarray
    // eslint-disable-next-line es/no-array-isarray -- safe
    let isArray = Array.isArray || function isArray(argument) {
        return classofRaw(argument) == 'Array';
    };

    let createProperty = function (object, key, value) {
        let propertyKey = toPropertyKey(key);
        if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
        else object[propertyKey] = value;
    };

    let noop = function () { /* empty */ };
    let empty = [];
    let construct = getBuiltIn('Reflect', 'construct');
    let constructorRegExp = /^\s*(?:class|function)\b/;
    let exec$1 = functionUncurryThis(constructorRegExp.exec);
    let INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

    let isConstructorModern = function (argument) {
        if (!isCallable(argument)) return false;
        try {
            construct(noop, empty, argument);
            return true;
        } catch (error) {
            return false;
        }
    };

    let isConstructorLegacy = function (argument) {
        if (!isCallable(argument)) return false;
        switch (classof(argument)) {
            case 'AsyncFunction':
            case 'GeneratorFunction':
            case 'AsyncGeneratorFunction': return false;
            // we can't check .prototype since constructors produced by .bind haven't it
        } return INCORRECT_TO_STRING || !!exec$1(constructorRegExp, inspectSource(argument));
    };

    // `IsConstructor` abstract operation
    // https://tc39.es/ecma262/#sec-isconstructor
    let isConstructor = !construct || fails(function () {
        let called;
        return isConstructorModern(isConstructorModern.call)
            || !isConstructorModern(Object)
            || !isConstructorModern(function () { called = true; })
            || called;
    }) ? isConstructorLegacy : isConstructorModern;

    let SPECIES$3 = wellKnownSymbol('species');
    let Array$2 = global_1.Array;

    // a part of `ArraySpeciesCreate` abstract operation
    // https://tc39.es/ecma262/#sec-arrayspeciescreate
    let arraySpeciesConstructor = function (originalArray) {
        let C;
        if (isArray(originalArray)) {
            C = originalArray.constructor;
            // cross-realm fallback
            if (isConstructor(C) && (C === Array$2 || isArray(C.prototype))) C = undefined;
            else if (isObject(C)) {
                C = C[SPECIES$3];
                if (C === null) C = undefined;
            }
        } return C === undefined ? Array$2 : C;
    };

    // `ArraySpeciesCreate` abstract operation
    // https://tc39.es/ecma262/#sec-arrayspeciescreate
    let arraySpeciesCreate = function (originalArray, length) {
        return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
    };

    let SPECIES$2 = wellKnownSymbol('species');

    let arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
        // We can't use this feature detection in V8 since it causes
        // deoptimization and serious performance degradation
        // https://github.com/zloirock/core-js/issues/677
        return engineV8Version >= 51 || !fails(function () {
            let array = [];
            let constructor = array.constructor = {};
            constructor[SPECIES$2] = function () {
                return { foo: 1 };
            };
            return array[METHOD_NAME](Boolean).foo !== 1;
        });
    };

    let IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
    let MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
    let MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';
    let TypeError$4 = global_1.TypeError;

    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/679
    let IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
        let array = [];
        array[IS_CONCAT_SPREADABLE] = false;
        return array.concat()[0] !== array;
    });

    let SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

    let isConcatSpreadable = function (O) {
        if (!isObject(O)) return false;
        let spreadable = O[IS_CONCAT_SPREADABLE];
        return spreadable !== undefined ? !!spreadable : isArray(O);
    };

    let FORCED$1 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

    // `Array.prototype.concat` method
    // https://tc39.es/ecma262/#sec-array.prototype.concat
    // with adding support of @@isConcatSpreadable and @@species
    _export({ target: 'Array', proto: true, forced: FORCED$1 }, {
        // eslint-disable-next-line no-unused-vars -- required for `.length`
        concat: function concat(arg) {
            let O = toObject(this);
            let A = arraySpeciesCreate(O, 0);
            let n = 0;
            let i, k, length, len, E;
            for (i = -1, length = arguments.length; i < length; i++) {
                E = i === -1 ? O : arguments[i];
                if (isConcatSpreadable(E)) {
                    len = lengthOfArrayLike(E);
                    if (n + len > MAX_SAFE_INTEGER$1) throw TypeError$4(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
                    for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
                } else {
                    if (n >= MAX_SAFE_INTEGER$1) throw TypeError$4(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
                    createProperty(A, n++, E);
                }
            }
            A.length = n;
            return A;
        }
    });

    // `Object.prototype.toString` method implementation
    // https://tc39.es/ecma262/#sec-object.prototype.tostring
    let objectToString = toStringTagSupport ? {}.toString : function toString() {
        return '[object ' + classof(this) + ']';
    };

    // `Object.prototype.toString` method
    // https://tc39.es/ecma262/#sec-object.prototype.tostring
    if (!toStringTagSupport) {
        redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
    }

    let PROPER_FUNCTION_NAME = functionName.PROPER;

    let TO_STRING = 'toString';
    let RegExpPrototype = RegExp.prototype;
    let n$ToString = RegExpPrototype[TO_STRING];
    let getFlags = functionUncurryThis(regexpFlags);

    let NOT_GENERIC = fails(function () { return n$ToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
    // FF44- RegExp#toString has a wrong name
    let INCORRECT_NAME = PROPER_FUNCTION_NAME && n$ToString.name != TO_STRING;

    // `RegExp.prototype.toString` method
    // https://tc39.es/ecma262/#sec-regexp.prototype.tostring
    if (NOT_GENERIC || INCORRECT_NAME) {
        redefine(RegExp.prototype, TO_STRING, function toString() {
            let R = anObject(this);
            let p = toString_1(R.source);
            let rf = R.flags;
            let f = toString_1(rf === undefined && objectIsPrototypeOf(RegExpPrototype, R) && !('flags' in RegExpPrototype) ? getFlags(R) : rf);
            return '/' + p + '/' + f;
        }, { unsafe: true });
    }

    let FunctionPrototype = Function.prototype;
    let apply = FunctionPrototype.apply;
    let bind$1 = FunctionPrototype.bind;
    let call = FunctionPrototype.call;

    // eslint-disable-next-line es/no-reflect -- safe
    let functionApply = typeof Reflect == 'object' && Reflect.apply || (bind$1 ? call.bind(apply) : function () {
        return call.apply(apply, arguments);
    });

    let MATCH$1 = wellKnownSymbol('match');

    // `IsRegExp` abstract operation
    // https://tc39.es/ecma262/#sec-isregexp
    let isRegexp = function (it) {
        let isRegExp;
        return isObject(it) && ((isRegExp = it[MATCH$1]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
    };

    let TypeError$3 = global_1.TypeError;

    // `Assert: IsConstructor(argument) is true`
    let aConstructor = function (argument) {
        if (isConstructor(argument)) return argument;
        throw TypeError$3(tryToString(argument) + ' is not a constructor');
    };

    let SPECIES$1 = wellKnownSymbol('species');

    // `SpeciesConstructor` abstract operation
    // https://tc39.es/ecma262/#sec-speciesconstructor
    let speciesConstructor = function (O, defaultConstructor) {
        let C = anObject(O).constructor;
        let S;
        return C === undefined || (S = anObject(C)[SPECIES$1]) == undefined ? defaultConstructor : aConstructor(S);
    };

    let arraySlice = functionUncurryThis([].slice);

    let UNSUPPORTED_Y = regexpStickyHelpers.UNSUPPORTED_Y;
    let MAX_UINT32 = 0xFFFFFFFF;
    let min$2 = Math.min;
    let $push = [].push;
    let exec = functionUncurryThis(/./.exec);
    let push$3 = functionUncurryThis($push);
    let stringSlice$2 = functionUncurryThis(''.slice);

    // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
    // Weex JS has frozen built-in prototypes, so use try / catch wrapper
    let SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
        // eslint-disable-next-line regexp/no-empty-group -- required for testing
        let re = /(?:)/;
        let originalExec = re.exec;
        re.exec = function () { return originalExec.apply(this, arguments); };
        let result = 'ab'.split(re);
        return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
    });

    // @@split logic
    fixRegexpWellKnownSymbolLogic('split', function (SPLIT, nativeSplit, maybeCallNative) {
        let internalSplit;
        if (
            'abbc'.split(/(b)*/)[1] == 'c' ||
            // eslint-disable-next-line regexp/no-empty-group -- required for testing
            'test'.split(/(?:)/, -1).length != 4 ||
            'ab'.split(/(?:ab)*/).length != 2 ||
            '.'.split(/(.?)(.?)/).length != 4 ||
            // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
            '.'.split(/()()/).length > 1 ||
            ''.split(/.?/).length
        ) {
            // based on es5-shim implementation, need to rework it
            internalSplit = function (separator, limit) {
                let string = toString_1(requireObjectCoercible(this));
                let lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
                if (lim === 0) return [];
                if (separator === undefined) return [string];
                // If `separator` is not a regex, use native split
                if (!isRegexp(separator)) {
                    return functionCall(nativeSplit, string, separator, lim);
                }
                let output = [];
                let flags = (separator.ignoreCase ? 'i' : '') +
                    (separator.multiline ? 'm' : '') +
                    (separator.unicode ? 'u' : '') +
                    (separator.sticky ? 'y' : '');
                let lastLastIndex = 0;
                // Make `global` and avoid `lastIndex` issues by working with a copy
                let separatorCopy = new RegExp(separator.source, flags + 'g');
                let match, lastIndex, lastLength;
                while (match = functionCall(regexpExec, separatorCopy, string)) {
                    lastIndex = separatorCopy.lastIndex;
                    if (lastIndex > lastLastIndex) {
                        push$3(output, stringSlice$2(string, lastLastIndex, match.index));
                        if (match.length > 1 && match.index < string.length) functionApply($push, output, arraySlice(match, 1));
                        lastLength = match[0].length;
                        lastLastIndex = lastIndex;
                        if (output.length >= lim) break;
                    }
                    if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
                }
                if (lastLastIndex === string.length) {
                    if (lastLength || !exec(separatorCopy, '')) push$3(output, '');
                } else push$3(output, stringSlice$2(string, lastLastIndex));
                return output.length > lim ? arraySlice(output, 0, lim) : output;
            };
            // Chakra, V8
        } else if ('0'.split(undefined, 0).length) {
            internalSplit = function (separator, limit) {
                return separator === undefined && limit === 0 ? [] : functionCall(nativeSplit, this, separator, limit);
            };
        } else internalSplit = nativeSplit;

        return [
            // `String.prototype.split` method
            // https://tc39.es/ecma262/#sec-string.prototype.split
            function split(separator, limit) {
                let O = requireObjectCoercible(this);
                let splitter = separator == undefined ? undefined : getMethod(separator, SPLIT);
                return splitter
                    ? functionCall(splitter, separator, O, limit)
                    : functionCall(internalSplit, toString_1(O), separator, limit);
            },
            // `RegExp.prototype[@@split]` method
            // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
            //
            // NOTE: This cannot be properly polyfilled in engines that don't support
            // the 'y' flag.
            function (string, limit) {
                let rx = anObject(this);
                let S = toString_1(string);
                let res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);

                if (res.done) return res.value;

                let C = speciesConstructor(rx, RegExp);

                let unicodeMatching = rx.unicode;
                let flags = (rx.ignoreCase ? 'i' : '') +
                    (rx.multiline ? 'm' : '') +
                    (rx.unicode ? 'u' : '') +
                    (UNSUPPORTED_Y ? 'g' : 'y');

                // ^(? + rx + ) is needed, in combination with some S slicing, to
                // simulate the 'y' flag.
                let splitter = new C(UNSUPPORTED_Y ? '^(?:' + rx.source + ')' : rx, flags);
                let lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
                if (lim === 0) return [];
                if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
                let p = 0;
                let q = 0;
                let A = [];
                while (q < S.length) {
                    splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
                    let z = regexpExecAbstract(splitter, UNSUPPORTED_Y ? stringSlice$2(S, q) : S);
                    var e;
                    if (
                        z === null ||
                        (e = min$2(toLength(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p
                    ) {
                        q = advanceStringIndex(S, q, unicodeMatching);
                    } else {
                        push$3(A, stringSlice$2(S, p, q));
                        if (A.length === lim) return A;
                        for (let i = 1; i <= z.length - 1; i++) {
                            push$3(A, z[i]);
                            if (A.length === lim) return A;
                        }
                        q = p = e;
                    }
                }
                push$3(A, stringSlice$2(S, p));
                return A;
            }
        ];
    }, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);

    /**
     * Append a class to an element
     *
     * @api private
     * @method _addClass
     * @param {Object} element
     * @param {String} className
     * @returns null
     */

    function addClass(element, className) {
        if (element instanceof SVGElement) {
            // svg
            let pre = element.getAttribute("class") || "";

            if (!pre.match(className)) {
                // check if element doesn't already have className
                element.setAttribute("class", "".concat(pre, " ").concat(className));
            }
        } else {
            if (element.classList !== undefined) {
                // check for modern classList property
                let classes = className.split(" ");
                forEach(classes, function (cls) {
                    element.classList.add(cls);
                });
            } else if (!element.className.match(className)) {
                // check if element doesn't already have className
                element.className += " ".concat(className);
            }
        }
    }

    /**
     * Get an element CSS property on the page
     * Thanks to JavaScript Kit: http://www.javascriptkit.com/dhtmltutors/dhtmlcascade4.shtml
     *
     * @api private
     * @method _getPropValue
     * @param {Object} element
     * @param {String} propName
     * @returns string property value
     */
    function getPropValue(element, propName) {
        let propValue = "";

        if (element.currentStyle) {
            //IE
            propValue = element.currentStyle[propName];
        } else if (document.defaultView && document.defaultView.getComputedStyle) {
            //Others
            propValue = document.defaultView.getComputedStyle(element, null).getPropertyValue(propName);
        } //Prevent exception in IE

        if (propValue && propValue.toLowerCase) {
            return propValue.toLowerCase();
        }
        return propValue;

    }

    /**
     * To set the show element
     * This function set a relative (in most cases) position and changes the z-index
     *
     * @api private
     * @method _setShowElement
     * @param {Object} targetElement
     */

    function setShowElement(_ref) {
        let element = _ref.element;
        // addClass(element, "introjs-showElement");
        let currentElementPosition = getPropValue(element, "position");

        if (currentElementPosition !== "absolute" && currentElementPosition !== "relative" && currentElementPosition !== "sticky" && currentElementPosition !== "fixed") {
            //change to new intro item
            addClass(element, "introjs-relativePosition");
        }
    }

    /**
     * Find the nearest scrollable parent
     * copied from https://stackoverflow.com/questions/35939886/find-first-scrollable-parent
     *
     * @param Element element
     * @return Element
     */
    function getScrollParent(element) {
        let style = window.getComputedStyle(element);
        let excludeStaticParent = style.position === "absolute";
        let overflowRegex = /(auto|scroll)/;
        if (style.position === "fixed") return document.body;

        for (let parent = element; parent = parent.parentElement;) {
            style = window.getComputedStyle(parent);

            if (excludeStaticParent && style.position === "static") {
                continue;
            }

            if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent;
        }

        return document.body;
    }

    /**
     * scroll a scrollable element to a child element
     *
     * @param {Object} targetElement
     */

    function scrollParentToElement(targetElement) {
        let element = targetElement.element;
        if (!this._options.scrollToElement) return;
        let parent = getScrollParent(element);
        if (parent === document.body) return;
        parent.scrollTop = element.offsetTop - parent.offsetTop;
    }

    /**
     * Provides a cross-browser way to get the screen dimensions
     * via: http://stackoverflow.com/questions/5864467/internet-explorer-innerheight
     *
     * @api private
     * @method _getWinSize
     * @returns {Object} width and height attributes
     */
    function getWinSize() {
        if (window.innerWidth !== undefined) {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            };
        }
        let D = document.documentElement;
        return {
            width: D.clientWidth,
            height: D.clientHeight
        };

    }

    /**
     * Check to see if the element is in the viewport or not
     * http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
     *
     * @api private
     * @method _elementInViewport
     * @param {Object} el
     */
    function elementInViewport(el) {
        let rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.left >= 0 && rect.bottom + 80 <= window.innerHeight && // add 80 to get the text right
            rect.right <= window.innerWidth;
    }

    /**
     * To change the scroll of `window` after highlighting an element
     *
     * @api private
     * @param {String} scrollTo
     * @param {Object} targetElement
     * @param {Object} tooltipLayer
     */

    function scrollTo(scrollTo, _ref, tooltipLayer) {
        let element = _ref.element;
        if (scrollTo === "off") return;
        let rect;
        if (!this._options.scrollToElement) return;

        if (scrollTo === "tooltip") {
            rect = tooltipLayer.getBoundingClientRect();
        } else {
            rect = element.getBoundingClientRect();
        }

        if (!elementInViewport(element)) {
            let winHeight = getWinSize().height;
            let top = rect.bottom - (rect.bottom - rect.top); // TODO (afshinm): do we need scroll padding now?
            // I have changed the scroll option and now it scrolls the window to
            // the center of the target element or tooltip.

            if (top < 0 || element.clientHeight > winHeight) {
                window.scrollBy(0, rect.top - (winHeight / 2 - rect.height / 2) - this._options.scrollPadding); // 30px padding from edge to look nice
                //Scroll down
            } else {
                window.scrollBy(0, rect.top - (winHeight / 2 - rect.height / 2) + this._options.scrollPadding); // 30px padding from edge to look nice
            }
        }
    }

    /**
     * Setting anchors to behave like buttons
     *
     * @api private
     * @method _setAnchorAsButton
     */
    function setAnchorAsButton(anchor) {
        anchor.setAttribute("role", "button");
        anchor.tabIndex = 0;
    }

    // eslint-disable-next-line es/no-object-assign -- safe
    let $assign = Object.assign;
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    let defineProperty = Object.defineProperty;
    let concat$1 = functionUncurryThis([].concat);

    // `Object.assign` method
    // https://tc39.es/ecma262/#sec-object.assign
    let objectAssign = !$assign || fails(function () {
        // should have correct order of operations (Edge bug)
        if (descriptors && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
            enumerable: true,
            get: function () {
                defineProperty(this, 'b', {
                    value: 3,
                    enumerable: false
                });
            }
        }), { b: 2 })).b !== 1) return true;
        // should work with symbols and should have deterministic property order (V8 bug)
        let A = {};
        let B = {};
        // eslint-disable-next-line es/no-symbol -- safe
        let symbol = Symbol();
        let alphabet = 'abcdefghijklmnopqrst';
        A[symbol] = 7;
        alphabet.split('').forEach(function (chr) { B[chr] = chr; });
        return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
    }) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
            let T = toObject(target);
            let argumentsLength = arguments.length;
            let index = 1;
            let getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
            let propertyIsEnumerable = objectPropertyIsEnumerable.f;
            while (argumentsLength > index) {
                let S = indexedObject(arguments[index++]);
                let keys = getOwnPropertySymbols ? concat$1(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
                let length = keys.length;
                let j = 0;
                var key;
                while (length > j) {
                    key = keys[j++];
                    if (!descriptors || functionCall(propertyIsEnumerable, S, key)) T[key] = S[key];
                }
            } return T;
        } : $assign;

    // `Object.assign` method
    // https://tc39.es/ecma262/#sec-object.assign
    // eslint-disable-next-line es/no-object-assign -- required for testing
    _export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
        assign: objectAssign
    });

    /**
     * Checks to see if target element (or parents) position is fixed or not
     *
     * @api private
     * @method _isFixed
     * @param {Object} element
     * @returns Boolean
     */

    function isFixed(element) {
        let p = element.parentNode;

        if (!p || p.nodeName === "HTML") {
            return false;
        }

        if (getPropValue(element, "position") === "fixed") {
            return true;
        }

        return isFixed(p);
    }

    /**
     * Get an element position on the page relative to another element (or body)
     * Thanks to `meouw`: http://stackoverflow.com/a/442474/375966
     *
     * @api private
     * @method getOffset
     * @param {Object} element
     * @param {Object} relativeEl
     * @returns Element's position info
     */
    function getOffset(element, relativeEl) {
        let body = document.body;
        let docEl = document.documentElement;
        let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
        relativeEl = relativeEl || body;
        let x = element.getBoundingClientRect();
        let xr = relativeEl.getBoundingClientRect();
        let relativeElPosition = getPropValue(relativeEl, "position");

        let obj = {
            width: x.width,
            height: x.height
        };

        if (relativeEl.tagName.toLowerCase() !== "body" && relativeElPosition === "relative" || relativeElPosition === "sticky") {
            // when the container of our target element is _not_ body and has either "relative" or "sticky" position, we should not
            // consider the scroll position but we need to include the relative x/y of the container element
            return Object.assign(obj, {

                top: x.top - xr.top,
                left: x.left - xr.left
            });
        }
        if (isFixed(element)) {

            return Object.assign(obj, {
                top: x.top,
                left: x.left
            });
        }
        return Object.assign(obj, {

            top: x.top + scrollTop,
            left: x.left + scrollLeft
        });

    }

    let floor$1 = Math.floor;
    let charAt = functionUncurryThis(''.charAt);
    let replace = functionUncurryThis(''.replace);
    let stringSlice$1 = functionUncurryThis(''.slice);
    let SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
    let SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

    // `GetSubstitution` abstract operation
    // https://tc39.es/ecma262/#sec-getsubstitution
    let getSubstitution = function (matched, str, position, captures, namedCaptures, replacement) {
        let tailPos = position + matched.length;
        let m = captures.length;
        let symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
        if (namedCaptures !== undefined) {
            namedCaptures = toObject(namedCaptures);
            symbols = SUBSTITUTION_SYMBOLS;
        }
        return replace(replacement, symbols, function (match, ch) {
            let capture;
            switch (charAt(ch, 0)) {
                case '$': return '$';
                case '&': return matched;
                case '`': return stringSlice$1(str, 0, position);
                case "'": return stringSlice$1(str, tailPos);
                case '<':
                    capture = namedCaptures[stringSlice$1(ch, 1, -1)];
                    break;
                default: // \d\d?
                    var n = +ch;
                    if (n === 0) return match;
                    if (n > m) {
                        let f = floor$1(n / 10);
                        if (f === 0) return match;
                        if (f <= m) return captures[f - 1] === undefined ? charAt(ch, 1) : captures[f - 1] + charAt(ch, 1);
                        return match;
                    }
                    capture = captures[n - 1];
            }
            return capture === undefined ? '' : capture;
        });
    };

    let REPLACE = wellKnownSymbol('replace');
    let max$2 = Math.max;
    let min$1 = Math.min;
    let concat = functionUncurryThis([].concat);
    let push$2 = functionUncurryThis([].push);
    let stringIndexOf$1 = functionUncurryThis(''.indexOf);
    let stringSlice = functionUncurryThis(''.slice);

    let maybeToString = function (it) {
        return it === undefined ? it : String(it);
    };

    // IE <= 11 replaces $0 with the whole match, as if it was $&
    // https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
    let REPLACE_KEEPS_$0 = (function () {
        // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
        return 'a'.replace(/./, '$0') === '$0';
    })();

    // Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
    let REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
        if (/./[REPLACE]) {
            return /./[REPLACE]('a', '$0') === '';
        }
        return false;
    })();

    let REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
        let re = /./;
        re.exec = function () {
            let result = [];
            result.groups = { a: '7' };
            return result;
        };
        // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
        return ''.replace(re, '$<a>') !== '7';
    });

    // @@replace logic
    fixRegexpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
        let UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

        return [
            // `String.prototype.replace` method
            // https://tc39.es/ecma262/#sec-string.prototype.replace
            function replace(searchValue, replaceValue) {
                let O = requireObjectCoercible(this);
                let replacer = searchValue == undefined ? undefined : getMethod(searchValue, REPLACE);
                return replacer
                    ? functionCall(replacer, searchValue, O, replaceValue)
                    : functionCall(nativeReplace, toString_1(O), searchValue, replaceValue);
            },
            // `RegExp.prototype[@@replace]` method
            // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
            function (string, replaceValue) {
                let rx = anObject(this);
                let S = toString_1(string);

                if (
                    typeof replaceValue == 'string' &&
                    stringIndexOf$1(replaceValue, UNSAFE_SUBSTITUTE) === -1 &&
                    stringIndexOf$1(replaceValue, '$<') === -1
                ) {
                    let res = maybeCallNative(nativeReplace, rx, S, replaceValue);
                    if (res.done) return res.value;
                }

                let functionalReplace = isCallable(replaceValue);
                if (!functionalReplace) replaceValue = toString_1(replaceValue);

                let global = rx.global;
                if (global) {
                    var fullUnicode = rx.unicode;
                    rx.lastIndex = 0;
                }
                let results = [];
                while (true) {
                    var result = regexpExecAbstract(rx, S);
                    if (result === null) break;

                    push$2(results, result);
                    if (!global) break;

                    let matchStr = toString_1(result[0]);
                    if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
                }

                let accumulatedResult = '';
                let nextSourcePosition = 0;
                for (let i = 0; i < results.length; i++) {
                    result = results[i];

                    let matched = toString_1(result[0]);
                    let position = max$2(min$1(toIntegerOrInfinity(result.index), S.length), 0);
                    let captures = [];
                    // NOTE: This is equivalent to
                    //   captures = result.slice(1).map(maybeToString)
                    // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
                    // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
                    // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
                    for (let j = 1; j < result.length; j++) push$2(captures, maybeToString(result[j]));
                    let namedCaptures = result.groups;
                    if (functionalReplace) {
                        let replacerArgs = concat([matched], captures, position, S);
                        if (namedCaptures !== undefined) push$2(replacerArgs, namedCaptures);
                        var replacement = toString_1(functionApply(replaceValue, undefined, replacerArgs));
                    } else {
                        replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
                    }
                    if (position >= nextSourcePosition) {
                        accumulatedResult += stringSlice(S, nextSourcePosition, position) + replacement;
                        nextSourcePosition = position + matched.length;
                    }
                }
                return accumulatedResult + stringSlice(S, nextSourcePosition);
            }
        ];
    }, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

    /**
     * Remove a class from an element
     *
     * @api private
     * @method _removeClass
     * @param {Object} element
     * @param {RegExp|String} classNameRegex can be regex or string
     * @returns null
     */
    function removeClass(element, classNameRegex) {
        if (element instanceof SVGElement) {
            let pre = element.getAttribute("class") || "";
            element.setAttribute("class", pre.replace(classNameRegex, "").replace(/^\s+|\s+$/g, ""));
        } else {
            element.className = element.className.replace(classNameRegex, "").replace(/^\s+|\s+$/g, "");
        }
    }

    /**
     * Sets the style of an DOM element
     *
     * @param {Object} element
     * @param {Object|string} style
     * @return null
     */
    function setStyle(element, style) {
        let cssText = "";

        if (element.style.cssText) {
            cssText += element.style.cssText;
        }

        if (typeof style === "string") {
            cssText += style;
        } else {
            for (let rule in style) {
                cssText += "".concat(rule, ":").concat(style[rule], ";");
            }
        }

        element.style.cssText = cssText;
    }

    /**
     * Update the position of the helper layer on the screen
     *
     * @api private
     * @method _setHelperLayerPosition
     * @param {Object} helperLayer
     */

    function setHelperLayerPosition(helperLayer) {
        if (helperLayer) {
            //prevent error when `this._currentStep` in undefined
            if (!this._introItems[this._currentStep]) return;
            let currentElement = this._introItems[this._currentStep];
            if (currentElement.position === "floating") {

                if (document.querySelector(currentElement.elementClass)) {
                    currentElement.element = document.querySelector(currentElement.elementClass)
                    currentElement.position = ""
                }
            }
            let elementPosition = getOffset(currentElement.element, this._targetElement);
            // If the target element is fixed, the tooltip should be fixed as well.
            let widthHeightPadding = this._options.helperElementPadding;
            // Otherwise, remove a fixed class that may be left over from the previous
            // step.
            let helperlayerElement = document.querySelector(".introjs-helperLayer");
            let baseLayerElement = document.querySelector(".introjs-baseLayer");
            let wtchListElement = document.querySelector(".watchlistDiv")
            let wtchListAddElement = document.querySelector(".watchlistDiv .addWatchlist-btn")
            let searchElement = document.querySelector(".dashboard-base .symSearch-base")
            let symbolElement = document.querySelector(".high-first-sym");
            let element = document.getElementById("demotour-watchlist");
            // let chartElement = document.querySelector(".demo-chart");
            let buySellElement = document.querySelector(".demo-showIcons");
            let delivElement = document.querySelector(".productType.delivDemoTour");
            let mtfElement = document.querySelector(".productType.mtfDemoTour");
            let menuElement = document.querySelector(".headerBase-div .menuIcon-div .menuIcon");
            let orderElement = document.querySelector(".headerTab-base");
            let fundsBtnElement = document.querySelector(".row.btn");
            let fundsElement = document.querySelector(".row.funds");

            if (this._introItems[this._currentStep].tooltipClass === "fundsBtn-tooltip") {
                helperlayerElement.style["width"] = `${fundsBtnElement.offsetWidth + 78}px`
                baseLayerElement.style["width"] = `${fundsBtnElement.offsetWidth + 90}px`
                baseLayerElement.style["height"] = `${47}px`
                baseLayerElement.style["left"] = `${-7}px`
            }

            else if (this._introItems[this._currentStep].tooltipClass === "funds-tooltip") {
                helperlayerElement.style["width"] = `${fundsElement.offsetWidth + 20}px`
                baseLayerElement.style["width"] = `${fundsElement.offsetWidth + 30}px`
                helperlayerElement.style["height"] = `${fundsElement.offsetHeight}px`
                baseLayerElement.style["height"] = `${fundsElement.offsetHeight + 20}px`
                baseLayerElement.style["left"] = `${-7}px`
            }

            else if (this._introItems[this._currentStep].tooltipClass === "watchlist-tooltip") {
                helperlayerElement.style["width"] = `${wtchListElement.offsetWidth - 58}px`
                helperlayerElement.style["height"] = `${wtchListElement.offsetHeight + 10}px`
                helperlayerElement.style["left"] = `${wtchListElement.offsetLeft}px`
                helperlayerElement.style["top"] = `${wtchListElement.offsetTop + 150}px`
                baseLayerElement.style["width"] = `${wtchListElement.offsetWidth - 56}px`
                baseLayerElement.style["height"] = `${wtchListElement.offsetHeight + 10}px`
                baseLayerElement.style["left"] = `${wtchListElement.offsetLeft}px`
                // baseLayerElement.style["top"] = `${wtchListElement.offsetTop}px`
            }
            else if (this._introItems[this._currentStep].tooltipClass === "wtchlistAdd-tooltip") {
                helperlayerElement.style["width"] = `${wtchListAddElement.offsetWidth}px`
                helperlayerElement.style["height"] = `${wtchListAddElement.offsetHeight + 10}px`
                helperlayerElement.style["left"] = `${wtchListAddElement.offsetLeft}px`
                helperlayerElement.style["top"] = `${wtchListAddElement.offsetTop + 205}px`
                baseLayerElement.style["width"] = `${wtchListAddElement.offsetWidth + 5}px`
                baseLayerElement.style["height"] = `${wtchListAddElement.offsetHeight + 10}px`
            }
            else if (this._introItems[this._currentStep].tooltipClass === "search-tooltip") {
                helperlayerElement.style["width"] = `${searchElement.offsetWidth - 120}px`
                helperlayerElement.style["height"] = `${searchElement.offsetHeight }px`
                baseLayerElement.style["width"] = `${searchElement.offsetWidth - 120}px`
                baseLayerElement.style["height"] = `${searchElement.offsetHeight }px`
            }
            else if (this._introItems[this._currentStep].tooltipClass === "watchlistSym-tooltip") {
                element.classList.add("demotour-selected");
                helperlayerElement.style["width"] = `${symbolElement.offsetWidth + 6}px`
                helperlayerElement.style["height"] = `${symbolElement.offsetHeight}px`
                helperlayerElement.style["left"] = `${symbolElement.offsetLeft}px`
                helperlayerElement.style["top"] = `${symbolElement.offsetTop + 155}px`
                baseLayerElement.style["width"] = `${symbolElement.offsetWidth + 4 }px`
                baseLayerElement.style["height"] = `${symbolElement.offsetHeight }px`
            }

            else if (this._introItems[this._currentStep].tooltipClass === "watchlistHoverIcons-tooltip") {
                baseLayerElement.style["width"] = `${65}px`
                baseLayerElement.style["height"] = `${65}px`
            }

            else if (this._introItems[this._currentStep].tooltipClass === "watchlistHoverBuySell-tooltip") {
                baseLayerElement.style["width"] = `${buySellElement.offsetWidth + 45 }px`
                baseLayerElement.style["height"] = `${buySellElement.offsetHeight + 10}px`
            }

            else if (this._introItems[this._currentStep].tooltipClass === "orderpad-demotour") {
                helperlayerElement.style["width"] = `${delivElement.offsetWidth + 40 }px`
                helperlayerElement.style["height"] = `${delivElement.offsetHeight - 2}px`
                baseLayerElement.style["width"] = `${delivElement.offsetWidth + 40}px`
                baseLayerElement.style["height"] = `${delivElement.offsetHeight - 4}px`
            }

            else if (this._introItems[this._currentStep].tooltipClass === "orderpad-mtf-demotour") {
                helperlayerElement.style["width"] = `${mtfElement.offsetWidth + 90 }px`
                helperlayerElement.style["height"] = `${mtfElement.offsetHeight - 4}px`
                baseLayerElement.style["width"] = `${mtfElement.offsetWidth + 90}px`
                baseLayerElement.style["height"] = `${mtfElement.offsetHeight - 6}px`
            }

            else if (this._introItems[this._currentStep].tooltipClass === "menu-tooltip") {
                baseLayerElement.style["width"] = `${70}px`
                baseLayerElement.style["height"] = `${70}px`
            }

            else if (this._introItems[this._currentStep].tooltipClass === "order-tooltip") {
                helperlayerElement.style["height"] = `${orderElement.offsetHeight + 50}px`
                baseLayerElement.style["width"] = `${orderElement.offsetWidth + 3}px`
                baseLayerElement.style["height"] = `${orderElement.offsetHeight + 45}px`
            }

            else if (this._introItems[this._currentStep].tooltipClass === "demo-final-step") {
                baseLayerElement.style["width"] = `${0}}px`
                baseLayerElement.style["height"] = `${0}px`
            }

            // Here we are adding a class to force hover in the 9th step and customizing it's intro-helperlayer
            // let hoverElement = document.querySelector(".showOnHover");

            if ((this._introItems[this._currentStep].tooltipClass === "watchlistHoverIcons-tooltip")
                || (this._introItems[this._currentStep].tooltipClass === "orderpad-demotour")) {
                element.classList.add("demotour-selected");
                // helperlayerElement.style["width"] = `${hoverElement.offsetWidth + 20}px`
                // helperlayerElement.style["height"] = `${hoverElement.offsetHeight}px`
                // helperlayerElement.style["left"] = `${hoverElement.offsetLeft}px`
                // helperlayerElement.style["top"] = `${hoverElement.offsetTop + 155}px`
            }
            //Here we are customizing the helperlayer of 10th step

            // if (this._introItems[this._currentStep].tooltipClass === "orderpad-demotour"){

            //     // }
            //     helperlayerElement.style["width"] = `${orderDelivElement.offsetWidth }px`
            //     console.log('orderDelivElement.offsetWidth :', orderDelivElement.offsetWidth);
            //     helperlayerElement.style["height"] = `${orderDelivElement.offsetHeight}px`
            //     console.log('orderDelivElement.offsetHeight :', orderDelivElement.offsetHeight);
            //     helperlayerElement.style["left"] = `${orderDelivElement.offsetLeft + 600}px`
            //     console.log('orderDelivElement.offsetLeft :', orderDelivElement.offsetLeft);
            //     helperlayerElement.style["top"] = `${orderDelivElement.offsetTop + 264}px`
            //     console.log('orderDelivElement.offsetTop :', orderDelivElement.offsetTop);
            // }
            //Here we are customizing the helperlayer of 11th step

            // let orderMtfElement = document.querySelector(".mtfDemoTour");

            // if (this._introItems[this._currentStep].tooltipClass === "orderpad-mtf-demotour") {
            // helperlayerElement.style["width"] = `${orderMtfElement.offsetWidth + 40}px`
            // helperlayerElement.style["height"] = `${orderMtfElement.offsetHeight}px`
            // helperlayerElement.style["left"] = `${orderMtfElement.offsetLeft}px`
            // helperlayerElement.style["top"] = `${orderMtfElement.offsetTop + 264}px`
            // }
            //Here we are customizing the helperlayer
            let addOnClass = "introjs-fixedTooltip";
            //For MenuIcon helperlayer
            if (currentElement.element.classList.contains("highElemMenu")) {
                addOnClass = addOnClass + " high-menu";
            }
            //For Logo helperlayer
            if (currentElement.element.classList.contains("highElemLogo")) {
                addOnClass = addOnClass + " high-logo";
            }
            //For IndicesDiv-parent helperlayer
            if (currentElement.element.classList.contains("highIndices")) {
                addOnClass = addOnClass + " high-indices";
            }
            //For Funds helperlayer
            if (currentElement.element.classList.contains("highFunds")) {
                addOnClass = addOnClass + " high-funds";
            }
            //For Funds-Redirect helperlayer
            if (currentElement.element.classList.contains("highFundsBtn")) {
                addOnClass = addOnClass + " high-funds-btn";
            }

            if (isFixed(currentElement.element)) {
                addClass(helperLayer, addOnClass);
            } else {
                removeClass(helperLayer, "introjs-fixedTooltip");
            }

            if (currentElement.position === "floating") {
                widthHeightPadding = 0;
            } //set new position to helper layer

            setStyle(helperLayer, {
                width: "".concat(elementPosition.width + widthHeightPadding, "px"),
                height: "".concat(elementPosition.height + widthHeightPadding, "px"),
                top: "".concat(elementPosition.top - widthHeightPadding / 2, "px"),
                left: "".concat(elementPosition.left - widthHeightPadding / 2, "px")
            });
        }
    }

    let UNSCOPABLES = wellKnownSymbol('unscopables');
    let ArrayPrototype = Array.prototype;

    // Array.prototype[@@unscopables]
    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    if (ArrayPrototype[UNSCOPABLES] == undefined) {
        objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
            configurable: true,
            value: objectCreate(null)
        });
    }

    // add a key to Array.prototype[@@unscopables]
    let addToUnscopables = function (key) {
        ArrayPrototype[UNSCOPABLES][key] = true;
    };

    let $includes = arrayIncludes.includes;

    // `Array.prototype.includes` method
    // https://tc39.es/ecma262/#sec-array.prototype.includes
    _export({ target: 'Array', proto: true }, {
        includes: function includes(el /* , fromIndex = 0 */) {
            return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
        }
    });

    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    addToUnscopables('includes');

    let HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('slice');

    let SPECIES = wellKnownSymbol('species');
    let Array$1 = global_1.Array;
    let max$1 = Math.max;

    // `Array.prototype.slice` method
    // https://tc39.es/ecma262/#sec-array.prototype.slice
    // fallback for not array-like ES3 strings and DOM objects
    _export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 }, {
        slice: function slice(start, end) {
            let O = toIndexedObject(this);
            let length = lengthOfArrayLike(O);
            let k = toAbsoluteIndex(start, length);
            let fin = toAbsoluteIndex(end === undefined ? length : end, length);
            // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
            let Constructor, result, n;
            if (isArray(O)) {
                Constructor = O.constructor;
                // cross-realm fallback
                if (isConstructor(Constructor) && (Constructor === Array$1 || isArray(Constructor.prototype))) {
                    Constructor = undefined;
                } else if (isObject(Constructor)) {
                    Constructor = Constructor[SPECIES];
                    if (Constructor === null) Constructor = undefined;
                }
                if (Constructor === Array$1 || Constructor === undefined) {
                    return arraySlice(O, k, fin);
                }
            }
            result = new (Constructor === undefined ? Array$1 : Constructor)(max$1(fin - k, 0));
            for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
            result.length = n;
            return result;
        }
    });

    let TypeError$2 = global_1.TypeError;

    let notARegexp = function (it) {
        if (isRegexp(it)) {
            throw TypeError$2("The method doesn't accept regular expressions");
        } return it;
    };

    let MATCH = wellKnownSymbol('match');

    let correctIsRegexpLogic = function (METHOD_NAME) {
        let regexp = /./;
        try {
            '/./'[METHOD_NAME](regexp);
        } catch (error1) {
            try {
                regexp[MATCH] = false;
                return '/./'[METHOD_NAME](regexp);
            } catch (error2) { /* empty */ }
        } return false;
    };

    let stringIndexOf = functionUncurryThis(''.indexOf);

    // `String.prototype.includes` method
    // https://tc39.es/ecma262/#sec-string.prototype.includes
    _export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
        includes: function includes(searchString /* , position = 0 */) {
            return !!~stringIndexOf(
                toString_1(requireObjectCoercible(this)),
                toString_1(notARegexp(searchString)),
                arguments.length > 1 ? arguments[1] : undefined
            );
        }
    });

    let arrayMethodIsStrict = function (METHOD_NAME, argument) {
        let method = [][METHOD_NAME];
        return !!method && fails(function () {
            // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
            method.call(null, argument || function () { throw 1; }, 1);
        });
    };

    let un$Join = functionUncurryThis([].join);

    let ES3_STRINGS = indexedObject != Object;
    let STRICT_METHOD$1 = arrayMethodIsStrict('join', ',');

    // `Array.prototype.join` method
    // https://tc39.es/ecma262/#sec-array.prototype.join
    _export({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$1 }, {
        join: function join(separator) {
            return un$Join(toIndexedObject(this), separator === undefined ? ',' : separator);
        }
    });

    let bind = functionUncurryThis(functionUncurryThis.bind);

    // optional / simple context binding
    let functionBindContext = function (fn, that) {
        aCallable(fn);
        return that === undefined ? fn : bind ? bind(fn, that) : function (/* ...args */) {
            return fn.apply(that, arguments);
        };
    };

    let push$1 = functionUncurryThis([].push);

    // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
    let createMethod = function (TYPE) {
        let IS_MAP = TYPE == 1;
        let IS_FILTER = TYPE == 2;
        let IS_SOME = TYPE == 3;
        let IS_EVERY = TYPE == 4;
        let IS_FIND_INDEX = TYPE == 6;
        let IS_FILTER_REJECT = TYPE == 7;
        let NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
        return function ($this, callbackfn, that, specificCreate) {
            let O = toObject($this);
            let self = indexedObject(O);
            let boundFunction = functionBindContext(callbackfn, that);
            let length = lengthOfArrayLike(self);
            let index = 0;
            let create = specificCreate || arraySpeciesCreate;
            let target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
            let value, result;
            for (; length > index; index++) if (NO_HOLES || index in self) {
                value = self[index];
                result = boundFunction(value, index, O);
                if (TYPE) {
                    if (IS_MAP) target[index] = result; // map
                    else if (result) switch (TYPE) {
                        case 3: return true;              // some
                        case 5: return value;             // find
                        case 6: return index;             // findIndex
                        case 2: push$1(target, value);      // filter
                    } else switch (TYPE) {
                        case 4: return false;             // every
                        case 7: push$1(target, value);      // filterReject
                    }
                }
            }
            return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
        };
    };

    let arrayIteration = {
        // `Array.prototype.forEach` method
        // https://tc39.es/ecma262/#sec-array.prototype.foreach
        forEach: createMethod(0),
        // `Array.prototype.map` method
        // https://tc39.es/ecma262/#sec-array.prototype.map
        map: createMethod(1),
        // `Array.prototype.filter` method
        // https://tc39.es/ecma262/#sec-array.prototype.filter
        filter: createMethod(2),
        // `Array.prototype.some` method
        // https://tc39.es/ecma262/#sec-array.prototype.some
        some: createMethod(3),
        // `Array.prototype.every` method
        // https://tc39.es/ecma262/#sec-array.prototype.every
        every: createMethod(4),
        // `Array.prototype.find` method
        // https://tc39.es/ecma262/#sec-array.prototype.find
        find: createMethod(5),
        // `Array.prototype.findIndex` method
        // https://tc39.es/ecma262/#sec-array.prototype.findIndex
        findIndex: createMethod(6),
        // `Array.prototype.filterReject` method
        // https://github.com/tc39/proposal-array-filtering
        filterReject: createMethod(7)
    };

    let $filter = arrayIteration.filter;

    let HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('filter');

    // `Array.prototype.filter` method
    // https://tc39.es/ecma262/#sec-array.prototype.filter
    // with adding support of @@species
    _export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
        filter: function filter(callbackfn /* , thisArg */) {
            return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        }
    });

    /**
     * Set tooltip left so it doesn't go off the right side of the window
     *
     * @return boolean true, if tooltipLayerStyleLeft is ok.  false, otherwise.
     */
    function checkRight(targetOffset, tooltipLayerStyleLeft, tooltipOffset, windowSize, tooltipLayer) {
        if (targetOffset.left + tooltipLayerStyleLeft + tooltipOffset.width > windowSize.width) {
            // off the right side of the window
            tooltipLayer.style.left = "".concat(windowSize.width - tooltipOffset.width - targetOffset.left, "px");
            return false;
        }

        tooltipLayer.style.left = "".concat(tooltipLayerStyleLeft, "px");
        return true;
    }

    /**
     * Set tooltip right so it doesn't go off the left side of the window
     *
     * @return boolean true, if tooltipLayerStyleRight is ok.  false, otherwise.
     */
    function checkLeft(targetOffset, tooltipLayerStyleRight, tooltipOffset, tooltipLayer) {
        if (targetOffset.left + targetOffset.width - tooltipLayerStyleRight - tooltipOffset.width < 0) {
            // off the left side of the window
            tooltipLayer.style.left = "".concat(-targetOffset.left, "px");
            return false;
        }

        tooltipLayer.style.right = "".concat(tooltipLayerStyleRight, "px");
        return true;
    }

    let HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');

    let TypeError$1 = global_1.TypeError;
    let max = Math.max;
    let min = Math.min;
    let MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
    let MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

    // `Array.prototype.splice` method
    // https://tc39.es/ecma262/#sec-array.prototype.splice
    // with adding support of @@species
    _export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
        splice: function splice(start, deleteCount /* , ...items */) {
            let O = toObject(this);
            let len = lengthOfArrayLike(O);
            let actualStart = toAbsoluteIndex(start, len);
            let argumentsLength = arguments.length;
            let insertCount, actualDeleteCount, A, k, from, to;
            if (argumentsLength === 0) {
                insertCount = actualDeleteCount = 0;
            } else if (argumentsLength === 1) {
                insertCount = 0;
                actualDeleteCount = len - actualStart;
            } else {
                insertCount = argumentsLength - 2;
                actualDeleteCount = min(max(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
            }
            if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
                throw TypeError$1(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
            }
            A = arraySpeciesCreate(O, actualDeleteCount);
            for (k = 0; k < actualDeleteCount; k++) {
                from = actualStart + k;
                if (from in O) createProperty(A, k, O[from]);
            }
            A.length = actualDeleteCount;
            if (insertCount < actualDeleteCount) {
                for (k = actualStart; k < len - actualDeleteCount; k++) {
                    from = k + actualDeleteCount;
                    to = k + insertCount;
                    if (from in O) O[to] = O[from];
                    else delete O[to];
                }
                for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
            } else if (insertCount > actualDeleteCount) {
                for (k = len - actualDeleteCount; k > actualStart; k--) {
                    from = k + actualDeleteCount - 1;
                    to = k + insertCount - 1;
                    if (from in O) O[to] = O[from];
                    else delete O[to];
                }
            }
            for (k = 0; k < insertCount; k++) {
                O[k + actualStart] = arguments[k + 2];
            }
            O.length = len - actualDeleteCount + insertCount;
            return A;
        }
    });

    /**
     * Remove an entry from a string array if it's there, does nothing if it isn't there.
     *
     * @param {Array} stringArray
     * @param {String} stringToRemove
     */
    function removeEntry(stringArray, stringToRemove) {
        if (stringArray.includes(stringToRemove)) {
            stringArray.splice(stringArray.indexOf(stringToRemove), 1);
        }
    }

    /**
     * auto-determine alignment
     * @param {Integer}  offsetLeft
     * @param {Integer}  tooltipWidth
     * @param {Object}   windowSize
     * @param {String}   desiredAlignment
     * @return {String}  calculatedAlignment
     */

    function _determineAutoAlignment(offsetLeft, tooltipWidth, _ref, desiredAlignment) {
        let width = _ref.width;
        let halfTooltipWidth = tooltipWidth / 2;
        let winWidth = Math.min(width, window.screen.width);
        let possibleAlignments = ["-left-aligned", "-middle-aligned", "-right-aligned"];
        let calculatedAlignment = ""; // valid left must be at least a tooltipWidth
        // away from right side

        if (winWidth - offsetLeft < tooltipWidth) {
            removeEntry(possibleAlignments, "-left-aligned");
        } // valid middle must be at least half
        // width away from both sides

        if (offsetLeft < halfTooltipWidth || winWidth - offsetLeft < halfTooltipWidth) {
            removeEntry(possibleAlignments, "-middle-aligned");
        } // valid right must be at least a tooltipWidth
        // width away from left side

        if (offsetLeft < tooltipWidth) {
            removeEntry(possibleAlignments, "-right-aligned");
        }

        if (possibleAlignments.length) {
            if (possibleAlignments.includes(desiredAlignment)) {
                // the desired alignment is valid
                calculatedAlignment = desiredAlignment;
            } else {
                // pick the first valid position, in order
                calculatedAlignment = possibleAlignments[0];
            }
        } else {
            // if screen width is too small
            // for ANY alignment, middle is
            // probably the best for visibility
            calculatedAlignment = "-middle-aligned";
        }

        return calculatedAlignment;
    }
    /**
     * Determines the position of the tooltip based on the position precedence and availability
     * of screen space.
     *
     * @param {Object}    targetElement
     * @param {Object}    tooltipLayer
     * @param {String}    desiredTooltipPosition
     * @return {String}   calculatedPosition
     */

    function _determineAutoPosition(targetElement, tooltipLayer, desiredTooltipPosition) {
        // Take a clone of position precedence. These will be the available
        let possiblePositions = this._options.positionPrecedence.slice();

        let windowSize = getWinSize();
        let tooltipHeight = getOffset(tooltipLayer).height + 10;
        let tooltipWidth = getOffset(tooltipLayer).width + 20;
        let targetElementRect = targetElement.getBoundingClientRect(); // If we check all the possible areas, and there are no valid places for the tooltip, the element
        // must take up most of the screen real estate. Show the tooltip floating in the middle of the screen.

        let calculatedPosition = "floating";
        /*
       * auto determine position
       */
        // Check for space below

        if (targetElementRect.bottom + tooltipHeight > windowSize.height) {
            removeEntry(possiblePositions, "bottom");
        } // Check for space above

        if (targetElementRect.top - tooltipHeight < 0) {
            removeEntry(possiblePositions, "top");
        } // Check for space to the right

        if (targetElementRect.right + tooltipWidth > windowSize.width) {
            removeEntry(possiblePositions, "right");
        } // Check for space to the left

        if (targetElementRect.left - tooltipWidth < 0) {
            removeEntry(possiblePositions, "left");
        } // @var {String}  ex: 'right-aligned'

        let desiredAlignment = function (pos) {
            let hyphenIndex = pos.indexOf("-");

            if (hyphenIndex !== -1) {
                // has alignment
                return pos.substr(hyphenIndex);
            }

            return "";
        }(desiredTooltipPosition || ""); // strip alignment from position

        if (desiredTooltipPosition) {
            // ex: "bottom-right-aligned"
            // should return 'bottom'
            desiredTooltipPosition = desiredTooltipPosition.split("-")[0];
        }

        if (possiblePositions.length) {
            if (possiblePositions.includes(desiredTooltipPosition)) {
                // If the requested position is in the list, choose that
                calculatedPosition = desiredTooltipPosition;
            } else {
                // Pick the first valid position, in order
                calculatedPosition = possiblePositions[0];
            }
        } // only top and bottom positions have optional alignments

        if (["top", "bottom"].includes(calculatedPosition)) {
            calculatedPosition += _determineAutoAlignment(targetElementRect.left, tooltipWidth, windowSize, desiredAlignment);
        }

        return calculatedPosition;
    }
    /**
     * Render tooltip box in the page
     *
     * @api private
     * @method placeTooltip
     * @param {HTMLElement} targetElement
     * @param {HTMLElement} tooltipLayer
     * @param {HTMLElement} arrowLayer
     * @param {Boolean} hintMode
     */

    function placeTooltip(targetElement, tooltipLayer, arrowLayer, hintMode) {
        let tooltipCssClass = "";
        let currentStepObj;
        let tooltipOffset;
        let targetOffset;
        let windowSize;
        let currentTooltipPosition;
        hintMode = hintMode || false; //reset the old style

        tooltipLayer.style.top = null;
        tooltipLayer.style.right = null;
        tooltipLayer.style.bottom = null;
        tooltipLayer.style.left = null;
        tooltipLayer.style.marginLeft = null;
        tooltipLayer.style.marginTop = null;
        arrowLayer.style.display = "none"; //prevent error when `this._currentStep` is undefined

        if (!this._introItems[this._currentStep]) return; //if we have a custom css class for each step

        currentStepObj = this._introItems[this._currentStep];

        if (typeof currentStepObj.tooltipClass === "string") {
            tooltipCssClass = currentStepObj.tooltipClass;
        } else {
            tooltipCssClass = this._options.tooltipClass;
        }

        tooltipLayer.className = ["introjs-tooltip", tooltipCssClass].filter(Boolean).join(" ");
        tooltipLayer.setAttribute("role", "dialog");
        currentTooltipPosition = this._introItems[this._currentStep].position; // Floating is always valid, no point in calculating

        if (currentTooltipPosition !== "floating" && this._options.autoPosition) {
            currentTooltipPosition = _determineAutoPosition.call(this, targetElement, tooltipLayer, currentTooltipPosition);
        }

        let tooltipLayerStyleLeft;
        targetOffset = getOffset(targetElement);
        tooltipOffset = getOffset(tooltipLayer);
        windowSize = getWinSize();
        addClass(tooltipLayer, "introjs-".concat(currentTooltipPosition));

        switch (currentTooltipPosition) {
            case "top-right-aligned":
                arrowLayer.className = "introjs-arrow bottom-right";
                var tooltipLayerStyleRight = 0;
                checkLeft(targetOffset, tooltipLayerStyleRight, tooltipOffset, tooltipLayer);
                tooltipLayer.style.bottom = "".concat(targetOffset.height + 20, "px");
                break;

            case "top-middle-aligned":
                arrowLayer.className = "introjs-arrow bottom-middle";
                var tooltipLayerStyleLeftRight = targetOffset.width / 2 - tooltipOffset.width / 2; // a fix for middle aligned hints

                if (hintMode) {
                    tooltipLayerStyleLeftRight += 5;
                }

                if (checkLeft(targetOffset, tooltipLayerStyleLeftRight, tooltipOffset, tooltipLayer)) {
                    tooltipLayer.style.right = null;
                    checkRight(targetOffset, tooltipLayerStyleLeftRight, tooltipOffset, windowSize, tooltipLayer);
                }

                tooltipLayer.style.bottom = "".concat(targetOffset.height + 20, "px");
                break;

            case "top-left-aligned": // top-left-aligned is the same as the default top

            case "top":
                arrowLayer.className = "introjs-arrow bottom";
                tooltipLayerStyleLeft = hintMode ? 0 : 15;
                checkRight(targetOffset, tooltipLayerStyleLeft, tooltipOffset, windowSize, tooltipLayer);
                tooltipLayer.style.bottom = "".concat(targetOffset.height + 20, "px");
                break;

            case "right":
                tooltipLayer.style.left = "".concat(targetOffset.width + 20, "px");

                if (targetOffset.top + tooltipOffset.height > windowSize.height) {
                    // In this case, right would have fallen below the bottom of the screen.
                    // Modify so that the bottom of the tooltip connects with the target
                    arrowLayer.className = "introjs-arrow left-bottom";
                    tooltipLayer.style.top = "-".concat(tooltipOffset.height - targetOffset.height - 20, "px");
                } else {
                    arrowLayer.className = "introjs-arrow left";
                }

                break;

            case "left":
                if (!hintMode && this._options.showStepNumbers === true) {
                    tooltipLayer.style.top = "15px";
                }

                if (targetOffset.top + tooltipOffset.height > windowSize.height) {
                    // In this case, left would have fallen below the bottom of the screen.
                    // Modify so that the bottom of the tooltip connects with the target
                    tooltipLayer.style.top = "-".concat(tooltipOffset.height - targetOffset.height - 20, "px");
                    arrowLayer.className = "introjs-arrow right-bottom";
                } else {
                    arrowLayer.className = "introjs-arrow right";
                }

                tooltipLayer.style.right = "".concat(targetOffset.width + 20, "px");
                break;

            case "floating":

                arrowLayer.style.display = "none"; //we have to adjust the top and left of layer manually for intro items without element

                tooltipLayer.style.left = "50%";
                tooltipLayer.style.top = "50%";
                tooltipLayer.style.marginLeft = "-".concat(tooltipOffset.width / 2, "px");
                tooltipLayer.style.marginTop = "-".concat(tooltipOffset.height / 2, "px");
                break;

            case "bottom-right-aligned":
                arrowLayer.className = "introjs-arrow top-right";
                tooltipLayerStyleRight = 0;
                checkLeft(targetOffset, tooltipLayerStyleRight, tooltipOffset, tooltipLayer);
                tooltipLayer.style.top = "".concat(targetOffset.height + 20, "px");
                break;

            case "bottom-middle-aligned":
                arrowLayer.className = "introjs-arrow top-middle";
                tooltipLayerStyleLeftRight = targetOffset.width / 2 - tooltipOffset.width / 2; // a fix for middle aligned hints

                if (hintMode) {
                    tooltipLayerStyleLeftRight += 5;
                }

                if (checkLeft(targetOffset, tooltipLayerStyleLeftRight, tooltipOffset, tooltipLayer)) {
                    tooltipLayer.style.right = null;
                    checkRight(targetOffset, tooltipLayerStyleLeftRight, tooltipOffset, windowSize, tooltipLayer);
                }

                tooltipLayer.style.top = "".concat(targetOffset.height + 20, "px");
                break;
                // case 'bottom-left-aligned':
                // Bottom-left-aligned is the same as the default bottom
                // case 'bottom':
                // Bottom going to follow the default behavior

            default:
                arrowLayer.className = "introjs-arrow top";
                tooltipLayerStyleLeft = 0;
                checkRight(targetOffset, tooltipLayerStyleLeft, tooltipOffset, windowSize, tooltipLayer);
                tooltipLayer.style.top = "".concat(targetOffset.height + 20, "px");
        }
    }

    /**
     * To remove all show element(s)
     *
     * @api private
     * @method _removeShowElement
     */

    function removeShowElement() {
        let elms = document.querySelectorAll(".introjs-showElement");
        forEach(elms, function (elm) {
            removeClass(elm, /introjs-[a-zA-Z]+/g);
        });
    }

    function _createElement(tagname, attrs) {
        let element = document.createElement(tagname);
        attrs = attrs || {}; // regex for matching attributes that need to be set with setAttribute

        let setAttRegex = /^(?:role|data-|aria-)/;

        for (let k in attrs) {
            let v = attrs[k];

            if (k === "style") {
                setStyle(element, v);
            } else if (k.match(setAttRegex)) {
                element.setAttribute(k, v);
            } else {
                element[k] = v;
            }
        }

        return element;
    }

    /**
     * Appends `element` to `parentElement`
     *
     * @param {Element} parentElement
     * @param {Element} element
     * @param {Boolean} [animate=false]
     */

    function appendChild(parentElement, element, animate) {
        if (animate) {
            let existingOpacity = element.style.opacity || "1";
            setStyle(element, {
                opacity: "0"
            });
            window.setTimeout(function () {
                setStyle(element, {
                    opacity: existingOpacity
                });
            }, 10);
        }

        parentElement.appendChild(element);
    }

    /**
     * Gets the current progress percentage
     *
     * @api private
     * @method _getProgress
     * @returns current progress percentage
     */

    function _getProgress() {
        // Steps are 0 indexed
        let currentStep = parseInt(this._currentStep + 1, 10);
        return currentStep / this._introItems.length * 100;
    }
    /**
     * Add disableinteraction layer and adjust the size and position of the layer
     *
     * @api private
     * @method _disableInteraction
     */

    function _disableInteraction() {
        let disableInteractionLayer = document.querySelector(".introjs-disableInteraction");

        if (disableInteractionLayer === null) {
            disableInteractionLayer = _createElement("div", {
                className: "introjs-disableInteraction"
            });

            this._targetElement.appendChild(disableInteractionLayer);
        }

        setHelperLayerPosition.call(this, disableInteractionLayer);
    }
    /**
     * Creates the bullets layer
     * @returns HTMLElement
     * @private
     */

    function _createBullets(targetElement) {
        let self = this;
        let bulletsLayer = _createElement("div", {
            className: "introjs-bullets"
        });

        if (this._options.showBullets === false) {
            bulletsLayer.style.display = "none";
        }

        let ulContainer = _createElement("ul");
        ulContainer.setAttribute("role", "tablist");

        let anchorClick = function anchorClick() {
            self.goToStep(this.getAttribute("data-stepnumber"));
        };

        forEach(this._introItems, function (_ref, i) {
            let step = _ref.step;
            let innerLi = _createElement("li");
            let anchorLink = _createElement("a");
            innerLi.setAttribute("role", "presentation");
            anchorLink.setAttribute("role", "tab");
            anchorLink.onclick = anchorClick;

            if (i === targetElement.step - 1) {
                anchorLink.className = "active";
            }

            setAnchorAsButton(anchorLink);
            anchorLink.innerHTML = "&nbsp;";
            anchorLink.setAttribute("data-stepnumber", step);
            innerLi.appendChild(anchorLink);
            ulContainer.appendChild(innerLi);
        });
        bulletsLayer.appendChild(ulContainer);
        return bulletsLayer;
    }
    /**
     * Deletes and recreates the bullets layer
     * @param oldReferenceLayer
     * @param targetElement
     * @private
     */

    function _recreateBullets(oldReferenceLayer, targetElement) {
        if (this._options.showBullets) {
            let existing = document.querySelector(".introjs-bullets");
            existing.parentNode.replaceChild(_createBullets.call(this, targetElement), existing);
        }
    }
    /**
     * Updates the bullets
     *
     * @param oldReferenceLayer
     * @param targetElement
     */

    function _updateBullets(oldReferenceLayer, targetElement) {
        if (this._options.showBullets) {
            oldReferenceLayer.querySelector(".introjs-bullets li > a.active").className = "";
            oldReferenceLayer.querySelector(".introjs-bullets li > a[data-stepnumber=\"".concat(targetElement.step, "\"]")).className = "active";
        }
    }
    /**
     * Creates the progress-bar layer and elements
     * @returns {*}
     * @private
     */

    function _createProgressBar() {
        let progressLayer = _createElement("div");
        progressLayer.className = "introjs-progress";

        if (this._options.showProgress === false) {
            progressLayer.style.display = "none";
        }

        let progressBar = _createElement("div", {
            className: "introjs-progressbar"
        });

        if (this._options.progressBarAdditionalClass) {
            progressBar.className += " " + this._options.progressBarAdditionalClass;
        }

        progressBar.setAttribute("role", "progress");
        progressBar.setAttribute("aria-valuemin", 0);
        progressBar.setAttribute("aria-valuemax", 100);
        progressBar.setAttribute("aria-valuenow", _getProgress.call(this));
        progressBar.style.cssText = "width:".concat(_getProgress.call(this), "%;");
        progressLayer.appendChild(progressBar);
        return progressLayer;
    }
    /**
     * Updates an existing progress bar variables
     * @param oldReferenceLayer
     * @private
     */

    function _updateProgressBar(oldReferenceLayer) {
        oldReferenceLayer.querySelector(".introjs-progress .introjs-progressbar").style.cssText = "width:".concat(_getProgress.call(this), "%;");
        oldReferenceLayer.querySelector(".introjs-progress .introjs-progressbar").setAttribute("aria-valuenow", _getProgress.call(this));
    }
    /**
     * Show an element on the page
     *
     * @api private
     * @method _showElement
     * @param {Object} targetElement
     */

    function _showElement(targetElement) {
        let _this = this;

        if (typeof this._introChangeCallback !== "undefined") {
            this._introChangeCallback.call(this, targetElement.element);
        }

        let self = this;
        let oldHelperLayer = document.querySelector(".introjs-helperLayer");
        let oldReferenceLayer = document.querySelector(".introjs-tooltipReferenceLayer");
        let highlightClass = "introjs-helperLayer";
        let nextTooltipButton;
        let prevTooltipButton;
        let skipTooltipButton; //check for a current step highlight class

        if (typeof targetElement.highlightClass === "string") {
            highlightClass += " ".concat(targetElement.highlightClass);
        } //check for options highlight class

        if (typeof this._options.highlightClass === "string") {
            highlightClass += " ".concat(this._options.highlightClass);
        }

        if (oldHelperLayer !== null && oldReferenceLayer !== null) {
            let oldHelperNumberLayer = oldReferenceLayer.querySelector(".introjs-helperNumberLayer");
            let oldtooltipLayer = oldReferenceLayer.querySelector(".introjs-tooltiptext");
            let oldTooltipTitleLayer = oldReferenceLayer.querySelector(".introjs-tooltip-title");
            let oldArrowLayer = oldReferenceLayer.querySelector(".introjs-arrow");
            let oldtooltipContainer = oldReferenceLayer.querySelector(".introjs-tooltip");
            skipTooltipButton = oldReferenceLayer.querySelector(".introjs-skipbutton");
            prevTooltipButton = oldReferenceLayer.querySelector(".introjs-prevbutton");
            nextTooltipButton = oldReferenceLayer.querySelector(".introjs-nextbutton"); //update or reset the helper highlight class

            oldHelperLayer.className = highlightClass; //hide the tooltip

            oldtooltipContainer.style.opacity = 0;
            oldtooltipContainer.style.display = "none"; // if the target element is within a scrollable element

            scrollParentToElement.call(self, targetElement); // set new position to helper layer

            setHelperLayerPosition.call(self, oldHelperLayer);
            setHelperLayerPosition.call(self, oldReferenceLayer); //remove old classes if the element still exist

            removeShowElement(); //we should wait until the CSS3 transition is competed (it's 0.3 sec) to prevent incorrect `height` and `width` calculation

            if (self._lastShowElementTimer) {
                window.clearTimeout(self._lastShowElementTimer);
            }

            self._lastShowElementTimer = window.setTimeout(function () {
                // set current step to the label
                if (oldHelperNumberLayer !== null) {
                    oldHelperNumberLayer.innerHTML = "".concat(targetElement.step - 1, "/").concat(_this._introItems.length - 2);
                } // set current tooltip text

                oldtooltipLayer.innerHTML = targetElement.intro; // set current tooltip title

                oldTooltipTitleLayer.innerHTML = targetElement.title; //set the tooltip position

                oldtooltipContainer.style.display = "block";
                placeTooltip.call(self, targetElement.element, oldtooltipContainer, oldArrowLayer); //change active bullet

                _updateBullets.call(self, oldReferenceLayer, targetElement);

                _updateProgressBar.call(self, oldReferenceLayer); //show the tooltip

                oldtooltipContainer.style.opacity = 1; //reset button focus

                if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null && /introjs-donebutton/gi.test(nextTooltipButton.className)) {
                    // skip button is now "done" button
                    nextTooltipButton.focus();
                } else if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
                    //still in the tour, focus on next
                    nextTooltipButton.focus();
                } // change the scroll of the window, if needed

                scrollTo.call(self, targetElement.scrollTo, targetElement, oldtooltipLayer);
            }, 350); // end of old element if-else condition
        } else {
            let baseLayer = _createElement("div", {
                className: "introjs-baseLayer"
            });
            let focusLayer = _createElement("div", {
                className: "introjs-focusLayer"
            });
            let helperLayer = _createElement("div", {
                className: highlightClass
            });
            let baseTipLayer = _createElement("div", {
                className: "introjs-baseTipLayer"
            });
            let baseTipGroundLayer = _createElement("div", {
                className: "introjs-baseTipGroundLayer"
            });
            let referenceLayer = _createElement("div", {
                className: "introjs-tooltipReferenceLayer"
            });
            let arrowLayer = _createElement("div", {
                className: "introjs-arrow"
            });
            let tooltipLayer = _createElement("div", {
                className: "introjs-tooltip"
            });
            let tooltipTextLayer = _createElement("div", {
                className: "introjs-tooltiptext"
            });
            let tooltipHeaderLayer = _createElement("div", {
                className: "introjs-tooltip-header"
            });
            let tooltipTitleLayer = _createElement("h1", {
                className: "introjs-tooltip-title"
            });
            let buttonsLayer = _createElement("div");
            setStyle(helperLayer, {
                "box-shadow": "rgba(0, 0, 0, ".concat(self._options.overlayOpacity.toString(), ") 0 0 0 5000px")
            }); // target is within a scrollable element

            scrollParentToElement.call(self, targetElement); //set new position to helper layer

            setHelperLayerPosition.call(self, helperLayer);
            setHelperLayerPosition.call(self, referenceLayer); //add helper layer to target element

            appendChild(this._targetElement, helperLayer, true);
            appendChild(this._targetElement, referenceLayer);
            baseLayer.appendChild(baseTipGroundLayer)
            helperLayer.appendChild(baseLayer)
            helperLayer.appendChild(baseTipLayer)
            helperLayer.appendChild(focusLayer)
            tooltipTextLayer.innerHTML = targetElement.intro;
            tooltipTitleLayer.innerHTML = targetElement.title;
            buttonsLayer.className = "introjs-tooltipbuttons";

            if (this._options.showButtons === false) {
                buttonsLayer.style.display = "none";
            }

            // tooltipHeaderLayer.appendChild(tooltipTitleLayer);
            tooltipLayer.appendChild(tooltipHeaderLayer);
            tooltipLayer.appendChild(tooltipTextLayer);
            tooltipLayer.appendChild(_createBullets.call(this, targetElement));
            tooltipLayer.appendChild(_createProgressBar.call(this)); // add helper layer number

            let helperNumberLayer = _createElement("a");

            if (this._options.showStepNumbers === true) {
                helperNumberLayer.className = "introjs-helperNumberLayer";
                helperNumberLayer.innerHTML = "".concat(targetElement.step - 1, "/").concat(this._introItems.length - 2);
                buttonsLayer.appendChild(helperNumberLayer);
            }
            tooltipLayer.appendChild(arrowLayer);
            referenceLayer.appendChild(tooltipLayer); //next button

            nextTooltipButton = _createElement("a");

            nextTooltipButton.onclick = function () {

                if (self._introItems.length - 1 !== self._currentStep) {
                    refresh.call(self);
                    nextStep.call(self);
                } else if (/introjs-last-prev/gi.test(nextTooltipButton.className)) {
                    if (typeof self._introCompleteCallback === "function") {
                        self._introCompleteCallback.call(self, self._currentStep, "done");
                    }

                    exitIntro.call(self, self._targetElement);
                }
            };

            setAnchorAsButton(nextTooltipButton);
            nextTooltipButton.innerHTML = this._options.nextLabel; //previous button

            prevTooltipButton = _createElement("a");

            prevTooltipButton.onclick = function () {
                if (self._currentStep !== 0) {
                    previousStep.call(self);
                }
            };

            setAnchorAsButton(prevTooltipButton);
            prevTooltipButton.innerHTML = this._options.prevLabel;
            //skip button

            skipTooltipButton = _createElement("a", {
                className: "introjs-skipbutton bfsl-font"
            });
            setAnchorAsButton(skipTooltipButton);
            skipTooltipButton.innerHTML = this._options.skipLabel;

            skipTooltipButton.onclick = function () {
                // if (self._introItems.length - 1 === self._currentStep && typeof self._introCompleteCallback === "function") {
                //     self._introCompleteCallback.call(self, self._currentStep, "skip");
                // }
                if (self._currentStep === self._introItems.length - 1) {
                    exitIntro.call(self, self._targetElement);

                }
                else {
                    let skipLen = self._introItems.length - 2
                    self._currentStep = skipLen
                    nextStep.call(self);
                }

                // if (typeof self._introSkipCallback === "function") {
                //     self._introSkipCallback.call(self);
                // }

            };

            tooltipHeaderLayer.appendChild(skipTooltipButton); //in order to prevent displaying previous button always
            tooltipHeaderLayer.appendChild(tooltipTitleLayer);

            if (this._introItems.length > 1) {
                buttonsLayer.appendChild(prevTooltipButton);
            } // we always need the next button because this
            // button changes to "Done" in the last step of the tour

            buttonsLayer.appendChild(nextTooltipButton);
            tooltipLayer.appendChild(buttonsLayer); //set proper position

            placeTooltip.call(self, targetElement.element, tooltipLayer, arrowLayer); // change the scroll of the window, if needed

            scrollTo.call(this, targetElement.scrollTo, targetElement, tooltipLayer); //end of new element if-else condition
        } // removing previous disable interaction layer

        let disableInteractionLayer = self._targetElement.querySelector(".introjs-disableInteraction");

        if (disableInteractionLayer) {
            disableInteractionLayer.parentNode.removeChild(disableInteractionLayer);
        } //disable interaction

        if (targetElement.disableInteraction) {
            _disableInteraction.call(self);
        } // when it's the first step of tour

        if (this._currentStep === 0 && this._introItems.length > 1) {
            if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
                nextTooltipButton.className = "".concat(this._options.buttonClass, " introjs-nextbutton bfsl-font");
                nextTooltipButton.innerHTML = this._options.nextLabel;
            }

            if (this._options.hidePrev === true) {
                if (typeof prevTooltipButton !== "undefined" && prevTooltipButton !== null) {
                    prevTooltipButton.className = "".concat(this._options.buttonClass, " introjs-prevbutton introjs-hidden");
                }

                if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
                    addClass(nextTooltipButton, "introjs-fullbutton");
                }
            } else {
                if (typeof prevTooltipButton !== "undefined" && prevTooltipButton !== null) {
                    prevTooltipButton.className = "".concat(this._options.buttonClass, " introjs-prevbutton introjs-disabled");
                }
            }
        } else if (this._introItems.length - 1 === this._currentStep || this._introItems.length === 1) {
            // last step of tour
            if (typeof prevTooltipButton !== "undefined" && prevTooltipButton !== null) {
                prevTooltipButton.className = "".concat(this._options.buttonClass, " introjs-prevbutton bfsl-font");
            }

            if (this._options.hideNext === true) {

                if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
                    nextTooltipButton.className = "".concat(this._options.buttonClass, " introjs-nextbutton introjs-hidden");
                }

                if (typeof prevTooltipButton !== "undefined" && prevTooltipButton !== null) {
                    addClass(prevTooltipButton, "introjs-last-prev");
                }
                //For changing the label from skip to finish in the last step
                // skipTooltipButton.innerHTML = this._options.doneLabel;

            } else {

                if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
                    if (this._options.nextToDone === true) {
                        if (typeof prevTooltipButton !== "undefined" && prevTooltipButton !== null) {
                            prevTooltipButton.className = "".concat(this._options.buttonClass, " introjs-prevbutton introjs-hidden");
                        }
                        removeClass(nextTooltipButton, "bfsl-font");
                        nextTooltipButton.innerHTML = this._options.doneLabel;
                        addClass(nextTooltipButton, "introjs-last-prev");
                    } else {

                        nextTooltipButton.className = "".concat(this._options.buttonClass, " introjs-nextbutton introjs-disabled");
                    }
                }
            }
        } else {

            skipTooltipButton.innerHTML = this._options.skipLabel;
            // steps between start and end
            if (typeof prevTooltipButton !== "undefined" && prevTooltipButton !== null) {
                prevTooltipButton.className = "".concat(this._options.buttonClass, " introjs-prevbutton bfsl-font");
            }

            if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
                nextTooltipButton.className = "".concat(this._options.buttonClass, " introjs-nextbutton bfsl-font");
                nextTooltipButton.innerHTML = this._options.nextLabel;
            }
        }

        if (typeof prevTooltipButton !== "undefined" && prevTooltipButton !== null) {
            prevTooltipButton.setAttribute("role", "button");
        }

        if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
            nextTooltipButton.setAttribute("role", "button");
        }

        if (typeof skipTooltipButton !== "undefined" && skipTooltipButton !== null) {
            skipTooltipButton.setAttribute("role", "button");
        } //Set focus on "next" button, so that hitting Enter always moves you onto the next step

        if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
            nextTooltipButton.focus();
        }

        setShowElement(targetElement);

        if (typeof this._introAfterChangeCallback !== "undefined") {
            this._introAfterChangeCallback.call(this, targetElement.element);
        }
    }

    /**
     * Go to specific step of introduction
     *
     * @api private
     * @method _goToStep
     */

    function goToStep(step) {
        //because steps starts with zero
        this._currentStep = step - 2;

        if (typeof this._introItems !== "undefined") {
            nextStep.call(this);
        }
    }
    /**
     * Go to the specific step of introduction with the explicit [data-step] number
     *
     * @api private
     * @method _goToStepNumber
     */

    function goToStepNumber(step) {
        this._currentStepNumber = step;

        if (typeof this._introItems !== "undefined") {
            nextStep.call(this);
        }
    }
    /**
     * Go to next step on intro
     *
     * @api private
     * @method _nextStep
     */

    function nextStep() {
        let _this = this;

        this._direction = "forward";

        if (typeof this._currentStepNumber !== "undefined") {
            forEach(this._introItems, function (_ref, i) {
                let step = _ref.step;

                if (step === _this._currentStepNumber) {
                    _this._currentStep = i - 1;
                    _this._currentStepNumber = undefined;
                }
            });
        }

        if (typeof this._currentStep === "undefined") {
            this._currentStep = 0;
        } else {
            ++this._currentStep;
        }

        let nextStep = this._introItems[this._currentStep];
        let continueStep = true;

        if (typeof this._introBeforeChangeCallback !== "undefined") {
            continueStep = this._introBeforeChangeCallback.call(this, nextStep && nextStep.element);
        } // if `onbeforechange` returned `false`, stop displaying the element

        if (continueStep === false) {
            --this._currentStep;
            return false;
        }

        if (this._introItems.length <= this._currentStep) {
            //end of the intro
            //check if any callback is defined
            if (typeof this._introCompleteCallback === "function") {
                this._introCompleteCallback.call(this, this._currentStep, "end");
            }

            exitIntro.call(this, this._targetElement);
            return;
        }

        _showElement.call(this, nextStep);
    }
    /**
     * Go to previous step on intro
     *
     * @api private
     * @method _previousStep
     */

    function previousStep() {
        this._direction = "backward";

        if (this._currentStep === 0) {
            return false;
        }

        --this._currentStep;
        let nextStep = this._introItems[this._currentStep];
        let continueStep = true;

        if (typeof this._introBeforeChangeCallback !== "undefined") {
            continueStep = this._introBeforeChangeCallback.call(this, nextStep && nextStep.element);
        } // if `onbeforechange` returned `false`, stop displaying the element

        if (continueStep === false) {
            ++this._currentStep;
            return false;
        }

        _showElement.call(this, nextStep);
    }
    /**
     * Returns the current step of the intro
     *
     * @returns {number | boolean}
     */

    function currentStep() {
        return this._currentStep;
    }

    /**
     * on keyCode:
     * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
     * This feature has been removed from the Web standards.
     * Though some browsers may still support it, it is in
     * the process of being dropped.
     * Instead, you should use KeyboardEvent.code,
     * if it's implemented.
     *
     * jQuery's approach is to test for
     *   (1) e.which, then
     *   (2) e.charCode, then
     *   (3) e.keyCode
     * https://github.com/jquery/jquery/blob/a6b0705294d336ae2f63f7276de0da1195495363/src/event.js#L638
     *
     * @param type var
     * @return type
     */

    function onKeyDown(e) {
        let code = e.code === undefined ? e.which : e.code; // if e.which is null

        if (code === null) {
            code = e.charCode === null ? e.keyCode : e.charCode;
        }

        if ((code === "Escape" || code === 27) && this._options.exitOnEsc === true) {
            //escape key pressed, exit the intro
            //check if exit callback is defined
            exitIntro.call(this, this._targetElement);
        } else if (code === "ArrowLeft" || code === 37) {
            //left arrow
            previousStep.call(this);
        } else if (code === "ArrowRight" || code === 39) {
            //right arrow
            nextStep.call(this);
        } else if (code === "Enter" || code === "NumpadEnter" || code === 13) {
            //srcElement === ie
            let target = e.target || e.srcElement;

            if (target && target.className.match("introjs-prevbutton")) {
                //user hit enter while focusing on previous button
                previousStep.call(this);
            } else if (target && target.className.match("introjs-skipbutton")) {
                //user hit enter while focusing on skip button
                if (this._introItems.length - 1 === this._currentStep && typeof this._introCompleteCallback === "function") {
                    this._introCompleteCallback.call(this, this._currentStep, "skip");
                }

                exitIntro.call(this, this._targetElement);
            } else if (target && target.getAttribute("data-stepnumber")) {
                // user hit enter while focusing on step bullet
                target.click();
            } else {
                //default behavior for responding to enter
                nextStep.call(this);
            } //prevent default behaviour on hitting Enter, to prevent steps being skipped in some browsers

            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        }
    }

    /*
     * makes a copy of the object
     * @api private
     * @method _cloneObject
     */
    function cloneObject(object) {
        if (object === null || _typeof(object) !== "object" || typeof object.nodeType !== "undefined") {
            return object;
        }

        let temp = {};

        for (let key in object) {
            if (typeof window.jQuery !== "undefined" && object[key] instanceof window.jQuery) {
                temp[key] = object[key];
            } else {
                temp[key] = cloneObject(object[key]);
            }
        }

        return temp;
    }

    function debounce(func, timeout) {
        let _this = this;

        let timer;
        return function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            clearTimeout(timer);
            timer = setTimeout(function () {
                func.apply(_this, args);
            }, timeout);
        };
    }

    /**
     * Get a queryselector within the hint wrapper
     *
     * @param {String} selector
     * @return {NodeList|Array}
     */

    function hintQuerySelectorAll(selector) {
        let hintsWrapper = document.querySelector(".introjs-hints");
        return hintsWrapper ? hintsWrapper.querySelectorAll(selector) : [];
    }
    /**
     * Hide a hint
     *
     * @api private
     * @method hideHint
     */

    function hideHint(stepId) {
        let hint = hintQuerySelectorAll(".introjs-hint[data-step=\"".concat(stepId, "\"]"))[0];
        removeHintTooltip.call(this);

        if (hint) {
            addClass(hint, "introjs-hidehint");
        } // call the callback function (if any)

        if (typeof this._hintCloseCallback !== "undefined") {
            this._hintCloseCallback.call(this, stepId);
        }
    }
    /**
     * Hide all hints
     *
     * @api private
     * @method hideHints
     */

    function hideHints() {
        let _this = this;

        let hints = hintQuerySelectorAll(".introjs-hint");
        forEach(hints, function (hint) {
            hideHint.call(_this, hint.getAttribute("data-step"));
        });
    }
    /**
     * Show all hints
     *
     * @api private
     * @method _showHints
     */

    function showHints() {
        let _this2 = this;

        let hints = hintQuerySelectorAll(".introjs-hint");

        if (hints && hints.length) {
            forEach(hints, function (hint) {
                showHint.call(_this2, hint.getAttribute("data-step"));
            });
        } else {
            populateHints.call(this, this._targetElement);
        }
    }
    /**
     * Show a hint
     *
     * @api private
     * @method showHint
     */

    function showHint(stepId) {
        let hint = hintQuerySelectorAll(".introjs-hint[data-step=\"".concat(stepId, "\"]"))[0];

        if (hint) {
            removeClass(hint, /introjs-hidehint/g);
        }
    }
    /**
     * Removes all hint elements on the page
     * Useful when you want to destroy the elements and add them again (e.g. a modal or popup)
     *
     * @api private
     * @method removeHints
     */

    function removeHints() {
        let _this3 = this;

        let hints = hintQuerySelectorAll(".introjs-hint");
        forEach(hints, function (hint) {
            removeHint.call(_this3, hint.getAttribute("data-step"));
        });
        DOMEvent.off(document, "click", removeHintTooltip, this, false);
        DOMEvent.off(window, "resize", reAlignHints, this, true);
        if (this._hintsAutoRefreshFunction) DOMEvent.off(window, "scroll", this._hintsAutoRefreshFunction, this, true);
    }
    /**
     * Remove one single hint element from the page
     * Useful when you want to destroy the element and add them again (e.g. a modal or popup)
     * Use removeHints if you want to remove all elements.
     *
     * @api private
     * @method removeHint
     */

    function removeHint(stepId) {
        let hint = hintQuerySelectorAll(".introjs-hint[data-step=\"".concat(stepId, "\"]"))[0];

        if (hint) {
            hint.parentNode.removeChild(hint);
        }
    }
    /**
     * Add all available hints to the page
     *
     * @api private
     * @method addHints
     */

    function addHints() {
        let _this4 = this;

        let self = this;
        let hintsWrapper = document.querySelector(".introjs-hints");

        if (hintsWrapper === null) {
            hintsWrapper = _createElement("div", {
                className: "introjs-hints"
            });
        }
        /**
       * Returns an event handler unique to the hint iteration
       *
       * @param {Integer} i
       * @return {Function}
       */

        let getHintClick = function getHintClick(i) {
            return function (e) {
                let evt = e ? e : window.event;

                if (evt.stopPropagation) {
                    evt.stopPropagation();
                }

                if (evt.cancelBubble !== null) {
                    evt.cancelBubble = true;
                }

                showHintDialog.call(self, i);
            };
        };

        forEach(this._introItems, function (item, i) {
            // avoid append a hint twice
            if (document.querySelector(".introjs-hint[data-step=\"".concat(i, "\"]"))) {
                return;
            }

            let hint = _createElement("a", {
                className: "introjs-hint"
            });
            setAnchorAsButton(hint);
            hint.onclick = getHintClick(i);

            if (!item.hintAnimation) {
                addClass(hint, "introjs-hint-no-anim");
            } // hint's position should be fixed if the target element's position is fixed

            if (isFixed(item.element)) {
                addClass(hint, "introjs-fixedhint");
            }

            let hintDot = _createElement("div", {
                className: "introjs-hint-dot"
            });
            let hintPulse = _createElement("div", {
                className: "introjs-hint-pulse"
            });
            hint.appendChild(hintDot);
            hint.appendChild(hintPulse);
            hint.setAttribute("data-step", i); // we swap the hint element with target element
            // because _setHelperLayerPosition uses `element` property

            item.targetElement = item.element;
            item.element = hint; // align the hint position

            alignHintPosition.call(_this4, item.hintPosition, hint, item.targetElement);
            hintsWrapper.appendChild(hint);
        }); // adding the hints wrapper

        document.body.appendChild(hintsWrapper); // call the callback function (if any)

        if (typeof this._hintsAddedCallback !== "undefined") {
            this._hintsAddedCallback.call(this);
        }

        if (this._options.hintAutoRefreshInterval >= 0) {
            this._hintsAutoRefreshFunction = debounce(function () {
                return reAlignHints.call(_this4);
            }, this._options.hintAutoRefreshInterval);
            DOMEvent.on(window, "scroll", this._hintsAutoRefreshFunction, this, true);
        }
    }
    /**
     * Aligns hint position
     *
     * @api private
     * @method alignHintPosition
     * @param {String} position
     * @param {Object} hint
     * @param {Object} element
     */

    function alignHintPosition(position, _ref, element) {
        let style = _ref.style;
        // get/calculate offset of target element
        let offset = getOffset.call(this, element);
        let iconWidth = 20;
        let iconHeight = 20; // align the hint element

        switch (position) {
            default:
            case "top-left":
                style.left = "".concat(offset.left, "px");
                style.top = "".concat(offset.top, "px");
                break;

            case "top-right":
                style.left = "".concat(offset.left + offset.width - iconWidth, "px");
                style.top = "".concat(offset.top, "px");
                break;

            case "bottom-left":
                style.left = "".concat(offset.left, "px");
                style.top = "".concat(offset.top + offset.height - iconHeight, "px");
                break;

            case "bottom-right":
                style.left = "".concat(offset.left + offset.width - iconWidth, "px");
                style.top = "".concat(offset.top + offset.height - iconHeight, "px");
                break;

            case "middle-left":
                style.left = "".concat(offset.left, "px");
                style.top = "".concat(offset.top + (offset.height - iconHeight) / 2, "px");
                break;

            case "middle-right":
                style.left = "".concat(offset.left + offset.width - iconWidth, "px");
                style.top = "".concat(offset.top + (offset.height - iconHeight) / 2, "px");
                break;

            case "middle-middle":
                style.left = "".concat(offset.left + (offset.width - iconWidth) / 2, "px");
                style.top = "".concat(offset.top + (offset.height - iconHeight) / 2, "px");
                break;

            case "bottom-middle":
                style.left = "".concat(offset.left + (offset.width - iconWidth) / 2, "px");
                style.top = "".concat(offset.top + offset.height - iconHeight, "px");
                break;

            case "top-middle":
                style.left = "".concat(offset.left + (offset.width - iconWidth) / 2, "px");
                style.top = "".concat(offset.top, "px");
                break;
        }
    }
    /**
     * Triggers when user clicks on the hint element
     *
     * @api private
     * @method _showHintDialog
     * @param {Number} stepId
     */

    function showHintDialog(stepId) {
        let hintElement = document.querySelector(".introjs-hint[data-step=\"".concat(stepId, "\"]"));
        let item = this._introItems[stepId]; // call the callback function (if any)

        if (typeof this._hintClickCallback !== "undefined") {
            this._hintClickCallback.call(this, hintElement, item, stepId);
        } // remove all open tooltips

        let removedStep = removeHintTooltip.call(this); // to toggle the tooltip

        if (parseInt(removedStep, 10) === stepId) {
            return;
        }

        let tooltipLayer = _createElement("div", {
            className: "introjs-tooltip"
        });
        let tooltipTextLayer = _createElement("div");
        let arrowLayer = _createElement("div");
        let referenceLayer = _createElement("div");

        tooltipLayer.onclick = function (e) {
            //IE9 & Other Browsers
            if (e.stopPropagation) {
                e.stopPropagation();
            } //IE8 and Lower
            else {
                e.cancelBubble = true;
            }
        };

        tooltipTextLayer.className = "introjs-tooltiptext";
        let tooltipWrapper = _createElement("p");
        tooltipWrapper.innerHTML = item.hint;
        tooltipTextLayer.appendChild(tooltipWrapper);

        if (this._options.hintShowButton) {
            let closeButton = _createElement("a");
            closeButton.className = this._options.buttonClass;
            closeButton.setAttribute("role", "button");
            closeButton.innerHTML = this._options.hintButtonLabel;
            closeButton.onclick = hideHint.bind(this, stepId);
            tooltipTextLayer.appendChild(closeButton);
        }

        arrowLayer.className = "introjs-arrow";
        tooltipLayer.appendChild(arrowLayer);
        tooltipLayer.appendChild(tooltipTextLayer); // set current step for _placeTooltip function

        this._currentStep = hintElement.getAttribute("data-step"); // align reference layer position

        referenceLayer.className = "introjs-tooltipReferenceLayer introjs-hintReference";
        referenceLayer.setAttribute("data-step", hintElement.getAttribute("data-step"));
        setHelperLayerPosition.call(this, referenceLayer);
        referenceLayer.appendChild(tooltipLayer);
        document.body.appendChild(referenceLayer); //set proper position

        placeTooltip.call(this, hintElement, tooltipLayer, arrowLayer, true);
    }
    /**
     * Removes open hint (tooltip hint)
     *
     * @api private
     * @method _removeHintTooltip
     */

    function removeHintTooltip() {
        let tooltip = document.querySelector(".introjs-hintReference");

        if (tooltip) {
            let step = tooltip.getAttribute("data-step");
            tooltip.parentNode.removeChild(tooltip);
            return step;
        }
    }
    /**
     * Start parsing hint items
     *
     * @api private
     * @param {Object} targetElm
     * @method _startHint
     */

    function populateHints(targetElm) {
        let _this5 = this;

        this._introItems = [];

        if (this._options.hints) {
            forEach(this._options.hints, function (hint) {
                let currentItem = cloneObject(hint);

                if (typeof currentItem.element === "string") {
                    //grab the element with given selector from the page
                    currentItem.element = document.querySelector(currentItem.element);
                }

                currentItem.hintPosition = currentItem.hintPosition || _this5._options.hintPosition;
                currentItem.hintAnimation = currentItem.hintAnimation || _this5._options.hintAnimation;

                if (currentItem.element !== null) {
                    _this5._introItems.push(currentItem);
                }
            });
        } else {
            let hints = targetElm.querySelectorAll("*[data-hint]");

            if (!hints || !hints.length) {
                return false;
            } //first add intro items with data-step

            forEach(hints, function (currentElement) {
                // hint animation
                let hintAnimation = currentElement.getAttribute("data-hintanimation");

                if (hintAnimation) {
                    hintAnimation = hintAnimation === "true";
                } else {
                    hintAnimation = _this5._options.hintAnimation;
                }

                _this5._introItems.push({
                    element: currentElement,
                    hint: currentElement.getAttribute("data-hint"),
                    hintPosition: currentElement.getAttribute("data-hintposition") || _this5._options.hintPosition,
                    hintAnimation: hintAnimation,
                    tooltipClass: currentElement.getAttribute("data-tooltipclass"),
                    position: currentElement.getAttribute("data-position") || _this5._options.tooltipPosition
                });
            });
        }

        addHints.call(this);
        DOMEvent.on(document, "click", removeHintTooltip, this, false);
        DOMEvent.on(window, "resize", reAlignHints, this, true);
    }
    /**
     * Re-aligns all hint elements
     *
     * @api private
     * @method _reAlignHints
     */

    function reAlignHints() {
        let _this6 = this;

        forEach(this._introItems, function (_ref2) {
            let targetElement = _ref2.targetElement,
                hintPosition = _ref2.hintPosition,
                element = _ref2.element;

            if (typeof targetElement === "undefined") {
                return;
            }

            alignHintPosition.call(_this6, hintPosition, element, targetElement);
        });
    }

    let floor = Math.floor;

    var mergeSort = function (array, comparefn) {
        let length = array.length;
        let middle = floor(length / 2);
        return length < 8 ? insertionSort(array, comparefn) : merge(
            array,
            mergeSort(arraySlice(array, 0, middle), comparefn),
            mergeSort(arraySlice(array, middle), comparefn),
            comparefn
        );
    };

    var insertionSort = function (array, comparefn) {
        let length = array.length;
        let i = 1;
        let element, j;

        while (i < length) {
            j = i;
            element = array[i];
            while (j && comparefn(array[j - 1], element) > 0) {
                array[j] = array[--j];
            }
            if (j !== i++) array[j] = element;
        } return array;
    };

    var merge = function (array, left, right, comparefn) {
        let llength = left.length;
        let rlength = right.length;
        let lindex = 0;
        let rindex = 0;

        while (lindex < llength || rindex < rlength) {
            array[lindex + rindex] = (lindex < llength && rindex < rlength)
                ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
                : lindex < llength ? left[lindex++] : right[rindex++];
        } return array;
    };

    let arraySort = mergeSort;

    let firefox = engineUserAgent.match(/firefox\/(\d+)/i);

    let engineFfVersion = !!firefox && +firefox[1];

    let engineIsIeOrEdge = /MSIE|Trident/.test(engineUserAgent);

    let webkit = engineUserAgent.match(/AppleWebKit\/(\d+)\./);

    let engineWebkitVersion = !!webkit && +webkit[1];

    let test = [];
    let un$Sort = functionUncurryThis(test.sort);
    let push = functionUncurryThis(test.push);

    // IE8-
    let FAILS_ON_UNDEFINED = fails(function () {
        test.sort(undefined);
    });
    // V8 bug
    let FAILS_ON_NULL = fails(function () {
        test.sort(null);
    });
    // Old WebKit
    let STRICT_METHOD = arrayMethodIsStrict('sort');

    let STABLE_SORT = !fails(function () {
        // feature detection can be too slow, so check engines versions
        if (engineV8Version) return engineV8Version < 70;
        if (engineFfVersion && engineFfVersion > 3) return;
        if (engineIsIeOrEdge) return true;
        if (engineWebkitVersion) return engineWebkitVersion < 603;

        let result = '';
        let code, chr, value, index;

        // generate an array with more 512 elements (Chakra and old V8 fails only in this case)
        for (code = 65; code < 76; code++) {
            chr = String.fromCharCode(code);

            switch (code) {
                case 66: case 69: case 70: case 72: value = 3; break;
                case 68: case 71: value = 4; break;
                default: value = 2;
            }

            for (index = 0; index < 47; index++) {
                test.push({ k: chr + index, v: value });
            }
        }

        test.sort(function (a, b) { return b.v - a.v; });

        for (index = 0; index < test.length; index++) {
            chr = test[index].k.charAt(0);
            if (result.charAt(result.length - 1) !== chr) result += chr;
        }

        return result !== 'DGBEFHACIJK';
    });

    let FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD || !STABLE_SORT;

    let getSortCompare = function (comparefn) {
        return function (x, y) {
            if (y === undefined) return -1;
            if (x === undefined) return 1;
            if (comparefn !== undefined) return +comparefn(x, y) || 0;
            return toString_1(x) > toString_1(y) ? 1 : -1;
        };
    };

    // `Array.prototype.sort` method
    // https://tc39.es/ecma262/#sec-array.prototype.sort
    _export({ target: 'Array', proto: true, forced: FORCED }, {
        sort: function sort(comparefn) {
            if (comparefn !== undefined) aCallable(comparefn);

            let array = toObject(this);

            if (STABLE_SORT) return comparefn === undefined ? un$Sort(array) : un$Sort(array, comparefn);

            let items = [];
            let arrayLength = lengthOfArrayLike(array);
            let itemsLength, index;

            for (index = 0; index < arrayLength; index++) {
                if (index in array) push(items, array[index]);
            }

            arraySort(items, getSortCompare(comparefn));

            itemsLength = items.length;
            index = 0;

            while (index < itemsLength) array[index] = items[index++];
            while (index < arrayLength) delete array[index++];

            return array;
        }
    });

    /**
     * Finds all Intro steps from the data-* attributes and the options.steps array
     *
     * @api private
     * @param targetElm
     * @returns {[]}
     */

    function fetchIntroSteps(targetElm) {
        let _this = this;
        let allIntroSteps = targetElm.querySelectorAll("*[data-intro]");
        let introItems = [];
        if (this._options.steps) {
            //use steps passed programmatically
            forEach(this._options.steps, function (step) {
                let currentItem = cloneObject(step); //set the step

                currentItem.step = introItems.length + 1;
                currentItem.title = currentItem.title || ""; //use querySelector function only when developer used CSS selector

                if (typeof currentItem.element === "string") {
                    //grab the element with given selector from the page
                    currentItem.element = document.querySelector(currentItem.element);
                } //intro without element

                if (typeof currentItem.element === "undefined" || currentItem.element === null) {
                    let floatingElementQuery = document.querySelector(".introjsFloatingElement");

                    if (floatingElementQuery === null) {
                        floatingElementQuery = _createElement("div", {
                            className: "introjsFloatingElement"
                        });
                        document.body.appendChild(floatingElementQuery);
                    }

                    currentItem.element = floatingElementQuery;
                    currentItem.position = "floating";
                }

                currentItem.position = currentItem.position || _this._options.tooltipPosition;
                currentItem.scrollTo = currentItem.scrollTo || _this._options.scrollTo;

                if (typeof currentItem.disableInteraction === "undefined") {
                    currentItem.disableInteraction = _this._options.disableInteraction;
                }

                if (currentItem.element !== null) {
                    introItems.push(currentItem);
                }
            });
        } else {
            //use steps from data-* annotations
            let elmsLength = allIntroSteps.length;
            let disableInteraction; //if there's no element to intro

            if (elmsLength < 1) {
                return [];
            }

            forEach(allIntroSteps, function (currentElement) {
                // start intro for groups of elements
                if (_this._options.group && currentElement.getAttribute("data-intro-group") !== _this._options.group) {
                    return;
                } // skip hidden elements

                if (currentElement.style.display === "none") {
                    return;
                }

                let step = parseInt(currentElement.getAttribute("data-step"), 10);

                if (currentElement.hasAttribute("data-disable-interaction")) {
                    disableInteraction = !!currentElement.getAttribute("data-disable-interaction");
                } else {
                    disableInteraction = _this._options.disableInteraction;
                }

                if (step > 0) {
                    introItems[step - 1] = {
                        element: currentElement,
                        title: currentElement.getAttribute("data-title") || "",
                        intro: currentElement.getAttribute("data-intro"),
                        step: parseInt(currentElement.getAttribute("data-step"), 10),
                        tooltipClass: currentElement.getAttribute("data-tooltipclass"),
                        highlightClass: currentElement.getAttribute("data-highlightclass"),
                        position: currentElement.getAttribute("data-position") || _this._options.tooltipPosition,
                        scrollTo: currentElement.getAttribute("data-scrollto") || _this._options.scrollTo,
                        disableInteraction: disableInteraction
                    };
                }
            }); //next add intro items without data-step
            //todo: we need a cleanup here, two loops are redundant

            let nextStep = 0;
            forEach(allIntroSteps, function (currentElement) {
                // start intro for groups of elements
                if (_this._options.group && currentElement.getAttribute("data-intro-group") !== _this._options.group) {
                    return;
                }

                if (currentElement.getAttribute("data-step") === null) {
                    while (true) {
                        if (typeof introItems[nextStep] === "undefined") {
                            break;
                        } else {
                            nextStep++;
                        }
                    }

                    if (currentElement.hasAttribute("data-disable-interaction")) {
                        disableInteraction = !!currentElement.getAttribute("data-disable-interaction");
                    } else {
                        disableInteraction = _this._options.disableInteraction;
                    }

                    introItems[nextStep] = {
                        element: currentElement,
                        title: currentElement.getAttribute("data-title") || "",
                        intro: currentElement.getAttribute("data-intro"),
                        step: nextStep + 1,
                        tooltipClass: currentElement.getAttribute("data-tooltipclass"),
                        highlightClass: currentElement.getAttribute("data-highlightclass"),
                        position: currentElement.getAttribute("data-position") || _this._options.tooltipPosition,
                        scrollTo: currentElement.getAttribute("data-scrollto") || _this._options.scrollTo,
                        disableInteraction: disableInteraction
                    };
                }
            });
        } //removing undefined/null elements

        let tempIntroItems = [];

        for (let z = 0; z < introItems.length; z++) {
            if (introItems[z]) {
                // copy non-falsy values to the end of the array
                tempIntroItems.push(introItems[z]);
            }
        }

        introItems = tempIntroItems; //Ok, sort all items with given steps

        introItems.sort(function (a, b) {
            return a.step - b.step;
        });
        return introItems;
    }

    /**
     * Update placement of the intro objects on the screen
     * @api private
     * @param {boolean} refreshSteps to refresh the intro steps as well
     */

    function refresh(refreshSteps) {
        let referenceLayer = document.querySelector(".introjs-tooltipReferenceLayer");
        let helperLayer = document.querySelector(".introjs-helperLayer");
        let disableInteractionLayer = document.querySelector(".introjs-disableInteraction"); // re-align intros

        setHelperLayerPosition.call(this, helperLayer);
        setHelperLayerPosition.call(this, referenceLayer);
        setHelperLayerPosition.call(this, disableInteractionLayer);

        if (refreshSteps) {
            this._introItems = fetchIntroSteps.call(this, this._targetElement);

            _recreateBullets.call(this, referenceLayer, this._introItems[this._currentStep]);

            _updateProgressBar.call(this, referenceLayer);
        } // re-align tooltip

        if (this._currentStep !== undefined && this._currentStep !== null) {
            let oldArrowLayer = document.querySelector(".introjs-arrow");
            let oldtooltipContainer = document.querySelector(".introjs-tooltip");

            if (oldtooltipContainer && oldArrowLayer) {
                placeTooltip.call(this, this._introItems[this._currentStep].element, oldtooltipContainer, oldArrowLayer);
            }
        } //re-align hints

        reAlignHints.call(this);
        return this;
    }

    function onResize() {
        refresh.call(this);
    }

    /**
     * Removes `element` from `parentElement`
     *
     * @param {Element} element
     * @param {Boolean} [animate=false]
     */

    function removeChild(element, animate) {
        if (!element || !element.parentElement) return;
        let parentElement = element.parentElement;

        if (animate) {
            setStyle(element, {
                opacity: "0"
            });
            window.setTimeout(function () {
                try {
                    // removeChild(..) throws an exception if the child has already been removed (https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild)
                    // this try-catch is added to make sure this function doesn't throw an exception if the child has been removed
                    // this scenario can happen when start()/exit() is called multiple times and the helperLayer is removed by the
                    // previous exit() call (note: this is a timeout)
                    parentElement.removeChild(element);
                } catch (e) { }
            }, 500);
        } else {
            parentElement.removeChild(element);
        }
    }

    /**
     * Exit from intro
     *
     * @api private
     * @method _exitIntro
     * @param {Object} targetElement
     * @param {Boolean} force - Setting to `true` will skip the result of beforeExit callback
     */

    function exitIntro(targetElement, force) {
        let continueExit = true; // calling onbeforeexit callback
        //
        // If this callback return `false`, it would halt the process

        if (this._introBeforeExitCallback !== undefined) {
            continueExit = this._introBeforeExitCallback.call(this);
        } // skip this check if `force` parameter is `true`
        // otherwise, if `onbeforeexit` returned `false`, don't exit the intro

        if (!force && continueExit === false) return; // remove overlay layers from the page

        let overlayLayers = targetElement.querySelectorAll(".introjs-overlay");

        if (overlayLayers && overlayLayers.length) {
            forEach(overlayLayers, function (overlayLayer) {
                return removeChild(overlayLayer);
            });
        } //remove all helper layers

        let helperLayer = targetElement.querySelector(".introjs-helperLayer");
        removeChild(helperLayer, true);
        let referenceLayer = targetElement.querySelector(".introjs-tooltipReferenceLayer");
        removeChild(referenceLayer); //remove disableInteractionLayer

        let disableInteractionLayer = targetElement.querySelector(".introjs-disableInteraction");
        removeChild(disableInteractionLayer); //remove intro floating element

        let floatingElement = document.querySelector(".introjsFloatingElement");
        removeChild(floatingElement);
        removeShowElement(); //clean listeners

        DOMEvent.off(window, "keydown", onKeyDown, this, true);
        DOMEvent.off(window, "resize", onResize, this, true); //check if any callback is defined

        if (this._introExitCallback !== undefined) {
            this._introExitCallback.call(this);
        } //set the step to zero

        this._currentStep = undefined;
    }

    /**
     * Add overlay layer to the page
     *
     * @api private
     * @method _addOverlayLayer
     * @param {Object} targetElm
     */

    function addOverlayLayer(targetElm) {
        let _this = this;

        let overlayLayer = _createElement("div", {
            className: "introjs-overlay"
        });
        setStyle(overlayLayer, {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            position: "fixed"
        });
        targetElm.appendChild(overlayLayer);

        if (this._options.exitOnOverlayClick === true) {
            setStyle(overlayLayer, {
                cursor: "pointer"
            });

            overlayLayer.onclick = function () {
                exitIntro.call(_this, targetElm);
            };
        }

        return true;
    }

    /**
     * Initiate a new introduction/guide from an element in the page
     *
     * @api private
     * @method introForElement
     * @param {Object} targetElm
     * @returns {Boolean} Success or not?
     */

    function introForElement(targetElm) {
        if (this._introStartCallback !== undefined) {
            this._introStartCallback.call(this, targetElm);
        } //set it to the introJs object

        let steps = fetchIntroSteps.call(this, targetElm);

        if (steps.length === 0) {
            return false;
        }

        this._introItems = steps; //add overlay layer to the page

        if (addOverlayLayer.call(this, targetElm)) {
            //then, start the show
            nextStep.call(this);

            if (this._options.keyboardNavigation) {
                DOMEvent.on(window, "keydown", onKeyDown, this, true);
            } //for window resize

            DOMEvent.on(window, "resize", onResize, this, true);
        }

        return false;
    }

    let version = "4.3.0";

    /**
     * IntroJs main class
     *
     * @class IntroJs
     */

    function IntroJs(obj) {
        this._targetElement = obj;
        this._introItems = [];
        this._options = {
            /* Next button label in tooltip box */
            nextLabel: "p",

            /* Previous button label in tooltip box */
            prevLabel: "o",

            /* Skip button label in tooltip box */
            //When changing, kindly change at onlick function related to this button
            skipLabel: "f",

            /* Done button label in tooltip box */
            doneLabel: "Finish",

            /* Hide previous button in the first step? Otherwise, it will be disabled button. */
            hidePrev: true,

            /* Hide next button in the last step? Otherwise, it will be disabled button (note: this will also hide the "Done" button) */
            hideNext: false,

            /* Change the Next button to Done in the last step of the intro? otherwise, it will render a disabled button */
            nextToDone: true,

            /* Default tooltip box position */
            tooltipPosition: "bottom",

            /* Next CSS class for tooltip boxes */
            tooltipClass: "",

            /* Start intro for a group of elements */
            group: "",

            /* CSS class that is added to the helperLayer */
            highlightClass: "",

            /* Close introduction when pressing Escape button? */
            exitOnEsc: true,

            /* Close introduction when clicking on overlay layer? */
            exitOnOverlayClick: true,

            /* Show step numbers in introduction? */
            showStepNumbers: true,

            /* Let user use keyboard to navigate the tour? */
            keyboardNavigation: true,

            /* Show tour control buttons? */
            showButtons: true,

            /* Show tour bullets? */
            showBullets: false,

            /* Show tour progress? */
            showProgress: false,

            /* Scroll to highlighted element? */
            scrollToElement: true,

            /*
         * Should we scroll the tooltip or target element?
         *
         * Options are: 'element' or 'tooltip'
         */
            scrollTo: "element",

            /* Padding to add after scrolling when element is not in the viewport (in pixels) */
            scrollPadding: 30,

            /* Set the overlay opacity */
            overlayOpacity: 0.6,

            /* To determine the tooltip position automatically based on the window.width/height */
            autoPosition: true,

            /* Precedence of positions, when auto is enabled */
            positionPrecedence: ["bottom", "top", "right", "left"],

            /* Disable an interaction with element? */
            disableInteraction: false,

            /* Set how much padding to be used around helper element */
            helperElementPadding: 10,

            /* Default hint position */
            hintPosition: "top-middle",

            /* Hint button label */
            hintButtonLabel: "Got it",

            /* Display the "Got it" button? */
            hintShowButton: true,

            /* Hints auto-refresh interval in ms (set to -1 to disable) */
            hintAutoRefreshInterval: 10,

            /* Adding animation to hints? */
            hintAnimation: true,

            /* additional classes to put on the buttons */
            buttonClass: "introjs-button",

            /* additional classes to put on progress bar */
            progressBarAdditionalClass: false
        };
    }

    let introJs = function introJs(targetElm) {
        let instance;

        if (_typeof(targetElm) === "object") {
            //Ok, create a new instance
            instance = new IntroJs(targetElm);
        } else if (typeof targetElm === "string") {
            //select the target element with query selector
            let targetElement = document.querySelector(targetElm);

            if (targetElement) {
                instance = new IntroJs(targetElement);
            } else {
                throw new Error("There is no element with given selector.");
            }
        } else {
            instance = new IntroJs(document.body);
        } // add instance to list of _instances
        // passing group to stamp to increment
        // from 0 onward somewhat reliably

        introJs.instances[stamp(instance, "introjs-instance")] = instance;
        return instance;
    };
    /**
     * Current IntroJs version
     *
     * @property version
     * @type String
     */

    introJs.version = version;
    /**
     * key-val object helper for introJs instances
     *
     * @property instances
     * @type Object
     */

    introJs.instances = {}; //Prototype

    introJs.fn = IntroJs.prototype = {
        clone: function clone() {
            return new IntroJs(this);
        },
        setOption: function setOption(option, value) {
            this._options[option] = value;
            return this;
        },
        setOptions: function setOptions(options) {
            this._options = mergeOptions(this._options, options);
            return this;
        },
        start: function start() {
            introForElement.call(this, this._targetElement);
            return this;
        },
        goToStep: function goToStep$1(step) {
            goToStep.call(this, step);

            return this;
        },
        addStep: function addStep(options) {
            if (!this._options.steps) {
                this._options.steps = [];
            }

            this._options.steps.push(options);

            return this;
        },
        addSteps: function addSteps(steps) {
            if (!steps.length) return;

            for (let index = 0; index < steps.length; index++) {
                this.addStep(steps[index]);
            }

            return this;
        },
        goToStepNumber: function goToStepNumber$1(step) {
            goToStepNumber.call(this, step);

            return this;
        },
        nextStep: function nextStep$1() {
            nextStep.call(this);

            return this;
        },
        previousStep: function previousStep$1() {
            previousStep.call(this);

            return this;
        },
        currentStep: function currentStep$1() {
            return currentStep.call(this);
        },
        exit: function exit(force) {
            exitIntro.call(this, this._targetElement, force);
            return this;
        },
        refresh: function refresh$1(refreshSteps) {
            refresh.call(this, refreshSteps);

            return this;
        },
        onbeforechange: function onbeforechange(providedCallback) {
            if (typeof providedCallback === "function") {
                this._introBeforeChangeCallback = providedCallback;
            } else {
                throw new Error("Provided callback for onbeforechange was not a function");
            }

            return this;
        },
        onchange: function onchange(providedCallback) {
            if (typeof providedCallback === "function") {
                this._introChangeCallback = providedCallback;
            } else {
                throw new Error("Provided callback for onchange was not a function.");
            }

            return this;
        },
        onafterchange: function onafterchange(providedCallback) {
            if (typeof providedCallback === "function") {
                this._introAfterChangeCallback = providedCallback;
            } else {
                throw new Error("Provided callback for onafterchange was not a function");
            }

            return this;
        },
        oncomplete: function oncomplete(providedCallback) {
            if (typeof providedCallback === "function") {
                this._introCompleteCallback = providedCallback;
            } else {
                throw new Error("Provided callback for oncomplete was not a function.");
            }

            return this;
        },
        onhintsadded: function onhintsadded(providedCallback) {
            if (typeof providedCallback === "function") {
                this._hintsAddedCallback = providedCallback;
            } else {
                throw new Error("Provided callback for onhintsadded was not a function.");
            }

            return this;
        },
        onhintclick: function onhintclick(providedCallback) {
            if (typeof providedCallback === "function") {
                this._hintClickCallback = providedCallback;
            } else {
                throw new Error("Provided callback for onhintclick was not a function.");
            }

            return this;
        },
        onhintclose: function onhintclose(providedCallback) {
            if (typeof providedCallback === "function") {
                this._hintCloseCallback = providedCallback;
            } else {
                throw new Error("Provided callback for onhintclose was not a function.");
            }

            return this;
        },
        onstart: function onstart(providedCallback) {
            if (typeof providedCallback === "function") {
                this._introStartCallback = providedCallback;
            } else {
                throw new Error("Provided callback for onstart was not a function.");
            }

            return this;
        },
        onexit: function onexit(providedCallback) {
            if (typeof providedCallback === "function") {
                this._introExitCallback = providedCallback;
            } else {
                throw new Error("Provided callback for onexit was not a function.");
            }

            return this;
        },
        onskip: function onskip(providedCallback) {
            if (typeof providedCallback === "function") {
                this._introSkipCallback = providedCallback;
            } else {
                throw new Error("Provided callback for onskip was not a function.");
            }

            return this;
        },
        onbeforeexit: function onbeforeexit(providedCallback) {
            if (typeof providedCallback === "function") {
                this._introBeforeExitCallback = providedCallback;
            } else {
                throw new Error("Provided callback for onbeforeexit was not a function.");
            }

            return this;
        },
        addHints: function addHints() {
            populateHints.call(this, this._targetElement);
            return this;
        },
        hideHint: function hideHint$1(stepId) {
            hideHint.call(this, stepId);

            return this;
        },
        hideHints: function hideHints$1() {
            hideHints.call(this);

            return this;
        },
        showHint: function showHint$1(stepId) {
            showHint.call(this, stepId);

            return this;
        },
        showHints: function showHints$1() {
            showHints.call(this);

            return this;
        },
        removeHints: function removeHints$1() {
            removeHints.call(this);

            return this;
        },
        removeHint: function removeHint$1(stepId) {
            removeHint().call(this, stepId);

            return this;
        },
        showHintDialog: function showHintDialog$1(stepId) {
            showHintDialog.call(this, stepId);

            return this;
        }
    };

    return introJs;

}));