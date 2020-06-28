module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: ['airbnb-base', 'rmmmp/base'],
  env: {
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
  overrides: [
    // Typescript files
    {
      files: ['ts_src/**/*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended'],
      settings: {
        'import/resolver': {
          node: {
            extensions: ['.mjs', '.js', '.json', '.ts'],
          },
        },
        'import/extensions': [
          '.js',
          '.mjs',
          '.ts',
        ],
      },
      rules: {
        'import/extensions': ['error', 'ignorePackages', {
          js: 'never',
          mjs: 'never',
          ts: 'never',
        }],
        'no-useless-constructor': 'off', // enforced by @typescript-eslint/no-useless-constructor
        semi: 'off', // enforced by @typescript-eslint/semi
      },
    },
  ],
};
