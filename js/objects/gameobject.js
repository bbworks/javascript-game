function GameObject (x, y, width, height) {
  //Declare public properties
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.renderX = 0;
  this.renderY = 0;

  //Declare private constants and variables


  //Create functions that need to access private data as public functions


} //end constructor

GameObject.prototype = {
  constructor: GameObject,
  isColliding: function(object) {
    //console.log(this.x, this.y, this.width, this.height);
    //console.log(object.x, object.y, object.width, object.height);
    return (
      (this.y < object.y + object.height) && //mytop < bottom
      (this.y + this.height > object.y) && //mybottom > top
      (this.x < object.x + object.width) && //myleft < right
      (this.x + this.width >  object.x) //myright > left
    )
  },
  scroll: function(x, y) {
    this.renderX = x;
    this.renderY = y;
  },

  getRenderX: function() {
    return this.x - this.renderX;
  },

  getRenderY: function() {
    return this.y - this.renderY;
  },
}
