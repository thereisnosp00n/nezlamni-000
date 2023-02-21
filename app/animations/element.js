import GSAP from 'gsap'

export default class Image {
  constructor({ element, pageEvents }) {
    this.pageEvents = pageEvents
    this.element = element
  }

  animateIn() {}

  animateOut() {}
}
