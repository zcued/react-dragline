import pkg from './package.json'
// import typescript from '@rollup/plugin-typescript'
// import babel from 'rollup-plugin-babel'
// import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'


export default {
  input: 'src/index.ts',
  output: [
    {
        file: pkg.main,
        format: 'cjs',
    },
    {
        file: pkg.module,
        format: 'esm',
    },
  ],
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true,
    }),
  ],
}