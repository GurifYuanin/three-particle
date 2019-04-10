const expect = require('expect.js');
const { Particle } = require('../src/particle/Particle');
const Physical = require('../src/physical/Physical').default;
const Effect = require('../src/effect/Effect').default;
const Event = require('../src/event/Event').default;
const Emitter = require('../src/emitter/Emitter').default;
const ExplosionEmitter = require('../src/emitter/ExplosionEmitter').default;
const DirectionEmitter = require('../src/emitter/DirectionEmitter').default;
const BoxEmitter = require('../src/emitter/BoxEmitter').default;
const TextEmitter = require('../src/emitter/TextEmitter').default;

describe('Emitter', function () {
  it('Emitter should be a class', function () {
    const emitter = new Emitter();
    const particle = new Particle();
    const physical = new Physical();
    const effect = new Effect();
    const event = new Event();

    expect(Emitter).to.be.an('function');
    expect(emitter).to.be.an('object');
    expect(emitter.addParticle).to.be.an('function');

    expect(emitter.particles).to.be.empty();
    emitter.addParticle(particle);
    expect(emitter.particles).to.not.be.empty();
    emitter.removeParticle(particle);
    expect(emitter.particles).to.be.empty();

    expect(emitter.physicals).to.be.empty();
    emitter.addPhysical(physical);
    expect(emitter.physicals).to.not.be.empty();
    emitter.removePhysical(physical);
    expect(emitter.physicals).to.be.empty();

    expect(emitter.effects).to.be.empty();
    emitter.addEffect(effect);
    expect(emitter.effects).to.not.be.empty();
    emitter.removeEffect(effect);
    expect(emitter.effects).to.be.empty();

    expect(emitter.events).to.be.empty();
    emitter.addEvent(event);
    expect(emitter.events).to.not.be.empty();
    emitter.removeEvent(event);
    expect(emitter.events).to.be.empty();
  });

  it('ExplosionEmitter should be a class', function () {
    const emitter = new ExplosionEmitter();
    expect(ExplosionEmitter).to.be.an('function');
    expect(emitter).to.be.an('object');
  });


  it('DirectionEmitter should be a class', function () {
    const emitter = new DirectionEmitter();
    expect(DirectionEmitter).to.be.an('function');
    expect(emitter).to.be.an('object');
  });

  it('BoxEmitter should be a class', function () {
    const emitter = new BoxEmitter();
    expect(BoxEmitter).to.be.an('function');
    expect(emitter).to.be.an('object');
  });

  it('TextEmitter should be a class', function () {
    expect(TextEmitter).to.be.an('function');
  });
});
