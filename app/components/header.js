import GSAP from 'gsap'
import Component from 'classes/component'
import each from 'lodash/each'
import DetectionManager from 'classes/detection'

export default class Header extends Component {
  constructor({ pageEvents, form }) {
    super({
      contentDiv: '.header',
      pageElements: {
        wrapper: '.header__wrapper',
      },
    })
  }

  onResize() {}
}
