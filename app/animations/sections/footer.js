import GSAP from 'gsap'
import each from 'lodash/each'

export default class Footer {
  constructor({ element, pageEvents }) {
    this.element = element
    this.pageEvents = pageEvents
    this.timeline = GSAP.timeline()

    this.getElements()
    this.setElements()
  }

  animateIn() {
    GSAP.to(this.line, {
      width: '100%',
      duration: 1.5,
      ease: 'power3.out',
    })

    GSAP.from(this.logos, {
      autoAlpha: 0,
      duration: 0.75,
      ease: 'power3.out',
      stagger: {
        amount: 0.6,
      },
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
    this.line = this.element.querySelector('.footer__line')
    this.logos = this.element.querySelectorAll('.footer__logo__wrapper')
  }

  setElements() {
    GSAP.set(this.line, {
      width: '0%',
    })

    each(this.logos, (element) => {
      element.style.visibility = 'hidden'
    })

    this.observers = []

    const lineOptions = {
      root: null,
      rootMargin: '0% 0% 0% 0%',
      threshold: 0.0,
    }

    this.createObserver(this.line, lineOptions, this.animateIn.bind(this))
  }
}
