import Button from 'classes/Button';
import Page from 'classes/Page';

export default class Home extends Page{
  constructor(){
    super({
      id: 'home',
      element: '.home',
      elements: {
        wrapper: '.home__wrapper',

        navigation: document.querySelector('.navigation'),
        link: '.home__link',
        list: '.home__titles',
        items: '.home__titles__label, .home__titles__title'
      }
    })
  }

  create(){
    super.create()
    this.link = new Button({
      element: this.elements.link
    })
  }

  destroy(){
    super.destroy()
    this.link.removeEventListeners()
  }
}
