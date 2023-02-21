import GSAP from 'gsap'
import each from 'lodash/each'

export default class HeroBanner {
  constructor({ element, pageEvents }) {
    this.element = element
    this.pageEvents = pageEvents
    this.timeline = GSAP.timeline()

    this.getElements()
    this.setElements()
  }

  createObserver() {
    this.observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateIn()
            this.observer.unobserve(this.element)
          } else {
            //this.animateOut()
          }
        })
      },
      { rootMargin: '50px 50px 50px 50px' }
    )
    this.observer.observe(this.element)
  }

  getElements() {}

  setElements() {}
}
