
/*!
 * three-particle
 0.1.0(https://github.com/GurifYuanin/three-particle)
 * API https://github.com/GurifYuanin/three-particle/blob/master/doc/api.md)
 * Copyright 2017 - 2019
 GurifYuanin.All Rights Reserved
 * Licensed under MIT(https://github.com/GurifYuanin/three-particle/blob/master/LICENSE)
 */

import { MeshPhongMaterial, SphereBufferGeometry, Mesh, Clock, Vector3, LineBasicMaterial, BufferGeometry, BufferAttribute, VertexColors, Line, PointsMaterial, Math as Math$1, Points, TextBufferGeometry, FontLoader, Color, Object3D } from 'three';

// export default function () {
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
console.log(1);
// }

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
        var _b = _a.life, life = _b === void 0 ? 3 : _b;
        this.clock = new Clock();
        this.clock.start();
        this.life = life;
        this.direction = new Vector3(0, 0, 0);
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
        var _b = _a.radius, radius = _b === void 0 ? 50 : _b, _c = _a.widthSegments, widthSegments = _c === void 0 ? 32 : _c, _d = _a.heightSegments, heightSegments = _d === void 0 ? 32 : _d, _e = _a.material, material = _e === void 0 ? new MeshPhongMaterial() : _e, options = __rest(_a, ["radius", "widthSegments", "heightSegments", "material"]);
        var _this = this;
        var geometry = new SphereBufferGeometry(radius, widthSegments, heightSegments);
        _this = _super.call(this, geometry, material) || this;
        Particle.prototype.constructor.call(_this, options);
        _this.radius = radius;
        _this.widthSegments = widthSegments;
        _this.heightSegments = heightSegments;
        _this.type = 'Sphere';
        return _this;
    }
    Sphere.prototype.clone = function () {
        return new Sphere({
            radius: this.radius,
            heightSegments: this.heightSegments,
            widthSegments: this.widthSegments,
            material: this.material.clone()
        });
    };
    Sphere.type = 'Sphere';
    return Sphere;
}(Mesh));

/* 线段 */
var Line$1 = /** @class */ (function (_super) {
    __extends(Line$$1, _super);
    function Line$$1(_a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.verticesDistenceScale, verticesDistenceScale = _b === void 0 ? 1 : _b, _c = _a.verticesNumber, verticesNumber = _c === void 0 ? 2 : _c, _d = _a.verticesSize, verticesSize = _d === void 0 ? 3 : _d, _e = _a.vertices, vertices = _e === void 0 ? [] : _e, _f = _a.colors, colors = _f === void 0 ? [] : _f, _g = _a.material, material = _g === void 0 ? new LineBasicMaterial() : _g, // LineBasicMaterial | LineDashMaterial
        options = __rest(_a, ["verticesDistenceScale", "verticesNumber", "verticesSize", "vertices", "colors", "material"]);
        var _this = this;
        var geometry = new BufferGeometry();
        // 添加端点
        var verticesArray = Array.from({ length: verticesNumber * verticesSize });
        for (var i = 0; i < verticesArray.length; i++) {
            verticesArray[i] = i < vertices.length ? vertices[i] : 0.0;
        }
        var positionAttribute = new BufferAttribute(new Float32Array(verticesArray), verticesSize);
        positionAttribute.dynamic = true;
        geometry.addAttribute('position', positionAttribute);
        // 添加颜色
        if (material.vertexColors === VertexColors) {
            var verticesColorArray = Array.from({ length: verticesNumber * verticesSize });
            for (var i = 0; i < verticesColorArray.length; i++) {
                verticesColorArray[i] = i < colors.length ? colors[i] : Math.random();
            }
            var colorAttribute = new BufferAttribute(new Float32Array(verticesColorArray), verticesSize);
            colorAttribute.dynamic = true;
            geometry.addAttribute('color', colorAttribute);
        }
        _this = _super.call(this, geometry, material) || this;
        Particle.prototype.constructor.call(_this, options);
        _this.verticesDistenceScale = verticesDistenceScale;
        _this.verticesNumber = verticesNumber;
        _this.verticesSize = verticesSize;
        _this.vertices = vertices;
        _this.colors = colors;
        _this.type = 'Line';
        return _this;
    }
    Line$$1.prototype.clone = function () {
        return new Line$$1({
            verticesDistenceScale: this.verticesDistenceScale,
            verticesNumber: this.verticesNumber,
            verticesSize: this.verticesSize,
            vertices: this.vertices,
            colors: this.colors,
            material: this.material.clone()
        });
    };
    Line$$1.type = 'Line';
    return Line$$1;
}(Line));

