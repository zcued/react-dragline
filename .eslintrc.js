module.exports = {
  extends: [
    "plugin:react/recommended"
  ],
  parser: "@typescript-eslint/parser",  // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2018,  // Allows for the parsing of modern ECMAScript features
    sourceType: "module",  // Allows for the use of imports
    ecmaFeatures: {
      jsx: true,  // Allows for the parsing of JSX
    },
  },
  plugins: [
    "react",
    "import",
  ],
  rules: {

    "no-console": "warn",

    "no-debugger": "error",

    "no-unused-vars": "error",

    "semi": ["warn", "never"],

    "quotes": ["warn", "single"],

    "no-multi-spaces": ["warn", { "ignoreEOLComments": true }],

    "no-trailing-spaces": "warn",

    "comma-dangle": ["warn", "always-multiline", { "functions": "never" }],

    "object-curly-spacing": ["warn", "always", { "objectsInObjects": false }],

    "jsx-quotes": ["warn", "prefer-double"],

    "space-before-function-paren": ["warn", "never"],

    "space-unary-ops": ['warn', { "words": true,"nonwords": false }],

    "space-infix-ops": ["warn", { "int32Hint": false }],

    "space-before-blocks": ["warn"],

    /** eslint-plugin-import */
    "import/newline-after-import": ["error", { "count": 2 }],

    /** eslint-plugin-react */
    "react/jsx-uses-react": "error",
  },
  settings: {
    react: {
      version: "detect",  // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
};