var typescript = require('rollup-plugin-typescript2');
var babel = require('rollup-plugin-babel');
var pkg = require('../package.json');

var name = pkg.name.split('/').pop();
var version = pkg.version;
var banner = `
/*!
 * ${pkg.name}
 ${version}(https://github.com/GurifYuanin/three-particle)
 * API https://github.com/GurifYuanin/three-particle/blob/master/doc/api.md)
 * Copyright 2017 - ${(new Date).getFullYear()}
 GurifYuanin.All Rights Reserved
 * Licensed under MIT(https://github.com/GurifYuanin/three-particle/blob/master/LICENSE)
 */
`;

var type = pkg.srctype === 'ts' ? 'ts' : 'js';

function getCompilers(opt) {
  const compilers = [];

  if (type === 'ts') {
    compilers.push(typescript(opt || {}));
  }

  compilers.push(babel());

  return compilers;
}

exports.type = type;
exports.name = name;
exports.banner = banner;
exports.getCompilers = getCompilers;
