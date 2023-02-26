import GSAP from 'gsap'
import each from 'lodash/each'

export default class Gallery {
  constructor({ element, pageEvents }) {
    this.element = element
    this.pageEvents = pageEvents
    this.timeline = GSAP.timeline()

    this.getElements()
    this.setElements()
    this.addEventListeners()
    this.initAnimation()
  }

  animateHeader() {
    GSAP.to(this.element, {
      backgroundColor: '#0F0F0F',
      duration: 1.25,
    })

    GSAP.to(this.titleSpans, {
      autoAlpha: 1,
      duration: 0.75,
    })

    GSAP.to(this.galleryWrapper, {
      delay: 0.5,
      autoAlpha: 1,
      duration: 1.25,
      ease: 'power3.out',
    })
  }

  createObserver(element, options, method) {
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          method(element)
          observer.unobserve(element)
        } else {
          //this.animateOut()
        }
      })
    }, options)
    observer.observe(element)
    this.observers.push(observer)
  }

  getElements() {
    this.titleSpans = this.element.querySelector('.index__gallery__title')

    this.galleryWrapper = this.element.querySelector(
      '.index__gallery__images__slider__wrapper'
    )

    this.innerWrapper = this.element.querySelector(
      '.index__gallery__images__wrapper'
    )

    this.images = this.element.querySelectorAll(
      '.index__gallery__image__wrapper'
    )

    this.arrows = this.element.querySelectorAll(
      '.index__gallery__controls__arrow__wrapper'
    )
  }

  hoverOnArrow(element) {
    GSAP.to(element, {
      backgroundColor: '#FFE459',
      boxShadow: '0px 5px 12px rgba(255, 228, 89, 0.35)',
      duration: 0.25,
      overwrite: true,
    })

    GSAP.to(element.querySelector('img'), {
      filter: 'brightness(0.0)',
      duration: 0.25,
      overwrite: true,
    })
  }

  hoverOffArrow(element) {
    GSAP.to(element, {
      backgroundColor: '#0F0F0F',
      boxShadow: '0px 0px 0px rgba(255, 228, 89, 0.35)',
      duration: 0.25,
      overwrite: true,
    })

    GSAP.to(element.querySelector('img'), {
      filter: 'brightness(1.0)',
      duration: 0.25,
      overwrite: true,
    })
  }

  initAnimation() {
    this.timeline.to(this.images, {
      duration: this.images.length * 4,
      ease: 'none',
      x: `+=${this.wrapperWidth}px`,
      modifiers: {
        x: GSAP.utils.unitize((x) => parseFloat(x) % this.wrapperWidth),
      },
      repeat: -1,
      overwrite: true,
    })
  }

  onResize() {
    this.setElements()
  }

  onTouchDown(e) {}

  onTouchMove(e) {}

  onTouchUp(e) {}

  scrollSlider({ forward }) {
    this.timeline.pause()

    const x = forward ? `+=${this.imageWidth}px` : `-=${this.imageWidth}px`
    const mod = GSAP.utils.wrap(0, this.wrapperWidth)

    GSAP.to(this.images, {
      duration: 0.5,
      ease: 'power3.out',
      x,
      modifiers: {
        x: (x) => mod(parseFloat(x)) + 'px',
      },
      onComplete: () => {
        this.timeline.invalidate()
        this.timeline.restart()
      },
    })
  }

  setElements() {
    this.imageWidth = this.images[0].getBoundingClientRect().width
    this.wrapperWidth = this.imageWidth * (this.images.length + 0.1)

    this.handlerArray = [this.titleSpans, this.galleryWrapper]

    each(this.handlerArray, (element) => {
      element.style.visibility = 'hidden'
    })

    GSAP.set(this.images, {
      x: (i) => i * this.imageWidth,
    })

    GSAP.set(this.element, {
      backgroundColor: '#1E2223',
    })

    this.observers = []

    const titleOptions = {
      root: null,
      rootMargin: '-25% 0% -25% 0%',
      threshold: 0.5,
    }

    this.createObserver(
      this.titleSpans,
      titleOptions,
      this.animateHeader.bind(this)
    )
  }

  addEventListeners() {
    this.arrows[0].addEventListener('click', () => {
      this.scrollSlider({ forward: true })
    })

    this.arrows[1].addEventListener('click', () => {
      this.scrollSlider({ forward: false })
    })

    each(this.arrows, (element) => {
      element.addEventListener('mouseenter', () => {
        this.hoverOnArrow(element)
      })
    })

    each(this.arrows, (element) => {
      element.addEventListener('mouseleave', () => {
        this.hoverOffArrow(element)
      })
    })
  }
}
