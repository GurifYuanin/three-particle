import * as THREE from 'three';
import { Particle } from './Particle';
import Loader from '../util/Loader';

class Sprite extends THREE.Sprite {
  static readonly TYPE: string = 'Sprite';
  options: object;
  image: string; // 精灵图 URL 地址
  material: THREE.SpriteMaterial;
  constructor({
    image = './images/star.png',
    material = new THREE.SpriteMaterial({
      map: Loader.loadTexture(image)
    }),
    ...options
  } = {}) {
    super(material);
    Particle.prototype.constructor.call(this, options);
    this.image = image;
    this.options = options;
    this.type = 'Sprite';
  }
  clone(): Sprite | any {
    return new Sprite({
      image: this.image,
      material: this.material.clone(),
      ...this.options
    });
  }
}

export default Sprite;