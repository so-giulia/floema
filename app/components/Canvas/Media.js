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

    // console.log(this.element)

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
    this.bounds = this.element.getBoundingClientRect()

    this.updateScale(sizes)
    this.updateX()
    this.updateY()
    // console.log(this.bounds)
  }

  updateScale({ height, width }){
    this.height = this.bounds.height / window.innerHeight
    this.width = this.bounds.width / window.innerWidth

    this.mesh.scale.y = height * this.width
    this.mesh.scale.x = width * this.width

    this.y = this.bounds.height / window.innerHeight
    this.x = this.bounds.left / window.innerWidth

    console.log(this.x, this.y)

    this.mesh.position.y = (-height / 2) - (this.mesh.scale.y / 2) + (this.y * height)
    this.mesh.position.x = (-width / 2) + (this.mesh.scale.x / 2) + (this.x * width)

    // console.log(this.height, this.width)
  }

  updateX(){

  }
  updateY(){

  }

  onResize(sizes){
    this.createBounds(sizes)
  }
}
