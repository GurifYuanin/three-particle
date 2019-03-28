
/*!
 * three-particle
 0.0.3(https://github.com/GurifYuanin/three-particle)
 * API https://github.com/GurifYuanin/three-particle/blob/master/doc/api.md)
 * Copyright 2017 - 2019
 GurifYuanin.All Rights Reserved
 * Licensed under MIT(https://github.com/GurifYuanin/three-particle/blob/master/LICENSE)
 */

var TP = (function (exports,THREE) {
  'use strict';

  // from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
  // Production steps of ECMA-262, Edition 6, 22.1.2.1
  if (!Array.from) {
      Array.from = (function () {
          var toStr = Object.prototype.toString;
          var isCallable = function (fn) {
              return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
          };
          var toInteger = function (value) {
              var number = Number(value);
              if (isNaN(number)) {
                  return 0;
              }
              if (number === 0 || !isFinite(number)) {
                  return number;
              }
              return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
          };
          var maxSafeInteger = Math.pow(2, 53) - 1;
          var toLength = function (value) {
              var len = toInteger(value);
              return Math.min(Math.max(len, 0), maxSafeInteger);
          };
          // The length property of the from method is 1.
          return function from(arrayLike /*, mapFn, thisArg */) {
              // 1. Let C be the this value.
              var C = this;
              // 2. Let items be ToObject(arrayLike).
              var items = Object(arrayLike);
              // 3. ReturnIfAbrupt(items).
              if (arrayLike == null) {
                  throw new TypeError('Array.from requires an array-like object - not null or undefined');
              }
              // 4. If mapfn is undefined, then let mapping be false.
              var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
              var T;
              if (typeof mapFn !== 'undefined') {
                  // 5. else
                  // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                  if (!isCallable(mapFn)) {
                      throw new TypeError('Array.from: when provided, the second argument must be a function');
                  }
                  // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                  if (arguments.length > 2) {
                      T = arguments[2];
                  }
              }
              // 10. Let lenValue be Get(items, "length").
              // 11. Let len be ToLength(lenValue).
              var len = toLength(items.length);
              // 13. If IsConstructor(C) is true, then
              // 13. a. Let A be the result of calling the [[Construct]] internal method 
              // of C with an argument list containing the single item len.
              // 14. a. Else, Let A be ArrayCreate(len).
              var A = isCallable(C) ? Object(new C(len)) : new Array(len);
              // 16. Let k be 0.
              var k = 0;
              // 17. Repeat, while k < len… (also steps a - h)
              var kValue;
              while (k < len) {
                  kValue = items[k];
                  if (mapFn) {
                      A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                  }
                  else {
                      A[k] = kValue;
                  }
                  k += 1;
              }
              // 18. Let putStatus be Put(A, "length", len, true).
              A.length = len;
              // 20. Return A.
              return A;
          };
      }());
  }

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  function __rest(s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
              t[p[i]] = s[p[i]];
      return t;
  }

  var Particle = /** @class */ (function () {
      function Particle(_a) {
          var _b = _a === void 0 ? {} : _a, _c = _b.life, life = _c === void 0 ? 3 : _c, _d = _b.velocity, velocity = _d === void 0 ? 10 : _d, _e = _b.border, border = _e === void 0 ? 5 : _e;
          this.clock = new THREE.Clock();
          this.clock.start();
          this.life = life;
          this.direction = new THREE.Vector3(0, 0, 0);
          this.velocity = velocity;
          this.border = border;
          this.emitting = true;
      }
      Particle.TRANSFORM_LINEAR = 0; // 线性插值
      Particle.TRANSFORM_SMOOTH = 1; // 平滑插值
      Particle.TRANSFORM_SMOOTHER = 2; // 更平滑的插值
      return Particle;
  }());

  /* 球 */
  var Sphere = /** @class */ (function (_super) {
      __extends(Sphere, _super);
      function Sphere(_a) {
          if (_a === void 0) { _a = {}; }
          var _b = _a.radius, radius = _b === void 0 ? 5 : _b, _c = _a.widthSegments, widthSegments = _c === void 0 ? 32 : _c, _d = _a.heightSegments, heightSegments = _d === void 0 ? 32 : _d, _e = _a.material, material = _e === void 0 ? new THREE.MeshPhongMaterial() : _e, options = __rest(_a, ["radius", "widthSegments", "heightSegments", "material"]);
          var _this = this;
          var geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
          _this = _super.call(this, geometry, material) || this;
          Particle.prototype.constructor.call(_this, options);
          _this.radius = radius;
          _this.widthSegments = widthSegments;
          _this.heightSegments = heightSegments;
          _this.options = options;
          _this.type = 'Sphere';
          return _this;
      }
      Sphere.prototype.clone = function () {
          return new Sphere(__assign({ radius: this.radius, heightSegments: this.heightSegments, widthSegments: this.widthSegments, material: this.material.clone() }, this.options));
      };
      Sphere.TYPE = 'Sphere';
      return Sphere;
  }(THREE.Mesh));

  /* 线段 */
  var Line = /** @class */ (function (_super) {
      __extends(Line, _super);
      function Line(_a) {
          if (_a === void 0) { _a = {}; }
          var _b = _a.verticesNumber, verticesNumber = _b === void 0 ? 2 : _b, _c = _a.verticesSize, verticesSize = _c === void 0 ? 3 : _c, _d = _a.vertices, vertices = _d === void 0 ? [] : _d, _e = _a.colors, colors = _e === void 0 ? [] : _e, _f = _a.material, material = _f === void 0 ? new THREE.LineBasicMaterial() : _f, // LineBasicMaterial | LineDashMaterial
          options = __rest(_a, ["verticesNumber", "verticesSize", "vertices", "colors", "material"]);
          var _this = this;
          var geometry = new THREE.BufferGeometry();
          // 添加颜色
          if (material.vertexColors === THREE.VertexColors) {
              var verticesColorArray = Array.from({ length: verticesNumber * verticesSize });
              for (var i = 0; i < verticesColorArray.length; i++) {
                  verticesColorArray[i] = i < colors.length ? colors[i] : Math.random();
              }
              var colorAttribute = new THREE.BufferAttribute(new Float32Array(verticesColorArray), verticesSize);
              colorAttribute.dynamic = true;
              geometry.addAttribute('color', colorAttribute);
          }
          _this = _super.call(this, geometry, material) || this;
          Particle.prototype.constructor.call(_this, options);
          _this.verticesNumber = verticesNumber;
          _this.verticesSize = verticesSize;
          _this.vertices = vertices;
          _this.colors = colors;
          _this.options = options;
          _this.type = 'Line';
          return _this;
      }
      Line.prototype.clone = function () {
          return new Line(__assign({ verticesNumber: this.verticesNumber, verticesSize: this.verticesSize, vertices: this.vertices, colors: this.colors, material: this.material.clone() }, this.options));
      };
      Line.TYPE = 'Line';
      return Line;
  }(THREE.Line));

  /* 点集 */
  var Points = /** @class */ (function (_super) {
      __extends(Points, _super);
      function Points(_a) {
          if (_a === void 0) { _a = {}; }
          var _b = _a.verticesNumber, verticesNumber = _b === void 0 ? 10 : _b, _c = _a.verticesSize, verticesSize = _c === void 0 ? 3 : _c, _d = _a.vertices, vertices = _d === void 0 ? [] : _d, _e = _a.spread, spread = _e === void 0 ? 10 : _e, _f = _a.colors, colors = _f === void 0 ? [] : _f, _g = _a.material, material = _g === void 0 ? new THREE.PointsMaterial() : _g, options = __rest(_a, ["verticesNumber", "verticesSize", "vertices", "spread", "colors", "material"]);
          var _this = this;
          var geometry = new THREE.BufferGeometry();
          // 点位置
          var positionsArray = Array.from({ length: verticesNumber * verticesSize });
          for (var i = 0; i < positionsArray.length; i++) {
              positionsArray[i] = i < vertices.length ? vertices[i] : THREE.Math.randFloatSpread(spread);
          }
          var positionsAttribute = new THREE.BufferAttribute(new Float32Array(positionsArray), verticesSize);
          positionsAttribute.dynamic = true;
          geometry.addAttribute('position', positionsAttribute);
          // 点颜色
          if (material.vertexColors === THREE.VertexColors) {
              var colorsArray = Array.from({ length: verticesNumber * verticesSize });
              for (var i = 0; i < colorsArray.length; i++) {
                  colorsArray[i] = i < colors.length ? colors[i] : Math.random();
              }
              var colorsAttribute = new THREE.BufferAttribute(new Float32Array(colorsArray), verticesSize);
              colorsAttribute.dynamic = true;
              geometry.addAttribute('color', colorsAttribute);
          }
          _this = _super.call(this, geometry, material) || this;
          Particle.prototype.constructor.call(_this, options);
          _this.verticesNumber = verticesNumber;
          _this.verticesSize = verticesSize;
          _this.vertices = vertices;
          _this.spread = spread;
          _this.colors = colors;
          _this.options = options;
          _this.type = 'Points';
          return _this;
      }
      Points.prototype.clone = function () {
          return new Points(__assign({ verticesNumber: this.verticesNumber, verticesSize: this.verticesSize, vertices: this.vertices, spread: this.spread, colors: this.colors, material: this.material.clone() }, this.options));
      };
      Points.TYPE = 'Points';
      return Points;
  }(THREE.Points));

  var fontLoader = new THREE.FontLoader();
  var textureLoader = new THREE.TextureLoader();
  // cache
  var fonts = {};
  var textures = {};
  var Loader = /** @class */ (function () {
      function Loader() {
      }
      Loader.loadFont = function (path, callback) {
          var font = fonts[path];
          if (font && callback) {
              callback(font);
          }
          else {
              fontLoader.load(path, function (font) {
                  fonts[path] = font;
                  if (callback) {
                      callback(font);
                  }
              });
          }
      };
      Loader.loadTexture = function (path) {
          return textures[path] = textures[path] || textureLoader.load(path);
      };
      return Loader;
  }());

  /* 文本 */
  var Text = /** @class */ (function (_super) {
      __extends(Text, _super);
      function Text(_a) {
          if (_a === void 0) { _a = {}; }
          var _b = _a.text, text = _b === void 0 ? 'Hello World' : _b, _c = _a.font, font = _c === void 0 ? '/demo/fonts/helvetiker_regular.typeface.json' : _c, _d = _a.size, size = _d === void 0 ? 10 : _d, _e = _a.height, height = _e === void 0 ? 50 : _e, _f = _a.curveSegments, curveSegments = _f === void 0 ? 12 : _f, _g = _a.bevelEnabled, bevelEnabled = _g === void 0 ? false : _g, _h = _a.bevelThickness, bevelThickness = _h === void 0 ? 10 : _h, _j = _a.bevelSize, bevelSize = _j === void 0 ? 8 : _j, _k = _a.bevelSegments, bevelSegments = _k === void 0 ? 3 : _k, _l = _a.material, material = _l === void 0 ? new THREE.MeshPhongMaterial() : _l, options = __rest(_a, ["text", "font", "size", "height", "curveSegments", "bevelEnabled", "bevelThickness", "bevelSize", "bevelSegments", "material"]);
          var _this = _super.call(this) || this;
          Particle.prototype.constructor.call(_this, options);
          _this.emitting = false; // 等待字体加载完才能运动
          _this.text = text;
          _this.font = font;
          _this.height = height;
          _this.size = size;
          _this.curveSegments = curveSegments;
          _this.bevelEnabled = bevelEnabled;
          _this.bevelThickness = bevelThickness;
          _this.bevelSize = bevelSize;
          _this.bevelSegments = bevelSegments;
          _this.options = options;
          _this.type = 'Text';
          Loader.loadFont(font, _this.active.bind(_this));
          return _this;
      }
      Text.prototype.active = function (font) {
          this.geometry = new THREE.TextBufferGeometry(this.text, {
              font: font,
              size: this.size,
              height: this.height,
              curveSegments: this.curveSegments,
              bevelEnabled: this.bevelEnabled,
              bevelThickness: this.bevelThickness,
              bevelSize: this.bevelSize,
              bevelSegments: this.bevelSegments,
          });
          this.emitting = true;
      };
      Text.prototype.clone = function () {
          return new Text(__assign({ text: this.text, font: this.font, size: this.size, height: this.height, curveSegments: this.curveSegments, bevelEnabled: this.bevelEnabled, bevelThickness: this.bevelThickness, bevelSize: this.bevelSize, bevelSegments: this.bevelSegments, material: this.material.clone() }, this.options));
      };
      Text.TYPE = 'Text';
      return Text;
  }(THREE.Mesh));

  var Sprite = /** @class */ (function (_super) {
      __extends(Sprite, _super);
      function Sprite(_a) {
          if (_a === void 0) { _a = {}; }
          var _b = _a.image, image = _b === void 0 ? './images/star.png' : _b, _c = _a.material, material = _c === void 0 ? new THREE.SpriteMaterial({ map: Loader.loadTexture(image) }) : _c, options = __rest(_a, ["image", "material"]);
          var _this = _super.call(this, material) || this;
          Particle.prototype.constructor.call(_this, options);
          _this.image = image;
          _this.options = options;
          _this.type = 'Sprite';
          return _this;
      }
      Sprite.prototype.clone = function () {
          return new Sprite(__assign({ image: this.image, material: this.material.clone() }, this.options));
      };
      Sprite.TYPE = 'Sprite';
      return Sprite;
  }(THREE.Sprite));

  var Lut = /** @class */ (function () {
      function Lut() {
      }
      Lut.getInterpolationFunction = function (particlesTransformType) {
          switch (particlesTransformType) {
              case Particle.TRANSFORM_LINEAR: return THREE.Math.lerp;
              case Particle.TRANSFORM_SMOOTH: return THREE.Math.smoothstep;
              case Particle.TRANSFORM_SMOOTHER: return THREE.Math.smootherstep;
              default: return function () { return 0; };
          }
      };
      return Lut;
  }());

  // 通用工具包
  var Util = /** @class */ (function () {
      function Util() {
      }
      Util.fill = function (target, source, propertyName) {
          if (Array.isArray(target)) {
              for (var i = target.length - 1; i >= 0; i--) {
                  if (propertyName) {
                      target[i][propertyName] = source;
                  }
                  else {
                      target[i] = source;
                  }
              }
          }
          else {
              if (propertyName) {
                  target[propertyName] = source;
              }
              else {
                  target = source;
              }
          }
      };
      Util.dispose = function (particle) {
          particle.geometry.dispose();
          particle.material.dispose();
          particle = null;
      };
      return Util;
  }());

  var Emitter = /** @class */ (function (_super) {
      __extends(Emitter, _super);
      function Emitter(_a) {
          var _b = _a === void 0 ? {} : _a, _c = _b.emission, emission = _c === void 0 ? 100 : _c, _d = _b.anchor, anchor = _d === void 0 ? new THREE.Vector3(0, 0, 0) : _d, _e = _b.particlesPositionRandom, particlesPositionRandom = _e === void 0 ? null : _e, _f = _b.particlesOpacityRandom, particlesOpacityRandom = _f === void 0 ? 0 : _f, _g = _b.particlesOpacityKey, particlesOpacityKey = _g === void 0 ? [] : _g, _h = _b.particlesOpacityValue, particlesOpacityValue = _h === void 0 ? [] : _h, _j = _b.particlesColorRandom, particlesColorRandom = _j === void 0 ? [0, 0, 0] : _j, _k = _b.particlesColorKey, particlesColorKey = _k === void 0 ? [] : _k, _l = _b.particlesColorValue, particlesColorValue = _l === void 0 ? [] : _l, _m = _b.particlesRotationRandom, particlesRotationRandom = _m === void 0 ? new THREE.Vector3(0, 0, 0) : _m, _o = _b.particlesRotationKey, particlesRotationKey = _o === void 0 ? [] : _o, _p = _b.particlesRotationValue, particlesRotationValue = _p === void 0 ? [] : _p, _q = _b.particlesScaleRandom, particlesScaleRandom = _q === void 0 ? new THREE.Vector3(0, 0, 0) : _q, _r = _b.particlesScaleKey, particlesScaleKey = _r === void 0 ? [] : _r, _s = _b.particlesScaleValue, particlesScaleValue = _s === void 0 ? [] : _s;
          var _this = _super.call(this) || this;
          _this.emission = emission;
          _this.emitting = true;
          _this.clock = new THREE.Clock();
          _this.clock.start();
          _this.particles = [];
          _this.physicals = [];
          _this.effects = [];
          _this.anchor = anchor;
          _this.particlesPositionRandom = particlesPositionRandom;
          _this.particlesOpacityRandom = particlesOpacityRandom;
          _this.particlesOpacityKey = particlesOpacityKey;
          _this.particlesOpacityValue = particlesOpacityValue;
          _this.particlesColorRandom = particlesColorRandom;
          _this.particlesColorKey = particlesColorKey;
          _this.particlesColorValue = particlesColorValue;
          _this.particlesRotationRandom = particlesRotationRandom;
          _this.particlesRotationKey = particlesRotationKey;
          _this.particlesRotationValue = particlesRotationValue;
          _this.particlesScaleRandom = particlesScaleRandom;
          _this.particlesScaleKey = particlesScaleKey;
          _this.particlesScaleValue = particlesScaleValue;
          _this.particlesTransformType = Particle.TRANSFORM_LINEAR;
          _this.type = 'Emitter';
          return _this;
      }
      // 新增样板粒子
      Emitter.prototype.addParticle = function (particle) {
          this.particles.push(particle);
      };
      // 新增物理场
      Emitter.prototype.addPhysical = function (physical) {
          this.physicals.push(physical);
      };
      // 新增特效场
      Emitter.prototype.addEffect = function (effect) {
          this.effects.push(effect);
      };
      // 开始发射粒子，默认为开启
      Emitter.prototype.start = function () {
          this.emitting = true;
      };
      // 暂停发射粒子
      Emitter.prototype.stop = function () {
          this.emitting = false;
      };
      // 生成粒子
      Emitter.prototype.generate = function () {
          var delta = this.clock.getDelta(); // 距离上一次发射粒子过去的时间差
          var deltaEmission = Math.round(delta * this.emission); // 该时间差需要发射多少粒子
          var generatedParticles = [];
          if (this.emitting) {
              // 新增粒子
              for (var i = 0; i < deltaEmission; i++) {
                  var randomIndex = THREE.Math.randInt(0, this.particles.length - 1);
                  var randomParticle = this.particles[randomIndex].clone(); // 从 particles 内随机取出一个粒子作为样本
                  if (randomParticle.emitting) {
                      // 这里是因为 Text 粒子需要加载字体
                      // 字体未加载完成之前不能添加到场景中
                      // 用粒子的 emitting 属性标记是否可以进行发射
                      generatedParticles.push(randomParticle);
                      this.add(randomParticle);
                  }
                  else {
                      // 粒子无法进行发射，则清除掉
                      Util.dispose(randomParticle);
                  }
              }
          }
          // 返回生成的粒子，用于在子类内进行二次修改
          return generatedParticles;
      };
      // 更新粒子
      Emitter.prototype.update = function () {
          for (var i = this.children.length - 1; i >= 0; i--) {
              var particle = this.children[i];
              if (!particle.emitting)
                  continue;
              // 获得粒子距离上次更新的时间差
              var elapsedTimePercentage = particle.clock.elapsedTime % particle.life / particle.life;
              // 获得插值函数
              var interpolationFunction = Lut.getInterpolationFunction(this.particlesTransformType);
              // 设置粒子属性随机值
              // 粒子透明度
              for (var j = 0; j < this.particlesOpacityKey.length - 1; j++) {
                  if (elapsedTimePercentage >= this.particlesOpacityKey[j] && elapsedTimePercentage < this.particlesOpacityKey[j + 1]) {
                      Util.fill(particle.material, interpolationFunction(this.particlesOpacityValue[j], this.particlesOpacityValue[j + 1], elapsedTimePercentage) + THREE.Math.randFloatSpread(this.particlesOpacityRandom), 'opacity');
                      break;
                  }
              }
              // 粒子颜色
              for (var j = 0; j < this.particlesColorKey.length - 1; j++) {
                  if (elapsedTimePercentage >= this.particlesColorKey[j] && elapsedTimePercentage < this.particlesColorKey[j + 1]) {
                      var preColor = this.particlesColorValue[j];
                      var nextColor = this.particlesColorValue[j + 1];
                      Util.fill(particle.material, new THREE.Color(interpolationFunction(preColor.r, nextColor.r, elapsedTimePercentage) + THREE.Math.randFloatSpread(this.particlesColorRandom[0]), interpolationFunction(preColor.g, nextColor.g, elapsedTimePercentage) + THREE.Math.randFloatSpread(this.particlesColorRandom[1]), interpolationFunction(preColor.b, nextColor.b, elapsedTimePercentage) + THREE.Math.randFloatSpread(this.particlesColorRandom[2])), 'color');
                      break;
                  }
              }
              Util.fill(particle.material, true, 'needsUpdate');
              // 粒子位置
              this.particlesPositionRandom && particle.position.add(new THREE.Vector3(THREE.Math.randFloatSpread(this.particlesPositionRandom.x), THREE.Math.randFloatSpread(this.particlesPositionRandom.y), THREE.Math.randFloatSpread(this.particlesPositionRandom.z)));
              // 粒子旋转
              for (var j = 0; j < this.particlesRotationKey.length - 1; j++) {
                  if (elapsedTimePercentage >= this.particlesRotationKey[j] && elapsedTimePercentage < this.particlesRotationKey[j + 1]) {
                      var preRotation = this.particlesRotationValue[j];
                      var nextRotation = this.particlesRotationValue[j + 1];
                      particle.rotateX(interpolationFunction(preRotation.x, nextRotation.x, elapsedTimePercentage) + THREE.Math.randFloatSpread(this.particlesRotationRandom.x));
                      particle.rotateY(interpolationFunction(preRotation.y, nextRotation.y, elapsedTimePercentage) + THREE.Math.randFloatSpread(this.particlesRotationRandom.y));
                      particle.rotateZ(interpolationFunction(preRotation.z, nextRotation.z, elapsedTimePercentage) + THREE.Math.randFloatSpread(this.particlesRotationRandom.z));
                      break;
                  }
              }
              // 粒子缩放调整
              for (var j = 0; j < this.particlesScaleKey.length - 1; j++) {
                  if (elapsedTimePercentage >= this.particlesScaleKey[j] && elapsedTimePercentage < this.particlesScaleKey[j + 1]) {
                      var preScale = this.particlesScaleValue[j];
                      var nextScale = this.particlesScaleValue[j + 1];
                      // 缩放值不应该为 0 ,否则 three 无法计算 Matrix3 的逆，控制台报警告
                      // https://github.com/aframevr/aframe-inspector/issues/524
                      particle.scale.set((interpolationFunction(preScale.x, nextScale.x, elapsedTimePercentage) + THREE.Math.randFloatSpread(this.particlesScaleRandom.x)) || 0.00001, (interpolationFunction(preScale.y, nextScale.y, elapsedTimePercentage) + THREE.Math.randFloatSpread(this.particlesScaleRandom.y)) || 0.00001, (interpolationFunction(preScale.z, nextScale.z, elapsedTimePercentage) + THREE.Math.randFloatSpread(this.particlesScaleRandom.z)) || 0.00001);
                      break;
                  }
              }
              // 特效场影响
              for (var j = 0; j < this.effects.length; j++) {
                  this.effects[j].effect(particle, this);
              }
              // 物理场影响
              for (var j = 0; j < this.physicals.length; j++) {
                  this.physicals[j].effect(particle, this);
              }
              // 进行移动
              switch (particle.type) {
                  case Line.TYPE: {
                      // 线段的运动是最前面的点更新值
                      // 其后的所有点紧随前面一个的点的位置
                      var position = particle.geometry.getAttribute('position');
                      var positionArray = position.array;
                      var verticesNumber = particle.verticesNumber;
                      var verticesSize = particle.verticesSize;
                      var m = void 0, n = void 0;
                      // 更新除了第一个点之外的所有点
                      for (m = 0; m < verticesNumber - 1; m++) {
                          for (n = 0; n < verticesSize; n++) {
                              positionArray[m * verticesSize + n] = positionArray[(m + 1) * verticesSize + n];
                          }
                      }
                      // 更新第一个点
                      var directionArray = [particle.direction.x, particle.direction.y, particle.direction.z];
                      for (n = 0; n < verticesSize; n++) {
                          positionArray[m * verticesSize + n] += directionArray[n] * particle.velocity;
                      }
                      position.needsUpdate = true;
                      break;
                  }
                  default: {
                      particle.position.addScaledVector(particle.direction, particle.velocity);
                  }
              }
          }
      };
      Emitter.prototype.clear = function (particle) {
          // 清除指定的粒子
          this.remove(particle);
          Util.dispose(particle);
      };
      Emitter.prototype.clearAll = function () {
          // 清除生命周期已经结束的粒子
          for (var i = this.children.length - 1; i >= 0; i--) {
              var particle = this.children[i];
              if (particle.clock.getElapsedTime() > particle.life) {
                  // 这里调用了 getElapsedTime() ，将进行一次时间的打点
                  // 后续直接使用 elapsedTime 而不需要再次调用该方法
                  this.clear(particle);
              }
          }
      };
      return Emitter;
  }(THREE.Object3D));

  // 爆炸发射器
  // 发射类型固定位一个点
  var ExplosionEmitter = /** @class */ (function (_super) {
      __extends(ExplosionEmitter, _super);
      function ExplosionEmitter(_a) {
          if (_a === void 0) { _a = {}; }
          var options = __rest(_a, []);
          return _super.call(this, options || {}) || this;
      }
      ExplosionEmitter.prototype.generate = function () {
          var generatedParticles = _super.prototype.generate.call(this);
          var generatedParticlePosition = [this.anchor.x, this.anchor.y, this.anchor.z];
          for (var i = 0; i < generatedParticles.length; i++) {
              var generatedParticle = generatedParticles[i];
              switch (generatedParticle.type) {
                  case Line.TYPE: {
                      var line = generatedParticle;
                      var geometry = line.geometry;
                      var positionArray = Array.from({ length: line.verticesNumber * line.verticesSize });
                      for (var m = 0; m < line.verticesNumber; m++) {
                          for (var n = 0; n < line.verticesSize; n++) {
                              var index = m * line.verticesSize + n; // 获得索引，避免重复计算
                              positionArray[index] = index < line.vertices.length ?
                                  line.vertices[index] :
                                  generatedParticlePosition[n];
                          }
                      }
                      var positionAttribute = new THREE.BufferAttribute(new Float32Array(positionArray), line.verticesSize);
                      positionAttribute.dynamic = true;
                      positionAttribute.needsUpdate = true;
                      geometry.addAttribute('position', positionAttribute);
                      break;
                  }
                  default:
              }
              generatedParticle.direction = new THREE.Vector3(THREE.Math.randFloatSpread(1), THREE.Math.randFloatSpread(1), THREE.Math.randFloatSpread(1)).normalize();
          }
          return generatedParticles;
      };
      ExplosionEmitter.prototype.update = function () {
          // 生成粒子
          this.generate();
          // 清除生命周期已经结束的粒子
          _super.prototype.clearAll.call(this);
          // 通用属性更新
          _super.prototype.update.call(this);
          // 特有属性更新
      };
      return ExplosionEmitter;
  }(Emitter));

  var DirectionEmitter = /** @class */ (function (_super) {
      __extends(DirectionEmitter, _super);
      function DirectionEmitter(_a) {
          if (_a === void 0) { _a = {}; }
          var _b = _a.direction, direction = _b === void 0 ? new THREE.Vector3(0, 0, -1) : _b, _c = _a.spread, spread = _c === void 0 ? 0 : _c, _d = _a.radius, radius = _d === void 0 ? new THREE.Vector3(0, 0, 0) : _d, _e = _a.emitType, emitType = _e === void 0 ? DirectionEmitter.EMIT_TYPE_SHPERE : _e, options = __rest(_a, ["direction", "spread", "radius", "emitType"]);
          var _this = _super.call(this, options || {}) || this;
          _this.direction = direction.normalize();
          _this.spread = spread;
          _this.radius = radius instanceof THREE.Vector3 ? radius : new THREE.Vector3(radius, radius, radius);
          _this.emitType = emitType;
          _this.type = 'DirectionEmitter';
          if (_this.emitType === DirectionEmitter.EMIT_TYPE_ROUND) {
              // 解决方案二
              // 旋转整个发射器
              // this.lookAt(this.direction);
              // 旋转后将粒子发射方向进行修正
              // this.direction.applyEuler(this.rotation);
              // this.direction.negate();
              // 设置拦截器，因为此时发射器方向发生变化，
              // 这里暂时将 anchor 的变更拦截到 position 上
              _this.anchor = new Proxy(_this.anchor, {
                  get: function (target, key) { return target[key]; },
                  set: function (target, key, value) {
                      _this.position[key] = value;
                      return Boolean(value);
                  }
              });
          }
          return _this;
      }
      DirectionEmitter.prototype.generate = function () {
          var baseVector3 = new THREE.Vector3(0, 0, 1);
          var angle = this.direction.angleTo(baseVector3);
          var axis = baseVector3.cross(this.direction);
          var generatedParticles = _super.prototype.generate.call(this);
          for (var i = 0; i < generatedParticles.length; i++) {
              var generatedParticle = generatedParticles[i];
              // 初始化粒子位置
              // 设置为数组而不是 THREE.Vector3 是为了方便在循环体内操作
              // 默认情况设置为球形
              var generatedParticlePosition = [
                  this.anchor.x + THREE.Math.randFloatSpread(this.radius.x),
                  this.anchor.y + THREE.Math.randFloatSpread(this.radius.y),
                  this.anchor.z + THREE.Math.randFloatSpread(this.radius.z)
              ];
              switch (this.emitType) {
                  case DirectionEmitter.EMIT_TYPE_SHPERE: {
                      // 发射类型为球形
                      break;
                  }
                  case DirectionEmitter.EMIT_TYPE_ROUND: {
                      // 发射类型为圆形
                      // 解决方案一
                      /**
                      * 已知平面法线 x1 y1 z1
                      * 已知发射器 anchor 为 x2 y2 z2
                      * radius 为 [0, emitter.radius] 之间的一个随机值
                      * 求 x y z
                      *
                      * 显然可得：
                      * (x - x2, y - y2, z - z2) 垂直于 (x1, y1, z1)
                      * (x - x2) * x1 + (y - y2) * y1 + (z - z2) * z1 = 0
                      *
                      * 化为等式：
                      * (x - x2)^2 + (y - y2)^2 + (z - z2)^2 = radius^2
                      * x1 * sqrt(radius^2 - (y - y2)^2 + (z - z2)^2) + (y - y2) * y1 + (z - z2) * z1 = 0
                      *
                      * 但不知道如果解多项方程。。。
                      */
                      // 解决方案二
                      // 变用另一种实现方式
                      // 在 x-y 面上生成粒子
                      // 再旋转发射器，使其朝向发射器的 direction
                      // 但直接变化了发射器的 localMatrix，anchor、physic、effect 都将受到影响
                      // 解决方案三
                      // 类似于解决方案二
                      // 但旋转每个粒子
                      // 缺陷是影响发射器的 anchor 设置
                      // 
                      var generatedParticleVector = new THREE.Vector3(generatedParticlePosition[0], generatedParticlePosition[1], this.anchor.z);
                      generatedParticleVector.applyAxisAngle(axis, angle);
                      generatedParticlePosition[0] = generatedParticleVector.x;
                      generatedParticlePosition[1] = generatedParticleVector.y;
                      generatedParticlePosition[2] = generatedParticleVector.z;
                      break;
                  }
                  default:
              }
              switch (generatedParticle.type) {
                  case Line.TYPE: {
                      // 对于线段来说，position 属性并不生效
                      // 生效的是 geometry.getAttribute('position')
                      var line = generatedParticle;
                      var geometry = line.geometry;
                      var positionArray = Array.from({ length: line.verticesNumber * line.verticesSize });
                      for (var m = 0; m < line.verticesNumber; m++) {
                          for (var n = 0; n < line.verticesSize; n++) {
                              var index = m * line.verticesSize + n; // 获得索引，避免重复计算
                              positionArray[index] = index < line.vertices.length ?
                                  line.vertices[index] :
                                  generatedParticlePosition[n];
                          }
                      }
                      var positionAttribute = new THREE.BufferAttribute(new Float32Array(positionArray), line.verticesSize);
                      positionAttribute.dynamic = true;
                      positionAttribute.needsUpdate = true;
                      geometry.addAttribute('position', positionAttribute);
                      break;
                  }
                  default:
              }
              generatedParticle.position.set(generatedParticlePosition[0], generatedParticlePosition[1], generatedParticlePosition[2]);
              // 初始化粒子方向
              generatedParticles[i].direction = new THREE.Vector3(this.direction.x + THREE.Math.randFloatSpread(this.spread), this.direction.y + THREE.Math.randFloatSpread(this.spread), this.direction.z + THREE.Math.randFloatSpread(this.spread)).normalize();
          }
          return generatedParticles;
      };
      DirectionEmitter.prototype.update = function () {
          // 生成粒子
          this.generate();
          // 清除生命周期已经结束的粒子
          _super.prototype.clearAll.call(this);
          // 通用属性更新
          _super.prototype.update.call(this);
          // 特有属性更新
      };
      DirectionEmitter.EMIT_TYPE_SHPERE = 0; // 球形发射
      DirectionEmitter.EMIT_TYPE_ROUND = 1; // 圆形发射
      return DirectionEmitter;
  }(Emitter));

  var Physcial = /** @class */ (function () {
      function Physcial(options) {
          if (options === void 0) { options = {}; }
          this.type = 'Physcial';
      }
      Physcial.prototype.effect = function (particle, emitter) {
      };
      return Physcial;
  }());

  var Gravity = /** @class */ (function (_super) {
      __extends(Gravity, _super);
      function Gravity(_a) {
          if (_a === void 0) { _a = {}; }
          var _b = _a.direction, direction = _b === void 0 ? new THREE.Vector3(0, -1, 0) : _b, _c = _a.gravity, gravity = _c === void 0 ? 9.8 : _c, _d = _a.floor, floor = _d === void 0 ? null : _d, _e = _a.bounce, bounce = _e === void 0 ? .1 : _e, _f = _a.firction, firction = _f === void 0 ? 1 : _f, _g = _a.event, event = _g === void 0 ? Gravity.NONE : _g, options = __rest(_a, ["direction", "gravity", "floor", "bounce", "firction", "event"]);
          var _this = _super.call(this, options || {}) || this;
          _this.direction = direction.normalize(); // 重力默认为 y 轴负方向
          _this.floor = floor;
          _this.bounce = bounce;
          _this.firction = firction;
          _this.gravity = gravity;
          _this.event = event;
          _this.type = 'Gravity';
          return _this;
      }
      Gravity.prototype.effect = function (particle, emitter) {
          var elapsedTime = particle.clock.elapsedTime;
          // 如果时间跨度为 0，则直接返回
          if (elapsedTime === 0)
              return;
          _super.prototype.effect.call(this, particle, emitter);
          // 受重力影响，修正粒子运动方向
          var originDirection = particle.direction.clone(); // 记录下受重力影响前的粒子运动方向
          var velocity = particle.direction.add(this.direction
              .clone()
              .multiplyScalar(this.gravity * elapsedTime)).length();
          particle.direction.divideScalar(velocity); // 单位向量化
          // 存在地面且有碰撞事件
          if (this.floor && this.event !== Gravity.NONE) {
              // 使用受重力影响前的粒子运动方向进行计算
              // 避免重力影响下方向产生重大变化（比如平行 -> 斜线）
              var particlePosition = particle.position.clone();
              // 当粒子是折线的时候
              // 折线的位置永远不变
              // 因此参考依据为折线第一个点的位置
              if (particle.type === Line.TYPE) {
                  var positionArray = particle.geometry.getAttribute('position').array;
                  particlePosition.set(positionArray[0], positionArray[1], positionArray[2]);
                  particlePosition.set(positionArray[0], positionArray[1], positionArray[2]);
              }
              var ray = new THREE.Ray(particlePosition, originDirection); // 粒子运动方向射线
              var distance = this.floor.distanceToPoint(particlePosition); // 粒子与地面的距离（地面上为正，地面下为负）
              var angle = originDirection.angleTo(this.floor.normal); // 粒子方向与地面法线的弧度
              // 1、若事件为粒子消失，则直接移除
              // 2、若为弹起事件
              //   2.1、若已经无法弹起则产生摩擦
              //   2.2、与地面进行碰撞后反弹
              // 如果和地面距离接近
              // 且粒子是射入平面方向
              // 则判定为与地面产生了碰撞
              if (ray.intersectsPlane(this.floor) &&
                  distance < particle.border &&
                  distance > -particle.border) {
                  switch (this.event) {
                      case Gravity.DISAPPEAR: {
                          emitter.clear(particle);
                          return;
                      }
                      case Gravity.BOUNCE: {
                          if (Math.abs(angle - 1.57) < .1) {
                              // 如果粒子运动方向与地面接近平行
                              // 则产生摩擦力
                              var lostVelocity = particle.velocity * this.firction * elapsedTime; // 受摩擦力影响损失的速率
                              var firctionedVelocity = particle.velocity - lostVelocity; // 减去损失的速率后的粒子最终速率
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
                          }
                          else {
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
      };
      Gravity.NONE = 0;
      Gravity.BOUNCE = 1;
      Gravity.DISAPPEAR = 2;
      return Gravity;
  }(Physcial));

  var Wind = /** @class */ (function (_super) {
      __extends(Wind, _super);
      function Wind(_a) {
          if (_a === void 0) { _a = {}; }
          var _b = _a.direction, direction = _b === void 0 ? new THREE.Vector3(1, 0, 0) : _b, _c = _a.intensity, intensity = _c === void 0 ? 1 : _c, _d = _a.spread, spread = _d === void 0 ? 0 : _d, options = __rest(_a, ["direction", "intensity", "spread"]);
          var _this = _super.call(this, options || {}) || this;
          _this.direction = direction;
          _this.intensity = intensity;
          _this.spread = spread;
          _this.type = 'Wind';
          return _this;
      }
      Wind.prototype.effect = function (particle, emitter) {
          _super.prototype.effect.call(this, particle, emitter);
          particle.velocity = particle.direction.add(this.direction
              .clone()
              .multiplyScalar(this.intensity)
              .addScalar(THREE.Math.randFloatSpread(this.spread))).length();
          // 如果速度等于 0，直接返回，除数不能为 0
          if (particle.velocity === 0)
              return;
          particle.direction.divideScalar(particle.velocity); // 单位向量化
      };
      return Wind;
  }(Physcial));

  var Effect = /** @class */ (function () {
      function Effect(options) {
          this.type = 'Effect';
      }
      Effect.prototype.effect = function (particle, emitter) {
      };
      return Effect;
  }());

  // 湍流
  var Turbulent = /** @class */ (function (_super) {
      __extends(Turbulent, _super);
      function Turbulent(_a) {
          if (_a === void 0) { _a = {}; }
          var _b = _a.intensity, intensity = _b === void 0 ? 10 : _b, options = __rest(_a, ["intensity"]);
          var _this = _super.call(this, options || {}) || this;
          _this.intensity = intensity;
          _this.type = 'Turbulent';
          return _this;
      }
      Turbulent.prototype.effect = function (particle, emitter) {
          switch (particle.type) {
              case Line.TYPE:
              case Points.TYPE: {
                  // 扰乱折线或者点集各个点的位置
                  // 而不是影响粒子位置
                  // 因为 particle.position 是整个粒子的位置属性
                  var position = particle.geometry.getAttribute('position');
                  var positionArray = position.array;
                  for (var i = positionArray.length - 1; i >= 0; i--) {
                      positionArray[i] += THREE.Math.randFloatSpread(this.intensity);
                  }
                  position.needsUpdate = true;
                  break;
              }
              default: {
                  particle.position.addScalar(THREE.Math.randFloatSpread(this.intensity));
              }
          }
      };
      return Turbulent;
  }(Effect));

  // polyfill

  exports.Sphere = Sphere;
  exports.Line = Line;
  exports.Points = Points;
  exports.Text = Text;
  exports.Sprite = Sprite;
  exports.ExplosionEmitter = ExplosionEmitter;
  exports.DirectionEmitter = DirectionEmitter;
  exports.Gravity = Gravity;
  exports.Wind = Wind;
  exports.Turbulent = Turbulent;

  return exports;

}({},THREE));
