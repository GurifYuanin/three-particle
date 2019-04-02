import * as THREE from 'three';
import { Particle } from './Particle';
import Glow from '../effect/Glow';

/* 点集 */
class Points extends THREE.Points {
  static readonly TYPE: string = 'Points';
  verticesNumber: number; // 点数量
  verticesSize: number; // 点维度
  vertices: number[]; // 点位置
  spread: number; // 点发散值
  color: THREE.Color; // 点统一颜色
  colors: number[]; //点颜色
  glow: Glow | null;
  options: object;
  constructor({
    verticesNumber = 10,
    verticesSize = 3,
    vertices = [],
    spread = 10,
    colors = [],
    glow = null,
    material = new THREE.PointsMaterial(),
    ...options
  } = {}) {
    const geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    // 设置点位置
    const positionsArray: number[] = Array.from({ length: verticesNumber * verticesSize });
    for (let i: number = 0; i < positionsArray.length; i++) {
      positionsArray[i] = i < vertices.length ? vertices[i] : THREE.Math.randFloatSpread(spread);
    }
    const positionsAttribute: THREE.BufferAttribute = new THREE.BufferAttribute(new Float32Array(positionsArray), verticesSize);
    positionsAttribute.dynamic = true;
    geometry.addAttribute('position', positionsAttribute);
    // 设置每个点的颜色（纯色）
    if (material.vertexColors === THREE.VertexColors) {
      // 每个点单独着色
      // 可以通过 color 参数传入，省略部分设置为随机颜色
      const colorsArray: number[] = Array.from({ length: verticesNumber * verticesSize });
      for (let i: number = 0; i < colorsArray.length; i++) {
        colorsArray[i] = i < colors.length ? colors[i] : Math.random();
      }
      const colorsAttribute: THREE.BufferAttribute = new THREE.BufferAttribute(new Float32Array(colorsArray), verticesSize);
      colorsAttribute.dynamic = true;
      geometry.addAttribute('color', colorsAttribute);
    }

    // 设置每个点的发光
    // 点发光通过材质的 map 来实现
    // 如果已经存在 map，则不会进行覆盖

    // 只会执行一次，因为粒子生成使通过 Particle.clone 方法来生成的
    // 后续 clone 的时候会发现 material.map 不为 null
    if (!material.map && glow) {
      const canvasEl = document.createElement('canvas');
      const diameter = 16 * glow.size; // 画布宽高，也是径向渐变的直径
      const radius = diameter / 2; // 径向渐变的半径
      canvasEl.width = diameter;
      canvasEl.height = diameter;
      const context = canvasEl.getContext('2d');
      // 从中心点且半径为 0 的圆渐变到半径为 radius 的圆
      const radioGradient = context.createRadialGradient(
        radius, radius, 0,
        radius, radius, radius
      );
      // 颜色（白色）增加率，将 intensity 反映到材质的 color 上
      // 当 intensity 大于 1 时，发光偏白（亮）
      // 当 intensity 小于 1 时，发光偏黑（暗）
      const incrementsRate = glow.intensity > 1 ?
                            glow.intensity * 0.2 :
                            glow.intensity - 1;
      const red = THREE.Math.clamp(glow.color.r * 255 * (1 + incrementsRate), 0, 255);
      const green = THREE.Math.clamp(glow.color.g * 255 * (1 + incrementsRate), 0, 255);
      const blue = THREE.Math.clamp(glow.color.b * 255 * (1 + incrementsRate), 0, 255);
      const rgbColor = `rgba(${red},${green},${blue}`; // 计算出来 rgb 颜色，减少重复计算
      // 注意，glow 的 opacity 表示透明度
      // 而 rgba 的 alpha 表示不透明度
      radioGradient.addColorStop(0, `${rgbColor},1)`);
      radioGradient.addColorStop(THREE.Math.mapLinear(
        diameter - glow.feature, 0, diameter, 1.0, 0.0
      ), `${rgbColor},1)`);
      radioGradient.addColorStop(1, `${rgbColor},0)`);
      context.fillStyle = radioGradient;
      context.fillRect(0, 0, diameter, diameter);
      // 创建径向渐变的 2d canvas，作为点集的颜色贴图
      // 该贴图会作用给每个点
      const glowTexture = new THREE.CanvasTexture(canvasEl);
      glowTexture.needsUpdate = true;
      material.map = glowTexture;
    }
    super(geometry, material);
    Particle.prototype.constructor.call(this, options);
    this.verticesNumber = verticesNumber;
    this.verticesSize = verticesSize;
    this.vertices = vertices;
    this.spread = spread;
    this.colors = colors;
    this.glow = glow;
    this.options = options;
    
    this.type = 'Points';
  }
  clone(): Points | any {
    return new Points({
      verticesNumber: this.verticesNumber,
      verticesSize: this.verticesSize,
      vertices: this.vertices,
      spread: this.spread,
      colors: this.colors,
      material: (this.material as THREE.PointsMaterial).clone(),
      glow: this.glow,
      ...this.options
    });
  }
}
export default Points;
