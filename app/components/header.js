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
        links: '.header__button__link',
      },
    })

    this.shiftAmount = this.pageElements.wrapper.offsetHeight
    this.pageEvents = pageEvents
    this.timeline = GSAP.timeline()
    this.visible = true
    this.fixed = true

    this.getElements()

    // setTimeout(() => {
    //   this.onResize()
    // }, 7500)
  }

  addAnchors() {
    this.pageElements.links[0].addEventListener('click', () => {
      this.hideHeader()
      this.pageEvents.eventEmitter.emit('scrollTo', this.sectionsHeights[4])
    })

    this.pageElements.links[1].addEventListener('click', () => {
      this.hideHeader()
      this.pageEvents.eventEmitter.emit('scrollTo', this.sectionsHeights[5])
    })

    this.pageElements.links[2].addEventListener('click', () => {
      this.hideHeader()
      this.pageEvents.eventEmitter.emit('scrollTo', this.sectionsHeights[7])
    })
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

    this.addAnchors()
  }

  onResize() {
    this.shiftAmount = this.pageElements.wrapper.offsetHeight

    this.sectionsHeights = []

    each(this.sections, (element) => {
      this.sectionsHeights.push(element.getBoundingClientRect().y)
    })

    console.log(this.sectionsHeights)
  }

  getElements() {
    this.sections = document.querySelectorAll('section')
  }
}
