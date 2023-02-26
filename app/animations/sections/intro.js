import GSAP from 'gsap'
import each from 'lodash/each'
import { split, calculate } from 'utils/text'

export default class Intro {
  constructor({ element, pageEvents }) {
    this.element = element
    this.pageEvents = pageEvents
    this.timeline = GSAP.timeline()

    this.getElements()
    this.setElements()
  }

  animateInImage(element) {
    const image = element.querySelector('img')
    const random = Math.random() / 2

    GSAP.from(element, {
      delay: random,
      autoAlpha: 0,
      yPercent: 20 + 10 * random,
      duration: 0.75,
      ease: 'power3.out',
    })

    GSAP.to(image, {
      scale: 1.25,
      duration: 5 + 2 * random,
    })
  }

  animateInSpans(element) {
    const spans = element.querySelectorAll('span')
    GSAP.from(spans, {
      autoAlpha: 0,
      yPercent: 100,
      duration: 0.75,
      ease: 'power3.in',
      stagger: {
        amount: 1,
      },
    })
  }

  createSpansObserver(element) {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateInSpans(element)
            observer.unobserve(element)
          } else {
            //this.animateOut()
          }
        })
      },
      { threshold: 0.0, rootMargin: '-25% 0%' }
    )
    observer.observe(element)
    this.observers.push(observer)
  }

  createImageObserver(element) {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateInImage(element)
            observer.unobserve(element)
          } else {
            //this.animateOut()
          }
        })
      },
      { threshold: 0.75 }
    )
    observer.observe(element)
    this.observers.push(observer)
  }

  getElements() {
    this.paragraphs = this.element.querySelectorAll(
      '.index__intro__paragraph p'
    )

    this.imageWrappers = this.element.querySelectorAll(
      '.index__intro__gallery__image__wrapper'
    )

    each(this.paragraphs, (element) => {
      split({ element, append: true, expression: '<br>' })
    })

    this.paragraphsSpans = each(this.paragraphs, (element) => {
      element.querySelectorAll('span')
    })
  }

  setElements() {
    this.handlerArray = []
    this.observers = []

    this.handlerArray.push(...this.paragraphs, ...this.imageWrappers)

    each(this.imageWrappers, (element) => {
      element.style.visibility = 'hidden'
    })

    this.observers = []

    each(this.paragraphs, (element) => {
      this.createSpansObserver(element)
    })

    each(this.imageWrappers, (element) => {
      this.createImageObserver(element)
    })
  }
}
