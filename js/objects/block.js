function Block (x, y, width, height, type, isCollidable) {
  //Declare public properties
  this.type = type;
  this.isCollidable = isCollidable;
  GameObject.call(this, x, y, width, height);

  //Declare private constants and variables


  //Create functions that need to access private data as public functions
  
} //end constructor

Block.prototype = GameObject.prototype;
Block.prototype.constructor = Block;