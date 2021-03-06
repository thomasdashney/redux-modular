import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: {
    file: 'index.js',
    format: 'umd',
    name: 'reduxModular'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ],
  external: ['lodash.get']
}
