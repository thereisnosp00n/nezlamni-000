import GSAP from 'gsap'
import each from 'lodash/each'

export default class Project {
  constructor({ element, pageEvents }) {
    this.element = element
    this.pageEvents = pageEvents
    this.timeline = GSAP.timeline()

    this.getElements()
    this.shiftAmount = this.expandWrapper.getBoundingClientRect().height
    this.setElements()
    // this.addEventListeners()
    this.initExpandTimeline()
    this.createObservers()

    this.expanded = false
  }

  animateIn() {
    this.expandTimeline.restart()
  }

  animateInImage() {
    GSAP.from(this.imageWrapper, {
      autoAlpha: 0,
      duration: 0.5,
    })

    GSAP.from(this.image, {
      scale: 1,
      duration: 3.5,
      ease: 'linear',
    })

    GSAP.to(this.topLine, {
      width: '100%',
      duration: 1.75,
      ease: 'power3.out',
    })

    GSAP.from(this.projectNumber, {
      autoAlpha: 0,
      filter: 'blur(1.5px)',
      duration: 0.5,
    })
  }

  animateInContent() {
    GSAP.from(this.title, {
      y: '3rem',
      autoAlpha: 0,
      duration: 0.65,
      ease: 'power3.out',
    })

    GSAP.from([this.goal, this.button, this.details], {
      delay: 0.25,
      autoAlpha: 0,
      duration: 0.5,
      stagger: {
        amount: 0.5,
      },
      onComplete: () => {
        this.addEventListeners()
      },
    })
  }

  createObservers() {
    this.observers = []

    const imageOptions = {
      root: null,
      rootMargin: '-25% 0% -25% 0%',
      threshold: 0.15,
    }

    this.createObserver(
      this.imageWrapper,
      imageOptions,
      this.animateInImage.bind(this)
    )

    const contentOptions = {
      root: null,
      rootMargin: '-25% 0% -25% 0%',
      threshold: 0.0,
    }

    this.createObserver(
      this.title,
      contentOptions,
      this.animateInContent.bind(this)
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
  }

  initExpandTimeline() {
    this.expandTimeline = GSAP.timeline({
      defaults: {
        overwrite: true,
      },
      paused: true,
    })

    this.expandTimeline.add(
      GSAP.from(this.subtitle, {
        yPercent: 70,
        autoAlpha: 0,
        duration: 0.35,
        ease: 'power3.out',
      })
    )

    this.expandTimeline.add(
      GSAP.from(
        this.line,
        {
          height: 0,
          duration: 0.5,
          autoAlpha: 0,
          ease: 'power3.out',
        },
        '>'
      )
    )

    this.expandTimeline.add(
      GSAP.from(
        this.paragraphs,
        {
          yPercent: 20,
          autoAlpha: 0,
          duration: 0.35,
        },
        '<'
      )
    )

    this.expandTimeline.add(
      GSAP.from(
        this.needed,
        {
          autoAlpha: 0,
          duration: 0.35,
        },
        '>'
      )
    )

    this.expandTimeline.add(
      GSAP.from(this.list, {
        autoAlpha: 0,
        width: '50%',
        xPercent: -15,
        stagger: {
          amount: 1,
        },
      })
    )
  }

  animateOut() {}

  detailsHandler() {
    this.expanded === true ? this.hide() : this.expand()
  }

  expand() {
    this.expanded = true

    GSAP.to(this.expandWrapper, {
      height: this.shiftAmount,
      duration: 2,
      ease: 'power2.out',
      overwrite: true,
      onComplete: () => {
        this.pageEvents.eventEmitter.emit('onResize')
      },
    })

    GSAP.to(this.arrow, {
      rotation: 90,
      duration: 0.5,
      onComplete: () => {
        this.animateIn()
      },
    })
  }

  hide() {
    this.expanded = false

    GSAP.to(this.expandableContent, {
      autoAlpha: 0,
      duration: 0.5,
      ease: 'power3.in',
    })

    GSAP.to(this.expandWrapper, {
      height: 0,
      duration: 0.5,
      ease: 'linear',
      overwrite: true,
      onComplete: () => {
        this.pageEvents.eventEmitter.emit('onResize')
        this.hideElements()
      },
    })

    GSAP.to(this.arrow, {
      rotation: 0,
      duration: 0.5,
    })
  }

  hoverOnButton() {
    GSAP.to(this.button, {
      backgroundColor: '#FFE459',
      boxShadow: '0px 5px 12px rgba(255, 228, 89, 0.35)',
      duration: 0.25,
      overwrite: true,
    })

    GSAP.to(this.button.querySelector('p'), {
      color: '#0F0F0F',
      duration: 0.25,
      overwrite: true,
    })
  }

  hoverOffButton() {
    GSAP.to(this.button, {
      backgroundColor: '#0F0F0F',
      boxShadow: '0px 0px 0px rgba(255, 228, 89, 0.35)',
      duration: 0.25,
      overwrite: true,
    })

    GSAP.to(this.button.querySelector('p'), {
      color: '#FFE459',
      duration: 0.25,
      overwrite: true,
    })
  }

  getElements() {
    this.projectNumber = this.element.querySelector('.index__project__number')
    this.title = this.element.querySelector('.index__project__title')

    this.details = this.element.querySelector(
      '.index__project__details__button'
    )

    this.imageWrapper = this.element.querySelector(
      '.index__project__image__wrapper'
    )

    this.goal = this.element.querySelector('.index__project__goal')

    this.image = this.imageWrapper.querySelector('img')
    this.topLine = this.element.querySelector('.index__project__line')

    this.button = this.element.querySelector('.index__project__support__button')

    this.expandWrapper = this.element.querySelector(
      '.index__project__expandable__wrapper'
    )

    this.arrow = this.element.querySelector('.index__arrow')

    this.subtitle = this.element.querySelector('.index__project__subtitle')
    this.paragraphs = this.element.querySelector('.index__project__paragraphs')
    this.line = this.element.querySelector('.index__project__paragraphs__line')

    this.needed = this.element.querySelector('.index__project__needed__title')
    this.list = this.element.querySelectorAll('.index__project__needed__list p')
  }

  hideElements() {
    each(this.expandableContent, (element) => {
      element.style.visibility = 'hidden'
    })
  }

  setElements() {
    this.handlerArray = []

    this.expandableContent = [
      ...this.list,
      this.subtitle,
      this.paragraphs,
      this.needed,
      this.line,
    ]

    this.handlerArray.push(
      this.goal,
      this.button,
      this.details,
      this.title,
      this.imageWrapper,
      this.projectNumber
    )

    each(this.handlerArray, (element) => {
      element.style.visibility = 'hidden'
    })

    this.hideElements()

    GSAP.set(this.expandWrapper, {
      height: '0',
    })

    GSAP.set(this.image, {
      scale: 1.25,
    })

    GSAP.set(this.topLine, {
      width: '0%',
    })
  }

  addEventListeners() {
    this.details.addEventListener('click', () => {
      this.detailsHandler()
    })

    this.button.addEventListener('mouseenter', () => {
      this.hoverOnButton()
    })

    this.button.addEventListener('mouseleave', () => {
      this.hoverOffButton()
    })
  }

  onResize() {
    // this.shiftAmount = this.expandWrapper.getBoundingClientRect()
  }
}
