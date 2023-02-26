import GSAP from 'gsap'
import each from 'lodash/each'
import map from 'lodash/map'
import Prefix from 'prefix'
import AsyncLoad from 'classes/AsyncLoad'
import Detection from 'classes/detection'

export default class Page {
  constructor({ id, contentDiv, pageElements, scrollPosition }) {
    this.selectorContent = contentDiv
    this.selectorElements = {
      ...pageElements,
      preloaders: '[data-src]',
      animationsQuotes: '[data-animation="quote"]',
      previewContainers: '[data-animation="container"]',
      popUps: document.querySelectorAll('#popup'),
    }

    this.id = id
    scrollPosition = this.scrollPosition

    this.transformPrefix = Prefix('transform')

    this.touchEvents = true

    this.fakeScroll = false

    this.onTouchMoveEvent = this.onTouchMove.bind(this)
    this.onTouchDownEvent = this.onTouchDown.bind(this)
    this.onTouchUpEvent = this.onTouchUp.bind(this)

    this.mobileScroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0,
      shift: 0,
      finish: 0,
    }

    this.scrollDistance = 0
    this.distance = 0

    this.offsetScroll = {
      target: 0,
      limit: 0,
    }

    this.popUpEngaged = false

    this.skipping = false

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0,
      shift: 0,
      finish: 0,
    }
    this.create()
  }

  callPopup(element) {
    this.popUp = element
    const wrapperHeight = this.popUp.getBoundingClientRect().height
    this.popUpEngaged = true

    this.scroll.min = this.scroll.current

    this.setLimits(this.scroll.current + wrapperHeight, undefined)
    console.log(this.scroll.current + wrapperHeight, this.scroll.limit)
  }

  callPopupClose() {
    this.popUpEngaged = false
    this.scroll.min = 0
    this.onResize()
  }

  createNavigation() {
    if (!this.navigation) {
      this.navigation = new Navigation({
        template: this.template,
      })
    }
  }

  create(id) {
    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0,
      position: 0,
      shift: 0,
      finish: 0,
    }

    this.contentDiv = document.querySelector(this.selectorContent)
    this.pageElements = {}

    each(this.selectorElements, (element, key) => {
      if (
        element instanceof window.HTMLElement ||
        element instanceof window.NodeList ||
        Array.isArray(element)
      ) {
        this.pageElements[key] = element
      } else {
        this.pageElements[key] = document.querySelectorAll(element)

        if (this.pageElements[key].length === 0) {
          this.pageElements[key] = null
        } else if (this.pageElements[key].length === 1) {
          this.pageElements[key] = document.querySelector(element)
        }
      }
    })

    this.createPreloaders()
  }

  checkStopScrolling() {
    this.scroll.current = 0
    this.scroll.last = 0
    this.scroll.target = 0
  }

  createPreloaders() {
    this.preloaders = map(this.pageElements.preloaders, (element) => {
      return new AsyncLoad({
        element,
      })
    })
  }

  destroy() {
    this.removeEventListeners()
  }

  fetchLanguage() {
    return 1
  }

  pageAnimationsCheck() {
    if (this.id === 'home') {
    }
  }

  initAnimation() {}

  pageAnimateIn() {
    return new Promise((resolve) => {
      this.animationIn = GSAP.timeline()
      this.animationIn.fromTo(
        this.contentDiv,
        {
          autoAlpha: 1,
        },
        {
          autoAlpha: 1,
          onComplete: resolve,
        }
      )

      this.animationIn.call((_) => {
        this.addEventListeners()
        this.initAnimation()
        resolve()
      })
    })
  }

  pageAnimateOut() {
    this.destroy()
    this.animationOut = GSAP.timeline()
    return new Promise((resolve) => {
      GSAP.to(this.contentDiv, {
        autoAlpha: 0,
        onComplete: resolve,
      })
    })
  }

  onMouseWheel({ pixelY }) {
    const fixedPixelY = !this.touchEvents
      ? Math.min(Math.max(pixelY, -100), 100)
      : Math.min(Math.max(pixelY, -75), 75) // -- Scroll speed for the trackpad

    // const fixedPixelY = Math.min(Math.max(pixelY, -50), 50)

    if (this.fakeScroll === true) {
      this.scroll.target = GSAP.utils.clamp(
        0,
        this.scroll.target + window.innerHeight,
        this.scroll.target
      )
    } else this.scroll.target += fixedPixelY

    this.scrollDistance = fixedPixelY
  }

  onTouchMove(event) {
    if (!Detection.isPhone() || !this.isDown) return

    const y = event.touches ? event.touches[0].clientY : event.clientY
    this.distance = (this.start - y) * 3

    this.scroll.target = this.scroll.position + this.distance
  }

  onTouchDown(event) {
    if (!Detection.isPhone()) return

    if (!this.touchEvents) return

    this.isDown = true

    this.scroll.position = this.scroll.current
    this.start = event.touches ? event.touches[0].clientY : event.clientY
  }

  onTouchUp(event) {
    if (!Detection.isPhone()) return

    this.isDown = false
  }

  onResize() {
    const limit = this.pageElements.wrapper.clientHeight
    this.setLimits(limit, false)
  }

  transform(element, y) {
    element.style[this.transformPrefix] = `translate3d(0, ${-Math.round(
      y
    )}px, 0)`
  }

  setPopups() {
    each(this.selectorElements.popUps, (element) => {
      element.style.top = this.scroll.current + 'px'
    })

    this.scroll.min = this.scroll.current
  }

  scrollTo(value) {
    const delta = -(this.scroll.current - value)

    this.scroll.target += delta
  }

  setLimits(limit, skip) {
    if (skip == true) {
      this.skipping = true
      this.scroll.limit = limit - window.innerHeight
    } else {
      this.skipping = false
      this.scroll.limit = limit - window.innerHeight
    }
  }

  calculateScroll() {
    this.scroll.target = GSAP.utils.clamp(
      0,
      this.scroll.limit,
      this.scroll.target
    )

    if (this.popUpEngaged === true) {
      this.scroll.target = GSAP.utils.clamp(
        this.scroll.min,
        this.scroll.limit,
        this.scroll.target
      )
    }

    this.scroll.current = GSAP.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      0.025
    )
  }

  update(offset) {
    this.calculateScroll(this.offsetScroll.target, this.offsetScroll.limit)

    if (
      this.selectorElements.popUps.length > 0 &&
      this.popUpEngaged === false
    ) {
      this.setPopups()
    }

    if (this.scroll.current < 0.025) {
      this.scroll.current = 0
    }

    if (this.three) {
      this.three.setPosition(this.scroll.current)
    }

    if (this.popUpEngaged && this.popUp) {
      this.transform(this.popUp, this.scroll.current)
      this.transform(this.pageElements.wrapper, this.scroll.current)
    } else if (this.pageElements.wrapper) {
      this.transform(this.pageElements.wrapper, this.scroll.current)
    }
  }

  addEventListeners() {
    each(this.pageElements.animationsCategoryMasks, (element) => {
      element.addEventListener('click', this.checkStopScrolling())
    })
  }

  removeEventListeners() {}

  disableScrolling() {
    this.x = window.scrollX
    this.y = window.scrollY
    window.onscroll = function () {
      window.scrollTo(this.x, this.y)
    }
  }

  enableScrolling() {
    window.onscroll = function () {}
  }
}
