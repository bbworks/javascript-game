function Viewport (x, y, width, height, game) {
	this.position = new Position(x, y, width, height);
} //end constructor

Viewport.prototype = {
	constructor: Viewport,
	isViewable: function(object) {
	  return (
	    (this.position.y < object.position.getBottom()) && //mytop < bottom
	    (this.position.y + this.position.height > object.position.getTop()) && //mybottom > top
	    (this.position.x < object.position.getRight()) && //myleft < right
	    (this.position.x + this.position.width >  object.position.getLeft()) //myright > left
	  )
	},
	update: function() {
	  //Now, let's update our viewport--scrolling the viewport as necessary
	  //If we're hitting the left 200, stay left
	  if (game.world.object.children.player.position.getLeft() < 200) {
	    this.position.x = 0;
	  }
	  //If we're hitting the right 200, stay right
	  else if (game.world.object.children.player.position.getLeft() > game.world.tilesheet.children.level.position.width-200) {
	    this.position.x = game.world.tilesheet.children.level.position.width - this.position.width;
	  }
	  //Otherwise, scroll as necessary
	  else {
	    this.position.x = Math.floor(game.world.object.children.player.position.getLeft()) - 200; //wrap player position in Math.floor() to assure smooth scrolling between pixels--no fractions
	  }

	  //If we go up too high, let's scroll up, otherwise stay at our base
	  if (game.world.object.children.player.position.getTop() <= game.world.tilesheet.children.level.position.height-Math.floor(this.position.height/2-game.world.object.children.player.position.height/2)) {
	    this.position.y = Math.floor(game.world.object.children.player.position.getTop()) - (this.position.height-Math.floor(this.position.height/2-game.world.object.children.player.position.height/2)); //wrap player position in Math.floor() to assure smooth scrolling between pixels--no fractions
	  }
	  else {
	    this.position.y = this.baseY;
	  }
	},
}
