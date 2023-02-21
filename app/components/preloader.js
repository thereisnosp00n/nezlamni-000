import GSAP from 'gsap'
import Component from 'classes/component'
import each from 'lodash/each'
import ScrollManagement from 'utils/scroll'

export default class Preloader extends Component {
  constructor({ pageEvents }) {
    super({
      contentDiv: '.preloader',
      pageElements: {
        preloaderTitle: '.preloader__title',
        preloaderPercents: '.preloader__percents',
        images: document.querySelectorAll('img'),
      },
    })
    this.pageEvents = pageEvents
    this.length = 0
    this.createLoader()
  }

  createLoader() {
    this.pageEvents.scrollManagement.disableScroll()

    each(this.pageElements.images, (element) => {
      element.onload = (_) => this.onAssetLoaded(element)
      element.src = element.getAttribute('data-src')
    })
  }

  preloaderAnimateOut() {
    return new Promise((resolve) => {
      GSAP.to(this.contentDiv, {
        alpha: 0,
        onComplete: resolve,
      })
    })
  }

  onAssetLoaded(image) {
    this.length += 1

    const percent = this.length / this.pageElements.images.length
    this.pageElements.preloaderPercents.innerHTML = `${Math.round(
      percent * 100
    )}`
    if (percent === 1) {
      this.onLoaded()
    }
  }

  onLoaded() {
    return new Promise((resolve) => {
      this.animateOut = GSAP.timeline({
        delay: 2,
      })
      this.animateOut.to(this.contentDiv, {
        autoAlpha: 0,
        duration: 1,
        // resolve,
        onComplete: () => {
          this.pageEvents.scrollManagement.enableScroll()
        },
      })

      this.animateOut.call((_) => {
        this.pageEvents.eventEmitter.emit('completed')
        resolve()
      })
    })
  }

  addEventListeners() {}

  destroyPreloader() {
    this.contentDiv.parentNode.removeChild(this.contentDiv)
  }
}
