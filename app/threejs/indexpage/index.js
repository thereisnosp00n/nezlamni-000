import map from 'lodash/map'
import Gallery from './gallery'
import * as THREE from 'three'

import planeVertex from 'threejs/shaders/plane-vertex.glsl'
import planeFragment from 'threejs/shaders/plane-fragment.glsl'

export default class Index {
	constructor({gl, scene, sizes}) {
		this.gl = gl
		this.sizes = sizes
		this.group = new THREE.Group()
		
		this.createGeometry()
		// this.createGalleries()

		scene.add(this.group)

		this.show()
		console.log(scene)
	}

	createGeometry() {
		// this.geometry = new THREE.Sphere(1,1,64,64)

		const geometry = new THREE.SphereGeometry( 1, 128,128 );
		this.material  = new THREE.ShaderMaterial({
			fragmentShader: planeFragment,
			vertexShader: planeVertex,
			uniforms: {
				uAlpha: {value: 1 },
				uResolution: { type: "v2", value: new THREE.Vector2() },
				uTime: { type: "f", value: 1.0 }
				// tMap: {value: this.texture}
			}
		})


		this.geometry = new THREE.Mesh( geometry, this.material );
		this.group.add(this.geometry)
	}

	createGalleries() {

    this.galleriesElements = document.querySelectorAll('.index__carousel__wrapper') 

    this.galleries = map(this.galleriesElements, (element, index) => {
      return new Gallery({
        element, 
        index,
        gl: this.gl, 
        geometry: this.geometry,
        scene: this.group,
        sizes: this.sizes
      })
    })

	}

	show() {
		map(this.galleries, gallery => {
			gallery.show()
		})
	}

	hide() {
		map(this.galleries, gallery => {
			gallery.hide()
		})	
	}

	onResize(event) {
		map(this.galleries, gallery => {
			gallery.onResize(event)
		})

		this.material.uniforms.uResolution.value.x = this.gl.width
		this.material.uniforms.uResolution.value.y = this.gl.height
	}

	onTouchDown(event) {
		map(this.galleries, gallery => {
			gallery.onTouchDown(event)
		})
	}

	onTouchMove(event) {
		map(this.galleries, gallery => {
			gallery.onTouchMove(event)
		})
	}

	onTouchUp(event) {
		map(this.galleries, gallery => {
			gallery.onTouchUp(event)
		})
	}

	onMouseWheel(event) {
		map(this.galleries, gallery => {
			gallery.onMouseWheel(event)
		})
	}

	update(time, scroll) {
		map(this.galleries, gallery => {
			gallery.update(scroll)
		})
		
		this.time = time

		this.material.uniforms.uTime.value += 0.5
	}

	destroy() {
		map(this.galleries, gallery => {
			gallery.destroy()
		})
	}
}