
/*!
 * three-particle
 0.0.4(https://github.com/GurifYuanin/three-particle)
 * API https://github.com/GurifYuanin/three-particle/blob/master/doc/api.md)
 * Copyright 2017 - 2019
 GurifYuanin.All Rights Reserved
 * Licensed under MIT(https://github.com/GurifYuanin/three-particle/blob/master/LICENSE)
 */

import { MeshPhongMaterial, SphereBufferGeometry, Mesh, Clock, Math as Math$1, Vector3, LineBasicMaterial, BufferGeometry, VertexColors, BufferAttribute, Line, PointsMaterial, CanvasTexture, Points, TextBufferGeometry, FontLoader, TextureLoader, SpriteMaterial, Sprite, Color, Matrix4, Object3D, Ray, ShaderMaterial, AdditiveBlending, WebGLRenderer, Camera, Raycaster, Vector2 } from 'three';

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

var Effect = /** @class */ (function () {
    function Effect(options) {
        if (options === void 0) { options = {}; }
        this.type = 'Effect';
    }
    Effect.prototype.effect = function (particle, emitter) {
    };
    return Effect;
}());

// 残影特效
var Afterimage = /** @class */ (function (_super) {
    __extends(Afterimage, _super);
    function Afterimage(_a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.delay, delay = _b === void 0 ? 0.2 : _b, _c = _a.interval, interval = _c === void 0 ? 0.2 : _c, _d = _a.attenuation, attenuation = _d === void 0 ? 0.2 : _d, _e = _a.number, number = _e === void 0 ? 2 : _e, options = __rest(_a, ["delay", "interval", "attenuation", "number"]);
        var _this = _super.call(this, options || {}) || this;
        _this.delay = delay;
        _this.interval = interval;
        _this.number = number;
        _this.attenuation = attenuation;
        _this.matrixWorlds = [];
        _this.positionArrays = [];
        _this.type = 'Afterimage';
        return _this;
    }
    Afterimage.prototype.clone = function () {
        return new Afterimage({
            delay: this.delay,
            interval: this.interval,
            number: this.number,
            attenuation: this.attenuation
        });
    };
    return Afterimage;
}(Effect));

var Particle = /** @class */ (function () {
    function Particle(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.life, life = _c === void 0 ? 3 : _c, _d = _b.lifeRandom, lifeRandom = _d === void 0 ? 0 : _d, // 生命随机比例
        _e = _b.velocity, // 生命随机比例
        velocity = _e === void 0 ? 10 : _e, _f = _b.border, border = _f === void 0 ? 5 : _f, _g = _b.afterimage, afterimage = _g === void 0 ? null : _g, _h = _b.onBeforeCreated, onBeforeCreated = _h === void 0 ? function () { } : _h, _j = _b.onAfterCreated, onAfterCreated = _j === void 0 ? function () { } : _j, _k = _b.onBeforeDestroyed, onBeforeDestroyed = _k === void 0 ? function () { } : _k, _l = _b.onAfterDestroyed, onAfterDestroyed = _l === void 0 ? function () { } : _l;
        this.clock = new Clock();
        this.clock.start();
        this.life = life + Math$1.randFloatSpread(lifeRandom);
        this.direction = new Vector3(0, 1, 0); // 粒子运动方向由发射器控制，不受参数影响
        this.velocity = velocity;
        this.border = border;
        this.afterimage = afterimage instanceof Afterimage ? afterimage.clone() : afterimage;
        this.afterimageMatrixWorldIndex = 0;
        this.afterimagePositionArrayIndex = 0;
        this.onBeforeCreated = onBeforeCreated;
        this.onAfterCreated = onAfterCreated;
        this.onBeforeDestroyed = onBeforeDestroyed;
        this.onAfterDestroyed = onAfterDestroyed;
        this.emitting = true;
    }
    return Particle;
}());

/* 球 */
var Sphere = /** @class */ (function (_super) {
    __extends(Sphere, _super);
    function Sphere(_a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.radius, radius = _b === void 0 ? 5 : _b, _c = _a.widthSegments, widthSegments = _c === void 0 ? 32 : _c, _d = _a.heightSegments, heightSegments = _d === void 0 ? 32 : _d, _e = _a.glow, glow = _e === void 0 ? null : _e, _f = _a.material, material = _f === void 0 ? new MeshPhongMaterial() : _f, options = __rest(_a, ["radius", "widthSegments", "heightSegments", "glow", "material"]);
        var _this = this;
        var geometry = new SphereBufferGeometry(radius, widthSegments, heightSegments);
        _this = _super.call(this, geometry, material) || this;
        Particle.prototype.constructor.call(_this, options);
        _this.radius = radius;
        _this.widthSegments = widthSegments;
        _this.heightSegments = heightSegments;
        _this.options = options;
        _this.glow = glow;
        // 设置 glow
        if (_this.glow) {
            _this.add(new Mesh(new SphereBufferGeometry(radius * _this.glow.rate, widthSegments, heightSegments), _this.glow.getShaderMaterial()));
        }
        _this.type = 'Sphere';
        return _this;
    }
    Sphere.prototype.clone = function () {
        return new Sphere(__assign({ radius: this.radius, heightSegments: this.heightSegments, widthSegments: this.widthSegments, material: this.material.clone(), glow: this.glow }, this.options));
    };
    Sphere.TYPE = 'Sphere';
    return Sphere;
}(Mesh));

