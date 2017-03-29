var ball;

var vXmin = 3;
var vXmax = 5;
var vYmin = -3;
var vYmax = 3;


var ai;

var player;

var game1 = false;
var game2 = false;
var game3 = false;


var spaceship;
var asteroids = [];

var eaters = [];
var playereater;
var playereateroriginalsize = 15;


function setup() {
	var cnv = createCanvas(800, 600);
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	cnv.position(x, y);
	cnv.id("canvasID");
	background(20, 20, 20);

  	ball = new Ball();
	ai = new AI();
	player = new Player();

	spaceship = new Spaceship();

	playereater = new PlayerEater();
}


function draw(){

	whichGame();

	stroke(50);
	line(0,200,width,200);
	line(0,400,width,400);

	if(game1){
		playGame1();
	}
	else if(game2){
		playGame2();
	}
	else if(game3){
		playGame3();
	}


	
}

function playGame1() {
	noStroke();
	fill(20,20,20,80);
	rect(0,0,width, 200);
	
	ball.update();


	ai.update();
	player.update();
}

function playGame2() {
	noStroke();
	fill(20,20,20,80);
	rect(0, 200, width, 200);

	spaceship.update();

	updateAsteroids();	
	
}

function playGame3() {
	noStroke();
	fill(20,20,20,80);
	rect(0,400,width, 200);

	updateEaters();
	playereater.update();
}




var Ball = function(){

	this.loc = createVector(width/2, 200/2);
	this.vel = createVector(random(vXmin,vXmax), random(vYmin,vYmax));
	this.acc = createVector(0,0);

	// console.log(random(1))
	if(random(1) < 0.5){
		this.vel.x *= -1;
	}  

}

Ball.prototype.bounceX = function() {
	this.vel.x *= -1;
};

Ball.prototype.bounceY = function() {
	this.vel.y *= -1;
};

Ball.prototype.checkBoundaries = function() {
	if(this.loc.y > 200 || this.loc.y < 0){
		this.bounceY();
	}

	if(this.loc.x > width || this.loc.x < 0){
		this.onDeath();
	}
};

Ball.prototype.update = function() {
	this.loc.add(this.vel)

	this.aibounce();
	this.playerbounce();
	this.checkBoundaries();
	this.render();

};

Ball.prototype.render = function() {
	noStroke();

	fill(0,255,255,20);
	for(i =0; i < 10; i++){
		ellipse(this.loc.x+random(-3,3), this.loc.y+random(-3,3), 10,10);
	}

	// fill(0,200,200);
	// ellipse(this.loc.x, this.loc.y, 10,10);


};

Ball.prototype.aibounce = function() {
	if(this.loc.x < ai.x){
		// console.log("bounce")
		if(this.loc.y > ai.y-ai.size/2 && this.loc.y < ai.y+ai.size/2){
			this.bounceX();
		}
	}
};

Ball.prototype.playerbounce = function() {
	if(this.loc.x > player.x){
		// console.log("bounce")
		if(this.loc.y > player.y-ai.size/2 && this.loc.y < player.y+ai.size/2){
			this.bounceX();

			if(keyIsPressed){
				if(keyCode == UP_ARROW){
					this.vel.y -= 2;
				}
				if(keyCode == DOWN_ARROW){
					this.vel.y += 2;
				}
			}
		}
	}


};

Ball.prototype.onDeath = function(first_argument) {
	// this.loc = createVector(width/2, height/2);
	// this.vel = createVector(random(vXmin,vXmax), random(vYmin,vYmax))

	ball = new Ball();
};


////AI

var AI = function(){

	this.x = 20;
	this.y = 200/2;

	this.speed = 1.2;
	this.size = 30;
}

AI.prototype.update = function() {
	if(ball.loc.y < this.y){
		this.y -= this.speed;
	}
	else{
		this.y += this.speed;
	}

	this.render();
};

AI.prototype.render = function() {
	noStroke();
	fill(255,0,0,20);

	for(i =0; i < 10; i++){
		ellipse(this.x+random(-2,2), this.y+random(-2,2), 4, this.size)
	}
	
};
//////////////////Player

