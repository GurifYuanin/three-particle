import * as THREE from 'three';
import { Particle } from './Particle';

/* 线段 */
class Line extends THREE.Line {
  static readonly type: string = 'Line';
  verticesNumber: number; // 线段端点数
  verticesSize: number; // 线段维度
  vertices: number[]; // 自定义端点位置
  colors: number[]; // 自定义端点颜色
  options: object;
  constructor({
    verticesNumber = 2,
    verticesSize = 3,
    vertices = [],
    colors = [],
    material = new THREE.LineBasicMaterial() as THREE.Material, // LineBasicMaterial | LineDashMaterial
    ...options
  } = {}) {
    const geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    // 添加端点
    const verticesArray: number[] = Array.from({ length: verticesNumber * verticesSize });
    for (let i = 0; i < verticesArray.length; i++) {
      verticesArray[i] = i < vertices.length ? vertices[i] : 0.0;
    }
    const positionAttribute: THREE.BufferAttribute = new THREE.BufferAttribute(new Float32Array(verticesArray), verticesSize);
    positionAttribute.dynamic = true;
    geometry.addAttribute('position', positionAttribute);
    // 添加颜色
    if (material.vertexColors === THREE.VertexColors) {
      const verticesColorArray: number[] = Array.from({ length: verticesNumber * verticesSize });
      for (let i: number = 0; i < verticesColorArray.length; i++) {
        verticesColorArray[i] = i < colors.length ? colors[i] : Math.random();
      }
      const colorAttribute: THREE.BufferAttribute = new THREE.BufferAttribute(new Float32Array(verticesColorArray), verticesSize);
      colorAttribute.dynamic = true;
      geometry.addAttribute('color', colorAttribute);
    }
    super(geometry, material);
    Particle.prototype.constructor.call(this, options);
    this.verticesNumber = verticesNumber;
    this.verticesSize = verticesSize;
    this.vertices = vertices;
    this.colors = colors;
    this.options = options;
    this.type = 'Line';
  }
  clone(): Line | any {
    return new Line({
      verticesNumber: this.verticesNumber,
      verticesSize: this.verticesSize,
      vertices: this.vertices,
      colors: this.colors,
      material: (this.material as THREE.Material).clone(),
      ...this.options
    });
  }
}

export default Line;