/* 线段 */
var Line$1 = /** @class */ (function (_super) {
    __extends(Line$$1, _super);
    function Line$$1(_a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.verticesNumber, verticesNumber = _b === void 0 ? 2 : _b, _c = _a.verticesSize, verticesSize = _c === void 0 ? 3 : _c, _d = _a.vertices, vertices = _d === void 0 ? [] : _d, _e = _a.colors, colors = _e === void 0 ? [] : _e, _f = _a.material, material = _f === void 0 ? new LineBasicMaterial() : _f, options = __rest(_a, ["verticesNumber", "verticesSize", "vertices", "colors", "material"]);
        var _this = this;
        var geometry = new BufferGeometry();
        // 添加颜色
        if (material.vertexColors === VertexColors) {
            var verticesColorArrayNumber = verticesNumber * verticesSize;
            var verticesColorArray = Array.from({ length: verticesColorArrayNumber });
            for (var i = 0; i < verticesColorArrayNumber; i++) {
                verticesColorArray[i] = i < colors.length ? colors[i] : Math.random();
            }
            var colorAttribute = new BufferAttribute(new Float32Array(verticesColorArray), verticesSize);
            colorAttribute.dynamic = true;
            geometry.addAttribute('color', colorAttribute);
        }
        geometry.addAttribute('position', new BufferAttribute(new Float32Array(Array.from({ length: verticesNumber * verticesSize }).fill(0.0)), verticesSize));
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
    Line$$1.prototype.clone = function () {
        return new Line$$1(__assign({ verticesNumber: this.verticesNumber, verticesSize: this.verticesSize, vertices: this.vertices, colors: this.colors, material: this.material.clone() }, this.options));
    };
    Line$$1.TYPE = 'Line';
    return Line$$1;
}(Line));

/* 点集 */
var Points$1 = /** @class */ (function (_super) {
    __extends(Points$$1, _super);
    function Points$$1(_a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.verticesNumber, verticesNumber = _b === void 0 ? 10 : _b, _c = _a.verticesSize, verticesSize = _c === void 0 ? 3 : _c, _d = _a.vertices, vertices = _d === void 0 ? [] : _d, _e = _a.spread, spread = _e === void 0 ? 10 : _e, _f = _a.colors, colors = _f === void 0 ? [] : _f, _g = _a.glow, glow = _g === void 0 ? null : _g, _h = _a.material, material = _h === void 0 ? new PointsMaterial() : _h, options = __rest(_a, ["verticesNumber", "verticesSize", "vertices", "spread", "colors", "glow", "material"]);
        var _this = this;
        var geometry = new BufferGeometry();
        // 设置点位置
        var positionsArrayNumber = verticesNumber * verticesSize;
        var positionsArray = Array.from({ length: positionsArrayNumber });
        for (var i = 0; i < positionsArrayNumber; i++) {
            positionsArray[i] = i < vertices.length ? vertices[i] : Math$1.randFloatSpread(spread);
        }
        var positionsAttribute = new BufferAttribute(new Float32Array(positionsArray), verticesSize);
        positionsAttribute.dynamic = true;
        geometry.addAttribute('position', positionsAttribute);
        // 设置每个点的颜色（纯色）
        if (material.vertexColors === VertexColors) {
            // 每个点单独着色
            // 可以通过 color 参数传入，省略部分设置为随机颜色
            var colorsArrayNumber = verticesNumber * verticesSize;
            var colorsArray = Array.from({ length: colorsArrayNumber });
            for (var i = 0; i < colorsArrayNumber; i++) {
                colorsArray[i] = i < colors.length ? colors[i] : Math.random();
            }
            var colorsAttribute = new BufferAttribute(new Float32Array(colorsArray), verticesSize);
            colorsAttribute.dynamic = true;
            geometry.addAttribute('color', colorsAttribute);
        }
        // 设置每个点的发光
        // 点发光通过材质的 map 来实现
        // 如果已经存在 map，则不会进行覆盖
        // 只会执行一次，因为粒子生成使通过 Particle.clone 方法来生成的
        // 后续 clone 的时候会发现 material.map 不为 null
        if (!material.map && glow) {
            // 参考 https://segmentfault.com/a/1190000015862604
            var canvasEl = document.createElement('canvas');
            var diameter = 16 * glow.size; // 画布宽高，也是径向渐变的直径
            var radius = diameter / 2; // 径向渐变的半径
            canvasEl.width = diameter;
            canvasEl.height = diameter;
            var context = canvasEl.getContext('2d');
            // 从中心点且半径为 0 的圆渐变到半径为 radius 的圆
            var radioGradient = context.createRadialGradient(radius, radius, 0, radius, radius, radius);
            // 颜色（白色）增加率，将 intensity 反映到材质的 color 上
            // 当 intensity 大于 1 时，发光偏白（亮）
            // 当 intensity 小于 1 时，发光偏黑（暗）
            var incrementsRate = glow.intensity > 1 ?
                glow.intensity * 0.2 :
                glow.intensity - 1;
            var red = Math$1.clamp(glow.color.r * 255 * (1 + incrementsRate), 0, 255);
            var green = Math$1.clamp(glow.color.g * 255 * (1 + incrementsRate), 0, 255);
            var blue = Math$1.clamp(glow.color.b * 255 * (1 + incrementsRate), 0, 255);
            var rgbColor = "rgba(" + red + "," + green + "," + blue; // 计算出来 rgb 颜色，减少重复计算
            // 注意，glow 的 opacity 表示透明度
            // 而 rgba 的 alpha 表示不透明度
            radioGradient.addColorStop(0, rgbColor + ",1)");
            radioGradient.addColorStop(Math$1.mapLinear(diameter - glow.feature, 0, diameter, 1.0, 0.0), rgbColor + ",1)");
            radioGradient.addColorStop(1, rgbColor + ",0)");
            context.fillStyle = radioGradient;
            context.fillRect(0, 0, diameter, diameter);
            // 创建径向渐变的 2d canvas，作为点集的颜色贴图
            // 该贴图会作用给每个点
            material.map = new CanvasTexture(canvasEl);
            material.map.needsUpdate = true;
        }
        _this = _super.call(this, geometry, material) || this;
        Particle.prototype.constructor.call(_this, options);
        _this.verticesNumber = verticesNumber;
        _this.verticesSize = verticesSize;
        _this.vertices = vertices;
        _this.spread = spread;
        _this.colors = colors;
        _this.glow = glow;
        _this.options = options;
        _this.type = 'Points';
        return _this;
    }
    Points$$1.prototype.clone = function () {
        return new Points$$1(__assign({ verticesNumber: this.verticesNumber, verticesSize: this.verticesSize, vertices: this.vertices, spread: this.spread, colors: this.colors, material: this.material.clone(), glow: this.glow }, this.options));
    };
    Points$$1.TYPE = 'Points';
    return Points$$1;
}(Points));

var fontLoader = new FontLoader();
var textureLoader = new TextureLoader();
// cache
var fonts = {};
var textures = {};
var Loader = /** @class */ (function () {
    function Loader() {
    }
    // 加载字体
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
    // 加载材质
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
        var _b = _a.text, text = _b === void 0 ? 'Hello World' : _b, _c = _a.font, font = _c === void 0 ? './fonts/helvetiker_regular.typeface.json' : _c, _d = _a.size, size = _d === void 0 ? 10 : _d, _e = _a.height, height = _e === void 0 ? 10 : _e, _f = _a.curveSegments, curveSegments = _f === void 0 ? 12 : _f, _g = _a.bevelEnabled, bevelEnabled = _g === void 0 ? false : _g, _h = _a.bevelThickness, bevelThickness = _h === void 0 ? 10 : _h, _j = _a.bevelSize, bevelSize = _j === void 0 ? 8 : _j, _k = _a.bevelSegments, bevelSegments = _k === void 0 ? 3 : _k, _l = _a.material, material = _l === void 0 ? new MeshPhongMaterial() : _l, _m = _a.glow, glow = _m === void 0 ? null : _m, options = __rest(_a, ["text", "font", "size", "height", "curveSegments", "bevelEnabled", "bevelThickness", "bevelSize", "bevelSegments", "material", "glow"]);
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
        _this.glow = glow;
        _this.type = 'Text';
        Loader.loadFont(font, _this.active.bind(_this));
        return _this;
    }
    Text.prototype.active = function (font) {
        // 加载字体是异步行为
        // 因此需要向 Loader 传入回调函数
        // 加载完字体会调用该方法，创建文字的 geometry
        var options = {
            font: font,
            size: this.size,
            height: this.height,
            curveSegments: this.curveSegments,
            bevelEnabled: this.bevelEnabled,
            bevelThickness: this.bevelThickness,
            bevelSize: this.bevelSize,
            bevelSegments: this.bevelSegments,
        };
        this.geometry = new TextBufferGeometry(this.text, options);
        if (this.glow) {
            options.size *= this.glow.rate;
            this.add(new Mesh(new TextBufferGeometry(this.text, options), this.glow.getShaderMaterial()));
        }
        this.emitting = true;
    };
    Text.prototype.clone = function () {
        return new Text(__assign({ text: this.text, font: this.font, size: this.size, height: this.height, curveSegments: this.curveSegments, bevelEnabled: this.bevelEnabled, bevelThickness: this.bevelThickness, bevelSize: this.bevelSize, bevelSegments: this.bevelSegments, material: this.material.clone(), glow: this.glow }, this.options));
    };
    Text.TYPE = 'Text';
    return Text;
}(Mesh));

var Sprite$1 = /** @class */ (function (_super) {
    __extends(Sprite$$1, _super);
    function Sprite$$1(_a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.image, image = _b === void 0 ? './images/star.png' : _b, _c = _a.material, material = _c === void 0 ? new SpriteMaterial({
            map: Loader.loadTexture(image)
        }) : _c, options = __rest(_a, ["image", "material"]);
        var _this = _super.call(this, material) || this;
        Particle.prototype.constructor.call(_this, options);
        _this.image = image;
        _this.options = options;
        _this.type = 'Sprite';
        return _this;
    }
    Sprite$$1.prototype.clone = function () {
        return new Sprite$$1(__assign({ image: this.image, material: this.material.clone() }, this.options));
    };
    Sprite$$1.TYPE = 'Sprite';
    return Sprite$$1;
}(Sprite));

