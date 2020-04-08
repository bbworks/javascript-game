function GameObject (x, y, width, height, game) {
	//Declare public properties
	this.image = new Image();
	this.position = new Position(x, y, width, height)
	this.sourcePosition = null;
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
	update: function() {
	  //Now update the animation if we have one
	  if (this.animation) {
	    this.animation.update(this.velocityX, this.velocityY);
	  }
	},
	render: function() {
	  //Now, draw the animation, or the still image
	  if (this.animation) {
	    this.animation.render(game.context, Math.floor(this.position.getViewportX()), Math.floor(this.position.getViewportY()), this.position.width, this.position.height);
	  }
	  else if (this.sourcePosition) {
		    game.context.drawImage(this.image, this.sourcePosition.x, this.sourcePosition.y, this.sourcePosition.width, this.sourcePosition.height, Math.floor(this.position.getViewportX()), Math.floor(this.position.getViewportY()), this.position.width, this.position.height);
	  }
	  else {
	    game.context.drawImage(this.image, Math.floor(this.position.getViewportX()), Math.floor(this.position.getViewportY()), this.position.width, this.position.height);
	  }
	},
}
