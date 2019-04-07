import * as THREE from 'three';
import Physical from './Physical';
import { ParticleInterface } from '../particle/Particle';
import Line from '../particle/Line';
import Emitter from '../emitter/Emitter';

class Gravity extends Physical {
  static readonly EVENT_NONE: number = 0; // 无事件
  static readonly EVENT_BOUNCE: number = 1; // 弹跳事件
  static readonly EVENT_DISAPPEAR: number = 2; // 消失事件
  static readonly EVENT_STICK: number = 3; // 粘附事件
  direction: THREE.Vector3; // 重力方向
  gravity: number; // 重力系数
  floor: null | THREE.Plane; // 地面
  bounce: number; // 地面弹跳系数 [0, 1]
  firction: number; // 地面摩擦力系数
  event: number; // 撞击地面后的事件类型
  onBeforeEvent: (ParticleInterface) => void; // 撞击前触发的回调事件
  onAfterEvent: (ParticleInterface) => void; // 撞击后触发的回调事件
  constructor({
    direction = new THREE.Vector3(0, -1, 0),
    gravity = 9.8,
    floor = null,
    bounce = .5,
    firction = 1,
    event = Gravity.EVENT_NONE,
    onBeforeEvent = (particle: ParticleInterface) => {},
    onAfterEvent = (particle: ParticleInterface) => {},
    ...options
  } = {}) {
    super(options || {});
    this.direction = direction.normalize(); // 重力默认为 y 轴负方向
    this.floor = floor;
    this.bounce = bounce;
    this.firction = firction;
    this.gravity = gravity;
    this.event = event;
    this.onBeforeEvent = onBeforeEvent;
    this.onAfterEvent = onAfterEvent;
    this.type = 'Gravity';
  }
  effect(particle: ParticleInterface, emitter: Emitter): void {
    const elapsedTime: number = particle.clock.elapsedTime;
    // 如果时间跨度为 0，则直接返回
    if (elapsedTime === 0) return;
    super.effect(particle, emitter);
    // 受重力影响，修正粒子运动方向
    const originDirection: THREE.Vector3 = particle.direction.clone(); // 受重力影响前的粒子运动方向
    const originVelocity: number = particle.velocity; // 受重力影响前的粒子速率
    // 粒子被重力场所影响，方向发生偏移
    particle.direction.multiplyScalar(particle.velocity).add(
      this.direction
        .clone()
        .multiplyScalar(this.gravity * elapsedTime)
    ).normalize();

    // 存在地面且有碰撞事件
    if (this.floor && this.event !== Gravity.EVENT_NONE) {
      // 使用受重力影响前的粒子运动方向进行计算
      // 避免重力影响下方向产生重大变化（比如平行 -> 斜线）
      const originPosition: THREE.Vector3 = particle.position.clone();
      // 当粒子是折线的时候
      // 折线的位置永远不变
      // 因此参考依据为折线第一个点的位置
      if (particle.type === Line.TYPE) {
        const positionArray: number[] | ArrayLike<number> = (particle.geometry as THREE.BufferGeometry).getAttribute('position').array;
        originPosition.set(positionArray[0], positionArray[1], positionArray[2]);
      }
      const ray: THREE.Ray = new THREE.Ray(originPosition, originDirection); // 粒子运动方向射线
      const distance: number = this.floor.distanceToPoint(originPosition); // 粒子与地面的距离（地面上为正，地面下为负）
      const angle: number = originDirection.angleTo(this.floor.normal); // 粒子方向与地面法线的弧度

      // 1、若事件为粒子消失，则直接移除
      // 2、若为弹起事件
      //   2.1、若已经无法弹起则产生摩擦
      //   2.2、与地面进行碰撞后反弹

      // 如果和地面距离接近
      // 且粒子是射入平面方向
      // 则判定为与地面产生了碰撞
      if (
        ray.intersectsPlane(this.floor) &&
        distance < particle.border
        // && distance > -particle.border
      ) {
        
        this.onBeforeEvent(particle);

        // 与地面接触，发生了事件
        // 因此将粒子的方向恢复为受重力影响下偏移之前
        particle.direction.copy(originDirection);

        switch (this.event) {
          case Gravity.EVENT_DISAPPEAR: {
            emitter.clear(particle);
            return;
          }
          case Gravity.EVENT_STICK: {
            particle.velocity = 0;
            break;
          }
          case Gravity.EVENT_BOUNCE: {
            if (Math.abs(angle - 1.57) < .1) {
              // 如果粒子运动方向与地面接近平行，则产生摩擦力
              const lostVelocity: number = originVelocity * this.firction * elapsedTime; // 受摩擦力影响损失的速率
              const firctionedVelocity: number = originVelocity - lostVelocity; // 减去损失的速率后的粒子最终速率              

              // 计算被重力作用之前的速度
              // 减去受摩擦力损失的速度
              // 判定若小于一定值则认为物体静止
              particle.velocity = firctionedVelocity < .1 ? 0 : firctionedVelocity;
              // particle.velocity = firctionedVelocity;
              // 消除粒子运动垂直于平面的方向的分速度
              // const intersectPoint = new THREE.Vector3();
              // ray.intersectPlane(this.floor, intersectPoint);
              // particle.direction = this.floor.coplanarPoint(
              //   intersectPoint.clone().add(particle.direction)
              // ).sub(intersectPoint).normalize();
            } else if (angle < .1 && particle.velocity < .1) {
              // 如果粒子运动方向与地面接近垂直，且速率小于 0.1
              particle.velocity = 0;
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
              particle.velocity = this.bounce * originVelocity;
              particle.direction.reflect(this.floor.normal);
            }
          }
        }
        this.onAfterEvent(particle);
        
      }
    }
  }
}

export default Gravity;