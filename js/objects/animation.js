function Animation (image, frames, context) {
  //Declare public properties
  this.frames = frames;

  //Declare private constants and variables
  var frame;
  var animationDuration = 10;
  var count = 0;
  var frameIndex = 0;
  var lastMovementX;
  var direction;

  //Create functions that need to access private data as public functions
  this.update = function(movementX, movementY) {
    count++;

    //Set a default direction if first instantiating
    if (!direction) {
      direction = "right";
    }

    //If we're currently moving upwards, ALWAYS use
    // the upward frame (and assume the last direction)
    if (movementY < 0) {
      frame = this.frames[direction+"Up"];
    }
    else {
      //If we're moving horizontally AT ALL, do our walking animation
      if (movementX != 0) {
        direction = (movementX < 0) ? "left" : "right";
        if (count > animationDuration) {
          count = count - animationDuration;
          frameIndex = (frameIndex + 1) % this.frames[direction].length;
        }
        frame = this.frames[direction][frameIndex];
      }
      //Otherwise, if we're not moving horizontally,
      // or either down or still veritcally, use the idle frame
      else {
        frame = this.frames[direction+"Idle"];
      }
    }
    lastMovementX = movementX; //save the last movement so we know which direction to face when we stop moving
    //LOGGING //console.log(`X movement: ${movementX}\r\nY movement: ${movementY}\r\nDirection: ${direction}`);
  };

  this.render = function(context, x, y, w, h) {
    context.drawImage(image, frame.x, frame.y, frame.width, frame.height, x, y, w, h);
  };
} //end constructor

Animation.prototype.constructor = {
  constructor: Animation
}
