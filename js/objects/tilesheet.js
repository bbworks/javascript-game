function TileSheet (blockWidth, game) {
	this.image = new Image();
	this.levelMap;
	this.blockWidth = blockWidth;
	this.map;
	this.blocks = [];
	this.coins = [];
	this.platforms = [];
	this.rows = 0;
	this.columns = 0;
} //end constructor

TileSheet.prototype.constructor = TileSheet;

TileSheet.prototype.addLevelMap = function(levelMap) {
	//Set the map
	this.map = levelMap.split("\r\n");
	this.rows = this.map.length;
	this.columns = this.map[0].length;
	this.width = this.columns * this.blockWidth;
	this.height = this.rows * this.blockWidth;
	this.coinAsset = "assets/animated-png-photoshop-2.png";
	this.platformAsset = "assets/NES_-_Super_Mario_Bros_-_Items_Objects_and_NPCs.png"

	//Now let's create each non-background object
	var x, y, width, height, block;
	for(var row = 0; row < this.rows; row++) {
	  for(var column = 0; column < this.columns; column++) {
	    block = this.map[row][column];
	    x = column*this.blockWidth;
	    y = row*this.blockWidth;
	    width = this.blockWidth;
	    height = this.blockWidth;
	    switch (block) {
	      case "0":
	        this.coins.push(new Coin(this.coinAsset, x, y, width, height, game));
	        this.blocks.push(new Block(x, y, width, height, ".", false));
	        break;
	      case "v":
	        this.platforms.push(new Platform (this.platformAsset, x, y, 16, 8, 65, 129, 16, 8, "vertical", -20, 0.5, null, 0, game));
	        this.blocks.push(new Block(x, y, width, height, ".", false));
	        break;
	      default:
	        this.blocks.push(new Block(x, y, width, height, block, (block === "." ? false : true)));
	        break;
	    }
	  } //end for(column)
	} //end for(row)

	if (this.height > game.viewport.height) {
	  game.viewport.baseY = this.height-game.viewport.height;
	}
	else {
	  game.viewport.baseY = 0;
	}
};

TileSheet.prototype.update = function() {
	for(var i in this.coins) {
	  var coin = this.coins[i];
	  coin.update();
	}
	for(var i in this.platforms) {
	  this.platforms[i].update();
	}
};

TileSheet.prototype.render = function() {
	var x, y;
	for(var i in this.blocks) {
	  var block = this.blocks[i];
	  if (game.viewport.isViewable(block)) {
	    switch (block.type) {
	      case ".":
	        x = 112;
	        y = 48;
	        break;
	      case "_":
	        x = 16;
	        y = 0;
	        break;
	      case "#":
	        x = 112;
	        y = 0;
	        break;
	      case "n":
	        x = 48;
	        y = 0;
	        break;
	    }
	    game.context.drawImage(this.image, x, y, this.blockWidth, this.blockWidth, block.getViewportX(), block.getViewportY(), block.width, block.height);
	  } //end if
	} //end for

	for(var i in this.coins) {
	  var coin = this.coins[i];
	  if (game.viewport.isViewable(coin)) {
	    coin.render();
	  }
	}

	for(var i in this.platforms) {
	  var platform = this.platforms[i];
	  if (game.viewport.isViewable(platform)) {
	    platform.render();
	  }
	}
};

TileSheet.prototype.scroll = function(x, y) {
	for(var i in this.blocks) {
	  var block = this.blocks[i];
	  block.scroll(x, y);
	}
	for(var i in this.coins) {
	  var coin = this.coins[i];
	  coin.scroll(x, y);
	}
	for(var i in this.platforms) {
	  var platform = this.platforms[i];
	  platform.scroll(x, y);
	}
};
