import * as THREE from 'three';
import Physical from './Physical';
import { ParticleInterface } from '../particle/Particle';
import Line from '../particle/Line';
import Emiiter from '../emitter/Emitter';

class Gravity extends Physical {
  static readonly NONE: number = 0;
  static readonly BOUNCE: number = 1;
  static readonly DISAPPEAR: number = 2;
  direction: THREE.Vector3; // 重力方向
  gravity: number; // 重力系数
  floor: null | THREE.Plane; // 地面
  bounce: number; // 地面弹跳系数 [0, 1]
  firction: number; // 地面摩擦力系数
  event: number; // 撞击地面后的事件
  constructor({
    direction = new THREE.Vector3(0, -1, 0),
    gravity = 9.8,
    floor = null,
    bounce = .1,
    firction = 1,
    event = Gravity.NONE,
    ...options
  } = {}) {
    super(options || {});
    this.direction = direction.normalize(); // 重力默认为 y 轴负方向
    this.floor = floor;
    this.bounce = bounce;
    this.firction = firction;
    this.gravity = gravity;
    this.event = event;
    this.type = 'Gravity';
  }
  effect(particle: ParticleInterface, emitter: Emiiter): void {
    const elapsedTime = particle.clock.elapsedTime;
    // 如果时间跨度为 0，则直接返回
    if (elapsedTime === 0) return;
    super.effect(particle, emitter);
    // 受重力影响，修正粒子运动方向
    const originDirection = particle.direction.clone(); // 记录下受重力影响前的粒子运动方向
    let velocity = particle.direction.add(
      this.direction
        .clone()
        .multiplyScalar(this.gravity * elapsedTime)
    ).length();
    particle.direction.divideScalar(velocity); // 单位向量化

    // 存在地面且有碰撞事件
    if (this.floor && this.event !== Gravity.NONE) {
      // 使用受重力影响前的粒子运动方向进行计算
      // 避免重力影响下方向产生重大变化（比如平行 -> 斜线）
      const particlePosition = particle.position.clone();
      // 当粒子是折线的时候
      // 折线的位置永远不变
      // 因此参考依据为折线第一个点的位置
      if (particle.type === Line.TYPE) {
        const positionArray = (particle.geometry as THREE.BufferGeometry).getAttribute('position').array;
        particlePosition.set(positionArray[0], positionArray[1], positionArray[2]);
        particlePosition.set(positionArray[0], positionArray[1], positionArray[2]);
      }
      const ray = new THREE.Ray(particlePosition, originDirection); // 粒子运动方向射线
      const distance = this.floor.distanceToPoint(particlePosition); // 粒子与地面的距离（地面上为正，地面下为负）
      const angle = originDirection.angleTo(this.floor.normal); // 粒子方向与地面法线的弧度

      // 1、若事件为粒子消失，则直接移除
      // 2、若为弹起事件
      //   2.1、若已经无法弹起则产生摩擦
      //   2.2、与地面进行碰撞后反弹

      // 如果和地面距离接近
      // 且粒子是射入平面方向
      // 则判定为与地面产生了碰撞
      if (
        ray.intersectsPlane(this.floor) &&
        distance < particle.border &&
        distance > -particle.border
      ) {
        switch (this.event) {
          case Gravity.DISAPPEAR: {
            emitter.clear(particle);
            return;
          }
          case Gravity.BOUNCE: {
            if (Math.abs(angle - 1.57) < .1) {
              // 如果粒子运动方向与地面接近平行
              // 则产生摩擦力
              const lostVelocity = particle.velocity * this.firction * elapsedTime; // 受摩擦力影响损失的速率
              const firctionedVelocity = particle.velocity - lostVelocity; // 减去损失的速率后的粒子最终速率

              // 既然粒子运动方向与地面
              // 且粒子运动方向与地面接近平行
              // 那么认为重力对物体不产生影响
              // 将原来的方向赋值回去
              particle.direction = originDirection;

              // 计算被重力作用之前的速度
              // 减去受摩擦力损失的速度
              // 判定若小于一定值则认为物体静止
              if (firctionedVelocity < .1) {
                velocity = 0;
              }
              // 消除粒子运动垂直于平面的方向的分速度
              // else {
              //   particle.direction = this.floor.coplanarPoint(
              //     intersectPoint.clone().add(particle.direction)
              //   ).sub(intersectPoint).normalize();
              // }
            } else {
              // 粒子运动方向不与地面平行
              // 则产生反弹
              // https://blog.csdn.net/happy__888/article/details/1545432
              // 当法线为单位向量时，折线计算公式
              // v - 2 * (v * N) * N
              // const normal = this.floor.normal.clone();
              // const direction = particle.direction.clone();
              // particle.direction = direction.sub(normal.multiply(normal).multiply(direction).multiplyScalar(2));
              // 直接使用 THREE 内置的计算公式
              particle.direction.reflect(this.floor.normal);
              velocity = this.bounce * velocity;
            }
          }
        }
      }
    }

    particle.velocity = velocity;
  }
}

export default Gravity;