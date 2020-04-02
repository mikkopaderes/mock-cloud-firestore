const presets = [
  [
    '@babel/env',
    {
      targets: {
        node: '12.16.1',
      },
      useBuiltIns: 'usage',
      corejs: { version: 3, proposals: true },
    },
  ],
];

module.exports = { presets };
