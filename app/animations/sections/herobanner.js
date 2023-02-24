import GSAP from 'gsap'
import each from 'lodash/each'
import { split } from 'utils/text'

export default class HeroBanner {
  constructor({ element, pageEvents }) {
    this.element = element
    this.pageEvents = pageEvents

    this.timeline = GSAP.timeline({})

    this.getElements()
    this.setElements()
  }

  initAnimation() {
    // this.pageEvents.scrollManagement.disableScroll()
    this.animateInImage()
  }

  animateInTitle(element, delay = 0, finish = false) {
    this.timeline.from(
      element,
      {
        yPercent: 100,
        autoAlpha: 0,
        duration: 0.75,
        ease: 'power3.out',
      },
      `>${delay}`
    )

    if (finish === false) return

    this.timeline.call(() => {
      this.pageEvents.scrollManagement.enableScroll()
    })
  }

  animateInImage() {
    this.timeline.to(this.image, {
      height: '100vh',
      duration: 2.5,
      ease: 'power3.out',
    })

    this.timeline.to(
      this.imageWrapper,
      {
        height: this.imageWrapperHeight,
        duration: 2.25,
        ease: 'power3.out',
      },
      '>-1.5'
    )

    this.animateInTitle(this.titlesSpans[0], -0.75, true)
  }

  createObserver(element) {
    this.observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log('animating')
            this.animateInTitle(element, 0, false)
            this.observer.unobserve(element)
          } else {
            //this.animateOut()
          }
        })
      },
      { threshold: 1.0 }
    )
    this.observer.observe(element)
  }

  getElements() {
    this.imageWrapper = this.element.querySelector(
      '.index__herobanner__image__wrapper'
    )
    this.image = this.element.querySelector(
      '.index__herobanner__image__wrapper img'
    )

    this.titles = this.element.querySelectorAll('.index__herobanner__title')

    each(this.titles, (element) => {
      split({
        element,
        append: true,
        expression: '<br>',
      })
    })

    this.titlesSpans = this.element.querySelectorAll('span')
  }

  setElements() {
    this.handlerArray = [...this.titlesSpans]

    each(this.handlerArray, (element) => {
      element.style.visibility = 'hidden'
    })

    // each(this.titles, (element) => {
    //   this.createObserver(element)
    // })

    console.log(this.titlesSpans)

    this.createObserver(this.titlesSpans[1])

    GSAP.set(this.image, {
      height: '120vh',
    })

    this.imageWrapperHeight = this.imageWrapper.getBoundingClientRect().height

    GSAP.set(this.imageWrapper, {
      height: '120vh',
    })
  }
}
