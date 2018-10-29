module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: ['airbnb-base', 'rmmmp/base'],
  env: {
    es6: true,
    node: true,
    qunit: true,
  },
  rules: {
    'require-jsdoc': 'off',
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',

    // FIXME: Ideally this should be turned on
    'import/no-cycle': 'off',
  },
};
