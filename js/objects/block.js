function Block (image, x, y, width, height, sourceX, sourceY, sourceWidth, sourceHeight, type, isCollidable, game) {
	GameObject.call(this, x, y, width, height, game);

	//Declare public properties
	this.image = image;
	this.sourcePosition = new Position(sourceX, sourceY, sourceWidth, sourceHeight);
	this.type = type;
	this.isCollidable = isCollidable;
} //end constructor

Block.prototype = Object.create(GameObject.prototype);

Block.prototype.constructor = Block;
