import Emitter from './Emitter';

class DirectionEmitter extends Emitter {
  constructor({ ...options } = {}) {
    super(options || {});
  }
  update() {
    // 生成粒子
    super.generate();

    // 清除生命周期已经结束的粒子
    super.clear();

    // 通用属性更新
    super.update();

    // 特有属性更新

  }
}

export default DirectionEmitter;
