const expect = require('expect.js');
const { Particle } = require('../src/particle/Particle');
const Sphere = require('../src/particle/Sphere').default;
const Line = require('../src/particle/Line').default;
const Sprite = require('../src/particle/Sprite').default;
const Text = require('../src/particle/Text').default;
const Points = require('../src/particle/Points').default;

describe('Particle', function () {
  it('Particle should be a class', function () {
    const particle = new Particle();
    expect(Particle).to.be.an('function');
    expect(particle).to.be.an('object');
  });

  it('Sphere should be a class', function() {
    const sphere = new Sphere();
    expect(Sphere).to.be.an('function');
    expect(sphere).to.be.an('object');
  });

  it('Line should be a class', function() {
    const line = new Sphere();
    expect(Line).to.be.an('function');
    expect(line).to.be.an('object');
  });

  it('Sprite should be a class', function() {
    expect(Sprite).to.be.an('function');
  });

  it('Text should be a class', function () {
    expect(Text).to.be.an('function');
  });

  it('Points should be a class', function () {
    const points = new Points();
    expect(Points).to.be.an('function');
    expect(points).to.be.an('object');
  });
});