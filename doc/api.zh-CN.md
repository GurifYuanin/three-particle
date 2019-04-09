# 接口文档

这是一个基于 three.js 的 3D 粒子插件库，用于快速创建粒子系统。

你可以直接预览[样例](https://gurifyuanin.github.io/three-particle/demo/)。

## ⚠️ 注意
+ 所有类的构造函数的参数都为一个选项对象，选项对象内的大部分的选项都为可选项，例如：
```js
const options = {
  radius: 5
};
const sphere = new TP.Sphere(options);
```

## 粒子

### 粒子 / TP.Particle

父类：无

作为所有粒子的父类，设置粒子的通用属性。

该类是一个抽象类，不是 threejs 可以渲染的物体对象，请勿添加到场景中。
只有继承该类的对象，才能被发射器发射。

- param {number} [life]  粒子生命长度，单位：秒。默认为 3 。
- param {number} [lifeRandom]  生命随机比例，参数范围 [0, 1]，比如粒子生命长度为 3s，生命随机值为 0.5，那么每个粒子的生命长度将为 1.5s 到 4.5s 之间。默认为 0 。
- param {number} [velocity] 粒子速度，单位：unit/s 。默认为 10 。
- param {number} [border] 用于碰撞时的边界检测，该粒子和其他物体进行碰撞时的判定半径，默认为 5 。
- param {TP.Afterimage} [afterimage] 粒子残影。默认为 null 。
- param {Function} [onBeforeCreated] 粒子被创建之前执行的回调函数。默认为 function() {}。
- param {Function} [onAfterCreated] 粒子被创建之后执行的回调函数。默认为 function() {}。
- param {Function} [onBeforeDestroyed] 粒子被销毁前的回调函数。默认为 function() {}。
- param {Function} [onAfterDestroyed] 粒子被销毁后的回调函数。默认为 function() {}。
- return {TP.Particle} 粒子实例

### 球 / TP.Sphere

父类：TP.Particle & THREE.Mesh

创建一个圆球。

默认是通过调用 THREE.SphereBufferGeometry 和 THREE.MeshPhongMaterial 创建 THREE.Mesh 作为粒子。

- param {number} [radius] 球半径。默认为 5 。
- param {number} [widthSegments] 球纵切分片数。默认为 32 。
- param {number} [heightSegments] 球横切分片数。默认为 32 。
- param {THREE.Material} [material] 球材质。默认为 new THREE.MeshPhongMaterial 。
- param {TP.Glow} {glow} 粒子发光属性。默认为 null 。
- return {TP.Sphere} 球实例。

使用样例：

```js
const emitter = new TP.ExplosionEmitter();

const sphere = new TP.Sphere({
  radius: 5
});

emitter.addParticle(sphere);
```

### 线段 / TP.Line

父类：TP.Particle & THREE.Line

创建一条线段。

默认是通过调用 THREE.BufferGeometry 和 THREE.LineBasicMaterial 创建 THREE.Line 作为粒子。

- param {number} [verticesNumber] 线段端点数。默认为 2 。
- param {number} [verticesSize] 线段维度。默认为 3 。
- param {number[]} [vertices] 线段每个端点的初始位置。默认为 [] 。
- param {THREE.LineBasicMateri | THREE.LineDashedMaterial} [material] 线段材质
- param {THREE.Color[]} [colors] 线段每个端点的颜色值，该参数只有在 material.vertexColors 是 THREE.VertexColors 才有效。默认为 [] 。
- return {TP.Line} 线段实例。

使用样例：
```js
const emitter = new TP.ExplosionEmitter();

const line = new TP.Line({
  verticesNumber: 5,
  verticesSize: 3,
});

emitter.addParticle(line);
```

### 点集 / TP.Points

父类：TP.Particle & THREE.Points

创建点集。

默认是通过调用 THREE.BufferGeometry 和 THREE.PointsMaterial 创建 THREE.Points 作为粒子。

- param {number} [verticesNumber] 单团点集的点数量。默认为 10 。
- param {number} [verticesSize] 点维度。默认为 3 。
- param {number[]} [vertices] 初始化时，点团内点的位置。默认为 [] 。
- param {number} [spread] 初始化时，每个点位置的随机值将设置为 -spread 到 spread 之间。默认为 10 。
- param {THREE.PointsMaterial} [material] 点材质。默认为 new THREE.PointsMaterial() 。
- param {THREE.Color[]} [colors] 初始化时，每个点的颜色，该参数只有在 material.vertexColors 是 THREE.VertexColors 才有效。默认为 [] 。
- param {TP.Glow} [glow] 点发光属性。默认为 null 。
- return {TP.Points}

使用样例：
```js
const emitter = new TP.ExplosionEmitter();

const points = new TP.Points({
  verticesNumber: 20,
  verticesSize: 3
});

emitter.addParticle(points);
```

### 精灵图 / TP.Sprite

父类：TP.Particle & THREE.Sprite

创建精灵图。

默认是通过调用 THREE.SpriteMaterial 创建 THREE.Sprite 作为粒子。

- param {string} [image] 精灵图 url。默认是 ./images/star.png 。
- param {THREE.SpriteMaterial} [material] 精灵图材质。默认是 new THREE.SpriteMaterial() 。
- return {TP.Sprite}

使用样例：
```js
const emitter = new TP.ExplosionEmitter();

const sprite = new TP.Sprite({
  image: 'my-picture.jpg'
});

emitter.addParticle(sprite);
```

### 文本 / TP.Text

父类：TP.Particle & THREE.Mesh

创建文本。

默认是通过调用 THREE.TextBufferGeometry 和 THREE.MeshPhongMaterial 创建 THREE.Mesh 作为粒子。

- param {string} [text] 文本内容。默认是 Hello World 。
- param {string} [font] 文本字体。默认是 /demo/fonts/helvetiker_regular.typeface.json 。
- param {number} [size] 文本大小。默认是 10 。
- param {number} [height] 文本高度。默认是 10 。
- param {number} [curveSegments] 文本垂直方向切片数。默认为12 。
- param {boolean} [bevelEnabled] 是否开启倒角。默认为 false 。
- param {number} [bevelThickness] 倒角厚度。默认为 10 。
- param {number} [bevelSize] 倒角大小。默认为 8 。
- param {number} [bevelSegments] 倒角切片数。默认为 3 。
- param {TP.Glow} [glow] 文本发光属性。默认为 null 。
- param {THREE.Material} [material] 文本材质。默认为 new THREE.MeshPhongMaterial() 。
- return {TP.Text}

使用样例：
```js
const emitter = new TP.ExplosionEmitter();

const text = new TP.Text({
  text: 'Hello three-particle',
  font: 'my-font.json'
});

emitter.addParticle(text);
```

## 发射器

### 发射器 / TP.Emitter

父类：THREE.Object3D

作为所有发射器，设置发射器的通用属性。

该类是一个抽象类，不是 threejs 可以渲染的物体对象，请勿添加到场景中。
只有继承该类的对象，才能作为发射器发射粒子。

#### 常量

- MODE_DURATIOIN 0 发射器发射类型，持续发射。
- MODE_EXPLOSION 1 发射器发射类型，爆炸式发射。
- TRANSFORM_LINEAR 0 关键帧过渡类型，线性过渡。
- TRANSFORM_SMOOTH 1 关键帧过渡类型，平滑过渡。
- TRANSFORM_SMOOTHER 2 关键帧过渡类型，更平滑过渡。

#### 参数

- param {number} [emission] 发射器每秒发射的粒子数。默认为 100.
- param {boolean} [isisVerticalToDirection] 粒子朝向是否垂直于运动方向。默认为 false 。
- param {number} [mode] 发射器发射类型。默认为 TP.Emitter.MODE_DURATIOIN 。
- param {THREE.Vector3} [anchor] 发射器锚点。默认为 new THREE.Vector3(0, 0, 0)。
- param {THREE.Vectro3} [particlesPositionRandom] 发射器发射粒子时，粒子的位置抖动。默认为 new THREE.Vector3(0, 0, 0)。
- param {number} [particlesOpacityRandom] 发射器发射粒子时，粒子的不透明度抖动。默认为 0 。
- param {number[]} [particlesOpacityKey] 发射器发射粒子时，粒子不透明度关键帧位置。默认为 [] 。
- param {number[]} [particlesOpacityValue] 发射器发射粒子时，粒子不透明度关键帧值。默认为 [] 。
- param {THREE.Color} [particlesColorRandom] 发射器发射粒子时，粒子颜色抖动。默认为 new THREE.Color(0, 0, 0) 。
- param {number[]} [particlesColorKey] 发射器发射粒子时，粒子颜色关键帧位置。默认为 [] 。
- param {THREE.Color[]} [particlesColorValue] 发射器发射粒子时，粒子颜色关键帧值。默认为 [] 。
- param {THREE.Vector3} [particlesRotationRandom] 发射器发射粒子时，粒子旋转抖动。默认为 new THREE.Vector3(0, 0, 0)。
- param {number[]} [particlesRotationKey] 发射器发射粒子时，粒子旋转关键帧位置。默认为 [] 。
- param {THREE.Vector3[]} [particlesRotationValue] 发射器发射粒子时，粒子旋转关键帧值。默认为 [] 。
- param {THREE.Vector3} [particlesScaleRandom] 发射器发射粒子时，粒子缩放抖动。默认为 new THREE.Vector3(0, 0, 0)。
- param {number[]} [particlesScaleKey] 发射器发射粒子时，粒子缩放关键帧位置。默认为 [] 。
- param {THREE.Vector3[]} [particlesScaleValue] 发射器发射粒子时，粒子缩放关键帧值。默认为 [] 。
- return {TP.Emitter}

### 爆炸发射器 / TP.ExplosionEmitter

父类：TP.Emitter

创建爆炸发射器。

该发射器会将粒子从一个点随机往 360° 每个方向进行发射。

- return {TP.ExplosionEmitter}

使用样例：
```js
const explosionEmitter = new TP.ExplosionEmitter();
```

### 方向发射器 / TP.DirectionEmitter

父类：TP.Emitter

创建方向发射器。

该发射器会将粒子向指定方向发谁，粒子位置可以是在以发射器的锚点为球心的球内，也可以是以发射器锚点为圆心的圆。

#### 常量

- EMIT_TYPE_SHPERE 0 发射类型，球形。
- EMIT_TYPE_ROUND 1 发射类型，圆形。

#### 参数

- param {THREE.Vector3} [direction] 发射器发射粒子的方向。默认为 new THREE.Vector3(0, 0, -1)。
- param {THREE.Vector3} [spread] 粒子初始位置随机抖动。默认为 new THREE.Vector3(0, 0, 0)。
- param {THREE.Vector3} [radius] 发射器粒子分布半径。默认为 new TRHEE.Vector3(0, 0, 0)。
- param {number} [emitType] 发射器发射类型。默认为 TP.DirectionEmitter.EMIT_TYPE_SPHERE。
- return {TP.DirectionEmitter}

使用样例：
```js
const directionEmitter = new TP.DirectionEmitter();
```

### 盒子发射器 / TP.BoxEmitter

父类：TP.Emitter

创建盒子发射器。

该发射器会将粒子向上下方向发射，粒子的分布为盒子内。

#### 常量

- SIDE_BOTH 0 两边发射。
- SIDE_TOP 1 向上发射。
- SIDE_BOTTOM 2 向下发射。

#### 参数

- param {number} [width] 盒子宽度。默认为 5 。
- param {number} [height] 盒子高度。默认为 5 。
- param {number} [thickness] 盒子厚度。默认为 5 。
- param {number} [side] 盒子发射类型。默认为 TP.BoxEmitter.SIDE_BOTH 。
- return {TP.BoxEmitter}

使用样例：
```js
const boxEmitter = new TP.BoxEmitter();
```

### 文本发射器 / TP.TextEmitter

父类：TP.Emitter

创建文本发射器。

该类会将粒子朝不同不相发谁，粒子初始位置在文本上。

- param {string} [text] 文本发射器的文本。默认为 Hello World 。
- param {string} [font] 文本发射器文本的字体。默认为 ./fonts/helvetiker_regular.typeface.json 。
- param {number} [size] 文本发射器文本大小。默认为 10 。
- param {number} [height] 文本发射器文本高度。默认为 10 。
- param {number} [curveSegments] 文本发射器文本切片数。默认为 12 。
- param {number} [bevelEnabled] 文本发射器文本是否开启倒角。默认为 false 。
- param {number} [bevelThickness] 文本发射器文本倒角厚度。默认为 10 。
- param {number} [bevelSize] 文本发射器文本倒角大小。默认为 8 。
- param {number} [bevelSegments] 文本发射器文本倒角切片数。默认为 3 。
- return {TP.TextEmitter}

使用样例：
```js
const textEmitter = new TP.TextEmitter({
  text: 'Hello particle',
  font: 'my-font.json'
});
```

## 物理场

### 物理场 / TP.Physical

父类：无

作为所有物理场的父类，设置通用属性。

该类是一个抽象类，不是 threejs 可以渲染的物体对象，请勿添加到场景中。

### 重力 / TP.Gravity

父类：TP.Physical

创建重力场。

模拟现实生活中的重力，为发射器添加重力场后，重力场会影响粒子的运动速率和方向。

#### 常量

- EVENT_NONE 0 碰撞地面后的事件，无事件。
- EVENT_BOUNCE 1 碰撞地面后的事件，粒子反弹跳起。
- EVENT_DISAPPEAR 2 碰撞地面后的事件，粒子消失。
- EVENT_STICK 3 碰撞地面后的事件，粒子粘附在地面上。

#### 参数

- param {THREE.Vector3} [direction] 重力方向。默认为 new THREE.Vector3(0, -1, 0)。
- param {number} [gravity] 重力系数。默认为 9.8 。
- param {null | THREE.Plane} [floor] 地面。默认为 null 。
- param {number} [bounce] 弹跳系数。默认为 0.5 。
- param {number} [firction] 摩擦力系数。默认为 1 。
- param {number} [event] 碰撞事件。默认为 TP.Gravity.EVENT_NONE 。
- param {Function} [onBeforeEvent] 发生地面碰撞前的回调函数。默认为 function() {} 。
- param {Function} [onAfterEvent] 发生地面碰撞后的回调函数。默认为 function() {} 。
- return {TP.Gravity}

使用样例：
```js
const emitter = new TP.ExplosionEmitter();

const gravity = new TP.Gravity({
  floor: new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
  event: TP.Gravity.EVENT_BOUNCE
});

emitter.addPhysical(gravity);
```

### 风力 / TP.Wind

父类：TP.Physical

创建风力场。

模拟现实世界中的风力，为发射器添加风力场后，风力场会影响粒子运动的速率和方向。

- param {THREE.Vector3} [direction] 风力方向。默认为 new THREE.Vector3(1, 0, 0) 。
- param {number | THREE.Vector3} [intensity] 风力强度。默认为 1 。
- param {number | THREE.Vector3} [spread] 风力 xyz 方向的发散值。默认为 new THREE.Vector3(0 ,0 , 0)。
- return {TP.Wind}

使用样例：
```js
const emitter = new TP.ExplosionEmitter();

const wind = new TP.Wind();

emitter.addPhysical(wind);
```

## 特效

### 特效 / TP.Effect

父类：无

作为所有特效的父类，设置通用属性。

该类是一个抽象类，不是 threejs 可以渲染的物体对象，请勿添加到场景中。

### 湍流 / TP.Turbulent

父类：TP.Effect

创建湍流特效。

将湍流添加给发射器，湍流会干扰粒子的运动，使粒子的运动发生抖动。

- param {number} [intensity] 湍流强度。默认为 10 。
- return {TP.Turbulent}

使用样例：
```js
const emitter = new TP.ExplosionEmitter();

const turbulent = new TP.Turbulent();

emitter.addEffect(turbulent);
```

### 发光 / TP.Glow

父类：TP.Effect

创建粒子发光。

为粒子添加发光效果。

- param {number} [opacity] 发光透明度。默认为 0.5 。
- param {number} [intensity] 发光强大。默认为 1 。
- param {number} [feature] 发光边缘羽化值。默认为 5 。
- param {THREE.Color} [color] 发光颜色。默认为 new THREE.Colo(0x00ffffff)。
- param {number} [rate] 发光体和原粒子的比例。默认为 1.1 。
- return {TP.Glow}

使用样例：
```js
const glow = new TP.Glow();

const sphere = new TP.Sphere({
  glow
});
```

### 残影 / TP.Afterimage

父类：TP.Effect

创建粒子残影。

为粒子创建残影，残影是粒子副本，作为粒子运动延迟的物体。

- param {number} [delay] 残影延迟时间，单位秒。默认为 0.2 。
- param {number} [interval] 残影之间的间隙时间，单位秒。默认为 0.2 。
- param {number} [attenuation] 残影不透明度衰减比例。默认为 0.2 。
- param {number} [number] 残影数量。默认为 2 。
- return {TP.Afterimage}

使用样例：
```js
const afterimage = new TP.Afterimage();

const sphere = new TP.Sphere({
  afterimage
});
```

## 交互

### 事件 / TP.Event

父类：无

作为所有交互事件的父类，设置通用属性。

该类是一个抽象类，不是 threejs 可以渲染的物体对象，请勿添加到场景中。

### 鼠标事件 / TP.MouseEvnet

父类：TP.Event

创建鼠标事件。

光标与粒子发生交互所触发的事件，包括`鼠标进入粒子，鼠标点击粒子，鼠标在粒子内移动，鼠标离开粒子`。

- param {THREE.WebGLRenderer} 渲染器。
- param {THREE.Camera} camera 相机。
- param {Function} onMouseEnter 鼠标进入粒子时触发的事件。默认为 function() {}。
- param {Function} onMouseMove 鼠标在粒子内移动时触发的事件。默认为 function() {}。
- param {Function} onMouseLeave 鼠标离开粒子时触发的事件。默认为 function() {}。
- param {Function} onMouseClick 鼠标点击粒子时触发的事件。默认为 function() {}。
- return {TP.MouseEvnet}

使用样例：
```js
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.Camera();
const emitter = new TP.ExplosionEmitter();

const mouseEvent = new TP.MouseEvnet({
  renderer,
  camera,
  onMouseEnter(particles) {
    for (let particle of particles) {
      particle.scale.set(5, 5, 5);
    }
  },
  onMouseLeave(particles) {
    for (let particle of particles) {
      particle.scale.set(1, 1, 1);
    }
  }
});

emitter.addEvent(mouseEvent);
```
