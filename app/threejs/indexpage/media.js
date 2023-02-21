import * as THREE from 'three'
import GSAP from 'gsap'

import planeVertex from 'threejs/shaders/plane-vertex.glsl'
import planeFragment from 'threejs/shaders/plane-fragment.glsl'

export default class Media {
	constructor({element, geometry, gl, scene, index, sizes}) {
		this.element = element
		this.geometry = geometry
		this.gl = gl
		this.scene = scene
		this.sizes = sizes

		this.createTexture()
		this.createProgram()
		this.createMesh()

		this.extra = 0
	}

	createTexture() {
		//this.texture = new THREE.Texture()
		const image = this.element.querySelector('img')
		this.image = this.element.querySelector('img')

		//this.image = new window.Image()
		this.image.crossOrigin = 'anonymous'
		this.image.src = image.getAttribute('data-src')

		this.texture = new THREE.TextureLoader().load(this.image.src)
		this.texture.needsUpdate = true
	
	}

	async createProgram() {
		this.program = new THREE.ShaderMaterial({
			fragmentShader: planeFragment,
			vertexShader: planeVertex,
			uniforms: {
				uAlpha: {value: 0 },
				tMap: {value: this.texture}
			}
		})
	}

	createMesh() {
		this.mesh = new THREE.Mesh(this.geometry,this.program)
		this.scene.add(this.mesh)
		this.mesh.rotation.z = GSAP.utils.random(Math.PI * 0.03, -Math.PI * 0.03)
		this.mesh.position.z = GSAP.utils.random(0,-0.5)

		const geometry = new THREE.BoxGeometry( 1, 1, 1 );
		const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		const cube = new THREE.Mesh( geometry, material );

		//this.scene.add(cube)
	}

	createBounds({sizes}) {
		this.sizes = sizes
		this.bounds = this.element.getBoundingClientRect()
		console.log(this.sizes, this.bounds)
		this.updateScale()
		this.updateX()
		this.updateY()

	}

	show() {
		GSAP.fromTo(this.program.uniforms.uAlpha, {
			value: 0
		}, {
			value: 1
		})
	
	}
	hide() {
		GSAP.to(this.program.uniforms.uAlpha, {
			value: 0
		})
	}

	updateRotation(scroll) {
		this.mesh.rotation.y = GSAP.utils.mapRange(-this.sizes.width/2, this.sizes.width/2, Math.PI * 0.1, -Math.PI * 0.1, this.mesh.position.x)
	}

	updateScale() {
		this.width = this.bounds.width / window.innerWidth
		this.height = this.bounds.height / window.innerHeight

		this.mesh.scale.x = this.sizes.width * this.width
		this.mesh.scale.y = this.sizes.height * this.height

		const scale = GSAP.utils.mapRange(0, this.sizes.width/2, 0.05, 0, Math.abs(this.mesh.position.x))

		this.mesh.scale.x += scale
		this.mesh.scale.y += scale
	}

	updateX(x=0) {
		this.x = (this.bounds.left+x/2) / window.innerWidth
		this.mesh.position.x = (-this.sizes.width / 2) + (this.mesh.scale.x / 2) + ((this.x) * this.sizes.width) + this.extra
	}

	updateY(y=0) {
		this.y = (this.bounds.top+y/2) / window.innerHeight
		this.mesh.position.y = (this.sizes.height / 2) - (this.mesh.scale.y / 2) - ((this.y) * this.sizes.height) + 0.25
	}

	update(scroll) {
		if (!this.bounds) return
		this.updateRotation(scroll)
		this.updateScale()
		this.updateX(scroll)
		this.updateY(0)
	}

	onResize(sizes, scroll, width) {
		this.extra = 0
		this.widthTotal = width

		this.createBounds(sizes)
		this.updateX(scroll)
		this.updateY(0)
	}
}