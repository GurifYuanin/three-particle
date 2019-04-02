import * as THREE from 'three';

class Glow {
	static readonly vertexShader = `
		varying vec3 vNormal;
		varying vec3 vPositionNormal;
		void main() 
		{
		  vNormal = normalize( normalMatrix * normal ); // 转换到视图空间
		  vPositionNormal = normalize(( modelViewMatrix * vec4(position, 1.0) ).xyz);
		  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`;
	static readonly fragmentShader = `
		uniform vec3 color;
		uniform float basic;
		uniform float power;
		uniform float scale;
		varying vec3 vNormal;
		varying vec3 vPositionNormal;
		void main() 
		{
		  // 菲涅尔近似等式计算得到片段着色的透明度
		  float alpha = pow( basic + scale * abs(dot(vNormal, vPositionNormal)), power );
		  gl_FragColor = vect4( color, alpha );
		}
	`;
 	scale: number;
 	basic: number;
 	power: number;
 	rate: number;
 	color: THREE.Color;
	constructor({
		rate = 1.2,		
		scale = -1.0,
		basic = 1.0,
		power = 2.0,
		color = new THREE.Color(0x00ffff)
	} = {}) {
		this.rate = rate;
		this.color = color;
		this.scale = scale;
		this.basic = basic;
		this.power = power;
	}
}

export default Glow;