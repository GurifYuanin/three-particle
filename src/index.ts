// polyfill
// import "@babel/polyfill";
import './util/Polyfill';

// 粒子
export { default as Sphere } from './particle/Sphere';
export { default as Line } from './particle/Line';
export { default as Points } from './particle/Points';
export { default as Text } from './particle/Text';
export { default as Sprite } from './particle/Sprite';

// 发射器
export { default as Emitter } from './emitter/Emitter';
export { default as ExplosionEmitter } from './emitter/ExplosionEmitter';
export { default as DirectionEmitter } from './emitter/DirectionEmitter';
export { default as BoxEmitter } from './emitter/BoxEmitter';
export { default as TextEmitter } from './emitter/TextEmitter';

// 物理场
export { default as Gravity } from './physical/Gravity';
export { default as Wind } from './physical/Wind';

// 特效
export { default as Turbulent } from './effect/Turbulent';
export { default as Glow } from './effect/Glow';
export { default as Afterimage } from './effect/Afterimage'