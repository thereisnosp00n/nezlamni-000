import GSAP from 'gsap'
import each from 'lodash/each'

export default class Cursor {
  constructor({ element, dot, links }) {
    this.element = element
    this.dot = dot
    this.links = links

    this.setCursor()
    this.engaged = true
    this.addEventListeners()
  }

  setCursor() {
    GSAP.set([this.element, this.dot], { xPercent: -50, yPercent: -50 })
    this.position = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    this.positionDot = this.position
    this.mousePosition = { x: this.position.x, y: this.position.y }

    this.xSet = GSAP.quickSetter(this.element, 'x', 'px')
    this.ySet = GSAP.quickSetter(this.element, 'y', 'px')

    this.xSetDot = GSAP.quickSetter(this.dot, 'x', 'px')
    this.ySetDot = GSAP.quickSetter(this.dot, 'y', 'px')
  }

  cursorEnter() {
    GSAP.to(this.element, {
      scale: 2,
      duration: 0.5,
      border: 3,
      webkitFilter: 'blur(3px)',
      color: '#b90e0a',
      // repeat: -1,
      // yoyo: true,
    })
  }

  cursorLeave() {
    GSAP.to(this.element, {
      scale: 1,
      duration: 0.5,
      border: 1,
      webkitFilter: 'blur(0px)',
      color: '#000000',
    })
  }

  onTouchMove(event) {
    this.mousePosition.x = event.x
    this.mousePosition.y = event.y
  }

  addEventListeners() {
    each(this.links, (element) => {
      element.addEventListener('mouseenter', () => this.cursorEnter())
      element.addEventListener('mouseleave', () => this.cursorLeave())
    })
  }

  calculatePosition() {}

  update() {
    const speed = 0.0002
    const delta = 1.0 - Math.pow(1.0 - speed, 1)

    this.position.x += (this.mousePosition.x - this.position.x) * delta
    this.position.y += (this.mousePosition.y - this.position.y) * delta
    this.xSet(this.position.x)
    this.ySet(this.position.y)

    const deltaDot = 1.0 - Math.pow(1.0 - 0.5, 0.2)
    this.positionDot.x += (this.mousePosition.x - this.positionDot.x) * deltaDot
    this.positionDot.y += (this.mousePosition.y - this.positionDot.y) * deltaDot
    this.xSetDot(this.positionDot.x)
    this.ySetDot(this.positionDot.y)
  }
}
