import Emitter from './Emitter';
import Particle from '../particle/Particle';

class ExplosionEmitter extends Emitter {
  velocity: number; // 爆炸速度，unit/s
  constructor({ velocity = 10, ...options } = {}) {
    super(options || {});
    this.velocity = velocity;
  }
  update() {
    super.generate();

    // 更新粒子
    // 清除生命周期已经结束的粒子
    for (let i = this.children.length - 1; i >= 0; i--) {
      let particle = this.children[i];
      if (particle instanceof Particle && particle.clock.getElapsedTime() > particle.life) {
        this.remove(particle);
        particle = null;
      }
    }

    // 通用属性更新
    super.update();

    // 特有属性更新
    for (let i = this.children.length - 1; i >= 0; i--) {
      const particle = this.children[i];
      if (particle instanceof Particle) {
        for (let j = 0; j < this.physicals.length; j++) {
          this.physicals[j].effect(particle);
        }
        particle.position.addScaledVector(particle.direction, this.velocity);
      }
    }
  }
}

export default ExplosionEmitter;
