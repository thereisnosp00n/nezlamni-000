import GSAP from 'gsap'

export default class Image {
  constructor({ element, pageEvents }) {
    this.element = element
    this.pageEvents = pageEvents
    this.timeline = GSAP.timeline()

    this.getElements()
    this.setElements()
    this.addEventListeners()
  }

  animateIn() {}

  animateOut() {}

  expand() {
    GSAP.to(this.expandWrapper, {
      height: '100%',
      duration: 1,
      ease: 'power3.out',
    })
  }

  getElements() {
    this.details = this.element.querySelector(
      '.index__project__details__button'
    )
    this.expandWrapper = this.element.querySelector(
      '.index__project__expandable__wrapper'
    )
  }

  setElements() {
    GSAP.set(this.expandWrapper, {
      height: '0%',
    })
  }

  addEventListeners() {
    this.details.addEventListener('click', () => {
      this.expand()
    })
  }
}
