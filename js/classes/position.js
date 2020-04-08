function Position (x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Position.prototype = {
  constructor: Position,
  getTop: function() {return this.y;},
	getLeft: function() {return this.x;},
	getBottom: function() {return this.y + this.height;},
	getRight: function() {return this.x + this.width;},
  getViewportX: function() {return this.x - game.viewport.position.x},
	getViewportY: function() {return this.y - game.viewport.position.y},
	getViewportTop: function() {return this.getViewportY()},
	getViewportLeft: function() {return this.getViewportX()},
	getViewportBottom: function() {return this.getViewportY() + this.height},
	getViewportRight: function() {return this.getViewportX() + this.width},
}
