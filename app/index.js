import Home from 'pages/Home'
import About from 'pages/About'
import Collections from 'pages/Collections'
import Detail from 'pages/Detail'
class App{
  constructor(){
    this.createContent()
    this.createPages()
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
}

new App()
