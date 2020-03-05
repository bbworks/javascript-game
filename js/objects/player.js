function Player (x, y, width, height, speed, game) {
  this.jumpHeight = 10;
  this.gravity = 1;

  MovingObject.call(this, x, y, width, height, speed, this.jumpHeight, this.gravity, game)

  const frames = {
    leftIdle: {x: 115, y: 96, width: 13, height: 16},
    left: [{x: 102, y: 96, width: 13, height: 16},{x: 89, y: 96, width: 13, height: 16},{x: 76, y: 96, width: 13, height: 16},{x: 63, y: 96, width: 13, height: 16}],
    leftUp: {x: 50, y: 96, width: 13, height: 16},
    rightIdle: {x: 0, y: 112, width: 13, height: 16},
    right: [{x: 13, y: 112, width: 13, height: 16},{x: 26, y: 112, width: 13, height: 16},{x: 39, y: 112, width: 13, height: 16},{x: 52, y: 112, width: 13, height: 16}],
    rightUp: {x: 65, y: 112, width: 13, height: 16}
  };
  this.animation = new Animation(this.image, frames, 10, false, game.context);
}

Player.prototype = Object.create(MovingObject.prototype);
Player.prototype.constructor = Player;
