import GSAP from 'gsap'
import each from 'lodash/each'
import { split, calculate } from 'utils/text'
import DetectionManager from 'classes/detection'

export default class WorldSupports {
  constructor({ element, pageEvents }) {
    this.element = element
    this.pageEvents = pageEvents
    this.timeline = GSAP.timeline()

    this.getElements()
    this.setElements()
    this.createObservers()
  }

  animateInImage(element) {
    const image = element.querySelector('img')

    GSAP.from(element, {
      autoAlpha: 0,
      yPercent: 25,
      duration: 0.75,
      ease: 'power3.out',
    })

    GSAP.to(image, {
      scale: 1,
      duration: 3,
    })
  }

  animateInSpans(element) {
    GSAP.from(element, {
      autoAlpha: 0,
      y: '3rem',
      duration: 0.5,
      ease: 'power3.out',
    })
  }

  animateInBigText(element) {
    const spans = element.querySelectorAll('span span')

    DetectionManager.isPhone()
      ? false
      : GSAP.from(spans, {
          autoAlpha: 0,
          y: '3rem',
          duration: 0.5,
          ease: 'power3.out',
          stagger: { amount: 2.0 },
        })
  }

  createObservers() {
    this.observers = []

    const imageOptions = {
      root: null,
      rootMargin: '0% 0% 0% 0%',
      threshold: 0.75,
    }

    this.createObserver(this.imageWrapper, imageOptions, this.animateInImage)
    // this.createObserver(this.map, imageOptions, this.animateInImage)

    const textOptions = {
      root: null,
      rootMargin: '-25% 0% -25% 0%',
      threshold: 0.5,
    }

    const bigTextOptions = {
      root: null,
      rootMargin: '-25% 0% -25% 0%',
      threshold: 0.0,
    }

    each(
      [this.paragraphs[0], this.paragraphs[1], this.paragraphs[2]],
      (element) => {
        this.createObserver(element, textOptions, this.animateInSpans)
      }
    )

    this.createObserver(
      this.paragraphs[3],
      bigTextOptions,
      this.animateInBigText
    )
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
    this.imageWrapper = this.element.querySelector(
      '.index__worldsupports__wrapper__image__wrapper'
    )
    this.paragraphs = this.element.querySelectorAll(
      '.index__worldsupports__paragraph p'
    )
    this.map = this.element.querySelector(
      '.index__worldsupports__map__image__wrapper'
    )
  }

  setElements() {
    this.handlerArray = [
      this.imageWrapper,
      // this.map
    ]

    for (let i = 0; i < 2; i++) {
      split({ element: this.paragraphs[3], append: false })
    }

    for (let i = 0; i < this.paragraphs.length - 1; i++) {
      this.paragraphs[i].style.visibility = 'hidden'
    }

    each(this.handlerArray, (element) => {
      element.style.visibility = 'hidden'

      const image = element.querySelector('img')

      if (!image) return

      GSAP.set(image, {
        scale: 1.25,
      })
    })
  }
}