// 通用工具包
var Util = /** @class */ (function () {
    function Util() {
    }
    // 填充函数，用于将源头赋值给目标
    // 当目标是数组的时候，源头将同时赋值给数组内的每个元素
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
        return target;
    };
    // threejs 对象清除函数
    Util.dispose = function (object) {
        if (object.dispose) {
            object.dispose();
        }
        if (object instanceof Particle) {
            object.geometry.dispose();
            object.material.dispose();
        }
        if (Array.isArray(object.children)) {
            for (var i = object.children.length - 1; i >= 0; i--) {
                Util.dispose(object.children[i]);
            }
        }
        object = null;
    };
    // 深拷贝
    // 与一般深拷贝不同，该方法会优先认同传入对象的 clone 方法
    Util.clone = function (anything) {
        var _a;
        if (anything && anything.clone) {
            return anything.clone();
        }
        if (Array.isArray(anything)) {
            var array = Array.from({ length: anything.length });
            for (var i = anything.length - 1; i >= 0; i--) {
                array[i] = Util.clone(anything[i]);
            }
            return array;
        }
        else if (Object.prototype.toString.call(anything).toLowerCase() === '[object object]') {
            var object = {};
            for (var key in anything) {
                Object.assign(object, (_a = {}, _a[key] = Util.clone(object[key]), _a));
            }
            return object;
        }
        else {
            return anything;
        }
    };
    // 判断数组内元素是否都是特定类型
    Util.isElementsInstanceOf = function (array, type) {
        return Array.isArray(array) &&
            (array.length === 0 ||
                array.length > 0 && array.every(function (element) { return element instanceof type; }));
    };
    return Util;
}());

