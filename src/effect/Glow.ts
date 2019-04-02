import * as THREE from 'three';

class Glow {
	// from: https://zhuanlan.zhihu.com/p/38548428
	static readonly vertexShader = `
		varying vec3 vNormal;
		varying vec3 vPositionNormal;
		void main() 
		{
		  vNormal = normalize( normalMatrix * normal ); // 转换到视图空间
		  vPositionNormal = normalize(( modelViewMatrix * vec4( position, 1.0) ).xyz);
		  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`;
	static readonly fragmentShader = `
		uniform vec3 color;
		uniform float opacity;
		uniform float bias;
		uniform float power;
		uniform float scale;
		varying vec3 vNormal;
		varying vec3 vPositionNormal;
		void main() 
		{
      // Empricial 菲涅尔近似等式
      // 计算得到片段着色的透明度
      float alpha = pow( bias + scale * abs(dot(vNormal, vPositionNormal)), power );
		  gl_FragColor = vec4( color, alpha * opacity );
		}
	`;

	// 不透明度比例，越偏离 0 越不透明
	scale: number;
	// 最亮部分的位置 [0.0, 1.0]
	// 1.0 表示边缘
	// 0.0 表示中间
	bias: number;
	// 透明度变化速度和方向
	// 越大亮度衰减越明显
	power: number;
	
	opacity: number; // 整体不透明度
	feature: number; // 发光羽化值（单位，像素）
	intensity: number; // 发光强度
 	size: number; // 发光大小（相对于发光物体的比例）
 	color: THREE.Color; // 发光颜色
	constructor({
		opacity = 0.5,
		intensity = 1,
		feature = 5,
		size = 1.1,
		color = new THREE.Color(0x00ffff)
	} = {}) {
		this.opacity = opacity;
		this.intensity = intensity;
		this.size = size;
		this.color = color;
		this.feature = feature;

		// intensity 应该为 [-5, 5]
		// abs(intensity) > 5 时，值再大变化效果也不明显
		this.scale = -intensity;
		// 当 scale 为 5 时，不透明度基本上都为 1
		// 因此将 bias 根据 scale ，让 scale 从区间 0 - 5 映射到 bias 从区间 1 - 0
		this.bias = THREE.Math.mapLinear(intensity, 0, 5, 1.0, 0.0);
		this.power = 5 / feature;
	}
	// 根据 glow 的参数生成着色器材质
	// 并不是很好的解决方法，目前是为了减少重复编码
	getShaderMaterial(): THREE.ShaderMaterial {
		return new THREE.ShaderMaterial({
			uniforms: {
				'scale': { type: 'f', value: this.scale },
				'bias': { type: 'f', value: this.bias },
				'power': { type: 'f', value: this.power },
				'opacity': { type: 'f', value: this.opacity },
				color: { type: 'c', value: this.color }
			},
			vertexShader: Glow.vertexShader,
			fragmentShader: Glow.fragmentShader,
			blending: THREE.AdditiveBlending, // 加色模式
			transparent: true
		});
	}
}

export default Glow;