/* 点集 */
var Points$1 = /** @class */ (function (_super) {
    __extends(Points$$1, _super);
    function Points$$1(_a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.verticesNumber, verticesNumber = _b === void 0 ? 10 : _b, _c = _a.verticesSize, verticesSize = _c === void 0 ? 3 : _c, _d = _a.vertices, vertices = _d === void 0 ? [] : _d, _e = _a.spread, spread = _e === void 0 ? 10 : _e, _f = _a.colors, colors = _f === void 0 ? [] : _f, _g = _a.material, material = _g === void 0 ? new PointsMaterial() : _g, options = __rest(_a, ["verticesNumber", "verticesSize", "vertices", "spread", "colors", "material"]);
        var _this = this;
        var geometry = new BufferGeometry();
        // 点位置
        var positionsArray = Array.from({ length: verticesNumber * verticesSize });
        for (var i = 0; i < positionsArray.length; i++) {
            positionsArray[i] = i < vertices.length ? vertices[i] : Math$1.randFloatSpread(spread);
        }
        var positionsAttribute = new BufferAttribute(new Float32Array(positionsArray), verticesSize);
        positionsAttribute.dynamic = true;
        geometry.addAttribute('position', positionsAttribute);
        // 点颜色
        if (material.vertexColors === VertexColors) {
            var colorsArray = Array.from({ length: verticesNumber * verticesSize });
            for (var i = 0; i < colorsArray.length; i++) {
                colorsArray[i] = i < colors.length ? colors[i] : Math.random();
            }
            var colorsAttribute = new BufferAttribute(new Float32Array(colorsArray), verticesSize);
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
        _this.type = 'Points';
        return _this;
    }
    Points$$1.prototype.clone = function () {
        return new Points$$1({
            verticesNumber: this.verticesNumber,
            verticesSize: this.verticesSize,
            vertices: this.vertices,
            spread: this.spread,
            colors: this.colors,
            material: this.material.clone()
        });
    };
    Points$$1.type = 'Points';
    return Points$$1;
}(Points));

var loader = new FontLoader();
var Loader = /** @class */ (function () {
    function Loader() {
    }
    Loader.load = function (path, callback) {
        var font = Loader.fonts[path];
        if (font) {
            callback(Loader.fonts[path]);
        }
        else {
            loader.load(path, function (font) {
                Loader[path] = font;
                callback(font);
            });
        }
        return font;
    };
    Loader.fonts = {};
    return Loader;
}());

/* 文本 */
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text(_a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.text, text = _b === void 0 ? 'Hello World' : _b, _c = _a.font, font = _c === void 0 ? '/font/helvetiker_regular.typeface.json' : _c, _d = _a.size, size = _d === void 0 ? 10 : _d, _e = _a.height, height = _e === void 0 ? 50 : _e, _f = _a.curveSegments, curveSegments = _f === void 0 ? 12 : _f, _g = _a.bevelEnabled, bevelEnabled = _g === void 0 ? false : _g, _h = _a.bevelThickness, bevelThickness = _h === void 0 ? 10 : _h, _j = _a.bevelSize, bevelSize = _j === void 0 ? 8 : _j, _k = _a.bevelSegments, bevelSegments = _k === void 0 ? 3 : _k, _l = _a.material, material = _l === void 0 ? new MeshPhongMaterial() : _l, options = __rest(_a, ["text", "font", "size", "height", "curveSegments", "bevelEnabled", "bevelThickness", "bevelSize", "bevelSegments", "material"]);
        var _this = _super.call(this) || this;
        Particle.prototype.constructor.call(_this, options);
        Loader.load(font, _this.active.bind(_this));
        _this.text = text;
        _this.font = font;
        _this.height = height;
        _this.size = size;
        _this.curveSegments = curveSegments;
        _this.bevelEnabled = bevelEnabled;
        _this.bevelThickness = bevelThickness;
        _this.bevelSize = bevelSize;
        _this.bevelSegments = bevelSegments;
        _this.type = 'Text';
        _this.emitting = false;
        return _this;
    }
    Text.prototype.active = function (font) {
        this.geometry = new TextBufferGeometry(this.text, {
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
        return new Text({
            text: this.text,
            font: this.font,
            size: this.size,
            height: this.height,
            curveSegments: this.curveSegments,
            bevelEnabled: this.bevelEnabled,
            bevelThickness: this.bevelThickness,
            bevelSize: this.bevelSize,
            bevelSegments: this.bevelSegments,
            material: this.material.clone()
        });
    };
    Text.type = 'Text';
    return Text;
}(Mesh));

var Lut = /** @class */ (function () {
    function Lut() {
    }
    Lut.getInterpolationFunction = function (particlesTransformType) {
        switch (particlesTransformType) {
            case Particle.TRANSFORM_LINEAR: return Math$1.lerp;
            case Particle.TRANSFORM_SMOOTH: return Math$1.smoothstep;
            case Particle.TRANSFORM_SMOOTHER: return Math$1.smootherstep;
            default: return function () { return 0; };
        }
    };
    return Lut;
}());

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
    return Util;
}());

