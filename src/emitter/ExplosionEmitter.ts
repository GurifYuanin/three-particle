import Emitter from './Emitter';
import Particle from '../particle/Particle';

class ExplosionEmitter extends Emitter {
  velocity: number; // 粒子爆炸速度，unit/s
  constructor({ velocity = 10, ...options } = {}) {
    super(options || {});
    this.velocity = velocity;
  }
  update() {
    // 生成粒子
    super.generate();

    // 清除生命周期已经结束的粒子
    super.clear();

    // 通用属性更新
    super.update();

    // 特有属性更新
    for (let i = this.children.length - 1; i >= 0; i--) {
      const particle = this.children[i];
      if (particle instanceof Particle) {
        particle.position.addScaledVector(particle.direction, this.velocity);
      }
    }
  }
}

export default ExplosionEmitter;
