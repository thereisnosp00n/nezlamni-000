import map from 'lodash/map'
import Media from './media'
import * as THREE from 'three'
import GSAP from 'gsap'

export default class Gallery {
  constructor({ element, geometry, gl, scene, index, sizes }) {
    this.element = element
    this.elementWrapper = document.querySelector('.index__carousel__wrapper')
    this.geometry = geometry
    this.gl = gl
    this.index = index
    this.scene = scene
    this.sizes = sizes

    this.group = new THREE.Group()

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      lerp: 0.1,
      velocity: 1.5,
    }

    this.createMedias()
    this.scene.add(this.group)
  }

  createMedias() {
    this.mediasElements = document.querySelectorAll(
      '.index__carousel__photo__wrapper'
    )

    this.medias = map(this.mediasElements, (element, index) => {
      return new Media({
        element,
        index,
        gl: this.gl,
        geometry: this.geometry,
        scene: this.group,
        sizes: this.sizes,
      })
    })
  }

  show() {
    map(this.medias, (media) => {
      media.show()
    })
  }

  hide() {
    map(this.medias, (media) => {
      media.hide()
    })
  }

  onResize(event) {
    //this.onResizing = true
    this.bounds = this.elementWrapper.getBoundingClientRect()
    this.sizes = event.sizes
    this.height = (this.bounds.height / window.innerHeight) * this.sizes.height

    this.width = (this.bounds.width / window.innerWidth) * this.sizes.width
    this.scroll.current = this.scroll.target = 0
    // console.log(this.bounds, this.sizes, this.height, this.width)
    map(this.medias, (media) => {
      media.onResize(event, this.scroll.current)
    })
  }

  onTouchDown({ x, y }) {
    this.scroll.start = this.scroll.current
  }

  onTouchMove({ x, y }) {
    const distance = x.start - x.end

    this.scroll.target = this.scroll.start - distance
  }

  onTouchUp({ x, y }) {}

  onMouseWheel({ pixelX }) {
    this.scroll.target += pixelX
  }

  update(scroll) {
    if (!this.bounds) return

    const scrollDistance = scroll.current - scroll.target
    const y = scroll.current / window.innerHeight

    if (this.scroll.current > this.scroll.target) {
      this.direction = 'left'
      this.scroll.velocity = 1.5
    } else if (this.scroll.current < this.scroll.target) {
      this.direction = 'right'
      this.scroll.velocity = -1.5
    }

    this.scroll.target -= this.scroll.velocity
    this.scroll.target += scrollDistance * 0.025

    this.scroll.current = GSAP.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      this.scroll.lerp
    )

    map(this.medias, (media, index) => {
      const scaleX = (media.mesh.scale.x / 2) * 1.75

      if (this.direction === 'left') {
        const x = media.mesh.position.x + scaleX

        if (x < -this.sizes.width / 2) {
          media.extra += this.width
        }
      } else if (this.direction === 'right') {
        const x = media.mesh.position.x - scaleX

        if (x > this.sizes.width / 2) {
          media.extra -= this.width
        }
      }

      media.update(this.scroll.current)
    })
    this.group.position.y = y * this.sizes.height
  }

  destroy() {
    this.scene.removeChild(this.group)
  }
}
