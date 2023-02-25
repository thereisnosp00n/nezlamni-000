import GSAP from 'gsap'
import each from 'lodash/each'
import { split, calculate } from 'utils/text'

export default class CreatedBy {
  constructor({ element, pageEvents }) {
    this.element = element
    this.pageEvents = pageEvents
    this.timeline = GSAP.timeline()

    this.getElements()
    this.setElements()
    this.createObservers()
  }

  animateInLogos() {
    GSAP.from(this.logoWrappers, {
      autoAlpha: 0,
      y: '3rem',
      scale: 1.25,
      duration: 0.75,
      ease: 'power3.out',
      stagger: {
        amount: 0.9,
      },
    })
  }

  animateInTitle(element) {
    const spans = element.querySelectorAll('span span')

    GSAP.from(spans, {
      autoAlpha: 0,
      duration: 0.65,
      ease: 'linear',
      filter: 'blur(2.5px)',
      stagger: { amount: 0.5, from: 'random' },
    })
  }

  animateInParagraphs(element) {
    GSAP.from(element, {
      autoAlpha: 0,
      duration: 1.25,
      ease: 'linear',
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
  }

  createObservers() {
    this.observers = []

    const titleOptions = {
      root: null,
      rootMargin: '-25% 0% -25% 0%',
      threshold: 0.5,
    }

    const paragraphsOptions = {
      root: null,
      rootMargin: '-25% 0% -25% 0%',
      threshold: 0.5,
    }

    this.createObserver(this.paragraphs[0], titleOptions, this.animateInTitle)
    this.createObserver(
      this.paragraphs[1],
      paragraphsOptions,
      this.animateInParagraphs
    )

    const logosOptions = {
      root: null,
      rootMargin: '-25% 0% -25% 0%',
      threshold: 0.0,
    }

    this.createObserver(
      this.logoWrapper,
      logosOptions,
      this.animateInLogos.bind(this)
    )
  }

  getElements() {
    this.paragraphs = this.element.querySelectorAll(
      '.index__createdby__paragraph p'
    )

    this.links = this.element.querySelectorAll('.index__createdby__paragraph a')

    this.logoWrappers = this.element.querySelectorAll(
      '.index__createdby__logo__wrapper'
    )

    this.logoWrapper = this.element.querySelector(
      '.index__createdby__logos__wrapper'
    )
  }

  setElements() {
    this.handlerArray = [this.paragraphs[1], ...this.logoWrappers]

    each(this.handlerArray, (element) => {
      element.style.visibility = 'hidden'
    })

    each(this.links, (element) => {
      element.setAttribute('target', '_blank')
    })

    for (let i = 0; i < 2; i++) {
      split({ element: this.paragraphs[0], append: false })
    }
  }
}
