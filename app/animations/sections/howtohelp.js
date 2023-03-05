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
      y: '6rem',
      autoAlpha: 0,
      duration: 0.75,
      ease: 'power3.out',
      stagger: {
        amount: 0.9,
      },
      onComplete: () => {
        each(this.copyButtons, (element) => {
          element.addEventListener('click', () => {
            this.copyValue(element)
          })
        })
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
      duration: 0.65,
      y: '3rem',
      ease: 'power3.out',
      stagger: {
        amount: 0.5,
      },
    })
  }

  animateButton() {
    GSAP.from([this.paypalButton, this.paymentButton], {
      autoAlpha: 0,
      y: '3rem',
      duration: 0.75,
      stagger: 0.25,
      onComplete: () => {
        this.addButtonEventListeners()
      },
    })
  }

  animateCopyButton(element) {
    const captionElement = element.querySelector(
      '.index__howtohelp__crypto__card__button__caption'
    )

    const originalCaption = captionElement.textContent

    const changedCaption = element.querySelector(
      '.index__howtohelp__crypto__card__button__copied__caption'
    ).textContent

    const copyTimeline = GSAP.timeline()

    copyTimeline.add(
      GSAP.to(
        captionElement,
        {
          autoAlpha: 0,
          duration: 0.35,
          onComplete: () => {
            captionElement.textContent = changedCaption
            captionElement.classList.remove('notclicked')
          },
        },
        '>'
      )
    )

    copyTimeline.add(
      GSAP.to(
        captionElement,
        {
          autoAlpha: 1,
          color: '#656565',
          duration: 0.35,
        },
        '>'
      )
    )

    copyTimeline.add(
      GSAP.to(
        captionElement,
        {
          delay: 1.5,
          autoAlpha: 0,
          duration: 0.35,
          onComplete: () => {
            captionElement.textContent = originalCaption
            captionElement.classList.add('notclicked')
          },
        },
        '>'
      )
    )

    copyTimeline.add(
      GSAP.to(
        captionElement,
        {
          autoAlpha: 1,
          duration: 0.35,
          color: '#FFE459',
        },
        '>'
      )
    )

    copyTimeline.restart()
  }

  copyValue(element) {
    const value = element.getAttribute('value')
    navigator.clipboard.writeText(value)

    this.animateCopyButton(element)
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
      threshold: 0.0,
    }

    this.createObserver(
      this.cryptoCardsWrapper,
      cryptoOptions,
      this.animateCrypto.bind(this)
    )

    const wireOptions = {
      root: null,
      rootMargin: '-15% 0% -15% 0%',
      threshold: 0.05,
    }

    this.createObserver(
      this.wireCardsWrapper,
      wireOptions,
      this.animateWire.bind(this)
    )

    const buttonOptions = {
      root: null,
      rootMargin: '-15% 0% -15% 0%',
      threshold: 0.0,
    }

    this.createObserver(
      this.paymentButton,
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

  hoverOnButton() {
    GSAP.to(this.paymentButton, {
      backgroundColor: '#FFE459',
      boxShadow: '0px 5px 12px rgba(255, 228, 89, 0.35)',
      duration: 0.25,
      overwrite: true,
    })

    GSAP.to(this.paymentButton.querySelector('p'), {
      color: '#0F0F0F',
      duration: 0.25,
      overwrite: true,
    })
  }

  hoverOnPayPal() {
    GSAP.to(this.paypalButton, {
      boxShadow: '0px 10px 24px rgba(95, 188, 255, 0.5)',
      duration: 0.25,
      overwrite: true,
    })

    // #0079CD

    GSAP.to(this.paypalButton.querySelector('p'), {
      color: '#0079CD',
      duration: 0.25,
      overwrite: true,
    })
  }

  hoverOffButton() {
    GSAP.to(this.paymentButton, {
      backgroundColor: 'rgba(15, 15, 15, 0)',
      boxShadow: '0px 0px 0px rgba(255, 228, 89, 0.35)',
      duration: 0.25,
      overwrite: true,
    })

    GSAP.to(this.paymentButton.querySelector('p'), {
      color: '#FFE459',
      duration: 0.25,
      overwrite: true,
    })
  }

  hoverOffPayPal() {
    GSAP.to(this.paypalButton, {
      boxShadow: '0px 5px 12px rgba(95, 188, 255, 0.00)',
      duration: 0.25,
      overwrite: true,
    })

    GSAP.to(this.paypalButton.querySelector('p'), {
      color: '#0F0F0F',
      duration: 0.25,
      overwrite: true,
    })
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

    this.paymentButton = this.element.querySelector('#regular-button')
    this.paypalButton = this.element.querySelector('#paypal-button')

    this.copyButtons = this.element.querySelectorAll(
      '.index__howtohelp__crypto__card__button'
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
      this.paymentButton,
      this.paypalButton,
    ]

    each(this.handlerArray, (element) => {
      element.style.visibility = 'hidden'
    })

    each(this.copyButtons, (element) => {
      const captionElement = element.querySelector(
        '.index__howtohelp__crypto__card__button__caption'
      )

      captionElement.classList.add('notclicked')
    })
  }

  addCopyEventListeners() {
    each(this.copyButtons, (element) => {
      element.addEventListener('click', () => {
        this.copyValue(element)
      })
    })
  }

  addButtonEventListeners() {
    this.paymentButton.addEventListener('mouseenter', () => {
      this.hoverOnButton()
    })

    this.paymentButton.addEventListener('mouseleave', () => {
      this.hoverOffButton()
    })

    this.paypalButton.addEventListener('mouseenter', () => {
      this.hoverOnPayPal()
    })

    this.paypalButton.addEventListener('mouseleave', () => {
      this.hoverOffPayPal()
    })
  }
}
