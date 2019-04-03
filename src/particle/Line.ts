import * as THREE from 'three';
import { Particle } from './Particle';
import Util from '../util/Util';

/* 线段 */
class Line extends THREE.Line {
  static readonly TYPE: string = 'Line';
  verticesNumber: number; // 线段端点数
  verticesSize: number; // 线段维度
  vertices: number[]; // 自定义端点位置
  colors: number[]; // 自定义端点颜色
  afterimagePositionArrayIndex: number;
  material: THREE.LineBasicMaterial | THREE.LineDashedMaterial;
  geometry: THREE.BufferGeometry;
  options: object;
  constructor({
    verticesNumber = 2,
    verticesSize = 3,
    vertices = [],
    colors = [],
    material = new THREE.LineBasicMaterial(), // LineBasicMaterial | LineDashMaterial
    ...options
  } = {}) {
    const geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
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
    geometry.addAttribute('position', new THREE.BufferAttribute(
      new Float32Array(
        Util.fill(
          Array.from({ length: verticesNumber * verticesSize }),
          0.0
        ),
      ),
      verticesSize
    ));
    super(geometry, material);
    Particle.prototype.constructor.call(this, options);
    this.verticesNumber = verticesNumber;
    this.verticesSize = verticesSize;
    this.vertices = vertices;
    this.colors = colors;
    this.afterimagePositionArrayIndex = 0;
    this.options = options;
    this.type = 'Line';
  }
  clone(): Line | any {
    return new Line({
      verticesNumber: this.verticesNumber,
      verticesSize: this.verticesSize,
      vertices: this.vertices,
      colors: this.colors,
      material: this.material.clone(),
      ...this.options
    });
  }
}

export default Line;