// import { random } from 'gsap/all'
import { Mesh, Program } from 'ogl'

import GSAP from 'gsap'

import fragment from 'shaders/home-fragment.glsl'
import vertex from 'shaders/home-vertex.glsl'

export default class{
  constructor({element, geometry, gl, index, scene, sizes}){
    this.element = element
    this.geometry = geometry
    this.gl = gl
    this.index = index
    this.scene = scene
    this.sizes = sizes

    this.extra = {
      x: 0,
      y: 0
    }

    this.createTexture()
    this.createProgram()
    this.createMesh()
    this.onResize({
      sizes: this.sizes
    })
  }

  createTexture(){
    const image = this.element

    this.texture = window.TEXTURES[image.getAttribute('data-src')]
  }
  createProgram(){
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        tMap: { value: this.texture },
        uAlpha: { value: 0 },
        uSpeed: { value: 0 },
        uViewportSizes: { value: [this.sizes.width, this.sizes.height]}
      }
    })
  }
  createMesh(){
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.mesh.setParent(this.scene)
    this.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03)
  }

  createBounds({ sizes }){
    this.sizes = sizes

    this.bounds = this.element.getBoundingClientRect()

    this.updateScale()
    this.updateX()
    this.updateY()
  }

  // —————————————————— //
  // ——— ANIMATIONS ——— //
  // —————————————————— //

  show(){
    GSAP.fromTo(this.program.uniforms.uAlpha, {
      value: 0
    }, {
      value: 0.4
    })
  }

  hide(){
    GSAP.to(this.program.uniforms.uAlpha, {
      value: 0
    })
  }

  // —————————————— //
  // ——— EVENTS ——— //
  // —————————————— //
  onResize(sizes, scroll){
    this.extra = {
      x: 0,
      y: 0
    }

    this.createBounds(sizes)
    this.updateX(scroll && scroll.x)
    this.updateY(scroll && scroll.y)
  }


  // ———————————— //
  // ——— LOOP ——— //
  // ———————————— //
  updateScale(){
    this.height = this.bounds.height / window.innerHeight
    this.width = this.bounds.width / window.innerWidth

    this.mesh.scale.x = this.sizes.width * this.width
    this.mesh.scale.y = this.sizes.height * this.height
  }

  updateX(x = 0){
    this.x = (this.bounds.left + x) / window.innerWidth
    this.mesh.position.x = (-this.sizes.width / 2) + (this.mesh.scale.x / 2) + (this.x * this.sizes.width) + this.extra.x
  }

  updateY(y = 0){
    this.y = (this.bounds.top + y) / window.innerHeight
    this.mesh.position.y = (this.sizes.height / 2) - (this.mesh.scale.y / 2) - (this.y * this.sizes.height) + this.extra.y
  }

  update(scroll, speed){
    this.updateX(scroll.x)
    this.updateY(scroll.y)

    this.program.uniforms.uSpeed.value = speed
  }
}
