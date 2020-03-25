function GameObject (x, y, width, height) {
	//Declare public properties
	this.image = new Image();
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.velocityX = 0;
	this.velocityY = 0;
	this.viewportOffsetX = 0;
	this.viewportOffsetY = 0;
	this.animation;

	//Declare private constants and variables


	//Create functions that need to access private data as public functions


} //end constructor

GameObject.prototype = {
	constructor: GameObject,
	getViewportX: function() {
	  return this.x - this.viewportOffsetX;
	},
	getViewportY: function() {
	  return this.y - this.viewportOffsetY;
	},
	getTop: function() {
	  return this.y;
	},
	getLeft: function() {
	  return this.x;
	},
	getBottom: function() {
	  return this.y + this.height;
	},
	getRight: function() {
	  return this.x + this.width;
	},
	getViewportTop: function() {
	  return this.getViewportY();
	},
	getViewportLeft: function() {
	  return this.getViewportX();
	},
	getViewportBottom: function() {
	  return this.getViewportY() + this.height;
	},
	getViewportRight: function() {
	  return this.getViewportX() + this.width;
	},
	scroll: function(x, y) {
	  this.viewportOffsetX = x;
	  this.viewportOffsetY = y;
	},
	update: function() {
	  //Now update the animation if we have one
	  if (this.animation) {
	    this.animation.update(this.velocityX, this.velocityY);
	  }
	},
	render: function() {
	  //Now, draw the animation, or the still image
	  if (this.animation) {
	    this.animation.render(game.context, this.getViewportX(), this.getViewportY(), this.width, this.height);
	  }
	  else if (this.sourceX && this.sourceY && this.sourceWidth && this.sourceHeight) {
	    game.context.drawImage(this.image, this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight, this.getViewportX(), this.getViewportY(), this.width, this.height);
	  }
	  else {
	    game.context.drawImage(this.image, this.getViewportX(), this.getViewportY(), this.width, this.height);
	  }
	},
}
