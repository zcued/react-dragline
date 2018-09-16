module.exports = {
  "extends": "eslint-config-zcool",
  "parser": "babel-eslint",
  "rules": {
    "react/jsx-filename-extension": [2, { "extensions": [".js", ".jsx"] }]
  },
  "env": {
    "browser": true,
    "mocha": true,
  }
};
