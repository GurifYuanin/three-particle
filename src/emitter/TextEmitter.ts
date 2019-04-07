import * as THREE from 'three';
import Emitter from './Emitter';
import { ParticleInterface } from '../particle/Particle';
import Loader from '../util/Loader';
import Line from '../particle/Line';
import Points from '../particle/Points';

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

  geometry: THREE.TextBufferGeometry;
  constructor({
    text = 'Hello World',
    font = './fonts/helvetiker_regular.typeface.json',
    size = 10,
    height = 10,
    curveSegments = 12,
    bevelEnabled = false,
    bevelThickness = 10,
    bevelSize = 8,
    bevelSegments = 3,
    ...options
  }) {
    super(options || {});
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
    const textPositionArray: number[] | ArrayLike<number> = this.geometry.getAttribute('position').array;
    const textPositionArrayLength: number = textPositionArray.length;
    for (let i: number = 0; i < generatedParticles.length; i++) {
      const generatedParticle: ParticleInterface = generatedParticles[i];

      // 初始化粒子位置
      // 获得倍数为 3 的随机 index
      const randomIndex: number = Math.floor(THREE.Math.randInt(0, textPositionArrayLength) / 3) * 3;

      switch (generatedParticle.type) {
        case Points.TYPE:;
        case Line.TYPE: {
          // Line 或者 Points 的情况，将 Line 或 Points 所有端点的所有位置放在随机取得的点上
          const lineOrPoints: Line | Points = <unknown>generatedParticle as Line | Points;
          const positionAttribute: THREE.BufferAttribute = lineOrPoints.geometry.getAttribute('position') as THREE.BufferAttribute;
          const positionArray: number[] = positionAttribute.array as number[];
          for (let m: number = 0; m < lineOrPoints.verticesNumber; m++) {
            for (let n: number = 0; n < lineOrPoints.verticesSize; n++) {
              const index = m * lineOrPoints.verticesSize + n; // 获得索引，避免重复计算
              positionArray[index] = index < lineOrPoints.vertices.length ?
                lineOrPoints.vertices[index] :
                textPositionArray[randomIndex + n];
            }
          }
          positionAttribute.dynamic = true;
          positionAttribute.needsUpdate = true;
          break;
        }
        default: {
          generatedParticle.position.set(
            this.anchor.x + textPositionArray[randomIndex],
            this.anchor.y + textPositionArray[randomIndex + 1],
            this.anchor.z + textPositionArray[randomIndex + 2]
          );
        }
      }

      // 初始化粒子方向
      generatedParticle.direction.set(
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