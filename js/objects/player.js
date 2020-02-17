function Player (x, y, width, height, speed, crop, context) {
  GameObject.call(this, x, y, width, height)

  this.image = new Image();
  this.x = this.x-crop;
  this.y = this.y+crop;
  this.renderX = 0;
  this.renderY = 0;
  this.speed = speed;
  this.velocityX = 0;
  this.velocityY = 0;
  this.gravity = 1;
  this.jumpHeight = 10;

  var isJumping = false;
  var isOnGround;

  const frames = {
    leftIdle: {x: 115, y: 96, width: 13, height: 16},
    left: [{x: 102, y: 96, width: 13, height: 16},{x: 89, y: 96, width: 13, height: 16},{x: 76, y: 96, width: 13, height: 16},{x: 63, y: 96, width: 13, height: 16}],
    leftUp: {x: 50, y: 96, width: 13, height: 16},
    rightIdle: {x: 0, y: 112, width: 13, height: 16},
    right: [{x: 13, y: 112, width: 13, height: 16},{x: 26, y: 112, width: 13, height: 16},{x: 39, y: 112, width: 13, height: 16},{x: 52, y: 112, width: 13, height: 16}],
    rightUp: {x: 65, y: 112, width: 13, height: 16}
  };
  this.animation = new Animation(this.image, frames, 10, 8, 16, 16, context);
  this.moveLeft = function() {
    this.velocityX = -this.speed;
  };
  this.jump = function() {
    if (!isJumping && isOnGround) {
      this.velocityY = -this.jumpHeight;
      isJumping = true;
      isOnGround = false;
    }
  };
  this.moveRight = function() {
    this.velocityX = this.speed;
  };
  this.moveDown = function() {
    this.velocityY = this.speed;
  };
  this.stopMovingX = function() {
    this.velocityX = 0;
  };
  this.stopMovingY = function() {
    this.velocityY = 0;
  };
  this.update = function(event) {
    //First, update the player position

    //As long as we can, move left or right
    if (
      this.x+this.velocityX+crop >= 0
//      && this.x+this.width+this.velocityX-crop <= context.canvas.width
    ) {
      this.x += this.velocityX;
    }
    /*//If we hit the top, start to fall instead
    if (this.y+this.velocityY-crop < crop) {
      this.y = -crop+1;
      this.velocityY = 0;
    }
    //Otherwise, if we hit the bottom, stop falling
    else if (this.y+this.height+this.velocityY+crop > context.canvas.height-16) {
      this.y = context.canvas.height-this.height+crop-16-1;
      isJumping = false;
      this.velocityY = 0;
    }
    //Otherwise, if we're falling, let's apply gravity
    else {
      if (isJumping) {
        this.velocityY += this.gravity;
      }
      this.y += this.velocityY;
    }*/
    //If we're falling, let's apply gravity
    //if (isJumping) {
      this.velocityY += this.gravity;
    //}
    this.y += this.velocityY;
    isOnGround = false;
    //console.log(`${isJumping} ${this.y} ${this.velocityY}`)

    //Now update the animation
    this.animation.update(this.velocityX, this.velocityY);
  };

  this.render = function() {
    //context.drawImage(this.image, this.x, this.y, this.width, this.height);
    this.animation.render(context, this.getRenderX(), this.getRenderY(), this.width, this.height);
    //context.drawImage(this.image, this.x--, this.y, this.width, this.height);
  };

  this.collide = function(object) {
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
      isJumping = false;
      isOnGround = true;
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
  };
}

Player.prototype = GameObject.prototype;
Player.prototype.constructor = Player;
