function CollisionSystem (game) {

} //end constructor

CollisionSystem.prototype = {
	constructor: CollisionSystem,
	isColliding: function(object, collidable) {
	  return (
	    (object.getTop() < collidable.getBottom()) &&
	    (object.getBottom() > collidable.getTop()) &&
	    (object.getLeft() < collidable.getRight()) &&
	    (object.getRight() > collidable.getLeft())
	  )
	},
	detectCollision: function(object) {
		if (game.world.object.hasOwnProperty("tilesheet") && game.world.object.tilesheet.hasOwnProperty("blocks")) {
			var blocksArray = game.world.object.tilesheet.blocks;
			for(var i = 0; i < blocksArray.length; i++) {
				var block = blocksArray[i];
				if (block.isCollidable && this.isColliding(object, block)) { //let short-circuiting help here--don't bother checking if we collide with the block if it's not collidable
				 this.respondCollision(object, block);
			 }
			}
		}
	  if (game.world.object.hasOwnProperty("tilesheet") && game.world.object.tilesheet.hasOwnProperty("coins")) {
			var coinsArray = game.world.object.tilesheet.coins;
			for(var i = 0; i < coinsArray.length; i++) {
				var coin = coinsArray[i];
				//console.log(game.world.object.player.x, game.world.object.player.y, coin.x, coin.y);
	      if (this.isColliding(object, coin)) { //let short-circuiting help here--don't bother checking if we collide with the coin if it's not collidable
	        this.respondCollision(object, coin);
			 }
			}
		}
	  if (game.world.object.hasOwnProperty("tilesheet") && game.world.object.tilesheet.hasOwnProperty("platforms")) {
			var platformsArray = game.world.object.tilesheet.platforms;
			for(var i = 0; i < platformsArray.length; i++) {
				var platform = platformsArray[i];
				//console.log(game.world.object.player.x, game.world.object.player.y, platform.x, platform.y);
	      if (this.isColliding(object, platform)) { //let short-circuiting help here--don't bother checking if we collide with the platform if it's not collidable
	        this.respondCollision(object, platform);
			 }
			}
		}
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
	  /*DEBUG*/ //console.log(object.x, object.y, object.width, object.height);
	  /*DEBUG*/ //console.log(collidable.x, collidable.y, collidable.width, collidable.height);

	  //collide with bottom from my top
	  if (
	    object.getTop() < collidable.getBottom() &&
	    object.getTop() - object.velocityY >= collidable.getBottom()
	  ) {
	    object.y = collidable.getBottom();
	    object.velocityY = 0;
	  }
	  //collide with top from my bottom
	  if (
	      object.getBottom() > collidable.getTop() &&
	      object.getBottom() - object.velocityY <= collidable.getTop() - collidable.velocityY
	  ) {
	    object.y = collidable.y - object.height;
	    object.isOnGround = true;
	    object.velocityY = 0;
	  }
	  else {
	    //collide with right from my left
	    if (
	      object.getLeft() < collidable.getRight() &&
	      object.getLeft() - object.velocityX >= collidable.getRight()
	    ) {
	      object.x = collidable.getRight(); //object.getLeft()--but we need to reference the collidable, not the PLAYER
	    }
	    //collide with left from my right
	    if (
	      object.getRight() > collidable.getLeft() &&
	      object.getRight() - object.velocityX <= collidable.getLeft()
	    ) {
	      object.x = collidable.getLeft() - (object.getRight() - object.getLeft() /*object.width*/); //object.getRight()--but we need to reference the collidable, not the PLAYER
	    }
	  } //end else

	  //Now that we're done collding, let's see if we can jump again
	  if (!game.controller.key.up && !game.controller.touch.up && object.isOnGround) {
	    object.canJump = true;
	  }
	},
	collectObject: function(object, collidable) {
	  var coins = game.world.object.tilesheet.coins
	  coins.splice(coins.indexOf(collidable), 1);
	  game.audio.play("coin", false, true);
	},
}
