function TileSheet (blockWidth, game) {
	this.image = new Image();
	this.position = new Position();
	this.levelMap;
	this.blockWidth = blockWidth;
	this.map;
	this.blocks = [];
	this.coins = new Container();
	this.platforms = new Container();
	this.rows = 0;
	this.columns = 0;
} //end constructor

TileSheet.prototype.constructor = TileSheet;

TileSheet.prototype.addLevelMap = function(levelMap) {
	//Set the map
	this.map = levelMap.split("\r\n");
	this.rows = this.map.length;
	this.columns = this.map[0].length;
	this.position.width = this.columns * this.blockWidth;
	this.position.height = this.rows * this.blockWidth;
	this.coinAsset = "assets/animated-png-photoshop-2.png";
	this.platformAsset = "assets/NES_-_Super_Mario_Bros_-_Items_Objects_and_NPCs.png"

	//Now let's create each non-background object
	var x, y, width, height, sourceX, sourceY, sourceWidth, sourceHeight, block;
	for(var row = 0; row < this.rows; row++) {
	  for(var column = 0; column < this.columns; column++) {
	    block = this.map[row][column];
	    x = column*this.blockWidth;
	    y = row*this.blockWidth;
	    width = this.blockWidth;
	    height = this.blockWidth;
			sourceX = 112; //sky
			sourceY = 48; //sky
			sourceWidth = this.blockWidth;
			sourceHeight = this.blockWidth;

	    switch (block) {
				//Coin mark
				case "0":
	        this.coins.add(new Coin(this.coinAsset, x, y, width, height, game));
	        this.blocks.push(new Block(this.image, x, y, width, height, sourceX, sourceY, sourceWidth, sourceHeight, ".", false));
	        break;
				//Vertical platform mark
	      case "v":
	        this.platforms.add(new Platform (this.platformAsset, x, y, 16, 8, 65, 129, 16, 8, "vertical", -20, 0.5, null, 0, game));
	        this.blocks.push(new Block(this.image, x, y, width, height, sourceX, sourceY, sourceWidth, sourceHeight, ".", false, game));
	        break;
				//Block marks
	      default:
					switch (block) {
						case "_":
							sourceX = 16;
							sourceY = 0;
							break;
						case "#":
							sourceX = 112;
							sourceY = 0;
							break;
						case "n":
							sourceX = 48;
							sourceY = 0;
							break;
					}
					this.blocks.push(new Block(this.image, x, y, width, height, sourceX, sourceY, sourceWidth, sourceHeight, block, (block === "." ? false : true), game));
	        break;
	    }
	  } //end for(column)
	} //end for(row)

	if (this.position.height > game.viewport.position.height) {
	  game.viewport.baseY = this.position.height-game.viewport.position.height;
	}
	else {
	  game.viewport.baseY = 0;
	}
};

TileSheet.prototype.update = function() {};

TileSheet.prototype.render = function() {
	for(var i in this.blocks) {
	  var block = this.blocks[i];
	  if (game.viewport.isViewable(block)) {
			block.render();
	  } //end if
	} //end for
};
