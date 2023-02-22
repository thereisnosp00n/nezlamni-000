import GSAP from 'gsap'
import each from 'lodash/each'
import map from 'lodash/map'
import Project from '../project'

export default class Projects {
  constructor({ element, pageEvents }) {
    this.element = element
    this.pageEvents = pageEvents
    this.timeline = GSAP.timeline()

    this.getElements()
    this.setElements()
  }

  animateIn() {}

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

  getElements() {
    const projects = document.querySelectorAll('.index__project__wrapper')
    this.projects = map(projects, (element) => {
      return new Project({ element, pageEvents: this.pageEvents })
    })

    console.log(this.projects)
  }

  setElements() {}

  onResize() {
    each(this.projects, (element) => {
      element.onResize()
    })
  }
}