var Emitter = /** @class */ (function (_super) {
    __extends(Emitter, _super);
    function Emitter(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.emission, emission = _c === void 0 ? 100 : _c, _d = _b.status, status = _d === void 0 ? Emitter.STATUS_NORMAL : _d, _e = _b.isVerticalToDirection, isVerticalToDirection = _e === void 0 ? false : _e, _f = _b.mode, mode = _f === void 0 ? Emitter.MODE_DURATIOIN : _f, _g = _b.anchor, anchor = _g === void 0 ? new Vector3(0, 0, 0) : _g, _h = _b.particlesPositionRandom, particlesPositionRandom = _h === void 0 ? new Vector3(0, 0, 0) : _h, _j = _b.particlesOpacityRandom, particlesOpacityRandom = _j === void 0 ? 0 : _j, _k = _b.particlesOpacityKey, particlesOpacityKey = _k === void 0 ? [] : _k, _l = _b.particlesOpacityValue, particlesOpacityValue = _l === void 0 ? [] : _l, _m = _b.particlesColorRandom, particlesColorRandom = _m === void 0 ? new Color(0, 0, 0) : _m, _o = _b.particlesColorKey, particlesColorKey = _o === void 0 ? [] : _o, _p = _b.particlesColorValue, particlesColorValue = _p === void 0 ? [] : _p, _q = _b.particlesRotationRandom, particlesRotationRandom = _q === void 0 ? new Vector3(0, 0, 0) : _q, _r = _b.particlesRotationKey, particlesRotationKey = _r === void 0 ? [] : _r, _s = _b.particlesRotationValue, particlesRotationValue = _s === void 0 ? [] : _s, _t = _b.particlesScaleRandom, particlesScaleRandom = _t === void 0 ? new Vector3(0, 0, 0) : _t, _u = _b.particlesScaleKey, particlesScaleKey = _u === void 0 ? [] : _u, _v = _b.particlesScaleValue, particlesScaleValue = _v === void 0 ? [] : _v;
        var _this = _super.call(this) || this;
        _this.emission = emission;
        _this.isVerticalToDirection = isVerticalToDirection;
        _this.mode = mode;
        _this.status = status;
        _this.clock = new Clock();
        _this.clock.start();
        _this.particles = [];
        _this.physicals = [];
        _this.effects = [];
        _this.events = [];
        _this.anchor = anchor instanceof Vector3 ? anchor : new Vector3(anchor, anchor, anchor);
        _this.particlesPositionRandom = particlesPositionRandom instanceof Vector3 ? particlesPositionRandom : new Vector3(particlesPositionRandom, particlesPositionRandom, particlesPositionRandom);
        _this.particlesOpacityRandom = particlesOpacityRandom;
        _this.particlesOpacityKey = particlesOpacityKey;
        _this.particlesOpacityValue = particlesOpacityValue;
        _this.particlesColorRandom = particlesColorRandom instanceof Color ? particlesColorRandom : new Color(particlesColorRandom, particlesColorRandom, particlesColorRandom);
        _this.particlesColorKey = particlesColorKey;
        _this.particlesColorValue = Util.isElementsInstanceOf(particlesColorValue, Color) ?
            particlesColorValue :
            particlesColorValue.map(function (color) {
                return color >= 0 && color <= 1 ?
                    new Color(color, color, color) :
                    new Color(color);
            });
        _this.particlesRotationRandom = particlesRotationRandom;
        _this.particlesRotationKey = particlesRotationKey;
        _this.particlesRotationValue = Util.isElementsInstanceOf(particlesRotationValue, Vector3) ?
            particlesRotationValue :
            particlesRotationValue.map(function (rotation) { return new Vector3(rotation, rotation, rotation); });
        _this.particlesScaleRandom = particlesScaleRandom instanceof Vector3 ? particlesScaleRandom : new Vector3(particlesScaleRandom, particlesScaleRandom, particlesScaleRandom);
        _this.particlesScaleKey = particlesScaleKey;
        _this.particlesScaleValue = Util.isElementsInstanceOf(particlesScaleValue, Vector3) ?
            particlesScaleValue :
            particlesScaleValue.map(function (scale) { return new Vector3(scale, scale, scale); });
        _this.particlesTransformType = Emitter.TRANSFORM_LINEAR;
        _this.gap = 0;
        _this.type = 'Emitter';
        return _this;
    }
    // 新增样板粒子
    Emitter.prototype.addParticle = function (particle) {
        this.particles.push(particle);
    };
    Emitter.prototype.addParticles = function (particles) {
        for (var i = 0; i < particles.length; i++) {
            this.addParticle(particles[i]);
        }
    };
    Emitter.prototype.removeParticle = function (particle) {
        var index = this.particles.indexOf(particle);
        return index === -1 ? null : this.particles.splice(index, 1)[0];
    };
    // 新增物理场
    Emitter.prototype.addPhysical = function (physical) {
        this.physicals.push(physical);
    };
    Emitter.prototype.addPhysicals = function (physicals) {
        for (var i = 0; i < physicals.length; i++) {
            this.physicals.push(physicals[i]);
        }
    };
    Emitter.prototype.removePhysical = function (physical) {
        var index = this.physicals.indexOf(physical);
        return index === -1 ? null : this.physicals.splice(index, 1)[0];
    };
    // 新增特效场
    Emitter.prototype.addEffect = function (effect) {
        this.effects.push(effect);
    };
    Emitter.prototype.addEffects = function (effects) {
        for (var i = 0; i < effects.length; i++) {
            this.effects.push(effects[i]);
        }
    };
    Emitter.prototype.removeEffect = function (effect) {
        var index = this.effects.indexOf(effect);
        return index === -1 ? null : this.effects.splice(index, 1)[0];
    };
    // 新增交互事件
    Emitter.prototype.addEvent = function (event) {
        this.events.push(event);
    };
    Emitter.prototype.addEvents = function (events) {
        for (var i = 0; i < events.length; i++) {
            this.events.push(events[i]);
        }
    };
    Emitter.prototype.removeEvent = function (event) {
        var index = this.events.indexOf(event);
        return index === -1 ? null : this.events.splice(index, 1)[0];
    };
    // 开始发射粒子，默认为开启
    Emitter.prototype.start = function () {
        this.status = Emitter.STATUS_NORMAL;
    };
    // 暂停发射粒子
    Emitter.prototype.stop = function () {
        this.status = Emitter.STATUS_STOP;
    };
    Emitter.prototype.freeze = function () {
        this.status = Emitter.STATUS_FROZEN;
    };
    // 生成粒子
    Emitter.prototype.generate = function () {
        // 发射器进行打点
        var delta = this.clock.getDelta(); // 距离上一次发射粒子过去的时间差
        var deltaEmission = 0; // 该时间差需要发射多少粒子
        var particlesNumber = this.particles.length;
        var generatedParticles = [];
        // 当发射器处于发射状态，且粒子样本数量大于 0 时，才会进行粒子创建
        if (this.status === Emitter.STATUS_NORMAL && particlesNumber > 0) {
            switch (this.mode) {
                case Emitter.MODE_DURATIOIN: {
                    // 持续发射模式
                    // 通过打点时间差计算得到本次 update 需要补充多少粒子
                    deltaEmission = Math.floor((delta + this.gap) * this.emission);
                    if (deltaEmission === 0) {
                        // 应该发射粒子数量为 0，且已发射的例子数量过少
                        // 出现这种情况是因为每次发射器 update 消耗时间过小
                        // 进而导致 delta 过小，计算出来的 deltaEmission 为 0
                        this.gap += delta;
                    }
                    else {
                        // 计算出来应发射粒子数大于 0
                        // 属于正常情况，所以清空 gap
                        this.gap = 0;
                    }
                    break;
                }
                case Emitter.MODE_EXPLOSION: {
                    // 爆炸式发射模式
                    // 当粒子全部清除干净的时候一次性发射所有粒子
                    if (this.children.length === 0) {
                        deltaEmission = this.emission;
                    }
                    break;
                }
                default:
            }
            // 新增粒子
            // 基类 Emitter 不会初始化粒子的位置和方向等参数，
            // 只会负责生成例子，而由子类来实现粒子的参数
            for (var i = 0; i < deltaEmission; i++) {
                var randomParticle = this.particles[Math$1.randInt(0, particlesNumber - 1)]; // 从 particles 内随机取出一个粒子作为样本
                randomParticle.onBeforeCreated(); // 调用生命周期钩子
                var generatedRandomParticle = randomParticle.clone();
                generatedRandomParticle.matrixAutoUpdate = false; // 为了提高效率，在这里关闭 matrix 的自动更新，手动控制更新时机
                generatedRandomParticle.onAfterCreated(); // 调用生命周期钩子
                if (generatedRandomParticle.emitting) {
                    // 外层会进行一次 emitting 判断，控制发射器是否可以发射粒子
                    // 这里也会进行一次判断，判断该粒子是否可以被发射器发射
                    // 这里是因为 Text 粒子需要加载字体
                    // 字体未加载完成之前不能添加到场景中
                    // 用粒子的 emitting 属性标记是否可以进行发射
                    generatedParticles.push(generatedRandomParticle);
                    this.add(generatedRandomParticle);
                }
                else {
                    // 粒子无法进行发射，则清除掉
                    Util.dispose(generatedRandomParticle);
                }
            }
        }
        // 返回生成的粒子，用于在子类内进行二次修改
        return generatedParticles;
    };
    // 更新粒子
    Emitter.prototype.update = function () {
        if (this.status === Emitter.STATUS_FROZEN)
            return;
        // 触发事件
        // 在更新方法前面部分判定触发，因为关闭了粒子的矩阵自动计算
        for (var i = 0; i < this.events.length; i++) {
            this.events[i].effect(this.children, this);
        }
        for (var i = this.children.length - 1; i >= 0; i--) {
            var particle = this.children[i];
            if (!particle.emitting)
                continue;
            // 粒子从出生到现在所经过的时间（单位：秒）
            var elapsedTime = particle.clock.elapsedTime;
            // 获得粒子距离上次更新的时间差
            var elapsedTimePercentage = elapsedTime % particle.life / particle.life;
            // 获得查询百分比函数
            var interpolationFunction = Emitter.getInterpolationFunction(this.particlesTransformType);
            // 设置粒子属性随机值
            // 粒子透明度
            for (var j = 0; j < this.particlesOpacityKey.length - 1; j++) {
                if (elapsedTimePercentage >= this.particlesOpacityKey[j] && elapsedTimePercentage < this.particlesOpacityKey[j + 1]) {
                    var opacityPercentage = interpolationFunction(elapsedTimePercentage, this.particlesOpacityKey[j], this.particlesOpacityKey[j + 1]);
                    particle.material.opacity = Math$1.lerp(this.particlesOpacityValue[j], this.particlesOpacityValue[j + 1], opacityPercentage) + Math$1.randFloatSpread(this.particlesOpacityRandom);
                    break;
                }
            }
            // 粒子颜色
            for (var j = 0; j < this.particlesColorKey.length - 1; j++) {
                if (elapsedTimePercentage >= this.particlesColorKey[j] && elapsedTimePercentage < this.particlesColorKey[j + 1]) {
                    var preColor = this.particlesColorValue[j];
                    var nextColor = this.particlesColorValue[j + 1];
                    var colorPercentage = interpolationFunction(elapsedTimePercentage, this.particlesColorKey[j], this.particlesColorKey[j + 1]);
                    particle.material.color = new Color(Math$1.lerp(preColor.r, nextColor.r, colorPercentage) + Math$1.randFloatSpread(this.particlesColorRandom.r), Math$1.lerp(preColor.g, nextColor.g, colorPercentage) + Math$1.randFloatSpread(this.particlesColorRandom.g), Math$1.lerp(preColor.b, nextColor.b, colorPercentage) + Math$1.randFloatSpread(this.particlesColorRandom.b));
                    break;
                }
            }
            // 粒子位置
            if (this.particlesPositionRandom) {
                particle.position.add(new Vector3(Math$1.randFloatSpread(this.particlesPositionRandom.x), Math$1.randFloatSpread(this.particlesPositionRandom.y), Math$1.randFloatSpread(this.particlesPositionRandom.z)));
            }
            // 粒子旋转
            for (var j = 0; j < this.particlesRotationKey.length - 1; j++) {
                if (elapsedTimePercentage >= this.particlesRotationKey[j] && elapsedTimePercentage < this.particlesRotationKey[j + 1]) {
                    var preRotation = this.particlesRotationValue[j];
                    var nextRotation = this.particlesRotationValue[j + 1];
                    var rotationPercentage = interpolationFunction(elapsedTimePercentage, this.particlesRotationKey[j], this.particlesRotationKey[j + 1]);
                    particle.rotateX(Math$1.lerp(preRotation.x, nextRotation.x, rotationPercentage) + Math$1.randFloatSpread(this.particlesRotationRandom.x));
                    particle.rotateY(Math$1.lerp(preRotation.y, nextRotation.y, rotationPercentage) + Math$1.randFloatSpread(this.particlesRotationRandom.y));
                    particle.rotateZ(Math$1.lerp(preRotation.z, nextRotation.z, rotationPercentage) + Math$1.randFloatSpread(this.particlesRotationRandom.z));
                    break;
                }
            }
            // 粒子缩放
            for (var j = 0; j < this.particlesScaleKey.length - 1; j++) {
                if (elapsedTimePercentage >= this.particlesScaleKey[j] && elapsedTimePercentage < this.particlesScaleKey[j + 1]) {
                    var preScale = this.particlesScaleValue[j];
                    var nextScale = this.particlesScaleValue[j + 1];
                    var scalePercentage = interpolationFunction(elapsedTimePercentage, this.particlesScaleKey[j], this.particlesScaleKey[j + 1]);
                    // 缩放值不应该为 0 ,否则 three 无法计算 Matrix3 的逆，控制台报警告
                    // https://github.com/aframevr/aframe-inspector/issues/524
                    particle.scale.set((Math$1.lerp(preScale.x, nextScale.x, scalePercentage) + Math$1.randFloatSpread(this.particlesScaleRandom.x)) || 0.00001, (Math$1.lerp(preScale.y, nextScale.y, scalePercentage) + Math$1.randFloatSpread(this.particlesScaleRandom.y)) || 0.00001, (Math$1.lerp(preScale.z, nextScale.z, scalePercentage) + Math$1.randFloatSpread(this.particlesScaleRandom.z)) || 0.00001);
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
                case Line$1.TYPE: {
                    // 线段的运动是最前面的点更新值
                    // 其后的所有点紧随前面一个的点的位置
                    var line = particle;
                    var positionAttribute = line.geometry.getAttribute('position');
                    var positionArray = positionAttribute.array;
                    var verticesNumber = line.verticesNumber;
                    var verticesSize = line.verticesSize;
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
                    positionAttribute.needsUpdate = true;
                    break;
                }
                default: {
                    particle.position.addScaledVector(particle.direction, particle.velocity);
                }
            }
            // 粒子朝向
            if (this.isVerticalToDirection) {
                // 修改粒子朝向，使其垂直于运动方向
                var angle = particle.up.angleTo(particle.direction) + 1.5707963267948966; // 1.57 即 90deg
                var axis = particle.direction.clone().cross(particle.up);
                particle.setRotationFromAxisAngle(axis, angle);
            }
            // 生成与更新残影
            if (particle.afterimage && particle.afterimage.number > 0) {
                var isLine = particle.type === Line$1.TYPE; // 当粒子类型是线段时，有另一套处理方法
                if (elapsedTime > particle.afterimage.delay - particle.afterimage.interval) {
                    if (isLine) {
                        // 当粒子类型是线段时，直接将每个端点的位置复制下来
                        var positionArray = particle.geometry.getAttribute('position').array;
                        var cloneArray = Array.from({ length: positionArray.length });
                        for (var j = 0; j < positionArray.length; j++) {
                            cloneArray[j] = positionArray[j];
                        }
                        particle.afterimage.positionArrays.push(cloneArray);
                    }
                    else {
                        // 将粒子的世界矩阵记录下来，作为残影的运动轨迹
                        particle.afterimage.matrixWorlds.push(particle.matrixWorld.clone());
                    }
                }
                if (elapsedTime > particle.afterimage.delay) {
                    // 先计算还需要生成的残影的数量
                    // 用总共需要生成的残影数量减去已经生成的残影数量
                    // 点集的发光特效与其他粒子不同，是通过 material.map 来实现，因此不会添加进 children 数组内
                    var generatedGlowNumber = (particle.glow && particle.type !== Points$1.TYPE) ? 1 : 0;
                    var generatedAfterimageNumber = particle.children.length - generatedGlowNumber; // 已经生成的残影数量
                    var needGeneratedAfterimageNumber = Math.min(Math.floor((elapsedTime - particle.afterimage.delay) / particle.afterimage.interval) + 1, particle.afterimage.number)
                        - generatedAfterimageNumber;
                    // 生成新的残影粒子
                    for (var j = 0; j < needGeneratedAfterimageNumber; j++) {
                        var afterimageParticle = particle.clone();
                        Util.dispose(afterimageParticle.children.splice(generatedGlowNumber)); // 只保留残影子物体中的发光物体就行
                        // 残影形变（位置、缩放、旋转）直接设置，不需要通过 position scale rotation 计算
                        // afterimageParticle.matrixWorldNeedsUpdate = false;
                        afterimageParticle.matrixAutoUpdate = false;
                        // 设置残影的不透明度
                        afterimageParticle.material.transparent = true;
                        afterimageParticle.material.opacity = Math.max(0, particle.material.opacity - particle.afterimage.attenuation * (j + 1 + generatedAfterimageNumber));
                        particle.add(afterimageParticle);
                    }
                    // 更新残影粒子位置
                    if (isLine) {
                        for (var j = particle.children.length - 1; j >= generatedGlowNumber; j--) {
                            var afterimageParticle = particle.children[j];
                            var afterimageParticlePositionAttribute = afterimageParticle.geometry.getAttribute('position');
                            var afterimageParticlePositionArray = afterimageParticlePositionAttribute.array;
                            var positionArray = particle.afterimage.positionArrays[afterimageParticle.afterimagePositionArrayIndex];
                            for (var m = 0; m < afterimageParticle.verticesNumber; m++) {
                                for (var n = 0; n < afterimageParticle.verticesSize; n++) {
                                    var index = m * afterimageParticle.verticesSize + n;
                                    afterimageParticlePositionArray[index] = positionArray[index];
                                }
                            }
                            afterimageParticlePositionAttribute.needsUpdate = true;
                            afterimageParticle.afterimagePositionArrayIndex++;
                        }
                    }
                    else {
                        // 无法直接设置残影粒子的世界矩阵，只能通过设置本地矩阵后与父物体的世界矩阵相乘得到
                        // matrix 代表物体的形变，matrixWorld 表示自身形变加上父物体形变的最终结果
                        // matrix * parent.matrixWorld = matrixWorld
                        // => matrix = matrixWorld * (parent.matrixWorld 的逆矩阵)
                        // 表示意义为：残影此刻的本地矩阵 * 父物体此刻的世界矩阵 = 若干秒前物体的世界矩阵
                        // "父物体此刻的世界矩阵" 和 "若干秒前物体的世界矩阵" 已知，便可求物体当前时刻的本地矩阵
                        for (var j = particle.children.length - 1; j >= generatedGlowNumber; j--) {
                            var afterimageParticle = particle.children[j];
                            afterimageParticle.matrix.copy(particle.afterimage.matrixWorlds[afterimageParticle.afterimageMatrixWorldIndex].clone()
                                .multiply(new Matrix4().getInverse(particle.matrixWorld)));
                            afterimageParticle.afterimageMatrixWorldIndex++; // 残影行迹轨迹向前一步
                        }
                    }
                }
            }
            particle.material.needsUpdate = true;
            particle.updateMatrix(); // 粒子形变处理完成，更新 matrix
        }
    };
    Emitter.prototype.clear = function (particle) {
        // 清除指定的粒子
        particle.onBeforeDestroyed();
        this.remove(particle);
        particle.onAfterDestroyed();
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
    // 获得差值方程
    Emitter.getInterpolationFunction = function (particlesTransformType) {
        switch (particlesTransformType) {
            case Emitter.TRANSFORM_LINEAR: return function (value, min, max) { return (value - min) / (max - min); };
            case Emitter.TRANSFORM_SMOOTH: return Math$1.smoothstep;
            case Emitter.TRANSFORM_SMOOTHER: return Math$1.smootherstep;
            default: return function () { return 0; };
        }
    };
    Emitter.MODE_DURATIOIN = 0; // 持续发射
    Emitter.MODE_EXPLOSION = 1; // 爆炸失发射
    Emitter.TRANSFORM_LINEAR = 0; // 线性插值
    Emitter.TRANSFORM_SMOOTH = 1; // 平滑插值
    Emitter.TRANSFORM_SMOOTHER = 2; // 更平滑的插值
    Emitter.STATUS_NORMAL = 0;
    Emitter.STATUS_STOP = 1;
    Emitter.STATUS_FROZEN = 2;
    return Emitter;
}(Object3D));

// 爆炸发射器
// 发射类型固定位一个点
var ExplosionEmitter = /** @class */ (function (_super) {
    __extends(ExplosionEmitter, _super);
    function ExplosionEmitter(_a) {
        if (_a === void 0) { _a = {}; }
        var options = __rest(_a, []);
        var _this = _super.call(this, options || {}) || this;
        _this.type = 'ExplosionEmitter';
        return _this;
    }
    ExplosionEmitter.prototype.generate = function () {
        var generatedParticles = _super.prototype.generate.call(this);
        var generatedParticlePosition = [this.anchor.x, this.anchor.y, this.anchor.z];
        for (var i = 0; i < generatedParticles.length; i++) {
            var generatedParticle = generatedParticles[i];
            switch (generatedParticle.type) {
                case Line$1.TYPE: {
                    var line = generatedParticle;
                    var positionAttribute = line.geometry.getAttribute('position');
                    var positionArray = positionAttribute.array;
                    for (var m = 0; m < line.verticesNumber; m++) {
                        for (var n = 0; n < line.verticesSize; n++) {
                            var index = m * line.verticesSize + n; // 获得索引，避免重复计算
                            positionArray[index] = index < line.vertices.length ?
                                line.vertices[index] :
                                generatedParticlePosition[n];
                        }
                    }
                    positionAttribute.dynamic = true;
                    positionAttribute.needsUpdate = true;
                    break;
                }
                default:
            }
            generatedParticle.direction = new Vector3(Math$1.randFloatSpread(1), Math$1.randFloatSpread(1), Math$1.randFloatSpread(1)).normalize();
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
        var _b = _a.direction, direction = _b === void 0 ? new Vector3(0, 0, -1) : _b, _c = _a.spread, spread = _c === void 0 ? new Vector3(0, 0, 0) : _c, _d = _a.radius, radius = _d === void 0 ? new Vector3(0, 0, 0) : _d, _e = _a.emitType, emitType = _e === void 0 ? DirectionEmitter.EMIT_TYPE_SHPERE : _e, options = __rest(_a, ["direction", "spread", "radius", "emitType"]);
        var _this = _super.call(this, options || {}) || this;
        _this.direction = direction.normalize();
        _this.spread = spread instanceof Vector3 ? spread : new Vector3(spread, spread, spread);
        _this.radius = radius instanceof Vector3 ? radius : new Vector3(radius, radius, radius);
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
        var baseVector3 = new Vector3(0, 0, 1); // 将粒子放在 x-y 平面上
        var angle = this.direction.angleTo(baseVector3); // 发生器发射方向和 x-y 平面的夹角
        var axis = baseVector3.cross(this.direction); // 垂直于 direction 和 baseVector3 的法线
        var generatedParticles = _super.prototype.generate.call(this);
        for (var i = 0; i < generatedParticles.length; i++) {
            var generatedParticle = generatedParticles[i];
            // 初始化粒子位置
            // 设置为数组而不是 THREE.Vector3 是为了方便在循环体内操作
            // 默认情况设置为球形
            var generatedParticlePosition = [
                this.anchor.x + Math$1.randFloatSpread(this.radius.x),
                this.anchor.y + Math$1.randFloatSpread(this.radius.y),
                this.anchor.z + Math$1.randFloatSpread(this.radius.z)
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
                    var generatedParticleVector = new Vector3(generatedParticlePosition[0], generatedParticlePosition[1], this.anchor.z);
                    generatedParticleVector.applyAxisAngle(axis, angle);
                    generatedParticlePosition[0] = generatedParticleVector.x;
                    generatedParticlePosition[1] = generatedParticleVector.y;
                    generatedParticlePosition[2] = generatedParticleVector.z;
                    break;
                }
                default:
            }
            switch (generatedParticle.type) {
                case Line$1.TYPE: {
                    // 对于线段来说，position 属性并不生效
                    // 生效的是 geometry.getAttribute('position')
                    var line = generatedParticle;
                    var positionAttribute = line.geometry.getAttribute('position');
                    var positionArray = positionAttribute.array;
                    for (var m = 0; m < line.verticesNumber; m++) {
                        for (var n = 0; n < line.verticesSize; n++) {
                            var index = m * line.verticesSize + n; // 获得索引，避免重复计算
                            positionArray[index] = index < line.vertices.length ?
                                line.vertices[index] :
                                generatedParticlePosition[n];
                        }
                    }
                    positionAttribute.dynamic = true;
                    positionAttribute.needsUpdate = true;
                    break;
                }
                default:
            }
            generatedParticle.position.set(generatedParticlePosition[0], generatedParticlePosition[1], generatedParticlePosition[2]);
            // 初始化粒子方向
            generatedParticles[i].direction = new Vector3(this.direction.x + Math$1.randFloatSpread(this.spread.x), this.direction.y + Math$1.randFloatSpread(this.spread.y), this.direction.z + Math$1.randFloatSpread(this.spread.z)).normalize();
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

// 盒子发射器
var BoxEmitter = /** @class */ (function (_super) {
    __extends(BoxEmitter, _super);
    function BoxEmitter(_a) {
        var _b = _a.width, width = _b === void 0 ? 5 : _b, _c = _a.height, height = _c === void 0 ? 5 : _c, _d = _a.thickness, thickness = _d === void 0 ? 5 : _d, _e = _a.side, side = _e === void 0 ? 0 : _e, options = __rest(_a, ["width", "height", "thickness", "side"]);
        var _this = _super.call(this, options || {}) || this;
        _this.width = width;
        _this.height = height;
        _this.thickness = thickness;
        _this.side = side;
        _this.type = 'BoxEmitter';
        return _this;
    }
    BoxEmitter.prototype.generate = function () {
        var _this = this;
        var generatedParticles = _super.prototype.generate.call(this);
        // 设置随机函数
        var randFn = function (range) {
            switch (_this.side) {
                case BoxEmitter.SIDE_BOTH: return Math$1.randFloatSpread(range);
                case BoxEmitter.SIDE_TOP: return Math$1.randFloat(0, range);
                case BoxEmitter.SIDE_BOTTOM: return Math$1.randFloat(-range, 0);
                default: return 0;
            }
        };
        for (var i = 0; i < generatedParticles.length; i++) {
            var generatedParticle = generatedParticles[i];
            // 初始化粒子位置
            generatedParticle.position.set(this.anchor.x + randFn(this.width), this.anchor.y + randFn(this.height), this.anchor.z + randFn(this.thickness));
            // 初始化粒子方向
            generatedParticle.direction.set(Math$1.randFloatSpread(1), randFn(1), Math$1.randFloatSpread(1)).normalize();
        }
        return generatedParticles;
    };
    BoxEmitter.prototype.update = function () {
        // 生成粒子
        this.generate();
        // 清除生命周期已经结束的粒子
        _super.prototype.clearAll.call(this);
        // 通用属性更新
        _super.prototype.update.call(this);
        // 特有属性更新
    };
    BoxEmitter.SIDE_BOTH = 0; // 两边发射
    BoxEmitter.SIDE_TOP = 1; // 顶部发射
    BoxEmitter.SIDE_BOTTOM = 2; // 底部发射
    return BoxEmitter;
}(Emitter));

var TextEmitter = /** @class */ (function (_super) {
    __extends(TextEmitter, _super);
    function TextEmitter(_a) {
        var _b = _a.text, text = _b === void 0 ? 'Hello World' : _b, _c = _a.font, font = _c === void 0 ? './fonts/helvetiker_regular.typeface.json' : _c, _d = _a.size, size = _d === void 0 ? 10 : _d, _e = _a.height, height = _e === void 0 ? 10 : _e, _f = _a.curveSegments, curveSegments = _f === void 0 ? 12 : _f, _g = _a.bevelEnabled, bevelEnabled = _g === void 0 ? false : _g, _h = _a.bevelThickness, bevelThickness = _h === void 0 ? 10 : _h, _j = _a.bevelSize, bevelSize = _j === void 0 ? 8 : _j, _k = _a.bevelSegments, bevelSegments = _k === void 0 ? 3 : _k, options = __rest(_a, ["text", "font", "size", "height", "curveSegments", "bevelEnabled", "bevelThickness", "bevelSize", "bevelSegments"]);
        var _this = _super.call(this, options || {}) || this;
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
        _this.geometry = null;
        _this.type = 'TextEmitter';
        Loader.loadFont(font, function (font) {
            _this.geometry = new TextBufferGeometry(_this.text, {
                font: font,
                size: _this.size,
                height: _this.height,
                curveSegments: _this.curveSegments,
                bevelEnabled: _this.bevelEnabled,
                bevelThickness: _this.bevelThickness,
                bevelSize: _this.bevelSize,
                bevelSegments: _this.bevelSegments,
            });
            _this.emitting = true;
        });
        return _this;
    }
    TextEmitter.prototype.generate = function () {
        // 存在用户手动将 emitting 打开的情况
        // 若不加控制，则会产生异常
        if (!this.geometry) {
            return [];
        }
        var generatedParticles = _super.prototype.generate.call(this);
        var textPositionArray = this.geometry.getAttribute('position').array;
        var textPositionArrayLength = textPositionArray.length;
        for (var i = 0; i < generatedParticles.length; i++) {
            var generatedParticle = generatedParticles[i];
            // 初始化粒子位置
            // 获得倍数为 3 的随机 index
            var randomIndex = Math.floor(Math$1.randInt(0, textPositionArrayLength) / 3) * 3;
            switch (generatedParticle.type) {
                case Points$1.TYPE:
                case Line$1.TYPE: {
                    // Line 或者 Points 的情况，将 Line 或 Points 所有端点的所有位置放在随机取得的点上
                    var lineOrPoints = generatedParticle;
                    var positionAttribute = lineOrPoints.geometry.getAttribute('position');
                    var positionArray = positionAttribute.array;
                    for (var m = 0; m < lineOrPoints.verticesNumber; m++) {
                        for (var n = 0; n < lineOrPoints.verticesSize; n++) {
                            var index = m * lineOrPoints.verticesSize + n; // 获得索引，避免重复计算
                            positionArray[index] = index < lineOrPoints.vertices.length ?
                                lineOrPoints.vertices[index] :
                                textPositionArray[randomIndex + n];
                        }
                    }
                    positionAttribute.dynamic = true;
                    positionAttribute.needsUpdate = true;
                    break;
                }
                default: {
                    generatedParticle.position.set(this.anchor.x + textPositionArray[randomIndex], this.anchor.y + textPositionArray[randomIndex + 1], this.anchor.z + textPositionArray[randomIndex + 2]);
                }
            }
            // 初始化粒子方向
            generatedParticle.direction.set(Math$1.randFloatSpread(1), Math$1.randFloatSpread(1), Math$1.randFloatSpread(1)).normalize();
        }
        return generatedParticles;
    };
    TextEmitter.prototype.update = function () {
        // 生成粒子
        this.generate();
        // 清除生命周期已经结束的粒子
        _super.prototype.clearAll.call(this);
        // 通用属性更新
        _super.prototype.update.call(this);
        // 特有属性更新
    };
    return TextEmitter;
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
        var _b = _a.direction, direction = _b === void 0 ? new Vector3(0, -1, 0) : _b, _c = _a.gravity, gravity = _c === void 0 ? 9.8 : _c, _d = _a.floor, floor = _d === void 0 ? null : _d, _e = _a.bounce, bounce = _e === void 0 ? .5 : _e, _f = _a.firction, firction = _f === void 0 ? 1 : _f, _g = _a.event, event = _g === void 0 ? Gravity.EVENT_NONE : _g, _h = _a.onBeforeEvent, onBeforeEvent = _h === void 0 ? function (particle) { } : _h, _j = _a.onAfterEvent, onAfterEvent = _j === void 0 ? function (particle) { } : _j, options = __rest(_a, ["direction", "gravity", "floor", "bounce", "firction", "event", "onBeforeEvent", "onAfterEvent"]);
        var _this = _super.call(this, options || {}) || this;
        _this.direction = direction.normalize(); // 重力默认为 y 轴负方向
        _this.floor = floor;
        _this.bounce = bounce;
        _this.firction = firction;
        _this.gravity = gravity;
        _this.event = event;
        _this.onBeforeEvent = onBeforeEvent;
        _this.onAfterEvent = onAfterEvent;
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
        var originDirection = particle.direction.clone(); // 受重力影响前的粒子运动方向
        var originVelocity = particle.velocity; // 受重力影响前的粒子速率
        // 粒子被重力场所影响，方向发生偏移
        particle.direction.multiplyScalar(particle.velocity).add(this.direction
            .clone()
            .multiplyScalar(this.gravity * elapsedTime)).normalize();
        // 存在地面且有碰撞事件
        if (this.floor && this.event !== Gravity.EVENT_NONE) {
            // 使用受重力影响前的粒子运动方向进行计算
            // 避免重力影响下方向产生重大变化（比如平行 -> 斜线）
            var originPosition = particle.position.clone();
            // 当粒子是折线的时候
            // 折线的位置永远不变
            // 因此参考依据为折线第一个点的位置
            if (particle.type === Line$1.TYPE) {
                var positionArray = particle.geometry.getAttribute('position').array;
                originPosition.set(positionArray[0], positionArray[1], positionArray[2]);
            }
            var ray = new Ray(originPosition, originDirection); // 粒子运动方向射线
            var distance = this.floor.distanceToPoint(originPosition); // 粒子与地面的距离（地面上为正，地面下为负）
            var angle = originDirection.angleTo(this.floor.normal); // 粒子方向与地面法线的弧度
            // 1、若事件为粒子消失，则直接移除
            // 2、若为弹起事件
            //   2.1、若已经无法弹起则产生摩擦
            //   2.2、与地面进行碰撞后反弹
            // 如果和地面距离接近
            // 且粒子是射入平面方向
            // 则判定为与地面产生了碰撞
            if (ray.intersectsPlane(this.floor) &&
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
                            var lostVelocity = originVelocity * this.firction * elapsedTime; // 受摩擦力影响损失的速率
                            var firctionedVelocity = originVelocity - lostVelocity; // 减去损失的速率后的粒子最终速率              
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
                        }
                        else if (angle < .1 && particle.velocity < .1) {
                            // 如果粒子运动方向与地面接近垂直，且速率小于 0.1
                            particle.velocity = 0;
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
                            particle.velocity = this.bounce * originVelocity;
                            particle.direction.reflect(this.floor.normal);
                        }
                    }
                }
                this.onAfterEvent(particle);
            }
        }
    };
    Gravity.EVENT_NONE = 0; // 无事件
    Gravity.EVENT_BOUNCE = 1; // 弹跳事件
    Gravity.EVENT_DISAPPEAR = 2; // 消失事件
    Gravity.EVENT_STICK = 3; // 粘附事件
    return Gravity;
}(Physcial));

var Wind = /** @class */ (function (_super) {
    __extends(Wind, _super);
    function Wind(_a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.direction, direction = _b === void 0 ? new Vector3(1, 0, 0) : _b, _c = _a.intensity, intensity = _c === void 0 ? new Vector3(1, 1, 1) : _c, _d = _a.spread, spread = _d === void 0 ? new Vector3(0, 0, 0) : _d, options = __rest(_a, ["direction", "intensity", "spread"]);
        var _this = _super.call(this, options || {}) || this;
        _this.direction = direction;
        _this.intensity = intensity instanceof Vector3 ? intensity : new Vector3(intensity, intensity, intensity);
        _this.spread = spread instanceof Vector3 ? spread : new Vector3(spread, spread, spread);
        _this.type = 'Wind';
        return _this;
    }
    Wind.prototype.effect = function (particle, emitter) {
        _super.prototype.effect.call(this, particle, emitter);
        var x = (this.direction.x + Math$1.randFloatSpread(this.spread.x)) * this.intensity.x;
        var y = (this.direction.y + Math$1.randFloatSpread(this.spread.y)) * this.intensity.y;
        var z = (this.direction.z + Math$1.randFloatSpread(this.spread.z)) * this.intensity.z;
        particle.velocity = particle.direction.multiplyScalar(particle.velocity).add(new Vector3(x, y, z)).length();
        // 如果速度等于 0，直接返回，除数不能为 0
        if (particle.velocity === 0)
            return;
        particle.direction.divideScalar(particle.velocity); // 单位向量化
    };
    return Wind;
}(Physcial));

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
            case Line$1.TYPE:
            case Points$1.TYPE: {
                // 扰乱折线或者点集各个点的位置
                // 而不是影响粒子位置
                // 因为 particle.position 是整个粒子的位置属性
                var positionAttribute = particle.geometry.getAttribute('position');
                var positionArray = positionAttribute.array;
                for (var i = positionArray.length - 1; i >= 0; i--) {
                    positionArray[i] += Math$1.randFloatSpread(this.intensity);
                }
                positionAttribute.needsUpdate = true;
                break;
            }
            default: {
                particle.position.addScalar(Math$1.randFloatSpread(this.intensity));
            }
        }
    };
    return Turbulent;
}(Effect));