var Player = function(){

	this.x = width-20;
	this.y = 200/2;

	this.speed = 1.5;
	this.size = 30;
}

Player.prototype.update = function() {
	if(keyIsPressed === true){
		
		if(keyCode == UP_ARROW && this.y > 0){
			this.y -= this.speed;
		}else if(keyCode == DOWN_ARROW && this.y < 200){
			this.y += this.speed;
		}
	}

	this.render();
};

Player.prototype.render = function() {
	noStroke();
	fill(0,255,0,20);

	for(i =0; i < 10; i++){
		ellipse(this.x+random(-2,2), this.y+random(-2,2), 4, this.size)
	}
	
};


function whichGame(){
	if(mouseX > 0 && mouseX < width){
		if(mouseY < 200){
			game1 = true;
			game2 = false;
			game3 = false;
		}else if(mouseY < 400){
			game1 = false;
			game2 = true;
			game3 = false;
		}
		else if(mouseY < 600){
			game1 = false;
			game2 = false;
			game3 = true;
		}else{
			game1 = false;
			game2 = false;
			game3 = false;
		}
	}else{
		game1 = false;
		game2 = false;
		game3 = false;
	}
}


/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////


function updateAsteroids(){

	if(random(1) < 0.03){
		generateAsteroid();
	}

	asteroids.forEach(function(asteroid){
		asteroid.update();
		asteroid.render();
	})

}

function generateAsteroid(){
	var asteroid = new Asteroid();
	asteroids.push(asteroid);
}

var Asteroid = function(){

	this.loc = createVector(width, random(200,400));
	this.vel = createVector(random(-2,-4), random(-0.5, 0.5));
	this.size = random(10,20);
}

Asteroid.prototype.update = function() {
	this.loc.add(this.vel);
};

Asteroid.prototype.render = function() {
	noFill();
	stroke(255,50);
	strokeWeight(1);
	if(this.loc.y > 200 && this.loc.y < 400){
		for(i =0; i < 5; i++){
			ellipse(this.loc.x + random(-1,1), this.loc.y + random(-1,1), this.size, this.size);
		}
	}
};


var Spaceship = function(){
	this.x = 40;

	this.y = 300;
}

Spaceship.prototype.update = function() {
	if(keyIsPressed){

		if(keyCode == UP_ARROW && this.y > 200){
			this.y -= 1;
		}
		if(keyCode == DOWN_ARROW && this.y < 400){
			this.y += 1;
		}
	}


	this.render();
};

Spaceship.prototype.render = function() {
	noFill();
	stroke(0,255,0,30);
	push();
	rectMode(CENTER);
	for(i =0; i < 10; i++){
		rect(this.x+random(-1,1), this.y+random(-1,1), 30, 12);

		rect(this.x+random(-1,1), this.y+7+random(-1,1), 10, 6);

		rect(this.x+random(-1,1), this.y-7+random(-1,1), 10, 6);

		rect(this.x-15+random(-1,1), this.y+9+random(-1,1), 10, 6);

		rect(this.x-15+random(-1,1), this.y-9+random(-1,1), 10, 6);
	}
	
	pop();
};


/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////



function updateEaters(){

	if(random(1) < 0.03){
		generateEater();
	}

	eaters.forEach(function(eater){
		eater.update();
		eater.render();
	})

}

function generateEater(){

	var eater = new Eater();
	eaters.push(eater);

}

var Eater = function(){

	this.loc = createVector(random(0, width), random(400,600));

	this.vel = createVector(random(-1,1), random(-1, 1));

	this.size = random(2, 30);
	this.rad = this.size/2;


}

Eater.prototype.update = function() {
	this.loc.add(this.vel);

	this.checkNeighbours();
	this.checkBoundaries();
	this.render();

};

Eater.prototype.checkbigness = function() {
	if(this.size > 300){
		resetEaters();
	}
};

