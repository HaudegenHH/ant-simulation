/* inspired by codewiz 
please visit: http://codewiz.in/code/ */

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const log = console.log
const WIDTH = canvas.width = 300
const HEIGHT = canvas.height = 300

const MAX_ANT_SPEED = 1.5
const MAX_STEER_FORCE = 0.1
const MAX_WANDER_STRENGTH = 0.3
const ANT_COUNT = 2

let foodX = randBetween(20,WIDTH-20)
let foodY = randBetween(20,HEIGHT-20)

let ants = []


/* EventListener for mouse click*/
document.addEventListener('click', e => {
	let rect = e.target.getBoundingClientRect()
  foodX = e.clientX - rect.left
  foodY = e.clientY - rect.top  
  let foodLocation = new Vec(foodX, foodY)
  
  ants.forEach(ant => {
    ant.setSearchPoint(foodLocation)
  })
})


/* Vector class */
class Vec {
	constructor(x, y) {
  	this.x = x
    this.y = y
  }
  add(v){
  	this.x += v.x
  	this.y += v.y
  }
  static sub(v1,v2) {
  	return new Vec(v2.x - v1.x, v2.y - v1.y)
  }
  static mag(v){
  	return Math.sqrt(v.x**2 + v.y**2)
  }
  normalize(){
  	let m = Vec.mag(this)
    if(m != 0) {
    	return new Vec(this.x / m, this.y / m)
    }
  }
  limit(max){
  	if(this.x > max){
    	this.x = max
    }
    if(this.x < -max){
    	this.x = -max
    }
    if(this.y > max){
    	this.y = max
    }
    if(this.y < -max){
    	this.y = -max
    }
  }
  mult(n){
  	this.x *= n
  	this.y *= n
  }
  static mult(vec, n){
  	return new Vec(vec.x * n, vec.y * n)
  }
}

/* Entity nest - starting point for the ants */
class Nest {
	constructor(){
  	this.pos = new Vec(randBetween(20,WIDTH-20), randBetween(20, HEIGHT-20))    
    this.size = 20
  }
  draw() {
  	ctx.beginPath()
    ctx.fillStyle = "grey"
    ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2)
    ctx.fill()    
  }
}


/* Entity Ant */
class Ant {
	constructor(){
  	this.pos = new Vec(nest.pos.x, nest.pos.y)
    this.vel = new Vec(0.3,0)
    this.size   = 5    
    this.bodySize = this.size * 1.2
    this.searchPoint = new Vec(foodX, foodY)
  }
  
  setSearchPoint(p){
  	this.searchPoint = p
  }
  
  draw() {
  	ctx.beginPath()
    ctx.fillStyle = "yellow"
    ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    
    let angle = angleBetween(this.pos.x + this.vel.x, this.pos.y + this.vel.y, this.pos.x, this.pos.y)
    let bodyX = Math.cos(angle) * this.bodySize + this.pos.x
    let bodyY = Math.sin(angle) * this.bodySize + this.pos.y
    
    ctx.beginPath()
    ctx.arc(bodyX, bodyY, this.bodySize, 0, Math.PI * 2)
    ctx.fill()      
    
    ctx.beginPath()
    ctx.fillStyle = "#00ff00"
    ctx.arc(this.searchPoint.x, this.searchPoint.y, 3, 0, Math.PI * 2)
    ctx.fill()
  }
  
  update(){    
  
  	let desiredLocation = Vec.sub(this.pos, this.searchPoint)
    let desiredDirection = desiredLocation.normalize()
    if(desiredDirection != null){    	
    	let desiredSpeed = Vec.mult(desiredDirection, MAX_ANT_SPEED)    
			let steerForce = Vec.sub(this.vel, desiredSpeed)     
      
      steerForce.limit(MAX_STEER_FORCE)
      
      this.vel.add(steerForce)
    }      
    
    this.vel.add(new Vec(randBetween(-MAX_WANDER_STRENGTH, MAX_WANDER_STRENGTH),
    											randBetween(-MAX_WANDER_STRENGTH, MAX_WANDER_STRENGTH)))
    
    this.pos.add(this.vel)    
    
    if(this.pos.x > WIDTH) this.pos.x = 0
    if(this.pos.x < 0) this.pos.x = WIDTH
    if(this.pos.y > HEIGHT) this.pos.y = 0
    if(this.pos.y < 0) this.pos.y = HEIGHT
    
    this.vel.limit(MAX_ANT_SPEED)
  }
}


/* ****************************************************** */
// helper fn 

function randBetween(min, max){
	return Math.random() * (max - min) + min
}

function angleBetween(x1,y1,x2,y2){
	let xDiff = x2 - x1
  let yDiff = y2 - y1
  return Math.atan2(yDiff, xDiff)
}

/* ****************************************************** */
// Instantiating the entities
let nest = new Nest()

for(let i = 0; i < ANT_COUNT; i++) {
	ants.push(new Ant())
}


function animate(){
	ctx.clearRect(0, 0, WIDTH, HEIGHT)
	
  nest.draw()
  
  ants.forEach(ant => {
  	ant.update()
	  ant.draw()  
  })
  
  requestAnimationFrame(animate)
}

animate()