// 粒子发光特效
var Glow = /** @class */ (function (_super) {
    __extends(Glow, _super);
    function Glow(_a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.opacity, opacity = _b === void 0 ? 0.5 : _b, _c = _a.intensity, intensity = _c === void 0 ? 1 : _c, _d = _a.rate, rate = _d === void 0 ? 1.1 : _d, _e = _a.feature, feature = _e === void 0 ? 5 : _e, _f = _a.color, color = _f === void 0 ? new Color(0x00ffff) : _f, options = __rest(_a, ["opacity", "intensity", "rate", "feature", "color"]);
        var _this = _super.call(this, options || {}) || this;
        _this.opacity = opacity;
        _this.intensity = intensity;
        _this.color = color;
        _this.feature = feature;
        _this.rate = rate;
        // intensity 应该为 [-5, 5]
        // abs(intensity) > 5 时，值再大变化效果也不明显
        _this.scale = -intensity;
        // 当 scale 为 5 时，不透明度基本上都为 1
        // 因此将 bias 根据 scale ，让 scale 从区间 0 - 5 映射到 bias 从区间 1 - 0
        _this.bias = Math$1.mapLinear(intensity, 0, 5, 1.0, 0.0);
        _this.power = 5 / feature;
        _this.type = 'Glow';
        return _this;
    }
    // 根据 glow 的参数生成着色器材质
    // 并不是很好的解决方法，目前是为了减少重复编码
    Glow.prototype.getShaderMaterial = function () {
        return new ShaderMaterial({
            uniforms: {
                'scale': { type: 'f', value: this.scale },
                'bias': { type: 'f', value: this.bias },
                'power': { type: 'f', value: this.power },
                'opacity': { type: 'f', value: this.opacity },
                color: { type: 'c', value: this.color }
            },
            vertexShader: Glow.vertexShader,
            fragmentShader: Glow.fragmentShader,
            blending: AdditiveBlending,
            transparent: true
        });
    };
    // from: https://zhuanlan.zhihu.com/p/38548428
    Glow.vertexShader = "\n\t\tvarying vec3 vNormal;\n\t\tvarying vec3 vPositionNormal;\n\t\tvoid main() \n\t\t{\n\t\t  vNormal = normalize( normalMatrix * normal ); // \u8F6C\u6362\u5230\u89C6\u56FE\u7A7A\u95F4\n\t\t  vPositionNormal = normalize(( modelViewMatrix * vec4( position, 1.0) ).xyz);\n\t\t  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t\t}\n\t";
    Glow.fragmentShader = "\n\t\tuniform vec3 color;\n\t\tuniform float opacity;\n\t\tuniform float bias;\n\t\tuniform float power;\n\t\tuniform float scale;\n\t\tvarying vec3 vNormal;\n\t\tvarying vec3 vPositionNormal;\n\t\tvoid main() \n\t\t{\n      // Empricial \u83F2\u6D85\u5C14\u8FD1\u4F3C\u7B49\u5F0F\n      // \u8BA1\u7B97\u5F97\u5230\u7247\u6BB5\u7740\u8272\u7684\u900F\u660E\u5EA6\n      float alpha = pow( bias + scale * abs(dot(vNormal, vPositionNormal)), power );\n\t\t  gl_FragColor = vec4( color, alpha * opacity );\n\t\t}\n\t";
    return Glow;
}(Effect));

