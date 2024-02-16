module.exports = {
  root: true,
  'extends': [
    'plugin:vue/strongly-recommended',
    '@vue/standard'
  ],
  rules: {
    'vue/script-indent': ['error', 2, { 'baseIndent': 1 }],
    'no-debugger': 'off',
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    'no-undef': 'off',
    'eqeqeq': 'off',
    'no-var': 0,
    'one-var': 0,
    'no-tabs': 0,
    'camelcase': 0,
    'no-sequences': 0,
    'no-mixed-operators': 0,
    'no-unused-expressions': 0
  }
}
