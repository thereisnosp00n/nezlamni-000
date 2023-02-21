import Component from 'classes/component'

export default class AsyncLoad extends Component {
  constructor({ element, pageElements }) {
    super({ element, pageElements })
    this.image = element
    this.createObserver()
  }

  createObserver() {
    this.observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!this.image.src) {
            this.image.src = this.image.getAttribute('data-src')
            this.image.onload = (_) => {
              this.image.classList.add('loaded')
            }
          }
        }
      })
    })
    this.observer.observe(this.image)
  }
}
