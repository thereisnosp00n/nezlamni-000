import GSAP from 'gsap'
import Component from 'classes/component'
import each from 'lodash/each'
import DetectionManager from 'classes/detection'

export default class Header extends Component {
  constructor({ pageEvents }) {
    super({
      contentDiv: '.header',
      pageElements: {
        wrapper: '.header__wrapper',
      },
    })

    this.shiftAmount = this.pageElements.wrapper.offsetHeight
    this.pageEvents = pageEvents
    this.timeline = GSAP.timeline()
    this.visible = true
    this.fixed = true
  }

  hideHeader() {
    if (!this.visible) return
    this.visible = false

    GSAP.to(this.pageElements.wrapper, {
      y: -this.shiftAmount,
      duration: 0.5,
      ease: 'power3.in',
    })
  }

  showHeader() {
    if (this.visible) return
    this.visible = true

    GSAP.to(this.pageElements.wrapper, {
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
    })

    if (this.fixed) return

    setTimeout(() => {
      this.hideHeader()
    }, 15000)
  }

  onMouseWheel({ pixelY }) {
    if (pixelY > 5) {
      this.hideHeader()
      this.fixed = true
    }

    if (pixelY < -5) {
      this.showHeader()
      this.fixed = false
    }
  }

  addEventListeners() {
    this.pageElements.wrapper.addEventListener('click', () => {
      this.fixed = true
      this.showHeader()
    })

    this.pageElements.wrapper.addEventListener('mouseenter', () => {
      this.fixed = true
    })

    this.pageElements.wrapper.addEventListener('mouseleave', () => {
      this.fixed = false
      this.showHeader()
    })
  }

  onResize() {
    this.shiftAmount = this.pageElements.wrapper.offsetHeight
  }
}
