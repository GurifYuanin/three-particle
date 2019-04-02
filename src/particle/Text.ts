import * as THREE from 'three';
import { Particle } from './Particle';
import Loader from '../util/Loader';

/* 文本 */
class Text extends THREE.Mesh {
  static readonly TYPE: string = 'Text';
  text: string; // 文字内容
  emitting: boolean; // 粒子是否准备就绪
  font: string; // 字体
  height: number; // 文字高度
  size: number; // 文字大小
  curveSegments: number;
  bevelEnabled: boolean;
  bevelThickness: number;
  bevelSize: number;
  bevelSegments: number;
  options: object;
  constructor({
    text = 'Hello World',
    font = '/demo/fonts/helvetiker_regular.typeface.json',
    size = 10,
    height = 50,
    curveSegments = 12,
    bevelEnabled = false,
    bevelThickness = 10,
    bevelSize = 8,
    bevelSegments = 3,
    material = new THREE.MeshPhongMaterial() as THREE.Material,
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
    this.type = 'Text';
    Loader.loadFont(font, this.active.bind(this));
  }
  active(font) {
    // 加载完字体会调用该方法，创建 geometry
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
      material: (this.material as THREE.Material).clone(),
      ...this.options
    });
  }
}

export default Text;