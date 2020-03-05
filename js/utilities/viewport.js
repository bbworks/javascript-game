function Viewport (x, y, width, height, game) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
} //end constructor

Viewport.prototype = {
  constructor: Viewport,
  isViewable: function(object) {
    return (
      (this.y < object.getBottom()) && //mytop < bottom
      (this.y + this.height > object.getTop()) && //mybottom > top
      (this.x < object.getRight()) && //myleft < right
      (this.x + this.width >  object.getLeft()) //myright > left
    )
  },
  update: function() {
    //Now, let's update our viewport--scrolling the viewport as necessary
    //If we're hitting the left 200, stay left
    if (game.world.object.player.getLeft() < 200) {
      this.x = 0;
    }
    //If we're hitting the right 200, stay right
    else if (game.world.object.player.getLeft() > game.world.object.tilesheet.width-200) {
      this.x = game.world.object.tilesheet.width - this.width;
    }
    //Otherwise, scroll as necessary
    else {
      this.x = Math.floor(game.world.object.player.getLeft()) - 200; //wrap player position in Math.floor() to assure smooth scrolling between pixels--no fractions
    }

    //If we go up too high, let's scroll up, otherwise stay at our base
    if (game.world.object.player.getTop() <= game.world.object.tilesheet.height-Math.floor(this.height/2-game.world.object.player.height/2)) {
      this.y = Math.floor(game.world.object.player.getTop()) - (this.height-Math.floor(this.height/2-game.world.object.player.height/2)); //wrap player position in Math.floor() to assure smooth scrolling between pixels--no fractions
    }
    else {
      this.y = this.baseY;
    }
  },
}
