import GSAP from 'gsap'
import each from 'lodash/each'

export default class HowToHelp {
  constructor({ element, pageEvents }) {
    this.element = element
    this.pageEvents = pageEvents
    this.timeline = GSAP.timeline()

    this.getElements()
    this.setElements()
    this.createObservers()
  }

  animateHeader() {
    GSAP.to(this.element, {
      backgroundColor: '#1E2223',
      duration: 1.25,
    })

    GSAP.from([this.title, this.subtitle], {
      y: '3rem',
      autoAlpha: 0,
      duration: 0.65,
      ease: 'power3.out',
      stagger: { amount: 0.75 },
    })
  }

  animateCrypto() {
    GSAP.from(this.cryptoTitle, {
      autoAlpha: 0,
      duration: 0.75,
    })

    GSAP.from(this.cryptoCards, {
      y: '-6rem',
      autoAlpha: 0,
      duration: 0.75,
      ease: 'power3.out',
      stagger: {
        amount: 0.9,
      },
    })
  }

  animateWire() {
    GSAP.from(this.wireTitle, {
      autoAlpha: 0,
      duration: 0.75,
    })

    GSAP.from(this.wireCards, {
      autoAlpha: 0,
      filter: 'blur(10px)',
      duration: 0.95,
      y: '6rem',
      ease: 'power3.out',
      stagger: {
        amount: 0.5,
      },
    })
  }

  animateButton() {
    GSAP.from(this.button, {
      autoAlpha: 0,
      y: '3rem',
      duration: 0.75,
    })
  }

  createObservers() {
    this.observers = []

    const headerOptions = {
      root: null,
      rootMargin: '-25% 0% -25% 0%',
      threshold: 0.5,
    }

    this.createObserver(
      this.title,
      headerOptions,
      this.animateHeader.bind(this)
    )

    const cryptoOptions = {
      root: null,
      rootMargin: '-25% 0% -25% 0%',
      threshold: 0.5,
    }

    this.createObserver(
      this.cryptoCardsWrapper,
      cryptoOptions,
      this.animateCrypto.bind(this)
    )

    const wireOptions = {
      root: null,
      rootMargin: '-25% 0% -25% 0%',
      threshold: 0.25,
    }

    this.createObserver(
      this.wireCardsWrapper,
      wireOptions,
      this.animateWire.bind(this)
    )

    const buttonOptions = {
      root: null,
      rootMargin: '-25% 0% -25% 0%',
      threshold: 0.5,
    }

    this.createObserver(
      this.button,
      buttonOptions,
      this.animateButton.bind(this)
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
    this.title = this.element.querySelector('.index__howtohelp__title')

    this.subtitle = this.element.querySelector('.index__howtohelp__subtitle')

    this.cryptoTitle = this.element.querySelector(
      '.index__howtohelp__crypto__title'
    )
    this.cryptoCards = this.element.querySelectorAll(
      '.index__howtohelp__crypto__card__wrapper'
    )
    this.cryptoCardsWrapper = this.element.querySelector(
      '.index__howtohelp__crypto__cards__wrapper'
    )
    this.wireTitle = this.element.querySelector(
      '.index__howtohelp__wire__title'
    )
    this.wireCards = this.element.querySelectorAll(
      '.index__howtohelp__wire__card__wrapper'
    )
    this.wireCardsWrapper = this.element.querySelector(
      '.index__howtohelp__wire__cards__wrapper'
    )
    this.button = this.element.querySelector(
      '.index__howtohelp__cardpayment__button'
    )
  }

  setElements() {
    GSAP.set(this.element, {
      backgroundColor: '#0F0F0F',
    })

    this.handlerArray = [
      this.title,
      this.subtitle,
      this.cryptoTitle,
      ...this.cryptoCards,
      this.wireTitle,
      ...this.wireCards,
      this.button,
    ]

    each(this.handlerArray, (element) => {
      element.style.visibility = 'hidden'
    })
  }
}
