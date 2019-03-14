# 接口文档

这是一个基于 three.js 的 3D 粒子插件库库，用于快速创建粒子系统。

## 粒子

### 球

父类：TP.Particle & THREE.Mesh

创建一个圆球。

实际上是通过调用 THREE.SphereBufferGeometry 和 THREE.MeshPhongMaterial 创建 THREE.Mesh 作为粒子。

- param {number} [radius] 球半径，默认为 5
- param {number} [widthSegments] 球纵切分片数，默认为 32
- param {number} [heightSegments] 球横切分片数，默认为 32
- param {THREE.Material} [material] 球材质，默认为 new THREE.MeshPhongMaterial
- return {TP.Sphere} 球实例

使用样例：

```js
const sphere = new TP.Sphere({
  radius: 5
});
```
