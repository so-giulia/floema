export default class Page{
  constructor(id){
    console.log('Page')

    this.id = id
  }

  create(){
    console.log('Create', this.id)
  }
}
