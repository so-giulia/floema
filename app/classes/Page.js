import GSAP from 'gsap'
import Prefix from 'prefix'
import each from 'lodash/each'
export default class Page{
  constructor({
    element,
    elements = {},
    id
  }){
    this.selector = element
    this.selectorChildren = elements

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 1000
    }

    this.id = id

    this.onMouseWheelEvent = this.onMouseWheel.bind(this)

    this.transformPrefix = Prefix('transform')
  }

  create(){
    this.element = document.querySelector(this.selector)
    this.elements = {}

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0
    }

    each(this.selectorChildren, (entry, key) => {
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)){
        this.elements[key] = entry
      } else {
        this.elements[key] = document.querySelectorAll(entry)

        if(this.elements[key].length === 0){
          this.elements[key] = null
        } else if (this.elements[key].length === 1){
          this.elements[key] = document.querySelector(entry)
        }
      }
    })
  }

  show(){
    // return promise when animation is finalized
    return new Promise(resolve =>{
      this.animateIn = GSAP.timeline()

      this.animateIn.fromTo(this.element, {
        autoAlpha: 0
      }, {
        autoAlpha: 1
      })

      this.animateIn.call( () => {
        this.addEventListeners()
        resolve()
      })
    })
  }

  hide(){
    return new Promise(resolve =>{
      this.removeEventListeners()

      this.animateOut = GSAP.timeline()

      this.animateOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve
      })
    })
  }

  onMouseWheel(evt){
    const { deltaY } = evt
    this.scroll.target += deltaY
  }

  onResize(){
    this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight
  }

  update(){
    this.scroll.target = GSAP.utils.clamp(0, this.scroll.limit, this.scroll.target)
    this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, 0.1)

    if(this.scroll.current < 0.01){
      this.scroll.current = 0
    }

    //check if wrapper exists and then apply the prefixed styles
    if(this.elements.wrapper){
      this.elements.wrapper.style[this.transformPrefix] = `translateY(-${this.scroll.current}px)`
    }
  }

  addEventListeners(){
    window.addEventListener('mousewheel', this.onMouseWheelEvent)
  }

  removeEventListeners(){
    window.addEventListener('mousewheel', this.onMouseWheelEvent)
  }
}
