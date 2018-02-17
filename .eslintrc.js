module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    ecmaFeatures: {
      experimentalObjectRestSpread : true,
    },
    sourceType: 'module'
  },
  extends: ['rmmmp/base'],
  env: {
    es6: true,
    node: true,
    qunit: true,
  },
  rules: {
    // Remove rmmmp/base comma-dangle in functions since it's not
    // supported in Node.js 6.x
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'never',
    }],
    'require-jsdoc': 'off',
  },
};
