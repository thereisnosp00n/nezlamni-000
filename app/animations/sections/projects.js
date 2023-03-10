import GSAP from 'gsap'
import each from 'lodash/each'
import map from 'lodash/map'
import Project from '../project'
import { split, calculate } from 'utils/text'

export default class Projects {
  constructor({ element, pageEvents }) {
    this.element = element
    this.pageEvents = pageEvents
    this.timeline = GSAP.timeline()

    this.getElements()
    this.setElements()
  }

  animateIn() {
    const spans = this.title.querySelector('span')

    GSAP.from(spans, {
      autoAlpha: 0,
      yPercent: 100,
      duration: 1,
      ease: 'power3.out',
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
    const projects = document.querySelectorAll('.index__project__wrapper')
    this.projects = map(projects, (element) => {
      return new Project({ element, pageEvents: this.pageEvents })
    })

    this.title = this.element.querySelector('.index__projects__title')
  }

  setElements() {
    split({ element: this.title, expression: '<br>' })

    this.observers = []

    const titleOptions = {
      root: null,
      rootMargin: '-25% 0% -25% 0%',
      threshold: 0.0,
    }

    this.createObserver(this.title, titleOptions, this.animateIn.bind(this))
  }

  onResize() {
    each(this.projects, (element) => {
      element.onResize()
    })
  }
}
