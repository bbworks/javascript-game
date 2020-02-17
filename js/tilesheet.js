function TileSheet (image, blockWidth, game) {
  //Declare private constants and variables


  //Declare public variables
  this.image = image;
  this.levelMap;
  this.blockWidth = blockWidth;
  this.map;
  this.blocks = [];
  this.rows = 0;
  this.columns = 0;

  //Declare private variables
  const self = this;

  //Create functions that need to access private data as public functions
  //const Block = function(x, y, width, height, type) {
  //  GameObject.call(x, y, width, height);
  //  this.type = type;
  //}
  //Block.prototype = GameObject.prototype;
  //Block.prototype.constructor = Block;

  this.addLevelMap = function(levelMap) {
    //Set the map
    this.map = levelMap.split("\r\n");
    this.rows = this.map.length;
    this.columns = this.map[0].length;
    this.width = this.columns * this.blockWidth;
    this.height = this.rows * this.blockWidth;

    //Now let's create each non-background object
    var x, y, width, height, block;
    for(var row = 0; row < this.rows; row++) {
      for(var column = 0; column < this.columns; column++) {
        block = this.map[row][column];
        x = column*blockWidth;
        y = row*blockWidth;
        width = this.blockWidth;
        height = this.blockWidth;
        this.blocks.push(new Block(x, y, width, height, block, (block == "." ? false : true)));
      } //end for(column)
    } //end for(row)

    if (this.height > game.viewport.height) {
      game.viewport.baseY = levelHeight-game.viewport.height;
    }
    else {
      game.viewport.baseY = 0;
    }
  };

  this.update = function() {};

  this.render = function() {
    var x, y;
    for(var i in this.blocks) {
      var block = this.blocks[i];
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
      game.context.drawImage(this.image, x, y, this.blockWidth, this.blockWidth, block.getRenderX(), block.getRenderY(), block.width, block.height);
    } //end for

    /*var x;
    var y;

    for(var row = 0; row < this.map.length; row++) {
      for(var column = 0; column < this.map[0].length; column++) {
        var levelMapBlock = this.map[row][column];
          switch (levelMapBlock) {
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
        world.context.drawImage(this.image, x, y, this.blockWidth, this.blockWidth, column*this.blockWidth, row*this.blockWidth, this.blockWidth, this.blockWidth);
      } //end for(column)
    } //end for(row)*/
  };

  this.scroll = function(x, y) {
    for(var i in this.blocks) {
      var block = this.blocks[i];
      block.scroll(x, y);
    }
  };
} //end constructor

TileSheet.prototype = {
  constructor: TileSheet
}
