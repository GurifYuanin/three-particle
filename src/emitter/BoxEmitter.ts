import * as THREE from 'three';
import Emitter from './Emitter';
import { ParticleInterface } from '../particle/Particle';

// 盒子发射器
class BoxEmitter extends Emitter {
	static readonly SIDE_BOTH: number = 0; // 两边发射
	static readonly SIDE_TOP: number = 1; // 顶部发射
	static readonly SIDE_BOTTOM: number = 2; // 底部发射
	width: number; // 盒子宽度
	height: number; // 盒子高度
	thickness: number; // 盒子厚度
	side: number; // 粒子发射方向
  constructor({
  	width = 5,
    height = 5,
    thickness = 5,
    side = 0,
    ...options
  }) {
    super(options || {});
    this.width = width;
    this.height = height;
    this.thickness = thickness;
		this.side = side;
		this.type = 'BoxEmitter';
  }
  generate(): ParticleInterface[] {
  	const generatedParticles: ParticleInterface[] = super.generate();
  	// 设置随机函数
  	const randFn = (range : number) => {
  		switch(this.side) {
  			case BoxEmitter.SIDE_BOTH: return THREE.Math.randFloatSpread(range);
  			case BoxEmitter.SIDE_TOP: return THREE.Math.randFloat(0, range);
  			case BoxEmitter.SIDE_BOTTOM: return THREE.Math.randFloat(-range, 0);
  			default: return 0;
  		}
  	}
  	for (let i: number = 0; i < generatedParticles.length; i++) {
  		const generatedParticle: ParticleInterface = generatedParticles[i];

  		// 初始化粒子位置
  		generatedParticle.position.set(
  			this.anchor.x + randFn(this.width),
  			this.anchor.y + randFn(this.height),
  			this.anchor.z + randFn(this.thickness)
  		);

  		// 初始化粒子方向
  		generatedParticle.direction.set(
  			THREE.Math.randFloatSpread(1),
  			randFn(1),
  			THREE.Math.randFloatSpread(1)
  		).normalize();
  	}

  	return generatedParticles;
  }

  update(): void {
    // 生成粒子
    this.generate();

    // 清除生命周期已经结束的粒子
    super.clearAll();

    // 通用属性更新
    super.update();

    // 特有属性更新

  }
}

export default BoxEmitter;