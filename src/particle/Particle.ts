import * as THREE from 'three';
import Emitter from '../emitter/Emitter';

class Particle extends THREE.Mesh {
  startTime: number; // 粒子创建时间，单位 ms
  lifeTime: number; // 粒子生命长度，单位 ms
  type: string;

  constructor({ geometry, material, lifeTime = 3 }) {
    super(geometry, material);
    this.startTime = new Date().getTime();
    this.type = 'Particle';

    this.lifeTime = lifeTime * 1000;
  }
}
export default Particle;
