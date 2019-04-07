# 接口文档

这是一个基于 three.js 的 3D 粒子插件库库，用于快速创建粒子系统。

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
- afterimage {TP.Afterimage} [afterimage] 粒子残影。默认为 null 。
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
const sphere = new TP.Sphere({
  radius: 5,
  widthSegments: 32,
  heightSegments: 32,
  glow: new TP.Glow()
});
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
const line = new TP.Line({
  verticesNumber: 5,
  verticesSize: 3,
  vertices: []
});
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
const points = new TP.Points({
  verticesNumber: 20,
  verticesSize: 3
});
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
const sprite = new TP.Sprite({
  image: 'my-picture.jpg'
});
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
const text = new TP.Text({
  text: 'Hello three-particle',
  font: 'my-font.json'
});
```

## 发射器