function MovingObject (x, y, width, height, speed, accel, jumpHeight, gravity, game) {
	GameObject.call(this, x, y, width, height)

	//Declare public properties
	this.speed = speed;
	this.accel = accel;
	this.jumpHeight = 10;
	this.gravity = 1;
	this.isOnGround;
	this.canJump = true; //to implement 1 jump per keypress

	//Declare private constants and variables


	//Create functions that need to access private data as public functions

} //end constructor

MovingObject.prototype = Object.create(GameObject.prototype); //done instead of prototype set so we don't override GameObject.update()/render()

MovingObject.prototype.constructor = MovingObject;

MovingObject.prototype.jump = function() {
	if (this.isOnGround && this.canJump) {
	  this.velocityY = -this.jumpHeight;
	  this.isOnGround = false;
	  this.canJump = false;
		game.audio.play("jump", false, true);
	}
};

MovingObject.prototype.moveLeft = function() {
	//this.velocityX = -this.speed;
	this.velocityX -= this.accel;
	this.capSpeedX();
};

MovingObject.prototype.moveRight = function() {
	//this.velocityX = this.speed;
	this.velocityX += this.accel;
	this.capSpeedX();
};

MovingObject.prototype.capSpeedX = function() {
	if (Math.abs(this.velocityX) > this.speed) {
	  this.velocityX = (this.velocityX > 0 ? this.speed : -this.speed);
	}
};

MovingObject.prototype.stopMovingX = function() {
	if (this.velocityX > 0) {
	  this.velocityX -= this.accel;
	  if (this.velocityX < 0) {
	    this.velocityX = 0;
	  }
	} else if (this.velocityX < 0) {
	  this.velocityX += this.accel;
	  if (this.velocityX > 0) {
	    this.velocityX = 0;
	  }
	}
};

MovingObject.prototype.stopMovingY = function() {
	this.velocityY = 0;
};

MovingObject.prototype.update = function() {
	//Now, update the player position

	//Horizontally--as long as we can, move left
	if (
	  this.x+this.velocityX >= 0 &&
	  this.getRight()+this.velocityX <= game.world.object.tilesheet.width
	) {
	  this.x += this.velocityX;
	}

	//Vertically--apply gravity
	this.velocityY += this.gravity;
	this.y += this.velocityY;
	this.isOnGround = false;

	GameObject.prototype.update.call(this);
};

MovingObject.prototype.render = function() {
	GameObject.prototype.render.call(this);
};
