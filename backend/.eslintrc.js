module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-console': 0,
    'arrow-parens': [2, "as-needed"],
    'quote-props': [2, "consistent-as-needed"],
    'quotes': [2, "single", {"avoidEscape": true, "allowTemplateLiterals": true}]
  },
};
