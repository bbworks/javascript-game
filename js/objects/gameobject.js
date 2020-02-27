function GameObject (x, y, width, height) {
  //Declare public properties
  this.image = new Image();
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.viewportOffsetX = 0;
  this.viewportOffsetY = 0;
  this.animation;

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
    this.viewportOffsetX = x;
    this.viewportOffsetY = y;
  },
  getViewportX: function() {
    return this.x - this.viewportOffsetX;
  },
  getViewportY: function() {
    return this.y - this.viewportOffsetY;
  },
  update: function() {
    //Now update the animation if we have one
    if (this.animation) {
      this.animation.update(this.velocityX, this.velocityY);
    }
  },
  render: function() {
    //Now, draw the animation, or the still image
    if (this.animation) {
      this.animation.render(game.context, this.getViewportX(), this.getViewportY(), this.width, this.height);
    }
    else {
      game.context.drawImage(this.image, this.getViewportX(), this.getViewportY(), this.width, this.height);
    }
  },
}
