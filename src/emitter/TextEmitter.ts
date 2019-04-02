import * as THREE from 'three';
import Emitter from './Emitter';
import { ParticleInterface } from '../particle/Particle';
import Loader from '../util/Loader';
import Line from '../particle/Line';

class TextEmitter extends Emitter {
  text: string; // 文字
  font: string; // 字体
  emitting: boolean; // 是否在发射中
  height: number; // 文字高度/厚度
  size: number; // 文字大小
  curveSegments: number; // 文字圆滑度

  // 文字倒角
  bevelEnabled: boolean; // 是否开启倒角
  bevelThickness: number; // 倒角厚度
  bevelSize: number; // 倒角大小
  bevelSegments: number; // 倒角圆滑度

  geometry: THREE.TextBufferGeometry | null;
  constructor({
    text = 'Hello World',
    font = '/demo/fonts/helvetiker_regular.typeface.json',
    size = 10,
    height = 10,
    curveSegments = 12,
    bevelEnabled = false,
    bevelThickness = 10,
    bevelSize = 8,
    bevelSegments = 3,
    ...options
  }) {
    super(options);
    this.emitting = false; // 等待字体加载完才能运动
    this.text = text;
    this.font = font;
    this.height = height;
    this.size = size;
    this.curveSegments = curveSegments;
    this.bevelEnabled = bevelEnabled;
    this.bevelThickness = bevelThickness;
    this.bevelSize = bevelSize;
    this.bevelSegments = bevelSegments;
    this.geometry = null;
    this.type = 'TextEmitter';
    Loader.loadFont(font, (font: THREE.Font) => {
      this.geometry = new THREE.TextBufferGeometry(this.text, {
        font,
        size: this.size,
        height: this.height,
        curveSegments: this.curveSegments,
        bevelEnabled: this.bevelEnabled,
        bevelThickness: this.bevelThickness,
        bevelSize: this.bevelSize,
        bevelSegments: this.bevelSegments,
      });
      this.emitting = true;
    });
  }

  generate(): ParticleInterface[] {
    // 存在用户手动将 emitting 打开的情况
    // 若不加控制，则会产生异常
    if (!this.geometry) {
      return [];
    }

    const generatedParticles: ParticleInterface[] = super.generate();
    const positionArray: number[] | ArrayLike < number > = this.geometry.getAttribute('position').array;
    const positionArrayLength: number = positionArray.length;
    for (let i: number = 0; i < generatedParticles.length; i++) {
      const generatedParticle: ParticleInterface = generatedParticles[i];

      // 初始化粒子位置
      // 获得倍数为 3 的随机 index
      const randomIndex: number = Math.floor(THREE.Math.randInt(0, positionArrayLength) / 3) * 3;

      switch (generatedParticle.type) {
        case Line.TYPE: {
          // Line 的情况，将 Line 的所有端点的所有位置放在随机取得的点上
          const line: Line = <unknown>generatedParticle as Line;
          const geometry: THREE.BufferGeometry = line.geometry as THREE.BufferGeometry;
          const linePositionArray: number[] = Array.from({ length: line.verticesNumber * line.verticesSize });
          for (let m: number = 0; m < line.verticesNumber; m++) {
            for (let n: number = 0; n < line.verticesSize; n++) {
              const index = m * line.verticesSize + n; // 获得索引，避免重复计算
              linePositionArray[index] = index < line.vertices.length ?
                line.vertices[index] :
                positionArray[randomIndex + n];
            }
          }
          const positionAttribute: THREE.BufferAttribute = new THREE.BufferAttribute(new Float32Array(linePositionArray), line.verticesSize);
          positionAttribute.dynamic = true;
          positionAttribute.needsUpdate = true;
          geometry.addAttribute('position', positionAttribute);
          break;
        }
        default: {
          generatedParticle.position.set(
            this.anchor.x + positionArray[randomIndex],
            this.anchor.y + positionArray[randomIndex + 1],
            this.anchor.z + positionArray[randomIndex + 2]
          );
        }
      }

      // 初始化粒子方向
      generatedParticle.direction = new THREE.Vector3(
        THREE.Math.randFloatSpread(1),
        THREE.Math.randFloatSpread(1),
        THREE.Math.randFloatSpread(1)
      ).normalize();
    }

    return generatedParticles;
  }

  update() {
    // 生成粒子
    this.generate();

    // 清除生命周期已经结束的粒子
    super.clearAll();

    // 通用属性更新
    super.update();

    // 特有属性更新

  }
}

export default TextEmitter;