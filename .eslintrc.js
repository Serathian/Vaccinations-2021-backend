module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: 'airbnb',
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    semi: 'never',
  },
}
