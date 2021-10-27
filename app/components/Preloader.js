import GSAP from 'gsap'
import Component from 'classes/Component';
import each from 'lodash/each'
import { split } from 'utils/text'

export default class Preloader extends Component{
  constructor(){
    super({
        element: '.preloader',
        elements: {
          title: '.preloader__text',
          number: '.preloader__number',
          numberText: '.preloader__number__text',
          images: document.querySelectorAll('img')
        }
    })

    split({
      element: this.elements.title,
      expression: '<br>'
    })

    split({
      element: this.elements.title,
      expression: '<br>'
    })

    this.elements.titleSpans = this.elements.title.querySelectorAll('span span')
    this.length = 0

    console.log(this.element, this.elements)

    this.createLoader()
  }

  createLoader(){
    each(this.elements.images, element =>{
      element.onload = () => this.onAssetLoaded(element)
      element.src = element.getAttribute('data-src')
    })
  }

  onAssetLoaded(){
    this.length += 1

    //loaded images percentage to create the loading number
    const percent = this.length / this.elements.images.length
    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`

    if(percent === 1){
      this.onLoaded()
    }
  }

  onLoaded(){
    // removed the resolve argument here. Replaced with () to avoid vscode error
    return new Promise(() => {
      this.animateOut = GSAP.timeline({
        delay: 2
      })

      this.animateOut.to(this.elements.titleSpans, {
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.1,
        y: '100%'
      })

      this.animateOut.to(this.elements.numberText, {
        duration: 1.5,
        ease: 'expo.out',
        y: '100%'
      }, '-=1.4')

      this.animateOut.to(this.element, {
        duration: 1.5,
        ease: 'expo.out',
        scaleY: 0,
        transformOrigin: '100% 100%'
      }, '-=1')

      this.animateOut.call( () => {
        this.emit('completed')
      })
    })
  }

  destroy(){
    this.element.parentNode.removeChild(this.element)
  }
}