var Event = /** @class */ (function () {
    function Event(_a) {
        _a = {};
    }
    Event.prototype.effect = function (particles, emitter) {
    };
    return Event;
}());

var renderers = [];
var raycasters = [];
var mouses = [];
var MouseEvent = /** @class */ (function (_super) {
    __extends(MouseEvent, _super);
    function MouseEvent(_a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.camera, camera = _b === void 0 ? null : _b, _c = _a.renderer, renderer = _c === void 0 ? null : _c, _d = _a.onMouseEnter, onMouseEnter = _d === void 0 ? function (particles) { } : _d, _e = _a.onMouseMove, onMouseMove = _e === void 0 ? function (particles) { } : _e, _f = _a.onMouseLeave, onMouseLeave = _f === void 0 ? function (particles) { } : _f, _g = _a.onMouseClick, onMouseClick = _g === void 0 ? function (particles) { } : _g, options = __rest(_a, ["camera", "renderer", "onMouseEnter", "onMouseMove", "onMouseLeave", "onMouseClick"]);
        var _this = _super.call(this, options || {}) || this;
        _this.camera = camera;
        _this.onMouseEnter = onMouseEnter;
        _this.onMouseMove = onMouseMove;
        _this.onMouseLeave = onMouseLeave;
        _this.onMouseClick = onMouseClick;
        _this.intersectionParticles = [];
        // renderer 和 camera 都是必须参数，缺少则报错
        if (!(renderer instanceof WebGLRenderer && camera instanceof Camera)) {
            throw new Error('The arguments of camera and renderer are required');
        }
        var rendererIndex = renderers.indexOf(renderer);
        if (rendererIndex === -1) {
            _this.raycaster = new Raycaster();
            _this.mouse = new Vector2();
            _this.isPrimaryEvent = true;
            var canvasEl_1 = renderer.domElement;
            canvasEl_1.addEventListener('mousemove', function (event) {
                // 将光标在 DOM 中为位置转化为画布内的相对坐标
                var canvasRect = canvasEl_1.getBoundingClientRect();
                _this.mouse.x = ((event.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
                _this.mouse.y = -((event.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;
            }, false);
            canvasEl_1.addEventListener('click', function (event) {
                _this.onMouseClick(_this.intersectionParticles);
            }, false);
            raycasters.push(_this.raycaster);
            mouses.push(_this.mouse);
            renderers.push(renderer);
        }
        else {
            // 为了避免重复添加事件，缓存已经添加过的事件
            _this.raycaster = raycasters[rendererIndex];
            _this.mouse = mouses[rendererIndex];
            _this.isPrimaryEvent = false;
        }
        return _this;
    }
    MouseEvent.prototype.effect = function (particles, emitter) {
        var _this = this;
        _super.prototype.effect.call(this, particles, emitter);
        if (this.isPrimaryEvent) {
            this.raycaster.setFromCamera(this.mouse, this.camera);
        }
        // 获得当前时刻光标悬浮地方的粒子
        // intersectionParticles 表示当前时刻的粒子
        // this.intersectionParticles 表示上一时刻的粒子
        var intersectionParticles = this.raycaster.intersectObjects(particles)
            .map(function (intersection) { return intersection.object; });
        var enterIntersectionParticles = []; // 获得光标进入的粒子
        var leaveIntersectionParticles = []; // 获得光标离开的粒子
        // 感觉这种实现方式会有很大的性能消耗
        if (intersectionParticles.length !== this.intersectionParticles.length) {
            if (intersectionParticles.length < this.intersectionParticles.length) {
                leaveIntersectionParticles = this.intersectionParticles
                    .filter(function (particle) { return !intersectionParticles.includes(particle); });
            }
            else {
                enterIntersectionParticles = intersectionParticles
                    .filter(function (particle) { return !_this.intersectionParticles.includes(particle); });
            }
        }
        this.onMouseEnter(enterIntersectionParticles);
        this.onMouseMove(intersectionParticles);
        this.onMouseLeave(leaveIntersectionParticles);
        this.intersectionParticles = intersectionParticles;
    };
    return MouseEvent;
}(Event));

// polyfill

export { Sphere, Line$1 as Line, Points$1 as Points, Text, Sprite$1 as Sprite, Emitter, ExplosionEmitter, DirectionEmitter, BoxEmitter, TextEmitter, Gravity, Wind, Turbulent, Glow, Afterimage, MouseEvent };
