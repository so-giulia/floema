import GSAP from 'gsap'
import Prefix from 'prefix'
import each from 'lodash/each'
import map from 'lodash/map'

import Highlight from 'animations/Highlight'
import Title from 'animations/Title'
import Paragraph from 'animations/Paragraph'
import Label from 'animations/Label'

import { ColorsManager } from 'classes/Colors'
import AsyncLoad from 'classes/AsyncLoad'

export default class Page{
  constructor({
    element,
    elements = {},
    id
  }){
    this.selector = element
    this.selectorChildren = {
      animationsHighlights: '[data-animation="highlight"]',
      animationsTitles: '[data-animation="title"]',
      animationsParagraphs: '[data-animation="paragraph"]',
      animationsLabels: '[data-animation="label"]',

      preloaders: '[data-src]'
    }
    this.elements = Object.assign(this.selectorChildren, elements)

    this.id = id

    this.transformPrefix = Prefix('transform')

    this.onMouseWheelEvent = this.onMouseWheel.bind(this)
  }

  create(){
    console.log(this.elements.wrapper)
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

    this.createAnimations()
    this.createPreloader()
  }

  // —————————————————— //
  // ——— ANIMATIONS ——— //
  // —————————————————— //
  createAnimations(){
    this.animations = []

    // Highlights
     this.animationsHighlights = map(this.elements.animationsHighlights, element => {
      return new Highlight({
        element
      })
    })
    this.animations.push(...this.animationsHighlights)

    // Titles
    this.animationsTitles = map(this.elements.animationsTitles, element => {
      return new Title({
        element
      })
    })
    this.animations.push(...this.animationsTitles)

    // Paragraphs
    this.animationsParagraphs = map(this.elements.animationsParagraphs, element => {
      return new Paragraph({
        element
      })
    })
    this.animations.push(...this.animationsParagraphs)

    // Labels
    this.animationsLabels = map(this.elements.animationsLabels, element => {
      return new Label({
        element
      })
    })
    this.animations.push(...this.animationsLabels)
  }

  createPreloader(){
    this.preloaders = map(this.elements.preloaders, element => {
      return new AsyncLoad({element})
    })
  }

  show(){
    ColorsManager.change({
      backgroundColor: this.element.getAttribute('data-background'),
      color: this.element.getAttribute('data-color')
    })
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
      this.destroy()

      this.animateOut = GSAP.timeline()

      this.animateOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve
      })
    })
  }

  // —————————————— //
  // ——— EVENTS ——— //
  // —————————————— //
  onMouseWheel(evt){
    const { deltaY } = evt
    this.scroll.target += deltaY
  }

  onResize(){
    this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight

    each(this.animations, animation => animation.onResize())
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

  // ————————————————— //
  // ——— LISTENERS ——— //
  // ————————————————— //
  addEventListeners(){
    window.addEventListener('mousewheel', this.onMouseWheelEvent)
  }

  removeEventListeners(){
    window.addEventListener('mousewheel', this.onMouseWheelEvent)
  }

  // ——————————————— //
  // ——— DESTROY ——— //
  // ——————————————— //
  destroy(){
    this.removeEventListeners()
  }
}
