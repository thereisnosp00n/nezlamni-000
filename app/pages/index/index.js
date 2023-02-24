import Page from 'classes/page'
import each from 'lodash/each'
import DetectionManager from 'classes/detection'
import _ from 'lodash'

import Header from 'components/header'
import Projects from 'animations/sections/projects'
import Gallery from 'animations/sections/gallery'
import CreatedBy from 'animations/sections/createdby'

export default class Index extends Page {
  constructor({ pageEvents }) {
    super({
      id: 'index',
      contentDiv: '.content',
      pageElements: {
        wrapper: '.index__wrapper',
        projects: '.index__projects',
        gallery: '.index__gallery__wrapper',
        createdby: '.index__createdby__wrapper',
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

    this.pageEvents.eventEmitter.on('onResize', () => {
      super.onResize()
    })
  }

  createSectionsAnimations() {
    this.sectionAnimations = []

    this.projectsAnimations = new Projects({
      element: this.pageElements.projects,
      pageEvents: this.pageEvents,
    })

    this.galleryAnimations = new Gallery({
      element: this.pageElements.gallery,
      pageEvents: this.pageEvents,
    })

    this.createdbyAnimations = new CreatedBy({
      element: this.pageElements.createdby,
      pageEvents: this.pageEvents,
    })

    this.sectionAnimations.push(this.projectsAnimations, this.galleryAnimations)
  }

  createLayout(events) {
    this.header = new Header({ pageEvents: events })

    this.header.showHeader()
  }

  onResize() {
    super.onResize()
    this.calculateParameters()
    this.resizeAnimations()
  }

  onTouchDown(event) {
    each(this.sectionAnimations, (element) => {
      if (element && element.onTouchDown) {
        element.onTouchDown(event)
      }
    })
  }

  onTouchMove(event) {
    each(this.sectionAnimations, (element) => {
      if (element && element.onTouchMove) {
        element.onTouchMove(event)
      }
    })
  }

  onTouchUp(event) {
    each(this.sectionAnimations, (element) => {
      if (element && element.onTouchUp) {
        element.onTouchUp(event)
      }
    })
  }

  resizeAnimations() {
    each(this.sectionAnimations, (element) => {
      if (element && element.onResize) {
        element.onResize()
      }
    })
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
