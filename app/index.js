import NormalizeWheel from 'normalize-wheel'
import Index from 'pages/index'
import Preloader from 'components/preloader'
import each from 'lodash/each'
import ScrollManagement from 'utils/scroll'
import Cursor from 'classes/cursor'
import DetectionManager from 'classes/detection'
import EventEmitter from 'events'

class App {
  constructor() {
    this.template = window.location.pathname
    this.scrollManagement = new ScrollManagement()

    this.createPageEvents()
    this.createPreloader()
    this.createContent()
    this.createPages()

    this.addLinkListeners()
    this.addEventListeners()
    this.createCursor()

    this.update()

    this.time = 0
  }

  createContent() {
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
  }

  createPageEvents() {
    this.pageEvents = {}

    this.pageEvents.eventEmitter = new EventEmitter()
    this.pageEvents.scrollManagement = new ScrollManagement()
  }

  createCursor() {
    if (DetectionManager.isPhone()) return

    const cursorDiv = document.createElement('div')
    cursorDiv.className = 'custom__cursor'

    const dotDiv = document.createElement('div')
    dotDiv.className = 'custom__cursor__dot'

    document.getElementsByTagName('body')[0].appendChild(dotDiv)
    document.getElementsByTagName('body')[0].appendChild(cursorDiv)

    this.cursor = new Cursor({
      element: cursorDiv,
      dot: dotDiv,
      links: this.linksArray,
    })
  }

  createPreloader() {
    this.preloader = new Preloader({ pageEvents: this.pageEvents })
    this.pageEvents.eventEmitter.once('completed', this.onPreloaded.bind(this))
    // this.page.initAnimation()
  }

  createCanvas() {
    this.canvas = new Three({
      template: this.template,
      pageEvents: this.pageEvents,
    })
  }

  createPages() {
    switch (this.template) {
      case 'index':
        this.page = new Index({ pageEvents: this.pageEvents })
        break
    }
  }

  onPreloaded() {
    this.onResize()
    this.preloader.destroyPreloader()
    this.page.pageAnimateIn()
  }

  async onPageChange({ url, push = true }) {
    //if (this.canvas) { this.canvas.onChangeStart(this.template) }
    // this.canvas.onChangeStart(this.template)
    await this.page.pageAnimateOut()

    const request = await window.fetch(url)

    if (request.status === 200) {
      const bodyHTMLText = await request.text()
      const fakeHTMLDiv = document.createElement('div')

      if (push) {
        window.history.pushState({}, '', url)
      }

      fakeHTMLDiv.innerHTML = bodyHTMLText

      const realHTMLDiv = fakeHTMLDiv.querySelector('.content')
      this.template = realHTMLDiv.getAttribute('data-template')

      this.navigation.onPageChange(this.template)

      this.content.setAttribute('data-template', this.template)
      if (this.canvas) this.canvas.onChangeEnd(this.template)
      this.content.innerHTML = realHTMLDiv.innerHTML

      this.page = this.pages[this.template]
      this.page.create()
      // this.createLoader()
      this.page.pageAnimationsCheck()
      this.page.pageAnimateIn()
      this.onResize()

      // this.addLinkListeners()
    } else {
      console.log('Access Error', this.request)
    }
  }

  createLoader() {
    each(document.querySelectorAll('img'), (element) => {
      element.src = element.getAttribute('data-src')
    })

    this.onResize()
  }

  onPopState() {
    this.onPageChange({
      url: window.location.pathname,
      push: false,
    })
  }

  onResize() {
    window.requestAnimationFrame((_) => {
      if (this.canvas && this.canvas.onResize) {
        this.canvas.onResize()
      }
    })

    if (this.canvas && this.canvas.resize) {
      this.canvas.resize()
    }

    if (this.page && this.page.onResize) {
      this.page.onResize()
    }
  }

  addLinkListeners() {
    this.linksArray = [
      ...document.querySelectorAll('a'),
      ...document.querySelectorAll('button'),
    ]

    // each(linksArray, (link) => {
    //   link.onclick = (event) => {
    //     event.preventDefault()
    //     const { href } = link
    //     this.onPageChange({ url: href })
    //   }
    // })
  }

  update() {
    if (this.page && this.page.update) {
      this.page.update(this.page.scroll)
    }

    if (this.canvas && this.canvas.update) {
      this.canvas.update(this.page.scroll)
    }

    if (this.cursor && this.cursor.update) {
      this.cursor.update()
    }

    this.frame = window.requestAnimationFrame(this.update.bind(this))

    this.time += 0.5
  }

  onClick(event) {
    if (this.canvas && this.canvas.onClick) {
      this.canvas.onClick(event)
    }
  }

  onTouchDown(event) {
    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(event)
    }

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchDown(event)
    }
  }

  onTouchMove(event) {
    if (this.canvas && this.canvas.onTouchMove) {
      this.canvas.onTouchMove(event)
    }

    if (this.page && this.page.onTouchMove) {
      this.page.onTouchMove(event)
    }

    if (this.cursor && this.cursor.onTouchMove) {
      this.cursor.onTouchMove(event)
    }
  }

  onTouchUp(event) {
    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(event)
    }

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchUp(event)
    }
  }

  onMouseWheel(event) {
    const normalizedWheel = NormalizeWheel(event)

    if (this.page && this.page.onMouseWheel) {
      this.page.onMouseWheel(normalizedWheel, this.page.scroll)
    }
  }

  onMouseEnter(event) {
    if (this.page && this.page.onMouseEnter) {
      this.page.onMouseEnter(event)
    }
  }

  onMouseLeave(event) {
    if (this.page && this.page.onMouseLeave) {
      this.page.onMouseLeave(event)
    }
  }

  addEventListeners() {
    //window.addEventListener('popstate', this.onPopState.bind(this))

    //three events
    window.addEventListener('click', this.onClick.bind(this))
    window.addEventListener('mousewheel', this.onMouseWheel.bind(this))

    window.addEventListener('mousedown', this.onTouchDown.bind(this))
    window.addEventListener('mousemove', this.onTouchMove.bind(this))
    window.addEventListener('mouseup', this.onTouchUp.bind(this))
    // window.addEventListener('mouseenter', this.onMouseEnter.bind(this))
    // window.addEventListener('mouseleave', this.onMouseLeave.bind(this))

    window.addEventListener('touchstart', this.onTouchDown.bind(this))
    window.addEventListener('touchmove', this.onTouchMove.bind(this))
    window.addEventListener('touchend', this.onTouchUp.bind(this))

    window.addEventListener('resize', this.onResize.bind(this))
  }
}

new App()
