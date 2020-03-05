function Enemy (x, y, width, height, speed, game) {
  this.jumpHeight = 10;
  this.gravity = 1;

  var counterFrames = 25;
  var counter = counterFrames;

  MovingObject.call(this, x, y, width, height, speed, this.jumpHeight, this.gravity, game)

  const frames = [
    {x: 0, y: 16, width: 16, height: 16},
    {x: 16, y: 16, width: 16, height: 16},
  ];
  this.animation = new Animation(this.image, frames, 10, true, game.context);

  this.update = function() {
    if (this.velocityX == 0) {
      this.velocityX = this.speed;
    }
    if (counter == counterFrames) {
      counter = 0;
      this.velocityX *= -1;
    }
    else {
      counter++;
    }
    MovingObject.prototype.update.call(this);
  }
}

Enemy.prototype = Object.create(MovingObject.prototype);
Enemy.prototype.constructor = Enemy;
