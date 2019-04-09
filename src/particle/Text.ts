import * as THREE from 'three';
import { Particle } from './Particle';
import Loader from '../util/Loader';
import Glow from '../effect/Glow';

/* 文本 */
class Text extends THREE.Mesh {
  static readonly TYPE: string = 'Text';
  text: string; // 文字内容
  emitting: boolean; // 粒子是否准备就绪
  font: string; // 字体
  height: number; // 文字高度/厚度
  size: number; // 文字大小
  curveSegments: number; // 文字圆滑度

  // 文字倒角
  bevelEnabled: boolean; // 是否开启倒角
  bevelThickness: number; // 倒角厚度
  bevelSize: number; // 倒角大小
  bevelSegments: number; // 倒角圆滑度
  
  options: object;
  glow: Glow | null;
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
    material = new THREE.MeshPhongMaterial(),
    glow = null,
    ...options
  } = {}) {
    super();
    Particle.prototype.constructor.call(this, options);
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
    this.options = options;
    this.glow = glow;
    this.type = 'Text';
    Loader.loadFont(font, this.active.bind(this));
  }
  active(font: THREE.Font) {
    // 加载字体是异步行为
    // 因此需要向 Loader 传入回调函数
    // 加载完字体会调用该方法，创建文字的 geometry
    const options = {
      font,
      size: this.size,
      height: this.height,
      curveSegments: this.curveSegments,
      bevelEnabled: this.bevelEnabled,
      bevelThickness: this.bevelThickness,
      bevelSize: this.bevelSize,
      bevelSegments: this.bevelSegments,
    };
    this.geometry = new THREE.TextBufferGeometry(this.text, options);
    if (this.glow) {
      options.size *= this.glow.rate;
      this.add(new THREE.Mesh(
        new THREE.TextBufferGeometry(this.text, options),
        this.glow.getShaderMaterial()
      ));
    }
    this.emitting = true;
  }
  clone(): Text | any {
    return new Text({
      text: this.text,
      font: this.font,
      size: this.size,
      height: this.height,
      curveSegments: this.curveSegments,
      bevelEnabled: this.bevelEnabled,
      bevelThickness: this.bevelThickness,
      bevelSize: this.bevelSize,
      bevelSegments: this.bevelSegments,
      material: (this.material as THREE.MeshPhongMaterial).clone(),
      glow: this.glow,
      ...this.options
    });
  }
}

export default Text;