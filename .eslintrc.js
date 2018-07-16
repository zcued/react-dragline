module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",

  "rules": {
    "no-console": 0,
    'arrow-parens': 0,
    "jsx-quotes": [
      "error",
      "prefer-double"
    ],
    "semi": [
      "error",
      "never"
    ],
    'no-plusplus': 0,
    'no-underscore-dangle': [2, { 'allowAfterThis': true }],
    "react/prop-types": [2, { ignore: ['children'] }],
    "object-curly-newline": 0,
    "no-return-assign": 0,
    'react/no-multi-comp': 0,
    'react/jsx-filename-extension': [
      1, {
        "extensions": [".js", ".jsx"]
      }
    ],
    'import/no-extraneous-dependencies': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0
},
  "env": {
    "browser": true,
    "mocha": true,
  }
};
