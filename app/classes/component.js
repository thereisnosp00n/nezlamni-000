import EventEmitter from 'events'
import each from 'lodash/each'

export default class Component extends EventEmitter {
  constructor ({
    contentDiv,
    pageElements
  }) {
    super()

    this.selectorContent = contentDiv
    this.selectorElements = {
      ...pageElements
    }
    this.create()
    this.addEventListeners()
  }

  create () {
    if (this.selectorContent instanceof window.HTMLElement) {
      this.contentDiv = this.selectorContent
    } else {
      this.contentDiv = document.querySelector(this.selectorContent)
    }
    this.pageElements = {}

    each(this.selectorElements, (element, key) => {
      if (element instanceof window.HTMLElement || element instanceof window.NodeList || Array.isArray(element)) {
        this.pageElements[key] = element
      } else {
        this.pageElements[key] = document.querySelectorAll(element)

        if (this.pageElements[key].length === 0) {
          this.pageElements[key] = null
        } else if (this.pageElements[key].length === 1) {
          this.pageElements[key] = document.querySelector(element)
        }
      }
    })
  }

  addEventListeners () {

  }

  removeEventListeners () {

  }
}
