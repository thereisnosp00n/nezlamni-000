import Component from 'classes/component'

export default class Animation extends Component {
  constructor({ element }) {
    super({
      element,
    })
    this.element = element
    this.createObserver()
    // this.animateOut()
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

  animateIn() {}

  animateOut() {}
}