var Emitter = /** @class */ (function (_super) {
    __extends(Emitter, _super);
    function Emitter(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.emission, emission = _c === void 0 ? 100 : _c, _d = _b.velocity, velocity = _d === void 0 ? 10 : _d, _e = _b.anchor, anchor = _e === void 0 ? new Vector3(0, 0, 0) : _e, _f = _b.particlesPositionRandom, particlesPositionRandom = _f === void 0 ? new Vector3(0, 0, 0) : _f, _g = _b.particlesOpacityRandom, particlesOpacityRandom = _g === void 0 ? 0 : _g, _h = _b.particlesOpacityKey, particlesOpacityKey = _h === void 0 ? [] : _h, _j = _b.particlesOpacityValue, particlesOpacityValue = _j === void 0 ? [] : _j, _k = _b.particlesColorRandom, particlesColorRandom = _k === void 0 ? [0, 0, 0] : _k, _l = _b.particlesColorKey, particlesColorKey = _l === void 0 ? [] : _l, _m = _b.particlesColorValue, particlesColorValue = _m === void 0 ? [] : _m, _o = _b.particlesRotationRandom, particlesRotationRandom = _o === void 0 ? new Vector3(0, 0, 0) : _o, _p = _b.particlesRotationKey, particlesRotationKey = _p === void 0 ? [] : _p, _q = _b.particlesRotationValue, particlesRotationValue = _q === void 0 ? [] : _q, _r = _b.particlesScaleRandom, particlesScaleRandom = _r === void 0 ? new Vector3(0, 0, 0) : _r, _s = _b.particlesScaleKey, particlesScaleKey = _s === void 0 ? [] : _s, _t = _b.particlesScaleValue, particlesScaleValue = _t === void 0 ? [] : _t;
        var _this = _super.call(this) || this;
        _this.emission = emission;
        _this.velocity = velocity;
        _this.emitting = true;
        _this.clock = new Clock();
        _this.clock.start();
        _this.particles = [];
        _this.physicals = [];
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
                var maxIndex = this.particles.length - 1;
                var randomIndex = Math$1.randInt(0, maxIndex);
                var randomParticle = this.particles[randomIndex].clone();
                randomParticle.position.set(this.anchor.x, this.anchor.y, this.anchor.z);
                generatedParticles.push(randomParticle);
                this.add(randomParticle);
            }
        }
        return generatedParticles;
    };
    // 更新粒子
    Emitter.prototype.update = function () {
        for (var i = this.children.length - 1; i >= 0; i--) {
            var particle = this.children[i];
            if (!particle.emitting)
                continue;
            var elapsedTimePercentage = particle.clock.elapsedTime % particle.life / particle.life;
            var interpolationFunction = Lut.getInterpolationFunction(this.particlesTransformType);
            // 粒子透明度
            for (var j = 0; j < this.particlesOpacityKey.length - 1; j++) {
                if (elapsedTimePercentage >= this.particlesOpacityKey[j] && elapsedTimePercentage < this.particlesOpacityKey[j + 1]) {
                    Util.fill(particle.material, interpolationFunction(this.particlesOpacityValue[j], this.particlesOpacityValue[j + 1], elapsedTimePercentage) + Math$1.randFloatSpread(this.particlesOpacityRandom), 'opacity');
                    break;
                }
            }
            // 粒子颜色
            for (var j = 0; j < this.particlesColorKey.length - 1; j++) {
                if (elapsedTimePercentage >= this.particlesColorKey[j] && elapsedTimePercentage < this.particlesColorKey[j + 1]) {
                    var preColor = this.particlesColorValue[j];
                    var nextColor = this.particlesColorValue[j + 1];
                    Util.fill(particle.material, new Color(interpolationFunction(preColor.r, nextColor.r, elapsedTimePercentage) + Math$1.randFloatSpread(this.particlesColorRandom[0]), interpolationFunction(preColor.g, nextColor.g, elapsedTimePercentage) + Math$1.randFloatSpread(this.particlesColorRandom[1]), interpolationFunction(preColor.b, nextColor.b, elapsedTimePercentage) + Math$1.randFloatSpread(this.particlesColorRandom[2])), 'color');
                    break;
                }
            }
            Util.fill(particle.material, true, 'needsUpdate');
            // 粒子位置
            particle.position.add(new Vector3(Math$1.randFloatSpread(this.particlesPositionRandom.x), Math$1.randFloatSpread(this.particlesPositionRandom.y), Math$1.randFloatSpread(this.particlesPositionRandom.z)));
            // 粒子旋转
            for (var j = 0; j < this.particlesRotationKey.length - 1; j++) {
                if (elapsedTimePercentage >= this.particlesRotationKey[j] && elapsedTimePercentage < this.particlesRotationKey[j + 1]) {
                    var preRotation = this.particlesRotationValue[j];
                    var nextRotation = this.particlesRotationValue[j + 1];
                    particle.rotateX(interpolationFunction(preRotation.x, nextRotation.x, elapsedTimePercentage) + Math$1.randFloatSpread(this.particlesRotationRandom.x));
                    particle.rotateY(interpolationFunction(preRotation.y, nextRotation.y, elapsedTimePercentage) + Math$1.randFloatSpread(this.particlesRotationRandom.y));
                    particle.rotateZ(interpolationFunction(preRotation.z, nextRotation.z, elapsedTimePercentage) + Math$1.randFloatSpread(this.particlesRotationRandom.z));
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
                    particle.scale.set((interpolationFunction(preScale.x, nextScale.x, elapsedTimePercentage) + Math$1.randFloatSpread(this.particlesScaleRandom.x)) || 0.00001, (interpolationFunction(preScale.y, nextScale.y, elapsedTimePercentage) + Math$1.randFloatSpread(this.particlesScaleRandom.y)) || 0.00001, (interpolationFunction(preScale.z, nextScale.z, elapsedTimePercentage) + Math$1.randFloatSpread(this.particlesScaleRandom.z)) || 0.00001);
                    break;
                }
            }
            // 物理场影响
            for (var j = 0; j < this.physicals.length; j++) {
                this.physicals[j].effect(particle);
            }
            // 进行移动
            switch (particle.type) {
                case Line$1.type: {
                    var position = particle.geometry.getAttribute('position');
                    var positionArray = position.array;
                    var verticesNumber = particle.verticesNumber;
                    var verticesSize = particle.verticesSize;
                    var m = void 0, n = void 0;
                    for (m = 0; m < verticesNumber - 1; m++) {
                        for (n = 0; n < verticesSize; n++) {
                            positionArray[m * verticesSize + n] = positionArray[(m + 1) * verticesSize + n];
                        }
                    }
                    var directionArray = [particle.direction.x, particle.direction.y, particle.direction.z];
                    for (n = 0; n < verticesSize; n++) {
                        positionArray[m * verticesSize + n] += (directionArray[n] * this.velocity * particle.verticesDistenceScale);
                    }
                    position.needsUpdate = true;
                    break;
                }
                default: {
                    particle.position.addScaledVector(particle.direction, this.velocity);
                }
            }
        }
    };
    Emitter.prototype.clear = function () {
        // 清除生命周期已经结束的粒子
        for (var i = this.children.length - 1; i >= 0; i--) {
            var particle = this.children[i];
            if (particle.clock.getElapsedTime() > particle.life) {
                // 这里调用了 getElapsedTime() ，将进行一次时间的打点
                // 后续直接使用 elapsedTime 而不需要再次调用该方法
                this.remove(particle);
                particle = null;
            }
        }
    };
    return Emitter;
}(Object3D));

