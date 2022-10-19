module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "react/prop-types": "off",

        "no-var": "error",
        "no-undefined": "error",
        "no-shadow": ["error",
            { "builtinGlobals": true, "hoist": "functions", "allow": [] }
        ],
        "no-empty-function": "error",
        "func-name-matching": "error",
        "max-params": ["error", 5],
        "no-mixed-operators": "error",
        "no-unneeded-ternary": "error",
        "no-multiple-empty-lines": ["error", { "max": 1 }],
        "constructor-super": "error",
        "no-duplicate-imports": "error",
        "jsx-quotes": ["error", "prefer-double"],
        "max-len": ["error", {
            "code": 120, "tabWidth": 4,
            "ignoreComments": true, "ignoreTrailingComments": true,
            "ignoreUrls": true,
            "ignorePattern": "^\\s*var\\s.+=\\s*require\\s*\\("
        }
        ],
        "max-lines": ["error",
            {
                "max": 2000,
                "skipComments": true, "skipBlankLines": true
            }
        ],
        "line-comment-position": ["error", { "position": "above" }],
        "id-denylist": ["error",
            "test", "cb", "callback", "onchange", "onselect", "onclick"
        ],
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "no-fallthrough": "error",
        "no-floating-decimal": "error",
        "no-implied-eval": "error",
        "no-loop-func": "error",
        "no-eq-null": "error",
        "default-case": ["error", { "commentPattern": "^skip\\sdefault" }],
        "default-case-last": "error",
        "default-param-last": ["error"],
        "no-else-return": "error",
        "consistent-return": "error",
        "no-template-curly-in-string": "error",
        "yoda": "error"

        // rules : https://eslint.org/docs/rules/
    },
    "ignorePatterns": ["/test.js"],
    "settings": {
        "react": {
            "version": "detect"
        }
    }
};
