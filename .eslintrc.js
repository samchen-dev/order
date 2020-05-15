module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],

  parserOptions: {
    parser: 'babel-eslint',
  },

  rules: {
    'object-curly-spacing': [
      0,
      'never'
    ],
    'max-len': [
      0,
      150,
      4
    ],
    'space-before-function-paren': 0,
    'no-tabs': 'off',
    indent: [
      'off',
      2
    ],
    'no-unused-vars': 'off',
    semi: [
      'off',
      'always'
    ],
    'comma-dangle': [
      2,
      'never'
    ],
    'arrow-parens': 0,
    'generator-star-spacing': 'off',
    'no-console': 'off',
    'no-debugger': 'off'
  },

  'extends': [
    'plugin:vue/essential',
    '@vue/airbnb'
  ]
}

