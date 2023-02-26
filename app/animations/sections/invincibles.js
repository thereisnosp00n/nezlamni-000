import GSAP from 'gsap'
import each from 'lodash/each'

export default class Invincibles {
  constructor({ element, pageEvents }) {
    this.element = element
    this.pageEvents = pageEvents
    this.timeline = GSAP.timeline()

    this.getElements()
    this.setElements()
    this.createObservers()
  }

  animateTitle() {
    GSAP.from(this.title, {
      y: '6rem',
      autoAlpha: 0,
      duration: 1.25,
      ease: 'power3.out',
    })

    GSAP.to(this.logo, {
      delay: 0.25,
      scale: 1,
      autoAlpha: 1,
      duration: 1.0,
      ease: 'power3.out',
    })
  }

  animateSocials() {
    GSAP.from(this.socialsTitle, {
      autoAlpha: 0,
      ease: 'power3.out',
      duration: 1,
    })

    GSAP.from(this.socials, {
      y: '3rem',
      autoAlpha: 0,
      ease: 'power3.out',
      duration: 1,
      stagger: {
        amount: 0.5,
      },
    })
  }

  createObservers() {
    this.observers = []

    const titleOptions = {
      root: null,
      rootMargin: '-25% 0% -25% 0%',
      threshold: 0.5,
    }

    this.createObserver(this.title, titleOptions, this.animateTitle.bind(this))

    const socialsOptions = {
      root: null,
      rootMargin: '-25% 0% -25% 0%',
      threshold: 0.5,
    }

    this.createObserver(
      this.socialsTitle,
      socialsOptions,
      this.animateSocials.bind(this)
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
    this.title = this.element.querySelector('.index__invincibles__title')

    this.logo = this.element.querySelector('.index__invincibles__logo__wrapper')

    this.socialsTitle = this.element.querySelector(
      '.index__invincibles__getintouch__title'
    )
    this.socials = this.element.querySelectorAll(
      '.index__invincibles__getintouch__contact__wrapper'
    )
  }

  setElements() {
    this.handlerArray = [
      this.logo,
      this.title,
      this.socialsTitle,
      ...this.socials,
    ]

    each(this.handlerArray, (element) => {
      element.style.visibility = 'hidden'
    })

    GSAP.set(this.logo, {
      scale: 1.25,
    })
  }
}
