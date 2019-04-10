const expect = require('expect.js');
const index = require('../src/index.ts');

// expectjs：https://github.com/Automattic/expect.js
describe('template', function () {
  it('foo', function () {
    expect(index).to.be.an('object');
  });
});
