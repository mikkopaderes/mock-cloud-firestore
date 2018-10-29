const presets = [
  [
    '@babel/env',
    {
      targets: {
        node: '8.12.0',
      },
      useBuiltIns: 'usage',
    },
  ],
];

module.exports = { presets };