var ExplosionEmitter = /** @class */ (function (_super) {
    __extends(ExplosionEmitter, _super);
    function ExplosionEmitter(_a) {
        if (_a === void 0) { _a = {}; }
        var options = __rest(_a, []);
        return _super.call(this, options || {}) || this;
    }
    ExplosionEmitter.prototype.generate = function () {
        var generatedParticles = _super.prototype.generate.call(this);
        for (var i = 0; i < generatedParticles.length; i++) {
            generatedParticles[i].direction = new Vector3(Math$1.randFloatSpread(1), Math$1.randFloatSpread(1), Math$1.randFloatSpread(1)).normalize();
        }
        return generatedParticles;
    };
    ExplosionEmitter.prototype.update = function () {
        // 生成粒子
        this.generate();
        // 清除生命周期已经结束的粒子
        _super.prototype.clear.call(this);
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
        var _b = _a.direction, direction = _b === void 0 ? new Vector3(0, 0, -1) : _b, _c = _a.flat, flat = _c === void 0 ? [] : _c, _d = _a.spread, spread = _d === void 0 ? 10 : _d, options = __rest(_a, ["direction", "flat", "spread"]);
        var _this = _super.call(this, options || {}) || this;
        _this.direction = direction.normalize();
        _this.spread = spread;
        _this.flat = flat;
        _this.isFlat = flat.length > 0;
        _this.type = 'DirectionEmitter';
        return _this;
    }
    DirectionEmitter.prototype.generate = function () {
        var generatedParticles = _super.prototype.generate.call(this);
        for (var i = 0; i < generatedParticles.length; i++) {
            generatedParticles[i].direction = new Vector3(this.direction.x * this.spread + Math$1.randFloatSpread(this.spread), this.direction.y * this.spread + Math$1.randFloatSpread(this.spread), this.direction.z * this.spread + Math$1.randFloatSpread(this.spread)).normalize();
            if (this.isFlat) {
                var end = this.flat[Math$1.randInt(0, this.flat.length - 1)];
                generatedParticles[i].position.set(Math$1.randFloat(end.x, this.anchor.x), Math$1.randFloat(end.y, this.anchor.y), Math$1.randFloat(end.z, this.anchor.z));
            }
        }
        return generatedParticles;
    };
    DirectionEmitter.prototype.update = function () {
        // 生成粒子
        this.generate();
        // 清除生命周期已经结束的粒子
        _super.prototype.clear.call(this);
        // 通用属性更新
        _super.prototype.update.call(this);
        // 特有属性更新
    };
    return DirectionEmitter;
}(Emitter));

