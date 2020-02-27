function MovingObject (x, y, width, height, speed, jumpHeight, gravity, game) {
  GameObject.call(this, x, y, width, height)

  //Declare public properties
  this.speed = speed;
  this.velocityX = 0;
  this.velocityY = 0;
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
  }
};

MovingObject.prototype.moveLeft = function() {
  this.velocityX = -this.speed;
};

MovingObject.prototype.moveRight = function() {
  this.velocityX = this.speed;
};

MovingObject.prototype.moveDown = function() {
  this.velocityY = this.speed;
};

MovingObject.prototype.stopMovingX = function() {
  this.velocityX = 0;
};

MovingObject.prototype.stopMovingY = function() {
  this.velocityY = 0;
};

MovingObject.prototype.update = function() {
  //Now, update the player position

  //Horizontally--as long as we can, move left
  if (
    this.x+this.velocityX >= 0 &&
    this.x+this.width+this.velocityX <= game.world.object.tilesheet.width
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

MovingObject.prototype.collide = function(object) {
  /*DEBUG*/ //console.log(this.x, this.y, this.width, this.height);
  /*DEBUG*/ //console.log(object.x, object.y, object.width, object.height);

  //collide with bottom from my top
  if (
    this.y < object.y + object.height &&
    this.y - this.velocityY >= object.y + object.height
  ) {
    this.y = object.y + object.height;
    this.velocityY = 0;
  }
  //collide with top from my bottom
  if (
      this.y + this.height > object.y &&
      this.y + this.height - this.velocityY <= object.y
  ) {
    this.y = object.y - this.height;
    this.isOnGround = true;
    this.velocityY = 0;
  }
  else {
    //collide with right from my left
    if (
      this.x < object.x + object.width &&
      this.x - this.velocityX >= object.x + object.width
    ) {
      this.x = object.x + object.width;
    }
    //collide with left from my right
    if (
      this.x + this.width > object.x &&
      this.x + this.width - this.velocityX <= object.x
    ) {
      this.x = object.x - this.width;
    }
  } //end else

  if (!game.controller.key.up && !game.controller.touch.up && this.isOnGround) {
    this.canJump = true;
  }
};
