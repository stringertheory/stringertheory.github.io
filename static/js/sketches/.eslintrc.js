/* license for this code at /license.txt */

module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: "eslint:recommended",
  rules: {
    "no-unused-vars": [ "error", {
      varsIgnorePattern: "dummy",
      argsIgnorePattern: "dummy"
    } ],
    indent: [ "error", 2 ],
    "linebreak-style": [ "error", "unix" ],
    quotes: [ "error", "single" ],
    semi: [ "error", "always" ],
    "no-console": [ "error", {
      allow: [ "warn", "error" ]
    } ],
    "max-len": [ "error", {
      code: 88,
      ignoreComments: true
    } ]
  }
};
