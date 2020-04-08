function CollisionSystem (game) {
	this.quadtree = new QuadTree(new Position(0,0,game.context.canvas.width,game.context.canvas.height));
} //end constructor

CollisionSystem.prototype = {
	constructor: CollisionSystem,
	isColliding: function(object, collidable) {
	  return (
	    (object.position.getTop() < collidable.position.getBottom()) &&
	    (object.position.getBottom() > collidable.position.getTop()) &&
	    (object.position.getLeft() < collidable.position.getRight()) &&
	    (object.position.getRight() > collidable.position.getLeft())
	  )
	},
	check: function(object) {
		var collisions = this.quadtree.retrieve(object);

		//Check against the TileSheet blocks
		if (game.world.tilesheet.children.level && game.world.tilesheet.children.level.blocks) {
			var blocksArray = game.world.tilesheet.children.level.blocks;
			for(var i = 0; i < blocksArray.length; i++) {
				var block = blocksArray[i];
				if (block.isCollidable && this.isColliding(object, block)) { //let short-circuiting help here--don't bother checking if we collide with the block if it's not collidable
				 this.respondCollision(object, block);
			 }
			}
		}

		//Check against the TileSheet coins
		if (game.world.object.children && game.world.object.children.coins) {
			const self = this;
			var coins = game.world.object.children.coins;
			coins.iterate(function() {
				if (self.isColliding(object, this)) { //let short-circuiting help here--don't bother checking if we collide with the coin if it's not collidable
					self.respondCollision(object, this);
		 		}
			});
		}

		//Check against the TileSheet platforms
	  if (game.world.object.children && game.world.object.children.platforms) {
			const self = this;
			var platforms = game.world.object.children.platforms;
			platforms.iterate(function() {
				if (self.isColliding(object, this)) { //let short-circuiting help here--don't bother checking if we collide with the coin if it's not collidable
					self.respondCollision(object, this);
		 		}
			});
		}

		/*FOR QUADRTREE IMPLEMENTATION WHEN NEEDED*/
		/*for(var i in collisions) {
			var collidingObject = collisions[i];
			if (game.viewport.isViewable(collidingObject) && this.isColliding(object, collidingObject)) { //let short-circuiting help here--don't bother checking if we collide with the coin if it's not collidable
				this.respondCollision(object, collidingObject);
			}
	 	}*/
	},
	respondCollision: function(object, collidable) {
		if (object instanceof MovingObject && (collidable instanceof Block || collidable instanceof Platform)) {
			this.stopMovement(object, collidable);
		}
	  else if (object instanceof MovingObject && collidable instanceof Coin) {
	    this.collectObject(object, collidable);
	  }
	  if (object.collide) {
	    	object.collide();
	  }
	},
	stopMovement: function(object, collidable) {
	  /*DEBUG*/ //console.log(object.position.x, object.position.y, object.position.width, object.position.height);
	  /*DEBUG*/ //console.log(collidable.position.x, collidable.position.y, collidable.position.width, collidable.position.height);

	  //collide with bottom from my top
	  if (
	    object.position.getTop() < collidable.position.getBottom() &&
	    object.position.getTop() - object.velocityY >= collidable.position.getBottom()
	  ) {
	    object.position.y = collidable.position.getBottom();
	    object.velocityY = 0;
	  }
	  //collide with top from my bottom
	  if (
	      object.position.getBottom() > collidable.position.getTop() &&
	      object.position.getBottom() - object.velocityY <= collidable.position.getTop() - collidable.velocityY
	  ) {
	    object.position.y = collidable.position.y - object.position.height;
	    object.isOnGround = true;
	    object.velocityY = 0;
	  }
	  else {
	    //collide with right from my left
	    if (
	      object.position.getLeft() < collidable.position.getRight() &&
	      object.position.getLeft() - object.velocityX >= collidable.position.getRight()
	    ) {
	      object.position.x = collidable.position.getRight(); //object.position.getLeft()--but we need to reference the collidable, not the PLAYER
	    }
	    //collide with left from my right
	    if (
	      object.position.getRight() > collidable.position.getLeft() &&
	      object.position.getRight() - object.velocityX <= collidable.position.getLeft()
	    ) {
	      object.position.x = collidable.position.getLeft() - (object.position.getRight() - object.position.getLeft() /*object.position.width*/); //object.position.getRight()--but we need to reference the collidable, not the PLAYER
	    }
	  } //end else

	  //Now that we're done collding, let's see if we can jump again
	  if (!game.controller.key.up && !game.controller.touch.up && object.isOnGround) {
	    object.canJump = true;
	  }
	},
	collectObject: function(object, collidable) {
	  game.world.tilesheet.children.level.coins.remove(collidable);
	  game.audio.play("coin", false, true);
	},
}