Eater.prototype.checkBoundaries = function() {
	if(this.loc.x < 0){
		this.loc.x = width;
	}
	if(this.loc.x > width){
		this.loc.x = 0;
	}
	if(this.loc.y < 400){
		this.loc.y = 600;
	}
	if(this.loc.y > 600){
		this.loc.y = 400;
	}
};

Eater.prototype.checkNeighbours = function() {

	var myEater = this;
	eaters.forEach(function(eater){
		// console.log(myEater);
		if(eater != myEater){
			var x1 = myEater.loc.x;
			var y1 = myEater.loc.y;
			var x2 = eater.loc.x;
			var y2 = eater.loc.y;

			var d = dist(x1,y1,x2,y2);
			// console.log(myEater.size + eater.size)
			if(d < myEater.rad + eater.rad){
				// console.log("EAT")
				myEater.eat(eater);
			}	
		}
	})
};
Eater.prototype.eat = function(other) {
	if(other.rad > this.rad){
		eaters.splice(eaters.indexOf(this),1);
		other.size +=this.size/4;
		other.rad = other.size/2;
		other.vel.mult(0.9);
	}else{
		eaters.splice(eaters.indexOf(other),1);
		this.size += other.size/4;
		this.rad = this.size/2;
		this.vel.mult(0.9);
	}
};

Eater.prototype.render = function() {

	noStroke();
	fill(200,200,0,100);

	for(i =0; i < 3; i++){
		ellipse(this.loc.x+random(-1,1), this.loc.y+random(-1,1), this.size, this.size);
	}
};

var resetEaters = function(){
	eaters = [];
	playereater.size = playereateroriginalsize;
}

var PlayerEater = function(){

	this.loc = createVector(width/2, 500);

	this.vel = createVector(0,0);

	this.size = playereateroriginalsize;
	this.rad = this.size/2
}


PlayerEater.prototype.update = function() {
	if(keyIsPressed){
		if(keyCode == UP_ARROW){
			this.vel.y -= 0.051;
		}
		if(keyCode == DOWN_ARROW){
			this.vel.y += 0.051;
		}
		if(keyCode == LEFT_ARROW){
			this.vel.x -= 0.051;
		}
		if(keyCode == RIGHT_ARROW){
			this.vel.x += 0.051;
		}
	}


	this.vel.mult(0.99);
	this.loc.add(this.vel);

	this.checkNeighbours();
	this.checkBoundaries();
	this.render();


	if(this.size > 300){
		resetEaters();
	}
};

PlayerEater.prototype.checkBoundaries = function() {
	if(this.loc.x < 0){
		this.loc.x = width;
	}
	if(this.loc.x > width){
		this.loc.x = 0;
	}
	if(this.loc.y < 400){
		this.loc.y = 600;
	}
	if(this.loc.y > 600){
		this.loc.y = 400;
	}
};

PlayerEater.prototype.checkNeighbours = function() {

	var myEater = this;
	// console.log(myEater)
	eaters.forEach(function(eater){
		// console.log(eater);
		if(eater != myEater){
			var x1 = myEater.loc.x;
			var y1 = myEater.loc.y;
			var x2 = eater.loc.x;
			var y2 = eater.loc.y;

			var d = dist(x1,y1,x2,y2);
			// console.log(myEater.size + eater.size)
			if(d < myEater.rad + eater.rad){
				// console.log("Within distance")
				// console.log("EAT")
				myEater.eat(eater);
			}	
		}
	})
};

PlayerEater.prototype.render = function() {

	noStroke();
	fill(0,255,0,100);

	for(i =0; i < 3; i++){
		ellipse(this.loc.x+random(-1,1), this.loc.y+random(-1,1), this.size, this.size);
	}
};

PlayerEater.prototype.eat = function(other) {
	// console.log("EATING")
	if(other.rad > this.rad){
		resetEaters();
	}else{
		eaters.splice(eaters.indexOf(other),1);
		this.size += other.size/4;
		this.rad = this.size/2;
		this.vel.mult(0.9);
	}
};
