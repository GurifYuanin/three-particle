import * as THREE from 'three';
import { Particle } from './Particle';

class Points extends THREE.Points {
  static readonly type: string = 'Points';
  verticesNumber: number; // 点数量
  verticesSize: number; // 点维度
  vertices: number[]; // 点位置
  spread: number; // 点发散值
  vertexColors: number;
  color: THREE.Color; // 点统一颜色
  colors: number[]; //点颜色
  constructor({
    verticesNumber = 10,
    verticesSize = 3,
    vertices = [],
    spread = 10,
    colors = [],
    material = new THREE.PointsMaterial() as THREE.Material,
    ...options
  } = {}) {
    const geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    // 点位置
    const positionsArray: number[] = Array.from({ length: verticesNumber * verticesSize });
    for (let i: number = 0; i < positionsArray.length; i++) {
      positionsArray[i] = i < vertices.length ? vertices[i] : THREE.Math.randFloatSpread(spread);
    }
    const positionsAttribute: THREE.BufferAttribute = new THREE.BufferAttribute(new Float32Array(positionsArray), verticesSize);
    positionsAttribute.dynamic = true;
    geometry.addAttribute('position', positionsAttribute);
    // 点颜色
    if (material.vertexColors === THREE.VertexColors) {
      const colorsArray: number[] = Array.from({ length: verticesNumber * verticesSize });
      for (let i: number = 0; i < colorsArray.length; i++) {
        colorsArray[i] = i < colors.length ? colors[i] : Math.random();
      }
      const colorsAttribute: THREE.BufferAttribute = new THREE.BufferAttribute(new Float32Array(colorsArray), verticesSize);
      colorsAttribute.dynamic = true;
      geometry.addAttribute('color', colorsAttribute);
    }
    super(geometry, material);
    Particle.prototype.constructor.call(this, options);
    this.verticesNumber = verticesNumber;
    this.verticesSize = verticesSize;
    this.vertices = vertices;
    this.spread = spread;
    this.colors = colors;
    this.type = 'Points';
  }
  clone(): Points | any {
    return new Points({
      verticesNumber: this.verticesNumber,
      verticesSize: this.verticesSize,
      vertices: this.vertices,
      spread: this.spread,
      colors: this.colors,
      material: (this.material as THREE.Material).clone()
    });
  }
}
export default Points;
