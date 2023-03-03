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
        button: '.header__button__wrapper',
        close: '#close',
        open: '#open',
      },
    })

    this.shiftAmount = this.pageElements.wrapper.offsetHeight
    this.pageEvents = pageEvents
    this.timeline = GSAP.timeline()
    this.visible = true
    this.menuOpened = false
    this.fixed = true
    this.isDown = false

    this.getElements()
    this.setAnimations()

    this.touchXY = {
      x: {
        start: 0,
        end: 0,
      },
      y: {
        start: 0,
        end: 0,
      },
    }

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

  handleMenu() {
    if (!this.menuOpened) {
      this.openMenu()
    } else {
      this.closeMenu()
    }
  }

  hideHeader() {
    if (!this.visible) return

    this.visible = false

    if (DetectionManager.isPhone()) this.closeMenu()

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

    // setTimeout(() => {
    //   this.hideHeader()
    // }, 15000)
  }

  openMenu() {
    this.menuOpened = true
    this.menuTimeline.play()

    GSAP.to(this.pageElements.open, {
      autoAlpha: 0,
      duration: 0.5,
    })

    GSAP.to(this.pageElements.close, {
      autoAlpha: 1,
      duration: 0.5,
    })
  }

  closeMenu() {
    this.menuOpened = false
    this.menuTimeline.reverse()

    GSAP.to(this.pageElements.open, {
      autoAlpha: 1,
      duration: 0.5,
    })

    GSAP.to(this.pageElements.close, {
      autoAlpha: 0,
      duration: 0.5,
    })
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

  onTouchDown(event) {
    this.isDown = true

    this.touchXY.x.start = event.touches
      ? event.touches[0].clientX
      : event.clientX
    this.touchXY.y.start = event.touches
      ? event.touches[0].clientY
      : event.clientY
  }

  onTouchUp(event) {
    this.isDown = false
    const x = event.changedTouches
      ? event.changedTouches[0].clientX
      : event.clientX
    const y = event.changedTouches
      ? event.changedTouches[0].clientY
      : event.clientY

    this.touchXY.x.end = x
    this.touchXY.y.end = y

    const distance = this.touchXY.y.start - this.touchXY.y.end

    if (distance > 0) {
      this.hideHeader()
      this.fixed = true
    }

    if (distance < 0) {
      this.showHeader()
      this.fixed = false
    }
  }

  onTouchMove(event) {
    if (!this.isDown) return
    const x = event.touches ? event.touches[0].clientX : event.clientX
    const y = event.touches ? event.touches[0].clientY : event.clientY

    this.touchXY.x.end = x
    this.touchXY.y.end = y
  }

  addEventListeners() {
    this.pageElements.wrapper.addEventListener('click', () => {
      // this.fixed = true
      // this.showHeader()
    })

    this.pageElements.wrapper.addEventListener('mouseenter', () => {
      // this.fixed = true
    })

    this.pageElements.wrapper.addEventListener('mouseleave', () => {
      // this.fixed = false
      // this.showHeader()
    })

    this.pageElements.button.addEventListener('click', () => {
      this.handleMenu()
    })

    this.addAnchors()
  }

  onResize() {
    this.shiftAmount = this.pageElements.wrapper.offsetHeight

    this.sectionsHeights = []

    each(this.sections, (element) => {
      this.sectionsHeights.push(element.getBoundingClientRect().y)
    })
  }

  setAnimations() {
    if (!DetectionManager.isPhone()) return

    this.menuTimeline = GSAP.timeline()

    this.menuTimeline.pause()

    this.menuTimeline.add(
      GSAP.to(this.pageElements.wrapper, {
        height: '47rem',
        duration: 1,
        ease: 'power3.out',
      })
    )

    this.menuTimeline.add(
      GSAP.from(this.pageElements.links, {
        y: '3rem',
        autoAlpha: 0,
        duration: 0.35,
        stagger: {
          amount: 0.5,
        },
      }),
      '>-1.0'
    )
  }

  getElements() {
    this.sections = document.querySelectorAll('section')
  }
}
