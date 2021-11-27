import { Plane, Transform } from 'ogl'
import GSAP from 'gsap'
import map from 'lodash/map'
import Media from './Media'

import Prefix from 'prefix'


export default class {
  constructor({ gl, scene, sizes }){
    this.gl = gl
    this.scene = scene
    this.sizes = sizes

    this.transformPrefix = Prefix('transform')

    this.group = new Transform()

    this.galleryElement = document.querySelector('.collections__gallery')
    this.galleryWrapperElement = document.querySelector('.collections__gallery__wrapper')

    this.titlesElements = document.querySelector('.collections__titles')

    this.collectionsElements = document.querySelectorAll('.collections__article')
    this.collectionsElementsActive = 'collections__article--active'

    this.mediasElements = document.querySelectorAll('.collections__gallery__media')

    this.scroll = {
      current: 0,
      target: 0,
      start: 0,
      lerp: 0.1,
      velocity: 0.5
    }

    this.createGeometry()
    this.createGallery()

    this.group.setParent(this.scene)

    this.show()
  }

  createGeometry(){
    this.geometry = new Plane(this.gl)
  }

  createGallery(){
    this.medias = map(this.mediasElements, (element, index) =>{
      return new Media({
        element,
        geometry: this.geometry,
        index,
        gl: this.gl,
        scene: this.group,
        sizes: this.sizes
      })
    })
  }

  // —————————————————— //
  // ——— ANIMATIONS ——— //
  // —————————————————— //
  show(){
     map(this.medias, media => media.show())
  }
  hide(){
    map(this.medias, media => media.hide())
  }


  // —————————————— //
  // ——— EVENTS ——— //
  // —————————————— //
  onResize(event){
    this.sizes = event.sizes

    this.bounds = this.galleryWrapperElement.getBoundingClientRect()

    this.scroll.last = this.scroll.target = 0

    map(this.medias, media => media.onResize(event, this.scroll))

    this.scroll.limit = this.bounds.width - this.medias[0].element.clientWidth
  }

  onTouchDown({ x, y }){
    this.scroll.last = this.scroll.current
  }

  onTouchMove({ x, y }){
    const distance = x.start - x.end

    this.scroll.target = this.scroll.last - distance
  }

  onTouchUp({ x, y }){

  }

  onWheel({ pixelX, pixelY }){
    this.scroll.target += pixelY
  }

  /**
   *  Changed
   */
  onChange(index){
    this.index = index
    // console.log(this.index)

    const selectedCollection = parseInt(this.mediasElements[this.index].getAttribute('data-index'))

    map(this.collectionsElements, (element, elementIndex) =>{
      if(elementIndex === selectedCollection){
        element.classList.add(this.collectionsElementsActive)
      } else {
        element.classList.remove(this.collectionsElementsActive)
      }
    })

    this.titlesElements.style[this.transformPrefix] = `translateY(-${25 * selectedCollection}%) translate(-50%, -50%)`
  }

  // ———————————— //
  // ——— LOOP ——— //
  // ———————————— //
  update(){
    if (!this.bounds) return

    this.scroll.target = GSAP.utils.clamp(-this.scroll.limit, 0, this.scroll.target)

    this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.lerp)

    this.galleryElement.style[this.transformPrefix] = `translateX(${this.scroll.current}px)`

    if(this.scroll.last < this.scroll.current){
      this.scroll.direction = 'right'
    }else if(this.scroll.last > this.scroll.current){
      this.scroll.direction = 'left'
    }

    this.scroll.last= this.scroll.current

    map(this.medias, media => {
      media.update(this.scroll.current)
    })

    const index = Math.floor(Math.abs(this.scroll.current / this.scroll.limit) * this.medias.length)

    if(this.index !== index){
      this.onChange(index)
    }
  }

  // ——————————————— //
  // ——— DESTROY ———— //
  // ——————————————— //
  destroy(){
    this.scene.removeChild(this.group)
  }

}
