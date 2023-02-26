import GSAP from 'gsap'
import each from 'lodash/each'
import { split, calculate } from 'utils/text'

export default class BringVictory {
  constructor({ element, pageEvents }) {
    this.element = element
    this.pageEvents = pageEvents
    this.timeline = GSAP.timeline()

    this.getElements()
    this.setElements()
    this.createObservers()
    this.addEventListeners()
  }

  animateInTitle() {
    const spans = this.title.querySelectorAll('span')

    GSAP.from(spans, {
      autoAlpha: 0,
      duration: 0.65,
      ease: 'linear',
      filter: 'blur(2.5px)',
      stagger: { amount: 0.5 },
    })
  }

  animateInImage() {
    const image = this.imageWrapper.querySelector('img')

    GSAP.from(this.imageWrapper, {
      autoAlpha: 0,
      yPercent: 25,
      ease: 'power3.out',
      duration: 1,
    })
  }

  animateInParagraphs() {
    GSAP.from(this.paragraphs, {
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

    this.createObserver(
      this.title,
      titleOptions,
      this.animateInTitle.bind(this)
    )

    const imageOptions = {
      root: null,
      rootMargin: '-25% 0% -25% 0%',
      threshold: 0.0,
    }

    this.createObserver(
      this.imageWrapper,
      imageOptions,
      this.animateInImage.bind(this)
    )

    const paragraphsOptions = {
      root: null,
      rootMargin: '-25% 0% -25% 0%',
      threshold: 0.0,
    }

    this.createObserver(
      this.paragraphs,
      paragraphsOptions,
      this.animateInParagraphs.bind(this)
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

  hoverOnSocial(element) {
    GSAP.to(element, {
      backgroundColor: 'rgba(255, 255, 255, 0.0)',
      duration: 0.25,
      overwrite: true,
    })

    GSAP.to(element.querySelector('img'), {
      filter:
        'brightness(0) saturate(100%) invert(99%) sepia(5%) saturate(1%) hue-rotate(155deg) brightness(109%) contrast(100%)',
      duration: 0.25,
      overwrite: true,
    })
  }

  hoverOffSocial(element) {
    GSAP.to(element, {
      backgroundColor: 'rgba(255, 255, 255, 1.0)',
      duration: 0.25,
      overwrite: true,
    })

    GSAP.to(element.querySelector('img'), {
      filter:
        'brightness(0) saturate(100%) invert(29%) sepia(42%) saturate(3658%) hue-rotate(199deg) brightness(99%) contrast(106%)',
      duration: 0.25,
      overwrite: true,
    })
  }

  getElements() {
    this.title = this.element.querySelector('.index__bringvictory__title')
    this.imageWrapper = this.element.querySelector(
      '.index__bringvictory__image__wrapper'
    )
    this.paragraphs = this.element.querySelector(
      '.index__bringvictory__paragraphs'
    )
    this.socials = this.element.querySelectorAll(
      '.index__bringvictory__social__wrapper'
    )
  }

  setElements() {
    split({ element: this.title })

    this.handlerArray = [this.imageWrapper, this.paragraphs, ...this.socials]

    each(this.handlerArray, (element) => {
      element.style.visibility = 'hidden'
    })
  }

  addEventListeners() {
    each(this.socials, (element) => {
      element.addEventListener('mouseenter', () => {
        this.hoverOnSocial(element)
      })
    })

    each(this.socials, (element) => {
      element.addEventListener('mouseleave', () => {
        this.hoverOffSocial(element)
      })
    })
  }
}
