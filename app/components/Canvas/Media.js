import { Mesh, Program, Texture } from 'ogl'

import fragment from 'shaders/plane-fragments.glsl'
import vertex from 'shaders/plane-vertex.glsl'

export default class{
  constructor({element, geometry, gl, index, scene, sizes}){
    this.element = element
    this.geometry = geometry
    this.gl = gl
    this.index = index
    this.scene = scene
    this.sizes = sizes

    this.createTexture()
    this.createProgram()
    this.createMesh()
  }

  createTexture(){
    this.texture = new Texture(this.gl)

    this.image = new window.Image()
    this.image.crossOrigin = 'anonymous'
    this.image.src = this.element.getAttribute('data-src')
    this.image.onload = () => (this.texture.image = this.image)
  }
  createProgram(){
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        tMap: { value: this.texture }
      }
    })
  }
  createMesh(){
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.mesh.setParent(this.scene)

    this.mesh.scale.x = 2
  }

  createBounds({ sizes }){
    // this.sizes = sizes

    this.bounds = this.element.getBoundingClientRect()

    this.updateScale(sizes)
    this.updateX()
    this.updateY()

    // console.log(this.bounds)
  }


  // ———————————— //
  // ——— LOOP ——— //
  // ———————————— //
  updateScale({ height, width }){
    this.height = this.bounds.height / window.innerHeight
    this.width = this.bounds.width / window.innerWidth

    this.mesh.scale.x = width * this.width
    this.mesh.scale.y = height * this.height

    this.x = this.bounds.left / window.innerWidth
    this.y = this.bounds.top / window.innerHeight

    this.mesh.position.x = (-width / 2) + (this.mesh.scale.x / 2) + (this.x * width)
    this.mesh.position.y = (height / 2) - (this.mesh.scale.y / 2) - (this.y * height)

    console.log(this.mesh.position.x)
  }

  updateX(){

  }

  updateY(){

  }

  // updateX(x = 0){
  //   this.x = (this.bounds.left + x) / window.innerWidth

  //   this.mesh.position.x = (-this.sizes.width / 2) + (this.mesh.scale.x / 2) + (this.x * this.sizes.width)
  // }
  // updateY(y = 0){
  //   this.y = (this.bounds.top + y) / window.innerHeight

  //   this.mesh.position.y = (-this.sizes.height / 2) - (this.mesh.scale.y / 2) + (this.y * this.sizes.height)
  // }

  // update(scroll){
  //   if(!this.bounds) return

  //   this.updateX(scroll)
  //   this.updateY(scroll)
  // }

  // —————————————— //
  // ——— EVENTS ——— //
  // —————————————— //
  onResize(sizes){
    this.createBounds(sizes)
  }

}
