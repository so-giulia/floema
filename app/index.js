import NormalizeWheel from 'normalize-wheel'

import each from 'lodash/each'

import Canvas from 'components/Canvas'

import Navigation from 'components/Navigation'
import Preloader from 'components/Preloader'

import Home from 'pages/Home'
import About from 'pages/About'
import Collections from 'pages/Collections'
import Detail from 'pages/Detail'

class App{
  constructor(){
    this.createContent()

    this.createPreloader()
    this.createNavigation()
    this.createCanvas()
    this.createPages()

    this.addEventListeners()

    this.addLinkListeners()

    this.update()
  }

  // —————————————— //
  // ——— CREATE ——— //
  // —————————————— //
  createNavigation(){
    this.navigation = new Navigation({
      template: this.template
    })
  }

  createPreloader(){
    this.preloader = new Preloader()
    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

  createCanvas(){
    this.canvas = new Canvas()
  }

  createContent(){
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
  }

  createPages(){
    this.pages = {
      home: new Home(),
      about: new About(),
      collections: new Collections(),
      detail: new Detail()
    }

    this.page = this.pages[this.template]
    this.page.create()
  }

  // —————————————— //
  // ——— EVENTS ——— //
  // —————————————— //
  onPreloaded(){
    this.preloader.destroy()

    this.onResize()

    this.page.show()
  }

  async onChange(url){
    await this.page.hide()
    const request = await window.fetch(url)

    if(request.status === 200){
      const html = await request.text()
      const div = document.createElement('div')

      div.innerHTML = html

      const divContent = div.querySelector('.content')

      this.template = divContent.getAttribute('data-template')

      this.navigation.onChange(this.template)

      this.content.setAttribute('data-template', this.template)
      this.content.innerHTML = divContent.innerHTML

      this.page = this.pages[this.template]
      this.page.create()

      this.onResize()

      this.page.show()

      this.addLinkListeners()
    }else{
      console.log('Error')
    }
  }

  onResize(){
    if(this.page && this.page.onResize){
      this.page.onResize()
    }

    window.requestAnimationFrame( () => {
      if(this.canvas && this.canvas.onResize){
        this.canvas.onResize()
      }
    })
  }

  onTouchDown(event){
    if(this.canvas && this.canvas.onTouchDown){
      this.canvas.onTouchDown(event)
    }
  }
  onTouchMove(event){
    if(this.canvas && this.canvas.onTouchMove){
      this.canvas.onTouchMove(event)
    }
  }
  onTouchUp(event){
    if(this.canvas && this.canvas.onTouchUp){
      this.canvas.onTouchUp(event)
    }
  }

  onWheel(event){
    const normalizedWheel = NormalizeWheel(event)

    if(this.canvas && this.canvas.onWheel){
      this.canvas.onWheel(normalizedWheel)
    }
    if(this.page && this.page.onWheel){
      this.page.onWheel(normalizedWheel)
    }
  }

  // ———————————— //
  // ——— LOOP ——— //
  // ———————————— //
  update(){
    if(this.canvas && this.canvas.update){
      this.canvas.update()
    }
    if(this.page && this.page.update){
      this.page.update()
    }
    this.frame = window.requestAnimationFrame(this.update.bind(this))
  }

  // ————————————————— //
  // ——— LISTENERS ——— //
  // ————————————————— //
  addEventListeners(){
    window.addEventListener('mousewheel', this.onWheel.bind(this))

    window.addEventListener('mousedown', this.onTouchDown.bind(this))
    window.addEventListener('mousemove', this.onTouchMove.bind(this))
    window.addEventListener('mouseup', this.onTouchUp.bind(this))

    window.addEventListener('touchdown', this.onTouchDown.bind(this))
    window.addEventListener('touchmove', this.onTouchMove.bind(this))
    window.addEventListener('touchend', this.onTouchUp.bind(this))

    window.addEventListener('resize', this.onResize.bind(this))
  }

  addLinkListeners(){
    const links = document.querySelectorAll('a')

    each(links, link => {
      link.onclick = event => {
        event.preventDefault()

        const { href } = link
        this.onChange(href)
      }
    })
  }
}

new App()
