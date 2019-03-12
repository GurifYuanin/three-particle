import * as THREE from 'three';
import { Particle } from './Particle';

class Line extends THREE.Line {
  static readonly type: string = 'Line';
  verticesDistenceScale: number; // 每两个端点之间的长度缩放值
  verticesNumber: number; // 线段端点数
  verticesSize: number; // 线段维度
  vertexColors: number; // 线段颜色类型
  color: THREE.Color; // 线段颜色
  colors: number[];
  constructor({
    verticesDistenceScale = 1,
    verticesNumber = 2,
    verticesSize = 3,
    vertexColors = THREE.NoColors,
    color = new THREE.Color(1, 1, 1),
    colors = [],
    ...options
  } = {}) {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({
      vertexColors,
      color,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide
    });
    // 添加端点
    const verticesArray: number[] = Array.from({ length: verticesNumber * verticesSize });
    verticesArray.fill(0.0);
    const positionAttribute = new THREE.BufferAttribute(new Float32Array(verticesArray), verticesSize);
    positionAttribute.dynamic = true;
    geometry.addAttribute('position', positionAttribute);
    // 添加颜色
    if (vertexColors === THREE.VertexColors) {
      const verticesColorArray: number[] = Array.from({ length: verticesNumber * verticesSize });
      for (let i = 0; i < verticesColorArray.length; i++) {
        verticesColorArray[i] = i < colors.length ? colors[i] : Math.random();
      }
      const colorAttribute = new THREE.BufferAttribute(new Float32Array(verticesColorArray), verticesSize)
      colorAttribute.dynamic = true;
      geometry.addAttribute('color', colorAttribute);
    }
    super(geometry, material);
    Particle.prototype.constructor.call(this, options);
    this.verticesDistenceScale = verticesDistenceScale;
    this.verticesNumber = verticesNumber;
    this.verticesSize = verticesSize;
    this.vertexColors = vertexColors;
    this.color = color;
    this.colors = colors;
    this.type = 'Line';
  }
  clone(): Line | any {
    return new Line({
      verticesNumber: this.verticesNumber,
      verticesSize: this.verticesSize,
      vertexColors: this.vertexColors,
      color: this.color
    });
  }
}

export default Line;