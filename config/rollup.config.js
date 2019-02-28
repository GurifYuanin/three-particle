// rollup.config.js
// commonjs
var common = require('./rollup.js');
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');

module.exports = {
  input: 'src/index.' + common.type,
  output: {
    file: 'dist/index.js',
    name: 'TP',
    format: 'iife',
    // When export and export default are not used at the same time, set legacy to true.
    // legacy: true,
    banner: common.banner,
    globals: {
      three: 'THREE'
    }
  },
  external: [
    'three'
  ],
  plugins: [
    common.getCompiler({
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          module: 'ES2015'
        }
      },
      useTsconfigDeclarationDir: true
    }),
    nodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      include: 'node_modules/**', // Default: undefined
      exclude: ['node_modules/foo/**', 'node_modules/bar/**'], // Default: undefined
      // these values can also be regular expressions
      // include: /node_modules/

      // search for files other than .js files (must already
      // be transpiled by a previous plugin!)
      extensions: ['.js', '.coffee'], // Default: [ '.js' ]

      // if true then uses of `global` won't be dealt with by this plugin
      ignoreGlobal: false, // Default: false

      // if false then skip sourceMap generation for CommonJS modules
      sourceMap: false, // Default: true

      // explicitly specify unresolvable named exports
      // (see below for more details)
      namedExports: {
        './module.js': ['foo', 'bar']
      }, // Default: undefined

      // sometimes you have to leave require statements
      // unconverted. Pass an array containing the IDs
      // or a `id => boolean` function. Only use this
      // option if you know what you're doing!
      ignore: ['conditional-runtime-dependency']
    })
  ]
};
