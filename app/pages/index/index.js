import Page from 'classes/page'
import each from 'lodash/each'
import DetectionManager from 'classes/detection'
import _ from 'lodash'

import Header from 'components/header'

export default class Index extends Page {
  constructor({ pageEvents }) {
    super({
      id: 'index',
      contentDiv: '.content',
      pageElements: {
        wrapper: '.index__wrapper',
      },
    })

    this.pageEvents = pageEvents

    // this.createLayout(this.pageEvents)
    this.createSectionsAnimations()
    this.createCustomEvents()
    this.createLayout()
  }

  initAnimation() {
    // this.herobannerAnimations.initAnimation()
  }

  calculateParameters() {}

  createCustomEvents() {
    this.pageEvents.eventEmitter.on('herobanner-completed', () => {
      this.header.showHeader()
      super.onResize()
      this.pageEvents.scrollManagement.enableScroll()
    })
  }

  createSectionsAnimations() {}

  createLayout(events) {
    this.header = new Header({ pageEvents: events })

    this.header.showHeader()
  }

  onResize() {
    super.onResize()

    this.calculateParameters()
  }

  addEventListeners() {
    each(this.pageElements.buttons, (element) => {
      element.addEventListener('click', () => {
        this.form.showForm()
        super.callPopup(this.pageElements.form)
      })
    })

    this.pageEvents.eventEmitter.on('form-opened', () => {
      super.callPopup(this.pageElements.form)
    })

    this.pageEvents.eventEmitter.on('form-closed', () => {
      super.callPopupClose()
    })

    this.pageEvents.eventEmitter.on('form-success', () => {
      // super.onResize()
      super.setLimits(window.innerHeight)
    })
  }

  onMouseWheel(event) {
    super.onMouseWheel(event)
    this.header.onMouseWheel(event)
  }
}
