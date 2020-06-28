import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default [
  // CommonJS (TS)
  {
    input: 'ts_src/index.ts',
    output: { file: 'ts_builds/lib/mock-cloud-firestore.js', format: 'cjs' },
    plugins: [
      resolve(),
      typescript(),
    ],
  },

  // ES (TS)
  {
    input: 'ts_src/index.ts',
    output: { file: 'ts_builds/es/mock-cloud-firestore.js', format: 'es' },
    plugins: [
      resolve(),
      typescript(),
    ],
  },

  // UMD (TS)
  {
    input: 'ts_src/index.ts',
    output: { file: 'ts_builds/dist/mock-cloud-firestore.js', format: 'umd', name: 'MockFirebase' },
    plugins: [
      resolve(),
      typescript(),
    ],
  },

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
