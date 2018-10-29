import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default [
  // CommonJS
  {
    input: 'src/index.js',
    output: { file: 'lib/mock-cloud-firestore.js', format: 'cjs' },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  },

  // ES
  {
    input: 'src/index.js',
    output: { file: 'es/mock-cloud-firestore.js', format: 'es' },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  },

  // UMD
  {
    input: 'src/index.js',
    output: { file: 'dist/mock-cloud-firestore.js', format: 'umd', name: 'MockFirebase' },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  },
];
