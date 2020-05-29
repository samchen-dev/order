module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: ['plugin:vue/essential', '@vue/airbnb'],

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 0,
    'Missing-trailing-comma' : 0,
    // 关闭语句强制分号结尾
    "semi": [0, "always"],
    //空行最多不能超过100行
    "no-multiple-empty-lines": [0, {"max": 150}],
    //关闭禁止混用tab和空格
    "no-mixed-spaces-and-tabs": [0],
    "comma-dangle": [0, "never"],
    "brace-style": [0, "1tbs"],
    'object-curly-newline': 0,
    "arrow-parens": 0,
    'max-len': ["error", {code : 150}],
    "consistent-return": 0,
    "no-restricted-syntax": 0
  },

  extends: ['plugin:vue/essential', '@vue/airbnb']
}
