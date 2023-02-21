import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

import Index from 'threejs/indexpage'

export default class Three {
  constructor({ template, pageEvents }) {
    this.template = template
    this.pageEvents = pageEvents

    this.x = {
      start: 0,
      distance: 0,
      end: 0,
    }

    this.y = {
      start: 0,
      distance: 0,
      end: 0,
    }

    this.createRenderer()
    this.createScene()
    this.createCamera()
    this.createComposer()

    this.onChangeEnd(this.template)
    this.onResize()
    this.cameraControls()
  }

  cameraControls() {
    this.orbitControls = new OrbitControls(this.camera, this.gl)

    this.orbitControls.keys = {
      LEFT: 'ArrowLeft', //left arrow
      UP: 'ArrowUp', // up arrow
      RIGHT: 'ArrowRight', // right arrow
      BOTTOM: 'ArrowDown', // down arrow
    }

    this.orbitControls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    }

    //this.orbitControls.autoRotate = true
  }

  createAllphotos() {
    this.allphotos = new Allphotos({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
    })
  }

  createIndex() {
    this.indexPage = new Index({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
    })

    console.log('Index page ', this.indexPage)
  }

  destroyAllphotos() {
    if (!this.allphotos) return
    this.allphotos.destroy()
    this.allphotos = null
  }

  destroyIndex() {
    if (!this.indexPage) return
    this.indexPage.destroy()
    this.indexPage = null
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    })
    this.gl = this.renderer.domElement
    document.body.appendChild(this.gl)
    //document.body.appendChild(this.gl.canvas)
  }

  createComposer() {
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))

    this.FXAAShader = new ShaderPass(FXAAShader)

    this.afterimagePass = new AfterimagePass()
    this.afterimagePass.uniforms.damp.value = 0.5
    this.composer.addPass(this.FXAAShader)
    //this.composer.addPass( this.afterimagePass );
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera()
    this.scene.add(this.camera)
    this.camera.position.z = 3
  }

  createScene() {
    this.scene = new THREE.Scene()
  }

  onChangeStart() {
    // if (this.allphotos) {
    //   this.allphotos.hide()
    // }
    // if (this.indexPage) {
    //   this.indexPage.hide()
    // }
  }

  onChangeEnd(template) {
    this.createIndex()

    // if (template === 'index') {
    //   console.log('Creating ' + template)
    //   this.createIndex()
    // }
    // else {
    //   console.log('Destroying' + template)
    //   this.destroyIndex()
    // }

    // else {
    //   console.log('WebGL is not implemented on this page')
    // }
  }

  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.composer.setSize(window.innerWidth, window.innerHeight)
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.far = 1000
    this.camera.near = 1
    this.camera.fov = 50

    const fov = this.camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect

    this.camera.updateProjectionMatrix()

    this.sizes = {
      height,
      width,
    }

    this.camera.fov = 2 * Math.atan(this.height / 2 / 600) * (180 / Math.PI)

    const values = {
      sizes: this.sizes,
    }

    if (this.indexPage) {
      this.indexPage.onResize(values)
    }
  }

  onClick(event) {}

  onTouchDown(event) {
    this.isDown = true

    this.x.start = event.touches ? event.touches[0].clientX : event.clientX
    this.y.start = event.touches ? event.touches[0].clientY : event.clientY

    const values = {
      x: this.x,
      y: this.y,
    }

    if (this.allphotos) {
      this.allphotos.onTouchDown(values)
    }

    if (this.indexPage) {
      this.indexPage.onTouchDown(values)
    }
  }

  onTouchMove(event) {
    if (!this.isDown) return
    const x = event.touches ? event.touches[0].clientX : event.clientX
    const y = event.touches ? event.touches[0].clientY : event.clientY

    this.x.end = x
    this.y.end = y

    const values = {
      x: this.x,
      y: this.y,
    }

    if (this.allphotos) {
      this.allphotos.onTouchMove(values)
    }

    if (this.indexPage) {
      this.indexPage.onTouchMove(values)
    }
  }

  onTouchUp(event) {
    this.isDown = false
    const x = event.changedTouches
      ? event.changedTouches[0].clientX
      : event.clientX
    const y = event.changedTouches
      ? event.changedTouches[0].clientY
      : event.clientY

    this.x.end = x
    this.y.end = y

    const values = {
      x: this.x,
      y: this.y,
    }

    if (this.allphotos) {
      this.allphotos.onTouchUp(values)
    }

    if (this.indexPage) {
      this.indexPage.onTouchUp(values)
    }
  }

  onMouseWheel(event) {
    if (this.allphotos) {
      this.allphotos.onMouseWheel(event)
    }

    if (this.indexPage) {
      this.indexPage.onMouseWheel(event)
    }
  }

  update(time, scroll) {
    if (!this.indexPage) return

    if (this.indexPage && this.indexPage.update) {
      this.indexPage.update(time, scroll)
    }

    // this.indexPage.update(scroll)
    // console.log(scroll)

    this.orbitControls.update()
    this.renderer.render(this.scene, this.camera)
    this.composer.render()
  }
}