var Physcial = /** @class */ (function () {
    function Physcial(_a) {
        _a = {};
    }
    Physcial.prototype.effect = function (particle) {
    };
    return Physcial;
}());

var Gravity = /** @class */ (function (_super) {
    __extends(Gravity, _super);
    function Gravity(_a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.direction, direction = _b === void 0 ? new Vector3(0, -1, 0) : _b, _c = _a.gravity, gravity = _c === void 0 ? 9.8 : _c, options = __rest(_a, ["direction", "gravity"]);
        var _this = _super.call(this, options) || this;
        _this.direction = direction; // 重力默认为 y 轴负方向
        _this.gravity = gravity;
        return _this;
    }
    Gravity.prototype.effect = function (particle) {
        _super.prototype.effect.call(this, particle);
        var elapsedTime = particle.clock.elapsedTime;
        particle.direction.add(this.direction.clone().multiplyScalar(this.gravity * elapsedTime));
    };
    return Gravity;
}(Physcial));

var Wind = /** @class */ (function (_super) {
    __extends(Wind, _super);
    function Wind(_a) {
        var options = __rest(_a, []);
        return _super.call(this, options) || this;
    }
    Wind.prototype.effect = function (particle) {
        _super.prototype.effect.call(this, particle);
    };
    return Wind;
}(Physcial));

// import "@babel/polyfill";
// 特效

export { Sphere, Line$1 as Line, Points$1 as Points, Text, ExplosionEmitter, DirectionEmitter, Gravity, Wind };
