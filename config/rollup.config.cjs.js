// rollup.config.js
// ES output
var common = require('./rollup.js');

module.exports = {
  input: 'src/index.' + common.type,
  output: {
    file: 'dist/index.cjs.js',
    format: 'cjs',
    // When export and export default are not used at the same time, set legacy to true.
    // legacy: true,
    banner: common.banner,
  },
  plugins: [
    ...common.getCompilers()
  ]
};
