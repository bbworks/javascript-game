function Platform (imagePath, x, y, width, height, sourceX, sourceY, sourceWidth, sourceHeight, direction, distance, speed, jumpHeight, gravity, game) {
	MovingObject.call(this, x, y, width, height, speed, jumpHeight, gravity,);

	this.sourcePosition = new Position(sourceX, sourceY, sourceWidth, sourceHeight);
	this.baseX = x;
	this.baseY = y;
	this.direction = direction;
	this.distance = distance;
	this.image.src = imagePath;
} //end constructor

Platform.prototype = Object.create(MovingObject.prototype);

Platform.prototype.constructor = Platform;

Platform.prototype.update = function() {
	if (this.velocityY === 0) {
	  this.velocityY = (this.distance < 0 ? -this.speed: this.speed);
	  this.position.y += this.velocityY;
	}
	if (this.position.y === this.baseY || this.position.y === this.baseY + this.distance) {
	  this.velocityY *= -1;
	}
	this.position.y += this.velocityY;
	GameObject.prototype.update.call(this);
};
