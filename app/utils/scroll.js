export default class ScrollManagement {
  constructor() {
    this.keys = { 37: 1, 38: 1, 39: 1, 40: 1 }
    this.supportsPassive = false
    try {
      window.addEventListener(
        'test',
        null,
        Object.defineProperty({}, 'passive', {
          get: function () {
            this.supportsPassive = false
          },
        })
      )
    } catch (e) {}

    this.wheelOpt = this.supportsPassive ? { passive: false } : false
    this.wheelEvent =
      'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel'

    this.fakePrevent = false
  }

  preventDefault(e) {
    // console.log(e)
    // e.preventDefault()
  }

  preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
      this.preventDefault(e)
      return false
    }
  }

  // modern Chrome requires { passive: false } when adding event

  // call this to Disable
  disableScroll(fake) {
    window.addEventListener('DOMMouseScroll', this.preventDefault, false) // older FF
    window.addEventListener(this.wheelEvent, this.preventDefault, this.wheelOpt) // modern desktop

    //document.addEventListener('touchstart', function(e) {e.preventDefault()}, false);
    //document.addEventListener('touchmove', function(e) {e.preventDefault()}, false);

    window.addEventListener('touchmove', this.preventDefault, this.wheelOpt) // mobile
    window.addEventListener('touchstart', this.preventDefault, this.wheelOpt)
    window.addEventListener('touchend', this.preventDefault, this.wheelOpt)

    window.addEventListener('keydown', this.preventDefaultForScrollKeys, false)
    console.log('Scroll is disabled')
  }

  // call this to Enable
  enableScroll() {
    window.removeEventListener('DOMMouseScroll', this.preventDefault, false)
    window.removeEventListener(
      this.wheelEvent,
      this.preventDefault,
      this.wheelOpt
    )

    window.removeEventListener('touchmove', this.preventDefault, this.wheelOpt)
    window.removeEventListener('touchstart', this.preventDefault, this.wheelOpt)
    window.removeEventListener('touchend', this.preventDefault, this.wheelOpt)

    window.removeEventListener(
      'keydown',
      this.preventDefaultForScrollKeys,
      false
    )
    console.log('Scroll is enabled')
  }
}
